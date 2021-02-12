<template>
  <div class="space-y-2">
    <div class="flex items-center space-x-2 text-gray-500">
      <component :is="icon" class="w-4 h-4" />
      <p class="text-sm">{{ label }}</p>
    </div>
    <p class="text-lg">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [String, Number],
  icon: String
});
</script>
