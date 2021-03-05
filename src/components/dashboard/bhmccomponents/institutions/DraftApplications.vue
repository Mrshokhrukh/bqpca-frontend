<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Form Header -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Edit EOI Application
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Edit your EOI application before submitting.
      </p>
    </div>

    <!-- Main Form Card -->
    <div class="bg-white border rounded-xl shadow-sm p-6" v-if="application">
      <!-- Institution Details Section -->
      <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
        <h3 class="text-lg font-semibold text-gray-900">Institution Details</h3>
        <p class="mt-1 text-sm text-gray-500">Enter the details of the proposed institution.</p>
      </div>

      <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Name and Address of Institution -->
        <div class="col-span-2">
          <label for="institutionName" class="block text-sm font-medium text-gray-700">
            Name and Address of Institution:
          </label>
          <textarea id="institutionName" v-model="application.institutionName"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            rows="3" placeholder="Enter institution name and address"></textarea>
        </div>

        <!-- Correspondence Address -->
        <div class="col-span-2">
          <label for="correspondenceAddress" class="block text-sm font-medium text-gray-700">
            Correspondence Address:
          </label>
          <textarea id="correspondenceAddress" v-model="application.correspondenceAddress"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            rows="3" placeholder="Enter correspondence address"></textarea>
        </div>

        <!-- Location of Institution -->
        <div class="col-span-1">
          <label for="location" class="block text-sm font-medium text-gray-700">
            Location of Institution:
          </label>
          <input type="text" id="location" v-model="application.location"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            placeholder="Enter location" />
        </div>

        <!-- Phone No. (Office) -->
        <div class="col-span-1">
          <label for="phoneOffice" class="block text-sm font-medium text-gray-700">
            Phone No. (Office):
          </label>
          <input type="tel" id="phoneOffice" v-model="application.phoneOffice"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            placeholder="Enter office phone number" />
        </div>

        <!-- Mobile -->
        <div class="col-span-1">
          <label for="mobile" class="block text-sm font-medium text-gray-700">
            Mobile:
          </label>
          <input type="tel" id="mobile" v-model="application.mobile"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            placeholder="Enter mobile number" />
        </div>

        <!-- Fax -->
        <div class="col-span-1">
          <label for="fax" class="block text-sm font-medium text-gray-700">
            Fax:
          </label>
          <input type="text" id="fax" v-model="application.fax"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            placeholder="Enter fax number" />
        </div>

        <!-- Email Address -->
        <div class="col-span-1">
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email Address:
          </label>
          <input type="email" id="email" v-model="application.email"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            placeholder="Enter email address" />
        </div>

        <!-- Webpage (if applicable) -->
        <div class="col-span-1">
          <label for="webpage" class="block text-sm font-medium text-gray-700">
            Webpage (if applicable):
          </label>
          <input type="url" id="webpage" v-model="application.webpage"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            placeholder="Enter webpage URL" />
        </div>

        <!-- Title of Proposed Medical and Health Courses -->
        <div class="col-span-2">
          <label for="courseTitle" class="block text-sm font-medium text-gray-700">
            Title of Proposed Medical and Health Courses:
          </label>
          <input type="text" id="courseTitle" v-model="application.courseTitle"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            placeholder="Enter proposed course titles" />
        </div>

        <!-- Duration of the Course -->
        <div class="col-span-1">
          <label for="courseDuration" class="block text-sm font-medium text-gray-700">
            Duration of the Course:
          </label>
          <input type="text" id="courseDuration" v-model="application.courseDuration"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            placeholder="Enter course duration" />
        </div>

        <!-- Proposed Date for Course Commencement/Implementation -->
        <div class="col-span-1">
          <label for="commencementDate" class="block text-sm font-medium text-gray-700">
            Proposed Date for Course Commencement/Implementation:
          </label>
          <input type="date" id="commencementDate" v-model="application.commencementDate"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
        </div>

        <!-- Type of Program -->
        <div class="col-span-2">
          <label class="block text-sm font-medium text-gray-700">
            Type of Program:
          </label>
          <div class="mt-2 flex items-center space-x-4">
            <div>
              <input type="radio" id="diploma" value="Diploma" v-model="application.programType"
                class="mr-2 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
              <label for="diploma" class="text-gray-700">Diploma</label>
            </div>
            <div>
              <input type="radio" id="bachelor" value="Bachelor" v-model="application.programType"
                class="mr-2 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
              <label for="bachelor" class="text-gray-700">Bachelor</label>
            </div>
          </div>
        </div>
      </div>

      <!-- Declaration Section -->
      <div class="border-t border-gray-200 bg-gray-50 p-6 rounded-b-xl">
        <h3 class="text-lg font-semibold text-gray-900">Declaration</h3>
        <p class="mt-1 text-sm text-gray-500">
          I/We certify that the information provided in this application is true, complete, and accurate to the best of
          my knowledge. I realize that any false, fictitious, or fraudulent statements may be subjected to
          administrative penalties. I am fully aware and understand the process and requirements of relevant agencies.
        </p>
      </div>

      <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Signature(s) of Applicant -->
        <div class="col-span-1">
          <label for="applicantSignature" class="block text-sm font-medium text-gray-700">
            Signature(s) of Applicant:
          </label>
          <input type="text" id="applicantSignature" v-model="application.applicantSignature"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            placeholder="Enter applicant signature" />
        </div>

        <!-- Name -->
        <div class="col-span-1">
          <label for="applicantName" class="block text-sm font-medium text-gray-700">
            Name:
          </label>
          <input type="text" id="applicantName" v-model="application.applicantName"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            placeholder="Enter applicant name" />
        </div>

        <!-- Contact Number -->
        <div class="col-span-2">
          <label for="contactNumber" class="block text-sm font-medium text-gray-700">
            Contact Number:
          </label>
          <input type="tel" id="contactNumber" v-model="application.contactNumber"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            placeholder="Enter contact number" />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-12 flex justify-end space-x-4 p-8">
        <button @click="handleCancel"
          class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button @click="handleSubmit"
          class="px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
          Submit Application
        </button>
      </div>
    </div>
    <div v-else>Loading Application form..</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import apiService from '@/services/services';
import { useToast } from 'vue-toastification';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const applicationId = ref(null)
const application = ref(null);

onMounted(async () => {
  applicationId.value = route.params.id
  try {
    const response = await apiService.getDraftApplication(applicationId.value); // Replace with your actual API call
    application.value = response.data;
    // Assuming your API returns the complete form data
  } catch (error) {
    console.error('Error fetching application:', error);
    toast.error('Failed to load application data.');
  }
});

const handleSubmit = async () => {
  try {
    await apiService.updateDraftApplication(applicationId.value, application.value); // or a different API endpoint if needed
    toast.success('Application updated and submitted successfully!');
    router.push('/eoi/drafts');
  } catch (error) {
    console.error('Error submitting application:', error);
    toast.error('Failed to submit application.');
  }

};

const handleCancel = () => {
  router.push('/eoi/drafts');
};
</script>
