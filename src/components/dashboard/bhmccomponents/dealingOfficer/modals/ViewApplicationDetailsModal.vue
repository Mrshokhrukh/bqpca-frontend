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
                    'bg-yellow-50 border-yellow-100':
                      overallStatus === 'Pending',
                    'bg-green-50 border-green-100': overallStatus === 'Approved',
                    'bg-red-50 border-red-100': overallStatus === 'Regretted',
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
                          'bg-yellow-100 text-yellow-800':
                            overallStatus === 'Pending',
                          'bg-green-100 text-green-800':
                            overallStatus === 'Approved',
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
                                'bg-yellow-400': overallStatus === 'Pending',
                                'bg-green-400': overallStatus === 'Approved',
                                'bg-red-400': overallStatus === 'Regretted',
                              }" />
                            </div>
                            <div class="text-center">
                              <h5 class="text-xl font-semibold text-gray-900">{{ application.full_name }}
                              </h5>
                              <p class="text-sm text-gray-500 mt-1">CID: {{ application.cid_no }}</p>
                            </div>
                            <div class="w-full grid grid-cols-2 gap-4 mt-4">
                              <div class="flex items-center space-x-2">
                                <UserCircle class="h-4 w-4 text-gray-400" />
                                <span class="text-sm text-gray-600">{{ application.gender }}</span>
                              </div>
                              <div class="flex items-center space-x-2">
                                <Calendar class="h-4 w-4 text-gray-400" />
                                <span class="text-sm text-gray-600">{{
                                  formatDate(application.date_of_birth) }}</span>
                              </div>
                            </div>
                            <!-- Is Counselor Checkbox -->
                            <div class="w-full mt-4">
                              <label class="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" v-model="editableApplication.is_counselor"
                                  :disabled="!isEditing || application.is_counselor"
                                  class="form-checkbox h-5 w-5 text-blue-600 rounded" />
                                <span class="text-sm text-gray-700 select-none">Is Counselor</span>
                              </label>
                              <p v-if="application.is_counselor" class="text-xs text-gray-500 mt-1">
                                This user is already a counselor.
                              </p>
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
                                {{ application.village }},
                                {{ application.gewog }},
                                {{ application.dzongkhag }}
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
                              <p class="text-sm font-medium text-gray-500">
                                Registration Type</p>
                              <p class="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                                <FileCheck class="h-4 w-4 text-gray-400" />
                                <span>{{
                                  application.registration_type?.name
                                }}</span>
                              </p>
                            </div>
                            <div>
                              <p class="text-sm font-medium text-gray-500">
                                Registration Number</p>
                              <p class="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                                <Hash class="h-4 w-4 text-gray-400" />
                                <span>{{
                                  application.registration_no
                                }}</span>
                              </p>
                            </div>
                            <div>
                              <p class="text-sm font-medium text-gray-500">
                                Registration Date</p>
                              <p class="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                                <Calendar class="h-4 w-4 text-gray-400" />
                                <span>{{
                                  formatDate(application.registration_date)
                                }}</span>
                              </p>
                            </div>
                            <div>
                              <p class="text-sm font-medium text-gray-500">
                                Expiry Date</p>
                              <p class="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                                <Clock class="h-4 w-4 text-gray-400" />
                                <span>{{
                                  formatDate(application.expiry_date)
                                }}</span>
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
                                  <p class="text-sm font-medium text-gray-500">
                                    Qualification</p>
                                  <p class="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                                    <GraduationCap class="h-4 w-4 text-gray-400" />
                                    <span>{{
                                      qualification.qualification_name_display
                                    }}</span>
                                  </p>
                                </div>
                                <div>
                                  <p class="text-sm font-medium text-gray-500">
                                    Qualification Type</p>
                                  <p class="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                                    <ClipboardCheck class="h-4 w-4 text-gray-400" />
                                    <span>{{
                                      qualification.qualification_type_display
                                    }}</span>
                                  </p>
                                </div>
                                <div>
                                  <p class="text-sm font-medium text-gray-500">
                                    Institute/University</p>
                                  <p class="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                                    <MapPin class="h-4 w-4 text-gray-400" />
                                    <span>{{
                                      qualification.institute_university_display
                                    }}</span>
                                  </p>
                                </div>
                                <div>
                                  <p class="text-sm font-medium text-gray-500">
                                    Completion Year</p>
                                  <p class="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                                    <Calendar class="h-4 w-4 text-gray-400" />
                                    <span>{{
                                      qualification.completion_year
                                    }}</span>
                                  </p>
                                </div>

                                <div>
                                  <p class="text-sm font-medium text-gray-500">
                                    Registration No.</p>
                                  <p class="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                                    <Hash class="h-4 w-4 text-gray-400" />
                                    <span>{{
                                      qualification.registration_no
                                    }}</span>
                                  </p>
                                </div>

                                <div>
                                  <p class="text-sm font-medium text-gray-500">
                                    Registration Date</p>
                                  <p class="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                                    <Calendar class="h-4 w-4 text-gray-400" />
                                    <span>{{
                                      formatDate(qualification.registration_date)
                                    }}</span>
                                  </p>
                                </div>

                                <div>
                                  <p class="text-sm font-medium text-gray-500">
                                    Expiry Date</p>
                                  <p class="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                                    <Clock class="h-4 w-4 text-gray-400" />
                                    <span>{{
                                      formatDate(qualification.expiry_date)
                                    }}</span>
                                  </p>
                                </div>


                                <!-- Editable Status and Remarks -->

                                <div>
                                  <label for="application_review_status"
                                    class="block text-sm font-medium text-gray-500">Application
                                    Review
                                    Status</label>
                                  <select v-if="isEditing" id="application_review_status"
                                    v-model="editableQualification.application_review_status"
                                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                                    <option value="Pending">Pending
                                    </option>
                                    <option value="Approved">Approved
                                    </option>
                                    <option value="Regretted">Regretted
                                    </option>
                                  </select>
                                  <p v-else class="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                                    <ClipboardCheck class="h-4 w-4 text-gray-400" />
                                    <span>{{
                                      qualification.application_review_status
                                    }}</span>
                                  </p>
                                </div>

                                <div>
                                  <label for="application_review_remark"
                                    class="block text-sm font-medium text-gray-500">Application
                                    Review
                                    Remark</label>
                                  <textarea
                                    v-if="isEditing && editableQualification.application_review_status === 'Regretted'"
                                    id="application_review_remark"
                                    v-model="editableQualification.application_review_remark" rows="2"
                                    class="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"></textarea>
                                  <p v-else-if="!isEditing" class="text-sm text-gray-900 mt-1">
                                    {{
                                      qualification.application_review_remark
                                      || 'No remarks provided' }}
                                  </p>

                                </div>


                                <div>
                                  <label for="physical_review_status"
                                    class="block text-sm font-medium text-gray-500">Physical
                                    Review Status</label>
                                  <select v-if="isEditing" id="physical_review_status"
                                    v-model="editableQualification.physical_review_status"
                                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                                    <option value="Pending">Pending
                                    </option>
                                    <option value="Approved">Approved
                                    </option>
                                    <option value="Regretted">Regretted
                                    </option>
                                  </select>
                                  <p v-else class="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                                    <ClipboardCheck class="h-4 w-4 text-gray-400" />
                                    <span>{{
                                      qualification.physical_review_status
                                    }}</span>
                                  </p>
                                </div>

                                <div>
                                  <label for="physical_review_remark"
                                    class="block text-sm font-medium text-gray-500">Physical
                                    Review Remark</label>
                                  <textarea
                                    v-if="isEditing && editableQualification.physical_review_status === 'Regretted'"
                                    id="physical_review_remark" v-model="editableQualification.physical_review_remark"
                                    rows="2"
                                    class="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"></textarea>
                                  <p v-else-if="!isEditing" class="text-sm text-gray-900 mt-1">
                                    {{
                                      qualification.physical_review_remark
                                      || 'No remarks provided' }}
                                  </p>

                                </div>


                                <div>
                                  <label for="endorsement_decision"
                                    class="block text-sm font-medium text-gray-500">Endorsement
                                    Decision</label>
                                  <select v-if="isEditing" id="endorsement_decision"
                                    v-model="editableQualification.endorsement_decision"
                                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                                    <option value="Pending">Pending
                                    </option>
                                    <option value="Approved">Approved
                                    </option>
                                    <option value="Regretted">Regretted
                                    </option>
                                  </select>
                                  <p v-else class="text-sm text-gray-900 mt-1 flex items-center space-x-2">
                                    <ClipboardCheck class="h-4 w-4 text-gray-400" />
                                    <span>{{
                                      qualification.endorsement_decision
                                    }}</span>
                                  </p>
                                </div>

                                <div>
                                  <label for="endorsement_remarks"
                                    class="block text-sm font-medium text-gray-500">Endorsement
                                    Remarks</label>
                                  <textarea
                                    v-if="isEditing && editableQualification.endorsement_decision === 'Regretted'"
                                    id="endorsement_remarks" v-model="editableQualification.endorsement_remarks"
                                    rows="2"
                                    class="mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"></textarea>
                                  <p v-else-if="!isEditing" class="text-sm text-gray-900 mt-1">
                                    {{
                                      qualification.endorsement_remarks
                                      || 'No remarks provided' }}
                                  </p>

                                </div>

                                <div>
                                  <p class="text-sm font-medium text-gray-500">
                                    Remarks</p>
                                  <p class="text-sm text-gray-900 mt-1 flex items-start space-x-2">
                                    <MessageSquare class="h-4 w-4 text-gray-400 mt-0.5" />
                                    <span>{{
                                      qualification.remarks
                                      || 'No remarks provided'
                                    }}</span>
                                  </p>
                                </div>

                              </div>
                            </div>
                          </div>
                          <div v-else>
                            <p class="text-sm text-gray-500 flex items-center space-x-2">
                              <CircleAlert class="h-4 w-4" />
                              <span>No qualification details found for this
                                application.</span>
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

                  <button v-if="!isEditing" type="button"
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                    @click="startEditing">
                    <Pencil class="h-4 w-4" />
                    <span>Edit</span>
                  </button>

                  <button v-if="isEditing" type="button"
                    class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                    @click="saveChanges">
                    <Check class="h-4 w-4" />
                    <span>Save</span>
                  </button>

                  <button v-if="isEditing" type="button"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                    @click="cancelEditing">
                    <X class="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                </div>
                <div v-if="errorMessage" class="px-6 py-2 bg-red-100 text-red-700 rounded-md">
                  {{ errorMessage }}
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
  CircleAlert,
  Circle,
  Check,
  X,
  Pencil,
} from 'lucide-vue-next';
import { ref, computed, watch } from 'vue';
import apiServices from '@/services/services';

