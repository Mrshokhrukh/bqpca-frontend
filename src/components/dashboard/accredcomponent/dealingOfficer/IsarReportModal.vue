<template>
  <div>
    <div v-if="isOpen" class="fixed inset-0 z-40 bg-black bg-opacity-50" @click="close"></div>

    <dialog :open="isOpen" class="fixed inset-0 z-50 m-auto flex h-[95vh] w-11/12 max-w-6xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
      <header class="sticky top-0 flex items-center justify-between border-b bg-gray-50 p-4">
        <div>
          <h2 class="text-xl font-bold">Review ISAR: {{ localIsarData?.application_details?.institute_profile_details?.name || 'N/A' }}</h2>
          <span :class="getStatusClass(localIsarData?.application_details?.status)" class="mt-1 inline-flex rounded-full px-2 text-xs font-semibold leading-5">
            Status: {{ localIsarData?.application_details?.status_display || 'Unknown' }}
          </span>
        </div>
        <button class="text-2xl font-bold text-gray-500 hover:text-gray-800" @click="close">×</button>
      </header>

      <div class="flex-grow overflow-y-auto">
        <div class="p-6">
          <!-- Sections 1-3 (Summary, Profile, Documents) -->
          <section class="mb-8">
            <h3 class="mb-4 border-b pb-2 text-lg font-semibold">Part I: Executive Summary</h3>
            <p class="whitespace-pre-wrap rounded-md bg-gray-50 p-3 text-sm">{{ localIsarData?.executive_summary || 'Not provided' }}</p>
          </section>

          <section class="mb-8">
            <h3 class="mb-4 border-b pb-2 text-lg font-semibold">Part II: Profile of the Institution</h3>
            <div class="grid grid-cols-1 gap-x-6 gap-y-4 text-sm md:grid-cols-2 lg:grid-cols-3">
              <div><p class="font-medium text-gray-500">Institute Name</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.application_details?.institute_profile_details?.name || 'N/A' }}</p></div>
              <div><p class="font-medium text-gray-500">Location</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.isar_location_details || 'N/A' }}</p></div>
              <div><p class="font-medium text-gray-500">Type of Institute</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.application_details?.institute_profile_details?.type_details?.name || 'N/A' }}</p></div>
              <div><p class="font-medium text-gray-500">Affiliated to</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.isar_affiliated_to_details || 'N/A' }}</p></div>
              <div><p class="font-medium text-gray-500">Date of last accreditation</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.isar_date_last_accreditation ? new Date(localIsarData.isar_date_last_accreditation).toLocaleDateString() : 'N/A' }}</p></div>
              <div><p class="font-medium text-gray-500">Source of funding</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.application_details?.institute_profile_details?.source_of_funding_details?.name || 'N/A' }}</p></div>
              <div><p class="font-medium text-gray-500">Cost of education</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.isar_cost_of_education_details || 'N/A' }}</p></div>
              <div><p class="font-medium text-gray-500">Total area (in acres)</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.isar_total_area_acres_details || 'N/A' }}</p></div>
              <div><p class="font-medium text-gray-500">Year of establishment</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.isar_year_establishment_details || 'N/A' }}</p></div>
              <div><p class="font-medium text-gray-500">Head of institute</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.isar_head_of_institute_text_details || 'N/A' }}</p></div>
              <div><p class="font-medium text-gray-500">Website</p><p class="rounded-md bg-gray-100 p-2"><a :href="localIsarData?.isar_website_details" target="_blank" class="text-blue-600 hover:underline">{{ localIsarData?.isar_website_details || 'N/A' }}</a></p></div>
              <div><p class="font-medium text-gray-500">Telephone number</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.isar_telephone_details || 'N/A' }}</p></div>
              <div><p class="font-medium text-gray-500">Email</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.isar_email_details || 'N/A' }}</p></div>
              <div><p class="font-medium text-gray-500">Focal Person for IQA</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.isar_focal_person_iqa_details || 'N/A' }}</p></div>
              <div class="lg:col-span-3"><p class="font-medium text-gray-500">Land registration certificate</p><p class="rounded-md bg-gray-100 p-2"><a v-if="localIsarData?.land_registration_certificate" :href="localIsarData.land_registration_certificate" target="_blank" class="text-blue-600 hover:underline">View Document</a><span v-else>Not provided</span></p></div>
            </div>
          </section>

          <section class="mb-8">
            <h3 class="mb-4 border-b pb-2 text-lg font-semibold">Part III: Main Report Documents</h3>
            <div v-if="localIsarData?.isar_standard_documents?.length" class="space-y-2">
              <div v-for="doc in localIsarData.isar_standard_documents" :key="doc.id" class="flex items-center justify-between rounded-md border bg-gray-50 p-3">
                <span class="font-medium text-gray-700">{{ doc.standard_details?.standard_name || 'Document' }}</span>
                <a :href="doc.document_file" target="_blank" class="rounded-md bg-blue-600 px-4 py-1 text-sm text-white hover:bg-blue-700">Download</a>
              </div>
            </div>
            <p v-else class="rounded-md bg-gray-100 p-3">No main report documents provided.</p>
          </section>

          <!-- Workflow Section -->
          <section class="space-y-6 border-t pt-6">
            <h3 class="mb-4 text-xl font-bold text-gray-800">Dealing Officer Workflow</h3>

            <!-- STEP 1: ASSIGN ASSESSORS -->
            <div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h4 class="mb-2 font-semibold text-gray-700">1. Assign Assessors</h4>
              <div v-if="!isAssignmentActionNeeded" class="space-y-2">
                <p class="text-sm font-medium text-green-700">✓ A valid team of {{ numberOfValidAssessors }} assessors has been assigned. See COI status below.</p>
                <ul class="list-disc space-y-1 rounded-md bg-white p-3 pl-8 text-sm">
                  <li v-for="coi in localIsarData.application_details.assessor_cois_details" :key="coi.id">
                    <span class="font-semibold">{{ coi.assessor_details.name }}</span> - <span class="text-gray-600">{{ coi.assessor_details.email }}</span>
                  </li>
                </ul>
              </div>
              <div v-else class="space-y-4">
                <div v-if="isReassignmentNeeded" class="rounded-md border border-red-300 bg-red-100 p-3 text-sm text-red-800">
                  <p class="font-bold">Action Required: COI Dispute</p>
                  <p>A conflict was disputed. First, remove the disputed assessor(s) from the list below, then select new ones to meet the minimum team size of 3.</p>
                </div>
                <div class="flex flex-wrap items-start gap-4">
                  <div class="flex-grow">
                    <label class="block text-sm font-medium text-gray-700">Available Assessors ({{ selectedAssessorIds.length }} selected)</label>
                    <div class="mt-1 max-h-48 overflow-y-auto rounded-md border border-gray-300 bg-white p-2">
                      <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                        <div v-for="assessor in availableAssessorsForAssignment" :key="assessor.id" class="flex items-center rounded-md p-2 hover:bg-gray-100">
                          <input :id="`assessor-${assessor.id}`" type="checkbox" :value="assessor.id" v-model="selectedAssessorIds" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <label :for="`assessor-${assessor.id}`" class="ml-2 block cursor-pointer text-sm text-gray-900">{{ assessor.name }}</label>
                        </div>
                      </div>
                      <p v-if="!availableAssessorsForAssignment.length" class="text-center text-xs text-gray-500">No new assessors available.</p>
                    </div>
                    <p class="mt-1 text-xs text-gray-500">
                        Currently: <strong>{{ numberOfValidAssessors }}</strong> valid assessors. After selection: <strong>{{ numberOfValidAssessors + selectedAssessorIds.length }}</strong> total. A team of 3 to 5 is required.
                    </p>
                  </div>
                  <button @click="assignAssessors" :disabled="isAssignActionInvalid || isProcessing" class="mt-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300">
                    <span v-if="isProcessing">Assigning...</span>
                    <span v-else>Assign Selected</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- STEP 2: COI STATUS -->
            <div class="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
              <h4 class="mb-2 font-semibold text-gray-700">2. Conflict of Interest (COI) Status</h4>
              <div v-if="localIsarData?.application_details?.assessor_cois_details?.length" class="space-y-4">
                <div v-for="coi in localIsarData.application_details.assessor_cois_details" :key="coi.id"
                     class="rounded-lg border bg-white p-3"
                     :class="{ 'border-red-500 ring-2 ring-red-200': coi.status === 'disputed_by_institute' }">
                  <div class="mb-2 flex items-center justify-between gap-4">
                    <div class="flex-grow">
                        <h5 class="font-semibold text-gray-800">{{ coi.assessor_details.name }}</h5>
                        <span class="text-xs text-gray-500">{{ coi.assessor_details.email }}</span>
                    </div>
                    <button v-if="coi.status === 'disputed_by_institute'" @click="removeDisputedAssessor(coi)" :disabled="isProcessing" class="flex items-center gap-1 rounded-md bg-red-100 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                        Remove
                    </button>
                    <span v-else class="rounded-full px-2 py-0.5 text-xs font-medium" :class="getCoiStatusClass(coi.status)">
                      {{ coi.status_display }}
                    </span>
                  </div>
                  <div class="grid grid-cols-1 gap-4 border-t border-gray-200 pt-2 text-sm md:grid-cols-2">
                    <div>
                      <p class="font-medium text-gray-500">Assessor's Declaration:</p>
                      <p class="font-bold" :class="getAssessorCoiClass(coi.assessor_has_coi)">{{ formatAssessorCoiStatus(coi.assessor_has_coi) }}</p>
                      <p v-if="coi.assessor_coi_remarks" class="mt-1 text-xs text-gray-600">Remarks: {{ coi.assessor_coi_remarks }}</p>
                    </div>
                    <div>
                      <p class="font-medium text-gray-500">Institute's Response:</p>
                      <p class="font-bold" :class="getInstituteResponseClass(coi.institute_agrees_with_assessor)">{{ formatInstituteResponse(coi.institute_agrees_with_assessor) }}</p>
                      <blockquote v-if="coi.institute_rejection_remarks" class="mt-1 border-l-2 border-red-500 pl-2 text-xs italic text-red-700">{{ coi.institute_rejection_remarks }}</blockquote>
                    </div>
                  </div>
                </div>
              </div>
              <p v-else class="text-sm text-gray-600">No assessors assigned. Use the panel above to begin.</p>
            </div>

            <!-- STEP 3: SITE VISIT SCHEDULE -->
            <div class="rounded-lg border border-green-300 bg-green-50 p-4">
              <h4 class="mb-2 font-semibold text-gray-700">3. Physical Verification Schedule</h4>
              <div v-if="currentSiteVisit" class="mb-4 space-y-3 rounded-md border bg-white p-4">
                  <h5 class="font-semibold text-gray-800">Current Schedule Details</h5>
                   <div class="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                       <div>
                           <p class="font-medium text-gray-500">Start Date</p>
                           <p class="font-bold text-gray-800">{{ new Date(currentSiteVisit.start_datetime).toLocaleDateString() }}</p>
                       </div>
                       <div>
                           <p class="font-medium text-gray-500">End Date</p>
                           <p class="font-bold text-gray-800">{{ new Date(currentSiteVisit.end_datetime).toLocaleDateString() }}</p>
                       </div>
                       <div>
                           <p class="font-medium text-gray-500">Institute Confirmation</p>
                           <p class="font-bold" :class="instituteRequestedReschedule ? 'text-orange-600' : (currentSiteVisit.is_confirmed_by_institute ? 'text-green-600' : 'text-gray-600')">
                               {{ instituteRequestedReschedule ? 'Reschedule Requested' : (currentSiteVisit.is_confirmed_by_institute ? 'Confirmed' : 'Pending Confirmation') }}
                           </p>
                       </div>
                   </div>
                   <div v-if="instituteRequestedReschedule" class="mt-2">
                       <p class="font-medium text-gray-500 text-sm">Reason for Request:</p>
                       <blockquote class="mt-1 border-l-2 border-orange-500 pl-2 text-sm italic text-orange-700">
                           "{{ currentSiteVisit.institute_confirmation_remarks }}"
                       </blockquote>
                   </div>
              </div>
              <p v-if="!canManageVisit" class="text-sm text-gray-600">This action is available after the Conflict of Interest process is resolved.</p>
              <div v-else>
                <div v-if="currentSiteVisit && !isRescheduling" class="text-right">
                  <button @click="startRescheduling" class="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600">Propose New Schedule</button>
                </div>
                <div v-if="!currentSiteVisit || isRescheduling" class="flex flex-wrap items-end gap-4">
                  <div class="flex-grow"><label for="visit-start" class="block text-sm font-medium text-gray-700">Start Date</label><input type="date" id="visit-start" v-model="visitStartDate" class="form-input mt-1"></div>
                  <div class="flex-grow"><label for="visit-end" class="block text-sm font-medium text-gray-700">End Date</label><input type="date" id="visit-end" v-model="visitEndDate" class="form-input mt-1"></div>
                  <div class="flex gap-2">
                    <button v-if="isRescheduling && !instituteRequestedReschedule" @click="cancelRescheduling" class="rounded bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">Cancel</button>
                    <button @click="currentSiteVisit ? updateSchedule() : scheduleVisit()" :disabled="!visitStartDate || !visitEndDate || isProcessing" class="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300">
                      <span v-if="isProcessing">{{ currentSiteVisit ? 'Updating...' : 'Scheduling...' }}</span>
                      <span v-else>{{ currentSiteVisit ? 'Update Schedule' : 'Schedule Visit' }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- STEP 4: UPLOAD CONSOLIDATED REPORT -->
            <div class="rounded-lg border border-purple-200 bg-purple-50 p-4">
              <h4 class="mb-2 font-semibold text-gray-700">4. Consolidated Site Visit Report</h4>
              <div v-if="isReportAlreadyUploaded" class="space-y-2 rounded-md bg-white p-3">
                <p class="text-sm font-medium text-green-700">✓ Report has been uploaded.</p>
                <a :href="localIsarData.application_details.consolidated_site_visit_report" target="_blank" class="inline-flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                  View Uploaded Report
                </a>
              </div>
              <div v-else-if="canUploadConsolidatedReport" class="space-y-4">
                <div>
                  <label for="consolidated-report-file" class="block text-sm font-medium text-gray-700">Consolidated Report File</label>
                  <input id="consolidated-report-file" type="file" @change="handleConsolidatedReportFileChange" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100"/>
                </div>
                <button @click="uploadConsolidatedReport" :disabled="!consolidatedReportFile || isProcessing" class="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300">
                  {{ isProcessing ? 'Uploading...' : 'Upload & Proceed' }}
                </button>
              </div>
              <p v-else class="text-sm text-gray-600">This action is available after the physical verification has been scheduled or confirmed.</p>
            </div>

            <!-- STEP 5: FINAL ACCREDITATION DECISION -->
            <div class="rounded-lg border border-red-200 bg-red-50 p-4">
              <h4 class="mb-2 font-semibold text-gray-700">5. Final Accreditation Decision</h4>
              <div v-if="isDecisionAlreadyMade" class="space-y-3 rounded-md bg-white p-3 text-sm">
                  <p class="font-medium text-green-700">✓ Final decision has been submitted.</p>
                  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                          <p class="font-medium text-gray-500">Final Grade Awarded</p>
                          <p class="font-bold text-lg text-gray-900">{{ localIsarData.application_details.final_grade_awarded_details.rating_category_name }}</p>
                      </div>
                      <div v-if="localIsarData.application_details.final_grade_awarded_details.is_accrediting_grade">
                          <p class="font-medium text-gray-500">Accreditation Validity</p>
                          <p class="font-bold text-gray-800">
                              {{ formatDate(localIsarData.application_details.accreditation_validity_from) }} to {{ formatDate(localIsarData.application_details.accreditation_validity_to) }}
                          </p>
                      </div>
                  </div>
                  <div v-if="localIsarData.application_details.remarks_heqc_final">
                      <p class="font-medium text-gray-500">Final Remarks</p>
                      <blockquote class="mt-1 border-l-2 border-gray-300 pl-2 italic text-gray-700">
                          "{{ localIsarData.application_details.remarks_heqc_final }}"
                      </blockquote>
                  </div>
              </div>
              <div v-else-if="canMakeFinalDecision" class="space-y-4">
                <div>
                  <label for="final-grade" class="block text-sm font-medium text-gray-700">Final Grade Awarded</label>
                  <select id="final-grade" v-model="selectedGradeId" class="form-input mt-1">
                    <option :value="null" disabled>Select a grade to determine outcome...</option>
                    <option v-for="grade in ratingCategories" :key="grade.id" :value="grade.id">
                      {{ grade.rating_category_name }}
                      <span v-if="grade.is_accrediting_grade"> (Accredited for {{ grade.validity_years }} years)</span>
                      <span v-else> (Not Accredited)</span>
                    </option>
                  </select>
                </div>
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label for="validity-from" class="block text-sm font-medium text-gray-700">Accreditation Validity From</label>
                    <input type="date" id="validity-from" v-model="validityFrom" class="form-input mt-1 cursor-not-allowed bg-gray-200" disabled>
                  </div>
                  <div>
                    <label for="validity-to" class="block text-sm font-medium text-gray-700">Accreditation Validity To</label>
                    <input type="date" id="validity-to" v-model="validityTo" class="form-input mt-1 cursor-not-allowed bg-gray-200" disabled>
                  </div>
                </div>
                <div>
                  <label for="final-remarks" class="block text-sm font-medium text-gray-700">Remarks for Final Decision</label>
                  <textarea id="final-remarks" v-model="finalRemarks" rows="3" class="form-input mt-1" :placeholder="remarksPlaceholder"></textarea>
                </div>
                <div class="flex">
                  <button @click="submitFinalDecision" :disabled="!isFinalDecisionValid || isProcessing" class="rounded bg-red-600 px-6 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400">
                    {{ isProcessing ? 'Submitting...' : 'Submit Final Decision' }}
                  </button>
                </div>
              </div>
              <p v-else class="text-sm text-gray-600">Final decision can be made after the consolidated report has been submitted.</p>
            </div>

          </section>
        </div>
      </div>

      <footer class="sticky bottom-0 flex justify-end gap-4 border-t bg-gray-50 p-4">
        <button type="button" class="rounded bg-gray-200 px-6 py-2 text-gray-800 hover:bg-gray-300" @click="close">Close</button>
      </footer>
    </dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import apiService from '@/services/services';

const props = defineProps({
  isOpen: Boolean,
  isarData: { type: Object, required: true },
  assessors: { type: Array, default: () => [] },
  ratingCategories: { type: Array, default: () => [] },
});

const emit = defineEmits(['close', 'action-completed']);

const localIsarData = ref(null);
const isProcessing = ref(false);
const selectedAssessorIds = ref([]);
const visitStartDate = ref('');
const visitEndDate = ref('');
const consolidatedReportFile = ref(null);
const finalRemarks = ref('');
const selectedGradeId = ref(null);
const validityFrom = ref('');
const validityTo = ref('');
const isRescheduling = ref(false);

watch(() => props.isarData, (newData) => {
  if (newData) {
    localIsarData.value = JSON.parse(JSON.stringify(newData));
    // Reset form fields
    selectedAssessorIds.value = [];
    consolidatedReportFile.value = null;
    finalRemarks.value = '';
    selectedGradeId.value = null;
    validityFrom.value = '';
    validityTo.value = '';

    const existingVisit = localIsarData.value?.application_details?.site_visits?.[0];
    if (existingVisit) {
      visitStartDate.value = existingVisit.start_datetime.split('T')[0];
      visitEndDate.value = existingVisit.end_datetime.split('T')[0];
      const instituteRequested = existingVisit.is_confirmed_by_institute === false && !!existingVisit.institute_confirmation_remarks;
      isRescheduling.value = instituteRequested;
    } else {
      visitStartDate.value = '';
      visitEndDate.value = '';
      isRescheduling.value = false;
    }
  }
}, { immediate: true, deep: true });

watch(selectedGradeId, (newId) => {
    if (!newId) {
        validityFrom.value = '';
        validityTo.value = '';
        return;
    }
    const selectedCategory = props.ratingCategories.find(g => g.id === newId);
    if (!selectedCategory) return;

    if (selectedCategory.is_accrediting_grade && selectedCategory.validity_years > 0) {
        const validityYears = selectedCategory.validity_years;
        const fromDate = new Date();
        const toDate = new Date(fromDate);
        toDate.setFullYear(fromDate.getFullYear() + validityYears);
        validityFrom.value = fromDate.toISOString().split('T')[0];
        validityTo.value = toDate.toISOString().split('T')[0];
    } else {
        validityFrom.value = '';
        validityTo.value = '';
    }
});

// --- COMPUTED PROPERTIES ---

const isReassignmentNeeded = computed(() => {
  if (!localIsarData.value?.application_details?.assessor_cois_details) return false;
  return localIsarData.value.application_details.assessor_cois_details.some(coi => coi.status === 'disputed_by_institute');
});

const numberOfValidAssessors = computed(() => {
    if (!localIsarData.value?.application_details?.assessor_cois_details) return 0;
    return localIsarData.value.application_details.assessor_cois_details.filter(coi => coi.status !== 'disputed_by_institute').length;
});

const isAssignmentActionNeeded = computed(() => {
    const hasAssessors = localIsarData.value?.application_details?.assessor_cois_details?.length > 0;
    if (!hasAssessors) return true; // Initial assignment needed
    return isReassignmentNeeded.value || numberOfValidAssessors.value < 3;
});

const availableAssessorsForAssignment = computed(() => {
  if (!props.assessors.length) return [];
  const currentlyAssignedIds = new Set(
    localIsarData.value?.application_details?.assessor_cois_details.map(coi => coi.assessor) || []
  );
  return props.assessors.filter(assessor => !currentlyAssignedIds.has(assessor.id));
});

const isAssignActionInvalid = computed(() => {
  const selectedCount = selectedAssessorIds.value.length;
  if (selectedCount === 0) return true;
  const totalFutureCount = numberOfValidAssessors.value + selectedCount;
  return totalFutureCount < 3 || totalFutureCount > 5;
});

const currentSiteVisit = computed(() => {
  return localIsarData.value?.application_details?.site_visits?.[0] || null;
});

const instituteRequestedReschedule = computed(() => {
  return currentSiteVisit.value && currentSiteVisit.value.is_confirmed_by_institute === false && !!currentSiteVisit.value.institute_confirmation_remarks;
});

const canManageVisit = computed(() => {
  // Can only manage visit if the assessor assignment is complete and stable
  return !isAssignmentActionNeeded.value;
});

const canUploadConsolidatedReport = computed(() => {
    const status = localIsarData.value?.application_details?.status;
    return ['site_visit_scheduled', 'site_visit_confirmed', 'site_visit_completed'].includes(status);
});

const isReportAlreadyUploaded = computed(() => {
  return !!localIsarData.value?.application_details?.consolidated_site_visit_report;
});

const canMakeFinalDecision = computed(() => {
  return localIsarData.value?.application_details?.status === 'assessment_report_submitted';
});

const isDecisionAlreadyMade = computed(() => {
  return !!localIsarData.value?.application_details?.final_grade_awarded_details;
});

const remarksPlaceholder = computed(() => {
    if (selectedGradeId.value) {
        const selectedCategory = props.ratingCategories.find(g => g.id === selectedGradeId.value);
        if (selectedCategory && !selectedCategory.is_accrediting_grade) {
            return 'Remarks are mandatory for non-accrediting grades.';
        }
    }
    return 'Provide any final remarks (optional for accredited grades).';
});

const isFinalDecisionValid = computed(() => {
  if (!selectedGradeId.value) return false;
  const selectedCategory = props.ratingCategories.find(g => g.id === selectedGradeId.value);
  if (selectedCategory && !selectedCategory.is_accrediting_grade) {
    return !!finalRemarks.value.trim();
  }
  return true;
});

// --- API ACTION METHODS ---

const removeDisputedAssessor = async (coiToRemove) => {
    if (!confirm(`Are you sure you want to remove ${coiToRemove.assessor_details.name} from this application? This action cannot be undone.`)) {
        return;
    }
    isProcessing.value = true;
    try {
        await apiService.deleteApplicationAssessorCOI(coiToRemove.id);
        alert('Assessor removed successfully. Please select a replacement.');
        emit('action-completed');
    } catch (error) {
        console.error('Failed to remove assessor:', error);
        alert(error.response?.data?.detail || 'An error occurred while removing the assessor.');
    } finally {
        isProcessing.value = false;
    }
};

const assignAssessors = async () => {
  if (isAssignActionInvalid.value) {
    alert(`The total number of assessors must be between 3 and 5. You have ${numberOfValidAssessors.value} existing and are selecting ${selectedAssessorIds.value.length}.`);
    return;
  }
  isProcessing.value = true;
  try {
    const assignmentPromises = selectedAssessorIds.value.map(assessorId => {
      const payload = {
        application: localIsarData.value.application_details.id,
        assessor: assessorId,
      };
      return apiService.createApplicationAssessorCOI(payload);
    });
    await Promise.all(assignmentPromises);
    alert(`${selectedAssessorIds.value.length} new assessor(s) have been assigned and notified.`);
    emit('action-completed');
  } catch (error) {
    console.error('Failed to assign assessors:', error);
    alert(error.response?.data?.detail || 'An error occurred during assignment.');
  } finally {
    isProcessing.value = false;
  }
};

const scheduleVisit = async () => {
  if (!visitStartDate.value || !visitEndDate.value) return alert('Please select both a start and end date.');
  if (new Date(visitEndDate.value) < new Date(visitStartDate.value)) return alert('End date cannot be before the start date.');
  isProcessing.value = true;
  try {
    const payload = {
      application: localIsarData.value.application_details.id,
      start_datetime: `${visitStartDate.value}T09:00:00Z`,
      end_datetime: `${visitEndDate.value}T17:00:00Z`,
    };
    await apiService.createApplicationSiteVisit(payload);
    alert('Physical visit scheduled successfully!');
    emit('action-completed');
  } catch (error) {
    console.error('Failed to schedule visit:', error);
    alert(error.response?.data?.detail || 'An error occurred. Please try again.');
  } finally {
    isProcessing.value = false;
  }
};

const updateSchedule = async () => {
  if (!visitStartDate.value || !visitEndDate.value) return alert('Please select both a start and end date.');
  if (new Date(visitEndDate.value) < new Date(visitStartDate.value)) return alert('End date cannot be before the start date.');
  if (!currentSiteVisit.value) return alert('Cannot find a visit to update.');
  isProcessing.value = true;
  try {
    const payload = {
      application: localIsarData.value.application_details.id,
      start_datetime: `${visitStartDate.value}T09:00:00Z`,
      end_datetime: `${visitEndDate.value}T17:00:00Z`,
      is_confirmed_by_institute: false,
      institute_confirmation_remarks: null,
    };
    await apiService.updateApplicationSiteVisit(currentSiteVisit.value.id, payload);
    alert('Physical visit has been successfully rescheduled!');
    isRescheduling.value = false;
    emit('action-completed');
  } catch (error) {
    console.error('Failed to reschedule visit:', error);
    alert(error.response?.data?.detail || 'An error occurred. Please try again.');
  } finally {
    isProcessing.value = false;
  }
};

const uploadConsolidatedReport = async () => {
    if (!consolidatedReportFile.value) return alert('Please select a consolidated report file to upload.');
    isProcessing.value = true;
    const formData = new FormData();
    formData.append('consolidated_site_visit_report', consolidatedReportFile.value);
    try {
        await apiService.patchAccreditationApplication(localIsarData.value.application_details.id, formData);
        await apiService.patchAccreditationApplication(localIsarData.value.application_details.id, { status: 'assessment_report_submitted' });
        alert('Consolidated report uploaded successfully. You can now make the final decision.');
        emit('action-completed');
    } catch (error) {
        console.error('Failed to upload consolidated report:', error);
        alert(error.response?.data?.detail || 'An error occurred during file upload.');
    } finally {
        isProcessing.value = false;
    }
};

const submitFinalDecision = async () => {
  if (!isFinalDecisionValid.value) {
    alert('Please complete the required fields. Remarks are mandatory if the grade results in non-accreditation.');
    return;
  }
  isProcessing.value = true;
  try {
    const payload = {
      final_grade_awarded: selectedGradeId.value,
      final_remarks: finalRemarks.value,
    };
    await apiService.makeFinalDecision(localIsarData.value.application_details.id, payload);
    const selectedCategory = props.ratingCategories.find(g => g.id === selectedGradeId.value);
    const outcomeMessage = selectedCategory.is_accrediting_grade ? 'accredited' : 'marked as not accredited';
    alert(`The application has been successfully ${outcomeMessage}.`);
    emit('action-completed');
    close();
  } catch (error) {
    console.error('Failed to make final decision:', error);
    alert(error.response?.data?.detail || 'An error occurred while finalizing the decision.');
  } finally {
    isProcessing.value = false;
  }
};

// --- HELPER & UTILITY METHODS ---

const startRescheduling = () => isRescheduling.value = true;

const cancelRescheduling = () => {
  isRescheduling.value = false;
  if (currentSiteVisit.value) {
    visitStartDate.value = currentSiteVisit.value.start_datetime.split('T')[0];
    visitEndDate.value = currentSiteVisit.value.end_datetime.split('T')[0];
  }
};

const handleConsolidatedReportFileChange = (event) => consolidatedReportFile.value = event.target.files[0];

const close = () => emit('close');

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try { return new Date(dateString).toLocaleDateString('en-CA'); }
    catch { return 'Invalid Date'; }
};

