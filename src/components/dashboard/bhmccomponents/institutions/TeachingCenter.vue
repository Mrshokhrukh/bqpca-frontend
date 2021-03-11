<template>
  <div class="p-6 bg-gray-50 rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold text-gray-900 mb-6">New Teaching Center Application</h2>

    <form @submit.prevent="handleSubmit" class="space-y-6" enctype="multipart/form-data">
      <!-- Proponent Details -->
      <section>
        <h3 class="text-xl font-medium text-gray-900 mb-4">Proponent Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="trainingInstituteName" class="block text-sm font-medium text-gray-700">
              Training Institute Name
            </label>
            <select id="trainingInstituteName" v-model="formData.institute"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required>
              <option value="" disabled>Select Institute</option>
              <option v-for="institute in instituteOptions" :key="institute.value" :value="institute.value">
                {{ institute.label }}
              </option>
            </select>
          </div>
          <div>
            <label for="country" class="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input type="text" id="country" v-model="formData.country" disabled
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100" />
          </div>
          <div>
            <label for="dzongkhag" class="block text-sm font-medium text-gray-700">
              Dzongkhag/Throme
            </label>
            <input type="text" id="dzongkhag" v-model="formData.dzongkhag" disabled
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100" />
          </div>
          <div>
            <label for="cityGewogProponent" class="block text-sm font-medium text-gray-700">
              City/Gewog
            </label>
            <input type="text" id="cityGewogProponent" v-model="formData.cityGewog" disabled
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100" />
          </div>
          <div>
            <label for="addressLocation" class="block text-sm font-medium text-gray-700">
              Address/Location
            </label>
            <input type="text" id="addressLocation" v-model="formData.addressLocation"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label for="contactNo" class="block text-sm font-medium text-gray-700">
              Contact No.
            </label>
            <input type="text" id="contactNo" v-model="formData.contactNo"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label for="emailAddress" class="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input type="email" id="emailAddress" v-model="formData.emailAddress"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
        </div>
      </section>

      <!-- Teaching Center Details -->
      <section>
        <h3 class="text-xl font-medium text-gray-900 mb-4">Teaching Center Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="centerName" class="block text-sm font-medium text-gray-700">
              Center Name
            </label>
            <input type="text" id="centerName" v-model="formData.center_name"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
          </div>
          <div>
            <label for="centerLocation" class="block text-sm font-medium text-gray-700">
              Center Location
            </label>
            <input type="text" id="centerLocation" v-model="formData.center_location"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
          </div>
          <div>
            <label for="cityGewogCenter" class="block text-sm font-medium text-gray-700">
              City/Gewog (Max 2 chars)</label>
            <select id="cityGewogCenter" v-model="formData.city_gewog"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required>
              <option value="" disabled>Select City/Gewog</option>
              <option v-for="city in cityGewogOptions" :key="city.value" :value="city.value">
                {{ city.label }} ({{ city.value }})
              </option>
            </select>
          </div>
          <div>
            <label for="stateDzongkhag" class="block text-sm font-medium text-gray-700">
              State/Dzongkhag (Max 2 chars)
            </label>
            <select id="stateDzongkhag" v-model="formData.state_dzongkhag"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required>
              <option value="" disabled>Select Dzongkhag</option>
              <option v-for="dzongkhag in dzongkhagOptions" :key="dzongkhag.value" :value="dzongkhag.value">
                {{ dzongkhag.label }} ({{ dzongkhag.value }})
              </option>
            </select>
          </div>
          <div>
            <label for="targetCategory" class="block text-sm font-medium text-gray-700">
              Target Category
            </label>
            <input type="text" id="targetCategory" v-model="formData.target_category"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
          </div>
          <div>
            <label for="tcRenewalReviewName" class="block text-sm font-medium text-gray-700">
              Renewal Review Name
            </label>
            <input type="text" id="tcRenewalReviewName" v-model="formData.tc_renewal_review_name"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
          </div>
          <div>
            <label for="tcReviewSummary" class="block text-sm font-medium text-gray-700">
              Review Summary
            </label>
            <textarea id="tcReviewSummary" v-model="formData.tc_review_summary" rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required></textarea>
          </div>
          <div>
            <label for="validTill" class="block text-sm font-medium text-gray-700">
              Valid Till
            </label>
            <input type="date" id="validTill" v-model="formData.valid_till"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
          </div>
          <div>
            <label for="paymentId" class="block text-sm font-medium text-gray-700">
              Payment ID
            </label>
            <input type="text" id="paymentId" v-model="formData.payment_id"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
          </div>
          <div>
            <label for="tcAttachments" class="block text-sm font-medium text-gray-700">
              Attachments
            </label>
            <input type="file" id="tcAttachments" @change="handleAttachmentChange" multiple required
              class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
            <p class="mt-1 text-sm text-gray-500" id="file_input_help">Attach relevant documents here.</p>
          </div>
          <div>
            <label for="tcReportFile" class="block text-sm font-medium text-gray-700">
              Report File
            </label>
            <input type="file" id="tcReportFile" @change="handleReportFileChange"
              class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" required />
            <p class="mt-1 text-sm text-gray-500" id="file_input_help">Attach the report file here.</p>
          </div>
        </div>
        <div>
          <label for="tcRemarks" class="block text-sm font-medium text-gray-700">
            Teaching Center Remarks
          </label>
          <textarea id="tcRemarks" v-model="formData.tc_remarks" rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required></textarea>
        </div>
        <div>
          <label for="remarks" class="block text-sm font-medium text-gray-700">
            Remarks (General)
          </label>
          <textarea id="remarks" v-model="formData.remarks" rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
        </div>
      </section>

      <!-- Declaration -->
      <div class="flex items-start">
        <div class="flex items-center h-5">
          <input id="declaration" aria-describedby="declaration-description" type="checkbox"
            v-model="formData.declaration"
            class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" required />
        </div>
        <div class="ml-3 text-sm">
          <label for="declaration" class="font-medium text-gray-700">Declaration</label>
          <p id="declaration-description" class="text-gray-500">
            I hereby declare that the information provided above is true and correct to the best of my knowledge.
          </p>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex justify-end space-x-4">
        <button type="button" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline" @click="handleCancel">
          Cancel
        </button>
        <button type="button" class="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline" @click="handleSaveDraft">
          Save as Draft
        </button>
        <button type="submit" :disabled="!formData.declaration"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          :class="{ 'opacity-50 cursor-not-allowed': !formData.declaration }">
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import apiServices from '@/services/services';

