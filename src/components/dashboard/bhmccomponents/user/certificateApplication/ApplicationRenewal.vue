<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Form Header -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Renewal Application
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Please review your personal details and BQPCA credits to ensure your eligibility for renewal.
      </p>
    </div>

    <!-- Main Form Card -->
    <div class="bg-white border rounded-xl shadow-sm p-6">
      <!-- Personal Details Section -->
      <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
        <h3 class="text-lg font-semibold text-gray-900">Personal Details</h3>
        <p class="mt-1 text-sm text-gray-500">Verify your personal information.</p>
      </div>

      <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- CID Number -->
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">CID No./Identity/Work Permit No.</label>
          <div class="relative">
            <input type="text" v-model="formData.cidNo"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              :class="{
                'bg-gray-50 border border-gray-200': fetchedData,
                'border border-gray-300': !fetchedData,
              }" placeholder="Enter CID number" @input="resetFetchedData" :disabled="isFetchingData || fetchedData" />
            <button @click="fetchCitizenData" type="button" :disabled="isFetchingData || fetchedData"
              class="absolute right-2.5 top-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="isFetchingData">Fetching...</span>
              <span v-else>Fetch Data</span>
            </button>
          </div>
          <span v-if="cidError" class="text-sm text-red-500 mt-1">{{ cidError }}</span>
        </div>

        <!-- Full Name -->
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" v-model="formData.fullName" disabled
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
        </div>

        <!-- Gender -->
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Gender</label>
          <input type="text" v-model="formData.gender" disabled
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
        </div>

        <!-- Date of Birth -->
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input type="text" v-model="formData.dateOfBirth" disabled
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
        </div>

        <!-- Village -->
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Village</label>
          <input type="text" v-model="formData.village" disabled
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
        </div>

        <!-- Gewog -->
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Gewog</label>
          <input type="text" v-model="formData.gewog" disabled
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
        </div>

        <!-- Dzongkhag -->
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Dzongkhag</label>
          <input type="text" v-model="formData.dzongkhag" disabled
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
        </div>

        <!-- Credits Information -->
        <div class="col-span-1">
          <div
            :class="['rounded-xl p-4',
              creditStatus === 'red' ? 'bg-red-50 border border-red-200' :
                creditStatus === 'blue' ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200']">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2"
                :class="creditStatus === 'red' ? 'text-red-600' : creditStatus === 'blue' ? 'text-blue-600' : 'text-green-600'"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-sm font-medium"
                :class="creditStatus === 'red' ? 'text-red-900' : creditStatus === 'blue' ? 'text-blue-900' : 'text-green-900'">BQPCA
                Credits</span>
            </div>
            <div class="mt-2 flex items-center justify-between">
              <div>
                <div class="text-2xl font-bold"
                  :class="creditStatus === 'red' ? 'text-red-900' : creditStatus === 'blue' ? 'text-blue-900' : 'text-green-900'">
                  {{ formData.credits }}</div>
                <div class="text-sm"
                  :class="creditStatus === 'red' ? 'text-red-700' : creditStatus === 'blue' ? 'text-blue-700' : 'text-green-700'">
                  Current Credits</div>
              </div>
              <div>
                <div class="text-2xl font-bold"
                  :class="creditStatus === 'red' ? 'text-red-900' : creditStatus === 'blue' ? 'text-blue-900' : 'text-green-900'">
                  {{ minimumCredits }}</div>
                <div class="text-sm"
                  :class="creditStatus === 'red' ? 'text-red-700' : creditStatus === 'blue' ? 'text-blue-700' : 'text-green-700'">
                  Required Credits</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-12 flex justify-end space-x-4 p-8">
        <button @click="handleCancel"
          class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button @click="handleSubmit" :class="['px-6 py-3 rounded-lg text-white transition-colors',
          isEligibleForRenewal ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed']"
          :disabled="!isEligibleForRenewal">
          {{ buttonText }}
        </button>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
        <div class="flex items-center mb-4">
          <div class="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900">Confirm Renewal</h3>
        </div>
        <p class="text-gray-600 mb-6">You are about to submit your renewal application. This action cannot be undone.
          Are you sure you want to proceed?</p>
        <div class="flex justify-end gap-4">
          <button @click="showConfirmation = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
            Cancel
          </button>
          <button @click="confirmSubmit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/services';
import { useToast } from 'vue-toastification';

const router = useRouter()
const toast = useToast();

const formData = ref({
  cidNo: '',
  fullName: '',
  gender: '',
  dateOfBirth: '',
  village: '',
  gewog: '',
  dzongkhag: '',
  credits: 0
})

const showConfirmation = ref(false)
const minimumCredits = 60
const isEligibleForRenewal = ref(false)

// New refs for fetching
const isFetchingData = ref(false);
const fetchedData = ref(false);
const cidError = ref('');

