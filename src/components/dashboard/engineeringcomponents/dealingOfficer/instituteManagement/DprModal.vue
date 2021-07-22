<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModalHandler" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-screen items-center justify-center p-4 text-center">
        <!-- Background Overlay -->
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
          leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0"
          v-if="!isApproveDialogOpen && !isRejectDialogOpen">
          <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
        </TransitionChild>

        <!-- Modal Panel -->
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95">
          <DialogPanel
            class="w-full max-w-7xl transform overflow-hidden rounded-2xl bg-gray-50 text-left align-middle shadow-2xl transition-all max-h-[95vh]">
            <div v-if="transformedApplication" class="flex flex-col max-h-[95vh]">
              <!-- Header -->
              <div :class="[
                'px-4 py-3 sm:px-8 sm:py-5 border-b relative overflow-hidden flex-shrink-0',
                getStatusBannerClasses(overallStatus),
              ]">
                <div class="flex items-center justify-between relative z-10">
                  <div class="flex items-center space-x-4">
                    <div class="p-3 bg-white rounded-lg shadow-sm">
                      <FileText class="h-7 w-7 text-gray-700" />
                    </div>
                    <div>
                      <h3 class="text-lg sm:text-2xl font-semibold text-gray-900">
                        DPR Application Details
                      </h3>
                      <p class="text-xs sm:text-sm text-gray-600 mt-1">
                        Review DPR application information (ID: #{{ transformedApplication.id }})
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-3 sm:space-x-4">
                    <span :class="[
                      'px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium inline-flex items-center space-x-2 shadow-sm',
                      getStatusBadgeClasses(overallStatus),
                    ]">
                      <Circle :class="[
                        'h-3 w-3 sm:h-3.5 sm:w-3.5',
                        getStatusCircleClasses(overallStatus),
                      ]" />
                      <span>{{ overallStatus }}</span>
                    </span>
                    <button v-if="!isEditing && overallStatus === 'Pending'" type="button" class="btn btn-icon"
                      @click="startEditing" title="Edit Application">
                      <Pencil class="h-4 w-4" />
                    </button>
                    <button type="button"
                      class="p-2 text-gray-400 hover:text-gray-500 transition-colors rounded-full hover:bg-white"
                      @click="closeModalHandler">
                      <X class="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Main Scrollable Content -->
              <div class="px-4 py-4 sm:px-8 sm:py-6 bg-white overflow-y-auto flex-grow">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <!-- Left Column -->
                  <div class="lg:col-span-1 space-y-5">
                    <!-- Proponent Details Card -->
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
                      <h4 class="text-base sm:text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                        <Info class="h-5 w-5 text-gray-500" /> <span>Proponent Details</span>
                      </h4>
                      <div class="space-y-3 text-sm">
                        <div class="flex">
                          <span class="w-2/5 font-medium text-gray-500">CID:</span>
                          <span class="w-3/5 text-gray-800">{{
                            transformedApplication.cid || 'N/A'
                          }}</span>
                        </div>
                        <div class="flex">
                          <span class="w-2/5 font-medium text-gray-500">Full Name:</span>
                          <span class="w-3/5 text-gray-800">{{
                            transformedApplication.fullName || 'N/A'
                          }}</span>
                        </div>
                        <div class="flex">
                          <span class="w-2/5 font-medium text-gray-500">Contact:</span>
                          <span v-if="!isEditing" class="w-3/5 text-gray-800">{{
                            transformedApplication.contactNo || 'N/A'
                          }}</span>
                          <input v-else type="text" v-model="editedApplication.contactNo"
                            class="form-input w-3/5 text-sm py-1" />
                        </div>
                        <div class="flex">
                          <span class="w-2/5 font-medium text-gray-500">Email:</span>
                          <span v-if="!isEditing" class="w-3/5 text-gray-800 break-all">{{
                            transformedApplication.emailAddress || 'N/A'
                          }}</span>
                          <input v-else type="email" v-model="editedApplication.emailAddress"
                            class="form-input w-3/5 text-sm py-1" />
                        </div>
                      </div>
                    </div>

                    <!-- Head of Institution Details Card -->
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
                      <h4 class="text-base sm:text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                        <User class="h-5 w-5 text-gray-500" /> <span>Head of Institution</span>
                      </h4>
                      <div class="space-y-3 text-sm">
                        <div class="flex">
                          <span class="w-2/5 font-medium text-gray-500">Name:</span>
                          <span v-if="!isEditing" class="w-3/5 text-gray-800">{{
                            transformedApplication.headName || 'N/A'
                          }}</span>
                          <input v-else type="text" v-model="editedApplication.headName"
                            class="form-input w-3/5 text-sm py-1" />
                        </div>
                        <div class="flex">
                          <span class="w-2/5 font-medium text-gray-500">Phone:</span>
                          <span v-if="!isEditing" class="w-3/5 text-gray-800">{{
                            transformedApplication.headPhone || 'N/A'
                          }}</span>
                          <input v-else type="text" v-model="editedApplication.headPhone"
                            class="form-input w-3/5 text-sm py-1" />
                        </div>
                        <div class="flex">
                          <span class="w-2/5 font-medium text-gray-500">Email:</span>
                          <span v-if="!isEditing" class="w-3/5 text-gray-800 break-all">{{
                            transformedApplication.headEmail || 'N/A'
                          }}</span>
                          <input v-else type="email" v-model="editedApplication.headEmail"
                            class="form-input w-3/5 text-sm py-1" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Right Column -->
                  <div class="lg:col-span-2 space-y-5">
                    <!-- DPR Overview Card -->
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
                      <h4 class="text-base sm:text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                        <ClipboardList class="h-5 w-5 text-gray-500" /> <span>DPR Overview</span>
                      </h4>
                      <div class="space-y-4 text-sm">
                        <div class="flex flex-col sm:flex-row">
                          <span class="w-full sm:w-1/3 font-medium text-gray-500 mb-1 sm:mb-0">DPR Name:</span>
                          <span v-if="!isEditing" class="w-full sm:w-2/3 text-gray-800">{{
                            transformedApplication.dprName || 'N/A'
                          }}</span>
                          <input v-else type="text" v-model="editedApplication.dprName"
                            class="form-input w-full sm:w-2/3 text-sm py-1" />
                        </div>
                        <div class="flex items-center">
                          <span class="w-1/3 font-medium text-gray-500">Proponent's Docs:</span>
                          <div class="w-2/3">
                            <a v-if="transformedApplication.supportingDocuments"
                              :href="transformedApplication.supportingDocuments" target="_blank"
                              class="text-sm text-blue-600 hover:underline inline-flex items-center">View Document
                              <ExternalLink class="h-3 w-3 ml-1" />
                            </a>
                            <span v-else class="text-sm text-gray-500 italic">Not available</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Verification Status Card -->
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
                      <h4 class="text-base sm:text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                        <ShieldCheck class="h-5 w-5 text-gray-500" />
                        <span>Verification Status</span>
                      </h4>
                      <div class="space-y-4 text-sm">
                        <div class="flex items-center">
                          <span class="w-1/3 font-medium text-gray-500">Payment Status:</span>
                          <span :class="[
                            'px-2 py-0.5 rounded-full text-xs font-medium',
                            transformedApplication.isPaymentComplete
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800',
                          ]">
                            {{
                              transformedApplication.isPaymentComplete ? 'Paid' : 'Payment Pending'
                            }}
                          </span>
                        </div>
                        <div class="flex items-center">
                          <span class="w-1/3 font-medium text-gray-500">Physical Verification:</span>
                          <div v-if="transformedApplication.isPhysicalVerification" class="w-2/3">
                            <span
                              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle class="h-3 w-3 mr-1" />
                              Verified
                            </span>
                          </div>
                          <div v-else class="w-2/3 flex items-center space-x-4">
                            <select v-model="verificationStatus" class="form-input w-auto text-sm py-1"
                              :disabled="isSavingVerification">
                              <option :value="false">Not Verified Yet</option>
                              <option :value="true">Mark as Verified</option>
                            </select>
                            <button @click="savePhysicalVerification"
                              :disabled="isSavingVerification || verificationStatus === transformedApplication.isPhysicalVerification"
                              class="btn btn-secondary text-xs">
                              <Save class="h-3 w-3" />
                              <span>{{ isSavingVerification ? 'Saving...' : 'Save' }}</span>
                            </button>
                          </div>
                        </div>
                        <p v-if="verificationMessage" class="text-xs text-center mt-2"
                          :class="verificationMessageIsError ? 'text-red-500' : 'text-green-600'">
                          {{ verificationMessage }}
                        </p>
                      </div>
                    </div>

                    <!-- Tab Navigation -->
                    <div class="border-b border-gray-200">
                      <nav class="flex flex-wrap -mb-px" aria-label="Tabs">
                        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                          'whitespace-nowrap py-3 px-3 border-b-2 font-medium text-sm',
                        ]">
                          {{ tab.name }}
                        </button>
                      </nav>
                    </div>

                    <!-- Tab Panels -->
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
                      <div v-for="tab in tabs" :key="tab.id">
                        <div v-if="activeTab === tab.id">
                          <h4 class="text-base font-medium text-gray-900 mb-2">
                            {{ tab.name }}
                          </h4>
                          <p v-if="!isEditing"
                            class="text-gray-800 whitespace-pre-wrap h-64 overflow-y-auto p-2 bg-gray-50 rounded-md">
                            {{ transformedApplication[tab.id] || 'N/A' }}
                          </p>
                          <textarea v-else v-model="editedApplication[tab.id]" rows="10"
                            class="form-input w-full text-sm" :disabled="overallStatus !== 'Pending'"></textarea>
                        </div>
                      </div>
                    </div>

                    <!-- Review Decision Details (Conditional) -->
                    <div v-if="overallStatus !== 'Pending'"
                      class="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
                      <h4 class="text-base sm:text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                        <MessageSquare class="h-5 w-5 text-gray-500" />
                        <span>Review Decision Details</span>
                      </h4>
                      <div class="space-y-4 text-sm">
                        <div class="flex flex-col">
                          <span class="w-full font-medium text-gray-500 mb-1">Review Summary:</span>
                          <p class="text-gray-800 whitespace-pre-wrap">
                            {{ transformedApplication.reviewSummary || 'N/A' }}
                          </p>
                        </div>
                        <div class="flex items-center">
                          <span class="w-1/3 font-medium text-gray-500">Final Review Report:</span>
                          <div class="w-2/3">
                            <a v-if="transformedApplication.reviewReportUpload"
                              :href="transformedApplication.reviewReportUpload" target="_blank"
                              class="text-sm text-blue-600 hover:underline inline-flex items-center">View Document
                              <ExternalLink class="h-3 w-3 ml-1" />
                            </a>
                            <span v-else class="text-sm text-gray-500 italic">Not available</span>
                          </div>
                        </div>
                        <div v-if="overallStatus === 'Regretted'" class="flex flex-col">
                          <span class="w-full font-medium text-gray-500 mb-1">Reason for Regret:</span>
                          <p class="text-gray-800 whitespace-pre-wrap">
                            {{ transformedApplication.reasonIfRejected || 'N/A' }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="px-4 py-3 sm:px-8 sm:py-4 bg-gray-100 border-t border-gray-200 flex-shrink-0">
                <div class="flex justify-between items-center">
                  <div v-if="errorMessage" class="text-sm text-red-600 flex items-center space-x-2 flex-grow mr-4">
                    <CircleAlert class="h-4 w-4 flex-shrink-0" /> <span>{{ errorMessage }}</span>
                  </div>
                  <div v-else class="flex-grow"></div>
                  <div class="flex items-center space-x-3">
                    <template v-if="isEditing">
                      <button class="btn btn-primary" @click="saveChanges" :disabled="isSaving">
                        <Save class="h-4 w-4" />
                        <span>{{ isSaving ? 'Saving...' : 'Save Changes' }}</span>
                      </button>
                      <button class="btn btn-secondary" @click="cancelEditing" :disabled="isSaving">
                        <X class="h-4 w-4" /> <span>Cancel</span>
                      </button>
                    </template>
                    <template v-if="!isEditing && overallStatus === 'Pending'">
                      <button type="button" class="btn btn-success" @click="openApproveDialog"
                        :disabled="!transformedApplication.isPaymentComplete" :title="!transformedApplication.isPaymentComplete
                          ? 'Cannot approve, payment is pending.'
                          : 'Approve Application'
                          ">
                        <Check class="h-4 w-4" /> <span>Approve</span>
                      </button>
                      <button type="button" class="btn btn-danger" @click="openRejectDialog">
                        <XCircle class="h-4 w-4" /> <span>Regret</span>
                      </button>
                    </template>
                    <button v-if="!isEditing && overallStatus !== 'Pending'" type="button" class="btn btn-secondary"
                      @click="closeModalHandler">
                      <X class="h-4 w-4" /> <span>Close</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Custom Approve Dialog -->
              <TransitionRoot appear :show="isApproveDialogOpen" as="template">
                <Dialog as="div" @close="cancelApproval" class="relative z-[60]">
                  <div class="fixed inset-0 bg-black/50" />
                  <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4">
                      <DialogPanel as="div"
                        class="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all">
                        <div class="mb-5 text-center">
                          <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                            <Check class="h-7 w-7 text-green-600" />
                          </div>
                          <h3 class="text-xl font-semibold text-gray-900 mt-4">
                            Approve DPR Application
                          </h3>
                          <p class="mt-2 text-sm text-gray-500">
                            Provide any summary notes for this approval.
                          </p>
                        </div>
                        <div class="mt-4">
                          <label for="approval-notes" class="block text-sm font-medium text-gray-700 mb-2">
                            Approval Summary
                          </label>
                          <textarea id="approval-notes" v-model="approvalNotes" rows="4" class="form-input w-full"
                            placeholder="Enter approval summary..."></textarea>
                        </div>
                        <div class="mt-6 flex justify-end space-x-3">
                          <button type="button" class="btn btn-secondary" @click="cancelApproval">Cancel</button>
                          <button type="button" class="btn btn-success" @click="confirmApproval">
                            <Check class="w-4 h-4 mr-1.5" />Approve
                          </button>
                        </div>
                      </DialogPanel>
                    </div>
                  </div>
                </Dialog>
              </TransitionRoot>

              <!-- Custom Reject Dialog -->
              <TransitionRoot appear :show="isRejectDialogOpen" as="template">
                <Dialog as="div" @close="cancelRejection" class="relative z-[60]">
                  <div class="fixed inset-0 bg-black/50" />
                  <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4">
                      <DialogPanel as="div"
                        class="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all">
                        <div class="mb-5 text-center">
                          <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                            <XCircle class="h-7 w-7 text-red-600" />
                          </div>
                          <h3 class="text-xl font-semibold text-gray-900 mt-4">
                            Regret DPR Application
                          </h3>
                          <p class="mt-2 text-sm text-gray-500">
                            Please provide a reason for rejecting this application.
                          </p>
                        </div>
                        <div class="mt-4">
                          <label for="rejection-reason" class="block text-sm font-medium text-gray-700 mb-2">
                            Reason for Rejection <span class="text-red-500">*</span>
                          </label>
                          <textarea id="rejection-reason" v-model="rejectionReason" rows="4" class="form-input w-full"
                            placeholder="Provide a clear reason for rejection..."></textarea>
                          <p v-if="rejectionError" class="mt-1 text-xs text-red-600">{{ rejectionError }}</p>
                        </div>
                        <div class="mt-6 flex justify-end space-x-3">
                          <button type="button" class="btn btn-secondary" @click="cancelRejection">Cancel</button>
                          <button type="button" :disabled="!rejectionReason.trim()" class="btn btn-danger"
                            @click="confirmRejection">
                            <XCircle class="w-4 h-4 mr-1.5" />Regret
                          </button>
                        </div>
                      </DialogPanel>
                    </div>
                  </div>
                </Dialog>
              </TransitionRoot>

            </div>
            <div v-else class="p-10 text-center text-gray-500">
              Loading application details...
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import {
  Dialog,
  DialogPanel,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue';
import {
  FileText, Circle, X, Pencil, Save, Check, XCircle, Info, MessageSquare, ClipboardList,
  CircleAlert, User, ExternalLink, ShieldCheck, CheckCircle
} from 'lucide-vue-next';
import apiService from '@/services/services';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  application: { type: Object, default: () => null },
});

