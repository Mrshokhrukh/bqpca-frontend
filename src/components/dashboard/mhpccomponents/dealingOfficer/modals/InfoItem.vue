<template>
  <div>
    <p class="text-xs font-medium text-gray-500">{{ label }}</p>
    <p v-if="value" :class="['text-sm mt-0.5', isLongText ? 'text-gray-800 leading-relaxed' : 'text-gray-900 font-medium']">
        {{ value }}
    </p>
    <p v-else class="text-sm text-gray-400 italic mt-0.5">Not provided</p>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
  isLongText: {
    type: Boolean,
    default: false
  }
});
</script>
