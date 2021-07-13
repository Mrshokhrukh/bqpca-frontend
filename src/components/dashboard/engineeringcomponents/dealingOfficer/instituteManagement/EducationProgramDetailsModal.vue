<!-- src/components/modals/EducationProgramDetailsModal.vue -->
<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed z-30 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <!-- Background overlay -->
        <div
          class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          @click="close"
        ></div>

        <!-- Modal panel -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
        <div
          class="inline-block align-bottom bg-gray-50 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
        >
          <!-- Modal Header -->
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
            <div class="flex items-start justify-between">
              <div>
                <h3
                  class="text-2xl leading-6 font-bold text-gray-900 flex items-center"
                  id="modal-title"
                >
                  Program Details
                  <span
                    v-if="isEditing"
                    class="ml-3 mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    Editing
                  </span>
                </h3>
                <p class="text-sm text-gray-500 mt-1">
                  {{ localProgram.training_institute_name || 'N/A' }}
                </p>
              </div>
              <div class="ml-4 flex-shrink-0 flex items-center space-x-4">
                <button
                  v-if="!isEditing"
                  @click="startEditing"
                  type="button"
                  class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg
                    class="h-5 w-5 mr-2 -ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Edit
                </button>
                <button
                  @click="close"
                  type="button"
                  class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span class="sr-only">Close</span>
                  <svg
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Modal Content -->
          <div class="max-h-[70vh] overflow-y-auto px-6 py-5">
            <!-- Error Message Area -->
            <div
              v-if="modalError"
              class="p-4 mb-4 bg-red-50 text-red-800 border border-red-200 rounded-lg text-sm"
              role="alert"
            >
              <span class="font-medium">Error:</span> {{ modalError }}
            </div>

            <!-- View Mode -->
            <div v-if="!isEditing" class="space-y-8">
              <!-- Institute Details -->
              <section>
                <h4 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <svg
                    class="h-5 w-5 mr-2 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clip-rule="evenodd"
                    /></svg
                  >Institute Details
                </h4>
                <dl class="divide-y divide-gray-200">
                  <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">Location</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {{
                        [
                          localProgram.address_location,
                          localProgram.gewog,
                          localProgram.dzongkhag,
                          localProgram.country?.name || localProgram.country,
                        ]
                          .filter(Boolean)
                          .join(', ') || 'N/A'
                      }}
                    </dd>
                  </div>
                  <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">Contact No.</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {{ localProgram.contact_no || 'N/A' }}
                    </dd>
                  </div>
                  <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">Email Address</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {{ localProgram.email_address || 'N/A' }}
                    </dd>
                  </div>
                  <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">Website</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {{ localProgram.website || 'N/A' }}
                    </dd>
                  </div>
                  <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">Head of Institution</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {{ localProgram.head_institution_name || 'N/A' }} ({{
                        localProgram.head_institution_mobile || 'No mobile'
                      }})
                    </dd>
                  </div>
                </dl>
              </section>

              <!-- Proposal Details -->
              <section>
                <h4 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <svg
                    class="h-5 w-5 mr-2 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                    /></svg
                  >Proposal Details
                </h4>
                <dl class="divide-y divide-gray-200">
                  <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">Proposal Title</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {{ localProgram.proposal_title || 'N/A' }}
                    </dd>
                  </div>
                  <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">Duration</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {{
                        localProgram.duration_months
                          ? `${localProgram.duration_months} Months`
                          : 'N/A'
                      }}
                    </dd>
                  </div>
                  <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">Commencement</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {{ formatDate(localProgram.commencement_date) }}
                    </dd>
                  </div>
                  <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">Attachment</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <a
                        v-if="localProgram.proposal_attachment"
                        :href="localProgram.proposal_attachment"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="font-medium text-indigo-600 hover:text-indigo-500"
                        >View Attachment</a
                      ><span v-else>None</span>
                    </dd>
                  </div>
                </dl>
              </section>

              <!-- Review Details -->
              <section>
                <h4 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <svg
                    class="h-5 w-5 mr-2 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    /></svg
                  >Review Details
                </h4>
                <dl class="divide-y divide-gray-200">
                  <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">Status</dt>
                    <dd class="mt-1 sm:mt-0 sm:col-span-2">
                      <span
                        class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="{
                          'bg-yellow-100 text-yellow-800':
                            localProgram.review_decision === 'Pending',
                          'bg-green-100 text-green-800':
                            localProgram.review_decision === 'Approved',
                          'bg-red-100 text-red-800': localProgram.review_decision === 'Regretted',
                        }"
                        >{{ localProgram.review_decision_display || 'Unknown' }}</span
                      >
                    </dd>
                  </div>
                  <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">Review Report</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <a
                        v-if="localProgram.review_report_upload"
                        :href="localProgram.review_report_upload"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="font-medium text-indigo-600 hover:text-indigo-500"
                        >View Report</a
                      ><span v-else>None</span>
                    </dd>
                  </div>
                  <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">Summary</dt>
                    <dd
                      class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap"
                    >
                      {{ localProgram.review_summary || 'N/A' }}
                    </dd>
                  </div>
                  <div
                    class="py-3 sm:grid sm:grid-cols-3 sm:gap-4"
                    v-if="
                      localProgram.review_decision === 'Regretted' &&
                      localProgram.reason_if_rejected
                    "
                  >
                    <dt class="text-sm font-medium text-red-500">Reason for Regret</dt>
                    <dd class="mt-1 text-sm text-red-700 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">
                      {{ localProgram.reason_if_rejected }}
                    </dd>
                  </div>
                  <div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt class="text-sm font-medium text-gray-500">Remarks</dt>
                    <dd
                      class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap"
                    >
                      {{ localProgram.remarks || 'N/A' }}
                    </dd>
                  </div>
                </dl>
              </section>
            </div>

            <!-- Edit Mode -->
            <form v-else @submit.prevent="saveChanges" class="space-y-8">
              <!-- Institute & Proposal -->
              <fieldset>
                <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div class="sm:col-span-6">
                    <h4 class="text-lg font-semibold text-gray-800">Institute & Proposal</h4>
                  </div>
                  <div class="sm:col-span-6">
                    <label for="proposal_title" class="block text-sm font-medium text-gray-700"
                      >Proposal Title <span class="text-red-500">*</span></label
                    ><input
                      type="text"
                      id="proposal_title"
                      v-model.trim="localProgram.proposal_title"
                      required
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div class="sm:col-span-3">
                    <label for="duration_months" class="block text-sm font-medium text-gray-700"
                      >Duration (Months) <span class="text-red-500">*</span></label
                    ><input
                      type="number"
                      id="duration_months"
                      v-model.number="localProgram.duration_months"
                      required
                      min="1"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div class="sm:col-span-3">
                    <label for="commencement_date" class="block text-sm font-medium text-gray-700"
                      >Commencement Date <span class="text-red-500">*</span></label
                    ><input
                      type="date"
                      id="commencement_date"
                      v-model="localProgram.commencement_date"
                      required
                      :max="getFutureDateLimit()"
                      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div class="sm:col-span-6">
                    <label for="proposal_attachment" class="block text-sm font-medium text-gray-700"
                      >Proposal Attachment</label
                    >
                    <div
                      class="mt-1 flex justify-between items-center p-2 border border-gray-300 rounded-md"
                    >
                      <span
                        v-if="getFileName(localProgram.proposal_attachment)"
                        class="text-sm text-gray-700 truncate pr-2"
                        >Current:
                        <a
                          :href="localProgram.proposal_attachment"
                          target="_blank"
                          class="text-indigo-600 hover:underline"
                          >{{ getFileName(localProgram.proposal_attachment) }}</a
                        ></span
                      >
                      <span
                        v-else-if="localProgram.proposalAttachmentFile"
                        class="text-sm text-indigo-700 truncate pr-2"
                        >New: {{ localProgram.proposalAttachmentFile.name }}</span
                      >
                      <span v-else class="text-sm text-gray-500">No file selected</span>
                      <button
                        type="button"
                        class="flex-shrink-0 ml-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        @click="triggerFileUpload('proposalAttachmentInput')"
                      >
                        Change
                      </button>
                      <input
                        type="file"
                        ref="proposalAttachmentInput"
                        class="hidden"
                        @change="handleFileUpload($event, 'proposalAttachmentFile')"
                        accept=".pdf,.doc,.docx,.txt"
                      />
                    </div>
                  </div>
                </div>
              </fieldset>

              <!-- Review Details -->
              <fieldset>
                <div class="border-t border-gray-200 pt-8"></div>
                <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div class="sm:col-span-6">
                    <h4 class="text-lg font-semibold text-gray-800">Review Details</h4>
                  </div>
                  <div class="sm:col-span-6">
                    <label for="review_decision" class="block text-sm font-medium text-gray-700"
                      >Review Decision</label
                    ><select
                      id="review_decision"
                      v-model="localProgram.review_decision"
                      class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Regretted">Regretted</option>
                    </select>
                  </div>
                  <div class="sm:col-span-6">
                    <label for="review_summary" class="block text-sm font-medium text-gray-700"
                      >Review Summary</label
                    ><textarea
                      id="review_summary"
                      v-model="localProgram.review_summary"
                      rows="4"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                  </div>
                  <div class="sm:col-span-6">
                    <label
                      for="review_report_upload"
                      class="block text-sm font-medium text-gray-700"
                      >Review Report Upload</label
                    >
                    <div
                      class="mt-1 flex justify-between items-center p-2 border border-gray-300 rounded-md"
                    >
                      <span
                        v-if="getFileName(localProgram.review_report_upload)"
                        class="text-sm text-gray-700 truncate pr-2"
                        >Current:
                        <a
                          :href="localProgram.review_report_upload"
                          target="_blank"
                          class="text-indigo-600 hover:underline"
                          >{{ getFileName(localProgram.review_report_upload) }}</a
                        ></span
                      >
                      <span
                        v-else-if="localProgram.reviewReportFile"
                        class="text-sm text-indigo-700 truncate pr-2"
                        >New: {{ localProgram.reviewReportFile.name }}</span
                      >
                      <span v-else class="text-sm text-gray-500">No file selected</span>
                      <button
                        type="button"
                        class="flex-shrink-0 ml-4 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        @click="triggerFileUpload('reviewReportInput')"
                      >
                        Change
                      </button>
                      <input
                        type="file"
                        ref="reviewReportInput"
                        class="hidden"
                        @change="handleFileUpload($event, 'reviewReportFile')"
                        accept=".pdf,.doc,.docx"
                      />
                    </div>
                  </div>
                  <div v-if="localProgram.review_decision === 'Regretted'" class="sm:col-span-6">
                    <label for="reason_if_rejected" class="block text-sm font-medium text-gray-700"
                      >Reason (if regretted)</label
                    ><textarea
                      id="reason_if_rejected"
                      v-model="localProgram.reason_if_rejected"
                      rows="3"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                  </div>
                  <div class="sm:col-span-6">
                    <label for="remarks" class="block text-sm font-medium text-gray-700"
                      >General Remarks</label
                    ><textarea
                      id="remarks"
                      v-model="localProgram.remarks"
                      rows="3"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                  </div>
                </div>
              </fieldset>
              <button type="submit" class="hidden"></button>
            </form>
          </div>

          <!-- Modal Footer -->
          <div
            class="bg-gray-100 px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-2xl border-t"
          >
            <!-- EDITING Buttons -->
            <template v-if="isEditing">
              <button
                @click="saveChanges"
                type="button"
                :disabled="modalLoading || !isFormValid"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
              >
                <svg
                  v-if="modalLoading"
                  class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{ modalLoading ? 'Saving...' : 'Save Changes' }}
              </button>
              <button
                type="button"
                @click="cancelEditing"
                :disabled="modalLoading"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                Cancel
              </button>
            </template>

            <!-- VIEWING Buttons -->
            <template v-if="!isEditing">
              <button
                v-if="localProgram.review_decision === 'Pending'"
                type="button"
                @click="emitApprove"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Approve
              </button>
              <button
                v-if="localProgram.review_decision === 'Pending'"
                type="button"
                @click="emitRegret"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Regret
              </button>
              <button
                v-if="localProgram.review_decision !== 'Pending'"
                type="button"
                @click="close"
                class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
              >
                Close
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import apiServices from '@/services/services'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  programDetails: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['close-modal', 'approve', 'regret', 'program-updated'])

