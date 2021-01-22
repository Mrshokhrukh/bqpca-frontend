<!-- StatsCard.vue -->
<template>
  <div class="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <div :class="`p-3 bg-${color}-50 rounded-lg`">
          <component :is="icon" class="w-6 h-6" :class="`text-${color}-500`" />
        </div>
        <div class="ml-4">
          <p class="text-sm text-gray-500">{{ title }}</p>
          <p class="text-2xl font-bold">{{ count }}</p>
        </div>
      </div>
    </div>
    <div class="mt-2">
      <p class="text-sm text-gray-500">{{ trend }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  count: {
    type: [Number, String],
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
  trend: {
    type: String,
    default: ''
  }
});
</script>
