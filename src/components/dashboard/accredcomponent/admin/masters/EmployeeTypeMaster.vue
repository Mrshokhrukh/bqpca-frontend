<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">Employee Type Management</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column - Add/Edit Form -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">
            {{ isEditing ? 'Edit Employee Type' : 'Add New Employee Type' }}
          </h2>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Employee Type Name</label>
              <input
                v-model="formData.employee_type_name"
                type="text"
                class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Regular, Contract, Visiting"
                required
                :maxlength="200"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                v-model="formData.description"
                rows="4"
                class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a brief description of the employee type"
                :maxlength="500"
              ></textarea>
            </div>

            <div class="flex justify-end space-x-3">
              <button
                v-if="isEditing"
                type="button"
                @click="cancelEdit"
                class="px-4 py-2 text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400"
                :disabled="isLoading"
              >
                <span v-if="isLoading">{{ isEditing ? 'Updating...' : 'Adding...' }}</span>
                <span v-else>{{ isEditing ? 'Update Type' : 'Add Type' }}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Right Column - Data Table -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div class="mb-6 space-y-4">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-slate-900">Employee Types List</h2>
              <span class="text-sm text-slate-500">
                {{ pagination.count }} Type{{ pagination.count !== 1 ? 's' : '' }}
              </span>
            </div>
             <!-- Error Alert -->
            <div v-if="error" class="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {{ error }}
            </div>
          </div>

          <div v-if="isLoading && !employeeTypes.length" class="text-center py-8">
             <p class="text-slate-500">Loading employee types...</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-slate-200">
                <tr v-for="type in employeeTypes" :key="type.id" class="hover:bg-slate-50">
                  <td class="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{{ type.employee_type_name }}</td>
                  <td class="px-6 py-4 text-slate-700">
                    <p class="line-clamp-2">{{ type.description }}</p>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end gap-2">
                       <button @click="startEdit(type)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-md" title="Edit Type">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button @click="openDeleteModal(type)" class="p-2 text-red-600 hover:bg-red-50 rounded-md" title="Delete Type">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!isLoading && employeeTypes.length === 0">
                  <td colspan="3" class="px-6 py-4 text-center text-slate-500">No employee types found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal using Radix -->
    <AlertDialogRoot :open="isDeleteModalOpen" @update:open="isDeleteModalOpen = $event">
      <AlertDialogContent class="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none z-50">
        <AlertDialogTitle class="text-xl font-semibold text-slate-900 mb-2">Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription class="text-slate-600 mb-6">
          This action cannot be undone. This will permanently delete the employee type: <strong class="text-slate-800">"{{ typeToDelete?.employee_type_name }}"</strong>.
        </AlertDialogDescription>
        <div class="flex justify-end gap-4">
          <AlertDialogCancel class="px-4 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200" @click="closeDeleteModal">Cancel</AlertDialogCancel>
          <AlertDialogAction class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700" @click="confirmDelete">Delete</AlertDialogAction>
        </div>
      </AlertDialogContent>
      <AlertDialogOverlay class="fixed inset-0 bg-black/50 z-40" />
    </AlertDialogRoot>
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
const employeeTypes = ref([])
const isLoading = ref(false)
const error = ref(null)
const formData = ref({
  employee_type_name: '',
  description: '',
})
const isEditing = ref(false)
const editingId = ref(null)

const isDeleteModalOpen = ref(false)
const typeToDelete = ref(null)

const pagination = ref({
  count: 0,
  next: null,
  previous: null,
  currentPage: 1
})

// --- API Methods ---
const fetchEmployeeTypes = async () => {
  isLoading.value = true
  error.value = null
  try {
    const response = await apiService.getMastersEmployeeTypes()
    employeeTypes.value = response.data.results
    pagination.value.count = response.data.count
  } catch (err) {
    error.value = "Failed to load employee types. Please try again."
    console.error('Error fetching employee types:', err)
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  isLoading.value = true
  error.value = null
  try {
    if (isEditing.value) {
      await apiService.updateMastersEmployeeType(editingId.value, formData.value)
    } else {
      await apiService.createMastersEmployeeType(formData.value)
    }
    await fetchEmployeeTypes()
    resetForm()
  } catch (err) {
    error.value = "Failed to save employee type. You may not have permission (Admin required)."
    console.error('Error saving employee type:', err)
  } finally {
    isLoading.value = false
  }
}

const confirmDelete = async () => {
  if (!typeToDelete.value) return
  isLoading.value = true
  error.value = null
  try {
    await apiService.deleteMastersEmployeeType(typeToDelete.value.id)
    await fetchEmployeeTypes()
    closeDeleteModal()
  } catch (err) {
    error.value = "Failed to delete employee type. It might be in use by other records."
    console.error('Error deleting employee type:', err)
  } finally {
    isLoading.value = false
  }
}

// --- Lifecycle Hook ---
onMounted(() => {
  fetchEmployeeTypes()
})

// --- Helper Methods ---
const startEdit = (type) => {
  isEditing.value = true
  editingId.value = type.id
  formData.value = { ...type }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelEdit = () => {
  resetForm()
}

const resetForm = () => {
  isEditing.value = false
  editingId.value = null
  formData.value = {
    employee_type_name: '',
    description: '',
  }
}

const openDeleteModal = (type) => {
  typeToDelete.value = type
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  typeToDelete.value = null
}
</script>

<style scoped>
/* Scoped styles if needed */
</style>