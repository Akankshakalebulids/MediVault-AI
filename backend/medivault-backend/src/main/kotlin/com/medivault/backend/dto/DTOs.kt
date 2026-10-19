package com.medivault.backend.dto

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

// ── Error Response ──

data class ErrorResponse(
    val status: Int,
    val error: String,
    val message: String,
    val timestamp: String = java.time.LocalDateTime.now().toString()
)
