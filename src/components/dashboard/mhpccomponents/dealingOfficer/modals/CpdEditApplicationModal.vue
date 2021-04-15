<template>
  <Transition name="modal-fade">
    <div v-if="true" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>

      <div class="relative w-full max-w-3xl mx-4 my-6 bg-white dark:bg-gray-900 rounded-xl shadow-xl">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isNewApplication ? 'New CPD Application' : 'Edit CPD Application' }}
          </h2>
          <button @click="$emit('close')"
            class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form Content -->
        <div class="p-6 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          <!-- Personal Details Section -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Personal Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Registration Number</label>
                <input v-model="form.registrationNumber" type="text" readonly
                  class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">CID/Identity Number</label>
                <input v-model="form.cidNumber" type="text" readonly
                  class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input v-model="form.fullName" type="text" readonly
                  class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
                <input v-model="form.gender" type="text" readonly
                  class="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md" />
              </div>
            </div>
          </div>

          <!-- CPD Details Section -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">CPD Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Title of CPD</label>
                <input v-model="form.cpdTitle" type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Relevance to
                  Profession</label>
                <input v-model="form.relevance" type="text"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Participation Category</label>
                <select v-model="form.participationCategory"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                  <option value="presenter">Presenter</option>
                  <option value="participant">Participant</option>
                  <option value="organizer">Organizer</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Type of CPD Activity</label>
                <select v-model="form.activityType"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                  <option value="workshop">Workshop</option>
                  <option value="seminar">Seminar</option>
                  <option value="conference">Conference</option>
                  <option value="training">Training</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Review Section (BMHC Part) -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Review Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">CPD Credits</label>
                <input v-model.number="form.cpdCredits" type="number" min="0" step="0.5"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Review Status</label>
                <select v-model="form.reviewStatus"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Remarks</label>
                <textarea v-model="form.remarks" rows="3"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-4 p-6 border-t dark:border-gray-700">
          <button @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Cancel
          </button>
          <button v-if="!isNewApplication" @click="handleDelete"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            Delete
          </button>
          <button @click="handleSave"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            {{ form.reviewStatus === 'approved' ? 'Approve & Award Credits' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  application: {
    type: Object,
    required: true,
  },
  isNewApplication: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['save', 'delete', 'close'])

const form = ref({
  ...props.application,
  reviewStatus: props.application.reviewStatus || 'pending',
  cpdCredits: props.application.cpdCredits || 0,
  remarks: props.application.remarks || '',
})

const handleSave = () => {
  // Validate form
  if (!form.value.cpdTitle || !form.value.participationCategory || !form.value.activityType) {
    alert('Please fill in all required fields')
    return
  }

  // If status is approved, handle credit award
  if (form.value.reviewStatus === 'approved') {
    // Emit save with additional award flag
    emit('save', { ...form.value, awardCredits: true })
  } else {
    emit('save', form.value)
  }

  emit('close')
}

const handleDelete = () => {
  if (confirm('Are you sure you want to delete this application?')) {
    emit('delete', form.value)
    emit('close')
  }
}
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
