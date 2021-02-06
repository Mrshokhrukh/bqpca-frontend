<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Form Header -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Re-Registration Application
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Please ensure all pre-filled information is correct. Update contact details if necessary. Fields marked with an
        asterisk (<span class="text-red-600">*</span>) are mandatory.
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="bg-white border rounded-xl shadow-sm p-6">
      <!-- Personal Information Section -->
      <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
        <h3 class="text-lg font-semibold text-gray-900">Personal Information</h3>
        <p class="mt-1 text-sm text-gray-500">Your pre-filled personal details.</p>
      </div>

      <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">CID/Identity/Work Permit No.*</label>
          <input type="text" v-model="formData.cidNumber" :readonly="true"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
        </div>

        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Full Name*</label>
          <input type="text" v-model="formData.fullName" :readonly="true"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
        </div>

        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Gender*</label>
          <input type="text" v-model="formData.gender" :readonly="true"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
        </div>

        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Date of Birth*</label>
          <input type="date" v-model="formData.dateOfBirth" :readonly="true"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
        </div>

        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Village*</label>
          <input type="text" v-model="formData.village" :readonly="true"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
        </div>

        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Gewog*</label>
          <input type="text" v-model="formData.gewog" :readonly="true"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
        </div>

        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Dzongkhag*</label>
          <input type="text" v-model="formData.dzongkhag" :readonly="true"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
        </div>

        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Contact Number</label>
          <input type="tel" v-model="formData.contactNumber"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
          <span v-if="errors.contactNumber" class="text-sm text-red-500 mt-1">{{ errors.contactNumber }}</span>
        </div>

        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" v-model="formData.email"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
          <span v-if="errors.email" class="text-sm text-red-500 mt-1">{{ errors.email }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-12 flex justify-end space-x-4 p-8">
        <button type="button" @click="handleCancel"
          class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button type="submit" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Confirm & Submit
        </button>
      </div>
    </form>

    <!-- Confirmation Modal -->
    <TransitionRoot appear :show="isConfirmationOpen" as="template">
      <Dialog as="div" @close="closeConfirmationModal" class="relative z-10">
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
          leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95">
              <DialogPanel
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  Confirm Re-Registration
                </DialogTitle>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to proceed with the re-registration? This action cannot be undone.
                  </p>
                </div>

                <div class="mt-4 flex space-x-4">
                  <button type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                    @click="confirmSubmit">
                    Confirm
                  </button>
                  <button type="button"
                    class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                    @click="closeConfirmationModal">
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification';

const router = useRouter()
const isConfirmationOpen = ref(false)
const toast = useToast();

const formData = ref({
  cidNumber: '', // These will be populated from your backend
  fullName: '',
  gender: '',
  dateOfBirth: '',
  village: '',
  gewog: '',
  dzongkhag: '',
  contactNumber: '',
  email: ''
})

const errors = reactive({}); // Validation Errors

// Simulated function to fetch user details
const fetchUserDetails = async (cidNumber) => {
  try {
    // Replace with actual API call
    const response = await fetch(`/api/user-details/${cidNumber}`)
    const data = await response.json()

    // Populate the form with fetched data
    formData.value = {
      ...formData.value,
      ...data
    }
  } catch (error) {
    console.error('Error fetching user details:', error)
    toast.error('Error fetching user details.');
  }
}

const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key]); // Clear previous errors
  let isValid = true;

  if (!formData.value.contactNumber) {
    errors.contactNumber = 'Contact Number is required';
    isValid = false;
  }
  if (!formData.value.email) {
    errors.email = 'Email is required';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = (event) => {
  event.preventDefault()
  if (validateForm()) {
    isConfirmationOpen.value = true;
  } else {
    toast.error('Please correct the errors in the form.');
  }
}

const confirmSubmit = async () => {
  try {
    // Replace with your actual API endpoint
    const response = await fetch('/api/re-registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData.value),
    })

    if (response.ok) {
      // Handle successful submission
      toast.success('Re-registration submitted successfully!')
      router.push('/dashboard') // Or wherever you want to redirect
    } else {
      throw new Error('Submission failed')
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    toast.error('Failed to submit re-registration. Please try again.')
  } finally {
    closeConfirmationModal()
  }
}

const closeConfirmationModal = () => {
  isConfirmationOpen.value = false
}

const handleCancel = () => {
  if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
    router.push('/dashboard') // Or wherever you want to redirect
  }
}

// Fetch user details when component mounts
onMounted(() => {
  // You would typically get the CID number from your route params or store
  const cidNumber = router.currentRoute.value.params.cidNumber
  if (cidNumber) {
    fetchUserDetails(cidNumber)
  }
})
</script>

<style scoped>
.required::after {
  content: " *";
  color: #ef4444;
}
</style>
