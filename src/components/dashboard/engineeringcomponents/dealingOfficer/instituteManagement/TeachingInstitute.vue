<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Teaching Institutes</h1>
      <div class="flex items-center text-gray-600">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Total: {{ teachingCenters.length }}
        </span>
      </div>
    </div>

    <!-- Alert -->
    <div v-if="alert.show"
      :class="`mb-4 p-4 rounded-md ${alert.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg v-if="alert.type === 'success'" class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd" />
          </svg>
          <svg v-else class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium">{{ alert.message }}</p>
        </div>
        <div class="ml-auto pl-3">
          <div class="-mx-1.5 -my-1.5">
            <button @click="alert.show = false" class="inline-flex rounded-md p-1.5" :class="alert.type === 'success'
              ? 'text-green-500 hover:bg-green-100'
              : 'text-red-500 hover:bg-red-100'
              ">
              <span class="sr-only">Dismiss</span>
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Indicator -->
    <div v-if="loading && !isModalOpen" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- No Data Message -->
    <div v-else-if="!loading && teachingCenters.length === 0"
      class="bg-white p-8 text-center text-gray-500 rounded-xl shadow-sm border border-gray-100">
      <p>No teaching Institutes found</p>
    </div>

    <!-- Teaching Centers Table -->
    <div v-else-if="!loading" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Center Name
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                City / Gewog
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Target Category
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="center in teachingCenters" :key="center.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ center.center_name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ center.city_gewog }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{{
                  center.target_category }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-3 py-1 rounded-full text-xs font-medium" :class="{
                  'bg-yellow-100 text-yellow-800': center.tc_review_decision === 'Pending',
                  'bg-green-100 text-green-800': center.tc_review_decision === 'Approved',
                  'bg-red-100 text-red-800': center.tc_review_decision === 'Regretted',
                }">
                  {{ center.tc_review_decision }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button @click="openModal(center)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">
                    View/Review
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Integrated Details & Review Modal -->
    <div v-if="isModalOpen" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
      aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal">
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
        <div
          class="inline-block align-bottom bg-gray-50 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6">
            <!-- Modal Header -->
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-2xl leading-6 font-bold text-gray-900" id="modal-title">
                  Institute & Review Details
                </h3>
                <p class="text-sm text-gray-500 mt-1">
                  Reviewing proposal for
                  <span class="font-semibold text-indigo-600">{{ selectedCenter?.center_name || 'N/A' }}</span>.
                </p>
              </div>
              <button @click="closeModal"
                class="ml-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                title="Close">
                <span class="sr-only">Close</span>
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Scrollable Content Area with Two-Column Layout -->
          <div class="max-h-[70vh] overflow-y-auto px-6 py-4 bg-gray-50">
            <div class="lg:grid lg:grid-cols-5 lg:gap-8">

              <!-- Left Column: Details -->
              <div class="lg:col-span-2">
                <!-- Proponent Details Section -->
                <section class="mb-8">
                  <h4 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <svg class="h-5 w-5 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                      fill="currentColor">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clip-rule="evenodd" />
                    </svg>
                    Proponent Details
                  </h4>
                  <dl class="divide-y divide-gray-200">
                    <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt class="text-sm font-medium text-gray-500">Institute Name</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{
                        selectedCenter.institute?.name_of_institution || 'N/A' }}</dd>
                    </div>
                    <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt class="text-sm font-medium text-gray-500">Contact</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{
                        selectedCenter.institute?.contact_no || 'N/A' }}</dd>
                    </div>
                    <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt class="text-sm font-medium text-gray-500">Email</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{
                        selectedCenter.institute?.email_address || 'N/A' }}</dd>
                    </div>
                    <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt class="text-sm font-medium text-gray-500">Location</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">
                        {{ [selectedCenter.institute?.address, selectedCenter.institute?.gewog,
                        selectedCenter.institute?.dzongkhag,
                        selectedCenter.institute?.country].filter(Boolean).join(', ') || 'N / A' }}</dd>
                    </div>
                  </dl>
                </section>

                <!-- Proposal Details Section -->
                <section>
                  <h4 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <svg class="h-5 w-5 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                      fill="currentColor">
                      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                    Proposal Details
                  </h4>
                  <dl class="divide-y divide-gray-200">
                    <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt class="text-sm font-medium text-gray-500">Target Category</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ selectedCenter.target_category ||
                        'N/A' }}</dd>
                    </div>
                    <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt class="text-sm font-medium text-gray-500">Remarks</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">{{
                        selectedCenter.remarks || 'N/A' }}</dd>
                    </div>
                    <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt class="text-sm font-medium text-gray-500">Attachments</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <a v-if="selectedCenter.tc_attachments" :href="selectedCenter.tc_attachments" target="_blank"
                          rel="noopener noreferrer" class="font-medium text-indigo-600 hover:text-indigo-500">View
                          Attachment</a>
                        <span v-else>None</span>
                      </dd>
                    </div>
                    <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt class="text-sm font-medium text-gray-500">Payment Status</dt>
                      <dd class="mt-1 sm:mt-0 sm:col-span-2">
                        <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" :class="{
                          'bg-green-100 text-green-800': selectedCenter.is_payment_complete,
                          'bg-yellow-100 text-yellow-800': !selectedCenter.is_payment_complete,
                        }">
                          {{ selectedCenter.is_payment_complete ? 'Complete' : 'Pending' }}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </section>
              </div>

              <!-- Right Column: Review Form -->
              <div class="lg:col-span-3 mt-8 lg:mt-0">
                <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <fieldset :disabled="isReviewFinalized">
                    <h4 class="text-lg font-semibold text-gray-800 mb-4">Review Action</h4>

                    <!-- Payment Pending Warning -->
                    <div v-if="!selectedCenter.is_payment_complete"
                      class="p-4 mb-4 text-sm text-yellow-800 bg-yellow-50 rounded-lg border border-yellow-300 flex items-start"
                      role="alert">
                      <svg class="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                          d="M8.257 3.099c.636-1.026 2.85-1.026 3.486 0l5.58 8.997c.636 1.026-.424 2.404-1.743 2.404H4.42c-1.319 0-2.379-1.378-1.743-2.404l5.58-8.997zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                          clip-rule="evenodd"></path>
                      </svg>
                      <div>
                        <span class="font-medium">Action Required:</span> Payment is pending. The 'Approve' and 'Reject'
                        actions will be unavailable until the payment is marked as complete.
                      </div>
                    </div>

                    <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div class="sm:col-span-6">
                        <label for="review-decision" class="block text-sm font-medium text-gray-700">Review
                          Decision</label>
                        <select id="review-decision" v-model="reviewForm.tc_review_decision"
                          class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Regretted">Regretted</option>
                        </select>
                      </div>

                      <div class="sm:col-span-6">
                        <label for="review-summary" class="block text-sm font-medium text-gray-700">Review
                          Summary</label>
                        <textarea id="review-summary" v-model="reviewForm.tc_review_summary" rows="3"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                      </div>

                      <div class="sm:col-span-3">
                        <label for="valid-till" class="block text-sm font-medium text-gray-700">Valid Till</label>
                        <input type="date" id="valid-till" v-model="reviewForm.valid_till"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                      </div>

                      <div class="sm:col-span-3">
                        <label for="report-upload" class="block text-sm font-medium text-gray-700">Upload Report</label>
                        <input type="file" id="report-upload" @change="handleReportUpload"
                          class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                        <p v-if="selectedCenter.tc_report && !reviewForm.reportFile" class="mt-1 text-xs text-gray-500">
                          Current: <a :href="selectedCenter.tc_report" target="_blank"
                            class="text-indigo-600 hover:underline">View Existing</a>
                        </p>
                      </div>

                      <div class="sm:col-span-6" v-if="reviewForm.tc_review_decision === 'Regretted'">
                        <label for="reason-rejected" class="block text-sm font-medium text-gray-700">Reason (if
                          Regretted) <span class="text-red-500">*</span></label>
                        <textarea id="reason-rejected" v-model="reviewForm.tc_reason_if_rejected" rows="3"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                      </div>

                      <div class="sm:col-span-6">
                        <label for="review-remarks" class="block text-sm font-medium text-gray-700">General Remarks
                          (Review)</label>
                        <textarea id="review-remarks" v-model="reviewForm.tc_remarks" rows="3"
                          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                      </div>
                    </div>
                  </fieldset>
                </div>
              </div>

            </div>
          </div>

          <!-- Modal Footer Actions -->
          <div class="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-2xl border-t">
            <button type="button" @click="openApproveDialog"
              :disabled="loading || isReviewFinalized || !selectedCenter.is_payment_complete"
              :title="!selectedCenter.is_payment_complete ? 'Payment must be complete to approve' : (isReviewFinalized ? 'Review already finalized' : 'Approve Proposal')"
              class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              Approve
            </button>
            <button type="button" @click="openRejectDialog"
              :disabled="loading || isReviewFinalized || !selectedCenter.is_payment_complete"
              :title="!selectedCenter.is_payment_complete ? 'Payment must be complete to reject' : (isReviewFinalized ? 'Review already finalized' : 'Reject Proposal')"
              class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
              Reject
            </button>
            <button type="button" @click="saveReview" :disabled="loading || isReviewFinalized"
              :title="isReviewFinalized ? 'Review already finalized' : 'Save current review progress'"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
              <span v-if="loading">Saving...</span>
              <span v-else>Save Review</span>
            </button>
            <button type="button" @click="closeModal" :disabled="loading"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Approve and Reject Dialogs (No changes needed here) -->
    <!-- ... your existing code for approveDialog and rejectDialog ... -->

    <!-- Approve Confirmation Dialog -->
    <div v-if="approveDialog.show" class="fixed z-20 inset-0 overflow-y-auto" aria-labelledby="approve-dialog-title"
      role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
          @click="closeApproveDialog"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="approve-dialog-title">
                  Approve Teaching Center
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to approve "{{
                      selectedCenter?.center_name || 'this center'
                    }}"? Please provide an approval message.
                  </p>
                  <textarea v-model="approveDialog.message" rows="4"
                    class="mt-3 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter approval message"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" @click="confirmApprove" :disabled="loading || !approveDialog.message.trim()"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
              <span v-if="loading">Approving...</span>
              <span v-else>Approve</span>
            </button>
            <button type="button" @click="closeApproveDialog" :disabled="loading"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Confirmation Dialog -->
    <div v-if="rejectDialog.show" class="fixed z-20 inset-0 overflow-y-auto" aria-labelledby="reject-dialog-title"
      role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
          @click="closeRejectDialog"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="reject-dialog-title">
                  Reject Teaching Center
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to reject "{{
                      selectedCenter?.center_name || 'this center'
                    }}"? Please provide a rejection reason.
                  </p>
                  <textarea v-model="rejectDialog.message" rows="4"
                    class="mt-3 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter rejection reason"></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" @click="confirmReject" :disabled="loading || !rejectDialog.message.trim()"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
              <span v-if="loading">Rejecting...</span>
              <span v-else>Reject</span>
            </button>
            <button type="button" @click="closeRejectDialog" :disabled="loading"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import apiServices from '@/services/services'

