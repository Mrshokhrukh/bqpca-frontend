<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Institute Dashboard</h1>
        <p class="text-gray-500" v-if="instituteProfile.name">
          Welcome back, {{ instituteProfile.name }}! Here's an overview of your accreditation status.
        </p>
        <p class="text-gray-500" v-else>Welcome back! Here's an overview of your applications.</p>
      </div>

      <!-- Loading and Error States -->
      <div v-if="loading" class="text-center py-10">
        <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="mt-2 text-gray-500">Loading your dashboard...</p>
      </div>
      <div v-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
        <p class="font-bold">Could not load dashboard</p>
        <p>{{ error }}</p>
      </div>

      <!-- Main Content (shown after loading) -->
      <div v-if="!loading && !error">
        <!-- Key Action / Next Step Card -->
        <div v-if="nextStep.title" :class="nextStep.cardClass || 'bg-blue-600'" class="text-white p-6 rounded-xl shadow-lg mb-8 flex items-start gap-4">
          <component :is="nextStep.icon" class="w-8 h-8 flex-shrink-0 mt-1" />
          <div>
            <h2 class="text-xl font-bold">{{ nextStep.title }}</h2>
            <p class="mt-1 opacity-90">{{ nextStep.description }}</p>

            <router-link v-if="nextStep.actionType === 'link' && nextStep.link" :to="nextStep.link" class="mt-4 inline-block bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              {{ nextStep.actionText }}
            </router-link>

            <button v-if="nextStep.actionType === 'button'" @click="nextStep.actionHandler" class="mt-4 inline-block bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              {{ nextStep.actionText }}
            </button>
          </div>
        </div>

        <!-- Site Visit Notification -->
        <div v-if="siteVisit.isScheduled && !siteVisit.isConfirmed" class="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-xl shadow-sm mb-6">
          <div class="flex items-center gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd"/></svg>
            <div>
              <p class="font-bold">Action Required: Site Visit Scheduled</p>
              <p>A site visit has been scheduled on {{ formatDate(siteVisit.startDate) }}. Please confirm or request a reschedule.</p>
              <router-link to="/admin/user/accreditation/site_visit_confirmation" class="text-blue-600 hover:underline font-medium">View Details & Respond</router-link>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <p class="text-sm font-medium text-gray-500">Total Applications</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.total }}</p>
            </div>
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <p class="text-sm font-medium text-gray-500">In Progress</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.inProgress }}</p>
            </div>
            <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <p class="text-sm font-medium text-gray-500">Completed</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.completed }}</p>
            </div>
        </div>

        <!-- Recent Activities -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100">
          <div class="p-6">
            <h2 class="text-lg font-semibold text-gray-900">Recent Activity Timeline</h2>
          </div>
          <div class="border-t border-gray-100">
            <ul class="divide-y divide-gray-100">
              <li v-if="recentActivities.length === 0" class="p-6 text-center text-gray-500">No recent activity to display. Start by submitting an application!</li>
              <li v-for="activity in recentActivities" :key="activity.id" class="p-6 hover:bg-gray-50 transition-colors">
                <div class="flex items-start gap-4">
                  <div :class="activity.iconBgClass" class="p-2 rounded-full">
                    <component :is="activity.icon" class="w-5 h-5" :class="activity.iconColorClass" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ activity.description }}</p>
                    <p class="text-sm text-gray-500 mt-1">{{ formatRelativeTime(activity.timestamp) }}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <AccreCertificateModal
      :is-open="isCertificateModalOpen"
      :application="selectedApplicationForCertificate"
      @close="closeCertificateModal"
    />

  </div>
</template>

<script setup>
import { ref, onMounted, computed, shallowRef } from 'vue';
import apiService from '@/services/services';
import AccreCertificateModal from '@/components/common/Accreditation/AccreCertificateModal.vue';
import { FileText, CheckCircle2, AlertTriangle, Flag, Clock, CalendarCheck, CalendarX } from 'lucide-vue-next';

// --- Reactive State ---
const loading = ref(true);
const error = ref(null);
const applications = ref([]);
const instituteProfile = ref({});
const siteVisit = ref({ isScheduled: false, isConfirmed: false, startDate: null });
const isCertificateModalOpen = ref(false);
const selectedApplicationForCertificate = ref(null);
// --- NEW: State for the application schedule ---
const activeSchedule = ref(null);

const FINAL_STATUSES = ['approved_accredited', 'approved_conditional', 'rejected_not_accredited', 'closed_withdrawn', 'closed_completed'];

