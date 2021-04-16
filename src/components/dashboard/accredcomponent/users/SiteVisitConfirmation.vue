<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="mx-auto p-6">
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <!-- Header -->
        <div
          class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-t-xl p-8 mb-6"
        >
          <h2 class="text-3xl font-bold text-gray-900 text-center">Site Visit Confirmation</h2>
          <p class="text-gray-600 text-center max-w-2xl mx-auto">
            Confirm or reschedule the upcoming site visit.
          </p>
        </div>

        <!-- Site Visit Details -->
        <div class="p-8">
          <div v-if="loading" class="text-center text-gray-600 py-4">
            Loading site visit details...
          </div>
          <div v-else-if="siteVisitDetails">
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-700">Site Visit Details</h3>
              <p class="text-gray-500 mt-1">Date: {{ formatDate(siteVisitDetails.date) }}</p>
              <p class="text-gray-500 mt-1">Time: {{ siteVisitDetails.time }}</p>
              <p class="text-gray-500 mt-1">Location: {{ siteVisitDetails.location }}</p>
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-700">Assessors</h3>
              <ul class="list-disc list-inside text-gray-500">
                <li v-for="assessor in siteVisitDetails.assessors" :key="assessor.id">
                  {{ assessor.name }} ({{ assessor.affiliation }})
                </li>
              </ul>
            </div>
          </div>
          <div v-else class="text-center text-gray-600 py-4">No site visit scheduled.</div>
        </div>

        <!-- Actions -->
        <div v-if="siteVisitDetails && !confirmationMade" class="p-8 border-t">
          <div class="flex justify-end">
            <button
              @click="requestReschedule"
              class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors mr-4"
            >
              Request Reschedule
            </button>
            <button
              @click="confirmVisit"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Confirm Visit
            </button>
          </div>
        </div>

        <!-- Reschedule Request Input -->
        <div v-if="showRescheduleReason" class="p-8 border-t">
          <label for="rescheduleReason" class="block text-sm font-medium text-gray-700"
            >Reason for Reschedule Request:</label
          >
          <textarea
            id="rescheduleReason"
            v-model="rescheduleReason"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
          ></textarea>
          <div class="flex justify-end mt-4">
            <button
              @click="submitRescheduleRequest"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Submit Request
            </button>
          </div>
        </div>

        <!-- Confirmation Message -->
        <div v-if="confirmationMade" class="p-8 border-t text-center text-gray-700">
          <p v-if="visitConfirmed">Site Visit Confirmed!</p>
          <p v-else>Reschedule Request Submitted. You will be notified of the new schedule.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const siteVisitDetails = ref(null)
const loading = ref(true)
const showRescheduleReason = ref(false)
const rescheduleReason = ref('')
const confirmationMade = ref(false)
const visitConfirmed = ref(false)

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const fetchSiteVisitDetails = async () => {
  // Simulate fetching site visit details from the backend
  setTimeout(() => {
    siteVisitDetails.value = {
      date: '2024-02-29',
      time: '10:00 AM',
      location: 'Main Campus Auditorium',
      assessors: [
        { id: 1, name: 'Dr. Alice Smith', affiliation: 'University A' },
        { id: 2, name: 'Prof. Bob Johnson', affiliation: 'Consulting Firm B' },
      ],
    }
    loading.value = false
  }, 500)
}

const confirmVisit = () => {
  console.log('Site visit confirmed')
  confirmationMade.value = true
  visitConfirmed.value = true
}

const requestReschedule = () => {
  showRescheduleReason.value = true
}

const submitRescheduleRequest = () => {
  console.log('Reschedule request submitted. Reason:', rescheduleReason.value)
  confirmationMade.value = true
  visitConfirmed.value = false
  showRescheduleReason.value = false
}

onMounted(() => {
  fetchSiteVisitDetails()
})
</script>
