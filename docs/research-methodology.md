# MediVault AI — Research Methodology & Experimental Protocol

**Document Version**: 1.0  
**Authors**: MediVault AI Healthcare Systems & ML Architecture Group  
**Target Publication / Presentation**: Academic Engineering Symposium & Portfolio Defense  
**Date**: October 2026  

---

## 1. Research Overview & Problem Formulation

Personal Health Record (PHR) systems operate at the interface of software engineering, applied clinical informatics, and human-computer interaction. The primary research challenge addressed by MediVault AI is:

> *How can an untethered, user-sovereign digital health platform provide automated clinical document extraction, longitudinal chronic disease tracking (with critical hematological caveats), and non-invasive metabolic screening while maintaining strict user tenancy isolation and bilingual accessibility?*

This methodology encompasses three research threads:
1. **Clinical Information Architecture**: Multi-patient family profile modeling and longitudinal disease tracking.
2. **Predictive Machine Learning**: Robust preprocessing and comparative benchmarking on benchmark metabolic data.
3. **Information Extraction**: Optical character recognition (OCR) parsing and heuristic clinical dictionary extraction.

---

## 2. Experimental Data Pipeline (ML Subsystem)

### 2.1 Benchmark Dataset Selection
The Pima Indians Diabetes dataset, compiled by the National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK) and archived in the UCI Machine Learning Repository, was selected as the standard reference dataset ($N = 768$). It represents a well-characterized population exhibiting a high genetic predisposition to metabolic dysfunction.

### 2.2 Data Hygiene & Anomaly Resolution
In raw clinical datasets, missing values are frequently recorded as zeros due to default legacy database schemas. The following hygiene steps were strictly executed:
1. **Audit of Biological Impossibility**:
   * Minimum valid physiological plasma glucose in living patients: $\sim 40\text{ mg/dL}$ (Dataset contained $5$ instances of $0$).
   * Minimum valid diastolic blood pressure: $\sim 30\text{ mmHg}$ (Dataset contained $35$ instances of $0$).
   * Minimum valid triceps skinfold thickness: $\sim 2\text{ mm}$ (Dataset contained $227$ instances of $0$).
   * Minimum valid serum insulin: $\sim 2\mu\text{U/mL}$ (Dataset contained $374$ instances of $0$).
   * Minimum valid BMI: $\sim 10\text{ kg/m}^2$ (Dataset contained $11$ instances of $0$).
2. **Imputation Strategy**:
   * Biological zeros were converted to `NaN` and imputed using median values computed exclusively over training folds.
   * Median was selected over mean due to the non-Gaussian right-skewness of serum insulin and triceps skinfold measurements.
3. **Standardization**:
   * Continuous features were standardized to mean $\mu = 0$ and unit variance $\sigma = 1$ to ensure equal weighting during optimization.

---

## 3. Machine Learning Benchmark Protocol

### 3.1 Partitioning & Cross-Validation
* **Holdout Validation**: Stratified 80/20 train/test split preserving the positive-to-negative class balance.
* **$k$-Fold Cross-Validation**: 5-fold stratified cross-validation was conducted across the training split to estimate model generalizability and quantify metric standard deviation.

### 3.2 Evaluation Metrics
Given the asymmetric cost of false negatives in medical screening, candidate models were evaluated using a comprehensive suite of metrics:
1. **Accuracy**: Overall fraction of correct predictions:
   $$\text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN}$$
2. **Precision (Positive Predictive Value)**: Proportion of positive predictions that were true positives:
   $$\text{Precision} = \frac{TP}{TP + FP}$$
3. **Recall (Sensitivity)**: Proportion of actual positive cases detected:
   $$\text{Recall} = \frac{TP}{TP + FN}$$
4. **F1-Score**: Harmonic mean of precision and recall:
   $$F_1 = 2 \cdot \frac{\text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}}$$
5. **Receiver Operating Characteristic — Area Under Curve (ROC-AUC)**: Overall diagnostic capability across all discrimination thresholds.

---

## 4. Full-Stack Systems Architecture Methodology

### 4.1 Backend Engine (Spring Boot + Kotlin 2.3 + Java 25)
* **Domain-Driven Design (DDD)**: Clear demarcation of entities, JPA repositories, service transaction boundaries, and REST controllers.
* **Dual Profile Strategy**: H2 in-memory relational database for continuous integration and unit testing; PostgreSQL for production persistence.
* **Tenancy Enforcement**: Every entity (`MedicalRecordEntity`, `MedicationEntity`, `AppointmentEntity`, `TimelineEventEntity`, `MedicalDocumentEntity`, `MedicalExpenseEntity`, `FamilyMemberEntity`) enforces a mandatory `userId` foreign key.

### 4.2 Web Application (React 19 + Vite 8.3)
* **State Management**: Dedicated Context Providers (`AuthContext`, `FamilyContext`, `LanguageContext`) decoupling UI components from global state.
* **Dual-Channel Synchronization**: Proactive health-checking against the Spring Boot REST API (Port 8085), with automatic fallback to Cloud Firestore or browser local storage.
* **Aesthetic & Clinical SaaS UI**: Curated healthcare color palette (Emerald `#059669`, Forest Green `#065f46`, Off-white `#f8fafc`, Border `#e2e8f0`) avoiding generic templates.

---

## 5. Verification & Reproducibility Matrix

To guarantee scientific and engineering reproducibility, the repository includes automated verification scripts across all layers:
1. **Backend Integration Suite**: `./gradlew.bat test` executes 10 test suites in `ApiControllerTests.kt`, validating CRUD lifecycles, duplicate invoice checks, family profile management, and doctor visit summary generation.
2. **Machine Learning Suite**: `pytest ml/tests -v` executes 7 unit and API boundary validation tests against the serialized Random Forest pipeline.
3. **Frontend Production Build**: `npm run build` verifies that all React components, contexts, and stylesheets bundle cleanly without type errors.
