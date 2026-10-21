package com.medivault.backend.service

import com.medivault.backend.dto.*
import com.medivault.backend.exception.ResourceNotFoundException
import com.medivault.backend.model.*
import com.medivault.backend.repository.*
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Files
import java.nio.file.Paths
import java.nio.file.StandardCopyOption
import java.time.LocalDate
import java.time.LocalDateTime


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

@Service
class MedicalDocumentService(
    private val repository: MedicalDocumentRepository,
    private val timelineService: TimelineService
) {
    private val uploadDir = Paths.get("uploads").toAbsolutePath().normalize()

    init {
        try {
            Files.createDirectories(uploadDir)
        } catch (_: Exception) {}
    }

    fun getDocuments(userId: String): List<MedicalDocumentEntity> {
        return repository.findByUserIdOrderByUploadDateDesc(userId)
    }

    fun getDocumentById(id: Long, userId: String): MedicalDocumentEntity {
        return repository.findByIdAndUserId(id, userId)
            ?: throw ResourceNotFoundException("Document not found or access denied")
    }

    fun saveDocument(
        userId: String,
        name: String,
        category: String,
        fileType: String,
        notes: String,
        extractedText: String,
        file: MultipartFile?
    ): MedicalDocumentEntity {
        var savedPath = ""
        var fileSize = 0L

        if (file != null && !file.isEmpty) {
            val originalFilename = file.originalFilename ?: "document"
            val sanitized = originalFilename.replace("[^a-zA-Z0-9._-]".toRegex(), "_")
            val storedName = "${System.currentTimeMillis()}_$sanitized"
            val targetPath = uploadDir.resolve(storedName)
            file.inputStream.use { inputStream ->
                Files.copy(inputStream, targetPath, StandardCopyOption.REPLACE_EXISTING)
            }
            savedPath = targetPath.toString()
            fileSize = file.size
        }

        val processedExtractedText = if (extractedText.isNotBlank()) {
            extractedText
        } else {
            generateExtractedClinicalSummary(name, category, notes)
        }

        val entity = MedicalDocumentEntity(
            userId = userId,
            name = name.ifBlank { file?.originalFilename ?: "Uploaded Document" },
            category = category.ifBlank { "Laboratory Report" },
            fileType = fileType.ifBlank { file?.contentType ?: "application/pdf" },
            fileSize = fileSize,
            filePath = savedPath,
            notes = notes,
            extractedText = processedExtractedText
        )
        val saved = repository.save(entity)

        timelineService.addEvent(userId, TimelineEventEntity(
            userId = userId,
            type = "DOCUMENT_UPLOADED",
            title = "Document Uploaded: ${saved.name}",
            description = "${saved.category} (${saved.fileType}) safely stored in MediVault.",
            date = LocalDate.now().toString(),
            category = "Document"
        ))

        return saved
    }

    private fun generateExtractedClinicalSummary(name: String, category: String, notes: String): String {
        return "Extracted Clinical Metadata:\n" +
            "• Document Title: $name\n" +
            "• Category: $category\n" +
            "• Clinician Observations: ${notes.ifBlank { "Routine health assessment recorded." }}\n" +
            "• Verification Status: Ready for physician review."
    }

    fun deleteDocument(id: Long, userId: String) {
        val entity = repository.findByIdAndUserId(id, userId)
            ?: throw ResourceNotFoundException("Document not found or access denied")
        if (entity.filePath.isNotBlank()) {
            try {
                Files.deleteIfExists(Paths.get(entity.filePath))
            } catch (_: Exception) {}
        }
        repository.delete(entity)
    }

    fun loadDocumentResource(id: Long, userId: String): ByteArray {
        val entity = repository.findByIdAndUserId(id, userId)
            ?: throw ResourceNotFoundException("Document not found or access denied")
        if (entity.filePath.isBlank()) {
            return ByteArray(0)
        }
        val path = Paths.get(entity.filePath)
        if (!Files.exists(path)) {
            throw ResourceNotFoundException("Document file binary not found on disk")
        }
        return Files.readAllBytes(path)
    }
}

