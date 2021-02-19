<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Form Header with enhanced gradient and animation -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Continuous Professional Development (CPD) Application
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Please fill in all required fields marked with an asterisk (<span class="text-red-600">*</span>). Ensure all
        information provided is accurate and up-to-date.
      </p>
    </div>

      <form @submit.prevent="handleSubmit" class="bg-white border-0 rounded-2xl shadow-xl overflow-hidden">
        <!-- Hidden fields -->
        <input type="hidden" v-model="form.registrationNumber" />
        <input type="hidden" v-model="form.cidNumber" />
        <input type="hidden" v-model="form.fullName" />
        <input type="hidden" v-model="form.gender" />

        <!-- CPD Details Section -->
        <div class="bg-gradient-to-r from-gray-50 to-gray-100 p-8">
          <h3 class="text-xl font-bold text-gray-900">CPD Details</h3>
          <p class="mt-2 text-gray-600">Please provide detailed information about your CPD activity</p>
        </div>

        <div class="p-8 space-y-8">
          <!-- Form Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Title of CPD -->
            <div class="space-y-2">
              <label for="cpdTitle" class="text-sm font-medium text-gray-700 flex items-center">
                Title of CPD
                <span class="text-red-500 ml-1">*</span>
              </label>
              <input id="cpdTitle" v-model="form.cpdTitle" type="text"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required placeholder="Enter CPD title" />
              <span v-if="errors.cpdTitle" class="text-sm text-red-500 block">{{ errors.cpdTitle }}</span>
            </div>

            <!-- Relevance -->
            <div class="space-y-2">
              <label for="relevance" class="text-sm font-medium text-gray-700 flex items-center">
                Professional Relevance
                <span class="text-red-500 ml-1">*</span>
              </label>
              <input id="relevance" v-model="form.relevance" type="text"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required placeholder="Describe relevance to your profession" />
              <span v-if="errors.relevance" class="text-sm text-red-500 block">{{ errors.relevance }}</span>
            </div>

            <!-- Participation Category -->
            <div class="space-y-2">
              <label for="participationCategory" class="text-sm font-medium text-gray-700 flex items-center">
                Participation Category
                <span class="text-red-500 ml-1">*</span>
              </label>
              <select id="participationCategory" v-model="form.participationCategory" @change="handleCategoryChange"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                required>
                <option value="" disabled selected>Select category</option>
                <option v-for="category in participationCategories" :key="category.id" :value="category.id">
                  {{ category.participation_category_name }}
                </option>
              </select>
              <span v-if="errors.participationCategory" class="text-sm text-red-500 block">
                {{ errors.participationCategory }}
              </span>
            </div>

            <!-- Sub Category -->
            <div class="space-y-2">
              <label for="participantSubCategory" class="text-sm font-medium text-gray-700 flex items-center">
                Participant Sub-category
                <span class="text-red-500 ml-1">*</span>
              </label>
              <select id="participantSubCategory" v-model="form.participantSubCategory"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                required>
                <option value="" disabled selected>Select sub-category</option>
                <option v-for="subCategory in filteredSubCategories" :key="subCategory.id" :value="subCategory.id">
                  {{ subCategory.participation_sub_category_name }}
                </option>
              </select>
              <span v-if="errors.participantSubCategory" class="text-sm text-red-500 block">
                {{ errors.participantSubCategory }}
              </span>
            </div>

            <!-- Activity Type -->
            <div class="space-y-2">
              <label for="activityType" class="text-sm font-medium text-gray-700 flex items-center">
                CPD Activity Type
                <span class="text-red-500 ml-1">*</span>
              </label>
              <select id="activityType" v-model="form.activityType"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                required>
                <option value="" disabled selected>Select activity type</option>
                <option v-for="activity in cpdActivities" :key="activity.id" :value="activity.id">
                  {{ activity.cpd_activity_name }}
                </option>
              </select>
              <span v-if="errors.activityType" class="text-sm text-red-500 block">
                {{ errors.activityType }}
              </span>
            </div>

            <!-- File Upload -->
            <div class="space-y-2">
              <label for="attachment" class="text-sm font-medium text-gray-700">
                Supporting Documents
              </label>
              <div class="relative">
                <input id="attachment" type="file" @change="handleFileUpload"
                  class="w-full px-4 py-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors focus:outline-none" />
                <p class="mt-2 text-sm text-gray-500 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  PDF, DOC, JPG, PNG (Max: 2MB)
                </p>
              </div>
              <span v-if="errors.attachment" class="text-sm text-red-500 block">
                {{ errors.attachment }}
              </span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="bg-gray-50 px-8 py-6 flex justify-end space-x-4">
          <button type="button" @click="handleCancel"
            class="px-6 py-3 rounded-xl text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Cancel
          </button>
          <button type="submit"
            class="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Submit Application
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, computed } from 'vue'
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/authStore';
import apiService from '@/services/services';


