```vue
<template>
  <div
    v-if="isOpen"
    class="fixed z-20 inset-0 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div
        class="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        @click="closeModal"
      ></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"> </span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6">
          <div class="sm:flex sm:items-start w-full">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <div class="flex justify-between items-center mb-4 pb-3 border-b">
                <h3 class="text-xl leading-6 font-semibold text-gray-900" id="modal-title">
                  Teaching Center Application Review
                </h3>
                <span
                  v-if="hospitalDetails.tc_review_decision"
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="statusBadgeClass"
                >
                  {{ formattedStatus(hospitalDetails.tc_review_decision) }}
                </span>
                <span v-else class="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pending Review
                </span>
              </div>

              <div class="max-h-[70vh] overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                <!-- Proponent Details Section -->
                <section class="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                  <h4 class="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">Proponent Details (Institute)</h4>
                  <dl class="text-sm space-y-1" v-if="hospitalDetails.institute_details">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 py-1.5 px-2 rounded bg-gray-50">
                      <dt class="font-medium text-gray-600">Institute Name:</dt>
                      <dd class="md:col-span-2 text-gray-800">{{ hospitalDetails.institute_details.name_of_institution || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 py-1.5 px-2 rounded">
                      <dt class="font-medium text-gray-600">Institute CID:</dt>
                      <dd class="md:col-span-2 text-gray-800">{{ hospitalDetails.institute_details.CID || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 py-1.5 px-2 rounded bg-gray-50">
                      <dt class="font-medium text-gray-600">Contact No (Proponent):</dt>
                      <dd class="md:col-span-2 text-gray-800">{{ hospitalDetails.institute_details.contact_no || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 py-1.5 px-2 rounded">
                      <dt class="font-medium text-gray-600">Email (Proponent):</dt>
                      <dd class="md:col-span-2 text-gray-800">{{ hospitalDetails.institute_details.email_address || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 py-1.5 px-2 rounded bg-gray-50">
                      <dt class="font-medium text-gray-600">Country (Proponent):</dt>
                      <dd class="md:col-span-2 text-gray-800">{{ hospitalDetails.institute_details.country === 'BT' ? 'Bhutan' : hospitalDetails.institute_details.country || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 py-1.5 px-2 rounded">
                      <dt class="font-medium text-gray-600">Dzongkhag (Proponent):</dt>
                      <dd class="md:col-span-2 text-gray-800">{{ hospitalDetails.institute_details.dzongkhag || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 py-1.5 px-2 rounded bg-gray-50">
                      <dt class="font-medium text-gray-600">Gewog (Proponent):</dt>
                      <dd class="md:col-span-2 text-gray-800">{{ hospitalDetails.institute_details.gewog || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 py-1.5 px-2 rounded">
                      <dt class="font-medium text-gray-600">Address (Proponent):</dt>
                      <dd class="md:col-span-2 text-gray-800">{{ hospitalDetails.institute_details.address || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 py-1.5 px-2 rounded bg-gray-50">
                      <dt class="font-medium text-gray-600">Institute Website:</dt>
                      <dd class="md:col-span-2 text-gray-800">
                        <a :href="hospitalDetails.institute_details.website" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline" v-if="hospitalDetails.institute_details.website">
                          {{ hospitalDetails.institute_details.website }}
                        </a>
                        <span v-else>N/A</span>
                      </dd>
                    </div>
                  </dl>
                  <p v-else class="text-sm text-gray-500">Institute details not available.</p>
                </section>

                <!-- Proposed Teaching Center Details Section -->
                <section class="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                  <h4 class="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">Proposed Teaching Center Details</h4>
                  <dl class="text-sm space-y-1">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 py-1.5 px-2 rounded bg-gray-50">
                      <dt class="font-medium text-gray-600">Center Name:</dt>
                      <dd class="md:col-span-2 text-gray-800">{{ hospitalDetails.center_name || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 py-1.5 px-2 rounded">
                      <dt class="font-medium text-gray-600">Center Location:</dt>
                      <dd class="md:col-span-2 text-gray-800">{{ hospitalDetails.center_location || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 py-1.5 px-2 rounded bg-gray-50">
                      <dt class="font-medium text-gray-600">State/Dzongkhag (Center):</dt>
                      <dd class="md:col-span-2 text-gray-800">{{ hospitalDetails.state_dzongkhag || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 py-1.5 px-2 rounded">
                      <dt class="font-medium text-gray-600">City/Gewog (Center):</dt>
                      <dd class="md:col-span-2 text-gray-800">{{ hospitalDetails.city_gewog || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 py-1.5 px-2 rounded bg-gray-50">
                      <dt class="font-medium text-gray-600">Target Category:</dt>
                      <dd class="md:col-span-2 text-gray-800">{{ hospitalDetails.target_category || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 py-1.5 px-2 rounded">
                      <dt class="font-medium text-gray-600">Renewal Review Name:</dt>
                      <dd class="md:col-span-2 text-gray-800">{{ hospitalDetails.tc_renewal_review_name || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 py-1.5 px-2 rounded bg-gray-50">
                      <dt class="font-medium text-gray-600">Review Summary (Applicant):</dt>
                      <dd class="md:col-span-2 text-gray-800 whitespace-pre-wrap">{{ hospitalDetails.tc_review_summary || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 py-1.5 px-2 rounded">
                      <dt class="font-medium text-gray-600">Proposed Valid Till:</dt>
                      <dd class="md:col-span-2 text-gray-800">{{ hospitalDetails.valid_till ? formatDate(hospitalDetails.valid_till) : 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 py-1.5 px-2 rounded bg-gray-50">
                      <dt class="font-medium text-gray-600">Attachments (Applicant):</dt>
                      <dd class="md:col-span-2 text-gray-800">
                        <a v-if="hospitalDetails.tc_attachments" :href="ensureAbsoluteUrl(hospitalDetails.tc_attachments)" target="_blank" class="text-blue-600 hover:underline" :download="getFileNameFromUrl(hospitalDetails.tc_attachments)">
                          {{ getFileNameFromUrl(hospitalDetails.tc_attachments) || 'View Attachment' }}
                        </a>
                        <span v-else>No attachments</span>
                      </dd>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 py-1.5 px-2 rounded">
                      <dt class="font-medium text-gray-600">Report File (Applicant):</dt>
                      <dd class="md:col-span-2 text-gray-800">
                        <a v-if="hospitalDetails.tc_report" :href="ensureAbsoluteUrl(hospitalDetails.tc_report)" target="_blank" class="text-blue-600 hover:underline" :download="getFileNameFromUrl(hospitalDetails.tc_report)">
                          {{ getFileNameFromUrl(hospitalDetails.tc_report) || 'View Report' }}
                        </a>
                        <span v-else>No report file</span>
                      </dd>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 py-1.5 px-2 rounded bg-gray-50">
                      <dt class="font-medium text-gray-600">TC Remarks (Applicant):</dt>
                      <dd class="md:col-span-2 text-gray-800 whitespace-pre-wrap">{{ hospitalDetails.tc_remarks || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 py-1.5 px-2 rounded">
                      <dt class="font-medium text-gray-600">General Remarks (Applicant):</dt>
                      <dd class="md:col-span-2 text-gray-800 whitespace-pre-wrap">{{ hospitalDetails.remarks || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 py-1.5 px-2 rounded bg-gray-50">
                      <dt class="font-medium text-gray-600">Declaration Accepted (Applicant):</dt>
                      <dd class="md:col-span-2 text-gray-800">{{ hospitalDetails.tc_declaration ? 'Yes' : 'No' }}</dd>
                    </div>
                  </dl>
                </section>

                <!-- Dealing Officer Section -->
                <section class="mt-6 pt-6 border-t-2 border-green-200">
                  <div class="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-6">
                    <h4 class="text-xl font-bold text-green-800 mb-2 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Dealing Officer Actions
                    </h4>
                    <p class="text-green-700 text-sm">Review and make decisions on this teaching center application.</p>
                  </div>

                  <!-- Display Previous Verification Info -->
                  <div v-if="hospitalDetails.physical_verification_date" class="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                    <div class="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <div>
                        <h5 class="font-semibold text-blue-800">Physical Verification Recorded</h5>
                        <p class="text-blue-700 text-sm mt-1">Date: {{ formatDate(hospitalDetails.physical_verification_date) }}</p>
                        <p class="text-blue-700 text-sm">Status: {{ formattedVerificationStatus(hospitalDetails.physical_verification_status) }}</p>
                        <p class="text-blue-700 text-sm">Remarks: {{ hospitalDetails.physical_verification_remarks || 'N/A' }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Display Rejection Reason if Rejected -->
                  <div v-if="isEffectivelyRejected && hospitalDetails.tc_reason_if_rejected" class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                    <div class="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                      </svg>
                      <div>
                        <h5 class="font-semibold text-red-800">Application Rejected</h5>
                        <p class="text-red-700 text-sm mt-1">Reason: {{ hospitalDetails.tc_reason_if_rejected }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Physical Verification Form Section -->
                  <div v-if="canRecordVerification" class="mb-8 p-6 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50">
                    <div class="flex items-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-blue-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      <h5 class="text-xl font-bold text-blue-800">
                        {{ hospitalDetails.physical_verification_date ? 'Update Scheduled Verification' : 'Schedule Physical Verification' }}
                      </h5>
                    </div>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label for="verificationDate" class="block text-sm font-semibold text-blue-700 mb-2">
                          Scheduled Verification Date <span class="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          id="verificationDate"
                          v-model="localVerificationData.date"
                          :min="todayDate()"
                          class="w-full rounded-lg border-2 border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-3"
                        >
                      </div>
                      <div>
                        <label for="verificationStatus" class="block text-sm font-semibold text-blue-700 mb-2">
                          Physical Verification Status <span class="text-red-500">*</span>
                        </label>
                        <select
                          id="verificationStatus"
                          v-model="localVerificationData.status"
                          class="w-full rounded-lg border-2 border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-3"
                        >
                          <option value="" disabled>Select status</option>
                          <option value="PENDING_PV">Pending Physical Verification (Scheduled)</option>
                          <option value="IN_PROGRESS_PV">Physical Verification In Progress</option>
                          <option value="VERIFIED_PV">Physically Verified & Recommended</option>
                          <option value="NOT_VERIFIED_PV">Physical Verification Failed / Not Recommended</option>
                          <option value="NOT_REQUIRED_PV">Physical Verification Not Required</option>
                        </select>
                      </div>
                      <div class="lg:col-span-2">
                        <label for="verificationReport" class="block text-sm font-semibold text-blue-700 mb-2">
                          Verification Notes/Plan <span class="text-red-500">*</span>
                        </label>
                        <textarea
                          id="verificationReport"
                          v-model="localVerificationData.report"
                          rows="4"
                          class="w-full rounded-lg border-2 border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-3"
                          placeholder="Enter notes regarding the scheduled verification, agenda, or initial plan. After verification, update with findings, facilities, staff, equipment, compliance, concerns, recommendations..."
                        ></textarea>
                      </div>
                      <div class="lg:col-span-2 bg-white p-4 rounded-lg border border-blue-200">
                        <div class="flex items-start">
                          <div class="flex items-center h-5">
                            <input
                              id="sendToUser"
                              v-model="localVerificationData.sendToUser"
                              type="checkbox"
                              class="focus:ring-blue-500 h-5 w-5 text-blue-600 border-2 border-blue-300 rounded"
                            >
                          </div>
                          <div class="ml-3">
                            <label for="sendToUser" class="font-semibold text-blue-700 text-sm">Send notification to user</label>
                            <p class="text-blue-600 text-xs mt-1">Check to notify applicant about verification status.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      @click="submitVerificationHandler"
                      :disabled="!localVerificationData.date || !localVerificationData.report.trim() || !localVerificationData.status"
                      class="btn btn-info py-3 px-6 text-sm font-semibold"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Save Schedule / Verification Details
                    </button>
                  </div>

                  <!-- Application Decision Section -->
                  <div v-if="canDecide" class="mt-8 p-6 border border-gray-300 rounded-xl bg-gray-50 shadow-lg">
                    <div class="text-center mb-6">
                      <h5 class="text-xl font-semibold text-gray-800 mb-2">Make Final Decision</h5>
                      <p class="text-sm text-gray-600">Choose to approve or reject this application.</p>
                    </div>

                    <!-- Rejection Reason Input (if officer chooses to reject here) -->
                    <div v-if="actionAttempt === 'reject'" class="mb-6">
                      <label for="modalRejectionReason" class="block text-sm font-medium text-gray-700 mb-1">
                        Reason for Rejection <span class="text-red-500">*</span>
                      </label>
                      <textarea
                        id="modalRejectionReason"
                        v-model="rejectionReason"
                        rows="4"
                        class="form-input w-full"
                        placeholder="Provide a clear and detailed reason for rejecting this application..."
                      ></textarea>
                    </div>

                    <div class="flex flex-col sm:flex-row justify-center items-center gap-6">
                      <button
                        type="button"
                        @click="handleApprove"
                        :disabled="!canDecide"
                        class="btn btn-success px-8 py-3 text-base font-medium"
                        title="Approve this application"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                        Approve
                      </button>
                      <button
                        type="button"
                        @click="prepareReject"
                        class="btn btn-danger px-8 py-3 text-base font-medium"
                        title="Reject this application"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                        {{ actionAttempt === 'reject' && rejectionReason.trim() ? 'Confirm Rejection' : 'Reject' }}
                      </button>
                    </div>
                  </div>

                  <!-- Final Status Messages -->
                  <div v-if="isEffectivelyApproved" class="mt-8 p-6 bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-400 rounded-xl">
                    <div class="flex items-center">
                      <div class="bg-green-500 p-2 rounded-full mr-4">
                        <svg class="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 class="text-xl font-bold text-green-800">✅ Application Approved</h3>
                        <p class="mt-2 text-green-700 font-medium">This application has been approved. Payment can now be initiated by the institute.</p>
                      </div>
                    </div>
                  </div>

                  <div v-if="isEffectivelyRejected && !canDecide" class="mt-8 p-6 bg-gradient-to-r from-red-100 to-red-200 border-2 border-red-400 rounded-xl">
                    <div class="flex items-center">
                      <div class="bg-red-500 p-2 rounded-full mr-4">
                        <svg class="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 class="text-xl font-bold text-red-800">❌ Application Rejected</h3>
                        <p class="mt-2 text-red-700 font-medium">This application was rejected. Applicant has been notified.</p>
                        <p v-if="hospitalDetails.tc_reason_if_rejected" class="mt-1 text-sm text-red-600">Rejection Reason: {{ hospitalDetails.tc_reason_if_rejected }}</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            @click="closeModal"
            class="btn btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  hospitalDetails: {
    type: Object,
    default: () => ({
      institute_details: {},
      tc_attachments: null,
      tc_report: null,
      physical_verification_date: null,
      physical_verification_remarks: null,
      physical_verification_status: null,
      send_to_user: false,
      tc_reason_if_rejected: null,
      tc_review_decision: null,
      center_name: '',
      center_location: '',
      state_dzongkhag: '',
      city_gewog: '',
      target_category: '',
      tc_renewal_review_name: '',
      tc_review_summary: '',
      valid_till: null,
      tc_remarks: '',
      remarks: '',
      tc_declaration: false,
    }),
  },
})

const emit = defineEmits(['close-modal', 'approve', 'reject', 'submit-verification'])

const localVerificationData = ref({
  date: '',
  report: '',
  status: 'PENDING_PV',
  sendToUser: false,
})
const rejectionReason = ref('')
const actionAttempt = ref(null)

watch(() => props.hospitalDetails, (newDetails) => {
  if (newDetails && props.isOpen) {
    localVerificationData.value = {
      date: newDetails.physical_verification_date ? new Date(newDetails.physical_verification_date).toISOString().split('T')[0] : '',
      report: newDetails.physical_verification_remarks || '',
      status: newDetails.physical_verification_status || 'PENDING_PV',
      sendToUser: newDetails.send_to_user || false,
    }
    rejectionReason.value = newDetails.tc_reason_if_rejected || ''
    actionAttempt.value = null
  } else if (!props.isOpen) {
    localVerificationData.value = { date: '', report: '', status: 'PENDING_PV', sendToUser: false }
    rejectionReason.value = ''
    actionAttempt.value = null
  }
}, { immediate: true, deep: true })

const todayDate = () => new Date().toISOString().split('T')[0]

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return isNaN(date.getTime()) ? dateString : date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
  } catch (e) {
    console.error('Error formatting date:', e, dateString)
    return dateString
  }
}

const formattedStatus = (statusKey) => {
  if (!statusKey) return 'Pending Review'
  return String(statusKey).replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formattedVerificationStatus = (statusKey) => {
  if (!statusKey) return 'N/A'
  const statusMap = {
    'PENDING_PV': 'Pending Physical Verification (Scheduled)',
    'IN_PROGRESS_PV': 'Physical Verification In Progress',
    'VERIFIED_PV': 'Physically Verified & Recommended',
    'NOT_VERIFIED_PV': 'Physical Verification Failed / Not Recommended',
    'NOT_REQUIRED_PV': 'Physical Verification Not Required',
  }
  return statusMap[statusKey] || formattedStatus(statusKey)
}

const ensureAbsoluteUrl = (url) => {
  if (!url) return '#'
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
    return url
  }
  const backendBaseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin
  if (url.startsWith('/media/') || url.startsWith('/static/')) {
    return `${backendBaseUrl}${url}`
  }
  return `${backendBaseUrl}/media/${url.startsWith('/') ? url.substring(1) : url}`
}

const getFileNameFromUrl = (url) => {
  if (!url || typeof url !== 'string') return null
  try {
    const decodedUrl = decodeURIComponent(url)
    const name = decodedUrl.substring(decodedUrl.lastIndexOf('/') + 1)
    return name.split('?')[0]
  } catch (e) {
    console.error('Error getting filename from URL:', e, url)
    return 'attachment'
  }
}

const statusBadgeClass = computed(() => {
  const status = props.hospitalDetails?.tc_review_decision
  if (!status) return 'bg-yellow-100 text-yellow-800'
  const sLower = String(status).toLowerCase()
  if (sLower === 'approved') return 'bg-green-100 text-green-800'
  if (sLower === 'rejected' || sLower === 'regretted') return 'bg-red-100 text-red-800'
  if (sLower === 'verification_completed' || sLower === 'verified_pv') return 'bg-blue-100 text-blue-800'
  return 'bg-yellow-100 text-yellow-800'
})

const isEffectivelyApproved = computed(() => props.hospitalDetails?.tc_review_decision === 'Approved')
const isEffectivelyRejected = computed(() => {
  const decision = props.hospitalDetails?.tc_review_decision
  return decision === 'Rejected' || decision === 'Regretted'
})

const canRecordVerification = computed(() => {
  return !isEffectivelyApproved.value && !isEffectivelyRejected.value
})

const canDecide = computed(() => {
  return !isEffectivelyApproved.value && !isEffectivelyRejected.value
})

const closeModal = () => {
  emit('close-modal')
  actionAttempt.value = null
  rejectionReason.value = ''
}

const submitVerificationHandler = () => {
  if (!localVerificationData.value.date || !localVerificationData.value.report.trim() || !localVerificationData.value.status) {
    alert('Please provide all verification details: date, report/notes, and decision/status.')
    return
  }
  emit('submit-verification', {
    verificationDate: localVerificationData.value.date,
    verificationReport: localVerificationData.value.report,
    verificationStatus: localVerificationData.value.status,
    sendToUser: localVerificationData.value.sendToUser,
  })
}

const handleApprove = () => {
  actionAttempt.value = null
  emit('approve')
}

const prepareReject = () => {
  if (actionAttempt.value === 'reject' && rejectionReason.value.trim()) {
    emit('reject', { rejectionReason: rejectionReason.value.trim() })
    actionAttempt.value = null
    rejectionReason.value = ''
  } else {
    actionAttempt.value = 'reject'
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
.whitespace-pre-wrap { white-space: pre-wrap; }

.btn { @apply inline-flex justify-center items-center rounded-md border shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out; }
.btn-success { @apply border-transparent bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300; }
.btn-danger { @apply border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300; }
.btn-info { @apply border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300; }
.btn-secondary { @apply border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500; }
.form-input { @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2; }
</style>
```