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

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6">
          <div class="sm:flex sm:items-start w-full">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <div class="flex justify-between items-center mb-4 pb-3 border-b">
                <h3 class="text-xl leading-6 font-semibold text-gray-900" id="modal-title">
                  Training Center Application Review
                </h3>
                <span
                  v-if="hospitalDetails.tc_review_decision"
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="statusBadgeClass"
                >
                  {{ formattedStatus(hospitalDetails.tc_review_decision) }}
                </span>
                <span
                  v-else
                  class="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                >
                  Pending Review
                </span>
              </div>

              <div class="max-h-[70vh] overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                <section class="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                  <h4
                    class="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200"
                  >
                    Proponent Details (Institute)
                  </h4>
                  <dl class="text-sm space-y-1" v-if="hospitalDetails.institute_details">
                    <div
                      class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 py-1.5 px-2 rounded bg-gray-50"
                    >
                      <dt class="font-medium text-gray-600">Institute Name:</dt>
                      <dd class="md:col-span-2 text-gray-800">
                        {{ hospitalDetails.institute_details.name_of_institution || 'N/A' }}
                      </dd>
                    </div>
                    <div
                      class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 py-1.5 px-2 rounded"
                    >
                      <dt class="font-medium text-gray-600">Institute CID:</dt>
                      <dd class="md:col-span-2 text-gray-800">
                        {{ hospitalDetails.institute_details.CID || 'N/A' }}
                      </dd>
                    </div>
                  </dl>
                  <p v-else class="text-sm text-gray-500">Institute details not available.</p>
                </section>

                <section class="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                  <h4
                    class="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200"
                  >
                    Proposed Training Center Details
                  </h4>
                  <dl class="text-sm space-y-1">
                    <div
                      class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 py-1.5 px-2 rounded bg-gray-50"
                    >
                      <dt class="font-medium text-gray-600">Center Name:</dt>
                      <dd class="md:col-span-2 text-gray-800">
                        {{ hospitalDetails.center_name || 'N/A' }}
                      </dd>
                    </div>
                    <div
                      class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 py-1.5 px-2 rounded"
                    >
                      <dt class="font-medium text-gray-600">Attachments (Applicant):</dt>
                      <dd class="md:col-span-2 text-gray-800"></dd>
                    </div>
                  </dl>
                </section>

                <section class="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                  <h4
                    class="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200"
                  >
                    Clinical Preceptors
                  </h4>
                  <div
                    v-if="
                      hospitalDetails.clinical_preceptors &&
                      hospitalDetails.clinical_preceptors.length > 0
                    "
                  >
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Name
                          </th>
                          <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Qualification
                          </th>
                          <!-- <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Officer Decision
                          </th> -->
                          <!-- <th
                            scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th> -->
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr
                          v-for="preceptor in hospitalDetails.clinical_preceptors"
                          :key="preceptor.id"
                        >
                          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {{ preceptor.name }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ preceptor.qualification }}
                          </td>
                          <!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span
                              :class="getDecisionStatusClass(preceptor.officer_decision)"
                              class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                            >
                              {{ formattedStatus(preceptor.officer_decision) }}
                            </span>
                          </td> -->
                          <!-- <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              @click="openPreceptorReviewModal(preceptor)"
                              class="text-indigo-600 hover:text-indigo-900"
                            >
                              Review
                            </button>
                          </td> -->
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p v-else class="text-sm text-gray-500">
                    No clinical preceptors assigned to this center yet.
                  </p>
                </section>

                <section class="mt-6 pt-6 border-t-2 border-green-200">
                  <div class="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-6">
                    <h4 class="text-xl font-bold text-green-800 mb-2 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Dealing Officer Actions
                    </h4>
                    <p class="text-green-700 text-sm">
                      Review and make decisions on this teaching center application.
                    </p>
                  </div>

                  <div
                    v-if="isEffectivelyRejected && hospitalDetails.tc_reason_if_rejected"
                    class="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg"
                  >
                    <div class="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-red-600 mt-0.5 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <div>
                        <h5 class="font-semibold text-red-800">Application Rejected</h5>
                        <p class="text-red-700 text-sm mt-1">
                          Reason: {{ hospitalDetails.tc_reason_if_rejected }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    v-if="
                      hospitalDetails.physical_verification_status &&
                      hospitalDetails.physical_verification_status !== 'PENDING_PV'
                    "
                    class="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg"
                  >
                    <div class="flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-blue-600 mt-0.5 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <div>
                        <h5 class="font-semibold text-blue-800">Physical Verification Recorded</h5>
                        <p
                          v-if="hospitalDetails.site_visit_schedule_date"
                          class="text-blue-700 text-sm mt-1"
                        >
                          Scheduled Date: {{ formatDate(hospitalDetails.site_visit_schedule_date) }}
                        </p>
                        <p
                          v-if="hospitalDetails.physical_verification_date"
                          class="text-blue-700 text-sm mt-1"
                        >
                          Actual Date: {{ formatDate(hospitalDetails.physical_verification_date) }}
                        </p>
                        <p class="text-blue-700 text-sm">
                          Status:
                          {{
                            formattedVerificationStatus(
                              hospitalDetails.physical_verification_status
                            )
                          }}
                        </p>
                        <p class="text-blue-700 text-sm">
                          Remarks: {{ hospitalDetails.physical_verification_remarks || 'N/A' }}
                        </p>
                        <div
                          v-if="
                            hospitalDetails.officer_uploaded_files &&
                            hospitalDetails.officer_uploaded_files.length > 0
                          "
                          class="mt-2"
                        >
                          <h6 class="font-semibold text-blue-800 text-sm">
                            Officer Uploaded Files:
                          </h6>
                          <ul class="list-disc list-inside text-blue-700 text-sm">
                            <li
                              v-for="file in hospitalDetails.officer_uploaded_files"
                              :key="file.id"
                            >
                              <a
                                :href="file.file_url"
                                target="_blank"
                                class="text-blue-600 hover:underline"
                                >{{ file.description || getFileNameFromUrl(file.file_url) }}</a
                              >
                              (Uploaded by: {{ file.uploaded_by_name || 'N/A' }} on
                              {{ formatDate(file.uploaded_at) }})
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-if="!isEffectivelyApproved && !isEffectivelyRejected">
                    <div
                      class="mb-8 p-6 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50"
                    >
                      <h5 class="text-xl font-bold text-blue-800 mb-4">
                        Physical Verification Management
                      </h5>
                      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label
                            for="verificationStatus"
                            class="block text-sm font-semibold text-blue-700 mb-2"
                          >
                            Verification Status <span class="text-red-500">*</span>
                          </label>
                          <select
                            id="verificationStatus"
                            v-model="localVerificationData.status"
                            class="form-input"
                          >
                            <option value="PENDING_PV">Pending (Scheduled)</option>
                            <option value="IN_PROGRESS_PV">In Progress</option>
                            <option value="VERIFIED_PV">Verified & Recommended</option>
                            <option value="NOT_VERIFIED_PV">Failed / Not Recommended</option>
                            <option value="NOT_REQUIRED_PV">Not Required</option>
                          </select>
                        </div>
                        <div v-if="localVerificationData.status === 'PENDING_PV'">
                          <label
                            for="siteVisitScheduleDate"
                            class="block text-sm font-semibold text-blue-700 mb-2"
                          >
                            Site Visit Schedule Date
                          </label>
                          <input
                            type="date"
                            id="siteVisitScheduleDate"
                            v-model="localVerificationData.siteVisitScheduleDate"
                            :min="todayDate()"
                            class="form-input"
                          />
                        </div>
                        <div
                          v-if="
                            localVerificationData.status !== 'PENDING_PV' &&
                            localVerificationData.status !== 'NOT_REQUIRED_PV'
                          "
                        >
                          <label
                            for="actualVerificationDate"
                            class="block text-sm font-semibold text-blue-700 mb-2"
                          >
                            Actual Verification Date
                          </label>
                          <input
                            type="date"
                            id="actualVerificationDate"
                            v-model="localVerificationData.actualVerificationDate"
                            :max="todayDate()"
                            class="form-input"
                          />
                        </div>
                        <div class="lg:col-span-2">
                          <label
                            for="verificationReport"
                            class="block text-sm font-semibold text-blue-700 mb-2"
                          >
                            Verification Remarks / Notes <span class="text-red-500">*</span>
                          </label>
                          <textarea
                            id="verificationReport"
                            v-model="localVerificationData.report"
                            rows="4"
                            class="form-input"
                            placeholder="Add scheduling plan, site visit findings, reasons for recommendation/failure, etc."
                          ></textarea>
                        </div>

                        <div
                          v-if="
                            ['IN_PROGRESS_PV', 'VERIFIED_PV', 'NOT_VERIFIED_PV'].includes(
                              localVerificationData.status
                            )
                          "
                          class="lg:col-span-2 space-y-4 pt-4 border-t border-blue-200"
                        >
                          <h6 class="text-md font-semibold text-blue-700">
                            Upload Officer's Documents (Optional)
                          </h6>
                          <div>
                            <label
                              for="modal-tcReportFile-do"
                              class="block text-sm font-medium text-blue-700 mb-1"
                            >
                              Officer's Main Report (PDF, Word, etc.)
                            </label>
                            <input
                              type="file"
                              id="modal-tcReportFile-do"
                              ref="reportFileInputRef"
                              @change="handleReportFileChange"
                              class="file-input"
                            />
                          </div>
                          <div>
                            <label
                              for="modal-tcAttachments-do"
                              class="block text-sm font-medium text-blue-700 mb-1"
                            >
                              Officer's Supporting Attachments (Images, etc.)
                            </label>
                            <input
                              type="file"
                              id="modal-tcAttachments-do"
                              ref="attachmentsInputRef"
                              multiple
                              @change="handleAttachmentsChange"
                              class="file-input"
                            />
                          </div>
                        </div>

                        <div class="lg:col-span-2 bg-white p-4 rounded-lg border border-blue-200" v-if="localVerificationData.status === 'PENDING_PV'">
                          <div class="flex items-start">
                            <div class="flex items-center h-5">
                              <input
                                id="sendToUserModal"
                                v-model="localVerificationData.sendToUser"
                                type="checkbox"
                                class="focus:ring-blue-500 h-5 w-5 text-blue-600 border-2 border-blue-300 rounded"
                              />
                            </div>
                            <div class="ml-3" >
                              <label
                                for="sendToUserModal"
                                class="font-semibold text-blue-700 text-sm"
                                >Send notification to user</label
                              >
                              <p class="text-blue-600 text-xs mt-1">
                                Check to notify applicant about this verification update.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        @click="submitVerificationHandler"
                        :disabled="
                          !localVerificationData.status ||
                          !localVerificationData.report.trim() ||
                          (localVerificationData.status === 'PENDING_PV' &&
                            !localVerificationData.siteVisitScheduleDate) ||
                          (localVerificationData.status !== 'PENDING_PV' &&
                            localVerificationData.status !== 'NOT_REQUIRED_PV' &&
                            !localVerificationData.actualVerificationDate)
                        "
                        class="btn btn-info py-3 px-6 text-sm font-semibold"
                      >
                        Save Verification Status
                      </button>
                    </div>

                    <div class="mt-8 p-6 border border-gray-300 rounded-xl bg-gray-50 shadow-lg">
                      <div class="text-center mb-6">
                        <h5 class="text-xl font-semibold text-gray-800">Make Final Decision</h5>
                        <p class="text-sm text-gray-600">
                          This action is final. Approve or reject the application.
                        </p>
                      </div>

                      <div v-if="actionAttempt === 'reject'" class="mb-6">
                        <label
                          for="modalRejectionReason"
                          class="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Reason for Rejection <span class="text-red-500">*</span>
                        </label>
                        <textarea
                          id="modalRejectionReason"
                          v-model="rejectionReason"
                          rows="4"
                          class="form-input"
                          placeholder="Provide a clear reason for rejection. This will be shown to the applicant."
                        ></textarea>
                      </div>

                      <div class="flex flex-col sm:flex-row justify-center items-center gap-6">
                        <button
                          type="button"
                          @click="handleApprove"
                          :disabled="!isVerificationSufficientForApproval"
                          class="btn btn-success"
                        >
                          Approve Application
                        </button>
                        <button type="button" @click="prepareReject" class="btn btn-danger">
                          {{
                            actionAttempt === 'reject' && rejectionReason.trim()
                              ? 'Confirm Rejection'
                              : 'Reject Application'
                          }}
                        </button>
                      </div>

                      <p
                        v-if="!isVerificationSufficientForApproval"
                        class="mt-4 text-center text-sm text-orange-600"
                      >
                        Approval is disabled. The verification status must be 'Verified &
                        Recommended' or 'Not Required'.
                      </p>
                    </div>
                  </div>

                  <div
                    v-if="isEffectivelyApproved"
                    class="mt-8 p-6 bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-400 rounded-xl"
                  >
                    <div class="flex items-center">
                      <div class="bg-green-500 p-2 rounded-full mr-4">
                        <svg class="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 class="text-xl font-bold text-green-800">✅ Application Approved</h3>
                        <p class="mt-2 text-green-700 font-medium">
                          This application has been approved. Payment can now be initiated by the
                          institute.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    v-if="isEffectivelyRejected && !canDecide"
                    class="mt-8 p-6 bg-gradient-to-r from-red-100 to-red-200 border-2 border-red-400 rounded-xl"
                  >
                    <div class="flex items-center">
                      <div class="bg-red-500 p-2 rounded-full mr-4">
                        <svg class="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 class="text-xl font-bold text-red-800">❌ Application Rejected</h3>
                        <p class="mt-2 text-red-700 font-medium">
                          This application was rejected. Applicant has been notified.
                        </p>
                        <p
                          v-if="hospitalDetails.tc_reason_if_rejected"
                          class="mt-1 text-sm text-red-600"
                        >
                          Rejection Reason: {{ hospitalDetails.tc_reason_if_rejected }}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" @click="closeModal" class="btn btn-secondary">Close</button>
        </div>
      </div>
    </div>

    <!-- <div v-if="isPreceptorReviewModalOpen" class="fixed z-30 inset-0 overflow-y-auto">
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="closePreceptorReviewModal"
          aria-hidden="true"
        ></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"
          >&#8203;</span
        >
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Review Clinical Preceptor</h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                <strong>Name:</strong> {{ selectedPreceptor.name }}
              </p>
              <div class="mt-4">
                <label for="officer_decision" class="block text-sm font-medium text-gray-700"
                  >Decision</label
                >
                <select
                  id="officer_decision"
                  v-model="preceptorReviewData.officer_decision"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Regretted</option>
                </select>
              </div>
              <div class="mt-4">
                <label for="officer_remarks" class="block text-sm font-medium text-gray-700"
                  >Remarks</label
                >
                <textarea
                  id="officer_remarks"
                  v-model="preceptorReviewData.officer_remarks"
                  rows="3"
                  class="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                ></textarea>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="submitPreceptorReview"
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Save Review
            </button>
            <button
              @click="closePreceptorReviewModal"
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import apiServices from '@/services/services.js' // Ensure this path is correct
import { useToast } from 'vue-toastification'

const props = defineProps({
  isOpen: Boolean,
  hospitalDetails: {
    type: Object,
    default: () => ({
      institute_details: {},
      tc_attachments: null,
      tc_report: null,
      physical_verification_date: null,
      site_visit_schedule_date: null,
      physical_verification_remarks: null,
      physical_verification_status: null,
      send_to_user: false,
      tc_reason_if_rejected: null,
      tc_review_decision: null,
      center_name: '',
      officer_uploaded_files: [],
      clinical_preceptors: [], // Ensure this is part of the default object
    }),
  },
})

const emit = defineEmits(['close-modal', 'approve', 'reject', 'submit-verification'])
const toast = useToast()

// Refs for file inputs
const attachmentsInputRef = ref(null)
const reportFileInputRef = ref(null)

// Refs to store selected files by DO
const selectedAttachments = ref(null) // FileList
const selectedReportFile = ref(null) // File

// Ref for all local verification form data
const localVerificationData = ref({
  siteVisitScheduleDate: '',
  actualVerificationDate: '',
  report: '',
  status: 'PENDING_PV',
  sendToUser: false,
})

const rejectionReason = ref('')
const actionAttempt = ref(null) // Tracks if user clicked 'Reject' to show the reason box

// const isPreceptorReviewModalOpen = ref(false)
const selectedPreceptor = ref(null)
const preceptorReviewData = ref({
  officer_decision: '',
  officer_remarks: '',
})

// Watcher to sync local state with props when modal opens or data changes
watch(
  () => props.hospitalDetails,
  (newDetails) => {
    if (newDetails && props.isOpen) {
      localVerificationData.value = {
        siteVisitScheduleDate: newDetails.site_visit_schedule_date
          ? new Date(newDetails.site_visit_schedule_date).toISOString().split('T')[0]
          : '',
        actualVerificationDate: newDetails.physical_verification_date
          ? new Date(newDetails.physical_verification_date).toISOString().split('T')[0]
          : '',
        report: newDetails.physical_verification_remarks || '',
        status: newDetails.physical_verification_status || 'PENDING_PV',
        sendToUser: newDetails.send_to_user || false,
      }
      rejectionReason.value = newDetails.tc_reason_if_rejected || ''
      actionAttempt.value = null // Reset action attempt on data change
      resetFileInputs() // Clear any stale file selections

      // Ensure clinical_preceptors is an array
      if (!newDetails.clinical_preceptors) {
        newDetails.clinical_preceptors = []
      }
    }
  },
  { immediate: true, deep: true }
)

// --- Computed Properties for UI Logic ---
const isEffectivelyApproved = computed(
  () => props.hospitalDetails?.tc_review_decision === 'Approved'
)
const isEffectivelyRejected = computed(() => {
  const decision = props.hospitalDetails?.tc_review_decision
  return decision === 'Rejected' || decision === 'Regretted'
})
const canDecide = computed(() => !isEffectivelyApproved.value && !isEffectivelyRejected.value)
const isVerificationSufficientForApproval = computed(() => {
  const pvStatus = props.hospitalDetails?.physical_verification_status
  return pvStatus === 'VERIFIED_PV' || pvStatus === 'NOT_REQUIRED_PV'
})

const statusBadgeClass = computed(() => {
  const status = props.hospitalDetails?.tc_review_decision
  return getDecisionStatusClass(status)
})

// --- Preceptor Review Methods ---
// function openPreceptorReviewModal(preceptor) {
//   selectedPreceptor.value = { ...preceptor }
//   preceptorReviewData.value.officer_decision = preceptor.officer_decision || 'Pending'
//   preceptorReviewData.value.officer_remarks = preceptor.officer_remarks || ''
//   isPreceptorReviewModalOpen.value = true
// }

// function closePreceptorReviewModal() {
//   isPreceptorReviewModalOpen.value = false
//   selectedPreceptor.value = null
// }

// async function submitPreceptorReview() {
//   if (!selectedPreceptor.value) return

//   try {
//     const response = await apiServices.reviewClinicalPreceptor(
//       selectedPreceptor.value.id,
//       preceptorReviewData.value
//     )

//     const index = props.hospitalDetails.clinical_preceptors.findIndex(
//       (p) => p.id === selectedPreceptor.value.id
//     )
//     if (index !== -1) {
//       props.hospitalDetails.clinical_preceptors[index] = response.data
//     }

//     closePreceptorReviewModal()
//     toast.success('Preceptor review updated successfully!')
//   } catch (error) {
//     console.error('Failed to update preceptor review:', error)
//     toast.error('Failed to update preceptor review. Please try again.')
//   }
// }

// --- Main Modal Event Handlers ---
const submitVerificationHandler = () => {
  if (!localVerificationData.value.report.trim()) {
    alert('Verification Remarks/Notes are required to save the status.')
    return
  }
  if (
    localVerificationData.value.status === 'PENDING_PV' &&
    !localVerificationData.value.siteVisitScheduleDate
  ) {
    alert('Site Visit Schedule Date is required for Pending status.')
    return
  }
  if (
    ['IN_PROGRESS_PV', 'VERIFIED_PV', 'NOT_VERIFIED_PV'].includes(
      localVerificationData.value.status
    ) &&
    !localVerificationData.value.actualVerificationDate
  ) {
    alert(
      'Actual Verification Date is required for In Progress, Verified, or Not Verified statuses.'
    )
    return
  }

  const payloadToEmit = {
    siteVisitScheduleDate: localVerificationData.value.siteVisitScheduleDate || null,
    actualVerificationDate: localVerificationData.value.actualVerificationDate || null,
    verificationReport: localVerificationData.value.report,
    verificationStatus: localVerificationData.value.status,
    sendToUser: localVerificationData.value.sendToUser,
    officer_attachments: selectedAttachments.value,
    officer_report: selectedReportFile.value,
  }

  emit('submit-verification', payloadToEmit)
}

const handleApprove = () => {
  if (!isVerificationSufficientForApproval.value) {
    alert(
      "Cannot approve. The verification status must be set to 'Verified & Recommended' or 'Not Required' first."
    )
    return
  }
  actionAttempt.value = null
  emit('approve')
}

const prepareReject = () => {
  if (actionAttempt.value === 'reject' && rejectionReason.value.trim()) {
    emit('reject', { rejectionReason: rejectionReason.value.trim() })
    actionAttempt.value = null
  } else {
    actionAttempt.value = 'reject'
  }
}

const closeModal = () => {
  emit('close-modal')
  actionAttempt.value = null
  rejectionReason.value = ''
  resetFileInputs()
}

// --- File Handling ---
const handleAttachmentsChange = (event) => {
  selectedAttachments.value = event.target.files
}

const handleReportFileChange = (event) => {
  selectedReportFile.value = event.target.files[0]
}

const resetFileInputs = () => {
  if (attachmentsInputRef.value) attachmentsInputRef.value.value = null
  if (reportFileInputRef.value) reportFileInputRef.value.value = null
  selectedAttachments.value = null
  selectedReportFile.value = null
}

// --- Formatting & Helper Functions ---
const todayDate = () => new Date().toISOString().split('T')[0]

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    return isNaN(date.getTime())
      ? dateString
      : date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch (e) {
    return dateString
  }
}