const emit = defineEmits(['close', 'save', 'approve', 'regretted']);

// Component State
const isEditing = ref(false);
const editedApplication = ref({});
const errorMessage = ref('');
const isSaving = ref(false);
const filesToUpload = ref({});
const activeTab = ref('vision_mission_strategies');

// Verification State
const verificationStatus = ref(false);
const isSavingVerification = ref(false);
const verificationMessage = ref('');
const verificationMessageIsError = ref(false);


// Dialog States
const isApproveDialogOpen = ref(false);
const isRejectDialogOpen = ref(false);
const approvalNotes = ref('');
const rejectionReason = ref('');
const rejectionError = ref('');

const tabs = ref([
  { id: 'vision_mission_strategies', name: 'Vision & Mission' },
  { id: 'project_scheduling', name: 'Scheduling' },
  { id: 'gross_national_happiness', name: 'GNH' },
  { id: 'land_details', name: 'Land Details' },
  { id: 'conceptual_master_plan', name: 'Master Plan' },
  { id: 'academic_plan', name: 'Academic Plan' },
  { id: 'affiliation_details', name: 'Affiliation' },
  { id: 'teaching_hospital', name: 'Teaching Hospital' },
  { id: 'research_policy', name: 'Research' },
  { id: 'human_resource', name: 'HR' },
  { id: 'quality_assurance', name: 'QA' },
  { id: 'governance_structure', name: 'Governance' },
  { id: 'business_plan', name: 'Business Plan' },
  { id: 'project_cost_analysis', name: 'Cost Analysis' },
  { id: 'facilities_student_services', name: 'Facilities' },
  { id: 'admission_policy', name: 'Admission' },
  { id: 'service_conditions', name: 'Service Conditions' },
  { id: 'safety_security', name: 'Safety' },
  { id: 'public_information_system', name: 'Public Info' },
  { id: 'other_details', name: 'Other Details' },
]);


