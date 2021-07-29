<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
      aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Backdrop overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true"
          @click="closeModal"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>

        <div
          class="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <!-- Header with sticky positioning -->
          <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 sticky top-0 z-10">
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-bold text-white" id="modal-title">
                Institute Profile Details
              </h3>
              <button @click="closeModal" class="text-white hover:text-gray-200 focus:outline-none">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p class="text-blue-100 mt-1 text-sm">
              Complete information about the institute profile
            </p>
          </div>

          <!-- Tabbed navigation -->
          <div class="bg-gray-50 border-b border-gray-200 px-6">
            <div class="flex space-x-4 overflow-x-auto">
              <button v-for="(tab, index) in tabs" :key="index" @click="activeTab = index"
                class="py-3 px-2 text-sm font-medium whitespace-nowrap border-b-2 focus:outline-none" :class="activeTab === index
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ">
                {{ tab }}
              </button>
            </div>
          </div>

          <!-- Content area with improved scrolling -->
          <div class="bg-white px-6 py-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <!-- Basic Information -->
            <div v-show="activeTab === 0" class="space-y-6">
              <div class="bg-blue-50 p-4 rounded-lg">
                <h4 class="text-md font-semibold text-blue-800 mb-3 flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Basic Information
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-4">
                    <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                      <label class="block text-xs font-medium text-gray-500">CID</label>
                      <div class="mt-1 text-sm font-medium text-gray-900">
                        {{ instituteDetails.cid || 'Not available' }}
                      </div>
                    </div>
                    <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                      <label class="block text-xs font-medium text-gray-500">Full Name</label>
                      <div class="mt-1 text-sm font-medium text-gray-900">
                        {{ instituteDetails.full_name || 'Not available' }}
                      </div>
                    </div>
                    <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                      <label class="block text-xs font-medium text-gray-500">Gender</label>
                      <div class="mt-1 text-sm font-medium text-gray-900">
                        {{ instituteDetails.gender || 'Not available' }}
                      </div>
                    </div>
                  </div>
                  <div class="space-y-4">
                    <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                      <label class="block text-xs font-medium text-gray-500">Contact Number</label>
                      <div class="mt-1 text-sm font-medium text-gray-900">
                        {{ instituteDetails.contact_no || 'Not available' }}
                      </div>
                    </div>
                    <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                      <label class="block text-xs font-medium text-gray-500">Email Address</label>
                      <div class="mt-1 text-sm font-medium text-gray-900">
                        {{ instituteDetails.email_address || 'Not available' }}
                      </div>
                    </div>
                    <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                      <label class="block text-xs font-medium text-gray-500">Institution Name</label>
                      <div class="mt-1 text-sm font-medium text-gray-900">
                        {{ instituteDetails.name_of_institution || 'Not available' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-indigo-50 p-4 rounded-lg">
                <h4 class="text-md font-semibold text-indigo-800 mb-3 flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Location Details
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Country</label>
                    <div class="mt-1 text-sm font-medium text-gray-900">
                      {{ instituteDetails.country || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Dzongkhag</label>
                    <div class="mt-1 text-sm font-medium text-gray-900">
                      {{ instituteDetails.dzongkhag || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Gewog</label>
                    <div class="mt-1 text-sm font-medium text-gray-900">
                      {{ instituteDetails.gewog || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Village</label>
                    <div class="mt-1 text-sm font-medium text-gray-900">
                      {{ instituteDetails.village || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Chiwog</label>
                    <div class="mt-1 text-sm font-medium text-gray-900">
                      {{ instituteDetails.chiwog || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Address</label>
                    <div class="mt-1 text-sm font-medium text-gray-900">
                      {{ instituteDetails.address || 'Not available' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Course & Program -->
            <div v-show="activeTab === 1" class="space-y-6">
              <div class="bg-emerald-50 p-4 rounded-lg">
                <h4 class="text-md font-semibold text-emerald-800 mb-3 flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Course & Program Details
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Teaching Institute</label>
                    <div class="mt-1 text-sm font-medium text-gray-900">
                      {{ instituteDetails.teaching_institute || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Title of Course</label>
                    <div class="mt-1 text-sm font-medium text-gray-900">
                      {{ instituteDetails.title_of_course || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Course Duration</label>
                    <div class="mt-1 text-sm font-medium text-gray-900">
                      {{ instituteDetails.course_duration || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Type of Programme</label>
                    <div class="mt-1 text-sm font-medium text-gray-900">
                      {{ instituteDetails.type_of_programme || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Commencement Date</label>
                    <div class="mt-1 text-sm font-medium text-gray-900">
                      {{ formatDate(instituteDetails.commencement_date) || 'Not available' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Status & Review -->
            <div v-show="activeTab === 2" class="space-y-6">
              <div class="bg-amber-50 p-4 rounded-lg">
                <h4 class="text-md font-semibold text-amber-800 mb-3 flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Review & Status
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Review Decision</label>
                    <div class="mt-1">
                      <span class="px-2 py-1 text-xs font-medium rounded-full" :class="{
                        'bg-green-100 text-green-800':
                          instituteDetails.do_dpr_review_decision === 'Approved',
                        'bg-red-100 text-red-800':
                          instituteDetails.do_dpr_review_decision === 'Rejected',
                        'bg-yellow-100 text-yellow-800':
                          !instituteDetails.do_dpr_review_decision ||
                          instituteDetails.do_dpr_review_decision === 'Pending',
                      }">
                        {{ getStatusText(instituteDetails.do_dpr_review_decision) }}
                      </span>
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Is Active</label>
                    <div class="mt-1">
                      <span class="px-2 py-1 text-xs font-medium rounded-full" :class="instituteDetails.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                        ">
                        {{ instituteDetails.is_active ? 'Yes' : 'No' }}
                      </span>
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Valid Till</label>
                    <div class="mt-1 text-sm font-medium text-gray-900">
                      {{ formatDate(instituteDetails.valid_till) || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Payment Status</label>
                    <div class="mt-1">
                      <span class="px-2 py-1 text-xs font-medium rounded-full" :class="instituteDetails.is_payment_complete
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                        ">
                        {{ instituteDetails.is_payment_complete ? 'Completed' : 'Pending' }}
                      </span>
                    </div>
                  </div>
                  <div v-if="instituteDetails.do_dpr_review_decision === 'Rejected'"
                    class="sm:col-span-2 bg-white p-3 rounded shadow-sm border border-red-200">
                    <label class="block text-xs font-medium text-red-500">Rejection Reason</label>
                    <div class="mt-1 text-sm text-red-700">
                      {{ instituteDetails.do_dpr_reason_if_rejected || 'No reason provided' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contact & Website -->
            <div v-show="activeTab === 3" class="space-y-6">
              <div class="bg-purple-50 p-4 rounded-lg">
                <h4 class="text-md font-semibold text-purple-800 mb-3 flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  Contact & Website
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Website</label>
                    <div class="mt-1">
                      <a v-if="instituteDetails.website" :href="instituteDetails.website" target="_blank"
                        class="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline">
                        {{ instituteDetails.website }}
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                      <span v-else class="text-sm text-gray-500">Not available</span>
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Head of Institution</label>
                    <div class="mt-1 text-sm font-medium text-gray-900">
                      {{ instituteDetails.head_of_institution_name || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Head's Gender</label>
                    <div class="mt-1 text-sm font-medium text-gray-900">
                      {{ instituteDetails.head_of_institution_gender || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Head's Phone</label>
                    <div class="mt-1 text-sm font-medium text-gray-900">
                      {{ instituteDetails.head_of_institution_phone_number || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Head's Email</label>
                    <div class="mt-1 text-sm font-medium text-gray-900">
                      {{ instituteDetails.head_of_institution_email || 'Not available' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Documents -->
            <div v-show="activeTab === 4" class="space-y-6">
              <div class="bg-red-50 p-4 rounded-lg">
                <h4 class="text-md font-semibold text-red-800 mb-3 flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Documents & Reports
                </h4>
                <div class="grid grid-cols-1 gap-4">
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                      <label class="block text-xs font-medium text-gray-500">Supporting Documents</label>
                      <div class="mt-1 text-sm font-medium text-gray-900">
                        {{ instituteDetails.supporting_documents ? 'Available' : 'Not available' }}
                      </div>
                    </div>
                    <a v-if="instituteDetails.supporting_documents" :href="instituteDetails.supporting_documents"
                      target="_blank"
                      class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </a>
                  </div>

                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                      <label class="block text-xs font-medium text-gray-500">EOI Documents</label>
                      <div class="mt-1 text-sm font-medium text-gray-900">
                        {{
                          instituteDetails.institute_eoi_supporting_documents
                            ? 'Available'
                            : 'Not available'
                        }}
                      </div>
                    </div>
                    <a v-if="instituteDetails.institute_eoi_supporting_documents"
                      :href="instituteDetails.institute_eoi_supporting_documents" target="_blank"
                      class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </a>
                  </div>

                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                      <label class="block text-xs font-medium text-gray-500">DPR Report</label>
                      <div class="mt-1 text-sm font-medium text-gray-900">
                        {{ instituteDetails.do_dpr_report ? 'Available' : 'Not available' }}
                      </div>
                    </div>
                    <a v-if="instituteDetails.do_dpr_report" :href="instituteDetails.do_dpr_report" target="_blank"
                      class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </a>
                  </div>

                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                      <label class="block text-xs font-medium text-gray-500">DPR Review Report</label>
                      <div class="mt-1 text-sm font-medium text-gray-900">
                        {{ instituteDetails.do_dpr_review_report ? 'Available' : 'Not available' }}
                      </div>
                    </div>
                    <a v-if="instituteDetails.do_dpr_review_report" :href="instituteDetails.do_dpr_review_report"
                      target="_blank"
                      class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Remarks & Summaries -->
            <div v-show="activeTab === 5" class="space-y-6">
              <div class="bg-teal-50 p-4 rounded-lg">
                <h4 class="text-md font-semibold text-teal-800 mb-3 flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  Remarks & Summaries
                </h4>
                <div class="grid grid-cols-1 gap-4">
                  <div v-if="instituteDetails.remarks" class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Remarks</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ instituteDetails.remarks || 'Not available' }}
                    </div>
                  </div>
                  <div v-if="instituteDetails.declaration"
                    class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Declaration</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ instituteDetails.declaration || 'Not available' }}
                    </div>
                  </div>
                  <div v-if="instituteDetails.executive_summary"
                    class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Executive Summary</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ instituteDetails.executive_summary || 'Not available' }}
                    </div>
                  </div>
                  <div v-if="instituteDetails.do_dpr_review_summary"
                    class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label for="dpr-review-summary" class="block text-xs font-medium text-gray-500">DPR Review
                      Summary</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ instituteDetails.do_dpr_review_summary || 'Not available' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- other details tab -->
            <div v-show="activeTab === 6" class="space-y-6">
              <div class="bg-yellow-50 p-4 rounded-lg">
                <h4 class="text-md font-semibold text-yellow-800 mb-3 flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7">
                    </path>
                  </svg>
                  Other Details
                </h4>

                <div class="space-y-4">
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Vision, Mission and Implementation
                      strategies</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{
                        instituteDetails.vision_mission_implementation_strategies || 'Not available'
                      }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Project scheduling, implementation and
                      management</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{
                        instituteDetails.project_scheduling_implementation_management ||
                        'Not available'
                      }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Values of Gross National Happiness</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ instituteDetails.values_of_gross_national_happiness || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Land</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ instituteDetails.land || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Conceptual Master plan</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ instituteDetails.conceptual_master_plan || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Academic Plan/Profile</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ instituteDetails.academic_plan_profile || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Affiliation</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ instituteDetails.affiliation || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Teaching Hospital</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ instituteDetails.teaching_hospital || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Research Policy</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ instituteDetails.research_policy || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Human Resource</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ instituteDetails.human_resource || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Quality Assurance System</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ instituteDetails.quality_assurance_system || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Governance Structure</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ instituteDetails.governance_structure || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Business Plan</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ instituteDetails.business_plan || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Project cost and Analysis</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ instituteDetails.project_cost_and_analysis || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Facilities and Student Services</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ instituteDetails.facilities_and_student_services || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Admission Policy and Scholarships</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ instituteDetails.admission_policy_and_scholarships || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Service conditions</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ instituteDetails.service_conditions || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Safety and Security</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ instituteDetails.safety_and_security || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Public Information System</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ instituteDetails.public_information_system || 'Not available' }}
                    </div>
                  </div>
                  <div class="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <label class="block text-xs font-medium text-gray-500">Others</label>
                    <div class="mt-1 text-sm text-gray-900">
                      {{ instituteDetails.others || 'Not available' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-4 flex justify-end">
            <button @click="closeModal"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  instituteDetails: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['close-modal'])

const closeModal = () => {
  emit('close-modal')
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getStatusText = (decision) => {
  switch (decision) {
    case 'Approved':
      return 'Approved'
    case 'Rejected':
      return 'Rejected'
    default:
      return 'Pending'
  }
}

const tabs = ref([
  'Basic Information',
  'Course & Program',
  'Status & Review',
  'Contact & Website',
  'Documents',
  'Remarks & Summaries',
  'Other Details',
])
const activeTab = ref(0)

//for demonstration purpose
onMounted(() => {
  if (!props.isOpen) {
    activeTab.value = 0
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
