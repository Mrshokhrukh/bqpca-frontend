<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div class="p-6">
      <div class="flex items-center justify-between">
        <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
          <FileText class="h-5 w-5 text-gray-500" />
          <span>Application Details</span>
        </h4>
        <button v-if="!isEditing && overallStatus === 'Approved'" @click="startEditing"
          class="text-blue-600 hover:text-blue-800">
          <Pencil class="h-4 w-4" />
        </button>
        <div v-else-if="overallStatus === 'Approved'">
          <button @click="saveChanges" class="text-green-600 hover:text-green-800 mr-2">
            <Check class="h-4 w-4" />
          </button>
          <button @click="cancelEditing" class="text-gray-600 hover:text-gray-800">
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-6">
        <!-- ... (rest of your display/edit fields, similar to PersonalInformation.vue) ... -->
        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm font-medium text-gray-500">Registration Type</p>
          <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
            <FileCheck class="h-4 w-4 text-gray-400" />
            <span>{{ application.registration_type?.name }}</span>
          </p>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm font-medium text-gray-500">Registration Number</p>
          <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
            <Hash class="h-4 w-4 text-gray-400" />
            <span>{{ application.registration_no }}</span>
          </p>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm font-medium text-gray-500">Registration Date</p>
          <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
            <Calendar class="h-4 w-4 text-gray-400" />
            <span>{{ formatDate(application.registration_date) }}</span>
          </p>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm font-medium text-gray-500">Expiry Date</p>
          <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
            <Clock class="h-4 w-4 text-gray-400" />
            <span>{{ formatDate(application.expiry_date) }}</span>
          </p>
        </div>

        <!-- Personnel Category -->
        <template v-if="overallStatus === 'Approved'">
          <div class="p-4 bg-gray-50 rounded-lg" v-if="!isEditing">
            <p class="text-sm font-medium text-gray-500">Personnel Category</p>
            <p class="text-sm text-gray-900 mt-2">
              <span>{{ selectedCategoryName }}</span>
            </p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg" v-else>
            <p class="text-sm font-medium text-gray-500">Personnel Category</p>
            <select v-model="editableData.personnel_category"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="" disabled>Select Category</option>
              <option v-for="category in personnelCategories" :key="category.id" :value="category.id">
                {{ category.participation_category_name }}
              </option>
            </select>
          </div>

          <!-- Personnel Subcategory -->
          <div class="p-4 bg-gray-50 rounded-lg" v-if="!isEditing">
            <p class="text-sm font-medium text-gray-500">
              Personnel Subcategory
            </p>
            <p class="text-sm text-gray-900 mt-2">
              <span>{{ selectedSubcategoryName }}</span>
            </p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg" v-else>
            <p class="text-sm font-medium text-gray-500">
              Personnel Subcategory
            </p>
            <select v-model="editableData.personnel_subcategory"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="" disabled>Select Subcategory</option>
              <option v-for="subcategory in personnelSubcategories" :key="subcategory.id" :value="subcategory.id">
                {{ subcategory.sub_category_name }}
              </option>
            </select>
          </div>

          <!-- Practice Address -->
          <div class="p-4 bg-gray-50 rounded-lg" v-if="!isEditing">
            <p class="text-sm font-medium text-gray-500">Practice Address</p>
            <p class="text-sm text-gray-900 mt-2">
              <span>{{ application.practice_address }}</span>
            </p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg" v-else>
            <p class="text-sm font-medium text-gray-500">Practice Address</p>
            <input type="text" v-model="editableData.practice_address"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter Practice Address" />
          </div>

          <!-- Sector -->
          <div class="p-4 bg-gray-50 rounded-lg" v-if="!isEditing">
            <p class="text-sm font-medium text-gray-500">Sector</p>
            <p class="text-sm text-gray-900 mt-2">
              <span>{{ application.sector }}</span>
            </p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg" v-else>
            <p class="text-sm font-medium text-gray-500">Sector</p>
            <select v-model="editableData.sector"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="" disabled>Select Sector</option>
              <option v-for="sector in sectors" :key="sector.id" :value="sector.name">
                {{ sector.name }}
              </option>
            </select>
          </div>
        </template>
      </div>
      <div v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { FileText, FileCheck, Hash, Calendar, Clock, Pencil, Check, X } from 'lucide-vue-next'
import apiServices from '@/services/services';
import isEqual from 'lodash/isEqual';

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
const editableData = ref({});
const originalData = ref({});
const errorMessage = ref('');

onMounted(() => {
  originalData.value = JSON.parse(JSON.stringify(props.application));
  editableData.value = { ...props.application };
});

watch(() => props.application, (newVal) => {
  originalData.value = JSON.parse(JSON.stringify(newVal));
  editableData.value = { ...newVal };
}, { deep: true });


const startEditing = () => {
  isEditing.value = true;
  editableData.value = { ...originalData.value }; // Copy original
};

const cancelEditing = () => {
  isEditing.value = false;
  editableData.value = { ...originalData.value }; // Reset
  errorMessage.value = '';
};

const saveChanges = async () => {
  errorMessage.value = '';
  if (!props.application.id) {
    console.error("Application ID is missing.");
    errorMessage.value = "Application details are missing.";
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
        formData.append(key, value === null || value === undefined ? '' : value); // Handle null values
      }
    }

    // Use the correct endpoint and ID for updating application details
    await apiServices.patchBhmcNewApplication(props.application.id, formData);
    originalData.value = JSON.parse(JSON.stringify(editableData.value));
    isEditing.value = false;
    emit('update');

  } catch (error) {
    console.error("Error saving changes:", error);
    errorMessage.value = "Failed to save changes.";
  }
};

const overallStatus = computed(() => {
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

const selectedCategoryName = computed(() => {  //get selected category name
  if (!props.application.personnel_category) {
    return '';
  }
  const selected = props.personnelCategories.find(
    (cat) => cat.id === props.application.personnel_category,
  );
  return selected ? selected.participation_category_name : '';
});

const selectedSubcategoryName = computed(() => { //get selected sub category name
  if (!props.application.personnel_subcategory) {
    return '';
  }
  const selected = props.personnelSubcategories.find(
    (sub) => sub.id === props.application.personnel_subcategory,
  );
  return selected ? selected.sub_category_name : '';
});

const formatDate = (date) => { //date format
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
