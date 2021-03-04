<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h3 class="font-semibold mb-4">{{ title }}</h3>
    <div class="space-y-4">
      <div v-for="(activity, index) in activities" :key="index" class="flex items-start space-x-3">
        <div :class="[
      'p-2 rounded-full',
      activity.type === 'cpd' ? 'bg-blue-100' : 'bg-green-100'
    ]">
          <component :is="activity.type === 'cpd' ? BookOpenIcon : DocumentIcon" class="w-4 h-4"
            :class="activity.type === 'cpd' ? 'text-blue-500' : 'text-green-500'" />
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
import { BookOpenIcon, DocumentIcon } from '@heroicons/vue/24/outline';
import dayjs from 'dayjs';

defineProps({
  title: {
    type: String,
    required: true
  },
  activities: {
    type: Array,
    default: () => []
  }
});

const formatDate = (date) => dayjs(date).format('MMM DD, YYYY');
</script>