const transformedApplication = computed(() => {
  if (!props.application) return null;
  const transformed = {
    id: props.application.id,
    cid: props.application.CID,
    fullName: props.application.full_name,
    contactNo: props.application.contact_no,
    emailAddress: props.application.email_address,
    headName: props.application.head_of_institution_name,
    headPhone: props.application.head_of_institution_phone_number,
    headEmail: props.application.head_of_institution_email,
    dprName: props.application.dpr_name,
    supportingDocuments: props.application.supporting_documents,
    reviewSummary: props.application.do_dpr_review_summary,
    reviewReportUpload: props.application.do_dpr_report,
    dprReviewDecision: props.application.do_dpr_review_decision,
    reasonIfRejected: props.application.reason_if_rejected,
    isPaymentComplete: props.application.is_payment_complete,
    isPhysicalVerification: props.application.is_physical_verification,
  };

  tabs.value.forEach(tab => {
    transformed[tab.id] = props.application[tab.id];
  });

  return transformed;
});

const overallStatus = computed(() => {
  return transformedApplication.value?.dprReviewDecision || 'Pending';
});

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal && props.application) {
      isEditing.value = false;
      errorMessage.value = '';
      isSaving.value = false;
      filesToUpload.value = {};
      activeTab.value = 'vision_mission_strategies';
      verificationStatus.value = props.application.is_physical_verification || false;
      isSavingVerification.value = false;
      verificationMessage.value = '';
      isApproveDialogOpen.value = false;
      isRejectDialogOpen.value = false;
      approvalNotes.value = '';
      rejectionReason.value = '';
      rejectionError.value = '';
    }
  }
);


