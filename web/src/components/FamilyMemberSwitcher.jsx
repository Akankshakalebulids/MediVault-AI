import React, { useState } from "react";
import { useFamily } from "../context/FamilyContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";

export function FamilyMemberSwitcher() {
  const { familyMembers, activeMember, setActiveMember, addFamilyMember } = useFamily();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "Father",
    dateOfBirth: "",
    gender: "Male",
    bloodGroup: "O+",
    chronicConditions: "",
    allergies: "",
    emergencyContact: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelect = (member) => {
    setActiveMember(member);
    setIsOpen(false);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setIsSubmitting(true);
    try {
      const saved = await addFamilyMember(formData);
      setActiveMember(saved);
      setShowAddModal(false);
      setFormData({
        name: "",
        relationship: "Father",
        dateOfBirth: "",
        gender: "Male",
        bloodGroup: "O+",
        chronicConditions: "",
        allergies: "",
        emergencyContact: "",
        notes: ""
      });
    } catch (_) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Switcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "var(--card-bg, #ffffff)",
          border: "1px solid var(--border-color, #e2e8f0)",
          padding: "0.4rem 0.85rem",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "0.85rem",
          fontWeight: 500,
          color: "var(--text-color, #1e293b)",
          transition: "all 0.15s ease"
        }}
      >
        <span style={{ fontSize: "1rem" }}>👥</span>
        <span>
          {activeMember ? activeMember.name : t("family_self")}
        </span>
        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>▼</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "115%",
            right: 0,
            width: "250px",
            background: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e2e8f0",
            padding: "0.5rem 0",
            zIndex: 100
          }}
        >
          <div style={{ padding: "0.4rem 0.85rem", fontSize: "0.75rem", textTransform: "uppercase", color: "#64748b", fontWeight: 700 }}>
            {t("family_active_profile")}
          </div>

          {/* Self Option */}
          <div
            onClick={() => handleSelect(null)}
            style={{
              padding: "0.5rem 0.85rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              background: activeMember === null ? "#ecfdf5" : "transparent",
              color: activeMember === null ? "#047857" : "#1e293b",
              fontWeight: activeMember === null ? 600 : 400
            }}
          >
            <span>👤 {t("family_self")} (Primary)</span>
            {activeMember === null && <span>✓</span>}
          </div>

          {/* Family Members List */}
          {familyMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => handleSelect(member)}
              style={{
                padding: "0.5rem 0.85rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                background: activeMember?.id === member.id ? "#ecfdf5" : "transparent",
                color: activeMember?.id === member.id ? "#047857" : "#1e293b",
                fontWeight: activeMember?.id === member.id ? 600 : 400
              }}
            >
              <div>
                <div>{member.name}</div>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{member.relationship} · {member.bloodGroup}</div>
              </div>
              {activeMember?.id === member.id && <span>✓</span>}
            </div>
          ))}

          <div style={{ borderTop: "1px solid #f1f5f9", marginTop: "0.4rem", paddingTop: "0.4rem", padding: "0.4rem 0.85rem" }}>
            <button
              onClick={() => {
                setIsOpen(false);
                setShowAddModal(true);
              }}
              style={{
                width: "100%",
                background: "none",
                border: "1px dashed #cbd5e1",
                padding: "0.4rem",
                borderRadius: "6px",
                cursor: "pointer",
                color: "#059669",
                fontSize: "0.8rem",
                fontWeight: 600
              }}
            >
              + {t("family_add_member")}
            </button>
          </div>
        </div>
      )}

      {/* Add Family Member Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div
            className="modal-container"
            style={{ maxWidth: "520px", width: "95%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 1rem 0", color: "#065f46" }}>
              👥 {t("family_add_member")}
            </h3>
            <form onSubmit={handleAddSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: "0.25rem" }}>
                  Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: "0.25rem" }}>
                    Relationship
                  </label>
                  <select
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Grandparent">Grandparent</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: "0.25rem" }}>
                    Blood Group
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: "0.25rem" }}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: "0.25rem" }}>
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: "0.25rem" }}>
                  Known Chronic Conditions
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hypertension, Type-2 Diabetes"
                  value={formData.chronicConditions}
                  onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: "0.25rem" }}>
                  Allergies
                </label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Sulfa drugs"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                >
                  {isSubmitting ? t("loading") : t("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
