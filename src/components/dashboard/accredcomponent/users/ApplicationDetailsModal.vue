<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white p-6 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4 border-b pb-3">
        <h2 class="text-2xl font-bold text-gray-800">Application Details</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-800">&times;</button>
      </div>

      <div v-if="application" class="space-y-6">
        <!-- Application Overview -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h3 class="font-semibold text-lg mb-2">Overview</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-gray-500">Application ID</p>
              <p class="font-medium text-gray-900">{{ application.application_uid ? application.application_uid.substring(0, 8) : 'N/A' }}</p>
            </div>
            <div>
              <p class="text-gray-500">Status</p>
              <p class="font-medium text-gray-900">
                <span :class="getStatusClass(application.status)" class="px-2 py-1 rounded-full text-xs">
                  {{ application.status_display || 'N/A' }}
                </span>
              </p>
            </div>
            <div>
              <p class="text-gray-500">Institute</p>
              <p class="font-medium text-gray-900">{{ application.institute_profile_details?.name || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-gray-500">Submitted On</p>
              <p class="font-medium text-gray-900">{{ formatDate(application.date_initial_app_submitted_to_heqc || application.created_at) }}</p>
            </div>
          </div>
        </div>

        <!-- Courses -->
        <div>
          <h3 class="font-semibold text-lg mb-2">Courses Submitted</h3>
          <ul v-if="application.application_courses && application.application_courses.length" class="space-y-2">
            <li v-for="course in application.application_courses" :key="course.id" class="bg-white border p-3 rounded-md">
              <p class="font-medium">{{ course.course_programme_title }}</p>
              <p class="text-sm text-gray-600">Level: {{ course.level_as_per_bqf }} | Awarding Body: {{ course.awarding_body || 'N/A' }}</p>
            </li>
          </ul>
          <p v-else class="text-sm text-gray-500">No courses were submitted with this application.</p>
        </div>

        <!-- Documents -->
        <div>
          <h3 class="font-semibold text-lg mb-2">Documents Submitted</h3>
          <ul v-if="application.application_documents && application.application_documents.length" class="space-y-2">
            <li v-for="doc in application.application_documents" :key="doc.id" class="bg-white border p-3 rounded-md flex justify-between items-center">
              <div>
                <p class="font-medium">{{ doc.document_type_details?.name || 'Document' }}</p>
                <p class="text-sm text-gray-500">{{ doc.description || 'No description' }}</p>
              </div>
              <a :href="doc.document_file" target="_blank" class="text-blue-600 hover:underline text-sm">View Document</a>
            </li>
          </ul>
          <p v-else class="text-sm text-gray-500">No documents were submitted with this application.</p>
        </div>

      </div>
      <div v-else class="text-center py-10">
        <p>No application data to display.</p>
      </div>

      <div class="mt-6 pt-4 border-t text-right">
        <button @click="$emit('close')" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  isOpen: Boolean,
  application: Object,
});

defineEmits(['close']);

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const getStatusClass = (statusKey) => {
    const mapping = {
        'draft_initial': 'bg-gray-200 text-gray-800',
        'pending_payment': 'bg-yellow-100 text-yellow-800',
        'initial_app_submitted_heqc_review': 'bg-blue-100 text-blue-800',
        'initial_app_rejected': 'bg-red-100 text-red-800',
        'initial_app_approved_awaiting_isar': 'bg-green-100 text-green-800',
        'isar_submitted_heqc_review': 'bg-indigo-100 text-indigo-800',
        'approved_accredited': 'bg-green-200 text-green-900 font-bold',
        'rejected_not_accredited': 'bg-red-200 text-red-900 font-bold',
    };
    return mapping[statusKey] || 'bg-gray-100 text-gray-800';
};
</script>

<style scoped>
/* Minimal styles, relying on Tailwind */
</style>