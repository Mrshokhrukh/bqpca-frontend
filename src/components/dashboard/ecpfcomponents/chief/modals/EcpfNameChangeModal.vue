<!-- modals/EcpfNameChangeModal.vue -->
<template>
  <div
    class="fixed z-10 inset-0 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <!-- Modal backdrop, fixed overlay -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>

      <!-- This element is to trick the browser into centering the modal content. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"> </span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
      >
        <!-- Header with gradient background -->
        <div class="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-4">
          <div class="flex justify-between items-center">
            <h3 class="text-xl font-bold text-white" id="modal-title">
              ECPF Name Change Application
            </h3>
            <button @click="closeModal" class="text-white hover:text-gray-200 focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
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

        <div class="bg-white px-6 py-5 relative">
          <!-- Edit button on top right -->
          <button
            type="button"
            class="absolute top-5 right-6 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
            @click="handleEdit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Edit
          </button>

          <!-- Main content -->
          <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <!-- Left column: Application details -->
            <div class="lg:col-span-3">
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div class="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                  <h3 class="text-lg font-medium leading-6 text-gray-900">Application Details</h3>
                  <p class="mt-1 max-w-2xl text-sm text-gray-500">
                    Review the ECPF name change request
                  </p>
                </div>

                <div class="divide-y divide-gray-200">
                  <div class="px-4 py-3 sm:px-6">
                    <div class="flex justify-between">
                      <p class="text-sm font-medium text-gray-500">Applicant</p>
                      <p class="text-sm font-bold text-gray-900">
                        {{ application?.applicantName }}
                      </p>
                    </div>
                  </div>

                  <div class="px-4 py-3 sm:px-6">
                    <div class="flex justify-between">
                      <p class="text-sm font-medium text-gray-500">Current ECPF Name</p>
                      <p class="text-sm font-bold text-gray-900">
                        {{ application?.currentEcpfName }}
                      </p>
                    </div>
                  </div>

                  <div class="px-4 py-3 sm:px-6">
                    <div class="flex justify-between">
                      <p class="text-sm font-medium text-gray-500">Proposed ECPF Name</p>
                      <p class="text-sm font-bold text-gray-900">
                        {{ application?.proposedEcpfName }}
                      </p>
                    </div>
                  </div>

                  <div class="px-4 py-3 sm:px-6">
                    <div class="flex justify-between items-center">
                      <p class="text-sm font-medium text-gray-500">Status</p>
                      <span :class="getStatusClasses(application?.status)">
                        {{ application?.status }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right column: Chief's review -->
            <div class="lg:col-span-2">
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div class="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                  <h3 class="text-lg font-medium leading-6 text-gray-900">Chief's Review</h3>
                </div>

                <div class="p-4 sm:p-6">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                  <textarea
                    v-model="remarks"
                    rows="6"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-none text-sm"
                    placeholder="Enter remarks for this application..."
                  ></textarea>

                  <!-- Status card -->
                  <div class="mt-4 p-4 bg-indigo-50 rounded-md border border-indigo-100">
                    <div class="flex items-start">
                      <div class="flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 text-indigo-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm text-indigo-700">
                          Please approve or regret this application after review.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="bg-gray-50 px-6 py-4 flex flex-wrap justify-end gap-3 border-t border-gray-200">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
            @click="closeModal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Close
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
            @click="showRegretDialog = true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Regret
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
            @click="generateLetter"
            :disabled="application?.status !== 'Approved'"
            :class="{ 'opacity-50 cursor-not-allowed': application?.status !== 'Approved' }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Generate Letter
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
            @click="approveApplication"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            Approve
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Regret Dialog -->
  <div
    v-if="showRegretDialog"
    class="fixed z-20 inset-0 overflow-y-auto"
    aria-labelledby="dialog-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"> </span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
            >
              <svg
                class="h-6 w-6 text-red-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="dialog-title">
                Regret Application
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Are you sure you want to regret this application? Please provide a reason for this
                  decision.
                </p>
                <div class="mt-4">
                  <label for="regret-reason" class="block text-sm font-medium text-gray-700">
                    Reason for Regret
                  </label>
                  <textarea
                    id="regret-reason"
                    v-model="regretReason"
                    rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-none"
                    placeholder="Please provide a reason for regretting this application..."
                  ></textarea>
                </div>

                <!-- Alert card -->
                <div class="mt-4 p-3 bg-red-50 rounded-md border border-red-100">
                  <div class="flex">
                    <div class="flex-shrink-0">
                      <svg
                        class="h-5 w-5 text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-red-700">This action cannot be undone.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200"
        >
          <button
            type="button"
            class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
            @click="confirmRegret"
          >
            Confirm
          </button>
          <button
            type="button"
            class="mt-3 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm transition-all duration-200"
            @click="showRegretDialog = false"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  application: {
    type: Object,
    default: () => null,
  },
})

const emit = defineEmits(['close-modal', 'approve', 'regret', 'edit', 'generate-letter'])

const remarks = ref('')
const regretReason = ref('')
const showRegretDialog = ref(false)

const closeModal = () => {
  emit('close-modal')
}

const approveApplication = () => {
  emit('approve', {
    applicationId: props.application?.id,
    remarks: remarks.value,
  })
}

const generateLetter = () => {
  emit('generate-letter', {
    applicationId: props.application?.id,
    remarks: remarks.value,
  })
}

const confirmRegret = () => {
  emit('regret', {
    applicationId: props.application?.id,
    remarks: remarks.value,
    regretReason: regretReason.value,
  })
  showRegretDialog.value = false
  regretReason.value = ''
}

const handleEdit = () => {
  emit('edit', props.application?.id)
}

const getStatusClasses = (status) => {
  if (!status)
    return 'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-gray-100 text-gray-800'

  return [
    'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap',
    {
      'bg-yellow-100 text-yellow-800': status === 'Pending Review',
      'bg-green-100 text-green-800': status === 'Approved',
      'bg-red-100 text-red-800': status === 'Rejected' || status === 'Regretted',
      'bg-gray-100 text-gray-800': status === 'Draft',
    },
  ]
}
</script>
