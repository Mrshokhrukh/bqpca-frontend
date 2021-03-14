<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <div class="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center"> <!-- Reduced mb-8 to mb-6 here -->
          Application for Expression of Interest
        </h1>

        <form @submit.prevent="handleSubmit" class="space-y-8"> <!-- Increased form space-y-6 to space-y-8 -->
          <!-- Basic Information Section -->
          <div class="space-y-8 pb-6 border-b border-gray-100">
            <!-- space-y-6 to space-y-8, border-gray-200 to border-gray-100 -->
            <h2 class="text-xl font-semibold text-gray-900 mb-10">Basic Information</h2> <!-- mb-8 to mb-10 -->
            <div class="grid gap-6 md:grid-cols-2">
              <div>
                <label for="CID" class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  <!-- Added required-label class -->
                  CID Number
                </label>
                <input type="text" id="CID" v-model="formData.CID"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                <!-- Added px-3 py-2 -->
              </div>

              <div>
                <label for="full_name" class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  <!-- Added required-label class -->
                  Full Name
                </label>
                <input type="text" id="full_name" v-model="formData.full_name"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                <!-- Added px-3 py-2 -->
              </div>

              <div>
                <label for="gender" class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  <!-- Added required-label class -->
                  Gender
                </label>
                <select id="gender" v-model="formData.gender"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2">
                  <!-- Added px-3 py-2 -->
                  <option value="">Select Gender</option>
                  <option v-for="option in genderOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <div>
                <label for="contact_no" class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  <!-- Added required-label class -->
                  Contact Number
                </label>
                <input type="tel" id="contact_no" v-model="formData.contact_no"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                <!-- Added px-3 py-2 -->
              </div>

              <div>
                <label for="email_address" class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  <!-- Added required-label class -->
                  Email Address
                </label>
                <input type="email" id="email_address" v-model="formData.email_address"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                <!-- Added px-3 py-2 -->
              </div>
            </div>
          </div>

          <!-- Institution Details Section -->
          <div class="space-y-8 pb-6 border-b border-gray-100">
            <!-- space-y-6 to space-y-8, border-gray-200 to border-gray-100 -->
            <h2 class="text-xl font-semibold text-gray-900 mb-10">Institution Details</h2> <!-- mb-8 to mb-10 -->
            <div class="grid gap-6 md:grid-cols-2">
              <div class="col-span-2">
                <label for="name_of_institution" class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  <!-- Added required-label class -->
                  Name of Institution
                </label>
                <input type="text" id="name_of_institution" v-model="formData.name_of_institution"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                <!-- Added px-3 py-2 -->
              </div>

              <div>
                <label for="dzongkhag" class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  <!-- Added required-label class -->
                  Dzongkhag
                </label>
                <input type="text" id="dzongkhag" v-model="formData.dzongkhag"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                <!-- Added px-3 py-2 -->
              </div>

              <div>
                <label for="gewog" class="block text-sm font-medium text-gray-700 mb-1">
                  Gewog
                </label>
                <input type="text" id="gewog" v-model="formData.gewog"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                <!-- Added px-3 py-2 -->
              </div>

              <div>
                <label for="village" class="block text-sm font-medium text-gray-700 mb-1">
                  Village
                </label>
                <input type="text" id="village" v-model="formData.village"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                <!-- Added px-3 py-2 -->
              </div>

              <div>
                <label for="chiwog" class="block text-sm font-medium text-gray-700 mb-1">
                  Chiwog
                </label>
                <input type="text" id="chiwog" v-model="formData.chiwog"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                <!-- Added px-3 py-2 -->
              </div>

              <div class="col-span-2">
                <label for="address" class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  <!-- Added required-label class -->
                  Address
                </label>
                <textarea id="address" v-model="formData.address"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 resize-none px-3 py-2"
                  rows="3"></textarea>
              </div>

              <div>
                <label for="website" class="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input type="url" id="website" v-model="formData.website"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                <!-- Added px-3 py-2 -->
              </div>
            </div>
          </div>

          <!-- Course Details Section -->
          <div class="space-y-8 pb-6 border-b border-gray-100">
            <!-- space-y-6 to space-y-8, border-gray-200 to border-gray-100 -->
            <h2 class="text-xl font-semibold text-gray-900 mb-10">Course Details</h2> <!-- mb-8 to mb-10 -->

            <div class="grid gap-6 md:grid-cols-2">
              <div class="col-span-2 flex gap-4">
                <div class="w-1/2">
                  <label for="title_of_course" class="block text-sm font-medium text-gray-700 mb-1 required-label">
                    <!-- Added required-label class -->
                    Title of Course
                  </label>
                  <input type="text" id="title_of_course" v-model="formData.title_of_course"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                  <!-- Added px-3 py-2 -->
                </div>

                <div class="w-1/2">
                  <label for="teaching_institute" class="block text-sm font-medium text-gray-700 mb-1">
                    Teaching Institution
                  </label>
                  <input type="text" id="teaching_institute" v-model="formData.teaching_institute"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                  <!-- Added px-3 py-2 -->
                </div>
              </div>


              <div>
                <label for="course_duration" class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  <!-- Added required-label class -->
                  Course Duration (in months)
                </label>
                <input type="number" id="course_duration" v-model="formData.course_duration"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                <!-- Added px-3 py-2 -->
              </div>

              <div>
                <label for="commencement_date" class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  <!-- Added required-label class -->
                  Commencement Date
                </label>
                <input type="date" id="commencement_date" v-model="formData.commencement_date"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                <!-- Added px-3 py-2 -->
              </div>

              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-3 required-label">
                  <!-- Added required-label class -->
                  Type of Program
                </label>
                <div class="space-y-3">
                  <div class="flex items-center space-x-4">
                    <label v-for="option in programTypeOptions" :key="option.value" class="flex items-center">
                      <input type="radio" :value="option.value" v-model="formData.type_of_programme"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                      <span class="ml-2 text-sm text-gray-700">{{ option.label }}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="col-span-2">
                <label for="supporting_documents" class="block text-sm font-medium text-gray-700 mb-1">
                  Supporting Documents
                </label>
                <input type="file" id="supporting_documents" @change="e => handleFileUpload(e, 'supporting_documents')"
                  accept=".pdf,.doc,.docx"
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>

              <div class="col-span-2">
                <label for="remarks" class="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea id="remarks" v-model="formData.remarks"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 resize-none px-3 py-2"
                  rows="3"></textarea>
              </div>
            </div>
          </div>

          <!-- Head of Institution Section -->
          <div class="space-y-8 pb-6 border-b border-gray-100">
            <!-- space-y-6 to space-y-8, border-gray-200 to border-gray-100 -->
            <h2 class="text-xl font-semibold text-gray-900 mb-10">Head of Institution Details</h2>
            <!-- mb-8 to mb-10 -->
            <div class="grid gap-6 md:grid-cols-2">
              <div>
                <label for="head_of_institution_name"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  <!-- Added required-label class -->
                  Name
                </label>
                <input type="text" id="head_of_institution_name" v-model="formData.head_of_institution_name"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                <!-- Added px-3 py-2 -->
              </div>

              <div>
                <label for="head_of_institution_gender"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  <!-- Added required-label class -->
                  Gender
                </label>
                <select id="head_of_institution_gender" v-model="formData.head_of_institution_gender"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2">
                  <!-- Added px-3 py-2 -->
                  <option value="">Select Gender</option>
                  <option v-for="option in genderOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <div>
                <label for="head_of_institution_phone_number"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  <!-- Added required-label class -->
                  Phone Number
                </label>
                <input type="tel" id="head_of_institution_phone_number"
                  v-model="formData.head_of_institution_phone_number"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                <!-- Added px-3 py-2 -->
              </div>

              <div>
                <label for="head_of_institution_email"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  <!-- Added required-label class -->
                  Email
                </label>
                <input type="email" id="head_of_institution_email" v-model="formData.head_of_institution_email"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                <!-- Added px-3 py-2 -->
              </div>
            </div>
          </div>

          <!-- Declaration Section -->
          <div class="space-y-6 pb-6 border-b border-gray-100">
            <!-- border-gray-200 to border-gray-100 - removed for declaration section -->
            <div class="bg-gray-50 rounded-lg p-4">
              <h2 class="text-xl font-semibold text-gray-900 mb-3">Declaration</h2>
              <div class="space-y-4">
                <p class="text-sm text-gray-700">
                  I/We certify that the information provided in this application is true, complete, and accurate to the
                  best of my knowledge. I realize that any false, fictitious, or fraudulent statements may be subjected
                  to
                  administrative penalties. I am fully aware and understand the process and requirements of relevant
                  agencies.
                </p>
                <div class="flex items-center">
                  <input type="checkbox" id="declaration" v-model="formData.declaration"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label for="declaration" class="ml-2 text-sm text-gray-700">
                    I agree to the above declaration
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Buttons -->
          <div class="flex justify-end gap-4 pt-6">
            <button type="button" @click="saveDraft"
              class="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
              Save as Draft
            </button>
            <!-- Submit button modified for partial submission -->
            <button type="button" @click="submitPartial" :disabled="isSubmitting"
              class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50">
              {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import bmhcService from '@/services/bmhcservices';
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();

const formData = ref({
  // Basic Information
  CID: '',
  full_name: '',
  gender: '',
  contact_no: '',
  email_address: '',

  // Institution Details
  name_of_institution: '',
  country: 'BT', // Default to Bhutan
  gewog: '',
  dzongkhag: '',
  village: '',
  address: '',
  chiwog: '',
  teaching_institute: '', // Ensure this field is not blank
  website: '',

  // Course Details
  title_of_course: '',
  course_duration: null,
  commencement_date: '',
  type_of_programme: '', // 'D' for Diploma or 'B' for Bachelor
  supporting_documents: null, // Handle file upload
  remarks: '',

  // Head of Institution Details
  head_of_institution_name: '',
  head_of_institution_gender: '',
  head_of_institution_phone_number: '',
  head_of_institution_email: '',

  // Declaration
  declaration: false,

  // These fields might be set by the backend, but we'll include them
  review_decision: 'Pending',
  reason_if_rejected: '',

  // DPR related fields (might be filled later)
  dpr_name: '',
  executive_summary: '',
  institute_eoi_supporting_documents: null,
  institute_dpr_remarks: '',
  do_dpr_review_report: '',
  do_dpr_review_summary: '',
  do_dpr_report: null,
  do_dpr_review_decision: 'Pending',
  do_dpr_reason_if_rejected: ''
});

const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// Options for dropdowns
const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'others', label: 'Others' }
];

