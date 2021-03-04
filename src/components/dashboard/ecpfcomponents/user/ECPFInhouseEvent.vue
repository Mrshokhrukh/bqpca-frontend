<template>
  <div class="p-8 min-h-screen bg-gray-50">
      <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
          <h1 class="text-4xl font-bold text-gray-900 mb-3">In-House Event Registration</h1>
          <p class="text-gray-600">
              Register for an in-house promotional event.
          </p>
      </div>

      <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <form @submit.prevent="submitForm">
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
                              <option value="">Select Institute</option>
                              <option v-for="institute in availableInstitutes" :key="institute.id"
                                  :value="institute.id">
                                  {{ institute.name }}
                              </option>
                          </select>
                      </div>
                  </div>
              </section>

              <!-- Proposed In-House Event Details -->
              <section class="mb-8">
                  <h2 class="text-lg font-medium mb-4 text-gray-700">Proposed In-House Event Details</h2>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                          <label class="block text-sm font-medium text-gray-700">Event Name</label>
                          <input type="text" v-model="eventDetails.name"
                              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                      </div>
                      <div>
                          <label class="block text-sm font-medium text-gray-700">Event Description</label>
                          <textarea v-model="eventDetails.description" rows="3"
                              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                      </div>
                      <div>
                          <label class="block text-sm font-medium text-gray-700">Event Purpose</label>
                          <input type="text" v-model="eventDetails.purpose"
                              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                      </div>
                      <div>
                          <label class="block text-sm font-medium text-gray-700">Event Location</label>
                          <input type="text" v-model="eventDetails.location"
                              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                      </div>
                  </div>
              </section>

              <!-- Representative Details -->
              <section class="mb-8">
                  <h2 class="text-lg font-medium mb-4 text-gray-700">Representative Details (Maximum 2)</h2>
                  <div v-for="(rep, index) in representatives" :key="index" class="mb-4 p-4 border border-gray-200 rounded-md">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                              <label class="block text-sm font-medium text-gray-700">Name</label>
                              <input type="text" v-model="rep.name"
                                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                          </div>
                          <div>
                              <label class="block text-sm font-medium text-gray-700">Passport No.</label>
                              <input type="text" v-model="rep.passportNo"
                                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                          </div>
                          <div>
                              <label class="block text-sm font-medium text-gray-700">Nationality</label>
                              <select v-model="rep.nationality"
                                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                                  <option value="">Select Nationality</option>
                                   <option v-for="country in countryOptions" :key="country.code" :value="country.code">{{ country.name }}</option>
                              </select>
                          </div>
                          <div>
                              <label class="block text-sm font-medium text-gray-700">Arrival Date</label>
                              <input type="date" v-model="rep.arrivalDate"
                                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                          </div>
                          <div>
                              <label class="block text-sm font-medium text-gray-700">Departure Date</label>
                              <input type="date" v-model="rep.departureDate"
                                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
                          </div>
                          <div>
                              <label class="block text-sm font-medium text-gray-700">CV of Representative</label>
                              <div class="flex items-center space-x-2">
                                  <input type="text" :value="rep.cv ? rep.cv : 'No file chosen'" readonly
                                      class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
                                  <label
                                      class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                      <input type="file" @change="handleCvUpload($event, index)" class="hidden" />
                                      <span>Upload</span>
                                  </label>
                              </div>
                          </div>
                             <div>
                              <label class="block text-sm font-medium text-gray-700">Affiliation Letter</label>
                              <div class="flex items-center space-x-2">
                                  <input type="text" :value="rep.affiliationLetter ? rep.affiliationLetter : 'No file chosen'" readonly
                                      class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
                                  <label
                                      class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                      <input type="file" @change="handleAffiliationLetterUpload($event, index)" class="hidden" />
                                      <span>Upload</span>
                                  </label>
                              </div>
                          </div>
                          <div>
                              <label class="block text-sm font-medium text-gray-700">Authorization Letter</label>
                              <div class="flex items-center space-x-2">
                                  <input type="text"
                                      :value="rep.authorizationLetter ? rep.authorizationLetter : 'No file chosen'"
                                      readonly
                                      class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
                                  <label
                                      class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                      <input type="file" @change="handleAuthorizationLetterUpload($event, index)"
                                          class="hidden" />
                                      <span>Upload</span>
                                  </label>
                              </div>
                          </div>
                      </div>
                       <button v-if="representatives.length > 1" type="button" @click="removeRepresentative(index)" class="mt-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                          Remove
                      </button>
                  </div>
                  <button type="button" @click="addRepresentative" :disabled="representatives.length >= 2"
                      class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
                      Add Representative
                  </button>
              </section>

              <!-- Remarks -->
              <section class="mb-8">
                  <h2 class="text-lg font-medium mb-4 text-gray-700">Remarks</h2>
                  <textarea v-model="remarks" rows="4"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
              </section>

              <!-- Submit Button -->
              <div class="mt-6 flex justify-end">
                  <button type="submit"
                      class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
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
import apiService from '@/services/services'; // Import the service

