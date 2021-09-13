<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">Qualifications Management</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column - Add/Edit Form -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">
            {{ isEditing ? 'Edit Qualification' : 'Add New Qualification' }}
          </h2>
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label for="qualificationName" class="block text-sm font-medium text-slate-700"
                  >Qualification Name</label
                >
                <input
                  type="text"
                  id="qualificationName"
                  v-model="formData.qualification_name"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., PhD, Masters, Bachelors"
                  required
                />
              </div>
              <div>
                <label
                  for="qualificationDescription"
                  class="block text-sm font-medium text-slate-700"
                  >Description</label
                >
                <textarea
                  id="qualificationDescription"
                  v-model="formData.description"
                  rows="4"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter a brief description"
                ></textarea>
              </div>
              <div class="flex gap-3">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                >
                  <span v-if="isLoading">Saving...</span>
                  <span v-else>{{ isEditing ? 'Update Qualification' : 'Add Qualification' }}</span>
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

        <!-- Right Column - Qualifications List -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div class="mb-6 space-y-4">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-slate-900">Qualifications List</h2>
              <span class="text-sm text-slate-500">
                {{ filteredQualifications.length }} qualification{{
                  filteredQualifications.length !== 1 ? 's' : ''
                }}
              </span>
            </div>

            <!-- Search Bar -->
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search by name or description..."
                class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                class="absolute left-3 top-2.5 h-5 w-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <!-- Error Alert -->
          <div v-if="error" class="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {{ error }}
          </div>

          <!-- Qualifications Grid -->
          <div class="space-y-4 mb-6">
            <TransitionGroup name="list">
              <div
                v-for="qualification in paginatedQualifications"
                :key="qualification.id"
                class="p-4 border border-slate-200 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-colors duration-200"
              >
                <div class="flex justify-between items-start gap-4">
                  <div>
                    <h3 class="font-medium text-slate-900">
                      {{ qualification.qualification_name }}
                    </h3>
                    <p class="text-sm text-slate-600 mt-1">{{ qualification.description }}</p>
                  </div>
                  <div class="flex gap-2 flex-shrink-0">
                    <button
                      @click="startEdit(qualification)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                      title="Edit Qualification"
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
                      @click="openDeleteModal(qualification)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      title="Delete Qualification"
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
                </div>
              </div>
            </TransitionGroup>

            <!-- Loading & Empty State -->
            <div v-if="isLoading" class="text-center py-8">
              <p class="text-slate-500">Loading qualifications...</p>
            </div>
            <div v-else-if="filteredQualifications.length === 0" class="text-center py-8">
              <p class="text-slate-500">No qualifications found. Try a different search.</p>
            </div>
          </div>

          <!-- Pagination -->
          <div
            v-if="totalPages > 1"
            class="flex justify-center gap-2"
          >
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1 rounded border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Previous
            </button>
            <span class="px-3 py-1 text-sm text-slate-600">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 rounded border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Confirmation modal -->
      <AlertDialogRoot :open="isDeleteModalOpen" @update:open="isDeleteModalOpen = $event">
        <AlertDialogContent
          class="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none z-50"
        >
          <AlertDialogTitle class="text-xl font-semibold text-slate-900 mb-2">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription class="text-slate-600 mb-6">
            This action cannot be undone. This will permanently delete the qualification:
            <strong class="text-slate-800">"{{ qualificationToDelete?.qualification_name }}"</strong>.
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
              @click="confirmDelete"
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
import { ref, computed, watch, onMounted } from 'vue'
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
const qualifications = ref([])
const isLoading = ref(false)
const error = ref(null)
const formData = ref({
  id: null,
  qualification_name: '',
  description: '',
})
const isEditing = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

const isDeleteModalOpen = ref(false)
const qualificationToDelete = ref(null)

// --- API Methods ---

// Fetch all qualifications
const fetchQualifications = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await apiService.getMastersQualifications()
    qualifications.value = response.data.results
  } catch (err) {
    error.value = 'Failed to fetch qualifications. Please try again.'
    console.error('Error fetching qualifications:', err)
  } finally {
    isLoading.value = false
  }
}

// Handle form submission for both create and update
const handleSubmit = async () => {
  isLoading.value = true
  error.value = null
  try {
    if (isEditing.value) {
      await apiService.updateMastersQualification(formData.value.id, formData.value)
    } else {
      await apiService.createMastersQualification(formData.value)
    }
    // REFACTORED: Always re-fetch the list for data consistency
    await fetchQualifications()
    resetForm()
  } catch (err) {
    error.value = 'Failed to save the qualification. You may not have permission (Admin required).'
    console.error('Error saving qualification:', err)
  } finally {
    isLoading.value = false
  }
}

// Handle delete confirmation
const confirmDelete = async () => {
  if (!qualificationToDelete.value) return
  isLoading.value = true
  error.value = null
  try {
    await apiService.deleteMastersQualification(qualificationToDelete.value.id)
    // REFACTORED: Re-fetch the list instead of manually splicing the array
    await fetchQualifications()
    closeDeleteModal()
  } catch (err) {
    error.value = 'Failed to delete the qualification. It might be linked to other data.'
    console.error('Error deleting qualification:', err)
  } finally {
    isLoading.value = false
  }
}

// --- Lifecycle Hook ---
onMounted(() => {
  fetchQualifications()
})

// --- Computed Properties for UI ---
const filteredQualifications = computed(() => {
  if (!searchQuery.value) {
    return qualifications.value
  }
  const query = searchQuery.value.toLowerCase()
  return qualifications.value.filter(
    (q) =>
      q.qualification_name.toLowerCase().includes(query) ||
      (q.description && q.description.toLowerCase().includes(query))
  )
})

const totalPages = computed(() => {
  return Math.ceil(filteredQualifications.value.length / itemsPerPage)
})

const paginatedQualifications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredQualifications.value.slice(start, end)
})

// --- Helper Methods ---
const startEdit = (qualification) => {
  formData.value = { ...qualification }
  isEditing.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelEdit = () => {
  resetForm()
}

const openDeleteModal = (qualification) => {
  qualificationToDelete.value = qualification
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  qualificationToDelete.value = null
}

const resetForm = () => {
  formData.value = {
    id: null,
    qualification_name: '',
    description: '',
  }
  isEditing.value = false
}

// Watch for search query changes to reset pagination to the first page
watch(searchQuery, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.list-move {
  transition: transform 0.3s ease;
}
</style>