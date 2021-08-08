<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 class="text-4xl font-extrabold text-gray-800 mb-2 md:mb-0">Institute Profile</h1>
        <div v-if="!isEditing && profileId && !loading">
          <button type="button" @click="handleEditClick"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-3.586 3.586l-2.828 2.828-.793.793-2.828-2.828-2.828 2.828-.793.793-2.828-2.828-.793.793L.586 16.586a2 2 0 102.828 2.828L15 8.414l-2.828-2.828-.793.793zM15 16h-2a1 1 0 110-2h2a1 1 0 010 2z" />
            </svg>
            Edit Profile
          </button>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-lg p-8">
        <div v-if="loading" class="flex justify-center items-center py-20">
          <svg class="animate-spin h-16 w-16 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
        </div>

        <div v-else-if="!profileId && isEditing"
          class="mb-6 p-4 bg-blue-100 text-blue-800 border-l-4 border-blue-500 rounded-lg" role="alert">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="font-medium">No institute profile found. Please fill in the details below to create one.</p>
          </div>
        </div>

        <form v-if="!loading" @submit.prevent="submitForm" class="space-y-10">

          <div class="form-section">
            <h2 class="section-heading">Basic Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-group">
                <label for="name" class="form-label">Name</label>
                <input type="text" id="name" v-model="formData.name" :disabled="!isEditing" class="form-input" required>
              </div>
              <div class="form-group">
                <label for="type" class="form-label">Type</label>
                <select id="type" v-model="formData.type" :disabled="!isEditing" class="form-input" required>
                  <option value="">Select type</option>
                  <option v-for="typeObj in instituteTypes" :key="typeObj.id" :value="typeObj.id">{{ typeObj.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label for="year_established" class="form-label">Year Of Establishment</label>
                <input type="number" id="year_established" v-model="formData.year_established" min="1900"
                  :max="new Date().getFullYear()" :disabled="!isEditing" class="form-input" required>
              </div>
              <div class="form-group">
                <label for="website" class="form-label">Website</label>
                <input type="url" id="website" v-model="formData.website" :disabled="!isEditing" class="form-input"
                  placeholder="https://example.com">
              </div>
              <div class="form-group md:col-span-2">
                <label for="address" class="form-label">Address</label>
                <textarea id="address" v-model="formData.address" rows="2" :disabled="!isEditing" class="form-input"
                  required></textarea>
              </div>
              <div class="form-group">
                <label for="dzongkhag" class="form-label">Dzongkhag/Thromde</label>
                <input type="text" id="dzongkhag" v-model="formData.dzongkhag" :disabled="!isEditing" class="form-input"
                  required>
              </div>
              <div class="form-group">
                <label for="affiliated_to" class="form-label">Affiliated To</label>
                <input type="text" id="affiliated_to" v-model="formData.affiliated_to" :disabled="!isEditing"
                  class="form-input">
              </div>
              <div class="form-group">
                <label for="source_of_funding" class="form-label">Source of Funding</label>
                <select id="source_of_funding" v-model="formData.source_of_funding" :disabled="!isEditing"
                  class="form-input">
                  <option value="">Select funding source</option>
                  <option v-for="sourceObj in fundingSources" :key="sourceObj.id" :value="sourceObj.id">{{ sourceObj.name
                  }}</option>
                </select>
              </div>
              <div class="form-group">
                <label for="total_area" class="form-label">Total Area (acres)</label>
                <input type="number" id="total_area" v-model="formData.total_area" min="0" :disabled="!isEditing"
                  class="form-input">
              </div>
              <div class="form-group">
                <label for="land_registration" class="form-label">Land Registration Certificate</label>
                <input v-if="isEditing" type="file" id="land_registration"
                  @change="handleFileUpload('land_registration', $event)" class="form-file-input">
                <p v-if="existingLandRegistration && (!isEditing || (isEditing && !formData.land_registration_file))"
                  class="form-file-info">
                  Current file: <a :href="existingLandRegistration" target="_blank" rel="noopener noreferrer"
                    class="text-blue-600 hover:underline transition-colors duration-200">{{
                    getFileName(existingLandRegistration) }}</a>
                  <span v-if="isEditing && !formData.land_registration_file" class="ml-2 text-xs text-gray-400">
                    (select a new file to replace)</span>
                </p>
                <p v-if="formData.land_registration_file && isEditing" class="form-file-new">
                  New file selected: {{ formData.land_registration_file.name }}
                </p>
                <p v-if="!existingLandRegistration && !isEditing" class="form-file-none">
                  No file uploaded.
                </p>
              </div>
              <div class="form-group">
                <label for="tax_details" class="form-label">Latest Tax Details</label>
                <input v-if="isEditing" type="file" id="tax_details" @change="handleFileUpload('tax_details', $event)"
                  class="form-file-input">
                <p v-if="existingTaxDetails && (!isEditing || (isEditing && !formData.tax_details_file))"
                  class="form-file-info">
                  Current file: <a :href="existingTaxDetails" target="_blank" rel="noopener noreferrer"
                    class="text-blue-600 hover:underline transition-colors duration-200">{{
                    getFileName(existingTaxDetails) }}</a>
                  <span v-if="isEditing && !formData.tax_details_file" class="ml-2 text-xs text-gray-400">
                    (select a new file to replace)</span>
                </p>
                <p v-if="formData.tax_details_file && isEditing" class="form-file-new">
                  New file selected: {{ formData.tax_details_file.name }}
                </p>
                <p v-if="!existingTaxDetails && !isEditing" class="form-file-none">
                  No file uploaded.
                </p>
              </div>
            </div>
          </div>

          <!-- === MODIFIED SECTION: "Details of IQA Focal Person" === -->
          <div class="form-section">
            <h2 class="section-heading">Details of IQA Focal Person</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-group">
                <label for="focal_person" class="form-label">Name</label>
                <input type="text" id="focal_person" v-model="formData.focal_person" :disabled="!isEditing" class="form-input" required>
              </div>
              <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input type="email" id="email" v-model="formData.email" :disabled="!isEditing" class="form-input" required>
              </div>
              <div class="form-group">
                <label for="telephone" class="form-label">Telephone/Phone Number</label>
                <input type="tel" id="telephone" v-model="formData.telephone" :disabled="!isEditing" class="form-input" required>
              </div>
            </div>
          </div>
          <!-- === END OF MODIFIED SECTION === -->

          <div class="form-section">
            <h2 class="section-heading">Head of Institute</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-group"><label for="head_name" class="form-label">Name</label><input type="text"
                  id="head_name" v-model="formData.head_name" :disabled="!isEditing" class="form-input" required></div>
              <div class="form-group"><label for="head_position" class="form-label">Designation</label><input type="text"
                  id="head_position" v-model="formData.head_position" :disabled="!isEditing" class="form-input" required>
              </div>
              <div class="form-group"><label for="head_email" class="form-label">Email</label><input type="email"
                  id="head_email" v-model="formData.head_email" :disabled="!isEditing" class="form-input" required></div>
              <div class="form-group"><label for="head_contact" class="form-label">Contact</label><input type="tel"
                  id="head_contact" v-model="formData.head_contact" :disabled="!isEditing" class="form-input" required
                  maxlength="15"></div>
            </div>
          </div>

          <div class="form-section">
            <h2 class="section-heading">Academic Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div class="form-group"><label for="departments" class="form-label">Number of Departments</label><input
                  type="number" id="departments" v-model="formData.departments" min="0" class="form-input"
                  :disabled="!isEditing"></div>
              <div class="form-group"><label for="programs_total" class="form-label">Total Number of Programmes</label><input
                  type="number" id="programs_total" v-model="formData.programs_total" min="0" class="form-input"
                  :disabled="!isEditing"></div>
            </div>
            <h3 class="subsection-heading">Programmes Breakdown</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div class="form-group"><label for="programs_ug" class="form-label">Undergraduate</label><input type="number"
                  id="programs_ug" v-model="formData.programs_ug" min="0" class="form-input" :disabled="!isEditing"></div>
              <div class="form-group"><label for="programs_pg" class="form-label">Postgraduate</label><input type="number"
                  id="programs_pg" v-model="formData.programs_pg" min="0" class="form-input" :disabled="!isEditing"></div>
              <div class="form-group"><label for="programs_doctoral" class="form-label">Doctoral</label><input type="number"
                  id="programs_doctoral" v-model="formData.programs_doctoral" min="0" class="form-input"
                  :disabled="!isEditing"></div>
              <div class="form-group"><label for="programs_other" class="form-label">Other</label><input type="number"
                  id="programs_other" v-model="formData.programs_other" min="0" class="form-input"
                  :disabled="!isEditing"></div>
            </div>
            <div class="form-group mb-8">
              <label for="new_programs" class="form-label">New Programmes Introduced (Last 5 Years)</label>
              <textarea id="new_programs" v-model="formData.new_programs" rows="3" class="form-input"
                placeholder="List new programmes with the year of commencement" :disabled="!isEditing"></textarea>
            </div>
            <div class="form-group mb-8">
              <label for="programs_with_electives" class="form-label">Number of Programmes with Electives</label>
              <input type="number" id="programs_with_electives" v-model="formData.programs_with_electives" min="0"
                class="form-input" :disabled="!isEditing">
              <div
                v-if="Number(formData.programs_with_electives) > 0 || (isEditing && Number(formData.programs_with_electives) > 0)"
                class="mt-4">
                <label for="electives_details" class="form-label">Electives Details</label>
                <textarea id="electives_details" v-model="formData.electives_details" rows="2" class="form-input"
                  placeholder="Specify electives"
                  :disabled="!isEditing || Number(formData.programs_with_electives) === 0"></textarea>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-group"><label for="working_days" class="form-label">Working Days (Last Academic Year)</label><input
                  type="number" id="working_days" v-model="formData.working_days" min="0" max="365" class="form-input"
                  :disabled="!isEditing"></div>
              <div class="form-group"><label for="teaching_days" class="form-label">Teaching Days (Last Academic Year)</label><input
                  type="number" id="teaching_days" v-model="formData.teaching_days" min="0" max="365" class="form-input"
                  :disabled="!isEditing"></div>
            </div>
          </div>

          <div class="form-section">
            <h2 class="section-heading">Faculty Information</h2>
            <h3 class="subsection-heading">By Gender</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div class="form-group"><label for="faculty_female" class="form-label">Female</label><input type="number"
                  id="faculty_female" v-model="formData.faculty_female" min="0" class="form-input"
                  :disabled="!isEditing"></div>
              <div class="form-group"><label for="faculty_male" class="form-label">Male</label><input type="number"
                  id="faculty_male" v-model="formData.faculty_male" min="0" class="form-input"
                  :disabled="!isEditing"></div>
              <div class="form-group"><label for="faculty_total" class="form-label">Total</label><input type="number"
                  id="faculty_total" v-model="facultyTotal" class="form-input-readonly" readonly></div>
            </div>
            <h3 class="subsection-heading">By Employment Type</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div class="form-group"><label for="regular_faculty_female" class="form-label">Regular (Female)</label><input
                  type="number" id="regular_faculty_female" v-model="formData.regular_faculty_female" min="0"
                  class="form-input" :disabled="!isEditing"></div>
              <div class="form-group"><label for="regular_faculty_male" class="form-label">Regular (Male)</label><input
                  type="number" id="regular_faculty_male" v-model="formData.regular_faculty_male" min="0"
                  class="form-input" :disabled="!isEditing"></div>
              <div class="form-group"><label for="regular_faculty_total" class="form-label">Regular Total</label><input
                  type="number" id="regular_faculty_total" v-model="regularFacultyTotal" class="form-input-readonly"
                  readonly></div>
              <div class="form-group"><label for="contract_faculty_female" class="form-label">Contract (Female)</label><input
                  type="number" id="contract_faculty_female" v-model="formData.contract_faculty_female" min="0"
                  class="form-input" :disabled="!isEditing"></div>
              <div class="form-group"><label for="contract_faculty_male" class="form-label">Contract (Male)</label><input
                  type="number" id="contract_faculty_male" v-model="formData.contract_faculty_male" min="0"
                  class="form-input" :disabled="!isEditing"></div>
              <div class="form-group"><label for="contract_faculty_total" class="form-label">Contract Total</label><input
                  type="number" id="contract_faculty_total" v-model="contractFacultyTotal" class="form-input-readonly"
                  readonly></div>
              <div class="form-group"><label for="visiting_faculty_female" class="form-label">Visiting/Adjunct(Female)</label><input
                  type="number" id="visiting_faculty_female" v-model="formData.visiting_faculty_female" min="0"
                  class="form-input" :disabled="!isEditing"></div>
              <div class="form-group"><label for="visiting_faculty_male" class="form-label">Visiting/Adjunct (Male)</label><input
                  type="number" id="visiting_faculty_male" v-model="formData.visiting_faculty_male" min="0"
                  class="form-input" :disabled="!isEditing"></div>
              <div class="form-group"><label for="visiting_faculty_total" class="form-label">Visiting/Adjunct Total</label><input
                  type="number" id="visiting_faculty_total" v-model="visitingFacultyTotal" class="form-input-readonly"
                  readonly></div>
            </div>
            <h3 class="subsection-heading">By Qualification</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="form-group"><label for="faculty_doctoral" class="form-label">Doctoral Degree</label><input
                  type="number" id="faculty_doctoral" v-model="formData.faculty_doctoral" min="0" class="form-input"
                  :disabled="!isEditing"></div>
              <div class="form-group"><label for="faculty_masters" class="form-label">Master's Degree</label><input
                  type="number" id="faculty_masters" v-model="formData.faculty_masters" min="0" class="form-input"
                  :disabled="!isEditing"></div>
              <div class="form-group"><label for="faculty_bachelors" class="form-label">Bachelor's Degree</label><input
                  type="number" id="faculty_bachelors" v-model="formData.faculty_bachelors" min="0" class="form-input"
                  :disabled="!isEditing"></div>
            </div>
          </div>

          <div class="form-section">
            <h2 class="section-heading">Non-Teaching Staff</h2>
            <h3 class="subsection-heading">Technical Staff</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div class="form-group"><label for="technical_staff_male" class="form-label">Male</label><input type="number"
                  id="technical_staff_male" v-model="formData.technical_staff_male" min="0" class="form-input"
                  :disabled="!isEditing"></div>
              <div class="form-group"><label for="technical_staff_female" class="form-label">Female</label><input
                  type="number" id="technical_staff_female" v-model="formData.technical_staff_female" min="0"
                  class="form-input" :disabled="!isEditing"></div>
              <div class="form-group"><label for="technical_staff_total" class="form-label">Total</label><input
                  type="number" id="technical_staff_total" v-model="technicalStaffTotal" class="form-input-readonly"
                  readonly></div>
            </div>
            <h3 class="subsection-heading">Administrative Staff</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div class="form-group"><label for="admin_staff_male" class="form-label">Male</label><input type="number"
                  id="admin_staff_male" v-model="formData.admin_staff_male" min="0" class="form-input"
                  :disabled="!isEditing"></div>
              <div class="form-group"><label for="admin_staff_female" class="form-label">Female</label><input
                  type="number" id="admin_staff_female" v-model="formData.admin_staff_female" min="0"
                  class="form-input" :disabled="!isEditing"></div>
              <div class="form-group"><label for="admin_staff_total" class="form-label">Total</label><input type="number"
                  id="admin_staff_total" v-model="adminStaffTotal" class="form-input-readonly" readonly></div>
            </div>
            <h3 class="subsection-heading">Support Staff</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="form-group"><label for="support_staff_male" class="form-label">Male</label><input type="number"
                  id="support_staff_male" v-model="formData.support_staff_male" min="0" class="form-input"
                  :disabled="!isEditing"></div>
              <div class="form-group"><label for="support_staff_female" class="form-label">Female</label><input
                  type="number" id="support_staff_female" v-model="formData.support_staff_female" min="0"
                  class="form-input" :disabled="!isEditing"></div>
              <div class="form-group"><label for="support_staff_total" class="form-label">Total</label><input
                  type="number" id="support_staff_total" v-model="supportStaffTotal" class="form-input-readonly"
                  readonly></div>
            </div>
            <div class="form-group mt-8">
              <label for="non_teaching_staff_total" class="form-label">Total Non-Teaching Staff</label>
              <input type="number" id="non_teaching_staff_total" v-model="nonTeachingStaffTotal"
                class="form-input-readonly" readonly>
            </div>
          </div>

          <div class="form-section">
            <h2 class="section-heading">Student Information</h2>
            <h3 class="subsection-heading">By Program Level</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div class="form-group"><label for="students_diploma_male" class="form-label">Diploma (Male)</label><input
                  type="number" id="students_diploma_male" v-model="formData.students_diploma_male" min="0"
                  class="form-input" :disabled="!isEditing"></div>
              <div class="form-group"><label for="students_diploma_female" class="form-label">Diploma (Female)</label><input
                  type="number" id="students_diploma_female" v-model="formData.students_diploma_female" min="0"
                  class="form-input" :disabled="!isEditing"></div>
              <div class="form-group"><label for="students_diploma_total" class="form-label">Diploma Total</label><input
                  type="number" id="students_diploma_total" v-model="studentsDiplomaTotal"
                  class="form-input-readonly" readonly></div>
              <div class="form-group"><label for="students_bachelors_male" class="form-label">Bachelors (Male)</label><input
                  type="number" id="students_bachelors_male" v-model="formData.students_bachelors_male" min="0"
                  class="form-input" :disabled="!isEditing"></div>
              <div class="form-group"><label for="students_bachelors_female" class="form-label">Bachelors (Female)</label><input
                  type="number" id="students_bachelors_female" v-model="formData.students_bachelors_female" min="0"
                  class="form-input" :disabled="!isEditing"></div>
              <div class="form-group"><label for="students_bachelors_total" class="form-label">Bachelors Total</label><input
                  type="number" id="students_bachelors_total" v-model="studentsBachelorsTotal"
                  class="form-input-readonly" readonly></div>
              <div class="form-group"><label for="students_masters_male" class="form-label">Masters (Male)</label><input
                  type="number" id="students_masters_male" v-model="formData.students_masters_male" min="0"
                  class="form-input" :disabled="!isEditing"></div>
              <div class="form-group"><label for="students_masters_female" class="form-label">Masters (Female)</label><input
                  type="number" id="students_masters_female" v-model="formData.students_masters_female" min="0"
                  class="form-input" :disabled="!isEditing"></div>
              <div class="form-group"><label for="students_masters_total" class="form-label">Masters Total</label><input
                  type="number" id="students_masters_total" v-model="studentsMastersTotal"
                  class="form-input-readonly" readonly></div>
              <div class="form-group"><label for="students_other_male" class="form-label">Other (Male)</label><input
                  type="number" id="students_other_male" v-model="formData.students_other_male" min="0"
                  class="form-input" :disabled="!isEditing"></div>
              <div class="form-group"><label for="students_other_female" class="form-label">Other (Female)</label><input
                  type="number" id="students_other_female" v-model="formData.students_other_female" min="0"
                  class="form-input" :disabled="!isEditing"></div>
              <div class="form-group"><label for="students_other_total" class="form-label">Other Total</label><input
                  type="number" id="students_other_total" v-model="studentsOtherTotal"
                  class="form-input-readonly" readonly></div>
            </div>
            <div class="form-group mt-8">
              <label for="students_total" class="form-label font-bold">Total Students</label>
              <input type="number" id="students_total" v-model="studentsTotal" class="form-input-readonly" readonly>
            </div>
          </div>

          <div v-if="isEditing" class="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-6">
            <button type="button" @click="resetForm"
              class="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
              Reset
            </button>
            <button type="submit"
              class="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              :disabled="submitting">
              <span v-if="submitting" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                Saving...
              </span>
              <span v-else>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Main Form Layouts */
.form-section {
  @apply border-b border-gray-200 pb-8 last:border-b-0;
}

.section-heading {
  @apply text-2xl font-semibold text-gray-800 mb-6;
}

.subsection-heading {
  @apply text-lg font-medium text-gray-700 mb-4;
}

/* Form Input Elements */
.form-group {
  @apply flex flex-col;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-input {
  @apply block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200;
}

.form-input-readonly {
  @apply form-input bg-gray-100 text-gray-500 cursor-not-allowed;
}

.form-input:disabled {
  @apply bg-gray-50 text-gray-500 cursor-not-allowed opacity-70;
}

textarea.form-input {
  @apply resize-none;
}

/* File Upload Specifics */
.form-file-input {
  @apply block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors duration-200;
}

.form-file-info {
  @apply mt-1 text-sm text-gray-500;
}

.form-file-new {
  @apply mt-1 text-sm text-green-600 font-medium;
}

.form-file-none {
  @apply mt-1 text-sm text-gray-400 italic;
}
</style>

<script setup>
import {
  ref,
  computed,
  onMounted
} from 'vue';
import {
  useToast
} from 'vue-toastification';
import apiService from '@/services/services';

const toast = useToast();

const loading = ref(true);
const submitting = ref(false);
const profileId = ref(null);

const isEditing = ref(false);

const instituteTypes = ref([]);
const fundingSources = ref([]);

const existingLandRegistration = ref(null);
const existingTaxDetails = ref(null);

const getFileName = (filePathOrUrl) => {
  if (!filePathOrUrl || typeof filePathOrUrl !== 'string') return 'file';
  try {
    const decodedPath = decodeURIComponent(filePathOrUrl);
    return decodedPath.split('/').pop().split('?')[0] || 'file';
  } catch (e) {
    console.error('Failed to decode file path:', e);
    return filePathOrUrl.split('/').pop().split('?')[0] || 'file';
  }
};


const formData = ref({
  name: '',
  type: '',
  year_established: null,
  website: '',
  address: '',
  dzongkhag: '',
  affiliated_to: '',
  source_of_funding: '',
  total_area: null,
  land_registration_file: null,
  tax_details_file: null,
  telephone: '',
  email: '',
  focal_person: '',
  head_name: '',
  head_position: '',
  head_email: '',
  head_contact: '',
  departments: 0,
  programs_total: 0,
  programs_ug: 0,
  programs_pg: 0,
  programs_doctoral: 0,
  programs_other: 0,
  programs_with_electives: 0,
  electives_details: '',
  new_programs: '',
  working_days: 0,
  teaching_days: 0,
  faculty_female: 0,
  faculty_male: 0,
  regular_faculty_female: 0,
  regular_faculty_male: 0,
  contract_faculty_female: 0,
  contract_faculty_male: 0,
  visiting_faculty_female: 0,
  visiting_faculty_male: 0,
  faculty_doctoral: 0,
  faculty_masters: 0,
  faculty_bachelors: 0,
  technical_staff_male: 0,
  technical_staff_female: 0,
  admin_staff_male: 0,
  admin_staff_female: 0,
  support_staff_male: 0,
  support_staff_female: 0,
  students_diploma_male: 0,
  students_diploma_female: 0,
  students_bachelors_male: 0,
  students_bachelors_female: 0,
  students_masters_male: 0,
  students_masters_female: 0,
  students_other_male: 0,
  students_other_female: 0,
});

// Storing an initial clean state is good practice for reset/create logic
const initialFormData = JSON.parse(JSON.stringify(formData.value));

// Computed properties for totals (unchanged)
const facultyTotal = computed(() => Number(formData.value.faculty_female || 0) + Number(formData.value.faculty_male || 0));
const regularFacultyTotal = computed(() => Number(formData.value.regular_faculty_female || 0) + Number(formData.value.regular_faculty_male || 0));
const contractFacultyTotal = computed(() => Number(formData.value.contract_faculty_female || 0) + Number(formData.value.contract_faculty_male || 0));
const visitingFacultyTotal = computed(() => Number(formData.value.visiting_faculty_female || 0) + Number(formData.value.visiting_faculty_male || 0));
const technicalStaffTotal = computed(() => Number(formData.value.technical_staff_female || 0) + Number(formData.value.technical_staff_male || 0));
const adminStaffTotal = computed(() => Number(formData.value.admin_staff_female || 0) + Number(formData.value.admin_staff_male || 0));
const supportStaffTotal = computed(() => Number(formData.value.support_staff_female || 0) + Number(formData.value.support_staff_male || 0));
const nonTeachingStaffTotal = computed(() => technicalStaffTotal.value + adminStaffTotal.value + supportStaffTotal.value);
const studentsDiplomaTotal = computed(() => Number(formData.value.students_diploma_female || 0) + Number(formData.value.students_diploma_male || 0));
const studentsBachelorsTotal = computed(() => Number(formData.value.students_bachelors_female || 0) + Number(formData.value.students_bachelors_male || 0));
const studentsMastersTotal = computed(() => Number(formData.value.students_masters_female || 0) + Number(formData.value.students_masters_male || 0));
const studentsOtherTotal = computed(() => Number(formData.value.students_other_female || 0) + Number(formData.value.students_other_male || 0));
const studentsTotal = computed(() => studentsDiplomaTotal.value + studentsBachelorsTotal.value + studentsMastersTotal.value + studentsOtherTotal.value);


const loadInstituteTypes = async () => {
  try {
    const response = await apiService.getMastersInstituteTypes();
    instituteTypes.value = (response.data.results || response.data || []).map(item => ({
      id: item.id,
      name: item.name
    }));
  } catch (error) {
    console.error('Error loading institute types:', error);
    // Provide a more specific error message based on the status code
    if (error.response && error.response.status === 403) {
      toast.error('Permission denied: You do not have access to load institute types.');
    } else {
      toast.error('Failed to load institute types. Please try again.');
    }
    instituteTypes.value = [];
  }
};

const loadFundingSources = async () => {
  try {
    const response = await apiService.getMastersSourceOfFundings();
    fundingSources.value = (response.data.results || response.data || []).map(item => ({
      id: item.id,
      name: item.name
    }));
  } catch (error) {
    console.error('Error loading funding sources:', error);
    toast.error('Failed to load funding sources.');
    fundingSources.value = [];
  }
};

const handleFileUpload = (field, event) => {
  const file = event.target.files[0];
  if (file) {
    // Corrected syntax for object property access
    formData.value[field + '_file'] = file;
  } else {
    formData.value[field + '_file'] = null;
  }
};

const resetForm = async () => {
  if (confirm('Are you sure you want to reset changes? This will revert to the last saved state or clear the form if creating a new profile.')) {
    loading.value = true;
    await loadProfile(); // This will reset to the last saved state or a blank state if new.
  }
};

const handleEditClick = () => {
  isEditing.value = true;
};

// ========================================================================
// === MODIFIED FUNCTION: loadProfile (This is the core of the fix) =====
// ========================================================================
const loadProfile = async () => {
  try {
    loading.value = true;
    const response = await apiService.getMyInstituteProfile();

    // SUCCESS CASE: Profile exists and was returned successfully
    if (response && response.data && Object.keys(response.data).length > 0 && response.data.id) {
      profileId.value = response.data.id;
      // Populate form data from response
      Object.keys(formData.value).forEach(key => {
        if (Object.prototype.hasOwnProperty.call(response.data, key)) {
          if (key.endsWith('_file')) {
            formData.value[key] = null; // Clear stale File object
          } else if (typeof formData.value[key] === 'number' && (response.data[key] === null || response.data[key] === undefined)) {
            formData.value[key] = 0;
          } else if (typeof formData.value[key] === 'number' && typeof response.data[key] === 'string') {
            formData.value[key] = Number(response.data[key]) || 0;
          } else if (response.data[key] === null && typeof formData.value[key] === 'string') {
            formData.value[key] = '';
          } else {
            formData.value[key] = response.data[key];
          }
        } else if (key.endsWith('_file')) {
          formData.value[key] = null;
        }
      });
      existingLandRegistration.value = response.data.land_registration || null;
      existingTaxDetails.value = response.data.tax_details || null;
      // Profile exists, so start in VIEW mode.
      isEditing.value = false;
    } else {
      // UNEXPECTED SUCCESS: API returned 200 OK but with no data. Treat as "create new".
      Object.assign(formData.value, JSON.parse(JSON.stringify(initialFormData)));
      profileId.value = null;
      existingLandRegistration.value = null;
      existingTaxDetails.value = null;
      // No profile, so start in EDIT (create) mode.
      isEditing.value = true;
    }
  } catch (error) {
    // This now robustly checks for the "No Profile" state, either by a 404 status
    // or by the specific payload the API sends.
    const isCreateProfileError = error.response && (
      error.response.status === 404 ||
      error.response.data?.action_required === 'create_or_update_profile'
    );

    if (isCreateProfileError) {

      Object.assign(formData.value, JSON.parse(JSON.stringify(initialFormData)));
      profileId.value = null;
      existingLandRegistration.value = null;
      existingTaxDetails.value = null;

      isEditing.value = true;
    } else {

      toast.error('An unexpected error occurred while loading the institute profile.');
      console.error('Error loading profile:', error);
      isEditing.value = false;
    }
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  try {
    submitting.value = true;
    const dataToSubmit = new FormData();

    Object.keys(formData.value).forEach(key => {
      if (key.endsWith('_file')) {
        if (formData.value[key] instanceof File) {
          dataToSubmit.append(key.replace('_file', ''), formData.value[key]);
        }
      } else if (formData.value[key] !== null && formData.value[key] !== undefined) {
        dataToSubmit.append(key, formData.value[key]);
      }
    });

    if (profileId.value) {
      await apiService.updateInstituteProfile(profileId.value, dataToSubmit);
      toast.success('Institute profile updated successfully!');
    } else {
      await apiService.createInstituteProfile(dataToSubmit);
      toast.success('Institute profile created successfully!');
    }
    // After a successful save (create or update), reload the profile.
    // This will fetch the latest data and set isEditing to false.
    await loadProfile();

  } catch (error) {
    let errorMessage = 'Failed to save institute profile.';
    if (error.response && error.response.data) {
      if (typeof error.response.data === 'object' && error.response.data !== null) {
        const messages = [];
        for (const field in error.response.data) {
          if (Array.isArray(error.response.data[field])) {
            messages.push(`Validation error for ${field.replace(/_/g, ' ')}: ${error.response.data[field].join(', ')}`);
          } else {
            messages.push(`Validation error for ${field.replace(/_/g, ' ')}: ${error.response.data[field]}`);
          }
        }
        errorMessage = messages.join(' | ') || 'Error saving profile.';
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    toast.error(errorMessage, {
      timeout: 7000
    });
    console.error('Error saving profile:', error.response?.data || error);
  } finally {
    submitting.value = false;
  }
};

onMounted(async () => {
  loading.value = true;
  await Promise.all([
    loadInstituteTypes(),
    loadFundingSources()
  ]);
  // This will now correctly set the isEditing state based on whether a profile exists.
  await loadProfile();
});
</script>