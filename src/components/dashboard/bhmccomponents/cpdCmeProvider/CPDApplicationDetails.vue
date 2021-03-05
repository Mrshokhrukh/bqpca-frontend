<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Form Header -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10 shadow-lg">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        CPD Application Form
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Provide the necessary details for your CPD application.
      </p>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl">
        <div class="flex items-center">
          <svg class="animate-spin h-8 w-8 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          <p class="text-lg font-medium text-gray-700">Processing your request...</p>
        </div>
      </div>
    </div>

    <!-- Validation Error Messages -->
    <div v-if="validationErrors.length > 0"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <h3 class="font-bold">Please fix the following errors:</h3>
      <ul class="list-disc pl-5 mt-2">
        <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
      </ul>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      <p>{{ successMessage }}</p>
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
          <label class="block text-sm font-medium text-gray-700">Registration Number <span
              class="text-red-500">*</span></label>

          <select v-model="applicant.registrationNumber"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
            <option value="">Select Registration Number</option>
            <option v-for="reg in userRegistrations" :key="reg.registration_no" :value="reg.registration_no">
              {{ reg.registration_no }} - {{ reg.full_name }}
            </option>
          </select>

          <p v-if="userRegistrations.length === 0" class="mt-1 text-sm text-red-600">
            No valid registration numbers found. Please ensure you are registered in the system.
          </p>

          <p v-else class="mt-1 text-xs text-gray-500">
            Please select from available registration numbers
          </p>
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
          <label class="block text-sm font-medium text-gray-700">Agency/Training Location <span
              class="text-red-500">*</span></label>
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
          <label class="block text-sm font-medium text-gray-700">Is CPD approved? <span
              class="text-red-500">*</span></label>
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
          <label for="approvalLetter" class="block text-sm font-medium text-gray-700">Attach Approval Letter <span
              class="text-red-500">*</span></label>
          <input type="file" id="approvalLetter" @change="handleApprovalLetterUpload"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          <p class="text-xs text-gray-500 mt-1">Accepted file format: PDF (max 5MB)</p>
        </div>

        <!-- CPD Details (if not approved) -->
        <template v-if="application.isApproved === 'false'">
          <!-- Title of CPD -->
          <div class="col-span-1">
            <label for="title" class="block text-sm font-medium text-gray-700">Title of CPD <span
                class="text-red-500">*</span></label>
            <input type="text" id="title" v-model="application.title"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
          </div>

          <!-- Venue -->
          <div class="col-span-1">
            <label for="venue" class="block text-sm font-medium text-gray-700">Venue <span
                class="text-red-500">*</span></label>
            <input type="text" id="venue" v-model="application.venue"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
          </div>

          <!-- From Date -->
          <div class="col-span-1">
            <label for="fromDate" class="block text-sm font-medium text-gray-700">From Date <span
                class="text-red-500">*</span></label>
            <input type="date" id="fromDate" v-model="application.fromDate"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
          </div>

          <!-- To Date -->
          <div class="col-span-1">
            <label for="toDate" class="block text-sm font-medium text-gray-700">To Date <span
                class="text-red-500">*</span></label>
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
          <label for="providingAgency" class="block text-sm font-medium text-gray-700">CPD Providing Agency <span
              class="text-red-500">*</span></label>
          <select id="providingAgency" v-model="cpdProvider.agency"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
            <option value="">Select Agency</option>
            <option v-for="agency in agencyOptions" :key="agency.value" :value="agency.value">
              {{ agency.text }} (ID: {{ agency.value }})
            </option>
            <option value="other">Other</option>
          </select>

          <p v-if="agencyOptions.length === 0" class="mt-1 text-sm text-red-600">
            No agencies found. Please try refreshing the page.
          </p>

          <div v-if="cpdProvider.agency && cpdProvider.agency !== 'other'" class="mt-1 text-xs text-gray-500">
            Selected agency ID: {{ cpdProvider.agency }}
          </div>
        </div>

        <!-- If Others (Specify) -->
        <div v-if="cpdProvider.agency === 'other'" class="col-span-1">
          <label for="otherAgency" class="block text-sm font-medium text-gray-700">Specify Other Agency <span
              class="text-red-500">*</span></label>
          <input type="text" id="otherAgency" v-model="cpdProvider.otherAgency"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
        </div>

        <!-- Reason for Conducting -->
        <div class="col-span-1">
          <label for="reasonConducting" class="block text-sm font-medium text-gray-700">Reason for Conducting <span
              class="text-red-500">*</span></label>
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
          <label for="reasonDetails" class="block text-sm font-medium text-gray-700">Reason Details <span
              class="text-red-500">*</span></label>
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

      <div class="p-8">
        <div v-for="(person, personIndex) in resourcePersons" :key="personIndex" class="mb-6 p-4 border rounded-lg">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- RegNo -->
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700">Registration Number <span
                  class="text-red-500">*</span></label>
              <input type="text" v-model="person.regNo" @blur="fetchResourcePersonDetails(person)"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
            </div>

            <!-- Name -->
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" v-model="person.name" readonly
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
            </div>
          </div>

          <div class="mt-4 flex justify-end">
            <button v-if="personIndex > 0" @click="removeResourcePerson(personIndex)"
              class="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
              Remove
            </button>
          </div>
        </div>

        <div class="flex justify-start mb-6">
          <button @click="addResourcePerson"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Add Resource Person
          </button>
        </div>

        <!-- Certificates -->
        <div class="col-span-1">
          <label for="certificates" class="block text-sm font-medium text-gray-700">Document supporting expertise of
            CPD <span class="text-red-500">*</span></label>
          <input type="file" id="certificates" @change="handleCertificateUpload"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          <p class="text-xs text-gray-500 mt-1">Accepted file format: PDF (max 5MB)</p>
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
          <label for="typeCPD" class="block text-sm font-medium text-gray-700">Type of CPD <span
              class="text-red-500">*</span></label>
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
          <label class="block text-sm font-medium text-gray-700">Methodologies <span
              class="text-red-500">*</span></label>
          <div class="mt-2">
            <div v-for="method in methodologyOptions" :key="method.value" class="flex items-center mb-2">
              <input type="checkbox" :id="'method-' + method.value" v-model="selectedMethodologies"
                :value="method.value" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label :for="'method-' + method.value" class="ml-2 block text-sm text-gray-700">{{ method.text }}</label>
            </div>
          </div>
        </div>

        <!-- Expected Outcome -->
        <div class="col-span-1">
          <label for="expectedOutcome" class="block text-sm font-medium text-gray-700">
            Objective/Expected Outcome <span class="text-red-500">*</span>
          </label>
          <textarea id="expectedOutcome" v-model="teachingMethod.expectedOutcome"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            rows="4"></textarea>
        </div>

        <!-- Activity and Duration in Hours -->
        <div class="col-span-2">
          <h4 class="text-md font-medium mb-2">Learning Activities and Duration</h4>
          <div v-for="(method, index) in teachingMethods" :key="index" class="flex space-x-4 mb-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700">Activity <span
                  class="text-red-500">*</span></label>
              <input type="text" v-model="method.activity"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700">Duration in Hours <span
                  class="text-red-500">*</span></label>
              <input type="number" v-model.number="method.duration" @input="calculateTotalHours"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
            </div>
            <button @click="removeTeachingMethod(index)"
              class="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">Remove</button>
          </div>
          <button @click="addTeachingMethod"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">Add New
            Row</button>

          <div class="mt-4 p-3 bg-blue-50 rounded-lg">
            <p class="font-medium">Total Hours: {{ totalHours }}</p>
            <p>Calculated CPD Credits: {{ calculatedCredits }}</p>
          </div>
        </div>

        <!-- Course Document -->
        <div class="col-span-1">
          <label for="courseDocument" class="block text-sm font-medium text-gray-700">Course Document <span
              class="text-red-500">*</span></label>
          <input type="file" id="courseDocument" @change="handleCourseDocumentUpload"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          <p class="text-xs text-gray-500 mt-1">Accepted file format: PDF (max 5MB)</p>
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
            Category <span class="text-red-500">*</span></label>
          <select id="participationCategory" v-model="participantDetails.category" @change="loadSubcategories"
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
            sub-category <span class="text-red-500">*</span></label>
          <select id="participantSubcategory" v-model="participantDetails.subcategory"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
            <option value="">Select Sub-Category</option>
            <option v-for="subcategory in filteredSubcategories" :key="subcategory.value" :value="subcategory.value">
              {{ subcategory.text }}
            </option>
          </select>
        </div>

        <!-- Number of Participants -->
        <div class="col-span-1">
          <label for="numberParticipants" class="block text-sm font-medium text-gray-700">Number of Participants <span
              class="text-red-500">*</span></label>
          <input type="number" id="numberParticipants" v-model.number="participantDetails.number"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
        </div>

        <!-- Relevance to your profession -->
        <div class="col-span-1">
          <label for="relevanceProfession" class="block text-sm font-medium text-gray-700">
            Relevance to profession <span class="text-red-500">*</span>
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
            <label for="attachment" class="block text-sm font-medium text-gray-700">Attachment <span
                class="text-red-500">*</span></label>
            <input type="file" id="attachment" @change="handleAttachmentUpload"
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            <p class="text-xs text-gray-500 mt-1">Accepted file format: PDF (max 5MB)</p>
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
                <label class="block text-sm font-medium text-gray-700">RegNo</label>
                <input type="text" v-model="participant.regNo" @blur="fetchParticipantName(participant)"
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
              </div>

              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" v-model="participant.name" readonly
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
              </div>
            </div>

            <div class="mt-2 flex justify-end">
              <button @click="removeParticipant(index)"
                class="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
                Remove
              </button>
            </div>
          </div>
          <button @click="addParticipant"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">Add
            More</button>

          <!-- Attendance Sheet -->
          <div class="mt-6">
            <label for="attendanceSheet" class="block text-sm font-medium text-gray-700">Attendance Sheet <span
                class="text-red-500">*</span></label>
            <input type="file" id="attendanceSheet" @change="handleAttendanceSheetUpload"
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            <p class="text-xs text-gray-500 mt-1">Accepted file format: PDF (max 5MB)</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-12 flex justify-end space-x-4 p-8">
        <button @click="saveDraft" :disabled="loading"
          class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          Save as Draft
        </button>
        <button @click="handleSubmit" :disabled="loading"
          class="px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          Submit
        </button>
        <button @click="cancelForm" :disabled="loading"
          class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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
          <button @click="showConfirmation = false" :disabled="loading"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            Cancel
          </button>
          <button @click="confirmSubmit" :disabled="loading"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
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
import { useRouter } from 'vue-router';
import apiservice from '@/services/bmhcservices';
import apiClient from '@/services/apiClient';