const teachingCenters = ref([])
const isModalOpen = ref(false)
const selectedCenter = ref({ institute: {} })
const loading = ref(false)

const reviewForm = ref({
  tc_review_summary: '',
  tc_report: null,
  reportFile: null,
  tc_review_decision: 'Pending',
  tc_reason_if_rejected: '',
  tc_remarks: '',
  valid_till: '',
})

const alert = ref({
  show: false,
  type: 'success',
  message: '',
})

const approveDialog = ref({
  show: false,
  message: '',
})

const rejectDialog = ref({
  show: false,
  message: '',
})

const isReviewFinalized = computed(() => {
  return (
    selectedCenter.value?.tc_review_decision === 'Approved' ||
    selectedCenter.value?.tc_review_decision === 'Regretted'
  )
})

onMounted(async () => {
  await fetchTeachingCenters()
})

const fetchTeachingCenters = async () => {
  loading.value = true
  try {
    const response = await apiServices.getEpcTeachingCenters()
    let results =
      response?.data?.results ||
      response?.results ||
      (Array.isArray(response) ? response : Array.isArray(response?.data) ? response.data : [])

    // Make sure is_payment_complete is available, defaulting to false if not provided
    teachingCenters.value = results.filter((center) => center != null).map(center => ({
      ...center,
      is_payment_complete: center.is_payment_complete === true // Ensure it's a strict boolean
    }));

    if (!Array.isArray(results)) {
      console.error('Unexpected API response structure:', response)
      showAlert('error', 'Failed to load teaching centers: Unexpected data format.')
    }
  } catch (error) {
    console.error('Error fetching teaching centers:', error)
    showAlert('error', `Failed to load teaching centers: ${error.message || 'Unknown error'}`)
    teachingCenters.value = []
  } finally {
    loading.value = false
  }
}

