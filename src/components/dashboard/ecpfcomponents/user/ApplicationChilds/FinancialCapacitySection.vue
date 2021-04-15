<template>
  <section class="p-6 bg-white rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4 text-blue-700">Financial Capacity Details</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <div>
          <label for="financialStatement" class="block text-sm font-medium text-gray-700"
            >Financial Statement Upload <span class="text-red-500">*</span></label
          >
          <input
            type="file"
            id="financialStatement"
            @change="handleFileUpload($event, 'financialStatementFile')"
            required
            accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <span v-if="financialStatementFileName" class="text-xs text-gray-600 mt-1 block">
            Selected: {{ financialStatementFileName }}
          </span>
          <span v-else class="text-xs text-gray-500 mt-1 block">No file selected.</span>
        </div>
        <div>
          <label for="budgetPlan" class="block text-sm font-medium text-gray-700"
            >Budget Plan Upload <span class="text-red-500">*</span></label
          >
          <input
            type="file"
            id="budgetPlan"
            @change="handleFileUpload($event, 'budgetPlanFile')"
            required
            accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <span v-if="budgetPlanFileName" class="text-xs text-gray-600 mt-1 block">
            Selected: {{ budgetPlanFileName }}
          </span>
          <span v-else class="text-xs text-gray-500 mt-1 block">No file selected.</span>
        </div>
      </div>
      <div>
        <label for="sourceOfFunding" class="block text-sm font-medium text-gray-700"
          >Source of Funding <span class="text-red-500">*</span></label
        >
        <!-- Changed: Added @input handler -->
        <textarea
          id="sourceOfFunding"
          :value="financialData.sourceOfFunding"
          @input="
            $emit('update:financialData', {
              ...financialData,
              sourceOfFunding: $event.target.value,
            })
          "
          rows="8"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        ></textarea>
        <!-- End Change -->
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  financialData: {
    type: Object,
    required: true,
  },
  financialStatementFileName: {
    type: String,
    default: '',
  },
  budgetPlanFileName: {
    type: String,
    default: '',
  },
})

// Changed: Added 'update:financialData' to emits
const emit = defineEmits(['update:file', 'update:financialData'])
// End Change

const handleFileUpload = (event, fieldIdentifier) => {
  const file = event.target.files[0]
  emit('update:file', { file: file || null, field: fieldIdentifier })
  if (!file) {
    event.target.value = ''
  }
}
</script>
