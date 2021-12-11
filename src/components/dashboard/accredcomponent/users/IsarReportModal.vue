<template>
  <div>
    <!-- Modal Backdrop -->
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 z-40" @click="close"></div>

    <!-- Modal Dialog -->
    <dialog :open="isOpen" class="fixed inset-0 z-50 m-auto w-11/12 max-w-5xl h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
      <header class="flex justify-between items-center p-4 border-b bg-gray-50 sticky top-0">
        <h2 class="text-xl font-bold">Institutional Self Assessment Report (ISAR)</h2>
        <button @click="close" class="text-gray-500 hover:text-gray-800 text-2xl font-bold">×</button>
      </header>

      <form @submit.prevent="handleSubmit" class="p-6 overflow-y-auto flex-grow">
        <!-- Part I: Executive Summary -->
        <section class="mb-8">
          <h3 class="text-lg font-semibold border-b pb-2 mb-4">Part I: Executive Summary</h3>
          <label for="executive_summary" class="block text-sm font-medium text-gray-700">Executive Summary</label>
          <textarea id="executive_summary" v-model="formData.executive_summary" rows="5" class="form-input" required></textarea>
        </section>

        <!-- Part II: Profile of the Institution -->
        <section class="mb-8">
          <h3 class="text-lg font-semibold border-b pb-2 mb-4">Part II: Profile of the Institution</h3>

          <!-- Sub-section: General Information -->
          <h4 class="text-md font-semibold text-gray-800 mt-6 mb-3">General Information</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Institute Name</label>
              <p class="mt-1 p-2 bg-gray-100 rounded-md">{{ application?.institute_profile_details?.name || 'N/A' }}</p>
            </div>
            <div>
              <label for="isar_location_details" class="block text-sm font-medium text-gray-700">Location</label>
              <input type="text" id="isar_location_details" v-model="formData.isar_location_details" class="form-input" required />
            </div>
            <div>
              <label for="isar_type_of_institute_details" class="block text-sm font-medium text-gray-700">Type of Institute</label>
              <select id="isar_type_of_institute_details" v-model="formData.isar_type_of_institute_details" class="form-input" required>
                <option disabled value="">Please select one</option>
                <option v-for="type in instituteTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
              </select>
            </div>
            <div>
              <label for="isar_affiliated_to_details" class="block text-sm font-medium text-gray-700">Affiliated To</label>
              <input type="text" id="isar_affiliated_to_details" v-model="formData.isar_affiliated_to_details" class="form-input" required />
            </div>
            <div>
              <label for="isar_date_last_accreditation" class="block text-sm font-medium text-gray-700">Date of last accreditation</label>
              <input type="date" id="isar_date_last_accreditation" v-model="formData.isar_date_last_accreditation" class="form-input" />
            </div>
            <div>
              <label for="isar_source_of_funding_details" class="block text-sm font-medium text-gray-700">Source of funding</label>
              <select id="isar_source_of_funding_details" v-model="formData.isar_source_of_funding_details" class="form-input" required>
                <option disabled value="">Please select one</option>
                <option v-for="source in sourceOfFundings" :key="source.id" :value="source.id">{{ source.name }}</option>
              </select>
            </div>
            <div>
              <label for="isar_cost_of_education_details" class="block text-sm font-medium text-gray-700">Cost of education (Tuition & Living)</label>
              <input type="text" id="isar_cost_of_education_details" v-model="formData.isar_cost_of_education_details" class="form-input" placeholder="e.g., 500,000 Ngultrum/ year" required />
            </div>
            <div>
              <label for="isar_total_area_acres_details" class="block text-sm font-medium text-gray-700">Total area (in acres)</label>
              <input type="number" id="isar_total_area_acres_details" v-model.number="formData.isar_total_area_acres_details" class="form-input" min="0" required />
            </div>
            <div>
              <label for="isar_year_establishment_details" class="block text-sm font-medium text-gray-700">Year of establishment</label>
              <input type="number" id="isar_year_establishment_details" v-model.number="formData.isar_year_establishment_details" class="form-input" placeholder="YYYY" min="1800" :max="new Date().getFullYear()" required />
            </div>
            <div>
              <label for="isar_head_of_institute_text_details" class="block text-sm font-medium text-gray-700">Head of institute</label>
              <input type="text" id="isar_head_of_institute_text_details" v-model="formData.isar_head_of_institute_text_details" class="form-input" placeholder="Name, Position, Contact" required />
            </div>
            <div>
              <label for="isar_website_details" class="block text-sm font-medium text-gray-700">Website</label>
              <input type="url" id="isar_website_details" v-model="formData.isar_website_details" class="form-input" placeholder="https://example.com" required />
            </div>
            <div>
              <label for="isar_telephone_details" class="block text-sm font-medium text-gray-700">Telephone number</label>
              <input type="tel" id="isar_telephone_details" v-model="formData.isar_telephone_details" class="form-input" required />
            </div>
            <div>
              <label for="isar_email_details" class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="isar_email_details" v-model="formData.isar_email_details" class="form-input" required />
            </div>
            <div class="lg:col-span-2">
              <label for="isar_focal_person_iqa_details" class="block text-sm font-medium text-gray-700">Name of the Focal Person for IQA</label>
              <input type="text" id="isar_focal_person_iqa_details" v-model="formData.isar_focal_person_iqa_details" class="form-input" required />
            </div>
            <div>
              <label for="land_registration_certificate" class="block text-sm font-medium text-gray-700">Land Registration Certificate</label>
              <input type="file" id="land_registration_certificate" @change="handleFileChange($event, 'land_registration_certificate')" class="form-file" accept=".pdf,.jpg,.png" required />
              <p class="text-xs text-gray-500 mt-1">Maximum file size: 5MB.</p>
            </div>
          </div>

          <!-- Sub-section: Current Academic Activities -->
          <h4 class="text-md font-semibold text-gray-800 mt-8 mb-3">Current Academic Activities</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label for="isar_num_departments" class="block text-sm font-medium text-gray-700">No. of Departments</label>
              <input type="number" id="isar_num_departments" v-model.number="formData.isar_num_departments" class="form-input" min="0" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">No. of Programmes (Total)</label>
              <p class="mt-1 p-2 bg-gray-100 rounded-md">{{ totalProgrammes }}</p>
            </div>
            <div>
              <label for="isar_num_programmes_ug" class="block text-sm font-medium text-gray-700">UG Programmes</label>
              <input type="number" id="isar_num_programmes_ug" v-model.number="formData.isar_num_programmes_ug" class="form-input" min="0" />
            </div>
            <div>
              <label for="isar_num_programmes_pg" class="block text-sm font-medium text-gray-700">PG Programmes</label>
              <input type="number" id="isar_num_programmes_pg" v-model.number="formData.isar_num_programmes_pg" class="form-input" min="0" />
            </div>
            <div>
              <label for="isar_num_programmes_doctoral" class="block text-sm font-medium text-gray-700">Doctoral Programmes</label>
              <input type="number" id="isar_num_programmes_doctoral" v-model.number="formData.isar_num_programmes_doctoral" class="form-input" min="0" />
            </div>
            <div>
              <label for="isar_num_programmes_other" class="block text-sm font-medium text-gray-700">Other Programmes</label>
              <input type="number" id="isar_num_programmes_other" v-model.number="formData.isar_num_programmes_other" class="form-input" min="0" />
            </div>
            <div class="md:col-span-2">
              <label for="isar_num_programmes_with_electives" class="block text-sm font-medium text-gray-700">No. of Programmes with electives</label>
              <input type="number" id="isar_num_programmes_with_electives" v-model.number="formData.isar_num_programmes_with_electives" class="form-input" min="0" />
            </div>
            <div class="md:col-span-2 lg:col-span-4">
              <label for="isar_electives_details" class="block text-sm font-medium text-gray-700">Specify Electives (if any)</label>
              <input type="text" id="isar_electives_details" v-model="formData.isar_electives_details" class="form-input" placeholder="e.g., AI in CS, Marketing in BBA" />
            </div>
            <div class="md:col-span-2 lg:col-span-4">
              <label for="isar_new_programmes_last_5_years_details" class="block text-sm font-medium text-gray-700">New Programmes Introduced in Last 5 Years</label>
              <textarea id="isar_new_programmes_last_5_years_details" v-model="formData.isar_new_programmes_last_5_years_details" rows="3" class="form-input" placeholder="List new programmes and the year they were introduced."></textarea>
            </div>
            <div>
              <label for="isar_num_working_days_last_year" class="block text-sm font-medium text-gray-700">Working days last year</label>
              <input type="number" id="isar_num_working_days_last_year" v-model.number="formData.isar_num_working_days_last_year" class="form-input" min="0" />
            </div>
            <div>
              <label for="isar_num_teaching_days_last_year" class="block text-sm font-medium text-gray-700">Teaching days last year</label>
              <input type="number" id="isar_num_teaching_days_last_year" v-model.number="formData.isar_num_teaching_days_last_year" class="form-input" min="0" />
            </div>
            <div class="md:col-span-2">
              <label for="isar_level_of_autonomy_details" class="block text-sm font-medium text-gray-700">Level of autonomy</label>
              <input type="text" id="isar_level_of_autonomy_details" v-model="formData.isar_level_of_autonomy_details" class="form-input" />
            </div>
          </div>

          <!-- Sub-section: Faculty Details -->
          <h4 class="text-md font-semibold text-gray-800 mt-8 mb-3">Faculty Details</h4>
          <div class="p-4 border rounded-md space-y-4">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
              <span class="font-medium">Total Faculty</span>
              <div>
                <label for="isar_faculty_male" class="block text-sm font-medium text-gray-700 mb-1">Male</label>
                <input type="number" id="isar_faculty_male" v-model.number="formData.isar_faculty_male" class="form-input" min="0" />
              </div>
              <div>
                <label for="isar_faculty_female" class="block text-sm font-medium text-gray-700 mb-1">Female</label>
                <input type="number" id="isar_faculty_female" v-model.number="formData.isar_faculty_female" class="form-input" min="0" />
              </div>
              <p class="p-2 bg-gray-100 rounded-md text-center">Total: {{ totalFaculty }}</p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
              <span class="font-medium">Regular Faculty</span>
              <div>
                <label for="isar_regular_faculty_male" class="block text-sm font-medium text-gray-700 mb-1">Male</label>
                <input type="number" id="isar_regular_faculty_male" v-model.number="formData.isar_regular_faculty_male" class="form-input" min="0" />
              </div>
              <div>
                <label for="isar_regular_faculty_female" class="block text-sm font-medium text-gray-700 mb-1">Female</label>
                <input type="number" id="isar_regular_faculty_female" v-model.number="formData.isar_regular_faculty_female" class="form-input" min="0" />
              </div>
              <p class="p-2 bg-gray-100 rounded-md text-center">Total: {{ totalRegularFaculty }}</p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
              <span class="font-medium">Contract Faculty</span>
              <div>
                <label for="isar_contract_faculty_male" class="block text-sm font-medium text-gray-700 mb-1">Male</label>
                <input type="number" id="isar_contract_faculty_male" v-model.number="formData.isar_contract_faculty_male" class="form-input" min="0" />
              </div>
              <div>
                <label for="isar_contract_faculty_female" class="block text-sm font-medium text-gray-700 mb-1">Female</label>
                <input type="number" id="isar_contract_faculty_female" v-model.number="formData.isar_contract_faculty_female" class="form-input" min="0" />
              </div>
              <p class="p-2 bg-gray-100 rounded-md text-center">Total: {{ totalContractFaculty }}</p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
              <span class="font-medium">Visiting Faculty</span>
              <div>
                <label for="isar_visiting_faculty_male" class="block text-sm font-medium text-gray-700 mb-1">Male</label>
                <input type="number" id="isar_visiting_faculty_male" v-model.number="formData.isar_visiting_faculty_male" class="form-input" min="0" />
              </div>
              <div>
                <label for="isar_visiting_faculty_female" class="block text-sm font-medium text-gray-700 mb-1">Female</label>
                <input type="number" id="isar_visiting_faculty_female" v-model.number="formData.isar_visiting_faculty_female" class="form-input" min="0" />
              </div>
              <p class="p-2 bg-gray-100 rounded-md text-center">Total: {{ totalVisitingFaculty }}</p>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div>
              <label for="isar_faculty_doctoral" class="block text-sm font-medium text-gray-700">Faculty with Doctoral Degree</label>
              <input type="number" id="isar_faculty_doctoral" v-model.number="formData.isar_faculty_doctoral" class="form-input" min="0" />
            </div>
            <div>
              <label for="isar_faculty_masters" class="block text-sm font-medium text-gray-700">Faculty with Masters' Degree</label>
              <input type="number" id="isar_faculty_masters" v-model.number="formData.isar_faculty_masters" class="form-input" min="0" />
            </div>
            <div>
              <label for="isar_faculty_bachelors" class="block text-sm font-medium text-gray-700">Faculty with Bachelors' Degree</label>
              <input type="number" id="isar_faculty_bachelors" v-model.number="formData.isar_faculty_bachelors" class="form-input" min="0" />
            </div>
          </div>

          <!-- Sub-section: Non-Teaching Staff -->
          <h4 class="text-md font-semibold text-gray-800 mt-8 mb-3">Non-Teaching Staff</h4>
          <div class="p-4 border rounded-md space-y-4">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
              <span class="font-medium">Technical Staff</span>
              <div>
                <label for="isar_technical_staff_male" class="block text-sm font-medium text-gray-700 mb-1">Male</label>
                <input type="number" id="isar_technical_staff_male" v-model.number="formData.isar_technical_staff_male" class="form-input" min="0" />
              </div>
              <div>
                <label for="isar_technical_staff_female" class="block text-sm font-medium text-gray-700 mb-1">Female</label>
                <input type="number" id="isar_technical_staff_female" v-model.number="formData.isar_technical_staff_female" class="form-input" min="0" />
              </div>
              <p class="p-2 bg-gray-100 rounded-md text-center">Total: {{ totalTechnicalStaff }}</p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
              <span class="font-medium">Administrative Staff</span>
              <div>
                <label for="isar_admin_staff_male" class="block text-sm font-medium text-gray-700 mb-1">Male</label>
                <input type="number" id="isar_admin_staff_male" v-model.number="formData.isar_admin_staff_male" class="form-input" min="0" />
              </div>
              <div>
                <label for="isar_admin_staff_female" class="block text-sm font-medium text-gray-700 mb-1">Female</label>
                <input type="number" id="isar_admin_staff_female" v-model.number="formData.isar_admin_staff_female" class="form-input" min="0" />
              </div>
              <p class="p-2 bg-gray-100 rounded-md text-center">Total: {{ totalAdminStaff }}</p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
              <span class="font-medium">Support Staff</span>
              <div>
                <label for="isar_support_staff_male" class="block text-sm font-medium text-gray-700 mb-1">Male</label>
                <input type="number" id="isar_support_staff_male" v-model.number="formData.isar_support_staff_male" class="form-input" min="0" />
              </div>
              <div>
                <label for="isar_support_staff_female" class="block text-sm font-medium text-gray-700 mb-1">Female</label>
                <input type="number" id="isar_support_staff_female" v-model.number="formData.isar_support_staff_female" class="form-input" min="0" />
              </div>
              <p class="p-2 bg-gray-100 rounded-md text-center">Total: {{ totalSupportStaff }}</p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
              <span class="font-bold text-lg">Total Staff</span>
              <p class="p-2 rounded-md font-bold md:col-span-2"></p>
              <p class="p-2 bg-gray-200 rounded-md text-center font-bold text-lg">Total: {{ totalAllStaff }}</p>
            </div>
          </div>

          <!-- Sub-section: Student Enrolment -->
          <h4 class="text-md font-semibold text-gray-800 mt-8 mb-3">Student Enrolment</h4>
          <div class="p-4 border rounded-md space-y-4">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
              <span class="font-medium">Diploma Students</span>
              <div>
                <label for="isar_students_diploma_male" class="block text-sm font-medium text-gray-700 mb-1">Male</label>
                <input type="number" id="isar_students_diploma_male" v-model.number="formData.isar_students_diploma_male" class="form-input" min="0" />
              </div>
              <div>
                <label for="isar_students_diploma_female" class="block text-sm font-medium text-gray-700 mb-1">Female</label>
                <input type="number" id="isar_students_diploma_female" v-model.number="formData.isar_students_diploma_female" class="form-input" min="0" />
              </div>
              <p class="p-2 bg-gray-100 rounded-md text-center">Total: {{ totalDiplomaStudents }}</p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
              <span class="font-medium">Bachelors' Students</span>
              <div>
                <label for="isar_students_bachelors_male" class="block text-sm font-medium text-gray-700 mb-1">Male</label>
                <input type="number" id="isar_students_bachelors_male" v-model.number="formData.isar_students_bachelors_male" class="form-input" min="0" />
              </div>
              <div>
                <label for="isar_students_bachelors_female" class="block text-sm font-medium text-gray-700 mb-1">Female</label>
                <input type="number" id="isar_students_bachelors_female" v-model.number="formData.isar_students_bachelors_female" class="form-input" min="0" />
              </div>
              <p class="p-2 bg-gray-100 rounded-md text-center">Total: {{ totalBachelorsStudents }}</p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
              <span class="font-medium">Masters' Students</span>
              <div>
                <label for="isar_students_masters_male" class="block text-sm font-medium text-gray-700 mb-1">Male</label>
                <input type="number" id="isar_students_masters_male" v-model.number="formData.isar_students_masters_male" class="form-input" min="0" />
              </div>
              <div>
                <label for="isar_students_masters_female" class="block text-sm font-medium text-gray-700 mb-1">Female</label>
                <input type="number" id="isar_students_masters_female" v-model.number="formData.isar_students_masters_female" class="form-input" min="0" />
              </div>
              <p class="p-2 bg-gray-100 rounded-md text-center">Total: {{ totalMastersStudents }}</p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
              <span class="font-medium">Other Students</span>
              <div>
                <label for="isar_students_other_male" class="block text-sm font-medium text-gray-700 mb-1">Male</label>
                <input type="number" id="isar_students_other_male" v-model.number="formData.isar_students_other_male" class="form-input" min="0" />
              </div>
              <div>
                <label for="isar_students_other_female" class="block text-sm font-medium text-gray-700 mb-1">Female</label>
                <input type="number" id="isar_students_other_female" v-model.number="formData.isar_students_other_female" class="form-input" min="0" />
              </div>
              <p class="p-2 bg-gray-100 rounded-md text-center">Total: {{ totalOtherStudents }}</p>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
              <span class="font-bold text-lg">Total Students</span>
              <p class="p-2 rounded-md font-bold md:col-span-2"></p>
              <p class="p-2 bg-gray-200 rounded-md text-center font-bold text-lg">Total: {{ totalAllStudents }}</p>
            </div>
          </div>
        </section>

        <!-- Part III: Main Report (File Uploads) -->
        <section>
          <h3 class="text-lg font-semibold border-b pb-2 mb-4">Part III: Main Report</h3>
          <p class="text-sm text-gray-600 mb-4">Please upload a single document (PDF, DOC, DOCX) for each standard.</p>
          <div class="space-y-4">
            <div v-for="standard in standards" :key="standard.id">
              <label :for="`standard_file_${standard.id}`" class="block text-sm font-medium text-gray-700">
                {{ standard.standard_name }}
              </label>
              <input type="file" :id="`standard_file_${standard.id}`" @change="handleFileChange($event, `isar_standard_document_file_${standard.id}`)" class="form-file" accept=".pdf,.doc,.docx" required />
              <p class="text-xs text-gray-500 mt-1">Maximum file size: 5MB.</p>
            </div>
          </div>
        </section>
      </form>

      <footer class="p-4 border-t bg-gray-50 flex justify-end gap-4 sticky bottom-0">
        <button @click="close" type="button" class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Cancel</button>
        <button @click="handleSubmit" type="button" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Submit ISARs</button>
      </footer>
    </dialog>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import apiService from '@/services/services';

