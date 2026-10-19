package com.medivault.backend

import com.medivault.backend.controller.*
import com.medivault.backend.dto.*
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class ApiControllerTests {

    @Autowired
    private lateinit var healthController: HealthController

    @Autowired
    private lateinit var recordController: MedicalRecordController

    @Autowired
    private lateinit var medicationController: MedicationController

    @Autowired
    private lateinit var appointmentController: AppointmentController

    @Autowired
    private lateinit var timelineController: HealthTimelineController

    @Autowired
    private lateinit var userProfileController: UserProfileController

    @Test
    fun testHealthEndpoint() {
        val health = healthController.health()
        assertEquals("healthy", health.status)
        assertEquals("MediVault Spring Boot Backend", health.service)
        assertEquals("1.0.0", health.version)
        assertNotNull(health.uptime)
    }

    @Test
    fun testMedicalRecordLifecycle() {
        val userId = "test_user_rec_1"
        val createReq = MedicalRecordRequest(
            title = "Annual Health Screening",
            category = "Laboratory",
            doctor = "Dr. Alice Smith",
            facility = "Metropolis Health Center",
            date = "2026-04-10",
            diagnosisNotes = "Vitals normal, cholesterol within bounds",
            status = "Reviewed"
        )

        // Create
        val createResp = recordController.createRecord(userId, createReq)
        assertEquals(201, createResp.statusCode.value())
        val record = createResp.body!!
        assertEquals("Annual Health Screening", record.title)
        assertEquals(userId, record.userId)
        assertNotNull(record.id)

        // Read list
        val listResp = recordController.getAllRecords(userId, null)
        assertEquals(200, listResp.statusCode.value())
        val list = listResp.body!!
        assertTrue(list.any { it.id == record.id })

        // Read single
        val getResp = recordController.getRecord(record.id, userId)
        assertEquals(200, getResp.statusCode.value())
        assertEquals("Annual Health Screening", getResp.body!!.title)

        // Update
        val updateReq = MedicalRecordUpdateRequest(
            title = "Annual Health Screening - Updated",
            status = "Archived"
        )
        val updateResp = recordController.updateRecord(record.id, userId, updateReq)
        assertEquals(200, updateResp.statusCode.value())
        assertEquals("Annual Health Screening - Updated", updateResp.body!!.title)
        assertEquals("Archived", updateResp.body!!.status)

        // Delete
        val delResp = recordController.deleteRecord(record.id, userId)
        assertEquals(204, delResp.statusCode.value())
    }

    @Test
    fun testMedicationLifecycle() {
        val userId = "test_user_med_1"
        val req = MedicationRequest(
            name = "Metformin",
            dose = "500mg",
            frequency = "Twice daily",
            time = "08:00 AM",
            status = "Active",
            instructions = "Take with meals",
            startDate = "2026-01-15"
        )

        val createResp = medicationController.createMedication(userId, req)
        assertEquals(201, createResp.statusCode.value())
        val med = createResp.body!!
        assertEquals("Metformin", med.name)
        assertEquals("500mg", med.dose)

        val listResp = medicationController.getMedications(userId)
        assertEquals(200, listResp.statusCode.value())
        assertTrue(listResp.body!!.any { it.name == "Metformin" })

        val updateResp = medicationController.updateMedication(
            med.id,
            userId,
            MedicationUpdateRequest(status = "Completed")
        )
        assertEquals(200, updateResp.statusCode.value())
        assertEquals("Completed", updateResp.body!!.status)

        val delResp = medicationController.deleteMedication(med.id, userId)
        assertEquals(204, delResp.statusCode.value())
    }

    @Test
    fun testAppointmentLifecycle() {
        val userId = "test_user_apt_1"
        val req = AppointmentRequest(
            doctorName = "Dr. Alan Grant",
            specialty = "Cardiology",
            clinicLocation = "Cardiology Dept Room 302",
            dateTime = "2026-05-20 10:30 AM",
            reason = "Annual cardiac checkup",
            status = "Scheduled",
            notes = "Bring recent ECG results"
        )

        val createResp = appointmentController.createAppointment(userId, req)
        assertEquals(201, createResp.statusCode.value())
        val apt = createResp.body!!
        assertEquals("Dr. Alan Grant", apt.doctorName)
        assertEquals("Cardiology", apt.specialty)

        val listResp = appointmentController.getAppointments(userId)
        assertEquals(200, listResp.statusCode.value())
        assertTrue(listResp.body!!.any { it.id == apt.id })

        val updateResp = appointmentController.updateAppointment(
            apt.id,
            userId,
            AppointmentUpdateRequest(status = "Completed")
        )
        assertEquals(200, updateResp.statusCode.value())
        assertEquals("Completed", updateResp.body!!.status)

        val delResp = appointmentController.deleteAppointment(apt.id, userId)
        assertEquals(204, delResp.statusCode.value())
    }

    @Test
    fun testUserProfileLifecycle() {
        val userId = "test_user_profile_1"
        val req = UserProfileRequest(
            displayName = "Jane Doe",
            email = "jane.doe@example.com",
            bloodGroup = "A+",
            dateOfBirth = "1995-08-20",
            emergencyContact = "+1-555-0199",
            phone = "+1-555-0100"
        )

        val updateResp = userProfileController.updateProfile(userId, req)
        assertEquals(200, updateResp.statusCode.value())
        val profile = updateResp.body!!
        assertEquals("Jane Doe", profile.displayName)
        assertEquals("A+", profile.bloodGroup)

        val getResp = userProfileController.getProfile(userId)
        assertEquals(200, getResp.statusCode.value())
        assertEquals("Jane Doe", getResp.body!!.displayName)
    }

    @Test
    fun testTimelineAggregation() {
        val userId = "test_user_timeline_1"
        // Create a record and medication to populate timeline
        recordController.createRecord(
            userId,
            MedicalRecordRequest(
                title = "Lab Test Results",
                category = "Laboratory",
                date = "2026-03-01",
                facility = "LabCorp",
                diagnosisNotes = "All parameters normal"
            )
        )

        val timelineResp = timelineController.getTimeline(userId)
        assertEquals(200, timelineResp.statusCode.value())
        val events = timelineResp.body!!
        assertTrue(events.isNotEmpty())
        assertTrue(events.any { it.title.contains("Lab Test Results") })
    }
}