// --- Lifecycle Hooks ---
onMounted(async () => {
  await fetchDashboardData();
});

// --- Data Fetching ---
const fetchDashboardData = async () => {
  loading.value = true;
  error.value = null;
  try {
    // --- UPDATED: Use Promise.allSettled to prevent one failure from stopping all data loading ---
    // This is useful because getActiveApplicationSchedule might return a 404, which is expected.
    const [profileResult, appsResult, scheduleResult] = await Promise.allSettled([
      apiService.getMyInstituteProfile(),
      apiService.getAccreditationApplications(),
      apiService.getActiveApplicationSchedule(), // This is the new API call
    ]);

    // Handle Institute Profile
    if (profileResult.status === 'fulfilled') {
      instituteProfile.value = profileResult.value.data;
    } else {
      console.error('Failed to fetch profile:', profileResult.reason);
       if (profileResult.reason.response?.data?.action_required === 'create_or_update_profile') {
        error.value = "Your institute profile is not yet set up. Please create your profile to get started.";
      } else {
        error.value = 'Could not load your dashboard. Please try again later.';
      }
      // Stop further processing if profile fails, as it's critical
      loading.value = false;
      return;
    }

    // Handle Applications
    if (appsResult.status === 'fulfilled') {
      applications.value = appsResult.value.data.results;
      checkForSiteVisit(applications.value);
    } // It's okay if this fails, we can still show the "apply" card

    // Handle Active Schedule
    if (scheduleResult.status === 'fulfilled' && scheduleResult.value.data) {
      // The API returned a 200 OK with schedule data
      activeSchedule.value = scheduleResult.value.data;
    } else {
      // API call failed (e.g., 404 Not Found) or returned empty data, meaning no active schedule
      activeSchedule.value = null;
    }

  } catch (err) {
    console.error('An unexpected error occurred in fetchDashboardData:', err);
    error.value = 'An unexpected error occurred while loading your dashboard.';
  } finally {
    loading.value = false;
  }
};

const checkForSiteVisit = (apps) => {
    for (const app of apps) {
        if (app.site_visits?.length > 0) {
            const latestVisit = app.site_visits.sort((a,b) => new Date(b.created_at) - new Date(a.created_at))[0];
            if (latestVisit) {
                siteVisit.value.isScheduled = true;
                siteVisit.value.isConfirmed = latestVisit.is_confirmed_by_institute;
                siteVisit.value.startDate = latestVisit.start_datetime;
                if (siteVisit.value.isScheduled && !siteVisit.value.isConfirmed) return;
            }
        }
    }
}

// --- Certificate Modal Logic ---
const openCertificateModal = (application) => {
    selectedApplicationForCertificate.value = application;
    isCertificateModalOpen.value = true;
};

const closeCertificateModal = () => {
    isCertificateModalOpen.value = false;
    selectedApplicationForCertificate.value = null;
};

// --- Computed Properties for Display ---
const stats = computed(() => {
  if (!applications.value) return { total: 0, inProgress: 0, completed: 0 };
  const total = applications.value.length;
  const completed = applications.value.filter(app => FINAL_STATUSES.includes(app.status)).length;
  const inProgress = total - completed;
  return { total, inProgress, completed };
});

const latestApplication = computed(() => {
    if (!applications.value || applications.value.length === 0) return null;
    return [...applications.value].sort((a,b) => new Date(b.created_at) - new Date(a.created_at))[0];
});

