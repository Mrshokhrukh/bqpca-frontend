<template>
  <section class="p-6 bg-white rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4 text-blue-700">SWOT Analysis</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="strengths" class="block text-sm font-medium text-gray-700">Strengths <span
            class="text-red-500">*</span></label>
        <!-- Changed: Added @input -->
        <textarea id="strengths" :value="swotData.strengths"
          @input="$emit('update:swotData', { ...swotData, strengths: $event.target.value })" rows="4" required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
      </div>
      <div>
        <label for="weaknesses" class="block text-sm font-medium text-gray-700">Weaknesses <span
            class="text-red-500">*</span></label>
        <!-- Changed: Added @input -->
        <textarea id="weaknesses" :value="swotData.weaknesses"
          @input="$emit('update:swotData', { ...swotData, weaknesses: $event.target.value })" rows="4" required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
      </div>
      <div>
        <label for="opportunities" class="block text-sm font-medium text-gray-700">Opportunities <span
            class="text-red-500">*</span></label>
        <!-- Changed: Added @input -->
        <textarea id="opportunities" :value="swotData.opportunities"
          @input="$emit('update:swotData', { ...swotData, opportunities: $event.target.value })" rows="4" required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
      </div>
      <div>
        <label for="threats" class="block text-sm font-medium text-gray-700">Threats <span
            class="text-red-500">*</span></label>
        <!-- Changed: Added @input -->
        <textarea id="threats" :value="swotData.threats"
          @input="$emit('update:swotData', { ...swotData, threats: $event.target.value })" rows="4" required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
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

// Changed: Declare emit
defineEmits(['update:swotData']);
// End Change

</script>