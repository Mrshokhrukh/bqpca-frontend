<template>
  <div class="p-6">
    <!-- Header Section -->
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Certificate of Good Standing Applications</h1>
      <div class="flex space-x-4">
        <div class="relative">
          <input v-model.trim="searchQuery" type="text" placeholder="Search by name, CID, or registration number..."
            class="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80" />
          <span class="absolute left-3 top-2.5 text-gray-400">
            <SearchIcon class="w-5 h-5" />
          </span>
        </div>
        <select v-model="statusFilter"
          class="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <Loader2Icon class="w-8 h-8 animate-spin text-blue-500" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div class="flex items-center">
        <AlertCircleIcon class="w-5 h-5 text-red-500 mr-2" />
        <p class="text-red-700">{{ error }}</p>
      </div>
    </div>

    <!-- Data Table -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
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
                <button @click="reviewApplication(application)" class="text-blue-600 hover:text-blue-900 block">
                  Review
                </button>
                <button v-if="application.endorsement_decision === 'Approved'"
                  @click="downloadCertificate(application.id)" class="text-green-600 hover:text-green-900 block">
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
    <div v-if="totalPages > 1" class="flex justify-between items-center mt-4 px-4">
      <div class="text-sm text-gray-700">
        Page {{ currentPage }} of {{ totalPages }}
      </div>
      <div class="flex space-x-2">
        <button @click="currentPage--" :disabled="currentPage === 1"
          class="px-3 py-1 border rounded-md disabled:opacity-50">
          Previous
        </button>
        <button @click="currentPage++" :disabled="currentPage === totalPages"
          class="px-3 py-1 border rounded-md disabled:opacity-50">
          Next
        </button>
      </div>
    </div>

    <!-- Review Modal -->
    <Transition name="modal">
      <div v-if="selectedApplication"
        class="fixed z-50 inset-0 overflow-y-auto bg-black bg-opacity-50 flex items-start justify-center pt-10">
        <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-5xl relative transform transition-all">
          <button @click="closeReviewModal"
            class="absolute top-4 right-6 text-gray-500 hover:text-gray-700 focus:outline-none">
            <XIcon class="w-6 h-6" />
          </button>
          <h2 class="text-3xl font-bold mb-6 text-gray-800">Review Application</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Applicant Details -->
            <div>
              <h3 class="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Applicant Details</h3>
              <div class="space-y-3">
                <p class="text-gray-600"><span class="font-medium text-gray-800">Registration No:</span> {{
                  selectedApplication.registration_no }}</p>
                <p class="text-gray-600"><span class="font-medium text-gray-800">CID No:</span> {{
                  selectedApplication.cid_no }}</p>
                <p class="text-gray-600"><span class="font-medium text-gray-800">Full Name:</span> {{
                  selectedApplication.full_name }}</p>
                <p class="text-gray-600"><span class="font-medium text-gray-800">Gender:</span> {{
                  selectedApplication.gender }}</p>
                <p class="text-gray-600"><span class="font-medium text-gray-800">Email:</span> {{
                  selectedApplication.email_address }}</p>
                <p class="text-gray-600"><span class="font-medium text-gray-800">Contact:</span> {{
                  selectedApplication.contact_number }}</p>
                <p class="text-gray-600"><span class="font-medium text-gray-800">Address:</span> {{
                  selectedApplication.address }}</p>
                <p class="text-gray-600"><span class="font-medium text-gray-800">PO Box:</span> {{
                  selectedApplication.po_box }}</p>
                <p class="text-gray-600"><span class="font-medium text-gray-800">Zip Code:</span> {{
                  selectedApplication.zip_code }}</p>
              </div>
            </div>

            <!-- Workplace & Supervisor Details -->
            <div>
              <h3 class="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Workplace & Supervisor</h3>
              <div class="space-y-3">
                <p class="text-gray-600"><span class="font-medium text-gray-800">Agency:</span> {{
                  selectedApplication.agency?.name }}</p>
                <p class="text-gray-600"><span class="font-medium text-gray-800">Department:</span> {{
                  selectedApplication.department?.name }}</p>
                <p class="text-gray-600"><span class="font-medium text-gray-800">Workplace:</span> {{
                  selectedApplication.workplace?.name }}</p>
                <p class="text-gray-600"><span class="font-medium text-gray-800">Supervisor:</span> {{
                  selectedApplication.supervisor_name }}</p>
                <p class="text-gray-600"><span class="font-medium text-gray-800">Supervisor Designation:</span> {{
                  selectedApplication.supervisor_designation }}</p>
                <p class="text-gray-600"><span class="font-medium text-gray-800">Reason for Application:</span> {{
                  selectedApplication.reason_for_application }}</p>
              </div>
            </div>

            <!-- Recipient and Review Details (Combined) -->
            <div class="md:col-span-2">
              <h3 class="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Recipient & Review Details</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-gray-600"><span class="font-medium text-gray-800">Recipient Name:</span> {{
                    selectedApplication.recipient_name }}</p>
                  <p class="text-gray-600"><span class="font-medium text-gray-800">Recipient Contact:</span> {{
                    selectedApplication.recipient_contact_number }}</p>
                  <p class="text-gray-600"><span class="font-medium text-gray-800">Recipient Email:</span> {{
                    selectedApplication.recipient_email }}</p>
                </div>
                <div>
                  <p class="text-gray-600"><span class="font-medium text-gray-800">Review Status:</span> <span
                      :class="getStatusClass(selectedApplication.review_status)">{{ selectedApplication.review_status
                      }}</span></p>
                  <p class="text-gray-600"><span class="font-medium text-gray-800">Review Remark:</span> {{
                    selectedApplication.review_remark || 'N/A' }}</p>
                  <p class="text-gray-600"><span class="font-medium text-gray-800">Endorsement:</span> <span
                      :class="getStatusClass(selectedApplication.endorsement_decision)">{{
                        selectedApplication.endorsement_decision }}</span></p>
                  <p class="text-gray-600"><span class="font-medium text-gray-800">Endorsement Remark:</span> {{
                    selectedApplication.endorsement_remark || 'N/A' }}</p>
                  <p class="text-gray-600"><span class="font-medium text-gray-800">Payment Complete:</span> {{
                    selectedApplication.is_payment_complete ? 'Yes' : 'No' }}</p>
                  <p v-if="selectedApplication.is_payment_complete" class="text-gray-600"><span
                      class="font-medium text-gray-800">Payment ID:</span> {{ selectedApplication.payment_id }}</p>
                  <p class="text-gray-600"><span class="font-medium text-gray-800">Declared:</span> {{
                    selectedApplication.declaration ? 'Yes' : 'No' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons (Approve, Reject, etc.) -->
          <div class="mt-8 flex justify-end space-x-4">
            <button @click="handleReviewAction('Approved')"
              class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200">
              Approve
            </button>
            <button @click="handleReviewAction('Rejected')"
              class="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-200">
              Reject
            </button>
            <button @click="closeReviewModal"
              class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none transition duration-200">
              Close
            </button>
          </div>

          <!-- Confirmation Modal (Nested) -->
          <ConfirmationModal v-if="showConfirmation" :message="confirmationMessage" @confirm="confirmReviewAction"
            @cancel="cancelReviewAction" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Loader2Icon,
  SearchIcon,
  AlertCircleIcon,
  InboxIcon,
  XIcon
} from 'lucide-vue-next'
import services from '@/services/services'
import ConfirmationModal from './modals/ConfirmationModal.vue'; // Import

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

const router = useRouter()

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
  // No need to call fetchData here, computed properties handle the update
});

