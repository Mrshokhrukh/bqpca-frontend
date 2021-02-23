import apiClient from './apiClient'

export default {
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


  // Get all COGS applications
  getBmhcCogs(params = {}) {
    return apiClient.get('/bmhc/bmhc-cogs/', { params })
  },
  // Create new COGS application
  createBmhcCogs(data) {
    return apiClient.post('/bmhc/bmhc-cogs/', data)
  },
  // Get single COGS application by ID
  getBmhcCogsById(id) {
    return apiClient.get(`/bmhc/bmhc-cogs/${id}/`)
  },
  // Update COGS application (full update)
  updateBmhcCogs(id, data) {
    return apiClient.put(`/bmhc/bmhc-cogs/${id}/`, data)
  },
  // Partial update COGS application
  patchBmhcCogs(id, data) {
    return apiClient.patch(`/bmhc/bmhc-cogs/${id}/`, data)
  },
  // Delete COGS application
  deleteBmhcCogs(id) {
    return apiClient.delete(`/bmhc/bmhc-cogs/${id}/`)
  },
  getBmhcCogsByCid(cid) {
    return apiClient.get(`/bmhc/bmhc-cogs/verify-cogs/?cid=${cid}`)
  },

  // For pagination with full URLs
  getBmhcCogsWithUrl(url) {
    return apiClient.get(url)
  },

  getBmhcCogsAgencies() {
    return apiClient.get('/bmhc/masters-cogs-agencies/')
  },
  createBmhcCogsAgency(data) {
    return apiClient.post('/bmhc/masters-cogs-agencies/', data)
  },
  getBmhcCogsAgency(id) {
    return apiClient.get(`/bmhc/masters-cogs-agencies/${id}/`)
  },
  updateBmhcCogsAgency(id, data) {
    return apiClient.put(`/bmhc/masters-cogs-agencies/${id}/`, data)
  },
  patchBmhcCogsAgency(id, data) {
    return apiClient.patch(`/bmhc/masters-cogs-agencies/${id}/`, data)
  },
  deleteBmhcCogsAgency(id) {
    return apiClient.delete(`/bmhc/masters-cogs-agencies/${id}/`)
  },

  // COGS Departments
  getBmhcCogsDepartments() {
    return apiClient.get('/bmhc/masters-cogs-departments/')
  },
  createBmhcCogsDepartment(data) {
    return apiClient.post('/bmhc/masters-cogs-departments/', data)
  },
  getBmhcCogsDepartment(id) {
    return apiClient.get(`/bmhc/masters-cogs-departments/${id}/`)
  },
  updateBmhcCogsDepartment(id, data) {
    return apiClient.put(`/bmhc/masters-cogs-departments/${id}/`, data)
  },
  patchBmhcCogsDepartment(id, data) {
    return apiClient.patch(`/bmhc/masters-cogs-departments/${id}/`, data)
  },
  deleteBmhcCogsDepartment(id) {
    return apiClient.delete(`/bmhc/masters-cogs-departments/${id}/`)
  },

  // COGS Workplaces
  getBmhcCogsWorkplaces() {
    return apiClient.get('/bmhc/masters-cogs-workplaces/')
  },
  createBmhcCogsWorkplace(data) {
    return apiClient.post('/bmhc/masters-cogs-workplaces/', data)
  },
  getBmhcCogsWorkplace(id) {
    return apiClient.get(`/bmhc/masters-cogs-workplaces/${id}/`)
  },
  updateBmhcCogsWorkplace(id, data) {
    return apiClient.put(`/bmhc/masters-cogs-workplaces/${id}/`, data)
  },
  patchBmhcCogsWorkplace(id, data) {
    return apiClient.patch(`/bmhc/masters-cogs-workplaces/${id}/`, data)
  },
  deleteBmhcCogsWorkplace(id) {
    return apiClient.delete(`/bmhc/masters-cogs-workplaces/${id}/`)
  },

  // BMHC Application Endpoints
  getBhmcNewApplications() {
    return apiClient.get('/bmhc/bmhc-new-application/')
  },
  createBhmcNewApplication(data) {
    return apiClient.post('/bmhc/bmhc-new-application/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  getBhmcNewApplication(id) {
    return apiClient.get(`/bmhc/bmhc-new-application/${id}/`)
  },
  updateBhmcNewApplication(id, data) {
    return apiClient.put(`/bmhc/bmhc-new-application/${id}/`, data)
  },
  patchBhmcNewApplication(id, data) {
    return apiClient.patch(`/bmhc/bmhc-new-application/${id}/`, data)
  },
  deleteBhmcNewApplication(id) {
    return apiClient.delete(`/bmhc/bmhc-new-application/${id}/`)
  },
  getApplicationsByCid(cid) {
    return apiClient.get(`/bmhc/bmhc-get-application-list/get_by_cid/?cid=${cid}`)
  },
  getFullApplicationListByCid(cid) {
    return apiClient.get(`/bmhc/bmhc-new-application/?cid=${cid}`)
  },

  
  // BMHC Renewals Endpoints
  getBhmcRenewals() {
    return apiClient.get('/bmhc/bmhc-renewals/')
  },
  createBhmcRenewal(data) {
    return apiClient.post('/bmhc/bmhc-renewals/', data)
  },
  getBhmcRenewal(id) {
    return apiClient.get(`/bmhc/bmhc-renewals/${id}/`)
  },
  updateBhmcRenewal(id, data) {
    return apiClient.put(`/bmhc/bmhc-renewals/${id}/`, data)
  },
  patchBhmcRenewal(id, data) {
    return apiClient.patch(`/bmhc/bmhc-renewals/${id}/`, data)
  },
  deleteBhmcRenewal(id) {
    return apiClient.delete(`/bmhc/bmhc-renewals/${id}/`)
  },

  // BHMC user qualifications
  getBhmcNewQualifications() {
    return apiClient.get('/bmhc/bmhc-new-qualification/')
  },
  createBhmcNewQualification(data) {
    return apiClient.post('/bmhc/bmhc-new-qualification/', data)
  },
  getBhmcNewQualification(id) {
    return apiClient.get(`/bmhc/bmhc-new-qualification/${id}/`)
  },
  updateBhmcNewQualification(id, data) {
    return apiClient.put(`/bmhc/bmhc-new-qualification/${id}/`, data)
  },
  patchBhmcNewQualification(id, data) {
    return apiClient.patch(`/bmhc/bmhc-new-qualification/${id}/`, data)
  },
  deleteBhmcNewQualification(id) {
    return apiClient.delete(`/bmhc/bmhc-new-qualification/${id}/`)
  },

  // BMHC Capa
  getBmhcCapas() {
    return apiClient.get('/bmhc/bmhc-capa/')
  },
  createBmhcCapa(data) {
    return apiClient.post('/bmhc/bmhc-capa/', data)
  },
  getBmhcCapa(id) {
    return apiClient.get(`/bmhc/bmhc-capa/${id}/`)
  },
  updateBmhcCapa(id, data) {
    return apiClient.put(`/bmhc/bmhc-capa/${id}/`, data)
  },
  patchBmhcCapa(id, data) {
    return apiClient.patch(`/bmhc/bmhc-capa/${id}/`, data)
  },
  deleteBmhcCapa(id) {
    return apiClient.delete(`/bmhc/bmhc-capa/${id}/`)
  },
  //cpd providng agency
  getProvidingAgency() {
    return apiClient.get('/bmhc/bmhc-cpd-providing-agencies/')
  },
  //cpd reason for condutiong agency
  getReasonForCoducting() {
    return apiClient.get('/bmhc/bmhc-cpd-reasons-for-conducting/')
  },

  // BMHC Institute Departments
  getBmhcInstituteDepartments() {
    return apiClient.get('/bmhc/bmhc-institute-departments/')
  },
  createBmhcInstituteDepartment(data) {
    return apiClient.post('/bmhc/bmhc-institute-departments/', data)
  },
  getBmhcInstituteDepartment(id) {
    return apiClient.get(`/bmhc/bmhc-institute-departments/${id}/`)
  },
  updateBmhcInstituteDepartment(id, data) {
    return apiClient.put(`/bmhc/bmhc-institute-departments/${id}/`, data)
  },
  patchBmhcInstituteDepartment(id, data) {
    return apiClient.patch(`/bmhc/bmhc-institute-departments/${id}/`, data)
  },
  deleteBmhcInstituteDepartment(id) {
    return apiClient.delete(`/bmhc/bmhc-institute-departments/${id}/`)
  },

  // BMHC Institute Staff
  getBmhcInstituteStaff() {
    return apiClient.get('/bmhc/bmhc-institute-staff/')
  },
  createBmhcInstituteStaff(data) {
    return apiClient.post('/bmhc/bmhc-institute-staff/', data)
  },
  updateBmhcInstituteStaff(id, data) {
    return apiClient.put(`/bmhc/bmhc-institute-staff/${id}/`, data)
  },
  patchBmhcInstituteStaff(id, data) {
    return apiClient.patch(`/bmhc/bmhc-institute-staff/${id}/`, data)
  },
  deleteBmhcInstituteStaff(id) {
    return apiClient.delete(`/bmhc/bmhc-institute-staff/${id}/`)
  },

  // BMHC Institutes
  getBmhcInstitutes() {
    return apiClient.get('/bmhc/bmhc-institutes/')
  },
  createBmhcInstitute(data) {
    return apiClient.post('/bmhc/bmhc-institutes/', data)
  },
  getBmhcInstitute(id) {
    return apiClient.get(`/bmhc/bmhc-institutes/${id}/`)
  },
  updateBmhcInstitute(id, data) {
    return apiClient.put(`/bmhc/bmhc-institutes/${id}/`, data)
  },
  patchBmhcInstitute(id, data) {
    return apiClient.patch(`/bmhc/bmhc-institutes/${id}/`, data)
  },
  deleteBmhcInstitute(id) {
    return apiClient.delete(`/bmhc/bmhc-institutes/${id}/`)
  },
  // BMHC CPD Records
  getBmhcCpdRecords() {
    return apiClient.get('/bmhc/bmhc-cpd-records/')
  },
  createBmhcCpdRecord(data) {
    return apiClient.post('/bmhc/bmhc-cpd-records/', data)
  },
  getBmhcCpdRecord(id) {
    return apiClient.get(`/bmhc/bmhc-cpd-records/${id}/`)
  },
  updateBmhcCpdRecord(id, data) {
    return apiClient.put(`/bmhc/bmhc-cpd-records/${id}/`, data)
  },
  patchBmhcCpdRecord(id, data) {
    return apiClient.patch(`/bmhc/bmhc-cpd-records/${id}/`, data)
  },
  deleteBmhcCpdRecord(id) {
    return apiClient.delete(`/bmhc/bmhc-cpd-records/${id}/`)
  },

  // get cpd records based on cid
  getBmhcCpdRecordsByCid(cid) {
    return apiClient.get(`/bmhc/bmhc-cpd-records/list-my-cpd/?cid=${cid}`)
  },
}
