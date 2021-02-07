<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <!-- Header Section with Gradient -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10 shadow-md">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Certificate of Good Standing Applications</h1>
            <p class="text-gray-600">Manage and review COGS applications.</p>
          </div>
          <div class="flex space-x-4">
            <div class="relative">
              <input v-model.trim="searchQuery" type="text" placeholder="Search by name, CID, or registration number..."
                class="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80 shadow-sm" />
              <span class="absolute left-3 top-2.5 text-gray-400">
                <SearchIcon class="w-5 h-5" />
              </span>
            </div>
            <select v-model="statusFilter"
              class="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm">
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-8">
        <Loader2Icon class="w-8 h-8 animate-spin text-blue-500" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <div class="flex items-center">
          <AlertCircleIcon class="w-5 h-5 text-red-500 mr-2" />
          <p class="text-red-700">{{ error }}</p>
        </div>
      </div>

      <!-- Data Table -->
      <div v-else class="bg-white rounded-xl shadow-md overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration No.
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Details
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workplace Info
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="application in displayedApplications" :key="application.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ application.registration_no }}
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ application.full_name }}</div>
                <div class="text-sm text-gray-500">CID: {{ application.cid_no }}</div>
                <div class="text-sm text-gray-500">{{ application.email_address }}</div>
                <div class="text-sm text-gray-500">Contact: {{ application.contact_number }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ application.workplace?.name }}</div>
                <div class="text-sm text-gray-500">{{ application.department?.name }}</div>
                <div class="text-sm text-gray-500">{{ application.agency?.name }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ application.supervisor_name }}</div>
                <div class="text-sm text-gray-500">{{ application.supervisor_designation }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="space-y-2">
                  <span :class="getStatusClass(application.review_status)"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    Review: {{ application.review_status }}
                  </span>
                  <span :class="getStatusClass(application.endorsement_decision)"
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                    Endorsement: {{ application.endorsement_decision }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="space-y-2">
                  <button @click="reviewApplication(application)" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">
                    Review
                  </button>
                  <button v-if="application.endorsement_decision === 'Approved'"
                    @click="downloadCertificate(application.id)" class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">
                    Download Certificate
                  </button>
                  <span v-if="!application.is_payment_complete" class="text-red-500 text-xs">
                    Payment Pending
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="!displayedApplications.length && !isLoading" class="text-center py-8">
          <InboxIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No applications</h3>
          <p class="mt-1 text-sm text-gray-500">No COGS applications found matching your criteria.</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-md">
        <div class="text-sm text-gray-700">
          Page {{ currentPage }} of {{ totalPages }}
        </div>
        <div class="flex space-x-2">
          <button @click="currentPage--" :disabled="currentPage === 1"
            class="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <button @click="currentPage++" :disabled="currentPage === totalPages"
            class="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
      <!-- Review Modal -->
      <Transition name="modal">
        <div v-if="selectedApplication"
          class="fixed z-50 inset-0 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-start justify-center pt-4 px-4 pb-20 sm:p-0">
          <div class="relative w-full max-w-6xl mx-auto mt-10">
            <!-- Modal Content -->
            <div class="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
              <!-- Modal Header -->
              <div class="bg-gray-50 px-8 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">Application Review</h2>
                  <p class="text-sm text-gray-500 mt-1">Registration No: {{ selectedApplication.registration_no }}</p>
                </div>
                <button @click="closeReviewModal"
                  class="rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                  <XIcon class="w-6 h-6" />
                </button>
              </div>

              <!-- Modal Body -->
              <div class="px-8 py-6">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <!-- Left Column: Applicant Details -->
                  <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                      <UserIcon class="w-5 h-5 text-blue-500" />
                      Applicant Details
                    </h3>
                    <div class="space-y-4">
                      <div class="flex flex-col">
                        <span class="text-sm font-medium text-gray-500">Full Name</span>
                        <span class="text-base text-gray-900">{{ selectedApplication.full_name }}</span>
                      </div>
                      <div class="flex flex-col">
                        <span class="text-sm font-medium text-gray-500">CID No</span>
                        <span class="text-base text-gray-900">{{ selectedApplication.cid_no }}</span>
                      </div>
                      <div class="flex flex-col">
                        <span class="text-sm font-medium text-gray-500">Gender</span>
                        <span class="text-base text-gray-900">{{ selectedApplication.gender }}</span>
                      </div>
                      <div class="flex flex-col">
                        <span class="text-sm font-medium text-gray-500">Contact Info</span>
                        <span class="text-base text-gray-900">{{ selectedApplication.contact_number }}</span>
                        <span class="text-sm text-gray-600">{{ selectedApplication.email_address }}</span>
                      </div>
                      <div class="flex flex-col">
                        <span class="text-sm font-medium text-gray-500">Address</span>
                        <span class="text-base text-gray-900">{{ selectedApplication.address }}</span>
                        <span class="text-sm text-gray-600">PO Box: {{ selectedApplication.po_box }}</span>
                        <span class="text-sm text-gray-600">ZIP: {{ selectedApplication.zip_code }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Middle Column: Workplace Details -->
                  <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                      <BuildingIcon class="w-5 h-5 text-blue-500" />
                      Workplace Details
                    </h3>
                    <div class="space-y-4">
                      <div class="flex flex-col">
                        <span class="text-sm font-medium text-gray-500">Agency</span>
                        <span class="text-base text-gray-900">{{ selectedApplication.agency?.name || 'N/A' }}</span>
                      </div>
                      <div class="flex flex-col">
                        <span class="text-sm font-medium text-gray-500">Department</span>
                        <span class="text-base text-gray-900">{{ selectedApplication.department?.name || 'N/A' }}</span>
                      </div>
                      <div class="flex flex-col">
                        <span class="text-sm font-medium text-gray-500">Workplace</span>
                        <span class="text-base text-gray-900">{{ selectedApplication.workplace?.name || 'N/A' }}</span>
                      </div>
                      <div class="flex flex-col">
                        <span class="text-sm font-medium text-gray-500">Supervisor</span>
                        <span class="text-base text-gray-900">{{ selectedApplication.supervisor_name }}</span>
                        <span class="text-sm text-gray-600">{{ selectedApplication.supervisor_designation }}</span>
                      </div>
                      <div class="flex flex-col">
                        <span class="text-sm font-medium text-gray-500">Application Reason</span>
                        <span class="text-base text-gray-900">{{ selectedApplication.reason_for_application }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Right Column: Status & Review -->
                  <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                      <ClipboardIcon class="w-5 h-5 text-blue-500" />
                      Review Status
                    </h3>
                    <div class="space-y-4">
                      <div class="rounded-lg bg-gray-50 p-4">
                        <span class="text-sm font-medium text-gray-500">Current Status</span>
                        <div class="mt-1 flex items-center gap-2">
                          <span :class="[
                            'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                            getStatusClass(selectedApplication.review_status)
                          ]">
                            {{ selectedApplication.review_status }}
                          </span>
                        </div>
                        <p class="mt-2 text-sm text-gray-600">{{ selectedApplication.review_remark || 'No remarks' }}</p>
                      </div>

                      <div class="rounded-lg bg-gray-50 p-4">
                        <span class="text-sm font-medium text-gray-500">Endorsement</span>
                        <div class="mt-1 flex items-center gap-2">
                          <span :class="[
                            'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                            getStatusClass(selectedApplication.endorsement_decision)
                          ]">
                            {{ selectedApplication.endorsement_decision }}
                          </span>
                        </div>
                        <p class="mt-2 text-sm text-gray-600">{{ selectedApplication.endorsement_remark || 'No remarks' }}
                        </p>
                      </div>

                      <div class="rounded-lg bg-gray-50 p-4">
                        <span class="text-sm font-medium text-gray-500">Payment Status</span>
                        <div class="mt-1">
                          <span :class="[
                            'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                            selectedApplication.is_payment_complete ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          ]">
                            {{ selectedApplication.is_payment_complete ? 'Paid' : 'Pending' }}
                          </span>
                          <p v-if="selectedApplication.is_payment_complete" class="mt-2 text-sm text-gray-600">
                            Payment ID: {{ selectedApplication.payment_id }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="mt-8 flex justify-end gap-4 border-t pt-6">
                  <button @click="handleReviewAction('Rejected')"
                    class="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 bg-white rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
                    <XCircleIcon class="w-5 h-5 mr-2" />
                    Reject
                  </button>
                  <button @click="handleReviewAction('Approved')"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                    <CheckCircleIcon class="w-5 h-5 mr-2" />
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
      <!-- Confirmation Modal -->
      <Transition name="modal">
        <div v-if="showConfirmation"
          class="fixed z-50 inset-0 overflow-y-auto bg-black/75 flex items-center justify-center">
          <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <p class="text-lg text-gray-800">{{ confirmationMessage }}</p>
            <div class="mt-6 flex justify-end space-x-4">
              <button @click="cancelReviewAction"
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50">
                Cancel
              </button>
              <button @click="confirmReviewAction"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                Confirm
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import {
  Loader2Icon,
  SearchIcon,
  AlertCircleIcon,
  InboxIcon,
  XIcon,
  UserIcon,
  BuildingIcon,
  ClipboardIcon,
  CheckCircleIcon,
  XCircleIcon
} from 'lucide-vue-next'
import services from '@/services/services'


const applications = ref([])  // Store the raw API response
const isLoading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10); //  Set items per page
const selectedApplication = ref(null);
const showConfirmation = ref(false);
const confirmationMessage = ref('');
const actionType = ref('');
const reviewRemark = ref('');   //for remarks
const endorsementRemark = ref('');
const statusField = ref('');  // Add statusField


// Computed Properties for Filtering and Pagination
const filteredApplications = computed(() => {
  let filtered = applications.value;

  if (statusFilter.value) {
    filtered = filtered.filter(app =>
      app.review_status === statusFilter.value || app.endorsement_decision === statusFilter.value
    );
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(app =>
      app.full_name.toLowerCase().includes(query) ||
      (app.cid_no && app.cid_no.toLowerCase().includes(query)) ||
      (app.registration_no && app.registration_no.toLowerCase().includes(query))
    );
  }
  return filtered;
});


const totalPages = computed(() => {
  return Math.ceil(filteredApplications.value.length / itemsPerPage.value);
});

const displayedApplications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredApplications.value.slice(start, end);
});

