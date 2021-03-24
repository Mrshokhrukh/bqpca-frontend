<template>
  <div>
    <!-- Check if we're in participant adding mode -->
    <div v-if="addingParticipants && approvedCpdId" class="max-w-7xl mx-auto px-4 py-8">
      <div class="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
        <h2 class="text-xl font-bold text-gray-900 mb-2">Add Participants to Approved CPD</h2>
        <p class="text-gray-600">
          Your CPD application has been approved. Please add participants below to complete the process.
        </p>
      </div>

      <!-- After Approval Participants Component -->
      <AfterApprovalParticipants :cpd-id="approvedCpdId" :calculated-credits="calculatedCredits" />
    </div>

    <!-- Regular CPD Application Form -->
    <div v-else>
      <CPDApplicationDetails v-model="formData" :application-id="applicationId"
        @application-loaded="handleApplicationLoaded" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import apiservice from '@/services/bmhcservices';
import CPDApplicationDetails from './CPDApplicationDetails.vue';
import AfterApprovalParticipants from './AfterApprovalParticipants.vue';

const toast = useToast();
const route = useRoute();
const router = useRouter();

// Create a reactive form object that will be passed to CPDApplicationDetails
const formData = ref({
  isApproved: false,
  title: '',
  venue: '',
  fromDate: '',
  toDate: '',
  approvalLetter: null
});

// State for CPD approval details
const applicationId = ref(null);
const approvedCpdId = ref(null);
const calculatedCredits = ref(0);
const addingParticipants = ref(false);

// Load application if ID is provided in the URL
onMounted(async () => {
  // Check if we have an ID parameter in the route
  const id = route.query.id;
  if (id) {
    applicationId.value = parseInt(id);

    // Check if we're meant to add participants
    if (route.query.add_participants === 'true') {
      try {
        // Fetch the application to verify it's approved
        const response = await apiservice.getMhpcCpdTaskById(id);

        if (response.data && response.data.review_status === 'Approved') {
          approvedCpdId.value = parseInt(id);
          calculatedCredits.value = response.data.credit || 0;
          addingParticipants.value = true;
        } else {
          toast.error('This application is not approved or cannot be found.');
          router.push('/admin/cpd_cme_provider/health_certification/cpd_application_tracker');
        }
      } catch (error) {
        console.error('Error loading application:', error);
        toast.error('Failed to load the application. Please try again.');
        router.push('/admin/cpd_cme_provider/health_certification/cpd_application_tracker');
      }
    }
  }
});

// Handle when application is loaded from CPDApplicationDetails
const handleApplicationLoaded = (applicationData) => {
  // Check if the application is approved and needs participants
  if (applicationData &&
    applicationData.review_status === 'Approved' &&
    (!applicationData.participants || applicationData.participants.length === 0)) {

    // Set up state for adding participants
    approvedCpdId.value = applicationData.id;
    calculatedCredits.value = applicationData.credit || 0;

    // Ask if user wants to add participants now
    const addNow = confirm('This application is approved. Would you like to add participants now?');
    if (addNow) {
      addingParticipants.value = true;
    }
  }
};
</script>