const openModal = (center) => {
  selectedCenter.value = center || { institute: {}, is_payment_complete: false }
  reviewForm.value = {
    tc_review_summary: center?.tc_review_summary || '',
    tc_report: null,
    reportFile: null,
    tc_review_decision: center?.tc_review_decision || 'Pending',
    tc_reason_if_rejected: center?.tc_reason_if_rejected || '',
    tc_remarks: center?.tc_remarks || '',
    valid_till: center?.valid_till ? new Date(center.valid_till).toISOString().split('T')[0] : '',
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  approveDialog.value = { show: false, message: '' }
  rejectDialog.value = { show: false, message: '' }
}

const handleReportUpload = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    reviewForm.value.reportFile = file
  } else {
    reviewForm.value.reportFile = null
  }
}

const openApproveDialog = () => {
  approveDialog.value = { show: true, message: '' }
}

const closeApproveDialog = () => {
  approveDialog.value = { show: false, message: '' }
}

const openRejectDialog = () => {
  rejectDialog.value = { show: true, message: '' }
}

const closeRejectDialog = () => {
  rejectDialog.value = { show: false, message: '' }
}

const confirmApprove = async () => {
  if (!selectedCenter.value?.id) {
    showAlert('error', 'Cannot approve: Missing Teaching Center ID.')
    return
  }

  loading.value = true
  try {
    const formData = new FormData()
    formData.append('tc_review_decision', 'Approved')
    formData.append('tc_remarks', approveDialog.value.message)
    formData.append('tc_review_summary', reviewForm.value.tc_review_summary || '')
    if (reviewForm.value.valid_till) {
      formData.append('valid_till', reviewForm.value.valid_till)
    }
    if (reviewForm.value.reportFile) {
      formData.append('tc_report', reviewForm.value.reportFile, reviewForm.value.reportFile.name)
    }
    formData.append('is_active', 'true')

    const response = await apiServices.patchEpcTeachingCenter(selectedCenter.value.id, formData)
    const updatedCenterData = response?.data || {
      ...selectedCenter.value,
      tc_review_decision: 'Approved',
      tc_remarks: approveDialog.value.message,
      is_active: true,
    }

    const index = teachingCenters.value.findIndex((center) => center.id === selectedCenter.value.id)
    if (index !== -1) {
      teachingCenters.value[index] = updatedCenterData
    }

    showAlert(
      'success',
      `Teaching Center "${selectedCenter.value.center_name}" approved successfully.`,
    )
    closeApproveDialog()
    closeModal()
  } catch (error) {
    console.error('Error approving teaching center:', error)
    showAlert(
      'error',
      `Failed to approve: ${error.response?.data?.detail || error.message || 'Unknown error'}`,
    )
  } finally {
    loading.value = false
  }
}

