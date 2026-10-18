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
  Database
} from "lucide-react";

export function Sidebar({ active, setActive, mobileOpen, setMobileOpen, onOpenAuth }) {
  const navItems = [
    { id: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "Medical Records", label: "Medical Records", icon: FileText },
    { id: "Medications", label: "Medications", icon: Pill },
    { id: "Appointments", label: "Appointments", icon: CalendarDays },
    { id: "Health Timeline", label: "Health Timeline", icon: Activity },
    { id: "Health Analytics", label: "Health Analytics", icon: TrendingUp },
    { id: "Diabetes Screening", label: "Diabetes Screening", icon: HeartPulse, badge: "AI ML" },
    { id: "Profile & Settings", label: "Profile & Settings", icon: UserRound }
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
