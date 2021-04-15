<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <div class="flex items-center space-x-3 mb-4">
      <div class="bg-green-100 p-2 rounded-full">
        <DocumentIcon class="w-5 h-5 text-green-500" />
      </div>
      <h3 class="font-semibold">License Status</h3>
    </div>

    <div class="space-y-4">
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">Valid Until</span>
        <span :class="['text-sm font-medium', expiryStatusClass]">
          {{ formatDate(expiryDate) }}
        </span>
      </div>

      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">Status</span>
        <span :class="['px-2 py-1 rounded-full text-xs font-medium', statusClass]">
          {{ status || 'Loading...' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { DocumentIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  expiryDate: {
    type: String,
    required: false,
    default: null,
  },
  status: {
    type: String,
    default: 'Inactive',
  },
})

const formatDate = (date) => {
  return date ? dayjs(date).format('MMM DD, YYYY') : 'N/A'
}

const expiryStatusClass = computed(() => {
  if (!props.expiryDate) return 'text-gray-600'

  const expiry = dayjs(props.expiryDate)
  const now = dayjs()
  const threeMonths = expiry.subtract(3, 'month')
  const twoWeeks = expiry.subtract(2, 'week')

  if (now.isAfter(expiry)) return 'text-gray-500'
  if (now.isAfter(twoWeeks)) return 'text-red-500'
  if (now.isAfter(threeMonths)) return 'text-yellow-500'
  return 'text-green-500'
})

const statusClass = computed(() => {
  const classes = {
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-gray-100 text-gray-800',
    Expired: 'bg-red-100 text-red-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Suspended: 'bg-orange-100 text-orange-800',
  }
  return classes[props.status] || 'bg-gray-100 text-gray-800'
})
</script>
