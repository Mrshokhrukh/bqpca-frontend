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
      <!-- Background overlay, when modal is open. -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        @click="$emit('close-modal')"
      ></div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>

      <!-- Modal panel -->
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <div class="flex justify-between items-center">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Teaching Institute Details
                </h3>
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-yellow-100 text-yellow-800':
                      hospitalDetails.tc_review_decision === 'Pending',
                    'bg-green-100 text-green-800':
                      hospitalDetails.tc_review_decision === 'Approved',
                    'bg-red-100 text-red-800': hospitalDetails.tc_review_decision === 'Regretted',
                  }"
                >
                  {{ hospitalDetails.tc_review_decision || 'Pending' }}
                </span>
              </div>
              <div class="mt-2">
                <dl class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <!-- Center Details -->
                  <div class="px-4 py-2 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Center Name</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {{ hospitalDetails.center_name }}
                    </dd>
                  </div>
                  <div class="px-4 py-2 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Location</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {{ hospitalDetails.center_location }}
                    </dd>
                  </div>
                  <div class="px-4 py-2 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Target Category</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {{ hospitalDetails.target_category }}
                    </dd>
                  </div>
                  <div class="px-4 py-2 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">City/Gewog</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {{ hospitalDetails.city_gewog }}
                    </dd>
                  </div>
                  <div class="px-4 py-2 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">State/Dzongkhag</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {{ hospitalDetails.state_dzongkhag }}
                    </dd>
                  </div>
                  <div class="px-4 py-2 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Remarks</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {{ hospitalDetails.remarks }}
                    </dd>
                  </div>
                  <div class="px-4 py-2 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Valid From</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {{ hospitalDetails.valid_since }}
                    </dd>
                  </div>
                  <div class="px-4 py-2 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Valid Till</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {{ hospitalDetails.valid_till }}
                    </dd>
                  </div>

                  <!-- Show regret reason if regretted -->
                  <div
                    v-if="hospitalDetails.tc_review_decision === 'Regretted'"
                    class="col-span-2 px-4 py-2 bg-red-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                  >
                    <dt class="text-sm font-medium text-red-500">Regret Reason</dt>
                    <dd class="mt-1 text-sm text-red-800 sm:mt-0 sm:col-span-2">
                      {{ hospitalDetails.tc_reason_if_rejected }}
                    </dd>
                  </div>

                  <!-- Institute Details Section Header -->
                  <div class="col-span-2 px-4 py-3 bg-blue-50 rounded-lg">
                    <h4 class="font-medium text-blue-800">Institute Information</h4>
                  </div>

                  <!-- Institute Details (if institute object exists) -->
                  <template v-if="hospitalDetails.institute">
                    <div class="px-4 py-2 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Institution Name</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {{ hospitalDetails.institute.name_of_institution }}
                      </dd>
                    </div>
                    <div class="px-4 py-2 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">CID</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {{ hospitalDetails.institute.CID }}
                      </dd>
                    </div>
                    <div class="px-4 py-2 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Contact No</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {{ hospitalDetails.institute.contact_no }}
                      </dd>
                    </div>
                    <div class="px-4 py-2 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Email Address</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {{ hospitalDetails.institute.email_address }}
                      </dd>
                    </div>
                    <div class="px-4 py-2 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Country</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {{ hospitalDetails.institute.country }}
                      </dd>
                    </div>
                    <div class="px-4 py-2 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Address</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {{ hospitalDetails.institute.address }}
                      </dd>
                    </div>
                    <div class="px-4 py-2 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Training Institute</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {{ hospitalDetails.institute.teaching_institute }}
                      </dd>
                    </div>
                    <div class="px-4 py-2 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Course Title</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {{ hospitalDetails.institute.title_of_course }}
                      </dd>
                    </div>
                    <div class="px-4 py-2 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">Website</dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {{ hospitalDetails.institute.website }}
                      </dd>
                    </div>
                  </template>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            v-if="hospitalDetails.tc_review_decision !== 'Approved'"
            type="button"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            @click="$emit('approve')"
          >
            Approve
          </button>
          <button
            v-if="hospitalDetails.tc_review_decision !== 'Regretted'"
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            @click="$emit('regret')"
          >
            Regret
          </button>
          <button
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            @click="$emit('close-modal')"
          >
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
  hospitalDetails: {
    type: Object,
    default: () => ({}),
  },
})

defineEmits(['close-modal', 'approve', 'regret'])
</script>
