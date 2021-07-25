<template>
  <!-- Main Transition for Modal Visibility -->
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="view-details-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-gray-900/70 backdrop-blur-sm transition-opacity"
          @click="$emit('close')"
          aria-hidden="true"
        ></div>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">​</span>

        <!-- Modal Panel Transition -->
        <Transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            class="relative inline-block transform-gpu overflow-hidden rounded-xl bg-white text-left align-bottom shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle"
          >
            <!-- Modal Header -->
            <div
              class="flex items-start justify-between border-b border-gray-200 bg-gray-50/80 px-6 py-4"
            >
              <div>
                <h3
                  class="text-xl leading-6 font-semibold text-gray-800"
                  id="view-details-modal-title"
                >
                  CAPA Details: <span class="text-indigo-600">#{{ capa?.id }}</span>
                </h3>
                <p class="mt-1 text-sm text-gray-500">{{ capa?.institute?.name_of_institution }}</p>
              </div>
              <button
                type="button"
                class="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                @click="$emit('close')"
              >
                <span class="sr-only">Close</span>
                <XIcon class="h-5 w-5" />
              </button>
            </div>

            <!-- Modal Body -->
            <div class="max-h-[70vh] overflow-y-auto px-6 py-6">
              <div class="space-y-6">
                <!-- Section: Observation Details -->
                <div class="border-b border-gray-200 pb-5 last:border-b-0">
                    <h4 class="text-lg font-medium text-gray-800 mb-4">Observation Details</h4>
                    <div class="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                        <div>
                            <dt class="text-sm font-medium text-gray-500 mb-1.5">Status</dt>
                            <dd>
                                <span :class="getStatusClass(capa?.status)" class="inline-flex items-center rounded-md px-3 py-1 text-sm font-medium border">
                                    {{ capa?.status || 'Unknown' }}
                                </span>
                            </dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500 mb-1.5">Inspection Period</dt>
                            <dd class="text-sm text-gray-900">
                                {{ capa?.inspection_from_date || 'N/A' }} to {{ capa?.inspection_to_date || 'N/A' }}
                            </dd>
                        </div>
                        <div class="col-span-2">
                            <dt class="text-sm font-medium text-gray-500 mb-1.5">Observation Description</dt>
                            <dd class="text-sm text-gray-900 rounded-md bg-gray-50 p-3 border border-gray-200">
                                {{ capa?.observation_description || 'N/A' }}
                            </dd>
                        </div>
                        <div class="col-span-2">
                            <dt class="text-sm font-medium text-gray-500 mb-1.5">Management Comment</dt>
                            <dd class="text-sm text-gray-900 rounded-md bg-gray-50 p-3 border border-gray-200">
                                {{ capa?.management_comment || 'N/A' }}
                            </dd>
                        </div>
                    </div>
                </div>

                <!-- Section: Institute's Response -->
                <div class="border-b border-gray-200 pb-5 last:border-b-0">
                    <h4 class="text-lg font-medium text-gray-800 mb-4">Institute's Response</h4>
                    <div class="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                        <div class="col-span-2">
                            <dt class="text-sm font-medium text-gray-500 mb-1.5">Root Cause Analysis</dt>
                            <dd class="text-sm text-gray-900 rounded-md bg-gray-50 p-3 border border-gray-200">
                                {{ capa?.root_cause || 'Not provided.' }}
                            </dd>
                        </div>
                        <div class="col-span-2">
                            <dt class="text-sm font-medium text-gray-500 mb-1.5">Corrective & Preventive Action (CAPA)</dt>
                            <dd class="text-sm text-gray-900 rounded-md bg-gray-50 p-3 border border-gray-200">
                                {{ capa?.capa || 'Not provided.' }}
                            </dd>
                        </div>
                        <div>
                            <dt class="text-sm font-medium text-gray-500 mb-1.5">Implementation Timeline</dt>
                            <dd class="text-sm text-gray-900">
                                <span v-if="capa?.implementation_timeline_from || capa?.implementation_timeline_to">
                                  {{ capa.implementation_timeline_from || 'N/A' }} to {{ capa.implementation_timeline_to || 'N/A' }}
                                </span>
                                <span v-else>
                                  Not provided.
                                </span>
                            </dd>
                        </div>
                         <div class="col-span-2">
                            <dt class="text-sm font-medium text-gray-500 mb-1.5">User Remarks</dt>
                            <dd class="text-sm text-gray-900 rounded-md bg-gray-50 p-3 border border-gray-200">
                                {{ capa?.user_remarks || 'No additional remarks.' }}
                            </dd>
                        </div>
                    </div>
                </div>

                <!-- Section: Dealing Officer's Action -->
                <div v-if="capa" class="pb-5 last:border-b-0">
                  <h4 class="text-lg font-medium text-gray-800 mb-4">Dealing Officer's Action</h4>
                  <div class="space-y-5">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Physical Verification Status:</label>
                      <div class="flex items-center gap-x-3">
                          <span :class="capa.physical_verification_status ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'" class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border">
                            <component :is="capa.physical_verification_status ? BadgeCheck : BadgeX" class="h-4 w-4 mr-2" />
                            {{ capa.physical_verification_status ? 'Verified' : 'Not Verified' }}
                          </span>
                          <button
                            v-if="capa.status !== 'Resolved'"
                            @click="togglePhysicalVerification"
                            type="button"
                            class="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            :disabled="isUpdating"
                          >
                            {{ capa.physical_verification_status ? 'Mark as Not Verified' : 'Mark as Verified' }}
                          </button>
                      </div>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-gray-500 mb-1">Dealing Officer Remarks</dt>
                        <dd>
                            <textarea
                              v-if="capa.status !== 'Resolved'"
                              v-model="editableRemarks"
                              @blur="updateRemarks"
                              rows="4"
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                              placeholder="Add your remarks..."
                              :disabled="isUpdating"
                            ></textarea>
                            <div v-else class="text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200">
                              {{ capa?.DO_remarks || 'N/A' }}
                            </div>
                        </dd>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50/80 px-6 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  class="mt-3 w-full sm:mt-0 sm:w-auto inline-flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  @click="$emit('close')"
                >
                  Cancel
                </button>
                <button
                  v-if="capa?.status !== 'Resolved'"
                  type="button"
                  @click="resolveCapa"
                  class="w-full sm:w-auto inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="isUpdating"
                >
                  <span v-if="isUpdating">Resolving...</span>
                  <span v-else class="flex items-center">
                    <BadgeCheck class="h-4 w-4 mr-2" />
                    Resolve CAPA
                  </span>
                </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { XIcon, BadgeCheck, BadgeX } from 'lucide-vue-next'
