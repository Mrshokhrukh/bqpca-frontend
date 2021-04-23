<template>
  <div class="w-full mx-auto px-4 sm:px-6 py-8 pb-10">
    <!-- Header Section - Reduced padding and font sizes -->
    <div
      class="relative bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-100 rounded-xl p-6 mb-10 overflow-hidden border border-indigo-100/50 shadow-sm">
      <div class="absolute inset-0 bg-indigo-100 opacity-10 animate-pulse-slow"></div>
      <h2 class="relative text-2xl font-bold text-gray-800 mb-3 text-center tracking-tight">
        CPD Application
      </h2>
      <p class="relative text-gray-600 text-center max-w-xl mx-auto text-sm">
        Complete required fields <span class="text-red-600 font-semibold">*</span>. Ensure information is accurate.
      </p>
    </div>

    <!-- Form Section - Reduced shadow and padding -->
    <form @submit.prevent="handleSubmit" class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <!-- Hidden fields -->
      <input type="hidden" v-model="form.registration_no" />
      <input type="hidden" v-model="form.cid_no" />
      <input type="hidden" v-model="form.full_name" />
      <input type="hidden" v-model="form.gender" />
      <input type="hidden" v-model="form.cpd_credit" />

      <!-- Form Header - Reduced padding and font sizes -->
      <div class="bg-gradient-to-r from-gray-50/50 to-indigo-50/50 p-6 border-b border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800">CPD Details</h3>
        <p class="mt-1 text-gray-500 text-sm">
          Provide information about your CPD activity.
        </p>
      </div>

      <!-- Form Body - Reduced padding and spacing -->
      <div class="p-6 space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-6">
          <!-- Input Fields - Adjusted padding, rounding, font size -->
          <div class="space-y-1.5">
            <label for="title_of_cpd" class="text-xs font-medium text-gray-700 flex items-center">
              Title of CPD <span class="text-red-500 ml-1">*</span>
            </label>
            <input id="title_of_cpd" v-model="form.title_of_cpd" type="text"
              class="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 shadow-sm hover:border-gray-300"
              required placeholder="Enter CPD title" />
            <span v-if="errors.title_of_cpd" class="text-xs text-red-500 block">{{
              errors.title_of_cpd
            }}</span>
          </div>

          <div class="space-y-1.5">
            <label for="relevance_to_profession" class="text-xs font-medium text-gray-700 flex items-center">
              Professional Relevance <span class="text-red-500 ml-1">*</span>
            </label>
            <input id="relevance_to_profession" v-model="form.relevance_to_profession" type="text"
              class="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 shadow-sm hover:border-gray-300"
              required placeholder="Describe relevance" />
            <span v-if="errors.relevance_to_profession" class="text-xs text-red-500 block">{{
              errors.relevance_to_profession
            }}</span>
          </div>

          <!-- Select Fields - Adjusted padding, rounding, font size -->
          <div class="space-y-1.5">
            <label for="participation_category" class="text-xs font-medium text-gray-700 flex items-center">
              Participation Category <span class="text-red-500 ml-1">*</span>
            </label>
            <select id="participation_category" v-model="form.participation_category" @change="handleCategoryChange"
              class="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 shadow-sm hover:border-gray-300 appearance-none"
              required>
              <option value="" disabled>Select category</option>
              <option v-for="category in participationCategories" :key="category.id" :value="category.id">
                {{ category.participation_category_name }}
              </option>
            </select>
             <span v-if="errors.participation_category" class="text-xs text-red-500 block">{{
              errors.participation_category
            }}</span>
          </div>

          <div class="space-y-1.5">
            <label for="participant_sub_category" class="text-xs font-medium text-gray-700 flex items-center">
              Participant Sub-category <span class="text-red-500 ml-1">*</span>
            </label>
            <select id="participant_sub_category" v-model="form.participant_sub_category"
              :disabled="!form.participation_category || filteredSubCategories.length === 0"
              class="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 shadow-sm hover:border-gray-300 appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              required>
              <option value="" disabled>Select sub-category</option>
              <option v-if="form.participation_category && filteredSubCategories.length === 0" value="" disabled>
                No sub-categories for selected category
              </option>
              <option v-for="subCategory in filteredSubCategories" :key="subCategory.id" :value="subCategory.id">
                {{ subCategory.participation_sub_category_name }}
              </option>
            </select>
             <span v-if="errors.participant_sub_category" class="text-xs text-red-500 block">{{
              errors.participant_sub_category
            }}</span>
          </div>

          <div class="space-y-1.5">
            <label for="type_of_cpd_activity" class="text-xs font-medium text-gray-700 flex items-center">
              CPD Activity Type <span class="text-red-500 ml-1">*</span>
            </label>
            <select id="type_of_cpd_activity" v-model="form.type_of_cpd_activity"
              class="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 shadow-sm hover:border-gray-300 appearance-none"
              required>
              <option value="" disabled>Select activity type</option>
              <option v-for="activity in cpdActivities" :key="activity.id" :value="activity.id">
                {{ activity.cpd_activity_name }}
              </option>
            </select>
            <span v-if="errors.type_of_cpd_activity" class="text-xs text-red-500 block">{{
              errors.type_of_cpd_activity
            }}</span>
          </div>

          <!-- File Input - Adjusted styling -->
          <div class="space-y-1.5">
            <label for="attachment" class="text-xs font-medium text-gray-700">Supporting Documents</label>
            <div class="relative">
              <input id="attachment" type="file" ref="fileInputRef" @change="handleFileUpload"
                class="w-full px-3 py-2 rounded-md border-2 border-dashed border-gray-200 bg-gray-50/50 text-gray-800 text-sm placeholder-gray-400 hover:border-indigo-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 cursor-pointer file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
              <p class="mt-1.5 text-xs text-gray-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                PDF, DOC, JPG, PNG (Max: 2MB)
              </p>
              <p v-if="attachmentFileName" class="mt-1 text-xs text-indigo-600 font-medium">
                Selected: {{ attachmentFileName }}
              </p>
            </div>
            <span v-if="errors.attachment" class="text-xs text-red-500 block">{{
              errors.attachment
            }}</span>
          </div>
        </div>
      </div>

      <!-- Form Footer / Actions - Reduced padding, button sizes -->
      <div class="bg-gray-50/70 px-6 py-4 flex justify-end space-x-3 border-t border-gray-100">
        <button type="button" @click="handleCancel"
          class="px-4 py-2 rounded-md bg-white text-gray-700 text-sm border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition duration-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-400">
          Cancel
        </button>
        <button type="button" @click="handleSaveDraft"
          class="px-4 py-2 rounded-md bg-yellow-500 text-white text-sm hover:bg-yellow-600 transition duration-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-yellow-400">
          Save Draft
        </button>
        <button type="submit" :disabled="isSubmitting"
          class="px-4 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm hover:from-indigo-700 hover:to-blue-700 transition duration-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]">
          <span v-if="isSubmitting" class="flex items-center">
            <svg class="animate-spin -ml-0.5 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            Submitting...
          </span>
          <span v-else>Submit</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'
