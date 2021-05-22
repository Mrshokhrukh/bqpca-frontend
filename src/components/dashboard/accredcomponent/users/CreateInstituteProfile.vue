<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="mx-auto">
      <!-- Form Card -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
          <h2 class="text-2xl font-bold text-white">Institute Profile</h2>
          <p class="text-blue-100 mt-1">Manage your educational institute details</p>
        </div>

        <!-- Success/Error Messages -->
        <transition name="fade">
          <div v-if="successMessage" class="mx-6 mt-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded flex items-center">
            <CheckCircleIcon class="h-5 w-5 mr-2" />
            {{ successMessage }}
          </div>
        </transition>

        <transition name="fade">
          <div v-if="errorMessage" class="mx-6 mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded flex items-center">
            <ExclamationCircleIcon class="h-5 w-5 mr-2" />
            {{ errorMessage }}
          </div>
        </transition>

        <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
          <!-- Form Sections -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Basic Information Section -->
            <div class="md:col-span-2">
              <h3 class="text-lg font-medium text-gray-800 pb-2 border-b border-gray-200 mb-4">
                Basic Information
              </h3>
            </div>

            <!-- Institute Name -->
            <div>
              <label for="name_of_institution" class="block text-sm font-medium text-gray-700">
                Institute Name <span class="text-red-500">*</span>
              </label>
              <div class="mt-1 relative">
                <input
                  id="name_of_institution"
                  v-model="form.name_of_institution"
                  type="text"
                  required
                  class="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="errors.name_of_institution ? 'border-red-300' : 'border-gray-300'"
                  placeholder="Enter institute name"
                  :disabled="!isEditing"
                />
                <p v-if="errors.name_of_institution" class="mt-1 text-sm text-red-600">{{ errors.name_of_institution }}</p>
              </div>
            </div>

            <!-- Institute Type -->
            <div>
              <label for="type_of_institution" class="block text-sm font-medium text-gray-700">
                Institute Type <span class="text-red-500">*</span>
              </label>
              <div class="mt-1 relative">
                <select
                  id="type_of_institution"
                  v-model="form.type_of_institution"
                  required
                  class="block w-full pl-3 pr-10 py-2 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  :class="errors.type_of_institution ? 'border-red-300' : 'border-gray-300'"
                  :disabled="!isEditing || instituteTypes.length === 0"
                >
                  <option value="" disabled>Select Institute Type</option>
                  <option v-for="type in instituteTypes" :key="type.id" :value="type.id">
                    {{ type.name }}
                  </option>
                </select>
                <p v-if="errors.type_of_institution" class="mt-1 text-sm text-red-600">{{ errors.type_of_institution }}</p>
                <p v-if="instituteTypes.length === 0 && !isLoading && isEditing" class="mt-1 text-sm text-red-600">
                  Failed to load institute types. Please try again later.
                </p>
              </div>
            </div>

            <!-- Contact Information Section -->
            <div class="md:col-span-2">
              <h3 class="text-lg font-medium text-gray-800 pb-2 border-b border-gray-200 mb-4">
                Contact Information
              </h3>
            </div>

            <!-- Contact Email -->
            <div>
              <label for="email_address" class="block text-sm font-medium text-gray-700">
                Contact Email <span class="text-red-500">*</span>
              </label>
              <div class="mt-1 relative">
                <div class="flex rounded-md shadow-sm">
                  <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    <EnvelopeIcon class="h-4 w-4" />
                  </span>
                  <input
                    id="email_address"
                    v-model="form.email_address"
                    type="email"
                    required
                    class="flex-grow block w-full rounded-none rounded-r-md border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    :class="errors.email_address ? 'border-red-300' : 'border-gray-300'"
                    placeholder="institute@example.com"
                    :disabled="!isEditing"
                  />
                </div>
                <p v-if="errors.email_address" class="mt-1 text-sm text-red-600">{{ errors.email_address }}</p>
              </div>
            </div>

            <!-- Contact Number -->
            <div>
              <label for="contact_number" class="block text-sm font-medium text-gray-700">
                Contact number <span class="text-red-500">*</span>
              </label>
              <div class="mt-1 relative">
                <div class="flex rounded-md shadow-sm">
                  <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    <PhoneIcon class="h-4 w-4" />
                  </span>
                  <input
                    id="contact_number"
                    v-model="form.contact_number"
                    type="tel"
                    required
                    class="flex-grow block w-full rounded-none rounded-r-md border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    :class="errors.contact_number ? 'border-red-300' : 'border-gray-300'"
                    placeholder="+975 123 456 789"
                    :disabled="!isEditing"
                  />
                </div>
                <p v-if="errors.contact_number" class="mt-1 text-sm text-red-600">{{ errors.contact_number }}</p>
              </div>
            </div>

            <!-- Location Address -->
            <div class="md:col-span-2">
              <label for="location_address" class="block text-sm font-medium text-gray-700">
                Address <span class="text-red-500">*</span>
              </label>
              <div class="mt-1">
                <textarea
                  id="location_address"
                  v-model="form.location_address"
                  required
                  rows="3"
                  class="block w-full border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  :class="errors.location_address ? 'border-red-300' : 'border-gray-300'"
                  placeholder="Full address of your institute"
                  :disabled="!isEditing"
                ></textarea>
                <p v-if="errors.location_address" class="mt-1 text-sm text-red-600">{{ errors.location_address }}</p>
              </div>
            </div>

            <!-- Dzongkhag/Thromde/City -->
            <div class="md:col-span-2">
              <label for="dzongkhag_thromde_city" class="block text-sm font-medium text-gray-700">
                Dzongkhag <span class="text-red-500">*</span>
              </label>
              <div class="mt-1 relative">
                <select
                  id="dzongkhag_thromde_city"
                  v-model="form.dzongkhag_thromde_city"
                  required
                  class="block w-full pl-3 pr-10 py-2 text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  :class="errors.dzongkhag_thromde_city ? 'border-red-300' : 'border-gray-300'"
                  :disabled="!isEditing || dzongkhags.length === 0"
                >
                  <option value="" disabled>Select Dzongkhag</option>
                  <option v-for="dzongkhag in dzongkhags" :key="dzongkhag.id" :value="dzongkhag.id">
                    {{ dzongkhag.name }}
                  </option>
                </select>
                <p v-if="errors.dzongkhag_thromde_city" class="mt-1 text-sm text-red-600">{{ errors.dzongkhag_thromde_city }}</p>
                <p v-if="dzongkhags.length === 0 && !isLoading && isEditing" class="mt-1 text-sm text-red-600">
                  No Dzongkhag options available.
                </p>
              </div>
            </div>

            <!-- Website URL -->
            <div class="md:col-span-2">
              <label for="website_url" class="block text-sm font-medium text-gray-700">
                Website URL
              </label>
              <div class="mt-1 relative">
                <div class="flex rounded-md shadow-sm">
                  <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    <GlobeAltIcon class="h-4 w-4" />
                  </span>
                  <input
                    id="website_url"
                    v-model="form.website_url"
                    type="url"
                    class="flex-grow block w-full rounded-none rounded-r-md border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    :class="errors.website_url ? 'border-red-300' : 'border-gray-300'"
                    placeholder="https://www.example.edu"
                    :disabled="!isEditing"
                  />
                </div>
                <p v-if="errors.website_url" class="mt-1 text-sm text-red-600">{{ errors.website_url }}</p>
              </div>
            </div>

            <!-- Institute Details Section -->
            <div class="md:col-span-2">
              <h3 class="text-lg font-medium text-gray-800 pb-2 border-b border-gray-200 mb-4">
                Institute Details
              </h3>
            </div>

            <!-- Establishment Date -->
            <div>
              <label for="year_of_establishment" class="block text-sm font-medium text-gray-700">
                Establishment Date <span class="text-red-500">*</span>
              </label>
              <div class="mt-1 relative">
                <div class="flex rounded-md shadow-sm">
                  <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    <CalendarIcon class="h-4 w-4" />
                  </span>
                  <input
                    id="year_of_establishment"
                    v-model="form.year_of_establishment"
                    type="date"
                    required
                    class="flex-grow block w-full rounded-none rounded-r-md border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    :class="errors.year_of_establishment ? 'border-red-300' : 'border-gray-300'"
                    :disabled="!isEditing"
                  />
                </div>
                <p v-if="errors.year_of_establishment" class="mt-1 text-sm text-red-600">{{ errors.year_of_establishment }}</p>
              </div>
            </div>

            <!-- Affiliation -->
            <div>
              <label for="affiliation" class="block text-sm font-medium text-gray-700">
                Affiliation
              </label>
              <div class="mt-1">
                <input
                  id="affiliation"
                  v-model="form.affiliation"
                  type="text"
                  class="block w-full border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                  placeholder="Optional affiliation details"
                  :disabled="!isEditing"
                />
                <p v-if="errors.affiliation" class="mt-1 text-sm text-red-600">{{ errors.affiliation }}</p>
              </div>
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="pt-4 border-t border-gray-200 flex justify-end space-x-3">
            <!-- Reset Button -->
            <button
              v-if="isEditing"
              type="button"
              class="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              @click="resetForm"
              :disabled="isLoading"
            >
              Reset
            </button>

            <!-- Edit Profile Button -->
            <button
              v-if="!isEditing"
              type="button"
              class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              @click="enableEditing"
              :disabled="mainButtonDisabled"
            >
              {{ mainButtonText }}
            </button>

            <!-- Create/Update Profile Button -->
            <button
              v-if="isEditing"
              type="submit"
              :disabled="mainButtonDisabled"
              class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span v-if="isLoading && isEditing" class="mr-2">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ mainButtonText }}
            </button>
          </div>
        </form>
      </div>

      <!-- Form help text -->
      <div class="mt-4 text-sm text-gray-500 text-center">
        <p>Fields marked with <span class="text-red-500">*</span> are required</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import apiService from '@/services/services'; // Ensure this path is correct
