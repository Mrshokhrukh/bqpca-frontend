<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Enhanced Header with Animation -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10">
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
        <!-- Hidden Fields -->
        <input type="hidden" v-model="form.registrationNumber" />
        <input type="hidden" v-model="form.cidNo" />
        <input type="hidden" v-model="form.fullName" />
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
              <!-- Name -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 required">Name</label>
                <input type="text" v-model="form.supervisorName"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter supervisor's name" />
                <span v-if="errors.supervisorName" class="text-sm text-red-500 block">{{ errors.supervisorName }}</span>
              </div>

              <!-- Designation -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 required">Designation</label>
                <input type="text" v-model="form.supervisorDesignation"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter designation" />
                <span v-if="errors.supervisorDesignation" class="text-sm text-red-500 block">{{
        errors.supervisorDesignation }}</span>
              </div>

              <!-- Agency Name -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 required">Name of Agency</label>
                <Listbox v-model="form.agencyName">
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
                <span v-if="errors.agencyName" class="text-sm text-red-500 block">{{ errors.agencyName }}</span>
              </div>

              <!-- Contact Number -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 required">Contact Number</label>
                <input type="tel" v-model="form.supervisorContactNumber"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter contact number" />
                <span v-if="errors.supervisorContactNumber" class="text-sm text-red-500 block">{{
        errors.supervisorContactNumber }}</span>
              </div>

              <!-- Email -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 required">Email Address</label>
                <input type="email" v-model="form.supervisorEmail"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter email address" />
                <span v-if="errors.supervisorEmail" class="text-sm text-red-500 block">{{ errors.supervisorEmail
                  }}</span>
              </div>

              <!-- Reason -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 required">Reason for Application</label>
                <textarea v-model="form.reasonForApplication"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  rows="3" placeholder="Enter reason for application"></textarea>
                <span v-if="errors.reasonForApplication" class="text-sm text-red-500 block">{{
        errors.reasonForApplication }}</span>
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
                <!-- Name -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 required">Name</label>
                  <input type="text" v-model="form.recipientName"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter recipient's name" />
                  <span v-if="errors.recipientName" class="text-sm text-red-500 block">{{ errors.recipientName }}</span>
                </div>

                <!-- Contact Number -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 required">Contact Number</label>
                  <input type="tel" v-model="form.recipientContactNumber"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter contact number" />
                  <span v-if="errors.recipientContactNumber" class="text-sm text-red-500 block">{{
        errors.recipientContactNumber }}</span>
                </div>

                <!-- Email -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 required">Email</label>
                  <input type="email" v-model="form.recipientEmail"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter email address" />
                  <span v-if="errors.recipientEmail" class="text-sm text-red-500 block">{{ errors.recipientEmail
                    }}</span>
                </div>

                <!-- Address -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 required">Address</label>
                  <input type="text" v-model="form.recipientAddress"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter full address" />
                  <span v-if="errors.recipientAddress" class="text-sm text-red-500 block">{{ errors.recipientAddress
                    }}</span>
                </div>

                <!-- PO Box -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">PO. Box</label>
                  <input type="text" v-model="form.recipientPOBox"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter PO Box (optional)" />
                  <span v-if="errors.recipientPOBox" class="text-sm text-red-500 block">{{ errors.recipientPOBox
                    }}</span>
                </div>

                <!-- Zip Code -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Zip code</label>
                  <input type="text" v-model="form.recipientZipCode"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter zip code (optional)" />
                  <span v-if="errors.recipientZipCode" class="text-sm text-red-500 block">{{ errors.recipientZipCode
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
              <Checkbox v-model="form.declaration" value="agree"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <label class="text-sm text-gray-700">
                I declare that the information provided is true and accurate.
                <button @click="openTermsModal" class="text-blue-600 hover:underline">Read More</button>
              </label>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4 mt-8">
          <button type="button" @click="cancelForm"
            class="px-6 py-3 rounded-xl text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
            Cancel
          </button>
          <button type="submit" :disabled="form.declaration !== 'agree'"
            class="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
            Submit Application
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

            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

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
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
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
  // DocumentDownloadIcon,
  PrinterIcon
} from '@heroicons/vue/24/outline'

const toast = useToast();
const authStore = useAuthStore();

const form = reactive({
  registrationNumber: '',
  cidNo: '',
  fullName: '',
  gender: '',
  reasonForApplication: '',
  supervisorName: '',
  supervisorDesignation: '',
  agencyName: '',
  supervisorContactNumber: null,
  supervisorEmail: '',
  recipientName: '',
  recipientContactNumber: null,
  recipientEmail: '',
  recipientAddress: '',
  recipientPOBox: '',
  recipientZipCode: '',
  declaration: false // Changed to boolean
});

const errors = reactive({}); // Validation Errors
const isRecipientSelf = ref(true); // Initially set to "Self" - Corrected default
const showTermsModal = ref(false);

// Dropdown options
const agencyOptions = ref([]);

// Message display
const message = ref('');
const messageClass = ref('');

// Conditional Sections
const showPaymentSection = ref(false);
const showCertificateSection = ref(false);
const certificateGenerated = ref(false);

const fetchRegistrationNumber = async (cid) => {
  try {
    const response = await apiService.getApplicationsByCid(cid);
    if (response.data && response.data.length > 0) {
      return response.data[0].registration_no;
    }
    return null;
  } catch (error) {
    toast.error("Failed to fetch registration number: " + error.message);
    console.error("Error fetching registration number:", error);
    return null;
  }
};

// Fetch Master Data - Added agency fetching back
const fetchMasterData = async () => {
  try {
    const agenciesResponse = await apiService.getBmhcCogsAgencies();
    agencyOptions.value = agenciesResponse.data.results;
  } catch (error) {
    toast.error("Failed to fetch master data: " + error.message);
    console.error("Error fetching master data:", error);
  }
};

onMounted(async () => {
  if (authStore.user) {
    form.cidNo = authStore.user.cid;
    form.fullName = authStore.user.fullName;
    form.gender = authStore.user.gender;

    const registrationNumber = await fetchRegistrationNumber(form.cidNo);
    if (registrationNumber) {
      form.registrationNumber = registrationNumber;
    }
    await fetchMasterData();
  }
  // await fetchMasterData(); // Removed

  updateRecipientDetails(); // Call this to initialize recipient fields
});


const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key]); // Clear previous errors
  let isValid = true;

  if (!form.reasonForApplication) {
    errors.reasonForApplication = 'Reason for Application is required';
    isValid = false;
  }
  if (!form.supervisorName) {
    errors.supervisorName = 'Supervisor Name is required';
    isValid = false;
  }
  if (!form.supervisorDesignation) {
    errors.supervisorDesignation = 'Supervisor Designation is required';
    isValid = false;
  }
  if (!form.agencyName) {         // Added back agency validation
    errors.agencyName = "Agency Name is required";
    isValid = false;
  }
  if (!form.supervisorContactNumber) {
    errors.supervisorContactNumber = 'Supervisor Contact Number is required';
    isValid = false;
  }
  if (!form.supervisorEmail) {
    errors.supervisorEmail = 'Supervisor Email is required';
    isValid = false;
  }

  // Only validate recipient details if "Other" is selected
  if (!isRecipientSelf.value) {
    if (!form.recipientName) {
      errors.recipientName = 'Recipient Name is required';
      isValid = false;
    }
    if (!form.recipientContactNumber) {
      errors.recipientContactNumber = 'Recipient Contact Number is required';
      isValid = false;
    }
    if (!form.recipientEmail) {
      errors.recipientEmail = 'Recipient Email is required';
      isValid = false;
    }
    if (!form.recipientAddress) {
      errors.recipientAddress = 'Recipient Address is required';
      isValid = false;
    }
  }

  return isValid;
};

