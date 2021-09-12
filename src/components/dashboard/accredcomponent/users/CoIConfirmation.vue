<template>
  <div class="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto">

      <!-- Page Header -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Conflict of Interest Declaration</h1>
        <p class="text-gray-600 max-w-3xl mx-auto">
          Please review the list of proposed assessors. For each person, select 'No Conflict' or 'Has Conflict'. You can submit your declarations once a decision has been made for every assessor.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12 bg-white shadow-lg rounded-lg">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading your assignments...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md">
        <h3 class="font-bold">Error</h3>
        <p>{{ error }}</p>
      </div>

      <!-- Main Interaction: Table for Decisions -->
      <div v-else-if="pendingRecords.length > 0 && !showFinalDeclaration">
        <div class="bg-white shadow-xl rounded-lg overflow-hidden">
          <div class="p-4 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Proposed Assessors for {{ instituteName }}</h3>
            <div class="mt-4 overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessor</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Decision</th>
                    <th scope="col" class="relative px-6 py-3">
                      <span class="sr-only">Details</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <template v-for="record in pendingRecords" :key="record.id">
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ record.assessor_details.name }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <fieldset class="space-y-2 sm:flex sm:items-center sm:space-y-0 sm:space-x-4">
                          <div class="flex items-center">
                            <input :id="`no-conflict-${record.id}`" :name="`conflict-status-${record.id}`" type="radio" value="no_conflict" @change="updateDecision(record.id, 'no_conflict')" class="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300">
                            <label :for="`no-conflict-${record.id}`" class="ml-2 block text-sm font-medium text-gray-700">No Conflict</label>
                          </div>
                          <div class="flex items-center">
                            <input :id="`has-conflict-${record.id}`" :name="`conflict-status-${record.id}`" type="radio" value="has_conflict" @change="updateDecision(record.id, 'has_conflict')" class="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300">
                            <label :for="`has-conflict-${record.id}`" class="ml-2 block text-sm font-medium text-gray-700">Has Conflict</label>
                          </div>
                        </fieldset>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button @click="openAssessorModal(record.assessor_details)" class="text-indigo-600 hover:text-indigo-900">View Details</button>
                      </td>
                    </tr>
                    <!-- Conditional row for remarks -->
                    <tr v-if="decisions[record.id] && decisions[record.id].decision === 'has_conflict'">
                      <td colspan="3" class="px-6 py-4 bg-red-50">
                        <label :for="`remarks-${record.id}`" class="block text-sm font-medium text-red-800">Reason for Declaring Conflict (Required)</label>
                        <textarea :id="`remarks-${record.id}`" v-model="decisions[record.id].remarks" rows="3" class="mt-1 shadow-sm block w-full focus:ring-red-500 focus:border-red-500 sm:text-sm border-gray-300 rounded-md" placeholder="Explain the nature of the affiliation or conflict."></textarea>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
          <div class="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
             <div class="flex justify-end">
                <button @click="handleSubmitDecisions" :disabled="!allDecisionsMade || isSubmitting" class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
                  {{ isSubmitting ? 'Processing...' : 'Submit All Declarations' }}
                </button>
             </div>
             <p v-if="!allDecisionsMade" class="text-xs text-gray-500 mt-2 text-right">Please make a decision for all assessors before submitting.</p>
          </div>
        </div>
      </div>

      <!-- Final Declaration "Annexure" View (only shown if no conflicts) -->
      <div v-else-if="showFinalDeclaration" class="bg-white shadow-2xl rounded-lg overflow-hidden animate-fade-in">
        <div class="px-8 py-6 bg-gray-50 border-b border-gray-200">
          <p class="text-right text-sm font-semibold text-gray-500">ANNEXURE I</p>
          <h2 class="text-2xl font-bold text-center text-gray-800">No Conflict-of-Interest Statement</h2>
          <p class="text-center text-sm text-gray-600 mt-1">A. By the Institution</p>
        </div>
        <div class="p-8">
          <h3 class="font-bold text-gray-800 mb-4">DECLARATION OF CONFLICT OF INTEREST</h3>
          <p class="text-gray-700 leading-relaxed">The institute, <strong class="text-gray-900">{{ instituteName }}</strong>, assures that the following assessors have no affiliation with our institution, directly or indirectly, in the immediate past one year:</p>
          <ol class="list-decimal list-inside mt-4 space-y-2 bg-gray-50 p-4 rounded-md border">
            <li v-for="record in approvedAssessors" :key="record.id" class="text-gray-800"><span class="font-semibold">{{ record.assessor_details.name }}</span></li>
          </ol>
          <p class="mt-6 text-gray-700 leading-relaxed">Further, the Institution will not appoint any of the members of the proposed team of assessors for any assignment in the institution for one year after the assessment of the Institution by the assessors.</p>
          <div class="mt-8 pt-6 border-t border-gray-300">
            <p class="text-sm font-medium text-gray-800">I hereby confirm that the above information is true to the best of my knowledge. In the event the above declaration is found to be incorrect,</p>
            <ul class="list-disc list-inside mt-2 space-y-1 text-gray-700 text-sm">
                <li>the accreditation of the Institution shall be suspended/canceled immediately and must be reassessed, and</li>
                <li>the Institution shall bear all the costs associated to the reassessment of accreditation</li>
                <li>I shall be liable for administrative/legal action under relevant laws, rules and regulations.</li>
            </ul>
          </div>
        </div>
        <div class="px-8 py-5 bg-gray-50 border-t border-gray-200 text-right">
            <button @click="handleFinalSignAndSubmit" :disabled="isSubmitting" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400">
                <svg v-if="!isSubmitting" class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
                {{ isSubmitting ? 'Submitting...' : 'Sign and Submit Declaration' }}
            </button>
        </div>
      </div>

      <!-- State: "All Done". Shows only if user HAD records and now none are pending. -->
      <div v-else-if="hasCompletedRecords" class="text-center py-12 bg-white shadow-lg rounded-lg">
        <svg class="mx-auto h-12 w-12 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">All Declarations Submitted</h3>
        <p class="mt-1 text-sm text-gray-500">You have responded to all assigned assessors. Thank you.</p>
      </div>

      <!-- State: "Awaiting Assignment". The default state if there's nothing to do. -->
      <div v-else class="text-center py-12 bg-white shadow-lg rounded-lg">
        <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">Awaiting Assessor Assignment</h3>
        <p class="mt-1 text-sm text-gray-500">There are currently no proposed assessors for you to review. Please check back later.</p>
      </div>

    </div>

    <!-- Assessor Details Modal -->
    <transition enter-active-class="transition-opacity duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="assessorDetailsModalOpen" class="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center p-4" @click.self="closeAssessorModal">
            <div class="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto transform transition-all" v-if="selectedAssessor">
                <!-- Modal Header -->
                <div class="flex items-start justify-between p-5 border-b rounded-t">
                    <h3 class="text-xl font-semibold text-gray-900">Assessor Details</h3>
                    <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" @click="closeAssessorModal">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="p-6">
                    <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div class="sm:col-span-2">
                            <dt class="text-sm font-medium text-gray-500">Full Name</dt>
                            <dd class="mt-1 text-lg font-bold text-gray-900">{{ selectedAssessor.name || 'N/A' }}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Email Address</dt>
                            <dd class="mt-1 text-sm text-gray-900">{{ selectedAssessor.email || 'N/A' }}</dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Contact Number</dt>
                            <dd class="mt-1 text-sm text-gray-900">{{ selectedAssessor.contact_number || 'N/A' }}</dd>
                        </div>
                        <div class="sm:col-span-2">
                            <dt class="text-sm font-medium text-gray-500">Qualification</dt>
                            <dd class="mt-1 text-sm text-gray-900">{{ selectedAssessor.qualification || 'N/A' }}</dd>
                        </div>
                        <div class="sm:col-span-2">
                            <dt class="text-sm font-medium text-gray-500">Relevant Experience / Specialization</dt>
                            <dd class="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{{ selectedAssessor.relevant_experience_specialization || 'N/A' }}</dd>
                        </div>
                        <div class="sm:col-span-2" v-if="selectedAssessor.cv_document_url">
                            <dt class="text-sm font-medium text-gray-500">Curriculum Vitae (CV)</dt>
                            <dd class="mt-1 text-sm">
                                <a :href="selectedAssessor.cv_document_url" target="_blank" rel="noopener noreferrer" class="font-medium text-blue-600 hover:text-blue-500 hover:underline">
                                    View/Download CV
                                    <svg class="w-4 h-4 inline-block ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>
                                </a>
                            </dd>
                        </div>
                    </dl>
                </div>

                <!-- Modal Footer -->
                <div class="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b">
                    <button @click="closeAssessorModal" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Close</button>
                </div>
            </div>
        </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import apiService from '@/services/services';

