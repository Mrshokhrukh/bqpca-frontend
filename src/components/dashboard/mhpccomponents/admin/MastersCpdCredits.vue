<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">CPD Credits Management</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column - Add/Edit Form -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">
            {{ isEditing ? 'Edit CPD Credit' : 'Add New CPD Credit' }}
          </h2>
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
  <label for="cpdCreditDuration" class="block text-sm font-medium text-slate-700">
    CPD Credit Duration
  </label>
  <input
    type="time"
    id="cpdCreditDuration"
    v-model="formData.cpd_credit_duration"
    class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    required
  />
</div>
              <div>
                <label for="credits" class="block text-sm font-medium text-slate-700"
                  >Credits</label
                >
                <input
                  type="number"
                  id="credits"
                  v-model="formData.credits"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter credits"
                  required
                />
              </div>
              <div>
                <label for="cpdActivityName" class="block text-sm font-medium text-slate-700"
                  >CPD Activity Name</label
                >
                <select
                  id="cpdActivityName"
                  v-model="formData.cpd_activity_name"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="" disabled>Select Activity</option>
                  <option
                    v-for="activity in cpdActivitiesList"
                    :key="activity.id"
                    :value="activity.id"
                  >
                    {{ activity.cpd_activity_name }}
                  </option>
                </select>
              </div>
              <div class="flex gap-3">
                <button
                  type="submit"
                  class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {{ isEditing ? 'Update Credit' : 'Add Credit' }}
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
              <h2 class="text-xl font-semibold text-slate-900">CPD Credits List</h2>
              <span class="text-sm text-slate-500">
                {{ cpdCredits.length }} Credit{{ cpdCredits.length !== 1 ? 's' : '' }}
              </span>
            </div>
          </div>

          <!-- CPD Credits List -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                  >
                    CPD Credit Duration
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                  >
                    Credits
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900"
                  >
                    Activity Name
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 bg-white">
                <tr
                  v-for="credit in paginatedCredits"
                  :key="credit.id"
                  class="hover:bg-blue-50/30 transition-colors duration-200"
                >
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-900">
                    {{ credit.cpd_credit_duration }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-700">
                    {{ credit.credits }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-slate-700">
                    {{ getActivityName(credit.cpd_activity_name) }}
                  </td>
                  <td
                    class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                  >
                    <div class="flex justify-end gap-2">
                      <button
                        @click="editCredit(credit)"
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
                        @click="confirmDelete(credit)"
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
                <tr v-if="cpdCredits.length === 0">
                  <td colspan="4" class="px-6 py-4 text-center text-slate-500">
                    No CPD credits found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-6">
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

      <!-- Delete Confirmation Modal -->
      <AlertDialogRoot :open="isDeleteModalOpen" @update:open="isDeleteModalOpen = $event">
        <AlertDialogContent
          class="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none z-50"
        >
          <AlertDialogTitle class="text-xl font-semibold text-slate-900 mb-2">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription class="text-slate-600 mb-6">
            This action cannot be undone. This will permanently delete the CPD credit "{{
              creditToDelete?.cpd_credit_duration
            }}".
          </AlertDialogDescription>
          <div class="flex justify-end gap-4">
            <AlertDialogCancel
              class="px-4 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
              @click="cancelDelete"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              @click="deleteCredit"
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
import { ref, onMounted, computed } from 'vue'
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
const cpdCredits = ref([])
const cpdActivitiesList = ref([])
const formData = ref({
  cpd_credit_duration: '',
  credits: null,
  cpd_activity_name: '',
})
const isEditing = ref(false)
const editingId = ref(null)
const isDeleteModalOpen = ref(false)
const creditToDelete = ref(null)
const currentPage = ref(1)
const itemsPerPage = 5

