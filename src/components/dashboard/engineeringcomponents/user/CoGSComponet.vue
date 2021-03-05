<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Enhanced Header with Animation -->
      <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
        <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
          Certificate of Goods Standing (CoGS) Application
        </h2>
        <p class="text-gray-600 text-center max-w-2xl mx-auto">
          Please fill in all required fields marked with an asterisk (<span class="text-red-600">*</span>). Ensure all
          information provided is accurate and up-to-date.
        </p>
      </div>

      <!-- Main Form -->
      <form @submit.prevent="submitForm" class="space-y-8">
        <!-- Hidden Fields (Prefilled from Auth Store) -->
        <input type="hidden" v-model="form.registration_no" />
        <input type="hidden" v-model="form.cid_no" />
        <input type="hidden" v-model="form.full_name" />
        <input type="hidden" v-model="form.gender" />

        <!-- Supervisor Details Section -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 p-8 border-b">
            <div class="flex items-center space-x-3">
              <div
                class="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">Supervisor Details</h3>
                <p class="mt-1 text-gray-600">Information about your supervisor</p>
              </div>
            </div>
          </div>

          <div class="p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Supervisor Name -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 required">Supervisor's Name</label>
                <input type="text" v-model="form.supervisor_name"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter supervisor's name" />
                <span v-if="errors.supervisor_name" class="text-sm text-red-500 block">{{ errors.supervisor_name
                  }}</span>
              </div>

              <!-- Supervisor Designation -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 required">Supervisor's Designation</label>
                <input type="text" v-model="form.supervisor_designation"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter supervisor's designation" />
                <span v-if="errors.supervisor_designation" class="text-sm text-red-500 block">{{
        errors.supervisor_designation }}</span>
              </div>

              <!-- Agency -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 required">Agency</label>
                <Listbox v-model="form.agency">
                  <div class="relative">
                    <ListboxButton
                      class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-left">
                      <span class="block truncate">{{ selectedAgencyName || 'Select Agency' }}</span>
                    </ListboxButton>
                    <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100"
                      leave-to-class="opacity-0">
                      <ListboxOptions
                        class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        <ListboxOption v-for="agency in agencyOptions" :key="agency.id" :value="agency.id"
                          v-slot="{ active, selected }">
                          <div :class="[
        active ? 'text-white bg-blue-600' : 'text-gray-900',
        'cursor-default select-none relative py-2 pl-10 pr-4'
      ]">
                            <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                              {{ agency.name }}
                            </span>
                            <span v-if="selected" :class="[
        active ? 'text-white' : 'text-blue-600',
        'absolute inset-y-0 left-0 flex items-center pl-3'
      ]">
                              <CheckIcon class="h-5 w-5" aria-hidden="true" />
                            </span>
                          </div>
                        </ListboxOption>
                      </ListboxOptions>
                    </transition>
                  </div>
                </Listbox>
                <span v-if="errors.agency" class="text-sm text-red-500 block">{{ errors.agency }}</span>
              </div>


              <!-- Supervisor Contact Number -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 required">Supervisor's Contact Number</label>
                <input type="tel" v-model="form.contact_number"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter supervisor's contact number" />
                <span v-if="errors.contact_number" class="text-sm text-red-500 block">{{
        errors.contact_number }}</span>
              </div>

              <!-- Supervisor Email Address -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 required">Supervisor's Email Address</label>
                <input type="email" v-model="form.email_address"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter supervisor's email address" />
                <span v-if="errors.email_address" class="text-sm text-red-500 block">{{ errors.email_address
                  }}</span>
              </div>

              <!-- Reason for Application -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 required">Reason for Application</label>
                <textarea v-model="form.reason_for_application"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  rows="3" placeholder="Enter reason for application"></textarea>
                <span v-if="errors.reason_for_application" class="text-sm text-red-500 block">{{
        errors.reason_for_application }}</span>
              </div>

            </div>
          </div>
        </div>

        <!-- Recipient Details Section -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 p-8 border-b">
            <div class="flex items-center space-x-3">
              <div
                class="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">Recipient Details</h3>
                <p class="mt-1 text-gray-600">Information about the certificate recipient</p>
              </div>
            </div>
          </div>

          <div class="p-8">
            <!-- Recipient Toggle -->
            <div class="mb-8">
              <Switch v-model="isRecipientSelf" class="relative inline-flex items-center">
                <span class="sr-only">Toggle recipient</span>
                <div :class="[
        isRecipientSelf ? 'bg-blue-600' : 'bg-gray-200',
        'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out'
      ]">
                  <span :class="[
        isRecipientSelf ? 'translate-x-6' : 'translate-x-1',
        'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out mt-1'
      ]" />
                </div>
                <span class="ml-3 text-sm font-medium text-gray-900">{{ isRecipientSelf ? 'Self' : 'Other' }}</span>
              </Switch>
            </div>

            <!-- Other Recipient Form -->
            <TransitionRoot as="template" :show="!isRecipientSelf">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Recipient Name -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 required">Recipient's Name</label>
                  <input type="text" v-model="form.recipient_name"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter recipient's name" />
                  <span v-if="errors.recipient_name" class="text-sm text-red-500 block">{{ errors.recipient_name
                    }}</span>
                </div>

                <!-- Recipient Contact Number -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 required">Recipient's Contact Number</label>
                  <input type="tel" v-model="form.recipient_contact_number"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter recipient's contact number" />
                  <span v-if="errors.recipient_contact_number" class="text-sm text-red-500 block">{{
        errors.recipient_contact_number }}</span>
                </div>

                <!-- Recipient Email -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 required">Recipient's Email</label>
                  <input type="email" v-model="form.recipient_email"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter recipient's email address" />
                  <span v-if="errors.recipient_email" class="text-sm text-red-500 block">{{ errors.recipient_email
                    }}</span>
                </div>

                <!-- Recipient Address -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 required">Recipient's Address</label>
                  <input type="text" v-model="form.address"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter recipient's full address" />
                  <span v-if="errors.address" class="text-sm text-red-500 block">{{ errors.address
                    }}</span>
                </div>

                <!-- Recipient PO Box -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Recipient's PO. Box</label>
                  <input type="text" v-model="form.po_box"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter recipient's PO Box (optional)" />
                  <span v-if="errors.po_box" class="text-sm text-red-500 block">{{ errors.po_box
                    }}</span>
                </div>

                <!-- Recipient Zip Code -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Recipient's Zip code</label>
                  <input type="text" v-model="form.zip_code"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter recipient's zip code (optional)" />
                  <span v-if="errors.zip_code" class="text-sm text-red-500 block">{{ errors.zip_code
                    }}</span>
                </div>
              </div>
            </TransitionRoot>
          </div>
        </div>

        <!-- Declaration Section -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 p-8 border-b">
            <div class="flex items-center space-x-3">
              <div
                class="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">Declaration</h3>
                <p class="mt-1 text-gray-600">Please read and agree to the terms</p>
              </div>
            </div>
          </div>

          <div class="p-8">
            <div class="flex items-start space-x-3">
              <input type="checkbox" v-model="form.declaration" id="declarationCheckbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4" />
              <label for="declarationCheckbox" class="text-sm text-gray-700">
                I declare that the information provided is true and accurate.
                <button type="button" @click="openTermsModal" class="text-blue-600 hover:underline">
                  Read More
                </button>
              </label>
            </div>
            <span v-if="errors.declaration" class="text-sm text-red-500 block">
              {{ errors.declaration }}
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4 mt-8">
          <button type="button" @click="cancelForm"
            class="px-6 py-3 rounded-xl text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Cancel
          </button>
          <button type="submit" :disabled="!form.declaration || isSubmitting"
            class="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="isSubmitting">Submitting...</span>
            <span v-else>Submit Application</span>
          </button>
        </div>
      </form>

      <!-- Terms Modal -->
      <TransitionRoot as="template" :show="showTermsModal">
        <Dialog as="div" class="fixed z-10 inset-0 overflow-y-auto" @close="closeTermsModal">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
              leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
              <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>

            <TransitionChild as="template" enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <div
                class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <DialogTitle as="h3" class="text-lg leading-6 font-medium text-gray-900">
                        Terms and Conditions
                      </DialogTitle>
                      <div class="mt-4 prose prose-sm text-gray-500">
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                          labore
                          et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                          nisi ut
                          aliquip ex ea commodo consequat.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="button"
                    class="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    @click="closeTermsModal">
                    I Understand
                  </button>
                </div>
              </div>
            </TransitionChild>
          </div>
        </Dialog>
      </TransitionRoot>

      <!-- Payment Section -->
      <TransitionRoot as="template" :show="showPaymentSection">
        <div class="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-8">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CreditCardIcon class="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">Payment Required</h3>
                <p class="mt-1 text-gray-600">Complete your payment to proceed</p>
              </div>
            </div>
          </div>
          <div class="p-8">
            <p class="text-gray-600 mb-6">
              An email notification with payment instructions has been sent to your registered email address.
            </p>
            <button @click="simulatePayment"
              class="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <CreditCardIcon class="h-5 w-5 mr-2" />
              Proceed to Payment
            </button>
          </div>
        </div>
      </TransitionRoot>

      <!-- Certificate Section -->
      <TransitionRoot as="template" :show="showCertificateSection">
        <div class="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 p-8">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <DocumentTextIcon class="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">Certificate Generation</h3>
                <p class="mt-1 text-gray-600">Your certificate is ready to be generated</p>
              </div>
            </div>
          </div>
          <div class="p-8">
            <button @click="generateCertificate"
              class="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <DocumentDownloadIcon class="h-5 w-5 mr-2" />
              Generate Certificate
            </button>

            <TransitionRoot as="template" :show="certificateGenerated">
              <div class="mt-6 border border-gray-200 rounded-xl p-6 bg-gray-50">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-lg font-semibold text-gray-900">Certificate of Good Standing</h4>
                  <button @click="printCertificate"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <PrinterIcon class="h-5 w-5 mr-2" />
                    Print
                  </button>
                </div>
                <div class="p-4 border border-gray-200 rounded-lg bg-white">
                  <p class="text-gray-600">Certificate preview will appear here...</p>
                </div>
              </div>
            </TransitionRoot>
          </div>
        </div>
      </TransitionRoot>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { useToast } from 'vue-toastification';
