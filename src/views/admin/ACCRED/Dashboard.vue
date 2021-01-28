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

    <!-- User Section (with specific routes) -->
    <template v-else-if="role === 'user'">
      <component :is="userComponent" />
    </template>

    <!-- Default Section (fallback) -->
    <template v-else>
      <div>
        Select the service and role.
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
// import ApplicationTable from '@/components/dashboard/roqcomponents/user/ApplicationsTable.vue';

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

// Dealing Officer Components Import
// import DealingOfficerDashboard from '@/components/dashboard/roqcomponent/dealingOfficer/DealingOfficerDashboard.vue';
// import ApplicationsTable from '@/components/dashboard/roqcomponent/dealingOfficer/ApplicationsTable.vue';
// import SecondCopyApplicationsTable from '@/components/dashboard/roqcomponent/dealingOfficer/SecondCopyApplicationsTable.vue';

// Chief Components Import
// import ChiefDashboard from '@/components/dashboard/roqcomponent/chief/ChiefDashboard.vue';
// import ChiefApplicationsTable from '@/components/dashboard/roqcomponent/chief/ChiefApplicationsTable.vue';
// import SecondCopyLists from '@/components/dashboard/roqcomponent/chief/SecondCopyLists.vue';

// User Components Import
// import UserDashboard from '@/components/dashboard/roqcomponent/user/UserDashboard.vue';
// import UserApplications from '@/components/dashboard/roqcomponent/user/UserRoqApplicationList.vue';
// import SecondCopyApplication from '@/components/dashboard/roqcomponent/user/SecondCopyApplication.vue'; // Added Import
// import ProfileView from '@/components/dashboard/roqcomponent/user/ProfileView.vue'; // Added Import

const { role, user } = useAuthStore();
const route = useRoute();
const applications = ref([]);
const currentPage = ref(1);
const perPage = ref(10);

// Admin Route-Based Components
const adminComponent = computed(() => {
  const path = route.path;
  const serviceType = route.params.serviceType;

  if (serviceType === 'accreditation') {
    switch (true) {
      case path.endsWith('accreditation/dashboard'):
        return AdminDashboard;
      case path.endsWith('/application_lists'):
        return ApplicationLists;
      case path.endsWith('/appeal_lists'):
        return AppealLists;
      case path.endsWith('accreditation/reports'):
        return AdminReports;
      // Masters
      case path.endsWith('/masters/appeal_reason'):
        return AppealReasonMaster;
      case path.endsWith('/masters/application_duration'):
        return ApplicationDurationMaster;
      case path.endsWith('/masters/assessor_pool'):
        return AssessorPoolMaster;
      case path.endsWith('/masters/decision'):
        return DecisionMaster;
      case path.endsWith('/masters/e_signature'):
        return ESignatureMaster;
      case path.endsWith('/masters/employee_category'):
        return EmployeeCategoryMaster;
      case path.endsWith('/masters/employee_type'):
        return EmployeeTypeMaster;
      case path.endsWith('/masters/fees'):
        return FeesMaster;
      case path.endsWith('/masters/indicators'):
        return IndicatorsMaster;
      case path.endsWith('/masters/institute'):
        return InstituteMaster;
      case path.endsWith('/masters/key_aspects'):
        return KeyAspectsMaster;
      case path.endsWith('/masters/qualification'):
        return QualificationMaster;
      case path.endsWith('/masters/rating_category'):
        return RatingCategoryMaster;
      case path.endsWith('/masters/source_of_funding'):
        return SourceOfFundingMaster;
      case path.endsWith('/masters/staff_type'):
        return StaffTypeMaster;
      case path.endsWith('/masters/standard'):
        return StandardMaster;
      default:
        return null;
    }
  } else {
    // Handle other services or return a default component
    return null; // Or a default dashboard component for non-accreditation services
  }
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
      return null
    default:
      return null;
  }
});

// Director Route-Based Components
const directorComponent = computed(() => {
  // const path = route.path;
  // Add route-based components for director here
  // Example:
  // if (path.endsWith('/roq/dashboard')) {
  //   return DirectorDashboard;
  // }
  return null;
});

// Super Admin Route-Based Components
const superAdminComponent = computed(() => {
  // const path = route.path;
  // Add route-based components for super admin here
  // Example:
  // if (path.endsWith('/roq/dashboard')) {
  //   return SuperAdminDashboard;
  // }
  return null;
});

// User Route-Based Components
const userComponent = computed(() => {
  const path = route.path;
  switch (true) {
    case path.endsWith('/roq/dashboard'):
      return UserDashboard;
    case path.endsWith('/roq/my_applications'):
      return UserApplications;
    case path.endsWith('/roq/secondcopy_applications'):
      return SecondCopyApplication;
    case path.endsWith('/roq/profile'):
      return ProfileView; // Corrected case statement, using the correct variable name
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