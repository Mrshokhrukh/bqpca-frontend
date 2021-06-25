<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Institute Profile</h1>

      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <form v-else @submit.prevent="submitForm" class="space-y-6">
        <!-- Basic Information Section -->
        <div class="border-b border-gray-200 pb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Institute Name</label>
              <input
                type="text"
                id="name"
                v-model="formData.name"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
            </div>

            <div>
              <label for="type" class="block text-sm font-medium text-gray-700">Institute Type</label>
              <select
                id="type"
                v-model="formData.type"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
                <option value="">Select type</option>
                <option v-for="type in instituteTypes" :key="type" :value="type">{{ type }}</option>
              </select>
            </div>

            <div>
              <label for="year_established" class="block text-sm font-medium text-gray-700">Year Established</label>
              <input
                type="number"
                id="year_established"
                v-model="formData.year_established"
                min="1900"
                :max="new Date().getFullYear()"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
            </div>

            <div>
              <label for="website" class="block text-sm font-medium text-gray-700">Website</label>
              <input
                type="url"
                id="website"
                v-model="formData.website"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="https://example.com"
              >
            </div>

            <div class="md:col-span-2">
              <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                id="address"
                v-model="formData.address"
                rows="2"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              ></textarea>
            </div>

            <div>
              <label for="dzongkhag" class="block text-sm font-medium text-gray-700">Dzongkhag/Thromde</label>
              <input
                type="text"
                id="dzongkhag"
                v-model="formData.dzongkhag"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
            </div>

            <div>
              <label for="affiliated_to" class="block text-sm font-medium text-gray-700">Affiliated To</label>
              <input
                type="text"
                id="affiliated_to"
                v-model="formData.affiliated_to"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="source_of_funding" class="block text-sm font-medium text-gray-700">Source of Funding</label>
              <select
                id="source_of_funding"
                v-model="formData.source_of_funding"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Select funding source</option>
                <option v-for="source in fundingSources" :key="source" :value="source">{{ source }}</option>
              </select>
            </div>

            <div>
              <label for="total_area" class="block text-sm font-medium text-gray-700">Total Area (acres)</label>
              <input
                type="number"
                id="total_area"
                v-model="formData.total_area"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="land_registration" class="block text-sm font-medium text-gray-700">Land Registration Certificate</label>
              <input
                type="file"
                id="land_registration"
                @change="handleFileUpload('land_registration', $event)"
                class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              >
              <p v-if="formData.land_registration_file" class="mt-1 text-sm text-gray-500">
                Current file: {{ formData.land_registration_file.name }}
              </p>
            </div>

            <div>
              <label for="tax_details" class="block text-sm font-medium text-gray-700">Latest Tax Details</label>
              <input
                type="file"
                id="tax_details"
                @change="handleFileUpload('tax_details', $event)"
                class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              >
              <p v-if="formData.tax_details_file" class="mt-1 text-sm text-gray-500">
                Current file: {{ formData.tax_details_file.name }}
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
              <input
                type="tel"
                id="telephone"
                v-model="formData.telephone"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                v-model="formData.email"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
            </div>

            <div>
              <label for="focal_person" class="block text-sm font-medium text-gray-700">Focal Person for IQA</label>
              <input
                type="text"
                id="focal_person"
                v-model="formData.focal_person"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
            </div>

            <div>
              <label for="focal_person_contact" class="block text-sm font-medium text-gray-700">Focal Person Contact</label>
              <input
                type="tel"
                id="focal_person_contact"
                v-model="formData.focal_person_contact"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
            </div>
          </div>
        </div>

        <!-- Head of Institute Section -->
        <div class="border-b border-gray-200 pb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Head of Institute</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="head_name" class="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="head_name"
                v-model="formData.head_name"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
            </div>

            <div>
              <label for="head_position" class="block text-sm font-medium text-gray-700">Position</label>
              <input
                type="text"
                id="head_position"
                v-model="formData.head_position"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
            </div>

            <div>
              <label for="head_email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="head_email"
                v-model="formData.head_email"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
            </div>

            <div>
              <label for="head_contact" class="block text-sm font-medium text-gray-700">Contact</label>
              <input
                type="tel"
                id="head_contact"
                v-model="formData.head_contact"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              >
            </div>
          </div>
        </div>

        <!-- Academic Information Section -->
        <div class="border-b border-gray-200 pb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Academic Information</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label for="departments" class="block text-sm font-medium text-gray-700">Number of Departments</label>
              <input
                type="number"
                id="departments"
                v-model="formData.departments"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="programs_total" class="block text-sm font-medium text-gray-700">Total Number of Programs</label>
              <input
                type="number"
                id="programs_total"
                v-model="formData.programs_total"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>
          </div>

          <h3 class="text-md font-medium text-gray-700 mb-3">Program Breakdown</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label for="programs_ug" class="block text-sm font-medium text-gray-700">Undergraduate</label>
              <input
                type="number"
                id="programs_ug"
                v-model="formData.programs_ug"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="programs_pg" class="block text-sm font-medium text-gray-700">Postgraduate</label>
              <input
                type="number"
                id="programs_pg"
                v-model="formData.programs_pg"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="programs_doctoral" class="block text-sm font-medium text-gray-700">Doctoral</label>
              <input
                type="number"
                id="programs_doctoral"
                v-model="formData.programs_doctoral"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="programs_other" class="block text-sm font-medium text-gray-700">Other</label>
              <input
                type="number"
                id="programs_other"
                v-model="formData.programs_other"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>
          </div>

          <div class="mb-6">
            <label for="new_programs" class="block text-sm font-medium text-gray-700">New Programs Introduced (Last 5 Years)</label>
            <textarea
              id="new_programs"
              v-model="formData.new_programs"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="List new programs with introduction years"
            ></textarea>
          </div>

          <div class="mb-6">
            <label for="programs_with_electives" class="block text-sm font-medium text-gray-700">Number of Programs with Electives</label>
            <input
              type="number"
              id="programs_with_electives"
              v-model="formData.programs_with_electives"
              min="0"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
            <div v-if="formData.programs_with_electives > 0" class="mt-2">
              <label for="electives_details" class="block text-sm font-medium text-gray-700">Electives Details</label>
              <textarea
                id="electives_details"
                v-model="formData.electives_details"
                rows="2"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Specify electives"
              ></textarea>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="working_days" class="block text-sm font-medium text-gray-700">Working Days (Last Academic Year)</label>
              <input
                type="number"
                id="working_days"
                v-model="formData.working_days"
                min="0" max="365"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="teaching_days" class="block text-sm font-medium text-gray-700">Teaching Days (Last Academic Year)</label>
              <input
                type="number"
                id="teaching_days"
                v-model="formData.teaching_days"
                min="0" max="365"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>
          </div>
        </div>

        <!-- Faculty Information Section -->
        <div class="border-b border-gray-200 pb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Faculty Information</h2>

          <h3 class="text-md font-medium text-gray-700 mb-3">Faculty by Gender</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <label for="faculty_female" class="block text-sm font-medium text-gray-700">Female</label>
              <input
                type="number"
                id="faculty_female"
                v-model="formData.faculty_female"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="faculty_male" class="block text-sm font-medium text-gray-700">Male</label>
              <input
                type="number"
                id="faculty_male"
                v-model="formData.faculty_male"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="faculty_total" class="block text-sm font-medium text-gray-700">Total</label>
              <input
                type="number"
                id="faculty_total"
                v-model="facultyTotal"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-100"
                readonly
              >
            </div>
          </div>

          <h3 class="text-md font-medium text-gray-700 mb-3">Faculty by Employment Type</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <label for="regular_faculty_female" class="block text-sm font-medium text-gray-700">Regular (Female)</label>
              <input
                type="number"
                id="regular_faculty_female"
                v-model="formData.regular_faculty_female"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="regular_faculty_male" class="block text-sm font-medium text-gray-700">Regular (Male)</label>
              <input
                type="number"
                id="regular_faculty_male"
                v-model="formData.regular_faculty_male"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="regular_faculty_total" class="block text-sm font-medium text-gray-700">Regular Total</label>
              <input
                type="number"
                id="regular_faculty_total"
                v-model="regularFacultyTotal"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-100"
                readonly
              >
            </div>

            <div>
              <label for="contract_faculty_female" class="block text-sm font-medium text-gray-700">Contract (Female)</label>
              <input
                type="number"
                id="contract_faculty_female"
                v-model="formData.contract_faculty_female"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="contract_faculty_male" class="block text-sm font-medium text-gray-700">Contract (Male)</label>
              <input
                type="number"
                id="contract_faculty_male"
                v-model="formData.contract_faculty_male"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="contract_faculty_total" class="block text-sm font-medium text-gray-700">Contract Total</label>
              <input
                type="number"
                id="contract_faculty_total"
                v-model="contractFacultyTotal"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-100"
                readonly
              >
            </div>

            <div>
              <label for="visiting_faculty_female" class="block text-sm font-medium text-gray-700">Visiting (Female)</label>
              <input
                type="number"
                id="visiting_faculty_female"
                v-model="formData.visiting_faculty_female"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="visiting_faculty_male" class="block text-sm font-medium text-gray-700">Visiting (Male)</label>
              <input
                type="number"
                id="visiting_faculty_male"
                v-model="formData.visiting_faculty_male"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="visiting_faculty_total" class="block text-sm font-medium text-gray-700">Visiting Total</label>
              <input
                type="number"
                id="visiting_faculty_total"
                v-model="visitingFacultyTotal"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-100"
                readonly
              >
            </div>
          </div>

          <h3 class="text-md font-medium text-gray-700 mb-3">Faculty by Qualification</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label for="faculty_doctoral" class="block text-sm font-medium text-gray-700">Doctoral Degree</label>
              <input
                type="number"
                id="faculty_doctoral"
                v-model="formData.faculty_doctoral"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="faculty_masters" class="block text-sm font-medium text-gray-700">Masters Degree</label>
              <input
                type="number"
                id="faculty_masters"
                v-model="formData.faculty_masters"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="faculty_bachelors" class="block text-sm font-medium text-gray-700">Bachelors Degree</label>
              <input
                type="number"
                id="faculty_bachelors"
                v-model="formData.faculty_bachelors"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>
          </div>
        </div>

        <!-- Non-Teaching Staff Section -->
        <div class="border-b border-gray-200 pb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Non-Teaching Staff</h2>

          <h3 class="text-md font-medium text-gray-700 mb-3">Technical Staff</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label for="technical_staff_male" class="block text-sm font-medium text-gray-700">Male</label>
              <input
                type="number"
                id="technical_staff_male"
                v-model="formData.technical_staff_male"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="technical_staff_female" class="block text-sm font-medium text-gray-700">Female</label>
              <input
                type="number"
                id="technical_staff_female"
                v-model="formData.technical_staff_female"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="technical_staff_total" class="block text-sm font-medium text-gray-700">Total</label>
              <input
                type="number"
                id="technical_staff_total"
                v-model="technicalStaffTotal"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-100"
                readonly
              >
            </div>
          </div>

          <h3 class="text-md font-medium text-gray-700 mb-3">Administrative Staff</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label for="admin_staff_male" class="block text-sm font-medium text-gray-700">Male</label>
              <input
                type="number"
                id="admin_staff_male"
                v-model="formData.admin_staff_male"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="admin_staff_female" class="block text-sm font-medium text-gray-700">Female</label>
              <input
                type="number"
                id="admin_staff_female"
                v-model="formData.admin_staff_female"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="admin_staff_total" class="block text-sm font-medium text-gray-700">Total</label>
              <input
                type="number"
                id="admin_staff_total"
                v-model="adminStaffTotal"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-100"
                readonly
              >
            </div>
          </div>

          <h3 class="text-md font-medium text-gray-700 mb-3">Support Staff</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label for="support_staff_male" class="block text-sm font-medium text-gray-700">Male</label>
              <input
                type="number"
                id="support_staff_male"
                v-model="formData.support_staff_male"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="support_staff_female" class="block text-sm font-medium text-gray-700">Female</label>
              <input
                type="number"
                id="support_staff_female"
                v-model="formData.support_staff_female"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="support_staff_total" class="block text-sm font-medium text-gray-700">Total</label>
              <input
                type="number"
                id="support_staff_total"
                v-model="supportStaffTotal"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-100"
                readonly
              >
            </div>
          </div>

          <div class="mt-6">
            <label for="non_teaching_staff_total" class="block text-sm font-medium text-gray-700">Total Non-Teaching Staff</label>
            <input
              type="number"
              id="non_teaching_staff_total"
              v-model="nonTeachingStaffTotal"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-100"
              readonly
            >
          </div>
        </div>

        <!-- Student Information Section -->
        <div class="pb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Student Information</h2>

          <h3 class="text-md font-medium text-gray-700 mb-3">Students by Program Level</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label for="students_diploma_male" class="block text-sm font-medium text-gray-700">Diploma (Male)</label>
              <input
                type="number"
                id="students_diploma_male"
                v-model="formData.students_diploma_male"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="students_diploma_female" class="block text-sm font-medium text-gray-700">Diploma (Female)</label>
              <input
                type="number"
                id="students_diploma_female"
                v-model="formData.students_diploma_female"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="students_diploma_total" class="block text-sm font-medium text-gray-700">Diploma Total</label>
              <input
                type="number"
                id="students_diploma_total"
                v-model="studentsDiplomaTotal"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-100"
                readonly
              >
            </div>

            <div>
              <label for="students_bachelors_male" class="block text-sm font-medium text-gray-700">Bachelors (Male)</label>
              <input
                type="number"
                id="students_bachelors_male"
                v-model="formData.students_bachelors_male"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="students_bachelors_female" class="block text-sm font-medium text-gray-700">Bachelors (Female)</label>
              <input
                type="number"
                id="students_bachelors_female"
                v-model="formData.students_bachelors_female"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="students_bachelors_total" class="block text-sm font-medium text-gray-700">Bachelors Total</label>
              <input
                type="number"
                id="students_bachelors_total"
                v-model="studentsBachelorsTotal"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-100"
                readonly
              >
            </div>

            <div>
              <label for="students_masters_male" class="block text-sm font-medium text-gray-700">Masters (Male)</label>
              <input
                type="number"
                id="students_masters_male"
                v-model="formData.students_masters_male"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="students_masters_female" class="block text-sm font-medium text-gray-700">Masters (Female)</label>
              <input
                type="number"
                id="students_masters_female"
                v-model="formData.students_masters_female"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="students_masters_total" class="block text-sm font-medium text-gray-700">Masters Total</label>
              <input
                type="number"
                id="students_masters_total"
                v-model="studentsMastersTotal"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-100"
                readonly
              >
            </div>

            <div>
              <label for="students_other_male" class="block text-sm font-medium text-gray-700">Other (Male)</label>
              <input
                type="number"
                id="students_other_male"
                v-model="formData.students_other_male"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="students_other_female" class="block text-sm font-medium text-gray-700">Other (Female)</label>
              <input
                type="number"
                id="students_other_female"
                v-model="formData.students_other_female"
                min="0"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
            </div>

            <div>
              <label for="students_other_total" class="block text-sm font-medium text-gray-700">Other Total</label>
              <input
                type="number"
                id="students_other_total"
                v-model="studentsOtherTotal"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-100"
                readonly
              >
            </div>
          </div>

          <div class="mt-6">
            <label for="students_total" class="block text-sm font-medium text-gray-700">Total Students</label>
            <input
              type="number"
              id="students_total"
              v-model="studentsTotal"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-gray-100"
              readonly
            >
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="resetForm"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reset
          </button>
          <button
            type="submit"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :disabled="submitting"
          >
            <span v-if="submitting" class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import apiService from '@/services/services'; // Ensure this path is correct

