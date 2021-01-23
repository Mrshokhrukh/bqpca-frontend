<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <!-- Modal Header -->
      <h2 class="text-xl font-bold mb-4">Manage CAPA</h2>

      <!-- CAPA Details -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Institute Name</label>
          <p class="mt-1 text-gray-900">{{ institute.name }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">CAPA Issues</label>
          <textarea v-model="capaDetails"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4" placeholder="Enter CAPA details..."></textarea>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 flex justify-end space-x-2">
        <button @click="saveCAPA" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Save
        </button>
        <button @click="$emit('close')" class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'

const props = defineProps({
  institute: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const capaDetails = ref('')

const saveCAPA = () => {
  // Save CAPA details (e.g., send to backend)
  alert(`CAPA saved for ${props.institute.name}: ${capaDetails.value}`)
  emit('close')
}
</script>

<style scoped>
/* Additional custom styles can be added here */
</style>