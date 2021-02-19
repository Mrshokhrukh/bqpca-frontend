<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Form Header -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10 shadow-lg">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        CPD Application Form
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Provide the necessary details for your CPD application.
      </p>
    </div>

    <!-- Main Form Card -->
    <div class="bg-white border rounded-xl shadow-lg p-6">
      <!-- Applicant Details Section -->
      <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
        <h3 class="text-lg font-semibold text-gray-900">Applicant Details</h3>
        <p class="mt-1 text-sm text-gray-500">Verify your personal information.</p>
      </div>

      <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Registration Number -->
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Registration Number</label>
          <input type="text" v-model="applicant.registrationNumber" readonly
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
        </div>

        <!-- CID Number -->
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">CID No./Identity/Work Permit No.</label>
          <input type="text" v-model="applicant.cidNumber" readonly
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
        </div>

        <!-- Full Name -->
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" v-model="applicant.fullName" readonly
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
        </div>

        <!-- Agency/Training Location -->
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Agency/Training Location</label>
          <input type="text" v-model="applicant.agencyTrainingLocation"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
        </div>
      </div>

      <!-- Application Details Section -->
      <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
        <h3 class="text-lg font-semibold text-gray-900">Application Details</h3>
        <p class="mt-1 text-sm text-gray-500">Provide information about your CPD application.</p>
      </div>

      <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Is CPD Approved? -->
        <div class="col-span-1">
          <label class="block text-sm font-medium text-gray-700">Is CPD approved?</label>
          <div class="mt-1 flex items-center">
            <div class="mr-4">
              <input type="radio" id="approvedYes" value="true" v-model="application.isApproved"
                @change="toggleApprovedFields"
                class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
              <label for="approvedYes" class="ml-2 block text-sm text-gray-700">Yes</label>
            </div>
            <div>
              <input type="radio" id="approvedNo" value="false" v-model="application.isApproved"
                @change="toggleApprovedFields"
                class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
              <label for="approvedNo" class="ml-2 block text-sm text-gray-700">No</label>
            </div>
          </div>
        </div>

        <!-- Approval Letter (if approved) -->
        <div v-if="application.isApproved === 'true'" class="col-span-1">
          <label for="approvalLetter" class="block text-sm font-medium text-gray-700">Attach Approval Letter</label>
          <input type="file" id="approvalLetter" @change="handleApprovalLetterUpload"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>

        <!-- CPD Details (if not approved) -->
        <template v-else>
          <!-- Title of CPD -->
          <div class="col-span-1">
            <label for="title" class="block text-sm font-medium text-gray-700">Title of CPD</label>
            <input type="text" id="title" v-model="application.title"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
          </div>

          <!-- Venue -->
          <div class="col-span-1">
            <label for="venue" class="block text-sm font-medium text-gray-700">Venue</label>
            <input type="text" id="venue" v-model="application.venue"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
          </div>

          <!-- From Date -->
          <div class="col-span-1">
            <label for="fromDate" class="block text-sm font-medium text-gray-700">From Date</label>
            <input type="date" id="fromDate" v-model="application.fromDate"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
          </div>

          <!-- To Date -->
          <div class="col-span-1">
            <label for="toDate" class="block text-sm font-medium text-gray-700">To Date</label>
            <input type="date" id="toDate" v-model="application.toDate"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
          </div>
        </template>
      </div>

      <!-- CPD Providers Details (Host) Section -->
      <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
        <h3 class="text-lg font-semibold text-gray-900">CPD Providers Details (Host)</h3>
        <p class="mt-1 text-sm text-gray-500">Information about the CPD provider.</p>
      </div>

      <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- CPD Providing Agency -->
        <div class="col-span-1">
          <label for="providingAgency" class="block text-sm font-medium text-gray-700">CPD Providing Agency</label>
          <select id="providingAgency" v-model="cpdProvider.agency"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
            <option value="">Select Agency</option>
            <option v-for="agency in agencyOptions" :key="agency.value" :value="agency.value">
              {{ agency.text }}
            </option>
            <option value="other">Other</option>
          </select>
        </div>

        <!-- If Others (Specify) -->
        <div v-if="cpdProvider.agency === 'other'" class="col-span-1">
          <label for="otherAgency" class="block text-sm font-medium text-gray-700">Specify Other Agency</label>
          <input type="text" id="otherAgency" v-model="cpdProvider.otherAgency"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
        </div>

        <!-- Reason for Conducting -->
        <div class="col-span-1">
          <label for="reasonConducting" class="block text-sm font-medium text-gray-700">Reason for Conducting</label>
          <select id="reasonConducting" v-model="cpdProvider.reason"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
            <option value="">Select Reason</option>
            <option v-for="reason in reasonOptions" :key="reason.value" :value="reason.value">
              {{ reason.text }}
            </option>
          </select>
        </div>

        <!-- Reason for Details -->
        <div class="col-span-1">
          <label for="reasonDetails" class="block text-sm font-medium text-gray-700">Reason Details</label>
          <textarea id="reasonDetails" v-model="cpdProvider.reasonDetails"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            rows="4"></textarea>
        </div>

      </div>

      <!-- Resource Persons Details Section -->
      <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
        <h3 class="text-lg font-semibold text-gray-900">Resource Persons Details</h3>
        <p class="mt-1 text-sm text-gray-500">Details about the resource persons.</p>
      </div>

      <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- RegNo -->
        <div class="col-span-1">
          <label for="regNo" class="block text-sm font-medium text-gray-700">RegNo</label>
          <input type="text" id="regNo" v-model="resourcePerson.regNo" @blur="fetchResourcePersonDetails"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
        </div>

        <!-- Name -->
        <div class="col-span-1">
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" id="name" v-model="resourcePerson.name" readonly
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
        </div>

        <!-- Email -->
        <div class="col-span-1">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" v-model="resourcePerson.email" readonly
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
        </div>

        <!-- Contact -->
        <div class="col-span-1">
          <label for="contact" class="block text-sm font-medium text-gray-700">Contact</label>
          <input type="text" id="contact" v-model="resourcePerson.contact" readonly
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
        </div>

        <!-- CID -->
        <div class="col-span-1">
          <label for="cid" class="block text-sm font-medium text-gray-700">CID</label>
          <input type="text" id="cid" v-model="resourcePerson.cid" readonly
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
        </div>

        <!-- Certificates -->
        <div class="col-span-1">
          <label for="certificates" class="block text-sm font-medium text-gray-700">Document supporting expertise of
            CPD</label>
          <input type="file" id="certificates" @change="handleCertificateUpload"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>
      </div>

      <!-- Teaching Learning Method Section -->
      <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
        <h3 class="text-lg font-semibold text-gray-900">Teaching Learning Method</h3>
        <p class="mt-1 text-sm text-gray-500">Details about the teaching and learning method.</p>
      </div>

      <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Type of CPD -->
        <div class="col-span-1">
          <label for="typeCPD" class="block text-sm font-medium text-gray-700">Type of CPD</label>
          <select id="typeCPD" v-model="teachingMethod.type"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
            <option value="">Select Type</option>
            <option v-for="type in cpdTypeOptions" :key="type.value" :value="type.value">
              {{ type.text }}
            </option>
          </select>
        </div>

        <!-- Methodologies -->
        <div class="col-span-1">
          <label for="methodologies" class="block text-sm font-medium text-gray-700">Methodologies</label>
          <select id="methodologies" v-model="teachingMethod.methodology"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
            <option value="">Select Methodology</option>
            <option v-for="method in methodologyOptions" :key="method.value" :value="method.value">
              {{ method.text }}
            </option>
          </select>
        </div>

        <!-- Expected Outcome -->
        <div class="col-span-1">
          <label for="expectedOutcome" class="block text-sm font-medium text-gray-700">
            Objective/Expected Outcome
          </label>
          <textarea id="expectedOutcome" v-model="teachingMethod.expectedOutcome"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            rows="4"></textarea>
        </div>

        <!-- Activity and Duration in Hours -->
        <div class="col-span-2">
          <div v-for="(method, index) in teachingMethods" :key="index" class="flex space-x-4 mb-4">
            <div class="flex-1">
              <label for="activity" class="block text-sm font-medium text-gray-700">Activity</label>
              <input type="text" v-model="method.activity"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
            </div>
            <div class="flex-1">
              <label for="durationHours" class="block text-sm font-medium text-gray-700">Duration in Hours</label>
              <input type="number" v-model.number="method.duration" @input="calculateCredit"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
            </div>
            <button @click="removeTeachingMethod(index)"
              class="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">Remove</button>
          </div>
          <button @click="addTeachingMethod"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">Add New
            Row</button>
        </div>

        <!-- Course Document -->
        <div class="col-span-1">
          <label for="courseDocument" class="block text-sm font-medium text-gray-700">Course Document</label>
          <input type="file" id="courseDocument" @change="handleCourseDocumentUpload"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        </div>
      </div>

      <!-- Participants Details Section -->
      <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
        <h3 class="text-lg font-semibold text-gray-900">Participants Details</h3>
        <p class="mt-1 text-sm text-gray-500">Details about the participants.</p>
      </div>

      <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Participation Category -->
        <div class="col-span-1">
          <label for="participationCategory" class="block text-sm font-medium text-gray-700">Participation
            Category</label>
          <select id="participationCategory" v-model="participantDetails.category"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
            <option value="">Select Category</option>
            <option v-for="category in participationCategoryOptions" :key="category.value" :value="category.value">
              {{ category.text }}
            </option>
          </select>
        </div>

        <!-- Participant sub-category -->
        <div class="col-span-1">
          <label for="participantSubcategory" class="block text-sm font-medium text-gray-700">Participant
            sub-category</label>
          <select id="participantSubcategory" v-model="participantDetails.subcategory"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
            <option value="">Select Sub-Category</option>
            <option v-for="subcategory in participantSubcategoryOptions" :key="subcategory.value"
              :value="subcategory.value">
              {{ subcategory.text }}
            </option>
          </select>
        </div>

        <!-- Number of Participants -->
        <div class="col-span-1">
          <label for="numberParticipants" class="block text-sm font-medium text-gray-700">Number of Participants</label>
          <input type="number" id="numberParticipants" v-model.number="participantDetails.number"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
        </div>

        <!-- Relevance to your profession -->
        <div class="col-span-1">
          <label for="relevanceProfession" class="block text-sm font-medium text-gray-700">
            Relevance to your profession
          </label>
          <textarea id="relevanceProfession" v-model="participantDetails.relevance"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            rows="4"></textarea>
        </div>

      </div>

      <div v-if="application.isApproved === 'true'">
        <!-- Attachment -->
        <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="col-span-1">
            <label for="attachment" class="block text-sm font-medium text-gray-700">Attachment</label>
            <input type="file" id="attachment" @change="handleAttachmentUpload"
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>
        </div>
      </div>

      <!-- After Approval of CPD Application (Participant Management) Section -->
      <div v-if="isCpdApproved">
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
          <h3 class="text-lg font-semibold text-gray-900">Add Participants (After Approval)</h3>
          <p class="mt-1 text-sm text-gray-500">Add participants after CPD approval.</p>
        </div>

        <div class="p-8">
          <div v-for="(participant, index) in participants" :key="index" class="mb-6 p-4 border rounded-xl">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- RegNo -->
              <div>
                <label for="participantRegNo" class="block text-sm font-medium text-gray-700">RegNo</label>
                <input type="text" id="participantRegNo" v-model="participant.regNo"
                  @blur="fetchParticipantName(participant)"
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
              </div>

              <!-- Name -->
              <div>
                <label for="participantName" class="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="participantName" v-model="participant.name" readonly
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
              </div>
            </div>
          </div>
          <button @click="addParticipant"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">Add
            More</button>

          <!-- Attendance Sheet -->
          <div class="mt-6">
            <label for="attendanceSheet" class="block text-sm font-medium text-gray-700">Attendance Sheet</label>
            <input type="file" id="attendanceSheet" @change="handleAttendanceSheetUpload"
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-12 flex justify-end space-x-4 p-8">
        <button @click="saveDraft"
          class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          Save as Draft
        </button>
        <button @click="handleSubmit"
          class="px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
          Submit
        </button>
        <button @click="cancelForm"
          class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
        <div class="flex items-center mb-4">
          <div class="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900">Confirm Submission</h3>
        </div>
        <p class="text-gray-600 mb-6">You are about to submit your CPD application. This action cannot be undone.
          Are you sure you want to proceed?</p>
        <div class="flex justify-end gap-4">
          <button @click="showConfirmation = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200">
            Cancel
          </button>
          <button @click="confirmSubmit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import apiservice from '@/services/bmhcservices'; // Ensure correct import

