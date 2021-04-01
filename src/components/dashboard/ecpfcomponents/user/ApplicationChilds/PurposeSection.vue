<template>
  <section class="p-6 bg-white rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4 text-indigo-700">Purpose of Establishment</h2>
      <div class="space-y-4">
        <div>
            <label for="vision" class="block text-sm font-medium text-gray-700">Vision <span class="text-red-500">*</span></label>
            <textarea id="vision" :value="purposeData.vision" rows="4" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
        </div>
        <div>
            <label for="mission" class="block text-sm font-medium text-gray-700">Mission <span class="text-red-500">*</span></label>
            <textarea id="mission" :value="purposeData.mission" rows="4" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
        </div>
        <div>
            <label for="objective" class="block text-sm font-medium text-gray-700">Objective <span class="text-red-500">*</span></label>
            <textarea id="objective" :value="purposeData.objective" rows="4" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
        </div>
      </div>
  </section>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  purposeData: {
    type: Object,
    required: true
  }
});
</script>