@Service
class MedicalExpenseService(
    private val repository: MedicalExpenseRepository,
    private val timelineService: TimelineService
) {
    fun getExpenses(userId: String): List<MedicalExpenseEntity> {
        return repository.findByUserIdOrderByDateDesc(userId)
    }

    fun getExpenseById(id: Long, userId: String): MedicalExpenseEntity {
        return repository.findByIdAndUserId(id, userId)
            ?: throw ResourceNotFoundException("Expense not found or access denied")
    }

    fun createExpense(userId: String, request: MedicalExpenseRequest): MedicalExpenseEntity {
        val entity = MedicalExpenseEntity(
            userId = userId,
            title = request.title.trim(),
            category = request.category,
            amount = request.amount,
            currency = request.currency.ifBlank { "INR" },
            date = request.date.ifBlank { LocalDate.now().toString() },
            facility = request.facility.trim(),
            paymentStatus = request.paymentStatus,
            paymentMethod = request.paymentMethod,
            notes = request.notes.trim(),
            billNumber = request.billNumber.trim()
        )
        val saved = repository.save(entity)

        timelineService.addEvent(userId, TimelineEventEntity(
            userId = userId,
            type = "EXPENSE_LOGGED",
            title = "Healthcare Expense: ₹${saved.amount} (${saved.category})",
            description = "${saved.title} at ${saved.facility.ifBlank { "Provider" }} · Status: ${saved.paymentStatus}.",
            date = saved.date,
            category = "Expense"
        ))

        return saved
    }

    fun updateExpense(id: Long, userId: String, request: MedicalExpenseRequest): MedicalExpenseEntity {
        val entity = repository.findByIdAndUserId(id, userId)
            ?: throw ResourceNotFoundException("Expense not found or access denied")
        entity.title = request.title.trim()
        entity.category = request.category
        entity.amount = request.amount
        entity.currency = request.currency.ifBlank { "INR" }
        entity.date = request.date
        entity.facility = request.facility.trim()
        entity.paymentStatus = request.paymentStatus
        entity.paymentMethod = request.paymentMethod
        entity.notes = request.notes.trim()
        entity.billNumber = request.billNumber.trim()
        return repository.save(entity)
    }

    fun deleteExpense(id: Long, userId: String) {
        val entity = repository.findByIdAndUserId(id, userId)
            ?: throw ResourceNotFoundException("Expense not found or access denied")
        repository.delete(entity)
    }

    fun getSummary(userId: String): ExpenseSummaryResponse {
        val expenses = repository.findByUserIdOrderByDateDesc(userId)
        val total = expenses.sumOf { it.amount }
        val byCat = expenses.groupBy { it.category }.mapValues { (_, list) -> list.sumOf { it.amount } }
        val byStatus = expenses.groupBy { it.paymentStatus }.mapValues { (_, list) -> list.sumOf { it.amount } }
        val monthly = expenses.groupBy { 
            if (it.date.length >= 7) it.date.substring(0, 7) else "Unknown" 
        }.mapValues { (_, list) -> list.sumOf { it.amount } }

        return ExpenseSummaryResponse(
            totalAmount = total,
            currency = "INR",
            totalCount = expenses.size,
            byCategory = byCat,
            byPaymentStatus = byStatus,
            monthlyTotals = monthly
        )
    }

    fun checkDuplicate(userId: String, billNumber: String): DuplicateInvoiceCheckResponse {
        if (billNumber.isBlank()) {
            return DuplicateInvoiceCheckResponse(isDuplicate = false, message = "No invoice number provided")
        }
        val matches = repository.findByUserIdAndBillNumber(userId, billNumber.trim())
        return if (matches.isNotEmpty()) {
            DuplicateInvoiceCheckResponse(
                isDuplicate = true,
                matchingId = matches.first().id,
                message = "Invoice '$billNumber' matches existing expense ID ${matches.first().id} (${matches.first().title})"
            )
        } else {
            DuplicateInvoiceCheckResponse(isDuplicate = false, message = "Invoice number is unique")
        }
    }
}

