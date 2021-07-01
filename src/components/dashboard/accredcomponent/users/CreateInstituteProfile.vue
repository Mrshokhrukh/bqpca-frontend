<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Institute Profile</h1>
        <div v-if="!isEditing && profileId && !loading">
          <button type="button" @click="handleEditClick"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Edit Profile
          </button>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <!-- This message will now display correctly when no profile is found -->
      <div v-else-if="!profileId && isEditing && !loading" class="mb-4 p-4 bg-blue-50 text-blue-700 rounded-md">
        No institute profile found. Please fill in the details below to create one.
      </div>

      <form v-if="!loading" @submit.prevent="submitForm" class="space-y-6">
        <!-- Basic Information Section -->
        <div class="border-b border-gray-200 pb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Institute Name</label>
              <input type="text" id="name" v-model="formData.name"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                :disabled="!isEditing" required>
            </div>

            <div>
              <label for="type" class="block text-sm font-medium text-gray-700">Institute Type</label>
              <select id="type" v-model="formData.type"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                :disabled="!isEditing" required>
                <option value="">Select type</option>
                <option v-for="typeObj in instituteTypes" :key="typeObj.id" :value="typeObj.id">{{ typeObj.name }}
                </option>
              </select>
            </div>

            <div>
              <label for="year_established" class="block text-sm font-medium text-gray-700">Year Established</label>
              <input type="number" id="year_established" v-model="formData.year_established" min="1900"
                :max="new Date().getFullYear()"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                :disabled="!isEditing" required>
            </div>

            <div>
              <label for="website" class="block text-sm font-medium text-gray-700">Website</label>
              <input type="url" id="website" v-model="formData.website"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="https://example.com" :disabled="!isEditing">
            </div>

            <div class="md:col-span-2">
              <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
              <textarea id="address" v-model="formData.address" rows="2"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                :disabled="!isEditing" required></textarea>
            </div>

            <div>
              <label for="dzongkhag" class="block text-sm font-medium text-gray-700">Dzongkhag/Thromde</label>
              <input type="text" id="dzongkhag" v-model="formData.dzongkhag"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                :disabled="!isEditing" required>
            </div>

            <div>
              <label for="affiliated_to" class="block text-sm font-medium text-gray-700">Affiliated To</label>
              <input type="text" id="affiliated_to" v-model="formData.affiliated_to"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                :disabled="!isEditing">
            </div>

            <div>
              <label for="source_of_funding" class="block text-sm font-medium text-gray-700">Source of Funding</label>
              <select id="source_of_funding" v-model="formData.source_of_funding"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                :disabled="!isEditing">
                <option value="">Select funding source</option>
                <option v-for="sourceObj in fundingSources" :key="sourceObj.id" :value="sourceObj.id">{{ sourceObj.name
                }}</option>
              </select>
            </div>

            <div>
              <label for="total_area" class="block text-sm font-medium text-gray-700">Total Area (acres)</label>
              <input type="number" id="total_area" v-model="formData.total_area" min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                :disabled="!isEditing">
            </div>

            <div>
              <label for="land_registration" class="block text-sm font-medium text-gray-700">Land Registration
                Certificate</label>
              <input v-if="isEditing" type="file" id="land_registration"
                @change="handleFileUpload('land_registration', $event)"
                class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
              <p v-if="existingLandRegistration && (!isEditing || (isEditing && !formData.land_registration_file))"
                class="mt-1 text-sm text-gray-500">
                Current file: <a :href="existingLandRegistration" target="_blank" rel="noopener noreferrer"
                  class="text-blue-600 hover:underline">{{ getFileName(existingLandRegistration) }}</a>
                <span v-if="isEditing && !formData.land_registration_file" class="ml-2 text-xs text-gray-400">(select a
                  new file to replace)</span>
              </p>
              <p v-if="formData.land_registration_file && isEditing" class="mt-1 text-sm text-green-600">
                New file selected: {{ formData.land_registration_file.name }}
              </p>
              <p v-if="!existingLandRegistration && !isEditing" class="mt-1 text-sm text-gray-400">
                No file uploaded.
              </p>
            </div>

            <div>
              <label for="tax_details" class="block text-sm font-medium text-gray-700">Latest Tax Details</label>
              <input v-if="isEditing" type="file" id="tax_details" @change="handleFileUpload('tax_details', $event)"
                class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
              <p v-if="existingTaxDetails && (!isEditing || (isEditing && !formData.tax_details_file))"
                class="mt-1 text-sm text-gray-500">
                Current file: <a :href="existingTaxDetails" target="_blank" rel="noopener noreferrer"
                  class="text-blue-600 hover:underline">{{ getFileName(existingTaxDetails) }}</a>
                <span v-if="isEditing && !formData.tax_details_file" class="ml-2 text-xs text-gray-400">(select a new
                  file to replace)</span>
              </p>
              <p v-if="formData.tax_details_file && isEditing" class="mt-1 text-sm text-green-600">
                New file selected: {{ formData.tax_details_file.name }}
              </p>
              <p v-if="!existingTaxDetails && !isEditing" class="mt-1 text-sm text-gray-400">
                No file uploaded.
              </p>
            </div>
          </div>
        </div>

        <!-- Contact Information Section -->
        <div class="border-b border-gray-200 pb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="telephone" class="block text-sm font-medium text-gray-700">Telephone</label>
              <input type="tel" id="telephone" v-model="formData.telephone"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                :disabled="!isEditing" required>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" v-model="formData.email"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                :disabled="!isEditing" required>
            </div>

            <div>
              <label for="focal_person" class="block text-sm font-medium text-gray-700">Focal Person for IQA</label>
              <input type="text" id="focal_person" v-model="formData.focal_person"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                :disabled="!isEditing" required>
            </div>

            <div>
              <label for="focal_person_contact" class="block text-sm font-medium text-gray-700">Focal Person
                Contact</label>
              <input type="tel" id="focal_person_contact" v-model="formData.focal_person_contact"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                :disabled="!isEditing" required maxlength="15">
            </div>
          </div>
        </div>

        <!-- Head of Institute Section -->
        <div class="border-b border-gray-200 pb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Head of Institute</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="head_name" class="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" id="head_name" v-model="formData.head_name"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                :disabled="!isEditing" required>
            </div>

            <div>
              <label for="head_position" class="block text-sm font-medium text-gray-700">Position</label>
              <input type="text" id="head_position" v-model="formData.head_position"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                :disabled="!isEditing" required>
            </div>

            <div>
              <label for="head_email" class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="head_email" v-model="formData.head_email"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                :disabled="!isEditing" required>
            </div>

            <div>
              <label for="head_contact" class="block text-sm font-medium text-gray-700">Contact</label>
              <input type="tel" id="head_contact" v-model="formData.head_contact"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                :disabled="!isEditing" required maxlength="15">
            </div>
          </div>
        </div>

        <!-- Academic Information Section -->
        <div class="border-b border-gray-200 pb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Academic Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label for="departments" class="block text-sm font-medium text-gray-700">Number of Departments</label>
              <input type="number" id="departments" v-model="formData.departments" min="0" class="input-field"
                :disabled="!isEditing">
            </div>
            <div>
              <label for="programs_total" class="block text-sm font-medium text-gray-700">Total Number of
                Programs</label>
              <input type="number" id="programs_total" v-model="formData.programs_total" min="0" class="input-field"
                :disabled="!isEditing">
            </div>
          </div>
          <h3 class="text-md font-medium text-gray-700 mb-3">Program Breakdown</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label for="programs_ug">Undergraduate</label>
              <input type="number" id="programs_ug" v-model="formData.programs_ug" min="0" class="input-field"
                :disabled="!isEditing">
            </div>
            <div>
              <label for="programs_pg">Postgraduate</label>
              <input type="number" id="programs_pg" v-model="formData.programs_pg" min="0" class="input-field"
                :disabled="!isEditing">
            </div>
            <div>
              <label for="programs_doctoral">Doctoral</label>
              <input type="number" id="programs_doctoral" v-model="formData.programs_doctoral" min="0"
                class="input-field" :disabled="!isEditing">
            </div>
            <div>
              <label for="programs_other">Other</label>
              <input type="number" id="programs_other" v-model="formData.programs_other" min="0" class="input-field"
                :disabled="!isEditing">
            </div>
          </div>
          <div class="mb-6">
            <label for="new_programs">New Programs Introduced (Last 5 Years)</label>
            <textarea id="new_programs" v-model="formData.new_programs" rows="3" class="input-field"
              placeholder="List new programs with introduction years" :disabled="!isEditing"></textarea>
          </div>
          <div class="mb-6">
            <label for="programs_with_electives">Number of Programs with Electives</label>
            <input type="number" id="programs_with_electives" v-model="formData.programs_with_electives" min="0"
              class="input-field" :disabled="!isEditing">
            <div
              v-if="Number(formData.programs_with_electives) > 0 || (isEditing && Number(formData.programs_with_electives) > 0)"
              class="mt-2">
              <label for="electives_details">Electives Details</label>
              <textarea id="electives_details" v-model="formData.electives_details" rows="2" class="input-field"
                placeholder="Specify electives"
                :disabled="!isEditing || Number(formData.programs_with_electives) === 0"></textarea>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="working_days">Working Days (Last Academic Year)</label>
              <input type="number" id="working_days" v-model="formData.working_days" min="0" max="365"
                class="input-field" :disabled="!isEditing">
            </div>
            <div>
              <label for="teaching_days">Teaching Days (Last Academic Year)</label>
              <input type="number" id="teaching_days" v-model="formData.teaching_days" min="0" max="365"
                class="input-field" :disabled="!isEditing">
            </div>
          </div>
        </div>

        <!-- Faculty Information Section -->
        <div class="border-b border-gray-200 pb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Faculty Information</h2>
          <h3 class="text-md font-medium text-gray-700 mb-3">Faculty by Gender</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div><label for="faculty_female">Female</label><input type="number" id="faculty_female"
                v-model="formData.faculty_female" min="0" class="input-field" :disabled="!isEditing"></div>
            <div><label for="faculty_male">Male</label><input type="number" id="faculty_male"
                v-model="formData.faculty_male" min="0" class="input-field" :disabled="!isEditing"></div>
            <div><label for="faculty_total">Total</label><input type="number" id="faculty_total" v-model="facultyTotal"
                class="input-field-readonly" readonly></div>
          </div>
          <h3 class="text-md font-medium text-gray-700 mb-3">Faculty by Employment Type</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div><label for="regular_faculty_female">Regular (Female)</label><input type="number"
                id="regular_faculty_female" v-model="formData.regular_faculty_female" min="0" class="input-field"
                :disabled="!isEditing"></div>
            <div><label for="regular_faculty_male">Regular (Male)</label><input type="number" id="regular_faculty_male"
                v-model="formData.regular_faculty_male" min="0" class="input-field" :disabled="!isEditing"></div>
            <div><label for="regular_faculty_total">Regular Total</label><input type="number" id="regular_faculty_total"
                v-model="regularFacultyTotal" class="input-field-readonly" readonly></div>
            <div><label for="contract_faculty_female">Contract (Female)</label><input type="number"
                id="contract_faculty_female" v-model="formData.contract_faculty_female" min="0" class="input-field"
                :disabled="!isEditing"></div>
            <div><label for="contract_faculty_male">Contract (Male)</label><input type="number"
                id="contract_faculty_male" v-model="formData.contract_faculty_male" min="0" class="input-field"
                :disabled="!isEditing"></div>
            <div><label for="contract_faculty_total">Contract Total</label><input type="number"
                id="contract_faculty_total" v-model="contractFacultyTotal" class="input-field-readonly" readonly></div>
            <div><label for="visiting_faculty_female">Visiting (Female)</label><input type="number"
                id="visiting_faculty_female" v-model="formData.visiting_faculty_female" min="0" class="input-field"
                :disabled="!isEditing"></div>
            <div><label for="visiting_faculty_male">Visiting (Male)</label><input type="number"
                id="visiting_faculty_male" v-model="formData.visiting_faculty_male" min="0" class="input-field"
                :disabled="!isEditing"></div>
            <div><label for="visiting_faculty_total">Visiting Total</label><input type="number"
                id="visiting_faculty_total" v-model="visitingFacultyTotal" class="input-field-readonly" readonly></div>
          </div>
          <h3 class="text-md font-medium text-gray-700 mb-3">Faculty by Qualification</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><label for="faculty_doctoral">Doctoral Degree</label><input type="number" id="faculty_doctoral"
                v-model="formData.faculty_doctoral" min="0" class="input-field" :disabled="!isEditing"></div>
            <div><label for="faculty_masters">Masters Degree</label><input type="number" id="faculty_masters"
                v-model="formData.faculty_masters" min="0" class="input-field" :disabled="!isEditing"></div>
            <div><label for="faculty_bachelors">Bachelors Degree</label><input type="number" id="faculty_bachelors"
                v-model="formData.faculty_bachelors" min="0" class="input-field" :disabled="!isEditing"></div>
          </div>
        </div>

        <!-- Non-Teaching Staff Section -->
        <div class="border-b border-gray-200 pb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Non-Teaching Staff</h2>
          <h3 class="text-md font-medium text-gray-700 mb-3">Technical Staff</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div><label for="technical_staff_male">Male</label><input type="number" id="technical_staff_male"
                v-model="formData.technical_staff_male" min="0" class="input-field" :disabled="!isEditing"></div>
            <div><label for="technical_staff_female">Female</label><input type="number" id="technical_staff_female"
                v-model="formData.technical_staff_female" min="0" class="input-field" :disabled="!isEditing"></div>
            <div><label for="technical_staff_total">Total</label><input type="number" id="technical_staff_total"
                v-model="technicalStaffTotal" class="input-field-readonly" readonly></div>
          </div>
          <h3 class="text-md font-medium text-gray-700 mb-3">Administrative Staff</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div><label for="admin_staff_male">Male</label><input type="number" id="admin_staff_male"
                v-model="formData.admin_staff_male" min="0" class="input-field" :disabled="!isEditing"></div>
            <div><label for="admin_staff_female">Female</label><input type="number" id="admin_staff_female"
                v-model="formData.admin_staff_female" min="0" class="input-field" :disabled="!isEditing"></div>
            <div><label for="admin_staff_total">Total</label><input type="number" id="admin_staff_total"
                v-model="adminStaffTotal" class="input-field-readonly" readonly></div>
          </div>
          <h3 class="text-md font-medium text-gray-700 mb-3">Support Staff</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><label for="support_staff_male">Male</label><input type="number" id="support_staff_male"
                v-model="formData.support_staff_male" min="0" class="input-field" :disabled="!isEditing"></div>
            <div><label for="support_staff_female">Female</label><input type="number" id="support_staff_female"
                v-model="formData.support_staff_female" min="0" class="input-field" :disabled="!isEditing"></div>
            <div><label for="support_staff_total">Total</label><input type="number" id="support_staff_total"
                v-model="supportStaffTotal" class="input-field-readonly" readonly></div>
          </div>
          <div class="mt-6">
            <label for="non_teaching_staff_total">Total Non-Teaching Staff</label>
            <input type="number" id="non_teaching_staff_total" v-model="nonTeachingStaffTotal"
              class="input-field-readonly" readonly>
          </div>
        </div>

        <!-- Student Information Section -->
        <div class="pb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Student Information</h2>
          <h3 class="text-md font-medium text-gray-700 mb-3">Students by Program Level</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div><label for="students_diploma_male">Diploma (Male)</label><input type="number"
                id="students_diploma_male" v-model="formData.students_diploma_male" min="0" class="input-field"
                :disabled="!isEditing"></div>
            <div><label for="students_diploma_female">Diploma (Female)</label><input type="number"
                id="students_diploma_female" v-model="formData.students_diploma_female" min="0" class="input-field"
                :disabled="!isEditing"></div>
            <div><label for="students_diploma_total">Diploma Total</label><input type="number"
                id="students_diploma_total" v-model="studentsDiplomaTotal" class="input-field-readonly" readonly></div>
            <div><label for="students_bachelors_male">Bachelors (Male)</label><input type="number"
                id="students_bachelors_male" v-model="formData.students_bachelors_male" min="0" class="input-field"
                :disabled="!isEditing"></div>
            <div><label for="students_bachelors_female">Bachelors (Female)</label><input type="number"
                id="students_bachelors_female" v-model="formData.students_bachelors_female" min="0" class="input-field"
                :disabled="!isEditing"></div>
            <div><label for="students_bachelors_total">Bachelors Total</label><input type="number"
                id="students_bachelors_total" v-model="studentsBachelorsTotal" class="input-field-readonly" readonly>
            </div>
            <div><label for="students_masters_male">Masters (Male)</label><input type="number"
                id="students_masters_male" v-model="formData.students_masters_male" min="0" class="input-field"
                :disabled="!isEditing"></div>
            <div><label for="students_masters_female">Masters (Female)</label><input type="number"
                id="students_masters_female" v-model="formData.students_masters_female" min="0" class="input-field"
                :disabled="!isEditing"></div>
            <div><label for="students_masters_total">Masters Total</label><input type="number"
                id="students_masters_total" v-model="studentsMastersTotal" class="input-field-readonly" readonly></div>
            <div><label for="students_other_male">Other (Male)</label><input type="number" id="students_other_male"
                v-model="formData.students_other_male" min="0" class="input-field" :disabled="!isEditing"></div>
            <div><label for="students_other_female">Other (Female)</label><input type="number"
                id="students_other_female" v-model="formData.students_other_female" min="0" class="input-field"
                :disabled="!isEditing"></div>
            <div><label for="students_other_total">Other Total</label><input type="number" id="students_other_total"
                v-model="studentsOtherTotal" class="input-field-readonly" readonly></div>
          </div>
          <div class="mt-6">
            <label for="students_total">Total Students</label>
            <input type="number" id="students_total" v-model="studentsTotal" class="input-field-readonly" readonly>
          </div>
        </div>

        <!-- Form Actions -->
        <div v-if="isEditing" class="flex justify-end space-x-4 pt-4 border-t border-gray-200">
          <button type="button" @click="resetForm"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Reset
          </button>
          <button type="submit"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :disabled="submitting">
            <span v-if="submitting" class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
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
</template>

