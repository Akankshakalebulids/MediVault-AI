package com.medivault.backend.controller

import com.medivault.backend.dto.*
import com.medivault.backend.service.*
import jakarta.validation.Valid
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile


// ═══════════════════════════════════════════════════════════════════════════════
// Health Check Controller
// ═══════════════════════════════════════════════════════════════════════════════

@RestController
class HealthController {
    private val startTime = System.currentTimeMillis()

    @GetMapping("/health")
    fun health(): HealthCheckResponse {
        val uptimeMs = System.currentTimeMillis() - startTime
        val uptimeSec = uptimeMs / 1000
        val hours = uptimeSec / 3600
        val minutes = (uptimeSec % 3600) / 60
        val seconds = uptimeSec % 60
        return HealthCheckResponse(
            status = "healthy",
            service = "MediVault Spring Boot Backend",
            version = "1.0.0",
            database = "H2 (dev) / PostgreSQL (prod)",
            uptime = "${hours}h ${minutes}m ${seconds}s"
        )
    }

    @GetMapping("/api/v1/health")
    fun apiHealth(): HealthCheckResponse = health()
}

// ═══════════════════════════════════════════════════════════════════════════════
// User Profile Controller
// ═══════════════════════════════════════════════════════════════════════════════

@RestController
@RequestMapping("/api/v1/profile")
class UserProfileController(
    private val profileService: UserProfileService
) {
    @GetMapping
    fun getProfile(
        @RequestParam(defaultValue = "demo_user") userId: String
    ): ResponseEntity<UserProfileResponse> {
        val profile = profileService.getOrCreateProfile(userId)
        return ResponseEntity.ok(UserProfileResponse(
            id = profile.id!!,
            userId = profile.userId,
            displayName = profile.displayName,
            email = profile.email,
            bloodGroup = profile.bloodGroup,
            dateOfBirth = profile.dateOfBirth,
            emergencyContact = profile.emergencyContact,
            phone = profile.phone,
            updatedAt = profile.updatedAt.toString()
        ))
    }

    @PutMapping
    fun updateProfile(
        @RequestParam(defaultValue = "demo_user") userId: String,
        @RequestBody request: UserProfileRequest
    ): ResponseEntity<UserProfileResponse> {
        val profile = profileService.upsertProfile(userId, request)
        return ResponseEntity.ok(UserProfileResponse(
            id = profile.id!!,
            userId = profile.userId,
            displayName = profile.displayName,
            email = profile.email,
            bloodGroup = profile.bloodGroup,
            dateOfBirth = profile.dateOfBirth,
            emergencyContact = profile.emergencyContact,
            phone = profile.phone,
            updatedAt = profile.updatedAt.toString()
        ))
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Medical Records Controller
// ═══════════════════════════════════════════════════════════════════════════════

@RestController
@RequestMapping("/api/v1/records")
class MedicalRecordController(
    private val recordService: MedicalRecordService
) {
    @GetMapping
    fun getAllRecords(
        @RequestParam(defaultValue = "demo_user") userId: String,
        @RequestParam(required = false) category: String?
    ): ResponseEntity<List<MedicalRecordResponse>> {
        val records = recordService.getRecords(userId, category)
        return ResponseEntity.ok(records.map { it.toResponse() })
    }

    @GetMapping("/{id}")
    fun getRecord(
        @PathVariable id: Long,
        @RequestParam(defaultValue = "demo_user") userId: String
    ): ResponseEntity<MedicalRecordResponse> {
        val record = recordService.getRecordById(id, userId)
        return ResponseEntity.ok(record.toResponse())
    }

    @PostMapping
    fun createRecord(
        @RequestParam(defaultValue = "demo_user") userId: String,
        @Valid @RequestBody req: MedicalRecordRequest
    ): ResponseEntity<MedicalRecordResponse> {
        val saved = recordService.createRecord(userId, req)
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.toResponse())
    }

    @PutMapping("/{id}")
    fun updateRecord(
        @PathVariable id: Long,
        @RequestParam(defaultValue = "demo_user") userId: String,
        @RequestBody req: MedicalRecordUpdateRequest
    ): ResponseEntity<MedicalRecordResponse> {
        val updated = recordService.updateRecord(id, userId, req)
        return ResponseEntity.ok(updated.toResponse())
    }

    @DeleteMapping("/{id}")
    fun deleteRecord(
        @PathVariable id: Long,
        @RequestParam(defaultValue = "demo_user") userId: String
    ): ResponseEntity<Void> {
        recordService.deleteRecord(id, userId)
        return ResponseEntity.noContent().build()
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Medications Controller
// ═══════════════════════════════════════════════════════════════════════════════

@RestController
@RequestMapping("/api/v1/medications")
class MedicationController(
    private val medicationService: MedicationService
) {
    @GetMapping
    fun getMedications(
        @RequestParam(defaultValue = "demo_user") userId: String
    ): ResponseEntity<List<MedicationResponse>> {
        val meds = medicationService.getMedications(userId)
        return ResponseEntity.ok(meds.map { it.toResponse() })
    }

    @PostMapping
    fun createMedication(
        @RequestParam(defaultValue = "demo_user") userId: String,
        @Valid @RequestBody req: MedicationRequest
    ): ResponseEntity<MedicationResponse> {
        val saved = medicationService.createMedication(userId, req)
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.toResponse())
    }

    @PutMapping("/{id}")
    fun updateMedication(
        @PathVariable id: Long,
        @RequestParam(defaultValue = "demo_user") userId: String,
        @RequestBody req: MedicationUpdateRequest
    ): ResponseEntity<MedicationResponse> {
        val updated = medicationService.updateMedication(id, userId, req)
        return ResponseEntity.ok(updated.toResponse())
    }

    @DeleteMapping("/{id}")
    fun deleteMedication(
        @PathVariable id: Long,
        @RequestParam(defaultValue = "demo_user") userId: String
    ): ResponseEntity<Void> {
        medicationService.deleteMedication(id, userId)
        return ResponseEntity.noContent().build()
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Appointments Controller
// ═══════════════════════════════════════════════════════════════════════════════

@RestController
@RequestMapping("/api/v1/appointments")
class AppointmentController(
    private val appointmentService: AppointmentService
) {
    @GetMapping
    fun getAppointments(
        @RequestParam(defaultValue = "demo_user") userId: String
    ): ResponseEntity<List<AppointmentResponse>> {
        val appts = appointmentService.getAppointments(userId)
        return ResponseEntity.ok(appts.map { it.toResponse() })
    }

    @PostMapping
    fun createAppointment(
        @RequestParam(defaultValue = "demo_user") userId: String,
        @Valid @RequestBody req: AppointmentRequest
    ): ResponseEntity<AppointmentResponse> {
        val saved = appointmentService.createAppointment(userId, req)
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.toResponse())
    }

    @PutMapping("/{id}")
    fun updateAppointment(
        @PathVariable id: Long,
        @RequestParam(defaultValue = "demo_user") userId: String,
        @RequestBody req: AppointmentUpdateRequest
    ): ResponseEntity<AppointmentResponse> {
        val updated = appointmentService.updateAppointment(id, userId, req)
        return ResponseEntity.ok(updated.toResponse())
    }

    @DeleteMapping("/{id}")
    fun deleteAppointment(
        @PathVariable id: Long,
        @RequestParam(defaultValue = "demo_user") userId: String
    ): ResponseEntity<Void> {
        appointmentService.deleteAppointment(id, userId)
        return ResponseEntity.noContent().build()
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Health Timeline Controller
// ═══════════════════════════════════════════════════════════════════════════════

@RestController
@RequestMapping("/api/v1/timeline")
class HealthTimelineController(
    private val timelineService: TimelineService
) {
    @GetMapping
    fun getTimeline(
        @RequestParam(defaultValue = "demo_user") userId: String
    ): ResponseEntity<List<TimelineEventResponse>> {
        return ResponseEntity.ok(timelineService.getTimeline(userId))
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Medical Documents Controller
// ═══════════════════════════════════════════════════════════════════════════════

@RestController
@RequestMapping("/api/v1/documents")
class MedicalDocumentController(
    private val documentService: MedicalDocumentService
) {
    @GetMapping
    fun getAllDocuments(
        @RequestParam(defaultValue = "demo_user") userId: String
    ): ResponseEntity<List<MedicalDocumentResponse>> {
        val docs = documentService.getDocuments(userId)
        return ResponseEntity.ok(docs.map { it.toResponse() })
    }

    @GetMapping("/{id}")
    fun getDocument(
        @PathVariable id: Long,
        @RequestParam(defaultValue = "demo_user") userId: String
    ): ResponseEntity<MedicalDocumentResponse> {
        val doc = documentService.getDocumentById(id, userId)
        return ResponseEntity.ok(doc.toResponse())
    }

    @PostMapping
    fun createDocumentMetadata(
        @RequestParam(defaultValue = "demo_user") userId: String,
        @Valid @RequestBody req: MedicalDocumentRequest
    ): ResponseEntity<MedicalDocumentResponse> {
        val doc = documentService.saveDocument(
            userId = userId,
            name = req.name,
            category = req.category,
            fileType = req.fileType,
            notes = req.notes,
            extractedText = req.extractedText,
            file = null
        )
        return ResponseEntity.status(HttpStatus.CREATED).body(doc.toResponse())
    }

    @PostMapping("/upload", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun uploadDocument(
        @RequestParam(defaultValue = "demo_user") userId: String,
        @RequestParam("file") file: MultipartFile,
        @RequestParam(defaultValue = "") name: String,
        @RequestParam(defaultValue = "Laboratory Report") category: String,
        @RequestParam(defaultValue = "") notes: String,
        @RequestParam(defaultValue = "") extractedText: String
    ): ResponseEntity<MedicalDocumentResponse> {
        val doc = documentService.saveDocument(
            userId = userId,
            name = name,
            category = category,
            fileType = file.contentType ?: "application/octet-stream",
            notes = notes,
            extractedText = extractedText,
            file = file
        )
        return ResponseEntity.status(HttpStatus.CREATED).body(doc.toResponse())
    }

    @GetMapping("/{id}/download")
    fun downloadDocument(
        @PathVariable id: Long,
        @RequestParam(defaultValue = "demo_user") userId: String
    ): ResponseEntity<ByteArray> {
        val doc = documentService.getDocumentById(id, userId)
        val data = documentService.loadDocumentResource(id, userId)
        val mediaType = try {
            MediaType.parseMediaType(doc.fileType)
        } catch (_: Exception) {
            MediaType.APPLICATION_OCTET_STREAM
        }
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"${doc.name}\"")
            .contentType(mediaType)
            .body(data)
    }

    @DeleteMapping("/{id}")
    fun deleteDocument(
        @PathVariable id: Long,
        @RequestParam(defaultValue = "demo_user") userId: String
    ): ResponseEntity<Void> {
        documentService.deleteDocument(id, userId)
        return ResponseEntity.noContent().build()
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Medical Expenses Controller
// ═══════════════════════════════════════════════════════════════════════════════

@RestController
@RequestMapping("/api/v1/expenses")
class MedicalExpenseController(
    private val expenseService: MedicalExpenseService
) {
    @GetMapping
    fun getAllExpenses(
        @RequestParam(defaultValue = "demo_user") userId: String
    ): ResponseEntity<List<MedicalExpenseResponse>> {
        val expenses = expenseService.getExpenses(userId)
        return ResponseEntity.ok(expenses.map { it.toResponse() })
    }

    @GetMapping("/summary")
    fun getSummary(
        @RequestParam(defaultValue = "demo_user") userId: String
    ): ResponseEntity<ExpenseSummaryResponse> {
        return ResponseEntity.ok(expenseService.getSummary(userId))
    }

    @GetMapping("/check-duplicate")
    fun checkDuplicate(
        @RequestParam(defaultValue = "demo_user") userId: String,
        @RequestParam billNumber: String
    ): ResponseEntity<DuplicateInvoiceCheckResponse> {
        return ResponseEntity.ok(expenseService.checkDuplicate(userId, billNumber))
    }

    @GetMapping("/{id}")
    fun getExpense(
        @PathVariable id: Long,
        @RequestParam(defaultValue = "demo_user") userId: String
    ): ResponseEntity<MedicalExpenseResponse> {
        val expense = expenseService.getExpenseById(id, userId)
        return ResponseEntity.ok(expense.toResponse())
    }

    @PostMapping
    fun createExpense(
        @RequestParam(defaultValue = "demo_user") userId: String,
        @Valid @RequestBody req: MedicalExpenseRequest
    ): ResponseEntity<MedicalExpenseResponse> {
        val saved = expenseService.createExpense(userId, req)
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.toResponse())
    }

    @PutMapping("/{id}")
    fun updateExpense(
        @PathVariable id: Long,
        @RequestParam(defaultValue = "demo_user") userId: String,
        @RequestBody req: MedicalExpenseRequest
    ): ResponseEntity<MedicalExpenseResponse> {
        val updated = expenseService.updateExpense(id, userId, req)
        return ResponseEntity.ok(updated.toResponse())
    }

    @DeleteMapping("/{id}")
    fun deleteExpense(
        @PathVariable id: Long,
        @RequestParam(defaultValue = "demo_user") userId: String
    ): ResponseEntity<Void> {
        expenseService.deleteExpense(id, userId)
        return ResponseEntity.noContent().build()
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Family Profiles Controller
// ═══════════════════════════════════════════════════════════════════════════════

@RestController
@RequestMapping("/api/v1/family")
class FamilyMemberController(
    private val familyService: FamilyMemberService
) {
    @GetMapping
    fun getMembers(
        @RequestParam(defaultValue = "demo_user") userId: String
    ): ResponseEntity<List<FamilyMemberResponse>> {
        val members = familyService.getMembers(userId)
        return ResponseEntity.ok(members.map { it.toResponse() })
    }

    @GetMapping("/{id}")
    fun getMember(
        @PathVariable id: Long,
        @RequestParam(defaultValue = "demo_user") userId: String
    ): ResponseEntity<FamilyMemberResponse> {
        val member = familyService.getMemberById(id, userId)
        return ResponseEntity.ok(member.toResponse())
    }

    @PostMapping
    fun createMember(
        @RequestParam(defaultValue = "demo_user") userId: String,
        @Valid @RequestBody req: FamilyMemberRequest
    ): ResponseEntity<FamilyMemberResponse> {
        val saved = familyService.createMember(userId, req)
        return ResponseEntity.status(HttpStatus.CREATED).body(saved.toResponse())
    }

    @PutMapping("/{id}")
    fun updateMember(
        @PathVariable id: Long,
        @RequestParam(defaultValue = "demo_user") userId: String,
        @RequestBody req: FamilyMemberRequest
    ): ResponseEntity<FamilyMemberResponse> {
        val updated = familyService.updateMember(id, userId, req)
        return ResponseEntity.ok(updated.toResponse())
    }

    @DeleteMapping("/{id}")
    fun deleteMember(
        @PathVariable id: Long,
        @RequestParam(defaultValue = "demo_user") userId: String
    ): ResponseEntity<Void> {
        familyService.deleteMember(id, userId)
        return ResponseEntity.noContent().build()
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Doctor-Visit Summary Controller
// ═══════════════════════════════════════════════════════════════════════════════

@RestController
@RequestMapping("/api/v1/summary")
class DoctorVisitSummaryController(
    private val summaryService: DoctorVisitSummaryService
) {
    @GetMapping("/doctor-visit")
    fun getDoctorVisitSummary(
        @RequestParam(defaultValue = "demo_user") userId: String
    ): ResponseEntity<DoctorVisitSummaryResponse> {
        return ResponseEntity.ok(summaryService.generateSummary(userId))
    }
}

