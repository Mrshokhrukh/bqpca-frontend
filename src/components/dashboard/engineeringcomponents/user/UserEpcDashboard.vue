<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="mx-auto w-full space-y-6">
      <LoadingSpinner v-if="isLoading" />

      <template v-if="!isLoading">
        <FirstDashboardState v-if="dashboardState.isFirstState" :message="dashboardState.message" />
        <EmptyDashboardState v-else-if="dashboardState.isPending" :qualification-info="dashboardState.qualificationInfo"
          :message="dashboardState.message"
          :key="dashboardState.qualificationInfo?.qualification?.id + (dashboardState.qualificationInfo?.qualification?.updated_at || '')" />
        <template v-else-if="dashboardState.isApproved">
          <ProfileHeader v-if="combinedUserDetail" :user-detail="combinedUserDetail"
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

          <CertificateModal v-if="showCertificateModal" :qualification="selectedApplication"
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
import { useToast } from 'vue-toastification'
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
const toast = useToast()
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
  showCertificateModal
} = storeToRefs(dashboardStore)

const combinedUserDetail = computed(() => {
  if (!userDetail.value) return null
  const allQualifications = applications.value?.flatMap(app => app.user_qualifications || []) || []
  return {
    ...userDetail.value,
    user_qualifications: allQualifications
  }
})

const isEngineeringProgramEnabled = ref(false)

const getQualificationStatusMessage = (qualification) => {
  const appReviewStatus = qualification.application_review_status
  const physicalReviewStatus = qualification.physical_review_status
  const endorsementDecision = qualification.endorsement_decision
  const paymentStatus = qualification.payment_status
  if (appReviewStatus === 'Rejected' || appReviewStatus === 'Regretted') {
    return "Your application review has been rejected. Please check the rejection reason and consider reapplying with corrected information."
  }

  if (physicalReviewStatus === 'Rejected' || physicalReviewStatus === 'Regretted') {
    return "Your physical verification has been regretted. Please check the remarks and contact the office for further guidance."
  }

  if (endorsementDecision === 'Rejected' || endorsementDecision === 'Regretted') {
    return "Your endorsement has been regretted. Please review the feedback provided and contact support if needed."
  }
  if (appReviewStatus === 'Approved' && (physicalReviewStatus === 'Pending' || !physicalReviewStatus)) {
    return "Congratulations! Your application review has been approved. Please come for physical verification with all required documents."
  }

  if (appReviewStatus === 'Approved' && physicalReviewStatus === 'Approved' &&
    (paymentStatus === 'pending' || !paymentStatus || paymentStatus === 'failed')) {
    return "Great! Your physical verification is complete. Please proceed to the application tracker to make payment and receive your certificate."
  }

  if (appReviewStatus === 'Approved' && physicalReviewStatus === 'Approved' &&
    paymentStatus === 'completed' && endorsementDecision === 'Pending') {
    return "Payment completed successfully! Your application is now under final endorsement review."
  }

  if (appReviewStatus === 'Approved' && physicalReviewStatus === 'Approved' &&
    paymentStatus === 'processing_payment') {
    return "Your payment is being processed. Once confirmed, your application will proceed to final endorsement."
  }

  return "Your application is under review. We will notify you once there is an update."
}

const dashboardState = computed(() => {
  if (isLoading.value) return { isLoading: true }

  const hasNoApplications = !applications.value?.length
  if (hasNoApplications) {
    return {
      isFirstState: true,
      message: "You don't have any applications yet. Please apply to get started."
    }
  }

  const hasApplicationsButNoQualifications = applications.value.every(
    app => !app.user_qualifications?.length
  )

  if (hasApplicationsButNoQualifications) {
    return {
      isFirstState: true,
      message: "Your application is registered. Please add your qualifications to proceed with the review process."
    }
  }

  const primaryQualifications = applications.value
    .flatMap(app => app.user_qualifications || [])
    .filter(q => q.is_primary_qualification && q.endorsement_decision === 'Approved')

  if (primaryQualifications.length) {
    return {
      isApproved: true,
      primaryQualifications
    }
  }
  const qualificationInfo = applications.value.reduce((acc, app) => {
    const primaryQual = app.user_qualifications?.find(q =>
      q.is_primary_qualification && q.endorsement_decision !== 'Approved'
    )
    return acc || (primaryQual ? { application: app, qualification: primaryQual } : null)
  }, null)

  if (qualificationInfo) {
    const message = getQualificationStatusMessage(qualificationInfo.qualification)

    return {
      isPending: true,
      qualificationInfo,
      message
    }
  }

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
  const primaryQual = dashboardState.value.primaryQualifications[0];
  if (!primaryQual) {
    toast.error("Could not find an approved primary qualification to display.");
    return;
  }

  const application = applications.value.find(app =>
    app.user_qualifications.some(q => q.id === primaryQual.id)
  );

  if (application) {
    const approvedQualifications = application.user_qualifications.filter(
      q => q.endorsement_decision === 'Approved'
    );

    if (approvedQualifications.length === 0) {
      toast.info("There are no approved qualifications to display in the certificate.");
      return;
    }

    const certificateData = {
      ...application,
      user_qualifications: approvedQualifications
    };

    dashboardStore.setSelectedApplication({ results: [certificateData] });
    dashboardStore.setShowCertificateModal(true);
  } else {
    toast.error("An error occurred while trying to load the certificate data.");
  }
}


const closeCertificateModal = () => {
  dashboardStore.setShowCertificateModal(false)
  dashboardStore.setSelectedApplication(null)
}

onMounted(fetchDashboardData)

watch(applications, (newApplications) => {
  const approvedProgram = newApplications?.find(app =>
    app.type === 'Engineering Program' && app.status === 'Approved'
  )
  isEngineeringProgramEnabled.value = !!approvedProgram
}, { deep: true })

watch(userDetail, (newUserDetails) => {
  if (newUserDetails?.username) fetchDashboardData()
}, { deep: true })
</script>
