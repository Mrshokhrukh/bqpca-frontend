<template>
  <div
    v-if="isVisible && application"
    class="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4 transition-opacity duration-300"
    @click.self="closeModal"
  >
    <div
      class="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-up"
    >
      <div class="flex justify-between items-center p-5 border-b border-gray-200">
        <div class="flex items-center space-x-4">
          <div class="bg-blue-100 rounded-full p-2.5">
            <svg
              class="w-6 h-6 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-gray-800">Application Details</h2>
        </div>
        <button
          @click="closeModal"
          class="p-1.5 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
        >
          <svg
            class="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 space-y-6 overflow-y-auto">
        <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Overview</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase">Application ID</p>
              <p class="text-sm text-gray-800 font-mono">{{ application.id }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase">Submission Date</p>
              <p class="text-sm text-gray-800">{{ formatDate(application.created_at) }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase">Status</p>
              <span
                class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="{
                  'bg-blue-100 text-blue-800': application.status === 'Pending',
                  'bg-green-100 text-green-800': application.status === 'Approved',
                  'bg-red-100 text-red-800': application.status === 'Rejected',
                }"
              >
                {{ application.status || 'Unknown' }}
              </span>
            </div>
            <div v-if="application.status_remarks" class="md:col-span-3">
              <p class="text-xs font-medium text-gray-500 uppercase">Status Remarks</p>
              <p
                class="text-sm text-gray-700 bg-yellow-50 border border-yellow-200 p-3 rounded-md mt-1"
              >
                {{ application.status_remarks }}
              </p>
            </div>
          </div>
        </div>

        <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
            Program & Institution
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase">Institute</p>
              <p class="text-sm font-semibold text-gray-800">
                {{ application.institute_details?.name_of_institution || 'N/A' }}
              </p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase">Teaching Center</p>
              <p class="text-sm text-gray-800">{{ teachingCenterName || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase">Program Category</p>
              <p class="text-sm text-gray-800">
                {{ application.program_master?.program_name || 'N/A' }}
                <span v-if="application.program_master?.duration_years" class="text-gray-500">
                  ({{ application.program_master.duration_years }} years)
                </span>
              </p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase">Specific Program Title</p>
              <p class="text-sm font-semibold text-gray-800">
                {{ application.specific_program_title || 'N/A' }}
              </p>
            </div>
          </div>
        </div>

        <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
            Submitted Documents
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600">Curriculum Validation Letter</p>
              <a
                v-if="
                  application.curriculum_validation_letter &&
                  typeof application.curriculum_validation_letter === 'string'
                "
                :href="application.curriculum_validation_letter"
                target="_blank"
                class="inline-flex items-center text-sm text-blue-600 hover:underline"
              >
                View Current Document
                <svg
                  class="w-4 h-4 ml-1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"
                  />
                  <path
                    d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"
                  />
                </svg>
              </a>
              <p v-else class="text-sm text-gray-500 italic">No document uploaded.</p>
              <div v-if="application.status && application.status.toLowerCase() === 'pending'">
                <label
                  for="validation-letter-upload"
                  class="cursor-pointer inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <span>{{ isValidationLetterAFile ? 'File Selected' : 'Upload New' }}</span>
                </label>
                <input
                  id="validation-letter-upload"
                  type="file"
                  @change="updateCurriculumValidationLetter"
                  accept=".pdf"
                  class="sr-only"
                />
                <p v-if="isValidationLetterAFile" class="text-xs text-gray-500 mt-1 truncate">
                  {{ localApplication.curriculum_validation_letter.name }}
                </p>
              </div>
            </div>

            <div class="space-y-2">
              <p class="text-sm font-medium text-gray-600">Curriculum Document</p>
              <a
                v-if="
                  application.curriculum_document &&
                  typeof application.curriculum_document === 'string'
                "
                :href="application.curriculum_document"
                target="_blank"
                class="inline-flex items-center text-sm text-blue-600 hover:underline"
              >
                View Current Document
                <svg
                  class="w-4 h-4 ml-1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"
                  />
                  <path
                    d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"
                  />
                </svg>
              </a>
              <p v-else class="text-sm text-gray-500 italic">No document uploaded.</p>
              <div v-if="application.status && application.status.toLowerCase() === 'pending'">
                <label
                  for="curriculum-doc-upload"
                  class="cursor-pointer inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <span>{{ isCurriculumDocAFile ? 'File Selected' : 'Upload New' }}</span>
                </label>
                <input
                  id="curriculum-doc-upload"
                  type="file"
                  @change="updateCurriculumDocument"
                  accept=".pdf"
                  class="sr-only"
                />
                <p v-if="isCurriculumDocAFile" class="text-xs text-gray-500 mt-1 truncate">
                  {{ localApplication.curriculum_document.name }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col sm:flex-row justify-end items-center p-5 space-y-2 sm:space-y-0 sm:space-x-3 bg-gray-50 border-t"
      >
        <button
          @click="emit('delete', localApplication)"
          class="inline-flex justify-center items-center w-full sm:w-auto px-4 py-2 text-sm font-medium text-red-700 bg-white border border-gray-300 rounded-md hover:bg-red-50 hover:text-red-800"
        >
          <svg
            class="w-5 h-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          Delete
        </button>
        <div class="flex-grow hidden sm:block"></div>
        <button
          @click="closeModal"
          class="inline-flex justify-center items-center w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Close
        </button>
        <button
          v-if="application.status && application.status.toLowerCase() === 'pending'"
          @click="emit('reject', localApplication)"
          class="inline-flex justify-center items-center w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-md hover:bg-yellow-700"
        >
          <svg
            class="w-5 h-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.367zM4.414 4.414a6 6 0 018.486 0l-8.486 8.486A6 6 0 014.414 4.414z"
              clip-rule="evenodd"
            />
          </svg>
          Reject
        </button>
        <button
          v-if="application.status && application.status.toLowerCase() === 'pending'"
          @click="emit('approve', localApplication)"
          class="inline-flex justify-center items-center w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
        >
          <svg
            class="w-5 h-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
          Approve
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  isVisible: { type: Boolean, required: true },
  application: { type: Object, required: true },
  teachingCenterName: { type: String, default: null },
})

const emit = defineEmits(['close', 'approve', 'reject', 'delete'])

// Create a local, reactive copy of the application prop
const localApplication = ref({ ...props.application })

// Watch for changes in the prop and update the local copy
watch(
  () => props.application,
  (newApp) => {
    localApplication.value = { ...newApp }
  },
  { deep: true },
)

// FIX: Use computed properties to safely check for File objects
const isValidationLetterAFile = computed(() => {
  if (typeof window === 'undefined' || !window.File) return false
  return localApplication.value.curriculum_validation_letter instanceof File
})

const isCurriculumDocAFile = computed(() => {
  if (typeof window === 'undefined' || !window.File) return false
  return localApplication.value.curriculum_document instanceof File
})

const updateCurriculumValidationLetter = (event) => {
  localApplication.value.curriculum_validation_letter = event.target.files[0] || null
}

const updateCurriculumDocument = (event) => {
  localApplication.value.curriculum_document = event.target.files[0] || null
}

const closeModal = () => {
  emit('close')
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped>
@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out forwards;
}
</style>