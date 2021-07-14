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
          :disabled="
            mode === 'view' ||
            isFetchingDetails ||
            (mode === 'edit' && apiProvidedFields.identifier)
          "
          required
          class="form-input pr-24"
          :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.identifier }"
          placeholder="Enter CID Number"
        />
        <button
          v-if="mode !== 'view'"
          type="button"
          @click="triggerFetchAcademicDetails"
          :disabled="
            isFetchingDetails ||
            !form.identifier ||
            (mode === 'edit' && apiProvidedFields.identifier)
          "
          class="absolute inset-y-0 right-0 flex items-center px-3 rounded-r-md border-l bg-gray-50 hover:bg-gray-100 focus:outline-none"
        >
          <span
            class="text-sm text-gray-600"
            :class="{ 'opacity-50': isFetchingDetails || !form.identifier }"
          >
            {{ isFetchingDetails ? 'Fetching...' : 'Fetch Data' }}
          </span>
        </button>
      </div>
      <p v-if="errors.identifier" class="mt-1 text-sm text-red-500">{{ errors.identifier }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="academic-nationality" class="form-label">Nationality</label>
        <input
          type="text"
          id="academic-nationality"
          :value="form.nationality"
          @input="updateForm('nationality', $event.target.value)"
          :disabled="mode === 'view' || (isDataFetchedFromDCRC && apiProvidedFields.nationality)"
          required
          class="form-input"
          :class="{
            'bg-gray-100 text-gray-500': isDataFetchedFromDCRC && apiProvidedFields.nationality,
            'border-red-300 focus:border-red-500 focus:ring-red-500': errors.nationality,
          }"
        />
        <p v-if="errors.nationality" class="mt-1 text-sm text-red-500">{{ errors.nationality }}</p>
      </div>
      <div>
        <label for="academic-full_name" class="form-label">Full Name</label>
        <input
          type="text"
          id="academic-full_name"
          :value="form.staff_name"
          @input="updateForm('staff_name', $event.target.value)"
          :disabled="mode === 'view' || (isDataFetchedFromDCRC && apiProvidedFields.staff_name)"
          required
          class="form-input"
          :class="{
            'bg-gray-100 text-gray-500': isDataFetchedFromDCRC && apiProvidedFields.staff_name,
            'border-red-300 focus:border-red-500 focus:ring-red-500': errors.staff_name,
          }"
        />
        <p v-if="errors.staff_name" class="mt-1 text-sm text-red-500">{{ errors.staff_name }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="academic-date_of_birth" class="form-label">Date of Birth</label>
        <input
          type="date"
          id="academic-date_of_birth"
          :value="form.date_of_birth"
          @input="updateForm('date_of_birth', $event.target.value)"
          :disabled="mode === 'view' || (isDataFetchedFromDCRC && apiProvidedFields.date_of_birth)"
          required
          class="form-input"
          :class="{
            'bg-gray-100 text-gray-500': isDataFetchedFromDCRC && apiProvidedFields.date_of_birth,
            'border-red-300 focus:border-red-500 focus:ring-red-500': errors.date_of_birth,
          }"
        />
        <p v-if="errors.date_of_birth" class="mt-1 text-sm text-red-500">
          {{ errors.date_of_birth }}
        </p>
      </div>
      <div>
        <label for="academic-contact_no" class="form-label">Contact Number</label>
        <input
          type="tel"
          id="academic-contact_no"
          :value="form.contact_no"
          @input="updateForm('contact_no', $event.target.value)"
          :disabled="mode === 'view' || (isDataFetchedFromDCRC && apiProvidedFields.contact_no)"
          required
          class="form-input"
          :class="{
            'bg-gray-100 text-gray-500': isDataFetchedFromDCRC && apiProvidedFields.contact_no,
            'border-red-300 focus:border-red-500 focus:ring-red-500': errors.contact_no,
          }"
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
        :disabled="mode === 'view' || (isDataFetchedFromDCRC && apiProvidedFields.email_address)"
        required
        class="form-input"
        :class="{
          'bg-gray-100 text-gray-500': isDataFetchedFromDCRC && apiProvidedFields.email_address,
          'border-red-300 focus:border-red-500 focus:ring-red-500': errors.email_address,
        }"
      />
      <p v-if="errors.email_address" class="mt-1 text-sm text-red-500">
        {{ errors.email_address }}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label for="academic-village" class="form-label">Village</label>
        <input
          type="text"
          id="academic-village"
          :value="form.village"
          @input="updateForm('village', $event.target.value)"
          :disabled="mode === 'view' || (isDataFetchedFromDCRC && apiProvidedFields.village)"
          required
          class="form-input"
          :class="{
            'bg-gray-100 text-gray-500': isDataFetchedFromDCRC && apiProvidedFields.village,
            'border-red-300 focus:border-red-500 focus:ring-red-500': errors.village,
          }"
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
          :disabled="mode === 'view' || (isDataFetchedFromDCRC && apiProvidedFields.gewog)"
          required
          class="form-input"
          :class="{
            'bg-gray-100 text-gray-500': isDataFetchedFromDCRC && apiProvidedFields.gewog,
            'border-red-300 focus:border-red-500 focus:ring-red-500': errors.gewog,
          }"
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
          :disabled="mode === 'view' || (isDataFetchedFromDCRC && apiProvidedFields.dzongkhag)"
          required
          class="form-input"
          :class="{
            'bg-gray-100 text-gray-500': isDataFetchedFromDCRC && apiProvidedFields.dzongkhag,
            'border-red-300 focus:border-red-500 focus:ring-red-500': errors.dzongkhag,
          }"
        />
        <p v-if="errors.dzongkhag" class="mt-1 text-sm text-red-500">{{ errors.dzongkhag }}</p>
      </div>
    </div>

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
        :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.designation }"
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
        :class="{
          'border-red-300 focus:border-red-500 focus:ring-red-500': errors.date_of_joining,
        }"
      />
      <p v-if="errors.date_of_joining" class="mt-1 text-sm text-red-500">
        {{ errors.date_of_joining }}
      </p>
    </div>

    <div>
      <label class="form-label">Education Details</label>
      <div v-if="isLoadingMasters" class="text-center py-4">
        <p class="text-gray-500">Loading education options...</p>
      </div>
      <div v-else-if="mode !== 'view'" class="space-y-4">
        <div
          v-for="(edu, index) in form.education_details"
          :key="index"
          class="border p-4 rounded-lg"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label :for="`edu-qualification-type-${index}`" class="form-label"
                >Qualification Type</label
              >
              <select
                :id="`edu-qualification-type-${index}`"
                :value="edu.qualification_type_id"
                @input="updateEducationDetail(index, 'qualification_type_id', $event.target.value)"
                required
                class="form-select"
                :class="{
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    errors[`edu_qualification_type_${index}`],
                }"
              >
                <option value="" disabled>Select Qualification Type</option>
                <option
                  v-for="typeOpt in qualificationTypeOptions"
                  :key="typeOpt.value"
                  :value="typeOpt.value"
                >
                  {{ typeOpt.label }}
                </option>
              </select>
              <p v-if="errors[`edu_qualification_type_${index}`]" class="mt-1 text-sm text-red-500">
                {{ errors[`edu_qualification_type_${index}`] }}
              </p>
            </div>
            <div>
              <label :for="`edu-qualification-name-${index}`" class="form-label"
                >Qualification Name</label
              >
              <select
                :id="`edu-qualification-name-${index}`"
                :value="edu.qualification_id"
                @input="updateEducationDetail(index, 'qualification_id', $event.target.value)"
                required
                class="form-select"
                :class="{
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    errors[`edu_qualification_name_${index}`],
                }"
              >
                <option value="" disabled>Select Qualification Name</option>
                <option
                  v-for="qualOpt in qualificationNameOptions"
                  :key="qualOpt.value"
                  :value="qualOpt.value"
                >
                  {{ qualOpt.label }}
                </option>
              </select>
              <p v-if="errors[`edu_qualification_name_${index}`]" class="mt-1 text-sm text-red-500">
                {{ errors[`edu_qualification_name_${index}`] }}
              </p>
            </div>
            <div>
              <label :for="`edu-institute-${index}`" class="form-label">Institute/University</label>
              <input
                :id="`edu-institute-${index}`"
                type="text"
                :value="edu.institute"
                @input="updateEducationDetail(index, 'institute', $event.target.value)"
                required
                class="form-input"
                :class="{
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    errors[`edu_institute_${index}`],
                }"
              />
              <p v-if="errors[`edu_institute_${index}`]" class="mt-1 text-sm text-red-500">
                {{ errors[`edu_institute_${index}`] }}
              </p>
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
                :class="{
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    errors[`edu_year_${index}`],
                }"
              />
              <p v-if="errors[`edu_year_${index}`]" class="mt-1 text-sm text-red-500">
                {{ errors[`edu_year_${index}`] }}
              </p>
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
      <div v-else>
        <!-- View Mode for Education -->
        <div v-if="isLoadingMasters" class="text-center py-4">
          <p class="text-gray-500">Loading education options...</p>
        </div>
        <div v-else>
          <div
            class="border p-4 rounded-lg mb-4"
            v-for="(edu, index) in form.education_details"
            :key="`view-${index}`"
          >
            <p>
              <strong>Qualification Type:</strong>
              {{ getQualificationTypeName(edu.qualification_type_id) }}
            </p>
            <p>
              <strong>Qualification Name:</strong>
              {{ getQualificationNameLabel(edu.qualification_id) }}
            </p>
            <p><strong>Institute:</strong> {{ edu.institute }}</p>
            <p><strong>Year:</strong> {{ edu.year_of_completion }}</p>
          </div>
          <p
            class="text-sm text-gray-500"
            v-if="
              (!form.education_details || form.education_details.length === 0) && !isLoadingMasters
            "
          >
            No education details available.
          </p>
        </div>
      </div>
    </div>

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
      <p class="mt-1 text-sm">
        PDF only, max 5MB.
        <span v-if="form.cv_name && mode !== 'add'">Current: {{ form.cv_name }}</span>
      </p>
      <p v-if="errors.cv" class="mt-1 text-sm text-red-500">{{ errors.cv }}</p>
    </div>

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
      <p class="mt-1 text-sm">
        Image only, max 2MB.
        <span v-if="form.passport_photo_name && mode !== 'add'"
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
import { ref, watch, onMounted } from 'vue'
import UploadFile from '@/components/common/FileUpload.vue'
import apiServices from '@/services/services'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'