const getStatusClass = (status) => {
  const classes = {
    'approved_accredited': 'bg-green-100 text-green-800', 'rejected_not_accredited': 'bg-red-100 text-red-800',
    'assessment_report_submitted': 'bg-blue-100 text-blue-800', 'site_visit_scheduled': 'bg-yellow-100 text-yellow-800',
    'site_visit_confirmed': 'bg-yellow-100 text-yellow-800', 'coi_resolved_scheduling_visit': 'bg-teal-100 text-teal-800',
    'coi_pending_declaration': 'bg-orange-100 text-orange-800', 'coi_conflict_declared': 'bg-red-200 text-red-800',
    'isar_accepted_by_heqc': 'bg-purple-100 text-purple-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const getCoiStatusClass = (status) => {
  const classes = {
    'pending_declaration': 'bg-gray-100 text-gray-800', 'no_conflict_declared': 'bg-green-100 text-green-800',
    'conflict_declared': 'bg-yellow-100 text-yellow-800', 'disputed_by_institute': 'bg-red-100 text-red-800',
    'resolved_no_conflict': 'bg-blue-100 text-blue-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const formatAssessorCoiStatus = (hasCoi) => {
  if (hasCoi === true) return 'Conflict Declared';
  if (hasCoi === false) return 'No Conflict Declared';
  return 'Pending Declaration';
};

const getAssessorCoiClass = (hasCoi) => {
  if (hasCoi === true) return 'text-red-600';
  if (hasCoi === false) return 'text-green-600';
  return 'text-yellow-600';
};

const formatInstituteResponse = (agrees) => {
  if (agrees === true) return 'Agreed';
  if (agrees === false) return 'Disputed';
  return 'Pending Response';
};

const getInstituteResponseClass = (agrees) => {
  if (agrees === true) return 'text-green-600';
  if (agrees === false) return 'text-red-600';
  return 'text-yellow-600';
};
</script>

<style scoped>
.form-input {
  @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm;
}
dialog:not([open]) {
  display: none;
}
</style>