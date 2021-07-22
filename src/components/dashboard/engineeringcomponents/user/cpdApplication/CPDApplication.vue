<template>
  <div class="w-full mx-auto px-4 sm:px-6 py-8 pb-10">
    <PageHeader title="CPD Application" subtitle="Complete required fields *. Ensure information is accurate.">
      <template #icon>
        <ClipboardList class="w-6 h-6 text-indigo-600" />
      </template>
      <template #subtitle>
        Complete required fields <span class="text-red-600 font-semibold">*</span>. Ensure
        information is accurate.
      </template>
    </PageHeader>

    <form @submit.prevent="handleSubmit" class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <!-- Section for Displaying Auto-Populated Personal Information -->
      <div class="bg-gray-50/70 p-6 border-b border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800">Personal Information</h3>
        <p class="mt-1 text-gray-500 text-sm">
          This information is automatically populated from your profile.
        </p>
      </div>
      <div class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-6">
          <div class="space-y-1.5">
            <label for="display_registration_no_str" class="text-xs font-medium text-gray-700">Registration
              Number</label>
            <p id="display_registration_no_str"
              class="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-100 text-gray-600 text-sm shadow-sm min-h-[38px] flex items-center">
              {{ form.display_registration_no || (isLoadingRegistrationNo ? 'Fetching...' : 'N/A') }}
            </p>
          </div>
          <div class="space-y-1.5">
            <label for="display_cid_no" class="text-xs font-medium text-gray-700">CID No.</label>
            <p id="display_cid_no"
              class="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-100 text-gray-600 text-sm shadow-sm min-h-[38px] flex items-center">
              {{ form.cid_no || 'N/A' }}
            </p>
          </div>
          <div class="space-y-1.5">
            <label for="display_full_name" class="text-xs font-medium text-gray-700">Full Name</label>
            <p id="display_full_name"
              class="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-100 text-gray-600 text-sm shadow-sm min-h-[38px] flex items-center">
              {{ form.full_name || 'N/A' }}
            </p>
          </div>
          <div class="space-y-1.5">
            <label for="display_gender" class="text-xs font-medium text-gray-700">Gender</label>
            <p id="display_gender"
              class="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-100 text-gray-600 text-sm shadow-sm capitalize min-h-[38px] flex items-center">
              {{ form.gender || 'N/A' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Draft Selection -->
      <div class="p-6 border-b border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800">Load Draft</h3>
        <p class="mt-1 text-gray-500 text-sm">Select a draft to load CPD details.</p>
        <div class="mt-4 space-y-1.5">
          <label for="select_draft" class="text-xs font-medium text-gray-700">Select Draft</label>
          <select id="select_draft" v-model="selectedDraftId" @change="loadSelectedDraft"
            :disabled="isLoadingDrafts || userDrafts.length === 0"
            class="w-full max-w-md px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 shadow-sm hover:border-gray-300 appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed">
            <option value="" disabled>
              {{ isLoadingDrafts ? 'Loading drafts...' : 'Select a draft' }}
            </option>
            <option v-if="!isLoadingDrafts && userDrafts.length === 0" value="" disabled>
              No drafts available
            </option>
            <option v-for="draft in userDrafts" :key="draft.id" :value="draft.id">
              {{ draft.title_of_cpd || `Draft ${draft.id}` }}
            </option>
          </select>
        </div>
        <p v-if="isEditingDraft" class="mt-2 text-sm text-indigo-600 font-medium">
          Editing Draft: {{ form.title_of_cpd || `Draft ${currentDraftId.value}` }}
        </p>
      </div>

      <!-- Form Header - CPD Details -->
      <div class="bg-gray-50/70 p-6 border-b border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800">CPD Details</h3>
        <p class="mt-1 text-gray-500 text-sm">Provide information about your CPD activity.</p>
      </div>

      <!-- Form Body - CPD Details -->
      <div class="p-6 space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-6">
          <div class="space-y-1.5">
            <label for="title_of_cpd" class="text-xs font-medium text-gray-700 flex items-center">
              Title of CPD <span class="text-red-500 ml-1">*</span>
            </label>
            <input id="title_of_cpd" v-model="form.title_of_cpd" type="text"
              class="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 shadow-sm hover:border-gray-300"
              required placeholder="Enter CPD title" />
            <span v-if="errors.title_of_cpd" class="text-xs text-red-500 block">{{ errors.title_of_cpd }}</span>
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

          <div class="space-y-1.5">
            <label for="type_of_cpd_activity" class="text-xs font-medium text-gray-700 flex items-center">
              CPD Activity Type <span class="text-red-500 ml-1">*</span>
            </label>
            <select id="type_of_cpd_activity" v-model="form.type_of_cpd_activity"
              :disabled="isLoadingData || cpdActivities.length === 0"
              class="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 shadow-sm hover:border-gray-300 appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              required>
              <option value="" disabled>
                {{ isLoadingData ? 'Loading activities...' : 'Select activity type' }}
              </option>
              <option v-if="!isLoadingData && cpdActivities.length === 0" value="" disabled>
                No activities available
              </option>
              <option v-for="activity in cpdActivities" :key="activity.id" :value="activity.id">
                {{ activity.cpd_activity_name }}
              </option>
            </select>
            <span v-if="errors.type_of_cpd_activity" class="text-xs text-red-500 block">{{
              errors.type_of_cpd_activity
            }}</span>
          </div>

          <div class="space-y-1.5">
            <label for="attachment" class="text-xs font-medium text-gray-700">Supporting Documents</label>
            <div class="relative">
              <input id="attachment" type="file" ref="fileInputRef" @change="handleFileUpload"
                class="w-full px-3 py-2 rounded-md border-2 border-dashed border-gray-200 bg-gray-50/50 text-gray-800 text-sm placeholder-gray-400 hover:border-indigo-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 cursor-pointer file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
              <p class="mt-1.5 text-xs text-gray-500">PDF, DOC, JPG, PNG (Max: 2MB)</p>
              <p v-if="attachmentFileName" class="mt-1 text-xs text-indigo-600 font-medium">
                Current file: {{ attachmentFileName }}
              </p>
            </div>
            <span v-if="errors.attachment" class="text-xs text-red-500 block">{{ errors.attachment }}</span>
          </div>
        </div>
      </div>

      <!-- Form Footer / Actions -->
      <div class="bg-gray-50/70 px-6 py-4 flex justify-end space-x-3 border-t border-gray-100">
        <button type="button" @click="handleCancel"
          class="px-4 py-2 rounded-md bg-white text-gray-700 text-sm border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition duration-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-400">
          Cancel
        </button>
        <button type="button" @click="handleSaveDraft" :disabled="isSubmitting || isSubmittingDraft"
          class="px-4 py-2 rounded-md bg-yellow-500 text-white text-sm hover:bg-yellow-600 transition duration-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed">
          {{ isSubmittingDraft ? 'Saving Draft...' : (isEditMode ? 'Update Draft' : 'Save as Draft') }}
        </button>
        <button type="submit" :disabled="isSubmitting || isLoadingData || isSubmittingDraft"
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
          <span v-else>Submit Application</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/authStore';
import apiService from '@/services/services';
import { useRouter } from 'vue-router';
import PageHeader from '@/components/common/MHPC/PageHeader.vue';
import { ClipboardList } from 'lucide-vue-next';

const toast = useToast();
const authStore = useAuthStore();
const router = useRouter();

// --- STATE MANAGEMENT ---
const form = reactive({
  registration_record_id: null,
  display_registration_no: '',
  cid_no: '',
  full_name: '',
  gender: '',
  title_of_cpd: '',
  relevance_to_profession: '',
  type_of_cpd_activity: '',
  attachment: null,
});
const errors = reactive({});
const isSubmitting = ref(false);
const isSubmittingDraft = ref(false);
const isLoadingRegistrationNo = ref(false);
const isLoadingData = ref(false);
const isLoadingDrafts = ref(false);
const cpdActivities = ref([]);
const fileInputRef = ref(null);
const attachmentFileName = ref('');
const userDrafts = ref([]);
const selectedDraftId = ref('');
const currentDraftId = ref(null);
const isEditMode = computed(() => !!currentDraftId.value);
const isEditingDraft = computed(() => !!currentDraftId.value);

// --- DRAFT LOADING ---
const fetchDraftData = async () => {
  if (!form.cid_no) {
    console.warn('No CID set, skipping draft fetch.');
    return;
  }
  isLoadingDrafts.value = true;
  try {
    const filterParams = {
      cid: form.cid_no, // Adjusted to match API endpoint parameter
    };
    const response = await apiService.getEpcCpdRecordsByCid(form.cid_no);
    const drafts = response.data?.results || response.data || [];
    console.log('API Response:', JSON.stringify(response.data, null, 2)); // Debug log
    userDrafts.value = drafts.filter(draft => draft.is_draft === true);

    // Load the latest draft if available
    const latestDraft = userDrafts.value[0]; // Assuming first draft is latest
    if (latestDraft) {
      console.log('Loading draft:', latestDraft);
      selectedDraftId.value = latestDraft.id;
      await loadSelectedDraft();
    } else {
      console.log('No valid drafts found for cid_no:', form.cid_no);
      resetCpdFields();
      toast.info('No draft found for this user. Start a new application.');
    }
  } catch (error) {
    console.error('Error fetching draft data:', error);
    toast.error('Failed to load draft data. Please try again.');
    resetCpdFields();
  } finally {
    isLoadingDrafts.value = false;
  }
};

const loadSelectedDraft = async () => {
  if (!selectedDraftId.value) {
    resetCpdFields();
    return;
  }
  isLoadingData.value = true;
  try {
    const response = await apiService.getEpcCpdRecord(selectedDraftId.value);
    const draftData = response.data;

    console.log('Loaded draft data:', draftData); // Debug log

    resetCpdFields(false);

    currentDraftId.value = draftData.id;
    form.title_of_cpd = draftData.title_of_cpd || '';
    form.relevance_to_profession = draftData.relevance_to_profession || '';
    form.type_of_cpd_activity = draftData.type_of_cpd_activity || '';
    if (draftData.attachment) {
      attachmentFileName.value = draftData.attachment.split('/').pop();
      form.attachment = null; // Reset; user must re-upload
    }
    toast.success('Draft loaded successfully. You can now edit and save or submit.');
  } catch (error) {
    console.error('Error loading draft:', error);
    toast.error('Failed to load the selected draft.');
    resetCpdFields();
  } finally {
    isLoadingData.value = false;
  }
};

// --- FORM HANDLING ---
const createFormData = () => {
  const formData = new FormData();
  formData.append('registration_no', String(form.registration_record_id));
  formData.append('cid_no', form.cid_no);
  formData.append('full_name', form.full_name);
  formData.append('gender', form.gender ? form.gender.toLowerCase() : 'others');
  formData.append('title_of_cpd', form.title_of_cpd);
  formData.append('relevance_to_profession', form.relevance_to_profession);
  formData.append('type_of_cpd_activity', form.type_of_cpd_activity || '');
  formData.append('cpd_credit', '0');

  if (form.attachment instanceof File) {
    formData.append('attachment', form.attachment, form.attachment.name);
  }
  return formData;
};

const handleSaveDraft = async () => {
  if (!form.title_of_cpd?.trim()) {
    toast.error('Please enter a title to save the draft.');
    return;
  }
  isSubmittingDraft.value = true;
  const formData = createFormData();
  formData.append('is_draft', 'true');

  try {
    let response;
    if (isEditMode.value) {
      response = await apiService.updateEpcCpdRecord(currentDraftId.value, formData);
      toast.success('Draft updated successfully!');
    } else {
      response = await apiService.createEpcCpdRecord(formData);
      currentDraftId.value = response.data.id;
      toast.success('Draft saved successfully!');
    }
    await fetchDraftData(); // Refresh drafts list
    selectedDraftId.value = currentDraftId.value; // Update selected draft
  } catch (error) {
    handleSubmissionError(error.response?.data, error);
  } finally {
    isSubmittingDraft.value = false;
  }
};

const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error('Please correct the errors before submitting.');
    return;
  }

  isSubmitting.value = true;
  const formData = createFormData();
  formData.append('is_draft', 'false');

  try {
    let response;
    if (isEditMode.value) {
      response = await apiService.updateEpcCpdRecord(currentDraftId.value, formData);
    } else {
      response = await apiService.createEpcCpdRecord(formData);
    }

    if (response.status >= 200 && response.status < 300) {
      toast.success('Application submitted successfully!');
      router.push('/admin/user/engineering_certification/dashboard');
    } else {
      handleSubmissionError(response.data);
    }
  } catch (error) {
    handleSubmissionError(error.response?.data, error);
  } finally {
    isSubmitting.value = false;
  }
};

