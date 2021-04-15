<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h3 class="font-semibold mb-4">{{ title }}</h3>
    <div class="space-y-4">
      <div v-for="(deadline, index) in deadlines" :key="index" class="flex items-start space-x-3">
        <div :class="['p-2 rounded-full', getDeadlineTypeClass(deadline.type)]">
          <component
            :is="getDeadlineIcon(deadline.type)"
            class="w-4 h-4"
            :class="getDeadlineIconClass(deadline.type)"
          />
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
import { CalendarIcon, AlertCircle } from 'lucide-vue-next' // Changed import
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

const getDeadlineIcon = (type) => {
  if (type === 'Renewal') return CalendarIcon
  return AlertCircle // Changed to AlertCircle
}

const getDeadlineTypeClass = (type) => {
  const classes = {
    CPD: 'bg-blue-100',
    Renewal: 'bg-red-100',
    Application: 'bg-green-100',
  }
  return classes[type] || 'bg-red-100'
}

const getDeadlineIconClass = (type) => {
  const classes = {
    CPD: 'text-blue-500',
    Renewal: 'text-red-500',
    Application: 'text-green-500',
  }
  return classes[type] || 'text-red-500'
}
</script>