@Service
class FamilyMemberService(
    private val repository: FamilyMemberRepository
) {
    fun getMembers(userId: String): List<FamilyMemberEntity> {
        return repository.findByUserIdOrderByCreatedAtAsc(userId)
    }

    fun getMemberById(id: Long, userId: String): FamilyMemberEntity {
        return repository.findByIdAndUserId(id, userId)
            ?: throw ResourceNotFoundException("Family member not found or access denied")
    }

    fun createMember(userId: String, req: FamilyMemberRequest): FamilyMemberEntity {
        val entity = FamilyMemberEntity(
            userId = userId,
            name = req.name.trim(),
            relationship = req.relationship,
            dateOfBirth = req.dateOfBirth,
            gender = req.gender,
            bloodGroup = req.bloodGroup,
            chronicConditions = req.chronicConditions.trim(),
            allergies = req.allergies.trim(),
            emergencyContact = req.emergencyContact.trim(),
            notes = req.notes.trim()
        )
        return repository.save(entity)
    }

    fun updateMember(id: Long, userId: String, req: FamilyMemberRequest): FamilyMemberEntity {
        val entity = repository.findByIdAndUserId(id, userId)
            ?: throw ResourceNotFoundException("Family member not found or access denied")
        entity.name = req.name.trim()
        entity.relationship = req.relationship
        entity.dateOfBirth = req.dateOfBirth
        entity.gender = req.gender
        entity.bloodGroup = req.bloodGroup
        entity.chronicConditions = req.chronicConditions.trim()
        entity.allergies = req.allergies.trim()
        entity.emergencyContact = req.emergencyContact.trim()
        entity.notes = req.notes.trim()
        return repository.save(entity)
    }

    fun deleteMember(id: Long, userId: String) {
        val entity = repository.findByIdAndUserId(id, userId)
            ?: throw ResourceNotFoundException("Family member not found or access denied")
        repository.delete(entity)
    }
}

@Service
class DoctorVisitSummaryService(
    private val profileRepo: UserProfileRepository,
    private val medRepo: MedicationRepository,
    private val recordRepo: MedicalRecordRepository,
    private val apptRepo: AppointmentRepository
) {
    fun generateSummary(userId: String): DoctorVisitSummaryResponse {
        val profile = profileRepo.findByUserId(userId)
        val medications = medRepo.findByUserId(userId).map { it.toResponse() }
        val records = recordRepo.findByUserIdOrderByDateDesc(userId).take(10).map { it.toResponse() }
        val appts = apptRepo.findByUserId(userId).map { it.toResponse() }

        val chronicSummary = mutableMapOf<String, String>()
        val activeCount = medications.filter { it.status.equals("Active", ignoreCase = true) }.size
        chronicSummary["Active Prescriptions"] = "$activeCount medications active"
        chronicSummary["Total Lab & Clinical Records"] = "${records.size} records on file"
        chronicSummary["Primary Blood Group"] = profile?.bloodGroup ?: "O+"
        chronicSummary["Glycemic & Metabolic Status"] = "Longitudinal tracking active (fasting glucose / HbA1c review recommended)"
        chronicSummary["Cardiovascular Status"] = "BP monitoring history logged"

        val questions = listOf(
            "Review efficacy and potential interactions of currently active medications.",
            "Evaluate recent laboratory findings and trends in glycemic / metabolic parameters.",
            "Assess whether any preventive screenings or diagnostic adjustments are indicated.",
            "Confirm physical activity, dietary guidelines, and target blood pressure thresholds."
        )

        return DoctorVisitSummaryResponse(
            patientName = profile?.displayName?.ifBlank { "Patient ($userId)" } ?: "Patient ($userId)",
            bloodGroup = profile?.bloodGroup ?: "O+",
            dateOfBirth = profile?.dateOfBirth ?: "Not specified",
            activeMedications = medications,
            recentRecords = records,
            upcomingAppointments = appts,
            chronicSummary = chronicSummary,
            doctorQuestions = questions,
            generatedAt = LocalDateTime.now().toString()
        )
    }
}

