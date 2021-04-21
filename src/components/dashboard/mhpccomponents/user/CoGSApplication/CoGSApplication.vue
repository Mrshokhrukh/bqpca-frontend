<template>
  <div class="bg-gray-50 py-6 sm:py-8">
    <div class="max-w-6xl mx-auto px-3 sm:px-4">
      <!-- Header -->
      <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-4 sm:p-6 mb-6">
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
          Certificate of Good Standing (CoGS) Application
        </h2>
        <p class="text-sm sm:text-base text-gray-600 text-center max-w-2xl mx-auto">
          Please fill in all required fields marked with an asterisk (<span class="text-red-600"
            >*</span
          >). Ensure all information provided is accurate and up-to-date.
        </p>
      </div>

      <!-- Main Form -->
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Hidden Fields (Prefilled from Auth Store) -->
        <input type="hidden" v-model="form.registration_no" />
        <input type="hidden" v-model="form.cid_no" />
        <input type="hidden" v-model="form.full_name" />
        <input type="hidden" v-model="form.gender" />

        <!-- Supervisor Details Section -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-6 border-b">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div
                class="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base"
              >
                1
              </div>
              <div>
                <h3 class="text-lg sm:text-xl font-bold text-gray-900">Supervisor Details</h3>
                <p class="mt-1 text-xs sm:text-sm text-gray-600">Information about your supervisor</p>
              </div>
            </div>
          </div>

          <div class="p-4 sm:p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <!-- Supervisor Name -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700 required"
                  >Supervisor's Name</label
                >
                <input
                  type="text"
                  v-model="form.supervisor_name"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter supervisor's name"
                />
                <span v-if="errors.supervisor_name" class="text-xs text-red-500 block">{{
                  errors.supervisor_name
                }}</span>
              </div>

              <!-- Supervisor Designation -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700 required"
                  >Supervisor's Designation</label
                >
                <input
                  type="text"
                  v-model="form.supervisor_designation"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter supervisor's designation"
                />
                <span v-if="errors.supervisor_designation" class="text-xs text-red-500 block">{{
                  errors.supervisor_designation
                }}</span>
              </div>

              <!-- Agency -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700 required">Agency</label>
                <Listbox v-model="form.agency">
                  <div class="relative">
                    <ListboxButton
                      class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-left"
                    >
                      <span class="block truncate">{{
                        selectedAgencyName || 'Select Agency'
                      }}</span>
                    </ListboxButton>
                    <transition
                      leave-active-class="transition duration-100 ease-in"
                      leave-from-class="opacity-100"
                      leave-to-class="opacity-0"
                    >
                      <ListboxOptions
                        class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-lg py-1 text-sm ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none"
                      >
                        <ListboxOption
                          v-for="agency in agencyOptions"
                          :key="agency.id"
                          :value="agency.id"
                          v-slot="{ active, selected }"
                        >
                          <div
                            :class="[
                              active ? 'text-white bg-blue-600' : 'text-gray-900',
                              'cursor-default select-none relative py-2 pl-10 pr-4',
                            ]"
                          >
                            <span
                              :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']"
                            >
                              {{ agency.name }}
                            </span>
                            <span
                              v-if="selected"
                              :class="[
                                active ? 'text-white' : 'text-blue-600',
                                'absolute inset-y-0 left-0 flex items-center pl-3',
                              ]"
                            >
                              <CheckIcon class="h-5 w-5" aria-hidden="true" />
                            </span>
                          </div>
                        </ListboxOption>
                      </ListboxOptions>
                    </transition>
                  </div>
                </Listbox>
                <span v-if="errors.agency" class="text-xs text-red-500 block">{{
                  errors.agency
                }}</span>
              </div>

              <!-- Supervisor Contact Number -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700 required"
                  >Supervisor's Contact Number</label
                >
                <input
                  type="tel"
                  v-model="form.contact_number"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter supervisor's contact number"
                />
                <span v-if="errors.contact_number" class="text-xs text-red-500 block">{{
                  errors.contact_number
                }}</span>
              </div>

              <!-- Supervisor Email Address -->
              <div class="space-y-1">
                <label class="block text-sm font-medium text-gray-700 required"
                  >Supervisor's Email Address</label
                >
                <input
                  type="email"
                  v-model="form.email_address"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter supervisor's email address"
                />
                <span v-if="errors.email_address" class="text-xs text-red-500 block">{{
                  errors.email_address
                }}</span>
              </div>

              <!-- Reason for Application -->
              <div class="space-y-1 md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 required"
                  >Reason for Application</label
                >
                <textarea
                  v-model="form.reason_for_application"
                  class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  rows="3"
                  placeholder="Enter reason for application"
                ></textarea>
                <span v-if="errors.reason_for_application" class="text-xs text-red-500 block">{{
                  errors.reason_for_application
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recipient Details Section -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-6 border-b">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div
                class="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base"
              >
                2
              </div>
              <div>
                <h3 class="text-lg sm:text-xl font-bold text-gray-900">Recipient Details</h3>
                <p class="mt-1 text-xs sm:text-sm text-gray-600">Information about the certificate recipient</p>
              </div>
            </div>
          </div>

          <div class="p-4 sm:p-6">
            <!-- Recipient Toggle -->
            <div class="mb-4 sm:mb-6">
              <Switch v-model="isRecipientSelf" class="relative inline-flex items-center">
                <span class="sr-only">Toggle recipient</span>
                <div
                  :class="[
                    isRecipientSelf ? 'bg-blue-600' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out',
                  ]"
                >
                  <span
                    :class="[
                      isRecipientSelf ? 'translate-x-6' : 'translate-x-1',
                      'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out mt-1',
                    ]"
                  />
                </div>
                <span class="ml-3 text-sm font-medium text-gray-900">{{
                  isRecipientSelf ? 'Self' : 'Other'
                }}</span>
              </Switch>
            </div>

            <!-- Other Recipient Form -->
            <TransitionRoot as="template" :show="!isRecipientSelf">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <!-- Recipient Name -->
                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-700 required"
                    >Recipient's Name</label
                  >
                  <input
                    type="text"
                    v-model="form.recipient_name"
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter recipient's name"
                  />
                  <span v-if="errors.recipient_name" class="text-xs text-red-500 block">{{
                    errors.recipient_name
                  }}</span>
                </div>

                <!-- Recipient Contact Number -->
                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-700 required"
                    >Recipient's Contact Number</label
                  >
                  <input
                    type="tel"
                    v-model="form.recipient_contact_number"
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter recipient's contact number"
                  />
                  <span v-if="errors.recipient_contact_number" class="text-xs text-red-500 block">{{
                    errors.recipient_contact_number
                  }}</span>
                </div>

                <!-- Recipient Email -->
                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-700 required"
                    >Recipient's Email</label
                  >
                  <input
                    type="email"
                    v-model="form.recipient_email"
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter recipient's email address"
                  />
                  <span v-if="errors.recipient_email" class="text-xs text-red-500 block">{{
                    errors.recipient_email
                  }}</span>
                </div>

                <!-- Recipient Address -->
                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-700 required"
                    >Recipient's Address</label
                  >
                  <input
                    type="text"
                    v-model="form.address"
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter recipient's full address"
                  />
                  <span v-if="errors.address" class="text-xs text-red-500 block">{{
                    errors.address
                  }}</span>
                </div>

                <!-- Recipient PO Box -->
                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-700">Recipient's PO. Box</label>
                  <input
                    type="text"
                    v-model="form.po_box"
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter recipient's PO Box (optional)"
                  />
                  <span v-if="errors.po_box" class="text-xs text-red-500 block">{{
                    errors.po_box
                  }}</span>
                </div>

                <!-- Recipient Zip Code -->
                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-700"
                    >Recipient's Zip code</label
                  >
                  <input
                    type="text"
                    v-model="form.zip_code"
                    class="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter recipient's zip code (optional)"
                  />
                  <span v-if="errors.zip_code" class="text-xs text-red-500 block">{{
                    errors.zip_code
                  }}</span>
                </div>
              </div>
            </TransitionRoot>
          </div>
        </div>

        <!-- Declaration Section -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 p-4 sm:p-6 border-b">
            <div class="flex items-center space-x-2 sm:space-x-3">
              <div
                class="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base"
              >
                3
              </div>
              <div>
                <h3 class="text-lg sm:text-xl font-bold text-gray-900">Declaration</h3>
                <p class="mt-1 text-xs sm:text-sm text-gray-600">Please read and agree to the terms</p>
              </div>
            </div>
          </div>

          <div class="p-4 sm:p-6">
            <div class="flex items-start space-x-3">
              <input
                type="checkbox"
                v-model="form.declaration"
                id="declarationCheckbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <label for="declarationCheckbox" class="text-sm text-gray-700">
                I declare that the information provided is true and accurate.
                <button type="button" @click="openTermsModal" class="text-blue-600 hover:underline">
                  Read More
                </button>
              </label>
            </div>
            <span v-if="errors.declaration" class="text-xs text-red-500 block mt-1">
              {{ errors.declaration }}
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            @click="cancelForm"
            class="px-4 py-2 rounded-lg text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="!form.declaration"
            class="px-4 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Application
          </button>
        </div>
      </form>

      <!-- Terms Modal -->
      <TransitionRoot as="template" :show="showTermsModal">
        <Dialog as="div" class="fixed z-50 inset-0 overflow-y-auto" @close="closeTermsModal">
          <div
            class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
          >
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="ease-in duration-200"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <span
              class="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            ></span>

            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div
                class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full"
              >
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <DialogTitle as="h3" class="text-lg leading-6 font-medium text-gray-900">
                        Terms and Conditions
                      </DialogTitle>
                      <div class="mt-4 prose prose-sm text-gray-500">
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                          commodo consequat.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    @click="closeTermsModal"
                  >
                    I Understand
                  </button>
                </div>
              </div>
            </TransitionChild>
          </div>
        </Dialog>
      </TransitionRoot>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useToast } from 'vue-toastification'