<style scoped>
.input-field {
  @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm;
}

.input-field:disabled {
  /* Tailwind applies styles for :disabled automatically, but you can override */
  @apply bg-gray-100 cursor-not-allowed text-gray-500;
}

.input-field-readonly {
  /* For computed total fields */
  @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-100 text-gray-700;
}

label {
  /* Added to ensure all labels have consistent styling from the abbreviated sections */
  @apply block text-sm font-medium text-gray-700;
}

textarea.input-field:disabled {
  @apply bg-gray-100 cursor-not-allowed text-gray-500;
}

select.input-field:disabled {
  @apply bg-gray-100 cursor-not-allowed text-gray-500;
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
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
  name: '', type: '', year_established: null, website: '', address: '', dzongkhag: '',
  affiliated_to: '', source_of_funding: '', total_area: null,
  land_registration_file: null, tax_details_file: null,
  telephone: '', email: '', focal_person: '', focal_person_contact: '',
  head_name: '', head_position: '', head_email: '', head_contact: '',
  departments: 0, programs_total: 0, programs_ug: 0, programs_pg: 0,
  programs_doctoral: 0, programs_other: 0, programs_with_electives: 0,
  electives_details: '', new_programs: '', working_days: 0, teaching_days: 0,
  faculty_female: 0, faculty_male: 0, regular_faculty_female: 0, regular_faculty_male: 0,
  contract_faculty_female: 0, contract_faculty_male: 0, visiting_faculty_female: 0,
  visiting_faculty_male: 0, faculty_doctoral: 0, faculty_masters: 0, faculty_bachelors: 0,
  technical_staff_male: 0, technical_staff_female: 0, admin_staff_male: 0,
  admin_staff_female: 0, support_staff_male: 0, support_staff_female: 0,
  students_diploma_male: 0, students_diploma_female: 0, students_bachelors_male: 0,
  students_bachelors_female: 0, students_masters_male: 0, students_masters_female: 0,
  students_other_male: 0, students_other_female: 0,
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
      id: item.id, name: item.name
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
      id: item.id, name: item.name
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
    formData.value[`${field}_file`] = file;
  } else {
    formData.value[`${field}_file`] = null;
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
    toast.error(errorMessage, { timeout: 7000 });
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
