<template>
  <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
      aria-modal="true">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" @click="$emit('close')"></div>

        <!-- Modal panel -->
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <!-- Header -->
          <div class="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              Add CAPA for {{ instituteName || `Institute #${instituteId}` }}
            </h3>
            <button @click="$emit('close')"
              class="rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400">
              <XIcon class="h-5 w-5" />
            </button>
          </div>

          <!-- Form content -->
          <div class="px-6 pt-6 pb-4 max-h-[70vh] overflow-y-auto">
            <!-- Wrap form for potential validation handling -->
            <form @submit.prevent="submitForm" class="space-y-6" id="add-capa-form">
              <!-- Date range section -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label for="inspection_from_date" class="block text-sm font-medium text-gray-700">
                    Inspection From Date <span class="text-red-500">*</span>
                  </label>
                  <input type="date" id="inspection_from_date" v-model="capaForm.inspection_from_date"
                    @change="updateImplementationTimeline"
                    class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                    required />
                </div>
                <div class="space-y-2">
                  <label for="inspection_to_date" class="block text-sm font-medium text-gray-700">
                    Inspection To Date <span class="text-red-500">*</span>
                  </label>
                  <input type="date" id="inspection_to_date" v-model="capaForm.inspection_to_date"
                    @change="updateImplementationTimeline"
                    class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                    required />
                </div>
              </div>

              <!-- CAPA details section -->
              <div class="space-y-6">
                <div class="space-y-2">
                  <label for="observation_description" class="block text-sm font-medium text-gray-700">
                    Observation Description <span class="text-red-500">*</span>
                  </label>
                  <textarea id="observation_description" v-model="capaForm.observation_description" rows="3"
                    class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                    required></textarea>
                </div>

                <div class="space-y-2">
                  <label for="root_cause" class="block text-sm font-medium text-gray-700">
                    Root Cause <span class="text-red-500">*</span>
                  </label>
                  <textarea id="root_cause" v-model="capaForm.root_cause" rows="3"
                    class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                    required></textarea>
                </div>

                <div class="space-y-2">
                  <label for="capa" class="block text-sm font-medium text-gray-700">
                    CAPA <span class="text-red-500">*</span>
                  </label>
                  <textarea id="capa" v-model="capaForm.capa" rows="3"
                    class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                    required></textarea>
                </div>
              </div>

              <!-- Implementation and status section -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label for="implementation_timeline" class="block text-sm font-medium text-gray-700">
                    Implementation Timeline <span class="text-red-500">*</span>
                  </label>
                  <input type="text" id="implementation_timeline" v-model="capaForm.implementation_timeline"
                    class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm bg-gray-100"
                    required readonly />
                </div>
                <!-- NEW: Status Field -->
                <div class="space-y-2">
                  <label for="status" class="block text-sm font-medium text-gray-700">
                    Status <span class="text-red-500">*</span>
                  </label>
                  <select id="status" v-model="capaForm.status"
                    class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                    required>
                    <option value="" disabled>Select status</option>
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="CLOSED">Closed</option>
                    <option value="PENDING_VERIFICATION">Pending Verification</option>
                    <!-- Add other status options your backend expects -->
                  </select>
                  <!-- You can add frontend validation error display here later if needed -->
                  <!-- <p v-if="errors.status" class="mt-1 text-xs text-red-600">{{ errors.status }}</p> -->
                </div>
              </div>

              <!-- Remarks & Comments section -->
              <div class="pt-4 mt-4 border-t border-gray-200">
                 <h4 class="text-base font-medium text-gray-800 mb-4">Remarks & Comments</h4>
                 <!-- NEW: DO Remarks Field -->
                 <div class="space-y-2 mb-4">
                    <label for="do_remarks" class="block text-sm font-medium text-gray-700">
                        DO Remarks <span class="text-red-500">*</span>
                    </label>
                    <textarea id="do_remarks" v-model="capaForm.DO_remarks" rows="3"
                        class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                        required></textarea>
                     <!-- <p v-if="errors.DO_remarks" class="mt-1 text-xs text-red-600">{{ errors.DO_remarks }}</p> -->
                 </div>

                 <!-- NEW: User Remarks Field -->
                 <div class="space-y-2 mb-4">
                    <label for="user_remarks" class="block text-sm font-medium text-gray-700">
                        User Remarks <span class="text-red-500">*</span>
                    </label>
                    <textarea id="user_remarks" v-model="capaForm.user_remarks" rows="3"
                        class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                        required></textarea>
                     <!-- <p v-if="errors.user_remarks" class="mt-1 text-xs text-red-600">{{ errors.user_remarks }}</p> -->
                 </div>

                 <!-- Existing: Management Comment -->
                 <div class="space-y-2">
                    <label for="management_comment" class="block text-sm font-medium text-gray-600">
                    Management Comment
                    </label>
                    <textarea id="management_comment" v-model="capaForm.management_comment" rows="2"
                    class="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm"></textarea>
                 </div>
              </div>
              <!-- Hidden submit button for form association, real trigger is footer button -->
              <button type="submit" class="hidden">Submit</button>
            </form>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 sm:flex sm:flex-row-reverse">
            <!-- Changed button type to submit and added form="add-capa-form" -->
            <button type="submit" form="add-capa-form"
              class="w-full inline-flex justify-center rounded-md border border-blue-500 shadow-sm px-5 py-2.5 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
              Save CAPA
            </button>
            <button type="button" @click="$emit('close')"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-5 py-2.5 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { XIcon } from 'lucide-vue-next'; // Assuming you use lucide icons

