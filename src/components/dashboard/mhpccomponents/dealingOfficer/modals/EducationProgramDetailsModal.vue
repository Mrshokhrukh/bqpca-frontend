<template>
  <Teleport to="body">
    <transition name="modal">
      <div
        v-if="isOpen"
        class="fixed z-50 inset-0 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay with transition -->
          <transition name="fade">
            <div
              class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              @click="closeModal"
            ></div>
          </transition>

          <!-- Modal container -->
          <div
            class="inline-block align-bottom bg-white rounded-t-lg sm:rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl w-full"
          >
            <!-- Header with status badge -->
            <div class="bg-white px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-xl font-semibold text-gray-900" id="modal-title">
                    Program Details
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">
                    Review and manage education program information
                  </p>
                </div>
                <div>
                  <span
                    class="px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
                    :class="{
                      'bg-yellow-100 text-yellow-800': programDetails.ins_review_decision === 'Pending',
                      'bg-green-100 text-green-800': programDetails.ins_review_decision === 'Approved',
                      'bg-red-100 text-red-800': programDetails.ins_review_decision === 'Regretted',
                    }"
                  >
                    {{ programDetails.ins_review_decision || 'Pending' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Scrollable content area -->
            <div class="max-h-[70vh] overflow-y-auto px-6 py-4">
              <!-- Form sections with cards -->
              <div class="space-y-6">
                <!-- Basic Information Card -->
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <svg class="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    BASIC INFORMATION
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label for="institute" class="block text-sm font-medium text-gray-700 mb-1">Institute</label>
                      <input
                        type="text"
                        id="institute"
                        v-model="editableData.institute"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        :disabled="!isEditing"
                        :class="{ 'bg-gray-100': !isEditing }"
                      />
                    </div>
                    <div>
                      <label for="course-title" class="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                      <input
                        type="text"
                        id="course-title"
                        v-model="editableData.course_title"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        :disabled="!isEditing"
                        :class="{ 'bg-gray-100': !isEditing }"
                      />
                    </div>
                    <div>
                      <label for="duration" class="block text-sm font-medium text-gray-700 mb-1">Duration (Months)</label>
                      <input
                        type="text"
                        id="duration"
                        v-model="editableData.duration_in_months"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        :disabled="!isEditing"
                        :class="{ 'bg-gray-100': !isEditing }"
                      />
                    </div>
                    <div>
                      <label for="commencement-date" class="block text-sm font-medium text-gray-700 mb-1">Commencement Date</label>
                      <input
                        type="date"
                        id="commencement-date"
                        v-model="editableData.commencement_date"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        :disabled="!isEditing"
                        :class="{ 'bg-gray-100': !isEditing }"
                      />
                    </div>
                  </div>
                </div>

                <!-- Documents Card -->
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <svg class="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    DOCUMENTS
                  </h4>
                  <div class="grid grid-cols-1 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Institute Attachment</label>
                      <div v-if="!isEditing">
                        <a
                          v-if="originalAttachmentUrl"
                          :href="originalAttachmentUrl"
                          target="_blank"
                          class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg class="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                          </svg>
                          View Attachment
                        </a>
                        <span v-else class="text-sm text-gray-500">No attachment available</span>
                      </div>
                      <div v-else>
                        <div class="flex items-center space-x-4">
                          <div class="flex-1">
                            <input
                              type="file"
                              id="institute-attachments"
                              ref="fileInput"
                              @change="handleFileChange"
                              class="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                            />
                          </div>
                          <div v-if="originalAttachmentUrl">
                            <a
                              :href="originalAttachmentUrl"
                              target="_blank"
                              class="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                            >
                              <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Current
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Review Report</label>
                      <div v-if="!isEditing">
                        <a
                          v-if="editableData.ins_report"
                          :href="editableData.ins_report"
                          target="_blank"
                          class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg class="-ml-0.5 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                          </svg>
                          View Report
                        </a>
                        <span v-else class="text-sm text-gray-500">No report available</span>
                      </div>
                      <div v-else>
                        <div class="flex items-center space-x-4">
                          <div class="flex-1">
                            <input
                              type="file"
                              id="ins-report"
                              ref="reportFileInput"
                              @change="handleReportFileChange"
                              class="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                            />
                          </div>
                          <div v-if="editableData.ins_report">
                            <a
                              :href="editableData.ins_report"
                              target="_blank"
                              class="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                            >
                              <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Current
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Review Details Card -->
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <svg class="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    REVIEW DETAILS
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label for="renewal-review-name" class="block text-sm font-medium text-gray-700 mb-1">Reviewer Name</label>
                      <input
                        type="text"
                        id="renewal-review-name"
                        v-model="editableData.ins_renewal_review_name"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        :disabled="!isEditing"
                        :class="{ 'bg-gray-100': !isEditing }"
                      />
                    </div>
                    <div>
                      <label for="review-summary" class="block text-sm font-medium text-gray-700 mb-1">Review Summary</label>
                      <textarea
                        id="review-summary"
                        v-model="editableData.ins_review_summary"
                        rows="2"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        :disabled="!isEditing"
                        :class="{ 'bg-gray-100': !isEditing }"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <!-- Status Card -->
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <svg class="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    STATUS
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Review Decision</label>
                      <div class="flex items-center">
                        <span
                          class="px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
                          :class="{
                            'bg-yellow-100 text-yellow-800': programDetails.ins_review_decision === 'Pending',
                            'bg-green-100 text-green-800': programDetails.ins_review_decision === 'Approved',
                            'bg-red-100 text-red-800': programDetails.ins_review_decision === 'Regretted',
                          }"
                        >
                          {{ programDetails.ins_review_decision || 'Pending' }}
                        </span>
                      </div>
                    </div>
                    <div v-if="programDetails.ins_review_decision === 'Regretted'">
                      <label for="rejection-reason" class="block text-sm font-medium text-gray-700 mb-1">Reason for Regret</label>
                      <textarea
                        id="rejection-reason"
                        v-model="editableData.ins_reason_if_rejected"
                        rows="2"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        :disabled="!isEditing"
                        :class="{ 'bg-gray-100': !isEditing }"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <!-- Additional Information Card -->
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <svg class="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ADDITIONAL INFORMATION
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label for="remarks" class="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                      <textarea
                        id="remarks"
                        v-model="editableData.remarks"
                        rows="2"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        :disabled="!isEditing"
                        :class="{ 'bg-gray-100': !isEditing }"
                      ></textarea>
                    </div>
                    <div>
                      <label for="ins-remarks" class="block text-sm font-medium text-gray-700 mb-1">Internal Remarks</label>
                      <textarea
                        id="ins-remarks"
                        v-model="editableData.ins_remarks"
                        rows="2"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        :disabled="!isEditing"
                        :class="{ 'bg-gray-100': !isEditing }"
                      ></textarea>
                    </div>
                    <div>
                      <label for="is-active" class="block text-sm font-medium text-gray-700 mb-1">Active Status</label>
                      <select
                        id="is-active"
                        v-model="editableData.is_active"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        :disabled="!isEditing"
                        :class="{ 'bg-gray-100': !isEditing }"
                      >
                        <option :value="true">Active</option>
                        <option :value="false">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label for="ins-declaration" class="block text-sm font-medium text-gray-700 mb-1">Declaration</label>
                      <select
                        id="ins-declaration"
                        v-model="editableData.ins_declaration"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        :disabled="!isEditing"
                        :class="{ 'bg-gray-100': !isEditing }"
                      >
                        <option :value="true">Confirmed</option>
                        <option :value="false">Not Confirmed</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Validity & Payment Card -->
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <svg class="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    VALIDITY & PAYMENT
                  </h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label for="valid-since" class="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
                      <input
                        type="date"
                        id="valid-since"
                        v-model="editableData.valid_since"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        :disabled="!isEditing"
                        :class="{ 'bg-gray-100': !isEditing }"
                      />
                    </div>
                    <div>
                      <label for="valid-till" class="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                      <input
                        type="date"
                        id="valid-till"
                        v-model="editableData.valid_till"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        :disabled="!isEditing"
                        :class="{ 'bg-gray-100': !isEditing }"
                      />
                    </div>
                    <div>
                      <label for="payment-id" class="block text-sm font-medium text-gray-700 mb-1">Payment ID</label>
                      <input
                        type="text"
                        id="payment-id"
                        v-model="editableData.payment_id"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        :disabled="!isEditing"
                        :class="{ 'bg-gray-100': !isEditing }"
                      />
                    </div>
                    <div>
                      <label for="is-payment-complete" class="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                      <select
                        id="is-payment-complete"
                        v-model="editableData.is_payment_complete"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        :disabled="!isEditing"
                        :class="{ 'bg-gray-100': !isEditing }"
                      >
                        <option :value="true">Completed</option>
                        <option :value="false">Pending</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer with action buttons -->
            <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row-reverse sm:justify-start sm:space-x-4 sm:space-x-reverse">
              <!-- Save button (when editing) -->
              <button
                v-if="isEditing"
                type="button"
                class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-2 sm:mb-0"
                @click="saveChanges"
              >
                <svg class="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </button>

              <!-- Edit button (when not editing) -->
              <button
                v-if="!isEditing"
                type="button"
                class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-2 sm:mb-0"
                @click="startEditing"
              >
                <svg class="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>

              <!-- Cancel button (when editing) -->
              <button
                v-if="isEditing"
                type="button"
                class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-2 sm:mb-0"
                @click="cancelEditing"
              >
                Cancel
              </button>

              <!-- Approve button (when not editing and not approved) -->
              <button
                v-if="!isEditing && programDetails.ins_review_decision !== 'Approved'"
                type="button"
                class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mb-2 sm:mb-0"
                @click="$emit('approve')"
              >
                <svg class="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Approve
              </button>

              <!-- Regret button (when not editing and not regretted) -->
              <button
                v-if="!isEditing && programDetails.ins_review_decision !== 'Regretted'"
                type="button"
                class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                @click="$emit('regret')"
              >
                <svg class="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Regret
              </button>

              <!-- Close button (when not editing) -->
              <button
                v-if="!isEditing"
                type="button"
                class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                @click="closeModal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import apiServices from '@/services/services'

const props = defineProps({
  isOpen: Boolean,
  programDetails: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['close-modal', 'approve', 'regret', 'update'])

// Track editing state
const isEditing = ref(false)

// References for file inputs
const fileInput = ref(null)
const reportFileInput = ref(null)

// File upload states
const selectedFile = ref(null)
const selectedReportFile = ref(null)

// Store original attachment URL
const originalAttachmentUrl = computed(() => {
  return props.programDetails.institute_attachments || ''
})

// Create a reactive copy of the program details for editing
const editableData = reactive({})

// Watch for changes in programDetails and update the editable copy
watch(() => props.programDetails, (newVal) => {
  // Copy all properties from programDetails to editableData
  Object.keys(newVal).forEach(key => {
    editableData[key] = newVal[key]
  })
}, { immediate: true, deep: true })

const closeModal = () => {
  isEditing.value = false
  emit('close-modal')
}

const startEditing = () => {
  isEditing.value = true
  // Reset file selections
  selectedFile.value = null
  selectedReportFile.value = null
}

const cancelEditing = () => {
  isEditing.value = false
  // Reset editable data to original values
  Object.keys(props.programDetails).forEach(key => {
    editableData[key] = props.programDetails[key]
  })
  // Reset file selections
  selectedFile.value = null
  selectedReportFile.value = null
}

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0] || null
}

const handleReportFileChange = (event) => {
  selectedReportFile.value = event.target.files[0] || null
}

const saveChanges = async () => {
  try {
    // Create a FormData object for multipart/form-data submission
    const formData = new FormData()

    // Add all editable fields except review decision and file fields
    for (const key in editableData) {
      if (
        key !== 'ins_review_decision' &&
        key !== 'institute_attachments' &&
        key !== 'ins_report'
      ) {
        formData.append(key, editableData[key] === null ? '' : editableData[key])
      }
    }

    // Add file if selected
    if (selectedFile.value) {
      formData.append('institute_attachments', selectedFile.value)
    }

    // Add report file if selected
    if (selectedReportFile.value) {
      formData.append('ins_report', selectedReportFile.value)
    }

    // Call API to update the program
    const response = await apiServices.patchMhpcCourseDetail(editableData.id, formData)
    console.log('API update response:', response)

    // Notify parent component of the update
    emit('update', response)

    // Exit edit mode
    isEditing.value = false
  } catch (error) {
    console.error('Error updating program:', error)
    // You could add error handling UI here
  }
}
</script>

<style scoped>
/* Modal transition effects */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: translateY(20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
