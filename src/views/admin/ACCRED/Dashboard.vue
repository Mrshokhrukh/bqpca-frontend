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
    <!-- User Section -->
    <template v-else-if="role === 'assessor'">
      <component :is="assessorComponent" />
    </template>
    <!-- Default Section -->
    <template v-else>
      <div>Select the service and role.</div>
    </template>
  </div>
</template>

<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// Admin Components Import
import AdminDashboard from '@/components/dashboard/accredcomponent/admin/AccreditationDashboard.vue'
import ApplicationLists from '@/components/dashboard/accredcomponent/admin/ApplicationLists.vue'
import AppealLists from '@/components/dashboard/accredcomponent/admin/AppealLists.vue'
import AdminReports from '@/components/dashboard/accredcomponent/admin/AdminReports.vue'

// Import Admin Masters Components
import AppealReasonMaster from '@/components/dashboard/accredcomponent/admin/masters/AppealReasonMaster.vue'
import ApplicationDurationMaster from '@/components/dashboard/accredcomponent/admin/masters/ApplicationDurationMaster.vue'
import AssessorPoolMaster from '@/components/dashboard/accredcomponent/admin/masters/AssessorPoolMaster.vue'
import DecisionMaster from '@/components/dashboard/accredcomponent/admin/masters/DecisionMaster.vue'
import DecisionClass from '@/components/dashboard/accredcomponent/admin/masters/DecisionClass.vue'
import ESignatureMaster from '@/components/dashboard/accredcomponent/admin/masters/ESignatureMaster.vue'
import EmployeeCategoryMaster from '@/components/dashboard/accredcomponent/admin/masters/EmployeeCategoryMaster.vue'
import EmployeeTypeMaster from '@/components/dashboard/accredcomponent/admin/masters/EmployeeTypeMaster.vue'
import FeesMaster from '@/components/dashboard/accredcomponent/admin/masters/FeesMaster.vue'
import IndicatorsMaster from '@/components/dashboard/accredcomponent/admin/masters/IndicatorsMaster.vue'
import InstituteTypeMaster from '@/components/dashboard/accredcomponent/admin/masters/InstituteTypeMaster.vue'
import KeyAspectsMaster from '@/components/dashboard/accredcomponent/admin/masters/KeyAspectsMaster.vue'
import QualificationMaster from '@/components/dashboard/accredcomponent/admin/masters/QualificationMaster.vue'
import RatingCategoryMaster from '@/components/dashboard/accredcomponent/admin/masters/RatingCategoryMaster.vue'
import SourceOfFundingMaster from '@/components/dashboard/accredcomponent/admin/masters/SourceOfFundingMaster.vue'
import StaffTypeMaster from '@/components/dashboard/accredcomponent/admin/masters/StaffTypeMaster.vue'
import StandardMaster from '@/components/dashboard/accredcomponent/admin/masters/StandardMaster.vue'
import DocumentType from '@/components/dashboard/accredcomponent/admin/DocumentType.vue'

//user components import
import AccreUserDashboard from '@/components/dashboard/accredcomponent/users/AccreUserDashboard.vue'
import AccreApplyForAccreditation from '@/components/dashboard/accredcomponent/users/AccreApplyForAccreditation.vue'
import AccreViewResults from '@/components/dashboard/accredcomponent/users/AccreViewResults.vue'
import AppealTable from '@/components/dashboard/accredcomponent/users/AppealTable.vue'
import AccreUserProfile from '@/components/dashboard/accredcomponent/users/AccreUserProfile.vue'
import CoIConfirmation from '@/components/dashboard/accredcomponent/users/CoIConfirmation.vue'
import SiteVisitConfirmation from '@/components/dashboard/accredcomponent/users/SiteVisitConfirmation.vue'
import CreateInstituteProfile from '@/components/dashboard/accredcomponent/users/CreateInstituteProfile.vue'
import SubmitIsarReport from '@/components/dashboard/accredcomponent/users/SubmitIsarReport.vue';
import TrackIsarReports from '@/components/dashboard/accredcomponent/users/TrackIsarReports.vue';
import TrackAccreditation from '@/components/dashboard/accredcomponent/users/TrackAccreditation.vue';
import QualityAssuranceReport from '@/components/dashboard/accredcomponent/users/QualityAssuranceReport.vue'

// Import Dealing Officer Components
import AccreDealingdashboard from '@/components/dashboard/accredcomponent/dealingOfficer/AccreDealingdashboard.vue'
import InstitutionalAccreditations from '@/components/dashboard/accredcomponent/dealingOfficer/InstitutionalAccreditations.vue'
import Appeals from '@/components/dashboard/accredcomponent/dealingOfficer/Appeals.vue'
import AssessorManagement from '@/components/dashboard/accredcomponent/dealingOfficer/AssessorManagement.vue'
import SiteVisitScheduling from '@/components/dashboard/accredcomponent/dealingOfficer/SiteVisitScheduling.vue'
import Reports from '@/components/dashboard/accredcomponent/dealingOfficer/Reports.vue'
import PaymentHistory from '@/components/dashboard/accredcomponent/dealingOfficer/PaymentHistory.vue'
import AssignAssessor from '@/components/dashboard/accredcomponent/dealingOfficer/AssignAssessor.vue'
import AccreditationAssessment from '@/components/dashboard/accredcomponent/dealingOfficer/AccreditationAssessment.vue'
import InitialAccreditaionApplication from '@/components/dashboard/accredcomponent/dealingOfficer/InitialAccreditationApplication.vue'
import ManageAccreditationSchedule from '@/components/dashboard/accredcomponent/dealingOfficer/ManageAccreditationSchedule.vue'
import IsarReport from '@/components/dashboard/accredcomponent/dealingOfficer/IsarReport.vue'
//Assessor Components
import AssessorDashboard from '@/components/dashboard/accredcomponent/assessor/AssessorDashboard.vue'
import CoiDeclaration from '@/components/dashboard/accredcomponent/assessor/CoiDeclaration.vue'
import AssessorUploadReport from '@/components/dashboard/accredcomponent/assessor/AssessorUploadReport.vue'