const formData = ref({
  institute: '', // Expecting PK value now
  country: 'Bhutan',
  dzongkhag: '',
  cityGewog: '',
  addressLocation: '',
  contactNo: '',
  emailAddress: '',
  center_name: '',
  center_location: '',
  city_gewog: '', // Max 2 chars
  state_dzongkhag: '', // Max 2 chars
  target_category: '',
  tc_attachments: null, // File list
  tc_report: null, // Single file
  remarks: '', // General remarks
  tc_remarks: '', // Teaching center specific remarks - required
  tc_renewal_review_name: '', // Required
  tc_review_summary: '', // Required
  valid_till: '', // Required - Date
  payment_id: '', // Required
  declaration: false,
});

// Fetch institute options from backend on component mount
const instituteOptions = ref([]);
const cityGewogOptions = ref([]);
const dzongkhagOptions = ref([]);

onMounted(async () => {
  try {
    const institutesResponse = await apiServices.getInstitutesForDropdown(); // Replace with your actual API endpoint to fetch institutes
    instituteOptions.value = institutesResponse.data;

    const cityGewogsResponse = await apiServices.getCityGewogsForDropdown(); // Replace with your actual API endpoint
    cityGewogOptions.value = cityGewogsResponse.data;

    const dzongkhagsResponse = await apiServices.getDzongkhagsForDropdown(); // Replace with your actual API endpoint
    dzongkhagOptions.value = dzongkhagsResponse.data;


  } catch (error) {
    console.error('Error fetching dropdown options:', error);
    alert('Failed to load dropdown options. Please check the console.');
  }
});


