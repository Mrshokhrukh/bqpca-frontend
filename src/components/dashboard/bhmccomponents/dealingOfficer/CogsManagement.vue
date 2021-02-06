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
          <!-- Consider adding "Processing" or other statuses from your API -->
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
                <button @click="reviewApplication(application.id)" class="text-blue-600 hover:text-blue-900 block">
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
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Loader2Icon,
  SearchIcon,
  AlertCircleIcon,
  InboxIcon
} from 'lucide-vue-next'
import services from '@/services/services'

const applications = ref([])  // Store the raw API response
const isLoading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10); //  Set items per page


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

const reviewApplication = (id) => {
  router.push(`/health_certification/cogs/${id}`)
}

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
</script>