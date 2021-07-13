<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">
        Engineering COGS Agencies Management
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column - Add/Edit Form -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">
            {{ isEditing ? 'Edit Engineering COGS Agency' : 'Add New Engineering COGS Agency' }}
          </h2>

          <!-- Show error messages if any -->
          <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-red-700 text-sm">{{ errorMessage }}</p>
          </div>

          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label for="agencyName" class="block text-sm font-medium text-slate-700"
                  >Agency Name</label
                >
                <input
                  type="text"
                  id="agencyName"
                  v-model="formData.name"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter agency name"
                  required
                />
              </div>

              <div class="flex gap-3">
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isSubmitting ? 'Saving...' : isEditing ? 'Update Agency' : 'Add Agency' }}
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

        <!-- Right Column - COGS Agencies List -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div class="mb-6 space-y-4">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-slate-900">Engineering COGS Agencies List</h2>
              <span class="text-sm text-slate-500">
                {{ filteredAgencies.length }} Agency{{ filteredAgencies.length !== 1 ? 's' : '' }}
              </span>
            </div>

            <!-- Search Bar -->
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search Agencies..."
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

          <!-- Agencies Grid -->
          <div class="space-y-4 mb-6">
            <TransitionGroup name="list">
              <div
                v-for="agency in paginatedAgencies"
                :key="agency.id"
                class="p-4 border border-slate-200 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-colors duration-200"
              >
                <div class="flex justify-between items-start gap-4">
                  <div>
                    <h3 class="font-medium text-slate-900">{{ agency.name }}</h3>
                    <p class="text-sm text-slate-500 mt-1">
                      Created: {{ formatDate(agency.created_at) }}
                    </p>
                  </div>
                  <div class="flex gap-2">
                    <button
                      @click="startEdit(agency)"
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
                      @click="openDeleteModal(agency)"
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
                </div>
              </div>
            </TransitionGroup>

            <!-- Empty State -->
            <div v-if="filteredAgencies.length === 0" class="text-center py-8">
              <p class="text-slate-500">No agencies found</p>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="filteredAgencies.length > itemsPerPage" class="flex justify-center gap-2">
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
            This action cannot be undone. This will permanently delete the agency "{{
              agencyToDelete?.name
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
const agencies = ref([])
const formData = ref({
  id: null,
  name: '',
})
const isEditing = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 5

const isDeleteModalOpen = ref(false)
const agencyToDelete = ref(null)

// Utility function to format date
const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return 'Invalid Date'
  }
}

// Fetch agencies on component mount
const fetchAgencies = async () => {
  try {
    errorMessage.value = ''
    const response = await apiServices.getEpcCogsAgencies()

    // Check if response.data.results exists and is an array
    if (Array.isArray(response.data.results)) {
      agencies.value = response.data.results
    } else if (Array.isArray(response.data)) {
      agencies.value = response.data
    } else {
      agencies.value = [] // Initialize to an empty array to prevent further errors
    }
  } catch (error) {
    console.error('Error fetching agencies:', error)
    errorMessage.value = `Failed to fetch agencies: ${error.message}`
    agencies.value = [] // Initialize to an empty array in case of error
  }
}

onMounted(() => {
  fetchAgencies()
})

// Computed
const filteredAgencies = computed(() => {
  return agencies.value.filter((agency) => {
    const query = searchQuery.value.toLowerCase()
    return agency.name.toLowerCase().includes(query)
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredAgencies.value.length / itemsPerPage)
})

const paginatedAgencies = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredAgencies.value.slice(start, end)
})

// Methods
const handleSubmit = async () => {
  if (isSubmitting.value) return

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    if (isEditing.value) {
      const response = await apiServices.updateEpcCogsAgency(formData.value.id, formData.value)
      const index = agencies.value.findIndex((agency) => agency.id === formData.value.id)
      if (index !== -1) {
        agencies.value[index] = response.data
      }
    } else {
      const response = await apiServices.createEpcCogsAgency(formData.value)
      agencies.value.push(response.data)
    }
    resetForm()
  } catch (error) {
    console.error('Error saving agency:', error)
    if (error.response?.data) {
      // Handle specific field errors from the backend
      if (typeof error.response.data === 'object') {
        const errors = Object.values(error.response.data).flat()
        errorMessage.value = errors.join(', ')
      } else {
        errorMessage.value = error.response.data || 'Failed to save agency'
      }
    } else {
      errorMessage.value = error.message || 'Failed to save agency'
    }
  } finally {
    isSubmitting.value = false
  }
}

const startEdit = (agency) => {
  formData.value = { ...agency }
  isEditing.value = true
  errorMessage.value = ''
}

const cancelEdit = () => {
  resetForm()
}

const openDeleteModal = (agency) => {
  agencyToDelete.value = agency
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  agencyToDelete.value = null
}

const confirmDelete = async () => {
  if (!agencyToDelete.value) return

  try {
    await apiServices.deleteEpcCogsAgency(agencyToDelete.value.id)
    const index = agencies.value.findIndex((agency) => agency.id === agencyToDelete.value.id)
    if (index !== -1) {
      agencies.value.splice(index, 1)
    }
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting agency:', error)
    errorMessage.value = 'Failed to delete agency'
  }
}

const resetForm = () => {
  formData.value = {
    id: null,
    name: '',
  }
  isEditing.value = false
  errorMessage.value = ''
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
