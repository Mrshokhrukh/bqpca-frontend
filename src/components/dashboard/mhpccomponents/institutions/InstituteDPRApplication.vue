<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Not Available Status -->
    <div v-if="reviewDecision === 'Regretted'" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
      role="alert">
      <p class="font-bold">Application Status: Not Available</p>
      <p>You cannot submit a DPR until your EOI application has been approved.</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading">
      Loading...
    </div>

    <!-- Pending Status -->
    <div v-else-if="reviewDecision === 'Pending'" class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
      role="alert">
      <p class="font-bold">Application Status: Pending</p>
      <p>Your application is currently under review. You will be notified once a decision has been made.</p>
    </div>

    <!-- Approved Status with Form -->
    <div v-else-if="reviewDecision === 'Approved'">
      <!-- Form Header -->
      <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
        <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
          Detailed Project Proposal
        </h2>
        <p class="text-gray-600 text-center max-w-2xl mx-auto">
          Prepare your Detailed Project Proposal for establishing a Medical and Health Educational Institution.
        </p>
      </div>

      <!-- Main Form Card -->
      <div class="bg-white border rounded-xl shadow-sm p-6">
        <!-- Institution Details Section -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">1. College/Institution Details</h3>
          <p class="mt-1 text-sm text-gray-500">Enter the details of the proposed institution.</p>
        </div>

        <div class="p-8 grid grid-cols-1 gap-6">
          <!-- College/Institution Details -->
          <div>
            <label for="institutionName" class="block text-sm font-medium text-gray-700">
              Proposed Name:
            </label>
            <!-- fetch from API and show but dont submit -->
            <input type="text" id="institutionName" v-model="instituteName"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              placeholder="Enter proposed name" disabled /> <!--  Disabled to prevent editing -->
          </div>
        </div>

        <!--  DPR details-->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">2. DPR Details</h3>
          <p class="mt-1 text-sm text-gray-500">Describe the DPR details.</p>
        </div>

        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="dprName" class="block text-sm font-medium text-gray-700">
              DPR name:
            </label>
            <input id="dprName" v-model="formData.dpr_name"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              required />
          </div>

          <div>
            <label for="institute_eoi_supporting_documents" class="block text-sm font-medium text-gray-700">
              EOI Supporting Documents:
            </label>
            <input type="file" id="institute_eoi_supporting_documents"
              @change="handleFileUpload('institute_eoi_supporting_documents')"
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>

          <div>
            <label for="institute_dpr_remarks" class="block text-sm font-medium text-gray-700">
              Institute DPR Remarks:
            </label>
            <textarea id="institute_dpr_remarks" v-model="formData.institute_dpr_remarks" rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"></textarea>
          </div>

          <div>
            <label for="do_dpr_review_report" class="block text-sm font-medium text-gray-700">
              DPR Review Report:
            </label>
            <textarea id="do_dpr_review_report" v-model="formData.do_dpr_review_report" rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"></textarea>
          </div>

          <div>
            <label for="do_dpr_review_summary" class="block text-sm font-medium text-gray-700">
              DPR Review Summary:
            </label>
            <textarea id="do_dpr_review_summary" v-model="formData.do_dpr_review_summary" rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"></textarea>
          </div>

          <div>
            <label for="do_dpr_report" class="block text-sm font-medium text-gray-700">
              DPR Report:
            </label>
            <input type="file" id="do_dpr_report" @change="handleFileUpload('do_dpr_report')"
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>
        </div>

        <!-- Vision, Mission, Implementation Section -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">3. Vision, Mission, and Implementation Strategies</h3>
          <p class="mt-1 text-sm text-gray-500">Describe the vision, mission, and strategies of the institution.</p>
        </div>
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="implementationStrategies" class="block text-sm font-medium text-gray-700">
              Vision, Mission Implementation Strategies:
            </label>
            <textarea id="implementationStrategies" v-model="formData.vision_mission_strategies" rows="5"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              required></textarea>
          </div>
        </div>

        <!-- Project Scheduling Section -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">4. Project Scheduling, Implementation, and Management</h3>
          <p class="mt-1 text-sm text-gray-500">Provide the project schedule, implementation plan, and management
            details.</p>
        </div>
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="projectSchedule" class="block text-sm font-medium text-gray-700">Project Schedule:</label>
            <textarea id="projectSchedule" v-model="formData.project_scheduling" rows="5"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              required></textarea>
          </div>
        </div>

        <!-- Gross National Happiness Section -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">5. Values of Gross National Happiness</h3>
          <p class="mt-1 text-sm text-gray-500">Describe how the institution will contribute to Gross National
            Happiness.</p>
        </div>
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="gnhValues" class="block text-sm font-medium text-gray-700">Contribution to GNH:</label>
            <textarea id="gnhValues" v-model="formData.gross_national_happiness" rows="5"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              required></textarea>
          </div>
        </div>

        <!-- Land Section -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">6. Land</h3>
          <p class="mt-1 text-sm text-gray-500">Provide land details as required by relevant regulations.</p>
        </div>
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="landDetails" class="block text-sm font-medium text-gray-700">
              Land Details (as required by regulations):
            </label>
            <textarea id="landDetails" v-model="formData.land_details" rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"></textarea>
          </div>
        </div>

        <!-- Conceptual Master Plan Section -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">7. Conceptual Master Plan</h3>
          <p class="mt-1 text-sm text-gray-500">Describe the conceptual master plan for the institution.</p>
        </div>
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="masterPlan" class="block text-sm font-medium text-gray-700">Master Plan Description:</label>
            <textarea id="masterPlan" v-model="formData.conceptual_master_plan" rows="5"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              required></textarea>
            <p class="text-gray-500 text-sm mt-1"><em>Include all aspects of the physical infrastructure.</em></p>
          </div>
        </div>

        <!-- Academic Plan Section -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">8. Academic Plan/Profile</h3>
          <p class="mt-1 text-sm text-gray-500">Describe the intent and purpose of the institute in terms of its
            academic character.</p>
        </div>
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="academicPlan" class="block text-sm font-medium text-gray-700">Academic Plan:</label>
            <textarea id="academicPlan" v-model="formData.academic_plan" rows="5"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              required></textarea>
          </div>
        </div>

        <!-- Affiliation -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">9. Affiliation</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details on the affiliation of the training institute with a
            recognized university.</p>
        </div>
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="affiliationDetails" class="block text-sm font-medium text-gray-700">Affiliation Details:</label>
            <textarea id="affiliationDetails" v-model="formData.affiliation_details" rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"></textarea>
          </div>
        </div>

        <!-- Teaching Hospital -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">10. Teaching Hospital</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details on the teaching hospital arrangement.</p>
        </div>
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="teachingHospitalDetails" class="block text-sm font-medium text-gray-700">Teaching Hospital
              Details:</label>
            <textarea id="teachingHospitalDetails" v-model="formData.teaching_hospital" rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"></textarea>
          </div>
        </div>

        <!-- Research Policy -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">11. Research Policy</h3>
          <p class="mt-1 text-sm text-gray-500">Outline the research policy of the institution.</p>
        </div>
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="researchPolicy" class="block text-sm font-medium text-gray-700">Research Policy:</label>
            <textarea id="researchPolicy" v-model="formData.research_policy" rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"></textarea>
          </div>
        </div>

        <!-- Human Resource -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">12. Human Resource</h3>
          <p class="mt-1 text-sm text-gray-500">Describe the human resource plan for the institution.</p>
        </div>
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="humanResourcePlan" class="block text-sm font-medium text-gray-700">Human Resource Plan:</label>
            <textarea id="humanResourcePlan" v-model="formData.human_resource" rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"></textarea>
          </div>
        </div>

        <!-- Quality Assurance System -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">13. Quality Assurance System</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details on the quality assurance system of the institution.</p>
        </div>
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="qualityAssurance" class="block text-sm font-medium text-gray-700">Quality Assurance System
              Details:</label>
            <textarea id="qualityAssurance" v-model="formData.quality_assurance" rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"></textarea>
          </div>
        </div>

        <!-- Governance Structure -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">14. Governance Structure</h3>
          <p class="mt-1 text-sm text-gray-500">Describe the governance structure of the institution.</p>
        </div>
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="governanceStructure" class="block text-sm font-medium text-gray-700">Governance Structure
              Details:</label>
            <textarea id="governanceStructure" v-model="formData.governance_structure" rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"></textarea>
          </div>
        </div>

        <!-- Business Plan -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">15. Business Plan</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details on the business plan of the institution.</p>
        </div>
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="businessPlan" class="block text-sm font-medium text-gray-700">Business Plan Details:</label>
            <textarea id="businessPlan" v-model="formData.business_plan" rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"></textarea>
          </div>
        </div>

        <!-- Project Cost and Analysis -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">16. Project Cost and Analysis</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details on the project cost and analysis.</p>
        </div>
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="projectCostAnalysis" class="block text-sm font-medium text-gray-700">Project Cost Analysis
              Details:</label>
            <textarea id="projectCostAnalysis" v-model="formData.project_cost_analysis" rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"></textarea>
          </div>
        </div>

        <!-- Facilities and Student Services -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">17. Facilities and Student Services</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details on the facilities and student services offered by the
            institution.</p>
        </div>
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="facilitiesAndServices" class="block text-sm font-medium text-gray-700">Facilities and Services
              Details:</label>
            <textarea id="facilitiesAndServices" v-model="formData.facilities_student_services" rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"></textarea>
          </div>
        </div>

        <!-- Admission Policy and Scholarships -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">18. Admission Policy and Scholarships</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details on the admission policy and scholarships.</p>
        </div>
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="admissionPolicy" class="block text-sm font-medium text-gray-700">Admission Policy
              Details:</label>
            <textarea id="admissionPolicy" v-model="formData.admission_policy" rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"></textarea>
          </div>
        </div>

        <!-- Service Conditions -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">19. Service Conditions</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details on the service conditions for employees.</p>
        </div>
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="serviceConditions" class="block text-sm font-medium text-gray-700">Service Conditions
              Details:</label>
            <textarea id="serviceConditions" v-model="formData.service_conditions" rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"></textarea>
          </div>
        </div>

        <!-- Safety and Security -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">20. Safety and Security</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details on the safety and security measures.</p>
        </div>
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="safetyAndSecurity" class="block text-sm font-medium text-gray-700">Safety and Security
              Details:</label>
            <textarea id="safetyAndSecurity" v-model="formData.safety_security" rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"></textarea>
          </div>
        </div>

        <!-- Public Information System -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">21. Public Information System</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details on the public information system.</p>
        </div>
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="publicInformationSystem" class="block text-sm font-medium text-gray-700">Public Information
              System Details:</label>
            <textarea id="publicInformationSystem" v-model="formData.public_information_system" rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"></textarea>
          </div>
        </div>

        <!-- Others -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">22. Others</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details on any other relevant information.</p>
        </div>
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="otherInformation" class="block text-sm font-medium text-gray-700">Other Information:</label>
            <textarea id="otherInformation" v-model="formData.other_details" rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"></textarea>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-12 flex justify-end space-x-4 p-8">
          <button type="button" @click="handleSaveDraft"
            class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            Save as Draft
          </button>
          <button type="button" @click="handleSubmit"
            class="px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            Submit Application
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiService from '@/services/bmhcservices';
import { useRouter } from 'vue-router'; // Import useRouter
import { useToast } from 'vue-toastification'; // Import useToast
import "vue-toastification/dist/index.css"; // Import the CSS for toast

