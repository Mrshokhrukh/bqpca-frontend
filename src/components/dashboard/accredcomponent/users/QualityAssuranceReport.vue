<template>
  <div class="mx-auto p-4 sm:p-6 lg:p-8">
    <div class="mx-auto">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900 mb-2">Institutional Quality Assurance Report (IQAR)</h1>
      <p class="text-md text-gray-600 mb-8">
        Submit the required post-accreditation reports for your institution.
      </p>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center p-12">
        <p class="mt-4 text-gray-500 font-semibold">Loading Your Accredited Applications...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
        <p class="font-bold">An Error Occurred</p>
        <p>{{ error }}</p>
      </div>

      <!-- No Accredited Applications State -->
      <div v-else-if="accreditedApplications.length === 0" class="text-center p-12 bg-gray-50 rounded-lg">
        <h3 class="text-xl font-medium text-gray-900">No Accredited Applications Found</h3>
        <p class="mt-2 text-sm text-gray-500">
          You do not have any applications with an 'Approved & Accredited' status yet.
        </p>
      </div>

      <!-- Applications Table -->
      <div v-else class="bg-white shadow-lg rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institute / Ref No.</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accreditation Valid Until</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required Reports & Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="app in accreditedApplications" :key="app.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ app.institute_profile_details.name }}</div>
                  <div class="text-xs text-gray-500">{{ app.application_reference_no }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ formatDate(app.accreditation_validity_to) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <ul v-if="app.post_accreditation_reports && app.post_accreditation_reports.length > 0" class="space-y-2">
                    <li v-for="report in app.post_accreditation_reports" :key="report.id" class="flex items-center justify-between">
                      <div>
                        <span :class="statusClass(report.status)" class="mr-2 inline-block h-2 w-2 rounded-full"></span>
                        <span class="font-medium">{{ report.report_type_display }}</span>
                      </div>
                      <span class="text-xs text-gray-400 ml-4">Due: {{ formatDate(report.due_date) }}</span>
                    </li>
                  </ul>
                   <div v-else class="text-xs text-gray-400 italic">No reports generated yet.</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-2">
                  <!-- ACTION FOR IMPLEMENTATION PLAN -->
                  <div v-if="getReport(app, 'implementation_plan')">
                      <button
                        v-if="isSubmittable(getReport(app, 'implementation_plan'))"
                        @click="openPlanModal(app, getReport(app, 'implementation_plan'))"
                        class="action-button bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                      >
                        {{ getReport(app, 'implementation_plan').status === 'needs_revision' ? 'Resubmit' : 'Submit' }} Plan (B)
                      </button>
                      <div v-else class="text-xs text-green-600 italic">
                        Plan Submitted
                      </div>
                  </div>

                  <!-- ACTION FOR PROGRESS REPORT -->
                  <div v-if="getReport(app, 'progress_report')">
                       <button
                        v-if="isSubmittable(getReport(app, 'progress_report'))"
                        @click="openProgressModal(app, getReport(app, 'progress_report'))"
                        class="action-button bg-sky-600 hover:bg-sky-700 focus:ring-sky-500"
                      >
                         {{ getReport(app, 'progress_report').status === 'needs_revision' ? 'Resubmit' : 'Submit' }} Progress (C)
                      </button>
                      <div v-else class="text-xs text-green-600 italic">
                        Progress Report Submitted
                      </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- MODAL 1: Implementation Plan Submission (Part B) -->
    <div v-if="isPlanModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" @click.self="closePlanModal">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div class="flex justify-between items-center p-4 border-b">
            <h2 class="text-xl font-bold text-gray-800">Submit: Implementation Plan (Part B)</h2>
            <button @click="closePlanModal" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <div class="p-6 overflow-y-auto">
          <form @submit.prevent="handlePlanSubmit">
            <div class="overflow-x-auto">
              <table class="min-w-full border">
                <thead class="bg-gray-100 text-xs uppercase">
                    <tr>
                      <th class="p-2 text-left w-1/6">Standards</th>
                      <th class="p-2 text-left w-1/5">Recommendations</th>
                      <th class="p-2 text-left w-1/5">Actions</th>
                      <th class="p-2 text-left w-1/6">Lead Person</th>
                      <th class="p-2 text-left w-1/6">Timeline</th>
                      <th class="p-2 text-left w-1/5">Remarks</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                  <tr v-for="item in implementationPlanItems" :key="item.standard">
                    <td class="p-2 align-top font-semibold text-sm">{{ item.standard_name }}</td>
                    <td class="p-2 align-top"><textarea v-model="item.recommendations" rows="3" class="form-textarea"></textarea></td>
                    <td class="p-2 align-top"><textarea v-model="item.actions" rows="3" class="form-textarea"></textarea></td>
                    <td class="p-2 align-top"><input type="text" v-model="item.lead_person" class="form-input" /></td>
                    <td class="p-2 align-top"><input type="text" v-model="item.timeline" class="form-input" /></td>
                    <td class="p-2 align-top"><textarea v-model="item.remarks" rows="3" class="form-textarea"></textarea></td>
                  </tr>
                </tbody>
              </table>
            </div>
             <div class="mt-6 flex justify-end">
              <button type="button" @click="closePlanModal" class="form-cancel-btn">Cancel</button>
              <button type="submit" :disabled="isSubmitting" class="form-submit-btn ml-3">
                {{ isSubmitting ? 'Submitting...' : 'Submit Plan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- MODAL 2: Progress Report Submission (Part C) -->
    <div v-if="isProgressModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" @click.self="closeProgressModal">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <div class="flex justify-between items-center p-4 border-b">
              <h2 class="text-xl font-bold text-gray-800">Submit: Progress of the Implementation Plan (Part C)</h2>
              <button @click="closeProgressModal" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
          </div>
          <div class="p-6 overflow-y-auto">
            <form @submit.prevent="handleProgressSubmit">
               <!-- Reference to Submitted Plan -->
              <div v-if="submittedPlanForReference" class="mb-6 bg-gray-50 p-4 rounded-md border">
                  <h4 class="font-semibold text-gray-700 mb-2">Reference: Your Submitted Implementation Plan</h4>
                  <ul class="space-y-1 text-sm list-disc list-inside max-h-40 overflow-y-auto">
                      <li v-for="item in submittedPlanForReference.implementation_plan_items" :key="item.id">
                          <strong>{{ getStandardName(item.standard) }}:</strong> {{ item.recommendations }}
                      </li>
                  </ul>
              </div>

              <div class="space-y-6">
                <div>
                  <label for="q1" class="form-label">1. Provide details of any internal quality review activity that was carried out to fulfill the assessors' recommendations.</label>
                  <textarea id="q1" v-model="progressReportData.q1_internal_review_details" rows="4" class="form-textarea" required></textarea>
                </div>
                <div>
                  <label for="q2" class="form-label">2. Highlight the progress of the Implementation plan.</label>
                  <textarea id="q2" v-model="progressReportData.q2_progress_highlight" rows="4" class="form-textarea" required></textarea>
                </div>
                <div>
                  <label for="q3" class="form-label">3. Outline any initiatives or major changes taken for continuous improvement including the future plans.</label>
                  <textarea id="q3" v-model="progressReportData.q3_initiatives_for_improvement" rows="4" class="form-textarea" required></textarea>
                </div>
                <div>
                  <label for="q4" class="form-label">4. Highlight the recommendations that could not be implemented and the reason thereof.</label>
                  <textarea id="q4" v-model="progressReportData.q4_unimplemented_recommendations" rows="4" class="form-textarea" required></textarea>
                </div>
              </div>
              <div class="mt-6 flex justify-end">
                <button type="button" @click="closeProgressModal" class="form-cancel-btn">Cancel</button>
                <button type="submit" :disabled="isSubmitting" class="form-submit-btn ml-3">
                  {{ isSubmitting ? 'Submitting...' : 'Submit Report' }}
                </button>
              </div>
          </form>
          </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.form-label { @apply block text-sm font-medium text-gray-700 mb-1; }
.form-input, .form-textarea { @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm; }
.form-submit-btn { @apply inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300 disabled:cursor-not-allowed; }
.form-cancel-btn { @apply inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-6 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2; }
.action-button { @apply inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2; }
</style>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import apiService from '@/services/services';

// --- STATE MANAGEMENT ---
const applications = ref([]);
const standards = ref([]);
const isLoading = ref(true);
const isSubmitting = ref(false);
const error = ref(null);

const isPlanModalOpen = ref(false);
const isProgressModalOpen = ref(false);

const selectedApplication = ref(null);
const selectedReport = ref(null);

const implementationPlanItems = ref([]);
const progressReportData = ref({});
const toast = useToast();

// --- COMPUTED PROPERTIES ---
const accreditedApplications = computed(() => {
  return applications.value.filter(app => app.status === 'approved_accredited');
});

const submittedPlanForReference = computed(() => {
    if (!selectedApplication.value) return null;
    return selectedApplication.value.post_accreditation_reports.find(
        r => r.report_type === 'implementation_plan' && r.status !== 'pending'
    );
});

// --- LIFECYCLE HOOK ---
onMounted(async () => {
  await fetchData();
});

// --- CORE DATA FETCHING LOGIC ---
async function fetchData() {
  try {
    isLoading.value = true;
    error.value = null;

    const [appsResponse, standardsResponse] = await Promise.all([
      apiService.getAccreditationApplications(),
      apiService.getMastersStandards()
    ]);

    let fetchedApps = appsResponse.data.results || appsResponse.data;
    standards.value = standardsResponse.data.results || standardsResponse.data;

    // "Check and Create" Logic: For each accredited app, this ensures the post-accreditation
    // report records exist on the backend. It triggers the application model's save() hook.
    const reportEnsuringPromises = fetchedApps
      .filter(app => app.status === 'approved_accredited' && (!app.post_accreditation_reports || app.post_accreditation_reports.length === 0))
      .map(app => {
        console.log(`Reports for App ID ${app.id} missing. Triggering backend creation.`);
        // Re-saving the application via a PATCH request will trigger the backend's save() hook.
        return apiService.patchAccreditationApplication(app.id, { status: app.status })
            .then(response => response.data)
            .catch(err => {
                console.error(`Failed to ensure reports for app ${app.id}`, err);
                return app; // On failure, return original to prevent crash
            });
      });

    if (reportEnsuringPromises.length > 0) {
        const updatedAppsData = await Promise.all(reportEnsuringPromises);
        updatedAppsData.forEach(updatedApp => {
            const index = fetchedApps.findIndex(a => a.id === updatedApp.id);
            if (index !== -1) fetchedApps[index] = updatedApp;
        });
    }

    applications.value = fetchedApps;

  } catch (err) {
    console.error("Failed to load IQAR data:", err);
    error.value = err.response?.data?.detail || "Could not load application data.";
    toast.error(error.value);
  } finally {
    isLoading.value = false;
  }
}

// --- MODAL AND SUBMISSION LOGIC ---

// Plan Modal (B)
const openPlanModal = (app, report) => {
  selectedApplication.value = app;
  selectedReport.value = report;
  initializeImplementationPlan(report);
  isPlanModalOpen.value = true;
};

const closePlanModal = () => {
  isPlanModalOpen.value = false;
  implementationPlanItems.value = [];
  clearSelections();
};

const initializeImplementationPlan = (report) => {
  const existingItems = report.implementation_plan_items || [];
  implementationPlanItems.value = standards.value.map(standard => {
    const existingItem = existingItems.find(item => item.standard === standard.id);
    return existingItem || {
      standard: standard.id, standard_name: standard.standard_name, recommendations: '', actions: '', lead_person: '', timeline: '', remarks: ''
    };
  });
};

const handlePlanSubmit = async () => {
  isSubmitting.value = true;
  try {
    const payload = {
      status: 'submitted',
      implementation_plan_items: implementationPlanItems.value.map(({ standard_name, ...item }) => item)
    };
    await apiService.submitPostAccreditationReport(selectedReport.value.id, payload);
    toast.success("Implementation Plan submitted successfully!");
    closePlanModal();
    await fetchData();
  } catch (err) {
    handleApiError(err, "Failed to submit the plan.");
  } finally {
    isSubmitting.value = false;
  }
};

// Progress Modal (C)
const openProgressModal = (app, report) => {
  selectedApplication.value = app;
  selectedReport.value = report;
  progressReportData.value = {
    q1_internal_review_details: report.q1_internal_review_details || '',
    q2_progress_highlight: report.q2_progress_highlight || '',
    q3_initiatives_for_improvement: report.q3_initiatives_for_improvement || '',
    q4_unimplemented_recommendations: report.q4_unimplemented_recommendations || '',
  };
  isProgressModalOpen.value = true;
};

const closeProgressModal = () => {
  isProgressModalOpen.value = false;
  progressReportData.value = {};
  clearSelections();
};

const handleProgressSubmit = async () => {
  isSubmitting.value = true;
  try {
    const payload = {
      status: 'submitted',
      ...progressReportData.value
    };
    await apiService.submitPostAccreditationReport(selectedReport.value.id, payload);
    toast.success("Progress Report submitted successfully!");
    closeProgressModal();
    await fetchData();
  } catch (err) {
    handleApiError(err, "Failed to submit the report.");
  } finally {
    isSubmitting.value = false;
  }
};

const clearSelections = () => {
    selectedApplication.value = null;
    selectedReport.value = null;
}

// --- HELPER FUNCTIONS ---

const getReport = (app, reportType) => {
    if (!app.post_accreditation_reports) return null;
    return app.post_accreditation_reports.find(r => r.report_type === reportType);
}

const isSubmittable = (report) => {
    if (!report) return false;
    return report.status === 'pending' || report.status === 'needs_revision';
}

const getStandardName = (standardId) => standards.value.find(s => s.id === standardId)?.standard_name || 'Unknown';

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    if (dateString.includes('T')) {
        return new Date(dateString).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    return new Date(`${dateString}T00:00:00`).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
};

const statusClass = (status) => ({
    'pending': 'bg-yellow-400',
    'needs_revision': 'bg-orange-400',
    'submitted': 'bg-blue-400',
    'accepted': 'bg-green-400',
    'reviewed': 'bg-purple-400'
}[status] || 'bg-gray-400');

const handleApiError = (err, defaultMessage) => {
  console.error(defaultMessage, err);
  const errorDetail = err.response?.data?.detail || JSON.stringify(err.response?.data);
  toast.error(errorDetail || defaultMessage);
}
</script>
