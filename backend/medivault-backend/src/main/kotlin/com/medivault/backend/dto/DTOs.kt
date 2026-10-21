package com.medivault.backend.dto

import com.medivault.backend.model.*
import jakarta.validation.constraints.NotBlank

// ── Medical Records ──

data class MedicalRecordRequest(
    @field:NotBlank(message = "Title cannot be blank")
    val title: String,
    val category: String = "Laboratory",
    val doctor: String = "",
    val facility: String = "",
    val date: String = "",
    val diagnosisNotes: String = "",
    val status: String = "Reviewed"
)

data class MedicalRecordUpdateRequest(
    val title: String? = null,
    val category: String? = null,
    val doctor: String? = null,
    val facility: String? = null,
    val date: String? = null,
    val diagnosisNotes: String? = null,
    val status: String? = null
)

data class MedicalRecordResponse(
    val id: Long,
    val userId: String,
    val title: String,
    val category: String,
    val doctor: String,
    val facility: String,
    val date: String,
    val diagnosisNotes: String,
    val status: String,
    val createdAt: String
)

// ── Medications ──

data class MedicationRequest(
    @field:NotBlank(message = "Medication name cannot be blank")
    val name: String,
    val dose: String = "",
    val frequency: String = "Once daily",
    val time: String = "08:00 AM",
    val status: String = "Active",
    val instructions: String = "",
    val startDate: String = ""
)

data class MedicationUpdateRequest(
    val name: String? = null,
    val dose: String? = null,
    val frequency: String? = null,
    val time: String? = null,
    val status: String? = null,
    val instructions: String? = null
)

data class MedicationResponse(
    val id: Long,
    val userId: String,
    val name: String,
    val dose: String,
    val frequency: String,
    val time: String,
    val status: String,
    val instructions: String,
    val startDate: String,
    val createdAt: String
)

// ── Appointments ──

data class AppointmentRequest(
    @field:NotBlank(message = "Doctor name cannot be blank")
    val doctorName: String,
    val specialty: String = "General Medicine",
    val clinicLocation: String = "",
    val dateTime: String = "",
    val reason: String = "",
    val status: String = "Confirmed",
    val notes: String = ""
)

data class AppointmentUpdateRequest(
    val doctorName: String? = null,
    val specialty: String? = null,
    val clinicLocation: String? = null,
    val dateTime: String? = null,
    val reason: String? = null,
    val status: String? = null,
    val notes: String? = null
)

data class AppointmentResponse(
    val id: Long,
    val userId: String,
    val doctorName: String,
    val specialty: String,
    val clinicLocation: String,
    val dateTime: String,
    val reason: String,
    val status: String,
    val notes: String,
    val createdAt: String
)

// ── Timeline ──

data class TimelineEventResponse(
    val id: String,
    val title: String,
    val description: String,
    val date: String,
    val category: String,
    val type: String = "GENERAL"
)

// ── User Profile ──

data class UserProfileRequest(
    val displayName: String = "",
    val email: String = "",
    val bloodGroup: String = "O+",
    val dateOfBirth: String = "",
    val emergencyContact: String = "",
    val phone: String = ""
)

data class UserProfileResponse(
    val id: Long,
    val userId: String,
    val displayName: String,
    val email: String,
    val bloodGroup: String,
    val dateOfBirth: String,
    val emergencyContact: String,
    val phone: String,
    val updatedAt: String
)

// ── Health Check ──

data class HealthCheckResponse(
    val status: String,
    val service: String,
    val version: String,
    val database: String,
    val uptime: String
)

// ── Medical Documents Vault ──

data class MedicalDocumentRequest(
    val name: String,
    val category: String = "Laboratory Report",
    val fileType: String = "application/pdf",
    val notes: String = "",
    val extractedText: String = ""
)

data class MedicalDocumentResponse(
    val id: Long,
    val userId: String,
    val name: String,
    val category: String,
    val fileType: String,
    val fileSize: Long,
    val uploadDate: String,
    val notes: String,
    val extractedText: String
)

// ── Medical Expenses Tracker ──

