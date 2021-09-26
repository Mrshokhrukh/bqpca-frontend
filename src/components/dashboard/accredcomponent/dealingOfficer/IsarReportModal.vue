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

          <section class="space-y-6 border-t pt-6">
            <h3 class="mb-4 text-xl font-bold text-gray-800">Dealing Officer Workflow</h3>

            <div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h4 class="mb-2 font-semibold text-gray-700">1. Assign Assessors</h4>
              <div v-if="!isAssignmentActionNeeded" class="space-y-2">
                <p class="text-sm font-medium text-green-700">✓ A valid team of {{ numberOfValidAssessors }} assessors has been assigned. See COI status below.</p>
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
                    <span v-else-if="coi.status" class="rounded-full px-2 py-0.5 text-xs font-medium" :class="getCoiStatusClass(coi.status)">
                      {{ coi.status_display }}
                    </span>
                  </div>
                  <div class="border-t border-gray-200 pt-2 text-sm">
                    <div>
                      <p class="font-medium text-gray-500">Institute's Declaration:</p>
                      <p class="font-bold" :class="getInstituteResponseClass(coi.institute_agrees_with_assessor)">{{ formatInstituteResponse(coi.institute_agrees_with_assessor) }}</p>
                      <p v-if="coi.institute_rejection_remarks" class="mt-1 text-xs text-red-700">| {{ coi.institute_rejection_remarks }}</p>
                      <p v-else-if="coi.institute_agrees_with_assessor === true" class="mt-1 text-xs text-red-700">| No conflict declared by institute.</p>
                    </div>
                  </div>
                </div>
              </div>
              <p v-else class="text-sm text-gray-600">No assessors assigned. Use the panel above to begin.</p>
            </div>

            <div class="rounded-lg border border-green-300 bg-green-50 p-4">
              <h4 class="mb-2 font-semibold text-gray-700">3. Physical Verification Schedule</h4>
              <div v-if="currentSiteVisit && !isRescheduling" class="mb-4 space-y-3 rounded-md border bg-white p-4">
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
                  <button @click="startRescheduling" class="rounded bg-yellow-500 px-4 py-2 text-sm font-semibold text-white hover:bg-yellow-600">Propose New Schedule</button>
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

            <div class="rounded-lg border border-purple-200 bg-purple-50 p-4">
              <h4 class="mb-2 font-semibold text-gray-700">4. Consolidated Site Visit Report</h4>
              <p v-if="!canUploadConsolidatedReport" class="text-sm text-gray-600">This action is available after the physical verification has been confirmed.</p>
              <div v-else class="space-y-4">
                <div>
                  <label for="consolidated-report-file" class="block text-sm font-medium text-gray-700">Consolidated Report File</label>
                  <input id="consolidated-report-file" type="file" @change="handleConsolidatedReportFileChange" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100"/>
                </div>
                <button @click="uploadConsolidatedReport" :disabled="!consolidatedReportFile || isProcessing" class="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300">
                  {{ isProcessing ? 'Uploading...' : 'Upload & Proceed' }}
                </button>
              </div>
            </div>

            <div class="rounded-lg border border-red-200 bg-red-50 p-4">
              <h4 class="mb-2 font-semibold text-gray-700">5. Final Accreditation Decision</h4>
              <p v-if="!canMakeFinalDecision" class="text-sm text-gray-600">Final decision can be made after the consolidated report has been submitted.</p>
              <div v-else class="space-y-4">
                <div>
                  <label for="final-grade" class="block text-sm font-medium text-gray-700">Final Grade Awarded</label>
                  <select id="final-grade" v-model="selectedGradeId" class="form-input mt-1">
                    <option :value="null" disabled>Select a grade...</option>
                    <option v-for="grade in ratingCategories" :key="grade.id" :value="grade.id">{{ grade.rating_category_name }}</option>
                  </select>
                </div>
                <div>
                  <label for="final-remarks" class="block text-sm font-medium text-gray-700">Remarks for Final Decision</label>
                  <textarea id="final-remarks" v-model="finalRemarks" rows="3" class="form-input mt-1"></textarea>
                </div>
                <button @click="submitFinalDecision" :disabled="!selectedGradeId || isProcessing" class="rounded bg-red-600 px-6 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-400">
                  {{ isProcessing ? 'Submitting...' : 'Submit Final Decision' }}
                </button>
              </div>
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
import { useToast, TYPE } from 'vue-toastification';
import apiService from '@/services/services';
import ConfirmToast from '@/components/common/ConfirmationToast.vue';

