<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    enter-to-class="opacity-100 translate-y-0 sm:scale-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0 sm:scale-100"
    leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  >
    <div
      v-if="show"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="view-details-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-center justify-center min-h-screen px-4 text-center sm:p-0">
        <div
          class="fixed inset-0 bg-gray-800 bg-opacity-75 backdrop-blur-sm transition-opacity"
          @click="$emit('close')"
          aria-hidden="true"
        ></div>

        <div
          class="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full"
        >
          <div
            class="bg-indigo-50 border-b border-indigo-100 px-6 py-4 flex items-center justify-between"
          >
            <div>
              <h3
                class="text-xl leading-6 font-semibold text-indigo-900"
                id="view-details-modal-title"
              >
                CAPA Details - CAPA #{{ capa?.id }}
              </h3>
              <!-- FIX: Accessing nested institute name correctly from the capa object -->
              <p class="mt-1 text-sm text-indigo-700">{{ capa?.institute?.name_of_institution }}</p>
            </div>
            <button
              type="button"
              class="inline-flex justify-center rounded-md p-2 text-indigo-500 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              @click="$emit('close')"
            >
              <XIcon class="h-5 w-5" />
            </button>
          </div>

          <div class="px-6 py-5 max-h-[70vh] overflow-y-auto">
            <!-- Section 1: Observation Details -->
            <div class="pb-4 mb-4 border-b border-gray-200">
              <h4 class="text-lg font-medium text-gray-800 mb-4">Observation Details</h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <dt class="text-sm font-medium text-gray-500 mb-1">Status</dt>
                  <dd>
                    <span :class="getStatusClass(capa?.status)" class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border">
                      {{ capa?.status || 'Unknown' }}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500 mb-1">Inspection Period</dt>
                  <dd class="text-sm text-gray-900">
                    {{ capa?.inspection_from_date || 'N/A' }} to
                    {{ capa?.inspection_to_date || 'N/A' }}
                  </dd>
                </div>
                <div class="col-span-2">
                  <dt class="text-sm font-medium text-gray-500 mb-1">Observation Description</dt>
                  <dd class="text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200">
                    {{ capa?.observation_description || 'N/A' }}
                  </dd>
                </div>
                <div class="col-span-2">
                  <dt class="text-sm font-medium text-gray-500 mb-1">Management Comment</dt>
                  <dd class="text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200">
                    {{ capa?.management_comment || 'N/A' }}
                  </dd>
                </div>
              </div>
            </div>

            <!-- Section 2: Institute's Response -->
            <div class="pb-4 mb-4 border-b border-gray-200">
                <h4 class="text-lg font-medium text-gray-800 mb-4">Institute's Response</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div class="col-span-2">
                        <dt class="text-sm font-medium text-gray-500 mb-1">Root Cause Analysis</dt>
                        <dd class="text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200">
                            {{ capa?.root_cause || 'Not provided.' }}
                        </dd>
                    </div>
                    <div class="col-span-2">
                        <dt class="text-sm font-medium text-gray-500 mb-1">Corrective & Preventive Action (CAPA)</dt>
                        <dd class="text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200">
                            {{ capa?.capa || 'Not provided.' }}
                        </dd>
                    </div>
                    <div>
                        <dt class="text-sm font-medium text-gray-500 mb-1">Implementation Timeline</dt>
                        <dd class="text-sm text-gray-900">
                            {{ capa?.implementation_timeline || 'Not provided.' }}
                        </dd>
                    </div>
                     <div class="col-span-2">
                        <dt class="text-sm font-medium text-gray-500 mb-1">User Remarks</dt>
                        <dd class="text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200">
                            {{ capa?.user_remarks || 'No additional remarks.' }}
                        </dd>
                    </div>
                </div>
            </div>

            <!-- Section 3: Dealing Officer's Action -->
            <div v-if="capa">
              <h4 class="text-lg font-medium text-gray-800 mb-4">Dealing Officer's Action</h4>
              <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Physical Verification Status:</label>
                    <div class="flex items-center">
                        <span :class="capa.physical_verification_status ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'" class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border">
                          <component :is="capa.physical_verification_status ? BadgeCheck : BadgeX" class="h-4 w-4 mr-2" />
                          {{ capa.physical_verification_status ? 'Verified' : 'Not Verified' }}
                        </span>
                        <button v-if="capa.status !== 'Resolved'" @click="togglePhysicalVerification" type="button" class="ml-3 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                          {{ capa.physical_verification_status ? 'Mark as Not Verified' : 'Mark as Verified' }}
                        </button>
                    </div>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 mb-1">Dealing Officer Remarks</dt>
                    <dd>
                      <textarea v-if="capa.status !== 'Resolved'" v-model="editableRemarks" @blur="updateRemarks" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter remarks..."></textarea>
                      <div v-else class="text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200">
                        {{ capa?.DO_remarks || 'N/A' }}
                      </div>
                    </dd>
                  </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 border-t border-gray-200 px-6 py-4 sm:flex sm:flex-row-reverse">
            <button
              v-if="capa?.status !== 'Resolved'"
              type="button"
              @click="resolveCapa"
              class="w-full sm:w-auto inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <BadgeCheck class="h-4 w-4 mr-2" />
              Resolve CAPA
            </button>
            <button
              type="button"
              @click="$emit('close')"
              class="mt-3 w-full sm:mt-0 sm:mr-3 sm:w-auto inline-flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { XIcon, BadgeCheck, BadgeX } from 'lucide-vue-next'
