import React, { useState } from "react";
import { X, Lock, Mail, User, ShieldCheck, Cloud, HardDrive, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function AuthModal({ isOpen, onClose }) {
  const { currentUser, isDemoMode, isFirebaseConfigured, login, register, logout, enterDemoMode } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      if (isRegistering) {
        await register(email, password, displayName);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      setErrorMessage(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal-card" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <div>
            <h3>{currentUser && !isDemoMode ? "Account & Cloud Sync" : isRegistering ? "Create MediVault Account" : "Sign In to MediVault"}</h3>
            <p>
              {isFirebaseConfigured
                ? "Connected to Firebase Authentication & Cloud Firestore"
                : "Firebase not yet configured — Running in Local Demo Mode"}
            </p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close authentication modal">
            <X size={18} />
          </button>
        </div>

        {currentUser && !isDemoMode ? (
          <div>
            <div style={{ background: "var(--bg-soft-green)", padding: 16, borderRadius: "var(--radius-md)", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Cloud size={18} style={{ color: "var(--primary-emerald)" }} />
                <strong style={{ fontSize: 13, color: "var(--dark-green)" }}>Active Firebase Cloud Session</strong>
              </div>
              <p style={{ margin: 0, fontSize: 12.5, color: "var(--text-main)" }}>
                <strong>User:</strong> {currentUser.displayName || "Patient"} ({currentUser.email})
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "var(--text-secondary)" }}>
                <strong>UID:</strong> {currentUser.uid}
              </p>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  enterDemoMode();
                  onClose();
                }}
              >
                Switch to Demo Mode
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={async () => {
                  await logout();
                  onClose();
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div>
            {!isFirebaseConfigured && (
              <div style={{ background: "var(--status-warning-bg)", border: "1px solid var(--status-warning-border)", padding: 12, borderRadius: "var(--radius-md)", marginBottom: 14, fontSize: 12, color: "var(--status-warning-text)" }}>
                <strong>Demo Mode Active:</strong> You can test signing in with any email/password below or continue using the pre-loaded Akanksha K. demo patient profile. To connect live cloud persistence, set your Firebase keys in <code>.env</code>.
              </div>
            )}

            {errorMessage && (
              <div style={{ background: "var(--status-danger-bg)", border: "1px solid var(--status-danger-border)", padding: 10, borderRadius: "var(--radius-md)", marginBottom: 14, fontSize: 12, color: "var(--status-danger-text)", display: "flex", gap: 8, alignItems: "center" }}>
                <AlertCircle size={16} flexShrink={0} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {isRegistering && (
                <div className="form-group">
                  <label htmlFor="auth-name">Full Name</label>
                  <input
                    id="auth-name"
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Akanksha K."
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="auth-email">Email Address</label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="auth-password">Password</label>
                <input
                  id="auth-password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                />
              </div>

              <div className="modal-actions" style={{ marginTop: 20 }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    enterDemoMode();
                    onClose();
                  }}
                >
                  Use Demo Patient
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Processing..." : isRegistering ? "Register Account" : "Sign In"}
                </button>
              </div>
            </form>

            <div style={{ textAlign: "center", marginTop: 16, fontSize: 12.5, color: "var(--text-secondary)" }}>
              {isRegistering ? (
                <span>
                  Already have an account?{" "}
                  <button
                    type="button"
                    style={{ background: "none", border: "none", color: "var(--primary-emerald)", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => {
                      setIsRegistering(false);
                      setErrorMessage("");
                    }}
                  >
                    Sign In
                  </button>
                </span>
              ) : (
                <span>
                  Need an account?{" "}
                  <button
                    type="button"
                    style={{ background: "none", border: "none", color: "var(--primary-emerald)", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => {
                      setIsRegistering(true);
                      setErrorMessage("");
                    }}
                  >
                    Register here
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
