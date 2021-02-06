<template>
  <div class="min-h-screen py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 sm:max-w-xl sm:mx-auto">
      <div class="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
        <div class="max-w-md mx-auto">
          <div class="divide-y divide-gray-200">
            <div class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <h2 class="text-2xl font-bold mb-8 text-center text-gray-800">Re-Registration Application</h2>

              <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Personal Information Section -->
                <div class="space-y-4">
                  <div class="flex flex-col">
                    <label class="text-sm font-medium text-gray-700">CID/Identity/Work Permit No.*</label>
                    <input type="text" v-model="formData.cidNumber" :readonly="true"
                      class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm">
                  </div>

                  <div class="flex flex-col">
                    <label class="text-sm font-medium text-gray-700">Full Name*</label>
                    <input type="text" v-model="formData.fullName" :readonly="true"
                      class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm">
                  </div>

                  <div class="flex flex-col">
                    <label class="text-sm font-medium text-gray-700">Gender*</label>
                    <input type="text" v-model="formData.gender" :readonly="true"
                      class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm">
                  </div>

                  <div class="flex flex-col">
                    <label class="text-sm font-medium text-gray-700">Date of Birth*</label>
                    <input type="date" v-model="formData.dateOfBirth" :readonly="true"
                      class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm">
                  </div>

                  <!-- Address Information -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex flex-col">
                      <label class="text-sm font-medium text-gray-700">Village*</label>
                      <input type="text" v-model="formData.village" :readonly="true"
                        class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm">
                    </div>

                    <div class="flex flex-col">
                      <label class="text-sm font-medium text-gray-700">Gewog*</label>
                      <input type="text" v-model="formData.gewog" :readonly="true"
                        class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm">
                    </div>
                  </div>

                  <div class="flex flex-col">
                    <label class="text-sm font-medium text-gray-700">Dzongkhag*</label>
                    <input type="text" v-model="formData.dzongkhag" :readonly="true"
                      class="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm">
                  </div>

                  <!-- Contact Information -->
                  <div class="flex flex-col">
                    <label class="text-sm font-medium text-gray-700">Contact Number</label>
                    <input type="tel" v-model="formData.contactNumber"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                  </div>

                  <div class="flex flex-col">
                    <label class="text-sm font-medium text-gray-700">Email</label>
                    <input type="email" v-model="formData.email"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="pt-4 flex space-x-4">
                  <button type="button" @click="handleCancel"
                    class="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Cancel
                  </button>
                  <button type="submit"
                    class="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Confirm & Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

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
import { ref, onMounted } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isConfirmationOpen = ref(false)

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
  }
}

const handleSubmit = (event) => {
  event.preventDefault()
  isConfirmationOpen.value = true
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
      alert('Re-registration submitted successfully!')
      router.push('/dashboard') // Or wherever you want to redirect
    } else {
      throw new Error('Submission failed')
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('Failed to submit re-registration. Please try again.')
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
