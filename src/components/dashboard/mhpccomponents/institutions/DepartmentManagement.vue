<template>
  <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
    <InstituteHeader
      title="Department Management"
      subtitle="Manage departments within registered institutes."
      :show-actions="false"
    />

    <div class="mt-8">
      <div class="flex justify-end mb-6">
        <button @click="openAddModal" type="button" class="btn btn-primary">
          <PlusIcon class="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
          Add New Department
        </button>
      </div>

      <div v-if="error" class="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 shadow-sm">
        <div class="flex">
          <div class="flex-shrink-0">
            <XCircleIcon class="h-6 w-6 text-red-500" aria-hidden="true" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-semibold text-red-800">Operation Failed</h3>
            <p class="mt-1 text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>

      <div
        v-if="successMessage"
        class="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 shadow-sm"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <CheckCircleIcon class="h-6 w-6 text-green-500" aria-hidden="true" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-semibold text-green-800">Success</h3>
            <p class="mt-1 text-sm text-green-700">{{ successMessage }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div
          v-if="isLoadingDepartments && departments.length === 0"
          class="flex flex-col items-center justify-center min-h-[300px] py-16"
        >
          <Loader class="animate-spin text-indigo-600 w-10 h-10" />
          <p class="mt-4 text-lg font-medium text-gray-700">Loading departments...</p>
        </div>
        <div
          v-else-if="departments.length === 0 && !isLoadingDepartments"
          class="text-center py-16"
        >
          <BuildingLibraryIcon class="mx-auto h-16 w-16 text-gray-400" aria-hidden="true" />
          <h3 class="mt-4 text-xl font-semibold text-gray-800">No Departments Found</h3>
          <p class="mt-2 text-sm text-gray-500">
            Get started by adding the first department for an institute.
          </p>
          <div class="mt-6">
            <button @click="openAddModal" type="button" class="btn btn-primary">
              <PlusIcon class="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
              Add Department
            </button>
          </div>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="table-header-cell">ID</th>
                <th scope="col" class="table-header-cell">Department Name</th>
                <th scope="col" class="table-header-cell">Institution</th>
                <th
                  scope="col"
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="department in departments"
                :key="department.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ department.id }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ department.department_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ department.institute?.name_of_institution || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    @click="viewDepartmentDetails(department)"
                    class="text-gray-400 hover:text-indigo-600 transition-colors"
                    title="View Details"
                  >
                    <EyeIcon class="w-5 h-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <Transition name="modal-fade">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          @click="closeModal"
          aria-hidden="true"
        ></div>
        <div
          class="relative w-full max-w-lg bg-white rounded-xl shadow-2xl transform transition-all overflow-y-auto max-h-[90vh]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title-add-dept"
          @click.stop
        >
          <div
            class="py-5 px-6 md:px-8 bg-gray-50 rounded-t-xl border-b border-gray-200 flex items-center justify-between"
          >
            <div class="flex items-center">
              <BuildingLibraryIcon
                class="w-6 h-6 text-indigo-700 mr-3 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <h2 id="modal-title-add-dept" class="text-lg font-semibold text-gray-900">
                  Add New Department
                </h2>
                <p class="text-xs text-gray-500">
                  Specify the department name and associate it with an institute.
                </p>
              </div>
            </div>
            <button
              @click="closeModal"
              class="p-1 text-gray-400 rounded-md hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span class="sr-only">Close</span>
              <XMarkIcon class="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          <form @submit.prevent="addDepartment" class="p-6 md:p-8">
            <div
              v-if="modalError"
              class="mb-5 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700"
            >
              <div class="flex">
                <div class="flex-shrink-0">
                  <XCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div class="ml-2">
                  {{ modalError }}
                </div>
              </div>
            </div>

            <div class="space-y-5">
              <div>
                <label for="departmentName" class="form-label required-label"
                  >Department Name</label
                >
                <input
                  type="text"
                  id="departmentName"
                  v-model="newDepartment.department_name"
                  required
                  class="form-input"
                />
              </div>
              <div>
                <label for="instituteSelect" class="form-label required-label"
                  >Name of Institution</label
                >
                <select
                  id="instituteSelect"
                  v-model="newDepartment.institute_id"
                  required
                  class="form-select"
                  :disabled="isLoadingInstitutes"
                >
                  <option :value="null" disabled>
                    {{
                      isLoadingInstitutes && institutes.length === 0
                        ? 'Loading institutes...'
                        : '-- Select Institute --'
                    }}
                  </option>
                  <option v-for="institute in institutes" :key="institute.id" :value="institute.id">
                    {{ institute.name_of_institution }}
                  </option>
                  <option
                    v-if="!isLoadingInstitutes && institutes.length === 0 && !error"
                    :value="null"
                    disabled
                  >
                    No institutes available to select.
                  </option>
                  <option
                    v-if="!isLoadingInstitutes && institutes.length === 0 && error"
                    :value="null"
                    disabled
                  >
                    Could not load institutes.
                  </option>
                </select>
                <div
                  v-if="isLoadingInstitutes && institutes.length === 0"
                  class="flex items-center mt-2 text-xs text-gray-500"
                >
                  <Loader class="animate-spin h-4 w-4 mr-1.5 text-indigo-500" />
                  Loading institutes...
                </div>
              </div>
            </div>

            <div
              class="mt-8 pt-6 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0"
            >
              <button type="button" @click="closeModal" class="btn btn-outline w-full sm:w-auto">
                Cancel
              </button>
              <button type="submit" :disabled="isSaving" class="btn btn-primary w-full sm:w-auto">
                <Loader v-if="isSaving" class="animate-spin h-5 w-5 mr-2 text-white" />
                {{ isSaving ? 'Saving...' : 'Save Department' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <Transition name="modal-fade">
      <div
        v-if="showDetailsModal && selectedDepartment"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          @click="closeDetailsModal"
          aria-hidden="true"
        ></div>
        <div
          class="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl transform transition-all overflow-y-auto max-h-[90vh]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title-dept-details"
          @click.stop
        >
          <div
            class="py-5 px-6 md:px-8 bg-gray-50 rounded-t-xl border-b border-gray-200 flex items-center justify-between"
          >
            <div class="flex items-center">
              <InformationCircleIcon
                class="w-6 h-6 text-indigo-700 mr-3 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <h2 id="modal-title-dept-details" class="text-lg font-semibold text-gray-900">
                  Department Details
                </h2>
                <p class="text-xs text-gray-500">
                  Viewing information for department:
                  <span class="font-medium">{{ selectedDepartment.department_name }}</span>
                </p>
              </div>
            </div>
            <button
              @click="closeDetailsModal"
              class="p-1 text-gray-400 rounded-md hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span class="sr-only">Close</span>
              <XMarkIcon class="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          <div class="p-6 md:p-8 space-y-6">
            <div class="form-section-sm">
              <h3 class="section-title-sm">Department Information</h3>
              <div class="details-grid">
                <ReadOnlyDetail label="Department ID" :value="selectedDepartment.id" />
                <ReadOnlyDetail
                  label="Department Name"
                  :value="selectedDepartment.department_name"
                />
              </div>
            </div>

            <div
              v-if="selectedDepartment.institute"
              class="form-section-sm border-t border-gray-200 pt-6"
            >
              <h3 class="section-title-sm">Associated Institution</h3>
              <div class="details-grid">
                <ReadOnlyDetail
                  label="Institution Name"
                  :value="selectedDepartment.institute.name_of_institution"
                />
                <ReadOnlyDetail label="Institution ID" :value="selectedDepartment.institute.id" />
                <ReadOnlyDetail
                  label="Head of Institution"
                  :value="selectedDepartment.institute.head_of_institution_name"
                />
                <ReadOnlyDetail
                  label="Contact Number"
                  :value="selectedDepartment.institute.head_of_institution_phone_number"
                />
                <ReadOnlyDetail
                  label="Email Address"
                  :value="selectedDepartment.institute.head_of_institution_email"
                />
                <ReadOnlyDetail
                  label="Address"
                  :value="selectedDepartment.institute.address"
                  class="md:col-span-2"
                />
              </div>
            </div>
            <div v-else class="form-section-sm border-t border-gray-200 pt-6">
              <p class="text-sm text-gray-500">
                No associated institute information available for this department.
              </p>
            </div>
          </div>

          <div class="p-6 md:p-8 bg-gray-50 border-t border-gray-200 flex justify-end">
            <button type="button" @click="closeDetailsModal" class="btn btn-outline">Close</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import services from '@/services/services.js'
import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue'
import { Loader } from 'lucide-vue-next'
import {
  PlusIcon,
  EyeIcon,
  XMarkIcon,
  XCircleIcon,
  CheckCircleIcon,
  BuildingLibraryIcon,
  InformationCircleIcon,
} from '@heroicons/vue/24/outline'

const ReadOnlyDetail = (props) => {
  return `
      <div>
          <p class="text-xs font-medium text-gray-500">${props.label}</p>
          <p class="mt-0.5 text-sm text-gray-800">${props.value || 'N/A'}</p>
      </div>
  `
}
ReadOnlyDetail.props = ['label', 'value']

const institutes = ref([])
const departments = ref([])
const showModal = ref(false)
const showDetailsModal = ref(false)
const selectedDepartment = ref(null)
const newDepartment = ref({
  department_name: '',
  institute_id: null,
})
const isLoadingInstitutes = ref(false)
const isLoadingDepartments = ref(true)
const isSaving = ref(false)
const error = ref(null)
const modalError = ref(null)
const successMessage = ref('')

const fetchInstitutes = async () => {
  isLoadingInstitutes.value = true
  try {
    const response = await services.getMhpcInstitutes()
    let instituteList = []
    if (response?.data?.results && Array.isArray(response.data.results)) {
      instituteList = response.data.results
    } else if (response?.data && Array.isArray(response.data)) {
      instituteList = response.data
    } else if (Array.isArray(response)) {
      instituteList = response
    } else {
      error.value =
        'Failed to load institutes: Unexpected data format from server for institutes list.'
    }
    institutes.value = (instituteList || []).filter(
      (inst) => inst != null && inst.id && inst.name_of_institution,
    )

    if (institutes.value.length === 0 && !error.value) {
      error.value =
        'No institutes are currently registered or available. Departments cannot be added without institutes.'
    }
  } catch (err) {
    console.error('Error fetching institutes:', err)
    error.value = `Failed to load institute data: ${err.message || 'Network error'}. Cannot add new departments.`
    institutes.value = []
  } finally {
    isLoadingInstitutes.value = false
  }
}

const fetchDepartments = async () => {
  isLoadingDepartments.value = true
  error.value = null
  successMessage.value = ''
  try {
    const response = await services.getMhpcInstituteDepartments()
    let departmentList = []

    if (response?.data?.results && Array.isArray(response.data.results)) {
      departmentList = response.data.results
    } else if (response?.data && Array.isArray(response.data)) {
      departmentList = response.data
    } else {
      error.value = 'Unexpected data format received for departments.'
    }
    departments.value = (departmentList || []).filter((dept) => dept != null)
  } catch (err) {
    console.error('Error fetching departments:', err)
    let errorMessage = 'Failed to load departments.'
    if (err.response) {
      errorMessage += ` Server status: ${err.response.status}.`
      const detail =
        err.response.data?.detail ||
        err.response.data?.message ||
        (typeof err.response.data === 'string' ? err.response.data : null)
      if (detail) errorMessage += ` Message: ${detail}`
    } else if (err.request) {
      errorMessage += ' No response from server.'
    } else {
      errorMessage += ` Error: ${err.message}`
    }
    error.value = errorMessage
    departments.value = []
  } finally {
    isLoadingDepartments.value = false
  }
}

const resetNewDepartmentForm = () => {
  newDepartment.value = {
    department_name: '',
    institute_id: null,
  }
  modalError.value = null
}

const openAddModal = () => {
  resetNewDepartmentForm()
  successMessage.value = ''
  error.value = null
  showModal.value = true
  if (institutes.value.length === 0 && !isLoadingInstitutes.value) {
    fetchInstitutes() // Attempt to reload if empty and not already loading
  }
}

const closeModal = () => {
  showModal.value = false
}

const viewDepartmentDetails = (department) => {
  selectedDepartment.value = department
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedDepartment.value = null
}

const addDepartment = async () => {
  isSaving.value = true
  modalError.value = null
  successMessage.value = ''

  const payload = {
    department_name: newDepartment.value.department_name?.trim(),
    institute: newDepartment.value.institute_id,
  }

  if (!payload.department_name) {
    modalError.value = 'Department name is required.'
    isSaving.value = false
    return
  }
  if (payload.institute === null) {
    modalError.value = 'Please select an institute.'
    isSaving.value = false
    return
  }

  try {
    await services.createMhpcInstituteDepartment(payload)
    successMessage.value = `Department "${payload.department_name}" added successfully!`
    closeModal()
    fetchDepartments()
  } catch (err) {
    console.error('Error adding department:', err)
    if (err.response?.data) {
      const errors = err.response.data
      if (errors.department_name && Array.isArray(errors.department_name)) {
        modalError.value = `Department Name: ${errors.department_name.join(', ')}`
      } else if (errors.institute && Array.isArray(errors.institute)) {
        modalError.value = `Institute: ${errors.institute.join(', ')}`
      } else if (errors.detail) {
        modalError.value = errors.detail
      } else {
        modalError.value = 'An unexpected error occurred. Please check details and try again.'
      }
    } else {
      modalError.value = err.message || 'Failed to add department. Please try again.'
    }
  } finally {
    isSaving.value = false
  }
}

onMounted(async () => {
  await fetchInstitutes() // Fetch institutes first as they are needed for adding departments
  await fetchDepartments()
})
</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1.5;
}
.required-label::after {
  content: ' *';
  color: #dc2626;
  margin-left: 2px;
}
.form-input,
.form-select {
  @apply block w-full rounded-lg border-gray-300 shadow-sm p-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-150;
}
.btn {
  @apply inline-flex items-center justify-center rounded-lg border py-2.5 px-5 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed;
}
.btn-primary {
  @apply border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500;
}
.btn-outline {
  @apply border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500;
}

.table-header-cell {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .relative,
.modal-fade-leave-to .relative {
  transform: scale(0.95) translateY(20px);
}

.form-section-sm {
  @apply space-y-3;
}
.section-title-sm {
  @apply text-base font-semibold text-gray-800 mb-3;
}
.details-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4;
}
</style>
