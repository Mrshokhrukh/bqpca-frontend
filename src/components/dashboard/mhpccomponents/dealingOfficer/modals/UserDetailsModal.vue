<!-- src/components/modals/UserDetailsModal.vue -->
<template>
  <transition name="modal-fade">
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/60 backdrop-filter backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full"
        style="max-height: 90vh; display: flex; flex-direction: column"
      >
        <!-- Header -->
        <div class="relative px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="text-xl font-bold text-gray-900 flex items-center">
            <span v-if="isEditing" class="mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
                />
                <path
                  fill-rule="evenodd"
                  d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            <span v-else class="mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            {{ isEditing ? 'Edit User Record' : 'User Details' }}
          </h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- User Data Content -->
        <div v-if="user" class="p-6" style="overflow-y: auto">
          <div class="max-h-[none] pr-1 space-y-6">
            <!-- User Information Section -->
            <div class="bg-gray-50 rounded-xl p-5">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2 text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                User Information
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    v-model="user.full_name"
                    :readonly="!isEditing"
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    :class="{ 'bg-gray-100': !isEditing }"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">CID Number</label>
                  <input
                    type="text"
                    v-model="user.cid_no"
                    readonly
                    class="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm text-gray-600"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                  <select
                    v-model="user.gender"
                    :disabled="!isEditing"
                    class="appearance-none w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    :class="{ 'bg-gray-100': !isEditing }"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    v-model="user.date_of_birth"
                    :readonly="!isEditing"
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    :class="{ 'bg-gray-100': !isEditing }"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Contact Number</label>
                  <input
                    type="text"
                    v-model="user.contact_no"
                    :readonly="!isEditing"
                    class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    :class="{ 'bg-gray-100': !isEditing }"
                  />
                </div>
              </div>
            </div>

            <!-- Registration & Status Details Section -->
            <div class="bg-gray-50 rounded-xl p-5">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2 text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clip-rule="evenodd"
                  />
                </svg>
                Registration & Status Details
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-medium text-gray-600">Registration No.</label>
                  <p class="mt-1 text-gray-900 font-mono">{{ user.registration_no || 'N/A' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600">Registration Date</label>
                  <p class="mt-1 text-gray-900">{{ user.registration_date || 'N/A' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600">Expiry Date</label>
                  <p class="mt-1 text-gray-900">{{ user.expiry_date || 'N/A' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-600">Payment Status</label>
                  <span
                    :class="`capitalize inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.payment_status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`"
                  >
                    {{ user.payment_status || 'N/A' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Qualifications Section -->
            <div
              v-if="user.user_qualifications && user.user_qualifications.length > 0"
              class="bg-white border border-gray-200 rounded-xl p-5"
            >
              <h3 class="text-lg font-semibold text-gray-800 flex items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2 text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"
                  />
                </svg>
                Qualifications
              </h3>
              <div class="space-y-4">
                <div
                  v-for="(qualification, qIndex) in user.user_qualifications"
                  :key="qIndex"
                  class="bg-gray-50 rounded-lg p-4"
                >
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm text-gray-500">Qualification</p>
                      <p class="font-medium text-gray-800">
                        {{ qualification.actual_qualification_name_display }}
                      </p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">Institution</p>
                      <p class="font-medium text-gray-800">
                        {{ qualification.institute_university_display }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Officer Attachments Section -->
            <div class="bg-white border border-gray-200 rounded-xl p-5">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2 text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2-2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clip-rule="evenodd"
                  />
                </svg>
                Officer Attachments
              </h3>
              <!-- The key here is that v-if now correctly watches `user.officer_uploaded_files` -->
              <div
                v-if="user.officer_uploaded_files && user.officer_uploaded_files.length > 0"
                class="space-y-3 mb-6"
              >
                <a
                  v-for="file in user.officer_uploaded_files"
                  :key="file.id"
                  :href="file.file_url"
                  target="_blank"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <div class="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 mr-3 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2-2H6a2 2 0 01-2-2V4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <div>
                      <p class="font-medium text-gray-800 group-hover:text-blue-600">
                        {{ file.description }}
                      </p>
                      <p class="text-xs text-gray-500">
                        Uploaded by {{ file.uploaded_by_name }} on
                        {{ new Date(file.uploaded_at).toLocaleDateString() }}
                      </p>
                    </div>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-400 group-hover:text-blue-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </a>
              </div>
              <div v-else class="text-center py-4 bg-gray-50 rounded-lg">
                <p class="text-sm text-gray-500">No files have been uploaded by an officer.</p>
              </div>

              <!-- Upload Form -->
              <div class="mt-6 border-t pt-6">
                <h4 class="text-md font-semibold text-gray-700 mb-3">Upload a New File</h4>
                <div class="space-y-4">
                  <div>
                    <label
                      for="file-description"
                      class="block text-sm font-medium text-gray-600 mb-1"
                      >File Description</label
                    >
                    <input
                      type="text"
                      id="file-description"
                      v-model="newFileDescription"
                      class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Scanned ID Copy, Endorsement Note"
                    />
                  </div>
                  <div>
                    <label for="file-upload" class="block text-sm font-medium text-gray-600 mb-1"
                      >Select File</label
                    >
                    <input
                      type="file"
                      id="file-upload"
                      @change="handleFileSelect"
                      class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <button
                    @click="uploadFile"
                    :disabled="!newFile || loading"
                    class="w-full flex justify-center items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <svg
                      v-if="loading"
                      class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    {{ loading ? 'Uploading...' : 'Upload File' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Action Buttons -->
          <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              v-if="isEditing"
              @click="saveChanges"
              class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              Save Changes
            </button>
            <button
              @click="closeModal"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              {{ isEditing ? 'Cancel' : 'Close' }}
            </button>
          </div>
        </div>

        <!-- No User Found State -->
        <div v-else class="p-6 flex flex-col items-center justify-center">
          <div class="bg-yellow-50 p-4 rounded-lg w-full">
            <div class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-yellow-500 mr-3"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
              <p class="text-yellow-700">No user details to display.</p>
            </div>
          </div>
          <button
            @click="closeModal"
            class="mt-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import apiServices from '@/services/services'
import { useToast } from 'vue-toastification'

const props = defineProps({
  showModal: Boolean,
  isEditing: Boolean,
  selectedRecord: Object,
  userId: Number,
})

const emit = defineEmits(['close', 'update'])
const toast = useToast()

const user = ref(null)
const loading = ref(false)
const error = ref(null)

const newFile = ref(null)
const newFileDescription = ref('')

// This watcher now correctly updates the modal's internal `user` state
// whenever the `selectedRecord` prop from the parent changes.
watch(
  () => props.selectedRecord,
  (newRecord) => {
    if (newRecord) {
      user.value = { ...newRecord }
    } else {
      user.value = null
    }
  },
  { deep: true, immediate: true },
)

const closeModal = () => {
  emit('close')
  user.value = null
  error.value = null
  newFile.value = null
  newFileDescription.value = ''
}

const saveChanges = async () => {
  if (user.value && user.value.id) {
    loading.value = true
    error.value = null
    const userDataToUpdate = {
      full_name: user.value.full_name,
      gender: user.value.gender,
      contact_no: user.value.contact_no,
      date_of_birth: user.value.date_of_birth,
    }
    try {
      await apiServices.patchMhpcNewApplication(user.value.id, userDataToUpdate)
      emit('update') // Tell the parent to refresh its data
      closeModal()
    } catch (err) {
      console.error('Failed to update user data:', err)
      error.value = 'Failed to save changes. Please try again.'
      toast.error(error.value)
    } finally {
      loading.value = false
    }
  }
}

const handleFileSelect = (event) => {
  if (event.target.files.length > 0) {
    newFile.value = event.target.files[0]
  } else {
    newFile.value = null
  }
}

const uploadFile = async () => {
  if (!newFile.value || !user.value?.id) {
    toast.error('Please select a file to upload.')
    return
  }

  loading.value = true
  error.value = null

  const formData = new FormData()
  formData.append('file', newFile.value)
  formData.append('description', newFileDescription.value || 'Uploaded File')

  try {
    await apiServices.uploadOfficerFileForApplication(user.value.id, formData)

    // Reset the form fields
    newFile.value = null
    newFileDescription.value = ''
    const fileInput = document.getElementById('file-upload')
    if (fileInput) fileInput.value = ''

    // IMPORTANT: Tell the parent to refetch all data. The parent will then
    // send the updated record back down to this component via props.
    emit('update')
  } catch (err) {
    console.error('Failed to upload file:', err)
    error.value = 'Failed to upload file. Please check the console for details.'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
