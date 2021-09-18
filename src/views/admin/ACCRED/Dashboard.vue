<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="p-4">
    <!-- Admin Section -->
    <template v-if="role === 'admin'">
      <suspense>
        <component :is="adminComponent" />
        <template #fallback>
          <div>Loading Component...</div>
        </template>
      </suspense>
    </template>

    <!-- Dealing Officer Section (UNCHANGED) -->
    <template v-else-if="role === 'dealing_officer'">
      <component :is="dealingOfficerComponent" />
    </template>

    <!-- Chief Section (UNCHANGED) -->
    <template v-else-if="role === 'chief'">
      <component :is="chiefComponent" />
    </template>

    <!-- Director Section (UNCHANGED) -->
    <template v-else-if="role === 'director'">
      <component :is="directorComponent" />
    </template>

    <!-- Super Admin Section (UNCHANGED) -->
    <template v-else-if="role === 'super_admin'">
      <component :is="superAdminComponent" />
    </template>

    <!-- User Section (UNCHANGED) -->
    <template v-else-if="role === 'user'">
      <component :is="userComponent" />
    </template>
    <!-- Assessor Section (UNCHANGED) -->
    <template v-else-if="role === 'assessor'">
      <component :is="assessorComponent" />
    </template>
    <!-- Default Section -->
    <template v-else>
      <div>Select a service and role to continue.</div>
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

// CORRECTED: Import all Admin Masters Components with correct paths and names
import AppealReasonMaster from '@/components/dashboard/accredcomponent/admin/masters/AppealReasonMaster.vue'
import ApplicationDurationMaster from '@/components/dashboard/accredcomponent/admin/masters/ApplicationDurationMaster.vue'
import AssessorPoolMaster from '@/components/dashboard/accredcomponent/admin/masters/AssessorPoolMaster.vue'
import DecisionMaster from '@/components/dashboard/accredcomponent/admin/masters/DecisionMaster.vue'
import DecisionClass from '@/components/dashboard/accredcomponent/admin/masters/DecisionClass.vue'
import DocumentTypeMasters from '@/components/dashboard/accredcomponent/admin/masters/DocumentTypeMasters.vue'
import EmployeeCategoryMaster from '@/components/dashboard/accredcomponent/admin/masters/EmployeeCategoryMaster.vue'
import EmployeeTypeMaster from '@/components/dashboard/accredcomponent/admin/masters/EmployeeTypeMaster.vue'
import ESignatureMaster from '@/components/dashboard/accredcomponent/admin/masters/ESignatureMaster.vue'
import FeesMaster from '@/components/dashboard/accredcomponent/admin/masters/FeesMaster.vue'
import IndicatorsMaster from '@/components/dashboard/accredcomponent/admin/masters/IndicatorsMaster.vue'
import InstituteTypeMaster from '@/components/dashboard/accredcomponent/admin/masters/InstituteTypeMaster.vue'
import KeyAspectsMaster from '@/components/dashboard/accredcomponent/admin/masters/KeyAspectsMaster.vue'
import QualificationMaster from '@/components/dashboard/accredcomponent/admin/masters/QualificationMaster.vue'
import RatingCategoryMaster from '@/components/dashboard/accredcomponent/admin/masters/RatingCategoryMaster.vue'
import SourceOfFundingMaster from '@/components/dashboard/accredcomponent/admin/masters/SourceOfFundingMaster.vue'
import StaffTypeMaster from '@/components/dashboard/accredcomponent/admin/masters/StaffTypeMaster.vue'
import StandardMaster from '@/components/dashboard/accredcomponent/admin/masters/StandardMaster.vue'

