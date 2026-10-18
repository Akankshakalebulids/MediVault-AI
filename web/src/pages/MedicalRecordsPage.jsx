import React, { useState, useMemo } from "react";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  X,
  Calendar,
  Building2,
  User,
  ClipboardList
} from "lucide-react";
import { DisclaimerBanner } from "../components/DisclaimerBanner";

const CATEGORIES = ["All", "Laboratory", "Consultation", "Prescription", "Radiology", "Immunization"];

export function MedicalRecordsPage({
  records,
  onAddRecord,
  onDeleteRecord,
  searchTerm,
  setSearchTerm
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Laboratory");
  const [doctor, setDoctor] = useState("");
  const [facility, setFacility] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const matchCat = selectedCategory === "All" || r.category === selectedCategory;
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        r.title?.toLowerCase().includes(q) ||
        r.doctor?.toLowerCase().includes(q) ||
        r.facility?.toLowerCase().includes(q) ||
        r.diagnosisNotes?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [records, selectedCategory, searchTerm]);

  function handleCreate(e) {
    e.preventDefault();
    if (!title || !doctor) return;

    onAddRecord({
      title,
      category,
      doctor,
      facility: facility || "Clinic / Hospital",
      date,
      diagnosisNotes: notes || "Routine assessment. No acute flags noted.",
      status: "Reviewed"
    });

    // Reset Form
    setTitle("");
    setDoctor("");
    setFacility("");
    setNotes("");
    setShowAddModal(false);
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="eyebrow">Digital Health Records</p>
          <h1>Medical Records Management</h1>
          <p className="page-sub">
            Securely organize lab reports, clinical consultations, imaging, and prescriptions.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Add Medical Record
        </button>
      </div>

      <DisclaimerBanner
        compact
        message="Medical records are encrypted and isolated strictly to your account UID. Clinical diagnosis notes are maintained for personal tracking and review."
      />

      {/* Category Filter Tabs */}
      <div className="filter-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`tab-btn ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Records Table Panel */}
      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Documented Records ({filtered.length})</h3>
            <span>Showing {selectedCategory} records</span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
            <FileText size={40} style={{ opacity: 0.4, marginBottom: 10 }} />
            <p style={{ margin: 0, fontSize: 14 }}>No medical records found matching your filters.</p>
            <button
              className="btn-secondary"
              style={{ marginTop: 14 }}
              onClick={() => {
                setSelectedCategory("All");
                setSearchTerm("");
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Record Title</th>
                  <th>Category</th>
                  <th>Doctor / Provider</th>
                  <th>Facility</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: 650 }}>
                        <ClipboardList size={16} style={{ color: "var(--primary-emerald)", flexShrink: 0 }} />
                        <span>{r.title}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`record-badge badge-${(r.category || "lab").toLowerCase()}`}>
                        {r.category || "General"}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-secondary)" }}>{r.doctor}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{r.facility}</td>
                    <td style={{ color: "var(--text-muted)" }}>{r.date}</td>
                    <td>
                      <span className="status-pill status-reviewed">{r.status || "Reviewed"}</span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: 6 }}>
                        <button
                          className="icon-btn"
                          style={{ width: 32, height: 32 }}
                          onClick={() => setViewRecord(r)}
                          title="View clinical details"
                          aria-label={`View record ${r.title}`}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className="icon-btn"
                          style={{ width: 32, height: 32, color: "#BE123C" }}
                          onClick={() => {
                            if (window.confirm(`Delete record: "${r.title}"?`)) {
                              onDeleteRecord(r.id);
                            }
                          }}
                          title="Delete record"
                          aria-label={`Delete record ${r.title}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onMouseDown={() => setShowAddModal(false)}>
          <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Add Medical Record</h3>
                <p>Record diagnostic tests, consultations, or hospital visits.</p>
              </div>
              <button className="icon-btn" onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Record Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Fasting Blood Sugar Test"
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Radiology">Radiology</option>
                    <option value="Immunization">Immunization</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Record Date</label>
                  <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Attending Doctor / Specialist *</label>
                  <input
                    type="text"
                    required
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Shah, MD"
                  />
                </div>

                <div className="form-group">
                  <label>Healthcare Facility</label>
                  <input
                    type="text"
                    value={facility}
                    onChange={(e) => setFacility(e.target.value)}
                    placeholder="e.g. Metro Care Clinic"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Diagnosis & Clinical Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Clinical observations, key lab results, follow-up instructions..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Medical Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Record Details Modal */}
      {viewRecord && (
        <div className="modal-backdrop" onMouseDown={() => setViewRecord(null)}>
          <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className={`record-badge badge-${(viewRecord.category || "lab").toLowerCase()}`}>
                  {viewRecord.category}
                </span>
                <h3 style={{ marginTop: 8 }}>{viewRecord.title}</h3>
                <p>Documented on {viewRecord.date}</p>
              </div>
              <button className="icon-btn" onClick={() => setViewRecord(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, margin: "16px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                <User size={16} style={{ color: "var(--primary-emerald)" }} />
                <span>
                  <strong>Doctor:</strong> {viewRecord.doctor}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                <Building2 size={16} style={{ color: "var(--primary-emerald)" }} />
                <span>
                  <strong>Facility:</strong> {viewRecord.facility}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                <Calendar size={16} style={{ color: "var(--primary-emerald)" }} />
                <span>
                  <strong>Recorded Date:</strong> {viewRecord.date}
                </span>
              </div>
            </div>

            <div style={{ background: "var(--bg-page)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: 14 }}>
              <strong style={{ fontSize: 12.5, color: "var(--text-main)", display: "block", marginBottom: 6 }}>
                Diagnosis & Clinical Notes:
              </strong>
              <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                {viewRecord.diagnosisNotes}
              </p>
            </div>

            <div className="modal-actions" style={{ marginTop: 20 }}>
              <button className="btn-primary" onClick={() => setViewRecord(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
