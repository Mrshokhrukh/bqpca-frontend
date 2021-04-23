<template>
  <div class="mx-auto px-4 py-8">
    <!-- Not Available Status -->
    <div
      v-if="reviewDecision === 'Regretted'"
      class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
      role="alert"
    >
      <p class="font-bold">Application Status: Not Available</p>
      <p>You cannot submit a DPR until your EOI application has been approved.</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading">Loading...</div>

    <!-- Pending Status -->
    <div
      v-else-if="reviewDecision === 'Pending'"
      class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
      role="alert"
    >
      <p class="font-bold">Application Status: Pending</p>
      <p>
        Your application is currently under review. You will be notified once a decision has been
        made.
      </p>
    </div>

    <!-- Approved Status with Form -->
    <div v-else-if="reviewDecision === 'Approved'">
      <!-- Form Header -->
      <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
        <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">Detailed Project Proposal</h2>
        <p class="text-gray-600 text-center max-w-2xl mx-auto">
          Prepare your Detailed Project Proposal for establishing an Educational Institution.
        </p>
      </div>

      <!-- Main Form Card -->
      <div class="bg-white border rounded-xl shadow-sm p-6">
        <!-- Applicant Details Section -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">1. Applicant Details</h3>
          <p class="mt-1 text-sm text-gray-500">Enter the details of the applicant.</p>
        </div>
        <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="cid" class="block text-sm font-medium text-gray-700">CID:</label>
            <input
              type="text"
              id="cid"
              v-model="formData.cid"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              disabled
            />
          </div>
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700">Full Name:</label>
            <input
              type="text"
              id="fullName"
              v-model="formData.full_name"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              disabled
            />
          </div>
          <div>
            <label for="gender" class="block text-sm font-medium text-gray-700">Gender:</label>
            <input
              type="text"
              id="gender"
              v-model="formData.gender"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              disabled
            />
          </div>
          <div>
            <label for="contactNo" class="block text-sm font-medium text-gray-700">Contact No.:</label>
            <input
              type="text"
              id="contactNo"
              v-model="formData.contact_no"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div>
            <label for="emailAddress" class="block text-sm font-medium text-gray-700">Email Address:</label>
            <input
              type="email"
              id="emailAddress"
              v-model="formData.email_address"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
        </div>

        <!-- Institute Establishment Proposal Details Section -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">2. Institute Establishment Proposal Details</h3>
          <p class="mt-1 text-sm text-gray-500">Enter the details of the proposed institution.</p>
        </div>
        <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="institutionName" class="block text-sm font-medium text-gray-700">Name of Institution:</label>
            <input
              type="text"
              id="institutionName"
              v-model="formData.institution_name"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              disabled
            />
          </div>
          <div>
            <label for="country" class="block text-sm font-medium text-gray-700">Country:</label>
            <input
              type="text"
              id="country"
              v-model="formData.country"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              disabled
            />
          </div>
          <div>
            <label for="gewogState" class="block text-sm font-medium text-gray-700">Gewog/State:</label>
            <input
              type="text"
              id="gewogState"
              v-model="formData.gewog_state"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              disabled
            />
          </div>
          <div>
            <label for="chiwog" class="block text-sm font-medium text-gray-700">Chiwog/Chiwog:</label>
            <input
              type="text"
              id="chiwog"
              v-model="formData.chiwog"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              disabled
            />
          </div>
          <div>
            <label for="teachingInstitute" class="block text-sm font-medium text-gray-700">Teaching Institute:</label>
            <input
              type="text"
              id="teachingInstitute"
              v-model="formData.teaching_institute"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              disabled
            />
          </div>
          <div>
            <label for="courseTitle" class="block text-sm font-medium text-gray-700">Title of the Course:</label>
            <input
              type="text"
              id="courseTitle"
              v-model="formData.course_title"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              disabled
            />
          </div>
          <div>
            <label for="courseDuration" class="block text-sm font-medium text-gray-700">Course Duration:</label>
            <input
              type="text"
              id="courseDuration"
              v-model="formData.course_duration"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              disabled
            />
          </div>
          <div>
            <label for="commencementDate" class="block text-sm font-medium text-gray-700">Commencement Date:</label>
            <input
              type="text"
              id="commencementDate"
              v-model="formData.commencement_date"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              disabled
            />
          </div>
          <div>
            <label for="programmeType" class="block text-sm font-medium text-gray-700">Type of Programme:</label>
            <input
              type="text"
              id="programmeType"
              v-model="formData.programme_type"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              disabled
            />
          </div>
        </div>

        <!-- Head of Institution Details Section -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">3. Head of Institution Details</h3>
          <p class="mt-1 text-sm text-gray-500">Enter the details of the head of the institution.</p>
        </div>
        <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="headName" class="block text-sm font-medium text-gray-700">Name:</label>
            <input
              type="text"
              id="headName"
              v-model="formData.head_name"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              required
            />
          </div>
          <div>
            <label for="headGender" class="block text-sm font-medium text-gray-700">Gender:</label>
            <input
              type="text"
              id="headGender"
              v-model="formData.head_gender"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              required
            />
          </div>
          <div>
            <label for="headPhone" class="block text-sm font-medium text-gray-700">Phone Number:</label>
            <input
              type="text"
              id="headPhone"
              v-model="formData.head_phone"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              required
            />
          </div>
          <div>
            <label for="headEmail" class="block text-sm font-medium text-gray-700">Email Address:</label>
            <input
              type="email"
              id="headEmail"
              v-model="formData.head_email"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              required
            />
          </div>
        </div>

        <!-- DPR Details Section -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">4. DPR Details</h3>
          <p class="mt-1 text-sm text-gray-500">Describe the DPR details.</p>
        </div>
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="dprName" class="block text-sm font-medium text-gray-700">DPR Name:</label>
            <input
              id="dprName"
              v-model="formData.dpr_name"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              required
            />
          </div>
          <div>
            <label for="executiveSummary" class="block text-sm font-medium text-gray-700">Executive Summary:</label>
            <textarea
              id="executiveSummary"
              v-model="formData.executive_summary"
              rows="5"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              required
            ></textarea>
          </div>
          <div>
            <label for="supportingDocuments" class="block text-sm font-medium text-gray-700">Supporting Documents (PDF only):</label>
            <input
              type="file"
              id="supportingDocuments"
              @change="handleFileUpload('supporting_documents')"
              accept="application/pdf"
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div>
            <label for="remarks" class="block text-sm font-medium text-gray-700">Remarks:</label>
            <textarea
              id="remarks"
              v-model="formData.remarks"
              rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            ></textarea>
          </div>
        </div>

        <!-- Declaration Checkbox -->
        <div class="p-8">
          <label class="flex items-center">
            <input
              type="checkbox"
              v-model="formData.declaration"
              class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">I declare that all information provided is accurate.</span>
          </label>
        </div>

        <!-- Action Buttons -->
        <div class="mt-12 flex justify-end space-x-4 p-8">
          <button
            type="button"
            @click="handleSaveDraft"
            class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Save as Draft
          </button>
          <button
            type="button"
            @click="handleSubmit"
            class="px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            :disabled="!formData.declaration"
          >
            Submit Application
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiService from '@/services/epcServices';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const router = useRouter();
const toast = useToast();

