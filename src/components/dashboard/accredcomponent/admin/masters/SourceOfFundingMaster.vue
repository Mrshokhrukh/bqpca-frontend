<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">Source of Funding Management</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column - Add/Edit Form -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">
            {{ isEditing ? 'Edit Source' : 'Add New Source' }}
          </h2>
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label for="sourceName" class="block text-sm font-medium text-slate-700 mb-1"
                  >Source Name</label
                >
                <input
                  type="text"
                  id="sourceName"
                  v-model="formData.name"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Government, Private, Self-funded"
                  required
                />
              </div>

              <div>
                <label for="description" class="block text-sm font-medium text-slate-700 mb-1"
                  >Description</label
                >
                <textarea
                  id="description"
                  v-model="formData.description"
                  rows="4"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter a brief description of the funding source"
                ></textarea>
              </div>

              <div class="flex gap-3">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                >
                  <span v-if="isLoading">Saving...</span>
                  <span v-else>{{ isEditing ? 'Update Source' : 'Add Source' }}</span>
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
              <h2 class="text-xl font-semibold text-slate-900">Funding Sources List</h2>
              <span class="text-sm text-slate-500">
                {{ sourceOfFundings.length }} Source{{ sourceOfFundings.length !== 1 ? 's' : '' }}
              </span>
            </div>
             <!-- Error Alert -->
            <div v-if="error" class="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {{ error }}
            </div>
          </div>

          <!-- Sources Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Source Name</th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Description</th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-slate-200">
                <tr v-if="isLoading && !sourceOfFundings.length">
                  <td colspan="3" class="px-6 py-4 text-center text-slate-500">Loading sources...</td>
                </tr>
                <tr
                  v-for="source in sourceOfFundings"
                  :key="source.id"
                  class="hover:bg-blue-50/30 transition-colors duration-200"
                >
                  <td class="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                    {{ source.name }}
                  </td>
                  <td class="px-6 py-4 text-slate-700">
                    <p class="line-clamp-2">{{ source.description }}</p>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <div class="flex justify-end gap-2">
                      <button @click="startEdit(source)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-md" title="Edit Source">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button @click="openDeleteModal(source)" class="p-2 text-red-600 hover:bg-red-50 rounded-md" title="Delete Source">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!isLoading && sourceOfFundings.length === 0">
                  <td colspan="3" class="px-6 py-4 text-center text-slate-500">No funding sources found.</td>
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
            This action cannot be undone. This will permanently delete the funding source: <strong class="text-slate-800">"{{ itemToDelete?.name }}"</strong>.
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
import { ref, onMounted } from 'vue'
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
const sourceOfFundings = ref([])
const isLoading = ref(false)
const error = ref(null)
const formData = ref({
  id: null,
  name: '',
  description: '',
})
const isEditing = ref(false)

const isDeleteModalOpen = ref(false)
const itemToDelete = ref(null)

// --- API Methods ---
const fetchSourceOfFundings = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await apiService.getMastersSourceOfFundings()
    sourceOfFundings.value = response.data.results
  } catch (err) {
    error.value = "Failed to fetch funding sources. Please try again."
    console.error('Error fetching data:', err)
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  isLoading.value = true
  error.value = null
  try {
    if (isEditing.value) {
      await apiService.updateMastersSourceOfFunding(formData.value.id, formData.value)
    } else {
      await apiService.createMastersSourceOfFunding(formData.value)
    }
    await fetchSourceOfFundings()
    resetForm()
  } catch (err) {
    error.value = "Failed to save the funding source. You may not have permission (Admin required)."
    console.error('Error saving data:', err)
  } finally {
    isLoading.value = false
  }
}

const confirmDelete = async () => {
  if (!itemToDelete.value) return
  isLoading.value = true
  error.value = null
  try {
    await apiService.deleteMastersSourceOfFunding(itemToDelete.value.id)
    await fetchSourceOfFundings()
    closeDeleteModal()
  } catch (err) {
    error.value = "Failed to delete the funding source. It might be in use by other records."
    console.error('Error deleting data:', err)
  } finally {
    isLoading.value = false
  }
}

// --- Lifecycle Hook ---
onMounted(() => {
  fetchSourceOfFundings()
})

// --- Helper Methods ---
const startEdit = (source) => {
  formData.value = { ...source }
  isEditing.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelEdit = () => {
  resetForm()
}

const resetForm = () => {
  isEditing.value = false
  formData.value = {
    id: null,
    name: '',
    description: '',
  }
}

const openDeleteModal = (source) => {
  itemToDelete.value = source
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  itemToDelete.value = null
}
</script>