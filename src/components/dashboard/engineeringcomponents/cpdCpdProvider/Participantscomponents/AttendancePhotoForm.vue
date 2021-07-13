<template>
  <div class="space-y-6">
    <div class="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
      <h3 class="font-medium text-blue-700 flex items-center mb-2">
        <InformationCircleIcon class="h-5 w-5 mr-2" />
        Attendance Photo Upload
      </h3>
      <p class="text-sm text-blue-600">
        Upload photos as evidence of attendance for CPD task participants. You can upload a single
        photo that will be attached to the selected CPD task as attendance sheet attachment.
      </p>
    </div>

    <div class="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-sm transition">
      <h2 class="text-lg font-semibold text-gray-700 pb-3 border-b border-gray-200 mb-4">
        Upload Attendance Photo
      </h2>

      <div class="space-y-6">
        <div>
          <label for="photoCpdTask" class="block text-sm font-medium text-gray-700 mb-2">
            CPD Task <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <select
              id="photoCpdTask"
              v-model="formData.cpdTask"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none pr-10"
              :disabled="isSubmitting"
              aria-required="true"
              aria-label="CPD Task"
            >
              <option value="">Select a CPD task</option>
              <option v-for="task in processedCpdTasks" :key="task.id" :value="task.id">
                {{ task.title }} - {{ formatDateRange(task.from_date, task.to_date) }}
              </option>
              <option v-if="processedCpdTasks.length === 0" disabled>No CPD tasks available</option>
            </select>
            <MagnifyingGlassIcon
              class="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none"
            />
          </div>
          <p class="mt-1 text-sm text-gray-500">
            Select the CPD task this photo is associated with
          </p>
        </div>

        <!-- Current Attachment Display -->
        <div
          v-if="selectedTaskDetails && selectedTaskDetails.attendance_sheet_attachment"
          class="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
        >
          <h4 class="text-sm font-medium text-yellow-700 mb-2">Current Attendance Sheet:</h4>
          <div class="flex items-center space-x-2">
            <DocumentIcon class="h-5 w-5 text-yellow-600" />
            <a
              :href="selectedTaskDetails.attendance_sheet_attachment"
              target="_blank"
              class="text-sm text-yellow-700 hover:text-yellow-800 underline"
            >
              View Current Attachment
            </a>
          </div>
          <p class="text-xs text-yellow-600 mt-1">
            Uploading a new photo will replace the current attachment.
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Attendance Photo <span class="text-red-500">*</span>
          </label>
          <div
            class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg"
            :class="{
              'border-blue-300 bg-blue-50': photoFile,
              'bg-gray-100 cursor-not-allowed': isSubmitting,
            }"
            @dragover.prevent="handleDragOver"
            @dragleave.prevent="handleDragLeave"
            @drop.prevent="handleDrop"
          >
            <div class="space-y-1 text-center">
              <div v-if="photoPreview" class="mx-auto h-48 w-auto mb-3">
                <img
                  :src="photoPreview"
                  alt="Attendance preview"
                  class="h-full mx-auto object-cover rounded-lg shadow-md"
                />
              </div>
              <CameraIcon
                v-else
                class="mx-auto h-12 w-12 text-gray-400"
                :class="{ 'text-blue-500': photoFile }"
              />
              <div class="flex text-sm text-gray-600">
                <label
                  for="photo-upload"
                  class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  :class="{ '!text-gray-400 !cursor-not-allowed': isSubmitting }"
                >
                  <span v-if="!photoFile">Upload attendance photo</span>
                  <span v-else class="text-blue-700">{{ photoFile.name }}</span>
                  <input
                    id="photo-upload"
                    name="photo-upload"
                    type="file"
                    class="sr-only"
                    accept="image/*"
                    @change="handlePhotoUpload"
                    :disabled="isSubmitting"
                  />
                </label>
                <p v-if="!photoFile && !isSubmitting" class="pl-1">or drag and drop</p>
                <p v-if="isSubmitting" class="pl-1 text-gray-500">Processing...</p>
              </div>
              <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          <div v-if="photoError" class="mt-1 text-sm text-red-600">
            {{ photoError }}
          </div>
          <div v-if="photoFile && !isSubmitting" class="mt-2 flex justify-end">
            <button
              @click="removePhoto"
              class="text-sm text-red-500 hover:text-red-700 flex items-center"
            >
              <TrashIcon class="h-4 w-4 mr-1" />
              Remove
            </button>
          </div>
        </div>

        <div>
          <label for="photoDescription" class="block text-sm font-medium text-gray-700 mb-2">
            Photo Description <span class="text-gray-500 text-xs italic">(Optional)</span>
          </label>
          <textarea
            id="photoDescription"
            v-model="formData.description"
            rows="3"
            :disabled="isSubmitting"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Add a description for this photo (e.g., 'Group photo of Workshop participants, March 12, 2025')"
            aria-label="Photo Description"
          ></textarea>
          <p class="mt-1 text-sm text-gray-500">
            Provide context or details about this attendance photo
          </p>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <FormActions
      submitLabel="Upload Photo"
      :disabled="!isFormValid || isSubmitting"
      :is-submitting="isSubmitting"
      @submit="submitForm"
      @reset="resetForm"
      @cancel="$emit('cancel')"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import {
  MagnifyingGlassIcon,
  CameraIcon,
  TrashIcon,
  InformationCircleIcon,
  DocumentIcon,
} from '@heroicons/vue/24/outline'
import FormActions from './FormActions.vue'
import apiService from '@/services/services'
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
  isSubmitting: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel'])