// --- Reactive State ---
const allCoiRecords = ref([]);
const loading = ref(true);
const error = ref(null);
const currentUser = ref(null);
const isSubmitting = ref(false);
const decisions = ref({});
const showFinalDeclaration = ref(false);
const assessorDetailsModalOpen = ref(false);
const selectedAssessor = ref(null);


const recordsForCurrentUser = computed(() => {
    if (!currentUser.value || !allCoiRecords.value) return [];
    return allCoiRecords.value.filter(record =>
        record.application_details?.institute_profile_details?.user_liaison_username === currentUser.value.username
    );
});

const pendingRecords = computed(() => {
    return recordsForCurrentUser.value.filter(record => record.status === 'pending_assessor');
});
const hasCompletedRecords = computed(() => {
    if (loading.value || !currentUser.value || !allCoiRecords.value) return false;
    return recordsForCurrentUser.value.length > 0 && pendingRecords.value.length === 0;
});


const instituteName = computed(() => {
    return pendingRecords.value[0]?.application_details?.institute_profile_details?.name || 'Your Institute';
});

const allDecisionsMade = computed(() => {
    if (pendingRecords.value.length === 0) return false;
    const allMade = pendingRecords.value.every(record => decisions.value[record.id] && decisions.value[record.id].decision);
    const conflictsValid = pendingRecords.value.every(record => {
        const decision = decisions.value[record.id];
        return !decision || decision.decision !== 'has_conflict' || (decision.remarks && decision.remarks.trim() !== '');
    });
    return allMade && conflictsValid;
});

