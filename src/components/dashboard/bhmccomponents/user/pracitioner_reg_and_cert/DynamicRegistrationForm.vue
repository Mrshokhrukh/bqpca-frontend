<template>
  <div class="max-w-4xl mx-auto">
    <form @submit.prevent="handleSubmit" class="bg-white border p-6 rounded-lg shadow-sm space-y-6">
      <!-- Personal Information Fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- CID Holder Fields -->
        <template v-if="selectedType === 'cid'">
          <div>
            <label class="block text-sm font-medium text-gray-700 required">CID No.</label>
            <input
              v-model="localFormData.cid"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              placeholder="Enter CID number"
              required
            />
            <span v-if="errors.cid" class="text-sm text-red-500 mt-1">{{ errors.cid }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 required">Dzongkhag</label>
            <select
              v-model="localFormData.dzongkhag"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              required
            >
              <option value="">Select Dzongkhag</option>
              <option v-for="dzongkhag in dzongkhags" :key="dzongkhag" :value="dzongkhag">
                {{ dzongkhag }}
              </option>
            </select>
            <span v-if="errors.dzongkhag" class="text-sm text-red-500 mt-1">{{ errors.dzongkhag }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 required">Full Name</label>
            <input
              v-model="localFormData.fullName"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              placeholder="Enter full name"
              required
            />
            <span v-if="errors.fullName" class="text-sm text-red-500 mt-1">{{ errors.fullName }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 required">Gender</label>
            <select
              v-model="localFormData.gender"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <span v-if="errors.gender" class="text-sm text-red-500 mt-1">{{ errors.gender }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 required">Village</label>
            <input
              v-model="localFormData.village"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              placeholder="Enter village name"
              required
            />
            <span v-if="errors.village" class="text-sm text-red-500 mt-1">{{ errors.village }}</span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 required">Date of Birth</label>
            <input
              v-model="localFormData.dob"
              type="date"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              required
            />
            <span v-if="errors.dob" class="text-sm text-red-500 mt-1">{{ errors.dob }}</span>
          </div>
        </template>

      <!-- Non-CID Holder Fields -->
<template v-else>
  <div>
    <label class="block text-sm font-medium text-gray-700 required">Nationality</label>
    <select
      v-model="localFormData.nationality"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
      required
    >
      <option value="">SELECT NATIONALITY</option>
      <option v-for="country in countries" :key="country" :value="country">
        {{ country }}
      </option>
    </select>
    <span v-if="errors.nationality" class="text-sm text-red-500 mt-1">{{ errors.nationality }}</span>
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700 required">Email Address</label>
    <input
      v-model="localFormData.email"
      type="email"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
      placeholder="Email Address"
      required
    />
    <span v-if="errors.email" class="text-sm text-red-500 mt-1">{{ errors.email }}</span>
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700 required">Identity / Work Permit No</label>
    <input
      v-model="localFormData.workPermitNo"
      type="text"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
      placeholder="Identity / Work Permit No"
      required
    />
    <span v-if="errors.workPermitNo" class="text-sm text-red-500 mt-1">{{ errors.workPermitNo }}</span>
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700 required">Mobile Number</label>
    <input
      v-model="localFormData.mobileNumber"
      type="tel"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
      placeholder="Mobile Number"
      required
    />
    <span v-if="errors.mobileNumber" class="text-sm text-red-500 mt-1">{{ errors.mobileNumber }}</span>
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700 required">Full Name</label>
    <input
      v-model="localFormData.fullName"
      type="text"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
      placeholder="Full Name"
      required
    />
    <span v-if="errors.fullName" class="text-sm text-red-500 mt-1">{{ errors.fullName }}</span>
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700 required">Country</label>
    <select
      v-model="localFormData.country"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
      required
    >
      <option value="">SELECT COUNTRY</option>
      <option v-for="country in countries" :key="country" :value="country">
        {{ country }}
      </option>
    </select>
    <span v-if="errors.country" class="text-sm text-red-500 mt-1">{{ errors.country }}</span>
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700 required">Gender</label>
    <select
      v-model="localFormData.gender"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
      required
    >
      <option value="">SELECT GENDER</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
    </select>
    <span v-if="errors.gender" class="text-sm text-red-500 mt-1">{{ errors.gender }}</span>
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700">City</label>
    <input
      v-model="localFormData.city"
      type="text"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
      placeholder="City"
    />
    <span v-if="errors.city" class="text-sm text-red-500 mt-1">{{ errors.city }}</span>
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700 required">Date of Birth</label>
    <input
      v-model="localFormData.dob"
      type="date"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
      required
    />
    <span v-if="errors.dob" class="text-sm text-red-500 mt-1">{{ errors.dob }}</span>
  </div>

  <div>
    <label class="block text-sm font-medium text-gray-700">State</label>
    <input
      v-model="localFormData.state"
      type="text"
      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
      placeholder="State"
    />
    <span v-if="errors.state" class="text-sm text-red-500 mt-1">{{ errors.state }}</span>
  </div>
</template>

        <!-- Common Fields -->
        <div>
          <label class="block text-sm font-medium text-gray-700 required">Contact Number</label>
          <input
            v-model="localFormData.contact"
            type="tel"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            placeholder="Enter phone number"
            required
          />
          <span v-if="errors.contact" class="text-sm text-red-500 mt-1">{{ errors.contact }}</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            placeholder="Enter email address"
          />
        </div>
      </div>

      <!-- Supporting Documents Section -->
      <div class="mt-8">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Supporting Documents</h3>
        <div class="space-y-4">
          <div v-for="(doc, index) in supportingDocuments" :key="index" class="flex items-start space-x-4">
            <div class="w-1/2">
              <select
                v-model="doc.type"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                required
              >
                <option value="">Select Document Type</option>
                <option v-for="type in documentTypes" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>
            <div class="flex-1 flex items-center space-x-2">
              <input
                type="file"
                @change="(e) => handleFileSelect(e, index)"
                class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                multiple
              />
              <button
                @click="removeDocument(index)"
                type="button"
                class="p-2 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          </div>
          <button
            type="button"
            @click="addDocument"
            class="mt-2 px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
          >
            Add Another Document
          </button>
        </div>
      </div>

      <!-- Remarks and Declaration -->
      <div class="space-y-4 mt-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Remarks</label>
          <textarea
            v-model="localFormData.remarks"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            placeholder="Enter any remarks"
          ></textarea>
        </div>

        <div class="flex items-start space-x-2">
          <input
            type="checkbox"
            v-model="localFormData.declaration"
            class="mt-1 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            required
          />
          <label class="text-sm text-gray-700">
            I hereby declare that the statements given above are true and correct to the best of my knowledge and belief.
          </label>
        </div>
        <span v-if="errors.declaration" class="text-sm text-red-500">{{ errors.declaration }}</span>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-4 pt-6">
        <button
          type="button"
          @click="$emit('back')"
          class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Back
        </button>
        <button
          type="submit"
          class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit Registration
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';

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

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.size > 2 * 1024 * 1024) {
    errors.image = 'Image size should not exceed 2MB';
    return;
  }
  localFormData.image = file;
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
  errors.value = {};

  // Common validations
  if (!localFormData.email) errors.email = 'Email is required';
  if (!localFormData.mobileNumber) errors.mobileNumber = 'Mobile number is required';
  if (!localFormData.fullName) errors.fullName = 'Full name is required';
  if (!localFormData.gender) errors.gender = 'Gender is required';
  if (!localFormData.dob) errors.dob = 'Date of birth is required';
  if (!localFormData.country) errors.country = 'Country is required';

  // Non-CID specific validations
  if (props.selectedType !== 'cid') {
    if (!localFormData.nationality) errors.nationality = 'Nationality is required';
    if (!localFormData.workPermitNo) errors.workPermitNo = 'Work permit number is required';
  }

  // Image validation
  if (!localFormData.image) {
    errors.image = 'Personnel image is required';
  }

  // Document validation
  if (supportingDocuments.value.some(doc => doc.files.length > 0 && !doc.description)) {
    errors.documents = 'Description is required for uploaded documents';
  }

  // Declaration validation
  if (!localFormData.declaration) {
    errors.declaration = 'You must accept the declaration';
  }

  return Object.keys(errors).length === 0;
};

// Handle form submission
const handleSubmit = () => {
  console.log(new FormData);
  if (validateForm()) {
    const formData = new FormData();

    // Append all form fields
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

    emit('submit', formData);
  }
};

// Handle create button click
const handleCreate = () => {
  if (validateForm()) {
    emit('create', localFormData);
  }
};

// Handle cancel button click
const handleCancel = () => {
  emit('cancel');
};

// Handle view checklist button click
const handleViewChecklist = () => {
  emit('view-checklist');
};

// Handle declare code button click
const handleDeclareCode = () => {
  emit('declare-code');
};

// Reset form
const resetForm = () => {
  Object.keys(localFormData).forEach(key => {
    if (key !== 'documents') {
      localFormData[key] = '';
    }
  });
  localFormData.documents = [];
  localFormData.declaration = false;
  localFormData.image = null;
  supportingDocuments.value = [{ type: '', files: [], description: '' }];
  errors.value = {};
};
</script>

<style scoped>
.required::after {
  content: " *";
  color: #ef4444;
}
</style>
<style scoped>
.required::after {
  content: " *";
  color: #ef4444;
}
</style>
