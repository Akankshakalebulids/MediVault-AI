import React from "react";
import { AlertCircle, ShieldAlert } from "lucide-react";

export function DisclaimerBanner({ title, message, compact = false }) {
  return (
    <div className="disclaimer-banner" role="alert">
      <AlertCircle size={ compact ? 18 : 22 } />
      <div>
        <strong>{title || "Non-Diagnostic Educational Prototype Notice"}</strong>
        <p>
          {message ||
            "MediVault AI is designed as an educational digital health management and machine-learning risk screening project. It does not replace clinical judgment, provide medical diagnoses, or prescribe treatments. Always consult a qualified physician or certified endocrinologist for clinical health decisions."}
        </p>
      </div>
    </div>
  );
}