const programTypeOptions = [
  { value: 'D', label: 'Diploma' },
  { value: 'B', label: 'Bachelor' }
];

// File upload handlers
const handleFileUpload = (event, fieldName) => {
  const file = event.target.files[0];
  if (file) {
    formData.value[fieldName] = file;
  }
};

// Form validation for partial submission - Adjust as needed
const validatePartialForm = () => {
  const requiredFields = {
    CID: 'CID',
    full_name: 'Full Name',
    gender: 'Gender',
    contact_no: 'Contact Number',
    email_address: 'Email Address',
    name_of_institution: 'Name of Institution',
    dzongkhag: 'Dzongkhag',
    address: 'Address',
    title_of_course: 'Title of Course',
    course_duration: 'Course Duration',
    commencement_date: 'Commencement Date',
    type_of_programme: 'Type of Programme',
    head_of_institution_name: 'Head of Institution Name',
    head_of_institution_gender: 'Head of Institution Gender',
    head_of_institution_phone_number: 'Head of Institution Phone Number',
    head_of_institution_email: 'Head of Institution Email',
    teaching_institute: 'Teaching Institute', //Keep this required for now
    // supporting_documents: 'Supporting Documents' //Might not be required for a partial submit
  };

  for (const [field, label] of Object.entries(requiredFields)) {
    if (!formData.value[field]) {
      errorMessage.value = `Please fill in ${label}`;
      return false;
    }
  }

  if (!formData.value.declaration) {
    errorMessage.value = "Please accept the declaration";
    return false;
  }

  return true;
};


