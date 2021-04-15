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
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
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
          <div>
            <label for="courseName" class="block text-sm font-medium text-gray-700">Course Name:</label>
            <input type="text" id="courseName" v-model="formState.courseName" required
              class="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300" />
          </div>

          <div>
            <label for="institute" class="block text-sm font-medium text-gray-700">Institute:</label>
            <!-- Inside <template> -->
            <select id="institute" v-model="formState.selectedInstitute" required :disabled="isLoadingInstitutes"
              class="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300 disabled:bg-gray-100">
              <option disabled value="">
                {{ isLoadingInstitutes ? 'Loading institutes...' : 'Please select an institute' }}
              </option>
              <!-- This part is now correct because institutes.value contains objects with { id, name } -->
              <option v-for="institute in institutes" :key="institute.id" :value="institute.id">
                {{ institute.name }}
              </option>
              <option v-if="!isLoadingInstitutes && institutes.length === 0" disabled value="">
                No institutes available
              </option>
            </select>
          </div>

          <div>
            <label for="courseTitle" class="block text-sm font-medium text-gray-700">Course Title:</label>
            <input type="text" id="courseTitle" v-model="formState.courseTitle" required
              class="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300" />
          </div>

          <div>
            <label for="duration" class="block text-sm font-medium text-gray-700">Duration (months):</label>
            <input type="number" id="duration" v-model.number="formState.duration" required min="1"
              class="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300" />
          </div>

          <div>
            <label for="commencementDate" class="block text-sm font-medium text-gray-700">Commencement Date:</label>
            <input type="date" id="commencementDate" v-model="formState.commencementDate" required
              class="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300" />
          </div>

          <div>
            <label for="attachments" class="block text-sm font-medium text-gray-700">Institute Attachments
              (Optional):</label>
            <input type="file" id="attachments" @change="handleFileUpload"
              class="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            <p v-if="formState.attachmentFile" class="text-xs text-gray-600 mt-1">
              Selected: {{ formState.attachmentFile.name }}
            </p>
          </div>

          <div>
            <label for="remarks" class="block text-sm font-medium text-gray-700">Remarks:</label>
            <textarea id="remarks" v-model="formState.remarks" rows="3"
              class="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300"></textarea>
          </div>

          <div class="flex items-center pt-2">
            <input type="checkbox" id="declaration" v-model="formState.declaration" required
              class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label for="declaration" class="ml-2 block text-sm text-gray-900">I declare that the information provided is
              true and accurate.</label>
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

    <CorsTableView />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import services from '@/services/services.js' // Ensure this path is correct
import CorsTableView from './CourseTableView.vue' // Ensure this path is correct

// --- State ---
const showModal = ref(false)
const isEditing = ref(false) // Added for potential edit functionality
const isSubmitting = ref(false)
const isLoadingInstitutes = ref(false)
const institutes = ref([]) // Stores fetched institutes { id: ..., name: ... }
const pageError = ref(null) // For errors outside the modal (e.g., fetching initial data)
const modalError = ref(null) // For errors specific to the modal form submission
const fieldErrors = reactive({}) // <--- Add this: For field-specific errors

// Use reactive for form fields for easier management
const formState = reactive({
  courseName: '',
  selectedInstitute: '', // Store institute ID
  courseTitle: '',
  duration: null,
  commencementDate: '',
  attachmentFile: null, // Store the File object
  remarks: '',
  declaration: false,
  // Add courseId: null here if implementing editing
})

// --- Methods ---

// Reset form fields to initial state
const resetForm = () => {
  // ... reset other formState fields ...
  formState.attachmentFile = null
  formState.declaration = false
  isEditing.value = false
  modalError.value = null
  // Clear field-specific errors
  Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key]) // <-- Add this line

  const fileInput = document.getElementById('attachments')
  if (fileInput) {
    fileInput.value = ''
  }
}

// Open the modal for adding a new course
const openAddModal = () => {
  resetForm() // Ensure form is clear when opening
  isEditing.value = false
  showModal.value = true
}

// Close the modal
const closeModal = () => {
  showModal.value = false
  resetForm() // Also reset form on manual close
}

const fetchInstitutes = async () => {
  isLoadingInstitutes.value = true
  pageError.value = null
  institutes.value = []
  try {
    const response = await services.getEpcInstitutes()
    console.log('API response for institutes:', response)

    let rawInstituteList = []
    // Adjust based on your actual API response structure:
    if (response?.data?.results && Array.isArray(response.data.results)) {
      rawInstituteList = response.data.results
    } else if (response?.data && Array.isArray(response.data)) {
      rawInstituteList = response.data
    } else if (Array.isArray(response)) {
      rawInstituteList = response
    } else {
      console.warn('Could not find institute array in the response:', response)
      pageError.value = 'Failed to load institutes: Unexpected data format.'
      // Keep institutes.value empty and exit
      isLoadingInstitutes.value = false
      return // Exit the function early
    }

    // Filter for valid entries AND Map to the expected structure { id, name }
    institutes.value = rawInstituteList
      .filter((inst) => inst && inst.id && inst.name_of_institution) // Filter using API field name
      .map((inst) => ({
        id: inst.id,
        name: inst.name_of_institution, // Map API field to component's 'name' field
        // You could add other fields here if needed later
        // e.g., fullName: inst.full_name
      }))

    if (institutes.value.length === 0 && !pageError.value) {
      console.log('No valid institutes found or loaded for the dropdown after filtering/mapping.')
      // Optional: Set a non-blocking warning if needed
      // pageError.value = "No institutes available to select.";
    }
  } catch (err) {
    console.error('Error fetching institutes:', err)
    pageError.value = `Failed to load institutes: ${err.message || 'Network error'}`
    institutes.value = [] // Ensure empty on error
  } finally {
    isLoadingInstitutes.value = false
  }
}

