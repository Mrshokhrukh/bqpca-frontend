<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-4 text-sm">
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <div class="bg-indigo-50 p-1.5 rounded-md">
          <ClipboardIcon class="w-3.5 h-3.5 text-indigo-600" />
        </div>
        <h3 class="font-medium text-gray-800">Application Qualification</h3>
      </div>
      <div class="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium">
        Total: {{ totalQualifications }}
      </div>
    </div>

    <div v-if="totalQualifications > 0" class="space-y-3">
      <!-- Review Status Cards -->
      <div
        v-for="(counts, reviewType) in reviewStatusCounts"
        :key="reviewType"
        class="border border-gray-100 rounded-md overflow-hidden"
      >
        <div
          class="bg-gray-50 px-3 py-1.5 border-b border-gray-100 flex justify-between items-center"
        >
          <span class="text-xs font-medium text-gray-600">{{
            formatReviewTypeName(reviewType)
          }}</span>
          <div class="flex items-center gap-1">
            <span class="inline-block w-2 h-2 rounded-full bg-green-400"></span>
            <span class="inline-block w-2 h-2 rounded-full bg-yellow-400"></span>
            <span class="inline-block w-2 h-2 rounded-full bg-red-400"></span>
          </div>
        </div>
        <div class="grid grid-cols-3">
          <div
            v-for="(count, status) in counts"
            :key="`${reviewType}-${status}`"
            class="py-2 px-2 flex flex-col items-center justify-center"
            :class="{ 'border-r border-gray-100': status !== 'Rejected' }"
          >
            <div class="w-full flex items-center justify-center mb-1">
              <span class="w-2 h-2 rounded-full mr-1.5" :class="getStatusDotClass(status)"></span>
              <span class="text-xs text-gray-600">{{ status }}</span>
            </div>
            <div class="text-sm font-medium" :class="getStatusTextClass(status)">
              {{ count || 0 }}
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Status -->
      <div class="border border-gray-100 rounded-md overflow-hidden">
        <div class="bg-gray-50 px-3 py-1.5 border-b border-gray-100">
          <span class="text-xs font-medium text-gray-600">Payment Status</span>
        </div>
        <div class="grid grid-cols-2">
          <div class="py-2 px-3 border-r border-gray-100 flex items-center justify-between">
            <div class="flex items-center">
              <span class="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
              <span class="text-xs text-gray-600">Completed</span>
            </div>
            <span class="text-sm font-medium text-green-700">{{
              paymentStatusCounts.Yes || 0
            }}</span>
          </div>
          <div class="py-2 px-3 flex items-center justify-between">
            <div class="flex items-center">
              <span class="w-2 h-2 rounded-full bg-red-500 mr-1.5"></span>
              <span class="text-xs text-gray-600">Pending</span>
            </div>
            <span class="text-sm font-medium text-red-700">{{ paymentStatusCounts.No || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="mt-3">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs text-gray-500">Completion Rate</span>
          <span class="text-xs font-medium text-indigo-700">
            {{ Math.round((qualificationStatusCounts.Approved / totalQualifications) * 100) }}%
          </span>
        </div>
        <div class="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
            :style="`width: ${(qualificationStatusCounts.Approved / totalQualifications) * 100}%`"
          ></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="py-6 flex flex-col items-center justify-center text-gray-400">
      <ClipboardXIcon class="w-6 h-6 mb-2" />
      <p class="text-xs">No qualification data available</p>
    </div>
  </div>
</template>

<script setup>
import { ClipboardIcon, ClipboardXIcon } from 'lucide-vue-next'
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

// Helper function to get status dot class
const getStatusDotClass = (status) => {
  const classes = {
    Approved: 'bg-green-500',
    Pending: 'bg-yellow-500',
    Rejected: 'bg-red-500',
  }
  return classes[status] || 'bg-gray-500'
}

// Helper function to get status text class
const getStatusTextClass = (status) => {
  const classes = {
    Approved: 'text-green-700',
    Pending: 'text-yellow-700',
    Rejected: 'text-red-700',
  }
  return classes[status] || 'text-gray-700'
}

// Helper function to format review type names
const formatReviewTypeName = (type) => {
  const typeNames = {
    application_review_status: 'Qualification Review',
    physical_review_status: 'Document Review',
    endorsement_decision: 'Endorsement Decision',
  }
  return typeNames[type] || type
}
</script>
