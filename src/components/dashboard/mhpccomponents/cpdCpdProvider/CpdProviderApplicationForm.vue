<template>
  <div class="font-sans">
    <div class="container mx-auto p-4 sm:p-6 lg:p-8">
      <div class="text-center mb-12">
        <h1 class="text-5xl font-extrabold text-gray-800">CPD Provider Application</h1>
        <p class="text-lg text-gray-500 mt-3">
          A streamlined form for submitting Continuing Professional Development programs.
        </p>
      </div>

      <div
        v-if="loading"
        class="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center z-50"
      >
        <div
          class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"
        ></div>
        <p class="mt-4 text-gray-700 text-lg font-semibold">{{ loadingMessage }}</p>
      </div>

      <Transition name="fade">
        <div v-if="validationErrors.length > 0 || successMessage" class="mb-6 space-y-4">
          <div
            v-if="validationErrors.length > 0"
            class="bg-red-50 border-l-4 border-red-600 text-red-900 p-4 rounded-r-lg shadow-lg"
            role="alert"
          >
            <div class="flex">
              <div class="py-1">
                <svg
                  class="h-6 w-6 text-red-600 mr-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p class="font-bold">Please correct the following errors:</p>
                <ul class="mt-2 list-disc list-inside text-sm">
                  <li v-for="(error, index) in validationErrors" :key="`error-${index}`">
                    {{ error }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            v-if="successMessage"
            class="bg-green-50 border-l-4 border-green-600 text-green-900 p-4 rounded-r-lg shadow-lg flex items-center"
            role="alert"
          >
            <svg
              class="h-6 w-6 mr-3 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p class="font-bold text-lg">Success!</p>
              <p>{{ successMessage }}</p>
            </div>
          </div>
        </div>
      </Transition>

      <form @submit.prevent="handleSubmit" class="space-y-12">
        <section class="card">
          <h2 class="card-header">1. Applicant Details</h2>
          <div class="card-body grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label class="form-label-disabled">CID No./Identity/Work Permit No.</label>
              <input
                type="text"
                :value="applicant.cidNumber"
                disabled
                class="form-input-disabled"
                placeholder="Auto-filled from login"
              />
            </div>
            <div>
              <label class="form-label-disabled">Full Name</label>
              <input
                type="text"
                :value="applicant.fullName"
                disabled
                class="form-input-disabled"
                placeholder="Auto-filled from login"
              />
            </div>
            <div class="md:col-span-2">
              <label for="agencyTrainingLocation" class="form-label"
                >Agency/Training Location <span class="text-red-500">*</span></label
              >
              <input
                type="text"
                id="agencyTrainingLocation"
                v-model="applicant.agencyTrainingLocation"
                class="form-input"
                placeholder="e.g., JDWNR Hospital, Thimphu"
              />
              <p v-if="applicantDetailsErrors.agencyTrainingLocation" class="form-error-text">
                {{ applicantDetailsErrors.agencyTrainingLocation }}
              </p>
            </div>
          </div>
        </section>

        <section class="card">
          <h2 class="card-header">2. Application Details</h2>
          <div class="card-body space-y-6">
            <div>
              <label class="form-label"
                >Is this CPD approved by KYGUMBS or an International Agency?
                <span class="text-red-500">*</span></label
              >
              <div class="mt-2 flex items-center space-x-6">
                <label class="flex items-center text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    v-model="application.isApproved"
                    value="true"
                    name="isCpdApproved"
                    class="form-radio"
                    @change="toggleApprovedFields"
                  />
                  <span class="ml-2">Yes</span>
                </label>
                <label class="flex items-center text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    v-model="application.isApproved"
                    value="false"
                    name="isCpdApproved"
                    class="form-radio"
                    @change="toggleApprovedFields"
                  />
                  <span class="ml-2">No</span>
                </label>
              </div>
            </div>

            <Transition name="fade-in-down">
              <div v-if="application.isApproved === 'true'">
                <label class="form-label"
                  >Attach Approval Letter <span class="text-red-500">*</span></label
                >
                <label
                  for="approvalLetter"
                  class="file-drop-area"
                  :class="{ 'file-drop-area-active': approvalLetter }"
                >
                  <input
                    id="approvalLetter"
                    type="file"
                    class="sr-only"
                    @change="handleFileChange($event, 'approvalLetter')"
                    accept=".pdf"
                  />
                  <div class="text-center">
                    <svg
                      class="mx-auto h-10 w-10 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p v-if="!approvalLetter" class="mt-2 text-sm text-gray-600">
                      <span class="font-semibold text-indigo-600">Click to upload</span> or drag and
                      drop
                    </p>
                    <p
                      v-if="approvalLetter"
                      class="mt-2 text-sm text-green-700 font-semibold truncate"
                    >
                      {{ approvalLetter.name }}
                    </p>
                    <p class="mt-1 text-xs text-gray-500">PDF up to 5MB</p>
                  </div>
                </label>
                <button
                  v-if="approvalLetter"
                  @click="clearFile('approvalLetter')"
                  type="button"
                  class="mt-2 text-xs text-red-600 hover:text-red-800"
                >
                  &times; Clear file
                </button>
                <p v-if="applicationDetailsErrors.approvalLetter" class="form-error-text">
                  {{ applicationDetailsErrors.approvalLetter }}
                </p>
              </div>
            </Transition>

            <div>
              <label for="cpdTitle" class="form-label"
                >Title of CPD <span class="text-red-500">*</span></label
              >
              <input
                type="text"
                id="cpdTitle"
                v-model="application.title"
                class="form-input"
                placeholder="e.g., Advanced Cardiac Life Support"
              />
              <p v-if="applicationDetailsErrors.title" class="form-error-text">
                {{ applicationDetailsErrors.title }}
              </p>
            </div>
            <div>
              <label for="cpdVenue" class="form-label"
                >Venue <span class="text-red-500">*</span></label
              >
              <input
                type="text"
                id="cpdVenue"
                v-model="application.venue"
                class="form-input"
                placeholder="e.g., Conference Hall A"
              />
              <p v-if="applicationDetailsErrors.venue" class="form-error-text">
                {{ applicationDetailsErrors.venue }}
              </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="fromDate" class="form-label"
                  >From Date <span class="text-red-500">*</span></label
                >
                <input
                  type="date"
                  id="fromDate"
                  v-model="application.fromDate"
                  class="form-input"
                />
                <p v-if="applicationDetailsErrors.fromDate" class="form-error-text">
                  {{ applicationDetailsErrors.fromDate }}
                </p>
              </div>
              <div>
                <label for="toDate" class="form-label"
                  >To Date <span class="text-red-500">*</span></label
                >
                <input type="date" id="toDate" v-model="application.toDate" class="form-input" />
                <p v-if="applicationDetailsErrors.toDate" class="form-error-text">
                  {{ applicationDetailsErrors.toDate }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section class="card">
          <h2 class="card-header">3. CPD Provider Details (Host)</h2>
          <div class="card-body grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="cpdProvidingAgency" class="form-label"
                >CPD Providing Agency <span class="text-red-500">*</span></label
              >
              <select id="cpdProvidingAgency" v-model="cpdProvider.agency" class="form-input">
                <option disabled value="">Select Agency</option>
                <option v-for="option in agencyOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
                <option value="other">Others (Specify)</option>
              </select>
              <p v-if="cpdProviderErrors.agency" class="form-error-text">
                {{ cpdProviderErrors.agency }}
              </p>
            </div>

            <Transition name="fade-in-down">
              <div v-if="cpdProvider.agency === 'other'">
                <label for="otherAgency" class="form-label"
                  >Specify Other Agency <span class="text-red-500">*</span></label
                >
                <input
                  type="text"
                  id="otherAgency"
                  v-model="cpdProvider.otherAgency"
                  class="form-input"
                  placeholder="Name of the agency"
                />
                <p v-if="cpdProviderErrors.otherAgency" class="form-error-text">
                  {{ cpdProviderErrors.otherAgency }}
                </p>
              </div>
            </Transition>

            <div
              class="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
              v-if="cpdProvider.agency !== 'other'"
            ></div>

            <div>
              <label for="reasonForConducting" class="form-label"
                >Reason for Conducting <span class="text-red-500">*</span></label
              >
              <select id="reasonForConducting" v-model="cpdProvider.reason" class="form-input">
                <option disabled value="">Select Reason</option>
                <option v-for="option in reasonOptions" :key="option.value" :value="option.value">
                  {{ option.text }}
                </option>
              </select>
              <p v-if="cpdProviderErrors.reason" class="form-error-text">
                {{ cpdProviderErrors.reason }}
              </p>
            </div>

            <div class="md:col-span-2">
              <label for="reasonDetails" class="form-label"
                >Reason Details <span class="text-red-500">*</span></label
              >
              <textarea
                id="reasonDetails"
                v-model="cpdProvider.reasonDetails"
                rows="3"
                class="form-input"
                placeholder="Provide a brief explanation..."
              ></textarea>
              <p v-if="cpdProviderErrors.reasonDetails" class="form-error-text">
                {{ cpdProviderErrors.reasonDetails }}
              </p>
            </div>
          </div>
        </section>

        <section class="card">
          <h2 class="card-header">4. Resource Persons Details</h2>
          <div class="card-body space-y-4">
            <TransitionGroup name="list" tag="div" class="space-y-6">
              <div
                v-for="(person, index) in resourcePersons"
                :key="person.id"
                class="p-4 border border-gray-200 rounded-lg relative bg-white"
              >
                <div class="flex justify-between items-center mb-4">
                  <h3 class="font-semibold text-gray-700">Resource Person {{ index + 1 }}</h3>
                  <button
                    v-if="resourcePersons.length > 1"
                    @click.prevent="removeResourcePerson(index)"
                    type="button"
                    class="button-remove"
                  >
                    <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Remove
                  </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label :for="`rpSelect-${index}`" class="form-label"
                      >Select Resource Person <span class="text-red-500">*</span></label
                    >
                    <select
                      :id="`rpSelect-${index}`"
                      v-model="person.selectedPersonId"
                      @change="updateResourcePersonDetails(person)"
                      class="form-input"
                    >
                      <option value="">-- Select Person --</option>
                      <option v-for="user in userRegistrations" :key="user.id" :value="user.id">
                        {{ user.full_name }} ({{ user.registration_no || user.cid_no }})
                      </option>
                    </select>
                    <p
                      v-if="resourcePersonsErrors[index]?.selectedPersonId"
                      class="form-error-text"
                    >
                      {{ resourcePersonsErrors[index].selectedPersonId }}
                    </p>
                    <p v-if="person.regNo" class="mt-1 text-xs text-gray-500">
                      RegNo/CID: {{ person.regNo }}
                    </p>
                  </div>
                  <div>
                    <label :for="`rpCertificates-${index}`" class="form-label"
                      >Doc Supporting Expertise <span class="text-red-500">*</span></label
                    >
                    <label
                      :for="`rpCertificates-${index}`"
                      class="file-drop-area !p-4"
                      :class="{ 'file-drop-area-active': person.certificate }"
                    >
                      <input
                        :id="`rpCertificates-${index}`"
                        type="file"
                        class="sr-only"
                        @change="handleFileChange($event, 'resourcePerson', index)"
                        accept=".pdf"
                      />
                      <div class="text-center">
                        <svg
                          class="mx-auto h-8 w-8 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p v-if="!person.certificate" class="mt-1 text-xs text-gray-600">
                          <span class="font-semibold text-indigo-600">Upload PDF</span>
                        </p>
                        <p
                          v-if="person.certificate"
                          class="mt-1 text-xs text-green-700 font-semibold truncate"
                        >
                          {{ person.certificate.name }}
                        </p>
                      </div>
                    </label>
                    <button
                      v-if="person.certificate"
                      @click="clearFile('resourcePerson', index)"
                      type="button"
                      class="mt-1 text-xs text-red-600 hover:text-red-800"
                    >
                      &times; Clear file
                    </button>
                    <p v-if="resourcePersonsErrors[index]?.certificate" class="form-error-text">
                      {{ resourcePersonsErrors[index].certificate }}
                    </p>
                  </div>
                </div>
              </div>
            </TransitionGroup>
            <button @click.prevent="addResourcePerson" type="button" class="button-add">
              <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Resource Person
            </button>
          </div>
        </section>

        <section class="card">
          <h2 class="card-header">5. Teaching & Learning Method</h2>
          <div class="card-body">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="cpdType" class="form-label"
                  >Type of CPD <span class="text-red-500">*</span></label
                >
                <select id="cpdType" v-model="teachingMethod.type" class="form-input">
                  <option disabled value="">Select Type</option>
                  <option
                    v-for="option in cpdTypeOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.text }}
                  </option>
                </select>
                <p v-if="teachingLearningErrors.type" class="form-error-text">
                  {{ teachingLearningErrors.type }}
                </p>
              </div>
              <div>
                <label class="form-label">Methodologies <span class="text-red-500">*</span></label>
                <div class="form-checkbox-group">
                  <label
                    v-for="option in methodologyOptions"
                    :key="option.value"
                    class="form-checkbox-label"
                  >
                    <input
                      type="checkbox"
                      :value="option.value"
                      v-model="selectedMethodologies"
                      class="form-checkbox"
                    />
                    <span class="ml-2">{{ option.text }}</span>
                  </label>
                </div>
                <p v-if="teachingLearningErrors.selectedMethodologies" class="form-error-text">
                  {{ teachingLearningErrors.selectedMethodologies }}
                </p>
              </div>
              <div class="md:col-span-2">
                <label for="expectedOutcome" class="form-label"
                  >Expected Outcome <span class="text-red-500">*</span></label
                >
                <textarea
                  id="expectedOutcome"
                  v-model="teachingMethod.expectedOutcome"
                  rows="3"
                  class="form-input"
                  placeholder="Describe the expected learning outcomes..."
                ></textarea>
                <p v-if="teachingLearningErrors.expectedOutcome" class="form-error-text">
                  {{ teachingLearningErrors.expectedOutcome }}
                </p>
              </div>
            </div>

            <div class="mt-8">
              <h3 class="font-semibold text-gray-800 mb-2">Activities & Durations</h3>
              <p class="text-sm text-gray-500 mb-4">
                Define the activities for this program. Total credits are auto-calculated (1 hour =
                1 credit).
              </p>
              <p v-if="teachingLearningErrors.teachingMethods" class="mb-2 text-sm text-red-600">
                {{ teachingLearningErrors.teachingMethods }}
              </p>
              <TransitionGroup name="list" tag="div" class="space-y-4">
                <div
                  v-for="(method, index) in teachingMethods"
                  :key="method.id"
                  class="grid grid-cols-[1fr_auto_auto] gap-4 items-end p-4 border bg-gray-50/80 rounded-lg"
                >
                  <div class="flex-grow">
                    <label :for="`activity-${index}`" class="form-label text-xs"
                      >Activity {{ index + 1 }} <span class="text-red-500">*</span></label
                    >
                    <textarea
                      :id="`activity-${index}`"
                      v-model="method.activity"
                      rows="2"
                      class="form-input"
                      placeholder="e.g., Lecture on new guidelines"
                    ></textarea>
                  </div>
                  <div class="w-32">
                    <label :for="`duration-${index}`" class="form-label text-xs"
                      >Duration (Hrs) <span class="text-red-500">*</span></label
                    >
                    <input
                      type="number"
                      :id="`duration-${index}`"
                      v-model.number="method.duration"
                      min="0.1"
                      step="0.1"
                      class="form-input"
                      placeholder="e.g., 2.5"
                    />
                  </div>
                  <button
                    v-if="teachingMethods.length > 1"
                    @click.prevent="removeTeachingMethod(index)"
                    type="button"
                    class="button-remove !h-10 !w-10"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </TransitionGroup>
              <button @click.prevent="addTeachingMethod" type="button" class="button-add mt-4">
                + Add Activity
              </button>
              <div
                class="mt-6 p-4 bg-indigo-50 rounded-lg flex justify-between items-center border border-indigo-200"
              >
                <h4 class="font-bold text-indigo-800">Total Credits (from duration):</h4>
                <span class="text-2xl font-bold text-indigo-600">{{ totalDuration }}</span>
              </div>
            </div>

            <div class="mt-8">
              <label class="form-label">Course Document <span class="text-red-500">*</span></label>
              <label
                for="courseDocument"
                class="file-drop-area"
                :class="{ 'file-drop-area-active': courseDocument }"
              >
                <input
                  id="courseDocument"
                  name="courseDocument"
                  type="file"
                  class="sr-only"
                  @change="handleFileChange($event, 'courseDocument')"
                  accept=".pdf"
                />
                <div class="text-center">
                  <svg
                    class="mx-auto h-10 w-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p v-if="!courseDocument" class="mt-2 text-sm text-gray-600">
                    <span class="font-semibold text-indigo-600">Click to upload</span> or drag and
                    drop
                  </p>
                  <p
                    v-if="courseDocument"
                    class="mt-2 text-sm text-green-700 font-semibold truncate"
                  >
                    {{ courseDocument.name }}
                  </p>
                  <p class="mt-1 text-xs text-gray-500">PDF up to 5MB</p>
                </div>
              </label>
              <button
                v-if="courseDocument"
                @click="clearFile('courseDocument')"
                type="button"
                class="mt-2 text-xs text-red-600 hover:text-red-800"
              >
                &times; Clear file
              </button>
              <p v-if="teachingLearningErrors.courseDocument" class="form-error-text">
                {{ teachingLearningErrors.courseDocument }}
              </p>
            </div>
          </div>
        </section>

        <section class="card">
          <h2 class="card-header">6. Target Audience / Participants Details</h2>
          <div v-if="!areOptionsLoaded" class="card-body text-center text-gray-500">
            Loading participation options...
          </div>
          <div v-else class="card-body grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="form-label"
                >Target Participation Category <span class="text-red-500">*</span></label
              >
              <div class="form-checkbox-group">
                <label
                  v-for="option in participationCategoryOptions"
                  :key="option.value"
                  class="form-checkbox-label"
                >
                  <input
                    type="checkbox"
                    :value="option.value"
                    v-model="participantDetails.category"
                    class="form-checkbox"
                  />
                  <span class="ml-2">{{ option.text }}</span>
                </label>
              </div>
              <p v-if="participantDetailsErrors.categories" class="form-error-text">
                {{ participantDetailsErrors.categories }}
              </p>
            </div>
            <div>
              <label class="form-label"
                >Target Participant Sub-category
                <span
                  v-if="
                    filteredSubcategoryOptions.length > 0 && participantDetails.category.length > 0
                  "
                  class="text-red-500"
                  >*</span
                >
              </label>
              <div class="form-checkbox-group">
                <template v-if="filteredSubcategoryOptions.length > 0">
                  <label
                    v-for="option in filteredSubcategoryOptions"
                    :key="option.value"
                    class="form-checkbox-label"
                  >
                    <input
                      type="checkbox"
                      :value="option.value"
                      v-model="participantDetails.subcategory"
                      class="form-checkbox"
                    />
                    <span class="ml-2"
                      >{{ option.text }}
                      <span class="text-gray-400"
                        >({{ getCategoryName(option.categoryId) }})</span
                      ></span
                    >
                  </label>
                </template>
                <div v-else class="text-sm text-gray-500 p-2">
                  {{
                    participantDetails.category.length > 0
                      ? 'No subcategories for selected category.'
                      : 'Please select a category first.'
                  }}
                </div>
              </div>
              <p v-if="participantDetailsErrors.subcategories" class="form-error-text">
                {{ participantDetailsErrors.subcategories }}
              </p>
            </div>
            <div>
              <label for="numberOfParticipants" class="form-label"
                >Expected Number of Participants <span class="text-red-500">*</span></label
              >
              <input
                type="number"
                id="numberOfParticipants"
                v-model.number="participantDetails.number"
                min="1"
                class="form-input"
                placeholder="e.g., 25"
              />
              <p v-if="participantDetailsErrors.number" class="form-error-text">
                {{ participantDetailsErrors.number }}
              </p>
            </div>
            <div class="md:col-span-2">
              <label for="relevanceToProfession" class="form-label"
                >Relevance to Topic/Profession
                <span v-if="participantDetails.category.length > 1" class="text-red-500">*</span>
              </label>
              <textarea
                id="relevanceToProfession"
                v-model="participantDetails.relevance"
                rows="3"
                class="form-input"
                placeholder="Explain relevance if multiple categories are selected..."
              ></textarea>
              <p v-if="participantDetailsErrors.relevance" class="form-error-text">
                {{ participantDetailsErrors.relevance }}
              </p>
            </div>
          </div>
        </section>

        <section class="bg-transparent p-0">
          <div
            class="bg-white/60 backdrop-blur-sm p-4 sticky bottom-4 rounded-xl shadow-xl flex flex-col sm:flex-row justify-end items-center space-y-3 sm:space-y-0 sm:space-x-4 border border-gray-200"
          >
            <button
              @click.prevent="cancelForm"
              type="button"
              class="button-secondary w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              @click.prevent="handleSaveDraft"
              :disabled="loading"
              type="button"
              class="button-draft w-full sm:w-auto"
            >
              <svg
                v-if="loading && currentAction === 'draft'"
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-yellow-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ loading && currentAction === 'draft' ? 'Saving...' : 'Save as Draft' }}
            </button>
            <button type="submit" :disabled="loading" class="button-primary w-full sm:w-auto">
              <svg
                v-if="loading && currentAction === 'submit'"
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {{ loading && currentAction === 'submit' ? 'Submitting...' : 'Submit Application' }}
            </button>
          </div>
        </section>
      </form>

      <Transition name="fade">
        <div
          v-if="showConfirmation"
          class="fixed inset-0 z-40 bg-gray-900 bg-opacity-60 flex items-center justify-center"
        >
          <div
            class="bg-white rounded-lg shadow-xl transform transition-all sm:max-w-lg w-full p-6"
            role="dialog"
          >
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10"
              >
                <svg
                  class="h-6 w-6 text-indigo-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.79 4 4 0 .863-.27 1.66-.744 2.26l-1.003 1.003c-.391.391-.391 1.023 0 1.414.391.391 1.023.391 1.414 0l1.003-1.003c.64-.64.976-1.493.976-2.384 0-2.67-2.13-4.8-4.8-4.8S7.2 8.33 7.2 11c0 .552.448 1 1 1s1-.448 1-1c0-.369.057-.729.167-1.067l.118-.372zM12 18a1 1 0 100-2 1 1 0 000 2z"
                  />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-bold text-gray-900">Confirm Submission</h3>
                <p class="mt-2 text-sm text-gray-600">
                  Are you sure you want to submit this CPD application? This action cannot be
                  undone.
                </p>
              </div>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                @click="confirmSubmit"
                :disabled="loading"
                type="button"
                class="button-primary w-full sm:w-auto sm:ml-3"
              >
                {{ loading && currentAction === 'submit' ? 'Submitting...' : 'Yes, Submit' }}
              </button>
              <button
                @click="showConfirmation = false"
                :disabled="loading"
                type="button"
                class="button-secondary w-full sm:w-auto mt-3 sm:mt-0"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import apiService from '@/services/services'

