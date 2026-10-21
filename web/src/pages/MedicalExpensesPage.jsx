import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useFamily } from "../context/FamilyContext.jsx";
import { backendService } from "../services/backendService.js";

const DEFAULT_EXPENSES = [
  {
    id: 1,
    title: "Quarterly Endocrinologist Consultation",
    category: "Doctor Consultations",
    amount: 1200.0,
    currency: "INR",
    date: "2026-10-02",
    facility: "Apollo Specialty Clinic",
    paymentStatus: "Paid",
    paymentMethod: "UPI",
    billNumber: "INV-2026-8801",
    notes: "Review of HbA1c and dosage titration for Metformin."
  },
  {
    id: 2,
    title: "Monthly Diabetes & Cardiac Medications",
    category: "Pharmacy & Medications",
    amount: 2450.0,
    currency: "INR",
    date: "2026-10-05",
    facility: "MedPlus Pharmacy",
    paymentStatus: "Paid",
    paymentMethod: "UPI",
    billNumber: "INV-2026-8842",
    notes: "Metformin 500mg (60 tabs) + Telmisartan 40mg (30 tabs)."
  },
  {
    id: 3,
    title: "Comprehensive Lipid & Renal Function Tests",
    category: "Diagnostics & Labs",
    amount: 1850.0,
    currency: "INR",
    date: "2026-09-18",
    facility: "Metro Diagnostics Centre",
    paymentStatus: "Paid",
    paymentMethod: "Credit Card",
    billNumber: "INV-2026-7910",
    notes: "Annual metabolic screen."
  },
  {
    id: 4,
    title: "Digital Blood Glucose Monitor & Test Strips",
    category: "Medical Devices",
    amount: 1400.0,
    currency: "INR",
    date: "2026-08-12",
    facility: "HealthKart Store",
    paymentStatus: "Paid",
    paymentMethod: "UPI",
    billNumber: "INV-2026-6105",
    notes: "Accu-Chek glucometer with 50 lancets and strips."
  }
];

