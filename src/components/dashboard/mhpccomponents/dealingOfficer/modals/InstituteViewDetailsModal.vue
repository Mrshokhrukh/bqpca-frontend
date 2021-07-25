<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <!-- Modal Header -->
      <h2 class="text-xl font-bold mb-4">Institute Details</h2>

      <!-- Institute Details -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <p class="mt-1 text-gray-900">{{ institute.name }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Location</label>
          <p class="mt-1 text-gray-900">{{ institute.location }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Status</label>
          <p class="mt-1 text-gray-900">{{ institute.status }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Details</label>
          <p class="mt-1 text-gray-900">{{ institute.details }}</p>
        </div>
      </div>

      <!-- Close Button -->
      <div class="mt-6 flex justify-end">
        <button
          @click="$emit('close')"
          class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Define props
defineProps({
  institute: {
    type: Object,
    required: true,
  },
})

defineEmits(['close'])
</script>

<style scoped>
/* Additional custom styles can be added here */
</style>
