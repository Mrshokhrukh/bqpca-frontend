<template>
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4 max-w-3xl">
        <div class="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-8 text-center">
            Application for Expression of Interest
          </h1>
  
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Institution Details Section -->
            <div class="space-y-6 pb-6 border-b border-gray-200">
              <div class="grid gap-6 md:grid-cols-2">
                <div class="col-span-2">
                  <label for="institutionName" class="block text-sm font-medium text-gray-700 mb-1">
                    Name and Address of Institution
                  </label>
                  <textarea
                    id="institutionName"
                    v-model="formData.institutionName"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 resize-none"
                    rows="3"
                  ></textarea>
                </div>
  
                <div class="col-span-2">
                  <label for="correspondenceAddress" class="block text-sm font-medium text-gray-700 mb-1">
                    Correspondence Address
                  </label>
                  <textarea
                    id="correspondenceAddress"
                    v-model="formData.correspondenceAddress"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 resize-none"
                    rows="3"
                  ></textarea>
                </div>
  
                <div>
                  <label for="location" class="block text-sm font-medium text-gray-700 mb-1">
                    Location of Institution
                  </label>
                  <input
                    type="text"
                    id="location"
                    v-model="formData.location"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
  
            <!-- Contact Information Section -->
            <div class="space-y-6 pb-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">Contact Information</h2>
              <div class="grid gap-6 md:grid-cols-2">
                <div>
                  <label for="phoneOffice" class="block text-sm font-medium text-gray-700 mb-1">
                    Phone No. (Office)
                  </label>
                  <input
                    type="tel"
                    id="phoneOffice"
                    v-model="formData.phoneOffice"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
  
                <div>
                  <label for="mobile" class="block text-sm font-medium text-gray-700 mb-1">
                    Mobile
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    v-model="formData.mobile"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
  
                <div>
                  <label for="fax" class="block text-sm font-medium text-gray-700 mb-1">
                    Fax
                  </label>
                  <input
                    type="text"
                    id="fax"
                    v-model="formData.fax"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
  
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    v-model="formData.email"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
  
                <div class="col-span-2">
                  <label for="webpage" class="block text-sm font-medium text-gray-700 mb-1">
                    Webpage (if applicable)
                  </label>
                  <input
                    type="url"
                    id="webpage"
                    v-model="formData.webpage"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
  
            <!-- Course Details Section -->
            <div class="space-y-6 pb-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">Course Details</h2>
              <div class="grid gap-6 md:grid-cols-2">
                <div class="col-span-2">
                  <label for="courseTitle" class="block text-sm font-medium text-gray-700 mb-1">
                    Title of Proposed Medical and Health Courses
                  </label>
                  <input
                    type="text"
                    id="courseTitle"
                    v-model="formData.courseTitle"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
  
                <div>
                  <label for="courseDuration" class="block text-sm font-medium text-gray-700 mb-1">
                    Duration of the Course
                  </label>
                  <input
                    type="text"
                    id="courseDuration"
                    v-model="formData.courseDuration"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
  
                <div>
                  <label for="commencementDate" class="block text-sm font-medium text-gray-700 mb-1">
                    Proposed Date for Course Commencement
                  </label>
                  <input
                    type="date"
                    id="commencementDate"
                    v-model="formData.commencementDate"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
  
                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-3">
                    Type of Program
                  </label>
                  <div class="space-y-3">
                    <div class="flex items-center">
                      <input
                        type="radio"
                        id="diploma"
                        value="Diploma"
                        v-model="formData.programType"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label for="diploma" class="ml-3 text-sm text-gray-700">Diploma</label>
                    </div>
                    <div class="flex items-center">
                      <input
                        type="radio"
                        id="bachelor"
                        value="Bachelor"
                        v-model="formData.programType"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label for="bachelor" class="ml-3 text-sm text-gray-700">Bachelor</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Declaration Section -->
            <div class="space-y-6 pb-6 border-b border-gray-200">
              <div class="bg-gray-50 rounded-lg p-4">
                <h2 class="text-xl font-semibold text-gray-900 mb-3">Declaration</h2>
                <p class="text-sm text-gray-700">
                  I/We certify that the information provided in this application is true, complete, and accurate to the best of my knowledge. I realize that any false, fictitious, or fraudulent statements may be subjected to administrative penalties. I am fully aware and understand the process and requirements of relevant agencies.
                </p>
              </div>
            </div>
  
            <!-- Applicant Details Section -->
            <div class="space-y-6">
              <h2 class="text-xl font-semibold text-gray-900">Applicant Details</h2>
              <div class="grid gap-6 md:grid-cols-2">
                <div>
                  <label for="applicantName" class="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="applicantName"
                    v-model="formData.applicantName"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
  
                <div>
                  <label for="contactNumber" class="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    id="contactNumber"
                    v-model="formData.contactNumber"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
  
                <div class="col-span-2">
                  <label for="applicantSignature" class="block text-sm font-medium text-gray-700 mb-1">
                    Signature(s) of Applicant
                  </label>
                  <input
                    type="text"
                    id="applicantSignature"
                    v-model="formData.applicantSignature"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
  
            <div class="flex justify-end gap-4 pt-6">
      <button
        type="button"
        @click="saveDraft"
        class="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
      >
        Save as Draft
      </button>
      <button
        type="submit"
        class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
      >
        Submit Application
      </button>
    </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref } from 'vue';

const formData = ref({
  institutionName: '',
  correspondenceAddress: '',
  location: '',
  phoneOffice: '',
  mobile: '',
  fax: '',
  email: '',
  webpage: '',
  courseTitle: '',
  courseDuration: '',
  commencementDate: '',
  programType: '',
  applicantSignature: '',
  applicantName: '',
  contactNumber: '',
});

// Load draft data when component mounts
const loadDraft = () => {
  const savedDraft = localStorage.getItem('formDraft');
  if (savedDraft) {
    formData.value = JSON.parse(savedDraft);
    return true;
  }
  return false;
};

// Save current form state as draft
const saveDraft = () => {
  localStorage.setItem('formDraft', JSON.stringify(formData.value));
  alert('Draft saved successfully!');
};

const handleSubmit = () => {
  // Handle form submission logic here
  console.log('Form Data:', formData.value);
  // Clear draft after successful submission
  localStorage.removeItem('formDraft');
  alert('Form submitted! Check the console for data.');
};

// Load draft on component mount
loadDraft();
</script>