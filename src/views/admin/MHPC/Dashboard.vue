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

    <!-- CPD/CPD Provider Section -->
    <template v-else-if="role === 'cme_cpd_provider'">
      <component :is="bmhCmeCpdProviderComponent" />
    </template>

    <!-- Institutions Section -->
    <template v-else-if="role === 'institutions'">
      <component :is="bmhInstitutionsComponent" />
    </template>

    <!-- Legal Officer Section -->
    <template v-else-if="role === 'legal_officer'">
      <component :is="bmhLegalOfficersComponent" />
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
// import ApplicationTable from '@/components/common/ROQUserApplicationsList.vue';

// MHPC Component Imports
import MhpcAdminDashboard from '@/components/dashboard/mhpccomponents/admin/MhpcAdminDashboard.vue'
import MhpcUserManagement from '@/components/dashboard/mhpccomponents/admin/MhpcUserManagement.vue'
import MhpcUserDashboard from '@/components/dashboard/mhpccomponents/user/UserMhpcDashboard.vue'
import MhpcDealingOfficerDashboard from '@/components/dashboard/mhpccomponents/dealingOfficer/DashboardComponent.vue'

import MhpcSuperAdminDashboard from '@/components/dashboard/mhpccomponents/superAdmin/MhpcSuperAdminDashboard.vue'

// BMH user
import CPDcomponent from '@/components/dashboard/mhpccomponents/user/cpdApplication/CPDApplication.vue'
import CPDTracker from '@/components/dashboard/mhpccomponents/user/cpdApplication/CPDTracker.vue'
import CoGSApplication from '@/components/dashboard/mhpccomponents/user/CoGSApplication/CoGSApplication.vue'
import CoGSTracker from '@/components/dashboard/mhpccomponents/user/CoGSApplication/CoGSTracker.vue'
import PractitionerRegistration from '@/components/dashboard/mhpccomponents/user/certificateApplication/CertificateRegistrationComponent.vue'
import PractitionerRenewal from '@/components/dashboard/mhpccomponents/user/certificateApplication/ApplicationRenewal.vue'
import ApplicationTracker from '@/components/dashboard/mhpccomponents/user/certificateApplication/ApplicationTracker.vue'
import AdditionalQualification from '@/components/dashboard/mhpccomponents/user/certificateApplication/AdditionalQualification.vue'
import MHPCUserReports from '@/components/dashboard/mhpccomponents/user/ReportsComponent.vue'
import CounselorApplicationFrom from '@/components/dashboard/mhpccomponents/user/counselorApplication/CounselorApplicationFrom.vue'
import CounselorApplicationTracker from '@/components/dashboard/mhpccomponents/user/counselorApplication/CounselorApplicationTracker.vue'

