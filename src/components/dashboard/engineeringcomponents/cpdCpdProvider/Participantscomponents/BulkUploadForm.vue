<!-- BulkUploadForm.vue -->
<template>
  <div class="space-y-6">
    <div class="bg-green-50 rounded-lg p-4 border border-green-200 mb-6">
      <h3 class="font-medium text-green-700 flex items-center mb-2">
        <InformationCircleIcon class="h-5 w-5 mr-2" />
        Upload Instructions
      </h3>
      <p class="text-sm text-green-600">
        Upload a CSV file containing a single column with the header:
        <strong>participant_reg_no</strong>.
      </p>
      <ul class="list-disc list-inside text-sm text-green-600 mt-1 pl-2">
        <li>
          Each row should contain one participant's registration number.
        </li>
        <li>The file will be checked for internal duplicates before upload.</li>
      </ul>
      <a href="#" @click.prevent="downloadTemplate" class="text-sm text-green-700 underline mt-2 inline-block">
        Download Simple CSV Template
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
            <select id="bulkCpdTask" v-model="formData.cpdTask"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none pr-10"
              :disabled="props.isProcessingUpload" aria-required="true" aria-label="CPD Task">
              <option value="">Select an approved CPD task</option>
              <option v-if="processedCpdTasks.length === 0" disabled>
                No approved CPD tasks available
              </option>
              <option v-for="task in processedCpdTasks" :key="task.id" :value="task.id">
                {{ task.title }} ({{ formatDateRange(task.from_date, task.to_date) }})
              </option>
            </select>
            <MagnifyingGlassIcon class="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
          <p class="mt-1 text-sm text-gray-500">
            Select the single CPD task all participants in the file will be added to.
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Participants CSV File <span class="text-red-500">*</span>
          </label>
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg" :class="{
            'border-green-400 bg-green-50': csvFile && !props.isProcessingUpload,
            'border-red-400 bg-red-50': fileError,
            'border-blue-400': isDragging && !props.isProcessingUpload,
            'bg-gray-100 cursor-not-allowed': props.isProcessingUpload,
          }" @dragover.prevent="handleDragOver" @dragleave.prevent="handleDragLeave" @drop.prevent="handleDrop">
            <div class="space-y-1 text-center">
              <DocumentIcon class="mx-auto h-12 w-12 text-gray-400"
                :class="{ 'text-green-500': csvFile, 'text-red-500': fileError }" />
              <div class="flex text-sm text-gray-600">
                <label for="csv-upload"
                  class="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                  :class="{ '!text-gray-400 !cursor-not-allowed': props.isProcessingUpload }">
                  <span v-if="!csvFile && !fileError">Upload a CSV file</span>
                  <span v-else-if="csvFile" class="text-green-700">{{ csvFile.name }}</span>
                  <span v-else class="text-red-700">Upload failed. Try again.</span>
                  <input id="csv-upload" name="csv-upload" type="file" class="sr-only" accept=".csv, text/csv"
                    @change="handleCSVInputChange" ref="csvFileInput" :disabled="props.isProcessingUpload" />
                </label>
                <p v-if="!csvFile && !props.isProcessingUpload && !fileError" class="pl-1">or drag and drop</p>
                <p v-if="props.isProcessingUpload" class="pl-1 text-gray-500">Processing...</p>
              </div>
              <p class="text-xs text-gray-500">CSV up to 10MB</p>
            </div>
          </div>
          <div v-if="fileError" class="mt-1 text-sm text-red-600">
            {{ fileError }}
          </div>
          <div v-if="csvFile && !props.isProcessingUpload" class="mt-2 flex justify-end">
            <button @click="removeCsvFile" class="text-sm text-red-500 hover:text-red-700 flex items-center">
              <TrashIcon class="h-4 w-4 mr-1" />
              Remove File
            </button>
          </div>
        </div>
      </div>
    </div>

    <FormActions submitLabel="Upload Participants" :disabled="!isFormValid || props.isProcessingUpload"
      :is-submitting="props.isProcessingUpload" @submit="submitForm" @reset="resetForm" @cancel="$emit('cancel')" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import {
  MagnifyingGlassIcon,
  DocumentIcon,
  TrashIcon,
  InformationCircleIcon,
} from '@heroicons/vue/24/outline'
import FormActions from './FormActions.vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

const props = defineProps({
  cpdTasks: { type: Array, default: () => [] },
  currentProviderCid: { type: String, default: null },
  isProcessingUpload: { type: Boolean, default: false },
  preselectedTaskId: { type: [String, Number], default: null },
})

const emit = defineEmits(['submit', 'cancel'])

const formData = reactive({ cpdTask: '' })
const csvFile = ref(null)
const csvFileInput = ref(null)
const fileError = ref('')
const isDragging = ref(false)

