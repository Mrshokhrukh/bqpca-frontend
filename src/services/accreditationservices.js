import apiClient from './apiClient';

const ACCREDITATIONS_BASE_URL = '/accreditations';

// Helper for adding headers for FormData
const getFormDataHeaders = () => ({
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export default {
  // === Institute Profile ===
  getMyInstituteProfile() {
    return apiClient.get(`${ACCREDITATIONS_BASE_URL}/institute-profiles/my-profile/`);
  },
  getInstituteProfiles() {
    return apiClient.get(`${ACCREDITATIONS_BASE_URL}/institute-profiles/`);
  },
  getInstituteProfile(id) {
    return apiClient.get(`${ACCREDITATIONS_BASE_URL}/institute-profiles/${id}/`);
  },
  createInstituteProfile(data) {
    return apiClient.post(`${ACCREDITATIONS_BASE_URL}/institute-profiles/`, data);
  },
  updateInstituteProfile(id, data) {
    return apiClient.patch(`${ACCREDITATIONS_BASE_URL}/institute-profiles/${id}/`, data);
  },
  deleteInstituteProfile(id) {
    return apiClient.delete(`${ACCREDITATIONS_BASE_URL}/institute-profiles/${id}/`);
  },

  // === Past Accreditations (registered as 'past-accreditations') ===
  getInstitutePastAccreditations(instituteProfileId) {
    // Filtering by institute_profile should work if your ViewSet filterset_fields includes it
    return apiClient.get(`${ACCREDITATIONS_BASE_URL}/past-accreditations/?institute_profile=${instituteProfileId}`);
  },
  createInstitutePastAccreditation(data) {
    return apiClient.post(`${ACCREDITATIONS_BASE_URL}/past-accreditations/`, data);
  },

  // === Accreditation Application ===
  getAccreditationApplications(params = {}) {
    return apiClient.get(`${ACCREDITATIONS_BASE_URL}/accreditation-applications/`, { params });
  },
  createAccreditationApplication(formData) {
    return apiClient.post(`${ACCREDITATIONS_BASE_URL}/accreditation-applications/`, formData, getFormDataHeaders());
  },
  getAccreditationApplication(id) {
    return apiClient.get(`${ACCREDITATIONS_BASE_URL}/accreditation-applications/${id}/`);
  },
  updateAccreditationApplication(id, formData) {
    return apiClient.patch(`${ACCREDITATIONS_BASE_URL}/accreditation-applications/${id}/`, formData, getFormDataHeaders());
  },
  deleteAccreditationApplication(id) {
    return apiClient.delete(`${ACCREDITATIONS_BASE_URL}/accreditation-applications/${id}/`);
  },
  // submitInitialApplication action path in view is 'submit-initial-application', NOT 'submit-initial'
  submitInitialApplication(id, paymentData) {
    return apiClient.post(`${ACCREDITATIONS_BASE_URL}/accreditation-applications/${id}/submit-initial-application/`, paymentData);
  },
  // assignAssessorsToApplication action path in view could be 'assign-assessors'
  assignAssessorsToApplication(applicationId, assessorIdsPayload) {
    return apiClient.post(`${ACCREDITATIONS_BASE_URL}/accreditation-applications/${applicationId}/assign-assessors/`, assessorIdsPayload); // CHECK url_path in ViewSet
  },

  // === Application Documents & Courses ===
  getApplicationDocuments(applicationId) {
    return apiClient.get(`${ACCREDITATIONS_BASE_URL}/application-documents/?application=${applicationId}`); // Filter field is 'application'
  },
  createApplicationDocument(formData) {
    return apiClient.post(`${ACCREDITATIONS_BASE_URL}/application-documents/`, formData, getFormDataHeaders());
  },
  deleteApplicationDocument(id){
    return apiClient.delete(`${ACCREDITATIONS_BASE_URL}/application-documents/${id}/`);
  },

  // === API Calls for "New Accreditation Application Form" ===
  getActiveApplicationSchedule() {
    return apiClient.get(`${ACCREDITATIONS_BASE_URL}/masters-application-duration/active-schedule/`);
  },
  getFeeDetailsByName(feeCategoryName) {
    return apiClient.get(`${ACCREDITATIONS_BASE_URL}/masters-fee/?fee_category=${encodeURIComponent(feeCategoryName)}`);
  },
  getDocumentTypesByCategory(categoryName) {
    return apiClient.get(`${ACCREDITATIONS_BASE_URL}/document-types/?category=${encodeURIComponent(categoryName)}`); // This was correct
  },

  // === Master Data CRUD Endpoints (Corrected) ===
  getMastersFees() { return apiClient.get(`${ACCREDITATIONS_BASE_URL}/masters-fee/`); },
  createMastersFee(data) { return apiClient.post(`${ACCREDITATIONS_BASE_URL}/masters-fee/`, data); },
  getMastersFee(id) { return apiClient.get(`${ACCREDITATIONS_BASE_URL}/masters-fee/${id}/`); },
  updateMastersFee(id, data) { return apiClient.patch(`${ACCREDITATIONS_BASE_URL}/masters-fee/${id}/`, data); },
  deleteMastersFee(id) { return apiClient.delete(`${ACCREDITATIONS_BASE_URL}/masters-fee/${id}/`); },

  getMastersInstituteTypes() { return apiClient.get(`${ACCREDITATIONS_BASE_URL}/masters-institute/`); },
  createMastersInstituteType(data) { return apiClient.post(`${ACCREDITATIONS_BASE_URL}/masters-institute/`, data); },
  getMastersInstituteType(id) { return apiClient.get(`${ACCREDITATIONS_BASE_URL}/masters-institute/${id}/`); },
  updateMastersInstituteType(id, data) { return apiClient.patch(`${ACCREDITATIONS_BASE_URL}/masters-institute/${id}/`, data); },
  deleteMastersInstituteType(id) { return apiClient.delete(`${ACCREDITATIONS_BASE_URL}/masters-institute/${id}/`); },

  getMastersAppealReasons() { return apiClient.get(`${ACCREDITATIONS_BASE_URL}/masters-appeal-reason/`); },
  createMastersAppealReason(data) { return apiClient.post(`${ACCREDITATIONS_BASE_URL}/masters-appeal-reason/`, data); },

  getMastersRatingCategories() { return apiClient.get(`${ACCREDITATIONS_BASE_URL}/masters-rating-category/`); },

  getMastersApplicationDurationManagements() { return apiClient.get(`${ACCREDITATIONS_BASE_URL}/masters-application-duration/`); },

  getMastersStandards() { return apiClient.get(`${ACCREDITATIONS_BASE_URL}/masters-standard/`); },

  getMastersKeyAspects() { return apiClient.get(`${ACCREDITATIONS_BASE_URL}/masters-key-aspect/`); },

  getMastersIndicators() { return apiClient.get(`${ACCREDITATIONS_BASE_URL}/masters-indicators/`); },

  getMastersQualifications() { return apiClient.get(`${ACCREDITATIONS_BASE_URL}/masters-qualification/`); },

  getMastersEmployeeTypes() { return apiClient.get(`${ACCREDITATIONS_BASE_URL}/masters-employee-type/`); },

  getMastersStaffTypes() { return apiClient.get(`${ACCREDITATIONS_BASE_URL}/masters-staff-type/`); },

  getMastersEmployeeCategories() { return apiClient.get(`${ACCREDITATIONS_BASE_URL}/masters-employee-category/`); },

  getMastersDecisions() { return apiClient.get(`${ACCREDITATIONS_BASE_URL}/masters-decision/`); },

  getMastersESignatures() { return apiClient.get(`${ACCREDITATIONS_BASE_URL}/e-signatures/`); }, // Correct
  createMastersESignature(formData) { return apiClient.post(`${ACCREDITATIONS_BASE_URL}/e-signatures/`, formData, getFormDataHeaders()); },

  getMastersSourceOfFundings() { return apiClient.get(`${ACCREDITATIONS_BASE_URL}/sources-of-funding/`); }, // Correct

  getMastersDocumentTypes() { return apiClient.get(`${ACCREDITATIONS_BASE_URL}/document-types/`); }, // Correct

  getMastersAssessorPools() { return apiClient.get(`${ACCREDITATIONS_BASE_URL}/assessor-pools/`); }, // Correct
  createMastersAssessor(data) { return apiClient.post(`${ACCREDITATIONS_BASE_URL}/assessor-pools/`, data); },

  // === ISAR Report ===
  getIsarReportForApplication(applicationId) {
    return apiClient.get(`${ACCREDITATIONS_BASE_URL}/isar-reports/?application=${applicationId}`);
  },
  createIsarReport(formData) {
    return apiClient.post(`${ACCREDITATIONS_BASE_URL}/isar-reports/`, formData, getFormDataHeaders());
  },
  getIsarReport(id) {
    return apiClient.get(`${ACCREDITATIONS_BASE_URL}/isar-reports/${id}/`);
  },
  updateIsarReport(id, formData) {
    return apiClient.patch(`${ACCREDITATIONS_BASE_URL}/isar-reports/${id}/`, formData, getFormDataHeaders());
  },
  // submitIsarReport action path in view is 'submit-isar'
  submitIsarReport(id) {
    return apiClient.post(`${ACCREDITATIONS_BASE_URL}/isar-reports/${id}/submit-isar/`);
  },
  getIsarStandardDocuments(isarReportId) {
    return apiClient.get(`${ACCREDITATIONS_BASE_URL}/isar-standard-documents/?isar_report=${isarReportId}`);
  },
  createIsarStandardDocument(formData) {
    return apiClient.post(`${ACCREDITATIONS_BASE_URL}/isar-standard-documents/`, formData, getFormDataHeaders());
  },
  deleteIsarStandardDocument(id) {
    return apiClient.delete(`${ACCREDITATIONS_BASE_URL}/isar-standard-documents/${id}/`);
  },

  // === HEQC Process & Appeal ===
  getApplicationAssessorCOIs(applicationId) {
    return apiClient.get(`${ACCREDITATIONS_BASE_URL}/application-assessor-cois/?application=${applicationId}`);
  },
  updateApplicationAssessorCOI(id, data) {
    return apiClient.patch(`${ACCREDITATIONS_BASE_URL}/application-assessor-cois/${id}/`, data);
  },

  getApplicationSiteVisits(applicationId) {
    return apiClient.get(`${ACCREDITATIONS_BASE_URL}/application-site-visits/?application=${applicationId}`);
  },
  createApplicationSiteVisit(data) {
    return apiClient.post(`${ACCREDITATIONS_BASE_URL}/application-site-visits/`, data);
  },
  updateApplicationSiteVisit(id, data) {
    return apiClient.patch(`${ACCREDITATIONS_BASE_URL}/application-site-visits/${id}/`, data);
  },
  // confirmApplicationSiteVisit action path in view is 'confirm-visit'
  confirmApplicationSiteVisit(id, confirmationData) {
    return apiClient.post(`${ACCREDITATIONS_BASE_URL}/application-site-visits/${id}/confirm-visit/`, confirmationData);
  },

  getApplicationAppealForApplication(applicationId) {
    return apiClient.get(`${ACCREDITATIONS_BASE_URL}/application-appeals/?application=${applicationId}`);
  },
  createApplicationAppeal(formData) {
    return apiClient.post(`${ACCREDITATIONS_BASE_URL}/application-appeals/`, formData, getFormDataHeaders());
  },
  getApplicationAppeal(id) {
    return apiClient.get(`${ACCREDITATIONS_BASE_URL}/application-appeals/${id}/`);
  },
  updateApplicationAppeal(id, formData) {
    return apiClient.patch(`${ACCREDITATIONS_BASE_URL}/application-appeals/${id}/`, formData, getFormDataHeaders());
  },
  // submitApplicationAppeal action path in view might be 'submit-appeal'
  submitApplicationAppeal(id, paymentData) {
    return apiClient.post(`${ACCREDITATIONS_BASE_URL}/application-appeals/${id}/submit-appeal/`, paymentData); // CHECK url_path in ViewSet
  },
  getAppealDocuments(appealId) {
    return apiClient.get(`${ACCREDITATIONS_BASE_URL}/appeal-documents/?appeal=${appealId}`);
  },
  createAppealDocument(formData) {
    return apiClient.post(`${ACCREDITATIONS_BASE_URL}/appeal-documents/`, formData, getFormDataHeaders());
  },
  deleteAppealDocument(id) {
    return apiClient.delete(`${ACCREDITATIONS_BASE_URL}/appeal-documents/${id}/`);
  },
};