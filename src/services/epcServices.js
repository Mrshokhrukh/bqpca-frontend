import apiClient from './apiClient'

export default {
  // EPC CAPA endpoints
  getEpcCapas(queryParams) {
    return apiClient.get('/epc/epc-capa/', { params: queryParams })
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
  getEpcCogs(queryParams) {
    return apiClient.get('/epc/epc-cogs/', { params: queryParams })
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
    // Assuming Counsellor might have attachments, use FormData
    return apiClient.post('/epc/epc-counsellors/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  getEpcCounsellor(id) {
    return apiClient.get(`/epc/epc-counsellors/${id}/`)
  },
  updateEpcCounsellor(id, data) {
    // Assuming Counsellor might have attachments, use FormData
    return apiClient.put(`/epc/epc-counsellors/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  patchEpcCounsellor(id, data) {
    // Assuming Counsellor might have attachments, use FormData
    return apiClient.patch(`/epc/epc-counsellors/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  deleteEpcCounsellor(id) {
    return apiClient.delete(`/epc/epc-counsellors/${id}/`)
  },

  // EPC Course Details endpoints
  getEpcCourseDetails() {
    return apiClient.get('/epc/epc-course-details/')
  },
  createEpcCourseDetail(data) {
    // Assuming Course Details might have attachments, use FormData
    return apiClient.post('/epc/epc-course-details/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  getEpcCourseDetail(id) {
    return apiClient.get(`/epc/epc-course-details/${id}/`)
  },
  updateEpcCourseDetail(id, data) {
    // Assuming Course Details might have attachments, use FormData
    return apiClient.put(`/epc/epc-course-details/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  patchEpcCourseDetail(id, data) {
    // Assuming Course Details might have attachments, use FormData
    return apiClient.patch(`/epc/epc-course-details/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
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

  // EPC CPD Records endpoints
  getEpcCpdRecords(queryParams) {
    return apiClient.get('/epc/epc-cpd-records/', { params: queryParams })
  },

  createEpcCpdRecord(data) {
    // CPD Records have attachments, use FormData
    return apiClient.post('/epc/epc-cpd-records/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  getEpcCpdRecord(id) {
    return apiClient.get(`/epc/epc-cpd-records/${id}/`)
  },
  updateEpcCpdRecord(id, data) {
    // CPD Records have attachments, use FormData
    return apiClient.put(`/epc/epc-cpd-records/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  patchEpcCpdRecord(id, data) {
    // CPD Records have attachments, use FormData
    return apiClient.patch(`/epc/epc-cpd-records/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  deleteEpcCpdRecord(id) {
    return apiClient.delete(`/epc/epc-cpd-records/${id}/`)
  },

  // get cpd records based on cid
  getEpcCpdRecordsByCid(cid) {
    return apiClient.get(`/epc/epc-cpd-records/list-my-cpd/?cid=${cid}`)
  },
  getCPDProviderDashboard() {

    return apiClient.get('/epc/dashboard/cpd-provider/');
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
  getEpcCpdTasks(queryParams) {
    return apiClient.get('/epc/epc-cpd-tasks/', { params: queryParams })
  },
  createEpcCpdTask(data) {
    // CPD Tasks have attachments, use FormData
    return apiClient.post('/epc/epc-cpd-tasks/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  getEpcCpdTask(id) {
    return apiClient.get(`/epc/epc-cpd-tasks/${id}/`)
  },
  updateEpcCpdTask(id, data) {
    // CPD Tasks have attachments, use FormData
    return apiClient.put(`/epc/epc-cpd-tasks/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  patchEpcCpdTask(id, data) {
    // CPD Tasks have attachments, use FormData
    return apiClient.patch(`/epc/epc-cpd-tasks/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
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
  getEpcInstitutes(queryParams) {
    return apiClient.get('/epc/epc-institutes/', { params: queryParams })
  },
  createEpcInstitute(data) {
    // Institutes have attachments, use FormData
    return apiClient.post('/epc/epc-institutes/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  getEpcInstitute(id) {
    return apiClient.get(`/epc/epc-institutes/${id}/`)
  },
  updateEpcInstitute(id, data) {
    // Institutes have attachments, use FormData
    return apiClient.put(`/epc/epc-institutes/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  patchEpcInstitute(id, data) {
    // Institutes have attachments, use FormData
    return apiClient.patch(`/epc/epc-institutes/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  deleteEpcInstitute(id) {
    return apiClient.delete(`/epc/epc-institutes/${id}/`)
  },


  // EPC New Application endpoints
  getEpcNewApplications(queryParams) {
    // NOTE: Make sure your Django URL for this is `/epc/epc-new-application/`
    return apiClient.get('/epc/epc-new-application/', { params: queryParams })
  },
  createEpcNewApplication(data) {
    // New Applications have attachments, use FormData
    return apiClient.post('/epc/epc-new-application/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  getEpcNewApplication(id) {
    return apiClient.get(`/epc/epc-new-application/${id}/`)
  },
  updateEpcNewApplication(id, data) {
    // New Applications have attachments, use FormData
    return apiClient.put(`/epc/epc-new-application/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  patchEpcNewApplication(id, data) {
    // New Applications have attachments, use FormData
    return apiClient.patch(`/epc/epc-new-application/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  deleteEpcNewApplication(id) {
    return apiClient.delete(`/epc/epc-new-application/${id}/`)
  },
  getEpcApplicationsByCid(cid) {
    return apiClient.get(`/epc/epc-get-application-list/get_by_cid/?cid=${cid}`)
  },
  getEpcFullApplicationListByCid(cid) {
    return apiClient.get(`/epc/epc-new-application/?cid=${cid}`)
  },

  // EPC New Qualification endpoints
  getEpcNewQualifications(queryParams) {
    return apiClient.get('/epc/epc-new-qualification/', { params: queryParams })
  },
  createEpcNewQualification(data) {
    // New Qualifications have attachments, use FormData
    return apiClient.post('/epc/epc-new-qualification/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  getEpcNewQualification(id) {
    return apiClient.get(`/epc/epc-new-qualification/${id}/`)
  },
  updateEpcNewQualification(id, data) {
    // New Qualifications have attachments, use FormData
    return apiClient.put(`/epc/epc-new-qualification/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  patchEpcNewQualification(id, data) {
    // New Qualifications have attachments, use FormData
    return apiClient.patch(`/epc/epc-new-qualification/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  deleteEpcNewQualification(id) {
    return apiClient.delete(`/epc/epc-new-qualification/${id}/`)
  },

  // <<< --- START: EPC New Education Program Endpoints --- >>>
  getEpcNewEducationPrograms() {
    return apiClient.get('/epc/epc-new-education-programs/')
  },
  createEpcNewEducationProgram(data) {
    // Has file uploads, use FormData
    return apiClient.post('/epc/epc-new-education-programs/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  getEpcNewEducationProgram(id) {
    return apiClient.get(`/epc/epc-new-education-programs/${id}/`)
  },
  updateEpcNewEducationProgram(id, data) {
    // Has file uploads, use FormData
    return apiClient.put(`/epc/epc-new-education-programs/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  patchEpcNewEducationProgram(id, data) {
    // Has file uploads, use FormData
    return apiClient.patch(`/epc/epc-new-education-programs/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  deleteEpcNewEducationProgram(id) {
    return apiClient.delete(`/epc/epc-new-education-programs/${id}/`)
  },
  getEpcInstituteRenewals() {
    return apiClient.get('/epc/epc-institute-renewals/');
  },
  createEpcInstituteRenewal(data) {
    return apiClient.post('/epc/epc-institute-renewals/', data);
  },
  getEpcInstituteRenewal(id) {
    return apiClient.get(`/epc/epc-institute-renewals/${id}/`);
  },
  updateEpcInstituteRenewal(id, data) {
    return apiClient.put(`/epc/epc-institute-renewals/${id}/`, data);
  },
  patchEpcInstituteRenewal(id, data) {
    return apiClient.patch(`/epc/epc-institute-renewals/${id}/`, data);
  },
  deleteEpcInstituteRenewal(id) {
    return apiClient.delete(`/epc/epc-institute-renewals/${id}/`);
  },

  // EPC Renewals endpoints
  getEpcRenewals(queryParams) {
    return apiClient.get('/epc/epc-renewals/', { params: queryParams })
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
    // Teaching Centers have attachments, use FormData
    return apiClient.post('/epc/epc-teaching-centers/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  getEpcTeachingCenter(id) {
    return apiClient.get(`/epc/epc-teaching-centers/${id}/`)
  },
  updateEpcTeachingCenter(id, data) {
    // Teaching Centers have attachments, use FormData
    return apiClient.put(`/epc/epc-teaching-centers/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  patchEpcTeachingCenter(id, data) {
    // Teaching Centers have attachments, use FormData
    return apiClient.patch(`/epc/epc-teaching-centers/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  deleteEpcTeachingCenter(id) {
    return apiClient.delete(`/epc/epc-teaching-centers/${id}/`)
  },
  // <<< THIS IS THE FIX >>>
  /**
   * Approves a teaching center application. Calls the custom @action endpoint.
   * @param {number} id
   * @param {object} data
   */
  approveEpcTeachingCenter(id, data) {

    return apiClient.post(`/epc/epc-teaching-centers/${id}/approve/`, data)
  },

  /**

   * @param {number} id
   * @param {object} data
   */
  rejectEpcTeachingCenter(id, data) {

    return apiClient.post(`/epc/epc-teaching-centers/${id}/reject/`, data)
  },


  getApplicationStatus(applicationId) {
    return apiClient.get(`/epc/epc-teaching-centers/${applicationId}/`)
  },

  // renewalfor teaching center
  getEpcTeachingCenterRenewals(params) {
    return apiClient.get('/epc/epc-teaching-center-renewals/', { params })
  },

  createEpcTeachingCenterRenewal(formData) {
    return apiClient.post('/epc/epc-teaching-center-renewals/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
  patchEpcTeachingCenterRenewal(id, data) {
    // This will be used by the user's payment confirmation
    return apiClient.patch(`/epc/epc-teaching-center-renewals/${id}/`, data, {
        headers: {
            // Ensure correct content type if sending FormData
            'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
        }
    })
  },


  approveEpcTeachingCenterRenewal(renewalId, data) {
    // data should be an object like { remarks: 'Optional approval message' }
    return apiClient.post(`/epc/epc-teaching-center-renewals/${renewalId}/approve/`, data)
  },

  rejectEpcTeachingCenterRenewal(renewalId, data) {
    // data should be an object like { reason: 'Mandatory rejection reason' }
    return apiClient.post(`/epc/epc-teaching-center-renewals/${renewalId}/reject/`, data)
  },
  // Masters CPD Activities endpoints
  getEpcMastersCpdActivities() {
    return apiClient.get('/epc/masters-cpd-activities/')
  },
  createEpcMastersCpdActivities(data) {
    return apiClient.post('/epc/masters-cpd-activities/', data)
  },
  getEpcMastersCpdActivitiesById(id) {
    return apiClient.get(`/epc/masters-cpd-activities/${id}/`)
  },
  updateEpcMastersCpdActivities(id, data) {
    return apiClient.put(`/epc/masters-cpd-activities/${id}/`, data)
  },
  patchEpcMastersCpdActivities(id, data) {
    return apiClient.patch(`/epc/masters-cpd-activities/${id}/`, data)
  },
  deleteEpcMastersCpdActivities(id) {
    return apiClient.delete(`/epc/masters-cpd-activities/${id}/`)
  },

  // Masters CPD activity endpoints
  getEpcMastersCpdActivity() {
    return apiClient.get('/epc/masters-cpd-activity/')
  },
  createEpcMastersCpdActivity(data) {
    return apiClient.post('/epc/masters-cpd-activity/', data)
  },
  getEpcMastersCpdActivityById(id) {
    return apiClient.get(`/epc/masters-cpd-activity/${id}/`)
  },
  updateEpcMastersCpdActivity(id, data) {
    return apiClient.put(`/epc/masters-cpd-activity/${id}/`, data)
  },
  patchEpcMastersCpdActivity(id, data) {
    return apiClient.patch(`/epc/masters-cpd-activity/${id}/`, data)
  },
  deleteEpcMastersCpdActivity(id) {
    return apiClient.delete(`/epc/masters-cpd-activity/${id}/`)
  },

  // Masters CPD Credits endpoints
  getEpcMastersCpdCredits() {
    return apiClient.get('/epc/masters-cpd-credits/')
  },
  createEpcMastersCpdCredit(data) {
    return apiClient.post('/epc/masters-cpd-credits/', data)
  },
  getEpcMastersCpdCredit(id) {
    return apiClient.get(`/epc/masters-cpd-credits/${id}/`)
  },
  updateEpcMastersCpdCredit(id, data) {
    return apiClient.put(`/epc/masters-cpd-credits/${id}/`, data)
  },
  patchEpcMastersCpdCredit(id, data) {
    return apiClient.patch(`/epc/masters-cpd-credits/${id}/`, data)
  },
  deleteEpcMastersCpdCredit(id) {
    return apiClient.delete(`/epc/masters-cpd-credits/${id}/`)
  },

  // Masters CPD Methodologies endpoints
  getEpcMastersCpdMethodologies() {
    return apiClient.get('/epc/masters-cpd-methodologies/')
  },
  createEpcMastersCpdMethodology(data) {
    return apiClient.post('/epc/masters-cpd-methodologies/', data)
  },
  getEpcMastersCpdMethodology(id) {
    return apiClient.get(`/epc/masters-cpd-methodologies/${id}/`)
  },
  updateEpcMastersCpdMethodology(id, data) {
    return apiClient.put(`/epc/masters-cpd-methodologies/${id}/`, data)
  },
  patchEpcMastersCpdMethodology(id, data) {
    return apiClient.patch(`/epc/masters-cpd-methodologies/${id}/`, data)
  },
  deleteEpcMastersCpdMethodology(id) {
    return apiClient.delete(`/epc/masters-cpd-methodologies/${id}/`)
  },

  // Masters COGS Agencies endpoints
  getEpcCogsAgencies() {
    return apiClient.get('/epc/masters-cogs-agencies/')
  },
  createEpcCogsAgency(data) {
    return apiClient.post('/epc/masters-cogs-agencies/', data)
  },
  getEpcCogsAgency(id) {
    return apiClient.get(`/epc/masters-cogs-agencies/${id}/`)
  },
  updateEpcCogsAgency(id, data) {
    return apiClient.put(`/epc/masters-cogs-agencies/${id}/`, data)
  },
  patchEpcCogsAgency(id, data) {
    return apiClient.patch(`/epc/masters-cogs-agencies/${id}/`, data)
  },
  deleteEpcCogsAgency(id) {
    return apiClient.delete(`/epc/masters-cogs-agencies/${id}/`)
  },

  // Masters COGS Departments endpoints
  getEpcCogsDepartments() {
    return apiClient.get('/epc/masters-cogs-departments/')
  },
  createEpcCogsDepartment(data) {
    return apiClient.post('/epc/masters-cogs-departments/', data)
  },
  getEpcCogsDepartment(id) {
    return apiClient.get(`/epc/masters-cogs-departments/${id}/`)
  },
  updateEpcCogsDepartment(id, data) {
    return apiClient.put(`/epc/masters-cogs-departments/${id}/`, data)
  },
  patchEpcCogsDepartment(id, data) {
    return apiClient.patch(`/epc/masters-cogs-departments/${id}/`, data)
  },
  deleteEpcCogsDepartment(id) {
    return apiClient.delete(`/epc/masters-cogs-departments/${id}/`)
  },

  // Masters COGS Workplaces endpoints
  getEpcCogsWorkplaces() {
    return apiClient.get('/epc/masters-cogs-workplaces/')
  },
  createEpcCogsWorkplace(data) {
    return apiClient.post('/epc/masters-cogs-workplaces/', data)
  },
  getEpcCogsWorkplace(id) {
    return apiClient.get(`/epc/masters-cogs-workplaces/${id}/`)
  },
  updateEpcCogsWorkplace(id, data) {
    return apiClient.put(`/epc/masters-cogs-workplaces/${id}/`, data)
  },
  patchEpcCogsWorkplace(id, data) {
    return apiClient.patch(`/epc/masters-cogs-workplaces/${id}/`, data)
  },
  deleteEpcCogsWorkplace(id) {
    return apiClient.delete(`/epc/masters-cogs-workplaces/${id}/`)
  },

  // Masters CPD Activity endpoints (Commented out)
  // ...

  // Masters Document Types endpoints
  getEpcMastersDocumentTypes() {
    return apiClient.get('/epc/masters-document-types/')
  },
  createEpcMastersDocumentType(data) {
    return apiClient.post('/epc/masters-document-types/', data)
  },
  getEpcMastersDocumentType(id) {
    return apiClient.get(`/epc/masters-document-types/${id}/`)
  },
  updateEpcMastersDocumentType(id, data) {
    return apiClient.put(`/epc/masters-document-types/${id}/`, data)
  },
  patchEpcMastersDocumentType(id, data) {
    return apiClient.patch(`/epc/masters-document-types/${id}/`, data)
  },
  deleteEpcMastersDocumentType(id) {
    return apiClient.delete(`/epc/masters-document-types/${id}/`)
  },

  // Masters E-Signatures endpoints
  getEpcMastersESignatures() {
    return apiClient.get('/epc/masters-e-signatures/')
  },
  createEpcMastersESignature(data) {
    // E-Signatures have attachments, use FormData
    return apiClient.post('/epc/masters-e-signatures/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  getEpcMastersESignature(id) {
    return apiClient.get(`/epc/masters-e-signatures/${id}/`)
  },
  updateEpcMastersESignature(id, data) {
    // E-Signatures have attachments, use FormData
    return apiClient.put(`/epc/masters-e-signatures/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  patchEpcMastersESignature(id, data) {
    // E-Signatures have attachments, use FormData
    return apiClient.patch(`/epc/masters-e-signatures/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  deleteEpcMastersESignature(id) {
    return apiClient.delete(`/epc/masters-e-signatures/${id}/`)
  },

  // Masters Fee Structures endpoints
  getEpcMastersFeeStructures() {
    return apiClient.get('/epc/masters-fee-structures/')
  },
  createEpcMastersFeeStructure(data) {
    return apiClient.post('/epc/masters-fee-structures/', data)
  },
  getEpcMastersFeeStructure(id) {
    return apiClient.get(`/epc/masters-fee-structures/${id}/`)
  },
  updateEpcMastersFeeStructure(id, data) {
    return apiClient.put(`/epc/masters-fee-structures/${id}/`, data)
  },
  patchEpcMastersFeeStructure(id, data) {
    return apiClient.patch(`/epc/masters-fee-structures/${id}/`, data)
  },
  deleteEpcMastersFeeStructure(id) {
    return apiClient.delete(`/epc/masters-fee-structures/${id}/`)
  },

  // Masters Fees Associated For endpoints
  getEpcMastersFeesAssociatedFor() {
    return apiClient.get('/epc/masters-fees-associated-for/')
  },
  createEpcMastersFeesAssociatedFor(data) {
    return apiClient.post('/epc/masters-fees-associated-for/', data)
  },
  getEpcMastersFeesAssociatedForById(id) {
    return apiClient.get(`/epc/masters-fees-associated-for/${id}/`)
  },
  updateEpcMastersFeesAssociatedFor(id, data) {
    return apiClient.put(`/epc/masters-fees-associated-for/${id}/`, data)
  },
  patchEpcMastersFeesAssociatedFor(id, data) {
    return apiClient.patch(`/epc/masters-fees-associated-for/${id}/`, data)
  },
  deleteEpcMastersFeesAssociatedFor(id) {
    return apiClient.delete(`/epc/masters-fees-associated-for/${id}/`)
  },

  // Masters File Types endpoints
  getEpcMastersFileTypes() {
    return apiClient.get('/epc/masters-file-types/')
  },
  createEpcMastersFileType(data) {
    return apiClient.post('/epc/masters-file-types/', data)
  },
  getEpcMastersFileType(id) {
    return apiClient.get(`/epc/masters-file-types/${id}/`)
  },
  updateEpcMastersFileType(id, data) {
    return apiClient.put(`/epc/masters-file-types/${id}/`, data)
  },
  patchEpcMastersFileType(id, data) {
    return apiClient.patch(`/epc/masters-file-types/${id}/`, data)
  },
  deleteEpcMastersFileType(id) {
    return apiClient.delete(`/epc/masters-file-types/${id}/`)
  },

  // Masters Participation Category endpoints
  getEpcMastersParticipationCategories() {
    return apiClient.get('/epc/masters-participation-category/')
  },
  createEpcMastersParticipationCategory(data) {
    return apiClient.post('/epc/masters-participation-category/', data)
  },
  getEpcMastersParticipationCategory(id) {
    return apiClient.get(`/epc/masters-participation-category/${id}/`)
  },
  updateEpcMastersParticipationCategory(id, data) {
    return apiClient.put(`/epc/masters-participation-category/${id}/`, data)
  },
  patchEpcMastersParticipationCategory(id, data) {
    return apiClient.patch(`/epc/masters-participation-category/${id}/`, data)
  },
  deleteEpcMastersParticipationCategory(id) {
    return apiClient.delete(`/epc/masters-participation-category/${id}/`)
  },

  // Masters Participation Sub Category endpoints
  getEpcMastersParticipationSubCategories() {
    return apiClient.get('/epc/masters-participation-sub-category/')
  },
  createEpcMastersParticipationSubCategory(data) {
    return apiClient.post('/epc/masters-participation-sub-category/', data)
  },
  getEpcMastersParticipationSubCategory(id) {
    return apiClient.get(`/epc/masters-participation-sub-category/${id}/`)
  },
  updateEpcMastersParticipationSubCategory(id, data) {
    return apiClient.put(`/epc/masters-participation-sub-category/${id}/`, data)
  },
  patchEpcMastersParticipationSubCategory(id, data) {
    return apiClient.patch(`/epc/masters-participation-sub-category/${id}/`, data)
  },
  deleteEpcMastersParticipationSubCategory(id) {
    return apiClient.delete(`/epc/masters-participation-sub-category/${id}/`)
  },

  // Masters Personnel Categories endpoints
  getEpcMastersPersonnelCategories() {
    return apiClient.get('/epc/masters-personnel-categories/')
  },
  createEpcMastersPersonnelCategory(data) {
    return apiClient.post('/epc/masters-personnel-categories/', data)
  },
  getEpcMastersPersonnelCategory(id) {
    return apiClient.get(`/epc/masters-personnel-categories/${id}/`)
  },
  updateEpcMastersPersonnelCategory(id, data) {
    return apiClient.put(`/epc/masters-personnel-categories/${id}/`, data)
  },
  patchEpcMastersPersonnelCategory(id, data) {
    return apiClient.patch(`/epc/masters-personnel-categories/${id}/`, data)
  },
  deleteEpcMastersPersonnelCategory(id) {
    return apiClient.delete(`/epc/masters-personnel-categories/${id}/`)
  },

  // Masters Qualification Types endpoints
  getEpcMastersQualificationTypes() {
    return apiClient.get('/epc/masters-qualification-types/')
  },
  createEpcMastersQualificationType(data) {
    return apiClient.post('/epc/masters-qualification-types/', data)
  },
  getEpcMastersQualificationType(id) {
    return apiClient.get(`/epc/masters-qualification-types/${id}/`)
  },
  updateEpcMastersQualificationType(id, data) {
    return apiClient.put(`/epc/masters-qualification-types/${id}/`, data)
  },
  patchEpcMastersQualificationType(id, data) {
    return apiClient.patch(`/epc/masters-qualification-types/${id}/`, data)
  },
  deleteEpcMastersQualificationType(id) {
    return apiClient.delete(`/epc/masters-qualification-types/${id}/`)
  },

  // Masters Qualifications endpoints
  getEpcMastersQualifications() {
    return apiClient.get('/epc/masters-qualifications/')
  },
  createEpcMastersQualification(data) {
    return apiClient.post('/epc/masters-qualifications/', data)
  },
  getEpcMastersQualification(id) {
    return apiClient.get(`/epc/masters-qualifications/${id}/`)
  },
  updateEpcMastersQualification(id, data) {
    return apiClient.put(`/epc/masters-qualifications/${id}/`, data)
  },
  patchEpcMastersQualification(id, data) {
    return apiClient.patch(`/epc/masters-qualifications/${id}/`, data)
  },
  deleteEpcMastersQualification(id) {
    return apiClient.delete(`/epc/masters-qualifications/${id}/`)
  },

  // Masters Registration Type endpoints
  getEpcMastersRegistrationTypes() {
    return apiClient.get('/epc/masters-registration-type/')
  },
  createEpcMastersRegistrationType(data) {
    return apiClient.post('/epc/masters-registration-type/', data)
  },
  getEpcMastersRegistrationType(id) {
    return apiClient.get(`/epc/masters-registration-type/${id}/`)
  },
  updateEpcMastersRegistrationType(id, data) {
    return apiClient.put(`/epc/masters-registration-type/${id}/`, data)
  },
  patchEpcMastersRegistrationType(id, data) {
    return apiClient.patch(`/epc/masters-registration-type/${id}/`, data)
  },
  deleteEpcMastersRegistrationType(id) {
    return apiClient.delete(`/epc/masters-registration-type/${id}/`)
  },

  // Masters Sector endpoints
  getEpcMastersSectors() {
    return apiClient.get('/epc/masters-sector/')
  },
  createEpcMastersSector(data) {
    return apiClient.post('/epc/masters-sector/', data)
  },
  getEpcMastersSector(id) {
    return apiClient.get(`/epc/masters-sector/${id}/`)
  },
  updateEpcMastersSector(id, data) {
    return apiClient.put(`/epc/masters-sector/${id}/`, data)
  },
  patchEpcMastersSector(id, data) {
    return apiClient.patch(`/epc/masters-sector/${id}/`, data)
  },
  deleteEpcMastersSector(id) {
    return apiClient.delete(`/epc/masters-sector/${id}/`)
  },

  // Masters Sub Categories endpoints
  getEpcMastersSubCategories() {
    return apiClient.get('/epc/masters-sub-categories/')
  },
  createEpcMastersSubCategory(data) {
    return apiClient.post('/epc/masters-sub-categories/', data)
  },
  getEpcMastersSubCategory(id) {
    return apiClient.get(`/epc/masters-sub-categories/${id}/`)
  },
  updateEpcMastersSubCategory(id, data) {
    return apiClient.put(`/epc/masters-sub-categories/${id}/`, data)
  },
  patchEpcMastersSubCategory(id, data) {
    return apiClient.patch(`/epc/masters-sub-categories/${id}/`, data)
  },
  deleteEpcMastersSubCategory(id) {
    return apiClient.delete(`/epc/masters-sub-categories/${id}/`)
  },

  // Masters University endpoints
  getEpcMastersUniversities() {
    return apiClient.get('/epc/masters-university/')
  },
  createEpcMastersUniversity(data) {
    return apiClient.post('/epc/masters-university/', data)
  },
  getEpcMastersUniversity(id) {
    return apiClient.get(`/epc/masters-university/${id}/`)
  },
  updateEpcMastersUniversity(id, data) {
    return apiClient.put(`/epc/masters-university/${id}/`, data)
  },
  patchEpcMastersUniversity(id, data) {
    return apiClient.patch(`/epc/masters-university/${id}/`, data)
  },
  deleteEpcMastersUniversity(id) {
    return apiClient.delete(`/epc/masters-university/${id}/`)
  },


  // Helper methods for common operations
  getApplicationWithCid(cid) {
    return apiClient.get(`/epc/epc-new-application/?cid=${cid}`)
  },

  // Generic function to fetch master data
  getEpcMasterData(masterDataType) {
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
      // Add other master data types as needed
      case 'institutes': // Example for fetching institutes
        endpoint = '/epc/epc-institutes/'
        break
      default:
        console.error(
          `Master data type "${masterDataType}" is not supported in getEpcMasterData function.`,
        )
        return Promise.reject(`Master data type "${masterDataType}" is not supported.`)
    }
    return apiClient.get(endpoint)
  },
  // ========================================================================
  // === ADD THE NEW FUNCTION HERE AT THE END OF THE FILE ===================
  // ========================================================================
  /**
   * Updates the profile for the currently authenticated user.
   * Sends a PATCH request to the new endpoint we created in the Django `users` app.
   * @param {number} userId - The user's ID (the backend will ignore this and use request.user, but it's good practice to accept it).
   * @param {FormData} formData - The profile data to update (e.g., village, gewog, work_address).
   * @returns {Promise} - The axios promise.
   */
  updateProfile(userId, formData) {
    // The URL '/users/profile/update/' matches the new endpoint created in Django's `users` app.
    // We use .patch for partial updates.
    return apiClient.patch(`/users/profile/update/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  // ========================================================================
  // ========================================================================

}
