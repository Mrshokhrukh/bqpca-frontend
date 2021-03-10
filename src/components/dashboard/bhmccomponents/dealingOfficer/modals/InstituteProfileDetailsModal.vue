<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
      aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal">
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <!-- Increased max-w-3xl for wider modal -->
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Institute Profile Details
                </h3>
                <div class="mt-4">
                  <p class="text-sm text-gray-500">
                    View detailed information about the institute profile.
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Using sm:grid-cols-2 for better layout on larger screens -->
              <div>
                <h4 class="text-md font-semibold text-gray-700 mb-2">Basic Information</h4>
                <div>
                  <label for="cid" class="block text-sm font-medium text-gray-700">CID</label>
                  <div class="mt-1">
                    <input type="text" id="cid" :value="instituteDetails.cid"
                      class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      disabled>
                  </div>
                </div>
                <div>
                  <label for="full-name" class="block text-sm font-medium text-gray-700">Full name</label>
                  <div class="mt-1">
                    <input type="text" id="full-name" :value="instituteDetails.full_name"
                      class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      disabled>
                  </div>
                </div>
                <div>
                  <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
                  <div class="mt-1">
                    <input type="text" id="gender" :value="instituteDetails.gender"
                      class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      disabled>
                  </div>
                </div>
                <div>
                  <label for="contact-no" class="block text-sm font-medium text-gray-700">Contact no</label>
                  <div class="mt-1">
                    <input type="text" id="contact-no" :value="instituteDetails.contact_no"
                      class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      disabled>
                  </div>
                </div>
                <div>
                  <label for="email-address" class="block text-sm font-medium text-gray-700">Email address</label>
                  <div class="mt-1">
                    <input type="email" id="email-address" :value="instituteDetails.email_address"
                      class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      disabled>
                  </div>
                </div>
                <div>
                  <label for="institution-name" class="block text-sm font-medium text-gray-700">Name of
                    institution</label>
                  <div class="mt-1">
                    <input type="text" id="institution-name" :value="instituteDetails.name_of_institution"
                      class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      disabled>
                  </div>
                </div>
                <div>
                  <label for="country" class="block text-sm font-medium text-gray-700">Country</label>
                  <div class="mt-1">
                    <input type="text" id="country" :value="instituteDetails.country"
                      class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      disabled>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="text-md font-semibold text-gray-700 mb-2">Location Details</h4>
                <div>
                  <label for="gewog" class="block text-sm font-medium text-gray-700">Gewog</label>
                  <div class="mt-1">
                    <input type="text" id="gewog" :value="instituteDetails.gewog"
                      class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      disabled>
                  </div>
                </div>
                <div>
                  <label for="dzongkhag" class="block text-sm font-medium text-gray-700">Dzongkhag</label>
                  <div class="mt-1">
                    <input type="text" id="dzongkhag" :value="instituteDetails.dzongkhag"
                      class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      disabled>
                  </div>
                </div>
                <div>
                  <label for="village" class="block text-sm font-medium text-gray-700">Village</label>
                  <div class="mt-1">
                    <input type="text" id="village" :value="instituteDetails.village"
                      class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      disabled>
                  </div>
                </div>
                <div>
                  <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
                  <div class="mt-1">
                    <input type="text" id="address" :value="instituteDetails.address"
                      class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      disabled>
                  </div>
                </div>
                <div>
                  <label for="chiwog" class="block text-sm font-medium text-gray-700">Chiwog</label>
                  <div class="mt-1">
                    <input type="text" id="chiwog" :value="instituteDetails.chiwog"
                      class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      disabled>
                  </div>
                </div>
              </div>

              <div class="sm:col-span-2"> <!-- Span two columns on larger screens -->
                <h4 class="text-md font-semibold text-gray-700 mb-2">Course & Program Details</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="teaching-institute" class="block text-sm font-medium text-gray-700">Teaching
                      institute</label>
                    <div class="mt-1">
                      <input type="text" id="teaching-institute" :value="instituteDetails.teaching_institute"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled>
                    </div>
                  </div>
                  <div>
                    <label for="title-of-course" class="block text-sm font-medium text-gray-700">Title of course</label>
                    <div class="mt-1">
                      <input type="text" id="title-of-course" :value="instituteDetails.title_of_course"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled>
                    </div>
                  </div>
                  <div>
                    <label for="course-duration" class="block text-sm font-medium text-gray-700">Course duration</label>
                    <div class="mt-1">
                      <input type="text" id="course-duration" :value="instituteDetails.course_duration"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled>
                    </div>
                  </div>
                  <div>
                    <label for="commencement-date" class="block text-sm font-medium text-gray-700">Commencement
                      date</label>
                    <div class="mt-1">
                      <input type="text" id="commencement-date" :value="formatDate(instituteDetails.commencement_date)"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled>
                    </div>
                  </div>
                  <div>
                    <label for="type-of-programme" class="block text-sm font-medium text-gray-700">Type of
                      programme</label>
                    <div class="mt-1">
                      <input type="text" id="type-of-programme" :value="instituteDetails.type_of_programme"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled>
                    </div>
                  </div>
                </div>
              </div>

              <div class="sm:col-span-2">
                <h4 class="text-md font-semibold text-gray-700 mb-2">Review & Status</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="review-decision" class="block text-sm font-medium text-gray-700">Review decision</label>
                    <div class="mt-1">
                      <input type="text" id="review-decision"
                        :value="getStatusText(instituteDetails.do_dpr_review_decision)"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled>
                    </div>
                  </div>
                  <div v-if="instituteDetails.do_dpr_review_decision === 'Rejected'">
                    <label for="rejection-reason" class="block text-sm font-medium text-gray-700">Reason if
                      rejected</label>
                    <div class="mt-1">
                      <textarea id="rejection-reason" :value="instituteDetails.do_dpr_reason_if_rejected" rows="2"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled></textarea>
                    </div>
                  </div>
                  <div>
                    <label for="is-active" class="block text-sm font-medium text-gray-700">Is active</label>
                    <div class="mt-1">
                      <input type="text" id="is-active" :value="instituteDetails.is_active ? 'Yes' : 'No'"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled>
                    </div>
                  </div>
                  <div>
                    <label for="valid-till" class="block text-sm font-medium text-gray-700">Valid till</label>
                    <div class="mt-1">
                      <input type="text" id="valid-till" :value="formatDate(instituteDetails.valid_till)"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled>
                    </div>
                  </div>
                  <div>
                    <label for="payment-id" class="block text-sm font-medium text-gray-700">Payment id</label>
                    <div class="mt-1">
                      <input type="text" id="payment-id" :value="instituteDetails.payment_id"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled>
                    </div>
                  </div>
                  <div>
                    <label for="is-payment-complete" class="block text-sm font-medium text-gray-700">Is payment
                      complete</label>
                    <div class="mt-1">
                      <input type="text" id="is-payment-complete"
                        :value="instituteDetails.is_payment_complete ? 'Yes' : 'No'"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled>
                    </div>
                  </div>
                  <div>
                    <label for="is-physical-verification" class="block text-sm font-medium text-gray-700">Is physical
                      verification</label>
                    <div class="mt-1">
                      <input type="text" id="is-physical-verification"
                        :value="instituteDetails.is_physical_verification ? 'Yes' : 'No'"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled>
                    </div>
                  </div>
                </div>
              </div>

              <div class="sm:col-span-2">
                <h4 class="text-md font-semibold text-gray-700 mb-2">Contact & Website</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="website" class="block text-sm font-medium text-gray-700">Website</label>
                    <div class="mt-1">
                      <a :href="instituteDetails.website" target="_blank" v-if="instituteDetails.website"
                        class="text-blue-600 hover:text-blue-800">{{ instituteDetails.website }}</a>
                      <span v-else class="text-gray-500">Not available</span>
                    </div>
                  </div>
                  <div>
                    <label for="head-name" class="block text-sm font-medium text-gray-700">Head of institution
                      name</label>
                    <div class="mt-1">
                      <input type="text" id="head-name" :value="instituteDetails.head_of_institution_name"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled>
                    </div>
                  </div>
                  <div>
                    <label for="head-gender" class="block text-sm font-medium text-gray-700">Head of institution
                      gender</label>
                    <div class="mt-1">
                      <input type="text" id="head-gender" :value="instituteDetails.head_of_institution_gender"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled>
                    </div>
                  </div>
                  <div>
                    <label for="head-phone" class="block text-sm font-medium text-gray-700">Head of institution
                      phone</label>
                    <div class="mt-1">
                      <input type="text" id="head-phone" :value="instituteDetails.head_of_institution_phone_number"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled>
                    </div>
                  </div>
                  <div>
                    <label for="head-email" class="block text-sm font-medium text-gray-700">Head of institution
                      email</label>
                    <div class="mt-1">
                      <input type="email" id="head-email" :value="instituteDetails.head_of_institution_email"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled>
                    </div>
                  </div>
                </div>
              </div>

              <div class="sm:col-span-2">
                <h4 class="text-md font-semibold text-gray-700 mb-2">Documents & Reports</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="supporting-docs" class="block text-sm font-medium text-gray-700">Supporting
                      documents</label>
                    <div class="mt-1">
                      <a :href="instituteDetails.supporting_documents" target="_blank"
                        v-if="instituteDetails.supporting_documents" class="text-blue-600 hover:text-blue-800">View
                        Documents</a>
                      <span v-else class="text-gray-500">No documents available</span>
                    </div>
                  </div>
                  <div>
                    <label for="eoi-docs" class="block text-sm font-medium text-gray-700">Institute eoi supporting
                      documents</label>
                    <div class="mt-1">
                      <a :href="instituteDetails.institute_eoi_supporting_documents" target="_blank"
                        v-if="instituteDetails.institute_eoi_supporting_documents"
                        class="text-blue-600 hover:text-blue-800">View EOI Documents</a>
                      <span v-else class="text-gray-500">No EOI documents</span>
                    </div>
                  </div>
                  <div>
                    <label for="dpr-report-link" class="block text-sm font-medium text-gray-700">Do dpr report</label>
                    <div class="mt-1">
                      <a :href="instituteDetails.do_dpr_report" target="_blank" v-if="instituteDetails.do_dpr_report"
                        class="text-blue-600 hover:text-blue-800">View DPR Report</a>
                      <span v-else class="text-gray-500">No DPR report</span>
                    </div>
                  </div>
                  <div>
                    <label for="dpr-review-report-link" class="block text-sm font-medium text-gray-700">Do dpr review
                      report</label>
                    <div class="mt-1">
                      <a :href="instituteDetails.do_dpr_review_report" target="_blank"
                        v-if="instituteDetails.do_dpr_review_report" class="text-blue-600 hover:text-blue-800">View DPR
                        Review Report</a>
                      <span v-else class="text-gray-500">No DPR review report</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="sm:col-span-2">
                <h4 class="text-md font-semibold text-gray-700 mb-2">Remarks & Summaries</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="remarks" class="block text-sm font-medium text-gray-700">Remarks</label>
                    <div class="mt-1">
                      <textarea id="remarks" :value="instituteDetails.remarks" rows="2"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled></textarea>
                    </div>
                  </div>
                  <div>
                    <label for="declaration" class="block text-sm font-medium text-gray-700">Declaration</label>
                    <div class="mt-1">
                      <textarea id="declaration" :value="instituteDetails.declaration" rows="2"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled></textarea>
                    </div>
                  </div>
                  <div>
                    <label for="executive-summary" class="block text-sm font-medium text-gray-700">Executive
                      summary</label>
                    <div class="mt-1">
                      <textarea id="executive-summary" :value="instituteDetails.executive_summary" rows="2"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled></textarea>
                    </div>
                  </div>
                  <div>
                    <label for="dpr-review-summary" class="block text-sm font-medium text-gray-700">Do dpr review
                      summary</label>
                    <div class="mt-1">
                      <textarea id="dpr-review-summary" :value="instituteDetails.do_dpr_review_summary" rows="2"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled></textarea>
                    </div>
                  </div>
                  <div>
                    <label for="institute-dpr-remarks" class="block text-sm font-medium text-gray-700">Institute dpr
                      remarks</label>
                    <div class="mt-1">
                      <textarea id="institute-dpr-remarks" :value="instituteDetails.institute_dpr_remarks" rows="2"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div class="sm:col-span-2">
                <h4 class="text-md font-semibold text-gray-700 mb-2">Other Details</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="vision" class="block text-sm font-medium text-gray-700">Vision, Mission and
                      Implementation strategies</label>
                    <div class="mt-1">
                      <textarea id="vision" :value="instituteDetails.vision_mission_implementation_strategies" rows="2"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled></textarea>
                    </div>
                  </div>
                  <div>
                    <label for="project-scheduling" class="block text-sm font-medium text-gray-700">Project scheduling,
                      implementation and management</label>
                    <div class="mt-1">
                      <textarea id="project-scheduling"
                        :value="instituteDetails.project_scheduling_implementation_management" rows="2"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled></textarea>
                    </div>
                  </div>
                  <div>
                    <label for="gnh-values" class="block text-sm font-medium text-gray-700">Values of Gross National
                      Happiness</label>
                    <div class="mt-1">
                      <textarea id="gnh-values" :value="instituteDetails.values_of_gross_national_happiness" rows="2"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled></textarea>
                    </div>
                  </div>
                  <div>
                    <label for="land" class="block text-sm font-medium text-gray-700">Land</label>
                    <div class="mt-1">
                      <textarea id="land" :value="instituteDetails.land" rows="2"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled></textarea>
                    </div>
                  </div>
                  <div>
                    <label for="master-plan" class="block text-sm font-medium text-gray-700">Conceptual Master
                      plan</label>
                    <div class="mt-1">
                      <textarea id="master-plan" :value="instituteDetails.conceptual_master_plan" rows="2"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled></textarea>
                    </div>
                  </div>
                  <div>
                    <label for="academic-plan" class="block text-sm font-medium text-gray-700">Academic
                      Plan/Profile</label>
                    <div class="mt-1">
                      <textarea id="academic-plan" :value="instituteDetails.academic_plan_profile" rows="2"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled></textarea>
                    </div>
                  </div>
                  <div>
                    <label for="affiliation" class="block text-sm font-medium text-gray-700">Affiliation</label>
                    <div class="mt-1">
                      <textarea id="affiliation" :value="instituteDetails.affiliation" rows="2"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled></textarea>
                    </div>
                  </div>
                  <div>
                    <label for="teaching-hospital-modal" class="block text-sm font-medium text-gray-700">Teaching
                      Hospital</label>
                    <div class="mt-1">
                      <input type="text" id="teaching-hospital-modal" :value="instituteDetails.teaching_hospital"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled>
                    </div>
                  </div>
                  <div>
                    <label for="research-policy" class="block text-sm font-medium text-gray-700">Research Policy</label>
                    <div class="mt-1">
                      <textarea id="research-policy" :value="instituteDetails.research_policy" rows="2"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled></textarea>
                    </div>
                  </div>
                  <div>
                    <label for="hr" class="block text-sm font-medium text-gray-700">Human Resource</label>
                    <div class="mt-1">
                      <textarea id="hr" :value="instituteDetails.human_resource" rows="2"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled></textarea>
                    </div>
                  </div>
                  <div>
                    <label for="qa-system" class="block text-sm font-medium text-gray-700">Quality Assurance
                      System</label>
                    <div class="mt-1">
                      <textarea id="qa-system" :value="instituteDetails.quality_assurance_system" rows="2"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled></textarea>
                    </div>
                  </div>
                  <div>
                    <label for="governance-structure" class="block text-sm font-medium text-gray-700">Governance
                      Structure</label>
                    <div class="mt-1">
                      <textarea id="governance-structure" :value="instituteDetails.governance_structure" rows="2"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled></textarea>
                    </div>
                  </div>
                  <div>
                    <label for="business-plan" class="block text-sm font-medium text-gray-700">Business Plan</label>
                    <div class="mt-1">
                      <textarea id="business-plan" :value="instituteDetails.business_plan" rows="2"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled></textarea>
                    </div>
                  </div>
                  <div>
                    <label for="project-cost" class="block text-sm font-medium text-gray-700">Project cost and
                      Analysis</label>
                    <div class="mt-1">
                      <textarea id="project-cost" :value="instituteDetails.project_cost_and_analysis" rows="2"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled></textarea>
                    </div>
                  </div>
                  <div>
                    <label for="facilities" class="block text-sm font-medium text-gray-700">Facilities and Student
                      Services</label>
                    <div class="mt-1">
                      <textarea id="facilities" :value="instituteDetails.facilities_and_student_services" rows="2"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled></textarea>
                    </div>
                  </div>
                  <div>
                    <label for="admission-policy" class="block text-sm font-medium text-gray-700">Admission Policy and
                      Scholarships</label>
                    <div class="mt-1">
                      <textarea id="admission-policy" :value="instituteDetails.admission_policy_and_scholarships"
                        rows="2"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled></textarea>
                    </div>
                  </div>
                  <div>
                    <label for="service-conditions" class="block text-sm font-medium text-gray-700">Service
                      conditions</label>
                    <div class="mt-1">
                      <textarea id="service-conditions" :value="instituteDetails.service_conditions" rows="2"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled></textarea>
                    </div>
                  </div>
                  <div>
                    <label for="safety-security" class="block text-sm font-medium text-gray-700">Safety and
                      Security</label>
                    <div class="mt-1">
                      <textarea id="safety-security" :value="instituteDetails.safety_and_security" rows="2"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled></textarea>
                    </div>
                  </div>
                  <div>
                    <label for="public-info-system" class="block text-sm font-medium text-gray-700">Public Information
                      System</label>
                    <div class="mt-1">
                      <textarea id="public-info-system" :value="instituteDetails.public_information_system" rows="2"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled></textarea>
                    </div>
                  </div>
                  <div>
                    <label for="others" class="block text-sm font-medium text-gray-700">Others</label>
                    <div class="mt-1">
                      <textarea id="others" :value="instituteDetails.others" rows="2"
                        class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        disabled></textarea>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="closeModal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>

defineProps({
  isOpen: Boolean,
  instituteDetails: {
    type: Object,
    default: () => ({}) // Default to empty object if no details are passed
  }
});

const emit = defineEmits(['close-modal']);

const closeModal = () => {
  emit('close-modal');
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getStatusText = (decision) => {
  switch (decision) {
    case 'Approved':
      return 'Approved';
    case 'Rejected':
      return 'Rejected';
    default:
      return 'Pending';
  }
};
</script>
