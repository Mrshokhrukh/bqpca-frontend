<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 transition-opacity"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-lg w-full transform transition-all">
      <h3 class="text-xl font-bold text-gray-900 mb-2">Renew Institute Registration</h3>

      <div v-if="institute" class="p-3 bg-gray-50 rounded-lg mb-6 border border-gray-200">
        <p class="text-sm font-medium text-gray-800">{{ institute.name_of_institution }}</p>
        <p class="text-xs text-gray-500">
          Current Validity Expires On: {{ formatDateSafely(institute.valid_till) }}
        </p>
      </div>

      <p class="text-sm text-gray-500 mb-6">
        To initiate the renewal process, please add any relevant remarks below and submit the application.
      </p>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <!-- Remarks -->
          <div>
            <label for="remarks" class="block text-sm font-medium text-gray-700"
              >Remarks (Optional)</label
            >
            <textarea
              id="remarks"
              v-model="remarks"
              rows="4"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Add any relevant remarks for the reviewing officer..."
            ></textarea>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            @click="$emit('close')"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
            :disabled="isSubmitting"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isSubmitting"
          >
            <Loader v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-5 w-5" />
            {{ isSubmitting ? 'Submitting...' : 'Submit Renewal Application' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import apiServices from '@/services/services' // Assuming this is your API service file
import { Loader } from 'lucide-vue-next'

const props = defineProps({
  show: Boolean,
  institute: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'renewal-submitted'])

const toast = useToast()
const remarks = ref('')
const isSubmitting = ref(false)

// Helper function to format dates safely
const formatDateSafely = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return isNaN(date.getTime())
    ? 'Invalid Date'
    : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Handles the form submission
const handleSubmit = async () => {
  isSubmitting.value = true

  // The payload is now a simple JavaScript object
  const payload = {
    institute: props.institute.id,
    user_remarks: remarks.value,
  }

  try {
    // Call the API service with the JSON payload
    await apiServices.createInstituteRenewal(payload)

    toast.success('Renewal application submitted successfully!')
    emit('renewal-submitted')
    emit('close')
  } catch (error) {
    // Generic error handling
    const errorMsg =
      error.response?.data?.detail ||
      (Array.isArray(error.response?.data) && error.response.data[0]) ||
      'Failed to submit renewal application. Please try again.'
    toast.error(errorMsg)
  } finally {
    isSubmitting.value = false
  }
}
</script>