// Computed property to determine credit status
const creditStatus = computed(() => {
  if (formData.value.credits < minimumCredits) {
    return 'red';
  } else if (formData.value.credits === minimumCredits) {
    return 'blue';
  } else {
    return 'green';
  }
});

// Computed property to determine button text
const buttonText = computed(() => {
  if (formData.value.credits < minimumCredits) {
    return 'Insufficient Credits';
  } else if (formData.value.credits === minimumCredits) {
    return 'Confirm & Submit';
  } else {
    return 'Confirm & Submit (Exceeds Requirements)';
  }
});

// Simulated API functions
const fetchUserData = async () => {
  // Replace with actual API call
  return {
    cidNo: '12345678',
    fullName: 'John Doe',
    gender: 'Male',
    dateOfBirth: '1990-01-01',
    village: 'Sample Village',
    gewog: 'Sample Gewog',
    dzongkhag: 'Sample Dzongkhag',
    credits: 40,
  }
}

onMounted(async () => {
  try {
    const userData = await fetchUserData()
    formData.value = { ...userData }
    validateEligibility()
  } catch (error) {
    console.error('Error fetching user data:', error)
    toast.error('Error fetching user data.');
  }
})

const validateEligibility = () => {
  isEligibleForRenewal.value = formData.value.credits >= minimumCredits;
};

const handleSubmit = () => {
  if (!isEligibleForRenewal.value) {
    toast.error('Insufficient credits to submit renewal.');
    return
  }
  showConfirmation.value = true
}

const confirmSubmit = async () => {
  try {
    await submitRenewal(formData.value)
    toast.success('Renewal submitted successfully!')
    showConfirmation.value = false
    // Redirect to success page or dashboard
    router.push('/dashboard')
  } catch (error) {
    console.error('Error submitting renewal:', error)
    toast.error('Error submitting renewal.');
  }
}

const handleCancel = () => {
  router.push('/dashboard')
}


const submitRenewal = async (data) => {
  // Replace with actual API call
  console.log('Submitting renewal:', data)
  return Promise.resolve()
}

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
};

const fetchCitizenData = async () => {
  cidError.value = '';
  if (!formData.value.cidNo) {
    cidError.value = 'CID is required';
    return;
  }

  if (formData.value.cidNo.length !== 11 || !/^\d+$/.test(formData.value.cidNo)) {
    cidError.value = 'CID must be 11 digits and contain only numbers.';
    return;
  }
  isFetchingData.value = true;
  try {
    const response = await apiService.fetchCitizenDetails(formData.value.cidNo);
    const genderMap = {
      'F': 'Female',
      'M': 'Male'
    };
    formData.value = {
      ...formData.value,
      fullName: response.data.applicants_name,
      dateOfBirth: formatDateForInput(response.data.date_of_birth),
      gender: genderMap[response.data.gender] || '',
      dzongkhag: response.data.dzongkhag,
      gewog: response.data.gewog,
      village: response.data.village,
    };
    fetchedData.value = true;
  } catch (error) {
    console.error('Error fetching citizen data:', error);
    cidError.value = 'Failed to fetch data. Please check your CID or enter details manually.';
    // Clear fields (optional, based on UX)
    formData.value = {
      ...formData.value,
      fullName: '',
      dateOfBirth: '',
      gender: '',
      dzongkhag: '',
      gewog: '',
      village: '',
    };
  } finally {
    isFetchingData.value = false;
  }
};

const resetFetchedData = () => {
  fetchedData.value = false;
  // Optionally clear other fields if you want to force manual re-entry
  formData.value = {
    ...formData.value,
    fullName: '',
    dateOfBirth: '',
    gender: '',
    dzongkhag: '',
    gewog: '',
    village: '',
  };
}

watch(() => formData.value.credits, validateEligibility);
</script>

<style>
html,
body {
  overflow: hidden;
  height: 100%;
}

/* Make sure only one container handles scrolling */
.max-w-6xl {
  height: calc(100vh - 60px);
  /* Adjust based on your header/footer height */
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  /* Smooth scrolling on iOS/macOS */
}

/* Safari-specific fixes */
@media not all and (min-resolution:.001dpcm) {
  @supports (-webkit-appearance:none) {
    .max-w-6xl {
      overflow-y: auto !important;
    }

    .fixed.inset-0 {
      overflow: hidden !important;
    }

    /* Clean up any nested scrollable elements */
    .p-8,
    .bg-white.border.rounded-xl {
      overflow: visible !important;
    }
  }
}

/* Fix for the confirmation modal */
.fixed.inset-0 {
  position: fixed;
  overflow: hidden;
}

/* Ensure modal content doesn't cause scrolling issues */
.fixed.inset-0>div {
  max-height: 90vh;
  overflow-y: auto;
}
</style>