watch(currentPage, () => {
  // No need to call fetchData here, computed properties handle the update

});

onMounted(fetchData); // Initial fetch

// Methods
const getStatusClass = (status) => {
  const classes = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    // Add more status mappings as needed
  };
  return classes[status] || 'bg-gray-100 text-gray-800'; // Default class
};

const reviewApplication = (application) => {
  selectedApplication.value = application;
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

const handleReviewAction = (action) => {
  actionType.value = action; // Store the action
  confirmationMessage.value = `Are you sure you want to ${action} this application?`;
  showConfirmation.value = true;
};

const confirmReviewAction = async () => {
  try {
    const updateData = {
      review_status: actionType.value, // Or endorsement_decision, depending on your logic
      // Add other fields you might want to update (e.g., review_remark)
    };

    const response = await services.patchBmhcCogs(selectedApplication.value.id, updateData);

    if (response.status === 200) {
      // Update the application in the local data
      const index = applications.value.findIndex(app => app.id === selectedApplication.value.id);
      if (index !== -1) {
        applications.value[index] = response.data; // Use the API response data
      }
      closeReviewModal();
    } else {
      console.error('Failed to update application:', response);
      error.value = 'Failed to update application. Please try again.'; // Display error
    }
  } catch (err) {
    console.error('Error updating application:', err);
    error.value = 'Failed to update application. Please try again.'; // Display error

  } finally {
    showConfirmation.value = false; // Close confirmation
  }
};

const cancelReviewAction = () => {
  showConfirmation.value = false; // Close confirmation
};
const closeReviewModal = () => {
  selectedApplication.value = null;
};

</script>

<style scoped>
/* Modal Transition Styles */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.4s cubic-bezier(0.52, 0.02, 0.19, 1.02);
  /* Slightly longer for a smoother effect */
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.7) translateY(-50px);
  /* Start slightly smaller and above */
}
</style>