<template>
  <Transition name="modal-fade">
    <div v-if="participant" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="$emit('close-modal')"></div>
      <div
        class="relative w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 m-4 transform transition-all overflow-y-auto max-h-[90vh]"
        role="dialog" aria-labelledby="modal-title" @click.stop>
        <div class="flex justify-between items-center mb-6">
          <div class="flex items-center gap-3">
            <div class="text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 id="modal-title" class="text-xl font-semibold text-gray-900">
                CPD Application Details
              </h2>
              <p class="text-sm text-gray-500">Review and award CPD credits</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div v-if="participant.reviewStatus" class="px-3 py-1 rounded-full flex items-center gap-2 text-sm" :class="{
              'bg-green-100 text-green-800': participant.reviewStatus === 'Approved',
              'bg-yellow-100 text-yellow-800': participant.reviewStatus === 'Pending',
              'bg-red-100 text-red-800': participant.reviewStatus === 'Rejected',
            }">
              <span v-if="participant.reviewStatus === 'Approved'" class="w-2 h-2 bg-green-500 rounded-full"></span>
              <span v-else-if="participant.reviewStatus === 'Pending'"
                class="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span v-else class="w-2 h-2 bg-red-500 rounded-full"></span>
              {{ participant.reviewStatus || 'Pending' }}
            </div>
            <button @click="$emit('close-modal')" class="text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-8">
            <div class="bg-gray-50 rounded-lg p-6">
              <div class="flex items-center gap-2 mb-4">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 class="text-lg font-medium text-gray-900">Personal Information</h3>
              </div>
              <div class="space-y-4">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke-width="2" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3" />
                    </svg>
                    <span class="text-sm font-medium text-gray-500">Registration Number</span>
                  </div>
                  <p class="text-gray-900 ml-6">{{ participant.registrationNumber }}</p>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    <span class="text-sm font-medium text-gray-500">CID/Identity Number</span>
                  </div>
                  <p class="text-gray-900 ml-6">{{ participant.cidNumber }}</p>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span class="text-sm font-medium text-gray-500">Full Name</span>
                  </div>
                  <p class="text-gray-900 ml-6">{{ participant.fullName }}</p>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span class="text-sm font-medium text-gray-500">Gender</span>
                  </div>
                  <p class="text-gray-900 ml-6">{{ participant.gender }}</p>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 rounded-lg p-6">
              <div class="flex items-center gap-2 mb-4">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <h3 class="text-lg font-medium text-gray-900">Attachment</h3>
              </div>
              <div v-if="participant.attachment" class="p-4 bg-gray-100 rounded-lg flex items-center justify-between">
                <div class="flex items-start gap-3">
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span class="text-sm text-gray-600 break-all">
                    {{ participant.attachment.url.split('/').pop() }}
                  </span>
                </div>
                <a :href="participant.attachment.url" target="_blank"
                  class="text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap">
                  View Document
                </a>
              </div>
              <div v-else class="text-sm text-gray-500">No attachment available</div>
            </div>
          </div>
          <div class="space-y-8">
            <div class="bg-gray-50 rounded-lg p-6">
              <div class="flex items-center gap-2 mb-4">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 class="text-lg font-medium text-gray-900">CPD Details</h3>
              </div>
              <div class="space-y-4">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-sm font-medium text-gray-500">Title of CPD</span>
                  </div>
                  <p class="text-gray-900 ml-6">{{ participant.cpdTitle }}</p>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-sm font-medium text-gray-500">Relevance to Profession</span>
                  </div>
                  <p class="text-gray-900 ml-6">{{ participant.relevance }}</p>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span class="text-sm font-medium text-gray-500">Participation Category</span>
                  </div>
                  <p class="text-gray-900 ml-6">{{ participant.participationCategory }}</p>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span class="text-sm font-medium text-gray-500">Participant Sub-category</span>
                  </div>
                  <p class="text-gray-900 ml-6">{{ participant.participantSubCategory }}</p>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    <span class="text-sm font-medium text-gray-500">Type of CPD Activity</span>
                  </div>
                  <p class="text-gray-900 ml-6">{{ participant.activityType }}</p>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 rounded-lg p-6">
              <div class="flex items-center gap-2 mb-4">
                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 class="text-lg font-medium text-gray-900">Review Details</h3>
              </div>
              <div class="space-y-4">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-sm font-medium text-gray-500">Current CPD Credits</span>
                  </div>
                  <p class="text-gray-900 ml-6">{{ participant.cpdCredits || 0 }}</p>
                </div>
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <span class="text-sm font-medium text-gray-500">Remarks</span>
                  </div>
                  <p class="text-gray-900 ml-6">{{ participant.remarks || 'No remarks' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="text-lg font-medium text-gray-900">Award Credits</h3>
            </div>
          </div>
          <!-- Replace your existing button with this improved version -->
          <div>
            <label for="credits" class="block text-sm font-medium text-gray-700 mb-2">
              Number of Credits to Award
            </label>
            <div class="flex space-x-2">
              <div class="relative flex-grow">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input id="credits" :value="creditScore" type="number" step="0.5" min="0" required
                  class="block w-full pl-10 pr-12 py-3 rounded-md border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0.0" @input="$emit('update:credit-score', $event.target.valueAsNumber)" />
                <div class="absolute inset-y-0 right-0 flex items-center">
                  <div class="h-full flex flex-col border-l border-gray-300">
                    <button type="button"
                      class="flex-1 flex items-center justify-center px-2 border-b border-gray-300 hover:bg-gray-100"
                      @click="$emit('update:credit-score', (creditScore || 0) + 0.5)">
                      <svg class="h-3 w-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button type="button" class="flex-1 flex items-center justify-center px-2 hover:bg-gray-100"
                      @click="$emit('update:credit-score', Math.max(0, (creditScore || 0) - 0.5))">
                      <svg class="h-3 w-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <button @click="$emit('award-credits')"
                class="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ease-in-out flex items-center justify-center min-w-[120px] shadow-md"
                :class="{ 'opacity-50 cursor-not-allowed': creditError }" :disabled="creditError">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Award Credits
              </button>
            </div>
            <div v-if="creditError" class="mt-1 text-red-500 text-sm">
              {{ creditError }}
            </div>
          </div>
          <div class="my-8 border-t border-gray-200 pt-6">
            <div class="flex justify-end gap-4">
              <button type="button" @click="$emit('close-modal')"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Cancel
              </button>
              <button @click="showConfirmationDialog('approve')"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Approve
              </button>
              <button @click="showConfirmationDialog('reject')"
                class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Confirmation Dialog -->
  <Transition name="dialog-fade">
    <div v-if="showDialog" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeConfirmationDialog"></div>
      <div class="relative w-full max-w-md bg-white rounded-lg shadow-lg p-6 m-4" role="dialog"
        aria-labelledby="dialog-title" @click.stop>
        <h3 id="dialog-title" class="text-lg font-medium text-gray-900 mb-4">
          {{ dialogType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection' }}
        </h3>
        <p class="text-sm text-gray-600 mb-4">
          Are you sure you want to {{ dialogType }} this CPD application?
        </p>
        <div class="mb-4">
          <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
            Message (optional)
          </label>
          <textarea id="message" v-model="confirmationMessage" rows="4"
            class="block w-full px-3 py-2 rounded-md border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your message here..."></textarea>
        </div>
        <div class="flex justify-end gap-3">
          <button @click="closeConfirmationDialog"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Cancel
          </button>
          <button @click="confirmAction"
            class="px-4 py-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2" :class="{
              'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500': dialogType === 'approve',
              'bg-red-600 hover:bg-red-700 focus:ring-red-500': dialogType === 'reject'
            }">
            {{ dialogType === 'approve' ? 'Approve' : 'Reject' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  participant: {
    type: Object,
    default: null,
  },
  creditScore: {
    type: Number,
    required: true,
  },
  creditError: {
    type: String,
    default: '',
  },
})

const showDialog = ref(false)
const dialogType = ref('')
const confirmationMessage = ref('')

const emits = defineEmits(['close-modal', 'award-credits', 'update:credit-score', 'approve', 'reject'])

const showConfirmationDialog = (type) => {
  dialogType.value = type
  showDialog.value = true
  confirmationMessage.value = ''
}

const closeConfirmationDialog = () => {
  showDialog.value = false
  dialogType.value = ''
  confirmationMessage.value = ''
}

const confirmAction = () => {
  if (dialogType.value === 'approve') {
    emits('approve', confirmationMessage.value)
  } else {
    emits('reject', confirmationMessage.value)
  }
  closeConfirmationDialog()
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>