<template>
  <Transition name="modal-fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Ensure z-index is high -->
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeModal"></div>

      <!-- Modal -->
      <div
        class="relative w-full max-w-7xl bg-white rounded-lg shadow-lg p-8 m-4 transform transition-all overflow-y-auto max-h-[90vh]"
        role="dialog"
        aria-labelledby="modal-title"
        @click.stop
      >
        <!-- Header -->
        <div class="flex justify-between items-center mb-6 border-b pb-4 border-gray-200">
          <div class="flex items-center gap-3">
            <div class="text-gray-700 p-2 bg-gray-100 rounded-full">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h2 id="modal-title" class="text-xl font-semibold text-gray-900">
                CPD Application Details
              </h2>
              <p class="text-sm text-gray-500">Review CPD application details and update status</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <!-- Status Badge -->
            <div
              v-if="participant?.reviewStatus"
              class="px-3 py-1 rounded-full flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"
              :class="getStatusClass(participant.reviewStatus).badge"
            >
              <span
                class="w-2 h-2 rounded-full"
                :class="getStatusClass(participant.reviewStatus).dot"
              ></span>
              {{ participant?.reviewStatus || 'Pending' }}
            </div>
            <!-- Close Button -->
            <button
              @click="closeModal"
              :disabled="isConfirming"
              class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">Close</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Content Grid -->
        <div v-if="participant" class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Left Column -->
          <div class="space-y-6">
            <!-- Personal Information -->
            <div class="bg-gray-50/80 border border-gray-200/80 rounded-lg p-5">
              <div class="flex items-center gap-3 mb-4">
                <div class="bg-blue-100 p-1.5 rounded-md">
                  <svg
                    class="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 class="text-base font-semibold text-gray-800">Personal Information</h3>
              </div>
              <div class="space-y-3 text-sm">
                <div class="grid grid-cols-3 gap-2">
                  <dt class="text-gray-500 font-medium col-span-1">Reg. Number</dt>

                  <dd class="text-gray-800 col-span-2">{{ participant.registrationNoDisplay }}</dd>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <dt class="text-gray-500 font-medium col-span-1">CID/ID</dt>
                  <dd class="text-gray-800 col-span-2">{{ participant.cidNumber }}</dd>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <dt class="text-gray-500 font-medium col-span-1">Full Name</dt>
                  <dd class="text-gray-800 col-span-2">{{ participant.fullName }}</dd>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <dt class="text-gray-500 font-medium col-span-1">Gender</dt>
                  <dd class="text-gray-800 col-span-2 capitalize">{{ participant.gender }}</dd>
                </div>
              </div>
            </div>
            <!-- Attachment -->
            <div class="bg-gray-50/80 border border-gray-200/80 rounded-lg p-5">
              <div class="flex items-center gap-3 mb-4">
                <div class="bg-purple-100 p-1.5 rounded-md">
                  <svg
                    class="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                </div>
                <h3 class="text-base font-semibold text-gray-800">Attachment</h3>
              </div>
              <div
                v-if="participant.attachment?.url"
                class="p-3 bg-gray-100 rounded-lg flex items-center justify-between gap-4 border border-gray-200"
              >
                <div class="flex items-center gap-3 overflow-hidden">
                  <svg
                    class="w-6 h-6 text-gray-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span
                    class="text-sm text-gray-700 break-words truncate"
                    :title="getFilename(participant.attachment.url)"
                    >{{ getFilename(participant.attachment.url) }}</span
                  >
                </div>
                <a
                  :href="participant.attachment.url"
                  target="_blank"
                  class="text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap font-medium flex-shrink-0 hover:underline"
                >
                  View
                </a>
              </div>
              <div v-else class="text-sm text-gray-500 italic px-1">No attachment provided.</div>
            </div>
          </div>
          <!-- Right Column -->
          <div class="space-y-6">
            <!-- CPD Details -->
            <div class="bg-gray-50/80 border border-gray-200/80 rounded-lg p-5">
              <div class="flex items-center gap-3 mb-4">
                <div class="bg-teal-100 p-1.5 rounded-md">
                  <svg
                    class="w-5 h-5 text-teal-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 class="text-base font-semibold text-gray-800">CPD Details</h3>
              </div>
              <div class="space-y-3 text-sm">
                <div class="grid grid-cols-3 gap-2">
                  <dt class="text-gray-500 font-medium col-span-1">Title</dt>
                  <dd class="text-gray-800 col-span-2">{{ participant.cpdTitle }}</dd>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <dt class="text-gray-500 font-medium col-span-1">CPD Hours</dt>
                  <dd class="text-gray-800 col-span-2">{{ participant.cpdHours || 'N/A' }}</dd>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <dt class="text-gray-500 font-medium col-span-1">Relevance</dt>
                  <dd class="text-gray-800 col-span-2">{{ participant.relevance }}</dd>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <dt class="text-gray-500 font-medium col-span-1">Category</dt>
                  <dd class="text-gray-800 col-span-2">
                    {{ participant.participationCategoryDisplay || 'N/A' }}
                  </dd>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <dt class="text-gray-500 font-medium col-span-1">Sub-category</dt>
                  <dd class="text-gray-800 col-span-2">
                    {{ participant.participantSubCategoryDisplay || 'N/A' }}
                  </dd>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <dt class="text-gray-500 font-medium col-span-1">Activity Type</dt>
                  <dd class="text-gray-800 col-span-2">
                    {{ participant.activityTypeDisplay || 'N/A' }}
                  </dd>
                </div>
              </div>
            </div>
            <!-- Review Details -->
            <div class="bg-gray-50/80 border border-gray-200/80 rounded-lg p-5">
              <div class="flex items-center gap-3 mb-4">
                <div class="bg-orange-100 p-1.5 rounded-md">
                  <svg
                    class="w-5 h-5 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <h3 class="text-base font-semibold text-gray-800">Review History</h3>
              </div>
              <div class="space-y-3 text-sm">
                <div class="grid grid-cols-3 gap-2">
                  <dt class="text-gray-500 font-medium col-span-1">Awarded Credits</dt>
                  <dd class="text-gray-800 font-semibold col-span-2">
                    {{ participant.cpdCredits ?? 0 }}
                  </dd>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <dt class="text-gray-500 font-medium col-span-1">Previous Remarks</dt>
                  <dd class="text-gray-600 italic col-span-2">
                    {{ participant.remarks || 'None' }}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 py-10">Loading participant data...</div>

        <!-- Actions Section -->
        <div v-if="participant" class="mt-8 pt-6 border-t border-gray-200">
          <!-- Confirmation View (Shown when isConfirming is true) -->
          <Transition name="confirm-fade">
            <div
              v-if="isConfirming"
              class="border rounded-lg p-6 mb-6"
              :class="
                confirmationState === 'approving'
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-red-50 border-red-200'
              "
            >
              <div class="flex items-start gap-4">
                <!-- Icon -->
                <div class="flex-shrink-0 mt-0.5">
                  <svg
                    v-if="confirmationState === 'approving'"
                    class="w-6 h-6 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <svg
                    v-else
                    class="w-6 h-6 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    ></path>
                  </svg>
                </div>
                <!-- Content -->
                <div class="flex-grow">
                  <h4
                    class="text-lg font-semibold mb-2"
                    :class="confirmationState === 'approving' ? 'text-blue-800' : 'text-red-800'"
                  >
                    Confirm Action:
                    {{
                      confirmationState === 'approving'
                        ? 'Approve Application'
                        : 'Regret Application'
                    }}
                  </h4>
                  <div
                    v-if="reviewMessage"
                    class="bg-white/70 p-3 rounded border text-sm text-gray-700 mb-4"
                    :class="
                      confirmationState === 'approving' ? 'border-blue-200' : 'border-red-200'
                    "
                  >
                    <strong class="font-medium">Message:</strong>
                    <p class="mt-1 whitespace-pre-wrap">{{ reviewMessage }}</p>
                  </div>
                  <p
                    v-else
                    class="text-sm italic mb-4"
                    :class="confirmationState === 'approving' ? 'text-blue-600' : 'text-red-600'"
                  >
                    {{
                      confirmationState === 'approving'
                        ? 'No message provided for approval.'
                        : 'Warning: No message provided for regret.'
                    }}
                  </p>

                  <!-- Confirmation Buttons -->
                  <div class="flex justify-end gap-3 mt-4">
                    <button
                      @click="cancelConfirmation"
                      class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      @click="executeConfirmation"
                      :class="[
                        confirmationState === 'approving'
                          ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                          : 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
                        'px-4 py-2 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2',
                      ]"
                    >
                      Confirm {{ confirmationState === 'approving' ? 'Approval' : 'Regret' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Standard Actions View (Shown when NOT confirming) -->
          <div v-show="!isConfirming">
            <div class="flex items-center gap-2 mb-4">
              <svg
                class="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <h3 class="text-lg font-medium text-gray-900">Perform Actions</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4 mb-6">
              <!-- Credits Input & Award Button -->
              <div class="md:col-span-5">
                <label for="credits" class="block text-sm font-medium text-gray-700 mb-1"
                  >Award / Update Credits</label
                >
                <div class="flex items-center gap-2">
                  <input
                    id="credits"
                    v-model.number="creditScore"
                    type="number"
                    step="0.5"
                    min="0"
                    class="flex-grow block w-full px-3 py-2 rounded-md border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0.0"
                    aria-describedby="credit-error"
                    :disabled="isProcessingCredits"
                  />
                  <button
                    @click="handleAwardCredits"
                    :disabled="
                      !participant ||
                      participant.id === undefined ||
                      creditScore < 0 ||
                      isProcessingCredits
                    "
                    class="relative inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    title="Update the awarded credits for this application"
                  >
                    <span
                      v-if="isProcessingCredits"
                      class="absolute inset-0 flex items-center justify-center"
                    >
                      <svg
                        class="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
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
                    </span>
                    <span :class="{ 'opacity-0': isProcessingCredits }">Award Credits</span>
                  </button>
                </div>
                <div v-if="creditError" id="credit-error" class="mt-1 text-red-600 text-sm">
                  {{ creditError }}
                </div>
              </div>

              <!-- Message/Remarks Input -->
              <div class="md:col-span-7">
                <label for="review-message" class="block text-sm font-medium text-gray-700 mb-1"
                  >Add Message / Remarks</label
                >
                <textarea
                  id="review-message"
                  v-model="reviewMessage"
                  rows="3"
                  class="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter message for approval or reason for regret..."
                  aria-describedby="message-error"
                ></textarea>
                <div v-if="messageError" id="message-error" class="mt-1 text-red-600 text-sm">
                  {{ messageError }}
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-4 border-t border-gray-200 pt-6">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <template v-if="participant && (!participant.reviewStatus || participant.reviewStatus === 'Pending')">
                <button
                  @click="handleReject"
                  :disabled="!participant || participant.id === undefined"
                  class="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Regret
                </button>
                <button
                  @click="handleApprove"
                  :disabled="!participant || participant.id === undefined"
                  class="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
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
                  Approve
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

// --- Props and Emits ---
const props = defineProps({
  modelValue: { type: Boolean, required: true },
  participant: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'approve', 'reject', 'awardCredits'])

// --- Local State ---
const creditScore = ref(0)
const reviewMessage = ref('')
const creditError = ref('')
const messageError = ref('')
const confirmationState = ref(null) // null | 'approving' | 'rejecting'
const isProcessingCredits = ref(false)

// --- Computed Properties ---
const isConfirming = computed(() => confirmationState.value !== null)

// --- Watchers ---
watch(
  () => props.participant,
  (newParticipant) => {
    if (newParticipant) {
      creditScore.value = newParticipant.cpdCredits ?? 0
      reviewMessage.value = newParticipant.remarks || ''
      creditError.value = ''
      messageError.value = ''
      confirmationState.value = null
      isProcessingCredits.value = false
    } else {
      creditScore.value = 0
      reviewMessage.value = ''
      creditError.value = ''
      messageError.value = ''
      confirmationState.value = null
      isProcessingCredits.value = false
    }
  },
  { immediate: true, deep: true },
)

watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) {
      confirmationState.value = null
      messageError.value = ''
      creditError.value = ''
      isProcessingCredits.value = false
    }
  },
)

