<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <div class="flex items-center space-x-3 mb-4">
      <div class="bg-purple-100 p-2 rounded-full">
        <ClockIcon class="w-5 h-5 text-purple-500" />
      </div>
      <h3 class="font-semibold">Application History</h3>
    </div>

    <div class="space-y-3">
      <div
        v-for="(status, index) in statusTypes"
        :key="index"
        class="flex justify-between items-center"
        :class="{ 'cursor-pointer': status === 'Rejected' }"
        @click="status === 'Rejected' && $emit('show-rejected')"
      >
        <span class="text-sm">{{ status }}</span>
        <span :class="['px-2 py-1 rounded-full text-xs', getStatusClass(status)]">
          {{ getStatusCount(status) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ClockIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  applications: {
    type: Array,
    required: true,
  },
})

defineEmits(['show-rejected'])

const statusTypes = ['Approved', 'Pending', 'Rejected']

const getStatusCount = (status) => props.applications.filter((app) => app.status === status).length

const getStatusClass = (status) => {
  const classes = {
    Approved: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Rejected: 'bg-red-100 text-red-800',
  }
  return classes[status]
}
</script>