const toast = useToast();

// --- Data ---
const ecpfDetails = reactive({
  name: 'Example ECPF',
  location: 'Thimphu',
  proprietor: 'John Doe',
  cid: '1234567890',
  contactNo: '+975-17123456',
  email: 'john.doe@example.com',
});

const selectedInstitute = ref(''); // Corrected: Use a string for single selection
const availableInstitutes = ref([]); //  Store fetched institutes
const countryOptions = ref([]);

const eventDetails = reactive({
  name: '',
  description: '',
  purpose: '',
  location: '',
});

const representatives = reactive([
  { name: '', passportNo: '', nationality: '', arrivalDate: '', departureDate: '', cv: null, affiliationLetter: null, authorizationLetter: null },
]);

const remarks = ref('');

// --- Methods ---

// Representatives
const addRepresentative = () => {
  if (representatives.length < 2) {
      representatives.push({
           name: '', passportNo: '', nationality: '', arrivalDate: '', departureDate: '', cv: null, affiliationLetter: null, authorizationLetter: null
      });
  }
};

const removeRepresentative = (index) => {
  representatives.splice(index, 1);
};

const handleCvUpload = (event, index) => {
const file = event.target.files[0];
if (file) {
  representatives[index].cv = file.name; //  Store filename
  //   Upload file (using a service) and store the returned URL
} else {
  representatives[index].cv = null;
}
};

const handleAffiliationLetterUpload = (event, index) => {
  const file = event.target.files[0];
  if(file){
      representatives[index].affiliationLetter = file.name;
  } else {
       representatives[index].affiliationLetter = null;
  }
};
const handleAuthorizationLetterUpload = (event, index) => {
   const file = event.target.files[0];
  if(file){
      representatives[index].authorizationLetter = file.name;
  } else {
      representatives[index].authorizationLetter = null;
  }
};

const submitForm = async () => {
// Basic validation
if (!eventDetails.name || !eventDetails.location || !selectedInstitute.value) {
  toast.error('Please fill in all required event details.');
  return;
}
if (representatives.some(rep => !rep.name || !rep.passportNo || !rep.nationality)) {
  toast.error('Please fill in all required representative details.');
  return;
}

const formData = {
  ecpfDetails,
  selectedInstitute: selectedInstitute.value,
  eventDetails,
  representatives,
  remarks: remarks.value
}

console.log('Submitting form:', formData);

//   API call
try {
  //  const response = await axios.post('/api/in-house-event', formData);
  toast.success('In-house event registered successfully!');
  //   Redirect or update UI as needed.
} catch (error) {
  console.error('Error submitting form:', error);
  toast.error('Failed to register the in-house event.');
}
};

onMounted(async () => {
try {
  //  Fetch available institutes from your API
  const response = await apiService.getInstitutes(); // Use the service
  availableInstitutes.value = response.data;

   // Fetch countries
      const countriesResponse = await apiService.getCountries();
      countryOptions.value = countriesResponse.data;

} catch (error) {
  console.error('Error fetching institutes:', error);
  toast.error('Failed to load institutes.');
}
});
</script>