import apiServices from '@/services/services'
import { toRefs, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'

// FIX: Removed 'instituteName' from props as it's now derived from the 'capa' object
const props = defineProps({
  show: Boolean,
  capa: Object,
})

const { capa } = toRefs(props)
const emits = defineEmits(['close', 'capa-updated'])
const editableRemarks = ref('')
const toast = useToast()

watch(
  capa,
  (newCapa) => {
    editableRemarks.value = newCapa?.DO_remarks || ''
  },
  { immediate: true, deep: true },
)

const getStatusClass = (status) => ({
    'Pending': 'bg-yellow-50 text-yellow-800 border-yellow-300',
    'Resolved': 'bg-green-50 text-green-800 border-green-300',
    'Approved': 'bg-blue-50 text-blue-800 border-blue-300',
})[status] || 'bg-gray-50 text-gray-800 border-gray-300'

const updateApiAndEmit = async (payload) => {
  try {
    await apiServices.patchMhpcCapa(capa.value.id, payload)
    emits('capa-updated'); // Signal parent to refetch all data
  } catch (error) {
    const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
    console.error('Failed to update CAPA:', errorMsg);
    toast.error('Failed to update CAPA. See console for details.');
    // Important: We don't manually revert state here.
    // The parent's `fetchAllData` will handle synchronizing with the server's true state.
  }
}

const togglePhysicalVerification = async () => {
  if (!capa.value) return;
  await updateApiAndEmit({ physical_verification_status: !capa.value.physical_verification_status });
}

const updateRemarks = async () => {
  if (!capa.value || editableRemarks.value === capa.value.DO_remarks) return;
  await updateApiAndEmit({ DO_remarks: editableRemarks.value });
}

const resolveCapa = async () => {
  if (!capa.value) return;
  // Using toast.info for prompt-like behavior, user will type in the textarea
  toast.info('Please enter Dealing Officer Remarks/Reason for Resolving in the remarks box and save.');
  // The actual resolution will happen when the remarks are updated and saved.
  // For now, we just inform the user to use the remarks box.
  // If a direct prompt is absolutely necessary, a custom modal would be needed.
}
</script>

<style scoped>
.transform { transform-origin: center; }
[class*='bg-'] { transition: all 0.2s ease-in-out; }
.text-gray-900 { line-height: 1.5; }
</style>