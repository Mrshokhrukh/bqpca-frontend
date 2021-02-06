<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Form Header -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Additional Qualification Application
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Provide details of your additional qualification to update your profile. Fields marked with an asterisk (<span
          class="text-red-600">*</span>) are required.
      </p>
    </div>

    <form @submit.prevent="submitForm" class="bg-white border rounded-xl shadow-sm p-6">
      <!-- Qualification Details -->
      <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
        <h3 class="text-lg font-semibold text-gray-900">Qualification Details</h3>
        <p class="mt-1 text-sm text-gray-500">Enter the details of your additional qualification.</p>
      </div>

      <div class="p-8 space-y-6">
        <!-- Qualification Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 required">Qualification Type</label>
          <select v-model="formData.qualificationType"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            required>
            <option value="">Select Qualification Type</option>
            <option value="degree">Degree</option>
            <option value="diploma">Diploma</option>
            <option value="certificate">Certificate</option>
          </select>
          <span v-if="errors.qualificationType" class="text-sm text-red-500 mt-1">{{
      errors.qualificationType
    }}</span>
        </div>

        <!-- Institution Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 required">Institution Name</label>
          <input type="text" v-model="formData.institutionName"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            required />
          <span v-if="errors.institutionName" class="text-sm text-red-500 mt-1">{{ errors.institutionName }}</span>
        </div>

        <!-- Completion Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 required">Completion Date</label>
          <input type="date" v-model="formData.completionDate"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            required />
          <span v-if="errors.completionDate" class="text-sm text-red-500 mt-1">{{ errors.completionDate }}</span>
        </div>

        <!-- Document Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 required">Upload Certificate</label>
          <input type="file" @change="handleFileUpload" accept=".pdf,.jpg,.jpeg,.png" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4
                    file:rounded-lg file:border-0 file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
          <span v-if="errors.certificate" class="text-sm text-red-500 mt-1">{{ errors.certificate }}</span>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="mt-12 flex justify-end space-x-4 p-8">
        <button type="submit" :disabled="loading"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          {{ loading ? 'Submitting...' : 'Submit Application' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

const loading = ref(false)
const formData = reactive({
  qualificationType: '',
  institutionName: '',
  completionDate: '',
  certificate: null
})

const errors = reactive({}) // Validation Errors

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should not exceed 5MB')
      errors.certificate = 'File size should not exceed 5MB'; // Set the error message
      formData.certificate = null; // Clear the selected file
      event.target.value = '' // Clear the file input
      return
    }
    formData.certificate = file
    errors.certificate = null; // Clear any previous error
  } else {
    formData.certificate = null; // Clear the file if none is selected
    errors.certificate = 'Certificate is required.'; // Reset the error if no file
  }
}

const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key]); // Clear previous errors
  let isValid = true;

  if (!formData.qualificationType) {
    errors.qualificationType = 'Qualification Type is required';
    isValid = false;
  }
  if (!formData.institutionName) {
    errors.institutionName = 'Institution Name is required';
    isValid = false;
  }
  if (!formData.completionDate) {
    errors.completionDate = 'Completion Date is required';
    isValid = false;
  }
  if (!formData.certificate) {
    errors.certificate = 'Certificate is required';
    isValid = false;
  }

  return isValid;
};

const submitForm = async () => {
  if (validateForm()) {
    try {
      loading.value = true

      // Create form data for file upload
      const submitData = new FormData()
      submitData.append('qualificationType', formData.qualificationType)
      submitData.append('institutionName', formData.institutionName)
      submitData.append('completionDate', formData.completionDate)
      submitData.append('certificate', formData.certificate)

      // TODO: Add your API call here
      // await axios.post('/api/additional-qualification', submitData)

      toast.success('Application submitted successfully')

      // Reset form
      formData.qualificationType = '';
      formData.institutionName = '';
      formData.completionDate = '';
      formData.certificate = null;
      errors.certificate = null; // Clear certificate error as well

    } catch (error) {
      toast.error('Error submitting application')
      console.error('Error:', error)
    } finally {
      loading.value = false
    }
  } else {
    toast.error('Please correct the errors in the form.');
  }
}
</script>

<style scoped>
.required::after {
  content: " *";
  color: #ef4444;
}
</style>
