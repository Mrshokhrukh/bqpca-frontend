<template>
  <div>
    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Institute Information -->
      <div class="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <h3 class="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-gray-200">
         Institution Information
        </h3>
        <div class="mb-6">
          <label for="institute" class="block text-gray-700 font-medium mb-2">Institute <span class="text-red-500">*</span></label>
          <input
            type="text"
            id="institute"
            :value="formData.institute_name"
            disabled
            class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
          />
          <p class="text-sm text-gray-500 mt-1">Auto-populated based on your user profile.</p>
        </div>
        <div class="mb-0">
          <label for="teachingCenter" class="block text-gray-700 font-medium mb-2">Teaching Center <span class="text-red-500">*</span></label>
          <div class="relative">
            <select
              id="teachingCenter"
              v-model="formData.teaching_center_id"
              required
              :disabled="loadingInstituteData || availableTeachingCenters.length === 0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option :value="null" disabled>-- Select Teaching Center --</option>
              <option v-for="center in availableTeachingCenters" :key="center.id" :value="center.id">
                {{ center.center_name }} - {{ center.center_location }}
              </option>
            </select>
            <div
              v-if="loadingInstituteData"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 text-gray-500 text-sm"
            >
              <div class="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <span>Loading...</span>
            </div>
          </div>
          <p v-if="availableTeachingCenters.length === 0 && !loadingInstituteData" class="text-sm text-red-500 mt-1">
            No active teaching centers found for your institute. Please add one first.
          </p>
        </div>
      </div>

      <!-- Program Information -->
      <div class="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <h3 class="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-gray-200">Program Details</h3>
        <div class="mb-6">
          <label for="programMaster" class="block text-gray-700 font-medium mb-2">Program Category <span class="text-red-500">*</span></label>
          <div class="relative">
            <select
              id="programMaster"
              v-model="formData.program_master_id"
              required
              :disabled="loadingProgramMasters || programMasters.length === 0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option :value="null" disabled>-- Select Program Category --</option>
              <option v-for="program in programMasters" :key="program.id" :value="program.id">
                {{ program.program_name }} <span v-if="program.duration_years"> ({{ program.duration_years }} years)</span>
              </option>
            </select>
            <div
              v-if="loadingProgramMasters"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 text-gray-500 text-sm"
            >
              <div class="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <span>Loading...</span>
            </div>
          </div>
          <div v-if="selectedProgramDetails" class="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-md">
            <p class="text-sm text-gray-800 mb-1"><span class="font-medium">Duration:</span> {{ selectedProgramDetails.duration_years }} years</p>
            <p class="text-sm text-gray-800"><span class="font-medium">Description:</span> {{ selectedProgramDetails.description }}</p>
          </div>
        </div>
        <div class="mb-0">
          <label for="specificProgramTitle" class="block text-gray-700 font-medium mb-2">Specific Program Title <span class="text-red-500">*</span></label>
          <input
            type="text"
            id="specificProgramTitle"
            v-model.trim="formData.specific_program_title"
            placeholder="e.g., Bachelor of Science in Clinical Psychology"
            required
            maxlength="200"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- Document Uploads -->
      <div class="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <h3 class="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-gray-200">Required Documents</h3>
        <!-- Curriculum Validation Letter -->
        <div class="mb-6">
          <label for="validationLetter" class="block text-gray-700 font-medium mb-2">
            Curriculum Validation Letter
            <span v-if="!isEditing || !formData.existing_validation_letter_url" class="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="validationLetter"
            @change="handleFileChange($event, 'validationLetter')"
            accept=".pdf"
            :required="!isEditing || (!formData.existing_validation_letter_url && !formData.curriculum_validation_letter_file)"
            class="w-full px-3 py-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <div
            v-if="isEditing && formData.existing_validation_letter_url && !formData.curriculum_validation_letter_file"
            class="mt-2 text-sm text-gray-600"
          >
            Current file: <a :href="formData.existing_validation_letter_url" target="_blank" class="text-blue-600 hover:underline">View Current Letter</a>
            <button type="button" @click="removeFile('validationLetter')" class="ml-2 text-red-500 hover:text-red-700 text-xs">(Remove)</button>
            <p class="text-xs text-gray-500">To replace, choose a new file above.</p>
          </div>
          <div
            v-if="formData.curriculum_validation_letter_file"
            class="mt-2 flex items-center space-x-2 p-2 bg-blue-50 border border-blue-200 rounded-md"
          >
            <span class="text-xl">📄</span>
            <span class="flex-1 text-blue-800 font-medium text-sm">{{ formData.curriculum_validation_letter_file.name }}</span>
            <button
              type="button"
              @click="removeFile('validationLetter')"
              class="bg-red-500 hover:bg-red-600 text-white rounded w-6 h-6 flex items-center justify-center text-xs"
            >
              ✕
            </button>
          </div>
          <p class="text-sm text-gray-500 mt-1">PDF format only, max 10MB.</p>
        </div>

        <!-- Curriculum Document -->
        <div class="mb-0">
          <label for="curriculumDocument" class="block text-gray-700 font-medium mb-2">
            Curriculum Document
            <span v-if="!isEditing || !formData.existing_document_url" class="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="curriculumDocument"
            @change="handleFileChange($event, 'document')"
            accept=".pdf"
            :required="!isEditing || (!formData.existing_document_url && !formData.curriculum_document_file)"
            class="w-full px-3 py-2 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <div
            v-if="isEditing && formData.existing_document_url && !formData.curriculum_document_file"
            class="mt-2 text-sm text-gray-600"
          >
            Current file: <a :href="formData.existing_document_url" target="_blank" class="text-blue-600 hover:underline">View Current Document</a>
            <button type="button" @click="removeFile('document')" class="ml-2 text-red-500 hover:text-red-700 text-xs">(Remove)</button>
            <p class="text-xs text-gray-500">To replace, choose a new file above.</p>
          </div>
          <div
            v-if="formData.curriculum_document_file"
            class="mt-2 flex items-center space-x-2 p-2 bg-blue-50 border border-blue-200 rounded-md"
          >
            <span class="text-xl">📄</span>
            <span class="flex-1 text-blue-800 font-medium text-sm">{{ formData.curriculum_document_file.name }}</span>
            <button
              type="button"
              @click="removeFile('document')"
              class="bg-red-500 hover:bg-red-600 text-white rounded w-6 h-6 flex items-center justify-center text-xs"
            >
              ✕
            </button>
          </div>
          <p class="text-sm text-gray-500 mt-1">PDF format only, max 10MB.</p>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          @click="emit('close')"
          :disabled="isSubmitting"
          class="px-6 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-md font-medium hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSubmitting || !isFormValid"
          class="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 min-w-[150px]"
        >
          <span v-if="isSubmitting" class="flex items-center justify-center space-x-2">
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>{{ isEditing ? 'Updating...' : 'Submitting...' }}</span>
          </span>
          <span v-else>{{ isEditing ? 'Update Program' : 'Submit Program' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import apiServices from '@/services/services';
import { useToast } from 'vue-toastification';

const props = defineProps({
  applicationToEdit: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'program-saved']);
const authStore = useAuthStore();
const toast = useToast();

const initialFormData = () => ({
  id: null,
  institute_id: null,
  institute_name: '',
  teaching_center_id: null,
  program_master_id: null,
  specific_program_title: '',
  curriculum_validation_letter_file: null,
  curriculum_document_file: null,
  existing_validation_letter_url: null,
  existing_document_url: null,
});

const formData = ref(initialFormData());
const programMasters = ref([]);
const loadingProgramMasters = ref(false);
const availableTeachingCenters = ref([]);
const loadingInstituteData = ref(false);
const isSubmitting = ref(false);

const isEditing = computed(() => !!formData.value.id);

const selectedProgramDetails = computed(() => {
  if (!formData.value.program_master_id) return null;
  return programMasters.value.find(p => p.id === formData.value.program_master_id);
});

const isFormValid = computed(() => {
  const filesValid = isEditing.value ?
    (formData.value.existing_validation_letter_url || formData.value.curriculum_validation_letter_file) &&
    (formData.value.existing_document_url || formData.value.curriculum_document_file)
    :
    (formData.value.curriculum_validation_letter_file && formData.value.curriculum_document_file);

  return !!(formData.value.institute_id &&
    formData.value.program_master_id &&
    formData.value.specific_program_title.trim() &&
    formData.value.teaching_center_id &&
    filesValid);
});

// --- DATA FETCHING ---

const fetchInstituteAndTeachingCenters = async (instituteIdToUse) => {
  if (!instituteIdToUse) {
    console.error('No instituteIdToUse provided');
    toast.error('Institute ID not found.');
    formData.value.institute_name = 'Unknown Institute';
    return;
  }

  console.log('Fetching for instituteIdToUse:', instituteIdToUse);
  formData.value.institute_id = Number(instituteIdToUse);
  loadingInstituteData.value = true;
  availableTeachingCenters.value = [];

  try {
    const instituteResponse = await apiServices.getMhpcInstitutes({ id: instituteIdToUse });
    const instituteData = instituteResponse.data.results?.[0] || instituteResponse.data;
    console.log('Institute Response:', instituteData);
    formData.value.institute_name = instituteData?.name_of_institution || `Institute ID: ${instituteIdToUse}`;

    const teachingCentersResponse = await apiServices.getMhpcTeachingCenters();
    // console.log('Raw Teaching Centers Response:', JSON.stringify(teachingCentersResponse.data, null, 2));
    const allCenters = teachingCentersResponse.data.results || teachingCentersResponse.data || [];
    // console.log('Processed Teaching Centers:', allCenters);

    availableTeachingCenters.value = allCenters
      .filter(center => {
        // Handle institute as object, institute_details, or ID
        const centerInstituteId = center.institute_details?.id
          ? Number(center.institute_details.id)
          : center.institute?.id
            ? Number(center.institute.id)
            : Number(center.institute);
        const isMatch = center.is_active && centerInstituteId === Number(instituteIdToUse);
        // console.log(`Center: ${center.center_name}, is_active: ${center.is_active}, institute_id: ${centerInstituteId}, instituteIdToUse: ${instituteIdToUse}, match: ${isMatch}`);
        return isMatch;
      })
      .sort((a, b) => a.center_name.localeCompare(b.center_name));

    // console.log('Filtered Teaching Centers:', availableTeachingCenters.value);
    if (availableTeachingCenters.value.length === 0) {
      console.warn('No active teaching centers found for institute ID:', instituteIdToUse);
      toast.warning('No active teaching centers found for your institute.');
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    toast.error('Failed to load institution data.');
  } finally {
    loadingInstituteData.value = false;
  }
};

const fetchProgramMastersData = async () => {
  loadingProgramMasters.value = true;
  try {
    const response = await apiServices.getMhpcProgramMasters();
    programMasters.value = (response.data.results || response.data || []).sort((a, b) => a.program_name.localeCompare(b.program_name));
  } catch (error) {
    console.error('Error fetching program masters:', error);
    toast.error('Failed to load program categories.');
  } finally {
    loadingProgramMasters.value = false;
  }
};


// --- INITIALIZATION LOGIC ---

const initializeForEdit = async (appData) => {
  resetForm();
  if (!appData) return initializeForNew();

  const instituteId = appData.institute?.id || authStore.user?.id;
  await Promise.all([
      fetchInstituteAndTeachingCenters(instituteId),
      fetchProgramMastersData()
  ]);

  // Populate form after data is loaded
  formData.value.id = appData.id;
  formData.value.teaching_center_id = appData.teaching_center;
  formData.value.program_master_id = appData.program_master?.id || appData.program_master;
  formData.value.specific_program_title = appData.specific_program_title;
  formData.value.existing_validation_letter_url = appData.curriculum_validation_letter;
  formData.value.existing_document_url = appData.curriculum_document;
};

const initializeForNew = async () => {
  resetForm();
  if (!authStore.user?.id) {
    // This case is handled by the watcher, but good to have a guard
    toast.info("Waiting for user information...");
    return;
  }
  await Promise.all([
      fetchInstituteAndTeachingCenters(authStore.user.id),
      fetchProgramMastersData()
  ]);
};

// WATCHER: This is the key to solving the race condition.
// It watches the `applicationToEdit` prop to decide whether to run `initializeForEdit` or `initializeForNew`.
// It only runs ONCE the data is actually available.
watch(() => props.applicationToEdit, (appData) => {
    if (appData) {
        initializeForEdit(appData);
    } else {
        // For new applications, we must also wait for the user to be loaded
        if (authStore.user?.id) {
            initializeForNew();
        } else {
            // If the user isn't loaded yet, watch for them to become available
            const unwatch = watch(() => authStore.user, (newUser) => {
                if (newUser?.id) {
                    initializeForNew();
                    unwatch(); // Stop watching once we've initialized
                }
            }, { immediate: true });
        }
    }
}, { immediate: true }); // `immediate: true` makes it run on component mount


// --- FORM HANDLING ---
// (The rest of your handleSubmit, removeFile, etc. functions go here, they don't need to change)
// ... [Your existing handleSubmit, handleFileChange, removeFile, resetForm functions] ...
const handleSubmit = async () => {
  if (!isFormValid.value) {
    toast.error('Please fill in all required fields and ensure valid PDF files are attached.');
    return;
  }
  isSubmitting.value = true;
  const submissionPayload = new FormData();

  submissionPayload.append('institute_id', formData.value.institute_id);
  submissionPayload.append('program_master_id', formData.value.program_master_id);
  submissionPayload.append('specific_program_title', formData.value.specific_program_title.trim());
  submissionPayload.append('teaching_center', formData.value.teaching_center_id);

  if (formData.value.curriculum_validation_letter_file) {
    submissionPayload.append('curriculum_validation_letter', formData.value.curriculum_validation_letter_file);
  }
  if (formData.value.curriculum_document_file) {
    submissionPayload.append('curriculum_document', formData.value.curriculum_document_file);
  }

  try {
    if (isEditing.value) {
      await apiServices.patchMhpcProgramOffered(formData.value.id, submissionPayload);
      toast.success('Program offering updated successfully!');
    } else {
      await apiServices.createMhpcProgramOffered(submissionPayload);
      toast.success('Program offering submitted successfully!');
    }
    emit('program-saved');
  } catch (error) {
    console.error(`Error ${isEditing.value ? 'updating' : 'submitting'} program offering:`, error);
    const errorData = error.response?.data;
    let errorMessage = `Failed to ${isEditing.value ? 'update' : 'submit'} program offering.`;
    if (errorData && typeof errorData === 'object') {
      const messages = Object.entries(errorData).map(([key, value]) => `${key.replace(/_/g, ' ')}: ${Array.isArray(value) ? value.join(', ') : value}`);
      errorMessage = messages.join('\n') || errorMessage;
    } else if (errorData?.detail) {
      errorMessage = errorData.detail;
    }
    toast.error(errorMessage, { timeout: 8000 });
  } finally {
    isSubmitting.value = false;
  }
};

const handleFileChange = (event, fileType) => {
  const file = event.target.files[0];
  const targetKey = fileType === 'validationLetter' ? 'curriculum_validation_letter_file' : 'curriculum_document_file';

  if (!file) {
    formData.value[targetKey] = null;
    return;
  }
  if (file.type !== 'application/pdf') {
    toast.error('Only PDF files are allowed.');
    event.target.value = '';
    formData.value[targetKey] = null;
    return;
  }
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    toast.error('File size must be less than 10MB.');
    event.target.value = '';
    formData.value[targetKey] = null;
    return;
  }

  formData.value[targetKey] = file;
};

const clearFileInputsDOM = () => {
  const validationInput = document.getElementById('validationLetter');
  if (validationInput) validationInput.value = '';
  const documentInput = document.getElementById('curriculumDocument');
  if (documentInput) documentInput.value = '';
};

const removeFile = (fileType) => {
  if (fileType === 'validationLetter') {
    formData.value.curriculum_validation_letter_file = null;
    formData.value.existing_validation_letter_url = null;
    const input = document.getElementById('validationLetter');
    if (input) input.value = '';
  } else if (fileType === 'document') {
    formData.value.curriculum_document_file = null;
    formData.value.existing_document_url = null;
    const input = document.getElementById('curriculumDocument');
    if (input) input.value = '';
  }
};

const resetForm = () => {
  formData.value = initialFormData();
  availableTeachingCenters.value = [];
  programMasters.value = [];
  clearFileInputsDOM();
};

defineExpose({ initializeForEdit, initializeForNew, resetForm });
</script>