import apiService from '@/services/services'
import { useRouter } from 'vue-router'

const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()
const fileInputRef = ref(null)
const attachmentFileName = ref('')

const LOCAL_STORAGE_DRAFT_KEY = 'mhpcCpdFormDraft'

const cpdActivities = ref([])
const participationCategories = ref([])
const participationSubCategories = ref([])
const isSubmitting = ref(false)

const form = reactive({
  registration_no: '',
  cid_no: '',
  full_name: '',
  gender: '',
  title_of_cpd: '',
  relevance_to_profession: '',
  participation_category: '',
  participant_sub_category: '',
  type_of_cpd_activity: '',
  cpd_credit: 1,
  attachment: null,
})

const errors = reactive({})

const filteredSubCategories = computed(() => {
  const selectedCategoryId = form.participation_category
  if (!selectedCategoryId) return []
  return participationSubCategories.value.filter(
    (subCategory) => parseInt(subCategory.participation_category_name) === parseInt(selectedCategoryId)
  )
})

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
      if (authStore.user) {
        form.cid_no = authStore.user.cid || ''
        form.full_name =
          `${authStore.user.first_name || ''} ${authStore.user.middle_name || ''} ${authStore.user.last_name || ''}`
            .replace(/\s+/g, ' ')
            .trim()
        form.gender = authStore.user.gender || ''
      }
      attachmentFileName.value = draftData.attachmentName || ''
      if (attachmentFileName.value) {
        toast.info('Draft loaded. Re-select attachment if needed.', { timeout: 4000 })
      } else {
        toast.info('Draft loaded.')
      }
    } catch (e) {
      console.error('Error parsing draft data:', e)
      toast.error('Could not load draft.')
      localStorage.removeItem(LOCAL_STORAGE_DRAFT_KEY)
    }
  }
}

const handleSaveDraft = () => {
  const draftToSave = { ...form, attachment: null, attachmentName: attachmentFileName.value }
  try {
    localStorage.setItem(LOCAL_STORAGE_DRAFT_KEY, JSON.stringify(draftToSave))
    toast.success('Draft saved.')
  } catch (e) {
    console.error('Error saving draft:', e)
    toast.error('Could not save draft.')
  }
}

const clearDraft = () => {
  localStorage.removeItem(LOCAL_STORAGE_DRAFT_KEY)
}

const validateForm = () => {
  Object.keys(errors).forEach((key) => delete errors[key])
  let isValid = true
  if (!form.title_of_cpd) { errors.title_of_cpd = 'Required'; isValid = false; }
  if (!form.relevance_to_profession) { errors.relevance_to_profession = 'Required'; isValid = false; }
  if (!form.participation_category) { errors.participation_category = 'Required'; isValid = false; }
  if (form.participation_category && !form.participant_sub_category) {
    const potentialSubs = participationSubCategories.value.filter(sub =>
      parseInt(sub.participation_category_name) === parseInt(form.participation_category));
    if (potentialSubs.length > 0) { errors.participant_sub_category = 'Required'; isValid = false; }
  }
  if (!form.type_of_cpd_activity) { errors.type_of_cpd_activity = 'Required'; isValid = false; }
  if (form.attachment && form.attachment.size > 2 * 1024 * 1024) { errors.attachment = 'Max 2MB'; isValid = false; }
  return isValid
}

