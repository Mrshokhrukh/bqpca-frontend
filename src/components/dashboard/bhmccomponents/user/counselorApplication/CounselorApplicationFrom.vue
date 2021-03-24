<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Form Header with gradient -->
      <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
        <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
          Counselling Form
        </h2>
        <p class="text-gray-600 text-center max-w-2xl mx-auto">
          Please fill in all required fields marked with an asterisk (<span class="text-red-600">*</span>).
          This form allows counselors to register their professional details.
        </p>
      </div>

      <!-- Loading Spinner -->
      <div v-if="isLoading" class="flex justify-center my-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit" class="bg-white border-0 rounded-2xl shadow-xl overflow-hidden">
        <!-- Personal Information Section (Hidden) -->
        <div class="sr-only">
          <input id="cid" v-model="form.cid" type="hidden" />
          <input id="registration_no" v-model="form.registration_no" type="hidden" />
          <input id="full_name" v-model="form.full_name" type="hidden" />
          <input id="gender" v-model="form.gender" type="hidden" />
        </div>

        <div class="p-8 space-y-8">
          <!-- Basic Info Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <!-- Contact Number (Editable) -->
            <div class="space-y-2">
              <label for="contact_no" class="text-sm font-medium text-gray-700 flex items-center">
                Contact Number
                <span class="text-red-500 ml-1">*</span>
              </label>
              <input id="contact_no" v-model="form.contact_no" type="text"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required placeholder="Enter your contact number" />
              <span v-if="errors.contact_no" class="text-sm text-red-500 block">{{ errors.contact_no
                }}</span>
            </div>

            <!-- Email Address (Editable) -->
            <div class="space-y-2">
              <label for="email_address" class="text-sm font-medium text-gray-700 flex items-center">
                Email Address
                <span class="text-red-500 ml-1">*</span>
              </label>
              <input id="email_address" v-model="form.email_address" type="email"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required placeholder="Enter your email address" />
              <span v-if="errors.email_address" class="text-sm text-red-500 block">{{ errors.email_address
                }}</span>
            </div>
          </div>

          <!-- Counselling Details Section -->
          <div class="pt-6 border-t border-gray-200">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Counselling Information</h3>
          </div>

          <!-- Counselling Title -->
          <div class="space-y-2">
            <label for="counselling_title" class="text-sm font-medium text-gray-700 flex items-center">
              Counselling Title/Specialization
              <span class="text-red-500 ml-1">*</span>
            </label>
            <input id="counselling_title" v-model="form.counselling_title" type="text"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required placeholder="E.g., Mental Health Counselor, Addiction Specialist, etc." />
            <span v-if="errors.counselling_title" class="text-sm text-red-500 block">{{
        errors.counselling_title }}</span>
          </div>

          <!-- Counselling Details -->
          <div class="space-y-2">
            <label for="counselling_details" class="text-sm font-medium text-gray-700 flex items-center">
              Counselling Details
              <span class="text-red-500 ml-1">*</span>
            </label>
            <textarea id="counselling_details" v-model="form.counselling_details" rows="4"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required placeholder="Describe your counselling approach, methodology, and services offered"></textarea>
            <span v-if="errors.counselling_details" class="text-sm text-red-500 block">{{
        errors.counselling_details }}</span>
          </div>

          <!-- Counselling Report -->
          <div class="space-y-2">
            <label for="counselling_report" class="text-sm font-medium text-gray-700 flex items-center">
              Counselling Report/Experience
              <span class="text-red-500 ml-1">*</span>
            </label>
            <textarea id="counselling_report" v-model="form.counselling_report" rows="4"
              class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required placeholder="Provide information about your past experience and outcomes"></textarea>
            <span v-if="errors.counselling_report" class="text-sm text-red-500 block">{{
        errors.counselling_report }}</span>
          </div>

          <!-- File Upload -->
          <div class="space-y-2">
            <label for="attachment" class="text-sm font-medium text-gray-700 flex items-center">
              Supporting Documents
              <span class="text-red-500 ml-1">*</span>
            </label>
            <div class="relative">
              <input id="attachment" type="file" @change="handleFileUpload" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                multiple
                class="w-full px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors focus:outline-none" />
              <p class="mt-2 text-sm text-gray-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                PDF, DOC, JPG, PNG (Max: 5MB per file)
              </p>
            </div>
            <div v-if="uploadedFiles.length > 0" class="mt-2">
              <p class="text-sm font-medium text-gray-700 mb-2">Uploaded Files:</p>
              <ul class="space-y-1">
                <li v-for="(file, index) in uploadedFiles" :key="index"
                  class="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-md">
                  <span class="text-sm text-blue-700">{{ file.name }}</span>
                  <button type="button" @click="removeFile(index)"
                    class="text-red-500 hover:text-red-700 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                </li>
              </ul>
            </div>
            <span v-if="errors.attachments" class="text-sm text-red-500 block">{{ errors.attachments
              }}</span>
          </div>

          <!-- Declaration Checkbox -->
          <div class="mt-6 space-y-4">
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input id="declaration" v-model="form.declaration" type="checkbox" required
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
              </div>
              <div class="ml-3 text-sm">
                <label for="declaration" class="font-medium text-gray-700">Declaration</label>
                <p class="text-gray-500">I hereby declare that the information provided is true and
                  accurate. I understand that any false information may result in the rejection of my
                  application.</p>
              </div>
            </div>
            <span v-if="errors.declaration" class="text-sm text-red-500 block">{{ errors.declaration
              }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="bg-gray-50 px-8 py-6 flex justify-end space-x-4">
          <button type="button" @click="handleCancel"
            class="px-6 py-3 rounded-xl text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Cancel
          </button>
          <button type="submit" :disabled="isSubmitting || !form.registration_no || !authStore.userId"
            class="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed">
            <span v-if="isSubmitting" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Submitting...
            </span>
            <span v-else>Submit Application</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import apiService from '@/services/services';

const toast = useToast();
const authStore = useAuthStore();
const router = useRouter();

const isLoading = ref(true);
const isSubmitting = ref(false);
const uploadedFiles = ref([]);

const form = reactive({
  cid: '',
  registration_no: '',
  full_name: '',
  gender: '',
  contact_no: '',
  email_address: '',
  counselling_title: '',
  counselling_details: '',
  counselling_report: '',
  attachments: [], // Will be populated during submit
  declaration: false
});

const errors = reactive({});

// Fetch registration number with user CID
const fetchRegistrationNumber = async (cid) => {
  try {
    const response = await apiService.getMhpcApplicationsByCid(cid);

    // Log the entire response to inspect the data structure
    console.log('Data from getMhpcApplicationsByCid:', response);
    console.log('Response data array:', response?.data);
    if (response?.data?.length > 0) {
      console.log('First application:', response.data[0]);
    }

    if (response && response.data && response.data.length > 0) {
      // Get the most recent application's registration number (assuming the first one is the most recent)
      form.registration_no = response.data[0].registration_no || '';
      return true;
    } else {
      toast.error('Unable to retrieve registration number. Please contact support.');
      return false;
    }
  } catch (error) {
    console.error('Error fetching registration number:', error);
    toast.error('Failed to fetch registration number: ' + (error.message || 'Unknown error'));
    return false;
  }
};

// Validate if user is a counselor and fetch required data
onMounted(async () => {
  console.log('Auth Store User:', authStore.user);

  if (!authStore.user?.is_counselor) {
    toast.error('Access restricted. You need counselor privileges to view this page.');
    router.push('/admin/user/health_certification/dashboard');
    return;
  }

  // Pre-fill form with user data from auth store
  if (authStore.user) {
    form.cid = authStore.user.cid || '';
    form.full_name = authStore.fullName || '';
    form.gender = authStore.gender || '';
    form.contact_no = authStore.contactNumber || '';
    form.email_address = authStore.email || '';

    // Fetch registration number using CID
    if (form.cid) {
      await fetchRegistrationNumber(form.cid);
    } else {
      toast.error('CID information is missing. Please update your profile first.');
    }
  }

  isLoading.value = false;
});

const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key]);
  let isValid = true;

  // Required fields validation
  if (!form.registration_no) {
    errors.registration_no = 'Registration number is required, but could not be retrieved';
    isValid = false;
  }

  if (!authStore.userId) {
    errors.user = 'User ID is required but not available';
    isValid = false;
  }

  if (!form.contact_no) {
    errors.contact_no = 'Contact number is required';
    isValid = false;
  } else if (!/^\d{8,12}$/.test(form.contact_no)) {
    errors.contact_no = 'Please enter a valid contact number';
    isValid = false;
  }

  if (!form.email_address) {
    errors.email_address = 'Email address is required';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email_address)) {
    errors.email_address = 'Please enter a valid email address';
    isValid = false;
  }

  if (!form.counselling_title) {
    errors.counselling_title = 'Counselling title is required';
    isValid = false;
  }

  if (!form.counselling_details) {
    errors.counselling_details = 'Counselling details are required';
    isValid = false;
  }

  if (!form.counselling_report) {
    errors.counselling_report = 'Counselling report is required';
    isValid = false;
  }

  if (uploadedFiles.value.length === 0) {
    errors.attachments = 'At least one supporting document is required';
    isValid = false;
  }

  if (!form.declaration) {
    errors.declaration = 'You must agree to the declaration';
    isValid = false;
  }

  return isValid;
};

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files);

  // Validate each file
  for (const file of files) {
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`File "${file.name}" exceeds 5MB limit`);
      continue;
    }

    // Add to uploaded files
    uploadedFiles.value.push(file);
  }

  // Clear the input to allow uploading the same file again if needed
  event.target.value = '';
};

