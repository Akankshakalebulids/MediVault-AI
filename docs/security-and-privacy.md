# MediVault AI — Security, Privacy & Data Isolation Architecture

**Classification**: Healthcare Systems Security Specification  
**Compliance Context**: Indian Digital Information Security in Healthcare Act (DISHA), HIPAA Technical Safeguards (45 CFR § 164.312), and GDPR Privacy Principles  
**Date**: October 2026  

---

## 1. Security Architecture Principles

MediVault AI handles sensitive protected health information (PHI) and personal healthcare financial transactions in Indian Rupees (₹). The platform is engineered according to three foundational security tenets:
1. **Zero Cross-Tenant Leakage**: No user or caregiver should ever access, modify, or query health records, documents, or expenses belonging to another account.
2. **Defense in Depth**: Security validations are enforced redundantly across the Client, API Gateway / Controllers, Service Layer, Database Repositories, and Cloud Rules.
3. **Structured RFC-7807 Error Handling**: Error messages never leak internal database stack traces, SQL syntax, or server environment paths to external callers.

---

## 2. Tenancy & Authorization Scoping

### 2.1 Backend Scoping (Kotlin Spring Boot)
Every query executed against the relational database mandates user-ownership isolation:
```kotlin
// Repositories enforce userId in all retrieval and deletion methods
fun findByUserIdOrderByDateDesc(userId: String): List<MedicalRecordEntity>
fun findByIdAndUserId(id: Long, userId: String): MedicalRecordEntity?
fun findByUserIdAndBillNumber(userId: String, billNumber: String): List<MedicalExpenseEntity>
```
If a user attempts to update or delete a record with an ID that exists but belongs to a different `userId`, the service layer deliberately throws a `ResourceNotFoundException`:
```kotlin
val entity = repository.findByIdAndUserId(id, userId)
    ?: throw ResourceNotFoundException("Resource not found or access denied")
```
This prevents enumeration attacks, as unauthorized callers cannot distinguish between nonexistent record IDs and records belonging to other tenants.

### 2.2 Cloud Firestore Scoping (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Strictly isolate user collection trees
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
Cross-user reads, wildcard queries, and unauthenticated writes are explicitly rejected by the security engine.

---

## 3. Storage Security & Document Handling

### 3.1 Local Binary Upload Security
Uploaded diagnostic documents (PDFs, prescription images) processed by `MedicalDocumentService`:
* **Sanitization**: Original filenames are stripped of dangerous path-traversal characters (`../`, `\`, colons, null bytes) using regex replacement:
  ```kotlin
  val sanitized = originalFilename.replace("[^a-zA-Z0-9._-]".toRegex(), "_")
  val storedName = "${System.currentTimeMillis()}_$sanitized"
  ```
* **Storage Location**: Files are stored outside web-accessible public directories in an isolated `uploads/` folder.
* **Controlled Streaming**: Files are downloaded exclusively through authenticated Spring Boot controller endpoints (`GET /api/v1/documents/{id}/download`), which verify ownership before streaming bytes with appropriate `Content-Disposition` headers.

---

## 4. Input Validation & API Hardening

### 4.1 Jakarta Validation Constraints
All request payloads are strictly validated against Spring's Jakarta validation engine before entering business logic:
* `@field:NotBlank(message = "Title cannot be blank")`
* Explicit non-negative boundaries on financial amounts.

### 4.2 Machine Learning Input Validation (Pydantic)
The FastAPI inference server (`ml/api.py`) rejects non-physiological inputs (e.g., negative glucose, impossible blood pressures) with HTTP $422$ Unprocessable Entity:
```python
@field_validator("glucose")
@classmethod
def validate_glucose(cls, v: float) -> float:
    if v < 0.0 or v > 500.0:
        raise ValueError("Glucose must be between 0.0 and 500.0 mg/dL")
    return v
```

---

## 5. Centralized Exception Handling (RFC 7807)

MediVault AI implements a centralized `@RestControllerAdvice` in `GlobalExceptionHandler.kt`:
* $400$ Bad Request: Validation constraint failures.
* $403$ Forbidden: Authorization violations.
* $404$ Not Found: Resource absence or cross-tenant access.
* $500$ Internal Server Error: Sanitized generic message avoiding stack-trace leakage.

```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Medical record not found or access denied",
  "timestamp": "2026-10-21T13:10:00"
}
```
