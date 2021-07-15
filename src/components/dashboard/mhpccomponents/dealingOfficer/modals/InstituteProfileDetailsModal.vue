<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
          aria-hidden="true"
          @click="closeModal"
        ></div>

        <Transition name="modal-inner-fade">
          <div
            v-if="isOpen"
            class="relative flex flex-col w-full h-full max-w-5xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            <header class="flex-shrink-0 px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900" id="modal-title">
                    {{ instituteDetails.name_of_institution || 'Institute Profile' }}
                  </h3>
                  <p class="text-sm text-gray-500">
                    Detailed information and status overview.
                  </p>
                </div>
                <button
                  @click="closeModal"
                  class="p-1 rounded-full text-gray-400 hover:text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <span class="sr-only">Close</span>
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </header>

            <main class="flex-1 flex overflow-hidden">
              <aside class="w-1/4 bg-white border-r border-gray-200 overflow-y-auto custom-scrollbar">
                <nav class="p-4 space-y-1">
                  <button
                    v-for="(tab, index) in tabs"
                    :key="index"
                    @click="activeTab = index"
                    class="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md focus:outline-none transition-colors"
                    :class="
                      activeTab === index
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    "
                  >
                    <component :is="tab.icon" class="h-5 w-5 mr-3 flex-shrink-0" />
                    <span class="truncate">{{ tab.name }}</span>
                  </button>
                </nav>
              </aside>

              <div class="flex-1 p-6 overflow-y-auto custom-scrollbar">
                <div v-if="instituteDetails">

                  <div v-show="activeTab === 0" class="data-section">
                    <h4 class="section-title">Basic Information</h4>
                    <div class="data-grid">
                      <div class="data-item">
                        <label class="data-label">CID</label>
                        <div class="data-value">{{ instituteDetails.CID || 'Not Available' }}</div>
                      </div>
                      <div class="data-item">
                        <label class="data-label">Full Name</label>
                        <div class="data-value">{{ instituteDetails.full_name || 'Not Available' }}</div>
                      </div>
                      <div class="data-item">
                        <label class="data-label">Gender</label>
                        <div class="data-value">{{ instituteDetails.gender || 'Not Available' }}</div>
                      </div>
                      <div class="data-item">
                        <label class="data-label">Contact Number</label>
                        <div class="data-value">{{ instituteDetails.contact_no || 'Not Available' }}</div>
                      </div>
                       <div class="data-item">
                        <label class="data-label">Email Address</label>
                        <div class="data-value">{{ instituteDetails.email_address || 'Not Available' }}</div>
                      </div>
                    </div>

                    <h4 class="section-title mt-8">Location Details</h4>
                    <div class="data-grid">
                      <div class="data-item">
                        <label class="data-label">Country</label>
                        <div class="data-value">{{ instituteDetails.country || 'Not Available' }}</div>
                      </div>
                      <div class="data-item">
                        <label class="data-label">Dzongkhag</label>
                        <div class="data-value">{{ instituteDetails.dzongkhag || 'Not Available' }}</div>
                      </div>
                      <div class="data-item">
                        <label class="data-label">Gewog</label>
                        <div class="data-value">{{ instituteDetails.gewog || 'Not Available' }}</div>
                      </div>
                      <div class="data-item">
                        <label class="data-label">Village</label>
                        <div class="data-value">{{ instituteDetails.village || 'Not Available' }}</div>
                      </div>
                      <div class="data-item">
                        <label class="data-label">Chiwog</label>
                        <div class="data-value">{{ instituteDetails.chiwog || 'Not Available' }}</div>
                      </div>
                      <div class="data-item">
                        <label class="data-label">Address</label>
                        <div class="data-value">{{ instituteDetails.address || 'Not Available' }}</div>
                      </div>
                    </div>
                  </div>

                  <div v-show="activeTab === 1" class="data-section">
                    <h4 class="section-title">Course & Program Details</h4>
                    <div class="data-grid">
                       <div class="data-item"><label class="data-label">Program Name</label><div class="data-value">{{ instituteDetails.program_type?.program_name || 'Not Available' }}</div></div>
                       <div class="data-item"><label class="data-label">Program Description</label><div class="data-value">{{ instituteDetails.program_type?.description || 'Not Available' }}</div></div>
                       <div class="data-item"><label class="data-label">Duration (Years)</label><div class="data-value">{{ instituteDetails.program_type?.duration_years || 'Not Available' }}</div></div>
                    </div>
                  </div>

                  <div v-show="activeTab === 2" class="data-section">
                    <h4 class="section-title">Review & Status</h4>
                     <div class="data-grid">
                        <div class="data-item">
                           <label class="data-label">DPR Review Decision</label>
                           <span :class="getStatusClasses(instituteDetails.do_dpr_review_decision)">
                              {{ getStatusText(instituteDetails.do_dpr_review_decision) }}
                           </span>
                        </div>
                        <div class="data-item">
                           <label class="data-label">Is Active</label>
                           <span :class="instituteDetails.is_active ? 'status-badge-green' : 'status-badge-gray'">
                              {{ instituteDetails.is_active ? 'Yes' : 'No' }}
                           </span>
                        </div>
                        <div class="data-item"><label class="data-label">Valid Till</label><div class="data-value">{{ formatDate(instituteDetails.valid_till) || 'Not Available' }}</div></div>
                        <div class="data-item">
                           <label class="data-label">Payment Status</label>
                           <span :class="instituteDetails.is_payment_complete ? 'status-badge-green' : 'status-badge-yellow'">
                              {{ instituteDetails.is_payment_complete ? 'Completed' : 'Pending' }}
                           </span>
                        </div>
                         <div v-if="instituteDetails.do_dpr_review_decision === 'Rejected'" class="data-item sm:col-span-2">
                           <label class="data-label text-red-600">DPR Rejection Reason</label>
                           <div class="data-value">{{ instituteDetails.do_dpr_reason_if_rejected || 'Not Provided' }}</div>
                         </div>
                     </div>
                  </div>

                  <div v-show="activeTab === 3" class="data-section">
                     <h4 class="section-title">Contact & Website</h4>
                     <div class="data-grid">
                        <div class="data-item">
                           <label class="data-label">Website</label>
                           <a v-if="instituteDetails.website" :href="instituteDetails.website" target="_blank" class="link">
                              {{ instituteDetails.website }} <span class="ml-1">→</span>
                           </a>
                           <span v-else class="data-value">Not available</span>
                        </div>
                        <div class="data-item"><label class="data-label">Head of Institution</label><div class="data-value">{{ instituteDetails.head_of_institution_name || 'Not Available' }}</div></div>
                        <div class="data-item"><label class="data-label">Head's Gender</label><div class="data-value">{{ instituteDetails.head_of_institution_gender || 'Not Available' }}</div></div>
                        <div class="data-item"><label class="data-label">Head's Phone</label><div class="data-value">{{ instituteDetails.head_of_institution_phone_number || 'Not Available' }}</div></div>
                        <div class="data-item"><label class="data-label">Head's Email</label><div class="data-value">{{ instituteDetails.head_of_institution_email || 'Not Available' }}</div></div>
                     </div>
                  </div>

                  <div v-show="activeTab === 4" class="data-section">
                    <h4 class="section-title">Documents & Reports</h4>
                     <ul class="space-y-3">
                       <li class="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
                          <span class="text-sm font-medium text-gray-700">EOI Supporting Documents</span>
                          <a v-if="instituteDetails.institute_eoi_supporting_documents" :href="instituteDetails.institute_eoi_supporting_documents" target="_blank" class="document-link">View Document</a>
                          <span v-else class="text-sm text-gray-400">Not Uploaded</span>
                        </li>
                       <li class="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
                          <span class="text-sm font-medium text-gray-700">DPR Report</span>
                          <a v-if="instituteDetails.do_dpr_report" :href="instituteDetails.do_dpr_report" target="_blank" class="document-link">View Document</a>
                          <span v-else class="text-sm text-gray-400">Not Uploaded</span>
                        </li>
                       <li class="p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
                          <span class="text-sm font-medium text-gray-700">DPR Review Report</span>
                          <a v-if="instituteDetails.do_dpr_review_report" :href="instituteDetails.do_dpr_review_report" target="_blank" class="document-link">View Document</a>
                          <span v-else class="text-sm text-gray-400">Not Uploaded</span>
                        </li>
                     </ul>
                  </div>

                  <div v-show="activeTab === 5" class="data-section">
                    <h4 class="section-title">Remarks & Summaries</h4>
                     <div class="space-y-6">
                       <div class="data-item-long"><label class="data-label">Remarks</label><div class="data-value-long whitespace-pre-wrap">{{ instituteDetails.remarks || 'Not Available' }}</div></div>
                       <div class="data-item-long"><label class="data-label">Declaration</label><div class="data-value-long">{{ instituteDetails.declaration ? 'Declared' : 'Not Declared' }}</div></div>
                       <div class="data-item-long"><label class="data-label">Executive Summary</label><div class="data-value-long">{{ instituteDetails.executive_summary || 'Not Available' }}</div></div>
                       <div class="data-item-long"><label class="data-label">DPR Review Summary</label><div class="data-value-long">{{ instituteDetails.do_dpr_review_summary || 'Not Available' }}</div></div>
                     </div>
                  </div>

                  <div v-show="activeTab === 6" class="data-section">
                    <h4 class="section-title">Other Details From DPR</h4>
                    <div class="space-y-6">
                      <div v-for="item in otherDetails" :key="item.key" class="data-item-long">
                         <label class="data-label">{{ item.label }}</label>
                         <div class="data-value-long">{{ instituteDetails[item.key] || 'Not Available' }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="text-center py-10 text-gray-500">
                  <p>No details available.</p>
                </div>
              </div>
            </main>

            <footer class="flex-shrink-0 px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                @click="closeModal"
                class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Close
              </button>
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, shallowRef } from 'vue';

