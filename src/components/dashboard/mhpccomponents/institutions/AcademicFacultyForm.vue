<template>
  <div class="space-y-6">
    <div>
      <label for="academic-identifier" class="form-label">CID Number</label>
      <div class="mt-1 relative rounded-md shadow-sm">
        <input
          type="text"
          id="academic-identifier"
          :value="form.identifier"
          @input="updateForm('identifier', $event.target.value)"
          :disabled="mode === 'view' || isFetchingDetails || (mode === 'edit' && isDataFetched)"
          required
          class="form-input pr-24"
          :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.identifier }"
          placeholder="Enter CID Number"
        />
        <button
          v-if="mode !== 'view'"
          type="button"
          @click="triggerFetchAcademicDetails"
          :disabled="isFetchingDetails || !form.identifier || (mode === 'edit' && isDataFetched)"
          class="absolute inset-y-0 right-0 flex items-center px-3 rounded-r-md border-l bg-gray-50 hover:bg-gray-100 focus:outline-none"
        >
          <span class="text-sm text-gray-600" :class="{ 'opacity-50': isFetchingDetails || !form.identifier }">
            {{ isFetchingDetails ? 'Fetching...' : 'Fetch Data' }}
          </span>
        </button>
      </div>
      <p v-if="errors.identifier" class="mt-1 text-sm text-red-500">{{ errors.identifier }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="academic-registration_type" class="form-label">Registration Type</label>
        <input
          type="text"
          id="academic-registration_type"
          :value="form.registration_type"
          @input="updateForm('registration_type', $event.target.value)"
          :disabled="mode === 'view'"
          required
          class="form-input"
        />
        <p v-if="errors.registration_type" class="mt-1 text-sm text-red-500">{{ errors.registration_type }}</p>
      </div>
      <div>
        <label for="academic-nationality" class="form-label">Nationality</label>
        <input
          type="text"
          id="academic-nationality"
          :value="form.nationality"
          @input="updateForm('nationality', $event.target.value)"
          :disabled="mode === 'view' || isDataFetched"
          required
          class="form-input"
          :class="{ 'bg-gray-50': isDataFetched }"
        />
        <p v-if="errors.nationality" class="mt-1 text-sm text-red-500">{{ errors.nationality }}</p>
      </div>
    </div>

    <div>
      <label for="academic-full_name" class="form-label">Full Name</label>
      <input
        type="text"
        id="academic-full_name"
        :value="form.staff_name"
        @input="updateForm('staff_name', $event.target.value)"
        :disabled="mode === 'view' || isDataFetched"
        required
        class="form-input"
        :class="{ 'bg-gray-50': isDataFetched }"
      />
      <p v-if="errors.staff_name" class="mt-1 text-sm text-red-500">{{ errors.staff_name }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="academic-date_of_birth" class="form-label">Date of Birth</label>
        <input
          type="date"
          id="academic-date_of_birth"
          :value="form.date_of_birth"
          @input="updateForm('date_of_birth', $event.target.value)"
          :disabled="mode === 'view' || isDataFetched"
          required
          class="form-input"
          :class="{ 'bg-gray-50': isDataFetched }"
        />
        <p v-if="errors.date_of_birth" class="mt-1 text-sm text-red-500">{{ errors.date_of_birth }}</p>
      </div>
      <div>
        <label for="academic-contact_no" class="form-label">Contact Number</label>
        <input
          type="tel"
          id="academic-contact_no"
          :value="form.contact_no"
          @input="updateForm('contact_no', $event.target.value)"
          :disabled="mode === 'view'"
          required
          class="form-input"
        />
        <p v-if="errors.contact_no" class="mt-1 text-sm text-red-500">{{ errors.contact_no }}</p>
      </div>
    </div>

    <div>
      <label for="academic-email_address" class="form-label">Email Address</label>
      <input
        type="email"
        id="academic-email_address"
        :value="form.email_address"
        @input="updateForm('email_address', $event.target.value)"
        :disabled="mode === 'view'"
        required
        class="form-input"
      />
      <p v-if="errors.email_address" class="mt-1 text-sm text-red-500">{{ errors.email_address }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label for="academic-village" class="form-label">Village</label>
        <input
          type="text"
          id="academic-village"
          :value="form.village"
          @input="updateForm('village', $event.target.value)"
          :disabled="mode === 'view' || isDataFetched"
          required
          class="form-input"
          :class="{ 'bg-gray-50': isDataFetched }"
        />
        <p v-if="errors.village" class="mt-1 text-sm text-red-500">{{ errors.village }}</p>
      </div>
      <div>
        <label for="academic-gewog" class="form-label">Gewog</label>
        <input
          type="text"
          id="academic-gewog"
          :value="form.gewog"
          @input="updateForm('gewog', $event.target.value)"
          :disabled="mode === 'view' || isDataFetched"
          required
          class="form-input"
          :class="{ 'bg-gray-50': isDataFetched }"
        />
        <p v-if="errors.gewog" class="mt-1 text-sm text-red-500">{{ errors.gewog }}</p>
      </div>
      <div>
        <label for="academic-dzongkhag" class="form-label">Dzongkhag</label>
        <input
          type="text"
          id="academic-dzongkhag"
          :value="form.dzongkhag"
          @input="updateForm('dzongkhag', $event.target.value)"
          :disabled="mode === 'view' || isDataFetched"
          required
          class="form-input"
          :class="{ 'bg-gray-50': isDataFetched }"
        />
        <p v-if="errors.dzongkhag" class="mt-1 text-sm text-red-500">{{ errors.dzongkhag }}</p>
      </div>
    </div>

    <!-- Registration and Expiry Date are not typically fetched for Academic via CID, so keep them editable -->
     <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label for="academic-registration_date" class="form-label">Registration Date</label>
            <input
            type="date"
            id="academic-registration_date"
            :value="form.registration_date"
            @input="updateForm('registration_date', $event.target.value)"
            :disabled="mode === 'view'"
            required
            class="form-input"
            />
            <p v-if="errors.registration_date" class="mt-1 text-sm text-red-500">{{ errors.registration_date }}</p>
        </div>
        <div>
            <label for="academic-expiry_date" class="form-label">Expiry Date</label>
            <input
            type="date"
            id="academic-expiry_date"
            :value="form.expiry_date"
            @input="updateForm('expiry_date', $event.target.value)"
            :disabled="mode === 'view'"
            required
            class="form-input"
            />
            <p v-if="errors.expiry_date" class="mt-1 text-sm text-red-500">{{ errors.expiry_date }}</p>
        </div>
    </div>


    <!-- Designation and Date of Joining - Common -->
    <div>
      <label for="academic-designation" class="form-label">Designation</label>
      <input
        type="text"
        id="academic-designation"
        :value="form.designation"
        @input="updateForm('designation', $event.target.value)"
        :disabled="mode === 'view'"
        required
        class="form-input"
      />
      <p v-if="errors.designation" class="mt-1 text-sm text-red-500">{{ errors.designation }}</p>
    </div>

    <div>
      <label for="academic-date_of_joining" class="form-label">Date of Joining</label>
      <input
        type="date"
        id="academic-date_of_joining"
        :value="form.date_of_joining"
        @input="updateForm('date_of_joining', $event.target.value)"
        :disabled="mode === 'view'"
        required
        class="form-input"
      />
      <p v-if="errors.date_of_joining" class="mt-1 text-sm text-red-500">{{ errors.date_of_joining }}</p>
    </div>

    <!-- Education Details -->
    <div>
      <label class="form-label">Education Details</label>
      <div v-if="mode !== 'view'" class="space-y-4">
        <div v-for="(edu, index) in form.education_details" :key="index" class="border p-4 rounded-lg">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label :for="`edu-type-${index}`" class="form-label">Type</label>
              <select
                :id="`edu-type-${index}`"
                :value="edu.type"
                @input="updateEducationDetail(index, 'type', $event.target.value)"
                required
                class="form-select"
              >
                <option value="" disabled>Select Type</option>
                <option v-for="typeOpt in courseTypeOptions" :key="typeOpt.value" :value="typeOpt.value">
                  {{ typeOpt.label }}
                </option>
              </select>
              <p v-if="errors[`edu_type_${index}`]" class="mt-1 text-sm text-red-500">{{ errors[`edu_type_${index}`] }}</p>
            </div>
            <div>
              <label :for="`edu-qualification-${index}`" class="form-label">Qualification</label>
              <select
                :id="`edu-qualification-${index}`"
                :value="edu.qualification"
                @input="updateEducationDetail(index, 'qualification', $event.target.value)"
                required
                class="form-select"
              >
                <option value="" disabled>Select Qualification</option>
                <option v-for="qualOpt in qualificationOptions" :key="qualOpt.value" :value="qualOpt.value">
                  {{ qualOpt.label }}
                </option>
              </select>
              <p v-if="errors[`edu_qualification_${index}`]" class="mt-1 text-sm text-red-500">{{ errors[`edu_qualification_${index}`] }}</p>
            </div>
            <div>
              <label :for="`edu-institute-${index}`" class="form-label">Institute/University</label>
              <input
                :id="`edu-institute-${index}`"
                :value="edu.institute"
                @input="updateEducationDetail(index, 'institute', $event.target.value)"
                required
                class="form-input"
              />
              <p v-if="errors[`edu_institute_${index}`]" class="mt-1 text-sm text-red-500">{{ errors[`edu_institute_${index}`] }}</p>
            </div>
            <div>
              <label :for="`edu-year-${index}`" class="form-label">Year of Completion</label>
              <input
                :id="`edu-year-${index}`"
                :value="edu.year_of_completion"
                @input="updateEducationDetail(index, 'year_of_completion', $event.target.value)"
                type="number"
                :min="minYear"
                :max="currentYear"
                required
                class="form-input"
              />
              <p v-if="errors[`edu_year_${index}`]" class="mt-1 text-sm text-red-500">{{ errors[`edu_year_${index}`] }}</p>
            </div>
          </div>
          <button
            v-if="form.education_details.length > 1 && mode !== 'view'"
            type="button"
            @click="removeEducation(index)"
            class="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        </div>
        <button
          v-if="mode !== 'view'"
          type="button"
          @click="addEducation"
          class="btn btn-secondary mt-2"
        >
          Add Education
        </button>
      </div>
      <div v-else> <!-- View Mode for Education -->
        <div class="border p-4 rounded-lg mb-4" v-for="(edu, index) in form.education_details" :key="`view-${index}`">
          <p><strong>Type:</strong> {{ getCourseTypeName(edu.type) }}</p>
          <p><strong>Qualification:</strong> {{ getQualificationName(edu.qualification) }}</p>
          <p><strong>Institute:</strong> {{ edu.institute }}</p>
          <p><strong>Year:</strong> {{ edu.year_of_completion }}</p>
        </div>
        <p class="text-sm text-gray-500" v-if="!form.education_details || form.education_details.length === 0">
          No education details available.
        </p>
      </div>
    </div>

    <!-- CV Upload -->
    <div>
      <label for="academic-cv" class="form-label">Upload CV</label>
      <UploadFile
        :modelValue="form.cv"
        @update:modelValue="updateForm('cv', $event)"
        accept=".pdf"
        :max-size="5"
        :disabled="mode === 'view'"
        :initial-file-name="form.cv_name"
      />
      <p class="mt-1 text-sm">PDF only, max 5MB. <span v-if="form.cv_name && mode !== 'add'">Current: {{form.cv_name}}</span></p>
      <p v-if="errors.cv" class="mt-1 text-sm text-red-500">{{ errors.cv }}</p>
    </div>

    <!-- Passport Photo Upload -->
    <div>
      <label for="academic-passport_photo" class="form-label">Upload Passport Photo</label>
      <UploadFile
        :modelValue="form.passport_photo"
        @update:modelValue="updateForm('passport_photo', $event)"
        accept="image/*"
        :max-size="2"
        :disabled="mode === 'view'"
        :initial-file-name="form.passport_photo_name"
      />
      <p class="mt-1 text-sm">Image only, max 2MB. <span v-if="form.passport_photo_name && mode !== 'add'">Current: {{form.passport_photo_name}}</span></p>
      <p v-if="errors.passport_photo" class="mt-1 text-sm text-red-500">{{ errors.passport_photo }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, } from 'vue';
import UploadFile from '@/components/common/FileUpload.vue'; // Adjust path as needed
import apiServices from '@/services/services'; // Adjust path as needed
import { useToast } from 'vue-toastification';

const props = defineProps({
  form: { type: Object, required: true },
  mode: { type: String, required: true }, // 'add', 'edit', 'view'
  errors: { type: Object, default: () => ({}) },
  qualificationOptions: { type: Array, default: () => [] },
  courseTypeOptions: { type: Array, default: () => [] },
  minYear: { type: Number, required: true },
  currentYear: { type: Number, required: true },
});

const emit = defineEmits(['update:form', 'show-notification']);

const toast = useToast();
const isFetchingDetails = ref(false);
const isDataFetched = ref(false); // To disable fields after fetching from CID

// Watch for external changes to form.identifier, e.g. when switching faculty type in parent
watch(() => props.form.identifier, (newVal, oldVal) => {
  if (newVal === '' && oldVal !== '') { // If identifier is cleared (e.g. faculty type change)
    isDataFetched.value = false;
  }
});
watch(() => props.form.id, () => { // Reset on new item for 'add' mode or different item for 'edit'
    if(props.mode === 'add' || (props.mode === 'edit' && !props.form.staff_name)) { // Heuristic for new/cleared form
        isDataFetched.value = false;
    } else if (props.mode === 'edit' && props.form.staff_name && props.form.identifier) {
        // If editing and identifier is present, assume data might have been fetched previously for this record if staff_name is there.
        // This is tricky logic. A dedicated flag from parent might be better.
        // For now, let's assume if staff_name is populated in edit mode, data was "fetched" or pre-filled.
        isDataFetched.value = !!props.form.staff_name;
    }
}, { immediate: true });


const updateForm = (key, value) => {
  const updatedForm = { ...props.form, [key]: value };
  emit('update:form', updatedForm);
};

const updateEducationDetail = (index, key, value) => {
  const updatedEducationDetails = [...props.form.education_details];
  updatedEducationDetails[index] = { ...updatedEducationDetails[index], [key]: value };
  if (key === 'year_of_completion') {
    updatedEducationDetails[index][key] = value ? parseInt(value, 10) : '';
  }
  updateForm('education_details', updatedEducationDetails);
};

const addEducation = () => {
  const updatedEducationDetails = [...props.form.education_details, { type: '', qualification: '', institute: '', year_of_completion: '' }];
  updateForm('education_details', updatedEducationDetails);
};

const removeEducation = (index) => {
  const updatedEducationDetails = props.form.education_details.filter((_, i) => i !== index);
  updateForm('education_details', updatedEducationDetails);
};

const getCourseTypeName = (typeId) => {
  const type = props.courseTypeOptions.find((t) => t.value === typeId);
  return type ? type.label : typeId || 'Unknown';
};

const getQualificationName = (qualId) => {
  const qual = props.qualificationOptions.find((q) => q.value === qualId);
  return qual ? qual.label : qualId || 'Unknown';
};

const triggerFetchAcademicDetails = async () => {
  if (!props.form.identifier) {
    emit('show-notification', 'error', 'Validation Error', 'CID Number is required to fetch details.');
    return;
  }
  isFetchingDetails.value = true;
  isDataFetched.value = false;
  try {
    const response = await apiServices.fetchCitizenDetails(props.form.identifier);
    if (response?.data) {
      const fetchedData = response.data;
      const updatedForm = {
        ...props.form,
        staff_name: fetchedData.name || props.form.staff_name,
        nationality: fetchedData.nationality || props.form.nationality,
        date_of_birth: fetchedData.date_of_birth || props.form.date_of_birth,
        village: fetchedData.village || props.form.village,
        gewog: fetchedData.gewog || props.form.gewog,
        dzongkhag: fetchedData.dzongkhag || props.form.dzongkhag,
        // contact_no usually manually entered for academic, not from basic CID fetch
        // email_address usually manually entered
        // registration_type, registration_date, expiry_date also manually entered for academic
      };
      emit('update:form', updatedForm);
      isDataFetched.value = true;
      toast.success('Academic faculty data fetched successfully from census.');
    } else {
      emit('show-notification', 'info', 'No Data Found', 'No census data found for this CID. Please enter details manually.');
    }
  } catch (error) {
    console.error('Error fetching academic details:', error);
    emit('show-notification', 'error', 'Fetch Failed', error.message || 'Failed to fetch academic details.');
  } finally {
    isFetchingDetails.value = false;
  }
};
</script>

<style scoped>
.form-label { @apply block text-sm font-medium text-gray-700 mb-1.5; }
.form-input, .form-select { @apply block w-full rounded-md border-gray-300 shadow-sm p-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-150; }
.btn { @apply inline-flex items-center justify-center rounded-md border py-2 px-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed; }
.btn-secondary { @apply border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500; }
</style>