const router = useRouter(); // Initialize router
const toast = useToast(); // Initialize toast

const instituteName = ref('');
const isSubmitting = ref(false);
const instituteId = ref(null); // We'll store the institute ID here
const reviewDecision = ref(''); // Add a ref for reviewDecision
const isLoading = ref(true); // Add loading state

const formData = ref({
  dpr_name: '',
  executive_summary: '',
  institute_eoi_supporting_documents: null,
  institute_dpr_remarks: '',
  do_dpr_review_report: '',
  do_dpr_review_summary: '',
  do_dpr_report: null,
  vision_mission_strategies: '',
  project_scheduling: '',
  gross_national_happiness: '',
  land_details: '',
  conceptual_master_plan: '',
  academic_plan: '',
  affiliation_details: '',
  teaching_hospital: '',
  research_policy: '',
  human_resource: '',
  quality_assurance: '',
  governance_structure: '',
  business_plan: '',
  project_cost_analysis: '',
  facilities_student_services: '',
  admission_policy: '',
  service_conditions: '',
  safety_security: '',
  public_information_system: '',
  other_details: '',
});


onMounted(async () => {
  const userString = localStorage.getItem('user');
  console.log("userString from localStorage:", userString);

  if (!userString) {
    console.error("No user data found in localStorage.");
    isLoading.value = false; // Stop loading
    return;
  }

  let userObject;
  try {
    userObject = JSON.parse(userString);
    console.log("userObject:", userObject);
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    isLoading.value = false;
    return;
  }

  if (!userObject || !userObject.cid) {
    console.error("User object is invalid or cid is missing:", userObject);
    isLoading.value = false;
    return;
  }
  const userCID = userObject.cid;
  console.log("userCID:", userCID);

  try {
    const response = await apiService.getMhpcInstitutes();
    const institutes = response.data.results;
    console.log("All institutes:", institutes);

    const matchedInstitute = institutes.find(institute => institute.CID === userCID);
    console.log("Matched institute:", matchedInstitute);

    if (!matchedInstitute) {
      console.error("No institute found matching the user's CID.");
      isLoading.value = false;
      return;
    }

    instituteId.value = matchedInstitute.id;
    reviewDecision.value = matchedInstitute.review_decision; // Set reviewDecision

    // Only fetch data IF the review is approved
    if (reviewDecision.value === 'Approved') {
      await fetchDprData();
      fetchInstituteName();
    }


  } catch (error) {
    console.error('Error fetching institute data:', error);
    toast.error('Error fetching institute data. Please try again.', { timeout: 3000 }); // Error toast on fetch fail
  } finally {
    isLoading.value = false; // Stop loading in all cases
  }
});


