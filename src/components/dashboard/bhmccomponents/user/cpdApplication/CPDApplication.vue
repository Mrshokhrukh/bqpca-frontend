<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 py-12">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Form Header -->
      <div
        class="relative bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-2xl p-8 mb-12 shadow-lg overflow-hidden">
        <div class="absolute inset-0 bg-indigo-200 opacity-10 animate-pulse-slow"></div>
        <h2 class="relative text-3xl font-extrabold text-gray-900 mb-4 text-center tracking-tight">
          Continuous Professional Development (CPD) Application
        </h2>
        <p class="relative text-gray-600 text-center max-w-2xl mx-auto text-sm sm:text-base">
          Complete all required fields marked with an <span class="text-red-600 font-semibold">*</span>. Ensure your
          information is accurate and current.
        </p>
      </div>

      <form @submit.prevent="handleSubmit"
        class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <!-- Hidden Fields -->
        <input type="hidden" v-model="form.registration_no" />
        <input type="hidden" v-model="form.cid_no" />
        <input type="hidden" v-model="form.full_name" />
        <input type="hidden" v-model="form.gender" />
        <input type="hidden" v-model="form.cpd_credit" /> <!-- Hidden CPD Credit (score) -->

        <!-- CPD Details Section -->
        <div class="bg-gradient-to-r from-gray-50 to-indigo-50 p-8">
          <h3 class="text-xl font-semibold text-gray-900">CPD Details</h3>
          <p class="mt-2 text-gray-600 text-sm">Provide detailed information about your CPD activity.</p>
        </div>

        <div class="p-8 space-y-10">
          <!-- Form Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <!-- Title of CPD -->
            <div class="space-y-2">
              <label for="title_of_cpd" class="text-sm font-medium text-gray-700 flex items-center">
                Title of CPD <span class="text-red-500 ml-1">*</span>
              </label>
              <input id="title_of_cpd" v-model="form.title_of_cpd" type="text"
                class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm hover:border-indigo-300"
                required placeholder="Enter CPD title" />
              <span v-if="errors.title_of_cpd" class="text-sm text-red-500 block">{{ errors.title_of_cpd }}</span>
            </div>

            <!-- Professional Relevance -->
            <div class="space-y-2">
              <label for="relevance_to_profession" class="text-sm font-medium text-gray-700 flex items-center">
                Professional Relevance <span class="text-red-500 ml-1">*</span>
              </label>
              <input id="relevance_to_profession" v-model="form.relevance_to_profession" type="text"
                class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm hover:border-indigo-300"
                required placeholder="Describe relevance to your profession" />
              <span v-if="errors.relevance_to_profession" class="text-sm text-red-500 block">{{
        errors.relevance_to_profession }}</span>
            </div>

            <!-- Participation Category -->
            <div class="space-y-2">
              <label for="participationCategory" class="text-sm font-medium text-gray-700 flex items-center">
                Participation Category <span class="text-red-500 ml-1">*</span>
              </label>
              <select id="participationCategory" v-model="form.participationCategory" @change="handleCategoryChange"
                class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm hover:border-indigo-300 appearance-none"
                required>
                <option value="" disabled selected>Select category</option>
                <option v-for="category in participationCategories" :key="category.id" :value="category.id">
                  {{ category.participation_category_name }}
                </option>
              </select>
              <span v-if="errors.participationCategory" class="text-sm text-red-500 block">{{
        errors.participationCategory }}</span>
            </div>

            <!-- Participant Sub-category -->
            <div class="space-y-2">
              <label for="participantSubCategory" class="text-sm font-medium text-gray-700 flex items-center">
                Participant Sub-category <span class="text-red-500 ml-1">*</span>
              </label>
              <select id="participantSubCategory" v-model="form.participantSubCategory"
                class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm hover:border-indigo-300 appearance-none"
                required>
                <option value="" disabled selected>Select sub-category</option>
                <option v-for="subCategory in filteredSubCategories" :key="subCategory.id" :value="subCategory.id">
                  {{ subCategory.participation_sub_category_name }}
                </option>
              </select>
              <span v-if="errors.participantSubCategory" class="text-sm text-red-500 block">{{
        errors.participantSubCategory }}</span>
            </div>

            <!-- Activity Type -->
            <div class="space-y-2">
              <label for="activityType" class="text-sm font-medium text-gray-700 flex items-center">
                CPD Activity Type <span class="text-red-500 ml-1">*</span>
              </label>
              <select id="activityType" v-model="form.activityType"
                class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm hover:border-indigo-300 appearance-none"
                required>
                <option value="" disabled selected>Select activity type</option>
                <option v-for="activity in cpdActivities" :key="activity.id" :value="activity.id">
                  {{ activity.cpd_activity_name }}
                </option>
              </select>
              <span v-if="errors.activityType" class="text-sm text-red-500 block">{{ errors.activityType }}</span>
            </div>

            <!-- File Upload -->
            <div class="space-y-2">
              <label for="attachment" class="text-sm font-medium text-gray-700">Supporting Documents</label>
              <div class="relative">
                <input id="attachment" type="file" @change="handleFileUpload"
                  class="w-full px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 hover:border-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200" />
                <p class="mt-2 text-xs text-gray-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  PDF, DOC, JPG, PNG (Max: 2MB)
                </p>
              </div>
              <span v-if="errors.attachment" class="text-sm text-red-500 block">{{ errors.attachment }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="bg-gray-50 px-8 py-6 flex justify-end space-x-4 border-t border-gray-100">
          <button type="button" @click="handleCancel"
            class="px-6 py-3 rounded-lg bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
            Cancel
          </button>
          <button type="submit" :disabled="isSubmitting"
            class="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/authStore';
import apiService from '@/services/services';
import { useRouter } from 'vue-router';  // Import useRouter

const toast = useToast();
const authStore = useAuthStore();
const router = useRouter(); // Initialize useRouter

const cpdActivities = ref([]);
const participationCategories = ref([]);
const participationSubCategories = ref([]);
const isSubmitting = ref(false); // Track submission status


const form = reactive({
  registration_no: '',
  cid_no: '',
  full_name: '',
  gender: '',
  title_of_cpd: '',
  relevance_to_profession: '',
  participationCategory: '',
  participantSubCategory: '',
  activityType: '',
  cpd_credit: 1,
  attachment: null,
});

const errors = reactive({});

// Filter subcategories based on selected category ID
const filteredSubCategories = computed(() => {
  if (!form.participationCategory) {
    return [];
  }
  return participationSubCategories.value.filter(
    subCategory => subCategory.participation_category_name === form.participationCategory // Compare IDs
  );
});

const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key]);
  let isValid = true;

  if (!form.title_of_cpd) { errors.title_of_cpd = 'CPD Title is required'; isValid = false; }
  if (!form.relevance_to_profession) { errors.relevance_to_profession = 'Relevance is required'; isValid = false; }
  if (!form.participationCategory) { errors.participationCategory = 'Participation Category is required'; isValid = false; }
  if (!form.participantSubCategory) { errors.participantSubCategory = 'Participant Sub-category is required'; isValid = false; }
  if (!form.activityType) { errors.activityType = 'Activity Type is required'; isValid = false; }
  if (form.attachment && form.attachment.size > 2 * 1024 * 1024) {
    errors.attachment = 'Attachment size should not exceed 2MB';
    isValid = false;
  }

  return isValid;
};

