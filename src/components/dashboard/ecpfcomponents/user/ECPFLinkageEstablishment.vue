<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">ECPF Linkage Establishment</h1>
      <p class="text-gray-600">
        Submit details for establishing a linkage with a Higher Education Institution (HEI).
      </p>
    </div>

    <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <form @submit.prevent="submitForm">
        <section class="mb-8">
          <h2 class="text-lg font-medium mb-4 text-gray-700">ECPF Details (Read-Only)</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name of the ECPF</label>
              <input type="text" :value="ecpfDetails.name" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Proprietor of the ECPF</label>
              <input type="text" :value="ecpfDetails.proprietor" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">CID of the Proprietor</label>
              <input type="text" :value="ecpfDetails.cid" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Location of ECPF</label>
              <input type="text" :value="ecpfDetails.location" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Contact No.</label>
              <input type="text" :value="ecpfDetails.contactNo" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" :value="ecpfDetails.email" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-lg font-medium mb-4 text-gray-700">Institute Linkage Details (HEI)</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name of HEI</label>
              <input type="text" v-model="linkageDetails.name" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Official Website</label>
              <input type="url" v-model="linkageDetails.website" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Location</label>
              <input type="text" v-model="linkageDetails.location" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Country</label>
              <select v-model="linkageDetails.country" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                <option value="">Select Country</option>
                <option v-for="country in countryOptions" :key="country.code" :value="country.code">{{ country.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Year of Establishment</label>
              <input type="number" v-model.number="linkageDetails.yearEstablished" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Recognised By</label>
              <input type="text" v-model="linkageDetails.recognizedBy" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Accredited By</label>
              <input type="text" v-model="linkageDetails.accreditedBy" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Affiliation to (if applicable)</label>
              <input type="text" v-model="linkageDetails.affiliation" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Approval from relevant professional bodies (if relevant)</label>
              <input type="text" v-model="linkageDetails.approval" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
                 <label class="block text-sm font-medium text-gray-700">Report on visit/collaboration</label>
                <div class="flex items-center space-x-2">
                  <input type="text" v-model="linkageDetails.report" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
                  <label class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    <input type="file" @change="handleReportUpload" class="hidden" />
                    <span>Upload</span>
                  </label>
                </div>
                <p class="text-xs text-gray-500 mt-1">Auto (File upload, Provision to edit)</p>
              </div>
          </div>
        </section>
          <!-- Submit Section -->
        <div class="mt-6 flex justify-end space-x-4">
          <button type="button" @click="saveAsDraft" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Save as Draft</button>
          <button type="submit"  class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import apiService from '@/services/services'; //  import your service


const toast = useToast();

const ecpfDetails = reactive({
  name: 'Example ECPF',
  proprietor: 'John Doe',
  cid: '1234567890',
  location: 'Thimphu',
  contactNo: '+975-17123456',
  email: 'john.doe@example.com',
});

const linkageDetails = reactive({
  name: '',
  website: '',
  location: '',
  country: '',
  yearEstablished: null,
  recognizedBy: '',
  accreditedBy: '',
  affiliation: '',
  approval: '',
  report: null,
});

const countryOptions = ref([]); // Populate with country data
const reportFile = ref(null);

onMounted(async () => {
  // Fetch country list (replace with your actual API)
    try {
        const response = await apiService.getCountries();
        countryOptions.value = response.data;
    } catch (error) {
        console.error('Error fetching countries:', error);
         toast.error('Failed to load countries.');
    }
});

const handleReportUpload = (event) => {
  const file = event.target.files[0];
    if (file) {
        linkageDetails.report = file.name; // Just store the name for now
        reportFile.value = file; // Keep the actual File object
         //  Upload file using a service, and store the returned URL
    } else {
        linkageDetails.report = null;
         reportFile.value = null;
    }
};

const submitForm = () => {
  // Basic validation
  if (!linkageDetails.name || !linkageDetails.website || !linkageDetails.location || !linkageDetails.country) {
    toast.error("Please fill in all required fields.");
    return;
  }

    // Prepare data for submission (add ecpfDetails too)
    const formData = {
        ecpfDetails: ecpfDetails,
        linkageDetails: linkageDetails,
        // Include the report file if you're doing direct upload
        reportFile: reportFile.value //  Only if direct upload
    };

  console.log("Submitting:", formData);

    //  API call to submit the linkage application (replace with actual API)
    //   try {
    //     const response = await axios.post('/api/linkage', formData);
    //     toast.success("Linkage application submitted successfully!");
    //     //  Redirect or update UI
    //   } catch (error) {
    //        console.error("Error submitting form:", error);
    //        toast.error("An error occurred while submitting the application.");
    //      }
      toast.success("Linkage application submitted successfully!");
};

const saveAsDraft = () => {
  //  Save as draft (either local storage or API call)
   const draftData = {
        ecpfDetails,  // Include ecpfDetails here
        linkageDetails
    };
    console.log("Saving draft:", draftData);
     toast.info("Draft saved.");
}


</script>