import { bhutanDzongkhagsGewogs } from '@/constants/dzongkhags.js'; // Ensure this path is correct
import {
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  GlobeAltIcon,
} from '@heroicons/vue/24/outline';

// Reactive form data
const form = reactive({
  name_of_institution: '',
  location_address: '',
  email_address: '',
  contact_number: '',
  year_of_establishment: '',
  type_of_institution: '',
  affiliation: '',
  website_url: '',
  dzongkhag_thromde_city: '',
});

// State variables
const instituteTypes = ref([]);
const dzongkhags = ref([]);
const profileId = ref(null);
const successMessage = ref('');
const errorMessage = ref('');
const isLoading = ref(false);
const errors = reactive({});
const originalFormState = ref({});
const isEditing = ref(true);

// Validation function
const validateForm = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);
  let isValid = true;

  if (!form.name_of_institution?.trim()) {
    errors.name_of_institution = 'Institute name is required';
    isValid = false;
  }
  if (!form.location_address?.trim()) {
    errors.location_address = 'Address is required';
    isValid = false;
  }
  if (!form.email_address?.trim()) {
    errors.email_address = 'Contact email is required';
    isValid = false;
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email_address)) {
    errors.email_address = 'Please enter a valid email address';
    isValid = false;
  }
  if (!form.contact_number?.trim()) {
    errors.contact_number = 'Contact phone is required';
    isValid = false;
  } else if (!/^\+?[\d\s-(){}.]{7,20}$/.test(form.contact_number)) {
    errors.contact_number = 'Please enter a valid phone number';
    isValid = false;
  }
  if (!form.year_of_establishment) {
    errors.year_of_establishment = 'Establishment date is required';
    isValid = false;
  } else {
    const estDate = new Date(form.year_of_establishment);
    if (isNaN(estDate.getTime())) {
      errors.year_of_establishment = 'Invalid establishment date format.';
      isValid = false;
    }
  }
  if (!form.type_of_institution) {
    errors.type_of_institution = 'Please select an institute type';
    isValid = false;
  }
  if (!form.dzongkhag_thromde_city) {
    errors.dzongkhag_thromde_city = 'Please select a Dzongkhag';
    isValid = false;
  }
  if (form.website_url?.trim() && !/^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/.test(form.website_url)) {
    errors.website_url = 'Please enter a valid website URL';
    isValid = false;
  }
  return isValid;
};

