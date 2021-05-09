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
              <div v-else class="mt-4 space-y-6">
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
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Manage Professionals Implicated in this Complaint:</label>
                  <div class="flex space-x-2">
                    <input
                      type="text"
                      v-model="professionalSearchQuery"
                      @keyup.enter="searchProfessionals"
                      placeholder="Search by CID or Registration No."
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                    />
                    <button
                      type="button"
                      @click="searchProfessionals"
                      :disabled="isSearchingProfessionals"
                      class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {{ isSearchingProfessionals ? 'Searching...' : 'Search' }}
                    </button>
                  </div>

                  <!-- Search Results -->
                  <div v-if="professionalSearchResults.length > 0" class="mt-2 border rounded-md max-h-48 overflow-y-auto">
                    <ul>
                      <li
                        v-for="prof in professionalSearchResults"
                        :key="prof.id"
                        class="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center text-sm"
                        @click="addImplicatedProfessional(prof)"
                      >
                        <div>
                          <span class="font-semibold">{{ prof.name }}</span>
                          <span class="block text-xs text-gray-500">CID: {{ prof.cid }} | Reg No: {{ prof.registration_no }}</span>
                        </div>
                        <button
                          type="button"
                          class="ml-2 px-2 py-1 text-xs font-medium text-white bg-green-500 hover:bg-green-600 rounded-md"
                        >
                          Add to Implicated
                        </button>
                      </li>
                    </ul>
                  </div>
                  <p v-if="professionalSearchAttempted && professionalSearchResults.length === 0 && !isSearchingProfessionals" class="text-sm text-gray-500 mt-1">
                    No professionals found matching your query.
                  </p>

                  <!-- Display Implicated Professionals -->
                  <div v-if="localFormData.implicated_professionals_list && localFormData.implicated_professionals_list.length > 0" class="mt-3">
                    <strong class="block text-xs font-medium text-gray-600 mb-1">Currently Implicated Professionals:</strong>
                    <ul class="space-y-1">
                      <li
                        v-for="(implicatedProf, index) in localFormData.implicated_professionals_list"
                        :key="implicatedProf.id"
                        class="flex justify-between items-center p-2 bg-gray-50 rounded-md text-sm border"
                      >
                        <div>
                          <span class="font-medium">{{ implicatedProf.name }}</span>
                          <span class="block text-xs text-gray-500">CID: {{ implicatedProf.cid }} | Reg No: {{ implicatedProf.registration_no }}</span>
                        </div>
                        <button
                          type="button"
                          @click="removeImplicatedProfessional(index)"
                          class="text-red-500 hover:text-red-700 text-xs font-semibold"
                        >
                          Remove
                        </button>
                      </li>
                    </ul>
                  </div>
                   <p v-else-if="localFormData.implicated_professionals_list" class="text-sm text-gray-500 mt-1">
                    No professionals formally implicated in this complaint yet.
                  </p>
                </div>
                <!-- End Manage Implicated Professionals Section -->

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
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, reactive } from 'vue';
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue';

const props = defineProps({
  isOpen: Boolean,
  complaint: Object, // This will be the selectedComplaint object
  // Example: complaint: { ..., implicated_professionals: [{id:'1', name:'X', cid:'Y'}] }
  complaintStatuses: Array
});

const emit = defineEmits(['close', 'updated']);

const localFormData = reactive({
  // Complaint's own ID (PK)
  id: null,
  complaint_id: '',

  // Fields for display (mostly from original complaint)
  grievance_details: '',
  professional_name: '', // Initially reported professional
  professional_designation: '', // Initially reported professional
  professional_workplace: '', // Initially reported professional
  incident_datetime: null,
  created_at: null,
  attachment: null,
  submitted_by_name: '',
  submitted_by_email: '',
  submitted_by_contact_number: '',
  professional_category_name: '',

  // Fields for officer to update
  status: '',
  remarks: '',
  implicated_professionals_list: [] // NEW: Array to hold ALL professionals implicated in the complaint
});

// State for professional search
const professionalSearchQuery = ref('');
const professionalSearchResults = ref([]);
const isSearchingProfessionals = ref(false);
const professionalSearchAttempted = ref(false);

