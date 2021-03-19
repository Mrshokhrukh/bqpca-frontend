<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModalHandler" class="relative z-50">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-start justify-center p-4 sm:pt-12">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-gray-50 shadow-2xl transition-all max-h-screen sm:max-h-[calc(100vh-80px)] overflow-y-auto">

              <!-- Application Header -->
              <div v-if="application" class="px-8 py-6 bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
                <div class="flex justify-between items-center">
                  <div>
                    <h2 class="text-2xl font-bold tracking-tight">{{ application.proposalDetails?.firmName || 'Branch Application Details' }}</h2>
                    <p class="mt-1 text-white/90">Application ID: {{ application.id }}</p>
                  </div>

                  <div class="flex items-center space-x-4">
                    <!-- Edit Button -->
                    <button
                      type="button"
                      class="rounded-md text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                      @click="editApplicationHandler"
                      aria-label="Edit application details"
                    >
                      <PencilIcon class="h-5 w-5" aria-hidden="true" />
                    </button>

                    <!-- Status Indicator -->
                    <div class="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                      <span class="flex items-center">
                        <span class="h-3 w-3 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                        <span class="font-medium">{{ application.status }}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="application" class="px-8 py-6 bg-white space-y-6">
                <!-- Application Details Sections -->

                <!-- Personal Information -->
                <section class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <div class="p-6">
                    <div class="flex items-center mb-4">
                      <div class="bg-blue-100 p-2 rounded-md">
                        <UserIcon class="h-5 w-5 text-blue-600" />
                      </div>
                      <h4 class="font-semibold text-gray-900 ml-2">Personal Information</h4>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <p><strong>CID No.:</strong> {{ application.personalInfo?.cidNo }}</p>
                      <p><strong>Applicant's Name:</strong> {{ application.personalInfo?.applicantsName }}</p>
                      <p><strong>Gender:</strong> {{ application.personalInfo?.gender }}</p>
                      <p><strong>Date of Birth:</strong> {{ application.personalInfo?.dateOfBirth }}</p>
                      <p><strong>Contact No.:</strong> {{ application.personalInfo?.contactNo }}</p>
                      <p><strong>Email Address:</strong> {{ application.personalInfo?.emailAddress }}</p>
                    </div>
                  </div>
                </section>

                <!-- Residential Address -->
                <section class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <div class="p-6">
                    <div class="flex items-center mb-4">
                      <div class="bg-indigo-100 p-2 rounded-md">
                        <MapPinIcon class="h-5 w-5 text-indigo-600" />
                      </div>
                      <h4 class="font-semibold text-gray-900 ml-2">Residential Address</h4>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <p><strong>Office Number:</strong> {{ application.residentialAddress?.officeNumber }}</p>
                      <p><strong>Flat No:</strong> {{ application.residentialAddress?.flatNo }}</p>
                      <p><strong>Building No:</strong> {{ application.residentialAddress?.buildingNo }}</p>
                      <p><strong>Location:</strong> {{ application.residentialAddress?.location }}</p>
                      <p><strong>Gewog/Throm:</strong> {{ application.residentialAddress?.gewogThrom }}</p>
                      <p><strong>Dzongkhag/Thromde:</strong> {{ application.residentialAddress?.dzongkhagThromde }}</p>
                    </div>
                  </div>
                </section>

                <!-- Proposal Details -->
                <section class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <div class="p-6">
                    <div class="flex items-center mb-4">
                      <div class="bg-green-100 p-2 rounded-md">
                        <DocumentTextIcon class="h-5 w-5 text-green-600" />
                      </div>
                      <h4 class="font-semibold text-gray-900 ml-2">Proposal Details</h4>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <p><strong>Firm Name:</strong> {{ application.proposalDetails?.firmName }}</p>
                      <p><strong>Address of Proposed Firm:</strong> {{ application.proposalDetails?.addressOfProposedFirm }}</p>
                      <p><strong>Location of Proposed Firm:</strong> {{ application.proposalDetails?.locationOfProposedFirm }}</p>
                      <p><strong>Type of Firm:</strong> {{ application.proposalDetails?.typeOfFirm }}</p>
                    </div>
                  </div>
                </section>

                <!-- Infrastructure -->
                <section class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <div class="p-6">
                    <div class="flex items-center mb-4">
                      <div class="bg-amber-100 p-2 rounded-md">
                        <HomeModernIcon class="h-5 w-5 text-amber-600" />
                      </div>
                      <h4 class="font-semibold text-gray-900 ml-2">Infrastructure</h4>
                    </div>
                    <div v-if="application.infrastructure && application.infrastructure.length > 0">
                      <div v-for="(infra, index) in application.infrastructure" :key="index" class="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <p><strong>Particulars:</strong> {{ infra.particulars }}</p>
                          <p><strong>Description:</strong> {{ infra.description }}</p>
                          <p><strong>Quantity:</strong> {{ infra.quantity }}</p>
                          <p><strong>Remarks:</strong> {{ infra.remarks }}</p>
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      <p class="text-center py-4 text-gray-500 italic">No Infrastructure Details Added.</p>
                    </div>
                  </div>
                </section>

                <!-- Human Resources -->
                <section class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <div class="p-6">
                    <div class="flex items-center mb-4">
                      <div class="bg-purple-100 p-2 rounded-md">
                        <UserGroupIcon class="h-5 w-5 text-purple-600" />
                      </div>
                      <h4 class="font-semibold text-gray-900 ml-2">Human Resources</h4>
                    </div>
                    <div v-if="application.humanResource && application.humanResource.length > 0">
                      <div v-for="(hr, index) in application.humanResource" :key="index" class="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <p><strong>Position:</strong> {{ hr.position }}</p>
                          <p><strong>Full Name:</strong> {{ hr.fullName }}</p>
                          <p><strong>CID:</strong> {{ hr.cid }}</p>
                          <p><strong>Qualification:</strong> {{ hr.qualification }}</p>
                          <p><strong>Contact Number:</strong> {{ hr.contactNumber }}</p>
                          <p><strong>Email Address:</strong> {{ hr.emailAddress }}</p>
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      <p class="text-center py-4 text-gray-500 italic">No Human Resources Added.</p>
                    </div>
                  </div>
                </section>

                <!-- Finance Plan -->
                <section class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <div class="p-6">
                    <div class="flex items-center mb-4">
                      <div class="bg-teal-100 p-2 rounded-md">
                        <BanknotesIcon class="h-5 w-5 text-teal-600" />
                      </div>
                      <h4 class="font-semibold text-gray-900 ml-2">Finance Plan</h4>
                    </div>
                    <p>{{ application.financePlan?.financePlanDetails }}</p>
                  </div>
                </section>

                <!-- Services -->
                <section class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <div class="p-6">
                    <div class="flex items-center mb-4">
                      <div class="bg-lime-100 p-2 rounded-md">
                        <SquaresPlusIcon class="h-5 w-5 text-lime-600" />
                      </div>
                      <h4 class="font-semibold text-gray-900 ml-2">Services</h4>
                    </div>
                    <div v-if="application.services && application.services.length > 0">
                      <div v-for="(service, index) in application.services" :key="index" class="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <p><strong>Service Category:</strong> {{ service.serviceCategory }}</p>
                          <p><strong>Details:</strong> {{ service.details }}</p>
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      <p class="text-center py-4 text-gray-500 italic">No Services Added.</p>
                    </div>
                  </div>
                </section>

                <!-- SWOT Analysis -->
                <section class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <div class="p-6">
                    <div class="flex items-center mb-4">
                      <div class="bg-orange-100 p-2 rounded-md">
                        <ChartBarIcon class="h-5 w-5 text-orange-600" />
                      </div>
                      <h4 class="font-semibold text-gray-900 ml-2">SWOT Analysis</h4>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <p><strong>Strengths:</strong> {{ application.swotAnalysis?.strengths }}</p>
                      <p><strong>Weaknesses:</strong> {{ application.swotAnalysis?.weaknesses }}</p>
                      <p><strong>Opportunities:</strong> {{ application.swotAnalysis?.opportunities }}</p>
                      <p><strong>Threats:</strong> {{ application.swotAnalysis?.threats }}</p>
                    </div>
                  </div>
                </section>

                <!-- Fee Charges -->
                <section class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <div class="p-6">
                    <div class="flex items-center mb-4">
                      <div class="bg-rose-100 p-2 rounded-md">
                        <ReceiptPercentIcon class="h-5 w-5 text-rose-600" />
                      </div>
                      <h4 class="font-semibold text-gray-900 ml-2">Fee Charges</h4>
                    </div>
                    <div v-if="application.feeCharges && application.feeCharges.length > 0">
                      <div v-for="(fee, index) in application.feeCharges" :key="index" class="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <p><strong>Fee Breakup:</strong> {{ fee.feeBreakup }}</p>
                          <p><strong>Description:</strong> {{ fee.description }}</p>
                          <p><strong>Amount:</strong> {{ fee.amount }}</p>
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      <p class="text-center py-4 text-gray-500 italic">No Fee Charges Added.</p>
                    </div>
                  </div>
                </section>

                <!-- Supporting Documents -->
                <section class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <div class="p-6">
                    <div class="flex items-center mb-4">
                      <div class="bg-sky-100 p-2 rounded-md">
                        <PaperClipIcon class="h-5 w-5 text-sky-600" />
                      </div>
                      <h4 class="font-semibold text-gray-900 ml-2">Supporting Documents</h4>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p><strong>CV of Applicant:</strong> <a :href="application.supportingDocuments?.cvApplicant" target="_blank" class="text-blue-600 hover:underline">View Document</a></p>
                      </div>
                      <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p><strong>Declaration:</strong> <a :href="application.supportingDocuments?.declaration" target="_blank" class="text-blue-600 hover:underline">View Document</a></p>
                      </div>
                    </div>
                  </div>
                </section>

                <!-- Action Buttons -->
                <div class="mt-6 flex justify-end space-x-3">
                  <button type="button" 
                    class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" 
                    @click="approveDirectly(application)">
                    <CheckIcon class="h-4 w-4 mr-1" />
                    Approve
                  </button>
                  <button type="button" 
                    class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" 
                    @click="openRejectDialog">
                    <XMarkIcon class="h-4 w-4 mr-1" />
                    Reject
                  </button>
                  <button type="button"
                    class="inline-flex justify-center rounded-md px-6 py-2 font-semibold text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 transition-all"
                    @click="generateRecommendationLetter">
                    <DocumentTextIcon class="h-4 w-4 mr-1" />
                    Generate Recommendation Letter
                  </button>
                </div>
              </div>

              <!-- Footer buttons -->
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button"
                  class="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition-all"
                  @click="closeModalHandler">
                  <XMarkIcon class="h-4 w-4 inline-block mr-1" />
                  Close
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
  
  <!-- Reject Dialog -->
  <TransitionRoot appear :show="isRejectDialogOpen" as="template">
    <Dialog as="div" @close="closeRejectDialog" class="relative z-50">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                Reject Application
              </DialogTitle>
              
              <div class="mt-4">
                <p class="text-sm text-gray-500">
                  Please provide a reason for rejection. This will be included in the notification to the applicant.
                </p>
                <textarea
                  v-model="rejectReason"
                  rows="4"
                  class="mt-2 w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
                  placeholder="Enter rejection reason..."
                ></textarea>
              </div>

              <div class="mt-6 flex justify-end space-x-3">
                <button type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  @click="confirmReject">
                  Confirm Rejection
                </button>
                <button type="button"
                  class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  @click="closeRejectDialog">
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue';
import {
  UserIcon,
  MapPinIcon,
  DocumentTextIcon,
  PencilIcon,
  XMarkIcon,
  HomeModernIcon,
  UserGroupIcon,
  BanknotesIcon,
  SquaresPlusIcon,
  ChartBarIcon,
  ReceiptPercentIcon,
  PaperClipIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps({
  isOpen: Boolean,
  application: {
    type: Object,
    default: () => null,
  },
});

const emit = defineEmits(['close-modal', 'save-actions', 'generate-recommendation', 'edit']);

// Reject dialog state
const isRejectDialogOpen = ref(false);
const rejectReason = ref('');

const closeModalHandler = () => {
  emit('close-modal');
};

const editApplicationHandler = () => {
  emit('edit', props.application);
  closeModalHandler();
};

const approveDirectly = (application) => {
  application.status = 'Approved'; // optimistic update
  emit('save-actions', { action: 'approve', applicationId: application.id });
  closeModalHandler();
};

const openRejectDialog = () => {
  isRejectDialogOpen.value = true;
};

const closeRejectDialog = () => {
  isRejectDialogOpen.value = false;
  rejectReason.value = '';
};

const confirmReject = () => {
  if (props.application) {
    emit('save-actions', { 
      action: 'reject', 
      applicationId: props.application.id,
      reason: rejectReason.value,
      status: 'Rejected'
    });
    closeRejectDialog();
    closeModalHandler();
  }
};

const generateRecommendationLetter = () => {
  emit('generate-recommendation', props.application.id);
};
</script>