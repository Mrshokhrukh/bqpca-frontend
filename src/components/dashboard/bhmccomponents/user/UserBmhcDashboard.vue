<template>
  <div class=" bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <ProfileHeader :user-detail="userDetail" :renewal-message="renewalMessage"
        :show-certificate="showViewCertificateButton" @view-certificate="openCertificateModal" />

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="CPD Credits" icon="Award" :progress="cpdCredits" :total="50" type="progress" />
        <LicenseStatusCard :expiry-date="licenseExpiryDate" :status="licenseStatus" />
        <ApplicationHistoryCard :applications="applications" @show-rejected="showRejectedApplications" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActivityFeed title="Recent Activities" :activities="recentActivities" />
        <DeadlinesList title="Upcoming Deadlines" :deadlines="upcomingDeadlines" />
      </div>

      <ApplicationsModal v-if="selectedApplications.length" :applications="selectedApplications" :title="modalTitle"
        @close="closeApplicationsModal" @visit="visitApplication" />

      <!-- Pass selectedApplication to the modal -->
      <CertificateModal v-if="showCertificateModal" :application="selectedApplication"
        @close="closeCertificateModal" />

      <LoadingSpinner v-if="isLoading" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { useDashboardStore } from '@/stores/mhpcUserDahboardStore';

// Components
import ProfileHeader from './dashboard/ProfileHeader.vue';
import StatCard from './dashboard/StatCard.vue';
import LicenseStatusCard from './dashboard/LicenseStatusCard.vue';
import ApplicationHistoryCard from './dashboard/ApplicationHistoryCard.vue';
import ActivityFeed from './dashboard/ActivityFeed.vue';
import DeadlinesList from './dashboard/DeadlinesList.vue';
import ApplicationsModal from './dashboard/ApplicationsModal.vue';
import CertificateModal from './modals/CertificateModal.vue';
import LoadingSpinner from './common/LoadingSpinner.vue';

// Store setup
const authStore = useAuthStore();
const dashboardStore = useDashboardStore();
const { user } = storeToRefs(authStore);

// State
const {
  userDetail,
  applications,
  cpdCredits,
  licenseExpiryDate,
  licenseStatus,
  renewalMessage,
  showViewCertificateButton,
  recentActivities,
  upcomingDeadlines,
  selectedApplications,
  modalTitle,
  isLoading,
  selectedApplication, // Get the selected application from the store
  showCertificateModal
} = storeToRefs(dashboardStore);

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
    // Handle error state
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
    CPD: '/admin/user/health_certification/cpd',
    License: '/admin/user/health_certification/practitioner_reg_and_cert/registration'
  };

  if (app.type in routes && app.status === 'Rejected') {
    window.location.href = routes[app.type];
  }
};

const openCertificateModal = async () => {
  try {
     // The store action now handles setting the selected application
    dashboardStore.setShowCertificateModal(true);
  } catch (error) {
    console.error('Error fetching certificate data:', error);
  }
};

const closeCertificateModal = () => {
  dashboardStore.setShowCertificateModal(false);
};

onMounted(fetchDashboardData);
</script>