// Fetch Data
const fetchData = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await services.getBmhcCogs();
    applications.value = response.data.results; // Store the results
  } catch (err) {
    error.value = 'Failed to load applications. Please try again later.';
    console.error('Error fetching applications:', err);
  } finally {
    isLoading.value = false;
  }
};

// Watchers for Search, Filter, and Pagination
watch([searchQuery, statusFilter], () => {
  currentPage.value = 1; // Reset to the first page when search/filter changes
});

watch(currentPage, () => {


});

onMounted(fetchData); // Initial fetch

// Methods
const getStatusClass = (status) => {
  const classes = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Processing': 'bg-yellow-100 text-yellow-800', // Added for "Processing"
    // Add more status mappings as needed
  };
  return classes[status] || 'bg-gray-100 text-gray-800'; // Default class
};

const reviewApplication = (application) => {
  selectedApplication.value = application;
  // Initialize remarks with existing values or empty strings
  reviewRemark.value = application.review_remark || '';
  endorsementRemark.value = application.endorsement_remark || '';
};

const downloadCertificate = async (id) => {
  try {
    const response = await services.downloadCogsCertificate(id)
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `COGS_Certificate_${id}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (err) {
    console.error('Error downloading certificate:', err)
    error.value = 'Failed to download certificate. Please try again later.'
  }
}

const handleReviewAction = (action, field) => {
  actionType.value = action;
  statusField.value = field;
  confirmationMessage.value = `Are you sure you want to ${action === 'Processing' ? 'mark as Processing' : action} this application's ${field === 'review_status' ? 'review' : 'endorsement'}?`;
  showConfirmation.value = true;
};


const confirmReviewAction = async () => {
  try {
    let updateData = {};

    if (statusField.value === 'review_status') {
      updateData = {
        review_status: actionType.value,
        review_remark: reviewRemark.value,
      };
    } else if (statusField.value === 'endorsement_decision') {
      updateData = {
        endorsement_decision: actionType.value,
        endorsement_remark: endorsementRemark.value,
      };
    }
    console.log("Sending updateData:", updateData); // Debugging line

    const response = await services.patchBmhcCogs(selectedApplication.value.id, updateData);
    console.log("API Response:", response); // Debugging line


    if (response.status === 200) {
      // Find and update the specific application in the applications array
      const index = applications.value.findIndex(app => app.id === selectedApplication.value.id);
      if (index !== -1) {
        //  Update the relevant fields.  Use spread to avoid mutation issues
        applications.value = [
          ...applications.value.slice(0, index),
          { ...applications.value[index], ...response.data }, // Merge updates
          ...applications.value.slice(index + 1)
        ];
      }
      closeReviewModal();
    } else {
      console.error('Failed to update application:', response);
      error.value = 'Failed to update application. Please try again.';
    }
  } catch (err) {
    console.error('Error updating application:', err);
    error.value = 'Failed to update application. Please try again.';
  } finally {
    showConfirmation.value = false;
  }
};
const cancelReviewAction = () => {
  showConfirmation.value = false;
};

const closeReviewModal = () => {
  selectedApplication.value = null;
  reviewRemark.value = '';
  endorsementRemark.value = '';
};

</script>