const props = defineProps({
  form: { type: Object, required: true },
  mode: { type: String, required: true },
  errors: { type: Object, default: () => ({}) },
  minYear: { type: Number, required: true },
  currentYear: { type: Number, required: true },
})

const emit = defineEmits(['update:form', 'show-notification', 'update:isDataFetched']) // Added 'update:isDataFetched'

const toast = useToast()
const authStore = useAuthStore()
const isFetchingDetails = ref(false)
const isDataFetchedFromDCRC = ref(false) // Renamed to be specific to this component's fetch
const apiProvidedFields = ref({})

const qualificationTypeOptions = ref([])
const qualificationNameOptions = ref([])
const isLoadingMasters = ref(false)

watch(
  () => props.form.identifier,
  (newVal, oldVal) => {
    if (newVal === '' && oldVal !== '' && !isFetchingDetails.value) {
      isDataFetchedFromDCRC.value = false
      apiProvidedFields.value = {}
      emit('update:isDataFetched', false) // Notify parent
    }
    // If CID is entered by user, it's not strictly "API provided" until fetch,
    // but we disable the button based on this.
    if (newVal !== '' && props.mode !== 'view') {
      // apiProvidedFields.value.identifier = true; // Let fetch operation handle this
    } else if (newVal === '') {
      delete apiProvidedFields.value.identifier
    }
  },
)

