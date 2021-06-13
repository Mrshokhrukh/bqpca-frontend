<template>
  <div class="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4" @click.self="close">
    <!-- Increased max-w-2xl for a larger modal -->
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl transform transition-all sm:my-8 sm:align-middle">
      <div class="flex justify-between items-center pb-3 border-b border-gray-200">
        <h3 class="text-xl font-semibold text-gray-800">Add Clinical Preceptor</h3>
        <button @click="close" class="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <form @submit.prevent="submitPreceptor" class="mt-6 space-y-6">
        <div>
          <label for="professional" class="block text-sm font-medium text-gray-700 mb-1">
            Professional (Reg No.) <span class="text-red-500">*</span>
          </label>
          <select
            v-model="selectedProfessionalSystemId"
            id="professional"
            name="professional"
            class="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none bg-white"
            :class="{ 'border-red-500': !selectedProfessionalSystemId && formAttempted }"
            required
            :disabled="isLoadingProfessionals || (eligibleProfessionalsList.length === 0 && !isLoadingProfessionals)"
          >
            <option disabled value="">-- Select Professional --</option>
            <option v-if="isLoadingProfessionals" value="" disabled>Loading professionals...</option>
            <option v-for="prof in eligibleProfessionalsList" :key="prof.system_id" :value="prof.system_id">
              {{ prof.registration_no }} - {{ prof.full_name }}
            </option>
            <option v-if="!isLoadingProfessionals && eligibleProfessionalsList.length === 0 && initialLoadDone" value="" disabled>
              No eligible professionals found.
            </option>
          </select>
           <p v-if="!selectedProfessionalSystemId && formAttempted" class="mt-1 text-xs text-red-500">Professional selection is required.</p>
        </div>

        <div v-if="selectedProfessionalDetails" class="space-y-4 p-4 border border-gray-200 rounded-md bg-gray-50">
          <h4 class="text-sm font-semibold text-gray-700">Selected Professional Details:</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="cidDisplay" class="block text-xs font-medium text-gray-500">CID</label>
              <input
                type="text"
                id="cidDisplay"
                :value="displayCid"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100 sm:text-sm cursor-not-allowed"
                readonly
              />
            </div>
            <div>
              <label for="nameDisplay" class="block text-xs font-medium text-gray-500">Name</label>
              <input
                type="text"
                id="nameDisplay"
                :value="displayName"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100 sm:text-sm cursor-not-allowed"
                readonly
              />
            </div>
          </div>
          <div class="mt-4"> <!-- Added mt-4 for spacing if details are on multiple lines -->
            <label for="qualificationDisplay" class="block text-xs font-medium text-gray-500">Qualification</label>
            <input
              type="text"
              id="qualificationDisplay"
              :value="displayQualification"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-100 sm:text-sm cursor-not-allowed"
              readonly
            />
          </div>
        </div>
         <div v-else-if="selectedProfessionalSystemId && !isLoadingProfessionals && eligibleProfessionalsList.length > 0" class="text-sm text-gray-500 italic">
            Loading professional details...
        </div>

        <!-- Designation field has been removed -->

        <div class="pt-4 flex justify-end space-x-3 border-t border-gray-200">
          <button
            type="button"
            @click="close"
            class="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting || isLoadingProfessionals"
            class="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center"
          >
            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            {{ isSubmitting ? 'Submitting...' : 'Add Preceptor' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps, defineEmits } from 'vue';
import apiServices from '@/services/services'; // Ensure this path is correct
import { useToast } from 'vue-toastification';

const props = defineProps({
  applicationId: { // This is likely the ID of the teaching center/hospital
    type: [String, Number],
    required: true,
  }
});
const emit = defineEmits(['close', 'submit-success']);
const toast = useToast();

const selectedProfessionalSystemId = ref(''); // Stores the system_id (prof.id)
// const designation = ref(''); // Removed

const isLoadingProfessionals = ref(false);
const initialLoadDone = ref(false);
const formAttempted = ref(false);
const isSubmitting = ref(false);

const eligibleProfessionalsList = ref([]);

const selectedProfessionalDetails = computed(() => {
  if (!selectedProfessionalSystemId.value) return null;
  return eligibleProfessionalsList.value.find(p => p.system_id === selectedProfessionalSystemId.value);
});

const displayCid = computed(() => selectedProfessionalDetails.value?.cid || 'N/A');
const displayName = computed(() => selectedProfessionalDetails.value?.full_name || 'N/A');
const displayQualification = computed(() => {
    if (!selectedProfessionalDetails.value || !selectedProfessionalDetails.value.user_qualifications) return 'N/A';
    const userQualifications = selectedProfessionalDetails.value.user_qualifications;
    let qualToDisplay = null;
    if (userQualifications.length > 0) {
        qualToDisplay = userQualifications.find(uq =>
            uq.is_primary_qualification === true &&
            typeof uq.endorsement_decision === 'string' &&
            uq.endorsement_decision.toLowerCase() === 'approved'
        );
        if (!qualToDisplay) {
            qualToDisplay = userQualifications.find(uq =>
                typeof uq.endorsement_decision === 'string' &&
                uq.endorsement_decision.toLowerCase() === 'approved'
            );
        }
        if (!qualToDisplay && userQualifications.length > 0) {
            qualToDisplay = userQualifications[0];
        }
    }
    if (qualToDisplay) {
        return qualToDisplay.qualification_name_display ||
               qualToDisplay.actual_qualification_name_display ||
               qualToDisplay.qualification_name_text ||
               'Qualification details not available';
    }
    return 'N/A';
});


const fetchEligibleProfessionals = async () => {
  isLoadingProfessionals.value = true;
  initialLoadDone.value = false;
  try {
    const response = await apiServices.getMhpcNewApplications();
    const rawProfessionals = response.data?.results || [];
    if (!Array.isArray(rawProfessionals)) {
        console.warn('Fetched professionals data is not an array:', rawProfessionals);
        eligibleProfessionalsList.value = [];
    } else {
        eligibleProfessionalsList.value = rawProfessionals
            .filter(prof =>
                prof.user_qualifications && prof.user_qualifications.some(uq =>
                    typeof uq.endorsement_decision === 'string' &&
                    uq.endorsement_decision.toLowerCase() === 'approved'
                )
            )
            .map(prof => ({
                system_id: prof.id,
                registration_no: prof.registration_no || 'N/A',
                cid: prof.cid_no || 'N/A',
                full_name: prof.full_name || 'Unknown Professional',
                user_qualifications: prof.user_qualifications || []
            }));
    }
  } catch (error) {
    console.error('Error fetching professionals list:', error.response?.data || error.message);
    toast.error('Could not load professionals list. Please try again.');
    eligibleProfessionalsList.value = [];
  } finally {
    isLoadingProfessionals.value = false;
    initialLoadDone.value = true;
    if (eligibleProfessionalsList.value.length === 0) {
        toast.info('No professionals with an approved qualification endorsement found.');
    }
  }
};

onMounted(() => {
  fetchEligibleProfessionals();
});

const resetFormFields = () => {
    selectedProfessionalSystemId.value = '';
    // designation.value = ''; // Removed
    formAttempted.value = false;
};

const close = () => {
  emit('close');
};

const submitPreceptor = async () => {
  formAttempted.value = true;

  if (!selectedProfessionalSystemId.value) {
    toast.error('Please select an eligible professional.');
    return;
  }
  // Designation validation removed

  isSubmitting.value = true;

  const preceptorData = {
    teaching_center: props.applicationId,
    faculty: selectedProfessionalSystemId.value,
    // designation: designation.value.trim(), // Removed from payload
  };

  try {
    // IMPORTANT: Ensure your API `createMhpcClinicalPreceptor` can handle
    // the absence of the 'designation' field if it was previously required.
    await apiServices.createMhpcClinicalPreceptor(preceptorData);

    const professionalName = displayName.value !== 'N/A' ? displayName.value : `Professional (ID: ${selectedProfessionalSystemId.value})`;
    toast.success(`Clinical Preceptor "${professionalName}" added successfully.`); // Updated toast message
    emit('submit-success', preceptorData);

    resetFormFields();
  } catch (error) {
    console.error('Error adding preceptor:', error.response?.data || error.message || error);
    let errorMessage = 'Failed to add clinical preceptor.';
    if (error.response?.data) {
        const errors = error.response.data;
        if (typeof errors === 'string') errorMessage += ` ${errors}`;
        else if (errors.detail) errorMessage += ` ${errors.detail}`;
        else if (errors.non_field_errors) errorMessage += ` ${errors.non_field_errors.join(' ')}`;
        else if (errors.faculty && Array.isArray(errors.faculty) && errors.faculty.some(e => e.includes("already exists"))) {
             errorMessage = `This professional is already assigned as a preceptor for this teaching center.`;
        } else if (Array.isArray(errors) && errors.every(e => typeof e === 'string')) errorMessage += ` ${errors.join(' ')}`;
        else if (typeof errors === 'object') {
            const fieldErrors = Object.entries(errors).map(([key, value]) => {
                const fieldName = key.replace(/_/g, ' ');
                // Exclude 'faculty' if it's the "already exists" error handled above
                if (key === 'faculty' && Array.isArray(value) && value.some(e => e.includes("already exists"))) return null;
                return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}: ${Array.isArray(value) ? value.join(', ') : value}`;
            }).filter(Boolean).join('; ');
            if (fieldErrors) errorMessage += ` Details: ${fieldErrors}`;
        }
    }
    toast.error(errorMessage);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
select:disabled, input:read-only {
  background-color: #f3f4f6;
  cursor: not-allowed;
}
/* Optional: If you want more vertical space within the larger modal */
.space-y-6 > div:not(:first-child) {
    margin-top: 1.5rem;
}
.space-y-4 > div:not(:first-child) {
    margin-top: 1rem;
}
.grid.gap-4 {
    gap: 1rem; /* Tailwind class for gap */
}
</style>