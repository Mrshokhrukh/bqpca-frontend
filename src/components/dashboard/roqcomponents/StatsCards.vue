<!-- components/roq/StatsCard.vue -->
<template>
  <div class="bg-white rounded-lg shadow p-4">
    <div class="flex items-center">
      <div :class="`p-2 bg-${color}-50 rounded-full`">
        <component :is="icon" class="w-5 h-5" :class="`text-${color}-500`" />
      </div>
      <div class="ml-4">
        <p class="text-sm text-gray-500">{{ title }}</p>
        <p class="text-xl font-semibold">{{ count }}</p>
      </div>
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
  }
});
</script>
