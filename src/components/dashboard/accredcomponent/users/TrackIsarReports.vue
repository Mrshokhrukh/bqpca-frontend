<!-- components/MyApplications.vue -->
<template>
  <div class="p-6 font-sans">
    <h1 class="text-2xl font-bold mb-6">My Accreditation Applications</h1>

    <div v-if="loading" class="text-center py-10">Loading applications...</div>
    <div v-else class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full">
        <thead>
          <tr class="bg-gray-100">
            <th class="p-3 text-left font-semibold">Application ID</th>
            <th class="p-3 text-left font-semibold">Status</th>
            <th class="p-3 text-left font-semibold">ISAR Deadline</th>
            <th class="p-3 text-left font-semibold">Action Required</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="app in applications" :key="app.id" class="hover:bg-gray-50 border-t">
            <td class="p-3">{{ app.application_uid.substring(0, 8) }}</td>
            <td class="p-3">{{ app.status_display }}</td>
            <td class="p-3">{{ formatDate(app.isar_submission_deadline) }}</td>
            <td class="p-3">
              <!-- THIS IS THE CORE LOGIC -->
              <!-- The button ONLY appears if the status is correct -->
              <div v-if="app.status === 'initial_app_approved_awaiting_isar'">
                <router-link
                  :to="{ name: 'IsarForm', query: { applicationId: app.id } }"
                  class="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded text-sm font-medium"
                >
                  Submit ISAR Report
                </router-link>
              </div>
              <div v-else>
                <span class="text-gray-500 text-sm">No action needed</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiService from '@/services/services'

const applications = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await apiService.getAccreditationApplications()
    applications.value = response.data.results || []
  } catch (error) {
    console.error('Failed to fetch applications:', error)
  } finally {
    loading.value = false
  }
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString()
}
</script>
