<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="p-4">
    <!-- Admin Section -->
    <template v-if="role === 'admin'">
      <component :is="adminComponent" />
    </template>

    <!-- Dealing Officer Section -->
    <template v-else-if="role === 'dealing_officer'">
      <component :is="dealingOfficerComponent" />
    </template>

    <!-- Chief Section -->
    <template v-else-if="role === 'chief'">
      <component :is="chiefComponent" />
    </template>

    <!-- Director Section -->
    <template v-else-if="role === 'director'">
      <component :is="directorComponent" />
    </template>

    <!-- Super Admin Section -->
    <template v-else-if="role === 'super_admin'">
      <component :is="superAdminComponent" />
    </template>

    <!-- Default Section (User) -->
    <template v-else>
      <StatsGrid :stats="filteredStats" />
      <ApplicationTable :applications="paginatedApplications" :current-page="currentPage" :total-results="filteredTotal"
        :per-page="perPage" @page-change="handlePageChange" />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import StatsGrid from '@/components/dashboard/roqcomponents/StatsGrid.vue';
import ApplicationTable from '@/components/dashboard/roqcomponents/ApplicationsTable.vue';
import AdminDashboard from '@/components/dashboard/roqcomponents/admin/AdminDashboard.vue';
import AdminDecision from '@/components/dashboard/roqcomponents/admin/AdminDecision.vue';
import AdminLearningType from '@/components/dashboard/roqcomponents/admin/AdminLearningType.vue';
import apiService from '@/services/services';

const { role, user } = useAuthStore();
const route = useRoute();
const applications = ref([]);
const currentPage = ref(1);
const perPage = ref(10);

// Admin Route-Based Components
const adminComponent = computed(() => {
  const path = route.path;
  switch (true) {
    case path.endsWith('/roq/dashboard'):
      return AdminDashboard;
    case path.endsWith('/roq/decisions'):
      return AdminDecision;
    case path.endsWith('/roq/learning_types'):
      return AdminLearningType;
    default:
      return null;
  }
});

// Dealing Officer Route-Based Components
const dealingOfficerComponent = computed(() => {
  const path = route.path;
  // Add route-based components for dealing officer here
  // Example:
  // if (path.endsWith('/roq/dashboard')) {
  //   return DealingOfficerDashboard;
  // }
  return null;
});

// Chief Route-Based Components
const chiefComponent = computed(() => {
  const path = route.path;
  // Add route-based components for chief here
  // Example:
  // if (path.endsWith('/roq/dashboard')) {
  //   return ChiefDashboard;
  // }
  return null;
});

// Director Route-Based Components
const directorComponent = computed(() => {
  const path = route.path;
  // Add route-based components for director here
  // Example:
  // if (path.endsWith('/roq/dashboard')) {
  //   return DirectorDashboard;
  // }
  return null;
});

// Super Admin Route-Based Components
const superAdminComponent = computed(() => {
  const path = route.path;
  // Add route-based components for super admin here
  // Example:
  // if (path.endsWith('/roq/dashboard')) {
  //   return SuperAdminDashboard;
  // }
  return null;
});

// Filter applications based on role
const filteredApplications = computed(() => {
  switch (role) {
    case 'user':
      // Filter by applicants_name or email_address that matches current user
      return applications.value.filter(app => app.email_address === user.email);

    case 'dealing_officer':
      // Filter applications that haven't been processed yet or are in dealing officer stage
      return applications.value.filter(app =>
        !app.dealing_officer_decision ||
        (!app.chief_approved && !app.chief_regret)
      );

    case 'chief':
      // Filter applications forwarded to chief
      return applications.value.filter(app =>
        app.forward &&
        !app.chief_approved &&
        !app.chief_regret
      );

    case 'director':
      // Directors see all applications
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

const loadData = async () => {
  try {
    const response = await apiService.get('/recognitions/recognition-of-qualifications/');
    applications.value = response.data.results;
  } catch (error) {
    console.error('Error loading data:', error);
  }
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};

onMounted(() => {
  loadData();
});
</script>