import apiService from '@/services/services';
import { useAuthStore } from '@/stores/authStore';
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
  TransitionRoot
} from '@headlessui/vue'
import {
  CheckIcon,
  CreditCardIcon,
  DocumentTextIcon,
  DocumentDownloadIcon,
  PrinterIcon,
} from '@heroicons/vue/24/outline'
//import * as yup from 'yup'; // Install VeeValidate or Yup for complex validation rules

const toast = useToast();
const authStore = useAuthStore();

const form = reactive({
  registration_no: '',
  cid_no: '',
  full_name: '',
  gender: '',
  reason_for_application: '',
  supervisor_name: '',
  supervisor_designation: '',
  agency: null, // Use 'agency' to match the model, store the ID
  contact_number: '', // Use generic name, as it's used for both supervisor and recipient
  email_address: '',  //generic name as well
  recipient_name: '',
  recipient_contact_number: '',
  recipient_email: '',
  address: '', // Use generic names for recipient details
  po_box: '',
  zip_code: '',
  declaration: false
});

const errors = reactive({});
const isRecipientSelf = ref(true);
const showTermsModal = ref(false);
const agencyOptions = ref([]);
const message = ref('');
const messageClass = ref('');
const showPaymentSection = ref(false);
const showCertificateSection = ref(false);
const certificateGenerated = ref(false);
const isLoading = ref(false); //Loading state
const isSubmitting = ref(false); //Submitting state

