// components/dashboard/StatCard.vue
<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div class="bg-blue-100 p-2 rounded-full">
          <component :is="icon" class="w-5 h-5 text-blue-500" />
        </div>
        <h3 class="font-semibold">{{ title }}</h3>
      </div>
      <span v-if="total" class="text-sm text-gray-500">Annual Target</span>
    </div>

    <div v-if="type === 'progress'" class="space-y-2">
      <div class="flex justify-between text-sm">
        <span>Progress</span>
        <span>{{ progress }}/{{ total }} points</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div class="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
          :style="{ width: `${Math.min((progress / total) * 100, 100)}%` }"></div>
      </div>
    </div>

    <div v-else class="text-2xl font-bold">
      {{ progress }}
    </div>
  </div>
</template>

<script setup>

defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: 'AwardIcon'
  },
  progress: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    default: null
  },
  type: {
    type: String,
    default: 'number'
  }
});
</script>
