<!-- modals/EcpfNameChangeModal.vue -->
<template>
  <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Modal backdrop, fixed overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

      <!-- This element is to trick the browser into centering the modal content. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"> </span>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                ECPF Name Change Application Details
              </h3>
              <div class="mt-4">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="grid grid-cols-1 gap-4">
                    <div class="border-b pb-2">
                      <p class="text-sm font-medium text-gray-500">Applicant Name</p>
                      <p class="text-sm font-bold text-gray-900">{{ application?.applicantName }}</p>
                    </div>
                    <div class="border-b pb-2">
                      <p class="text-sm font-medium text-gray-500">Current ECPF Name</p>
                      <p class="text-sm font-bold text-gray-900">{{ application?.currentEcpfName }}</p>
                    </div>
                    <div class="border-b pb-2">
                      <p class="text-sm font-medium text-gray-500">Proposed ECPF Name</p>
                      <p class="text-sm font-bold text-gray-900">{{ application?.proposedEcpfName }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500">Status</p>
                      <span :class="getStatusClasses(application?.status)">
                        {{ application?.status }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="mt-4">
                  <h4 class="text-md font-medium text-gray-800">Dealing Officer Action</h4>
                  <div class="mt-2">
                    <label class="block text-sm font-medium text-gray-700">Remarks</label>
                    <textarea
                      rows="3"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Enter remarks for this application..."></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
            Approve
          </button>
          <button type="button" class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
            Reject
          </button>
          <button type="button" class="mt-3 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm" @click="closeModal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

defineProps({
  isOpen: Boolean,
  application: {
    type: Object,
    default: () => null
  }
});

const emit = defineEmits(['close-modal']);

const closeModal = () => {
  emit('close-modal');
};

const getStatusClasses = (status) => {
  if (!status) return 'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-gray-100 text-gray-800';

  return [
    'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap',
    {
      'bg-yellow-100 text-yellow-800': status === 'Pending Review',
      'bg-green-100 text-green-800': status === 'Approved',
      'bg-red-100 text-red-800': status === 'Rejected',
      'bg-gray-100 text-gray-800': status === 'Draft'
    }
  ];
};
</script>