const props = defineProps({
  isOpen: Boolean,
  application: Object,
});

const emit = defineEmits(['close', 'submit-isar']);
const toast = useToast();

const formData = ref({});
const filesToUpload = ref({});
const instituteTypes = ref([]);
const sourceOfFundings = ref([]);
const standards = ref([]);

const fetchMasterData = async () => {
  try {
    const [typesRes, fundingRes, standardsRes] = await Promise.all([
      apiService.getMastersInstituteTypes(),
      apiService.getMastersSourceOfFundings(),
      apiService.getMastersStandards(),
    ]);
    instituteTypes.value = typesRes.data.results || typesRes.data;
    sourceOfFundings.value = fundingRes.data.results || fundingRes.data;
    standards.value = standardsRes.data.results || standardsRes.data;
  } catch (error) {
    console.error("Failed to fetch master data for ISAR form:", error);
  }
};

onMounted(() => {
  fetchMasterData();
});

const initializeFormData = (app) => {
  const profile = app?.institute_profile_details || {};
  // *** KEY MAPPING: These keys now EXACTLY match the Django model fields ***
  formData.value = {
    application: app?.id || null,
    status: 'draft_isar', // Default status for creation
    executive_summary: '',
    // General Info
    isar_location_details: profile.address || '',
    isar_type_of_institute_details: profile.type || '',
    isar_affiliated_to_details: profile.affiliated_to || '',
    isar_date_last_accreditation: null,
    isar_source_of_funding_details: profile.source_of_funding || '',
    isar_cost_of_education_details: '',
    isar_total_area_acres_details: profile.total_area || null,
    isar_year_establishment_details: profile.year_established || null,
    isar_head_of_institute_text_details: `${profile.head_name}, ${profile.head_position}` || '',
    isar_website_details: profile.website || '',
    isar_telephone_details: profile.telephone || '',
    isar_email_details: profile.email || '',
    isar_focal_person_iqa_details: profile.focal_person || '',
    // Academic Activities
    isar_num_departments: profile.departments || 0,
    isar_num_programmes_ug: profile.programs_ug || 0,
    isar_num_programmes_pg: profile.programs_pg || 0,
    isar_num_programmes_doctoral: profile.programs_doctoral || 0,
    isar_num_programmes_other: profile.programs_other || 0,
    isar_num_programmes_with_electives: profile.programs_with_electives || 0,
    isar_electives_details: profile.electives_details || '',
    isar_new_programmes_last_5_years_details: profile.new_programs || '',
    isar_num_working_days_last_year: profile.working_days || 0,
    isar_num_teaching_days_last_year: profile.teaching_days || 0,
    isar_level_of_autonomy_details: '',
    // Faculty Details
    isar_faculty_male: profile.faculty_male || 0, isar_faculty_female: profile.faculty_female || 0,
    isar_regular_faculty_male: profile.regular_faculty_male || 0, isar_regular_faculty_female: profile.regular_faculty_female || 0,
    isar_contract_faculty_male: profile.contract_faculty_male || 0, isar_contract_faculty_female: profile.contract_faculty_female || 0,
    isar_visiting_faculty_male: profile.visiting_faculty_male || 0, isar_visiting_faculty_female: profile.visiting_faculty_female || 0,
    isar_faculty_doctoral: profile.faculty_doctoral || 0, isar_faculty_masters: profile.faculty_masters || 0, isar_faculty_bachelors: profile.faculty_bachelors || 0,
    // Non-Teaching Staff
    isar_technical_staff_male: profile.technical_staff_male || 0, isar_technical_staff_female: profile.technical_staff_female || 0,
    isar_admin_staff_male: profile.admin_staff_male || 0, isar_admin_staff_female: profile.admin_staff_female || 0,
    isar_support_staff_male: profile.support_staff_male || 0, isar_support_staff_female: profile.support_staff_female || 0,
    // Student Enrolment
    isar_students_diploma_male: profile.students_diploma_male || 0, isar_students_diploma_female: profile.students_diploma_female || 0,
    isar_students_bachelors_male: profile.students_bachelors_male || 0, isar_students_bachelors_female: profile.students_bachelors_female || 0,
    isar_students_masters_male: profile.students_masters_male || 0, isar_students_masters_female: profile.students_masters_female || 0,
    isar_students_other_male: profile.students_other_male || 0, isar_students_other_female: profile.students_other_female || 0,
  };
  filesToUpload.value = {};
};