// Watch for changes in the form prop, especially when opening in edit mode
watch(
  () => props.form,
  (newFormData, oldFormData) => {
    if (props.mode === 'edit' || props.mode === 'view') {
      // If the parent form data already has an identifier, it implies data might have been loaded.
      // Reset this component's fetch status if the identifier changes (meaning new record loaded by parent)
      // or if it's the first time loading with an identifier.
      if (
        newFormData.identifier &&
        (newFormData.identifier !== oldFormData?.identifier || !isDataFetchedFromDCRC.value)
      ) {
        isDataFetchedFromDCRC.value = false // Reset, allow re-fetch or assume parent handles initial state
        apiProvidedFields.value = {}

        // Pre-populate based on what parent MIGHT have fetched or pre-filled
        // Only mark as API provided if there's a non-empty value, to allow manual entry for empty fields.
        const initialApiFields = {}
        if (newFormData.identifier) initialApiFields.identifier = true // Identifier is always "known"
        if (newFormData.staff_name) initialApiFields.staff_name = true
        if (newFormData.date_of_birth) initialApiFields.date_of_birth = true
        if (newFormData.village) initialApiFields.village = true
        if (newFormData.gewog) initialApiFields.gewog = true
        if (newFormData.dzongkhag) initialApiFields.dzongkhag = true

        // For contact_no, nationality, email_address: only mark if they have a value,
        // otherwise they should remain editable if not fetched by DCRC.
        if (newFormData.contact_no) initialApiFields.contact_no = true
        if (newFormData.nationality) initialApiFields.nationality = true
        if (newFormData.email_address) initialApiFields.email_address = true

        // If the parent indicates that DCRC data was fetched for these fields, use that info.
        // This requires parent to somehow signal which fields were from DCRC.
        // For simplicity now, we rely on direct non-empty values.
        // A more robust solution might involve the parent passing an `initialApiProvidedFields` prop.

        apiProvidedFields.value = initialApiFields
        if (Object.keys(initialApiFields).length > 1) {
          // More than just identifier
          isDataFetchedFromDCRC.value = true // Assume data was loaded if several fields are present
          emit('update:isDataFetched', true)
        }
      }
    } else if (props.mode === 'add') {
      isDataFetchedFromDCRC.value = false
      apiProvidedFields.value = {}
      emit('update:isDataFetched', false)
    }
  },
  { deep: true, immediate: true },
)

