<!-- eslint-disable vue/multi-word-component-names -->
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
      <StatsGrid :stats="filteredStats" />
      <ApplicationTable
        :applications="paginatedApplications"
        :current-page="currentPage"
        :total-results="filteredTotal"
        :per-page="perPage"
        @page-change="handlePageChange"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import ApplicationTable from '@/components/common/ROQ/ROQUserApplicationsList.vue'

// Admin Components Import
import AdminDashboard from '@/components/dashboard/roqcomponents/admin/AdminDashboard.vue'
import AdminDecision from '@/components/dashboard/roqcomponents/admin/AdminDecision.vue'
import AdminLearningType from '@/components/dashboard/roqcomponents/admin/AdminLearningType.vue'
import AdminQualification from '@/components/dashboard/roqcomponents/admin/AdminQualification.vue'
import AdminTypeOfCourse from '@/components/dashboard/roqcomponents/admin/AdminTypeOfCourse.vue'
import AdminSecondCopyReason from '@/components/dashboard/roqcomponents/admin/AdminSecondCopyReason.vue'
import AdminProfile from '@/components/dashboard/roqcomponents/admin/AdminProfile.vue' // Added Import
import AdminGender from '@/components/dashboard/roqcomponents/admin/AdminGender.vue'
import AdminCountry from '@/components/dashboard/roqcomponents/admin/AdminCountry.vue'
import AdminEsign from '@/components/dashboard/roqcomponents/admin/AdminEsign.vue'

// Dealing Officer Components Import
import DealingOfficerDashboard from '@/components/dashboard/roqcomponents/dealingOfficer/DealingOfficerDashboard.vue'
import ApplicationsTable from '@/components/dashboard/roqcomponents/dealingOfficer/ApplicationsTable.vue'
import SecondCopyApplicationsTable from '@/components/dashboard/roqcomponents/dealingOfficer/SecondCopyApplicationsTable.vue'
import ReportTable from '@/components/dashboard/roqcomponents/dealingOfficer/ReportTable.vue'
// Chief Components Import
import ChiefDashboard from '@/components/dashboard/roqcomponents/chief/ChiefDashboard.vue'
import ChiefApplicationsTable from '@/components/dashboard/roqcomponents/chief/ChiefApplicationsTable.vue'
import SecondCopyLists from '@/components/dashboard/roqcomponents/chief/SecondCopyLists.vue'
import ChiefReportTable from '@/components/dashboard/roqcomponents/chief/ChiefReportTable.vue'
// User Components Import
import UserDashboard from '@/components/dashboard/roqcomponents/user/UserDashboard.vue'
import UserApplications from '@/components/dashboard/roqcomponents/user/UserRoqApplicationList.vue'
import SecondCopyApplication from '@/components/dashboard/roqcomponents/user/UserSecondCopyApplicationList.vue' // Added Import
import ProfileView from '@/components/dashboard/roqcomponents/user/UserProfileView.vue' // Added Import

const { role, user } = useAuthStore()
const route = useRoute()
const applications = ref([])
const currentPage = ref(1)
const perPage = ref(10)

// Admin Route-Based Components
const adminComponent = computed(() => {
  const path = route.path
  switch (true) {
    case path.endsWith('/roq/dashboard'):
      return AdminDashboard
    case path.endsWith('/roq/decisions'):
      return AdminDecision
    case path.endsWith('/roq/learning_types'):
      return AdminLearningType
    case path.endsWith('/roq/qualifications'):
      return AdminQualification
    case path.endsWith('/roq/type_of_courses'):
      return AdminTypeOfCourse
    case path.endsWith('/roq/reason_for_issue_of_second_copy'):
      return AdminSecondCopyReason
    case path.endsWith('/roq/genders'):
      return AdminGender
    case path.endsWith('/roq/countries'):
      return AdminCountry
    case path.endsWith('/roq/user_profile'):
      return AdminProfile
    case path.endsWith('/roq/esign'):
      return AdminEsign

    default:
      return null
  }
})

// Dealing Officer Route-Based Components
const dealingOfficerComponent = computed(() => {
  const path = route.path
  switch (true) {
    case path.endsWith('/roq/dashboard'):
      return DealingOfficerDashboard
    case path.endsWith('/roq/application_lists'):
      return ApplicationsTable
    case path.endsWith('/roq/second_copy_lists'):
      return SecondCopyApplicationsTable
    case path.endsWith('/roq/reports'):
      return ReportTable

    default:
      return null
  }
})

// Chief Route-Based Components
const chiefComponent = computed(() => {
  const path = route.path
  switch (true) {
    case path.endsWith('/roq/dashboard'):
      return ChiefDashboard
    case path.endsWith('/roq/application_lists'):
      return ChiefApplicationsTable
    case path.endsWith('/roq/second_copy_lists'):
      return SecondCopyLists
    case path.endsWith('/roq/reports'):
      return ChiefReportTable
    default:
      return null
  }
})

// Director Route-Based Components
const directorComponent = computed(() => {
  // const path = route.path;
  // Add route-based components for director here
  // Example:
  // if (path.endsWith('/roq/dashboard')) {
  //   return DirectorDashboard;
  // }
  return null
})

// Super Admin Route-Based Components
const superAdminComponent = computed(() => {
  // const path = route.path;
  // Add route-based components for super admin here
  // Example:
  // if (path.endsWith('/roq/dashboard')) {
  //   return SuperAdminDashboard;
  // }
  return null
})

// User Route-Based Components
const userComponent = computed(() => {
  const path = route.path
  switch (true) {
    case path.endsWith('/roq/dashboard'):
      return UserDashboard
    case path.endsWith('/roq/my_applications'):
      return UserApplications
    case path.endsWith('/roq/secondcopy_applications'):
      return SecondCopyApplication
    case path.endsWith('/roq/profile'):
      return ProfileView // Corrected case statement, using the correct variable name
    default:
      return null
  }
})

// Filter applications based on role
const filteredApplications = computed(() => {
  switch (role) {
    case 'user':
      return applications.value.filter((app) => app.email_address === user.email)

    case 'dealing_officer':
      return applications.value.filter(
        (app) => !app.dealing_officer_decision || (!app.chief_approved && !app.chief_regret),
      )

    case 'chief':
      return applications.value.filter(
        (app) => app.forward && !app.chief_approved && !app.chief_regret,
      )

    case 'director':
      return applications.value

    default:
      return []
  }
})

// Calculate stats based on filtered applications
const filteredStats = computed(() => {
  const filtered = filteredApplications.value
  return {
    totalApplied: filtered.length,
    totalApproved: filtered.filter((app) => app.chief_approved).length,
    totalRegretted: filtered.filter((app) => app.dealing_officer_regret || app.chief_regret).length,
    totalPending: filtered.filter(
      (app) => !app.chief_approved && !app.dealing_officer_regret && !app.chief_regret,
    ).length,
  }
})

// Compute total for pagination
const filteredTotal = computed(() => filteredApplications.value.length)

// Get paginated data
const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value

  // Transform the data to match the table structure
  return filteredApplications.value.slice(start, end).map((app) => ({
    id: app.id,
    date: app.date_of_birth,
    type: app.type_of_course,
    status: getApplicationStatus(app),
  }))
})

// Helper function to determine application status
const getApplicationStatus = (application) => {
  if (application.chief_approved) return 'Approved'
  if (application.chief_regret) return 'Regretted'
  if (application.dealing_officer_regret) return 'Regretted'
  return 'Pending'
}

const handlePageChange = (newPage) => {
  currentPage.value = newPage
}
</script>
