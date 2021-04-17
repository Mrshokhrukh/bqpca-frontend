<!-- src/views/EducationPrograms.vue -->
<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Education Programs</h1>
      <div class="flex items-center text-gray-600">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Total: {{ educationPrograms.length }}
        </span>
      </div>
    </div>

    <!-- Alert for Success/Error Messages -->
    <div
      v-if="alert.show"
      class="mb-4 p-4 rounded-md transition-opacity duration-300 ease-out"
      :class="[`${alert.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`, alert.show ? 'opacity-100' : 'opacity-0']"
      role="alert"
    >
       <!-- Alert content -->
        <div class="flex">
         <div class="flex-shrink-0">
           <svg v-if="alert.type === 'success'" class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/> </svg>
           <svg v-else class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/> </svg>
         </div>
         <div class="ml-3"> <p class="text-sm font-medium">{{ alert.message }}</p> </div>
         <div class="ml-auto pl-3">
           <div class="-mx-1.5 -my-1.5">
             <button @click="hideAlert" class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2" :class=" alert.type === 'success' ? 'text-green-500 hover:bg-green-100 focus:ring-green-600 focus:ring-offset-green-50' : 'text-red-500 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50'" aria-label="Dismiss">
               <span class="sr-only">Dismiss</span>
               <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"> <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/> </svg>
             </button>
           </div>
         </div>
       </div>
    </div>

    <!-- Loading Indicator -->
    <div v-if="loading && educationPrograms.length === 0" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- No Data Message -->
    <div
      v-else-if="!loading && educationPrograms.length === 0"
      class="bg-white p-8 text-center text-gray-500 rounded-xl shadow-sm border border-gray-100"
    >
      <p>No education programs found.</p>
       <p class="mt-2 text-sm">Consider adding new programs if applicable.</p>
    </div>

    <!-- Programs Table -->
     <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
       <!-- Table Loading Overlay -->
       <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-20">
           <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
       </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0 z-10">
            <!-- Table Headers -->
            <tr>
              <!-- UPDATE Headers -->
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Institute</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Proposal Title</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Commencement Date</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="program in educationPrograms"
              :key="program.id"
              class="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
            >
             <!-- UPDATE Table Data Bindings -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ program.training_institute_name || 'N/A' }} <!-- Use mapped name -->
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 max-w-xs truncate" :title="program.proposal_title">
                    {{ program.proposal_title || 'N/A' }} <!-- Use proposal_title -->
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ program.duration_months }} Months</div> <!-- Use duration_months -->
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(program.commencement_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium leading-tight"
                  :class="{
                    'bg-yellow-100 text-yellow-800': program.review_decision === 'Pending',
                    'bg-green-100 text-green-800': program.review_decision === 'Approved',
                    'bg-red-100 text-red-800': program.review_decision === 'Regretted', /* Use 'Regretted' from choices */
                    'bg-gray-100 text-gray-600': !['Pending', 'Approved', 'Regretted'].includes(program.review_decision)
                  }"
                >
                  <!-- Use review_decision and display helper -->
                  {{ program.review_decision_display || program.review_decision || 'Unknown' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click="openModal(program)"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150"
                    title="View Details"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.022 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                    </svg>
                    View
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Component -->
    <EducationProgramDetailsModal
      :is-open="isModalOpen"
      :program-details="selectedProgram"
      @close-modal="closeModal"
      @approve="handleApprove"
      @regret="handleRegret"
      @program-updated="handleProgramUpdate"
    />

    <!-- Confirmation Modal (Approve/Regret) - Stays in parent -->
    <Teleport to="body">
       <div v-if="confirmModal.show" class="fixed z-40 inset-0 overflow-y-auto" aria-labelledby="confirmation-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
           <!-- Confirmation modal content -->
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="confirmModal.show = false"></div>
           <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>
           <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
             <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
               <div class="sm:flex sm:items-start">
                 <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10" :class="confirmModal.action === 'approve' ? 'bg-green-100' : 'bg-red-100'">
                    <svg v-if="confirmModal.action === 'approve'" class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> </svg>
                    <svg v-else class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" > <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /> </svg>
                 </div>
                 <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                   <h3 class="text-lg leading-6 font-medium text-gray-900" id="confirmation-title"> {{ confirmModal.title }} </h3>
                   <div class="mt-2"> <p class="text-sm text-gray-500"> {{ confirmModal.message }} </p> </div>
                   <!-- Regret Reason Input -->
                   <div v-if="confirmModal.action === 'regret'" class="mt-4">
                     <label for="regret-reason" class="block text-sm font-medium text-gray-700 mb-1">Reason for Regret <span class="text-red-500">*</span></label>
                     <textarea id="regret-reason" v-model="regretReason" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Please provide a mandatory reason for regret" aria-required="true"></textarea>
                     <p v-if="regretReasonError" class="mt-1 text-xs text-red-600">{{ regretReasonError }}</p>
                   </div>
                 </div>
               </div>
             </div>
             <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
               <button type="button" @click="confirmAction" :disabled="actionLoading" class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 w-full sm:w-auto sm:text-sm disabled:opacity-50" :class="`${confirmModal.action === 'approve' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'}`">
                  <svg v-if="actionLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg>
                 {{ actionLoading ? 'Processing...' : (confirmModal.action === 'approve' ? 'Approve' : 'Confirm Regret') }}
               </button>
               <button type="button" @click="confirmModal.show = false" :disabled="actionLoading" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                 Cancel
               </button>
             </div>
           </div>
        </div>
       </div>
     </Teleport>

  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import EducationProgramDetailsModal from './EducationProgramDetailsModal.vue'; // Adjust path
import apiServices from '@/services/services'; // Adjust path

const educationPrograms = ref([]);
const isModalOpen = ref(false);
const selectedProgram = ref({});
const loading = ref(false);
const actionLoading = ref(false);
const regretReason = ref('');
const regretReasonError = ref('');

const alert = reactive({
  show: false,
  type: 'success',
  message: '',
  timer: null,
});

const confirmModal = reactive({
  show: false,
  title: '',
  message: '',
  action: '',
  programId: null,
});

onMounted(async () => {
  await fetchEducationPrograms();
});

const fetchEducationPrograms = async () => {
  loading.value = true;
  hideAlert();
  try {
    // ***** UPDATE API CALL *****
    const response = await apiServices.getEpcNewEducationPrograms();
    console.log('API Response (New Programs):', response);

    // Process response (assuming similar structure, adjust if needed)
    let results = [];
     if (response?.data?.results && Array.isArray(response.data.results)) {
        results = response.data.results;
    } else if (response?.results && Array.isArray(response.results)) {
        results = response.results;
    } else if (response?.data && Array.isArray(response.data)) {
        results = response.data;
    } else if (Array.isArray(response)) {
        results = response;
    } else {
        console.error('Unexpected API response structure:', response);
        showAlert('error', 'Failed to load education programs: Invalid data format.');
        results = [];
    }

    // ***** UPDATE DATA MAPPING *****
    educationPrograms.value = results.map(program => ({
        // Keep all original fields from API response
        ...program,
        // Add specific fields needed for display/logic, mapping from new names
        id: program.id,
        training_institute_name: program.training_institute_details?.name_of_institution || 'Unknown Institute', // Use details from nested object
        proposal_title: program.proposal_title || 'Untitled Program',
        duration_months: program.duration_months || 0,
        commencement_date: program.commencement_date,
        review_decision: program.review_decision || 'Pending',
        review_decision_display: program.review_decision_display || program.review_decision || 'Pending', // Use display value if available
        reason_if_rejected: program.reason_if_rejected || null,
        // Pass the full training_institute_details object if needed by the modal
        training_institute_details: program.training_institute_details || {},
    }));

    console.log('Processed new education programs:', educationPrograms.value);

  } catch (error) {
    console.error('Error fetching data:', error);
    const errorMessage = error.response?.data?.detail || error.message || 'An unknown error occurred.';
    showAlert('error', `Failed to load education programs: ${errorMessage}`);
    educationPrograms.value = [];
  } finally {
    loading.value = false;
  }
};

const openModal = (program) => {
  console.log("Opening modal for (New Program):", program);
  selectedProgram.value = JSON.parse(JSON.stringify(program)); // Pass deep copy
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const formatDate = (dateString) => {
    // Same formatting logic
    if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString.includes('T') ? dateString : dateString + 'T00:00:00Z');
     if (isNaN(date.getTime())) {
        const parts = dateString.split('-');
        if (parts.length === 3) {
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const day = parseInt(parts[2], 10);
            const utcDate = new Date(Date.UTC(year, month, day));
             if (!isNaN(utcDate.getTime())) {
                 const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' };
                return utcDate.toLocaleDateString('en-US', options);
             }
        }
        return 'Invalid Date';
    }
    const options = { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' };
    return date.toLocaleDateString('en-US', options);
  } catch (e) {
     console.error("Error formatting date:", e);
     return dateString;
  }
};

// --- Alert System --- (Keep as is)
const showAlert = (type, message, duration = 5000) => {
  if (alert.timer) clearTimeout(alert.timer);
  alert.type = type;
  alert.message = message;
  alert.show = true;
  alert.timer = setTimeout(() => {
    alert.show = false;
  }, duration);
};
const hideAlert = () => { /* ... */ };


// --- Approve/Regret Handling ---
const handleApprove = () => {
  if (!selectedProgram.value || !selectedProgram.value.id) return;
  regretReason.value = '';
  regretReasonError.value = '';
  confirmModal.title = 'Approve Education Program';
  // ***** UPDATE CONFIRMATION MESSAGE FIELD *****
  confirmModal.message = `Are you sure you want to approve "${selectedProgram.value.proposal_title}"? This action sets the status to Approved.`;
  confirmModal.action = 'approve';
  confirmModal.programId = selectedProgram.value.id;
  confirmModal.show = true;
};

const handleRegret = () => {
  if (!selectedProgram.value || !selectedProgram.value.id) return;
  regretReason.value = '';
  regretReasonError.value = '';
  confirmModal.title = 'Regret Education Program';
   // ***** UPDATE CONFIRMATION MESSAGE FIELD *****
  confirmModal.message = `Are you sure you want to regret "${selectedProgram.value.proposal_title}"? Please provide a reason below. This action sets the status to Regretted.`;
  confirmModal.action = 'regret';
  confirmModal.programId = selectedProgram.value.id;
  confirmModal.show = true;
};

const confirmAction = async () => {
  actionLoading.value = true;
  hideAlert();
  regretReasonError.value = '';

  try {
    const id = confirmModal.programId;
    if (!id) throw new Error('Education program ID is missing for confirmation.');

    // ***** UPDATE PAYLOAD FIELDS *****
    const updateData = {
      review_decision: confirmModal.action === 'approve' ? 'Approved' : 'Regretted', // Use new field name
      // Use new field name, ensure it's only sent on regret
      ...(confirmModal.action === 'regret' && { reason_if_rejected: regretReason.value.trim() })
    };

    if (confirmModal.action === 'regret' && !regretReason.value.trim()) {
      regretReasonError.value = 'Reason for regret is required.';
      actionLoading.value = false;
      return;
    }

    console.log(`Performing ${confirmModal.action} action with data:`, updateData);

    // ***** UPDATE API CALL *****
    const response = await apiServices.patchEpcNewEducationProgram(id, updateData);
    console.log('API update response:', response);

    // Update local data
    const index = educationPrograms.value.findIndex((program) => program.id === id);
    if (index !== -1) {
       // Merge using new field names
       const updatedProgramData = response?.data ? { ...educationPrograms.value[index], ...response.data } : { ...educationPrograms.value[index], ...updateData };

        // Ensure reason is correct based on action
       if (confirmModal.action === 'regret' && !updatedProgramData.reason_if_rejected) {
           updatedProgramData.reason_if_rejected = regretReason.value.trim();
       }
       if (confirmModal.action === 'approve') {
           updatedProgramData.reason_if_rejected = null; // Clear reason on approve
       }

       // Make sure display name is updated too
        updatedProgramData.review_decision_display = updatedProgramData.review_decision_display || updatedProgramData.review_decision;
        updatedProgramData.training_institute_name = updatedProgramData.training_institute_details?.name_of_institution || educationPrograms.value[index].training_institute_name; // Keep existing if not in response

       educationPrograms.value[index] = updatedProgramData;

        closeModal(); // Close details modal AFTER successful action

        // ***** UPDATE ALERT MESSAGE FIELD *****
        showAlert(
          'success',
          `Program "${updatedProgramData.proposal_title}" ${confirmModal.action === 'approve' ? 'approved' : 'regretted'} successfully.`
        );
    } else {
        console.warn("Program not found in local list after update.");
        showAlert('warning', 'Action successful, but local list sync issue. Refresh may be needed.');
        await fetchEducationPrograms(); // Refetch
        closeModal();
    }
    confirmModal.show = false; // Close confirmation

  } catch (error) {
    console.error(`Error ${confirmModal.action}ing education program:`, error);
    // ***** UPDATE ERROR PARSING FIELD *****
    const errorMessage = error.response?.data?.detail || error.response?.data?.reason_if_rejected?.[0] || error.message || `Failed to ${confirmModal.action} program.`;
    showAlert('error', errorMessage);
  } finally {
    actionLoading.value = false;
    if (!confirmModal.show) {
        regretReason.value = '';
        regretReasonError.value = '';
    }
  }
};

// --- Handle Update from Modal Edit Save ---
const handleProgramUpdate = (updatedProgramData) => {
  console.log("Received program-updated event (New Program):", updatedProgramData);
  hideAlert();

  const index = educationPrograms.value.findIndex(p => p.id === updatedProgramData.id);
  if (index !== -1) {
    // ***** UPDATE LIST ITEM WITH NEW DATA STRUCTURE *****
    // Ensure the training institute name and display decision are present
    const mergedData = {
        ...educationPrograms.value[index], // Keep existing fields not in response
        ...updatedProgramData, // Overwrite with API response
        training_institute_name: updatedProgramData.training_institute_details?.name_of_institution || educationPrograms.value[index].training_institute_name, // Update or keep name
        review_decision_display: updatedProgramData.review_decision_display || updatedProgramData.review_decision || 'Pending', // Update or fallback
    };
    educationPrograms.value[index] = mergedData;
    console.log("Local program list updated at index", index);
    // ***** UPDATE ALERT MESSAGE FIELD *****
    showAlert('success', `Program "${mergedData.proposal_title}" updated successfully.`);

     // Update selectedProgram if modal is still open
     if (isModalOpen.value && selectedProgram.value.id === updatedProgramData.id) {
        selectedProgram.value = JSON.parse(JSON.stringify(mergedData));
     }

  } else {
    console.warn("Updated program not found in the list. Refetching might be needed.");
    showAlert('warning', 'Program updated, but local list sync issue occurred. Refresh may be needed.');
     fetchEducationPrograms(); // Refetch
  }
};

</script>

<style>/* Style remains the same */</style>

<style>
/* Ensure sticky header works well */
thead.sticky th {
  position: sticky;
  top: 0;
  z-index: 10; /* Ensure header stays above table body scroll */
   /* Match Tailwind's bg-gray-50 */
   background-color: #f9fafb;
   /* Add a bottom border to visually separate header when scrolling */
   /* border-bottom: 1px solid #e5e7eb; */ /* Tailwind gray-200 */
}

/* Improve table loading overlay appearance */
.relative .absolute.inset-0 {
    border-radius: 0.75rem; /* Match parent's rounded-xl */
}
</style>