const updateForm = (key, value) => {
  const updatedForm = { ...props.form, [key]: value }
  // If user manually changes a field that was previously API-provided by DCRC,
  // mark it as no longer API-provided for writability.
  if (apiProvidedFields.value[key]) {
    delete apiProvidedFields.value[key]
  }
  emit('update:form', updatedForm)
}

const updateEducationDetail = (index, key, value) => {
  const updatedEducationDetails = [...props.form.education_details]
  updatedEducationDetails[index] = { ...updatedEducationDetails[index], [key]: value }
  if (key === 'year_of_completion') {
    updatedEducationDetails[index][key] = value ? parseInt(value, 10) : ''
  }
  if (key === 'qualification_type_id') {
    updatedEducationDetails[index].qualification_id = ''
  }
  updateForm('education_details', updatedEducationDetails) // This will trigger the main updateForm
}

const addEducation = () => {
  const currentEducationDetails = props.form.education_details || []
  const updatedEducationDetails = [
    ...currentEducationDetails,
    {
      qualification_type_id: '',
      qualification_id: '',
      institute: '',
      year_of_completion: '',
    },
  ]
  updateForm('education_details', updatedEducationDetails)
}

const removeEducation = (index) => {
  const updatedEducationDetails = props.form.education_details.filter((_, i) => i !== index)
  updateForm('education_details', updatedEducationDetails)
}