const fetchInstituteName = async () => {
  try {
    const response = await apiService.getMhpcInstitute(instituteId.value);
    if (response.data && response.data.name_of_institution) {
      instituteName.value = response.data.name_of_institution;
    }
  } catch (error) {
    console.error('Error fetching institute name:', error);
    toast.error('Error fetching institute name. Please try again.', { timeout: 3000 }); // Error toast on fetch fail
  }
};

const fetchDprData = async () => {
  try {
    const response = await apiService.getMhpcInstitute(instituteId.value);
    if (response.data) {
      // *ONLY* populate the fields you intend to update:
      formData.value.dpr_name = response.data.dpr_name || '';
      formData.value.executive_summary = response.data.executive_summary || '';
      formData.value.institute_dpr_remarks = response.data.institute_dpr_remarks || '';
      formData.value.do_dpr_review_report = response.data.do_dpr_review_report || '';
      formData.value.do_dpr_review_summary = response.data.do_dpr_review_summary || '';
      formData.value.vision_mission_strategies = response.data.vision_mission_strategies || '';
      formData.value.project_scheduling = response.data.project_scheduling || '';
      formData.value.gross_national_happiness = response.data.gross_national_happiness || '';
      formData.value.land_details = response.data.land_details || '';
      formData.value.conceptual_master_plan = response.data.conceptual_master_plan || '';
      formData.value.academic_plan = response.data.academic_plan || '';
      formData.value.affiliation_details = response.data.affiliation_details || '';
      formData.value.teaching_hospital = response.data.teaching_hospital || '';
      formData.value.research_policy = response.data.research_policy || '';
      formData.value.human_resource = response.data.human_resource || '';
      formData.value.quality_assurance = response.data.quality_assurance || '';
      formData.value.governance_structure = response.data.governance_structure || '';
      formData.value.business_plan = response.data.business_plan || '';
      formData.value.project_cost_analysis = response.data.project_cost_analysis || '';
      formData.value.facilities_student_services = response.data.facilities_student_services || '';
      formData.value.admission_policy = response.data.admission_policy || '';
      formData.value.service_conditions = response.data.service_conditions || '';
      formData.value.safety_security = response.data.safety_security || '';
      formData.value.public_information_system = response.data.public_information_system || '';
      formData.value.other_details = response.data.other_details || '';
      // Do *NOT* populate other fields.
    }
  } catch (error) {
    console.error('Error fetching DPR data:', error);
    toast.error('Error fetching DPR data. Please try again.', { timeout: 3000 }); // Error toast on fetch fail
  }
};

