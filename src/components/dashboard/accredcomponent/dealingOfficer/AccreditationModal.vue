<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="bg-white p-6 rounded-xl shadow-xl sm:max-w-3xl w-full mx-auto overflow-y-auto max-h-screen"
    >
      <!-- Modal Header with Edit Button -->
      <div class="mb-8 relative">
        <!-- Edit Button - Top Right -->
        <button
          @click="editApplication"
          class="absolute top-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
          title="Edit Application"
        >
          <Edit class="h-5 w-5" />
        </button>

        <h2 class="text-2xl font-bold text-gray-900 text-center" id="modal-title">
          Application Details - {{ localApplication.applicationId }}
        </h2>
        <p class="text-sm text-gray-500 text-center mt-1">
          Review the application information below.
        </p>
      </div>

      <!-- Application Details - Card Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Institution Profile Section -->
        <div class="rounded-lg bg-gray-50 shadow-sm p-4">
          <!-- Outer Card for Institution Profile Section -->
          <h4 class="text-lg font-semibold text-gray-700 mb-3">Institution Profile</h4>
          <div class="grid grid-cols-1 gap-3">
            <div class="rounded-lg bg-white shadow-sm p-4 border border-gray-200">
              <div class="flex justify-between items-center">
                <dt class="text-sm font-medium text-gray-500">Name</dt>
                <dd class="text-sm text-gray-900">
                  {{ localApplication.institutionProfile.nameOfInstitution }}
                </dd>
              </div>
            </div>
            <div class="rounded-lg bg-white shadow-sm p-4 border border-gray-200">
              <div class="flex justify-between items-center">
                <dt class="text-sm font-medium text-gray-500">Address</dt>
                <dd class="text-sm text-gray-900">
                  {{ localApplication.institutionProfile.addressLocation }}
                </dd>
              </div>
            </div>
            <div class="rounded-lg bg-white shadow-sm p-4 border border-gray-200">
              <div class="flex justify-between items-center">
                <dt class="text-sm font-medium text-gray-500">Gewog/Throm</dt>
                <dd class="text-sm text-gray-900">
                  {{ localApplication.institutionProfile.gewogThrom }}
                </dd>
              </div>
            </div>
            <div class="rounded-lg bg-white shadow-sm p-4 border border-gray-200">
              <div class="flex justify-between items-center">
                <dt class="text-sm font-medium text-gray-500">Dzongkhag/Throm</dt>
                <dd class="text-sm text-gray-900">
                  {{ localApplication.institutionProfile.dzongkhagThrom }}
                </dd>
              </div>
            </div>
            <div class="rounded-lg bg-white shadow-sm p-4 border border-gray-200">
              <div class="flex justify-between items-center">
                <dt class="text-sm font-medium text-gray-500">Contact</dt>
                <dd class="text-sm text-gray-900">
                  {{ localApplication.institutionProfile.contactNumber }}
                </dd>
              </div>
            </div>
            <div class="rounded-lg bg-white shadow-sm p-4 border border-gray-200">
              <div class="flex justify-between items-center">
                <dt class="text-sm font-medium text-gray-500">Email</dt>
                <dd class="text-sm text-gray-900">
                  {{ localApplication.institutionProfile.emailAddress }}
                </dd>
              </div>
            </div>
            <div class="rounded-lg bg-white shadow-sm p-4 border border-gray-200">
              <div class="flex justify-between items-center">
                <dt class="text-sm font-medium text-gray-500">Telephone</dt>
                <dd class="text-sm text-gray-900">
                  {{ localApplication.institutionProfile.telephoneNumber }}
                </dd>
              </div>
            </div>
            <div class="rounded-lg bg-white shadow-sm p-4 border border-gray-200">
              <div class="flex justify-between items-center">
                <dt class="text-sm font-medium text-gray-500">Established Year</dt>
                <dd class="text-sm text-gray-900">
                  {{ localApplication.institutionProfile.yearOfEstablishment }}
                </dd>
              </div>
            </div>
            <div class="rounded-lg bg-white shadow-sm p-4 border border-gray-200">
              <div class="flex justify-between items-center">
                <dt class="text-sm font-medium text-gray-500">Type</dt>
                <dd class="text-sm text-gray-900">
                  {{ localApplication.institutionProfile.typeOfInstitution }}
                </dd>
              </div>
            </div>
            <div class="rounded-lg bg-white shadow-sm p-4 border border-gray-200">
              <div class="flex justify-between items-center">
                <dt class="text-sm font-medium text-gray-500">Affiliated To</dt>
                <dd class="text-sm text-gray-900">
                  {{ localApplication.institutionProfile.affiliatedTo || 'N/A' }}
                </dd>
              </div>
            </div>
            <div class="rounded-lg bg-white shadow-sm p-4 border border-gray-200">
              <div class="flex justify-between items-center">
                <dt class="text-sm font-medium text-gray-500">Autonomy Level</dt>
                <dd class="text-sm text-gray-900">
                  {{ localApplication.institutionProfile.levelOfAutonomy || 'N/A' }}
                </dd>
              </div>
            </div>
            <div class="rounded-lg bg-white shadow-sm p-4 border border-gray-200">
              <div class="flex justify-between items-center">
                <dt class="text-sm font-medium text-gray-500">Funding Source</dt>
                <dd class="text-sm text-gray-900">
                  {{ localApplication.institutionProfile.sourceOfFunding }}
                </dd>
              </div>
            </div>
            <div class="rounded-lg bg-white shadow-sm p-4 border border-gray-200">
              <div class="flex justify-between items-center">
                <dt class="text-sm font-medium text-gray-500">Total Area</dt>
                <dd class="text-sm text-gray-900">
                  {{ localApplication.institutionProfile.totalArea }} acres
                </dd>
              </div>
            </div>
            <div class="rounded-lg bg-white shadow-sm p-4 border border-gray-200">
              <div class="flex justify-between items-center">
                <dt class="text-sm font-medium text-gray-500">Website</dt>
                <dd class="text-sm text-gray-900">
                  <a
                    :href="localApplication.institutionProfile.website"
                    target="_blank"
                    class="text-blue-500 hover:underline"
                    v-if="localApplication.institutionProfile.website"
                    >{{ localApplication.institutionProfile.website }}</a
                  >
                  <span v-else>N/A</span>
                </dd>
              </div>
            </div>
          </div>
        </div>

        <!-- Past Accreditation Card Section -->
        <div class="rounded-lg bg-gray-50 shadow-sm p-4">
          <!-- Outer Card for Past Accreditation -->
          <h4 class="text-lg font-semibold text-gray-700 mb-3">Past Accreditation Details</h4>
          <div class="grid grid-cols-1 gap-3">
            <div class="rounded-lg bg-white shadow-sm p-4 border border-gray-200">
              <div class="flex justify-between items-center">
                <dt class="text-sm font-medium text-gray-500">Rating</dt>
                <dd class="text-sm text-gray-900">
                  {{ localApplication.pastAccreditationDetails.accreditationRating || 'N/A' }}
                </dd>
              </div>
            </div>
            <div class="rounded-lg bg-white shadow-sm p-4 border border-gray-200">
              <div class="flex justify-between items-center">
                <dt class="text-sm font-medium text-gray-500">Validity Date</dt>
                <dd class="text-sm text-gray-900">
                  {{ localApplication.pastAccreditationDetails.accreditationValidityDate || 'N/A' }}
                </dd>
              </div>
            </div>
          </div>
        </div>

        <!-- Head of Institute Card Section -->
        <div class="rounded-lg bg-gray-50 shadow-sm p-4">
          <!-- Outer Card for Head of Institute -->
          <h4 class="text-lg font-semibold text-gray-700 mb-3">Head of Institute Details</h4>
          <div class="grid grid-cols-1 gap-3">
            <div class="rounded-lg bg-white shadow-sm p-4 border border-gray-200">
              <div class="flex justify-between items-center">
                <dt class="text-sm font-medium text-gray-500">Name</dt>
                <dd class="text-sm text-gray-900">
                  {{ localApplication.headOfInstituteDetails.name || 'N/A' }}
                </dd>
              </div>
            </div>
            <div class="rounded-lg bg-white shadow-sm p-4 border border-gray-200">
              <div class="flex justify-between items-center">
                <dt class="text-sm font-medium text-gray-500">Contact</dt>
                <dd class="text-sm text-gray-900">
                  {{ localApplication.headOfInstituteDetails.contactNumber || 'N/A' }}
                </dd>
              </div>
            </div>
            <div class="rounded-lg bg-white shadow-sm p-4 border border-gray-200">
              <div class="flex justify-between items-center">
                <dt class="text-sm font-medium text-gray-500">Email</dt>
                <dd class="text-sm text-gray-900">
                  {{ localApplication.headOfInstituteDetails.emailAddress || 'N/A' }}
                </dd>
              </div>
            </div>
          </div>
        </div>

        <!-- IQA Focal Card Section -->
        <div class="rounded-lg bg-gray-50 shadow-sm p-4">
          <!-- Outer Card for IQA Focal -->
          <h4 class="text-lg font-semibold text-gray-700 mb-3">IQA Focal Details</h4>
          <div class="grid grid-cols-1 gap-3">
            <div class="rounded-lg bg-white shadow-sm p-4 border border-gray-200">
              <div class="flex justify-between items-center">
                <dt class="text-sm font-medium text-gray-500">Name</dt>
                <dd class="text-sm text-gray-900">
                  {{ localApplication.iqaFocalDetails.nameOfIqaFocal || 'N/A' }}
                </dd>
              </div>
            </div>
            <div class="rounded-lg bg-white shadow-sm p-4 border border-gray-200">
              <div class="flex justify-between items-center">
                <dt class="text-sm font-medium text-gray-500">Contact</dt>
                <dd class="text-sm text-gray-900">
                  {{ localApplication.iqaFocalDetails.contactNumber || 'N/A' }}
                </dd>
              </div>
            </div>
            <div class="rounded-lg bg-white shadow-sm p-4 border border-gray-200">
              <div class="flex justify-between items-center">
                <dt class="text-sm font-medium text-gray-500">Email</dt>
                <dd class="text-sm text-gray-900">
                  {{ localApplication.iqaFocalDetails.emailAddress || 'N/A' }}
                </dd>
              </div>
            </div>
          </div>
        </div>

        <!-- Academic Activities Card -->
        <div class="rounded-lg bg-gray-50 shadow-sm p-4 md:col-span-2">
          <h4 class="text-lg font-semibold text-gray-700 mb-3">Current Academic Activities</h4>
          <p class="text-sm text-gray-500 mb-2">*(List academic programs and student count)*</p>
          <div class="rounded border border-gray-200 p-3 bg-white">
            <pre class="text-sm text-gray-900 whitespace-pre-line">{{ localApplication.academicActivities || 'N/A' }}</pre>
          </div>
        </div>

        <!-- Student Details Card Section -->
        <div class="rounded-lg bg-gray-50 shadow-sm p-4">
          <!-- Outer Card for Student Details -->
          <h4 class="text-lg font-semibold text-gray-700 mb-3">Student Details</h4>
          <div class="grid grid-cols-1 gap-3">
            <div class="rounded-lg bg-white shadow-sm p-4 border border-gray-200">
              <div class="flex justify-between items-center">
                <dt class="text-sm font-medium text-gray-500">Male Count</dt>
                <dd class="text-sm text-gray-900">
                  {{ localApplication.studentDetails.maleCount || 'N/A' }}
                </dd>
              </div>
            </div>
            <div class="rounded-lg bg-white shadow-sm p-4 border border-gray-200">
              <div class="flex justify-between items-center">
                <dt class="text-sm font-medium text-gray-500">Female Count</dt>
                <dd class="text-sm text-gray-900">
                  {{ localApplication.studentDetails.femaleCount || 'N/A' }}
                </dd>
              </div>
            </div>
            <div class="rounded-lg bg-white shadow-sm p-4 border border-gray-200">
              <div class="flex justify-between items-center">
                <dt class="text-sm font-medium text-gray-500">Total Count</dt>
                <dd class="text-sm text-gray-900">
                  {{ localApplication.studentDetails.totalCount || 'N/A' }}
                </dd>
              </div>
            </div>
          </div>
        </div>

        <!-- Financial Resources Card -->
        <div class="rounded-lg bg-gray-50 shadow-sm p-4">
          <h4 class="text-lg font-semibold text-gray-700 mb-3">Financial Resources</h4>
          <p class="text-sm text-gray-500 mb-2">*(Details of financial resources)*</p>
          <div class="rounded border border-gray-200 p-3 bg-white">
            <pre class="text-sm text-gray-900 whitespace-pre-line">{{ localApplication.financialResources || 'N/A' }}</pre>
          </div>
        </div>

        <!-- Standards Card -->
        <div class="rounded-lg bg-gray-50 shadow-sm p-4 md:col-span-2">
          <h4 class="text-lg font-semibold text-gray-700 mb-3">Standards</h4>
          <ul role="list" class="space-y-4">
            <li
              v-for="(standard, index) in localApplication.standards"
              :key="index"
              class="border rounded-md p-4 bg-white shadow-sm"
            >
              <div class="space-y-3">
                <div class="rounded-lg bg-gray-50 shadow-sm p-2 border border-gray-200">
                  <div class="flex justify-between items-center">
                    <dt class="text-sm font-medium text-gray-500">Standard Name</dt>
                    <dd class="text-sm text-gray-900">{{ standard.standardName }}</dd>
                  </div>
                </div>
                <div class="rounded-lg bg-gray-50 shadow-sm p-2 border border-gray-200">
                  <div class="flex justify-between items-center">
                    <dt class="text-sm font-medium text-gray-500">Key Aspect</dt>
                    <dd class="text-sm text-gray-900">{{ standard.keyAspectName }}</dd>
                  </div>
                </div>
                <div class="rounded-lg bg-gray-50 shadow-sm p-2 border border-gray-200">
                  <dt class="text-sm font-medium text-gray-500">Indicators</dt>
                  <dd class="text-sm text-gray-900 whitespace-pre-line">
                    {{ standard.indicators }}
                  </dd>
                </div>
                <div class="rounded-lg bg-gray-50 shadow-sm p-2 border border-gray-200">
                  <dt class="text-sm font-medium text-gray-500">Institute Report</dt>
                  <dd class="text-sm text-gray-900 whitespace-pre-line">
                    {{ standard.reportByInstitute }}
                  </dd>
                </div>
              </div>
            </li>
            <li v-if="localApplication.standards.length === 0" class="text-sm text-gray-500">
              No standards information available.
            </li>
          </ul>
        </div>

        <!-- Supporting Documents Card -->
        <div class="rounded-lg bg-gray-50 shadow-sm p-4 md:col-span-2">
          <h4 class="text-lg font-semibold text-gray-700 mb-3">Supporting Documents</h4>
          <ul role="list" class="space-y-2">
            <li
              v-for="(doc, index) in localApplication.supportingDocuments"
              :key="index"
              class="text-sm text-gray-500"
            >
              <a :href="doc.url" target="_blank" class="text-blue-500 hover:underline">{{ doc.name }}</a>
            </li>
            <li
              v-if="localApplication.supportingDocuments.length === 0"
              class="text-sm text-gray-500"
            >
              No supporting documents uploaded.
            </li>
          </ul>
        </div>

        <!-- Rejection Message Card (Conditional) -->
        <div v-if="isRejecting" class="rounded-lg bg-red-50 shadow-sm p-4 md:col-span-2">
          <h4 class="text-lg font-semibold text-red-700 mb-3">Rejection Message</h4>
          <label for="rejection-message" class="block text-sm font-medium text-red-700 sr-only"
            >Rejection Message</label
          >
          <textarea
            id="rejection-message"
            v-model="rejectionMessage"
            rows="3"
            class="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border border-red-300 rounded-md bg-white text-gray-900"
            placeholder="Please provide reasons for rejection"
          ></textarea>
        </div>
      </div>

      <!-- Modal Footer Buttons (without Edit button) -->
      <div class="mt-8 flex justify-center space-x-4">
        <button
          @click="confirmApprove"
          class="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md font-semibold inline-flex items-center"
        >
          <Check class="w-4 h-4 mr-2" />
          Approve
        </button>
        <button
          @click="confirmReject"
          class="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-semibold inline-flex items-center"
        >
          <X class="w-4 h-4 mr-2" />
          Reject
        </button>
        <button
          v-if="localApplication.status === 'Approved'"
          @click="generateCertificate"
          class="bg-purple-500 hover:bg-purple-600 text-white px-5 py-2 rounded-md font-semibold inline-flex items-center"
        >
          <FileText class="w-4 h-4 mr-2" />
          Generate Certificate
        </button>
        <button
          @click="$emit('close-modal')"
          class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-5 py-2 rounded-md font-semibold inline-flex items-center"
        >
          <XCircle class="w-4 h-4 mr-2" />
          Close
        </button>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <div v-if="isConfirming" class="fixed inset-0 bg-black bg-opacity-75 z-[60] flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
        <h3 class="text-lg font-bold">{{ confirmDialogOptions.title }}</h3>
        <p class="mt-2 text-sm text-gray-600">{{ confirmDialogOptions.message }}</p>
        <div class="mt-6 flex justify-end space-x-3">
          <button @click="isConfirming = false" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">{{ confirmDialogOptions.cancelText }}</button>
          <button @click="handleConfirm" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">{{ confirmDialogOptions.confirmText }}</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useToast } from 'vue-toastification'