import apiService from '@/services/services'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Switch,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import {
  CheckIcon,
} from '@heroicons/vue/24/outline'

const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  registration_no: '',
  cid_no: '',
  full_name: '',
  gender: '',
  reason_for_application: '',
  supervisor_name: '',
  supervisor_designation: '',
  agency: null,
  contact_number: '',
  email_address: '',
  recipient_name: '',
  recipient_contact_number: '',
  recipient_email: '',
  address: '',
  po_box: '',
  zip_code: '',
  declaration: false,
})

const errors = reactive({})
const isRecipientSelf = ref(true)
const showTermsModal = ref(false)
const agencyOptions = ref([])
const message = ref('')
const messageClass = ref('')

const fetchRegistrationNumber = async (cid) => {
  try {
    const response = await apiService.getMhpcApplicationsByCid(cid)
    if (response.data && response.data.length > 0) {
      return response.data[0].registration_no
    }
    return null
  } catch (error) {
    toast.error('Failed to fetch registration number: ' + error.message)
    console.error('Error fetching registration number:', error)
    return null
  }
}

const fetchMasterData = async () => {
  try {
    const agenciesResponse = await apiService.getMhpcCogsAgencies()
    agencyOptions.value = agenciesResponse.data.results
  } catch (error) {
    toast.error('Failed to fetch master data: ' + error.message)
    console.error('Error fetching master data:', error)
  }
}