const props = defineProps({
  show: Boolean,
  instituteId: Number,
  instituteName: String
});

const emit = defineEmits(['close', 'save']);

// --- State ---
// Added DO_remarks, user_remarks, status
const capaForm = ref({
  inspection_from_date: '',
  inspection_to_date: '',
  observation_description: '',
  root_cause: '',
  capa: '',
  implementation_timeline: '',
  management_comment: '',
  teaching_center: 1, // Ensure this is correct or dynamically set if needed
  DO_remarks: '',      // NEW
  user_remarks: '',     // NEW
  status: '',           // NEW (Set to '' for placeholder, or 'OPEN' if default)
});

// --- Methods ---
// Updated resetForm to include new fields
const resetForm = () => {
  capaForm.value = {
    inspection_from_date: '',
    inspection_to_date: '',
    observation_description: '',
    root_cause: '',
    capa: '',
    implementation_timeline: '',
    management_comment: '',
    teaching_center: 1, // Reset to default
    DO_remarks: '',      // NEW - Reset
    user_remarks: '',     // NEW - Reset
    status: '',           // NEW - Reset
  };
  // If you add frontend validation errors, clear them here:
  // Object.keys(errors).forEach(key => delete errors[key]);
};

// Watcher to reset form when modal opens
watch(() => props.show, (newValue) => {
  if (newValue) {
    resetForm();
  }
});

// Also reset on mount if initially shown (edge case)
onMounted(() => {
  if (props.show) {
    resetForm();
  }
});

// Function to calculate timeline remains the same
const updateImplementationTimeline = () => {
  if (capaForm.value.inspection_from_date && capaForm.value.inspection_to_date) {
    try {
        const fromDate = new Date(capaForm.value.inspection_from_date);
        const toDate = new Date(capaForm.value.inspection_to_date);

        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            throw new Error("Invalid date format");
        }
         if (toDate < fromDate) {
             capaForm.value.implementation_timeline = 'End date before start date';
             return; // Or handle error more explicitly
         }

        const timeDiff = toDate.getTime() - fromDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // Inclusive

        capaForm.value.implementation_timeline = `${daysDiff} days`;
    } catch (error) {
        console.error("Error calculating timeline:", error);
        capaForm.value.implementation_timeline = 'Error'; // Indicate error
    }
  } else {
    capaForm.value.implementation_timeline = ''; // Reset if dates are cleared
  }
};

// Submit function - now includes the new fields in capaForm.value
const submitForm = () => {
  // Basic check for HTML5 required fields (browser validation should handle this mostly)
  // You might want more robust JS validation later
  console.log('Submitting CAPA form:', capaForm.value);
  emit('save', { ...capaForm.value }); // Emit a copy to prevent reactivity issues upstream
};
</script>

<style scoped>
/* Add required asterisk styling if needed */
label span.text-red-500 {
  margin-left: 2px;
}
/* Add specific styling for error states if you implement JS validation */
/* .border-red-500 { border-color: #ef4444; } */
</style>

<style scoped>
/* Add required asterisk styling if needed */
label span.text-red-500 {
  margin-left: 2px;
}
/* Add specific styling for error states if you implement JS validation */
/* .border-red-500 { border-color: #ef4444; } */
</style>
