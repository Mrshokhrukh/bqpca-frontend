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
    <!-- FIX: The @submit listener has been removed. The child component now handles everything. -->
    <DynamicRegistrationForm
      v-if="currentStep === 2"
      :selected-type="selectedType"
      v-model="formData"
      @back="handleBack"
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
// FIX: The useToast import is no longer needed in this parent component.
// import { useToast } from 'vue-toastification'

// Step management
const currentStep = ref(1)
const selectedType = ref(null)
const showConfirmationModal = ref(false)

// Form data for CID and non-CID holders
// This is still needed to pass as a v-model and for the resetForm function.
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

// FIX: The toast instance is no longer needed.
// const toast = useToast()

// FIX: This entire function was the source of the problem. It has been removed.
// The child component (`ApplicationForm.vue`) handles its own submission logic,
// including validation and showing toasts. This parent function was creating
// a redundant, incorrect validation check.
/*
function handleSubmit() {
  // ... ALL THE DELETED VALIDATION LOGIC WAS HERE ...
}
*/

// Reset form data - still needed for the 'handleBack' function
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