// --- Mock Professional Search API (Replace with actual API) ---
async function fetchProfessionalsAPI(query) {
  console.log(`API: Searching professionals with query: "${query}"`);
  await new Promise(resolve => setTimeout(resolve, 700));
  const mockProfessionals = [
    { id: 'prof_1', name: 'Dr. Eva Green', cid: '123450001', registration_no: 'REG001X', designation: 'Cardiologist' },
    { id: 'prof_2', name: 'Mr. John Doe', cid: '678900002', registration_no: 'REG002Y', designation: 'Nurse Practitioner' },
    { id: 'prof_3', name: 'Ms. Jane Smith', cid: '112230003', registration_no: 'REG003Z', designation: 'Surgeon' },
    { id: 'prof_4', name: 'Dr. Eva Marlie', cid: '555550004', registration_no: 'REG004A', designation: 'Pediatrician' },
    { id: 'prof_5', name: 'Mr. Johnathan Doel', cid: '999990005', registration_no: 'REG005B', designation: 'General Practitioner' }
  ];
  if (!query || query.trim() === '') return [];
  const lowerQuery = query.toLowerCase();
  return mockProfessionals.filter(p =>
    p.cid.includes(lowerQuery) ||
    p.registration_no.toLowerCase().includes(lowerQuery) ||
    p.name.toLowerCase().includes(lowerQuery)
  );
}
// --- End Mock API ---

const searchProfessionals = async () => {
  if (!professionalSearchQuery.value.trim()) {
    professionalSearchResults.value = [];
    professionalSearchAttempted.value = false;
    return;
  }
  isSearchingProfessionals.value = true;
  professionalSearchAttempted.value = true;
  try {
    professionalSearchResults.value = await fetchProfessionalsAPI(professionalSearchQuery.value);
  } catch (error) {
    console.error("Error searching professionals:", error);
    professionalSearchResults.value = [];
  } finally {
    isSearchingProfessionals.value = false;
  }
};

const addImplicatedProfessional = (professional) => {
  if (!localFormData.implicated_professionals_list) {
    localFormData.implicated_professionals_list = [];
  }
  const isAlreadyAdded = localFormData.implicated_professionals_list.some(p => p.id === professional.id);
  if (!isAlreadyAdded) {
    // Ensure we add all necessary fields, esp. if search result has more/less than needed for display
    localFormData.implicated_professionals_list.push({
        id: professional.id,
        name: professional.name,
        cid: professional.cid,
        registration_no: professional.registration_no
        // Add other relevant fields like designation if available and needed in the list
    });
  }
  professionalSearchResults.value = [];
  professionalSearchQuery.value = '';
  professionalSearchAttempted.value = false;
};

const removeImplicatedProfessional = (index) => {
  localFormData.implicated_professionals_list.splice(index, 1);
};

watch(() => props.complaint, (newComplaintData) => {
  console.log('Modal: props.complaint changed:', newComplaintData);
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

    // Initialize implicated_professionals_list from the prop
    // Assuming prop `complaint` has a field like `implicated_professionals` (array of professional objects)
    localFormData.implicated_professionals_list = Array.isArray(newComplaintData.implicated_professionals)
      ? [...newComplaintData.implicated_professionals.map(p => ({...p}))] // Deep copy
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
    professionalSearchQuery.value = '';
    professionalSearchResults.value = [];
    isSearchingProfessionals.value = false;
    professionalSearchAttempted.value = false;
  }
}, { immediate: true, deep: true });

const closeModal = () => {
  emit('close');
};

const handleUpdate = () => {
  const updatePayload = {
    id: localFormData.id,
    status: localFormData.status,
    remarks: localFormData.remarks,
    // Send IDs of all currently implicated professionals
    implicated_professional_ids: localFormData.implicated_professionals_list.map(p => p.id),
  };
  console.log('Modal: Emitting update event with payload:', updatePayload);
  emit('updated', updatePayload);
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
</script>

<style scoped>
.max-h-40 {
  max-height: 10rem; /* 160px */
}
.max-h-48 {
  max-height: 12rem; /* 192px */
}
</style>