<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h3 class="font-semibold mb-4">{{ title }}</h3>
    <div class="space-y-4">
      <div v-for="(activity, index) in activities" :key="index" class="flex items-start space-x-3">
        <div :class="['p-2 rounded-full', getActivityIconBgClass(activity.type)]">
          <component
            :is="getActivityIcon(activity.type)"
            class="w-4 h-4"
            :class="getActivityIconClass(activity.type)"
          />
        </div>
        <div>
          <p class="text-sm font-medium">{{ activity.title }}</p>
          <p class="text-xs text-gray-500">{{ formatDate(activity.date) }}</p>
        </div>
      </div>

      <div v-if="!activities.length" class="text-center text-gray-500 text-sm">
        No recent activities
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  BookOpenIcon,
  DocumentIcon,
  AcademicCapIcon,
  CheckCircleIcon,
} from '@heroicons/vue/24/outline'
import dayjs from 'dayjs'

defineProps({
  title: {
    type: String,
    required: true,
  },
  activities: {
    type: Array,
    default: () => [],
  },
})

const formatDate = (date) => dayjs(date).format('MMM DD, YYYY')

const getActivityIcon = (type) => {
  const icons = {
    CPD: BookOpenIcon,
    Application: DocumentIcon,
    Renewal: CheckCircleIcon,
    Certificate: AcademicCapIcon,
  }
  return icons[type] || DocumentIcon
}

const getActivityIconBgClass = (type) => {
  const classes = {
    CPD: 'bg-blue-100',
    Application: 'bg-green-100',
    Renewal: 'bg-purple-100',
    Certificate: 'bg-amber-100',
  }
  return classes[type] || 'bg-gray-100'
}

const getActivityIconClass = (type) => {
  const classes = {
    CPD: 'text-blue-500',
    Application: 'text-green-500',
    Renewal: 'text-purple-500',
    Certificate: 'text-amber-500',
  }
  return classes[type] || 'text-gray-500'
}
</script>
