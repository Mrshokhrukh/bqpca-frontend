<template>
  <Transition name="modal-fade">
    <div v-if="application" class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <!-- Background Overlay -->
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>

      <!-- Modal Container -->
      <div class="relative w-full max-w-3xl mx-4 my-6 bg-white rounded-xl shadow-xl">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isEditing ? 'Edit CPD Application' : 'View CPD Application' }}
          </h2>
          <div>
            <button
              v-if="!isEditing"
              @click="startEditing"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
            >
              Edit
            </button>
            <button
              @click="$emit('close')"
              class="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Form Content -->
        <div class="p-6 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          <!-- Personal Details Section -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">Personal Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Registration Number</label>
                <input
                  v-if="isEditing"
                  v-model="editedApplication.registrationNumber"
                  type="text"
                  class="mt-1 p-2 border rounded-md w-full"
                />
                <p v-else class="mt-1 text-sm text-gray-900">
                  {{ application.registrationNumber || 'Not provided' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">CID/Identity Number</label>
                <input
                  v-if="isEditing"
                  v-model="editedApplication.cidNumber"
                  type="text"
                  class="mt-1 p-2 border rounded-md w-full"
                />
                <p v-else class="mt-1 text-sm text-gray-900">
                  {{ application.cidNumber || 'Not provided' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  v-if="isEditing"
                  v-model="editedApplication.fullName"
                  type="text"
                  class="mt-1 p-2 border rounded-md w-full"
                />
                <p v-else class="mt-1 text-sm text-gray-900">
                  {{ application.fullName || 'Not provided' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Gender</label>
                <input
                  v-if="isEditing"
                  v-model="editedApplication.gender"
                  type="text"
                  class="mt-1 p-2 border rounded-md w-full"
                />
                <p v-else class="mt-1 text-sm text-gray-900">
                  {{ application.gender || 'Not provided' }}
                </p>
              </div>
            </div>
          </div>

          <!-- CPD Details Section -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">CPD Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Title of CPD</label>
                <input
                  v-if="isEditing"
                  v-model="editedApplication.cpdTitle"
                  type="text"
                  class="mt-1 p-2 border rounded-md w-full"
                />
                <p v-else class="mt-1 text-sm text-gray-900">
                  {{ application.cpdTitle || 'Not provided' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Relevance to Profession</label>
                <input
                  v-if="isEditing"
                  v-model="editedApplication.relevance"
                  type="text"
                  class="mt-1 p-2 border rounded-md w-full"
                />
                <p v-else class="mt-1 text-sm text-gray-900">
                  {{ application.relevance || 'Not provided' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Participation Category</label>
                <input
                  v-if="isEditing"
                  v-model="editedApplication.participationCategory"
                  type="text"
                  class="mt-1 p-2 border rounded-md w-full"
                />
                <p v-else class="mt-1 text-sm text-gray-900">
                  {{ application.participationCategory || 'Not provided' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Participant Sub-category</label>
                <input
                  v-if="isEditing"
                  v-model="editedApplication.participantSubCategory"
                  type="text"
                  class="mt-1 p-2 border rounded-md w-full"
                />
                <p v-else class="mt-1 text-sm text-gray-900">
                  {{ application.participantSubCategory || 'Not provided' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Type of CPD Activity</label>
                <input
                  v-if="isEditing"
                  v-model="editedApplication.activityType"
                  type="text"
                  class="mt-1 p-2 border rounded-md w-full"
                />
                <p v-else class="mt-1 text-sm text-gray-900">
                  {{ application.activityType || 'Not provided' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Attachment</label>
                <p v-if="application.attachment" class="mt-1 text-sm text-gray-900">
                  {{ application.attachment?.name || 'No file attached' }}
                </p>
                <p v-else class="mt-1 text-sm text-gray-900">No file attached</p>

              </div>
            </div>
          </div>

          <!-- Review Section (BMHC Part) -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">Review Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">CPD Credits</label>
                <input
                  v-if="isEditing"
                  v-model.number="editedApplication.cpdCredits"
                  type="number"
                  class="mt-1 p-2 border rounded-md w-full"
                />
                <p v-else class="mt-1 text-sm text-gray-900">
                  {{ application.cpdCredits || 'Not provided' }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Review Status</label>
                <input
                  v-if="isEditing"
                  v-model="editedApplication.reviewStatus"
                  type="text"
                  class="mt-1 p-2 border rounded-md w-full"
                />
                <p v-else class="mt-1 text-sm text-gray-900">
                  {{ application.reviewStatus || 'Not provided' }}
                </p>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700">Remarks</label>
                <input
                  v-if="isEditing"
                  v-model="editedApplication.remarks"
                  type="text"
                  class="mt-1 p-2 border rounded-md w-full"
                />
                <p v-else class="mt-1 text-sm text-gray-900">
                  {{ application.remarks || 'No remarks' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-4 p-6 border-t">
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            v-if="isEditing"
            @click="saveChanges"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
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

const emit = defineEmits(['close', 'update:application'])

const isEditing = ref(false);
const editedApplication = ref({ ...props.application });

watch(() => props.application, (newApplication) => {
  editedApplication.value = { ...newApplication };
});

const startEditing = () => {
  isEditing.value = true;
};

const saveChanges = () => {
  emit('update:application', editedApplication.value);
  isEditing.value = false;
};

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