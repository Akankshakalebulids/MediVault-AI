package com.medivault.backend.controller

import com.medivault.backend.dto.*
import com.medivault.backend.model.AppointmentEntity
import com.medivault.backend.model.MedicalRecordEntity
import com.medivault.backend.model.MedicationEntity
import com.medivault.backend.repository.AppointmentRepository
import com.medivault.backend.repository.MedicalRecordRepository
import com.medivault.backend.repository.MedicationRepository
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/records")
class MedicalRecordController(
    private val recordRepo: MedicalRecordRepository
) {
    @GetMapping
    fun getAllRecords(
        @RequestParam(defaultValue = "demo_user") userId: String,
        @RequestParam(required = false) category: String?
    ): List<MedicalRecordEntity> {
        return if (category != null && category != "All") {
            recordRepo.findByUserIdAndCategory(userId, category)
        } else {
            recordRepo.findByUserId(userId)
        }
    }

    @PostMapping
    fun createRecord(
        @RequestParam(defaultValue = "demo_user") userId: String,
        @Valid @RequestBody req: MedicalRecordRequest
    ): ResponseEntity<MedicalRecordEntity> {
        val entity = MedicalRecordEntity(
            userId = userId,
            title = req.title,
            category = req.category,
            doctor = req.doctor,
            facility = req.facility,
            date = req.date,
            diagnosisNotes = req.diagnosisNotes,
            status = req.status
        )
        val saved = recordRepo.save(entity)
        return ResponseEntity.status(HttpStatus.CREATED).body(saved)
    }

    @DeleteMapping("/{id}")
    fun deleteRecord(@PathVariable id: Long): ResponseEntity<Void> {
        return if (recordRepo.existsById(id)) {
            recordRepo.deleteById(id)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
}

@RestController
@RequestMapping("/api/v1/medications")
class MedicationController(
    private val medRepo: MedicationRepository
) {
    @GetMapping
    fun getMedications(
        @RequestParam(defaultValue = "demo_user") userId: String
    ): List<MedicationEntity> {
        return medRepo.findByUserId(userId)
    }

    @PostMapping
    fun createMedication(
        @RequestParam(defaultValue = "demo_user") userId: String,
        @Valid @RequestBody req: MedicationRequest
    ): ResponseEntity<MedicationEntity> {
        val entity = MedicationEntity(
            userId = userId,
            name = req.name,
            dose = req.dose,
            frequency = req.frequency,
            time = req.time,
            status = req.status,
            instructions = req.instructions,
            startDate = req.startDate
        )
        val saved = medRepo.save(entity)
        return ResponseEntity.status(HttpStatus.CREATED).body(saved)
    }

    @PutMapping("/{id}")
    fun updateMedication(
        @PathVariable id: Long,
        @RequestBody updates: Map<String, Any>
    ): ResponseEntity<MedicationEntity> {
        val existing = medRepo.findById(id)
        if (existing.isEmpty) return ResponseEntity.notFound().build()

        val med = existing.get()
        updates["status"]?.let { med.status = it.toString() }
        updates["time"]?.let { med.time = it.toString() }
        updates["dose"]?.let { med.dose = it.toString() }
        val saved = medRepo.save(med)
        return ResponseEntity.ok(saved)
    }

    @DeleteMapping("/{id}")
    fun deleteMedication(@PathVariable id: Long): ResponseEntity<Void> {
        return if (medRepo.existsById(id)) {
            medRepo.deleteById(id)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }
}

@RestController
@RequestMapping("/api/v1/appointments")
class AppointmentController(
    private val apptRepo: AppointmentRepository
) {
    @GetMapping
    fun getAppointments(
        @RequestParam(defaultValue = "demo_user") userId: String
    ): List<AppointmentEntity> {
        return apptRepo.findByUserId(userId)
    }

    @PostMapping
    fun createAppointment(
        @RequestParam(defaultValue = "demo_user") userId: String,
        @Valid @RequestBody req: AppointmentRequest
    ): ResponseEntity<AppointmentEntity> {
        val entity = AppointmentEntity(
            userId = userId,
            doctorName = req.doctorName,
            specialty = req.specialty,
            clinicLocation = req.clinicLocation,
            dateTime = req.dateTime,
            reason = req.reason,
            status = req.status,
            notes = req.notes
        )
        val saved = apptRepo.save(entity)
        return ResponseEntity.status(HttpStatus.CREATED).body(saved)
    }

    @PutMapping("/{id}")
    fun updateAppointment(
        @PathVariable id: Long,
        @RequestBody updates: Map<String, Any>
    ): ResponseEntity<AppointmentEntity> {
        val existing = apptRepo.findById(id)
        if (existing.isEmpty) return ResponseEntity.notFound().build()

        val appt = existing.get()
        updates["status"]?.let { appt.status = it.toString() }
        val saved = apptRepo.save(appt)
        return ResponseEntity.ok(saved)
    }
}

@RestController
@RequestMapping("/api/v1/timeline")
class HealthTimelineController(
    private val recordRepo: MedicalRecordRepository,
    private val medRepo: MedicationRepository,
    private val apptRepo: AppointmentRepository
) {
    @GetMapping
    fun getTimeline(
        @RequestParam(defaultValue = "demo_user") userId: String
    ): List<TimelineEventResponse> {
        val events = mutableListOf<TimelineEventResponse>()

        recordRepo.findByUserId(userId).forEach { r ->
            events.add(
                TimelineEventResponse(
                    id = "rec-${r.id}",
                    title = "Medical Record: ${r.title}",
                    description = "${r.category} reviewed at ${r.facility} under ${r.doctor}.",
                    date = r.date,
                    category = "Record"
                )
            )
        }

        apptRepo.findByUserId(userId).forEach { a ->
            events.add(
                TimelineEventResponse(
                    id = "apt-${a.id}",
                    title = "Care Visit: ${a.doctorName}",
                    description = "${a.specialty} consultation at ${a.clinicLocation} (${a.status}).",
                    date = a.dateTime.split("T").firstOrNull() ?: a.dateTime,
                    category = "Appointment"
                )
            )
        }

        medRepo.findByUserId(userId).forEach { m ->
            events.add(
                TimelineEventResponse(
                    id = "med-${m.id}",
                    title = "Prescription Logged: ${m.name}",
                    description = "Dosage ${m.dose} · Schedule ${m.frequency} at ${m.time}.",
                    date = m.startDate.ifBlank { "2026-03-01" },
                    category = "Medication"
                )
            )
        }

        return events.sortedByDescending { it.date }
    }
}