const props = defineProps({
  isOpen: Boolean,
  application: {
    type: Object,
    default: () => null,
  },
});

const emit = defineEmits(['close', 'update:application']);

const isEditing = ref(false);
const editableQualification = ref({});
const editableApplication = ref({});
const isLoading = ref(false);
const errorMessage = ref('');

watch(() => props.application, (newApplication) => {
  if (newApplication) {
    if (newApplication.user_qualifications && newApplication.user_qualifications.length > 0) {
      editableQualification.value = { ...newApplication.user_qualifications[0] };
    } else {
      editableQualification.value = {};
    }
    editableApplication.value = { ...newApplication };
  }
  errorMessage.value = '';
}, { deep: true, immediate: true });

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

const overallStatus = computed(() => {
  if (!props.application?.user_qualifications?.[0]) return 'Pending';

  const appReview = props.application.user_qualifications[0].application_review_status;
  const physReview = props.application.user_qualifications[0].physical_review_status;
  const endorse = props.application.user_qualifications[0].endorsement_decision;

  if (appReview === 'Regretted' || physReview === 'Regretted' || endorse === 'Regretted') {
    return 'Regretted';
  } else if (appReview === 'Approved' && physReview === 'Approved' && endorse === 'Approved') {
    return 'Approved';
  } else {
    return 'Pending';
  }
});

