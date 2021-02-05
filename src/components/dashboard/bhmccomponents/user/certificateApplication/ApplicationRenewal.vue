<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header Card -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <div class="flex items-center space-x-4">
          <div class="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Renewal Application</h1>
            <p class="text-gray-500">Please review your information before submission</p>
          </div>
        </div>
      </div>

      <!-- Main Form Card -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <!-- Personal Details Section -->
        <div class="mb-8">
          <div class="flex items-center mb-6">
            <div class="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-900">Personal Details</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-6">
              <!-- CID Number -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">CID No./Identity/Work Permit No.</label>
                <div class="relative">
                  <input type="text" v-model="formData.cidNo"
                    class="w-full px-4 py-2.5 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500"
                    :class="{ 'bg-gray-50 border border-gray-200': fetchedData, 'border border-gray-300': !fetchedData }"
                    placeholder="Enter CID number" @input="resetFetchedData"
                    :disabled="isFetchingData || fetchedData" />
                  <button @click="fetchCitizenData" type="button" :disabled="isFetchingData || fetchedData"
                    class="absolute right-2.5 top-1.5 bg-blue-500 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-4 py-2"
                    :class="{ 'cursor-not-allowed opacity-50': isFetchingData || fetchedData }">
                    <span v-if="isFetchingData">Fetching...</span>
                    <span v-else>Fetch Data</span>
                  </button>
                </div>
                <span v-if="cidError" class="text-sm text-red-500 mt-1">{{ cidError }}</span>
              </div>

              <!-- Full Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" v-model="formData.fullName" disabled
                  class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
              </div>

              <!-- Gender -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <input type="text" v-model="formData.gender" disabled
                  class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
              </div>

              <!-- Date of Birth -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input type="text" v-model="formData.dateOfBirth" disabled
                  class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
              </div>
            </div>

            <div class="space-y-6">
              <!-- Village -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Village</label>
                <input type="text" v-model="formData.village" disabled
                  class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
              </div>

              <!-- Gewog -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Gewog</label>
                <input type="text" v-model="formData.gewog" disabled
                  class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
              </div>

              <!-- Dzongkhag -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Dzongkhag</label>
                <input type="text" v-model="formData.dzongkhag" disabled
                  class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
              </div>

              <!-- Credits Information -->
              <div :class="['p-4 rounded-lg',
                    creditStatus === 'red' ? 'bg-red-50' :
                      creditStatus === 'blue' ? 'bg-blue-50' : 'bg-green-50']">
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
        </div>

        <!-- Action Buttons -->
        <div class="border-t pt-6 flex justify-end gap-4">
          <button @click="handleCancel"
            class="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
          <button @click="handleSubmit" :class="['px-6 py-2.5 rounded-lg text-white transition-colors duration-200 flex items-center',
                    isEligibleForRenewal ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed']"
            :disabled="!isEligibleForRenewal">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ buttonText }}
          </button>
        </div>
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

const router = useRouter()
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
    credits: 90
  }
}

onMounted(async () => {
  try {
    const userData = await fetchUserData()
    formData.value = { ...userData }
    validateEligibility()
  } catch (error) {
    console.error('Error fetching user data:', error)
    // Show error notification
  }
})

const validateEligibility = () => {
  isEligibleForRenewal.value = formData.value.credits >= minimumCredits;
};

const handleSubmit = () => {
  if (!isEligibleForRenewal.value) {
    // Show error notification
    return
  }
  showConfirmation.value = true
}

const confirmSubmit = async () => {
  try {
    await submitRenewal(formData.value)
    // Show success notification
    showConfirmation.value = false
    // Redirect to success page or dashboard
    router.push('/dashboard')
  } catch (error) {
    console.error('Error submitting renewal:', error)
    // Show error notification
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