const fetchRegistrationNumber = async (cid) => {
  isLoading.value = true;
  try {
    const response = await apiService.getApplicationsByCid(cid);
    if (response.data && response.data.length > 0) {
      return response.data[0].registration_no;
    }
    return null;
  } catch (error) {
    toast.error("Failed to fetch registration number. Please try again later.");
    console.error("Error fetching registration number:", error);
    // Consider a fallback or retry mechanism here
    return null;
  } finally {
    isLoading.value = false;
  }
};

const fetchMasterData = async () => {
  isLoading.value = true;
  try {
    const agenciesResponse = await apiService.getEpcCogsAgencies();
    agencyOptions.value = agenciesResponse.data.results;
  } catch (error) {
    toast.error("Failed to fetch master data.  Please check your network connection and try again later.");
    console.error("Error fetching master data:", error);
    // Consider a fallback or retry mechanism here
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  if (authStore.user) {
    form.cid_no = authStore.user.cid;
    form.full_name = authStore.user.middle_name
      ? `${authStore.user.first_name} ${authStore.user.middle_name} ${authStore.user.last_name}`
      : `${authStore.user.first_name} ${authStore.user.last_name}`;
    form.gender = authStore.user.gender;
    form.user_contact_number = authStore.user.contact_number;
    form.user_email = authStore.user.email;

    const registrationNumber = await fetchRegistrationNumber(form.cid_no);
    if (registrationNumber) {
      form.registration_no = registrationNumber;
    }
    await fetchMasterData();
  }
  updateRecipientDetails();
});

