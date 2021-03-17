<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="p-4">
    <!-- User Section -->
    <template v-if="role === 'user'">
      <component :is="engineeringUserComponent" />
    </template>

    <!-- Dealing Officer Section -->
    <template v-else-if="role === 'dealing_officer'">
      <component :is="engineeringDealingOfficerComponent" />
    </template>

    <!-- Chief Section -->
    <template v-else-if="role === 'chief'">
      <component :is="engineeringChiefComponent" />
    </template>

    <!-- Director Section -->
    <template v-else-if="role === 'director'">
      <component :is="engineeringDirectorComponent" />
    </template>

    <!-- Admin Section -->
    <template v-else-if="role === 'admin'">
      <component :is="engineeringAdminComponent" />
    </template>

    <!-- Super Admin Section -->
    <template v-else-if="role === 'super_admin'">
      <component :is="engineeringSuperAdminComponent" />
    </template>

    <!-- CPD/CME Provider Section -->
    <template v-else-if="role === 'cpd_cme_provider'">
      <component :is="engineeringCpdCmeProviderComponent" />
    </template>

    <!-- Institutions Section -->
    <template v-else-if="role === 'institutions'">
      <component :is="engineeringInstitutionsComponent" />
    </template>

    <!-- Default Section (fallback) -->
    <template v-else>
      <ApplicationTable :applications="paginatedApplications" :current-page="currentPage" :total-results="filteredTotal"
        :per-page="perPage" @page-change="handlePageChange" />
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
// import ApplicationTable from '@/components/common/ROQUserApplicationsList.vue';

// Engineering Component Imports
import EngineeringAdminDashboard from '@/components/dashboard/engineeringcomponents/admin/EngineeringAdminDashboard.vue';
import EngineeringUserManagement from '@/components/dashboard/engineeringcomponents/admin/EngineeringUserManagement.vue';
import EngineeringUserDashboard from '@/components/dashboard/engineeringcomponents/user/UserEngineeringDashboard.vue';
import EngineeringDealingOfficerDashboard from '@/components/dashboard/engineeringcomponents/dealingOfficer/EngineeringDealingOfficerDashboard.vue';
import EngineeringChiefDashboard from '@/components/dashboard/engineeringcomponents/chief/EngineeringChiefDashboard.vue';
import EngineeringDirectorDashboard from '@/components/dashboard/engineeringcomponents/director/EngineeringDirectorDashboard.vue';
import EngineeringInstitutionsDashboard from '@/components/dashboard/engineeringcomponents/institutions/EngineeringInstitutionsDashboard.vue';
import EngineeringSuperAdminDashboard from '@/components/dashboard/engineeringcomponents/superAdmin/EngineeringSuperAdminDashboard.vue';

// Engineering user components
import CPDcomponent from '@/components/dashboard/engineeringcomponents/user/CPDcomponent.vue';
import CoGSComponet from '@/components/dashboard/engineeringcomponents/user/CoGSComponet.vue';
import UserProfileComponent from '@/components/dashboard/engineeringcomponents/user/UserProfileComponent.vue';
import PaymentComponent from '@/components/dashboard/engineeringcomponents/user/PaymentComponent.vue';
import PaymentHistoryComponent from '@/components/dashboard/engineeringcomponents/user/PaymentHistoryComponent.vue';
import ReportsComponent from '@/components/dashboard/engineeringcomponents/user/ReportsComponent.vue';
import ReRegistrationComponent from '@/components/dashboard/engineeringcomponents/user/ReRegistrationComponent.vue';
import AdditionalQualificationComponent from '@/components/dashboard/engineeringcomponents/user/AdditionalQualificationComponent.vue';
import ApplicationsTable from '@/components/dashboard/engineeringcomponents/user/ApplicationsTable.vue';

// Practitioner Registration Components
import PractitionerRegistration from '@/components/dashboard/engineeringcomponents/user/pracitioner_reg_and_cert/PractitionerRegistration.vue';
import PractitionerCertification from '@/components/dashboard/engineeringcomponents/user/pracitioner_reg_and_cert/PractitionerCertification.vue';
import PractitionerRenewal from '@/components/dashboard/engineeringcomponents/user/pracitioner_reg_and_cert/PractitionerRenewal.vue';

// Dealing Officer Components
import ApplicationLists from '@/components/dashboard/engineeringcomponents/dealingOfficer/ApplicationLists.vue';
import CpdManagement from '@/components/dashboard/engineeringcomponents/dealingOfficer/CpdManagement.vue';
import InstituteManagement from '@/components/dashboard/engineeringcomponents/dealingOfficer/InstituteManagement.vue';
import ProfessionalProfiles from '@/components/dashboard/engineeringcomponents/dealingOfficer/ProfessionalProfiles.vue';
import CogsManagement from '@/components/dashboard/engineeringcomponents/dealingOfficer/CogsManagement.vue';
import EngineeringCapa from '@/components/dashboard/engineeringcomponents/dealingOfficer/EngineeringCapa.vue';
import EngineeringPayments from '@/components/dashboard/engineeringcomponents/dealingOfficer/EngineeringPayments.vue';
import EngineeringReports from '@/components/dashboard/engineeringcomponents/dealingOfficer/EngineeringReports.vue';

