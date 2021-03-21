<template>
  <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0 sm:scale-100" leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="view-details-modal-title" role="dialog"
      aria-modal="true">
      <div class="flex items-center justify-center min-h-screen px-4 text-center sm:p-0">
        <!-- Improved background overlay with blur effect -->
        <div class="fixed inset-0 bg-gray-800 bg-opacity-75 backdrop-blur-sm transition-opacity" @click="$emit('close')"
          aria-hidden="true"></div>

        <!-- Modal panel with improved shadow and positioning -->
        <div
          class="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full">
          <!-- Enhanced Modal header with better spacing and typography -->
          <div class="bg-indigo-50 border-b border-indigo-100 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 class="text-xl leading-6 font-semibold text-indigo-900" id="view-details-modal-title">
                CAPA Details - CAPA #{{ capa?.id }}
              </h3>
              <p class="mt-1 text-sm text-indigo-700">{{ props.instituteName }}</p>
            </div>

            <button type="button"
              class="inline-flex justify-center rounded-md p-2 text-indigo-500 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              @click="$emit('close')">
              <XIcon class="h-5 w-5" />
            </button>
          </div>

          <!-- Modal body with improved layout and spacing -->
          <div class="px-6 py-5">
            <!-- Physical Verification Status with improved badge design -->
            <div class="mb-6 pb-4 border-b border-gray-200">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Physical Verification Status:
              </label>
              <div class="flex items-center">
                <span
                  :class="capa.physical_verification_status ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'"
                  class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border">
                  <component :is="capa.physical_verification_status ? BadgeCheck : BadgeX" class="h-4 w-4 mr-2" />
                  {{ capa.physical_verification_status ? "Verified" : "Not Verified" }}
                </span>
                <button v-if="capa.status !== 'R'" @click="togglePhysicalVerification" type="button"
                  class="ml-3 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                  {{ capa.physical_verification_status ? 'Mark as Not Verified' : 'Mark as Verified' }}
                </button>
              </div>
            </div>

            <!-- CAPA Details with improved grid layout -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <!-- Status Field with enhanced styling -->
              <div class="col-span-1">
                <dt class="text-sm font-medium text-gray-500 mb-1">Status</dt>
                <dd>
                  <span :class="getStatusClass(capa?.status)"
                    class="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border">
                    {{ getStatusText(capa?.status) }}
                  </span>
                </dd>
              </div>

              <!-- Timeline Fields Side by Side -->
              <div class="col-span-1">
                <dt class="text-sm font-medium text-gray-500 mb-1">Inspection Period</dt>
                <dd class="text-sm text-gray-900">
                  {{ capa?.inspection_from_date || "N/A" }} to {{ capa?.inspection_to_date || "N/A" }}
                </dd>
              </div>

              <!-- Full width fields for longer text content -->
              <div class="col-span-2">
                <dt class="text-sm font-medium text-gray-500 mb-1">Observation Description</dt>
                <dd class="text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200">
                  {{ capa?.observation_description || "N/A" }}
                </dd>
              </div>

              <div class="col-span-2">
                <dt class="text-sm font-medium text-gray-500 mb-1">Root Cause</dt>
                <dd class="text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200">
                  {{ capa?.root_cause || "N/A" }}
                </dd>
              </div>

              <div class="col-span-2">
                <dt class="text-sm font-medium text-gray-500 mb-1">CAPA</dt>
                <dd class="text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200">
                  {{ capa?.capa || "N/A" }}
                </dd>
              </div>

              <div class="col-span-1">
                <dt class="text-sm font-medium text-gray-500 mb-1">Implementation Timeline</dt>
                <dd class="text-sm text-gray-900">
                  {{ capa?.implementation_timeline || "N/A" }}
                </dd>
              </div>

              <div class="col-span-2">
                <dt class="text-sm font-medium text-gray-500 mb-1">Management Comment</dt>
                <dd class="text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200">
                  {{ capa?.management_comment || "N/A" }}
                </dd>
              </div>

              <!-- User Remarks -->
              <div class="col-span-2">
                <dt class="text-sm font-medium text-gray-500 mb-1">User Remarks</dt>
                <dd class="text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200">
                  {{ capa?.user_remarks || "N/A" }}
                </dd>
              </div>

              <!-- DO Remarks with improved textarea -->
              <div class="col-span-2">
                <dt class="text-sm font-medium text-gray-500 mb-1">Dealing Officer Remarks</dt>
                <dd>
                  <textarea v-if="capa.status !== 'R'" v-model="editableRemarks" @blur="updateRemarks" rows="3"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter remarks..."></textarea>
                  <div v-else class="text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-gray-200">
                    {{ capa?.DO_remarks || "N/A" }}
                  </div>
                </dd>
              </div>
            </div>
          </div>

          <!-- Modal footer with improved button styling -->
          <div class="bg-gray-50 border-t border-gray-200 px-6 py-4 sm:flex sm:flex-row-reverse">
            <button v-if="capa?.status !== 'R'" type="button" @click="resolveCapa"
              class="w-full sm:w-auto inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
              <BadgeCheck class="h-4 w-4 mr-2" />
              Resolve CAPA
            </button>
            <button type="button" @click="$emit('close')"
              class="mt-3 w-full sm:mt-0 sm:mr-3 sm:w-auto inline-flex justify-center items-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { XIcon, BadgeCheck, BadgeX } from 'lucide-vue-next';
