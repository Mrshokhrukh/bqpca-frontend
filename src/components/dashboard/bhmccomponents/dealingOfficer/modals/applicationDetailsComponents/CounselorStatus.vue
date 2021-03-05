<template>
  <div v-if="!isEditing && application.is_counselor">
    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
      <Check class="h-4 w-4 mr-1" />
      Verified Counselor
    </span>
  </div>
  <div v-else>
    <button @click="toggleCounselorStatus" :class="[
    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
    editableData.is_counselor
      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  ]">
      {{
    editableData.is_counselor
      ? 'Cancel Registration'
      : 'Register as Counselor'
  }}
    </button>
    <button v-if="isEditing" @click="saveChanges" class="text-green-600 hover:text-green-800 mr-2 ml-3">
      <Check class="h-4 w-4" />
    </button>
    <button v-if="isEditing" @click="cancelEditing" class="text-gray-600 hover:text-gray-800">
      <X class="h-4 w-4" />
    </button>
  </div>
  <div v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</div>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue'
import { Check, X } from 'lucide-vue-next'
import apiServices from '@/services/services'
import isEqual from 'lodash/isEqual';

const props = defineProps({
  application: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update'])

const isEditing = ref(false)
const editableData = ref({})
const originalData = ref({})
const errorMessage = ref('')

onMounted(() => {
  originalData.value = JSON.parse(JSON.stringify(props.application));
  editableData.value = { ...props.application };
});

watch(() => props.application, (newVal) => {
  originalData.value = JSON.parse(JSON.stringify(newVal));
  editableData.value = { ...newVal };
}, { deep: true });

const startEditing = () => {
  isEditing.value = !isEditing.value;
  editableData.value = { ...originalData.value };
}
const toggleCounselorStatus = () => {
  startEditing();
  editableData.value.is_counselor = !editableData.value.is_counselor;
};

const cancelEditing = () => {
  isEditing.value = !isEditing.value;
  editableData.value = { ...originalData.value } // Reset to original
  errorMessage.value = ''
}

const saveChanges = async () => {
  errorMessage.value = '';
  if (!props.application.userDetails?.id) {
    console.error("User details ID is missing.");
    errorMessage.value = "User details are missing.";
    return;
  }
  const changedFields = {};
  for (const key in editableData.value) {
    if (!isEqual(editableData.value[key], originalData.value[key])) {
      changedFields[key] = editableData.value[key];
    }
  }

  if (Object.keys(changedFields).length === 0) {
    isEditing.value = !isEditing.value;
    return;
  }

  try {
    const formData = new FormData();
    for (const key in changedFields) {
      if (Object.prototype.hasOwnProperty.call(changedFields, key)) {
        const value = changedFields[key];
        formData.append(key, value === null || value === undefined ? '' : value); // Handle null values
      }
    }

    await apiServices.patchUser(props.application.userDetails.id, formData);
    originalData.value = JSON.parse(JSON.stringify(editableData.value));
    isEditing.value = !isEditing.value;
    emit('update');

  } catch (error) {
    console.error("Error saving changes:", error);
    errorMessage.value = "Failed to save changes.";
  }
}

</script>
