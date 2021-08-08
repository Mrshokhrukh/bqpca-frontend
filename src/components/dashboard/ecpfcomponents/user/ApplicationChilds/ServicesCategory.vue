<template>
  <section class="p-6 bg-white rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4 text-blue-700">Service Category</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <div>
          <label for="serviceCategory" class="block text-sm font-medium text-gray-700">
            Select Service Category:<span class="text-red-500">*</span>
          </label>
          <select
            id="serviceCategory"
            v-model="selected"
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Select a service category</option>
            <option v-for="cat in serviceCategories" :key="cat.id" :value="cat.id">
              {{ cat.service_name }}
            </option>
          </select>
        </div>
      </div>
      <div>
        <label for="serviceDetails" class="block text-sm font-medium text-gray-700">
          Details:<span class="text-red-500">*</span>
        </label>
        <textarea
          id="serviceDetails"
          :value="details"
          @input="onDetailsChange"
          required
          rows="8"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Provide details for this service category..."
        ></textarea>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  serviceCategories: {
    type: Array,
    default: () => [],
  },
  selectedCategory: {
    type: [String, Number],
    default: '',
  },
  details: {
    type: String,
    default: '',
  },
})

// Use a local ref to emit changes
import { ref, watch } from 'vue'
const emit = defineEmits(['update:selectedCategory'])

const selected = ref(props.selectedCategory)

watch(selected, (val) => {
  emit('update:selectedCategory', val)
})

function onDetailsChange(event) {
  emit('update:details', event.target.value)
}
</script>