// --- HELPER FUNCTIONS ---
const resetCpdFields = (showToast = true) => {
  currentDraftId.value = null;
  selectedDraftId.value = '';
  form.title_of_cpd = '';
  form.relevance_to_profession = '';
  form.type_of_cpd_activity = '';
  form.attachment = null;
  attachmentFileName.value = '';
  Object.keys(errors).forEach((key) => delete errors[key]);
  if (fileInputRef.value) fileInputRef.value.value = '';
  if (showToast) toast.info('CPD fields cleared.');
};

const handleCancel = () => {
  if (isEditMode.value) {
    if (confirm('Are you sure? This will clear the loaded draft and you will lose any unsaved changes.')) {
      resetCpdFields();
    }
  } else {
    resetCpdFields();
  }
};

const validateForm = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);
  let isValid = true;
  if (!form.title_of_cpd?.trim()) {
    errors.title_of_cpd = 'Title of CPD is required.';
    isValid = false;
  }
  if (!form.relevance_to_profession?.trim()) {
    errors.relevance_to_profession = 'Professional relevance is required.';
    isValid = false;
  }
  if (!form.type_of_cpd_activity) {
    errors.type_of_cpd_activity = 'CPD activity type is required.';
    isValid = false;
  }
  if (form.attachment && form.attachment instanceof File && form.attachment.size > 2 * 1024 * 1024) {
    errors.attachment = 'File size must not exceed 2MB.';
    isValid = false;
  }
  if (!form.registration_record_id) {
    errors.general_registration = 'Registration information is missing.';
    toast.error(errors.general_registration);
    isValid = false;
  }
  return isValid;
};

