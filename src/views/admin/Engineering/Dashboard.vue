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
import CPDTracker from '@/components/dashboard/engineeringcomponents/user/CPDTracker.vue';
import CoGSTracker from '@/components/dashboard/engineeringcomponents/user/CoGSTracker.vue';

// Practitioner Registration Components
import PractitionerRegistration from '@/components/dashboard/engineeringcomponents/user/pracitioner_reg_and_cert/PractitionerRegistration.vue';
import PractitionerCertification from '@/components/dashboard/engineeringcomponents/user/pracitioner_reg_and_cert/PractitionerCertification.vue';
import PractitionerRenewal from '@/components/dashboard/engineeringcomponents/user/pracitioner_reg_and_cert/PractitionerRenewal.vue';

// Dealing Officer Components
import ApplicationLists from '@/components/dashboard/engineeringcomponents/dealingOfficer/ApplicationLists.vue';
import RenewalLists from '@/components/dashboard/engineeringcomponents/dealingOfficer/RenewalLists.vue';
import CpdManagement from '@/components/dashboard/engineeringcomponents/dealingOfficer/CpdManagement.vue';
import InstituteManagement from '@/components/dashboard/engineeringcomponents/dealingOfficer/InstituteManagement.vue';
import ProfessionalProfiles from '@/components/dashboard/engineeringcomponents/dealingOfficer/ProfessionalProfiles.vue';
import CogsManagement from '@/components/dashboard/engineeringcomponents/dealingOfficer/CogsManagement.vue';
import EngineeringCapa from '@/components/dashboard/engineeringcomponents/dealingOfficer/EngineeringCapa.vue';
import EngineeringPayments from '@/components/dashboard/engineeringcomponents/dealingOfficer/EngineeringPayments.vue';
import EngineeringReports from '@/components/dashboard/engineeringcomponents/dealingOfficer/EngineeringReports.vue';
import ReRegistrationLists from '@/components/dashboard/engineeringcomponents/dealingOfficer/ReRegistrationLists.vue';
import AdditionalApplication from '@/components/dashboard/engineeringcomponents/dealingOfficer/AdditionalApplication.vue';

// CPD Provider Components
import EngineeringProviderDashboard from '@/components/dashboard/engineeringcomponents/cpdCmeProvider/EngineeringCpdCmeProviderDashboard.vue';
import CPDApplicationDetails from '@/components/dashboard/engineeringcomponents/cpdCmeProvider/CPDApplicationDetails.vue';
import CPDApplicationTracker from '@/components/dashboard/engineeringcomponents/cpdCmeProvider/CPDApplicationTracker.vue';
import CPDapprovedAddParticipants from '@/components/dashboard/engineeringcomponents/cpdCmeProvider/CPDapprovedAddParticipants.vue';

// Institution Components
import InstituteEoiApplication from '@/components/dashboard/engineeringcomponents/institutions/InstituteEoiApplication.vue';
import InstituteDPRApplication from '@/components/dashboard/engineeringcomponents/institutions/InstituteDPRApplication.vue';
import TrackEoiApplication from '@/components/dashboard/engineeringcomponents/institutions/TrackEoiApplication.vue';
import TrackDPRApplication from '@/components/dashboard/engineeringcomponents/institutions/TrackDPRApplication.vue';
import ViewCertificates from '@/components/dashboard/engineeringcomponents/institutions/ViewCertificates.vue';
import InstituteProfile from '@/components/dashboard/engineeringcomponents/institutions/InstitutionProfile.vue';
import MyApplications from '@/components/dashboard/engineeringcomponents/institutions/MyApplications.vue';
import InstitutesRenewal from '@/components/dashboard/engineeringcomponents/institutions/InstitutesRenewal.vue';
import MyCapa from '@/components/dashboard/engineeringcomponents/institutions/MyCapa.vue';
import StaffManagement from '@/components/dashboard/engineeringcomponents/institutions/StaffManagement.vue';
import CourseManagement from '@/components/dashboard/engineeringcomponents/institutions/CourseManagement.vue';
import DepartmentManagement from '@/components/dashboard/engineeringcomponents/institutions/DepartmentManagement.vue';

