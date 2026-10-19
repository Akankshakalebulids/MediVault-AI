import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { AuthModal } from "./components/AuthModal";
import { DashboardPage } from "./pages/DashboardPage";
import { MedicalRecordsPage } from "./pages/MedicalRecordsPage";
import { MedicationsPage } from "./pages/MedicationsPage";
import { AppointmentsPage } from "./pages/AppointmentsPage";
import { HealthTimelinePage } from "./pages/HealthTimelinePage";
import { HealthAnalyticsPage } from "./pages/HealthAnalyticsPage";
import { DiabetesScreeningPage } from "./pages/DiabetesScreeningPage";
import { ProfileSettingsPage } from "./pages/ProfileSettingsPage";
import { useAuth } from "./context/AuthContext";
import {
  getMedicalRecords,
  addMedicalRecord,
  deleteMedicalRecord,
  getMedications,
  addMedication,
  updateMedication,
  deleteMedication,
  getAppointments,
  addAppointment,
  updateAppointment,
  getTimelineEvents,
  isCloudMode
} from "./services/firestoreService";
import { backendService } from "./services/backendService";
import { X, Plus, Bell, CheckCircle2, AlertCircle, Cloud, HardDrive, Server } from "lucide-react";

export function App() {
  const { currentUser, isDemoMode, isFirebaseConfigured } = useAuth();
  const userId = currentUser?.uid || "demo_user";
  const inCloudMode = isCloudMode(userId);

  const [active, setActive] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // App Data States
  const [records, setRecords] = useState([]);
  const [meds, setMeds] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Operation Feedback Status
  const [cloudError, setCloudError] = useState(null);
  const [cloudSuccess, setCloudSuccess] = useState(null);

  // Modals
  const [showGlobalAddMed, setShowGlobalAddMed] = useState(false);

  // Quick Add Med form state
  const [quickMedName, setQuickMedName] = useState("");
  const [quickMedDose, setQuickMedDose] = useState("");
  const [quickMedTime, setQuickMedTime] = useState("08:00 AM");

  // Load Data on user change
  useEffect(() => {
    async function loadData() {
      setCloudError(null);
      // 1. Check if Spring Boot backend is healthy
      const health = await backendService.checkHealth();
      if (health.ok) {
        setIsBackendConnected(true);
        try {
          const [recs, md, apts, tl] = await Promise.all([
            backendService.getRecords(userId),
            backendService.getMedications(userId),
            backendService.getAppointments(userId),
            backendService.getTimeline(userId)
          ]);
          setRecords(Array.isArray(recs) ? recs : []);
          setMeds(Array.isArray(md) ? md : []);
          setAppointments(Array.isArray(apts) ? apts : []);
          setTimelineEvents(Array.isArray(tl) ? tl : []);
          return;
        } catch (err) {
          console.warn("Spring Boot backend query failed, falling back:", err);
        }
      }

      // 2. Fall back to Cloud Firestore / Local Storage Demo
      setIsBackendConnected(false);
      try {
        const [recs, md, apts, tl] = await Promise.all([
          getMedicalRecords(userId),
          getMedications(userId),
          getAppointments(userId),
          getTimelineEvents(userId)
        ]);
        setRecords(recs);
        setMeds(md);
        setAppointments(apts);
        setTimelineEvents(tl);
      } catch (err) {
        setCloudError(err.message);
      }
    }
    loadData();
  }, [userId]);

  function showSuccess(msg) {
    setCloudSuccess(msg);
    setTimeout(() => setCloudSuccess(null), 4000);
  }

  // Handlers with backend support & fallback
  async function handleAddRecord(rec) {
    setCloudError(null);
    try {
      if (isBackendConnected) {
        const saved = await backendService.createRecord(userId, rec);
        setRecords((prev) => [saved, ...prev]);
        showSuccess("Medical record saved via Spring Boot REST API.");
      } else {
        const saved = await addMedicalRecord(userId, rec);
        setRecords((prev) => [saved, ...prev]);
        showSuccess(inCloudMode ? "Medical record saved to Cloud Firestore." : "Medical record saved locally.");
      }
    } catch (err) {
      setCloudError(err.message);
    }
  }

  async function handleDeleteRecord(id) {
    setCloudError(null);
    try {
      if (isBackendConnected) {
        await backendService.deleteRecord(id, userId);
        setRecords((prev) => prev.filter((r) => r.id !== id));
        showSuccess("Record removed via Spring Boot REST API.");
      } else {
        await deleteMedicalRecord(userId, id);
        setRecords((prev) => prev.filter((r) => r.id !== id));
        showSuccess(inCloudMode ? "Record deleted from Cloud Firestore." : "Record removed locally.");
      }
    } catch (err) {
      setCloudError(err.message);
    }
  }

  async function handleAddMed(med) {
    setCloudError(null);
    try {
      if (isBackendConnected) {
        const saved = await backendService.createMedication(userId, med);
        setMeds((prev) => [...prev, saved]);
        showSuccess("Medication saved via Spring Boot REST API.");
      } else {
        const saved = await addMedication(userId, med);
        setMeds((prev) => [...prev, saved]);
        showSuccess(inCloudMode ? "Medication saved to Cloud Firestore." : "Medication saved locally.");
      }
    } catch (err) {
      setCloudError(err.message);
    }
  }

  async function handleUpdateMed(id, updates) {
    setCloudError(null);
    try {
      if (isBackendConnected) {
        const updated = await backendService.updateMedication(id, userId, updates);
        setMeds((prev) => prev.map((m) => (m.id === id ? { ...m, ...updated } : m)));
        showSuccess("Medication updated via Spring Boot REST API.");
      } else {
        await updateMedication(userId, id, updates);
        setMeds((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
        showSuccess(inCloudMode ? "Medication updated in Cloud Firestore." : "Medication updated locally.");
      }
    } catch (err) {
      setCloudError(err.message);
    }
  }

  async function handleDeleteMed(id) {
    setCloudError(null);
    try {
      if (isBackendConnected) {
        await backendService.deleteMedication(id, userId);
        setMeds((prev) => prev.filter((m) => m.id !== id));
        showSuccess("Medication removed via Spring Boot REST API.");
      } else {
        await deleteMedication(userId, id);
        setMeds((prev) => prev.filter((m) => m.id !== id));
        showSuccess(inCloudMode ? "Medication removed from Cloud Firestore." : "Medication removed locally.");
      }
    } catch (err) {
      setCloudError(err.message);
    }
  }

  async function handleAddAppt(appt) {
    setCloudError(null);
    try {
      if (isBackendConnected) {
        const saved = await backendService.createAppointment(userId, appt);
        setAppointments((prev) => [...prev, saved]);
        showSuccess("Appointment scheduled via Spring Boot REST API.");
      } else {
        const saved = await addAppointment(userId, appt);
        setAppointments((prev) => [...prev, saved]);
        showSuccess(inCloudMode ? "Appointment scheduled in Cloud Firestore." : "Appointment scheduled locally.");
      }
    } catch (err) {
      setCloudError(err.message);
    }
  }

  async function handleUpdateAppt(id, updates) {
    setCloudError(null);
    try {
      if (isBackendConnected) {
        const updated = await backendService.updateAppointment(id, userId, updates);
        setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
        showSuccess("Appointment updated via Spring Boot REST API.");
      } else {
        await updateAppointment(userId, id, updates);
        setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
        showSuccess(inCloudMode ? "Appointment updated in Cloud Firestore." : "Appointment updated locally.");
      }
    } catch (err) {
      setCloudError(err.message);
    }
  }

  function handleQuickAddMedicine(e) {
    e.preventDefault();
    if (!quickMedName || !quickMedDose) return;

    handleAddMed({
      name: quickMedName,
      dose: quickMedDose,
      frequency: "Once daily",
      time: quickMedTime,
      status: "Active",
      instructions: "Registered via dashboard quick add"
    });

    setQuickMedName("");
    setQuickMedDose("");
    setShowGlobalAddMed(false);
  }

  return (
    <div className="app-shell">
      <Sidebar
        active={active}
        setActive={setActive}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <main className="main">
        <Topbar
          onMenuClick={() => setMobileOpen(true)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenNotifications={() => setNotificationsOpen(true)}
        />

        <section className="content">
          {/* Cloud Error Alert */}
          {cloudError && (
            <div
              style={{
                background: "var(--status-danger-bg)",
                border: "1px solid var(--status-danger-border)",
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                marginBottom: 16,
                color: "var(--status-danger-text)",
                fontSize: 13,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
              role="alert"
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <AlertCircle size={18} flexShrink={0} />
                <span>
                  <strong>Firestore Error:</strong> {cloudError}
                </span>
              </div>
              <button
                onClick={() => setCloudError(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}
                aria-label="Dismiss error"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Cloud Success Notice */}
          {cloudSuccess && (
            <div
              style={{
                background: "var(--status-success-bg)",
                border: "1px solid var(--border-light)",
                padding: "10px 16px",
                borderRadius: "var(--radius-md)",
                marginBottom: 16,
                color: "var(--status-success-text)",
                fontSize: 12.5,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
              role="status"
            >
              <CheckCircle2 size={16} />
              <span>{cloudSuccess}</span>
            </div>
          )}

          {/* System Storage State Banner */}
          <div
            style={{
              background: isBackendConnected
                ? "#EFF6FF"
                : inCloudMode
                ? "var(--bg-soft-green)"
                : "#FFFBEB",
              border: `1px solid ${
                isBackendConnected
                  ? "#BFDBFE"
                  : inCloudMode
                  ? "var(--border-light)"
                  : "#FDE68A"
              }`,
              borderRadius: "var(--radius-md)",
              padding: "10px 14px",
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 12,
              flexWrap: "wrap",
              gap: 8
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {isBackendConnected ? (
                <Server size={16} style={{ color: "#2563EB" }} />
              ) : inCloudMode ? (
                <Cloud size={16} style={{ color: "var(--primary-emerald)" }} />
              ) : (
                <HardDrive size={16} style={{ color: "#B45309" }} />
              )}
              <span
                style={{
                  color: isBackendConnected
                    ? "#1E40AF"
                    : inCloudMode
                    ? "var(--dark-green)"
                    : "#92400E"
                }}
              >
                <strong>
                  {isBackendConnected
                    ? "Spring Boot REST Backend Connected (Port 8085):"
                    : inCloudMode
                    ? "Cloud Persistence Active:"
                    : "Local Demo Mode Active:"}
                </strong>{" "}
                {isBackendConnected
                  ? `Authenticated as UID ${userId}. CRUD operations synchronized directly to Spring Boot H2/PostgreSQL database.`
                  : inCloudMode
                  ? `Authenticated as UID ${currentUser?.uid}. All collections (/users/${currentUser?.uid}/...) sync directly to Cloud Firestore.`
                  : "Changes stored in browser local storage. Start backend on port 8085 or configure Firebase to activate live sync."}
              </span>
            </div>
            <button
              onClick={() => setAuthModalOpen(true)}
              style={{
                background: "none",
                border: "none",
                color: isBackendConnected
                  ? "#2563EB"
                  : inCloudMode
                  ? "var(--primary-emerald)"
                  : "#B45309",
                fontWeight: 700,
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: 12
              }}
            >
              {inCloudMode ? "Account Details" : "Connect Firebase"}
            </button>
          </div>

          {active === "Dashboard" && (
            <DashboardPage
              records={records}
              meds={meds}
              appointments={appointments}
              onNavigate={setActive}
              onOpenAddMed={() => setShowGlobalAddMed(true)}
              onOpenAddRecord={() => setActive("Medical Records")}
            />
          )}

          {active === "Medical Records" && (
            <MedicalRecordsPage
              records={records}
              onAddRecord={handleAddRecord}
              onDeleteRecord={handleDeleteRecord}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          )}

          {active === "Medications" && (
            <MedicationsPage
              meds={meds}
              onAddMed={handleAddMed}
              onUpdateMed={handleUpdateMed}
              onDeleteMed={handleDeleteMed}
            />
          )}

          {active === "Appointments" && (
            <AppointmentsPage
              appointments={appointments}
              onAddAppt={handleAddAppt}
              onUpdateAppt={handleUpdateAppt}
            />
          )}

          {active === "Health Timeline" && (
            <HealthTimelinePage
              records={records}
              meds={meds}
              appointments={appointments}
              timelineEvents={timelineEvents}
            />
          )}

          {active === "Health Analytics" && <HealthAnalyticsPage />}

          {active === "Diabetes Screening" && <DiabetesScreeningPage />}

          {active === "Profile & Settings" && (
            <ProfileSettingsPage onOpenAuth={() => setAuthModalOpen(true)} />
          )}
        </section>
      </main>

      {/* Global Add Medicine Modal */}
      {showGlobalAddMed && (
        <div className="modal-backdrop" onMouseDown={() => setShowGlobalAddMed(false)}>
          <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Add Medication</h3>
                <p>Add a prescription or supplement to your personal daily schedule.</p>
              </div>
              <button className="icon-btn" onClick={() => setShowGlobalAddMed(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleQuickAddMedicine}>
              <div className="form-group">
                <label>Medication Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Metformin 500 mg"
                  value={quickMedName}
                  onChange={(e) => setQuickMedName(e.target.value)}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Dosage *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500 mg"
                    value={quickMedDose}
                    onChange={(e) => setQuickMedDose(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Reminder Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 08:00 AM"
                    value={quickMedTime}
                    onChange={(e) => setQuickMedTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowGlobalAddMed(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notifications Popover */}
      {notificationsOpen && (
        <div className="modal-backdrop" onMouseDown={() => setNotificationsOpen(false)}>
          <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Bell size={18} style={{ color: "var(--primary-emerald)" }} />
                <h3 style={{ margin: 0 }}>Health Notifications</h3>
              </div>
              <button className="icon-btn" onClick={() => setNotificationsOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ background: "var(--bg-soft-green)", padding: 12, borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
                <strong style={{ fontSize: 13, color: "var(--primary-emerald)", display: "block" }}>
                  Upcoming Appointment Reminder
                </strong>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>
                  Endocrine Consultation with Dr. Rajesh Shah on Oct 25, 10:30 AM.
                </p>
              </div>

              <div style={{ background: "var(--bg-page)", padding: 12, borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
                <strong style={{ fontSize: 13, color: "var(--text-main)", display: "block" }}>
                  Medication Dose Schedule
                </strong>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>
                  Metformin 500 mg due tonight at 09:00 PM with dinner.
                </p>
              </div>

              <div style={{ background: "var(--bg-page)", padding: 12, borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
                <strong style={{ fontSize: 13, color: "var(--text-main)", display: "block" }}>
                  AI Risk Screening Engine Online
                </strong>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--text-secondary)" }}>
                  Random Forest ML model is loaded and ready for metabolic screening.
                </p>
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: 16 }}>
              <button className="btn-primary" onClick={() => setNotificationsOpen(false)}>
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