const handleSubmissionError = (errorData, error = null) => {
  let errorMessage = 'An unexpected error occurred.';
  if (errorData) {
    errorMessage = errorData.detail || errorData.message || (typeof errorData === 'string' ? errorData : JSON.stringify(errorData));
    if (typeof errorData === 'object' && errorData !== null) {
      Object.keys(errorData).forEach((key) => {
        if (Object.hasOwn(errors, key)) {
          errors[key] = Array.isArray(errorData[key]) ? errorData[key].join(', ') : errorData[key];
        }
      });
    }
  } else if (error?.message) {
    errorMessage = error.message;
  }
  toast.error(`Submission failed: ${errorMessage}`);
  console.error('Submission error:', error?.response || error || errorData);
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) {
    form.attachment = null;
    attachmentFileName.value = '';
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    errors.attachment = 'File size must not exceed 2MB.';
    toast.error(errors.attachment);
    event.target.value = '';
  } else {
    form.attachment = file;
    attachmentFileName.value = file.name;
    delete errors.attachment;
  }
};

const fetchMasterData = async () => {
  isLoadingData.value = true;
  try {
    const activitiesResponse = await apiService.getEpcMastersCpdActivity();
    const activitiesData = activitiesResponse?.data?.results || activitiesResponse?.data || [];
    cpdActivities.value = Array.isArray(activitiesData) ? activitiesData : [];
  } catch (error) {
    toast.error('Failed to load required data.');
    console.error('Error fetching master data:', error);
  } finally {
    isLoadingData.value = false;
  }
};