const props = defineProps({
  isOpen: Boolean,
  isarData: { type: Object, required: true },
  assessors: { type: Array, default: () => [] },
  ratingCategories: { type: Array, default: () => [] },
});

const emit = defineEmits(['close', 'action-completed']);
const toast = useToast();

const localIsarData = ref(null);
const isProcessing = ref(false);
const selectedAssessorIds = ref([]);
const visitStartDate = ref('');
const visitEndDate = ref('');
const isRescheduling = ref(false);
const consolidatedReportFile = ref(null);
const finalRemarks = ref('');
const selectedGradeId = ref(null);

watch(() => props.isarData, (newData) => {
  if (newData) {
    localIsarData.value = JSON.parse(JSON.stringify(newData));
    selectedAssessorIds.value = [];
    consolidatedReportFile.value = null;
    finalRemarks.value = '';
    selectedGradeId.value = null;

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

const currentSiteVisit = computed(() => {
  return localIsarData.value?.application_details?.site_visits?.[0] || null;
});

const instituteRequestedReschedule = computed(() => {
  return currentSiteVisit.value && currentSiteVisit.value.is_confirmed_by_institute === false && !!currentSiteVisit.value.institute_confirmation_remarks;
});

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
    if (!hasAssessors) return true;
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

const canManageVisit = computed(() => !isAssignmentActionNeeded.value);

const canUploadConsolidatedReport = computed(() => {
    const status = localIsarData.value?.application_details?.status;
    return ['site_visit_confirmed', 'site_visit_completed', 'assessment_report_submitted'].includes(status);
});

const canMakeFinalDecision = computed(() => {
  return localIsarData.value?.application_details?.status === 'assessment_report_submitted';
});

const removeDisputedAssessor = (coiToRemove) => {
  const message = `Are you sure you want to remove ${coiToRemove.assessor_details.name}? This action cannot be undone.`;

  toast({
    component: ConfirmToast,
    props: { message: message },
    listeners: {
      onConfirm: async () => {
        isProcessing.value = true;
        try {
          await apiService.deleteApplicationAssessorCOI(coiToRemove.id);
          toast.success('Assessor removed successfully. Please select a replacement.');
          emit('action-completed');
        } catch (error) {
          console.error('Failed to remove assessor:', error);
          toast.error(error.response?.data?.detail || 'An error occurred.');
        } finally {
          isProcessing.value = false;
        }
      }
    }
  }, {
    type: TYPE.WARNING,
    timeout: false,
    closeOnClick: false,
    pauseOnFocusLoss: false,
    draggable: false,
    closeButton: false,
  });
};

const assignAssessors = async () => {
  if (isAssignActionInvalid.value) {
    toast.warning('The total number of assessors must be between 3 and 5.');
    return;
  }
  isProcessing.value = true;
  try {
    const assignmentPromises = selectedAssessorIds.value.map(assessorId => {
      return apiService.createApplicationAssessorCOI({
        application: localIsarData.value.application_details.id,
        assessor: assessorId,
      });
    });
    await Promise.all(assignmentPromises);
    toast.success(`${selectedAssessorIds.value.length} new assessor(s) have been assigned and notified.`);
    emit('action-completed');
  } catch (error) {
    console.error('Failed to assign assessors:', error);
    toast.error(error.response?.data?.detail || 'An error occurred during assignment.');
  } finally {
    isProcessing.value = false;
  }
};

const scheduleVisit = async () => {
  if (!visitStartDate.value || !visitEndDate.value) return toast.warning('Please select both a start and end date.');
  if (new Date(visitEndDate.value) < new Date(visitStartDate.value)) return toast.warning('End date cannot be before the start date.');
  isProcessing.value = true;
  try {
    const payload = {
      application: localIsarData.value.application_details.id,
      start_datetime: `${visitStartDate.value}T09:00:00Z`,
      end_datetime: `${visitEndDate.value}T17:00:00Z`,
    };
    await apiService.createApplicationSiteVisit(payload);
    toast.success('Physical visit scheduled successfully!');
    emit('action-completed');
  } catch (error) {
    console.error('Failed to schedule visit:', error);
    toast.error(error.response?.data?.detail || 'An error occurred.');
  } finally {
    isProcessing.value = false;
  }
};

const updateSchedule = async () => {
  if (!visitStartDate.value || !visitEndDate.value) return toast.warning('Please select both a start and end date.');
  if (new Date(visitEndDate.value) < new Date(visitStartDate.value)) return toast.warning('End date cannot be before the start date.');
  if (!currentSiteVisit.value) return toast.error('Cannot find a visit to update.');

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

    toast.success('Visit schedule has been updated successfully!');
    isRescheduling.value = false;
    emit('action-completed');
  } catch (error) {
    console.error('Failed to update schedule:', error);
    
    toast.error(error.response?.data?.detail || error.response?.data?.application[0] || 'An error occurred.');
  } finally {
    isProcessing.value = false;
  }
};

const startRescheduling = () => {
  isRescheduling.value = true;
};

const cancelRescheduling = () => {
  isRescheduling.value = false;
  if (currentSiteVisit.value) {
    visitStartDate.value = currentSiteVisit.value.start_datetime.split('T')[0];
    visitEndDate.value = currentSiteVisit.value.end_datetime.split('T')[0];
  }
};

const handleConsolidatedReportFileChange = (event) => {
  consolidatedReportFile.value = event.target.files[0];
};

const uploadConsolidatedReport = async () => {
    if (!consolidatedReportFile.value) return toast.warning('Please select a report file.');
    isProcessing.value = true;
    const formData = new FormData();
    formData.append('consolidated_site_visit_report', consolidatedReportFile.value);
    try {
        await apiService.patchAccreditationApplication(localIsarData.value.application_details.id, formData);
        await apiService.patchAccreditationApplication(localIsarData.value.application_details.id, { status: 'assessment_report_submitted' });
        toast.success('Report uploaded successfully.');
        emit('action-completed');
    } catch (error) {
        console.error('Failed to upload report:', error);
        toast.error(error.response?.data?.detail || 'An error occurred during file upload.');
    } finally {
        isProcessing.value = false;
    }
};

const submitFinalDecision = async () => {
  const message = `You are about to submit the final decision. This will change the application status and cannot be easily undone. Are you sure?`;

  toast({
    component: ConfirmToast,
    props: { message },
    listeners: {
      onConfirm: async () => {
        if (!selectedGradeId.value) return toast.warning('Please select a final grade.');
        isProcessing.value = true;
        try {
          const payload = {
            final_grade_awarded: selectedGradeId.value,
            remarks_heqc_final: finalRemarks.value,
          };
          await apiService.makeFinalDecision(localIsarData.value.application_details.id, payload);
          toast.success('The final decision has been submitted successfully.');
          emit('action-completed');
        } catch (error) {
          console.error('Failed to make final decision:', error);
          toast.error(error.response?.data?.detail || 'An error occurred while finalizing the decision.');
        } finally {
          isProcessing.value = false;
        }
      }
    }
  }, {
    type: TYPE.WARNING,
    timeout: false, closeOnClick: false, pauseOnFocusLoss: false,
    draggable: false, closeButton: false,
  });
};

const close = () => emit('close');

const getStatusClass = (status) => {
  const classes = {
    'coi_conflict_declared': 'bg-red-200 text-red-800',
    'coi_pending_declaration': 'bg-orange-100 text-orange-800',
    'coi_resolved_scheduling_visit': 'bg-teal-100 text-teal-800',
    'site_visit_scheduled': 'bg-indigo-100 text-indigo-800',
    'site_visit_confirmed': 'bg-indigo-200 text-indigo-900',
    'assessment_report_submitted': 'bg-cyan-100 text-cyan-800',
    'approved_accredited': 'bg-green-100 text-green-800',
    'rejected_not_accredited': 'bg-red-100 text-red-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const getCoiStatusClass = (status) => {
  const classes = {
    'pending_assessor': 'bg-gray-100 text-gray-800',
    'approved_no_conflict': 'bg-green-100 text-green-800',
    'disputed_by_institute': 'bg-red-100 text-red-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
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