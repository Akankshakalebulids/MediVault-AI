import React, { useState } from "react";
import { TrendingUp, Activity, Heart, Scale, Info } from "lucide-react";
import { DisclaimerBanner } from "../components/DisclaimerBanner";

// Clearly labeled demo trend data with standard clinical units
const GLUCOSE_SERIES = [
  { date: "May 2026", value: 92, status: "Normal" },
  { date: "Jun 2026", value: 95, status: "Normal" },
  { date: "Jul 2026", value: 104, status: "Borderline" },
  { date: "Aug 2026", value: 98, status: "Normal" },
  { date: "Sep 2026", value: 94, status: "Normal" },
  { date: "Oct 2026", value: 91, status: "Normal" }
];

const BP_SERIES = [
  { date: "May 2026", systolic: 118, diastolic: 78 },
  { date: "Jun 2026", systolic: 122, diastolic: 80 },
  { date: "Jul 2026", systolic: 126, diastolic: 82 },
  { date: "Aug 2026", systolic: 120, diastolic: 79 },
  { date: "Sep 2026", systolic: 119, diastolic: 77 },
  { date: "Oct 2026", systolic: 118, diastolic: 76 }
];

const BMI_SERIES = [
  { date: "May 2026", value: 23.4 },
  { date: "Jun 2026", value: 23.2 },
  { date: "Jul 2026", value: 23.5 },
  { date: "Aug 2026", value: 23.1 },
  { date: "Sep 2026", value: 22.9 },
  { date: "Oct 2026", value: 22.8 }
];

