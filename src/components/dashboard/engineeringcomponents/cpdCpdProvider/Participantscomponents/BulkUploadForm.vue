<template>
  <div class="space-y-6">
    <div class="bg-green-50 rounded-lg p-4 border border-green-200 mb-6">
      <h3 class="font-medium text-green-700 flex items-center mb-2">
        <InformationCircleIcon class="h-5 w-5 mr-2" />
        Bulk Upload Instructions
      </h3>
      <p class="text-sm text-green-600">
        Upload a CSV file with participant details. The file should include columns for:
        <strong>participant_reg_no</strong>.
      </p>
      <ul class="list-disc list-inside text-sm text-green-600 mt-1 pl-2">
        <li>
          <code>participant_reg_no</code>: The registration number of the participant (from
          Application model).
        </li>
        <li>
          <code>review_status</code>: Optional. Can be 'Approved', 'Regretted', or 'Pending'.
          Defaults to 'Pending'.
        </li>
        <li>
          <code>endorsement_decision</code>: Optional. Can be 'Approved', 'Regretted', or 'Pending'.
          Defaults to 'Pending'.
        </li>
      </ul>
      <a
        href="#"
        @click.prevent="downloadTemplate"
        class="text-sm text-green-700 underline mt-2 inline-block"
      >
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
              :disabled="props.isProcessingUpload || loading"
              aria-required="true"
              aria-label="CPD Task"
            >
              <option value="">Select an approved CPD task</option>
              <option v-if="filteredCpdTasks.length === 0 && !loading" disabled>
                No approved CPD tasks available
              </option>
              <option v-for="task in filteredCpdTasks" :key="task.id" :value="task.id">
                {{ task.title_of_cpd }} ({{ formatDateRange(task.from_date, task.to_date) }})
              </option>
            </select>
            <MagnifyingGlassIcon
              class="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none"
            />
          </div>
          <div v-if="loading" class="mt-2 text-sm text-gray-600">Loading CPD tasks...</div>
          <div v-if="taskError" class="mt-2 text-sm text-red-600">
            {{ taskError }}
          </div>
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
              'bg-gray-100 cursor-not-allowed': props.isProcessingUpload,
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
                  :class="{ '!text-gray-400 !cursor-not-allowed': props.isProcessingUpload }"
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import {
  MagnifyingGlassIcon,
  DocumentIcon,
  TrashIcon,
  InformationCircleIcon,
} from '@heroicons/vue/24/outline'
import FormActions from './FormActions.vue'
import apiServices from '@/services/services'
import { useToast } from 'vue-toastification'

const toast = useToast()

const props = defineProps({
  cpdTasks: {
    type: Array,
    default: () => [],
  },
  currentProviderCid: {
    type: String,
    default: null,
  },
  isProcessingUpload: {
    type: Boolean,
    default: false,
  },
  preselectedTaskId: {
    type: [String, Number],
    default: null,
  },
})

const emit = defineEmits(['submit', 'cancel'])

const formData = reactive({
  cpdTask: '',
})

const csvFile = ref(null)
const csvFileInput = ref(null)
const fileError = ref('')
const isDragging = ref(false)
const localCpdTasks = ref([])
const loading = ref(false)
const taskError = ref('')

const filteredCpdTasks = computed(() => {
  const tasks = localCpdTasks.value.length > 0 ? localCpdTasks.value : props.cpdTasks
  if (!props.currentProviderCid || !tasks || tasks.length === 0) {
    return []
  }
  return tasks.filter((task) => {
    const isApproved =
      task.application_status === 'APPROVED' ||
      String(task.application_status).toUpperCase() === 'APPROVED'
    const belongsToProvider = String(task.cid_no).trim() === String(props.currentProviderCid).trim()
    return isApproved && belongsToProvider
  })
})

const isFormValid = computed(() => {
  return formData.cpdTask && csvFile.value && !fileError.value
})

const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return 'N/A'
  try {
    const start = new Date(startDate).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    const end = new Date(endDate).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    return `${start} to ${end}`
  } catch (err) {
    console.error('Error formatting date range:', err)
    return `${startDate} to ${endDate}`
  }
}

const fetchCpdTasks = async () => {
  try {
    loading.value = true
    taskError.value = ''
    const response = await apiServices.getMhpcCpdTask()
    if (response.data && Array.isArray(response.data.results)) {
      localCpdTasks.value = response.data.results
      if (localCpdTasks.value.length === 0) {
        taskError.value = 'No approved CPD tasks found for your account.'
      }
    } else {
      localCpdTasks.value = []
      taskError.value = 'No CPD tasks data received from server.'
    }
  } catch (err) {
    console.error('Error fetching CPD tasks:', err)
    localCpdTasks.value = []
    taskError.value = err.message || 'Failed to load CPD tasks. Please try again.'
    toast.error(taskError.value)
  } finally {
    loading.value = false
  }
}

function processFile(file) {
  if (props.isProcessingUpload) return
  fileError.value = ''
  if (file) {
    if (file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')) {
      if (file.size > 10 * 1024 * 1024) {
        fileError.value = 'File size exceeds 10MB limit.'
        csvFile.value = null
        if (csvFileInput.value) csvFileInput.value.value = ''
      } else {
        csvFile.value = file
      }
    } else {
      fileError.value = 'Invalid file type. Please upload a CSV file.'
      csvFile.value = null
      if (csvFileInput.value) csvFileInput.value.value = ''
    }
  }
}

function handleCSVInputChange(event) {
  if (props.isProcessingUpload) return
  const file = event.target.files[0]
  processFile(file)
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
  const file = event.dataTransfer.files[0]
  processFile(file)
  if (csvFileInput.value && file) {
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)
    csvFileInput.value.files = dataTransfer.files
  } else if (csvFileInput.value) {
    csvFileInput.value.value = ''
  }
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
  if (!isFormValid.value || props.isProcessingUpload) return
  fileError.value = ''
  emit('submit', {
    cpdTask: formData.cpdTask,
    file: csvFile.value,
  })
  toast.success('Participants CSV submitted successfully.')
}

function resetForm() {
  formData.cpdTask = props.preselectedTaskId || ''
  removeCsvFile()
  fileError.value = ''
}

function downloadTemplate() {
  try {
    const csvContent = [
      '# Note: Ensure participant_reg_no values are unique for the selected CPD task',
      'participant_reg_no,review_status(optional),endorsement_decision(optional)',
      'MM/Orth-000005,Pending(optional),Pending(optional)',
      'MM/Orth-000006,Approved(optional),Approved(optional)',
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'participant_bulk_upload_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success('CSV template downloaded successfully.');
  } catch (err) {
    console.error('Error downloading CSV template:', err);
    toast.error('Failed to download CSV template. Please try again.');
  }
}

onMounted(() => {
  console.log('Props received:', {
    cpdTasks: props.cpdTasks,
    currentProviderCid: props.currentProviderCid,
    preselectedTaskId: props.preselectedTaskId,
  })
  if (!props.cpdTasks || props.cpdTasks.length === 0) {
    fetchCpdTasks()
  }
  if (
    props.preselectedTaskId &&
    filteredCpdTasks.value.some((task) => String(task.id) === String(props.preselectedTaskId))
  ) {
    formData.cpdTask = props.preselectedTaskId
  }
})

watch(
  () => props.preselectedTaskId,
  (newId) => {
    if (newId && filteredCpdTasks.value.some((task) => String(task.id) === String(newId))) {
      formData.cpdTask = newId
    }
  }
)

defineExpose({ resetForm })
</script>