const submitForm = () => {
  if (validateForm()) {
    console.log('Submitting form:', form);

    // Validation: Declaration checkbox must be checked
    if (!form.declaration) {
      message.value = 'Please agree to the declaration before submitting.';
      messageClass.value = 'text-red-500';
      return; // Prevent submission
    }

    // Simulate successful submission
    setTimeout(() => {
      message.value =
        'Application submitted successfully! You will receive a notification through email for payment.';
      messageClass.value = 'text-green-500';
      showPaymentSection.value = true; // Show payment section

      // Reset message after 5 seconds
      setTimeout(() => {
        message.value = '';
        messageClass.value = '';
      }, 5000);

      // Here you would typically make an API call to your backend
      // to save the form data.  For example:
      // await axios.post('/api/cogs', form);

    }, 1000); // Simulate API delay
  } else {
    toast.error('Please correct the errors in the form.');
  }
};

const cancelForm = () => {
  Object.assign(form, {
    registrationNumber: '',
    cidNo: '',
    fullName: '',
    gender: '',
    reasonForApplication: '',
    supervisorName: '',
    supervisorDesignation: '',
    agencyName: '',  // Added Back
    // departmentName: '', // Removed
    // workingOrganisation: '', // Removed
    supervisorContactNumber: null,
    supervisorEmail: '',
    recipientName: '',
    recipientContactNumber: null,
    recipientEmail: '',
    recipientAddress: '',
    recipientPOBox: '',
    recipientZipCode: '',
    declaration: false
  });
  isRecipientSelf.value = true; // Reset to "Self"
  message.value = 'Form has been cleared.';
  messageClass.value = 'text-blue-500';
  setTimeout(() => {
    message.value = '';
    messageClass.value = '';
  }, 3000);
};

// Removed handleAgencyChange and handleDepartmentChange

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
  certificateGenerated.value = true;
};

const printCertificate = () => {
  window.print();
};

// Watcher for isRecipientSelf to update recipient details
const updateRecipientDetails = () => {
  if (isRecipientSelf.value && authStore.user) {
    form.recipientName = authStore.user.fullName;
    form.recipientContactNumber = authStore.user.contactNumber;
    form.recipientEmail = authStore.user.email;
    // Assuming you have an address field in your user object.  If not, you might
    // need to fetch it, or leave this blank.  The key is to *clear* the other
    // fields when switching back to "self".
    form.recipientAddress = authStore.user.address || '';
    form.recipientPOBox = '';
    form.recipientZipCode = '';
  }
  else {
    //Clear the form when switched to other
    form.recipientName = '';
    form.recipientContactNumber = null;
    form.recipientEmail = '';
    form.recipientAddress = '';
    form.recipientPOBox = '';
    form.recipientZipCode = '';

  }
};
watch(isRecipientSelf, updateRecipientDetails);

// Terms of Service Modal functions
const openTermsModal = () => {
  showTermsModal.value = true;
};

const closeTermsModal = () => {
  showTermsModal.value = false;
};
const selectedAgencyName = computed(() => {
  const agency = agencyOptions.value.find(a => a.id === form.agencyName)
  return agency ? agency.name : ''
})

</script>

<style scoped>
.required::after {
  content: " *";
  color: #ef4444;
}
</style>
