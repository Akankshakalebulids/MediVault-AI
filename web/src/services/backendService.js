import { apiRequest } from "./apiClient.js";

/**
 * Service for communicating with the MediVault Kotlin Spring Boot Backend
 */
export const backendService = {
  // ── Health Check ──
  async checkHealth() {
    try {
      const data = await apiRequest("/api/v1/health", { method: "GET" }, 3000);
      return { ok: true, data };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  },

  // ── Medical Records ──
  async getRecords(userId = "demo_user", category = null) {
    const url = `/api/v1/records?userId=${encodeURIComponent(userId)}${category ? `&category=${encodeURIComponent(category)}` : ""}`;
    return apiRequest(url, { method: "GET" });
  },

  async getRecord(id, userId = "demo_user") {
    return apiRequest(`/api/v1/records/${id}?userId=${encodeURIComponent(userId)}`, { method: "GET" });
  },

  async createRecord(userId = "demo_user", recordData) {
    return apiRequest(`/api/v1/records?userId=${encodeURIComponent(userId)}`, {
      method: "POST",
      body: JSON.stringify(recordData),
    });
  },

  async updateRecord(id, userId = "demo_user", recordData) {
    return apiRequest(`/api/v1/records/${id}?userId=${encodeURIComponent(userId)}`, {
      method: "PUT",
      body: JSON.stringify(recordData),
    });
  },

  async deleteRecord(id, userId = "demo_user") {
    return apiRequest(`/api/v1/records/${id}?userId=${encodeURIComponent(userId)}`, {
      method: "DELETE",
    });
  },

  // ── Medications ──
  async getMedications(userId = "demo_user") {
    return apiRequest(`/api/v1/medications?userId=${encodeURIComponent(userId)}`, { method: "GET" });
  },

  async createMedication(userId = "demo_user", medicationData) {
    return apiRequest(`/api/v1/medications?userId=${encodeURIComponent(userId)}`, {
      method: "POST",
      body: JSON.stringify(medicationData),
    });
  },

  async updateMedication(id, userId = "demo_user", medicationData) {
    return apiRequest(`/api/v1/medications/${id}?userId=${encodeURIComponent(userId)}`, {
      method: "PUT",
      body: JSON.stringify(medicationData),
    });
  },

  async deleteMedication(id, userId = "demo_user") {
    return apiRequest(`/api/v1/medications/${id}?userId=${encodeURIComponent(userId)}`, {
      method: "DELETE",
    });
  },

  // ── Appointments ──
  async getAppointments(userId = "demo_user") {
    return apiRequest(`/api/v1/appointments?userId=${encodeURIComponent(userId)}`, { method: "GET" });
  },

  async createAppointment(userId = "demo_user", appointmentData) {
    return apiRequest(`/api/v1/appointments?userId=${encodeURIComponent(userId)}`, {
      method: "POST",
      body: JSON.stringify(appointmentData),
    });
  },

  async updateAppointment(id, userId = "demo_user", appointmentData) {
    return apiRequest(`/api/v1/appointments/${id}?userId=${encodeURIComponent(userId)}`, {
      method: "PUT",
      body: JSON.stringify(appointmentData),
    });
  },

  async deleteAppointment(id, userId = "demo_user") {
    return apiRequest(`/api/v1/appointments/${id}?userId=${encodeURIComponent(userId)}`, {
      method: "DELETE",
    });
  },

  // ── Health Timeline ──
  async getTimeline(userId = "demo_user") {
    return apiRequest(`/api/v1/timeline?userId=${encodeURIComponent(userId)}`, { method: "GET" });
  },

  // ── User Profile ──
  async getProfile(userId = "demo_user") {
    return apiRequest(`/api/v1/profile?userId=${encodeURIComponent(userId)}`, { method: "GET" });
  },

  async updateProfile(userId = "demo_user", profileData) {
    return apiRequest(`/api/v1/profile?userId=${encodeURIComponent(userId)}`, {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },
};
