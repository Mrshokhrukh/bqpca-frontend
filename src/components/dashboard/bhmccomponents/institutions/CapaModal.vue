<template>
  <TransitionRoot appear :show="!!capa" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-50">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 sm:p-6">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-3xl transform overflow-hidden rounded-xl bg-white shadow-xl transition-all max-h-[90vh] flex flex-col">

              <!-- Modal Header -->
              <div class="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div class="flex items-center justify-between">
                  <div>
                    <DialogTitle as="h3" class="text-xl font-semibold text-gray-900">
                      CAPA Details
                    </DialogTitle>
                    <p class="mt-1 text-sm text-gray-500">
                      Facility: {{ capa.facilityName }}
                    </p>
                  </div>
                  <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Modal Body -->
              <div class="flex-1 overflow-y-auto p-6 space-y-6">
                <!-- Inspection Info Card -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div class="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <h4 class="font-medium text-gray-700">Inspection Information</h4>
                  </div>
                  <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-xs font-medium text-gray-500 mb-1">Facility Name</label>
                      <p class="text-sm text-gray-800">{{ capa.facilityName }}</p>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-500 mb-1">Inspection Period</label>
                      <p class="text-sm text-gray-800">{{ capa.inspectionDateFrom }} - {{ capa.inspectionDateTo }}</p>
                    </div>
                    <div class="md:col-span-2">
                      <label class="block text-xs font-medium text-gray-500 mb-1">Status</label>
                      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                        :class="{
                          'bg-yellow-100 text-yellow-800': capa.status === 'Pending',
                          'bg-green-100 text-green-800': capa.status === 'Completed',
                          'bg-blue-100 text-blue-800': capa.status === 'In Progress',
                          'bg-gray-100 text-gray-800': !['Pending', 'Completed', 'In Progress'].includes(capa.status)
                        }">
                        {{ capa.status }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Observation Card -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div class="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <h4 class="font-medium text-gray-700">Observation Details</h4>
                  </div>
                  <div class="p-4 space-y-4">
                    <div>
                      <label class="block text-xs font-medium text-gray-500 mb-1">Observation Description</label>
                      <p class="text-sm text-gray-800 bg-gray-50 p-3 rounded border border-gray-100">{{ capa.observationDescription }}</p>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-500 mb-1">Root Cause</label>
                      <p class="text-sm text-gray-800 bg-gray-50 p-3 rounded border border-gray-100">{{ capa.rootCause }}</p>
                    </div>
                  </div>
                </div>

                <!-- CAPA Form Card -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div class="px-4 py-3 bg-indigo-50 border-b border-indigo-100">
                    <h4 class="font-medium text-indigo-700">Corrective Action Plan</h4>
                  </div>
                  <div class="p-4 space-y-4">
                    <div>
                      <label for="capa-plan" class="block text-sm font-medium text-gray-700">
                        Corrective and Preventive Action <span class="text-red-500">*</span>
                      </label>
                      <textarea id="capa-plan" v-model="internalCapa.capaPlan" rows="3"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
                    </div>
                    <div>
                      <label for="implementation-timeline" class="block text-sm font-medium text-gray-700">
                        Implementation Timeline <span class="text-red-500">*</span>
                      </label>
                      <input type="text" id="implementation-timeline" v-model="internalCapa.implementationTimeline"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    </div>
                    <div>
                      <label for="management-comment" class="block text-sm font-medium text-gray-700">
                        Management Comments
                      </label>
                      <textarea id="management-comment" v-model="internalCapa.managementComment" rows="2"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
                    </div>
                    <div>
                      <label for="remarks" class="block text-sm font-medium text-gray-700">
                        Additional Remarks
                      </label>
                      <textarea id="remarks" v-model="internalCapa.remarks" rows="2"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer Buttons -->
              <div class="bg-gray-50 px-6 py-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-4 space-y-3 space-y-reverse sm:space-y-0">
                <button type="button"
                  class="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  @click="$emit('close')">
                  Cancel
                </button>
                <button type="button"
                  class="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center justify-center space-x-2"
                  @click="submitCapa">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Submit CAPA</span>
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
import { defineProps, defineEmits, ref, watch } from 'vue';

const props = defineProps({
  capa: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'capa-updated']);

// Create a reactive copy of the capa prop to allow local modifications in the modal
const internalCapa = ref({ ...props.capa });

// Watch for changes in the prop (if the parent component updates the capa)
watch(
  () => props.capa,
  (newCapa) => {
    internalCapa.value = { ...newCapa }; // Update internal copy when prop changes
  },
  { deep: true }
);

const submitCapa = () => {
  emit('capa-updated', internalCapa.value);
};
</script>

<style scoped>
/* Custom scrollbar */
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
