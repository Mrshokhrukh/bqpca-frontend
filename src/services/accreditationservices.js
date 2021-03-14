import apiClient from './apiClient'

export default {
  // Institution Profiles
  getInstitutionProfiles() {
    return apiClient.get('/accrediations/institution-profiles/')
  },
  createInstitutionProfile(data) {
    return apiClient.post('/accrediations/institution-profiles/', data)
  },
  getInstitutionProfile(id) {
    return apiClient.get(`/accrediations/institution-profiles/${id}/`)
  },
  updateInstitutionProfile(id, data) {
    return apiClient.put(`/accrediations/institution-profiles/${id}/`, data)
  },
  patchInstitutionProfile(id, data) {
    return apiClient.patch(`/accrediations/institution-profiles/${id}/`, data)
  },
  deleteInstitutionProfile(id) {
    return apiClient.delete(`/accrediations/institution-profiles/${id}/`)
  },

  // Masters Appeal Reason
  getMastersAppealReasons() {
    return apiClient.get('/accrediations/masters-appeal-reason/')
  },
  createMastersAppealReason(data) {
    return apiClient.post('/accrediations/masters-appeal-reason/', data)
  },
  getMastersAppealReason(id) {
    return apiClient.get(`/accrediations/masters-appeal-reason/${id}/`)
  },
  updateMastersAppealReason(id, data) {
    return apiClient.put(`/accrediations/masters-appeal-reason/${id}/`, data)
  },
  patchMastersAppealReason(id, data) {
    return apiClient.patch(`/accrediations/masters-appeal-reason/${id}/`, data)
  },
  deleteMastersAppealReason(id) {
    return apiClient.delete(`/accrediations/masters-appeal-reason/${id}/`)
  },

  // Masters Application Duration Management
  getMastersApplicationDurationManagements() {
    return apiClient.get('/accrediations/masters-application-duration-management/')
  },
  createMastersApplicationDurationManagement(data) {
    return apiClient.post('/accrediations/masters-application-duration-management/', data)
  },
  getMastersApplicationDurationManagement(id) {
    return apiClient.get(`/accrediations/masters-application-duration-management/${id}/`)
  },
  updateMastersApplicationDurationManagement(id, data) {
    return apiClient.put(`/accrediations/masters-application-duration-management/${id}/`, data)
  },
  patchMastersApplicationDurationManagement(id, data) {
    return apiClient.patch(`/accrediations/masters-application-duration-management/${id}/`, data)
  },
  deleteMastersApplicationDurationManagement(id) {
    return apiClient.delete(`/accrediations/masters-application-duration-management/${id}/`)
  },

  // Masters Decision
  getMastersDecisions() {
    return apiClient.get('/accrediations/masters-decision/')
  },
  createMastersDecision(data) {
    return apiClient.post('/accrediations/masters-decision/', data)
  },
  getMastersDecision(id) {
    return apiClient.get(`/accrediations/masters-decision/${id}/`)
  },
  updateMastersDecision(id, data) {
    return apiClient.put(`/accrediations/masters-decision/${id}/`, data)
  },
  patchMastersDecision(id, data) {
    return apiClient.patch(`/accrediations/masters-decision/${id}/`, data)
  },
  deleteMastersDecision(id) {
    return apiClient.delete(`/accrediations/masters-decision/${id}/`)
  },

  // Masters E-Signature
  getMastersESignatures() {
    return apiClient.get('/accrediations/masters-e-signature/')
  },
  createMastersESignature(data) {
    return apiClient.post('/accrediations/masters-e-signature/', data)
  },
  getMastersESignature(id) {
    return apiClient.get(`/accrediations/masters-e-signature/${id}/`)
  },
  updateMastersESignature(id, data) {
    return apiClient.put(`/accrediations/masters-e-signature/${id}/`, data)
  },
  patchMastersESignature(id, data) {
    return apiClient.patch(`/accrediations/masters-e-signature/${id}/`, data)
  },
  deleteMastersESignature(id) {
    return apiClient.delete(`/accrediations/masters-e-signature/${id}/`)
  },

  // Masters Employee Category
  getMastersEmployeeCategories() {
    return apiClient.get('/accrediations/masters-employee-category/')
  },
  createMastersEmployeeCategory(data) {
    return apiClient.post('/accrediations/masters-employee-category/', data)
  },
  getMastersEmployeeCategory(id) {
    return apiClient.get(`/accrediations/masters-employee-category/${id}/`)
  },
  updateMastersEmployeeCategory(id, data) {
    return apiClient.put(`/accrediations/masters-employee-category/${id}/`, data)
  },
  patchMastersEmployeeCategory(id, data) {
    return apiClient.patch(`/accrediations/masters-employee-category/${id}/`, data)
  },
  deleteMastersEmployeeCategory(id) {
    return apiClient.delete(`/accrediations/masters-employee-category/${id}/`)
  },

  // Masters Source of Funding Endpoints
  getMastersSourceOfFundings() {
    return apiClient.get('/accrediations/masters-source-of-funding/');
  },
  createMastersSourceOfFunding(data) {
    return apiClient.post('/accrediations/masters-source-of-funding/', data);
  },
  getMastersSourceOfFunding(id) {
    return apiClient.get(`/accrediations/masters-source-of-funding/${id}/`);
  },
  updateMastersSourceOfFunding(id, data) {
    return apiClient.put(`/accrediations/masters-source-of-funding/${id}/`, data);
  },
  patchMastersSourceOfFunding(id, data) {
    return apiClient.patch(`/accrediations/masters-source-of-funding/${id}/`, data);
  },
  deleteMastersSourceOfFunding(id) { // Added delete function
    return apiClient.delete(`/accrediations/masters-source-of-funding/${id}/`);
  },

  // Masters Employee Type
  getMastersEmployeeTypes() {
    return apiClient.get('/accrediations/masters-employee-type/')
  },
  createMastersEmployeeType(data) {
    return apiClient.post('/accrediations/masters-employee-type/', data)
  },
  getMastersEmployeeType(id) {
    return apiClient.get(`/accrediations/masters-employee-type/${id}/`)
  },
  updateMastersEmployeeType(id, data) {
    return apiClient.put(`/accrediations/masters-employee-type/${id}/`, data)
  },
  patchMastersEmployeeType(id, data) {
    return apiClient.patch(`/accrediations/masters-employee-type/${id}/`, data)
  },
  deleteMastersEmployeeType(id) {
    return apiClient.delete(`/accrediations/masters-employee-type/${id}/`)
  },

  // Masters Fee
  getMastersFees() {
    return apiClient.get('/accrediations/masters-fee/')
  },
  createMastersFee(data) {
    return apiClient.post('/accrediations/masters-fee/', data)
  },
  getMastersFee(id) {
    return apiClient.get(`/accrediations/masters-fee/${id}/`)
  },
  updateMastersFee(id, data) {
    return apiClient.put(`/accrediations/masters-fee/${id}/`, data)
  },
  patchMastersFee(id, data) {
    return apiClient.patch(`/accrediations/masters-fee/${id}/`, data)
  },
  deleteMastersFee(id) {
    return apiClient.delete(`/accrediations/masters-fee/${id}/`)
  },

  // Masters Indicators
  getMastersIndicators() {
    return apiClient.get('/accrediations/masters-indicators/')
  },
  createMastersIndicator(data) {
    return apiClient.post('/accrediations/masters-indicators/', data)
  },
  getMastersIndicator(id) {
    return apiClient.get(`/accrediations/masters-indicators/${id}/`)
  },
  updateMastersIndicator(id, data) {
    return apiClient.put(`/accrediations/masters-indicators/${id}/`, data)
  },
  patchMastersIndicator(id, data) {
    return apiClient.patch(`/accrediations/masters-indicators/${id}/`, data)
  },
  deleteMastersIndicator(id) {
    return apiClient.delete(`/accrediations/masters-indicators/${id}/`)
  },

  // Masters Institute
  getMastersInstitutes() {
    return apiClient.get('/accrediations/masters-institute/')
  },
  createMastersInstitute(data) {
    return apiClient.post('/accrediations/masters-institute/', data)
  },
  getMastersInstitute(id) {
    return apiClient.get(`/accrediations/masters-institute/${id}/`)
  },
  updateMastersInstitute(id, data) {
    return apiClient.put(`/accrediations/masters-institute/${id}/`, data)
  },
  patchMastersInstitute(id, data) {
    return apiClient.patch(`/accrediations/masters-institute/${id}/`, data)
  },
  deleteMastersInstitute(id) {
    return apiClient.delete(`/accrediations/masters-institute/${id}/`)
  },

  // Masters Key Aspect
  getMastersKeyAspects() {
    return apiClient.get('/accrediations/masters-key-aspect/')
  },
  createMastersKeyAspect(data) {
    return apiClient.post('/accrediations/masters-key-aspect/', data)
  },
  getMastersKeyAspect(id) {
    return apiClient.get(`/accrediations/masters-key-aspect/${id}/`)
  },
  updateMastersKeyAspect(id, data) {
    return apiClient.put(`/accrediations/masters-key-aspect/${id}/`, data)
  },
  patchMastersKeyAspect(id, data) {
    return apiClient.patch(`/accrediations/masters-key-aspect/${id}/`, data)
  },
  deleteMastersKeyAspect(id) {
    return apiClient.delete(`/accrediations/masters-key-aspect/${id}/`)
  },

  // Masters Qualification
  getMastersQualifications() {
    return apiClient.get('/accrediations/masters-qualification/')
  },
  createMastersQualification(data) {
    return apiClient.post('/accrediations/masters-qualification/', data)
  },
  getMastersQualification(id) {
    return apiClient.get(`/accrediations/masters-qualification/${id}/`)
  },
  updateMastersQualification(id, data) {
    return apiClient.put(`/accrediations/masters-qualification/${id}/`, data)
  },
  patchMastersQualification(id, data) {
    return apiClient.patch(`/accrediations/masters-qualification/${id}/`, data)
  },
  deleteMastersQualification(id) {
    return apiClient.delete(`/accrediations/masters-qualification/${id}/`)
  },

  // Masters Rating Category
  getMastersRatingCategories() {
    return apiClient.get('/accrediations/masters-rating-category/')
  },
  createMastersRatingCategory(data) {
    return apiClient.post('/accrediations/masters-rating-category/', data)
  },
  getMastersRatingCategory(id) {
    return apiClient.get(`/accrediations/masters-rating-category/${id}/`)
  },
  updateMastersRatingCategory(id, data) {
    return apiClient.put(`/accrediations/masters-rating-category/${id}/`, data)
  },
  patchMastersRatingCategory(id, data) {
    return apiClient.patch(`/accrediations/masters-rating-category/${id}/`, data)
  },
  deleteMastersRatingCategory(id) {
    return apiClient.delete(`/accrediations/masters-rating-category/${id}/`)
  },

  // Masters Staff Type
  getMastersStaffTypes() {
    return apiClient.get('/accrediations/masters-staff-type/')
  },
  createMastersStaffType(data) {
    return apiClient.post('/accrediations/masters-staff-type/', data)
  },
  getMastersStaffType(id) {
    return apiClient.get(`/accrediations/masters-staff-type/${id}/`)
  },
  updateMastersStaffType(id, data) {
    return apiClient.put(`/accrediations/masters-staff-type/${id}/`, data)
  },
  patchMastersStaffType(id, data) {
    return apiClient.patch(`/accrediations/masters-staff-type/${id}/`, data)
  },
  deleteMastersStaffType(id) {
    return apiClient.delete(`/accrediations/masters-staff-type/${id}/`)
  },

  // Masters Standard
  getMastersStandards() {
    return apiClient.get('/accrediations/masters-standard/')
  },
  createMastersStandard(data) {
    return apiClient.post('/accrediations/masters-standard/', data)
  },
  getMastersStandard(id) {
    return apiClient.get(`/accrediations/masters-standard/${id}/`)
  },
  updateMastersStandard(id, data) {
    return apiClient.put(`/accrediations/masters-standard/${id}/`, data)
  },
  patchMastersStandard(id, data) {
    return apiClient.patch(`/accrediations/masters-standard/${id}/`, data)
  },
  deleteMastersStandard(id) {
    return apiClient.delete(`/accrediations/masters-standard/${id}/`)
  },
  // Masters Document Type
  getMastersDocumentTypes() {
    return apiClient.get('/accrediations/masters-document-type/')
  },
  createMastersDocumentType(data) {
    return apiClient.post('/accrediations/masters-document-type/', data)
  },
  getMastersDocumentType(id) {
    return apiClient.get(`/accrediations/masters-document-type/${id}/`)
  },
  updateMastersDocumentType(id, data) {
    return apiClient.put(`/accrediations/masters-document-type/${id}/`, data)
  },
  patchMastersDocumentType(id, data) {
    return apiClient.patch(`/accrediations/masters-document-type/${id}/`, data)
  },
  deleteMastersDocumentType(id) {
    return apiClient.delete(`/accrediations/masters-document-type/${id}/`)
  },

  // Past Accreditations
  getPastAccreditations() {
    return apiClient.get('/accrediations/past-accreditations/')
  },
  createPastAccreditation(data) {
    return apiClient.post('/accrediations/past-accreditations/', data)
  },
  getPastAccreditation(id) {
    return apiClient.get(`/accrediations/past-accreditations/${id}/`)
  },
  updatePastAccreditation(id, data) {
    return apiClient.put(`/accrediations/past-accreditations/${id}/`, data)
  },
  patchPastAccreditation(id, data) {
    return apiClient.patch(`/accrediations/past-accreditations/${id}/`, data)
  },
  deletePastAccreditation(id) {
    return apiClient.delete(`/accrediations/past-accreditations/${id}/`)
  },

  // Profile Appeals
  getProfileAppeals() {
    return apiClient.get('/accrediations/profile-appeals/')
  },
  createProfileAppeal(data) {
    return apiClient.post('/accrediations/profile-appeals/', data)
  },
  getProfileAppeal(id) {
    return apiClient.get(`/accrediations/profile-appeals/${id}/`)
  },
  updateProfileAppeal(id, data) {
    return apiClient.put(`/accrediations/profile-appeals/${id}/`, data)
  },
  patchProfileAppeal(id, data) {
    return apiClient.patch(`/accrediations/profile-appeals/${id}/`, data)
  },
  deleteProfileAppeal(id) {
    return apiClient.delete(`/accrediations/profile-appeals/${id}/`)
  },

  // Profile Assessors
  getProfileAssessors() {
    return apiClient.get('/accrediations/profile-assessors/')
  },
  createProfileAssessor(data) {
    return apiClient.post('/accrediations/profile-assessors/', data)
  },
  getProfileAssessor(id) {
    return apiClient.get(`/accrediations/profile-assessors/${id}/`)
  },
  updateProfileAssessor(id, data) {
    return apiClient.put(`/accrediations/profile-assessors/${id}/`, data)
  },
  patchProfileAssessor(id, data) {
    return apiClient.patch(`/accrediations/profile-assessors/${id}/`, data)
  },
  deleteProfileAssessor(id) {
    return apiClient.delete(`/accrediations/profile-assessors/${id}/`)
  },

  // Profile Documents
  getProfileDocuments() {
    return apiClient.get('/accrediations/profile-documents/')
  },
  createProfileDocument(data) {
    return apiClient.post('/accrediations/profile-documents/', data)
  },
  getProfileDocument(id) {
    return apiClient.get(`/accrediations/profile-documents/${id}/`)
  },
  updateProfileDocument(id, data) {
    return apiClient.put(`/accrediations/profile-documents/${id}/`, data)
  },
  patchProfileDocument(id, data) {
    return apiClient.patch(`/accrediations/profile-documents/${id}/`, data)
  },
  deleteProfileDocument(id) {
    return apiClient.delete(`/accrediations/profile-documents/${id}/`)
  },

  // Profile Standards
  getProfileStandards() {
    return apiClient.get('/accrediations/profile-standards/')
  },
  createProfileStandard(data) {
    return apiClient.post('/accrediations/profile-standards/', data)
  },
  getProfileStandard(id) {
    return apiClient.get(`/accrediations/profile-standards/${id}/`)
  },
  updateProfileStandard(id, data) {
    return apiClient.put(`/accrediations/profile-standards/${id}/`, data)
  },
  patchProfileStandard(id, data) {
    return apiClient.patch(`/accrediations/profile-standards/${id}/`, data)
  },
  deleteProfileStandard(id) {
    return apiClient.delete(`/accrediations/profile-standards/${id}/`)
  },

  // Site Visit Schedules
  getSiteVisitSchedules() {
    return apiClient.get('/accrediations/site-visit-schedules/')
  },
  createSiteVisitSchedule(data) {
    return apiClient.post('/accrediations/site-visit-schedules/', data)
  },
  getSiteVisitSchedule(id) {
    return apiClient.get(`/accrediations/site-visit-schedules/${id}/`)
  },
  updateSiteVisitSchedule(id, data) {
    return apiClient.put(`/accrediations/site-visit-schedules/${id}/`, data)
  },
  patchSiteVisitSchedule(id, data) {
    return apiClient.patch(`/accrediations/site-visit-schedules/${id}/`, data)
  },
  deleteSiteVisitSchedule(id) {
    return apiClient.delete(`/accrediations/site-visit-schedules/${id}/`)
  },
}
