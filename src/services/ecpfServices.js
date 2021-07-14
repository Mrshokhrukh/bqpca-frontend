import apiClient from './apiClient'

export default {
  // ECPF Branches
  getEcpfBranches() {
    return apiClient.get('/ecpf/ecpf-branches/')
  },
  createEcpfBranch(data) {
    return apiClient.post('/ecpf/ecpf-branches/', data)
  },
  getEcpfBranch(id) {
    return apiClient.get(`/ecpf/ecpf-branches/${id}/`)
  },
  updateEcpfBranch(id, data) {
    return apiClient.put(`/ecpf/ecpf-branches/${id}/`, data)
  },
  patchEcpfBranch(id, data) {
    return apiClient.patch(`/ecpf/ecpf-branches/${id}/`, data)
  },
  deleteEcpfBranch(id) {
    return apiClient.delete(`/ecpf/ecpf-branches/${id}/`)
  },

  // ECPF Collaborations
  getEcpfCollaborations() {
    return apiClient.get('/ecpf/ecpf-collaborations/')
  },
  createEcpfCollaboration(data) {
    return apiClient.post('/ecpf/ecpf-collaborations/', data)
  },
  getEcpfCollaboration(id) {
    return apiClient.get(`/ecpf/ecpf-collaborations/${id}/`)
  },
  updateEcpfCollaboration(id, data) {
    return apiClient.put(`/ecpf/ecpf-collaborations/${id}/`, data)
  },
  patchEcpfCollaboration(id, data) {
    return apiClient.patch(`/ecpf/ecpf-collaborations/${id}/`, data)
  },
  deleteEcpfCollaboration(id) {
    return apiClient.delete(`/ecpf/ecpf-collaborations/${id}/`)
  },

  // ECPF Education Fairs
  getEcpfEducationFairs() {
    return apiClient.get('/ecpf/ecpf-education-fairs/')
  },
  createEcpfEducationFair(data) {
    return apiClient.post('/ecpf/ecpf-education-fairs/', data)
  },
  getEcpfEducationFair(id) {
    return apiClient.get(`/ecpf/ecpf-education-fairs/${id}/`)
  },
  updateEcpfEducationFair(id, data) {
    return apiClient.put(`/ecpf/ecpf-education-fairs/${id}/`, data)
  },
  patchEcpfEducationFair(id, data) {
    return apiClient.patch(`/ecpf/ecpf-education-fairs/${id}/`, data)
  },
  deleteEcpfEducationFair(id) {
    return apiClient.delete(`/ecpf/ecpf-education-fairs/${id}/`)
  },

  // ECPF Linkage Establishments
  getEcpfLinkageEstablishments() {
    return apiClient.get('/ecpf/ecpf-linkage-establishments/')
  },
  createEcpfLinkageEstablishment(data) {
    return apiClient.post('/ecpf/ecpf-linkage-establishments/', data)
  },
  getEcpfLinkageEstablishment(id) {
    return apiClient.get(`/ecpf/ecpf-linkage-establishments/${id}/`)
  },
  updateEcpfLinkageEstablishment(id, data) {
    return apiClient.put(`/ecpf/ecpf-linkage-establishments/${id}/`, data)
  },
  patchEcpfLinkageEstablishment(id, data) {
    return apiClient.patch(`/ecpf/ecpf-linkage-establishments/${id}/`, data)
  },
  deleteEcpfLinkageEstablishment(id) {
    return apiClient.delete(`/ecpf/ecpf-linkage-establishments/${id}/`)
  },

  // ECPF Location Changes
  getEcpfLocationChanges() {
    return apiClient.get('/ecpf/ecpf-location-changes/')
  },
  createEcpfLocationChange(data) {
    return apiClient.post('/ecpf/ecpf-location-changes/', data)
  },
  getEcpfLocationChange(id) {
    return apiClient.get(`/ecpf/ecpf-location-changes/${id}/`)
  },
  updateEcpfLocationChange(id, data) {
    return apiClient.put(`/ecpf/ecpf-location-changes/${id}/`, data)
  },
  patchEcpfLocationChange(id, data) {
    return apiClient.patch(`/ecpf/ecpf-location-changes/${id}/`, data)
  },
  deleteEcpfLocationChange(id) {
    return apiClient.delete(`/ecpf/ecpf-location-changes/${id}/`)
  },

  // ECPF Name Changes
  getEcpfNameChanges() {
    return apiClient.get('/ecpf/ecpf-name-changes/')
  },
  createEcpfNameChange(data) {
    return apiClient.post('/ecpf/ecpf-name-changes/', data)
  },
  getEcpfNameChange(id) {
    return apiClient.get(`/ecpf/ecpf-name-changes/${id}/`)
  },
  updateEcpfNameChange(id, data) {
    return apiClient.put(`/ecpf/ecpf-name-changes/${id}/`, data)
  },
  patchEcpfNameChange(id, data) {
    return apiClient.patch(`/ecpf/ecpf-name-changes/${id}/`, data)
  },
  deleteEcpfNameChange(id) {
    return apiClient.delete(`/ecpf/ecpf-name-changes/${id}/`)
  },
  // ECPF Non-Compliances
  getEcpfNonCompliances() {
    return apiClient.get('/ecpf/ecpf-non-compliances/')
  },
  createEcpfNonCompliance(data) {
    return apiClient.post('/ecpf/ecpf-non-compliances/', data)
  },
  getEcpfNonCompliance(id) {
    return apiClient.get(`/ecpf/ecpf-non-compliances/${id}/`)
  },
  updateEcpfNonCompliance(id, data) {
    return apiClient.put(`/ecpf/ecpf-non-compliances/${id}/`, data)
  },
  patchEcpfNonCompliance(id, data) {
    return apiClient.patch(`/ecpf/ecpf-non-compliances/${id}/`, data)
  },
  deleteEcpfNonCompliance(id) {
    return apiClient.delete(`/ecpf/ecpf-non-compliances/${id}/`)
  },

  // ECPF Profile
  getEcpfProfiles() {
    return apiClient.get('/ecpf/ecpf-profile/')
  },
  getEcpfDetailsByCID(cid) {
    return apiClient.get(`/ecpf/ecpf-profile/${cid}/`)
  },
  createEcpfProfile(data) {
    return apiClient.post('/ecpf/ecpf-profile/', data)
  },
  getEcpfProfile(id) {
    return apiClient.get(`/ecpf/ecpf-profile/${id}/`)
  },
  updateEcpfProfile(id, data) {
    return apiClient.put(`/ecpf/ecpf-profile/${id}/`, data)
  },
  patchEcpfProfile(id, data) {
    return apiClient.patch(`/ecpf/ecpf-profile/${id}/`, data)
  },
  deleteEcpfProfile(id) {
    return apiClient.delete(`/ecpf/ecpf-profile/${id}/`)
  },

  // ECPF Promotional HEI Visit
  getEcpfPromotionalHeiVisits() {
    return apiClient.get('/ecpf/ecpf-promotional-hei-visit/')
  },
  createEcpfPromotionalHeiVisit(data) {
    return apiClient.post('/ecpf/ecpf-promotional-hei-visit/', data)
  },
  getEcpfPromotionalHeiVisit(id) {
    return apiClient.get(`/ecpf/ecpf-promotional-hei-visit/${id}/`)
  },
  updateEcpfPromotionalHeiVisit(id, data) {
    return apiClient.put(`/ecpf/ecpf-promotional-hei-visit/${id}/`, data)
  },
  patchEcpfPromotionalHeiVisit(id, data) {
    return apiClient.patch(`/ecpf/ecpf-promotional-hei-visit/${id}/`, data)
  },
  deleteEcpfPromotionalHeiVisit(id) {
    return apiClient.delete(`/ecpf/ecpf-promotional-hei-visit/${id}/`)
  },

  // ECPF Promotional Inhouse Event
  getEcpfPromotionalInhouseEvents() {
    return apiClient.get('/ecpf/ecpf-promotional-inhouse-event/')
  },
  createEcpfPromotionalInhouseEvent(data) {
    return apiClient.post('/ecpf/ecpf-promotional-inhouse-event/', data)
  },
  getEcpfPromotionalInhouseEvent(id) {
    return apiClient.get(`/ecpf/ecpf-promotional-inhouse-event/${id}/`)
  },
  updateEcpfPromotionalInhouseEvent(id, data) {
    return apiClient.put(`/ecpf/ecpf-promotional-inhouse-event/${id}/`, data)
  },
  patchEcpfPromotionalInhouseEvent(id, data) {
    return apiClient.patch(`/ecpf/ecpf-promotional-inhouse-event/${id}/`, data)
  },
  deleteEcpfPromotionalInhouseEvent(id) {
    return apiClient.delete(`/ecpf/ecpf-promotional-inhouse-event/${id}/`)
  },

  // ECPF Promotional Mass Media
  getEcpfPromotionalMassMedias() {
    return apiClient.get('/ecpf/ecpf-promotional-mass-media/')
  },
  createEcpfPromotionalMassMedia(data) {
    return apiClient.post('/ecpf/ecpf-promotional-mass-media/', data)
  },
  getEcpfPromotionalMassMedia(id) {
    return apiClient.get(`/ecpf/ecpf-promotional-mass-media/${id}/`)
  },
  updateEcpfPromotionalMassMedia(id, data) {
    return apiClient.put(`/ecpf/ecpf-promotional-mass-media/${id}/`, data)
  },
  patchEcpfPromotionalMassMedia(id, data) {
    return apiClient.patch(`/ecpf/ecpf-promotional-mass-media/${id}/`, data)
  },
  deleteEcpfPromotionalMassMedia(id) {
    return apiClient.delete(`/ecpf/ecpf-promotional-mass-media/${id}/`)
  },
  getEcpfOwnershipChanges() {
    return apiClient.get('/ecpf/ecpf-ownership-changes/')
  },
  getEcpfOwnershipChange(id) {
    return apiClient.get(`/ecpf/ecpf-ownership-changes/${id}/`)
  },
  updateEcpfOwnershipChange(id, data) {
    // Standard update for an existing ownership change record
    return apiClient.put(`/ecpf/ecpf-ownership-changes/${id}/`, data)
  },
  patchEcpfOwnershipChange(id, data) {
    // Standard partial update
    return apiClient.patch(`/ecpf/ecpf-ownership-changes/${id}/`, data)
  },
  deleteEcpfOwnershipChange(id) {
    // Standard delete, e.g., for a draft or erroneous submission
    return apiClient.delete(`/ecpf/ecpf-ownership-changes/${id}/`)
  },
  // --- Methods specifically for the Ownership Change Form component ---
  // Called for final submission. This is effectively creating a new ownership change record.
  submitOwnershipChange(data) {
    // Corresponds to: const response = await apiService.submitOwnershipChange(submitData) in the component
    return apiClient.post('/ecpf/ecpf-ownership-changes/', data)
  },
  // Called for saving as draft.
  saveOwnershipChangeDraft(data) {
    // Corresponds to: const response = await apiService.saveOwnershipChangeDraft(draftPayload) in the component
    // Assumes backend differentiates draft by a flag in 'data' (e.g., is_draft_user: true, or a specific status).
    // This typically POSTs to the same collection endpoint.
    return apiClient.post('/ecpf/ecpf-ownership-changes/', data)
  },

  // ECPF Renewals
  getEcpfRenewals() {
    return apiClient.get('/ecpf/ecpf-renewals/')
  },
  createEcpfRenewal(data) {
    return apiClient.post('/ecpf/ecpf-renewals/', data)
  },
  getEcpfRenewal(id) {
    return apiClient.get(`/ecpf/ecpf-renewals/${id}/`)
  },
  updateEcpfRenewal(id, data) {
    return apiClient.put(`/ecpf/ecpf-renewals/${id}/`, data)
  },
  patchEcpfRenewal(id, data) {
    return apiClient.patch(`/ecpf/ecpf-renewals/${id}/`, data)
  },
  deleteEcpfRenewal(id) {
    return apiClient.delete(`/ecpf/ecpf-renewals/${id}/`)
  },

  // Master Compliance Action
  getMasterComplianceActions() {
    return apiClient.get('/ecpf/master-compliance-action/')
  },
  createMasterComplianceAction(data) {
    return apiClient.post('/ecpf/master-compliance-action/', data)
  },
  getMasterComplianceAction(id) {
    return apiClient.get(`/ecpf/master-compliance-action/${id}/`)
  },
  updateMasterComplianceAction(id, data) {
    return apiClient.put(`/ecpf/master-compliance-action/${id}/`, data)
  },
  patchMasterComplianceAction(id, data) {
    return apiClient.patch(`/ecpf/master-compliance-action/${id}/`, data)
  },
  deleteMasterComplianceAction(id) {
    return apiClient.delete(`/ecpf/master-compliance-action/${id}/`)
  },

  // Master Non-Compliance Admin Action Taken
  getMasterComplianceActionsTaken() {
    return apiClient.get('/ecpf/master-compliance-action-taken/')
  },
  createMasterComplianceActionTaken(data) {
    return apiClient.post('/ecpf/master-compliance-action-taken/', data)
  },
  getMasterComplianceActionTaken(id) {
    return apiClient.get(`/ecpf/master-compliance-action-taken/${id}/`)
  },
  updateMasterComplianceActionTaken(id, data) {
    return apiClient.put(`/ecpf/master-compliance-action-taken/${id}/`, data)
  },
  patchMasterComplianceActionTaken(id, data) {
    return apiClient.patch(`/ecpf/master-compliance-action-taken/${id}/`, data)
  },
  deleteMasterComplianceActionTaken(id) {
    return apiClient.delete(`/ecpf/master-compliance-action-taken/${id}/`)
  },

  // Master Institute/College/University

  getMasterInstitutesCollegesUniversities() {
    return apiClient.get('/ecpf/master-institute-college-university/')
  },
  createMasterInstituteCollegeUniversity(data) {
    return apiClient.post('/ecpf/master-institute-college-university/', data)
  },
  getMasterInstituteCollegeUniversity(id) {
    return apiClient.get(`/ecpf/master-institute-college-university/${id}/`)
  },
  updateMasterInstituteCollegeUniversity(id, data) {
    return apiClient.put(`/ecpf/master-institute-college-university/${id}/`, data)
  },
  patchMasterInstituteCollegeUniversity(id, data) {
    return apiClient.patch(`/ecpf/master-institute-college-university/${id}/`, data)
  },
  deleteMasterInstituteCollegeUniversity(id) {
    return apiClient.delete(`/ecpf/master-institute-college-university/${id}/`)
  },

  // Master Issue Compliance
  getMasterIssueCompliances() {
    return apiClient.get('/ecpf/master-issue-compliance/')
  },
  createMasterIssueCompliance(data) {
    return apiClient.post('/ecpf/master-issue-compliance/', data)
  },
  getMasterIssueCompliance(id) {
    return apiClient.get(`/ecpf/master-issue-compliance/${id}/`)
  },
  updateMasterIssueCompliance(id, data) {
    return apiClient.put(`/ecpf/master-issue-compliance/${id}/`, data)
  },
  patchMasterIssueCompliance(id, data) {
    return apiClient.patch(`/ecpf/master-issue-compliance/${id}/`, data)
  },
  deleteMasterIssueCompliance(id) {
    return apiClient.delete(`/ecpf/master-issue-compliance/${id}/`)
  },

  // Master Promotional Event Types
  getMasterPromotionalEventTypes() {
    return apiClient.get('/ecpf/master-promotional-event-types/')
  },
  createMasterPromotionalEventType(data) {
    return apiClient.post('/ecpf/master-promotional-event-types/', data)
  },
  getMasterPromotionalEventType(id) {
    return apiClient.get(`/ecpf/master-promotional-event-types/${id}/`)
  },
  updateMasterPromotionalEventType(id, data) {
    return apiClient.put(`/ecpf/master-promotional-event-types/${id}/`, data)
  },
  patchMasterPromotionalEventType(id, data) {
    return apiClient.patch(`/ecpf/master-promotional-event-types/${id}/`, data)
  },
  deleteMasterPromotionalEventType(id) {
    return apiClient.delete(`/ecpf/master-promotional-event-types/${id}/`)
  },

  // Masters ECPF Decisions
  getMastersEcpfDecisions() {
    return apiClient.get('/ecpf/masters-ecpf-decisions/')
  },
  createMastersEcpfDecision(data) {
    return apiClient.post('/ecpf/masters-ecpf-decisions/', data)
  },
  getMastersEcpfDecision(id) {
    return apiClient.get(`/ecpf/masters-ecpf-decisions/${id}/`)
  },
  updateMastersEcpfDecision(id, data) {
    return apiClient.put(`/ecpf/masters-ecpf-decisions/${id}/`, data)
  },
  patchMastersEcpfDecision(id, data) {
    return apiClient.patch(`/ecpf/masters-ecpf-decisions/${id}/`, data)
  },
  deleteMastersEcpfDecision(id) {
    return apiClient.delete(`/ecpf/masters-ecpf-decisions/${id}/`)
  },

  // Masters ECPF Qualification
  getMastersEcpfQualifications() {
    return apiClient.get('/ecpf/masters-ecpf-qualification/')
  },
  createMastersEcpfQualification(data) {
    return apiClient.post('/ecpf/masters-ecpf-qualification/', data)
  },
  getMastersEcpfQualification(id) {
    return apiClient.get(`/ecpf/masters-ecpf-qualification/${id}/`)
  },
  updateMastersEcpfQualification(id, data) {
    return apiClient.put(`/ecpf/masters-ecpf-qualification/${id}/`, data)
  },
  patchMastersEcpfQualification(id, data) {
    return apiClient.patch(`/ecpf/masters-ecpf-qualification/${id}/`, data)
  },
  deleteMastersEcpfQualification(id) {
    return apiClient.delete(`/ecpf/masters-ecpf-qualification/${id}/`)
  },

  // Masters Infrastructure
  getMastersInfrastructures() {
    return apiClient.get('/ecpf/masters-infrastructure/')
  },
  createMastersInfrastructure(data) {
    return apiClient.post('/ecpf/masters-infrastructure/', data)
  },
  getMastersInfrastructure(id) {
    return apiClient.get(`/ecpf/masters-infrastructure/${id}/`)
  },
  updateMastersInfrastructure(id, data) {
    return apiClient.put(`/ecpf/masters-infrastructure/${id}/`, data)
  },
  patchMastersInfrastructure(id, data) {
    return apiClient.patch(`/ecpf/masters-infrastructure/${id}/`, data)
  },
  deleteMastersInfrastructure(id) {
    return apiClient.delete(`/ecpf/masters-infrastructure/${id}/`)
  },

  // Masters Position
  getMastersPositions() {
    return apiClient.get('/ecpf/masters-position/')
  },
  createMastersPosition(data) {
    return apiClient.post('/ecpf/masters-position/', data)
  },
  getMastersPosition(id) {
    return apiClient.get(`/ecpf/masters-position/${id}/`)
  },
  updateMastersPosition(id, data) {
    return apiClient.put(`/ecpf/masters-position/${id}/`, data)
  },
  patchMastersPosition(id, data) {
    return apiClient.patch(`/ecpf/masters-position/${id}/`, data)
  },
  deleteMastersPosition(id) {
    return apiClient.delete(`/ecpf/masters-position/${id}/`)
  },

  // Masters Service Category
  getMastersServiceCategories() {
    return apiClient.get('/ecpf/masters-service-category/')
  },
  createMastersServiceCategory(data) {
    return apiClient.post('/ecpf/masters-service-category/', data)
  },
  getMastersServiceCategory(id) {
    return apiClient.get(`/ecpf/masters-service-category/${id}/`)
  },
  updateMastersServiceCategory(id, data) {
    return apiClient.put(`/ecpf/masters-service-category/${id}/`, data)
  },
  patchMastersServiceCategory(id, data) {
    return apiClient.patch(`/ecpf/masters-service-category/${id}/`, data)
  },
  deleteMastersServiceCategory(id) {
    return apiClient.delete(`/ecpf/masters-service-category/${id}/`)
  },

  // Masters Status
  getMastersStatuses() {
    return apiClient.get('/ecpf/masters-status/')
  },
  createMastersStatus(data) {
    return apiClient.post('/ecpf/masters-status/', data)
  },
  getMastersStatus(id) {
    return apiClient.get(`/ecpf/masters-status/${id}/`)
  },
  updateMastersStatus(id, data) {
    return apiClient.put(`/ecpf/masters-status/${id}/`, data)
  },
  patchMastersStatus(id, data) {
    return apiClient.patch(`/ecpf/masters-status/${id}/`, data)
  },
  deleteMastersStatus(id) {
    return apiClient.delete(`/ecpf/masters-status/${id}/`)
  },

  // Masters Type of Firm
  getMastersTypesOfFirm() {
    return apiClient.get('/ecpf/masters-type-of-firm/')
  },
  createMastersTypeOfFirm(data) {
    return apiClient.post('/ecpf/masters-type-of-firm/', data)
  },
  getMastersTypeOfFirm(id) {
    return apiClient.get(`/ecpf/masters-type-of-firm/${id}/`)
  },
  updateMastersTypeOfFirm(id, data) {
    return apiClient.put(`/ecpf/masters-type-of-firm/${id}/`, data)
  },
  patchMastersTypeOfFirm(id, data) {
    return apiClient.patch(`/ecpf/masters-type-of-firm/${id}/`, data)
  },
  deleteMastersTypeOfFirm(id) {
    return apiClient.delete(`/ecpf/masters-type-of-firm/${id}/`)
  },
}
