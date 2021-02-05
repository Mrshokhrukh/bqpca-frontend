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
      <ApplicationTable :applications="paginatedApplications" :current-page="currentPage" :total-results="filteredTotal"
        :per-page="perPage" @page-change="handlePageChange" />
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
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
import PractitionerRegistration from '@/components/dashboard/bhmccomponents/user/certificateApplication/CertificateRegistrationComponent.vue';
import PractitionerRenewal from '@/components/dashboard/bhmccomponents/user/certificateApplication/ApplicationRenewal.vue';
import ApplicationTracker from '@/components/dashboard/bhmccomponents/user/certificateApplication/ApplicationTracker.vue';


// Dealing Officer Components
import ApplicationLists from '@/components/dashboard/bhmccomponents/dealingOfficer/ApplicationLists.vue';
import CpdManagement from '@/components/dashboard/bhmccomponents/dealingOfficer/CpdManagement.vue';
import InstituteManagement from '@/components/dashboard/bhmccomponents/dealingOfficer/InstituteManagement.vue';
import ProfessionalProfiles from '@/components/dashboard/bhmccomponents/dealingOfficer/ProfessionalProfiles.vue';
import CogsManagement from '@/components/dashboard/bhmccomponents/dealingOfficer/CogsManagement.vue';
import Capa from '@/components/dashboard/bhmccomponents/dealingOfficer/Capa.vue';

import PaymentManagement from '@/components/dashboard/bhmccomponents/dealingOfficer/Payments.vue';
import Reports from '@/components/dashboard/bhmccomponents/dealingOfficer/Reports.vue';

//BMHC masters components
import MastersCmeActivities from '@/components/dashboard/bhmccomponents/admin/MastersCmeActivities.vue'
import MastersCmeCredits from '@/components/dashboard/bhmccomponents/admin/MastersCmeCredits.vue'
import MastersCmeMethodologies from '@/components/dashboard/bhmccomponents/admin/MastersCmeMethodologies.vue'
import MastersCpdActivity from '@/components/dashboard/bhmccomponents/admin/MastersCpdActivity.vue'
import MastersDocumentTypes from '@/components/dashboard/bhmccomponents/admin/MastersDocumentTypes.vue'
import MastersESignatures from '@/components/dashboard/bhmccomponents/admin/MastersESignatures.vue'
import MastersFeeStructures from '@/components/dashboard/bhmccomponents/admin/MastersFeeStructures.vue'
import MastersFeesAssociatedFor from '@/components/dashboard/bhmccomponents/admin/MastersFeesAssociatedFor.vue'
import MastersFileTypes from '@/components/dashboard/bhmccomponents/admin/MastersFileTypes.vue'
import MastersParticipationCategory from '@/components/dashboard/bhmccomponents/admin/MastersParticipationCategory.vue'
import MastersParticipationSubCategory from '@/components/dashboard/bhmccomponents/admin/MastersParticipationSubCategory.vue'
import MastersPersonnelCategories from '@/components/dashboard/bhmccomponents/admin/MastersPersonnelCategories.vue'
import MastersQualificationTypes from '@/components/dashboard/bhmccomponents/admin/MastersQualificationTypes.vue'
import MastersQualifications from '@/components/dashboard/bhmccomponents/admin/MastersQualifications.vue'
import MastersRegistrationType from '@/components/dashboard/bhmccomponents/admin/MastersRegistrationType.vue'
import MastersSector from '@/components/dashboard/bhmccomponents/admin/MastersSector.vue'
import MastersSubCategories from '@/components/dashboard/bhmccomponents/admin/MastersSubCategories.vue'
import MastersUniversity from '@/components/dashboard/bhmccomponents/admin/MastersUniversity.vue'
import CogsAgency from '@/components/dashboard/bhmccomponents/admin/CogsAgency.vue';
import CogsDepartment from '@/components/dashboard/bhmccomponents/admin/CogsDepartment.vue';
import CogsWorkplace from '@/components/dashboard/bhmccomponents/admin/CogsWorkplace.vue';

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
    case path.endsWith('/health_certification/cme_activities'):
      return MastersCmeActivities
    case path.endsWith('/health_certification/cme_credits'):
      return MastersCmeCredits
    case path.endsWith('/health_certification/cme_methodologies'):
      return MastersCmeMethodologies
    case path.endsWith('/health_certification/cpd_activity'):
      return MastersCpdActivity
    case path.endsWith('/health_certification/document_types'):
      return MastersDocumentTypes;
    case path.endsWith('/health_certification/e_signatures'):
      return MastersESignatures;
    case path.endsWith('/health_certification/fee_structures'):
      return MastersFeeStructures
    case path.endsWith('/health_certification/fees_associated_for'):
      return MastersFeesAssociatedFor
    case path.endsWith('/health_certification/file_types'):
      return MastersFileTypes;
    case path.endsWith('/health_certification/participation_category'):
      return MastersParticipationCategory;
    case path.endsWith('/health_certification/participation_sub_category'):
      return MastersParticipationSubCategory
    case path.endsWith('/health_certification/personnel_categories'):
      return MastersPersonnelCategories
    case path.endsWith('/health_certification/qualification_types'):
      return MastersQualificationTypes
    case path.endsWith('/health_certification/qualifications'):
      return MastersQualifications
    case path.endsWith('/health_certification/registration_type'):
      return MastersRegistrationType
    case path.endsWith('/health_certification/sector'):
      return MastersSector;
    case path.endsWith('/health_certification/sub_categories'):
      return MastersSubCategories
    case path.endsWith('/health_certification/university'):
      return MastersUniversity
    case path.endsWith('/health_certification/cogs_agency'):
      return CogsAgency;
    case path.endsWith('/health_certification/cogs_dept'):
      return CogsDepartment;
    case path.endsWith('/health_certification/cogs_workplace'):
      return CogsWorkplace;
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
    case path.endsWith('/health_certification/registration'):
      return PractitionerRegistration;
    case path.endsWith('/health_certification/my_applications'):
      return ApplicationTracker;
    case path.endsWith('/health_certification/renewal'):
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
    case path.endsWith('/health_certification/application_lists'):
      return ApplicationLists;
    case path.endsWith('/health_certification/cpd_management'):
      return CpdManagement;
    case path.endsWith('/health_certification/institutes'):
      return InstituteManagement;
    case path.endsWith('/health_certification/profiles'):
      return ProfessionalProfiles;
    case path.endsWith('/health_certification/cogs'):
      return CogsManagement;
    case path.endsWith('/health_certification/capa'):
      return Capa;
    case path.endsWith('/health_certification/payments'):
      return PaymentManagement;
    case path.endsWith('/health_certification/reports'):
      return Reports;
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
  switch (true) {
    case path.endsWith('/health_certification/dashboard'):
      return BmhCpdCmeProviderDashboard;
    default:
      return null;
  }
});

// BMHC Institutions Route-Based Components
const bmhInstitutionsComponent = computed(() => {
  const path = route.path;
  switch (true) {
    case path.endsWith('/health_certification/dashboard'):
      return BmhInstitutionsDashboard;
    default:
      return null;
  }
});

// BMHC Super Admin Route-Based Components
const bmhSuperAdminComponent = computed(() => {
  const path = route.path;
  switch (true) {
    case path.endsWith('/health_certification/dashboard'):
      return BmhSuperAdminDashboard;
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
