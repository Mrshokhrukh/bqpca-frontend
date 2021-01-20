<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <form @submit.prevent="handleUpdate">
      <!-- Personal Information -->
      <div class="bg-white p-8 rounded-lg shadow-lg mb-12">
        <h2 class="text-3xl font-serif font-bold text-slate-900 mb-6">Personal Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="(field, key) in personalFields" :key="key">
            <label class="block text-slate-600 text-base mb-2">{{ field.label }}</label>
            <input v-model="form[key]" :type="field.type" :maxlength="field.maxLength"
              class="w-full p-3 border border-slate-200 rounded-lg" :disabled="!isEditable && !isViewMode" />
            <span class="text-red-500 text-sm">{{ errors[key] }}</span>
          </div>
        </div>
      </div>

      <!-- Education Details -->
      <div class="bg-white p-8 rounded-lg shadow-lg mb-12">
        <h2 class="text-3xl font-serif font-bold text-slate-900 mb-6">Education Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Study in Country Radio Buttons -->
          <div>
            <label class="block text-slate-600 text-base mb-2">Study in Country?</label>
            <div class="flex items-center space-x-6">
              <label v-for="option in ['yes', 'no']" :key="option" class="flex items-center text-slate-600">
                <input v-model="form.studyInCountry" type="radio" :value="option" class="mr-2"
                  :disabled="!isEditable && !isViewMode" />
                {{ option.charAt(0).toUpperCase() + option.slice(1) }}
              </label>
            </div>
          </div>

          <!-- Dropdowns -->
          <div v-for="(field, key) in dropdownFields" :key="key">
            <label class="block text-slate-600 text-base mb-2">{{ field.label }}</label>
            <select v-model="form[key]" class="w-full p-3 border border-slate-200 rounded-lg"
              :disabled="!isEditable && !isViewMode">
              <option value="">Select {{ field.label }}</option>
              <option v-for="option in field.options" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
            <span class="text-red-500 text-sm">{{ errors[key] }}</span>
          </div>

          <!-- Text Input Fields -->
          <div v-for="(field, key) in educationFields" :key="key">
            <label class="block text-slate-600 text-base mb-2">{{ field.label }}</label>
            <input v-model="form[key]" type="text" class="w-full p-3 border border-slate-200 rounded-lg"
              :disabled="!isEditable && !isViewMode" />
            <span class="text-red-500 text-sm">{{ errors[key] }}</span>
          </div>
        </div>
      </div>

      <!-- Supporting Documents -->
      <div class="bg-white p-8 rounded-lg shadow-lg mb-12">
        <h2 class="text-3xl font-serif font-bold text-slate-900 mb-6">Supporting Documents</h2>

        <!-- Existing documents list -->
        <div v-if="form.documents.length > 0" class="mb-6">
          <h3 class="text-base font-medium mb-3">Uploaded Documents</h3>
          <div class="space-y-4">
            <div v-for="(doc, index) in form.documents" :key="index"
              class="flex items-start justify-between p-4 bg-slate-50 rounded-lg">
              <div class="flex-grow">
                <p class="font-medium text-slate-900">{{ doc.documentType }}</p>
                <p class="text-sm text-slate-600">{{ doc.fileName }}</p>
                <p v-if="doc.remarks" class="text-sm text-slate-500 mt-1">Remarks: {{ doc.remarks }}</p>
              </div>
              <button @click="removeDocument(index)" type="button" :disabled="!isEditable && !isViewMode"
                class="text-red-500 hover:text-red-700 disabled:opacity-50">
                Remove
              </button>
            </div>
          </div>
        </div>

        <!-- Add new document form -->
        <div v-if="isEditable || isViewMode" class="grid grid-cols-1 gap-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-slate-600 text-sm font-medium mb-2">Document Type</label>
              <select v-model="newDocument.documentType" class="w-full p-3 border border-slate-200 rounded-lg"
                :disabled="!isEditable && !isViewMode">
                <option value="">Select Document Type</option>
                <option v-for="type in documentTypes" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-slate-600 text-sm font-medium mb-2">Upload Document</label>
              <input type="file" @change="handleFileUpload" class="w-full p-2 border border-slate-200 rounded-lg"
                :disabled="!isEditable && !isViewMode" />
            </div>
          </div>
          <div>
            <label class="block text-slate-600 text-sm font-medium mb-2">Remarks (Optional)</label>
            <input v-model="newDocument.remarks" type="text" class="w-full p-3 border border-slate-200 rounded-lg"
              :disabled="!isEditable && !isViewMode" placeholder="Add any additional notes here" />
          </div>
          <div>
            <button type="button" @click="addDocument"
              :disabled="!newDocument.documentType || !newDocument.fileName || (!isEditable && !isViewMode)"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              Add Document
            </button>
          </div>
        </div>
        <span class="text-red-500 text-sm">{{ errors.documents }}</span>
      </div>

      <!-- Form Actions -->
      <div class="flex gap-4">
        <button type="button" @click="toggleEdit"
          class="inline-flex items-center px-6 py-3 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors">
          {{ isEditable ? 'Cancel' : 'Edit' }}
        </button>
        <button type="submit" :disabled="!isEditable && !isViewMode"
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          Update
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';