const processedCpdTasks = computed(() => {
  if (!props.cpdTasks || props.cpdTasks.length === 0) return []
  return props.cpdTasks.map(task => ({
    id: task.id,
    title: task.title || task.title_of_cpd || 'Untitled Task',
    from_date: task.from_date || task.start_date,
    to_date: task.to_date || task.end_date
  })).sort((a, b) => (a.title || '').localeCompare(b.title || ''))
})

const isFormValid = computed(() => formData.cpdTask && csvFile.value && !fileError.value)


const validateCsvContent = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const rows = text.split(/\r?\n/).map(row => row.trim()).filter(row => row);

        if (rows.length < 2) {
          return reject('CSV file must contain a header and at least one participant row.');
        }

        const header = rows[0].toLowerCase().trim();
        if (header !== 'participant_reg_no') {
          return reject('Invalid CSV header. The header must be "participant_reg_no".');
        }

        const regNumbers = rows.slice(1);
        const seen = new Set();
        const duplicates = new Set();

        for (const num of regNumbers) {
          const trimmedNum = num.trim();
          if (trimmedNum) { // Ignore empty lines between data
            if (seen.has(trimmedNum)) {
              duplicates.add(trimmedNum);
            } else {
              seen.add(trimmedNum);
            }
          }
        }

        if (duplicates.size > 0) {
          return reject(`Duplicate registration numbers found in the file: ${[...duplicates].join(', ')}.`);
        }

        if (seen.size === 0) {
          return reject('No participant registration numbers found in the file.');
        }

        resolve();
      } catch (e) {
        reject('An unexpected error occurred while parsing the file.');
      }
    };

    reader.onerror = () => {
      reject('Failed to read the file.');
    };

    reader.readAsText(file);
  });
};


async function processFile(file) {
  if (props.isProcessingUpload) return

  fileError.value = ''
  csvFile.value = null
  if (csvFileInput.value) csvFileInput.value.value = ''

  if (!file) return;

  if (!file.type.includes('csv') && !file.name.toLowerCase().endsWith('.csv')) {
    fileError.value = 'Invalid file type. Please upload a CSV file.'
    return;
  }

  if (file.size > 10 * 1024 * 1024) { // 10MB
    fileError.value = 'File size exceeds 10MB limit.'
    return;
  }

  try {
    await validateCsvContent(file);
    csvFile.value = file;
    toast.success("CSV file is valid and ready for upload.");
  } catch (error) {

    fileError.value = error;
    toast.error(error);
  }
}

function handleCSVInputChange(event) {
  const file = event.target.files ? event.target.files[0] : null;
  processFile(file);
}

function handleDragOver(event) {
  if (props.isProcessingUpload) return
  event.preventDefault()
  isDragging.value = true
}

function handleDragLeave(event) {
  if (props.isProcessingUpload) return
  event.preventDefault()
  isDragging.value = false
}

function handleDrop(event) {
  if (props.isProcessingUpload) return
  event.preventDefault()
  isDragging.value = false
  const file = event.dataTransfer.files ? event.dataTransfer.files[0] : null;

  if (file) {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    if (csvFileInput.value) {
      csvFileInput.value.files = dataTransfer.files;
    }
  }

  processFile(file)
}

function removeCsvFile() {
  if (props.isProcessingUpload) return
  csvFile.value = null
  fileError.value = ''
  if (csvFileInput.value) {
    csvFileInput.value.value = ''
  }
}

function submitForm() {
  if (!isFormValid.value || props.isProcessingUpload) {
    if (!isFormValid.value) {
      toast.warning("Please select a task and a valid CSV file.");
    }
    return;
  }
  emit('submit', { cpdTask: parseInt(formData.cpdTask), file: csvFile.value })
}

function resetForm(clearSelection = true) {
  if (clearSelection) formData.cpdTask = props.preselectedTaskId || ''
  removeCsvFile()
}

function downloadTemplate() {
  try {
    const csvContent = [
      'participant_reg_no',
      'CE(P)/2025/0001',
      'CE(P)/2025/0002',
      'CE(T)/2024/0155',
      'CE(T)/2023/0098',
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'participant_upload_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success('Simple CSV template downloaded successfully.');
  } catch (err) {
    console.error('Error downloading CSV template:', err);
    toast.error('Failed to download CSV template.');
  }
}

const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return 'N/A'
  try {
    const start = new Date(startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    const end = new Date(endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    return `${start} to ${end}`
  } catch (err) {
    return `${startDate} to ${endDate}`
  }
}

onMounted(() => {
  if (props.preselectedTaskId) formData.cpdTask = props.preselectedTaskId
})

watch(() => props.preselectedTaskId, (newId) => { if (newId) formData.cpdTask = newId })

watch(() => props.cpdTasks, (newTasks) => {
  if (formData.cpdTask && !newTasks.some(task => String(task.id) === String(formData.cpdTask))) {
    formData.cpdTask = props.preselectedTaskId || ''
  }
});

defineExpose({ resetForm })
</script>