const isEditing = ref(false)
const localProgram = ref({})
const modalLoading = ref(false)
const modalError = ref('')

const proposalAttachmentInput = ref(null)
const reviewReportInput = ref(null)

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString.includes('T') ? dateString : dateString + 'T00:00:00Z')
    if (isNaN(date.getTime())) return 'Invalid Date'
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    })
  } catch {
    return dateString
  }
}

const getIsoDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString.includes('T') ? dateString : dateString + 'T00:00:00Z')
    if (isNaN(date.getTime())) return ''
    return date.toISOString().split('T')[0]
  } catch {
    return ''
  }
}

const getFutureDateLimit = () => {
  const date = new Date()
  date.setFullYear(date.getFullYear() + 10)
  return date.toISOString().split('T')[0]
}

const getFileName = (filePath) => {
  if (!filePath || typeof filePath !== 'string') return ''
  return filePath.split('/').pop()
}

const populateLocalProgram = (sourceDetails) => {
  if (!sourceDetails || !sourceDetails.id) {
    localProgram.value = {}
    return
  }
  const instituteDetails = sourceDetails.training_institute_details || {}
  const detailsCopy = sourceDetails

  localProgram.value = {
    id: detailsCopy.id,

    training_institute_name: instituteDetails.name_of_institution || 'N/A',
    training_institute_id: instituteDetails.id || null,
    country: instituteDetails.country || '',
    dzongkhag: instituteDetails.dzongkhag || '',
    gewog: instituteDetails.gewog || '',
    address_location: instituteDetails.address || '',
    contact_no: instituteDetails.contact_no || '',
    email_address: instituteDetails.email_address || '',
    head_institution_name: instituteDetails.head_of_institution_name || '',
    head_institution_mobile: instituteDetails.head_of_institution_phone_number || '',
    head_institution_email: instituteDetails.head_of_institution_email || '',
    website: instituteDetails.website || '',
    proposal_title: detailsCopy.proposal_title || '',
    duration_months:
      typeof detailsCopy.duration_months === 'number' ? detailsCopy.duration_months : null,
    commencement_date: getIsoDate(detailsCopy.commencement_date),
    proposal_attachment: detailsCopy.proposal_attachment || null,
    renewal_review_name: detailsCopy.ins_renewal_review_name || '',
    review_summary: detailsCopy.ins_review_summary || '',
    review_report_upload: detailsCopy.review_report_upload || null,

    review_decision: detailsCopy.review_decision || 'Pending',
    review_decision_display:
      detailsCopy.review_decision_display || detailsCopy.review_decision || 'Pending',
    reason_if_rejected: detailsCopy.reason_if_rejected || '',
    remarks: detailsCopy.remarks || '',
    created_at: detailsCopy.created_at || null,
    updated_at: detailsCopy.updated_at || null,
    proposalAttachmentFile: null,
    reviewReportFile: null,
  }
}