onMounted(async () => {
  if (authStore.user) {
    form.cid_no = authStore.user.cid
    form.full_name = authStore.user.middle_name
      ? `${authStore.user.first_name} ${authStore.user.middle_name} ${authStore.user.last_name}`
      : `${authStore.user.first_name} ${authStore.user.last_name}`
    form.gender = authStore.user.gender
    form.user_contact_number = authStore.user.contact_number
    form.user_email = authStore.user.email

    const registrationNumber = await fetchRegistrationNumber(form.cid_no)
    if (registrationNumber) {
      form.registration_no = registrationNumber
    }
    await fetchMasterData()
  }
  updateRecipientDetails()
})

const validateForm = () => {
  Object.keys(errors).forEach((key) => delete errors[key])
  let isValid = true

  if (!form.reason_for_application) {
    errors.reason_for_application = 'Reason for Application is required'
    isValid = false
  }
  if (!form.supervisor_name) {
    errors.supervisor_name = 'Supervisor Name is required'
    isValid = false
  }
  if (!form.supervisor_designation) {
    errors.supervisor_designation = 'Supervisor Designation is required'
    isValid = false
  }
  if (!form.agency) {
    errors.agency = 'Agency is required'
    isValid = false
  }
  if (!form.contact_number) {
    errors.contact_number = 'Supervisor Contact Number is required'
    isValid = false
  }
  if (!form.email_address) {
    errors.email_address = 'Supervisor Email is required'
    isValid = false
  }

  if (!isRecipientSelf.value) {
    if (!form.recipient_name) {
      errors.recipient_name = 'Recipient Name is required'
      isValid = false
    }
    if (!form.recipient_contact_number) {
      errors.recipient_contact_number = 'Recipient Contact Number is required'
      isValid = false
    }
    if (!form.recipient_email) {
      errors.recipient_email = 'Recipient Email is required'
      isValid = false
    }
    if (!form.address) {
      errors.address = 'Recipient Address is required'
      isValid = false
    }
  }
  if (!form.declaration) {
    errors.declaration = 'You must agree to the declaration before submitting.'
    isValid = false
  }
  return isValid
}

