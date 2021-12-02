<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
    <div class="mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200/80 mb-8 p-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Appeal Applications</h1>
            <p class="text-gray-600 mt-1 max-w-2xl">Review, manage, and finalize decisions on institution appeal requests.</p>
          </div>
        </div>
      </div>

      <!-- Table Container -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200/80 overflow-hidden">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800">Submitted Appeals</h3>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-20">
          <Loader2 class="animate-spin inline-block w-10 h-10 text-indigo-600" />
          <p class="text-gray-600 mt-4 font-medium">Loading appeals...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="!appeals.length" class="text-center py-20 px-6">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-semibold text-gray-900">No appeals found</h3>
          <p class="mt-1 text-sm text-gray-500">There are currently no appeal applications to review.</p>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
             <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Institution</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Appeal Details</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Submitted On</th>
                <th scope="col" class="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="appeal in appeals" :key="appeal.id" class="hover:bg-gray-50/70 transition-colors duration-150">
                <td class="px-6 py-5 whitespace-nowrap">
                  <div class="font-medium text-gray-900">{{ appeal.application_details?.institute_profile_details?.name }}</div>
                  <div class="text-sm text-gray-500 font-mono">{{ appeal.application_reference_no }}</div>
                </td>
                <td class="px-6 py-5">
                  <div class="text-sm text-gray-900 font-medium">{{ appeal.appeal_reason_display }}</div>
                  <div class="text-sm text-gray-500">Original Grade: <span class="font-semibold">{{ appeal.application_details?.final_grade_awarded_details?.rating_category_name || 'N/A' }}</span></div>
                </td>
                <td class="px-6 py-5 whitespace-nowrap">
                   <span :class="getStatusClass(appeal.status_appeal)" class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">{{ appeal.status_appeal_display }}</span>
                </td>
                <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-500">{{ formatDate(appeal.created_at) }}</td>
                <td class="px-6 py-5 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button @click="viewAppeal(appeal)" class="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100">
                    <Eye class="w-4 h-4" /> Review
                  </button>
                  <button @click="removeAppeal(appeal.id)" class="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-100">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Appeal Details & Decision Modal -->
    <div v-if="isModalOpen && selectedAppeal" class="fixed z-50 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen p-4 text-center">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>
        <div class="relative bg-white rounded-2xl shadow-xl transform transition-all my-8 max-w-5xl w-full max-h-[90vh] flex flex-col">

          <!-- Modal Header -->
          <div class="flex items-start justify-between p-5 border-b rounded-t bg-gray-50">
            <div>
              <h3 class="text-xl font-semibold text-gray-900">
                Appeal Review: {{ selectedAppeal.application_details?.institute_profile_details?.name }}
              </h3>
              <p class="text-sm text-gray-500 mt-1">Review the submission and make a final decision.</p>
            </div>
            <button @click="closeModal" class="p-2 text-gray-400 rounded-full hover:bg-gray-200 hover:text-gray-600 transition-colors">
                <X class="w-6 h-6" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 flex-grow overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Left Column: Appellant Submission -->
            <div class="space-y-6">
              <fieldset class="p-5 bg-gray-50 rounded-xl border">
                <legend class="text-base font-semibold text-gray-700 px-2">Appellant Details</legend>
                <dl class="mt-4 grid grid-cols-1 gap-y-3 text-sm">
                  <div class="flex justify-between">
                    <dt class="text-gray-500">Original Grade:</dt>
                    <dd class="font-bold text-lg text-red-600">{{ selectedAppeal.application_details?.final_grade_awarded_details?.rating_category_name || 'N/A' }}</dd>
                  </div>
                  <div class="flex justify-between">
                    <dt class="text-gray-500">Reason for Appeal:</dt>
                    <dd class="font-semibold text-gray-800">{{ selectedAppeal.appeal_reason_display }}</dd>
                  </div>
                </dl>
              </fieldset>

              <fieldset class="p-5 bg-gray-50 rounded-xl border">
                <legend class="text-base font-semibold text-gray-700 px-2">Justification</legend>
                <blockquote class="mt-4 text-sm text-gray-600 whitespace-pre-wrap border-l-4 border-gray-200 pl-4 italic">
                  {{ selectedAppeal.detailed_reason_of_appeal_text || 'No detailed justification provided.' }}
                </blockquote>
              </fieldset>

              <fieldset class="p-5 bg-gray-50 rounded-xl border">
                <legend class="text-base font-semibold text-gray-700 px-2">Supporting Documents</legend>
                <ul v-if="selectedAppeal.appeal_supporting_documents?.length > 0" class="mt-4 space-y-2">
                  <li v-for="doc in selectedAppeal.appeal_supporting_documents" :key="doc.id">
                    <a :href="doc.document_file" target="_blank" class="group flex items-center justify-between p-2 rounded-md bg-white hover:bg-indigo-50 border transition-colors">
                      <span class="text-indigo-600 font-medium text-sm flex items-center gap-2">
                          <FileText class="w-4 h-4" />
                          {{ doc.document_file.split('/').pop() }}
                      </span>
                      <svg class="w-5 h-5 text-gray-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    </a>
                  </li>
                </ul>
                <p v-else class="mt-4 text-sm text-gray-500 italic">No supporting documents were uploaded.</p>
              </fieldset>
            </div>

            <!-- Right Column: Officer's Action -->
            <div class="space-y-6">
              <fieldset class="p-5 bg-blue-50 rounded-xl border-2 border-blue-200 border-dashed">
                <legend class="text-base font-semibold text-gray-700 px-2">1. Appeal Decision</legend>
                <div class="mt-4 space-y-4">
                  <div>
                    <label for="appeal-decision" class="block text-sm font-medium text-gray-700 mb-1">Approve or Reject this Appeal?</label>
                    <select id="appeal-decision" v-model="selectedAppeal.decision_by_bac_on_appeal_final" class="block w-full text-base border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500" :disabled="isAppealDecided">
                      <option :value="null">-- Select Decision --</option>
                      <option v-for="option in decisionOptions" :key="option.id" :value="option.id">{{ option.decision_name }}</option>
                    </select>
                  </div>
                  <div>
                    <label for="appeal-remarks" class="block text-sm font-medium text-gray-700 mb-1">Justification for Decision <span class="text-red-500">*</span></label>
                    <textarea id="appeal-remarks" v-model="selectedAppeal.decision_details_bac_appeal" rows="4" class="block w-full sm:text-sm border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Provide a clear justification for the appeal decision. This is mandatory." :disabled="isAppealDecided"></textarea>
                  </div>
                </div>
              </fieldset>

              <fieldset v-if="isAppealApproved" class="p-5 bg-green-50 rounded-xl border-2 border-green-200 border-dashed animate-fade-in">
                <legend class="text-base font-semibold text-gray-700 px-2">2. Post-Appeal Outcome</legend>
                <p class="text-sm text-gray-600 my-4">The appeal is approved. Specify the new grade for the original accreditation application.</p>
                <div>
                  <label for="new-grade" class="block text-sm font-medium text-gray-700">New Final Grade Awarded</label>
                  <select id="new-grade" v-model="postAppeal.newGradeId" class="block w-full mt-1 border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500" :disabled="isAppealDecided">
                    <option :value="null" disabled>Select new grade...</option>
                    <option v-for="grade in ratingCategories" :key="grade.id" :value="grade.id">
                      {{ grade.rating_category_name }}
                      <span v-if="grade.is_accrediting_grade"> (Accredited for {{ grade.validity_years }} years)</span>
                      <span v-else> (Not Accredited)</span>
                    </option>
                  </select>
                </div>
              </fieldset>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="bg-gray-100 px-6 py-4 flex justify-end items-center space-x-3 border-t rounded-b-2xl">
            <button type="button" class="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors" @click="closeModal">
                {{ isAppealDecided ? 'Close' : 'Cancel' }}
            </button>
            <button v-if="!isAppealDecided" type="button" class="inline-flex items-center gap-2 px-5 py-2.5 text-white bg-indigo-600 rounded-lg text-sm font-semibold shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors" @click="saveDecision" :disabled="loading || !isDecisionValid">
              <Loader2 v-if="loading" class="animate-spin w-4 h-4" />
              <Save v-else class="w-4 h-4" />
              {{ loading ? 'Saving...' : 'Save & Finalize Decision' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal (Using Radix Vue AlertDialog) -->
    <!-- MOVED THIS INSIDE THE MAIN TEMPLATE DIV -->
    <AlertDialogRoot :open="showDeleteConfirmationModal" @update:open="showDeleteConfirmationModal = $event">
      <AlertDialogOverlay class="fixed inset-0 bg-black/50 z-40" />
      <AlertDialogContent
        class="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none z-50"
      >
        <AlertDialogTitle class="text-xl font-semibold text-gray-900 mb-2">
          Confirm Deletion
        </AlertDialogTitle>
        <AlertDialogDescription class="text-gray-600 mb-6">
          Are you sure you want to permanently delete this appeal? This action cannot be undone.
        </AlertDialogDescription>
        <div class="flex justify-end gap-4">
          <AlertDialogCancel
            class="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
            @click="showDeleteConfirmationModal = false"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
            @click="confirmDeleteAppeal"
          >
            Delete
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogRoot>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import apiService from '@/services/services';
import { Loader2, Eye, Trash2, X, Save, FileText } from 'lucide-vue-next';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogRoot,
  AlertDialogTitle,
} from 'radix-vue';

const toast = useToast();
const appeals = ref([]);
const decisionOptions = ref([]);
const ratingCategories = ref([]);
const loading = ref(false);
const isModalOpen = ref(false);
const selectedAppeal = ref(null);
const postAppeal = ref({ newGradeId: null });

// New refs for delete confirmation modal
const showDeleteConfirmationModal = ref(false);
const appealToDeleteId = ref(null);

const isAppealApproved = computed(() => {
  if (!selectedAppeal.value || !decisionOptions.value.length) return false;
  const selectedDecisionId = selectedAppeal.value.decision_by_bac_on_appeal_final;
  if (!selectedDecisionId) return false;

  const selectedOption = decisionOptions.value.find(opt => opt.id === selectedDecisionId);
  return selectedOption && selectedOption.decision_name?.toLowerCase().includes('approve');
});

const isDecisionValid = computed(() => {
    if (!selectedAppeal.value?.decision_by_bac_on_appeal_final) return false;
    if (isAppealApproved.value && !postAppeal.value.newGradeId) return false;
    return true;
});

const isAppealDecided = computed(() => {
  if (!selectedAppeal.value) return false;
  return ['approved', 'rejected'].includes(selectedAppeal.value.status_appeal);
});


const fetchInitialData = async () => {
  loading.value = true;
  try {
    const [appealsResponse, optionsResponse, gradesResponse] = await Promise.all([
      apiService.getAccreditationAppeals(),
      apiService.getMastersDecisions(),
      apiService.getMastersRatingCategories()
    ]);
    appeals.value = appealsResponse.data.results;
    decisionOptions.value = optionsResponse.data.results || optionsResponse.data;
    ratingCategories.value = gradesResponse.data.results || gradesResponse.data;
  } catch (error) {
    console.error('Error fetching initial data:', error);
    toast.error('Failed to load page data.');
  } finally {
    loading.value = false;
  }
};

const saveDecision = async () => {
  if (!selectedAppeal.value?.id || !isDecisionValid.value) return;

  const payload = {
    decision_by_bac_on_appeal_final: selectedAppeal.value.decision_by_bac_on_appeal_final,
    decision_details_bac_appeal: selectedAppeal.value.decision_details_bac_appeal,
  };

  if (isAppealApproved.value) {
    payload.new_application_grade_id = postAppeal.value.newGradeId;
  }

  loading.value = true;
  try {
    await apiService.patchApplicationAppeal(selectedAppeal.value.id, payload);

    closeModal();
    toast.success('Decision saved successfully! The original application has been updated.');
    await fetchInitialData();
  } catch (error)
  {
    console.error('Error saving decision:', error.response?.data);
    toast.error(`Failed to save decision. Server responded with: ${JSON.stringify(error.response?.data)}`);
  } finally {
    loading.value = false;
  }
};

const removeAppeal = async (id) => {
  appealToDeleteId.value = id;
  showDeleteConfirmationModal.value = true;
};

const confirmDeleteAppeal = async () => {
  if (!appealToDeleteId.value) return;

  loading.value = true;
  try {
    await apiService.deleteApplicationAppeal(appealToDeleteId.value);
    await fetchInitialData();
    toast.success('Appeal deleted successfully.');
  } catch (error) {
    console.error('Error deleting appeal:', error);
    toast.error('Could not delete the appeal.');
  } finally {
    loading.value = false;
    showDeleteConfirmationModal.value = false; // Close modal
    appealToDeleteId.value = null; // Clear ID
  }
};

const viewAppeal = (appeal) => {
  selectedAppeal.value = JSON.parse(JSON.stringify(appeal));
  postAppeal.value = { newGradeId: null };
  isModalOpen.value = true;
};

const closeModal = () => { isModalOpen.value = false; selectedAppeal.value = null; };

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-CA') : 'N/A';

const getStatusClass = (status) => {
  const classes = {
    submitted: 'bg-blue-100 text-blue-800',
    under_review_bac: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800',
    pending_payment: 'bg-orange-100 text-orange-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const getPaymentStatusClass = (isPaid) => {
  return isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
};

onMounted(fetchInitialData);
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>