const formData = reactive({
  cpdTask: '',
  description: '',
})

const photoFile = ref(null)
const photoPreview = ref('')
const photoError = ref('')
const isDragging = ref(false)
const selectedTaskDetails = ref(null)

// FIXED: Process CPD tasks using correct field names
const processedCpdTasks = computed(() => {
  if (!props.cpdTasks || props.cpdTasks.length === 0) {
    return []
  }

  return props.cpdTasks
    .filter((task) => {
      const isApproved = task.is_cpd_approved === true

      if (props.currentProviderCid) {
        const belongsToProvider =
          String(task.cid_no).trim() === String(props.currentProviderCid).trim()
        return isApproved && belongsToProvider
      }
      return isApproved
    })
    .map((task) => ({
      id: task.id,
      title: task.title || task.title_of_cpd || 'Untitled Task',
      from_date: task.from_date || task.start_date,
      to_date: task.to_date || task.end_date,
      attendance_sheet_attachment: task.attendance_sheet_attachment,
    }))
    .sort((a, b) => (a.title || '').localeCompare(b.title || ''))
})

const isFormValid = computed(() => {
  return formData.cpdTask && photoFile.value && !photoError.value
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

// Watch for CPD task selection to fetch details
watch(
  () => formData.cpdTask,
  async (newTaskId) => {
    selectedTaskDetails.value = null
    if (newTaskId) {
      try {
        const response = await apiService.getEpcCpdTask(newTaskId)
        selectedTaskDetails.value = response.data
      } catch (error) {
        console.error('Error fetching CPD task details:', error)
        toast.error('Failed to load task details')
      }
    }
  },
)

function validateFile(file) {
  photoError.value = ''

  if (!file.type.startsWith('image/')) {
    photoError.value = 'Please upload a valid image file (PNG, JPG, GIF).'
    return false
  }

  if (file.size > 10 * 1024 * 1024) {
    // 10MB
    photoError.value = 'File size exceeds 10MB limit.'
    return false
  }

  return true
}

function processPhotoFile(file) {
  if (props.isSubmitting) return

  if (file && validateFile(file)) {
    photoFile.value = file

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  } else if (file) {
    // Clear the input if validation failed
    const input = document.getElementById('photo-upload')
    if (input) input.value = ''
  }
}

function handlePhotoUpload(event) {
  if (props.isSubmitting) return
  const file = event.target.files[0]
  processPhotoFile(file)
}

function handleDragOver(event) {
  if (props.isSubmitting) return
  event.preventDefault()
  isDragging.value = true
}

function handleDragLeave(event) {
  if (props.isSubmitting) return
  event.preventDefault()
  isDragging.value = false
}

function handleDrop(event) {
  if (props.isSubmitting) return
  event.preventDefault()
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  processPhotoFile(file)

  // Update file input
  const input = document.getElementById('photo-upload')
  if (input && file && !photoError.value) {
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)
    input.files = dataTransfer.files
  } else if (input) {
    input.value = ''
  }
}

function removePhoto() {
  if (props.isSubmitting) return
  photoFile.value = null
  photoPreview.value = ''
  photoError.value = ''

  const input = document.getElementById('photo-upload')
  if (input) input.value = ''
}

function submitForm() {
  if (!isFormValid.value || props.isSubmitting) return

  emit('submit', {
    cpdTask: parseInt(formData.cpdTask), // Ensure it's a number
    photo: photoFile.value,
    description: formData.description,
  })
}

function resetForm(clearSelection = true) {
  if (clearSelection) {
    formData.cpdTask = ''
  }
  formData.description = ''
  removePhoto()
  selectedTaskDetails.value = null
}

// Expose resetForm method to parent component
defineExpose({
  resetForm,
})
</script>
