package com.medivault.backend.dto

import jakarta.validation.constraints.NotBlank

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

data class TimelineEventResponse(
    val id: String,
    val title: String,
    val description: String,
    val date: String,
    val category: String
)
