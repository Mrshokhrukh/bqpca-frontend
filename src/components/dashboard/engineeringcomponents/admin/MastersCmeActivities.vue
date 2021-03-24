<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">Engineering CME Activities Management</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column - Add/Edit Form -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">
            {{ isEditing ? 'Edit CME Activity' : 'Add New CME Activity' }}
          </h2>
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label for="cmeActivityName" class="block text-sm font-medium text-slate-700">CME
                  Activity Name</label>
                <input type="text" id="cmeActivityName" v-model="formData.cme_activity_name"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter CME activity name" required />
              </div>
              <div>
                <label for="cmeActivityDescription" class="block text-sm font-medium text-slate-700">Description</label>
                <textarea id="cmeActivityDescription" v-model="formData.cme_activity_description" rows="4"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter CME activity description" required></textarea>
              </div>
              <div class="flex gap-3">
                <button type="submit"
                  class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  {{ isEditing ? 'Update Activity' : 'Add Activity' }}
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
              <h2 class="text-xl font-semibold text-slate-900">CME Activities List</h2>
              <span class="text-sm text-slate-500">
                {{ cmeActivities.length }} Activity{{ cmeActivities.length !== 1 ? 's' : '' }}
              </span>
            </div>
          </div>

          <!-- CME Activities List -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                    CME Activity Name
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
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-900">{{
              activity.cme_activity_name }}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-700">{{
              activity.cme_activity_description }}</td>
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
                <tr v-if="cmeActivities.length === 0">
                  <td colspan="4" class="px-6 py-4 text-center text-slate-500">
                    No CME activities found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-6">
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

      <!-- Delete Confirmation Modal -->
      <AlertDialogRoot :open="isDeleteModalOpen" @update:open="isDeleteModalOpen = $event">
        <AlertDialogContent
          class="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none z-50">
          <AlertDialogTitle class="text-xl font-semibold text-slate-900 mb-2">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription class="text-slate-600 mb-6">
            This action cannot be undone. This will permanently delete the CME activity
            "{{ activityToDelete?.cme_activity_name }}".
          </AlertDialogDescription>
          <div class="flex justify-end gap-4">
            <AlertDialogCancel class="px-4 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
              @click="cancelDelete">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              @click="deleteActivity">
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
import { ref, onMounted, computed } from 'vue'
import apiServices from '@/services/services'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogRoot,
  AlertDialogTitle,
} from 'radix-vue';

// State
const cmeActivities = ref([])
const formData = ref({
  cme_activity_name: '',
  cme_activity_description: ''
})
const isEditing = ref(false)
const editingId = ref(null)
const isDeleteModalOpen = ref(false)
const activityToDelete = ref(null)
const currentPage = ref(1);
const itemsPerPage = 5;

// Methods
const fetchActivities = async (page = 1) => {
  try {
    const response = await apiServices.getMastersCmeActivities()
    cmeActivities.value = response.data.results
    currentPage.value = page
  } catch (error) {
    console.error('Error fetching cme activities:', error)
  }
}

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await apiServices.updateMastersCmeActivity(editingId.value, formData.value)
    } else {
      await apiServices.createMastersCmeActivity(formData.value)

    }
    resetForm()
    fetchActivities()
  } catch (error) {
    console.error('Error saving cme activity:', error)
  }
}

const editActivity = (activity) => {
  formData.value = {
    cme_activity_name: activity.cme_activity_name,
    cme_activity_description: activity.cme_activity_description
  }
  isEditing.value = true
  editingId.value = activity.id
}

const cancelEdit = () => {
  resetForm()
}

const resetForm = () => {
  formData.value = {
    cme_activity_name: '',
    cme_activity_description: ''
  }
  isEditing.value = false
  editingId.value = null
}

const confirmDelete = (activity) => {
  activityToDelete.value = activity;
  isDeleteModalOpen.value = true;
};

const cancelDelete = () => {
  isDeleteModalOpen.value = false;
  activityToDelete.value = null;
};

const deleteActivity = async () => {
  if (!activityToDelete.value) return;
  try {
    await apiServices.deleteMastersCmeActivity(activityToDelete.value.id)
    const index = cmeActivities.value.findIndex(act => act.id === activityToDelete.value.id);
    if (index !== -1) {
      cmeActivities.value.splice(index, 1);
    }
    cancelDelete();
    fetchActivities()
  } catch (error) {
    console.error('Error deleting cme activity:', error)
  }
}

const totalPages = computed(() => {
  return Math.ceil(cmeActivities.value.length / itemsPerPage);
});

const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return cmeActivities.value.slice(start, end);
});

// Lifecycle
onMounted(() => {
  fetchActivities()
})
</script>

<style scoped></style>
