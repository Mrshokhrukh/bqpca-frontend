<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="mx-auto w-full space-y-6">
      <LoadingSpinner v-if="isLoading" />

      <template v-if="!isLoading">
        <FirstDashboardState v-if="dashboardState.isFirstState" :message="dashboardState.message" />
        <EmptyDashboardState v-else-if="dashboardState.isPending" :qualification-info="dashboardState.qualificationInfo"
          :key="dashboardState.qualificationInfo?.qualification?.id + (dashboardState.qualificationInfo?.qualification?.updated_at || '')" />
        <template v-else-if="dashboardState.isApproved">
          <!-- Removed :renewal-message prop since ProfileHeader now calculates its own -->
          <ProfileHeader :user-detail="userDetail" :qualifications="dashboardState.primaryQualifications"
            @view-certificate="handleViewCertificate" />
          <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
            <StatCard title="CPD Credits" icon="Award" :progress="cpdCredits" :total="50" type="progress" />
            <CogsStatusCard :expiry-date="licenseExpiryDate" :status="licenseStatus" />
            <ActivityFeed title="Recent Activities" :activities="recentActivities" />
          </div>
          <ApplicationHistoryCard :applications="applications" @show-rejected="showRejectedApplications" />
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <DeadlinesList title="Upcoming Deadlines" :deadlines="upcomingDeadlines" />
          </div>
          <ApplicationsModal v-if="selectedApplications.length" :applications="selectedApplications" :title="modalTitle"
            @close="closeApplicationsModal" @visit="visitApplication" />
          <CertificateModal v-if="showCertificateModal" :application="selectedApplication"
            @close="closeCertificateModal" />
        </template>
        <div v-else class="p-10 text-center">
          <p class="text-gray-600">Could not determine dashboard state. Please check your application status or contact
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
import { useEpcDashboardStore } from '@/stores/epcUserDashboardStore'
import { storeToRefs } from 'pinia'

import ProfileHeader from './dashboardComponents/ProfileHeaders.vue'
import StatCard from './dashboardComponents/StatCards.vue'
import CogsStatusCard from './dashboardComponents/CogsStatusCards.vue'
import ApplicationHistoryCard from './dashboardComponents/ApplicationHistoryCards.vue'
import ActivityFeed from './dashboardComponents/ActivityFeeds.vue'
import DeadlinesList from './dashboardComponents/DeadlinesLists.vue'
import ApplicationsModal from './dashboardComponents/ApplicationModal.vue'
import CertificateModal from '../../../common/EPC/EPCCertificateModal.vue'
import LoadingSpinner from '../../../common/EPC/EPCLoadingSpinner.vue'
import EmptyDashboardState from './dashboardComponents/EmptyDashboardStates.vue'
import FirstDashboardState from './dashboardComponents/FirstDashboardStates.vue'

const authStore = useAuthStore()
const dashboardStore = useEpcDashboardStore()
const { user } = storeToRefs(authStore)
const {
  userDetail,
  applications,
  cpdCredits,
  licenseExpiryDate,
  licenseStatus,
  // Removed renewalMessage since ProfileHeader calculates its own
  recentActivities,
  upcomingDeadlines,
  selectedApplications,
  modalTitle,
  isLoading,
  selectedApplication,
  showCertificateModal
} = storeToRefs(dashboardStore)

// Reactive variable to track engineering program enablement (similar to DPR in MHPC)
const isEngineeringProgramEnabled = ref(false)

// Advanced dashboard state logic similar to MHPC
const dashboardState = computed(() => {
  if (isLoading.value) return { isLoading: true }

  const hasNoApplications = !applications.value?.length
  if (hasNoApplications) {
    return {
      isFirstState: true,
      message: "You don't have any applications yet. Please apply to get started."
    }
  }

  // Check if applications have qualifications
  const hasApplicationsButNoQualifications = applications.value.every(
    app => !app.user_qualifications?.length
  )

  if (hasApplicationsButNoQualifications) {
    return {
      isFirstState: true,
      message: "Your application is registered. Please add your qualifications to proceed with the review process."
    }
  }

  // Check for approved primary qualifications
  const primaryQualifications = applications.value
    .flatMap(app => app.user_qualifications || [])
    .filter(q => q.is_primary_qualification && q.endorsement_decision === 'Approved')

  if (primaryQualifications.length) {
    return {
      isApproved: true,
      primaryQualifications
    }
  }

  // Check for pending primary qualifications
  const qualificationInfo = applications.value.reduce((acc, app) => {
    const primaryQual = app.user_qualifications?.find(q => q.is_primary_qualification && q.endorsement_decision !== 'Approved')
    return acc || (primaryQual ? { application: app, qualification: primaryQual } : null)
  }, null)

  if (qualificationInfo) {
    return {
      isPending: true,
      qualificationInfo
    }
  }

  // If we have applications but don't fit other criteria, show basic dashboard
  return {
    isApproved: true,
    primaryQualifications: []
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
    CPD: '/admin/user/engineering/cpd',
    License: '/admin/user/engineering_certification/registration',
    'Engineering Program': '/admin/user/engineering/education_programs'
  }
  if (app.type in routes && app.status === 'Rejected') {
    window.location.href = routes[app.type]
  }
}

const handleViewCertificate = () => {
  const primaryQual = dashboardState.value.primaryQualifications[0]
  if (!primaryQual) return

  const application = applications.value.find(app =>
    app.user_qualifications.some(q => q.id === primaryQual.id)
  )

  if (application) {
    dashboardStore.setSelectedApplication({ results: [application] })
    dashboardStore.setShowCertificateModal(true)
  }
}

const closeCertificateModal = () => {
  dashboardStore.setShowCertificateModal(false)
  dashboardStore.setSelectedApplication(null)
}

onMounted(fetchDashboardData)

watch(applications, (newApplications) => {
  // Check for approved engineering program applications (similar to EOI in MHPC)
  const approvedProgram = newApplications?.find(app =>
    app.type === 'Engineering Program' && app.status === 'Approved'
  )
  isEngineeringProgramEnabled.value = !!approvedProgram
}, { deep: true })

watch(userDetail, (newUserDetails) => {
  if (newUserDetails?.username) fetchDashboardData()
}, { deep: true })
</script>