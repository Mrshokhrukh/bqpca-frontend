<template>
  <div>
    <!-- Debug info -->
    <div class="text-xs text-gray-500 mb-2">
      User ID: {{ getUserId() }} | Counselor: {{ application.is_counselor ? 'Yes' : 'No' }}
    </div>

    <!-- Badge for verified counselors -->
    <div v-if="application.is_counselor" class="flex flex-col space-y-3">
      <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
        <Check class="h-4 w-4 mr-1" />
        Verified Counselor
      </span>

      <!-- Unregister button for counselors only -->
      <button @click="unregisterCounselor"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 w-fit"
        :disabled="isSubmitting">
        <span v-if="isSubmitting">Updating...</span>
        <span v-else>Unregister as Counselor</span>
      </button>
    </div>

    <!-- Register button for non-counselors -->
    <div v-if="!application.is_counselor">
      <button @click="registerAsCounselor"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200"
        :disabled="isSubmitting">
        <span v-if="isSubmitting">Updating...</span>
        <span v-else>Register as Counselor</span>
      </button>
    </div>

    <!-- Error message display -->
    <div v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Check } from 'lucide-vue-next'
import apiServices from '@/services/services'
import { useToast } from 'vue-toastification'

const props = defineProps({
  application: {
    type: Object,
    required: true,
  },
  userId: {
    type: [Number, String],
    default: null
  }
})

const emit = defineEmits(['update'])
const errorMessage = ref('')
const isSubmitting = ref(false)
const toast = useToast()

// Helper function to get user ID from various possible locations
const getUserId = () => {
  // Try different paths to find the user ID
  const possibleIds = [
    props.userId,                 // Direct prop
    props.application.user_id,    // Common field name
    props.application.userId,     // Camel case variation
    props.application.id          // Sometimes the application itself has the ID
  ]

  // Return the first non-null ID
  for (const id of possibleIds) {
    if (id) return id
  }

  // If we're here, we couldn't find an ID
  console.error('Could not determine user ID', props.application)
  return null
}

const registerAsCounselor = async () => {
  const userId = getUserId()

  if (!userId) {
    const errorMsg = 'User ID is missing. Cannot register as counselor.'
    console.error(errorMsg, props.application)
    errorMessage.value = errorMsg
    toast.error(errorMsg)
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    // Create form data
    const formData = new FormData()
    formData.append('is_counselor', 'true')

    console.log('Registering user as counselor. User ID:', userId, 'Form data:', {
      is_counselor: true
    })

    // Make API call
    const response = await apiServices.patchUser(userId, formData)
    console.log('API response:', response)

    // Show success toast
    toast.success('Successfully registered as a counselor!')

    // Notify parent to refresh
    emit('update')
  } catch (error) {
    console.error('Error registering as counselor:', error)
    let apiErrorMessage = 'Failed to register as counselor.'

    if (error.response && error.response.data) {
      const errors = error.response.data
      console.log('API error details:', errors)

      if (typeof errors === 'string') {
        apiErrorMessage = errors
      } else if (typeof errors === 'object') {
        const messages = Object.values(errors).flat()
        if (messages.length > 0) {
          apiErrorMessage = messages.join(' ')
        }
      }
    }

    errorMessage.value = apiErrorMessage
    toast.error(apiErrorMessage)
  } finally {
    isSubmitting.value = false
  }
}

const unregisterCounselor = async () => {
  const userId = getUserId()

  if (!userId) {
    const errorMsg = 'User ID is missing. Cannot unregister as counselor.'
    console.error(errorMsg, props.application)
    errorMessage.value = errorMsg
    toast.error(errorMsg)
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    // Create form data
    const formData = new FormData()
    formData.append('is_counselor', 'false')

    console.log('Unregistering user as counselor. User ID:', userId, 'Form data:', {
      is_counselor: false
    })

    // Make API call
    const response = await apiServices.patchUser(userId, formData)
    console.log('API response:', response)

    // Show success toast
    toast.success('Successfully unregistered as a counselor.')

    // Notify parent to refresh
    emit('update')
  } catch (error) {
    console.error('Error unregistering as counselor:', error)
    let apiErrorMessage = 'Failed to unregister as counselor.'

    if (error.response && error.response.data) {
      const errors = error.response.data
      console.log('API error details:', errors)

      if (typeof errors === 'string') {
        apiErrorMessage = errors
      } else if (typeof errors === 'object') {
        const messages = Object.values(errors).flat()
        if (messages.length > 0) {
          apiErrorMessage = messages.join(' ')
        }
      }
    }

    errorMessage.value = apiErrorMessage
    toast.error(apiErrorMessage)
  } finally {
    isSubmitting.value = false
  }
}
</script>