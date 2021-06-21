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
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal">
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <!-- Modal Header -->
            <div class="sm:flex sm:items-start mb-4 border-b pb-3">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-2xl leading-6 font-bold text-gray-900" id="modal-title">
                  Institute & Review Details
                </h3>
                <p class="text-sm text-gray-500 mt-1">
                  View details and enter review for
                  {{ selectedCenter?.center_name || 'the selected center' }}.
                </p>
              </div>
              <div class="ml-auto flex-shrink-0 flex items-center">
                <button @click="closeModal"
                  class="p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  title="Close">
                  <svg class="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Scrollable Content Area -->
            <div class="mt-5 max-h-[65vh] overflow-y-auto pr-2 text-sm">
              <!-- Proponent Details (Read-Only) -->
              <section class="mb-6 opacity-80">
                <h4 class="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
                  Proponent Details (Read-Only)
                </h4>
                <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                  <div class="sm:col-span-2">
                    <dt class="font-medium text-gray-600">Training Institute Name</dt>
                    <dd class="mt-1 text-gray-900">
                      {{ selectedCenter.institute?.name_of_institution || 'N/A' }}
                    </dd>
                  </div>
                  <div>
                    <dt class="font-medium text-gray-600">Country</dt>
                    <dd class="mt-1 text-gray-900">
                      {{ selectedCenter.institute?.country || 'N/A' }}
                    </dd>
                  </div>
                  <div>
                    <dt class="font-medium text-gray-600">Dzongkhag/Thromde</dt>
                    <dd class="mt-1 text-gray-900">
                      {{ selectedCenter.institute?.dzongkhag || 'N/A' }}
                    </dd>
                  </div>
                  <div>
                    <dt class="font-medium text-gray-600">City/Gewog</dt>
                    <dd class="mt-1 text-gray-900">
                      {{ selectedCenter.institute?.gewog || 'N/A' }}
                    </dd>
                  </div>
                  <div>
                    <dt class="font-medium text-gray-600">Address/Location</dt>
                    <dd class="mt-1 text-gray-900 whitespace-pre-wrap">
                      {{ selectedCenter.institute?.address || 'N/A' }}
                    </dd>
                  </div>
                  <div>
                    <dt class="font-medium text-gray-600">Contact No.</dt>
                    <dd class="mt-1 text-gray-900">
                      {{ selectedCenter.institute?.contact_no || 'N/A' }}
                    </dd>
                  </div>
                  <div>
                    <dt class="font-medium text-gray-600">Email Address</dt>
                    <dd class="mt-1 text-gray-900">
                      {{ selectedCenter.institute?.email_address || 'N/A' }}
                    </dd>
                  </div>
                </dl>
              </section>

              <!-- Proposal Details (Read-Only) -->
              <section class="mb-6 opacity-80">
                <h4 class="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">
                  Proposal Details (Read-Only)
                </h4>
                <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <dt class="font-medium text-gray-600">Center Name</dt>
                    <dd class="mt-1 text-gray-900">{{ selectedCenter.center_name || 'N/A' }}</dd>
                  </div>
                  <div>
                    <dt class="font-medium text-gray-600">Center Location</dt>
                    <dd class="mt-1 text-gray-900">
                      {{ selectedCenter.center_location || 'N/A' }}
                    </dd>
                  </div>
                  <div>
                    <dt class="font-medium text-gray-600">City/Gewog</dt>
                    <dd class="mt-1 text-gray-900">{{ selectedCenter.city_gewog || 'N/A' }}</dd>
                  </div>
                  <div>
                    <dt class="font-medium text-gray-600">State/Dzongkhag</dt>
                    <dd class="mt-1 text-gray-900">
                      {{ selectedCenter.state_dzongkhag || 'N/A' }}
                    </dd>
                  </div>
                  <div class="sm:col-span-2">
                    <dt class="font-medium text-gray-600">Target Category</dt>
                    <dd class="mt-1 text-gray-900">
                      {{ selectedCenter.target_category || 'N/A' }}
                    </dd>
                  </div>
                  <div class="sm:col-span-2">
                    <dt class="font-medium text-gray-600">Attachments</dt>
                    <dd class="mt-1 text-gray-900">
                      <a v-if="selectedCenter.tc_attachments" :href="selectedCenter.tc_attachments" target="_blank"
                        rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800 hover:underline">View
                        Attachment</a>
                      <span v-else>N/A</span>
                    </dd>
                  </div>
                  <div class="sm:col-span-2">
                    <dt class="font-medium text-gray-600">Remarks (Proposal)</dt>
                    <dd class="mt-1 text-gray-900 whitespace-pre-wrap">
                      {{ selectedCenter.remarks || 'N/A' }}
                    </dd>
                  </div>
                  <div>
                    <dt class="font-medium text-gray-600">Declaration</dt>
                    <dd class="mt-1 text-gray-900">
                      {{ selectedCenter.tc_declaration ? 'Yes' : 'No' }}
                    </dd>
                  </div>
                </dl>
              </section>

              <!-- Review Form Section (Editable) -->
              <section class="border-t pt-4">
                <h4 class="text-lg font-semibold text-gray-800 mb-4">Review Details</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <!-- Renewal Review Name -->
                  <div class="sm:col-span-2">
                    <label for="renewal-review-name" class="block text-sm font-medium text-gray-700">Renewal Review
                      Name</label>
                    <input type="text" id="renewal-review-name" v-model="reviewForm.tc_renewal_review_name"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>

                  <!-- Review Summary -->
                  <div class="sm:col-span-2">
                    <label for="review-summary" class="block text-sm font-medium text-gray-700">Review Summary</label>
                    <textarea id="review-summary" v-model="reviewForm.tc_review_summary" rows="4"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                  </div>

                  <!-- Report Upload -->
                  <div class="sm:col-span-2">
                    <label for="report-upload" class="block text-sm font-medium text-gray-700">Upload Review
                      Report</label>
                    <input type="file" id="report-upload" @change="handleReportUpload" accept=".pdf,.doc,.docx"
                      class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                    <p v-if="reviewForm.reportFile" class="mt-1 text-xs text-gray-600">
                      Selected: {{ reviewForm.reportFile.name }}
                    </p>
                    <p v-else class="mt-1 text-xs text-gray-600">No file chosen</p>
                    <p v-if="selectedCenter.tc_report && !reviewForm.reportFile" class="mt-1 text-xs text-gray-600">
                      Current report:
                      <a :href="selectedCenter.tc_report" target="_blank" rel="noopener noreferrer"
                        class="text-indigo-600 hover:underline">View Existing</a>
                    </p>
                  </div>

                  <!-- Review Decision -->
                  <div>
                    <label for="review-decision" class="block text-sm font-medium text-gray-700">Review Decision</label>
                    <select id="review-decision" v-model="reviewForm.tc_review_decision"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white">
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Regretted">Regretted</option>
                    </select>
                  </div>

                  <!-- Valid Till -->
                  <div>
                    <label for="valid-till" class="block text-sm font-medium text-gray-700">Valid Till</label>
                    <input type="date" id="valid-till" v-model="reviewForm.valid_till"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="mm/dd/yyyy" />
                  </div>

                  <!-- Reason (if rejected) -->
                  <div class="sm:col-span-2" v-if="reviewForm.tc_review_decision === 'Regretted'">
                    <label for="reason-rejected" class="block text-sm font-medium text-gray-700">Reason (if rejected)
                      <span class="text-red-500">*</span></label>
                    <textarea id="reason-rejected" v-model="reviewForm.tc_reason_if_rejected" rows="3"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Provide reason for regretting"></textarea>
                  </div>

                  <!-- Remarks (Review) -->
                  <div class="sm:col-span-2">
                    <label for="review-remarks" class="block text-sm font-medium text-gray-700">Remarks (Review)</label>
                    <textarea id="review-remarks" v-model="reviewForm.tc_remarks" rows="3"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <!-- Modal Footer Actions -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t">
            <button type="button" @click="openApproveDialog" :disabled="loading"
              class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
              Approve
            </button>
            <button type="button" @click="openRejectDialog" :disabled="loading"
              class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
              Reject
            </button>
            <button type="button" @click="saveReview" :disabled="loading"
              class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
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

    <!-- Approve Confirmation Dialog -->
    <div v-if="approveDialog.show" class="fixed z-20 inset-0 overflow-y-auto" aria-labelledby="approve-dialog-title"
      role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"
          @click="closeApproveDialog"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
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
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
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
import { ref, onMounted } from 'vue'
import apiServices from '@/services/services'

const teachingCenters = ref([])
const isModalOpen = ref(false)
const selectedCenter = ref({ institute: {} })
const loading = ref(false)

const reviewForm = ref({
  tc_renewal_review_name: '',
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
    teachingCenters.value = results.filter((center) => center != null)
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
  selectedCenter.value = center || { institute: {} }
  reviewForm.value = {
    tc_renewal_review_name: center?.tc_renewal_review_name || '',
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
    formData.append('tc_renewal_review_name', reviewForm.value.tc_renewal_review_name || '')
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
    formData.append('tc_renewal_review_name', reviewForm.value.tc_renewal_review_name || '')
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
    formData.append('tc_renewal_review_name', reviewForm.value.tc_renewal_review_name || '')
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
