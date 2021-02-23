import apiClient from './apiClient';

export default {
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

  // RoQ E Signature
  getESignature() {
    return apiClient.get('/masters/roq-e-sign/?status=true')
  },
  updateESignature(id, eSignatureData) {
    return apiClient.put(`/masters/roq-e-signature/${id}/`, eSignatureData)
  },
  createESignature(eSignatureData) {
    return apiClient.post('/masters/roq-e-signature/', eSignatureData)
  },
  deleteESignature(id) {
    return apiClient.delete(`/masters/roq-e-signature/${id}/`)
  },

}
