<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">Upload Trade License</h2>

    <div v-if="approvedApplications.length > 0">
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto bg-white shadow-md rounded-lg">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left text-gray-700">Application ID</th>
              <th class="px-4 py-2 text-left text-gray-700">Application Name</th>
              <th class="px-4 py-2 text-left text-gray-700">Status</th>
              <th class="px-4 py-2 text-center text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="application in approvedApplications"
              :key="application.id"
              class="hover:bg-gray-50"
            >
              <td class="border-t px-4 py-2">{{ application.id }}</td>
              <td class="border-t px-4 py-2">{{ application.name }}</td>
              <td class="border-t px-4 py-2">{{ application.status }}</td>
              <td class="border-t px-4 py-2 text-center">
                <button
                  @click="handleUploadLicense(application.id)"
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Upload Trade License
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else class="text-gray-500">No approved applications found for Trade License upload.</div>

    <!-- Upload Modal (You can create a separate modal component for better structure) -->
    <div
      v-if="showUploadModal"
      class="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"> </span>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              Upload Trade License for Application ID: {{ selectedApplicationId }}
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500">
                Please upload the Trade License document for the selected application.
              </p>
            </div>
            <div class="mt-4">
              <input
                type="file"
                @change="handleFileUpload"
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <div v-if="uploadError" class="text-red-500 text-sm mt-2">{{ uploadError }}</div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              @click="confirmUpload"
            >
              Upload
            </button>
            <button
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="closeUploadModal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Sample Application Data (Replace with your actual data fetching logic)
const applications = ref([
  { id: 101, name: 'New ECPF - ABC Institute', status: 'approved' },
  { id: 102, name: 'Collaboration - XYZ University', status: 'pending' },
  { id: 103, name: 'Branch ECPF - 123 Location', status: 'approved' },
  { id: 104, name: 'Name Change - Old Name Corp', status: 'rejected' },
  { id: 105, name: 'Ownership Change - PQR Group', status: 'approved' },
])

// Filter applications to show only 'approved' status
const approvedApplications = computed(() => {
  return applications.value.filter((app) => app.status === 'approved')
})

// Modal state and selected application ID
const showUploadModal = ref(false)
const selectedApplicationId = ref(null)
const uploadedFile = ref(null)
const uploadError = ref('')

// Function to handle "Upload Trade License" button click
const handleUploadLicense = (applicationId) => {
  selectedApplicationId.value = applicationId
  showUploadModal.value = true
  uploadError.value = '' // Reset error message when modal opens
}

// Function to handle file selection
const handleFileUpload = (event) => {
  uploadedFile.value = event.target.files[0]
}

// Function to confirm upload (You'll implement actual upload logic here)
const confirmUpload = async () => {
  if (!uploadedFile.value) {
    uploadError.value = 'Please select a file to upload.'
    return
  }

  // Here you would typically:
  // 1. Validate file type/size if needed
  // 2. Send the file to your backend API along with selectedApplicationId
  // 3. Handle success/error responses from the API

  console.log('Uploading Trade License for Application ID:', selectedApplicationId.value)
  console.log('File to upload:', uploadedFile.value)

  // Simulate successful upload (replace with actual API call handling)
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
  alert(`Trade License uploaded successfully for Application ID: ${selectedApplicationId.value}`)
  closeUploadModal()
  uploadedFile.value = null // Clear the selected file after successful upload
}

// Function to close the upload modal
const closeUploadModal = () => {
  showUploadModal.value = false
  selectedApplicationId.value = null
  uploadedFile.value = null
  uploadError.value = ''
}
</script>

<style scoped>
/* You can add component-specific styles here if needed */
</style>
