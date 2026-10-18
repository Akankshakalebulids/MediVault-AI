import { db, isFirebaseConfigured } from "../firebaseConfig.js";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";

// Initial Demo Dataset (Realistic and clearly labeled)
const INITIAL_DEMO_RECORDS = [
  {
    id: "rec-1",
    title: "Comprehensive Metabolic Panel (CMP)",
    category: "Laboratory",
    doctor: "Dr. Ananya Mehta, MD",
    facility: "Metro Diagnostics Centre",
    date: "2026-09-28",
    diagnosisNotes: "Fasting blood glucose 98 mg/dL (normal). Electrolytes and kidney functions within normal reference range.",
    status: "Reviewed",
    createdAt: "2026-09-28T10:00:00Z"
  },
  {
    id: "rec-2",
    title: "Quarterly Endocrine Consultation",
    category: "Consultation",
    doctor: "Dr. Rajesh Shah, MD (Endocrinology)",
    facility: "City Care Specialty Clinic",
    date: "2026-09-12",
    diagnosisNotes: "Routine preventative metabolic checkup. Recommended maintaining aerobic activity 150 mins/week.",
    status: "Completed",
    createdAt: "2026-09-12T14:30:00Z"
  },
  {
    id: "rec-3",
    title: "Preventive Dental Cleaning & Exam",
    category: "Consultation",
    doctor: "Dr. Vikram Iyer, DDS",
    facility: "Smile Studio Dental Health",
    date: "2026-08-02",
    diagnosisNotes: "No active carries detected. Mild plaque removed. Scheduled 6-month routine follow-up.",
    status: "Completed",
    createdAt: "2026-08-02T11:15:00Z"
  },
  {
    id: "rec-4",
    title: "Chest X-Ray (PA View)",
    category: "Radiology",
    doctor: "Dr. Sarah Thomas, MD (Radiology)",
    facility: "Apollo Diagnostics",
    date: "2026-06-15",
    diagnosisNotes: "Normal cardiothoracic ratio. Lungs clear of active infiltrates.",
    status: "Reviewed",
    createdAt: "2026-06-15T09:45:00Z"
  }
];

const INITIAL_DEMO_MEDS = [
  {
    id: "med-1",
    name: "Vitamin D3 (Cholecalciferol)",
    dose: "1000 IU",
    frequency: "Once daily",
    time: "08:00 AM",
    status: "Active",
    instructions: "Take with breakfast or meal containing healthy fats.",
    startDate: "2026-01-10"
  },
  {
    id: "med-2",
    name: "Metformin Hydrochloride",
    dose: "500 mg",
    frequency: "Once daily",
    time: "09:00 PM",
    status: "Active",
    instructions: "Take after dinner with a full glass of water. Preventative metabolic regulation.",
    startDate: "2026-03-15"
  },
  {
    id: "med-3",
    name: "Omega-3 Fish Oil Capsule",
    dose: "1000 mg (EPA/DHA)",
    frequency: "Once daily",
    time: "01:00 PM",
    status: "Active",
    instructions: "Take with lunch.",
    startDate: "2026-02-01"
  }
];

const INITIAL_DEMO_APPTS = [
  {
    id: "apt-1",
    doctorName: "Dr. Rajesh Shah",
    specialty: "Endocrinology",
    clinicLocation: "City Care Clinic · Suite 402",
    dateTime: "2026-10-25T10:30",
    reason: "Quarterly preventative metabolic review & HbA1c check",
    status: "Confirmed",
    notes: "Fasting not strictly required for this routine visit."
  },
  {
    id: "apt-2",
    doctorName: "Dr. Vikram Iyer",
    specialty: "Dental Surgery",
    clinicLocation: "Smile Studio · Floor 2",
    dateTime: "2026-11-12T15:00",
    reason: "Routine semi-annual dental maintenance",
    status: "Pending",
    notes: "Awaiting confirmation from clinic reception."
  },
  {
    id: "apt-3",
    doctorName: "Dr. Ananya Mehta",
    specialty: "General Internal Medicine",
    clinicLocation: "Metro Health Center",
    dateTime: "2026-09-10T11:00",
    reason: "Annual preventive physical examination",
    status: "Completed",
    notes: "Physical exam completed with no acute flags."
  }
];

