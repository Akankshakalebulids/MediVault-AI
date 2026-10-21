import React from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { FamilyProvider } from "./context/FamilyContext";
import { App } from "./App";
import "./styles.css";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <LanguageProvider>
        <AuthProvider>
          <FamilyProvider>
            <App />
          </FamilyProvider>
        </AuthProvider>
      </LanguageProvider>
    </React.StrictMode>
  );
}

