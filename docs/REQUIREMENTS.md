# MediVault AI — Software Requirements Specification (SRS)

**Coursework**: ASDD, WMAD, SMLD  
**Version**: 1.0.0  
**Scope**: Web, Mobile, REST API, Machine Learning Risk Screening

---

## 1. Functional Requirements

### 1.1 Authentication & Profile (WMAD & ASDD Epic 1)
- **FR-AUTH-01**: The system shall allow users to register with an email and password.
- **FR-AUTH-02**: The system shall validate password strength and email formatting.
- **FR-AUTH-03**: The system shall allow registered users to log in securely using Firebase Authentication.
- **FR-AUTH-04**: The system shall maintain authenticated user sessions across page reloads.
- **FR-AUTH-05**: The system shall allow users to sign out securely.
- **FR-AUTH-06**: When Firebase is unconfigured, the system shall provide a clearly labelled "Demo Mode" with sample patient context so all modules can be explored without error.
- **FR-AUTH-07**: The system shall allow users to view and update profile information (name, date of birth, blood group, emergency contact).

### 1.2 Medical Records Management (WMAD & ASDD Epic 2)
- **FR-REC-01**: Users shall be able to view a categorized list of medical records (Laboratory, Consultation, Prescription, Radiology, Immunization).
- **FR-REC-02**: Users shall be able to filter records by category and search by title, doctor, or diagnosis keyword.
- **FR-REC-03**: Users shall be able to create new medical record metadata with validation (title, doctor, facility, date, diagnosis notes, category).
- **FR-REC-04**: Users shall be able to edit existing medical records.
- **FR-REC-05**: Users shall be able to delete medical records with confirmation.
- **FR-REC-06**: In cloud mode, all records shall be persisted to the user's isolated Firestore subcollection.

### 1.3 Medication Management (WMAD & ASDD Epic 3)
- **FR-MED-01**: Users shall be able to view their medication schedule with dosage, frequency, and reminder times.
- **FR-MED-02**: Users shall be able to add a new medication with validation.
- **FR-MED-03**: Users shall be able to edit existing medication details and toggle status (Active, Paused, Completed).
- **FR-MED-04**: Users shall be able to delete medications with confirmation.
- **FR-MED-05**: The system shall never alter dosages or issue prescription recommendations autonomously.

### 1.4 Appointment Management (WMAD & ASDD Epic 3)
- **FR-APT-01**: Users shall be able to schedule an appointment with doctor name, specialty, clinic/hospital, date, time, and reason.
- **FR-APT-02**: The system shall display appointments segregated by Upcoming and Past dates.
- **FR-APT-03**: Users shall be able to modify appointment details or cancel appointments.

### 1.5 Health Timeline & Analytics (WMAD & ASDD Epic 4)
- **FR-TIME-01**: The system shall aggregate records, appointments, and medication milestones chronologically in a visual timeline.
- **FR-TIME-02**: The system shall provide visual trend graphs for available clinical metrics (e.g. blood pressure, glucose readings over time) using the emerald palette.
- **FR-TIME-03**: Charts must display explicit units, handle missing entries, and avoid fabricating clinical conclusions.

### 1.6 Diabetes Risk Screening (SMLD ML Workflow)
- **FR-ML-01**: The system shall accept validated patient risk parameters:
  - Age (years, 18-120)
  - BMI (kg/m^2, 10-70)
  - Glucose (mg/dL fasting or oral tolerance, 40-300)
  - Blood Pressure (diastolic mm Hg, 30-180)
  - Pregnancies (count, 0-25)
  - Insulin (mu U/ml, 0-900)
  - Skin Thickness (triceps fold mm, 0-100)
  - Diabetes Pedigree Function (0.05-3.0)
- **FR-ML-02**: The system shall send inputs to the FastAPI prediction endpoint.
- **FR-ML-03**: The system shall display a probabilistic risk assessment (Low, Moderate, Elevated) alongside the estimated percentage.
- **FR-ML-04**: The system shall highlight key contributing factors based on feature importance.
- **FR-ML-05**: The system shall display an unambiguous non-diagnostic medical disclaimer on the screen at all times.

---

## 2. Non-Functional Requirements

### 2.1 Usability & Visual Identity
- **NFR-UI-01**: Modern healthcare aesthetic with green and white theme (Primary Emerald `#087F5B`, Secondary Green `#20A879`, White `#FFFFFF`, Pale Mint `#F0FDF7`, Main Text `#16352B`).
- **NFR-UI-02**: Fully responsive on desktop (1280px+), tablet (768px-1024px), and mobile (320px-480px).
- **NFR-UI-03**: Accessible contrast ratios conforming to WCAG 2.1 AA standards.

### 2.2 Performance & Reliability
- **NFR-PERF-01**: Web initial bundle load time < 2 seconds.
- **NFR-PERF-02**: ML prediction inference response time < 500 ms.
- **NFR-PERF-03**: Graceful degradation when offline or when external cloud services are unconfigured.

### 2.3 Security & Privacy
- **NFR-SEC-01**: Least-privilege access rules in Cloud Firestore preventing any patient from accessing records belonging to another user ID.
- **NFR-SEC-02**: Zero secrets committed to version control; `.env.example` provides documentation templates.
- **NFR-SEC-03**: Safe logging practices omitting patient personal health data.
