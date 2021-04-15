<!-- FooterButtons Component -->
<template>
  <div class="px-8 py-4 bg-gray-50 border-t border-gray-200">
    <div class="flex justify-between items-center">
      <div v-if="errorMessage" class="text-sm text-red-600 flex items-center space-x-2">
        <CircleAlert class="h-4 w-4" />
        <span>{{ errorMessage }}</span>
      </div>
      <div class="flex items-center space-x-4">
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center space-x-2"
          @click="$emit('close')"
        >
          <X class="h-4 w-4" />
          <span>Close</span>
        </button>

        <button
          v-if="overallStatus === 'Approved'"
          type="button"
          class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 inline-flex items-center space-x-2"
          @click="$emit('open-certificate-modal')"
        >
          <FileText class="h-4 w-4" />
          <span>View Certificate</span>
        </button>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { FileText, CircleAlert, X } from 'lucide-vue-next'

const props = defineProps({
  application: {
    type: Object,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['close', 'open-certificate-modal', 'update']) // Corrected emit

const errorMessage = ref('')

const overallStatus = computed(() => {
  if (!props.application?.user_qualifications?.[0]) return 'Pending'

  const appReview = props.application.user_qualifications[0].application_review_status
  const physReview = props.application.user_qualifications[0].physical_review_status
  const endorse = props.application.user_qualifications[0].endorsement_decision

  if (appReview === 'Regretted' || physReview === 'Regretted' || endorse === 'Regretted') {
    return 'Regretted'
  } else if (appReview === 'Approved' && physReview === 'Approved' && endorse === 'Approved') {
    return 'Approved'
  } else {
    return 'Pending'
  }
})
</script>
