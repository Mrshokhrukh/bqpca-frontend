<template>
  <div
    v-if="isVisible && application"
    class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 modal-view"
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
      <div class="p-6 space-y-6">
        <!-- Institute Information -->
        <div>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Institution Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium text-gray-500">Institute</p>
              <p class="text-gray-800">{{ application.institute_details?.name_of_institution || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Teaching Center</p>
              <p class="text-gray-800">{{ teachingCenterName || 'N/A' }}</p>
            </div>
          </div>
        </div>
        <!-- Program Information -->
        <div>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Program Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm font-medium text-gray-500">Program Category</p>
              <p class="text-gray-800">
                {{ application.program_master?.program_name || 'N/A' }}
                <span v-if="application.program_master?.duration_years">
                  ({{ application.program_master.duration_years }} years)
                </span>
              </p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Specific Program Title</p>
              <p class="text-gray-800">{{ application.specific_program_title || 'N/A' }}</p>
            </div>
            <div v-if="application.program_master?.description">
              <p class="text-sm font-medium text-gray-500">Description</p>
              <p class="text-gray-800">{{ application.program_master.description }}</p>
            </div>
          </div>
        </div>
        <!-- Documents -->
        <div>
  <h3 class="text-xl font-semibold text-gray-700 mb-2">Documents</h3>
  <div class="space-y-4">
    <div>
      <p class="text-sm font-medium text-gray-500">Curriculum Validation Letter</p>
      <a
        v-if="application.curriculum_validation_letter && typeof application.curriculum_validation_letter === 'string'"
        :href="application.curriculum_validation_letter"
        target="_blank"
        class="text-blue-600 hover:underline"
      >
        View Document
      </a>
      <p
        v-else-if="application.curriculum_validation_letter instanceof File"
        class="text-gray-600"
      >
        New file selected: {{ application.curriculum_validation_letter.name }}
      </p>
      <p
        v-else
        class="text-gray-600"
      >
        No document uploaded
      </p>
      <input
        v-if="application.status === 'Pending'"
        type="file"
        @change="updateCurriculumValidationLetter"
        accept=".pdf"
        class="mt-2"
      />
    </div>
    <div>
      <p class="text-sm font-medium text-gray-500">Curriculum Document</p>
      <a
        v-if="application.curriculum_document && typeof application.curriculum_document === 'string'"
        :href="application.curriculum_document"
        target="_blank"
        class="text-blue-600 hover:underline"
      >
        View Document
      </a>
      <p
        v-else-if="application.curriculum_document instanceof File"
        class="text-gray-600"
      >
        New file selected: {{ application.curriculum_document.name }}
      </p>
      <p
        v-else
        class="text-gray-600"
      >
        No document uploaded
      </p>
      <input
        v-if="application.status === 'Pending'"
        type="file"
        @change="updateCurriculumDocument"
        accept=".pdf"
        class="mt-2"
      />
    </div>
  </div>
</div>
        <!-- Application Info -->
        <div>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Application Info</h3>
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
            <div>
              <p class="text-sm font-medium text-gray-500">Submission Date</p>
              <p class="text-gray-800">{{ formatDate(application.created_at) }}</p>
            </div>
            <div v-if="application.status_remarks">
              <p class="text-sm font-medium text-gray-500">Status Remarks</p>
              <p class="text-gray-800 bg-gray-50 p-2 rounded">{{ application.status_remarks }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="p-6 border-t border-gray-200 flex justify-end space-x-3">
        <button
          v-if="application.status === 'Pending'"
          @click="emit('approve', localApplication)"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Approve
        </button>
        <button
          v-if="application.status === 'Pending'"
          @click="emit('reject', localApplication)"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Reject
        </button>
        <button
          @click="emit('delete', localApplication)"
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Delete
        </button>
        <button
          @click="closeModal"
          class="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  isVisible: { type: Boolean, required: true },
  application: { type: Object, required: true },
  teachingCenterName: { type: String, default: null },
});

const emit = defineEmits(['close', 'approve', 'reject', 'delete']);
const localApplication = ref({ ...props.application });

const updateCurriculumValidationLetter = (event) => {
  localApplication.value.curriculum_validation_letter = event.target.files[0] || null;
};

const updateCurriculumDocument = (event) => {
  localApplication.value.curriculum_document = event.target.files[0] || null;
};

const closeModal = () => {
  console.log('EducationProgramDetailsModal close called');
  emit('close');
};

const formatDate = (dateString) => {
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
