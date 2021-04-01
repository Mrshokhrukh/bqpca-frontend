<template>
  <section class="p-6 bg-white rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4 text-indigo-700">SWOT Analysis</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="strengths" class="block text-sm font-medium text-gray-700">Strengths <span class="text-red-500">*</span></label>
        <textarea id="strengths" :value="swotData.strengths" rows="4" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
      </div>
      <div>
        <label for="weaknesses" class="block text-sm font-medium text-gray-700">Weaknesses <span class="text-red-500">*</span></label>
        <textarea id="weaknesses" :value="swotData.weaknesses" rows="4" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
      </div>
      <div>
        <label for="opportunities" class="block text-sm font-medium text-gray-700">Opportunities <span class="text-red-500">*</span></label>
        <textarea id="opportunities" :value="swotData.opportunities" rows="4" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
      </div>
      <div>
        <label for="threats" class="block text-sm font-medium text-gray-700">Threats <span class="text-red-500">*</span></label>
        <textarea id="threats" :value="swotData.threats" rows="4" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
      </div>
    </div>
  </section>
</template>

<script setup>

defineProps({
  swotData: {
    type: Object,
    required: true
  }
});
</script>