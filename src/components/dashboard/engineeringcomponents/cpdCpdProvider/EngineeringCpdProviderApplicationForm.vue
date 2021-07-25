<template>
  <div class="bg-slate-50 font-sans antialiased">
    <div class="container mx-auto p-4 md:p-6">
      <div class="md:grid md:grid-cols-12 md:gap-12">
        <aside class="md:col-span-3 mb-8 md:mb-0">
          <div class="sticky top-6">
            <div class="flex items-center mb-6">
              <svg class="h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <h1 class="text-xl font-bold text-slate-800 ml-3">CPD Provider Application</h1>
            </div>
            <nav class="space-y-2">
              <a href="#section-1"
                class="group flex items-center p-2 rounded-md text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200">
                <svg class="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.41-1.412A6.998 6.998 0 0010 11.5a6.998 6.998 0 00-6.535 2.993z" />
                </svg>
                Applicant Details
              </a>
              <a href="#section-2"
                class="group flex items-center p-2 rounded-md text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200">
                <svg class="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M15.988 3.012A2.25 2.25 0 0118 5.25v9.5A2.25 2.25 0 0115.75 17H4.25A2.25 2.25 0 012 14.75v-9.5A2.25 2.25 0 014.25 3h11.5c.334 0 .653.067.938.197zM5 6.25a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 015 6.25zm.75 3.75a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z"
                    clip-rule="evenodd" />
                </svg>
                Application Details
              </a>
              <a href="#section-3"
                class="group flex items-center p-2 rounded-md text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200">
                <svg class="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M1.844 7.502c.863-2.483 3.42-4.156 6.34-4.156h.056c.63.023 1.25.163 1.84.414a.75.75 0 00.62-.242l.332-.415a.75.75 0 00-.598-1.22c-1.3-.393-2.68-.532-4.058-.443C2.433 2.14 0 5.174 0 8.25v.5C0 12.283 3.01 15 6.75 15h6.5c3.74 0 6.75-2.717 6.75-6.25v-.5c0-3.076-2.433-6.11-5.942-6.557a.75.75 0 00-.812.691l-.12.603a.75.75 0 00.677.818c2.51.488 4.446 2.62 4.446 5.045v.5c0 2.623-2.127 4.75-4.75 4.75h-6.5C4.127 13.5 2 11.373 2 8.75v-.5a8.172 8.172 0 01.92-3.748.75.75 0 00-.996-.549z"
                    clip-rule="evenodd" />
                </svg>
                Provider Details
              </a>
              <a href="#section-4"
                class="group flex items-center p-2 rounded-md text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200">
                <svg class="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                Resource Persons
              </a>
              <a href="#section-5"
                class="group flex items-center p-2 rounded-md text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200">
                <svg class="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M2.5 3A1.5 1.5 0 001 4.5v11A1.5 1.5 0 002.5 17h15a1.5 1.5 0 001.5-1.5v-11A1.5 1.5 0 0017.5 3h-15zm10.27 4.97a.75.75 0 010 1.06l-3.5 3.5a.75.75 0 01-1.06 0l-1.5-1.5a.75.75 0 111.06-1.06l.97.97 2.97-2.97a.75.75 0 011.06 0z"
                    clip-rule="evenodd" />
                </svg>
                Teaching Method
              </a>
              <a href="#section-6"
                class="group flex items-center p-2 rounded-md text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200">
                <svg class="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    d="M10 8a3 3 0 100-6 3 3 0 000 6zM6.25 14.335a.75.75 0 00.5.665 10.02 10.02 0 006.5 0 .75.75 0 00.5-.665A5.498 5.498 0 0010 11.5a5.498 5.498 0 00-3.75 2.835z" />
                </svg>
                Target Audience
              </a>
              <a href="#section-7"
                class="group flex items-center p-2 rounded-md text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200">
                <svg class="h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z"
                    clip-rule="evenodd" />
                </svg>
                Actions
              </a>
            </nav>
          </div>
        </aside>

        <main class="md:col-span-9">
          <div v-if="loading"
            class="fixed inset-0 bg-slate-900 bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
            <div class="flex items-center text-white text-xl font-semibold">
              <svg class="animate-spin h-8 w-8 text-white mr-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ currentAction === 'submit' ? 'Submitting...' : currentAction === 'draft' ? 'Saving...' :
                'Processing...' }}
            </div>
          </div>

          <div v-if="validationErrors.length > 0 || successMessage" class="mb-6 space-y-4">
            <div v-if="validationErrors.length > 0"
              class="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-lg shadow-sm" role="alert">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-rose-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="font-bold text-base">Please correct the following errors:</h3>
                  <ul class="mt-2 list-disc list-inside text-sm space-y-1">
                    <li v-for="(error, index) in validationErrors" :key="`error-${index}`">
                      {{ error }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div v-if="successMessage"
              class="bg-teal-50 border border-teal-200 text-teal-800 p-5 rounded-lg shadow-sm flex items-start space-x-4 transition-all duration-300"
              role="alert">
              <svg class="h-7 w-7 text-teal-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clip-rule="evenodd" />
              </svg>
              <div>
                <p class="font-bold text-lg">Success!</p>
                <p class="text-sm mt-1 text-teal-700">{{ successMessage }}</p>
              </div>
            </div>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-10">
            <section id="section-1" class="p-6 bg-white border border-slate-200 shadow-sm rounded-xl transition-all">
              <h2 class="text-xl font-bold mb-5 text-slate-800 border-b border-slate-200 pb-4 flex items-center">
                <span class="text-indigo-600 mr-3">1.</span> Applicant Details
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-slate-600 mb-1">CID No./Identity/Work Permit No.</label>
                  <input type="text" :value="applicant.cidNumber" disabled class="form-input-disabled"
                    placeholder="Auto-filled from login" />
                </div>
                <div class="md:col-span-1">
                  <label class="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                  <input type="text" :value="applicant.fullName" disabled class="form-input-disabled"
                    placeholder="Auto-filled from login" />
                </div>
                <div class="md:col-span-2">
                  <label for="agencyTrainingLocation" class="form-label">Agency/Training Location <span
                      class="text-rose-500">*</span></label>
                  <input type="text" id="agencyTrainingLocation" v-model="applicant.agencyTrainingLocation"
                    class="form-input" placeholder="e.g. JDWNR Hospital, Thimphu" />
                  <p v-if="applicantDetailsErrors.agencyTrainingLocation" class="form-error-text">
                    {{ applicantDetailsErrors.agencyTrainingLocation }}
                  </p>
                </div>
              </div>
            </section>

            <section id="section-2" class="p-6 bg-white border border-slate-200 shadow-sm rounded-xl transition-all">
              <h2 class="text-xl font-bold mb-5 text-slate-800 border-b border-slate-200 pb-4 flex items-center">
                <span class="text-indigo-600 mr-3">2.</span> Application Details
              </h2>
              <div class="space-y-6">
                <div>
                  <label class="form-label">Is this CPD approved?
                    <span class="text-rose-500">*</span></label>
                  <div class="mt-2 flex items-center gap-x-6">
                    <label class="flex items-center text-sm text-slate-700 cursor-pointer">
                      <input type="radio" v-model="application.isApproved" value="true" name="isCpdApproved"
                        @change="toggleApprovedFields" class="form-radio" />
                      <span class="ml-2">Yes</span>
                    </label>
                    <label class="flex items-center text-sm text-slate-700 cursor-pointer">
                      <input type="radio" v-model="application.isApproved" value="false" name="isCpdApproved"
                        @change="toggleApprovedFields" class="form-radio" />
                      <span class="ml-2">No</span>
                    </label>
                  </div>
                </div>

                <div v-if="application.isApproved === 'true'"
                  class="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <label for="approvalLetter" class="form-label">Attach Approval Letter (PDF, max 5MB)
                    <span class="text-rose-500">*</span></label>
                  <input type="file" id="approvalLetter" @change="handleApprovalLetterUpload" accept=".pdf"
                    class="form-input-file" />
                  <p v-if="applicationDetailsErrors.approvalLetter" class="form-error-text">
                    {{ applicationDetailsErrors.approvalLetter }}
                  </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="md:col-span-2">
                    <label for="cpdTitle" class="form-label">Title of CPD <span class="text-rose-500">*</span></label>
                    <input type="text" id="cpdTitle" v-model="application.title" class="form-input"
                      placeholder="e.g. Advanced Cardiac Life Support" />
                    <p v-if="applicationDetailsErrors.title" class="form-error-text">
                      {{ applicationDetailsErrors.title }}
                    </p>
                  </div>
                  <div class="md:col-span-2">
                    <label for="cpdVenue" class="form-label">Venue <span class="text-rose-500">*</span></label>
                    <input type="text" id="cpdVenue" v-model="application.venue" class="form-input"
                      placeholder="e.g. Conference Hall, KGUMSB" />
                    <p v-if="applicationDetailsErrors.venue" class="form-error-text">
                      {{ applicationDetailsErrors.venue }}
                    </p>
                  </div>
                  <div>
                    <label for="fromDate" class="form-label">From Date <span class="text-rose-500">*</span></label>
                    <input type="date" id="fromDate" v-model="application.fromDate" class="form-input" />
                    <p v-if="applicationDetailsErrors.fromDate" class="form-error-text">
                      {{ applicationDetailsErrors.fromDate }}
                    </p>
                  </div>
                  <div>
                    <label for="toDate" class="form-label">To Date <span class="text-rose-500">*</span></label>
                    <input type="date" id="toDate" v-model="application.toDate" class="form-input" />
                    <p v-if="applicationDetailsErrors.toDate" class="form-error-text">
                      {{ applicationDetailsErrors.toDate }}
                    </p>
                  </div>
                </div>

                <!-- ===== NEW DYNAMIC ACTIVITIES SECTION ===== -->
                <div class="mt-8 pt-6 border-t border-slate-200">
                  <div class="flex justify-between items-center mb-3">
                    <div>
                      <h3 class="text-md font-bold text-slate-700">Activities & Durations</h3>
                      <p class="text-sm text-slate-500">
                        Add all activities and their corresponding duration in hours.
                      </p>
                    </div>
                    <div class="text-right">
                      <h4 class="text-sm font-medium text-slate-500">Total Duration</h4>
                      <p class="text-lg font-bold text-indigo-600">{{ totalDuration }} hours</p>
                    </div>
                  </div>

                  <div class="space-y-4">
                    <div v-for="(activity, index) in activities" :key="index"
                      class="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-lg bg-slate-50/50 items-start">
                      <!-- Activity Name Input -->
                      <div class="md:col-span-7">
                        <label :for="`activity-name-${index}`" class="form-label">
                          Activity Name {{ index + 1 }} <span class="text-rose-500">*</span>
                        </label>
                        <textarea :id="`activity-name-${index}`" v-model="activity.name" rows="2" class="form-textarea"
                          placeholder="e.g. Lecture on new guidelines"></textarea>
                        <p v-if="activitiesErrors[index] && activitiesErrors[index].name" class="form-error-text">
                          {{ activitiesErrors[index].name }}
                        </p>
                      </div>

                      <!-- Duration Input -->
                      <div class="md:col-span-3">
                        <label :for="`activity-duration-${index}`" class="form-label">
                          Duration (Hours) <span class="text-rose-500">*</span>
                        </label>
                        <input type="number" :id="`activity-duration-${index}`" v-model.number="activity.duration"
                          min="0.1" step="0.1" class="form-input" placeholder="e.g. 1.5" />
                        <p v-if="activitiesErrors[index] && activitiesErrors[index].duration" class="form-error-text">
                          {{ activitiesErrors[index].duration }}
                        </p>
                      </div>

                      <!-- Remove Button -->
                      <div class="md:col-span-2 flex items-center pt-8">
                        <button v-if="activities.length > 1" @click.prevent="removeActivity(index)" type="button"
                          class="text-sm font-medium text-rose-600 hover:text-rose-800 flex items-center gap-1">
                          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                              clip-rule="evenodd" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  <button @click.prevent="addActivity" type="button"
                    class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 py-2 px-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                    Add Another Activity
                  </button>
                </div>
                <!-- ===== END OF NEW SECTION ===== -->
              </div>
            </section>

            <!-- SECTIONS 3, 4, 5, 6, 7 (Unchanged Template, only Script Logic is affected) -->
            <!-- These sections are included as-is for a complete file -->

            <section id="section-3" class="p-6 bg-white border border-slate-200 shadow-sm rounded-xl transition-all">
              <h2 class="text-xl font-bold mb-5 text-slate-800 border-b border-slate-200 pb-4 flex items-center">
                <span class="text-indigo-600 mr-3">3.</span> CPD Providers Details (Host)
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="cpdProvidingAgency" class="form-label">CPD Providing Agency <span
                      class="text-rose-500">*</span></label>
                  <select id="cpdProvidingAgency" v-model="cpdProvider.agency" class="form-select">
                    <option value="">Select Agency</option>
                    <option v-for="option in agencyOptions" :key="option.value" :value="option.value">
                      {{ option.text }}
                    </option>
                    <option value="other">Others (Specify)</option>
                  </select>
                  <p v-if="cpdProviderErrors.agency" class="form-error-text">
                    {{ cpdProviderErrors.agency }}
                  </p>
                </div>
                <div v-if="cpdProvider.agency === 'other'">
                  <label for="otherAgency" class="form-label">If Others, Specify <span
                      class="text-rose-500">*</span></label>
                  <input type="text" id="otherAgency" v-model="cpdProvider.otherAgency" class="form-input"
                    placeholder="Name of the agency" />
                  <p v-if="cpdProviderErrors.otherAgency" class="form-error-text">
                    {{ cpdProviderErrors.otherAgency }}
                  </p>
                </div>
                <div>
                  <label for="reasonForConducting" class="form-label">Reason for Conducting <span
                      class="text-rose-500">*</span></label>
                  <select id="reasonForConducting" v-model="cpdProvider.reason" class="form-select">
                    <option value="">Select Reason</option>
                    <option v-for="option in reasonOptions" :key="option.value" :value="option.value">
                      {{ option.text }}
                    </option>
                  </select>
                  <p v-if="cpdProviderErrors.reason" class="form-error-text">
                    {{ cpdProviderErrors.reason }}
                  </p>
                </div>
                <div class="md:col-span-2">
                  <label for="reasonDetails" class="form-label">Reason Details <span
                      class="text-rose-500">*</span></label>
                  <textarea id="reasonDetails" v-model="cpdProvider.reasonDetails" rows="4" class="form-textarea"
                    placeholder="Provide a detailed explanation..."></textarea>
                  <p v-if="cpdProviderErrors.reasonDetails" class="form-error-text">
                    {{ cpdProviderErrors.reasonDetails }}
                  </p>
                </div>
              </div>
            </section>

            <section id="section-4" class="p-6 bg-white border border-slate-200 shadow-sm rounded-xl transition-all">
              <h2 class="text-xl font-bold mb-5 text-slate-800 border-b border-slate-200 pb-4 flex items-center">
                <span class="text-indigo-600 mr-3">4.</span> Resource Persons Details
              </h2>
              <div class="space-y-6">
                <div v-for="(person, index) in resourcePersons" :key="index"
                  class="p-4 border border-slate-200 rounded-lg bg-slate-50/50 space-y-4 relative">
                  <div class="flex justify-between items-center">
                    <h3 class="text-md font-semibold text-slate-700">
                      Resource Person {{ index + 1 }}
                    </h3>
                    <button v-if="resourcePersons.length > 1" @click.prevent="removeResourcePerson(index)" type="button"
                      class="text-sm font-medium text-rose-600 hover:text-rose-800 flex items-center gap-1">
                      <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                          clip-rule="evenodd" />
                      </svg>
                      Remove
                    </button>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label :for="`rpSelect-${index}`" class="form-label">Select Resource Person <span
                          class="text-rose-500">*</span></label>
                      <select :id="`rpSelect-${index}`" v-model="person.selectedPersonId"
                        @change="updateResourcePersonDetails(person)" class="form-select">
                        <option value="">-- Select Person --</option>
                        <option v-for="user in userRegistrations" :key="user.id" :value="user.id">
                          {{ user.full_name }} ({{ user.registration_no || user.cid_no }})
                        </option>
                      </select>
                      <p v-if="resourcePersonsErrors[index]?.selectedPersonId" class="form-error-text">
                        {{ resourcePersonsErrors[index].selectedPersonId }}
                      </p>
                      <p v-if="person.regNo" class="mt-1 text-xs text-slate-500">
                        RegNo/CID: {{ person.regNo }}
                      </p>
                    </div>
                    <div>
                      <label :for="`rpResourceDocument-${index}`" class="form-label">Doc Supporting Expertise (PDF, max
                        5MB)
                        <span class="text-rose-500">*</span></label>
                      <input type="file" :id="`rpResourceDocument-${index}`" @change="
                        (event) => handleResourcePersonDocumentUpload(event, person, index)
                      " accept=".pdf" class="form-input-file" />
                      <p v-if="resourcePersonsErrors[index]?.resourceDocument" class="form-error-text">
                        {{ resourcePersonsErrors[index].resourceDocument }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <button @click.prevent="addResourcePerson" type="button"
                class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 py-2 px-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
                Add Another Resource Person
              </button>
            </section>

            <section id="section-5" class="p-6 bg-white border border-slate-200 shadow-sm rounded-xl transition-all">
              <h2 class="text-xl font-bold mb-5 text-slate-800 border-b border-slate-200 pb-4 flex items-center">
                <span class="text-indigo-600 mr-3">5.</span> Teaching & Learning Method
              </h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="cpdType" class="form-label">Type of CPD <span class="text-rose-500">*</span></label>
                  <select id="cpdType" v-model="teachingMethod.type" class="form-select">
                    <option value="">Select Type</option>
                    <option v-for="option in cpdTypeOptions" :key="option.value" :value="option.value">
                      {{ option.text || option.cpd_activity_name || 'Untitled' }}
                    </option>
                  </select>
                  <p v-if="teachingLearningErrors.type" class="form-error-text">
                    {{ teachingLearningErrors.type }}
                  </p>
                </div>
                <div>
                  <label class="form-label">Methodologies <span class="text-rose-500">*</span></label>
                  <div class="mt-1 max-h-40 overflow-y-auto border border-slate-300 rounded-md p-3 space-y-2 bg-white">
                    <label v-for="option in methodologyOptions" :key="option.value"
                      class="flex items-center text-sm text-slate-700 cursor-pointer">
                      <input type="checkbox" :value="option.value" v-model="selectedMethodologies"
                        class="form-checkbox" />
                      <span class="ml-3">{{ option.text }}</span>
                    </label>
                  </div>
                  <p v-if="teachingLearningErrors.selectedMethodologies" class="form-error-text">
                    {{ teachingLearningErrors.selectedMethodologies }}
                  </p>
                </div>
                <div class="md:col-span-2">
                  <label for="expectedOutcome" class="form-label">Expected Outcome <span
                      class="text-rose-500">*</span></label>
                  <textarea id="expectedOutcome" v-model="teachingMethod.expectedOutcome" rows="4" class="form-textarea"
                    placeholder="Describe the expected learning outcomes for participants..."></textarea>
                  <p v-if="teachingLearningErrors.expectedOutcome" class="form-error-text">
                    {{ teachingLearningErrors.expectedOutcome }}
                  </p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div class="md:col-span-2">
                  <label for="courseDocument" class="form-label">Course Document (PDF, max 5MB) <span
                      class="text-rose-500">*</span></label>
                  <input type="file" id="courseDocument" @change="handleCourseDocumentUpload" accept=".pdf"
                    class="form-input-file" />
                  <p v-if="teachingLearningErrors.courseDocument" class="form-error-text">
                    {{ teachingLearningErrors.courseDocument }}
                  </p>
                </div>
              </div>
            </section>

            <section id="section-6" class="p-6 bg-white border border-slate-200 shadow-sm rounded-xl transition-all">
              <h2 class="text-xl font-bold mb-5 text-slate-800 border-b border-slate-200 pb-4 flex items-center">
                <span class="text-indigo-600 mr-3">6.</span> Target Audience / Participants Details
              </h2>
              <div v-if="!areOptionsLoaded" class="text-center text-slate-600 py-4">
                Loading participation options...
              </div>
              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                <div>
                  <label class="form-label">Target Participation Category <span class="text-rose-500">*</span></label>
                  <div class="mt-1 max-h-40 overflow-y-auto border border-slate-300 rounded-md p-3 space-y-2 bg-white">
                    <label v-for="option in participationCategoryOptions" :key="option.value"
                      class="flex items-center text-sm text-slate-700 cursor-pointer">
                      <input type="checkbox" :value="option.value" v-model="participantDetails.category"
                        class="form-checkbox" />
                      <span class="ml-3">{{ option.text }}</span>
                    </label>
                  </div>
                  <p v-if="participantDetailsErrors.categories" class="form-error-text">
                    {{ participantDetailsErrors.categories }}
                  </p>
                </div>
                <div>
                  <label class="form-label">Target Participant Sub-category
                    <span v-if="
                      filteredSubcategoryOptions.length > 0 &&
                      participantDetails.category.length > 0
                    " class="text-rose-500">*</span></label>
                  <div class="mt-1 max-h-40 overflow-y-auto border border-slate-300 rounded-md p-3 space-y-2 bg-white">
                    <div v-if="filteredSubcategoryOptions.length > 0">
                      <label v-for="option in filteredSubcategoryOptions" :key="option.value"
                        class="flex items-center text-sm text-slate-700 cursor-pointer">
                        <input type="checkbox" :value="option.value" v-model="participantDetails.subcategory"
                          class="form-checkbox" />
                        <span class="ml-3">{{ option.text }}
                          <span class="text-slate-400">({{ getCategoryName(option.categoryId) }})</span></span>
                      </label>
                    </div>
                    <div v-else-if="participantDetails.category.length > 0"
                      class="text-sm text-slate-500 p-2 text-center">
                      No subcategories for selection.
                    </div>
                    <div v-else class="text-sm text-slate-500 p-2 text-center">
                      Please select a category first.
                    </div>
                  </div>
                  <p v-if="participantDetailsErrors.subcategories" class="form-error-text">
                    {{ participantDetailsErrors.subcategories }}
                  </p>
                </div>
                <div>
                  <label for="numberOfParticipants" class="form-label">Expected Number of Participants <span
                      class="text-rose-500">*</span></label>
                  <input type="number" id="numberOfParticipants" v-model.number="participantDetails.number" min="1"
                    class="form-input" placeholder="e.g. 25" />
                  <p v-if="participantDetailsErrors.number" class="form-error-text">
                    {{ participantDetailsErrors.number }}
                  </p>
                </div>
                <div class="md:col-span-2">
                  <label for="relevanceToProfession" class="form-label">Relevance to Topic/Profession
                    <span v-if="participantDetails.category.length > 1" class="text-rose-500">*</span></label>
                  <textarea id="relevanceToProfession" v-model="participantDetails.relevance" rows="3"
                    class="form-textarea"
                    placeholder="Explain the relevance, especially if multiple categories are selected..."></textarea>
                  <p v-if="participantDetailsErrors.relevance" class="form-error-text">
                    {{ participantDetailsErrors.relevance }}
                  </p>
                </div>
              </div>
            </section>

            <section id="section-7" class="p-6 bg-white border border-slate-200 shadow-sm rounded-xl transition-all">
              <h2 class="text-xl font-bold mb-5 text-slate-800 border-b border-slate-200 pb-4 flex items-center">
                <span class="text-indigo-600 mr-3">7.</span> Actions
              </h2>
              <div class="flex flex-col sm:flex-row justify-end items-center gap-3">
                <button @click.prevent="cancelForm" type="button" class="btn btn-secondary w-full sm:w-auto">
                  Cancel
                </button>
                <button @click.prevent="saveDraft" :disabled="loading" type="button"
                  class="btn btn-warning w-full sm:w-auto">
                  <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M15.504 3.125A3.001 3.001 0 0013 2H7a3 3 0 00-3 3v10a3 3 0 003 3h6a3 3 0 003-3V5.125a3.001 3.001 0 00-.496-1.999zM8 7.5a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5A.75.75 0 018 7.5zM8 10a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 018 10zm0 2.5a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75z"
                      clip-rule="evenodd" />
                  </svg>
                  {{ loading && currentAction === 'draft' ? 'Saving...' : 'Save as Draft' }}
                </button>
                <button type="submit" :disabled="loading" class="btn btn-primary w-full sm:w-auto">
                  <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.949a.75.75 0 00.95.53l4.95-1.414a.75.75 0 00-.416-1.482L5.83 7.843 3.91 3.105a.75.75 0 00-.805-.816zM12.13 11.87a.75.75 0 00-1.06 0l-2.06 2.06a.75.75 0 000 1.06l4.5 4.5a.75.75 0 001.06 0l2.06-2.06a.75.75 0 000-1.06l-4.5-4.5z" />
                    <path
                      d="M14.53 10.47a.75.75 0 00-1.06 0l-4.5 4.5a.75.75 0 000 1.06l4.5 4.5a.75.75 0 001.06 0l4.5-4.5a.75.75 0 000-1.06l-4.5-4.5zM12.94 2.94a.75.75 0 010 1.06L5.187 11.75a.75.75 0 01-1.06 0L2.373 9.996a.75.75 0 111.06-1.06l1.22 1.22L11.88 2.94a.75.75 0 011.06 0z" />
                  </svg>
                  {{
                    loading && currentAction === 'submit' ? 'Submitting...' : 'Submit Application'
                  }}
                </button>
              </div>
            </section>
          </form>

          <div v-if="showConfirmation" class="fixed inset-0 z-40 overflow-y-auto" aria-labelledby="modal-title"
            role="dialog" aria-modal="true">
            <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div class="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
              <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"></span>
              <div
                class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div
                      class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg class="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.79 4 4 0 .863-.27 1.66-.744 2.26l-1.003 1.003c-.391.391-.391 1.023 0 1.414.391.391 1.023.391 1.414 0l1.003-1.003c.64-.64.976-1.493.976-2.384 0-2.67-2.13-4.8-4.8-4.8S7.2 8.33 7.2 11c0 .552.448 1 1 1s1-.448 1-1c0-.369.057-.729.167-1.067l.118-.372zM12 18a1 1 0 100-2 1 1 0 000 2z" />
                      </svg>
                    </div>
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 class="text-lg leading-6 font-bold text-slate-900" id="modal-title">
                        Confirm Submission
                      </h3>
                      <div class="mt-2">
                        <p class="text-sm text-slate-500">
                          Are you sure you want to submit this CPD application? Please review your
                          entries before proceeding.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                  <button @click="confirmSubmit" :disabled="loading" type="button"
                    class="btn btn-primary w-full sm:w-auto">
                    {{ loading && currentAction === 'submit' ? 'Submitting...' : 'Yes, Submit' }}
                  </button>
                  <button @click="showConfirmation = false" :disabled="loading" type="button"
                    class="btn btn-secondary w-full sm:w-auto">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import apiService from '@/services/services' // Your API service

const authStore = useAuthStore()
const router = useRouter()

const loading = ref(false)
const currentAction = ref('')
const showConfirmation = ref(false)
const successMessage = ref('')
const userRegistrations = ref([])


const applicant = reactive({
  cidNumber: '',
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

const activities = ref([{ name: '', duration: null }])

const cpdProvider = reactive({
  agency: '',
  otherAgency: '',
  reason: '',
  reasonDetails: '',
})

const resourcePersons = ref([
  {
    selectedPersonId: '',
    name: '',
    regNo: '',
    resourceDocument: null,
  },
])

const teachingMethod = reactive({
  type: '',
  expectedOutcome: '',
})
const selectedMethodologies = ref([])

const participantDetails = reactive({
  category: [],
  subcategory: [],
  number: null,
  relevance: '',
})

const participants = ref([])

// File refs
const approvalLetter = ref(null)
const courseDocument = ref(null)
const attendanceSheet = ref(null)

// Dropdown options
const agencyOptions = ref([])
const reasonOptions = ref([])
const cpdTypeOptions = ref([])
const methodologyOptions = ref([])
const participationCategoryOptions = ref([])
const participantSubcategoryOptions = ref([])
const areOptionsLoaded = ref(false)

// Error objects
const validationErrors = ref([])
const applicantDetailsErrors = ref({})
const applicationDetailsErrors = ref({})
const cpdProviderErrors = ref({})
const resourcePersonsErrors = ref([])
const teachingLearningErrors = ref({})
const participantDetailsErrors = ref({})
const approvedCpdErrors = ref({})
const activitiesErrors = ref([{}])


const filteredSubcategoryOptions = computed(() => {
  if (!participantDetails.category || participantDetails.category.length === 0) {
    return []
  }
  return participantSubcategoryOptions.value.filter((subOpt) =>
    participantDetails.category.includes(subOpt.categoryId)
  )
})

const totalDuration = computed(() => {
  return activities.value
    .reduce((total, activity) => {
      const duration = parseFloat(activity.duration)
      return total + (isNaN(duration) ? 0 : duration)
    }, 0)
    .toFixed(1)
})


const addActivity = () => {
  activities.value.push({ name: '', duration: null })
  activitiesErrors.value.push({})
}


const removeActivity = (index) => {
  if (activities.value.length > 1) {
    activities.value.splice(index, 1)
    activitiesErrors.value.splice(index, 1)
  }
}

const getCategoryName = (categoryId) => {
  const category = participationCategoryOptions.value.find((cat) => cat.value === categoryId)
  return category ? category.text : ''
}

const addResourcePerson = () => {
  resourcePersons.value.push({
    selectedPersonId: '',
    name: '',
    regNo: '',
    resourceDocument: null,
  })
  resourcePersonsErrors.value.push({})
}

const removeResourcePerson = (index) => {
  if (resourcePersons.value.length > 1) {
    resourcePersons.value.splice(index, 1)
    resourcePersonsErrors.value.splice(index, 1)
  }
}

const updateResourcePersonDetails = (person) => {
  const selectedUser = userRegistrations.value.find((u) => u.id === person.selectedPersonId)
  if (selectedUser) {
    person.name = selectedUser.full_name
    person.regNo = selectedUser.registration_no || selectedUser.cid_no
  } else {
    person.name = ''
    person.regNo = ''
  }
}

const toggleApprovedFields = () => {
  if (application.isApproved !== 'true') {
    approvalLetter.value = null
    if (applicationDetailsErrors.value.approvalLetter)
      delete applicationDetailsErrors.value.approvalLetter
  }
}

const handleFileUpload = (event, fileRef, maxSizeMB = 5, errorFieldKey, errorObjectRef) => {
  const file = event.target.files?.[0]
  if (errorObjectRef.value[errorFieldKey]) {
    delete errorObjectRef.value[errorFieldKey]
  }

  if (file) {
    if (file.type === 'application/pdf' && file.size <= maxSizeMB * 1024 * 1024) {
      fileRef.value = file
    } else {
      fileRef.value = null
      event.target.value = ''
      const errorMsg = `Invalid file. Must be PDF and max ${maxSizeMB}MB.`
      errorObjectRef.value[errorFieldKey] = errorMsg
    }
  } else {
    fileRef.value = null
  }
}

const handleResourcePersonDocumentUpload = (event, person, index) => {
  const file = event.target.files?.[0]
  const maxSizeMB = 5

  if (!resourcePersonsErrors.value[index]) resourcePersonsErrors.value[index] = {}
  if (resourcePersonsErrors.value[index].resourceDocument) {
    delete resourcePersonsErrors.value[index].resourceDocument
  }

  if (file) {
    if (file.type === 'application/pdf' && file.size <= maxSizeMB * 1024 * 1024) {
      person.resourceDocument = file
    } else {
      person.resourceDocument = null
      event.target.value = ''
      const errorMsg = `Invalid file. Must be PDF and max ${maxSizeMB}MB.`
      resourcePersonsErrors.value[index].resourceDocument = errorMsg
    }
  } else {
    person.resourceDocument = null
  }
}

const handleApprovalLetterUpload = (event) =>
  handleFileUpload(event, approvalLetter, 5, 'approvalLetter', applicationDetailsErrors)
const handleCourseDocumentUpload = (event) =>
  handleFileUpload(event, courseDocument, 5, 'courseDocument', teachingLearningErrors)

const validateForm = (forDraft = false) => {
  validationErrors.value = []
  applicantDetailsErrors.value = {}
  applicationDetailsErrors.value = {}
  cpdProviderErrors.value = {}
  resourcePersonsErrors.value = resourcePersons.value.map(() => ({}))
  teachingLearningErrors.value = {}
  participantDetailsErrors.value = {}
  approvedCpdErrors.value = {}
  activitiesErrors.value = activities.value.map(() => ({}))

  let isValid = true


  if (!forDraft && !applicant.agencyTrainingLocation?.trim()) {
    applicantDetailsErrors.value.agencyTrainingLocation = 'Agency/Training Location is required.'
    isValid = false
  }

  if (!forDraft && !application.title?.trim()) {
    applicationDetailsErrors.value.title = 'Title of CPD is required.'
    isValid = false
  }
  if (!forDraft && !application.venue?.trim()) {
    applicationDetailsErrors.value.venue = 'Venue is required.'
    isValid = false
  }
  if (!forDraft && !application.fromDate) {
    applicationDetailsErrors.value.fromDate = 'From Date is required.'
    isValid = false
  }
  if (!forDraft && !application.toDate) {
    applicationDetailsErrors.value.toDate = 'To Date is required.'
    isValid = false
  }
  if (
    !forDraft &&
    application.fromDate &&
    application.toDate &&
    new Date(application.fromDate) > new Date(application.toDate)
  ) {
    applicationDetailsErrors.value.toDate = 'To Date must be on or after From Date.'
    isValid = false
  }
  if (application.isApproved === 'true' && !forDraft && !approvalLetter.value) {
    applicationDetailsErrors.value.approvalLetter = 'Approval Letter is required if CPD is approved.'
    isValid = false
  }

  if (!forDraft) {
    if (activities.value.length === 0) {
      validationErrors.value.push('At least one activity is required.');
      isValid = false;
    } else {
      activities.value.forEach((activity, index) => {
        if (!activity.name?.trim()) {
          if (!activitiesErrors.value[index]) activitiesErrors.value[index] = {};
          activitiesErrors.value[index].name = 'Activity name is required.';
          isValid = false;
        }
        if (!activity.duration || Number(activity.duration) <= 0) {
          if (!activitiesErrors.value[index]) activitiesErrors.value[index] = {};
          activitiesErrors.value[index].duration = 'A valid positive duration is required.';
          isValid = false;
        }
      });
    }
  }

  if (!forDraft && !cpdProvider.agency) {
    cpdProviderErrors.value.agency = 'CPD Providing Agency is required.'
    isValid = false
  }
  if (!forDraft && cpdProvider.agency === 'other' && !cpdProvider.otherAgency?.trim()) {
    cpdProviderErrors.value.otherAgency = 'Please specify the Other Agency.'
    isValid = false
  }
  if (!forDraft && !cpdProvider.reason) {
    cpdProviderErrors.value.reason = 'Reason for Conducting is required.'
    isValid = false
  }
  if (!forDraft && !cpdProvider.reasonDetails?.trim()) {
    cpdProviderErrors.value.reasonDetails = 'Reason Details are required.'
    isValid = false
  }


  if (!forDraft) {
    if (resourcePersons.value.length === 0) {
      validationErrors.value.push('At least one Resource Person is required.')
      isValid = false
    } else {
      resourcePersons.value.forEach((person, index) => {
        if (!person.selectedPersonId) {
          resourcePersonsErrors.value[index].selectedPersonId = 'Please select a resource person.'
          isValid = false
        }
        if (!person.resourceDocument) {
          resourcePersonsErrors.value[index].resourceDocument = 'A supporting document is required.'
          isValid = false
        }
      })
    }
  }


  if (!forDraft && !teachingMethod.type) {
    teachingLearningErrors.value.type = 'Type of CPD is required.'
    isValid = false
  }
  if (!forDraft && selectedMethodologies.value.length === 0) {
    teachingLearningErrors.value.selectedMethodologies = 'At least one Methodology must be selected.'
    isValid = false
  }
  if (!forDraft && !teachingMethod.expectedOutcome?.trim()) {
    teachingLearningErrors.value.expectedOutcome = 'Expected Outcome is required.'
    isValid = false
  }
  if (!forDraft && !courseDocument.value) {
    teachingLearningErrors.value.courseDocument = 'Course Document is required.'
    isValid = false
  }


  if (!forDraft && areOptionsLoaded.value) {
    if (participantDetails.category.length === 0) {
      participantDetailsErrors.value.categories = 'Target Participation Category is required.'
      isValid = false
    }
    const subcategoriesAvailable = filteredSubcategoryOptions.value.length > 0
    if (subcategoriesAvailable && participantDetails.subcategory.length === 0) {
      participantDetailsErrors.value.subcategories = 'Participant Sub-category is required if available.'
      isValid = false
    }
    if (participantDetails.number === null || participantDetails.number <= 0) {
      participantDetailsErrors.value.number = 'Expected number of participants must be a positive number.'
      isValid = false
    }
    if (participantDetails.category.length > 1 && !participantDetails.relevance?.trim()) {
      participantDetailsErrors.value.relevance = 'Relevance to Topic is required for multiple categories.'
      isValid = false
    }
  }

  if (!isValid && !forDraft) {
    validationErrors.value.unshift('Please review the form and correct the errors indicated below.')
  }
  return isValid
}

// In your EngineeringCpdProviderApplicationForm.vue's <script setup>

const prepareFormData = (isDraft = false) => {
  const fd = new FormData()

  // --- Section 1 & 2: Pulling from `applicant` and `application` objects ---
  fd.append('cid_no', applicant.cidNumber || '')
  fd.append('full_name', applicant.fullName || '')
  fd.append('proposed_training_location', applicant.agencyTrainingLocation?.trim() || '')
  fd.append('is_cpd_approved', application.isApproved === 'true')
  fd.append('title_of_cpd', application.title?.trim() || '')
  fd.append('venue', application.venue?.trim() || '')
  fd.append('from_date', application.fromDate || '')
  fd.append('to_date', application.toDate || '')
  if (application.isApproved === 'true' && approvalLetter.value) {
    // The backend seems to expect 'attendance_sheet_attachment' for this based on your model.
    // If it's an approval letter, you may need to rename the field in Django.
    // Using 'attendance_sheet_attachment' as per your previous payload attempt.
    fd.append('attendance_sheet_attachment', approvalLetter.value)
  }

  // --- Activities: Pulling from the `activities` ref ---
  const activitiesToSend = activities.value
    .filter(act => act.name?.trim() && (isDraft || (act.duration && act.duration > 0)))
    .map(act => ({
      activity_name: act.name.trim(),
      duration_in_hours: act.duration
    }));

  if (activitiesToSend.length > 0) {
    fd.append('activities', JSON.stringify(activitiesToSend));
  } else if (isDraft) {
    fd.append('activities', JSON.stringify([]));
  }

  // --- Section 3: Pulling from `cpdProvider` object ---
  fd.append('cpd_providing_agency', cpdProvider.agency === 'other' ? '' : cpdProvider.agency || '')
  if (cpdProvider.agency === 'other') {
    fd.append('if_others_specify', cpdProvider.otherAgency?.trim() || '')
  }
  fd.append('reason_for_conducting', cpdProvider.reason || '')
  fd.append('reason_for_details', cpdProvider.reasonDetails?.trim() || '')

  // --- Section 4: Pulling from `resourcePersons` ref ---
  const resourcePersonsToSend = resourcePersons.value.filter(p => isDraft ? p.selectedPersonId || p.resourceDocument : p.selectedPersonId && p.resourceDocument);
  if (resourcePersonsToSend.length > 0) {
    resourcePersonsToSend.forEach((person, index) => {
      fd.append(`resources[${index}][resource_person_reg_no]`, person.regNo)
      fd.append(`resources[${index}][resource_person_name]`, person.name)
      if (person.resourceDocument) {
        fd.append(`resources[${index}][resource_document]`, person.resourceDocument)
      }
    })
  }

  // --- Section 5: Pulling from `teachingMethod` and `selectedMethodologies` ---
  fd.append('type_of_cpd', teachingMethod.type || '')
  if (selectedMethodologies.value.length > 0) {
    fd.append('methodologies', JSON.stringify(selectedMethodologies.value.map((id) => ({ methodology_name: id }))))
  } else if (isDraft) {
    fd.append('methodologies', JSON.stringify([]))
  }
  fd.append('expected_outcome', teachingMethod.expectedOutcome?.trim() || '')
  if (courseDocument.value) {
    fd.append('course_document', courseDocument.value)
  }

  fd.append('participation_category', JSON.stringify(participantDetails.category || []))
  fd.append('participant_sub_category', JSON.stringify(participantDetails.subcategory || []))
  fd.append('number_of_participants', participantDetails.number || '')
  fd.append('relevance_to_topic', participantDetails.relevance?.trim() || '')

  fd.append('is_draft', isDraft)
  if (authStore.user?.id) {
    fd.append('user_id', authStore.user.id)
  }

  fd.append('status', isDraft ? 'Draft' : 'Pending')

  return fd
}
const resetFormState = () => {
  applicant.agencyTrainingLocation = ''
  application.isApproved = 'false'
  application.title = ''
  application.venue = ''
  application.fromDate = ''
  application.toDate = ''
  approvalLetter.value = null

  // NEW: Reset activities state
  activities.value = [{ name: '', duration: null }]
  activitiesErrors.value = [{}]

  cpdProvider.agency = ''
  cpdProvider.otherAgency = ''
  cpdProvider.reason = ''
  cpdProvider.reasonDetails = ''
  resourcePersons.value = [{ selectedPersonId: '', name: '', regNo: '', resourceDocument: null }]
  teachingMethod.type = ''
  teachingMethod.expectedOutcome = ''
  selectedMethodologies.value = []
  courseDocument.value = null
  participantDetails.category = []
  participantDetails.subcategory = []
  participantDetails.number = null
  participantDetails.relevance = ''

  validationErrors.value = []

  successMessage.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const saveDraft = async () => {
  currentAction.value = 'draft'
  if (!application.title?.trim() && !applicant.agencyTrainingLocation?.trim()) {
    validationErrors.value = ['Please fill in at least the Title or Agency Location to save a draft.']
    window.scrollTo({ top: 0, behavior: 'smooth' })
    currentAction.value = ''
    return;
  }

  validationErrors.value = [];

  try {
    loading.value = true
    const fd = prepareFormData(true)
    await apiService.createEpcCpdTask(fd)
    successMessage.value = 'Draft saved successfully! You can find it on your dashboard.'
    resetFormState();
  } catch (error) {
    console.error('Error saving draft:', error)
    validationErrors.value = ['Failed to save draft. An unexpected error occurred.']
  } finally {
    loading.value = false
    currentAction.value = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleSubmit = () => {
  if (validateForm(false)) {
    showConfirmation.value = true
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const confirmSubmit = async () => {
  currentAction.value = 'submit'
  showConfirmation.value = false

  if (!validateForm(false)) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    currentAction.value = ''
    return
  }

  try {
    loading.value = true
    const fd = prepareFormData(false)
    await apiService.createEpcCpdTask(fd)
    successMessage.value = 'Application submitted successfully! Redirecting to dashboard...'
    resetFormState()
    setTimeout(() => {
      router.push('/admin/cme_cpd_provider/engineering_certification/dashboard')
    }, 3000)
  } catch (error) {
    console.error('Error submitting application:', error);
    validationErrors.value = ['Submission failed. Please review the errors below.'];
    if (error.response?.data?.details) {
      validationErrors.value.push(error.response.data.details);
    } else if (error.response?.data) {
      Object.entries(error.response.data).forEach(([key, value]) => {
        validationErrors.value.push(`${key}: ${Array.isArray(value) ? value.join(', ') : value}`);
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });

    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    loading.value = false
    currentAction.value = ''
  }
}

const cancelForm = () => {
  if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
    resetFormState()
    router.push('/admin/cme_cpd_provider/engineering_certification/dashboard')
  }
}

const fetchLookups = async () => {
  areOptionsLoaded.value = false
  loading.value = true;
  currentAction.value = 'load_options';

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
      apiService.getEpcNewApplications(),
      apiService.getEpcCpdProvidingAgencies(),
      apiService.getEpcCpdReasonsForConducting(),
      apiService.getEpcMastersCpdActivities(),
      apiService.getEpcMastersCpdMethodologies(),
      apiService.getEpcMasterData('personnel-categories'),
      apiService.getEpcMastersSubCategories(),
    ]);

    userRegistrations.value = userRegRes.data?.results?.map(app => ({
      id: app.id,
      registration_no: app.registration_no,
      full_name: app.full_name,
      cid_no: app.cid_no,
    })).sort((a, b) => a.full_name.localeCompare(b.full_name)) || [];

    agencyOptions.value = agencyRes.data?.results?.map(item => ({ text: item.name, value: item.id })) || [];
    reasonOptions.value = reasonRes.data?.results?.map(item => ({ text: item.name, value: item.id })) || [];
    cpdTypeOptions.value = cpdTypeRes.data?.results?.map(item => ({ text: item.cpd_activity_name, value: item.id })) || [];
    methodologyOptions.value = methodologyRes.data?.results?.map(item => ({ text: item.methodology_name, value: item.id })) || [];
    participationCategoryOptions.value = categoriesRes.data?.results?.map(cat => ({ text: cat.category_name, value: cat.id })) || [];
    participantSubcategoryOptions.value = subcategoriesRes.data?.results?.map(sub => ({ text: sub.sub_category_name, value: sub.id, categoryId: sub.category_name })) || [];

  } catch (error) {
    console.error('Error loading lookup data:', error);
    validationErrors.value.push('Failed to load essential form data. Please refresh the page.');
  } finally {
    loading.value = false;
    currentAction.value = '';
    areOptionsLoaded.value = true;
  }
}

// --- Lifecycle Hooks ---
onMounted(() => {
  if (authStore.user) {
    applicant.cidNumber = authStore.user.cid || ''
    applicant.fullName = [authStore.user.first_name, authStore.user.middle_name, authStore.user.last_name]
      .filter(Boolean)
      .join(' ') || ''
  }

  fetchLookups();
})
</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-slate-700 mb-1;
}

.form-input {
  @apply block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 transition-colors duration-200;
}

.form-select {
  @apply block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 transition-colors duration-200;
}

.form-textarea {
  @apply block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 transition-colors duration-200;
}

.form-input-disabled {
  @apply mt-1 block w-full bg-slate-100 text-slate-500 rounded-md border-slate-300 shadow-sm sm:text-sm p-2 cursor-not-allowed;
}

.form-input-file {
  @apply block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer;
}

.form-radio {
  @apply h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 transition-colors duration-200;
}

.form-checkbox {
  @apply h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 transition-colors duration-200;
}

.form-error-text {
  @apply mt-1 text-xs text-rose-600;
}

.btn {
  @apply inline-flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200;
}

.btn-primary {
  @apply border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500;
}

.btn-secondary {
  @apply border-slate-300 text-slate-700 bg-white hover:bg-slate-50 focus:ring-indigo-500;
}

.btn-warning {
  @apply border-transparent text-amber-800 bg-amber-400 hover:bg-amber-500 focus:ring-amber-500;
}
</style>
