<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Personal Information Section -->
    <div class="bg-white border p-6 rounded-lg shadow-sm">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold text-gray-900">Personal Information</h3>
        <button type="button" @click="fetchDCRCData"
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
          :disabled="isLoadingDCRC || !isCIDValid">
          {{ isLoadingDCRC ? 'Fetching...' : 'Fetch from DCRC' }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- CID No. -->
        <div>
          <label for="cid" class="block text-sm font-medium text-gray-700">CID No.</label>
          <input type="text" id="cid" v-model="form.cid_no" @input="validateCID"
            class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            placeholder="Enter 11-digit CID" />
        </div>

        <!-- Full Name -->
        <div>
          <label for="full_name" class="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" id="full_name" v-model="form.applicants_name" readonly
            class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
        </div>

        <!-- Date of Birth -->
        <div>
          <label for="date_of_birth" class="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input type="text" id="date_of_birth" v-model="form.date_of_birth" readonly
            class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
        </div>

        <!-- Contact Number -->
        <div>
          <label for="contact_number" class="block text-sm font-medium text-gray-700 required">Contact Number</label>
          <input type="tel" id="contact_number" v-model="form.contact_no" pattern="[0-9]{8}" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
          <p class="mt-1 text-sm text-gray-500">Must be 8 digits</p>
        </div>

        <!-- Email Address -->
        <div>
          <label for="email_address" class="block text-sm font-medium text-gray-700">Email Address</label>
          <input type="email" id="email_address" v-model="form.email_address" :readonly="!!form.email_address" :class="['mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
            { 'bg-gray-50': !!form.email_address }]" />
        </div>

        <!-- Gender -->
        <div>
          <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
          <input type="text" id="gender" :value="genderDisplay" readonly
            class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
          <input type="hidden" v-model="form.gender" />
        </div>

        <!-- Dzongkhag -->
        <div>
          <label for="dzongkhag" class="block text-sm font-medium text-gray-700">Dzongkhag</label>
          <input type="text" id="dzongkhag" v-model="form.dzongkhag" readonly
            class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
        </div>

        <!-- Gewog -->
        <div>
          <label for="gewog" class="block text-sm font-medium text-gray-700">Gewog</label>
          <input type="text" id="gewog" v-model="form.gewog" readonly
            class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
        </div>

        <!-- Village -->
        <div>
          <label for="village" class="block text-sm font-medium text-gray-700">Village</label>
          <input type="text" id="village" v-model="form.village" readonly
            class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
        </div>
      </div>
    </div>

    <!-- Education Details Section -->
    <div class="bg-white border p-6 rounded-lg shadow-sm">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-semibold text-gray-900">Education Details</h3>
        <button type="button" @click="fetchRUBData" :disabled="!form.from_in_country || isLoadingRUB"
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isLoadingRUB ? 'Fetching...' : 'Fetch from RUB' }}
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- From in-country? -->
        <div>
          <label class="block text-sm font-medium text-gray-700 required">From in-country?</label>
          <div class="mt-2 space-x-4">
            <label class="inline-flex items-center">
              <input type="radio" v-model="form.from_in_country" :value="true" required
                class="form-radio text-primary" />
              <span class="ml-2">Yes</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" v-model="form.from_in_country" :value="false" required
                class="form-radio text-primary" />
              <span class="ml-2">No</span>
            </label>
          </div>
        </div>

        <!-- Course Title -->
        <div>
          <label for="course_title" class="block text-sm font-medium text-gray-700 required">Course Title</label>
          <input type="text" id="course_title" v-model="form.course_title" required :readonly="form.from_in_country"
            :class="['mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
              { 'bg-gray-50': form.from_in_country }]" />
        </div>

        <!-- Qualification -->
        <div>
          <label for="qualification" class="block text-sm font-medium text-gray-700 required">Qualification</label>
          <select id="qualification" v-model="form.qualification" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2">
            <option value="" disabled>Select Qualification</option>
            <option v-for="qual in qualificationOptions" :key="qual.value" :value="qual.value">
              {{ qual.label }}
            </option>
          </select>
        </div>

        <!-- Type of Course -->
        <div>
          <label for="type_of_course" class="block text-sm font-medium text-gray-700 required">Type of Course</label>
          <select id="type_of_course" v-model="form.type_of_course" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2">
            <option value="" disabled>Select Course Type</option>
            <option v-for="type in courseTypeOptions" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>
        </div>

        <!-- Duration of Course -->
        <div>
          <label for="duration_of_course" class="block text-sm font-medium text-gray-700 required">Duration of Course
            (Years)</label>
          <input type="number" id="duration_of_course" v-model="form.duration_of_course" min="1" max="10" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
        </div>

        <!-- Name of Institute -->
        <div>
          <label for="name_of_institute" class="block text-sm font-medium text-gray-700 required">Name of
            Institute</label>
          <input type="text" id="name_of_institute" v-model="form.name_of_institute" required
            :readonly="form.from_in_country" :class="['mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
              { 'bg-gray-50': form.from_in_country }]" />
        </div>

        <!-- Name of University -->
        <div>
          <label for="name_of_university" class="block text-sm font-medium text-gray-700 required">Name of
            University</label>
          <input type="text" id="name_of_university" v-model="form.name_of_university" required
            :readonly="form.from_in_country" :class="['mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
              { 'bg-gray-50': form.from_in_country }]" />
        </div>

        <!-- Student ID No. -->
        <div>
          <label for="student_id_no" class="block text-sm font-medium text-gray-700 required">Student ID No.</label>
          <input type="text" id="student_id_no" v-model="form.student_id_no" required :readonly="form.from_in_country"
            :class="['mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
              { 'bg-gray-50': form.from_in_country }]" />
        </div>

        <!-- Year of Completion -->
        <div>
          <label for="year_of_completion" class="block text-sm font-medium text-gray-700 required">Year of
            Completion</label>
          <input type="number" id="year_of_completion" v-model="form.year_of_completion" :min="minYear"
            :max="currentYear" required :readonly="form.from_in_country" :class="['mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
              { 'bg-gray-50': form.from_in_country }]" />
        </div>

        <!-- Website -->
        <div>
          <label for="website" class="block text-sm font-medium text-gray-700">Website</label>
          <input type="url" id="website" v-model="form.website" placeholder="https://" pattern="https?://.+"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
        </div>

        <!-- Location -->
        <div>
          <label for="location" class="block text-sm font-medium text-gray-700 required">Location</label>
          <input type="text" id="location" v-model="form.location" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2" />
        </div>

        <!-- Country -->
        <div>
          <label for="country" class="block text-sm font-medium text-gray-700 required">Country</label>
          <input type="text" id="country" v-model="form.country" required :readonly="form.from_in_country" :class="['mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
            { 'bg-gray-50': form.from_in_country }]" />
        </div>
      </div>
    </div>

    <!-- Supporting Documents Section -->
    <div class="bg-white border p-6 rounded-lg shadow-sm">
      <h3 class="text-xl font-semibold mb-4 text-gray-900">Supporting Documents</h3>

      <div class="space-y-6">
        <!-- Degree Certificate -->
        <div v-if="!form.from_in_country">
          <label class="block text-sm font-medium text-gray-700 required">Degree Certificate</label>
          <div class="mt-2">
            <FileUpload v-model="form.degree_certificate" accept=".pdf" :max-size="5" required />
            <p class="mt-1 text-sm text-gray-500">PDF only, max 5MB</p>
          </div>
        </div>

        <!-- Academic Transcript -->
        <div v-if="!form.from_in_country">
          <label class="block text-sm font-medium text-gray-700 required">Academic Transcript</label>
          <div class="mt-2">
            <FileUpload v-model="form.academic_transcript" accept=".pdf" :max-size="5" required />
            <p class="mt-1 text-sm text-gray-500">PDF only, max 5MB</p>
          </div>
        </div>

        <!-- Passport Size Photo -->
        <div>
          <label class="block text-sm font-medium text-gray-700 required">Passport Size Photo</label>
          <div class="mt-2">
            <FileUpload v-model="form.passport_photo" accept=".jpg,.jpeg,.png,.webp" :max-size="2" required />
            <p class="mt-1 text-sm text-gray-500">JPEG/PNG/WEBP only, max 2MB, passport format</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Remarks and Declaration Section -->
    <div class="bg-white border p-6 rounded-lg shadow-sm space-y-6">
      <!-- Remarks -->
      <div>
        <label for="remarks" class="block text-sm font-medium text-gray-700">Remarks</label>
        <textarea id="remarks" v-model="form.remarks" rows="3"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"></textarea>
      </div>

      <!-- Declaration -->
      <div class="flex items-start">
        <div class="flex items-center h-5">
          <input type="checkbox" id="declaration" v-model="form.declaration" required
            class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
        </div>
        <div class="ml-3 text-sm">
          <label for="declaration" class="font-medium text-gray-700">Declaration</label>
          <p class="text-gray-500">I declare that all the information provided is true and accurate to the best of my
            knowledge.</p>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end space-x-4">
      <button type="button" @click="$emit('close-modal')"
        class="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
        Cancel
      </button>
      <button type="button" @click="handleSaveAsDraft"
        class="px-6 py-3 border border-primary rounded-md text-primary bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
        Save as Draft
      </button>
      <button type="submit" :disabled="!form.declaration || isSubmitting"
        class="px-6 py-3 bg-primary text-white rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed">
        {{ isSubmitting ? 'Submitting...' : 'Submit' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import apiService from '@/services/services';
import FileUpload from '@/components/common/FileUpload.vue';
import { useToast } from 'vue-toastification';

const { user } = useAuthStore();
const toast = useToast();

const isLoadingDCRC = ref(false);
const isLoadingRUB = ref(false);
const isSubmitting = ref(false);
const currentYear = new Date().getFullYear();
const minYear = currentYear - 50;

// Remove hardcoded options
const qualificationOptions = ref([]);
const courseTypeOptions = ref([]);

const props = defineProps({
  initialData: Object,
  mode: { type: String, default: 'create' }
});

const form = reactive({
  // Personal Information
  cid_no: '',
  applicants_name: '',
  date_of_birth: '',
  contact_no: '', // Changed from contact_number
  email_address: user.email,
  gender: '',
  dzongkhag: '',
  gewog: '',
  village: '',

  // Education Details
  from_in_country: null, // Changed from study_in_country
  course_title: '',
  qualification: '',
  type_of_course: '',
  duration_of_course: '',
  name_of_institute: '',
  name_of_university: '',
  student_id_no: '',
  year_of_completion: '',
  website: '',
  location: '',
  country: '',

  // Documents
  degree_certificate: null,
  academic_transcript: null,
  passport_photo: null,

  // Additional Fields
  remarks: '',
  declaration: false,
  status: 'applied',
  ...(props.initialData ? props.initialData : {})
});

// Computed property to check if CID is valid
const isCIDValid = computed(() => {
  return /^\d{11}$/.test(form.cid_no);
});

// Computed property to transform gender
const genderDisplay = computed(() => {
  const genderMap = {
    'M': 'Male',
    'F': 'Female'
  };
  return genderMap[form.gender] || '';
});

// Watch for study_in_country changes
watch(() => form.from_in_country, (newValue) => {
  if (newValue === true) {
    form.country = 'Bhutan';
  } else {
    form.country = '';
  }
});

// Fetch dropdown options on component mount
onMounted(async () => {
  try {
    const [qualificationsResponse, courseTypesResponse] = await Promise.all([
      apiService.getQualifications(),
      apiService.getTypesOfCourse()
    ]);

    // Access the `results` array from the response
    qualificationOptions.value = qualificationsResponse.data.results.map(qual => ({
      value: qual.id, // Assuming the API returns `id` and `name`
      label: qual.name
    }));

    courseTypeOptions.value = courseTypesResponse.data.results.map(type => ({
      value: type.id, // Assuming the API returns `id` and `name`
      label: type.name
    }));
  } catch (error) {
    toast.error('Failed to fetch dropdown options', 'error');
    console.error('Error fetching dropdown options:', error);
  }
});

const fetchDCRCData = async () => {
  if (!isCIDValid.value) {
    toast.error('Please enter a valid 11-digit CID');
    return;
  }

  isLoadingDCRC.value = true;
  try {
    const response = await apiService.fetchCitizenDetails(form.cid_no);

    // Log the API response
    console.log('API Response:', response);

    // Helper function to convert dd/mm/yyyy to yyyy-mm-dd
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const [day, month, year] = dateString.split('/');
      return `${year}-${month}-${day}`;
    };

    // Assign the response data to the form
    Object.assign(form, {
      cid_no: response.data.cid_no, // Access `data` from the response
      applicants_name: response.data.applicants_name,
      date_of_birth: formatDate(response.data.date_of_birth), // Format the date
      gender: response.data.gender,
      dzongkhag: response.data.dzongkhag,
      gewog: response.data.gewog,
      village: response.data.village
    });

    // Log the updated form object
    console.log('Updated Form:', form);

    toast.success('DCRC data fetched successfully');
  } catch (error) {
    toast.error('Failed to fetch DCRC data');
    console.error('Error fetching DCRC data:', error);
  } finally {
    isLoadingDCRC.value = false;
  }
};

const fetchRUBData = async () => {
  isLoadingRUB.value = true;
  try {
    const response = await apiService.getRUBData(form.student_id_no);
    Object.assign(form, {
      course_title: response.course_title,
      qualification: response.qualification,
      name_of_institute: response.institute,
      name_of_university: response.university,
      year_of_completion: response.completion_year
    });
    toast.success('RUB data fetched successfully', 'success');
  } catch (error) {
    toast.error('Failed to fetch RUB data', 'error');
    console.error('Error fetching RUB data:', error);
  } finally {
    isLoadingRUB.value = false;
  }
};
const formatDate = (dateString) => {
  if (!dateString) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', dateString);
    return '';
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const handleSubmit = async () => {
  try {
    if (props.mode === 'edit') {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (['degree_certificate', 'academic_transcript', 'passport_photo'].includes(key)) {
          if (value?.file instanceof File) {
            const fieldName = key === 'passport_photo' ? 'passport_size_photo' : key;
            formData.append(fieldName, value.file);
          }
        }
        else if (key === 'date_of_birth' && value) {
          formData.append(key, formatDate(value)); // Use the corrected formatDate function
        }
        else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        }
        else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      await apiService.updateRecognitionOfQualification(props.initialData.id, formData);
      toast.success('Application updated successfully');
    } else {
      if (!form.declaration) {
        toast.error('Please accept the declaration', 'error');
        return;
      }

      isSubmitting.value = true;
      const formData = new FormData();

      // Append personal information
      Object.entries(form).forEach(([key, value]) => {
        if (['degree_certificate', 'academic_transcript', 'passport_photo'].includes(key)) {
          if (value?.file instanceof File) {
            const fieldName = key === 'passport_photo' ? 'passport_size_photo' : key;
            formData.append(fieldName, value.file);
          }
        }
        else if (key === 'date_of_birth' && value) {
          formData.append(key, formatDate(value)); // Use the corrected formatDate function
        }
        else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        }
        else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      try {
        const response = await apiService.createRecognitionOfQualification(formData);

        if (response.status === 201) {
          toast.success('Application submitted successfully');
          emit('application-submitted');
        }
      } catch (error) {
        console.error('Error submitting form:', error.response?.data || error);
        const errorMessage = error.response?.data?.message || 'Failed to submit application';
        toast.error(errorMessage);
      } finally {
        isSubmitting.value = false;
      }
    };
    emit('submitted');
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};

// Handle saving as draft
const handleSaveAsDraft = async () => {
  form.status = 'applied';
  await handleSubmit();
};

const emit = defineEmits(['application-submitted', 'close-modal']);
</script>

<style scoped>
.required::after {
  content: " *";
  color: #ef4444;
}
</style>
