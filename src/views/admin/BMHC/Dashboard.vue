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
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
// import ApplicationTable from '@/components/common/ROQUserApplicationsList.vue';

// BMHC Component Imports
import BmhAdminDashboard from '@/components/dashboard/bhmccomponents/admin/BmhAdminDashboard.vue';
import BmhUserManagement from '@/components/dashboard/bhmccomponents/admin/BmhUserManagement.vue';
import BmhUserDashboard from '@/components/dashboard/bhmccomponents/user/UserBmhcDashboard.vue';
import BmhDealingOfficerDashboard from '@/components/dashboard/bhmccomponents/dealingOfficer/DashboardComponent.vue';
import BmhInstitutionsDashboard from '@/components/dashboard/bhmccomponents/institutions/InstitutionsDashboard.vue';
import BmhSuperAdminDashboard from '@/components/dashboard/bhmccomponents/superAdmin/BmhSuperAdminDashboard.vue';

// BMH user
import CPDcomponent from '@/components/dashboard/bhmccomponents/user/cpdApplication/CPDApplication.vue';
import CPDTracker from '@/components/dashboard/bhmccomponents/user/cpdApplication/CPDTracker.vue';
import CoGSApplication from '@/components/dashboard/bhmccomponents/user/CoGSApplication/CoGSApplication.vue';
import CoGSTracker from '@/components/dashboard/bhmccomponents/user/CoGSApplication/CoGSTracker.vue';
import PractitionerRegistration from '@/components/dashboard/bhmccomponents/user/certificateApplication/CertificateRegistrationComponent.vue';
import PractitionerRenewal from '@/components/dashboard/bhmccomponents/user/certificateApplication/ApplicationRenewal.vue';
import ApplicationTracker from '@/components/dashboard/bhmccomponents/user/certificateApplication/ApplicationTracker.vue';
import AdditionalQualification from '@/components/dashboard/bhmccomponents/user/certificateApplication/AdditionalQualification.vue';
import ReRegistration from '@/components/dashboard/bhmccomponents/user/certificateApplication/ReRegistration.vue';
import BMHCUserReports from '@/components/dashboard/bhmccomponents/user/ReportsComponent.vue';
import CounselorApplicationFrom from '@/components/dashboard/bhmccomponents/user/counselorApplication/CounselorApplicationFrom.vue';
import CounselorApplicationTracker from '@/components/dashboard/bhmccomponents/user/counselorApplication/CounselorApplicationTracker.vue';