const INITIAL_DEMO_TIMELINE = [
  {
    id: "evt-1",
    type: "RECORD_ADDED",
    title: "Laboratory Record Filed",
    description: "Comprehensive Metabolic Panel reviewed by Dr. Ananya Mehta.",
    date: "2026-09-28",
    category: "Record"
  },
  {
    id: "evt-2",
    type: "APPT_COMPLETED",
    title: "Specialist Care Visit",
    description: "Quarterly Endocrine Consultation with Dr. Rajesh Shah completed.",
    date: "2026-09-12",
    category: "Appointment"
  },
  {
    id: "evt-3",
    type: "MED_STARTED",
    title: "Medication Refill Logged",
    description: "Metformin 500 mg active prescription ongoing.",
    date: "2026-03-15",
    category: "Medication"
  }
];

// Helper to determine whether the session is operating on live Cloud Firestore
export function isCloudMode(userId) {
  return Boolean(isFirebaseConfigured && db && userId && !userId.startsWith("demo_"));
}

// LocalStorage helpers for Demo Mode
function getLocalDemoData(key, fallback) {
  try {
    const raw = localStorage.getItem(`medivault_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setLocalDemoData(key, data) {
  try {
    localStorage.setItem(`medivault_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error("Local storage error:", e);
  }
}

// ==========================================================================
// User Profile Service
// ==========================================================================

export async function syncUserProfile(userId, profileData) {
  if (isCloudMode(userId)) {
    try {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, {
        ...profileData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return { success: true, storageSource: "cloud_firestore" };
    } catch (err) {
      console.error("Cloud Firestore profile sync error:", err);
      throw new Error(`Cloud Firestore error syncing user profile: ${err.message}`);
    }
  }
  return { success: true, storageSource: "demo_local_storage" };
}

// ==========================================================================
// Medical Records Service
// ==========================================================================

export async function getMedicalRecords(userId) {
  if (isCloudMode(userId)) {
    try {
      const colRef = collection(db, "users", userId, "medical_records");
      const q = query(colRef, orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        storageSource: "cloud_firestore"
      }));
    } catch (err) {
      console.error("Cloud Firestore getMedicalRecords error:", err);
      throw new Error(`Cloud Firestore error fetching medical records: ${err.message}`);
    }
  }

  // Explicitly marked as Demo data
  return getLocalDemoData("records", INITIAL_DEMO_RECORDS).map(r => ({
    ...r,
    storageSource: "demo_local_storage"
  }));
}

export async function addMedicalRecord(userId, record) {
  const newRecord = {
    ...record,
    createdAt: new Date().toISOString()
  };

  if (isCloudMode(userId)) {
    try {
      const colRef = collection(db, "users", userId, "medical_records");
      const docRef = await addDoc(colRef, newRecord);
      
      // Also write timeline event to Cloud Firestore
      await addTimelineEvent(userId, {
        type: "RECORD_ADDED",
        title: `Medical Record Added: ${record.title}`,
        description: `${record.category} filed by ${record.doctor || 'Healthcare Provider'}.`,
        date: record.date || new Date().toISOString().split("T")[0],
        category: "Record"
      });

      return {
        id: docRef.id,
        ...newRecord,
        storageSource: "cloud_firestore"
      };
    } catch (err) {
      console.error("Cloud Firestore addMedicalRecord error:", err);
      // NEVER silently fall back when the user expects cloud persistence!
      throw new Error(`Cloud Firestore failed to save record: ${err.message}`);
    }
  }

  // Local demo mode execution
  const records = getLocalDemoData("records", INITIAL_DEMO_RECORDS);
  const entry = { id: `rec-${Date.now()}`, ...newRecord, storageSource: "demo_local_storage" };
  const updated = [entry, ...records];
  setLocalDemoData("records", updated);

  await addTimelineEvent(userId, {
    type: "RECORD_ADDED",
    title: `Medical Record Added: ${record.title}`,
    description: `${record.category} filed by ${record.doctor || 'Healthcare Provider'}.`,
    date: record.date || new Date().toISOString().split("T")[0],
    category: "Record"
  });

  return entry;
}

export async function updateMedicalRecord(userId, recordId, updates) {
  if (isCloudMode(userId)) {
    try {
      const docRef = doc(db, "users", userId, "medical_records", recordId);
      await updateDoc(docRef, updates);
      return { id: recordId, ...updates, storageSource: "cloud_firestore" };
    } catch (err) {
      console.error("Cloud Firestore updateMedicalRecord error:", err);
      throw new Error(`Cloud Firestore failed to update record: ${err.message}`);
    }
  }

  const records = getLocalDemoData("records", INITIAL_DEMO_RECORDS);
  const updated = records.map(r => r.id === recordId ? { ...r, ...updates } : r);
  setLocalDemoData("records", updated);
  return { id: recordId, ...updates, storageSource: "demo_local_storage" };
}

