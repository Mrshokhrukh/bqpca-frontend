<template>
  <div>
    <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
      <h3 class="text-lg font-semibold text-gray-900">Application Details</h3>
      <p class="mt-1 text-sm text-gray-500">Provide information about your CPD application.</p>
    </div>

    <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="col-span-1">
        <label class="block text-sm font-medium text-gray-700"
          >Is CPD approved? <span class="text-red-500">*</span></label
        >
        <div class="mt-1 flex items-center">
          <div class="mr-4">
            <input
              type="radio"
              id="approvedYes"
              value="true"
              name="isApproved"
              v-model="formData.isApproved"
              class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label for="approvedYes" class="ml-2 block text-sm text-gray-700">Yes</label>
          </div>
          <div>
            <input
              type="radio"
              id="approvedNo"
              value="false"
              name="isApproved"
              v-model="formData.isApproved"
              class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label for="approvedNo" class="ml-2 block text-sm text-gray-700">No</label>
          </div>
        </div>
      </div>

      <div v-if="formData.isApproved === 'true'" class="col-span-1">
        <label for="approvalLetter" class="block text-sm font-medium text-gray-700"
          >Attach Approval Letter <span class="text-red-500">*</span></label
        >
        <input
          type="file"
          id="approvalLetter"
          @change="handleApprovalLetterUpload"
          class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p class="text-xs text-gray-500 mt-1">Accepted file format: PDF (max 5MB)</p>
      </div>

      <template v-if="formData.isApproved === 'false'">
        <div class="col-span-1">
          <label for="title" class="block text-sm font-medium text-gray-700"
            >Title of CPD <span class="text-red-500">*</span></label
          >
          <input
            type="text"
            id="title"
            v-model="formData.title"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
          />
        </div>

        <div class="col-span-1">
          <label for="venue" class="block text-sm font-medium text-gray-700"
            >Venue <span class="text-red-500">*</span></label
          >
          <input
            type="text"
            id="venue"
            v-model="formData.venue"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
          />
        </div>

        <div class="col-span-1">
          <label for="fromDate" class="block text-sm font-medium text-gray-700"
            >From Date <span class="text-red-500">*</span></label
          >
          <input
            type="date"
            id="fromDate"
            v-model="formData.fromDate"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
          />
        </div>

        <div class="col-span-1">
          <label for="toDate" class="block text-sm font-medium text-gray-700"
            >To Date <span class="text-red-500">*</span></label
          >
          <input
            type="date"
            id="toDate"
            v-model="formData.toDate"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps({
  // The application object passed down from the parent
  application: Object,
  // Function to handle approval letter upload (passed from parent)
  handleApprovalLetterUpload: Function,
})

// Define the custom event this component can emit
const emit = defineEmits(['update:modelValue'])

// Create internal reactive state initialized with the prop value
const formData = ref({ ...props.application })

// Watch for changes in the internal formData and emit the updated value
watch(
  formData,
  (newValue) => {
    emit('update:modelValue', newValue)
  },
  { deep: true },
) // Use deep: true to watch for nested changes

// Optional: Watch for changes in the prop and update internal state
// This is useful if the parent updates the 'application' prop externally
watch(
  () => props.application,
  (newValue) => {
    formData.value = { ...newValue }
  },
  { deep: true },
)
</script>