const authStore = useAuthStore()
const router = useRouter()

// --- Core State ---
const loading = ref(false)
const currentAction = ref('') // 'submit', 'draft', or 'load_options'
const showConfirmation = ref(false)
const successMessage = ref('')
let db // IndexedDB instance for local backups (optional, kept for robustness)

const loadingMessage = computed(() => {
  switch (currentAction.value) {
    case 'submit':
      return 'Submitting Application...'
    case 'draft':
      return 'Saving Draft...'
    case 'load_options':
      return 'Loading Form Data...'
    default:
      return 'Processing...'
  }
})

// --- Form Data State ---
const applicant = reactive({
  cidNumber: '',
  registrationNo: '', // Added for clarity
  fullName: '',
  agencyTrainingLocation: '',
})
const application = reactive({
  isApproved: 'false',
  title: '',
  venue: '',
  fromDate: '',
  toDate: '',
})
const cpdProvider = reactive({ agency: '', otherAgency: '', reason: '', reasonDetails: '' })
const resourcePersons = ref([])
const teachingMethod = reactive({ type: '', expectedOutcome: '' })
const selectedMethodologies = ref([])
const teachingMethods = ref([])
const participantDetails = reactive({ category: [], subcategory: [], number: null, relevance: '' })

// File State
const approvalLetter = ref(null)
const courseDocument = ref(null)

