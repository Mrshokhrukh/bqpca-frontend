<template>
  <div class="p-8 rounded-xl">
    <h2 class="text-3xl font-bold text-gray-800 mb-8">New Teaching Center Application</h2>

    <form @submit.prevent="handleSubmit" class="space-y-8" enctype="multipart/form-data">
      <section class="p-6 bg-white rounded-lg shadow">
        <h3 class="text-2xl font-semibold text-gray-700 mb-6">Proponent Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label for="trainingInstituteName" class="block text-sm font-medium text-gray-600">
              Training Institute Name
            </label>
            <select id="trainingInstituteName" v-model="formData.institute_id"
              class="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required>
              <option value="" disabled>Select Institute</option>
              <option v-for="institute in instituteOptions" :key="institute.value" :value="institute.value">
                {{ institute.label }}
              </option>
            </select>
          </div>
          <div>
            <label for="country" class="block text-sm font-medium text-gray-600">
              Country
            </label>
            <input type="text" id="country" v-model="formData.country" disabled
              class="mt-2 block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md shadow-sm sm:text-sm" />
          </div>
          <div>
            <label for="dzongkhag" class="block text-sm font-medium text-gray-600">
              Dzongkhag/Throme
            </label>
            <input type="text" id="dzongkhag" v-model="formData.dzongkhag" disabled
              class="mt-2 block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md shadow-sm sm:text-sm" />
          </div>
          <div>
            <label for="cityGewogProponent" class="block text-sm font-medium text-gray-600">
              City/Gewog
            </label>
            <input type="text" id="cityGewogProponent" v-model="formData.cityGewog" disabled
              class="mt-2 block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md shadow-sm sm:text-sm" />
          </div>
          <div>
            <label for="addressLocation" class="block text-sm font-medium text-gray-600">
              Address/Location
            </label>
            <input type="text" id="addressLocation" v-model="formData.addressLocation"
              class="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label for="contactNo" class="block text-sm font-medium text-gray-600">
              Contact No.
            </label>
            <input type="text" id="contactNo" v-model="formData.contactNo"
              class="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label for="emailAddress" class="block text-sm font-medium text-gray-600">
              Email Address
            </label>
            <input type="email" id="emailAddress" v-model="formData.emailAddress"
              class="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>
      </section>

      <section class="p-6 bg-white rounded-lg shadow">
        <h3 class="text-2xl font-semibold text-gray-700 mb-6">Teaching Center Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label for="centerName" class="block text-sm font-medium text-gray-600">
              Center Name
            </label>
            <input type="text" id="centerName" v-model="formData.center_name"
              class="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required />
          </div>
          <div>
            <label for="centerLocation" class="block text-sm font-medium text-gray-600">
              Center Location
            </label>
            <input type="text" id="centerLocation" v-model="formData.center_location"
              class="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required />
          </div>
          <div>
            <label for="cityGewogCenter" class="block text-sm font-medium text-gray-600">
              City/Gewog
            </label>
            <select id="cityGewogCenter" v-model="formData.city_gewog"
              class="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required>
              <option value="" disabled>Select City/Gewog</option>
              <option v-for="city in cityGewogOptions" :key="city.value" :value="city.value">
                {{ city.label }} ({{ city.value }})
              </option>
            </select>
          </div>
          <div>
            <label for="stateDzongkhag" class="block text-sm font-medium text-gray-600">
              State/Dzongkhag
            </label>
            <select id="stateDzongkhag" v-model="formData.state_dzongkhag"
              class="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required>
              <option value="" disabled>Select Dzongkhag</option>
              <option v-for="dzongkhag in dzongkhagOptions" :key="dzongkhag.value" :value="dzongkhag.value">
                {{ dzongkhag.label }} ({{ dzongkhag.value }})
              </option>
            </select>
          </div>
          <div>
            <label for="targetCategory" class="block text-sm font-medium text-gray-600">
              Target Category
            </label>
            <input type="text" id="targetCategory" v-model="formData.target_category"
              class="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required />
          </div>
          <div>
            <label for="tcRenewalReviewName" class="block text-sm font-medium text-gray-600">
              Renewal Review Name
            </label>
            <input type="text" id="tcRenewalReviewName" v-model="formData.tc_renewal_review_name"
              class="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required />
          </div>
          <div>
            <label for="tcReviewSummary" class="block text-sm font-medium text-gray-600">
              Review Summary
            </label>
            <textarea id="tcReviewSummary" v-model="formData.tc_review_summary" rows="3"
              class="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required></textarea>
          </div>
          <div>
            <label for="validTill" class="block text-sm font-medium text-gray-600">
              Valid Till
            </label>
            <input type="date" id="validTill" v-model="formData.valid_till"
              class="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required />
          </div>
          <div>
            <label for="paymentId" class="block text-sm font-medium text-gray-600">
              Payment ID
            </label>
            <input type="text" id="paymentId" v-model="formData.payment_id"
              class="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required />
          </div>
          <div>
            <label for="tcAttachments" class="block text-sm font-medium text-gray-600">
              Attachments
            </label>
            <input type="file" id="tcAttachments" @change="handleAttachmentChange" multiple required
              class="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
            <p class="mt-1 text-sm text-gray-500">Attach relevant documents here.</p>
          </div>
          <div>
            <label for="tcReportFile" class="block text-sm font-medium text-gray-600">
              Report File
            </label>
            <input type="file" id="tcReportFile" @change="handleReportFileChange"
              class="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              required />
            <p class="mt-1 text-sm text-gray-500">Attach the report file here.</p>
          </div>
        </div>
        <div class="mt-6">
          <label for="tcRemarks" class="block text-sm font-medium text-gray-600">
            Teaching Center Remarks
          </label>
          <textarea id="tcRemarks" v-model="formData.tc_remarks" rows="3"
            class="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required></textarea>
        </div>
        <div class="mt-6">
          <label for="remarks" class="block text-sm font-medium text-gray-600">
            Remarks (General)
          </label>
          <textarea id="remarks" v-model="formData.remarks" rows="3"
            class="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
        </div>
      </section>

      <div class="flex items-start p-6 bg-white rounded-lg shadow">
        <div class="flex items-center h-5">
          <input id="declaration" aria-describedby="declaration-description" type="checkbox"
            v-model="formData.declaration" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            required />
        </div>
        <div class="ml-3 text-sm">
          <label for="declaration" class="font-medium text-gray-700">Declaration</label>
          <p id="declaration-description" class="text-gray-500">
            I hereby declare that the information provided above is true and correct to the best of my knowledge.
          </p>
        </div>
      </div>

      <div class="flex justify-end space-x-4 p-6 bg-white rounded-lg shadow">
        <button type="button"
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          @click="handleCancel">
          Cancel
        </button>
        <button type="button"
          class="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
          @click="handleSaveDraft">
          Save as Draft
        </button>
        <button type="submit" :disabled="!formData.declaration"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          :class="{ 'opacity-50 cursor-not-allowed': !formData.declaration }">
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import apiServices from '@/services/services'; // Assuming this service fetches institute data

