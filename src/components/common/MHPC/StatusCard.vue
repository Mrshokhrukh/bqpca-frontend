<template>
  <div
    class="bg-white p-5 rounded-xl shadow-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
  >
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-base font-semibold text-slate-600">{{ title }}</h3>
      <div :class="['p-2.5 rounded-full', iconBgColorClass]">
        <svg
          v-if="iconType === 'pending'"
          xmlns="http://www.w3.org/2000/svg"
          :class="['h-5 w-5', iconColorClass]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <svg
          v-if="iconType === 'approved'"
          xmlns="http://www.w3.org/2000/svg"
          :class="['h-5 w-5', iconColorClass]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <svg
          v-if="iconType === 'rejected'"
          xmlns="http://www.w3.org/2000/svg"
          :class="['h-5 w-5', iconColorClass]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    </div>
    <p :class="['text-4xl font-bold', countColorClass]">{{ count }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  count: Number,
  status: String, // 'Pending', 'Approved', 'Regret'
  iconType: String, // 'pending', 'approved', 'rejected'
})

const baseColors = {
  Pending: { bg: 'bg-amber-100', text: 'text-amber-600', count: 'text-amber-500' },
  Approved: { bg: 'bg-green-100', text: 'text-green-600', count: 'text-green-500' },
  Regret: { bg: 'bg-red-100', text: 'text-red-600', count: 'text-red-500' },
  Default: { bg: 'bg-gray-100', text: 'text-gray-600', count: 'text-gray-500' },
}

const iconBgColorClass = computed(() => baseColors[props.status]?.bg || baseColors.Default.bg)
const iconColorClass = computed(() => baseColors[props.status]?.text || baseColors.Default.text)
const countColorClass = computed(() => baseColors[props.status]?.count || baseColors.Default.count)
</script>
