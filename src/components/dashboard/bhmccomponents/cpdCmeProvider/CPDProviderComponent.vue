<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Form Header -->
    <div class="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        CPD Activity Submission (Provider)
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Submit your CPD activity for review and approval. Please provide detailed and accurate
        information. Fields marked with an asterisk (<span class="text-red-600">*</span>) are required.
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="bg-white border rounded-xl shadow-sm p-6">
      <!-- Applicant Details -->
      <ApplicantDetails v-model="form.applicantDetails" :is-disabled="isLoggedIn" />

      <!-- CPD Application Details -->
      <CPDApplicationDetails v-model="form.applicationDetails" />

      <!-- CPD Provider Host Details -->
      <CPDProviderHostDetails v-model="form.hostDetails" />

      <!-- Resource Person Details -->
      <ResourcePersonDetails v-model="form.resourcePersons" />

      <!-- Teaching Learning Details -->
      <TeachingLearningDetails v-model="form.teachingLearning" />

      <!-- Participant Details -->
      <ParticipantDetails v-model="form.participantDetails" />

      <!-- Buttons -->
      <div class="mt-12 flex justify-end space-x-4 p-8">
        <button type="button" @click="handleCancel"
          class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button type="button" @click="handleSaveDraft"
          class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          Save as Draft
        </button>
        <button type="submit" class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Submit
        </button>
      </div>
    </form>

    <!--After Approval Participants -->
    <AfterApprovalParticipants v-if="isApproved" />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ApplicantDetails from './ApplicantDetails.vue';
import CPDApplicationDetails from './CPDApplicationDetails.vue';
import CPDProviderHostDetails from './CPDProviderHostDetails.vue';
import ResourcePersonDetails from './ResourcePersonDetails.vue';
import TeachingLearningDetails from './TeachingLearningDetails.vue';
import ParticipantDetails from './ParticipantDetails.vue';
import AfterApprovalParticipants from './AfterApprovalParticipants.vue';

import { useToast } from 'vue-toastification';
const toast = useToast();

// Dummy props to simulate logged in and application approve/reject states
const isLoggedIn = ref(true);
const isApproved = ref(false);

const form = reactive({
  applicantDetails: {},
  applicationDetails: {},
  hostDetails: {},
  resourcePersons: [],
  teachingLearning: {},
  participantDetails: {}
});

const handleSaveDraft = () => {
  console.log('Saving as draft:', form);
  toast.info('Form saved as draft!');
};

const handleSubmit = () => {
  console.log('Submitting form:', form);
  toast.success('Form submitted successfully!');
  // In real implementation, submit the form data to an API.
};

const handleCancel = () => {
  // Reset the form data, or redirect the user.
  toast.warning('Form cancelled.');
};
</script>
