<!-- File: src/components/dashboard/accredcomponent/admin/StatCard.vue -->
<template>
  <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex items-start justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1">
    <div>
      <p class="text-sm font-medium text-slate-500">{{ label }}</p>
      <p class="text-3xl font-bold text-slate-900 mt-1">{{ value }}</p>
    </div>
    <div class="p-3 rounded-full" :class="colorClass">
      <component :is="iconComponent" class="h-6 w-6" :class="iconColorClass" />
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'blue', // Default color theme
  }
})

// Dynamically import lucide-vue-next icons
const iconComponent = computed(() =>
  defineAsyncComponent(() =>
    import('lucide-vue-next').then(mod => mod[props.icon])
  )
);

const colorClasses = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  red: { bg: 'bg-red-100', text: 'text-red-600' },
  green: { bg: 'bg-green-100', text: 'text-green-600' },
};

const colorClass = computed(() => colorClasses[props.color]?.bg || colorClasses.blue.bg);
const iconColorClass = computed(() => colorClasses[props.color]?.text || colorClasses.blue.text);
</script>