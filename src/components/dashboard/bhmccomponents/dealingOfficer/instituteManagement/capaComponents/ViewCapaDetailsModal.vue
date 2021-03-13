<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
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
      <div class="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div
          class="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm transition-opacity"
          @click="$emit('close')"
          aria-hidden="true"
        ></div>

        <!-- Modal panel -->
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
        >
          <!-- Modal header -->
          <div class="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-5 sm:px-8 flex justify-between items-center">
            <h3 class="text-xl font-semibold text-white" id="view-details-modal-title">
              CAPA Details - CAPA #{{ capa?.id }}
            </h3>
            <div class="flex items-center space-x-4">
              <div>
                <dt class="text-sm font-medium text-gray-200">Physical Verification</dt>
                <dd class="mt-1 text-sm">
                  <span
                    :class="capa?.physical_verification_status ? 'badge-check' : 'badge-x'"
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  >
                    <component
                      :is="capa?.physical_verification_status ? BadgeCheck : BadgeX"
                      class="h-4 w-4 mr-2"
                    />
                    {{ capa?.physical_verification_status ? "Verified" : "Not Verified" }}
                  </span>
                </dd>
              </div>
              <button
                @click="$emit('close')"
                class="rounded-full p-2 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close modal"
              >
                <XIcon class="h-6 w-6" />
              </button>
            </div>
          </div>

          <!-- Modal body -->
          <div class="px-6 pt-6 pb-4 sm:p-8 sm:pb-6 max-h-[70vh] overflow-y-auto">
            <dl class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div v-for="(detail, index) in details" :key="index" class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">{{ detail.label }}</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <template v-if="detail.key === 'status'">
                    <span
                      :class="getStatusClass(capa?.[detail.key])"
                      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {{ getStatusText(capa?.[detail.key]) }}
                    </span>
                  </template>
                  <template v-else>
                    {{ capa?.[detail.key] || "N/A" }}
                  </template>
                </dd>
              </div>
            </dl>
          </div>

          <!-- Modal footer -->
          <div class="bg-gray-50 px-6 py-4 sm:px-8 sm:flex sm:flex-row-reverse">
            <button
              v-if="capa?.status !== 'R'"
              type="button"
              @click="resolveCapa"
              class="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Resolve
            </button>
            <button
              type="button"
              @click="$emit('close')"
              class="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
<script setup>
import { XIcon, BadgeCheck, BadgeX } from 'lucide-vue-next';
import apiservice from '@/services/bmhcservices';
import { toRefs } from 'vue';

const props = defineProps({
  show: Boolean,
  capa: Object,
  instituteName: String,
});

const { capa } = toRefs(props);

const emits = defineEmits(['close', 'capa-updated']);

// Define the details to display in the modal
const details = [
  { label: 'Institute', key: 'instituteName' },
  { label: 'Status', key: 'status' },
  { label: 'Inspection From Date', key: 'inspection_from_date' },
  { label: 'Inspection To Date', key: 'inspection_to_date' },
  { label: 'Observation Description', key: 'observation_description' },
  { label: 'Root Cause', key: 'root_cause' },
  { label: 'CAPA', key: 'capa' },
  { label: 'Implementation Timeline', key: 'implementation_timeline' },
  { label: 'Management Comment', key: 'management_comment' },
  { label: 'DO Remarks', key: 'DO_remarks' },
  { label: 'User Remarks', key: 'user_remarks' },
];

const getStatusClass = (status) => {
  const classes = {
    P: 'bg-yellow-100 text-yellow-800',
    R: 'bg-green-100 text-green-800',
    A: 'bg-blue-100 text-blue-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const getStatusText = (status) => {
  const statusTexts = {
    P: 'Pending',
    R: 'Resolved',
    A: 'Approved',
  };
  return statusTexts[status] || 'Unknown';
};

const resolveCapa = async () => {
  const remarks = prompt('Please enter Dealing Officer Remarks/Reason for Resolved:');
  if (remarks) {
    try {
      await apiservice.patchBmhcCapa(capa.value.id, {
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
.badge-check {
  @apply bg-green-100 text-green-800;
}

.badge-x {
  @apply bg-red-100 text-red-800;
}
</style>
