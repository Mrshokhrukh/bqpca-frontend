<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" aria-hidden="true" @click="closeModal"></div>

        <Transition name="modal-inner-fade">
          <div v-if="isOpen" class="relative flex flex-col w-full h-full max-w-5xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden">
            <header class="flex-shrink-0 px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900" id="modal-title">
                    <span v-if="!isEditing">{{ instituteDetails.name_of_institution || 'Institute Profile' }}</span>
                    <span v-else>Editing: {{ instituteDetails.name_of_institution }}</span>
                  </h3>
                  <p class="text-sm text-gray-500">
                     {{ isEditing ? 'Update the details below.' : 'Detailed information and status overview.' }}
                  </p>
                </div>
                <button @click="closeModal" class="p-1 rounded-full text-gray-400 hover:text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                  <span class="sr-only">Close</span>
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </header>

            <main class="flex-1 flex overflow-hidden">
              <aside class="w-1/4 bg-white border-r border-gray-200 overflow-y-auto custom-scrollbar">
                <nav class="p-4 space-y-1">
                  <button v-for="(tab, index) in tabs" :key="index" @click="activeTab = index" class="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md focus:outline-none transition-colors"
                    :class="[activeTab === index ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900', isEditing ? 'cursor-not-allowed opacity-60' : '']" :disabled="isEditing">
                    <component :is="tab.icon" class="h-5 w-5 mr-3 flex-shrink-0" />
                    <span class="truncate">{{ tab.name }}</span>
                  </button>
                </nav>
              </aside>

              <div class="flex-1 p-6 overflow-y-auto custom-scrollbar">
                <div v-if="instituteDetails">
                  <!-- Tab 0: Basic Information -->
                  <div v-show="activeTab === 0" class="data-section">
                    <h4 class="section-title">Applicant & Institute Information</h4>
                    <div class="data-grid">
                      <div class="data-item"><label class="data-label">Applicant Name</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.full_name || 'N/A' }}</div><input v-else type="text" v-model="editableInstituteData.full_name" class="form-input" /></div>
                      <div class="data-item"><label class="data-label">Applicant CID</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.CID || 'N/A' }}</div><input v-else type="text" v-model="editableInstituteData.CID" class="form-input" /></div>
                      <div class="data-item"><label class="data-label">Gender</label><div v-if="!isEditing" class="data-value capitalize">{{ instituteDetails.gender || 'N/A' }}</div><select v-else v-model="editableInstituteData.gender" class="form-input"><option value="male">Male</option><option value="female">Female</option><option value="others">Others</option></select></div>
                      <div class="data-item"><label class="data-label">Contact Number</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.contact_no || 'N/A' }}</div><input v-else type="text" v-model="editableInstituteData.contact_no" class="form-input" /></div>
                      <div class="data-item sm:col-span-2"><label class="data-label">Email Address</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.email_address || 'N/A' }}</div><input v-else type="email" v-model="editableInstituteData.email_address" class="form-input" /></div>
                      <div class="data-item sm:col-span-2"><label class="data-label">Name of Institution</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.name_of_institution || 'N/A' }}</div><input v-else type="text" v-model="editableInstituteData.name_of_institution" class="form-input" /></div>
                    </div>
                  </div>

                  <!-- Tab 1: Course & Program -->
                  <div v-show="activeTab === 1" class="data-section space-y-6">
                     <section>
                        <h4 class="section-title">Program Details</h4>
                        <div class="data-grid">
                            <div class="data-item"><label class="data-label">Program Name</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.program_type?.program_name || 'N/A' }}</div><input v-else type="text" v-model="editableInstituteData.program_type.program_name" class="form-input" /></div>
                            <div class="data-item"><label class="data-label">Duration (Years)</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.program_type?.duration_years || 'N/A' }}</div><input v-else type="number" v-model="editableInstituteData.program_type.duration_years" class="form-input" /></div>
                            <div class="data-item sm:col-span-2"><label class="data-label">Program Description</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.program_type?.description || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.program_type.description" class="form-input" rows="3"></textarea></div>
                        </div>
                     </section>
                     <section>
                        <h4 class="section-title">Academic & Admission Policies</h4>
                        <div class="data-grid">
                            <div class="data-item sm:col-span-2"><label class="data-label">Academic Plan</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.academic_plan || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.academic_plan" class="form-input" rows="3"></textarea></div>
                            <div class="data-item sm:col-span-2"><label class="data-label">Admission Policy</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.admission_policy || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.admission_policy" class="form-input" rows="3"></textarea></div>
                            <div class="data-item sm:col-span-2"><label class="data-label">Affiliation Details</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.affiliation_details || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.affiliation_details" class="form-input" rows="3"></textarea></div>
                            <div class="data-item sm:col-span-2"><label class="data-label">Teaching Hospital Details</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.teaching_hospital_details || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.teaching_hospital_details" class="form-input" rows="3"></textarea></div>
                        </div>
                     </section>
                  </div>

                  <!-- Tab 2: Status & Review -->
                  <div v-show="activeTab === 2" class="data-section">
                    <h4 class="section-title">Application Status & Review</h4>
                     <div class="data-grid">
                        <div class="data-item"><label class="data-label">Overall Application Status</label><div v-if="!isEditing" class="data-value font-bold" :class="{'text-green-600': instituteDetails.application_status === 'Fully Approved', 'text-orange-500': instituteDetails.application_status !== 'Fully Approved'}">{{ instituteDetails.application_status || 'N/A' }}</div><input v-else type="text" v-model="editableInstituteData.application_status" class="form-input" /></div>
                        <div class="data-item"><label class="data-label">EOI Review Decision</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.do_eoi_review_decision || 'N/A' }}</div><input v-else type="text" v-model="editableInstituteData.do_eoi_review_decision" class="form-input" /></div>
                        <div class="data-item"><label class="data-label">EOI Reviewed By</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.eoi_reviewed_by_name || 'N/A' }}</div><input v-else type="text" v-model="editableInstituteData.eoi_reviewed_by_name" class="form-input" /></div>
                        <div class="data-item"><label class="data-label">DPR Review Decision</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.do_dpr_review_decision || 'N/A' }}</div><input v-else type="text" v-model="editableInstituteData.do_dpr_review_decision" class="form-input" /></div>
                        <div class="data-item"><label class="data-label">DPR Reviewed By</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.dpr_reviewed_by_name || 'N/A' }}</div><input v-else type="text" v-model="editableInstituteData.dpr_reviewed_by_name" class="form-input" /></div>
                        <div class="data-item"><label class="data-label">Physical Verification Required?</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.is_physical_verification ? 'Yes' : 'No' }}</div><select v-else v-model="editableInstituteData.is_physical_verification" class="form-input"><option :value="true">Yes</option><option :value="false">No</option></select></div>
                        <div class="data-item"><label class="data-label">Verification Date</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.physical_verification_date || 'N/A' }}</div><input v-else type="date" v-model="editableInstituteData.physical_verification_date" class="form-input" /></div>
                        <div class="data-item sm:col-span-2"><label class="data-label">Remarks</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.remarks || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.remarks" class="form-input" rows="3"></textarea></div>
                        <div class="data-item sm:col-span-2"><label class="data-label">Reason if DPR Rejected</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.do_dpr_reason_if_rejected || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.do_dpr_reason_if_rejected" class="form-input" rows="3"></textarea></div>
                     </div>
                  </div>

                  <!-- Tab 3: Contact & Website -->
                   <div v-show="activeTab === 3" class="data-section space-y-6">
                      <section>
                        <h4 class="section-title">Institute Location & Contact</h4>
                        <div class="data-grid">
                            <div class="data-item sm:col-span-2"><label class="data-label">Address</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.address || 'N/A' }}</div><input v-else type="text" v-model="editableInstituteData.address" class="form-input" /></div>
                            <div class="data-item"><label class="data-label">Village</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.village || 'N/A' }}</div><input v-else type="text" v-model="editableInstituteData.village" class="form-input" /></div>
                            <div class="data-item"><label class="data-label">Chiwog</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.chiwog || 'N/A' }}</div><input v-else type="text" v-model="editableInstituteData.chiwog" class="form-input" /></div>
                            <div class="data-item"><label class="data-label">Gewog</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.gewog || 'N/A' }}</div><input v-else type="text" v-model="editableInstituteData.gewog" class="form-input" /></div>
                            <div class="data-item"><label class="data-label">Dzongkhag</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.dzongkhag || 'N/A' }}</div><input v-else type="text" v-model="editableInstituteData.dzongkhag" class="form-input" /></div>
                            <div class="data-item sm:col-span-2"><label class="data-label">Website</label><div v-if="!isEditing"><a :href="instituteDetails.website" target="_blank" rel="noopener noreferrer" class="link">{{ instituteDetails.website || 'N/A' }}</a></div><input v-else type="url" v-model="editableInstituteData.website" class="form-input" /></div>
                        </div>
                      </section>
                      <section>
                        <h4 class="section-title">Head of Institution</h4>
                        <div class="data-grid">
                            <div class="data-item"><label class="data-label">Name</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.head_of_institution_name || 'N/A' }}</div><input v-else type="text" v-model="editableInstituteData.head_of_institution_name" class="form-input" /></div>
                            <div class="data-item"><label class="data-label">Gender</label><div v-if="!isEditing" class="data-value capitalize">{{ instituteDetails.head_of_institution_gender || 'N/A' }}</div><select v-else v-model="editableInstituteData.head_of_institution_gender" class="form-input"><option value="male">Male</option><option value="female">Female</option><option value="others">Others</option></select></div>
                            <div class="data-item"><label class="data-label">Phone</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.head_of_institution_phone_number || 'N/A' }}</div><input v-else type="text" v-model="editableInstituteData.head_of_institution_phone_number" class="form-input" /></div>
                            <div class="data-item"><label class="data-label">Email</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.head_of_institution_email || 'N/A' }}</div><input v-else type="email" v-model="editableInstituteData.head_of_institution_email" class="form-input" /></div>
                        </div>
                      </section>
                   </div>

                  <!-- Tab 4: Documents -->
                  <div v-show="activeTab === 4" class="data-section">
                     <h4 class="section-title">Linked Documents</h4>
                      <div class="data-grid">
                        <div class="data-item sm:col-span-2">
                           <label class="data-label">EOI Supporting Documents</label>
                           <div v-if="!isEditing">
                              <a :href="instituteDetails.institute_eoi_supporting_documents" target="_blank" rel="noopener noreferrer" class="link">{{ instituteDetails.institute_eoi_supporting_documents ? 'View Document' : 'N/A' }}</a>
                           </div>
                           <input v-else type="url" v-model="editableInstituteData.institute_eoi_supporting_documents" class="form-input" />
                        </div>
                        <div class="data-item sm:col-span-2">
                           <label class="data-label">DPR Report</label>
                            <div v-if="!isEditing">
                              <a :href="instituteDetails.do_dpr_report" target="_blank" rel="noopener noreferrer" class="link">{{ instituteDetails.do_dpr_report ? 'View Document' : 'N/A' }}</a>
                           </div>
                           <input v-else type="url" v-model="editableInstituteData.do_dpr_report" class="form-input" />
                        </div>
                      </div>
                  </div>

                  <!-- Tab 5: Summaries -->
                  <div v-show="activeTab === 5" class="data-section">
                    <h4 class="section-title">Summaries & Remarks</h4>
                    <div class="data-grid">
                        <div class="data-item sm:col-span-2"><label class="data-label">DPR Name</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.dpr_name || 'N/A' }}</div><input v-else v-model="editableInstituteData.dpr_name" class="form-input" /></div>
                        <div class="data-item sm:col-span-2"><label class="data-label">Executive Summary</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.executive_summary || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.executive_summary" class="form-input" rows="4"></textarea></div>
                        <div class="data-item sm:col-span-2"><label class="data-label">Institute DPR Remarks</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.institute_dpr_remarks || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.institute_dpr_remarks" class="form-input" rows="4"></textarea></div>
                        <div class="data-item sm:col-span-2"><label class="data-label">Physical Verification Remarks</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.physical_verification_remarks || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.physical_verification_remarks" class="form-input" rows="4"></textarea></div>
                        <div class="data-item sm:col-span-2"><label class="data-label">DO DPR Review Summary</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.do_dpr_review_summary || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.do_dpr_review_summary" class="form-input" rows="4"></textarea></div>
                    </div>
                  </div>

                  <!-- Tab 6: Other Details -->
                  <div v-show="activeTab === 6" class="data-section">
                     <h4 class="section-title">Other DPR Details</h4>
                     <div class="data-grid">
                        <div class="data-item"><label class="data-label">Vision, Mission, Strategies</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.vision_mission_strategies || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.vision_mission_strategies" class="form-input" rows="2"></textarea></div>
                        <div class="data-item"><label class="data-label">Project Scheduling</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.project_scheduling || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.project_scheduling" class="form-input" rows="2"></textarea></div>
                        <div class="data-item"><label class="data-label">Gross National Happiness</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.gross_national_happiness || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.gross_national_happiness" class="form-input" rows="2"></textarea></div>
                        <div class="data-item"><label class="data-label">Land Details</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.land_details || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.land_details" class="form-input" rows="2"></textarea></div>
                        <div class="data-item"><label class="data-label">Conceptual Master Plan</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.conceptual_master_plan || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.conceptual_master_plan" class="form-input" rows="2"></textarea></div>
                        <div class="data-item"><label class="data-label">Research Policy</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.research_policy || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.research_policy" class="form-input" rows="2"></textarea></div>
                        <div class="data-item"><label class="data-label">Human Resource</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.human_resource || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.human_resource" class="form-input" rows="2"></textarea></div>
                        <div class="data-item"><label class="data-label">Quality Assurance</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.quality_assurance || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.quality_assurance" class="form-input" rows="2"></textarea></div>
                        <div class="data-item"><label class="data-label">Governance Structure</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.governance_structure || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.governance_structure" class="form-input" rows="2"></textarea></div>
                        <div class="data-item"><label class="data-label">Business Plan</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.business_plan || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.business_plan" class="form-input" rows="2"></textarea></div>
                        <div class="data-item"><label class="data-label">Project Cost Analysis</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.project_cost_analysis || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.project_cost_analysis" class="form-input" rows="2"></textarea></div>
                        <div class="data-item"><label class="data-label">Facilities & Student Services</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.facilities_student_services || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.facilities_student_services" class="form-input" rows="2"></textarea></div>
                        <div class="data-item"><label class="data-label">Service Conditions</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.service_conditions || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.service_conditions" class="form-input" rows="2"></textarea></div>
                        <div class="data-item"><label class="data-label">Safety & Security</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.safety_security || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.safety_security" class="form-input" rows="2"></textarea></div>
                        <div class="data-item"><label class="data-label">Public Information System</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.public_information_system || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.public_information_system" class="form-input" rows="2"></textarea></div>
                        <div class="data-item"><label class="data-label">Other Details</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.other_details_dpr || 'N/A' }}</div><textarea v-else v-model="editableInstituteData.other_details_dpr" class="form-input" rows="2"></textarea></div>
                     </div>
                  </div>

                </div>
                <div v-else class="text-center py-10 text-gray-500"><p>No details available.</p></div>
              </div>
            </main>

            <footer class="flex-shrink-0 px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end items-center gap-3">
              <div v-if="!isEditing" class="flex items-center gap-3">
                  <button @click="closeModal" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">Close</button>
                  <button @click="startEditing" class="px-4 py-2 bg-blue-600 border border-transparent text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">Edit Profile</button>
              </div>
              <div v-else class="flex items-center gap-3">
                  <button @click="cancelEditing" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors">Cancel</button>
                  <button @click="saveChanges" class="px-4 py-2 bg-green-600 border border-transparent text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">Save Changes</button>
              </div>
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, shallowRef } from 'vue';
import { UserCircleIcon, BookOpenIcon, CheckBadgeIcon, GlobeAltIcon, DocumentTextIcon, ChatBubbleBottomCenterTextIcon, EllipsisHorizontalCircleIcon } from '@heroicons/vue/24/outline';

