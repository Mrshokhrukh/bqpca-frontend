<template>
  <div>
    <!-- Backdrop -->
    <div v-if="isOpen" class="fixed inset-0 z-40 bg-black bg-opacity-50" @click="close"></div>

    <!-- Modal Dialog -->
    <dialog :open="isOpen" class="fixed inset-0 z-50 m-auto flex h-[95vh] w-11/12 max-w-6xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">

      <!-- Header -->
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
        <div class="p-6 space-y-8">

          <!-- Part I: Executive Summary -->
          <section>
            <h3 class="mb-4 border-b pb-2 text-lg font-bold text-gray-800">Part I: Executive Summary</h3>
            <div class="rounded-md bg-gray-50 p-4 border border-gray-200">
              <p class="whitespace-pre-wrap text-sm text-gray-700">{{ localIsarData?.executive_summary || 'Not provided' }}</p>
            </div>
          </section>

          <!-- Part II: Profile of the Institution (EXPANDED) -->
          <section>
            <h3 class="mb-4 border-b pb-2 text-lg font-bold text-gray-800">Part II: Profile of the Institution</h3>

            <!-- A. General Information -->
            <div class="mb-6">
              <h4 class="mb-3 text-md font-semibold text-blue-800 bg-blue-50 p-2 rounded">A. General Information</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-sm">
                <InfoItem label="Institute Name" :value="localIsarData?.application_details?.institute_profile_details?.name" />
                <InfoItem label="Location" :value="localIsarData?.isar_location_details" />
                <!-- Handle Type as Object or ID -->
                <InfoItem label="Type of Institute" :value="localIsarData?.isar_type_of_institute_details?.name || localIsarData?.isar_type_of_institute_details" />
                <InfoItem label="Affiliated To" :value="localIsarData?.isar_affiliated_to_details" />
                <InfoItem label="Date Last Accredited" :value="localIsarData?.isar_date_last_accreditation" />
                <InfoItem label="Source of Funding" :value="localIsarData?.isar_source_of_funding_details?.name || localIsarData?.isar_source_of_funding_details" />
                <InfoItem label="Cost of Education" :value="localIsarData?.isar_cost_of_education_details" />
                <InfoItem label="Total Area (Acres)" :value="localIsarData?.isar_total_area_acres_details" />
                <InfoItem label="Year Established" :value="localIsarData?.isar_year_establishment_details" />
                <InfoItem label="Head of Institute" :value="localIsarData?.isar_head_of_institute_text_details" />
                <InfoItem label="Website" :value="localIsarData?.isar_website_details" is-link />
                <InfoItem label="Telephone" :value="localIsarData?.isar_telephone_details" />
                <InfoItem label="Email" :value="localIsarData?.isar_email_details" />
                <InfoItem label="Focal Person (IQA)" :value="localIsarData?.isar_focal_person_iqa_details" />

                <div class="md:col-span-2 lg:col-span-3">
                  <p class="font-medium text-gray-500 mb-1">Land Registration Certificate</p>
                  <a v-if="localIsarData?.land_registration_certificate" :href="localIsarData.land_registration_certificate" target="_blank" class="inline-flex items-center gap-2 text-blue-600 hover:underline bg-blue-50 px-3 py-1 rounded border border-blue-100">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/></svg>
                    Download Certificate
                  </a>
                  <span v-else class="text-gray-400 italic">Not Uploaded</span>
                </div>
              </div>
            </div>

            <!-- B. Academic Activities -->
            <div class="mb-6">
              <h4 class="mb-3 text-md font-semibold text-blue-800 bg-blue-50 p-2 rounded">B. Academic Activities</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-6 text-sm">
                <InfoItem label="No. of Departments" :value="localIsarData?.isar_num_departments" />

                <!-- Programme Counts -->
                <div class="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-2 md:grid-cols-5 gap-4 bg-gray-50 p-3 rounded border border-gray-100">
                   <div class="text-center"><span class="block text-gray-500 text-xs uppercase">UG</span><span class="font-bold text-lg">{{ localIsarData?.isar_num_programmes_ug || 0 }}</span></div>
                   <div class="text-center"><span class="block text-gray-500 text-xs uppercase">PG</span><span class="font-bold text-lg">{{ localIsarData?.isar_num_programmes_pg || 0 }}</span></div>
                   <div class="text-center"><span class="block text-gray-500 text-xs uppercase">Doctoral</span><span class="font-bold text-lg">{{ localIsarData?.isar_num_programmes_doctoral || 0 }}</span></div>
                   <div class="text-center"><span class="block text-gray-500 text-xs uppercase">Other</span><span class="font-bold text-lg">{{ localIsarData?.isar_num_programmes_other || 0 }}</span></div>
                   <div class="text-center border-l border-gray-300"><span class="block text-gray-500 text-xs uppercase">Total</span><span class="font-bold text-lg text-blue-600">{{ totalProgrammes }}</span></div>
                </div>

                <InfoItem label="Programmes w/ Electives" :value="localIsarData?.isar_num_programmes_with_electives" />
                <div class="md:col-span-2 lg:col-span-3">
                   <InfoItem label="Electives Details" :value="localIsarData?.isar_electives_details" />
                </div>

                <div class="md:col-span-2 lg:col-span-4">
                   <InfoItem label="New Programmes (Last 5 Years)" :value="localIsarData?.isar_new_programmes_last_5_years_details" />
                </div>

                <InfoItem label="Working Days (Last Year)" :value="localIsarData?.isar_num_working_days_last_year" />
                <InfoItem label="Teaching Days (Last Year)" :value="localIsarData?.isar_num_teaching_days_last_year" />
                <InfoItem label="Level of Autonomy" :value="localIsarData?.isar_level_of_autonomy_details" />
              </div>
            </div>

            <!-- C. Faculty Details -->
            <div class="mb-6">
              <h4 class="mb-3 text-md font-semibold text-blue-800 bg-blue-50 p-2 rounded">C. Faculty Details</h4>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 border text-sm">
                  <thead class="bg-gray-100">
                    <tr>
                      <th class="px-4 py-2 text-left font-medium text-gray-500">Category</th>
                      <th class="px-4 py-2 text-center font-medium text-gray-500">Male</th>
                      <th class="px-4 py-2 text-center font-medium text-gray-500">Female</th>
                      <th class="px-4 py-2 text-center font-bold text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                    <tr>
                      <td class="px-4 py-2 font-medium">Regular Faculty</td>
                      <td class="px-4 py-2 text-center">{{ localIsarData?.isar_regular_faculty_male || 0 }}</td>
                      <td class="px-4 py-2 text-center">{{ localIsarData?.isar_regular_faculty_female || 0 }}</td>
                      <td class="px-4 py-2 text-center font-bold">{{ sum(localIsarData?.isar_regular_faculty_male, localIsarData?.isar_regular_faculty_female) }}</td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 font-medium">Contract Faculty</td>
                      <td class="px-4 py-2 text-center">{{ localIsarData?.isar_contract_faculty_male || 0 }}</td>
                      <td class="px-4 py-2 text-center">{{ localIsarData?.isar_contract_faculty_female || 0 }}</td>
                      <td class="px-4 py-2 text-center font-bold">{{ sum(localIsarData?.isar_contract_faculty_male, localIsarData?.isar_contract_faculty_female) }}</td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 font-medium">Visiting Faculty</td>
                      <td class="px-4 py-2 text-center">{{ localIsarData?.isar_visiting_faculty_male || 0 }}</td>
                      <td class="px-4 py-2 text-center">{{ localIsarData?.isar_visiting_faculty_female || 0 }}</td>
                      <td class="px-4 py-2 text-center font-bold">{{ sum(localIsarData?.isar_visiting_faculty_male, localIsarData?.isar_visiting_faculty_female) }}</td>
                    </tr>
                    <tr class="bg-gray-50 font-bold">
                      <td class="px-4 py-2">Total Faculty</td>
                      <td class="px-4 py-2 text-center">{{ localIsarData?.isar_faculty_male || 0 }}</td>
                      <td class="px-4 py-2 text-center">{{ localIsarData?.isar_faculty_female || 0 }}</td>
                      <td class="px-4 py-2 text-center text-blue-600">{{ sum(localIsarData?.isar_faculty_male, localIsarData?.isar_faculty_female) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                 <div class="bg-gray-50 p-2 rounded border"><span class="text-gray-500">PhD Holders:</span> <span class="font-bold ml-2">{{ localIsarData?.isar_faculty_doctoral || 0 }}</span></div>
                 <div class="bg-gray-50 p-2 rounded border"><span class="text-gray-500">Masters Holders:</span> <span class="font-bold ml-2">{{ localIsarData?.isar_faculty_masters || 0 }}</span></div>
                 <div class="bg-gray-50 p-2 rounded border"><span class="text-gray-500">Bachelors Holders:</span> <span class="font-bold ml-2">{{ localIsarData?.isar_faculty_bachelors || 0 }}</span></div>
              </div>
            </div>

            <!-- D. Non-Teaching Staff -->
            <div class="mb-6">
              <h4 class="mb-3 text-md font-semibold text-blue-800 bg-blue-50 p-2 rounded">D. Non-Teaching Staff</h4>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 border text-sm">
                  <thead class="bg-gray-100">
                    <tr>
                      <th class="px-4 py-2 text-left font-medium text-gray-500">Category</th>
                      <th class="px-4 py-2 text-center font-medium text-gray-500">Male</th>
                      <th class="px-4 py-2 text-center font-medium text-gray-500">Female</th>
                      <th class="px-4 py-2 text-center font-bold text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                    <tr>
                      <td class="px-4 py-2 font-medium">Technical Staff</td>
                      <td class="px-4 py-2 text-center">{{ localIsarData?.isar_technical_staff_male || 0 }}</td>
                      <td class="px-4 py-2 text-center">{{ localIsarData?.isar_technical_staff_female || 0 }}</td>
                      <td class="px-4 py-2 text-center font-bold">{{ sum(localIsarData?.isar_technical_staff_male, localIsarData?.isar_technical_staff_female) }}</td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 font-medium">Admin Staff</td>
                      <td class="px-4 py-2 text-center">{{ localIsarData?.isar_admin_staff_male || 0 }}</td>
                      <td class="px-4 py-2 text-center">{{ localIsarData?.isar_admin_staff_female || 0 }}</td>
                      <td class="px-4 py-2 text-center font-bold">{{ sum(localIsarData?.isar_admin_staff_male, localIsarData?.isar_admin_staff_female) }}</td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 font-medium">Support Staff</td>
                      <td class="px-4 py-2 text-center">{{ localIsarData?.isar_support_staff_male || 0 }}</td>
                      <td class="px-4 py-2 text-center">{{ localIsarData?.isar_support_staff_female || 0 }}</td>
                      <td class="px-4 py-2 text-center font-bold">{{ sum(localIsarData?.isar_support_staff_male, localIsarData?.isar_support_staff_female) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- E. Student Enrolment -->
            <div class="mb-6">
              <h4 class="mb-3 text-md font-semibold text-blue-800 bg-blue-50 p-2 rounded">E. Student Enrolment</h4>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 border text-sm">
                  <thead class="bg-gray-100">
                    <tr>
                      <th class="px-4 py-2 text-left font-medium text-gray-500">Program Level</th>
                      <th class="px-4 py-2 text-center font-medium text-gray-500">Male</th>
                      <th class="px-4 py-2 text-center font-medium text-gray-500">Female</th>
                      <th class="px-4 py-2 text-center font-bold text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                    <tr>
                      <td class="px-4 py-2 font-medium">Diploma</td>
                      <td class="px-4 py-2 text-center">{{ localIsarData?.isar_students_diploma_male || 0 }}</td>
                      <td class="px-4 py-2 text-center">{{ localIsarData?.isar_students_diploma_female || 0 }}</td>
                      <td class="px-4 py-2 text-center font-bold">{{ sum(localIsarData?.isar_students_diploma_male, localIsarData?.isar_students_diploma_female) }}</td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 font-medium">Bachelors</td>
                      <td class="px-4 py-2 text-center">{{ localIsarData?.isar_students_bachelors_male || 0 }}</td>
                      <td class="px-4 py-2 text-center">{{ localIsarData?.isar_students_bachelors_female || 0 }}</td>
                      <td class="px-4 py-2 text-center font-bold">{{ sum(localIsarData?.isar_students_bachelors_male, localIsarData?.isar_students_bachelors_female) }}</td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 font-medium">Masters</td>
                      <td class="px-4 py-2 text-center">{{ localIsarData?.isar_students_masters_male || 0 }}</td>
                      <td class="px-4 py-2 text-center">{{ localIsarData?.isar_students_masters_female || 0 }}</td>
                      <td class="px-4 py-2 text-center font-bold">{{ sum(localIsarData?.isar_students_masters_male, localIsarData?.isar_students_masters_female) }}</td>
                    </tr>
                    <tr>
                      <td class="px-4 py-2 font-medium">Other</td>
                      <td class="px-4 py-2 text-center">{{ localIsarData?.isar_students_other_male || 0 }}</td>
                      <td class="px-4 py-2 text-center">{{ localIsarData?.isar_students_other_female || 0 }}</td>
                      <td class="px-4 py-2 text-center font-bold">{{ sum(localIsarData?.isar_students_other_male, localIsarData?.isar_students_other_female) }}</td>
                    </tr>
                    <tr class="bg-blue-50 font-bold">
                        <td class="px-4 py-2">Grand Total</td>
                        <td class="px-4 py-2 text-center">{{ totalStudentsMale }}</td>
                        <td class="px-4 py-2 text-center">{{ totalStudentsFemale }}</td>
                        <td class="px-4 py-2 text-center text-blue-600">{{ totalStudentsMale + totalStudentsFemale }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <!-- Part III: Main Report Documents -->
          <section>
            <h3 class="mb-4 border-b pb-2 text-lg font-bold text-gray-800">Part III: Main Report Documents</h3>
            <div v-if="localIsarData?.isar_standard_documents?.length" class="grid grid-cols-1 gap-3">
              <div v-for="doc in localIsarData.isar_standard_documents" :key="doc.id" class="flex items-center justify-between rounded-md border bg-white p-3 shadow-sm">
                <span class="font-medium text-gray-700">{{ doc.standard_details?.standard_name || 'Document' }}</span>
                <a :href="doc.document_file" target="_blank" class="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition">Download</a>
              </div>
            </div>
            <p v-else class="rounded-md bg-gray-100 p-3 italic text-gray-500">No main report documents provided.</p>
          </section>

          <!-- Dealing Officer Workflow -->
          <section class="space-y-6 border-t-2 border-gray-200 pt-8 mt-8">
            <h3 class="mb-4 text-2xl font-bold text-gray-900">Dealing Officer Workflow</h3>

            <!-- 1. Assign Assessors -->
            <div class="rounded-lg border border-blue-200 bg-blue-50 p-5">
              <h4 class="mb-3 text-lg font-bold text-blue-900">1. Assign Assessors</h4>

              <div v-if="!isAssignmentActionNeeded" class="space-y-2">
                <p class="text-sm font-medium text-green-700 flex items-center gap-2">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                    A valid team of {{ numberOfValidAssessors }} assessors has been assigned.
                </p>
              </div>

              <div v-else class="space-y-4">
                <div v-if="isReassignmentNeeded" class="rounded-md border border-red-300 bg-red-100 p-3 text-sm text-red-800">
                  <p class="font-bold flex items-center gap-2">
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                    Action Required: COI Dispute
                  </p>
                  <p>A conflict was declared. Remove the disputed assessor(s) below and select replacements.</p>
                </div>

                <div v-if="currentTotalTeamSize >= 5" class="rounded-md bg-orange-50 border border-orange-200 p-3 text-sm text-orange-800 flex items-center gap-2">
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                  <span>Maximum limit reached (5 assessors). Deselect an assessor to change selection.</span>
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                  <div class="flex-grow">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Available Assessors ({{ selectedAssessorIds.length }} selected)</label>
                    <div class="max-h-60 overflow-y-auto rounded-md border border-gray-300 bg-white p-2">
                      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        <div v-for="assessor in availableAssessorsForAssignment" :key="assessor.id"
                             class="flex items-center rounded-md p-2 transition-colors"
                             :class="{'hover:bg-gray-100': !isAssessorDisabled(assessor.id), 'opacity-50 bg-gray-50': isAssessorDisabled(assessor.id)}">
                          <input :id="`assessor-${assessor.id}`" type="checkbox" :value="assessor.id" v-model="selectedAssessorIds"
                                 :disabled="isAssessorDisabled(assessor.id)"
                                 class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:text-gray-400" />
                          <label :for="`assessor-${assessor.id}`" class="ml-2 block text-sm text-gray-900 cursor-pointer w-full" :class="{'cursor-not-allowed text-gray-400': isAssessorDisabled(assessor.id)}">
                            {{ assessor.name }}
                          </label>
                        </div>
                      </div>
                      <p v-if="!availableAssessorsForAssignment.length" class="text-center text-xs text-gray-500 mt-2">No new assessors available.</p>
                    </div>
                    <p class="mt-2 text-xs text-gray-500">
                      Team Status: <strong>{{ numberOfValidAssessors }}</strong> Existing + <strong>{{ selectedAssessorIds.length }}</strong> New = <strong>{{ currentTotalTeamSize }}</strong> Total. (Req: 3-5)
                    </p>
                  </div>
                  <div class="flex items-end">
                      <button @click="assignAssessors" :disabled="isAssignActionInvalid || isProcessing" class="w-full md:w-auto rounded bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 shadow-sm">
                        <span v-if="isProcessing">Saving...</span>
                        <span v-else>Assign Assessor</span>
                      </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 2. COI Status -->
            <div class="rounded-lg border border-yellow-300 bg-yellow-50 p-5">
              <h4 class="mb-3 text-lg font-bold text-yellow-900">2. Conflict of Interest (COI) Status</h4>
              <div v-if="localIsarData?.application_details?.assessor_cois_details?.length" class="space-y-3">
                <div v-for="coi in localIsarData.application_details.assessor_cois_details" :key="coi.id"
                     class="rounded-lg border bg-white p-4 shadow-sm transition-all"
                     :class="{ 'border-red-500 ring-2 ring-red-100': coi.status === 'conflict_declared' }">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h5 class="font-bold text-gray-800">{{ coi.assessor_details.name }}</h5>
                      <p class="text-xs text-gray-500">{{ coi.assessor_details.email }}</p>
                    </div>

                    <div v-if="coi.status === 'conflict_declared'">
                        <button @click="removeDisputedAssessor(coi)" :disabled="isProcessing" class="flex items-center gap-1 rounded bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-200 border border-red-200 transition">
                            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
                            Remove Assessor
                        </button>
                    </div>
                    <div v-else class="flex items-center gap-2">
                        <span class="rounded-full px-3 py-1 text-xs font-bold border" :class="getCoiStatusClass(coi.status)">
                            {{ coi.status_display }}
                        </span>
                        <button v-if="coi.status === 'pending_institute_review'" @click="confirmNoConflict(coi)" :disabled="isProcessing" class="flex items-center gap-1 rounded bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700 hover:bg-green-200 border border-green-200 transition">
                            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                            Approve (No Conflict)
                        </button>
                    </div>
                  </div>

                  <!-- Institute Remarks -->
                  <div class="mt-3 pt-2 border-t border-gray-100 text-sm">
                    <div class="flex gap-2">
                        <span class="font-medium text-gray-500">Institute Response:</span>
                        <span class="font-bold" :class="getInstituteResponseClass(coi.status)">{{ formatInstituteResponse(coi) }}</span>
                    </div>
                    <p v-if="coi.institute_rejection_remarks" class="mt-1 bg-red-50 p-2 rounded text-red-800 text-xs italic border border-red-100">
                        "{{ coi.institute_rejection_remarks }}"
                    </p>
                  </div>
                </div>
              </div>
              <p v-else class="text-sm text-gray-600 italic">No assessors currently assigned.</p>
            </div>

            <!-- 3. Physical Verification -->
            <div class="rounded-lg border border-green-300 bg-green-50 p-5">
              <h4 class="mb-3 text-lg font-bold text-green-900">3. Physical Verification Schedule</h4>
              <div v-if="currentSiteVisit && !isRescheduling" class="mb-4 bg-white p-4 rounded-md border border-green-200 shadow-sm">
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div><p class="text-gray-500 text-xs uppercase">Start Date</p><p class="font-bold text-gray-800 text-lg">{{ formatDateDisplay(currentSiteVisit.start_datetime) }}</p></div>
                      <div><p class="text-gray-500 text-xs uppercase">End Date</p><p class="font-bold text-gray-800 text-lg">{{ formatDateDisplay(currentSiteVisit.end_datetime) }}</p></div>
                      <div>
                          <p class="text-gray-500 text-xs uppercase">Status</p>
                          <span class="font-bold" :class="instituteRequestedReschedule ? 'text-orange-600' : (currentSiteVisit.is_confirmed_by_institute ? 'text-green-600' : 'text-gray-500')">
                              {{ instituteRequestedReschedule ? 'Reschedule Requested' : (currentSiteVisit.is_confirmed_by_institute ? 'Confirmed by Institute' : 'Pending Confirmation') }}
                          </span>
                      </div>
                  </div>
                  <div v-if="instituteRequestedReschedule" class="mt-3 p-2 bg-orange-50 border-l-4 border-orange-400 text-xs text-orange-800">
                      <strong>Institute Remark:</strong> "{{ currentSiteVisit.institute_confirmation_remarks }}"
                  </div>
              </div>

              <div v-if="canManageVisit">
                <div v-if="currentSiteVisit && !isRescheduling" class="text-right">
                  <button v-if="!currentSiteVisit.is_confirmed_by_institute" @click="startRescheduling" class="rounded bg-yellow-500 px-4 py-2 text-sm font-bold text-white hover:bg-yellow-600 shadow-sm">
                    {{ instituteRequestedReschedule ? 'Respond to Request' : 'Edit Schedule' }}
                  </button>
                </div>
                <div v-if="!currentSiteVisit || isRescheduling" class="bg-white p-4 rounded border border-gray-200">
                  <label class="block text-sm font-bold text-gray-700 mb-2">Set Visit Dates</label>
                  <div class="flex flex-col sm:flex-row gap-4 items-end">
                    <div class="flex-grow w-full"><span class="text-xs text-gray-500">From</span><input type="date" v-model="visitStartDate" class="form-input mt-1"></div>
                    <div class="flex-grow w-full"><span class="text-xs text-gray-500">To</span><input type="date" v-model="visitEndDate" class="form-input mt-1"></div>
                    <div class="flex gap-2 w-full sm:w-auto">
                        <button v-if="isRescheduling" @click="cancelRescheduling" class="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 w-1/2 sm:w-auto">Cancel</button>
                        <button @click="currentSiteVisit ? updateSchedule() : scheduleVisit()" :disabled="!visitStartDate || !visitEndDate || isProcessing" class="rounded bg-green-600 px-4 py-2 text-white font-bold hover:bg-green-700 disabled:opacity-50 w-1/2 sm:w-auto">
                            Save
                        </button>
                    </div>
                  </div>
                </div>
              </div>
              <p v-else class="text-sm text-gray-500 italic">Available after COI is resolved.</p>
            </div>

            <!-- 4. Consolidated Report -->
            <div class="rounded-lg border border-purple-200 bg-purple-50 p-5">
              <h4 class="mb-3 text-lg font-bold text-purple-900">4. Consolidated Site Visit Report</h4>
              <div v-if="canUploadConsolidatedReport">
                <div v-if="existingReportUrl && !isReplacingReport" class="flex items-center justify-between bg-white p-3 rounded border border-purple-100 shadow-sm">
                    <div class="flex items-center gap-3 overflow-hidden">
                        <svg class="h-8 w-8 text-purple-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/></svg>
                        <span class="font-medium text-gray-700 truncate">{{ getFileNameFromUrl(existingReportUrl) }}</span>
                    </div>
                    <div class="flex gap-2 shrink-0">
                        <a :href="existingReportUrl" target="_blank" class="rounded bg-purple-600 px-3 py-1 text-sm font-bold text-white hover:bg-purple-700">Download</a>
                        <button @click="isReplacingReport = true" class="rounded bg-yellow-500 px-3 py-1 text-sm font-bold text-white hover:bg-yellow-600">Replace</button>
                    </div>
                </div>
                <div v-else class="bg-white p-4 rounded border border-purple-100">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Upload Report Document</label>
                    <div class="flex flex-col sm:flex-row gap-3">
                        <input type="file" @change="handleConsolidatedReportFileChange" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"/>
                        <div class="flex gap-2">
                            <button @click="uploadConsolidatedReport" :disabled="!consolidatedReportFile || isProcessing" class="rounded bg-purple-600 px-4 py-2 text-white font-bold hover:bg-purple-700 disabled:opacity-50 whitespace-nowrap">Upload</button>
                            <button v-if="isReplacingReport" @click="isReplacingReport = false; consolidatedReportFile = null" class="rounded bg-gray-200 px-3 py-2 text-gray-600 hover:bg-gray-300">Cancel</button>
                        </div>
                    </div>
                </div>
              </div>
              <p v-else class="text-sm text-gray-500 italic">Available after site visit is confirmed.</p>
            </div>

            <!-- 5. Final Decision -->
            <div class="rounded-lg border border-red-200 bg-red-50 p-5">
              <h4 class="mb-3 text-lg font-bold text-red-900">5. Final Accreditation Decision</h4>
              <div v-if="canMakeFinalDecision" class="space-y-4 bg-white p-4 rounded border border-red-100">
                <div>
                  <label class="block text-sm font-bold text-gray-700">Final Grade Awarded</label>
                  <select v-model="selectedGradeId" class="form-input mt-1 w-full border-gray-300 rounded shadow-sm">
                    <option :value="null" disabled>Select Grade...</option>
                    <option v-for="grade in ratingCategories" :key="grade.id" :value="grade.id">{{ grade.rating_category_name }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-bold text-gray-700">Remarks</label>
                  <textarea v-model="finalRemarks" rows="3" class="form-input mt-1 w-full border-gray-300 rounded shadow-sm" placeholder="Enter official remarks for the certificate/rejection letter..."></textarea>
                </div>
                <button @click="submitFinalDecision" :disabled="!selectedGradeId || isProcessing" class="w-full rounded bg-red-600 px-4 py-3 text-white font-bold hover:bg-red-700 disabled:opacity-50 shadow">
                  {{ isProcessing ? 'Processing...' : 'Submit Final Decision' }}
                </button>
              </div>
              <p v-else class="text-sm text-gray-500 italic">Available after consolidated report is submitted.</p>
            </div>

          </section>
        </div>
      </div>

      <!-- Footer -->
      <footer class="sticky bottom-0 flex justify-end gap-4 border-t bg-gray-50 p-4">
        <button type="button" class="rounded bg-gray-200 px-6 py-2 text-gray-800 hover:bg-gray-300 font-medium" @click="close">Close</button>
      </footer>
    </dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineComponent } from 'vue';
import { useToast, TYPE } from 'vue-toastification';
import apiService from '@/services/services';
import ConfirmToast from '@/components/common/ConfirmationToast.vue';

// --- Small Helper Component for Displaying Info ---
const InfoItem = defineComponent({
  props: { label: String, value: [String, Number], isLink: Boolean },
  template: `
    <div>
      <p class="font-medium text-gray-500 mb-1">{{ label }}</p>
      <a v-if="isLink && value" :href="value" target="_blank" class="block p-2 bg-gray-100 rounded text-blue-600 hover:underline truncate">{{ value }}</a>
      <p v-else class="p-2 bg-gray-100 rounded text-gray-900 border border-gray-200 min-h-[2.5rem]">{{ value || 'N/A' }}</p>
    </div>
  `
});

const props = defineProps({
  isOpen: Boolean,
  isarData: { type: Object, required: true },
  assessors: { type: Array, default: () => [] },
  ratingCategories: { type: Array, default: () => [] },
});

const emit = defineEmits(['close', 'action-completed']);
const toast = useToast();

const localIsarData = ref(null);
const isProcessing = ref(false);
const selectedAssessorIds = ref([]);
const visitStartDate = ref('');
const visitEndDate = ref('');
const isRescheduling = ref(false);
const consolidatedReportFile = ref(null);
const finalRemarks = ref('');
const selectedGradeId = ref(null);
const isReplacingReport = ref(false);
const initialAssessorCount = ref(0);
const assessorIdsToRemove = ref([]);

// --- Helpers for Part II Computations ---
const sum = (val1, val2) => (Number(val1) || 0) + (Number(val2) || 0);

const totalProgrammes = computed(() => {
    const data = localIsarData.value;
    if (!data) return 0;
    return (Number(data.isar_num_programmes_ug)||0) + (Number(data.isar_num_programmes_pg)||0) + (Number(data.isar_num_programmes_doctoral)||0) + (Number(data.isar_num_programmes_other)||0);
});

const totalStudentsMale = computed(() => {
    const d = localIsarData.value;
    if (!d) return 0;
    return sum(d.isar_students_diploma_male, 0) + sum(d.isar_students_bachelors_male, 0) + sum(d.isar_students_masters_male, 0) + sum(d.isar_students_other_male, 0);
});

const totalStudentsFemale = computed(() => {
    const d = localIsarData.value;
    if (!d) return 0;
    return sum(d.isar_students_diploma_female, 0) + sum(d.isar_students_bachelors_female, 0) + sum(d.isar_students_masters_female, 0) + sum(d.isar_students_other_female, 0);
});

// --- Existing Logic ---
const existingReportUrl = computed(() => localIsarData.value?.application_details?.consolidated_site_visit_report_url || null);

const getFileNameFromUrl = (url) => {
  if (!url) return 'File';
  try { return decodeURIComponent(url.substring(url.lastIndexOf('/') + 1)); } catch (e) { return 'File'; }
};

const formatDateDisplay = (dateString) => {
    if(!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

watch(() => props.isarData, (newData) => {
  if (newData) {
    localIsarData.value = JSON.parse(JSON.stringify(newData));
    initialAssessorCount.value = newData.application_details?.assessor_cois_details?.length || 0;
    assessorIdsToRemove.value = [];
    selectedAssessorIds.value = [];
    consolidatedReportFile.value = null;
    finalRemarks.value = '';
    selectedGradeId.value = null;
    isReplacingReport.value = false;

    const existingVisit = localIsarData.value?.application_details?.site_visits?.[0];
    if (existingVisit) {
      visitStartDate.value = existingVisit.start_datetime.split('T')[0];
      visitEndDate.value = existingVisit.end_datetime.split('T')[0];
      const instituteRequested = existingVisit.is_confirmed_by_institute === false && !!existingVisit.institute_confirmation_remarks;
      isRescheduling.value = instituteRequested;
    } else {
      visitStartDate.value = '';
      visitEndDate.value = '';
      isRescheduling.value = false;
    }
  }
}, { immediate: true, deep: true });

const currentSiteVisit = computed(() => localIsarData.value?.application_details?.site_visits?.[0] || null);
const instituteRequestedReschedule = computed(() => currentSiteVisit.value && currentSiteVisit.value.is_confirmed_by_institute === false && !!currentSiteVisit.value.institute_confirmation_remarks);

const isReassignmentNeeded = computed(() => {
  if (!localIsarData.value?.application_details?.assessor_cois_details) return false;
  return localIsarData.value.application_details.assessor_cois_details.some(coi => coi.status === 'conflict_declared');
});

const numberOfValidAssessors = computed(() => {
    if (!localIsarData.value?.application_details?.assessor_cois_details) return 0;
    return localIsarData.value.application_details.assessor_cois_details.filter(coi => coi.status !== 'conflict_declared').length;
});

const requiredAssessorCount = computed(() => Math.max(3, initialAssessorCount.value));

const isAssignmentActionNeeded = computed(() => {
    const hasAssessors = localIsarData.value?.application_details?.assessor_cois_details?.length > 0;
    if (!hasAssessors) return true;
    return isReassignmentNeeded.value || numberOfValidAssessors.value < requiredAssessorCount.value;
});

const currentTotalTeamSize = computed(() => numberOfValidAssessors.value + selectedAssessorIds.value.length);

const availableAssessorsForAssignment = computed(() => {
  if (!props.assessors.length) return [];
  const currentlyAssignedIds = new Set(
    localIsarData.value?.application_details?.assessor_cois_details.map(coi => coi.assessor) || []
  );
  return props.assessors.filter(assessor => !currentlyAssignedIds.has(assessor.id));
});

const isAssessorDisabled = (assessorId) => {
    if (currentTotalTeamSize.value >= 5 && !selectedAssessorIds.value.includes(assessorId)) return true;
    return false;
};

const isAssignActionInvalid = computed(() => {
  const selectedCount = selectedAssessorIds.value.length;
  if (selectedCount === 0 && assessorIdsToRemove.value.length === 0) return true;
  const totalFutureCount = numberOfValidAssessors.value + selectedCount;
  return totalFutureCount < requiredAssessorCount.value || totalFutureCount > 5;
});

const STATUS_ORDER = ['draft_initial', 'pending_payment', 'initial_app_submitted_heqc_review', 'initial_app_rejected', 'initial_app_approved_awaiting_isar', 'isar_submitted_heqc_review', 'isar_queried_by_heqc', 'isar_accepted_by_heqc', 'coi_pending_declaration', 'coi_conflict_declared', 'coi_resolved_scheduling_visit', 'site_visit_scheduled', 'site_visit_confirmed', 'site_visit_completed', 'assessment_report_submitted', 'approved_accredited', 'approved_conditional', 'rejected_not_accredited', 'appealed', 'closed_withdrawn', 'closed_completed'];
const getStatusIndex = (status) => STATUS_ORDER.indexOf(status);

const canManageVisit = computed(() => {
  const currentStatus = localIsarData.value?.application_details?.status;
  if (!currentStatus) return false;
  return getStatusIndex(currentStatus) >= getStatusIndex('coi_resolved_scheduling_visit');
});

const canUploadConsolidatedReport = computed(() => {
  const currentStatus = localIsarData.value?.application_details?.status;
  if (!currentStatus) return false;
  return getStatusIndex(currentStatus) >= getStatusIndex('site_visit_confirmed');
});

const canMakeFinalDecision = computed(() => {
  const currentStatus = localIsarData.value?.application_details?.status;
  if (!currentStatus) return false;
  return getStatusIndex(currentStatus) >= getStatusIndex('assessment_report_submitted');
});

const removeDisputedAssessor = (coiToRemove) => {
  const message = `This will mark ${coiToRemove.assessor_details.name} for removal. Confirm removal?`;
  toast({
    component: ConfirmToast,
    props: { message },
    listeners: {
      onConfirm: () => {
        if (!assessorIdsToRemove.value.includes(coiToRemove.id)) assessorIdsToRemove.value.push(coiToRemove.id);
        const index = localIsarData.value.application_details.assessor_cois_details.findIndex(c => c.id === coiToRemove.id);
        if (index > -1) localIsarData.value.application_details.assessor_cois_details.splice(index, 1);
        toast.info(`${coiToRemove.assessor_details.name} removed locally. Select replacement & click Save Team.`);
      }
    }
  }, { type: TYPE.INFO, timeout: 8000, closeOnClick: false, pauseOnFocusLoss: false, draggable: false, closeButton: true });
};

const assignAssessors = async () => {
  isProcessing.value = true;
  try {
    await Promise.all(assessorIdsToRemove.value.map(id => apiService.deleteApplicationAssessorCOI(id)));
    if (selectedAssessorIds.value.length > 0) {
        await apiService.createApplicationAssessorCOI({ application: localIsarData.value.application_details.id, assessor_ids: selectedAssessorIds.value });
    }
    toast.success('Assessor team updated successfully.');
    emit('action-completed');
  } catch (error) {
    toast.error(error.response?.data?.detail || 'Error saving changes.');
  } finally { isProcessing.value = false; }
};

const scheduleVisit = async () => {
  isProcessing.value = true;
  try {
    await apiService.createApplicationSiteVisit({ application: localIsarData.value.application_details.id, start_datetime: `${visitStartDate.value}T09:00:00Z`, end_datetime: `${visitEndDate.value}T17:00:00Z` });
    toast.success('Visit scheduled successfully!');
    emit('action-completed');
  } catch (error) { toast.error(error.response?.data?.detail || 'Error scheduling visit.'); } finally { isProcessing.value = false; }
};

const updateSchedule = async () => {
  isProcessing.value = true;
  try {
    await apiService.updateApplicationSiteVisit(currentSiteVisit.value.id, { application: localIsarData.value.application_details.id, start_datetime: `${visitStartDate.value}T09:00:00Z`, end_datetime: `${visitEndDate.value}T17:00:00Z`, is_confirmed_by_institute: false, institute_confirmation_remarks: null });
    toast.success('Schedule updated successfully!');
    emit('action-completed');
  } catch (error) { toast.error(error.response?.data?.detail || 'Error updating schedule.'); } finally { isProcessing.value = false; }
};

const startRescheduling = () => { isRescheduling.value = true; };
const cancelRescheduling = () => {
  isRescheduling.value = false;
  if (currentSiteVisit.value) {
    visitStartDate.value = currentSiteVisit.value.start_datetime.split('T')[0];
    visitEndDate.value = currentSiteVisit.value.end_datetime.split('T')[0];
  }
};

const handleConsolidatedReportFileChange = (event) => { consolidatedReportFile.value = event.target.files[0]; };

const uploadConsolidatedReport = async () => {
    isProcessing.value = true;
    const formData = new FormData();
    formData.append('consolidated_site_visit_report', consolidatedReportFile.value);
    try {
        await apiService.patchAccreditationApplication(localIsarData.value.application_details.id, formData);
        await apiService.patchAccreditationApplication(localIsarData.value.application_details.id, { status: 'assessment_report_submitted' });
        toast.success('Report uploaded successfully.');
        emit('action-completed');
    } catch (error) { toast.error(error.response?.data?.detail || 'Error uploading file.'); } finally { isProcessing.value = false; }
};

const submitFinalDecision = async () => {
  toast({
    component: ConfirmToast,
    props: { message: "Submit final accreditation decision?" },
    listeners: {
      onConfirm: async () => {
        isProcessing.value = true;
        try {
          await apiService.makeFinalDecision(localIsarData.value.application_details.id, { final_grade_awarded: selectedGradeId.value, remarks_heqc_final: finalRemarks.value });
          toast.success('Decision submitted.');
          emit('action-completed');
        } catch (error) { toast.error(error.response?.data?.detail || 'Error finalizing decision.'); } finally { isProcessing.value = false; }
      }
    }
  }, { type: TYPE.WARNING, timeout: false });
};

const confirmNoConflict = async (coi) => {
  toast({
    component: ConfirmToast,
    props: {
      message: `Confirm that there is no conflict of interest for ${coi.assessor_details.name}?`
    },
    listeners: {
      onConfirm: async () => {
        isProcessing.value = true;
        try {
          // Send true for institute_agrees_with_assessor
          await apiService.post(`/accreditation/application-assessor-cois/${coi.id}/respond/`, {
            institute_agrees_with_assessor: true,
            institute_rejection_remarks: "" // Ensure remarks are empty for no conflict
          });
          toast.success(`COI for ${coi.assessor_details.name} approved.`);
          emit('action-completed'); // Refresh parent data
        } catch (error) {
          toast.error(error.response?.data?.detail || `Error approving COI for ${coi.assessor_details.name}.`);
        } finally {
          isProcessing.value = false;
        }
      }
    }
  }, {
    type: TYPE.INFO,
    timeout: false,
    closeOnClick: false,
    pauseOnFocusLoss: false,
    draggable: false,
    closeButton: true
  });
};

const close = () => emit('close');
const getStatusClass = (status) => {
  const classes = { 'coi_conflict_declared': 'bg-red-200 text-red-800', 'coi_pending_declaration': 'bg-orange-100 text-orange-800', 'coi_resolved_scheduling_visit': 'bg-teal-100 text-teal-800', 'site_visit_confirmed': 'bg-indigo-200 text-indigo-900', 'assessment_report_submitted': 'bg-cyan-100 text-cyan-800', 'approved_accredited': 'bg-green-100 text-green-800', 'rejected_not_accredited': 'bg-red-100 text-red-800' };
  return classes[status] || 'bg-gray-100 text-gray-800';
};
const getCoiStatusClass = (status) => {
  const classes = { 'pending_institute_review': 'bg-yellow-100 text-yellow-800 border-yellow-200', 'approved_no_conflict': 'bg-green-100 text-green-800 border-green-200', 'conflict_declared': 'bg-red-200 text-red-800 border-red-200' };
  return classes[status] || 'bg-gray-100 text-gray-800';
};
const formatInstituteResponse = (coi) => ({ 'approved_no_conflict': 'No Conflict', 'conflict_declared': 'Conflict Declared', 'pending_institute_review': 'Pending' }[coi.status] || 'N/A');
const getInstituteResponseClass = (status) => ({ 'approved_no_conflict': 'text-green-600', 'conflict_declared': 'text-red-600', 'pending_institute_review': 'text-yellow-600' }[status] || 'text-gray-500');
</script>

<style scoped>
.form-input { @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm; }
dialog:not([open]) { display: none; }
</style>