<template>
  <div class="space-y-8">
    <div class="bg-slate-100/80 rounded-xl p-5 border border-slate-200">
      <h3 class="font-semibold text-slate-800 flex items-center mb-3 text-lg">
        <InformationCircleIcon class="h-6 w-6 mr-2.5 text-slate-500" />
        Bulk Upload Instructions
      </h3>
      <div class="pl-[42px] text-slate-600 space-y-2 text-sm">
        <p>
          Upload a CSV file containing participant registration numbers. The file must include a
          header row with the column: <strong>participant_reg_no</strong>.
        </p>
        <ul class="list-disc list-inside space-y-1 pt-1">
          <li>
            <code class="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-xs font-mono"
              >participant_reg_no</code
            >: The official registration number for each participant.
          </li>
          <li>
            <code class="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-xs font-mono"
              >review_status</code
            >
            (Optional): Can be 'Approved', 'Regretted', or 'Pending'.
          </li>
          <li>
            <code class="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-xs font-mono"
              >endorsement_decision</code
            >
            (Optional): Can be 'Approved', 'Regretted', or 'Pending'.
          </li>
        </ul>
        <div class="pt-2">
          <a
            href="#"
            @click.prevent="downloadTemplate"
            class="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center"
          >
            <ArrowDownTrayIcon class="h-4 w-4 mr-1.5" />
            Download CSV Template
          </a>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-xl border border-gray-100/80">
      <div class="p-6 md:p-8">
        <h2 class="text-xl font-bold text-gray-800 pb-4 border-b border-gray-200 mb-6">
          Upload Participants CSV
        </h2>

        <div class="space-y-8">
          <div>
            <label for="bulkCpdTask" class="block text-sm font-medium text-gray-700 mb-1.5">
              CPD Task <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <select
                id="bulkCpdTask"
                v-model="formData.cpdTask"
                class="w-full appearance-none pl-4 pr-10 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                :disabled="props.isProcessingUpload || loading"
                aria-required="true"
              >
                <option value="" disabled>Select an approved CPD task...</option>
                <option v-if="filteredCpdTasks.length === 0 && !loading" disabled>
                  No approved CPD tasks are available for you.
                </option>
                <option v-for="task in filteredCpdTasks" :key="task.id" :value="task.id">
                  {{ task.title_of_cpd }} ({{ formatDateRange(task.from_date, task.to_date) }})
                </option>
              </select>
              <ChevronDownIcon
                class="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
              />
            </div>
            <div v-if="loading" class="mt-2 text-sm text-gray-500 flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
              Loading available CPD tasks...
            </div>
            <div v-if="taskError" class="mt-2 text-sm text-red-600">
              {{ taskError }}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Participants CSV File <span class="text-red-500">*</span>
            </label>
            <div
              class="relative mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 border-dashed rounded-xl transition-all duration-300"
              :class="{
                'border-blue-500 bg-blue-50/50': isDragging,
                'bg-gray-50 cursor-not-allowed opacity-70': props.isProcessingUpload,
              }"
              @dragover.prevent="handleDragOver"
              @dragleave.prevent="handleDragLeave"
              @drop.prevent="handleDrop"
            >
              <div v-if="!csvFile" class="space-y-2 text-center">
                <ArrowUpTrayIcon class="mx-auto h-10 w-10 text-gray-400" />
                <div class="flex text-sm text-gray-600">
                  <label
                    for="csv-upload"
                    class="relative cursor-pointer rounded-md font-semibold text-blue-600 hover:text-blue-700 focus-within:outline-none"
                    :class="{ '!text-gray-400 !cursor-not-allowed': props.isProcessingUpload }"
                  >
                    <span>Click to upload</span>
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
                  <p class="pl-1">or drag and drop</p>
                </div>
                <p class="text-xs text-gray-500">CSV file up to 10MB</p>
              </div>

              <div v-if="csvFile" class="text-center">
                <DocumentCheckIcon class="mx-auto h-12 w-12 text-green-500" />
                <p class="mt-2 font-medium text-gray-800">{{ csvFile.name }}</p>
                <p class="text-xs text-gray-500">{{ (csvFile.size / 1024).toFixed(2) }} KB</p>
                <button
                  v-if="!props.isProcessingUpload"
                  @click="removeCsvFile"
                  class="mt-4 text-sm text-red-600 hover:text-red-800 flex items-center mx-auto bg-red-100/60 hover:bg-red-100 px-3 py-1 rounded-md transition"
                >
                  <TrashIcon class="h-4 w-4 mr-1.5" />
                  Remove File
                </button>
              </div>
            </div>
            <div v-if="fileError" class="mt-2 text-sm font-medium text-red-600">
              {{ fileError }}
            </div>
          </div>
        </div>
      </div>

      <div class="bg-gray-50/70 px-6 py-4 rounded-b-2xl">
        <FormActions
          submitLabel="Upload Participants"
          :disabled="!isFormValid || props.isProcessingUpload"
          :isLoading="props.isProcessingUpload"
          @submit="submitForm"
          @reset="resetForm"
          @cancel="$emit('cancel')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import {
  ArrowUpTrayIcon,
  ChevronDownIcon,
  DocumentCheckIcon,
  TrashIcon,
  InformationCircleIcon,
  ArrowDownTrayIcon,
} from '@heroicons/vue/24/outline'
import FormActions from './FormActions.vue' // Assuming this component is styled appropriately
import apiServices from '@/services/services'
import { useToast } from 'vue-toastification'

// The rest of your script setup remains exactly the same.
// Make sure you import the new icons from heroicons.

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
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'participant_bulk_upload_template.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    toast.success('CSV template downloaded successfully.')
  } catch (err) {
    console.error('Error downloading CSV template:', err)
    toast.error('Failed to download CSV template. Please try again.')
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
