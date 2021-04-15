<template>
  <div class="bg-white p-4 rounded-lg shadow-md">
    <!-- Header Section -->
    <div class="flex items-center space-x-2 mb-2">
      <div class="bg-purple-100 p-1 rounded-full">
        <ClockIcon class="w-4 h-4 text-purple-500" />
      </div>
      <h3 class="font-bold text-gray-800 text-lg">Application Qualification</h3>
    </div>

    <!-- Total Qualifications -->
    <p class="text-base text-gray-900 mt-2">
      Total Qualifications: <span class="font-semibold">{{ totalQualifications }}</span>
    </p>

    <!-- Review Status Section -->
    <div v-if="totalQualifications > 0" class="mt-6 space-y-4">
      <div
        v-for="(counts, reviewType) in reviewStatusCounts"
        :key="reviewType"
        class="bg-gray-50 p-3 rounded-lg"
      >
        <h4 class="font-medium text-gray-700 text-sm mb-2">
          {{ formatReviewTypeName(reviewType) }}
        </h4>
        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="(count, status) in counts"
            :key="`${reviewType}-${status}`"
            :class="['p-2 rounded-lg text-center', getStatusClass(status)]"
          >
            <div class="font-semibold text-sm">{{ status }}</div>
            <div class="text-xs">{{ count || 0 }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500 mt-6">No Data to Display</div>

    <!-- Payment Status -->
    <div v-if="totalQualifications > 0" class="mt-6">
      <h3 class="font-semibold text-gray-800 text-base mb-2">Payment Status</h3>
      <div class="grid grid-cols-2 gap-2">
        <div class="bg-green-50 p-2 rounded-lg text-center">
          <div class="font-semibold text-green-700 text-sm">Completed</div>
          <div class="text-lg font-bold text-green-800 mt-1">
            {{ paymentStatusCounts.Yes || 0 }}
          </div>
        </div>
        <div class="bg-red-50 p-2 rounded-lg text-center">
          <div class="font-semibold text-red-700 text-sm">Pending</div>
          <div class="text-lg font-bold text-red-800 mt-1">
            {{ paymentStatusCounts.No || 0 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ClockIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const props = defineProps({
  applications: {
    type: Array,
    required: true,
  },
})

// Helper function to count statuses
const countStatuses = (items, statusKey) => {
  const counts = { Approved: 0, Pending: 0, Rejected: 0 }
  items.forEach((item) => {
    const status = item[statusKey] || 'Pending'
    if (counts[status] !== undefined) counts[status]++
  })
  return counts
}

// Get all qualifications from all applications
const allQualifications = computed(() =>
  props.applications.flatMap((app) =>
    Array.isArray(app.user_qualifications)
      ? app.user_qualifications
      : Object.values(app.user_qualifications || {}),
  ),
)

// Total qualifications count
const totalQualifications = computed(() => allQualifications.value.length)

// Count qualifications by status
const qualificationStatusCounts = computed(() => countStatuses(allQualifications.value, 'status'))

// Count the review status for each review type
const reviewStatusCounts = computed(() => {
  const reviewTypes = [
    'application_review_status',
    'physical_review_status',
    'endorsement_decision',
  ]
  return Object.fromEntries(
    reviewTypes.map((type) => [type, countStatuses(allQualifications.value, type)]),
  )
})

// Count payment status
const paymentStatusCounts = computed(() => {
  const counts = { Yes: 0, No: 0 }
  allQualifications.value.forEach((qual) => {
    const paymentStatus = qual.payment_complete || 'No'
    counts[paymentStatus]++
  })
  return counts
})

// Helper function to get status class
const getStatusClass = (status) => {
  const classes = {
    Approved: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Rejected: 'bg-red-100 text-red-800',
    Yes: 'bg-green-100 text-green-800',
    No: 'bg-red-100 text-red-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Helper function to format review type names
const formatReviewTypeName = (type) => {
  const typeNames = {
    application_review_status: 'Qualification Review',
    physical_review_status: 'Document Review Status',
    endorsement_decision: 'Endorsement Decision',
  }
  return typeNames[type] || type
}
</script>
