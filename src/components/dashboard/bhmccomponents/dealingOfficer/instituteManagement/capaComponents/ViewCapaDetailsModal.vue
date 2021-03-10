<template>
  <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="view-details-modal-title" role="dialog"
      aria-modal="true">
      <div class="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm transition-opacity"
          @click="$emit('close')">
        </div>

        <!-- Modal panel -->
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <!-- Modal header -->
          <div class="bg-gradient-to-r from-gray-700 to-gray-900 px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 class="text-lg leading-6 font-medium text-white" id="view-details-modal-title">
              CAPA Details - CAPA #{{ capa?.id }}
            </h3>
            <button @click="$emit('close')"
              class="rounded-full p-1 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white">
              <XIcon class="h-6 w-6" />
            </button>
          </div>

          <!-- Modal body -->
          <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[70vh] overflow-y-auto">
            <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">Institute</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ instituteName }}</dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">Status</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  <span :class="getStatusClass(capa?.status)" class="px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ getStatusText(capa?.status) }}
                  </span>
                </dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">Inspection From Date</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ capa?.inspection_from_date }}</dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">Inspection To Date</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ capa?.inspection_to_date }}</dd>
              </div>
              <div class="sm:col-span-2">
                <dt class="text-sm font-medium text-gray-500">Observation Description</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ capa?.observation_description }}</dd>
              </div>
              <div class="sm:col-span-2">
                <dt class="text-sm font-medium text-gray-500">Root Cause</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ capa?.root_cause }}</dd>
              </div>
              <div class="sm:col-span-2">
                <dt class="text-sm font-medium text-gray-500">CAPA</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ capa?.capa }}</dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">Implementation Timeline</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ capa?.implementation_timeline }}</dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">Management Comment</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ capa?.management_comment }}</dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">DO Remarks</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ capa?.DO_remarks }}</dd>
              </div>
              <div class="sm:col-span-1">
                <dt class="text-sm font-medium text-gray-500">User Remarks</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ capa?.user_remarks }}</dd>
              </div>
            </dl>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" @click="$emit('close')"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { XIcon } from 'lucide-vue-next';

defineProps({
  show: Boolean,
  capa: Object, // No 'required' here, can be null initially
  instituteName: String
});

defineEmits(['close']);

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

</script>
