<template>
  <transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isVisible && application"
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
      @click.self="closeModal"
    >
      <div
        class="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col transform transition-all"
        :class="isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
      >
        <div class="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-800">Application Details</h2>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-5 overflow-y-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <p class="text-sm font-medium text-gray-500">Application ID</p>
              <p class="text-md font-mono text-gray-800">{{ application.id }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Status</p>
              <p class="text-md text-gray-800">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                  :class="statusClass(application.status)"
                >
                  {{ application.status || 'Unknown' }}
                </span>
              </p>
            </div>
            <div class="md:col-span-2">
              <p class="text-sm font-medium text-gray-500">Program Title</p>
              <p class="text-md font-semibold text-gray-900">
                {{ application.specific_program_title || 'N/A' }}
              </p>
            </div>
            <div class="md:col-span-2">
              <p class="text-sm font-medium text-gray-500">Institute</p>
              <p class="text-md text-gray-800">
                {{ application.institute?.name_of_institution || 'N/A' }}
              </p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Training Center</p>
              <p class="text-md text-gray-800">{{ teachingCenterNameProp || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500">Submission Date</p>
              <p class="text-md text-gray-800">{{ formatDateForView(application.created_at) }}</p>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-5 space-y-4">
            <div
              v-if="application.curriculum_validation_letter || application.curriculum_document"
              class="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <a
                v-if="application.curriculum_validation_letter"
                :href="application.curriculum_validation_letter"
                target="_blank"
                class="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 transition-all"
              >
                <svg
                  class="w-8 h-8 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                <span class="ml-3 text-sm font-medium text-gray-700">View Validation Letter</span>
              </a>
              <a
                v-if="application.curriculum_document"
                :href="application.curriculum_document"
                target="_blank"
                class="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 transition-all"
              >
                <svg
                  class="w-8 h-8 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                <span class="ml-3 text-sm font-medium text-gray-700">View Curriculum Document</span>
              </a>
            </div>
          </div>

          <div v-if="application.status_remarks" class="border-t border-gray-200 pt-5">
            <p class="text-sm font-medium text-gray-500">Status Remarks</p>
            <p
              class="mt-1 text-md text-gray-800 bg-yellow-50 p-3 rounded-lg border border-yellow-200"
            >
              {{ application.status_remarks }}
            </p>
          </div>
        </div>

        <div class="p-4 bg-gray-50 border-t border-gray-200 text-right">
          <button
            @click="closeModal"
            class="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold text-sm shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
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
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

const statusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'approved':
      return 'bg-blue-100 text-blue-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    case 'active':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatDateForView = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.modal-view {
  z-index: 60 !important;
}
</style>
