<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Form Header -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Certificate of Goods Standing (CoGS) Application
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Please fill in all required fields marked with an asterisk (<span class="text-red-600">*</span>). Ensure all
        information provided is accurate and up-to-date.
      </p>
    </div>

    <form @submit.prevent="submitForm" class="bg-white border rounded-xl shadow-sm p-6">
      <!-- 1. Personal Details -->
      <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
        <h3 class="text-lg font-semibold text-gray-900">1. Personal Details</h3>
        <p class="mt-1 text-sm text-gray-500">Your basic information for the application.</p>
      </div>

      <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Registration Number</label>
          <input type="text" v-model="form.registrationNumber" disabled
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
        </div>
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">CID No./Identity/Work Permit No.</label>
          <input type="text" v-model="form.cidNo" disabled
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
        </div>
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" v-model="form.fullName" disabled
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
        </div>
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Gender</label>
          <input type="text" v-model="form.gender" disabled
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
        </div>
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700 required">Reason for Application</label>
          <input type="text" v-model="form.reasonForApplication"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
          <span v-if="errors.reasonForApplication" class="text-sm text-red-500 mt-1">{{
      errors.reasonForApplication
    }}</span>
        </div>
      </div>

      <!-- 2. Supervisor Details -->
      <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mt-8">
        <h3 class="text-lg font-semibold text-gray-900">2. Supervisor Details</h3>
        <p class="mt-1 text-sm text-gray-500">Information about your supervisor.</p>
      </div>

      <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700 required">Name</label>
          <input type="text" v-model="form.supervisorName"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
          <span v-if="errors.supervisorName" class="text-sm text-red-500 mt-1">{{ errors.supervisorName }}</span>
        </div>
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700 required">Designation</label>
          <input type="text" v-model="form.supervisorDesignation"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
          <span v-if="errors.supervisorDesignation" class="text-sm text-red-500 mt-1">{{
      errors.supervisorDesignation
    }}</span>
        </div>
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700 required">Name of Agency</label>
          <select v-model="form.agencyName"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
            <option value="">Select Agency</option>
            <option v-for="agency in agencyOptions" :key="agency" :value="agency">{{ agency }}</option>
          </select>
          <span v-if="errors.agencyName" class="text-sm text-red-500 mt-1">{{ errors.agencyName }}</span>
        </div>
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700 required">Name of Department</label>
          <select v-model="form.departmentName"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
            <option value="">Select Department</option>
            <option v-for="department in departmentOptions" :key="department" :value="department">{{ department }}
            </option>
          </select>
          <span v-if="errors.departmentName" class="text-sm text-red-500 mt-1">{{ errors.departmentName }}</span>
        </div>
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700 required">Workplace/Working Organisation</label>
          <select v-model="form.workingOrganisation"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
            <option value="">Select Organisation</option>
            <option v-for="organisation in organisationOptions" :key="organisation" :value="organisation">{{
      organisation
    }}</option>
          </select>
          <span v-if="errors.workingOrganisation" class="text-sm text-red-500 mt-1">{{
      errors.workingOrganisation
    }}</span>
        </div>
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700 required">Contact Number</label>
          <input type="number" v-model="form.supervisorContactNumber"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
          <span v-if="errors.supervisorContactNumber" class="text-sm text-red-500 mt-1">{{
      errors.supervisorContactNumber
    }}</span>
        </div>
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700 required">Email Address</label>
          <input type="email" v-model="form.supervisorEmail"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
          <span v-if="errors.supervisorEmail" class="text-sm text-red-500 mt-1">{{ errors.supervisorEmail }}</span>
        </div>
      </div>

      <!-- 3. Details of the Recipient -->
      <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mt-8">
        <h3 class="text-lg font-semibold text-gray-900">3. Details of the Recipient</h3>
        <p class="mt-1 text-sm text-gray-500">Information about the recipient of the certificate.</p>
      </div>

      <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700 required">Name</label>
          <input type="text" v-model="form.recipientName"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
          <span v-if="errors.recipientName" class="text-sm text-red-500 mt-1">{{ errors.recipientName }}</span>
        </div>
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700 required">Contact Number</label>
          <input type="number" v-model="form.recipientContactNumber"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
          <span v-if="errors.recipientContactNumber" class="text-sm text-red-500 mt-1">{{
      errors.recipientContactNumber
    }}</span>
        </div>
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700 required">Email</label>
          <input type="email" v-model="form.recipientEmail"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
          <span v-if="errors.recipientEmail" class="text-sm text-red-500 mt-1">{{ errors.recipientEmail }}</span>
        </div>
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700 required">Address</label>
          <input type="text" v-model="form.recipientAddress"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
          <span v-if="errors.recipientAddress" class="text-sm text-red-500 mt-1">{{ errors.recipientAddress }}</span>
        </div>
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">PO. Box</label>
          <input type="text" v-model="form.recipientPOBox"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
          <span v-if="errors.recipientPOBox" class="text-sm text-red-500 mt-1">{{ errors.recipientPOBox }}</span>
        </div>
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Zip code</label>
          <input type="text" v-model="form.recipientZipCode"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
          <span v-if="errors.recipientZipCode" class="text-sm text-red-500 mt-1">{{ errors.recipientZipCode }}</span>
        </div>
      </div>

      <!-- 4. Declaration -->
      <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mt-8">
        <h3 class="text-lg font-semibold text-gray-900">4. Declaration</h3>
        <p class="mt-1 text-sm text-gray-500">Please read and agree to the declaration.</p>
      </div>

      <div class="p-8 bg-white rounded-lg">
        <div class="flex items-start space-x-3 bg-white p-4 rounded-lg">
          <input type="checkbox" v-model="form.declaration" value="agree"
            class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <label class="text-sm text-gray-700">
            I declare that the information provided is true and accurate.
          </label>
        </div>
      </div>

      <div class="mt-12 flex justify-end space-x-4 p-8">
        <button type="button" @click="cancelForm"
          class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button type="submit" :disabled="form.declaration !== 'agree'"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
          Submit
        </button>
      </div>
    </form>

    <!-- Message Display -->
    <div v-if="message" class="mt-4">
      <p :class="messageClass">{{ message }}</p>
    </div>

    <!-- Payment Section (Conditionally displayed) -->
    <div v-if="showPaymentSection" class="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-lg font-semibold mb-4">Payment</h3>
      <p>An email notification with a payment link has been sent to your registered email address.</p>
      <button @click="simulatePayment"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
        Click here to simulate payment
      </button>
    </div>

    <!-- Certificate Section (Conditionally displayed) -->
    <div v-if="showCertificateSection" class="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-lg font-semibold mb-4">Certificate</h3>
      <button @click="generateCertificate"
        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
        Generate Certificate
      </button>

      <!-- Display dummy certificate (Simplest Approach) -->
      <div v-if="certificateGenerated" class="mt-4 border p-4 rounded">
        <h4 class="text-md font-semibold">Certificate of Goods Standing</h4>
        <p>This is a dummy certificate. In a real application, this would be a properly formatted certificate.</p>
        <button @click="printCertificate"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700">
          Print Certificate
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