watch(() => props.application, (newApp) => {
  if (newApp) {
    initializeFormData(newApp);
  }
}, { immediate: true, deep: true });

// *** COMPUTED PROPERTIES: Updated to use the correct formData keys ***
const number = (val) => Number(val) || 0;
const totalProgrammes = computed(() => number(formData.value.isar_num_programmes_ug) + number(formData.value.isar_num_programmes_pg) + number(formData.value.isar_num_programmes_doctoral) + number(formData.value.isar_num_programmes_other));
const totalFaculty = computed(() => number(formData.value.isar_faculty_male) + number(formData.value.isar_faculty_female));
const totalRegularFaculty = computed(() => number(formData.value.isar_regular_faculty_male) + number(formData.value.isar_regular_faculty_female));
const totalContractFaculty = computed(() => number(formData.value.isar_contract_faculty_male) + number(formData.value.isar_contract_faculty_female));
const totalVisitingFaculty = computed(() => number(formData.value.isar_visiting_faculty_male) + number(formData.value.isar_visiting_faculty_female));
const totalTechnicalStaff = computed(() => number(formData.value.isar_technical_staff_male) + number(formData.value.isar_technical_staff_female));
const totalAdminStaff = computed(() => number(formData.value.isar_admin_staff_male) + number(formData.value.isar_admin_staff_female));
const totalSupportStaff = computed(() => number(formData.value.isar_support_staff_male) + number(formData.value.isar_support_staff_female));
const totalAllStaff = computed(() => totalTechnicalStaff.value + totalAdminStaff.value + totalSupportStaff.value);
const totalDiplomaStudents = computed(() => number(formData.value.isar_students_diploma_male) + number(formData.value.isar_students_diploma_female));
const totalBachelorsStudents = computed(() => number(formData.value.isar_students_bachelors_male) + number(formData.value.isar_students_bachelors_female));
const totalMastersStudents = computed(() => number(formData.value.isar_students_masters_male) + number(formData.value.isar_students_masters_female));
const totalOtherStudents = computed(() => number(formData.value.isar_students_other_male) + number(formData.value.isar_students_other_female));
const totalAllStudents = computed(() => totalDiplomaStudents.value + totalBachelorsStudents.value + totalMastersStudents.value + totalOtherStudents.value);


