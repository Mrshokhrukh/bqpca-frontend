// src/services/services.js
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const apiClient = axios.create({
  baseURL:
    import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_API_BASE_URL_PROD
      : import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Consolidated interceptors (removed duplicates)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Handle FormData content type automatically
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data'
  } else if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json'
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const authStore = useAuthStore()

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      error.response?.data?.code === 'token_not_valid' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true
      try {
        const newAccessToken = await authStore.refreshAccessToken()
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        console.error('Unable to refresh token:', refreshError)
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  },
)

export default {
  // User authentication
  register(userData) {
    return apiClient.post('/users/register/', userData)
  },
  login(credentials) {
    return apiClient.post('/users/login/', credentials)
  },

  // Decision CRUD operations
  getDecisions() {
    return apiClient.get('/masters/roq-decisions/')
  },
  getDecision(id) {
    return apiClient.get(`/masters/roq-decisions/${id}/`)
  },
  createDecision(decisionData) {
    return apiClient.post('/masters/roq-decisions/', decisionData)
  },
  updateDecision(id, decisionData) {
    return apiClient.put(`/masters/roq-decisions/${id}/`, decisionData)
  },
  patchDecision(id, decisionData) {
    return apiClient.patch(`/masters/roq-decisions/${id}/`, decisionData)
  },
  deleteDecision(id) {
    return apiClient.delete(`/masters/roq-decisions/${id}/`)
  },

  // Learning Types CRUD operations
  getLearningTypes() {
    return apiClient.get('/masters/roq-learning-types/')
  },
  getLearningType(id) {
    return apiClient.get(`/masters/roq-learning-types/${id}/`)
  },
  createLearningType(learningTypeData) {
    return apiClient.post('/masters/roq-learning-types/', learningTypeData)
  },
  updateLearningType(id, learningTypeData) {
    return apiClient.put(`/masters/roq-learning-types/${id}/`, learningTypeData)
  },
  deleteLearningType(id) {
    return apiClient.delete(`/masters/roq-learning-types/${id}/`)
  },

  // Qualifications CRUD operations
  getQualifications() {
    return apiClient.get('/masters/roq-qualifications/')
  },
  getQualification(id) {
    return apiClient.get(`/masters/roq-qualifications/${id}/`)
  },
  createQualification(qualificationData) {
    return apiClient.post('/masters/roq-qualifications/', qualificationData)
  },
  updateQualification(id, qualificationData) {
    return apiClient.put(`/masters/roq-qualifications/${id}/`, qualificationData)
  },
  deleteQualification(id) {
    return apiClient.delete(`/masters/roq-qualifications/${id}/`)
  },

  // Reasons for Issue of Second Copy CRUD operations
  getReasonsForIssueOfSecondCopy() {
    return apiClient.get('/masters/roq-reasons-for-issue-of-second-copy/')
  },
  getReasonForIssueOfSecondCopy(id) {
    return apiClient.get(`/masters/roq-reasons-for-issue-of-second-copy/${id}/`)
  },
  createReasonForIssueOfSecondCopy(reasonData) {
    return apiClient.post('/masters/roq-reasons-for-issue-of-second-copy/', reasonData)
  },
  updateReasonForIssueOfSecondCopy(id, reasonData) {
    return apiClient.put(`/masters/roq-reasons-for-issue-of-second-copy/${id}/`, reasonData)
  },
  deleteReasonForIssueOfSecondCopy(id) {
    return apiClient.delete(`/masters/roq-reasons-for-issue-of-second-copy/${id}/`)
  },

  // Types of Course CRUD operations
  getTypesOfCourse() {
    return apiClient.get('/masters/roq-types-of-course/')
  },
  getTypeOfCourse(id) {
    return apiClient.get(`/masters/roq-types-of-course/${id}/`)
  },
  createTypeOfCourse(courseTypeData) {
    return apiClient.post('/masters/roq-types-of-course/', courseTypeData)
  },
  updateTypeOfCourse(id, courseTypeData) {
    return apiClient.put(`/masters/roq-types-of-course/${id}/`, courseTypeData)
  },
  deleteTypeOfCourse(id) {
    return apiClient.delete(`/masters/roq-types-of-course/${id}/`)
  },

  // Gender CRUD operations
  getGenders() {
    return apiClient.get('/masters/roq-genders/')
  },
  getGender(id) {
    return apiClient.get(`/masters/roq-genders/${id}/`)
  },
  createGender(genderData) {
    return apiClient.post('/masters/roq-genders/', genderData)
  },
  updateGender(id, genderData) {
    return apiClient.put(`/masters/roq-genders/${id}/`, genderData)
  },
  deleteGender(id) {
    return apiClient.delete(`/masters/roq-genders/${id}/`)
  },

  // Country CRUD operations
  getCountries() {
    return apiClient.get('/masters/roq-countries/')
  },
  getCountry(id) {
    return apiClient.get(`/masters/roq-countries/${id}/`)
  },
  createCountry(countryData) {
    return apiClient.post('/masters/roq-countries/', countryData)
  },
  updateCountry(id, countryData) {
    return apiClient.put(`/masters/roq-countries/${id}/`, countryData)
  },
  deleteCountry(id) {
    return apiClient.delete(`/masters/roq-countries/${id}/`)
  },

  // Fetch user details by user_id
  getUserDetails(userId) {
    return apiClient.get(`/users/users/${userId}/`)
  },

  // Recognition of Qualifications endpoints (enhanced for file uploads)
  getRecognitionOfQualifications(params) {
    return apiClient.get('/recognitions/recognition-of-qualifications/', { params })
  },
  getRecognitionOfQualification(id) {
    return apiClient.get(`/recognitions/recognition-of-qualifications/${id}/`)
  },
  createRecognitionOfQualification(formData) {
    return apiClient.post('/recognitions/recognition-of-qualifications/', formData)
  },
  updateRecognitionOfQualification(id, formData) {
    return apiClient.put(`/recognitions/recognition-of-qualifications/${id}/`, formData)
  },
  patchRecognitionOfQualification(id, updates) {
    return apiClient.patch(`/recognitions/recognition-of-qualifications/${id}/`, updates)
  },
  deleteRecognitionOfQualification(id) {
    return apiClient.delete(`/recognitions/recognition-of-qualifications/${id}/`)
  },

  fetchCitizenDetails(cid) {
    return apiClient.get(`/users/fetch-citizen-details/${cid}/`)
  },

  // File upload helper
  uploadFile(url, formData) {
    return apiClient.post(url, formData)
  },

  //accreditation endpoints

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
  //BMHC API endpoints
  // Masters CME Activities
  getMastersCmeActivities() {
    return apiClient.get('/bmhc/masters-cme-activities/')
  },
  createMastersCmeActivity(data) {
    return apiClient.post('/bmhc/masters-cme-activities/', data)
  },
  getMastersCmeActivity(id) {
    return apiClient.get(`/bmhc/masters-cme-activities/${id}/`)
  },
  updateMastersCmeActivity(id, data) {
    return apiClient.put(`/bmhc/masters-cme-activities/${id}/`, data)
  },
  patchMastersCmeActivity(id, data) {
    return apiClient.patch(`/bmhc/masters-cme-activities/${id}/`, data)
  },
  deleteMastersCmeActivity(id) {
    return apiClient.delete(`/bmhc/masters-cme-activities/${id}/`)
  },

  // Masters CME Credits
  getMastersCmeCredits() {
    return apiClient.get('/bmhc/masters-cme-credits/')
  },
  createMastersCmeCredit(data) {
    return apiClient.post('/bmhc/masters-cme-credits/', data)
  },
  getMastersCmeCredit(id) {
    return apiClient.get(`/bmhc/masters-cme-credits/${id}/`)
  },
  updateMastersCmeCredit(id, data) {
    return apiClient.put(`/bmhc/masters-cme-credits/${id}/`, data)
  },
  patchMastersCmeCredit(id, data) {
    return apiClient.patch(`/bmhc/masters-cme-credits/${id}/`, data)
  },
  deleteMastersCmeCredit(id) {
    return apiClient.delete(`/bmhc/masters-cme-credits/${id}/`)
  },

  // Masters CME Methodologies
  getMastersCmeMethodologies() {
    return apiClient.get('/bmhc/masters-cme-methodologies/')
  },
  createMastersCmeMethodology(data) {
    return apiClient.post('/bmhc/masters-cme-methodologies/', data)
  },
  getMastersCmeMethodology(id) {
    return apiClient.get(`/bmhc/masters-cme-methodologies/${id}/`)
  },
  updateMastersCmeMethodology(id, data) {
    return apiClient.put(`/bmhc/masters-cme-methodologies/${id}/`, data)
  },
  patchMastersCmeMethodology(id, data) {
    return apiClient.patch(`/bmhc/masters-cme-methodologies/${id}/`, data)
  },
  deleteMastersCmeMethodology(id) {
    return apiClient.delete(`/bmhc/masters-cme-methodologies/${id}/`)
  },

  // Masters CPD Activity
  getMastersCpdActivities() {
    return apiClient.get('/bmhc/masters-cpd-activity/')
  },
  createMastersCpdActivity(data) {
    return apiClient.post('/bmhc/masters-cpd-activity/', data)
  },
  getMastersCpdActivity(id) {
    return apiClient.get(`/bmhc/masters-cpd-activity/${id}/`)
  },
  updateMastersCpdActivity(id, data) {
    return apiClient.put(`/bmhc/masters-cpd-activity/${id}/`, data)
  },
  patchMastersCpdActivity(id, data) {
    return apiClient.patch(`/bmhc/masters-cpd-activity/${id}/`, data)
  },
  deleteMastersCpdActivity(id) {
    return apiClient.delete(`/bmhc/masters-cpd-activity/${id}/`)
  },

  // Masters Document Types
  getMastersDocumentTypes() {
    return apiClient.get('/bmhc/masters-document-types/')
  },
  createMastersDocumentType(data) {
    return apiClient.post('/bmhc/masters-document-types/', data)
  },
  getMastersDocumentType(id) {
    return apiClient.get(`/bmhc/masters-document-types/${id}/`)
  },
  updateMastersDocumentType(id, data) {
    return apiClient.put(`/bmhc/masters-document-types/${id}/`, data)
  },
  patchMastersDocumentType(id, data) {
    return apiClient.patch(`/bmhc/masters-document-types/${id}/`, data)
  },
  deleteMastersDocumentType(id) {
    return apiClient.delete(`/bmhc/masters-document-types/${id}/`)
  },

  // Masters E-Signatures
  getBmhCMastersESignatures() {
    return apiClient.get('/bmhc/masters-e-signatures/')
  },
  createBmhCMastersESignature(data) {
    return apiClient.post('/bmhc/masters-e-signatures/', data)
  },
  getBmhCMastersESignature(id) {
    return apiClient.get(`/bmhc/masters-e-signatures/${id}/`)
  },
  updateBmhCMastersESignature(id, data) {
    return apiClient.put(`/bmhc/masters-e-signatures/${id}/`, data)
  },
  patchBmhCMastersESignature(id, data) {
    return apiClient.patch(`/bmhc/masters-e-signatures/${id}/`, data)
  },
  deleteBmhCMastersESignature(id) {
    return apiClient.delete(`/bmhc/masters-e-signatures/${id}/`)
  },

  // Masters Fee Structures
  getMastersFeeStructures() {
    return apiClient.get('/bmhc/masters-fee-structures/')
  },
  createMastersFeeStructure(data) {
    return apiClient.post('/bmhc/masters-fee-structures/', data)
  },
  getMastersFeeStructure(id) {
    return apiClient.get(`/bmhc/masters-fee-structures/${id}/`)
  },
  updateMastersFeeStructure(id, data) {
    return apiClient.put(`/bmhc/masters-fee-structures/${id}/`, data)
  },
  patchMastersFeeStructure(id, data) {
    return apiClient.patch(`/bmhc/masters-fee-structures/${id}/`, data)
  },
  deleteMastersFeeStructure(id) {
    return apiClient.delete(`/bmhc/masters-fee-structures/${id}/`)
  },

  // Masters Fees Associated For
  getMastersFeesAssociatedFor() {
    return apiClient.get('/bmhc/masters-fees-associated-for/')
  },
  createMastersFeesAssociatedFor(data) {
    return apiClient.post('/bmhc/masters-fees-associated-for/', data)
  },
  updateMastersFeesAssociatedFor(id, data) {
    return apiClient.put(`/bmhc/masters-fees-associated-for/${id}/`, data)
  },
  patchMastersFeesAssociatedFor(id, data) {
    return apiClient.patch(`/bmhc/masters-fees-associated-for/${id}/`, data)
  },
  deleteMastersFeesAssociatedFor(id) {
    return apiClient.delete(`/bmhc/masters-fees-associated-for/${id}/`)
  },

  // Masters File Types
  getMastersFileTypes() {
    return apiClient.get('/bmhc/masters-file-types/')
  },
  createMastersFileType(data) {
    return apiClient.post('/bmhc/masters-file-types/', data)
  },
  getMastersFileType(id) {
    return apiClient.get(`/bmhc/masters-file-types/${id}/`)
  },
  updateMastersFileType(id, data) {
    return apiClient.put(`/bmhc/masters-file-types/${id}/`, data)
  },
  patchMastersFileType(id, data) {
    return apiClient.patch(`/bmhc/masters-file-types/${id}/`, data)
  },
  deleteMastersFileType(id) {
    return apiClient.delete(`/bmhc/masters-file-types/${id}/`)
  },
  // Masters Participation Category
  getMastersParticipationCategories() {
    return apiClient.get('/bmhc/masters-participation-category/')
  },
  createMastersParticipationCategory(data) {
    return apiClient.post('/bmhc/masters-participation-category/', data)
  },
  getMastersParticipationCategory(id) {
    return apiClient.get(`/bmhc/masters-participation-category/${id}/`)
  },
  updateMastersParticipationCategory(id, data) {
    return apiClient.put(`/bmhc/masters-participation-category/${id}/`, data)
  },
  patchMastersParticipationCategory(id, data) {
    return apiClient.patch(`/bmhc/masters-participation-category/${id}/`, data)
  },
  deleteMastersParticipationCategory(id) {
    return apiClient.delete(`/bmhc/masters-participation-category/${id}/`)
  },

  // Masters Participation Sub Category
  getMastersParticipationSubCategories() {
    return apiClient.get('/bmhc/masters-participation-sub-category/')
  },
  createMastersParticipationSubCategory(data) {
    return apiClient.post('/bmhc/masters-participation-sub-category/', data)
  },
  getMastersParticipationSubCategory(id) {
    return apiClient.get(`/bmhc/masters-participation-sub-category/${id}/`)
  },
  updateMastersParticipationSubCategory(id, data) {
    return apiClient.put(`/bmhc/masters-participation-sub-category/${id}/`, data)
  },
  patchMastersParticipationSubCategory(id, data) {
    return apiClient.patch(`/bmhc/masters-participation-sub-category/${id}/`, data)
  },
  deleteMastersParticipationSubCategory(id) {
    return apiClient.delete(`/bmhc/masters-participation-sub-category/${id}/`)
  },

  // Masters Personnel Categories
  getMastersPersonnelCategories() {
    return apiClient.get('/bmhc/masters-personnel-categories/')
  },
  createMastersPersonnelCategory(data) {
    return apiClient.post('/bmhc/masters-personnel-categories/', data)
  },
  getMastersPersonnelCategory(id) {
    return apiClient.get(`/bmhc/masters-personnel-categories/${id}/`)
  },
  updateMastersPersonnelCategory(id, data) {
    return apiClient.put(`/bmhc/masters-personnel-categories/${id}/`, data)
  },
  patchMastersPersonnelCategory(id, data) {
    return apiClient.patch(`/bmhc/masters-personnel-categories/${id}/`, data)
  },
  deleteMastersPersonnelCategory(id) {
    return apiClient.delete(`/bmhc/masters-personnel-categories/${id}/`)
  },

  // Masters Qualification Types
  getMastersQualificationTypes() {
    return apiClient.get('/bmhc/masters-qualification-types/')
  },
  createMastersQualificationType(data) {
    return apiClient.post('/bmhc/masters-qualification-types/', data)
  },
  getMastersQualificationType(id) {
    return apiClient.get(`/bmhc/masters-qualification-types/${id}/`)
  },
  updateMastersQualificationType(id, data) {
    return apiClient.put(`/bmhc/masters-qualification-types/${id}/`, data)
  },
  patchMastersQualificationType(id, data) {
    return apiClient.patch(`/bmhc/masters-qualification-types/${id}/`, data)
  },
  deleteMastersQualificationType(id) {
    return apiClient.delete(`/bmhc/masters-qualification-types/${id}/`)
  },

  // Masters Qualifications
  getBmhCMastersQualifications() {
    return apiClient.get('/bmhc/masters-qualifications/')
  },
  createBmhCMastersQualification(data) {
    return apiClient.post('/bmhc/masters-qualifications/', data)
  },
  getBmhCMastersQualification(id) {
    return apiClient.get(`/bmhc/masters-qualifications/${id}/`)
  },
  updateBmhCMastersQualification(id, data) {
    return apiClient.put(`/bmhc/masters-qualifications/${id}/`, data)
  },
  patchBmhCMastersQualification(id, data) {
    return apiClient.patch(`/bmhc/masters-qualifications/${id}/`, data)
  },
  deleteBmhCMastersQualification(id) {
    return apiClient.delete(`/bmhc/masters-qualifications/${id}/`)
  },

  // Masters Registration Type
  getMastersRegistrationTypes() {
    return apiClient.get('/bmhc/masters-registration-type/')
  },
  createMastersRegistrationType(data) {
    return apiClient.post('/bmhc/masters-registration-type/', data)
  },
  getMastersRegistrationType(id) {
    return apiClient.get(`/bmhc/masters-registration-type/${id}/`)
  },
  updateMastersRegistrationType(id, data) {
    return apiClient.put(`/bmhc/masters-registration-type/${id}/`, data)
  },
  patchMastersRegistrationType(id, data) {
    return apiClient.patch(`/bmhc/masters-registration-type/${id}/`, data)
  },
  deleteMastersRegistrationType(id) {
    return apiClient.delete(`/bmhc/masters-registration-type/${id}/`)
  },

  // Masters Sector
  getMastersSectors() {
    return apiClient.get('/bmhc/masters-sector/')
  },
  createMastersSector(data) {
    return apiClient.post('/bmhc/masters-sector/', data)
  },
  getMastersSector(id) {
    return apiClient.get(`/bmhc/masters-sector/${id}/`)
  },
  updateMastersSector(id, data) {
    return apiClient.put(`/bmhc/masters-sector/${id}/`, data)
  },
  patchMastersSector(id, data) {
    return apiClient.patch(`/bmhc/masters-sector/${id}/`, data)
  },
  deleteMastersSector(id) {
    return apiClient.delete(`/bmhc/masters-sector/${id}/`)
  },

  // Masters Sub Categories
  getMastersSubCategories() {
    return apiClient.get('/bmhc/masters-sub-categories/')
  },
  createMastersSubCategory(data) {
    return apiClient.post('/bmhc/masters-sub-categories/', data)
  },
  getMastersSubCategory(id) {
    return apiClient.get(`/bmhc/masters-sub-categories/${id}/`)
  },
  updateMastersSubCategory(id, data) {
    return apiClient.put(`/bmhc/masters-sub-categories/${id}/`, data)
  },
  patchMastersSubCategory(id, data) {
    return apiClient.patch(`/bmhc/masters-sub-categories/${id}/`, data)
  },
  deleteMastersSubCategory(id) {
    return apiClient.delete(`/bmhc/masters-sub-categories/${id}/`)
  },

  // Masters University
  getMastersUniversities() {
    return apiClient.get('/bmhc/masters-university/')
  },
  createMastersUniversity(data) {
    return apiClient.post('/bmhc/masters-university/', data)
  },
  getMastersUniversity(id) {
    return apiClient.get(`/bmhc/masters-university/${id}/`)
  },
  updateMastersUniversity(id, data) {
    return apiClient.put(`/bmhc/masters-university/${id}/`, data)
  },
  patchMastersUniversity(id, data) {
    return apiClient.patch(`/bmhc/masters-university/${id}/`, data)
  },
  deleteMastersUniversity(id) {
    return apiClient.delete(`/bmhc/masters-university/${id}/`)
  },
}