export default {
  name: 'CpdApplicationForm',
  setup() {
    const authStore = useAuthStore();

    // Dummy resource person data
    const dummyResourcePerson = {
      regNo: '1235',
      name: 'Sonam',
      email: 'sonam@gmail.com',
      contact: '17889954',
      cid: '1151200133'
    };

    // Reactive Data
    const applicant = reactive({
      registrationNumber: '12345', // Example
      cidNumber: '', // Will be filled from authStore
      fullName: '', // Will be filled from authStore
      agencyTrainingLocation: '',
    });

    const application = reactive({
      isApproved: 'false',
      title: '',
      venue: '',
      fromDate: '',
      toDate: '',
    });

    const cpdProvider = reactive({
      agency: '',
      otherAgency: '',
      reason: '',
      reasonDetails: '',
    });

    const resourcePerson = reactive({
      regNo: '',
      name: '',
      email: '',
      contact: '',
      cid: '',
      certificate: null,
    });

    const teachingMethod = reactive({
      type: '',
      methodology: '',
      expectedOutcome: '',
    });

    const teachingMethods = ref([{ activity: '', duration: null }]);

    const participantDetails = reactive({
      category: '',
      subcategory: '',
      number: null,
      relevance: '',
    });

    const participants = ref([]);

    const approvalLetter = ref(null);
    const courseDocument = ref(null);
    const attendanceSheet = ref(null);
    const attachment = ref(null);

    // Options for dropdowns
    const agencyOptions = ref([]);
    const reasonOptions = ref([]);

    const cpdTypeOptions = ref([]);

    const methodologyOptions = ref([
      { text: 'Method 1', value: 'method1' },
      { text: 'Method 2', value: 'method2' },
    ]);

    const participationCategoryOptions = ref([]);

    const participantSubcategoryOptions = ref([]);

    const isCpdApproved = computed(() => application.isApproved === 'true');

    // Methods
    const toggleApprovedFields = () => {
      // Clear other fields when 'Yes' is selected.
      if (application.isApproved === 'true') {
        application.title = '';
        application.venue = '';
        application.fromDate = '';
        application.toDate = '';
      }
    };

    const handleApprovalLetterUpload = (event) => {
      approvalLetter.value = event.target.files[0];
    };

    const handleCertificateUpload = (event) => {
      resourcePerson.certificate = event.target.files[0];
    };

    const handleCourseDocumentUpload = (event) => {
      courseDocument.value = event.target.files[0];
    };

    const handleAttendanceSheetUpload = (event) => {
      attendanceSheet.value = event.target.files[0];
    };
    const handleAttachmentUpload = (event) => {
      attachment.value = event.target.files[0];
    };

    const fetchResourcePersonDetails = async () => {
      // Simulate API call to get the details based on the registration number
      // Replace with your actual API endpoint
      // This is an example
      if (resourcePerson.regNo === dummyResourcePerson.regNo) {
        resourcePerson.name = dummyResourcePerson.name;
        resourcePerson.email = dummyResourcePerson.email;
        resourcePerson.contact = dummyResourcePerson.contact;
        resourcePerson.cid = dummyResourcePerson.cid;
      } else {
        resourcePerson.name = '';
        resourcePerson.email = '';
        resourcePerson.contact = '';
        resourcePerson.cid = '';
      }
    };

    const calculateCredit = () => {
      // Example: 1 credit per hour
      teachingMethod.credit = teachingMethod.duration || 0;
    };

    const addParticipant = () => {
      participants.value.push({ regNo: '', name: '' });
    };

    const fetchParticipantName = async (participant) => {
      if (participant.regNo) {
        setTimeout(() => {
          participant.name = `Participant Name for RegNo ${participant.regNo}`;
        }, 500);
      } else {
        participant.name = '';
      }
    };

    const saveDraft = () => {
      // Implement save as draft logic (e.g., save data to local storage or API)
      console.log('Saving as draft...', { applicant, application, cpdProvider, resourcePerson, teachingMethod, participantDetails, participants: participants.value });
    };

    const submitForm = () => {
      // Implement submit logic (e.g., send data to API)
      console.log('Submitting form...', { applicant, application, cpdProvider, resourcePerson, teachingMethod, participantDetails, participants: participants.value });
    };

    const cancelForm = () => {
      // Implement cancel logic (e.g., clear the form or redirect)
      console.log('Canceling form...');
    };

    const addTeachingMethod = () => {
      teachingMethods.value.push({ activity: '', duration: null });
    };

    const removeTeachingMethod = (index) => {
      teachingMethods.value.splice(index, 1);
    };

    onMounted(async () => {
      // Auto-fill applicant details from authStore
      applicant.cidNumber = authStore.user.cid;
      applicant.fullName = authStore.user.first_name + (authStore.user.middle_name ? ' ' + authStore.user.middle_name : '') + ' ' + authStore.user.last_name;

      // Fetch agency options from the API
      try {
        const agencyResponse = await apiservice.getProvidingAgency();
        agencyOptions.value = agencyResponse.data.results.map(agency => ({
          text: agency.name,
          value: agency.id
        }));

        // Fetch reason options from the API
        const reasonResponse = await apiservice.getReasonForCoducting();
        reasonOptions.value = reasonResponse.data.results.map(reason => ({
          text: reason.name,
          value: reason.id
        }));
        // Fetch CPD Type from the API
        const cpdTypeResponse = await apiservice.getMastersCmeActivities();
        cpdTypeOptions.value = cpdTypeResponse.data.results.map(cpdtypes => ({
          text: cpdtypes.cme_activity_name,
          value: cpdtypes.id
        }));

        // Fetch getMastersParticipationCategories from the API
        const participationCategoriesResponse = await apiservice.getMastersParticipationCategories();
        participationCategoryOptions.value = participationCategoriesResponse.data.results.map(participationCategory => ({
          text: participationCategory.participation_category_name,
          value: participationCategory.id
        }));
        // Fetch getMastersSubParticipationCategories from the API
        const participationSbuCategoriesResponse = await apiservice.getMastersParticipationSubCategories();
        participantSubcategoryOptions.value = participationSbuCategoriesResponse.data.results.map(participationSubCategory => ({
          text: participationSubCategory.participation_sub_category_name,
          value: participationSubCategory.id
        }));

      } catch (error) {
        console.error('Error fetching options:', error);
      }
    });

    return {
      applicant,
      application,
      cpdProvider,
      resourcePerson,
      teachingMethod,
      teachingMethods,
      participantDetails,
      participants,
      agencyOptions,
      reasonOptions,
      cpdTypeOptions,
      methodologyOptions,
      participationCategoryOptions,
      participantSubcategoryOptions,
      approvalLetter,
      courseDocument,
      attendanceSheet,
      attachment,
      toggleApprovedFields,
      handleApprovalLetterUpload,
      handleCertificateUpload,
      handleCourseDocumentUpload,
      handleAttendanceSheetUpload,
      handleAttachmentUpload,
      fetchResourcePersonDetails,
      calculateCredit,
      addParticipant,
      fetchParticipantName,
      saveDraft,
      submitForm,
      cancelForm,
      isCpdApproved,
      addTeachingMethod,
      removeTeachingMethod,
    };
  },
};
</script>
<style scoped>
/* Basic styling for the form */
.cpd-application-form {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.cpd-application-form h2 {
  margin-top: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.form-row {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.form-row label {
  width: 200px;
  display: inline-block;
  text-align: right;
  margin-right: 10px;
}

.form-row input[type="text"],
.form-row input[type="number"],
.form-row input[type="date"],
.form-row select {
  width: 300px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  margin-top: 20px;
  text-align: center;
}

.form-actions button {
  padding: 10px 20px;
  margin: 0 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-actions button:hover {
  background-color: #3e8e41;
}

.participant-row {
  border: 1px solid #eee;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
}

.form-row input[readonly] {
  background-color: #f0f0f0;
  cursor: not-allowed;
}
</style>