const startEditing = () => {
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
  if (props.application && props.application.user_qualifications.length > 0) {
    editableQualification.value = { ...props.application.user_qualifications[0] };
    editableApplication.value = { ...props.application };
  }
  errorMessage.value = '';
};

const saveChanges = async () => {
  if (!props.application) return;

  isLoading.value = true;
  errorMessage.value = '';

  try {
    // 1. Update user counselor status
    if (editableApplication.value.userDetails?.id &&
      editableApplication.value.is_counselor !== props.application.is_counselor) {
      await apiServices.patchUser(
        editableApplication.value.userDetails.id,
        { is_counselor: editableApplication.value.is_counselor }
      );
    }

    // 2. Update application with qualification changes
    if (props.application.id && editableQualification.value) {
      const applicationData = {
        user_qualifications: [{
          ...editableQualification.value,
          application_review_status: editableQualification.value.application_review_status,
          application_review_remark: editableQualification.value.application_review_remark,
          physical_review_status: editableQualification.value.physical_review_status,
          physical_review_remark: editableQualification.value.physical_review_remark,
          endorsement_decision: editableQualification.value.endorsement_decision,
          endorsement_remarks: editableQualification.value.endorsement_remarks
        }]
      };

      await apiServices.patchBhmcNewApplication(props.application.id, applicationData);
    }

    // 3. Get fresh application data
    const response = await apiServices.getBhmcNewApplication(props.application.id);
    emit('update', response.data);
    isEditing.value = false;

  } catch (error) {
    console.error('Error saving changes:', error);
    errorMessage.value = 'Failed to save changes. Please try again.';
  } finally {
    isLoading.value = false;
  }
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