# MediVault AI — Agile Software Development (ASDD) Documentation

**Academic Course**: ASDD (Agile Software Development)  
**Project**: MediVault AI  
**Author**: Third-Year CS & Data Science Student  
**Framework**: Scrum / Agile Principles  
**Version**: 1.0.0

---

## 1. Product Vision & Backlog Overview
MediVault AI is an integrated healthcare management and diabetes risk-screening platform. The Agile development was organized across 5 core Epics, decomposed into 15 user stories with rigorous Acceptance Criteria (Given-When-Then) and MoSCoW prioritization.

---

## 2. Epics & User Stories Backlog

### Epic 1: User Authentication & Profile Security
| Story ID | User Story Summary | Priority | Acceptance Criteria |
|---|---|---|---|
| **US-01** | *As a patient, I want to register and sign in securely with Firebase so that my personal health data is protected.* | **Must Have** | **Given** an unregistered email, **When** I submit registration credentials, **Then** a Firebase Auth UID is generated and a private Firestore space is allocated. |
| **US-02** | *As an evaluator or patient without cloud setup, I want an automatic Demo Mode so that I can explore all features safely.* | **Must Have** | **Given** missing Firebase credentials in `.env`, **When** the app loads, **Then** an amber "Demo Mode" badge is displayed and local storage handles all CRUD operations without errors. |
| **US-03** | *As a patient, I want to manage my medical profile (blood group, emergency contact) so that care providers have accurate baseline context.* | **Should Have** | **Given** the Profile & Settings view, **When** I update my blood group or contact, **Then** changes persist and a success confirmation appears. |

### Epic 2: Medical Records Management
| Story ID | User Story Summary | Priority | Acceptance Criteria |
|---|---|---|---|
| **US-04** | *As a patient, I want to view a categorized list of medical records so that I can quickly inspect my laboratory tests, consultations, and scans.* | **Must Have** | **Given** documented records, **When** I select "Laboratory", **Then** only CMP and blood test records are visible. |
| **US-05** | *As a patient, I want to search records by doctor, facility, or keyword so that I can locate specific clinical notes in seconds.* | **Must Have** | **Given** a search query "Mehta", **When** I type in the search bar, **Then** the record table updates dynamically in real time. |
| **US-06** | *As a patient, I want to add new medical record metadata with validation so that my history is complete.* | **Must Have** | **Given** the Add Record modal, **When** mandatory fields (Title, Doctor) are missing, **Then** form validation blocks submission. |
| **US-07** | *As a patient, I want to delete outdated records with confirmation so that accidental data loss is prevented.* | **Could Have** | **Given** a record entry, **When** I click delete and confirm the prompt, **Then** the record is purged from Firestore and UI. |

### Epic 3: Medication & Appointment Management
| Story ID | User Story Summary | Priority | Acceptance Criteria |
|---|---|---|---|
| **US-08** | *As a patient, I want to maintain a daily medication schedule so that I remember dosage timings.* | **Must Have** | **Given** the Medications view, **When** reviewing active items, **Then** dose, reminder time (e.g. 08:00 AM), and frequency are displayed clearly. |
| **US-09** | *As a patient, I want to pause or resume medication reminders so that finished treatments are not alerted.* | **Should Have** | **Given** an active medication card, **When** I click "Pause", **Then** status updates to "Paused" with an amber pill. |
| **US-10** | *As a patient, I want to schedule future clinical appointments so that upcoming specialist visits are organized.* | **Must Have** | **Given** doctor name, specialty, facility, and datetime, **When** submitted, **Then** a new appointment card appears under "Upcoming Visits". |
| **US-11** | *As a patient, I want to view past consultations separately so that completed care is archived cleanly.* | **Should Have** | **Given** the Appointments view, **When** I toggle "Past & Completed", **Then** historical visits are segregated from active bookings. |

### Epic 4: Health Timeline & Analytics
| Story ID | User Story Summary | Priority | Acceptance Criteria |
|---|---|---|---|
| **US-12** | *As a patient, I want a longitudinal timeline feed so that I can see all health events chronologically.* | **Should Have** | **Given** records, medications, and visits, **When** visiting Timeline, **Then** all items appear ordered descending by date. |
| **US-13** | *As a patient, I want interactive charts of vitals (glucose, BP, BMI) so that I can observe trends over time.* | **Should Have** | **Given** historical measurements, **When** switching to Health Analytics, **Then** SVG line charts render clinical reference target bands. |

### Epic 5: Machine Learning Risk Screening & Administration
| Story ID | User Story Summary | Priority | Acceptance Criteria |
|---|---|---|---|
| **US-14** | *As a patient, I want an educational diabetes risk screening tool using real ML so that I can understand risk factors.* | **Must Have** | **Given** clinical parameters (Glucose, BMI, Age, BP), **When** submitted to the FastAPI model, **Then** probability, risk tier badge, contributing factors, and a prominent disclaimer are returned. |
| **US-15** | *As an administrator/evaluator, I want API health checks and model inspection endpoints so that system integrity can be verified.* | **Must Have** | **Given** the FastAPI backend, **When** accessing `/health` and `/api/v1/model-info`, **Then** 200 OK with model algorithm and ROC-AUC is returned. |

---

## 3. Sprint Cadence & GitHub Workflow
- **Branching Strategy**: Git feature-branching workflow (`feature/ml-screener`, `feature/firebase-sync`, `feature/spring-boot-api`).
- **Definition of Done (DoD)**:
  1. Unit tests pass (`pytest` for ML, `gradlew test` for Spring Boot, `npm run build` for React).
  2. UI adheres strictly to the emerald/white healthcare theme.
  3. No secrets committed to Git repository (`.env.example` used).
  4. Non-diagnostic disclaimers present on all screening surfaces.
