<template>
  <div class="space-y-8">
    <div class="bg-slate-100/80 rounded-xl p-5 border border-slate-200">
      <h3 class="font-semibold text-slate-800 flex items-center mb-3 text-lg">
        <InformationCircleIcon class="h-6 w-6 mr-2.5 text-slate-500" />
        Attendance Photo Upload
      </h3>
      <p class="pl-[42px] text-slate-600 text-sm">
        Upload a single photo as evidence of attendance. This photo will be attached to the selected
        CPD task and can be used for reporting and verification.
      </p>
    </div>

    <div class="bg-white rounded-2xl shadow-xl border border-gray-100/80">
      <div class="p-6 md:p-8">
        <h2 class="text-xl font-bold text-gray-800 pb-4 border-b border-gray-200 mb-6">
          Upload Attendance Photo
        </h2>

        <div class="space-y-8">
          <div>
            <label for="photoCpdTask" class="block text-sm font-medium text-gray-700 mb-1.5">
              CPD Task <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <select
                id="photoCpdTask"
                v-model="formData.cpdTask"
                class="w-full appearance-none pl-4 pr-10 py-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                :disabled="isSubmitting"
                aria-required="true"
              >
                <option value="" disabled>Select an associated CPD task...</option>
                <option v-for="task in cpdTasks" :key="task.id" :value="task.id">
                  {{ task.title_of_cpd || task.title }}
                </option>
                <option v-if="cpdTasks.length === 0" disabled>No CPD tasks are available.</option>
              </select>
              <ChevronDownIcon
                class="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
              Attendance Photo <span class="text-red-500">*</span>
            </label>
            <div
              class="group relative mt-1 flex justify-center items-center px-6 py-10 border-2 border-gray-300 border-dashed rounded-xl transition-all duration-300"
              :class="{
                'border-blue-500 bg-blue-50/50': isDragging,
                'cursor-not-allowed opacity-70': isSubmitting,
              }"
              @dragover.prevent="handleDragOver"
              @dragleave.prevent="handleDragLeave"
              @drop.prevent="handleDrop"
            >
              <div
                v-if="photoPreview"
                class="absolute inset-0 h-full w-full overflow-hidden rounded-xl"
              >
                <img
                  :src="photoPreview"
                  alt="Attendance preview"
                  class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div class="absolute inset-0 bg-black/20"></div>
              </div>

              <div class="relative text-center z-10">
                <div v-if="!photoPreview">
                  <PhotoIcon class="mx-auto h-12 w-12 text-gray-400" />
                  <div class="mt-4 flex text-sm justify-center">
                    <label
                      for="photo-upload-input"
                      class="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-700 focus-within:outline-none"
                    >
                      <span>Upload a photo</span>
                    </label>
                    <p class="pl-1 text-gray-600">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
                <div v-else class="text-white">
                  <DocumentCheckIcon class="mx-auto h-12 w-12" />
                  <p class="mt-2 font-semibold text-lg">{{ photoFile?.name }}</p>
                  <p class="text-sm opacity-90">Image selected successfully</p>
                </div>
              </div>

              <button
                v-if="photoPreview && !isSubmitting"
                @click.prevent="removePhoto"
                type="button"
                class="absolute top-3 right-3 z-20 p-1.5 bg-white/70 text-gray-800 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-110"
                aria-label="Remove photo"
              >
                <XMarkIcon class="h-5 w-5" />
              </button>

              <input
                id="photo-upload-input"
                name="photo-upload-input"
                type="file"
                class="sr-only"
                accept="image/*"
                @change="handleFileSelect"
                :disabled="isSubmitting"
                ref="photoInputRef"
              />
            </div>
            <div v-if="photoError" class="mt-2 text-sm font-medium text-red-600">
              {{ photoError }}
            </div>
          </div>

          <div>
            <label for="photoDescription" class="block text-sm font-medium text-gray-700 mb-1.5">
              Photo Description
              <span class="text-gray-500 text-xs font-normal">(Optional)</span>
            </label>
            <textarea
              id="photoDescription"
              v-model="formData.description"
              rows="4"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="e.g., 'Group photo of Workshop participants, June 11, 2025'"
              :disabled="isSubmitting"
            ></textarea>
          </div>
        </div>
      </div>
      <div class="bg-gray-50/70 px-6 py-4 rounded-b-2xl">
        <FormActions
          submitLabel="Upload Photo"
          :disabled="!isFormValid || isSubmitting"
          :isLoading="isSubmitting"
          @submit="submitForm"
          @reset="resetForm"
          @cancel="$emit('cancel')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import {
  PhotoIcon,
  DocumentCheckIcon,
  XMarkIcon,
  InformationCircleIcon,
  ChevronDownIcon,
} from '@heroicons/vue/24/outline'
import FormActions from './FormActions.vue' // Assuming this is your generic actions component
import { useToast } from 'vue-toastification'

const toast = useToast()

const props = defineProps({
  cpdTasks: {
    type: Array,
    default: () => [],
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
const photoInputRef = ref(null)
const photoError = ref('')
const isDragging = ref(false)

const isFormValid = computed(() => {
  return formData.cpdTask && photoFile.value && !photoError.value
})

function processFile(file) {
  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    photoError.value = 'Invalid file type. Please upload a valid image (PNG, JPG, GIF).'
    toast.error(photoError.value)
    return
  }

  // Validate file size (e.g., 10MB)
  if (file.size > 10 * 1024 * 1024) {
    photoError.value = 'File size exceeds 10MB limit.'
    toast.error(photoError.value)
    return
  }

  photoError.value = ''
  photoFile.value = file

  // Create a preview
  const reader = new FileReader()
  reader.onload = (e) => {
    photoPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

function handleFileSelect(event) {
  const file = event.target.files?.[0]
  processFile(file)
}

function removePhoto() {
  photoFile.value = null
  photoPreview.value = ''
  photoError.value = ''
  // Reset the file input
  if (photoInputRef.value) {
    photoInputRef.value.value = ''
  }
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
  const file = event.dataTransfer.files?.[0]
  processFile(file)
}

function submitForm() {
  if (!isFormValid.value) {
    toast.error('Please fill all required fields and correct any errors.')
    return
  }

  emit('submit', {
    cpdTask: formData.cpdTask,
    photo: photoFile.value,
    description: formData.description,
  })
}

function resetForm() {
  formData.cpdTask = ''
  formData.description = ''
  removePhoto()
}

// Expose resetForm for parent component access
defineExpose({ resetForm })
</script>
