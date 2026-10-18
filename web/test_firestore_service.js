// Unit verification script for MediVault Firestore Service & Security Logic
import assert from "node:assert";

// Mock localStorage for Node environment if not present
if (typeof globalThis.localStorage === "undefined") {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => store.get(k) || null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear()
  };
}

async function runTests() {
  console.log("=== RUNNING MEDIVAULT FIREBASE & FIRESTORE SERVICE TESTS ===");

  const { isFirebaseConfigured, auth, db } = await import("./src/firebaseConfig.js");
  const {
    isCloudMode,
    getMedicalRecords,
    addMedicalRecord,
    deleteMedicalRecord,
    getMedications,
    addMedication,
    getAppointments,
    getTimelineEvents
  } = await import("./src/services/firestoreService.js");

  // Test 1: Configuration state without .env
  console.log("\n[Test 1] Verifying Firebase configuration state...");
  assert.strictEqual(isFirebaseConfigured, false, "When .env has no keys, isFirebaseConfigured must be false");
  console.log("✓ Correctly detected unconfigured state (isFirebaseConfigured === false).");

  // Test 2: Mode Detection
  console.log("\n[Test 2] Verifying Cloud vs Demo mode detection...");
  assert.strictEqual(isCloudMode("demo_user"), false, "demo_user must not be in cloud mode");
  assert.strictEqual(isCloudMode("demo_user_akanksha"), false, "demo_user_akanksha must not be in cloud mode");
  console.log("✓ Correctly identified Demo Mode for demo user IDs.");

  // Test 3: Local Demo CRUD operations
  console.log("\n[Test 3] Verifying Local Demo CRUD operations...");
  const records = await getMedicalRecords("demo_user");
  assert.ok(Array.isArray(records), "getMedicalRecords must return an array");
  assert.ok(records.length > 0, "Must return initial demo records");
  assert.strictEqual(records[0].storageSource, "demo_local_storage", "Must explicitly indicate demo_local_storage");
  console.log(`✓ Fetched ${records.length} demo records with explicit storageSource: demo_local_storage`);

  // Test 4: Adding record in Demo Mode
  console.log("\n[Test 4] Verifying record addition in Demo Mode...");
  const newRec = await addMedicalRecord("demo_user", {
    title: "HbA1c Glycated Hemoglobin Test",
    category: "Laboratory",
    doctor: "Dr. Ananya Mehta",
    facility: "City Diagnostic Lab",
    date: "2026-10-01",
    diagnosisNotes: "5.4% (Normal non-diabetic reference)",
    status: "Reviewed"
  });
  assert.strictEqual(newRec.title, "HbA1c Glycated Hemoglobin Test");
  assert.strictEqual(newRec.storageSource, "demo_local_storage");
  console.log("✓ Successfully added record locally without silent cloud claim.");

  // Test 5: Verify timeline event propagation
  console.log("\n[Test 5] Verifying timeline milestone logging...");
  const timeline = await getTimelineEvents("demo_user");
  assert.ok(timeline.length > 0, "Timeline events must exist");
  assert.ok(
    timeline.some((t) => t.title.includes("HbA1c Glycated Hemoglobin Test")),
    "Newly added record must generate a corresponding timeline event"
  );
  console.log("✓ Timeline correctly aggregated record addition milestone.");

  // Test 6: Medications & Appointments
  console.log("\n[Test 6] Verifying Medications and Appointments demo retrieval...");
  const meds = await getMedications("demo_user");
  const appts = await getAppointments("demo_user");
  assert.ok(meds.length > 0, "Medications must be retrieved");
  assert.ok(appts.length > 0, "Appointments must be retrieved");
  console.log(`✓ Retrieved ${meds.length} medications and ${appts.length} appointments.`);

  console.log("\n=======================================================");
  console.log("ALL 6 FIREBASE & FIRESTORE SERVICE TESTS PASSED!");
  console.log("=======================================================");
}

runTests().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
