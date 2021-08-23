<template>
  <div class="w-full mx-auto px-4 sm:px-6 py-8 bg-gray-50 min-h-screen">
    <PageHeader title="Certificate of Good Standing (CoGS) Application"
      subtitle="Please fill in all required fields marked with an asterisk (*). Ensure all information provided is accurate and up-to-date.">
      <template #icon>
        <FileText class="w-6 h-6 text-blue-600" />
      </template>
    </PageHeader>

    <form @submit.prevent="submitForm" class="space-y-8 mt-8">
      <!-- CRITICAL: Only the registration number is needed to identify the user -->
      <input type="hidden" v-model="form.registration_no" />

      <!-- Section 1: Supervisor Details -->
      <div
        class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl group">
        <div class="p-5 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-blue-50 to-blue-50">
          <div class="flex items-center space-x-4">
            <div
              class="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xl shadow-md transition-transform group-hover:scale-105">
              1
            </div>
            <div>
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900">Supervisor Details</h3>
              <p class="mt-1 text-xs sm:text-sm text-gray-600">
                Provide information about your current supervisor.
              </p>
            </div>
          </div>
        </div>

        <div class="p-6 sm:p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <!-- Supervisor Name -->
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-gray-700 required" for="supervisor_name">Supervisor's
                Name</label>
              <input type="text" id="supervisor_name" v-model="form.supervisor_name" class="form-input"
                placeholder="Enter supervisor's full name" />
              <span v-if="errors.supervisor_name" class="error-message">{{
                errors.supervisor_name
              }}</span>
            </div>

            <!-- Supervisor Designation -->
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-gray-700 required" for="supervisor_designation">Supervisor's
                Designation</label>
              <input type="text" id="supervisor_designation" v-model="form.supervisor_designation" class="form-input"
                placeholder="e.g., Head of Department" />
              <span v-if="errors.supervisor_designation" class="error-message">{{
                errors.supervisor_designation
              }}</span>
            </div>

            <!-- Agency / Organization -->
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-gray-700 required" for="agency">Agency / Organization</label>
              <Listbox v-model="form.agency" as="div">
                <div class="relative">
                  <ListboxButton class="form-input text-left w-full">
                    <span class="block truncate">{{ selectedAgencyName || 'Select Agency' }}</span>
                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronDown class="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </ListboxButton>
                  <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100"
                    leave-to-class="opacity-0">
                    <ListboxOptions
                      class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      <ListboxOption v-for="agency in agencyOptions" :key="agency.id" :value="agency.id"
                        v-slot="{ active, selected }">
                        <li :class="[
                          active ? 'text-white bg-blue-600' : 'text-gray-900',
                          'cursor-default select-none relative py-2 pl-10 pr-4',
                        ]">
                          <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                            {{ agency.name }}
                          </span>
                          <span v-if="selected" :class="[
                            active ? 'text-white' : 'text-blue-600',
                            'absolute inset-y-0 left-0 flex items-center pl-3',
                          ]">
                            <Check class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
              <span v-if="errors.agency" class="error-message">{{ errors.agency }}</span>
            </div>

            <!-- Department -->
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-gray-700" for="department">Department</label>
              <Listbox v-model="form.department" as="div">
                <div class="relative">
                  <ListboxButton class="form-input text-left w-full">
                    <span class="block truncate">{{ selectedDepartmentName || 'Select Department (Optional)' }}</span>
                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronDown class="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </ListboxButton>
                  <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100"
                    leave-to-class="opacity-0">
                    <ListboxOptions
                      class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      <ListboxOption v-for="department in departmentOptions" :key="department.id" :value="department.id"
                        v-slot="{ active, selected }">
                        <li :class="[
                          active ? 'text-white bg-blue-600' : 'text-gray-900',
                          'cursor-default select-none relative py-2 pl-10 pr-4',
                        ]">
                          <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                            {{ department.name }}
                          </span>
                          <span v-if="selected" :class="[
                            active ? 'text-white' : 'text-blue-600',
                            'absolute inset-y-0 left-0 flex items-center pl-3',
                          ]">
                            <Check class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
              <span v-if="errors.department" class="error-message">{{ errors.department }}</span>
            </div>

            <!-- Workplace -->
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-gray-700" for="workplace">Workplace</label>
              <Listbox v-model="form.workplace" as="div">
                <div class="relative">
                  <ListboxButton class="form-input text-left w-full">
                    <span class="block truncate">{{ selectedWorkplaceName || 'Select Workplace (Optional)' }}</span>
                    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronDown class="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </ListboxButton>
                  <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100"
                    leave-to-class="opacity-0">
                    <ListboxOptions
                      class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      <ListboxOption v-for="workplace in workplaceOptions" :key="workplace.id" :value="workplace.id"
                        v-slot="{ active, selected }">
                        <li :class="[
                          active ? 'text-white bg-blue-600' : 'text-gray-900',
                          'cursor-default select-none relative py-2 pl-10 pr-4',
                        ]">
                          <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                            {{ workplace.name }}
                          </span>
                          <span v-if="selected" :class="[
                            active ? 'text-white' : 'text-blue-600',
                            'absolute inset-y-0 left-0 flex items-center pl-3',
                          ]">
                            <Check class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
              <span v-if="errors.workplace" class="error-message">{{ errors.workplace }}</span>
            </div>

            <!-- Custom Workplace Input (appears when "Other" is selected) -->
            <div v-if="showCustomWorkplaceInput" class="space-y-1.5 md:col-start-1">
              <label class="block text-sm font-medium text-gray-700 required" for="custom_workplace_name">Specify
                Workplace
                Name</label>
              <input type="text" id="custom_workplace_name" v-model="form.custom_workplace_name" class="form-input"
                placeholder="Enter your workplace name" />
              <span v-if="errors.custom_workplace_name" class="error-message">{{
                errors.custom_workplace_name
                }}</span>
              <p class="text-xs text-gray-500">
                This will create a new workplace entry in our system.
              </p>
            </div>

            <!-- Supervisor Contact Number -->
            <div class="space-y-1.5">
              <label class="block text-sm font-medium text-gray-700 required" for="contact_number">Supervisor's Contact
                Number</label>
              <input type="tel" id="contact_number" v-model="form.contact_number" class="form-input"
                placeholder="Enter 8-digit mobile number" />
              <span v-if="errors.contact_number" class="error-message">{{
                errors.contact_number
              }}</span>
            </div>

            <!-- Supervisor Email -->
            <div class="space-y-1.5 md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 required" for="email_address">Supervisor's Email
                Address</label>
              <input type="email" id="email_address" v-model="form.email_address" class="form-input"
                placeholder="Enter valid official email" />
              <span v-if="errors.email_address" class="error-message">{{
                errors.email_address
              }}</span>
            </div>

            <!-- Reason for Application -->
            <div class="space-y-1.5 md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 required" for="reason_for_application">Reason for
                Application</label>
              <textarea id="reason_for_application" v-model="form.reason_for_application" class="form-input" rows="3"
                placeholder="Briefly state why you need this certificate"></textarea>
              <span v-if="errors.reason_for_application" class="error-message">{{
                errors.reason_for_application
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: Recipient Details -->
      <div
        class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl group">
        <div class="p-5 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-blue-50 to-blue-50">
          <div class="flex items-center space-x-4">
            <div
              class="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xl shadow-md transition-transform group-hover:scale-105">
              2
            </div>
            <div>
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900">Recipient Details</h3>
              <p class="mt-1 text-xs sm:text-sm text-gray-600">
                Who should receive the certificate?
              </p>
            </div>
          </div>
        </div>

        <div class="p-6 sm:p-8">
          <div class="mb-6">
            <label class="flex items-center cursor-pointer">
              <Switch v-model="isRecipientSelf" :class="[
                isRecipientSelf ? 'bg-blue-600' : 'bg-gray-200',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              ]">
                <span class="sr-only">Toggle recipient</span>
                <span :class="[
                  isRecipientSelf ? 'translate-x-5' : 'translate-x-0',
                  'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                ]">
                  <span :class="[
                    isRecipientSelf
                      ? 'opacity-0 duration-100 ease-out'
                      : 'opacity-100 duration-200 ease-in',
                    'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
                  ]" aria-hidden="true"></span>
                  <span :class="[
                    isRecipientSelf
                      ? 'opacity-100 duration-200 ease-in'
                      : 'opacity-0 duration-100 ease-out',
                    'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity',
                  ]" aria-hidden="true"></span>
                </span>
              </Switch>
              <span class="ml-3">
                <span class="text-sm font-medium text-gray-900">Recipient is Self</span>
                <span class="text-xs text-gray-500 block">(Toggle if certificate is for another
                  person/organization)</span>
              </span>
            </label>
          </div>

          <TransitionRoot :show="!isRecipientSelf" enter="transition-opacity duration-300 ease-out"
            enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity duration-200 ease-in"
            leave-from="opacity-100" leave-to="opacity-0" as="div">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              <!-- Recipient Name -->
              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-gray-700 required" for="recipient_name">Recipient's
                  Name</label>
                <input type="text" id="recipient_name" v-model="form.recipient_name" class="form-input"
                  placeholder="Enter recipient's full name" :disabled="isRecipientSelf" />
                <span v-if="errors.recipient_name" class="error-message">{{
                  errors.recipient_name
                }}</span>
              </div>

              <!-- Recipient Contact Number -->
              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-gray-700 required"
                  for="recipient_contact_number">Recipient's
                  Contact Number</label>
                <input type="tel" id="recipient_contact_number" v-model="form.recipient_contact_number"
                  class="form-input" placeholder="Enter recipient's contact no." :disabled="isRecipientSelf" />
                <span v-if="errors.recipient_contact_number" class="error-message">{{
                  errors.recipient_contact_number
                }}</span>
              </div>

              <!-- Recipient Email -->
              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-gray-700 required" for="recipient_email">Recipient's
                  Email</label>
                <input type="email" id="recipient_email" v-model="form.recipient_email" class="form-input"
                  placeholder="Enter recipient's email address" :disabled="isRecipientSelf" />
                <span v-if="errors.recipient_email" class="error-message">{{
                  errors.recipient_email
                }}</span>
              </div>

              <!-- Recipient Address -->
              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-gray-700 required" for="address">Recipient's Full
                  Address</label>
                <input type="text" id="address" v-model="form.address" class="form-input"
                  placeholder="Street, City, Country" :disabled="isRecipientSelf" />
                <span v-if="errors.address" class="error-message">{{ errors.address }}</span>
              </div>

              <!-- Recipient PO Box -->
              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-gray-700" for="po_box">Recipient's PO. Box
                  (Optional)</label>
                <input type="text" id="po_box" v-model="form.po_box" class="form-input"
                  placeholder="Enter PO Box if applicable" :disabled="isRecipientSelf" />
                <span v-if="errors.po_box" class="error-message">{{ errors.po_box }}</span>
              </div>

              <!-- Recipient Zip Code -->
              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-gray-700" for="zip_code">Recipient's Zip/Postal Code
                  (Optional)</label>
                <input type="text" id="zip_code" v-model="form.zip_code" class="form-input"
                  placeholder="Enter zip code if applicable" :disabled="isRecipientSelf" />
                <span v-if="errors.zip_code" class="error-message">{{ errors.zip_code }}</span>
              </div>
            </div>
          </TransitionRoot>
        </div>
      </div>

      <!-- Section 3: Declaration & Submission -->
      <div
        class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl group">
        <div class="p-5 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 via-blue-50 to-blue-50">
          <div class="flex items-center space-x-4">
            <div
              class="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xl shadow-md transition-transform group-hover:scale-105">
              3
            </div>
            <div>
              <h3 class="text-lg sm:text-xl font-semibold text-gray-900">
                Declaration & Submission
              </h3>
              <p class="mt-1 text-xs sm:text-sm text-gray-600">
                Confirm the accuracy of your information.
              </p>
            </div>
          </div>
        </div>

        <div class="p-6 sm:p-8">
          <div class="bg-blue-50 p-4 rounded-lg mb-5 border border-blue-100">
            <p class="text-sm text-blue-800">
              By submitting this application, I solemnly declare that all the information provided
              herein is true, accurate, and complete to the best of my knowledge and belief. I
              understand that any false statement may lead to the rejection of this application or
              revocation of the certificate.
            </p>
          </div>
          <div class="flex items-start space-x-3">
            <input type="checkbox" v-model="form.declaration" id="declarationCheckbox"
              class="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5 flex-shrink-0" />
            <label for="declarationCheckbox" class="text-sm text-gray-700 select-none cursor-pointer">
              I confirm that I have read the declaration above and agree to the
              <button type="button" @click.stop="openTermsModal"
                class="text-blue-600 hover:text-blue-800 hover:underline font-medium ml-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded">
                Terms & Conditions</button>. <span class="text-red-600 font-medium">*</span>
            </label>
          </div>
          <span v-if="errors.declaration" class="error-message block mt-2">{{
            errors.declaration
          }}</span>
        </div>
      </div>

      <!-- Message Area -->
      <div v-if="message" :class="['p-4 rounded-lg text-sm mt-6', messageClass]">
        {{ message }}
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end space-x-4 pt-4">
        <button type="button" @click="cancelForm" class="btn btn-secondary">Cancel</button>
        <button type="submit" :disabled="!form.declaration"
          class="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
          Submit Application
        </button>
      </div>
    </form>

    <!-- Terms Modal -->
    <TransitionRoot as="template" :show="showTermsModal">
      <Dialog as="div" class="relative z-50" @close="closeTermsModal">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
          leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel
                class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div
                      class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <FileText class="h-6 w-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900">
                        Terms and Conditions
                      </DialogTitle>
                      <div class="mt-4 prose prose-sm max-w-none text-gray-600">
                        <p>
                          By submitting this application for a Certificate of Good Standing (CoGS),
                          I hereby declare and agree to the following:
                        </p>
                        <ol class="list-decimal pl-5 space-y-2 mt-3">
                          <li>
                            All information provided in this application form and any supporting
                            documents is true, accurate, and complete to the best of my knowledge
                            and belief.
                          </li>
                          <li>
                            I understand that providing false, misleading, or incomplete information
                            may result in the rejection of this application, revocation of any
                            certificate issued, and potential disciplinary or legal action.
                          </li>
                          <li>
                            I authorize the relevant council or regulatory body (e.g., EPC) to
                            verify the information provided, including contacting my supervisor and
                            agency/organization.
                          </li>
                          <li>
                            I agree to comply with all applicable laws, regulations, codes of
                            conduct, and professional standards pertaining to my profession and the
                            purpose for which the CoGS is sought.
                          </li>
                          <li>
                            I understand that the CoGS confirms my registration status and standing
                            *at the time of issuance* and does not guarantee future standing.
                          </li>
                          <li>
                            I consent to the collection, use, and disclosure of my personal
                            information as necessary for the processing of this application and the
                            issuance of the CoGS.
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button type="button"
                    class="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    @click="closeTermsModal">
                    I Understand & Agree
                  </button>
                  <button type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    @click="closeTermsModal">
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
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useToast } from 'vue-toastification'
import apiService from '@/services/services'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/common/MHPC/PageHeader.vue' // Adjust path if needed
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Switch,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { FileText, ChevronDown, Check } from 'lucide-vue-next'

