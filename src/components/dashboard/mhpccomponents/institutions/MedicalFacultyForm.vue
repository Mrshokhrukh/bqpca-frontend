<template>
  <div class="space-y-6">
    <div>
      <label for="medical-identifier" class="form-label">Search by CID</label>
      <div class="mt-1 flex items-center space-x-2">
        <input
          type="text"
          id="medical-identifier"
          :value="form.identifier"
          @input="updateForm('identifier', $event.target.value)"
          :disabled="identifierInputDisabled"
          required
          class="form-input"
          :class="{
            'border-red-300 focus:border-red-500 focus:ring-red-500': errors.identifier,
            'bg-gray-100': identifierInputDisabled,
          }"
          placeholder="Enter 11-digit CID number..."
        />
        <button
          type="button"
          @click="fetchFacultyByCid"
          :disabled="isFetchingDetails || !form.identifier || identifierInputDisabled"
          class="btn btn-primary whitespace-nowrap"
        >
          <span class="loader animate-spin h-5 w-5 mr-2 text-white" v-if="isFetchingDetails"></span>
          <span>{{ isFetchingDetails ? 'Fetching...' : 'Fetch Details' }}</span>
        </button>
      </div>
      <p v-if="errors.identifier" class="mt-1 text-sm text-red-500">{{ errors.identifier }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="medical-registration_type" class="form-label">Registration Type </label>
        <input
          type="text"
          id="medical-registration_type"
          :value="form.registration_type_name"
          disabled
          class="form-input bg-gray-100"
        />
        <p v-if="errors.registration_type_name" class="mt-1 text-sm text-red-500">
          {{ errors.registration_type_name }}
        </p>
      </div>
      <div>
        <label for="medical-nationality" class="form-label">Nationality </label>
        <input
          type="text"
          id="medical-nationality"
          :value="form.nationality"
          disabled
          class="form-input bg-gray-100"
        />
        <p v-if="errors.nationality" class="mt-1 text-sm text-red-500">{{ errors.nationality }}</p>
      </div>
    </div>

    <div>
      <label for="medical-full_name" class="form-label">Full Name </label>
      <input
        type="text"
        id="medical-full_name"
        :value="form.staff_name"
        disabled
        class="form-input bg-gray-100"
      />
      <p v-if="errors.staff_name" class="mt-1 text-sm text-red-500">{{ errors.staff_name }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="medical-date_of_birth" class="form-label">Date of Birth </label>
        <input
          type="date"
          id="medical-date_of_birth"
          :value="form.date_of_birth"
          disabled
          class="form-input bg-gray-100"
        />
        <p v-if="errors.date_of_birth" class="mt-1 text-sm text-red-500">
          {{ errors.date_of_birth }}
        </p>
      </div>
      <div>
        <label for="medical-contact_no" class="form-label">Contact Number </label>
        <input
          type="tel"
          id="medical-contact_no"
          :value="form.contact_no"
          disabled
          class="form-input bg-gray-100"
        />
        <p v-if="errors.contact_no" class="mt-1 text-sm text-red-500">{{ errors.contact_no }}</p>
      </div>
    </div>

    <div>
      <label for="medical-email_address" class="form-label">Email Address </label>
      <input
        type="email"
        id="medical-email_address"
        :value="form.email_address"
        disabled
        class="form-input bg-gray-100"
      />
      <p v-if="errors.email_address" class="mt-1 text-sm text-red-500">
        {{ errors.email_address }}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label for="medical-village" class="form-label">Village </label>
        <input
          type="text"
          id="medical-village"
          :value="form.village"
          disabled
          class="form-input bg-gray-100"
        />
        <p v-if="errors.village" class="mt-1 text-sm text-red-500">{{ errors.village }}</p>
      </div>
      <div>
        <label for="medical-gewog" class="form-label">Gewog </label>
        <input
          type="text"
          id="medical-gewog"
          :value="form.gewog"
          disabled
          class="form-input bg-gray-100"
        />
        <p v-if="errors.gewog" class="mt-1 text-sm text-red-500">{{ errors.gewog }}</p>
      </div>
      <div>
        <label for="medical-dzongkhag" class="form-label">Dzongkhag </label>
        <input
          type="text"
          id="medical-dzongkhag"
          :value="form.dzongkhag"
          disabled
          class="form-input bg-gray-100"
        />
        <p v-if="errors.dzongkhag" class="mt-1 text-sm text-red-500">{{ errors.dzongkhag }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="medical-registration_date" class="form-label"
          >BMHC Main Registration Date</label
        >
        <input
          type="date"
          id="medical-registration_date"
          :value="form.registration_date"
          disabled
          class="form-input bg-gray-100"
        />
        <p v-if="errors.registration_date" class="mt-1 text-sm text-red-500">
          {{ errors.registration_date }}
        </p>
      </div>
      <div>
        <label for="medical-expiry_date" class="form-label">BMHC Main Expiry Date</label>
        <input
          type="date"
          id="medical-expiry_date"
          :value="form.expiry_date"
          disabled
          class="form-input bg-gray-100"
        />
        <p v-if="errors.expiry_date" class="mt-1 text-sm text-red-500">{{ errors.expiry_date }}</p>
      </div>
    </div>
    <div>
      <label for="medical-designation" class="form-label">Designation (at this Institute)</label>
      <input
        type="text"
        id="medical-designation"
        :value="form.designation"
        @input="updateForm('designation', $event.target.value)"
        :disabled="mode === 'view'"
        required
        class="form-input"
        :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.designation }"
      />
      <p v-if="errors.designation" class="mt-1 text-sm text-red-500">{{ errors.designation }}</p>
    </div>

    <div>
      <label for="medical-date_of_joining" class="form-label"
        >Date of Joining (at this Institute)</label
      >
      <input
        type="date"
        id="medical-date_of_joining"
        :value="form.date_of_joining"
        @input="updateForm('date_of_joining', $event.target.value)"
        :disabled="mode === 'view'"
        required
        class="form-input"
        :class="{
          'border-red-300 focus:border-red-500 focus:ring-red-500': errors.date_of_joining,
        }"
      />
      <p v-if="errors.date_of_joining" class="mt-1 text-sm text-red-500">
        {{ errors.date_of_joining }}
      </p>
    </div>

    <div class="border-t pt-6">
      <div class="flex items-center justify-between mb-4">
        <label class="form-label text-lg">Education Details </label>
      </div>

      <div v-if="form.education_details && form.education_details.length > 0" class="space-y-4">
        <div
          v-for="(edu, index) in form.education_details"
          :key="edu.additional_info?.registration_no || index"
          class="border border-gray-200 rounded-lg p-4 bg-gray-50"
        >
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-medium text-gray-900">Education {{ index + 1 }}</h4>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Qualification Type</label>
              <input
                type="text"
                :value="edu.additional_info?.qualification_type_display || edu.type || 'N/A'"
                disabled
                class="form-input bg-gray-100"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
              <input
                type="text"
                :value="
                  edu.additional_info?.qualification_name_display || edu.qualification || 'N/A'
                "
                disabled
                class="form-input bg-gray-100"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Institute/University</label
              >
              <input
                type="text"
                :value="edu.institute || 'N/A'"
                disabled
                class="form-input bg-gray-100"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Year of Completion</label>
              <input
                type="text"
                :value="edu.year_of_completion || 'N/A'"
                disabled
                class="form-input bg-gray-100"
              />
            </div>
          </div>
          <div v-if="edu.additional_info" class="mt-4 pt-4 border-t border-gray-200">
            <h5 class="text-sm font-medium text-gray-700 mb-2">
              Additional BMHC Info (for this qualification)
            </h5>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div v-if="edu.additional_info.personnel_category">
                <span class="font-medium text-gray-600">Category:</span
                ><span class="ml-2">{{ edu.additional_info.personnel_category }}</span>
              </div>
              <div v-if="edu.additional_info.personnel_sub_category">
                <span class="font-medium text-gray-600">Sub-Category:</span
                ><span class="ml-2">{{ edu.additional_info.personnel_sub_category }}</span>
              </div>
              <div v-if="edu.additional_info.registration_no">
                <span class="font-medium text-gray-600">Qual. Reg. No:</span
                ><span class="ml-2">{{ edu.additional_info.registration_no }}</span>
              </div>
              <div v-if="edu.additional_info.registration_date">
                <span class="font-medium text-gray-600">Qual. Reg. Date:</span
                ><span class="ml-2">{{ edu.additional_info.registration_date }}</span>
              </div>
              <div v-if="edu.additional_info.expiry_date">
                <span class="font-medium text-gray-600">Qual. Expiry Date:</span
                ><span class="ml-2">{{ edu.additional_info.expiry_date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="border border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
          <div class="text-center mb-4">
            <h4 class="text-sm font-medium text-gray-800">Education Details Fields</h4>
            <p class="mt-1 text-xs text-gray-500">
              These fields will be auto-populated from BMHC records.
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-70">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Qualification Type</label
              ><input
                type="text"
                disabled
                class="form-input bg-gray-100 cursor-not-allowed"
                placeholder="(Auto-populated)"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Qualification</label
              ><input
                type="text"
                disabled
                class="form-input bg-gray-100 cursor-not-allowed"
                placeholder="(Auto-populated)"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Institute/University</label
              ><input
                type="text"
                disabled
                class="form-input bg-gray-100 cursor-not-allowed"
                placeholder="(Auto-populated)"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Year of Completion</label
              ><input
                type="text"
                disabled
                class="form-input bg-gray-100 cursor-not-allowed"
                placeholder="(Auto-populated)"
              />
            </div>
          </div>
          <div class="mt-6 text-center">
            <svg
              class="mx-auto h-10 w-10 text-gray-400 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p class="text-sm font-medium text-gray-700">
              {{
                dataEffectivelyFetched
                  ? 'No education details found in BMHC records.'
                  : 'Fetch faculty details to load education information.'
              }}
            </p>
            <p class="mt-1 text-xs text-gray-500" v-if="!dataEffectivelyFetched">
              Enter a CID and click "Fetch Details".
            </p>
          </div>
        </div>
      </div>
    </div>

    <div>
      <label for="medical-cv" class="form-label">Upload CV</label>
      <UploadFile
        :modelValue="form.cv"
        @update:modelValue="handleFileUpload('cv', $event)"
        accept=".pdf,.doc,.docx"
        :max-size="5"
        :disabled="mode === 'view'"
        :initial-file-name="form.cv_name"
        @file-removed="handleFileRemoval('cv')"
      />
      <p class="mt-1 text-sm">
        PDF, DOC, DOCX only, max 5MB.
        <span v-if="form.cv_name && mode !== 'add' && !form.cv">Current: {{ form.cv_name }}</span>
      </p>
      <p v-if="errors.cv" class="mt-1 text-sm text-red-500">{{ errors.cv }}</p>
    </div>

    <div>
      <label for="medical-passport_photo" class="form-label">Upload Passport Photo</label>
      <UploadFile
        :modelValue="form.passport_photo"
        @update:modelValue="handleFileUpload('passport_photo', $event)"
        accept="image/*"
        :max-size="2"
        :disabled="mode === 'view'"
        :initial-file-name="form.passport_photo_name"
        @file-removed="handleFileRemoval('passport_photo')"
      />
      <p class="mt-1 text-sm">
        Image only, max 2MB.
        <span v-if="form.passport_photo_name && mode !== 'add' && !form.passport_photo"
          >Current: {{ form.passport_photo_name }}</span
        >
      </p>
      <p v-if="errors.passport_photo" class="mt-1 text-sm text-red-500">
        {{ errors.passport_photo }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import UploadFile from '@/components/common/FileUpload.vue'
import apiServices from '@/services/services'

const props = defineProps({
  form: { type: Object, required: true },
  mode: { type: String, required: true, validator: (val) => ['add', 'edit', 'view'].includes(val) },
  errors: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:form', 'show-notification'])

const isFetchingDetails = ref(false)

const dataEffectivelyFetched = computed(() => {
  return !!props.form.application_profile_identifier && !!props.form.staff_name
})

const identifierInputDisabled = computed(() => {
  return (
    props.mode === 'view' ||
    isFetchingDetails.value ||
    (props.mode === 'edit' && dataEffectivelyFetched.value && props.form.id)
  )
})

const updateForm = (key, value) => {
  emit('update:form', { ...props.form, [key]: value })
}

const fetchFacultyByCid = async () => {
  if (!props.form.identifier) {
    emit('show-notification', 'warning', 'Input Required', 'Please enter a CID to search.')
    return
  }
  isFetchingDetails.value = true
  try {
    const response = await apiServices.getMhpcFullApplicationListByCid(props.form.identifier)
    const results = response?.data?.results || []

    if (results.length > 0) {
      populateFormWithFetchedData(results[0])
      emit(
        'show-notification',
        'success',
        'Faculty Found',
        'Faculty details have been populated successfully.'
      )
    } else {
      emit(
        'show-notification',
        'info',
        'No Results',
        'No medical faculty found for the provided CID.'
      )
    }
  } catch (error) {
    console.error('Error searching medical faculty by CID:', error)
    emit('show-notification', 'error', 'Search Error', 'Failed to fetch faculty details.')
  } finally {
    isFetchingDetails.value = false
  }
}

const populateFormWithFetchedData = (facultyData) => {
  const updatedFormData = {
    ...props.form,
    identifier: facultyData.CID || props.form.identifier,
    application_profile_identifier: facultyData.id || null,
    staff_name: facultyData.full_name || '',
    registration_type_name: '',
    nationality: facultyData.country || '',
    date_of_birth: facultyData.date_of_birth || '',
    village: facultyData.village || '',
    gewog: facultyData.gewog || '',
    dzongkhag: facultyData.dzongkhag || '',
    contact_no: facultyData.contact_no || '',
    email_address: facultyData.email_address || '',
    registration_date: '',
    expiry_date: '',
    education_details: [],
    cid: facultyData.CID || '',
    designation: props.form.designation || '',
    date_of_joining: props.form.date_of_joining || new Date().toISOString().split('T')[0],
  }

  const isDifferentFacultyInEditMode =
    props.mode === 'edit' &&
    props.form.id &&
    props.form.application_profile_identifier &&
    props.form.application_profile_identifier !== facultyData.id

  if (props.mode === 'add' || isDifferentFacultyInEditMode) {
    updatedFormData.cv = null
    updatedFormData.cv_name = ''
    updatedFormData.passport_photo = null
    updatedFormData.passport_photo_name = ''
  }

  emit('update:form', updatedFormData)
}

const handleFileUpload = (field, file) => {
  updateForm(field, file)
  if (file) {
    updateForm(`${field}_name`, file.name)
  } else {
    updateForm(`${field}_name`, '')
  }
}

const handleFileRemoval = (field) => {
  updateForm(field, null)
  updateForm(`${field}_name`, '')
}
</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1.5;
}
.form-input,
.form-select {
  @apply block w-full rounded-md border-gray-300 shadow-sm p-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:cursor-not-allowed transition-colors duration-150;
}
.form-input:disabled,
.form-select:disabled {
  @apply bg-gray-100 text-gray-500;
}
.btn {
  @apply inline-flex items-center justify-center rounded-md border py-2 px-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}
.btn-primary {
  @apply border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500;
}
.loader {
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>