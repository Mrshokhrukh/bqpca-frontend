<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Institute Applications</h1>
      <div class="flex items-center text-gray-600">
        <span class="flex items-center">
          <svg class="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z"
            ></path>
          </svg>
          Total Institutes: {{ institutes.length }}
        </span>
        <span class="flex items-center ml-6">
          <svg class="w-4 h-4 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clip-rule="evenodd"
            ></path>
          </svg>
          Pending Action: {{ getPendingCount() }}
        </span>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Institute Name
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Applicant Name
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Expiry Date
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Loading State -->
            <tr v-if="isLoading">
              <td colspan="5" class="px-6 py-10 text-center text-sm text-gray-500">
                Loading institute applications...
              </td>
            </tr>
            <!-- Empty State -->
            <tr v-else-if="institutes.length === 0">
              <td colspan="5" class="px-6 py-10 text-center text-sm text-gray-500">
                No institute applications found.
              </td>
            </tr>
            <!-- Data Rows -->
            <tr
              v-for="institute in institutes"
              :key="institute.id"
              class="hover:bg-gray-50 transition-colors"
              v-else
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ institute.name_of_institution }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ institute.full_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(institute)">
                  {{ getStatusText(institute) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(institute.valid_till) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center gap-x-2">
                  <button
                    @click="openModal(institute)"
                    :disabled="!institute.latest_renewal || institute.latest_renewal.renewal_status !== 'PENDING'"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    View Details
                  </button>
                  <button
                    @click="confirmDelete(institute)"
                    class="bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <InstituteRenewalApplicationDetailsModal
      :is-open="isModalOpen"
      :application-details="selectedInstitute"
      @close-modal="closeModal"
      @application-updated="handleApplicationUpdate"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import InstituteRenewalApplicationDetailsModal from '../modals/InstituteRenewalApplicationDetailsModal.vue'
// Make sure this path is correct for your project structure
import apiService from '@/services/services'

const toast = useToast()
const institutes = ref([])
const isLoading = ref(true)
const isModalOpen = ref(false)
const selectedInstitute = ref(null)

onMounted(() => {
  fetchInstitutes()
})

const fetchInstitutes = async () => {
  isLoading.value = true
  try {
    // Assuming this endpoint returns the Institute list with `latest_renewal` nested object
    const response = await apiService.getMhpcInstitutes()
    if (response.data && Array.isArray(response.data.results)) {
      institutes.value = response.data.results.sort((a, b) => {
        const dateA = a.valid_till ? new Date(a.valid_till) : new Date(0)
        const dateB = b.valid_till ? new Date(b.valid_till) : new Date(0)
        return dateA - dateB
      })
    } else {
      console.error('Unexpected API response format:', response)
      institutes.value = []
      toast.error('Unexpected data format received from server')
    }
  } catch (error) {
    console.error('Error fetching institutes:', error)
    toast.error('Failed to load institute applications')
    institutes.value = []
  } finally {
    isLoading.value = false
  }
}

const openModal = (institute) => {
  // We only open the modal if there's a pending renewal
  if (!institute.latest_renewal || institute.latest_renewal.renewal_status !== 'PENDING') {
    toast.info('No pending renewal action for this institute.')
    return
  }
  // Pass all the necessary IDs and details to the modal
  selectedInstitute.value = {
    instituteId: institute.id,
    instituteCID: institute.CID, // Pass the CID
    renewalId: institute.latest_renewal.id, // Pass the renewal's ID
    instituteName: institute.name_of_institution,
    applicantName: institute.full_name,
    lastUpdated: institute.latest_renewal.created_at,
    expiryDate: institute.valid_till,
    officerRemarks: institute.latest_renewal.officer_remarks || '',
    renewalStatus: institute.latest_renewal.renewal_status,
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedInstitute.value = null
}

const handleApplicationUpdate = () => {
  closeModal()
  fetchInstitutes() // Refresh the list after an update
}

const confirmDelete = (institute) => {
  if (
    window.confirm(
      `Are you sure you want to delete the application for "${institute.name_of_institution}"? This action cannot be undone.`,
    )
  ) {
    // Note: Deleting might now require using the CID instead of ID, depending on backend setup
    deleteApplication(institute.id) // Or institute.CID
  }
}

const deleteApplication = async (instituteId) => {
  try {
    await apiService.deleteMhpcInstitute(instituteId)
    toast.success('Application deleted successfully.')
    institutes.value = institutes.value.filter((inst) => inst.id !== instituteId)
  } catch (error) {
    console.error('Error deleting application:', error)
    toast.error('Failed to delete the application. Please try again.')
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// --- REFACTORED STATUS FUNCTIONS ---

const getStatusHelpers = (institute) => {
  const renewalStatus = institute.latest_renewal?.renewal_status;
  const validTill = institute.valid_till;

  const isExpired = () => {
    if (!validTill) return false
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(validTill) < today
  }

  const isRenewalDueSoon = () => {
    if (!validTill) return false
    const today = new Date()
    const renewalThreshold = new Date()
    renewalThreshold.setDate(today.getDate() + 90)
    return new Date(validTill) <= renewalThreshold && !isExpired()
  }

  return { renewalStatus, validTill, isExpired, isRenewalDueSoon };
}

const getStatusClass = (institute) => {
  const { renewalStatus, isExpired, isRenewalDueSoon } = getStatusHelpers(institute);

  const baseClass = 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full';

  if (renewalStatus === 'PENDING') {
    return `${baseClass} bg-yellow-100 text-yellow-800`;
  }
  if (renewalStatus === 'AWAITING_PAYMENT') {
    return `${baseClass} bg-purple-100 text-purple-800`;
  }
  if (isExpired()) {
    return `${baseClass} bg-red-100 text-red-800`;
  }
  if (isRenewalDueSoon()) {
    return `${baseClass} bg-blue-100 text-blue-800`;
  }
  if (institute.is_currently_active) {
    return `${baseClass} bg-green-100 text-green-800`;
  }
  if (renewalStatus === 'REJECTED') {
    return `${baseClass} bg-gray-100 text-gray-800`;
  }

  // Default/Initial state
  return `${baseClass} bg-gray-100 text-gray-800`;
}

const getStatusText = (institute) => {
  const { renewalStatus, isExpired, isRenewalDueSoon } = getStatusHelpers(institute);

  if (renewalStatus === 'PENDING') return 'Pending Renewal';
  if (renewalStatus === 'AWAITING_PAYMENT') return 'Awaiting Payment';
  if (isExpired()) return 'Expired';
  if (isRenewalDueSoon()) return 'Renewal Due';
  if (institute.is_currently_active) return 'Active';
  if (renewalStatus === 'REJECTED') return 'Renewal Rejected';

  // Default/Initial state
  return 'Inactive';
}

const getPendingCount = () => {
  if (!Array.isArray(institutes.value)) return 0
  return institutes.value.filter(
    (inst) => inst.latest_renewal && inst.latest_renewal.renewal_status === 'PENDING',
  ).length
}
</script>