const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  registration_no: '',
  // User's own details are stored for pre-filling but not sent directly in the payload
  user_full_name: '',
  user_contact_number: '',
  user_email: '',
  // Form fields
  reason_for_application: '',
  supervisor_name: '',
  supervisor_designation: '',
  agency: null,
  department: null,
  workplace: null,
  custom_workplace_name: '',
  contact_number: '',
  email_address: '',
  // Recipient fields
  recipient_name: '',
  recipient_contact_number: '',
  recipient_email: '',
  address: '',
  po_box: '',
  zip_code: '',
  declaration: false,
})

const errors = reactive({})
const isRecipientSelf = ref(true) // This now drives the logic
const showTermsModal = ref(false)
const agencyOptions = ref([])
const departmentOptions = ref([])
const workplaceOptions = ref([])
const message = ref('')
const messageClass = ref('')

const fetchRegistrationNumber = async (cid) => {
  // ... (your existing function is fine, no changes needed)
  if (!cid) return null
  try {
    const response = await apiService.getEpcApplicationsByCid(cid)
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      const sortedApps = response.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      )
      return sortedApps[0].registration_no || sortedApps[0].id
    }
    return null
  } catch (error) {
    console.error('Error fetching registration number:', error)
    return null
  }
}

const fetchMasterData = async () => {
  // ... (your existing function is fine, no changes needed)
  try {
    const [agenciesResponse, departmentsResponse, workplacesResponse] = await Promise.all([
      apiService.getEpcCogsAgencies({ limit: 1000 }),
      apiService.getEpcCogsDepartments({ limit: 1000 }),
      apiService.getEpcCogsWorkplaces({ limit: 1000 }),
    ])
    agencyOptions.value = agenciesResponse.data.results || agenciesResponse.data || []
    departmentOptions.value = departmentsResponse.data.results || departmentsResponse.data || []
    const workplacesData = workplacesResponse.data.results || workplacesResponse.data || []
    workplaceOptions.value = [...workplacesData, { id: 'other', name: 'Other (Please specify)' }]
  } catch (error) {
    console.error('Error fetching master data:', error)
  }
}