// Dropdown Options State
const agencyOptions = ref([])
const reasonOptions = ref([])
const cpdTypeOptions = ref([])
const methodologyOptions = ref([])
const participationCategoryOptions = ref([])
const participantSubcategoryOptions = ref([])
const areOptionsLoaded = ref(false)
const userRegistrations = ref([])

// Error State
const validationErrors = ref([])
const applicantDetailsErrors = ref({})
const applicationDetailsErrors = ref({})
const cpdProviderErrors = ref({})
const resourcePersonsErrors = ref([])
const teachingLearningErrors = ref({})
const participantDetailsErrors = ref({})

// --- Computed Properties ---
const filteredSubcategoryOptions = computed(() => {
  if (!participantDetails.category || participantDetails.category.length === 0) return []
  return participantSubcategoryOptions.value.filter((subOpt) =>
    participantDetails.category.includes(subOpt.categoryId)
  )
})

const totalDuration = computed(() => {
  const total = teachingMethods.value.reduce(
    (sum, method) => sum + (Number(method.duration) || 0),
    0
  )
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(total)
})

// --- Methods ---

// --- File Handling ---
const handleFileChange = (event, type, index = null) => {
  const file = event.target.files?.[0] || null
  if (!file) return

  if (file.type !== 'application/pdf' || file.size > 5 * 1024 * 1024) {
    alert('Invalid file. Please select a PDF file smaller than 5MB.')
    event.target.value = ''
    return
  }

  if (type === 'approvalLetter') approvalLetter.value = file
  else if (type === 'courseDocument') courseDocument.value = file
  else if (type === 'resourcePerson' && index !== null) {
    resourcePersons.value[index].certificate = file
  }
}

