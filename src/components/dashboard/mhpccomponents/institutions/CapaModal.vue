<template>
  <TransitionRoot appear :show="!!capa" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 sm:p-6">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-3xl transform overflow-hidden rounded-xl bg-white shadow-xl transition-all max-h-[90vh] flex flex-col"
            >
              <!-- Modal Header -->
              <div
                class="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <DialogTitle as="h3" class="text-xl font-semibold text-gray-900">
                      CAPA Details
                    </DialogTitle>
                    <p class="mt-1 text-sm text-gray-500">
                      Facility: {{ capa.teaching_center?.institute_name }}
                    </p>
                  </div>
                  <button
                    @click="$emit('close')"
                    class="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 rounded-full p-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Modal Body -->
              <div class="flex-1 overflow-y-auto p-6 space-y-8">
                <!-- Inspection Info Card -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-100">
                  <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <h4 class="font-medium text-gray-700">Inspection Information</h4>
                  </div>
                  <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-600 mb-1"
                        >Facility Name</label
                      >
                      <p class="text-base text-gray-800">
                        {{ capa.teaching_center?.institute_name }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-600 mb-1"
                        >Inspection Period</label
                      >
                      <p class="text-base text-gray-800">
                        {{ capa.inspection_from_date }} - {{ capa.inspection_to_date }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-600 mb-1"
                        >Dzongkhag/Thromde</label
                      >
                      <p class="text-base text-gray-800">
                        {{ capa.teaching_center?.state_dzongkhag }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-600 mb-1">City/Gewog</label>
                      <p class="text-base text-gray-800">{{ capa.teaching_center?.city_gewog }}</p>
                    </div>
                    <div class="md:col-span-2">
                      <label class="block text-sm font-medium text-gray-600 mb-1"
                        >Address/Location</label
                      >
                      <p class="text-base text-gray-800">
                        {{ capa.teaching_center?.center_location }}
                      </p>
                    </div>
                    <div class="md:col-span-2">
                      <label class="block text-sm font-medium text-gray-600 mb-1">Status</label>
                      <span
                        class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                        :class="{
                          'bg-yellow-100 text-yellow-800': capa.status === 'P',
                          'bg-green-100 text-green-800': capa.status === 'R',
                          'bg-blue-100 text-blue-800': capa.status === 'C',
                          'bg-gray-100 text-gray-800': !['P', 'R', 'C'].includes(capa.status),
                        }"
                      >
                        {{ getStatusText(capa.status) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Observation Card -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-100">
                  <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <h4 class="font-medium text-gray-700">Observation Details</h4>
                  </div>
                  <div class="p-4 space-y-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-600 mb-1"
                        >Observation Description</label
                      >
                      <p
                        class="text-base text-gray-800 bg-gray-50 p-4 rounded-md border border-gray-200"
                      >
                        {{ capa.observation_description }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-600 mb-1">Root Cause</label>
                      <p
                        class="text-base text-gray-800 bg-gray-50 p-4 rounded-md border border-gray-200"
                      >
                        {{ capa.root_cause }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- CAPA Form Card -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-100">
                  <div class="px-4 py-3 bg-indigo-50 border-b border-indigo-200">
                    <h4 class="font-medium text-indigo-700">Corrective Action Plan</h4>
                  </div>
                  <div class="p-4 space-y-6">
                    <div>
                      <label for="capa-plan" class="block text-sm font-medium text-gray-700">
                        Corrective and Preventive Action
                      </label>
                      <textarea
                        id="capa-plan"
                        v-model="internalCapa.capa"
                        rows="4"
                        :disabled="true"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 py-2 px-3 focus:border-indigo-500 focus:ring-indigo-500 text-base"
                      ></textarea>
                    </div>
                    <div>
                      <label
                        for="implementation-timeline"
                        class="block text-sm font-medium text-gray-700"
                      >
                        Implementation Timeline
                      </label>
                      <input
                        type="text"
                        id="implementation-timeline"
                        v-model="internalCapa.implementation_timeline"
                        :disabled="true"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 py-2 px-3 focus:border-indigo-500 focus:ring-indigo-500 text-base"
                      />
                    </div>
                    <div>
                      <label
                        for="management-comment"
                        class="block text-sm font-medium text-gray-700"
                      >
                        Management Comments
                      </label>
                      <textarea
                        id="management-comment"
                        v-model="internalCapa.management_comment"
                        rows="3"
                        :disabled="true"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 py-2 px-3 focus:border-indigo-500 focus:ring-indigo-500 text-base"
                      ></textarea>
                    </div>
                    <!-- Conditionally render DO Remarks -->
                    <div v-if="internalCapa.user_remarks">
                      <label for="do-remarks" class="block text-sm font-medium text-gray-700">
                        Dealing Officer Remarks
                      </label>
                      <textarea
                        id="do-remarks"
                        v-model="internalCapa.DO_remarks"
                        rows="3"
                        :disabled="true"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50 py-2 px-3 focus:border-indigo-500 focus:ring-indigo-500 text-base"
                      ></textarea>
                    </div>
                    <div>
                      <label for="user-remarks" class="block text-sm font-medium text-gray-700">
                        Your Remarks
                      </label>
                      <textarea
                        id="user-remarks"
                        v-model="internalCapa.user_remarks"
                        rows="3"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:border-indigo-500 focus:ring-indigo-500 text-base"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer Buttons -->
              <div
                class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-4 space-y-3 space-y-reverse sm:space-y-0"
              >
                <button
                  type="button"
                  class="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  @click="$emit('close')"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center justify-center space-x-2"
                  @click="submitCapa"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Submit Remarks</span>
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { ref, onMounted } from 'vue' // Import onMounted
import apiServices from '@/services/services'
import { useToast } from 'vue-toastification'

const props = defineProps({
  capa: {
    type: Object,
    required: true,
  },
})

const toast = useToast()
const emit = defineEmits(['close', 'capa-updated'])

const internalCapa = ref({})

onMounted(() => {
  // *Deep* clone props.capa using JSON.parse(JSON.stringify()):
  internalCapa.value = JSON.parse(JSON.stringify(props.capa))
})

const submitCapa = async () => {
  try {
    if (!internalCapa.value.user_remarks) {
      toast.warning('Please enter your remarks before submitting.')
      return
    }

    const dataToSubmit = {
      user_remarks: internalCapa.value.user_remarks,
    }

    const response = await apiServices.patchMhpcCapa(internalCapa.value.id, dataToSubmit)

    // Emit the updated data:
    emit('capa-updated', response.data)
    emit('close') // Close the modal *after* successful update
  } catch (error) {
    console.error('Error updating CAPA:', error)
    toast.error('Failed to update CAPA. Please try again.')
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'P':
      return 'Pending'
    case 'R':
      return 'Resolved'
    case 'C':
      return 'Cancelled'
    default:
      return 'Unknown'
  }
}
</script>

<style scoped>
/* Custom scrollbar (optional) */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 3px;
}
</style>