// Form submission handler
const handleSubmit = async () => {
  if (!isEditing.value) {
    console.warn('handleSubmit called while not in editing mode.');
    return;
  }
  if (!validateForm()) {
    errorMessage.value = 'Please correct the errors in the form.';
    setTimeout(() => {
      errorMessage.value = '';
    }, 5000);
    return;
  }

  isLoading.value = true;
  successMessage.value = '';
  errorMessage.value = '';
  Object.keys(errors).forEach((key) => delete errors[key]);

  try {
    const formData = new FormData();
    formData.append('name_of_institution', form.name_of_institution || '');
    formData.append('type_of_institution', form.type_of_institution || '');
    formData.append('email_address', form.email_address || '');
    formData.append('contact_number', form.contact_number || '');
    formData.append('location_address', form.location_address || '');
    formData.append('dzongkhag_thromde_city', form.dzongkhag_thromde_city || '');
    formData.append('year_of_establishment', form.year_of_establishment ? new Date(form.year_of_establishment).getFullYear().toString() : '');
    formData.append('affiliation', form.affiliation || '');
    formData.append('website', form.website_url || '');

    console.log('Submitting FormData for handleSubmit:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}: ${value}`);
    }

    let apiResponse;
    if (profileId.value) {
      apiResponse = await apiService.updateInstituteProfile(profileId.value, formData);
      successMessage.value = 'Institute profile updated successfully!';
    } else {
      apiResponse = await apiService.createInstituteProfile(formData);
      if (apiResponse && apiResponse.data && apiResponse.data.id) {
        profileId.value = apiResponse.data.id;
      } else {
        console.warn('Profile created, but ID not found in API response:', apiResponse);
      }
      successMessage.value = 'Institute profile created successfully!';
    }

    saveOriginalFormState();
    isEditing.value = false;

    setTimeout(() => {
      successMessage.value = '';
    }, 5000);
  } catch (error) {
    console.error('Error saving profile:', error);
    if (error.response?.data && typeof error.response.data === 'object') {
      Object.keys(error.response.data).forEach((key) => {
        const errorValue = error.response.data[key];
        const frontendKey = key === 'website' ? 'website_url' : key;

        if (Array.isArray(errorValue) && errorValue.length > 0) {
          errors[frontendKey] = errorValue[0];
        } else if (typeof errorValue === 'string') {
          errors[frontendKey] = errorValue;
        } else {
          errors[frontendKey] = 'Error for this field.';
        }
      });
      errorMessage.value = 'Please correct the errors below.';
    } else {
      errorMessage.value = error.response?.data?.message || error.message || 'Failed to save profile. Please try again.';
    }
    setTimeout(() => {
      errorMessage.value = '';
    }, 7000);
  } finally {
    isLoading.value = false;
  }
};