const removeFile = (index) => {
  uploadedFiles.value.splice(index, 1);
};

const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error('Please correct the errors in the form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  isSubmitting.value = true;

  try {
    const formData = new FormData();

    // Append all form fields
    formData.append('cid', form.cid);
    formData.append('application', form.registration_no);
    formData.append('full_name', form.full_name);
    formData.append('gender', form.gender);
    formData.append('contact_no', form.contact_no);
    formData.append('email_address', form.email_address);
    formData.append('counselling_title', form.counselling_title);
    formData.append('counselling_details', form.counselling_details);
    formData.append('counselling_report', form.counselling_report);
    formData.append('declaration', form.declaration);

    // Add user ID
    formData.append('user', authStore.userId);

    // Append all files
    uploadedFiles.value.forEach((file) => {
      formData.append('attachments', file);
    });

    // Submit the form
    await apiService.createMhpcCounsellor(formData);

    toast.success('Counselor application submitted successfully!');
    router.push('/admin/user/health_certification/dashboard');
  } catch (error) {
    console.error('Error submitting form:', error);

    // Handle API errors
    if (error.response?.data) {
      const apiErrors = error.response.data;

      // Map API errors to form fields
      Object.keys(apiErrors).forEach(key => {
        if (Array.isArray(apiErrors[key])) {
          errors[key] = apiErrors[key][0];
        } else {
          errors[key] = apiErrors[key];
        }
      });

      // Show generic error if no field-specific errors
      if (Object.keys(errors).length === 0) {
        toast.error('Failed to submit form: ' + (error.response?.data?.detail || 'Unknown error'));
      } else {
        toast.error('Please correct the errors in the form');
      }
    } else {
      toast.error('Failed to submit form: ' + (error.message || 'Unknown error'));
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  router.push('/admin/user/health_certification/dashboard');
};
</script>