export default {
  name: 'CpdApplicationForm',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    // Reactive States
    const loading = ref(false);
    const showConfirmation = ref(false);
    const validationErrors = ref([]);
    const successMessage = ref('');
    const userRegistrations = ref([]);

    // Applicant details
    const applicant = reactive({
      registrationNumber: '',
      cidNumber: '',
      fullName: '',
      agencyTrainingLocation: '',
    });

    // Application details
    const application = reactive({
      isApproved: 'false',
      title: '',
      venue: '',
      fromDate: '',
      toDate: '',
    });

    // CPD Provider details
    const cpdProvider = reactive({
      agency: '',
      otherAgency: '',
      reason: '',
      reasonDetails: '',
    });

    // Resource Persons
    const resourcePersons = ref([
      { regNo: '', name: '' }
    ]);

    const resourcePersonCertificate = ref(null);

    // Teaching Method details
    const teachingMethod = reactive({
      type: '',
      expectedOutcome: '',
    });

    // Selected methodologies (multiple)
    const selectedMethodologies = ref([]);

    const teachingMethods = ref([{ activity: '', duration: null }]);
    const totalHours = ref(0);
    const calculatedCredits = ref(0);

    // Participant details
    const participantDetails = reactive({
      category: '',
      subcategory: '',
      number: null,
      relevance: '',
    });

    // Participants list for approved CPD
    const participants = ref([]);

    // File uploads
    const approvalLetter = ref(null);
    const courseDocument = ref(null);
    const attendanceSheet = ref(null);
    const attachment = ref(null);

    // Options for dropdowns
    const agencyOptions = ref([]);
    const reasonOptions = ref([]);
    const cpdTypeOptions = ref([]);
    const methodologyOptions = ref([]);
    const participationCategoryOptions = ref([]);
    const participantSubcategoryOptions = ref([]);

    // Computed
    const isCpdApproved = computed(() => application.isApproved === 'true');

    const filteredSubcategories = computed(() => {
      if (!participantDetails.category) return [];

      return participantSubcategoryOptions.value.filter(
        subcategory => subcategory.categoryId === parseInt(participantDetails.category)
      );
    });

    // Methods
    const toggleApprovedFields = () => {
      if (application.isApproved === 'true') {
        // Clear fields related to non-approved CPD
        application.title = '';
        application.venue = '';
        application.fromDate = '';
        application.toDate = '';
      } else {
        // Clear fields related to approved CPD
        approvalLetter.value = null;
        attachment.value = null;
      }
    };

    const handleApprovalLetterUpload = (event) => {
      const file = event.target.files[0];
      if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
        approvalLetter.value = file;
      } else {
        alert('Please upload a PDF file less than 5MB');
        event.target.value = '';
      }
    };

    const handleCertificateUpload = (event) => {
      const file = event.target.files[0];
      if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
        resourcePersonCertificate.value = file;
      } else {
        alert('Please upload a PDF file less than 5MB');
        event.target.value = '';
      }
    };

    const handleCourseDocumentUpload = (event) => {
      const file = event.target.files[0];
      if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
        courseDocument.value = file;
      } else {
        alert('Please upload a PDF file less than 5MB');
        event.target.value = '';
      }
    };

    const handleAttendanceSheetUpload = (event) => {
      const file = event.target.files[0];
      if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
        attendanceSheet.value = file;
      } else {
        alert('Please upload a PDF file less than 5MB');
        event.target.value = '';
      }
    };

    const handleAttachmentUpload = (event) => {
      const file = event.target.files[0];
      if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
        attachment.value = file;
      } else {
        alert('Please upload a PDF file less than 5MB');
        event.target.value = '';
      }
    };

    const fetchResourcePersonDetails = async (person) => {
      if (!person.regNo) return;

      try {
        loading.value = true;

        // First try approach - Use the application list and find by registration number
        const response = await apiservice.getApplicationsByCid('');

        if (response.data && Array.isArray(response.data)) {
          // Find the application with matching registration number
          const matchingApplication = response.data.find(app => app.registration_no === person.regNo);

          if (matchingApplication) {
            person.name = matchingApplication.full_name || 'Unknown';
          } else {
            // If not found, allow manual entry
            const manualName = prompt(`Resource person with registration number ${person.regNo} not found. Please enter the name manually:`);
            if (manualName) {
              person.name = manualName;
            } else {
              person.name = '';
            }
          }
        } else {
          // Allow manual entry if API doesn't return expected format
          const manualName = prompt(`Please enter name for resource person with registration number ${person.regNo}:`);
          if (manualName) {
            person.name = manualName;
          } else {
            person.name = '';
          }
        }
      } catch (error) {
        console.error('Error fetching resource person details:', error);

        // Allow manual entry if there's an error
        const manualName = prompt(`Could not fetch details for registration number ${person.regNo}. Please enter the name manually:`);
        if (manualName) {
          person.name = manualName;
        } else {
          person.name = '';
        }
      } finally {
        loading.value = false;
      }
    };

    const addResourcePerson = () => {
      resourcePersons.value.push({ regNo: '', name: '' });
    };

    const removeResourcePerson = (index) => {
      resourcePersons.value.splice(index, 1);
    };

    const calculateTotalHours = () => {
      let totalHoursValue = 0;
      teachingMethods.value.forEach(method => {
        if (method.duration && !isNaN(method.duration)) {
          totalHoursValue += Number(method.duration);
        }
      });

      totalHours.value = totalHoursValue;

      // Calculate credits (1 credit per hour)
      calculatedCredits.value = totalHoursValue;
    };

    const addTeachingMethod = () => {
      teachingMethods.value.push({ activity: '', duration: null });
    };

    const removeTeachingMethod = (index) => {
      teachingMethods.value.splice(index, 1);
      calculateTotalHours();
    };

    const loadSubcategories = async () => {
      if (!participantDetails.category) return;

      try {
        // Fetch subcategories related to the selected category
        // Note: In a real implementation, you might need to fetch filtered subcategories from the API
        // Here we're assuming the subcategories are already loaded and we're just filtering them
      } catch (error) {
        console.error('Error loading subcategories:', error);
      }
    };

    const addParticipant = () => {
      participants.value.push({ regNo: '', name: '' });
    };

    const removeParticipant = (index) => {
      participants.value.splice(index, 1);
    };

    const fetchParticipantName = async (participant) => {
      if (!participant.regNo) return;

      try {
        loading.value = true;

        // First try approach - Use the application list and find by registration number
        const response = await apiservice.getApplicationsByCid('');

        if (response.data && Array.isArray(response.data)) {
          // Find the application with matching registration number
          const matchingApplication = response.data.find(app => app.registration_no === participant.regNo);

          if (matchingApplication) {
            participant.name = matchingApplication.full_name || 'Unknown';
          } else {
            // If not found, allow manual entry
            const manualName = prompt(`Participant with registration number ${participant.regNo} not found. Please enter the name manually:`);
            if (manualName) {
              participant.name = manualName;
            } else {
              participant.name = '';
            }
          }
        } else {
          // Allow manual entry if API doesn't return expected format
          const manualName = prompt(`Please enter name for participant with registration number ${participant.regNo}:`);
          if (manualName) {
            participant.name = manualName;
          } else {
            participant.name = '';
          }
        }
      } catch (error) {
        console.error('Error fetching participant name:', error);

        // Allow manual entry if there's an error
        const manualName = prompt(`Could not fetch details for registration number ${participant.regNo}. Please enter the name manually:`);
        if (manualName) {
          participant.name = manualName;
        } else {
          participant.name = '';
        }
      } finally {
        loading.value = false;
      }
    };

    const validateForm = () => {
      console.log('function triggered')
      validationErrors.value = [];

      // Validate applicant details
      if (!applicant.registrationNumber) {
        validationErrors.value.push('Registration Number is required');
      }

      if (!applicant.agencyTrainingLocation) {
        validationErrors.value.push('Agency/Training Location is required');
      }

      // Validate application details
      if (application.isApproved === 'true') {
        if (!approvalLetter.value) {
          validationErrors.value.push('Approval Letter is required');
        }
      } else {
        if (!application.title) {
          validationErrors.value.push('Title of CPD is required');
        }

        if (!application.venue) {
          validationErrors.value.push('Venue is required');
        }

        if (!application.fromDate) {
          validationErrors.value.push('From Date is required');
        }

        if (!application.toDate) {
          validationErrors.value.push('To Date is required');
        }

        if (application.fromDate && application.toDate && new Date(application.fromDate) > new Date(application.toDate)) {
          validationErrors.value.push('From Date cannot be later than To Date');
        }
      }

      // Validate CPD provider details
      if (!cpdProvider.agency) {
        validationErrors.value.push('CPD Providing Agency is required');
      }

      if (cpdProvider.agency === 'other' && !cpdProvider.otherAgency) {
        validationErrors.value.push('Please specify the Other Agency');
      }

      if (!cpdProvider.reason) {
        validationErrors.value.push('Reason for Conducting is required');
      }

      if (!cpdProvider.reasonDetails) {
        validationErrors.value.push('Reason Details are required');
      }

      // Validate resource persons
      let hasResourcePersons = false;
      for (const person of resourcePersons.value) {
        if (person.regNo) {
          hasResourcePersons = true;
          break;
        }
      }

      if (!hasResourcePersons) {
        validationErrors.value.push('At least one Resource Person is required');
      }

      if (!resourcePersonCertificate.value) {
        validationErrors.value.push('Document supporting expertise of CPD is required');
      }

      // Validate teaching method
      if (!teachingMethod.type) {
        validationErrors.value.push('Type of CPD is required');
      }

      if (selectedMethodologies.value.length === 0) {
        validationErrors.value.push('At least one Methodology must be selected');
      }

      if (!teachingMethod.expectedOutcome) {
        validationErrors.value.push('Expected Outcome is required');
      }

      // Validate teaching methods list
      let hasValidTeachingMethod = false;
      for (const method of teachingMethods.value) {
        if (method.activity && method.duration) {
          hasValidTeachingMethod = true;
          break;
        }
      }

      if (!hasValidTeachingMethod) {
        validationErrors.value.push('At least one Teaching Method with activity and duration is required');
      }

      if (!courseDocument.value) {
        validationErrors.value.push('Course Document is required');
      }

      // Validate participant details
      if (!participantDetails.category) {
        validationErrors.value.push('Participation Category is required');
      }

      if (!participantDetails.subcategory) {
        validationErrors.value.push('Participant sub-category is required');
      }

      if (!participantDetails.number || participantDetails.number <= 0) {
        validationErrors.value.push('Number of Participants must be greater than 0');
      }

      if (!participantDetails.relevance) {
        validationErrors.value.push('Relevance to profession is required');
      }

      // Validate specific fields for approved CPD
      if (application.isApproved === 'true') {
        if (!attachment.value) {
          validationErrors.value.push('Attachment is required for approved CPD');
        }

        if (isCpdApproved.value && !attendanceSheet.value) {
          validationErrors.value.push('Attendance Sheet is required for approved CPD');
        }
      }

      return validationErrors.value.length === 0;
    };

    const prepareFormData = (isDraft = false) => {
      const formData = new FormData();

      // Add applicant details
      formData.append('registration_no', applicant.registrationNumber);
      formData.append('cid_no', applicant.cidNumber);
      formData.append('full_name', applicant.fullName);
      formData.append('proposed_training_location', applicant.agencyTrainingLocation);

      // Add application details
      formData.append('is_cpd_approved', application.isApproved === 'true');

      if (application.isApproved === 'false') {
        formData.append('title_of_cpd', application.title);
        formData.append('venue', application.venue);
        formData.append('from_date', application.fromDate);
        formData.append('to_date', application.toDate);
      }

      // Add CPD provider details - ensure we send numeric IDs
      if (cpdProvider.agency && cpdProvider.agency !== 'other') {
        // Parse as integer to ensure we send a numeric ID
        formData.append('cpd_providing_agency', parseInt(cpdProvider.agency, 10));
      } else if (cpdProvider.agency === 'other') {
        // If "other" is selected, we need to handle this differently
        // The backend might have a special way to handle this case
        formData.append('if_others_specify', cpdProvider.otherAgency || '');
      }

      // Parse reason as integer too
      if (cpdProvider.reason) {
        formData.append('reason_for_conducting', parseInt(cpdProvider.reason, 10));
      }
      formData.append('reason_for_details', cpdProvider.reasonDetails);

      // Add resource persons as a JSON string
      const resourcePersonsData = resourcePersons.value
        .filter(person => person.regNo && person.name)
        .map(person => ({
          resource_person_reg_no: person.regNo,
          resource_person_name: person.name,
          cpd_task: null  // The backend will replace this with the actual ID
        }));

      formData.append('resources', JSON.stringify(resourcePersonsData));

      // Add teaching method details
      formData.append('type_of_cpd', teachingMethod.type);
      formData.append('expected_outcome', teachingMethod.expectedOutcome);

      // Create a JSON string for methodologies instead of individual fields
      const methodologiesData = selectedMethodologies.value.map(methodId => ({
        methodology_name: methodId,
        cpd_task: null  // The backend will replace this with the actual ID
      }));

      formData.append('methodologies', JSON.stringify(methodologiesData));

      // Create a JSON string for learning methods instead of individual fields
      const learningMethodsData = teachingMethods.value
        .filter(method => method.activity && method.duration)
        .map(method => ({
          activities: method.activity,
          duration: method.duration,
          cpd_task: null  // The backend will replace this with the actual ID
        }));

      formData.append('learning_methods', JSON.stringify(learningMethodsData));

      // Add participant details
      formData.append('number_of_participants', participantDetails.number || 0);
      formData.append('relevance_to_topic', participantDetails.relevance || '');

      // Add participants as a JSON string
      if (isCpdApproved.value && participants.value.length > 0) {
        const participantsData = participants.value
          .filter(participant => participant.regNo && participant.name)
          .map(participant => ({
            participant_reg_no: participant.regNo,
            cpd_credits: calculatedCredits.value,
            review_status: 'Pending',
            cpd_task: null  // The backend will replace this with the actual ID
          }));

        formData.append('participants', JSON.stringify(participantsData));
      }

      // Mark as draft or not
      formData.append('is_draft', isDraft);

      // Add file uploads
      if (approvalLetter.value) {
        formData.append('attachment', approvalLetter.value);
      }

      if (resourcePersonCertificate.value) {
        formData.append('document_supporting_expertise', resourcePersonCertificate.value);
      }

      if (courseDocument.value) {
        formData.append('course_document', courseDocument.value);
      }

      if (attendanceSheet.value) {
        formData.append('attendance_sheet_attachment', attendanceSheet.value);
      }

      if (attachment.value) {
        formData.append('attachment', attachment.value);
      }

      // Log formData for debugging
      console.log('Form data prepared:', formData);

      // Log each key-value pair in the FormData
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      return formData;
    };

    const saveDraft = async () => {
      try {
        loading.value = true;
        validationErrors.value = [];

        // Prepare form data
        const formData = prepareFormData(true);

        // Send to API
        const response = await apiservice.createBmhcCpdTask(formData);
        console.log('Draft saved successfully', response.data);

        // Show success message
        successMessage.value = 'Draft saved successfully!';

        // Reset form or redirect
        setTimeout(() => {
          // router.push('/dashboard/cpd-tracker');
          successMessage.value = '';
        }, 3000);
      } catch (error) {
        console.error('Error saving draft:', error);

        // Handle validation errors from backend
        if (error.response && error.response.data) {
          const errorData = error.response.data;

          // Extract error messages
          const errorMessages = [];

          // Function to recursively extract error messages from nested objects
          const extractErrors = (obj, prefix = '') => {
            if (typeof obj === 'string') {
              errorMessages.push(`${prefix}: ${obj}`);
            } else if (Array.isArray(obj)) {
              obj.forEach(item => {
                if (typeof item === 'string') {
                  errorMessages.push(`${prefix}: ${item}`);
                } else if (typeof item === 'object') {
                  extractErrors(item, prefix);
                }
              });
            } else if (typeof obj === 'object' && obj !== null) {
              Object.keys(obj).forEach(key => {
                const newPrefix = prefix ? `${prefix}.${key}` : key;
                extractErrors(obj[key], newPrefix);
              });
            }
          };

          extractErrors(errorData);

          if (errorMessages.length > 0) {
            validationErrors.value = errorMessages;
          } else {
            validationErrors.value = ['Error saving draft. Please check all fields.'];
          }
        } else {
          validationErrors.value = ['Error saving draft. Please try again.'];
        }
      } finally {
        loading.value = false;
      }
    };

    const handleSubmit = () => {
      validateForm()
      if (validationErrors.value) {
        console.log(validationErrors.value)
        showConfirmation.value = true;
      } else {
        // Scroll to the top to show validation errors
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const confirmSubmit = async () => {
      showConfirmation.value = false;

      try {
        loading.value = true;
        validationErrors.value = [];

        // Prepare form data
        const formData = prepareFormData(false);

        // Send to API
        const response = await apiservice.createBmhcCpdTask(formData);
        console.log('Form submitted successfully', response.data);

        // Show success message
        successMessage.value = 'CPD application submitted successfully!';

        // Reset form or redirect
        setTimeout(() => {
          router.push('/dashboard/cpd-tracker');
        }, 2000);
      } catch (error) {
        console.error('Error submitting form:', error);

        // Handle validation errors from backend
        if (error.response && error.response.data) {
          const errorData = error.response.data;

          // Extract error messages
          const errorMessages = [];

          // Function to recursively extract error messages from nested objects
          const extractErrors = (obj, prefix = '') => {
            if (typeof obj === 'string') {
              errorMessages.push(`${prefix}: ${obj}`);
            } else if (Array.isArray(obj)) {
              obj.forEach(item => {
                if (typeof item === 'string') {
                  errorMessages.push(`${prefix}: ${item}`);
                } else if (typeof item === 'object') {
                  extractErrors(item, prefix);
                }
              });
            } else if (typeof obj === 'object' && obj !== null) {
              Object.keys(obj).forEach(key => {
                const newPrefix = prefix ? `${prefix}.${key}` : key;
                extractErrors(obj[key], newPrefix);
              });
            }
          };

          extractErrors(errorData);

          if (errorMessages.length > 0) {
            validationErrors.value = errorMessages;
          } else {
            validationErrors.value = ['Error submitting form. Please check all fields.'];
          }
        } else {
          validationErrors.value = ['Error submitting form. Please try again.'];
        }

        // Scroll to the top to show validation errors
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } finally {
        loading.value = false;
      }
    };

    const cancelForm = () => {
      // Navigate back or to a specific route
      router.push('/dashboard');
    };

    const fetchUserRegistrations = async () => {
      try {
        loading.value = true;
        // First try to get registrations by user's CID
        const response = await apiservice.getApplicationsByCid(applicant.cidNumber);

        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          userRegistrations.value = response.data;

          // If there are registrations, set the first one as default
          if (userRegistrations.value.length > 0) {
            applicant.registrationNumber = userRegistrations.value[0].registration_no;
          }
        } else {
          // If no registrations found for user CID, fetch all applications as a fallback
          const allApplicationsResponse = await apiservice.getBhmcNewApplications();

          if (allApplicationsResponse.data && allApplicationsResponse.data.results &&
            Array.isArray(allApplicationsResponse.data.results)) {
            userRegistrations.value = allApplicationsResponse.data.results.map(app => ({
              id: app.id,
              registration_no: app.registration_no,
              full_name: app.full_name
            }));

            // Sort alphabetically by name for easier reference
            userRegistrations.value.sort((a, b) => a.full_name.localeCompare(b.full_name));

            if (userRegistrations.value.length > 0) {
              applicant.registrationNumber = userRegistrations.value[0].registration_no;
            }

            console.log('Available registrations:', userRegistrations.value);
          }
        }
      } catch (error) {
        console.error('Error fetching user registrations:', error);
        validationErrors.value = ['Could not fetch available registrations. Please try again.'];
      } finally {
        loading.value = false;
      }
    };

    const loadDropdownOptions = async () => {
      try {
        loading.value = true;

        // Fetch CPD Providing Agencies
        const agencyResponse = await apiservice.getProvidingAgency();
        if (agencyResponse.data && agencyResponse.data.results) {
          agencyOptions.value = agencyResponse.data.results.map(agency => ({
            text: agency.name,
            value: agency.id
          }));

          // Log available agencies for debugging
          console.log('Available CPD providing agencies:', agencyOptions.value);
        }

        // Fetch Reasons for Conducting
        const reasonResponse = await apiservice.getReasonForCoducting();
        if (reasonResponse.data && reasonResponse.data.results) {
          reasonOptions.value = reasonResponse.data.results.map(reason => ({
            text: reason.name,
            value: reason.id
          }));
        }

        // Fetch CPD Types
        const cpdTypeResponse = await apiservice.getMastersCmeActivities();
        if (cpdTypeResponse.data && cpdTypeResponse.data.results) {
          cpdTypeOptions.value = cpdTypeResponse.data.results.map(type => ({
            text: type.cme_activity_name,
            value: type.id
          }));
        }

        // Fetch CME Methodologies
        const methodologyResponse = await apiservice.getMastersCmeMethodologies();
        if (methodologyResponse.data && methodologyResponse.data.results) {
          methodologyOptions.value = methodologyResponse.data.results.map(method => ({
            text: method.methodology_name,
            value: method.id
          }));
        }

        // Fetch Participation Categories
        const categoriesResponse = await apiservice.getMastersParticipationCategories();
        if (categoriesResponse.data && categoriesResponse.data.results) {
          participationCategoryOptions.value = categoriesResponse.data.results.map(category => ({
            text: category.participation_category_name,
            value: category.id
          }));
        }

        // Fetch Participation Subcategories
        const subcategoriesResponse = await apiservice.getMastersParticipationSubCategories();
        if (subcategoriesResponse.data && subcategoriesResponse.data.results) {
          participantSubcategoryOptions.value = subcategoriesResponse.data.results.map(subcategory => ({
            text: subcategory.participation_sub_category_name,
            value: subcategory.id,
            categoryId: subcategory.participation_category_name
          }));
        }
      } catch (error) {
        console.error('Error loading dropdown options:', error);
        validationErrors.value = ['Error loading form data. Please refresh the page.'];
      } finally {
        loading.value = false;
      }
    };

    onMounted(async () => {
      // Auto-fill applicant details from authStore
      applicant.cidNumber = authStore.user?.cid || '';
      applicant.fullName = [
        authStore.user?.first_name || '',
        authStore.user?.middle_name || '',
        authStore.user?.last_name || ''
      ].filter(Boolean).join(' ');

      // Fetch user registrations
      await fetchUserRegistrations();

      // Load dropdown options
      await loadDropdownOptions();
    });

    return {
      // State
      loading,
      showConfirmation,
      validationErrors,
      successMessage,
      userRegistrations,
      applicant,
      application,
      cpdProvider,
      resourcePersons,
      resourcePersonCertificate,
      teachingMethod,
      selectedMethodologies,
      teachingMethods,
      totalHours,
      calculatedCredits,
      participantDetails,
      participants,
      approvalLetter,
      courseDocument,
      attendanceSheet,
      attachment,
      agencyOptions,
      reasonOptions,
      cpdTypeOptions,
      methodologyOptions,
      participationCategoryOptions,
      participantSubcategoryOptions,
      filteredSubcategories,
      isCpdApproved,

      // Methods
      toggleApprovedFields,
      handleApprovalLetterUpload,
      handleCertificateUpload,
      handleCourseDocumentUpload,
      handleAttendanceSheetUpload,
      handleAttachmentUpload,
      fetchResourcePersonDetails,
      addResourcePerson,
      removeResourcePerson,
      calculateTotalHours,
      addTeachingMethod,
      removeTeachingMethod,
      loadSubcategories,
      addParticipant,
      removeParticipant,
      fetchParticipantName,
      saveDraft,
      handleSubmit,
      confirmSubmit,
      cancelForm,
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
