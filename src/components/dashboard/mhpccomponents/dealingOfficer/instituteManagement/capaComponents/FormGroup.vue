<template>
  <div>
    <label :for="forId" class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <div class="mt-1">
      <slot></slot> <!-- Input/Textarea will be placed here -->
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  forId: String,
});
</script>