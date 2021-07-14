<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">
        Engineering Sub Categories Management
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column - Add/Edit Form -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">
            {{ isEditing ? 'Edit Sub Category' : 'Add New Sub Category' }}
          </h2>

          <!-- Show error messages if any -->
          <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-red-700 text-sm">{{ errorMessage }}</p>
          </div>

          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label for="category_name" class="block text-sm font-medium text-slate-700">Category Name</label>
                <select id="category_name" v-model="formData.category_name"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required>
                  <option value="" disabled>Select a Category</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.category_name }}
                  </option>
                </select>
              </div>
              <div>
                <label for="sub_category_name" class="block text-sm font-medium text-slate-700">Sub Category
                  Name</label>
                <input type="text" id="sub_category_name" v-model="formData.sub_category_name"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter sub category name" required />
              </div>
              <div>
                <label for="sub_category_description"
                  class="block text-sm font-medium text-slate-700">Description</label>
                <textarea id="sub_category_description" v-model="formData.sub_category_description" rows="4"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter description" required></textarea>
              </div>
              <div>
                <label for="registration_code" class="block text-sm font-medium text-slate-700">Registration
                  Code</label>
                <input type="text" id="registration_code" v-model="formData.registration_code"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter registration code" required />
              </div>
              <div>
                <label for="renewal_fee" class="block text-sm font-medium text-slate-700">Renewal Fee</label>
                <input type="number" id="renewal_fee" v-model.number="formData.renewal_fee"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter renewal fee" required />
              </div>

              <div class="flex gap-3">
                <button type="submit" :disabled="isSubmitting"
                  class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Sub Category' : 'Add Sub Category') }}
                </button>
                <button v-if="isEditing" type="button" @click="cancelEdit"
                  class="py-2 px-4 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200">
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Right Column - Sub Categories List -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div class="mb-6 space-y-4">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-slate-900">Sub Categories List</h2>
              <span class="text-sm text-slate-500">
                {{ filteredSubCategories.length }} Sub
                {{ filteredSubCategories.length !== 1 ? 'Categories' : 'Category' }}
              </span>
            </div>

            <!-- Search Bar -->
            <div class="relative">
              <input type="text" v-model="searchQuery" placeholder="Search Sub Categories..."
                class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <svg class="absolute left-3 top-2.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Sub Categories Grid -->
          <div class="space-y-4 mb-6">
            <TransitionGroup name="list">
              <div v-for="subCategory in paginatedSubCategories" :key="subCategory.id"
                class="p-4 border border-slate-200 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-colors duration-200">
                <div class="flex justify-between items-start gap-4">
                  <div>
                    <h3 class="font-medium text-slate-900">{{ subCategory.sub_category_name }}</h3>
                    <p class="text-sm text-slate-600 mt-1">
                      {{ subCategory.sub_category_description }}
                    </p>
                    <p class="text-sm text-slate-600 mt-1">
                      Category: {{ subCategory.personnel_category?.category_name || 'N/A' }}
                    </p>
                    <p class="text-sm text-slate-600 mt-1">
                      Code: {{ subCategory.registration_code }}
                    </p>
                    <p class="text-sm text-slate-600 mt-1">Fee: {{ subCategory.renewal_fee }}</p>
                  </div>
                  <div class="flex gap-2">
                    <button @click="startEdit(subCategory)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-md">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="openDeleteModal(subCategory)" class="p-2 text-red-600 hover:bg-red-50 rounded-md">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </TransitionGroup>

            <!-- Empty State -->
            <div v-if="filteredSubCategories.length === 0" class="text-center py-8">
              <p class="text-slate-500">No sub categories found</p>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="filteredSubCategories.length > itemsPerPage" class="flex justify-center gap-2">
            <button @click="currentPage--" :disabled="currentPage === 1"
              class="px-3 py-1 rounded border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50">
              Previous
            </button>
            <span class="px-3 py-1 text-sm text-slate-600">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button @click="currentPage++" :disabled="currentPage === totalPages"
              class="px-3 py-1 rounded border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50">
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Confirmation modal -->
      <AlertDialogRoot :open="isDeleteModalOpen" @update:open="isDeleteModalOpen = $event">
        <AlertDialogContent
          class="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none z-50">
          <AlertDialogTitle class="text-xl font-semibold text-slate-900 mb-2">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription class="text-slate-600 mb-6">
            This action cannot be undone. This will permanently delete the sub category "{{
              subCategoryToDelete?.sub_category_name
            }}".
          </AlertDialogDescription>
          <div class="flex justify-end gap-4">
            <AlertDialogCancel class="px-4 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
              @click="closeDeleteModal">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              @click="confirmDelete">
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
const categories = ref([]) // For the categories dropdown
const formData = ref({
  id: null,
  sub_category_name: '',
  sub_category_description: '',
  registration_code: '',
  renewal_fee: null,
  category_name: null, // Fixed: Use null instead of empty string
})
const isEditing = ref(false)
const isSubmitting = ref(false) // Added loading state
const errorMessage = ref('') // Added error handling
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 5