const fetchRegistrationDetails = async (cid) => {
  if (!cid) return null;
  isLoadingRegistrationNo.value = true;
  try {
    const response = await apiService.getEpcApplicationsByCid(cid);
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      const appToUse = response.data[0];
      return { recordId: appToUse.id, displayNo: appToUse.registration_no || `ID: ${appToUse.id}` };
    }
  } catch (error) {
    toast.warning('Could not fetch registration details.');
    console.error('Error fetching registration details:', error);
  } finally {
    isLoadingRegistrationNo.value = false;
  }
  return null;
};

// --- LIFECYCLE HOOKS ---
onMounted(async () => {
  if (authStore.user) {
    form.cid_no = authStore.user.cid;
    form.full_name = `${authStore.user.first_name || ''} ${authStore.user.middle_name || ''} ${authStore.user.last_name || ''}`.replace(/\s+/g, ' ').trim();
    form.gender = authStore.user.gender;
  } else {
    toast.error('User data not found. Please log in again.');
    router.push('/login');
    return;
  }
  await Promise.all([fetchMasterData(), fetchRegistrationDetails(form.cid_no)]).then(([_, regDetails]) => {
    if (regDetails) {
      form.registration_record_id = regDetails.recordId;
      form.display_registration_no = regDetails.displayNo;
    }
    // Fetch drafts after personal info is set
    fetchDraftData();
  });
});
</script>

<style scoped>
select:required:invalid {
  color: #9ca3af;
}

option[value=''][disabled] {
  color: #9ca3af;
}

option {
  color: #1f2937;
}

select:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.7;
}

input[type='file']:focus-within {
  outline: none;
}

.min-h-\[38px\] {
  min-height: 38px;
}
</style>
