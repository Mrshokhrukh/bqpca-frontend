<template>
  <div class="container mx-auto p-4 md:p-6 bg-gray-50 min-h-screen relative">
    <h1 class="text-3xl font-bold mb-8 text-center text-blue-700">CPD Provider Application Form</h1>

    <div v-if="loading" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      <p class="ml-4 text-white text-xl">Processing...</p>
    </div>

    <div v-if="validationErrors.length > 0 || successMessage" class="mb-6 space-y-3">
      <div v-if="validationErrors.length > 0"
        class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow" role="alert">
        <p class="font-bold">Please correct the following errors:</p>
        <ul class="mt-2 list-disc list-inside text-sm">
          <li v-for="(error, index) in validationErrors" :key="`error-${index}`">{{ error }}</li>
        </ul>
      </div>
      <div v-if="successMessage"
        class="bg-green-100 border-l-4 border-green-500 text-green-700 p-6 rounded-lg shadow-lg flex items-center space-x-3 transition-all duration-300"
        role="alert">
        <svg class="h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <div>
          <p class="font-bold text-lg">Application Submitted Successfully!</p>
          <p class="text-sm">{{ successMessage }}</p>
        </div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <section class="p-6 bg-white shadow-lg rounded-lg">
        <h2 class="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">1. Applicant Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">CID No./Identity/Work Permit No.</label>
            <input type="text" :value="applicant.cidNumber" disabled
              class="mt-1 block w-full bg-gray-100 rounded-md border-gray-300 shadow-sm sm:text-sm p-2"
              placeholder="Auto-filled from login">
          </div>
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" :value="applicant.fullName" disabled
              class="mt-1 block w-full bg-gray-100 rounded-md border-gray-300 shadow-sm sm:text-sm p-2"
              placeholder="Auto-filled from login">
          </div>
          <div class="md:col-span-2">
            <label for="agencyTrainingLocation"
              class="block text-sm font-medium text-gray-700">Agency/Training Location <span
                class="text-red-500">*</span></label>
            <input type="text" id="agencyTrainingLocation" v-model="applicant.agencyTrainingLocation"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
            <p v-if="applicantDetailsErrors.agencyTrainingLocation" class="mt-1 text-xs text-red-500">{{
              applicantDetailsErrors.agencyTrainingLocation }}</p>
          </div>
        </div>
      </section>

      <section class="p-6 bg-white shadow-lg rounded-lg">
        <h2 class="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">2. Application Details</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Is this CPD approved by KYGUMBS or an
              International Agency? <span class="text-red-500">*</span></label>
            <div class="mt-2 space-x-4">
              <label class="inline-flex items-center">
                <input type="radio" v-model="application.isApproved" value="true" name="isCpdApproved"
                  @change="toggleApprovedFields" class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300">
                <span class="ml-2 text-sm text-gray-700">Yes</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" v-model="application.isApproved" value="false" name="isCpdApproved"
                  @change="toggleApprovedFields" class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300">
                <span class="ml-2 text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>

                <div class="space-y-6">
                  <div>
                    <!-- Approval Letter: only if approved -->
                    <div
                      v-if="application.isApproved === 'true'"
                      class="bg-indigo-50 p-4 rounded-lg border border-indigo-200"
                    >
                      <label for="approvalLetter" class="form-label"
                        >Attach Approval Letter (PDF, max 5MB)
                        <span class="text-rose-500">*</span></label
                      >
                      <input
                        type="file"
                        id="approvalLetter"
                        @change="handleApprovalLetterUpload"
                        accept=".pdf"
                        class="form-input-file"
                      />
                      <p v-if="applicationDetailsErrors.approvalLetter" class="form-error-text">
                        {{ applicationDetailsErrors.approvalLetter }}
                      </p>
                    </div>
                  </div>
                </div>

          <div class="space-y-4">
            <div>
              <label for="cpdTitle" class="block text-sm font-medium text-gray-700">Title of CPD <span
                  class="text-red-500">*</span></label>
              <input type="text" id="cpdTitle" v-model="application.title"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
              <p v-if="applicationDetailsErrors.title" class="mt-1 text-xs text-red-500">{{
                applicationDetailsErrors.title }}</p>
            </div>
            <div>
              <label for="cpdVenue" class="block text-sm font-medium text-gray-700">Venue <span
                  class="text-red-500">*</span></label>
              <input type="text" id="cpdVenue" v-model="application.venue"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
              <p v-if="applicationDetailsErrors.venue" class="mt-1 text-xs text-red-500">{{
                applicationDetailsErrors.venue }}</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="fromDate" class="block text-sm font-medium text-gray-700">From Date <span
                    class="text-red-500">*</span></label>
                <input type="date" id="fromDate" v-model="application.fromDate"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
                <p v-if="applicationDetailsErrors.fromDate" class="mt-1 text-xs text-red-500">{{
                  applicationDetailsErrors.fromDate }}</p>
              </div>
              <div>
                <label for="toDate" class="block text-sm font-medium text-gray-700">To Date <span
                    class="text-red-500">*</span></label>
                <input type="date" id="toDate" v-model="application.toDate"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
                <p v-if="applicationDetailsErrors.toDate" class="mt-1 text-xs text-red-500">{{
                  applicationDetailsErrors.toDate }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="p-6 bg-white shadow-lg rounded-lg">
        <h2 class="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">3. CPD Providers Details (Host)</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="cpdProvidingAgency" class="block text-sm font-medium text-gray-700">CPD Providing
              Agency <span class="text-red-500">*</span></label>
            <select id="cpdProvidingAgency" v-model="cpdProvider.agency"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
              <option value="">Select Agency</option>
              <option v-for="option in agencyOptions" :key="option.value" :value="option.value">{{
                option.text }}</option>
              <option value="other">Others (Specify)</option>
            </select>
            <p v-if="cpdProviderErrors.agency" class="mt-1 text-xs text-red-500">{{ cpdProviderErrors.agency
              }}</p>
          </div>
          <div v-if="cpdProvider.agency === 'other'">
            <label for="otherAgency" class="block text-sm font-medium text-gray-700">If Others, Specify
              <span class="text-red-500">*</span></label>
            <input type="text" id="otherAgency" v-model="cpdProvider.otherAgency"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
            <p v-if="cpdProviderErrors.otherAgency" class="mt-1 text-xs text-red-500">{{
              cpdProviderErrors.otherAgency }}</p>
          </div>
          <div>
            <label for="reasonForConducting" class="block text-sm font-medium text-gray-700">Reason for
              Conducting <span class="text-red-500">*</span></label>
            <select id="reasonForConducting" v-model="cpdProvider.reason"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
              <option value="">Select Reason</option>
              <option v-for="option in reasonOptions" :key="option.value" :value="option.value">{{
                option.text }}</option>
            </select>
            <p v-if="cpdProviderErrors.reason" class="mt-1 text-xs text-red-500">{{ cpdProviderErrors.reason
              }}</p>
          </div>
          <div class="md:col-span-2">
            <label for="reasonDetails" class="block text-sm font-medium text-gray-700">Reason Details <span
                class="text-red-500">*</span></label>
            <textarea id="reasonDetails" v-model="cpdProvider.reasonDetails" rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"></textarea>
            <p v-if="cpdProviderErrors.reasonDetails" class="mt-1 text-xs text-red-500">{{
              cpdProviderErrors.reasonDetails }}</p>
          </div>
        </div>
      </section>

      <section class="p-6 bg-white shadow-lg rounded-lg">
        <h2 class="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">4. Resource Persons Details</h2>
        <div v-for="(person, index) in resourcePersons" :key="index"
          class="mb-6 p-4 border border-gray-200 rounded-md space-y-3">
          <div class="flex justify-between items-center">
            <h3 class="text-md font-medium text-gray-600">Resource Person {{ index + 1 }}</h3>
            <button v-if="resourcePersons.length > 1" @click.prevent="removeResourcePerson(index)"
              type="button" class="text-sm text-red-600 hover:text-red-800">Remove</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label :for="`rpSelect-${index}`" class="block text-sm font-medium text-gray-700">Select
                Resource Person <span class="text-red-500">*</span></label>
              <select :id="`rpSelect-${index}`" v-model="person.selectedPersonId"
                @change="updateResourcePersonDetails(person)"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5">
                <option value="">-- Select Person --</option>
                <option v-for="user in userRegistrations" :key="user.id" :value="user.id">
                  {{ user.full_name }} ({{ user.registration_no || user.cid_no }})
                </option>
              </select>
              <p v-if="resourcePersonsErrors[index]?.selectedPersonId" class="mt-1 text-xs text-red-500">
                {{ resourcePersonsErrors[index].selectedPersonId }}</p>
              <p v-if="person.regNo" class="mt-1 text-xs text-gray-500">RegNo/CID: {{ person.regNo }}</p>
            </div>
            <div>
              <label :for="`rpCertificates-${index}`" class="block text-sm font-medium text-gray-700">Doc
                Supporting Expertise (PDF, max 5MB) <span class="text-red-500">*</span></label>
              <input type="file" :id="`rpCertificates-${index}`"
                @change="event => handleResourcePersonCertificateUpload(event, person, index)" accept=".pdf"
                class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
              <p v-if="resourcePersonsErrors[index]?.certificate" class="mt-1 text-xs text-red-500">{{
                resourcePersonsErrors[index].certificate }}</p>
            </div>
          </div>
        </div>
        <button @click.prevent="addResourcePerson" type="button"
          class="mt-2 text-sm text-blue-600 hover:text-blue-800 font-semibold py-2 px-4 border border-blue-500 rounded hover:bg-blue-50">
          + Add Resource Person
        </button>
      </section>

      <section class="p-6 bg-white shadow-lg rounded-lg">
        <h2 class="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">5. Teaching Learning Method</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="cpdType" class="block text-sm font-medium text-gray-700">Type of CPD <span
                class="text-red-500">*</span></label>
            <select id="cpdType" v-model="teachingMethod.type"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
              <option value="">Select Type</option>
              <option v-for="option in cpdTypeOptions" :key="option.value" :value="option.value">{{
                option.text }}</option>
            </select>
            <p v-if="teachingLearningErrors.type" class="mt-1 text-xs text-red-500">{{
              teachingLearningErrors.type }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Methodologies <span
                class="text-red-500">*</span></label>
            <div class="mt-1 max-h-40 overflow-y-auto border rounded-md p-2">
              <div v-for="option in methodologyOptions" :key="option.value">
                <label class="inline-flex items-center w-full py-1">
                  <input type="checkbox" :value="option.value" v-model="selectedMethodologies"
                    class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded">
                  <span class="ml-2 text-sm text-gray-700">{{ option.text }}</span>
                </label>
              </div>
            </div>
            <p v-if="teachingLearningErrors.selectedMethodologies" class="mt-1 text-xs text-red-500">{{
              teachingLearningErrors.selectedMethodologies }}</p>
          </div>
          <div class="md:col-span-2">
            <label for="expectedOutcome" class="block text-sm font-medium text-gray-700">Expected Outcome
              <span class="text-red-500">*</span></label>
            <textarea id="expectedOutcome" v-model="teachingMethod.expectedOutcome" rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"></textarea>
            <p v-if="teachingLearningErrors.expectedOutcome" class="mt-1 text-xs text-red-500">{{
              teachingLearningErrors.expectedOutcome }}</p>
          </div>
        </div>

        <div class="mt-6">
          <h3 class="text-md font-semibold mb-2 text-gray-600">Activities & Durations (Total Credits will be
            sum of durations)</h3>
          <p v-if="teachingLearningErrors.teachingMethods" class="mb-2 text-xs text-red-500">{{
            teachingLearningErrors.teachingMethods }}</p>
          <div v-for="(method, index) in teachingMethods" :key="index"
            class="mb-4 p-3 border rounded-md grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 items-end">
            <div class="flex-grow">
              <label :for="`activity-${index}`" class="block text-sm font-medium text-gray-700">Activity
                {{ index + 1 }} <span class="text-red-500">*</span></label>
              <textarea :id="`activity-${index}`" v-model="method.activity" @input="calculateTotalHours"
                rows="2"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"></textarea>
            </div>
            <div>
              <label :for="`duration-${index}`" class="block text-sm font-medium text-gray-700">Duration
                (Hours) <span class="text-red-500">*</span></label>
              <input type="number" :id="`duration-${index}`" v-model.number="method.duration"
                @input="calculateTotalHours" min="0.1" step="0.1"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
            </div>
            <button v-if="teachingMethods.length > 1" @click.prevent="removeTeachingMethod(index)"
              type="button"
              class="text-sm text-red-600 hover:text-red-800 self-center md:self-end h-10 px-3 py-2 border border-red-300 rounded-md hover:bg-red-50 mb-1">Remove</button>
          </div>
          <button @click.prevent="addTeachingMethod" type="button"
            class="text-sm text-blue-600 hover:text-blue-800 font-semibold py-2 px-4 border border-blue-500 rounded hover:bg-blue-50">
            + Add Activity/Duration
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div class="md:col-span-2">
            <label for="courseDocument" class="block text-sm font-medium text-gray-700">Course Document
              (PDF, max 5MB) <span class="text-red-500">*</span></label>
            <input type="file" id="courseDocument" @change="handleCourseDocumentUpload" accept=".pdf"
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
            <p v-if="teachingLearningErrors.courseDocument" class="mt-1 text-xs text-red-500">{{
              teachingLearningErrors.courseDocument }}</p>
          </div>
        </div>
      </section>

      <section class="p-6 bg-white shadow-lg rounded-lg">
        <h2 class="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">6. Target Audience / Participants
          Details</h2>
        <div v-if="!areOptionsLoaded" class="text-center text-gray-600 py-4">Loading participation options...
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Target Participation Category <span
                class="text-red-500">*</span></label>
            <div class="mt-1 max-h-40 overflow-y-auto border rounded-md p-2">
              <div v-for="option in participationCategoryOptions" :key="option.value">
                <label class="inline-flex items-center w-full py-1">
                  <input type="checkbox" :value="option.value"
                    v-model="participantDetails.category"
                    class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded">
                  <span class="ml-2 text-sm text-gray-700">{{ option.text }}</span>
                </label>
              </div>
            </div>
            <p v-if="participantDetailsErrors.categories" class="mt-1 text-xs text-red-500">{{
              participantDetailsErrors.categories }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Target Participant Sub-category <span
                v-if="filteredSubcategoryOptions.length > 0 && participantDetails.category.length > 0"
                class="text-red-500">*</span></label>
            <div class="mt-1 max-h-40 overflow-y-auto border rounded-md p-2">
              <div v-if="filteredSubcategoryOptions.length > 0">
                <div v-for="option in filteredSubcategoryOptions" :key="option.value">
                  <label class="inline-flex items-center w-full py-1">
                    <input type="checkbox" :value="option.value"
                      v-model="participantDetails.subcategory"
                      class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded">
                    <span class="ml-2 text-sm text-gray-700">{{ option.text }} ({{
                      getCategoryName(option.categoryId) }})</span>
                  </label>
                </div>
              </div>
              <div v-else-if="participantDetails.category.length > 0"
                class="text-sm text-gray-500 p-2">
                No subcategories available for the selected category/ies.
              </div>
              <div v-else class="text-sm text-gray-500 p-2">
                Please select a participation category first.
              </div>
            </div>
            <p v-if="participantDetailsErrors.subcategories" class="mt-1 text-xs text-red-500">{{
              participantDetailsErrors.subcategories }}</p>
          </div>
          <div>
            <label for="numberOfParticipants" class="block text-sm font-medium text-gray-700">Expected
              Number of Participants <span class="text-red-500">*</span></label>
            <input type="number" id="numberOfParticipants" v-model.number="participantDetails.number"
              min="1"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2">
            <p v-if="participantDetailsErrors.number" class="mt-1 text-xs text-red-500">{{
              participantDetailsErrors.number }}</p>
          </div>
          <div class="md:col-span-2">
            <label for="relevanceToProfession" class="block text-sm font-medium text-gray-700">Relevance to
              Topic/Profession <span v-if="participantDetails.category.length > 1" class="text-red-500">*</span></label>
            <textarea id="relevanceToProfession" v-model="participantDetails.relevance" rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"></textarea>
            <p v-if="participantDetailsErrors.relevance" class="mt-1 text-xs text-red-500">{{
              participantDetailsErrors.relevance }}</p>
          </div>
        </div>
      </section>

      <section v-if="application.isApproved === 'true'" class="p-6 bg-white shadow-lg rounded-lg">
        <h2 class="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Approved CPD - Participant & Document
          Management</h2>
        <div>
          <label for="generalAttachment" class="block text-sm font-medium text-gray-700">General Attachment
            (e.g., Detailed Program - PDF, max 5MB) <span class="text-red-500">*</span></label>
          <input type="file" id="generalAttachment" @change="handleAttachmentUpload" accept=".pdf"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
          <p v-if="approvedCpdErrors.attachment" class="mt-1 text-xs text-red-500">{{
            approvedCpdErrors.attachment }}</p>
        </div>

        <h3 class="text-md font-semibold mt-6 mb-2 text-gray-600">List Participants (Optional at this stage)
        </h3>
        <div v-for="(participant, index) in participants" :key="index"
          class="mb-4 p-3 border rounded-md grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
          <div>
            <label :for="`participantRegNo-${index}`"
              class="block text-sm font-medium text-gray-700">Participant RegNo/CID <span
                class="text-red-500">*</span></label>
            <input type="text" :id="`participantRegNo-${index}`" v-model="participant.regNo"
              @blur="fetchParticipantName(participant)"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2">
            <p v-if="approvedCpdErrors.participants && approvedCpdErrors.participants[index]?.regNo"
              class="mt-1 text-xs text-red-500">{{ approvedCpdErrors.participants[index].regNo }}</p>
          </div>
          <div>
            <label :for="`participantName-${index}`"
              class="block text-sm font-medium text-gray-700">Participant Name</label>
            <input type="text" :id="`participantName-${index}`" v-model="participant.name" readonly
              class="mt-1 block w-full bg-gray-100 rounded-md border-gray-300 shadow-sm sm:text-sm p-2">
          </div>
          <button @click.prevent="removeParticipant(index)" type="button"
            class="text-sm text-red-600 hover:text-red-800 self-center md:self-end h-10 px-3 py-2 border border-red-300 rounded-md hover:bg-red-50 mb-1">Remove</button>
        </div>
        <button @click.prevent="addParticipant" type="button"
          class="mt-2 text-sm text-blue-600 hover:text-blue-800 font-semibold py-2 px-4 border border-blue-500 rounded hover:bg-blue-50">
          + Add Participant
        </button>

        <div v-if="participants.filter(p => p.regNo?.trim()).length > 0" class="mt-6">
          <label for="attendanceSheet" class="block text-sm font-medium text-gray-700">Attendance Sheet
            (PDF, max 5MB) <span class="text-red-500">*</span></label>
          <input type="file" id="attendanceSheet" @change="handleAttendanceSheetUpload" accept=".pdf"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
          <p v-if="approvedCpdErrors.attendanceSheet" class="mt-1 text-xs text-red-500">{{
            approvedCpdErrors.attendanceSheet }}</p>
        </div>
      </section>

      <section class="p-6 bg-white shadow-lg rounded-lg">
        <h2 class="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">7. Actions</h2>
        <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <button @click.prevent="cancelForm" type="button"
            class="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Cancel
          </button>
          <button @click.prevent="saveDraft" :disabled="loading" type="button"
            class="w-full sm:w-auto px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50">
            {{ loading && currentAction === 'draft' ? 'Saving...' : 'Save as Draft' }}
          </button>
          <button type="submit" :disabled="loading"
            class="w-full sm:w-auto px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
            {{ loading && currentAction === 'submit' ? 'Submitting...' : 'Submit Application' }}
          </button>
        </div>
      </section>
    </form>

    <div v-if="showConfirmation" class="fixed inset-0 z-40 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"> </span>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog" aria-modal="true" aria-labelledby="modal-headline">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.79 4 4 0 .863-.27 1.66-.744 2.26l-1.003 1.003c-.391.391-.391 1.023 0 1.414.391.391 1.023.391 1.414 0l1.003-1.003c.64-.64.976-1.493.976-2.384 0-2.67-2.13-4.8-4.8-4.8S7.2 8.33 7.2 11c0 .552.448 1 1 1s1-.448 1-1c0-.369.057-.729.167-1.067l.118-.372zM12 18a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                  Confirm Submission
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to submit this CPD application?
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="confirmSubmit" :disabled="loading" type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
              {{ loading && currentAction === 'submit' ? 'Submitting...' : 'Yes, Submit' }}
            </button>
            <button @click="showConfirmation = false" :disabled="loading" type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import apiService from '@/services/services'; // Your API service

const authStore = useAuthStore();
const router = useRouter();

const loading = ref(false);
const currentAction = ref('');
const showConfirmation = ref(false);
const successMessage = ref('');
const userRegistrations = ref([]); // To store fetched user/application lookups

// --- Reactive State ---
const applicant = reactive({
  cidNumber: '',
  fullName: '',
  agencyTrainingLocation: '',
});

const application = reactive({
  isApproved: 'false', // Default to 'No'
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

const resourcePersons = ref([
  {
    selectedPersonId: '', // ID of the selected user from userRegistrations
    name: '', // Auto-filled or manually entered if not found
    regNo: '', // Auto-filled or manually entered
    certificate: null // File object
  }
])

const teachingMethod = reactive({
  type: '',
  expectedOutcome: '',
});
const selectedMethodologies = ref([]);
const teachingMethods = ref([{ activity: '', duration: null }]);

const totalHours = ref(0); // Calculated from teachingMethods durations
const calculatedCredits = ref(0); // Often same as totalHours

const participantDetails = reactive({
  category: [],
  subcategory: [],
  number: null,
  relevance: '',
});

const participants = ref([]); // For approved CPDs: { regNo: '', name: '' }

// File refs
const approvalLetter = ref(null)
const courseDocument = ref(null)
const attendanceSheet = ref(null)

// Dropdown options
const agencyOptions = ref([]);
const reasonOptions = ref([]);
const cpdTypeOptions = ref([]);
const methodologyOptions = ref([]);
const participationCategoryOptions = ref([]);
const participantSubcategoryOptions = ref([]);
const areOptionsLoaded = ref(false);

// Error objects
const validationErrors = ref([]); // General form errors
const applicantDetailsErrors = ref({});
const applicationDetailsErrors = ref({});
const cpdProviderErrors = ref({});
const resourcePersonsErrors = ref([]); // Array of error objects, one per resource person
const teachingLearningErrors = ref({});
const participantDetailsErrors = ref({});
const approvedCpdErrors = ref({});

// --- Computed Properties ---
const filteredSubcategoryOptions = computed(() => {
  if (!participantDetails.category || participantDetails.category.length === 0) {
    return [];
  }
  return participantSubcategoryOptions.value.filter(subOpt =>
    participantDetails.category.includes(subOpt.categoryId) // Assumes subOpt has categoryId
  );
});

// --- Methods ---
const getCategoryName = (categoryId) => {
  const category = participationCategoryOptions.value.find(cat => cat.value === categoryId);
  return category ? category.text : '';
};

const addResourcePerson = () => {
  resourcePersons.value.push({ selectedPersonId: '', name: '', regNo: '', certificate: null });
  resourcePersonsErrors.value.push({}); // Add a corresponding error object
};

const removeResourcePerson = (index) => {
  resourcePersons.value.splice(index, 1);
  resourcePersonsErrors.value.splice(index, 1);
};

const updateResourcePersonDetails = (person) => {
  const selectedUser = userRegistrations.value.find(u => u.id === person.selectedPersonId);
  if (selectedUser) {
    person.name = selectedUser.full_name;
    person.regNo = selectedUser.registration_no || selectedUser.cid_no;
  } else {
    person.name = '';
    person.regNo = '';
  }
};

const toggleApprovedFields = () => {
  const isNowApproved = application.isApproved === 'true';
  // Clear fields specific to the other state
  if (!isNowApproved) {
    // Means it was 'true' and now 'false'
    approvalLetter.value = null
    participants.value = []
    attendanceSheet.value = null
    // Clear related errors
    if (applicationDetailsErrors.value.approvalLetter) delete applicationDetailsErrors.value.approvalLetter;
    approvedCpdErrors.value = {};
  }
}

const handleFileUpload = (event, fileRef, maxSizeMB = 5, errorFieldKey, errorObjectRef) => {
  const file = event.target.files?.[0];
  if (errorObjectRef.value[errorFieldKey]) {
      delete errorObjectRef.value[errorFieldKey];
  }
  const mainErrorMsgKey = errorFieldKey.replace(/([A-Z])/g, ' $1').toLowerCase();
  validationErrors.value = validationErrors.value.filter(e => !e.toLowerCase().includes(mainErrorMsgKey));


  if (file) {
    if (file.type === 'application/pdf' && file.size <= maxSizeMB * 1024 * 1024) {
      fileRef.value = file;
    } else {
      fileRef.value = null;
      event.target.value = ''; // Clear the input
      const errorMsg = `Invalid file. Must be PDF and max ${maxSizeMB}MB.`;
      errorObjectRef.value[errorFieldKey] = errorMsg;
    }
  } else {
    fileRef.value = null;
  }
};

const handleResourcePersonCertificateUpload = (event, person, index) => {
  const file = event.target.files?.[0];
  const maxSizeMB = 5;

  if (!resourcePersonsErrors.value[index]) resourcePersonsErrors.value[index] = {};
  if (resourcePersonsErrors.value[index].certificate) {
      delete resourcePersonsErrors.value[index].certificate;
  }
  validationErrors.value = validationErrors.value.filter(e => !e.toLowerCase().includes(`resource person ${index + 1} certificate`));

  if (file) {
    if (file.type === 'application/pdf' && file.size <= maxSizeMB * 1024 * 1024) {
      person.certificate = file;
    } else {
      person.certificate = null;
      event.target.value = '';
      const errorMsg = `Invalid file. Must be PDF and max ${maxSizeMB}MB.`;
      resourcePersonsErrors.value[index].certificate = errorMsg;
    }
  } else {
    person.certificate = null;
  }
};

const handleApprovalLetterUpload = (event) => handleFileUpload(event, approvalLetter, 5, 'approvalLetter', applicationDetailsErrors);
const handleCourseDocumentUpload = (event) => handleFileUpload(event, courseDocument, 5, 'courseDocument', teachingLearningErrors);
const handleAttendanceSheetUpload = (event) => handleFileUpload(event, attendanceSheet, 5, 'attendanceSheet', approvedCpdErrors);
const handleAttachmentUpload = (event) => handleFileUpload(event, attachment, 5, 'attachment', approvedCpdErrors);


const addTeachingMethod = () => {
  teachingMethods.value.push({ activity: '', duration: null });
};

const removeTeachingMethod = (index) => {
  teachingMethods.value.splice(index, 1);
  calculateTotalHours();
};

const calculateTotalHours = () => {
  totalHours.value = teachingMethods.value.reduce((sum, method) => {
    return sum + (Number(method.duration) || 0);
  }, 0);
  calculatedCredits.value = totalHours.value; // Or your specific credit calculation logic
};

const addParticipant = () => {
  participants.value.push({ regNo: '', name: '' });
   if (approvedCpdErrors.value.participants && approvedCpdErrors.value.participants.length < participants.value.length) {
    approvedCpdErrors.value.participants.push({});
  } else if (!approvedCpdErrors.value.participants) {
    approvedCpdErrors.value.participants = participants.value.map(() => ({}));
  }
};

const removeParticipant = (index) => {
  participants.value.splice(index, 1);
  if (approvedCpdErrors.value.participants) {
    approvedCpdErrors.value.participants.splice(index, 1);
  }
};

const fetchParticipantName = async (participant) => {
  if (!participant.regNo?.trim()) {
    participant.name = '';
    return;
  }
  const existingUser = userRegistrations.value.find(u => u.registration_no === participant.regNo.trim() || u.cid_no === participant.regNo.trim());
  if (existingUser) {
    participant.name = existingUser.full_name;
    return;
  }
  try {
    currentAction.value = 'fetch_participant'; loading.value = true;
    // Assuming apiService.getMhpcFullApplicationListByCid can find by regNo or CID
    const response = await apiService.getMhpcFullApplicationListByCid(participant.regNo.trim());
    const foundUser = response.data?.results?.find(app => app.registration_no === participant.regNo.trim() || app.cid_no === participant.regNo.trim());

    if (foundUser) {
      participant.name = foundUser.full_name || 'Name not available';
      if (!userRegistrations.value.some(u => u.id === foundUser.id)) {
        userRegistrations.value.push({ // Cache it
            id: foundUser.id,
            registration_no: foundUser.registration_no,
            full_name: foundUser.full_name,
            cid_no: foundUser.cid_no,
        });
        userRegistrations.value.sort((a,b) => a.full_name.localeCompare(b.full_name));
      }
    } else {
      participant.name = 'Not Found';
    }
  } catch (error) {
    console.error('Error fetching participant name:', error);
    participant.name = 'Error fetching';
  } finally {
    loading.value = false; currentAction.value = '';
  }
};

const validateForm = (forDraft = false) => {
  // Clear previous errors
  validationErrors.value = [];
  applicantDetailsErrors.value = {};
  applicationDetailsErrors.value = {};
  cpdProviderErrors.value = {};
  resourcePersonsErrors.value = resourcePersons.value.map(() => ({}));
  teachingLearningErrors.value = {};
  participantDetailsErrors.value = {};
  approvedCpdErrors.value = {};
  if (application.isApproved === 'true') {
    approvedCpdErrors.value.participants = participants.value.map(() => ({}));
  }

  let isValid = true;

  // Section 1: Applicant Details
  if (!forDraft && !applicant.agencyTrainingLocation?.trim()) {
    console.log(
      '[Validation] Applicant Details: agencyTrainingLocation missing',
      applicant.agencyTrainingLocation
    )
    applicantDetailsErrors.value.agencyTrainingLocation = 'Agency/Training Location is required.'
    isValid = false
  }

  // Section 2: Application Details
  if (!forDraft && !application.title?.trim()) {
    console.log('[Validation] Application Details: title missing', application.title)
    applicationDetailsErrors.value.title = 'Title of CPD is required.'
    isValid = false
  }
  if (!forDraft && !application.venue?.trim()) {
    console.log('[Validation] Application Details: venue missing', application.venue)
    applicationDetailsErrors.value.venue = 'Venue is required.'
    isValid = false
  }
  if (!forDraft && !application.fromDate) {
    console.log('[Validation] Application Details: fromDate missing', application.fromDate)
    applicationDetailsErrors.value.fromDate = 'From Date is required.'
    isValid = false
  }
  if (!forDraft && !application.toDate) {
    console.log('[Validation] Application Details: toDate missing', application.toDate)
    applicationDetailsErrors.value.toDate = 'To Date is required.'
    isValid = false
  }
  if (
    !forDraft &&
    application.fromDate &&
    application.toDate &&
    new Date(application.fromDate) > new Date(application.toDate)
  ) {
    console.log(
      '[Validation] Application Details: fromDate > toDate',
      application.fromDate,
      application.toDate
    )
    applicationDetailsErrors.value.toDate = 'To Date must be on or after From Date.'
    isValid = false
  }
  if (application.isApproved === 'true' && !forDraft && !approvalLetter.value) {
    console.log(
      '[Validation] Application Details: approvalLetter required for approved',
      approvalLetter.value
    )
    applicationDetailsErrors.value.approvalLetter =
      'Approval Letter is required if CPD is approved.'
    isValid = false
  }

  // Section 3: CPD Providers Details
  if (!forDraft && !cpdProvider.agency) {
    console.log('[Validation] CPD Provider: agency missing', cpdProvider.agency)
    cpdProviderErrors.value.agency = 'CPD Providing Agency is required.'
    isValid = false
  }
  if (!forDraft && cpdProvider.agency === 'other' && !cpdProvider.otherAgency?.trim()) {
    console.log('[Validation] CPD Provider: otherAgency missing', cpdProvider.otherAgency)
    cpdProviderErrors.value.otherAgency = 'Please specify the Other Agency.'
    isValid = false
  }
  if (!forDraft && !cpdProvider.reason) {
    console.log('[Validation] CPD Provider: reason missing', cpdProvider.reason)
    cpdProviderErrors.value.reason = 'Reason for Conducting is required.'
    isValid = false
  }
  if (!forDraft && !cpdProvider.reasonDetails?.trim()) {
    console.log('[Validation] CPD Provider: reasonDetails missing', cpdProvider.reasonDetails)
    cpdProviderErrors.value.reasonDetails = 'Reason Details are required.'
    isValid = false
  }

  // Section 4: Resource Persons Details
  const hasAtLeastOneResourcePersonForNonDraft = resourcePersons.value.some(p => p.selectedPersonId && p.certificate);
  if (!forDraft && resourcePersons.value.length > 0 && !hasAtLeastOneResourcePersonForNonDraft) {
    console.log(
      '[Validation] Resource Persons: No complete resource person',
      JSON.parse(JSON.stringify(resourcePersons.value))
    )
    validationErrors.value.push(
      'At least one resource person with both selection and certificate is required for non-draft submissions.'
    )
    isValid = false
    // Pinpoint which one is missing
    resourcePersons.value.forEach((person, index) => {
      if (person.selectedPersonId && !person.certificate) {
        console.log(`[Validation] Resource Person ${index + 1}: certificate missing`, person)
        resourcePersonsErrors.value[index].certificate = 'Certificate required.'
      }
      if (!person.selectedPersonId && person.certificate) {
        console.log(`[Validation] Resource Person ${index + 1}: selectedPersonId missing`, person)
        resourcePersonsErrors.value[index].selectedPersonId = 'Person selection required.'
      }
      if (!person.selectedPersonId && !person.certificate && (person.name || person.regNo)) {
        console.log(
          `[Validation] Resource Person ${index + 1}: both missing but has name/regNo`,
          person
        )
        resourcePersonsErrors.value[index].selectedPersonId = 'Person selection required.'
        resourcePersonsErrors.value[index].certificate = 'Certificate required.'
      }
    })
  } else if (!forDraft && resourcePersons.value.length === 0) {
    console.log('[Validation] Resource Persons: No resource persons added')
    validationErrors.value.push(
      'At least one Resource Person is required for non-draft submissions.'
    )
    isValid = false
  }


  // Section 5: Teaching Learning Method
  if (!forDraft && !teachingMethod.type) {
    console.log('[Validation] Teaching Method: type missing', teachingMethod.type)
    teachingLearningErrors.value.type = 'Type of CPD is required.'
    isValid = false
  }
  if (!forDraft && selectedMethodologies.value.length === 0) {
    console.log(
      '[Validation] Teaching Method: selectedMethodologies missing',
      selectedMethodologies.value
    )
    teachingLearningErrors.value.selectedMethodologies =
      'At least one Methodology must be selected.'
    isValid = false
  }
  if (!forDraft && !teachingMethod.expectedOutcome?.trim()) {
    console.log(
      '[Validation] Teaching Method: expectedOutcome missing',
      teachingMethod.expectedOutcome
    )
    teachingLearningErrors.value.expectedOutcome = 'Expected Outcome is required.'
    isValid = false
  }
  if (!forDraft) {
    const hasCompleteMethod = teachingMethods.value.some(m => m.activity?.trim() && m.duration && Number(m.duration) > 0);
    if (teachingMethods.value.length === 0 || !hasCompleteMethod) {
      console.log(
        '[Validation] Teaching Method: No complete teaching method',
        JSON.parse(JSON.stringify(teachingMethods.value))
      )
      teachingLearningErrors.value.teachingMethods =
        'At least one Activity with a positive Duration is required.'
      isValid = false
    } else {
      teachingMethods.value.forEach((m, idx) => {
        if (
          (m.activity?.trim() && (!m.duration || Number(m.duration) <= 0)) ||
          (!m.activity?.trim() && m.duration && Number(m.duration) > 0)
        ) {
          console.log(`[Validation] Teaching Method ${idx + 1}: activity/duration mismatch`, m)
          teachingLearningErrors.value.teachingMethods =
            'All activities must have a positive duration, and vice-versa.'
          isValid = false
        }
      })
    }
  }
  if (!forDraft && !courseDocument.value) {
    console.log('[Validation] Teaching Method: courseDocument missing', courseDocument.value)
    teachingLearningErrors.value.courseDocument = 'Course Document is required.'
    isValid = false
  }

  // Section 6: Target Audience
  if (!forDraft && areOptionsLoaded.value) {
    if (participantDetails.category.length === 0) {
      console.log('[Validation] Participants: category missing', participantDetails.category)
      participantDetailsErrors.value.categories = 'Target Participation Category is required.'
      isValid = false
    }
    const subcategoriesAvailable = filteredSubcategoryOptions.value.length > 0;
    if (subcategoriesAvailable && participantDetails.subcategory.length === 0) {
      console.log(
        '[Validation] Participants: subcategory required but missing',
        participantDetails.subcategory
      )
      participantDetailsErrors.value.subcategories =
        'Participant Sub-category is required if available for selected categories.'
      isValid = false
    }
    if (participantDetails.number === null || participantDetails.number <= 0) {
      console.log('[Validation] Participants: number missing or invalid', participantDetails.number)
      participantDetailsErrors.value.number =
        'Expected number of participants must be a positive number.'
      isValid = false
    }
    if (participantDetails.category.length > 1 && !participantDetails.relevance?.trim()) {
      console.log(
        '[Validation] Participants: relevance required for multiple categories',
        participantDetails.relevance
      )
      participantDetailsErrors.value.relevance =
        'Relevance to Topic/Profession is required for multiple categories.'
      isValid = false
    }
  } else if (!forDraft && !areOptionsLoaded.value) {
    console.log('[Validation] Participants: options not loaded')
    validationErrors.value.push('Participation options are still loading. Please wait.')
    isValid = false
  }

  // Section: Approved CPD
  if (application.isApproved === 'true' && !forDraft) {
    const validListedParticipants = participants.value.filter((p) => p.regNo?.trim())
    if (validListedParticipants.length > 0 && !attendanceSheet.value) {
      console.log(
        '[Validation] Approved CPD: attendanceSheet required for listed participants',
        attendanceSheet.value
      )
      approvedCpdErrors.value.attendanceSheet =
        'Attendance Sheet is required if participants are listed.'
      isValid = false
    }
    participants.value.forEach((p, index) => {
      if ((p.name?.trim() || p.regNo?.trim()) && !p.regNo?.trim()) {
        console.log(`[Validation] Approved CPD Participant ${index + 1}: regNo missing`, p)
        if (!approvedCpdErrors.value.participants[index])
          approvedCpdErrors.value.participants[index] = {}
        approvedCpdErrors.value.participants[index].regNo =
          'RegNo/CID is required for this participant entry.'
        isValid = false
      }
    })
  }

  if (!isValid && !forDraft) {
    console.log('[Validation] Form is invalid, errors:', {
      applicantDetailsErrors: applicantDetailsErrors.value,
      applicationDetailsErrors: applicationDetailsErrors.value,
      cpdProviderErrors: cpdProviderErrors.value,
      resourcePersonsErrors: resourcePersonsErrors.value,
      teachingLearningErrors: teachingLearningErrors.value,
      participantDetailsErrors: participantDetailsErrors.value,
      approvedCpdErrors: approvedCpdErrors.value,
      validationErrors: validationErrors.value,
    })
    validationErrors.value.unshift('Please correct the errors indicated below.')
  } else {
    console.log('[Validation] Form is valid')
  }
  return isValid;
};

const prepareFormData = (isDraft = false) => {
  const fd = new FormData();

  // Applicant
  fd.append('cid_no', applicant.cidNumber || ''); // Map to backend's expected field name e.g. applicant_cid_no
  fd.append('full_name', applicant.fullName || ''); // Map to backend's e.g. applicant_full_name
  fd.append('proposed_training_location', applicant.agencyTrainingLocation?.trim() || '');

  // Application
  const isCpdApprovedFlag = application.isApproved === 'true';
  fd.append('is_cpd_approved', isCpdApprovedFlag);
  fd.append('title_of_cpd', application.title?.trim() || '');
  fd.append('venue', application.venue?.trim() || '');
  fd.append('from_date', application.fromDate || '');
  fd.append('to_date', application.toDate || '');

  if (!isCpdApprovedFlag) {
    fd.append('total_calculated_credits', calculatedCredits.value);
  }

  // Conditional attachments based on approval status
  if (isCpdApprovedFlag) {
    if (approvalLetter.value) fd.append('approval_letter_attachment', approvalLetter.value)
    else if (isDraft) fd.append('approval_letter_attachment', '')

    const validListedParticipants = participants.value
      .filter(p => p.regNo?.trim())
      .map(p => ({
        participant_reg_no: p.regNo.trim(),
        review_status: 'Pending', // Default status
      }));
    if (validListedParticipants.length > 0) {
      fd.append('participants', JSON.stringify(validListedParticipants));
    } else if (isDraft) {
      fd.append('participants', JSON.stringify([]));
    }

    if (attendanceSheet.value && validListedParticipants.length > 0) {
      fd.append('attendance_sheet_attachment', attendanceSheet.value);
    } else if (isDraft && attendanceSheet.value) { // Send if available even if no participants for draft
      fd.append('attendance_sheet_attachment', attendanceSheet.value);
    } else if (isDraft) {
      fd.append('attendance_sheet_attachment', '');
    }
  } else { // Not CPD Approved
    if (isDraft) { // Send empty placeholders for draft if backend expects them
      fd.append('approval_letter_attachment', '');
      fd.append('general_approved_cpd_attachment', '');
      fd.append('participants', JSON.stringify([]));
      fd.append('attendance_sheet_attachment', '');
    }
  }

  // CPD Provider
  fd.append('cpd_providing_agency', cpdProvider.agency === 'other' ? '' : (cpdProvider.agency || ''));
  if (cpdProvider.agency === 'other') {
    fd.append('if_others_specify', cpdProvider.otherAgency?.trim() || '');
  } else if (isDraft) {
    fd.append('if_others_specify', '');
  }
  fd.append('reason_for_conducting', cpdProvider.reason || '');
  fd.append('reason_for_details', cpdProvider.reasonDetails?.trim() || '');

  // Resource Persons
  const resourcePersonsToSend = resourcePersons.value
    .filter(person => {
      if (isDraft) { // For draft, include if any identifying info is present
        return person.selectedPersonId || person.name?.trim() || person.regNo?.trim() || person.certificate;
      }
      // For non-draft, already validated by validateForm that selectedPersonId and certificate are present
      return person.selectedPersonId && person.certificate;
    });

  if (resourcePersonsToSend.length > 0) {
      resourcePersonsToSend.forEach((person, index) => {
          const selectedUser = userRegistrations.value.find(u => u.id === person.selectedPersonId);
          const regNoToUse = selectedUser ? (selectedUser.registration_no || selectedUser.cid_no) : (person.regNo || '');
          const nameToUse = selectedUser ? selectedUser.full_name : (person.name || '');

          fd.append(`resources[${index}][resource_person_reg_no]`, regNoToUse);
          fd.append(`resources[${index}][resource_person_name]`, nameToUse);
          if (person.certificate) {
            fd.append(`resources[${index}][document_supporting_expertise]`, person.certificate);
          }
          // If draft and no certificate, key is not appended. Backend handles null FileField.
      });
  } else if (isDraft) {
      // If it's a draft and no resource persons, you might not need to send an empty array indication
      // unless backend strictness requires an empty 'resources' key.
      // fd.append('resources', JSON.stringify([])); // Usually not needed for FormData files
  }


  // Teaching Learning Method
  fd.append('type_of_cpd', teachingMethod.type || '');
  if (selectedMethodologies.value.length > 0) {
    fd.append('methodologies', JSON.stringify(
      selectedMethodologies.value.map(methodId => ({ methodology_name: methodId })) // Assuming methodId is what backend expects
    ));
  } else if (isDraft) {
    fd.append('methodologies', JSON.stringify([]));
  }

  const learningMethodsToSubmit = teachingMethods.value
    .filter(method => method.activity?.trim() || (isDraft && method.duration !== null && method.duration !== undefined))
    .map(method => ({
      activities: method.activity?.trim() || '',
      duration: (method.duration !== null && method.duration !== undefined && Number(method.duration) > 0)
        ? Number(method.duration)
        : (isDraft ? (method.duration === null || method.duration === undefined ? '' : Number(method.duration)) : 0),
    }));

  if (learningMethodsToSubmit.length > 0) {
    fd.append('learning_methods', JSON.stringify(learningMethodsToSubmit));
  } else if (isDraft) {
    fd.append('learning_methods', JSON.stringify([]));
  }

  fd.append('expected_outcome', teachingMethod.expectedOutcome?.trim() || '');
  if (courseDocument.value) {
    fd.append('course_document', courseDocument.value);
  } else if (isDraft) {
    fd.append('course_document', '');
  }

  // Target Audience
  if (areOptionsLoaded.value || isDraft) { // Send even if empty for drafts, if backend expects keys
    fd.append('participation_category', JSON.stringify(participantDetails.category || []));
    fd.append('participant_sub_category', JSON.stringify(participantDetails.subcategory || []));
    fd.append('number_of_participants', (participantDetails.number !== null && participantDetails.number !== undefined) ? participantDetails.number : (isDraft ? '' : 0));
    fd.append('relevance_to_topic', participantDetails.relevance?.trim() || '');
  }

  // Meta
  fd.append('is_draft', isDraft);
  if (authStore.user?.id) {
    fd.append('user_id', authStore.user.id); // Or let backend derive from request.user
  }

  // Log FormData for debugging
  console.log('--- FormData being sent (isDraft:', isDraft, ') ---');
  for (let pair of fd.entries()) {
    console.log(`${pair[0]}:`, pair[1] instanceof File ? pair[1].name : pair[1]);
  }
  console.log('-----------------------------------------');

  return fd;
};


const resetFormState = () => {
  applicant.agencyTrainingLocation = ''
  application.isApproved = 'false'
  application.title = ''
  application.venue = ''
  application.fromDate = ''
  application.toDate = ''
  approvalLetter.value = null

    cpdProvider.agency = '';
    cpdProvider.otherAgency = '';
    cpdProvider.reason = '';
    cpdProvider.reasonDetails = '';

    resourcePersons.value = [{ selectedPersonId: '', name: '', regNo: '', certificate: null }];
    resourcePersonsErrors.value = [{}];

    teachingMethod.type = '';
    teachingMethod.expectedOutcome = '';
    selectedMethodologies.value = [];
    teachingMethods.value = [{ activity: '', duration: null }];
    totalHours.value = 0;
    calculatedCredits.value = 0;
    courseDocument.value = null;

    participantDetails.category = [];
    participantDetails.subcategory = [];
    participantDetails.number = null;
    participantDetails.relevance = '';

    participants.value = []; // for approved CPD
    attendanceSheet.value = null; // for approved CPD

    // Clear all error objects
    validationErrors.value = [];
    applicantDetailsErrors.value = {};
    applicationDetailsErrors.value = {};
    cpdProviderErrors.value = {};
    // resourcePersonsErrors already reset
    teachingLearningErrors.value = {};
    participantDetailsErrors.value = {};
    approvedCpdErrors.value = {};

    successMessage.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
};


const saveDraft = async () => {
  currentAction.value = 'draft';
  // Minimal validation for draft: title or agency location
  if (!applicant.agencyTrainingLocation?.trim() && !application.title?.trim()) {
    validationErrors.value = ['Please fill in at least Agency/Training Location or Title of CPD to save a draft.'];
    window.scrollTo({ top: 0, behavior: 'smooth' });
    currentAction.value = '';
    return;
  }
  // Clear all validation errors for draft attempt, as requirements are lax
  validationErrors.value = [];
  applicantDetailsErrors.value = {}; applicationDetailsErrors.value = {}; cpdProviderErrors.value = {};
  resourcePersonsErrors.value = resourcePersons.value.map(() => ({}));
  teachingLearningErrors.value = {}; participantDetailsErrors.value = {}; approvedCpdErrors.value = {};

  try {
    loading.value = true;
    const fd = prepareFormData(true); // Pass true for isDraft
    await apiService.createMhpcCpdTask(fd); // Use your actual API endpoint method
    successMessage.value = 'Draft saved successfully! You can complete and submit it later.';
    // Optionally, reset parts of the form or navigate away after a delay
    setTimeout(() => { successMessage.value = ''; }, 5000);
  } catch (error) {
    console.error('Error saving draft:', error);
    validationErrors.value = ['Failed to save draft. An unexpected error occurred.'];
    if (error.response?.data) {
        Object.entries(error.response.data).forEach(([key, value]) => {
            validationErrors.value.push(`${key}: ${Array.isArray(value) ? value.join(', ') : value}`);
        });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } finally {
    loading.value = false;
    currentAction.value = '';
  }
};

const handleSubmit = () => {
  if (validateForm(false)) { // Full validation for submit
    showConfirmation.value = true;
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const confirmSubmit = async () => {
  currentAction.value = 'submit';
  showConfirmation.value = false; // Close confirmation modal

  if (!validateForm(false)) { // Re-validate just in case, though unlikely to change
    window.scrollTo({ top: 0, behavior: 'smooth' });
    currentAction.value = '';
    return;
  }

  try {
    loading.value = true;
    const fd = prepareFormData(false);
    await apiService.createMhpcCpdTask(fd);
    successMessage.value = 'Application submitted successfully! Redirecting to dashboard...';
    resetFormState();
    setTimeout(() => {
        successMessage.value = '';
        router.push('/admin/cme_cpd_provider/health_certification/dashboard');
    }, 3000);
  } catch (error) {
    console.error('Error submitting application:', error);
    validationErrors.value = ['Submission failed. Please review the errors below.'];
     if (error.response?.data) {
        Object.entries(error.response.data).forEach(([key, value]) => {
            if (key === 'detail' && typeof value === 'string') {
                 validationErrors.value.push(value);
            } else if (Array.isArray(value)) {
                validationErrors.value.push(`${key}: ${value.join(', ')}`);
            } else if (typeof value === 'object') {
                Object.entries(value).forEach(([subKey, subValue]) => {
                    validationErrors.value.push(`${key}.${subKey}: ${Array.isArray(subValue) ? subValue.join(', ') : subValue}`);
                });
            } else {
                 validationErrors.value.push(`${key}: ${value}`);
            }
        });
    } else {
        validationErrors.value.push('An unexpected error occurred. Please try again.');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } finally {
    loading.value = false;
    currentAction.value = '';
  }
};

const cancelForm = () => {
  if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
    resetFormState();
    router.push('/admin/cme_cpd_provider/health_certification/dashboard');
  }
};


const fetchUserRegistrations = async () => {
  try {
    const response = await apiService.getMhpcNewApplications();
    if (response.data?.results && Array.isArray(response.data.results)) {
      userRegistrations.value = response.data.results.map(app => ({
        id: app.id,
        registration_no: app.registration_no,
        full_name: app.full_name,
        cid_no: app.cid_no,
      })).sort((a,b) => a.full_name.localeCompare(b.full_name));
    }
  } catch (error) {
    console.error('Error fetching user registrations for lookup:', error);
  }
};

const loadDropdownOptions = async () => {
  areOptionsLoaded.value = false;
  try {
    currentAction.value = 'load_options'; loading.value = true;
    const [
      agencyRes, reasonRes, cpdTypeRes, methodologyRes, categoriesRes, subcategoriesRes
    ] = await Promise.all([
      apiService.getProvidingAgency(),
      apiService.getReasonForCoducting(),
      apiService.getMhpcMastersCpdActivities(),
      apiService.getMhpcMastersCpdMethodologies(),
      apiService.getMhpcMasterData('personnel-categories'),
      apiService.getMhpcMastersSubCategories(),
    ]);

    agencyOptions.value = agencyRes?.data?.results?.map(item => ({ text: item.name, value: item.id })) || [];
    reasonOptions.value = reasonRes?.data?.results?.map(item => ({ text: item.name, value: item.id })) || [];
    cpdTypeOptions.value = cpdTypeRes?.data?.results?.map(item => ({ text: item.cpd_activity_name, value: item.id })) || [];
    methodologyOptions.value = methodologyRes?.data?.results?.map(item => ({ text: item.methodology_name, value: item.id })) || [];

    participationCategoryOptions.value = categoriesRes?.data?.results?.map(cat => ({ text: cat.category_name, value: cat.id })) || [];

    participantSubcategoryOptions.value = subcategoriesRes?.data?.results?.map(sub => ({ text: sub.sub_category_name, value: sub.id, categoryId: sub.category_name })) || [];

  } catch (error) {
    console.error('Error loading dropdown options:', error);
    validationErrors.value.push('Failed to load form options. Please refresh.');
  } finally {
    loading.value = false; currentAction.value = '';
    areOptionsLoaded.value = true;
  }
};

// --- Lifecycle Hooks ---
onMounted(async () => {
  if (authStore.user) {
    applicant.cidNumber = authStore.user.cid || '';
    applicant.fullName = [authStore.user.first_name, authStore.user.middle_name, authStore.user.last_name]
      .filter(Boolean).join(' ') || '';
  }
  resourcePersonsErrors.value = resourcePersons.value.map(() => ({}));
  if (application.isApproved === 'true') {
     approvedCpdErrors.value.participants = participants.value.map(() => ({}));
  }

  calculateTotalHours(); // Initial calculation
  await fetchUserRegistrations();
  await loadDropdownOptions();
});

</script>

<style scoped>
.max-h-40 {
  max-height: 10rem;
}
</style>
