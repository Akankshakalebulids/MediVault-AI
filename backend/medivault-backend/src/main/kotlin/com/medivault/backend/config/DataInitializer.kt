package com.medivault.backend.config

import com.medivault.backend.model.AppointmentEntity
import com.medivault.backend.model.MedicalRecordEntity
import com.medivault.backend.model.MedicationEntity
import com.medivault.backend.repository.AppointmentRepository
import com.medivault.backend.repository.MedicalRecordRepository
import com.medivault.backend.repository.MedicationRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class DataInitializer {

    @Bean
    fun seedInitialData(
        recordRepo: MedicalRecordRepository,
        medRepo: MedicationRepository,
        apptRepo: AppointmentRepository
    ): CommandLineRunner {
        return CommandLineRunner {
            if (recordRepo.count() == 0L) {
                recordRepo.save(
                    MedicalRecordEntity(
                        userId = "demo_user",
                        title = "Comprehensive Metabolic Panel (CMP)",
                        category = "Laboratory",
                        doctor = "Dr. Ananya Mehta, MD",
                        facility = "Metro Diagnostics Centre",
                        date = "2026-09-28",
                        diagnosisNotes = "Fasting blood glucose 98 mg/dL (normal). Kidney and liver functions clear.",
                        status = "Reviewed"
                    )
                )
                recordRepo.save(
                    MedicalRecordEntity(
                        userId = "demo_user",
                        title = "Quarterly Endocrine Consultation",
                        category = "Consultation",
                        doctor = "Dr. Rajesh Shah, MD",
                        facility = "City Care Specialty Clinic",
                        date = "2026-09-12",
                        diagnosisNotes = "Routine preventative checkup. Recommended maintaining aerobic activity 150 mins/week.",
                        status = "Completed"
                    )
                )
            }

            if (medRepo.count() == 0L) {
                medRepo.save(
                    MedicationEntity(
                        userId = "demo_user",
                        name = "Vitamin D3",
                        dose = "1000 IU",
                        frequency = "Once daily",
                        time = "08:00 AM",
                        status = "Active",
                        instructions = "Take with breakfast.",
                        startDate = "2026-01-10"
                    )
                )
                medRepo.save(
                    MedicationEntity(
                        userId = "demo_user",
                        name = "Metformin",
                        dose = "500 mg",
                        frequency = "Once daily",
                        time = "09:00 PM",
                        status = "Active",
                        instructions = "Take after dinner with water.",
                        startDate = "2026-03-15"
                    )
                )
            }

            if (apptRepo.count() == 0L) {
                apptRepo.save(
                    AppointmentEntity(
                        userId = "demo_user",
                        doctorName = "Dr. Rajesh Shah",
                        specialty = "Endocrinology",
                        clinicLocation = "City Care Clinic · Suite 402",
                        dateTime = "2026-10-25T10:30",
                        reason = "Quarterly preventative metabolic review",
                        status = "Confirmed"
                    )
                )
            }
        }
    }
}
