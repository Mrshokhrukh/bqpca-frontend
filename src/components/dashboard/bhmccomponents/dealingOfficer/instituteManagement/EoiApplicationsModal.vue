<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModalHandler" class="relative z-50">
      <TransitionChild as="div" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild as="div" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-7xl transform overflow-hidden rounded-2xl bg-gray-50 shadow-2xl transition-all"
              v-if="application">
              <div class="relative">
                <!-- Enhanced Status Banner -->
                <div :class="[
    'px-8 py-6 border-b relative overflow-hidden',
    {
      'bg-yellow-50 border-yellow-100': overallStatus === 'Pending',
      'bg-green-50 border-green-100': overallStatus === 'Approved',
      'bg-red-50 border-red-100': overallStatus === 'Regretted',
    },
  ]">
                  <div class="flex items-center justify-between relative z-10">
                    <div class="flex items-center space-x-4">
                      <div class="p-3 bg-white rounded-lg shadow-sm">
                        <FileText class="h-7 w-7 text-gray-700" />
                      </div>
                      <div>
                        <DialogTitle as="h3" class="text-2xl font-semibold text-gray-900">
                          EOI Application Details
                        </DialogTitle>
                        <p class="text-sm text-gray-600 mt-1">Review and manage EOI application
                          information</p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-4">
                      <span :class="[
    'px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center space-x-2 shadow-sm',
    {
      'bg-yellow-100 text-yellow-800': overallStatus === 'Pending',
      'bg-green-100 text-green-800': overallStatus === 'Approved',
      'bg-red-100 text-red-800': overallStatus === 'Regretted',
    },
  ]">
                        <Circle class="h-4 w-4" :class="{
    'text-yellow-500': overallStatus === 'Pending',
    'text-green-500': overallStatus === 'Approved',
    'text-red-500': overallStatus === 'Regretted',
  }" />
                        <span>{{ overallStatus }}</span>
                      </span>
                      <button type="button"
                        class="p-2 text-gray-400 hover:text-gray-500 transition-colors rounded-full hover:bg-white"
                        @click="closeModal">
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
                      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="p-6">
                          <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
                            <User class="h-5 w-5 text-gray-500" />
                            <span>Institute Information</span>
                          </h4>
                          <div class="flex flex-col items-start space-y-4">
                            <div>
                              <h5 class="text-xl font-semibold text-gray-900">{{ application.name_of_institution }}</h5>
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
                      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="p-6">
                          <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
                            <Contact class="h-5 w-5 text-gray-500" />
                            <span>Contact Information</span>
                          </h4>
                          <div class="space-y-4">
                            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Mail class="h-4 w-4 text-gray-400" />
                              <span class="text-sm text-gray-600">{{ application.email_address }}</span>
                            </div>
                            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Phone class="h-4 w-4 text-gray-400" />
                              <span class="text-sm text-gray-600">{{ application.contact_no }}</span>
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
                      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="p-6">
                          <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
                            <FileText class="h-5 w-5 text-gray-500" />
                            <span>Application Details</span>
                          </h4>
                          <div class="grid grid-cols-2 gap-6">
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Application ID</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                <FileCheck class="h-4 w-4 text-gray-400" />
                                <span>{{ application.CID }}</span>
                              </p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Program Type</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                <Hash class="h-4 w-4 text-gray-400" />
                                <span>{{ application.type_of_programme }}</span>
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

                <!-- Enhanced Footer with Approve/Regret -->
                <div class="px-8 py-4 bg-gray-50 border-t border-gray-200">
                  <div class="flex justify-between items-center">
                    <div v-if="errorMessage" class="text-sm text-red-600 flex items-center space-x-2">
                      <CircleAlert class="h-4 w-4" />
                      <span>{{ errorMessage }}</span>
                    </div>
                    <div class="flex items-center space-x-4">
                      <button type="button"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                        @click="closeModal">
                        <X class="h-4 w-4" />
                        <span>Close</span>
                      </button>

                      <button type="button"
                        class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                        @click="rejectApplication">
                        Regret Application
                      </button>

                      <button type="button"
                        class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                        @click="approveApplication">
                        Approve Application
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue';
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
} from 'lucide-vue-next';
import { computed, ref } from 'vue';
import apiService from '@/services/services';
import { useToast } from 'vue-toastification';


const toast = useToast()

const props = defineProps({
  isOpen: Boolean,
  application: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'application-updated']);

const errorMessage = ref('');

const closeModal = () => {
  emit('close');
};

const closeModalHandler = () => {
  emit('close');
};

const approveApplication = async () => {
  const notes = prompt('Enter approval notes:');
  if (!notes) {
    errorMessage.value = 'Approval notes are required.';
    return;
  }

  try {
    const response = await apiService.patchMhpcInstitute(props.application.id, {
      review_decision: 'Approved',  // CHANGED: Using review_decision instead of status
      approvalNotes: notes,
    });

    if (response && response.status === 200 && response.data) {
      // Emit the application-updated event with the updated data
      emit('application-updated', response.data); // Send the whole updated application
      toast.success('Application Approved!');
      closeModal();
    } else {
      errorMessage.value = 'Failed to approve application.';
    }
  } catch (error) {
    console.error('Error approving application:', error);
    errorMessage.value = 'Failed to approve application due to an error.';
  }
};

const rejectApplication = async () => {
  const reason = prompt('Enter rejection reason:');
  if (!reason) {
    errorMessage.value = 'Rejection reason is required.';
    return;
  }

  try {
    const response = await apiService.patchMhpcInstitute(props.application.id, {
      review_decision: 'Regretted',  // CHANGED: Using review_decision instead of status
      reason_if_rejected: reason,
    });

    if (response && response.status === 200 && response.data) {
      // Emit the application-updated event with the updated data
      emit('application-updated', response.data); // Send the whole updated application
      toast.success('Application Rejected!');
      closeModal();
    } else {
      errorMessage.value = 'Failed to reject application.';
    }
  } catch (error) {
    console.error('Error rejecting application:', error);
    errorMessage.value = 'Failed to reject application due to an error.';
  }
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

const overallStatus = computed(() => {
  // Return the review_decision or 'Pending' if not available
  return props.application.review_decision || 'Pending';
});
</script>

<style scoped>
/* Enhanced scrollbar styles */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #CBD5E1 transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #CBD5E1;
  border-radius: 3px;
}

/* Enhanced transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Enhanced card hover effects */
.rounded-xl {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Status indicator animations */
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