const submitForm = async () => {
  if (validateForm()) {
    const requestData = {
      registration_no: form.registration_no,
      cid_no: form.cid_no,
      full_name: form.full_name,
      gender: form.gender,
      reason_for_application: form.reason_for_application,
      supervisor_name: form.supervisor_name,
      supervisor_designation: form.supervisor_designation,
      agency: form.agency,
      department: null,
      workplace: null,
      contact_number: form.contact_number,
      email_address: form.email_address,
      recipient_name: isRecipientSelf.value ? form.full_name : form.recipient_name,
      recipient_contact_number: isRecipientSelf.value
        ? form.user_contact_number
        : form.recipient_contact_number,
      recipient_email: isRecipientSelf.value ? form.user_email : form.recipient_email,
      address: isRecipientSelf.value ? '' : form.address,
      po_box: isRecipientSelf.value ? '' : form.po_box,
      zip_code: isRecipientSelf.value ? '' : form.zip_code,
      declaration: form.declaration,
      review_status: 'Pending',
      review_remark: '',
      endorsement_decision: 'Pending',
      endorsement_remark: '',
      is_payment_complete: false,
      payment_id: '',
      is_active: true,
    }

    try {
      const response = await apiService.createMhpcCogs(requestData)

      if (response.status === 201) {
        toast.success('Application submitted successfully!')
        router.push('/admin/user/health_certification/dashboard')
      } else {
        toast.error('An unexpected error occurred. Please try again.')
        console.error('Unexpected response status:', response.status)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      if (error.response) {
        console.error('Error data:', error.response.data)
        console.error('Error status:', error.response.status)
        console.error('Error headers:', error.response.headers)
        toast.error(
          `Server error: ${error.response.status} - ${error.response.data.detail || 'See console for details'}`,
        )
      } else if (error.request) {
        toast.error('No response received from the server. Please check your network connection.')
      } else {
        toast.error('An error occurred: ' + error.message)
      }
    }
  } else {
    toast.error('Please correct the errors in the form.')
  }
}

const cancelForm = () => {
  Object.assign(form, {
    registration_no: '',
    cid_no: '',
    full_name: '',
    gender: '',
    reason_for_application: '',
    supervisor_name: '',
    supervisor_designation: '',
    agency: null,
    contact_number: '',
    email_address: '',
    recipient_name: '',
    recipient_contact_number: '',
    recipient_email: '',
    address: '',
    po_box: '',
    zip_code: '',
    declaration: false,
  })

  isRecipientSelf.value = true
  Object.keys(errors).forEach((key) => delete errors[key])

  message.value = 'Form has been cleared.'
  messageClass.value = 'text-blue-500'
  setTimeout(() => {
    message.value = ''
    messageClass.value = ''
  }, 3000)
}

const updateRecipientDetails = () => {
  if (isRecipientSelf.value && authStore.user) {
    form.recipient_name = authStore.user.fullName
    form.recipient_contact_number = authStore.user.contactNumber
    form.recipient_email = authStore.user.email
    form.address = ''
    form.po_box = ''
    form.zip_code = ''
  } else {
    form.recipient_name = ''
    form.recipient_contact_number = ''
    form.recipient_email = ''
    form.address = ''
    form.po_box = ''
    form.zip_code = ''
  }
}
watch(isRecipientSelf, updateRecipientDetails)

const openTermsModal = () => {
  showTermsModal.value = true
}

const closeTermsModal = () => {
  showTermsModal.value = false
}

const selectedAgencyName = computed(() => {
  const agency = agencyOptions.value.find((a) => a.id === form.agency)
  return agency ? agency.name : ''
})
</script>

<style scoped>
.required::after {
  content: ' *';
  color: #ef4444;
}

/* Custom checkbox styling */
input[type='checkbox'] {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  height: 1.25rem;
  width: 1.25rem;
  border: 2px solid #9ca3af;
  border-radius: 0.25rem;
  cursor: pointer;
  display: inline-block;
  position: relative;
  vertical-align: middle;
}

/* Checkmark styles (hidden by default) */
input[type='checkbox']::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  width: 0.75rem;
  height: 0.75rem;
  background-color: #3b82f6;
  border-radius: 0.125rem;
  transition: transform 0.15s ease-in-out;
}

/* Show checkmark when checked */
input[type='checkbox']:checked::before {
  transform: translate(-50%, -50%) scale(1);
}

/* Focus styles */
input[type='checkbox']:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.5);
  border-color: #60a5fa;
}

/*  Hover Style */
input[type='checkbox']:hover {
  border-color: #4b5563;
}

/* Responsive text sizes */
@media (max-width: 640px) {
  .text-sm {
    font-size: 0.8125rem;
  }
  .text-xs {
    font-size: 0.75rem;
  }
}
</style>