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
import IndividualECPF from '@/components/dashboard/ecpfcomponents/user/IndividualECPF.vue';
import CollaboratedECPF from '@/components/dashboard/ecpfcomponents/user/CollaboratedECPF.vue';
import NewBranchECPF from '@/components/dashboard/ecpfcomponents/user/NewBranchECPF.vue';
import ECPFRenewal from '@/components/dashboard/ecpfcomponents/user/ECPFRenewal.vue';
import ECPFNameChange from '@/components/dashboard/ecpfcomponents/user/ECPFNameChange.vue';
import ECPFLocationChange from '@/components/dashboard/ecpfcomponents/user/ECPFLocationChange.vue';
import ECPFOwnershipChange from '@/components/dashboard/ecpfcomponents/user/ECPFOwnershipChange.vue';
import ECPFLinkageEstablishment from '@/components/dashboard/ecpfcomponents/user/ECPFLinkageEstablishment.vue';
import ECPFEducationFair from '@/components/dashboard/ecpfcomponents/user/ECPFEducationFair.vue';
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
    case path.endsWith('/ecpf/individual_ecpf'):
      return IndividualECPF;
    case path.endsWith('/ecpf/collaborated_ecpf'):
      return CollaboratedECPF;
    case path.endsWith('/ecpf/new_branch_ecpf'):
      return NewBranchECPF;
    case path.endsWith('/ecpf/ecpf_renewal'):
      return ECPFRenewal;
    case path.endsWith('/ecpf/ecpf_name_change'):
      return ECPFNameChange;
    case path.endsWith('/ecpf/ecpf_location_change'):
      return ECPFLocationChange;
    case path.endsWith('/ecpf/ecpf_ownership_change'):
      return ECPFOwnershipChange
    case path.endsWith('/ecpf/ecpf_linkage_establishment'):
      return ECPFLinkageEstablishment;
    case path.endsWith('/ecpf/ecpf_education_fair'):
      return ECPFEducationFair;
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
