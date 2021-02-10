<template>
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Form Header -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10">
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
            <input
              type="text"
              id="institutionName"
              v-model="formData.institutionName"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              placeholder="Enter proposed name"
              required
            />
            <p class="text-gray-500 text-sm mt-1"><em>Note: Avoid terms like "Royal," "National," etc.</em></p>
          </div>
        </div>
  
        <!-- Vision, Mission, Implementation Section -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">2. Vision, Mission, and Implementation Strategies</h3>
          <p class="mt-1 text-sm text-gray-500">Describe the vision, mission, and strategies of the institution.</p>
        </div>
  
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="vision" class="block text-sm font-medium text-gray-700">Vision:</label>
            <textarea
              id="vision"
              v-model="formData.vision"
              rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              required
            ></textarea>
          </div>
  
          <div>
            <label for="mission" class="block text-sm font-medium text-gray-700">Mission:</label>
            <textarea
              id="mission"
              v-model="formData.mission"
              rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              required
            ></textarea>
          </div>
  
          <div>
            <label for="implementationStrategies" class="block text-sm font-medium text-gray-700">
              Implementation Strategies:
            </label>
            <textarea
              id="implementationStrategies"
              v-model="formData.implementationStrategies"
              rows="5"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              required
            ></textarea>
          </div>
        </div>
  
        <!-- Project Scheduling Section -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">3. Project Scheduling, Implementation, and Management</h3>
          <p class="mt-1 text-sm text-gray-500">Provide the project schedule, implementation plan, and management details.</p>
        </div>
  
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="projectSchedule" class="block text-sm font-medium text-gray-700">Project Schedule:</label>
            <textarea
              id="projectSchedule"
              v-model="formData.projectSchedule"
              rows="5"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              required
            ></textarea>
          </div>
        </div>
  
        <!-- Gross National Happiness Section -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">4. Values of Gross National Happiness</h3>
          <p class="mt-1 text-sm text-gray-500">Describe how the institution will contribute to Gross National Happiness.</p>
        </div>
  
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="gnhValues" class="block text-sm font-medium text-gray-700">Contribution to GNH:</label>
            <textarea
              id="gnhValues"
              v-model="formData.gnhValues"
              rows="5"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              required
            ></textarea>
          </div>
        </div>
  
        <!-- Land Section -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">5. Land</h3>
          <p class="mt-1 text-sm text-gray-500">Provide land details as required by relevant regulations.</p>
        </div>
  
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="landDetails" class="block text-sm font-medium text-gray-700">
              Land Details (as required by regulations):
            </label>
            <textarea
              id="landDetails"
              v-model="formData.landDetails"
              rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            ></textarea>
          </div>
        </div>
  
        <!-- Conceptual Master Plan Section -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">6. Conceptual Master Plan</h3>
          <p class="mt-1 text-sm text-gray-500">Describe the conceptual master plan for the institution.</p>
        </div>
  
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="masterPlan" class="block text-sm font-medium text-gray-700">Master Plan Description:</label>
            <textarea
              id="masterPlan"
              v-model="formData.masterPlan"
              rows="5"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              required
            ></textarea>
            <p class="text-gray-500 text-sm mt-1"><em>Include all aspects of the physical infrastructure.</em></p>
          </div>
        </div>
  
        <!-- Academic Plan Section -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">7. Academic Plan/Profile</h3>
          <p class="mt-1 text-sm text-gray-500">Describe the intent and purpose of the institute in terms of its academic character.</p>
        </div>
  
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="academicPlan" class="block text-sm font-medium text-gray-700">Academic Plan:</label>
            <textarea
              id="academicPlan"
              v-model="formData.academicPlan"
              rows="5"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              required
            ></textarea>
          </div>
        </div>
  
        <!-- Add More Sections (Affiliation, Teaching Hospital, Research Policy, Human Resource, etc.)
             Following the same structure as above for each of the points -->
  
        <!-- ... (Continue adding sections for points 8-21) ... -->
        <!-- Affiliation -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">8. Affiliation</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details on the affiliation of the training institute with a recognized university.</p>
        </div>
  
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="affiliationDetails" class="block text-sm font-medium text-gray-700">Affiliation Details:</label>
            <textarea
              id="affiliationDetails"
              v-model="formData.affiliationDetails"
              rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            ></textarea>
          </div>
        </div>
  
        <!-- Teaching Hospital -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">9. Teaching Hospital</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details on the teaching hospital arrangement.</p>
        </div>
  
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="teachingHospitalDetails" class="block text-sm font-medium text-gray-700">Teaching Hospital Details:</label>
            <textarea
              id="teachingHospitalDetails"
              v-model="formData.teachingHospitalDetails"
              rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            ></textarea>
          </div>
        </div>
  
        <!-- Research Policy -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">10. Research Policy</h3>
          <p class="mt-1 text-sm text-gray-500">Outline the research policy of the institution.</p>
        </div>
  
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="researchPolicy" class="block text-sm font-medium text-gray-700">Research Policy:</label>
            <textarea
              id="researchPolicy"
              v-model="formData.researchPolicy"
              rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            ></textarea>
          </div>
        </div>
  
        <!-- Human Resource -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">11. Human Resource</h3>
          <p class="mt-1 text-sm text-gray-500">Describe the human resource plan for the institution.</p>
        </div>
  
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="humanResourcePlan" class="block text-sm font-medium text-gray-700">Human Resource Plan:</label>
            <textarea
              id="humanResourcePlan"
              v-model="formData.humanResourcePlan"
              rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            ></textarea>
          </div>
        </div>
  
        <!-- Quality Assurance System -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">12. Quality Assurance System</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details on the quality assurance system of the institution.</p>
        </div>
  
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="qualityAssurance" class="block text-sm font-medium text-gray-700">Quality Assurance System Details:</label>
            <textarea
              id="qualityAssurance"
              v-model="formData.qualityAssurance"
              rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            ></textarea>
          </div>
        </div>
  
        <!-- Governance Structure -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">13. Governance Structure</h3>
          <p class="mt-1 text-sm text-gray-500">Describe the governance structure of the institution.</p>
        </div>
  
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="governanceStructure" class="block text-sm font-medium text-gray-700">Governance Structure Details:</label>
            <textarea
              id="governanceStructure"
              v-model="formData.governanceStructure"
              rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            ></textarea>
          </div>
        </div>
  
        <!-- Business Plan -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">14. Business Plan</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details on the business plan of the institution.</p>
        </div>
  
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="businessPlan" class="block text-sm font-medium text-gray-700">Business Plan Details:</label>
            <textarea
              id="businessPlan"
              v-model="formData.businessPlan"
              rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            ></textarea>
          </div>
        </div>
  
        <!-- Project Cost and Analysis -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">15. Project Cost and Analysis</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details on the project cost and analysis.</p>
        </div>
  
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="projectCostAnalysis" class="block text-sm font-medium text-gray-700">Project Cost Analysis Details:</label>
            <textarea
              id="projectCostAnalysis"
              v-model="formData.projectCostAnalysis"
              rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            ></textarea>
          </div>
        </div>
  
        <!-- Facilities and Student Services -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">16. Facilities and Student Services</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details on the facilities and student services offered by the institution.</p>
        </div>
  
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="facilitiesAndServices" class="block text-sm font-medium text-gray-700">Facilities and Services Details:</label>
            <textarea
              id="facilitiesAndServices"
              v-model="formData.facilitiesAndServices"
              rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            ></textarea>
          </div>
        </div>
  
        <!-- Admission Policy and Scholarships -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">17. Admission Policy and Scholarships</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details on the admission policy and scholarships.</p>
        </div>
  
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="admissionPolicy" class="block text-sm font-medium text-gray-700">Admission Policy Details:</label>
            <textarea
              id="admissionPolicy"
              v-model="formData.admissionPolicy"
              rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            ></textarea>
          </div>
        </div>
  
        <!-- Service Conditions -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">18. Service Conditions</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details on the service conditions for employees.</p>
        </div>
  
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="serviceConditions" class="block text-sm font-medium text-gray-700">Service Conditions Details:</label>
            <textarea
              id="serviceConditions"
              v-model="formData.serviceConditions"
              rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            ></textarea>
          </div>
        </div>
  
        <!-- Safety and Security -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">19. Safety and Security</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details on the safety and security measures.</p>
        </div>
  
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="safetyAndSecurity" class="block text-sm font-medium text-gray-700">Safety and Security Details:</label>
            <textarea
              id="safetyAndSecurity"
              v-model="formData.safetyAndSecurity"
              rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            ></textarea>
          </div>
        </div>
  
        <!-- Public Information System -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">20. Public Information System</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details on the public information system.</p>
        </div>
  
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="publicInformationSystem" class="block text-sm font-medium text-gray-700">Public Information System Details:</label>
            <textarea
              id="publicInformationSystem"
              v-model="formData.publicInformationSystem"
              rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            ></textarea>
          </div>
        </div>
  
        <!-- Others -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">21. Others</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details on any other relevant information.</p>
        </div>
  
        <div class="p-8 grid grid-cols-1 gap-6">
          <div>
            <label for="otherInformation" class="block text-sm font-medium text-gray-700">Other Information:</label>
            <textarea
              id="otherInformation"
              v-model="formData.otherInformation"
              rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            ></textarea>
          </div>
        </div>
  
        <!-- Action Buttons -->
        <div class="mt-12 flex justify-end space-x-4 p-8">
          <button @click="handleSaveDraft"
            class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            Save as Draft
          </button>
          <button @click="handleSubmit"
            class="px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            Submit Application
          </button>
        </div>
      </div>
  
      <!-- Success Modal -->
      <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
          <div class="flex items-center mb-4">
            <div class="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900">Application Submitted</h3>
          </div>
          <p class="text-gray-600 mb-6">Your Detailed Project Proposal has been submitted successfully! We will review your application and contact you soon.</p>
          <div class="flex justify-end">
            <button @click="showSuccessModal = false; router.push('/dashboard')"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';
  
  const router = useRouter();
  const toast = useToast();
  
  const formData = ref({
    institutionName: '',
    vision: '',
    mission: '',
    implementationStrategies: '',
    projectSchedule: '',
    gnhValues: '',
    landDetails: '',
    masterPlan: '',
    academicPlan: '',
    affiliationDetails: '',
    teachingHospitalDetails: '',
    researchPolicy: '',
    humanResourcePlan: '',
    qualityAssurance: '',
    governanceStructure: '',
    businessPlan: '',
    projectCostAnalysis: '',
    facilitiesAndServices: '',
    admissionPolicy: '',
    serviceConditions: '',
    safetyAndSecurity: '',
    publicInformationSystem: '',
    otherInformation: '',
  });
  
  const showSuccessModal = ref(false);
  
  const handleSubmit = () => {
    // Simulate API call
    setTimeout(() => {
      showSuccessModal.value = true;
      toast.success("Application submitted successfully!");
      localStorage.removeItem('dprDraft'); // Clear draft after submission
    }, 500);
  };
  
  const handleSaveDraft = () => {
    localStorage.setItem('dprDraft', JSON.stringify(formData.value));
    toast.info("Draft saved successfully!");
  };
  
  onMounted(() => {
    const savedDraft = localStorage.getItem('dprDraft');
    if (savedDraft) {
      formData.value = JSON.parse(savedDraft);
      toast.info("Draft loaded automatically!");
    }
  });
  </script>