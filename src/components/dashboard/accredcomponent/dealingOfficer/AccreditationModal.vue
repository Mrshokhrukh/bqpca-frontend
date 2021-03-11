<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="bg-white p-6 rounded-lg shadow-lg sm:max-w-3xl w-full mx-auto overflow-y-auto max-h-screen">
      <!-- Modal Header -->
      <div class="mb-6">
        <h2 class="text-xl font-bold text-gray-900" id="modal-title">
          Application Details - {{ localApplication.applicationId }}
        </h2>
      </div>

      <!-- Application Details -->
      <form class="space-y-6">
        <!-- Institution Profile -->
        <div>
          <h4 class="text-lg font-semibold text-gray-700">Institution Profile</h4>
          <div class="border-b border-gray-200 pb-2"></div>
        </div>
        <div>
          <label for="institution-name" class="block text-sm font-medium text-gray-700">Name of Institution</label>
          <p class="mt-1 text-gray-900">{{ localApplication.institutionProfile.nameOfInstitution }}</p>
        </div>

        <div>
          <label for="address-location" class="block text-sm font-medium text-gray-700">Address/Location</label>
          <p class="mt-1 text-gray-900">{{ localApplication.institutionProfile.addressLocation }}</p>
        </div>

        <div>
          <label for="gewog-throm" class="block text-sm font-medium text-gray-700">Gewog/Throm</label>
          <p class="mt-1 text-gray-900">{{ localApplication.institutionProfile.gewogThrom }}</p>
        </div>

        <div>
          <label for="dzongkhag-throm" class="block text-sm font-medium text-gray-700">Dzongkhag/Throm</label>
          <p class="mt-1 text-gray-900">{{ localApplication.institutionProfile.dzongkhagThrom }}</p>
        </div>

        <div>
          <label for="contact-number" class="block text-sm font-medium text-gray-700">Contact Number</label>
          <p class="mt-1 text-gray-900">{{ localApplication.institutionProfile.contactNumber }}</p>
        </div>

        <div>
          <label for="email-address" class="block text-sm font-medium text-gray-700">Email Address</label>
          <p class="mt-1 text-gray-900">{{ localApplication.institutionProfile.emailAddress }}</p>
        </div>

        <div>
          <label for="telephone-number" class="block text-sm font-medium text-gray-700">Telephone Number</label>
          <p class="mt-1 text-gray-900">{{ localApplication.institutionProfile.telephoneNumber }}</p>
        </div>

        <div>
          <label for="year-establishment" class="block text-sm font-medium text-gray-700">Year of Establishment</label>
          <p class="mt-1 text-gray-900">{{ localApplication.institutionProfile.yearOfEstablishment }}</p>
        </div>

        <div>
          <label for="institution-type" class="block text-sm font-medium text-gray-700">Type of Institution (Constituent/affiliated/ others)</label>
          <p class="mt-1 text-gray-900">{{ localApplication.institutionProfile.typeOfInstitution }}</p>
        </div>

        <div>
          <label for="affiliated-to" class="block text-sm font-medium text-gray-700">Affiliated to, if relevant</label>
          <p class="mt-1 text-gray-900">{{ localApplication.institutionProfile.affiliatedTo }}</p>
        </div>

        <div>
          <label for="level-autonomy" class="block text-sm font-medium text-gray-700">Level of Autonomy (if affiliated)</label>
          <p class="mt-1 text-gray-900">{{ localApplication.institutionProfile.levelOfAutonomy }}</p>
        </div>

        <div>
          <label for="source-funding" class="block text-sm font-medium text-gray-700">Source of funding</label>
          <p class="mt-1 text-gray-900">{{ localApplication.institutionProfile.sourceOfFunding }}</p>
        </div>

        <div>
          <label for="total-area" class="block text-sm font-medium text-gray-700">Total area (in acres)</label>
          <p class="mt-1 text-gray-900">{{ localApplication.institutionProfile.totalArea }}</p>
        </div>

        <div>
          <label for="website" class="block text-sm font-medium text-gray-700">Website</label>
          <p class="mt-1 text-gray-900">{{ localApplication.institutionProfile.website }}</p>
        </div>

        <!-- Past Accreditation Details -->
        <div>
          <h4 class="text-lg font-semibold text-gray-700 mt-6">Past Accreditation Details</h4>
          <div class="border-b border-gray-200 pb-2"></div>
        </div>

        <div>
          <label for="accreditation-rating" class="block text-sm font-medium text-gray-700">Accreditation Rating</label>
          <p class="mt-1 text-gray-900">{{ localApplication.pastAccreditationDetails.accreditationRating }}</p>
        </div>

        <div>
          <label for="accreditation-validity-date" class="block text-sm font-medium text-gray-700">Accreditation Validity Date</label>
          <p class="mt-1 text-gray-900">{{ localApplication.pastAccreditationDetails.accreditationValidityDate }}</p>
        </div>

        <!-- Details of the Head of the Institute -->
        <div>
          <h4 class="text-lg font-semibold text-gray-700 mt-6">Details of the Head of the Institute</h4>
          <div class="border-b border-gray-200 pb-2"></div>
        </div>

        <div>
          <label for="head-name" class="block text-sm font-medium text-gray-700">Name</label>
          <p class="mt-1 text-gray-900">{{ localApplication.headOfInstituteDetails.name }}</p>
        </div>

        <div>
          <label for="head-contact-number" class="block text-sm font-medium text-gray-700">Contact Number</label>
          <p class="mt-1 text-gray-900">{{ localApplication.headOfInstituteDetails.contactNumber }}</p>
        </div>

        <div>
          <label for="head-email-address" class="block text-sm font-medium text-gray-700">Email Address</label>
          <p class="mt-1 text-gray-900">{{ localApplication.headOfInstituteDetails.emailAddress }}</p>
        </div>

        <!-- Name of the IQA Focal -->
        <div>
          <h4 class="text-lg font-semibold text-gray-700 mt-6">Name of the IQA Focal</h4>
          <div class="border-b border-gray-200 pb-2"></div>
        </div>
        <div>
          <label for="iqa-focal-name" class="block text-sm font-medium text-gray-700">Name of IQA Focal</label>
          <p class="mt-1 text-gray-900">{{ localApplication.iqaFocalDetails.nameOfIqaFocal }}</p>
        </div>

        <div>
          <label for="iqa-focal-contact-number" class="block text-sm font-medium text-gray-700">Contact Number</label>
          <p class="mt-1 text-gray-900">{{ localApplication.iqaFocalDetails.contactNumber }}</p>
        </div>

        <div>
          <label for="iqa-focal-email-address" class="block text-sm font-medium text-gray-700">Email Address</label>
          <p class="mt-1 text-gray-900">{{ localApplication.iqaFocalDetails.emailAddress }}</p>
        </div>

        <!-- Current Academic Activities -->
        <div>
          <h4 class="text-lg font-semibold text-gray-700 mt-6">Current Academic Activities (in numbers)</h4>
          <div class="border-b border-gray-200 pb-2"></div>
          <p class="text-sm text-gray-500">*(Please list the different academic programs and the number of students enrolled in each)*</p>
          <div class="mt-2">
            <p class="mt-1 text-gray-900 whitespace-pre-line">{{ localApplication.academicActivities }}</p>
          </div>
        </div>

        <!-- Student Details -->
        <div>
          <h4 class="text-lg font-semibold text-gray-700 mt-6">Student Details (in numbers)</h4>
          <div class="border-b border-gray-200 pb-2"></div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="student-male-count" class="block text-sm font-medium text-gray-700">Male</label>
            <p class="mt-1 text-gray-900">{{ localApplication.studentDetails.maleCount }}</p>
          </div>
          <div>
            <label for="student-female-count" class="block text-sm font-medium text-gray-700">Female</label>
            <p class="mt-1 text-gray-900">{{ localApplication.studentDetails.femaleCount }}</p>
          </div>
        </div>
        <div>
          <label for="student-total-count" class="block text-sm font-medium text-gray-700">Total</label>
          <p class="mt-1 text-gray-900">{{ localApplication.studentDetails.totalCount }}</p>
        </div>

        <!-- Financial Resources -->
        <div>
          <h4 class="text-lg font-semibold text-gray-700 mt-6">Financial Resources (in numbers)</h4>
          <div class="border-b border-gray-200 pb-2"></div>
          <p class="text-sm text-gray-500">*(Please provide details of financial resources, like annual budget, grants, etc.)*</p>
          <div class="mt-2">
            <p class="mt-1 text-gray-900 whitespace-pre-line">{{ localApplication.financialResources }}</p>
          </div>
        </div>

        <!-- Standards -->
        <div>
          <h4 class="text-lg font-semibold text-gray-700 mt-6">Standards</h4>
          <div class="border-b border-gray-200 pb-2"></div>
          <ul role="list" class="space-y-4">
            <li v-for="(standard, index) in localApplication.standards" :key="index" class="border rounded-md p-4">
              <div class="space-y-2">
                <div>
                  <label :for="'standard-name-' + index" class="block text-sm font-medium text-gray-700">Standard Name</label>
                  <p class="mt-1 text-gray-900">{{ standard.standardName }}</p>
                </div>
                <div>
                  <label :for="'key-aspect-name-' + index" class="block text-sm font-medium text-gray-700">Key Aspect Name</label>
                  <p class="mt-1 text-gray-900">{{ standard.keyAspectName }}</p>
                </div>
                <div>
                  <label :for="'indicators-' + index" class="block text-sm font-medium text-gray-700">Indicators</label>
                  <p class="mt-1 text-gray-900 whitespace-pre-line">{{ standard.indicators }}</p>
                </div>
                <div>
                  <label :for="'report-by-institute-' + index" class="block text-sm font-medium text-gray-700">Report by Institute</label>
                  <p class="mt-1 text-gray-900 whitespace-pre-line">{{ standard.reportByInstitute }}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Supporting Documents -->
        <div>
          <h4 class="text-lg font-semibold text-gray-700 mt-6">Supporting Documents</h4>
          <div class="border-b border-gray-200 pb-2"></div>
          <ul role="list" class="space-y-2">
            <li v-for="(doc, index) in localApplication.supportingDocuments" :key="index" class="text-sm text-gray-500">
              <a :href="doc.url" target="_blank" class="text-blue-500 hover:underline">{{ doc.name }}</a>
            </li>
            <li v-if="localApplication.supportingDocuments.length === 0" class="text-sm text-gray-500">
              No supporting documents uploaded.
            </li>
          </ul>
        </div>

        <!-- Rejection Message (Conditional) -->
        <div v-if="isRejecting">
          <label for="rejection-message" class="block text-sm font-medium text-gray-700">Rejection Message</label>
          <div class="mt-1">
            <textarea id="rejection-message" v-model="rejectionMessage" rows="3" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md" placeholder="Please provide reasons for rejection"></textarea>
          </div>
        </div>
      </form>

      <!-- Modal Footer Buttons -->
      <div class="mt-6 flex justify-end space-x-2">
        <button @click="confirmApprove" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
          Approve
        </button>
        <button @click="confirmReject" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
          Reject
        </button>
        <button @click="editApplication" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Edit
        </button>
        <button v-if="localApplication.status === 'Approved'" @click="generateCertificate" class="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600">
          Generate Certificate
        </button>
        <button @click="$emit('close-modal')" class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watchEffect } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  application: {
    type: Object,
    default: () => ({})
  }
});

