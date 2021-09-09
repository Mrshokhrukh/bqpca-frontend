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

          <CogsStatusCard v-if="cogsApplication" :application="cogsApplication" />

          <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
            <StatCard
              title="CPD Credits"
              icon="Award"
              :credits="totalCpdCredits"
              :totalTarget="30"
              :statusCounts="statusCounts"
            />
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
import { useMhpcCpdStore } from '@/stores/mhpcCpdStore'
import { storeToRefs } from 'pinia'
import apiService from '@/services/services'

// ... (all other imports remain the same)
import ProfileHeader from './dashBoardComponents/ProfileHeaders.vue'
import StatCard from './dashBoardComponents/StatCards.vue'
import CogsStatusCard from './dashBoardComponents/CogsStatusCard.vue'
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
const cpdStore = useMhpcCpdStore()
const { user } = storeToRefs(authStore)
const {
  userDetail,
  applications,
  // cpdCredits, <-- No longer needed from this store
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

const cogsApplication = ref(null)

// ## FIX ##: Get both totalCpdCredits and the new statusCounts from the correct store
const { totalCpdCredits, statusCounts } = storeToRefs(cpdStore)

const isDprEnabled = ref(false)

const dashboardState = computed(() => {
  // ... (this logic is unchanged)
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
    return { isApproved: true, primaryQualifications }
  }
  const qualificationInfo = applications.value.reduce((acc, app) => {
    const primaryQual = app.user_qualifications?.find(
      (q) => q.is_primary_qualification && q.endorsement_decision !== 'Approved'
    )
    return acc || (primaryQual ? { application: app, qualification: primaryQual } : null)
  }, null)
  return { isPending: true, qualificationInfo }
})

const fetchDashboardData = async () => {
  if (!user.value?.cid) return
  try {
    // ## FIX ##: Ensure cpdStore.fetchCpdRecords() is called
    await Promise.all([dashboardStore.fetchAllData(user.value.cid), cpdStore.fetchCpdRecords()])

    const response = await apiService.getMhpcCogs()
    if (response.data.results && response.data.results.length > 0) {
      cogsApplication.value = response.data.results[0]
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  }
}

// ... (all other functions like showRejectedApplications, visitApplication, etc. are unchanged)
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
const handleViewCertificate = (qualification) => {
  if (!qualification || !qualification.application) {
    return
  }
  const applicationForModal = applications.value.find((app) => app.id === qualification.application)
  if (!applicationForModal) {
    return
  }
  selectedApplication.value = applicationForModal
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
      (app) => app.type === 'EOI' && app.status === 'Approved'
    )
    isDprEnabled.value = !!approvedEoi
  },
  { deep: true }
)

watch(
  userDetail,
  (newUserDetails) => {
    if (newUserDetails?.username) fetchDashboardData()
  },
  { deep: true }
)
</script>
