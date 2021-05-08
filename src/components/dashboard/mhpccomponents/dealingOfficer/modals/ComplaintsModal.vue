<!-- ComplaintManageModal.vue -->
<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-10">
      <TransitionChild
        as="template"
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
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                Manage Complaint: {{ localFormData.complaint_id }}
              </DialogTitle>

              <div v-if="!props.complaint" class="mt-4 text-center">
                <p class="text-gray-500">Loading complaint details...</p>
              </div>
              <div v-else class="mt-4 space-y-4">
                <!-- Display Original Complaint Details (Mostly Read-Only) -->
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
                    <strong class="block text-gray-700">Professional Involved:</strong>
                    <p class="text-gray-600">{{ localFormData.professional_name }} ({{ localFormData.professional_designation }})</p>
                  </div>
                   <div>
                    <strong class="block text-gray-700">Workplace:</strong>
                    <p class="text-gray-600">{{ localFormData.professional_workplace }}</p>
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

                <div>
                  <label for="modal-remarks" class="block text-sm font-medium text-gray-700">Internal Remarks/Notes:</label>
                  <textarea
                    id="modal-remarks"
                    v-model="localFormData.remarks"
                    rows="4"
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
</template>

<script setup>
import {  watch, defineProps, defineEmits, reactive } from 'vue';
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'; // Assuming you have headlessui installed

const props = defineProps({
  isOpen: Boolean,
  complaint: Object, // This will be the selectedComplaint object
  complaintStatuses: Array // Array of status objects {id, name} or strings
});

const emit = defineEmits(['close', 'updated']);

// Reactive form data for the modal
const localFormData = reactive({
  // Complaint's own ID (PK)
  id: null,
  // Displayable Complaint ID (e.g., COMP-XXXX)
  complaint_id: '',

  // Fields for display (mostly from original complaint)
  grievance_details: '',
  professional_name: '',
  professional_designation: '',
  professional_workplace: '',
  incident_datetime: null,
  created_at: null, // Date submitted
  attachment: null,
  submitted_by_name: '',
  submitted_by_email: '',
  submitted_by_contact_number: '',
  professional_category_name: '', // From the fetched detail

  // Fields for officer to update
  status: '',
  remarks: ''
});

// Watch the incoming complaint prop to update the local form data
watch(() => props.complaint, (newComplaintData) => {
  console.log('Modal: props.complaint changed:', newComplaintData);
  if (newComplaintData && typeof newComplaintData === 'object' && newComplaintData.id) {
    // Assign all relevant fields from the prop to localFormData
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


    // Fields officer can edit
    localFormData.status = newComplaintData.status || '';
    localFormData.remarks = newComplaintData.remarks || ''; // Load existing remarks

  } else if (newComplaintData === null) {
    // Reset form when complaint is null (e.g., modal closed and prop reset)
    Object.keys(localFormData).forEach(key => {
      localFormData[key] = (typeof localFormData[key] === 'string') ? '' : null;
    });
    localFormData.id = null; // Ensure ID is also reset
  }
}, { immediate: true, deep: true });

const closeModal = () => {
  emit('close');
};

const handleUpdate = () => {
  // Prepare only the data that needs to be sent for update
  // Typically, this would be the fields the officer can change: status and remarks.
  // The `id` is crucial for the backend to know which complaint to update.
  const updatePayload = {
    id: localFormData.id, // The PK of the complaint
    status: localFormData.status,
    remarks: localFormData.remarks
    // Add any other fields that the dealing officer is allowed to modify via this modal
  };
  console.log('Modal: Emitting update event with payload:', updatePayload);
  emit('updated', updatePayload);
};

// Utility function for formatting dates (can be moved to a utils file)
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

</script>

<style scoped>
/* Add any modal-specific styles if needed */
.max-h-40 {
  max-height: 10rem; /* 160px */
}
</style>