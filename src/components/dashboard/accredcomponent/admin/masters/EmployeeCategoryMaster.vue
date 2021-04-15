<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">
        Employee Category Management
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column - Add/Edit Form -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">
            {{ isEditing ? 'Edit Employee Category' : 'Add New Employee Category' }}
          </h2>
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label for="categoryName" class="block text-sm font-medium text-slate-700 mb-1"
                  >Category Name</label
                >
                <input
                  type="text"
                  id="categoryName"
                  v-model="formData.employee_category_name"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category name"
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
                  placeholder="Enter category description"
                  required
                ></textarea>
              </div>

              <div class="flex gap-3">
                <button
                  type="submit"
                  class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {{ isEditing ? 'Update Category' : 'Add Category' }}
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
              <h2 class="text-xl font-semibold text-slate-900">Employee Categories List</h2>
              <span class="text-sm text-slate-500">
                {{ categories.length }} Category{{ categories.length !== 1 ? 's' : '' }}
              </span>
            </div>
          </div>

          <!-- Categories Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                  >
                    Category Name
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
              <tbody class="bg-white divide-y divide-slate-200">
                <tr
                  v-for="category in categories"
                  :key="category.id"
                  class="hover:bg-blue-50/30 transition-colors duration-200"
                >
                  <td class="px-6 py-4 whitespace-nowrap font-medium text-slate-900">
                    {{ category.employee_category_name }}
                  </td>
                  <td class="px-6 py-4 text-slate-700">
                    <p class="line-clamp-2">{{ category.description }}</p>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <div class="flex justify-end gap-2">
                      <button
                        @click="editCategory(category)"
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
                        @click="openDeleteModal(category)"
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
                <tr v-if="categories.length === 0">
                  <td colspan="3" class="px-6 py-4 text-center text-slate-500">
                    No categories found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-6">
            <button
              @click="currentPage > 1 && fetchCategories(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 rounded border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Previous
            </button>
            <span class="px-3 py-1 text-sm text-slate-600">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              @click="currentPage < totalPages && fetchCategories(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 rounded border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Next
            </button>
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
            This action cannot be undone. This will permanently delete the employee category "{{
              categoryToDelete?.employee_category_name
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
              @click="deleteCategory"
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

// State
const categories = ref([])
const formData = ref({
  employee_category_name: '',
  description: '',
})
const isEditing = ref(false)
const editingId = ref(null)
const showDeleteModal = ref(false)
const deleteId = ref(null)
const currentPage = ref(1)
const totalPages = ref(1)
const isDeleteModalOpen = ref(false)
const categoryToDelete = ref(null)

// Methods
const fetchCategories = async (page = 1) => {
  try {
    const response = await api.getMastersEmployeeCategories()
    categories.value = response.data.results
    totalPages.value = Math.ceil(response.data.count / 10) // Assuming 10 items per page
    currentPage.value = page
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await api.updateMastersEmployeeCategory(editingId.value, formData.value)
    } else {
      await api.createMastersEmployeeCategory(formData.value)
    }
    resetForm()
    fetchCategories()
  } catch (error) {
    console.error('Error saving category:', error)
  }
}

const editCategory = (category) => {
  formData.value = {
    employee_category_name: category.employee_category_name,
    description: category.description,
  }
  isEditing.value = true
  editingId.value = category.id
}

const cancelEdit = () => {
  resetForm()
}

const resetForm = () => {
  formData.value = {
    employee_category_name: '',
    description: '',
  }
  isEditing.value = false
  editingId.value = null
}

const openDeleteModal = (category) => {
  categoryToDelete.value = category
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  categoryToDelete.value = null
}

const confirmDelete = (id) => {
  deleteId.value = id
  showDeleteModal.value = true
}

const deleteCategory = async () => {
  if (!categoryToDelete.value) return
  try {
    await api.deleteMastersEmployeeCategory(categoryToDelete.value.id)
    const index = categories.value.findIndex((cat) => cat.id === categoryToDelete.value.id)
    if (index !== -1) {
      categories.value.splice(index, 1)
    }
    closeDeleteModal()
    fetchCategories()
  } catch (error) {
    console.error('Error deleting category:', error)
  }
}

// Lifecycle
onMounted(() => {
  fetchCategories()
})
</script>

<style scoped></style>
