import React, { useMemo } from "react";
import {
  Activity,
  Calendar,
  FileText,
  Pill,
  HeartPulse,
  ClipboardList
} from "lucide-react";
import { DisclaimerBanner } from "../components/DisclaimerBanner";

export function HealthTimelinePage({ records, meds, appointments, timelineEvents }) {
  // Combine all available health events chronologically
  const unifiedEvents = useMemo(() => {
    const list = [...(timelineEvents || [])];

    // Add medical records as timeline milestones
    records.forEach((r) => {
      list.push({
        id: `rec-event-${r.id}`,
        date: r.date,
        type: "RECORD",
        title: `Medical Record: ${r.title}`,
        description: `Conducted at ${r.facility} under ${r.doctor}. Status: ${r.status}.`,
        category: "Record"
      });
    });

    // Add appointments
    appointments.forEach((a) => {
      const d = (a.dateTime || a.date || "").split("T")[0];
      list.push({
        id: `apt-event-${a.id}`,
        date: d,
        type: "APPOINTMENT",
        title: `Consultation with ${a.doctorName}`,
        description: `${a.specialty} visit scheduled at ${a.clinicLocation}. (${a.status})`,
        category: "Appointment"
      });
    });

    // Deduplicate by title+date and sort descending by date
    const unique = [];
    const seen = new Set();
    for (const item of list) {
      const key = `${item.date}_${item.title}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    }

    return unique.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  }, [records, meds, appointments, timelineEvents]);

  return (
    <div>
      <div className="page-head">
        <div>
          <p className="eyebrow">Longitudinal Care Feed</p>
          <h1>Health Timeline</h1>
          <p className="page-sub">
            Chronological aggregation of documented records, clinical consultations, and medication milestones.
          </p>
        </div>
      </div>

      <DisclaimerBanner
        compact
        message="This health timeline visualizes your documented milestones in chronological order. Only actual recorded care events are displayed."
      />

      <section className="panel">
        <div className="panel-header">
          <div>
            <h3>Chronological Health Feed</h3>
            <span>{unifiedEvents.length} documented milestones</span>
          </div>
        </div>

        {unifiedEvents.length === 0 ? (
          <p style={{ color: "var(--text-muted)", textAlign: "center", padding: 30 }}>
            No health milestones recorded yet. Add medical records or appointments to populate your timeline.
          </p>
        ) : (
          <div className="timeline-track">
            {unifiedEvents.map((evt) => {
              const isRecord = evt.category === "Record";
              const isMed = evt.category === "Medication";

              return (
                <div className="timeline-node" key={evt.id}>
                  <div className="timeline-card">
                    <div className="timeline-card-header">
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {isRecord ? (
                          <FileText size={16} style={{ color: "var(--primary-emerald)" }} />
                        ) : isMed ? (
                          <Pill size={16} style={{ color: "var(--secondary-green)" }} />
                        ) : (
                          <Calendar size={16} style={{ color: "var(--primary-emerald)" }} />
                        )}
                        <strong>{evt.title}</strong>
                      </div>
                      <small>{evt.date}</small>
                    </div>
                    <p>{evt.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
