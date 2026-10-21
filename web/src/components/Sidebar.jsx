import React from "react";
import {
  LayoutDashboard,
  FileText,
  Pill,
  CalendarDays,
  Activity,
  TrendingUp,
  HeartPulse,
  UserRound,
  ShieldCheck,
  LogOut,
  X,
  Database,
  FolderArchive,
  Receipt
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export function Sidebar({ active, setActive, mobileOpen, setMobileOpen, onOpenAuth }) {
  const { t } = useLanguage();

  const navItems = [
    { id: "Dashboard", label: t("nav_dashboard"), icon: LayoutDashboard },
    { id: "Medical Records", label: t("nav_records"), icon: FileText },
    { id: "Documents Vault", label: t("nav_documents"), icon: FolderArchive, badge: "OCR" },
    { id: "Medical Expenses", label: t("nav_expenses"), icon: Receipt, badge: "INR ₹" },
    { id: "Medications", label: t("nav_medications"), icon: Pill },
    { id: "Appointments", label: t("nav_appointments"), icon: CalendarDays },
    { id: "Health Timeline", label: t("nav_timeline"), icon: Activity },
    { id: "Health Analytics", label: t("nav_analytics"), icon: TrendingUp },
    { id: "Diabetes Screening", label: t("nav_diabetes"), icon: HeartPulse, badge: "AI ML" },
    { id: "Profile & Settings", label: t("nav_profile"), icon: UserRound }
  ];


  return (
    <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
      <div className="brand">
        <div className="brand-mark">
          <HeartPulse size={22} />
        </div>
        <div>
          <strong>MediVault AI</strong>
          <span>Care & Screening</span>
        </div>
        {mobileOpen && (
          <button
            className="icon-btn"
            style={{ marginLeft: "auto", border: "none" }}
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="nav-section-title">Patient Portal</div>
      <nav className="nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => {
                setActive(item.id);
                setMobileOpen(false);
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.badge && <span className="badge-tag">{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="security-box">
          <ShieldCheck size={20} style={{ color: "var(--primary-emerald)", flexShrink: 0 }} />
          <div>
            <b>Private & Isolated</b>
            <small>Records scoped strictly to your account UID.</small>
          </div>
        </div>

        <button className="nav-item" onClick={onOpenAuth} style={{ color: "var(--text-main)" }}>
          <Database size={17} style={{ color: "var(--primary-emerald)" }} />
          <span>Cloud & Auth</span>
        </button>
      </div>
    </aside>
  );
}
