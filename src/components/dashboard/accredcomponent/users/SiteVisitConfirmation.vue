<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="mx-auto p-6">
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-t-xl p-8 mb-6">
          <h2 class="text-3xl font-bold text-gray-900 text-center">Site Visit Confirmation</h2>
          <p class="text-gray-600 text-center max-w-2xl mx-auto mt-2">
            Please review the details of the upcoming physical verification visit and confirm your availability or request a reschedule.
          </p>
        </div>

        <div class="p-8">
          <div v-if="loading" class="text-center text-gray-600 py-10">
            <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="mt-4">Loading your site visit details...</p>
          </div>

          <div v-else-if="error" class="bg-red-50 p-4 rounded-lg text-center">
            <p class="text-red-700 font-semibold">An Error Occurred</p>
            <p class="text-red-600 mt-1">{{ error }}</p>
          </div>

          <div v-else-if="siteVisitDetails">
            <!-- NEW: Message for when HEQC proposes a new schedule -->
            <div v-if="isNewProposal" class="p-4 mb-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <h4 class="font-bold text-blue-800">New Schedule Proposed by HEQC</h4>
              <p class="text-blue-700 mt-1">
                HEQC has reviewed your request and proposed new dates for the site visit. Please review the updated schedule below and confirm your availability.
              </p>
            </div>

            <div class="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h3 class="text-xl font-semibold text-gray-800">Visit for: {{ application.institute_profile_details.name }}</h3>
              <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                <div>
                  <p class="text-sm font-medium text-gray-500">Start Date & Time</p>
                  <p class="font-semibold">{{ formatDateTime(siteVisitDetails.start_datetime) }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">End Date & Time</p>
                  <p class="font-semibold">{{ formatDateTime(siteVisitDetails.end_datetime) }}</p>
                </div>
                <div class="md:col-span-2">
                  <p class="text-sm font-medium text-gray-500">Agenda / Remarks from HEQC</p>
                  <p class="whitespace-pre-wrap">{{ siteVisitDetails.remarks_heqc_agenda || 'No specific remarks provided.' }}</p>
                </div>
              </div>
            </div>

            <!-- UPDATED: This message now only shows when a final action has been taken on the CURRENT schedule -->
            <div v-if="confirmationMade" class="mt-8 border-t pt-8 text-center text-lg">
              <p v-if="visitConfirmed" class="font-semibold text-green-700">
                Thank you! You have successfully confirmed the site visit.
              </p>
              <p v-else-if="rescheduleRequested" class="font-semibold text-yellow-800">
                Your reschedule request has been submitted. HEQC will review your request and may contact you for further details.
              </p>
              <p class="text-sm text-gray-500 mt-2">No further action is required at this time.</p>
            </div>
          </div>

          <div v-else class="text-center text-gray-500 py-10">
            <p class="text-xl">No site visit is currently scheduled for your active application.</p>
            <p class="mt-2">Please check back later or contact HEQC for more information.</p>
          </div>
        </div>

        <!-- UPDATED: This entire block is now conditional on `confirmationMade` being false -->
        <div v-if="siteVisitDetails && !confirmationMade" class="p-8 border-t bg-gray-50 rounded-b-xl">
          <div v-if="showRescheduleForm">
            <label for="rescheduleReason" class="block text-sm font-medium text-gray-700">
              Reason for Reschedule Request (Required):
            </label>
            <textarea
              id="rescheduleReason"
              v-model="rescheduleReason"
              rows="4"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              placeholder="Please provide a clear reason for requesting a new date..."
            ></textarea>
            <div class="flex justify-end items-center mt-4 gap-4">
               <button
                @click="showRescheduleForm = false"
                :disabled="isProcessing"
                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                @click="submitRescheduleRequest"
                :disabled="!rescheduleReason.trim() || isProcessing"
                class="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:bg-yellow-300 disabled:cursor-not-allowed"
              >
                {{ isProcessing ? 'Submitting...' : 'Submit Request' }}
              </button>
            </div>
          </div>

          <div v-else class="flex justify-end gap-4">
            <button
              @click="showRescheduleForm = true"
              :disabled="isProcessing"
              class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Request Reschedule
            </button>
            <button
              @click="confirmVisit"
              :disabled="isProcessing"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {{ isProcessing ? 'Confirming...' : 'Confirm Visit' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import apiService from '@/services/services';

const application = ref(null);
const loading = ref(true);
const error = ref(null);
const isProcessing = ref(false);
const showRescheduleForm = ref(false);
const rescheduleReason = ref('');
const lastActionTimestamp = ref(null);

const siteVisitDetails = computed(() => {
  return application.value?.site_visits?.[0] || null;
});

// NEW: This computed property is the key to detecting new proposals from HEQC
const isNewProposal = computed(() => {
  if (!siteVisitDetails.value || !lastActionTimestamp.value) {
    // If we've never acted, it's not a "new" proposal, it's the first one.
    return false;
  }
  // A new proposal exists if the visit was updated *after* our last action.
  return new Date(siteVisitDetails.value.updated_at) > new Date(lastActionTimestamp.value);
});

// UPDATED: Now depends on `isNewProposal`
const visitConfirmed = computed(() => {
  if (!siteVisitDetails.value) return false;
  return siteVisitDetails.value.is_confirmed_by_institute === true && !isNewProposal.value;
});

// UPDATED: Now depends on `isNewProposal`
const rescheduleRequested = computed(() => {
  if (!siteVisitDetails.value) return false;
  return !!siteVisitDetails.value.institute_confirmation_remarks &&
         siteVisitDetails.value.is_confirmed_by_institute !== true &&
         !isNewProposal.value;
});

// UPDATED: A confirmation is only "made" for the current set of dates
const confirmationMade = computed(() => {
  return visitConfirmed.value || rescheduleRequested.value;
});

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

const fetchData = async () => {
  loading.value = true;
  error.value = null;
  application.value = null;
  try {
    const response = await apiService.getAccreditationApplications({
      status__in: 'site_visit_scheduled,site_visit_confirmed'
    });
    const apps = response.data.results || response.data;
    if (apps && apps.length > 0) {
      const appWithVisit = apps.find(app => app.site_visits && app.site_visits.length > 0);
      if (appWithVisit) {
        application.value = appWithVisit;
        const visitId = appWithVisit.site_visits[0].id;
        // Load the timestamp of our last action from local storage
        lastActionTimestamp.value = localStorage.getItem(`siteVisitActionTimestamp_${visitId}`);
      }
    }
  } catch (err) {
    console.error("Failed to fetch site visit details:", err);
    error.value = "Could not load site visit information. Please try again later or contact support.";
  } finally {
    loading.value = false;
  }
};

// This function now correctly saves the timestamp of the action
const handleConfirmation = async (isReschedule, reason = '') => {
  if (!siteVisitDetails.value) return;
  if (isReschedule && !reason.trim()) {
    alert('Please provide a reason for the reschedule request.');
    return;
  }

  isProcessing.value = true;
  const formData = new FormData();
  formData.append('reschedule_request', isReschedule ? 'true' : 'false');
  formData.append('institute_confirmation_remarks', isReschedule ? `Reschedule requested: ${reason}` : 'Confirmed by institute via dashboard.');

  try {
    const response = await apiService.confirmApplicationSiteVisit(siteVisitDetails.value.id, formData);

    const updatedVisit = response.data.site_visit || response.data;

    // Update the local data to reflect the change immediately
    if (application.value && application.value.site_visits.length > 0) {
        application.value.site_visits[0] = updatedVisit;
    }

    // Save the timestamp of this action to localStorage
    const newTimestamp = updatedVisit.updated_at;
    const visitId = updatedVisit.id;
    localStorage.setItem(`siteVisitActionTimestamp_${visitId}`, newTimestamp);
    lastActionTimestamp.value = newTimestamp;

    if (isReschedule) {
      rescheduleReason.value = '';
      showRescheduleForm.value = false;
    }
  } catch (err) {
    console.error('Error during confirmation:', err);
    alert(err.response?.data?.detail || 'An error occurred. Please try again.');
  } finally {
    isProcessing.value = false;
  }
};

const confirmVisit = () => {
  handleConfirmation(false);
};

const submitRescheduleRequest = () => {
  handleConfirmation(true, rescheduleReason.value);
};

onMounted(() => {
  fetchData();
});
</script>