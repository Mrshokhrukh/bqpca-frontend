<template>
  <Transition enter-active-class="transform transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    enter-to-class="opacity-100 translate-y-0 sm:scale-100"
    leave-active-class="transform transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0 sm:scale-100"
    leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
    <div v-if="showModal" @click="handleBackdropClick"
      class="fixed z-50 inset-0 overflow-y-auto backdrop-blur-sm bg-gray-500/60 flex items-start justify-center sm:py-12">
      <div
        class="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl m-4 max-h-[90vh] flex flex-col border border-gray-200"
        @click.stop>
        <!-- Enhanced Header with Visual Feedback -->
        <div
          class="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg" :class="headerColorClass">
              <component :is="modalIcons[modalType]" class="w-6 h-6" :class="headerIconClass" />
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900">{{ modalTitle }}</h3>
              <p class="text-sm text-gray-500 mt-1">{{ modalDescription }}</p>
            </div>
          </div>
          <button @click="closeModal" class="rounded-full p-2 hover:bg-gray-100 transition-colors group">
            <XIcon class="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>

        <!-- Enhanced Content Area -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- View Mode with Enhanced Cards -->
          <div v-if="modalType === 'view' || modalType === 'viewCertificate'" class="space-y-6">

            <!-- QEC Number Display for Approved Applications -->
            <div v-if="modalApplication.status === 'approved' && modalApplication.qec_number"
              class="bg-green-50 rounded-xl p-6 shadow-sm">
              <div class="flex items-center gap-3 mb-4">
                <div class="p-2 bg-green-100 rounded-lg">
                  <HashIcon class="w-5 h-5 text-green-600" />
                </div>
                <h4 class="text-lg font-medium text-green-900">QEC Number</h4>
              </div>
              <div class="bg-white p-4 rounded-lg border border-green-200 flex items-center justify-between">
                <span class="text-2xl font-bold text-green-700">{{ modalApplication.qec_number }}</span>
                <div class="flex items-center gap-2 text-green-600">
                  <CheckCircleIcon class="w-5 h-5" />
                  <span class="font-medium">Verified</span>
                </div>
              </div>
            </div>

            <!-- Personal & Address Information Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              <!-- Left Column: Personal Information -->
              <div class="bg-gray-50 rounded-xl p-6 shadow-sm">
                <div class="flex items-center gap-3 mb-6">
                  <div class="p-2 bg-blue-50 rounded-lg">
                    <UserIcon class="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 class="text-lg font-medium text-gray-900">Personal Information</h4>
                </div>
                <div class="space-y-4">
                  <div v-for="(item, index) in personalInfo" :key="index"
                    class="flex items-start bg-white p-4 rounded-lg border border-gray-200">
                    <component :is="personalInfoIcons[index]" class="w-4 h-4 text-gray-400 mt-1 mr-3" />
                    <div class="flex-1">
                      <span class="text-sm font-medium text-gray-500 block mb-1">{{ item.label }}</span>
                      <span class="text-gray-900">{{ item.value || '-' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Column: Passport Photo and Address Details -->
              <div class="space-y-6">
                <!-- Passport Photo Card -->
                <div v-if="modalApplication.passport_size_photo"
                  class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden h-[300px]">
                  <div class="relative h-full flex items-center justify-center">
                    <div class="absolute top-4 right-4 bg-blue-100 rounded-full p-2">
                      <CameraIcon class="w-5 h-5 text-blue-600" />
                    </div>
                    <img :src="modalApplication.passport_size_photo" alt="Passport Photo"
                      class="w-50 h-full object-cover" />
                  </div>
                  <div class="p-4 text-center bg-gray-50">
                    <p class="text-sm font-medium text-gray-600">Passport Photograph</p>
                    <p class="text-xs text-gray-500">High-resolution Image</p>
                  </div>
                </div>

                <!-- Address Details Card -->
                <div class="bg-gray-50 rounded-xl p-6 shadow-sm">
                  <div class="flex items-center gap-3 mb-6">
                    <div class="p-2 bg-green-50 rounded-lg">
                      <MapPinIcon class="w-5 h-5 text-green-600" />
                    </div>
                    <h4 class="text-lg font-medium text-gray-900">Address Details</h4>
                  </div>
                  <div class="space-y-4">
                    <div v-for="(item, index) in addressInfo" :key="index"
                      class="flex items-start bg-white p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                      <component :is="addressInfoIcons[index]" class="w-5 h-5 text-gray-500 mt-1 mr-4" />
                      <div class="flex-1">
                        <span class="text-sm font-medium text-gray-500 block mb-1">{{ item.label }}</span>
                        <span class="text-gray-900 text-base">{{ item.value || '-' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Education Details Card -->
            <div class="bg-gray-50 rounded-xl p-6 shadow-sm">
              <div class="flex items-center gap-3 mb-6">
                <div class="p-2 bg-purple-50 rounded-lg">
                  <GraduationCapIcon class="w-5 h-5 text-purple-600" />
                </div>
                <h4 class="text-lg font-medium text-gray-900">Education Details</h4>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="(item, index) in educationInfo" :key="index"
                  class="flex items-start bg-white p-4 rounded-lg border border-gray-200">
                  <component :is="educationInfoIcons[index]" class="w-4 h-4 text-gray-400 mt-1 mr-3" />
                  <div class="flex-1">
                    <span class="text-sm font-medium text-gray-500 block mb-1">{{ item.label }}</span>
                    <template v-if="item.isLink">
                      <a :href="item.value" target="_blank"
                        class="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1">
                        {{ item.value }}
                        <ExternalLinkIcon class="w-4 h-4" />
                      </a>
                    </template>
                    <span v-else class="text-gray-900">{{ item.value || '-' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Documents Card -->
            <div class="bg-gray-50 rounded-xl p-6 shadow-sm">
              <div class="flex items-center gap-3 mb-6">
                <div class="p-2 bg-blue-50 rounded-lg">
                  <FileTextIcon class="w-5 h-5 text-blue-600" />
                </div>
                <h4 class="text-lg font-medium text-gray-900">Uploaded Documents</h4>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="doc in filteredDocuments" :key="doc.key"
                  class="group flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-200">
                  <FileIcon class="w-5 h-5 text-gray-400 mr-3" />
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ doc.label }}</p>
                  </div>
                  <a :href="modalApplication[doc.key]" target="_blank"
                    class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <EyeIcon class="w-4 h-4 mr-1.5" />
                    View
                  </a>
                </div>
              </div>
            </div>

            <!-- Second Copy Information -->
            <div v-if="modalApplication.is_second_copy" class="bg-gray-50 rounded-xl p-6 shadow-sm">
              <div class="flex items-center gap-3 mb-6">
                <div class="p-2 bg-orange-50 rounded-lg">
                  <CopyIcon class="w-5 h-5 text-orange-600" />
                </div>
                <h4 class="text-lg font-medium text-gray-900">Second Copy Information</h4>
              </div>
              <div class="space-y-4">
                <div v-if="modalApplication.reason_for_issue_of_second_copy"
                  class="flex items-start bg-white p-4 rounded-lg border border-gray-200">
                  <HelpCircleIcon class="w-4 h-4 text-gray-400 mt-1 mr-3" />
                  <div class="flex-1">
                    <span class="text-sm font-medium text-gray-500 block mb-1">Reason for Second Copy</span>
                    <span class="text-gray-900">{{ modalApplication.reason_for_issue_of_second_copy?.name }}</span>
                    <span class="text-sm text-gray-500 block mt-1">Reason Definition:
                      {{ modalApplication.reason_for_issue_of_second_copy?.definition }}</span>
                  </div>
                </div>
                <div v-if="modalApplication.second_copy_other"
                  class="flex items-start bg-white p-4 rounded-lg border border-gray-200">
                  <FileTextIcon class="w-4 h-4 text-gray-400 mt-1 mr-3" />
                  <div class="flex-1">
                    <span class="text-sm font-medium text-gray-500 block mb-1">Other Reason</span>
                    <span class="text-gray-900">{{ modalApplication.second_copy_other || '-' }}</span>
                  </div>
                </div>
                <div class="flex items-start bg-white p-4 rounded-lg border border-gray-200">
                  <HashIcon class="w-4 h-4 text-gray-400 mt-1 mr-3" />
                  <div class="flex-1">
                    <span class="text-sm font-medium text-gray-500 block mb-1">Original Copy QEC</span>
                    <span class="text-gray-900">{{ modalApplication.qec_number || 'N/A' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Status Information -->
            <div class="bg-gray-50 rounded-xl p-6 shadow-sm">
              <div class="flex items-center gap-3 mb-6">
                <div class="p-2 bg-indigo-50 rounded-lg">
                  <ActivityIcon class="w-5 h-5 text-indigo-600" />
                </div>
                <h4 class="text-lg font-medium text-gray-900">Application Status</h4>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div v-for="(item, index) in statusInfo" :key="index"
                  class="flex items-start bg-white p-4 rounded-lg border border-gray-200">
                  <component :is="statusInfoIcons[index]" class="w-4 h-4 text-gray-400 mt-1 mr-3" />
                  <div class="flex-1">
                    <span class="text-sm font-medium text-gray-500 block mb-1">{{ item.label }}</span>
                    <span :class="[item.label === 'Status' ? getStatusClass(item.value) : 'text-gray-900']">
                      {{ item.value || '-' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced Form Controls -->
          <div v-else class="space-y-6">
            <!-- Add Note Form -->
            <div v-if="modalType === 'addNote'" class="space-y-4">
              <label class="block">
                <span class="text-sm font-medium text-gray-700">Add Note</span>
                <textarea v-model="noteText"
                  class="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  rows="4" placeholder="Enter your note here..."></textarea>
              </label>
            </div>
            <!-- Assign QEC Number Form -->
            <div v-if="modalType === 'assignQEC'" class="space-y-4">
              <label class="block">
                <span class="text-sm font-medium text-gray-700">QEC Number</span>
                <input type="text" v-model="qecNumber"
                  class="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter the QEC Number here" />
              </label>
            </div>

            <!-- Re-upload Form -->
            <div v-if="modalType === 'reUpload'" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Message for Re-upload
                </label>
                <textarea v-model="reProcessReason"
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  rows="4" placeholder="Enter your message here..."></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-4">
                  Select Documents to Re-upload
                </label>
                <div class="space-y-3">
                  <label v-for="doc in documents" :key="doc.key"
                    class="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 cursor-pointer transition-colors">
                    <input type="checkbox" v-model="selectedDocuments" :value="doc.key"
                      class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500">
                    <span class="ml-3 text-sm font-medium text-gray-900">{{ doc.label }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Process/Reject Forms -->
            <div v-if="modalType === 'reProcess' || modalType === 'regret'" class="space-y-4">
              <label class="block">
                <span class="text-sm font-medium text-gray-700">
                  {{ modalType === 'reProcess' ? 'Reason for Reprocessing' : 'Rejection Reason' }}
                </span>
                <textarea v-model="textAreaValue"
                  class="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  :placeholder="`Enter ${modalType === 'reProcess' ? 'reason' : 'rejection reason'} here...`"></textarea>
              </label>
            </div>

            <!-- Forward Confirmation -->
            <div v-if="modalType === 'forward'" class="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <AlertCircleIcon class="w-6 h-6 text-blue-600" />
              <p class="text-blue-700">Are you sure you want to forward this application?</p>
            </div>
            <!-- Approve Confirmation -->
            <div v-if="modalType === 'approve'" class="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <CheckCircleIcon class="w-6 h-6 text-green-600" />
              <p class="text-green-700">Are you sure you want to approve this application?</p>
            </div>
          </div>
        </div>

        <!-- Enhanced Footer -->
        <div class="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            @click="closeModal">
            <XIcon class="w-4 h-4 mr-1.5" />
            Cancel
          </button>
          <button v-if="modalType !== 'view' && modalType !== 'viewCertificate'"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            @click="handleModalAction">
            <component :is="actionButtonIcon" class="w-4 h-4 mr-1.5" />
            {{ modalType === 'forward' ? 'Forward' : modalType === 'approve' ? 'Approve' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import {
  User as UserIcon,
  MapPin as MapPinIcon,
  GraduationCap as GraduationCapIcon,
  FileText as FileTextIcon,
  File as FileIcon,
  Eye as EyeIcon,
  Activity as ActivityIcon,
  X as XIcon,
  ExternalLink as ExternalLinkIcon,
  AlertCircle as AlertCircleIcon,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Building as BuildingIcon,
  MapPinned as MapPinnedIcon,
  School as SchoolIcon,
  Globe as GlobeIcon,
  Timer as TimerIcon,
  Hash as HashIcon,
  CheckCircle as CheckCircleIcon,
  Save as SaveIcon,
  ArrowRight as ArrowRightIcon,
  Copy as CopyIcon,
  HelpCircle as HelpCircleIcon,
  Camera as CameraIcon,
} from 'lucide-vue-next';

const props = defineProps({
  showModal: {
    type: Boolean,
    default: false,
  },
  modalType: {
    type: String,
    default: null,
  },
  application: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close', 'update']);

// Reactive state
const noteText = ref('');
const selectedDocuments = ref([]);
const reProcessReason = ref('');
const rejectionReason = ref('');
const qecNumber = ref('');

// Computed properties for enhanced styling
const headerColorClass = computed(() => {
  const classes = {
    view: 'bg-blue-50',
    addNote: 'bg-green-50',
    reUpload: 'bg-yellow-50',
    reProcess: 'bg-purple-50',
    forward: 'bg-indigo-50',
    regret: 'bg-red-50',
    viewCertificate: 'bg-blue-50',
    assignQEC: 'bg-emerald-50',
    approve: 'bg-green-50'
  };
  return classes[props.modalType] || 'bg-gray-50';
});

const headerIconClass = computed(() => {
  const classes = {
    view: 'text-blue-600',
    addNote: 'text-green-600',
    reUpload: 'text-yellow-600',
    reProcess: 'text-purple-600',
    forward: 'text-indigo-600',
    regret: 'text-red-600',
    viewCertificate: 'text-blue-600',
    assignQEC: 'text-emerald-600',
    approve: 'text-green-600'
  };
  return classes[props.modalType] || 'text-gray-600';
});

const modalDescription = computed(() => {
  const descriptions = {
    view: 'View complete application details',
    addNote: 'Add a note to this application',
    reUpload: 'Request document re-upload',
    reProcess: 'Reprocess this application',
    forward: 'Forward to next stage',
    regret: 'Reject this application',
    viewCertificate: 'View certificate details',
    assignQEC: 'Assign QEC Number to the application',
    approve: 'Approve this application'
  };
  return descriptions[props.modalType] || '';
});

// Icons mapping
const modalIcons = {
  view: UserIcon,
  addNote: FileTextIcon,
  reUpload: FileIcon,
  reProcess: ActivityIcon,
  forward: ArrowRightIcon,
  regret: XIcon,
  viewCertificate: FileTextIcon,
  assignQEC: HashIcon,
  approve: CheckCircleIcon,
};

const personalInfoIcons = [UserIcon, HashIcon, CalendarIcon, UserIcon, PhoneIcon, MailIcon];
const addressInfoIcons = [BuildingIcon, MapPinnedIcon, MapPinIcon];
const educationInfoIcons = [
  GraduationCapIcon, TimerIcon, SchoolIcon, BuildingIcon,
  MapPinIcon, GlobeIcon, HashIcon, CalendarIcon, GlobeIcon
];
const statusInfoIcons = [CheckCircleIcon, ClockIcon, ClockIcon, FileTextIcon];

const actionButtonIcon = computed(() =>
  props.modalType === 'forward' ? ArrowRightIcon : props.modalType === 'approve' ? CheckCircleIcon : SaveIcon
);

// Data formatting
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Computed properties for data display
const modalApplication = computed(() => props.application);

const personalInfo = computed(() => [
  { label: 'Name', value: modalApplication.value.applicants_name },
  { label: 'CID', value: modalApplication.value.cid_no },
  { label: 'Date of Birth', value: formatDate(modalApplication.value.date_of_birth) },
  { label: 'Gender', value: modalApplication.value.gender },
  { label: 'Contact', value: modalApplication.value.contact_no },
  { label: 'Email', value: modalApplication.value.email_address },
]);

const addressInfo = computed(() => [
  { label: 'Dzongkhag', value: modalApplication.value.dzongkhag },
  { label: 'Gewog', value: modalApplication.value.gewog },
  { label: 'Village', value: modalApplication.value.village },
]);

const educationInfo = computed(() => [
  { label: 'Course Title', value: modalApplication.value.course_title },
  { label: 'Duration', value: `${modalApplication.value.duration_of_course} years` },
  { label: 'Institute', value: modalApplication.value.name_of_institute },
  { label: 'University', value: modalApplication.value.name_of_university },
  { label: 'Location', value: modalApplication.value.location },
  { label: 'Country', value: modalApplication.value.country },
  { label: 'Student ID', value: modalApplication.value.student_id_no },
  { label: 'Year of Completion', value: modalApplication.value.year_of_completion },
  { label: 'Website', value: modalApplication.value.website, isLink: true },
]);

const statusInfo = computed(() => [
  { label: 'Status', value: modalApplication.value.status },
  { label: 'Created At', value: formatDate(modalApplication.value.created_at) },
  { label: 'Updated At', value: formatDate(modalApplication.value.updated_at) },
  { label: 'Remarks', value: modalApplication.value.remarks },
]);

const documents = [
  { key: 'degree_certificate', label: 'Degree Certificate' },
  { key: 'academic_transcript', label: 'Academic Transcript' },
  { key: 'passport_size_photo', label: 'Passport Photo' },
  { key: 'confirmation_document', label: 'Confirmation Document' },
  { key: 'second_copy_supporting_document', label: 'Second Copy Supporting Document' },
];

const filteredDocuments = computed(() =>
  documents.filter(doc => modalApplication.value[doc.key])
);

const textAreaValue = computed({
  get() {
    return props.modalType === 'reProcess' ? reProcessReason.value : rejectionReason.value;
  },
  set(value) {
    if (props.modalType === 'reProcess') {
      reProcessReason.value = value;
    } else {
      rejectionReason.value = value;
    }
  }
});

// Status styling
const getStatusClass = (status) => {
  const capitalizedStatus = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : '';
  const classes = {
    Processing: 'text-yellow-600 font-medium',
    Approved: 'text-green-600 font-medium',
    Rejected: 'text-red-600 font-medium',
    Reprocess: 'text-blue-600 font-medium',
    Reupload: 'text-purple-600 font-medium',
    Regretted: 'text-red-600 font-medium',
  };
  return classes[capitalizedStatus] || 'text-gray-600 font-medium';
};

// Event handlers
const handleBackdropClick = (event) => {
  if (event.target === event.currentTarget) {
    closeModal();
  }
};

const handleModalAction = async () => {
  let remarksValue = '';

  if (props.modalType === 'reUpload') {
    const docLabels = selectedDocuments.value.map(key => {
      const doc = documents.find(d => d.key === key);
      return doc ? doc.label : key;
    });
    const docListString = docLabels.join(', ');
    const defaultMessage = `The following documents were found not fit for the process and hence you are required to reupload the following documents in a high definition scan: ${docListString}`;
    remarksValue = reProcessReason.value.trim() ? `${reProcessReason.value.trim()} ${docListString}` : defaultMessage;
  }

  const updateData = {
    'addNote': {
      remarks: noteText.value,
      modal_action: 'addNote'
    },
    'assignQEC': {
      qec_number: qecNumber.value,
      modal_action: 'assignQEC'
    },
    'reUpload': {
      remarks: remarksValue,
      status: 'reupload',
      modal_action: 'reUpload',
    },
    'reProcess': {
      remarks: reProcessReason.value,
      status: 'reprocess',
      modal_action: 'reProcess'
    },
    'forward': {
      forward: true,
      modal_action: 'forward'
    },
    'regret': {
      chief_remarks: rejectionReason.value,
      status: 'regretted',
      modal_action: 'regret'
    },
    'approve': {
      status: 'approved',
      modal_action: 'approve'
    }
  }[props.modalType] || {};

  emit('update', updateData);
  closeModal();
};

const closeModal = () => {
  noteText.value = '';
  selectedDocuments.value = [];
  reProcessReason.value = '';
  rejectionReason.value = '';
  qecNumber.value = '';
  if (props.modalType === 'view') {
    emit('update', { modal_action: 'view' });
  }
  emit('close');
};

// Watch for modal state changes
watch(
  () => props.showModal,
  (newValue) => {
    if (props.modalType === 'addNote' && newValue) {
      noteText.value = props.application.chief_remarks ? props.application.chief_remarks : props.application.remarks ? props.application.remarks : '';
    } else {
      noteText.value = ''
    }

    if (props.modalType === 'assignQEC' && newValue && props.application.qec_number) {
      qecNumber.value = props.application.qec_number
    } else {
      qecNumber.value = ''
    }

    if (props.modalType === 'reProcess' && props.application.remarks && newValue) {
      reProcessReason.value = props.application.remarks;
    } else if (props.modalType === 'regret' && props.application.chief_remarks && newValue) {
      rejectionReason.value = props.application.chief_remarks;
    }
  }
);
</script>
