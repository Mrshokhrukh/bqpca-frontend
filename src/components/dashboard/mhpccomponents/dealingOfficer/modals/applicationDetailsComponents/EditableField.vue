<template>
  <div class="bg-gray-50 rounded-lg p-4">
    <p class="text-sm font-medium text-gray-500 mb-2">{{ label }}</p>
    <div v-if="!isEditing" class="text-sm text-gray-900">
      {{ value || 'N/A' }}
    </div>
    <div v-else>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    default: '',
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
})
</script>
