<template>
  <div
    v-if="isVisible && application"
    class="modal-view fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 class="text-2xl font-bold text-gray-900">Application Details</h2>
        <button
          @click="closeModal"
          class="text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>
      </div>
      <div class="p-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p class="text-sm font-medium text-gray-500">Application ID</p>
            <p class="text-gray-800">{{ application.id }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500">Status</p>
            <p class="text-gray-800">
              <span
                :class="{
                  'px-2 py-1 rounded-full text-xs font-medium': true,
                  'bg-blue-100 text-blue-800': application.status === 'Pending',
                  'bg-green-100 text-green-800': application.status === 'Approved',
                  'bg-red-100 text-red-800': application.status === 'Rejected'
                }"
              >
                {{ application.status || 'Unknown' }}
              </span>
            </p>
          </div>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Institute</p>
          <p class="text-gray-800">{{ application.institute?.name_of_institution || 'N/A' }}</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Specific Program Title</p>
          <p class="text-gray-800">{{ application.specific_program_title || 'N/A' }}</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Teaching Center</p>
          <p class="text-gray-800">{{ teachingCenterNameProp || 'N/A' }}</p>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Submission Date</p>
          <p class="text-gray-800">{{ formatDateForView(application.created_at) }}</p>
        </div>
        <div v-if="application.curriculum_validation_letter">
          <p class="text-sm font-medium text-gray-500">Curriculum Validation Letter</p>
          <a :href="application.curriculum_validation_letter" target="_blank" class="text-blue-600 hover:underline">View Document</a>
        </div>
        <div v-if="application.curriculum_document">
          <p class="text-sm font-medium text-gray-500">Curriculum Document</p>
          <a :href="application.curriculum_document" target="_blank" class="text-blue-600 hover:underline">View Document</a>
        </div>
        <div v-if="application.status_remarks">
          <p class="text-sm font-medium text-gray-500">Status Remarks</p>
          <p class="text-gray-800 bg-gray-50 p-2 rounded">{{ application.status_remarks }}</p>
        </div>
      </div>
      <div class="p-6 border-t border-gray-200 text-right">
        <button
          @click="closeModal"
          class="px-6 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md font-medium hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

 defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  application: {
    type: Object,
    required: true,
  },
  teachingCenterNameProp: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['close']);

const closeModal = () => {
  console.log('ViewApplicationModal close called');
  emit('close');
};

const formatDateForView = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
</script>

<style scoped>
.modal-view {
  z-index: 60 !important;
}
</style>