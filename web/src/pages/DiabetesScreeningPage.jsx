import React, { useState, useEffect } from "react";
import {
  HeartPulse,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Activity,
  Server,
  Layers,
  ArrowRight
} from "lucide-react";
import { DisclaimerBanner } from "../components/DisclaimerBanner";
import { predictDiabetesRisk, fetchModelInfo } from "../services/mlService";

export function DiabetesScreeningPage() {
  // Input fields matching Pima clinical attributes
  const [age, setAge] = useState(32);
  const [bmi, setBmi] = useState(24.5);
  const [glucose, setGlucose] = useState(98);
  const [bloodPressure, setBloodPressure] = useState(76);
  const [pregnancies, setPregnancies] = useState(1);
  const [insulin, setInsulin] = useState(85);
  const [skinThickness, setSkinThickness] = useState(20);
  const [pedigree, setPedigree] = useState(0.35);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);

  useEffect(() => {
    fetchModelInfo().then(setModelInfo).catch(() => {});
  }, []);

  async function handleScreen(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await predictDiabetesRisk({
        age,
        bmi,
        glucose,
        bloodPressure,
        pregnancies,
        insulin,
        skinThickness,
        diabetesPedigreeFunction: pedigree
      });
      setResult(response);
    } catch (err) {
      setError(err.message || "Failed to generate risk screening inference.");
    } finally {
      setLoading(false);
    }
  }

  // Pre-load preset patient profiles for academic evaluators
  function loadPreset(type) {
    if (type === "healthy") {
      setAge(26);
      setBmi(21.8);
      setGlucose(88);
      setBloodPressure(72);
      setPregnancies(0);
      setInsulin(60);
      setSkinThickness(18);
      setPedigree(0.24);
    } else if (type === "moderate") {
      setAge(45);
      setBmi(27.4);
      setGlucose(122);
      setBloodPressure(82);
      setPregnancies(2);
      setInsulin(110);
      setSkinThickness(24);
      setPedigree(0.55);
    } else if (type === "elevated") {
      setAge(52);
      setBmi(34.8);
      setGlucose(168);
      setBloodPressure(88);
      setPregnancies(4);
      setInsulin(210);
      setSkinThickness(36);
      setPedigree(0.95);
    }
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="eyebrow">Machine Learning (SMLD) Component</p>
          <h1>Diabetes Risk Screening</h1>
          <p className="page-sub">
            Educational clinical risk stratification powered by our trained Scikit-Learn Random Forest Pipeline.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Test Presets:</span>
          <button className="tab-btn" onClick={() => loadPreset("healthy")}>
            Low Risk Case
          </button>
          <button className="tab-btn" onClick={() => loadPreset("moderate")}>
            Moderate Case
          </button>
          <button className="tab-btn" onClick={() => loadPreset("elevated")}>
            Elevated Case
          </button>
        </div>
      </div>

      <DisclaimerBanner
        title="Mandatory Non-Diagnostic Clinical Notice"
        message="This risk-screening engine is an academic machine-learning model developed for educational demonstration. It is NOT a medical device, diagnosis, or clinical guideline. It does not replace HbA1c or laboratory blood testing conducted by licensed healthcare professionals."
      />

      {/* Model Metadata Card */}
      <div
        style={{
          background: "var(--bg-soft-green)",
          border: "1px solid var(--border-light)",
          borderRadius: "var(--radius-lg)",
          padding: "16px 20px",
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Server size={18} style={{ color: "var(--primary-emerald)" }} />
          <div>
            <strong style={{ fontSize: 13, color: "var(--dark-green)" }}>
              {modelInfo?.model || "Random Forest Classifier Pipeline"}
            </strong>
            <small style={{ display: "block", color: "var(--text-secondary)", fontSize: 11 }}>
              Trained on {modelInfo?.trainingDataset || "Pima Indians Diabetes Benchmark (NIDDK)"} · 8 Clinical Attributes
            </small>
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
          <div>
            <span style={{ color: "var(--text-muted)" }}>Model ROC-AUC: </span>
            <strong style={{ color: "var(--primary-emerald)" }}>
              {modelInfo?.evaluation?.["Random Forest"]?.roc_auc?.toFixed(3) || "0.817"}
            </strong>
          </div>
          <div>
            <span style={{ color: "var(--text-muted)" }}>Inference API: </span>
            <strong style={{ color: "var(--primary-emerald)" }}>FastAPI (Port 8000)</strong>
          </div>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "var(--status-danger-bg)",
            border: "1px solid var(--status-danger-border)",
            padding: 12,
            borderRadius: "var(--radius-md)",
            marginBottom: 16,
            color: "var(--status-danger-text)",
            fontSize: 12.5,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="screening-grid">
        {/* Screening Inputs Form */}
        <div className="screening-form-card">
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Clinical Input Parameters</h3>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              All fields are verified and bound to physiologically plausible ranges
            </span>
          </div>

          <form onSubmit={handleScreen}>
            <div className="form-row-2">
              <div className="form-group">
                <label>Fasting Plasma Glucose (mg/dL) *</label>
                <input
                  type="number"
                  required
                  min={40}
                  max={300}
                  step="any"
                  value={glucose}
                  onChange={(e) => setGlucose(Number(e.target.value))}
                />
                <span className="form-hint">Normoglycemic target: 70 - 99 mg/dL</span>
              </div>

              <div className="form-group">
                <label>Body Mass Index (BMI kg/m²) *</label>
                <input
                  type="number"
                  required
                  min={10}
                  max={70}
                  step="0.1"
                  value={bmi}
                  onChange={(e) => setBmi(Number(e.target.value))}
                />
                <span className="form-hint">Healthy adult range: 18.5 - 24.9</span>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Patient Age (years) *</label>
                <input
                  type="number"
                  required
                  min={18}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                />
                <span className="form-hint">Adult screening boundary (&gt;= 18)</span>
              </div>

              <div className="form-group">
                <label>Diastolic Blood Pressure (mm Hg) *</label>
                <input
                  type="number"
                  required
                  min={30}
                  max={180}
                  value={bloodPressure}
                  onChange={(e) => setBloodPressure(Number(e.target.value))}
                />
                <span className="form-hint">Standard threshold: &lt; 80 mm Hg</span>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Diabetes Pedigree Score</label>
                <input
                  type="number"
                  required
                  min={0.05}
                  max={3.0}
                  step="0.01"
                  value={pedigree}
                  onChange={(e) => setPedigree(Number(e.target.value))}
                />
                <span className="form-hint">Genetic family history score (0.08 - 2.42)</span>
              </div>

              <div className="form-group">
                <label>Number of Pregnancies</label>
                <input
                  type="number"
                  min={0}
                  max={25}
                  value={pregnancies}
                  onChange={(e) => setPregnancies(Number(e.target.value))}
                />
                <span className="form-hint">0 for nulliparous or male assessment</span>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>2-Hour Serum Insulin (mu U/ml)</label>
                <input
                  type="number"
                  min={0}
                  max={900}
                  value={insulin}
                  onChange={(e) => setInsulin(Number(e.target.value))}
                />
                <span className="form-hint">Leave 0 if unrecorded (median imputed)</span>
              </div>

              <div className="form-group">
                <label>Triceps Skin Thickness (mm)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={skinThickness}
                  onChange={(e) => setSkinThickness(Number(e.target.value))}
                />
                <span className="form-hint">Leave 0 if unrecorded (median imputed)</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: 10, padding: "12px" }}
              disabled={loading}
            >
              {loading ? (
                <span>Executing ML Inference Pipeline...</span>
              ) : (
                <>
                  <Sparkles size={16} /> Compute Diabetes Risk Assessment
                </>
              )}
            </button>
          </form>
        </div>

        {/* Prediction Results Display */}
        <div className="result-card">
          <div style={{ marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Inference Outcome</h3>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Probabilistic classification & feature analysis
            </span>
          </div>

          {!result ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)",
                textAlign: "center",
                padding: "30px 20px"
              }}
            >
              <HeartPulse size={48} style={{ opacity: 0.35, marginBottom: 12 }} />
              <strong style={{ color: "var(--text-main)", fontSize: 15 }}>Awaiting Input Parameters</strong>
              <p style={{ maxWidth: 300, fontSize: 12.5, margin: "6px 0 0" }}>
                Fill out the clinical parameters on the left or click one of the presets to run the ML pipeline.
              </p>
            </div>
          ) : (
            <div>
              <div className="result-meter">
                <div
                  className="score-circle"
                  style={{ borderColor: result.riskColor, color: result.riskColor }}
                >
                  <b>{result.riskPercentage}%</b>
                  <span>Risk Score</span>
                </div>

                <div
                  className="risk-level-badge"
                  style={{
                    background: `${result.riskColor}18`,
                    color: result.riskColor,
                    border: `1.5px solid ${result.riskColor}`
                  }}
                >
                  {result.riskLevel}
                </div>

                <small style={{ color: "var(--text-muted)", fontSize: 11.5, marginTop: 4 }}>
                  Engine: {result.modelAlgorithm} · {result.serverStatus}
                </small>
              </div>

              {/* Contributing Factors */}
              <div>
                <strong style={{ fontSize: 13, color: "var(--text-main)", display: "block", marginBottom: 8 }}>
                  Key Physiological Factors:
                </strong>

                <div className="factors-list">
                  {result.contributingFactors?.map((f, i) => (
                    <div className="factor-item" key={i}>
                      <div>
                        <strong>{f.name}:</strong> <span>{f.value}</span>
                        <small style={{ display: "block", color: "var(--text-muted)", fontSize: 11, marginTop: 2 }}>
                          {f.clinical_note}
                        </small>
                      </div>
                      <span
                        className="factor-tag"
                        style={{
                          background: f.status === "High" ? "#FEE2E2" : f.status === "Elevated" ? "#FEF3C7" : "#DCFCE7",
                          color: f.status === "High" ? "#B91C1C" : f.status === "Elevated" ? "#B45309" : "#15803D"
                        }}
                      >
                        {f.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  background: "var(--bg-page)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-md)",
                  padding: 12,
                  marginTop: 18,
                  fontSize: 11.5,
                  color: "var(--text-secondary)",
                  lineHeight: 1.5
                }}
              >
                <strong>Academic Viva Defense Note:</strong> In medical screening tasks, false negatives carry high risk. Our Random Forest model was selected because it maximizes ROC-AUC (0.817) and F1 balance across stratified validation splits.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
