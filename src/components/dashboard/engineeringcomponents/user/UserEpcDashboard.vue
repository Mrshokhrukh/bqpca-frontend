<template>
  <div class="bg-gray-50 p-6 min-h-screen">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Empty state when no applications at all -->
      <FirstDashboardState v-if="hasNoApplications && !isLoading"
        message="You don't have any applications yet.  Once you submit an application, you'll see it here." />
      <!-- Empty state when there are applications, but none are approved -->
      <EmptyDashboardState v-else-if="!hasApprovedApplications && !isLoading"
        message="You don't have any approved applications yet. Once approved, you will have access to the dashboard." />

      <template v-else>
        <ProfileHeader :user-detail="userDetail" :renewal-message="renewalStatus"
          :qualifications="getPrimaryQualifications" @view-certificate="handleViewCertificate" />
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="CPD Credits" icon="Award" :progress="cpdCredits" :total="50" type="progress" />
          <CogsStatusCard :expiry-date="licenseExpiryDate" :status="licenseStatus" />
          <ActivityFeed title="Recent Activities" :activities="recentActivities" />
        </div>

        <ApplicationHistoryCard :applications="applications" @show-rejected="showRejectedApplications" />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DeadlinesList title="Upcoming Deadlines" :deadlines="upcomingDeadlines" />
        </div>

        <ApplicationModal v-if="selectedApplications.length" :applications="selectedApplications" :title="modalTitle"
          @close="closeApplicationsModal" @visit="visitApplication" />

        <!-- Pass selectedApplication to the modal -->
        <CertificateModal v-if="showCertificateModal" :application="selectedApplication"
          @close="closeCertificateModal" />
      </template>

      <LoadingSpinner v-if="isLoading" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch, ref } from 'vue'; // Import ref
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { useEpcDashboardStore } from '@/stores/epcUserDashboardStore';

// Components
import ProfileHeader from './dashboardComponents/ProfileHeaders.vue';
import StatCard from './dashboardComponents/StatCards.vue';
import CogsStatusCard from './dashboardComponents/CogsStatusCards.vue';
import ApplicationHistoryCard from './dashboardComponents/ApplicationHistoryCards.vue';
import ActivityFeed from './dashboardComponents/ActivityFeeds.vue';
import DeadlinesList from './dashboardComponents/DeadlinesLists.vue';
import ApplicationModal from './dashboardComponents/ApplicationModal.vue';
import CertificateModal from '../../../common/EPC/EPCCertificateModal.vue';
import LoadingSpinner from '../../../common/EPC/EPCLoadingSpinner.vue';
import EmptyDashboardState from './dashboardComponents/EmptyDashboardStates.vue';
import FirstDashboardState from './dashboardComponents/FirstDashboardStates.vue';

// Store setup
const authStore = useAuthStore();
const dashboardStore = useEpcDashboardStore();
const { user } = storeToRefs(authStore);

// State
const {
  userDetail,
  applications,
  cpdCredits,
  licenseExpiryDate,
  licenseStatus,
  renewalMessage: renewalStatus,
  recentActivities,
  upcomingDeadlines,
  selectedApplications,
  modalTitle,
  isLoading,
  selectedApplication,
  showCertificateModal
} = storeToRefs(dashboardStore);



// Computed property to get primary qualifications for the ProfileHeader
const getPrimaryQualifications = computed(() => {
  if (!applications.value) {
    console.warn('Applications data is undefined or null.');
    return [];
  }

  const primaryQualifications = [];

  applications.value.forEach(app => {
    if (app.user_qualifications && Array.isArray(app.user_qualifications)) {
      app.user_qualifications.forEach(qualification => {
        if (qualification.is_primary_qualification && qualification.endorsement_decision === 'Approved') {
          primaryQualifications.push(qualification);
        }
      });
    } else {
      console.warn(`Application ${app.id} has no valid user_qualifications array.`);
    }
  });
  console.info('Primary qualifications:', primaryQualifications);
  return primaryQualifications;
});


// Computed property to check if user has any approved applications
const hasApprovedApplications = computed(() => {
  if (!applications.value) {
    console.warn('No applications found.');
    return false;
  }
  let hasApproved = false;

    applications.value.forEach(app => {
      if (app.user_qualifications && Array.isArray(app.user_qualifications)) {
        if (app.user_qualifications.some(q => q.endorsement_decision === 'Approved')) {
            hasApproved = true;
        }
      } else {
         console.warn(`Application ${app.id} has no valid user_qualifications array or it's undefined.`);
      }
    });

  console.info('Has approved applications:', hasApproved);
  return hasApproved;
});


// Computed property to check if the user has NO applications at all.
const hasNoApplications = computed(() => {
  return !applications.value || applications.value.length === 0;
});

// Methods
const fetchDashboardData = async () => {
  if (!user.value?.cid) {
    console.error('User CID not found');
    return;
  }

  try {
    console.info('Fetching dashboard data for CID:', user.value.cid);
    await dashboardStore.fetchAllData(user.value.cid);
    console.info('Dashboard data fetched successfully:', applications.value);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
};

const showRejectedApplications = () => {
  dashboardStore.setSelectedApplications('Rejected');
};

const closeApplicationsModal = () => {
  dashboardStore.clearSelectedApplications();
};

const visitApplication = (app) => {
  // Use a map for better readability and maintainability
  const routes = {
    'test Type app': '/admin/user/engineering/cpd', // Assuming 'test Type app' is a registration_type_name
    'License': '/admin/user/engineering_certification/registration' // Keep this as a fallback, but be specific if possible
    // Add other registration types and their corresponding routes here
  };

  // Get the route based on registration_type_name, fallback to app.type if needed
  const route = routes[app.type] || routes[app.registration_type_name] || null;

  if (route && app.status === 'Rejected') {
    window.location.href = route;
  }
};


// Handle View Certificate
const handleViewCertificate = () => {
  console.info('Handling view certificate...');
  dashboardStore.setShowCertificateModal(true);

  // Get the first primary and approved qualification (if any)
  const primaryApprovedQualification = getPrimaryQualifications.value[0];

  if (primaryApprovedQualification) {
    console.info('Primary approved qualification found:', primaryApprovedQualification);

    // Find the application this qualification belongs to
    const applicationForCertificate = applications.value.find(app =>
      app.user_qualifications?.some(q => q.id === primaryApprovedQualification.id)
    );

    if (applicationForCertificate) {
      console.info('Application for certificate found:', applicationForCertificate);
      // Set the selected application in the store
      dashboardStore.setSelectedApplication(applicationForCertificate); // Pass the entire object
    } else {
      console.error('Application not found for the primary qualification');
    }
  } else {
    console.error('No primary and approved qualification found to display certificate.');
  }
};


const closeCertificateModal = () => {
  dashboardStore.setShowCertificateModal(false);
  dashboardStore.setSelectedApplication(null); // Clear selected application
};

onMounted(fetchDashboardData);

// Watch for changes in applications array
watch(applications, (newApplications) => {
  console.info('Applications updated:', newApplications);
}, { deep: true });

// Watch for changes in userDetail
watch(userDetail, (newUserDetails) => {
  console.info('User details updated:', newUserDetails);
  if (newUserDetails && newUserDetails.username) {
    fetchDashboardData();
  }
}, { deep: true });

</script>