watch(
  () => props.programDetails,
  (newDetails) => {
    populateLocalProgram(newDetails)
    isEditing.value = false
    modalError.value = ''
    modalLoading.value = false
  },
  { deep: true, immediate: true },
)

const isFormValid = computed(() => {
  if (!isEditing.value) return true
  const prog = localProgram.value

  return !!(
    prog.proposal_title?.trim() &&
    prog.duration_months &&
    prog.duration_months > 0 &&
    prog.commencement_date
  )
})

const close = () => {
  if (modalLoading.value) return
  if (isEditing.value) {
    cancelEditing()
  }
  emit('close-modal')
}

const startEditing = () => {
  isEditing.value = true
  modalError.value = ''
}

const cancelEditing = () => {
  if (modalLoading.value) return
  populateLocalProgram(JSON.parse(JSON.stringify(props.programDetails)))
  isEditing.value = false
  modalError.value = ''
}

const triggerFileUpload = (inputRefName) => {
  const inputElement = {
    proposalAttachmentInput: proposalAttachmentInput.value,
    reviewReportInput: reviewReportInput.value,
  }[inputRefName]
  if (inputElement) inputElement.click()
  else console.error('File input ref not found:', inputRefName)
}

const handleFileUpload = (event, fileTypeKey) => {
  const file = event.target.files[0]
  if (file) {
    localProgram.value[fileTypeKey] = file
    if (fileTypeKey === 'proposalAttachmentFile') localProgram.value.proposal_attachment = null
    if (fileTypeKey === 'reviewReportFile') localProgram.value.review_report_upload = null
  }
  event.target.value = null
}