const toast = useToast();

const loading = ref(true);
const submitting = ref(false);
const profileId = ref(null);

// Sample data for dropdowns
const instituteTypes = ref([
  'Public University',
  'Private University',
  'College',
  'Institute',
  'Other'
]);

const fundingSources = ref([
  'Government',
  'Private',
  'Donor',
  'Mixed',
  'Other'
]);

// Form data structure
const formData = ref({
  // Basic Information
  name: '',
  type: '',
  year_established: '', // Will be parsed as number by input type="number"
  website: '',
  address: '',
  dzongkhag: '',
  affiliated_to: '',
  source_of_funding: '',
  total_area: '', // Will be parsed as number
  land_registration_file: null,
  tax_details_file: null,

  // Contact Information
  telephone: '',
  email: '',
  focal_person: '',
  focal_person_contact: '',

  // Head of Institute
  head_name: '',
  head_position: '',
  head_email: '',
  head_contact: '',

  // Academic Information
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

  // Faculty Information
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

  // Non-Teaching Staff
  technical_staff_male: 0,
  technical_staff_female: 0,
  admin_staff_male: 0,
  admin_staff_female: 0,
  support_staff_male: 0,
  support_staff_female: 0,

  // Student Information
  students_diploma_male: 0,
  students_diploma_female: 0,
  students_bachelors_male: 0,
  students_bachelors_female: 0,
  students_masters_male: 0,
  students_masters_female: 0,
  students_other_male: 0,
  students_other_female: 0,
});

