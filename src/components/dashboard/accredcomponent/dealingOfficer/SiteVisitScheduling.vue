<template>
  <div class="container mx-auto px-4 sm:px-8">
    <div class="py-8">
      <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
        <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
          <table class="min-w-full leading-normal">
            <thead>
              <tr>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  User ID
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  User Name
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  COI Sent Date
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Site Visit Date
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in coiAcceptedUsers" :key="user.userId">
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ user.userId }}
                  </p>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ user.userName }}
                  </p>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span
                    class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
                    :class="getStatusClass(user.status)"
                  >
                    <span
                      aria-hidden
                      class="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                      :class="getStatusBackgroundClass(user.status)"
                    ></span>
                    <span class="relative">{{ user.status }}</span>
                  </span>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ user.coiSent ? user.coiSentDate : 'N/A' }}
                  </p>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <input
                    type="date"
                    v-model="user.siteVisitDate"
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Select Date"
                  />
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button
                    @click="scheduleSiteVisit(user)"
                    :disabled="!user.siteVisitDate"
                    class="inline-block text-center py-2 px-4 bg-indigo-500 hover:bg-indigo-700 text-white text-sm rounded-md transition duration-200"
                    :class="{ 'opacity-50 cursor-not-allowed': !user.siteVisitDate }"
                  >
                    Schedule Visit
                  </button>
                </td>
              </tr>
              <tr v-if="coiAcceptedUsers.length === 0">
                <td
                  colspan="6"
                  class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"
                >
                  No users to schedule or view site visits.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import apiService from '@/services/accreditationservices'

const verifiedUsers = ref([
  {
    userId: 'USER-001',
    userName: 'Institution A User',
    verificationDate: '2024-08-25',
    status: 'COI Sent',
    coiSent: true,
    coiSentDate: '2024-09-05',
    siteVisitDate: null,
  },
  {
    userId: 'USER-002',
    userName: 'College B User',
    verificationDate: '2024-08-26',
    status: 'Site Visit Scheduled', // Now with Site Visit Scheduled status
    coiSent: true,
    coiSentDate: '2024-09-06',
    siteVisitDate: '2024-10-15', // Example Site Visit Date
  },
  {
    userId: 'USER-003',
    userName: 'University C User',
    verificationDate: '2024-08-27',
    status: 'COI Sent',
    coiSent: true,
    coiSentDate: '2024-09-07',
    siteVisitDate: null,
  },
  // ... more users
])

// Computed property to filter users for Site Visit Scheduling table
const coiAcceptedUsers = computed(() => {
  return verifiedUsers.value.filter(
    (user) => user.status === 'COI Sent' || user.status === 'Site Visit Scheduled',
  )
})

const scheduleSiteVisit = async (user) => {
  if (user.siteVisitDate) {
    const payload = {
      application: user.userId, // Assuming userId is the application ID
      site_visit_name: 'Accreditation Site Visit',
      start_datetime: user.siteVisitDate + 'T09:00:00Z', // Assuming a default time
      end_datetime: user.siteVisitDate + 'T17:00:00Z', // Assuming a default time
      remarks_heqc_agenda: 'Scheduled by Dealing Officer',
    }

    try {
      await apiService.createApplicationSiteVisit(payload)
      user.status = 'Site Visit Scheduled'
      alert(`Site visit scheduled for ${user.userName} on ${user.siteVisitDate}`)
      console.log(`Site visit scheduled for user ${user.userId} on ${user.siteVisitDate}`)
    } catch (error) {
      console.error('Error scheduling site visit:', error)
      alert('Failed to schedule site visit. Please try again.')
    }
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'COI Sent':
      return 'text-green-900'
    case 'Site Visit Scheduled':
      return 'text-indigo-900'
    default:
      return 'text-gray-900'
  }
}
const getStatusBackgroundClass = (status) => {
  switch (status) {
    case 'COI Sent':
      return 'bg-green-200'
    case 'Site Visit Scheduled':
      return 'bg-indigo-200'
    default:
      return 'bg-gray-200'
  }
}
</script>