import { Edit, Check, X, FileText, XCircle } from 'lucide-vue-next'

const toast = useToast()

const props = defineProps({
  isOpen: Boolean,
  application: {
    type: Object,
    default: () => ({}),
  },
})

const localApplication = ref({})
watchEffect(() => {
  localApplication.value = JSON.parse(JSON.stringify(props.application))
})

const emit = defineEmits(['close-modal'])

const isRejecting = ref(false)
const rejectionMessage = ref('')
const isConfirming = ref(false);
const confirmDialogOptions = ref({
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  onConfirm: () => {},
});

const handleConfirm = () => {
  if (confirmDialogOptions.value.onConfirm) {
    confirmDialogOptions.value.onConfirm();
  }
  isConfirming.value = false;
};

const confirmApprove = () => {
  confirmDialogOptions.value = {
    title: 'Confirm Approval',
    message: `Are you sure you want to APPROVE application ${localApplication.value.applicationId}? This action cannot be undone.`,
    confirmText: 'Yes, Approve',
    cancelText: 'No, Cancel',
    onConfirm: approveApplication,
  };
  isConfirming.value = true;
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
    toast.error('Please provide a rejection message.');
    return;
  }

  const onConfirmReject = () => {
    console.log(
      'Reject Application:',
      localApplication.value.applicationId,
      'Reason:',
      rejectionMessage.value
    );
    // In a real app, you would send an API request to update the application status to "Rejected" and save the rejection message
    emit('close-modal');
    isRejecting.value = false; // Hide rejection message textarea after rejection
    rejectionMessage.value = ''; // Clear the rejection message
  };

  confirmDialogOptions.value = {
    title: 'Confirm Rejection',
    message: `Are you sure you want to REJECT application ${localApplication.value.applicationId}? This action cannot be undone.`,
    confirmText: 'Yes, Reject',
    cancelText: 'No, Cancel',
    onConfirm: onConfirmReject,
  };
  isConfirming.value = true;
};

const editApplication = () => {
  console.log('Edit Application:', localApplication.value.applicationId)
  emit('close-modal')
}

const generateCertificate = () => {
  console.log('Generate Certificate for Application:', localApplication.value.applicationId)
  emit('close-modal')
}
</script>

<style scoped>
/* Additional custom styles can be added here if needed */
</style>