export function HealthAnalyticsPage() {
  const [activeChart, setActiveChart] = useState("glucose");

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="eyebrow">Biomarker Analytics & Trends</p>
          <h1>Health Analytics & Vitals</h1>
          <p className="page-sub">
            Continuous tracking of metabolic and cardiovascular indicators with clinical reference boundaries.
          </p>
        </div>
      </div>

      <DisclaimerBanner
        compact
        message="Analytics graphs illustrate historical recorded measurements. Reference ranges are standard clinical guidelines and do not constitute an autonomous medical diagnosis."
      />

      {/* Chart Selector Cards */}
      <div className="stats-grid">
        <div
          className="stat-card"
          style={{ cursor: "pointer", borderColor: activeChart === "glucose" ? "var(--primary-emerald)" : "" }}
          onClick={() => setActiveChart("glucose")}
        >
          <div className="stat-icon-wrap">
            <Activity size={22} />
          </div>
          <div className="stat-body">
            <span className="stat-label">Fasting Blood Glucose</span>
            <strong className="stat-value">91 mg/dL</strong>
            <small className="stat-meta" style={{ color: "var(--primary-emerald)" }}>Normal range (70-99)</small>
          </div>
        </div>

        <div
          className="stat-card"
          style={{ cursor: "pointer", borderColor: activeChart === "bp" ? "var(--primary-emerald)" : "" }}
          onClick={() => setActiveChart("bp")}
        >
          <div className="stat-icon-wrap">
            <Heart size={22} />
          </div>
          <div className="stat-body">
            <span className="stat-label">Blood Pressure</span>
            <strong className="stat-value">118 / 76</strong>
            <small className="stat-meta" style={{ color: "var(--primary-emerald)" }}>Optimal mm Hg</small>
          </div>
        </div>

        <div
          className="stat-card"
          style={{ cursor: "pointer", borderColor: activeChart === "bmi" ? "var(--primary-emerald)" : "" }}
          onClick={() => setActiveChart("bmi")}
        >
          <div className="stat-icon-wrap">
            <Scale size={22} />
          </div>
          <div className="stat-body">
            <span className="stat-label">Body Mass Index (BMI)</span>
            <strong className="stat-value">22.8 kg/m²</strong>
            <small className="stat-meta" style={{ color: "var(--primary-emerald)" }}>Healthy weight</small>
          </div>
        </div>
      </div>

      {/* Interactive SVG Chart Panel */}
      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>
              {activeChart === "glucose" && "Fasting Blood Glucose Longitudinal Trend (mg/dL)"}
              {activeChart === "bp" && "Blood Pressure Trend (Systolic & Diastolic mm Hg)"}
              {activeChart === "bmi" && "Body Mass Index (BMI kg/m²) Trend"}
            </h3>
            <span>6-Month timeline with standard physiological guideline bands</span>
          </div>
          <span className="mode-badge demo">Sample Data Series</span>
        </div>

        {/* Glucose Chart */}
        {activeChart === "glucose" && (
          <div>
            <svg viewBox="0 0 650 240" style={{ width: "100%", height: "auto", overflow: "visible" }}>
              {/* Reference Band (70 - 100 mg/dL) */}
              <rect x="50" y="80" width="550" height="90" fill="#E6F7EF" opacity="0.6" rx="4" />
              <text x="55" y="98" fill="#087F5B" fontSize="10" fontWeight="600">
                Normoglycemic Target (70 - 99 mg/dL)
              </text>

              {/* Grid Lines */}
              <line x1="50" y1="40" x2="600" y2="40" stroke="#EBF4EF" strokeDasharray="4" />
              <text x="25" y="44" fill="#85968E" fontSize="10">130</text>
              <line x1="50" y1="100" x2="600" y2="100" stroke="#EBF4EF" strokeDasharray="4" />
              <text x="25" y="104" fill="#85968E" fontSize="10">100</text>
              <line x1="50" y1="170" x2="600" y2="170" stroke="#EBF4EF" strokeDasharray="4" />
              <text x="30" y="174" fill="#85968E" fontSize="10">70</text>

              {/* Data Line */}
              <polyline
                fill="none"
                stroke="#087F5B"
                strokeWidth="3"
                points="70,124 170,115 270,88 370,106 470,118 570,127"
              />

              {/* Data Points */}
              {GLUCOSE_SERIES.map((pt, i) => {
                const cx = 70 + i * 100;
                // mapping 70 -> 170y, 130 -> 40y
                const cy = 170 - ((pt.value - 70) / 60) * 130;
                return (
                  <g key={pt.date}>
                    <circle cx={cx} cy={cy} r="6" fill="#FFFFFF" stroke="#087F5B" strokeWidth="3" />
                    <text x={cx} y={cy - 12} fill="#16352B" fontSize="11" fontWeight="700" textAnchor="middle">
                      {pt.value}
                    </text>
                    <text x={cx} y="220" fill="#64756D" fontSize="11" textAnchor="middle">
                      {pt.date}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div style={{ display: "flex", gap: 16, marginTop: 24, fontSize: 12, color: "var(--text-secondary)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 12, background: "var(--primary-emerald)", borderRadius: 3 }} />
                <span>Recorded Fasting Glucose (mg/dL)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 12, background: "var(--bg-soft-green)", borderRadius: 3 }} />
                <span>Standard Clinical Target (70-99 mg/dL)</span>
              </div>
            </div>
          </div>
        )}

        {/* Blood Pressure Chart */}
        {activeChart === "bp" && (
          <div>
            <svg viewBox="0 0 650 240" style={{ width: "100%", height: "auto", overflow: "visible" }}>
              {/* Grid Lines */}
              <line x1="50" y1="40" x2="600" y2="40" stroke="#EBF4EF" strokeDasharray="4" />
              <text x="25" y="44" fill="#85968E" fontSize="10">140</text>
              <line x1="50" y1="110" x2="600" y2="110" stroke="#EBF4EF" strokeDasharray="4" />
              <text x="25" y="114" fill="#85968E" fontSize="10">100</text>
              <line x1="50" y1="180" x2="600" y2="180" stroke="#EBF4EF" strokeDasharray="4" />
              <text x="30" y="184" fill="#85968E" fontSize="10">60</text>

              {/* Systolic Line */}
              <polyline
                fill="none"
                stroke="#087F5B"
                strokeWidth="2.5"
                points="70,78 170,71 270,64 370,75 470,76 570,78"
              />

              {/* Diastolic Line */}
              <polyline
                fill="none"
                stroke="#20A879"
                strokeWidth="2.5"
                strokeDasharray="5"
                points="70,148 170,145 270,141 370,146 470,150 570,152"
              />

              {BP_SERIES.map((pt, i) => {
                const cx = 70 + i * 100;
                return (
                  <g key={pt.date}>
                    <circle cx={cx} cy={78 - (pt.systolic - 118) * 1.75} r="5" fill="#FFFFFF" stroke="#087F5B" strokeWidth="2.5" />
                    <text x={cx} y={64} fill="#16352B" fontSize="10" fontWeight="700" textAnchor="middle">
                      {pt.systolic}
                    </text>
                    <circle cx={cx} cy={148 - (pt.diastolic - 78) * 1.75} r="5" fill="#FFFFFF" stroke="#20A879" strokeWidth="2.5" />
                    <text x={cx} y={170} fill="#64756D" fontSize="10" textAnchor="middle">
                      {pt.diastolic}
                    </text>
                    <text x={cx} y="220" fill="#64756D" fontSize="11" textAnchor="middle">
                      {pt.date}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div style={{ display: "flex", gap: 16, marginTop: 24, fontSize: 12, color: "var(--text-secondary)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 14, height: 3, background: "var(--primary-emerald)", display: "inline-block" }} />
                <span>Systolic Blood Pressure (Normal &lt; 120 mm Hg)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 14, height: 3, background: "var(--secondary-green)", display: "inline-block" }} />
                <span>Diastolic Blood Pressure (Normal &lt; 80 mm Hg)</span>
              </div>
            </div>
          </div>
        )}

        {/* BMI Chart */}
        {activeChart === "bmi" && (
          <div>
            <svg viewBox="0 0 650 240" style={{ width: "100%", height: "auto", overflow: "visible" }}>
              <rect x="50" y="70" width="550" height="110" fill="#E6F7EF" opacity="0.6" rx="4" />
              <text x="55" y="88" fill="#087F5B" fontSize="10" fontWeight="600">
                Healthy BMI Target Range (18.5 - 24.9 kg/m²)
              </text>

              <polyline
                fill="none"
                stroke="#087F5B"
                strokeWidth="3"
                points="70,118 170,126 270,114 370,130 470,138 570,142"
              />

              {BMI_SERIES.map((pt, i) => {
                const cx = 70 + i * 100;
                const cy = 130 - (pt.value - 23.0) * 35;
                return (
                  <g key={pt.date}>
                    <circle cx={cx} cy={cy} r="6" fill="#FFFFFF" stroke="#087F5B" strokeWidth="3" />
                    <text x={cx} y={cy - 12} fill="#16352B" fontSize="11" fontWeight="700" textAnchor="middle">
                      {pt.value}
                    </text>
                    <text x={cx} y="220" fill="#64756D" fontSize="11" textAnchor="middle">
                      {pt.date}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div style={{ display: "flex", gap: 16, marginTop: 24, fontSize: 12, color: "var(--text-secondary)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 12, background: "var(--primary-emerald)", borderRadius: 3 }} />
                <span>BMI Trend (kg/m²)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 12, height: 12, background: "var(--bg-soft-green)", borderRadius: 3 }} />
                <span>Healthy WHO Target (18.5 - 24.9 kg/m²)</span>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
