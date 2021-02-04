<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Form Header -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        {{ selectedType === 'cid' ? 'CID Holder Registration' : 'Non-CID Holder Registration' }}
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Please fill in all required fields marked with an asterisk (*). Ensure all information provided is accurate and
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
              <input v-model="localFormData.cid" type="text"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                placeholder="Enter CID number" />
              <span v-if="errors.cid" class="text-sm text-red-500 mt-1">{{ errors.cid }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Dzongkhag</label>
              <select v-model="localFormData.dzongkhag"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
                <option value="">Select Dzongkhag</option>
                <option v-for="dzongkhag in dzongkhags" :key="dzongkhag" :value="dzongkhag">
                  {{ dzongkhag }}
                </option>
              </select>
              <span v-if="errors.dzongkhag" class="text-sm text-red-500 mt-1">{{ errors.dzongkhag }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required">Village</label>
              <input v-model="localFormData.village" type="text"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                placeholder="Enter village name" />
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
              <input v-model="localFormData.email" type="email"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                placeholder="Email Address" />
              <span v-if="errors.email" class="text-sm text-red-500 mt-1">{{ errors.email }}</span>
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
            <input v-model="localFormData.fullName" type="text"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              placeholder="Enter full name" />
            <span v-if="errors.fullName" class="text-sm text-red-500 mt-1">{{ errors.fullName }}</span>
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Gender</label>
            <select v-model="localFormData.gender"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
              <option value="">SELECT GENDER</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <span v-if="errors.gender" class="text-sm text-red-500 mt-1">{{ errors.gender }}</span>
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Date of Birth</label>
            <input v-model="localFormData.dob" type="date"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
            <span v-if="errors.dob" class="text-sm text-red-500 mt-1">{{ errors.dob }}</span>
          </div>

          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 required">Contact Number</label>
            <input v-model="localFormData.contact" type="tel"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              placeholder="Enter phone number" />
            <span v-if="errors.contact" class="text-sm text-red-500 mt-1">{{ errors.contact }}</span>
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
                    <option v-for="type in documentTypes" :key="type" :value="type">
                      {{ type }}
                    </option>
                  </select>
                </div>
                <div class="flex-1 flex items-center space-x-2">
                  <input type="file" @change="(e) => handleFileSelect(e, index)" class="block w-full text-sm text-gray-500
                           file:mr-4 file:py-2.5 file:px-4
                           file:rounded-lg file:border-0
                           file:text-sm file:font-semibold
                           file:bg-blue-50 file:text-blue-700
                           hover:file:bg-blue-100" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" multiple />
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
          <button type="submit" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Submit Registration
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import bmhcServices from '@/services/bmhcservices';  // Import your service
import { useToast } from 'vue-toastification';

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

// Document types list
const documentTypes = [
  'Declaration of the Code of Professional Fidelity signed on Legal Stamp',
  'Graduation Certificate (Master/degree/diploma/certificate)',
  'Provisional or Course Completion Certificate',
  'Marksheet (Master/degree/diploma/certificate)',
  'Internship completion certificate',
  'Class X and XII pass certificates',
  'Class X and XII statement of marks',
  'Citizenship identity card',
  'Valid Security clearance',
  'Recognition of Qualification Certificate'
];

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
        files: doc.files,
        description: doc.description
      });
    }
    return acc;
  }, []);
  localFormData.documents = documents;
};

// List of Dzongkhags
const dzongkhags = [
  'Bumthang', 'Chukha', 'Dagana', 'Gasa', 'Haa',
  'Lhuntse', 'Mongar', 'Paro', 'Pemagatshel',
  'Punakha', 'Samdrup Jongkhar', 'Samtse',
  'Sarpang', 'Thimphu', 'Trashigang', 'Trashiyangtse',
  'Trongsa', 'Tsirang', 'Wangdue Phodrang', 'Zhemgang'
];

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
  'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea',
  'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis',
  'Saint Lucia', 'Saint Vincent', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia',
  'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa',
  'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan',
  'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan',
  'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan',
  'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

// Create a local copy of the form data
const localFormData = reactive({
  ...props.modelValue,
  nationality: '',
  email: '',
  workPermitNo: '',
  mobileNumber: '',
  fullName: '',
  gender: '',
  dob: '',
  city: '',
  state: '',
  country: '',
  image: null,
  documents: [],
  remarks: '',
  declaration: false
});

// Error state
const errors = reactive({});

// Watch for changes in localFormData and emit updates to the parent
watch(
  () => localFormData,
  (newData) => {
    emit('update:modelValue', { ...newData });
  },
  { deep: true }
);

// Form validation
const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key]); // Clear previous errors
  let isValid = true;

  // Common validations
  if (!localFormData.fullName) { errors.fullName = 'Full name is required'; isValid = false; }
  if (!localFormData.gender) { errors.gender = 'Gender is required'; isValid = false; }
  if (!localFormData.dob) { errors.dob = 'Date of birth is required'; isValid = false; }
  if (!localFormData.contact) { errors.contact = 'Contact number is required'; isValid = false; }

  // CID/Non-CID Specific Validations:
  if (props.selectedType === 'cid') {
    if (!localFormData.cid) { errors.cid = 'CID is required'; isValid = false; }
    if (!localFormData.dzongkhag) { errors.dzongkhag = 'Dzongkhag is required'; isValid = false; }
    if (!localFormData.village) { errors.village = 'Village is required'; isValid = false; }
  } else {
    if (!localFormData.nationality) { errors.nationality = 'Nationality is required'; isValid = false; }
    if (!localFormData.email) { errors.email = 'Email is required'; isValid = false; }
    if (!localFormData.workPermitNo) { errors.workPermitNo = 'Work permit number is required'; isValid = false; }
    if (!localFormData.country) { errors.country = 'Country is required'; isValid = false; }
    if (!localFormData.mobileNumber) { errors.mobileNumber = 'Mobile number is required'; isValid = false; }
  }


  if (!localFormData.declaration) { errors.declaration = 'You must accept the declaration'; isValid = false; }

  return isValid;
};

// Initialize Toast
const toast = useToast();

// Handle form submission
const handleSubmit = async () => {
  if (validateForm()) {
    const formData = new FormData();

    Object.entries(localFormData).forEach(([key, value]) => {
      if (key === 'image' && value instanceof File) {
        formData.append('image', value);
      } else if (key === 'documents' && Array.isArray(value)) {
        value.forEach((doc, index) => {
          doc.files.forEach(file => {
            formData.append(`documents[${index}]`, file);
          });
          formData.append(`descriptions[${index}]`, doc.description);
        });
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    try {
      // Use the bmhcServices to submit the form
      await bmhcServices.createBhmcNewApplication(formData);
      toast.success('Application submitted successfully!'); // Use toast for success message
      emit('submit', formData); // Keep emitting the submit event for parent component
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(`Application submission failed: ${error.message}`); // Use toast for error message
    }
  }
};
</script>

<style scoped>
.required::after {
  content: " *";
  color: #ef4444;
}
</style>
