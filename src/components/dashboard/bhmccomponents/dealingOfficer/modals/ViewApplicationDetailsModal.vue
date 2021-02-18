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
              class="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all"
              v-if="application">
              <div class="relative">
                <!-- Header with Status Banner -->
                <div :class="[
    'px-6 py-4 border-b',
    {
      'bg-yellow-50 border-yellow-100': getStatus(application) === 'Pending',
      'bg-green-50 border-green-100': getStatus(application) === 'Approved',
      'bg-red-50 border-red-100': getStatus(application) === 'Rejected',
    },
  ]">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <FileText class="h-6 w-6 text-gray-600" />
                      <DialogTitle as="h3" class="text-2xl font-semibold text-gray-900">
                        Application Details
                      </DialogTitle>
                    </div>
                    <div class="flex items-center space-x-4">
                      <span :class="[
    'px-4 py-2 rounded-full text-sm font-medium inline-flex items-center space-x-2',
    {
      'bg-yellow-100 text-yellow-800': getStatus(application) === 'Pending',
      'bg-green-100 text-green-800': getStatus(application) === 'Approved',
      'bg-red-100 text-red-800': getStatus(application) === 'Rejected',
    },
  ]">
                        <Circle class="h-4 w-4" :class="{
    'text-yellow-500': getStatus(application) === 'Pending',
    'text-green-500': getStatus(application) === 'Approved',
    'text-red-500': getStatus(application) === 'Rejected',
  }" />
                        <span>{{ getStatus(application) }}</span>
                      </span>
                      <button type="button" class="text-gray-400 hover:text-gray-500 transition-colors"
                        @click="closeModal">
                        <span class="sr-only">Close</span>
                        <X class="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Main Content -->
                <div class="px-6 py-6 max-h-[80vh] overflow-y-auto">
                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Left Column -->
                    <div class="lg:col-span-1 space-y-6">
                      <!-- Personal Information Card -->
                      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div class="p-6">
                          <h4 class="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                            <User class="h-5 w-5 text-gray-500" />
                            <span>Personal Information</span>
                          </h4>
                          <div class="flex flex-col items-center space-y-4">
                            <div class="relative">
                              <img :src="application.passport_photo || '/placeholder-avatar.png'"
                                @error="handleImageError"
                                class="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg" />
                              <span class="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white" :class="{
    'bg-yellow-400': getStatus(application) === 'Pending',
    'bg-green-400': getStatus(application) === 'Approved',
    'bg-red-400': getStatus(application) === 'Rejected',
  }" />
                            </div>
                            <div class="text-center">
                              <h5 class="text-xl font-semibold text-gray-900">{{ application.full_name }}</h5>
                              <p class="text-sm text-gray-500 mt-1">CID: {{ application.cid_no }}</p>
                            </div>
                            <div class="w-full grid grid-cols-2 gap-4 mt-4">
                              <div class="flex items-center space-x-2">
                                <UserCircle class="h-4 w-4 text-gray-400" />
                                <span class="text-sm text-gray-600">{{ application.gender }}</span>
                              </div>
                              <div class="flex items-center space-x-2">
                                <Calendar class="h-4 w-4 text-gray-400" />
                                <span class="text-sm text-gray-600">{{ formatDate(application.date_of_birth) }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Contact Information Card -->
                      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div class="p-6">
                          <h4 class="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                            <Contact class="h-5 w-5 text-gray-500" />
                            <span>Contact Information</span>
                          </h4>
                          <div class="space-y-4">
                            <div class="flex items-center space-x-3">
                              <Mail class="h-4 w-4 text-gray-400" />
                              <span class="text-sm text-gray-600">{{ application.email_address }}</span>
                            </div>
                            <div class="flex items-center space-x-3">
                              <Phone class="h-4 w-4 text-gray-400" />
                              <span class="text-sm text-gray-600">{{ application.contact_no }}</span>
                            </div>
                            <div class="flex items-center space-x-3">
                              <MapPin class="h-4 w-4 text-gray-400" />
                              <span class="text-sm text-gray-600">
                                {{ application.village }}, {{ application.gewog }}, {{ application.dzongkhag }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Right Column -->
                    <div class="lg:col-span-2 space-y-6">
                      <!-- Application Details Card -->
                      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div class="p-6">
                          <h4 class="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                            <FileText class="h-5 w-5 text-gray-500" />
                            <span>Application Details</span>
                          </h4>
                          <div class="grid grid-cols-2 gap-6">
                            <div>
                              <p class="text-sm font-medium text-gray-500">Registration Type</p>
                              <p class="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                                <FileCheck class="h-4 w-4 text-gray-400" />
                                <span>{{ application.registration_type?.name }}</span>
                              </p>
                            </div>
                            <div>
                              <p class="text-sm font-medium text-gray-500">Registration Number</p>
                              <p class="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                                <Hash class="h-4 w-4 text-gray-400" />
                                <span>{{ application.registration_no }}</span>
                              </p>
                            </div>
                            <div>
                              <p class="text-sm font-medium text-gray-500">Registration Date</p>
                              <p class="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                                <Calendar class="h-4 w-4 text-gray-400" />
                                <span>{{ formatDate(application.registration_date) }}</span>
                              </p>
                            </div>
                            <div>
                              <p class="text-sm font-medium text-gray-500">Expiry Date</p>
                              <p class="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                                <Clock class="h-4 w-4 text-gray-400" />
                                <span>{{ formatDate(application.expiry_date) }}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Qualification Details Card -->
                      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div class="p-6">
                          <h4 class="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                            <GraduationCap class="h-5 w-5 text-gray-500" />
                            <span>Qualification Details</span>
                          </h4>
                          <div v-if="application.user_qualifications && application.user_qualifications.length > 0"
                            class="space-y-4">
                            <div v-for="qualification in application.user_qualifications" :key="qualification.id"
                              class="border-b border-gray-200 pb-4 last:border-none">
                              <div class="grid grid-cols-2 gap-6">
                                <div>
                                  <p class="text-sm font-medium text-gray-500">Qualification</p>
                                  <p class="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                                    <GraduationCap class="h-4 w-4 text-gray-400" />
                                    <span>{{ qualification.qualification_name.qualification }}</span>
                                  </p>
                                </div>
                                <div>
                                  <p class="text-sm font-medium text-gray-500">Qualification Type</p>
                                  <p class="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                                    <ClipboardCheck class="h-4 w-4 text-gray-400" />
                                    <span>{{ qualification.qualification_type.qualification_type_name }}</span>
                                  </p>
                                </div>
                                <div>
                                  <p class="text-sm font-medium text-gray-500">Institute/University</p>
                                  <p class="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                                    <MapPin class="h-4 w-4 text-gray-400" />
                                    <span>{{ qualification.institute_university.institute_name }}, {{
    qualification.institute_university.university }}</span>
                                  </p>
                                </div>
                                <div>
                                  <p class="text-sm font-medium text-gray-500">Completion Year</p>
                                  <p class="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                                    <Calendar class="h-4 w-4 text-gray-400" />
                                    <span>{{ qualification.completion_year }}</span>
                                  </p>
                                </div>

                                <div>
                                  <p class="text-sm font-medium text-gray-500">Registration No.</p>
                                  <p class="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                                    <Hash class="h-4 w-4 text-gray-400" />
                                    <span>{{ qualification.registration_no }}</span>
                                  </p>
                                </div>

                                <div>
                                  <p class="text-sm font-medium text-gray-500">Registration Date</p>
                                  <p class="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                                    <Calendar class="h-4 w-4 text-gray-400" />
                                    <span>{{ formatDate(qualification.registration_date) }}</span>
                                  </p>
                                </div>

                                <div>
                                  <p class="text-sm font-medium text-gray-500">Expiry Date</p>
                                  <p class="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                                    <Clock class="h-4 w-4 text-gray-400" />
                                    <span>{{ formatDate(qualification.expiry_date) }}</span>
                                  </p>
                                </div>

                                <div>
                                  <p class="text-sm font-medium text-gray-500">Review Status</p>
                                  <p class="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                                    <ClipboardCheck class="h-4 w-4 text-gray-400" />
                                    <span>{{ qualification.application_review_status }}</span>
                                  </p>
                                </div>
                                <div>
                                  <p class="text-sm font-medium text-gray-500">Remarks</p>
                                  <p class="text-sm text-gray-900 mt-1 flex items-start space-x-2">
                                    <MessageSquare class="h-4 w-4 text-gray-400 mt-0.5" />
                                    <span>{{ qualification.remarks || 'No remarks provided' }}</span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div v-else>
                            <p class="text-sm text-gray-500 flex items-center space-x-2">
                              <AlertCircle class="h-4 w-4" />
                              <span>No qualification details found for this application.</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer -->
                <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-4">
                  <button type="button"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                    @click="closeModal">
                    <X class="h-4 w-4" />
                    <span>Close</span>
                  </button>
                  <button v-if="getStatus(application) === 'Pending'" type="button"
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                    @click="approveApplication">
                    <Check class="h-4 w-4" />
                    <span>Approve Application</span>
                  </button>
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
  GraduationCap,
  ClipboardCheck,
  MessageSquare,
  AlertCircle,
  Circle,
  Check,
  X,
} from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean,
  application: {
    type: Object,
    default: () => null,
  },
});

const emit = defineEmits(['close', 'approve']);

const closeModal = () => {
  emit('close');
};

const closeModalHandler = () => {
  emit('close');
};

const handleImageError = (event) => {
  event.target.src = '/placeholder-avatar.png';
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

const getStatus = (app) => {
  if (!app?.user_qualifications?.[0]?.application_review_status) return 'Pending';

  const status = app.user_qualifications[0].application_review_status;
  return ['Pending', 'Approved', 'Rejected'].includes(status) ? status : 'Pending';
};

const approveApplication = () => {
  emit('approve', props.application);
};
</script>

<style scoped>
/* Custom scrollbar styles */
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

/* Smooth transitions */
.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Card hover effects */
.rounded-xl {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.rounded-xl:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
