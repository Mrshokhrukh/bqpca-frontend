<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Form Header -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Continuous Professional Development (CPD) Application
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Please fill in all required fields marked with an asterisk (<span class="text-red-600">*</span>). Ensure all
        information provided is accurate and up-to-date.
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="bg-white border rounded-xl shadow-sm p-6">
      <!-- Personal Details -->
      <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
        <h3 class="text-lg font-semibold text-gray-900">Personal Details</h3>
        <p class="mt-1 text-sm text-gray-500">Your basic information</p>
      </div>

      <div class="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">

        <div class="col-span-1">
          <label for="registrationNumber" class="block text-sm font-medium text-gray-700">Registration
            Number</label>
          <input id="registrationNumber" v-model="form.registrationNumber" type="text"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            disabled />
        </div>

        <div class="col-span-1">
          <label for="cidNumber" class="block text-sm font-medium text-gray-700">CID No./Identity/Work Permit
            No.</label>
          <input id="cidNumber" v-model="form.cidNumber" type="text"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            disabled />
        </div>

        <div class="col-span-1">
          <label for="fullName" class="block text-sm font-medium text-gray-700">Full Name</label>
          <input id="fullName" v-model="form.fullName" type="text"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            disabled />
        </div>

        <div class="col-span-1">
          <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
          <input id="gender" v-model="form.gender" type="text"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            disabled />
        </div>
      </div>

      <!-- CPD Details -->
      <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mt-8">
        <h3 class="text-lg font-semibold text-gray-900">CPD Details</h3>
        <p class="mt-1 text-sm text-gray-500">Information about the CPD activity</p>
      </div>

      <div class="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">

        <div class="col-span-1">
          <label for="cpdTitle" class="block text-sm font-medium text-gray-700 required">Title of CPD</label>
          <input id="cpdTitle" v-model="form.cpdTitle" type="text"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            required />
          <span v-if="errors.cpdTitle" class="text-sm text-red-500 mt-1">{{ errors.cpdTitle }}</span>
        </div>

        <div class="col-span-1">
          <label for="relevance" class="block text-sm font-medium text-gray-700 required">Relevance to your
            profession</label>
          <input id="relevance" v-model="form.relevance" type="text"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            required />
          <span v-if="errors.relevance" class="text-sm text-red-500 mt-1">{{ errors.relevance }}</span>
        </div>

        <div class="col-span-1">
          <label for="participationCategory" class="block text-sm font-medium text-gray-700 required">Participation
            Category</label>
          <select id="participationCategory" v-model="form.participationCategory"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            required>
            <option value="" disabled>Select</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
          </select>
          <span v-if="errors.participationCategory" class="text-sm text-red-500 mt-1">{{
      errors.participationCategory
    }}</span>
        </div>

        <div class="col-span-1">
          <label for="participantSubCategory" class="block text-sm font-medium text-gray-700 required">Participant
            Sub-category</label>
          <select id="participantSubCategory" v-model="form.participantSubCategory"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            required>
            <option value="" disabled>Select</option>
            <option value="subCategory1">Sub-category 1</option>
            <option value="subCategory2">Sub-category 2</option>
          </select>
          <span v-if="errors.participantSubCategory" class="text-sm text-red-500 mt-1">{{
      errors.participantSubCategory
    }}</span>
        </div>

        <div class="col-span-1">
          <label for="activityType" class="block text-sm font-medium text-gray-700 required">Type of CPD
            Activity</label>
          <select id="activityType" v-model="form.activityType"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            required>
            <option value="" disabled>Select</option>
            <option value="type1">Type 1</option>
            <option value="type2">Type 2</option>
          </select>
          <span v-if="errors.activityType" class="text-sm text-red-500 mt-1">{{ errors.activityType }}</span>
        </div>

        <div class="col-span-1">
          <label for="attachment" class="block text-sm font-medium text-gray-700">Attachment</label>
          <input id="attachment" type="file" @change="handleFileUpload"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4
                           file:rounded-lg file:border-0 file:text-sm file:font-semibold
                           file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          <span v-if="errors.attachment" class="text-sm text-red-500 mt-1">{{ errors.attachment }}</span>
          <p class="text-sm text-gray-500 mt-2">
            Attach relevant documents (PDF, DOC, JPG, PNG). Max size: 2MB.
          </p>
        </div>
      </div>

      <!-- Buttons -->
      <div class="mt-12 flex justify-end space-x-4 p-8">
        <button type="button" @click="handleCancel"
          class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button type="submit"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useToast } from 'vue-toastification';

const toast = useToast();

const form = reactive({
  registrationNumber: '12345', // Example Value
  cidNumber: '11223344556', // Example Value
  fullName: 'John Doe', // Example Value
  gender: 'Male', // Example Value
  cpdTitle: '',
  relevance: '',
  participationCategory: '',
  participantSubCategory: '',
  activityType: '',
  attachment: null,
})

const errors = reactive({}) // Validation Errors

const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key]); // Clear previous errors
  let isValid = true;

  if (!form.cpdTitle) { errors.cpdTitle = 'CPD Title is required'; isValid = false; }
  if (!form.relevance) { errors.relevance = 'Relevance is required'; isValid = false; }
  if (!form.participationCategory) { errors.participationCategory = 'Participation Category is required'; isValid = false; }
  if (!form.participantSubCategory) { errors.participantSubCategory = 'Participant Sub-category is required'; isValid = false; }
  if (!form.activityType) { errors.activityType = 'Activity Type is required'; isValid = false; }

  if (form.attachment && form.attachment.size > 2 * 1024 * 1024) { // 2MB limit
    errors.attachment = 'Attachment size should not exceed 2MB';
    isValid = false;
  }

  return isValid;
}

const handleSubmit = () => {
  if (validateForm()) {
    // Simulate submission
    setTimeout(() => {
      toast.success('CPD Registration submitted successfully!');
      console.log('Form submitted:', form);
      handleCancel(); // Reset the form after successful submission.
    }, 500); // Simulate a delay
  } else {
    toast.error('Please correct the errors in the form.');
  }
}

const handleCancel = () => {
  form.cpdTitle = '';
  form.relevance = '';
  form.participationCategory = '';
  form.participantSubCategory = '';
  form.activityType = '';
  form.attachment = null;
  Object.keys(errors).forEach(key => delete errors[key]);
}

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  form.attachment = file;
  if (file && file.size > 2 * 1024 * 1024) {
    errors.attachment = 'Attachment size should not exceed 2MB';
    form.attachment = null;
  } else {
    delete errors.attachment;
  }
}
</script>

<style scoped>
.required::after {
  content: " *";
  color: #ef4444;
}
</style>
