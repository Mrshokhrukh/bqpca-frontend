<template>
  <div class="max-w-6xl mx-auto p-4 md:p-6">
    <header class="text-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Medical Certification Registration</h1>
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
import { ref, computed } from 'vue';
import RegistrationTypeSelector from './RegistrationTypeSelector.vue';
import DynamicRegistrationForm from './DynamicRegistrationForm.vue';
import ConfirmationModal from './ConfirmationModal.vue';

// Step management
const currentStep = ref(1);
const selectedType = ref(null);
const showConfirmationModal = ref(false);

// Form data for CID and non-CID holders
const formData = ref({
  cid: '',
  passport: '',
  fullName: '',
  dob: '',
  nationality: '',
  contact: '',
  dzongkhag: '',
  gender: '',
  village: '',
  image: null,
  documents: [],
  declaration: false,
  remarks: ''
});

// Registration options
const registrationOptions = [
  { value: 'cid', label: 'CID Holder', description: 'Bhutanese citizens with valid CID' },
  { value: 'non-cid', label: 'Non-CID Holder', description: 'Foreign medical professionals' }
];

// Computed property for selected type label
const selectedTypeLabel = computed(() =>
  registrationOptions.find(opt => opt.value === selectedType.value)?.label
);

// Proceed to the next step
function proceedToNextStep() {
  showConfirmationModal.value = false;
  currentStep.value++;
}

// Handle going back to the previous step
function handleBack() {
  currentStep.value--;
  resetForm();
}

// Handle form submission
function handleSubmit() {
  // Validation for CID holders
  if (selectedType.value === 'cid') {
    if (!formData.value.cid || !formData.value.fullName || !formData.value.dob || !formData.value.declaration) {
      alert('Please fill in all required fields for CID holders.');
      return;
    }
  }
  // Validation for Non-CID holders
  else {
    if (!formData.value.passport || !formData.value.nationality || !formData.value.declaration) {
      alert('Please fill in all required fields for Non-CID holders.');
      return;
    }
  }

  // Submit form data
  console.log('Form submitted:', formData.value);
  // Add your submission logic here (e.g., API call)
}

// Reset form data
function resetForm() {
  formData.value = {
    cid: '',
    passport: '',
    fullName: '',
    dob: '',
    nationality: '',
    contact: '',
    dzongkhag: '',
    gender: '',
    village: '',
    image: null,
    documents: [],
    declaration: false,
    remarks: ''
  };
}
</script>
