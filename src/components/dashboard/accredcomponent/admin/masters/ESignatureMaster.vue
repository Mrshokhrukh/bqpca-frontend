# ESignatureManager.vue

<template>
  <div class="p-6 max-w-7xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">E-Signature Management</h1>

    <!-- Add/Edit Form -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">
        {{ isEditing ? 'Edit E-Signature' : 'Add New E-Signature' }}
      </h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input v-model="formData.name" type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Designation</label>
            <input v-model="formData.designation" type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Signature Image</label>
            <input type="file" @change="handleFileUpload" accept="image/jpeg,image/png"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :required="!isEditing" />
            <p class="mt-1 text-sm text-gray-500">Accepted formats: JPG, PNG</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div class="mt-2">
              <label class="inline-flex items-center">
                <input type="checkbox" v-model="formData.status" class="form-checkbox h-4 w-4 text-blue-600 rounded" />
                <span class="ml-2">Active</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Signature Preview -->
        <div v-if="imagePreview || (isEditing && formData.signature)" class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Signature Preview</label>
          <div class="max-w-xs border border-gray-300 rounded-md p-2">
            <img :src="imagePreview || formData.signature" alt="Signature preview" class="max-h-32 object-contain" />
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button v-if="isEditing" type="button" @click="cancelEdit"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
            Cancel
          </button>
          <button type="submit"
            class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {{ isEditing ? 'Update' : 'Add' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="min-w-full overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signature</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="signature in signatures" :key="signature.id">
              <td class="px-6 py-4 whitespace-nowrap">{{ signature.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ signature.designation }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <img :src="signature.signature" alt="Signature" class="h-8 w-auto object-contain" />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="{
                  'px-2 py-1 text-xs font-semibold rounded-full': true,
                  'bg-green-100 text-green-800': signature.status,
                  'bg-gray-100 text-gray-800': !signature.status
                }">
                  {{ signature.status ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ formatDate(signature.updated_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button @click="editSignature(signature)" class="text-blue-600 hover:text-blue-900 focus:outline-none">
                  Edit
                </button>
                <button @click="confirmDelete(signature.id)" class="text-red-600 hover:text-red-900 focus:outline-none">
                  Delete
                </button>
              </td>
            </tr>
            <tr v-if="signatures.length === 0">
              <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                No signatures found
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1"
        class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between">
          <button @click="currentPage > 1 && fetchSignatures(currentPage - 1)" :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
            Previous
          </button>
          <button @click="currentPage < totalPages && fetchSignatures(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
        <p class="text-gray-600 mb-6">Are you sure you want to delete this signature? This action cannot be undone.</p>
        <div class="flex justify-end space-x-3">
          <button @click="showDeleteModal = false"
            class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
            Cancel
          </button>
          <button @click="deleteSignature"
            class="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import api from '@/services/services'

// State
const signatures = ref([])
const formData = ref({
  name: '',
  designation: '',
  signature: null,
  status: true
})
const imagePreview = ref(null)
const isEditing = ref(false)
const editingId = ref(null)
const showDeleteModal = ref(false)
const deleteId = ref(null)
const currentPage = ref(1)
const totalPages = ref(1)

// Methods
const fetchSignatures = async (page = 1) => {
  try {
    const response = await api.getMastersESignatures()
    signatures.value = response.data.results
    totalPages.value = Math.ceil(response.data.count / 10)
    currentPage.value = page
  } catch (error) {
    console.error('Error fetching signatures:', error)
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    formData.value.signature = file
    // Create preview URL
    imagePreview.value = URL.createObjectURL(file)
  }
}

const handleSubmit = async () => {
  try {
    const submitData = new FormData()
    for (const [key, value] of Object.entries(formData.value)) {
      if (value !== null) {
        submitData.append(key, value)
      }
    }

    if (isEditing.value) {
      await api.updateMastersESignature(editingId.value, submitData)
    } else {
      await api.createMastersESignature(submitData)
    }
    resetForm()
    fetchSignatures()
  } catch (error) {
    console.error('Error saving signature:', error)
  }
}

const editSignature = (signature) => {
  formData.value = {
    name: signature.name,
    designation: signature.designation,
    status: signature.status,
    signature: signature.signature // Keep the existing signature URL
  }
  isEditing.value = true
  editingId.value = signature.id
  imagePreview.value = null // Clear any existing preview
}

const cancelEdit = () => {
  resetForm()
}

const resetForm = () => {
  formData.value = {
    name: '',
    designation: '',
    signature: null,
    status: true
  }
  isEditing.value = false
  editingId.value = null
  imagePreview.value = null
  // Clean up any existing preview URLs
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
}

const confirmDelete = (id) => {
  deleteId.value = id
  showDeleteModal.value = true
}

const deleteSignature = async () => {
  try {
    await api.deleteMastersESignature(deleteId.value)
    showDeleteModal.value = false
    deleteId.value = null
    fetchSignatures()
  } catch (error) {
    console.error('Error deleting signature:', error)
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(() => {
  fetchSignatures()
})

// Cleanup
onBeforeUnmount(() => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
})
</script>