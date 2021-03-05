<template>
  <div class="max-w-3xl mx-auto p-6">
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-t-xl p-8 mb-6">
        <h2 class="text-3xl font-bold text-gray-900 text-center">Accreditation Result</h2>
        <p class="text-gray-600 text-center max-w-2xl mx-auto">Review the accreditation decision for your institution.
        </p>
      </div>

      <div class="p-8">
        <div v-if="loading" class="text-center text-gray-600 py-4">Loading result...</div>

        <div v-else-if="result">
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-700">Institution Details</h3>
            <p class="text-gray-500 mt-1">Name: {{ result.institutionName }}</p>
            <p class="text-gray-500 mt-1">Address: {{ result.institutionAddress }}</p>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-700">Accreditation Decision</h3>
            <p class="text-gray-500 mt-1">Decision:
              <span :class="[
          result.decision === 'Accredited' ? 'text-green-600' : 'text-red-600',
          'font-semibold',
        ]">{{ result.decision }}</span>
            </p>
            <p v-if="result.grade" class="text-gray-500 mt-1">Grade: {{ result.grade }}</p>
            <p v-if="result.validity" class="text-gray-500 mt-1">Validity: {{ formatDate(result.validity) }}</p>
            <p v-if="result.reason" class="text-gray-500 mt-1">Reason for Non-Accreditation: {{ result.reason }}</p>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-700">Assessors Report</h3>
            <a :href="result.reportUrl" target="_blank" rel="noopener noreferrer"
              class="text-blue-600 hover:underline">View Assessors Report</a>
          </div>

          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-700">Accreditation Certificate</h3>
            <a v-if="result.decision === 'Accredited'" :href="result.certificateUrl" target="_blank"
              rel="noopener noreferrer"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg inline-block transition-colors">
              Download Certificate
            </a>
            <p v-else class="text-gray-500 mt-1">Certificate not available (Institution not accredited).</p>
          </div>

          <div class="flex justify-end">
            <button @click="handleAppeal"
              class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">Appeal</button>
          </div>
        </div>

        <div v-else class="text-center text-gray-600 py-4">Result not found.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const result = ref(null);
const loading = ref(true);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(); // Customize format as needed
};

const fetchResult = async () => {
  setTimeout(() => {
    result.value = {
      institutionName: 'Example Institution',
      institutionAddress: '123 Main St',
      decision: 'Accredited',
      grade: 'A',
      validity: '2024-12-31',
      reportUrl: '#',
      certificateUrl: '#',
      reason: null,
    };
    loading.value = false;
  }, 500);
};

const router = useRouter();
const route = useRoute();  // Get route information inside setup

const getDynamicPath = (newSegment) => {
  const basePath = route.path.split('/').slice(0, -1).join('/');
  return `${basePath}/${newSegment}`;
};

const handleAppeal = () => {
  const newPath = getDynamicPath('appeal');
  router.push(newPath);
};

onMounted(fetchResult);
</script>
