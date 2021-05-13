<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div class="p-6">
      <div class="flex items-center justify-between">
        <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
          <User class="h-5 w-5 text-gray-500" />
          <span>Personal Information</span>
        </h4>
      </div>
      <div class="flex flex-col items-center space-y-4">
        <!-- Profile Photo with Status Indicator -->
        <div class="relative group">
          <img
            :src="application.passport_photo || '/placeholder-avatar.png'"
            @error="handleImageError"
            class="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg transition-transform group-hover:scale-105"
          />
          <span
            class="absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-white shadow-sm"
            :class="{
              'bg-yellow-400': overallStatus === 'Pending',
              'bg-green-400': overallStatus === 'Approved',
              'bg-red-400': overallStatus === 'Regretted',
            }"
          />
        </div>

        <!-- Full Name -->
        <div class="text-center">
          <h5 class="text-xl font-semibold text-gray-900">
            {{ application.full_name }}
          </h5>
        </div>

        <!-- CID -->
        <div class="text-center">
          <p class="text-sm text-gray-500 mt-1">CID: {{ application.cid_no }}</p>
        </div>

        <!-- Gender and DOB -->
        <div class="w-full grid grid-cols-2 gap-4 mt-4">
          <div class="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
            <UserCircle class="h-4 w-4 text-gray-400" />
            <span class="text-sm text-gray-600">{{ application.gender }}</span>
          </div>
          <div class="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
            <Calendar class="h-4 w-4 text-gray-400" />
            <span class="text-sm text-gray-600">{{ formatDate(application.date_of_birth) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { User, UserCircle, Calendar } from 'lucide-vue-next'

const props = defineProps({
  application: {
    type: Object,
    required: true,
  },
})

const formatDate = (date) => {
  // ... (keep your existing formatDate function)
  if (!date) return 'N/A'
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid Date'
  }
}

// --- MODIFIED FUNCTION ---
const handleImageError = (event) => {
  const placeholderSrc = '/placeholder-avatar.png'
  const imageElement = event.target

  // IMPORTANT CHECK: If the source that failed is ALREADY the placeholder,
  // stop to prevent infinite loops. We use endsWith because the browser
  // might resolve the 'src' to a full URL (e.g., http://localhost:5173/placeholder-avatar.png)
  if (imageElement.src && imageElement.src.endsWith(placeholderSrc)) {
    console.error('Placeholder image failed to load or caused recursive error:', imageElement.src)
    // Optional: Remove the error handler now to be absolutely sure
    // imageElement.onerror = null;
    return // Do nothing more
  }

  // Otherwise, the original image source failed, so set the placeholder
  console.warn('Original image failed, setting placeholder:', imageElement.src)
  imageElement.src = placeholderSrc
}
// --- END MODIFIED FUNCTION ---

const overallStatus = computed(() => {
  // ... (keep your existing computed property)
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
