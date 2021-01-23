<template>
  <div>
    <!-- <p v-if="warningMessage">{{ warningMessage }}</p> -->
  </div>
  <div class="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <h2 class="text-2xl font-bold mb-6">Renewal Application</h2>

    <!-- Personal Details Section -->
    <div class="mb-8">
      <h3 class="text-xl font-semibold mb-4">Personal Details</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- CID/Identity/Work Permit -->
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-2">CID No./Identity/Work Permit No.</label>
          <input
            type="text"
            v-model="formData.cidNo"
            disabled
            class="w-full px-4 py-2 border rounded-md bg-gray-100"
          >
        </div>

        <!-- Full Name -->
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-2">Full Name</label>
          <input
            type="text"
            v-model="formData.fullName"
            disabled
            class="w-full px-4 py-2 border rounded-md bg-gray-100"
          >
        </div>

        <!-- Gender -->
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-2">Gender</label>
          <input
            type="text"
            v-model="formData.gender"
            disabled
            class="w-full px-4 py-2 border rounded-md bg-gray-100"
          >
        </div>

        <!-- Date of Birth -->
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-2">Date of Birth</label>
          <input
            type="text"
            v-model="formData.dateOfBirth"
            disabled
            class="w-full px-4 py-2 border rounded-md bg-gray-100"
          >
        </div>

        <!-- Village -->
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-2">Village</label>
          <input
            type="text"
            v-model="formData.village"
            disabled
            class="w-full px-4 py-2 border rounded-md bg-gray-100"
          >
        </div>

        <!-- Gewog -->
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-2">Gewog</label>
          <input
            type="text"
            v-model="formData.gewog"
            disabled
            class="w-full px-4 py-2 border rounded-md bg-gray-100"
          >
        </div>

        <!-- Dzongkhag -->
        <div class="mb-4">
          <label class="block text-gray-700 font-medium mb-2">Dzongkhag</label>
          <input
            type="text"
            v-model="formData.dzongkhag"
            disabled
            class="w-full px-4 py-2 border rounded-md bg-gray-100"
          >
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end gap-4 mt-6">
      <button
        @click="handleCancel"
        class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        @click="handleSubmit"
        class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        :disabled="!isEligibleForRenewal"
      >
        Confirm & Submit
      </button>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 class="text-xl font-bold mb-4">Confirm Renewal</h3>
        <p class="mb-6">Are you sure you want to proceed with the renewal submission?</p>
        <div class="flex justify-end gap-4">
          <button
            @click="showConfirmation = false"
            class="px-4 py-2 border border-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            @click="confirmSubmit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'

// Form data
const formData = ref({
  cidNo: '',
  fullName: '',
  gender: '',
  dateOfBirth: '',
  village: '',
  gewog: '',
  dzongkhag: '',
  credits: 0, // For BQPCA validation
  regdate: '', // Registration date
  username: '' // Username for matching
})

const showConfirmation = ref(false)
const minimumCredits = 10 // Replace with actual minimum credit requirement
const isEligibleForRenewal = ref(false)
const warningMessage = ref('') // For storing the warning message if needed

// Calculated dates
const expirationDate = computed(() => {
  if (!formData.value.regdate) return ''
  const regDate = new Date(formData.value.regdate)
  regDate.setFullYear(regDate.getFullYear() + 5) // Add 5 years
  return regDate.toISOString().split('T')[0] // Format as YYYY-MM-DD
})

const isWithinThreeMonths = computed(() => {
  if (!expirationDate.value) return false
  const expDate = new Date(expirationDate.value)
  const today = new Date()
  const diffTime = expDate - today
  const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30) // Convert to months
  return diffMonths <= 3 && diffMonths > 0 // Within three months
})

// Fetch user data and validate on component mount
onMounted(async () => {
  try {
    const storedUser = localStorage.getItem('user'); // Retrieve the JSON string
const storedUsername = storedUser ? JSON.parse(storedUser).username : ''; // Parse and extract username


    // Simulate API call to fetch user data
    const userData = await fetchUserData()

    // Check if the username matches
    if (storedUsername !== userData.username) {
      alert('Unauthorized access. Username mismatch.')
      return
    }

    // If username matches, populate formData
    formData.value = { ...userData }

    // Validate eligibility
    validateEligibility()

    // Check if within three months of expiration
    if (isWithinThreeMonths.value) {
      warningMessage.value = `Your license is about to expire on ${expirationDate.value}. Please renew soon!`
      alert(warningMessage.value)
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
})

const validateEligibility = () => {
  isEligibleForRenewal.value = formData.value.credits >= minimumCredits
}

const handleSubmit = () => {
  if (!isEligibleForRenewal.value) {
    alert('You do not meet the minimum credit requirements for renewal.')
    return
  }
  if (new Date() < new Date(expirationDate.value)) {
    alert(`Your license is not yet expired. Expiration date: ${expirationDate.value}`)
    return
  }
  showConfirmation.value = true
}

const confirmSubmit = async () => {
  try {
    // Simulate API call to submit renewal
    await submitRenewal(formData.value)
    alert('Renewal submitted successfully!')
    showConfirmation.value = false
  } catch (error) {
    console.error('Error submitting renewal:', error)
    alert('Error submitting renewal. Please try again.')
  }
}

const handleCancel = () => {
  // Navigate back or clear form
}

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
    credits: 15,
    regdate: '2020-03-01',
    username: 'dtoby'
  }
}

const submitRenewal = async (data) => {
  // Replace with actual API call
  console.log('Submitting renewal:', data)
  return Promise.resolve()
}
</script>