const getQualificationTypeName = (typeId) => {
  const type = qualificationTypeOptions.value.find((t) => t.value == typeId)
  return type ? type.label : typeId || 'N/A'
}

const getQualificationNameLabel = (qualId) => {
  const qual = qualificationNameOptions.value.find((q) => q.value == qualId)
  return qual ? qual.label : qualId || 'N/A'
}

const fetchEducationMasters = async () => {
  isLoadingMasters.value = true
  try {
    const [typeRes, nameRes] = await Promise.all([
      apiServices.getMhpcMastersQualificationTypes(),
      apiServices.getMhpcMastersQualifications(),
    ])

    if (typeRes.data && Array.isArray(typeRes.data.results)) {
      qualificationTypeOptions.value = typeRes.data.results.map((item) => ({
        value: item.id,
        label: item.qualification_type_name || `Type ID: ${item.id}`,
      }))
    } else {
      console.error('Qualification Types API did not return expected structure:', typeRes.data)
      qualificationTypeOptions.value = []
    }

    if (nameRes.data && Array.isArray(nameRes.data.results)) {
      qualificationNameOptions.value = nameRes.data.results.map((item) => ({
        value: item.id,
        label: item.qualification,
      }))
    } else {
      console.error('Qualification Names API did not return expected structure:', nameRes.data)
      qualificationNameOptions.value = []
    }

    if (
      qualificationTypeOptions.value.length === 0 &&
      (!typeRes.data || !Array.isArray(typeRes.data.results))
    ) {
      toast.error('Failed to load qualification types.')
    }
    if (
      qualificationNameOptions.value.length === 0 &&
      (!nameRes.data || !Array.isArray(nameRes.data.results))
    ) {
      toast.error('Failed to load qualification names.')
    }
  } catch (error) {
    console.error('Error fetching education masters:', error)
    toast.error('Failed to load education options. Please try refreshing.')
    qualificationTypeOptions.value = []
    qualificationNameOptions.value = []
  } finally {
    isLoadingMasters.value = false
  }
}

onMounted(() => {
  fetchEducationMasters()
})

