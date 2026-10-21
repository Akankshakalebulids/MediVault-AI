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

    @Autowired
    private lateinit var documentController: MedicalDocumentController

    @Autowired
    private lateinit var expenseController: MedicalExpenseController

    @Autowired
    private lateinit var familyController: FamilyMemberController

    @Autowired
    private lateinit var summaryController: DoctorVisitSummaryController


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

    @Test
    fun testMedicalDocumentLifecycle() {
        val userId = "test_user_doc_1"
        val req = MedicalDocumentRequest(
            name = "Lipid_Profile_Report.pdf",
            category = "Laboratory Report",
            fileType = "application/pdf",
            notes = "Total cholesterol 185 mg/dL, HDL 55 mg/dL",
            extractedText = "Total Cholesterol: 185, HDL: 55, LDL: 105"
        )

        // Create
        val createResp = documentController.createDocumentMetadata(userId, req)
        assertEquals(201, createResp.statusCode.value())
        val doc = createResp.body!!
        assertEquals("Lipid_Profile_Report.pdf", doc.name)
        assertEquals(userId, doc.userId)

        // List
        val listResp = documentController.getAllDocuments(userId)
        assertEquals(200, listResp.statusCode.value())
        assertTrue(listResp.body!!.any { it.id == doc.id })

        // Get single
        val getResp = documentController.getDocument(doc.id, userId)
        assertEquals(200, getResp.statusCode.value())
        assertEquals("Lipid_Profile_Report.pdf", getResp.body!!.name)

        // Delete
        val delResp = documentController.deleteDocument(doc.id, userId)
        assertEquals(204, delResp.statusCode.value())
    }

    @Test
    fun testMedicalExpenseLifecycleAndAnalytics() {
        val userId = "test_user_expense_1"
        val req = MedicalExpenseRequest(
            title = "Endocrinologist Consultation",
            category = "Doctor Consultations",
            amount = 1500.0,
            currency = "INR",
            date = "2026-04-12",
            facility = "Apollo Clinic",
            paymentStatus = "Paid",
            paymentMethod = "UPI",
            billNumber = "INV-2026-9901"
        )

        // Create
        val createResp = expenseController.createExpense(userId, req)
        assertEquals(201, createResp.statusCode.value())
        val expense = createResp.body!!
        assertEquals(1500.0, expense.amount)
        assertEquals("INV-2026-9901", expense.billNumber)

        // Duplicate Check
        val dupResp = expenseController.checkDuplicate(userId, "INV-2026-9901")
        assertEquals(200, dupResp.statusCode.value())
        assertTrue(dupResp.body!!.isDuplicate)
        assertEquals(expense.id, dupResp.body!!.matchingId)

        val nonDupResp = expenseController.checkDuplicate(userId, "INV-NONEXISTENT")
        assertFalse(nonDupResp.body!!.isDuplicate)

        // Analytics Summary
        val summaryResp = expenseController.getSummary(userId)
        assertEquals(200, summaryResp.statusCode.value())
        val summary = summaryResp.body!!
        assertTrue(summary.totalAmount >= 1500.0)
        assertEquals("INR", summary.currency)
        assertTrue(summary.byCategory.containsKey("Doctor Consultations"))

        // Update
        val updateResp = expenseController.updateExpense(
            expense.id,
            userId,
            req.copy(amount = 1800.0)
        )
        assertEquals(200, updateResp.statusCode.value())
        assertEquals(1800.0, updateResp.body!!.amount)

        // Delete
        val delResp = expenseController.deleteExpense(expense.id, userId)
        assertEquals(204, delResp.statusCode.value())
    }

    @Test
    fun testFamilyMemberLifecycle() {
        val userId = "test_user_family_1"
        val req = FamilyMemberRequest(
            name = "Ramesh Kumar",
            relationship = "Father",
            dateOfBirth = "1960-05-14",
            gender = "Male",
            bloodGroup = "B+",
            chronicConditions = "Hypertension, Type-2 Diabetes",
            allergies = "Penicillin",
            emergencyContact = "+91-9876543210",
            notes = "Requires periodic blood sugar monitoring."
        )

        // Create
        val createResp = familyController.createMember(userId, req)
        assertEquals(201, createResp.statusCode.value())
        val member = createResp.body!!
        assertEquals("Ramesh Kumar", member.name)
        assertEquals("Father", member.relationship)

        // List
        val listResp = familyController.getMembers(userId)
        assertEquals(200, listResp.statusCode.value())
        assertTrue(listResp.body!!.any { it.id == member.id })

        // Get single
        val getResp = familyController.getMember(member.id, userId)
        assertEquals(200, getResp.statusCode.value())
        assertEquals("B+", getResp.body!!.bloodGroup)

        // Update
        val updateResp = familyController.updateMember(
            member.id,
            userId,
            req.copy(notes = "Updated emergency contact information.")
        )
        assertEquals(200, updateResp.statusCode.value())
        assertEquals("Updated emergency contact information.", updateResp.body!!.notes)

        // Delete
        val delResp = familyController.deleteMember(member.id, userId)
        assertEquals(204, delResp.statusCode.value())
    }

    @Test
    fun testDoctorVisitSummary() {
        val userId = "test_user_summary_1"
        userProfileController.updateProfile(
            userId,
            UserProfileRequest(
                displayName = "Amit Sharma",
                bloodGroup = "O+",
                dateOfBirth = "1988-11-22"
            )
        )
        medicationController.createMedication(
            userId,
            MedicationRequest(
                name = "Amlodipine",
                dose = "5mg",
                frequency = "Once daily",
                status = "Active"
            )
        )
        recordController.createRecord(
            userId,
            MedicalRecordRequest(
                title = "Fasting Blood Glucose Test",
                category = "Laboratory",
                diagnosisNotes = "Fasting glucose 118 mg/dL (Impaired fasting glucose)"
            )
        )

        val summaryResp = summaryController.getDoctorVisitSummary(userId)
        assertEquals(200, summaryResp.statusCode.value())
        val summary = summaryResp.body!!
        assertEquals("Amit Sharma", summary.patientName)
        assertEquals("O+", summary.bloodGroup)
        assertTrue(summary.activeMedications.any { it.name == "Amlodipine" })
        assertTrue(summary.recentRecords.any { it.title.contains("Fasting") })
        assertTrue(summary.doctorQuestions.isNotEmpty())
        assertTrue(summary.chronicSummary.isNotEmpty())
    }
}

