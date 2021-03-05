<template>
  <div class="container mx-auto p-4 md:p-6">
    <header class="text-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Medical Certification Registration</h1>
      <div class="text-sm text-gray-500">Step {{ currentStep }} of 2</div>
    </header>

    <!-- Step 1: Registration Type Selection -->
    <RegistrationTypeSelector v-if="currentStep === 1" :options="registrationOptions" v-model="selectedType"
      @next="showConfirmationModal = true" />

    <!-- Step 2: Dynamic Form -->
    <DynamicRegistrationForm v-if="currentStep === 2" :selected-type="selectedType" v-model="formData"
      @back="handleBack" @submit="handleSubmit" />

    <!-- Confirmation Modal -->
    <ConfirmationModal :show="showConfirmationModal" :selected-type="selectedTypeLabel"
      @close="showConfirmationModal = false" @proceed="proceedToNextStep" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import RegistrationTypeSelector from './RegistrationTypeSelector.vue';
import DynamicRegistrationForm from './ApplicationForm.vue';
import ConfirmationModal from './ConfirmationModal.vue';
import { useToast } from 'vue-toastification';  // Import useToast

// Step management
const currentStep = ref(1);
const selectedType = ref(null);
const showConfirmationModal = ref(false);

// Form data for CID and non-CID holders
const formData = ref({
  cid_no: '',  // Updated field names to match DynamicRegistrationForm
  passport: '',
  full_name: '', // Updated
  date_of_birth: '', // Updated
  nationality: '',
  contact_no: '', // Updated
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

const toast = useToast();  // Initialize Toast

// Handle form submission
function handleSubmit() {
  let missingFields = [];

  if (selectedType.value === 'cid') {
    if (!formData.value.cid_no) {
      missingFields.push('CID Number');
    }
    if (!formData.value.full_name) {
      missingFields.push('Full Name');
    }
    if (!formData.value.date_of_birth) {
      missingFields.push('Date of Birth');
    }
    if (!formData.value.declaration) {
      missingFields.push('Declaration');
    }
  } else {
    if (!formData.value.nationality) {
      missingFields.push('Nationality');
    }
    if (!formData.value.declaration) {
      missingFields.push('Declaration');
    }
  }

  if (missingFields.length > 0) {
    const missingFieldsString = missingFields.join(', ');
    toast.error(`Please fill in the following required fields: ${missingFieldsString}`);  // Vue Toast
    return; //  **Crucially, prevent submission**
  }
}

// Reset form data
function resetForm() {
  formData.value = {
    cid_no: '',
    passport: '',
    full_name: '',
    date_of_birth: '',
    nationality: '',
    contact_no: '',
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
