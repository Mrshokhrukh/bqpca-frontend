<template>
  <TransitionRoot appear :show="isOpen" as="div">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild as="div" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-start justify-center p-4 sm:pt-12">
          <TransitionChild as="div" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
              <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  ECPF Linkage Establishment Application
                </DialogTitle>
                <button
                  @click="showFullEditModal = true"
                  class="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <PencilIcon class="h-5 w-5" />
                  <span class="ml-1">Edit All Details</span>
                </button>
              </div>

              <div class="px-6 py-6">
                <div class="grid grid-cols-1 gap-6">
                  <!-- Current Details of ECPF -->
                  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="bg-blue-100 p-2 rounded-md">
                          <DocumentDuplicateIcon class="h-5 w-5 text-blue-600" />
                        </div>
                        <h4 class="font-semibold text-gray-900 ml-2">Current Details of ECPF</h4>
                      </div>
                      <p><strong>ECPF Name:</strong> {{ linkage.ecpfName || 'N/A' }}</p>
                      <p><strong>Proprietor of the ECPF:</strong> {{ linkage.proprietorName || 'N/A' }}</p>
                      <p><strong>CID of the Proprietor:</strong> {{ linkage.proprietorCid || 'N/A' }}</p>
                      <p><strong>Location of ECPF:</strong> {{ linkage.ecpfLocation || 'N/A' }}</p>
                      <p><strong>Contact No.:</strong> {{ linkage.contactNo || 'N/A' }}</p>
                      <p><strong>Email Address:</strong> {{ linkage.emailAddress || 'N/A' }}</p>
                    </div>
                  </div>

                  <!-- Institute Linkage Details (HEI) -->
                  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="bg-indigo-100 p-2 rounded-md">
                          <DocumentTextIcon class="h-5 w-5 text-indigo-600" />
                        </div>
                        <h4 class="font-semibold text-gray-900 ml-2">Institute Linkage Details (HEI)</h4>
                      </div>
                      <p><strong>Name of HEI:</strong> {{ linkage.heiName || 'N/A' }}</p>
                      <p><strong>Official Website:</strong> {{ linkage.officialWebsite || 'N/A' }}</p>
                      <p><strong>Location:</strong> {{ linkage.heiLocation || 'N/A' }}</p>
                      <p><strong>Country:</strong> {{ linkage.heiCountry || 'N/A' }}</p>
                      <p><strong>Year of Establishment:</strong> {{ linkage.yearEstablished || 'N/A' }}</p>
                      <p><strong>Recognised By:</strong> {{ linkage.recognizedBy || 'N/A' }}</p>
                      <p><strong>Accredited By:</strong> {{ linkage.accreditedBy || 'N/A' }}</p>
                      <p><strong>Affiliation to, if applicable:</strong> {{ linkage.affiliation || 'N/A' }}</p>
                      <p><strong>Approval from relevant professional bodies, if relevant:</strong> {{ linkage.approvalFromProBodies || 'N/A' }}</p>
                      <p><strong>Report on HEI Visit:</strong> <button class="text-indigo-600 hover:text-indigo-800">View</button></p>
                    </div>
                  </div>

                  <!-- Programme/Course Details -->
                  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="bg-green-100 p-2 rounded-md">
                          <DocumentTextIcon class="h-5 w-5 text-green-600" />
                        </div>
                        <h4 class="font-semibold text-gray-900 ml-2">Programme/Course Details</h4>
                      </div>
                      <template v-if="linkage.courses && linkage.courses.length > 0">
                        <div v-for="(course, index) in linkage.courses" :key="index" class="border-b pb-4 mb-4">
                          <h5 class="font-medium text-gray-700 mb-2">Course {{ index + 1 }}</h5>
                          <p><strong>Name of Programme/Courses:</strong> {{ course.programmeName || 'N/A' }}</p>
                          <p><strong>Level:</strong> {{ course.level || 'N/A' }}</p>
                          <p><strong>Minimum Credit:</strong> {{ course.minimumCredit || 'N/A' }}</p>
                          <p><strong>Qualification Type:</strong> {{ course.qualificationType || 'N/A' }}</p>
                          <p><strong>Remarks:</strong> {{ course.remarks || 'N/A' }}</p>
                        </div>
                      </template>
                      <div v-else>
                        <p class="text-center py-6 text-gray-500 italic">No Programme/Course Details Available.</p>
                      </div>

                    </div>
                  </div>


                </div>
              </div>
              <div class="px-6 py-4 bg-gray-50 flex justify-between">
                <div class="flex space-x-3">
                  <button type="button" @click="showRejectModal = true"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    <XMarkIcon class="h-4 w-4 mr-1" />
                    Regret
                  </button>
                  <button type="button" @click="showApproveModal = true"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    <CheckIcon class="h-4 w-4 mr-1" />
                    Approve
                  </button>
                </div>
                <button type="button" @click="closeModal"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Close
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>


    <!-- Full Edit Modal (Chief Edit All) -->
    <Dialog :open="showFullEditModal" @close="closeFullEditModal" class="relative z-50">
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <DialogPanel class="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all overflow-y-scroll max-h-[90vh]">
            <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-4">
              Edit All Application Details
            </DialogTitle>
            <div class="mt-2 space-y-6">
              <p class="text-sm text-gray-500">
                Modify all sections of the application below.
              </p>

              <!-- Edit ECPF Details -->
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">ECPF Details</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="editEcpfName" class="block text-sm font-medium text-gray-700 mb-1">ECPF Name:</label>
                    <input type="text" id="editEcpfName" v-model="editForm.ecpfName" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label for="editProprietorName" class="block text-sm font-medium text-gray-700 mb-1">Proprietor Name:</label>
                    <input type="text" id="editProprietorName" v-model="editForm.proprietorName" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label for="editProprietorCid" class="block text-sm font-medium text-gray-700 mb-1">Proprietor CID:</label>
                    <input type="text" id="editProprietorCid" v-model="editForm.proprietorCid" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label for="editLocation" class="block text-sm font-medium text-gray-700 mb-1">Location of ECPF:</label>
                    <input type="text" id="editLocation" v-model="editForm.ecpfLocation" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label for="editContact" class="block text-sm font-medium text-gray-700 mb-1">Contact No.:</label>
                    <input type="text" id="editContact" v-model="editForm.contactNo" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label for="editEmail" class="block text-sm font-medium text-gray-700 mb-1">Email Address:</label>
                    <input type="email" id="editEmail" v-model="editForm.emailAddress" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                  </div>
                </div>
              </div>

              <!-- Edit HEI Details -->
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">HEI Details</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="editHeiName" class="block text-sm font-medium text-gray-700 mb-1">Name of HEI:</label>
                    <input type="text" id="editHeiName" v-model="editForm.heiName" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label for="editOfficialWebsite" class="block text-sm font-medium text-gray-700 mb-1">Official Website:</label>
                    <input type="url" id="editOfficialWebsite" v-model="editForm.officialWebsite" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label for="editHeiLocation" class="block text-sm font-medium text-gray-700 mb-1">Location (HEI):</label>
                    <input type="text" id="editHeiLocation" v-model="editForm.heiLocation" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label for="editHeiCountry" class="block text-sm font-medium text-gray-700 mb-1">Country (HEI):</label>
                    <input type="text" id="editHeiCountry" v-model="editForm.heiCountry" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label for="editYearEstablished" class="block text-sm font-medium text-gray-700 mb-1">Year of Establishment:</label>
                    <input type="text" id="editYearEstablished" v-model="editForm.yearEstablished" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label for="editRecognizedBy" class="block text-sm font-medium text-gray-700 mb-1">Recognised By:</label>
                    <input type="text" id="editRecognizedBy" v-model="editForm.recognizedBy" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label for="editAccreditedBy" class="block text-sm font-medium text-gray-700 mb-1">Accredited By:</label>
                    <input type="text" id="editAccreditedBy" v-model="editForm.accreditedBy" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label for="editAffiliation" class="block text-sm font-medium text-gray-700 mb-1">Affiliation (if applicable):</label>
                    <input type="text" id="editAffiliation" v-model="editForm.affiliation" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label for="editApprovalFromProBodies" class="block text-sm font-medium text-gray-700 mb-1">Approval from Professional Bodies:</label>
                    <input type="text" id="editApprovalFromProBodies" v-model="editForm.approvalFromProBodies" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label for="editReportOnHeiVisit" class="block text-sm font-medium text-gray-700 mb-1">Report on HEI Visit:</label>
                    <input type="file" id="editReportOnHeiVisit" @change="handleReportUpload" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                    <span v-if="editForm.reportOnHeiVisitName" class="text-gray-500 text-sm mt-1 block">Current File: {{ editForm.reportOnHeiVisitName }}</span>
                  </div>
                </div>
              </div>

              <!-- Edit Programme/Course Details -->
              <div>
                <h4 class="font-semibold text-gray-900 mb-2">Programme/Course Details</h4>
                <p class="text-sm text-gray-500 mb-2">Edit the Programme/Course details below. You can add, modify, or delete courses.</p>

                <template v-if="editCourseForm.courses && editCourseForm.courses.length > 0">
                  <div v-for="(course, index) in editCourseForm.courses" :key="index" class="border rounded-md p-4 mb-4">
                    <h5 class="font-medium text-gray-700 mb-2">Course {{ index + 1 }}</h5>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label :for="`editProgrammeName-${index}`" class="block text-sm font-medium text-gray-700 mb-1">Name of Programme/Courses:</label>
                        <input type="text" :id="`editProgrammeName-${index}`" v-model="course.programmeName" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label :for="`editLevel-${index}`" class="block text-sm font-medium text-gray-700 mb-1">Level:</label>
                        <input type="text" :id="`editLevel-${index}`" v-model="course.level" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label :for="`editMinimumCredit-${index}`" class="block text-sm font-medium text-gray-700 mb-1">Minimum Credit:</label>
                        <input type="text" :id="`editMinimumCredit-${index}`" v-model="course.minimumCredit" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label :for="`editQualificationType-${index}`" class="block text-sm font-medium text-gray-700 mb-1">Qualification Type:</label>
                        <input type="text" :id="`editQualificationType-${index}`" v-model="course.qualificationType" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label :for="`editRemarks-${index}`" class="block text-sm font-medium text-gray-700 mb-1">Remarks:</label>
                        <textarea :id="`editRemarks-${index}`" v-model="course.remarks" rows="2" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
                      </div>
                    </div>
                    <button
                      @click="removeCourse(index)"
                      type="button"
                      class="mt-2 inline-flex items-center px-3 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all"
                    >
                      Remove Course
                    </button>
                  </div>
                </template>
                <button
                  @click="addCourse"
                  type="button"
                  class="inline-flex items-center px-4 py-2 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all"
                >
                  Add Course
                </button>
              </div>


            </div>
            <div class="mt-6 flex justify-end space-x-2">
              <button
                type="button"
                @click="closeFullEditModal"
                class="rounded-md px-4 py-2 font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                @click="saveFullEdit"
                class="rounded-md px-4 py-2 font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all"
              >
                Save Changes
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>


    <!-- Regret Modal -->
    <Dialog :open="showRejectModal" @close="closeRejectModal" class="relative z-50">
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
            <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-4">
              Regret Application
            </DialogTitle>
            <div class="mt-2">
              <p class="text-sm text-gray-500 mb-2">
                You are about to regret this ECPF Linkage application. Please provide the reason for regret.
              </p>
              <div>
                <label for="rejectionReason" class="block text-sm font-medium text-gray-700 mb-1">Regret Reason:</label>
                <textarea
                  id="rejectionReason"
                  v-model="rejectionMessage"
                  rows="4"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  placeholder="Please provide a detailed reason for regret..."
                  required
                ></textarea>
              </div>
            </div>
            <div class="mt-6 flex justify-end space-x-2">
              <button
                type="button"
                @click="closeRejectModal"
                class="rounded-md px-4 py-2 font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                @click="finalReject"
                class="rounded-md px-4 py-2 font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all"
                :disabled="!rejectionMessage.trim()"
              >
                Confirm Regret
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>

    <!-- Approve Modal -->
    <Dialog :open="showApproveModal" @close="closeApproveModal" class="relative z-50">
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
            <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-4">
              Approve Application
            </DialogTitle>
            <div class="mt-2">
              <p class="text-sm text-gray-500 mb-4">
                You are about to approve this ECPF Linkage application.
              </p>
            </div>
            <div class="mt-6 flex justify-end space-x-2">
              <button
                type="button"
                @click="closeApproveModal"
                class="rounded-md px-4 py-2 font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                @click="finalApprove"
                class="rounded-md px-4 py-2 font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all"
              >
                Confirm Approval
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>


  </TransitionRoot>
