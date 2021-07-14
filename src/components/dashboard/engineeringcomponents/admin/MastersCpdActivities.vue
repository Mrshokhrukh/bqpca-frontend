<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">
        Engineering CPD Activities Management
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column - Add/Edit Form -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">
            {{ isEditing ? 'Edit CPD Activity' : 'Add New CPD Activity' }}
          </h2>

          <!-- Show error messages if any -->
          <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-red-700 text-sm">{{ errorMessage }}</p>
          </div>

          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label for="cpd_activity_name" class="block text-sm font-medium text-slate-700">CPD Activity
                  Name</label>
                <input type="text" id="cpd_activity_name" v-model="formData.cpd_activity_name"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter CPD activity name" required />
              </div>
              <div>
                <label for="cpd_activity_description"
                  class="block text-sm font-medium text-slate-700">Description</label>
                <!-- FINAL CORRECTION in template: v-model now uses the full field name -->
                <textarea id="cpd_activity_description" v-model="formData.cpd_activity_description" rows="4"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter CPD activity description" required></textarea>
              </div>
              <div class="flex gap-3">
                <button type="submit" :disabled="isSubmitting"
                  class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ isSubmitting ? 'Saving...' : (isEditing ? 'Update Activity' : 'Add Activity') }}
                </button>
                <button v-if="isEditing" type="button" @click="cancelEdit"
                  class="py-2 px-4 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200">
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
              <h2 class="text-xl font-semibold text-slate-900">CPD Activities List</h2>
              <span class="text-sm text-slate-500">
                {{ cpdActivities.length }} Activity{{ cpdActivities.length !== 1 ? 's' : '' }}
              </span>
            </div>
          </div>

          <!-- CPD Activities List -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                    CPD Activity Name
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                    Description
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 bg-white">
                <tr v-for="activity in paginatedActivities" :key="activity.id"
                  class="hover:bg-blue-50/30 transition-colors duration-200">
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-900">
                    {{ activity.cpd_activity_name }}
                  </td>
                  <td class="px-3 py-4 text-sm text-slate-700">
                    <div class="max-w-xs truncate">
                      {{ activity.cpd_activity_description }}
                    </div>
                  </td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div class="flex justify-end gap-2">
                      <button @click="editActivity(activity)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-md">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button @click="confirmDelete(activity)" class="p-2 text-red-600 hover:bg-red-50 rounded-md">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="cpdActivities.length === 0">
                  <td colspan="3" class="px-6 py-4 text-center text-slate-500">
                    No CPD activities found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Pagination code omitted for brevity -->
        </div>
      </div>

      <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold mb-4 text-slate-900">Delete CPD Activity</h3>
          <p class="mb-6 text-slate-700">
            Are you sure you want to delete "<span class="font-semibold">{{ activityToDelete?.cpd_activity_name
              }}</span>"?
            This action cannot be undone.
          </p>
          <div class="flex justify-end gap-3">
            <button @click="cancelDelete" class="py-2 px-4 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200">
              Cancel
            </button>
            <button @click="deleteActivity" class="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import apiServices from '@/services/services'


const cpdActivities = ref([])

const formData = ref({
  cpd_activity_name: '',
  cpd_activity_description: ''
})
const isEditing = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')
const editingId = ref(null)
const isDeleteModalOpen = ref(false)
const activityToDelete = ref(null)
const currentPage = ref(1)
const itemsPerPage = 5

// Methods
const fetchActivities = async (page = 1) => {
  try {
    const response = await apiServices.getEpcMastersCpdActivities()
    cpdActivities.value = response.data.results
    currentPage.value = page
  } catch (error) {
    console.error('Error fetching CPD activities:', error)
    errorMessage.value = 'Failed to fetch CPD activities'
  }
}

const handleSubmit = async () => {
  if (isSubmitting.value) return

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    if (isEditing.value) {
      await apiServices.updateEpcMastersCpdActivities(editingId.value, formData.value)
    } else {
      await apiServices.createEpcMastersCpdActivities(formData.value)
    }

    resetForm()
    await fetchActivities()
  } catch (error) {
    console.error('Error saving CPD activity:', error)
    if (error.response?.data) {
      if (typeof error.response.data === 'object') {
        const errors = Object.entries(error.response.data)
          .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value.join(', ')}`)
        errorMessage.value = errors.join('; ')
      } else {
        errorMessage.value = error.response.data.detail || 'Failed to save CPD activity'
      }
    } else {
      errorMessage.value = 'Failed to save CPD activity'
    }
  } finally {
    isSubmitting.value = false
  }
}

const editActivity = (activity) => {
  // Now the mapping is a direct 1-to-1 copy because the field names match
  formData.value = {
    cpd_activity_name: activity.cpd_activity_name,
    cpd_activity_description: activity.cpd_activity_description
  }
  isEditing.value = true
  editingId.value = activity.id
  errorMessage.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelEdit = () => {
  resetForm()
}

const resetForm = () => {

  formData.value = {
    cpd_activity_name: '',
    cpd_activity_description: ''
  }
  isEditing.value = false
  editingId.value = null
  errorMessage.value = ''
}

const confirmDelete = (activity) => {
  activityToDelete.value = activity
  isDeleteModalOpen.value = true
}

const cancelDelete = () => {
  isDeleteModalOpen.value = false
  activityToDelete.value = null
}

const deleteActivity = async () => {
  if (!activityToDelete.value) return
  try {
    await apiServices.deleteEpcMastersCpdActivities(activityToDelete.value.id)
    cancelDelete()
    await fetchActivities()
  } catch (error) {
    console.error('Error deleting CPD activity:', error)
    errorMessage.value = 'Failed to delete CPD activity'
    cancelDelete()
  }
}


const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return cpdActivities.value.slice(start, end)
})

// Lifecycle
onMounted(() => {
  fetchActivities()
})
</script>