const route = useRoute()
const { role } = useAuthStore()

// Add route change debugging
watchEffect(() => {
  console.log('Route changed:', {
    fullPath: route.fullPath,
    path: route.path,
    params: route.params,
    matched: route.matched,
  })
})

// Admin Route-Based Components
const adminComponent = computed(() => {
  // Extract full path
  const path = route.path
  console.log('Computing admin component for path:', path)

  // Get path segments and remove empty ones
  const segments = path.split('/').filter(Boolean)
  console.log('Path segments:', segments)

  // Handle accreditation service type
  if (segments.includes('accreditation')) {
    // Check if this is a masters route
    if (segments.includes('masters')) {
      const masterType = segments[segments.length - 1]
      console.log('Master component requested:', masterType)

      // Map master routes to components
      const mastersMap = {
        appeal_reason: AppealReasonMaster,
        application_duration: ApplicationDurationMaster,
        assessor_pool: AssessorPoolMaster,
        decision: DecisionMaster,
        decision_classes: DecisionClass,
        e_signature: ESignatureMaster,
        employee_category: EmployeeCategoryMaster,
        employee_type: EmployeeTypeMaster,
        fees: FeesMaster,
        indicators: IndicatorsMaster,
        'institute-types': InstituteTypeMaster,
        key_aspects: KeyAspectsMaster,
        qualification: QualificationMaster,
        document: DocumentType,
        rating_category: RatingCategoryMaster,
        source_of_funding: SourceOfFundingMaster,
        staff_type: StaffTypeMaster,
        standard: StandardMaster,
      }

      if (mastersMap[masterType]) {
        console.log('Returning master component:', masterType)
        return mastersMap[masterType]
      } else {
        console.warn('Master component not found:', masterType)
        return AdminDashboard
      }
    }

    // Handle main routes
    const mainComponentName = segments[segments.length - 1]
    const mainComponentsMap = {
      dashboard: AdminDashboard,
      application_lists: ApplicationLists,
      appeal_lists: AppealLists,
      reports: AdminReports,
    }

    console.log('Main component requested:', mainComponentName)
    return mainComponentsMap[mainComponentName] || AdminDashboard
  }

  // Return null for non-accreditation services
  return null
})

// Dealing Officer Route-Based Components
const dealingOfficerComponent = computed(() => {
  const path = route.path
  switch (true) {
    case path.endsWith('/accreditation/dashboard'):
      return AccreDealingdashboard

    case path.endsWith('/accreditation/institutional_accreditations'):
      return InstitutionalAccreditations
    case path.endsWith('/accreditation/appeals'):
      return Appeals
    case path.endsWith('/accreditation/assessor_management'):
      return AssessorManagement
    case path.endsWith('/accreditation/site_visit_scheduling'):
      return SiteVisitScheduling

    case path.endsWith('/accreditation/reports'):
      return Reports
    case path.endsWith('/accreditation/payment_history'):
      return PaymentHistory
    case path.endsWith('/accreditation/assign_assessor'):
      return AssignAssessor
    case path.endsWith('/accreditation/accreditation_assessment'):
      return AccreditationAssessment
    case path.endsWith('/accreditation/initial_accreditations'):
      return InitialAccreditaionApplication
    case path.endsWith('/accreditation/manage_accreditation_schedule'):
      return ManageAccreditationSchedule
    case path.endsWith('/accreditation/isar_reports'):
      return IsarReport

    default:
      return null
  }
})

// Chief Route-Based Components
const chiefComponent = computed(() => {
  const path = route.path
  switch (true) {
    case path.endsWith('/accreditation/dashboard'):
      return null
    case path.endsWith('/accreditation/institutional_accreditations'):
      return null
    default:
      return null
  }
})

// Director Route-Based Components
const directorComponent = computed(() => {
  return null
})

// Super Admin Route-Based Components
const superAdminComponent = computed(() => {
  return null
})

// User Route-Based Components
const userComponent = computed(() => {
  const path = route.path
  switch (true) {
    case path.endsWith('/accreditation/dashboard'):
      return AccreUserDashboard
    case path.endsWith('/accreditation/apply_for_accreditation'):
      return AccreApplyForAccreditation
    case path.endsWith('/accreditation/appeal'):
      return AppealTable
    case path.endsWith('/accreditation/results'):
      return AccreViewResults
    case path.endsWith('/accreditation/profile'):
      return AccreUserProfile
    case path.endsWith('/accreditation/coi_confirmation'):
      return CoIConfirmation
    case path.endsWith('/accreditation/site_visit_confirmation'):
      return SiteVisitConfirmation
    case path.endsWith('/accreditation/institute_profile'):
      return CreateInstituteProfile
    case path.endsWith('/accreditation/submit_isar_report'):
      return SubmitIsarReport
    case path.endsWith('/accreditation/track_isar_reports'):
      return TrackIsarReports
    case path.endsWith('/accreditation/track_accreditation'):
      return TrackAccreditation
    case path.endsWith('/accreditation/iqar'):
      return QualityAssuranceReport
    default:
      return null
  }
})

const assessorComponent = computed(() => {
  const path = route.path
  switch (true) {
    case path.endsWith('/accreditation/dashboard'):
      return AssessorDashboard
    case path.endsWith('/accreditation/my_assignments'):
      return CoiDeclaration
    case path.endsWith('/accreditation/upload_report'):
      return AssessorUploadReport
    default:
      return null
  }
})

</script>
