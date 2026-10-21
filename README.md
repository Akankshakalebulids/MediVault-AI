# MediVault AI — Intelligent Healthcare Management & Diabetes Risk Screening Platform

[![React](https://img.shields.io/badge/React-19.0-087F5B.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-20A879.svg)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-F58220.svg)](https://firebase.google.com/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.1-6DB33F.svg)](https://spring.io/projects/spring-boot)
[![Kotlin](https://img.shields.io/badge/Kotlin-2.3.21-7F52FF.svg)](https://kotlinlang.org/)
[![Python](https://img.shields.io/badge/Python-FastAPI%20%26%20Scikit--Learn-3776AB.svg)](https://fastapi.tiangolo.com/)
[![Flutter](https://img.shields.io/badge/Flutter-Dart%203.x-02569B.svg)](https://flutter.dev/)

> **Academic Integration**: One unified, cross-platform healthcare engineering portfolio supporting three university courses:
> 1. **ASDD** — Agile Software Development (5 Epics, 15 User Stories, Jira Workflow, DoD)
> 2. **WMAD** — Web and Mobile Application Development (React, Firebase, Kotlin Spring Boot, Flutter)
> 3. **SMLD** — Statistical Machine Learning & Data Science (Clinical EDA, Benchmarking, Random Forest Pipeline, FastAPI)

---

## 1. System Overview & Problem Statement
Preventative healthcare management is frequently fragmented across disconnected hospital portals, paper prescriptions, and unstandardized laboratory reports. Patients with prediabetic metabolic risks often lack intuitive tracking tools and non-invasive educational screening.

**MediVault AI** unifies digital personal health record management with a real machine-learning diabetes risk-screening pipeline, backed by enterprise-grade user isolation and responsive cross-platform clients.

---

## 2. Mandatory Visual Identity
MediVault AI adheres strictly to a modern healthcare SaaS **Green + White Theme**:

| Role | Color Name | Hex Token | Usage |
|---|---|---|---|
| **Primary Accent** | Emerald Green | `#087F5B` | Primary CTAs, active navigation, key vitals |
| **Secondary Accent** | Medium Green | `#20A879` | Hover states, active borders, chart accents |
| **Dark Forest** | Dark Green | `#075E45` | Hero gradient, high-contrast badges |
| **Page Background** | Pale Mint | `#F0FDF7` | Calming, accessible canvas |
| **Card Surface** | Pure White | `#FFFFFF` | Panels, tables, modal dialogs |
| **Soft Surface** | Soft Green Tint | `#E6F7EF` | Highlighted cards, metric badges |
| **Main Typography** | Deep Forest Slate | `#16352B` | Primary headings, table text |
| **Sub Typography** | Muted Slate Green | `#64756D` | Labels, secondary descriptions |
| **Borders** | Light Greenish-Gray | `#DCECE3` | Crisp, subtle card and table dividers |

---

## 3. High-Level System Architecture

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|                                                                                   |
|  +-------------------------------------+   +-----------------------------------+  |
|  |     React 19 Web Application        |   |    Flutter Mobile Companion App   |  |
|  |   - Emerald/White Healthcare Design |   |   - Android/iOS Responsive Layout |  |
|  |   - Realtime Firestore Subscriptions|   |   - Cross-Platform Health Sync    |  |
|  |   - Interactive Risk Screening UI   |   |   - Offline-first Architecture    |  |
|  +------------------+------------------+   +-----------------+-----------------+  |
+---------------------|----------------------------------------|--------------------+
                      |                                        |
                      | HTTPS / WSS                            | HTTPS / WSS
                      v                                        v
+-----------------------------------------------------------------------------------+
|                        AUTHENTICATION & CLOUD DATA LAYER                          |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                           Firebase Platform                                 |  |
|  |  * Firebase Authentication (JWT Identity tokens, RBAC claims)               |  |
|  |  * Cloud Firestore NoSQL Database (Real-time syncing, sub-collections)      |  |
|  |  * Granular Security Rules (Strict per-patient record ownership isolation)  |  |
|  +-----------------------------------------------------------------------------+  |
+---------------------+-------------------------------------------------------------+
                      |
                      | REST API / Auth Token Verification
                      v
+-----------------------------------------------------------------------------------+
|                               SERVICES LAYER                                      |
|                                                                                   |
|  +----------------------------------+     +------------------------------------+  |
|  | Kotlin / Spring Boot REST API    |     | Python FastAPI ML Inference Engine |  |
|  |  * Java 25 & Spring Boot 4.1.1   |     |  * scikit-learn Trained Pipeline   |  |
|  |  * Role & Token Verification     |     |  * Pima Diabetes Validated Model   |  |
|  |  * Patient Audit Trail Service   |     |  * Pydantic Schema Validation      |  |
|  |  * Health Timeline Aggregator    |     |  * Probabilistic Risk Stratification|  |
|  +----------------------------------+     +------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 4. Key Modules & Features

### A. Dashboard & Chronic Health Vitals
- Personalized greeting, vital summary cards, today's prescribed medication schedule, upcoming specialist visits, and recent lab reports.
- Non-diagnostic educational disclaimer banner present on every surface.
- **Evidence-Based Chronic Disease Guidance**: Contextual clinical notes regarding Glycemic Monitoring, Fasting vs Post-Prandial Blood Sugar, Blood Pressure threshold classification, and the critical **Erythrocyte Turnover / Anemia Caveat** on HbA1c interpretation.

### B. Medical Documents Vault (OCR & AI Ingestion)
- Secure repository for official clinical documents, laboratory PDFs, prescriptions, and radiology scans.
- **AI-Assisted Document Extraction (OCR)**: Heuristic clinical NLP service automatically parses diagnostic parameters (Fasting Blood Sugar, HbA1c, BP, Lipid panels, Medications, Invoice amounts) with confidence metrics and interactive human-in-the-loop review.
- Downloadable original files and direct one-click export into longitudinal Medical Records.

### C. Medical Expenses Tracker (Indian Rupees ₹)
- Dedicated healthcare expenditure tracking in Indian Rupees (₹) covering Doctor Consultations, Pharmacy, Diagnostics, Hospitalization, and Insurance Claims.
- **Duplicate Invoice Detection**: Queries backend to warn users against double-booking bills with matching invoice numbers.
- Aggregate analytics: Total expenditure, monthly trends, and visual category breakdown bars.

### D. Multi-Patient Family Profiles & Switcher
- Family-centric health management allowing users to manage records for **Self**, **Father**, **Mother**, **Spouse**, and **Child**.
- Real-time profile switcher in topbar isolating medical records, medications, documents, and expenses per family member.

### E. Doctor-Visit Clinical Summary Generator
- Printable and downloadable consultation summary consolidating:
  - Patient demographics & blood group
  - Currently active medications with dosages and schedules
  - Recent diagnostic laboratory findings
  - Longitudinal chronic metabolic and cardiovascular indicators
  - Curated, pertinent discussion questions for the attending physician.

### F. Bilingual Localization (English & हिन्दी)
- Full client localization supporting English and Hindi (हिन्दी) covering navigation, medical terminology, alerts, disclaimers, and interactive form fields.

### G. Medical Records Management
- Categorized diagnostic repository (Laboratory, Consultation, Prescription, Radiology, Immunization).
- Real-time instant search by doctor, title, facility, or clinical note keywords.
- Add, View Details, Edit, and Delete modal workflows with form validation.

### H. Medication Management
- Prescriptions with dosage, administration schedule, reminder times, and status pills (Active, Paused, Completed).
- One-click Pause/Resume toggle for completed courses.

### I. Care Appointments
- Dual-tab view: Upcoming Visits vs Past Consultations.
- Doctor details, clinical specialty, clinic location, appointment date/time, and cancellation workflow.

### J. Health Timeline
- Chronological longitudinal care feed unifying diagnostic records, doctor visits, and medication milestones.

### K. Diabetes Risk Screening (SMLD ML Engine)
- Interactive clinical risk assessment form (Age, BMI, Glucose, Blood Pressure, Pregnancies, Insulin, Skin Thickness, Pedigree Function).
- Evaluator test presets (Low Risk, Moderate Risk, Elevated Risk).
- Connected directly to the live Python FastAPI backend (`/api/v1/predict/diabetes`).
- Probability percentage, risk tier badge, key contributing factors analysis, model metadata, and non-diagnostic clinical safety disclaimer.

### L. Profile & Settings
- Patient demographic information, blood group, emergency contact telephone number, Firebase cloud sync status indicator, and security rules disclosure.


---

## 5. Machine Learning (SMLD) Methodology & Results

- **Dataset**: Pima Indians Diabetes Database (NIDDK, Bethesda, MD; $N = 768$).
- **Data Preprocessing**: Implausible biological zeroes (in Glucose, Blood Pressure, Skin Thickness, Insulin, BMI) replaced with `np.nan` and median-imputed strictly within training folds to eliminate data leakage.
- **Model Comparison Table** (Test Split $N = 154$):

| Candidate Model | Accuracy | Precision | Recall | F1-Score | ROC-AUC |
|---|---|---|---|---|---|
| **Dummy Baseline (Majority)** | 64.94% | 0.00% | 0.00% | 0.0000 | 0.5000 |
| **Logistic Regression** | 70.78% | 60.00% | 50.00% | 0.5455 | 0.8130 |
| **Decision Tree (depth=5)** | 76.62% | 65.00% | 72.22% | 0.6842 | 0.7840 |
| **Random Forest (Champion)** | **74.03%** | **66.67%** | **51.85%** | **0.5833** | **0.8167** |

*Generated Artifacts in `ml/reports/`:*
- `metrics.json`: Quantitative benchmark metrics.
- `confusion_matrix.png`: Model performance breakdown.
- `roc_curve.png`: ROC comparison curves.
- `feature_importance.png`: Predictor importance rankings (Glucose: 31.8%, BMI: 20.4%, Age: 15.6%).

---

## 6. Project Directory Structure

```
MediVault/
├── ASDD_PLAN.md                     # Original agile plan
├── MASTER_BLUEPRINT.md              # Original architecture notes
├── README.md                        # Master project documentation
├── firestore.rules                  # Production Cloud Firestore security rules
├── docs/
│   ├── PROJECT_AUDIT.md             # Baseline audit & technical debt analysis
│   ├── ARCHITECTURE.md              # Detailed software architecture
│   ├── REQUIREMENTS.md              # Software Requirements Specification (SRS)
│   ├── IMPLEMENTATION_ROADMAP.md    # Six-phase delivery milestone plan
│   ├── ASDD_REPORT.md               # 5 Epics, 15 User Stories, Jira mapping
│   ├── WMAD_EVIDENCE.md             # Web, Mobile, Firebase, Spring Boot evidence
│   ├── SMLD_EVIDENCE.md             # ML methodology, benchmarking, viva notes
│   ├── literature-review.md         # Academic white paper & comprehensive literature review
│   ├── references.bib               # Complete BibTeX bibliography with peer-reviewed references
│   ├── model-evaluation.md          # Quantitative ML evaluation, ROC curves & confusion matrices
│   ├── research-methodology.md      # Research protocol, biological imputation & validation matrix
│   ├── security-and-privacy.md      # Multi-tenant isolation, DISHA/HIPAA compliance & error architecture
│   └── limitations-and-future-work.md # Research limitations, phenotypic variations & future roadmap

├── web/                             # React 19 + Vite Web Application
│   ├── .env.example                 # Firebase & ML URL configuration template
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx                 # Entrypoint with AuthProvider
│       ├── App.jsx                  # Main application shell & routing
│       ├── styles.css               # Green + White design system tokens
│       ├── firebaseConfig.js        # Firebase SDK init & demo fallback
│       ├── context/
│       │   └── AuthContext.jsx      # Auth session provider
│       ├── services/
│       │   ├── firestoreService.js  # Cloud Firestore & localStorage CRUD
│       │   └── mlService.js         # FastAPI ML client connector
│       ├── components/              # Reusable UI components
│       └── pages/                   # 8 core application pages
├── backend/
│   └── medivault-backend/           # Kotlin 2.3.21 + Spring Boot 4.1.1 REST API
│       ├── build.gradle.kts         # Gradle configuration (Java 25)
│       └── src/main/kotlin/com/medivault/backend/
│           ├── MedivaultBackendApplication.kt
│           ├── config/              # CorsConfig, DataInitializer
│           ├── model/               # JPA Entities (Records, Meds, Appointments)
│           ├── repository/          # Spring Data JPA Repositories
│           ├── dto/                 # Request & Response DTOs
│           └── controller/          # REST Controllers (/api/v1/*)
├── ml/                              # Python Machine Learning Component (SMLD)
│   ├── requirements.txt
│   ├── README.md
│   ├── api.py                       # FastAPI Prediction & Model Info Service
│   ├── data/
│   │   ├── diabetes.csv             # Benchmark NIDDK clinical dataset
│   │   └── DATASET_METADATA.md      # Data dictionary & ethical limitations
│   ├── models/
│   │   └── diabetes_pipeline.joblib # Serialized Scikit-Learn Pipeline
│   ├── reports/                     # Metrics, ROC curves, confusion matrix
│   ├── src/
│   │   └── train_models.py          # Reproducible training & evaluation script
│   └── tests/
│       └── test_api.py              # Pytest test suite for inference API
└── mobile/
    ├── README.md
    └── medivault_mobile/            # Flutter Companion Mobile Application
        ├── pubspec.yaml
        └── lib/
            ├── main.dart            # Flutter entrypoint
            ├── theme/app_theme.dart # Matching green/white theme
            ├── models/models.dart   # Dart data models
            ├── services/api_service.dart
            └── screens/             # Dashboard, Records, Screener screens
```

---

## 7. Installation & Quick Start Guide

### 7.1 React Web Application
```bash
cd web
npm install
npm run dev
```
Access the web application at: `http://localhost:5173/`

### 7.2 FastAPI Machine Learning Service (SMLD)
```bash
# In the MediVault root directory:
pip install -r ml/requirements.txt

# Run reproducible training & evaluation:
python ml/src/train_models.py

# Launch FastAPI inference server:
python -m uvicorn ml.api:app --reload --host 127.0.0.1 --port 8000

# Run automated tests:
pytest ml/tests/test_api.py
```
Live API documentation: `http://localhost:8000/docs`

### 7.3 Kotlin + Spring Boot REST Backend (WMAD)
```bash
cd backend/medivault-backend
.\gradlew.bat test
.\gradlew.bat bootRun
```
REST API runs on: `http://localhost:8080/api/v1/records`

### 7.4 Flutter Mobile Companion App (WMAD)
```bash
cd mobile/medivault_mobile
flutter pub get
flutter run
```

---

## 8. Firebase Configuration (Optional for Cloud Mode)
MediVault AI is designed to run in **Local Demo Mode** out of the box with zero configuration. To connect to your live Firebase project:
1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Email/Password).
3. Create a **Cloud Firestore** database.
4. Copy `web/.env.example` to `web/.env` and paste your project API keys.
5. Deploy `firestore.rules` using the Firebase CLI.

---

## 9. Academic Viva & Portfolio Notes

### Q1: Why use both Firebase and Spring Boot?
*Viva Answer*: Firebase provides real-time client data synchronization and built-in mobile authentication SDKs, fulfilling WMAD mobile requirements. Spring Boot provides an enterprise REST API gateway in Kotlin with explicit business validation, audit logging, and role verification.

### Q2: How did you prevent data leakage in the ML pipeline?
*Viva Answer*: We partitioned the dataset via a stratified train-test split before computing any imputation medians or standard scaling parameters. The preprocessor and classifier are encapsulated within a unified Scikit-Learn `Pipeline` fitted strictly on training data.

### Q3: How is medical privacy ensured?
*Viva Answer*: In Firestore, least-privilege security rules enforce `request.auth.uid == userId`, preventing cross-tenant access. On the client side, clinical safety disclaimers ensure users understand the tool is an educational prototype and not a diagnostic device.

---

## 10. Licence & Ethical Disclaimers
This software is developed strictly for educational and portfolio demonstration under the MIT Licence. It is not an FDA/CE-cleared diagnostic device.