const clearFile = (type, index = null) => {
  if (type === 'approvalLetter') approvalLetter.value = null
  else if (type === 'courseDocument') courseDocument.value = null
  else if (type === 'resourcePerson' && index !== null) {
    resourcePersons.value[index].certificate = null
  }
}

// --- Form Structure Methods ---
const getCategoryName = (categoryId) => {
  const category = participationCategoryOptions.value.find((cat) => cat.value === categoryId)
  return category ? category.text : 'N/A'
}

const addResourcePerson = () => {
  resourcePersons.value.push({
    id: Date.now(),
    selectedPersonId: '',
    name: '',
    regNo: '',
    certificate: null,
  })
  resourcePersonsErrors.value.push({})
}

const removeResourcePerson = (index) => {
  resourcePersons.value.splice(index, 1)
  resourcePersonsErrors.value.splice(index, 1)
}

const updateResourcePersonDetails = (person) => {
  const selectedUser = userRegistrations.value.find((u) => u.id === person.selectedPersonId)
  person.name = selectedUser ? selectedUser.full_name : ''
  person.regNo = selectedUser ? selectedUser.registration_no || selectedUser.cid_no : ''
}

const toggleApprovedFields = () => {
  if (application.isApproved !== 'true') {
    approvalLetter.value = null
    if (applicationDetailsErrors.value.approvalLetter)
      delete applicationDetailsErrors.value.approvalLetter
  }
}

