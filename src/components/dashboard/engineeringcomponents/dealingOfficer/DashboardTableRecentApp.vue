<template>
  <div class="bg-white rounded-xl p-6 shadow-md mb-8">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-900">Recent Applications</h2>
      <button @click="toggleViewAll" class="text-blue-600 hover:text-blue-800">
        {{ viewAll ? 'View Less' : 'View All' }}
      </button>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Applicant / Institute
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Type
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Submitted/Updated
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="application in displayedApplications" :key="application.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="text-sm font-medium text-gray-900">{{ application.name }}</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getApplicationTypeClass(application.type)"
              >
                {{ application.type }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getStatusClass(application.status)"
              >
                {{ getStatusText(application.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(application.date) }}
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination Controls -->
      <div v-if="viewAll" class="mt-4 flex justify-center">
        <button
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="px-4 py-2 mx-1 text-gray-700 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span class="px-4 py-2 text-gray-700">Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          class="px-4 py-2 mx-1 text-gray-700 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import apiService from '@/services/services'
import { format } from 'date-fns'

const recentApplications = ref([])
const viewAll = ref(false)
const currentPage = ref(1)
const itemsPerPage = 15
const allApplications = ref([]) // Store all applications

onMounted(async () => {
  try {
    const applicationsResponse = await apiService.getEpcNewApplications()
    const applicationsData = applicationsResponse.data.results || []

    const processedApplications = []
    applicationsData.forEach((app) => {
      if (app.user_qualifications && app.user_qualifications.length > 0) {
        app.user_qualifications.forEach((qual) => {
          processedApplications.push({
            id: `${app.id}-${qual.id}`, // Create a unique key
            name: app?.application?.full_name,
            type: qual.registration_type_name || 'Unknown Qualification',
            status: qual.endorsement_decision || 'Pending',
            date: qual.updated_at || qual.created_at,
          })
        })
      } else {
        processedApplications.push({
          id: app.id,
          name: app?.application?.full_name,
          type: app.registration_type_name || 'Registration',
          status: 'Pending',
          date: app.updated_at || app.created_at,
        })
      }
    })

    const cpdRecordsResponse = await apiService.getEpcCogs()
    const cpdData = cpdRecordsResponse.data.results || []
    const mappedCpd = cpdData.map((cpd) => ({
      id: `cpd-${cpd.id}`,
      name: cpd.full_name,
      type: 'CPD',
      status: cpd.review_status,
      date: cpd.updated_at,
    }))

    const cogsRecordsResponse = await apiService.getEpcCogs()
    const cogsData = cogsRecordsResponse.data.results || []
    const mappedCogs = cogsData.map((cogs) => ({
      id: `cogs-${cogs.id}`,
      name: cogs.full_name,
      type: 'CoGS',
      status: cogs.endorsement_decision,
      date: cogs.updated_at,
    }))

    const capaRecordsResponse = await apiService.getEpcCapas()
    const capaData = capaRecordsResponse.data.results || []
    const mappedcapa = capaData.map((capa) => ({
      id: `capa-${capa.id}`,
      name: capa?.teaching_center?.institute?.name_of_institution,
      type: 'CAPA',
      status: capa.status,
      date: capa.updated_at,
    }))

    allApplications.value = [...processedApplications, ...mappedCpd, ...mappedCogs, ...mappedcapa]

    allApplications.value.sort((a, b) => new Date(b.date) - new Date(a.date))

    recentApplications.value = allApplications.value.slice(0, 5)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
})

const toggleViewAll = () => {
  viewAll.value = !viewAll.value
  currentPage.value = 1 // Reset to page 1 when toggling
  if (!viewAll.value) {
    recentApplications.value = allApplications.value.slice(0, 5)
  }
}

const displayedApplications = computed(() => {
  if (viewAll.value) {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return allApplications.value.slice(start, end)
  } else {
    return recentApplications.value
  }
})

const totalPages = computed(() => {
  return Math.ceil(allApplications.value.length / itemsPerPage)
})

// Updated to include more types
const getApplicationTypeClass = (type) => {
  const classes = {
    Registration: 'bg-blue-100 text-blue-800',
    'New registration': 'bg-blue-100 text-blue-800',
    'Additional Qualification': 'bg-indigo-100 text-indigo-800',
    'Re-registration': 'bg-orange-100 text-orange-800',
    Renewal: 'bg-green-100 text-green-800',
    CPD: 'bg-purple-100 text-purple-800',
    CoGS: 'bg-yellow-100 text-yellow-800',
    CAPA: 'bg-pink-100 text-pink-800',
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const getStatusClass = (status) => {
  const classes = {
    Pending: 'bg-yellow-100 text-yellow-800',
    'In Review': 'bg-blue-100 text-blue-800',
    'Documents Required': 'bg-red-100 text-red-800',
    Approved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
    Regret: 'bg-red-100 text-red-800',
    R: 'bg-green-100 text-green-800', // Resolved
    Resolved: 'bg-green-100 text-green-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return format(new Date(dateString), 'yyyy-MM-dd')
  } catch (error) {
    console.error('Error formatting date:', dateString, error)
    return 'Invalid Date'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'P':
    case 'Pending':
      return 'Pending'
    case 'R':
    case 'Resolved':
      return 'Resolved'
    case 'C':
    case 'Cancelled':
      return 'Cancelled'
    case 'Approved':
      return 'Approved'
    case 'Rejected':
      return 'Rejected'
    default:
      return status || 'Unknown'
  }
}
</script>