const confirmReject = async () => {
  if (!selectedCenter.value?.id) {
    showAlert('error', 'Cannot reject: Missing Teaching Center ID.')
    return
  }

  loading.value = true
  try {
    const formData = new FormData()
    formData.append('tc_review_decision', 'Regretted')
    formData.append('tc_reason_if_rejected', rejectDialog.value.message)
    formData.append('tc_remarks', reviewForm.value.tc_remarks || '')
    formData.append('tc_review_summary', reviewForm.value.tc_review_summary || '')
    if (reviewForm.value.valid_till) {
      formData.append('valid_till', reviewForm.value.valid_till)
    }
    if (reviewForm.value.reportFile) {
      formData.append('tc_report', reviewForm.value.reportFile, reviewForm.value.reportFile.name)
    }
    formData.append('is_active', 'true')

    const response = await apiServices.patchEpcTeachingCenter(selectedCenter.value.id, formData)
    const updatedCenterData = response?.data || {
      ...selectedCenter.value,
      tc_review_decision: 'Regretted',
      tc_reason_if_rejected: rejectDialog.value.message,
    }

    const index = teachingCenters.value.findIndex((center) => center.id === selectedCenter.value.id)
    if (index !== -1) {
      teachingCenters.value[index] = updatedCenterData
    }

    showAlert(
      'success',
      `Teaching Center "${selectedCenter.value.center_name}" rejected successfully.`,
    )
    closeRejectDialog()
    closeModal()
  } catch (error) {
    console.error('Error rejecting teaching center:', error)
    showAlert(
      'error',
      `Failed to reject: ${error.response?.data?.detail || error.message || 'Unknown error'}`,
    )
  } finally {
    loading.value = false
  }
}

