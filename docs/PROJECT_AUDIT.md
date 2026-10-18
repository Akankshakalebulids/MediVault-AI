# MediVault AI — Project Audit Report

**Audit Date**: October 2026  
**Auditor**: Lead Full-Stack & ML Systems Engineer  
**Academic Context**: ASDD (Agile Software Development), WMAD (Web & Mobile Application Development), SMLD (Machine Learning / Data Science)

---

## 1. Executive Summary

MediVault AI is designed as an integrated healthcare management and diabetes risk screening platform. The audit of the initial workspace (`MediVault/`) revealed an initial single-page React proof-of-concept with several placeholder modules, an unconfigured Spring Boot Kotlin skeleton, an empty mobile placeholder directory, and no machine learning pipeline or Firebase integration. 

This audit document details the baseline findings, technical debt, and gap analysis required to upgrade MediVault into an academic-grade, portfolio-ready system.

---

## 2. Directory Structure Analysis

```
MediVault/
├── ASDD_PLAN.md                   # Initial epic & user-story outlines
├── MASTER_BLUEPRINT.md            # High-level architecture notes
├── README.md                      # Milestone 1 overview
├── backend/
│   ├── README.md                  # Milestone notes
│   └── medivault-backend/         # Gradle Kotlin Spring Boot project skeleton
│       ├── build.gradle.kts       # Spring Boot 4.1.1, Kotlin 2.3.21, Java 25
│       └── src/main/kotlin/       # MedivaultBackendApplication.kt (empty main)
├── mobile/
│   └── README.md                  # Planned screen list (no Flutter code yet)
└── web/
    ├── index.html
    ├── package.json               # React, Vite, Lucide-react
    ├── vite.config.js
    └── src/
        ├── main.jsx               # Single monolithic file with placeholder tabs
        └── styles.css              # Dark-teal styling (divergent from Emerald/White palette)
```

---

## 3. Component-by-Component Findings

### 3.1 React Web Application (`web/`)
- **Framework & Tooling**: Vite 8.3.2 + React 19 + `lucide-react`. Builds cleanly (`npm run build` succeeds).
- **Architecture**: A single 76-line `main.jsx` file contains the entire application logic. All tabs (`Medical Records`, `Medications`, `Appointments`, `Health Timeline`, `Profile`) render a generic `<Placeholder/>` component.
- **Persistence**: Medication creation writes strictly to browser `localStorage` (`medivault_meds`). No remote API or database persistence exists.
- **Visual Identity**: The current stylesheet uses dark teal (`#102f2b`) and generic styling. It violates the user's mandatory green-and-white healthcare design palette:
  - Required Primary Emerald: `#087F5B`
  - Secondary Green: `#20A879`
  - Dark Green: `#075E45`
  - White: `#FFFFFF`
  - Pale Mint: `#F0FDF7`
  - Soft Green Surface: `#E6F7EF`
  - Main Text: `#16352B`
  - Secondary Text: `#64756D`
  - Border: `#DCECE3`
- **Missing Modules**:
  - Diabetes Risk Screening (SMLD ML interactive inference interface)
  - Full CRUD for Medical Records
  - Full Medication Management with status and reminder intervals
  - Appointment scheduling, status transitions, and provider tracking
  - Health Timeline visual events
  - Interactive Health Analytics charts
  - Firebase Authentication UI (Login / Register / Profile modal / Logout)

### 3.2 Machine Learning Component (SMLD)
- **Current State**: Completely missing. No data directory, no training scripts, no serialized models, no FastAPI inference service.
- **Requirements**:
  - Validated public clinical dataset (e.g., Pima Indians Diabetes Database from National Institute of Diabetes and Digestive and Kidney Diseases).
  - Preprocessing pipeline: handle zero-imputed implausible clinical values (Glucose, BloodPressure, SkinThickness, Insulin, BMI).
  - Train and cross-evaluate baseline models: Logistic Regression, Decision Tree, Random Forest.
  - Metrics: Precision, Recall, F1-score, ROC-AUC, Confusion Matrix.
  - Export trained pipeline and build a production-grade FastAPI inference API with strict Pydantic validation and medical disclaimers.

### 3.3 Backend Services (`backend/`)
- **Current State**: Gradle Spring Boot 4.1.1 + Kotlin 2.3.21 on Java 25. Only contains default spring boot initializer template. No REST controllers, DTOs, or service layer.
- **Primary Database Requirement**: Cloud Firestore is the designated primary database. Spring Boot backend will provide REST endpoints, Firebase token verification, validation, and healthcare domain logic.

### 3.4 Mobile Application (`mobile/`)
- **Current State**: Only a 17-line `README.md`. Flutter is not installed in the current environment PATH, but a clean, structured Flutter application codebase (Dart classes, models, services, screens, and Firebase integration) will be built so it can be compiled/run in any Flutter SDK environment.

### 3.5 Database & Authentication (WMAD Requirement)
- **Authentication**: Currently absent. User accounts are unmanaged.
- **Database**: No cloud database connected.
- **Requirement**: Full Firebase SDK integration (`firebase` npm package) supporting Firebase Auth (email/password, session persistence) and Cloud Firestore (collections: `users`, `medical_records`, `medications`, `appointments`, `timeline_events`), plus Firestore security rules and offline demo fallback mode.

---

## 4. Technical Debt & Immediate Action Plan

| Priority | Item | Risk | Mitigation |
|---|---|---|---|
| P1 | UI/UX & Design System overhaul | High visual inconsistency | Implement comprehensive CSS design tokens matching emerald/white palette |
| P1 | Modularize React Web Client | Spaghetti code in main.jsx | Extract into `components/`, `services/`, `pages/`, `context/` |
| P2 | Real Diabetes ML Workflow | SMLD academic requirement missing | Train Logistic Regression, Decision Tree, Random Forest on Pima Diabetes dataset; build FastAPI serving API |
| P3 | Firebase Auth & Firestore | Mandatory WMAD requirement | Install Firebase SDK, implement auth state provider, Firestore CRUD services, security rules, and demo fallback |
| P4 | Spring Boot REST API | WMAD backend requirement | Implement Kotlin controllers, DTOs, service layer, and integration tests |
| P5 | Flutter Companion App | Mobile requirement | Build structured Flutter Dart application matching data models and REST/Firebase APIs |
| P6 | Agile & Academic Documentation | ASDD requirement | Generate full Epics, User Stories, Acceptance Criteria, and viva preparation guide |
