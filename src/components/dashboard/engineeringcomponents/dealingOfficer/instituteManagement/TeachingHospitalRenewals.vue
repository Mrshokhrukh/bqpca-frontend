<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Enhanced Header Section -->
    <div class="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
      <div class="mx-auto px-6 py-8">
        <div>
          <h1 class="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-700 bg-clip-text text-transparent mb-3">
            Teaching Center Renewals
          </h1>
          <p class="text-gray-600 text-lg">Manage and review teaching center renewal applications</p>
        </div>
      </div>
    </div>

    <div class=" mx-auto px-6 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
        <div class="relative">
          <Loader class="animate-spin text-blue-600 w-12 h-12" />
          <div class="absolute inset-0 animate-ping">
            <Loader class="text-blue-300 w-12 h-12 opacity-75" />
          </div>
        </div>
        <p class="mt-4 text-xl text-gray-600 font-medium">Loading renewal applications...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="apiError" class="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-8 shadow-lg">
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0">
            <svg class="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-xl font-bold text-red-800 mb-2">Unable to Load Data</h3>
            <p class="text-red-700">{{ errorMessage }}</p>
          </div>
        </div>
        <button @click="fetchRenewalData"
          class="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105">
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Try Again
        </button>
      </div>

      <!-- Applications Grid/Table -->
      <div v-else-if="renewalApplications.length > 0" class="space-y-6">
        <!-- Desktop Table View -->
        <div class="hidden lg:block bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gradient-to-r from-gray-50 to-slate-100">
                <tr>
                  <th class="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Center Information
                  </th>
                  <th class="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Submission Date
                  </th>
                  <th class="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="renewal in renewalApplications" :key="renewal.id"
                    class="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300">
                  <td class="px-8 py-6">
                    <div class="flex items-center space-x-4">
                      <div class="flex-shrink-0">
                        <div class="h-12 w-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                          <Building2Icon class="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="text-lg font-bold text-gray-900 truncate">
                          {{ renewal.teaching_center_details.center_name }}
                        </div>
                        <div class="text-sm text-gray-600 truncate">
                          {{ renewal.teaching_center_details.institute.name_of_institution }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-8 py-6">
                    <div class="text-sm font-medium text-gray-900">{{ formatDate(renewal.created_at) }}</div>
                  </td>
                  <td class="px-8 py-6">
                    <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-sm"
                      :class="getStatusClass(renewal.renewal_status)">
                      <span class="w-2 h-2 rounded-full mr-2" :class="getStatusDotClass(renewal.renewal_status)"></span>
                      {{ getStatusDisplay(renewal) }}
                    </span>
                  </td>
                  <td class="px-8 py-6">
                    <button @click="openDetailsModal(renewal)"
                      class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      <!-- FIX: Check for the correct status -->
                      {{ renewal.renewal_status === 'PENDING_REVIEW' ? 'Review' : 'View Details' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Mobile Card View -->
        <div class="lg:hidden space-y-4">
          <div v-for="renewal in renewalApplications" :key="renewal.id"
               class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-3">
                  <div class="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Building2Icon class="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-900">{{ renewal.teaching_center_details.center_name }}</h3>
                    <p class="text-sm text-gray-600">{{ renewal.teaching_center_details.institute.name_of_institution }}</p>
                  </div>
                </div>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                  :class="getStatusClass(renewal.renewal_status)">
                  {{ getStatusDisplay(renewal) }}
                </span>
              </div>

              <div class="mb-4 text-sm text-gray-600">
                <strong>Submitted:</strong> {{ formatDate(renewal.created_at) }}
              </div>

              <button @click="openDetailsModal(renewal)"
                class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-200">
                <!-- FIX: Check for the correct status -->
                {{ renewal.renewal_status === 'PENDING_REVIEW' ? 'Review Application' : 'View Details' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No applications message -->
      <div v-else class="text-center py-16">
        <div class="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50 p-12">
          <div class="mx-auto h-24 w-24 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mb-6">
            <svg class="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">No Applications Found</h3>
          <p class="text-gray-600">There are currently no teaching center renewal applications to display.</p>
        </div>
      </div>
    </div>

    <!-- Enhanced Modal -->
    <div v-if="showDetailsModal && selectedRenewal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] flex flex-col overflow-hidden">
        <!-- Modal Header -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-3xl font-bold mb-2">Renewal Application Details</h3>
              <div class="flex items-center space-x-3">
                <Building2Icon class="h-5 w-5 text-blue-200" />
                <p class="text-blue-100 text-lg">{{ selectedRenewal.teaching_center_details.center_name }}</p>
              </div>
            </div>
            <button @click="closeDetailsModal"
              class="text-blue-200 hover:text-white transition-colors rounded-full p-2 hover:bg-white/20">
              <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="flex-grow p-8 overflow-y-auto">
          <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <!-- Left Section: Application Details -->
            <div class="xl:col-span-2 space-y-8">
              <!-- Submission Section -->
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <h4 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <FileTextIcon class="h-6 w-6 text-blue-600 mr-3" />
                  Applicant's Submission
                </h4>
                <div class="space-y-6">
                  <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center">
                      <FileTextIcon class="h-5 w-5 text-white" />
                    </div>
                    <div class="flex-1">
                      <p class="font-semibold text-gray-800 mb-2">Renewal Document</p>
                      <a :href="selectedRenewal.renewal_document" target="_blank"
                        class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Download Document
                      </a>
                    </div>
                  </div>
                  <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0 h-10 w-10 bg-green-600 rounded-xl flex items-center justify-center">
                      <MessageSquareIcon class="h-5 w-5 text-white" />
                    </div>
                    <div class="flex-1">
                      <p class="font-semibold text-gray-800 mb-2">Applicant Remarks</p>
                      <div class="bg-white rounded-xl p-4 border border-gray-200">
                        <p class="text-gray-700">{{ selectedRenewal.user_remarks || 'No remarks provided by the applicant.' }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Center Details -->
              <div class="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
                <h4 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Building2Icon class="h-6 w-6 text-gray-600 mr-3" />
                  Center Information
                </h4>
                <div class="grid md:grid-cols-2 gap-6">
                  <div class="space-y-4">
                    <div>
                      <p class="text-sm font-semibold text-gray-600 mb-1">Institute Name</p>
                      <p class="text-gray-900 font-medium">{{ selectedRenewal.teaching_center_details.institute.name_of_institution }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-gray-600 mb-1">Center Name</p>
                      <p class="text-gray-900 font-medium">{{ selectedRenewal.teaching_center_details.center_name }}</p>
                    </div>
                  </div>
                  <div class="space-y-4">
                    <div>
                      <p class="text-sm font-semibold text-gray-600 mb-1">Current Validity Period</p>
                      <div class="bg-white rounded-lg p-3 border border-gray-200">
                        <div class="flex items-center text-sm">
                          <CalendarClockIcon class="h-4 w-4 text-gray-400 mr-2" />
                          <span class="text-gray-700">
                            {{ formatDate(selectedRenewal.teaching_center_details.valid_since) }} -
                            {{ formatDate(selectedRenewal.teaching_center_details.valid_till) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Section: Action Panel -->
            <div class="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 border border-gray-200 h-fit">
              <h4 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <svg class="h-6 w-6 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Review Panel
              </h4>
              <!-- FIX: Check for the correct status -->
              <div v-if="selectedRenewal.renewal_status === 'PENDING_REVIEW'" class="space-y-6">
                <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div class="flex items-center">
                    <svg class="h-5 w-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                    <p class="text-yellow-800 text-sm font-medium">Awaiting your review decision</p>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div v-if="!reviewAction" class="space-y-4">
                  <button @click="reviewAction = 'approve'"
                    class="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105">
                    <CircleCheckIcon class="h-6 w-6" />
                    <span>Approve Application</span>
                  </button>
                  <button @click="reviewAction = 'reject'"
                    class="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105">
                    <CircleXIcon class="h-6 w-6" />
                    <span>Reject Application</span>
                  </button>
                </div>

                <!-- Approval Form -->
                <form v-if="reviewAction === 'approve'" @submit.prevent="handleReviewSubmit('APPROVE')" class="space-y-6">
                  <div class="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h5 class="font-bold text-green-800 mb-3">Approval Confirmation</h5>
                    <label for="approvalRemarks" class="block text-sm font-semibold text-gray-700 mb-2">
                      Additional Comments (Optional)
                    </label>
                    <textarea id="approvalRemarks" v-model="approvalRemarks" rows="4"
                      class="w-full rounded-xl border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      placeholder="Add any additional comments or notes..."></textarea>
                  </div>
                  <div class="flex space-x-3">
                    <button type="button" @click="reviewAction = null"
                      class="flex-1 py-3 px-4 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold transition-colors">
                      Cancel
                    </button>
                    <button type="submit" :disabled="isSubmitting"
                      class="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl disabled:opacity-50 transition-all">
                      {{ isSubmitting ? 'Processing...' : 'Confirm Approval' }}
                    </button>
                  </div>
                </form>

                <!-- Rejection Form -->
                <form v-if="reviewAction === 'reject'" @submit.prevent="handleReviewSubmit('REJECT')" class="space-y-6">
                  <div class="bg-red-50 border border-red-200 rounded-xl p-4">
                    <h5 class="font-bold text-red-800 mb-3">Rejection Reason</h5>
                    <label for="rejectionReason" class="block text-sm font-semibold text-gray-700 mb-2">
                      Please provide a reason for rejection *
                    </label>
                    <textarea id="rejectionReason" v-model="rejectionReason" rows="4" required
                      class="w-full rounded-xl border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      placeholder="Explain why this application is being rejected..."></textarea>
                  </div>
                  <div class="flex space-x-3">
                    <button type="button" @click="reviewAction = null"
                      class="flex-1 py-3 px-4 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold transition-colors">
                      Cancel
                    </button>
                    <button type="submit" :disabled="isSubmitting"
                      class="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-3 px-4 rounded-xl disabled:opacity-50 transition-all">
                      {{ isSubmitting ? 'Processing...' : 'Confirm Rejection' }}
                    </button>
                  </div>
                </form>
              </div>

              <!-- Review History -->
              <div v-else class="space-y-4">
                <div class="bg-white rounded-xl p-4 border border-gray-200">
                  <h5 class="font-bold text-gray-800 mb-4">Review Summary</h5>
                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <span class="text-sm font-medium text-gray-600">Status:</span>
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
                        :class="getStatusClass(selectedRenewal.renewal_status)">
                        {{ getStatusDisplay(selectedRenewal) }}
                      </span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-sm font-medium text-gray-600">Payment:</span>
                      <span class="text-sm text-gray-900">{{ selectedRenewal.payment_status_display }}</span>
                    </div>
                    <div>
                      <span class="text-sm font-medium text-gray-600">Officer Remarks:</span>
                      <p class="text-sm text-gray-900 mt-1">{{ selectedRenewal.officer_remarks || 'No remarks provided.' }}</p>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-sm font-medium text-gray-600">Reviewed By:</span>
                      <span class="text-sm text-gray-900">{{ selectedRenewal.reviewed_by_details?.username || 'N/A' }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-sm font-medium text-gray-600">Review Date:</span>
                      <span class="text-sm text-gray-900">{{ formatDate(selectedRenewal.reviewed_at) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import apiServices from '@/services/services';
import { Loader, FileTextIcon, MessageSquareIcon, Building2Icon, CalendarClockIcon, CircleCheckIcon, CircleXIcon } from 'lucide-vue-next';

// --- STATE MANAGEMENT ---
const renewalApplications = ref([]);
const isLoading = ref(true);
const apiError = ref(false);
const errorMessage = ref('');
const selectedRenewal = ref(null);
const showDetailsModal = ref(false);
const isSubmitting = ref(false);

const reviewAction = ref(null);
const approvalRemarks = ref('');
const rejectionReason = ref('');

const toast = useToast();

// --- COMPUTED PROPERTIES FOR STATS AND DISPLAY ---
// FIX: Changed to match the actual API status 'PENDING_REVIEW'
const pendingApplications = computed(() => renewalApplications.value.filter(app => app.renewal_status === 'PENDING_REVIEW'));
const approvedPendingPayment = computed(() => renewalApplications.value.filter(app => app.renewal_status === 'AWAITING_PAYMENT'));
const completedApplications = computed(() => renewalApplications.value.filter(app => app.renewal_status === 'COMPLETED'));
const rejectedApplications = computed(() => renewalApplications.value.filter(app => app.renewal_status === 'REJECTED'));

// --- HELPER FUNCTIONS ---
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getStatusClass = (status) => {
  switch (status) {
    case 'COMPLETED': return 'bg-green-100 text-green-800 border border-green-200';
    case 'AWAITING_PAYMENT': return 'bg-teal-100 text-teal-800 border border-teal-200';
    case 'REJECTED': return 'bg-red-100 text-red-800 border border-red-200';
    // FIX: Changed to match the actual API status 'PENDING_REVIEW'
    case 'PENDING_REVIEW': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    default: return 'bg-gray-100 text-gray-800 border border-gray-200';
  }
};

const getStatusDotClass = (status) => {
  switch (status) {
    case 'COMPLETED': return 'bg-green-500';
    case 'AWAITING_PAYMENT': return 'bg-teal-500';
    case 'REJECTED': return 'bg-red-500';
    // FIX: Changed to match the actual API status 'PENDING_REVIEW'
    case 'PENDING_REVIEW': return 'bg-yellow-500';
    default: return 'bg-gray-500';
  }
};

const getStatusDisplay = (renewal) => {
    return renewal.renewal_status_display || renewal.renewal_status;
};

// --- MODAL AND FORM LOGIC ---
const openDetailsModal = (renewal) => {
  selectedRenewal.value = renewal;
  reviewAction.value = null;
  approvalRemarks.value = '';
  rejectionReason.value = '';
  showDetailsModal.value = true;
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedRenewal.value = null;
};

const handleReviewSubmit = async (decision) => {
  if (!selectedRenewal.value) return;

  let payload;
  const renewalId = selectedRenewal.value.id;

  if (decision === 'APPROVE') {
    payload = {
      renewal_status: 'AWAITING_PAYMENT',
      officer_remarks: approvalRemarks.value.trim(),
    };
  } else if (decision === 'REJECT') {
    if (!rejectionReason.value.trim()) {
      toast.error('A reason is required to reject an application.');
      return;
    }
    payload = {
      renewal_status: 'REJECTED',
      officer_remarks: rejectionReason.value.trim(),
    };
  } else {
    return;
  }

  isSubmitting.value = true;
  try {
    await apiServices.patchEpcTeachingCenterRenewal(renewalId, payload);

    const successMessage = decision === 'APPROVE'
      ? 'Application has been approved and is now awaiting payment.'
      : 'Application has been rejected.';
    toast.success(successMessage);

    await fetchRenewalData();
    closeDetailsModal();
  } catch (error) {
    console.error('Error submitting review:', error);
    toast.error(error.response?.data?.detail || 'Failed to submit review.');
  } finally {
    isSubmitting.value = false;
  }
};

// --- API DATA FETCHING ---
const fetchRenewalData = async () => {
  isLoading.value = true;
  apiError.value = false;
  try {
    // This API call will fetch all renewals, which is what this dashboard needs
    const response = await apiServices.getEpcTeachingCenterRenewals();
    renewalApplications.value = response.data.results || [];
  } catch (error) {
    console.error('Error fetching renewal applications:', error);
    errorMessage.value = error.response?.data?.detail || 'An unexpected error occurred. Please try again.';
    apiError.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchRenewalData);
</script>