onMounted(async () => {
  if (authStore.user && authStore.user.cid) {
    // Store user details for later use
    form.user_full_name = authStore.user.middle_name
      ? `${authStore.user.first_name} ${authStore.user.middle_name} ${authStore.user.last_name}`
      : `${authStore.user.first_name} ${authStore.user.last_name}`
    form.user_contact_number = authStore.user.contact_number || ''
    form.user_email = authStore.user.email || ''

    const registrationNumber = await fetchRegistrationNumber(authStore.user.cid)
    if (registrationNumber) {
      form.registration_no = registrationNumber
    } else {
      toast.warning(
        'Could not find a valid registration number. Please complete your primary registration first.',
        { timeout: 7000 },
      )
    }
    await fetchMasterData()
  } else {
    toast.error('User information not found. Please log in again.')
    router.push('/login')
  }
})

// Your validateForm function is excellent and already handles the logic correctly. No changes needed.
const validateForm = () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
  let isValid = true
  const phoneRegex = /^(17|77|16)\d{6}$/
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!form.supervisor_name.trim()) { errors.supervisor_name = 'Supervisor Name is required'; isValid = false }
  if (!form.supervisor_designation.trim()) { errors.supervisor_designation = 'Supervisor Designation is required'; isValid = false }
  if (!form.agency) { errors.agency = 'Agency is required'; isValid = false }
  if (!form.contact_number.trim() || !phoneRegex.test(form.contact_number)) { errors.contact_number = 'Valid 8-digit supervisor contact is required'; isValid = false }
  if (!form.email_address.trim() || !emailRegex.test(form.email_address)) { errors.email_address = 'Valid supervisor email is required'; isValid = false }
  if (!form.reason_for_application.trim()) { errors.reason_for_application = 'Reason for application is required'; isValid = false }
  if (!form.declaration) { errors.declaration = 'You must agree to the declaration'; isValid = false }

  if (!isRecipientSelf.value) {
    if (!form.recipient_name.trim()) { errors.recipient_name = 'Recipient Name is required'; isValid = false }
    if (!form.recipient_contact_number.trim() || !phoneRegex.test(form.recipient_contact_number)) { errors.recipient_contact_number = 'Valid 8-digit recipient contact is required'; isValid = false }
    if (!form.recipient_email.trim() || !emailRegex.test(form.recipient_email)) { errors.recipient_email = 'Valid recipient email is required'; isValid = false }
    if (!form.address.trim()) { errors.address = "Recipient's address is required"; isValid = false }
  }

  if (form.workplace === 'other' && !form.custom_workplace_name.trim()) {
    errors.custom_workplace_name = 'Please specify the workplace name'
    isValid = false
  }

  return isValid
}