const toast = useToast();
const authStore = useAuthStore();

const cpdActivities = ref([]);
const participationCategories = ref([]);
const participationSubCategories = ref([]);


const form = reactive({
  registrationNumber: '',
  cidNumber: '',
  fullName: '',
  gender: '',
  cpdTitle: '',
  relevance: '',
  participationCategory: '',
  participantSubCategory: '',
  activityType: '',
  attachment: null,
})

const errors = reactive({})

// Computed property for filtered subcategories
const filteredSubCategories = computed(() => {
  if (!form.participationCategory) {
    return []; // Return empty array if no category is selected
  }
  return participationSubCategories.value.filter(
    subCategory => subCategory.participation_category_name === form.participationCategory
  );
});

const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key]);
  let isValid = true;

  if (!form.cpdTitle) { errors.cpdTitle = 'CPD Title is required'; isValid = false; }
  if (!form.relevance) { errors.relevance = 'Relevance is required'; isValid = false; }
  if (!form.participationCategory) { errors.participationCategory = 'Participation Category is required'; isValid = false; }
  if (!form.participantSubCategory) { errors.participantSubCategory = 'Participant Sub-category is required'; isValid = false; }
  if (!form.activityType) { errors.activityType = 'Activity Type is required'; isValid = false; }

  if (form.attachment && form.attachment.size > 2 * 1024 * 1024) {
    errors.attachment = 'Attachment size should not exceed 2MB';
    isValid = false;
  }

  return isValid;
}

const fetchRegistrationNumber = async (cid) => {
  try {
    const response = await apiService.getApplicationsByCid(cid);
    if (response.data && response.data.length > 0) {
      return response.data[0].registration_no;
    }
    return null;
  } catch (error) {
    toast.error("Failed to fetch registration number: " + error.message);
    console.error("Error fetching registration number:", error);
    return null;
  }
};

const handleSubmit = async () => {
  if (validateForm()) {
    const formData = new FormData();

    for (const key in form) {
      if (form[key] instanceof File) {
        formData.append(key, form[key]);
      } else {
        formData.append(key, form[key] || '');
      }
    }

    try {
      // Simulate submission
      // const response = await apiService.submitCPDApplication(formData);

      setTimeout(() => {
        toast.success('CPD Registration submitted successfully!');
        console.log('Form submitted:', Object.fromEntries(formData));
        handleCancel();
      }, 500);

    } catch (error) {
      toast.error('Submission failed: ' + error.message);
      console.error("Error submitting form:", error);
    }
  } else {
    toast.error('Please correct the errors in the form.');
  }
}

const handleCancel = () => {
  form.cpdTitle = '';
  form.relevance = '';
  form.participationCategory = '';
  form.participantSubCategory = '';
  form.activityType = '';
  form.attachment = null;
  Object.keys(errors).forEach(key => delete errors[key]);
}

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  form.attachment = file;
  if (file && file.size > 2 * 1024 * 1024) {
    errors.attachment = 'Attachment size should not exceed 2MB';
    form.attachment = null;
  } else {
    delete errors.attachment;
  }
}

const handleCategoryChange = () => {
  // Reset subcategory when category changes
  form.participantSubCategory = '';
};


const fetchMasterData = async () => {
  try {
    const [activitiesResponse, categoriesResponse, subCategoriesResponse] = await Promise.all([
      apiService.getMastersCpdActivities(),
      apiService.getMastersParticipationCategories(),
      apiService.getMastersParticipationSubCategories()
    ]);

    cpdActivities.value = activitiesResponse.data.results;
    participationCategories.value = categoriesResponse.data.results;
    participationSubCategories.value = subCategoriesResponse.data.results;


  } catch (error) {
    toast.error("Failed to fetch master data: " + error.message);
    console.error("Error fetching master data:", error);
  }
};

onMounted(async () => {

  if (authStore.user) {
    form.cidNumber = authStore.user.cid;
    form.fullName = authStore.user.fullName;
    form.gender = authStore.user.gender;

    const registrationNumber = await fetchRegistrationNumber(form.cidNumber);
    if (registrationNumber) {
      form.registrationNumber = registrationNumber;
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
