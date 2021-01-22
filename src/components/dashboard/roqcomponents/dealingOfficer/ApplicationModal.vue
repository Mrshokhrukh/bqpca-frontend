<template>
  <Transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100"
    leave-active-class="ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div v-if="showModal" @click="handleBackdropClick"
      class="fixed z-50 inset-0 overflow-y-auto bg-gray-500/75 flex items-start justify-center sm:py-12">
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-5xl m-4 max-h-[90vh] flex flex-col" @click.stop>
        <!-- Enhanced Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <div class="flex items-center gap-2">
            <component :is="modalIcons[modalType]" class="w-5 h-5 text-gray-600" />
            <h3 class="text-xl font-semibold text-gray-900">{{ modalTitle }}</h3>
          </div>
          <button @click="closeModal"
            class="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1">
            <XIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6">
          <!-- View Mode -->
          <div v-if="modalType === 'view' || modalType === 'viewCertificate'" class="space-y-6">
            <!-- Personal & Address Information Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Personal Information Card -->
              <div class="bg-gray-50 rounded-lg p-5">
                <div class="flex items-center gap-2 mb-4">
                  <UserIcon class="w-5 h-5 text-gray-600" />
                  <h4 class="text-lg font-medium text-gray-900">Personal Information</h4>
                </div>
                <div class="space-y-4">
                  <div v-for="(item, index) in personalInfo" :key="index" class="flex items-start">
                    <component :is="personalInfoIcons[index]" class="w-4 h-4 text-gray-400 mt-1 mr-2" />
                    <div class="flex-1">
                      <span class="text-sm font-medium text-gray-500 block">{{ item.label }}</span>
                      <span class="text-gray-900">{{ item.value || '-' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Address Information Card -->
              <div class="bg-gray-50 rounded-lg p-5">
                <div class="flex items-center gap-2 mb-4">
                  <MapPinIcon class="w-5 h-5 text-gray-600" />
                  <h4 class="text-lg font-medium text-gray-900">Address Details</h4>
                </div>
                <div class="space-y-4">
                  <div v-for="(item, index) in addressInfo" :key="index" class="flex items-start">
                    <component :is="addressInfoIcons[index]" class="w-4 h-4 text-gray-400 mt-1 mr-2" />
                    <div class="flex-1">
                      <span class="text-sm font-medium text-gray-500 block">{{ item.label }}</span>
                      <span class="text-gray-900">{{ item.value || '-' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Education Details Card -->
            <div class="bg-gray-50 rounded-lg p-5">
              <div class="flex items-center gap-2 mb-4">
                <GraduationCapIcon class="w-5 h-5 text-gray-600" />
                <h4 class="text-lg font-medium text-gray-900">Education Details</h4>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-for="(item, index) in educationInfo" :key="index" class="flex items-start">
                  <component :is="educationInfoIcons[index]" class="w-4 h-4 text-gray-400 mt-1 mr-2" />
                  <div class="flex-1">
                    <span class="text-sm font-medium text-gray-500 block">{{ item.label }}</span>
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
            <div class="bg-gray-50 rounded-lg p-5">
              <div class="flex items-center gap-2 mb-4">
                <FileTextIcon class="w-5 h-5 text-gray-600" />
                <h4 class="text-lg font-medium text-gray-900">Uploaded Documents</h4>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-for="doc in filteredDocuments" :key="doc.key"
                  class="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors">
                  <FileIcon class="w-5 h-5 text-gray-400 mr-3" />
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ doc.label }}</p>
                  </div>
                  <a :href="modalApplication[doc.key]" target="_blank"
                    class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors">
                    <EyeIcon class="w-4 h-4 mr-1" />
                    View
                  </a>
                </div>
              </div>
            </div>


            <!-- Status Information -->
            <div class="bg-gray-50 rounded-lg p-5">
              <div class="flex items-center gap-2 mb-4">
                <ActivityIcon class="w-5 h-5 text-gray-600" />
                <h4 class="text-lg font-medium text-gray-900">Application Status</h4>
              </div>
              <div class="space-y-4">
                <div v-for="(item, index) in statusInfo" :key="index" class="flex items-start">
                  <component :is="statusInfoIcons[index]" class="w-4 h-4 text-gray-400 mt-1 mr-2" />
                  <div class="flex-1">
                    <span class="text-sm font-medium text-gray-500 block">{{ item.label }}</span>
                    <span :class="[
                      'text-gray-900',
                      item.label === 'Status' ? getStatusClass(item.value) : ''
                    ]">{{ item.value || '-' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Other Modal Types -->
          <div v-else>
            <div v-if="modalType === 'addNote'" class="space-y-4">
              <textarea v-model="noteText"
                class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4" placeholder="Enter your note here..."></textarea>
            </div>

            <div v-if="modalType === 'reUpload'" class="space-y-4">
              <p class="text-gray-700 mb-4">
                Please select the documents you want to re-upload
              </p>
              <div class="space-y-3">
                <label v-for="doc in documents" :key="doc.key"
                  class="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-500 cursor-pointer">
                  <input type="checkbox" v-model="selectedDocuments" :value="doc.key"
                    class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500">
                  <span class="ml-3 text-sm font-medium text-gray-900">{{ doc.label }}</span>
                </label>
              </div>
            </div>

            <div v-if="modalType === 'reProcess' || modalType === 'regret'" class="space-y-4">
              <p class="text-gray-700 mb-4">
                {{ modalType === 'reProcess'
                  ? 'Please provide the reason why this application needs to be reprocessed'
                  : 'Please provide the reason for rejection' }}
              </p>
              <textarea v-model="textAreaValue"
                class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                :placeholder="`Enter ${modalType === 'reProcess' ? 'reason' : 'rejection reason'} here...`"></textarea>
            </div>

            <div v-if="modalType === 'forward'" class="space-y-4">
              <div class="flex items-center gap-2 text-gray-700">
                <AlertCircleIcon class="w-5 h-5 text-blue-500" />
                <p>Are you sure you want to forward this application?</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="closeModal">
            <XIcon class="w-4 h-4 mr-1.5" />
            Cancel
          </button>
          <button v-if="modalType !== 'view' && modalType !== 'viewCertificate'"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="handleModalAction">
            <component :is="actionButtonIcon" class="w-4 h-4 mr-1.5" />
            {{ modalType === 'forward' ? 'Forward' : 'Save' }}
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

const noteText = ref('');
const selectedDocuments = ref([]);
const reProcessReason = ref('');
const rejectionReason = ref('');

const modalApplication = computed(() => props.application);

const modalIcons = {
  view: UserIcon,
  addNote: FileTextIcon,
  reUpload: FileIcon,
  reProcess: ActivityIcon,
  forward: ArrowRightIcon,
  regret: XIcon,
   viewCertificate: FileTextIcon
};

const personalInfoIcons = [
  UserIcon,
  HashIcon,
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  MailIcon,
];

const addressInfoIcons = [
  BuildingIcon,
  MapPinnedIcon,
  MapPinIcon,
];

const educationInfoIcons = [
  GraduationCapIcon,
  TimerIcon,
  SchoolIcon,
  BuildingIcon,
  MapPinIcon,
  GlobeIcon,
  HashIcon,
  CalendarIcon,
  GlobeIcon,
];

const statusInfoIcons = [
  CheckCircleIcon,
  ClockIcon,
  ClockIcon,
  FileTextIcon,
];

const actionButtonIcon = computed(() => {
  return props.modalType === 'forward' ? ArrowRightIcon : SaveIcon;
});

// Rest of the existing computed properties and methods...
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

const modalTitle = computed(() => {
  const titles = {
    view: 'Application Details',
    addNote: 'Add Note',
    reUpload: 'Re-upload Documents',
    reProcess: 'Reprocess Application',
    forward: 'Forward Application',
    regret: 'Reject Application',
      regretReason: 'Rejection Reason',
      viewCertificate: 'View Certificate'
  };
  return titles[props.modalType] || '';
});

const getStatusClass = (status) => {
  const classes = {
    pending: 'text-yellow-600 font-medium',
    approved: 'text-green-600 font-medium',
    rejected: 'text-red-600 font-medium',
    reprocess: 'text-blue-600 font-medium',
    reupload: 'text-purple-600 font-medium',
    regretted: 'text-red-600 font-medium',
  };
  return classes[status?.toLowerCase()] || 'text-gray-600 font-medium';
};

const handleBackdropClick = (event) => {
  if (event.target === event.currentTarget) {
    closeModal();
  }
};

const handleModalAction = async () => {
  const updateData = {
    'addNote': {
      remarks: noteText.value,
      modal_action: 'addNote'
    },
    'reUpload': {
      documents: selectedDocuments.value,
      status: 'reupload',
        remarks: reProcessReason.value,
        modal_action: 'reUpload'

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
      remarks: rejectionReason.value,
      status: 'regretted',
        modal_action: 'regret'

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
    if(props.modalType === 'view'){
         emit('update', {modal_action: 'view'});
    }
  emit('close');
};

watch(
  () => props.showModal,
  (newValue) => {
    if (!newValue) {
      noteText.value = '';
      selectedDocuments.value = [];
      reProcessReason.value = '';
      rejectionReason.value = '';
    }
  }
);
</script>
