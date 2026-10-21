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

  // ── Medical Documents Vault ──
  async getDocuments(userId = "demo_user") {
    return apiRequest(`/api/v1/documents?userId=${encodeURIComponent(userId)}`, { method: "GET" });
  },

  async getDocument(id, userId = "demo_user") {
    return apiRequest(`/api/v1/documents/${id}?userId=${encodeURIComponent(userId)}`, { method: "GET" });
  },

  async createDocument(userId = "demo_user", docData) {
    return apiRequest(`/api/v1/documents?userId=${encodeURIComponent(userId)}`, {
      method: "POST",
      body: JSON.stringify(docData),
    });
  },

  async uploadDocument(userId = "demo_user", formData) {
    return apiRequest(`/api/v1/documents/upload?userId=${encodeURIComponent(userId)}`, {
      method: "POST",
      body: formData,
    });
  },

  getDocumentDownloadUrl(id, userId = "demo_user") {
    return `${BACKEND_BASE_URL}/api/v1/documents/${id}/download?userId=${encodeURIComponent(userId)}`;
  },

  async deleteDocument(id, userId = "demo_user") {
    return apiRequest(`/api/v1/documents/${id}?userId=${encodeURIComponent(userId)}`, {
      method: "DELETE",
    });
  },

  // ── Medical Expenses Tracker ──
  async getExpenses(userId = "demo_user") {
    return apiRequest(`/api/v1/expenses?userId=${encodeURIComponent(userId)}`, { method: "GET" });
  },

  async getExpenseSummary(userId = "demo_user") {
    return apiRequest(`/api/v1/expenses/summary?userId=${encodeURIComponent(userId)}`, { method: "GET" });
  },

  async checkDuplicateInvoice(userId = "demo_user", billNumber = "") {
    return apiRequest(`/api/v1/expenses/check-duplicate?userId=${encodeURIComponent(userId)}&billNumber=${encodeURIComponent(billNumber)}`, { method: "GET" });
  },

  async createExpense(userId = "demo_user", expenseData) {
    return apiRequest(`/api/v1/expenses?userId=${encodeURIComponent(userId)}`, {
      method: "POST",
      body: JSON.stringify(expenseData),
    });
  },

  async updateExpense(id, userId = "demo_user", expenseData) {
    return apiRequest(`/api/v1/expenses/${id}?userId=${encodeURIComponent(userId)}`, {
      method: "PUT",
      body: JSON.stringify(expenseData),
    });
  },

  async deleteExpense(id, userId = "demo_user") {
    return apiRequest(`/api/v1/expenses/${id}?userId=${encodeURIComponent(userId)}`, {
      method: "DELETE",
    });
  },

  // ── Family Profiles ──
  async getFamilyMembers(userId = "demo_user") {
    return apiRequest(`/api/v1/family?userId=${encodeURIComponent(userId)}`, { method: "GET" });
  },

  async createFamilyMember(userId = "demo_user", memberData) {
    return apiRequest(`/api/v1/family?userId=${encodeURIComponent(userId)}`, {
      method: "POST",
      body: JSON.stringify(memberData),
    });
  },

  async updateFamilyMember(id, userId = "demo_user", memberData) {
    return apiRequest(`/api/v1/family/${id}?userId=${encodeURIComponent(userId)}`, {
      method: "PUT",
      body: JSON.stringify(memberData),
    });
  },

  async deleteFamilyMember(id, userId = "demo_user") {
    return apiRequest(`/api/v1/family/${id}?userId=${encodeURIComponent(userId)}`, {
      method: "DELETE",
    });
  },

  // ── Doctor Visit Summary ──
  async getDoctorVisitSummary(userId = "demo_user") {
    return apiRequest(`/api/v1/summary/doctor-visit?userId=${encodeURIComponent(userId)}`, { method: "GET" });
  },
};

