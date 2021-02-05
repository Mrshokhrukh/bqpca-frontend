<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Payment Modal -->
    <PaymentModal ref="paymentModal" @payment-completed="onPaymentCompleted" @close="onPaymentModalClose" />

    <!-- Form Header -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        {{ selectedType === 'cid' ? 'CID Holder Registration' : 'Non-CID Holder Registration' }}
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Please fill in all required fields marked with an asterisk (<span class="text-red-600">*</span>). Ensure all
        information provided is accurate and
        up-to-date.
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="bg-white border rounded-xl shadow-sm">
      <!-- Form Sections -->
      <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
        <h3 class="text-lg font-semibold text-gray-900">Personal Information</h3>
        <p class="mt-1 text-sm text-gray-500">Basic details needed for registration</p>
      </div>

      <div class="p-8">
        <!-- Personal Information Fields in 4-column grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">

          <!-- Dynamic Fields based on type -->
          <template v-if="selectedType === 'cid'">
            <!-- CID Fields -->
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">CID No.</label>
              <input v-model="localFormData.cid_no" type="number" maxlength="11"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                placeholder="Enter CID number" @input="fetchDCRCData" />
              <span v-if="errors.cid_no" class="text-sm text-red-500 mt-1">{{ errors.cid_no }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Dzongkhag</label>
              <input type="text" v-model="localFormData.dzongkhag"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
              <span v-if="errors.dzongkhag" class="text-sm text-red-500 mt-1">{{ errors.dzongkhag }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Gewog</label>
              <input type="text" v-model="localFormData.gewog"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
              <span v-if="errors.gewog" class="text-sm text-red-500 mt-1">{{ errors.gewog }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Village</label>
              <input type="text" v-model="localFormData.village"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
              <span v-if="errors.village" class="text-sm text-red-500 mt-1">{{ errors.village }}</span>
            </div>
          </template>

          <template v-else>
            <!-- Non-CID Fields -->
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Nationality</label>
              <select v-model="localFormData.nationality"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
                <option value="">SELECT NATIONALITY</option>
                <option v-for="country in countries" :key="country" :value="country">
                  {{ country }}
                </option>
              </select>
              <span v-if="errors.nationality" class="text-sm text-red-500 mt-1">{{ errors.nationality }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Email Address</label>
              <input v-model="localFormData.email_address" type="email"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                placeholder="Email Address" />
              <span v-if="errors.email_address" class="text-sm text-red-500 mt-1">{{ errors.email_address }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Identity / Work Permit No</label>
              <input v-model="localFormData.workPermitNo" type="text"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                placeholder="Identity / Work Permit No" />
              <span v-if="errors.workPermitNo" class="text-sm text-red-500 mt-1">{{ errors.workPermitNo }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Country</label>
              <select v-model="localFormData.country"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
                <option value="">SELECT COUNTRY</option>
                <option v-for="country in countries" :key="country" :value="country">
                  {{ country }}
                </option>
              </select>
              <span v-if="errors.country" class="text-sm text-red-500 mt-1">{{ errors.country }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700">City</label>
              <input v-model="localFormData.city" type="text"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                placeholder="City" />
              <span v-if="errors.city" class="text-sm text-red-500 mt-1">{{ errors.city }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700">State</label>
              <input v-model="localFormData.state" type="text"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                placeholder="State" />
              <span v-if="errors.state" class="text-sm text-red-500 mt-1">{{ errors.state }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Mobile Number</label>
              <input v-model="localFormData.mobileNumber" type="tel"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                placeholder="Mobile Number" />
              <span v-if="errors.mobileNumber" class="text-sm text-red-500 mt-1">{{ errors.mobileNumber }}</span>
            </div>
          </template>

          <!-- Common Fields -->
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Full Name</label>
            <input v-model="localFormData.full_name" type="text"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              placeholder="Enter full name" />
            <span v-if="errors.full_name" class="text-sm text-red-500 mt-1">{{ errors.full_name }}</span>
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Gender</label>
            <input type="text" v-model="localFormData.gender"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
            <span v-if="errors.gender" class="text-sm text-red-500 mt-1">{{ errors.gender }}</span>
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Date of Birth</label>
            <input type="date" v-model="localFormData.date_of_birth"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
            <span v-if="errors.date_of_birth" class="text-sm text-red-500 mt-1">{{ errors.date_of_birth }}</span>
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Contact Number</label>
            <input v-model="localFormData.contact_no" type="tel"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              placeholder="Enter phone number" />
            <span v-if="errors.contact_no" class="text-sm text-red-500 mt-1">{{ errors.contact_no }}</span>
          </div>
        </div>

        <!-- Passport Photo Section -->
        <div class="mt-12">
          <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Passport Photo</h3>
            <div class="flex items-start space-x-4">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 required">Upload Passport Photo</label>
                <input type="file" @change="handlePassportPhotoSelect" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4
                           file:rounded-lg file:border-0 file:text-sm file:font-semibold
                           file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" accept=".jpg,.jpeg,.png" />
                <span v-if="errors.passport_photo" class="text-sm text-red-500 mt-1">{{ errors.passport_photo }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Qualification Details Section -->
        <div class="mt-12">
          <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Qualification Details</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              <div class="col-span-1">
                <label class="block text-sm font-medium text-gray-700 required">Qualification Type</label>
                <select v-model="localFormData.qualification_type"
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
                  <option value="">Select Qualification Type</option>
                  <option v-for="type in qualificationTypes" :key="type.id" :value="type.id">
                    {{ type.qualification_type_name }}
                  </option>
                </select>
                <span v-if="errors.qualification_type" class="text-sm text-red-500 mt-1">{{
      errors.qualification_type
    }}</span>
              </div>

              <div class="col-span-1">
                <label class="block text-sm font-medium text-gray-700 required">Qualification Name</label>
                <select v-model="localFormData.qualification_name"
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
                  <option value="">Select Qualification Name</option>
                  <option v-for="qualification in qualifications" :key="qualification.id" :value="qualification.id">
                    {{ qualification.qualification }}
                  </option>
                </select>
                <span v-if="errors.qualification_name" class="text-sm text-red-500 mt-1">{{
      errors.qualification_name
    }}</span>
              </div>

              <div class="col-span-1">
                <label class="block text-sm font-medium text-gray-700 required">Institute/University</label>
                <select v-model="localFormData.institute"
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
                  <option value="">Select Institute/University</option>
                  <option v-for="university in universities" :key="university.id" :value="university.id">
                    {{ university.country }}, {{ university.university }}, {{ university.institute_name }}
                  </option>
                </select>
                <span v-if="errors.institute" class="text-sm text-red-500 mt-1">{{ errors.institute }}</span>
              </div>

              <div class="col-span-1">
                <label class="block text-sm font-medium text-gray-700 required">Year of Completion</label>
                <input type="month" v-model="localFormData.year_of_completion"
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                  placeholder="YYYY" />
                <span v-if="errors.year_of_completion" class="text-sm text-red-500 mt-1">{{
      errors.year_of_completion
    }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Documents Section with new design -->
        <div class="mt-12">
          <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Supporting Documents</h3>
            <div class="space-y-4">
              <div v-for="(doc, index) in supportingDocuments" :key="index"
                class="flex items-start space-x-4 bg-white p-4 rounded-lg border border-gray-100">
                <div class="w-1/3">
                  <select v-model="doc.type"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
                    <option value="">Select Document Type</option>
                    <option v-for="type in fetchedDocumentTypes" :key="type.id" :value="type.id">
                      {{ type.document_name }}
                    </option>
                  </select>
                </div>
                <div class="flex-1 flex items-center space-x-2">
                  <input type="file" @change="(e) => handleFileSelect(e, index)" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4
                           file:rounded-lg file:border-0 file:text-sm file:font-semibold
                           file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" multiple />
                  <button @click="removeDocument(index)" type="button"
                    class="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <span class="sr-only">Remove</span>
                    ✕
                  </button>
                </div>
              </div>

              <button type="button" @click="addDocument"
                class="mt-4 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors inline-flex items-center">
                <span class="mr-2">+</span>
                Add Another Document
              </button>
            </div>
            <p class="text-sm text-gray-500 mt-2">
              Required documents are graduation certificate, cid copy, security clarance, roq certificate, class 10, 12
              and graduation marksheets.
            </p>
          </div>
        </div>

        <!-- Declaration Section -->
        <div class="mt-12 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Declaration</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Remarks</label>
              <textarea v-model="localFormData.remarks" rows="3"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                placeholder="Enter any additional remarks or comments"></textarea>
            </div>

            <div class="flex items-start space-x-3 bg-white p-4 rounded-lg">
              <input type="checkbox" v-model="localFormData.declaration"
                class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <label class="text-sm text-gray-700">
                I hereby declare that all the information provided above is true and correct to the best of my
                knowledge.
                I understand that any false statements may result in the rejection of my registration.
              </label>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="mt-12 flex justify-end space-x-4">
          <button type="button" @click="$emit('back')"
            class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            Back to Previous Step
          </button>
          <button type="button" @click="handleSubmit"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Submit Registration
          </button>
        </div>
      </div>
    </form>

    <SuccessModal v-model="showSuccessModal" :seconds="5" :onComplete="handleRedirect" />
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue';
import apiService from '@/services/services';
import { useToast } from 'vue-toastification';
import PaymentModal from '@/components/common/PaymentModal.vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import SuccessModal from './SuccessModal.vue';

const { user } = useAuthStore();
const router = useRouter();
const showSuccessModal = ref(false);


const props = defineProps({
  selectedType: {
    type: String,
    required: true
  },
  modelValue: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'submit', 'back', 'create', 'cancel', 'view-checklist', 'declare-code']);

// Document types list - NOW FETCHED FROM API
const fetchedDocumentTypes = ref([]);

// Supporting documents state
const supportingDocuments = ref([
  { type: '', files: [], description: '' }
]);

const addDocument = () => {
  supportingDocuments.value.push({ type: '', files: [], description: '' });
};

const removeDocument = (index) => {
  supportingDocuments.value.splice(index, 1);
};

const handleFileSelect = (event, index) => {
  const files = Array.from(event.target.files);
  if (files.some(file => file.size > 2 * 1024 * 1024)) {
    errors.documents = 'File size should not exceed 2MB';
    return;
  }
  supportingDocuments.value[index].files = files;
  updateFormDocuments();
};

const updateFormDocuments = () => {
  const documents = supportingDocuments.value.reduce((acc, doc) => {
    if (doc.files.length > 0) {
      acc.push({
        type: doc.type,  // include the document type
        files: doc.files,
        description: doc.description
      });
    }
    return acc;
  }, []);
  localFormData.documents = documents;
};

// List of countries
const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia',
  'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin',
  'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi',
  'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia',
  'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica',
  'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia',
  'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada',
  'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia',
  'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya',
  'Kiribati', 'Korea, North', 'Korea, South', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho',
  'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia',
  'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova',
  'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands',
  'New Zealand', 'Nicaragua', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea',
  'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Saint Kitts and Nevis',
  'Saint Lucia', 'Saint Vincent', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia',
  'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa',
  'South Sudan', 'Spain', 'Sri Lanka', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan',
  'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
  'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
  'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

// Qualification Details Data
const qualificationTypes = ref([]);
const qualifications = ref([]);
const universities = ref([]);

onMounted(async () => {
  try {
    const qualificationTypesResponse = await apiService.getMastersQualificationTypes();
    const qualificationsResponse = await apiService.getBmhCMastersQualifications();
    const universitiesResponse = await apiService.getMastersUniversities();

    qualificationTypes.value = qualificationTypesResponse.data.results;
    qualifications.value = qualificationsResponse.data.results;
    universities.value = universitiesResponse.data.results;

    //Fetch Document Types
    const documentTypesResponse = await apiService.getMastersDocumentTypes();
    fetchedDocumentTypes.value = documentTypesResponse.data.results;

  } catch (error) {
    console.error('Error fetching master data:', error);
    toast.error('Failed to fetch master data. Please try again.');
  }
});

const localFormData = reactive({
  ...props.modelValue,
  cid_holder: props.selectedType === 'cid',
  nationality: props.selectedType === 'cid' ? 'Bhutanese' : '',
  email_address: user.email,
  workPermitNo: '',
  mobileNumber: '',
  full_name: '',
  gender: '',
  date_of_birth: '',
  city: '',
  state: '',
  country: '',
  passport_photo: null,
  documents: [],
  remarks: '',
  declaration: false,
  is_payment_complete: false,
  payment_id: null,
  registration_date: null,
  expiry_date: null,
  qualification_type: '',
  qualification_name: '',
  institute: '',
  year_of_completion: null,
  is_active: true,
});

const errors = reactive({});
const paymentModal = ref(null);
const isSubmitting = ref(false);
const toast = useToast();
const isLoadingDCRC = ref(false);

const isCIDValid = computed(() => {
  return /^\d{11}$/.test(localFormData.cid_no);
});

watch(
  () => localFormData,
  (newData) => {
    emit('update:modelValue', { ...newData });
  },
  { deep: true }
);

const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key]);
  let isValid = true;

  if (!localFormData.full_name) { errors.full_name = 'Full name is required'; isValid = false; }
  if (!localFormData.gender) { errors.gender = 'Gender is required'; isValid = false; }
  if (!localFormData.date_of_birth) { errors.date_of_birth = 'Date of birth is required'; isValid = false; }
  if (!localFormData.contact_no) { errors.contact_no = 'Contact number is required'; isValid = false; }
  if (!localFormData.passport_photo) { errors.passport_photo = 'Passport photo is required'; isValid = false; }

  if (props.selectedType === 'cid') {
    if (!localFormData.cid_no) {
      errors.cid_no = 'CID is required';
      isValid = false;
    } else if (localFormData.cid_no.length > 11) {
      errors.cid_no = 'CID must be no more than 11 digits.';
      isValid = false;
    }

    if (!localFormData.dzongkhag) { errors.dzongkhag = 'Dzongkhag is required'; isValid = false; }
    if (!localFormData.village) { errors.village = 'Village is required'; isValid = false; }
  } else {
    if (!localFormData.nationality) { errors.nationality = 'Nationality is required'; isValid = false; }
    if (!localFormData.email_address) { errors.email_address = 'Email is required'; isValid = false; }
    if (!localFormData.workPermitNo) { errors.workPermitNo = 'Work permit number is required'; isValid = false; }
    if (!localFormData.country) { errors.country = 'Country is required'; isValid = false; }
    if (!localFormData.mobileNumber) {
      if (!localFormData.mobileNumber) {
        errors.mobileNumber = 'Mobile number is required';
        isValid = false;
      } else if (localFormData.mobileNumber.length > 8) {
        errors.mobileNumber = 'Mobile number must be no more than 8 digits.';
        isValid = false;
      } else if (!/^[17]/.test(localFormData.mobileNumber)) {
        errors.mobileNumber = 'Mobile number must start with 1 or 7.';
        isValid = false;
      }
    }
  }
  if (!localFormData.qualification_type) {
    errors.qualification_type = 'Qualification Type is required';
    isValid = false;
  }
  if (!localFormData.qualification_name) {
    errors.qualification_name = 'Qualification Name is required';
    isValid = false;
  }
  if (!localFormData.institute) { errors.institute = 'Institute is required'; isValid = false; }
  if (!localFormData.year_of_completion) {
    errors.year_of_completion = 'Year of Completion is required';
    isValid = false;
  }

  return isValid;
};

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
};

// DCRC data fetching
const fetchDCRCData = async () => {
  if (props.selectedType !== 'cid' || !isCIDValid.value) {
    return; // Only fetch for CID type and valid CID
  }

  isLoadingDCRC.value = true;
  try {
    const response = await apiService.fetchCitizenDetails(localFormData.cid_no);

    const genderMap = {
      'F': 'Female',
      'M': 'Male'
    };

    Object.assign(localFormData, {
      full_name: response.data.applicants_name,
      date_of_birth: formatDateForInput(response.data.date_of_birth),
      gender: genderMap[response.data.gender] || '',
      dzongkhag: response.data.dzongkhag,
      gewog: response.data.gewog,
      village: response.data.village,
      contact_no: response.data.mobile_number || localFormData.contact_no,
    });

    toast.success('DCRC data fetched successfully');
  } catch (error) {
    console.error('Error fetching DCRC data:', error);
    toast.error('Failed to fetch DCRC data. Please enter details manually.');

    // Clear fetched data if the API call fails
    localFormData.full_name = '';
    localFormData.date_of_birth = '';
    localFormData.gender = '';
    localFormData.dzongkhag = '';
    localFormData.gewog = '';
    localFormData.village = '';
    localFormData.contact_no = '';
  } finally {
    isLoadingDCRC.value = false;
  }
};

// Handle Passport Photo selection
const handlePassportPhotoSelect = (event) => {
  const file = event.target.files[0];
  if (file && file.size <= 2 * 1024 * 1024) {
    localFormData.passport_photo = file;
    errors.passport_photo = null;
  } else {
    localFormData.passport_photo = null;
    errors.passport_photo = 'File size should not exceed 2MB';
  }
};

const openPaymentModal = () => {
  paymentModal.value.openModal();
};

const onPaymentModalClose = () => {
  console.log('Payment modal closed');
};

const onPaymentCompleted = (paymentData) => {
  localFormData.is_payment_complete = paymentData.paymentDone;
  localFormData.payment_id = paymentData.paymentHash;
  handleSubmitActual();
};

const formatDateForAPI = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const handleSubmit = async () => {
  if (validateForm()) {
    openPaymentModal();
  }
};

const handleSubmitActual = async () => {
  isSubmitting.value = true;
  try {
    const formDataForApi = { ...localFormData }; // Create a copy to modify

    if (props.selectedType !== 'cid') {
      // Apply the Non-CID transformations
      formDataForApi.cid_no = formDataForApi.workPermitNo; // workPermitNo to cid_no

      formDataForApi.village = formDataForApi.city;
      formDataForApi.gewog = formDataForApi.state;
      formDataForApi.dzongkhag = formDataForApi.country;

      // Remove city, state, country, workPermitNo from the payload (optional but cleaner)
      delete formDataForApi.city;
      delete formDataForApi.state;
      delete formDataForApi.country;
      delete formDataForApi.workPermitNo;
    }

    const apiFormData = new FormData();  // Create FormData for the API

    for (const key in formDataForApi) {
      if (Object.hasOwnProperty.call(formDataForApi, key)) { // Safe iteration
        const value = formDataForApi[key];

        if (key === 'passport_photo' && value instanceof File) {
          apiFormData.append('passport_photo', value);
        } else if (key === 'image' && value instanceof File) {
          apiFormData.append('image', value);
        } else if (key === 'documents' && Array.isArray(value)) {
          value.forEach((doc, index) => {
            apiFormData.append(`documents[${index}][type]`, doc.type); // Send type
            if (doc.files && Array.isArray(doc.files)) {
              doc.files.forEach((file, fileIndex) => {
                apiFormData.append(`documents[${index}][file][${fileIndex}]`, file);  // File data
              });
            }
            apiFormData.append(`documents[${index}][description]`, doc.description);
          });
        }
        else if (value !== null && value !== undefined) {
          apiFormData.append(key, value);
        }
      }
    }

    const today = new Date();
    const expiry = new Date(today);
    expiry.setFullYear(today.getFullYear() + 5);

    apiFormData.append('registration_date', formatDateForAPI(today));
    apiFormData.append('expiry_date', formatDateForAPI(expiry));

    await apiService.createBhmcNewApplication(apiFormData);

    toast.success('Application submitted successfully!');
    showSuccessModal.value = true; // Show the modal instead of using setTimeout

    emit('submit', apiFormData);

  } catch (error) {
    console.error('Error submitting application:', error);
    toast.error(`Application submission failed: ${error.message}`);
  } finally {
    isSubmitting.value = false;
  }
};

const handleRedirect = () => {
  router.go(0);
};
</script>

<style scoped>
.required::after {
  content: " *";
  color: #ef4444;
}
</style>
