"""
MediVault AI — Diabetes Risk Screening FastAPI Service
Academic Component: SMLD & WMAD REST API Integration

Provides:
- GET  /health
- GET  /api/v1/model-info
- POST /api/v1/predict/diabetes
"""

import os
import json
from typing import Dict, Any, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
import joblib
import pandas as pd
import numpy as np

app = FastAPI(
    title="MediVault AI — Diabetes Risk Screening API",
    description="Educational Clinical Machine Learning Inference Service for MediVault AI",
    version="1.0.0"
)

# Enable CORS for Web and Mobile development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Trained Model Pipeline and Evaluation Metrics
BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "models", "diabetes_pipeline.joblib")
METRICS_PATH = os.path.join(BASE_DIR, "reports", "metrics.json")

model_pipeline = None
model_metadata = {}

def get_model():
    global model_pipeline, model_metadata
    if model_pipeline is None:
        if os.path.exists(MODEL_PATH):
            model_pipeline = joblib.load(MODEL_PATH)
        else:
            model_pipeline = None
    if not model_metadata and os.path.exists(METRICS_PATH):
        try:
            with open(METRICS_PATH, "r") as f:
                model_metadata = json.load(f)
        except Exception:
            model_metadata = {}
    return model_pipeline

class DiabetesScreeningInput(BaseModel):
    pregnancies: int = Field(0, ge=0, le=25, description="Number of times pregnant")
    glucose: float = Field(..., ge=40, le=300, description="Fasting / 2-hour plasma glucose in mg/dL")
    bloodPressure: float = Field(..., ge=30, le=180, description="Diastolic blood pressure in mm Hg")
    skinThickness: float = Field(20.0, ge=0, le=100, description="Triceps skin fold thickness in mm")
    insulin: float = Field(80.0, ge=0, le=900, description="2-Hour serum insulin in mu U/ml")
    bmi: float = Field(..., ge=10.0, le=70.0, description="Body Mass Index in kg/m^2")
    diabetesPedigreeFunction: float = Field(0.47, ge=0.05, le=3.0, description="Diabetes pedigree genetic score")
    age: int = Field(..., ge=18, le=120, description="Patient age in years")

class RiskFactor(BaseModel):
    name: str
    value: str
    status: str  # "Normal", "Elevated", "High"
    clinical_note: str

class DiabetesScreeningResponse(BaseModel):
    riskScore: float = Field(..., description="Calculated model probability (0.0 to 1.0)")
    riskPercentage: float = Field(..., description="Probability expressed as percentage (0 to 100%)")
    riskLevel: str = Field(..., description="Risk category: Low Risk, Moderate Risk, Elevated Risk")
    riskColor: str = Field(..., description="UI accent color token")
    modelVersion: str
    modelAlgorithm: str
    contributingFactors: List[RiskFactor]
    disclaimer: str
    isDiagnostic: bool = False

@app.get("/health")
def health_check():
    pipe = get_model()
    return {
        "status": "healthy",
        "service": "MediVault AI - Diabetes Risk Screening",
        "modelLoaded": pipe is not None,
        "selectedModel": model_metadata.get("selected_model", "Random Forest")
    }

@app.get("/api/v1/model-info")
def get_model_info():
    pipe = get_model()
    if not pipe:
        raise HTTPException(status_code=503, detail="Model pipeline not yet trained or loaded.")
    return {
        "status": "active",
        "model": model_metadata.get("selected_model", "Random Forest Classifier"),
        "trainingDataset": "Pima Indians Diabetes Database (NIDDK)",
        "features": model_metadata.get("feature_columns", []),
        "evaluation": model_metadata.get("models_evaluated", {}),
        "disclaimer": "This ML model is for educational risk stratification and is not a diagnostic device."
    }

