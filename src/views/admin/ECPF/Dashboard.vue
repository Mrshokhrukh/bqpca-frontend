<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="p-4">
    <!-- User Section -->
    <template v-if="role === 'user'">
      <component :is="ecpfUserComponent" />
    </template>

    <!-- Dealing Officer Section -->
    <template v-else-if="role === 'dealing_officer'">
      <component :is="ecpfDealingOfficerComponent" />
    </template>

    <!-- Chief Section -->
    <template v-else-if="role === 'chief'">
      <component :is="ecpfChiefComponent" />
    </template>

    <!-- Admin Section -->
    <template v-else-if="role === 'admin'">
      <component :is="ecpfAdminComponent" />
    </template>

    <!-- Default Section (fallback) -->
    <template v-else>
      <StatsGrid :stats="filteredStats" />
      <ApplicationTable :applications="paginatedApplications" :current-page="currentPage" :total-results="filteredTotal"
        :per-page="perPage" @page-change="handlePageChange" />
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
// import StatsGrid from '@/components/dashboard/roqcomponents/StatsGrid.vue';
import ApplicationTable from '@/components/dashboard/roqcomponents/dealingOfficer/ApplicationsTable.vue';

// ECPF User Components
import ECPFUserDashboard from '@/components/dashboard/ecpfcomponents/user/ECPFUserDashboard.vue';
import ECPFNewApplication from '@/components/dashboard/ecpfcomponents/user/ECPFNewApplication.vue';
import ECPFLicenseRenewal from '@/components/dashboard/ecpfcomponents/user/ECPFLicenseRenewal.vue';
import ECPFPromotionalEvents from '@/components/dashboard/ecpfcomponents/user/ECPFPromotionalEvents.vue';
import ECPFHRManagement from '@/components/dashboard/ecpfcomponents/user/ECPFHRManagement.vue';
import ECPFStudentData from '@/components/dashboard/ecpfcomponents/user/ECPFStudentData.vue';
import ECPFPaymentHistory from '@/components/dashboard/ecpfcomponents/user/ECPFPaymentHistory.vue';
import ECPFUserProfile from '@/components/dashboard/ecpfcomponents/user/ECPFUserProfile.vue';
import ECPFMyApplications from '@/components/dashboard/ecpfcomponents/user/ECPFMyApplications.vue';
import ECPFChangeRequest from '@/components/dashboard/ecpfcomponents/user/ECPFChangeRequest.vue'; 
import ECPFLinkageEstablishment from '@/components/dashboard/ecpfcomponents/user/ECPFLinkageEstablishment.vue';
// Other ECPF Components
import ECPFDealingOfficerDashboard from '@/components/dashboard/ecpfcomponents/dealingOfficer/ECPFDealingOfficerDashboard.vue';
import ECPFApplicationLists from '@/components/dashboard/ecpfcomponents/dealingOfficer/ECPFApplicationLists.vue';
import ECPFVerification from '@/components/dashboard/ecpfcomponents/dealingOfficer/ECPFVerification.vue';
import ECPFChiefDashboard from '@/components/dashboard/ecpfcomponents/chief/ECPFChiefDashboard.vue';
import ECPFFinalApproval from '@/components/dashboard/ecpfcomponents/chief/ECPFFinalApproval.vue';
import ECPFAdminDashboard from '@/components/dashboard/ecpfcomponents/admin/ECPFAdminDashboard.vue';
import ECPFUserManagement from '@/components/dashboard/ecpfcomponents/admin/ECPFUserManagement.vue';

const { role, user } = useAuthStore();
const route = useRoute();
const applications = ref([]);
const currentPage = ref(1);
const perPage = ref(10);

// ECPF User Route-Based Components
const ecpfUserComponent = computed(() => {
  const path = route.path;
  switch (true) {
    case path.endsWith('/ecpf/dashboard'):
      return ECPFUserDashboard;
    case path.endsWith('/ecpf/my_applications'):
      return ECPFMyApplications;
    case path.endsWith('/ecpf/new_application'):
      return ECPFNewApplication;
    case path.endsWith('/ecpf/license_renewal'):
      return ECPFLicenseRenewal;
    case path.endsWith('/ecpf/promotion_events'):
      return ECPFPromotionalEvents; 
    case path.endsWith('/ecpf/hr_management'):
      return ECPFHRManagement;
    case path.endsWith('/ecpf/student_data'):
      return ECPFStudentData;  
    case path.endsWith('/ecpf/payment_history'):
      return ECPFPaymentHistory; 
    case path.endsWith('/ecpf/user_profile'):
      return ECPFUserProfile;
    case path.endsWith('/ecpf/change_request'):
      return ECPFChangeRequest;  
    case path.endsWith('/ecpf/institutional_linkage'):
      return ECPFLinkageEstablishment;   
    default:
      return null;
  }
});

// ECPF Dealing Officer Route-Based Components
const ecpfDealingOfficerComponent = computed(() => {
  const path = route.path;
  switch (true) {
    case path.endsWith('/ecpf/dashboard'):
      return ECPFDealingOfficerDashboard;
    case path.endsWith('/ecpf/applications'):
      return ECPFApplicationLists;
    case path.endsWith('/ecpf/verification'):
      return ECPFVerification;
    default:
      return null;
  }
});

// ECPF Chief Route-Based Components
const ecpfChiefComponent = computed(() => {
  const path = route.path;
  switch (true) {
    case path.endsWith('/ecpf/dashboard'):
      return ECPFChiefDashboard;
    case path.endsWith('/ecpf/final_approval'):
      return ECPFFinalApproval;
    default:
      return null;
  }
});

// ECPF Admin Route-Based Components
const ecpfAdminComponent = computed(() => {
  const path = route.path;
  switch (true) {
    case path.endsWith('/ecpf/dashboard'):
      return ECPFAdminDashboard;
    case path.endsWith('/ecpf/user_management'):
      return ECPFUserManagement;
    default:
      return null;
  }
});

// Filter applications based on role
const filteredApplications = computed(() => {
  switch (role) {
    case 'user':
      return applications.value.filter(app => app.email_address === user.email);

    case 'dealing_officer':
      return applications.value.filter(app =>
        !app.dealing_officer_decision ||
        (!app.chief_approved && !app.chief_regret)
      );

    case 'chief':
      return applications.value.filter(app =>
        app.forward &&
        !app.chief_approved &&
        !app.chief_regret
      );

    default:
      return [];
  }
});

// Calculate stats based on filtered applications
const filteredStats = computed(() => {
  const filtered = filteredApplications.value;
  return {
    totalApplied: filtered.length,
    totalApproved: filtered.filter(app => app.chief_approved).length,
    totalRegretted: filtered.filter(app =>
      app.dealing_officer_regret || app.chief_regret
    ).length,
    totalPending: filtered.filter(app =>
      !app.chief_approved &&
      !app.dealing_officer_regret &&
      !app.chief_regret
    ).length
  };
});

// Compute total for pagination
const filteredTotal = computed(() => filteredApplications.value.length);

// Get paginated data
const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;

  // Transform the data to match the table structure
  return filteredApplications.value.slice(start, end).map(app => ({
    id: app.id,
    date: app.date_of_birth,
    type: app.type_of_course,
    status: getApplicationStatus(app),
  }));
});

// Helper function to determine application status
const getApplicationStatus = (application) => {
  if (application.chief_approved) return 'Approved';
  if (application.chief_regret) return 'Regretted';
  if (application.dealing_officer_regret) return 'Regretted';
  return 'Pending';
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};
</script>
