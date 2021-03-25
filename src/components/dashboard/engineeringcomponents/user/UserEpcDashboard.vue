<template>
  <div class="bg-gray-50 p-6 min-h-screen">
    <div class="max-w-7xl mx-auto space-y-6">
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

      <LoadingSpinner v-if="isLoading" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
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
// Removed Empty State Components
// import EmptyDashboardState from './dashboardComponents/EmptyDashboardStates.vue';
// import FirstDashboardState from './dashboardComponents/FirstDashboardStates.vue';

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
  if (!applications.value) return [];
  const allQualifications = applications.value.flatMap(app => app.user_qualifications || []);
  return allQualifications.filter(q => q.is_primary_qualification && q.endorsement_decision === 'Approved');
});


// Methods
const fetchDashboardData = async () => {
  if (!user.value?.cid) {
    console.error('User CID not found');
    return;
  }

  try {
    await dashboardStore.fetchAllData(user.value.cid);
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
  const routes = {
    CPD: '/admin/user/engineering/cpd',
    License: '/admin/user/engineering/practitioner_reg_and_cert/registration'
  };

  if (app.type in routes && app.status === 'Rejected') {
    window.location.href = routes[app.type];
  }
};

// Handle View Certificate
const handleViewCertificate = () => {
  dashboardStore.setShowCertificateModal(true);

  // Find the primary and approved qualification
  const primaryApprovedQualification = getPrimaryQualifications.value[0]; // Get the first one

  if (primaryApprovedQualification) {
    // Find the application from which the qualification belongs
    const applicationForCertificate = applications.value.find(app =>
      app.user_qualifications.some(q => q.id === primaryApprovedQualification.id)
    );

    if (applicationForCertificate) {
      dashboardStore.setSelectedApplication({ results: [applicationForCertificate] });
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

</script>