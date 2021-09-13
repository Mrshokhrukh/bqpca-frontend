<template>
  <div class="min-h-screen bg-slate-50 p-4 lg:p-8">
    <div class="mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900 font-serif">Admin Dashboard</h1>
        <p class="text-slate-600 mt-1">Welcome back, {{ adminName }}! Here's an overview of the accreditation system.</p>
      </div>

      <!-- Loading and Error States -->
      <div v-if="isLoading" class="text-center py-16">
        <p class="text-slate-500">Loading dashboard data...</p>
      </div>
      <div v-if="error" class="mb-6 bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-md">
        <p>{{ error }}</p>
      </div>

      <!-- Main Content Grid -->
      <div v-if="!isLoading && !error" class="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <!-- Key Stats Cards -->
        <div class="lg:col-span-12">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <!-- Total Applications -->
            <StatCard icon="FileText" :value="stats.totalApplications" label="Total Applications" />
            <!-- Pending Initial Review -->
            <StatCard icon="MailQuestion" :value="stats.pendingReview" label="Pending Initial Review" color="orange" />
            <!-- Awaiting ISAR -->
            <StatCard icon="FileClock" :value="stats.awaitingIsar" label="Awaiting ISAR Submission" color="yellow" />
            <!-- Pending Appeals -->
            <StatCard icon="Gavel" :value="stats.pendingAppeals" label="Pending Appeals" color="red" />
            <!-- Active Assessors -->
            <StatCard icon="Users" :value="stats.activeAssessors" label="Active Assessors" />
          </div>
        </div>

        <!-- Recent Activity Section -->
        <div class="lg:col-span-7 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">Recent Applications for Review</h2>
          <div class="space-y-4">
            <div v-if="recentApplications.length === 0" class="text-center py-8 text-slate-500">
              No new applications to review.
            </div>
            <div v-for="app in recentApplications" :key="app.id" class="p-3 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium text-slate-800">{{ app.institute_profile_name_display }}</p>
                  <p class="text-sm text-slate-500">Ref: {{ app.application_reference_no }}</p>
                  <p class="text-xs text-slate-400">Submitted: {{ formatDate(app.date_initial_app_submitted_to_heqc) }}</p>
                </div>
                <button @click="goToApplication(app.id)" class="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200">
                  View
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pending Appeals Section -->
        <div class="lg:col-span-5 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">Pending Appeals</h2>
           <div class="space-y-4">
            <div v-if="pendingAppeals.length === 0" class="text-center py-8 text-slate-500">
              No pending appeals.
            </div>
            <div v-for="appeal in pendingAppeals" :key="appeal.id" class="p-3 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium text-slate-800">{{ appeal.application_details.institute_profile_name_display }}</p>
                  <p class="text-sm text-slate-500">Reason: {{ appeal.appeal_reason_display }}</p>
                  <p class="text-xs text-slate-400">Submitted: {{ formatDate(appeal.appeal_submission_date_to_bac) }}</p>
                </div>
                <button @click="goToAppeal(appeal.id)" class="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200">
                  Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/services'
import { useAuthStore } from '@/stores/authStore'
import StatCard from '@/components/dashboard/accredcomponent/admin/StatCard.vue' // A reusable component for stats

const router = useRouter()
const authStore = useAuthStore()

// State
const isLoading = ref(true)
const error = ref(null)
const adminName = ref(authStore.user?.name || 'Admin')

const stats = ref({
  totalApplications: 0,
  pendingReview: 0,
  awaitingIsar: 0,
  pendingAppeals: 0,
  activeAssessors: 0,
})

const recentApplications = ref([])
const pendingAppeals = ref([])

// Fetch all necessary data for the dashboard
const fetchDashboardData = async () => {
  isLoading.value = true
  error.value = null
  try {
    // Use Promise.all to fetch data concurrently for better performance
    const [
      allAppsResponse,
      pendingAppealsResponse,
      assessorsResponse,
    ] = await Promise.all([
      apiService.getAccreditationApplications({ ordering: '-created_at' }),
      apiService.getAccreditationAppeals({ status_appeal: 'submitted' }),
      apiService.getMastersAssessorPools({ is_active: true }),
    ]);

    const allApplications = allAppsResponse.data.results || [];

    // Calculate stats
    stats.value.totalApplications = allAppsResponse.data.count || 0;
    stats.value.pendingReview = allApplications.filter(app => app.status === 'initial_app_submitted_heqc_review').length;
    stats.value.awaitingIsar = allApplications.filter(app => app.status === 'initial_app_approved_awaiting_isar').length;
    stats.value.pendingAppeals = pendingAppealsResponse.data.count || 0;
    stats.value.activeAssessors = assessorsResponse.data.count || 0;

    // Populate recent activity lists
    recentApplications.value = allApplications
      .filter(app => app.status === 'initial_app_submitted_heqc_review')
      .slice(0, 5); // Show the 5 most recent

    pendingAppeals.value = (pendingAppealsResponse.data.results || []).slice(0, 5);

  } catch (err) {
    error.value = 'Failed to load dashboard data. Please check your connection and try again.'
    console.error("Dashboard fetch error:", err);
  } finally {
    isLoading.value = false
  }
}

// Helper methods
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const goToApplication = (id) => {
  // Replace with your actual route to view an application detail
  // router.push(`/admin/applications/${id}`);
  console.log(`Navigate to application ${id}`);
}

const goToAppeal = (id) => {
  // Replace with your actual route to view an appeal detail
  // router.push(`/admin/appeals/${id}`);
  console.log(`Navigate to appeal ${id}`);
}


// Lifecycle hook
onMounted(() => {
  fetchDashboardData();
})
</script>