// Dealing Officer Components
import ApplicationLists from '@/components/dashboard/mhpccomponents/dealingOfficer/userApplications/ApplicationLists.vue'
import RenewalLists from '@/components/dashboard/mhpccomponents/dealingOfficer/userApplications/RenewalLists.vue'
import InstituteManagement from '@/components/dashboard/mhpccomponents/dealingOfficer/instituteManagement/InstituteManagement.vue'
import ProfessionalProfiles from '@/components/dashboard/mhpccomponents/dealingOfficer/ProfessionalProfiles.vue'
import CogsManagement from '@/components/dashboard/mhpccomponents/dealingOfficer/userApplications/CogsManagement.vue'
import Capa from '@/components/dashboard/mhpccomponents/dealingOfficer/instituteManagement/CapaManagement.vue'
import PaymentManagement from '@/components/dashboard/mhpccomponents/dealingOfficer/PaymentsComponent.vue'
import Reports from '@/components/dashboard/mhpccomponents/dealingOfficer/Reports.vue'
import EoiApplication from '@/components/dashboard/mhpccomponents/dealingOfficer/instituteManagement/EoiApplication.vue'
import DprApplication from '@/components/dashboard/mhpccomponents/dealingOfficer/instituteManagement/DprApplication.vue'
import InstituteReport from '@/components/dashboard/mhpccomponents/dealingOfficer/instituteManagement/InstituteReport.vue'
import CpdApplicationReview from '@/components/dashboard/mhpccomponents/dealingOfficer/CPDManagement/CpdApplicationReview.vue'
import CpdCreateApplication from '@/components/dashboard/mhpccomponents/dealingOfficer/CPDManagement/CpdCreateApplication.vue'
import CpdProviderManagement from '@/components/dashboard/mhpccomponents/dealingOfficer/CPDManagement/CpdProviderManagement.vue'
import CpdAwardCredits from '@/components/dashboard/mhpccomponents/dealingOfficer/CPDManagement/SelfCpdManagement.vue'
import CpdReports from '@/components/dashboard/mhpccomponents/dealingOfficer/CPDManagement/CpdReports.vue'
import AdditionalApplication from '@/components/dashboard/mhpccomponents/dealingOfficer/userApplications/AdditionalApplication.vue'
import TeachingHospitals from '@/components/dashboard/mhpccomponents/dealingOfficer/instituteManagement/TeachingHospitals.vue'
import EducationPrograms from '@/components/dashboard/mhpccomponents/dealingOfficer/instituteManagement/EducationPrograms.vue'
import InstituteProfiles from '@/components/dashboard/mhpccomponents/dealingOfficer/instituteManagement/InstituteProfiles.vue'
import InstituteRenewals from '@/components/dashboard/mhpccomponents/dealingOfficer/instituteManagement/InstituteRenewals.vue'
import TeachingHospitalRenewals from '@/components/dashboard/mhpccomponents/dealingOfficer/instituteManagement/TeachingHospitalRenewals.vue'
import Complaints from '@/components/dashboard/mhpccomponents/dealingOfficer/Complaints.vue'
import ModuleManagement from '@/components/dashboard/mhpccomponents/dealingOfficer/instituteManagement/ModuleManagement.vue'
import EducationProgram from '@/components/dashboard/mhpccomponents/dealingOfficer/instituteManagement/EducationProgram.vue'

//MHPC masters components
import MastersCpdActivities from '@/components/dashboard/mhpccomponents/admin/MastersCpdActivities.vue'
import MastersCpdCredits from '@/components/dashboard/mhpccomponents/admin/MastersCpdCredits.vue'
import MastersCpdMethodologies from '@/components/dashboard/mhpccomponents/admin/MastersCpdMethodologies.vue'
import MastersCpdActivity from '@/components/dashboard/mhpccomponents/admin/MastersCpdActivity.vue'
import MastersDocumentTypes from '@/components/dashboard/mhpccomponents/admin/MastersDocumentTypes.vue'
import MastersESignatures from '@/components/dashboard/mhpccomponents/admin/MastersESignatures.vue'
import MastersFeeStructures from '@/components/dashboard/mhpccomponents/admin/MastersFeeStructures.vue'
import MastersFeesAssociatedFor from '@/components/dashboard/mhpccomponents/admin/MastersFeesAssociatedFor.vue'
import MastersFileTypes from '@/components/dashboard/mhpccomponents/admin/MastersFileTypes.vue'
import MastersParticipationCategory from '@/components/dashboard/mhpccomponents/admin/MastersParticipationCategory.vue'
import MastersParticipationSubCategory from '@/components/dashboard/mhpccomponents/admin/MastersPersonnelSubCategory.vue'
import MastersPersonnelCategories from '@/components/dashboard/mhpccomponents/admin/MastersPersonnelCategories.vue'
import MastersPersonnelSubCategory from '@/components/dashboard/mhpccomponents/admin/MastersPersonnelSubCategory.vue'
import MastersQualificationTypes from '@/components/dashboard/mhpccomponents/admin/MastersQualificationTypes.vue'
import MastersQualifications from '@/components/dashboard/mhpccomponents/admin/MastersQualifications.vue'
import MastersRegistrationType from '@/components/dashboard/mhpccomponents/admin/MastersRegistrationType.vue'
import MastersSector from '@/components/dashboard/mhpccomponents/admin/MastersSector.vue'
import MastersUniversity from '@/components/dashboard/mhpccomponents/admin/MastersUniversity.vue'
import CogsAgency from '@/components/dashboard/mhpccomponents/admin/CogsAgency.vue'
import CogsDepartment from '@/components/dashboard/mhpccomponents/admin/CogsDepartment.vue'
import CogsWorkplace from '@/components/dashboard/mhpccomponents/admin/CogsWorkplace.vue'

