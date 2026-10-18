import React from "react";
import { Search, Bell, Menu, Cloud, HardDrive } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function Topbar({ onMenuClick, searchTerm, setSearchTerm, onOpenAuth, onOpenNotifications }) {
  const { currentUser, isDemoMode, isFirebaseConfigured } = useAuth();

  const isConnectedToFirebase = Boolean(isFirebaseConfigured && !isDemoMode && currentUser && !currentUser.isDemo);

  const initials = currentUser?.displayName
    ? currentUser.displayName.slice(0, 2).toUpperCase()
    : "AK";

  return (
    <header className="topbar">
      <button className="menu-toggle" onClick={onMenuClick} aria-label="Open sidebar menu">
        <Menu size={20} />
      </button>

      <div className="search-box">
        <Search size={18} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search records, doctors, prescriptions..."
          aria-label="Search records and doctors"
        />
      </div>

      <div className="topbar-right">
        {isConnectedToFirebase ? (
          <div
            className="mode-badge cloud"
            title={`Connected to Cloud Firestore database (/users/${currentUser.uid})`}
            style={{ cursor: "pointer" }}
            onClick={onOpenAuth}
          >
            <Cloud size={14} />
            <span>Firebase Connected</span>
          </div>
        ) : (
          <div
            className="mode-badge demo"
            title="Operating in Local Demo Mode using persistent browser storage"
            style={{ cursor: "pointer" }}
            onClick={onOpenAuth}
          >
            <HardDrive size={14} />
            <span>Local Demo Mode</span>
          </div>
        )}

        <button
          className="icon-btn"
          onClick={onOpenNotifications}
          aria-label="View notifications"
          title="Health alerts & reminders"
        >
          <Bell size={18} />
        </button>

        <button
          className="avatar-btn"
          onClick={onOpenAuth}
          aria-label="Account details and settings"
          title={`Signed in as: ${currentUser?.displayName || currentUser?.email || "Akanksha K."} (${isConnectedToFirebase ? 'Cloud' : 'Demo'})`}
        >
          {initials}
        </button>
      </div>
    </header>
  );
}
