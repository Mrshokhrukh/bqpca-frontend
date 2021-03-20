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
import ECPFInhouseEvent from '@/components/dashboard/ecpfcomponents/user/ECPFInhouseEvent.vue';
import ECPFMassmedia from '@/components/dashboard/ecpfcomponents/user/ECPFMassmedia.vue';
import ECPFHeiVisit from '@/components/dashboard/ecpfcomponents/user/ECPFHeiVisit.vue';
import HrBiodata from '@/components/dashboard/ecpfcomponents/user/HrBiodata.vue';
import StudentBiodata from '@/components/dashboard/ecpfcomponents/user/StudentBiodata.vue';
import ECPFUserProfile from '@/components/dashboard/ecpfcomponents/user/ECPFUserProfile.vue';
import ECPFTrackApplications from '@/components/dashboard/ecpfcomponents/user/ECPFTrackApplications.vue';
import UploadTradeLicense from '@/components/dashboard/ecpfcomponents/user/UploadTradeLicense.vue';
// Dealing officer Components
import ECPFDealingOfficerDashboard from '@/components/dashboard/ecpfcomponents/dealingOfficer/ECPFDealingOfficerDashboard.vue';
import IndividualEcpfApplications from '@/components/dashboard/ecpfcomponents/dealingOfficer/IndividualEcpfApplications.vue';
import CollaboratedEcpfApplications from '@/components/dashboard/ecpfcomponents/dealingOfficer/CollaboratedEcpfApplications.vue';
import RenewalApplications from '@/components/dashboard/ecpfcomponents/dealingOfficer/RenewalApplications.vue';
import OwnershipChangeApplications from '@/components/dashboard/ecpfcomponents/dealingOfficer/OwnershipChangeApplications.vue';
import NameChangeApplications from '@/components/dashboard/ecpfcomponents/dealingOfficer/NameChangeApplications.vue';
import LocationChangeApplications from '@/components/dashboard/ecpfcomponents/dealingOfficer/LocationChangeApplications.vue';
import EducationFair from '@/components/dashboard/ecpfcomponents/dealingOfficer/EducationFair.vue';
import MassMediaEvent from '@/components/dashboard/ecpfcomponents/dealingOfficer/MassMediaEvent.vue';
import HeiVisit from '@/components/dashboard/ecpfcomponents/dealingOfficer/HeiVisit.vue';
import InhouseEvent from '@/components/dashboard/ecpfcomponents/dealingOfficer/InhouseEvent.vue';
import ECPFLinkEstablishment from '@/components/dashboard/ecpfcomponents/dealingOfficer/ECPFLinkEstablishment.vue';
import AddHr from '@/components/dashboard/ecpfcomponents/dealingOfficer/AddHr.vue';
import AddStudent from '@/components/dashboard/ecpfcomponents/dealingOfficer/AddStudent.vue';
import ECPFReports from '@/components/dashboard/ecpfcomponents/dealingOfficer/ECPFReports.vue';
import ECPFPaymentHistory from '@/components/dashboard/ecpfcomponents/dealingOfficer/ECPFPaymentHistory.vue';
import BranchEcpfApplications from '@/components/dashboard/ecpfcomponents/dealingOfficer/BranchEcpfApplications.vue';
import ECPFNonComplaince from '@/components/dashboard/ecpfcomponents/dealingOfficer/ECPFNonCompliance.vue';

// Admin Components
import ECPFAdminDashboard from '@/components/dashboard/ecpfcomponents/admin/ECPFAdminDashboard.vue';
import ECPFComplianceAction from '@/components/dashboard/ecpfcomponents/admin/ECPFComplianceAction.vue';
import ECPFComplianceActionTaken from '@/components/dashboard/ecpfcomponents/admin/ECPFComplianceActionTaken.vue';
import ECPFPDecisions from '@/components/dashboard/ecpfcomponents/admin/ECPFDecisions.vue';
import ECPFQualifications from '@/components/dashboard/ecpfcomponents/admin/ECPFQualifications.vue';
import ECPFInfrastructures from '@/components/dashboard/ecpfcomponents/admin/ECPFInfrastructures.vue';
import ECPFInstitutes from '@/components/dashboard/ecpfcomponents/admin/ECPFInstitutes.vue';
import ECPFIssueCompliances from '@/components/dashboard/ecpfcomponents/admin/ECPFIssueCompliances.vue';
import ECPFPositions from '@/components/dashboard/ecpfcomponents/admin/ECPFPositions.vue';
import ECPFPromotionalEventTypes from '@/components/dashboard/ecpfcomponents/admin/ECPFPromotionalEventTypes.vue';
import ECPFServiceCategories from '@/components/dashboard/ecpfcomponents/admin/ECPFServiceCategories.vue';
import ECPFStatus from '@/components/dashboard/ecpfcomponents/admin/ECPFStatus.vue';
import ECPFTypesOfFirms from '@/components/dashboard/ecpfcomponents/admin/ECPFTypesOfFirms.vue';
import NotFound from '@/views/NotFound.vue'; // Or wherever your NotFound component is

