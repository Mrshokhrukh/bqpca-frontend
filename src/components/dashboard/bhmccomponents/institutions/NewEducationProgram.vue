<template>
  <div class="p-6 bg-gray-50 rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold text-gray-900 mb-6">New Educational Programme Application</h2>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center my-8">
      <div class="inline-block animate-spin text-blue-600 text-3xl">⌛</div>
      <p class="ml-2 text-gray-600">Loading institute data...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="apiError" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
      <p class="font-medium">{{ errorMessage }}</p>
      <p class="mt-2">Please try again later or contact support.</p>
    </div>

    <!-- No institute found -->
    <div v-else-if="!userInstitute && !isLoading"
      class="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg mb-6">
      <p class="font-medium">No institute information found</p>
      <p class="mt-2">Please ensure you have registered your institute before applying for a new educational program.
      </p>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Proponent Details -->
      <section>
        <h3 class="text-xl font-medium text-gray-900 mb-4">Proponent Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Training Institute Name
            </label>
            <div class="mt-1 p-2 bg-gray-100 rounded-md border border-gray-200">
              {{ userInstitute.name_of_institution }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Country
            </label>
            <div class="mt-1 p-2 bg-gray-100 rounded-md border border-gray-200">
              {{ userInstitute.country }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Dzongkhag/Throme
            </label>
            <div class="mt-1 p-2 bg-gray-100 rounded-md border border-gray-200">
              {{ userInstitute.dzongkhag }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              City/Gewog
            </label>
            <div class="mt-1 p-2 bg-gray-100 rounded-md border border-gray-200">
              {{ userInstitute.gewog }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Address/Location
            </label>
            <div class="mt-1 p-2 bg-gray-100 rounded-md border border-gray-200">
              {{ userInstitute.address }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Contact No.
            </label>
            <div class="mt-1 p-2 bg-gray-100 rounded-md border border-gray-200">
              {{ userInstitute.contact_no }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div class="mt-1 p-2 bg-gray-100 rounded-md border border-gray-200">
              {{ userInstitute.email_address }}
            </div>
          </div>
        </div>
      </section>

      <!-- Head of Institution Details -->
      <section>
        <h3 class="text-xl font-medium text-gray-900 mb-4">Head of Institution Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Name
            </label>
            <div class="mt-1 p-2 bg-gray-100 rounded-md border border-gray-200">
              {{ userInstitute.head_of_institution_name }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <div class="mt-1 p-2 bg-gray-100 rounded-md border border-gray-200">
              {{ userInstitute.head_of_institution_phone_number }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div class="mt-1 p-2 bg-gray-100 rounded-md border border-gray-200">
              {{ userInstitute.head_of_institution_email }}
            </div>
          </div>
        </div>
      </section>

      <!-- Website -->
      <section>
        <h3 class="text-xl font-medium text-gray-900 mb-4">Website</h3>
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Website
          </label>
          <div class="mt-1 p-2 bg-gray-100 rounded-md border border-gray-200">
            {{ userInstitute.website }}
          </div>
        </div>
      </section>

      <!-- Proposal Details - Editable by user -->
      <section>
        <h3 class="text-xl font-medium text-gray-900 mb-4">Proposal Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="proposalTitle" class="block text-sm font-medium text-gray-700">
              Proposal Title <span class="text-red-500">*</span>
            </label>
            <input type="text" id="proposalTitle" v-model="formData.course_title" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            <p v-if="validationErrors.course_title" class="mt-1 text-sm text-red-600">{{ validationErrors.course_title
              }}</p>
          </div>
          <div>
            <label for="duration" class="block text-sm font-medium text-gray-700">
              Duration (in months) <span class="text-red-500">*</span>
            </label>
            <input type="number" id="duration" v-model.number="formData.duration_in_months" required min="1"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            <p v-if="validationErrors.duration_in_months" class="mt-1 text-sm text-red-600">{{
              validationErrors.duration_in_months }}</p>
          </div>
          <div>
            <label for="commencementDate" class="block text-sm font-medium text-gray-700">
              Commencement Date <span class="text-red-500">*</span>
            </label>
            <input type="date" id="commencementDate" v-model="formData.commencement_date" required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            <p v-if="validationErrors.commencement_date" class="mt-1 text-sm text-red-600">{{
              validationErrors.commencement_date }}</p>
          </div>
          <div>
            <label for="attachments" class="block text-sm font-medium text-gray-700">
              Attachments (if any)
            </label>
            <input type="file" id="attachments" @change="handleFileUpload"
              class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
            <p class="mt-1 text-sm text-gray-500" id="file_input_help">You can attach relevant documents here.</p>
            <p v-if="selectedFileName" class="mt-1 text-sm text-green-600">Selected: {{ selectedFileName }}</p>
          </div>
        </div>
        <div class="mt-4">
          <label for="remarks" class="block text-sm font-medium text-gray-700">
            Remarks
          </label>
          <textarea id="remarks" v-model="formData.remarks" rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
        </div>
      </section>

      <!-- Declaration -->
      <div class="flex items-start">
        <div class="flex items-center h-5">
          <input id="declaration" aria-describedby="declaration-description" type="checkbox"
            v-model="formData.ins_declaration" required
            class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
        </div>
        <div class="ml-3 text-sm">
          <label for="declaration" class="font-medium text-gray-700">Declaration <span
              class="text-red-500">*</span></label>
          <p id="declaration-description" class="text-gray-500">
            I hereby declare that the information provided above is true and correct to the best of my knowledge.
          </p>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex justify-end space-x-4">
        <button type="button"
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          @click="handleCancel">
          Cancel
        </button>
        <button type="button"
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          @click="handleSaveDraft" :disabled="isSubmitting">
          Save as Draft
        </button>
        <button type="submit" :disabled="isSubmitting || !formData.ins_declaration"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          :class="{ 'opacity-50 cursor-not-allowed': isSubmitting || !formData.ins_declaration }">
          <span v-if="isSubmitting">Submitting...</span>
          <span v-else>Submit</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from 'vue-toastification';
import bmhcService from '@/services/bmhcservices';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

// State variables
const userInstitute = ref(null);
const isLoading = ref(true);
const isSubmitting = ref(false);
const apiError = ref(false);
const errorMessage = ref('');
const validationErrors = ref({});
const selectedFileName = ref('');
const selectedFile = ref(null);

// Form data structure that matches what the backend course details API expects
const formData = ref({
  course_title: '',
  duration_in_months: null,
  commencement_date: '',
  institute_attachments: null,
  remarks: '',
  ins_declaration: false,
  // Additional fields will be generated with default values if required by the API
  ins_renewal_review_name: '',
  ins_review_summary: '',
  ins_report: '',
  ins_review_decision: 'Pending',
  ins_reason_if_rejected: '',
  ins_remarks: '',
  is_active: true,
  // Institute ID will be added from userInstitute
  institute: null,
  // Adding institute name field
  institute_name: ''
});

// Get user CID from auth store
const userCid = computed(() => {
  return authStore.user?.cid || '';
});

// Fetch institute data based on user CID
const fetchInstituteData = async () => {
  if (!userCid.value) {
    errorMessage.value = 'User information not available. Please log in again.';
    apiError.value = true;
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  apiError.value = false;

  try {
    const response = await bmhcService.getBmhcInstitutes();

    if (response && response.data && response.data.results) {
      // Filter institutes to find one matching the user's CID
      const userInstitutes = response.data.results.filter(institute =>
        institute.CID.toLowerCase() === userCid.value.toLowerCase()
      );

      if (userInstitutes.length > 0) {
        userInstitute.value = userInstitutes[0];
        // Set the institute ID and name for the form data
        formData.value.institute = userInstitute.value.id;
        formData.value.institute_name = userInstitute.value.name_of_institution;
      } else {
        errorMessage.value = 'No institute found for your CID. Please register your institute first.';
        apiError.value = true;
      }
    } else {
      errorMessage.value = 'Unable to retrieve institute data.';
      apiError.value = true;
    }
  } catch (error) {
    console.error('Error fetching institute data:', error);
    errorMessage.value = error.response?.data?.message || 'Error fetching institute data. Please try again.';
    apiError.value = true;
  } finally {
    isLoading.value = false;
  }
};

// File upload handler
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    selectedFileName.value = file.name;
  } else {
    selectedFile.value = null;
    selectedFileName.value = '';
  }
};

// Validate form data
const validateForm = () => {
  const errors = {};

  if (!formData.value.course_title.trim()) {
    errors.course_title = 'Proposal title is required';
  }

  if (!formData.value.duration_in_months || formData.value.duration_in_months <= 0) {
    errors.duration_in_months = 'Duration must be a positive number';
  }

  if (!formData.value.commencement_date) {
    errors.commencement_date = 'Commencement date is required';
  }

  validationErrors.value = errors;
  return Object.keys(errors).length === 0;
};

// This function is not needed since the course details API handles file uploads directly

// Form submission handler
const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error('Please correct the errors in the form');
    return;
  }

  if (!formData.value.ins_declaration) {
    toast.error('Please accept the declaration');
    return;
  }

  isSubmitting.value = true;

  try {
    // Prepare data for submission using FormData to handle file upload
    const submissionData = new FormData();

    // Add all form fields to FormData
    Object.keys(formData.value).forEach(key => {
      if (key !== 'institute_attachments') { // Handle file separately
        submissionData.append(key, formData.value[key]);
      }
    });

    // Ensure number fields are sent properly
    submissionData.set('duration_in_months', Number(formData.value.duration_in_months));

    // Add file if selected
    if (selectedFile.value) {
      submissionData.append('institute_attachments', selectedFile.value);
    }

    // Submit form data to course details API with proper headers for multipart/form-data
    await bmhcService.createBmhcCourseDetail(submissionData);

    toast.success('Educational programme application submitted successfully!');

    // Redirect to appropriate page (e.g., a list view of submitted programs)
    router.push('/bmhc/course-applications');

  } catch (error) {
    console.error('Error submitting form:', error);

    // Handle validation errors from API
    if (error.response?.data?.errors) {
      validationErrors.value = error.response.data.errors;
      toast.error('Please correct the errors in the form');
    } else {
      toast.error(error.response?.data?.message || 'Failed to submit application. Please try again.');
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Save as draft handler - can be adjusted based on your backend implementation
const handleSaveDraft = async () => {
  try {
    isSubmitting.value = true;

    // Prepare draft data using FormData for file upload
    const draftData = new FormData();

    // Add all form fields to FormData
    Object.keys(formData.value).forEach(key => {
      if (key !== 'institute_attachments') { // Handle file separately
        draftData.append(key, formData.value[key]);
      }
    });

    // Set draft status
    draftData.append('ins_review_decision', 'Draft'); // May need to change this based on your API requirements

    // Ensure number fields are sent properly
    draftData.set('duration_in_months', Number(formData.value.duration_in_months));

    // Add file if selected
    if (selectedFile.value) {
      draftData.append('institute_attachments', selectedFile.value);
    }

    // Submit as draft
    await bmhcService.createBmhcCourseDetail(draftData);

    toast.success('Draft saved successfully!');

  } catch (error) {
    console.error('Error saving draft:', error);
    toast.error(error.response?.data?.message || 'Failed to save draft. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};

// Cancel handler
const handleCancel = () => {
  // Navigate back or to a specified route
  router.go(-1); // Go back to previous page
};

// Fetch institute data on component mount
onMounted(fetchInstituteData);
</script>

<style scoped>
/* Component-specific styles */
</style>