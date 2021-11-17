<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Institute Renewal Applications</h1>
      <div class="flex items-center text-gray-600">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Total: {{ renewals.length }}
        </span>
        <span class="flex items-center ml-4">
          <span class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
          Pending: {{ getPendingCount() }}
        </span>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Institute Name</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Applicant Name</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Submitted On</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Current Expiry</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="renewal in renewals" :key="renewal.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <!-- The data structure from admin-renewals might be different. Adjust if needed. -->
                <div class="text-sm font-medium text-gray-900">
                  {{ renewal.institute.name_of_institution }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{
                renewal.institute?.full_name ?? "N/A" }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(renewal.created_at) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(renewal.renewal_status)">
                  <!-- {{ renewal.status_display }} -->
                  {{ renewal.renewal_status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(renewal.institute?.valid_till)
                }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button @click="openModal(renewal)" :disabled="renewal.renewal_status !== 'PENDING'"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed">
                    Review
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="renewals.length === 0">
              <td colspan="6" class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                No renewal applications found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <InstituteRenewalApplicationDetailsModal :is-open="isModalOpen" :application-details="selectedRenewal"
      @close-modal="closeModal" @application-updated="onApplicationUpdated" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import InstituteRenewalApplicationDetailsModal from '../modals/InstituteRenewalApplicationDetailsModal.vue'
import apiService from '@/services/services'

const toast = useToast()
const renewals = ref([])
const isLoading = ref(true)
const isModalOpen = ref(false)
const selectedRenewal = ref(null)

const onApplicationUpdated = async () => {
  await fetchRenewals()
  closeModal()
}


onMounted(async () => {
  await fetchRenewals()
})

const fetchRenewals = async () => {
  isLoading.value = true
  try {
    // --- UPDATED LINE ---
    // Calling the correctly identified and renamed function
    const response = await apiService.getAdminAllRenewals()
    // The admin-renewals endpoint might only list institute renewals,
    // but filtering here ensures you only show what's relevant to this page.
    // renewals.value = response.data.results.filter(r => r.renewal_type === 'institute') || []
    renewals.value = response.data.results

  } catch (error) {
    console.error('Error fetching admin renewals:', error)
    toast.error('Failed to load renewal applications.')
    renewals.value = []
  } finally {
    isLoading.value = false
  }
}

const openModal = (renewal) => {
  selectedRenewal.value = {
    ...renewal, // Pass the whole object
    renewalId: renewal.id,
    instituteName: renewal.institute.name_of_institution,
    applicantName: renewal.institute.name_of_institution,
    // expiryDate: renewal.institute.valid_till,
    expiryDate: renewal.created_at,
    lastUpdated: renewal.created_at,
    officerRemarks: renewal.officer_remarks || ''
  };
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  selectedRenewal.value = null
}



const getStatusClass = (status) => {
  switch (status) {
    case 'COMPLETED':
      return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'
    case 'REJECTED':
      return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'
    case 'AWAITING_PAYMENT':
      return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800'
    case 'PENDING':
    default:
      return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'
  }
}

const getPendingCount = () => {
  if (!Array.isArray(renewals.value)) return 0
  return renewals.value.filter((renewal) => renewal.renewal_status === 'PENDING').length
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>