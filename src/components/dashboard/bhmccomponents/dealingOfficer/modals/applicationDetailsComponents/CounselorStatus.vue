<template>
  <div>
    <!-- Badge for verified counselors -->
    <div v-if="application.is_counselor" class="flex flex-col space-y-3">
      <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
        <Check class="h-4 w-4 mr-1" />
        Verified Counselor
      </span>

      <!-- Unregister button for counselors only -->
      <button @click="unregisterCounselor"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 w-fit">
        Unregister as Counselor
      </button>
    </div>

    <!-- Register button for non-counselors -->
    <div v-if="!application.is_counselor">
      <button @click="registerAsCounselor"
        class="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200">
        Register as Counselor
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

const props = defineProps({
  application: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update'])
const errorMessage = ref('')

const registerAsCounselor = async () => {
  if (!props.application.userDetails?.id) {
    console.error("User details ID is missing.")
    errorMessage.value = "User details are missing."
    return
  }

  try {
    const formData = new FormData()
    formData.append('is_counselor', true)

    // Make API call to update user details
    await apiServices.patchUser(props.application.userDetails.id, formData)

    // Notify parent to refresh
    emit('update')
  } catch (error) {
    console.error("Error updating counselor status:", error)
    errorMessage.value = "Failed to update counselor status."
  }
}

const unregisterCounselor = async () => {
  if (!props.application.userDetails?.id) {
    console.error("User details ID is missing.")
    errorMessage.value = "User details are missing."
    return
  }

  try {
    const formData = new FormData()
    formData.append('is_counselor', false)

    // Make API call to update user details
    await apiServices.patchUser(props.application.userDetails.id, formData)

    // Notify parent to refresh
    emit('update')
  } catch (error) {
    console.error("Error updating counselor status:", error)
    errorMessage.value = "Failed to update counselor status."
  }
}
</script>
