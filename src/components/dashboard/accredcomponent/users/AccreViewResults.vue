<template>
  <div class="p-6 font-sans">
    <h1 class="text-2xl font-bold mb-6">Application Tracker</h1>

    <div class="mb-6 flex gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        @input="filterApplications"
        class="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        v-model="selectedFilter"
        @change="filterApplications"
        class="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="appealed">Appealed</option>
      </select>
    </div>

    <div class="mb-6">
      <div class="border-b border-gray-200">
        <nav class="flex flex-wrap -mb-px">
          <button
            @click="activeTab = 'applications'"
            :class="[
              'py-2 px-4 font-medium text-sm',
              activeTab === 'applications'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Applications
          </button>
          <button
            @click="activeTab = 'accreditations'"
            :class="[
              'py-2 px-4 font-medium text-sm',
              activeTab === 'accreditations'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Accreditations
          </button>
          <button
            @click="activeTab = 'appeals'"
            :class="[
              'py-2 px-4 font-medium text-sm',
              activeTab === 'appeals'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Appeals
          </button>
        </nav>
      </div>
    </div>

    <div v-if="activeTab === 'applications'">
      <h2 class="text-xl font-semibold mb-4">Applications</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200">
          <thead>
            <tr class="bg-gray-100">
              <th class="py-3 px-4 text-left border border-gray-200">ID</th>
              <th class="py-3 px-4 text-left border border-gray-200">Institution Name</th>
              <th class="py-3 px-4 text-left border border-gray-200">Application Date</th>
              <th class="py-3 px-4 text-left border border-gray-200">Status</th>
              <th class="py-3 px-4 text-left border border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredApplications.length === 0">
              <td colspan="5" class="py-4 px-4 text-center border border-gray-200">No applications found.</td>
            </tr>
            <tr v-for="application in filteredApplications" :key="application.id" class="hover:bg-gray-50">
              <td class="py-3 px-4 border border-gray-200">{{ application.id }}</td>
              <td class="py-3 px-4 border border-gray-200">{{ application.institution_name }}</td>
              <td class="py-3 px-4 border border-gray-200">{{ formatDate(application.created_at) }}</td>
              <td class="py-3 px-4 border border-gray-200">
                <span :class="getStatusClasses(application.status)">
                  {{ application.status }}
                </span>
              </td>
              <td class="py-3 px-4 border border-gray-200">
                <!-- Download Certificate button for approved/active applications -->
                <button
                  v-if="isApproved(application.status)"
                  @click="showCertificate(application)"
                  class="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm mr-2"
                >
                  View Certificate
                </button>

                <!-- Appeal button for rejected/regretted applications -->
                <button
                  v-if="isRejected(application.status)"
                  @click="goToAppealPage(application)"
                  class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm"
                >
                  Appeal
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="activeTab === 'accreditations'">
      <h2 class="text-xl font-semibold mb-4">Accreditations</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200">
          <thead>
            <tr class="bg-gray-100">
              <th class="py-3 px-4 text-left border border-gray-200">ID</th>
              <th class="py-3 px-4 text-left border border-gray-200">Applicant Name</th>
              <th class="py-3 px-4 text-left border border-gray-200">Accreditation Date</th>
              <th class="py-3 px-4 text-left border border-gray-200">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="accreditations.length === 0">
              <td colspan="4" class="py-4 px-4 text-center border border-gray-200">No accreditations found.</td>
            </tr>
            <tr v-for="accreditation in accreditations" :key="accreditation.id" class="hover:bg-gray-50">
              <td class="py-3 px-4 border border-gray-200">{{ accreditation.id }}</td>
              <td class="py-3 px-4 border border-gray-200">{{ accreditation.applicantName }}</td>
              <td class="py-3 px-4 border border-gray-200">{{ accreditation.accreditationDate }}</td>
              <td class="py-3 px-4 border border-gray-200">
                <span :class="getStatusClasses(accreditation.status)">
                  {{ accreditation.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="activeTab === 'appeals'">
      <h2 class="text-xl font-semibold mb-4">Appeals</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white border border-gray-200">
          <thead>
            <tr class="bg-gray-100">
              <th class="py-3 px-4 text-left border border-gray-200">Appeal ID</th>
              <th class="py-3 px-4 text-left border border-gray-200">Application ID</th>
              <th class="py-3 px-4 text-left border border-gray-200">Applicant Name</th>
              <th class="py-3 px-4 text-left border border-gray-200">Appeal Date</th>
              <th class="py-3 px-4 text-left border border-gray-200">Reason</th>
              <th class="py-3 px-4 text-left border border-gray-200">Status</th>
              <th class="py-3 px-4 text-left border border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="appeals.length === 0">
              <td colspan="7" class="py-4 px-4 text-center border border-gray-200">No appeals found.</td>
            </tr>
            <tr v-for="appeal in appeals" :key="appeal.id" class="hover:bg-gray-50">
              <td class="py-3 px-4 border border-gray-200">{{ appeal.id }}</td>
              <td class="py-3 px-4 border border-gray-200">{{ appeal.applicationId }}</td>
              <td class="py-3 px-4 border border-gray-200">{{ appeal.applicantName }}</td>
              <td class="py-3 px-4 border border-gray-200">{{ appeal.appealDate }}</td>
              <td class="py-3 px-4 border border-gray-200">{{ appeal.reason }}</td>
              <td class="py-3 px-4 border border-gray-200">
                <span :class="getStatusClasses(appeal.status)">
                  {{ appeal.status }}
                </span>
              </td>
              <td class="py-3 px-4 border border-gray-200">
                <button
                  v-if="appeal.status === 'pending'"
                  @click="approveAppeal(appeal)"
                  class="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
                >
                  Approve
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
      <ViewCertificateModal :show="showModal" :certificateData="currentCertificateData" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '@/services/services'; // Import apiService
import ViewCertificateModal from '@/components/common/Accreditation/AccreViewCertificateModal.vue';

const router = useRouter();
const activeTab = ref('applications');
const searchQuery = ref('');
const selectedFilter = ref('all');
const backendApplications = ref([]); // Ref to store backend data
const accreditations = ref([]);
const appeals = ref([]);
const showModal = ref(false);
const currentCertificateData = ref({});

const applications = computed(() => {
  return backendApplications.value.map(app => ({
    id: app.id,
    institution_name: app.name_of_institution, // Use name_of_institution
    created_at: app.year_of_establishment ? new Date(app.year_of_establishment, 0, 1).toISOString() : null, // Use year_of_establishment as date placeholder
    status: app.review_decision?.decision_name || 'pending', // Access decision_name from nested object, default to 'pending'
    review_decision: app.review_decision, // Keep the full review_decision object if needed
    // Add other institution details here for the appeal form
    address: app.address,
    dzongkhag_thromde: app.dzongkhag_thromde,  // Corrected property name
    contact: app.contact,
    email: app.email
  }));
});

const filteredApplications = computed(() => {
  let filtered = [...applications.value];

  // Apply status filter
  if (selectedFilter.value !== 'all') {
    filtered = filtered.filter(app => {
      const normalizedSelectedFilter = selectedFilter.value.toLowerCase();
      const normalizedAppStatus = app.status ? app.status.toLowerCase() : '';

      if (normalizedSelectedFilter === 'pending') {
        return normalizedAppStatus === 'pending' || normalizedAppStatus === 'applied' || normalizedAppStatus === 'processing_payment'; // Include other pending statuses if needed
      } else if (normalizedSelectedFilter === 'approved') {
        return normalizedAppStatus === 'approved' || normalizedAppStatus === 'active'; // Include other approved statuses if needed
      } else if (normalizedSelectedFilter === 'rejected') {
        return normalizedAppStatus === 'rejected' || normalizedAppStatus === 'regretted'; // Map "Regretted" to "rejected" or adjust as needed
      } else if (normalizedSelectedFilter === 'appealed') {
        return normalizedAppStatus === 'appealed'; // Assuming "appealed" is a possible decision_name
      }
      return false; // Should not reach here if 'all' is handled correctly
    });
  }

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(app =>
      app.institution_name.toLowerCase().includes(query) || // Use institution_name for search
      app.id.toString().includes(query)
    );
  }

  return filtered;
});

// Helper methods to check application status
const isApproved = (status) => {
  const normalizedStatus = status ? status.toLowerCase() : '';
  return normalizedStatus === 'approved' || normalizedStatus === 'active';
};

const isRejected = (status) => {
  const normalizedStatus = status ? status.toLowerCase() : '';
  return normalizedStatus === 'rejected' || normalizedStatus === 'regretted';
};

// Load initial data
onMounted(async () => {
  try {
    const response = await apiService.getInstitutionProfiles();
    console.log("Institution Profiles Response:", response);
    backendApplications.value = response.data.results || []; // Assuming results array contains applications

    // Initially filter applications after loading data
    filterApplications();

  } catch (error) {
    console.error("Error fetching institution profiles:", error);
    // Handle error appropriately, e.g., show a toast or message to the user
  }
});

const filterApplications = () => {
  // This function is now using the computed `filteredApplications` ref
  // No need to re-implement filtering logic here, it's in the computed property
};

const showCertificate = (application) => {
    currentCertificateData.value = {
        institutionName: application.institution_name,
        grade: application.review_decision?.grade || 'N/A', // Assuming grade is in review_decision.  Adjust if needed.
        validUntil: '2024-12-31', //  Replace with actual validity date from your data, if available.
        date: new Date().toISOString()
    };
    showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  currentCertificateData.value = {}; // Clear the data after closing
};

const goToAppealPage = (application) => {
    router.push({
    path: '/admin/user/accreditation/appeal',
    query: {
      applicationId: application.id,
      institutionName: application.institution_name,
      address: application.address,
      dzongkhagThromde: application.dzongkhag_thromde,
      contact: application.contact,
      email: application.email,
    }
  });
};

const approveAppeal = (appeal) => {
  // Update appeal status
  appeal.status = 'approved';

  // Find and update the corresponding application
  const application = applications.value.find(app => app.id === appeal.applicationId);
  if (application) {
    application.status = 'approved';

    // Create a new accreditation
    const newAccreditation = {
      id: accreditations.value.length + 1,
      applicantName: application.applicantName,
      accreditationDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    accreditations.value.push(newAccreditation);
  }

  filterApplications();
};

const getStatusClasses = (status) => {
  const normalizedStatus = status ? status.toLowerCase() : '';
  switch (normalizedStatus) {
    case 'pending':
    case 'applied':
    case 'processing_payment':
      return 'inline-block py-1 px-2 rounded text-xs font-medium bg-yellow-100 text-yellow-800';
    case 'approved':
    case 'active':
      return 'inline-block py-1 px-2 rounded text-xs font-medium bg-green-100 text-green-800';
    case 'rejected':
    case 'regretted': // Assuming "Regretted" from API means "rejected"
      return 'inline-block py-1 px-2 rounded text-xs font-medium bg-red-100 text-red-800';
    case 'appealed':
      return 'inline-block py-1 px-2 rounded text-xs font-medium bg-blue-100 text-blue-800';
    default:
      return 'inline-block py-1 px-2 rounded text-xs font-medium bg-gray-100 text-gray-800';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(); // Format as local date string (e.g., MM/DD/YYYY)
};
</script>

<style scoped>
/* Your component-specific styles here if needed */
</style>