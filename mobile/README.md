# MediVault AI — Flutter Mobile Companion Application

**Academic Component**: WMAD (Web and Mobile Application Development)  
**Framework**: Flutter 3.x / Dart 3.x  
**Visual Identity**: Mandatory Green + White Theme (`#087F5B` Primary Emerald)

---

## 1. Overview
The `medivault_mobile` project is a companion mobile application designed for cross-platform iOS and Android healthcare tracking. It interfaces with:
1. **Spring Boot REST API** (`http://10.0.2.2:8080/api/v1` on Android Emulator / `http://localhost:8080/api/v1` on iOS Simulator) for medical records, medications, and appointment scheduling.
2. **FastAPI ML Inference Service** (`http://10.0.2.2:8000/api/v1/predict/diabetes`) for educational diabetes risk screening.
3. **Local Calibrated Fallback**: If backend services are unreachable, the mobile app utilizes persistent local demo models so evaluators can inspect screens without network dependencies.

---

## 2. Implemented Mobile Screens
- **Dashboard Screen** (`lib/screens/dashboard_screen.dart`): Health status metrics, daily medication schedule with checkmarks, quick action button launching the AI Screener.
- **Medical Records Screen** (`lib/screens/records_screen.dart`): Categorized diagnostic records, attending physician information, clinical notes.
- **Diabetes Screening Screen** (`lib/screens/screening_screen.dart`): Real-time parameter inputs (Glucose, BMI, Age, Blood Pressure), risk probability calculation, color-coded risk badge, and clinical safety disclaimers.
- **Unified Navigation Shell** (`lib/main.dart`): Material 3 bottom navigation bar with green active indicators.

---

## 3. Project Directory Structure
```
mobile/
├── README.md
└── medivault_mobile/
    ├── pubspec.yaml
    └── lib/
        ├── main.dart
        ├── theme/
        │   └── app_theme.dart          # Green-and-white healthcare design tokens
        ├── models/
        │   └── models.dart             # MedicalRecord, Medication, Appointment, Prediction
        ├── services/
        │   └── api_service.dart        # Spring Boot & FastAPI client connectors
        └── screens/
            ├── dashboard_screen.dart
            ├── records_screen.dart
            └── screening_screen.dart
```

---

## 4. How to Run on a Flutter Development Environment
```bash
cd mobile/medivault_mobile
flutter pub get
flutter run
```
*Note: In environments where Flutter SDK is not installed on PATH, the codebase is fully structured and ready for automated compilation in Android Studio, VS Code, or CI/CD pipelines.*
