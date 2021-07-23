<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">Appeal Reasons Management</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column - Add/Edit Form -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">
            {{ editingReason ? 'Edit Appeal Reason' : 'Add New Appeal Reason' }}
          </h2>
          <form
            @submit.prevent="editingReason ? updateAppealReason() : createAppealReason()"
            class="space-y-4"
          >
            <div>
              <label for="appeal_name" class="block text-sm font-medium text-slate-700">
                Appeal Name
              </label>
              <input
                id="appeal_name"
                v-model="formData.appeal_name"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter appeal name"
              />
            </div>
            <div>
              <label for="description" class="block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                id="description"
                v-model="formData.description"
                rows="3"
                class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter description"
              />
            </div>
            <div class="flex gap-3">
              <button
                type="submit"
                class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                :disabled="isLoading"
              >
                {{ editingReason ? 'Update Reason' : 'Add Reason' }}
              </button>
              <button
                type="button"
                @click="resetForm"
                class="py-2 px-4 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200"
                :disabled="isLoading"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <!-- Right Column - Appeal Reasons List -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div class="mb-6 space-y-4">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-slate-900">Appeal Reasons List</h2>
              <span class="text-sm text-slate-500">
                {{ pagination.count }} Reason{{ pagination.count !== 1 ? 's' : '' }}
              </span>
            </div>
            <div class="flex justify-end">
              <button
                @click="resetForm"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                :disabled="isLoading"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add New Reason
              </button>
            </div>
          </div>

          <!-- Error Alert -->
          <div v-if="error" class="mb-6">
            <div class="rounded-md bg-red-50 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg
                    class="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">Error</h3>
                  <p class="mt-1 text-sm text-red-700">{{ error }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Appeal Reasons Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                  >
                    Appeal Name
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                  >
                    Description
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 bg-white">
                <tr v-if="isLoading">
                  <td colspan="3" class="px-6 py-4 text-center text-sm text-slate-500">
                    <div class="flex justify-center items-center">
                      <svg
                        class="animate-spin h-5 w-5 text-blue-600"
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
                      <span class="ml-2">Loading...</span>
                    </div>
                  </td>
                </tr>
                <tr v-else-if="appealReasons.length === 0">
                  <td colspan="3" class="px-6 py-4 text-center text-sm text-slate-500">
                    No appeal reasons found
                  </td>
                </tr>
                <tr
                  v-for="reason in appealReasons"
                  :key="reason.id"
                  class="hover:bg-blue-50/30 transition-colors duration-200"
                >
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-900">
                    {{ reason.appeal_name }}
                  </td>
                  <td class="px-3 py-4 text-sm text-slate-700">{{ reason.description }}</td>
                  <td
                    class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                  >
                    <div class="flex justify-end gap-2">
                      <button
                        @click="editReason(reason)"
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
                        @click="deleteAppealReason(reason.id)"
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
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="pagination.count > 0" class="mt-6 flex justify-center gap-2">
            <button
              v-if="pagination.previous"
              @click="changePage(pagination.currentPage - 1)"
              class="px-3 py-1 rounded border border-slate-300 hover:bg-slate-50"
            >
              Previous
            </button>
            <span class="px-3 py-1 text-sm text-slate-600">
              Page {{ pagination.currentPage }} of {{ totalPages() }}
            </span>
            <button
              v-if="pagination.next"
              @click="changePage(pagination.currentPage + 1)"
              class="px-3 py-1 rounded border border-slate-300 hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Delete Confirmation Modal -->
  <AlertDialogRoot :open="isDeleteModalOpen" @update:open="isDeleteModalOpen = $event">
    <AlertDialogContent
      class="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none z-50"
    >
      <AlertDialogTitle class="text-xl font-semibold text-slate-900 mb-2">
        Are you absolutely sure?
      </AlertDialogTitle>
      <AlertDialogDescription class="text-slate-600 mb-6">
        This action cannot be undone. This will permanently delete the appeal reason "{{
          formData.appeal_name
        }}".
      </AlertDialogDescription>
      <div class="flex justify-end gap-4">
        <AlertDialogCancel
          class="px-4 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
          @click="closeDeleteModal"
        >
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          @click="confirmDeleteReason"
        >
          Delete
        </AlertDialogAction>
      </div>
    </AlertDialogContent>
    <AlertDialogOverlay class="fixed inset-0 bg-black/50 z-40" />
  </AlertDialogRoot>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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

// Data
const appealReasons = ref([])
const isLoading = ref(false)
// const showForm = ref(false) // Removed showForm ref
const editingReason = ref(null)
const isDeleteModalOpen = ref(false)
const reasonToDeleteId = ref(null)

// Pagination
const pagination = ref({
  count: 0,
  next: null,
  previous: null,
  currentPage: 1,
})

// Form data
const formData = ref({
  appeal_name: '',
  description: '',
})

// Error handling
const error = ref(null)

// Fetch all appeal reasons with pagination
const fetchAppealReasons = async (page = 1) => {
  isLoading.value = true
  error.value = null
  try {
    const response = await api.getMhpcMastersAppealReasons()
    appealReasons.value = response.data.results
    pagination.value = {
      count: response.data.count,
      next: response.data.next,
      previous: response.data.previous,
      currentPage: page,
    }
  } catch (err) {
    error.value = 'Failed to fetch appeal reasons'
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}

// Create new appeal reason
const createAppealReason = async () => {
  isLoading.value = true
  error.value = null
  try {
    await api.createMhpcMastersAppealReason(formData.value)
    await fetchAppealReasons(pagination.value.currentPage)
    resetForm()
    // showForm.value = false // Removed showForm update
  } catch (err) {
    error.value = 'Failed to create appeal reason'
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}

// Update appeal reason
const updateAppealReason = async () => {
  if (!editingReason.value) return

  isLoading.value = true
  error.value = null
  try {
    await api.updateMhpcMastersAppealReason(editingReason.value.id, formData.value)
    await fetchAppealReasons(pagination.value.currentPage)
    resetForm()
    // showForm.value = false; // Removed showForm update
  } catch (err) {
    error.value = 'Failed to update appeal reason'
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}

// Delete appeal reason
const deleteAppealReason = async (id) => {
  // Function is now used in template, no more warning
  reasonToDeleteId.value = id
  isDeleteModalOpen.value = true
}

const confirmDeleteReason = async () => {
  if (!reasonToDeleteId.value) return
  isLoading.value = true
  error.value = null
  try {
    await api.deleteMhpcMastersAppealReason(reasonToDeleteId.value)
    await fetchAppealReasons(pagination.value.currentPage)
    closeDeleteModal()
  } catch (err) {
    error.value = 'Failed to delete appeal reason'
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  reasonToDeleteId.value = null
}

// Handle page change
const changePage = async (page) => {
  await fetchAppealReasons(page)
}

// Helper functions
const editReason = (reason) => {
  editingReason.value = reason
  formData.value = {
    appeal_name: reason.appeal_name,
    description: reason.description,
  }
  // showForm.value = true // No need to show/hide form, it's always visible
}

const resetForm = () => {
  formData.value = {
    appeal_name: '',
    description: '',
  }
  editingReason.value = null
  // showForm.value = false // Removed showForm update
}

// Compute total pages
const totalPages = () => {
  return Math.ceil(pagination.value.count / 10)
}

// Lifecycle hooks
onMounted(() => {
  fetchAppealReasons()
})
</script>

<style scoped></style>