// Partial Form Submission
const submitPartial = async () => {
  try {
    isSubmitting.value = true;

    if (!validatePartialForm()) {
      isSubmitting.value = false;
      return;
    }

    //Create an object containing ONLY the fields you want to submit.
    const partialData = {
      CID: formData.value.CID,
      full_name: formData.value.full_name,
      gender: formData.value.gender,
      contact_no: formData.value.contact_no,
      email_address: formData.value.email_address,
      name_of_institution: formData.value.name_of_institution,
      country: formData.value.country, //Keep this
      gewog: formData.value.gewog,
      dzongkhag: formData.value.dzongkhag,
      village: formData.value.village,
      address: formData.value.address,
      chiwog: formData.value.chiwog,
      teaching_institute: formData.value.teaching_institute,
      website: formData.value.website,
      title_of_course: formData.value.title_of_course,
      course_duration: formData.value.course_duration,
      commencement_date: formData.value.commencement_date,
      type_of_programme: formData.value.type_of_programme,
      remarks: formData.value.remarks,
      head_of_institution_name: formData.value.head_of_institution_name,
      head_of_institution_gender: formData.value.head_of_institution_gender,
      head_of_institution_phone_number: formData.value.head_of_institution_phone_number,
      head_of_institution_email: formData.value.head_of_institution_email,
      declaration: formData.value.declaration,
      review_decision: 'Pending', //Keep this
      reason_if_rejected: '',      //Keep this.
    };

    // Handle file upload separately, if needed
    const submitData = new FormData();
    for (const key in partialData) {
      if (partialData[key] !== null && partialData[key] !== undefined) {
        if (key === 'course_duration') {
          submitData.append(key, parseInt(partialData[key])); // Ensure course duration is integer
        }
        else {
          submitData.append(key, partialData[key]);
        }
      }
    }

    if (formData.value.supporting_documents) {
      submitData.append('supporting_documents', formData.value.supporting_documents);
    }


    //Use your API service to send the data.
    const response = await bmhcService.createBmhcInstitute(submitData);


    if (response.data) {
      toast.success('Application saved as draft successfully!');
      clearDraft();
      setTimeout(() => {
        router.push('/dashboard/institutions');
      }, 2000);
    }
  } catch (error) {
    console.error('Error submitting partial form:', error);
    errorMessage.value = 'Error submitting partial application. Please try again.';
    if (error.response?.data) {
      const errors = error.response.data;
      if (typeof errors === 'object') {
        errorMessage.value = Object.entries(errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join(', ');
      } else {
        errorMessage.value = errors;
      }
    }
    toast.error(errorMessage.value, { timeout: 5000 });
  } finally {
    isSubmitting.value = false;
  }
};



// Form submission
const handleSubmit = async () => {
  try {
    isSubmitting.value = true;

    if (!validatePartialForm()) {
      isSubmitting.value = false;
      return;
    }

    // Create FormData object for file upload
    const submitData = new FormData();

    // Append all form fields to FormData
    Object.keys(formData.value).forEach(key => {
      if (formData.value[key] !== null && formData.value[key] !== undefined) {
        if (key === 'supporting_documents' ||
          key === 'institute_eoi_supporting_documents' ||
          key === 'do_dpr_report') {
          if (formData.value[key] instanceof File) {
            submitData.append(key, formData.value[key]);
          }
        } else if (key === 'course_duration') {
          submitData.append(key, parseInt(formData.value[key]));
        } else {
          submitData.append(key, formData.value[key]);
        }
      }
    });

    const response = await bmhcService.createBmhcInstitute(submitData);

    if (response.data) {
      toast.success('Application submitted successfully!');
      clearDraft();
      setTimeout(() => {
        router.push('/admin/institutions/health_certification/dashboard');
      }, 1500);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    let message = 'Error submitting application. Please try again.'; // Default error message
    if (error.response?.data) {
      const errors = error.response.data;
      if (typeof errors === 'object') {
        message = Object.entries(errors)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join(', ');
      } else {
        message = errors;
      }
    }
    toast.error(message, { timeout: 5000 }); // Error toast with longer timeout
  } finally {
    isSubmitting.value = false;
  }
};

// Draft management
const saveDraft = () => {
  const draftData = { ...formData.value };
  // Remove file objects before saving to localStorage
  ['supporting_documents', 'institute_eoi_supporting_documents', 'do_dpr_report'].forEach(key => {
    delete draftData[key];
  });
  localStorage.setItem('eoiFormDraft', JSON.stringify(draftData));
  toast.success('Draft saved successfully!');
  setTimeout(() => {
    successMessage.value = '';
  }, 3000);
};

const clearDraft = () => {
  localStorage.removeItem('eoiFormDraft');
};

// Load draft on component mount
onMounted(() => {
  const savedDraft = localStorage.getItem('eoiFormDraft');
  if (savedDraft) {
    try {
      const parsedDraft = JSON.parse(savedDraft);
      Object.keys(parsedDraft).forEach(key => {
        if (!['supporting_documents', 'institute_eoi_supporting_documents', 'do_dpr_report'].includes(key)) {
          formData.value[key] = parsedDraft[key];
        }
      });
    } catch (error) {
      console.error('Error loading draft:', error);
      clearDraft();
    }
  }
});

defineExpose({
  formData,
  isSubmitting,
  errorMessage,
  successMessage,
  genderOptions,
  programTypeOptions,
  handleSubmit,
  handleFileUpload,
  saveDraft
});
</script>

<style scoped>
/* Optional: Add custom styles here */
.required-field::after {
  content: " *";
  color: #dc2626;
}
</style>
