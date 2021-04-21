<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">
        Mhpc Personnel Sub-Category Management
      </h1>

      <!-- Error/Success Messages -->
      <div v-if="errorMessage" class="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
        {{ successMessage }}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column - Add/Edit Form -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">
            {{ isEditing ? 'Edit Personnel Sub-Category' : 'Add New Personnel Sub-Category' }}
          </h2>
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label
                  for="subCategoryName"
                  class="block text-sm font-medium text-slate-700"
                  >Sub-Category Name</label
                >
                <input
                  type="text"
                  id="subCategoryName"
                  v-model="formData.sub_category_name"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter sub-category name"
                  required
                />
              </div>
              <div>
                <label
                  for="categoryId"
                  class="block text-sm font-medium text-slate-700"
                  >Personnel Category</label
                >
                <select
                  id="categoryId"
                  v-model="formData.category_id"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  :disabled="isLoading || !categories.length"
                >
                  <option value="" disabled>Select a category</option>
                  <option
                    v-for="category in categories"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.category_name }}
                  </option>
                </select>
                <p v-if="!categories.length && !isLoading" class="mt-1 text-sm text-red-600">
                  No categories available. Please add a category first.
                </p>
              </div>
              <div>
                <label
                  for="subCategoryDescription"
                  class="block text-sm font-medium text-slate-700"
                  >Description</label
                >
                <textarea
                  id="subCategoryDescription"
                  v-model="formData.description"
                  rows="4"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter sub-category description"
                  required
                ></textarea>
              </div>

              <div class="flex gap-3">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isLoading ? 'Processing...' : isEditing ? 'Update Sub-Category' : 'Add Sub-Category' }}
                </button>
                <button
                  v-if="isEditing"
                  type="button"
                  @click="cancelEdit"
                  class="py-2 px-4 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200"
                  :disabled="isLoading"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Right Column - Sub-Categories List -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div class="mb-6 space-y-4">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-slate-900">Personnel Sub-Categories List</h2>
              <span class="text-sm text-slate-500">
                {{ filteredSubCategories.length }} Sub-Category{{ filteredSubCategories.length !== 1 ? 'ies' : 'y' }}
              </span>
            </div>

            <!-- Search Bar -->
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search Sub-Categories..."
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

          <!-- Loading State -->
          <div v-if="isLoading && !subCategories.length" class="text-center py-8">
            <p class="text-slate-500">Loading sub-categories...</p>
          </div>

          <!-- Sub-Categories Grid -->
          <div v-else class="space-y-4 mb-6">
            <TransitionGroup name="list">
              <div
                v-for="subCategory in paginatedSubCategories"
                :key="subCategory.id"
                class="p-4 border border-slate-200 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-colors duration-200"
              >
                <div class="flex justify-between items-start gap-4">
                  <div>
                    <h3 class="font-medium text-slate-900">{{ subCategory.sub_category_name }}</h3>
                    <p class="text-sm text-slate-600 mt-1">{{ subCategory.description }}</p>
                    <p class="text-sm text-slate-600 mt-1">
                      Category: {{ getCategoryName(subCategory.category_id) }}
                    </p>
                  </div>
                  <div class="flex gap-2">
                    <button
                      @click="startEdit(subCategory)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                      :disabled="isLoading"
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
                      @click="openDeleteModal(subCategory)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      :disabled="isLoading"
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

            <!-- Empty State -->
            <div v-if="filteredSubCategories.length === 0" class="text-center py-8">
              <p class="text-slate-500">No sub-categories found</p>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="filteredSubCategories.length > itemsPerPage" class="flex justify-center gap-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1 || isLoading"
              class="px-3 py-1 rounded border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Previous
            </button>
            <span class="px-3 py-1 text-sm text-slate-600">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages || isLoading"
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
            This action cannot be undone. This will permanently delete the sub-category "{{
              subCategoryToDelete?.sub_category_name
            }}".
          </AlertDialogDescription>
          <div class="flex justify-end gap-4">
            <AlertDialogCancel
              class="px-4 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
              @click="closeDeleteModal"
              :disabled="isLoading"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              @click="confirmDelete"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Deleting...' : 'Delete' }}
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
import apiServices from '@/services/services'
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
const subCategories = ref([])
const categories = ref([])
const formData = ref({
  id: null,
  sub_category_name: '',
  description: '',
  category_id: null,
})
const isEditing = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 5
const isDeleteModalOpen = ref(false)
const subCategoryToDelete = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Fetch categories
const fetchCategories = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await apiServices.getMhpcMastersPersonnelCategories()
    console.log('Categories API Response:', response.data) // DEBUG: Inspect the data
    const data = response.data.results || response.data || []
    if (Array.isArray(data)) {
      categories.value = data
    } else {
      console.error('Categories API did not return an array.')
      categories.value = []
      errorMessage.value = 'Failed to load categories: Invalid data format.'
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    categories.value = []
    errorMessage.value = 'Failed to load categories. Please try again later.'
  } finally {
    isLoading.value = false
  }
}

