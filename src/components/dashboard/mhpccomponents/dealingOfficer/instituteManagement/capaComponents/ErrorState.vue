<template>
  <div class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
    <div class="flex items-center">
      <CircleAlert class="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
      <p class="text-red-700">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { CircleAlert } from 'lucide-vue-next';

defineProps({
  message: {
    type: String,
    required: true,
  },
});
</script>