const isDeleteModalOpen = ref(false)
const subCategoryToDelete = ref(null)

// Fetch sub categories and categories on component mount
onMounted(async () => {
  fetchSubCategories()
  fetchCategories()
})

const fetchSubCategories = async () => {
  try {
    const response = await apiServices.getEpcMastersSubCategories()
    subCategories.value = response.data.results
  } catch (error) {
    console.error('Error fetching sub categories:', error)
    errorMessage.value = 'Failed to fetch sub categories'
  }
}

const fetchCategories = async () => {
  try {
    const response = await apiServices.getEpcMastersPersonnelCategories()
    categories.value = response.data.results
  } catch (error) {
    console.error('Error fetching categories:', error)
    errorMessage.value = 'Failed to fetch categories'
  }
}

// Computed
const filteredSubCategories = computed(() => {
  return subCategories.value.filter((subCategory) => {
    const query = searchQuery.value.toLowerCase()
    return (
      subCategory.sub_category_name.toLowerCase().includes(query) ||
      subCategory.sub_category_description.toLowerCase().includes(query) ||
      (subCategory.personnel_category?.category_name &&
        subCategory.personnel_category.category_name.toLowerCase().includes(query))
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

// Methods
const handleSubmit = async () => {
  if (isSubmitting.value) return

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    // Prepare form data - ensure category_name is a number
    const submitData = {
      sub_category_name: formData.value.sub_category_name,
      sub_category_description: formData.value.sub_category_description,
      registration_code: formData.value.registration_code,
      renewal_fee: parseFloat(formData.value.renewal_fee),
      category_name: parseInt(formData.value.category_name)
    }

    if (isEditing.value) {
      const response = await apiServices.updateEpcMastersSubCategory(
        formData.value.id,
        submitData,
      )
      const index = subCategories.value.findIndex((sc) => sc.id === formData.value.id)
      if (index !== -1) {
        subCategories.value[index] = response.data
      }
    } else {
      const response = await apiServices.createEpcMastersSubCategory(submitData)
      subCategories.value.push(response.data)
    }
    resetForm()
  } catch (error) {
    console.error('Error saving sub category:', error)
    if (error.response?.data) {
      // Handle specific field errors from the backend
      if (typeof error.response.data === 'object') {
        const errors = Object.values(error.response.data).flat()
        errorMessage.value = errors.join(', ')
      } else {
        errorMessage.value = error.response.data || 'Failed to save sub category'
      }
    } else {
      errorMessage.value = 'Failed to save sub category'
    }
  } finally {
    isSubmitting.value = false
  }
}

const startEdit = (subCategory) => {
  // Fixed: Properly map the personnel_category to category_name
  formData.value = {
    id: subCategory.id,
    sub_category_name: subCategory.sub_category_name,
    sub_category_description: subCategory.sub_category_description,
    registration_code: subCategory.registration_code,
    renewal_fee: subCategory.renewal_fee,
    category_name: subCategory.personnel_category?.id || null // Extract the ID from the nested object
  }
  isEditing.value = true
  errorMessage.value = '' // Clear any previous errors
}

const cancelEdit = () => {
  resetForm()
}

const openDeleteModal = (subCategory) => {
  subCategoryToDelete.value = subCategory
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  subCategoryToDelete.value = null
}

const confirmDelete = async () => {
  if (!subCategoryToDelete.value) return

  try {
    await apiServices.deleteEpcMastersSubCategory(subCategoryToDelete.value.id)
    const index = subCategories.value.findIndex((sc) => sc.id === subCategoryToDelete.value.id)
    if (index !== -1) {
      subCategories.value.splice(index, 1)
    }
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting sub category:', error)
    errorMessage.value = 'Failed to delete sub category'
  }
}

const resetForm = () => {
  formData.value = {
    id: null,
    sub_category_name: '',
    sub_category_description: '',
    registration_code: '',
    renewal_fee: null, // Fixed: Use null instead of empty string
    category_name: null, // Fixed: Use null instead of empty string
  }
  isEditing.value = false
  errorMessage.value = '' // Clear any errors when resetting
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