package com.medivault.backend.repository

import com.medivault.backend.model.AppointmentEntity
import com.medivault.backend.model.MedicalRecordEntity
import com.medivault.backend.model.MedicationEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MedicalRecordRepository : JpaRepository<MedicalRecordEntity, Long> {
    fun findByUserId(userId: String): List<MedicalRecordEntity>
    fun findByUserIdAndCategory(userId: String, category: String): List<MedicalRecordEntity>
}

@Repository
interface MedicationRepository : JpaRepository<MedicationEntity, Long> {
    fun findByUserId(userId: String): List<MedicationEntity>
    fun findByUserIdAndStatus(userId: String, status: String): List<MedicationEntity>
}

@Repository
interface AppointmentRepository : JpaRepository<AppointmentEntity, Long> {
    fun findByUserId(userId: String): List<AppointmentEntity>
    fun findByUserIdAndStatus(userId: String, status: String): List<AppointmentEntity>
}