const startEditing = () => {
  if (!transformedApplication.value || overallStatus.value !== 'Pending') return;
  editedApplication.value = JSON.parse(JSON.stringify(transformedApplication.value));
  isEditing.value = true;
  errorMessage.value = '';
};

const cancelEditing = () => {
  isEditing.value = false;
  errorMessage.value = '';
};

const savePhysicalVerification = async () => {
  if (!transformedApplication.value?.id) return;
  isSavingVerification.value = true;
  verificationMessage.value = '';
  try {
    const formData = new FormData();
    formData.append('is_physical_verification', verificationStatus.value);
    await apiService.patchEpcInstitute(transformedApplication.value.id, formData);
    verificationMessage.value = 'Verification status updated successfully.';
    verificationMessageIsError.value = false;
    emit('save');
  } catch (error) {
    console.error('Error updating verification status:', error);
    verificationMessage.value = 'Failed to update status.';
    verificationMessageIsError.value = true;
  } finally {
    isSavingVerification.value = false;
    setTimeout(() => verificationMessage.value = '', 3000);
  }
};


const saveChanges = async () => {
  if (!transformedApplication.value?.id) return;
  isSaving.value = true;
  errorMessage.value = '';

  try {
    const formData = new FormData();
    const original = transformedApplication.value;
    const edited = editedApplication.value;

    const fieldsToCompare = [
      'contactNo', 'emailAddress', 'headName', 'headPhone', 'headEmail', 'dprName',
      ...tabs.value.map(t => t.id)
    ];

    const fieldMap = {
      contactNo: 'contact_no',
      emailAddress: 'email_address',
      headName: 'head_of_institution_name',
      headPhone: 'head_of_institution_phone_number',
      headEmail: 'head_of_institution_email',
      dprName: 'dpr_name',
    };

    fieldsToCompare.forEach(key => {
      if (original[key] !== edited[key]) {
        const apiKey = fieldMap[key] || key;
        if (edited[key] !== null && edited[key] !== undefined) {
          formData.append(apiKey, edited[key]);
        }
      }
    });

    if ([...formData.entries()].length === 0) {
      isEditing.value = false;
      return;
    }

    await apiService.patchEpcInstitute(transformedApplication.value.id, formData);
    isEditing.value = false;
    emit('save');
  } catch (error) {
    console.error('Error updating application:', error);
    errorMessage.value = 'Failed to save changes. Please try again.';
  } finally {
    isSaving.value = false;
  }
};

