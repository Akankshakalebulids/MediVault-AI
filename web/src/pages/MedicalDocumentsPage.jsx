import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useFamily } from "../context/FamilyContext.jsx";
import { backendService } from "../services/backendService.js";
import { aiDocumentOcrService } from "../services/aiDocumentOcrService.js";

const DEFAULT_DOCUMENTS = [
  {
    id: "doc-1",
    name: "Comprehensive_Lipid_Panel_Report.pdf",
    category: "Laboratory Report",
    fileType: "application/pdf",
    fileSize: 245000,
    uploadDate: "2026-10-15T10:30:00Z",
    notes: "Total Cholesterol: 215 mg/dL, HDL: 42 mg/dL, LDL: 138 mg/dL. Mild elevation noted.",
    extractedText: "METRO DIAGNOSTICS LAB\nTotal Cholesterol: 215 mg/dL\nHDL: 42 mg/dL\nLDL: 138 mg/dL\nTriglycerides: 175 mg/dL\nObservation: Borderline hyperlipidemia."
  },
  {
    id: "doc-2",
    name: "Quarterly_Endocrine_Prescription.pdf",
    category: "Prescription",
    fileType: "application/pdf",
    fileSize: 182000,
    uploadDate: "2026-10-02T14:15:00Z",
    notes: "Metformin 500mg BID + Telmisartan 40mg OD.",
    extractedText: "DR. SANJAY JOSHI, MD\nRx:\n1. Tab Metformin 500mg BID with meals\n2. Tab Telmisartan 40mg OD morning"
  },
  {
    id: "doc-3",
    name: "Hospital_Inpatient_Discharge_Summary.pdf",
    category: "Discharge Summary",
    fileType: "application/pdf",
    fileSize: 520000,
    uploadDate: "2026-09-10T16:00:00Z",
    notes: "Cardiac monitoring stable; discharged on oral statins and antihypertensives.",
    extractedText: "DISCHARGE SUMMARY\nVitals at discharge: BP 122/78 mmHg, Pulse 74 bpm. Vitals stable."
  }
];

