<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="mx-auto w-full space-y-6">
      <LoadingSpinner v-if="isLoading" />

      <template v-else>
        <FirstDashboardState v-if="dashboardState.isFirstState" :message="dashboardState.message" />
        <EmptyDashboardState
          v-else-if="dashboardState.isPending"
          :qualification-info="dashboardState.qualificationInfo"
          :key="
            dashboardState.qualificationInfo?.qualification?.id +
            (dashboardState.qualificationInfo?.qualification?.updated_at || '')
          "
        />
        <template v-else-if="dashboardState.isApproved">
          <ProfileHeader
            :user-detail="userDetail"
            :qualification="dashboardState.primaryQualifications[0]"
            @view-certificate="handleViewCertificate"
          />
          <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
            <StatCard
              title="CPD Credits"
              icon="Award"
              :progress="cpdCredits"
              :total="50"
              type="progress"
            />
            <CogsStatusCard :expiry-date="licenseExpiryDate" :status="licenseStatus" />
            <ActivityFeed title="Recent Activities" :activities="recentActivities" />
          </div>
          <ApplicationHistoryCard
            :applications="applications"
            @show-rejected="showRejectedApplications"
          />
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <DeadlinesList title="Upcoming Deadlines" :deadlines="upcomingDeadlines" />
          </div>
          <ApplicationsModal
            v-if="selectedApplications.length"
            :applications="selectedApplications"
            :title="modalTitle"
            @close="closeApplicationsModal"
            @visit="visitApplication"
          />
          <CertificateModal
            v-if="showCertificateModal"
            :application="selectedApplication"
            @close="closeCertificateModal"
          />
        </template>
        <div v-else class="p-10 text-center">
          <p class="text-gray-600">
            Could not determine dashboard state. Please check your application status or contact
            support.
          </p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useDashboardStore } from '@/stores/mhpcUserDahboardStore'
import { storeToRefs } from 'pinia'

import ProfileHeader from './dashBoardComponents/ProfileHeaders.vue'
import StatCard from './dashBoardComponents/StatCards.vue'
import CogsStatusCard from './dashBoardComponents/CogsStatusCards.vue'
import ApplicationHistoryCard from './dashBoardComponents/ApplicationHistoryCards.vue'
import ActivityFeed from './dashBoardComponents/ActivityFeeds.vue'
import DeadlinesList from './dashBoardComponents/DeadlinesLists.vue'
import ApplicationsModal from './dashBoardComponents/ApplicationModal.vue'
import CertificateModal from '../../../common/MHPC/MHPCCertificateModal.vue'
import LoadingSpinner from '../../../common/MHPC/MHPCLoadingSpinner.vue'
import EmptyDashboardState from './dashBoardComponents/EmptyDashboardStates.vue'
import FirstDashboardState from './dashBoardComponents/FirstDashboardStates.vue'

const authStore = useAuthStore()
const dashboardStore = useDashboardStore()
const { user } = storeToRefs(authStore)
const {
  userDetail,
  applications,
  cpdCredits,
  licenseExpiryDate,
  licenseStatus,
  recentActivities,
  upcomingDeadlines,
  selectedApplications,
  modalTitle,
  isLoading,
  selectedApplication,
  showCertificateModal,
} = storeToRefs(dashboardStore)

// Reactive variable to track DPR enablement
const isDprEnabled = ref(false)

const dashboardState = computed(() => {
  if (isLoading.value) return { isLoading: true }

  const hasNoApplications = !applications.value?.length
  const hasApplicationsButNoQualifications =
    !hasNoApplications && applications.value.every((app) => !app.user_qualifications?.length)

  if (hasNoApplications || hasApplicationsButNoQualifications) {
    return {
      isFirstState: true,
      message: hasNoApplications
        ? "You don't have any applications yet. Please apply to get started."
        : 'Your application is registered. Please add your qualifications to proceed with the review process.',
    }
  }

  const primaryQualifications = applications.value
    .flatMap((app) => app.user_qualifications || [])
    .filter((q) => q.is_primary_qualification && q.endorsement_decision === 'Approved')

  if (primaryQualifications.length) {
    return {
      isApproved: true,
      primaryQualifications,
    }
  }

  const qualificationInfo = applications.value.reduce((acc, app) => {
    const primaryQual = app.user_qualifications?.find(
      (q) => q.is_primary_qualification && q.endorsement_decision !== 'Approved',
    )
    return acc || (primaryQual ? { application: app, qualification: primaryQual } : null)
  }, null)

  return {
    isPending: true,
    qualificationInfo,
  }
})

const fetchDashboardData = async () => {
  if (!user.value?.cid) return
  try {
    await dashboardStore.fetchAllData(user.value.cid)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

const showRejectedApplications = () => dashboardStore.setSelectedApplications('Rejected')

const closeApplicationsModal = () => dashboardStore.clearSelectedApplications()

const visitApplication = (app) => {
  const routes = {
    CPD: '/admin/user/health_certification/cpd',
    License: '/admin/user/health_certification/practitioner_reg_and_cert/registration',
  }
  if (app.type in routes && app.status === 'Rejected') {
    window.location.href = routes[app.type]
  }
}

// In UserMhpcDashboard.vue <script setup>

const handleViewCertificate = (qualification) => {
  // 1. Check if we received a valid qualification with a parent application ID.
  if (!qualification || !qualification.application) {
    console.error('View Certificate failed: Invalid qualification data received.', qualification)
    return
  }

  // 2. Find the full application object using the ID from the qualification.
  // The modal needs the full application object (which has user details etc.),
  // not just the qualification object.
  const applicationForModal = applications.value.find((app) => app.id === qualification.application)

  if (!applicationForModal) {
    console.error('Could not find the parent application for the selected qualification.')
    return
  }

  // 3. Set the state to show the modal, using the correct Pinia ref syntax.
  // Your reference component shows the modal expects the data in a `{ results: [...] }` wrapper.
  selectedApplication.value = { results: [applicationForModal] }
  showCertificateModal.value = true
}

const closeCertificateModal = () => {
  showCertificateModal.value = false
  selectedApplication.value = null
}

onMounted(fetchDashboardData)

watch(
  applications,
  (newApplications) => {
    const approvedEoi = newApplications.find(
      (app) => app.type === 'EOI' && app.status === 'Approved',
    )
    isDprEnabled.value = !!approvedEoi
  },
  { deep: true },
)

watch(
  userDetail,
  (newUserDetails) => {
    if (newUserDetails?.username) fetchDashboardData()
  },
  { deep: true },
)
</script>
