<template>
  <div class="space-y-6">
    <!-- ... (instructions and CPD Task select are the same) ... -->
    <div class="bg-green-50 rounded-lg p-4 border border-green-200 mb-6">
      <h3 class="font-medium text-green-700 flex items-center mb-2">
        <InformationCircleIcon class="h-5 w-5 mr-2" />
        Bulk Upload Instructions
      </h3>
      <p class="text-sm text-green-600">
        Upload a CSV file with participant details. The file should include columns for:
        <strong>participant_reg_no, cpd_credits</strong>.
      </p>
      <ul class="list-disc list-inside text-sm text-green-600 mt-1 pl-2">
          <li><code>participant_reg_no</code>: The registration number of the participant (from Application model).</li>
          <li><code>cpd_credits</code>: Whole number for credits awarded.</li>
          <li><code>review_status</code>: Optional. Can be 'Approved', 'Regretted', or 'Pending'. Defaults to 'Pending'.</li>
          <li><code>endorsement_decision</code>: Optional. Can be 'Approved', 'Regretted', or 'Pending'. Defaults to 'Pending'.</li>
      </ul>
      <a href="#" @click.prevent="downloadTemplate" class="text-sm text-green-700 underline mt-2 inline-block">
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
              :disabled="props.isProcessingUpload"
              aria-required="true"
              aria-label="CPD Task"
            >
              <option value="">Select an approved CPD task</option>
              <option v-for="task in filteredCpdTasks" :key="task.id" :value="task.id">
                {{ task.title_of_cpd }} ({{ task.from_date }} to {{ task.to_date }})
              </option>
            </select>
            <MagnifyingGlassIcon
              class="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none"
            />
          </div>
          <!-- ... (CPD task messages are the same) ... -->
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Participants CSV File <span class="text-red-500">*</span>
          </label>
          <div
            class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg"
            :class="{
              'border-green-400 bg-green-50': csvFile && !props.isProcessingUpload,
              'border-blue-400': isDragging && !props.isProcessingUpload,
              'bg-gray-100 cursor-not-allowed': props.isProcessingUpload
            }"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            @drop.prevent="handleDrop"
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
                  :class="{'!text-gray-400 !cursor-not-allowed': props.isProcessingUpload}"
                >
                  <span v-if="!csvFile">Upload a CSV file</span>
                  <span v-else class="text-green-700">{{ csvFile.name }}</span>
                  <input
                    id="csv-upload"
                    name="csv-upload"
                    type="file"
                    class="sr-only"
                    accept=".csv, text/csv"
                    @change="handleCSVInputChange"
                    ref="csvFileInput"
                    :disabled="props.isProcessingUpload"
                  />
                </label>
                <p v-if="!csvFile && !props.isProcessingUpload" class="pl-1">or drag and drop</p>
                <p v-if="props.isProcessingUpload" class="pl-1 text-gray-500">Processing...</p>
              </div>
              <p class="text-xs text-gray-500">CSV up to 10MB</p>
            </div>
          </div>
          <div v-if="fileError" class="mt-1 text-sm text-red-600">
            {{ fileError }}
          </div>
          <div v-if="csvFile && !props.isProcessingUpload" class="mt-2 flex justify-end">
            <button
              @click="removeCsvFile"
              class="text-sm text-red-500 hover:text-red-700 flex items-center"
            >
              <TrashIcon class="h-4 w-4 mr-1" />
              Remove File
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <FormActions
      submitLabel="Upload Participants"
      :disabled="!isFormValid || props.isProcessingUpload"
      :isLoading="props.isProcessingUpload"
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

const props = defineProps({
  cpdTasks: {
    type: Array,
    default: () => [],
  },
  currentProviderCid: {
    type: String,
    default: null,
  },
  isProcessingUpload: { // New prop from parent
    type: Boolean,
    default: false,
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formData = reactive({
  cpdTask: '',
})

const csvFile = ref(null)
const csvFileInput = ref(null)
const fileError = ref('')
const isDragging = ref(false)
// const isSubmitting = ref(false) // This local state is no longer directly driving the button

const filteredCpdTasks = computed(() => {
  if (!props.currentProviderCid || !props.cpdTasks || props.cpdTasks.length === 0) {
    return []
  }
  return props.cpdTasks.filter(task => {
    const isApproved = task.application_status === 'APPROVED' || String(task.application_status) === 'APPROVED';
    const belongsToProvider = task.cid_no === props.currentProviderCid;
    return isApproved && belongsToProvider;
  });
})

const isFormValid = computed(() => {
  // The button's disabled state in FormActions will also consider props.isProcessingUpload
  return formData.cpdTask && csvFile.value && !fileError.value;
})

function processFile(file) {
  if (props.isProcessingUpload) return; // Don't process if parent is busy
  fileError.value = ''
  if (file) {
    if (file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        fileError.value = 'File size exceeds 10MB limit.'
        csvFile.value = null;
        if (csvFileInput.value) csvFileInput.value.value = '';
      } else {
        csvFile.value = file
      }
    } else {
      fileError.value = 'Invalid file type. Please upload a CSV file.'
      csvFile.value = null;
      if (csvFileInput.value) csvFileInput.value.value = '';
    }
  }
}

function handleCSVInputChange(event) {
  if (props.isProcessingUpload) return;
  const file = event.target.files[0]
  processFile(file)
}

function handleDragOver(event) {
  if (props.isProcessingUpload) return;
  event.preventDefault();
  isDragging.value = true;
}

function handleDragLeave(event) {
  if (props.isProcessingUpload) return;
  event.preventDefault();
  isDragging.value = false;
}

function handleDrop(event) {
  if (props.isProcessingUpload) return;
  event.preventDefault();
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  processFile(file);
  if (csvFileInput.value && file) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      csvFileInput.value.files = dataTransfer.files;
  } else if (csvFileInput.value) {
      csvFileInput.value.value = '';
  }
}

function removeCsvFile() {
  if (props.isProcessingUpload) return;
  csvFile.value = null
  fileError.value = ''
  if (csvFileInput.value) {
    csvFileInput.value.value = ''
  }
}

function submitForm() {
  // Basic validation check, actual disabling is handled by FormActions
  if (!isFormValid.value || props.isProcessingUpload) return

  fileError.value = ''; // Clear previous errors

  emit('submit', {
    cpdTask: formData.cpdTask,
    file: csvFile.value,
  })
  // Parent now controls the loading state (isProcessingUpload)
}

function resetForm() {
  formData.cpdTask = ''
  removeCsvFile()
  fileError.value = ''
  // Parent will set isProcessingUpload to false
}

function downloadTemplate() {
  const csvHeader = "participant_reg_no,cpd_credits,review_status,endorsement_decision";
  const csvExampleRow1 = "REG12345,10,Pending,Pending";
  const csvExampleRow2 = "REG67890,5,Approved,Approved";
  const csvContent = `${csvHeader}\n${csvExampleRow1}\n${csvExampleRow2}`;

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "participant_bulk_upload_template.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Expose resetForm if parent needs to call it (e.g., after successful submission)
defineExpose({ resetForm });
</script>
