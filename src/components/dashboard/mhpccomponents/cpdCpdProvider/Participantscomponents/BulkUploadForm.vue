<template>
  <div class="space-y-6">
    <div class="bg-green-50 rounded-lg p-4 border border-green-200 mb-6">
      <h3 class="font-medium text-green-700 flex items-center mb-2">
        <InformationCircleIcon class="h-5 w-5 mr-2" />
        Bulk Upload Instructions
      </h3>
      <p class="text-sm text-green-600">
        Upload a CSV file with participant details. The file should include columns for:
        participant_reg_no, cpd_credits, review_status, and endorsement_decision.
      </p>
      <a href="#" class="text-sm text-green-700 underline mt-2 inline-block">
        Download CSV template
      </a>
    </div>

    <div class="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-sm transition">
      <h2 class="text-lg font-semibold text-gray-700 pb-3 border-b border-gray-200 mb-4">
        Upload Participants CSV
      </h2>

      <div class="space-y-6">
        <div>
          <label for="bulkCpdTask" class="block text-sm font-medium text-gray-700 mb-2">
            CPD Task <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <select
              id="bulkCpdTask"
              v-model="formData.cpdTask"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none pr-10"
              aria-required="true"
              aria-label="CPD Task"
            >
              <option value="">Select a CPD task</option>
              <option v-for="task in cpdTasks" :key="task.id" :value="task.id">
                {{ task.title }}
              </option>
            </select>
            <MagnifyingGlassIcon
              class="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none"
            />
          </div>
          <p class="mt-1 text-sm text-gray-500">
            Select the CPD task for all participants in this upload
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Participants CSV File <span class="text-red-500">*</span>
          </label>
          <div
            class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg"
            :class="{ 'border-green-300 bg-green-50': csvFile }"
          >
            <div class="space-y-1 text-center">
              <DocumentIcon
                class="mx-auto h-12 w-12 text-gray-400"
                :class="{ 'text-green-500': csvFile }"
              />
              <div class="flex text-sm text-gray-600">
                <label
                  for="csv-upload"
                  class="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                >
                  <span v-if="!csvFile">Upload a CSV file</span>
                  <span v-else>{{ csvFile.name }}</span>
                  <input
                    id="csv-upload"
                    name="csv-upload"
                    type="file"
                    class="sr-only"
                    accept=".csv"
                    @change="handleCSVUpload"
                  />
                </label>
                <p v-if="!csvFile" class="pl-1">or drag and drop</p>
              </div>
              <p class="text-xs text-gray-500">CSV up to 10MB</p>
            </div>
          </div>
          <div v-if="csvFile" class="mt-2 flex justify-end">
            <button
              @click="csvFile = null"
              class="text-sm text-red-500 hover:text-red-700 flex items-center"
            >
              <TrashIcon class="h-4 w-4 mr-1" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <FormActions
      submitLabel="Upload Participants"
      :disabled="!isFormValid"
      @submit="submitForm"
      @reset="resetForm"
      @cancel="$emit('cancel')"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import {
  MagnifyingGlassIcon,
  DocumentIcon,
  TrashIcon,
  InformationCircleIcon,
} from '@heroicons/vue/24/outline'
import FormActions from './FormActions.vue'

defineProps({
  cpdTasks: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['submit', 'cancel'])

const formData = reactive({
  cpdTask: '',
})

const csvFile = ref(null)

const isFormValid = computed(() => {
  return formData.cpdTask && csvFile.value
})

function handleCSVUpload(event) {
  const file = event.target.files[0]
  if (file && file.type === 'text/csv') {
    csvFile.value = file
  } else {
    alert('Please upload a valid CSV file.')
    event.target.value = ''
  }
}

function submitForm() {
  if (!isFormValid.value) return

  emit('submit', {
    cpdTask: formData.cpdTask,
    file: csvFile.value,
  })
}

function resetForm() {
  formData.cpdTask = ''
  csvFile.value = null
}
</script>