// =================================================================
// START: *** THIS IS THE CORRECTED SUBMIT FUNCTION ***
// =================================================================
const submitForm = async () => {
  if (!validateForm()) {
    toast.warning('Please fill in all required fields correctly.')
    scrollToFirstError()
    return
  }

  try {
    let workplaceId = form.workplace
    // Handle custom workplace creation if needed
    if (form.workplace === 'other' && form.custom_workplace_name.trim()) {
      const newWorkplace = await apiService.createEpcCogsWorkplace({ name: form.custom_workplace_name.trim() })
      workplaceId = newWorkplace.data.id
    }

    // Construct the final payload for the API
    const requestData = {
      // Key identifier for the user
      registration_no: form.registration_no,

      // NEW & CRITICAL: Send the boolean flag to the backend
      is_recipient_self: isRecipientSelf.value,

      // Supervisor and application details
      reason_for_application: form.reason_for_application,
      supervisor_name: form.supervisor_name,
      supervisor_designation: form.supervisor_designation,
      agency: form.agency,
      department: form.department || null,
      workplace: workplaceId === 'other' ? null : workplaceId,
      contact_number: form.contact_number, // This is SUPERVISOR's contact
      email_address: form.email_address, // This is SUPERVISOR's email

      // CHANGED: Recipient details are now conditional
      // Send third-party details only if the switch is off. Otherwise, send null.
      // The backend will use `is_recipient_self` to know it should use the applicant's own details.
      recipient_name: !isRecipientSelf.value ? form.recipient_name : null,
      recipient_contact_number: !isRecipientSelf.value ? form.recipient_contact_number : null,
      recipient_email: !isRecipientSelf.value ? form.recipient_email : null,
      address: !isRecipientSelf.value ? form.address : null,
      po_box: !isRecipientSelf.value ? form.po_box || null : null,
      zip_code: !isRecipientSelf.value ? form.zip_code || null : null,

      // Declaration
      declaration: form.declaration,
    }

    const response = await apiService.createEpcCogs(requestData)

    if (response.status === 201) {
      toast.success('Application submitted successfully!')
      router.push('/admin/user/engineering_certification/dashboard') // Or your success page
    }
  } catch (error) {
    toast.error('An error occurred during submission. Please try again.')
    console.error('Submission error:', error.response?.data || error.message)
    // Your existing detailed error handling is good
    if (error.response?.data) {
        // ... (handle specific field errors from backend)
    }
  }
}
// =================================================================
// END: *** CORRECTED SUBMIT FUNCTION ***
// =================================================================