// Computed properties for totals
const facultyTotal = computed(() => {
  return Number(formData.value.faculty_female) + Number(formData.value.faculty_male);
});

const regularFacultyTotal = computed(() => {
  return Number(formData.value.regular_faculty_female) + Number(formData.value.regular_faculty_male);
});

const contractFacultyTotal = computed(() => {
  return Number(formData.value.contract_faculty_female) + Number(formData.value.contract_faculty_male);
});

const visitingFacultyTotal = computed(() => {
  return Number(formData.value.visiting_faculty_female) + Number(formData.value.visiting_faculty_male);
});

const technicalStaffTotal = computed(() => {
  return Number(formData.value.technical_staff_female) + Number(formData.value.technical_staff_male);
});

const adminStaffTotal = computed(() => {
  return Number(formData.value.admin_staff_female) + Number(formData.value.admin_staff_male);
});

const supportStaffTotal = computed(() => {
  return Number(formData.value.support_staff_female) + Number(formData.value.support_staff_male);
});

const nonTeachingStaffTotal = computed(() => {
  return technicalStaffTotal.value + adminStaffTotal.value + supportStaffTotal.value;
});

const studentsDiplomaTotal = computed(() => {
  return Number(formData.value.students_diploma_female) + Number(formData.value.students_diploma_male);
});

