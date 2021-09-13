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
                    placeholder="Enter full name"
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
                    placeholder="e.g., Director, Registrar"
                  />
                </div>
              </div>

              <div>
                <label for="signatureFile" class="block text-sm font-medium text-slate-700 mb-1"
                  >Signature Image</label
                >
                <input
                  id="signatureFile"
                  type="file"
                  ref="fileInput"
                  @change="handleFileUpload"
                  accept="image/jpeg,image/png"
                  class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  :required="!isEditing"
                />
                <p class="mt-1 text-sm text-slate-500">
                  Required on create. Optional on update. Accepted: JPG, PNG.
                </p>
              </div>

              <!-- Signature Preview -->
              <div v-if="imagePreview || (isEditing && formData.signature)" class="mt-4">
                <label class="block text-sm font-medium text-slate-700 mb-2"
                  >Signature Preview</label
                >
                <div class="max-w-xs border border-slate-300 rounded-md p-2 bg-slate-50">
                  <img
                    :src="imagePreview || formData.signature"
                    alt="Signature preview"
                    class="max-h-24 object-contain"
                  />
                </div>
              </div>

               <div>
                <label for="isActive" class="block text-sm font-medium text-slate-700 mb-1"
                  >Status</label
                >
                <div class="mt-2">
                  <label class="inline-flex items-center">
                    <input
                      id="isActive"
                      type="checkbox"
                      v-model="formData.is_active"
                      class="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-2 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-slate-700 text-sm">Active</span>
                  </label>
                </div>
              </div>


              <div class="flex gap-3 pt-2">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                >
                 <span v-if="isLoading">Saving...</span>
                 <span v-else>{{ isEditing ? 'Update Signature' : 'Add Signature' }}</span>
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
             <!-- Error Alert -->
            <div v-if="error" class="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {{ error }}
            </div>
          </div>

          <div v-if="isLoading && !signatures.length" class="text-center py-8">
            <p class="text-slate-500">Loading signatures...</p>
          </div>

          <!-- Signatures Table -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Name</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Designation</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Signature</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Status</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 bg-white">
                <tr
                  v-for="signature in signatures"
                  :key="signature.id"
                  class="hover:bg-blue-50/30 transition-colors duration-200"
                >
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-900">{{ signature.name }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-700">{{ signature.designation }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <img :src="signature.signature" alt="Signature" class="h-8 w-auto object-contain"/>
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      :class="[
                        'px-2 py-1 text-xs font-semibold rounded-full',
                        signature.is_active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-700',
                      ]"
                    >
                      {{ signature.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div class="flex justify-end gap-2">
                      <button @click="startEdit(signature)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-md" title="Edit">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button @click="openDeleteModal(signature)" class="p-2 text-red-600 hover:bg-red-50 rounded-md" title="Delete">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!isLoading && signatures.length === 0">
                  <td colspan="5" class="px-6 py-4 text-center text-slate-500">No e-signatures found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <AlertDialogRoot :open="isDeleteModalOpen" @update:open="isDeleteModalOpen = $event">
        <AlertDialogContent class="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none z-50">
          <AlertDialogTitle class="text-xl font-semibold text-slate-900 mb-2">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription class="text-slate-600 mb-6">
            This will permanently delete the e-signature for: <strong class="text-slate-800">"{{ signatureToDelete?.name }}"</strong>.
          </AlertDialogDescription>
          <div class="flex justify-end gap-4">
            <AlertDialogCancel class="px-4 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200" @click="closeDeleteModal">Cancel</AlertDialogCancel>
            <AlertDialogAction class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700" @click="confirmDelete">Delete</AlertDialogAction>
          </div>
        </AlertDialogContent>
        <AlertDialogOverlay class="fixed inset-0 bg-black/50 z-40" />
      </AlertDialogRoot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import apiService from '@/services/services'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogRoot,
  AlertDialogTitle,
} from 'radix-vue'

// Reactive State
const signatures = ref([])
const isLoading = ref(false)
const error = ref(null)
const fileInput = ref(null) // To reference the file input element

const defaultFormData = {
  id: null,
  name: '',
  designation: '',
  // CORRECTED: Use 'is_active' to match the Django model
  is_active: true,
  signature: null, // This will hold the File object for upload
}
const formData = ref({ ...defaultFormData })
const imagePreview = ref(null)
const isEditing = ref(false)

const isDeleteModalOpen = ref(false)
const signatureToDelete = ref(null)

// --- API Methods ---
const fetchSignatures = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await apiService.getMastersESignatures()
    signatures.value = response.data.results
  } catch (err) {
    error.value = "Failed to fetch e-signatures. Please try again."
    console.error('Error fetching signatures:', err)
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  isLoading.value = true
  error.value = null

  // FormData is necessary for file uploads
  const submitData = new FormData()
  submitData.append('name', formData.value.name)
  submitData.append('designation', formData.value.designation)
  submitData.append('is_active', formData.value.is_active)

  // Only append the signature file if a new one has been selected
  if (formData.value.signature instanceof File) {
    submitData.append('signature', formData.value.signature)
  }

  try {
    if (isEditing.value) {
      await apiService.updateMastersESignature(formData.value.id, submitData)
    } else {
      await apiService.createMastersESignature(submitData)
    }
    await fetchSignatures()
    resetForm()
  } catch (err) {
    error.value = "Failed to save the signature. You may not have permission (Admin required)."
    console.error('Error saving signature:', err)
  } finally {
    isLoading.value = false
  }
}

const confirmDelete = async () => {
  if (!signatureToDelete.value) return
  isLoading.value = true
  error.value = null
  try {
    await apiService.deleteMastersESignature(signatureToDelete.value.id)
    await fetchSignatures()
    closeDeleteModal()
  } catch (err) {
    error.value = "Failed to delete the signature."
    console.error('Error deleting signature:', err)
  } finally {
    isLoading.value = false
  }
}

// --- Helper Methods ---
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    formData.value.signature = file
    // Clean up old preview before creating a new one
    if (imagePreview.value) {
      URL.revokeObjectURL(imagePreview.value)
    }
    imagePreview.value = URL.createObjectURL(file)
  }
}

const startEdit = (signature) => {
  isEditing.value = true
  formData.value = {
    id: signature.id,
    name: signature.name,
    designation: signature.designation,
    is_active: signature.is_active,
    signature: signature.signature, // This is the URL from the server
  }
  imagePreview.value = null // Clear file preview, the existing image URL will be used
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelEdit = () => {
  resetForm()
}

const resetForm = () => {
  isEditing.value = false
  formData.value = { ...defaultFormData }
  // Clean up any existing preview URLs
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
  imagePreview.value = null
  // Reset the file input visually
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const openDeleteModal = (signature) => {
  signatureToDelete.value = signature
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  signatureToDelete.value = null
}

// --- Lifecycle Hooks ---
onMounted(() => {
  fetchSignatures()
})

onBeforeUnmount(() => {
  // Ensure the preview URL is revoked when the component is destroyed
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value)
  }
})
</script>

<style scoped>

</style>