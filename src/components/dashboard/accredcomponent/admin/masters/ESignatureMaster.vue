<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">E-Signature Management</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column - Add/Edit Form -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">
            {{ isEditing ? 'Edit E-Signature' : 'Add New E-Signature' }}
          </h2>
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="name" class="block text-sm font-medium text-slate-700 mb-1"
                    >Name</label
                  >
                  <input
                    id="name"
                    v-model="formData.name"
                    type="text"
                    class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label for="designation" class="block text-sm font-medium text-slate-700 mb-1"
                    >Designation</label
                  >
                  <input
                    id="designation"
                    v-model="formData.designation"
                    type="text"
                    class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="Enter designation"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="signature" class="block text-sm font-medium text-slate-700 mb-1"
                    >Signature Image</label
                  >
                  <input
                    id="signature"
                    type="file"
                    @change="handleFileUpload"
                    accept="image/jpeg,image/png"
                    class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    :required="!isEditing"
                  />
                  <p class="mt-1 text-sm text-slate-500">Accepted formats: JPG, PNG</p>
                </div>
                <div>
                  <label for="status" class="block text-sm font-medium text-slate-700 mb-1"
                    >Status</label
                  >
                  <div class="mt-2">
                    <label class="inline-flex items-center">
                      <input
                        id="status"
                        type="checkbox"
                        v-model="formData.status"
                        class="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span class="ml-2 text-slate-700 text-sm">Active</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Signature Preview -->
              <div v-if="imagePreview || (isEditing && formData.signature)" class="mt-4">
                <label class="block text-sm font-medium text-slate-700 mb-2"
                  >Signature Preview</label
                >
                <div class="max-w-xs border border-slate-300 rounded-md p-2">
                  <img
                    :src="imagePreview || formData.signature"
                    alt="Signature preview"
                    class="max-h-32 object-contain"
                  />
                </div>
              </div>

              <div class="flex gap-3">
                <button
                  type="submit"
                  class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {{ isEditing ? 'Update Signature' : 'Add Signature' }}
                </button>
                <button
                  v-if="isEditing"
                  type="button"
                  @click="cancelEdit"
                  class="py-2 px-4 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Right Column - Data Table -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div class="mb-6 space-y-4">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-slate-900">E-Signatures List</h2>
              <span class="text-sm text-slate-500">
                {{ signatures.length }} Signature{{ signatures.length !== 1 ? 's' : '' }}
              </span>
            </div>
          </div>

          <!-- Signatures Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                  >
                    Designation
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                  >
                    Signature
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                  >
                    Last Updated
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 bg-white">
                <tr
                  v-for="signature in signatures"
                  :key="signature.id"
                  class="hover:bg-blue-50/30 transition-colors duration-200"
                >
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-900">
                    {{ signature.name }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-700">
                    {{ signature.designation }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <img
                      :src="signature.signature"
                      alt="Signature"
                      class="h-8 w-auto object-contain"
                    />
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      :class="{
                        'px-2 py-1 text-xs font-semibold rounded-full': true,
                        'bg-green-100 text-green-800': signature.status,
                        'bg-slate-100 text-slate-700': !signature.status,
                      }"
                    >
                      {{ signature.status ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-700">
                    {{ formatDate(signature.updated_at) }}
                  </td>
                  <td
                    class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                  >
                    <div class="flex justify-end gap-2">
                      <button
                        @click="editSignature(signature)"
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        @click="confirmDelete(signature.id)"
                        class="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="signatures.length === 0">
                  <td colspan="6" class="px-6 py-4 text-center text-slate-500">
                    No signatures found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-6">
            <button
              @click="currentPage > 1 && fetchSignatures(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 rounded border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Previous
            </button>
            <span class="px-3 py-1 text-sm text-slate-600">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              @click="currentPage < totalPages && fetchSignatures(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 rounded border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <AlertDialogRoot :open="showDeleteModal" @update:open="showDeleteModal = $event">
        <AlertDialogContent
          class="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none z-50"
        >
          <AlertDialogTitle class="text-xl font-semibold text-slate-900 mb-2">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription class="text-slate-600 mb-6">
            This action cannot be undone. This will permanently delete the e-signature for "{{
              formData.name
            }}".
          </AlertDialogDescription>
          <div class="flex justify-end gap-4">
            <AlertDialogCancel
              class="px-4 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
              @click="showDeleteModal = false"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              @click="deleteSignature"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
        <AlertDialogOverlay class="fixed inset-0 bg-black/50 z-40" />
      </AlertDialogRoot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import api from '@/services/services'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogRoot,
  AlertDialogTitle,
} from 'radix-vue'

// State
const signatures = ref([])
const formData = ref({
  name: '',
  designation: '',
  signature: null,
  status: true,
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
    signature: signature.signature, // Keep the existing signature URL
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
    status: true,
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
    minute: '2-digit',
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

<style scoped></style>