// CPD Provider Components

import CounselorForm from '@/components/dashboard/mhpccomponents/dealingOfficer/CounselorForm.vue'
import MHPCUserProfile from '@/components/dashboard/mhpccomponents/user/MHPCUserProfile.vue'
import ProviderDashboard from '@/components/dashboard/mhpccomponents/cpdCpdProvider/ProviderDashboard.vue'
// import CPDApplicationDetails from '@/components/dashboard/mhpccomponents/cpdCpdProvider/CPDApplicationDetails.vue'
import CPDApplicationTracker from '@/components/dashboard/mhpccomponents/cpdCpdProvider/CPDApplicationTracker.vue'
import CpdProviderApplicationForm from '@/components/dashboard/mhpccomponents/cpdCpdProvider/CpdProviderApplicationForm.vue'

//institute components
import InstituteEoiApplication from '@/components/dashboard/mhpccomponents/institutions/InstituteEoiApplication.vue'
import InstituteDPRApplication from '@/components/dashboard/mhpccomponents/institutions/InstituteDPRApplication.vue'
import TrackEoiApplication from '@/components/dashboard/mhpccomponents/institutions/TrackEoiApplication.vue'
import TrackDPRApplication from '@/components/dashboard/mhpccomponents/institutions/TrackDPRApplication.vue'
import ViewCertificates from '@/components/dashboard/mhpccomponents/institutions/ViewCertificates.vue'
import InstituteProfile from '@/components/dashboard/mhpccomponents/institutions/InstitutionProfile.vue'
import TeachingCenter from '@/components/dashboard/mhpccomponents/institutions/TeachingCenterApplicationModal.vue'
import TeachingCenterRenewal from '@/components/dashboard/mhpccomponents/institutions/TeachingCenterTrackAndRenew.vue'
import NewEducationProgram from '@/components/dashboard/mhpccomponents/institutions/NewEducationProgram.vue'
// import MyApplications from '@/components/dashboard/mhpccomponents/institutions/MyApplications.vue'
import InstitutesRenewal from '@/components/dashboard/mhpccomponents/institutions/InstitutesRenewal.vue'
import MyCapa from '@/components/dashboard/mhpccomponents/institutions/MyCapa.vue'
import StaffManagement from '@/components/dashboard/mhpccomponents/institutions/StaffManagement.vue'
import CourseManagement from '@/components/dashboard/mhpccomponents/institutions/CourseManagement.vue'
import DepartmentManagement from '@/components/dashboard/mhpccomponents/institutions/DepartmentManagement.vue'
import CPDapprovedAddParticipants from '@/components/dashboard/mhpccomponents/cpdCpdProvider/Participantscomponents/CPDapprovedAddParticipants.vue'
import PhysicalVerification from '@/components/dashboard/mhpccomponents/institutions/PhysicalVerification.vue'
import TeachingCenterTracking from '@/components/dashboard/mhpccomponents/institutions/TeachingCenterTracking.vue'
import NewEducationProgramApplication from '@/components/dashboard/mhpccomponents/institutions/NewEducationProgramApplication.vue'

import InstituteDashboard from '@/components/dashboard/mhpccomponents/institutions/InstituteDashboard.vue'

// Legal Officer Components
import LegalDashboard from '@/components/dashboard/mhpccomponents/legalOfficers/LegalDashboard.vue'
import ComplaintManagement from '@/components/dashboard/mhpccomponents/legalOfficers/ComplaintManagement.vue'

const { role } = useAuthStore()
const route = useRoute()