const nextStep = computed(() => {
    const app = latestApplication.value;

    // --- NEW LOGIC: Check for active schedule if user has no applications yet ---
    if (!app) {
      if (activeSchedule.value && activeSchedule.value.end_date) {
        // --- CASE 1: No applications, and the window is OPEN ---
        return {
          icon: shallowRef(CalendarCheck),
          title: "Ready to Apply? The Window is Open!",
          description: `The application window is open until ${formatDate(activeSchedule.value.end_date)}. Begin the process by submitting your first application.`,
          actionType: 'link',
          link: "/admin/user/accreditation/apply_for_accreditation",
          actionText: "Start New Application",
          cardClass: 'bg-green-600'
        };
      } else {
        // --- CASE 2: No applications, and the window is CLOSED ---
        return {
            icon: shallowRef(CalendarX),
            title: "Application Window Currently Closed",
            description: "We are not accepting new accreditation applications at this time. Please check back later for information on the next application cycle.",
            actionType: null, // No action
            cardClass: 'bg-gray-500'
        };
      }
    }

    if (app.status === 'approved_accredited') {
        return {
            icon: shallowRef(CheckCircle2),
            title: "Congratulations! You are Accredited!",
            description: `Your institution has been successfully accredited. You can view your certificate here.`,
            actionType: 'button',
            actionText: "View Certificate",
            actionHandler: () => openCertificateModal(app)
        };
    }

    const steps = {
        'draft_initial': {
            icon: shallowRef(FileText),
            title: "Complete Your Draft Application",
            description: `Your application (Ref: ${app.application_reference_no}) is saved. Continue editing before submission.`,
            actionType: 'link', link: `/admin/user/accreditation/edit-application/${app.id}`, actionText: "Continue Application"
        },
        'pending_payment': {
            icon: shallowRef(Clock),
            title: "Payment Required",
            description: "Complete the payment for your application to proceed to the HEQC review stage.",
            actionType: 'link', link: `/admin/user/accreditation/payment/${app.id}`, actionText: "Proceed to Payment"
        },
        'initial_app_approved_awaiting_isar': {
            icon: shallowRef(Flag),
            title: "Submit Your ISAR",
            description: `Your initial application is approved! Submit your ISAR by ${formatDate(app.isar_submission_deadline)}.`,
            actionType: 'link', link: `/admin/user/accreditation/submit-isar/${app.id}`, actionText: "Submit ISAR"
        },
        'rejected_not_accredited': {
            icon: shallowRef(AlertTriangle),
            title: "Decision Reached",
            description: `A final decision has been made on your application. You may be eligible to appeal this decision.`,
            actionType: 'link', link: `/admin/user/accreditation/track-accreditation`, actionText: "View Decision & Appeal"
        },
    };

    const defaultMessages = {
        'initial_app_submitted_heqc_review': "Application Under Review by HEQC",
        'isar_submitted_heqc_review': "ISAR Under Review by HEQC",
        'coi_pending_declaration': "Assessor Review in Progress",
        'site_visit_scheduled': "Site Visit Scheduled",
        'site_visit_confirmed': "Site Visit Confirmed",
        'assessment_report_submitted': "Awaiting Final Decision",
    };

    if (steps[app.status]) {
        return steps[app.status];
    } else if (defaultMessages[app.status]) {
        return {
            icon: shallowRef(Clock),
            title: defaultMessages[app.status],
            description: `Your application (Ref: ${app.application_reference_no}) is progressing. You will be notified of any required actions.`
        };
    } else {
        return { icon: shallowRef(Clock), title: "In Progress", description: `Your application status is: ${app.status_display}.` };
    }
});


const recentActivities = computed(() => {
    if (!latestApplication.value) return [];
    const app = latestApplication.value;
    let activities = [];
    const iconMap = { submission: { icon: shallowRef(FileText), bg: 'bg-blue-50', color: 'text-blue-600' }, update: { icon: shallowRef(Clock), bg: 'bg-yellow-50', color: 'text-yellow-600' }, completion: { icon: shallowRef(CheckCircle2), bg: 'bg-green-50', color: 'text-green-600' }, action: { icon: shallowRef(AlertTriangle), bg: 'bg-red-50', color: 'text-red-600' }, milestone: { icon: shallowRef(Flag), bg: 'bg-indigo-50', color: 'text-indigo-600' } };
    if (app.date_initial_app_submitted_to_heqc) activities.push({ id: 1, description: `Initial application (Ref: ${app.application_reference_no}) submitted.`, timestamp: app.date_initial_app_submitted_to_heqc, ...iconMap['submission'] });
    if (app.isar_report?.date_isar_formally_submitted) activities.push({ id: 2, description: `ISAR submitted to HEQC.`, timestamp: app.isar_report.date_isar_formally_submitted, ...iconMap['submission'] });
    const confirmedVisit = app.site_visits?.find(v => v.is_confirmed_by_institute);
    if (confirmedVisit) activities.push({ id: 3, description: `Site visit confirmed for ${formatDate(confirmedVisit.start_datetime)}.`, timestamp: confirmedVisit.updated_at, ...iconMap['milestone'] });
    if (app.status === 'approved_accredited' && app.updated_at) activities.push({ id: 4, description: `Application successfully accredited with grade '${app.final_grade_awarded_details?.rating_category_name || ''}'.`, timestamp: app.updated_at, ...iconMap['completion'] });
    return activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
});

// --- Helper Functions ---
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatRelativeTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.round((now - date) / 1000);
    const diffMinutes = Math.round(diffSeconds / 60);
    const diffHours = Math.round(diffMinutes / 60);
    const diffDays = Math.round(diffHours / 24);
    if (diffSeconds < 60) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return formatDate(dateString);
};
</script>