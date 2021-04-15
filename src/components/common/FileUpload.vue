<template>
  <div class="file-upload relative">
    <input
      type="file"
      :accept="accept"
      @change="handleFileChange"
      class="sr-only"
      ref="fileInput"
      :id="inputId"
      :required="required"
    />
    <label
      :for="inputId"
      class="cursor-pointer bg-blue-100 text-blue-700 rounded-md px-4 py-2 hover:bg-blue-200 transition-colors"
    >
      {{ fileName || 'Upload File' }}
    </label>
    <button
      v-if="fileName"
      type="button"
      @click="removeFile"
      class="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500 hover:text-red-700 focus:outline-none"
      title="Remove File"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: [File, null],
    default: null,
  },
  accept: {
    type: String,
    default: '*',
  },
  maxSize: {
    type: Number,
    default: 5, // Default max size in MB
  },
  required: {
    type: Boolean,
    default: false,
  },
  initialFileName: {
    // Add this prop
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'upload-error'])

const fileInput = ref(null)
const error = ref('')
const inputId = ref(`file-upload-${Math.random().toString(36).substring(7)}`)
const fileName = ref(props.initialFileName) // Use initialFileName

// Helper function to map file extensions to MIME types (Keep this)
const getMimeTypes = (acceptString) => {
  return acceptString.split(',').map((type) => {
    type = type.trim()
    switch (type) {
      case '.pdf':
        return 'application/pdf'
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg'
      case '.png':
        return 'image/png'
      case '.webp':
        return 'image/webp'
      default:
        return type
    }
  })
}

const handleFileChange = (event) => {
  error.value = '' // Reset error
  const selectedFile = event.target.files[0]

  if (selectedFile) {
    if (!validateFile(selectedFile)) {
      clearFileInput(event)
      return
    }
    fileName.value = selectedFile.name //update the file name
    emit('update:modelValue', selectedFile)
  } else {
    removeFile() // Clear if no file selected
  }
}

const validateFile = (selectedFile) => {
  error.value = ''
  const acceptedMimeTypes = getMimeTypes(props.accept)
  const isValidType = acceptedMimeTypes.some((mimeType) => {
    if (mimeType.endsWith('/*')) {
      const baseType = mimeType.slice(0, -2)
      return selectedFile.type.startsWith(baseType)
    }
    return selectedFile.type === mimeType
  })

  if (!isValidType) {
    error.value = `Invalid file type. Allowed types: ${props.accept}`
    emit('upload-error', error.value)
    return false // Return false for invalid
  }

  const maxSizeBytes = props.maxSize * 1024 * 1024
  if (selectedFile.size > maxSizeBytes) {
    error.value = `File size exceeds ${props.maxSize}MB`
    emit('upload-error', error.value)
    return false // Return false for invalid
  }
  return true //valid file
}

const removeFile = () => {
  fileName.value = ''
  emit('update:modelValue', null)
  clearFileInput() // Clear the *input element*
}

const clearFileInput = (event = null) => {
  if (event) {
    event.target.value = ''
  } else {
    if (fileInput.value) {
      fileInput.value.value = '' // Access the DOM element and clear its value
    }
  }
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) {
      // if new value is null or undefined
      fileName.value = '' //clear the filename as well
    }
  },
)

//watch for initial file name changes
onMounted(() => {
  fileName.value = props.initialFileName
})
</script>

<style scoped>
/* Keep your existing styles, but add this for the clear button positioning */
.file-upload {
  display: flex;
  align-items: center;
  position: relative;
  /* Add this */
}
</style>
