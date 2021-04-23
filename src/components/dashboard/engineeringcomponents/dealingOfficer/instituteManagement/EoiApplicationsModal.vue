<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModalHandler" class="relative z-50">
      <TransitionChild
        as="div"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="div"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-7xl transform overflow-hidden rounded-2xl bg-gray-50 shadow-2xl transition-all"
              v-if="application"
            >
              <div class="relative">
                <!-- Enhanced Status Banner -->
                <div
                  :class="[
                    'px-8 py-6 border-b relative overflow-hidden',
                    {
                      'bg-yellow-50 border-yellow-100': overallStatus === 'Pending',
                      'bg-green-50 border-green-100': overallStatus === 'Approved',
                      'bg-red-50 border-red-100': overallStatus === 'Regretted',
                    },
                  ]"
                >
                  <div class="flex items-center justify-between relative z-10">
                    <div class="flex items-center space-x-4">
                      <div class="p-3 bg-white rounded-lg shadow-sm">
                        <FileText class="h-7 w-7 text-gray-700" />
                      </div>
                      <div>
                        <DialogTitle as="h3" class="text-2xl font-semibold text-gray-900">
                          EOI Application Details
                        </DialogTitle>
                        <p class="text-sm text-gray-600 mt-1">
                          Review and manage EOI application information
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-4">
                      <span
                        :class="[
                          'px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center space-x-2 shadow-sm',
                          {
                            'bg-yellow-100 text-yellow-800': overallStatus === 'Pending',
                            'bg-green-100 text-green-800': overallStatus === 'Approved',
                            'bg-red-100 text-red-800': overallStatus === 'Regretted',
                          },
                        ]"
                      >
                        <Circle
                          class="h-4 w-4"
                          :class="{
                            'text-yellow-500': overallStatus === 'Pending',
                            'text-green-500': overallStatus === 'Approved',
                            'text-red-500': overallStatus === 'Regretted',
                          }"
                        />
                        <span>{{ overallStatus }}</span>
                      </span>
                      <!-- Edit Button in Top Right -->
                      <button
                        type="button"
                        class="p-2 text-blue-600 hover:text-blue-700 transition-colors rounded-full hover:bg-blue-50"
                        @click="editApplication"
                        title="Edit Application"
                      >
                        <Pencil class="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        class="p-2 text-gray-400 hover:text-gray-500 transition-colors rounded-full hover:bg-white"
                        @click="closeModal"
                      >
                        <span class="sr-only">Close</span>
                        <X class="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                  <!-- Decorative pattern -->
                  <div class="absolute right-0 top-0 -mt-6 -mr-6 opacity-10">
                    <div class="transform rotate-45">
                      <FileText class="h-32 w-32" />
                    </div>
                  </div>
                </div>

                <!-- Main Content -->
                <div class="px-8 py-6 bg-white">
                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Left Column -->
                    <div class="lg:col-span-1 space-y-6">
                      <!-- Institute Information Card -->
                      <div
                        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                      >
                        <div class="p-6">
                          <h4
                            class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2"
                          >
                            <User class="h-5 w-5 text-gray-500" />
                            <span>Institute Information</span>
                          </h4>
                          <div class="flex flex-col items-start space-y-4">
                            <div>
                              <h5 class="text-xl font-semibold text-gray-900">
                                {{ application.name_of_institution }}
                              </h5>
                            </div>
                            <div class="w-full grid grid-cols-1 gap-4 mt-4">
                              <div class="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                                <UserCircle class="h-4 w-4 text-gray-400" />
                                <span class="text-sm text-gray-600">{{ application.address }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Contact Information Card -->
                      <div
                        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                      >
                        <div class="p-6">
                          <h4
                            class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2"
                          >
                            <Contact class="h-5 w-5 text-gray-500" />
                            <span>Contact Information</span>
                          </h4>
                          <div class="space-y-4">
                            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Mail class="h-4 w-4 text-gray-400" />
                              <span class="text-sm text-gray-600">{{
                                application.email_address
                              }}</span>
                            </div>
                            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Phone class="h-4 w-4 text-gray-400" />
                              <span class="text-sm text-gray-600">{{
                                application.contact_no
                              }}</span>
                            </div>

                            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <MapPin class="h-4 w-4 text-gray-400" />
                              <span class="text-sm text-gray-600">
                                {{ application.village }}, {{ application.dzongkhag }}
                              </span>
                            </div>
                            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <UserCircle class="h-4 w-4 text-gray-400" />
                              <span class="text-sm text-gray-600">{{ application.website }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Right Column -->
                    <div class="lg:col-span-2 space-y-6">
                      <!-- Application Details Card -->
                      <div
                        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                      >
                        <div class="p-6">
                          <h4
                            class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2"
                          >
                            <FileText class="h-5 w-5 text-gray-500" />
                            <span>Application Details</span>
                          </h4>
                          <div class="grid grid-cols-2 gap-6">
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Application ID</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                <FileCheck class="h-4 w-4 text-gray-400" />
                                <span>{{ application.id }}</span>
                              </p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Program Type</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                <Hash class="h-4 w-4 text-gray-400" />
                                <!-- *** UPDATED HERE *** -->
                                <span>{{ displayProgramType }}</span>
                              </p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Date Submitted</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                <Calendar class="h-4 w-4 text-gray-400" />
                                <span>{{ formatDate(application.created_at) }}</span>
                              </p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Proposed Date</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                <Clock class="h-4 w-4 text-gray-400" />
                                <span>{{ formatDate(application.commencement_date) }}</span>
                              </p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Course Title</p>
                              <p class="text-sm text-gray-900 mt-2">
                                <span>{{ application.title_of_course }}</span>
                              </p>
                            </div>

                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Duration</p>
                              <p class="text-sm text-gray-900 mt-2">
                                <span>{{ application.course_duration }}</span>
                              </p>
                            </div>

                            <!-- New Fields from Original Modal -->
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Institute Address</p>
                              <p class="text-sm text-gray-900 mt-2">
                                <span>{{ application.address }}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Enhanced Footer with Approve/Regret and Edit buttons -->
                <div class="px-8 py-4 bg-gray-50 border-t border-gray-200">
                  <div class="flex justify-between items-center">
                    <div
                      v-if="errorMessage"
                      class="text-sm text-red-600 flex items-center space-x-2"
                    >
                      <CircleAlert class="h-4 w-4" />
                      <span>{{ errorMessage }}</span>
                    </div>
                    <!-- Placeholder for error message alignment -->
                    <div v-else></div>

                    <div class="flex items-center space-x-4">
                      <button
                        type="button"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                        @click="closeModal"
                      >
                        <X class="h-4 w-4" />
                        <span>Close</span>
                      </button>

                      <button
                        type="button"
                        class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                        @click="rejectApplication"
                      >
                        <ThumbsDown class="h-4 w-4" />
                        <span>Regret Application</span>
                      </button>

                      <button
                        type="button"
                        class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                        @click="approveApplication"
                      >
                        <CheckCircle class="h-4 w-4" />
                        <span>Approve Application</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Edit Modal (shows when editing) -->
                <Dialog
                  as="div"
                  @close="closeEditModal"
                  :open="isEditModalOpen"
                  class="relative z-50"
                >
                  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

                  <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4">
                      <DialogPanel class="w-full max-w-3xl transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all">
                        <div class="flex items-center justify-between mb-4 pb-4 border-b">
                          <DialogTitle as="h3" class="text-lg font-medium text-gray-900">
                            Edit Application
                          </DialogTitle>
                          <button
                            type="button"
                            class="p-1 text-gray-400 hover:text-gray-500 rounded-full"
                            @click="closeEditModal"
                          >
                            <X class="h-5 w-5" />
                          </button>
                        </div>

                        <form @submit.prevent="saveApplicationChanges">
                          <div class="space-y-4">
                            <!-- Institute Name Field -->
                            <div>
                              <label for="edit_name_of_institution" class="block text-sm font-medium text-gray-700">Institute Name</label>
                              <input
                                id="edit_name_of_institution"
                                type="text"
                                v-model="editedApplication.name_of_institution"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                                required
                              />
                            </div>

                            <!-- Address Field -->
                            <div>
                              <label for="edit_address" class="block text-sm font-medium text-gray-700">Address</label>
                              <input
                                id="edit_address"
                                type="text"
                                v-model="editedApplication.address"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                                required
                              />
                            </div>

                            <!-- Email Field -->
                            <div>
                              <label for="edit_email_address" class="block text-sm font-medium text-gray-700">Email Address</label>
                              <input
                                id="edit_email_address"
                                type="email"
                                v-model="editedApplication.email_address"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                                required
                              />
                            </div>

                            <!-- Contact Number Field -->
                            <div>
                              <label for="edit_contact_no" class="block text-sm font-medium text-gray-700">Contact Number</label>
                              <input
                                id="edit_contact_no"
                                type="tel"
                                v-model="editedApplication.contact_no"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                                required
                              />
                            </div>

                            <!-- Course Title Field -->
                            <div>
                              <label for="edit_title_of_course" class="block text-sm font-medium text-gray-700">Course Title</label>
                              <input
                                id="edit_title_of_course"
                                type="text"
                                v-model="editedApplication.title_of_course"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                                required
                              />
                            </div>

                            <!-- Program Type Field -->
                            <div>
                              <label for="edit_type_of_programme" class="block text-sm font-medium text-gray-700">Program Type</label>
                              <select
                                id="edit_type_of_programme"
                                v-model="editedApplication.type_of_programme"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                                required
                              >
                                <!-- Values remain single characters -->
                                <option value="">Select a program type</option>
                                <option value="D">Diploma</option>
                                <option value="B">Bachelor</option>
                                <option value="M">Master</option>
                                <option value="P">PhD</option>
                              </select>
                            </div>

                            <!-- Commencement Date Field -->
                            <div>
                              <label for="edit_commencement_date" class="block text-sm font-medium text-gray-700">Commencement Date</label>
                              <input
                                id="edit_commencement_date"
                                type="date"
                                v-model="editedApplication.commencement_date"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                                required
                              />
                            </div>

                            <!-- Course Duration Field -->
                            <div>
                              <label for="edit_course_duration" class="block text-sm font-medium text-gray-700">Course Duration</label>
                              <input
                                id="edit_course_duration"
                                type="text"
                                v-model="editedApplication.course_duration"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3 border"
                                required
                              />
                            </div>
                          </div>

                          <div class="mt-6 flex justify-end space-x-3">
                            <button
                              type="button"
                              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              @click="closeEditModal"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              Save Changes
                            </button>
                          </div>
                        </form>
                      </DialogPanel>
                    </div>
                  </div>
                </Dialog>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue';
import {
  User,
  UserCircle,
  Calendar,
  Contact,
  Mail,
  Phone,
  MapPin,
  FileText,
  FileCheck,
  Hash,
  Clock,
  CircleAlert,
  Circle,
  X,
  Pencil,
  CheckCircle,
  ThumbsDown,
} from 'lucide-vue-next';
import { computed, ref } from 'vue'; // *** Ensure computed is imported ***
import apiService from '@/services/services';
import { useToast } from 'vue-toastification';

const toast = useToast();

const props = defineProps({
  isOpen: Boolean,
  application: {
    type: Object,
    required: true,
    default: () => ({}), // Add a default empty object to prevent errors if undefined
  },
});

const emit = defineEmits(['close', 'application-updated']);

const errorMessage = ref('');
const isEditModalOpen = ref(false);
// Initialize editedApplication as an empty object initially
const editedApplication = ref({});

console.log('Modal received application:', props.application); // Debug

// *** ADDED: Mapping for program type codes to full names ***
const programTypeMap = {
  D: 'Diploma',
  B: 'Bachelor',
  M: 'Master',
  P: 'PhD',
  d: 'Diploma', // Handle potential lowercase codes from API
  b: 'Bachelor',
  m: 'Master',
  p: 'PhD',
};

// *** ADDED: Computed property to get the full program type name for display ***
const displayProgramType = computed(() => {
  const code = props.application?.type_of_programme; // Use optional chaining
  if (!code) return 'N/A';
  return programTypeMap[code] || code; // Return mapped name or the code itself as fallback
});

// *** ADDED: Computed property for the overall status ***
const overallStatus = computed(() => {
  return props.application?.review_decision || 'Pending'; // Use optional chaining
});

// Function to format dates safely
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    // Check if the date needs formatting from YYYY-MM-DD (common from input type="date")
    if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const [year, month, day] = dateString.split('-');
        // JavaScript Date month is 0-indexed
        return new Date(year, month - 1, day).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }
    // Otherwise, assume it's a format Date constructor can handle (like ISO string)
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return 'Invalid Date';
  }
};

