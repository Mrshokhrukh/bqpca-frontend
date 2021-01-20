<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <form @submit.prevent="handleUpdate">
      <!-- Personal Information -->
      <div class="bg-white p-8 rounded-lg shadow-lg mb-12">
        <h2 class="text-3xl font-serif font-bold text-slate-900 mb-6">Personal Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="(field, key) in personalFields" :key="key">
            <label class="block text-slate-600 text-base mb-2">{{ field.label }}</label>
            <input
              v-model="form[key]"
              :type="field.type"
              :maxlength="field.maxLength"
              class="w-full p-3 border border-slate-200 rounded-lg"
              :disabled="!isEditable"
            />
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
                <input
                  v-model="form.studyInCountry"
                  type="radio"
                  :value="option"
                  class="mr-2"
                  :disabled="!isEditable"
                />
                {{ option.charAt(0).toUpperCase() + option.slice(1) }}
              </label>
            </div>
          </div>

          <!-- Dropdowns -->
          <div v-for="(field, key) in dropdownFields" :key="key">
            <label class="block text-slate-600 text-base mb-2">{{ field.label }}</label>
            <select
              v-model="form[key]"
              class="w-full p-3 border border-slate-200 rounded-lg"
              :disabled="!isEditable"
            >
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
            <input
              v-model="form[key]"
              type="text"
              class="w-full p-3 border border-slate-200 rounded-lg"
              :disabled="!isEditable"
            />
            <span class="text-red-500 text-sm">{{ errors[key] }}</span>
          </div>
        </div>
      </div>

       <!-- Updated Supporting Documents Section -->
       <div class="bg-white p-8 rounded-lg shadow-lg mb-12">
        <h2 class="text-lg font-semibold mb-4">Supporting Documents</h2>

        <!-- Document List -->
        <div v-for="(doc, index) in form.documents" :key="index" class="mb-6 border-b pb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block mb-1">Document Type</label>
              <select
                v-model="doc.documentType"
                class="w-full p-2 border rounded"
                :disabled="!isEditable"
              >
                <option value="">Select Document Type</option>
                <option v-for="type in documentTypes" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
              <span class="text-red-500 text-sm">{{ errors.documents?.[index]?.documentType }}</span>
            </div>

            <div>
              <label class="block mb-1">Upload Document</label>
              <div class="relative">
                <input
                  type="file"
                  @change="(e) => handleFileUpload(e, index)"
                  class="w-full p-2 border rounded"
                  :disabled="!isEditable"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <span v-if="doc.file" class="text-sm text-green-600 mt-1 block">
                  Selected: {{ doc.file.name }}
                </span>
              </div>
              <span class="text-red-500 text-sm">{{ errors.documents?.[index]?.file }}</span>
            </div>

            <div>
              <label class="block text-slate-600 text-base mb-2">Remarks</label>
              <input
                v-model="doc.remarks"
                type="text"
                class="w-full p-3 border border-slate-200 rounded-lg"
                :disabled="!isEditable"
              />
              <span class="text-red-500 text-sm">{{ errors.documents?.[index]?.remarks }}</span>
            </div>

            <div class="flex items-end">
              <button
                type="button"
                @click="removeDocument(index)"
                class="text-red-500 hover:text-red-700 px-4 py-2"
                :disabled="!isEditable || form.documents.length <= 1"
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        <!-- Add Document Button -->
        <button
          type="button"
          @click="addDocument"
          class="mt-4 inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors"
          :disabled="!isEditable"
        >
          Add Another Document
        </button>
      </div>
      <!-- Form Actions -->
      <div class="flex gap-4">
        <button
          type="button"
          @click="toggleEdit"
          class="inline-flex items-center px-6 py-3 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors"
        >
          {{ isEditable ? 'Cancel' : 'Edit' }}
        </button>
        <button
          type="submit"
          :disabled="!isEditable"
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
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

const documentTypes = ['Degree Certificate', 'Diploma Certificate', 'Transcript', 'Other'];

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

// Toggle edit mode
const toggleEdit = () => {
  if (isEditable.value) {
    // Reset form to initial values when canceling
    Object.assign(form, initialFormState);
  }
  isEditable.value = !isEditable.value;
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    console.log('File selected:', file.name);
  }
};


</script>