const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key]);
  let isValid = true;

  if (!form.reason_for_application) {
    errors.reason_for_application = 'Reason for Application is required';
    isValid = false;
  }
  if (!form.supervisor_name) {
    errors.supervisor_name = 'Supervisor Name is required';
    isValid = false;
  }
  if (!form.supervisor_designation) {
    errors.supervisor_designation = 'Supervisor Designation is required';
    isValid = false;
  }
  if (!form.agency) {
    errors.agency = "Agency is required";
    isValid = false;
  }
  if (!form.contact_number) {
    errors.contact_number = 'Supervisor Contact Number is required';
    isValid = false;
  }
  if (!form.email_address) {
    errors.email_address = 'Supervisor Email is required';
    isValid = false;
  }
  // Example validation rule for email format (not comprehensive, consider using a regex)
  if (form.email_address && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email_address)) {
    errors.email_address = 'Invalid email format';
    isValid = false;
  }
  //Consider using yup or vee-validate for robust validation

  if (!isRecipientSelf.value) {
    if (!form.recipient_name) {
      errors.recipient_name = 'Recipient Name is required';
      isValid = false;
    }
    if (!form.recipient_contact_number) {
      errors.recipient_contact_number = 'Recipient Contact Number is required';
      isValid = false;
    }
    if (!form.recipient_email) {
      errors.recipient_email = 'Recipient Email is required';
      isValid = false;
    }
    //Example validation rule for recipient email format
    if (form.recipient_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.recipient_email)) {
      errors.recipient_email = 'Invalid email format';
      isValid = false;
    }

    if (!form.address) {
      errors.address = 'Recipient Address is required';
      isValid = false;
    }
  }
  if (!form.declaration) {
    errors.declaration = 'You must agree to the declaration before submitting.';
    isValid = false;
  }
  return isValid;
};

const submitForm = async () => {
  if (validateForm()) {
    isSubmitting.value = true; //Set loading state

    const requestData = {
      registration_no: form.registration_no,
      cid_no: form.cid_no,
      full_name: form.full_name,
      gender: form.gender,
      reason_for_application: form.reason_for_application,
      supervisor_name: form.supervisor_name,
      supervisor_designation: form.supervisor_designation,
      agency: form.agency, // Send agency ID
      department: null, // You might want to add department selection
      workplace: null, //same case as above two
      contact_number: form.contact_number, // Supervisor's contact
      email_address: form.email_address, // Supervisor's email
      recipient_name: isRecipientSelf.value ? form.full_name : form.recipient_name,
      recipient_contact_number: isRecipientSelf.value ? form.user_contact_number : form.recipient_contact_number,
      recipient_email: isRecipientSelf.value ? form.user_email : form.recipient_email,
      address: isRecipientSelf.value ? '' : form.address,
      po_box: isRecipientSelf.value ? '' : form.po_box,
      zip_code: isRecipientSelf.value ? '' : form.zip_code,
      declaration: form.declaration,
      review_status: "Pending",
      review_remark: "",
      endorsement_decision: "Pending",
      endorsement_remark: "",
      is_payment_complete: false,
      payment_id: "",
      is_active: true,
    };

    try {
      const response = await apiService.createEpcCogs(requestData);

      if (response.status === 201) {
        toast.success('Application submitted successfully! You will receive an email notification for payment.');
        showPaymentSection.value = true;
      } else {
        toast.error('An unexpected error occurred. Please try again.');
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response) {
        console.error("Error data:", error.response.data);
        console.error("Error status:", error.response.status);
        console.error("Error headers:", error.response.headers);
        toast.error(`Server error: ${error.response.status} - ${error.response.data.detail || 'See console for details'}`);
      } else if (error.request) {
        toast.error('No response received from the server. Please check your network connection.');
      } else {
        toast.error('An error occurred: ' + error.message);
      }
    } finally {
      isSubmitting.value = false; //Reset Loading state
    }
  } else {
    toast.error('Please correct the errors in the form.');
  }
};

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
    declaration: false
  });

  isRecipientSelf.value = true;
  Object.keys(errors).forEach(key => delete errors[key]);

  message.value = 'Form has been cleared.';
  messageClass.value = 'text-blue-500';
  setTimeout(() => {
    message.value = '';
    messageClass.value = '';
  }, 3000);
};