const handleFileChange = (event, key) => {
  const file = event.target.files[0];
  if (!file) {
    delete filesToUpload.value[key];
    return;
  }
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (file.size > maxSize) {
    toast.error(`File "${file.name}" exceeds the 5MB size limit.`);
    event.target.value = ''; // Reset the file input
    delete filesToUpload.value[key];
    return;
  }

  filesToUpload.value[key] = file;
};

const handleSubmit = () => {
  // Validate required files
  let allFilesUploaded = true;
  if (!filesToUpload.value['land_registration_certificate']) {
    allFilesUploaded = false;
    toast.error('Please upload the Land Registration Certificate.');
  }

  for (const standard of standards.value) {
    const fileKey = `isar_standard_document_file_${standard.id}`;
    if (!filesToUpload.value[fileKey]) {
      allFilesUploaded = false;
      toast.error(`Please upload the document for "${standard.standard_name}".`);
    }
  }

  if (!allFilesUploaded) {
    return; // Stop submission if validation fails
  }

  const submissionData = new FormData();

  // Append all text/number data from formData
  for (const key in formData.value) {
    const value = formData.value[key];
    if (value !== null && value !== undefined && value !== '') {
      submissionData.append(key, value);
    }
  }

  // Append all files
  for (const key in filesToUpload.value) {
    submissionData.append(key, filesToUpload.value[key]);
  }

  emit('submit-isar', submissionData);
};

const close = () => {
  emit('close');
};
</script>

<style scoped>
.form-input {
  @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm;
}
.form-file {
  @apply mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100;
}
dialog:not([open]) {
    display: none;
}
</style>