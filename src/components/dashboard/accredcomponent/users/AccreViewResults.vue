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
        <option value="accredited">Accredited</option>
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
                <!-- Download Certificate button for accredited applications -->
                <button
                  v-if="isAccredited(application)"
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
    institution_name: app.name_of_institution,
    created_at: app.year_of_establishment ? new Date(app.year_of_establishment, 0, 1).toISOString() : null,
    // Use accreditation_decision, default to 'pending' if null
    status: app.accreditation_decision?.decision_name || 'pending',
    accreditation_decision: app.accreditation_decision, // Keep for other checks
    review_decision: app.review_decision,  //keep if we need later.
    address: app.address,
    dzongkhag_thromde: app.dzongkhag_thromde,
    contact: app.contact_number,
    email: app.email_address,
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
        return normalizedAppStatus === 'pending' || normalizedAppStatus === 'applied' || normalizedAppStatus === 'processing_payment';
      } else if (normalizedSelectedFilter === 'accredited') {
        return normalizedAppStatus === 'accredited';
      } else if (normalizedSelectedFilter === 'rejected') {
        return normalizedAppStatus === 'rejected' || normalizedAppStatus === 'regretted';
      } else if (normalizedSelectedFilter === 'appealed') {
        return normalizedAppStatus === 'appealed';
      }
      return false;
    });
  }

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(app =>
      app.institution_name.toLowerCase().includes(query) ||
      app.id.toString().includes(query)
    );
  }

  return filtered;
});

// Helper methods to check application status
const isAccredited = (application) => {
    return application.accreditation_decision && application.accreditation_decision.decision_name === 'Accrediated';
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
    backendApplications.value = response.data.results || [];
    filterApplications();

  } catch (error) {
    console.error("Error fetching institution profiles:", error);
  }
});

const filterApplications = () => {
  // Now handled by the computed property.
};

const showCertificate = (application) => {
    currentCertificateData.value = {
        institutionName: application.institution_name,
        grade: application.review_decision?.grade || 'N/A', // Get grade, default to 'N/A'
        validUntil: application.accreditation_decision?.validity_if_approved || '2024-12-31',  //from accreditation decision
        date: new Date().toISOString()
    };
    showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  currentCertificateData.value = {}; // Clear data
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
    appeal.status = 'approved';

    // Find the corresponding application and update its status
    const application = backendApplications.value.find(app => app.id === appeal.applicationId);
      if (application) {
           if (!application.accreditation_decision) {
               application.accreditation_decision = {};
             }
          application.accreditation_decision.decision_name = 'accredited';
          application.status = 'accredited';

        // Create a new accreditation entry.
        const newAccreditation = {
          id: accreditations.value.length + 1,
          applicantName: application.name_of_institution,
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
    case 'accredited':
      return 'inline-block py-1 px-2 rounded text-xs font-medium bg-green-100 text-green-800';
    case 'rejected':
    case 'regretted':
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
  return date.toLocaleDateString();
};
</script>

<style scoped>
/* Component-specific styles */
</style>