@app.post("/api/v1/predict/diabetes", response_model=DiabetesScreeningResponse)
def predict_diabetes_risk(data: DiabetesScreeningInput):
    pipe = get_model()
    if pipe is None:
        raise HTTPException(
            status_code=503,
            detail="Trained ML model pipeline is currently unavailable. Please run train_models.py."
        )

    # Prepare DataFrame matching feature columns
    features = pd.DataFrame([{
        'Pregnancies': data.pregnancies,
        'Glucose': data.glucose,
        'BloodPressure': data.bloodPressure,
        'SkinThickness': data.skinThickness if data.skinThickness > 0 else np.nan,
        'Insulin': data.insulin if data.insulin > 0 else np.nan,
        'BMI': data.bmi,
        'DiabetesPedigreeFunction': data.diabetesPedigreeFunction,
        'Age': data.age
    }])

    # Predict Probability
    try:
        proba = float(pipe.predict_proba(features)[0][1])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

    risk_pct = round(proba * 100, 1)

    # Risk Tier Stratification
    if proba < 0.30:
        risk_level = "Low Risk"
        risk_color = "#087F5B"  # Primary Emerald
    elif proba < 0.60:
        risk_level = "Moderate Risk"
        risk_color = "#D97706"  # Warning Amber
    else:
        risk_level = "Elevated Risk"
        risk_color = "#D9383A"  # Accessible Red

    # Analyze clinical contributing factors
    factors = []
    if data.glucose >= 140:
        factors.append(RiskFactor(
            name="Plasma Glucose",
            value=f"{data.glucose:.0f} mg/dL",
            status="High" if data.glucose >= 200 else "Elevated",
            clinical_note="Fasting or challenge glucose is above standard normoglycemic thresholds (70-125 mg/dL)."
        ))
    else:
        factors.append(RiskFactor(
            name="Plasma Glucose",
            value=f"{data.glucose:.0f} mg/dL",
            status="Normal",
            clinical_note="Within expected normoglycemic boundary."
        ))

    if data.bmi >= 30.0:
        factors.append(RiskFactor(
            name="Body Mass Index (BMI)",
            value=f"{data.bmi:.1f} kg/m²",
            status="Elevated",
            clinical_note="BMI indicates obesity range, a known statistical correlate of insulin resistance."
        ))
    elif data.bmi >= 25.0:
        factors.append(RiskFactor(
            name="Body Mass Index (BMI)",
            value=f"{data.bmi:.1f} kg/m²",
            status="Moderate",
            clinical_note="BMI indicates overweight category."
        ))

    if data.bloodPressure >= 90:
        factors.append(RiskFactor(
            name="Diastolic Blood Pressure",
            value=f"{data.bloodPressure:.0f} mm Hg",
            status="Elevated",
            clinical_note="Diastolic reading exceeds standard guideline limits (>80-89 mm Hg)."
        ))

    if data.age >= 45:
        factors.append(RiskFactor(
            name="Age Factor",
            value=f"{data.age} years",
            status="Elevated",
            clinical_note="Age >45 is a recognized epidemiological risk factor in prediabetes screening guidelines."
        ))

    if data.diabetesPedigreeFunction >= 0.8:
        factors.append(RiskFactor(
            name="Genetic Pedigree Score",
            value=f"{data.diabetesPedigreeFunction:.2f}",
            status="Elevated",
            clinical_note="Elevated pedigree score reflects higher documented hereditary family history."
        ))

    return DiabetesScreeningResponse(
        riskScore=round(proba, 4),
        riskPercentage=risk_pct,
        riskLevel=risk_level,
        riskColor=risk_color,
        modelVersion="1.0.0 (Scikit-Learn Pipeline)",
        modelAlgorithm=model_metadata.get("selected_model", "Random Forest Classifier"),
        contributingFactors=factors,
        disclaimer=(
            "IMPORTANT MEDICAL NOTICE: This risk screening prediction is generated by an educational "
            "machine-learning model trained on the Pima Indians Diabetes dataset. It is strictly an "
            "informational screening prototype and is NOT a medical diagnosis, clinical opinion, or "
            "treatment guideline. If you have concerns about diabetes or metabolic health, please consult "
            "a certified healthcare provider or endocrinologist."
        ),
        isDiagnostic=False
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
