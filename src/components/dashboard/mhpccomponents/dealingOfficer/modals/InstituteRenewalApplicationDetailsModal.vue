<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed z-50 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          @click="closeModal"
        ></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Institute Renewal Details
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Review and approve renewal for {{ applicationDetails.instituteName }}.
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-5">
              <dl class="divide-y divide-gray-200">
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">Institute Name</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ applicationDetails.instituteName }}
                  </dd>
                </div>
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">Applicant Name</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ applicationDetails.applicantName }}
                  </dd>
                </div>
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ formatDate(applicationDetails.renewalDate) }}
                  </dd>
                </div>
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">Current Expiry Date</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ formatDate(applicationDetails.expiryDate) }}
                  </dd>
                </div>
              </dl>
            </div>
            <!-- Dealing Officer Actions -->
            <div class="mt-6 pt-4 border-t">
              <h4 class="text-lg font-medium text-gray-800 mb-3">Dealing Officer Action</h4>
              <div class="space-y-4">
                <div>
                  <label for="decision" class="block text-sm font-medium text-gray-700"
                    >Decision</label
                  >
                  <select
                    id="decision"
                    v-model="formData.decision"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="Pending">Keep Pending</option>
                    <option value="Approved">Approve Renewal</option>
                    <option value="Regretted">Reject Renewal</option>
                  </select>
                </div>
                <div>
                  <label for="remarks" class="block text-sm font-medium text-gray-700"
                    >Remarks</label
                  >
                  <textarea
                    id="remarks"
                    v-model="formData.remarks"
                    rows="3"
                    class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Provide justification for the decision..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="handleUpdate"
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Update Status
            </button>
            <button
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="closeModal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import apiService from '@/services/services'

const props = defineProps({
  isOpen: Boolean,
  applicationDetails: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['close-modal', 'application-updated'])
const toast = useToast()

const formData = ref({
  decision: 'Pending',
  remarks: '',
})

watch(
  () => props.applicationDetails,
  (newDetails) => {
    if (newDetails) {
      formData.value.decision = newDetails.review_decision || 'Pending'
      formData.value.remarks = newDetails.remarks || newDetails.reason_if_rejected || ''
    }
  },
  { immediate: true, deep: true },
)

const handleUpdate = async () => {
  if (!props.applicationDetails || !props.applicationDetails.id) {
    toast.error('Application details are missing.')
    return
  }

  const payload = {
    review_decision: formData.value.decision,
  }

  if (formData.value.decision === 'Regretted') {
    payload.reason_if_rejected = formData.value.remarks
  } else {
    payload.remarks = formData.value.remarks
  }

  try {
    await apiService.patchMhpcInstitute(props.applicationDetails.id, payload)
    toast.success('Application updated successfully!')
    emit('application-updated')
    closeModal()
  } catch (error) {
    console.error('Error updating application:', error)
    toast.error('Failed to update application.')
  }
}

const closeModal = () => {
  emit('close-modal')
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>