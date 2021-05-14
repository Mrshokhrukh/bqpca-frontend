<template>
  <div>
    <!-- Debug info to verify what value is being received -->
    <div class="text-xs text-gray-500 mb-2">Status: {{ isCounselor ? 'Counselor' : 'Not a Counselor' }}</div>

    <div v-if="isCounselor" class="flex flex-col space-y-3">
      <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 w-fit">
        <Check class="h-4 w-4 mr-1" />
        Verified Counselor
      </span>

      <button @click="toggleCounselorStatus(false)"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 w-fit"
        :disabled="isSubmitting">
        <span v-if="isSubmitting">Updating...</span>
        <span v-else>Unregister as Counselor</span>
      </button>
    </div>

    <div v-else>
      <button @click="toggleCounselorStatus(true)"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200"
        :disabled="isSubmitting">
        <span v-if="isSubmitting">Updating...</span>
        <span v-else>Register as Counselor</span>
      </button>
    </div>

    <div v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Check } from 'lucide-vue-next'
import apiServices from '@/services/services' // Assuming your services path
import { useToast } from 'vue-toastification' // Import useToast

const props = defineProps({
  application: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update']) // Emits an event to notify parent component to refresh data

const errorMessage = ref('')
const isSubmitting = ref(false) // To disable button during API call
const toast = useToast() // Initialize toast

// Computed property to handle different value types of is_counselor
const isCounselor = computed(() => {
  // Handle if is_counselor is a string 'true' or boolean true
  if (props.application?.is_counselor === true || props.application?.is_counselor === 'true') {
    return true
  }
  return false
})

// Combined function to handle both registering and unmarking
const toggleCounselorStatus = async (isCounselor) => {
  // Basic check for userDetails and its id
  // The application prop itself is the userDetails object based on your previous form structure
  if (!props.application?.id) {
    console.error('User ID is missing from the application prop.')
    errorMessage.value = 'User details are missing. Cannot update status.'
    toast.error('User details are missing.') // Toast error
    return
  }

  isSubmitting.value = true
  errorMessage.value = '' // Clear previous errors

  try {
    const formData = new FormData()
    // Ensure we're sending a string "true" or "false" to the API
    formData.append('is_counselor', isCounselor.toString())

    console.log(`Attempting to set is_counselor to: ${isCounselor}`)

    // Make API call to update user details
    const response = await apiServices.patchUser(props.application.id, formData)

    console.log('API response:', response)

    // Show success toast
    if (isCounselor) {
      toast.success('Successfully registered as a counselor!')
    } else {
      toast.success('Successfully unregistered as a counselor.')
    }

    // Notify parent to refresh application data
    emit('update')
  } catch (error) {
    console.error('Error updating counselor status:', error)
    let apiErrorMessage = 'Failed to update counselor status.'
    if (error.response && error.response.data) {
      // Try to get a more specific error message from the API response
      const errors = error.response.data;
      if (typeof errors === 'string') {
        apiErrorMessage = errors;
      } else if (typeof errors === 'object') {
        // If errors is an object, try to extract messages
        // This part might need adjustment based on your actual API error structure
        const messages = Object.values(errors).flat();
        if (messages.length > 0) {
          apiErrorMessage = messages.join(' ');
        }
      }
    }
    errorMessage.value = apiErrorMessage
    toast.error(apiErrorMessage) // Toast error
  } finally {
    isSubmitting.value = false
  }
}
</script>