const editApplication = () => {
  if (!props.application) return; // Guard against null application
  // Deep clone the application object to avoid modifying the prop directly
  editedApplication.value = JSON.parse(JSON.stringify(props.application));

  // Ensure the date is in YYYY-MM-DD format for the date input
  if (editedApplication.value.commencement_date) {
    try {
        const date = new Date(editedApplication.value.commencement_date);
        // Format date to YYYY-MM-DD
        editedApplication.value.commencement_date = date.toISOString().split('T')[0];
    } catch (error) {
        console.error("Error parsing commencement_date for editing:", editedApplication.value.commencement_date, error);
        editedApplication.value.commencement_date = ''; // Or set to a default/null value
    }
  }

  // Ensure type_of_programme is uppercase for matching <option> values if needed
  if (editedApplication.value.type_of_programme) {
     editedApplication.value.type_of_programme = editedApplication.value.type_of_programme.toUpperCase();
  }

  isEditModalOpen.value = true;
};


const closeEditModal = () => {
  isEditModalOpen.value = false;
  editedApplication.value = {}; // Clear the edit object
};

const saveApplicationChanges = async () => {
  if (!props.application?.id) { // Use optional chaining
    errorMessage.value = 'Application ID is missing.';
    toast.error('Cannot save: Application ID is missing.');
    return;
  }

  try {
    // Create payload from edited data
    const payloadToSend = { ...editedApplication.value };

    // Remove fields that shouldn't be sent (adjust as needed based on your API)
    delete payloadToSend.supporting_documents;
    delete payloadToSend.institute_eoi_supporting_documents;
    delete payloadToSend.do_dpr_report;
    delete payloadToSend.created_at; // Often shouldn't be sent back
    delete payloadToSend.updated_at; // Often shouldn't be sent back
    // ID is used in the URL, usually not needed in the PATCH body itself
    // delete payloadToSend.id; // Uncomment if your API doesn't expect ID in the body

    // Ensure the program type code sent to API is lowercase if required by backend
    // (as was in the original code) - adjust if API expects uppercase
    if (payloadToSend.type_of_programme) {
      payloadToSend.type_of_programme = payloadToSend.type_of_programme.toLowerCase();
    }

    // Ensure date is sent in a format the API expects (e.g., ISO string or YYYY-MM-DD)
    // The input type="date" provides YYYY-MM-DD, which might be fine. If API needs ISO:
    // if (payloadToSend.commencement_date) {
    //   payloadToSend.commencement_date = new Date(payloadToSend.commencement_date).toISOString();
    // }

    console.log('Sending update for application ID:', props.application.id);
    console.log('Update data:', payloadToSend);

    const response = await apiService.patchEpcInstitute(props.application.id, payloadToSend);

    if (response && response.status === 200 && response.data) {
      emit('application-updated', response.data); // Emit the updated data from the API response
      toast.success('Application updated successfully!');
      closeEditModal();
      closeModal(); // Close the main modal as well after successful save
    } else {
      const errorMsg = response?.data?.message || 'Failed to update application.';
      errorMessage.value = errorMsg;
      toast.error(errorMsg);
    }
  } catch (error) {
    console.error('Error updating application:', error);
    const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
    errorMessage.value = `Failed to update application: ${errorMsg}`;
    toast.error(`Failed to update: ${errorMsg}`);
  }
};