// Dealing Officer Components
import ApplicationLists from '@/components/dashboard/bhmccomponents/dealingOfficer/userApplications/ApplicationLists.vue';
import RenewalLists from '@/components/dashboard/bhmccomponents/dealingOfficer/userApplications/RenewalLists.vue';
import InstituteManagement from '@/components/dashboard/bhmccomponents/dealingOfficer/instituteManagement/InstituteManagement.vue';
import ProfessionalProfiles from '@/components/dashboard/bhmccomponents/dealingOfficer/ProfessionalProfiles.vue';
import CogsManagement from '@/components/dashboard/bhmccomponents/dealingOfficer/userApplications/CogsManagement.vue';
import Capa from '@/components/dashboard/bhmccomponents/dealingOfficer/instituteManagement/CapaManagement.vue';
import PaymentManagement from '@/components/dashboard/bhmccomponents/dealingOfficer/PaymentsComponent.vue';
import Reports from '@/components/dashboard/bhmccomponents/dealingOfficer/Reports.vue';
import EoiApplication from '@/components/dashboard/bhmccomponents/dealingOfficer/instituteManagement/EoiApplication.vue';
import DprApplication from '@/components/dashboard/bhmccomponents/dealingOfficer/instituteManagement/DprApplication.vue';
import InstituteReport from '@/components/dashboard/bhmccomponents/dealingOfficer/instituteManagement/InstituteReport.vue';
import CpdApplicationReview from '@/components/dashboard/bhmccomponents/dealingOfficer/CPDManagement/CpdApplicationReview.vue';
import CpdCreateApplication from '@/components/dashboard/bhmccomponents/dealingOfficer/CPDManagement/CpdCreateApplication.vue';
import CpdProviderManagement from '@/components/dashboard/bhmccomponents/dealingOfficer/CPDManagement/CpdProviderManagement.vue';
import CpdAwardCredits from '@/components/dashboard/bhmccomponents/dealingOfficer/CPDManagement/CpdAwardCredits.vue';
import CpdReports from '@/components/dashboard/bhmccomponents/dealingOfficer/CPDManagement/CpdReports.vue';
import ReRegistrationLists from '@/components/dashboard/bhmccomponents/dealingOfficer/userApplications/ReRegistrationLists.vue';
import AdditionalApplication from '@/components/dashboard/bhmccomponents/dealingOfficer/userApplications/AdditionalApplication.vue';
import TeachingHospitals from '@/components/dashboard/bhmccomponents/dealingOfficer/instituteManagement/TeachingHospitals.vue';
//BMHC masters components
import MastersCmeActivities from '@/components/dashboard/bhmccomponents/admin/MastersCmeActivities.vue';
import MastersCmeCredits from '@/components/dashboard/bhmccomponents/admin/MastersCmeCredits.vue';
import MastersCmeMethodologies from '@/components/dashboard/bhmccomponents/admin/MastersCmeMethodologies.vue';
import MastersCpdActivity from '@/components/dashboard/bhmccomponents/admin/MastersCpdActivity.vue';
import MastersDocumentTypes from '@/components/dashboard/bhmccomponents/admin/MastersDocumentTypes.vue';
import MastersESignatures from '@/components/dashboard/bhmccomponents/admin/MastersESignatures.vue';
import MastersFeeStructures from '@/components/dashboard/bhmccomponents/admin/MastersFeeStructures.vue';
import MastersFeesAssociatedFor from '@/components/dashboard/bhmccomponents/admin/MastersFeesAssociatedFor.vue';
import MastersFileTypes from '@/components/dashboard/bhmccomponents/admin/MastersFileTypes.vue';
import MastersParticipationCategory from '@/components/dashboard/bhmccomponents/admin/MastersParticipationCategory.vue';
import MastersParticipationSubCategory from '@/components/dashboard/bhmccomponents/admin/MastersParticipationSubCategory.vue';
import MastersPersonnelCategories from '@/components/dashboard/bhmccomponents/admin/MastersPersonnelCategories.vue';
import MastersQualificationTypes from '@/components/dashboard/bhmccomponents/admin/MastersQualificationTypes.vue';
import MastersQualifications from '@/components/dashboard/bhmccomponents/admin/MastersQualifications.vue';
import MastersRegistrationType from '@/components/dashboard/bhmccomponents/admin/MastersRegistrationType.vue';
import MastersSector from '@/components/dashboard/bhmccomponents/admin/MastersSector.vue';
import MastersSubCategories from '@/components/dashboard/bhmccomponents/admin/MastersSubCategories.vue';
import MastersUniversity from '@/components/dashboard/bhmccomponents/admin/MastersUniversity.vue';
import CogsAgency from '@/components/dashboard/bhmccomponents/admin/CogsAgency.vue';
import CogsDepartment from '@/components/dashboard/bhmccomponents/admin/CogsDepartment.vue';
import CogsWorkplace from '@/components/dashboard/bhmccomponents/admin/CogsWorkplace.vue';

// CPD Provider Components

import CounselorForm from '@/components/dashboard/bhmccomponents/dealingOfficer/CounselorForm.vue';
import BMHCUserProfile from '@/components/dashboard/bhmccomponents/user/BMHCUserProfile.vue';
import ProviderDashboard from '@/components/dashboard/bhmccomponents/cpdCmeProvider/ProviderDashboard.vue';
import CPDApplicationDetails from '@/components/dashboard/bhmccomponents/cpdCmeProvider/CPDApplicationDetails.vue';
import CPDApplicationTracker from '@/components/dashboard/bhmccomponents/cpdCmeProvider/CPDApplicationTracker.vue';