const saveReview = async () => {
  if (!selectedCenter.value?.id) {
    showAlert('error', 'Cannot save review: Missing Teaching Center ID.')
    return
  }

  if (
    reviewForm.value.tc_review_decision === 'Regretted' &&
    !reviewForm.value.tc_reason_if_rejected?.trim()
  ) {
    showAlert('error', 'Reason is required when regretting.')
    return
  }

  loading.value = true
  try {
    const formData = new FormData()
    formData.append('tc_review_summary', reviewForm.value.tc_review_summary || '')
    formData.append('tc_review_decision', reviewForm.value.tc_review_decision)
    formData.append('tc_reason_if_rejected', reviewForm.value.tc_reason_if_rejected || '')
    formData.append('tc_remarks', reviewForm.value.tc_remarks || '')
    if (reviewForm.value.valid_till) {
      formData.append('valid_till', reviewForm.value.valid_till)
    } else {
      formData.append('valid_till', '')
    }
    if (reviewForm.value.reportFile) {
      formData.append('tc_report', reviewForm.value.reportFile, reviewForm.value.reportFile.name)
    }
    formData.append('is_active', 'true')

    const response = await apiServices.patchEpcTeachingCenter(selectedCenter.value.id, formData)
    const updatedCenterData = response?.data || {
      ...selectedCenter.value,
      ...reviewForm.value,
      tc_report: response?.data?.tc_report || selectedCenter.value.tc_report,
    }

    const index = teachingCenters.value.findIndex((center) => center.id === selectedCenter.value.id)
    if (index !== -1) {
      teachingCenters.value[index] = updatedCenterData
    }

    showAlert('success', `Review for "${selectedCenter.value.center_name}" saved successfully.`)
    closeModal()
  } catch (error) {
    console.error('Error saving review:', error)
    showAlert(
      'error',
      `Failed to save review: ${error.response?.data?.detail || error.message || 'Unknown error'}`,
    )
  } finally {
    loading.value = false
  }
}

const showAlert = (type, message) => {
  alert.value = { show: true, type, message }
  setTimeout(() => {
    if (alert.value.message === message) {
      alert.value.show = false
    }
  }, 5000)
}
</script>

<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c5c5c5;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.whitespace-pre-wrap {
  white-space: pre-wrap;
}

input[type='file'] {
  color: #6b7280;
}

input[type='file']::file-selector-button {
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border-width: 0px;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: #eef2ff;
  color: #4338ca;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

input[type='file']::file-selector-button:hover {
  background-color: #e0e7ff;
}
</style>
