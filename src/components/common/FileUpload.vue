<template>
  <div class="file-upload">
    <input type="file" :accept="accept" @change="handleFileChange" class="hidden" ref="fileInput" />
    <button type="button" @click="triggerFileInput"
      class="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
      {{ file ? file.name : 'Upload File' }}
    </button>
    <button v-if="file" type="button" @click="removeFile"
      class="ml-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors">
      Remove
    </button>
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: File,
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
});

const emit = defineEmits(['update:modelValue', 'upload-error']);

const file = ref(props.modelValue);
const error = ref('');
const fileInput = ref(null);

// Watch for changes in the modelValue prop
watch(
  () => props.modelValue,
  (newValue) => {
    file.value = newValue;
  }
);

// Trigger file input click
const triggerFileInput = () => {
  fileInput.value.click();
};

// Handle file selection
const handleFileChange = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    validateFile(selectedFile);
  }
};

// Validate file type and size
const validateFile = (selectedFile) => {
  error.value = '';

  // Check file type
  if (props.accept !== '*' && !selectedFile.type.match(props.accept)) {
    error.value = `Invalid file type. Allowed types: ${props.accept}`;
    emit('upload-error', error.value);
    return;
  }

  // Check file size
  const maxSizeBytes = props.maxSize * 1024 * 1024; // Convert MB to bytes
  if (selectedFile.size > maxSizeBytes) {
    error.value = `File size exceeds ${props.maxSize}MB`;
    emit('upload-error', error.value);
    return;
  }

  // If valid, update the file and emit the value
  file.value = selectedFile;
  emit('update:modelValue', selectedFile);
};

// Remove the selected file
const removeFile = () => {
  file.value = null;
  emit('update:modelValue', null);
  error.value = '';
};
</script>

<style scoped>
.file-upload {
  display: flex;
  align-items: center;
}
</style>
