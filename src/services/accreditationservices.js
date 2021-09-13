import apiClient from './apiClient';

export default {
  // Institute Profiles endpoints
  getInstituteProfiles() {
    return apiClient.get('/accreditations/institute-profiles/');
  },
  getMyInstituteProfile() {
    return apiClient.get('/accreditations/institute-profiles/my-profile/');
  },
  getInstituteProfile(id) {
    return apiClient.get(`/accreditations/institute-profiles/${id}/`);
  },
  createInstituteProfile(data) {
    return apiClient.post('/accreditations/institute-profiles/', data);
  },
  updateInstituteProfile(id, data) {
    return apiClient.put(`/accreditations/institute-profiles/${id}/`, data);
  },
  patchInstituteProfile(id, data) {
    return apiClient.patch(`/accreditations/institute-profiles/${id}/`, data);
  },
  deleteInstituteProfile(id) {
    return apiClient.delete(`/accreditations/institute-profiles/${id}/`);
  },

  // Past Accreditations endpoints
  getPastAccreditations(instituteProfileId) {
    return apiClient.get(`/accreditations/past-accreditations/?institute_profile=${instituteProfileId}`);
  },
  createPastAccreditation(data) {
    return apiClient.post('/accreditations/past-accreditations/', data);
  },
  getPastAccreditation(id) {
    return apiClient.get(`/accreditations/past-accreditations/${id}/`);
  },
  updatePastAccreditation(id, data) {
    return apiClient.put(`/accreditations/past-accreditations/${id}/`, data);
  },
  patchPastAccreditation(id, data) {
    return apiClient.patch(`/accreditations/past-accreditations/${id}/`, data);
  },
  deletePastAccreditation(id) {
    return apiClient.delete(`/accreditations/past-accreditations/${id}/`);
  },

  // Accreditation Applications endpoints
  getAccreditationApplications(params = {}) {
    return apiClient.get('/accreditations/accreditation-applications/', { params });
  },
  createAccreditationApplication(data) {
    return apiClient.post('/accreditations/accreditation-applications/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getAccreditationApplication(id) {
    return apiClient.get(`/accreditations/accreditation-applications/${id}/`);
  },
  updateAccreditationApplication(id, data) {
    return apiClient.put(`/accreditations/accreditation-applications/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  patchAccreditationApplication(id, data) {
    return apiClient.patch(`/accreditations/accreditation-applications/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  makeFinalDecision(applicationId, decisionData) {
    return apiClient.post(`/accreditations/accreditation-applications/${applicationId}/make-final-decision/`, decisionData);
  },
  updateApplicationStatusDecision(applicationId, data) {
    return apiClient.patch(`/accreditations/accreditation-applications/${applicationId}/`, data);
  },
  deleteAccreditationApplication(id) {
    return apiClient.delete(`/accreditations/accreditation-applications/${id}/`);
  },
  submitInitialApplication(id, paymentData) {
    return apiClient.post(`/accreditations/accreditation-applications/${id}/submit-initial-application/`, paymentData);
  },
  assignAssessorsToApplication(applicationId, assessorIdsPayload) {
    return apiClient.post(`/accreditations/accreditation-applications/${applicationId}/assign-assessors/`, assessorIdsPayload);
  },
  createApplicationSnapshot(applicationId) {
    return apiClient.post(`/accreditations/accreditation-applications/${applicationId}/snapshot/`);
  },
  getApplicationSnapshot(applicationId) {
    return apiClient.get(`/accreditations/accreditation-applications/${applicationId}/snapshot/`);
  },
  generateAccreditationCertificate(applicationId) {
    return apiClient.get(`/accreditations/accreditation-applications/${applicationId}/certificate/`);
  },
  uploadAssessorReport(data) {
    return apiClient.post('/accreditations/assessor-reports/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // Application Documents endpoints
  getApplicationDocuments(applicationId) {
    return apiClient.get(`/accreditations/application-documents/?application=${applicationId}`);
  },
  createApplicationDocument(data) {
    return apiClient.post('/accreditations/application-documents/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getApplicationDocument(id) {
    return apiClient.get(`/accreditations/application-documents/${id}/`);
  },
  updateApplicationDocument(id, data) {
    return apiClient.put(`/accreditations/application-documents/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  patchApplicationDocument(id, data) {
    return apiClient.patch(`/accreditations/application-documents/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteApplicationDocument(id) {
    return apiClient.delete(`/accreditations/application-documents/${id}/`);
  },
  approveApplicationForIsar(applicationId) {
    return apiClient.post(`/accreditations/accreditation-applications/${applicationId}/approve-for-isar/`);
  },

  // ISAR Reports endpoints
  getIsarReports(params = {}) {
    return apiClient.get('/accreditations/isar-reports/', { params });
  },
  createIsarReport(data) {
    return apiClient.post('/accreditations/isar-reports/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getIsarReport(id) {
    return apiClient.get(`/accreditations/isar-reports/${id}/`);
  },
  updateIsarReport(id, data) {
    return apiClient.put(`/accreditations/isar-reports/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  patchIsarReport(id, data) {
    return apiClient.patch(`/accreditations/isar-reports/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteIsarReport(id) {
    return apiClient.delete(`/accreditations/isar-reports/${id}/`);
  },
  submitIsarReport(id) {
    return apiClient.post(`/accreditations/isar-reports/${id}/submit-isar/`);
  },

  // ISAR Standard Documents endpoints
  getIsarStandardDocuments(isarReportId) {
    return apiClient.get(`/accreditations/isar-standard-documents/?isar_report=${isarReportId}`);
  },
  createIsarStandardDocument(data) {
    return apiClient.post('/accreditations/isar-standard-documents/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getIsarStandardDocument(id) {
    return apiClient.get(`/accreditations/isar-standard-documents/${id}/`);
  },
  updateIsarStandardDocument(id, data) {
    return apiClient.put(`/accreditations/isar-standard-documents/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  patchIsarStandardDocument(id, data) {
    return apiClient.patch(`/accreditations/isar-standard-documents/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteIsarStandardDocument(id) {
    return apiClient.delete(`/accreditations/isar-standard-documents/${id}/`);
  },

  // Application Assessor COIs endpoints
  getApplicationAssessorCOIs() {
    return apiClient.get(`/accreditations/application-assessor-cois/`);
  },
  createApplicationAssessorCOI(data) {
    return apiClient.post('/accreditations/application-assessor-cois/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getApplicationAssessorCOI_BYid(id) {
    return apiClient.get(`/accreditations/application-assessor-cois/${id}/`);
  },
  deleteApplicationAssessorCOI(id) {
    return apiClient.delete(`/accreditations/application-assessor-cois/${id}/`);
  },
  declareAssessorCOI(coiId, data) {
    return apiClient.post(`/accreditations/application-assessor-cois/${coiId}/assessor-declaration/`, data);
  },
  respondToCOI(coiId, formData) {
    return apiClient.post(`/accreditations/application-assessor-cois/${coiId}/respond/`, formData);
  },

  // Application Site Visits endpoints
  getApplicationSiteVisits(applicationId) {
    return apiClient.get(`/accreditations/application-site-visits/?application=${applicationId}`);
  },
  createApplicationSiteVisit(data) {
    return apiClient.post('/accreditations/application-site-visits/', data);
  },
  getApplicationSiteVisit(id) {
    return apiClient.get(`/accreditations/application-site-visits/${id}/`);
  },
  updateApplicationSiteVisit(id, data) {
    return apiClient.put(`/accreditations/application-site-visits/${id}/`, data);
  },
  patchApplicationSiteVisit(id, data) {
    return apiClient.patch(`/accreditations/application-site-visits/${id}/`, data);
  },
  deleteApplicationSiteVisit(id) {
    return apiClient.delete(`/accreditations/application-site-visits/${id}/`);
  },
  confirmApplicationSiteVisit(id, confirmationData) {
    return apiClient.post(`/accreditations/application-site-visits/${id}/confirm-visit/`, confirmationData);
  },

  // Application Appeals endpoints
  getAccreditationAppeals(params = {}) {
    return apiClient.get('/accreditations/application-appeals/', { params });
  },
  createApplicationAppeal(data) {
    return apiClient.post('/accreditations/application-appeals/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getApplicationAppeal(id) {
    return apiClient.get(`/accreditations/application-appeals/${id}/`);
  },
  updateApplicationAppeal(id, data) {
    return apiClient.put(`/accreditations/application-appeals/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  patchApplicationAppeal(id, data) {
    return apiClient.patch(`/accreditations/application-appeals/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteApplicationAppeal(id) {
    return apiClient.delete(`/accreditations/application-appeals/${id}/`);
  },
  submitApplicationAppeal(id, paymentData) {
    return apiClient.post(`/accreditations/application-appeals/${id}/submit-appeal/`, paymentData);
  },

  // Appeal Documents endpoints
  getAppealDocuments(appealId) {
    return apiClient.get(`/accreditations/appeal-documents/?appeal=${appealId}`);
  },
  createAppealDocument(data) {
    return apiClient.post('/accreditations/appeal-documents/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getAppealDocument(id) {
    return apiClient.get(`/accreditations/appeal-documents/${id}/`);
  },
  updateAppealDocument(id, data) {
    return apiClient.put(`/accreditations/appeal-documents/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  patchAppealDocument(id, data) {
    return apiClient.patch(`/accreditations/appeal-documents/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteAppealDocument(id) {
    return apiClient.delete(`/accreditations/appeal-documents/${id}/`);
  },

  // Notifications endpoints
  sendNotification(userId, data) {
    return apiClient.post('/accreditations/notifications/', { user_id: userId, ...data });
  },
  // getNotifications(userId) {
  //   return apiClient.get(`/accreditations/notifications/?user_id=${userId}`);
  // },

  // Payment Status endpoints
  updatePaymentStatus(applicationId, paymentData) {
    return apiClient.post(`/accreditations/payments/${applicationId}/status/`, paymentData);
  },
  getPaymentStatus(applicationId) {
    return apiClient.get(`/accreditations/payments/${applicationId}/status/`);
  },

  // Reports endpoints
  getApplicationReport(filters = {}) {
    return apiClient.get('/accreditations/reports/applications/', { params: filters });
  },
  getAppealReport(filters = {}) {
    return apiClient.get('/accreditations/reports/appeals/', { params: filters });
  },

  // +++ START: POST-ACCREDITATION REPORT ENDPOINTS +++

  /**
   * Fetches the list of compliance reports. Can be filtered, e.g., by application ID.
   * @param {object} params - The query parameters, e.g., { application: 15 }
   * @returns {Promise} A promise that resolves with the list of reports.
   */
  getPostAccreditationReports(params = {}) {
    return apiClient.get('/accreditations/post-accreditation-reports/', { params });
  },

  /**
   * Creates a new post-accreditation report.
   * NOTE: This is generally NOT called directly from the frontend in your workflow.
   * The backend's save() hook on the application model handles creation.
   * But it's good practice to have it defined.
   * @param {object} reportData The JSON payload for the new report.
   * @returns {Promise} A promise that resolves with the newly created report data.
   */
  createPostAccreditationReport(reportData) {
    return apiClient.post('/accreditations/post-accreditation-reports/', reportData);
  },

  /**
   * Fetches the detailed data for a single compliance report.
   * @param {string|number} reportId The ID of the PostAccreditationReport.
   * @returns {Promise} A promise that resolves with the report's detailed data.
   */
  getPostAccreditationReportDetails(reportId) {
    return apiClient.get(`/accreditations/post-accreditation-reports/${reportId}/`);
  },

  /**
   * Updates a compliance report with a full data payload using PUT.
   * @param {string|number} reportId The ID of the report to update.
   * @param {object} reportData The full JSON payload for the report.
   * @returns {Promise} A promise that resolves with the updated report data.
   */
  updatePostAccreditationReport(reportId, reportData) {
    return apiClient.put(`/accreditations/post-accreditation-reports/${reportId}/`, reportData);
  },

  /**

   * @param {string|number} reportId The ID of the report to update.
   * @param {object} reportData The JSON payload containing fields to update.
   * @returns {Promise} A promise that resolves with the updated report data.
   */
  patchPostAccreditationReport(reportId, reportData) {
    return apiClient.patch(`/accreditations/post-accreditation-reports/${reportId}/`, reportData);
  },

  /**
   * Deletes a specific post-accreditation report.
   * @param {string|number} reportId The ID of the report to delete.
   * @returns {Promise} A promise that resolves on successful deletion.
   */
  deletePostAccreditationReport(reportId) {
    return apiClient.delete(`/accreditations/post-accreditation-reports/${reportId}/`);
  },

  /**

   */
  submitPostAccreditationReport(reportId, reportData) {
    return this.patchPostAccreditationReport(reportId, reportData);
  },

  // Masters Fees endpoints
  getMastersFees() {
    return apiClient.get('/accreditations/masters-fee/');
  },
  createMastersFee(data) {
    return apiClient.post('/accreditations/masters-fee/', data);
  },
  getMastersFee(id) {
    return apiClient.get(`/accreditations/masters-fee/${id}/`);
  },
  updateMastersFee(id, data) {
    return apiClient.put(`/accreditations/masters-fee/${id}/`, data);
  },
  patchMastersFee(id, data) {
    return apiClient.patch(`/accreditations/masters-fee/${id}/`, data);
  },
  deleteMastersFee(id) {
    return apiClient.delete(`/accreditations/masters-fee/${id}/`);
  },
  getFeeDetailsByName(feeCategoryName) {
    return apiClient.get(`/accreditations/masters-fee/?fee_category=${encodeURIComponent(feeCategoryName)}`);
  },

  // Masters Institute Types endpoints
  getMastersInstituteTypes() {
    return apiClient.get('/accreditations/institute-types/');
  },
  createMastersInstituteType(data) {
    return apiClient.post('/accreditations/institute-types/', data);
  },
  getMastersInstituteType(id) {
    return apiClient.get(`/accreditations/institute-types/${id}/`);
  },
  updateMastersInstituteType(id, data) {
    return apiClient.put(`/accreditations/institute-types/${id}/`, data);
  },
  patchMastersInstituteType(id, data) {
    return apiClient.patch(`/accreditations/institute-types/${id}/`, data);
  },
  deleteMastersInstituteType(id) {
    return apiClient.delete(`/accreditations/institute-types/${id}/`);
  },

  // Masters Appeal Reasons endpoints
  getMastersAppealReasons() {
    return apiClient.get('/accreditations/masters-appeal-reason/');
  },
  createMastersAppealReason(data) {
    return apiClient.post('/accreditations/masters-appeal-reason/', data);
  },
  getMastersAppealReason(id) {
    return apiClient.get(`/accreditations/masters-appeal-reason/${id}/`);
  },
  updateMastersAppealReason(id, data) {
    return apiClient.put(`/accreditations/masters-appeal-reason/${id}/`, data);
  },
  patchMastersAppealReason(id, data) {
    return apiClient.patch(`/accreditations/masters-appeal-reason/${id}/`, data);
  },
  deleteMastersAppealReason(id) {
    return apiClient.delete(`/accreditations/masters-appeal-reason/${id}/`);
  },

  // Masters Rating Categories endpoints
  getMastersRatingCategories() {
    return apiClient.get('/accreditations/masters-rating-category/');
  },
  createMastersRatingCategory(data) {
    return apiClient.post('/accreditations/masters-rating-category/', data);
  },
  getMastersRatingCategory(id) {
    return apiClient.get(`/accreditations/masters-rating-category/${id}/`);
  },
  updateMastersRatingCategory(id, data) {
    return apiClient.put(`/accreditations/masters-rating-category/${id}/`, data);
  },
  patchMastersRatingCategory(id, data) {
    return apiClient.patch(`/accreditations/masters-rating-category/${id}/`, data);
  },
  deleteMastersRatingCategory(id) {
    return apiClient.delete(`/accreditations/masters-rating-category/${id}/`);
  },

  // Masters Application Durations endpoints
  getMastersApplicationDurations() {
    return apiClient.get('/accreditations/masters-application-duration/');
  },
  createMastersApplicationDuration(data) {
    return apiClient.post('/accreditations/masters-application-duration/', data);
  },
  getMastersApplicationDuration(id) {
    return apiClient.get(`/accreditations/masters-application-duration/${id}/`);
  },
  updateMastersApplicationDuration(id, data) {
    return apiClient.put(`/accreditations/masters-application-duration/${id}/`, data);
  },
  patchMastersApplicationDuration(id, data) {
    return apiClient.patch(`/accreditations/masters-application-duration/${id}/`, data);
  },
  deleteMastersApplicationDuration(id) {
    return apiClient.delete(`/accreditations/masters-application-duration/${id}/`);
  },
  getActiveApplicationSchedule() {
    return apiClient.get('/accreditations/masters-application-duration/active-schedule/');
  },

  // Masters Standards endpoints
  getMastersStandards() {
    return apiClient.get('/accreditations/masters-standard/');
  },
  createMastersStandard(data) {
    return apiClient.post('/accreditations/masters-standard/', data);
  },
  getMastersStandard(id) {
    return apiClient.get(`/accreditations/masters-standard/${id}/`);
  },
  updateMastersStandard(id, data) {
    return apiClient.put(`/accreditations/masters-standard/${id}/`, data);
  },
  patchMastersStandard(id, data) {
    return apiClient.patch(`/accreditations/masters-standard/${id}/`, data);
  },
  deleteMastersStandard(id) {
    return apiClient.delete(`/accreditations/masters-standard/${id}/`);
  },

  // Masters Key Aspects endpoints
  getMastersKeyAspects() {
    return apiClient.get('/accreditations/masters-key-aspect/');
  },
  createMastersKeyAspect(data) {
    return apiClient.post('/accreditations/masters-key-aspect/', data);
  },
  getMastersKeyAspect(id) {
    return apiClient.get(`/accreditations/masters-key-aspect/${id}/`);
  },
  updateMastersKeyAspect(id, data) {
    return apiClient.put(`/accreditations/masters-key-aspect/${id}/`, data);
  },
  patchMastersKeyAspect(id, data) {
    return apiClient.patch(`/accreditations/masters-key-aspect/${id}/`, data);
  },
  deleteMastersKeyAspect(id) {
    return apiClient.delete(`/accreditations/masters-key-aspect/${id}/`);
  },

  // Masters Indicators endpoints
  getMastersIndicators() {
    return apiClient.get('/accreditations/masters-indicators/');
  },
  createMastersIndicator(data) {
    return apiClient.post('/accreditations/masters-indicators/', data);
  },
  getMastersIndicator(id) {
    return apiClient.get(`/accreditations/masters-indicators/${id}/`);
  },
  updateMastersIndicator(id, data) {
    return apiClient.put(`/accreditations/masters-indicators/${id}/`, data);
  },
  patchMastersIndicator(id, data) {
    return apiClient.patch(`/accreditations/masters-indicators/${id}/`, data);
  },
  deleteMastersIndicator(id) {
    return apiClient.delete(`/accreditations/masters-indicators/${id}/`);
  },

  // Masters Qualifications endpoints
  getMastersQualifications() {
    return apiClient.get('/accreditations/masters-qualification/');
  },
  createMastersQualification(data) {
    return apiClient.post('/accreditations/masters-qualification/', data);
  },
  getMastersQualification(id) {
    return apiClient.get(`/accreditations/masters-qualification/${id}/`);
  },
  updateMastersQualification(id, data) {
    return apiClient.put(`/accreditations/masters-qualification/${id}/`, data);
  },
  patchMastersQualification(id, data) {
    return apiClient.patch(`/accreditations/masters-qualification/${id}/`, data);
  },
  deleteMastersQualification(id) {
    return apiClient.delete(`/accreditations/masters-qualification/${id}/`);
  },

  // Masters Employee Types endpoints
  getMastersEmployeeTypes() {
    return apiClient.get('/accreditations/masters-employee-type/');
  },
  createMastersEmployeeType(data) {
    return apiClient.post('/accreditations/masters-employee-type/', data);
  },
  getMastersEmployeeType(id) {
    return apiClient.get(`/accreditations/masters-employee-type/${id}/`);
  },
  updateMastersEmployeeType(id, data) {
    return apiClient.put(`/accreditations/masters-employee-type/${id}/`, data);
  },
  patchMastersEmployeeType(id, data) {
    return apiClient.patch(`/accreditations/masters-employee-type/${id}/`, data);
  },
  deleteMastersEmployeeType(id) {
    return apiClient.delete(`/accreditations/masters-employee-type/${id}/`);
  },

  // Masters Staff Types endpoints
  getMastersStaffTypes() {
    return apiClient.get('/accreditations/masters-staff-type/');
  },
  createMastersStaffType(data) {
    return apiClient.post('/accreditations/masters-staff-type/', data);
  },
  getMastersStaffType(id) {
    return apiClient.get(`/accreditations/masters-staff-type/${id}/`);
  },
  updateMastersStaffType(id, data) {
    return apiClient.put(`/accreditations/masters-staff-type/${id}/`, data);
  },
  patchMastersStaffType(id, data) {
    return apiClient.patch(`/accreditations/masters-staff-type/${id}/`, data);
  },
  deleteMastersStaffType(id) {
    return apiClient.delete(`/accreditations/masters-staff-type/${id}/`);
  },

  // Masters Employee Categories endpoints
  getMastersEmployeeCategories() {
    return apiClient.get('/accreditations/masters-employee-category/');
  },
  createMastersEmployeeCategory(data) {
    return apiClient.post('/accreditations/masters-employee-category/', data);
  },
  getMastersEmployeeCategory(id) {
    return apiClient.get(`/accreditations/masters-employee-category/${id}/`);
  },
  updateMastersEmployeeCategory(id, data) {
    return apiClient.put(`/accreditations/masters-employee-category/${id}/`, data);
  },
  patchMastersEmployeeCategory(id, data) {
    return apiClient.patch(`/accreditations/masters-employee-category/${id}/`, data);
  },
  deleteMastersEmployeeCategory(id) {
    return apiClient.delete(`/accreditations/masters-employee-category/${id}/`);
  },

  // Masters Decisions endpoints
  getMastersDecisions() {
    return apiClient.get('/accreditations/masters-decision/');
  },
  createMastersDecision(data) {
    return apiClient.post('/accreditations/masters-decision/', data);
  },
  getMastersDecision(id) {
    return apiClient.get(`/accreditations/masters-decision/${id}/`);
  },
  updateMastersDecision(id, data) {
    return apiClient.put(`/accreditations/masters-decision/${id}/`, data);
  },
  patchMastersDecision(id, data) {
    return apiClient.patch(`/accreditations/masters-decision/${id}/`, data);
  },
  deleteMastersDecision(id) {
    return apiClient.delete(`/accreditations/masters-decision/${id}/`);
  },

  // Masters E-Signatures endpoints
  getMastersESignatures() {
    return apiClient.get('/accreditations/e-signatures/');
  },
  createMastersESignature(data) {
    return apiClient.post('/accreditations/e-signatures/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getMastersESignature(id) {
    return apiClient.get(`/accreditations/e-signatures/${id}/`);
  },
  updateMastersESignature(id, data) {
    return apiClient.put(`/accreditations/e-signatures/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  patchMastersESignature(id, data) {
    return apiClient.patch(`/accreditations/e-signatures/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteMastersESignature(id) {
    return apiClient.delete(`/accreditations/e-signatures/${id}/`);
  },

  // Masters Source of Fundings endpoints
  getMastersSourceOfFundings() {
    return apiClient.get('/accreditations/sources-of-funding/');
  },
  createMastersSourceOfFunding(data) {
    return apiClient.post('/accreditations/sources-of-funding/', data);
  },
  getMastersSourceOfFunding(id) {
    return apiClient.get(`/accreditations/sources-of-funding/${id}/`);
  },
  updateMastersSourceOfFunding(id, data) {
    return apiClient.put(`/accreditations/sources-of-funding/${id}/`, data);
  },
  patchMastersSourceOfFunding(id, data) {
    return apiClient.patch(`/accreditations/sources-of-funding/${id}/`, data);
  },
  deleteMastersSourceOfFunding(id) {
    return apiClient.delete(`/accreditations/sources-of-funding/${id}/`);
  },

  // Masters Document Types endpoints
  getMastersDocumentTypes() {
    return apiClient.get('/accreditations/document-types/');
  },
  createMastersDocumentType(data) {
    return apiClient.post('/accreditations/document-types/', data);
  },
  getMastersDocumentType(id) {
    return apiClient.get(`/accreditations/document-types/${id}/`);
  },
  updateMastersDocumentType(id, data) {
    return apiClient.put(`/accreditations/document-types/${id}/`, data);
  },
  patchMastersDocumentType(id, data) {
    return apiClient.patch(`/accreditations/document-types/${id}/`, data);
  },
  deleteMastersDocumentType(id) {
    return apiClient.delete(`/accreditations/document-types/${id}/`);
  },
  getDocumentTypesByCategory(categoryName) {
    return apiClient.get(`/accreditations/document-types/?category=${encodeURIComponent(categoryName)}`);
  },

  // Masters Assessor Pools endpoints
  getMastersAssessorPools() {
    return apiClient.get('/accreditations/assessor-pools/');
  },
  createMastersAssessor(data) {
    return apiClient.post('/accreditations/assessor-pools/', data);
  },
  getMastersAssessor(id) {
    return apiClient.get(`/accreditations/assessor-pools/${id}/`);
  },
  updateMastersAssessor(id, data) {
    return apiClient.put(`/accreditations/assessor-pools/${id}/`, data);
  },
  patchMastersAssessor(id, data) {
    return apiClient.patch(`/accreditations/assessor-pools/${id}/`, data);
  },
  deleteMastersAssessor(id) {
    return apiClient.delete(`/accreditations/assessor-pools/${id}/`);
  },
  checkAssessorDeletable(id) {
    return apiClient.get(`/accreditations/assessor-pools/${id}/check-deletable/`);
  },

  // Helper method for fetching master data
  getMasterData(masterDataType) {
    let endpoint = '';
    switch (masterDataType) {
      case 'fees':
        endpoint = '/accreditations/masters-fee/';
        break;
      case 'institute-types':
        endpoint = '/accreditations/institute-types/';
        break;
      case 'appeal-reasons':
        endpoint = '/accreditations/masters-appeal-reason/';
        break;
      case 'rating-categories':
        endpoint = '/accreditations/masters-rating-category/';
        break;
      case 'application-durations':
        endpoint = '/accreditations/masters-application-duration/';
        break;
      case 'standards':
        endpoint = '/accreditations/masters-standard/';
        break;
      case 'key-aspects':
        endpoint = '/accreditations/masters-key-aspect/';
        break;
      case 'indicators':
        endpoint = '/accreditations/masters-indicators/';
        break;
      case 'qualifications':
        endpoint = '/accreditations/masters-qualification/';
        break;
      case 'employee-types':
        endpoint = '/accreditations/masters-employee-type/';
        break;
      case 'staff-types':
        endpoint = '/accreditations/masters-staff-type/';
        break;
      case 'employee-categories':
        endpoint = '/accreditations/masters-employee-category/';
        break;
      case 'decisions':
        endpoint = '/accreditations/masters-decision/';
        break;
      case 'e-signatures':
        endpoint = '/accreditations/e-signatures/';
        break;
      case 'source-of-fundings':
        endpoint = '/accreditations/sources-of-funding/';
        break;
      case 'document-types':
        endpoint = '/accreditations/document-types/';
        break;
      case 'assessor-pools':
        endpoint = '/accreditations/assessor-pools/';
        break;
      default:
        console.error(`Master data type "${masterDataType}" is not supported.`);
        return Promise.reject(`Master data type "${masterDataType}" is not supported.`);
    }
    return apiClient.get(endpoint);
  },
};