const instituteId = ref(null);
const reviewDecision = ref('');
const isLoading = ref(true);
const isSubmitting = ref(false);

const formData = ref({
  cid: '',
  full_name: '',
  gender: '',
  contact_no: '',
  email_address: '',
  institution_name: '',
  country: '',
  gewog_state: '',
  chiwog: '',
  teaching_institute: '',
  course_title: '',
  course_duration: '',
  commencement_date: '',
  programme_type: '',
  head_name: '',
  head_gender: '',
  head_phone: '',
  head_email: '',
  dpr_name: '',
  executive_summary: '',
  supporting_documents: null,
  remarks: '',
  declaration: false,
});

onMounted(async () => {
  const userString = localStorage.getItem('user');
  if (!userString) {
    console.error('No user data found in localStorage.');
    isLoading.value = false;
    return;
  }

  let userObject;
  try {
    userObject = JSON.parse(userString);
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    isLoading.value = false;
    return;
  }

  if (!userObject || !userObject.cid) {
    console.error('User object is invalid or cid is missing:', userObject);
    isLoading.value = false;
    return;
  }
  const userCID = userObject.cid;

  try {
    const response = await apiService.getEpcInstitutes();
    const institutes = response.data.results;
    const matchedInstitute = institutes.find((institute) => institute.CID === userCID);

    if (!matchedInstitute) {
      console.error("No institute found matching the user's CID.");
      isLoading.value = false;
      return;
    }

    instituteId.value = matchedInstitute.id;
    reviewDecision.value = matchedInstitute.review_decision;

    if (reviewDecision.value === 'Approved') {
      await fetchInstituteData();
    }
  } catch (error) {
    console.error('Error fetching institute data:', error);
    toast.error('Error fetching institute data. Please try again.', { timeout: 3000 });
  } finally {
    isLoading.value = false;
  }
});

