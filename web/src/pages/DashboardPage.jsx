import React from "react";
import {
  FileText,
  Pill,
  CalendarDays,
  HeartPulse,
  Activity,
  ChevronRight,
  Plus,
  Clock,
  Sparkles,
  ClipboardList
} from "lucide-react";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { useAuth } from "../context/AuthContext";

export function DashboardPage({
  records,
  meds,
  appointments,
  onNavigate,
  onOpenAddMed,
  onOpenAddRecord
}) {
  const { currentUser, isDemoMode } = useAuth();
  const userName = currentUser?.displayName || "Akanksha";

  const activeMeds = meds.filter((m) => m.status === "Active");
  const upcomingAppts = appointments.filter((a) => a.status !== "Completed" && a.status !== "Cancelled");

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="eyebrow">Preventative Healthcare Dashboard</p>
          <h1>Good day, {userName}</h1>
          <p className="page-sub">
            {isDemoMode
              ? "Running in Demo Mode · Sample patient health workspace"
              : "Synchronized with your private Cloud Firestore health vault"}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-secondary" onClick={onOpenAddRecord}>
            <Plus size={16} /> Add Record
          </button>
          <button className="btn-primary" onClick={onOpenAddMed}>
            <Plus size={16} /> Add Medicine
          </button>
        </div>
      </div>

      <DisclaimerBanner
        compact
        message="MediVault is an educational healthcare management and machine-learning risk screening prototype. Sample measurements shown below are for demonstration only."
      />

      {/* Hero Overview */}
      <div className="hero-card">
        <div>
          <span className="hero-tag">INTELLIGENT HEALTH VAULT</span>
          <h2>Educational Diabetes Risk Screening</h2>
          <p>
            Assess metabolic risk probabilities using our validated Machine Learning model (Random Forest, ROC-AUC 0.817) trained on benchmark clinical datasets.
          </p>
          <button className="hero-cta" onClick={() => onNavigate("Diabetes Screening")}>
            <Sparkles size={16} /> Open AI Risk Screener <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap">
            <FileText size={22} />
          </div>
          <div className="stat-body">
            <span className="stat-label">Medical Records</span>
            <strong className="stat-value">{records.length}</strong>
            <small className="stat-meta">Lab tests & reports</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap">
            <Pill size={22} />
          </div>
          <div className="stat-body">
            <span className="stat-label">Active Medications</span>
            <strong className="stat-value">{activeMeds.length}</strong>
            <small className="stat-meta">Daily schedule on track</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap">
            <CalendarDays size={22} />
          </div>
          <div className="stat-body">
            <span className="stat-label">Upcoming Visits</span>
            <strong className="stat-value">{upcomingAppts.length}</strong>
            <small className="stat-meta">Scheduled consultations</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap">
            <HeartPulse size={22} />
          </div>
          <div className="stat-body">
            <span className="stat-label">ML Screening Engine</span>
            <strong className="stat-value" style={{ color: "var(--primary-emerald)", fontSize: 20 }}>Active</strong>
            <small className="stat-meta">FastAPI ML port 8000</small>
          </div>
        </div>
      </div>

      {/* Grid: Medications Schedule & Appointments */}
      <div className="grid-two-col">
        {/* Medication Schedule */}
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Medication Schedule</h3>
              <span>Active daily prescribed routine</span>
            </div>
            <button
              className="btn-secondary"
              style={{ padding: "5px 10px", fontSize: 12 }}
              onClick={() => onNavigate("Medications")}
            >
              Manage all
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {activeMeds.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No active medications recorded.</p>
            ) : (
              activeMeds.slice(0, 3).map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    background: "var(--bg-page)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-light)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="med-icon-box">
                      <Pill size={18} />
                    </div>
                    <div>
                      <strong style={{ fontSize: 13.5, color: "var(--text-main)", display: "block" }}>
                        {m.name}
                      </strong>
                      <small style={{ color: "var(--text-secondary)", fontSize: 11.5 }}>
                        {m.dose} · {m.frequency || "Daily"}
                      </small>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--primary-emerald)", fontWeight: 650, fontSize: 12 }}>
                    <Clock size={14} />
                    <span>{m.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Upcoming Appointments */}
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Upcoming Consultations</h3>
              <span>Next scheduled provider appointments</span>
            </div>
            <button
              className="btn-secondary"
              style={{ padding: "5px 10px", fontSize: 12 }}
              onClick={() => onNavigate("Appointments")}
            >
              View calendar
            </button>
          </div>

          <div>
            {upcomingAppts.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: 13 }}>No pending appointments.</p>
            ) : (
              upcomingAppts.slice(0, 2).map((a) => {
                const dateObj = new Date(a.dateTime || a.date);
                const day = isNaN(dateObj.getDate()) ? "25" : String(dateObj.getDate()).padStart(2, "0");
                const month = isNaN(dateObj.getMonth())
                  ? "OCT"
                  : dateObj.toLocaleString("en-US", { month: "short" }).toUpperCase();

                return (
                  <div className="appt-item" key={a.id}>
                    <div className="date-badge">
                      <b>{day}</b>
                      <span>{month}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ display: "block", fontSize: 13.5, color: "var(--text-main)" }}>
                        {a.doctorName}
                      </strong>
                      <small style={{ display: "block", color: "var(--text-secondary)", fontSize: 12 }}>
                        {a.specialty} · {a.clinicLocation}
                      </small>
                      <small style={{ color: "var(--text-muted)", fontSize: 11 }}>Reason: {a.reason}</small>
                    </div>
                    <span className={`status-pill status-${a.status?.toLowerCase() || "confirmed"}`}>
                      {a.status || "Confirmed"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      {/* Recent Medical Records */}
      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Recent Medical Records</h3>
            <span>Latest clinical diagnostic records & reports</span>
          </div>
          <button
            className="btn-secondary"
            style={{ padding: "5px 10px", fontSize: 12 }}
            onClick={() => onNavigate("Medical Records")}
          >
            See all records
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Record Title</th>
                <th>Category</th>
                <th>Doctor / Specialist</th>
                <th>Date</th>
                <th>Clinical Status</th>
              </tr>
            </thead>
            <tbody>
              {records.slice(0, 4).map((r) => (
                <tr key={r.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 650 }}>
                      <ClipboardList size={16} style={{ color: "var(--primary-emerald)" }} />
                      <span>{r.title}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`record-badge badge-${(r.category || "lab").toLowerCase()}`}>
                      {r.category || "General"}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>{r.doctor}</td>
                  <td style={{ color: "var(--text-muted)" }}>{r.date}</td>
                  <td>
                    <span className="status-pill status-reviewed">{r.status || "Reviewed"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