const closeModal = () => {
  errorMessage.value = ''; // Clear any previous error message
  emit('close');
};

const closeModalHandler = () => {
  // This handler is called when clicking outside the dialog or pressing Esc
  closeModal(); // Reuse the main close logic
};

const updateApplicationStatus = async (decision, notesOrReason) => {
  if (!props.application?.id) { // Use optional chaining
      errorMessage.value = 'Application ID is missing.';
      toast.error(`Cannot ${decision}: Application ID is missing.`);
      return false; // Indicate failure
  }

  if (!notesOrReason) {
      errorMessage.value = `${decision === 'Approved' ? 'Approval notes' : 'Rejection reason'} are required.`;
      toast.warn(`${decision === 'Approved' ? 'Approval notes' : 'Rejection reason'} are required.`);
      return false; // Indicate failure
  }

  errorMessage.value = ''; // Clear previous errors

  const payload = {
      review_decision: decision,
  };
  if (decision === 'Approved') {
      payload.approvalNotes = notesOrReason; // Use the correct field name expected by API
  } else if (decision === 'Regretted') {
      payload.reason_if_rejected = notesOrReason; // Use the correct field name expected by API
  }

  try {
      const response = await apiService.patchEpcInstitute(props.application.id, payload);

      if (response && response.status === 200 && response.data) {
          emit('application-updated', response.data);
          toast.success(`Application ${decision}!`);
          closeModal();
          return true; // Indicate success
      } else {
          const errorMsg = response?.data?.message || `Failed to ${decision.toLowerCase()} application.`;
          errorMessage.value = errorMsg;
          toast.error(errorMsg);
          return false; // Indicate failure
      }
  } catch (error) {
      console.error(`Error ${decision.toLowerCase()}ing application:`, error);
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      errorMessage.value = `Failed to ${decision.toLowerCase()} application: ${errorMsg}.`;
      toast.error(`Failed to ${decision.toLowerCase()}: ${errorMsg}`);
      return false; // Indicate failure
  }
};

const approveApplication = async () => {
  const notes = prompt('Enter approval notes:');
  if (notes !== null) { // Proceed only if user didn't cancel the prompt
      await updateApplicationStatus('Approved', notes);
  } else {
    // Optional: Notify user that action was cancelled
    // toast.info("Approval cancelled.");
  }
};

const rejectApplication = async () => {
  const reason = prompt('Enter rejection reason:');
   if (reason !== null) { // Proceed only if user didn't cancel the prompt
      await updateApplicationStatus('Regretted', reason);
  } else {
    // Optional: Notify user that action was cancelled
    // toast.info("Rejection cancelled.");
  }
};

</script>

<style scoped>
/* Add back the scoped styles from your original code if needed */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 3px;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.rounded-xl {
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}

.rounded-xl:hover {
  transform: translateY(-2px);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>