// Utility function to convert duration input to API format (HH:MM:ss)
const formatDuration = (input) => {
  input = input.trim().toLowerCase()
  const timeRegex = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/
  const hourRegex = /^(\d+)\s*h(?:our|ours)?$/
  const minuteRegex = /^(\d+)\s*m(?:in|inute|inutes)?$/

  if (timeRegex.test(input)) {
    const [, hours, minutes, secs = '00'] = input.match(timeRegex)
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${secs.padStart(2, '0')}`
  } else if (hourRegex.test(input)) {
    const [, hours] = input.match(hourRegex)
    return `${hours.padStart(2, '0')}:00:00`
  } else if (minuteRegex.test(input)) {
    const [, minutes] = input.match(minuteRegex)
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:00`
  }

  return input // Fallback
}

// Methods
const fetchCredits = async (page = 1) => {
  try {
    const response = await api.getMhpcMastersCpdCredits()
    // Map API response to match component's expected field names
    cpdCredits.value = response.data.results.map(credit => ({
      id: credit.id,
      cpd_credit_duration: credit.duration,
      credits: credit.credits,
      cpd_activity_name: credit.activity_type.id, // Map activity_type.id to cpd_activity_name
      created_at: credit.created_at,
      updated_at: credit.updated_at,
    }))
    currentPage.value = page
  } catch (error) {
    console.error('Error fetching CPD credits:', error)
  }
}

const fetchCpdActivities = async () => {
  try {
    const response = await api.getMhpcMastersCpdActivities()
    // Map API response to match component's expected field names
    cpdActivitiesList.value = response.data.results.map(activity => ({
      id: activity.id,
      cpd_activity_name: activity.name,
      cpd_activity_description: activity.description,
      created_at: activity.created_at,
      updated_at: activity.updated_at,
    }))
  } catch (error) {
    console.error('Error fetching CPD activities:', error)
  }
}

const handleSubmit = async () => {
  try {
    // Transform form data to match API's expected field names and format
    const payload = {
      duration: formatDuration(formData.value.cpd_credit_duration),
      credits: Number(formData.value.credits), // Ensure credits is a number
      activity_type_id: formData.value.cpd_activity_name, // Matches API field for POST
    }
    if (isEditing.value) {
      await api.updateMhpcMastersCpdCredit(editingId.value, payload)
    } else {
      await api.createMhpcMastersCpdCredit(payload)
    }
    resetForm()
    fetchCredits()
  } catch (error) {
    console.error('Error saving CPD credit:', error)
  }
}

const editCredit = (credit) => {
  formData.value = {
    cpd_credit_duration: credit.cpd_credit_duration,
    credits: credit.credits,
    cpd_activity_name: credit.cpd_activity_name,
  }
  isEditing.value = true
  editingId.value = credit.id
}

const cancelEdit = () => {
  resetForm()
}

const resetForm = () => {
  formData.value = {
    cpd_credit_duration: '',
    credits: null,
    cpd_activity_name: '',
  }
  isEditing.value = false
  editingId.value = null
}

const confirmDelete = (credit) => {
  creditToDelete.value = credit
  isDeleteModalOpen.value = true
}

const cancelDelete = () => {
  isDeleteModalOpen.value = false
  creditToDelete.value = null
}

const deleteCredit = async () => {
  if (!creditToDelete.value) return
  try {
    await api.deleteMhpcMastersCpdCredit(creditToDelete.value.id)
    // Remove the deleted credit from the list
    cpdCredits.value = cpdCredits.value.filter(
      (credit) => credit.id !== creditToDelete.value.id
    )
    cancelDelete()
    fetchCredits()
  } catch (error) {
    console.error('Error deleting CPD credit:', error)
  }
}

const totalPages = computed(() => {
  return Math.ceil(cpdCredits.value.length / itemsPerPage)
})

const paginatedCredits = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return cpdCredits.value.slice(start, end)
})

const getActivityName = (activityId) => {
  const activity = cpdActivitiesList.value.find((act) => act.id === activityId)
  return activity ? activity.cpd_activity_name : 'Unknown Activity'
}

// Lifecycle
onMounted(() => {
  fetchCredits()
  fetchCpdActivities()
})
</script>
