<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <!-- Inline Notification -->
    <Transition name="notification">
      <div
        v-if="notification.show"
        :class="[
          'fixed right-4 top-4 p-4 rounded-md shadow-lg flex items-center z-50 max-w-md',
          notification.type === 'success'
            ? 'bg-green-50 border-l-4 border-green-500'
            : notification.type === 'error'
              ? 'bg-red-50 border-l-4 border-red-500'
              : 'bg-blue-50 border-l-4 border-blue-500',
        ]"
      >
        <div
          :class="[
            'flex-shrink-0 w-6 h-6',
            notification.type === 'success'
              ? 'text-green-500'
              : notification.type === 'error'
                ? 'text-red-500'
                : 'text-blue-500',
          ]"
        >
          <svg
            v-if="notification.type === 'success'"
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <svg
            v-else-if="notification.type === 'error'"
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div class="ml-3">
          <h3
            :class="[
              'text-sm font-medium',
              notification.type === 'success'
                ? 'text-green-800'
                : notification.type === 'error'
                  ? 'text-red-800'
                  : 'text-blue-800',
            ]"
          >
            {{ notification.title }}
          </h3>
          <p
            :class="[
              'text-sm mt-1',
              notification.type === 'success'
                ? 'text-green-700'
                : notification.type === 'error'
                  ? 'text-red-700'
                  : 'text-blue-700',
            ]"
          >
            {{ notification.message }}
          </p>
        </div>
        <button @click="closeNotification" class="ml-4 text-gray-500 hover:text-gray-600">
          <span class="sr-only">Close</span>
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </Transition>

    <div class="mx-auto">
      <!-- Use DOPageHeader Component -->
      <DOPageHeader
          title="CPD Applications"
          :description="headerDescription"
          :search-query="searchQuery"
          @update:searchQuery="searchQuery = $event"
          search-placeholder="Search by name, CID, registration or title..."
          :filter-value="statusFilter"
          @update:filterValue="statusFilter = $event"
          :filter-options="statusFilterOptions"
      />

      <!-- Removed old header card -->
      <!-- Removed old search and filter section -->

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-16">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">Loading applications...</span>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredApplications.length === 0"
        class="bg-white shadow-sm rounded-lg py-16 text-center border border-gray-200"
      >
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 class="mt-2 text-base font-medium text-gray-900">No applications found</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{
            applications.length > 0
              ? 'Try adjusting your search or filter criteria.'
              : 'No CPD applications have been submitted yet.'
          }}
        </p>
      </div>

      <!-- Applications Table -->
      <div v-else class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Applicant
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  CPD Title
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date Submitted
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="app in paginatedApplications"
                :key="app.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ app.id }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900 font-medium">{{ app.applicantName }}</div>
                  <div class="text-xs text-gray-500">CID: {{ app.cidNumber }}</div>
                  <div class="text-xs text-gray-500">Reg: {{ app.registrationNumber || 'N/A' }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ app.title }}</div>
                  <div class="text-xs text-gray-500">{{ app.activityType }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      getStatusColor(app.status),
                      'px-2.5 py-0.5 text-xs font-semibold rounded-full inline-block',
                    ]"
                  >
                    {{ app.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ app.date }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    @click="openViewModal(app)"
                    class="text-blue-600 hover:text-blue-900 font-medium text-sm px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
        >
          <div class="flex-1 flex justify-between sm:hidden">
             <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                 class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing <span class="font-medium">{{ paginationStart + 1 }}</span> to
                <span class="font-medium">{{ paginationEnd }}</span> of
                <span class="font-medium">{{ filteredApplications.length }}</span> results
              </p>
            </div>
             <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                   class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                 <span aria-current="page" class="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                   {{ currentPage }}
                 </span>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span class="sr-only">Next</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <CpdViewApplicationsModal
      v-if="isViewModalOpen"
      :application="selectedApplication"
      @save="saveApplication"
      @approve="approveApplication"
      @reject="rejectApplication"
      @close="closeViewModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import CpdViewApplicationsModal from '../modals/CpdViewApplicationsModal.vue'
import apiServices from '@/services/services'
import DOPageHeader from '@/components/common/MHPC/DOPageHeader.vue' // Import the header

const applications = ref([])
const selectedApplication = ref(null)
const isViewModalOpen = ref(false)
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('') // Default to empty string for "All Statuses"
const currentPage = ref(1)
const pageSize = ref(10)

const notification = ref({
  show: false,
  type: 'info',
  title: '',
  message: '',
  timeout: null,
})

const totalApplicationsCount = computed(() => {
    // Count only non-draft applications for the total shown in header
    return applications.value.filter(app => app.status !== 'Draft').length;
});

const pendingCount = computed(() => {
  return applications.value.filter((app) => app.status === 'Pending').length
})

// Computed property for the header description
const headerDescription = computed(() => {
  return `Total: ${totalApplicationsCount.value} | Pending: ${pendingCount.value}`
})

// Options for the status filter dropdown in DOPageHeader
const statusFilterOptions = ref([
  { value: '', text: 'All Statuses' }, // Use empty string for "All"
  { value: 'Pending', text: 'Pending' },
  { value: 'Approved', text: 'Approved' },
  { value: 'Rejected', text: 'Rejected' },
  // We exclude 'Draft' from the filter options as per table logic
])


const filteredApplications = computed(() => {
  let filtered = applications.value

  // Exclude draft applications from the main view/table
  filtered = filtered.filter((app) => app.status !== 'Draft')

  // Apply status filter if not empty string (representing "All")
  if (statusFilter.value) {
    filtered = filtered.filter((app) => app.status === statusFilter.value)
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(
      (app) =>
        app.applicantName?.toLowerCase().includes(query) ||
        app.cidNumber?.toString().includes(query) ||
        app.title?.toLowerCase().includes(query) ||
        (app.registrationNumber && app.registrationNumber.toString().includes(query)),
    )
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredApplications.value.length / pageSize.value) || 1
})

const paginationStart = computed(() => {
  return (currentPage.value - 1) * pageSize.value
})

const paginationEnd = computed(() => {
  return Math.min(paginationStart.value + pageSize.value, filteredApplications.value.length)
})

const paginatedApplications = computed(() => {
  return filteredApplications.value.slice(paginationStart.value, paginationEnd.value)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const resetPagination = () => {
  currentPage.value = 1
}

watch([searchQuery, statusFilter], () => {
  resetPagination()
})

const showNotification = (type, title, message, duration = 5000) => {
  if (notification.value.timeout) {
    clearTimeout(notification.value.timeout)
  }
  notification.value = {
    show: true,
    type,
    title,
    message,
    timeout: null,
  }
  if (duration > 0) {
    notification.value.timeout = setTimeout(() => {
      closeNotification()
    }, duration)
  }
}

const closeNotification = () => {
  notification.value.show = false
  if (notification.value.timeout) {
    clearTimeout(notification.value.timeout)
    notification.value.timeout = null
  }
}

const getStatusColor = (status) => {
  return (
    {
      Pending: 'bg-yellow-100 text-yellow-800',
      Approved: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
      Draft: 'bg-gray-100 text-gray-800', // Keep style for potential future use
    }[status] || 'bg-gray-100 text-gray-800'
  )
}

const openViewModal = (app) => {
  selectedApplication.value = app
  isViewModalOpen.value = true
}

const closeViewModal = () => {
  isViewModalOpen.value = false
  selectedApplication.value = null
}

const saveApplication = async (updatedApp) => {
  try {
    loading.value = true
    await apiServices.patchMhpcCpdTask(updatedApp.id, {
      credit: updatedApp.cpdCredits,
    })
    const index = applications.value.findIndex((a) => a.id === updatedApp.id)
    if (index !== -1) {
      applications.value[index] = { ...applications.value[index], ...updatedApp }
    }
    showNotification(
      'success',
      'Application Updated',
      'The CPD credits have been updated successfully.',
    )
    await fetchApplications()
  } catch (err) {
    console.error('Failed to save application:', err)
    showNotification(
      'error',
      'Update Failed',
      'There was an error updating the application. Please try again.',
    )
  } finally {
    loading.value = false
  }
}

const approveApplication = async (applicationData) => {
  try {
    loading.value = true
    if (!applicationData) {
      console.error('Application data is null or undefined.')
      showNotification('error', 'Approval Failed', 'Invalid application data. Please try again.')
      return
    }
    const updatedApplication = { ...applicationData }
    if (!updatedApplication.participants || !Array.isArray(updatedApplication.participants)) {
      updatedApplication.participants = []
    }

    let patchData = {
      review_status: 'Approved',
      review_remarks: updatedApplication.remarks || '', // Include remarks if any
    };

    if (updatedApplication.participants.length > 0) {
      const participantsToUpdate = updatedApplication.participants
        .filter(p => p && typeof p === 'object' && p.review_status && p.review_status !== 'Pending')
        .map(p => ({
          id: p.id,
          review_status: p.review_status,
          review_remarks: p.review_remarks || '',
          cpd_credits_for_participant: p.cpd_credits_for_participant || 0,
        }));

      if (participantsToUpdate.length > 0) {
        patchData.participants = participantsToUpdate;
      }
    }

    await apiServices.patchMhpcCpdTask(updatedApplication.id, patchData)

    showNotification(
      'success',
      'Application Approved',
      'The CPD application has been approved successfully.',
    )
    closeViewModal()
    await fetchApplications()
  } catch (err) {
    console.error('Failed to approve application:', err)
    showNotification(
      'error',
      'Approval Failed',
      'There was an error approving the application. Please try again.',
    )
  } finally {
    loading.value = false
  }
}


const rejectApplication = async (rejectionData) => {
  try {
    loading.value = true
    if (!rejectionData) {
      console.error('Rejection data is null or undefined.')
      showNotification('error', 'Rejection Failed', 'Invalid application data. Please try again.')
      return;
    }
    const updatedApplication = { ...rejectionData };
    if (!updatedApplication.participants || !Array.isArray(updatedApplication.participants)) {
      updatedApplication.participants = [];
    }

    let patchData = {
      review_status: 'Rejected',
      review_remarks: updatedApplication.remarks || '',
    };

    if (updatedApplication.participants.length > 0) {
      const participantsToUpdate = updatedApplication.participants
        .filter(p => p && typeof p === 'object') // Reject all participants in this case
        .map(p => ({
          id: p.id,
          review_status: 'Rejected', // Set participant status to Rejected
          review_remarks: p.review_remarks || updatedApplication.remarks || '', // Use specific or general remarks
          cpd_credits_for_participant: 0, // Set credits to 0 on rejection
        }));

      if (participantsToUpdate.length > 0) {
         patchData.participants = participantsToUpdate;
      }
    }

    await apiServices.patchMhpcCpdTask(updatedApplication.id, patchData);

    showNotification('success', 'Application Rejected', 'The CPD application has been rejected.');
    closeViewModal();
    await fetchApplications();
  } catch (err) {
    console.error('Failed to reject application:', err);
    showNotification(
      'error',
      'Rejection Failed',
      'There was an error rejecting the application. Please try again.',
    );
  } finally {
    loading.value = false;
  }
};


const fetchApplications = async () => {
  try {
    loading.value = true
    const response = await apiServices.getMhpcCpdTask()
    let results = [];
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
       results = response.data.results;
    } else if (response.results && Array.isArray(response.results)) { // Handle direct results array
        results = response.results;
    }
    processApiResponse(results)
  } catch (err) {
    console.error('Failed to fetch applications:', err)
    showNotification('error', 'Load Failed', 'There was an error loading the CPD applications.')
    applications.value = []
  } finally {
    loading.value = false
  }
}

const processApiResponse = (results) => {
  applications.value = results.map((item) => ({
    id: item.id,
    title: item.title_of_cpd || 'N/A',
    applicantName: item.full_name || 'Unknown',
    status: getTaskStatus(item),
    date: item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric'}) : 'N/A',
    registrationNumber: item.registration_no,
    cidNumber: item.cid_no || 'N/A',
    fullName: item.full_name || 'Unknown',
    gender: item.gender || 'Not specified',
    cpdTitle: item.title_of_cpd || 'N/A',
    relevance: item.relevance_to_topic || 'Not specified',
    participationCategory: getParticipationCategory(item),
    participantSubCategory: getParticipantSubcategory(item),
    activityType: getActivityType(item),
    attachment: item.attachment
      ? {
          name: item.attachment.split('/').pop(),
          url: item.attachment,
        }
      : null,
    cpdCredits: item.credit || 0,
    reviewStatus: item.review_status || 'Pending',
    remarks: item.remark || '',
    isDraft: item.is_draft || false,
    expected_outcome: item.expected_outcome || '',
    venue: item.venue || '',
    fromDate: item.from_date ? new Date(item.from_date).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric'}) : 'N/A',
    toDate: item.to_date ? new Date(item.to_date).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric'}) : 'N/A',
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    participants: item.participants || [],
  }))
}

const getTaskStatus = (item) => {
  if (item.is_draft) return 'Draft'
  return item.review_status || 'Pending'
}

const getParticipationCategory = (item) => {
  return item.participation_category?.participation_category_name || 'N/A'
}

const getParticipantSubcategory = (item) => {
  return item.participant_sub_category?.participation_sub_category_name || 'N/A'
}

const getActivityType = (item) => {
  return item.type_of_cpd?.cme_activity_name || 'N/A'
}

onMounted(() => {
  fetchApplications()
})
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}
.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.notification-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}
</style>
