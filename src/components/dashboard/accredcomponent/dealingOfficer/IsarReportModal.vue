<template>
  <div>
    <!-- Modal Backdrop -->
    <div v-if="isOpen" class="fixed inset-0 z-40 bg-black bg-opacity-50" @click="close"></div>

    <!-- Modal Dialog -->
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
          <!-- Part I: Executive Summary -->
          <section class="mb-8">
            <h3 class="mb-4 border-b pb-2 text-lg font-semibold">Part I: Executive Summary</h3>
            <p class="whitespace-pre-wrap rounded-md bg-gray-50 p-3 text-sm">{{ localIsarData?.executive_summary || 'Not provided' }}</p>
          </section>

          <!-- Part II: Profile of the Institution -->
          <section class="mb-8">
            <h3 class="mb-4 border-b pb-2 text-lg font-semibold">Part II: Profile of the Institution</h3>
            <div class="grid grid-cols-1 gap-x-6 gap-y-4 text-sm md:grid-cols-2 lg:grid-cols-3">
              <div><p class="font-medium text-gray-500">Institute Name</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.application_details?.institute_profile_details?.name || 'N/A' }}</p></div>
              <div><p class="font-medium text-gray-500">Location</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.isar_location_details || 'N/A' }}</p></div>
              <div><p class="font-medium text-gray-500">Type of Institute</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.isar_type_of_institute_details?.name || 'N/A' }}</p></div>
              <div><p class="font-medium text-gray-500">Affiliated to</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.isar_affiliated_to_details || 'N/A' }}</p></div>
              <div><p class="font-medium text-gray-500">Date of last accreditation</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.isar_date_last_accreditation ? new Date(localIsarData.isar_date_last_accreditation).toLocaleDateString() : 'N/A' }}</p></div>
              <div><p class="font-medium text-gray-500">Source of funding</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.isar_source_of_funding_details?.name || 'N/A' }}</p></div>
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

          <!-- Current Academic Activities (Numbers) -->
          <section class="mb-8">
            <h3 class="mb-4 border-b pb-2 text-lg font-semibold">Current Academic Activities</h3>
            <div class="grid grid-cols-1 gap-x-6 gap-y-4 text-sm md:grid-cols-2 lg:grid-cols-4">
              <div><p class="font-medium text-gray-500">No. of Departments</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.isar_num_departments || 0 }}</p></div>
              <div><p class="font-medium text-gray-500">UG Programmes</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.isar_num_programmes_ug || 0 }}</p></div>
              <div><p class="font-medium text-gray-500">PG Programmes</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.isar_num_programmes_pg || 0 }}</p></div>
              <div><p class="font-medium text-gray-500">Doctoral Programmes</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.isar_num_programmes_doctoral || 0 }}</p></div>
              <div><p class="font-medium text-gray-500">Other Programmes</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.isar_num_programmes_other || 0 }}</p></div>
              <div><p class="font-medium text-gray-500">Programmes with Electives</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.isar_num_programmes_with_electives || 0 }}</p></div>
              <div class="lg:col-span-2"><p class="font-medium text-gray-500">Specify Electives</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.isar_electives_details || 'N/A' }}</p></div>
              <div class="lg:col-span-4"><p class="font-medium text-gray-500">New Programmes (Last 5 Years)</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.isar_new_programmes_last_5_years_details || 'N/A' }}</p></div>
              <div><p class="font-medium text-gray-500">Working Days (Last Year)</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.isar_num_working_days_last_year || 0 }}</p></div>
              <div><p class="font-medium text-gray-500">Teaching Days (Last Year)</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.isar_num_teaching_days_last_year || 0 }}</p></div>
              <div class="lg:col-span-2"><p class="font-medium text-gray-500">Level of Autonomy</p><p class="rounded-md bg-gray-100 p-2">{{ localIsarData?.isar_level_of_autonomy_details || 'N/A' }}</p></div>
            </div>
          </section>

          <!-- Human Resources & Student Statistics -->
          <section class="mb-8">
            <h3 class="mb-4 border-b pb-2 text-lg font-semibold">Human Resources & Student Statistics</h3>
            <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div class="rounded-lg border p-4">
                <h4 class="mb-3 text-md font-bold">Faculty Details</h4>
                <table class="w-full text-left text-sm">
                  <thead class="bg-gray-50 text-xs uppercase text-gray-700"><tr class="border-b"><th class="px-2 py-2">Category</th><th class="text-center">Male</th><th class="text-center">Female</th><th class="text-center">Total</th></tr></thead>
                  <tbody>
                    <tr class="border-b"><td class="px-2 py-1 font-medium">Regular</td><td class="text-center">{{ localIsarData?.isar_regular_faculty_male || 0 }}</td><td class="text-center">{{ localIsarData?.isar_regular_faculty_female || 0 }}</td><td class="text-center font-bold">{{ (localIsarData?.isar_regular_faculty_male || 0) + (localIsarData?.isar_regular_faculty_female || 0) }}</td></tr>
                    <tr class="border-b"><td class="px-2 py-1 font-medium">Contract</td><td class="text-center">{{ localIsarData?.isar_contract_faculty_male || 0 }}</td><td class="text-center">{{ localIsarData?.isar_contract_faculty_female || 0 }}</td><td class="text-center font-bold">{{ (localIsarData?.isar_contract_faculty_male || 0) + (localIsarData?.isar_contract_faculty_female || 0) }}</td></tr>
                    <tr class="border-b"><td class="px-2 py-1 font-medium">Visiting</td><td class="text-center">{{ localIsarData?.isar_visiting_faculty_male || 0 }}</td><td class="text-center">{{ localIsarData?.isar_visiting_faculty_female || 0 }}</td><td class="text-center font-bold">{{ (localIsarData?.isar_visiting_faculty_male || 0) + (localIsarData?.isar_visiting_faculty_female || 0) }}</td></tr>
                    <tr class="bg-gray-100"><td class="px-2 py-1 font-extrabold">Total Faculty</td><td class="text-center font-extrabold">{{ localIsarData?.isar_faculty_male || 0 }}</td><td class="text-center font-extrabold">{{ localIsarData?.isar_faculty_female || 0 }}</td><td class="text-center font-extrabold">{{ (localIsarData?.isar_faculty_male || 0) + (localIsarData?.isar_faculty_female || 0) }}</td></tr>
                  </tbody>
                </table>
                <div class="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div><div class="text-xs font-medium text-gray-500">Doctoral</div><div class="text-lg font-bold">{{ localIsarData?.isar_faculty_doctoral || 0 }}</div></div>
                  <div><div class="text-xs font-medium text-gray-500">Masters</div><div class="text-lg font-bold">{{ localIsarData?.isar_faculty_masters || 0 }}</div></div>
                  <div><div class="text-xs font-medium text-gray-500">Bachelors</div><div class="text-lg font-bold">{{ localIsarData?.isar_faculty_bachelors || 0 }}</div></div>
                </div>
              </div>
              <div class="rounded-lg border p-4">
                <h4 class="mb-3 text-md font-bold">Non-Teaching Staff</h4>
                <table class="w-full text-left text-sm">
                  <thead class="bg-gray-50 text-xs uppercase text-gray-700"><tr class="border-b"><th class="px-2 py-2">Category</th><th class="text-center">Male</th><th class="text-center">Female</th><th class="text-center">Total</th></tr></thead>
                  <tbody>
                    <tr class="border-b"><td class="px-2 py-1 font-medium">Technical</td><td class="text-center">{{ localIsarData?.isar_technical_staff_male || 0 }}</td><td class="text-center">{{ localIsarData?.isar_technical_staff_female || 0 }}</td><td class="text-center font-bold">{{ (localIsarData?.isar_technical_staff_male || 0) + (localIsarData?.isar_technical_staff_female || 0) }}</td></tr>
                    <tr class="border-b"><td class="px-2 py-1 font-medium">Administrative</td><td class="text-center">{{ localIsarData?.isar_admin_staff_male || 0 }}</td><td class="text-center">{{ localIsarData?.isar_admin_staff_female || 0 }}</td><td class="text-center font-bold">{{ (localIsarData?.isar_admin_staff_male || 0) + (localIsarData?.isar_admin_staff_female || 0) }}</td></tr>
                    <tr class="border-b"><td class="px-2 py-1 font-medium">Support</td><td class="text-center">{{ localIsarData?.isar_support_staff_male || 0 }}</td><td class="text-center">{{ localIsarData?.isar_support_staff_female || 0 }}</td><td class="text-center font-bold">{{ (localIsarData?.isar_support_staff_male || 0) + (localIsarData?.isar_support_staff_female || 0) }}</td></tr>
                  </tbody>
                </table>
              </div>
              <div class="rounded-lg border p-4">
                <h4 class="mb-3 text-md font-bold">Student Details</h4>
                <table class="w-full text-left text-sm">
                  <thead class="bg-gray-50 text-xs uppercase text-gray-700"><tr class="border-b"><th class="px-2 py-2">Level</th><th class="text-center">Male</th><th class="text-center">Female</th><th class="text-center">Total</th></tr></thead>
                  <tbody>
                    <tr class="border-b"><td class="px-2 py-1 font-medium">Diploma</td><td class="text-center">{{ localIsarData?.isar_students_diploma_male || 0 }}</td><td class="text-center">{{ localIsarData?.isar_students_diploma_female || 0 }}</td><td class="text-center font-bold">{{ (localIsarData?.isar_students_diploma_male || 0) + (localIsarData?.isar_students_diploma_female || 0) }}</td></tr>
                    <tr class="border-b"><td class="px-2 py-1 font-medium">Bachelors'</td><td class="text-center">{{ localIsarData?.isar_students_bachelors_male || 0 }}</td><td class="text-center">{{ localIsarData?.isar_students_bachelors_female || 0 }}</td><td class="text-center font-bold">{{ (localIsarData?.isar_students_bachelors_male || 0) + (localIsarData?.isar_students_bachelors_female || 0) }}</td></tr>
                    <tr class="border-b"><td class="px-2 py-1 font-medium">Masters'</td><td class="text-center">{{ localIsarData?.isar_students_masters_male || 0 }}</td><td class="text-center">{{ localIsarData?.isar_students_masters_female || 0 }}</td><td class="text-center font-bold">{{ (localIsarData?.isar_students_masters_male || 0) + (localIsarData?.isar_students_masters_female || 0) }}</td></tr>
                    <tr class="border-b"><td class="px-2 py-1 font-medium">Other</td><td class="text-center">{{ localIsarData?.isar_students_other_male || 0 }}</td><td class="text-center">{{ localIsarData?.isar_students_other_female || 0 }}</td><td class="text-center font-bold">{{ (localIsarData?.isar_students_other_male || 0) + (localIsarData?.isar_students_other_female || 0) }}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <!-- Part III: Main Report Documents -->
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

          <!-- Dealing Officer Actions -->
          <section class="space-y-6 border-t pt-6">
            <h3 class="mb-4 text-xl font-bold text-gray-800">Dealing Officer Actions</h3>

            <!-- 1. Assign Assessor -->
            <div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h4 class="mb-2 font-semibold text-gray-700">Assign Assessor</h4>
              <p v-if="assessorIsAlreadyAssigned" class="text-sm text-green-700">
                An assessor has already been assigned. See COI status below.
              </p>
              <div v-else class="flex flex-wrap items-end gap-4">
                <div class="flex-grow">
                  <label for="assessor" class="block text-sm font-medium text-gray-700">Available Assessors</label>
                  <select id="assessor" v-model="selectedAssessorId" class="form-input mt-1">
                    <option disabled :value="null">Please select an assessor</option>
                    <option v-for="assessor in assessors" :key="assessor.id" :value="assessor.id">{{ assessor.name }}</option>
                  </select>
                </div>
                <button @click="assignAssessor" :disabled="!selectedAssessorId || isProcessing" class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300">
                  {{ isProcessing ? 'Assigning...' : 'Assign & Send COI' }}
                </button>
              </div>
            </div>

            <!-- 2. Conflict of Interest Status -->
            <div class="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
              <h4 class="mb-2 font-semibold text-gray-700">Conflict of Interest (COI) Status</h4>
              <div v-if="currentCoiRecord">
                <p class="mb-2 text-sm font-bold">{{ currentCoiRecord.status_display }}</p>
                <div class="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                  <div>
                    <p class="font-medium text-gray-500">Assessor's Declaration:</p>
                    <p class="font-bold" :class="getAssessorCoiClass(currentCoiRecord.assessor_has_coi)">
                      {{ formatAssessorCoiStatus(currentCoiRecord.assessor_has_coi) }}
                    </p>
                    <p v-if="currentCoiRecord.assessor_coi_remarks" class="mt-1 text-xs text-gray-600">Remarks: {{ currentCoiRecord.assessor_coi_remarks }}</p>
                  </div>
                  <div>
                    <p class="font-medium text-gray-500">Institute's Response:</p>
                    <p class="font-bold" :class="getInstituteResponseClass(currentCoiRecord.institute_agrees_with_assessor)">
                      {{ formatInstituteResponse(currentCoiRecord.institute_agrees_with_assessor) }}
                    </p>
                    <p v-if="currentCoiRecord.institute_rejection_remarks" class="mt-1 text-xs text-gray-600">Remarks: {{ currentCoiRecord.institute_rejection_remarks }}</p>
                  </div>
                </div>
              </div>
              <p v-else class="text-sm text-gray-600">No COI records available. Assign an assessor to begin.</p>
            </div>

            <!-- 3. Schedule Site Visit -->
            <div class="rounded-lg border border-green-300 bg-green-50 p-4">
              <h4 class="mb-2 font-semibold text-gray-700">Schedule Physical Verification</h4>
              <p v-if="!canScheduleVisit" class="mb-4 text-sm text-gray-600">This action is available after the COI process is resolved without conflict.</p>
              <div v-else class="flex flex-wrap items-end gap-4">
                <div class="flex-grow"><label for="visit-start" class="block text-sm font-medium text-gray-700">Start Date</label><input type="date" id="visit-start" v-model="visitStartDate" class="form-input mt-1"></div>
                <div class="flex-grow"><label for="visit-end" class="block text-sm font-medium text-gray-700">End Date</label><input type="date" id="visit-end" v-model="visitEndDate" class="form-input mt-1"></div>
                <button @click="scheduleVisit" :disabled="!visitStartDate || !visitEndDate || isProcessing" class="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300">
                  {{ isProcessing ? 'Scheduling...' : 'Schedule Visit' }}
                </button>
              </div>
            </div>

            <!-- 4. Assessor Report Viewing -->
            <div class="rounded-lg border bg-gray-50 p-4">
              <h4 class="mb-2 font-semibold text-gray-700">Assessor Site Visit Report</h4>
              <div v-if="assessorReport">
                <p class="mb-3 text-sm text-gray-600">The assessor has submitted the site visit report. Please review it before making a final decision.</p>
                <a :href="assessorReport.report_file" target="_blank" class="inline-flex items-center rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
                  Download Report
                </a>
              </div>
              <p v-else class="text-sm text-gray-600">No assessor report available.</p>
            </div>

            <!-- 5. Final Accreditation Decision -->
            <div class="rounded-lg border border-red-200 bg-red-50 p-4">
              <h4 class="mb-2 font-semibold text-gray-700">Final Accreditation Decision</h4>
              <p v-if="!canMakeFinalDecision" class="mb-4 text-sm text-gray-600">Final decision not available at this stage.</p>
              <div v-else>
                <p class="mb-4 text-sm text-gray-600">Approve the accreditation or reject with remarks. This action is final.</p>
                <div class="mb-4">
                  <label for="final-remarks" class="block text-sm font-medium text-gray-700">Remarks for Final Decision (Required if rejecting)</label>
                  <textarea id="final-remarks" v-model="finalRemarks" rows="3" class="form-input mt-1"></textarea>
                </div>
                <div class="flex gap-4">
                  <button @click="makeFinalDecision('approved')" :disabled="isProcessing" class="rounded bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:bg-gray-400">
                    {{ isProcessing ? '...' : 'Approve Accreditation' }}
                  </button>
                  <button @click="makeFinalDecision('rejected')" :disabled="!finalRemarks || isProcessing" class="rounded bg-red-600 px-6 py-2 text-white hover:bg-red-700 disabled:bg-gray-400">
                    {{ isProcessing ? '...' : 'Reject Accreditation' }}
                  </button>
                </div>
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
import apiService from '@/services/services';

