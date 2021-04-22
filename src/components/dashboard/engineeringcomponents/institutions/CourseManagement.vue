```vue
<template>
  <div class="course-management p-6">
    <h1 class="text-2xl font-bold mb-4">EPC Course Management</h1>
    <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" @click="openAddModal">
      Add Course
    </button>

    <!-- Error Display Area -->
    <div v-if="pageError" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
      <strong>Error:</strong> {{ pageError }}
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      @click.self="closeModal">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto relative">
        <span class="absolute top-2 right-3 text-2xl cursor-pointer text-gray-500 hover:text-gray-800"
          @click="closeModal">×</span>
        <h2 class="text-xl font-semibold mb-4">
          {{ isEditing ? 'Edit Course' : 'Add New Course' }}
        </h2>

        <!-- Modal Error Display -->
        <div v-if="modalError" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ modalError }}
        </div>

        <form @submit.prevent="submitCourse" class="space-y-4">
          <!-- <div>
            <label for="courseName" class="block text-sm font-medium text-gray-700">Course Name:</label>
            <input type="text" id="courseName" v-model="formState.courseName" required
              class="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300" />
            <p v-if="fieldErrors.courseName" class="text-xs text-red-600 mt-1">
              {{ fieldErrors.courseName }}
            </p>
          </div> -->

          <div>
            <label for="institute" class="block text-sm font-medium text-gray-700">Institute:</label>
            <select id="institute" v-model="formState.selectedInstitute" required :disabled="isLoadingInstitutes"
              class="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300 disabled:bg-gray-100">
              <option disabled value="">
                {{ isLoadingInstitutes ? 'Loading institutes...' : 'Please select an institute' }}
              </option>
              <option v-for="institute in institutes" :key="institute.id" :value="institute.id">
                {{ institute.name }}
              </option>
              <option v-if="!isLoadingInstitutes && institutes.length === 0" disabled value="">
                No institutes available
              </option>
            </select>
            <p v-if="fieldErrors.selectedInstitute" class="text-xs text-red-600 mt-1">
              {{ fieldErrors.selectedInstitute }}
            </p>
          </div>

          <div>
            <label for="courseTitle" class="block text-sm font-medium text-gray-700">Course Title:</label>
            <input type="text" id="courseTitle" v-model="formState.courseTitle" required
              class="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300" />
            <p v-if="fieldErrors.courseTitle" class="text-xs text-red-600 mt-1">
              {{ fieldErrors.courseTitle }}
            </p>
          </div>

          <div>
            <label for="duration" class="block text-sm font-medium text-gray-700">Duration (months):</label>
            <input type="number" id="duration" v-model.number="formState.duration" required min="1"
              class="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300" />
            <p v-if="fieldErrors.duration" class="text-xs text-red-600 mt-1">
              {{ fieldErrors.duration }}
            </p>
          </div>

          <div>
            <label for="commencementDate" class="block text-sm font-medium text-gray-700">Commencement Date:</label>
            <input type="date" id="commencementDate" v-model="formState.commencementDate" required
              class="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300" />
            <p v-if="fieldErrors.commencementDate" class="text-xs text-red-600 mt-1">
              {{ fieldErrors.commencementDate }}
            </p>
          </div>

          <div>
            <label for="attachments" class="block text-sm font-medium text-gray-700">Institute Attachments (Optional):</label>
            <input type="file" id="attachments" @change="handleFileUpload"
              class="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            <p v-if="formState.attachmentFile" class="text-xs text-gray-600 mt-1">
              Selected: {{ formState.attachmentFile.name }}
            </p>
            <p v-if="fieldErrors.attachments" class="text-xs text-red-600 mt-1">
              {{ fieldErrors.attachments }}
            </p>
          </div>

          <div>
            <label for="remarks" class="block text-sm font-medium text-gray-700">Remarks:</label>
            <textarea id="remarks" v-model="formState.remarks" rows="3"
              class="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300"></textarea>
            <p v-if="fieldErrors.remarks" class="text-xs text-red-600 mt-1">
              {{ fieldErrors.remarks }}
            </p>
          </div>

          <div class="flex items-center pt-2">
            <input type="checkbox" id="declaration" v-model="formState.declaration" required
              class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label for="declaration" class="ml-2 block text-sm text-gray-900">
              I declare that the information provided is true and accurate.
            </label>
            <p v-if="fieldErrors.declaration" class="text-xs text-red-600 mt-1">
              {{ fieldErrors.declaration }}
            </p>
          </div>

          <div class="pt-4">
            <button type="submit" :disabled="isSubmitting || !formState.declaration"
              class="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center">
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ isSubmitting ? 'Submitting...' : 'Submit Course' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <CourseTableView :courses="courses" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import services from '@/services/services.js';
import CourseTableView from './CourseTableView.vue';

// Initialize toast
const toast = useToast();

// --- State ---
const showModal = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);
const isLoadingInstitutes = ref(false);
const institutes = ref([]);
const courses = ref([]);
const pageError = ref(null);
const modalError = ref(null);
const fieldErrors = reactive({});

// Form state
const formState = reactive({
  courseName: '',
  selectedInstitute: '',
  courseTitle: '',
  duration: null,
  commencementDate: '',
  attachmentFile: null,
  remarks: '',
  declaration: false,
});

// --- Methods ---

// Reset form
const resetForm = () => {
  formState.courseName = '';
  formState.selectedInstitute = '';
  formState.courseTitle = '';
  formState.duration = null;
  formState.commencementDate = '';
  formState.attachmentFile = null;
  formState.remarks = '';
  formState.declaration = false;
  isEditing.value = false;
  modalError.value = null;
  Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key]);

  const fileInput = document.getElementById('attachments');
  if (fileInput) fileInput.value = '';
};

// Open modal
const openAddModal = () => {
  resetForm();
  isEditing.value = false;
  showModal.value = true;
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  resetForm();
};

// Fetch institutes
const fetchInstitutes = async () => {
  isLoadingInstitutes.value = true;
  pageError.value = null;
  institutes.value = [];
  try {
    const response = await services.getEpcInstitutes();
    console.log('API response for institutes:', response);

    let rawInstituteList = [];
    if (response?.data?.results && Array.isArray(response.data.results)) {
      rawInstituteList = response.data.results;
    } else if (response?.data && Array.isArray(response.data)) {
      rawInstituteList = response.data;
    } else if (Array.isArray(response)) {
      rawInstituteList = response;
    } else {
      console.warn('Unexpected institute data format:', response);
      pageError.value = 'Failed to load institutes: Unexpected data format.';
      return;
    }

    institutes.value = rawInstituteList
      .filter((inst) => inst && inst.id && inst.name_of_institution)
      .map((inst) => ({
        id: inst.id,
        name: inst.name_of_institution,
      }));

    if (institutes.value.length === 0) {
      console.log('No valid institutes found.');
    }
  } catch (err) {
    console.error('Error fetching institutes:', err);
    pageError.value = `Failed to load institutes: ${err.message || 'Network error'}`;
  } finally {
    isLoadingInstitutes.value = false;
  }
};

// Fetch courses
const fetchCourses = async () => {
  try {
    const response = await services.getEpcCourseDetails();
    console.log('API response for courses:', response);

    let courseList = [];
    if (response?.data?.results && Array.isArray(response.data.results)) {
      courseList = response.data.results;
    } else if (response?.data && Array.isArray(response.data)) {
      courseList = response.data;
    } else if (Array.isArray(response)) {
      courseList = response;
    } else {
      console.warn('Unexpected course data format:', response);
      pageError.value = 'Failed to load courses: Unexpected data format.';
      return;
    }

    courses.value = courseList;
  } catch (err) {
    console.error('Error fetching courses:', err);
    pageError.value = `Failed to load courses: ${err.message || 'Network error'}`;
  }
};

// Handle file upload
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    formState.attachmentFile = file;
    console.log('File selected:', file.name);
  } else {
    formState.attachmentFile = null;
  }
};

// Submit course
const submitCourse = async () => {
  if (!formState.declaration) {
    modalError.value = 'You must agree to the declaration.';
    return;
  }

  isSubmitting.value = true;
  modalError.value = null;
  Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key]);

  const formData = new FormData();
  formData.append('course_name', formState.courseName);
  formData.append('institute', formState.selectedInstitute);
  formData.append('course_title', formState.courseTitle);
  if (formState.duration !== null && formState.duration !== undefined) {
    formData.append('duration_in_months', formState.duration);
  }
  formData.append('commencement_date', formState.commencementDate);
  formData.append('remarks', formState.remarks);
  if (formState.attachmentFile) {
    formData.append('institute_attachments', formState.attachmentFile, formState.attachmentFile.name);
  }

  try {
    const response = await services.createEpcCourseDetail(formData);
    console.log('Course submission response:', response);

    if (response.status === 201) {
      toast.success(`Course "${formState.courseName}" has been successfully added!`, {
        timeout: 5000,
      });
      closeModal();
      await fetchCourses();
    } else {
      modalError.value = 'Unexpected response from server. Please try again.';
    }
  } catch (err) {
    console.error('Error submitting course:', err);

    if (err.response && err.response.data && typeof err.response.data === 'object' && err.response.status === 400) {
      const errors = err.response.data;
      console.log('Validation Errors:', errors);

      const errorKeyMapping = {
        course_name: 'courseName',
        institute: 'selectedInstitute',
        course_title: 'courseTitle',
        duration_in_months: 'duration',
        commencement_date: 'commencementDate',
        institute_attachments: 'attachments',
        remarks: 'remarks',
        declaration: 'declaration',
      };

      const errorMessages = {
        attachments: 'Please upload an attachment for the institute.',
        courseName: 'Please enter a valid course name.',
        selectedInstitute: 'Please select an institute.',
        courseTitle: 'Please enter a valid course title.',
        duration: 'Please enter a valid duration (in months).',
        commencementDate: 'Please select a valid commencement date.',
        remarks: 'Please provide valid remarks.',
        declaration: 'You must agree to the declaration.',
      };

      let hasFieldErrors = false;
      for (const apiKey in errors) {
        if (errors[apiKey] && Array.isArray(errors[apiKey]) && errors[apiKey].length > 0) {
          const formKey = errorKeyMapping[apiKey];
          if (formKey) {
            fieldErrors[formKey] = errorMessages[formKey] || errors[apiKey][0];
            hasFieldErrors = true;
          } else {
            modalError.value = (modalError.value || '') + `${apiKey}: ${errors[apiKey][0]} `;
          }
        }
      }

      if (hasFieldErrors && !modalError.value) {
        modalError.value = 'Please correct the errors below.';
      } else if (!hasFieldErrors && !modalError.value) {
        modalError.value = 'An unknown validation error occurred.';
      }
    } else {
      modalError.value = `Failed to submit course: ${err.response?.data?.detail || err.message || 'Unknown error'}`;
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  fetchInstitutes();
  fetchCourses();
});
</script>

<style scoped>
input:focus,
select:focus,
textarea:focus {
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.5);
}

/* Scrollable modal styles */
.overflow-y-auto {
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: #a0aec0 #edf2f7;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #edf2f7;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #a0aec0;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #718096;
}
</style>
```