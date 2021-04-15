import apiClient from './apiClient'

export default {
  getMhpcMastersCpdActivities() {
    return apiClient.get('/mhpc/masters-cpd-activities/')
  },
  createMhpcMastersCpdActivity(data) {
    return apiClient.post('/mhpc/masters-cpd-activities/', data)
  },
  getMhpcMastersCpdActivity(id) {
    return apiClient.get(`/mhpc/masters-cpd-activities/${id}/`)
  },
  updateMhpcMastersCpdActivity(id, data) {
    return apiClient.put(`/mhpc/masters-cpd-activities/${id}/`, data)
  },
  patchMhpcMastersCpdActivity(id, data) {
    return apiClient.patch(`/mhpc/masters-cpd-activities/${id}/`, data)
  },
  deleteMhpcMastersCpdActivity(id) {
    return apiClient.delete(`/mhpc/masters-cpd-activities/${id}/`)
  },

  // Masters CPD Credits
  getMhpcMastersCpdCredits() {
    return apiClient.get('/mhpc/masters-cpd-credits/')
  },
  createMhpcMastersCpdCredit(data) {
    return apiClient.post('/mhpc/masters-cpd-credits/', data)
  },

  getMhpcMastersCpdCredit(id) {
    return apiClient.get(`/mhpc/masters-cpd-credits/${id}/`)
  },
  updateMhpcMastersCpdCredit(id, data) {
    return apiClient.put(`/mhpc/masters-cpd-credits/${id}/`, data)
  },
  patchMhpcMastersCpdCredit(id, data) {
    return apiClient.patch(`/mhpc/masters-cpd-credits/${id}/`, data)
  },
  deleteMhpcMastersCpdCredit(id) {
    return apiClient.delete(`/mhpc/masters-cpd-credits/${id}/`)
  },

  // Masters CPD Methodologies
  getMhpcMastersCpdMethodologies() {
    return apiClient.get('/mhpc/masters-cpd-methodologies/')
  },
  createMhpcMastersCpdMethodology(data) {
    return apiClient.post('/mhpc/masters-cpd-methodologies/', data)
  },
  getMhpcMastersCpdMethodology(id) {
    return apiClient.get(`/mhpc/masters-cpd-methodologies/${id}/`)
  },
  updateMhpcMastersCpdMethodology(id, data) {
    return apiClient.put(`/mhpc/masters-cpd-methodologies/${id}/`, data)
  },
  patchMhpcMastersCpdMethodology(id, data) {
    return apiClient.patch(`/mhpc/masters-cpd-methodologies/${id}/`, data)
  },
  deleteMhpcMastersCpdMethodology(id) {
    return apiClient.delete(`/mhpc/masters-cpd-methodologies/${id}/`)
  },

  // Masters CPD Activity
  getMhpcMastersCpdActivities() {
    return apiClient.get('/mhpc/masters-cpd-activity/')
  },
  createMhpcMastersCpdActivity(data) {
    return apiClient.post('/mhpc/masters-cpd-activity/', data)
  },
  getMhpcMastersCpdActivity(id) {
    return apiClient.get(`/mhpc/masters-cpd-activity/${id}/`)
  },
  updateMhpcMastersCpdActivity(id, data) {
    return apiClient.put(`/mhpc/masters-cpd-activity/${id}/`, data)
  },
  patchMhpcMastersCpdActivity(id, data) {
    return apiClient.patch(`/mhpc/masters-cpd-activity/${id}/`, data)
  },
  deleteMhpcMastersCpdActivity(id) {
    return apiClient.delete(`/mhpc/masters-cpd-activity/${id}/`)
  },

  // Masters Document Types
  getMhpcMastersDocumentTypes() {
    return apiClient.get('/mhpc/masters-document-types/')
  },
  createMhpcMastersDocumentType(data) {
    return apiClient.post('/mhpc/masters-document-types/', data)
  },
  getMhpcMastersDocumentType(id) {
    return apiClient.get(`/mhpc/masters-document-types/${id}/`)
  },
  updateMhpcMastersDocumentType(id, data) {
    return apiClient.put(`/mhpc/masters-document-types/${id}/`, data)
  },
  patchMhpcMastersDocumentType(id, data) {
    return apiClient.patch(`/mhpc/masters-document-types/${id}/`, data)
  },
  deleteMhpcMastersDocumentType(id) {
    return apiClient.delete(`/mhpc/masters-document-types/${id}/`)
  },

  // Masters E-Signatures
  getMhpcMastersESignatures() {
    return apiClient.get('/mhpc/masters-e-signatures/')
  },
  createMhpcMastersESignature(data) {
    return apiClient.post('/mhpc/masters-e-signatures/', data)
  },
  getMhpcMastersESignature(id) {
    return apiClient.get(`/mhpc/masters-e-signatures/${id}/`)
  },
  updateMhpcMastersESignature(id, data) {
    return apiClient.put(`/mhpc/masters-e-signatures/${id}/`, data)
  },
  patchMhpcMastersESignature(id, data) {
    return apiClient.patch(`/mhpc/masters-e-signatures/${id}/`, data)
  },
  deleteMhpcMastersESignature(id) {
    return apiClient.delete(`/mhpc/masters-e-signatures/${id}/`)
  },

  // Masters Fee Structures
  getMhpcMastersFeeStructures() {
    return apiClient.get('/mhpc/masters-fee-structures/')
  },
  createMhpcMastersFeeStructure(data) {
    return apiClient.post('/mhpc/masters-fee-structures/', data)
  },
  getMhpcMastersFeeStructure(id) {
    return apiClient.get(`/mhpc/masters-fee-structures/${id}/`)
  },
  updateMhpcMastersFeeStructure(id, data) {
    return apiClient.put(`/mhpc/masters-fee-structures/${id}/`, data)
  },
  patchMhpcMastersFeeStructure(id, data) {
    return apiClient.patch(`/mhpc/masters-fee-structures/${id}/`, data)
  },
  deleteMhpcMastersFeeStructure(id) {
    return apiClient.delete(`/mhpc/masters-fee-structures/${id}/`)
  },

  // Masters Fees Associated For
  getMhpcMastersFeesAssociatedFor() {
    return apiClient.get('/mhpc/masters-fees-associated-for/')
  },
  createMhpcMastersFeesAssociatedFor(data) {
    return apiClient.post('/mhpc/masters-fees-associated-for/', data)
  },
  updateMhpcMastersFeesAssociatedFor(id, data) {
    return apiClient.put(`/mhpc/masters-fees-associated-for/${id}/`, data)
  },
  patchMhpcMastersFeesAssociatedFor(id, data) {
    return apiClient.patch(`/mhpc/masters-fees-associated-for/${id}/`, data)
  },
  deleteMhpcMastersFeesAssociatedFor(id) {
    return apiClient.delete(`/mhpc/masters-fees-associated-for/${id}/`)
  },

  // Masters File Types
  getMhpcMastersFileTypes() {
    return apiClient.get('/mhpc/masters-file-types/')
  },
  createMhpcMastersFileType(data) {
    return apiClient.post('/mhpc/masters-file-types/', data)
  },
  getMhpcMastersFileType(id) {
    return apiClient.get(`/mhpc/masters-file-types/${id}/`)
  },
  updateMhpcMastersFileType(id, data) {
    return apiClient.put(`/mhpc/masters-file-types/${id}/`, data)
  },
  patchMhpcMastersFileType(id, data) {
    return apiClient.patch(`/mhpc/masters-file-types/${id}/`, data)
  },
  deleteMhpcMastersFileType(id) {
    return apiClient.delete(`/mhpc/masters-file-types/${id}/`)
  },
  // Masters Participation Category
  getMhpcMastersMHPCParticipationCategories() {
    return apiClient.get('/mhpc/masters-participation-category/')
  },
  createMhpcMastersParticipationCategory(data) {
    return apiClient.post('/mhpc/masters-participation-category/', data)
  },
  getMhpcMastersParticipationCategory(id) {
    return apiClient.get(`/mhpc/masters-participation-category/${id}/`)
  },
  updateMhpcMastersParticipationCategory(id, data) {
    return apiClient.put(`/mhpc/masters-participation-category/${id}/`, data)
  },
  patchMhpcMastersParticipationCategory(id, data) {
    return apiClient.patch(`/mhpc/masters-participation-category/${id}/`, data)
  },
  deleteMhpcMastersParticipationCategory(id) {
    return apiClient.delete(`/mhpc/masters-participation-category/${id}/`)
  },

  // Masters Participation Sub Category
  getMhpcMastersMhpcParticipationSubCategories() {
    return apiClient.get('/mhpc/masters-participation-sub-category/')
  },
  createMhpcMastersParticipationSubCategory(data) {
    return apiClient.post('/mhpc/masters-participation-sub-category/', data)
  },
  getMhpcMastersParticipationSubCategory(id) {
    return apiClient.get(`/mhpc/masters-participation-sub-category/${id}/`)
  },
  updateMhpcMastersParticipationSubCategory(id, data) {
    return apiClient.put(`/mhpc/masters-participation-sub-category/${id}/`, data)
  },
  patchMhpcMastersParticipationSubCategory(id, data) {
    return apiClient.patch(`/mhpc/masters-participation-sub-category/${id}/`, data)
  },
  deleteMhpcMastersParticipationSubCategory(id) {
    return apiClient.delete(`/mhpc/masters-participation-sub-category/${id}/`)
  },

  // Masters Personnel Categories
  getMhpcMastersPersonnelCategories() {
    return apiClient.get('/mhpc/masters-personnel-categories/')
  },
  createMhpcMastersPersonnelCategory(data) {
    return apiClient.post('/mhpc/masters-personnel-categories/', data)
  },
  getMhpcMastersPersonnelCategory(id) {
    return apiClient.get(`/mhpc/masters-personnel-categories/${id}/`)
  },
  updateMhpcMastersPersonnelCategory(id, data) {
    return apiClient.put(`/mhpc/masters-personnel-categories/${id}/`, data)
  },
  patchMhpcMastersPersonnelCategory(id, data) {
    return apiClient.patch(`/mhpc/masters-personnel-categories/${id}/`, data)
  },
  deleteMhpcMastersPersonnelCategory(id) {
    return apiClient.delete(`/mhpc/masters-personnel-categories/${id}/`)
  },

  // Masters Qualification Types
  getMhpcMastersQualificationTypes() {
    return apiClient.get('/mhpc/masters-qualification-types/')
  },
  createMhpcMastersQualificationType(data) {
    return apiClient.post('/mhpc/masters-qualification-types/', data)
  },
  getMhpcMastersQualificationType(id) {
    return apiClient.get(`/mhpc/masters-qualification-types/${id}/`)
  },
  updateMhpcMastersQualificationType(id, data) {
    return apiClient.put(`/mhpc/masters-qualification-types/${id}/`, data)
  },
  patchMhpcMastersQualificationType(id, data) {
    return apiClient.patch(`/mhpc/masters-qualification-types/${id}/`, data)
  },
  deleteMhpcMastersQualificationType(id) {
    return apiClient.delete(`/mhpc/masters-qualification-types/${id}/`)
  },

  // Masters Qualifications
  getMhpcMastersQualifications() {
    return apiClient.get('/mhpc/masters-qualifications/')
  },
  createMhpcMastersQualification(data) {
    return apiClient.post('/mhpc/masters-qualifications/', data)
  },
  getMhpcMastersQualification(id) {
    return apiClient.get(`/mhpc/masters-qualifications/${id}/`)
  },
  updateMhpcMastersQualification(id, data) {
    return apiClient.put(`/mhpc/masters-qualifications/${id}/`, data)
  },
  patchMhpcMastersQualification(id, data) {
    return apiClient.patch(`/mhpc/masters-qualifications/${id}/`, data)
  },
  deleteMhpcMastersQualification(id) {
    return apiClient.delete(`/mhpc/masters-qualifications/${id}/`)
  },

  // Masters Registration Type
  getMhpcMastersRegistrationTypes() {
    return apiClient.get('/mhpc/masters-registration-type/')
  },
  createMhpcMastersRegistrationType(data) {
    return apiClient.post('/mhpc/masters-registration-type/', data)
  },
  getMhpcMastersRegistrationType(id) {
    return apiClient.get(`/mhpc/masters-registration-type/${id}/`)
  },
  updateMhpcMastersRegistrationType(id, data) {
    return apiClient.put(`/mhpc/masters-registration-type/${id}/`, data)
  },
  patchMhpcMastersRegistrationType(id, data) {
    return apiClient.patch(`/mhpc/masters-registration-type/${id}/`, data)
  },
  deleteMhpcMastersRegistrationType(id) {
    return apiClient.delete(`/mhpc/masters-registration-type/${id}/`)
  },

  // Masters Sector
  getMhpcMastersSectors() {
    return apiClient.get('/mhpc/masters-sector/')
  },
  createMhpcMastersSector(data) {
    return apiClient.post('/mhpc/masters-sector/', data)
  },
  getMhpcMastersSector(id) {
    return apiClient.get(`/mhpc/masters-sector/${id}/`)
  },
  updateMhpcMastersSector(id, data) {
    return apiClient.put(`/mhpc/masters-sector/${id}/`, data)
  },
  patchMhpcMastersSector(id, data) {
    return apiClient.patch(`/mhpc/masters-sector/${id}/`, data)
  },
  deleteMhpcMastersSector(id) {
    return apiClient.delete(`/mhpc/masters-sector/${id}/`)
  },

  // Masters Sub Categories
  getMhpcMastersSubCategories() {
    return apiClient.get('/mhpc/masters-sub-categories/')
  },
  createMhpcMastersSubCategory(data) {
    return apiClient.post('/mhpc/masters-sub-categories/', data)
  },
  getMhpcMastersSubCategory(id) {
    return apiClient.get(`/mhpc/masters-sub-categories/${id}/`)
  },
  updateMhpcMastersSubCategory(id, data) {
    return apiClient.put(`/mhpc/masters-sub-categories/${id}/`, data)
  },
  patchMhpcMastersSubCategory(id, data) {
    return apiClient.patch(`/mhpc/masters-sub-categories/${id}/`, data)
  },
  deleteMhpcMastersSubCategory(id) {
    return apiClient.delete(`/mhpc/masters-sub-categories/${id}/`)
  },

  // Masters University
  getMhpcMastersUniversities() {
    return apiClient.get('/mhpc/masters-university/')
  },
  createMhpcMastersUniversity(data) {
    return apiClient.post('/mhpc/masters-university/', data)
  },
  getMhpcMastersUniversity(id) {
    return apiClient.get(`/mhpc/masters-university/${id}/`)
  },
  updateMhpcMastersUniversity(id, data) {
    return apiClient.put(`/mhpc/masters-university/${id}/`, data)
  },
  patchMhpcMastersUniversity(id, data) {
    return apiClient.patch(`/mhpc/masters-university/${id}/`, data)
  },
  deleteMhpcMastersUniversity(id) {
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

  // MHPC Application Endpoints
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

  // MHPC Renewals Endpoints
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

  // MHPC user qualifications
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

  // MHPC Capa
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

  // MHPC Institute Departments
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

  // MHPC Institute Staff
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

  // MHPC Institutes
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
  //MHPC COUrses api
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
  // MHPC Teaching Center
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
  // MHPC CPD Records
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

  // MHPC CPD Records
  getMhpcCpdTask() {
    return apiClient.get('/mhpc/mhpc-cpd-tasks/')
  },
  // MHPC CPD Tasks endpoints
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
  // MHPC Counselor endpoints
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
  // MHPC CPD Task Participants endpoints
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