const formattedStatus = (statusKey) => {
  if (!statusKey) return 'Pending'
  return String(statusKey)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

const formattedVerificationStatus = (statusKey) => {
  if (!statusKey) return 'N/A'
  const statusMap = {
    PENDING_PV: 'Pending Physical Verification (Scheduled)',
    IN_PROGRESS_PV: 'Physical Verification In Progress',
    VERIFIED_PV: 'Physically Verified & Recommended',
    NOT_VERIFIED_PV: 'Physical Verification Failed / Not Recommended',
    NOT_REQUIRED_PV: 'Physical Verification Not Required',
  }
  return statusMap[statusKey] || formattedStatus(statusKey)
}

const getDecisionStatusClass = (status) => {
  const s = String(status).toLowerCase()
  if (s === 'approved') return 'bg-green-100 text-green-800'
  if (s === 'regretted' || s === 'rejected') return 'bg-red-100 text-red-800'
  return 'bg-yellow-100 text-yellow-800' // Pending
}

const getFileNameFromUrl = (url) => {
  return url ? url.substring(url.lastIndexOf('/') + 1) : 'attachment'
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
.whitespace-pre-wrap {
  white-space: pre-wrap;
}

.btn {
  @apply inline-flex justify-center items-center rounded-md border shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out;
}
.btn-success {
  @apply border-transparent bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300;
}
.btn-danger {
  @apply border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300;
}
.btn-info {
  @apply border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300;
}
.btn-secondary {
  @apply border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500;
}

.form-input {
  @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2;
}
.file-input {
  @apply block w-full text-sm text-gray-900 border border-blue-300 rounded-lg cursor-pointer bg-blue-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-200 file:text-blue-700 hover:file:bg-blue-300;
}
</style>