export async function deleteMedicalRecord(userId, recordId) {
  if (isCloudMode(userId)) {
    try {
      const docRef = doc(db, "users", userId, "medical_records", recordId);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.error("Cloud Firestore deleteMedicalRecord error:", err);
      throw new Error(`Cloud Firestore failed to delete record: ${err.message}`);
    }
  }

  const records = getLocalDemoData("records", INITIAL_DEMO_RECORDS);
  const updated = records.filter(r => r.id !== recordId);
  setLocalDemoData("records", updated);
  return true;
}

// ==========================================================================
// Medications Service
// ==========================================================================

export async function getMedications(userId) {
  if (isCloudMode(userId)) {
    try {
      const colRef = collection(db, "users", userId, "medications");
      const snapshot = await getDocs(colRef);
      return snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        storageSource: "cloud_firestore"
      }));
    } catch (err) {
      console.error("Cloud Firestore getMedications error:", err);
      throw new Error(`Cloud Firestore error fetching medications: ${err.message}`);
    }
  }

  return getLocalDemoData("meds", INITIAL_DEMO_MEDS).map(m => ({
    ...m,
    storageSource: "demo_local_storage"
  }));
}

export async function addMedication(userId, med) {
  const newMed = {
    ...med,
    createdAt: new Date().toISOString()
  };

  if (isCloudMode(userId)) {
    try {
      const colRef = collection(db, "users", userId, "medications");
      const docRef = await addDoc(colRef, newMed);

      await addTimelineEvent(userId, {
        type: "MED_STARTED",
        title: `New Medication Scheduled: ${med.name}`,
        description: `Dosage: ${med.dose} · Schedule: ${med.frequency || 'Daily'} at ${med.time}.`,
        date: new Date().toISOString().split("T")[0],
        category: "Medication"
      });

      return { id: docRef.id, ...newMed, storageSource: "cloud_firestore" };
    } catch (err) {
      console.error("Cloud Firestore addMedication error:", err);
      throw new Error(`Cloud Firestore failed to save medication: ${err.message}`);
    }
  }

  const meds = getLocalDemoData("meds", INITIAL_DEMO_MEDS);
  const entry = { id: `med-${Date.now()}`, ...newMed, storageSource: "demo_local_storage" };
  const updated = [...meds, entry];
  setLocalDemoData("meds", updated);

  await addTimelineEvent(userId, {
    type: "MED_STARTED",
    title: `New Medication Scheduled: ${med.name}`,
    description: `Dosage: ${med.dose} · Schedule: ${med.frequency || 'Daily'} at ${med.time}.`,
    date: new Date().toISOString().split("T")[0],
    category: "Medication"
  });

  return entry;
}

export async function updateMedication(userId, medId, updates) {
  if (isCloudMode(userId)) {
    try {
      const docRef = doc(db, "users", userId, "medications", medId);
      await updateDoc(docRef, updates);
      return { id: medId, ...updates, storageSource: "cloud_firestore" };
    } catch (err) {
      console.error("Cloud Firestore updateMedication error:", err);
      throw new Error(`Cloud Firestore failed to update medication: ${err.message}`);
    }
  }

  const meds = getLocalDemoData("meds", INITIAL_DEMO_MEDS);
  const updated = meds.map(m => m.id === medId ? { ...m, ...updates } : m);
  setLocalDemoData("meds", updated);
  return { id: medId, ...updates, storageSource: "demo_local_storage" };
}

export async function deleteMedication(userId, medId) {
  if (isCloudMode(userId)) {
    try {
      const docRef = doc(db, "users", userId, "medications", medId);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.error("Cloud Firestore deleteMedication error:", err);
      throw new Error(`Cloud Firestore failed to delete medication: ${err.message}`);
    }
  }

  const meds = getLocalDemoData("meds", INITIAL_DEMO_MEDS);
  const updated = meds.filter(m => m.id !== medId);
  setLocalDemoData("meds", updated);
  return true;
}

// ==========================================================================
// Appointments Service
// ==========================================================================

