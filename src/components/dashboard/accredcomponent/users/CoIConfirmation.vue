<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-3xl mx-auto p-6">
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-t-xl p-8 mb-6">
          <h2 class="text-3xl font-bold text-gray-900 text-center">Conflict of Interest Confirmation</h2>
          <p class="text-gray-600 text-center max-w-2xl mx-auto">Review the assigned assessors and confirm the absence
            of
            any conflicts of interest.</p>
        </div>

        <!-- Assessors List -->
        <div class="p-8">
          <div v-if="loading" class="text-center text-gray-600 py-4">Loading assessors...</div>
          <div v-else-if="assessors.length > 0">
            <div v-for="assessor in assessors" :key="assessor.id" class="mb-6 p-4 border rounded-lg shadow-sm">
              <h3 class="text-lg font-semibold text-gray-700">{{ assessor.name }}</h3>
              <p class="text-gray-500 mt-1">Affiliation: {{ assessor.affiliation }}</p>
              <p class="text-gray-500 mt-1">Specialization: {{ assessor.specialization }}</p>
            </div>
          </div>
          <div v-else class="text-center text-gray-600 py-4">No assessors assigned.</div>
        </div>

        <!-- Actions -->
        <div v-if="assessors.length > 0 && !coiDecisionMade" class="p-8 border-t">
          <div class="flex justify-end">
            <button @click="rejectCOI"
              class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors mr-4">
              Regret
            </button>
            <button @click="acceptCOI"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Accept
            </button>
          </div>
        </div>

        <!-- Rejection Reason -->
        <div v-if="showRejectReason" class="p-8 border-t">
          <label for="reason" class="block text-sm font-medium text-gray-700">Reason for Rejection:</label>
          <textarea id="reason" v-model="rejectReason" rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"></textarea>
          <div class="flex justify-end mt-4">
            <button @click="submitRejectionReason"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Submit Reason
            </button>
          </div>
        </div>

        <!-- Confirmation Message -->
        <div v-if="coiDecisionMade" class="p-8 border-t text-center text-gray-700">
          <p>COI Confirmation: {{ coiDecision }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const assessors = ref([]);
const loading = ref(true);
const showRejectReason = ref(false);
const rejectReason = ref('');
const coiDecision = ref(null);
const coiDecisionMade = ref(false);

const fetchAssessors = async () => {
  setTimeout(() => {
    assessors.value = [
      { id: 1, name: 'Dr. Alice Smith', affiliation: 'University A', specialization: 'Curriculum Development' },
      { id: 2, name: 'Prof. Bob Johnson', affiliation: 'Consulting Firm B', specialization: 'Quality Assurance' },
    ];
    loading.value = false;
  }, 500);
};

const acceptCOI = () => {
  console.log('COI Accepted');
  coiDecision.value = 'Accepted';
  coiDecisionMade.value = true;
};

const rejectCOI = () => {
  showRejectReason.value = true;
};

const submitRejectionReason = () => {
  console.log('COI Rejected. Reason:', rejectReason.value);
  coiDecision.value = 'Rejected';
  coiDecisionMade.value = true;
  showRejectReason.value = false;
};

onMounted(fetchAssessors);
</script>
