<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <div class="m mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Assessor Dashboard</h1>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Loading your dashboard statistics...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
        <p class="font-bold">Could not load dashboard</p>
        <p>{{ error }}</p>
      </div>

      <!-- Main Content -->
      <div v-else>
        <!-- STATISTIC CARDS -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon="ClipboardList" :value="totalAssignments" label="Total Assignments" color="blue" />
          <StatCard icon="ShieldQuestion" :value="pendingCOIsCount" label="Pending COI" color="yellow" />
          <StatCard icon="CheckCircle" :value="completedCOIsCount" label="COIs Submitted" color="green" />
          <StatCard icon="AlertTriangle" :value="conflictsDeclaredCount" label="Conflicts Declared" color="red" />
        </div>

        <!-- ACTIONABLE ITEMS LIST -->
        <div class="bg-white shadow-md rounded-lg">
          <div class="p-4 border-b">
            <h2 class="text-lg font-semibold text-gray-800">Pending Your Action</h2>
            <p class="text-sm text-gray-500">These applications are awaiting your Conflict of Interest declaration.</p>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <tbody class="divide-y divide-gray-200">
                <tr v-if="pendingCOIList.length === 0">
                  <td class="px-6 py-8 text-center text-gray-500">
                    You have no pending actions. Great work!
                  </td>
                </tr>
                <tr v-for="item in pendingCOIList" :key="item.id">
                  <td class="px-6 py-4">
                    <p class="font-medium text-gray-900">{{ item.application_details.institute_profile_details.name }}</p>
                    <p class="text-sm text-gray-500">ID: {{ item.application_details.application_uid.slice(0, 8) }}</p>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button @click="handleDeclareCoi(item)" class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 inline-flex items-center">
                      <Edit class="w-4 h-4 mr-2" />
                      Declare COI
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '@/services/services'; // Adjust path if needed
import StatCard from '../admin/StatCard.vue';
import {
  ClipboardList,
  ShieldQuestion,
  CheckCircle,
  AlertTriangle,
  Edit
} from 'lucide-vue-next';

// --- State Management ---
const loading = ref(true);
const error = ref(null);
const allAssignments = ref([]);
const router = useRouter();

// --- Data Fetching ---
onMounted(async () => {
  try {
    // This uses your existing API service function
    const response = await apiService.getApplicationAssessorCOIs();
    allAssignments.value = response.data.results || response.data || [];
  } catch (err) {
    console.error("Failed to fetch assessor data:", err);
    error.value = "An error occurred while loading your data. Please refresh the page.";
  } finally {
    loading.value = false;
  }
});

// --- Computed Properties for Statistics ---
// These automatically update when `allAssignments` changes.
const totalAssignments = computed(() => allAssignments.value.length);

const pendingCOIList = computed(() =>
  allAssignments.value.filter(item => item.assessor_has_coi === null)
);

const pendingCOIsCount = computed(() => pendingCOIList.value.length);

const completedCOIsCount = computed(() =>
  allAssignments.value.filter(item => item.assessor_has_coi !== null).length
);

const conflictsDeclaredCount = computed(() =>
  allAssignments.value.filter(item => item.assessor_has_coi === true).length
);


// --- Methods ---
const handleDeclareCoi = (item) => {

  router.push('/admin/assessor/accreditation/coi_declaration');
};
</script>