import apiServices from '@/services/services'
import { toRefs, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'

// Define component properties and events
const props = defineProps({
  show: Boolean,
  capa: Object,
})
const emits = defineEmits(['close', 'capa-updated'])

// Initialize refs and services
const { capa } = toRefs(props)
const toast = useToast()
const editableRemarks = ref('')
const isUpdating = ref(false) // State to track API call in progress

// Watch for changes in the 'capa' prop to update local state
watch(
  capa,
  (newCapa) => {
    // Sync local remarks with the prop's value
    editableRemarks.value = newCapa?.DO_remarks || ''
    // Reset loading state if the modal is opened with a new item
    isUpdating.value = false;
  },
  { immediate: true, deep: true },
)

// Helper function to get CSS classes based on CAPA status
const getStatusClass = (status) => ({
    'Pending': 'bg-yellow-50 text-yellow-800 border-yellow-300',
    'Resolved': 'bg-green-50 text-green-800 border-green-300',
    'Approved': 'bg-blue-50 text-blue-800 border-blue-300',
})[status] || 'bg-gray-50 text-gray-800 border-gray-300'

// Central function to handle API updates
const updateApiAndEmit = async (payload) => {
  if (!capa.value || isUpdating.value) return; // Prevent multiple simultaneous requests

  isUpdating.value = true // Set loading state to true, disabling buttons
  try {
    await apiServices.patchMhpcCapa(capa.value.id, payload)
    emits('capa-updated'); // Notify parent to refresh data
    toast.success('CAPA updated successfully!');
  } catch (error) {
    const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
    console.error('Failed to update CAPA:', errorMsg);
    toast.error('Failed to update CAPA. Refreshing view to sync state.');
    emits('capa-updated'); // Refresh data even on failure to ensure UI consistency
  } finally {
    isUpdating.value = false // Reset loading state
  }
}

// Event handler to toggle physical verification status
const togglePhysicalVerification = () => {
  updateApiAndEmit({ physical_verification_status: !capa.value.physical_verification_status });
}

// Event handler to update remarks when the textarea loses focus
const updateRemarks = () => {
  // Only send API request if the remarks have actually changed
  if (editableRemarks.value.trim() !== (capa.value?.DO_remarks || '')) {
    updateApiAndEmit({ DO_remarks: editableRemarks.value });
  }
}

// Event handler for the "Resolve CAPA" button
const resolveCapa = () => {
  if (!editableRemarks.value.trim()) {
    toast.warning('Please provide remarks from the dealing officer before resolving the CAPA.');
    return;
  }
  updateApiAndEmit({ status: 'Resolved' });
}
</script>

<style scoped>
.transform-gpu {
  /* Ensures smoother animations on supported hardware */
  transform: translateZ(0);
}
.text-gray-900 {
  line-height: 1.5;
}
</style>