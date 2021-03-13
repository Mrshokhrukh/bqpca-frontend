<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
          <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">Accreditation Appeal</h2>
          <p class="text-gray-600 text-center max-w-2xl mx-auto">File an appeal against the accreditation decision.</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitAppeal" class="p-6">

          <!-- 1. Appellant Details -->
          <div class="mb-6">
            <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
              <h3 class="text-lg font-semibold text-gray-900">1. Appellant Details</h3>
              <p class="mt-1 text-sm text-gray-500">These details are auto-filled from your institution profile.</p>
            </div>

            <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="(value, key) in autoFilledDetails" :key="key">
                <label class="block text-sm font-medium text-gray-700">{{ key }}</label>
                <input type="text" v-model="autoFilledDetails[key]" readonly
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
              </div>
            </div>
          </div>

          <!-- 2. Appeal Details -->
          <div class="mb-6">
            <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
              <h3 class="text-lg font-semibold text-gray-900">2. Appeal Details</h3>
            </div>
            <div class="p-8">

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Reason for Appeal/Type</label>
                <select v-model="appeal.reasonType"
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
                  <option value="" disabled>Select Reason</option>
                  <option v-for="reason in appealReasons" :key="reason.value" :value="reason.value">{{ reason.text }}
                  </option>
                </select>
              </div>

              <div v-if="appeal.reasonType === 'Other'" class="mb-4">
                <label class="block text-sm font-medium text-gray-700">If Others (specify)</label>
                <input type="text" v-model="appeal.reasonOther"
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Reason of Appeal</label>
                <textarea v-model="appeal.reason" rows="3"
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"></textarea>
              </div>

              <div class="mb-4">
                <label class="inline-flex items-center">
                  <input type="checkbox" v-model="appeal.attemptedToResolve"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500" />
                  <span class="ml-2 text-gray-700">Attempted to Resolve with HEQC</span>
                </label>
              </div>

              <div v-if="appeal.attemptedToResolve" class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Outcome (if yes)</label>
                <input type="text" v-model="appeal.outcome"
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Supporting Documents</label>
                <input type="file" multiple @change="onFileChange"
                  class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                <ul class="mt-2 list-disc list-inside">
                  <li v-for="(file, index) in appeal.supportingDocuments" :key="index" class="text-gray-600 text-sm">
                    {{ file.name }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end space-x-4 mt-8 pt-6 border-t p-8">
            <button type="button" @click="saveDraft"
              class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              Save as Draft
            </button>
            <button type="submit"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Submit Appeal
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import apiservice from '@/services/accreditationservices'; // Assuming apiservice is set up in this path

const autoFilledDetails = reactive({
  'Name of Institution': '',
  'Address/Location': '',
  'Dzongkhag/Thromde': '',
  'Contact': '',
  'Email': ''
});

const appeal = reactive({
  reasonType: null,
  reasonOther: '',
  reason: '',
  attemptedToResolve: false,
  outcome: '',
  supportingDocuments: [],
  remarks: '',
  declaration: false,
});

const appealReasons = ref([]);

const onFileChange = (event) => {
  appeal.supportingDocuments = Array.from(event.target.files);
};

const saveDraft = async () => {
  try {
    const formData = new FormData();
    formData.append('reason_type', appeal.reasonType); // Use snake_case to match backend if needed
    formData.append('reason_other', appeal.reasonOther);
    formData.append('reason', appeal.reason);
    formData.append('attempted_to_resolve', appeal.attemptedToResolve);
    formData.append('outcome', appeal.outcome);
    // Append files
    appeal.supportingDocuments.forEach(file => {
      formData.append('supporting_documents', file); // Backend needs to handle multiple files with this key
    });

    const response = await apiservice.createProfileAppeal(formData, { // Using createProfileAppeal from apiservice
      headers: {
        'Content-Type': 'multipart/form-data' // Important for file uploads
      }
    });
    console.log('Draft saved:', response.data);
    alert('Draft saved successfully!'); // Provide user feedback
  } catch (error) {
    console.error('Error saving draft:', error);
    alert('Failed to save draft. Please check the console for details.'); // User feedback for error
  }
};

const submitAppeal = async () => {
  try {
    const formData = new FormData();
    formData.append('reason_type', appeal.reasonType); // Use snake_case to match backend if needed
    formData.append('reason_other', appeal.reasonOther);
    formData.append('reason', appeal.reason);
    formData.append('attempted_to_resolve', appeal.attemptedToResolve);
    formData.append('outcome', appeal.outcome);
    // Append files
    appeal.supportingDocuments.forEach(file => {
      formData.append('supporting_documents', file); // Backend needs to handle multiple files with this key
    });

    const response = await apiservice.createProfileAppeal(formData, { // Using createProfileAppeal from apiservice
      headers: {
        'Content-Type': 'multipart/form-data' // Important for file uploads
      }
    });
    console.log('Appeal submitted:', response.data);
    alert('Appeal submitted successfully!'); // Provide user feedback
    // Optionally reset the form or redirect user
  } catch (error) {
    console.error('Error submitting appeal:', error);
    alert('Failed to submit appeal. Please check the console for details.'); // User feedback for error
  }
};

const fetchAppealReasons = async () => {
  try {
    const response = await apiservice.getMastersAppealReasons(); // Using getMastersAppealReasons from apiservice
    appealReasons.value = response.data.map(reason => ({ // Assuming backend returns array of objects
      text: reason.reason_name, // Adjust based on actual API response field
      value: reason.reason_type_value // Adjust based on actual API response field
    }));
  } catch (error) {
    console.error('Error fetching appeal reasons:', error);
  }
};

const fetchInstitutionProfile = async () => {
  try {
    const response = await apiservice.getProfileAppeals(); // Using getProfileAppeals - assuming this fetches institution profiles based on previous API info and service name context. **Verify this is the correct service call**
    const profiles = response.data; // Assuming API returns a list of profiles

    if (profiles && profiles.length > 0) {
      const profileData = profiles[0]; // Taking the first profile from the list. Adjust logic if needed.
      autoFilledDetails['Name of Institution'] = profileData.institution_name || ''; // Adjust field names based on your API response
      autoFilledDetails['Address/Location'] = profileData.address || '';
      autoFilledDetails['Dzongkhag/Thromde'] = profileData.dzongkhag || '';
      autoFilledDetails['Contact'] = profileData.contact_number || '';
      autoFilledDetails['Email'] = profileData.email || '';
    } else {
      console.warn('No institution profiles found.');
      // Optionally handle the case where no profiles are found (e.g., display a message)
    }

  } catch (error) {
    console.error('Error fetching institution profile:', error);
    // Optionally handle error, e.g., display a message to the user
  }
};


onMounted(() => {
  fetchAppealReasons();
  fetchInstitutionProfile();
});
</script>