const handleFileUpload = (fieldName) => (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value[fieldName] = file;
  }
};

const handleSubmit = async () => {
  console.log("handleSubmit called, instituteId.value:", instituteId.value);

  if (!instituteId.value) {
    console.error("Institute ID is missing.");
    toast.error('Institute ID is missing. Please refresh the page.', { timeout: 3000 }); // Error toast
    return;
  }
  if (!formData.value.dpr_name) {
    toast.error("Please enter the DPR name.", { timeout: 3000 }); // Error toast
    return;
  }

  const submitData = new FormData();

  // *ONLY* append the fields you want to update:
  submitData.append('dpr_name', formData.value.dpr_name);
  submitData.append('executive_summary', formData.value.executive_summary);
  if (formData.value.institute_eoi_supporting_documents) {
    submitData.append('institute_eoi_supporting_documents', formData.value.institute_eoi_supporting_documents);
  }
  submitData.append('institute_dpr_remarks', formData.value.institute_dpr_remarks);
  submitData.append('do_dpr_review_report', formData.value.do_dpr_review_report);
  submitData.append('do_dpr_review_summary', formData.value.do_dpr_review_summary);
  if (formData.value.do_dpr_report) {
    submitData.append('do_dpr_report', formData.value.do_dpr_report);
  }
  submitData.append('vision_mission_strategies', formData.value.vision_mission_strategies);
  submitData.append('project_scheduling', formData.value.project_scheduling);
  submitData.append('gross_national_happiness', formData.value.gross_national_happiness);
  submitData.append('land_details', formData.value.land_details);
  submitData.append('conceptual_master_plan', formData.value.conceptual_master_plan);
  submitData.append('academic_plan', formData.value.academic_plan);
  submitData.append('affiliation_details', formData.value.affiliation_details);
  submitData.append('teaching_hospital', formData.value.teaching_hospital);
  submitData.append('research_policy', formData.value.research_policy);
  submitData.append('human_resource', formData.value.human_resource);
  submitData.append('quality_assurance', formData.value.quality_assurance);
  submitData.append('governance_structure', formData.value.governance_structure);
  submitData.append('business_plan', formData.value.business_plan);
  submitData.append('project_cost_analysis', formData.value.project_cost_analysis);
  submitData.append('facilities_student_services', formData.value.facilities_student_services);
  submitData.append('admission_policy', formData.value.admission_policy);
  submitData.append('service_conditions', formData.value.service_conditions);
  submitData.append('safety_security', formData.value.safety_security);
  submitData.append('public_information_system', formData.value.public_information_system);
  submitData.append('other_details', formData.value.other_details);
  // Do *NOT* append other fields.

  try {
    isSubmitting.value = true;
    const response = await apiService.patchMhpcInstitute(instituteId.value, submitData);
    if (response.status === 200 || response.status === 204) {
      toast.success('DPR submitted successfully!'); // Success toast
      setTimeout(() => {
        router.push('/admin/institutions/health_certification/dashboard'); // Redirect after successful submission
      }, 1500); // Delay for toast to be visible
    } else {
      toast.error(`Failed to submit DPR. Status: ${response.status}`, { timeout: 5000 }); // Error toast with status
    }
  } catch (error) {
    console.error('Error submitting DPR data:', error);
    toast.error('Error submitting DPR data. Please try again.', { timeout: 5000 }); // Generic error toast
  } finally {
    isSubmitting.value = false;
  }
};