export async function getAppointments(userId) {
  if (isCloudMode(userId)) {
    try {
      const colRef = collection(db, "users", userId, "appointments");
      const snapshot = await getDocs(colRef);
      return snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        storageSource: "cloud_firestore"
      }));
    } catch (err) {
      console.error("Cloud Firestore getAppointments error:", err);
      throw new Error(`Cloud Firestore error fetching appointments: ${err.message}`);
    }
  }

  return getLocalDemoData("appointments", INITIAL_DEMO_APPTS).map(a => ({
    ...a,
    storageSource: "demo_local_storage"
  }));
}

export async function addAppointment(userId, appt) {
  const newAppt = {
    ...appt,
    createdAt: new Date().toISOString()
  };

  if (isCloudMode(userId)) {
    try {
      const colRef = collection(db, "users", userId, "appointments");
      const docRef = await addDoc(colRef, newAppt);

      await addTimelineEvent(userId, {
        type: "APPT_SCHEDULED",
        title: `Appointment Booked with ${appt.doctorName}`,
        description: `${appt.specialty} consultation at ${appt.clinicLocation}.`,
        date: (appt.dateTime || "").split("T")[0] || new Date().toISOString().split("T")[0],
        category: "Appointment"
      });

      return { id: docRef.id, ...newAppt, storageSource: "cloud_firestore" };
    } catch (err) {
      console.error("Cloud Firestore addAppointment error:", err);
      throw new Error(`Cloud Firestore failed to schedule appointment: ${err.message}`);
    }
  }

  const appts = getLocalDemoData("appointments", INITIAL_DEMO_APPTS);
  const entry = { id: `apt-${Date.now()}`, ...newAppt, storageSource: "demo_local_storage" };
  const updated = [...appts, entry];
  setLocalDemoData("appointments", updated);

  await addTimelineEvent(userId, {
    type: "APPT_SCHEDULED",
    title: `Appointment Booked with ${appt.doctorName}`,
    description: `${appt.specialty} consultation at ${appt.clinicLocation}.`,
    date: (appt.dateTime || "").split("T")[0] || new Date().toISOString().split("T")[0],
    category: "Appointment"
  });

  return entry;
}

export async function updateAppointment(userId, apptId, updates) {
  if (isCloudMode(userId)) {
    try {
      const docRef = doc(db, "users", userId, "appointments", apptId);
      await updateDoc(docRef, updates);
      return { id: apptId, ...updates, storageSource: "cloud_firestore" };
    } catch (err) {
      console.error("Cloud Firestore updateAppointment error:", err);
      throw new Error(`Cloud Firestore failed to update appointment: ${err.message}`);
    }
  }

  const appts = getLocalDemoData("appointments", INITIAL_DEMO_APPTS);
  const updated = appts.map(a => a.id === apptId ? { ...a, ...updates } : a);
  setLocalDemoData("appointments", updated);
  return { id: apptId, ...updates, storageSource: "demo_local_storage" };
}

// ==========================================================================
// Health Timeline Service
// ==========================================================================

export async function getTimelineEvents(userId) {
  if (isCloudMode(userId)) {
    try {
      const colRef = collection(db, "users", userId, "timeline_events");
      const q = query(colRef, orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
        storageSource: "cloud_firestore"
      }));
    } catch (err) {
      console.error("Cloud Firestore getTimeline error:", err);
      throw new Error(`Cloud Firestore error fetching timeline events: ${err.message}`);
    }
  }

  return getLocalDemoData("timeline", INITIAL_DEMO_TIMELINE).map(t => ({
    ...t,
    storageSource: "demo_local_storage"
  }));
}

export async function addTimelineEvent(userId, event) {
  const newEvt = {
    ...event,
    createdAt: new Date().toISOString()
  };

  if (isCloudMode(userId)) {
    try {
      const colRef = collection(db, "users", userId, "timeline_events");
      await addDoc(colRef, newEvt);
      return;
    } catch (err) {
      console.error("Cloud Firestore addTimeline error:", err);
      // Propagate error
      throw new Error(`Cloud Firestore failed to log timeline milestone: ${err.message}`);
    }
  }

  const events = getLocalDemoData("timeline", INITIAL_DEMO_TIMELINE);
  const updated = [{ id: `evt-${Date.now()}`, ...newEvt, storageSource: "demo_local_storage" }, ...events];
  setLocalDemoData("timeline", updated);
}
