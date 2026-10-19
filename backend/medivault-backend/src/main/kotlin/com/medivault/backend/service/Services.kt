package com.medivault.backend.service

import com.medivault.backend.dto.*
import com.medivault.backend.exception.ResourceNotFoundException
import com.medivault.backend.model.*
import com.medivault.backend.repository.*
import org.springframework.stereotype.Service

@Service
class MedicalRecordService(
    private val repository: MedicalRecordRepository,
    private val timelineService: TimelineService
) {
    fun getRecords(userId: String, category: String?): List<MedicalRecordEntity> {
        return if (category != null && category.isNotBlank() && category != "All") {
            repository.findByUserIdAndCategory(userId, category)
        } else {
            repository.findByUserIdOrderByDateDesc(userId)
        }
    }

    fun getRecordById(id: Long, userId: String): MedicalRecordEntity {
        return repository.findByIdAndUserId(id, userId)
            ?: throw ResourceNotFoundException("Medical record not found or access denied")
    }

    fun createRecord(userId: String, request: MedicalRecordRequest): MedicalRecordEntity {
        val entity = MedicalRecordEntity(
            userId = userId,
            title = request.title.trim(),
            category = request.category,
            doctor = request.doctor.trim(),
            facility = request.facility.trim(),
            date = request.date,
            diagnosisNotes = request.diagnosisNotes.trim(),
            status = request.status
        )
        val saved = repository.save(entity)

        timelineService.addEvent(userId, TimelineEventEntity(
            userId = userId,
            type = "RECORD_ADDED",
            title = "Medical Record Added: ${saved.title}",
            description = "${saved.category} filed by ${saved.doctor.ifBlank { "Healthcare Provider" }}.",
            date = saved.date.ifBlank { java.time.LocalDate.now().toString() },
            category = "Record"
        ))

        return saved
    }

    fun updateRecord(id: Long, userId: String, request: MedicalRecordUpdateRequest): MedicalRecordEntity {
        val entity = repository.findByIdAndUserId(id, userId)
            ?: throw ResourceNotFoundException("Medical record not found or access denied")
        request.title?.let { entity.title = it.trim() }
        request.category?.let { entity.category = it }
        request.doctor?.let { entity.doctor = it.trim() }
        request.facility?.let { entity.facility = it.trim() }
        request.date?.let { entity.date = it }
        request.diagnosisNotes?.let { entity.diagnosisNotes = it.trim() }
        request.status?.let { entity.status = it }
        return repository.save(entity)
    }

    fun deleteRecord(id: Long, userId: String) {
        val entity = repository.findByIdAndUserId(id, userId)
            ?: throw ResourceNotFoundException("Medical record not found or access denied")
        repository.delete(entity)
    }
}

@Service
class MedicationService(
    private val repository: MedicationRepository,
    private val timelineService: TimelineService
) {
    fun getMedications(userId: String): List<MedicationEntity> {
        return repository.findByUserId(userId)
    }

    fun createMedication(userId: String, request: MedicationRequest): MedicationEntity {
        val entity = MedicationEntity(
            userId = userId,
            name = request.name.trim(),
            dose = request.dose.trim(),
            frequency = request.frequency,
            time = request.time,
            status = request.status,
            instructions = request.instructions.trim(),
            startDate = request.startDate
        )
        val saved = repository.save(entity)

        timelineService.addEvent(userId, TimelineEventEntity(
            userId = userId,
            type = "MED_STARTED",
            title = "New Medication Scheduled: ${saved.name}",
            description = "Dosage: ${saved.dose} · Schedule: ${saved.frequency} at ${saved.time}.",
            date = java.time.LocalDate.now().toString(),
            category = "Medication"
        ))

        return saved
    }

    fun updateMedication(id: Long, userId: String, request: MedicationUpdateRequest): MedicationEntity {
        val entity = repository.findByIdAndUserId(id, userId)
            ?: throw ResourceNotFoundException("Medication not found or access denied")
        request.name?.let { entity.name = it.trim() }
        request.dose?.let { entity.dose = it.trim() }
        request.frequency?.let { entity.frequency = it }
        request.time?.let { entity.time = it }
        request.status?.let { entity.status = it }
        request.instructions?.let { entity.instructions = it.trim() }
        return repository.save(entity)
    }

    fun deleteMedication(id: Long, userId: String) {
        val entity = repository.findByIdAndUserId(id, userId)
            ?: throw ResourceNotFoundException("Medication not found or access denied")
        repository.delete(entity)
    }
}

