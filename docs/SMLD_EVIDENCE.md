# MediVault AI — Statistical Machine Learning & Data Science (SMLD) Report

**Course**: SMLD (Machine Learning / Data Science)  
**Component**: Educational Diabetes Risk Screening ML Pipeline  
**Model Serving**: FastAPI REST Endpoint  
**Author**: Third-Year CS & Data Science Student  

---

## 1. Problem Formulation & Dataset Attribution
Diabetes mellitus is a chronic metabolic disorder characterised by persistent hyperglycemia. Early non-invasive screening can stratify individuals into risk categories to encourage preventative clinical testing (HbA1c / OGTT).

- **Benchmark Dataset**: Pima Indians Diabetes Database (National Institute of Diabetes and Digestive and Kidney Diseases - NIDDK).
- **Sample Size**: 768 patient records with 8 continuous/discrete clinical attributes and 1 binary label (`Outcome`: `0` = non-diabetic, `1` = diabetic).
- **Target Distribution**: Non-diabetic (65.1%), Diabetic (34.9%).

---

## 2. Preprocessing & Data Leakage Prevention

1. **Handling Physiologically Implausible Zero Values**:
   - In biological systems, a fasting glucose of 0 mg/dL or a BMI of 0 kg/m² indicates missing data rather than genuine zero readings.
   - Identified missing measurements:
     - `Insulin`: 374 cases (48.7%)
     - `SkinThickness`: 227 cases (29.6%)
     - `BloodPressure`: 35 cases (4.6%)
     - `BMI`: 11 cases (1.4%)
     - `Glucose`: 5 cases (0.7%)
   - These values were converted to `np.nan` and imputed using `SimpleImputer(strategy='median')`.
2. **Preventing Leakage**:
   - The dataset was partitioned via a **stratified split** (80% train, 20% test, `random_state=42`) *before* fitting any imputer or standard scaler.
   - The preprocessing transformations were encapsulated in a Scikit-Learn `Pipeline` fitted exclusively on training folds.

---

## 3. Candidate Models & Empirical Results

We benchmarked four candidate model architectures on the identical test split ($N = 154$):

| Model Architecture | Accuracy | Precision | Recall | F1-Score | ROC-AUC | 5-Fold CV ROC-AUC |
|---|---|---|---|---|---|---|
| **Dummy Baseline (Majority)** | 64.94% | 0.00% | 0.00% | 0.0000 | 0.5000 | 0.500 (+/- 0.000) |
| **Logistic Regression** | 70.78% | 60.00% | 50.00% | 0.5455 | 0.8130 | 0.835 (+/- 0.029) |
| **Decision Tree (depth=5)** | 76.62% | 65.00% | 72.22% | 0.6842 | 0.7840 | 0.760 (+/- 0.038) |
| **Random Forest (100 trees)** | **74.03%** | **66.67%** | **51.85%** | **0.5833** | **0.8167** | **0.839 (+/- 0.035)** |

### Champion Model Selection Justification:
The **Random Forest Classifier** was selected as the production inference model because:
1. It achieved the highest ROC-AUC (**0.8167** on test, **0.839** in 5-fold cross-validation), demonstrating superior ranking capability across decision thresholds.
2. It captures complex non-linear interactions between Age, BMI, and Glucose without requiring manual interaction terms.
3. Decision tree ensembles are resilient to residual outlier influences in clinical biomarker data.

---

## 4. Feature Importance Rankings (Gini Impurity)
1. **Glucose**: 31.8% relative influence
2. **BMI**: 20.4% relative influence
3. **Age**: 15.6% relative influence
4. **DiabetesPedigreeFunction**: 12.1% relative influence
5. **BloodPressure**: 8.9% relative influence
6. **Insulin**: 4.7% relative influence
7. **Pregnancies**: 3.9% relative influence
8. **SkinThickness**: 2.6% relative influence

---

## 5. Visual Artifacts
- Confusion Matrix: `ml/reports/confusion_matrix.png`
- ROC Curves: `ml/reports/roc_curve.png`
- Feature Importance: `ml/reports/feature_importance.png`
- Serialized Pipeline: `ml/models/diabetes_pipeline.joblib`

---

## 6. SMLD Viva Defense Talking Points
1. *Why not deep learning (neural networks)?* For tabular medical datasets with $N < 1000$, neural networks overfit severely. Gradient boosted or bagged decision forests consistently outperform deep architectures on benchmark tabular health datasets.
2. *Why stratify splits?* Because the class ratio is 65:35. Unstratified splits risk uneven distribution of positive cases between train and test sets.
3. *Why median over mean imputation?* Fasting insulin and glucose exhibit right-skewed non-Gaussian distributions where the mean is distorted by extreme outliers.
