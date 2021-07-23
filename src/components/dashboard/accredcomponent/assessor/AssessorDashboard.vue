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
          <!-- Card 1: Total Assignments -->
          <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div class="flex items-center">
              <ClipboardList class="h-6 w-6 text-blue-500" />
              <span class="ml-3 text-sm font-medium text-gray-500">Total Assignments</span>
            </div>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ totalAssignments }}</p>
          </div>

          <!-- Card 2: Pending COI Declarations -->
          <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <div class="flex items-center">
              <ShieldQuestion class="h-6 w-6 text-yellow-500" />
              <span class="ml-3 text-sm font-medium text-gray-500">Pending COI</span>
            </div>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ pendingCOIsCount }}</p>
          </div>

          <!-- Card 3: Completed COI -->
          <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div class="flex items-center">
              <CheckCircle class="h-6 w-6 text-green-500" />
              <span class="ml-3 text-sm font-medium text-gray-500">COIs Submitted</span>
            </div>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ completedCOIsCount }}</p>
          </div>

          <!-- Card 4: Conflicts Declared -->
          <div class="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
            <div class="flex items-center">
              <AlertTriangle class="h-6 w-6 text-red-500" />
              <span class="ml-3 text-sm font-medium text-gray-500">Conflicts Declared</span>
            </div>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ conflictsDeclaredCount }}</p>
          </div>
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
                    <button @click="handleDeclareCoi(item)" class="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700">
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
import {
  ClipboardList,
  ShieldQuestion,
  CheckCircle,
  AlertTriangle,
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