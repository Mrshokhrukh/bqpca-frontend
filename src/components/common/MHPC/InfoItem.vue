<template>
  <div class="info-item flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <p class="text-xs font-medium text-gray-500 mb-0.5 sm:mb-0">{{ label }}:</p>
    <div class="flex items-center space-x-2 text-xs sm:text-sm sm:text-right">
      <p :class="valueDynamicClass">
        {{ value ?? 'N/A' }}
      </p>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number, Boolean],
    default: 'N/A',
  },
  valueClass: {
    type: String,
    default: '',
  },
})

const valueDynamicClass = computed(() => {
  if (props.valueClass) {
    return props.valueClass
  }
  return 'text-gray-800 font-semibold'
})
</script>

<style scoped>
/* You can add component-specific styles here if absolutely necessary,
   but prefer Tailwind utility classes in the template. */
.info-item {
  border-bottom: 1px solid rgba(69, 68, 68, 0.492);
  padding: 8px;
  background: rgba(189, 210, 243, 0.224);
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
  /* Example: Add a subtle bottom border if items are stacked closely
  @apply border-b border-gray-100 py-2;
  &:last-child {
    @apply border-b-0;
  }
  */
}
</style>
