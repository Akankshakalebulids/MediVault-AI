# MediVault AI — Implementation Roadmap

**Sprint Plan**: 6 Milestones (Aligned with ASDD, WMAD, SMLD)

---

## Milestone 1: Phase Zero Audit & Web UI/UX Green-and-White Redesign
- [x] Workspace & dependency audit
- [x] Initial architecture, requirements, and audit documentation
- [ ] Comprehensive CSS design system based on emerald/white palette (`#087F5B`, `#20A879`, `#F0FDF7`, `#16352B`)
- [ ] Modular React structure (`src/components/`, `src/pages/`, `src/services/`, `src/context/`)
- [ ] Fully functional views:
  - Dashboard (personalized health overview, quick stats, today's schedule)
  - Medical Records (list, filter, search, add, edit, delete)
  - Medications (schedule, add, edit, status toggles, delete)
  - Appointments (upcoming, past, schedule, cancel)
  - Health Timeline (chronological health milestones)
  - Health Analytics (interactive SVG charts for vitals)
  - Profile & Settings (user details, emergency contacts, privacy notice)
- [ ] Test frontend build (`npm run build`) and responsiveness

---

## Milestone 2: SMLD Machine Learning Pipeline & FastAPI Prediction Service
- [ ] Curate and inspect validated Pima Indians Diabetes dataset
- [ ] Data preprocessing: clean physiological zero-values, impute, scale without data leakage
- [ ] Train & evaluate baseline models:
  - Logistic Regression
  - Decision Tree
  - Random Forest Classifier
- [ ] Evaluate with Precision, Recall, F1, ROC-AUC, and Confusion Matrix
- [ ] Model comparison & selection report saved in `ml/reports/`
- [ ] Serialize best model pipeline with `joblib`
- [ ] Build FastAPI serving API with Pydantic validation and medical disclaimer
- [ ] Connect React frontend `DiabetesScreening` module to FastAPI inference endpoint
- [ ] Add interactive testing and unit tests for ML pipeline

---

## Milestone 3: WMAD Firebase Authentication & Cloud Firestore Integration
- [ ] Install Firebase SDK in web client (`firebase`)
- [ ] Configure `firebaseConfig.js` with environment variable loading
- [ ] Create `.env.example` with clear documentation
- [ ] Implement `AuthContext` with registration, login, logout, and session state
- [ ] Implement Firestore data service (`firestoreService.js`) for user-isolated collections
- [ ] Implement demo mode fallback when Firebase credentials are not yet supplied
- [ ] Write `firestore.rules` enforcing strict ownership (`request.auth.uid == userId`)
- [ ] Write Firebase integration guide and testing checklist

---

## Milestone 4: WMAD Kotlin & Spring Boot REST API
- [ ] Structure Kotlin backend:
  - Controllers: `MedicalRecordController`, `MedicationController`, `AppointmentController`, `TimelineController`
  - Models & DTOs with validation annotations
  - Service layer for business logic
- [ ] Implement CORS and error handling
- [ ] Add unit and slice integration tests

---

## Milestone 5: WMAD Flutter Mobile Companion Application
- [ ] Initialize structured Flutter application in `mobile/medivault_mobile/`
- [ ] Create models, API clients, and Firebase service abstractions
- [ ] Implement Flutter screens: Splash, Auth, Dashboard, Records, Medications, Appointments, Risk Screening
- [ ] Maintain consistent emerald/white theme across Flutter UI

---

## Milestone 6: ASDD Agile Documentation, Testing, & Viva Preparation
- [ ] 5 major Epics and ~15 User Stories with acceptance criteria
- [ ] Backlog prioritization matrix (MoSCoW)
- [ ] Comprehensive README with setup instructions, viva talking points, and screenshots
- [ ] End-to-end testing report across all subsystems
