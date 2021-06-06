<template>
  <!-- MODAL WRAPPER -->
  <div class="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
    <div class="p-6 border-b border-gray-200">
      <h2 id="modal-headline" class="text-xl font-semibold text-gray-900">
        {{ isEditMode ? 'Edit Educational Programme' : 'New Educational Programme Application' }}
      </h2>
      <p v-if="!isEditMode" class="mt-1 text-sm text-gray-500">
        Complete the form to apply for a new educational programme.
      </p>
       <p v-if="isEditMode" class="mt-1 text-sm text-gray-500">
        Update the details of the educational programme.
      </p>
    </div>

    <div v-if="isLoadingData" class="flex-grow flex flex-col items-center justify-center min-h-[300px] p-6">
      <Loader class="animate-spin text-indigo-600 w-10 h-10" />
      <p class="mt-4 text-lg font-medium text-gray-700">
        {{ loadingMessage }}
      </p>
    </div>

    <div
      v-else-if="apiError || (!userInstitute && !isLoadingData && !isEditMode && !userCid)"
      class="flex-grow mt-0 text-center py-16 px-6"
      :class="apiError && !(!userInstitute && !isEditMode && !userCid) ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'"
    >
      <InformationCircleIcon
        v-if="!userInstitute && !isEditMode && !apiError && !userCid"
        class="mx-auto h-12 w-12 text-yellow-400"
      />
      <ExclamationTriangleIcon v-else class="mx-auto h-12 w-12 text-red-400" />
      <h3 class="mt-2 text-lg font-medium" :class="apiError && !(!userInstitute && !isEditMode && !userCid) ? 'text-red-900' : 'text-yellow-900'">
        {{ apiError && !(!userInstitute && !isEditMode && !userCid) ? 'Error Loading Data' : (!userInstitute && !isEditMode && !userCid ? 'Institute Information Not Found' : 'An Error Occurred') }}
      </h3>
      <p class="mt-1 text-sm" :class="apiError && !(!userInstitute && !isEditMode && !userCid) ? 'text-red-700' : 'text-yellow-700'">
        {{ errorMessage }}
      </p>
      <p v-if="!userInstitute && !apiError && !isEditMode && !userCid" class="mt-1 text-sm text-yellow-700">
        Please ensure your institute is registered before applying for a new educational programme. This is a prerequisite.
      </p>
       <div class="mt-6" v-if="apiError && !(!userInstitute && !isEditMode && !userCid)">
          <button @click="$emit('close-modal')" type="button" class="btn btn-outline">Close</button>
      </div>
    </div>

    <form
      v-else
      @submit.prevent="handleSubmit"
      class="flex-grow overflow-y-auto"
    >
      <!-- Educational Programme Details -->
      <div class="form-section">
        <div class="section-header">
          <DocumentTextIcon class="w-6 h-6 text-indigo-700 mr-3 flex-shrink-0" aria-hidden="true" />
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Educational Programme Details</h3>
            <p class="mt-1 text-xs text-gray-500">
              Provide information about the educational programme.
            </p>
          </div>
        </div>
        <div class="section-content">
          <div>
            <label for="programmeName" class="form-label required-label">Educational Programme Name</label>
            <input type="text" id="programmeName" v-model="formData.course_title" required class="form-input" />
            <p v-if="validationErrors.course_title" class="form-error-message">{{ validationErrors.course_title }}</p>
          </div>
          <div>
            <label for="duration" class="form-label required-label">Duration (in months)</label>
            <input type="number" id="duration" v-model.number="formData.duration_in_months" required min="1" class="form-input" />
            <p v-if="validationErrors.duration_in_months" class="form-error-message">{{ validationErrors.duration_in_months }}</p>
          </div>
          <div>
            <label for="commencementDate" class="form-label required-label">Commencement Date</label>
            <input type="date" id="commencementDate" v-model="formData.commencement_date" required class="form-input" :min="todayDate" />
            <p v-if="validationErrors.commencement_date" class="form-error-message">{{ validationErrors.commencement_date }}</p>
          </div>
          <div>
            <label for="validationLetter" class="form-label required-label">Curriculum Validation Letter (KGUMSB)</label>
            <input type="file" id="validationLetter" @change="handleValidationLetterUpload" class="form-file-input" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
             <p class="mt-1.5 text-xs text-gray-500">
              <span v-if="isEditMode && formData.existing_curriculum_validation_letter_name">Current: {{ formData.existing_curriculum_validation_letter_name }}. </span>
              Attach new file to replace. (PDF, Word, Image)
            </p>
            <p v-if="selectedValidationLetterFileName" class="mt-1.5 text-xs text-green-600">Selected: {{ selectedValidationLetterFileName }}</p>
            <p v-if="validationErrors.curriculum_validation_letter" class="form-error-message">{{ validationErrors.curriculum_validation_letter }}</p>
          </div>
          <div>
            <label for="curriculumDocument" class="form-label required-label">Curriculum Document</label>
            <input type="file" id="curriculumDocument" @change="handleCurriculumDocUpload" class="form-file-input" accept=".pdf,.doc,.docx" />
            <p class="mt-1.5 text-xs text-gray-500">
              <span v-if="isEditMode && formData.existing_curriculum_document_name">Current: {{ formData.existing_curriculum_document_name }}. </span>
              Attach new file to replace. (PDF, Word)
            </p>
            <p v-if="selectedCurriculumDocFileName" class="mt-1.5 text-xs text-green-600">Selected: {{ selectedCurriculumDocFileName }}</p>
            <p v-if="validationErrors.curriculum_document" class="form-error-message">{{ validationErrors.curriculum_document }}</p>
          </div>
          <div>
            <label for="attachments" class="form-label">Other Supporting Documents (Optional)</label>
            <input type="file" id="attachments" @change="handleGeneralFileUpload" class="form-file-input" />
            <p class="mt-1.5 text-xs text-gray-500">
              <span v-if="isEditMode && formData.existing_attachment_name">Current: {{ formData.existing_attachment_name }}. </span>
              Attach new file to replace if needed.
            </p>
            <p v-if="selectedGeneralFileName" class="mt-1.5 text-xs text-green-600">Selected: {{ selectedGeneralFileName }}</p>
            <p v-if="validationErrors.institute_attachments" class="form-error-message">{{ validationErrors.institute_attachments }}</p>
          </div>
          <div class="md:col-span-2">
            <label for="remarks" class="form-label">Remarks</label>
            <textarea id="remarks" v-model="formData.remarks" rows="3" class="form-textarea"></textarea>
          </div>
        </div>
      </div>

      <!-- Programme Structure: Semesters, Modules, Faculty -->
      <div class="form-section">
        <div class="section-header border-t border-gray-200">
          <AcademicCapIcon class="w-6 h-6 text-indigo-700 mr-3 flex-shrink-0" aria-hidden="true" />
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Programme Structure</h3>
            <p class="mt-1 text-xs text-gray-500">
              Define semesters, modules, student capacity, and assign faculty.
            </p>
          </div>
        </div>
        <div class="section-content-full p-0">
          <div v-if="isLoadingMasters || (!masterModulesList.length && !masterFacultyList.length && !apiError && !isLoadingData)" class="p-6 text-center text-gray-500"> <!-- Check apiError & isLoadingData to not show this if main data loading failed -->
              <span v-if="isLoadingMasters">Loading master data for modules and faculty...</span>
              <span v-else-if="!apiError && !isLoadingData">Could not load master data for selection. Programme structure cannot be fully defined. Ensure master modules and faculty are set up in the system.</span>
          </div>
          <div v-else-if="masterModulesList.length || masterFacultyList.length"> <!-- Changed to OR to allow showing structure even if one list is populated -->
            <!-- Semesters -->
            <div v-for="(semester, semIndex) in formData.semesters" :key="semester.temp_id" class="p-4 md:p-6 border-b border-gray-200 last:border-b-0 bg-gray-50/50 rounded-md mb-4 mx-2 md:mx-4 mt-4">
              <div class="flex justify-between items-center mb-3">
                <h4 class="text-md font-semibold text-gray-800 flex items-center">
                   <input type="text" v-model="semester.name" placeholder="e.g., Year 1, Semester 1" class="form-input form-input-sm inline-block w-auto max-w-[200px] md:max-w-xs mr-2" :class="{'border-red-500': validationErrors[`semesters[${semIndex}].name`]}" />
                   <span class="text-gray-500 italic">(Semester {{ semIndex + 1 }})</span>
                </h4>
                <button type="button" @click="removeSemester(semIndex)" class="text-red-600 hover:text-red-800 text-sm font-medium flex items-center">
                  <MinusCircleIcon class="w-5 h-5 mr-1" /> Remove Semester
                </button>
              </div>
              <p v-if="validationErrors[`semesters[${semIndex}].name`]" class="form-error-message mb-2">{{ validationErrors[`semesters[${semIndex}].name`] }}</p>

              <!-- Modules within Semester -->
              <div class="pl-0 md:pl-4">
                <div v-for="(moduleItem, modIndex) in semester.modules" :key="moduleItem.temp_id" class="p-3 md:p-4 border border-gray-300 rounded-md mb-3 bg-white shadow-sm relative">
                  <button type="button" @click="removeModuleFromSemester(semIndex, modIndex)" class="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 z-10">
                      <XCircleIcon class="w-5 h-5" />
                  </button>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <label :for="`module-name-${semIndex}-${modIndex}`" class="form-label text-xs required-label">Module</label>
                      <select :id="`module-name-${semIndex}-${modIndex}`" v-model="moduleItem.module_master_id" class="form-input form-input-sm" required :class="{'border-red-500': validationErrors[`semesters[${semIndex}].modules[${modIndex}].module_master_id`]}" :disabled="!masterModulesList.length">
                        <option disabled value="">{{ masterModulesList.length ? 'Select Module' : 'No modules available' }}</option>
                        <option v-for="masterMod in masterModulesList" :key="masterMod.id" :value="masterMod.id">{{ masterMod.module_name }} ({{masterMod.module_code}})</option>
                      </select>
                      <p v-if="validationErrors[`semesters[${semIndex}].modules[${modIndex}].module_master_id`]" class="form-error-message">{{ validationErrors[`semesters[${semIndex}].modules[${modIndex}].module_master_id`] }}</p>
                    </div>
                    <div>
                      <label :for="`module-students-${semIndex}-${modIndex}`" class="form-label text-xs required-label">Number of Students</label>
                      <input type="number" :id="`module-students-${semIndex}-${modIndex}`" v-model.number="moduleItem.number_of_students" min="1" class="form-input form-input-sm" required :class="{'border-red-500': validationErrors[`semesters[${semIndex}].modules[${modIndex}].number_of_students`]}" />
                       <p v-if="validationErrors[`semesters[${semIndex}].modules[${modIndex}].number_of_students`]" class="form-error-message">{{ validationErrors[`semesters[${semIndex}].modules[${modIndex}].number_of_students`] }}</p>
                    </div>
                  </div>

                  <!-- Faculty within Module -->
                  <div class="mt-3 pt-3 border-t border-gray-200">
                     <h5 class="text-sm font-medium text-gray-700 mb-1">Faculty Assignment:</h5>
                     <div v-for="(facultyAssignment, facIndex) in moduleItem.faculty_assignments" :key="facultyAssignment.temp_id" class="flex items-center space-x-2 mb-2">
                        <select v-model="facultyAssignment.faculty_master_id" class="form-input form-input-sm flex-grow" required :class="{'border-red-500': validationErrors[`semesters[${semIndex}].modules[${modIndex}].faculty_assignments[${facIndex}].faculty_master_id`]}" :disabled="!masterFacultyList.length">
                           <option disabled value="">{{ masterFacultyList.length ? 'Select Faculty' : 'No faculty available' }}</option>
                           <option v-for="masterFac in masterFacultyList" :key="masterFac.id" :value="masterFac.id">{{ masterFac.name_of_faculty }} ({{masterFac.faculty_code || 'N/A'}})</option>
                        </select>
                        <button type="button" @click="removeFacultyFromModule(semIndex, modIndex, facIndex)" class="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100">
                          <MinusCircleIcon class="w-5 h-5" />
                        </button>
                     </div>
                      <p v-if="validationErrors[`semesters[${semIndex}].modules[${modIndex}].faculty_assignments[${facIndex}].faculty_master_id`]" class="form-error-message">{{ validationErrors[`semesters[${semIndex}].modules[${modIndex}].faculty_assignments[${facIndex}].faculty_master_id`] }}</p>
                     <p v-if="validationErrors[`semesters[${semIndex}].modules[${modIndex}].faculty_assignments_general`]" class="form-error-message">{{ validationErrors[`semesters[${semIndex}].modules[${modIndex}].faculty_assignments_general`] }}</p>
                     <button type="button" @click="addFacultyToModule(semIndex, modIndex)" class="btn btn-xs btn-outline-dashed mt-1" :disabled="!masterFacultyList.length">
                       <PlusIcon class="w-4 h-4 mr-1" /> Add Faculty
                     </button>
                  </div>
                </div>
                <button type="button" @click="addModuleToSemester(semIndex)" class="btn btn-sm btn-outline-dashed mt-2" :disabled="!masterModulesList.length">
                  <PlusCircleIcon class="w-5 h-5 mr-1.5" /> Add Module to Semester
                </button>
                 <p v-if="validationErrors[`semesters[${semIndex}].modules_general`]" class="form-error-message mt-1">{{ validationErrors[`semesters[${semIndex}].modules_general`] }}</p>
              </div>
            </div>
            <div class="p-6 md:p-8 pt-4">
              <button type="button" @click="addSemester" class="btn btn-primary">
                <PlusIcon class="w-5 h-5 mr-2" /> Add Semester
              </button>
              <p v-if="validationErrors.semesters_general" class="form-error-message mt-1">{{ validationErrors.semesters_general }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Declaration -->
      <div class="p-6 md:p-8 border-t border-gray-200">
         <div class="flex items-start">
          <div class="flex items-center h-5">
            <input id="declaration" type="checkbox" v-model="formData.ins_declaration" required class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
          </div>
          <div class="ml-3 text-sm">
            <label for="declaration" class="font-medium text-gray-700 required-label">Declaration</label>
            <p class="text-gray-500 text-xs">
              I hereby declare that the information provided is true and correct to the best of my knowledge.
            </p>
             <p v-if="validationErrors.ins_declaration" class="form-error-message">{{ validationErrors.ins_declaration }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="p-6 md:p-8 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-end items-center space-y-3 sm:space-y-0 sm:space-x-4 sticky bottom-0 z-20">
        <button type="button" @click="$emit('close-modal')" class="btn btn-outline w-full sm:w-auto">
          Cancel
        </button>
        <button
          type="button"
          @click="handleSaveDraft"
          :disabled="isSubmitting"
          class="btn btn-outline border-yellow-400 text-yellow-700 hover:bg-yellow-50 focus:ring-yellow-500 w-full sm:w-auto"
        >
           <Loader v-if="isSubmitting && submissionType === 'draft'" class="animate-spin h-5 w-5 mr-2" />
          {{ isSubmitting && submissionType === 'draft' ? 'Saving...' : 'Save as Draft' }}
        </button>
        <button
          type="submit"
          :disabled="isSubmitting || (!isDraftModeForSubmit && !formData.ins_declaration)"
          class="btn btn-primary w-full sm:w-auto"
        >
          <Loader v-if="isSubmitting && submissionType === 'submit'" class="animate-spin h-5 w-5 mr-2 text-white" />
          {{ isSubmitting && submissionType === 'submit' ? 'Submitting...' : (isEditMode ? 'Update Application' : 'Submit Application') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'
import apiServices from '@/services/services' // Ensure this path is correct
import { Loader } from 'lucide-vue-next'
import {
  DocumentTextIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  PlusIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  applicationId: { type: [String, Number], default: null },
  isModalMode: { type: Boolean, default: true }
})

const emit = defineEmits(['programme-saved', 'draft-saved', 'close-modal', 'load-error'])

const authStore = useAuthStore()
const toast = useToast()

const userInstitute = ref(null)
const isLoadingData = ref(true) // General data loading (institute, application for edit)
const isLoadingMasters = ref(false) // For master modules/faculty
const isSubmitting = ref(false)
const submissionType = ref('') // 'submit' or 'draft'
const isDraftModeForSubmit = ref(false)
const apiError = ref(false)
const errorMessage = ref('')
const validationErrors = ref({})

const selectedGeneralFile = ref(null)
const selectedGeneralFileName = ref('')
const selectedValidationLetterFile = ref(null)
const selectedValidationLetterFileName = ref('')
const selectedCurriculumDocFile = ref(null)
const selectedCurriculumDocFileName = ref('')

const masterModulesList = ref([])
const masterFacultyList = ref([])

let nextSemesterTempId = 1;
let nextModuleTempId = 1;
let nextFacultyTempId = 1;

const initialFormData = () => ({
  id: null,
  course_title: '',
  duration_in_months: null,
  commencement_date: '',
  institute_attachments: null,
  existing_attachment_name: null,
  curriculum_validation_letter: null,
  existing_curriculum_validation_letter_name: null,
  curriculum_document: null,
  existing_curriculum_document_name: null,
  remarks: '',
  ins_declaration: false,
  ins_review_decision: 'Pending',
  is_active: true,
  institute: null,
  institute_name: '',
  semesters: [],
})

const formData = ref(initialFormData())

const isEditMode = computed(() => !!props.applicationId)
const userCid = computed(() => authStore.user?.cid || '')
const todayDate = computed(() => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const localToday = new Date(today.getTime() - offset * 60 * 1000);
  return localToday.toISOString().split('T')[0];
});

const loadingMessage = computed(() => {
  if (isLoadingMasters.value) return 'Loading master data for modules and faculty...'
  if (isEditMode.value && isLoadingData.value) return 'Loading application data...'
  if (!isEditMode.value && isLoadingData.value) return 'Loading prerequisite data...'
  return 'Loading...'
})

const resetForm = () => {
  formData.value = initialFormData();
  selectedGeneralFile.value = null; selectedGeneralFileName.value = '';
  selectedValidationLetterFile.value = null; selectedValidationLetterFileName.value = '';
  selectedCurriculumDocFile.value = null; selectedCurriculumDocFileName.value = '';
  validationErrors.value = {};
  nextSemesterTempId = 1;
  nextModuleTempId = 1;
  nextFacultyTempId = 1;
}

const fetchMasterData = async () => {
  isLoadingMasters.value = true;
  masterModulesList.value = []; // Initialize to empty before fetching
  masterFacultyList.value = []; // Initialize to empty before fetching
  try {
    const [modulesRes, facultyRes] = await Promise.all([
      apiServices.getMhpcModules(),
      apiServices.getMhpcTeachingFaculties()
    ]);

    // Process Modules
    if (modulesRes.data && modulesRes.data.results && Array.isArray(modulesRes.data.results)) {
      masterModulesList.value = modulesRes.data.results
        .map(item => item.module_master) // Extract the nested module_master object
        .filter(masterModule => masterModule && typeof masterModule === 'object' && masterModule.id); // Ensure it's a valid object with an ID
    } else {
      console.warn("Modules data is not in the expected paginated format (response.data.results). Actual data:", modulesRes.data);
    }

    // Process Faculty
    if (facultyRes.data && facultyRes.data.results && Array.isArray(facultyRes.data.results)) {
      masterFacultyList.value = facultyRes.data.results.map(faculty => ({
        id: faculty.id,
        name_of_faculty: faculty.faculty_name, // API's faculty_name
        faculty_code: faculty.faculty_id || 'N/A' // API's faculty_id as code
      })).filter(f => f.id); // Ensure it has an ID
    } else {
      console.warn("Faculty data is not in the expected paginated format (response.data.results). Actual data:", facultyRes.data);
    }

    if (!masterModulesList.value.length) {
        console.warn("Master modules list is empty after fetch. Check API response or mapping if data was expected.");
    }
    if (!masterFacultyList.value.length) {
        console.warn("Master faculty list is empty after fetch. Check API response or mapping if data was expected.");
    }

  } catch (error) {
    console.error("Error fetching master data (modules/faculty):", error);
    toast.error("Failed to load master data (modules/faculty). Programme structure definition might be affected.");
    // masterModulesList and masterFacultyList remain empty as initialized
  } finally {
    isLoadingMasters.value = false;
  }
};

const initializeForm = async () => {
  resetForm();
  isLoadingData.value = true;
  apiError.value = false;
  errorMessage.value = '';

  await fetchMasterData(); // Fetch master data first

  if (userCid.value) {
      if (!userInstitute.value) {
        try {
            const response = await apiServices.getMhpcInstitutes({ params: { CID: userCid.value, page_size: 1 } });
            if (response.data?.results?.length > 0) {
                userInstitute.value = response.data.results[0];
            } else if (response.data && !Array.isArray(response.data) && response.data.id) {
                userInstitute.value = response.data;
            } else {
                if (!isEditMode.value) {
                    errorMessage.value = 'No institute found for your CID. Please ensure your institute is registered to apply for a programme.';
                    apiError.value = true;
                    isLoadingData.value = false;
                    return;
                }
                console.warn('User institute object not found by CID, but proceeding for edit mode.');
            }
        } catch (error) {
            console.error('Error fetching institute data:', error);
            errorMessage.value = error.response?.data?.message || 'Error fetching your institute data.';
            apiError.value = true;
            isLoadingData.value = false;
            return;
        }
      }
      if (!isEditMode.value && userInstitute.value) {
          formData.value.institute = userInstitute.value.id;
          formData.value.institute_name = userInstitute.value.name_of_institution;
      }
  } else {
      errorMessage.value = 'User CID not found. Cannot determine institute. Please log in again.';
      apiError.value = true;
      isLoadingData.value = false;
      return;
  }

  if (isEditMode.value && props.applicationId) { // Ensure props.applicationId is checked
    try {
      const response = await apiServices.getMhpcProgramOffered(props.applicationId);
      const appData = response.data;
      formData.value = {
        ...initialFormData(),
        id: appData.id,
        course_title: appData.course_title || '',
        duration_in_months: appData.duration_in_months || null,
        commencement_date: appData.commencement_date ? appData.commencement_date.split('T')[0] : '',
        remarks: appData.remarks || '',
        ins_declaration: appData.ins_declaration || false,
        ins_review_decision: appData.ins_review_decision || 'Pending',
        is_active: appData.is_active === undefined ? true : appData.is_active,
        institute: appData.institute,
        institute_name: appData.institute_name || userInstitute.value?.name_of_institution || '',
        existing_attachment_name: appData.institute_attachments ? appData.institute_attachments.split('/').pop() : null,
        existing_curriculum_validation_letter_name: appData.curriculum_validation_letter ? appData.curriculum_validation_letter.split('/').pop() : null,
        existing_curriculum_document_name: appData.curriculum_document ? appData.curriculum_document.split('/').pop() : null,
        semesters: appData.semesters ? appData.semesters.map(sem => ({
            id: sem.id || null,
            temp_id: `s${nextSemesterTempId++}`,
            name: sem.name || '',
            modules: sem.modules ? sem.modules.map(mod => ({
                id: mod.id || null,
                temp_id: `m${nextModuleTempId++}`,
                module_master_id: mod.module_master?.id || mod.module_master_id || '',
                number_of_students: mod.number_of_students || null,
                faculty_assignments: mod.faculty_assignments ? mod.faculty_assignments.map(fac => ({
                    id: fac.id || null,
                    temp_id: `f${nextFacultyTempId++}`,
                    faculty_master_id: fac.faculty_master?.id || fac.faculty_master_id || ''
                })) : []
            })) : []
        })) : []
      };
      if (formData.value.institute && userInstitute.value && userInstitute.value.id === formData.value.institute && !formData.value.institute_name) {
          formData.value.institute_name = userInstitute.value.name_of_institution;
      }

    } catch (error) {
      console.error('Error fetching application data for edit:', error);
      errorMessage.value = error.response?.data?.message || 'Failed to load application data for editing.';
      apiError.value = true;
      emit('load-error', errorMessage.value);
    }
  }
  isLoadingData.value = false;
};

defineExpose({ initializeForm });

onMounted(() => {
    if (!props.isModalMode || (props.isModalMode && props.applicationId !== undefined && props.applicationId !== null)) { // Check for null too
        initializeForm();
    }
});


const handleFileUpload = (event, fileRef, fileNameRef, existingNameField = null) => {
  const file = event.target.files[0];
  if (file) {
    fileRef.value = file;
    fileNameRef.value = file.name;
    if (existingNameField && formData.value[existingNameField]) {
      formData.value[existingNameField] = null;
    }
  } else {
    fileRef.value = null;
    fileNameRef.value = '';
  }
};

const handleGeneralFileUpload = (event) => handleFileUpload(event, selectedGeneralFile, selectedGeneralFileName, 'existing_attachment_name');
const handleValidationLetterUpload = (event) => handleFileUpload(event, selectedValidationLetterFile, selectedValidationLetterFileName, 'existing_curriculum_validation_letter_name');
const handleCurriculumDocUpload = (event) => handleFileUpload(event, selectedCurriculumDocFile, selectedCurriculumDocFileName, 'existing_curriculum_document_name');


const addSemester = () => {
  formData.value.semesters.push({
    temp_id: `s${nextSemesterTempId++}`,
    id: null,
    name: '',
    modules: []
  });
};
const removeSemester = (index) => {
  formData.value.semesters.splice(index, 1);
};

const addModuleToSemester = (semesterIndex) => {
  formData.value.semesters[semesterIndex].modules.push({
    temp_id: `m${nextModuleTempId++}`,
    id: null,
    module_master_id: '',
    number_of_students: null,
    faculty_assignments: []
  });
};
const removeModuleFromSemester = (semesterIndex, moduleIndex) => {
  formData.value.semesters[semesterIndex].modules.splice(moduleIndex, 1);
};

const addFacultyToModule = (semesterIndex, moduleIndex) => {
  formData.value.semesters[semesterIndex].modules[moduleIndex].faculty_assignments.push({
    temp_id: `f${nextFacultyTempId++}`,
    id: null,
    faculty_master_id: ''
  });
};
const removeFacultyFromModule = (semesterIndex, moduleIndex, facultyIndex) => {
  formData.value.semesters[semesterIndex].modules[moduleIndex].faculty_assignments.splice(facultyIndex, 1);
};

const validateForm = (isDraft = false) => {
  const errors = {};
  if (!formData.value.course_title.trim()) {
    errors.course_title = 'Educational Programme Name is required';
  }

  if (!isDraft) {
    if (formData.value.duration_in_months === null || formData.value.duration_in_months === undefined || formData.value.duration_in_months === '') errors.duration_in_months = 'Duration is required';
    else if (Number(formData.value.duration_in_months) <= 0) errors.duration_in_months = 'Duration must be a positive number';

    if (!formData.value.commencement_date) errors.commencement_date = 'Commencement date is required';
    else {
        const commencementD = new Date(formData.value.commencement_date);
        commencementD.setHours(0,0,0,0);
        const todayD = new Date(todayDate.value);
        todayD.setHours(0,0,0,0);
        if (commencementD < todayD) errors.commencement_date = 'Commencement date cannot be in the past';
    }

    if (!selectedValidationLetterFile.value && !formData.value.existing_curriculum_validation_letter_name) errors.curriculum_validation_letter = 'Curriculum Validation Letter is required.';
    if (!selectedCurriculumDocFile.value && !formData.value.existing_curriculum_document_name) errors.curriculum_document = 'Curriculum Document is required.';

    if (!formData.value.ins_declaration) errors.ins_declaration = 'Declaration is required.';

    if (!formData.value.semesters || formData.value.semesters.length === 0) {
        errors.semesters_general = 'At least one semester must be added for submission.';
    } else {
        formData.value.semesters.forEach((semester, semIndex) => {
            if (!semester.name || !semester.name.trim()) {
                errors[`semesters[${semIndex}].name`] = `Semester ${semIndex + 1} name/identifier is required.`;
            }
            if (!semester.modules || semester.modules.length === 0) {
                errors[`semesters[${semIndex}].modules_general`] = `Semester ${semIndex + 1} must have at least one module.`;
            } else {
                semester.modules.forEach((moduleItem, modIndex) => {
                    if (!moduleItem.module_master_id) {
                        errors[`semesters[${semIndex}].modules[${modIndex}].module_master_id`] = 'Module selection is required.';
                    }
                    if (moduleItem.number_of_students === null || moduleItem.number_of_students === undefined || moduleItem.number_of_students === '' || Number(moduleItem.number_of_students) < 1) {
                        errors[`semesters[${semIndex}].modules[${modIndex}].number_of_students`] = 'Number of students is required and must be at least 1.';
                    }
                    if (!moduleItem.faculty_assignments || moduleItem.faculty_assignments.length === 0) {
                        errors[`semesters[${semIndex}].modules[${modIndex}].faculty_assignments_general`] = 'At least one faculty must be assigned to this module.';
                    } else {
                        moduleItem.faculty_assignments.forEach((assignment, facIndex) => { // Added facIndex for specific error key
                            if (!assignment.faculty_master_id) {
                                errors[`semesters[${semIndex}].modules[${modIndex}].faculty_assignments[${facIndex}].faculty_master_id`] = 'Faculty selection is required.';
                            }
                        });
                    }
                });
            }
        });
    }
  } else {
     if (formData.value.duration_in_months && Number(formData.value.duration_in_months) <= 0) errors.duration_in_months = 'Duration must be a positive number';
     if (formData.value.commencement_date) {
        const commencementD = new Date(formData.value.commencement_date);
        commencementD.setHours(0,0,0,0);
        const todayD = new Date(todayDate.value);
        todayD.setHours(0,0,0,0);
        if (commencementD < todayD) errors.commencement_date = 'Commencement date cannot be in the past';
     }
  }

  validationErrors.value = errors;
  return Object.keys(errors).length === 0;
};


const prepareFormDataPayload = (isDraft = false) => {
  const payload = new FormData();

  payload.append('course_title', formData.value.course_title);
  if (formData.value.duration_in_months !== null && formData.value.duration_in_months !== '') {
    payload.append('duration_in_months', Number(formData.value.duration_in_months));
  }
  if (formData.value.commencement_date) {
    payload.append('commencement_date', formData.value.commencement_date);
  }
  if (formData.value.remarks) {
    payload.append('remarks', formData.value.remarks);
  }
  payload.append('ins_declaration', formData.value.ins_declaration);
  payload.append('is_active', formData.value.is_active);

  if (formData.value.institute) {
    payload.append('institute', formData.value.institute);
  } else if (userInstitute.value?.id && !isEditMode.value) {
     payload.append('institute', userInstitute.value.id);
  } else if (!formData.value.institute && !isEditMode.value) {
      console.error("CRITICAL: Institute ID is missing for new application payload.");
      toast.error("Institute ID is missing. Cannot proceed.");
      throw new Error("Institute ID is missing");
  }

  if (selectedGeneralFile.value) payload.append('institute_attachments', selectedGeneralFile.value, selectedGeneralFile.value.name);
  if (selectedValidationLetterFile.value) payload.append('curriculum_validation_letter', selectedValidationLetterFile.value, selectedValidationLetterFile.value.name);
  if (selectedCurriculumDocFile.value) payload.append('curriculum_document', selectedCurriculumDocFile.value, selectedCurriculumDocFile.value.name);

  payload.append('ins_review_decision', isDraft ? 'Draft' : 'Pending');

  if (formData.value.semesters && formData.value.semesters.length > 0) {
    const semestersPayload = formData.value.semesters.map(s => ({
        id: s.id || undefined,
        name: s.name,
        modules: s.modules.map(m => ({
            id: m.id || undefined,
            module_master_id: m.module_master_id,
            number_of_students: m.number_of_students,
            faculty_assignments: m.faculty_assignments.map(f => ({
                id: f.id || undefined,
                faculty_master_id: f.faculty_master_id
            }))
        }))
    }));
    payload.append('semesters_json', JSON.stringify(semestersPayload));
  } else {
     payload.append('semesters_json', JSON.stringify([]));
  }
  return payload;
};

const submitFormLogic = async (isDraft = false) => {
  isDraftModeForSubmit.value = isDraft;
  if (!validateForm(isDraft)) {
    toast.error('Please correct the errors in the form.');
    isSubmitting.value = false; submissionType.value = '';

    const firstErrorKey = Object.keys(validationErrors.value)[0];
    if (firstErrorKey) {
        let errorElement = document.getElementById(firstErrorKey) || document.querySelector(`[name="${firstErrorKey}"]`);
        if (!errorElement) {
            const nestedKeyParts = firstErrorKey.match(/(\w+)(\[(\d+)\])?\.?(\w+)?(\[(\d+)\])?\.?(\w+)?/); // Adjusted regex for deeper nesting
             if (nestedKeyParts) {
                const baseName = nestedKeyParts[1]; // e.g., semesters
                const firstIndex = nestedKeyParts[3]; // e.g., 0 for semester index
                const firstSubField = nestedKeyParts[4]; // e.g., modules or name
                const secondIndex = nestedKeyParts[6]; // e.g., 0 for module/faculty index
                const secondSubField = nestedKeyParts[7]; // e.g., module_master_id

                if (baseName === 'semesters' && firstIndex !== undefined) {
                    if (firstSubField === 'name') {
                         errorElement = document.querySelector(`input[class*="form-input"][placeholder*="Semester"][value="${formData.value.semesters[firstIndex].name}"]`) || // Try to find by current value if ID is complex
                                        document.querySelector(`h4 input[class*="form-input"]`); // More generic if multiple semesters
                    } else if (firstSubField === 'modules' && secondIndex !== undefined) {
                        if (secondSubField === 'module_master_id') {
                            errorElement = document.getElementById(`module-name-${firstIndex}-${secondIndex}`);
                        } else if (secondSubField === 'number_of_students') {
                            errorElement = document.getElementById(`module-students-${firstIndex}-${secondIndex}`);
                        } else if (firstSubField === 'modules' && secondSubField === 'faculty_assignments' && nestedKeyParts[8] !== undefined) { // faculty_assignments[facIndex].faculty_master_id
                             // This part is tricky due to lack of direct IDs on faculty selects in a loop
                             // Best effort: find the Nth faculty select in that module
                             const moduleDiv = document.getElementById(`module-name-${firstIndex}-${secondIndex}`)?.closest('.p-3.md\\:p-4');
                             if (moduleDiv) {
                                 const facultySelects = moduleDiv.querySelectorAll('select[v-model*="faculty_master_id"]');
                                 if (facultySelects[nestedKeyParts[8]]) errorElement = facultySelects[nestedKeyParts[8]];
                             }
                        }
                         if (!errorElement) errorElement = document.getElementById(`module-name-${firstIndex}-${secondIndex}`)?.closest('.form-section'); // scroll to section
                    }
                }
                 if (!errorElement) errorElement = document.querySelector(`#${baseName}`) || document.querySelector(`[id*="${baseName}"]`) || document.querySelector('.form-section'); // broader fallback
            }
        }
         errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  if ((!userInstitute.value?.id && !formData.value.institute) && !isEditMode.value) {
      toast.error('Institute information is missing. Cannot submit application.');
      isSubmitting.value = false; submissionType.value = '';
      apiError.value = true;
      errorMessage.value = 'Your institute information could not be found. Please ensure it is registered.';
      return;
  }
  if (isEditMode.value && !formData.value.institute) {
      toast.error('Programme institute ID is missing. Cannot update application.');
      isSubmitting.value = false; submissionType.value = '';
      return;
  }

  let payload;
  try {
    payload = prepareFormDataPayload(isDraft);
  } catch (e) {
    console.error("Error preparing payload:", e.message);
    toast.error(e.message || "Failed to prepare form data.");
    isSubmitting.value = false; submissionType.value = '';
    return;
  }

  try {
    let response;
    if (isEditMode.value) {
      response = await apiServices.patchMhpcProgramOffered(props.applicationId, payload);
      toast.success(`Application ${isDraft ? 'draft ' : ''}updated successfully!`);
    } else {
      response = await apiServices.createMhpcProgramOffered(payload);
      toast.success(`Educational programme application ${isDraft ? 'draft saved' : 'submitted'} successfully!`);
    }

    if (isDraft) {
      emit('draft-saved', response.data);
       if (response.data && response.data.id && !isEditMode.value) {
         emit('close-modal');
      } else {
         emit('close-modal');
      }
    } else {
      emit('programme-saved', response.data);
      emit('close-modal');
    }
  } catch (error) {
    console.error(`Error ${isEditMode.value ? 'updating' : 'submitting'} form:`, error.response || error);
    const backendErrors = {};
    let generalErrorMessage = `Failed to ${isDraft ? 'save draft' : (isEditMode.value ? 'update' : 'submit')} application.`;

    if (error.response && error.response.data) {
        if (typeof error.response.data === 'string') {
            generalErrorMessage = error.response.data;
        } else if (typeof error.response.data === 'object') {
            for (const key in error.response.data) {
                const frontendKey = key === 'detail' ? 'general' : (key === 'semesters_json' ? 'semesters_general' : key);

                if (Array.isArray(error.response.data[key])) {
                    backendErrors[frontendKey] = error.response.data[key].join('; ');
                } else if (typeof error.response.data[key] === 'string') {
                    backendErrors[frontendKey] = error.response.data[key];
                } else if (typeof error.response.data[key] === 'object' && key === 'semesters_json') {
                    const semesterJsonErrors = error.response.data[key];
                    let structuredSemErrorMsg = "Error in programme structure: ";
                    const errorMessages = [];
                    if (typeof semesterJsonErrors === 'string') {
                        errorMessages.push(semesterJsonErrors);
                    } else if (Array.isArray(semesterJsonErrors) && semesterJsonErrors.every(item => typeof item === 'string')) {
                         errorMessages.push(...semesterJsonErrors);
                    }
                    else {
                        Object.entries(semesterJsonErrors).forEach(([semIdx, semErrorObj]) => {
                            if (typeof semErrorObj === 'object' && semErrorObj !== null) {
                                Object.entries(semErrorObj).forEach(([field, msg]) => {
                                   if (field === 'modules' && typeof msg === 'object') {
                                       Object.entries(msg).forEach(([modIdx, modErrorObj]) => {
                                         if (typeof modErrorObj === 'object' && modErrorObj !== null) {
                                           Object.entries(modErrorObj).forEach(([modField, modMsg]) => {
                                               errorMessages.push(`Sem ${Number(semIdx)+1}, Mod ${Number(modIdx)+1}, ${modField}: ${Array.isArray(modMsg) ? modMsg.join(', ') : modMsg}`);
                                           });
                                         } else {
                                            errorMessages.push(`Sem ${Number(semIdx)+1}, Mod ${Number(modIdx)+1}: ${Array.isArray(msg) ? msg.join(', ') : msg}`);
                                         }
                                       });
                                   } else {
                                     errorMessages.push(`Sem ${Number(semIdx)+1}, ${field}: ${Array.isArray(msg) ? msg.join(', ') : msg}`);
                                   }
                                });
                            } else {
                                errorMessages.push(`Sem ${Number(semIdx)+1}: ${Array.isArray(semErrorObj) ? semErrorObj.join(', ') : semErrorObj}`);
                            }
                        });
                    }
                    if (errorMessages.length > 0) {
                         backendErrors['semesters_general'] = structuredSemErrorMsg + errorMessages.join('; ');
                    } else if (!backendErrors['semesters_general']) {
                        backendErrors['semesters_general'] = "An issue occurred with the programme structure data. Please review and try again.";
                    }
                }
            }
            if (Object.keys(backendErrors).length > 0) {
                validationErrors.value = { ...validationErrors.value, ...backendErrors };
            }
            if (backendErrors.general) {
                generalErrorMessage = backendErrors.general;
            } else if (error.response.data.message) {
                generalErrorMessage = error.response.data.message;
            }
        }
    }
    toast.error(generalErrorMessage + (Object.keys(backendErrors).length > 0 ? " See field errors for details." : " Please try again."));

  } finally {
    isSubmitting.value = false;
    submissionType.value = '';
    isDraftModeForSubmit.value = false;
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  submissionType.value = 'submit';
  await submitFormLogic(false);
};

const handleSaveDraft = async () => {
   if (!formData.value.course_title.trim()) {
    toast.error('Please enter an Educational Programme Name to save as draft.');
    validationErrors.value = { course_title: 'Educational Programme Name is required to save as draft' };
    const el = document.getElementById('programmeName');
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el?.focus();
    return;
  }
  isSubmitting.value = true;
  submissionType.value = 'draft';
  await submitFormLogic(true);
};

watch(() => props.applicationId, (newId, oldId) => {
  if (newId !== oldId) {
    initializeForm();
  }
}, { immediate: false });

</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1.5;
}
.form-label.text-xs { /* For nested form elements */
    @apply mb-1;
}
.required-label::after {
  content: ' *';
  color: #dc2626; /* red-600 */
}
.form-input,
.form-textarea {
  @apply block w-full rounded-lg border-gray-300 shadow-sm p-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-150;
}
.form-input-sm { /* For nested form inputs */
    @apply p-2 text-sm;
}
.form-file-input {
  @apply block w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border file:border-gray-200 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed;
}
.form-error-message {
  @apply mt-1.5 text-xs text-red-600;
}
.btn {
  @apply inline-flex items-center justify-center rounded-lg border py-2.5 px-5 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed;
}
.btn-sm { /* For add/remove buttons in nested structure */
    @apply py-2 px-3 text-xs;
}
.btn-xs {
    @apply py-1.5 px-2.5 text-xs;
}
.btn-primary {
  @apply border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500;
}
.btn-outline {
  @apply border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500;
}
.btn-outline-dashed {
    @apply border-dashed border-indigo-400 text-indigo-700 hover:bg-indigo-50 focus:ring-indigo-500;
}
.section-header {
  @apply flex items-start py-5 px-6 md:px-8 bg-gray-50;
}
.section-content {
  @apply p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6;
}
.section-content-full { /* For programme structure that might not need columns */
   @apply p-0; /* Override default padding if children handle it */
}
.form-section {
  @apply border-b border-gray-200;
}
.form-section:last-of-type {
   @apply border-b-0;
}

/* Ensure sticky footer doesn't overlap content excessively */
form.overflow-y-auto {
  padding-bottom: 80px; /* Adjust based on action bar height */
}
</style>