const hasAnyConflict = computed(() => {
    return Object.values(decisions.value).some(d => d.decision === 'has_conflict');
});

const approvedAssessors = computed(() => {
    return pendingRecords.value.filter(record => decisions.value[record.id]?.decision === 'no_conflict');
});

// --- Lifecycle & API ---
onMounted(() => {
  const userString = localStorage.getItem('user');
  if (userString) {
    currentUser.value = JSON.parse(userString);
    fetchCoiRecords();
  } else {
    error.value = 'User information not found. Please log in again.';
    loading.value = false;
  }
});


const fetchCoiRecords = async () => {
  loading.value = true;
  error.value = null;
  decisions.value = {};
  showFinalDeclaration.value = false;
  try {
    const response = await apiService.getApplicationAssessorCOIs();
    allCoiRecords.value = response.data.results || [];
  } catch (err) {
    console.error("Fetch COI error:", err);
    error.value = 'Failed to load assignments. Please try again.';
  } finally {
    loading.value = false;
  }
};

// --- UI Interaction ---
const updateDecision = (recordId, decision) => {
    if (!decisions.value[recordId]) {
        decisions.value[recordId] = { decision: '', remarks: '' };
    }
    decisions.value[recordId].decision = decision;
    if (decision === 'no_conflict') {
        decisions.value[recordId].remarks = '';
    }
};

const handleSubmitDecisions = () => {
    if (!allDecisionsMade.value) {
        alert("Please make a decision for all assessors and provide remarks for any conflicts.");
        return;
    }
    isSubmitting.value = true;
    if (hasAnyConflict.value) {
        submitAllDecisionsToServer();
    } else {
        showFinalDeclaration.value = true;
        isSubmitting.value = false;
    }
};

const handleFinalSignAndSubmit = () => {
    isSubmitting.value = true;
    submitAllDecisionsToServer();
};

// --- Server Communication ---
const submitAllDecisionsToServer = async () => {
    const promises = [];
    for (const record of pendingRecords.value) {
        const decisionInfo = decisions.value[record.id];
        const formData = new FormData();

        if (decisionInfo.decision === 'no_conflict') {
            formData.append('institute_agrees_with_assessor', 'true');
            formData.append('institute_rejection_remarks', 'No conflict declared by institute.');
        } else {
            formData.append('institute_agrees_with_assessor', 'false');
            formData.append('institute_rejection_remarks', decisionInfo.remarks);
        }
        promises.push(apiService.respondToCOI(record.id, formData));
    }

    try {
        await Promise.all(promises);
        if (hasAnyConflict.value) {
            alert("Your conflict declarations have been submitted. The administration will be notified to assign new assessors.");
        } else {
            alert("Declaration successfully signed and submitted!");
        }
        await fetchCoiRecords();
    } catch (err) {
        console.error("Submission error:", err);
        alert('An error occurred while submitting your declarations. Please try again.');
        showFinalDeclaration.value = false;
    } finally {
        isSubmitting.value = false;
    }
};

// --- Modal Handling ---
const openAssessorModal = (assessor) => {
    selectedAssessor.value = assessor;
    assessorDetailsModalOpen.value = true;
};
const closeAssessorModal = () => {
    assessorDetailsModalOpen.value = false;
    selectedAssessor.value = null;
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.whitespace-pre-wrap {
    white-space: pre-wrap;
}
</style>