// *** THE FIX IS HERE ***
// A child component (the modal) should NEVER import its parent.
// This line was the most likely cause of the "Maximum call stack size exceeded" error.
// By removing it, we break the infinite rendering loop.
//
// import InstituteProfiles from '../InstituteProfiles.vue'; // <-- REMOVED THIS LINE

const props = defineProps({
  isOpen: Boolean,
  instituteDetails: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['close-modal', 'save-changes']);

const activeTab = ref(0);
const isEditing = ref(false);
const editableInstituteData = ref({});

const tabs = ref([
  { name: 'Basic Information', icon: shallowRef(UserCircleIcon) },
  { name: 'Course & Program', icon: shallowRef(BookOpenIcon) },
  { name: 'Status & Review', icon: shallowRef(CheckBadgeIcon) },
  { name: 'Contact & Website', icon: shallowRef(GlobeAltIcon) },
  { name: 'Documents', icon: shallowRef(DocumentTextIcon) },
  { name: 'Summaries', icon: shallowRef(ChatBubbleBottomCenterTextIcon) },
  { name: 'Other Details', icon: shallowRef(EllipsisHorizontalCircleIcon) },
]);

const startEditing = () => {
  editableInstituteData.value = JSON.parse(JSON.stringify(props.instituteDetails));
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
};

const saveChanges = () => {
  emit('save-changes', editableInstituteData.value);
};

const closeModal = () => {
  if (isEditing.value) {
    cancelEditing();
  }
  emit('close-modal');
};

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    activeTab.value = 0;
    isEditing.value = false;
  }
});
</script>

<style scoped>
/* All styles remain the same */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-inner-fade-enter-active { transition: all 0.3s ease 0.1s; }
.modal-inner-fade-leave-active { transition: all 0.2s ease; }
.modal-inner-fade-enter-from, .modal-inner-fade-leave-to { opacity: 0; transform: scale(0.9); }
.data-section { @apply w-full; }
.section-title { @apply text-base font-semibold text-gray-800 pb-2 mb-4 border-b border-gray-200; }
.data-grid { @apply grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5; }
.data-item { @apply flex flex-col; }
.data-label { @apply text-xs font-medium text-gray-500 mb-1; }
.data-value { @apply text-sm text-gray-900 font-medium; }
.link { @apply text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline; }
.form-input {
  @apply w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  transition duration-150 ease-in-out;
}
.capitalize {
  text-transform: capitalize;
}
</style>