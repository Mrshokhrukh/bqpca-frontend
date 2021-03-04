<template>
  <div class="bg-gray-50 p-6 min-h-screen">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Empty state when no approved applications -->
      <FirstDashboardState v-if="hasNoApplications && !isLoading"
        message="You don't have any approved applications yet.  Once approved, you will have access to the dashboard." />
      <EmptyDashboardState v-else-if="!hasApprovedApplications && !isLoading"
        message="You don't have any approved applications yet.  Once approved, you will have access to the dashboard." />

      <template v-else>
        <ProfileHeader :user-detail="userDetail" :renewal-message="renewalStatus"
          :qualifications="getPrimaryQualifications" @view-certificate="handleViewCertificate" />

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
      </template>

      <LoadingSpinner v-if="isLoading" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
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
import CertificateModal from '../../../common/MHPCCertificateModal.vue';
import LoadingSpinner from '../../../common/MHPCLoadingSpinner.vue';
import EmptyDashboardState from './dashboard/EmptyDashboardState.vue';
import FirstDashboardState from './dashboard/FirstDashboardState.vue';

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
  // renewalMessage,
  // showViewCertificateButton, // No longer needed, computed in ProfileHeader
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

  // Flatten all qualifications from all applications into a single array.  Much more robust.
  const allQualifications = applications.value.flatMap(app => app.user_qualifications || []);

  //Filter and return
  return allQualifications.filter(q => q.is_primary_qualification && q.endorsement_decision === 'Approved');
});

// Computed property to check if user has any approved applications
const hasApprovedApplications = computed(() => {
  if (!applications.value || applications.value.length === 0) return false;

  return applications.value.some(app => {
    // Check if application has user_qualifications array
    if (!app.user_qualifications || !Array.isArray(app.user_qualifications)) return false;

    // Check if any qualification meets the criteria
    return app.user_qualifications.some(qualification =>
      qualification.endorsement_decision === 'Approved'
    );
  });
});

const hasNoApplications = computed(() => {
  return applications.value?.length === 0;  // Correct and concise check
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
    CPD: '/admin/user/health_certification/cpd',
    License: '/admin/user/health_certification/practitioner_reg_and_cert/registration'
  };

  if (app.type in routes && app.status === 'Rejected') {
    window.location.href = routes[app.type];
  }
};

// Renamed to handleViewCertificate for clarity and consistency
const handleViewCertificate = () => {
  // Trigger the logic to show the certificate modal, likely by setting a reactive variable.
  dashboardStore.setShowCertificateModal(true);
  //find the primary and approved qualification
  const primaryApprovedQualification = getPrimaryQualifications.value[0] //get the first one

  if (primaryApprovedQualification) {
    //find the application from which the qualification belongs to, important since selectedApplication expects application object
    const applicationForCertificate = applications.value.find(app =>
      app.user_qualifications.some(q => q.id === primaryApprovedQualification.id)
    );

    if (applicationForCertificate) {
      dashboardStore.setSelectedApplication({ results: [applicationForCertificate] }); //set the selected application to the store, since that's what's used in the template
    }
    else {
      console.error('Application not found for the primary qualification');
    }
  }
  else {
    console.error('No primary and approved qualification found to display certificate.');
  }
};

const closeCertificateModal = () => {
  dashboardStore.setShowCertificateModal(false);
  dashboardStore.setSelectedApplication(null); //clear selected application
};

onMounted(fetchDashboardData);

// Watch for changes in applications array to determine enablement of DPR
watch(applications, (newApplications) => {
  // Check for approved EOI applications
  const approvedEoi = newApplications.find(app => app.type === 'EOI' && app.status === 'Approved');

  if (approvedEoi) {
    // Enable DPR - logic depends on how this is reflected in your UI
    console.log('DPR is enabled for application:', approvedEoi.id);
    // Implement whatever logic enables the DPR form, e.g., set a reactive variable
    // that controls the visibility of the DPR button/form.
  } else {
    // Disable DPR
    console.log('DPR is disabled');
    // Disable the DPR form, e.g., set the reactive variable to false.
  }
}, { deep: true });

//Watch for changes in userDetail
watch(userDetail, (newUserDetails) => {
  if (newUserDetails && newUserDetails.username) {
    fetchDashboardData()
  }
}, { deep: true })
</script>