//institute components
import InstituteEoiApplication from '@/components/dashboard/bhmccomponents/institutions/InstituteEoiApplication.vue';
import InstituteDPRApplication from '@/components/dashboard/bhmccomponents/institutions/InstituteDPRApplication.vue';
import TrackEoiApplication from '@/components/dashboard/bhmccomponents/institutions/TrackEoiApplication.vue';
import TrackDPRApplication from '@/components/dashboard/bhmccomponents/institutions/TrackDPRApplication.vue';
import ViewCertificates from '@/components/dashboard/bhmccomponents/institutions/ViewCertificates.vue';
import InstituteProfile from '@/components/dashboard/bhmccomponents/institutions/InstitutionProfile.vue';
import TeachingCenter from '@/components/dashboard/bhmccomponents/institutions/TeachingCenter.vue';
import TeachingCenterRenewal from '@/components/dashboard/bhmccomponents/institutions/TeachingCenterRenewal.vue';
import NewEducationProgram from '@/components/dashboard/bhmccomponents/institutions/NewEducationProgram.vue';
import MyApplications from '@/components/dashboard/bhmccomponents/institutions/MyApplications.vue';
import InstitutesRenewal from '@/components/dashboard/bhmccomponents/institutions/InstitutesRenewal.vue';
import MyCapa from '@/components/dashboard/bhmccomponents/institutions/MyCapa.vue';
const { role } = useAuthStore();
const route = useRoute();

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
    case path.endsWith('/health_certification/additional_qualification'):
      return AdditionalQualification;
    case path.endsWith('/health_certification/re_registration'):
      return ReRegistration;
    case path.endsWith('/health_certification/cpd'):
      return CPDcomponent;
    case path.endsWith('/health_certification/track_cpd_applications'):
      return CPDTracker;
    case path.endsWith('/health_certification/CoGS'):
      return CoGSApplication;
    case path.endsWith('/health_certification/track_cogs_applications'):
      return CoGSTracker;
    case path.endsWith('/health_certification/reports'):
      return BMHCUserReports;
    case path.endsWith('/health_certification/counselor_application'):
      return CounselorApplicationFrom;
    case path.endsWith('/health_certification/user_profile'):
      return BMHCUserProfile;
    case path.endsWith('/health_certification/track_counselor_application'):
      return CounselorApplicationTracker;

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
    case path.endsWith('/health_certification/renewal_lists'):
      return RenewalLists;
    case path.endsWith('/health_certification/re_registration_lists'):
      return ReRegistrationLists;
    case path.endsWith('/health_certification/cpd_application_review'):
      return CpdApplicationReview;
    case path.endsWith('/health_certification/cpd_create_application'):
      return CpdCreateApplication;
    case path.endsWith('/health_certification/cpd_provider_management'):
      return CpdProviderManagement;
    case path.endsWith('/health_certification/cpd_award_credits'):
      return CpdAwardCredits;
    case path.endsWith('/health_certification/cpd_reports'):
      return CpdReports;
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
    case path.endsWith('/health_certification/counselor_application'):
      return CounselorForm;
    case path.endsWith('/health_certification/reports'):
      return Reports;
    case path.endsWith('/health_certification/eoi_application'):
      return EoiApplication;

    case path.endsWith('/health_certification/dpr_application'):
      return DprApplication;
    case path.endsWith('/health_certification/institute_report'):
      return InstituteReport;
    case path.endsWith('/health_certification/additional_application'):
      return AdditionalApplication;
    case path.endsWith('/health_certification/teaching_hospitals'):
      return TeachingHospitals;
    case path.endsWith('/health_certification/education_programs'):
      return AdditionalApplication;
    case path.endsWith('/health_certification/institute_renewals'):
      return AdditionalApplication;
    case path.endsWith('/health_certification/teaching_hospital_renewals'):
      return AdditionalApplication;
    default:
      return null;
  }
});

// BMHC CPD/CME Provider Route-Based Components
const bmhCpdCmeProviderComponent = computed(() => {
  const path = route.path;
  switch (true) {
    case path.endsWith('/health_certification/dashboard'):
      return ProviderDashboard;
    case path.endsWith('/health_certification/cpd_application_details'):
      return CPDApplicationDetails;
    case path.endsWith('/health_certification/cpd_application_tracker'):
      return CPDApplicationTracker;
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

    case path.endsWith('/health_certification/apply_for_eoi'):
      return InstituteEoiApplication;
    case path.endsWith('/health_certification/track_eoi'):
      return TrackEoiApplication;

    case path.endsWith('/health_certification/apply_for_dpr'):
      return InstituteDPRApplication;
    case path.endsWith('/health_certification/track_dpr'):
      return TrackDPRApplication;
    case path.endsWith('/health_certification/view_certificates'):
      return ViewCertificates;
    case path.endsWith('/health_certification/institution_profile'):
      return InstituteProfile;
      case path.endsWith('/health_certification/new_teaching_hospital'):
      return TeachingCenter;
    case path.endsWith('/health_certification/renewal_teaching_hospital'):
      return TeachingCenterRenewal;
    case path.endsWith('/health_certification/new_education_program'):
      return NewEducationProgram;
    case path.endsWith('/health_certification/my_applications'):  // My Applications
      return MyApplications;
    case path.endsWith('/health_certification/institutes_renewal'):  
      return InstitutesRenewal;  
    case path.endsWith('/health_certification/my_capa'):
      return MyCapa;  
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
</script>