import apiservice from '@/services/epcServices';
import { toRefs, ref, watch } from 'vue';

const props = defineProps({
  show: Boolean,
  capa: Object,
  instituteName: String,
});

const { capa } = toRefs(props);

const emits = defineEmits(['close', 'capa-updated']);

// Editable remarks
const editableRemarks = ref('');

// Initialize editableRemarks when capa changes
watch(capa, (newCapa) => {
  editableRemarks.value = newCapa?.DO_remarks || '';
}, { immediate: true });

const getStatusClass = (status) => {
  const classes = {
    P: 'bg-yellow-50 text-yellow-800 border-yellow-300',
    R: 'bg-green-50 text-green-800 border-green-300',
    A: 'bg-blue-50 text-blue-800 border-blue-300',
  };
  return classes[status] || 'bg-gray-50 text-gray-800 border-gray-300';
};

const getStatusText = (status) => {
  const statusTexts = {
    P: 'Pending',
    R: 'Resolved',
    A: 'Approved',
  };
  return statusTexts[status] || 'Unknown';
};

const togglePhysicalVerification = async () => {
  const newStatus = !capa.value.physical_verification_status;
  try {
    await apiservice.patchEpcCapa(capa.value.id, {
      physical_verification_status: newStatus,
    });

    capa.value.physical_verification_status = newStatus;
    emits('capa-updated');

  } catch (error) {
    console.error('Error updating physical verification:', error.response ? error.response.data : error.message);
    alert('Failed to update physical verification.');
  }
};

const updateRemarks = async () => {
  if (editableRemarks.value !== capa.value.DO_remarks) {
    try {
      await apiservice.patchEpcCapa(capa.value.id, { DO_remarks: editableRemarks.value });
      capa.value.DO_remarks = editableRemarks.value;
      emits('capa-updated');
    } catch (error) {
      console.error('Error updating remarks:', error);
      alert('Failed to update remarks.');
      editableRemarks.value = capa.value.DO_remarks;
    }
  }
};

const resolveCapa = async () => {
  const remarks = prompt('Please enter Dealing Officer Remarks/Reason for Resolved:');
  if (remarks) {
    try {
      await apiservice.patchEpcCapa(capa.value.id, {
        status: 'R',
        DO_remarks: remarks,
        physical_verification_status: true,
      });

      capa.value.status = 'R';
      capa.value.DO_remarks = remarks;
      capa.value.physical_verification_status = true;

      alert('CAPA resolved successfully.');
      emits('capa-updated');
    } catch (error) {
      console.error('Error resolving CAPA:', error.response ? error.response.data : error.message);
      alert('Failed to resolve CAPA.');
    }
  }
};
</script>

<style scoped>
/* Add subtle card effect on the modal */
.transform {
  transform-origin: center;
}

/* Subtle animation for status badges */
[class*="bg-"] {
  transition: all 0.2s ease-in-out;
}

/* Improve text readability */
.text-gray-900 {
  line-height: 1.5;
}
</style>