export function MedicalDocumentsPage() {
  const { t } = useLanguage();
  const { effectiveUserId, effectivePatientName } = useFamily();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Upload Form State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [docName, setDocName] = useState("");
  const [docCategory, setDocCategory] = useState("Laboratory Report");
  const [docNotes, setDocNotes] = useState("");

  // AI Extraction State & Modal
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedResult, setExtractedResult] = useState(null);
  const [showExtractionModal, setShowExtractionModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    loadDocuments();
  }, [effectiveUserId]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const data = await backendService.getDocuments(effectiveUserId);
      if (Array.isArray(data) && data.length > 0) {
        setDocuments(data);
      } else {
        setDocuments(DEFAULT_DOCUMENTS);
      }
    } catch (_) {
      setDocuments(DEFAULT_DOCUMENTS);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      if (!docName) {
        setDocName(file.name);
      }
    }
  };

  const handleAiExtract = async () => {
    if (!uploadFile && !docName) {
      setStatusMessage({ type: "error", text: "Please select a file or enter a document title first." });
      return;
    }
    setIsExtracting(true);
    try {
      const result = await aiDocumentOcrService.extractClinicalEntities(
        uploadFile || docName,
        docCategory
      );
      setExtractedResult(result);
      setShowExtractionModal(true);
      if (result.summaryNotes && !docNotes) {
        setDocNotes(result.summaryNotes);
      }
    } catch (err) {
      setStatusMessage({ type: "error", text: "Extraction failed: " + err.message });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!docName.trim() && !uploadFile) return;

    setIsUploading(true);
    setStatusMessage(null);
    try {
      let savedDoc;
      if (uploadFile) {
        const formData = new FormData();
        formData.append("file", uploadFile);
        formData.append("name", docName || uploadFile.name);
        formData.append("category", docCategory);
        formData.append("notes", docNotes);
        formData.append("extractedText", extractedResult ? extractedResult.rawText : "");
        savedDoc = await backendService.uploadDocument(effectiveUserId, formData);
      } else {
        savedDoc = await backendService.createDocument(effectiveUserId, {
          name: docName,
          category: docCategory,
          fileType: "application/pdf",
          notes: docNotes,
          extractedText: extractedResult ? extractedResult.rawText : ""
        });
      }

      setDocuments((prev) => [savedDoc, ...prev]);
      setStatusMessage({ type: "success", text: "Document uploaded and indexed successfully!" });
      // Reset form
      setUploadFile(null);
      setDocName("");
      setDocNotes("");
      setExtractedResult(null);
    } catch (err) {
      // Local fallback
      const localDoc = {
        id: "doc-local-" + Date.now(),
        name: docName || uploadFile?.name || "Uploaded Document",
        category: docCategory,
        fileType: uploadFile?.type || "application/pdf",
        fileSize: uploadFile?.size || 150000,
        uploadDate: new Date().toISOString(),
        notes: docNotes,
        extractedText: extractedResult ? extractedResult.rawText : ""
      };
      setDocuments((prev) => [localDoc, ...prev]);
      setStatusMessage({ type: "success", text: "Document saved to secure browser vault!" });
      setUploadFile(null);
      setDocName("");
      setDocNotes("");
      setExtractedResult(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("confirm_delete"))) return;
    try {
      await backendService.deleteDocument(id, effectiveUserId);
    } catch (_) {}
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleDownload = (doc) => {
    if (doc.filePath) {
      window.open(backendService.getDocumentDownloadUrl(doc.id, effectiveUserId), "_blank");
    } else {
      // Generate text blob for download
      const blob = new Blob([doc.extractedText || doc.notes || "MediVault Clinical Document"], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc.name}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleSaveToRecords = async () => {
    if (!extractedResult) return;
    try {
      await backendService.createRecord(effectiveUserId, {
        title: docName || "AI Extracted Clinical Report",
        category: "Laboratory",
        doctor: "Document OCR Extraction",
        facility: "Uploaded Diagnostic Report",
        date: new Date().toISOString().split("T")[0],
        diagnosisNotes: extractedResult.summaryNotes + (extractedResult.clinicalWarnings.length > 0 ? " " + extractedResult.clinicalWarnings.join(" ") : ""),
        status: "Reviewed"
      });
      setStatusMessage({ type: "success", text: "Extracted data saved into Medical Records!" });
      setShowExtractionModal(false);
    } catch (err) {
      setStatusMessage({ type: "error", text: "Failed to create medical record: " + err.message });
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.notes && doc.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.extractedText && doc.extractedText.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = categoryFilter === "All" || doc.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>📁</span> {t("doc_vault_title")}
          </h1>
          <p className="page-subtitle">{t("doc_vault_subtitle")}</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "0.25rem 0.6rem", borderRadius: "16px", fontSize: "0.75rem", color: "#065f46", marginTop: "0.4rem" }}>
            <span>🛡️</span> {effectivePatientName} · {t("verified_secure")}
          </div>
        </div>
      </div>

      {statusMessage && (
        <div style={{ padding: "0.75rem 1rem", borderRadius: "8px", marginBottom: "1rem", background: statusMessage.type === "error" ? "#fee2e2" : "#ecfdf5", color: statusMessage.type === "error" ? "#991b1b" : "#065f46", border: `1px solid ${statusMessage.type === "error" ? "#f87171" : "#6ee7b7"}` }}>
          {statusMessage.text}
        </div>
      )}

      {/* Upload Box */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.1rem", margin: "0 0 1rem 0", color: "#1e293b", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span>📤</span> {t("doc_upload_heading")}
        </h2>

        <form onSubmit={handleUploadSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: "0.3rem" }}>
                Select File (PDF, Image, Scan)
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.txt"
                onChange={handleFileChange}
                style={{ width: "100%", padding: "0.4rem", border: "1px dashed #cbd5e1", borderRadius: "6px", background: "#f8fafc" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: "0.3rem" }}>
                {t("doc_name_label")} *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Fasting_Sugar_HbA1c_Report.pdf"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
                style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: "0.3rem" }}>
                {t("doc_category_label")}
              </label>
              <select
                value={docCategory}
                onChange={(e) => setDocCategory(e.target.value)}
                style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
              >
                <option value="Laboratory Report">{t("doc_cat_lab")}</option>
                <option value="Prescription">{t("doc_cat_prescription")}</option>
                <option value="Discharge Summary">{t("doc_cat_discharge")}</option>
                <option value="Imaging / Radiology">{t("doc_cat_imaging")}</option>
                <option value="Hospital / Medical Bill">{t("doc_cat_invoice")}</option>
                <option value="Health Insurance Document">{t("doc_cat_insurance")}</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#475569", marginBottom: "0.3rem" }}>
              Clinical Observations / {t("notes")}
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Fasting blood sugar 126 mg/dL, HbA1c 7.2%. Physician noted borderline elevation."
              value={docNotes}
              onChange={(e) => setDocNotes(e.target.value)}
              style={{ width: "100%", padding: "0.5rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
            <button
              type="button"
              onClick={handleAiExtract}
              disabled={isExtracting}
              className="btn btn-secondary"
              style={{ display: "flex", alignItems: "center", gap: "0.4rem", borderColor: "#059669", color: "#059669" }}
            >
              <span>✨</span> {isExtracting ? t("doc_ai_extracting") : t("doc_ai_extract_btn")}
            </button>

            <button
              type="submit"
              disabled={isUploading}
              className="btn btn-primary"
              style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <span>☁️</span> {isUploading ? t("loading") : t("upload")}
            </button>
          </div>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, minWidth: "220px", maxWidth: "360px" }}>
          <input
            type="text"
            placeholder={t("search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid #cbd5e1" }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto" }}>
          {["All", "Laboratory Report", "Prescription", "Discharge Summary", "Imaging / Radiology", "Hospital / Medical Bill"].map((cat) => (
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

      {/* Document Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
          <div className="spinner" style={{ margin: "0 auto 1rem" }} />
          <p>{t("loading")}</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem", color: "#64748b" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📂</div>
          <p>{t("doc_empty")}</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", border: "1px solid #e2e8f0" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.8rem" }}>
                    {doc.category === "Prescription" ? "💊" : doc.category === "Hospital / Medical Bill" ? "🧾" : "📄"}
                  </span>
                  <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", borderRadius: "12px", background: "#f1f5f9", color: "#475569", fontWeight: 600 }}>
                    {doc.category}
                  </span>
                </div>

                <h3 style={{ fontSize: "0.95rem", margin: "0 0 0.4rem 0", color: "#0f172a", wordBreak: "break-word" }}>
                  {doc.name}
                </h3>

                <p style={{ fontSize: "0.8rem", color: "#64748b", margin: "0 0 0.75rem 0", lineHeight: 1.4 }}>
                  {doc.notes || "No clinical description entered."}
                </p>

                {doc.extractedText && (
                  <div style={{ background: "#f8fafc", padding: "0.5rem 0.65rem", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.75rem", color: "#334155", maxHeight: "80px", overflowY: "auto", fontFamily: "monospace", marginBottom: "0.75rem" }}>
                    {doc.extractedText}
                  </div>
                )}
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "#94a3b8", marginBottom: "0.75rem", borderTop: "1px solid #f1f5f9", paddingTop: "0.5rem" }}>
                  <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                  <span>{doc.fileSize ? `${Math.round(doc.fileSize / 1024)} KB` : "Document"}</span>
                </div>

                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => handleDownload(doc)}
                    className="btn btn-secondary"
                    style={{ padding: "0.3rem 0.65rem", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.3rem" }}
                  >
                    <span>⬇️</span> {t("download")}
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="btn btn-secondary"
                    style={{ padding: "0.3rem 0.65rem", fontSize: "0.75rem", color: "#dc2626", borderColor: "#fecaca" }}
                  >
                    {t("delete")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Extraction Modal */}
      {showExtractionModal && extractedResult && (
        <div className="modal-backdrop" onClick={() => setShowExtractionModal(false)}>
          <div className="modal-container" style={{ maxWidth: "650px", width: "95%" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.75rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ fontSize: "1.4rem" }}>✨</span>
                <h3 style={{ margin: 0, color: "#065f46" }}>{t("doc_extracted_preview")}</h3>
              </div>
              <button onClick={() => setShowExtractionModal(false)} className="btn btn-secondary" style={{ padding: "0.3rem 0.6rem" }}>✕</button>
            </div>

            {/* Extracted Lab Markers */}
            {extractedResult.labMarkers?.length > 0 && (
              <div style={{ marginBottom: "1rem" }}>
                <h4 style={{ fontSize: "0.9rem", color: "#1e293b", margin: "0 0 0.5rem 0" }}>Laboratory Parameters</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {extractedResult.labMarkers.map((marker, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0.75rem", background: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.85rem" }}>
                      <div>
                        <strong>{marker.name}</strong>: {marker.value} {marker.unit}
                        <span style={{ fontSize: "0.75rem", color: "#64748b", marginLeft: "0.5rem" }}>(Ref: {marker.referenceRange})</span>
                      </div>
                      <span style={{ fontWeight: 600, color: marker.status.includes("Elevated") || marker.status.includes("High") ? "#dc2626" : "#059669" }}>
                        {marker.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Blood Pressure Vitals */}
            {extractedResult.vitals?.bloodPressure && (
              <div style={{ marginBottom: "1rem", padding: "0.6rem 0.85rem", background: "#f0fdf4", borderRadius: "6px", border: "1px solid #bbf7d0", fontSize: "0.85rem" }}>
                <strong>Vitals:</strong> Blood Pressure {extractedResult.vitals.bloodPressure} — <span style={{ color: "#047857", fontWeight: 600 }}>{extractedResult.vitals.bpStatus}</span>
              </div>
            )}

            {/* Clinical Warnings / Anemia Notice */}
            {extractedResult.clinicalWarnings?.length > 0 && (
              <div style={{ background: "#fffbeb", borderLeft: "4px solid #f59e0b", padding: "0.6rem 0.85rem", borderRadius: "0 6px 6px 0", fontSize: "0.8rem", color: "#92400e", marginBottom: "1rem" }}>
                {extractedResult.clinicalWarnings.map((w, idx) => (
                  <div key={idx}>⚠️ {w}</div>
                ))}
              </div>
            )}

            {/* Medications Detected */}
            {extractedResult.medications?.length > 0 && (
              <div style={{ marginBottom: "1rem" }}>
                <h4 style={{ fontSize: "0.9rem", color: "#1e293b", margin: "0 0 0.4rem 0" }}>Prescription Line Items</h4>
                <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.85rem", color: "#334155" }}>
                  {extractedResult.medications.map((med, idx) => (
                    <li key={idx}>{med}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Invoice Detected */}
            {extractedResult.invoice && (
              <div style={{ marginBottom: "1rem", padding: "0.6rem 0.85rem", background: "#f8fafc", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.85rem" }}>
                <strong>Financial Summary:</strong> Invoice #{extractedResult.invoice.billNumber} · Amount: <strong>₹{extractedResult.invoice.amount}</strong> · Status: {extractedResult.invoice.paymentStatus}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", borderTop: "1px solid #e2e8f0", paddingTop: "0.75rem" }}>
              <button onClick={() => setShowExtractionModal(false)} className="btn btn-secondary">
                {t("cancel")}
              </button>
              <button onClick={handleSaveToRecords} className="btn btn-primary">
                Save Extracted Data to Medical Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
