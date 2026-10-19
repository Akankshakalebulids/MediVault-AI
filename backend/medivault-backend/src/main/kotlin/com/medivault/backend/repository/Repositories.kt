package com.medivault.backend.repository

import com.medivault.backend.model.*
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface UserProfileRepository : JpaRepository<UserProfileEntity, Long> {
    fun findByUserId(userId: String): UserProfileEntity?
}

@Repository
interface MedicalRecordRepository : JpaRepository<MedicalRecordEntity, Long> {
    fun findByUserId(userId: String): List<MedicalRecordEntity>
    fun findByUserIdAndCategory(userId: String, category: String): List<MedicalRecordEntity>
    fun findByIdAndUserId(id: Long, userId: String): MedicalRecordEntity?
    fun findByUserIdOrderByDateDesc(userId: String): List<MedicalRecordEntity>
}

@Repository
interface MedicationRepository : JpaRepository<MedicationEntity, Long> {
    fun findByUserId(userId: String): List<MedicationEntity>
    fun findByUserIdAndStatus(userId: String, status: String): List<MedicationEntity>
    fun findByIdAndUserId(id: Long, userId: String): MedicationEntity?
}

@Repository
interface AppointmentRepository : JpaRepository<AppointmentEntity, Long> {
    fun findByUserId(userId: String): List<AppointmentEntity>
    fun findByUserIdAndStatus(userId: String, status: String): List<AppointmentEntity>
    fun findByIdAndUserId(id: Long, userId: String): AppointmentEntity?
}

@Repository
interface TimelineEventRepository : JpaRepository<TimelineEventEntity, Long> {
    fun findByUserIdOrderByDateDesc(userId: String): List<TimelineEventEntity>
}