</template>
<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { 
  TransitionRoot, 
  TransitionChild, 
  Dialog, 
  DialogPanel, 
  DialogTitle 
} from '@headlessui/vue';
import { 
  XMarkIcon, 
  CheckIcon, 
  PencilIcon, 
  DocumentDuplicateIcon, 
  DocumentTextIcon 
} from '@heroicons/vue/24/outline';

// Props
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  applicationId: {
    type: String,
    default: ''
  }
});

// Emits
const emit = defineEmits(['close', 'approved', 'rejected', 'updated']);

// Modal states
const showFullEditModal = ref(false);
const showRejectModal = ref(false);
const showApproveModal = ref(false);
const rejectionMessage = ref('');

// Main data object for the application details
const linkage = reactive({
  ecpfName: '',
  proprietorName: '',
  proprietorCid: '',
  ecpfLocation: '',
  contactNo: '',
  emailAddress: '',
  heiName: '',
  officialWebsite: '',
  heiLocation: '',
  heiCountry: '',
  yearEstablished: '',
  recognizedBy: '',
  accreditedBy: '',
  affiliation: '',
  approvalFromProBodies: '',
  reportOnHeiVisit: null,
  reportOnHeiVisitName: '',
  courses: []
});

// Form for editing
const editForm = reactive({...linkage});
const editCourseForm = reactive({
  courses: []
});

