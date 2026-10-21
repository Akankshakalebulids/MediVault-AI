# MediVault AI — Limitations & Future Work

**Document Classification**: Academic Disclosure & Engineering Roadmap  
**Date**: October 2026  

---

## 1. Limitations

### 1.1 Machine Learning Dataset Demographics
The non-invasive metabolic screening model was trained and evaluated on the benchmark Pima Indians Diabetes dataset. While this dataset provides a standardized benchmark for comparative algorithms, it has demographic limitations:
* **Gender Restriction**: The dataset consists exclusively of female adult subjects ($N = 768$). While feature columns like `Glucose`, `BMI`, `BloodPressure`, and `Age` are universally predictive of metabolic dysfunction across genders, pregnancy-specific attributes (`Pregnancies`) are non-applicable to male individuals. In MediVault AI, when male profiles are evaluated, the `pregnancies` feature is neutralized to $0$.
* **Phenotypic Variation**: South Asian populations exhibit the "thin-fat phenotype" (higher visceral adiposity and insulin resistance at lower BMI cutoffs compared to Western populations). A model trained strictly on Pima data may slightly underestimate risk for South Asian individuals with normal BMI (e.g., $22\text{ kg/m}^2$) who have elevated visceral fat. Future iterations will incorporate the ICMR-INDIAB population registry data.

### 1.2 OCR and Document Extraction Noise
* **Handwritten Prescriptions**: While digital laboratory printouts and typed discharge summaries parse with high heuristic confidence ($>90\%$), handwritten prescriptions from community clinics exhibit significant handwriting variability and low contrast. In such cases, the OCR pipeline defaults to human-in-the-loop review, requiring the user to confirm drug names and dosages.
* **Document Rotations & Complex Tables**: Scans taken under poor ambient lighting or skewed angles can disrupt regex row matching.

### 1.3 Local Runtime Environment Constraints
* **Flutter SDK Absence**: While Flutter mobile source code exists in `mobile/medivault_mobile/`, the local development machine lacks an active Flutter SDK installation in the PATH. The mobile components cannot be locally built or verified via `flutter test` without manual installation of the Flutter tooling.

---

## 2. Future Work & Architectural Roadmap

### 2.1 Fast Healthcare Interoperability Resources (HL7 FHIR)
* Implement FHIR Release 4 (R4) conversion adapters for all core entities:
  * `MedicalRecordEntity` $\rightarrow$ `FHIR Observation` / `DiagnosticReport`
  * `MedicationEntity` $\rightarrow$ `FHIR MedicationRequest`
  * `AppointmentEntity` $\rightarrow$ `FHIR Appointment`
  * `UserProfileEntity` / `FamilyMemberEntity` $\rightarrow$ `FHIR Patient` / `RelatedPerson`
* Enable direct export to India's Ayushman Bharat Digital Mission (ABDM) and Ayushman Bharat Health Account (ABHA) ecosystem.

### 2.2 Wearable Sensor Continuous Ingestion
* Integrate Google Health Connect and Apple HealthKit APIs to automatically ingest continuous glucose monitoring (CGM) sensor streams, resting heart rate, and step counts into the longitudinal health timeline.

### 2.3 On-Device Vision Transformers for Offline OCR
* Deploy lightweight on-device vision models (such as MobileNet-OCR or quantized TrOCR) via WebAssembly (Wasm) or ONNX Runtime Web to achieve 100% offline document parsing directly inside the browser without transmitting medical images across the network.
