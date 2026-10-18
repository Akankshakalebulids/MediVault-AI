# MediVault AI — Machine Learning (SMLD) Component

**Project**: Intelligent Healthcare Management & Diabetes Risk Screening Platform  
**Academic Module**: SMLD (Machine Learning / Data Science)

---

## 1. Overview
The SMLD component delivers an educational diabetes risk-screening workflow using real clinical data, disciplined preprocessing, baseline benchmarking, and probabilistic inference via FastAPI.

---

## 2. Dataset Attribution
- **Dataset**: Pima Indians Diabetes Database (NIDDK, Bethesda, MD)
- **Rows/Features**: 768 patient samples, 8 clinical features, 1 binary outcome (`0` = non-diabetic, `1` = diabetic).
- **Features**: `Pregnancies`, `Glucose`, `BloodPressure`, `SkinThickness`, `Insulin`, `BMI`, `DiabetesPedigreeFunction`, `Age`.
- **Reference**: National Institute of Diabetes and Digestive and Kidney Diseases; see `ml/data/DATASET_METADATA.md` for full data dictionary and demographic discussion.

---

## 3. Workflow & Preprocessing
1. **Handling Biological Implausibility**:
   - Zero-values in `Glucose`, `BloodPressure`, `SkinThickness`, `Insulin`, and `BMI` are physiologically impossible in living patients (e.g. 0 fasting glucose or 0 BMI).
   - These are mapped to `np.nan` and imputed via `SimpleImputer(strategy='median')` fitted exclusively on training splits to prevent data leakage.
2. **Feature Normalization**:
   - All features are standard-scaled (`StandardScaler`) within an integrated Scikit-Learn `Pipeline`.
3. **Data Splitting**:
   - 80% train / 20% test split stratified by the target label (`stratify=y`, `random_state=42`).

---

## 4. Model Benchmarking Results

| Model | Accuracy | Precision | Recall | F1-Score | ROC-AUC |
|---|---|---|---|---|---|
| **Dummy Baseline** | 64.94% | 0.00% | 0.00% | 0.0000 | 0.5000 |
| **Logistic Regression** | 70.78% | 60.00% | 50.00% | 0.5455 | 0.8130 |
| **Decision Tree** | 76.62% | 65.00% | 72.22% | 0.6842 | 0.7840 |
| **Random Forest** *(Selected)* | 74.03% | 66.67% | 51.85% | 0.5833 | **0.8167** |

*Artifacts generated in `ml/reports/`:*
- `metrics.json`: Machine-readable results
- `confusion_matrix.png`: Confusion matrix visualization
- `roc_curve.png`: ROC comparison curves
- `feature_importance.png`: Predictor importance rankings
- `evaluation_report.md`: Detailed clinical analysis and viva defense notes

---

## 5. How to Run

### Reproduce Training & Evaluation:
```bash
python ml/src/train_models.py
```

### Launch FastAPI Inference Service:
```bash
python -m uvicorn ml.api:app --reload --host 127.0.0.1 --port 8000
```
API Documentation will be live at: `http://localhost:8000/docs`

---

## 6. Medical Safety & Academic Disclaimer
This machine learning component is designed strictly for educational risk stratification and academic viva demonstration. It is not an FDA/CE-approved medical device, does not provide medical diagnoses, and must never be used to initiate, terminate, or alter medications.