const triggerFetchAcademicDetails = async () => {
  if (!props.form.identifier) {
    emit(
      'show-notification',
      'error',
      'Validation Error',
      'CID Number is required to fetch details.',
    )
    return
  }

  const userId = authStore.userId
  if (!userId) {
    emit(
      'show-notification',
      'error',
      'Authentication Error',
      'User ID is unavailable. Please re-login.',
    )
    isFetchingDetails.value = false
    return
  }

  isFetchingDetails.value = true
  // Reset specific DCRC fields tracker
  const newApiProvidedFields = { identifier: true } // Identifier initiated the fetch

  try {
    const response = await apiServices.fetchCitizenDetails(props.form.identifier, {
      params: { user_id: userId },
    })

    let updatedFormFields = {} // Fields to update in parent

    if (response?.data) {
      const fetchedData = response.data
      isDataFetchedFromDCRC.value = true // Mark that DCRC fetch was successful
      emit('update:isDataFetched', true) // Notify parent

      const formatDateForInput = (dateString) => {
        if (!dateString) return ''
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString
        const parts = dateString.split('/')
        if (parts.length === 3) {
          const [day, month, year] = parts
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        }
        return dateString
      }

      // Build updates and track which fields DCRC provided a non-null value for
      if (fetchedData.applicants_name !== null && fetchedData.applicants_name !== undefined) {
        updatedFormFields.staff_name = fetchedData.applicants_name
        newApiProvidedFields.staff_name = true
      }
      if (fetchedData.date_of_birth !== null && fetchedData.date_of_birth !== undefined) {
        updatedFormFields.date_of_birth = formatDateForInput(fetchedData.date_of_birth)
        newApiProvidedFields.date_of_birth = true
      }
      if (fetchedData.village !== null && fetchedData.village !== undefined) {
        updatedFormFields.village = fetchedData.village
        newApiProvidedFields.village = true
      }
      if (fetchedData.gewog !== null && fetchedData.gewog !== undefined) {
        updatedFormFields.gewog = fetchedData.gewog
        newApiProvidedFields.gewog = true
      }
      if (fetchedData.dzongkhag !== null && fetchedData.dzongkhag !== undefined) {
        updatedFormFields.dzongkhag = fetchedData.dzongkhag
        newApiProvidedFields.dzongkhag = true
      }
      // For contact_no, ensure API provides a non-empty, non-null value to mark as API provided
      if (
        fetchedData.mobile_number !== null &&
        fetchedData.mobile_number !== undefined &&
        String(fetchedData.mobile_number).trim() !== ''
      ) {
        updatedFormFields.contact_no = fetchedData.mobile_number
        newApiProvidedFields.contact_no = true
      } else if (
        fetchedData.mobile_number === null ||
        String(fetchedData.mobile_number).trim() === ''
      ) {
        // If API returns empty or null for contact_no, ensure it's NOT marked as API provided
        // and remains editable. We can also choose to clear it in the form.
        updatedFormFields.contact_no = '' // Or props.form.contact_no to keep previous manual entry
        delete newApiProvidedFields.contact_no
      }

      if (
        fetchedData.nationality !== null &&
        fetchedData.nationality !== undefined &&
        String(fetchedData.nationality).trim() !== ''
      ) {
        updatedFormFields.nationality = fetchedData.nationality
        newApiProvidedFields.nationality = true
      } else if (
        fetchedData.nationality === null ||
        String(fetchedData.nationality).trim() === ''
      ) {
        updatedFormFields.nationality = ''
        delete newApiProvidedFields.nationality
      }

      if (
        fetchedData.email_address !== null &&
        fetchedData.email_address !== undefined &&
        String(fetchedData.email_address).trim() !== ''
      ) {
        updatedFormFields.email_address = fetchedData.email_address
        newApiProvidedFields.email_address = true
      } else if (
        fetchedData.email_address === null ||
        String(fetchedData.email_address).trim() === ''
      ) {
        updatedFormFields.email_address = ''
        delete newApiProvidedFields.email_address
      }
      // gender and religion from your initial API response example are not in the form
      // if (fetchedData.gender) { ... }
      // if (fetchedData.religion) { ... }

      apiProvidedFields.value = newApiProvidedFields // Update the local tracker
      emit('update:form', { ...props.form, ...updatedFormFields }) // Send all updates to parent

      const successMessage = fetchedData.changes_saved
        ? 'Faculty data fetched and user profile updated successfully from census.'
        : 'Faculty data fetched successfully from census.'
      emit('show-notification', 'success', 'Data Fetched', successMessage)
    } else {
      isDataFetchedFromDCRC.value = true // Attempt was made
      emit('update:isDataFetched', true) // Notify parent
      apiProvidedFields.value = { identifier: true } // Only identifier is "known" from this process
      emit(
        'show-notification',
        'info',
        'No Data Found',
        'No census data found for this CID. Please enter details manually.',
      )
    }
  } catch (error) {
    isDataFetchedFromDCRC.value = true // Attempt was made
    emit('update:isDataFetched', true)
    apiProvidedFields.value = { identifier: true }
    console.error('Error fetching academic details:', error)
    let errorMessage = 'Failed to fetch academic details.'
    if (error.response?.data) {
      /* ... error parsing ... */
    }
    emit('show-notification', 'error', 'Fetch Failed', errorMessage)
  } finally {
    isFetchingDetails.value = false
  }
}
</script>

<style scoped>
/* Styles remain the same */
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1.5;
}
.form-input,
.form-select {
  @apply block w-full rounded-md border-gray-300 shadow-sm p-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-150;
}
.btn {
  @apply inline-flex items-center justify-center rounded-md border py-2 px-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}
.btn-secondary {
  @apply border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
}
</style>
