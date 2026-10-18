package com.medivault.backend.model

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import java.time.LocalDateTime

@Entity
@Table(name = "medical_records")
data class MedicalRecordEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false)
    var userId: String = "default_user",

    @field:NotBlank(message = "Record title is required")
    @Column(nullable = false)
    var title: String = "",

    var category: String = "Laboratory",
    var doctor: String = "",
    var facility: String = "",
    var date: String = "",

    @Column(length = 2000)
    var diagnosisNotes: String = "",

    var status: String = "Reviewed",
    var createdAt: LocalDateTime = LocalDateTime.now()
)

@Entity
@Table(name = "medications")
data class MedicationEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false)
    var userId: String = "default_user",

    @field:NotBlank(message = "Medication name is required")
    @Column(nullable = false)
    var name: String = "",

    var dose: String = "",
    var frequency: String = "Once daily",
    var time: String = "08:00 AM",
    var status: String = "Active",
    var instructions: String = "",
    var startDate: String = "",
    var createdAt: LocalDateTime = LocalDateTime.now()
)

@Entity
@Table(name = "appointments")
data class AppointmentEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false)
    var userId: String = "default_user",

    @field:NotBlank(message = "Doctor name is required")
    @Column(nullable = false)
    var doctorName: String = "",

    var specialty: String = "General Medicine",
    var clinicLocation: String = "",
    var dateTime: String = "",
    var reason: String = "",
    var status: String = "Confirmed",
    var notes: String = "",
    var createdAt: LocalDateTime = LocalDateTime.now()
)