const fetchInstituteData = async () => {
  try {
    const response = await apiService.getEpcInstitute(instituteId.value);
    if (response.data) {
      formData.value.cid = response.data.CID || '';
      formData.value.full_name = response.data.full_name || '';
      formData.value.gender = response.data.gender || '';
      formData.value.contact_no = response.data.contact_no || '';
      formData.value.email_address = response.data.email_address || '';
      formData.value.institution_name = response.data.name_of_institution || '';
      formData.value.country = response.data.country || '';
      formData.value.gewog_state = response.data.gewog_state || '';
      formData.value.chiwog = response.data.chiwog || '';
      formData.value.teaching_institute = response.data.teaching_institute || '';
      formData.value.course_title = response.data.course_title || '';
      formData.value.course_duration = response.data.course_duration || '';
      formData.value.commencement_date = response.data.commencement_date || '';
      formData.value.programme_type = response.data.programme_type || '';
      formData.value.head_name = response.data.head_name || '';
      formData.value.head_gender = response.data.head_gender || '';
      formData.value.head_phone = response.data.head_phone || '';
      formData.value.head_email = response.data.head_email || '';
      formData.value.dpr_name = response.data.dpr_name || '';
      formData.value.executive_summary = response.data.executive_summary || '';
      formData.value.remarks = response.data.remarks || '';
    }
  } catch (error) {
    console.error('Error fetching institute data:', error);
    toast.error('Error fetching institute data. Please try again.', { timeout: 3000 });
  }
};

const handleFileUpload = (fieldName) => (event) => {
  const file = event.target.files[0];
  if (file && file.type === 'application/pdf') {
    formData.value[fieldName] = file;
  } else {
    toast.error('Please upload a PDF file.', { timeout: 3000 });
    event.target.value = '';
  }
};

