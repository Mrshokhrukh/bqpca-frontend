<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="mx-auto px-4">
      <!-- Header and Table (Unchanged) -->
      <div class="bg-white rounded-xl shadow-sm mb-8 p-6 border border-gray-100">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Appeal Applications</h2>
          <p class="text-gray-500 mt-1">Manage and review institution appeal requests.</p>
        </div>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <h3 class="font-semibold text-gray-800">Applications Overview</h3>
        </div>
        <div v-if="loading" class="text-center py-10">
          <p class="text-gray-600">Loading appeals...</p>
        </div>
        <div v-else-if="!appeals.length" class="text-center py-10">
          <p class="text-gray-600 font-semibold">No appeals found.</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
             <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appeal Reason</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="appeal in appeals" :key="appeal.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-medium text-gray-900">{{ appeal.application_details?.institute_profile_details?.name }}</div>
                  <div class="text-sm text-gray-500">{{ appeal.application_reference_no }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ appeal.appeal_reason_display }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(appeal.created_at) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                   <span :class="getStatusClass(appeal.status_appeal)" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">{{ appeal.status_appeal_display }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button @click="viewAppeal(appeal)" class="text-indigo-600 hover:text-indigo-900 mr-3">View / Decide</button>
                  <button @click="removeAppeal(appeal.id)" class="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Appeal Details & Decision Modal -->
    <div v-if="isModalOpen && selectedAppeal" class="fixed z-50 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75" @click="closeModal"></div>
        <div class="inline-block bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
          <!-- Header -->
          <div class="bg-indigo-600 px-6 py-4 flex items-center justify-between">
            <h3 class="text-lg font-medium text-white">
              Appeal Review: {{ selectedAppeal.application_details?.institute_profile_details?.name }}
            </h3>
            <button @click="closeModal" class="text-white text-2xl leading-none">×</button>
          </div>
          <!-- Body -->
          <div class="px-6 py-4 max-h-[80vh] overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

            <!-- Left Column: Appellant Details (Unchanged) -->
            <div class="space-y-4">
               <h4 class="text-lg font-semibold text-gray-700 border-b pb-2">Appellant Submission</h4>
                <div class="p-4 bg-gray-50 rounded-lg">
                   <p class="text-xs text-gray-500">Institution Name</p>
                   <p class="font-medium text-gray-800">{{ selectedAppeal.application_details?.institute_profile_details?.name || 'N/A' }}</p>
                   <p class="text-xs text-gray-500 mt-2">Original Grade Awarded</p>
                   <p class="font-bold text-lg text-red-600">{{ selectedAppeal.application_details?.final_grade_awarded_details?.rating_category_name || 'N/A' }}</p>
                </div>
               <div class="p-4 bg-gray-50 rounded-lg">
                   <p class="text-xs text-gray-500">Reason for Appeal</p>
                   <p class="font-medium text-gray-800">{{ selectedAppeal.appeal_reason_display }}</p>
                   <p class="text-xs text-gray-500 mt-2">Detailed Justification</p>
                   <p class="text-sm text-gray-600 whitespace-pre-wrap">{{ selectedAppeal.detailed_reason_of_appeal_text || 'N/A' }}</p>
               </div>
               <div class="p-4 bg-gray-50 rounded-lg">
                    <p class="text-xs text-gray-500">Supporting Documents</p>
                    <ul v-if="selectedAppeal.appeal_supporting_documents?.length > 0" class="mt-1 space-y-1">
                      <li v-for="doc in selectedAppeal.appeal_supporting_documents" :key="doc.id">
                        <a :href="doc.document_file" target="_blank" class="text-indigo-600 hover:underline text-sm">{{ doc.document_file.split('/').pop() }}</a>
                      </li>
                    </ul>
                    <p v-else class="text-sm text-gray-500 italic">No supporting documents were uploaded.</p>
                </div>
            </div>

            <!-- Right Column: Officer Decision Panel (UPDATED) -->
            <div class="space-y-6">
              <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">1. Appeal Decision</h4>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Approve or Reject this Appeal?</label>
                  <select v-model="selectedAppeal.decision_by_bac_on_appeal_final" class="block w-full text-base border-gray-300 rounded-md">
                    <option :value="null">-- Select Decision --</option>
                    <option v-for="option in decisionOptions" :key="option.id" :value="option.id">{{ option.decision_name }}</option>
                  </select>
                </div>
                <div class="mt-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Appeal Decision Remarks</label>
                  <textarea v-model="selectedAppeal.decision_details_bac_appeal" rows="4" class="block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Provide a justification for the appeal decision. This is mandatory."></textarea>
                </div>
              </div>

              <!-- NEW SECTION: This appears only if the appeal is approved -->
              <div v-if="isAppealApproved" class="p-4 bg-green-50 rounded-lg border border-green-300 animate-fade-in">
                <h4 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">2. Post-Appeal Outcome</h4>
                <p class="text-sm text-gray-600 mb-4">The appeal is approved. Specify the new grade for the original accreditation application.</p>
                <div class="space-y-4">
                  <div>
                    <label for="new-grade" class="block text-sm font-medium text-gray-700">New Final Grade Awarded</label>
                    <select id="new-grade" v-model="postAppeal.newGradeId" class="block w-full mt-1 border-gray-300 rounded-md">
                      <option :value="null" disabled>Select new grade...</option>
                      <option v-for="grade in ratingCategories" :key="grade.id" :value="grade.id">
                        {{ grade.rating_category_name }}
                        <span v-if="grade.is_accrediting_grade"> (Accredited for {{ grade.validity_years }} years)</span>
                        <span v-else> (Not Accredited)</span>
                      </option>
                    </select>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <button type="button" class="px-4 py-2 border rounded-md" @click="closeModal">Cancel</button>
            <button type="button" class="px-4 py-2 text-white bg-indigo-600 rounded-md" @click="saveDecision" :disabled="loading || !isDecisionValid">
              {{ loading ? 'Saving...' : 'Save & Finalize Decision' }}
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

