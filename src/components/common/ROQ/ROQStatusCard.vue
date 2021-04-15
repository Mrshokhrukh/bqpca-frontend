<template>
  <div
    class="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-gray-100 overflow-hidden"
  >
    <div class="p-6 relative">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center space-x-3">
          <div
            :class="`bg-${color}-50 text-${color}-500 rounded-xl p-3 shadow-md flex items-center justify-center`"
          >
            <component :is="icon" class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-semibold text-gray-800">{{ title }}</h3>
        </div>
        <span class="text-2xl font-bold text-gray-900">{{ count }}</span>
      </div>

      <div class="flex items-center justify-between space-x-4 mt-4">
        <div class="relative w-24 h-24">
          <svg class="w-full h-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e6e6e6"
              stroke-width="3"
              stroke-dasharray="100"
              class="stroke-current text-gray-200"
            />
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              :stroke="`currentColor`"
              :class="`text-${color}-500`"
              stroke-width="3"
              stroke-linecap="round"
              :stroke-dasharray="`${percentage}, 100`"
            />
          </svg>
          <div
            class="absolute inset-0 flex items-center justify-center text-lg font-bold"
            :class="`text-${color}-600`"
          >
            {{ percentage.toFixed(0) }}%
          </div>
        </div>

        <div class="flex-grow">
          <div class="text-sm font-medium text-gray-600 mb-1">Progress Breakdown</div>
          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">Total</span>
              <span class="text-sm font-semibold">{{ count }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">Percentage</span>
              <span class="text-sm font-semibold">{{ percentage.toFixed(1) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  icon: {
    type: Object,
    required: true,
  },
  color: {
    type: String,
    default: 'blue',
  },
  percentage: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 100,
  },
})
</script>

<style scoped>
/* Additional subtle animations and transitions */
svg path {
  transition: stroke-dasharray 0.5s ease-in-out;
}
</style>
