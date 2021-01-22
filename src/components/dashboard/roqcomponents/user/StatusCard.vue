<!-- StatusCard.vue -->
<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <div :class="`p-2 bg-${color}-50 rounded-full`">
          <component :is="icon" class="w-5 h-5" :class="`text-${color}-500`" />
        </div>
        <h3 class="ml-3 text-lg font-semibold">{{ title }}</h3>
      </div>
      <span class="text-2xl font-bold">{{ count }}</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2">
      <div class="h-2 rounded-full" :class="`bg-${color}-500`" :style="{ width: `${percentage}%` }"></div>
    </div>
    <p class="mt-2 text-sm text-gray-500">
      {{ percentage.toFixed(1) }}% of total applications
    </p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true
  },
  icon: {
    type: Object,
    required: true
  },
  color: {
    type: String,
    default: 'blue'
  },
  percentage: {
    type: Number,
    required: true
  }
});
</script>