// MHPC Admin Route-Based Components
const bmhAdminComponent = computed(() => {
  const path = route.path
  switch (true) {
    case path.endsWith('/health_certification/dashboard'):
      return MhpcAdminDashboard
    case path.endsWith('/health_certification/user_management'):
      return MhpcUserManagement
    case path.endsWith('/health_certification/cpd_activities'):
      return MastersCpdActivities
    case path.endsWith('/health_certification/cpd_credits'):
      return MastersCpdCredits
    case path.endsWith('/health_certification/cpd_methodologies'):
      return MastersCpdMethodologies
    case path.endsWith('/health_certification/cpd_activity'):
      return MastersCpdActivity
    case path.endsWith('/health_certification/document_types'):
      return MastersDocumentTypes
    case path.endsWith('/health_certification/e_signatures'):
      return MastersESignatures
    case path.endsWith('/health_certification/fee_structures'):
      return MastersFeeStructures
    case path.endsWith('/health_certification/fees_associated_for'):
      return MastersFeesAssociatedFor
    case path.endsWith('/health_certification/file_types'):
      return MastersFileTypes
    case path.endsWith('/health_certification/participation_category'):
      return MastersParticipationCategory
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
      return MastersSector
    case path.endsWith('/health_certification/university'):
      return MastersUniversity
    case path.endsWith('/health_certification/cogs_agency'):
      return CogsAgency
    case path.endsWith('/health_certification/cogs_dept'):
      return CogsDepartment
    case path.endsWith('/health_certification/cogs_workplace'):
      return CogsWorkplace
    case path.endsWith('/health_certification/MastersPersonnelSubCategory'):
      return MastersPersonnelSubCategory
    default:
      return null
  }
})

// MHPC User Route-Based Components
const bmhUserComponent = computed(() => {
  const path = route.path
  switch (true) {
    case path.endsWith('/health_certification/dashboard'):
      return MhpcUserDashboard
    case path.endsWith('/health_certification/registration'):
      return PractitionerRegistration
    case path.endsWith('/health_certification/my_applications'):
      return ApplicationTracker
    case path.endsWith('/health_certification/renewal'):
      return PractitionerRenewal
    case path.endsWith('/health_certification/additional_qualification'):
      return AdditionalQualification
    case path.endsWith('/health_certification/cpd'):
      return CPDcomponent
    case path.endsWith('/health_certification/track_cpd_applications'):
      return CPDTracker
    case path.endsWith('/health_certification/CoGS'):
      return CoGSApplication
    case path.endsWith('/health_certification/track_cogs_applications'):
      return CoGSTracker
    case path.endsWith('/health_certification/reports'):
      return MHPCUserReports
    case path.endsWith('/health_certification/counselor_application'):
      return CounselorApplicationFrom
    case path.endsWith('/health_certification/user_profile'):
      return MHPCUserProfile
    case path.endsWith('/health_certification/track_counselor_application'):
      return CounselorApplicationTracker

    default:
      return null
  }
})

// MHPC Dealing Officer Route-Based Components
const bmhDealingOfficerComponent = computed(() => {
  const path = route.path
  switch (true) {
    case path.endsWith('/health_certification/dashboard'):
      return MhpcDealingOfficerDashboard
    case path.endsWith('/health_certification/application_lists'):
      return ApplicationLists
    case path.endsWith('/health_certification/renewal_lists'):
      return RenewalLists
    case path.endsWith('/health_certification/cpd_application_review'):
      return CpdApplicationReview
    case path.endsWith('/health_certification/cpd_create_application'):
      return CpdCreateApplication
    case path.endsWith('/health_certification/cpd_provider_management'):
      return CpdProviderManagement
    case path.endsWith('/health_certification/cpd_award_credits'):
      return CpdAwardCredits
    case path.endsWith('/health_certification/cpd_reports'):
      return CpdReports
    case path.endsWith('/health_certification/institutes'):
      return InstituteManagement
    case path.endsWith('/health_certification/profiles'):
      return ProfessionalProfiles
    case path.endsWith('/health_certification/cogs'):
      return CogsManagement
    case path.endsWith('/health_certification/capa'):
      return Capa
    case path.endsWith('/health_certification/payments'):
      return PaymentManagement
    case path.endsWith('/health_certification/counselor_application'):
      return CounselorForm
    case path.endsWith('/health_certification/reports'):
      return Reports
    case path.endsWith('/health_certification/eoi_application'):
      return EoiApplication
    case path.endsWith('/health_certification/dpr_application'):
      return DprApplication
    case path.endsWith('/health_certification/institute_report'):
      return InstituteReport
    case path.endsWith('/health_certification/additional_application'):
      return AdditionalApplication
    case path.endsWith('/health_certification/teaching_hospitals'):
      return TeachingHospitals
    case path.endsWith('/health_certification/education_programs'):
      return EducationPrograms
    case path.endsWith('/health_certification/institute_renewals'):
      return InstituteRenewals
    case path.endsWith('/health_certification/teaching_hospital_renewals'):
      return TeachingHospitalRenewals
    case path.endsWith('/health_certification/institute_profiles'):
      return InstituteProfiles
    case path.endsWith('/health_certification/complaints'):
      return Complaints
    case path.endsWith('/health_certification/module_management'):
      return ModuleManagement
    case path.endsWith('/health_certification/education_program_management'):
      return EducationProgram

    default:
      return null
  }
})

