import apiClient from './apiClient'

export default {
  getMastersCmeActivities() {
    return apiClient.get('/mhpc/masters-cme-activities/')
  },
  createMastersCmeActivity(data) {
    return apiClient.post('/mhpc/masters-cme-activities/', data)
  },
  getMastersCmeActivity(id) {
    return apiClient.get(`/mhpc/masters-cme-activities/${id}/`)
  },
  updateMastersCmeActivity(id, data) {
    return apiClient.put(`/mhpc/masters-cme-activities/${id}/`, data)
  },
  patchMastersCmeActivity(id, data) {
    return apiClient.patch(`/mhpc/masters-cme-activities/${id}/`, data)
  },
  deleteMastersCmeActivity(id) {
    return apiClient.delete(`/mhpc/masters-cme-activities/${id}/`)
  },

  // Masters CME Credits
  getMastersCmeCredits() {
    return apiClient.get('/mhpc/masters-cme-credits/')
  },
  createMastersCmeCredit(data) {
    return apiClient.post('/mhpc/masters-cme-credits/', data)
  },

  getMastersCmeCredit(id) {
    return apiClient.get(`/mhpc/masters-cme-credits/${id}/`)
  },
  updateMastersCmeCredit(id, data) {
    return apiClient.put(`/mhpc/masters-cme-credits/${id}/`, data)
  },
  patchMastersCmeCredit(id, data) {
    return apiClient.patch(`/mhpc/masters-cme-credits/${id}/`, data)
  },
  deleteMastersCmeCredit(id) {
    return apiClient.delete(`/mhpc/masters-cme-credits/${id}/`)
  },

  // Masters CME Methodologies
  getMastersCmeMethodologies() {
    return apiClient.get('/mhpc/masters-cme-methodologies/')
  },
  createMastersCmeMethodology(data) {
    return apiClient.post('/mhpc/masters-cme-methodologies/', data)
  },
  getMastersCmeMethodology(id) {
    return apiClient.get(`/mhpc/masters-cme-methodologies/${id}/`)
  },
  updateMastersCmeMethodology(id, data) {
    return apiClient.put(`/mhpc/masters-cme-methodologies/${id}/`, data)
  },
  patchMastersCmeMethodology(id, data) {
    return apiClient.patch(`/mhpc/masters-cme-methodologies/${id}/`, data)
  },
  deleteMastersCmeMethodology(id) {
    return apiClient.delete(`/mhpc/masters-cme-methodologies/${id}/`)
  },

  // Masters CPD Activity
  getMastersCpdActivities() {
    return apiClient.get('/mhpc/masters-cpd-activity/')
  },
  createMastersCpdActivity(data) {
    return apiClient.post('/mhpc/masters-cpd-activity/', data)
  },
  getMastersCpdActivity(id) {
    return apiClient.get(`/mhpc/masters-cpd-activity/${id}/`)
  },
  updateMastersCpdActivity(id, data) {
    return apiClient.put(`/mhpc/masters-cpd-activity/${id}/`, data)
  },
  patchMastersCpdActivity(id, data) {
    return apiClient.patch(`/mhpc/masters-cpd-activity/${id}/`, data)
  },
  deleteMastersCpdActivity(id) {
    return apiClient.delete(`/mhpc/masters-cpd-activity/${id}/`)
  },

  // Masters Document Types
  getMastersDocumentTypes() {
    return apiClient.get('/mhpc/masters-document-types/')
  },
  createMastersDocumentType(data) {
    return apiClient.post('/mhpc/masters-document-types/', data)
  },
  getMastersDocumentType(id) {
    return apiClient.get(`/mhpc/masters-document-types/${id}/`)
  },
  updateMastersDocumentType(id, data) {
    return apiClient.put(`/mhpc/masters-document-types/${id}/`, data)
  },
  patchMastersDocumentType(id, data) {
    return apiClient.patch(`/mhpc/masters-document-types/${id}/`, data)
  },
  deleteMastersDocumentType(id) {
    return apiClient.delete(`/mhpc/masters-document-types/${id}/`)
  },

  // Masters E-Signatures
  getBmhCMastersESignatures() {
    return apiClient.get('/mhpc/masters-e-signatures/')
  },
  createBmhCMastersESignature(data) {
    return apiClient.post('/mhpc/masters-e-signatures/', data)
  },
  getBmhCMastersESignature(id) {
    return apiClient.get(`/mhpc/masters-e-signatures/${id}/`)
  },
  updateBmhCMastersESignature(id, data) {
    return apiClient.put(`/mhpc/masters-e-signatures/${id}/`, data)
  },
  patchBmhCMastersESignature(id, data) {
    return apiClient.patch(`/mhpc/masters-e-signatures/${id}/`, data)
  },
  deleteBmhCMastersESignature(id) {
    return apiClient.delete(`/mhpc/masters-e-signatures/${id}/`)
  },

  // Masters Fee Structures
  getMastersFeeStructures() {
    return apiClient.get('/mhpc/masters-fee-structures/')
  },
  createMastersFeeStructure(data) {
    return apiClient.post('/mhpc/masters-fee-structures/', data)
  },
  getMastersFeeStructure(id) {
    return apiClient.get(`/mhpc/masters-fee-structures/${id}/`)
  },
  updateMastersFeeStructure(id, data) {
    return apiClient.put(`/mhpc/masters-fee-structures/${id}/`, data)
  },
  patchMastersFeeStructure(id, data) {
    return apiClient.patch(`/mhpc/masters-fee-structures/${id}/`, data)
  },
  deleteMastersFeeStructure(id) {
    return apiClient.delete(`/mhpc/masters-fee-structures/${id}/`)
  },

  // Masters Fees Associated For
  getMastersFeesAssociatedFor() {
    return apiClient.get('/mhpc/masters-fees-associated-for/')
  },
  createMastersFeesAssociatedFor(data) {
    return apiClient.post('/mhpc/masters-fees-associated-for/', data)
  },
  updateMastersFeesAssociatedFor(id, data) {
    return apiClient.put(`/mhpc/masters-fees-associated-for/${id}/`, data)
  },
  patchMastersFeesAssociatedFor(id, data) {
    return apiClient.patch(`/mhpc/masters-fees-associated-for/${id}/`, data)
  },
  deleteMastersFeesAssociatedFor(id) {
    return apiClient.delete(`/mhpc/masters-fees-associated-for/${id}/`)
  },

  // Masters File Types
  getMastersFileTypes() {
    return apiClient.get('/mhpc/masters-file-types/')
  },
  createMastersFileType(data) {
    return apiClient.post('/mhpc/masters-file-types/', data)
  },
  getMastersFileType(id) {
    return apiClient.get(`/mhpc/masters-file-types/${id}/`)
  },
  updateMastersFileType(id, data) {
    return apiClient.put(`/mhpc/masters-file-types/${id}/`, data)
  },
  patchMastersFileType(id, data) {
    return apiClient.patch(`/mhpc/masters-file-types/${id}/`, data)
  },
  deleteMastersFileType(id) {
    return apiClient.delete(`/mhpc/masters-file-types/${id}/`)
  },
  // Masters Participation Category
  getMastersMHPCParticipationCategories() {
    return apiClient.get('/mhpc/masters-participation-category/')
  },
  createMastersParticipationCategory(data) {
    return apiClient.post('/mhpc/masters-participation-category/', data)
  },
  getMastersParticipationCategory(id) {
    return apiClient.get(`/mhpc/masters-participation-category/${id}/`)
  },
  updateMastersParticipationCategory(id, data) {
    return apiClient.put(`/mhpc/masters-participation-category/${id}/`, data)
  },
  patchMastersParticipationCategory(id, data) {
    return apiClient.patch(`/mhpc/masters-participation-category/${id}/`, data)
  },
  deleteMastersParticipationCategory(id) {
    return apiClient.delete(`/mhpc/masters-participation-category/${id}/`)
  },

  // Masters Participation Sub Category
  getMastersMhpcParticipationSubCategories() {
    return apiClient.get('/mhpc/masters-participation-sub-category/')
  },
  createMastersParticipationSubCategory(data) {
    return apiClient.post('/mhpc/masters-participation-sub-category/', data)
  },
  getMastersParticipationSubCategory(id) {
    return apiClient.get(`/mhpc/masters-participation-sub-category/${id}/`)
  },
  updateMastersParticipationSubCategory(id, data) {
    return apiClient.put(`/mhpc/masters-participation-sub-category/${id}/`, data)
  },
  patchMastersParticipationSubCategory(id, data) {
    return apiClient.patch(`/mhpc/masters-participation-sub-category/${id}/`, data)
  },
  deleteMastersParticipationSubCategory(id) {
    return apiClient.delete(`/mhpc/masters-participation-sub-category/${id}/`)
  },

  // Masters Personnel Categories
  getMastersPersonnelCategories() {
    return apiClient.get('/mhpc/masters-personnel-categories/')
  },
  createMastersPersonnelCategory(data) {
    return apiClient.post('/mhpc/masters-personnel-categories/', data)
  },
  getMastersPersonnelCategory(id) {
    return apiClient.get(`/mhpc/masters-personnel-categories/${id}/`)
  },
  updateMastersPersonnelCategory(id, data) {
    return apiClient.put(`/mhpc/masters-personnel-categories/${id}/`, data)
  },
  patchMastersPersonnelCategory(id, data) {
    return apiClient.patch(`/mhpc/masters-personnel-categories/${id}/`, data)
  },
  deleteMastersPersonnelCategory(id) {
    return apiClient.delete(`/mhpc/masters-personnel-categories/${id}/`)
  },

  // Masters Qualification Types
  getMastersQualificationTypes() {
    return apiClient.get('/mhpc/masters-qualification-types/')
  },
  createMastersQualificationType(data) {
    return apiClient.post('/mhpc/masters-qualification-types/', data)
  },
  getMastersQualificationType(id) {
    return apiClient.get(`/mhpc/masters-qualification-types/${id}/`)
  },
  updateMastersQualificationType(id, data) {
    return apiClient.put(`/mhpc/masters-qualification-types/${id}/`, data)
  },
  patchMastersQualificationType(id, data) {
    return apiClient.patch(`/mhpc/masters-qualification-types/${id}/`, data)
  },
  deleteMastersQualificationType(id) {
    return apiClient.delete(`/mhpc/masters-qualification-types/${id}/`)
  },

  // Masters Qualifications
  getBmhCMastersQualifications() {
    return apiClient.get('/mhpc/masters-qualifications/')
  },
  createBmhCMastersQualification(data) {
    return apiClient.post('/mhpc/masters-qualifications/', data)
  },
  getBmhCMastersQualification(id) {
    return apiClient.get(`/mhpc/masters-qualifications/${id}/`)
  },
  updateBmhCMastersQualification(id, data) {
    return apiClient.put(`/mhpc/masters-qualifications/${id}/`, data)
  },
  patchBmhCMastersQualification(id, data) {
    return apiClient.patch(`/mhpc/masters-qualifications/${id}/`, data)
  },
  deleteBmhCMastersQualification(id) {
    return apiClient.delete(`/mhpc/masters-qualifications/${id}/`)
  },

  // Masters Registration Type
  getMastersRegistrationTypes() {
    return apiClient.get('/mhpc/masters-registration-type/')
  },
  createMastersRegistrationType(data) {
    return apiClient.post('/mhpc/masters-registration-type/', data)
  },
  getMastersRegistrationType(id) {
    return apiClient.get(`/mhpc/masters-registration-type/${id}/`)
  },
  updateMastersRegistrationType(id, data) {
    return apiClient.put(`/mhpc/masters-registration-type/${id}/`, data)
  },
  patchMastersRegistrationType(id, data) {
    return apiClient.patch(`/mhpc/masters-registration-type/${id}/`, data)
  },
  deleteMastersRegistrationType(id) {
    return apiClient.delete(`/mhpc/masters-registration-type/${id}/`)
  },

  // Masters Sector
  getMastersSectors() {
    return apiClient.get('/mhpc/masters-sector/')
  },
  createMastersSector(data) {
    return apiClient.post('/mhpc/masters-sector/', data)
  },
  getMastersSector(id) {
    return apiClient.get(`/mhpc/masters-sector/${id}/`)
  },
  updateMastersSector(id, data) {
    return apiClient.put(`/mhpc/masters-sector/${id}/`, data)
  },
  patchMastersSector(id, data) {
    return apiClient.patch(`/mhpc/masters-sector/${id}/`, data)
  },
  deleteMastersSector(id) {
    return apiClient.delete(`/mhpc/masters-sector/${id}/`)
  },

  // Masters Sub Categories
  getMastersSubCategories() {
    return apiClient.get('/mhpc/masters-sub-categories/')
  },
  createMastersSubCategory(data) {
    return apiClient.post('/mhpc/masters-sub-categories/', data)
  },
  getMastersSubCategory(id) {
    return apiClient.get(`/mhpc/masters-sub-categories/${id}/`)
  },
  updateMastersSubCategory(id, data) {
    return apiClient.put(`/mhpc/masters-sub-categories/${id}/`, data)
  },
  patchMastersSubCategory(id, data) {
    return apiClient.patch(`/mhpc/masters-sub-categories/${id}/`, data)
  },
  deleteMastersSubCategory(id) {
    return apiClient.delete(`/mhpc/masters-sub-categories/${id}/`)
  },

  // Masters University
  getMastersUniversities() {
    return apiClient.get('/mhpc/masters-university/')
  },
  createMastersUniversity(data) {
    return apiClient.post('/mhpc/masters-university/', data)
  },
  getMastersUniversity(id) {
    return apiClient.get(`/mhpc/masters-university/${id}/`)
  },
  updateMastersUniversity(id, data) {
    return apiClient.put(`/mhpc/masters-university/${id}/`, data)
  },
  patchMastersUniversity(id, data) {
    return apiClient.patch(`/mhpc/masters-university/${id}/`, data)
  },
  deleteMastersUniversity(id) {
    return apiClient.delete(`/mhpc/masters-university/${id}/`)
  },
  // Generic function to fetch master data
  getMasterData(masterDataType) {
    let endpoint = ''
    switch (masterDataType) {
      case 'personnel-categories':
        endpoint = '/mhpc/masters-personnel-categories/'
        break
      case 'personnel-subcategories':
        endpoint = '/mhpc/masters-sub-categories/'
        break
      case 'sectors':
        endpoint = '/mhpc/masters-sector/'
        break
      default:
        console.error(
          `Master data type "${masterDataType}" is not supported in getMasterData function.`,
        )
        return Promise.reject(`Master data type "${masterDataType}" is not supported.`)
    }
    return apiClient.get(endpoint)
  },
  //

  // Get all COGS applications
  getMhpcCogs(params = {}) {
    return apiClient.get('/mhpc/mhpc-cogs/', { params })
  },
  // Create new COGS application
  createMhpcCogs(data) {
    return apiClient.post('/mhpc/mhpc-cogs/', data)
  },
  // Get single COGS application by ID
  getMhpcCogsById(id) {
    return apiClient.get(`/mhpc/mhpc-cogs/${id}/`)
  },
  // Update COGS application (full update)
  updateMhpcCogs(id, data) {
    return apiClient.put(`/mhpc/mhpc-cogs/${id}/`, data)
  },
  // Partial update COGS application
  patchMhpcCogs(id, data) {
    return apiClient.patch(`/mhpc/mhpc-cogs/${id}/`, data)
  },
  // Delete COGS application
  deleteMhpcCogs(id) {
    return apiClient.delete(`/mhpc/mhpc-cogs/${id}/`)
  },
  getMhpcCogsByCid(cid) {
    return apiClient.get(`/mhpc/mhpc-cogs/verify-cogs/?cid=${cid}`)
  },

  // For pagination with full URLs
  getMhpcCogsWithUrl(url) {
    return apiClient.get(url)
  },

  getMhpcCogsAgencies() {
    return apiClient.get('/mhpc/masters-cogs-agencies/')
  },
  createMhpcCogsAgency(data) {
    return apiClient.post('/mhpc/masters-cogs-agencies/', data)
  },
  getMhpcCogsAgency(id) {
    return apiClient.get(`/mhpc/masters-cogs-agencies/${id}/`)
  },
  updateMhpcCogsAgency(id, data) {
    return apiClient.put(`/mhpc/masters-cogs-agencies/${id}/`, data)
  },
  patchMhpcCogsAgency(id, data) {
    return apiClient.patch(`/mhpc/masters-cogs-agencies/${id}/`, data)
  },
  deleteMhpcCogsAgency(id) {
    return apiClient.delete(`/mhpc/masters-cogs-agencies/${id}/`)
  },

  // COGS Departments
  getMhpcCogsDepartments() {
    return apiClient.get('/mhpc/masters-cogs-departments/')
  },
  createMhpcCogsDepartment(data) {
    return apiClient.post('/mhpc/masters-cogs-departments/', data)
  },
  getMhpcCogsDepartment(id) {
    return apiClient.get(`/mhpc/masters-cogs-departments/${id}/`)
  },
  updateMhpcCogsDepartment(id, data) {
    return apiClient.put(`/mhpc/masters-cogs-departments/${id}/`, data)
  },
  patchMhpcCogsDepartment(id, data) {
    return apiClient.patch(`/mhpc/masters-cogs-departments/${id}/`, data)
  },
  deleteMhpcCogsDepartment(id) {
    return apiClient.delete(`/mhpc/masters-cogs-departments/${id}/`)
  },

  // COGS Workplaces
  getMhpcCogsWorkplaces() {
    return apiClient.get('/mhpc/masters-cogs-workplaces/')
  },
  createMhpcCogsWorkplace(data) {
    return apiClient.post('/mhpc/masters-cogs-workplaces/', data)
  },
  getMhpcCogsWorkplace(id) {
    return apiClient.get(`/mhpc/masters-cogs-workplaces/${id}/`)
  },
  updateMhpcCogsWorkplace(id, data) {
    return apiClient.put(`/mhpc/masters-cogs-workplaces/${id}/`, data)
  },
  patchMhpcCogsWorkplace(id, data) {
    return apiClient.patch(`/mhpc/masters-cogs-workplaces/${id}/`, data)
  },
  deleteMhpcCogsWorkplace(id) {
    return apiClient.delete(`/mhpc/masters-cogs-workplaces/${id}/`)
  },

  // BMHC Application Endpoints
  getMhpcNewApplications() {
    return apiClient.get('/mhpc/mhpc-new-application/')
  },
  createMhpcNewApplication(data) {
    return apiClient.post('/mhpc/mhpc-new-application/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  getMhpcNewApplication(id) {
    return apiClient.get(`/mhpc/mhpc-new-application/${id}/`)
  },
  updateMhpcNewApplication(id, data) {
    return apiClient.put(`/mhpc/mhpc-new-application/${id}/`, data)
  },
  patchMhpcNewApplication(id, data) {
    return apiClient.patch(`/mhpc/mhpc-new-application/${id}/`, data)
  },
  deleteMhpcNewApplication(id) {
    return apiClient.delete(`/mhpc/mhpc-new-application/${id}/`)
  },
  getMhpcApplicationsByCid(cid) {
    return apiClient.get(`/mhpc/mhpc-get-application-list/get_by_cid/?cid=${cid}`)
  },
  getMhpcFullApplicationListByCid(cid) {
    return apiClient.get(`/mhpc/mhpc-new-application/?cid=${cid}`)
  },

  // BMHC Renewals Endpoints
  getMhpcRenewals() {
    return apiClient.get('/mhpc/mhpc-renewals/')
  },
  createMhpcRenewal(data) {
    return apiClient.post('/mhpc/mhpc-renewals/', data)
  },
  getMhpcRenewal(id) {
    return apiClient.get(`/mhpc/mhpc-renewals/${id}/`)
  },
  updateMhpcRenewal(id, data) {
    return apiClient.put(`/mhpc/mhpc-renewals/${id}/`, data)
  },
  patchMhpcRenewal(id, data) {
    return apiClient.patch(`/mhpc/mhpc-renewals/${id}/`, data)
  },
  deleteMhpcRenewal(id) {
    return apiClient.delete(`/mhpc/mhpc-renewals/${id}/`)
  },

  // BHMC user qualifications
  getMhpcNewQualifications() {
    return apiClient.get('/mhpc/mhpc-new-qualification/')
  },
  createMhpcNewQualification(data) {
    return apiClient.post('/mhpc/mhpc-new-qualification/', data)
  },
  getMhpcNewQualification(id) {
    return apiClient.get(`/mhpc/mhpc-new-qualification/${id}/`)
  },
  updateMhpcNewQualification(id, data) {
    return apiClient.put(`/mhpc/mhpc-new-qualification/${id}/`, data)
  },
  patchMhpcNewQualification(id, data) {
    return apiClient.patch(`/mhpc/mhpc-new-qualification/${id}/`, data)
  },
  deleteMhpcNewQualification(id) {
    return apiClient.delete(`/mhpc/mhpc-new-qualification/${id}/`)
  },

  // BMHC Capa
  getMhpcCapas() {
    return apiClient.get('/mhpc/mhpc-capa/')
  },
  createMhpcCapa(data) {
    return apiClient.post('/mhpc/mhpc-capa/', data)
  },
  getMhpcCapa(id) {
    return apiClient.get(`/mhpc/mhpc-capa/${id}/`)
  },
  updateMhpcCapa(id, data) {
    return apiClient.put(`/mhpc/mhpc-capa/${id}/`, data)
  },
  patchMhpcCapa(id, data) {
    return apiClient.patch(`/mhpc/mhpc-capa/${id}/`, data)
  },
  deleteMhpcCapa(id) {
    return apiClient.delete(`/mhpc/mhpc-capa/${id}/`)
  },
  //cpd providng agency
  getProvidingAgency() {
    return apiClient.get('/mhpc/mhpc-cpd-providing-agencies/')
  },
  //cpd reason for condutiong agency
  getReasonForCoducting() {
    return apiClient.get('/mhpc/mhpc-cpd-reasons-for-conducting/')
  },

  // BMHC Institute Departments
  getMhpcInstituteDepartments() {
    return apiClient.get('/mhpc/mhpc-institute-departments/')
  },
  createMhpcInstituteDepartment(data) {
    return apiClient.post('/mhpc/mhpc-institute-departments/', data)
  },
  getMhpcInstituteDepartment(id) {
    return apiClient.get(`/mhpc/mhpc-institute-departments/${id}/`)
  },
  updateMhpcInstituteDepartment(id, data) {
    return apiClient.put(`/mhpc/mhpc-institute-departments/${id}/`, data)
  },
  patchMhpcInstituteDepartment(id, data) {
    return apiClient.patch(`/mhpc/mhpc-institute-departments/${id}/`, data)
  },
  deleteMhpcInstituteDepartment(id) {
    return apiClient.delete(`/mhpc/mhpc-institute-departments/${id}/`)
  },

  // BMHC Institute Staff
  getMhpcInstituteStaff() {
    return apiClient.get('/mhpc/mhpc-institute-staff/')
  },
  createMhpcInstituteStaff(data) {
    return apiClient.post('/mhpc/mhpc-institute-staff/', data)
  },
  updateMhpcInstituteStaff(id, data) {
    return apiClient.put(`/mhpc/mhpc-institute-staff/${id}/`, data)
  },
  patchMhpcInstituteStaff(id, data) {
    return apiClient.patch(`/mhpc/mhpc-institute-staff/${id}/`, data)
  },
  deleteMhpcInstituteStaff(id) {
    return apiClient.delete(`/mhpc/mhpc-institute-staff/${id}/`)
  },

  // BMHC Institutes
  getMhpcInstitutes() {
    return apiClient.get('/mhpc/mhpc-institutes/')
  },
  createMhpcInstitute(data) {
    return apiClient.post('/mhpc/mhpc-institutes/', data)
  },
  getMhpcInstitute(id) {
    return apiClient.get(`/mhpc/mhpc-institutes/${id}/`)
  },
  updateMhpcInstitute(id, data) {
    return apiClient.put(`/mhpc/mhpc-institutes/${id}/`, data)
  },
  patchMhpcInstitute(id, data) {
    return apiClient.patch(`/mhpc/mhpc-institutes/${id}/`, data)
  },

  deleteMhpcInstitute(id) {
    return apiClient.delete(`/mhpc/mhpc-institutes/${id}/`)
  },
  //BMHC COUrses api
  getMhpcCourseDetails() {
    return apiClient.get('/mhpc/mhpc-course-details/')
  },
  createMhpcCourseDetail(data) {
    return apiClient.post('/mhpc/mhpc-course-details/', data)
  },
  getMhpcCourseDetail(id) {
    return apiClient.get(`/mhpc/mhpc-course-details/${id}/`)
  },
  updateMhpcCourseDetail(id, data) {
    return apiClient.put(`/mhpc/mhpc-course-details/${id}/`, data)
  },
  patchMhpcCourseDetail(id, data) {
    return apiClient.patch(`/mhpc/mhpc-course-details/${id}/`, data)
  },
  deleteMhpcCourseDetail(id) {
    return apiClient.delete(`/mhpc/mhpc-course-details/${id}/`)
  },
  // BMHC Teaching Center
  getMhpcTeachingCenters() {
    return apiClient.get('/mhpc/mhpc-teaching-centers/')
  },
  createMhpcTeachingCenter(data) {
    return apiClient.post('/mhpc/mhpc-teaching-centers/', data)
  },
  getMhpcTeachingCenter(id) {
    return apiClient.get(`/mhpc/mhpc-teaching-centers/${id}/`)
  },
  updateMhpcTeachingCenter(id, data) {
    return apiClient.put(`/mhpc/mhpc-teaching-centers/${id}/`, data)
  },
  patchMhpcTeachingCenter(id, data) {
    return apiClient.patch(`/mhpc/mhpc-teaching-centers/${id}/`, data)
  },
  deleteMhpcTeachingCenter(id) {
    return apiClient.delete(`/mhpc/mhpc-teaching-centers/${id}/`)
  },
  // BMHC CPD Records
  getMhpcCpdRecords() {
    return apiClient.get('/mhpc/mhpc-cpd-records/')
  },
  createMhpcCpdRecord(data) {
    return apiClient.post('/mhpc/mhpc-cpd-records/', data)
  },
  getMhpcCpdRecord(id) {
    return apiClient.get(`/mhpc/mhpc-cpd-records/${id}/`)
  },
  updateMhpcCpdRecord(id, data) {
    return apiClient.put(`/mhpc/mhpc-cpd-records/${id}/`, data)
  },
  patchMhpcCpdRecord(id, data) {
    return apiClient.patch(`/mhpc/mhpc-cpd-records/${id}/`, data)
  },
  deleteMhpcCpdRecord(id) {
    return apiClient.delete(`/mhpc/mhpc-cpd-records/${id}/`)
  },

  // get cpd records based on cid
  getMhpcCpdRecordsByCid(cid) {
    return apiClient.get(`/mhpc/mhpc-cpd-records/list-my-cpd/?cid=${cid}`)
  },

  // BMHC CPD Records
  getMhpcCpdTask() {
    return apiClient.get('/mhpc/mhpc-cpd-tasks/')
  },
  // BMHC CPD Tasks endpoints
  createMhpcCpdTask(data) {
    return apiClient.post('/mhpc/mhpc-cpd-tasks/', data)
  },
  getMhpcCpdTaskById(id) {
    return apiClient.get(`/mhpc/mhpc-cpd-tasks/${id}/`)
  },
  updateMhpcCpdTask(id, data) {
    return apiClient.put(`/mhpc/mhpc-cpd-tasks/${id}/`, data)
  },
  patchMhpcCpdTask(id, data) {
    return apiClient.patch(`/mhpc/mhpc-cpd-tasks/${id}/`, data)
  },
  deleteMhpcCpdTask(id) {
    return apiClient.delete(`/mhpc/mhpc-cpd-tasks/${id}/`)
  },
  // BMHC Counselor endpoints
  getMhpcCounsellors() {
    return apiClient.get('/mhpc/mhpc-counsellors/')
  },
  createMhpcCounsellor(data) {
    return apiClient.post('/mhpc/mhpc-counsellors/', data)
  },
  getMhpcCounsellorById(id) {
    return apiClient.get(`/mhpc/mhpc-counsellors/${id}/`)
  },
  updateMhpcCounsellor(id, data) {
    return apiClient.put(`/mhpc/mhpc-counsellors/${id}/`, data)
  },
  patchMhpcCounsellor(id, data) {
    return apiClient.patch(`/mhpc/mhpc-counsellors/${id}/`, data)
  },
  deleteMhpcCounsellor(id) {
    return apiClient.delete(`/mhpc/mhpc-counsellors/${id}/`)
  },
  // BMHC CPD Task Participants endpoints
  getMhpcCpdTaskParticipants() {
    return apiClient.get('/mhpc/mhpc-cpd-task-participants/')
  },
  createMhpcCpdTaskParticipant(data) {
    return apiClient.post('/mhpc/mhpc-cpd-task-participants/', data)
  },
  getMhpcCpdTaskParticipantById(id) {
    return apiClient.get(`/mhpc/mhpc-cpd-task-participants/${id}/`)
  },
  updateMhpcCpdTaskParticipant(id, data) {
    return apiClient.put(`/mhpc/mhpc-cpd-task-participants/${id}/`, data)
  },
  patchMhpcCpdTaskParticipant(id, data) {
    return apiClient.patch(`/mhpc/mhpc-cpd-task-participants/${id}/`, data)
  },
  deleteMhpcCpdTaskParticipant(id) {
    return apiClient.delete(`/mhpc/mhpc-cpd-task-participants/${id}/`)
  },
}
