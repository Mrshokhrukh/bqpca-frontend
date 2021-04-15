<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div class="p-6">
      <div class="flex items-center justify-between">
        <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
          <Contact class="h-5 w-5 text-gray-500" />
          <span>Contact Information</span>
        </h4>
        <button v-if="!isEditing" @click="startEditing" class="text-blue-600 hover:text-blue-800">
          <Pencil class="h-4 w-4" />
        </button>
        <div v-else>
          <button @click="saveChanges" class="text-green-600 hover:text-green-800 mr-2">
            <Check class="h-4 w-4" />
          </button>
          <button @click="cancelEditing" class="text-gray-600 hover:text-gray-800">
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>
      <div class="space-y-4">
        <!-- Email -->
        <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Mail class="h-4 w-4 text-gray-400" />
          <span v-if="!isEditing" class="text-sm text-gray-600">{{ displayData.email_address }}</span>
          <input v-else type="email" v-model="editableData.email_address"
            class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        </div>

        <!-- Contact No -->
        <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Phone class="h-4 w-4 text-gray-400" />
          <span v-if="!isEditing" class="text-sm text-gray-600">{{ displayData.contact_no }}</span>
          <input v-else v-model="editableData.contact_no"
            class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        </div>

        <!-- Address -->
        <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <MapPin class="h-4 w-4 text-gray-400" />
          <span v-if="!isEditing" class="text-sm text-gray-600">
            {{ displayData.village }}, {{ displayData.gewog }},
            {{ displayData.dzongkhag }}
          </span>
          <div v-else class="w-full">
            <input type="text" v-model="editableData.village" placeholder="Village"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2">
            <input type="text" v-model="editableData.gewog" placeholder="Gewog"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2">
            <input type="text" v-model="editableData.dzongkhag" placeholder="Dzongkhag"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          </div>
        </div>
        <div v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Contact, Mail, Phone, MapPin, Pencil, X, Check } from 'lucide-vue-next'
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

const displayData = ref({});

onMounted(() => {
  // Initialize displayData when the component is mounted
  displayData.value = { ...props.application };
  originalData.value = JSON.parse(JSON.stringify(props.application)); // Deep copy for comparison
  editableData.value = { ...props.application };
});

watch(() => props.application, (newVal) => {
  originalData.value = JSON.parse(JSON.stringify(newVal))
  editableData.value = { ...newVal }
  displayData.value = { ...newVal };
}, { deep: true })

const startEditing = () => {
  isEditing.value = true
  editableData.value = { ...originalData.value } // Copy original
}

const cancelEditing = () => {
  isEditing.value = false
  editableData.value = { ...originalData.value } // Reset
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

  // Early return if no fields have changed
  if (Object.keys(changedFields).length === 0) {
    isEditing.value = false; // Exit editing mode
    return; // No changes to save
  }

  try {
    const formData = new FormData();
    for (const key in changedFields) {
      if (Object.prototype.hasOwnProperty.call(changedFields, key)) {
        const value = changedFields[key];
        formData.append(key, value === null || value === undefined ? '' : value);
      }
    }

    // Make API call to update user details
    await apiServices.patchUser(props.application.userDetails.id, formData);

    // If successful, update the original data and close editing mode
    originalData.value = JSON.parse(JSON.stringify(editableData.value));
    isEditing.value = false;
    emit('update'); // Notify parent to refresh
  } catch (error) {
    console.error("Error saving changes:", error);
    errorMessage.value = "Failed to save changes."; // Set error message
  }
}
</script>
