<template>
  <div class="bg-white shadow overflow-hidden rounded-lg">
    <div class="px-4 py-5 sm:px-6 bg-gray-50">
      <h3 class="text-lg leading-6 font-medium text-gray-900">Applications</h3>
      <p class="mt-1 max-w-2xl text-sm text-gray-500">View and track all your engineering applications.</p>
    </div>

    <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
      <div class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Application ID
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Submitted
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-if="loading" class="text-center">
                    <td colspan="5" class="px-6 py-4 whitespace-nowrap">
                      <div class="flex justify-center">
                        <div class="loader"></div>
                      </div>
                    </td>
                  </tr>
                  <tr v-else-if="applications.length === 0" class="text-center">
                    <td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      No applications found. Submit a new application to get started.
                    </td>
                  </tr>
                  <tr v-for="application in applications" :key="application.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ application.id }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ application.type }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(application.created_at) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="getStatusClass(application.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                        {{ application.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button @click="viewApplication(application)" class="text-indigo-600 hover:text-indigo-900 mr-4">
                        View
                      </button>
                      <button v-if="application.status === 'Pending'" @click="trackApplication(application)" class="text-blue-600 hover:text-blue-900">
                        Track
                      </button>
                      <button v-if="application.status === 'Rejected'" @click="resubmitApplication(application)" class="text-green-600 hover:text-green-900">
                        Resubmit
                      </button>
                      <button v-if="application.status === 'Approved' && isExpiring(application)" @click="renewApplication(application)" class="text-orange-600 hover:text-orange-900">
                        Renew
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import epcServices from '@/services/epcServices';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const applications = ref([]);
const loading = ref(true);

// Format date in a user-friendly way
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Get CSS classes for different status types
const getStatusClass = (status) => {
  const classes = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800',
    'Under Review': 'bg-blue-100 text-blue-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

// Check if an application is nearing expiry (within 3 months)
const isExpiring = (application) => {
  if (!application.expiry_date) return false;

  const expiryDate = new Date(application.expiry_date);
  const today = new Date();
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setMonth(today.getMonth() + 3);

  return expiryDate < threeMonthsFromNow;
};

// Action handlers
const viewApplication = (application) => {
  // Determine the route based on application type
  let route = '/admin/user/engineering/';

  switch (application.type) {
    case 'New Registration':
      route += 'practitioner_reg_and_cert/registration';
      break;
    case 'Renewal':
      route += 'practitioner_reg_and_cert/renewal';
      break;
    case 'Additional Qualification':
      route += 'practitioner_reg_and_cert/additional_qualification';
      break;
    case 'CPD':
      route += 'cpd';
      break;
    default:
      route += 'dashboard';
  }

  // Navigate to the application with id parameter
  router.push({ path: route, query: { id: application.id } });
};

const trackApplication = (application) => {
  // Navigate to tracking page
  router.push(`/admin/user/engineering/track?id=${application.id}`);
};

const resubmitApplication = (application) => {
  // Navigate to resubmission page based on application type
  let route = '/admin/user/engineering/';

  switch (application.type) {
    case 'New Registration':
      route += 'practitioner_reg_and_cert/registration';
      break;
    case 'Renewal':
      route += 'practitioner_reg_and_cert/renewal';
      break;
    case 'Additional Qualification':
      route += 'practitioner_reg_and_cert/additional_qualification';
      break;
    case 'CPD':
      route += 'cpd';
      break;
    default:
      route += 'dashboard';
  }

  // Add resubmit flag and application id
  router.push({ path: route, query: { resubmit: true, id: application.id } });
};

const renewApplication = (application) => {
  // Navigate to renewal page
  router.push(`/admin/user/engineering/practitioner_reg_and_cert/renewal?id=${application.id}`);
};

// Fetch applications data
const fetchApplications = async () => {
  try {
    loading.value = true;

    if (!authStore.user?.cid) {
      toast.error('User CID not found. Please log in again.');
      return;
    }

    const response = await epcServices.getApplicationWithCid(authStore.user.cid);

    // Check if response data exists
    if (response.data) {
      // Handle the specific API response structure with results array
      const dataArray = response.data.results || [];

      // Transform data to match our component's structure
      applications.value = dataArray.map(app => ({
        id: app.id,
        type: app.registration_type_name || 'New Registration',
        status: app.user_qualifications?.[0]?.application_review_status || 'Pending',
        created_at: app.created_at,
        updated_at: app.updated_at,
        expiry_date: app.expiry_date,
        remarks: app.user_qualifications?.[0]?.remarks
      }));
    } else {
      applications.value = [];
    }
  } catch (error) {
    console.error('Error fetching applications:', error);
    toast.error('Failed to load applications. Please try again later.');
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchApplications();
});
</script>

<style scoped>
.loader {
  border: 3px solid #f3f3f3;
  border-radius: 50%;
  border-top: 3px solid #3498db;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