const closeModalHandler = () => emit('close');

const openApproveDialog = () => {
  if (!transformedApplication.value.isPaymentComplete || overallStatus.value !== 'Pending') return;
  isApproveDialogOpen.value = true;
};
const openRejectDialog = () => {
  if (overallStatus.value !== 'Pending') return;
  isRejectDialogOpen.value = true;
};
const cancelApproval = () => (isApproveDialogOpen.value = false);
const cancelRejection = () => (isRejectDialogOpen.value = false);

const confirmApproval = async () => {
  if (!transformedApplication.value?.id) return;
  try {
    const updateData = {
      do_dpr_review_decision: 'Approved',
      do_dpr_review_summary: approvalNotes.value.trim() || 'Application Approved',
    };
    await apiService.patchEpcInstitute(transformedApplication.value.id, updateData);
    emit('approve', transformedApplication.value);
    isApproveDialogOpen.value = false;
  } catch (error) {
    console.error('Error approving application:', error);
    errorMessage.value = `Approval failed: ${error.response?.data?.detail || error.message}`;
    cancelApproval();
  }
};

const confirmRejection = async () => {
  rejectionError.value = '';
  if (!rejectionReason.value.trim()) {
    rejectionError.value = 'Reason for regret is required.';
    return;
  }
  if (!transformedApplication.value?.id) return;

  try {
    const updateData = {
      do_dpr_review_decision: 'Regretted',
      reason_if_rejected: rejectionReason.value.trim(),
    };
    await apiService.patchEpcInstitute(transformedApplication.value.id, updateData);
    emit('regretted');
    isRejectDialogOpen.value = false;
  } catch (error) {
    console.error('Error rejecting application:', error);
    rejectionError.value = `Rejection failed: ${error.response?.data?.detail || error.message}`;
  }
};

