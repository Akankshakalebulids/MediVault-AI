import React from "react";
import { Search, Bell, Menu, Cloud, HardDrive, FileSpreadsheet, Globe } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { FamilyMemberSwitcher } from "./FamilyMemberSwitcher";

export function Topbar({ onMenuClick, searchTerm, setSearchTerm, onOpenAuth, onOpenNotifications, onOpenDoctorSummary }) {
  const { currentUser, isDemoMode, isFirebaseConfigured } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();

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
          placeholder={t("search")}
          aria-label="Search records and doctors"
        />
      </div>

      <div className="topbar-right" style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        {/* Family Member Switcher */}
        <FamilyMemberSwitcher />

        {/* Doctor Visit Summary Quick Button */}
        <button
          onClick={onOpenDoctorSummary}
          className="btn btn-secondary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.4rem 0.75rem",
            fontSize: "0.8rem",
            color: "#065f46",
            borderColor: "#a7f3d0",
            background: "#ecfdf5",
            fontWeight: 600
          }}
          title="Generate Clinical Doctor-Visit Summary"
        >
          <span>🩺</span>
          <span className="hide-on-mobile">{t("summary_btn")}</span>
        </button>

        {/* Bilingual Language Switcher (EN / हिन्दी) */}
        <button
          onClick={toggleLanguage}
          className="btn btn-secondary"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            padding: "0.4rem 0.65rem",
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "#1e293b"
          }}
          title="Switch Language / भाषा बदलें"
        >
          <Globe size={15} style={{ color: "#059669" }} />
          <span>{lang === "en" ? "हिन्दी" : "EN"}</span>
        </button>

        {isConnectedToFirebase ? (
          <div
            className="mode-badge cloud"
            title={`Connected to Cloud Firestore database (/users/${currentUser.uid})`}
            style={{ cursor: "pointer" }}
            onClick={onOpenAuth}
          >
            <Cloud size={14} />
            <span className="hide-on-mobile">Firebase Connected</span>
          </div>
        ) : (
          <div
            className="mode-badge demo"
            title="Operating in Local Demo Mode using persistent browser storage"
            style={{ cursor: "pointer" }}
            onClick={onOpenAuth}
          >
            <HardDrive size={14} />
            <span className="hide-on-mobile">Local Mode</span>
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

