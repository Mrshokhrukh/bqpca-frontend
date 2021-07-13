<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Course Details</h1>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <!-- Table -->
    <div v-if="!loading && !error" class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <!-- <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Course Name
            </th> -->
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Course Title
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Duration
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Commencement
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="course in courses" :key="course.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ course.course_title }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ course.duration_in_months }} months</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-500">{{ formatDate(course.commencement_date) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="{
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                  'bg-green-100 text-green-800': course.is_active,
                  'bg-red-100 text-red-800': !course.is_active,
                }"
              >
                {{ course.is_active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                @click="openViewModal(course)"
                class="text-blue-600 hover:text-blue-900 mr-3 inline-flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
              <button
                @click="deleteCourse(course)"
                class="text-red-600 hover:text-red-900 inline-flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- View/Edit Modal -->
    <div
      v-if="viewModalOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-medium text-gray-900 flex-grow">
              {{ editMode ? 'Edit Course' : 'Course Details' }}
            </h3>
            <div class="flex items-center space-x-2">
              <button
                v-if="!editMode"
                @click="editMode = true"
                class="text-blue-600 hover:text-blue-900"
                title="Edit Course"
              >
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15.414 9 16l.586-2.828L18.414 4.586z"
                  />
                </svg>
              </button>
              <button
                @click="closeViewModal"
                class="text-gray-400 hover:text-gray-500"
                title="Close"
              >
                <span class="sr-only">Close</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Edit Form -->
          <div v-if="editMode" class="mt-6">
            <!-- Modal Error Display -->
            <div
              v-if="modalError"
              class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
            >
              {{ modalError }}
            </div>

            <form @submit.prevent="submitEditCourse" class="space-y-4">
              <!-- <div>
                <label for="courseName" class="block text-sm font-medium text-gray-700">Course Name:</label>
                <input type="text" id="courseName" v-model="editForm.courseName" required
                  class="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300" />
                <p v-if="fieldErrors.courseName" class="text-xs text-red-600 mt-1">
                  {{ fieldErrors.courseName }}
                </p>
              </div> -->

              <div>
                <label for="institute" class="block text-sm font-medium text-gray-700"
                  >Institute:</label
                >
                <select
                  id="institute"
                  v-model="editForm.selectedInstitute"
                  required
                  :disabled="isLoadingInstitutes"
                  class="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300 disabled:bg-gray-100"
                >
                  <option disabled value="">
                    {{
                      isLoadingInstitutes ? 'Loading institutes...' : 'Please select an institute'
                    }}
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
                <label for="courseTitle" class="block text-sm font-medium text-gray-700"
                  >Course Title:</label
                >
                <input
                  type="text"
                  id="courseTitle"
                  v-model="editForm.courseTitle"
                  required
                  class="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300"
                />
                <p v-if="fieldErrors.courseTitle" class="text-xs text-red-600 mt-1">
                  {{ fieldErrors.courseTitle }}
                </p>
              </div>

              <div>
                <label for="duration" class="block text-sm font-medium text-gray-700"
                  >Duration (months):</label
                >
                <input
                  type="number"
                  id="duration"
                  v-model.number="editForm.duration"
                  required
                  min="1"
                  class="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300"
                />
                <p v-if="fieldErrors.duration" class="text-xs text-red-600 mt-1">
                  {{ fieldErrors.duration }}
                </p>
              </div>

              <div>
                <label for="commencementDate" class="block text-sm font-medium text-gray-700"
                  >Commencement Date:</label
                >
                <input
                  type="date"
                  id="commencementDate"
                  v-model="editForm.commencementDate"
                  required
                  class="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300"
                />
                <p v-if="fieldErrors.commencementDate" class="text-xs text-red-600 mt-1">
                  {{ fieldErrors.commencementDate }}
                </p>
              </div>

              <div>
                <label for="attachments" class="block text-sm font-medium text-gray-700"
                  >Institute Attachments (Optional):</label
                >
                <input
                  type="file"
                  id="attachments"
                  @change="handleFileUpload"
                  class="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p v-if="editForm.attachmentFile" class="text-xs text-gray-600 mt-1">
                  Selected: {{ editForm.attachmentFile.name }}
                </p>
                <p v-if="fieldErrors.attachments" class="text-xs text-red-600 mt-1">
                  {{ fieldErrors.attachments }}
                </p>
              </div>

              <div>
                <label for="remarks" class="block text-sm font-medium text-gray-700"
                  >Remarks:</label
                >
                <textarea
                  id="remarks"
                  v-model="editForm.remarks"
                  rows="3"
                  class="mt-1 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300"
                ></textarea>
                <p v-if="fieldErrors.remarks" class="text-xs text-red-600 mt-1">
                  {{ fieldErrors.remarks }}
                </p>
              </div>

              <div class="flex items-center pt-2">
                <input
                  type="checkbox"
                  id="declaration"
                  v-model="editForm.declaration"
                  required
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="declaration" class="ml-2 block text-sm text-gray-900">
                  I declare that the information provided is true and accurate.
                </label>
                <p v-if="fieldErrors.declaration" class="text-xs text-red-600 mt-1">
                  {{ fieldErrors.declaration }}
                </p>
              </div>

              <div class="mt-6 flex justify-end space-x-2">
                <button
                  type="button"
                  @click="editMode = false"
                  class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting || !editForm.declaration"
                  class="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <svg
                    v-if="isSubmitting"
                    class="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                  {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>

          <!-- View Mode -->
          <div v-else class="mt-6 grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
            <!-- Course Details -->
            <div class="sm:col-span-2">
              <h4 class="text-md font-medium text-gray-900 mb-2">Basic Information</h4>
              <dl class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <!-- <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Course Name</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedCourse.course_name }}</dd>
                </div> -->
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Course Title</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedCourse.course_title }}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Duration</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ selectedCourse.duration_in_months }} months
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Commencement Date</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ formatDate(selectedCourse.commencement_date) }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Status</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    <span
                      :class="{
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full': true,
                        'bg-green-100 text-green-800': selectedCourse.is_active,
                        'bg-red-100 text-red-800': !selectedCourse.is_active,
                      }"
                    >
                      {{ selectedCourse.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <!-- Dates -->
            <div class="sm:col-span-2">
              <h4 class="text-md font-medium text-gray-900 mb-2">Validity Period</h4>
              <dl class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Valid Since</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ formatDate(selectedCourse.valid_since) }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Valid Till</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ formatDate(selectedCourse.valid_till) }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Created At</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ formatDate(selectedCourse.created_at) }}
                  </dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Updated At</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ formatDate(selectedCourse.updated_at) }}
                  </dd>
                </div>
              </dl>
            </div>

            <!-- Additional Information -->
            <div class="sm:col-span-2">
              <h4 class="text-md font-medium text-gray-900 mb-2">Additional Information</h4>
              <dl class="grid grid-cols-1 gap-x-4 gap-y-4">
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">Remarks</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ selectedCourse.remarks || 'N/A' }}</dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">Institute Declaration</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ selectedCourse.ins_declaration ? 'Yes' : 'No' }}
                  </dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-sm font-medium text-gray-500">Review Decision</dt>
                  <dd class="mt-1 text-sm text-gray-900">
                    {{ selectedCourse.ins_review_decision || 'N/A' }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div v-if="!editMode" class="mt-6 flex justify-end">
            <button
              @click="closeViewModal"
              type="button"
              class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import services from '@/services/services.js'

// Initialize toast
const toast = useToast()

const courses = ref([])
const loading = ref(true)
const error = ref(null)
const viewModalOpen = ref(false)
const selectedCourse = ref(null)
const editMode = ref(false)
const isSubmitting = ref(false)
const isLoadingInstitutes = ref(false)
const institutes = ref([])
const modalError = ref(null)
const fieldErrors = reactive({})

// Edit form state
const editForm = reactive({
  courseName: '',
  selectedInstitute: '',
  courseTitle: '',
  duration: null,
  commencementDate: '',
  attachmentFile: null,
  remarks: '',
  declaration: false,
})

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Fetch courses
const fetchCourses = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await services.getEpcCourseDetails()
    courses.value = response.data.results || []
  } catch (err) {
    error.value = 'Failed to fetch courses. Please try again later.'
    toast.error(error.value, { timeout: 5000 })
    console.error('Error fetching courses:', err)
  } finally {
    loading.value = false
  }
}