// UI Helper Functions
const getStatusBannerClasses = (status) => ({
  'bg-green-50 border-green-200': status === 'Approved',
  'bg-red-50 border-red-200': status === 'Regretted',
  'bg-yellow-50 border-yellow-200': status === 'Pending',
});

const getStatusBadgeClasses = (status) => ({
  'bg-green-100 text-green-800': status === 'Approved',
  'bg-red-100 text-red-800': status === 'Regretted',
  'bg-yellow-100 text-yellow-800': status === 'Pending',
});

const getStatusCircleClasses = (status) => ({
  'text-green-500': status === 'Approved',
  'text-red-500': status === 'Regretted',
  'text-yellow-500': status === 'Pending',
});
</script>

<style scoped>
.form-input {
  @apply block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed;
}

.file-input {
  @apply block w-full text-xs text-gray-600 file:mr-3 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50;
}

.btn {
  @apply inline-flex items-center justify-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-icon {
  @apply p-2;
}

.btn-primary {
  @apply text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500;
}

.btn-secondary {
  @apply text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500;
}

.btn-success {
  @apply text-white bg-green-600 hover:bg-green-700 focus:ring-green-500;
}

.btn-danger {
  @apply text-white bg-red-600 hover:bg-red-700 focus:ring-red-500;
}

.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.gray.300') transparent;
}
</style>