const localApplication = ref({});
watchEffect(() => {
  localApplication.value = JSON.parse(JSON.stringify(props.application));
});

const emit = defineEmits(['close-modal']);

const isRejecting = ref(false);
const rejectionMessage = ref('');

const confirmApprove = () => {
  if (confirm(`Are you sure you want to APPROVE application ${localApplication.value.applicationId}?`)) {
    approveApplication();
  }
};

const confirmReject = () => {
  if (isRejecting.value) {
    rejectApplication();
  } else {
    isRejecting.value = true; // Show rejection message textarea
  }
};

const approveApplication = () => {
  console.log('Approve Application:', localApplication.value.applicationId);
  // In a real app, you would send an API request to update the application status to "Approved"
  emit('close-modal');
};

const rejectApplication = () => {
  if (rejectionMessage.value.trim() === '') {
    alert('Please provide a rejection message.');
    return;
  }
  if (confirm(`Are you sure you want to REJECT application ${localApplication.value.applicationId}?`)) {
    console.log('Reject Application:', localApplication.value.applicationId, 'Reason:', rejectionMessage.value);
    // In a real app, you would send an API request to update the application status to "Rejected" and save the rejection message
    emit('close-modal');
    isRejecting.value = false; // Hide rejection message textarea after rejection
    rejectionMessage.value = ''; // Clear the rejection message
  } else {
    isRejecting.value = false; // Hide rejection message textarea if rejection cancelled
  }

};

const editApplication = () => {
  console.log('Edit Application:', localApplication.value.applicationId);
  emit('close-modal');
};

const generateCertificate = () => {
  console.log('Generate Certificate for Application:', localApplication.value.applicationId);
  emit('close-modal');
};

</script>

<style scoped>
/* Additional custom styles can be added here */
</style>