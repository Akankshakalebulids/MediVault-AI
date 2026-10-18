# MediVault AI — Web & Mobile Application Development (WMAD) Evidence

**Course**: WMAD (Web and Mobile Application Development)  
**Deliverables**: React Web Client, Firebase Auth & Firestore, Kotlin Spring Boot REST API, Flutter Companion Mobile App  
**Status**: Implemented & Verified

---

## 1. Firebase Authentication & Cloud Firestore (Required WMAD Milestone)

### 1.1 Architecture & Security Rules
- **SDK Integration**: Web client uses `@firebase/app`, `@firebase/auth`, and `@firebase/firestore` (`firebaseConfig.js`).
- **Data Scoping**: Collections are scoped hierarchically under `users/{userId}/` to guarantee strict patient privacy:
  ```
  users/{userId}/
  ├── medical_records/{recordId}
  ├── medications/{medicationId}
  ├── appointments/{appointmentId}
  └── timeline_events/{eventId}
  ```
- **Security Rules (`firestore.rules`)**:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /users/{userId}/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
  ```
- **Transparent Local Demo Fallback**: When environment variables are absent, MediVault AI switches smoothly to Local Demo Mode (`localStorage`), preventing crashes while providing full CRUD testing capabilities for academic viva presentations.

---

## 2. Kotlin + Spring Boot REST API

### 2.1 Technology Stack
- **Language**: Kotlin 2.3.21 on OpenJDK 25 LTS
- **Framework**: Spring Boot 4.1.1 (`spring-boot-starter-webmvc`, `spring-boot-starter-data-jpa`, `spring-boot-starter-validation`)
- **Persistence**: In-memory H2 database (`jdbc:h2:mem:medivaultdb`) with auto DDL generation and pre-seeded sample records (`DataInitializer.kt`).
- **Build Tool**: Gradle 9.7.1 wrapper (`gradlew.bat`).
- **Test Results**: All automated tests pass (`BUILD SUCCESSFUL in 1m 13s`, 5 actionable tasks executed).

### 2.2 Endpoints Inventory
| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `GET` | `/api/v1/records` | Fetch patient records with category filter | 200 OK |
| `POST` | `/api/v1/records` | Create new validated medical record | 201 Created |
| `DELETE` | `/api/v1/records/{id}` | Delete medical record | 204 No Content |
| `GET` | `/api/v1/medications` | Fetch patient medication schedule | 200 OK |
| `POST` | `/api/v1/medications` | Register medication schedule | 201 Created |
| `PUT` | `/api/v1/medications/{id}`| Toggle status (Active / Paused) | 200 OK |
| `DELETE` | `/api/v1/medications/{id}`| Remove medication | 204 No Content |
| `GET` | `/api/v1/appointments` | Fetch scheduled care appointments | 200 OK |
| `POST` | `/api/v1/appointments` | Schedule new appointment | 201 Created |
| `PUT` | `/api/v1/appointments/{id}`| Update appointment status (Completed / Cancelled) | 200 OK |
| `GET` | `/api/v1/timeline` | Longitudinal aggregated health feed | 200 OK |

---

## 3. Flutter Mobile Companion Application

### 3.1 Technology Stack
- **Language & Framework**: Dart 3.x / Flutter 3.x (`mobile/medivault_mobile/`)
- **Design Alignment**: Clean healthcare theme matching emerald (`#087F5B`) and white surfaces.
- **Components Built**:
  - `DashboardScreen`: Health overview and one-tap launch into AI Screener.
  - `RecordsScreen`: Diagnostic reports and physician notes.
  - `ScreeningScreen`: Mobile parameter inputs with real-time risk probability calculation.
  - `ApiService`: REST consumer interfacing with Spring Boot and FastAPI ML inference services.

---

## 4. WMAD Viva Defense Checklist
- [x] React single-page application with responsive layouts.
- [x] Firebase Authentication workflow and configuration template (`.env.example`).
- [x] Cloud Firestore security rules with user-isolated collections.
- [x] Kotlin Spring Boot REST controllers with DTO validation.
- [x] Clean architecture across client, API gateway, and database layers.
- [x] Fully functional Flutter mobile project structure.
