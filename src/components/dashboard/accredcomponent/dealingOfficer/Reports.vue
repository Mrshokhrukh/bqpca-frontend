<template>
  <div class="container mx-auto px-4 sm:px-8">
    <div class="py-8">
      <div class="flex justify-between mb-4">
        <h2 class="text-2xl font-semibold">Accreditation Reports</h2>
        <button
          @click="exportToCSV"
          class="inline-block text-center py-2 px-4 bg-green-500 hover:bg-green-700 text-white text-sm rounded-md transition duration-200"
        >
          Export to CSV
        </button>
      </div>

      <div class="mb-4 flex space-x-4">
        <div class="relative">
          <select
            v-model="statusFilter"
            class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">All Statuses</option>
            <option value="Verified">Verified</option>
            <option value="Assessor Assigned">Assessor Assigned</option>
            <option value="COI Sent">COI Sent</option>
            <option value="Site Visit Scheduled">Site Visit Scheduled</option>
            <option value="Approved">Approved</option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
          >
            <svg
              class="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
              />
            </svg>
          </div>
        </div>

        <div class="flex-1">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search by User Name or ID"
            class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          />
        </div>
      </div>

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
                  Verification Date
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Assessor Name (if assigned)
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  COI Sent Date (if sent)
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Site Visit Date (if scheduled)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.userId">
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
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ user.verificationDate }}
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
                    {{ user.assessor ? user.assessor.name : 'N/A' }}
                  </p>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ user.coiSentDate || 'N/A' }}
                  </p>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ user.siteVisitDate || 'N/A' }}
                  </p>
                </td>
              </tr>
              <tr v-if="filteredUsers.length === 0">
                <td
                  colspan="7"
                  class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"
                >
                  No users match the current filters.
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
import { useUtils } from './Utils'

const { downloadCSV } = useUtils() // Destructure the downloadCSV function

const verifiedUsers = ref([
  {
    userId: 'USER-001',
    userName: 'Institution A User',
    verificationDate: '2024-08-25',
    status: 'COI Sent',
    assessorAssigned: true,
    assessor: { id: 'assessor-1', name: 'Dr. Alice Johnson' },
    coiSent: true,
    coiSentDate: '2024-09-05',
    siteVisitDate: null,
  },
  {
    userId: 'USER-002',
    userName: 'College B User',
    verificationDate: '2024-08-26',
    status: 'Site Visit Scheduled',
    assessorAssigned: true,
    assessor: { id: 'assessor-2', name: 'Prof. Bob Williams' },
    coiSent: true,
    coiSentDate: '2024-09-06',
    siteVisitDate: '2024-10-15',
  },
  {
    userId: 'USER-003',
    userName: 'University C User',
    verificationDate: '2024-08-27',
    status: 'Verified',
    assessorAssigned: false,
    assessor: null,
    coiSent: false,
    coiSentDate: null,
    siteVisitDate: null,
  },
  {
    userId: 'USER-004',
    userName: 'Institution D User',
    verificationDate: '2024-08-28',
    status: 'Assessor Assigned',
    assessorAssigned: true,
    assessor: { id: 'assessor-4', name: 'Dr. David Lee' },
    coiSent: false,
    coiSentDate: null,
    siteVisitDate: null,
  },
  {
    userId: 'USER-005',
    userName: 'College E User',
    verificationDate: '2024-08-29',
    status: 'Approved',
    assessorAssigned: true,
    assessor: { id: 'assessor-5', name: 'Prof. Emily Davis' },
    coiSent: true,
    coiSentDate: '2024-09-08',
    siteVisitDate: '2024-11-20',
  },
  // ... more users
])

const statusFilter = ref('')
const searchQuery = ref('')

const filteredUsers = computed(() => {
  return verifiedUsers.value.filter((user) => {
    const statusMatch = statusFilter.value === '' || user.status === statusFilter.value
    const searchMatch =
      searchQuery.value === '' ||
      user.userName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.userId.toLowerCase().includes(searchQuery.value.toLowerCase())
    return statusMatch && searchMatch
  })
})

const exportToCSV = () => {
  const headers = [
    { label: 'User ID', key: 'userId' },
    { label: 'User Name', key: 'userName' },
    { label: 'Verification Date', key: 'verificationDate' },
    { label: 'Status', key: 'status' },
    { label: 'Assessor Name', key: 'assessorName' },
    { label: 'COI Sent Date', key: 'coiSentDate' },
    { label: 'Site Visit Date', key: 'siteVisitDate' },
  ]

  const csvData = filteredUsers.value.map((user) => ({
    userId: user.userId,
    userName: user.userName,
    verificationDate: user.verificationDate,
    status: user.status,
    assessorName: user.assessor ? user.assessor.name : 'N/A',
    coiSentDate: user.coiSentDate || 'N/A',
    siteVisitDate: user.siteVisitDate || 'N/A',
  }))

  downloadCSV(csvData, headers, 'accreditation_report.csv')
}

const getStatusClass = (status) => {
  switch (status) {
    case 'Verified':
      return 'text-blue-900'
    case 'Assessor Assigned':
      return 'text-purple-900'
    case 'COI Sent':
      return 'text-green-900'
    case 'Site Visit Scheduled':
      return 'text-indigo-900'
    case 'Approved':
      return 'text-green-900' // Or different green for 'Approved'
    default:
      return 'text-gray-900'
  }
}
const getStatusBackgroundClass = (status) => {
  switch (status) {
    case 'Verified':
      return 'bg-blue-200'
    case 'Assessor Assigned':
      return 'bg-purple-200'
    case 'COI Sent':
      return 'bg-green-200'
    case 'Site Visit Scheduled':
      return 'bg-indigo-200'
    case 'Approved':
      return 'bg-green-200' // Or different green for 'Approved'
    default:
      return 'bg-gray-200'
  }
}
</script>