// Reset forms
const resetForms = () => {
  Object.assign(editForm, {...linkage});
  editCourseForm.courses = JSON.parse(JSON.stringify(linkage.courses || []));
};

// Close main modal
const closeModal = () => {
  emit('close');
};

// Open/close edit modal
const closeFullEditModal = () => {
  showFullEditModal.value = false;
  resetForms();
};

// Open/close reject modal
const closeRejectModal = () => {
  showRejectModal.value = false;
  rejectionMessage.value = '';
};

// Open/close approve modal
const closeApproveModal = () => {
  showApproveModal.value = false;
};

// Handle report upload
const handleReportUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    editForm.reportOnHeiVisitName = file.name;
    editForm.reportOnHeiVisit = file;
  }
};

// Add a new course
const addCourse = () => {
  editCourseForm.courses.push({
    programmeName: '',
    level: '',
    minimumCredit: '',
    qualificationType: '',
    remarks: ''
  });
};

// Remove a course
const removeCourse = (index) => {
  editCourseForm.courses.splice(index, 1);
};

// Save all edits
const saveFullEdit = async () => {
  try {
    // Merge course form with main edit form
    const updatedData = {
      ...editForm,
      courses: editCourseForm.courses
    };
    
    // In a real application, you would likely have an API call here
    // await updateLinkageApplication(props.applicationId, updatedData);
    
    // Update local state
    Object.assign(linkage, updatedData);
    
    // Notify parent component
    emit('updated', updatedData);
    
    // Close modal
    closeFullEditModal();
    
    // You might want to show a success notification here
  } catch (error) {
    console.error('Failed to update application:', error);
    // You might want to show an error notification here
  }
};