@Service
class AppointmentService(
    private val repository: AppointmentRepository,
    private val timelineService: TimelineService
) {
    fun getAppointments(userId: String): List<AppointmentEntity> {
        return repository.findByUserId(userId)
    }

    fun createAppointment(userId: String, request: AppointmentRequest): AppointmentEntity {
        val entity = AppointmentEntity(
            userId = userId,
            doctorName = request.doctorName.trim(),
            specialty = request.specialty,
            clinicLocation = request.clinicLocation.trim(),
            dateTime = request.dateTime,
            reason = request.reason.trim(),
            status = request.status,
            notes = request.notes.trim()
        )
        val saved = repository.save(entity)

        timelineService.addEvent(userId, TimelineEventEntity(
            userId = userId,
            type = "APPT_SCHEDULED",
            title = "Appointment Booked with ${saved.doctorName}",
            description = "${saved.specialty} consultation at ${saved.clinicLocation}.",
            date = saved.dateTime.split("T").firstOrNull() ?: java.time.LocalDate.now().toString(),
            category = "Appointment"
        ))

        return saved
    }

    fun updateAppointment(id: Long, userId: String, request: AppointmentUpdateRequest): AppointmentEntity {
        val entity = repository.findByIdAndUserId(id, userId)
            ?: throw ResourceNotFoundException("Appointment not found or access denied")
        request.doctorName?.let { entity.doctorName = it.trim() }
        request.specialty?.let { entity.specialty = it }
        request.clinicLocation?.let { entity.clinicLocation = it.trim() }
        request.dateTime?.let { entity.dateTime = it }
        request.reason?.let { entity.reason = it.trim() }
        request.status?.let { entity.status = it }
        request.notes?.let { entity.notes = it.trim() }
        return repository.save(entity)
    }

    fun deleteAppointment(id: Long, userId: String) {
        val entity = repository.findByIdAndUserId(id, userId)
            ?: throw ResourceNotFoundException("Appointment not found or access denied")
        repository.delete(entity)
    }
}

@Service
class TimelineService(
    private val repository: TimelineEventRepository,
    private val recordRepo: MedicalRecordRepository,
    private val medRepo: MedicationRepository,
    private val apptRepo: AppointmentRepository
) {
    fun getTimeline(userId: String): List<TimelineEventResponse> {
        val events = mutableListOf<TimelineEventResponse>()

        // Add persisted timeline events
        repository.findByUserIdOrderByDateDesc(userId).forEach { e ->
            events.add(TimelineEventResponse(
                id = "tl-${e.id}",
                title = e.title,
                description = e.description,
                date = e.date,
                category = e.category,
                type = e.type
            ))
        }

        // Also aggregate from records, medications, appointments
        recordRepo.findByUserId(userId).forEach { r ->
            events.add(TimelineEventResponse(
                id = "rec-${r.id}",
                title = "Medical Record: ${r.title}",
                description = "${r.category} reviewed at ${r.facility} under ${r.doctor}.",
                date = r.date,
                category = "Record",
                type = "RECORD_ADDED"
            ))
        }

        apptRepo.findByUserId(userId).forEach { a ->
            events.add(TimelineEventResponse(
                id = "apt-${a.id}",
                title = "Care Visit: ${a.doctorName}",
                description = "${a.specialty} consultation at ${a.clinicLocation} (${a.status}).",
                date = a.dateTime.split("T").firstOrNull() ?: a.dateTime,
                category = "Appointment",
                type = "APPT_SCHEDULED"
            ))
        }

        medRepo.findByUserId(userId).forEach { m ->
            events.add(TimelineEventResponse(
                id = "med-${m.id}",
                title = "Prescription Logged: ${m.name}",
                description = "Dosage ${m.dose} · Schedule ${m.frequency} at ${m.time}.",
                date = m.startDate.ifBlank { "2026-03-01" },
                category = "Medication",
                type = "MED_STARTED"
            ))
        }

        // Deduplicate by title+date and sort descending
        val seen = mutableSetOf<String>()
        return events.filter { e ->
            val key = "${e.date}_${e.title}"
            seen.add(key)
        }.sortedByDescending { it.date }
    }

    fun addEvent(userId: String, entity: TimelineEventEntity): TimelineEventEntity {
        return repository.save(entity)
    }
}

@Service
class UserProfileService(
    private val repository: UserProfileRepository
) {
    fun getProfile(userId: String): UserProfileEntity {
        return repository.findByUserId(userId)
            ?: throw ResourceNotFoundException("User profile not found for userId: $userId")
    }

    fun getOrCreateProfile(userId: String): UserProfileEntity {
        return repository.findByUserId(userId) ?: repository.save(
            UserProfileEntity(userId = userId)
        )
    }

    fun upsertProfile(userId: String, request: UserProfileRequest): UserProfileEntity {
        val entity = repository.findByUserId(userId) ?: UserProfileEntity(userId = userId)
        if (request.displayName.isNotBlank()) entity.displayName = request.displayName.trim()
        if (request.email.isNotBlank()) entity.email = request.email.trim()
        if (request.bloodGroup.isNotBlank()) entity.bloodGroup = request.bloodGroup
        if (request.dateOfBirth.isNotBlank()) entity.dateOfBirth = request.dateOfBirth
        if (request.emergencyContact.isNotBlank()) entity.emergencyContact = request.emergencyContact.trim()
        if (request.phone.isNotBlank()) entity.phone = request.phone.trim()
        entity.updatedAt = java.time.LocalDateTime.now()
        return repository.save(entity)
    }
}
