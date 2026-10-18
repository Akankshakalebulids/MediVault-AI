import pytest
from fastapi.testclient import TestClient
from ml.api import app

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["modelLoaded"] is True

def test_model_info():
    res = client.get("/api/v1/model-info")
    assert res.status_code == 200
    data = res.json()
    assert "trainingDataset" in data
    assert "Random Forest" in data["model"]

def test_predict_low_risk():
    payload = {
        "pregnancies": 0,
        "glucose": 85.0,
        "bloodPressure": 70.0,
        "skinThickness": 15.0,
        "insulin": 45.0,
        "bmi": 21.5,
        "diabetesPedigreeFunction": 0.20,
        "age": 22
    }
    res = client.post("/api/v1/predict/diabetes", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "riskScore" in data
    assert "riskPercentage" in data
    assert data["riskLevel"] in ["Low Risk", "Moderate Risk", "Elevated Risk"]
    assert data["isDiagnostic"] is False
    assert "IMPORTANT MEDICAL NOTICE" in data["disclaimer"]

def test_predict_elevated_risk():
    payload = {
        "pregnancies": 4,
        "glucose": 185.0,
        "bloodPressure": 92.0,
        "skinThickness": 38.0,
        "insulin": 210.0,
        "bmi": 36.4,
        "diabetesPedigreeFunction": 1.15,
        "age": 55
    }
    res = client.post("/api/v1/predict/diabetes", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["riskScore"] > 0.40  # Should be elevated or moderate
    assert len(data["contributingFactors"]) > 0

def test_input_validation():
    # Out of range glucose (< 40)
    bad_payload = {
        "pregnancies": 1,
        "glucose": 15.0,
        "bloodPressure": 70.0,
        "bmi": 22.0,
        "age": 25
    }
    res = client.post("/api/v1/predict/diabetes", json=bad_payload)
    assert res.status_code == 422  # Pydantic Unprocessable Entity
