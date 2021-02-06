<template>
    <div class="container mx-auto p-6">
      <h2 class="text-2xl font-bold mb-6">Certificate of Goods Standing (CoGS) Application</h2>
      <form @submit.prevent="submitForm">
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-lg font-semibold mb-4">1. Personal Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Registration Number</label>
              <input type="text" v-model="form.registrationNumber" disabled class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">CID No./Identity/Work Permit No.</label>
              <input type="text" v-model="form.cidNo" disabled class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" v-model="form.fullName" disabled class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gender</label>
              <input type="text" v-model="form.gender" disabled class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Reason for Application</label>
              <input type="text" v-model="form.reasonForApplication" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
          </div>
        </div>
  
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-lg font-semibold mb-4">2. Supervisor Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" v-model="form.supervisorName" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Designation</label>
              <input type="text" v-model="form.supervisorDesignation" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Name of Agency</label>
              <select v-model="form.agencyName" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <option value="">Select Agency</option>
                <option v-for="agency in agencyOptions" :key="agency" :value="agency">{{ agency }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Name of Department</label>
              <select v-model="form.departmentName" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <option value="">Select Department</option>
                <option v-for="department in departmentOptions" :key="department" :value="department">{{ department }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Workplace/Working Organisation</label>
              <select v-model="form.workingOrganisation" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                <option value="">Select Organisation</option>
                <option v-for="organisation in organisationOptions" :key="organisation" :value="organisation">{{ organisation }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Contact Number</label>
              <input type="number" v-model="form.supervisorContactNumber" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" v-model="form.supervisorEmail" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
          </div>
        </div>
  
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-lg font-semibold mb-4">3. Details of the Recipient</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" v-model="form.recipientName" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Contact Number</label>
              <input type="number" v-model="form.recipientContactNumber" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" v-model="form.recipientEmail" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Address</label>
              <input type="text" v-model="form.recipientAddress" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">PO. Box</label>
              <input type="text" v-model="form.recipientPOBox" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Zip code</label>
              <input type="text" v-model="form.recipientZipCode" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>
          </div>
        </div>
  
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 class="text-lg font-semibold mb-4">4. Declaration</h3>
        <div>
          <label class="inline-flex items-center">
            <input type="radio" v-model="form.declaration" value="agree" class="form-radio h-5 w-5 text-blue-600" />
            <span class="ml-2 text-gray-700">I declare that the information provided is true and accurate.</span>
          </label>
        </div>
      </div>

      <div class="flex justify-end space-x-4 mt-6">
        <button type="button" @click="cancelForm" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
        <button type="submit" :disabled="form.declaration !== 'agree'" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
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
      <button @click="simulatePayment" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
        Click here to simulate payment
      </button>
    </div>

    <!-- Certificate Section (Conditionally displayed) -->
    <div v-if="showCertificateSection" class="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h3 class="text-lg font-semibold mb-4">Certificate</h3>
      <button @click="generateCertificate" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
        Generate Certificate
      </button>

      <!-- Display dummy certificate (Simplest Approach) -->
      <div v-if="certificateGenerated" class="mt-4 border p-4 rounded">
        <h4 class="text-md font-semibold">Certificate of Goods Standing</h4>
        <p>This is a dummy certificate. In a real application, this would be a properly formatted certificate.</p>
        <button @click="printCertificate" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700">
          Print Certificate
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

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
  declaration: '' // 'agree' or ''
});

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

const submitForm = () => {
  console.log('Submitting form:', form);

  // Validation: Declaration checkbox must be checked
  if (form.declaration !== 'agree') {
    message.value = 'Please agree to the declaration before submitting.';
    messageClass.value = 'text-red-500';
    return; // Prevent submission
  }

  // Simulate successful submission
  setTimeout(() => {
    message.value = 'Application submitted successfully! You will receive a notification through email for payment.';
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
    declaration: ''
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