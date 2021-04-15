<template>
  <section class="p-6 bg-white rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4 text-blue-700">Purpose of Establishment</h2>
    <div class="space-y-4">
      <div>
        <label for="vision" class="block text-sm font-medium text-gray-700"
          >Vision <span class="text-red-500">*</span></label
        >
        <!-- Changed: Added @input -->
        <textarea
          id="vision"
          :value="purposeData.vision"
          @input="$emit('update:purposeData', { ...purposeData, vision: $event.target.value })"
          rows="4"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        ></textarea>
      </div>
      <div>
        <label for="mission" class="block text-sm font-medium text-gray-700"
          >Mission <span class="text-red-500">*</span></label
        >
        <!-- Changed: Added @input -->
        <textarea
          id="mission"
          :value="purposeData.mission"
          @input="$emit('update:purposeData', { ...purposeData, mission: $event.target.value })"
          rows="4"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        ></textarea>
      </div>
      <div>
        <label for="objective" class="block text-sm font-medium text-gray-700"
          >Objective <span class="text-red-500">*</span></label
        >
        <!-- Changed: Added @input -->
        <textarea
          id="objective"
          :value="purposeData.objective"
          @input="$emit('update:purposeData', { ...purposeData, objective: $event.target.value })"
          rows="4"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        ></textarea>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  purposeData: {
    type: Object,
    required: true,
  },
})

// Changed: Declare emit
defineEmits(['update:purposeData'])
// End Change
</script>
