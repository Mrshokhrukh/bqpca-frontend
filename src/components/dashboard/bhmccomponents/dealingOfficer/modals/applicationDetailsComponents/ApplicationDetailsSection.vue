<template>
  <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden max-w-4xl mx-auto">
    <div class="p-6 space-y-6">
      <!-- Header Section -->
      <div class="flex items-center justify-between border-b pb-4">
        <div class="flex items-center space-x-3">
          <FileText class="h-6 w-6 text-blue-600" />
          <h2 class="text-xl font-semibold text-gray-900">Application Details</h2>
        </div>

        <!-- Edit/Save Controls -->
        <div class="flex items-center space-x-2">

          <template v-if="!isEditing">
            <button @click="startEditing" class="btn-icon-subtle hover:bg-blue-50 transition-colors"
              title="Edit Details">
              <Pencil class="h-5 w-5 text-blue-600 hover:text-blue-800" />
            </button>
          </template>
          <template v-else>
            <button @click="saveChanges" class="btn-icon-success hover:bg-green-50 transition-colors"
              title="Save Changes">
              <Check class="h-5 w-5 text-green-600 hover:text-green-800" />
            </button>
            <button @click="cancelEditing" class="btn-icon-subtle hover:bg-red-50 transition-colors"
              title="Cancel Editing">
              <X class="h-5 w-5 text-gray-600 hover:text-red-800" />
            </button>
          </template>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Application-Level Details -->
        <div class="grid grid-cols-2 gap-4">
          <detail-card icon="FileCheck" label="Registration Type" :value="application.registration_type_name" />
          <detail-card icon="Hash" label="Registration Number" :value="application.registration_no" />
          <detail-card icon="Calendar" label="Registration Date" :value="formatDate(application.registration_date)" />
          <detail-card icon="Clock" label="Expiry Date" :value="formatDate(application.expiry_date)" />
        </div>

        <!-- Qualification Selection Section -->
        <div class="space-y-4">
          <!-- Qualification Dropdown -->
          <div class="bg-gray-50 rounded-lg p-4">
            <label class="block text-sm font-medium text-gray-600 mb-2">
              Select Qualification to Edit
            </label>
            <!-- Conditionally render input -->
            <template v-if="isEditing">
              <select v-model="selectedQualificationId" class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     transition-all duration-200 ease-in-out">
                <option value="" disabled>Select a Qualification</option>
                <option v-for="qualification in application.user_qualifications" :key="qualification.id"
                  :value="qualification.id">
                  {{ qualification.qualification_name_display }}
                </option>
              </select>
            </template>
            <template v-else>
              <div class="text-gray-700 px-3 py-2">
                {{ selectedQualification ? selectedQualification.qualification_name_display :
            'No Qualification Selected' }}
              </div>
            </template>
          </div>

          <!-- Primary Qualification Toggle -->
          <div class="bg-gray-50 rounded-lg p-4">
            <!-- Conditionally enable/disable button -->
            <button @click="togglePrimaryQualification" :disabled="!selectedQualification || !isEditing" :class="{
            'bg-blue-500 text-white': selectedQualification && selectedQualification.is_primary_qualification,
            'bg-gray-200 text-gray-700': !isEditing || !selectedQualification || !selectedQualification.is_primary_qualification,
            'opacity-50 cursor-not-allowed': !selectedQualification || !isEditing
          }" class="w-full px-4 py-2 rounded-lg transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     hover:shadow-md">
              {{ selectedQualification && selectedQualification.is_primary_qualification
            ? 'Unmark as Primary'
            : 'Mark as Primary' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Qualification-Specific Details -->
      <template v-if="selectedQualification">
        <div class="grid md:grid-cols-2 gap-4">
          <!-- Personnel Category -->
          <editable-field :label="'Personnel Category'" :value="selectedCategoryName" :is-editing="isEditing">
            <select v-model="editableData.personnel_category" class="form-select">
              <option value="" disabled>Select Category</option>
              <option v-for="category in personnelCategories" :key="category.id" :value="category.id">
                {{ category.category_name }}
              </option>
            </select>
          </editable-field>

          <!-- Personnel Subcategory -->
          <editable-field :label="'Personnel Subcategory'" :value="selectedSubcategoryName" :is-editing="isEditing">
            <select v-model="editableData.personnel_sub_category" class="form-select">
              <option value="" disabled>Select Subcategory</option>
              <option v-for="subcategory in personnelSubcategories" :key="subcategory.id" :value="subcategory.id">
                {{ subcategory.sub_category_name }}
              </option>
            </select>
          </editable-field>

          <!-- Practice Address -->
          <editable-field :label="'Practice Address'" :value="selectedQualification.practice_address"
            :is-editing="isEditing">
            <input type="text" v-model="editableData.practice_address" class="form-input"
              placeholder="Enter Practice Address" />
          </editable-field>

          <!-- Sector -->
          <editable-field :label="'Sector'" :value="selectedSectorName" :is-editing="isEditing">
            <select v-model="editableData.select_sector" class="form-select">
              <option value="" disabled>Select Sector</option>
              <option v-for="sector in sectors" :key="sector.id" :value="sector.id">
                {{ sector.name }} <!-- Changed this line -->
              </option>
            </select>
          </editable-field>
        </div>
      </template>

      <!-- Error Message -->
      <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700
               px-4 py-3 rounded-lg flex items-center space-x-2">
        <AlertTriangle class="h-5 w-5 text-red-500" />
        <span>{{ errorMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  FileText,
  Pencil, Check, X, AlertTriangle
} from 'lucide-vue-next'
import apiServices from '@/services/services';
import isEqual from 'lodash/isEqual';

// Component imports
import DetailCard from './DetailCard.vue';
import EditableField from './EditableField.vue';

const props = defineProps({
  application: {
    type: Object,
    required: true,
  },
  personnelCategories: {
    type: Array,
    default: () => [],
  },
  personnelSubcategories: {
    type: Array,
    default: () => [],
  },
  sectors: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update']);

const isEditing = ref(false);
const selectedQualificationId = ref(null); // ID of the selected qualification
const editableData = ref({});
const originalData = ref({});  // For the *selected* qualification
const errorMessage = ref('');

// Computed property for the *selected* qualification object
const selectedQualification = computed(() => {
  if (!selectedQualificationId.value) return null;
  return props.application.user_qualifications.find(q => q.id === selectedQualificationId.value);
});

// Watch for changes in the selected qualification
watch(selectedQualification, (newVal) => {
  if (newVal) {
    originalData.value = JSON.parse(JSON.stringify(newVal));
    editableData.value = { ...newVal };
  } else {
    originalData.value = {};
    editableData.value = {};
  }
  isEditing.value = false; // Reset editing state when qualification changes
}, { deep: true });

// Watch for changes in props.application (to set the initial primary qualification)
watch(() => props.application, (newVal) => {
  if (newVal && newVal.user_qualifications) {
    // Find the primary qualification or default to the first one
    const primary = newVal.user_qualifications.find(q => q.is_primary_qualification);
    selectedQualificationId.value = primary ? primary.id : (newVal.user_qualifications[0]?.id || null);
  }
}, { deep: true, immediate: true });

const startEditing = () => {
  if (!selectedQualificationId.value) {
    errorMessage.value = "Please select a qualification to edit.";
    return;
  }
  errorMessage.value = '';
  isEditing.value = true;
  editableData.value = { ...originalData.value };
};

const cancelEditing = () => {
  isEditing.value = false;
  editableData.value = { ...originalData.value };
  errorMessage.value = '';
};

const saveChanges = async () => {
  errorMessage.value = '';
  if (!selectedQualificationId.value) {
    errorMessage.value = "Please select a qualification to edit.";
    return;
  }
  const changedFields = {};
  for (const key in editableData.value) {
    if (!isEqual(editableData.value[key], originalData.value[key])) {
      changedFields[key] = editableData.value[key];
    }
  }

  if (Object.keys(changedFields).length === 0) {
    isEditing.value = false;
    return;
  }

  try {
    const formData = new FormData();
    for (const key in changedFields) {
      if (Object.prototype.hasOwnProperty.call(changedFields, key)) {
        const value = changedFields[key];
        formData.append(key, value === null || value === undefined ? '' : value);
      }
    }

    // PATCH to the *qualification* endpoint, not the application
    await apiServices.patchMhpcNewQualification(selectedQualificationId.value, formData);
    originalData.value = JSON.parse(JSON.stringify(editableData.value));
    isEditing.value = false;
    emit('update'); // Refresh the main application data

  } catch (error) {
    console.error("Error saving changes:", error);
    errorMessage.value = "Failed to save changes.";
  }
};

// Toggle Primary Qualification (NEW)
const togglePrimaryQualification = async () => {
  if (!selectedQualificationId.value) {
    errorMessage.value = "Please select a qualification first.";
    return;
  }
  errorMessage.value = "";
  try {
    const newValue = !selectedQualification.value.is_primary_qualification;
    const formData = new FormData();
    formData.append('is_primary_qualification', newValue);
    await apiServices.patchMhpcNewQualification(selectedQualificationId.value, formData);

    // Update ALL qualifications (not just the selected one)
    props.application.user_qualifications.forEach(q => {
      q.is_primary_qualification = (q.id === selectedQualificationId.value) ? newValue : false;
    });
    emit('update'); // Refresh the main application

  } catch (error) {
    console.error("Error toggling primary qualification:", error);
    errorMessage.value = "Failed to update primary qualification.";
  }
};

// const overallStatus = computed(() => {
//   if (!props.application.user_qualifications?.[0]) return "Pending";
//   const appReview =
//     props.application.user_qualifications[0].application_review_status;
//   const physReview =
//     props.application.user_qualifications[0].physical_review_status;
//   const endorse = props.application.user_qualifications[0].endorsement_decision;

//   if (
//     appReview === "Regretted" ||
//     physReview === "Regretted" ||
//     endorse === "Regretted"
//   ) {
//     return "Regretted";
//   } else if (
//     appReview === "Approved" &&
//     physReview === "Approved" &&
//     endorse === "Approved"
//   ) {
//     return "Approved";
//   } else {
//     return "Pending";
//   }
// });

// Use selectedQualification to get the correct names
const selectedCategoryName = computed(() => {
  if (!selectedQualification.value || !selectedQualification.value.personnel_category) {
    return "";
  }
  const categoryId = parseInt(selectedQualification.value.personnel_category, 10);
  const selected = props.personnelCategories.find((cat) => cat.id === categoryId);
  return selected ? selected.category_name : "";
});

const selectedSubcategoryName = computed(() => {
  if (!selectedQualification.value || !selectedQualification.value.personnel_sub_category) {
    return "";
  }
  const subcategoryId = parseInt(selectedQualification.value.personnel_sub_category, 10);
  const selected = props.personnelSubcategories.find((sub) => sub.id === subcategoryId);
  return selected ? selected.sub_category_name : "";
});

const selectedSectorName = computed(() => {
  if (!selectedQualification.value || !selectedQualification.value.select_sector) {
    return "";
  }
  const sectorId = parseInt(selectedQualification.value.select_sector, 10);
  const selected = props.sectors.find((sector) => sector.id === sectorId);
  return selected ? selected.name : "";
});

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
</script>

<style scoped>
/* Custom Utility Classes */
.btn-icon-subtle {
  @apply p-2 rounded-full hover:bg-gray-100 transition-colors;
}

.btn-icon-success {
  @apply p-2 rounded-full hover:bg-green-100 transition-colors;
}

.form-select,
.form-input {
  @apply w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out;
}
</style>