// User components import (UNCHANGED)
import AccreUserDashboard from '@/components/dashboard/accredcomponent/users/AccreUserDashboard.vue'
import AccreApplyForAccreditation from '@/components/dashboard/accredcomponent/users/AccreApplyForAccreditation.vue'
import AccreViewResults from '@/components/dashboard/accredcomponent/users/AccreViewResults.vue'
import AppealTable from '@/components/dashboard/accredcomponent/users/AppealTable.vue'
import AccreUserProfile from '@/components/dashboard/accredcomponent/users/AccreUserProfile.vue'
import CoIConfirmation from '@/components/dashboard/accredcomponent/users/CoIConfirmation.vue'
import SiteVisitConfirmation from '@/components/dashboard/accredcomponent/users/SiteVisitConfirmation.vue'
import CreateInstituteProfile from '@/components/dashboard/accredcomponent/users/CreateInstituteProfile.vue'
import SubmitIsarReport from '@/components/dashboard/accredcomponent/users/SubmitIsarReport.vue'
import TrackIsarReports from '@/components/dashboard/accredcomponent/users/TrackIsarReports.vue'
import TrackAccreditation from '@/components/dashboard/accredcomponent/users/TrackAccreditation.vue'
import QualityAssuranceReport from '@/components/dashboard/accredcomponent/users/QualityAssuranceReport.vue'

// Import Dealing Officer Components (UNCHANGED)
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
import IqarReport from '@/components/dashboard/accredcomponent/dealingOfficer/IqarReport.vue';

//Assessor Components (UNCHANGED)
import AssessorDashboard from '@/components/dashboard/accredcomponent/assessor/AssessorDashboard.vue'
import CoiDeclaration from '@/components/dashboard/accredcomponent/assessor/CoiDeclaration.vue'
import AssessorUploadReport from '@/components/dashboard/accredcomponent/assessor/AssessorUploadReport.vue'

const route = useRoute()
const { role } = useAuthStore()

// Add route change debugging
watchEffect(() => {
  console.log('Route changed:', {
    fullPath: route.fullPath,
    params: route.params,
  })
})
const adminComponent = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  if (segments[0] !== 'admin' || segments[1] !== 'admin' || segments[2] !== 'accreditation') {
    return null
  }
  const componentKey = segments[segments.length - 1]
  const adminComponentMap = {
    // Main routes
    dashboard: AdminDashboard,
    application_lists: ApplicationLists,
    appeal_lists: AppealLists,
    reports: AdminReports,
    appeal_reason: AppealReasonMaster,
    application_duration: ApplicationDurationMaster,
    assessor_pool: AssessorPoolMaster,
    decision: DecisionMaster,
    decision_classes: DecisionClass,
    document_type: DocumentTypeMasters,
    employee_category: EmployeeCategoryMaster,
    employee_type: EmployeeTypeMaster,
    e_signature: ESignatureMaster,
    fees: FeesMaster,
    indicators: IndicatorsMaster,
    institute: InstituteTypeMaster,
    key_aspects: KeyAspectsMaster,
    qualification: QualificationMaster,
    rating_category: RatingCategoryMaster,
    source_of_funding: SourceOfFundingMaster,
    staff_type: StaffTypeMaster,
    standard: StandardMaster,
  }

  console.log(`[Admin Role] Trying to render component for key: "${componentKey}"`)

  // Look up the component in the map. If it's not found, default to the AdminDashboard.
  const componentToShow = adminComponentMap[componentKey]
  if (componentToShow) {
    console.log(`[Admin Role] Found component: ${componentToShow.__name || 'Component'}`)
    return componentToShow
  } else {
    console.warn(`[Admin Role] No component found for key "${componentKey}". Defaulting to dashboard.`)
    return AdminDashboard
  }
})

// Dealing Officer Route-Based Components (UNCHANGED)
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
    case path.endsWith('/accreditation/iqar_list'):
      return IqarReport
    default:
      return null
  }
})

// Chief Route-Based Components (UNCHANGED)
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

// Director Route-Based Components (UNCHANGED)
const directorComponent = computed(() => {
  return null
})

// Super Admin Route-Based Components (UNCHANGED)
const superAdminComponent = computed(() => {
  return null
})

// User Route-Based Components (UNCHANGED)
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

// Assessor Route-Based Components (UNCHANGED)
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