const fetchRegistrationNumber = async (cid) => {
  if (!cid) return null
  try {
    const response = await apiService.getMhpcApplicationsByCid(cid)
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      const primaryApp = response.data.find(app => app.registration_type_name === 'New Registration' || app.is_primary);
      const recordId = primaryApp?.id || response.data[0]?.id;
      if (recordId) return recordId;
    }
    console.warn(`No application record ID found for CID: ${cid}`); return null;
  } catch (error) {
    console.error('Error fetching registration record ID:', error); return null;
  }
}

const handleSubmit = async () => {
  if (!validateForm()) { toast.error('Please fix errors.'); return; }

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

  try {
    const response = await apiService.createMhpcCpdRecord(formData);
    if (response.status >= 200 && response.status < 300) {
      toast.success('CPD submitted successfully!');
      clearDraft();
      router.push('/admin/user/health_certification/dashboard');
    } else {
      const errorData = response.data || { message: `Server error ${response.status}` };
      const errorMessage = typeof errorData === 'object' ? JSON.stringify(errorData) : errorData.toString();
      toast.error(`Submission failed: ${errorMessage}`);
      if (typeof errorData === 'object' && errorData !== null) { Object.assign(errors, errorData); }
    }
  } catch (error) {
    const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
    toast.error(`Submission failed: ${errorMsg}`);
    if (error.response && error.response.data && typeof error.response.data === 'object') { Object.assign(errors, error.response.data); }
  } finally {
    isSubmitting.value = false;
  }
}

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
  toast.info('Form cleared.');
}

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) { form.attachment = null; attachmentFileName.value = ''; delete errors.attachment; return; }
  if (file.size > 2 * 1024 * 1024) {
    errors.attachment = 'Max 2MB';
    form.attachment = null; attachmentFileName.value = ''; event.target.value = '';
    toast.error(errors.attachment);
  } else {
    form.attachment = file; attachmentFileName.value = file.name; delete errors.attachment;
  }
}

const handleCategoryChange = () => {
  form.participant_sub_category = '';
  delete errors.participant_sub_category;
}

const fetchMasterData = async () => {
  try {
    const [activitiesResponse, categoriesResponse, subCategoriesResponse] =
      await Promise.allSettled([
        apiService.getMhpcMastersCpdActivities(),
        apiService.getMhpcMastersMHPCParticipationCategories(),
        apiService.getMhpcMastersMhpcParticipationSubCategories(),
      ]);

    cpdActivities.value = activitiesResponse.status === 'fulfilled' && activitiesResponse.value?.data?.results ? activitiesResponse.value.data.results : [];
    participationCategories.value = categoriesResponse.status === 'fulfilled' && categoriesResponse.value?.data?.results ? categoriesResponse.value.data.results : [];
    participationSubCategories.value = subCategoriesResponse.status === 'fulfilled' && subCategoriesResponse.value?.data?.results ? subCategoriesResponse.value.data.results : [];

    if (activitiesResponse.status === 'rejected' || categoriesResponse.status === 'rejected' || subCategoriesResponse.status === 'rejected') {
      toast.warning('Could not fetch all dropdown data.');
    }
  } catch (error) {
    toast.error('Failed to fetch master data.');
    console.error('Error fetching master data:', error);
  }
}

onMounted(async () => {
  if (authStore.user) {
    form.cid_no = authStore.user.cid || '';
    form.full_name = `${authStore.user.first_name || ''} ${authStore.user.middle_name || ''} ${authStore.user.last_name || ''}`.replace(/\s+/g, ' ').trim();
    form.gender = authStore.user.gender || '';
  } else {
    toast.error('User data not found.');
    return;
  }

  loadDraft();
  await fetchMasterData();

  const registrationRecordId = await fetchRegistrationNumber(form.cid_no);
  if (registrationRecordId) {
    form.registration_no = registrationRecordId;
  } else {
    toast.warning('Could not get registration ID. Contact support if submission fails.');
  }
})
</script>

<style scoped>
select:required:invalid {
  color: #9ca3af; /* gray-400 */
}
option[value=''][disabled] {
  color: #9ca3af;
}
option {
  color: #1f2937; /* gray-800 */
}
select:disabled {
  background-color: #f3f4f6; /* gray-100 */
  cursor: not-allowed;
  opacity: 0.7;
}
input[type='file']:focus-within {
  outline: none; /* Focus handled by ring utility */
}
@keyframes pulse-slow {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.15; }
}
.animate-pulse-slow {
  animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