// --- Methods ---
const closeModal = () => {
  if (isConfirming.value) return
  emit('update:modelValue', false)
}

const isParticipantValid = () => {
  if (!props.participant || props.participant.id === undefined) {
    console.error('Action attempted without a valid participant prop:', props.participant)
    return false
  }
  return true
}

const handleAwardCredits = async () => {
  creditError.value = ''
  if (!isParticipantValid()) return

  if (typeof creditScore.value !== 'number' || creditScore.value < 0 || isNaN(creditScore.value)) {
    creditError.value = 'Please enter a valid non-negative number for credits.'
    return
  }

  isProcessingCredits.value = true
  emit('awardCredits', {
    participantId: props.participant.id,
    credits: creditScore.value,
  })

  setTimeout(() => {
    isProcessingCredits.value = false
  }, 1500)
}

const handleApprove = () => {
  messageError.value = ''
  creditError.value = ''
  if (!isParticipantValid()) return
  confirmationState.value = 'approving'
}

const handleReject = () => {
  messageError.value = ''
  creditError.value = ''
  if (!isParticipantValid()) return
  confirmationState.value = 'rejecting'
}

const cancelConfirmation = () => {
  confirmationState.value = null
  messageError.value = ''
}

const executeConfirmation = () => {
  if (!isParticipantValid() || !confirmationState.value) return

  const action = confirmationState.value
  const message = reviewMessage.value.trim()

  const payload = {
    participantId: props.participant.id,
    remarks: message || null,
  }

  if (action === 'approving') {
    emit('approve', payload)
  } else if (action === 'rejecting') {
    emit('reject', payload)
  }

  confirmationState.value = null
  emit('update:modelValue', false)
}

