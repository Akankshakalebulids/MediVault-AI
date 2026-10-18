# Dataset Documentation: Pima Indians Diabetes Database

## 1. Provenance & Attribution
- **Original Source**: National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK), National Institutes of Health (NIH), Bethesda, Maryland.
- **Repository**: UCI Machine Learning Repository (1990) & Kaggle public dataset distribution.
- **Licence & Permitted Use**: Public domain / Open educational and research use (CC0: Public Domain / Open Data).

## 2. Dataset Overview
- **Instances**: 768 patient records
- **Features**: 8 clinical predictor variables, 1 binary target outcome
- **Target Variable**: `Outcome` (0 = Non-diabetic, 1 = Diabetic)
- **Class Distribution**: 
  - Non-diabetic (0): 500 instances (~65.1%)
  - Diabetic (1): 268 instances (~34.9%)

## 3. Attribute Definitions & Units
| Attribute | Description | Plausible Range | Implausible Zero Cases |
|---|---|---|---|
| `Pregnancies` | Number of times pregnant | 0 - 20 | 0 is valid (nulliparous) |
| `Glucose` | Plasma glucose concentration at 2 hours in an oral glucose tolerance test | 44 - 199 mg/dL | 5 zero values (physiologically impossible in living patients) |
| `BloodPressure` | Diastolic blood pressure | 40 - 122 mm Hg | 35 zero values (impossible) |
| `SkinThickness` | Triceps skin fold thickness | 7 - 99 mm | 227 zero values (unrecorded/missing) |
| `Insulin` | 2-Hour serum insulin | 14 - 846 mu U/ml | 374 zero values (missing measurement) |
| `BMI` | Body Mass Index (weight in kg / (height in m)^2) | 18.2 - 67.1 | 11 zero values (physiologically impossible) |
| `DiabetesPedigreeFunction` | Genetic risk score synthesizing family history | 0.078 - 2.42 | 0 is not present (all > 0) |
| `Age` | Patient age in years | 21 - 81 years | All valid (>= 21) |

## 4. Known Clinical Limitations & Demographic Bias
1. **Demographic Homogeneity**: All participants are females of Pima Indian heritage aged 21 and older residing near Phoenix, Arizona. 
2. **Generalizability**: The model cannot be assumed to generalize across diverse ethnicities, males, paediatric populations, or modern clinical cohorts without recalibration.
3. **Missing Value Imputation**: Historical measurement conventions coded unrecorded insulin and skin fold readings as `0`. Preprocessing must treat these as missing data rather than genuine zero values.
4. **Educational Scope**: This dataset and the resulting models are strictly educational screening proofs-of-concept. They must never be used for clinical diagnosis or prescription adjustment.