// Chief Components
import ECPFChiefDashboard from '@/components/dashboard/ecpfcomponents/chief/ECPFChiefDashboard.vue';
import ECPFFinalApproval from '@/components/dashboard/ecpfcomponents/chief/ECPFFinalApproval.vue';
import ChiefBranchEcpfApplications from '@/components/dashboard/ecpfcomponents/chief/BranchEcpfApplications.vue';
// import ECPFUserManagement from '@/components/dashboard/ecpfcomponents/admin/ECPFUserManagement.vue';
import ChiefIndividualEcpfApplications from '@/components/dashboard/ecpfcomponents/chief/IndividualEcpfApplications.vue';
import ChiefCollaboratedEcpfApplications from '@/components/dashboard/ecpfcomponents/chief/CollaboratedEcpfApplications.vue';
import ChiefRenewalApplications from '@/components/dashboard/ecpfcomponents/chief/RenewalApplications.vue';
import ChiefOwnershipChangeApplications from '@/components/dashboard/ecpfcomponents/chief/OwnershipChangeApplications.vue';
import ChiefNameChangeApplications from '@/components/dashboard/ecpfcomponents/chief/NameChangeApplications.vue';
import ChiefLocationChangeApplications from '@/components/dashboard/ecpfcomponents/chief/LocationChangeApplications.vue';
import ChiefEducationFair from '@/components/dashboard/ecpfcomponents/chief/EducationFair.vue';
import ChiefMassMediaEvent from '@/components/dashboard/ecpfcomponents/chief/MassMediaEvent.vue';
import ChiefHeiVisit from '@/components/dashboard/ecpfcomponents/chief/HeiVisit.vue';
import ChiefInhouseEvent from '@/components/dashboard/ecpfcomponents/chief/InhouseEvent.vue';
import ChiefECPFLinkEstablishment from '@/components/dashboard/ecpfcomponents/chief/ECPFLinkEstablishment.vue';
import ChiefAddHr from '@/components/dashboard/ecpfcomponents/chief/AddHr.vue';
import ChiefAddStudent from '@/components/dashboard/ecpfcomponents/chief/AddStudent.vue';
import ChiefECPFReports from '@/components/dashboard/ecpfcomponents/chief/ECPFReports.vue';
import ChiefECPFPaymentHistory from '@/components/dashboard/ecpfcomponents/chief/ECPFPaymentHistory.vue';
import NonCompliance from '@/components/dashboard/ecpfcomponents/chief/NonCompliance.vue';

const { role } = useAuthStore();