//Engineering masters components
import MastersCmeActivities from '@/components/dashboard/engineeringcomponents/admin/MastersCmeActivities.vue';
import MastersCmeCredits from '@/components/dashboard/engineeringcomponents/admin/MastersCmeCredits.vue';
import MastersCmeMethodologies from '@/components/dashboard/engineeringcomponents/admin/MastersCmeMethodologies.vue';
import MastersCpdActivity from '@/components/dashboard/engineeringcomponents/admin/MastersCpdActivity.vue';
import MastersDocumentTypes from '@/components/dashboard/engineeringcomponents/admin/MastersDocumentTypes.vue';
import MastersESignatures from '@/components/dashboard/engineeringcomponents/admin/MastersESignatures.vue';
import MastersFeeStructures from '@/components/dashboard/engineeringcomponents/admin/MastersFeeStructures.vue';
import MastersFeesAssociatedFor from '@/components/dashboard/engineeringcomponents/admin/MastersFeesAssociatedFor.vue';
import MastersFileTypes from '@/components/dashboard/engineeringcomponents/admin/MastersFileTypes.vue';
import MastersParticipationCategory from '@/components/dashboard/engineeringcomponents/admin/MastersParticipationCategory.vue';
import MastersParticipationSubCategory from '@/components/dashboard/engineeringcomponents/admin/MastersParticipationSubCategory.vue';
import MastersPersonnelCategories from '@/components/dashboard/engineeringcomponents/admin/MastersPersonnelCategories.vue';
import MastersQualificationTypes from '@/components/dashboard/engineeringcomponents/admin/MastersQualificationTypes.vue';
import MastersQualifications from '@/components/dashboard/engineeringcomponents/admin/MastersQualifications.vue';
import MastersRegistrationType from '@/components/dashboard/engineeringcomponents/admin/MastersRegistrationType.vue';
import MastersSector from '@/components/dashboard/engineeringcomponents/admin/MastersSector.vue';
import MastersSubCategories from '@/components/dashboard/engineeringcomponents/admin/MastersSubCategories.vue';
import MastersUniversity from '@/components/dashboard/engineeringcomponents/admin/MastersUniversity.vue';
import CogsAgency from '@/components/dashboard/engineeringcomponents/admin/CogsAgency.vue';
import CogsDepartment from '@/components/dashboard/engineeringcomponents/admin/CogsDepartment.vue';
import CogsWorkplace from '@/components/dashboard/engineeringcomponents/admin/CogsWorkplace.vue';

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
    case path.endsWith('/engineering_certification/cme_activities'):
      return MastersCmeActivities
    case path.endsWith('/engineering_certification/cme_credits'):
      return MastersCmeCredits
    case path.endsWith('/engineering_certification/cme_methodologies'):
      return MastersCmeMethodologies
    case path.endsWith('/engineering_certification/cpd_activity'):
      return MastersCpdActivity
    case path.endsWith('/engineering_certification/document_types'):
      return MastersDocumentTypes;
    case path.endsWith('/engineering_certification/e_signatures'):
      return MastersESignatures;
    case path.endsWith('/engineering_certification/fee_structures'):
      return MastersFeeStructures
    case path.endsWith('/engineering_certification/fees_associated_for'):
      return MastersFeesAssociatedFor
    case path.endsWith('/engineering_certification/file_types'):
      return MastersFileTypes;
    case path.endsWith('/engineering_certification/participation_category'):
      return MastersParticipationCategory;
    case path.endsWith('/engineering_certification/participation_sub_category'):
      return MastersParticipationSubCategory
    case path.endsWith('/engineering_certification/personnel_categories'):
      return MastersPersonnelCategories
    case path.endsWith('/engineering_certification/qualification_types'):
      return MastersQualificationTypes
    case path.endsWith('/engineering_certification/qualifications'):
      return MastersQualifications
    case path.endsWith('/engineering_certification/registration_type'):
      return MastersRegistrationType
    case path.endsWith('/engineering_certification/sector'):
      return MastersSector;
    case path.endsWith('/engineering_certification/sub_categories'):
      return MastersSubCategories
    case path.endsWith('/engineering_certification/university'):
      return MastersUniversity
    case path.endsWith('/engineering_certification/cogs_agency'):
      return CogsAgency;
    case path.endsWith('/engineering_certification/cogs_dept'):
      return CogsDepartment;
    case path.endsWith('/engineering_certification/cogs_workplace'):
      return CogsWorkplace;
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
    case path.endsWith('/engineering_certification/track_cpd_applications'):
      return CPDTracker;
    case path.endsWith('/engineering_certification/track_cogs_applications'):
      return CoGSTracker;
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
    case path.endsWith('/engineering_certification/renewal_lists'):
      return RenewalLists;
    case path.endsWith('/engineering_certification/re_registration_lists'):
      return ReRegistrationLists;
    case path.endsWith('/engineering_certification/cpd_application_review'):
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
    case path.endsWith('/engineering_certification/additional_application'):
      return AdditionalApplication;
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
    case path.endsWith('/engineering_certification/cpd_application_details'):
      return CPDApplicationDetails;
    case path.endsWith('/engineering_certification/cpd_application_tracker'):
      return CPDApplicationTracker;
    case path.endsWith('/engineering_certification/cpd_approved_add_participants'):
      return CPDapprovedAddParticipants;
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
    case path.endsWith('/engineering_certification/apply_for_eoi'):
      return InstituteEoiApplication;
    case path.endsWith('/engineering_certification/track_eoi'):
      return TrackEoiApplication;
    case path.endsWith('/engineering_certification/apply_for_dpr'):
      return InstituteDPRApplication;
    case path.endsWith('/engineering_certification/track_dpr'):
      return TrackDPRApplication;
    case path.endsWith('/engineering_certification/view_certificates'):
      return ViewCertificates;
    case path.endsWith('/engineering_certification/institution_profile'):
      return InstituteProfile;
    case path.endsWith('/engineering_certification/my_applications'):
      return MyApplications;
    case path.endsWith('/engineering_certification/institutes_renewal'):
      return InstitutesRenewal;
    case path.endsWith('/engineering_certification/my_capa'):
      return MyCapa;
    case path.endsWith('/engineering_certification/staff_management'):
      return StaffManagement;
    case path.endsWith('/engineering_certification/course_management'):
      return CourseManagement;
    case path.endsWith('/engineering_certification/department_management'):
      return DepartmentManagement;
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