const fetchRegistrationNumber = async (cid) => {
  try {
    const response = await apiService.getApplicationsByCid(cid); // Ensure correct endpoint
    if (response.data && response.data.length > 0) {
      return response.data[0].id;
    }
    return null;
  } catch (error) {
    toast.error("Failed to fetch registration number: " + error.message);
    console.error("Error fetching registration number:", error);
    return null;
  }
};

const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error('Please correct the errors in the form.');
    return; // Stop if validation fails
  }

  isSubmitting.value = true; // Set submitting to true

  const formData = new FormData();

  // Correct gender mapping
  const genderToSend = form.gender === 'male' ? 'male' : (form.gender === 'female' ? 'female' : 'others');

  formData.append('registration_no', form.registration_no || '');
  formData.append('cid_no', form.cid_no || '');
  formData.append('full_name', form.full_name || '');
  formData.append('gender', genderToSend); // Use the transformed gender
  formData.append('title_of_cpd', form.title_of_cpd || '');
  formData.append('relevance_to_profession', form.relevance_to_profession || '');
  formData.append('participationCategory', form.participationCategory || '');
  formData.append('participantSubCategory', form.participantSubCategory || '');
  formData.append('activityType', form.activityType || '');
  formData.append('cpd_credit', form.cpd_credit);
  if (form.attachment) {
    formData.append('attachment', form.attachment);
  }


  try {
    const response = await apiService.createBmhcCpdRecord(formData);

    if (response.status >= 200 && response.status < 300) {
      toast.success('CPD Registration submitted successfully!');
      console.log('Form submitted:', Object.fromEntries(formData));
      // handleCancel(); // Reset form  -- No longer needed, we redirect.
      router.push('/admin/user/health_certification/dashboard'); // Redirect on success
    } else {
      toast.error('Submission failed. Server returned an error.');
      console.error("Server error:", response);

      // Display server-side validation errors, if provided
      if (response.data && response.data.errors) {
        for (const field in response.data.errors) {
          errors[field] = response.data.errors[field][0];
        }
      }
    }
  } catch (error) {
    toast.error('Submission failed: ' + error.message);
    console.error("Error submitting form:", error);
  } finally {
    isSubmitting.value = false; // Reset submitting status
  }
};