// Using shallowRef for icons is a performance optimization
import {
  UserCircleIcon,
  BookOpenIcon,
  CheckBadgeIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  ChatBubbleBottomCenterTextIcon,
  EllipsisHorizontalCircleIcon,
} from '@heroicons/vue/24/outline';


// --- Props & Emits ---
const props = defineProps({
  isOpen: Boolean,
  instituteDetails: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['close-modal']);

// --- State ---
const activeTab = ref(0);
const tabs = ref([
  { name: 'Basic Information', icon: shallowRef(UserCircleIcon) },
  { name: 'Course & Program', icon: shallowRef(BookOpenIcon) },
  { name: 'Status & Review', icon: shallowRef(CheckBadgeIcon) },
  { name: 'Contact & Website', icon: shallowRef(GlobeAltIcon) },
  { name: 'Documents', icon: shallowRef(DocumentTextIcon) },
  { name: 'Summaries', icon: shallowRef(ChatBubbleBottomCenterTextIcon) },
  { name: 'Other Details', icon: shallowRef(EllipsisHorizontalCircleIcon) },
]);

// --- Corrected "Other Details" keys to match API response ---
const otherDetails = [
  { label: 'Vision, Mission and Strategies', key: 'vision_mission_strategies'},
  { label: 'Project Scheduling', key: 'project_scheduling' },
  { label: 'Values of Gross National Happiness', key: 'gross_national_happiness' },
  { label: 'Land Details', key: 'land_details'},
  { label: 'Conceptual Master plan', key: 'conceptual_master_plan'},
  { label: 'Academic Plan', key: 'academic_plan'},
  { label: 'Affiliation Details', key: 'affiliation_details'},
  { label: 'Teaching Hospital Details', key: 'teaching_hospital_details'},
  { label: 'Research Policy', key: 'research_policy'},
  { label: 'Human Resource', key: 'human_resource'},
  { label: 'Quality Assurance', key: 'quality_assurance'},
  { label: 'Governance Structure', key: 'governance_structure'},
  { label: 'Business Plan', key: 'business_plan'},
  { label: 'Project cost and Analysis', key: 'project_cost_analysis'},
  { label: 'Facilities and Student Services', key: 'facilities_student_services'},
  { label: 'Admission Policy', key: 'admission_policy'},
  { label: 'Service conditions', key: 'service_conditions'},
  { label: 'Safety and Security', key: 'safety_security'},
  { label: 'Public Information System', key: 'public_information_system'},
  { label: 'Other Details (DPR)', key: 'other_details_dpr'},
];


// --- Methods ---
const closeModal = () => {
  emit('close-modal');
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const getStatusText = (decision) => {
  const map = { Approved: 'Approved', Rejected: 'Rejected' };
  return map[decision] || 'Pending';
};

const getStatusClasses = (decision) => {
  const status = getStatusText(decision);
  const map = {
    Approved: 'status-badge-green',
    Rejected: 'status-badge-red',
    Pending: 'status-badge-yellow',
  };
  return map[status];
};

// --- Watchers ---
watch(() => props.isOpen, (newVal) => {
  // Reset to the first tab whenever the modal is opened
  if (newVal) {
    activeTab.value = 0;
  }
});
</script>

<style scoped>
/* --- Main Layout & Scrollbar --- */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* --- Transitions --- */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-inner-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.1s;
}
.modal-inner-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.modal-inner-fade-enter-from,
.modal-inner-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* --- Content Styling --- */
.data-section {
  @apply w-full;
}
.section-title {
  @apply text-base font-semibold text-gray-800 pb-2 mb-4 border-b border-gray-200;
}
.data-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5;
}
.data-item {
  @apply flex flex-col;
}
.data-item-long {
  @apply sm:col-span-2;
}
.data-label {
  @apply text-xs font-medium text-gray-500 mb-1;
}
.data-value {
  @apply text-sm text-gray-900 font-medium;
}
.data-value-long {
  @apply text-sm text-gray-700 bg-gray-50 p-3 rounded-md border;
}

/* --- Reusable Components --- */
.link {
  @apply text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline;
}
.document-link {
  @apply text-xs font-semibold text-blue-600 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-full transition-colors;
}
.status-badge {
  @apply inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full leading-tight;
}
.status-badge-green {
  @apply status-badge bg-green-100 text-green-800;
}
.status-badge-red {
  @apply status-badge bg-red-100 text-red-800;
}
.status-badge-yellow {
  @apply status-badge bg-yellow-100 text-yellow-800;
}
.status-badge-gray {
  @apply status-badge bg-gray-100 text-gray-800;
}
</style>
