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
              class="w-full p-3 border border-slate-200 rounded-lg" :disabled="!isEditable" />
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
                  :disabled="!isEditable" />
                {{ option.charAt(0).toUpperCase() + option.slice(1) }}
              </label>
            </div>
          </div>

          <!-- Dropdowns -->
          <div v-for="(field, key) in dropdownFields" :key="key">
            <label class="block text-slate-600 text-base mb-2">{{ field.label }}</label>
            <select v-model="form[key]" class="w-full p-3 border border-slate-200 rounded-lg" :disabled="!isEditable">
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
              :disabled="!isEditable" />
            <span class="text-red-500 text-sm">{{ errors[key] }}</span>
          </div>
        </div>
      </div>

      <!--multiDocUpload -->
      <div class="bg-white p-8 rounded-lg shadow-lg mb-12">
        <h2 class="text-lg font-semibold mb-4">Supporting Documents</h2>

        <!-- Document List -->
        <div v-for="(doc, index) in documents" :key="index" class="mb-6">
          <label class="block text-slate-600 text-base mb-2">{{ doc.type }}</label>
          <div class="flex items-center gap-4">
            <input type="file" multiple @change="handleFileUpload($event, index)" class="w-full p-2 border rounded"
              :disabled="!isEditable" />
            <button type="button" @click="removeCategory(index)"
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors" v-if="isEditable">
              Remove
            </button>
            <button type="button" @click="VewCategory(index)"
              class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
              View
            </button>

          </div>

        </div>

        <!-- Add Document Category -->
        <div v-if="isEditable" class="mt-4">
          <label class="block mb-2 text-slate-600">Add Document Category</label>
          <div class="flex gap-4">
            <select v-model="newCategory" class="p-2 border rounded w-full">
              <option value="" disabled>Select Document Type</option>
              <option v-for="type in documentTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
            <button type="button" @click="addCategory"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Add
            </button>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex gap-4">
        <button type="button" @click="toggleEdit"
          class="inline-flex items-center px-6 py-3 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors">
          {{ isEditable ? 'Cancel' : 'Edit' }}
        </button>
        <button type="submit" :disabled="!isEditable"
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          Update
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

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
  documentType: '',
  remarks: '',
  scondcopy: true,
  documents: [],
};

const form = reactive({ ...initialFormState });
const errors = ref({});

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
};

// Form submission
const handleUpdate = () => {
  validateForm();
  if (Object.keys(errors.value).length === 0) {
    console.log('Form Upadate:', form);
    alert('Form Upadate successfully');
    isEditable.value = false;
  } else {
    alert('Please fix the errors in the form');
  }
};

//Multi Docs Upload
// State variables
const documents = ref([
  { type: 'Degree', files: [] },
  { type: "Diploma", files: [] },
]);
const documentTypes = ref(['Degree', "Diploma", 'ID Card', 'Other']);
const newCategory = ref('');

// Methods
const handleFileUpload = (event, index) => {
  const uploadedFiles = Array.from(event.target.files);
  documents.value[index].files.push(...uploadedFiles);
};

const removeCategory = (index) => {
  documents.value.splice(index, 1);
};



const addCategory = () => {
  if (newCategory.value) {
    documents.value.push({ type: newCategory.value, files: [] });
    newCategory.value = ''; // Reset the input
  }
};

// Toggle edit mode
const toggleEdit = () => {
  if (isEditable.value) {
    // Reset form to initial values when canceling
    Object.assign(form, initialFormState);
  }
  isEditable.value = !isEditable.value;
};


</script>