data class MedicalExpenseRequest(
    val title: String,
    val category: String = "Doctor Consultations",
    val amount: Double,
    val currency: String = "INR",
    val date: String = "",
    val facility: String = "",
    val paymentStatus: String = "Paid",
    val paymentMethod: String = "UPI / Card",
    val notes: String = "",
    val billNumber: String = ""
)

data class MedicalExpenseResponse(
    val id: Long,
    val userId: String,
    val title: String,
    val category: String,
    val amount: Double,
    val currency: String,
    val date: String,
    val facility: String,
    val paymentStatus: String,
    val paymentMethod: String,
    val notes: String,
    val billNumber: String,
    val createdAt: String
)

// ── Family Profiles ──

data class FamilyMemberRequest(
    val name: String,
    val relationship: String = "Self",
    val dateOfBirth: String = "",
    val gender: String = "Other",
    val bloodGroup: String = "O+",
    val chronicConditions: String = "",
    val allergies: String = "",
    val emergencyContact: String = "",
    val notes: String = ""
)

data class FamilyMemberResponse(
    val id: Long,
    val userId: String,
    val name: String,
    val relationship: String,
    val dateOfBirth: String,
    val gender: String,
    val bloodGroup: String,
    val chronicConditions: String,
    val allergies: String,
    val emergencyContact: String,
    val notes: String,
    val createdAt: String
)

// ── Medical Expenses Tracker Summary & Deduplication ──

data class ExpenseSummaryResponse(
    val totalAmount: Double,
    val currency: String = "INR",
    val totalCount: Int,
    val byCategory: Map<String, Double>,
    val byPaymentStatus: Map<String, Double>,
    val monthlyTotals: Map<String, Double>
)

data class DuplicateInvoiceCheckResponse(
    val isDuplicate: Boolean,
    val matchingId: Long? = null,
    val message: String
)

// ── Doctor Visit Summary ──

data class DoctorVisitSummaryResponse(
    val patientName: String,
    val bloodGroup: String,
    val dateOfBirth: String,
    val activeMedications: List<MedicationResponse>,
    val recentRecords: List<MedicalRecordResponse>,
    val upcomingAppointments: List<AppointmentResponse>,
    val chronicSummary: Map<String, String>,
    val doctorQuestions: List<String>,
    val generatedAt: String
)

// ── Error Response ──

data class ErrorResponse(
    val status: Int,
    val error: String,
    val message: String,
    val timestamp: String = java.time.LocalDateTime.now().toString()
)

// ── Entity to DTO Mappings ──


fun MedicalRecordEntity.toResponse() = MedicalRecordResponse(
    id = id ?: 0L,
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

fun MedicationEntity.toResponse() = MedicationResponse(
    id = id ?: 0L,
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

fun AppointmentEntity.toResponse() = AppointmentResponse(
    id = id ?: 0L,
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

fun MedicalDocumentEntity.toResponse() = MedicalDocumentResponse(
    id = id ?: 0L,
    userId = userId,
    name = name,
    category = category,
    fileType = fileType,
    fileSize = fileSize,
    uploadDate = uploadDate.toString(),
    notes = notes,
    extractedText = extractedText
)

fun MedicalExpenseEntity.toResponse() = MedicalExpenseResponse(
    id = id ?: 0L,
    userId = userId,
    title = title,
    category = category,
    amount = amount,
    currency = currency,
    date = date,
    facility = facility,
    paymentStatus = paymentStatus,
    paymentMethod = paymentMethod,
    notes = notes,
    billNumber = billNumber,
    createdAt = createdAt.toString()
)

fun FamilyMemberEntity.toResponse() = FamilyMemberResponse(
    id = id ?: 0L,
    userId = userId,
    name = name,
    relationship = relationship,
    dateOfBirth = dateOfBirth,
    gender = gender,
    bloodGroup = bloodGroup,
    chronicConditions = chronicConditions,
    allergies = allergies,
    emergencyContact = emergencyContact,
    notes = notes,
    createdAt = createdAt.toString()
)



