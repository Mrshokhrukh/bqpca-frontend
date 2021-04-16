```vue
<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <div
        class="relative bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-2xl p-8 mb-12 overflow-hidden"
      >
        <div class="absolute inset-0 bg-indigo-200 opacity-10 animate-pulse-slow"></div>
        <h2 class="relative text-3xl font-extrabold text-gray-900 mb-4 text-center tracking-tight">
          Continuous Professional Development (CPD) Application
        </h2>
        <p class="relative text-gray-600 text-center max-w-2xl mx-auto text-sm sm:text-base">
          Complete all required fields marked with an
          <span class="text-red-600 font-semibold">*</span>. Ensure your information is accurate and
          current. You can save your progress as a draft.
        </p>
      </div>

      <!-- Form Section -->
      <form
        @submit.prevent="handleSubmit"
        class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
      >
        <!-- Hidden fields populated from auth store / fetched -->
        <input type="hidden" v-model="form.registration_no" />
        <input type="hidden" v-model="form.cid_no" />
        <input type="hidden" v-model="form.full_name" />
        <input type="hidden" v-model="form.gender" />
        <input type="hidden" v-model="form.cpd_credit" />

        <!-- Form Header -->
        <div class="bg-gradient-to-r from-gray-50 to-indigo-50 p-8">
          <h3 class="text-xl font-semibold text-gray-900">CPD Details</h3>
          <p class="mt-2 text-gray-600 text-sm">
            Provide detailed information about your CPD activity.
          </p>
        </div>

        <!-- Form Body -->
        <div class="p-8 space-y-10">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <!-- Title of CPD -->
            <div class="space-y-2">
              <label for="title_of_cpd" class="text-sm font-medium text-gray-700 flex items-center">
                Title of CPD <span class="text-red-500 ml-1">*</span>
              </label>
              <input
                id="title_of_cpd"
                v-model="form.title_of_cpd"
                type="text"
                class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm hover:border-indigo-300"
                required
                placeholder="Enter CPD title"
              />
              <span v-if="errors.title_of_cpd" class="text-sm text-red-500 block">{{
                errors.title_of_cpd
              }}</span>
            </div>

            <!-- Professional Relevance -->
            <div class="space-y-2">
              <label
                for="relevance_to_profession"
                class="text-sm font-medium text-gray-700 flex items-center"
              >
                Professional Relevance <span class="text-red-500 ml-1">*</span>
              </label>
              <input
                id="relevance_to_profession"
                v-model="form.relevance_to_profession"
                type="text"
                class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm hover:border-indigo-300"
                required
                placeholder="Describe relevance to your profession"
              />
              <span v-if="errors.relevance_to_profession" class="text-sm text-red-500 block">{{
                errors.relevance_to_profession
              }}</span>
            </div>

            <!-- Participation Category -->
            <div class="space-y-2">
              <label
                for="participation_category"
                class="text-sm font-medium text-gray-700 flex items-center"
              >
                Participation Category <span class="text-red-500 ml-1">*</span>
              </label>
              <select
                id="participation_category"
                v-model="form.participation_category"
                @change="handleCategoryChange"
                class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm hover:border-indigo-300 appearance-none"
                required
              >
                <option value="" disabled>Select category</option>
                <option
                  v-for="category in participationCategories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.participation_category_name }}
                </option>
              </select>
              <span v-if="errors.participation_category" class="text-sm text-red-500 block">{{
                errors.participation_category
              }}</span>
            </div>

            <!-- Participant Sub-category -->
            <div class="space-y-2">
              <label
                for="participant_sub_category"
                class="text-sm font-medium text-gray-700 flex items-center"
              >
                Participant Sub-category <span class="text-red-500 ml-1">*</span>
              </label>
              <select
                id="participant_sub_category"
                v-model="form.participant_sub_category"
                :disabled="!form.participation_category || filteredSubCategories.length === 0"
                class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm hover:border-indigo-300 appearance-none disabled:bg-gray-200 disabled:cursor-not-allowed"
                required
              >
                <option value="" disabled>Select sub-category</option>
                <option
                  v-if="form.participation_category && filteredSubCategories.length === 0"
                  value=""
                  disabled
                >
                  No sub-categories found for selected category
                </option>
                <option
                  v-for="subCategory in filteredSubCategories"
                  :key="subCategory.id"
                  :value="subCategory.id"
                >
                  {{ subCategory.participation_sub_category_name }}
                </option>
              </select>
              <!-- Debug info (you can remove this in production) -->
              <p v-if="form.participation_category && filteredSubCategories.length === 0" class="text-xs text-orange-500">
                No matching subcategories found. Check API response format.
              </p>
              <span v-if="errors.participant_sub_category" class="text-sm text-red-500 block">{{
                errors.participant_sub_category
              }}</span>
            </div>

            <!-- CPD Activity Type -->
            <div class="space-y-2">
              <label
                for="type_of_cpd_activity"
                class="text-sm font-medium text-gray-700 flex items-center"
              >
                CPD Activity Type <span class="text-red-500 ml-1">*</span>
              </label>
              <select
                id="type_of_cpd_activity"
                v-model="form.type_of_cpd_activity"
                class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm hover:border-indigo-300 appearance-none"
                required
              >
                <option value="" disabled>Select activity type</option>
                <option v-for="activity in cpdActivities" :key="activity.id" :value="activity.id">
                  {{ activity.cpd_activity_name }}
                </option>
              </select>
              <span v-if="errors.type_of_cpd_activity" class="text-sm text-red-500 block">{{
                errors.type_of_cpd_activity
              }}</span>
            </div>

            <!-- Attachment -->
            <div class="space-y-2">
              <label for="attachment" class="text-sm font-medium text-gray-700"
                >Supporting Documents</label
              >
              <div class="relative">
                <input
                  id="attachment"
                  type="file"
                  ref="fileInputRef"
                  @change="handleFileUpload"
                  class="w-full px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 hover:border-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
                />
                <p class="mt-2 text-xs text-gray-500 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  PDF, DOC, JPG, PNG (Max: 2MB)
                </p>
                <p v-if="attachmentFileName" class="mt-2 text-xs text-indigo-700">
                  Selected: {{ attachmentFileName }}
                </p>
              </div>
              <span v-if="errors.attachment" class="text-sm text-red-500 block">{{
                errors.attachment
              }}</span>
            </div>
          </div>
        </div>

        <!-- Form Footer / Actions -->
        <div class="bg-gray-50 px-8 py-6 flex justify-end space-x-4 border-t border-gray-100">
          <button
            type="button"
            @click="handleCancel"
            class="px-6 py-3 rounded-lg bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="handleSaveDraft"
            class="px-6 py-3 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSubmitting" class="flex items-center justify-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
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
import { reactive, onMounted, ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore' // Assuming path is correct
import apiService from '@/services/services' // Assuming path is correct
import { useRouter } from 'vue-router' // Import useRouter

const toast = useToast()
const authStore = useAuthStore()
const router = useRouter() // Initialize useRouter
const fileInputRef = ref(null) // Reference to the file input element
const attachmentFileName = ref('') // To display the name of the selected file

// --- Constants ---
const LOCAL_STORAGE_DRAFT_KEY = 'mhpcCpdFormDraft'

// --- Reactive State ---
const cpdActivities = ref([])
const participationCategories = ref([])
const participationSubCategories = ref([]) // Holds all fetched subcategories
const isSubmitting = ref(false) // Track submission status

// Form data model
const form = reactive({
  registration_no: '', // Will hold the Application Record ID (PK)
  cid_no: '',
  full_name: '',
  gender: '',
  title_of_cpd: '',
  relevance_to_profession: '',
  participation_category: '', // Will hold the ID of the selected category
  participant_sub_category: '', // Will hold the ID of the selected subcategory
  type_of_cpd_activity: '', // Will hold the ID of the selected activity
  cpd_credit: 1, // Default CPD credit score
  attachment: null, // Holds the file object
})

// Form validation errors
const errors = reactive({})

// --- Computed Properties ---

// Filter subcategories based on selected category ID
const filteredSubCategories = computed(() => {
  const selectedCategoryId = form.participation_category
  if (!selectedCategoryId) return []

  // Use parseInt for robust comparison since API returns participation_category_name as a number
  return participationSubCategories.value.filter(
    (subCategory) => parseInt(subCategory.participation_category_name) === parseInt(selectedCategoryId)
  )
})

// --- Methods ---

// Load draft from local storage
const loadDraft = () => {
  const savedDraft = localStorage.getItem(LOCAL_STORAGE_DRAFT_KEY)
  if (savedDraft) {
    try {
      const draftData = JSON.parse(savedDraft)
      Object.keys(form).forEach((key) => {
        if (key !== 'attachment' && Object.hasOwn(draftData, key)) {
          form[key] = draftData[key]
        }
      })
      if (authStore.user) { // Always refresh user data
        form.cid_no = authStore.user.cid || ''
        form.full_name =
          `${authStore.user.first_name || ''} ${authStore.user.middle_name || ''} ${authStore.user.last_name || ''}`
            .replace(/\s+/g, ' ')
            .trim()
        form.gender = authStore.user.gender || ''
      }
      attachmentFileName.value = draftData.attachmentName || ''
      if (attachmentFileName.value) {
        toast.info('Draft loaded. Please re-select the attachment file if needed.', { timeout: 5000 })
      } else {
        toast.info('Draft loaded.')
      }
    } catch (e) {
      console.error('Error parsing draft data from localStorage:', e)
      toast.error('Could not load draft due to corrupted data.')
      localStorage.removeItem(LOCAL_STORAGE_DRAFT_KEY)
    }
  }
}

// Save draft to local storage
const handleSaveDraft = () => {
  const draftToSave = { ...form, attachment: null, attachmentName: attachmentFileName.value }
  try {
    localStorage.setItem(LOCAL_STORAGE_DRAFT_KEY, JSON.stringify(draftToSave))
    toast.success('Draft saved successfully.')
  } catch (e) {
    console.error('Error saving draft to localStorage:', e)
    toast.error('Could not save draft. Storage might be full.')
  }
}

// Clear draft from local storage
const clearDraft = () => {
  localStorage.removeItem(LOCAL_STORAGE_DRAFT_KEY)
  console.log('Draft cleared from local storage.')
}

// Validate the form before submission
const validateForm = () => {
  Object.keys(errors).forEach((key) => delete errors[key])
  let isValid = true
  if (!form.title_of_cpd) { errors.title_of_cpd = 'CPD Title is required'; isValid = false; }
  if (!form.relevance_to_profession) { errors.relevance_to_profession = 'Relevance is required'; isValid = false; }
  if (!form.participation_category) { errors.participation_category = 'Participation Category is required'; isValid = false; }
  if (form.participation_category && !form.participant_sub_category) {
    const potentialSubs = participationSubCategories.value.filter(sub =>
      parseInt(sub.participation_category_name) === parseInt(form.participation_category));
    if (potentialSubs.length > 0) { errors.participant_sub_category = 'Participant Sub-category is required'; isValid = false; }
  }
  if (!form.type_of_cpd_activity) { errors.type_of_cpd_activity = 'Activity Type is required'; isValid = false; }
  if (form.attachment && form.attachment.size > 2 * 1024 * 1024) { errors.attachment = 'Attachment size should not exceed 2MB'; isValid = false; }
  return isValid
}

// Fetch registration number (Application Record ID) based on CID
const fetchRegistrationNumber = async (cid) => {
  if (!cid) return null
  try {
    const response = await apiService.getMhpcApplicationsByCid(cid) // Ensure this service exists and works
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      const primaryApp = response.data.find(app => app.registration_type_name === 'New Registration' || app.is_primary);
      const recordId = primaryApp?.id || response.data[0]?.id; // Use the PK 'id'
      if (recordId) {
        console.log(`Fetched Application Record ID: ${recordId} for CID: ${cid}`)
        return recordId;
      } else {
        console.warn(`Could not find application record ID for CID: ${cid}`); return null;
      }
    }
    console.warn(`No application records found for CID: ${cid}`); return null;
  } catch (error) {
    console.error('Error fetching registration record ID:', error); return null;
  }
}

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) { toast.error('Please correct the errors in the form.'); return; }

  isSubmitting.value = true
  const formData = new FormData()
  const genderToSend = form.gender?.toLowerCase() === 'male' ? 'male' : form.gender?.toLowerCase() === 'female' ? 'female' : 'others';

  formData.append('registration_no', form.registration_no || '');
  formData.append('cid_no', form.cid_no || '');
  formData.append('full_name', form.full_name || '');
  formData.append('gender', genderToSend);
  formData.append('title_of_cpd', form.title_of_cpd);
  formData.append('relevance_to_profession', form.relevance_to_profession);
  formData.append('participation_category', form.participation_category);
  formData.append('participant_sub_category', form.participant_sub_category);
  formData.append('type_of_cpd_activity', form.type_of_cpd_activity);
  formData.append('cpd_credit', form.cpd_credit);
  if (form.attachment) { formData.append('attachment', form.attachment, form.attachment.name); }

  console.log('Submitting FormData:', Object.fromEntries(formData));

  try {
    const response = await apiService.createMhpcCpdRecord(formData);
    if (response.status >= 200 && response.status < 300) {
      toast.success('CPD Registration submitted successfully!');
      clearDraft(); // Clear draft on successful submission
      router.push('/admin/user/health_certification/dashboard'); // Redirect
    } else {
      const errorData = response.data || { message: `Server responded with status ${response.status}` };
      const errorMessage = typeof errorData === 'object' ? JSON.stringify(errorData) : errorData.toString();
      toast.error(`Submission failed: ${errorMessage}`);
      console.error('Server error response:', response);
      if (typeof errorData === 'object' && errorData !== null) { Object.assign(errors, errorData); }
    }
  } catch (error) {
    const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
    toast.error(`Submission failed: ${errorMsg}`);
    console.error('Error submitting form:', error.response || error);
    if (error.response && error.response.data && typeof error.response.data === 'object') { Object.assign(errors, error.response.data); }
  } finally {
    isSubmitting.value = false;
  }
}

// Handle cancel button click
const handleCancel = () => {
  form.title_of_cpd = '';
  form.relevance_to_profession = '';
  form.participation_category = '';
  form.participant_sub_category = '';
  form.type_of_cpd_activity = '';
  form.cpd_credit = 1;
  form.attachment = null;
  attachmentFileName.value = '';
  Object.keys(errors).forEach((key) => delete errors[key]);
  if (fileInputRef.value) { fileInputRef.value.value = ''; }
  toast.info('Form cleared. Saved draft remains untouched.');
}

// Handle file selection and validation
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) { form.attachment = null; attachmentFileName.value = ''; delete errors.attachment; return; }
  if (file.size > 2 * 1024 * 1024) { // 2MB limit
    errors.attachment = 'Attachment size should not exceed 2MB';
    form.attachment = null; attachmentFileName.value = ''; event.target.value = '';
    toast.error(errors.attachment);
  } else {
    form.attachment = file; attachmentFileName.value = file.name; delete errors.attachment;
  }
}

// Reset subcategory when category changes and add debugging logs
const handleCategoryChange = () => {
  form.participant_sub_category = '';
  delete errors.participant_sub_category;

  // Log for debugging
  console.log('Category changed to:', form.participation_category);
  console.log('Available subcategories:', filteredSubCategories.value);
}

// Fetch master data (activities, categories, subcategories) from API
const fetchMasterData = async () => {
  try {
    const [activitiesResponse, categoriesResponse, subCategoriesResponse] =
      await Promise.allSettled([
        apiService.getMhpcMastersCpdActivities(),
        apiService.getMhpcMastersMHPCParticipationCategories(),
        apiService.getMhpcMastersMhpcParticipationSubCategories(),
      ]);

    // Safely assign results and add debugging
    cpdActivities.value = activitiesResponse.status === 'fulfilled' && activitiesResponse.value?.data?.results
      ? activitiesResponse.value.data.results : [];

    participationCategories.value = categoriesResponse.status === 'fulfilled' && categoriesResponse.value?.data?.results
      ? categoriesResponse.value.data.results : [];

    // Log subcategories data for debugging
    if (subCategoriesResponse.status === 'fulfilled' && subCategoriesResponse.value?.data?.results) {
      participationSubCategories.value = subCategoriesResponse.value.data.results;
      console.log('Loaded subcategories:', participationSubCategories.value);
    } else {
      participationSubCategories.value = [];
      console.warn('No subcategories found in API response');
    }

    // Log errors if any fetch failed
    if (activitiesResponse.status === 'rejected') console.error('Failed to fetch CPD Activities:', activitiesResponse.reason);
    if (categoriesResponse.status === 'rejected') console.error('Failed to fetch Participation Categories:', categoriesResponse.reason);
    if (subCategoriesResponse.status === 'rejected') console.error('Failed to fetch Participation Subcategories:', subCategoriesResponse.reason);

    if (activitiesResponse.status === 'rejected' || categoriesResponse.status === 'rejected' || subCategoriesResponse.status === 'rejected') {
      toast.warning('Could not fetch all required data for dropdowns. Some options may be unavailable.');
    }

  } catch (error) {
    toast.error('Failed to fetch essential master data.');
    console.error('Error setting up master data fetch:', error);
  }
}

// --- Lifecycle Hook ---
onMounted(async () => {
  // 1. Populate user details
  if (authStore.user) {
    form.cid_no = authStore.user.cid || '';
    form.full_name = `${authStore.user.first_name || ''} ${authStore.user.middle_name || ''} ${authStore.user.last_name || ''}`.replace(/\s+/g, ' ').trim();
    form.gender = authStore.user.gender || '';
  } else {
    toast.error('User data not found. Please log in again.');
    return; // Stop if no user data
  }

  // 2. Load draft (may overwrite defaults)
  loadDraft();

  // 3. Fetch master data
  await fetchMasterData();

  // 4. Fetch registration number (after CID is potentially set by draft/store)
  const registrationRecordId = await fetchRegistrationNumber(form.cid_no);
  if (registrationRecordId) {
    form.registration_no = registrationRecordId;
  } else {
    toast.error('Could not retrieve your registration ID. CPD submission may fail. Please contact support.');
    console.error('Proceeding without registration_no ID.');
    // Consider disabling submit button if ID is absolutely required
    // isSubmitting.value = true; // Example: disable submit if no ID
  }
})
</script>

<style scoped>
/* Styles for select placeholder */
select:required:invalid {
  color: #9ca3af; /* gray-400 */
}

option[value=''][disabled] {
  color: #9ca3af;
}

option {
  color: #111827; /* gray-900 */
}

/* Style for disabled select */
select:disabled {
  background-color: #e5e7eb; /* gray-200 */
  cursor: not-allowed;
  opacity: 0.7;
}

/* Slightly improved file input focus */
input[type='file']:focus-within {
  outline: 2px solid #6366f1; /* indigo-500 */
  outline-offset: 2px;
}

/* Custom slow pulse animation */
@keyframes pulse-slow {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.2; }
}
.animate-pulse-slow {
  animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
```