// CPD Provider Components
import EngineeringProviderDashboard from '@/components/dashboard/engineeringcomponents/cpdCmeProvider/EngineeringCpdCmeProviderDashboard.vue';

const { role, user } = useAuthStore();
const route = useRoute();
const applications = ref([]);
const currentPage = ref(1);
const perPage = ref(10);

// Engineering Admin Route-Based Components
const engineeringAdminComponent = computed(() => {
  const path = route.path;
  switch (true) {
    case path.endsWith('/engineering_certification/dashboard'):
      return EngineeringAdminDashboard;
    case path.endsWith('/engineering_certification/user_management'):
      return EngineeringUserManagement;
    // Add more admin routes as needed
    default:
      return null;
  }
});

// Engineering User Route-Based Components
const engineeringUserComponent = computed(() => {
  const path = route.path;
  switch (true) {
    case path.endsWith('/engineering_certification/dashboard'):
      return EngineeringUserDashboard;
    case path.endsWith('/engineering_certification/profile'):
      return UserProfileComponent;
    case path.endsWith('/engineering_certification/registration'):
      return PractitionerRegistration;
    case path.endsWith('/engineering_certification/renewal'):
      return PractitionerRenewal;
    case path.endsWith('/engineering_certification/re_registration'):
      return ReRegistrationComponent;
    case path.endsWith('/engineering_certification/additional_qualification'):
      return AdditionalQualificationComponent;
    case path.endsWith('/engineering_certification/CoGS'):
      return CoGSComponet;
    case path.endsWith('/engineering_certification/cpd'):
      return CPDcomponent;
    case path.endsWith('/engineering_certification/payment'):
      return PaymentComponent;
    case path.endsWith('/engineering_certification/payment_history'):
      return PaymentHistoryComponent;
    case path.endsWith('/engineering_certification/reports'):
      return ReportsComponent;
    case path.endsWith('/engineering_certification/my_applications'):
      return ApplicationsTable;

    // Backward compatible routes
    case path.endsWith('/engineering_certification/practitioner_reg_and_cert/registration'):
      return PractitionerRegistration;
    case path.endsWith('/engineering_certification/practitioner_reg_and_cert/certificate'):
      return PractitionerCertification;
    case path.endsWith('/engineering_certification/practitioner_reg_and_cert/renewal'):
      return PractitionerRenewal;
    default:
      return null;
  }
});

// Engineering Dealing Officer Route-Based Components
const engineeringDealingOfficerComponent = computed(() => {
  const path = route.path;
  switch (true) {
    case path.endsWith('/engineering_certification/dashboard'):
      return EngineeringDealingOfficerDashboard;
    case path.endsWith('/engineering_certification/application_lists'):
      return ApplicationLists;
    case path.endsWith('/engineering_certification/cpd_management'):
      return CpdManagement;
    case path.endsWith('/engineering_certification/institutes'):
      return InstituteManagement;
    case path.endsWith('/engineering_certification/profiles'):
      return ProfessionalProfiles;
    case path.endsWith('/engineering_certification/cogs'):
      return CogsManagement;
    case path.endsWith('/engineering_certification/capa'):
      return EngineeringCapa;
    case path.endsWith('/engineering_certification/payments'):
      return EngineeringPayments;
    case path.endsWith('/engineering_certification/reports'):
      return EngineeringReports;
    default:
      return null;
  }
});

// Engineering Chief Route-Based Components
const engineeringChiefComponent = computed(() => {
  const path = route.path;
  switch (true) {
    case path.endsWith('/engineering_certification/dashboard'):
      return EngineeringChiefDashboard;
    default:
      return null;
  }
});

// Engineering Director Route-Based Components
const engineeringDirectorComponent = computed(() => {
  const path = route.path;
  switch (true) {
    case path.endsWith('/engineering_certification/dashboard'):
      return EngineeringDirectorDashboard;
    default:
      return null;
  }
});

// Engineering CPD/CME Provider Route-Based Components
const engineeringCpdCmeProviderComponent = computed(() => {
  const path = route.path;
  switch (true) {
    case path.endsWith('/engineering_certification/dashboard'):
      return EngineeringProviderDashboard;
    default:
      return null;
  }
});

// Engineering Institutions Route-Based Components
const engineeringInstitutionsComponent = computed(() => {
  const path = route.path;
  switch (true) {
    case path.endsWith('/engineering_certification/dashboard'):
      return EngineeringInstitutionsDashboard;
    default:
      return null;
  }
});

// Engineering Super Admin Route-Based Components
const engineeringSuperAdminComponent = computed(() => {
  const path = route.path;
  switch (true) {
    case path.endsWith('/engineering_certification/dashboard'):
      return EngineeringSuperAdminDashboard;
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