// Fetch sub-categories
const fetchSubCategories = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const response = await apiServices.getMhpcMastersPersonnelSubCategories()
    console.log('Sub-Categories API Response:', response.data) // DEBUG: Inspect the data
    const data = response.data.results || response.data || []
    if (Array.isArray(data)) {
      subCategories.value = data
    } else {
      console.error('Sub-Categories API did not return an array.')
      subCategories.value = []
      errorMessage.value = 'Failed to load sub-categories: Invalid data format.'
    }
  } catch (error) {
    console.error('Error fetching sub-categories:', error)
    subCategories.value = []
    errorMessage.value = 'Failed to load sub-categories. Please try again later.'
  } finally {
    isLoading.value = false
  }
}

// Fetch data on component mount
onMounted(async () => {
  await Promise.all([fetchCategories(), fetchSubCategories()])
})

// Computed
const filteredSubCategories = computed(() => {
  return subCategories.value.filter((subCategory) => {
    const query = searchQuery.value.toLowerCase()
    return (
      subCategory.sub_category_name.toLowerCase().includes(query) ||
      subCategory.description.toLowerCase().includes(query)
    )
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredSubCategories.value.length / itemsPerPage)
})

const paginatedSubCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredSubCategories.value.slice(start, end)
})

// Get category name by ID for display
const getCategoryName = (categoryId) => {
  const category = categories.value.find((cat) => cat.id === categoryId)
  return category ? category.category_name : 'Unknown Category'
}

// Methods
const handleSubmit = async () => {
  if (!formData.value.sub_category_name.trim()) {
    errorMessage.value = 'Sub-category name is required.'
    return
  }
  if (!formData.value.category_id) {
    errorMessage.value = 'Please select a category.'
    return
  }
  if (!formData.value.description.trim()) {
    errorMessage.value = 'Description is required.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    if (isEditing.value) {
      const response = await apiServices.updateMhpcMastersPersonnelSubCategory(
        formData.value.id,
        formData.value,
      )
      const index = subCategories.value.findIndex((dt) => dt.id === formData.value.id)
      if (index !== -1) {
        subCategories.value[index] = response.data
      }
      successMessage.value = 'Sub-category updated successfully.'
    } else {
      const response = await apiServices.createMhpcMastersPersonnelSubCategory(formData.value)
      subCategories.value.push(response.data)
      successMessage.value = 'Sub-category added successfully.'
    }
    resetForm()
  } catch (error) {
    console.error('Error saving sub-category:', error)
    errorMessage.value = `Failed to ${isEditing.value ? 'update' : 'add'} sub-category. Please try again.`
  } finally {
    isLoading.value = false
  }
}

const startEdit = (subCategory) => {
  formData.value = { ...subCategory }
  isEditing.value = true
  errorMessage.value = ''
  successMessage.value = ''
}

const cancelEdit = () => {
  resetForm()
}

const openDeleteModal = (subCategory) => {
  subCategoryToDelete.value = subCategory
  isDeleteModalOpen.value = true
  errorMessage.value = ''
  successMessage.value = ''
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  subCategoryToDelete.value = null
}

const confirmDelete = async () => {
  if (!subCategoryToDelete.value) return

  isLoading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    await apiServices.deleteMhpcMastersPersonnelSubCategory(subCategoryToDelete.value.id)
    const index = subCategories.value.findIndex((dt) => dt.id === subCategoryToDelete.value.id)
    if (index !== -1) {
      subCategories.value.splice(index, 1)
    }
    successMessage.value = 'Sub-category deleted successfully.'
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting sub-category:', error)
    errorMessage.value = 'Failed to delete sub-category. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  formData.value = {
    id: null,
    sub_category_name: '',
    description: '',
    category_id: null,
  }
  isEditing.value = false
  errorMessage.value = ''
  successMessage.value = ''
}

// Watch for search query changes to reset pagination
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