const appeals = ref([]);
const decisionOptions = ref([]);
const ratingCategories = ref([]);
const loading = ref(false);
const isModalOpen = ref(false);
const selectedAppeal = ref(null);
// Use a separate reactive object for the new post-appeal data
const postAppeal = ref({ newGradeId: null });

// Computed property to check if the "Approved" option is selected for the appeal
const isAppealApproved = computed(() => {
  if (!selectedAppeal.value || !decisionOptions.value.length) return false;
  const selectedDecisionId = selectedAppeal.value.decision_by_bac_on_appeal_final;
  if (!selectedDecisionId) return false;

  const selectedOption = decisionOptions.value.find(opt => opt.id === selectedDecisionId);
  return selectedOption && selectedOption.decision_name?.toLowerCase().includes('approve');
});

// Computed property to validate the form before saving
const isDecisionValid = computed(() => {
    if (!selectedAppeal.value?.decision_by_bac_on_appeal_final) return false;
    if (isAppealApproved.value && !postAppeal.value.newGradeId) return false;
    return true;
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
    alert('Failed to load page data.');
  } finally {
    loading.value = false;
  }
};

const saveDecision = async () => {
  if (!selectedAppeal.value?.id || !isDecisionValid.value) return;

  // Construct the payload for the PATCH request
  const payload = {
    decision_by_bac_on_appeal_final: selectedAppeal.value.decision_by_bac_on_appeal_final,
    decision_details_bac_appeal: selectedAppeal.value.decision_details_bac_appeal,
  };

  // If the appeal is approved, add the new grade ID to the payload
  if (isAppealApproved.value) {
    payload.new_application_grade_id = postAppeal.value.newGradeId;
  }

  loading.value = true;
  try {
    // The backend now handles updating both the appeal and the original application
    await apiService.patchApplicationAppeal(selectedAppeal.value.id, payload);

    closeModal();
    alert('Decision saved successfully! The original application has been updated.');
    await fetchInitialData(); // Refresh the list
  } catch (error) {
    console.error('Error saving decision:', error.response?.data);
    alert(`Failed to save decision. Server responded with: ${JSON.stringify(error.response?.data)}`);
  } finally {
    loading.value = false;
  }
};

const removeAppeal = async (id) => {
  if (confirm('Are you sure you want to permanently delete this appeal? This action cannot be undone.')) {
    loading.value = true;
    try {
        await apiService.deleteApplicationAppeal(id);
        await fetchInitialData();
    } catch(error) {
        console.error('Error deleting appeal:', error);
        alert('Could not delete the appeal.');
    } finally {
        loading.value = false;
    }
  }
};

const viewAppeal = (appeal) => {
  selectedAppeal.value = JSON.parse(JSON.stringify(appeal));
  // Reset the post-appeal state each time the modal is opened
  postAppeal.value = { newGradeId: null };
  isModalOpen.value = true;
};

const closeModal = () => { isModalOpen.value = false; selectedAppeal.value = null; };

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-CA') : 'N/A';
const getStatusClass = (s) => ({
    'submitted': 'bg-blue-100 text-blue-800',
    'decision_made': 'bg-green-100 text-green-800',
    'under_review_bac': 'bg-yellow-100 text-yellow-800',
}[s] || 'bg-gray-100 text-gray-800');

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