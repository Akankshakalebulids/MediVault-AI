import React, { useState, useMemo } from "react";
import {
  CalendarDays,
  Plus,
  Clock,
  MapPin,
  User,
  X,
  CheckCircle2,
  AlertCircle,
  Ban
} from "lucide-react";
import { DisclaimerBanner } from "../components/DisclaimerBanner";

export function AppointmentsPage({ appointments, onAddAppt, onUpdateAppt }) {
  const [tab, setTab] = useState("Upcoming");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [doctorName, setDoctorName] = useState("");
  const [specialty, setSpecialty] = useState("General Medicine");
  const [clinicLocation, setClinicLocation] = useState("");
  const [dateTime, setDateTime] = useState("2026-11-05T10:00");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const categorized = useMemo(() => {
    const now = new Date();
    return appointments.filter((a) => {
      const apptDate = new Date(a.dateTime || a.date);
      if (tab === "Upcoming") {
        return a.status !== "Completed" && a.status !== "Cancelled";
      } else {
        return a.status === "Completed" || a.status === "Cancelled" || apptDate < now;
      }
    });
  }, [appointments, tab]);

  function handleCreate(e) {
    e.preventDefault();
    if (!doctorName || !clinicLocation) return;

    onAddAppt({
      doctorName,
      specialty,
      clinicLocation,
      dateTime,
      reason: reason || "Routine Consultation",
      status: "Confirmed",
      notes: notes || "Standard care visit"
    });

    setDoctorName("");
    setClinicLocation("");
    setReason("");
    setNotes("");
    setShowAddModal(false);
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="eyebrow">Clinical Care Schedules</p>
          <h1>Doctor & Care Appointments</h1>
          <p className="page-sub">
            Track upcoming doctor consultations, specialist visits, and completed care appointments.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Schedule Appointment
        </button>
      </div>

      <DisclaimerBanner
        compact
        message="MediVault is a personal appointment organizer. Rescheduling or cancelling in MediVault does not directly alert medical facility phone switchboards; please confirm with the clinic office."
      />

      {/* Tabs: Upcoming vs Past */}
      <div className="filter-tabs">
        <button className={`tab-btn ${tab === "Upcoming" ? "active" : ""}`} onClick={() => setTab("Upcoming")}>
          Upcoming Visits ({appointments.filter((a) => a.status !== "Completed" && a.status !== "Cancelled").length})
        </button>
        <button className={`tab-btn ${tab === "Past" ? "active" : ""}`} onClick={() => setTab("Past")}>
          Past & Completed Visits
        </button>
      </div>

      {/* Appointments List Panel */}
      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>{tab === "Upcoming" ? "Scheduled Upcoming Consultations" : "Past Consultations & Care Archive"}</h3>
            <span>{categorized.length} appointments listed</span>
          </div>
        </div>

        {categorized.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
            <CalendarDays size={40} style={{ opacity: 0.4, marginBottom: 10 }} />
            <p style={{ margin: 0, fontSize: 14 }}>No {tab.toLowerCase()} appointments found.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {categorized.map((a) => {
              const dateObj = new Date(a.dateTime || a.date);
              const day = isNaN(dateObj.getDate()) ? "15" : String(dateObj.getDate()).padStart(2, "0");
              const month = isNaN(dateObj.getMonth())
                ? "NOV"
                : dateObj.toLocaleString("en-US", { month: "short" }).toUpperCase();
              const timeString = isNaN(dateObj.getTime())
                ? "10:00 AM"
                : dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

              const isCancelled = a.status === "Cancelled";
              const isCompleted = a.status === "Completed";

              return (
                <div className="appt-item" key={a.id}>
                  <div className={`date-badge ${isCancelled ? "date-muted" : ""}`}>
                    <b>{day}</b>
                    <span>{month}</span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <strong style={{ fontSize: 15, color: "var(--text-main)" }}>{a.doctorName}</strong>
                      <span className={`status-pill status-${a.status?.toLowerCase() || "confirmed"}`}>
                        {a.status || "Confirmed"}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 4, flexWrap: "wrap", fontSize: 12.5, color: "var(--text-secondary)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <Clock size={14} style={{ color: "var(--primary-emerald)" }} />
                        {timeString}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <MapPin size={14} style={{ color: "var(--primary-emerald)" }} />
                        {a.clinicLocation}
                      </span>
                      <span>
                        <strong>Specialty:</strong> {a.specialty}
                      </span>
                    </div>

                    {a.reason && (
                      <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
                        <strong>Reason:</strong> {a.reason}
                      </p>
                    )}
                  </div>

                  {tab === "Upcoming" && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="btn-secondary"
                        style={{ padding: "6px 10px", fontSize: 11.5 }}
                        onClick={() => onUpdateAppt(a.id, { status: "Completed" })}
                        title="Mark as completed"
                      >
                        <CheckCircle2 size={13} style={{ color: "var(--primary-emerald)" }} /> Complete
                      </button>
                      <button
                        className="btn-danger"
                        style={{ padding: "6px 10px", fontSize: 11.5 }}
                        onClick={() => {
                          if (window.confirm(`Cancel appointment with ${a.doctorName}?`)) {
                            onUpdateAppt(a.id, { status: "Cancelled" });
                          }
                        }}
                        title="Cancel appointment"
                      >
                        <Ban size={13} /> Cancel
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Schedule Appointment Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onMouseDown={() => setShowAddModal(false)}>
          <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Schedule Doctor Appointment</h3>
                <p>Register a scheduled clinical consultation or follow-up.</p>
              </div>
              <button className="icon-btn" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Doctor / Specialist Name *</label>
                <input
                  type="text"
                  required
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Shah, MD"
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Clinical Specialty</label>
                  <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Endocrinology">Endocrinology (Diabetes & Metabolism)</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Dental Surgery">Dental Care</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Ophthalmology">Ophthalmology</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Clinic / Hospital Facility *</label>
                <input
                  type="text"
                  required
                  value={clinicLocation}
                  onChange={(e) => setClinicLocation(e.target.value)}
                  placeholder="e.g. City Care Specialty Clinic · Floor 3"
                />
              </div>

              <div className="form-group">
                <label>Reason for Consultation</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Routine blood glucose checkup and dietary review"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
