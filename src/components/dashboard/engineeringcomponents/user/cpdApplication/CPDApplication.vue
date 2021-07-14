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
      <!-- ADDED: Button to open the drafts modal -->
      <template #actions>
        <button @click="openDraftsModal"
          class="flex items-center px-4 py-2 bg-white border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
          <span class="mr-2"></span> <!-- Folder Icon -->
          Load My Drafts
        </button>
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
              {{
                form.display_registration_no || (isLoadingRegistrationNo ? 'Fetching...' : 'N/A')
              }}
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
        <button type="button" @click="handleSaveDraft" :disabled="isSubmitting"
          class="px-4 py-2 rounded-md bg-yellow-500 text-white text-sm hover:bg-yellow-600 transition duration-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed">
          {{ isEditMode ? 'Update Draft' : 'Save as Draft' }}
        </button>
        <button type="submit" :disabled="isSubmitting || isLoadingData"
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

    <!-- Drafts Modal -->
    <Transition name="modal">
      <div v-if="isDraftsModalOpen"
        class="fixed z-50 inset-0 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl" ref="modalContentRef">
          <div class="p-5 border-b flex justify-between items-center">
            <h3 class="text-xl font-semibold text-gray-800">My Saved Drafts</h3>
            <button @click="isDraftsModalOpen = false"
              class="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-800 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="p-6 max-h-[60vh] overflow-y-auto">
            <div v-if="isLoadingDrafts" class="text-center py-8 text-gray-500">Loading drafts...</div>
            <div v-else-if="userDrafts.length === 0" class="text-center py-8 text-gray-500">You have no saved drafts.
            </div>
            <ul v-else class="space-y-3">
              <li v-for="draft in userDrafts" :key="draft.id"
                class="p-4 border rounded-lg hover:bg-indigo-50 flex justify-between items-center transition-colors">
                <div>
                  <p class="font-medium text-gray-800">{{ draft.title_of_cpd || 'Untitled Draft' }}</p>
                  <p class="text-sm text-gray-500 mt-1">Last saved: {{ new Date(draft.updated_at).toLocaleDateString()
                  }}
                  </p>
                </div>
                <button @click="loadSelectedDraft(draft.id)"
                  class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-shadow shadow-sm">Load
                  Draft</button>
              </li>
            </ul>
          </div>
          <div class="p-4 bg-gray-50 border-t text-right">
            <button @click="isDraftsModalOpen = false"
              class="px-5 py-2 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-100">Close</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, computed } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/authStore';
import apiService from '@/services/services';
import { useRouter } from 'vue-router';
import { onClickOutside } from '@vueuse/core';
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
const isLoadingRegistrationNo = ref(false);
const isLoadingData = ref(false);
const cpdActivities = ref([]);
const fileInputRef = ref(null);
const attachmentFileName = ref('');

// --- DRAFTS AND EDIT MODE STATE ---
const userDrafts = ref([]);
const isDraftsModalOpen = ref(false);
const isLoadingDrafts = ref(false);
const modalContentRef = ref(null);
const currentDraftId = ref(null);

onClickOutside(modalContentRef, () => (isDraftsModalOpen.value = false));

const isEditMode = computed(() => !!currentDraftId.value);

// --- DRAFT MODAL AND LOADING LOGIC ---
const openDraftsModal = async () => {
  isLoadingDrafts.value = true;
  isDraftsModalOpen.value = true;
  try {
    const response = await apiService.getEpcCpdRecords({
      cid_no: authStore.user.cid,
      is_draft: true,
    });
    userDrafts.value = response.data.results || [];
  } catch (error) {
    toast.error("Could not fetch your drafts.");
    console.error(error);
  } finally {
    isLoadingDrafts.value = false;
  }
};

const loadSelectedDraft = async (draftId) => {
  isDraftsModalOpen.value = false;
  isLoadingData.value = true;
  try {
    // NOTE: Your apiService needs a method for this, e.g., getSingleEpcCpdRecord(id)
    const response = await apiService.getSingleEpcCpdRecord(draftId);
    const draftData = response.data;

    resetForm(false); // Reset form without showing a toast

    // Populate form with fetched draft data
    currentDraftId.value = draftData.id;
    form.registration_record_id = draftData.registration_no;
    form.title_of_cpd = draftData.title_of_cpd;
    form.relevance_to_profession = draftData.relevance_to_profession;
    form.type_of_cpd_activity = draftData.type_of_cpd_activity;

    if (draftData.attachment) {
      attachmentFileName.value = draftData.attachment.split('/').pop();
    }
    toast.success("Draft loaded successfully!");
  } catch (error) {
    toast.error("Failed to load the selected draft.");
    console.error(error);
  } finally {
    isLoadingData.value = false;
  }
};

// --- CORE FORM LOGIC (CREATE, UPDATE, SUBMIT) ---
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
    toast.error("Please enter a title to save the draft.");
    return;
  }
  isSubmitting.value = true;
  const formData = createFormData();
  formData.append('is_draft', 'true');

  try {
    let response;
    if (isEditMode.value) {
      // NOTE: Your apiService needs an update method
      response = await apiService.updateEpcCpdRecord(currentDraftId.value, formData);
      toast.success('Draft updated successfully!');
    } else {
      response = await apiService.createEpcCpdRecord(formData);
      currentDraftId.value = response.data.id;
      toast.success('Draft saved successfully!');
    }
  } catch (error) {
    handleSubmissionError(error.response?.data, error);
  } finally {
    isSubmitting.value = false;
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
const resetForm = (showToast = true) => {
  currentDraftId.value = null; // Exit edit mode
  form.title_of_cpd = '';
  form.relevance_to_profession = '';
  form.type_of_cpd_activity = '';
  form.attachment = null;
  attachmentFileName.value = '';
  Object.keys(errors).forEach((key) => delete errors[key]);
  if (fileInputRef.value) fileInputRef.value.value = '';
  if (showToast) toast.info('Form has been cleared.');
};

const handleCancel = () => {
  if (isEditMode.value) {
    if (confirm("Are you sure? This will clear the loaded draft and you will lose any unsaved changes.")) {
      resetForm();
    }
  } else {
    resetForm();
  }
};

const validateForm = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);
  let isValid = true;
  if (!form.title_of_cpd?.trim()) {
    errors.title_of_cpd = 'Title of CPD is required.'; isValid = false;
  }
  if (!form.relevance_to_profession?.trim()) {
    errors.relevance_to_profession = 'Professional relevance is required.'; isValid = false;
  }
  if (!form.type_of_cpd_activity) {
    errors.type_of_cpd_activity = 'CPD activity type is required.'; isValid = false;
  }
  if (form.attachment && form.attachment.size > 2 * 1024 * 1024) {
    errors.attachment = 'File size must not exceed 2MB.'; isValid = false;
  }
  if (!form.registration_record_id) {
    errors.general_registration = 'Registration information is missing.'; toast.error(errors.general_registration); isValid = false;
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
      // Simple logic: just take the first application found
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
  await fetchMasterData();
  const regDetails = await fetchRegistrationDetails(form.cid_no);
  if (regDetails) {
    form.registration_record_id = regDetails.recordId;
    form.display_registration_no = regDetails.displayNo;
  }
});
</script>

<style scoped>
/* Add this for the modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Other existing styles */
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
