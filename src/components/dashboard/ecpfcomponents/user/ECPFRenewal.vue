<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">ECPF Renewal</h1>
      <p class="text-gray-600">
        Please fill in the following details for ECPF renewal.
      </p>
    </div>

    <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Auto-populated Fields -->
        <div>
          <label class="block text-sm font-medium text-gray-700">ECPF Name</label>
          <input type="text" :value="ecpfData.ecpf_name" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Location</label>
          <input type="text" :value="ecpfData.location" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Name of Proprietor</label>
          <input type="text" :value="ecpfData.proprietor_name" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">CID</label>
          <input type="text" :value="ecpfData.cid" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Contact No</label>
          <input type="text" :value="ecpfData.contact_no" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Email Address</label>
          <input type="email" :value="ecpfData.email_address" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
        </div>

        <!-- Subject (Dropdown) -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Subject</label>
          <select v-model="renewalData.subject" class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm">
            <option value="">Select Renewal Type</option>
            <option value="independent">Independent ECPF Renewal</option>
            <option value="collaboration">ECPF in Collaboration Renewal</option>
            <option value="branch">Branch Renewal</option>
          </select>
        </div>

        <!-- Remarks (Textarea) -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Declaration</label>
          <textarea v-model="renewalData.remarks" rows="3" class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm"></textarea>
        </div>
      </div>

      <!-- Declaration (Dropdown) -->
      <div class="mt-6" v-if="declarationOptions">
          <label class="block text-sm font-medium text-gray-700">{{ declarationOptions.text }}</label>
          <select
            v-model="renewalData.declaration"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm"
          >
            <option value="">Select an Option</option>
            <option v-for="option in declarationOptions.options" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
      </div>

      <!-- License Validity Check (Conditional Message) -->
      <div v-if="licenseValidityMessage" class="mt-4 text-red-600">
        {{ licenseValidityMessage }}
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 flex justify-end space-x-4">
        <button @click="saveAsDraft" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Save as Draft</button>
        <button @click="editApplication" class="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600">Edit</button>
        <button @click="initiatePayment" class="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600">Initiate Payment</button>
        <button @click="submitRenewal" :disabled="renewalData.declaration !== 'agree'" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">Submit</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import apiServices from '@/services/services'; 

const ecpfId = 1; 

const ecpfData = reactive({
  ecpf_name: '',
  location: '',
  proprietor_name: '',
  cid: '',
  contact_no: '',
  email_address: '',
});

const renewalData = reactive({
  subject: '',
  remarks: '',
  declaration: null,
  ecpf: ecpfId, 
});

const licenseValidityMessage = ref('');
const declarationOptions = ref(null);
const loading = ref(true); // Add loading state

onMounted(async () => {
  loading.value = true;
  try {
    // Fetch ECPF data
    const ecpfResponse = await apiServices.getEcpfRenewal(ecpfId); // Use getEcpfRenewal endpoint to fetch ECPF details
    Object.assign(ecpfData, ecpfResponse.data); // Assign fetched data to ecpfData

    // Fetch declaration options (assuming you have a dedicated endpoint for this)
    const declarationResponse = await apiServices.getDeclarationOptions(); // Replace with your actual API method if different
    declarationOptions.value = declarationResponse.data;

     // Simulate license validity check (same as before, adjust based on your actual data)
      if (ecpfResponse.data && ecpfResponse.data.license_activation_date) { // Assuming license_activation_date is in your ECPF data
          const licenseActivationDate = new Date(ecpfResponse.data.license_activation_date);
          const today = new Date();
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(today.getMonth() - 6);
           if (licenseActivationDate < sixMonthsAgo) {
                licenseValidityMessage.value =
                    "Your license has been active for more than six months.  You must submit a new application.";
            }
      }

  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Failed to load data. Please check the console for details.');
  } finally {
    loading.value = false;
  }
});

const submitRenewal = async () => {
  if (renewalData.declaration !== 'agree') {
      alert('You must agree to the declaration before submitting.');
      return;
  }
    if (licenseValidityMessage.value) {
      alert(licenseValidityMessage.value);
      return;
    }

  try {
    const response = await apiServices.createEcpfRenewal(renewalData); // Use createEcpfRenewal endpoint
    console.log('Renewal submitted successfully:', response.data);
    alert('Renewal submitted successfully!');
    // Reset form
    Object.assign(renewalData, { subject: '', remarks: '', declaration: null, ecpf: ecpfId }); // Keep ecpfId
  } catch (error) {
    console.error('Error submitting renewal:', error);
    alert('Failed to submit renewal. Please check the console for details.');
  }
};

const saveAsDraft = async () => {
  try {
    const response = await apiServices.patchEcpfRenewal(ecpfId, renewalData); // Assuming you want to PATCH to update draft - adjust if needed, maybe createEcpfRenewal for drafts
    console.log('Saved as draft successfully:', response.data);
    alert('Renewal application saved as draft.');
  } catch (error) {
    console.error('Error saving as draft:', error);
    alert('Failed to save as draft. Please check the console for details.');
  }
};

const editApplication = () => {
  // Logic for edit..
  console.log('Edit Application:', { ...ecpfData, ...renewalData });
    alert("Edit mode activated. Make changes and submit again or save as draft.");
}

const initiatePayment = () => {
    //  logic for payment integration (e.g., redirect to payment gateway)
    console.log("Redirecting to payment gateway...");
    alert("Redirecting to payment gateway.  (This is a placeholder action.)");
};
</script>