<template>
  <Transition name="modal-fade">
    <div v-if="application" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <!-- Background Overlay -->
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>

      <!-- Modal Container -->
      <div class="relative w-full max-w-3xl mx-4 my-6 bg-white dark:bg-gray-900 rounded-xl shadow-xl">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            View CPD Application
          </h2>
          <button
            @click="$emit('close')"
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form Content (Read-Only) -->
        <div class="p-6 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          <!-- Personal Details Section -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Personal Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Registration Number</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ application.registrationNumber || 'Not provided' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">CID/Identity Number</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ application.cidNumber || 'Not provided' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ application.fullName || 'Not provided' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ application.gender || 'Not provided' }}
                </p>
              </div>
            </div>
          </div>

          <!-- CPD Details Section -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">CPD Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Title of CPD</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ application.cpdTitle || 'Not provided' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Relevance to Profession</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ application.relevance || 'Not provided' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Participation Category</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ application.participationCategory || 'Not provided' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Participant Sub-category</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ application.participantSubCategory || 'Not provided' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Type of CPD Activity</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ application.activityType || 'Not provided' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Attachment</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ application.attachment?.name || 'No file attached' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Review Section (BMHC Part) -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Review Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">CPD Credits</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ application.cpdCredits || 'Not provided' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Review Status</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ application.reviewStatus || 'Not provided' }}
                </p>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Remarks</label>
                <p class="mt-1 text-sm text-gray-900 dark:text-white">
                  {{ application.remarks || 'No remarks' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-4 p-6 border-t dark:border-gray-700">
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  application: {
    type: Object,
    required: true,
    default: () => ({
      registrationNumber: '',
      cidNumber: '',
      fullName: '',
      gender: '',
      cpdTitle: '',
      relevance: '',
      participationCategory: '',
      participantSubCategory: '',
      activityType: '',
      attachment: null,
      cpdCredits: 0,
      reviewStatus: '',
      remarks: '',
    }),
  },
})

</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>