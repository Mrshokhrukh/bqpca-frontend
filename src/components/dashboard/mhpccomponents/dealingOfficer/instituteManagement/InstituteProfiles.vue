<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-center items-center p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl transform transition-all" ref="modalContent">
      <div v-if="!instituteDetails">
        <div class="p-8 text-center text-gray-500">Loading details...</div>
      </div>
      
      <div v-else>
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-800">{{ instituteDetails.name_of_institution }}</h2>
          <button @click="handleClose" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 space-y-6">
          <!-- Registration Status & Renewal Section -->
          <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-700 mb-3">Registration Status</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt class="font-medium text-gray-500">Valid Until</dt>
                <dd class="text-gray-900 font-semibold">{{ instituteDetails.valid_till || 'N/A' }}</dd>
              </div>
              <div>
                <dt class="font-medium text-gray-500">Status</dt>
                <dd class="text-gray-900">
                   <span :class="instituteDetails.is_active ? 'text-green-600' : 'text-red-600'">
                    {{ instituteDetails.is_active ? 'Active' : 'Inactive' }}
                   </span>
                </dd>
              </div>
            </div>
            
            <div class="mt-4">
              <div v-if="pendingStatusMessage" class="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-3 rounded-md" role="alert">
                <p class="font-bold">Renewal In Progress</p>
                <p>{{ pendingStatusMessage }}</p>
              </div>
              
              <button 
                v-if="shouldShowRenewButton" 
                @click="startRenewalProcess" 
                class="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition-all">
                Renew Registration
              </button>

              <div v-if="!shouldShowRenewButton && !pendingStatusMessage" class="text-center text-gray-600 mt-2 p-3 bg-green-50 rounded-md border border-green-200">
                <p>Registration is up to date.</p>
              </div>
            </div>
          </div>
          
          <!-- Institute Details -->
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-3">Institute Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div><span class="font-medium text-gray-500">Applicant Name:</span> {{ instituteDetails.full_name }}</div>
              <div><span class="font-medium text-gray-500">CID:</span> {{ instituteDetails.CID }}</div>
              <div><span class="font-medium text-gray-500">Contact No:</span> {{ instituteDetails.contact_no }}</div>
              <div><span class="font-medium text-gray-500">Email:</span> {{ instituteDetails.email_address }}</div>
              <div class="md:col-span-2"><span class="font-medium text-gray-500">Address:</span> {{ instituteDetails.address }}, {{ instituteDetails.gewog }}, {{ instituteDetails.dzongkhag }}</div>
              <div class="md:col-span-2"><span class="font-medium text-gray-500">Website:</span> <a :href="instituteDetails.website" target="_blank" class="text-blue-600 hover:underline">{{ instituteDetails.website }}</a></div>
            </div>
          </div>
          
          <!-- Head of Institution Details -->
          <div>
            <h3 class="text-lg font-semibold text-gray-700 mb-3">Head of Institution</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div><span class="font-medium text-gray-500">Name:</span> {{ instituteDetails.head_of_institution_name }}</div>
              <div><span class="font-medium text-gray-500">Gender:</span> {{ instituteDetails.head_of_institution_gender }}</div>
              <div><span class="font-medium text-gray-500">Phone:</span> {{ instituteDetails.head_of_institution_phone_number }}</div>
              <div><span class="font-medium text-gray-500">Email:</span> {{ instituteDetails.head_of_institution_email }}</div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex items-center justify-end p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button @click="handleClose" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
            Close
          </button>
          <!-- You can add an 'Edit' button here if needed -->
          <!-- 
          <button @click="$emit('save-changes', instituteDetails)" class="ml-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Save Changes
          </button>
          -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { onClickOutside } from '@vueuse/core';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  instituteDetails: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close-modal', 'save-changes']);
const router = useRouter();
const modalContent = ref(null);

onClickOutside(modalContent, () => handleClose());

const handleClose = () => {
  emit('close-modal');
};

const shouldShowRenewButton = computed(() => {
  if (!props.instituteDetails) {
    return false;
  }
  if (props.instituteDetails.pending_renewal_status) {
    return false;
  }
  if (!props.instituteDetails.valid_till) {
    return true; 
  }
  const validTill = new Date(props.instituteDetails.valid_till);
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + 60);

  return validTill < thresholdDate;
});

const pendingStatusMessage = computed(() => {
  if (props.instituteDetails && props.instituteDetails.pending_renewal_status) {
    return `Your application is currently in the '${props.instituteDetails.pending_renewal_status}' stage.`;
  }
  return '';
});

const startRenewalProcess = () => {
  if (props.instituteDetails && props.instituteDetails.id) {
    router.push({ name: 'institute-renewal-form', params: { id: props.instituteDetails.id } });
    handleClose();
  }
};
</script>