// Stores { value: id, label: name } for the dropdown
const instituteOptions = ref([]);
// Stores the FULL details of all fetched institutes
const allInstitutesDetails = ref([]);

const formData = ref({
  institute_id: '',
  country: 'Bhutan', 
  dzongkhag: '',
  cityGewog: '',
  addressLocation: '',
  contactNo: '',
  emailAddress: '',
  center_name: '',
  center_location: '',
  city_gewog: '',
  state_dzongkhag: '',
  target_category: '',
  tc_attachments: null,
  tc_report: null,
  remarks: '',
  tc_remarks: '',
  tc_renewal_review_name: '',
  tc_review_summary: '',
  valid_till: '',
  payment_id: '',
  declaration: false,
});

// --- Options for other dropdowns (keep as they are) ---
const cityGewogOptions = ref([
  { value: 'TT', label: 'Thimphu Thromde' },
  { value: 'CT', label: 'Changzamtog' },
  { value: 'MT', label: 'Motithang' }
]);

const dzongkhagOptions = ref([
  { value: 'TH', label: 'Thimphu' },
  { value: 'PH', label: 'Phuentsholing' },
  { value: 'PR', label: 'Paro' }
]);

// --- Fetch Data on Mount ---
onMounted(async () => {
  try {
    // Fetch the list of institutes
    const institutesResponse = await apiServices.getEpcInstitutes();

    if (institutesResponse.data && institutesResponse.data.results) {
      const institutesArray = institutesResponse.data.results;

      // Store the full details for later lookup
      allInstitutesDetails.value = institutesArray;

      // Populate the dropdown options
      instituteOptions.value = institutesArray.map(institute => ({
        value: institute.id, // Assuming 'id' is the unique identifier
        label: institute.name_of_institution // Assuming 'name_of_institution' is the display name
      }));
    } else {
        console.error('Unexpected API response structure for institutes:', institutesResponse.data);
        alert('Failed to load institute options due to unexpected data format.');
    }

    // --- Fetch other dropdown options if needed ---
    // Example: Fetch City/Gewog and Dzongkhag options if they come from an API
    // try {
    //   const [citiesRes, dzongkhagsRes] = await Promise.all([
    //     apiServices.getCities(), // Replace with your actual API call
    //     apiServices.getDzongkhags() // Replace with your actual API call
    //   ]);
    //   cityGewogOptions.value = citiesRes.data.map(c => ({ value: c.id, label: c.name }));
    //   dzongkhagOptions.value = dzongkhagsRes.data.map(d => ({ value: d.id, label: d.name }));
    // } catch (error) {
    //   console.error('Error fetching City/Gewog or Dzongkhag options:', error);
    // }

  } catch (error) {
    console.error('Error fetching dropdown options:', error);
    alert('Failed to load initial dropdown options. Please check the console.');
  }
});

