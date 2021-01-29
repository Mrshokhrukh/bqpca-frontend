<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="p-4">
    <!-- Admin Section -->
    <template v-if="role === 'admin'">
      <suspense>
        <component :is="adminComponent" />
        <template #fallback>
          <div>Loading...</div>
        </template>
      </suspense>
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

    <!-- User Section -->
    <template v-else-if="role === 'user'">
      <component :is="userComponent" />
    </template>

    <!-- Default Section -->
    <template v-else>
      <div>Select the service and role.</div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

// Admin Components Import
import AdminDashboard from '@/components/dashboard/accredcomponent/admin/AccreditationDashboard.vue';
import ApplicationLists from '@/components/dashboard/accredcomponent/admin/ApplicationLists.vue';
import AppealLists from '@/components/dashboard/accredcomponent/admin/AppealLists.vue';
import AdminReports from '@/components/dashboard/accredcomponent/admin/AdminReports.vue';

// Import Admin Masters Components
import AppealReasonMaster from '@/components/dashboard/accredcomponent/admin/masters/AppealReasonMaster.vue';
import ApplicationDurationMaster from '@/components/dashboard/accredcomponent/admin/masters/ApplicationDurationMaster.vue';
import AssessorPoolMaster from '@/components/dashboard/accredcomponent/admin/masters/AssessorPoolMaster.vue';
import DecisionMaster from '@/components/dashboard/accredcomponent/admin/masters/DecisionMaster.vue';
import DecisionClass from '@/components/dashboard/accredcomponent/admin/masters/DecisionClass.vue';
import ESignatureMaster from '@/components/dashboard/accredcomponent/admin/masters/ESignatureMaster.vue';
import EmployeeCategoryMaster from '@/components/dashboard/accredcomponent/admin/masters/EmployeeCategoryMaster.vue';
import EmployeeTypeMaster from '@/components/dashboard/accredcomponent/admin/masters/EmployeeTypeMaster.vue';
import FeesMaster from '@/components/dashboard/accredcomponent/admin/masters/FeesMaster.vue';
import IndicatorsMaster from '@/components/dashboard/accredcomponent/admin/masters/IndicatorsMaster.vue';
import InstituteMaster from '@/components/dashboard/accredcomponent/admin/masters/InstituteMaster.vue';
import KeyAspectsMaster from '@/components/dashboard/accredcomponent/admin/masters/KeyAspectsMaster.vue';
import QualificationMaster from '@/components/dashboard/accredcomponent/admin/masters/QualificationMaster.vue';
import RatingCategoryMaster from '@/components/dashboard/accredcomponent/admin/masters/RatingCategoryMaster.vue';
import SourceOfFundingMaster from '@/components/dashboard/accredcomponent/admin/masters/SourceOfFundingMaster.vue';
import StaffTypeMaster from '@/components/dashboard/accredcomponent/admin/masters/StaffTypeMaster.vue';
import StandardMaster from '@/components/dashboard/accredcomponent/admin/masters/StandardMaster.vue';
import DocumentType from '@/components/dashboard/accredcomponent/admin/DocumentType.vue';

const { role, user } = useAuthStore();
const route = useRoute();
const applications = ref([]);
const currentPage = ref(1);
const perPage = ref(10);

// Add route change debugging
watchEffect(() => {
  console.log('Route changed:', {
    fullPath: route.fullPath,
    path: route.path,
    params: route.params,
    matched: route.matched
  });
});

// Admin Route-Based Components
const adminComponent = computed(() => {
  // Extract full path
  const path = route.path;
  console.log('Computing admin component for path:', path);

  // Get path segments and remove empty ones
  const segments = path.split('/').filter(Boolean);
  console.log('Path segments:', segments);

  // Handle accreditation service type
  if (segments.includes('accreditation')) {
    // Check if this is a masters route
    if (segments.includes('masters')) {
      const masterType = segments[segments.length - 1];
      console.log('Master component requested:', masterType);

      // Map master routes to components
      const mastersMap = {
        'appeal_reason': AppealReasonMaster,
        'application_duration': ApplicationDurationMaster,
        'assessor_pool': AssessorPoolMaster,
        'decision': DecisionMaster,
        'decision_classes': DecisionClass,
        'e_signature': ESignatureMaster,
        'employee_category': EmployeeCategoryMaster,
        'employee_type': EmployeeTypeMaster,
        'fees': FeesMaster,
        'indicators': IndicatorsMaster,
        'institute': InstituteMaster,
        'key_aspects': KeyAspectsMaster,
        'qualification': QualificationMaster,
        'document': DocumentType,
        'rating_category': RatingCategoryMaster,
        'source_of_funding': SourceOfFundingMaster,
        'staff_type': StaffTypeMaster,
        'standard': StandardMaster
      };

      if (mastersMap[masterType]) {
        console.log('Returning master component:', masterType);
        return mastersMap[masterType];
      } else {
        console.warn('Master component not found:', masterType);
        return AdminDashboard;
      }
    }

    // Handle main routes
    const mainComponentName = segments[segments.length - 1];
    const mainComponentsMap = {
      'dashboard': AdminDashboard,
      'application_lists': ApplicationLists,
      'appeal_lists': AppealLists,
      'reports': AdminReports
    };

    console.log('Main component requested:', mainComponentName);
    return mainComponentsMap[mainComponentName] || AdminDashboard;
  }

  // Return null for non-accreditation services
  return null;
});

// Dealing Officer Route-Based Components
const dealingOfficerComponent = computed(() => {
  const path = route.path;
  switch (true) {
    case path.endsWith('/roq/dashboard'):
      return null;
    default:
      return null;
  }
});

// Chief Route-Based Components
const chiefComponent = computed(() => {
  const path = route.path;
  switch (true) {
    case path.endsWith('/roq/dashboard'):
      return null;
    default:
      return null;
  }
});

// Director Route-Based Components
const directorComponent = computed(() => {
  return null;
});

// Super Admin Route-Based Components
const superAdminComponent = computed(() => {
  return null;
});

// User Route-Based Components
const userComponent = computed(() => {
  const path = route.path;
  switch (true) {
    case path.endsWith('/roq/dashboard'):
      return null;
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