// Fetch institutes for edit form
const fetchInstitutes = async () => {
  isLoadingInstitutes.value = true
  modalError.value = null
  institutes.value = []
  try {
    const response = await services.getEpcInstitutes()
    let rawInstituteList = []
    if (response?.data?.results && Array.isArray(response.data.results)) {
      rawInstituteList = response.data.results
    } else if (response?.data && Array.isArray(response.data)) {
      rawInstituteList = response.data
    } else if (Array.isArray(response)) {
      rawInstituteList = response
    } else {
      console.warn('Unexpected institute data format:', response)
      modalError.value = 'Failed to load institutes: Unexpected data format.'
      toast.error(modalError.value, { timeout: 5000 })
      return
    }

    institutes.value = rawInstituteList
      .filter((inst) => inst && inst.id && inst.name_of_institution)
      .map((inst) => ({
        id: inst.id,
        name: inst.name_of_institution,
      }))
  } catch (err) {
    console.error('Error fetching institutes:', err)
    modalError.value = `Failed to load institutes: ${err.message || 'Network error'}`
    toast.error(modalError.value, { timeout: 5000 })
  } finally {
    isLoadingInstitutes.value = false
  }
}

// Delete course
const deleteCourse = async (course) => {
  if (!window.confirm(`Are you sure you want to delete the course "${course.course_name}"?`)) return
  try {
    await services.deleteEpcCourseDetail(course.id)
    await fetchCourses()
    toast.success(`Course "${course.course_name}" deleted successfully!`, { timeout: 5000 })
  } catch (err) {
    const errorMsg = `Failed to delete course: ${
      err.response?.data?.detail || err.message || 'Unknown error'
    }`
    toast.error(errorMsg, { timeout: 5000 })
    console.error('Error deleting course:', err)
  }
}