// Save original form state (deep copy)
const saveOriginalFormState = () => {
  originalFormState.value = JSON.parse(JSON.stringify(form));
};

// Reset form to last saved state
const resetForm = () => {
  if (!isEditing.value) return;

  Object.keys(originalFormState.value).forEach((key) => {
    if (Object.hasOwn(form, key)) {
      form[key] = originalFormState.value[key];
    }
  });
  Object.keys(errors).forEach((key) => delete errors[key]);
  successMessage.value = '';
  errorMessage.value = '';
};

// Enable editing mode
const enableEditing = () => {
  isEditing.value = true;
  successMessage.value = '';
  errorMessage.value = '';
};

// Fetch initial data on mount
onMounted(async () => {
  isLoading.value = true;

  try {
    // Map dzongkhags
    try {
      if (Array.isArray(bhutanDzongkhagsGewogs)) {
        dzongkhags.value = bhutanDzongkhagsGewogs.map((item, index) => ({
          id: item.id || String(index + 1),
          name: item.dzongkhag,
        }));
      } else {
        errorMessage.value = 'Failed to load Dzongkhag options (data format error).';
      }
    } catch (dzongkhagError) {
      console.error('Error mapping dzongkhags:', dzongkhagError);
      errorMessage.value = 'Failed to load Dzongkhag options.';
    }

    // Fetch institute types
    try {
      const typesResponse = await apiService.getMastersInstituteTypes();
      if (typesResponse.data && Array.isArray(typesResponse.data.results)) {
        instituteTypes.value = typesResponse.data.results.map((item) => ({
          id: item.id,
          name: item.name_of_institute,
        }));
      } else {
        errorMessage.value = (errorMessage.value ? errorMessage.value + ' ' : '') + 'Invalid institute types response format.';
      }
    } catch (typeError) {
      console.error('Error fetching institute types:', typeError);
      errorMessage.value = (errorMessage.value ? errorMessage.value + ' ' : '') + 'Failed to load institute types.';
    }

    // Fetch existing profile
    try {
      const profileResponse = await apiService.getMyInstituteProfile();
      const profileData = profileResponse.data;
      console.log('Fetched Profile Data onMount:', JSON.parse(JSON.stringify(profileData || {})));

      if (profileData && profileData.id) {
        profileId.value = profileData.id;

        form.name_of_institution = profileData.name_of_institution || '';
        form.location_address = profileData.location_address || '';
        form.email_address = profileData.email_address || '';
        form.contact_number = profileData.contact_number || '';
        form.type_of_institution = profileData.type_of_institution || '';
        form.dzongkhag_thromde_city = profileData.dzongkhag_thromde_city || '';
        form.affiliation = profileData.affiliation || '';
        form.website_url = profileData.website || '';

        if (profileData.year_of_establishment) {
          const yearStr = String(profileData.year_of_establishment);
          if (/^\d{4}$/.test(yearStr)) {
            form.year_of_establishment = `${yearStr}-01-01`;
          } else if (!/^\d{4}-\d{2}-\d{2}$/.test(yearStr)) {
            const parsedDate = new Date(yearStr);
            if (!isNaN(parsedDate.getTime())) {
              form.year_of_establishment = parsedDate.toISOString().split('T')[0];
            } else {
              form.year_of_establishment = '';
            }
          } else {
            form.year_of_establishment = yearStr;
          }
        } else {
          form.year_of_establishment = '';
        }

        console.log('Form state after populating from API:', JSON.parse(JSON.stringify(form)));
        isEditing.value = false;
      } else {
        Object.keys(form).forEach((key) => (form[key] = ''));
        isEditing.value = true;
      }
    } catch (profileError) {
      if (profileError.response?.status === 404) {
        console.log('No profile found, ready to create one.');
        Object.keys(form).forEach((key) => (form[key] = ''));
        isEditing.value = true;
      } else {
        console.error('Error fetching profile:', profileError);
        errorMessage.value = (errorMessage.value ? errorMessage.value + ' ' : '') + 'Failed to load existing profile.';
        isEditing.value = true;
      }
    }
  } catch (error) {
    console.error('Unexpected error during component initialization:', error);
    errorMessage.value = (errorMessage.value ? errorMessage.value + ' ' : '') + 'Failed to initialize form data.';
    isEditing.value = true;
  } finally {
    saveOriginalFormState();
    console.log('Original form state saved onMount:', JSON.parse(JSON.stringify(originalFormState.value)));
    isLoading.value = false;
    if (errorMessage.value) {
      setTimeout(() => {
        errorMessage.value = '';
      }, 7000);
    }
  }
});

// Computed property for the main action button text
const mainButtonText = computed(() => {
  if (!isEditing.value) return 'Edit Profile';
  if (isEditing.value && isLoading.value) return 'Saving...';
  return profileId.value ? 'Update Profile' : 'Create Profile';
});

// Computed property for main action button's disabled state
const mainButtonDisabled = computed(() => {
  if (isLoading.value) return true;
  if (isEditing.value) {
    if (!profileId.value && (instituteTypes.value.length === 0 || dzongkhags.value.length === 0)) {
      return true;
    }
  }
  return false;
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>