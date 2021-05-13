<template>
  <div class="min-h-screen bg-slate-50">
    <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
      <div
        class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"
      ></div>
    </div>

    <div v-else>
      <FirstDashboardState
        v-if="isUserCidMissing"
        title="Complete Your Profile"
        message="Your institution's CID is missing. Please complete your profile to access the dashboard features."
        action-text="Go to Profile"
        @action="navigateToProfile"
      />
      <FirstDashboardState
        v-else-if="hasNoApplications"
        title="No Applications Yet"
        message="You haven't submitted any applications. Start by submitting an application to see your dashboard."
        action-text="Start New Application"
        @action="navigateToNewApplication"
      />
      <EmptyDashboardState
        v-else-if="!hasApprovedApplications && !hasPendingApplications && !hasRegrettedApplications"
        title="Begin Your Application"
        message="It looks like there are no applications associated with your institution yet. Submit one to get started."
        action-text="Start New Application"
        @action="navigateToNewApplication"
      />

      <div v-else class="mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div
          v-if="hasPendingApplications && !hasApprovedApplications"
          class="mb-6 bg-amber-50 border-l-4 border-amber-400 text-amber-700 p-4 rounded-md shadow-sm"
          role="alert"
        >
          <div class="flex">
            <div class="py-1">
              <svg
                class="fill-current h-6 w-6 text-amber-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM9 13h2V7H9v6zm0 4h2v-2H9v2z"
                />
              </svg>
            </div>
            <div>
              <p class="font-bold">Application Under Process</p>
              <p class="text-sm">
                Your application is currently under review. We appreciate your patience. Please
                check back later for updates.
              </p>
            </div>
          </div>
        </div>

        <header class="mb-8">
          <h1 class="text-3xl font-bold text-slate-800 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-8 h-8 mr-3 text-indigo-600"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M2.25 12a8.963 8.963 0 011.591-5.045M2.25 12a8.963 8.963 0 001.591 5.045m17.909-5.045a8.963 8.963 0 01-1.591 5.045m1.591-5.045a8.963 8.963 0 00-1.591-5.045M9 21v-6a2.25 2.25 0 012.25-2.25h1.5A2.25 2.25 0 0115 12.75v6"
              />
            </svg>
            Institute Dashboard
          </h1>
        </header>

        <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div
            class="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-center space-x-4 hover:shadow-indigo-100 transition-shadow"
          >
            <div class="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                ></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-slate-500 uppercase">Total Applications</p>
              <p class="text-3xl font-bold text-slate-800 mt-1">
                {{ totalApplications }}
              </p>
            </div>
          </div>
          <div
            class="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-center space-x-4 hover:shadow-teal-100 transition-shadow"
          >
            <div class="p-3 rounded-full bg-teal-100 text-teal-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"></path>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-slate-500 uppercase">Registered Institutes</p>
              <p class="text-3xl font-bold text-slate-800 mt-1">
                {{ totalInstitutes }}
              </p>
            </div>
          </div>
          <div
            class="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-center space-x-4 hover:shadow-sky-100 transition-shadow"
          >
            <div class="p-3 rounded-full bg-sky-100 text-sky-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-slate-500 uppercase">Total DPRs</p>
              <p class="text-3xl font-bold text-slate-800 mt-1">
                {{ totalDepartments }}
              </p>
            </div>
          </div>
        </section>

        <section class="mb-10">
          <h2 class="text-xl font-semibold text-slate-700 mb-4">Institute Application Status</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatusCard
              :count="applicationStatusCounts.Pending"
              title="Pending Approval"
              :status="STATUS_PENDING_STR"
              iconType="pending"
            />
            <StatusCard
              :count="applicationStatusCounts.Approved"
              title="Approved Institutes"
              :status="STATUS_APPROVED_STR"
              iconType="approved"
            />
            <StatusCard
              :count="applicationStatusCounts.Regret"
              title="Regretted Applications"
              :status="STATUS_REGRET_STR"
              iconType="rejected"
            />
          </div>
        </section>

        <section class="mb-10">
          <h2 class="text-xl font-semibold text-slate-700 mb-4">DPR Status</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatusCard
              :count="departmentStatusCounts.Pending"
              title="Pending DPR Review"
              :status="STATUS_PENDING_STR"
              iconType="pending"
            />
            <StatusCard
              :count="departmentStatusCounts.Approved"
              title="Approved DPRs"
              :status="STATUS_APPROVED_STR"
              iconType="approved"
            />
            <StatusCard
              :count="departmentStatusCounts.Regret"
              title="Regretted DPRs"
              :status="STATUS_REGRET_STR"
              iconType="rejected"
            />
          </div>
        </section>

        <section
          v-if="activeTeachingCenters.length > 0"
          class="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-10"
        >
          <h2 class="text-xl font-semibold text-slate-700 mb-1 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mr-2 text-indigo-600"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            Approved Teaching Centers
          </h2>
          <p class="text-sm text-slate-500 mb-6">
            Manage and view certificates for your approved teaching centers.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div
              v-for="center in activeTeachingCenters"
              :key="center.id"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between bg-slate-50"
            >
              <div>
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-semibold text-indigo-700 text-lg">
                    {{ center.center_name }}
                  </h3>
                  <span
                    class="bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full font-medium"
                  >
                    {{ center.tc_review_decision }}
                  </span>
                </div>
                <p class="text-sm text-slate-600 mb-1">
                  <span class="font-medium">Location:</span>
                  {{ center.center_location }}, {{ center.state_dzongkhag }}
                </p>
                <p class="text-sm text-slate-600 mb-3">
                  <span class="font-medium">Status:</span>
                  <span :class="center.is_active ? 'text-green-600' : 'text-red-600'">
                    {{ center.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </p>
              </div>
              <button
                v-if="canViewCertificate(center)"
                @click="openCertificateDialog(center)"
                class="mt-auto w-full inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                View Certificate
              </button>
            </div>
          </div>
        </section>

        <section class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 class="text-xl font-semibold text-slate-700 mb-1 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mr-2 text-indigo-600"
            >
              <path
                d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
              ></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
            Recent Applications Overview
          </h2>
          <p class="text-sm text-slate-500 mb-6">
            A quick look at your most recent application activities.
          </p>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-100">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider rounded-tl-lg"
                  >
                    Applicant
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    Contact
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    Institute Name
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    Institute Status
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider rounded-tr-lg"
                  >
                    DPR Status
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-slate-200">
                <tr v-if="recentApplications.length === 0">
                  <td colspan="5" class="px-6 py-10 text-center text-slate-500">
                    <div class="flex flex-col items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="text-slate-400 mb-3"
                      >
                        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                        <path d="M22 12A10 10 0 0 0 12 2v10z" />
                      </svg>
                      <p class="text-lg font-medium">No recent applications to display.</p>
                      <p class="text-sm">When applications are processed, they will appear here.</p>
                    </div>
                  </td>
                </tr>
                <tr
                  v-for="app in recentApplications"
                  :key="app.id"
                  class="hover:bg-slate-50 transition-colors"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-slate-900">
                      {{ app.full_name }}
                    </div>
                    <div class="text-xs text-slate-500">
                      {{ app.email_address }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {{ app.contact_no }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    {{ app.name_of_institution }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <StatusBadge :status="app.review_decision" />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <StatusBadge :status="app.do_dpr_review_decision" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  </div>

  <CertificateDialog
    v-if="showCertificateDialog"
    :show="showCertificateDialog"
    :center-data="selectedCenter"
    :cert-type="'teaching-center'"
    @close="closeCertificateDialog"
  />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiservices from '@/services/services'
import { useAuthStore } from '@/stores/authStore'
import FirstDashboardState from '@/components/dashboard/mhpccomponents/institutions/FirstDashboardStates.vue'
import EmptyDashboardState from '@/components/dashboard/mhpccomponents/institutions/EmptyDashboardStates.vue'
import CertificateDialog from '@/components/dashboard/mhpccomponents/institutions/CertificateDialog.vue'
import StatusCard from '@/components/common/MHPC/StatusCard.vue' // Assuming you create this
import StatusBadge from '@/components/common/MHPC/StatusBadge.vue' // Assuming you create this

const STATUS_PENDING_STR = 'Pending'
const STATUS_APPROVED_STR = 'Approved'
const STATUS_REGRET_STR = 'Regret'
const STATUS_ACTIVE = true

const authStore = useAuthStore()
const router = useRouter()

const instituteData = ref([])
const teachingCenters = ref([])
const isLoading = ref(true)
const userCID = computed(() => authStore.user?.cid)

const showCertificateDialog = ref(false)
const selectedCenter = ref(null)

const isUserCidMissing = computed(() => !userCID.value && authStore.isLoggedIn)

const hasNoApplications = computed(() => instituteData.value.length === 0 && userCID.value)

const hasApprovedApplications = computed(() => {
  return instituteData.value.some((app) => app.review_decision === STATUS_APPROVED_STR)
})

const hasPendingApplications = computed(() => {
  return instituteData.value.some((app) => app.review_decision === STATUS_PENDING_STR)
})

const hasRegrettedApplications = computed(() => {
  return instituteData.value.some((app) => app.review_decision === STATUS_REGRET_STR)
})

const totalApplications = computed(() => instituteData.value.length)

const totalInstitutes = computed(() => {
  const instituteNames = new Set(instituteData.value.map((app) => app.name_of_institution))
  return instituteNames.size
})

const totalDepartments = computed(() => {
  const departmentNames = new Set(
    instituteData.value.filter((app) => app.dpr_name).map((app) => app.dpr_name),
  )
  return departmentNames.size
})

const applicationStatusCounts = computed(() => {
  const counts = { [STATUS_PENDING_STR]: 0, [STATUS_APPROVED_STR]: 0, [STATUS_REGRET_STR]: 0 }
  instituteData.value.forEach((app) => {
    if (Object.prototype.hasOwnProperty.call(counts, app.review_decision)) {
      counts[app.review_decision]++
    }
  })
  return counts
})

const departmentStatusCounts = computed(() => {
  const counts = { [STATUS_PENDING_STR]: 0, [STATUS_APPROVED_STR]: 0, [STATUS_REGRET_STR]: 0 }
  instituteData.value.forEach((app) => {
    if (Object.prototype.hasOwnProperty.call(counts, app.do_dpr_review_decision)) {
      counts[app.do_dpr_review_decision]++
    }
  })
  return counts
})

const recentApplications = computed(() => {
  return [...instituteData.value]
    .sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0))
    .slice(0, 5)
})

const activeTeachingCenters = computed(() => {
  return teachingCenters.value.filter(
    (center) =>
      center.tc_review_decision === STATUS_APPROVED_STR && center.is_active === STATUS_ACTIVE,
  )
})

const canViewCertificate = (center) => {
  return center.is_active === STATUS_ACTIVE && center.tc_review_decision === STATUS_APPROVED_STR
}

const openCertificateDialog = (center) => {
  selectedCenter.value = center
  showCertificateDialog.value = true
}

const closeCertificateDialog = () => {
  showCertificateDialog.value = false
  selectedCenter.value = null
}

const navigateToProfile = () => {
  router.push('/admin/institutions/health_certification/institution_profile')
}

const navigateToNewApplication = () => {
  router.push('/eoi-form')
}

onMounted(async () => {
  // Fetch teaching centers
  try {
    const [instituteResponse, tcResponse] = await Promise.all([
      apiservices.getMhpcInstitutes(),
      apiservices.getMhpcTeachingCenters(),
    ])

    const allInstitutes = instituteResponse.data?.results || []
    instituteData.value = allInstitutes.filter((institute) => institute.CID === userCID.value)

    if (tcResponse.data?.results) {
      const allTeachingCenters = tcResponse.data.results
      const userInstituteIds = new Set(instituteData.value.map((inst) => inst.id))
      teachingCenters.value = allTeachingCenters.filter((tc) =>
        userInstituteIds.has(tc.mhpc_institute_id),
      )
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.loader {
  border-top-color: #4f46e5; /* indigo-600 */
  animation: spinner 1.5s linear infinite;
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