const props = defineProps({
  application: {
    type: Object,
    required: true,
  },
  isViewMode: {
    type: Boolean,
    default: false,
  },
});

const isEditable = ref(false);
const initialFormState = {
  cid: '',
  fullName: '',
  dateOfBirth: '',
  contactNumber: '',
  emailAddress: '',
  studyInCountry: '',
  qualification: '',
  type_of_course: '',
  std_id: '',
  institute: '',
  university: '',
  course_duration: '',
  year_completion: '',
  location: '',
  country: '',
  website: '',
  documents: [], // New field for documents array
};

const form = reactive({ ...initialFormState });
const errors = ref({});

// New document state
const newDocument = reactive({
  documentType: '',
  fileName: '',
  remarks: '',
  file: null
});

// Field configurations
const personalFields = {
  cid: { label: 'CID', type: 'text', maxLength: 11 },
  fullName: { label: 'Full Name', type: 'text' },
  dateOfBirth: { label: 'Date of Birth', type: 'date' },
  contactNumber: { label: 'Contact Number', type: 'tel', maxLength: 11 },
  emailAddress: { label: 'Email Address', type: 'email' },
};

const dropdownFields = {
  qualification: {
    label: 'Qualification',
    options: ['Diploma', 'Certificate'],
  },
  type_of_course: {
    label: 'Type of Course',
    options: ['Full Time', 'Part Time', 'Distance Learning', 'Online'],
  },
};

const educationFields = {
  std_id: { label: 'Std ID No' },
  institute: { label: 'Name of the Institute' },
  university: { label: 'Name of the University' },
  course_duration: { label: 'Duration of Course' },
  year_completion: { label: 'Year of Completion' },
  location: { label: 'Location' },
  country: { label: 'Country' },
  website: { label: 'Website' },
};

const documentTypes = ['Degree Certificate', 'Diploma Certificate', 'Transcript', 'Other'];

// Add new document
const addDocument = () => {
  if (newDocument.documentType && newDocument.fileName) {
    form.documents.push({
      documentType: newDocument.documentType,
      fileName: newDocument.fileName,
      remarks: newDocument.remarks,
      file: newDocument.file
    });

    // Reset new document form
    Object.assign(newDocument, {
      documentType: '',
      fileName: '',
      remarks: '',
      file: null
    });
  }
};

// Remove document
const removeDocument = (index) => {
  form.documents.splice(index, 1);
};

const resetForm = () => {
  Object.assign(form, initialFormState);
}

// Form validation
const validateForm = () => {
  errors.value = {};

  // CID validation
  if (!form.cid) {
    errors.value.cid = 'CID is required';
  } else if (!/^\d{11}$/.test(form.cid)) {
    errors.value.cid = 'CID must be 11 digits';
  }

  // Contact number validation
  if (!form.contactNumber) {
    errors.value.contactNumber = 'Contact number is required';
  } else if (!/^(16|17|77)\d{6}$/.test(form.contactNumber)) {
    errors.value.contactNumber = 'Contact must start with 17 or 77 and be 8 digits';
  }

  // Required field validation
  const requiredFields = {
    fullName: 'Full name',
    dateOfBirth: 'Date of birth',
    emailAddress: 'Email',
    qualification: 'Qualification',
    type_of_course: 'Course type',
    std_id: 'Student ID',
    institute: 'Institute name',
    university: 'University name',
    course_duration: 'Course duration',
    location: 'Location',
    country: 'Country',
    website: 'Website',
  };

  Object.entries(requiredFields).forEach(([field, label]) => {
    if (!form[field]) {
      errors.value[field] = `${label} is required`;
    }
  });

  // Document validation
  if (form.documents.length === 0) {
    errors.value.documents = 'At least one document is required';
  }
};

// Form submission
const handleUpdate = () => {
  validateForm();
  if (Object.keys(errors.value).length === 0) {
    console.log('Form Update:', form);
    alert('Form Updated successfully');
    isEditable.value = false;
  } else {
    alert('Please fix the errors in the form');
  }
};

// Toggle edit mode
const toggleEdit = () => {
  if (isEditable.value) {
    // Reset form to initial values when canceling
    resetForm();
  }
  isEditable.value = !isEditable.value;
};

// Updated file upload handler
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    newDocument.fileName = file.name;
    newDocument.file = file;
  }
};

watch(
  () => props.application,
  (newApplication) => {
    if (newApplication) {
      // Handle existing form data
      Object.assign(form, {
        ...newApplication,
        documents: newApplication.documents || []
      });
    }
  },
  { immediate: true }
);
</script>