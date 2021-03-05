<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div class="p-6">
      <div class="flex items-center justify-between">
        <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
          <User class="h-5 w-5 text-gray-500" />
          <span>Personal Information</span>
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
      <div class="flex flex-col items-center space-y-4">
        <!-- ... (your existing content for displaying personal info) ... -->
        <div class="relative group">
          <img :src="displayData.passport_photo || '/placeholder-avatar.png'" @error="handleImageError"
            class="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg transition-transform group-hover:scale-105" />
          <span class="absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-white shadow-sm" :class="{
          'bg-yellow-400': overallStatus === 'Pending',
          'bg-green-400': overallStatus === 'Approved',
          'bg-red-400': overallStatus === 'Regretted',
        }" />
        </div>

        <!-- Full Name -->
        <div class="text-center">
          <h5 v-if="!isEditing" class="text-xl font-semibold text-gray-900">
            {{ displayData.full_name }}
          </h5>
          <input v-else type="text" v-model="editableData.full_name"
            class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center">
        </div>

        <!-- CID -->
        <div class="text-center">
          <p v-if="!isEditing" class="text-sm text-gray-500 mt-1">
            CID: {{ displayData.cid_no }}
          </p>
          <input v-else type="text" v-model="editableData.cid_no"
            class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center">
        </div>

        <!-- Gender and DOB -->
        <div class="w-full grid grid-cols-2 gap-4 mt-4">
          <div class="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
            <UserCircle class="h-4 w-4 text-gray-400" />
            <span v-if="!isEditing" class="text-sm text-gray-600">{{ displayData.gender }}</span>
            <select v-else v-model="editableData.gender"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="" disabled>Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div class="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
            <Calendar class="h-4 w-4 text-gray-400" />
            <span v-if="!isEditing" class="text-sm text-gray-600">{{ formatDate(displayData.date_of_birth) }}</span>
            <input v-else type="date" v-model="editableData.date_of_birth"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">

          </div>
        </div>
        <div v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { User, UserCircle, Calendar, Pencil, Check, X } from 'lucide-vue-next'
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
  // Initialize displayData when the component is mounted
  displayData.value = { ...props.application };
  originalData.value = JSON.parse(JSON.stringify(props.application)); // Deep copy for comparison
  editableData.value = { ...props.application };
});

const displayData = ref({});

watch(() => props.application, (newVal) => {
  // Use a deep watch to react to changes in props.application
  originalData.value = JSON.parse(JSON.stringify(newVal));
  editableData.value = { ...newVal };
  displayData.value = { ...newVal };
}, { deep: true });

const startEditing = () => {
  isEditing.value = true
  editableData.value = { ...originalData.value } // Copy original data to editableData
}

const cancelEditing = () => {
  isEditing.value = false
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
        formData.append(key, value === null || value === undefined ? '' : value); //handle the null/undefined values
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

const formatDate = (date) => {
  if (!date) return 'N/A'
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid Date'
  }
}
const handleImageError = (event) => {
  event.target.src = '/placeholder-avatar.png'
}

const overallStatus = computed(() => { //calculate the overall status
  if (!props.application?.user_qualifications?.[0]) return 'Pending'

  const appReview = props.application.user_qualifications[0].application_review_status
  const physReview = props.application.user_qualifications[0].physical_review_status
  const endorse = props.application.user_qualifications[0].endorsement_decision

  if (appReview === 'Regretted' || physReview === 'Regretted' || endorse === 'Regretted') {
    return 'Regretted'
  } else if (appReview === 'Approved' && physReview === 'Approved' && endorse === 'Approved') {
    return 'Approved'
  } else {
    return 'Pending'
  }
})

</script>