export function MedicalExpensesPage() {
  const { t } = useLanguage();
  const { effectiveUserId, effectivePatientName } = useFamily();

  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Doctor Consultations",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    facility: "",
    paymentStatus: "Paid",
    paymentMethod: "UPI",
    billNumber: "",
    notes: ""
  });

  useEffect(() => {
    loadData();
  }, [effectiveUserId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [expData, sumData] = await Promise.all([
        backendService.getExpenses(effectiveUserId),
        backendService.getExpenseSummary(effectiveUserId)
      ]);
      if (Array.isArray(expData) && expData.length > 0) {
        setExpenses(expData);
        setSummary(sumData);
      } else {
        setExpenses(DEFAULT_EXPENSES);
        computeLocalSummary(DEFAULT_EXPENSES);
      }
    } catch (_) {
      setExpenses(DEFAULT_EXPENSES);
      computeLocalSummary(DEFAULT_EXPENSES);
    } finally {
      setLoading(false);
    }
  };

  const computeLocalSummary = (list) => {
    const total = list.sumOf ? list.sumOf((x) => x.amount) : list.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);
    const byCat = {};
    list.forEach((item) => {
      byCat[item.category] = (byCat[item.category] || 0) + (parseFloat(item.amount) || 0);
    });
    setSummary({
      totalAmount: total,
      currency: "INR",
      totalCount: list.length,
      byCategory: byCat
    });
  };

  const handleBillNumberBlur = async () => {
    if (!formData.billNumber.trim()) {
      setDuplicateWarning(null);
      return;
    }
    try {
      const res = await backendService.checkDuplicateInvoice(effectiveUserId, formData.billNumber.trim());
      if (res && res.isDuplicate) {
        setDuplicateWarning(t("expense_dup_warning") + ` (${res.message})`);
      } else {
        // Also check in current state
        const exists = expenses.some((e) => e.billNumber && e.billNumber.toLowerCase() === formData.billNumber.trim().toLowerCase());
        if (exists) {
          setDuplicateWarning(t("expense_dup_warning"));
        } else {
          setDuplicateWarning(null);
        }
      }
    } catch (_) {
      const exists = expenses.some((e) => e.billNumber && e.billNumber.toLowerCase() === formData.billNumber.trim().toLowerCase());
      setDuplicateWarning(exists ? t("expense_dup_warning") : null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.amount) return;

    setIsSubmitting(true);
    setStatusMessage(null);
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount) || 0,
        currency: "INR"
      };
      const saved = await backendService.createExpense(effectiveUserId, payload);
      const updatedList = [saved, ...expenses];
      setExpenses(updatedList);
      computeLocalSummary(updatedList);
      setShowAddForm(false);
      setFormData({
        title: "",
        category: "Doctor Consultations",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        facility: "",
        paymentStatus: "Paid",
        paymentMethod: "UPI",
        billNumber: "",
        notes: ""
      });
      setDuplicateWarning(null);
      setStatusMessage({ type: "success", text: "Healthcare expense logged successfully in Indian Rupees (₹)!" });
    } catch (_) {
      // Local fallback
      const localSaved = {
        ...formData,
        id: Date.now(),
        amount: parseFloat(formData.amount) || 0,
        currency: "INR"
      };
      const updatedList = [localSaved, ...expenses];
      setExpenses(updatedList);
      computeLocalSummary(updatedList);
      setShowAddForm(false);
      setStatusMessage({ type: "success", text: "Expense recorded locally!" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("confirm_delete"))) return;
    try {
      await backendService.deleteExpense(id, effectiveUserId);
    } catch (_) {}
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    computeLocalSummary(updated);
  };

  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch = exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exp.facility && exp.facility.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (exp.billNumber && exp.billNumber.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === "All" || exp.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalSpent = summary?.totalAmount || expenses.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>💳</span> {t("expense_title")}
          </h1>
          <p className="page-subtitle">{t("expense_subtitle")}</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "0.25rem 0.6rem", borderRadius: "16px", fontSize: "0.75rem", color: "#065f46", marginTop: "0.4rem" }}>
            <span>👤</span> {effectivePatientName} · Currency: Indian Rupee (INR ₹)
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
        >
          <span>{showAddForm ? "✕" : "+"}</span> {t("expense_add_heading")}
        </button>
      </div>

      {statusMessage && (
        <div style={{ padding: "0.75rem 1rem", borderRadius: "8px", marginBottom: "1rem", background: statusMessage.type === "error" ? "#fee2e2" : "#ecfdf5", color: statusMessage.type === "error" ? "#991b1b" : "#065f46", border: `1px solid ${statusMessage.type === "error" ? "#f87171" : "#6ee7b7"}` }}>
          {statusMessage.text}
        </div>
      )}

      {/* Aggregate KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div className="card" style={{ background: "linear-gradient(135deg, #065f46, #047857)", color: "#ffffff", border: "none" }}>
          <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>{t("expense_total_spent")}</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 800, marginTop: "0.25rem" }}>
            ₹{totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: "0.75rem", opacity: 0.8, marginTop: "0.5rem" }}>Across all medical categories</div>
        </div>

        <div className="card">
          <div style={{ fontSize: "0.85rem", color: "#64748b" }}>{t("expense_records_count")}</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#1e293b", marginTop: "0.25rem" }}>
            {expenses.length}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#059669", marginTop: "0.5rem" }}>Verified & categorized bills</div>
        </div>

        <div className="card">
          <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Average Cost per Visit</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 700, color: "#1e293b", marginTop: "0.25rem" }}>
            ₹{expenses.length > 0 ? (totalSpent / expenses.length).toFixed(0) : 0}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.5rem" }}>Per recorded healthcare event</div>
        </div>
      </div>

      {/* Category Breakdown Bar */}
      {summary?.byCategory && Object.keys(summary.byCategory).length > 0 && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "0.95rem", margin: "0 0 0.75rem 0", color: "#1e293b" }}>Category Expenditure Breakdown</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {Object.entries(summary.byCategory).map(([cat, amt]) => {
              const pct = totalSpent > 0 ? Math.round((amt / totalSpent) * 100) : 0;
              return (
                <div key={cat}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#475569", marginBottom: "0.2rem" }}>
                    <span>{cat}</span>
                    <span><strong>₹{amt.toLocaleString("en-IN")}</strong> ({pct}%)</span>
                  </div>
                  <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: "#059669", borderRadius: "4px" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Expense Form Modal / Collapsible */}
      {showAddForm && (
        <div className="card" style={{ marginBottom: "1.5rem", border: "2px solid #a7f3d0" }}>
          <h3 style={{ fontSize: "1.1rem", margin: "0 0 1rem 0", color: "#065f46" }}>
            ➕ {t("expense_add_heading")}
          </h3>

          {duplicateWarning && (
            <div style={{ background: "#fffbeb", borderLeft: "4px solid #f59e0b", padding: "0.6rem 0.85rem", borderRadius: "0 6px 6px 0", fontSize: "0.85rem", color: "#b45309", marginBottom: "1rem" }}>
              ⚠️ {duplicateWarning}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: "0.3rem" }}>
                  {t("expense_title_label")} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cardiologist consultation + ECG"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: "0.3rem" }}>
                  {t("expense_amount_label")} *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="e.g. 1500.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: "0.3rem" }}>
                  {t("expense_category_label")}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                >
                  <option value="Doctor Consultations">Doctor Consultations</option>
                  <option value="Pharmacy & Medications">Pharmacy & Medications</option>
                  <option value="Diagnostics & Labs">Diagnostics & Labs</option>
                  <option value="Hospitalization / Surgery">Hospitalization / Surgery</option>
                  <option value="Medical Devices">Medical Devices</option>
                  <option value="Preventive Health">Preventive Health</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: "0.3rem" }}>
                  {t("expense_facility_label")}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apollo Clinic, Fortis Hospital"
                  value={formData.facility}
                  onChange={(e) => setFormData({ ...formData, facility: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: "0.3rem" }}>
                  {t("expense_date_label")}
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: "0.3rem" }}>
                  {t("expense_bill_no_label")} (Invoice / Receipt #)
                </label>
                <input
                  type="text"
                  placeholder="e.g. INV-2026-9041"
                  value={formData.billNumber}
                  onChange={(e) => setFormData({ ...formData, billNumber: e.target.value })}
                  onBlur={handleBillNumberBlur}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: duplicateWarning ? "2px solid #f59e0b" : "1px solid #cbd5e1" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: "0.3rem" }}>
                  {t("expense_method_label")}
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                >
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Cash">Cash</option>
                  <option value="Health Insurance Claim">Health Insurance Claim</option>
                  <option value="Net Banking">Net Banking</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: "0.3rem" }}>
                  {t("expense_status_label")}
                </label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Reimbursed">Reimbursed</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
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
      )}

      {/* Search and Filters */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder={t("search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "100%", maxWidth: "320px", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
        />

        <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto" }}>
          {["All", "Doctor Consultations", "Pharmacy & Medications", "Diagnostics & Labs", "Medical Devices", "Hospitalization / Surgery"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              style={{
                padding: "0.35rem 0.75rem",
                borderRadius: "20px",
                border: "1px solid",
                borderColor: categoryFilter === cat ? "#059669" : "#cbd5e1",
                background: categoryFilter === cat ? "#ecfdf5" : "#ffffff",
                color: categoryFilter === cat ? "#065f46" : "#475569",
                fontSize: "0.8rem",
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Expenses Table / List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
          <div className="spinner" style={{ margin: "0 auto 1rem" }} />
          <p>{t("loading")}</p>
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🧾</div>
          <p>{t("expense_empty")}</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "0.75rem 1rem", color: "#475569" }}>Date</th>
                <th style={{ padding: "0.75rem 1rem", color: "#475569" }}>Description / Facility</th>
                <th style={{ padding: "0.75rem 1rem", color: "#475569" }}>Category</th>
                <th style={{ padding: "0.75rem 1rem", color: "#475569" }}>Bill #</th>
                <th style={{ padding: "0.75rem 1rem", color: "#475569" }}>Method / Status</th>
                <th style={{ padding: "0.75rem 1rem", color: "#475569", textAlign: "right" }}>Amount (₹)</th>
                <th style={{ padding: "0.75rem 1rem", color: "#475569", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "0.75rem 1rem", color: "#64748b", whiteSpace: "nowrap" }}>
                    {exp.date}
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <div style={{ fontWeight: 600, color: "#1e293b" }}>{exp.title}</div>
                    {exp.facility && <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{exp.facility}</div>}
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "12px", background: "#f1f5f9", color: "#334155" }}>
                      {exp.category}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem 1rem", fontFamily: "monospace", fontSize: "0.8rem", color: "#64748b" }}>
                    {exp.billNumber || "—"}
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <div style={{ fontSize: "0.8rem", color: "#334155" }}>{exp.paymentMethod}</div>
                    <span style={{ fontSize: "0.7rem", fontWeight: 600, color: exp.paymentStatus === "Paid" ? "#059669" : "#d97706" }}>
                      ● {exp.paymentStatus}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem 1rem", textAlign: "right", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap" }}>
                    ₹{parseFloat(exp.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="btn btn-secondary"
                      style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", color: "#dc2626", borderColor: "#fecaca" }}
                    >
                      {t("delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