const studentsBachelorsTotal = computed(() => {
  return Number(formData.value.students_bachelors_female) + Number(formData.value.students_bachelors_male);
});

const studentsMastersTotal = computed(() => {
  return Number(formData.value.students_masters_female) + Number(formData.value.students_masters_male);
});

const studentsOtherTotal = computed(() => {
  return Number(formData.value.students_other_female) + Number(formData.value.students_other_male);
});

const studentsTotal = computed(() => {
  return studentsDiplomaTotal.value + studentsBachelorsTotal.value + studentsMastersTotal.value + studentsOtherTotal.value;
});

// Methods
const handleFileUpload = (field, event) => {
  const file = event.target.files[0];
  if (file) {
    formData.value[`${field}_file`] = file;
  }
};

const resetForm = () => {
  if (confirm('Are you sure you want to reset all changes to the last saved state?')) {
    loadProfile(); // Reloads data from the server
  }
};

const loadProfile = async () => {
  try {
    loading.value = true;
    const response = await apiService.getMyInstituteProfile(); // Ensure this API endpoint exists and returns data in the expected format

    if (response && response.data) {
      profileId.value = response.data.id;
      // Map the API response to our form data structure
      // Ensure all fields from response.data exist in formData and types match, or handle conversions
      Object.keys(formData.value).forEach(key => {
        if (Object.prototype.hasOwnProperty.call(response.data, key)) {
            if (key.endsWith('_file')) {
                // For file fields, we might get a URL or path from backend.
                // Here, we're assuming the API might return a filename or path for display purposes,
                // but the actual File object is only handled on new uploads.
                // If the backend returns a URL to the file, you might want to store it differently,
                // e.g., in a separate ref or by modifying formData structure to hold both path and new file object.
                // For simplicity, we'll just assign it if backend provides, though this might not be a File object.
                // A common pattern is to show a link to the existing file and only update if a new file is chosen.
                // formData.value[key] = response.data[key]; // This line might need adjustment based on API response for files
            } else if (typeof formData.value[key] === 'number' && typeof response.data[key] === 'string') {
                 formData.value[key] = Number(response.data[key]) || 0;
            } else if (typeof formData.value[key] === 'number' && response.data[key] === null) {
                formData.value[key] = 0; // Or handle as appropriate
            }
             else {
                 formData.value[key] = response.data[key] === null && typeof formData.value[key] === 'string' ? '' : response.data[key];
            }
        }
      });


    } else {
      // Handle case where no profile exists yet, or API returns empty/null
      // Reset formData to initial state or default values if needed
      Object.keys(formData.value).forEach(key => {
        if (key.endsWith('_file')) {
          formData.value[key] = null;
        } else if (typeof formData.value[key] === 'number') {
          formData.value[key] = 0;
        } else {
          formData.value[key] = '';
        }
      });
      profileId.value = null; // No existing profile
    }
  } catch (error) {
    toast.error('Failed to load institute profile.');
    console.error('Error loading profile:', error);
    // Optionally, reset form or show specific error state
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
        if (formData.value[key] instanceof File) { // Only append if it's a new File object
          dataToSubmit.append(key.replace('_file', ''), formData.value[key]);
        }
      } else if (formData.value[key] !== null && formData.value[key] !== undefined) {
        // Ensure numbers are sent as numbers if required by backend, FormData converts to string.
        // If backend expects specific types, you might need to JSON.stringify parts of data or use a different content type.
        // For 'multipart/form-data', values are typically strings or Files.
        dataToSubmit.append(key, formData.value[key]);
      }
    });

    // Add computed totals if your backend expects them explicitly
    // dataToSubmit.append('faculty_total', facultyTotal.value);
    // ... and so on for other totals, if needed. Usually, backend calculates these.

    if (profileId.value) {
      await apiService.updateInstituteProfile(profileId.value, dataToSubmit);
      toast.success('Institute profile updated successfully!');
    } else {
      const response = await apiService.createInstituteProfile(dataToSubmit);
      toast.success('Institute profile created successfully!');
      if (response && response.data && response.data.id) {
        profileId.value = response.data.id; // Store new ID
      }
      // Optionally reload profile to ensure form data reflects server state, including any server-generated fields
      // await loadProfile();
    }
    // After successful submission, you might want to reload the profile to get the latest data including file URLs etc.
    await loadProfile();

  } catch (error) {
    let errorMessage = 'Failed to save institute profile.';
    if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
    } else if (error.message) {
        errorMessage = error.message;
    }
    toast.error(errorMessage);
    console.error('Error saving profile:', error.response?.data || error);
  } finally {
    submitting.value = false;
  }
};

// Load profile when component mounts
onMounted(() => {
  loadProfile();
});

// No return statement is needed with <script setup>
// All top-level bindings are automatically exposed to the template
</script>