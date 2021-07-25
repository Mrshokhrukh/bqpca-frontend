<template>
  <div class="cpd-provider-application">
    <h1 class="text-2xl font-bold mb-6">CPD Provider Application</h1>
    <div v-if="loading" class="text-center mb-4">
      <p>Loading...</p>
    </div>
    <div v-if="validationErrors.length" class="text-red-500 mb-4 text-center">
      <p v-for="(error, index) in validationErrors" :key="index">{{ error }}</p>
    </div>
    <div v-if="successMessage" class="text-green-500 mb-4 text-center">
      {{ successMessage }}
    </div>
    <form v-if="areOptionsLoaded" @submit.prevent="handleSubmit" class="space-y-6" ref="form">
      <!-- Applicant Details -->
      <section class="space-y-4 p-4 border border-gray-200 rounded-md shadow-sm">
        <h2 class="text-xl font-semibold text-gray-800 mb-3">Applicant Details</h2>
        <div>
          <label for="registrationNumber" class="block text-sm font-medium text-gray-700"
            >Registration Number</label
          >
          <input
            type="text"
            id="registrationNumber"
            v-model="form.registrationNumber"
            readonly
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm"
          />
        </div>
        <div>
          <label for="cidNo" class="block text-sm font-medium text-gray-700"
            >CID No./Identity/Work Permit No.</label
          >
          <input
            type="text"
            id="cidNo"
            v-model="form.cidNo"
            readonly
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm"
          />
        </div>
        <div>
          <label for="fullName" class="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            id="fullName"
            v-model="form.fullName"
            readonly
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm"
          />
        </div>
        <div>
          <label for="agencyTrainingLocation" class="block text-sm font-medium text-gray-700">
            Agency/Training Location <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="agencyTrainingLocation"
            v-model="form.agencyTrainingLocation"
            required
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter agency or training location"
          />
        </div>
      </section>

      <!-- Application Details -->
      <section class="space-y-4 p-4 border border-gray-200 rounded-md shadow-sm">
        <h2 class="text-xl font-semibold text-gray-800 mb-3">Application Details</h2>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Is CPD validated by KGUMSB or International Organization?
            <span class="text-red-500">*</span></label
          >
          <div class="mt-2 flex space-x-6">
            <label class="inline-flex items-center">
              <input
                type="radio"
                v-model="form.isCpdValidated"
                value="true"
                name="isCpdValidated"
                class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">Yes</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="radio"
                v-model="form.isCpdValidated"
                value="false"
                name="isCpdValidated"
                class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">No</span>
            </label>
          </div>
        </div>
        <div v-if="form.isCpdValidated === 'false'">
          <label for="titleOfCpd" class="block text-sm font-medium text-gray-700">
            Title of CPD <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="titleOfCpd"
            v-model="form.titleOfCpd"
            required
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter title of CPD"
          />
        </div>
        <div v-if="form.isCpdValidated === 'false'">
          <label for="venue" class="block text-sm font-medium text-gray-700">
            Venue <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="venue"
            v-model="form.venue"
            required
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter venue"
          />
        </div>
        <div v-if="form.isCpdValidated === 'false'">
          <label for="fromDate" class="block text-sm font-medium text-gray-700">
            From Date <span class="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="fromDate"
            v-model="form.fromDate"
            required
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div v-if="form.isCpdValidated === 'false'">
          <label for="toDate" class="block text-sm font-medium text-gray-700">
            To Date <span class="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="toDate"
            v-model="form.toDate"
            required
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div v-if="form.isCpdValidated === 'true'">
          <label for="cpdApprovalLetter" class="block text-sm font-medium text-gray-700">
            Attach Approval Letter <span class="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="cpdApprovalLetter"
            @change="handleFileUpload($event, 'cpdApprovalLetter')"
            accept="application/pdf"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </section>

      <!-- CPD Providers Details (Host) -->
      <section class="space-y-4 p-4 border border-gray-200 rounded-md shadow-sm">
        <h2 class="text-xl font-semibold text-gray-800 mb-3">CPD Providers Details (Host)</h2>
        <div>
          <label for="cpdProvidingAgency" class="block text-sm font-medium text-gray-700">
            CPD Providing Agency <span class="text-red-500">*</span>
          </label>
          <select
            id="cpdProvidingAgency"
            v-model="form.cpdProvidingAgency"
            required
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option disabled value="">Select Agency</option>
            <option v-if="cpdAgencyOptions.length === 0" disabled>No agencies available</option>
            <option v-for="agency in cpdAgencyOptions" :key="agency.value" :value="agency.value">
              {{ agency.text }}
            </option>
          </select>
        </div>
        <div v-if="form.cpdProvidingAgency === 'other'">
          <label for="otherCpdProvidingAgency" class="block text-sm font-medium text-gray-700">
            If Others, Specify <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="otherCpdProvidingAgency"
            v-model="form.otherCpdProvidingAgency"
            required
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Specify agency name"
          />
        </div>
        <div>
          <label for="reasonForConducting" class="block text-sm font-medium text-gray-700">
            Reason for Conducting <span class="text-red-500">*</span>
          </label>
          <select
            id="reasonForConducting"
            v-model="form.reasonForConducting"
            required
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option disabled value="">Select Reason</option>
            <option v-if="reasonOptions.length === 0" disabled>No reasons available</option>
            <option v-for="reason in reasonOptions" :key="reason.value" :value="reason.value">
              {{ reason.text }}
            </option>
          </select>
        </div>
        <div>
          <label for="reasonForConductingDetails" class="block text-sm font-medium text-gray-700">
            Reason Details <span class="text-red-500">*</span>
          </label>
          <textarea
            id="reasonForConductingDetails"
            v-model="form.reasonForConductingDetails"
            required
            rows="3"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Provide details for the reason"
          ></textarea>
        </div>
      </section>

      <!-- Resource Persons Details -->
      <section class="space-y-4 p-4 border border-gray-200 rounded-md shadow-sm">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-800 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-blue-600 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Resource Persons Details
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            Add information about the resource persons who will be conducting or supporting this CPD
            program.
          </p>
        </div>

        <!-- General Errors -->
        <div v-if="resourcePersonErrors.general" class="text-red-500 text-sm mt-2">
          <p v-for="(error, index) in resourcePersonErrors.general" :key="`general-error-${index}`">
            {{ error }}
          </p>
        </div>

        <!-- Primary Resource Person -->
        <div
          class="bg-gradient-to-r from-blue-50 to-blue-50 p-5 rounded-lg border border-blue-100 shadow-sm"
        >
          <h3 class="text-md font-medium text-gray-800 mb-3">Primary Resource Person</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Registration Number -->
            <div>
              <label :for="'rpRegNo0'" class="block text-sm font-medium text-gray-700"
                >Registration Number <span class="text-red-500">*</span></label
              >
              <select
                :id="'rpRegNo0'"
                v-model="form.resourcePersons[0].regNo"
                required
                class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                :class="{ 'border-red-500': resourcePersonErrors[0]?.regNo }"
              >
                <option value="" disabled>Select Registration Number</option>
                <option v-if="availableRegistrations(0).length === 0" disabled>
                  No registrations available
                </option>
                <option
                  v-for="reg in availableRegistrations(0)"
                  :key="reg.id"
                  :value="reg.registration_no"
                >
                  {{ reg.registration_no }} ({{ reg.full_name }})
                </option>
              </select>
              <p v-if="resourcePersonErrors[0]?.regNo" class="text-red-500 text-sm mt-1">
                {{ resourcePersonErrors[0].regNo }}
              </p>
            </div>
            <!-- Certificates -->
            <div>
              <label :for="'rpCertificates0'" class="block text-sm font-medium text-gray-700"
                >Certificates <span class="text-red-500">*</span></label
              >
              <input
                type="file"
                :id="'rpCertificates0'"
                @change="handleResourcePersonFile($event, 0, 'certificate')"
                accept="application/pdf"
                class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                :class="{ 'border-red-500': resourcePersonErrors[0]?.certificate }"
              />
              <p v-if="resourcePersonErrors[0]?.certificate" class="text-red-500 text-sm mt-1">
                {{ resourcePersonErrors[0].certificate }}
              </p>
            </div>
          </div>
        </div>

        <!-- Additional Resource Persons -->
        <div v-if="form.resourcePersons.length > 1" class="space-y-4">
          <div
            v-for="(person, index) in form.resourcePersons.slice(1)"
            :key="`person-${index + 1}`"
            class="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm"
          >
            <div class="flex justify-between items-center mb-3">
              <h3 class="text-md font-medium text-gray-700">Resource Person {{ index + 2 }}</h3>
              <button
                @click.prevent="removeResourcePerson(index + 1)"
                type="button"
                class="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Registration Number -->
              <div>
                <label
                  :for="'rpRegNo' + (index + 1)"
                  class="block text-sm font-medium text-gray-700"
                  >Registration Number <span class="text-red-500">*</span></label
                >
                <select
                  :id="'rpRegNo' + (index + 1)"
                  v-model="person.regNo"
                  required
                  class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  :class="{ 'border-red-500': resourcePersonErrors[index + 1]?.regNo }"
                >
                  <option value="" disabled>Select Registration Number</option>
                  <option v-if="availableRegistrations(index + 1).length === 0" disabled>
                    No registrations available
                  </option>
                  <option
                    v-for="reg in availableRegistrations(index + 1)"
                    :key="reg.id"
                    :value="reg.registration_no"
                  >
                    {{ reg.registration_no }} ({{ reg.full_name }})
                  </option>
                </select>
                <p v-if="resourcePersonErrors[index + 1]?.regNo" class="text-red-500 text-sm mt-1">
                  {{ resourcePersonErrors[index + 1].regNo }}
                </p>
              </div>
              <!-- Certificates -->
              <div>
                <label
                  :for="'rpCertificates' + (index + 1)"
                  class="block text-sm font-medium text-gray-700"
                  >Certificates <span class="text-red-500">*</span></label
                >
                <input
                  type="file"
                  :id="'rpCertificates' + (index + 1)"
                  @change="handleResourcePersonFile($event, index + 1, 'certificate')"
                  accept="application/pdf"
                  class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  :class="{ 'border-red-500': resourcePersonErrors[index + 1]?.certificate }"
                />
                <p
                  v-if="resourcePersonErrors[index + 1]?.certificate"
                  class="text-red-500 text-sm mt-1"
                >
                  {{ resourcePersonErrors[index + 1].certificate }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Add Resource Person Button -->
        <button
          @click.prevent="addResourcePerson"
          type="button"
          class="mt-4 w-full p-3 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 flex items-center justify-center"
        >
          <span class="mr-2">+</span> Add Another Resource Person
        </button>
      </section>

      <!-- Teaching Learning Method -->
      <section class="space-y-4 p-4 border border-gray-200 rounded-md shadow-sm">
        <h2 class="text-xl font-semibold text-gray-800 mb-3">Teaching Learning Method</h2>
        <div>
          <label for="typeOfCpd" class="block text-sm font-medium text-gray-700"
            >Type of CPD <span class="text-red-500">*</span></label
          >
          <select
            id="typeOfCpd"
            v-model="form.typeOfCpd"
            required
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
          >
            <option disabled value="">Select CPD Type</option>
            <option v-if="cpdTypeOptions.length === 0" disabled>No CPD types available</option>
            <option v-for="cpdType in cpdTypeOptions" :key="cpdType.value" :value="cpdType.value">
              {{ cpdType.text }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Methodologies (Select multiple) <span class="text-red-500">*</span></label
          >
          <div class="mt-2 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
            <label v-if="methodologyOptions.length === 0" class="text-sm text-gray-500"
              >No methodologies available</label
            >
            <label
              v-for="method in methodologyOptions"
              :key="method.value"
              class="inline-flex items-center"
            >
              <input
                type="checkbox"
                :value="method.value"
                v-model="form.methodologies"
                class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">{{ method.text }}</span>
            </label>
          </div>
        </div>
        <div>
          <label for="expectedOutcome" class="block text-sm font-medium text-gray-700"
            >Expected Outcome <span class="text-red-500">*</span></label
          >
          <textarea
            id="expectedOutcome"
            v-model="form.expectedOutcome"
            required
            rows="3"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
            placeholder="Describe expected outcome"
          ></textarea>
        </div>
        <div>
          <label for="activity" class="block text-sm font-medium text-gray-700"
            >Activity <span class="text-red-500">*</span></label
          >
          <textarea
            id="activity"
            v-model="form.activity"
            required
            rows="2"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
            placeholder="Describe activity"
          ></textarea>
        </div>
        <div>
          <label for="duration" class="block text-sm font-medium text-gray-700"
            >Duration (hours) <span class="text-red-500">*</span></label
          >
          <input
            type="number"
            id="duration"
            v-model.number="form.duration"
            required
            min="1"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
            placeholder="Enter duration in hours"
          />
        </div>
        <div>
          <label for="credit" class="block text-sm font-medium text-gray-700">Credit</label>
          <input
            type="number"
            id="credit"
            :value="credit"
            readonly
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm"
            placeholder="Auto-calculated"
          />
        </div>
        <div>
          <label for="courseDocument" class="block text-sm font-medium text-gray-700"
            >Course Document <span class="text-red-500">*</span></label
          >
          <input
            type="file"
            id="courseDocument"
            @change="handleFileUpload($event, 'courseDocument')"
            accept="application/pdf"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </section>

      <!-- Participants Details -->
      <section class="space-y-4 p-4 border border-gray-200 rounded-md shadow-sm">
        <h2 class="text-xl font-semibold text-gray-800 mb-3">Participants Details</h2>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Participation Category (Select multiple) <span class="text-red-500">*</span></label
          >
          <div class="mt-2 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
            <label v-if="participationCategoryOptions.length === 0" class="text-sm text-gray-500"
              >No categories available</label
            >
            <label
              v-for="cat in participationCategoryOptions"
              :key="cat.value"
              class="inline-flex items-center"
            >
              <input
                type="checkbox"
                :value="cat.value"
                v-model="form.participationCategories"
                class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">{{ cat.text }}</span>
            </label>
          </div>
          <p v-if="participantDetailsErrors.categories" class="text-red-500 text-sm mt-1">
            {{ participantDetailsErrors.categories }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Participant Sub-Category (Select multiple) <span class="text-red-500">*</span></label
          >
          <div class="mt-2 grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
            <label v-if="participantSubcategoryOptions.length === 0" class="text-sm text-gray-500"
              >No sub-categories available</label
            >
            <label
              v-for="subCat in filteredSubcategories"
              :key="subCat.value"
              class="inline-flex items-center"
            >
              <input
                type="checkbox"
                :value="subCat.value"
                v-model="form.participantSubCategory"
                class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">{{ subCat.text }}</span>
            </label>
          </div>
          <p v-if="participantDetailsErrors.subcategories" class="text-red-500 text-sm mt-1">
            {{ participantDetailsErrors.subcategories }}
          </p>
        </div>
        <div>
          <label for="numberOfParticipants" class="block text-sm font-medium text-gray-700"
            >Number of Participants <span class="text-red-500">*</span></label
          >
          <input
            type="number"
            id="numberOfParticipants"
            v-model.number="form.numberOfParticipants"
            required
            min="1"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
            placeholder="Enter number"
          />
          <p v-if="participantDetailsErrors.number" class="text-red-500 text-sm mt-1">
            {{ participantDetailsErrors.number }}
          </p>
        </div>
        <div>
          <label for="relevanceToProfession" class="block text-sm font-medium text-gray-700"
            >Relevance to your profession
            <span class="text-red-500" v-if="form.participationCategories.length > 1"
              >*</span
            ></label
          >
          <textarea
            id="relevanceToProfession"
            v-model="form.relevanceToProfession"
            :required="form.participationCategories.length > 1"
            rows="3"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
            placeholder="Describe relevance"
          ></textarea>
          <p v-if="participantDetailsErrors.relevance" class="text-red-500 text-sm mt-1">
            {{ participantDetailsErrors.relevance }}
          </p>
        </div>
      </section>

      <!-- Approved CPD Participants -->
      <section
        v-if="form.isCpdValidated === 'true'"
        class="space-y-4 p-4 border border-gray-200 rounded-md shadow-sm"
      >
        <h2 class="text-xl font-semibold text-gray-800 mb-3">Approved CPD Participants</h2>
        <div
          v-for="(participant, index) in form.participants"
          :key="`participant-${index}`"
          class="space-y-3 p-3 my-2 border border-gray-200 rounded-md"
        >
          <div class="flex justify-between items-center">
            <h3 class="text-md font-medium text-gray-700">Participant {{ index + 1 }}</h3>
            <button
              @click.prevent="removeParticipant(index)"
              type="button"
              class="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Remove
            </button>
          </div>
          <div>
            <label :for="'participantRegNo' + index" class="block text-sm font-medium text-gray-700"
              >Registration Number</label
            >
            <input
              type="text"
              :id="'participantRegNo' + index"
              v-model="participant.regNo"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              placeholder="Enter Registration Number"
            />
          </div>
          <div>
            <label :for="'participantName' + index" class="block text-sm font-medium text-gray-700"
              >Name</label
            >
            <input
              type="text"
              :id="'participantName' + index"
              v-model="participant.name"
              readonly
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-50"
              placeholder="Auto-populated"
            />
          </div>
        </div>
        <button
          @click.prevent="addParticipant"
          type="button"
          class="mt-2 px-3 py-1.5 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Add Participant
        </button>
        <div>
          <label for="attendanceSheet" class="block text-sm font-medium text-gray-700"
            >Attendance Sheet
            <span class="text-red-500" v-if="form.participants.length > 0">*</span></label
          >
          <input
            type="file"
            id="attendanceSheet"
            @change="handleFileUpload($event, 'attendanceSheet')"
            accept="application/pdf"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <div>
          <label for="attachment" class="block text-sm font-medium text-gray-700"
            >General Attachment <span class="text-red-500">*</span></label
          >
          <input
            type="file"
            id="attachment"
            @change="handleFileUpload($event, 'attachment')"
            accept="application/pdf"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </section>

      <!-- Form Actions -->
      <div class="flex justify-end pt-4 space-x-4">
        <button
          type="button"
          @click="cancelForm"
          class="px-6 py-2.5 bg-gray-300 text-gray-700 font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="saveDraft"
          :disabled="loading"
          class="px-6 py-2.5 bg-yellow-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-yellow-600"
        >
          Save Draft
        </button>
        <button
          type="submit"
          :disabled="loading || !isFormValid"
          class="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          Submit Application
        </button>
      </div>
    </form>
    <div v-else class="bg-white border rounded-xl shadow-sm p-6 text-center my-4">
      <p class="text-gray-600 font-semibold">Loading form options...</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import apiService from '@/services/services'

export default {
  name: 'CPDProviderApplication',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const form = ref({
      registrationNumber: '',
      cidNo: '',
      fullName: '',
      agencyTrainingLocation: '',
      isCpdValidated: 'false',
      cpdApprovalLetter: null,
      titleOfCpd: '',
      venue: '',
      fromDate: '',
      toDate: '',
      cpdProvidingAgency: '',
      otherCpdProvidingAgency: '',
      reasonForConducting: '',
      reasonForConductingDetails: '',
      resourcePersons: [{ regNo: '', certificate: null }], // Removed name property
      typeOfCpd: '',
      methodologies: [],
      expectedOutcome: '',
      activity: '',
      duration: null,
      courseDocument: null,
      participationCategories: [],
      participantSubCategory: [],
      numberOfParticipants: null,
      relevanceToProfession: '',
      participants: [],
      attendanceSheet: null,
      attachment: null,
    })

    const cpdAgencyOptions = ref([])
    const reasonOptions = ref([])
    const cpdTypeOptions = ref([])
    const methodologyOptions = ref([])
    const participationCategoryOptions = ref([])
    const participantSubcategoryOptions = ref([])
    const userRegistrations = ref([])
    const loading = ref(false)
    const validationErrors = ref([])
    const participantDetailsErrors = ref({})
    const resourcePersonErrors = ref({}) // Added for granular error handling
    const successMessage = ref('')
    const areOptionsLoaded = ref(false)

    const filteredSubcategories = computed(() => {
      if (!form.value.participationCategories.length) {
        return participantSubcategoryOptions.value
      }
      return participantSubcategoryOptions.value.filter((subCat) =>
        form.value.participationCategories.includes(subCat.categoryId),
      )
    })

    const availableRegistrations = (index) => {
      const selectedRegNos = form.value.resourcePersons
        .filter((_, i) => i !== index)
        .map((p) => p.regNo)
        .filter(Boolean)
      return userRegistrations.value.filter((reg) => !selectedRegNos.includes(reg.registration_no))
    }

    const credit = computed(() => {
      return form.value.duration ? Number(form.value.duration) : 0 // 1 hour = 1 credit
    })

    const fetchApplicantDetails = async () => {
      try {
        loading.value = true
        const cid = authStore.user?.cid
        if (!cid) {
          // This case should ideally not be hit if the user is logged in,
          // as onMounted already populates from the store.
          return
        }
        const response = await apiService.getMhpcFullApplicationListByCid(cid)
        const results = response.data?.results || []

        if (results.length > 0) {
          const userData = results[0]
          // Primarily fetch the registration number.
          // The name and CID are already set from the auth store but can be updated
          // if the API is considered a more definitive source.
          form.value.registrationNumber = userData.registration_no || ''
          form.value.fullName = userData.full_name || form.value.fullName
          form.value.cidNo = userData.cid_no || form.value.cidNo
        } else {
          // This is a valid scenario for a new applicant, not an error.
          // The form will retain the details from the auth store.
          console.log('No existing application found for this user.')
        }
      } catch (error) {
        // Only show an error if the API call itself fails.
        validationErrors.value.push(
          'Failed to check for existing registration: ' + (error.message || 'Unknown error'),
        )
        console.error('fetchApplicantDetails error:', error)
      } finally {
        loading.value = false
      }
    }

    const fetchUserRegistrations = async () => {
      try {
        loading.value = true
        const response = await apiService.getMhpcNewApplications()
        userRegistrations.value =
          response.data?.results?.map((app) => ({
            id: app.id,
            registration_no: app.registration_no,
            full_name: app.full_name,
            cid_no: app.cid_no,
          })) || []
        userRegistrations.value.sort((a, b) => a.full_name.localeCompare(b.full_name))
      } catch (error) {
        validationErrors.value.push('Error fetching registered users.')
        console.error('fetchUserRegistrations error:', error)
      } finally {
        loading.value = false
      }
    }

    const fetchDropdownOptions = async () => {
      try {
        loading.value = true
        const [
          agencyResponse,
          reasonResponse,
          cpdTypeResponse,
          methodologyResponse,
          categoriesResponse,
          subcategoriesResponse,
        ] = await Promise.all([
          apiService.getProvidingAgency(),
          apiService.getReasonForCoducting(),
          apiService.getMhpcMastersCpdActivities(),
          apiService.getMhpcMastersCpdMethodologies(),
          apiService.getMhpcMasterData('personnel-categories'),
          apiService.getMhpcMastersSubCategories(),
        ])

        cpdAgencyOptions.value =
          agencyResponse.data?.results?.map((item) => ({
            text: item.name,
            value: item.id,
          })) || []
        cpdAgencyOptions.value.push({ text: 'Other', value: 'other' })

        reasonOptions.value =
          reasonResponse.data?.results?.map((item) => ({
            text: item.name,
            value: item.id,
          })) || []

        cpdTypeOptions.value =
          cpdTypeResponse.data?.results?.map((item) => ({
            text: item.cme_activity_name,
            value: item.id,
          })) || []

        methodologyOptions.value =
          methodologyResponse.data?.results?.map((item) => ({
            text: item.methodology_name,
            value: item.id,
          })) || []

        participationCategoryOptions.value =
          categoriesResponse.data?.results?.map((category) => ({
            text: category.category_name,
            value: category.id,
          })) || []

        participantSubcategoryOptions.value =
          subcategoriesResponse.data?.results?.map((subcategory) => ({
            text: subcategory.sub_category_name,
            value: subcategory.id,
            categoryId: subcategory.category_id || subcategory.category,
          })) || []

        areOptionsLoaded.value = true
      } catch (error) {
        validationErrors.value.push(
          'Failed to load dropdown options: ' + (error.message || 'Unknown error'),
        )
        console.error('fetchDropdownOptions error:', error)
      } finally {
        loading.value = false
      }
    }

    const fetchParticipantName = async (index) => {
      const participant = form.value.participants[index]
      if (!participant.regNo) {
        participant.name = ''
        return
      }
      try {
        loading.value = true
        const response = await apiService.getMhpcFullApplicationListByCid('')
        const results = response.data?.results || []
        const matchingApplication = results.find((app) => app.registration_no === participant.regNo)
        participant.name = matchingApplication ? matchingApplication.full_name || '' : ''
        if (!participant.name) {
          validationErrors.value.push(
            `Invalid participant registration number: ${participant.regNo}`,
          )
        }
      } catch (error) {
        validationErrors.value.push(
          `Failed to fetch name for Participant Registration Number ${participant.regNo}`,
        )
        console.error('fetchParticipantName error:', error)
        participant.name = ''
      } finally {
        loading.value = false
      }
    }

    const handleFileUpload = (event, fieldName) => {
      const file = event.target.files?.[0]
      if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
        form.value[fieldName] = file
      } else {
        form.value[fieldName] = null
        event.target.value = ''
        validationErrors.value.push(
          `Please upload a valid PDF file less than 5MB for ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()}.`,
        )
      }
    }

    const handleResourcePersonFile = (event, index, fieldNameInPersonObject) => {
      const file = event.target.files?.[0]
      if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
        form.value.resourcePersons[index][fieldNameInPersonObject] = file
      } else {
        form.value.resourcePersons[index][fieldNameInPersonObject] = null
        event.target.value = ''
        validationErrors.value.push(
          `Please upload a valid PDF file less than 5MB for Resource Person ${index + 1} certificates.`,
        )
      }
    }

    const addResourcePerson = () => {
      form.value.resourcePersons.push({ regNo: '', certificate: null })
    }

    const removeResourcePerson = (index) => {
      if (form.value.resourcePersons.length > 1) {
        form.value.resourcePersons.splice(index, 1)
      } else {
        validationErrors.value.push('At least one resource person is required.')
      }
    }

    const addParticipant = () => {
      form.value.participants.push({ regNo: '', name: '' })
    }

    const removeParticipant = (index) => {
      form.value.participants.splice(index, 1)
    }

    const validateForm = () => {
      validationErrors.value = []
      participantDetailsErrors.value = {}
      resourcePersonErrors.value = {}

      if (!form.value.agencyTrainingLocation?.trim()) {
        validationErrors.value.push('Agency/Training Location is required.')
      }

      if (form.value.isCpdValidated === 'false') {
        if (!form.value.titleOfCpd?.trim()) {
          validationErrors.value.push('Title of CPD is required.')
        }
        if (!form.value.venue?.trim()) {
          validationErrors.value.push('Venue is required.')
        }
        if (!form.value.fromDate) {
          validationErrors.value.push('From Date is required.')
        }
        if (!form.value.toDate) {
          validationErrors.value.push('To Date is required.')
        }
        if (
          form.value.fromDate &&
          form.value.toDate &&
          new Date(form.value.fromDate) > new Date(form.value.toDate)
        ) {
          validationErrors.value.push('To Date must be after From Date.')
        }
      } else if (form.value.isCpdValidated === 'true' && !form.value.cpdApprovalLetter) {
        validationErrors.value.push('Approval Letter is required for approved CPD.')
      }

      if (!form.value.cpdProvidingAgency) {
        validationErrors.value.push('CPD Providing Agency is required.')
      }
      if (
        form.value.cpdProvidingAgency === 'other' &&
        !form.value.otherCpdProvidingAgency?.trim()
      ) {
        validationErrors.value.push('Please specify the Other Agency.')
      }
      if (!form.value.reasonForConducting) {
        validationErrors.value.push('Reason for Conducting is required.')
      }
      if (!form.value.reasonForConductingDetails?.trim()) {
        validationErrors.value.push('Reason Details are required.')
      }

      // Resource Persons Validation
      const generalErrors = []
      const regNos = form.value.resourcePersons.map((p) => p.regNo).filter(Boolean)
      const uniqueRegNos = new Set(regNos)
      if (uniqueRegNos.size < regNos.length) {
        generalErrors.push('Each Resource Person must have a unique Registration Number.')
      }

      if (form.value.resourcePersons.length === 0) {
        generalErrors.push('At least one Resource Person is required.')
      }

      form.value.resourcePersons.forEach((person, index) => {
        resourcePersonErrors.value[index] = {}
        if (!person.regNo) {
          resourcePersonErrors.value[index].regNo =
            `Registration Number is required for Resource Person ${index + 1}.`
          validationErrors.value.push(
            `Registration Number is required for Resource Person ${index + 1}.`,
          )
        } else if (!userRegistrations.value.some((reg) => reg.registration_no === person.regNo)) {
          resourcePersonErrors.value[index].regNo =
            `Invalid Registration Number for Resource Person ${index + 1}.`
          validationErrors.value.push(
            `Invalid Registration Number for Resource Person ${index + 1}.`,
          )
        }
        if (!person.certificate) {
          resourcePersonErrors.value[index].certificate =
            `Certificates are required for Resource Person ${index + 1}.`
          validationErrors.value.push(`Certificates are required for Resource Person ${index + 1}.`)
        }
      })

      if (generalErrors.length > 0) {
        resourcePersonErrors.value.general = generalErrors
        validationErrors.value.push(...generalErrors)
      }

      if (!form.value.typeOfCpd) {
        validationErrors.value.push('Type of CPD is required.')
      }
      if (!form.value.methodologies.length) {
        validationErrors.value.push('At least one Methodology must be selected.')
      }
      if (!form.value.expectedOutcome?.trim()) {
        validationErrors.value.push('Expected Outcome is required.')
      }
      if (!form.value.activity?.trim()) {
        validationErrors.value.push('Activity is required.')
      }
      if (!form.value.duration || form.value.duration <= 0) {
        validationErrors.value.push('Duration must be a positive number.')
      }
      if (!form.value.courseDocument) {
        validationErrors.value.push('Course Document is required.')
      }

      if (!form.value.participationCategories.length) {
        participantDetailsErrors.value.categories =
          'At least one Participation Category is required.'
        validationErrors.value.push('At least one Participation Category is required.')
      }
      if (
        participantSubcategoryOptions.value.length > 0 &&
        !form.value.participantSubCategory.length
      ) {
        participantDetailsErrors.value.subcategories =
          'At least one Participant Sub-Category is required.'
        validationErrors.value.push('At least one Participant Sub-Category is required.')
      }
      if (!form.value.numberOfParticipants || form.value.numberOfParticipants <= 0) {
        participantDetailsErrors.value.number = 'Number of Participants must be a positive number.'
        validationErrors.value.push('Number of Participants must be a positive number.')
      }
      if (
        form.value.participationCategories.length > 1 &&
        !form.value.relevanceToProfession?.trim()
      ) {
        participantDetailsErrors.value.relevance =
          'Relevance to profession is required when multiple categories are selected.'
        validationErrors.value.push(
          'Relevance to profession is required when multiple categories are selected.',
        )
      }

      if (form.value.isCpdValidated === 'true') {
        if (!form.value.attachment) {
          validationErrors.value.push('General Attachment is required for approved CPD.')
        }
        if (form.value.participants.length > 0 && !form.value.attendanceSheet) {
          validationErrors.value.push(
            'Attendance Sheet is required when participants are listed for approved CPD.',
          )
        }
      }

      return validationErrors.value.length === 0
    }

    const isFormValid = computed(() => validateForm())

    const prepareFormData = (isDraft = false) => {
      const formData = new FormData()
      formData.append('cid_no', form.value.cidNo || '')
      formData.append('full_name', form.value.fullName || '')
      formData.append('proposed_training_location', form.value.agencyTrainingLocation?.trim() || '')

      const isCpdApprovedFlag = form.value.isCpdValidated === 'true'
      formData.append('is_cpd_approved', isCpdApprovedFlag)

      if (!isCpdApprovedFlag) {
        formData.append('title_of_cpd', form.value.titleOfCpd?.trim() || '')
        formData.append('venue', form.value.venue?.trim() || '')
        formData.append('from_date', form.value.fromDate || '')
        formData.append('to_date', form.value.toDate || '')
      } else {
        if (form.value.cpdApprovalLetter)
          formData.append('approval_letter_attachment', form.value.cpdApprovalLetter)
        if (form.value.attachment)
          formData.append('general_approved_cpd_attachment', form.value.attachment)
      }

      formData.append(
        'cpd_providing_agency',
        form.value.cpdProvidingAgency === 'other' ? '' : form.value.cpdProvidingAgency || '',
      )
      if (form.value.cpdProvidingAgency === 'other') {
        formData.append('if_others_specify', form.value.otherCpdProvidingAgency?.trim() || '')
      }
      formData.append('reason_for_conducting', form.value.reasonForConducting || '')
      formData.append('reason_for_details', form.value.reasonForConductingDetails?.trim() || '')

      const validResourcePersons = form.value.resourcePersons
        .filter((person) => person.regNo && person.certificate)
        .map((person) => ({
          resource_person_reg_no: person.regNo,
          resource_person_name:
            userRegistrations.value.find((r) => r.registration_no === person.regNo)?.full_name ||
            '',
          document_supporting_expertise: person.certificate,
        }))
      validResourcePersons.forEach((person, index) => {
        formData.append(
          `resources[${index}][resource_person_reg_no]`,
          person.resource_person_reg_no,
        )
        formData.append(`resources[${index}][resource_person_name]`, person.resource_person_name)
        formData.append(
          `resources[${index}][document_supporting_expertise]`,
          person.document_supporting_expertise,
        )
      })

      formData.append('type_of_cpd', form.value.typeOfCpd || '')
      if (form.value.methodologies.length > 0) {
        formData.append(
          'methodologies',
          JSON.stringify(
            form.value.methodologies.map((methodId) => ({ methodology_name: methodId })),
          ),
        )
      }

      if (form.value.activity?.trim() && Number(form.value.duration) > 0) {
        formData.append(
          'learning_methods',
          JSON.stringify({
            activities: form.value.activity.trim(),
            duration: Number(form.value.duration),
          }),
        )
        formData.append('cpd_credits', credit.value)
      }

      formData.append('expected_outcome', form.value.expectedOutcome?.trim() || '')
      if (form.value.courseDocument) formData.append('course_document', form.value.courseDocument)

      formData.append('participation_category', JSON.stringify(form.value.participationCategories))
      formData.append('participant_sub_category', JSON.stringify(form.value.participantSubCategory))
      formData.append('number_of_participants', form.value.numberOfParticipants || 0)
      formData.append('relevance_to_topic', form.value.relevanceToProfession?.trim() || '')

      if (isCpdApprovedFlag && form.value.participants.length > 0) {
        const validParticipants = form.value.participants
          .filter((p) => p.regNo && p.name)
          .map((p) => ({
            participant_reg_no: p.regNo,
            cpd_credits: credit.value,
            review_status: 'Pending',
          }))
        if (validParticipants.length > 0) {
          formData.append('participants', JSON.stringify(validParticipants))
        }
        if (form.value.attendanceSheet)
          formData.append('attendance_sheet_attachment', form.value.attendanceSheet)
      }

      formData.append('is_draft', isDraft)
      return formData
    }

    const saveDraft = async () => {
      if (!form.value.agencyTrainingLocation?.trim() && !form.value.titleOfCpd?.trim()) {
        validationErrors.value = [
          'Please fill in at least Agency/Training Location or Title to save a draft.',
        ]
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      try {
        loading.value = true
        const formData = prepareFormData(true)
        await apiService.createMhpcCpdTask(formData)
        successMessage.value = 'Draft saved successfully!'
        validationErrors.value = []
        setTimeout(() => {
          successMessage.value = ''
        }, 3000)
      } catch (error) {
        validationErrors.value = ['Error saving draft: ' + (error.message || 'Unknown error')]
        console.error('saveDraft error:', error)
      } finally {
        loading.value = false
      }
    }

    const handleSubmit = async () => {
      if (!isFormValid.value) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      try {
        loading.value = true
        const formData = prepareFormData(false)
        await apiService.createMhpcCpdTask(formData)
        successMessage.value = 'CPD application submitted successfully!'
        validationErrors.value = []
        setTimeout(() => {
          router.push('/health_certification/track_cpd_applications')
        }, 2000)
      } catch (error) {
        validationErrors.value = ['Error submitting form: ' + (error.message || 'Unknown error')]
        if (error.response?.data) {
          const backendErrors = Object.entries(error.response.data).map(
            ([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`,
          )
          validationErrors.value.push(...backendErrors)
        }
        console.error('handleSubmit error:', error)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } finally {
        loading.value = false
      }
    }

    const cancelForm = () => {
      router.push('/health_certification/dashboard')
    }

    watch(
      () => form.value.participants,
      (newValue) => {
        newValue.forEach((participant, index) => {
          if (participant.regNo && !participant.name) {
            fetchParticipantName(index)
          }
        })
      },
      { deep: true },
    )

    watch(
      () => form.value.isCpdValidated,
      (newValue) => {
        if (newValue === 'false') {
          form.value.cpdApprovalLetter = null
          form.value.attachment = null
          form.value.attendanceSheet = null
          form.value.participants = []
          const inputs = ['cpdApprovalLetter', 'attachment', 'attendanceSheet']
            .map((id) => document.querySelector(`#${id}`))
            .filter(Boolean)
          inputs.forEach((input) => {
            input.value = ''
          })
        }
      },
    )

    onMounted(async () => {
      // Step 1: Immediately populate details from the auth store for a responsive UI.
      form.value.cidNo = authStore.user?.cid || ''
      form.value.fullName =
        [authStore.user?.first_name, authStore.user?.middle_name, authStore.user?.last_name]
          .filter(Boolean)
          .join(' ') || ''

      // Step 2: Asynchronously fetch all necessary data in parallel.
      await Promise.all([
        fetchApplicantDetails(), // Fetches supplementary details like registration number.
        fetchUserRegistrations(),
        fetchDropdownOptions(),
      ])
    })

    return {
      form,
      cpdAgencyOptions,
      reasonOptions,
      cpdTypeOptions,
      methodologyOptions,
      participationCategoryOptions,
      participantSubcategoryOptions,
      filteredSubcategories,
      userRegistrations,
      availableRegistrations,
      credit,
      loading,
      validationErrors,
      participantDetailsErrors,
      resourcePersonErrors,
      successMessage,
      areOptionsLoaded,
      isFormValid,
      fetchParticipantName,
      handleFileUpload,
      handleResourcePersonFile,
      addResourcePerson,
      removeResourcePerson,
      addParticipant,
      removeParticipant,
      saveDraft,
      handleSubmit,
      cancelForm,
    }
  },
}
</script>

<style scoped>
.cpd-provider-application {
  max-width: 768px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

input[type='file']::file-selector-button {
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border-width: 0;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: #e0f2fe;
  color: #0c4a6e;
}

input[type='file']::file-selector-button:hover {
  background-color: #bae6fd;
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23333333' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.5em;
}

.grid label {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
</style>
