<template>
  <div class="file-upload">
    <!-- Hidden file input -->
    <input
      type="file"
      :accept="accept"
      @change="handleFileChange"
      class="hidden"
      ref="fileInput"
      :required="required"
    />
    <!-- Upload button -->
    <button
      type="button"
      @click="triggerFileInput"
      class="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
    >
      {{ file ? file.name : 'Upload File' }}
    </button>
    <!-- Remove button (visible only when a file is selected) -->
    <button
      v-if="file"
      type="button"
      @click="removeFile"
      class="ml-2 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
    >
      Remove
    </button>
    <!-- Error message -->
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// Props
const props = defineProps({
  modelValue: {
    type: [File, null], // Expects a File object or null
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

// Emits
const emit = defineEmits(['update:modelValue', 'upload-error']);

// Refs
const file = ref(props.modelValue || null); // Holds the selected file
const error = ref(''); // Holds validation error messages
const fileInput = ref(null); // Reference to the file input element

// Helper function to map file extensions to MIME types
const getMimeTypes = (acceptString) => {
  return acceptString.split(',').map((type) => {
    type = type.trim();
    // Handle special cases
    switch (type) {
      case '.pdf':
        return 'application/pdf';
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      case '.webp':
        return 'image/webp';
      default:
        return type;
    }
  });
};

// Validate the selected file
const validateFile = (selectedFile) => {
  error.value = '';

  // Get array of accepted MIME types
  const acceptedMimeTypes = getMimeTypes(props.accept);

  // Check if file type matches any accepted MIME type
  const isValidType = acceptedMimeTypes.some((mimeType) => {
    if (mimeType.endsWith('/*')) {
      const baseType = mimeType.slice(0, -2); // Remove '/*'
      return selectedFile.type.startsWith(baseType); // Check if file starts with 'image/', etc.
    }
    return selectedFile.type === mimeType;
  });

  if (!isValidType) {
    error.value = `Invalid file type. Allowed types: ${props.accept}`;
    emit('upload-error', error.value);
    file.value = null;
    emit('update:modelValue', null);
    return;
  }

  // Check file size
  const maxSizeBytes = props.maxSize * 1024 * 1024; // Convert MB to bytes
  if (selectedFile.size > maxSizeBytes) {
    error.value = `File size exceeds ${props.maxSize}MB`;
    emit('upload-error', error.value);
    file.value = null;
    emit('update:modelValue', null);
    return;
  }

  // If valid, update the file
  file.value = selectedFile;
  emit('update:modelValue', selectedFile); // Emit the File object directly
};

// Watch for changes to modelValue (e.g., when resetting the form)
watch(
  () => props.modelValue,
  (newValue) => {
    file.value = newValue || null;
  }
);

// Trigger the file input click
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

// Remove the selected file
const removeFile = () => {
  file.value = null;
  emit('update:modelValue', null); // Emit null to clear the file
  error.value = '';
};
</script>

<style scoped>
.file-upload {
  display: flex;
  align-items: center;
}
</style>
