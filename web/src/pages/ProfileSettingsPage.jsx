import React, { useState } from "react";
import {
  User,
  Shield,
  Key,
  LogOut,
  CheckCircle2,
  Cloud,
  HardDrive,
  Mail,
  Phone,
  Heart,
  Calendar
} from "lucide-react";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { useAuth } from "../context/AuthContext";

export function ProfileSettingsPage({ onOpenAuth }) {
  const { currentUser, isDemoMode, isFirebaseConfigured, logout } = useAuth();

  const [name, setName] = useState(currentUser?.displayName || "Akanksha K.");
  const [bloodGroup, setBloodGroup] = useState(currentUser?.bloodGroup || "O+");
  const [dob, setDob] = useState(currentUser?.dob || "2003-05-14");
  const [emergencyContact, setEmergencyContact] = useState(
    currentUser?.emergencyContact || "+91 98765 43210 (Mother)"
  );
  const [savedNotice, setSavedNotice] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="eyebrow">Patient Identity & Preferences</p>
          <h1>Profile & Account Settings</h1>
          <p className="page-sub">
            Manage your personal healthcare profile, emergency contacts, and database security settings.
          </p>
        </div>
      </div>

      <DisclaimerBanner
        compact
        message="Patient identity and personal health records are restricted strictly to your authenticated UID under Cloud Firestore security rules."
      />

      <div className="screening-grid">
        {/* Personal Profile Form */}
        <section className="panel" style={{ margin: 0 }}>
          <div className="panel-header">
            <div>
              <h3>Personal Health Information</h3>
              <span>Core demographic and medical profile</span>
            </div>
          </div>

          {savedNotice && (
            <div
              style={{
                background: "var(--status-success-bg)",
                border: "1px solid var(--border-light)",
                padding: 10,
                borderRadius: "var(--radius-md)",
                marginBottom: 14,
                color: "var(--status-success-text)",
                fontSize: 12.5,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
            >
              <CheckCircle2 size={16} />
              <span>Profile information successfully updated!</span>
            </div>
          )}

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Full Patient Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Registered Email</label>
                <input
                  type="email"
                  disabled
                  value={currentUser?.email || "akanksha.student@medivault.ai"}
                  style={{ background: "var(--bg-page)", cursor: "not-allowed" }}
                />
              </div>

              <div className="form-group">
                <label>Blood Group</label>
                <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)}>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Emergency Contact</label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="Name and telephone number"
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
              <button type="submit" className="btn-primary">
                Save Profile Changes
              </button>
            </div>
          </form>
        </section>

        {/* Security & Database Status Panel */}
        <section className="panel" style={{ margin: 0 }}>
          <div className="panel-header">
            <div>
              <h3>Security & Cloud Architecture</h3>
              <span>WMAD database credentials & session state</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                background: isFirebaseConfigured && !isDemoMode ? "var(--bg-soft-green)" : "var(--status-warning-bg)",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-md)",
                padding: 14
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                {isFirebaseConfigured && !isDemoMode ? (
                  <Cloud size={18} style={{ color: "var(--primary-emerald)" }} />
                ) : (
                  <HardDrive size={18} style={{ color: "var(--status-warning-text)" }} />
                )}
                <strong style={{ fontSize: 13, color: "var(--text-main)" }}>
                  {isFirebaseConfigured && !isDemoMode ? "Cloud Firestore Active" : "Local Demo Storage Active"}
                </strong>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
                {isFirebaseConfigured && !isDemoMode
                  ? `Authenticated as UID: ${currentUser?.uid}. All collections (/users/${currentUser?.uid}/...) are guarded by security rules.`
                  : "Firebase environment keys are not yet configured in web/.env. You can manage records locally with full CRUD support, or configure Firebase via web/.env.example."}
              </p>
            </div>

            <div style={{ background: "var(--bg-page)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: 14 }}>
              <strong style={{ fontSize: 12.5, color: "var(--text-main)", display: "block", marginBottom: 6 }}>
                Least-Privilege Security Rules:
              </strong>
              <code style={{ fontSize: 11, color: "var(--dark-green)", display: "block", background: "#fff", padding: 8, borderRadius: 6, border: "1px solid var(--border-light)" }}>
                match /users/&#123;userId&#125;/&#123;document=**&#125; &#123; <br />
                &nbsp;&nbsp;allow read, write: if request.auth != null && request.auth.uid == userId;<br />
                &#125;
              </code>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={onOpenAuth}>
                <Key size={15} /> Switch User / Auth Modal
              </button>
              <button
                className="btn-danger"
                style={{ flex: 1 }}
                onClick={async () => {
                  if (window.confirm("Sign out of current MediVault session?")) {
                    await logout();
                  }
                }}
              >
                <LogOut size={15} /> Sign Out Session
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
