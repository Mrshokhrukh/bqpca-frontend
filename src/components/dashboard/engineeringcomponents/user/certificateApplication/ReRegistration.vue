<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Form Header -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
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
          <label class="block text-sm font-medium text-gray-700 required">Contact Number</label>
          <input type="tel" v-model="formData.contactNumber"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
          <span v-if="errors.contactNumber" class="text-sm text-red-500 mt-1">{{ errors.contactNumber }}</span>
        </div>

        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700 required">Email</label>
          <input type="email" v-model="formData.email"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
          <span v-if="errors.email" class="text-sm text-red-500 mt-1">{{ errors.email }}</span>
        </div>
      </div>

      <!-- Engineering Registration Details -->
      <div class="border-t border-b border-gray-200 bg-gray-50 p-6 mt-8">
        <h3 class="text-lg font-semibold text-gray-900">Registration Details</h3>
        <p class="mt-1 text-sm text-gray-500">Your current engineering registration information.</p>
      </div>

      <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Registration Number*</label>
          <input type="text" v-model="formData.registrationNumber" :readonly="true"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
        </div>

        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Registration Date*</label>
          <input type="date" v-model="formData.registrationDate" :readonly="true"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
        </div>

        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Expiry Date*</label>
          <input type="date" v-model="formData.expiryDate" :readonly="true"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
        </div>

        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Registration Type*</label>
          <input type="text" v-model="formData.registrationType" :readonly="true"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
        </div>
      </div>

      <!-- Remarks Section -->
      <div class="border-t border-gray-200 bg-gray-50 p-6 mt-8">
        <h3 class="text-lg font-semibold text-gray-900">Additional Information</h3>
      </div>

      <div class="p-8">
        <div>
          <label class="block text-sm font-medium text-gray-700">Remarks (if any)</label>
          <textarea v-model="formData.remarks" rows="3"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            placeholder="Add any additional information or special requests"></textarea>
        </div>

        <div class="mt-6 flex items-start space-x-3">
          <input type="checkbox" v-model="formData.declaration"
            class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" id="declaration" />
          <label for="declaration" class="text-sm text-gray-700 required">
            I hereby declare that all the information provided is true and correct to the best of my knowledge.
            I understand that providing false information may result in the rejection of my registration.
          </label>
        </div>
        <span v-if="errors.declaration" class="text-sm text-red-500 mt-1 pl-6">{{ errors.declaration }}</span>
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
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'
import apiService from '@/services/services'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const isConfirmationOpen = ref(false)
const isLoading = ref(false)

const formData = ref({
  cidNumber: '',
  fullName: '',
  gender: '',
  dateOfBirth: '',
  village: '',
  gewog: '',
  dzongkhag: '',
  contactNumber: '',
  email: '',
  registrationNumber: '',
  registrationDate: '',
  expiryDate: '',
  registrationType: '',
  remarks: '',
  declaration: false,
  applicationId: null
})

const errors = reactive({})

// Fetch user details and registration data
const fetchUserAndRegistrationDetails = async () => {
  try {
    isLoading.value = true
    const cid = authStore.user?.cid

    if (!cid) {
      toast.error("CID not found. Please ensure you are logged in.")
      return
    }

    // Get active applications by CID
    const applicationResponse = await apiService.getApplicationWithCid(cid)

    if (applicationResponse.data && applicationResponse.data.length > 0) {
      const application = applicationResponse.data[0]
      formData.value.applicationId = application.id
      formData.value.cidNumber = application.cid
      formData.value.fullName = application.full_name
      formData.value.gender = application.gender
      formData.value.dateOfBirth = application.date_of_birth
      formData.value.village = application.permanent_village
      formData.value.gewog = application.permanent_gewog
      formData.value.dzongkhag = application.permanent_dzongkhag
      formData.value.contactNumber = application.contact_number
      formData.value.email = application.email

      // Get existing registration details
      try {
        const renewalsResponse = await apiService.getEpcRenewals()
        const existingRenewal = renewalsResponse.data.results.find(
          renewal => renewal.application === application.id
        )

        if (existingRenewal) {
          formData.value.registrationNumber = existingRenewal.registration_no
          formData.value.registrationDate = existingRenewal.registration_date
          formData.value.expiryDate = existingRenewal.expiry_date

          // Fetch registration type name if we have its ID
          if (existingRenewal.registration_type) {
            try {
              const regTypeResponse = await apiService.getEpcMastersRegistrationType(existingRenewal.registration_type)
              formData.value.registrationType = regTypeResponse.data.registration_type_name
            } catch (error) {
              console.error('Error fetching registration type:', error)
              formData.value.registrationType = 'Unknown'
            }
          }
        } else {
          toast.warning('No existing registration found for renewal')
        }
      } catch (error) {
        console.error('Error fetching renewal details:', error)
        toast.error('Failed to retrieve registration details')
      }
    } else {
      toast.error('No application found for this user')
      router.push('/admin/user/engineering_certification/dashboard')
    }
  } catch (error) {
    console.error('Error fetching user details:', error)
    toast.error(error.response?.data?.message || 'Failed to fetch user details')
  } finally {
    isLoading.value = false
  }
}

const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key]) // Clear previous errors
  let isValid = true

  if (!formData.value.contactNumber) {
    errors.contactNumber = 'Contact Number is required'
    isValid = false
  }
  if (!formData.value.email) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!/^\S+@\S+\.\S+$/.test(formData.value.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }
  if (!formData.value.declaration) {
    errors.declaration = 'You must agree to the declaration'
    isValid = false
  }

  return isValid
}

const handleSubmit = (event) => {
  event.preventDefault()
  if (validateForm()) {
    isConfirmationOpen.value = true
  } else {
    toast.error('Please correct the errors in the form.')
  }
}

const confirmSubmit = async () => {
  try {
    isLoading.value = true

    // Prepare the renewal data
    const renewalData = {
      application: formData.value.applicationId,
      registration_no: formData.value.registrationNumber,
      registration_date: new Date().toISOString().split('T')[0], // Today's date
      expiry_date: new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString().split('T')[0], // 5 years from now
      remarks: formData.value.remarks,
      is_active: false, // Will be activated after review/payment
      payment_id: null, // To be updated after payment
      status: 'Pending'
    }

    // Update the application contact info first
    await apiService.patchEpcNewApplication(formData.value.applicationId, {
      contact_number: formData.value.contactNumber,
      email: formData.value.email
    })

    // Create the renewal
    const response = await apiService.createEpcRenewal(renewalData)

    if (response.status >= 200 && response.status < 300) {
      toast.success('Re-registration submitted successfully!')
      router.push('/admin/user/engineering_certification/dashboard')
    } else {
      throw new Error('Submission failed')
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    toast.error(error.response?.data?.message || 'Failed to submit re-registration. Please try again.')
  } finally {
    isLoading.value = false
    closeConfirmationModal()
  }
}

const closeConfirmationModal = () => {
  isConfirmationOpen.value = false
}

const handleCancel = () => {
  if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
    router.push('/admin/user/engineering_certification/dashboard')
  }
}

// Fetch user details when component mounts
onMounted(() => {
  fetchUserAndRegistrationDetails()
})
</script>

<style scoped>
.required::after {
  content: " *";
  color: #ef4444;
}
</style>