const getFilename = (url) => {
  if (!url) return 'Attachment'
  try {
    const decodedUrl = decodeURIComponent(url)
    const parts = decodedUrl.split('/')
    const filename = parts.pop() || parts.pop()
    return filename ? filename.split('?')[0] : 'Attachment'
  } catch (e) {
    console.error('Error parsing filename from URL:', e)
    const parts = url.split('/')
    return parts[parts.length - 1] || 'Attachment'
  }
}

const getStatusClass = (status) => {
  status = status || 'Pending'
  switch (status) {
    case 'Approved':
      return { badge: 'bg-green-100 text-green-800', dot: 'bg-green-500' }
    case 'Regretted':
      return { badge: 'bg-red-100 text-red-800', dot: 'bg-red-500' }
    case 'Pending':
    default:
      return { badge: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' }
  }
}
</script>

<style scoped>
/* Modal Fade Animation */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
}

/* Confirmation Fade Animation */
.confirm-fade-enter-active,
.confirm-fade-leave-active {
  transition: all 0.2s ease-in-out;
}
.confirm-fade-enter-from,
.confirm-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.confirm-fade-enter-to,
.confirm-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Hide number input arrows */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield; /* Firefox */
  appearance: textfield; /* Standard property */
}

/* Improve word breaking */
.break-words {
  word-break: break-word;
  overflow-wrap: break-word;
}
.whitespace-pre-wrap {
  white-space: pre-wrap; /* Preserve whitespace and wrap */
}
.capitalize {
  text-transform: capitalize;
}

/* Basic spinner animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
