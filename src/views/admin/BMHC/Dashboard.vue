<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="p-4">
    <!-- User Section -->
    <template v-if="role === 'user'">
      <component :is="bmhUserComponent" />
    </template>

    <!-- Dealing Officer Section -->
    <template v-else-if="role === 'dealing_officer'">
      <component :is="bmhDealingOfficerComponent" />
    </template>

    <!-- Chief Section -->
    <template v-else-if="role === 'chief'">
      <component :is="bmhChiefComponent" />
    </template>

    <!-- Director Section -->
    <template v-else-if="role === 'director'">
      <component :is="bmhDirectorComponent" />
    </template>

    <!-- Admin Section -->
    <template v-else-if="role === 'admin'">
      <component :is="bmhAdminComponent" />
    </template>

    <!-- Super Admin Section -->
    <template v-else-if="role === 'super_admin'">
      <component :is="bmhSuperAdminComponent" />
    </template>

    <!-- CPD/CME Provider Section -->
    <template v-else-if="role === 'cpd_cme_provider'">
      <component :is="bmhCpdCmeProviderComponent" />
    </template>

    <!-- Institutions Section -->
    <template v-else-if="role === 'institutions'">
      <component :is="bmhInstitutionsComponent" />
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
// import StatsGrid from '@/components/dashboard/roqcomponents/user/StatsGrid.vue';
import ApplicationTable from '@/components/dashboard/roqcomponents/user/ApplicationsTable.vue';


// BMHC Component Imports
import BmhAdminDashboard from '@/components/dashboard/bhmccomponents/admin/BmhAdminDashboard.vue';
import BmhUserManagement from '@/components/dashboard/bhmccomponents/admin/BmhUserManagement.vue';
import BmhUserDashboard from '@/components/dashboard/bhmccomponents/user/UserBmhcDashboard.vue';
import BmhDealingOfficerDashboard from '@/components/dashboard/bhmccomponents/dealingOfficer/BmhDealingOfficerDashboard.vue';
import BmhChiefDashboard from '@/components/dashboard/bhmccomponents/chief/BmhChiefDashboard.vue';
import BmhDirectorDashboard from '@/components/dashboard/bhmccomponents/director/BmhDirectorDashboard.vue';
import BmhCpdCmeProviderDashboard from '@/components/dashboard/bhmccomponents/cpdCmeProvider/BmhCpdCmeProviderDashboard.vue';
import BmhInstitutionsDashboard from '@/components/dashboard/bhmccomponents/institutions/BmhInstitutionsDashboard.vue';
import BmhSuperAdminDashboard from '@/components/dashboard/bhmccomponents/superAdmin/BmhSuperAdminDashboard.vue';
// BMH user
import CPDcomponent from '@/components/dashboard/bhmccomponents/user/CPDcomponent.vue';
import CoGSComponet from '@/components/dashboard/bhmccomponents/user/CoGSComponet.vue';
import PractitionerCertification from '@/components/dashboard/bhmccomponents/user/pracitioner_reg_and_cert/PractitionerCertification.vue';
import PractitionerRegistration from '@/components/dashboard/bhmccomponents/user/pracitioner_reg_and_cert/PractitionerRegistration.vue';
import PractitionerRenewal from '@/components/dashboard/bhmccomponents/user/pracitioner_reg_and_cert/PractitionerRenewal.vue';


const { role, user } = useAuthStore();
const route = useRoute();
const applications = ref([]);
const currentPage = ref(1);
const perPage = ref(10);


// BMHC Admin Route-Based Components
const bmhAdminComponent = computed(() => {
  const path = route.path;
  switch (true) {
    case path.endsWith('/health_certification/dashboard'):
      return BmhAdminDashboard;
    case path.endsWith('/health_certification/user_management'):
      return BmhUserManagement;
    //   add other admin routes
    default:
      return null;
  }
});

// BMHC User Route-Based Components
const bmhUserComponent = computed(() => {
  const path = route.path;
  switch (true) {
    case path.endsWith('/health_certification/dashboard'):
      return BmhUserDashboard;
    case path.endsWith('/health_certification/practitioner_reg_and_cert/registration'):
      return PractitionerRegistration;
    case path.endsWith('/health_certification/practitioner_reg_and_cert/certificate'):
      return PractitionerCertification;
    case path.endsWith('/health_certification/practitioner_reg_and_cert/renewal'):
      return PractitionerRenewal;
    case path.endsWith('/health_certification/cpd'):
      return CPDcomponent;
    case path.endsWith('/health_certification/CoGS'):
      return CoGSComponet;
    case path.endsWith('/health_certification/profile'):
      return CoGSComponet;
    default:
      return null;
  }
});

// BMHC Dealing Officer Route-Based Components
const bmhDealingOfficerComponent = computed(() => {
  const path = route.path;
  switch (true) {
    case path.endsWith('/health_certification/dashboard'):
      return BmhDealingOfficerDashboard;
    default:
      return null;
  }
});

// BMHC Chief Route-Based Components
const bmhChiefComponent = computed(() => {
  const path = route.path;
  switch (true) {
    case path.endsWith('/health_certification/dashboard'):
      return BmhChiefDashboard;
    default:
      return null;
  }
});

// BMHC Director Route-Based Components
const bmhDirectorComponent = computed(() => {
  const path = route.path;
  switch (true) {
    case path.endsWith('/health_certification/dashboard'):
      return BmhDirectorDashboard;
    default:
      return null;
  }
});

// BMHC CPD/CME Provider Route-Based Components
const bmhCpdCmeProviderComponent = computed(() => {
  const path = route.path;
  // Add route-based components for CPD/CME provider here
  switch (true) {
    case path.endsWith('/health_certification/dashboard'):
      return BmhCpdCmeProviderDashboard;
    // add other cpd cme provider routes
    default:
      return null;
  }
});
// BMHC Institutions Route-Based Components
const bmhInstitutionsComponent = computed(() => {
  const path = route.path;
  // Add route-based components for Institutions here
  switch (true) {
    case path.endsWith('/health_certification/dashboard'):
      return BmhInstitutionsDashboard;
    // add other institution routes
    default:
      return null;
  }
});

// BMHC Super Admin Route-Based Components
const bmhSuperAdminComponent = computed(() => {
  const path = route.path;
  // Add route-based components for Super Admin here
  switch (true) {
    case path.endsWith('/health_certification/dashboard'):
      return BmhSuperAdminDashboard;
    // add other super admin routes
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

    case 'director':
      return applications.value;

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
