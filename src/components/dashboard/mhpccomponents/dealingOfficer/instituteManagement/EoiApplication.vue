<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div
      class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100 flex items-start justify-between"
    >
      <div>
        <h1 class="text-4xl font-bold text-gray-900 mb-3">EOI Applications</h1>
      </div>
      <div>
        <button
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          @click="fetchInstitutes"
          :disabled="loading"
        >
          <RefreshCw class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" />
          {{ loading ? 'Refreshing...' : 'Refresh Application List' }}
        </button>
      </div>
    </div>

    <!-- Search Input -->
    <div class="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by App ID, Institute Name, or Program..."
          class="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>

    <!-- Application Table with Loading State -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
      <div v-else-if="!filteredEois.length && !loading" class="text-center py-12 text-gray-500">
          No applications found matching your criteria.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                App ID (CID)
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Institute Name
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Program Type
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Date Submitted
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Actions
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Notes / Reason
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="institute in filteredEois"
              :key="institute.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ institute.CID }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ institute.name_of_institution }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ institute.program_type ? institute.program_type.program_name : 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatDate(institute.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <!-- MODIFIED TO USE THE NEW getStatusInfo RETURN STRUCTURE -->
                <span :class="getStatusInfo(institute).cssClasses">
                  {{ getStatusInfo(institute).displayText }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button
                    @click="openModal(institute)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                  >
                    View / Manage
                  </button>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-700 break-words max-w-xs">
                <span v-if="institute.physical_verification_remarks">
                  PV Remarks: {{ institute.physical_verification_remarks }}
                </span>
                <span v-else-if="institute.review_decision === 'Rejected' && institute.reason_if_rejected">
                  EOI Rejection: {{ institute.reason_if_rejected }}
                </span>
                 <span v-else-if="institute.review_decision === 'Regretted' && institute.reason_if_rejected"> <!-- Assuming Regretted is a form of Rejected -->
                  EOI Rejection: {{ institute.reason_if_rejected }}
                </span>
                <span v-else-if="institute.review_decision === 'Approved' && institute.remarks">
                  EOI Approval: {{ institute.remarks }}
                </span>
                <span v-else-if="institute.do_dpr_review_decision === 'Approved' && institute.do_dpr_review_summary">
                  DPR Approval: {{ institute.do_dpr_review_summary }}
                </span>
                <span v-else-if="institute.do_dpr_review_decision === 'Rejected' && institute.do_dpr_reason_if_rejected">
                  DPR Rejection: {{ institute.do_dpr_reason_if_rejected }}
                </span>
                <span v-else-if="institute.do_dpr_review_decision === 'Regretted' && institute.do_dpr_reason_if_rejected"> <!-- Assuming Regretted is a form of Rejected -->
                  DPR Rejection: {{ institute.do_dpr_reason_if_rejected }}
                </span>
                <span v-else-if="institute.application_status === 'EOI Approved' && institute.remarks">
                  EOI Approved: {{ institute.remarks }}
                </span>
                <span v-else-if="institute.application_status === 'EOI Rejected' && institute.reason_if_rejected">
                  EOI Rejected: {{ institute.reason_if_rejected }}
                </span>
                <span v-else>N/A</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <EoiApplicationsModal
      :isOpen="isModalOpen"
      :application="selectedInstitute"
      @close="closeModal"
      @application-updated="handleApplicationUpdated"
      :key="modalKey"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { RefreshCw } from 'lucide-vue-next' // Ensure you have this or a similar icon library
import { useToast } from 'vue-toastification'
import EoiApplicationsModal from './EoiApplicationsModal.vue'
import apiService from '@/services/services' // Adjust path as necessary

const toast = useToast()

const institutes = ref([])
const isModalOpen = ref(false)
const selectedInstitute = ref(null)
const loading = ref(false)
const searchQuery = ref('')
const modalKey = ref(0)

const fetchInstitutes = async () => {
  loading.value = true
  try {
    const response = await apiService.getMhpcInstitutes() // Ensure this API endpoint exists and works
    if (response && response.data && Array.isArray(response.data.results)) {
      institutes.value = response.data.results.map(item => ({
        ...item,
        // Ensure 'id' exists or use CID as id if unique and suitable.
        // The key in v-for (:key="institute.id") relies on this.
        // If your API returns 'id', this is fine. If not, use 'CID'.
        id: item.id || item.CID
      }));
    } else {
      console.error('Invalid API response structure:', response)
      institutes.value = [];
      toast.error('Failed to fetch applications: Invalid API response.')
    }
  } catch (error) {
    console.error('Error fetching institutes:', error)
    institutes.value = [];
    toast.error(`Failed to fetch applications: ${error.message || 'Unknown error'}`)
  } finally {
    loading.value = false
  }
}

onMounted(fetchInstitutes)

const openModal = (institute) => {
  selectedInstitute.value = JSON.parse(JSON.stringify(institute));
  modalKey.value++;
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  // selectedInstitute.value = null; // Optional: clear selected on close
}

const handleApplicationUpdated = (updatedApplicationData) => {
  const applicationToUpdate = {
    ...updatedApplicationData,
    id: updatedApplicationData.id || updatedApplicationData.CID
  };

  if (!applicationToUpdate || typeof applicationToUpdate.id === 'undefined') {
    console.error('Received invalid updatedApplication data:', updatedApplicationData);
    toast.error('Update failed: Invalid data from server.');
    fetchInstitutes();
    return;
  }

  const index = institutes.value.findIndex(inst => inst.id === applicationToUpdate.id);

  if (index !== -1) {
    institutes.value.splice(index, 1, JSON.parse(JSON.stringify(applicationToUpdate)));
    toast.success(`Application ${applicationToUpdate.CID} updated successfully!`);
    if (isModalOpen.value && selectedInstitute.value && selectedInstitute.value.id === applicationToUpdate.id) {
       selectedInstitute.value = JSON.parse(JSON.stringify(applicationToUpdate));
       modalKey.value++;
    }
  } else {
    console.warn(`Updated application ID ${applicationToUpdate.id} not found. Refreshing list.`);
    fetchInstitutes();
  }
}


const filteredEois = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) {
    return institutes.value
  }
  return institutes.value.filter((institute) => {
    const appIDCID = String(institute.CID || '').toLowerCase()
    const instituteName = String(institute.name_of_institution || '').toLowerCase()
    const programName = String(institute.program_type?.program_name || '').toLowerCase()
    const statusText = String(institute.application_status || '').toLowerCase(); // Search by raw status

    return (
      appIDCID.includes(query) ||
      instituteName.includes(query) ||
      programName.includes(query) ||
      statusText.includes(query) // Added search by raw status
    )
  })
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const parsedDate = new Date(parts[0], parts[1] - 1, parts[2]);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC'
          });
        }
      }
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}