const form = reactive({
  registrationNumber: '',
  cidNo: '',
  fullName: '',
  gender: '',
  reasonForApplication: '',
  supervisorName: '',
  supervisorDesignation: '',
  agencyName: '',
  departmentName: '',
  workingOrganisation: '',
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

// Dropdown options
const agencyOptions = ref(['Agency A', 'Agency B', 'Agency C']);
const departmentOptions = ref(['Department X', 'Department Y', 'Department Z']);
const organisationOptions = ref(['Organisation 1', 'Organisation 2', 'Organisation 3']);

// Message display
const message = ref('');
const messageClass = ref('');

// Conditional Sections
const showPaymentSection = ref(false);
const showCertificateSection = ref(false);
const certificateGenerated = ref(false);

onMounted(() => {
  // Simulate fetching personal details from a central system
  form.registrationNumber = 'REG-2023-001';
  form.cidNo = '1122334455667788';
  form.fullName = 'Pema Wangchuk';
  form.gender = 'Male';
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
  if (!form.agencyName) {
    errors.agencyName = 'Agency Name is required';
    isValid = false;
  }
  if (!form.departmentName) {
    errors.departmentName = 'Department Name is required';
    isValid = false;
  }
  if (!form.workingOrganisation) {
    errors.workingOrganisation = 'Working Organisation is required';
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
  // Implement your cancel form logic here
  console.log('Form cancelled');
  // You can reset the form fields or redirect the user
  Object.assign(form, { // Reset form values
    registrationNumber: '',
    cidNo: '',
    fullName: '',
    gender: '',
    reasonForApplication: '',
    supervisorName: '',
    supervisorDesignation: '',
    agencyName: '',
    departmentName: '',
    workingOrganisation: '',
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
  message.value = 'Form has been cleared.';
  messageClass.value = 'text-blue-500';
  setTimeout(() => {
    message.value = '';
    messageClass.value = '';
  }, 3000);
};

const simulatePayment = () => {
  // Simulate a payment process
  message.value = 'Processing payment...';
  messageClass.value = 'text-yellow-500';
  setTimeout(() => {
    message.value = 'Payment successful!';
    messageClass.value = 'text-green-500';
    showPaymentSection.value = false;
    showCertificateSection.value = true; // Show certificate section
    setTimeout(() => {
      message.value = '';
      messageClass.value = '';
    }, 3000);
  }, 2000); // Simulate payment processing time
};

const generateCertificate = () => {
  // Simulate generating the certificate
  certificateGenerated.value = true;
};

const printCertificate = () => {
  // Simulate printing the certificate (in a real app, you'd trigger a print dialog)
  window.print(); // Use the browser's print function
};
</script>

<style scoped>
.required::after {
  content: " *";
  color: #ef4444;
}
</style>