const simulatePayment = () => {
  message.value = 'Processing payment...';
  messageClass.value = 'text-yellow-500';
  setTimeout(() => {
    message.value = 'Payment successful!';
    messageClass.value = 'text-green-500';
    showPaymentSection.value = false;
    showCertificateSection.value = true;
    setTimeout(() => {
      message.value = '';
      messageClass.value = '';
    }, 3000);
  }, 2000);
};

const generateCertificate = () => {
  certificateGenerated.value = true
};

const printCertificate = () => {
  window.print();
};

const updateRecipientDetails = () => {
  if (isRecipientSelf.value && authStore.user) {
    form.recipient_name = authStore.user.fullName;
    form.recipient_contact_number = authStore.user.contactNumber; // Assuming you have contactNumber in authStore.user
    form.recipient_email = authStore.user.email; // Assuming you have email in authStore.user
    form.address = '';  // Reset other fields
    form.po_box = '';
    form.zip_code = '';
  } else {
    form.recipient_name = '';
    form.recipient_contact_number = '';
    form.recipient_email = '';
    form.address = '';
    form.po_box = '';
    form.zip_code = '';
  }
};
watch(isRecipientSelf, updateRecipientDetails);

const openTermsModal = () => {
  showTermsModal.value = true;
};

const closeTermsModal = () => {
  showTermsModal.value = false;
};

const selectedAgencyName = computed(() => {
  const agency = agencyOptions.value.find(a => a.id === form.agency);
  return agency ? agency.name : '';
});
</script>

<style scoped>
.required::after {
  content: " *";
  color: #ef4444;
}

/* Custom checkbox styling */
input[type="checkbox"] {
  appearance: none;
  /* Remove default appearance */
  -webkit-appearance: none;
  /* For older Safari/Chrome */
  -moz-appearance: none;
  /* For older Firefox */
  height: 1.25rem;
  width: 1.25rem;
  border: 2px solid #9CA3AF;
  /* border-gray-400 equivalent */
  border-radius: 0.25rem;
  /* rounded equivalent */
  cursor: pointer;
  display: inline-block;
  /* Important for proper alignment */
  position: relative;
  /* Needed for the checkmark */
  vertical-align: middle;
  /* Aligns with the label text */
}


/* Checkmark styles (hidden by default) */
input[type="checkbox"]::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  /* Initially hidden */
  width: 0.75rem;
  /* Smaller checkmark */
  height: 0.75rem;
  background-color: #3B82F6;
  /* bg-blue-600 equivalent */
  border-radius: 0.125rem;
  /* Slightly smaller border-radius */
  transition: transform 0.15s ease-in-out;
  /* Smooth animation */
}

/* Show checkmark when checked */
input[type="checkbox"]:checked::before {
  transform: translate(-50%, -50%) scale(1);
}

/* Focus styles */
input[type="checkbox"]:focus {
  outline: none;
  /* Remove default outline */
  box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.5);
  /* focus:ring-blue-500 equivalent */
  border-color: #60A5FA;
  /* Slightly darker blue for focus */
}

/*  Hover Style (Optional - Subtle change) */
input[type="checkbox"]:hover {
  border-color: #4B5563;
  /* A slightly darker gray */
}
</style>