const saveChanges = async () => {
  if (!isFormValid.value) {
    modalError.value = 'Please fill required fields (*) correctly.'
    return
  }
  modalLoading.value = true
  modalError.value = ''
  const formData = new FormData()

  formData.append('proposal_title', localProgram.value.proposal_title.trim())
  formData.append('duration_months', localProgram.value.duration_months)
  formData.append('commencement_date', localProgram.value.commencement_date)

  if (localProgram.value.address_location?.trim())
    formData.append('address', localProgram.value.address_location.trim())
  if (localProgram.value.contact_no?.trim())
    formData.append('contact_no', localProgram.value.contact_no.trim())
  if (localProgram.value.email_address?.trim())
    formData.append('email_address', localProgram.value.email_address.trim())
  if (localProgram.value.head_institution_name?.trim())
    formData.append('head_of_institution_name', localProgram.value.head_institution_name.trim())
  if (localProgram.value.head_institution_mobile?.trim())
    formData.append(
      'head_of_institution_phone_number',
      localProgram.value.head_institution_mobile.trim(),
    )
  if (localProgram.value.head_institution_email?.trim())
    formData.append('head_of_institution_email', localProgram.value.head_institution_email.trim())
  if (localProgram.value.website?.trim())
    formData.append('website', localProgram.value.website.trim())
  if (localProgram.value.renewal_review_name?.trim())
    formData.append('ins_renewal_review_name', localProgram.value.renewal_review_name.trim())
  if (localProgram.value.review_summary?.trim())
    formData.append('ins_review_summary', localProgram.value.review_summary.trim())

  formData.append('review_decision', localProgram.value.review_decision)
  if (
    localProgram.value.review_decision === 'Regretted' &&
    localProgram.value.reason_if_rejected?.trim()
  ) {
    formData.append('reason_if_rejected', localProgram.value.reason_if_rejected.trim())
  } else {
    formData.append('reason_if_rejected', '')
  }
  if (localProgram.value.remarks?.trim())
    formData.append('remarks', localProgram.value.remarks.trim())

  if (localProgram.value.proposalAttachmentFile instanceof File) {
    formData.append('proposal_attachment', localProgram.value.proposalAttachmentFile)
  }
  if (localProgram.value.reviewReportFile instanceof File) {
    formData.append('review_report_upload', localProgram.value.reviewReportFile)
  }

  try {
    const id = localProgram.value.id
    if (!id) throw new Error('Program ID is missing.')

    const response = await apiServices.patchEpcNewEducationProgram(id, formData)

    const updatedProgramData = response.data || {}
    emit('program-updated', updatedProgramData)

    populateLocalProgram(updatedProgramData)

    isEditing.value = false
  } catch (error) {
    console.error('Error saving program details:', error)
    let specificError = ''
    if (error.response?.data && typeof error.response.data === 'object') {
      specificError = Object.entries(error.response.data)
        .map(
          ([key, value]) =>
            `${key.replace(/_/g, ' ')}: ${Array.isArray(value) ? value.join(', ') : value}`,
        )
        .join('; ')
    }
    modalError.value = `Save failed: ${specificError || error.response?.data?.detail || error.message || 'Please check the details and try again.'}`
  } finally {
    modalLoading.value = false
  }
}
const emitApprove = () => emit('approve', localProgram.value.id)
const emitRegret = () => emit('regret', localProgram.value.id)
</script>

<style scoped>
input[type='date']:required:invalid::-webkit-datetime-edit {
  color: #9ca3af;
}

input[type='date']:focus::-webkit-datetime-edit,
input[type='date']:valid::-webkit-datetime-edit {
  color: black;
}

textarea {
  min-height: 6em;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.max-w-xs {
  max-width: 20rem;
}
</style>
