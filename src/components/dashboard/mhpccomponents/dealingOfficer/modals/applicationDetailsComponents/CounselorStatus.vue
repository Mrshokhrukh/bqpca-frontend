<template>
  <div>
    <!-- Debug info -->
    <div class="text-xs text-gray-500 mb-2">
      User ID: {{ getUserId() }} | Counselor: {{ application.is_counselor ? 'Yes' : 'No' }}
    </div>

    <!-- Badge for verified counselors -->
    <div v-if="application.is_counselor" class="flex flex-col space-y-3">
      <span
        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700"
      >
        <Check class="h-4 w-4 mr-1" />
        Verified Counselor
      </span>

      <!-- Unregister button for counselors -->
      <button
        @click="unregisterCounselor"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 w-fit"
        :disabled="isSubmitting"
      >
        <span v-if="isSubmitting">
          <svg
            class="animate-spin h-4 w-4 inline mr-2"
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
          Unregistering...
        </span>
        <span v-else>Unregister as Counselor</span>
      </button>
    </div>

    <!-- Register button for non-counselors -->
    <div v-if="!application.is_counselor">
      <button
        @click="registerAsCounselor"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200"
        :disabled="isSubmitting"
      >
        <span v-if="isSubmitting">
          <svg
            class="animate-spin h-4 w-4 inline mr-2"
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
          Registering...
        </span>
        <span v-else>Register as Counselor</span>
      </button>
    </div>

    <!-- Error message display -->
    <div v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
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
    default: null,
  },
})

watchEffect(() => {
  console.log(
    '%c[CounselorStatus.vue] Data Received:',
    'color: #4CAF50; font-weight: bold;',
    props.application,
  )
  if (props.application) {
    console.log(
      '%c[CounselorStatus.vue] Value of is_counselor:',
      'color: #03A9F4;',
      props.application.is_counselor,
    )
  }
})

const emit = defineEmits(['update', 'set-loading'])
const errorMessage = ref('')
const isSubmitting = ref(false)
const toast = useToast()

// Helper function to get user ID
const getUserId = () => {
  // The most reliable source for the user's ID is from the `userDetails` object
  // we fetched when opening the modal.
  const userId = props.application?.userDetails?.id

  if (userId) {
    return userId
  }

  // Fallback if userDetails is missing for some reason
  const fallbackId = props.application?.user_id
  if (fallbackId) return fallbackId

  console.error(
    'CRITICAL: Could not determine User ID for counselor status update.',
    props.application,
  )
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
  emit('set-loading', true) // Notify parent to show loading state

  try {
    const formData = new FormData()
    formData.append('is_counselor', 'true')

    const response = await apiServices.patchUser(userId, formData)

    // Verify the response data
    if (response.data?.is_counselor !== true) {
      throw new Error('API response did not confirm counselor registration.')
    }

    toast.success('Successfully registered as a counselor!')
    emit('update')
  } catch (error) {
    console.error('Error registering as counselor:', error)
    let apiErrorMessage = 'Failed to register as counselor.'

    if (error.response?.data) {
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
    emit('set-loading', false)
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
  emit('set-loading', true) // Notify parent to show loading state

  try {
    const formData = new FormData()
    formData.append('is_counselor', 'false')
    const response = await apiServices.patchUser(userId, formData)

    // Verify the response data
    if (response.data?.is_counselor !== false) {
      throw new Error('API response did not confirm counselor unregistration.')
    }

    toast.success('Successfully unregistered as a counselor.')
    emit('update')
  } catch (error) {
    console.error('Error unregistering as counselor:', error)
    let apiErrorMessage = 'Failed to unregister as counselor.'

    if (error.response?.data) {
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
    emit('set-loading', false) // Notify parent to hide loading state
  }
}
</script>