const props = defineProps({
  isOpen: Boolean,
  isarData: { type: Object, required: true },
  assessors: { type: Array, default: () => [] },
});

const emit = defineEmits(['close', 'action-completed']);

const localIsarData = ref(null);
const isProcessing = ref(false);
const selectedAssessorId = ref(null);
const visitStartDate = ref('');
const visitEndDate = ref('');
const finalRemarks = ref('');

watch(() => props.isarData, (newData) => {
  if (newData) {
    localIsarData.value = JSON.parse(JSON.stringify(newData));
  }
}, { immediate: true, deep: true });

const assessorIsAlreadyAssigned = computed(() => {
  return localIsarData.value?.application_details?.assessor_cois_details?.length > 0;
});

const currentCoiRecord = computed(() => {
  return localIsarData.value?.application_details?.assessor_cois_details?.[0] || null;
});

const canScheduleVisit = computed(() => {
  return localIsarData.value?.application_details?.status === 'coi_resolved_scheduling_visit';
});

const assessorReport = computed(() => {
  return localIsarData.value?.application_details?.assessor_reports?.[0] || null;
});

const canMakeFinalDecision = computed(() => {
  return localIsarData.value?.application_details?.status === 'assessment_completed';
});

const refreshModalData = async () => {
  if (!localIsarData.value?.id) return;
  try {
    const response = await apiService.getIsarReport(localIsarData.value.id);
    localIsarData.value = response.data;
  } catch (error) {
    console.error('Failed to refresh modal data:', error);
    alert('Could not refresh details. Please close and reopen the modal to see the latest changes.');
  }
};

