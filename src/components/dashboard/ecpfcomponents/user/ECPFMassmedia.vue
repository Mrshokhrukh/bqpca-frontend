<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Mass Media Promotion Registration</h1>
      <p class="text-gray-600">
        Register for a mass media promotional event.
      </p>
    </div>
    <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <form @submit.prevent="submitForm">
        <!-- Event type -->
        <section class="mb-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Promotional Event Type</label>
              <input type="text" v-model="eventType" readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>
        </section>
        <!-- Current ECPF Details -->
        <section class="mb-8">
          <h2 class="text-lg font-medium mb-4 text-gray-700">Current ECPF Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">ECPF Name</label>
              <input type="text" :value="ecpfDetails.name" readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Location</label>
              <input type="text" :value="ecpfDetails.location" readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Name of Proprietor</label>
              <input type="text" :value="ecpfDetails.proprietor" readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">CID</label>
              <input type="text" :value="ecpfDetails.cid" readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Contact No.</label>
              <input type="text" :value="ecpfDetails.contactNo" readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" :value="ecpfDetails.email" readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Institute</label>
              <select v-model="selectedInstitute" 
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                <option value="" disabled>Select an institute</option>
                <option v-for="institute in availableInstitutes" :key="institute.id" :value="institute.id">
                  {{ institute.name }}
                </option>
              </select>
            </div>
          </div>
        </section>

        <!-- Proposed Promotion Event - Mass Media -->
        <section class="mb-8">
          <h2 class="text-lg font-medium mb-4 text-gray-700">Proposed Promotion Event - Mass Media</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Mass Media Promotional Name</label>
              <input type="text" v-model="eventDetails.name"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <textarea v-model="eventDetails.description" rows="3"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Purpose</label>
              <input type="text" v-model="eventDetails.purpose"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Promotional Channel</label>
              <input type="text" v-model="eventDetails.channel"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Promotional Contents</label>
              <div class="flex items-center space-x-2">
                <input type="text" :value="eventDetails.content ? eventDetails.content : 'No file chosen'" readonly
                  class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
                <label class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                  <input type="file" @change="handleContentUpload" class="hidden" />
                  <span>Upload</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Others (specify)</label>
              <input type="text" v-model="eventDetails.others"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>
        </section>

        <!-- Remarks -->
        <section class="mb-8">
          <h2 class="text-lg font-medium mb-4 text-gray-700">Remarks</h2>
          <textarea v-model="remarks" rows="4"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
        </section>

        <!-- Submit Button -->
        <div class="mt-6 flex justify-end">
          <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Register Event
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import apiService from '@/services/services'; // Import

const toast = useToast();

const eventType = ref('Mass Media');

// --- Data ---
const ecpfDetails = reactive({
  name: 'Example ECPF',
  location: 'Thimphu',
  proprietor: 'John Doe',
  cid: '1234567890',
  contactNo: '+975-17123456',
  email: 'john.doe@example.com',
});

const selectedInstitute = ref(''); // Changed to single selection
const availableInstitutes = ref([
  { id: 1, name: 'Royal University of Bhutan' },
  { id: 2, name: 'Jigme Singye Wangchuck School of Law' },
  { id: 3, name: 'Khesar Gyalpo University of Medical Sciences' },
  { id: 4, name: 'Royal Thimphu College' },
  { id: 5, name: 'Norbuling Rigter College' },
  { id: 6, name: 'Gedu College of Business Studies' },
  { id: 7, name: 'Sherubtse College' },
  { id: 8, name: 'College of Science and Technology' },
  { id: 9, name: 'College of Natural Resources' },
  { id: 10, name: 'Gyalpozhing College of Information Technology' }
]); // Added dummy data

const eventDetails = reactive({
  name: '',
  description: '',
  purpose: '',
  channel: '',
  content: null, //  Store the filename
  others: '',
});

const remarks = ref('');

// --- Methods ---
const handleContentUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    eventDetails.content = file.name; // Store the filename
    //  Upload file and store URL
  } else {
    eventDetails.content = null;
  }
};

const submitForm = async () => {
  // Basic validation
  if (!eventDetails.name) {
    toast.error('Please provide the promotional event name.');
    return;
  }
  if (!selectedInstitute.value) {
    toast.error('Please select an institute.');
    return;
  }

  const formData = {
    eventType: eventType.value,
    ecpfDetails,
    selectedInstitute: selectedInstitute.value, // Changed to single institute
    eventDetails,
    remarks: remarks.value,
  };

  console.log('Submitting form:', formData);

  //   API call (replace with your actual API)
  try {
    await apiService.submitMassMediaEvent(formData);
    toast.success('Mass media promotion registered successfully!');
    //   Redirect/update UI
  } catch (error) {
    console.error('Error submitting form:', error);
    toast.error('Failed to register the mass media promotion.');
  }
};

onMounted(async () => {
  // Note: Using the dummy data directly instead of API call
  // Uncomment this section if you want to fetch from API instead
  /*
  try {
    const response = await apiService.getInstitutes();
    availableInstitutes.value = response.data;
  } catch (error) {
    console.error('Error fetching institutes:', error);
    toast.error('Failed to load institutes.');
  }
  */
});
</script>