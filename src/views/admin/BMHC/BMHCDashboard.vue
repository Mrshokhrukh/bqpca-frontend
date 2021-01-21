<template>
  <div class="p-4">
    <!-- Admin Section -->
    <template v-if="role === 'Admin'">
      <component :is="bmhAdminComponent" />
    </template>

    <!-- API User Section -->
    <template v-else-if="role === 'Api User'">
      <component :is="bmhApiUserComponent" />
    </template>

    <!-- CME Updater Section -->
    <template v-else-if="role === 'CME Updater'">
      <component :is="bmhCmeUpdaterComponent" />
    </template>

    <!-- Compalint Handler Section -->
    <template v-else-if="role === 'Compalint Handler'">
      <component :is="bmhComplaintHandlerComponent" />
    </template>

    <!-- Personnel Section -->
    <template v-else-if="role === 'Personnel'">
      <component :is="bmhPersonnelComponent" />
    </template>

    <!-- Registration User Section -->
    <template v-else-if="role === 'Registration_User'">
      <component :is="bmhRegistrationUserComponent" />
    </template>

    <!-- Report Viewer Section -->
    <template v-else-if="role === 'Report Viewer'">
      <component :is="bmhReportViewerComponent" />
    </template>

    <!-- Resource Person Section -->
    <template v-else-if="role === 'Resource Person'">
      <component :is="bmhResourcePersonComponent" />
    </template>

    <!-- Super Admin Section -->
    <template v-else-if="role === 'Super Admin'">
      <component :is="bmhSuperAdminComponent" />
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
import StatsGrid from '@/components/dashboard/roqcomponents/user/StatsGrid.vue';
import ApplicationTable from '@/components/dashboard/roqcomponents/user/ApplicationsTable.vue';


// BMHC Admin Component Imports
import BmhAdminDashboard from '@/components/dashboard/bhmccomponents/admin/BmhAdminDashboard.vue';
// Import Other BMH Admin Components as needed (user management, settings, etc)
import BmhUserManagement from '@/components/dashboard/bhmccomponents/admin/BmhUserManagement.vue';


// BMHC API User Component Imports
import BmhApiUserDashboard from '@/components/dashboard/bhmccomponents/apiUser/BmhApiUserDashboard.vue';
// Import other API User components

// BMHC CME Updater Component Imports
import BmhCmeUpdaterDashboard from '@/components/dashboard/bhmccomponents/cmeUpdater/BmhCmeUpdaterDashboard.vue';
// Import other CME Updater components

// BMHC Complaint Handler Component Imports
import BmhComplaintDashboard from '@/components/dashboard/bhmccomponents/complaintHandler/BmhComplaintDashboard.vue';
// Import other Complaint Handler components

// BMHC Personnel Component Imports
import BmhPersonnelDashboard from '@/components/dashboard/bhmccomponents/resourcePerson/BmhResourcePersonDashboard.vue';
// Import other Personnel components

// BMHC Registration User Component Imports
import UserBmhcDashboard from '@/components/dashboard/bhmccomponents/user/UserBmhcDashboard.vue';
// Import other Registration User components


// BMHC Report Viewer Component Imports
import BmhReportViewerDashboard from '@/components/dashboard/bhmccomponents/reportViewer/BmhReportViewerDashboard.vue';
// Import other Report Viewer components

// BMHC Resource Person Component Imports
import BmhResourcePersonDashboard from '@/components/dashboard/bhmccomponents/resourcePerson/BmhResourcePersonDashboard.vue';
// Import other Resource Person components


// BMHC Super Admin Component Imports
import BmhSuperAdminDashboard from '@/components/dashboard/bhmccomponents/superAdmin/BmhSuperAdminDashboard.vue';
// Import other Super Admin components


const { role, user } = useAuthStore();
const route = useRoute();
const applications = ref([]);
const currentPage = ref(1);
const perPage = ref(10);

// BMHC Admin Route-Based Components
const bmhAdminComponent = computed(() => {
  const path = route.path;
  switch (true) {
    case path.endsWith('/bmh/dashboard'):
      return BmhAdminDashboard;
    case path.endsWith('/bmh/user_management'):
      return BmhUserManagement;
    //   add other admin routes
    default:
      return null;
  }
});

// BMHC API User Route-Based Components
const bmhApiUserComponent = computed(() => {
  const path = route.path;
  // Add route-based components for API User here
  switch (true) {
    case path.endsWith('/bmh/dashboard'):
      return BmhApiUserDashboard;
    //  add other API user routes
    default:
      return null;
  }
});

// BMHC CME Updater Route-Based Components
const bmhCmeUpdaterComponent = computed(() => {
  const path = route.path;
  // Add route-based components for CME Updater here
  switch (true) {
    case path.endsWith('/bmh/dashboard'):
      return BmhCmeUpdaterDashboard;
    //  add other CME updater routes
    default:
      return null;
  }
});

// BMHC Complaint Handler Route-Based Components
const bmhComplaintHandlerComponent = computed(() => {
  const path = route.path;
  // Add route-based components for Complaint Handler here
  switch (true) {
    case path.endsWith('/bmh/dashboard'):
      return BmhComplaintDashboard;
    // add other complaint handler routes
    default:
      return null;
  }

});

// BMHC Personnel Route-Based Components
const bmhPersonnelComponent = computed(() => {
  const path = route.path;
  // Add route-based components for Personnel here
  switch (true) {
    case path.endsWith('/bmh/dashboard'):
      return BmhPersonnelDashboard;
    // add other personnel routes
    default:
      return null;
  }
});


// BMHC Registration User Route-Based Components
const bmhRegistrationUserComponent = computed(() => {
  const path = route.path;
  // Add route-based components for Registration User here
  switch (true) {
    case path.endsWith('/bmh/dashboard'):
      return UserBmhcDashboard;
    // add other registration user routes
    default:
      return null;
  }

});

// BMHC Report Viewer Route-Based Components
const bmhReportViewerComponent = computed(() => {
  const path = route.path;
  // Add route-based components for Report Viewer here
  switch (true) {
    case path.endsWith('/bmh/dashboard'):
      return BmhReportViewerDashboard;
    // add other report viewer routes
    default:
      return null;
  }

});

// BMHC Resource Person Route-Based Components
const bmhResourcePersonComponent = computed(() => {
  const path = route.path;
  // Add route-based components for Resource Person here
  switch (true) {
    case path.endsWith('/bmh/dashboard'):
      return BmhResourcePersonDashboard;
    // add other resource person routes
    default:
      return null;
  }

});

// BMHC Super Admin Route-Based Components
const bmhSuperAdminComponent = computed(() => {
  const path = route.path;
  // Add route-based components for Super Admin here
  switch (true) {
    case path.endsWith('/bmh/dashboard'):
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