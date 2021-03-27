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
import apiServices from '@/services/services';

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


const instituteOptions = ref([
  { value: 1, label: 'Royal Institute of Health Sciences' },
  { value: 2, label: 'Khesar Gyalpo University of Medical Sciences' },
  { value: 3, label: 'Jigme Dorji Wangchuck National Referral Hospital' }
]);

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

onMounted(async () => {
  try {
    const institutesResponse = await apiServices.getEpcInstitutes();
    const institutesArray = institutesResponse.data.results;

    instituteOptions.value = institutesArray.map(institute => ({
      value: institute.id,
      label: institute.name_of_institution
    }));


  } catch (error) {
    console.error('Error fetching dropdown options:', error);
    alert('Failed to load dropdown options. Please check the console.');
  }
});


watch(() => formData.value.institute_id, (newValue) => {
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
  formData.value.tc_attachments = event.target.files;
};

const handleReportFileChange = (event) => {
  formData.value.tc_report = event.target.files[0];
};


const handleSubmit = async () => {
  if (formData.value.declaration) {
    const form = new FormData();

    form.append('institute_id', formData.value.institute_id);
    form.append('center_name', formData.value.center_name);
    form.append('center_location', formData.value.center_location);
    form.append('city_gewog', formData.value.city_gewog);
    form.append('state_dzongkhag', formData.value.state_dzongkhag);
    form.append('target_category', formData.value.target_category);
    form.append('remarks', formData.value.remarks);
    form.append('tc_remarks', formData.value.tc_remarks);
    form.append('tc_renewal_review_name', formData.value.tc_renewal_review_name);
    form.append('tc_review_summary', formData.value.tc_review_summary);
    form.append('valid_till', formData.value.valid_till);
    form.append('payment_id', formData.value.payment_id);
    form.append('declaration', formData.value.declaration);


    if (formData.value.tc_attachments) {
      for (let i = 0; i < formData.value.tc_attachments.length; i++) {
        form.append('tc_attachments', formData.value.tc_attachments[i]);
      }
    }

    if (formData.value.tc_report) {
      form.append('tc_report', formData.value.tc_report);
    }


    try {
      const response = await apiServices.createEpcTeachingCenter(form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Form submitted successfully!', response.data);
      alert('Application submitted successfully!');
      handleCancel();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting application. Please check the console for details.');
      console.error('Detailed error:', error.response);
    }
  } else {
    alert('Please declare that the information is correct before submitting.');
  }
};

const handleCancel = () => {
  console.log('Form cancelled');
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
};

const handleSaveDraft = async () => {
  console.log('Form saved as draft:', formData.value);
  try {
    const response = await apiServices.createEpcTeachingCenter(formData.value);
    console.log('Form saved as draft successfully!', response.data);
    alert('Form saved as draft!');
  } catch (error) {
    console.error('Error saving form as draft:', error);
    alert('Error saving form as draft. Please check the console for details.');
  }
};
</script>

<style scoped>
/* You can add more specific styles here if needed */
</style>
