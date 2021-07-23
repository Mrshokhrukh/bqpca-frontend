<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" @click.self="closeModal">
    <div class="bg-white rounded-lg shadow-2xl max-w-3xl w-full mx-4 my-8 overflow-hidden">
      <div class="flex justify-between items-center p-5 border-b bg-gray-50">
        <h2 class="text-xl font-bold text-gray-800">Appeal Details</h2>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div v-if="appeal" class="p-6 max-h-[80vh] overflow-y-auto">
        <!-- Main Application Info -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6 pb-6 border-b">
          <div>
            <p class="text-sm font-medium text-gray-500">Application Ref. No</p>
            <p class="mt-1 text-base font-semibold text-gray-900">{{ appeal.application_reference_no }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Institute Name</p>
            <p class="mt-1 text-base text-gray-900">{{ appeal.application_details?.institute_profile_details?.name || 'N/A' }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Date Submitted</p>
            <p class="mt-1 text-base text-gray-900">{{ new Date(appeal.created_at).toLocaleString() }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Current Status</p>
            <p class="mt-1 text-base text-gray-900">
              <span :class="getStatusClass(appeal.status_appeal)" class="px-3 py-1 text-sm font-semibold rounded-full">
                {{ appeal.status_appeal_display || appeal.status_appeal }}
              </span>
            </p>
          </div>
        </div>

        <!-- NEW: Section to display the final decision -->
        <div v-if="appeal.status_appeal === 'approved' || appeal.status_appeal === 'rejected'" class="mb-6 pb-6 border-b bg-gray-50 p-4 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Final Decision by BAC</h3>
          <div class="grid grid-cols-1 gap-4">
            <div>
              <p class="text-sm font-medium text-gray-500">Outcome</p>
              <p class="mt-1 text-base font-bold" :class="{ 'text-green-600': appeal.status_appeal === 'approved', 'text-red-600': appeal.status_appeal === 'rejected' }">
                {{ appeal.status_appeal === 'approved' ? 'Appeal Approved' : 'Appeal Rejected' }}
              </p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">BAC Remarks</p>
              <!-- The decision_details_bac_appeal will now be displayed here -->
              <p class="mt-1 text-sm text-gray-700 whitespace-pre-wrap bg-white p-3 border rounded-md">{{ appeal.decision_details_bac_appeal || 'No specific remarks were provided.' }}</p>
            </div>
          </div>
        </div>

        <!-- Appeal Grounds -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Grounds for Appeal</h3>
          <div class="space-y-4">
            <div>
              <p class="text-sm font-medium text-gray-500">Reason Category</p>
              <p class="mt-1 text-base text-gray-900">{{ appeal.appeal_reason_display }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Detailed Justification</p>
              <p class="mt-1 text-sm text-gray-700 whitespace-pre-wrap">{{ appeal.detailed_reason_of_appeal_text }}</p>
            </div>
          </div>
        </div>

        <!-- Supporting Documents -->
        <div v-if="appeal.appeal_supporting_documents && appeal.appeal_supporting_documents.length > 0">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Supporting Documents</h3>
          <ul class="divide-y divide-gray-200 border rounded-md">
            <li v-for="doc in appeal.appeal_supporting_documents" :key="doc.id" class="px-4 py-3 flex items-center justify-between">
              <span class="text-sm text-gray-800">{{ doc.description || 'Supporting Document' }}</span>
              <a :href="doc.document_file" target="_blank" rel="noopener noreferrer" class="text-sm font-semibold text-blue-600 hover:underline">
                View File
              </a>
            </li>
          </ul>
        </div>

      </div>
       <div class="p-4 bg-gray-50 border-t flex justify-end">
        <button @click="closeModal" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  },
  appeal: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};

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
</script>