const assignAssessor = async () => {
  if (!selectedAssessorId.value) return alert('Please select an assessor.');
  isProcessing.value = true;
  try {
    const payload = {
      application: localIsarData.value.application_details.id,
      assessor: selectedAssessorId.value,
    };
    await apiService.createApplicationAssessorCOI(payload);
    alert('Assessor assigned and COI sent successfully!');
    await refreshModalData();
    emit('action-completed');
  } catch (error) {
    console.error('Failed to assign assessor:', error);
    alert(error.response?.data?.detail || 'An error occurred. Please try again.');
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
      site_visit_name: `Accreditation Site Visit for ${localIsarData.value.application_details.institute_profile_details.name || 'Institute'}`,
      start_datetime: `${visitStartDate.value}T09:00:00Z`,
      end_datetime: `${visitEndDate.value}T17:00:00Z`,
    };
    await apiService.createApplicationSiteVisit(payload);
    alert('Physical visit scheduled successfully!');
    await refreshModalData();
    emit('action-completed');
  } catch (error) {
    console.error('Failed to schedule visit:', error);
    alert(error.response?.data?.detail || 'An error occurred. Please try again.');
  } finally {
    isProcessing.value = false;
  }
};

const makeFinalDecision = async (decision) => {
  if (decision === 'rejected' && !finalRemarks.value.trim()) {
    return alert('Remarks are required to reject an application.');
  }
  isProcessing.value = true;
  try {
    const payload = {
      decision: decision,
      final_remarks: finalRemarks.value,
    };
    await apiService.patchAccreditationApplication(localIsarData.value.application_details.id, payload);
    alert(`Application has been successfully ${decision}.`);
    await refreshModalData();
    emit('action-completed');
  } catch (error) {
    console.error('Failed to make final decision:', error);
    alert(error.response?.data?.detail || 'An error occurred while finalizing the decision.');
  } finally {
    isProcessing.value = false;
  }
};

const close = () => emit('close');

const getStatusClass = (status) => {
  const classes = {
    'submitted_isar': 'bg-blue-100 text-blue-800',
    'coi_pending_declaration': 'bg-yellow-100 text-yellow-800',
    'coi_resolved_scheduling_visit': 'bg-teal-100 text-teal-800',
    'site_visit_scheduled': 'bg-indigo-100 text-indigo-800',
    'assessment_completed': 'bg-purple-100 text-purple-800',
    'approved_accredited': 'bg-green-100 text-green-800',
    'rejected_not_accredited': 'bg-red-100 text-red-800',
    'coi_conflict_declared': 'bg-red-200 text-red-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

// For the Assessor's Declaration (assessor_has_coi)
const formatAssessorCoiStatus = (hasCoi) => {
  if (hasCoi === true) return 'Conflict Declared';
  if (hasCoi === false) return 'No Conflict Declared';
  return 'Pending Response';
};

const getAssessorCoiClass = (hasCoi) => {
  if (hasCoi === true) return 'text-red-600';
  if (hasCoi === false) return 'text-green-600';
  return 'text-yellow-600';
};

// For the Institute's Response (institute_agrees_with_assessor)
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