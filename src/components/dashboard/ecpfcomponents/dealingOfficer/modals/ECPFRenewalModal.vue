<template>
  <div
    v-if="isOpen"
    class="fixed z-10 inset-0 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <!-- Modal overlay -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        @click="$emit('close')"
      ></div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"> </span>

      <div
        class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                ECPF Name Change Application Details
              </h3>
              <div class="mt-4 grid grid-cols-1 gap-4">
                <!-- Current ECPF Details -->
                <div class="border-b pb-2">
                  <h4 class="text-sm font-semibold text-gray-700 mb-2">Current ECPF Information</h4>
                  <div class="grid grid-cols-2 gap-2 text-sm">
                    <div><span class="font-medium">ECPF Name:</span></div>
                    <div>{{ application.currentDetails.ecpfName }}</div>
                    <div><span class="font-medium">Licence No.:</span></div>
                    <div>{{ application.currentDetails.licenceNo }}</div>
                    <div><span class="font-medium">Location:</span></div>
                    <div>{{ application.currentDetails.location }}</div>
                    <div><span class="font-medium">Name of Proprietor:</span></div>
                    <div>{{ application.currentDetails.proprietorName }}</div>
                    <div><span class="font-medium">CID:</span></div>
                    <div>{{ application.currentDetails.cid }}</div>
                    <div><span class="font-medium">Contact No.:</span></div>
                    <div>{{ application.currentDetails.contactNo }}</div>
                    <div><span class="font-medium">Email Address:</span></div>
                    <div>{{ application.currentDetails.emailAddress }}</div>
                  </div>
                </div>

                <!-- Proposed Change -->
                <div class="border-b pb-2">
                  <h4 class="text-sm font-semibold text-gray-700 mb-2">Proposed Change</h4>
                  <div class="grid grid-cols-2 gap-2 text-sm">
                    <div><span class="font-medium">Proposed Name of ECPF:</span></div>
                    <div>{{ application.proposedChange.proposedName }}</div>
                    <div><span class="font-medium">Remarks:</span></div>
                    <div>{{ application.proposedChange.remarks }}</div>
                  </div>
                </div>

                <!-- External Party Contact Details -->
                <div class="border-b pb-2">
                  <h4 class="text-sm font-semibold text-gray-700 mb-2">
                    External Party Contact Details
                  </h4>
                  <div class="grid grid-cols-2 gap-2 text-sm">
                    <div><span class="font-medium">Name of Proprietor:</span></div>
                    <div>{{ application.externalPartyContactDetails.nameOfProprietor }}</div>
                    <div><span class="font-medium">Nationality:</span></div>
                    <div>{{ application.externalPartyContactDetails.nationality }}</div>
                    <div><span class="font-medium">Designation:</span></div>
                    <div>{{ application.externalPartyContactDetails.designation }}</div>
                    <div><span class="font-medium">Email Address:</span></div>
                    <div>{{ application.externalPartyContactDetails.emailAddress }}</div>
                    <div><span class="font-medium">Contact Number:</span></div>
                    <div>{{ application.externalPartyContactDetails.contactNumber }}</div>
                    <div><span class="font-medium">Website:</span></div>
                    <div>{{ application.externalPartyContactDetails.website }}</div>
                  </div>
                </div>

                <!-- Collaboration Description -->
                <div class="border-b pb-2">
                  <h4 class="text-sm font-semibold text-gray-700 mb-2">
                    Collaboration Description
                  </h4>
                  <div class="grid grid-cols-1 gap-2 text-sm">
                    <div>{{ application.collaborationDescription }}</div>
                  </div>
                </div>

                <!-- Supporting Documents -->
                <div>
                  <h4 class="text-sm font-semibold text-gray-700 mb-2">Supporting Documents</h4>
                  <div class="grid grid-cols-1 gap-2 text-sm">
                    <div>{{ application.supportingDocuments }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Approve
          </button>
          <button
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:mr-3 sm:w-auto sm:text-sm"
          >
            Reject
          </button>
          <button
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:mr-3 sm:w-auto sm:text-sm"
            @click="$emit('close')"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  application: Object,
})

defineEmits(['close'])
</script>
