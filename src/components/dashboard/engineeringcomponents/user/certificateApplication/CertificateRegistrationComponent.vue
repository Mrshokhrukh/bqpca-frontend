<template>
  <div class="mx-auto py-4 md:py-6">
    <header class="text-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Engineering Certification Registration</h1>
      <div class="text-sm text-gray-500">Step {{ currentStep }} of 2</div>
    </header>

    <!-- Step 1: Registration Type Selection -->
    <RegistrationTypeSelector
      v-if="currentStep === 1"
      :options="registrationOptions"
      v-model="selectedType"
      @next="showConfirmationModal = true"
    />

    <!-- Step 2: Dynamic Form -->
    <DynamicRegistrationForm
      v-if="currentStep === 2"
      :selected-type="selectedType"
      v-model="formData"
      @back="handleBack"
      @submit="handleSubmit"
    />

    <!-- Confirmation Modal -->
    <ConfirmationModal
      :show="showConfirmationModal"
      :selected-type="selectedTypeLabel"
      @close="showConfirmationModal = false"
      @proceed="proceedToNextStep"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import RegistrationTypeSelector from './RegistrationTypeSelector.vue'
import DynamicRegistrationForm from './ApplicationForm.vue'
import ConfirmationModal from './ConfirmationModal.vue'
import { useToast } from 'vue-toastification'

// Step management
const currentStep = ref(1)
const selectedType = ref(null)
const showConfirmationModal = ref(false)

// Form data for CID and non-CID holders
const formData = ref({
  cid: '',
  workPermitNo: '',
  full_name: '',
  date_of_birth: '',
  nationality: '',
  contact_number: '',
  permanent_dzongkhag: '',
  permanent_gewog: '',
  permanent_village: '',
  gender: '',
  email: '',
  city: '',
  state: '',
  country: '',
  passport_photo: null,
  documents: [],
  declaration: false,
  remarks: '',
  qualification_type: '',
  qualification_name: '',
  institute: '',
  year_of_completion: null,
})

// Registration options
const registrationOptions = [
  { value: 'cid', label: 'CID Holder', description: 'Bhutanese citizens with valid CID' },
  { value: 'non-cid', label: 'Non-CID Holder', description: 'Foreign engineering professionals' },
]

// Computed property for selected type label
const selectedTypeLabel = computed(
  () => registrationOptions.find((opt) => opt.value === selectedType.value)?.label,
)

// Proceed to the next step function
function proceedToNextStep() {
  showConfirmationModal.value = false
  currentStep.value++
}

// Handle going back to the previous step
function handleBack() {
  currentStep.value--
  resetForm()
}

const toast = useToast()

// Handle form submission
function handleSubmit() {
  let missingFields = []

  // Common required fields for both types
  if (!formData.value.full_name) {
    missingFields.push('Full Name')
  }
  if (!formData.value.date_of_birth) {
    missingFields.push('Date of Birth')
  }
  if (!formData.value.gender) {
    missingFields.push('Gender')
  }
  if (!formData.value.contact_number) {
    missingFields.push('Contact Number')
  }
  if (!formData.value.passport_photo) {
    missingFields.push('Passport Photo')
  }
  if (!formData.value.declaration) {
    missingFields.push('Declaration')
  }

  // CID-specific required fields
  if (selectedType.value === 'cid') {
    if (!formData.value.cid) {
      missingFields.push('CID Number')
    }
    if (!formData.value.permanent_dzongkhag) {
      missingFields.push('Dzongkhag')
    }
    if (!formData.value.permanent_village) {
      missingFields.push('Village')
    }
  }
  // Non-CID specific required fields
  else {
    if (!formData.value.nationality) {
      missingFields.push('Nationality')
    }
    if (!formData.value.email) {
      missingFields.push('Email')
    }
    if (!formData.value.workPermitNo) {
      missingFields.push('Work Permit Number')
    }
    if (!formData.value.country) {
      missingFields.push('Country')
    }
  }

  // Engineering qualification specific validations
  if (!formData.value.qualification_type) {
    missingFields.push('Qualification Type')
  }
  if (!formData.value.qualification_name) {
    missingFields.push('Qualification Name')
  }
  if (!formData.value.institute) {
    missingFields.push('Institute/University')
  }
  if (!formData.value.year_of_completion) {
    missingFields.push('Year of Completion')
  }

  if (missingFields.length > 0) {
    const missingFieldsString = missingFields.join(', ')
    toast.error(`Please fill in the following required fields: ${missingFieldsString}`)
    return // Prevent submission
  }
}

// Reset form data
function resetForm() {
  formData.value = {
    cid: '',
    workPermitNo: '',
    full_name: '',
    date_of_birth: '',
    nationality: '',
    contact_number: '',
    permanent_dzongkhag: '',
    permanent_gewog: '',
    permanent_village: '',
    gender: '',
    email: '',
    city: '',
    state: '',
    country: '',
    passport_photo: null,
    documents: [],
    declaration: false,
    remarks: '',
    qualification_type: '',
    qualification_name: '',
    institute: '',
    year_of_completion: null,
  }
}
</script>