// MHPC CPD/CPD Provider Route-Based Components
const bmhCmeCpdProviderComponent = computed(() => {
  const path = route.path
  switch (true) {
    case path.endsWith('/health_certification/dashboard'):
      return ProviderDashboard
    case path.endsWith('/health_certification/cpd_application_details'):
      return CpdProviderApplicationForm
    case path.endsWith('/health_certification/cpd_application_tracker'):
      return CPDApplicationTracker
    case path.endsWith('/health_certification/cpd_approved_add_participants'):
      return CPDapprovedAddParticipants
    case path.endsWith('/health_certification/cpd_provider_application_form'):
      return CpdProviderApplicationForm


    default:
      return null
  }
})

// MHPC Legal Officer Route-Based Components
const bmhLegalOfficersComponent = computed(() => {
  const path = route.path
  switch (true) {
    case path.endsWith('/health_certification/dashboard'):
      return LegalDashboard
    case path.endsWith('/health_certification/cpd_application_details'):
      return ComplaintManagement

    default:
      return null
  }
})

// MHPC Institutions Route-Based Components
const bmhInstitutionsComponent = computed(() => {
  const path = route.path
  switch (true) {
    case path.endsWith('/health_certification/dashboard'):
      return InstituteDashboard

    case path.endsWith('/health_certification/apply_for_eoi'):
      return InstituteEoiApplication
    case path.endsWith('/health_certification/track_eoi'):
      return TrackEoiApplication

    case path.endsWith('/health_certification/apply_for_dpr'):
      return InstituteDPRApplication
    case path.endsWith('/health_certification/track_dpr'):
      return TrackDPRApplication
    case path.endsWith('/health_certification/view_certificates'):
      return ViewCertificates
    case path.endsWith('/health_certification/institution_profile'):
      return InstituteProfile
    case path.endsWith('/health_certification/new_teaching_hospital'):
      return TeachingCenter
    case path.endsWith('/health_certification/renewal_teaching_hospital'):
      return TeachingCenterRenewal
    case path.endsWith('/health_certification/new_education_program'):
      return NewEducationProgram
    case path.endsWith('/health_certification/my_applications'):
    case path.endsWith('/health_certification/institutes_renewal'):
      return InstitutesRenewal
    case path.endsWith('/health_certification/my_capa'):
      return MyCapa
    case path.endsWith('/health_certification/staff_management'):
      return StaffManagement
    case path.endsWith('/health_certification/course_management'):
      return CourseManagement
    case path.endsWith('/health_certification/department_management'):
      return DepartmentManagement
    case path.endsWith('/health_certification/site_visit_schedule'):
      return PhysicalVerification
    case path.endsWith('/health_certification/teaching_center_tracking'):
      return TeachingCenterTracking
    case path.endsWith('/health_certification/new_education_program_application'):
      return NewEducationProgramApplication


    default:
      return null
  }
})

// MHPC Super Admin Route-Based Components
const bmhSuperAdminComponent = computed(() => {
  const path = route.path
  switch (true) {
    case path.endsWith('/health_certification/dashboard'):
      return MhpcSuperAdminDashboard
    default:
      return null
  }
})
</script>