const handleCancel = () => {
  // Reset form fields
  form.title_of_cpd = '';
  form.relevance_to_profession = '';
  form.participationCategory = '';
  form.participantSubCategory = '';
  form.activityType = '';
  form.cpd_credit = 1;
  form.attachment = null;
  Object.keys(errors).forEach(key => delete errors[key]); // Clear errors
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  form.attachment = file;
  if (file && file.size > 2 * 1024 * 1024) {
    errors.attachment = 'Attachment size should not exceed 2MB';
    form.attachment = null; // Clear the file input
  } else {
    delete errors.attachment;
  }
};

const handleCategoryChange = () => {
  form.participantSubCategory = ''; // Reset subcategory on category change
};

const fetchMasterData = async () => {
  try {
    const [activitiesResponse, categoriesResponse, subCategoriesResponse] = await Promise.all([
      apiService.getMastersCpdActivities(),
      apiService.getMastersParticipationCategories(),
      apiService.getMastersParticipationSubCategories(),
    ]);

    cpdActivities.value = activitiesResponse.data.results;  // Verify .results structure
    participationCategories.value = categoriesResponse.data.results;
    participationSubCategories.value = subCategoriesResponse.data.results;
  } catch (error) {
    toast.error('Failed to fetch master data: ' + error.message);
    console.error('Error fetching master data:', error);
  }
};

onMounted(async () => {
  if (authStore.user) {
    form.cid_no = authStore.user.cid;
    form.full_name = `${authStore.user.first_name} ${authStore.user.middle_name ? authStore.user.middle_name : ''} ${authStore.user.last_name}`;
    form.gender = authStore.user.gender; // Keep original gender for display

    const registrationNumber = await fetchRegistrationNumber(form.cid_no);
    if (registrationNumber) {
      form.registration_no = registrationNumber;
    }
  }
  await fetchMasterData();
});

</script>

<style scoped>
.required::after {
  content: " *";
  color: #ef4444;
}
</style>
