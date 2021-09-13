<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">Rating Category Management</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column - Add/Edit Form -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">
            {{ isEditing ? 'Edit Rating Category' : 'Add New Rating Category' }}
          </h2>
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label for="ratingCategoryName" class="block text-sm font-medium text-slate-700"
                  >Rating Category Name</label
                >
                <input
                  type="text"
                  id="ratingCategoryName"
                  v-model="formData.rating_category_name"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., A+, A, Not Accredited"
                  required
                />
              </div>
              <div>
                <label for="validityYears" class="block text-sm font-medium text-slate-700"
                  >Validity (Years)</label
                >
                <input
                  type="number"
                  id="validityYears"
                  v-model="formData.validity_years"
                  min="0"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 5, 3, 0"
                  required
                />
              </div>
              <div class="relative flex items-start">
                <div class="flex h-6 items-center">
                  <input
                    id="isAccreditingGrade"
                    v-model="formData.is_accrediting_grade"
                    type="checkbox"
                    class="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                  />
                </div>
                <div class="ml-3 text-sm leading-6">
                  <label for="isAccreditingGrade" class="font-medium text-slate-900"
                    >Is an Accrediting Grade?</label
                  >
                  <p class="text-slate-500">
                    Check if this grade means the institute is considered "Accredited".
                  </p>
                </div>
              </div>

              <div class="flex gap-3">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
                >
                  <span v-if="isLoading">Saving...</span>
                  <span v-else>{{ isEditing ? 'Update Rating' : 'Add Rating' }}</span>
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

        <!-- Right Column - Rating Categories List -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div class="mb-6 space-y-4">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-slate-900">Rating Categories</h2>
              <span class="text-sm text-slate-500">
                {{ filteredRatings.length }} Categorie{{
                  filteredRatings.length !== 1 ? 's' : ''
                }}
              </span>
            </div>
          </div>

          <div v-if="isLoading" class="text-center py-8">
            <p class="text-slate-500">Loading categories...</p>
          </div>

          <div v-else class="space-y-4 mb-6">
            <TransitionGroup name="list">
              <div
                v-for="rating in paginatedRatings"
                :key="rating.id"
                class="p-4 border border-slate-200 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-colors duration-200"
              >
                <div class="flex justify-between items-start gap-4">
                  <div>
                    <h3 class="font-medium text-slate-900">{{ rating.rating_category_name }}</h3>
                    <p class="text-sm text-slate-600 mt-1">
                      Validity: {{ rating.validity_years }} years
                    </p>
                    <p
                      class="mt-1 text-xs font-semibold px-2 py-0.5 rounded-full inline-block"
                      :class="
                        rating.is_accrediting_grade
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      "
                    >
                      {{ rating.is_accrediting_grade ? 'Accrediting Grade' : 'Non-Accrediting' }}
                    </p>
                  </div>
                  <div class="flex gap-2 flex-shrink-0">
                    <button
                      @click="startEdit(rating)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                      title="Edit Category"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002 2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      @click="openDeleteModal(rating)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      title="Delete Category"
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

            <div v-if="paginatedRatings.length === 0" class="text-center py-8">
               <p class="text-slate-500">No rating categories found.</p>
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
          This action cannot be undone. This will permanently delete the category:
          <strong class="text-slate-800">"{{ ratingToDelete?.rating_category_name }}"</strong>.
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
            Yes, Delete
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
      <AlertDialogOverlay class="fixed inset-0 bg-black/50 z-40" />
    </AlertDialogRoot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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

const ratings = ref([])
const isLoading = ref(false)
const formData = ref({
  id: null,
  rating_category_name: '',
  // CORRECTED: Use `validity_years` for the numeric input
  validity_years: 0,
  // ADDED: Include the boolean field with a default
  is_accrediting_grade: true,
})
const isEditing = ref(false)
const currentPage = ref(1)
const itemsPerPage = 10

const isDeleteModalOpen = ref(false)
const ratingToDelete = ref(null)

// Fetch ratings on mount
const fetchRatings = async () => {
  isLoading.value = true
  try {
    const response = await apiService.getMastersRatingCategories()
    ratings.value = response.data.results
  } catch (error) {
    console.error('Error fetching ratings:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchRatings()
})

const handleSubmit = async () => {
  isLoading.value = true
  try {
    // Prepare the payload to match the backend model
    const payload = {
      rating_category_name: formData.value.rating_category_name,
      validity_years: Number(formData.value.validity_years) || 0,
      // CORRECTED: Automatically create the string 'validity' field
      validity: `${formData.value.validity_years} Years`,
      is_accrediting_grade: formData.value.is_accrediting_grade,
    }

    if (isEditing.value) {
      await apiService.updateMastersRatingCategory(formData.value.id, payload)
    } else {
      await apiService.createMastersRatingCategory(payload)
    }
    await fetchRatings()
    resetForm()
  } catch (error)
  {
    console.error('Error saving rating category:', error)
    // Add user-facing error message here
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  formData.value = {
    id: null,
    rating_category_name: '',
    validity_years: 0,
    is_accrediting_grade: true,
  }
  isEditing.value = false
}

const startEdit = (rating) => {
  // Ensure all fields from the rating object are copied
  formData.value = { ...rating }
  isEditing.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelEdit = () => {
  resetForm()
}

// --- ADDED: Delete confirmation flow ---
const openDeleteModal = (rating) => {
  ratingToDelete.value = rating
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  ratingToDelete.value = null
  isDeleteModalOpen.value = false
}

const confirmDelete = async () => {
  if (!ratingToDelete.value) return
  isLoading.value = true
  try {
    await apiService.deleteMastersRatingCategory(ratingToDelete.value.id)
    await fetchRatings()
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting rating category:', error)
  } finally {
    isLoading.value = false
  }
}
// --- End of delete flow ---

const filteredRatings = computed(() => ratings.value)
const totalPages = computed(() => Math.ceil(filteredRatings.value.length / itemsPerPage))
const paginatedRatings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredRatings.value.slice(start, start + itemsPerPage)
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
  transform: translateY(20px);
}
</style>