// Handle file selection
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    formState.attachmentFile = file
    console.log('File selected:', file.name)
  } else {
    formState.attachmentFile = null
  }
}

const submitCourse = async () => {
  // ... (validation checks like declaration)

  isSubmitting.value = true
  modalError.value = null // Clear general modal error
  Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key]) // Clear previous field errors

  const formData = new FormData()
  // ... append form data ...
  // IMPORTANT: Ensure the names used here match the API's expectations
  formData.append('course_name', formState.courseName)
  formData.append('institute', formState.selectedInstitute)
  formData.append('course_title', formState.courseTitle)
  // Check if API expects 'duration' or 'duration_in_months'
  // Let's assume it expects 'duration_in_months' based on the error key
  if (formState.duration !== null && formState.duration !== undefined) {
    formData.append('duration_in_months', formState.duration) // Use API key name
  } else {
    // Handle case where duration might be optional or required - send empty if needed or let backend validate
    // formData.append('duration_in_months', ''); // Or omit if null is acceptable/handled
  }
  formData.append('commencement_date', formState.commencementDate)
  formData.append('remarks', formState.remarks)

  if (formState.attachmentFile) {
    // Check if API expects 'attachments' or 'institute_attachments'
    formData.append(
      'institute_attachments',
      formState.attachmentFile,
      formState.attachmentFile.name,
    ) // Use API key name
  } else {
    // If the file is *required*, the backend validation will catch it.
    // If it's optional, sending nothing when no file is selected is correct.
  }

  try {
    let response
    // ... (API call logic for create/update)
    response = await services.createEpcCourseDetail(formData) // Or update

    console.log('Course submitted successfully:', response.data)
    alert('Course submitted successfully!') // Replace with better notification
    closeModal()
    // await fetchCourses(); // Refresh list if needed
  } catch (err) {
    console.error('Error submitting course:', err)

    if (
      err.response &&
      err.response.data &&
      typeof err.response.data === 'object' &&
      err.response.status === 400
    ) {
      // Likely validation errors object (Status 400 is common for Bad Request/Validation)
      const errors = err.response.data
      console.log('Validation Errors:', errors)

      // Map API error keys to our formState keys or input IDs for display
      const errorKeyMapping = {
        course_name: 'courseName',
        institute: 'selectedInstitute',
        course_title: 'courseTitle',
        duration_in_months: 'duration', // API key -> form field ref name/id
        commencement_date: 'commencementDate',
        institute_attachments: 'attachments', // API key -> file input id
        remarks: 'remarks',
        declaration: 'declaration',
        // Add other potential fields from your API validation
      }

      let hasFieldErrors = false
      for (const apiKey in errors) {
        // Ensure the error value is an array with at least one message
        if (errors[apiKey] && Array.isArray(errors[apiKey]) && errors[apiKey].length > 0) {
          const formKey = errorKeyMapping[apiKey]
          if (formKey) {
            fieldErrors[formKey] = errors[apiKey][0] // Assign first error message
            hasFieldErrors = true
            console.log(`Mapped error: ${apiKey} -> ${formKey}: ${fieldErrors[formKey]}`)
          } else {
            console.warn(`Unhandled validation error key from API: ${apiKey}`)
            // Optionally add unmapped errors to the general modalError
            modalError.value = (modalError.value || '') + `${apiKey}: ${errors[apiKey][0]} `
          }
        }
      }

      // If we only assigned field errors, maybe clear the general error
      if (hasFieldErrors && !modalError.value) {
        modalError.value = 'Please correct the errors below.' // Or leave null
      } else if (!hasFieldErrors && !modalError.value) {
        // If loop didn't find mappable errors but it was a 400 obj response
        modalError.value = 'An unknown validation error occurred.'
      }
      // else { keep any unmapped errors in modalError.value }
    } else {
      // Fallback for non-validation errors (network, server 500, etc.)
      modalError.value = `Failed to submit course: ${err.response?.data?.detail || err.message || 'Unknown error'}`
    }
  } finally {
    isSubmitting.value = false
  }
}

// --- Lifecycle Hooks ---
onMounted(() => {
  fetchInstitutes() // Load institutes when component mounts
})
</script>

<style scoped>
/* Add any component-specific styles here if needed */
/* Improve focus states slightly */
input:focus,
select:focus,
textarea:focus {
  border-color: #93c5fd;
  /* Tailwind's blue-300 */
  box-shadow: 0 0 0 3px rgba(147, 197, 253, 0.5);
  /* Mimic ring */
}
</style>