const route = useRoute();
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
    case path.endsWith('/ecpf/ecpf_inhouse_event'):
      return ECPFInhouseEvent;
    case path.endsWith('/ecpf/ecpf_massmedia'):
      return ECPFMassmedia;
    case path.endsWith('/ecpf/ecpf_hei_visit'):
      return ECPFHeiVisit;
    case path.endsWith('/ecpf/hr_biodata'):
      return HrBiodata;
    case path.endsWith('/ecpf/student_biodata'):
      return StudentBiodata;
    case path.endsWith('/ecpf/profile'):
      return ECPFUserProfile;
    case path.endsWith('/ecpf/track_applications'):
      return ECPFTrackApplications;
    case path.endsWith('/ecpf/upload_trade_license'):
      return UploadTradeLicense;  
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
    case path.endsWith('/ecpf/individual_ecpf_applications'):
      return IndividualEcpfApplications;
    case path.endsWith('/ecpf/collaborated_ecpf_applications'):
      return CollaboratedEcpfApplications;
    case path.endsWith('/ecpf/branch_ecpf_applications'):
      return BranchEcpfApplications;
    case path.endsWith('/ecpf/renewal_applications'):
      return RenewalApplications;
    case path.endsWith('/ecpf/ownership_change_applications'):
      return OwnershipChangeApplications;
    case path.endsWith('/ecpf/name_change_applications'):
      return NameChangeApplications;
    case path.endsWith('/ecpf/location_change_applications'):
      return LocationChangeApplications;
    case path.endsWith('/ecpf/education_fair_applications'):
      return EducationFair;
    case path.endsWith('/ecpf/mass_media_applications'):
      return MassMediaEvent;
    case path.endsWith('/ecpf/hei_visit_applications'):
      return HeiVisit;
    case path.endsWith('/ecpf/in_house_event_applications'):
      return InhouseEvent;
    case path.endsWith('/ecpf/ecpf_link_establishment'):
      return ECPFLinkEstablishment;
    case path.endsWith('/ecpf/add_hr'):
      return AddHr;
    case path.endsWith('/ecpf/add_student'):
      return AddStudent;
    case path.endsWith('/ecpf/ecpf_reports'):
      return ECPFReports;
    case path.endsWith('/ecpf/ecpf_payment_history'):
      return ECPFPaymentHistory;
    case path.endsWith('/ecpf/non_compliance_records'):
      return ECPFNonComplaince;

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
    case path.endsWith('/ecpf/branch_ecpf_applications'):
      return ChiefBranchEcpfApplications;
    case path.endsWith('/ecpf/individual_ecpf_applications'):
      return ChiefIndividualEcpfApplications;
    case path.endsWith('/ecpf/collaborated_ecpf_applications'):
      return ChiefCollaboratedEcpfApplications;
    case path.endsWith('/ecpf/renewal_applications'):
      return ChiefRenewalApplications;
    case path.endsWith('/ecpf/ownership_change_applications'):
      return ChiefOwnershipChangeApplications;
    case path.endsWith('/ecpf/name_change_applications'):
      return ChiefNameChangeApplications;
    case path.endsWith('/ecpf/location_change_applications'):
      return ChiefLocationChangeApplications;
    case path.endsWith('/ecpf/education_fair_applications'):
      return ChiefEducationFair;
    case path.endsWith('/ecpf/mass_media_applications'):
      return ChiefMassMediaEvent;
    case path.endsWith('/ecpf/hei_visit_applications'):
      return ChiefHeiVisit;
    case path.endsWith('/ecpf/in_house_event_applications'):
      return ChiefInhouseEvent;
    case path.endsWith('/ecpf/ecpf_link_establishment'):
      return ChiefECPFLinkEstablishment;
    case path.endsWith('/ecpf/add_hr'):
      return ChiefAddHr;
    case path.endsWith('/ecpf/add_student'):
      return ChiefAddStudent;
    case path.endsWith('/ecpf/ecpf_reports'):
      return ChiefECPFReports;
    case path.endsWith('/ecpf/ecpf_payment_history'):
      return ChiefECPFPaymentHistory;
    case path.endsWith('/ecpf/non_compliance_records'):
      return NonCompliance;
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
    case path.endsWith('/ecpf/compliance_action'):
      return ECPFComplianceAction;
    case path.endsWith('/ecpf/compliance_action_taken'):
      return ECPFComplianceActionTaken;
    case path.endsWith('/ecpf/ecpf_decisions'):
      return ECPFPDecisions;
    case path.endsWith('/ecpf/qualifications'):
      return ECPFQualifications;
    case path.endsWith('/ecpf/infrastructures'):
      return ECPFInfrastructures;
    case path.endsWith('/ecpf/institutes'):
      return ECPFInstitutes;
    case path.endsWith('/ecpf/issue_compliances'):
      return ECPFIssueCompliances;
    case path.endsWith('/ecpf/positions'):
      return ECPFPositions;
    case path.endsWith('/ecpf/promotional_event_types'):
      return ECPFPromotionalEventTypes;
    case path.endsWith('/ecpf/service_categories'):
      return ECPFServiceCategories;
    case path.endsWith('/ecpf/status'):
      return ECPFStatus;
    case path.endsWith('/ecpf/types_of_firms'):
      return ECPFTypesOfFirms;
    default:
      return NotFound;
  }
});
</script>
