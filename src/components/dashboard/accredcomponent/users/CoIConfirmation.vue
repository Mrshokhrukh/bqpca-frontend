<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Conflict of Interest Declaration</h1>
      <p class="text-gray-600 max-w-3xl mx-auto">
        Review the assessors assigned to your application. For each assessor, please declare whether
        a conflict of interest exists.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span class="ml-3 text-gray-600">Loading your assigned assessors...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
        </div>
      </div>
    </div>

    <!-- Main Table for Applicant -->
    <div v-else class="bg-white shadow-lg rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Assessor Name
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Application ID
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Declaration Status
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="record in userCoiRecords" :key="record.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ record.assessor_details.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ record.application_details.application_uid }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="getCoiStatusClass(record.institute_has_coi_with_assessor)"
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                >
                  {{ getCoiStatusText(record.institute_has_coi_with_assessor) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <!-- Actions are only available if declaration is pending -->
                <div v-if="record.institute_has_coi_with_assessor === null">
                  <button
                    @click="handleNoConflict(record)"
                    class="px-3 py-1.5 bg-green-100 text-green-800 rounded-md hover:bg-green-200 text-xs font-semibold mr-2"
                  >
                    No Conflict
                  </button>
                  <button
                    @click="openConflictModal(record)"
                    class="px-3 py-1.5 bg-red-100 text-red-800 rounded-md hover:bg-red-200 text-xs font-semibold"
                  >
                    Declare Conflict
                  </button>
                </div>
                <div v-else class="text-sm text-gray-400">
                  Declared on {{ formatDate(record.institute_coi_declared_at) }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Empty State for the specific user -->
      <div v-if="!loading && userCoiRecords.length === 0" class="text-center py-12">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No Assessors Found</h3>
        <p class="mt-1 text-sm text-gray-500">
          There are no assessors assigned to your applications requiring a COI declaration.
        </p>
      </div>
    </div>

    <!-- Declare Conflict Modal -->
    <div
      v-if="isConflictModalOpen"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white"
      >
        <form @submit.prevent="handleConflictSubmit">
          <div class="flex items-center justify-between pb-4 border-b">
            <h3 class="text-lg font-medium text-gray-900">Declare Conflict of Interest</h3>
            <button
              @click="closeConflictModal"
              type="button"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <div v-if="selectedRecord" class="mt-4 space-y-4">
            <p class="text-sm text-gray-600">
              You are declaring a conflict with assessor:
              <strong class="text-gray-800">{{ selectedRecord.assessor_details.name }}</strong>
            </p>
            <div>
              <label for="remarks" class="block text-sm font-medium text-gray-700"
                >Remarks (Required)</label
              >
              <textarea
                id="remarks"
                v-model="conflictRemarks"
                rows="4"
                required
                class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            <div v-if="submissionError" class="text-sm text-red-600">{{ submissionError }}</div>
          </div>
          <div class="flex items-center justify-end pt-4 mt-4 border-t">
            <button
              @click="closeConflictModal"
              type="button"
              class="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 disabled:bg-gray-400"
            >
              <span v-if="isSubmitting">Submitting...</span><span v-else>Submit Declaration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import apiService from '@/services/services'

const allCoiRecords = ref([])
const loading = ref(true)
const error = ref(null)
const currentUser = ref(null)

const isConflictModalOpen = ref(false)
const selectedRecord = ref(null)
const conflictRemarks = ref('')
const isSubmitting = ref(false)
const submissionError = ref(null)

const userCoiRecords = computed(() => {
  if (!currentUser.value || !allCoiRecords.value) {
    return []
  }

  return allCoiRecords.value.filter(
    (record) =>
      record.application_details.institute_profile_details.user_liaison_username ===
      currentUser.value.username,
  )
})

onMounted(() => {
  const userString = localStorage.getItem('user')
  if (userString) {
    currentUser.value = JSON.parse(userString)

    fetchCoiRecords()
  } else {
    error.value = 'Could not find user information. Please log in again.'
    loading.value = false
  }
})

const fetchCoiRecords = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiService.getApplicationAssessorCOIs()
    allCoiRecords.value = response.data.results || []
  } catch (err) {
    error.value = 'Failed to load COI data. Please try again later.'
    console.error('Error fetching COI data:', err)
  } finally {
    loading.value = false
  }
}

const getCoiStatusClass = (hasConflict) => {
  if (hasConflict === null) return 'bg-yellow-100 text-yellow-800'
  return hasConflict ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
}

const getCoiStatusText = (hasConflict) => {
  if (hasConflict === null) return 'Pending Declaration'
  return hasConflict ? 'Conflict Declared' : 'No Conflict'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const handleNoConflict = async (record) => {
  record.institute_has_coi_with_assessor = false
  record.institute_coi_declared_at = new Date().toISOString()

  try {
    const payload = {
      institute_has_coi_with_assessor: false,
      institute_coi_declared_at: record.institute_coi_declared_at,
    }
    await apiService.updateApplicationAssessorCOI(record.id, payload)
  } catch (err) {
    console.error('Failed to update "No Conflict":', err)

    record.institute_has_coi_with_assessor = null
    record.institute_coi_declared_at = null
  }
}

const openConflictModal = (record) => {
  selectedRecord.value = record
  conflictRemarks.value = ''
  submissionError.value = null
  isConflictModalOpen.value = true
}

const closeConflictModal = () => {
  isConflictModalOpen.value = false
  selectedRecord.value = null
}

const handleConflictSubmit = async () => {
  if (!conflictRemarks.value.trim()) {
    submissionError.value = 'Remarks are required to declare a conflict.'
    return
  }
  isSubmitting.value = true
  submissionError.value = null

  try {
    const payload = {
      institute_has_coi_with_assessor: true,
      institute_coi_remarks: conflictRemarks.value,
      institute_coi_declared_at: new Date().toISOString(),
    }
    await apiService.patchApplicationAssessorCOI(selectedRecord.value.id, payload)
    const recordInList = allCoiRecords.value.find((r) => r.id === selectedRecord.value.id)
    if (recordInList) {
      recordInList.institute_has_coi_with_assessor = true
      recordInList.institute_coi_remarks = payload.institute_coi_remarks
      recordInList.institute_coi_declared_at = payload.institute_coi_declared_at
    }

    closeConflictModal()
  } catch (err) {
    submissionError.value = 'Failed to submit declaration. Please try again.'
    console.error('Failed to update "Conflict":', err)
  } finally {
    isSubmitting.value = false
  }
}
</script>