// --- Watch for Institute Selection Change ---
watch(() => formData.value.institute_id, (newInstituteId) => {
  // Find the full details of the selected institute
  const selectedInstituteDetails = allInstitutesDetails.value.find(inst => inst.id === newInstituteId);

  if (selectedInstituteDetails) {
    // --- Populate Proponent Details ---
    // IMPORTANT: Adjust the property names below (e.g., 'country', 'dzongkhag_name', 'gewog_name', 'address', 'contact_number', 'email')
    //            to match the ACTUAL property names returned by your API for an institute object.
    formData.value.country = selectedInstituteDetails.country || 'Bhutan'; // Default to Bhutan if not provided
    formData.value.dzongkhag = selectedInstituteDetails.dzongkhag_name || ''; // Example: Assuming API returns 'dzongkhag_name'
    formData.value.cityGewog = selectedInstituteDetails.gewog_name || ''; // Example: Assuming API returns 'gewog_name'
    formData.value.addressLocation = selectedInstituteDetails.address || ''; // Example: Assuming API returns 'address'
    formData.value.contactNo = selectedInstituteDetails.contact_number || ''; // Example: Assuming API returns 'contact_number'
    formData.value.emailAddress = selectedInstituteDetails.email || ''; // Example: Assuming API returns 'email'

  } else {
    // Clear the fields if no institute is selected or details are not found
    formData.value.country = 'Bhutan'; // Reset to default
    formData.value.dzongkhag = '';
    formData.value.cityGewog = '';
    formData.value.addressLocation = '';
    formData.value.contactNo = '';
    formData.value.emailAddress = '';
    if (newInstituteId) {
        console.warn(`Details not found for institute ID: ${newInstituteId}. Fields cleared.`);
    }
  }
});

// --- File Handlers (keep as they are) ---
const handleAttachmentChange = (event) => {
  formData.value.tc_attachments = event.target.files;
};

const handleReportFileChange = (event) => {
  formData.value.tc_report = event.target.files[0];
};