// This watcher correctly clears the form fields when the switch is toggled.
watch(isRecipientSelf, (isSelf) => {
  if (isSelf) {
    // Clear third-party fields when switching back to "Self"
    form.recipient_name = ''
    form.recipient_contact_number = ''
    form.recipient_email = ''
    form.address = ''
    form.po_box = ''
    form.zip_code = ''
    // Clear any validation errors for these fields
    delete errors.recipient_name
    delete errors.recipient_contact_number
    delete errors.recipient_email
    delete errors.address
  }
})

// Helper functions (no changes needed to these)
const openTermsModal = () => { showTermsModal.value = true }
const closeTermsModal = () => { showTermsModal.value = false }
const showCustomWorkplaceInput = computed(() => form.workplace === 'other')
const selectedAgencyName = computed(() => agencyOptions.value.find((a) => a.id === form.agency)?.name || '')
const selectedDepartmentName = computed(() => departmentOptions.value.find((d) => d.id === form.department)?.name || '')
const selectedWorkplaceName = computed(() => {
  if (form.workplace === 'other') return 'Other (Please specify)'
  return workplaceOptions.value.find((w) => w.id === form.workplace)?.name || ''
})
const scrollToFirstError = () => {
  const firstErrorElement = document.querySelector('.error-message')
  if (firstErrorElement) {
    firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}
const cancelForm = () => {
  if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
    router.back() // or router.push('/dashboard')
  }
}
</script>
<style>
.form-input {
  @apply block w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out sm:text-sm;
}

.form-input:disabled {
  @apply bg-gray-100 cursor-not-allowed opacity-70;
}

.required::after {
  content: ' *';
  color: theme('colors.red.600');
  font-weight: 600;
}

.error-message {
  @apply text-xs text-red-600 mt-1;
}

.btn {
  @apply inline-flex justify-center items-center px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ease-in-out;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
}

.btn-secondary {
  @apply bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500;
}

.headlessui-listbox-option[data-headlessui-state~='active'] {
  background-color: theme('colors.blue.600');
  color: white;
}

.headlessui-switch[data-headlessui-state~='checked'] {
  background-color: theme('colors.blue.600');
}

.headlessui-switch[data-headlessui-state~='not-checked'] {
  background-color: theme('colors.gray.200');
}
</style>