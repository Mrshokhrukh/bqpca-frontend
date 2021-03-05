import apiClient from './apiClient'

export default {
  // EPC CAPA endpoints
  getEpcCapas() {
    return apiClient.get('/epc/epc-capa/')
  },
  createEpcCapa(data) {
    return apiClient.post('/epc/epc-capa/', data)
  },
  getEpcCapa(id) {
    return apiClient.get(`/epc/epc-capa/${id}/`)
  },
  updateEpcCapa(id, data) {
    return apiClient.put(`/epc/epc-capa/${id}/`, data)
  },
  patchEpcCapa(id, data) {
    return apiClient.patch(`/epc/epc-capa/${id}/`, data)
  },
  deleteEpcCapa(id) {
    return apiClient.delete(`/epc/epc-capa/${id}/`)
  },

  // EPC COGS endpoints
  getEpcCogs() {
    return apiClient.get('/epc/epc-cogs/')
  },
  createEpcCogs(data) {
    return apiClient.post('/epc/epc-cogs/', data)
  },
  getEpcCogsById(id) {
    return apiClient.get(`/epc/epc-cogs/${id}/`)
  },
  updateEpcCogs(id, data) {
    return apiClient.put(`/epc/epc-cogs/${id}/`, data)
  },
  patchEpcCogs(id, data) {
    return apiClient.patch(`/epc/epc-cogs/${id}/`, data)
  },
  deleteEpcCogs(id) {
    return apiClient.delete(`/epc/epc-cogs/${id}/`)
  },

  // EPC Counsellors endpoints
  getEpcCounsellors() {
    return apiClient.get('/epc/epc-counsellors/')
  },
  createEpcCounsellor(data) {
    return apiClient.post('/epc/epc-counsellors/', data)
  },
  getEpcCounsellor(id) {
    return apiClient.get(`/epc/epc-counsellors/${id}/`)
  },
  updateEpcCounsellor(id, data) {
    return apiClient.put(`/epc/epc-counsellors/${id}/`, data)
  },
  patchEpcCounsellor(id, data) {
    return apiClient.patch(`/epc/epc-counsellors/${id}/`, data)
  },
  deleteEpcCounsellor(id) {
    return apiClient.delete(`/epc/epc-counsellors/${id}/`)
  },

  // EPC Course Details endpoints
  getEpcCourseDetails() {
    return apiClient.get('/epc/epc-course-details/')
  },
  createEpcCourseDetail(data) {
    return apiClient.post('/epc/epc-course-details/', data)
  },
  getEpcCourseDetail(id) {
    return apiClient.get(`/epc/epc-course-details/${id}/`)
  },
  updateEpcCourseDetail(id, data) {
    return apiClient.put(`/epc/epc-course-details/${id}/`, data)
  },
  patchEpcCourseDetail(id, data) {
    return apiClient.patch(`/epc/epc-course-details/${id}/`, data)
  },
  deleteEpcCourseDetail(id) {
    return apiClient.delete(`/epc/epc-course-details/${id}/`)
  },

  // EPC CPD Providing Agencies endpoints
  getEpcCpdProvidingAgencies() {
    return apiClient.get('/epc/epc-cpd-providing-agencies/')
  },
  createEpcCpdProvidingAgency(data) {
    return apiClient.post('/epc/epc-cpd-providing-agencies/', data)
  },
  getEpcCpdProvidingAgency(id) {
    return apiClient.get(`/epc/epc-cpd-providing-agencies/${id}/`)
  },
  updateEpcCpdProvidingAgency(id, data) {
    return apiClient.put(`/epc/epc-cpd-providing-agencies/${id}/`, data)
  },
  patchEpcCpdProvidingAgency(id, data) {
    return apiClient.patch(`/epc/epc-cpd-providing-agencies/${id}/`, data)
  },
  deleteEpcCpdProvidingAgency(id) {
    return apiClient.delete(`/epc/epc-cpd-providing-agencies/${id}/`)
  },

  // EPC CPD Reasons For Conducting endpoints
  getEpcCpdReasonsForConducting() {
    return apiClient.get('/epc/epc-cpd-reasons-for-conducting/')
  },
  createEpcCpdReasonForConducting(data) {
    return apiClient.post('/epc/epc-cpd-reasons-for-conducting/', data)
  },
  getEpcCpdReasonForConducting(id) {
    return apiClient.get(`/epc/epc-cpd-reasons-for-conducting/${id}/`)
  },
  updateEpcCpdReasonForConducting(id, data) {
    return apiClient.put(`/epc/epc-cpd-reasons-for-conducting/${id}/`, data)
  },
  patchEpcCpdReasonForConducting(id, data) {
    return apiClient.patch(`/epc/epc-cpd-reasons-for-conducting/${id}/`, data)
  },
  deleteEpcCpdReasonForConducting(id) {
    return apiClient.delete(`/epc/epc-cpd-reasons-for-conducting/${id}/`)
  },

  // EPC CPD Task Learning Methods endpoints
  getEpcCpdTaskLearningMethods() {
    return apiClient.get('/epc/epc-cpd-task-learning-methods/')
  },
  createEpcCpdTaskLearningMethod(data) {
    return apiClient.post('/epc/epc-cpd-task-learning-methods/', data)
  },
  getEpcCpdTaskLearningMethod(id) {
    return apiClient.get(`/epc/epc-cpd-task-learning-methods/${id}/`)
  },
  updateEpcCpdTaskLearningMethod(id, data) {
    return apiClient.put(`/epc/epc-cpd-task-learning-methods/${id}/`, data)
  },
  patchEpcCpdTaskLearningMethod(id, data) {
    return apiClient.patch(`/epc/epc-cpd-task-learning-methods/${id}/`, data)
  },
  deleteEpcCpdTaskLearningMethod(id) {
    return apiClient.delete(`/epc/epc-cpd-task-learning-methods/${id}/`)
  },

  // EPC CPD Task Methodologies endpoints
  getEpcCpdTaskMethodologies() {
    return apiClient.get('/epc/epc-cpd-task-methodologies/')
  },
  createEpcCpdTaskMethodology(data) {
    return apiClient.post('/epc/epc-cpd-task-methodologies/', data)
  },
  getEpcCpdTaskMethodology(id) {
    return apiClient.get(`/epc/epc-cpd-task-methodologies/${id}/`)
  },
  updateEpcCpdTaskMethodology(id, data) {
    return apiClient.put(`/epc/epc-cpd-task-methodologies/${id}/`, data)
  },
  patchEpcCpdTaskMethodology(id, data) {
    return apiClient.patch(`/epc/epc-cpd-task-methodologies/${id}/`, data)
  },
  deleteEpcCpdTaskMethodology(id) {
    return apiClient.delete(`/epc/epc-cpd-task-methodologies/${id}/`)
  },

  // EPC CPD Task Participants endpoints
  getEpcCpdTaskParticipants() {
    return apiClient.get('/epc/epc-cpd-task-participants/')
  },
  createEpcCpdTaskParticipant(data) {
    return apiClient.post('/epc/epc-cpd-task-participants/', data)
  },
  getEpcCpdTaskParticipant(id) {
    return apiClient.get(`/epc/epc-cpd-task-participants/${id}/`)
  },
  updateEpcCpdTaskParticipant(id, data) {
    return apiClient.put(`/epc/epc-cpd-task-participants/${id}/`, data)
  },
  patchEpcCpdTaskParticipant(id, data) {
    return apiClient.patch(`/epc/epc-cpd-task-participants/${id}/`, data)
  },
  deleteEpcCpdTaskParticipant(id) {
    return apiClient.delete(`/epc/epc-cpd-task-participants/${id}/`)
  },

  // EPC CPD Task Resources endpoints
  getEpcCpdTaskResources() {
    return apiClient.get('/epc/epc-cpd-task-resources/')
  },
  createEpcCpdTaskResource(data) {
    return apiClient.post('/epc/epc-cpd-task-resources/', data)
  },
  getEpcCpdTaskResource(id) {
    return apiClient.get(`/epc/epc-cpd-task-resources/${id}/`)
  },
  updateEpcCpdTaskResource(id, data) {
    return apiClient.put(`/epc/epc-cpd-task-resources/${id}/`, data)
  },
  patchEpcCpdTaskResource(id, data) {
    return apiClient.patch(`/epc/epc-cpd-task-resources/${id}/`, data)
  },
  deleteEpcCpdTaskResource(id) {
    return apiClient.delete(`/epc/epc-cpd-task-resources/${id}/`)
  },

  // EPC CPD Tasks endpoints
  getEpcCpdTasks() {
    return apiClient.get('/epc/epc-cpd-tasks/')
  },
  createEpcCpdTask(data) {
    return apiClient.post('/epc/epc-cpd-tasks/', data)
  },
  getEpcCpdTask(id) {
    return apiClient.get(`/epc/epc-cpd-tasks/${id}/`)
  },
  updateEpcCpdTask(id, data) {
    return apiClient.put(`/epc/epc-cpd-tasks/${id}/`, data)
  },
  patchEpcCpdTask(id, data) {
    return apiClient.patch(`/epc/epc-cpd-tasks/${id}/`, data)
  },
  deleteEpcCpdTask(id) {
    return apiClient.delete(`/epc/epc-cpd-tasks/${id}/`)
  },

  // EPC Institute Departments endpoints
  getEpcInstituteDepartments() {
    return apiClient.get('/epc/epc-institute-departments/')
  },
  createEpcInstituteDepartment(data) {
    return apiClient.post('/epc/epc-institute-departments/', data)
  },
  getEpcInstituteDepartment(id) {
    return apiClient.get(`/epc/epc-institute-departments/${id}/`)
  },
  updateEpcInstituteDepartment(id, data) {
    return apiClient.put(`/epc/epc-institute-departments/${id}/`, data)
  },
  patchEpcInstituteDepartment(id, data) {
    return apiClient.patch(`/epc/epc-institute-departments/${id}/`, data)
  },
  deleteEpcInstituteDepartment(id) {
    return apiClient.delete(`/epc/epc-institute-departments/${id}/`)
  },

  // EPC Institute Staff endpoints
  getEpcInstituteStaff() {
    return apiClient.get('/epc/epc-institute-staff/')
  },
  createEpcInstituteStaff(data) {
    return apiClient.post('/epc/epc-institute-staff/', data)
  },
  getEpcInstituteStaffMember(id) {
    return apiClient.get(`/epc/epc-institute-staff/${id}/`)
  },
  updateEpcInstituteStaffMember(id, data) {
    return apiClient.put(`/epc/epc-institute-staff/${id}/`, data)
  },
  patchEpcInstituteStaffMember(id, data) {
    return apiClient.patch(`/epc/epc-institute-staff/${id}/`, data)
  },
  deleteEpcInstituteStaffMember(id) {
    return apiClient.delete(`/epc/epc-institute-staff/${id}/`)
  },

  // EPC Institutes endpoints
  getEpcInstitutes() {
    return apiClient.get('/epc/epc-institutes/')
  },
  createEpcInstitute(data) {
    return apiClient.post('/epc/epc-institutes/', data)
  },
  getEpcInstitute(id) {
    return apiClient.get(`/epc/epc-institutes/${id}/`)
  },
  updateEpcInstitute(id, data) {
    return apiClient.put(`/epc/epc-institutes/${id}/`, data)
  },
  patchEpcInstitute(id, data) {
    return apiClient.patch(`/epc/epc-institutes/${id}/`, data)
  },
  deleteEpcInstitute(id) {
    return apiClient.delete(`/epc/epc-institutes/${id}/`)
  },

  // EPC New Application endpoints
  getEpcNewApplications() {
    return apiClient.get('/epc/epc-new-application/')
  },
  createEpcNewApplication(data) {
    return apiClient.post('/epc/epc-new-application/', data)
  },
  getEpcNewApplication(id) {
    return apiClient.get(`/epc/epc-new-application/${id}/`)
  },
  updateEpcNewApplication(id, data) {
    return apiClient.put(`/epc/epc-new-application/${id}/`, data)
  },
  patchEpcNewApplication(id, data) {
    return apiClient.patch(`/epc/epc-new-application/${id}/`, data)
  },
  deleteEpcNewApplication(id) {
    return apiClient.delete(`/epc/epc-new-application/${id}/`)
  },

  // EPC New Qualification endpoints
  getEpcNewQualifications() {
    return apiClient.get('/epc/epc-new-qualification/')
  },
  createEpcNewQualification(data) {
    return apiClient.post('/epc/epc-new-qualification/', data)
  },
  getEpcNewQualification(id) {
    return apiClient.get(`/epc/epc-new-qualification/${id}/`)
  },
  updateEpcNewQualification(id, data) {
    return apiClient.put(`/epc/epc-new-qualification/${id}/`, data)
  },
  patchEpcNewQualification(id, data) {
    return apiClient.patch(`/epc/epc-new-qualification/${id}/`, data)
  },
  deleteEpcNewQualification(id) {
    return apiClient.delete(`/epc/epc-new-qualification/${id}/`)
  },

  // EPC Renewals endpoints
  getEpcRenewals() {
    return apiClient.get('/epc/epc-renewals/')
  },
  createEpcRenewal(data) {
    return apiClient.post('/epc/epc-renewals/', data)
  },
  getEpcRenewal(id) {
    return apiClient.get(`/epc/epc-renewals/${id}/`)
  },
  updateEpcRenewal(id, data) {
    return apiClient.put(`/epc/epc-renewals/${id}/`, data)
  },
  patchEpcRenewal(id, data) {
    return apiClient.patch(`/epc/epc-renewals/${id}/`, data)
  },
  deleteEpcRenewal(id) {
    return apiClient.delete(`/epc/epc-renewals/${id}/`)
  },

  // EPC Teaching Centers endpoints
  getEpcTeachingCenters() {
    return apiClient.get('/epc/epc-teaching-centers/')
  },
  createEpcTeachingCenter(data) {
    return apiClient.post('/epc/epc-teaching-centers/', data)
  },
  getEpcTeachingCenter(id) {
    return apiClient.get(`/epc/epc-teaching-centers/${id}/`)
  },
  updateEpcTeachingCenter(id, data) {
    return apiClient.put(`/epc/epc-teaching-centers/${id}/`, data)
  },
  patchEpcTeachingCenter(id, data) {
    return apiClient.patch(`/epc/epc-teaching-centers/${id}/`, data)
  },
  deleteEpcTeachingCenter(id) {
    return apiClient.delete(`/epc/epc-teaching-centers/${id}/`)
  },

  // Masters CME Activities endpoints
  getMastersCmeActivities() {
    return apiClient.get('/epc/masters-cme-activities/')
  },
  createMastersCmeActivity(data) {
    return apiClient.post('/epc/masters-cme-activities/', data)
  },
  getMastersCmeActivity(id) {
    return apiClient.get(`/epc/masters-cme-activities/${id}/`)
  },
  updateMastersCmeActivity(id, data) {
    return apiClient.put(`/epc/masters-cme-activities/${id}/`, data)
  },
  patchMastersCmeActivity(id, data) {
    return apiClient.patch(`/epc/masters-cme-activities/${id}/`, data)
  },
  deleteMastersCmeActivity(id) {
    return apiClient.delete(`/epc/masters-cme-activities/${id}/`)
  },

  // Masters CME Credits endpoints
  getMastersCmeCredits() {
    return apiClient.get('/epc/masters-cme-credits/')
  },
  createMastersCmeCredit(data) {
    return apiClient.post('/epc/masters-cme-credits/', data)
  },
  getMastersCmeCredit(id) {
    return apiClient.get(`/epc/masters-cme-credits/${id}/`)
  },
  updateMastersCmeCredit(id, data) {
    return apiClient.put(`/epc/masters-cme-credits/${id}/`, data)
  },
  patchMastersCmeCredit(id, data) {
    return apiClient.patch(`/epc/masters-cme-credits/${id}/`, data)
  },
  deleteMastersCmeCredit(id) {
    return apiClient.delete(`/epc/masters-cme-credits/${id}/`)
  },

  // Masters CME Methodologies endpoints
  getMastersCmeMethodologies() {
    return apiClient.get('/epc/masters-cme-methodologies/')
  },
  createMastersCmeMethodology(data) {
    return apiClient.post('/epc/masters-cme-methodologies/', data)
  },
  getMastersCmeMethodology(id) {
    return apiClient.get(`/epc/masters-cme-methodologies/${id}/`)
  },
  updateMastersCmeMethodology(id, data) {
    return apiClient.put(`/epc/masters-cme-methodologies/${id}/`, data)
  },
  patchMastersCmeMethodology(id, data) {
    return apiClient.patch(`/epc/masters-cme-methodologies/${id}/`, data)
  },
  deleteMastersCmeMethodology(id) {
    return apiClient.delete(`/epc/masters-cme-methodologies/${id}/`)
  },

  // Masters COGS Agencies endpoints
  getMastersCogsAgencies() {
    return apiClient.get('/epc/masters-cogs-agencies/')
  },
  createMastersCogsAgency(data) {
    return apiClient.post('/epc/masters-cogs-agencies/', data)
  },
  getMastersCogsAgency(id) {
    return apiClient.get(`/epc/masters-cogs-agencies/${id}/`)
  },
  updateMastersCogsAgency(id, data) {
    return apiClient.put(`/epc/masters-cogs-agencies/${id}/`, data)
  },
  patchMastersCogsAgency(id, data) {
    return apiClient.patch(`/epc/masters-cogs-agencies/${id}/`, data)
  },
  deleteMastersCogsAgency(id) {
    return apiClient.delete(`/epc/masters-cogs-agencies/${id}/`)
  },

  // Masters COGS Departments endpoints
  getMastersCogsDepartments() {
    return apiClient.get('/epc/masters-cogs-departments/')
  },
  createMastersCogsDepartment(data) {
    return apiClient.post('/epc/masters-cogs-departments/', data)
  },
  getMastersCogsDepartment(id) {
    return apiClient.get(`/epc/masters-cogs-departments/${id}/`)
  },
  updateMastersCogsDepartment(id, data) {
    return apiClient.put(`/epc/masters-cogs-departments/${id}/`, data)
  },
  patchMastersCogsDepartment(id, data) {
    return apiClient.patch(`/epc/masters-cogs-departments/${id}/`, data)
  },
  deleteMastersCogsDepartment(id) {
    return apiClient.delete(`/epc/masters-cogs-departments/${id}/`)
  },

  // Masters COGS Workplaces endpoints
  getMastersCogsWorkplaces() {
    return apiClient.get('/epc/masters-cogs-workplaces/')
  },
  createMastersCogsWorkplace(data) {
    return apiClient.post('/epc/masters-cogs-workplaces/', data)
  },
  getMastersCogsWorkplace(id) {
    return apiClient.get(`/epc/masters-cogs-workplaces/${id}/`)
  },
  updateMastersCogsWorkplace(id, data) {
    return apiClient.put(`/epc/masters-cogs-workplaces/${id}/`, data)
  },
  patchMastersCogsWorkplace(id, data) {
    return apiClient.patch(`/epc/masters-cogs-workplaces/${id}/`, data)
  },
  deleteMastersCogsWorkplace(id) {
    return apiClient.delete(`/epc/masters-cogs-workplaces/${id}/`)
  },

  // Masters CPD Activity endpoints
  getMastersCpdActivity() {
    return apiClient.get('/epc/masters-cpd-activity/')
  },
  createMastersCpdActivity(data) {
    return apiClient.post('/epc/masters-cpd-activity/', data)
  },
  getMastersCpdActivityById(id) {
    return apiClient.get(`/epc/masters-cpd-activity/${id}/`)
  },
  updateMastersCpdActivity(id, data) {
    return apiClient.put(`/epc/masters-cpd-activity/${id}/`, data)
  },
  patchMastersCpdActivity(id, data) {
    return apiClient.patch(`/epc/masters-cpd-activity/${id}/`, data)
  },
  deleteMastersCpdActivity(id) {
    return apiClient.delete(`/epc/masters-cpd-activity/${id}/`)
  },

  // Masters Document Types endpoints
  getMastersDocumentTypes() {
    return apiClient.get('/epc/masters-document-types/')
  },
  createMastersDocumentType(data) {
    return apiClient.post('/epc/masters-document-types/', data)
  },
  getMastersDocumentType(id) {
    return apiClient.get(`/epc/masters-document-types/${id}/`)
  },
  updateMastersDocumentType(id, data) {
    return apiClient.put(`/epc/masters-document-types/${id}/`, data)
  },
  patchMastersDocumentType(id, data) {
    return apiClient.patch(`/epc/masters-document-types/${id}/`, data)
  },
  deleteMastersDocumentType(id) {
    return apiClient.delete(`/epc/masters-document-types/${id}/`)
  },

  // Masters E-Signatures endpoints
  getMastersESignatures() {
    return apiClient.get('/epc/masters-e-signatures/')
  },
  createMastersESignature(data) {
    return apiClient.post('/epc/masters-e-signatures/', data)
  },
  getMastersESignature(id) {
    return apiClient.get(`/epc/masters-e-signatures/${id}/`)
  },
  updateMastersESignature(id, data) {
    return apiClient.put(`/epc/masters-e-signatures/${id}/`, data)
  },
  patchMastersESignature(id, data) {
    return apiClient.patch(`/epc/masters-e-signatures/${id}/`, data)
  },
  deleteMastersESignature(id) {
    return apiClient.delete(`/epc/masters-e-signatures/${id}/`)
  },

  // Masters Fee Structures endpoints
  getMastersFeeStructures() {
    return apiClient.get('/epc/masters-fee-structures/')
  },
  createMastersFeeStructure(data) {
    return apiClient.post('/epc/masters-fee-structures/', data)
  },
  getMastersFeeStructure(id) {
    return apiClient.get(`/epc/masters-fee-structures/${id}/`)
  },
  updateMastersFeeStructure(id, data) {
    return apiClient.put(`/epc/masters-fee-structures/${id}/`, data)
  },
  patchMastersFeeStructure(id, data) {
    return apiClient.patch(`/epc/masters-fee-structures/${id}/`, data)
  },
  deleteMastersFeeStructure(id) {
    return apiClient.delete(`/epc/masters-fee-structures/${id}/`)
  },

  // Masters Fees Associated For endpoints
  getMastersFeesAssociatedFor() {
    return apiClient.get('/epc/masters-fees-associated-for/')
  },
  createMastersFeesAssociatedFor(data) {
    return apiClient.post('/epc/masters-fees-associated-for/', data)
  },
  getMastersFeesAssociatedForById(id) {
    return apiClient.get(`/epc/masters-fees-associated-for/${id}/`)
  },
  updateMastersFeesAssociatedFor(id, data) {
    return apiClient.put(`/epc/masters-fees-associated-for/${id}/`, data)
  },
  patchMastersFeesAssociatedFor(id, data) {
    return apiClient.patch(`/epc/masters-fees-associated-for/${id}/`, data)
  },
  deleteMastersFeesAssociatedFor(id) {
    return apiClient.delete(`/epc/masters-fees-associated-for/${id}/`)
  },

  // Masters File Types endpoints
  getMastersFileTypes() {
    return apiClient.get('/epc/masters-file-types/')
  },
  createMastersFileType(data) {
    return apiClient.post('/epc/masters-file-types/', data)
  },
  getMastersFileType(id) {
    return apiClient.get(`/epc/masters-file-types/${id}/`)
  },
  updateMastersFileType(id, data) {
    return apiClient.put(`/epc/masters-file-types/${id}/`, data)
  },
  patchMastersFileType(id, data) {
    return apiClient.patch(`/epc/masters-file-types/${id}/`, data)
  },
  deleteMastersFileType(id) {
    return apiClient.delete(`/epc/masters-file-types/${id}/`)
  },

  // Masters Participation Category endpoints
  getMastersParticipationCategories() {
    return apiClient.get('/epc/masters-participation-category/')
  },
  createMastersParticipationCategory(data) {
    return apiClient.post('/epc/masters-participation-category/', data)
  },
  getMastersParticipationCategory(id) {
    return apiClient.get(`/epc/masters-participation-category/${id}/`)
  },
  updateMastersParticipationCategory(id, data) {
    return apiClient.put(`/epc/masters-participation-category/${id}/`, data)
  },
  patchMastersParticipationCategory(id, data) {
    return apiClient.patch(`/epc/masters-participation-category/${id}/`, data)
  },
  deleteMastersParticipationCategory(id) {
    return apiClient.delete(`/epc/masters-participation-category/${id}/`)
  },

  // Masters Participation Sub Category endpoints
  getMastersParticipationSubCategories() {
    return apiClient.get('/epc/masters-participation-sub-category/')
  },
  createMastersParticipationSubCategory(data) {
    return apiClient.post('/epc/masters-participation-sub-category/', data)
  },
  getMastersParticipationSubCategory(id) {
    return apiClient.get(`/epc/masters-participation-sub-category/${id}/`)
  },
  updateMastersParticipationSubCategory(id, data) {
    return apiClient.put(`/epc/masters-participation-sub-category/${id}/`, data)
  },
  patchMastersParticipationSubCategory(id, data) {
    return apiClient.patch(`/epc/masters-participation-sub-category/${id}/`, data)
  },
  deleteMastersParticipationSubCategory(id) {
    return apiClient.delete(`/epc/masters-participation-sub-category/${id}/`)
  },

  // Masters Personnel Categories endpoints
  getMastersPersonnelCategories() {
    return apiClient.get('/epc/masters-personnel-categories/')
  },
  createMastersPersonnelCategory(data) {
    return apiClient.post('/epc/masters-personnel-categories/', data)
  },
  getMastersPersonnelCategory(id) {
    return apiClient.get(`/epc/masters-personnel-categories/${id}/`)
  },
  updateMastersPersonnelCategory(id, data) {
    return apiClient.put(`/epc/masters-personnel-categories/${id}/`, data)
  },
  patchMastersPersonnelCategory(id, data) {
    return apiClient.patch(`/epc/masters-personnel-categories/${id}/`, data)
  },
  deleteMastersPersonnelCategory(id) {
    return apiClient.delete(`/epc/masters-personnel-categories/${id}/`)
  },

  // Masters Qualification Types endpoints
  getMastersQualificationTypes() {
    return apiClient.get('/epc/masters-qualification-types/')
  },
  createMastersQualificationType(data) {
    return apiClient.post('/epc/masters-qualification-types/', data)
  },
  getMastersQualificationType(id) {
    return apiClient.get(`/epc/masters-qualification-types/${id}/`)
  },
  updateMastersQualificationType(id, data) {
    return apiClient.put(`/epc/masters-qualification-types/${id}/`, data)
  },
  patchMastersQualificationType(id, data) {
    return apiClient.patch(`/epc/masters-qualification-types/${id}/`, data)
  },
  deleteMastersQualificationType(id) {
    return apiClient.delete(`/epc/masters-qualification-types/${id}/`)
  },

  // Masters Qualifications endpoints
  getMastersQualifications() {
    return apiClient.get('/epc/masters-qualifications/')
  },
  createMastersQualification(data) {
    return apiClient.post('/epc/masters-qualifications/', data)
  },
  getMastersQualification(id) {
    return apiClient.get(`/epc/masters-qualifications/${id}/`)
  },
  updateMastersQualification(id, data) {
    return apiClient.put(`/epc/masters-qualifications/${id}/`, data)
  },
  patchMastersQualification(id, data) {
    return apiClient.patch(`/epc/masters-qualifications/${id}/`, data)
  },
  deleteMastersQualification(id) {
    return apiClient.delete(`/epc/masters-qualifications/${id}/`)
  },

  // Masters Registration Type endpoints
  getMastersRegistrationTypes() {
    return apiClient.get('/epc/masters-registration-type/')
  },
  createMastersRegistrationType(data) {
    return apiClient.post('/epc/masters-registration-type/', data)
  },
  getMastersRegistrationType(id) {
    return apiClient.get(`/epc/masters-registration-type/${id}/`)
  },
  updateMastersRegistrationType(id, data) {
    return apiClient.put(`/epc/masters-registration-type/${id}/`, data)
  },
  patchMastersRegistrationType(id, data) {
    return apiClient.patch(`/epc/masters-registration-type/${id}/`, data)
  },
  deleteMastersRegistrationType(id) {
    return apiClient.delete(`/epc/masters-registration-type/${id}/`)
  },

  // Masters Sector endpoints
  getMastersSectors() {
    return apiClient.get('/epc/masters-sector/')
  },
  createMastersSector(data) {
    return apiClient.post('/epc/masters-sector/', data)
  },
  getMastersSector(id) {
    return apiClient.get(`/epc/masters-sector/${id}/`)
  },
  updateMastersSector(id, data) {
    return apiClient.put(`/epc/masters-sector/${id}/`, data)
  },
  patchMastersSector(id, data) {
    return apiClient.patch(`/epc/masters-sector/${id}/`, data)
  },
  deleteMastersSector(id) {
    return apiClient.delete(`/epc/masters-sector/${id}/`)
  },

  // Masters Sub Categories endpoints
  getMastersSubCategories() {
    return apiClient.get('/epc/masters-sub-categories/')
  },
  createMastersSubCategory(data) {
    return apiClient.post('/epc/masters-sub-categories/', data)
  },
  getMastersSubCategory(id) {
    return apiClient.get(`/epc/masters-sub-categories/${id}/`)
  },
  updateMastersSubCategory(id, data) {
    return apiClient.put(`/epc/masters-sub-categories/${id}/`, data)
  },
  patchMastersSubCategory(id, data) {
    return apiClient.patch(`/epc/masters-sub-categories/${id}/`, data)
  },
  deleteMastersSubCategory(id) {
    return apiClient.delete(`/epc/masters-sub-categories/${id}/`)
  },

  // Masters University endpoints
  getMastersUniversities() {
    return apiClient.get('/epc/masters-university/')
  },
  createMastersUniversity(data) {
    return apiClient.post('/epc/masters-university/', data)
  },
  getMastersUniversity(id) {
    return apiClient.get(`/epc/masters-university/${id}/`)
  },
  updateMastersUniversity(id, data) {
    return apiClient.put(`/epc/masters-university/${id}/`, data)
  },
  patchMastersUniversity(id, data) {
    return apiClient.patch(`/epc/masters-university/${id}/`, data)
  },
  deleteMastersUniversity(id) {
    return apiClient.delete(`/epc/masters-university/${id}/`)
  },

  // Helper methods for common operations
  getApplicationWithCid(cid) {
    return apiClient.get(`/epc/epc-new-application/?cid=${cid}`)
  },

  // Generic function to fetch master data
  getMasterData(masterDataType) {
    let endpoint = ''
    switch (masterDataType) {
      case 'personnel-categories':
        endpoint = '/epc/masters-personnel-categories/'
        break
      case 'participation-categories':
        endpoint = '/epc/masters-participation-category/'
        break
      case 'qualification-types':
        endpoint = '/epc/masters-qualification-types/'
        break
      case 'universities':
        endpoint = '/epc/masters-university/'
        break
      default:
        console.error(
          `Master data type "${masterDataType}" is not supported in getMasterData function.`,
        )
        return Promise.reject(`Master data type "${masterDataType}" is not supported.`)
    }
    return apiClient.get(endpoint)
  },
}
