<template>
  <div>
    <!-- Table for ModuleMaster Definitions -->
    <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Module Name
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Module Code
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Description
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="definition in moduleDefinitions" :key="definition.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {{ definition.module_master?.module_name || 'N/A' }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-xs text-gray-500">
                {{ definition.module_master?.module_code || 'N/A' }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div
                class="text-sm text-gray-900 truncate max-w-xs"
                :title="definition.module_master?.description || 'N/A'"
              >
                {{
                  definition.module_master?.description
                    ? definition.module_master.description.length > 70
                      ? definition.module_master.description.substring(0, 70) + '...'
                      : definition.module_master.description
                    : 'N/A'
                }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
              <button @click="openViewModal(definition)" class="text-blue-600 hover:text-blue-900">
                View
              </button>
              <button
                @click="openEditModal(definition)"
                class="text-indigo-600 hover:text-indigo-900"
              >
                Edit
              </button>
              <button
                @click="confirmDeleteDefinition(definition.id)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Loading, Error, No Data States -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
      ></div>
    </div>
    <div
      v-if="error && !loading"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4"
    >
      {{ error }}
    </div>
    <div v-if="!loading && !error && moduleDefinitions.length === 0" class="text-center py-10">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No module definitions found</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by adding a new module definition.</p>
    </div>

    <!-- View Modal (for ModuleMaster) -->
    <div
      v-if="viewModalOpen && selectedDefinition"
      class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-[60]"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-medium text-gray-900">Module Definition Details</h3>
            <button @click="closeViewModal" class="text-gray-400 hover:text-gray-500">
              <XMarkIcon class="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <dl class="mt-6 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start">
              <dt class="text-sm font-medium text-gray-500">Module Name</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ selectedDefinition.module_master?.module_name || 'N/A' }}
              </dd>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start">
              <dt class="text-sm font-medium text-gray-500">Module Code</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {{ selectedDefinition.module_master?.module_code || 'N/A' }}
              </dd>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start">
              <dt class="text-sm font-medium text-gray-500">Description</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">
                {{ selectedDefinition.module_master?.description || 'N/A' }}
              </dd>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start">
              <dt class="text-sm font-medium text-gray-500">Status</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    selectedDefinition.module_master?.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800',
                  ]"
                >
                  {{ selectedDefinition.module_master?.is_active ? 'Active' : 'Inactive' }}
                </span>
              </dd>
            </div>
            <div
              v-if="selectedDefinition.module_master?.attachments"
              class="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start"
            >
              <dt class="text-sm font-medium text-gray-500">Attachment</dt>
              <dd class="mt-1 text-sm text-blue-600 hover:underline sm:mt-0 sm:col-span-2">
                <a
                  :href="selectedDefinition.module_master.attachments"
                  target="_blank"
                  rel="noopener noreferrer"
                  >View Attachment</a
                >
              </dd>
            </div>
          </dl>
          <div class="mt-6 flex justify-end">
            <button @click="closeViewModal" type="button" class="btn btn-outline">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal (for ModuleMaster) -->
    <Transition name="modal-fade">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          class="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          @click="closeModal"
          aria-hidden="true"
        ></div>
        <div
          class="relative w-full max-w-md bg-white rounded-xl shadow-2xl transform transition-all overflow-y-auto max-h-[90vh]"
          role="dialog"
          aria-modal="true"
          @click.stop
        >
          <div
            class="py-5 px-6 md:px-8 bg-gray-50 rounded-t-xl border-b border-gray-200 flex items-center justify-between"
          >
            <div class="flex items-center">
              <div class="p-2 bg-purple-100 rounded-lg mr-3">
                <BookOpenIcon class="w-6 h-6 text-purple-600" aria-hidden="true" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  {{ isEditing ? 'Edit Module Definition' : 'Add New Module Definition' }}
                </h2>
                <p class="text-xs text-gray-500">Fill in the details for the module definition.</p>
              </div>
            </div>
            <button
              @click="closeModal"
              class="p-1 text-gray-400 rounded-md hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <XMarkIcon class="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          <form @submit.prevent="submitDefinitionForm" class="p-6 md:p-8">
            <div
              v-if="modalError"
              class="mb-5 p-3 rounded-md bg-red-50 border border-red-200 text-sm text-red-700"
            >
              <div class="flex">
                <XCircleIcon class="h-5 w-5 text-red-400 mr-2" aria-hidden="true" />
                {{ modalError }}
              </div>
            </div>

            <div class="space-y-5">
              <div>
                <label for="moduleName" class="form-label required-label">Module Name</label>
                <input
                  type="text"
                  id="moduleName"
                  v-model="formState.module_name"
                  required
                  class="form-input"
                  :aria-describedby="fieldErrors.module_name ? 'moduleName-error' : null"
                />
                <p v-if="fieldErrors.module_name" id="moduleName-error" class="form-error-message">
                  {{ fieldErrors.module_name }}
                </p>
              </div>
              <div>
                <label for="moduleCode" class="form-label required-label">Module Code</label>
                <input
                  type="text"
                  id="moduleCode"
                  v-model="formState.module_code"
                  required
                  class="form-input"
                  :aria-describedby="fieldErrors.module_code ? 'moduleCode-error' : null"
                />
                <p v-if="fieldErrors.module_code" id="moduleCode-error" class="form-error-message">
                  {{ fieldErrors.module_code }}
                </p>
              </div>
              <div>
                <label for="moduleDescription" class="form-label">Description</label>
                <textarea
                  id="moduleDescription"
                  v-model="formState.description"
                  rows="3"
                  class="form-textarea"
                ></textarea>
                <p v-if="fieldErrors.description" class="form-error-message">
                  {{ fieldErrors.description }}
                </p>
              </div>
              <div>
                <label for="attachments" class="form-label">Attachment</label>
                <input
                  type="file"
                  id="attachments"
                  @change="handleFileUpload"
                  class="form-file-input"
                />
                <p
                  v-if="isEditing && formState.existingAttachmentName"
                  class="mt-1.5 text-xs text-gray-500"
                >
                  Current: {{ formState.existingAttachmentName }}. Upload new to replace.
                </p>
                <p v-if="formState.attachmentFile" class="mt-1.5 text-xs text-green-600">
                  Selected: {{ formState.attachmentFile.name }}
                </p>
                <p v-if="fieldErrors.attachments" class="form-error-message">
                  {{ fieldErrors.attachments }}
                </p>
              </div>
              <div class="pt-2">
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="isActive"
                      type="checkbox"
                      v-model="formState.is_active"
                      class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="isActive" class="font-medium text-gray-700">Is Active</label>
                    <p class="text-gray-500 text-xs">
                      Indicates if this module definition is currently active.
                    </p>
                  </div>
                </div>
                <p v-if="fieldErrors.is_active" class="form-error-message">
                  {{ fieldErrors.is_active }}
                </p>
              </div>
            </div>
            <div
              class="mt-8 pt-6 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0"
            >
              <button type="button" @click="closeModal" class="btn btn-outline w-full sm:w-auto">
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="btn btn-primary w-full sm:w-auto"
              >
                <Loader v-if="isSubmitting" class="animate-spin h-5 w-5 mr-2 text-white" />
                {{
                  isSubmitting
                    ? 'Submitting...'
                    : isEditing
                      ? 'Update Definition'
                      : 'Add Definition'
                }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue' // Adjust path as needed
import { Loader } from 'lucide-vue-next'
import { BookOpenIcon, XMarkIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import apiServices from '@/services/services'
import { useToast } from 'vue-toastification'

const toast = useToast()

const moduleDefinitions = ref([]) // Stores ModuleMaster instances
const loading = ref(true)
const error = ref(null)
const viewModalOpen = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const modalError = ref(null)
const fieldErrors = reactive({})
const selectedDefinition = ref(null)

const initialFormState = {
  id: null, // For ModuleMaster id
  module_name: '',
  module_code: '',
  description: '',
  is_active: true,
  attachmentFile: null, // File object for attachment
  existingAttachmentName: null, // To display existing attachment filename
  program_master_id: null, // Keep for potential future use, but not in form for now
}
const formState = reactive({ ...initialFormState })

const emit = defineEmits(['error']) // No longer emitting 'edit-module' as this component handles it

const resetForm = () => {
  Object.assign(formState, initialFormState)
  formState.attachmentFile = null
  formState.existingAttachmentName = null
  isEditing.value = false
  modalError.value = null
  Object.keys(fieldErrors).forEach((key) => {
    delete fieldErrors[key]
  })
  const fileInput = document.getElementById('attachments')
  if (fileInput) fileInput.value = ''
}

const fetchModuleDefinitions = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiServices.getMhpcModules()
    moduleDefinitions.value = response.data.results || response.data || []
  } catch (err) {
    console.error('Error fetching module definitions:', err)
    error.value = `Failed to fetch module definitions: ${err.message || 'Unknown error'}`
    moduleDefinitions.value = []
    emit('error', error.value)
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  resetForm()
  isEditing.value = false
  showModal.value = true
}

const openEditModal = (definitionToEdit) => {
  resetForm()
  isEditing.value = true

  // Access the nested module_master data
  const moduleData = definitionToEdit.module_master

  formState.id = definitionToEdit.id
  formState.module_name = moduleData?.module_name || ''
  formState.module_code = moduleData?.module_code || ''
  formState.description = moduleData?.description || ''
  formState.is_active = moduleData?.is_active !== undefined ? moduleData.is_active : true

  if (moduleData?.attachments) {
    try {
      const url = new URL(moduleData.attachments)
      formState.existingAttachmentName = url.pathname.split('/').pop()
    } catch (e) {
      console.error('Error parsing attachment URL:', e)
      formState.existingAttachmentName = moduleData.attachments
    }
  }
  showModal.value = true
}

const openViewModal = (definition) => {
  selectedDefinition.value = JSON.parse(JSON.stringify(definition))
  viewModalOpen.value = true
}

const closeViewModal = () => {
  viewModalOpen.value = false
  selectedDefinition.value = null
}
const closeModal = () => {
  showModal.value = false
}

const handleFileUpload = (event) => {
  formState.attachmentFile = event.target.files[0] || null
}

const validateForm = () => {
  Object.keys(fieldErrors).forEach((key) => {
    delete fieldErrors[key]
  })
  let isValid = true
  if (!formState.module_name.trim()) {
    fieldErrors.module_name = 'Module name is required.'
    isValid = false
  }
  if (!formState.module_code.trim()) {
    fieldErrors.module_code = 'Module code is required.'
    isValid = false
  }
  return isValid
}

const submitDefinitionForm = async () => {
  modalError.value = null
  Object.keys(fieldErrors).forEach((key) => {
    delete fieldErrors[key]
  })

  if (!validateForm()) {
    modalError.value = 'Please correct the errors highlighted below.'
    return
  }
  isSubmitting.value = true

  const formData = new FormData()
  formData.append('module_name', formState.module_name)
  formData.append('module_code', formState.module_code)
  if (formState.description) formData.append('description', formState.description)
  formData.append('is_active', formState.is_active)
  if (formState.attachmentFile) {
    formData.append('attachments', formState.attachmentFile, formState.attachmentFile.name)
  } else if (isEditing.value && formState.existingAttachmentName === null) {
    // formData.append('attachments', ''); // If backend supports clearing file with empty string
  }

  try {
    if (isEditing.value && formState.id) {
      await apiServices.updateMhpcModule(formState.id, formData)
      toast.success('Module definition updated successfully!')
    } else {
      await apiServices.createMhpcModule(formData)
      toast.success('Module definition added successfully!')
    }
    closeModal()
    await fetchModuleDefinitions()
  } catch (err) {
    console.error('Error submitting module definition:', err.response || err)
    if (
      err.response?.data &&
      typeof err.response.data === 'object' &&
      err.response.status === 400
    ) {
      const backendErrors = err.response.data
      let unhandledErrorMessages = []
      for (const backendKey in backendErrors) {
        const message = Array.isArray(backendErrors[backendKey])
          ? backendErrors[backendKey].join(' ')
          : backendErrors[backendKey]
        const knownFields = [
          'module_name',
          'module_code',
          'description',
          'is_active',
          'attachments',
          'program_master_id',
        ]
        if (knownFields.includes(backendKey)) {
          fieldErrors[backendKey] = message
        } else if (backendKey === 'non_field_errors') {
          unhandledErrorMessages.push(message)
        } else {
          unhandledErrorMessages.push(`${backendKey.replace(/_/g, ' ')}: ${message}`)
        }
      }
      if (unhandledErrorMessages.length > 0) {
        modalError.value = `Please correct the issues: ${unhandledErrorMessages.join('; ')}`
      } else if (Object.values(fieldErrors).some((e) => e)) {
        modalError.value = 'Please correct the errors highlighted below.'
      } else {
        modalError.value = `Validation error: ${backendErrors.detail || err.message || 'Unknown validation issue.'}`
      }
    } else {
      modalError.value = `Failed to submit module definition: ${err.response?.data?.detail || err.message || 'Unknown server error'}`
      emit('error', modalError.value)
    }
  } finally {
    isSubmitting.value = false
  }
}

const confirmDeleteDefinition = async (definitionId) => {
  if (
    window.confirm(
      'Are you sure you want to delete this module definition? This action cannot be undone.',
    )
  ) {
    error.value = null
    try {
      await apiServices.deleteMhpcModule(definitionId)
      toast.success('Module definition deleted successfully.')
      await fetchModuleDefinitions()
    } catch (err) {
      console.error('Error deleting module definition:', err)
      error.value = `Failed to delete module definition: ${err.response?.data?.detail || err.message || 'Unknown error'}`
      toast.error(error.value)
      emit('error', error.value)
    }
  }
}

// Expose methods for the parent if this component is still meant to be the one manipulated
// by a parent (like ModuleManagementParent.vue).
// If this component is now the top-level manager for ModuleMaster, defineExpose might not be needed for these.
defineExpose({
  refreshData: fetchModuleDefinitions,
  openAddModal,
  openEditModal, // Expose the correct method name
})

onMounted(async () => {
  await fetchModuleDefinitions()
})
</script>

<style scoped>
/* Styles from your previous component */
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1.5;
}
.required-label::after {
  content: ' *';
  color: #dc2626;
  margin-left: 2px;
}
.form-input,
.form-select,
.form-textarea {
  @apply block w-full rounded-lg border-gray-300 shadow-sm p-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-150;
}
.form-file-input {
  @apply block w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border file:border-gray-200 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed;
}
.form-error-message {
  @apply mt-1.5 text-xs text-red-600;
}
.btn {
  @apply inline-flex items-center justify-center rounded-lg border py-2.5 px-5 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed;
}
.btn-primary {
  @apply border-transparent bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500;
}
.btn-outline {
  @apply border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500;
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
</style>
