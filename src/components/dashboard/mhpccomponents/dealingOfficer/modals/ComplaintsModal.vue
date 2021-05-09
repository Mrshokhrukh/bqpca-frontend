```vue
<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10"> <!-- Main modal z-10 -->
      <TransitionChild
        as="div"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="div"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                Manage Complaint: {{ localFormData.complaint_id }}
              </DialogTitle>

              <div v-if="!props.complaint" class="mt-4 text-center">
                <p class="text-gray-500">Loading complaint details...</p>
              </div>
              <div v-else class="mt-4 space-y-6">
                <!-- Original Complaint Details -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong class="block text-gray-700">Complainant:</strong>
                    <p class="text-gray-600">{{ localFormData.submitted_by_name }}</p>
                  </div>
                  <div>
                    <strong class="block text-gray-700">Contact:</strong>
                    <p class="text-gray-600">{{ localFormData.submitted_by_email }} | {{ localFormData.submitted_by_contact_number }}</p>
                  </div>
                  <div>
                    <strong class="block text-gray-700">Initially Reported Professional:</strong>
                    <p class="text-gray-600">{{ localFormData.professional_name || 'N/A' }} ({{ localFormData.professional_designation || 'N/A' }})</p>
                  </div>
                  <div>
                    <strong class="block text-gray-700">Workplace (Initially Reported):</strong>
                    <p class="text-gray-600">{{ localFormData.professional_workplace || 'N/A' }}</p>
                  </div>
                  <div>
                    <strong class="block text-gray-700">Incident Date:</strong>
                    <p class="text-gray-600">{{ formatDate(localFormData.incident_datetime) }}</p>
                  </div>
                  <div>
                    <strong class="block text-gray-700">Date Submitted:</strong>
                    <p class="text-gray-600">{{ formatDate(localFormData.created_at) }}</p>
                  </div>
                  <div class="md:col-span-2">
                    <strong class="block text-gray-700">Grievance Details:</strong>
                    <p class="text-gray-600 bg-gray-50 p-2 rounded border max-h-40 overflow-y-auto">
                      {{ localFormData.grievance_details }}
                    </p>
                  </div>
                  <div v-if="localFormData.attachment" class="md:col-span-2">
                    <strong class="block text-gray-700">Attachment:</strong>
                    <a :href="localFormData.attachment" target="_blank" class="text-blue-600 hover:underline">
                      View Attachment
                    </a>
                  </div>
                </div>
                <hr/>

                <!-- Fields for Dealing Officer to Update -->
                <div>
                  <label for="modal-status" class="block text-sm font-medium text-gray-700">Update Status:</label>
                  <select
                    id="modal-status"
                    v-model="localFormData.status"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  >
                    <option disabled value="">Please select a status</option>
                    <option v-for="statusOpt in complaintStatuses" :key="statusOpt.id || statusOpt.name || statusOpt" :value="statusOpt.name || statusOpt">
                      {{ statusOpt.name || statusOpt }}
                    </option>
                  </select>
                </div>

                <!-- Manage Professionals Implicated in Complaint Section -->
                <div class="space-y-3">
                  <div class="flex justify-between items-center">
                    <label class="block text-sm font-medium text-gray-700">Professionals Implicated in Complaint:</label>
                    <button
                      type="button"
                      @click="openProfessionalPickerModal"
                      class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >Assign Professionals

                    </button>
                  </div>

                  <!-- Display Implicated Professionals -->
                  <div v-if="localFormData.implicated_professionals_list && localFormData.implicated_professionals_list.length > 0" class="mt-1">
                    <p class="text-xs text-gray-500 mb-1">
                      {{ localFormData.implicated_professionals_list.length }} professional(s) implicated.
                    </p>
                    <ul class="space-y-1 max-h-48 overflow-y-auto border rounded-md p-2">
                      <li
                        v-for="(implicatedProf, index) in localFormData.implicated_professionals_list"
                        :key="implicatedProf.id"
                        class="flex justify-between items-center p-1.5 bg-gray-50 rounded-md text-sm"
                      >
                        <div>
                          <span class="font-medium">{{ implicatedProf.name }}</span>
                          <span class="block text-xs text-gray-500">CID: {{ implicatedProf.cid }} | Reg No: {{ implicatedProf.registration_no }}</span>
                        </div>
                        <button
                          type="button"
                          @click="removeImplicatedProfessional(index)"
                          class="text-red-500 hover:text-red-700 text-xs font-semibold p-1 hover:bg-red-100 rounded"
                          title="Remove from this complaint"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </li>
                    </ul>
                  </div>
                  <p v-else class="text-sm text-gray-500 mt-1 py-2 px-3 bg-gray-50 rounded-md border">
                    No professionals formally implicated. Click "Manage Implicated" to add.
                  </p>
                </div>
                <!-- End Manage Implicated Professionals Section -->

                <!-- Remarks -->
                <div>
                  <label for="modal-remarks" class="block text-sm font-medium text-gray-700">Internal Remarks/Notes:</label>
                  <textarea
                    id="modal-remarks"
                    v-model="localFormData.remarks"
                    rows="3"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                    placeholder="Add any internal notes or actions taken..."
                  ></textarea>
                </div>
              </div>

              <div class="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                  @click="closeModal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  :disabled="!props.complaint"
                  class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50"
                  @click="handleUpdate"
                >
                  Update Complaint
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Professional Picker Modal -->
  <ProfessionalPickerModal
    :is-open="isProfessionalPickerOpen"
    :initially-selected-ids="localFormData.implicated_professionals_list.map(p => p.id)"
    @close="isProfessionalPickerOpen = false"
    @confirm="handleProfessionalsSelected"
  />
</template>

<script setup>
import { ref, watch,  reactive, onBeforeUnmount } from 'vue';
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue';
import ProfessionalPickerModal from './ProfessionalPickerModal.vue';

const props = defineProps({
  isOpen: Boolean,
  complaint: Object,
  complaintStatuses: Array
});

const emit = defineEmits(['close', 'updated']);

const localFormData = reactive({
  id: null,
  complaint_id: '',
  grievance_details: '',
  professional_name: '',
  professional_designation: '',
  professional_workplace: '',
  incident_datetime: null,
  created_at: null,
  attachment: null,
  submitted_by_name: '',
  submitted_by_email: '',
  submitted_by_contact_number: '',
  professional_category_name: '',
  status: '',
  remarks: '',
  implicated_professionals_list: []
});

const isProfessionalPickerOpen = ref(false);
let isMounted = ref(true); // Track if component is mounted

const openProfessionalPickerModal = () => {
  if (isMounted.value) {
    isProfessionalPickerOpen.value = true;
  }
};

const handleProfessionalsSelected = (selectedProfessionalsFromPicker) => {
  if (isMounted.value) {
    localFormData.implicated_professionals_list = [...selectedProfessionalsFromPicker.map(p => ({...p}))];
    isProfessionalPickerOpen.value = false;
  }
};

const removeImplicatedProfessional = (index) => {
  if (isMounted.value) {
    localFormData.implicated_professionals_list.splice(index, 1);
  }
};

watch(() => props.complaint, (newComplaintData) => {
  if (!isMounted.value) return; // Skip if unmounted
  if (newComplaintData && typeof newComplaintData === 'object' && newComplaintData.id) {
    localFormData.id = newComplaintData.id;
    localFormData.complaint_id = newComplaintData.complaint_id || '';
    localFormData.grievance_details = newComplaintData.grievance_details || '';
    localFormData.professional_name = newComplaintData.professional_name || '';
    localFormData.professional_designation = newComplaintData.professional_designation || '';
    localFormData.professional_workplace = newComplaintData.professional_workplace || '';
    localFormData.incident_datetime = newComplaintData.incident_datetime || null;
    localFormData.created_at = newComplaintData.created_at || null;
    localFormData.attachment = newComplaintData.attachment || null;
    localFormData.submitted_by_name = newComplaintData.submitted_by_name || '';
    localFormData.submitted_by_email = newComplaintData.submitted_by_email || '';
    localFormData.submitted_by_contact_number = newComplaintData.submitted_by_contact_number || '';
    localFormData.professional_category_name = newComplaintData.professional_category_name || '';
    localFormData.status = newComplaintData.status || '';
    localFormData.remarks = newComplaintData.remarks || '';
    localFormData.implicated_professionals_list = Array.isArray(newComplaintData.implicated_professionals)
      ? newComplaintData.implicated_professionals.map(p => ({ ...p }))
      : [];
  } else if (newComplaintData === null) {
    Object.keys(localFormData).forEach(key => {
      if (key === 'implicated_professionals_list') {
        localFormData[key] = [];
      } else {
        localFormData[key] = (typeof localFormData[key] === 'string') ? '' : null;
      }
    });
    localFormData.id = null;
  }
}, { immediate: true, deep: true });

const closeModal = () => {
  if (isMounted.value) {
    emit('close');
    isProfessionalPickerOpen.value = false;
  }
};

const handleUpdate = () => {
  if (isMounted.value) {
    const updatePayload = {
      id: localFormData.id,
      status: localFormData.status,
      remarks: localFormData.remarks,
      implicated_professional_ids: localFormData.implicated_professionals_list.map(p => p.id),
    };
    console.log('Modal: Emitting update event with payload:', updatePayload);
    emit('updated', updatePayload);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  } catch (e) {
    console.error('Error formatting date:', e);
    return 'Invalid Date';
  }
};

// Cleanup on unmount
onBeforeUnmount(() => {
  isMounted.value = false;
});
</script>

<style scoped>
.max-h-40 {
  max-height: 10rem;
}
.max-h-48 {
  max-height: 12rem;
}
</style>
```