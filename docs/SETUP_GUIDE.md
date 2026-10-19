# MediVault AI — Complete Local Setup & Run Guide
**Operating System**: Windows (PowerShell)  
**Academic Target**: ASDD Submission, SMLD/WMAD Coursework, Portfolio Evaluation

---

## 1. Prerequisites Checklist

Ensure the following runtimes are installed on your Windows machine:
- **Java**: OpenJDK 17 or 21+ (`java -version`)
- **Node.js**: v18+ (`node -v`)
- **Python**: 3.10+ (`python --version`)
- **Flutter SDK**: 3.x+ (Optional, for mobile app development)

---

## 2. Spring Boot Backend (Port 8080)

The Spring Boot backend handles medical records, medications, appointments, user profiles, and aggregated health timelines with JPA entity persistence (in-memory H2 for development, PostgreSQL profile available for production).

```powershell
# Navigate to backend directory
cd backend/medivault-backend

# Run complete test suite (includes MockMvc and JPA integration tests)
./gradlew test

# Start the Spring Boot backend server
./gradlew bootRun
```

- **Health Endpoint**: `http://localhost:8080/api/v1/health`
- **H2 Console** (when enabled): `http://localhost:8080/h2-console`
- **Default Port**: 8080

---

## 3. FastAPI Machine Learning Service (Port 8000)

The ML subsystem provides clinical diabetes risk inference using a trained Random Forest pipeline on the Pima Indians Diabetes Dataset (NIDDK).

```powershell
# Navigate to ml directory
cd ml

# (Optional) Activate your Python virtual environment
# python -m venv venv
# .\venv\Scripts\Activate.ps1

# Install required dependencies
pip install -r requirements.txt

# Execute ML automated test suite
python -m pytest tests/ -v

# Start FastAPI server via Uvicorn
python -m uvicorn api:app --host 127.0.0.1 --port 8000 --reload
```

- **Health Check**: `http://127.0.0.1:8000/health`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`
- **Model Metadata**: `http://127.0.0.1:8000/api/v1/model-info`

---

## 4. React Web Frontend (Port 5173)

The web dashboard is built with React and Vite. It connects seamlessly to the Spring Boot REST API, FastAPI ML service, or falls back to Cloud Firestore / browser demo mode.

```powershell
# Navigate to web directory
cd web

# Install dependencies (if not already installed)
npm.cmd install

# Build production bundle to verify compilation
npm.cmd run build

# Start Vite development server
npm.cmd run dev
```

- **Dashboard URL**: `http://localhost:5173`
- If the Spring Boot backend is running on `8080`, the status banner turns blue with `Spring Boot REST Backend Connected`.
- If the backend is stopped, it gracefully falls back to browser demo mode / Cloud Firestore.

---

## 5. Flutter Mobile Application

The Flutter companion app provides on-the-go health tracking, medication reminders, appointment views, and mobile diabetes screening.

```powershell
# Navigate to mobile app directory
cd mobile/medivault_mobile

# Fetch packages
flutter pub get

# Run on connected device or emulator
flutter run
```

---

## 6. End-to-End Verification Quick Commands

To test all components quickly in PowerShell:

```powershell
# 1. Test Backend
cd backend/medivault-backend; ./gradlew test; cd ../..

# 2. Test ML Suite
python -m pytest ml/tests/ -v

# 3. Test Frontend Build
cd web; npm.cmd run build; cd ..
```