// Reject application
const finalReject = async () => {
  if (!rejectionMessage.value.trim()) return;
  
  try {
    // In a real application, you would likely have an API call here
    // await rejectLinkageApplication(props.applicationId, rejectionMessage.value);
    
    // Notify parent component
    emit('rejected', {
      id: props.applicationId,
      reason: rejectionMessage.value
    });
    
    // Close modals
    closeRejectModal();
    closeModal();
    
    // You might want to show a success notification here
  } catch (error) {
    console.error('Failed to reject application:', error);
    // You might want to show an error notification here
  }
};

// Approve application
const finalApprove = async () => {
  try {
    // In a real application, you would likely have an API call here
    // await approveLinkageApplication(props.applicationId);
    
    // Notify parent component
    emit('approved', props.applicationId);
    
    // Close modals
    closeApproveModal();
    closeModal();
    
    // You might want to show a success notification here
  } catch (error) {
    console.error('Failed to approve application:', error);
    // You might want to show an error notification here
  }
};

// Fetch application data
const fetchApplicationData = async () => {
  try {
    // In a real application, you would likely have an API call here
    // const data = await getLinkageApplication(props.applicationId);
    
    // For demonstration, we'll use mock data
    const mockData = {
      ecpfName: 'Thimphu Educational Services',
      proprietorName: 'Tshering Dorji',
      proprietorCid: '11201000567',
      ecpfLocation: 'Thimphu, Bhutan',
      contactNo: '+975 17123456',
      emailAddress: 'info@thimphuedu.bt',
      heiName: 'Oxford University',
      officialWebsite: 'https://www.ox.ac.uk',
      heiLocation: 'Oxford',
      heiCountry: 'United Kingdom',
      yearEstablished: '1096',
      recognizedBy: 'UK Department of Education',
      accreditedBy: 'QAA UK',
      affiliation: 'Russell Group',
      approvalFromProBodies: 'General Medical Council, Bar Council',
      reportOnHeiVisitName: 'Oxford_Visit_Report_2024.pdf',
      courses: [
        {
          programmeName: 'Bachelor of Arts in Economics',
          level: 'Undergraduate',
          minimumCredit: '360',
          qualificationType: 'Bachelor Degree',
          remarks: 'Recognized worldwide'
        },
        {
          programmeName: 'Master of Science in Computer Science',
          level: 'Postgraduate',
          minimumCredit: '180',
          qualificationType: 'Master Degree',
          remarks: 'Includes industry internship'
        }
      ]
    };
    
    // Update local state
    Object.assign(linkage, mockData);
    
    // Reset edit forms
    resetForms();
  } catch (error) {
    console.error('Failed to fetch application data:', error);
    // You might want to show an error notification here
  }
};

// Watch for application id changes
onMounted(() => {
  if (props.applicationId) {
    fetchApplicationData();
  }
});

// You might also want to watch for changes to the application ID
// This is especially useful if the component isn't unmounted between different applications
watch(
  () => props.applicationId,
  (newId) => {
    if (newId) {
      fetchApplicationData();
    }
  }
);
</script>