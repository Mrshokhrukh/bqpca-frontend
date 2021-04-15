<!-- StatsCard.vue -->
<template>
  <div
    :class="[
      'bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-gray-100',
      customClass,
    ]"
  >
    <div class="p-5">
      <div class="flex items-center justify-between mb-3">
        <div
          :class="`bg-${color}-50 text-${color}-500 rounded-xl p-3 shadow-md flex items-center justify-center`"
        >
          <component :is="icon" class="w-7 h-7" />
        </div>
        <div class="text-right">
          <p class="text-xs uppercase tracking-wider text-gray-500 mb-1">{{ title }}</p>
          <p :class="['text-3xl font-extrabold text-gray-800', customClass]">
            {{ formattedCount }}
          </p>
        </div>
      </div>

      <div class="border-t border-gray-100 pt-3 mt-3">
        <div class="flex items-center justify-between">
          <p
            :class="[
              'text-sm font-medium',
              trend.includes('+')
                ? 'text-green-600'
                : trend.includes('-')
                  ? 'text-red-600'
                  : 'text-gray-500',
            ]"
          >
            <span v-if="trend" class="mr-1">
              {{ trend.includes('+') ? '▲' : trend.includes('-') ? '▼' : '' }}
            </span>
            {{ trend || 'No trend data' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  count: {
    type: [Number, String],
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
  trend: {
    type: String,
    default: '',
  },
  class: {
    type: String,
    default: '',
  },
})

// Optional: Format large numbers
const formattedCount = computed(() => {
  const num = Number(props.count)
  return num >= 1000 ? (num / 1000).toFixed(1) + 'k' : props.count
})

const customClass = props.class
</script>

<style scoped>
/* Additional subtle animations and transitions */
.bg-blue-50 {
  transition: background-color 0.3s ease;
}

.hover\:shadow-xl:hover {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>
