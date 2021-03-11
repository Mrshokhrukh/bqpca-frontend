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
// import StatsGrid from '@/components/dashboard/roqcomponents/StatsGrid.vue';
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

// Chief Components
import ECPFChiefDashboard from '@/components/dashboard/ecpfcomponents/chief/ECPFChiefDashboard.vue';
import ECPFFinalApproval from '@/components/dashboard/ecpfcomponents/chief/ECPFFinalApproval.vue';
import ECPFAdminDashboard from '@/components/dashboard/ecpfcomponents/admin/ECPFAdminDashboard.vue';
import BranchEcpfApplications from '@/components/dashboard/ecpfcomponents/dealingOfficer/BranchEcpfApplications.vue';
import ECPFUserManagement from '@/components/dashboard/ecpfcomponents/admin/ECPFUserManagement.vue';

const { role, user } = useAuthStore();

const route = useRoute();
const applications = ref([]);
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
    case path.endsWith('/ecpf//ecpf_link_establishment'):
      return ECPFLinkEstablishment;  

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
    case path.endsWith('/ecpf/user_management'):
      return ECPFUserManagement;
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