// MODIFIED: getStatusInfo to return both text and classes
const getStatusInfo = (institute) => {
  const appStatus = institute.application_status;
  const isPVComplete = institute.is_physical_verification;
  let displayText = appStatus || 'N/A';
  let cssClasses = 'bg-yellow-100 text-yellow-800'; // Default

  if (appStatus === 'EOI Pending Physical Verification') {
    if (isPVComplete) {
      displayText = 'Physical Verification Completed';
      cssClasses = 'bg-teal-100 text-teal-800'; // Teal for PV Completed
    } else {
      displayText = 'Pending Physical Verification';
      cssClasses = 'bg-yellow-100 text-yellow-800'; // Yellow for PV Pending
    }
  } else if (appStatus === 'EOI Approved' || appStatus === 'Fully Approved') {
    displayText = appStatus; // Or simply 'Approved'
    cssClasses = 'bg-green-100 text-green-800';
  } else if (appStatus === 'EOI Rejected' || appStatus === 'DPR Rejected' || appStatus === 'Final Rejected') {
    displayText = appStatus; // Or simply 'Rejected' / 'Regretted'
    cssClasses = 'bg-red-100 text-red-800';
  } else if (appStatus === 'EOI Submitted' || appStatus === 'EOI Pending Review' || appStatus === 'DPR Submitted' || appStatus === 'DPR Pending Review' || appStatus === 'Payment Pending' ) {
    displayText = appStatus;
    cssClasses = 'bg-yellow-100 text-yellow-800';
  }
  // Add more conditions for other statuses as needed

  return {
    displayText: displayText,
    cssClasses: ['px-3 py-1 rounded-full text-xs font-medium inline-block', cssClasses],
  };
};
</script>

<style scoped>
.max-w-xs {
  max-width: 20rem;
}
.break-words {
  word-break: break-word;
  overflow-wrap: break-word;
}
</style>