watch(() => formData.value.institute, (newValue) => {
  const selectedInstitute = instituteOptions.value.find(inst => inst.value === newValue);
  if (selectedInstitute && selectedInstitute.label === 'Royal Institute of Health Sciences') {
    formData.value.country = 'Bhutan';
    formData.value.dzongkhag = 'Thimphu';
    formData.value.cityGewog = 'Thimphu Thromde';
    formData.value.addressLocation = 'Thimphu, Bhutan';
    formData.value.contactNo = '+(975) 2 322057';
    formData.value.emailAddress = 'info@rihs.edu.bt';
  } else if (selectedInstitute && selectedInstitute.label === 'Khesar Gyalpo University of Medical Sciences of Bhutan') {
    formData.value.country = 'Bhutan';
    formData.value.dzongkhag = 'Thimphu';
    formData.value.cityGewog = 'Thimphu Thromde';
    formData.value.addressLocation = 'Thimphu, Bhutan';
    formData.value.contactNo = '+(975) 2 330556';
    formData.value.emailAddress = 'info@kgumsb.edu.bt';
  } else if (selectedInstitute && selectedInstitute.label === 'Other Institute') {
    formData.value.country = '';
    formData.value.dzongkhag = '';
    formData.value.cityGewog = '';
    formData.value.addressLocation = '';
    formData.value.contactNo = '';
    formData.value.emailAddress = '';
  } else {
    formData.value.country = '';
    formData.value.dzongkhag = '';
    formData.value.cityGewog = '';
    formData.value.addressLocation = '';
    formData.value.contactNo = '';
    formData.value.emailAddress = '';
  }
});

const handleAttachmentChange = (event) => {
  formData.value.tc_attachments = event.target.files; // Get FileList object
};

const handleReportFileChange = (event) => {
  formData.value.tc_report = event.target.files[0]; // Get single File object
};


const handleSubmit = async () => {
  if (formData.value.declaration) {
    const form = new FormData(); // Use FormData for file uploads

    // Append text fields
    form.append('institute', formData.value.institute);
    form.append('center_name', formData.value.center_name);
    form.append('center_location', formData.value.center_location);
    form.append('city_gewog', formData.value.city_gewog);
    form.append('state_dzongkhag', formData.value.state_dzongkhag);
    form.append('target_category', formData.value.target_category);
    form.append('remarks', formData.value.remarks);
    form.append('tc_remarks', formData.value.tc_remarks);
    form.append('tc_renewal_review_name', formData.value.tc_renewal_review_name);
    form.append('tc_review_summary', formData.value.tc_review_summary);
    form.append('valid_till', formData.value.valid_till); // Date will be stringified
    form.append('payment_id', formData.value.payment_id);
    form.append('declaration', formData.value.declaration); // Send declaration

    // Append attachments (multiple files)
    if (formData.value.tc_attachments) {
      for (let i = 0; i < formData.value.tc_attachments.length; i++) {
        form.append('tc_attachments', formData.value.tc_attachments[i]); // Append each file
      }
    }
    // Append report file (single file)
    if (formData.value.tc_report) {
      form.append('tc_report', formData.value.tc_report); // Append single report file
    }


    try {
      const response = await apiServices.createBmhcTeachingCenter(form, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important for file uploads
        },
      });
      console.log('Form submitted successfully!', response.data);
      alert('Application submitted successfully!');
      handleCancel();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting application. Please check the console for details.');
      console.error('Detailed error:', error.response); // Log detailed error response
    }
  } else {
    alert('Please declare that the information is correct before submitting.');
  }
};

const handleCancel = () => {
  console.log('Form cancelled');
  formData.value = {
    institute: '',
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
};

const handleSaveDraft = async () => {
  console.log('Form saved as draft:', formData.value);
  // For draft, you might not need to send files or all required fields. Adjust as needed.
  try {
    const response = await apiServices.createBmhcTeachingCenter(formData.value); // Or send FormData if needed for drafts too
    console.log('Form saved as draft successfully!', response.data);
    alert('Form saved as draft!');
  } catch (error) {
    console.error('Error saving form as draft:', error);
    alert('Error saving form as draft. Please check the console for details.');
  }
};
</script>

<style scoped>
/* Add any component-specific styles here if needed */
</style>