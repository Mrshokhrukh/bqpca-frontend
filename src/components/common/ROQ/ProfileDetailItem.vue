<template>
  <div>
    <dt class="text-xs font-medium text-slate-500 uppercase tracking-wider flex items-center">
      <component
        v-if="icon && lucideIcons[icon]"
        :is="lucideIcons[icon]"
        class="w-3.5 h-3.5 mr-1.5 text-slate-400"
        aria-hidden="true"
      />
      {{ label }}
    </dt>
    <dd class="mt-0.5 text-sm text-slate-800 font-medium" :class="{ 'select-all': isStatic }">
      {{ value || 'N/A' }}
    </dd>
  </div>
</template>

<script setup>
import * as lucideIcons from 'lucide-vue-next'
defineProps({
  label: String,
  value: [String, Number],
  icon: String,
  isStatic: { type: Boolean, default: false }, // For things like email that shouldn't change here
})
</script>
