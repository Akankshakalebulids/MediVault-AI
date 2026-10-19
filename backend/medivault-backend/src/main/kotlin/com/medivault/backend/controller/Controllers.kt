package com.medivault.backend.controller

import com.medivault.backend.dto.*
import com.medivault.backend.service.*
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

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
// Entity → Response Extension Functions
// ═══════════════════════════════════════════════════════════════════════════════

private fun com.medivault.backend.model.MedicalRecordEntity.toResponse() = MedicalRecordResponse(
    id = id!!,
    userId = userId,
    title = title,
    category = category,
    doctor = doctor,
    facility = facility,
    date = date,
    diagnosisNotes = diagnosisNotes,
    status = status,
    createdAt = createdAt.toString()
)

private fun com.medivault.backend.model.MedicationEntity.toResponse() = MedicationResponse(
    id = id!!,
    userId = userId,
    name = name,
    dose = dose,
    frequency = frequency,
    time = time,
    status = status,
    instructions = instructions,
    startDate = startDate,
    createdAt = createdAt.toString()
)

private fun com.medivault.backend.model.AppointmentEntity.toResponse() = AppointmentResponse(
    id = id!!,
    userId = userId,
    doctorName = doctorName,
    specialty = specialty,
    clinicLocation = clinicLocation,
    dateTime = dateTime,
    reason = reason,
    status = status,
    notes = notes,
    createdAt = createdAt.toString()
)