// Handle file upload
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    editForm.attachmentFile = file
  } else {
    editForm.attachmentFile = null
  }
}

// Reset edit form
const resetEditForm = () => {
  editForm.courseName = selectedCourse.value.course_name || ''
  editForm.selectedInstitute = selectedCourse.value.institute || ''
  editForm.courseTitle = selectedCourse.value.course_title || ''
  editForm.duration = selectedCourse.value.duration_in_months || null
  editForm.commencementDate = selectedCourse.value.commencement_date || ''
  editForm.attachmentFile = null
  editForm.remarks = selectedCourse.value.remarks || ''
  editForm.declaration = selectedCourse.value.ins_declaration || false
  modalError.value = null
  Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key])
  const fileInput = document.getElementById('attachments')
  if (fileInput) fileInput.value = ''
}

// Open view modal
const openViewModal = (course) => {
  selectedCourse.value = course
  resetEditForm()
  viewModalOpen.value = true
  editMode.value = false
  fetchInstitutes()
}

// Close view modal
const closeViewModal = () => {
  viewModalOpen.value = false
  selectedCourse.value = null
  editMode.value = false
}

// Submit edited course
const submitEditCourse = async () => {
  if (!editForm.declaration) {
    modalError.value = 'You must agree to the declaration.'
    toast.error(modalError.value, { timeout: 5000 })
    return
  }

  isSubmitting.value = true
  modalError.value = null
  Object.keys(fieldErrors).forEach((key) => delete fieldErrors[key])

  const formData = new FormData()
  formData.append('course_name', editForm.courseName)
  formData.append('institute', editForm.selectedInstitute)
  formData.append('course_title', editForm.courseTitle)
  if (editForm.duration !== null && editForm.duration !== undefined) {
    formData.append('duration_in_months', editForm.duration)
  }
  formData.append('commencement_date', editForm.commencementDate)
  formData.append('remarks', editForm.remarks)
  if (editForm.attachmentFile) {
    formData.append('institute_attachments', editForm.attachmentFile, editForm.attachmentFile.name)
  }

  try {
    const response = await services.updateEpcCourseDetail(selectedCourse.value.id, formData)
    if (response.status === 200) {
      toast.success(`Course "${editForm.courseName}" updated successfully!`, { timeout: 5000 })
      editMode.value = false
      await fetchCourses()
      // Update selectedCourse to reflect changes
      selectedCourse.value = response.data
    } else {
      modalError.value = 'Unexpected response from server. Please try again.'
      toast.error(modalError.value, { timeout: 5000 })
    }
  } catch (err) {
    console.error('Error updating course:', err)
    if (
      err.response &&
      err.response.data &&
      typeof err.response.data === 'object' &&
      err.response.status === 400
    ) {
      const errors = err.response.data
      const errorKeyMapping = {
        course_name: 'courseName',
        institute: 'selectedInstitute',
        course_title: 'courseTitle',
        duration_in_months: 'duration',
        commencement_date: 'commencementDate',
        institute_attachments: 'attachments',
        remarks: 'remarks',
        declaration: 'declaration',
      }

      const errorMessages = {
        attachments: 'Please upload an attachment for the institute.',
        courseName: 'Please enter a valid course name.',
        selectedInstitute: 'Please select an institute.',
        courseTitle: 'Please enter a valid course title.',
        duration: 'Please enter a valid duration (in months).',
        commencementDate: 'Please select a valid commencement date.',
        remarks: 'Please provide valid remarks.',
        declaration: 'You must agree to the declaration.',
      }

      let hasFieldErrors = false
      for (const apiKey in errors) {
        if (errors[apiKey] && Array.isArray(errors[apiKey]) && errors[apiKey].length > 0) {
          const formKey = errorKeyMapping[apiKey]
          if (formKey) {
            fieldErrors[formKey] = errorMessages[formKey] || errors[apiKey][0]
            hasFieldErrors = true
          } else {
            modalError.value = (modalError.value || '') + `${apiKey}: ${errors[apiKey][0]} `
          }
        }
      }

      if (hasFieldErrors && !modalError.value) {
        modalError.value = 'Please correct the errors below.'
      } else if (!hasFieldErrors && !modalError.value) {
        modalError.value = 'An unknown validation error occurred.'
      }
      toast.error(modalError.value, { timeout: 5000 })
    } else {
      modalError.value = `Failed to update course: ${
        err.response?.data?.detail || err.message || 'Unknown error'
      }`
      toast.error(modalError.value, { timeout: 5000 })
    }
  } finally {
    isSubmitting.value = false
  }
}

// Fetch courses when component mounts
onMounted(() => {
  fetchCourses()
})
</script>