const handleSaveDraft = async () => {
  if (!instituteId.value) {
    console.error("Institute ID is missing.");
    toast.error('Institute ID is missing. Please refresh the page.', { timeout: 3000 }); // Error toast
    return;
  }
  const draftData = new FormData();

  // *ONLY* append the fields you want to update (same as handleSubmit):
  draftData.append('dpr_name', formData.value.dpr_name);
  draftData.append('executive_summary', formData.value.executive_summary);
  if (formData.value.institute_eoi_supporting_documents) {
    draftData.append('institute_eoi_supporting_documents', formData.value.institute_eoi_supporting_documents);
  }
  draftData.append('institute_dpr_remarks', formData.value.institute_dpr_remarks);
  draftData.append('do_dpr_review_report', formData.value.do_dpr_review_report);
  draftData.append('do_dpr_review_summary', formData.value.do_dpr_review_summary);
  if (formData.value.do_dpr_report) {
    draftData.append('do_dpr_report', formData.value.do_dpr_report);
  }
  draftData.append('vision_mission_strategies', formData.value.vision_mission_strategies);
  draftData.append('project_scheduling', formData.value.project_scheduling);
  draftData.append('gross_national_happiness', formData.value.gross_national_happiness);
  draftData.append('land_details', formData.value.land_details);
  draftData.append('conceptual_master_plan', formData.value.conceptual_master_plan);
  draftData.append('academic_plan', formData.value.academic_plan);
  draftData.append('affiliation_details', formData.value.affiliation_details);
  draftData.append('teaching_hospital', formData.value.teaching_hospital);
  draftData.append('research_policy', formData.value.research_policy);
  draftData.append('human_resource', formData.value.human_resource);
  draftData.append('quality_assurance', formData.value.quality_assurance);
  draftData.append('governance_structure', formData.value.governance_structure);
  draftData.append('business_plan', formData.value.business_plan);
  draftData.append('project_cost_analysis', formData.value.project_cost_analysis);
  draftData.append('facilities_student_services', formData.value.facilities_student_services);
  draftData.append('admission_policy', formData.value.admission_policy);
  draftData.append('service_conditions', formData.value.service_conditions);
  draftData.append('safety_security', formData.value.safety_security);
  draftData.append('public_information_system', formData.value.public_information_system);
  draftData.append('other_details', formData.value.other_details);


  try {
    isSubmitting.value = true;
    const response = await apiService.patchMhpcInstitute(instituteId.value, draftData); // Same API

    if (response.status >= 200 && response.status < 300) {
      toast.success("Draft saved successfully!"); // Success toast
    } else {
      toast.error(`Failed to save draft. Status: ${response.status}`, { timeout: 5000 }); // Error toast with status
    }

  } catch (error) {
    console.error('Error saving draft:', error);
    toast.error('Error saving draft. Please try again.', { timeout: 5000 }); // Generic error toast
  } finally {
    isSubmitting.value = false;
  }
};


</script>
