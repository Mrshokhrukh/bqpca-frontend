<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h3 class="font-semibold mb-4">{{ title }}</h3>
    <div class="space-y-4">
      <div v-for="(deadline, index) in deadlines" :key="index" class="flex items-start space-x-3">
        <div class="bg-red-100 p-2 rounded-full">
          <CircleAlert class="w-4 h-4 text-red-500" />
        </div>
        <div>
          <p class="text-sm font-medium">{{ deadline.title }}</p>
          <p class="text-xs text-gray-500">Due: {{ formatDate(deadline.date) }}</p>
        </div>
      </div>

      <div v-if="!deadlines.length" class="text-center text-gray-500 text-sm">
        No upcoming deadlines
      </div>
    </div>
  </div>
</template>

<script setup>
import { CircleAlert } from 'lucide-vue-next'
import dayjs from 'dayjs'

defineProps({
  title: {
    type: String,
    required: true,
  },
  deadlines: {
    type: Array,
    default: () => [],
  },
})

const formatDate = (date) => dayjs(date).format('MMM DD, YYYY')
</script>