const handleSubmit = async () => {
  if (!instituteId.value) {
    toast.error('Institute ID is missing. Please refresh the page.', { timeout: 3000 });
    return;
  }
  if (!formData.value.dpr_name) {
    toast.error('Please enter the DPR name.', { timeout: 3000 });
    return;
  }
  if (!formData.value.executive_summary) {
    toast.error('Please enter the executive summary.', { timeout: 3000 });
    return;
  }
  if (!formData.value.declaration) {
    toast.error('Please check the declaration box.', { timeout: 3000 });
    return;
  }

  const submitData = new FormData();
  submitData.append('cid', formData.value.cid);
  submitData.append('full_name', formData.value.full_name);
  submitData.append('gender', formData.value.gender);
  submitData.append('contact_no', formData.value.contact_no);
  submitData.append('email_address', formData.value.email_address);
  submitData.append('name_of_institution', formData.value.institution_name);
  submitData.append('country', formData.value.country);
  submitData.append('gewog_state', formData.value.gewog_state);
  submitData.append('chiwog', formData.value.chiwog);
  submitData.append('teaching_institute', formData.value.teaching_institute);
  submitData.append('course_title', formData.value.course_title);
  submitData.append('course_duration', formData.value.course_duration);
  submitData.append('commencement_date', formData.value.commencement_date);
  submitData.append('programme_type', formData.value.programme_type);
  submitData.append('head_name', formData.value.head_name);
  submitData.append('head_gender', formData.value.head_gender);
  submitData.append('head_phone', formData.value.head_phone);
  submitData.append('head_email', formData.value.head_email);
  submitData.append('dpr_name', formData.value.dpr_name);
  submitData.append('executive_summary', formData.value.executive_summary);
  if (formData.value.supporting_documents) {
    submitData.append('supporting_documents', formData.value.supporting_documents);
  }
  submitData.append('remarks', formData.value.remarks);

  try {
    isSubmitting.value = true;
    const response = await apiService.patchEpcInstitute(instituteId.value, submitData);
    if (response.status === 200 || response.status === 204) {
      toast.success('DPR submitted successfully!');
      setTimeout(() => {
        router.push('/admin/institutions/engineering_certification/dashboard');
      }, 1500);
    } else {
      toast.error(`Failed to submit DPR. Status: ${response.status}`, { timeout: 5000 });
    }
  } catch (error) {
    console.error('Error submitting DPR data:', error);
    toast.error('Error submitting DPR data. Please try again.', { timeout: 5000 });
  } finally {
    isSubmitting.value = false;
  }
};

const handleSaveDraft = async () => {
  if (!instituteId.value) {
    toast.error('Institute ID is missing. Please refresh the page.', { timeout: 3000 });
    return;
  }

  const draftData = new FormData();
  draftData.append('cid', formData.value.cid);
  draftData.append('full_name', formData.value.full_name);
  draftData.append('gender', formData.value.gender);
  draftData.append('contact_no', formData.value.contact_no);
  draftData.append('email_address', formData.value.email_address);
  draftData.append('name_of_institution', formData.value.institution_name);
  draftData.append('country', formData.value.country);
  draftData.append('gewog_state', formData.value.gewog_state);
  draftData.append('chiwog', formData.value.chiwog);
  draftData.append('teaching_institute', formData.value.teaching_institute);
  draftData.append('course_title', formData.value.course_title);
  draftData.append('course_duration', formData.value.course_duration);
  draftData.append('commencement_date', formData.value.commencement_date);
  draftData.append('programme_type', formData.value.programme_type);
  draftData.append('head_name', formData.value.head_name);
  draftData.append('head_gender', formData.value.head_gender);
  draftData.append('head_phone', formData.value.head_phone);
  draftData.append('head_email', formData.value.head_email);
  draftData.append('dpr_name', formData.value.dpr_name);
  draftData.append('executive_summary', formData.value.executive_summary);
  if (formData.value.supporting_documents) {
    draftData.append('supporting_documents', formData.value.supporting_documents);
  }
  draftData.append('remarks', formData.value.remarks);

  try {
    isSubmitting.value = true;
    const response = await apiService.patchEpcInstitute(instituteId.value, draftData);
    if (response.status >= 200 && response.status < 300) {
      toast.success('Draft saved successfully!');
    } else {
      toast.error(`Failed to save draft. Status: ${response.status}`, { timeout: 5000 });
    }
  } catch (error) {
    console.error('Error saving draft:', error);
    toast.error('Error saving draft. Please try again.', { timeout: 5000 });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
button:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>