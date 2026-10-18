# MediVault AI — System Architecture Document

**Author**: Senior Software Architect & ML Engineer  
**Date**: October 2026  
**Version**: 1.0.0

---

## 1. High-Level System Architecture

MediVault AI employs a hybrid modern healthcare architecture designed for high usability, real-time synchronization, enterprise-level role-based isolation, and machine-learning risk screening:

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

## 2. Component Design & Responsibilities

### 2.1 React Web Application
- **Vite 8 + React 19**: Ultra-fast bundle, native ES modules.
- **Design System**: Emerald/White healthcare theme (`#087F5B` primary, `#F0FDF7` background, `#16352B` typography).
- **Service Layer**:
  - `authService.js`: Firebase Auth interface with Demo-mode fallback when unconfigured.
  - `firestoreService.js`: Cloud Firestore CRUD operations for medical records, medications, appointments, and timeline events.
  - `mlService.js`: Connects to FastAPI endpoint for diabetes risk prediction, handling loading, validation, and disclaimers.
- **Component Hierarchy**:
  - `AppShell`: Sidebar, Topbar with real-time search, notifications, profile popover.
  - `Dashboard`: Consolidated health overview, medication tracker, appointment alerts, quick vitals.
  - `MedicalRecords`: Filterable, searchable, categorised records with modal view/edit.
  - `Medications`: Medication schedules, dosage, status toggles, active reminder preferences.
  - `Appointments`: Calendar-style appointment cards, status tracking (Confirmed, Pending, Cancelled).
  - `HealthTimeline`: Unified chronological feed of all health milestones.
  - `HealthAnalytics`: Visual vitals and measurement trends.
  - `DiabetesScreening`: Educational ML risk screening form, model explanation, ROC-AUC details, and safety disclaimers.
  - `ProfileSettings`: Personal health profile, emergency contacts, privacy disclosures.

### 2.2 Machine Learning Pipeline (SMLD)
- **Framework**: Python 3.14, pandas, scikit-learn, FastAPI, Pydantic, uvicorn.
- **Dataset**: Pima Indians Diabetes Database (validated public clinical benchmark from NIDDK).
- **Pipeline Architecture**:
  1. *Clinical Sanitization*: Replace physiologically implausible zeroes (in Glucose, BloodPressure, SkinThickness, Insulin, BMI) with median/mean values stratified by outcome.
  2. *Feature Engineering & Scaling*: Standard scaling applied strictly within cross-validation folds to avoid data leakage.
  3. *Model Training & Comparison*:
     - Logistic Regression (interpretable baseline, odds-ratio insights)
     - Decision Tree (rule-based evaluation)
     - Random Forest Classifier (ensemble learning, non-linear feature interactions)
  4. *Evaluation Suite*: Precision, Recall, F1-score, ROC-AUC, Confusion Matrix.
  5. *Model Serialization*: Exported pipeline via `joblib`.
  6. *FastAPI Serving*: Port `8000`, `/api/v1/predict/diabetes`, strict type bounds, JSON responses with calculated probability, risk tier (Low, Moderate, Elevated), key contributing factors, and explicit non-diagnostic medical disclaimers.

### 2.3 Spring Boot Backend (WMAD / ASDD)
- **Language & Runtime**: Kotlin 2.3.21 on OpenJDK 25.
- **Responsibilities**:
  - Verification of client tokens.
  - Healthcare business rules and aggregation (e.g., timeline summarisation).
  - Clean layered structure: `Controller -> Service -> Model/DTO`.

### 2.4 Flutter Mobile Companion
- **Language**: Dart / Flutter.
- **Architecture**: Clean architecture with state management and reusable widgets adhering to the emerald/white design system.

---

## 3. Data Model & Firestore Schema

```
users/{userId}
  ├── profile: { name, email, dob, bloodGroup, emergencyContact, createdAt }
  │
  ├── medical_records/{recordId}
  │     ├── title: string
  │     ├── category: "Laboratory" | "Consultation" | "Prescription" | "Radiology" | "Immunization"
  │     ├── doctor: string
  │     ├── facility: string
  │     ├── date: string (ISO-8601)
  │     ├── diagnosisNotes: string
  │     ├── status: "Active" | "Reviewed" | "Archived"
  │     └── createdAt: timestamp
  │
  ├── medications/{medicationId}
  │     ├── name: string
  │     ├── dosage: string
  │     ├── frequency: string ("Once daily", "Twice daily", "As needed")
  │     ├── reminderTime: string ("08:00 AM")
  │     ├── startDate: string
  │     ├── endDate: string | null
  │     ├── status: "Active" | "Paused" | "Completed"
  │     └── instructions: string
  │
  ├── appointments/{appointmentId}
  │     ├── doctorName: string
  │     ├── specialty: string
  │     ├── clinicLocation: string
  │     ├── dateTime: string
  │     ├── reason: string
  │     ├── status: "Confirmed" | "Pending" | "Completed" | "Cancelled"
  │     └── notes: string
  │
  └── timeline_events/{eventId}
        ├── eventType: "RECORD_ADDED" | "MED_STARTED" | "APPT_SCHEDULED" | "SCREENING_COMPLETED"
        ├── summary: string
        ├── timestamp: string
        └── referenceId: string
```

---

## 4. Security & Privacy Architecture

1. **Firestore Least-Privilege Rules**: All patient data is scoped strictly to `/users/{userId}/...` where `request.auth.uid == userId`.
2. **Environment Protection**: Secrets and API keys are managed exclusively via environment variables (`.env`). No credentials are committed to version control.
3. **Medical Safety Safeguards**: The ML risk screening service communicates that outputs are educational estimations, providing confidence intervals and advising users with concerns to consult licensed healthcare providers.