// --- Form Actions (keep as they are) ---
const handleSubmit = async () => {
  if (!formData.value.institute_id) {
       alert('Please select a Training Institute.');
       return;
   }
  if (formData.value.declaration) {
    const form = new FormData();

    // Append all necessary fields, including the auto-populated ones
    form.append('institute_id', formData.value.institute_id);
    form.append('center_name', formData.value.center_name);
    form.append('center_location', formData.value.center_location);
    form.append('city_gewog', formData.value.city_gewog);
    form.append('state_dzongkhag', formData.value.state_dzongkhag);
    form.append('target_category', formData.value.target_category);
    form.append('remarks', formData.value.remarks || ''); // Handle potentially empty remarks
    form.append('tc_remarks', formData.value.tc_remarks);
    form.append('tc_renewal_review_name', formData.value.tc_renewal_review_name);
    form.append('tc_review_summary', formData.value.tc_review_summary);
    form.append('valid_till', formData.value.valid_till);
    form.append('payment_id', formData.value.payment_id);
    form.append('declaration', formData.value.declaration); // Should be boolean true

    // Append proponent details (even though auto-filled, they are part of the form data conceptually)
    // NOTE: Your backend might not need these if it can look them up via institute_id,
    // but it's safer to send them unless you know otherwise.
    form.append('proponent_country', formData.value.country);
    form.append('proponent_dzongkhag', formData.value.dzongkhag);
    form.append('proponent_city_gewog', formData.value.cityGewog);
    form.append('proponent_address', formData.value.addressLocation);
    form.append('proponent_contact_no', formData.value.contactNo);
    form.append('proponent_email', formData.value.emailAddress);


    // Append files
    if (formData.value.tc_attachments && formData.value.tc_attachments.length > 0) {
      for (let i = 0; i < formData.value.tc_attachments.length; i++) {
        form.append('tc_attachments', formData.value.tc_attachments[i]);
      }
    } else {
        // Add validation or alert if attachments are required but missing
        // alert('Please attach required documents.');
        // return;
    }

    if (formData.value.tc_report) {
      form.append('tc_report', formData.value.tc_report);
    } else {
        // Add validation or alert if report file is required but missing
        // alert('Please attach the report file.');
        // return;
    }


    try {
      console.log("Submitting form data:", Object.fromEntries(form.entries())); // Log form data before sending
      const response = await apiServices.createEpcTeachingCenter(form, { // Use your actual service method
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Form submitted successfully!', response.data);
      alert('Application submitted successfully!');
      handleCancel(); // Reset form after successful submission
    } catch (error) {
       console.error('Error submitting form:', error);
       let errorMessage = 'Error submitting application.';
       if (error.response) {
           // Backend returned an error response
           console.error('Detailed error response:', error.response.data);
           // Try to extract a meaningful message
           errorMessage += ` Server responded with status ${error.response.status}. Details: ${JSON.stringify(error.response.data)}`;
       } else if (error.request) {
           // Request was made but no response received
           errorMessage += ' No response received from server.';
       } else {
           // Error setting up the request
           errorMessage += ` Request setup error: ${error.message}`;
       }
       alert(errorMessage + ' Please check the console for more details.');
    }
  } else {
    alert('Please accept the declaration before submitting.');
  }
};

const handleCancel = () => {
  console.log('Form cancelled');
  // Reset formData to initial state
  formData.value = {
    institute_id: '',
    country: 'Bhutan',
    dzongkhag: '',
    cityGewog: '',
    addressLocation: '',
    contactNo: '',
    emailAddress: '',
    center_name: '',
    center_location: '',
    city_gewog: '',
    state_dzongkhag: '',
    target_category: '',
    tc_attachments: null,
    tc_report: null,
    remarks: '',
    tc_remarks: '',
    tc_renewal_review_name: '',
    tc_review_summary: '',
    valid_till: '',
    payment_id: '',
    declaration: false,
  };
  // Reset file inputs if necessary (programmatically tricky, usually just replacing the key works)
  // Example: Add a :key attribute to the file input elements bound to a counter that increments on cancel.
};

const handleSaveDraft = async () => {
    // Implement draft saving logic - similar to handleSubmit but might go to a different endpoint
    // or have a different status flag. Often sends JSON instead of FormData.
  console.log('Form saved as draft:', formData.value);
  // Make sure to handle file data appropriately for drafts if needed
  // (e.g., storing file metadata or requiring re-upload later)
  const draftData = { ...formData.value };
  // Remove file objects before sending JSON if your API expects that
  delete draftData.tc_attachments;
  delete draftData.tc_report;
  // Add a status field maybe?
  // draftData.status = 'draft';

  try {
    // const response = await apiServices.saveDraftTeachingCenter(draftData); // Example API call
    // console.log('Form saved as draft successfully!', response.data);
    alert('Draft saving not fully implemented yet.'); // Placeholder alert
  } catch (error) {
    console.error('Error saving form as draft:', error);
    alert('Error saving form as draft. Please check the console for details.');
  }
};
</script>