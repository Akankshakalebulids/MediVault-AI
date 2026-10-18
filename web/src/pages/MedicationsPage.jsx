import React, { useState } from "react";
import {
  Pill,
  Plus,
  Clock,
  Calendar,
  AlertCircle,
  Trash2,
  Edit2,
  CheckCircle2,
  PauseCircle,
  X
} from "lucide-react";
import { DisclaimerBanner } from "../components/DisclaimerBanner";

export function MedicationsPage({ meds, onAddMed, onUpdateMed, onDeleteMed }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMed, setEditMed] = useState(null);

  // Form State
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [frequency, setFrequency] = useState("Once daily");
  const [time, setTime] = useState("08:00 AM");
  const [instructions, setInstructions] = useState("");
  const [status, setStatus] = useState("Active");

  function handleCreate(e) {
    e.preventDefault();
    if (!name || !dose) return;

    onAddMed({
      name,
      dose,
      frequency,
      time,
      instructions: instructions || "Take as directed by your physician.",
      status,
      startDate: new Date().toISOString().split("T")[0]
    });

    setName("");
    setDose("");
    setInstructions("");
    setShowAddModal(false);
  }

  function handleUpdate(e) {
    e.preventDefault();
    if (!editMed) return;

    onUpdateMed(editMed.id, {
      name: editMed.name,
      dose: editMed.dose,
      frequency: editMed.frequency,
      time: editMed.time,
      instructions: editMed.instructions,
      status: editMed.status
    });

    setEditMed(null);
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="eyebrow">Prescription & Dose Tracking</p>
          <h1>Medication Management</h1>
          <p className="page-sub">
            Maintain your personal medication schedule, reminder preferences, and dosage records.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Add Medication
        </button>
      </div>

      <DisclaimerBanner
        compact
        message="MediVault is an organization and reminder aid only. It does not issue medical advice or modify prescriptions. Always follow your prescribing physician's directions."
      />

      {/* Medication Cards Grid */}
      <div className="med-cards-grid">
        {meds.map((m) => {
          const isActive = m.status === "Active";
          return (
            <div className="med-card" key={m.id}>
              <div className="med-card-header">
                <div className="med-icon-box">
                  <Pill size={20} />
                </div>
                <div className="med-info" style={{ flex: 1, minWidth: 0 }}>
                  <h4>{m.name}</h4>
                  <span>{m.dose}</span>
                </div>
                <span className={`status-pill status-${m.status?.toLowerCase() || "active"}`}>
                  {m.status || "Active"}
                </span>
              </div>

              <div className="med-details">
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)" }}>
                  <Clock size={14} style={{ color: "var(--primary-emerald)" }} />
                  <span>{m.time || "08:00 AM"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)" }}>
                  <Calendar size={14} style={{ color: "var(--primary-emerald)" }} />
                  <span>{m.frequency || "Once daily"}</span>
                </div>
              </div>

              {m.instructions && (
                <p style={{ margin: "4px 0", fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4 }}>
                  <strong>Note:</strong> {m.instructions}
                </p>
              )}

              <div className="med-actions">
                <button
                  className="btn-secondary"
                  style={{ padding: "6px 10px", fontSize: 11.5 }}
                  onClick={() => {
                    const nextStatus = m.status === "Active" ? "Paused" : "Active";
                    onUpdateMed(m.id, { status: nextStatus });
                  }}
                  title={isActive ? "Pause reminders" : "Activate schedule"}
                >
                  {isActive ? <PauseCircle size={14} /> : <CheckCircle2 size={14} />}
                  <span>{isActive ? "Pause" : "Resume"}</span>
                </button>

                <button
                  className="btn-secondary"
                  style={{ padding: "6px 10px", fontSize: 11.5 }}
                  onClick={() => setEditMed({ ...m })}
                  title="Edit medication"
                  aria-label={`Edit ${m.name}`}
                >
                  <Edit2 size={13} />
                </button>

                <button
                  className="btn-danger"
                  style={{ padding: "6px 10px", fontSize: 11.5 }}
                  onClick={() => {
                    if (window.confirm(`Delete medication: "${m.name}"?`)) {
                      onDeleteMed(m.id);
                    }
                  }}
                  title="Remove medication"
                  aria-label={`Delete ${m.name}`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onMouseDown={() => setShowAddModal(false)}>
          <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Add Medication Schedule</h3>
                <p>Register a prescription or supplement to your personal calendar.</p>
              </div>
              <button className="icon-btn" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Medication Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Metformin Hydrochloride"
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Dosage *</label>
                  <input
                    type="text"
                    required
                    value={dose}
                    onChange={(e) => setDose(e.target.value)}
                    placeholder="e.g. 500 mg"
                  />
                </div>

                <div className="form-group">
                  <label>Schedule Frequency</label>
                  <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="As needed">As needed (PRN)</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Reminder Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 08:00 AM or 09:00 PM"
                  />
                </div>

                <div className="form-group">
                  <label>Initial Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Special Instructions / Diet Notes</label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Take with breakfast or plenty of water..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Medication Modal */}
      {editMed && (
        <div className="modal-backdrop" onMouseDown={() => setEditMed(null)}>
          <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Edit Medication</h3>
                <p>Update dosage, reminder times, or status.</p>
              </div>
              <button className="icon-btn" onClick={() => setEditMed(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Medication Name</label>
                <input
                  type="text"
                  required
                  value={editMed.name}
                  onChange={(e) => setEditMed({ ...editMed, name: e.target.value })}
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Dosage</label>
                  <input
                    type="text"
                    required
                    value={editMed.dose}
                    onChange={(e) => setEditMed({ ...editMed, dose: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Frequency</label>
                  <select
                    value={editMed.frequency}
                    onChange={(e) => setEditMed({ ...editMed, frequency: e.target.value })}
                  >
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="As needed">As needed (PRN)</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Reminder Time</label>
                  <input
                    type="text"
                    value={editMed.time}
                    onChange={(e) => setEditMed({ ...editMed, time: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={editMed.status}
                    onChange={(e) => setEditMed({ ...editMed, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Instructions</label>
                <textarea
                  rows={2}
                  value={editMed.instructions}
                  onChange={(e) => setEditMed({ ...editMed, instructions: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setEditMed(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