const addTeachingMethod = () => {
  teachingMethods.value.push({ id: Date.now(), activity: '', duration: null })
}

const removeTeachingMethod = (index) => {
  teachingMethods.value.splice(index, 1)
}

// --- IndexedDB Draft Management (Kept as a local backup mechanism) ---
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CpdProviderDrafts', 1)
    request.onupgradeneeded = (event) => {
      const dbInstance = event.target.result
      if (!dbInstance.objectStoreNames.contains('applications')) {
        dbInstance.createObjectStore('applications', { keyPath: 'id' })
      }
    }
    request.onsuccess = (event) => {
      db = event.target.result
      resolve(db)
    }
    request.onerror = (event) => reject('IndexedDB error: ' + event.target.errorCode)
  })
}

const deleteDraftFromDB = () => {
  if (!db || !authStore.user?.id) return
  const draftId = `cpd-draft-${authStore.user.id}`
  const transaction = db.transaction(['applications'], 'readwrite')
  const store = transaction.objectStore('applications')
  store.delete(draftId)
}

// --- Form Submission and Validation ---
const validateForm = (isDraft = false) => {
  validationErrors.value = []
  applicantDetailsErrors.value = {}
  applicationDetailsErrors.value = {}
  cpdProviderErrors.value = {}
  resourcePersonsErrors.value = resourcePersons.value.map(() => ({}))
  teachingLearningErrors.value = {}
  participantDetailsErrors.value = {}

  // For drafts, only minimal validation is needed to ensure it's not empty
  if (isDraft && !application.title) {
    validationErrors.value = ['To save a draft, please enter at least the CPD Title.']
    return false
  }
  if (isDraft) return true // Skip strict validation for drafts

  let isValid = true
  // Full validation logic... (Your existing validation logic goes here)
  if (!applicant.agencyTrainingLocation) {
    isValid = false
    applicantDetailsErrors.value.agencyTrainingLocation = 'Agency/Training Location is required.'
  }
  if (!application.title) {
    isValid = false
    applicationDetailsErrors.value.title = 'Title of CPD is required.'
  }
  // Add all other validation checks here...

  if (!isValid) {
    validationErrors.value.unshift('Please correct the errors indicated in the form.')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return isValid
}

/**
 * NEW: Prepares the FormData object according to the backend specification.
 * @param {boolean} isDraftSubmission - Indicates if the submission is a draft.
 */
const prepareFormData = (isDraftSubmission = false) => {
  const fd = new FormData()

  // --- Applicant & Application Details ---
  fd.append('registration_no', applicant.registrationNo || '')
  fd.append('cid_no', applicant.cidNumber)
  fd.append('full_name', applicant.fullName)
  fd.append('title_of_cpd', application.title)
  fd.append('proposed_training_location', applicant.agencyTrainingLocation)
  fd.append('venue', application.venue)
  fd.append('from_date', application.fromDate)
  fd.append('to_date', application.toDate)
  fd.append('is_cpd_approved', application.isApproved === 'true')
  if (application.isApproved === 'true' && approvalLetter.value) {
    fd.append('attachment', approvalLetter.value)
  }

  // --- CPD Provider Details ---
  fd.append('cpd_providing_agency', cpdProvider.agency)
  if (cpdProvider.agency === 'other') {
    fd.append('if_others_specify', cpdProvider.otherAgency)
  }
  fd.append('reason_for_conducting', cpdProvider.reason)
  fd.append('reason_for_details', cpdProvider.reasonDetails)

  // --- Teaching, Learning & Credits ---
  const totalCredits = parseFloat(totalDuration.value)
  fd.append('type_of_cpd', teachingMethod.type)
  fd.append('expected_outcome', teachingMethod.expectedOutcome)
  fd.append('duration_in_hours', totalCredits)
  fd.append('credit', 0)
  if (courseDocument.value) {
    fd.append('course_document', courseDocument.value)
  }

  // --- Target Audience ---
  fd.append('number_of_participants', participantDetails.number)
  fd.append('relevance_to_topic', participantDetails.relevance)

  // --- CORRECTED ---
  // For PrimaryKeyRelatedField(many=True), append each PK value separately.
  // Do NOT use JSON.stringify().
  participantDetails.category.forEach((categoryId) => {
    fd.append('target_participant_categories', categoryId)
  })
  participantDetails.subcategory.forEach((subcategoryId) => {
    fd.append('target_participant_subcategories', subcategoryId)
  })

  // --- Status ---
  fd.append('is_draft', isDraftSubmission)
  fd.append('application_status', isDraftSubmission ? 'DRAFT' : 'SUBMITTED')

  // --- Nested JSON and File Data ---

  // For nested serializers (not PrimaryKeyRelatedField), JSON.stringify is correct.
  const methodologiesData = selectedMethodologies.value.map((id) => ({ methodology_name: id }))
  fd.append('methodologies', JSON.stringify(methodologiesData))

  const learningMethodsData = teachingMethods.value.map((method) => ({
    activities: method.activity,
    duration: method.duration,
  }))
  fd.append('learning_methods', JSON.stringify(learningMethodsData))

  const resourcesJSON = resourcePersons.value.map((person) => ({
    resource_person_reg_no: person.regNo,
    resource_person_name: person.name,
  }))
  fd.append('resources', JSON.stringify(resourcesJSON))

  // --- CORRECTED ---
  // Append resource person files with the key the backend expects ('resource_file_...').
  resourcePersons.value.forEach((person, index) => {
    if (person.certificate) {
      fd.append(`resource_file_${index}`, person.certificate)
    }
  })

  return fd
}

/**
 * NEW: Centralized function to handle form submission for both draft and final submit.
 * @param {boolean} isDraft - Determines if it's a draft or final submission.
 */
const _submitForm = async (isDraft) => {
  currentAction.value = isDraft ? 'draft' : 'submit'

  if (!validateForm(isDraft)) {
    currentAction.value = ''
    return
  }

  loading.value = true
  try {
    const fd = prepareFormData(isDraft)
    await apiService.createMhpcCpdTask(fd)

    successMessage.value = `Application ${
      isDraft ? 'draft saved' : 'submitted'
    } successfully! Redirecting...`
    deleteDraftFromDB() // Clean up local draft on successful submission
    resetFormState()
    setTimeout(() => {
      router.push('/admin/cme_cpd_provider/health_certification/dashboard')
    }, 3000)
  } catch (error) {
    console.error(`Error ${currentAction.value} application:`, error)
    const errorMessage = error.response?.data?.detail || 'An unexpected error occurred.'
    validationErrors.value = [`${isDraft ? 'Draft save' : 'Submission'} failed: ${errorMessage}`]
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    loading.value = false
    currentAction.value = ''
  }
}

// --- Event Handlers ---

const handleSaveDraft = async () => {
  await _submitForm(true) // True for draft
}

const handleSubmit = () => {
  if (validateForm(false)) {
    // False for final validation
    showConfirmation.value = true
  }
}

const confirmSubmit = async () => {
  showConfirmation.value = false
  await _submitForm(false) // False for final submission
}

const resetFormState = () => {
  // Your existing reset logic
  Object.assign(applicant, {
    cidNumber: '',
    registrationNo: '',
    fullName: '',
    agencyTrainingLocation: '',
  })
  // ... reset all other reactive objects and refs
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const cancelForm = () => {
  if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
    deleteDraftFromDB()
    resetFormState()
    router.push('/admin/cme_cpd_provider/health_certification/dashboard')
  }
}

const loadInitialData = async () => {
  // ... your existing data loading logic remains the same
  areOptionsLoaded.value = false
  loading.value = true
  currentAction.value = 'load_options'
  try {
    const [
      userRegRes,
      agencyRes,
      reasonRes,
      cpdTypeRes,
      methodologyRes,
      categoriesRes,
      subcategoriesRes,
    ] = await Promise.all([
      apiService.getMhpcNewApplications(),
      apiService.getProvidingAgency(),
      apiService.getReasonForCoducting(),
      apiService.getMhpcMastersCpdActivities(),
      apiService.getMhpcMastersCpdMethodologies(),
      apiService.getMhpcMasterData('personnel-categories'),
      apiService.getMhpcMastersSubCategories(),
    ])

    userRegistrations.value =
      userRegRes.data?.results
        ?.map((app) => ({ ...app }))
        .sort((a, b) => a.full_name.localeCompare(b.full_name)) || []
    agencyOptions.value =
      agencyRes.data?.results?.map((item) => ({ text: item.name, value: item.id })) || []
    reasonOptions.value =
      reasonRes.data?.results?.map((item) => ({ text: item.name, value: item.id })) || []

    cpdTypeOptions.value =
      cpdTypeRes.data?.results?.map((item) => ({
        text: item.cme_activity_name,
        value: item.id,
      })) || []

    methodologyOptions.value =
      methodologyRes.data?.results?.map((item) => ({
        text: item.methodology_name || item.name,
        value: item.id,
      })) || []

    participationCategoryOptions.value =
      categoriesRes?.data?.results?.map((cat) => ({ text: cat.category_name, value: cat.id })) || []
    participantSubcategoryOptions.value =
      subcategoriesRes?.data?.results?.map((sub) => ({
        text: sub.sub_category_name,
        value: sub.id,
        categoryId: sub.category_name,
      })) || []
  } catch (error) {
    console.error('Error loading initial data:', error)
    validationErrors.value.push('Failed to load essential form data. Please refresh the page.')
  } finally {
    loading.value = false
    currentAction.value = ''
    areOptionsLoaded.value = true
  }
}

// --- Lifecycle Hooks ---
onMounted(async () => {
  if (authStore.user) {
    applicant.cidNumber = authStore.user.cid || ''
    applicant.registrationNo = authStore.user.registration_no || '' // Store registration number
    applicant.fullName = [
      authStore.user.first_name,
      authStore.user.middle_name,
      authStore.user.last_name,
    ]
      .filter(Boolean)
      .join(' ')
  }

  await loadInitialData()
  // No longer loading from IndexedDB, but you could keep it as a backup
  await initDB()

  addResourcePerson()
  addTeachingMethod()
})
</script>

<style>
/* Base Card Style */
.card {
  @apply bg-white p-6 rounded-xl shadow-md border border-gray-200/80 transition-shadow duration-300 hover:shadow-lg;
}
.card-header {
  @apply text-2xl font-bold text-indigo-800 border-b border-gray-200 pb-4 mb-6;
}

/* Base Form Styles (Refined) */
.form-label {
  @apply block text-sm font-semibold text-gray-700 mb-1;
}
.form-label-disabled {
  @apply block text-sm font-medium text-gray-500 mb-1;
}
.form-input {
  @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 ease-in-out sm:text-sm;
}
.form-input-disabled {
  @apply mt-1 block w-full bg-gray-100 text-gray-500 rounded-md border-gray-300 shadow-sm sm:text-sm p-2 cursor-not-allowed;
}
.form-radio {
  @apply h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500;
}
.form-checkbox {
  @apply h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500;
}
.form-checkbox-group {
  @apply mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2 bg-white;
}
.form-checkbox-label {
  @apply flex items-center w-full py-1 text-sm text-gray-700 cursor-pointer rounded-md px-2 hover:bg-indigo-50;
}
.form-error-text {
  @apply mt-1 text-xs text-red-600 font-medium;
}

/* Enhanced File Input Style */
.file-drop-area {
  @apply relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-6 text-center cursor-pointer transition-colors duration-200 ease-in-out hover:border-indigo-500 hover:bg-indigo-50;
}
.file-drop-area-active {
  @apply border-green-500 bg-green-50;
}

/* Button Styles (Refined) */
.button-primary {
  @apply inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all;
}
.button-draft {
  @apply inline-flex items-center justify-center px-6 py-2.5 border border-yellow-500 rounded-md shadow-sm text-sm font-medium text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all;
}
.button-secondary {
  @apply inline-flex items-center justify-center px-6 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all;
}
.button-add {
  @apply inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-semibold py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-indigo-50 hover:border-indigo-500 transition-all;
}
.button-remove {
  @apply inline-flex items-center justify-center text-sm text-red-600 hover:text-white font-medium p-2 rounded-md hover:bg-red-500 transition-all;
}

/* Transition Styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-in-down-enter-active,
.fade-in-down-leave-active {
  transition: all 0.4s ease;
  transform-origin: top;
}
.fade-in-down-enter-from,
.fade-in-down-leave-to {
  opacity: 0;
  transform: translateY(-10px) scaleY(0.9);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}
.list-leave-active {
  position: absolute;
}
</style>
