<!-- Template modifications -->
<template>
  <div>
    <!-- CID Holder or Non-CID Holder Selection -->
    <CIDSelection v-model="isCIDHolder" />

    <PaymentModal
      ref="paymentModal"
      :amount="1000"
      @payment-completed="onPaymentCompleted"
      @close="onPaymentModalClose"
    />

    <form v-if="isCIDHolder !== null" @submit.prevent="handleSubmit" class="space-y-6 mt-6">
      <!-- Personal Information Section - CID Holders -->
      <div v-if="isCIDHolder" class="bg-white border p-6 rounded-lg shadow-sm">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>

        <!-- Caution Message -->
        <div
          class="bg-yellow-100 border-l-4 border-yellow-500 rounded text-yellow-700 p-4 mb-4"
          role="alert"
        >
          <p class="font-bold">Caution for CID Holders</p>
          <p>
            You are applying for your own certification using your CID.
            <b>Do not use information of other people.</b> Applying with other people's information
            will
            <b>overwrite your personal details in this system, and you will lose access.</b>
            Please ensure all information is your own.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- CID No. -->
          <div class="relative">
            <label for="cid" class="block text-sm font-medium text-gray-700">CID No.</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                id="cid"
                v-model="form.cid_no"
                @input="handleCIDInput"
                maxlength="11"
                :class="[
                  'block w-full pr-24 rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                  {
                    'border-red-300 focus:border-red-500 focus:ring-red-500':
                      validation.errors.cid_no,
                  },
                ]"
                placeholder="Enter 11-digit CID"
              />
            </div>
            <p v-if="validation.errors.cid_no" class="mt-1 text-sm text-red-500">
              {{ validation.errors.cid_no }}
            </p>
          </div>

          <!-- Full Name -->
          <div>
            <label for="full_name" class="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="full_name"
              v-model="form.applicants_name"
              readonly
              class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            />
          </div>

          <!-- Date of Birth -->
          <div>
            <label for="date_of_birth" class="block text-sm font-medium text-gray-700"
              >Date of Birth</label
            >
            <input
              type="date"
              id="date_of_birth"
              v-model="form.date_of_birth"
              readonly
              class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            />
          </div>

          <!-- Contact Number -->
          <div>
            <label for="contact_number" class="block text-sm font-medium text-gray-700 required"
              >Contact Number</label
            >
            <input
              type="tel"
              id="contact_number"
              v-model="form.contact_no"
              pattern="[0-9]{8}"
              required
              @input="validateField('contact_no')"
              :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.contact_no,
                },
              ]"
            />
            <p v-if="validation.errors.contact_no" class="mt-1 text-sm text-red-500">
              {{ validation.errors.contact_no }}
            </p>
            <p v-else class="mt-1 text-sm text-gray-500">Must be 8 digits</p>
          </div>

          <!-- Email Address -->
          <div>
            <label for="email_address" class="block text-sm font-medium text-gray-700"
              >Email Address</label
            >
            <input
              type="email"
              id="email_address"
              v-model="form.email_address"
              :readonly="!!form.email_address"
              @input="validateField('email_address')"
              :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                { 'bg-gray-50': !!form.email_address },
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.email_address,
                },
              ]"
            />
            <p v-if="validation.errors.email_address" class="mt-1 text-sm text-red-500">
              {{ validation.errors.email_address }}
            </p>
          </div>

          <!-- Gender -->
          <div>
            <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
            <input
              type="text"
              id="gender"
              :value="genderDisplay"
              readonly
              class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            />
            <input type="hidden" v-model="form.gender" />
          </div>

          <!-- Dzongkhag -->
          <div>
            <label for="dzongkhag" class="block text-sm font-medium text-gray-700">Dzongkhag</label>
            <input
              type="text"
              id="dzongkhag"
              v-model="form.dzongkhag"
              readonly
              class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            />
          </div>

          <!-- Gewog -->
          <div>
            <label for="gewog" class="block text-sm font-medium text-gray-700">Gewog</label>
            <input
              type="text"
              id="gewog"
              v-model="form.gewog"
              readonly
              class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            />
          </div>

          <!-- Village -->
          <div>
            <label for="village" class="block text-sm font-medium text-gray-700">Village</label>
            <input
              type="text"
              id="village"
              v-model="form.village"
              readonly
              class="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            />
          </div>
        </div>
      </div>

      <!-- Personal Information Section - Non-CID Holders -->
      <div v-else class="bg-white border p-6 rounded-lg shadow-sm">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Full Name -->
          <div>
            <label for="full_name_non_cid" class="block text-sm font-medium text-gray-700 required"
              >Full Name</label
            >
            <input
              type="text"
              id="full_name_non_cid"
              v-model="form.applicants_name"
              required
              @input="validateField('applicants_name')"
              :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.applicants_name,
                },
              ]"
            />
            <p v-if="validation.errors.applicants_name" class="mt-1 text-sm text-red-500">
              {{ validation.errors.applicants_name }}
            </p>
          </div>

          <!-- Date of Birth -->
          <div>
            <label
              for="date_of_birth_non_cid"
              class="block text-sm font-medium text-gray-700 required"
              >Date of Birth</label
            >
            <input
              type="date"
              id="date_of_birth_non_cid"
              v-model="form.date_of_birth"
              required
              @input="validateField('date_of_birth')"
              :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.date_of_birth,
                },
              ]"
            />
            <p v-if="validation.errors.date_of_birth" class="mt-1 text-sm text-red-500">
              {{ validation.errors.date_of_birth }}
            </p>
          </div>

          <!-- Contact Number -->
          <div>
            <label
              for="contact_number_non_cid"
              class="block text-sm font-medium text-gray-700 required"
              >Contact Number</label
            >
            <input
              type="tel"
              id="contact_number_non_cid"
              v-model="form.contact_no"
              pattern="[0-9]{8}"
              required
              @input="validateField('contact_no')"
              :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.contact_no,
                },
              ]"
            />
            <p v-if="validation.errors.contact_no" class="mt-1 text-sm text-red-500">
              {{ validation.errors.contact_no }}
            </p>
            <p v-else class="mt-1 text-sm text-gray-500">Must be 8 digits</p>
          </div>

          <!-- Email Address -->
          <div>
            <label for="email_address_non_cid" class="block text-sm font-medium text-gray-700"
              >Email Address</label
            >
            <input
              type="email"
              id="email_address_non_cid"
              v-model="form.email_address"
              :readonly="!!form.email_address"
              @input="validateField('email_address')"
              :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                { 'bg-gray-50': !!form.email_address },
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.email_address,
                },
              ]"
            />
            <p v-if="validation.errors.email_address" class="mt-1 text-sm text-red-500">
              {{ validation.errors.email_address }}
            </p>
          </div>

          <!-- Gender -->
          <div>
            <label for="gender_non_cid" class="block text-sm font-medium text-gray-700 required"
              >Gender</label
            >
            <select
              id="gender_non_cid"
              v-model="form.gender"
              required
              @change="validateField('gender')"
              :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.gender,
                },
              ]"
            >
              <option value="" disabled>Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
            <p v-if="validation.errors.gender" class="mt-1 text-sm text-red-500">
              {{ validation.errors.gender }}
            </p>
          </div>

          <!-- Dzongkhag -->
          <div>
            <label for="dzongkhag_non_cid" class="block text-sm font-medium text-gray-700 required"
              >Dzongkhag</label
            >
            <input
              type="text"
              id="dzongkhag_non_cid"
              v-model="form.dzongkhag"
              required
              @input="validateField('dzongkhag')"
              :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.dzongkhag,
                },
              ]"
            />
            <p v-if="validation.errors.dzongkhag" class="mt-1 text-sm text-red-500">
              {{ validation.errors.dzongkhag }}
            </p>
          </div>

          <!-- Gewog -->
          <div>
            <label for="gewog_non_cid" class="block text-sm font-medium text-gray-700 required"
              >Gewog</label
            >
            <input
              type="text"
              id="gewog_non_cid"
              v-model="form.gewog"
              required
              @input="validateField('gewog')"
              :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500': validation.errors.gewog,
                },
              ]"
            />
            <p v-if="validation.errors.gewog" class="mt-1 text-sm text-red-500">
              {{ validation.errors.gewog }}
            </p>
          </div>

          <!-- Village -->
          <div>
            <label for="village_non_cid" class="block text-sm font-medium text-gray-700 required"
              >Village</label
            >
            <input
              type="text"
              id="village_non_cid"
              v-model="form.village"
              required
              @input="validateField('village')"
              :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.village,
                },
              ]"
            />
            <p v-if="validation.errors.village" class="mt-1 text-sm text-red-500">
              {{ validation.errors.village }}
            </p>
          </div>
        </div>
      </div>

      <EducationTypeSelection v-model="form.from_in_country" />
      <!-- Education Details Section -->
      <div class="bg-white border p-6 rounded-lg shadow-sm">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Education Details</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <!-- Student ID No. -->
          <div class="relative">
            <label for="student_id_no" class="block text-sm font-medium text-gray-700 required"
              >Student ID No.</label
            >
            <div class="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                id="student_id_no"
                v-model="form.student_id_no"
                required
                @input="validateField('student_id_no')"
                :class="[
                  'block w-full pr-24 rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                  {
                    'border-red-300 focus:border-red-500 focus:ring-red-500':
                      validation.errors.student_id_no,
                  },
                ]"
              />
              <button
                v-if="form.from_in_country"
                type="button"
                @click="fetchRUBData"
                :disabled="isLoadingRUB || !form.student_id_no"
                class="absolute inset-y-0 right-0 flex items-center px-3 rounded-r-md border-l bg-gray-50 hover:bg-gray-100 focus:outline-none"
              >
                <span
                  class="text-sm text-gray-600"
                  :class="{ 'opacity-50': isLoadingRUB || !form.student_id_no }"
                >
                  {{ isLoadingRUB ? 'Fetching...' : 'Fetch RUB' }}
                </span>
              </button>
            </div>
            <p v-if="validation.errors.student_id_no" class="mt-1 text-sm text-red-500">
              {{ validation.errors.student_id_no }}
            </p>
          </div>

          <!-- Course Title -->
          <div>
            <label for="course_title" class="block text-sm font-medium text-gray-700 required"
              >Course Title</label
            >
            <input
              type="text"
              id="course_title"
              v-model="form.course_title"
              required
              :readonly="form.from_in_country"
              @input="validateField('course_title')"
              :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                { 'bg-gray-50': form.from_in_country },
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.course_title,
                },
              ]"
            />
            <p v-if="validation.errors.course_title" class="mt-1 text-sm text-red-500">
              {{ validation.errors.course_title }}
            </p>
          </div>

          <!-- Qualification -->
          <div>
            <label for="qualification" class="block text-sm font-medium text-gray-700 required"
              >Qualification</label
            >
            <select
              id="qualification"
              v-model="form.qualification"
              required
              @change="validateField('qualification')"
              :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.qualification,
                },
              ]"
            >
              <option value="" disabled>Select Qualification</option>
              <option v-for="qual in qualificationOptions" :key="qual.value" :value="qual.value">
                {{ qual.label }}
              </option>
            </select>
            <p v-if="validation.errors.qualification" class="mt-1 text-sm text-red-500">
              {{ validation.errors.qualification }}
            </p>
          </div>

          <!-- Type of Course -->
          <div>
            <label for="type_of_course" class="block text-sm font-medium text-gray-700 required"
              >Type of Course</label
            >
            <select
              id="type_of_course"
              v-model="form.type_of_course"
              required
              @change="validateField('type_of_course')"
              :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.type_of_course,
                },
              ]"
            >
              <option value="" disabled>Select Course Type</option>
              <option v-for="type in courseTypeOptions" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
            <p v-if="validation.errors.type_of_course" class="mt-1 text-sm text-red-500">
              {{ validation.errors.type_of_course }}
            </p>
          </div>

          <!-- Duration of Course -->
          <div>
            <label for="duration_of_course" class="block text-sm font-medium text-gray-700 required"
              >Duration of Course (Years)</label
            >
            <input
              type="number"
              id="duration_of_course"
              v-model="form.duration_of_course"
              min="1"
              max="10"
              required
              @input="validateField('duration_of_course')"
              :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.duration_of_course,
                },
              ]"
            />
            <p v-if="validation.errors.duration_of_course" class="mt-1 text-sm text-red-500">
              {{ validation.errors.duration_of_course }}
            </p>
          </div>

          <!-- Name of Institute -->
          <div>
            <label for="name_of_institute" class="block text-sm font-medium text-gray-700 required"
              >Name of Institute</label
            >
            <input
              type="text"
              id="name_of_institute"
              v-model="form.name_of_institute"
              required
              :readonly="form.from_in_country"
              @input="validateField('name_of_institute')"
              :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                { 'bg-gray-50': form.from_in_country },
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.name_of_institute,
                },
              ]"
            />
            <p v-if="validation.errors.name_of_institute" class="mt-1 text-sm text-red-500">
              {{ validation.errors.name_of_institute }}
            </p>
          </div>

          <!-- Name of University -->
          <div>
            <label for="name_of_university" class="block text-sm font-medium text-gray-700 required"
              >Name of University</label
            >
            <input
              type="text"
              id="name_of_university"
              v-model="form.name_of_university"
              required
              :readonly="form.from_in_country"
              @input="validateField('name_of_university')"
              :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                { 'bg-gray-50': form.from_in_country },
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.name_of_university,
                },
              ]"
            />
            <p v-if="validation.errors.name_of_university" class="mt-1 text-sm text-red-500">
              {{ validation.errors.name_of_university }}
            </p>
          </div>

          <!-- Year of Completion -->
          <div>
            <label for="year_of_completion" class="block text-sm font-medium text-gray-700 required"
              >Year of Completion</label
            >
            <input
              type="number"
              id="year_of_completion"
              v-model="form.year_of_completion"
              :min="minYear"
              :max="currentYear"
              required
              :readonly="form.from_in_country"
              @input="validateField('year_of_completion')"
              :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                { 'bg-gray-50': form.from_in_country },
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.year_of_completion,
                },
              ]"
            />
            <p v-if="validation.errors.year_of_completion" class="mt-1 text-sm text-red-500">
              {{ validation.errors.year_of_completion }}
            </p>
          </div>

          <!-- Website -->
          <div>
            <label for="website" class="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="url"
              id="website"
              v-model="form.website"
              placeholder="https://"
              pattern="https?://.+"
              @input="validateField('website')"
              :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.website,
                },
              ]"
            />
            <p v-if="validation.errors.website" class="mt-1 text-sm text-red-500">
              {{ validation.errors.website }}
            </p>
          </div>

          <!-- Location -->
          <div>
            <label for="location" class="block text-sm font-medium text-gray-700 required"
              >Location</label
            >
            <input
              type="text"
              id="location"
              v-model="form.location"
              required
              @input="validateField('location')"
              :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.location,
                },
              ]"
            />
            <p v-if="validation.errors.location" class="mt-1 text-sm text-red-500">
              {{ validation.errors.location }}
            </p>
          </div>

          <!-- Country -->
          <div>
            <label for="country" class="block text-sm font-medium text-gray-700 required"
              >Country</label
            >
            <input
              type="text"
              id="country"
              v-model="form.country"
              required
              :readonly="form.from_in_country"
              @input="validateField('country')"
              :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                { 'bg-gray-50': form.from_in_country },
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.country,
                },
              ]"
            />
            <p v-if="validation.errors.country" class="mt-1 text-sm text-red-500">
              {{ validation.errors.country }}
            </p>
          </div>
        </div>
      </div>

      <!-- Supporting Documents Section -->
      <div class="bg-white border p-6 rounded-lg shadow-sm">
        <h3 class="text-xl font-semibold mb-4 text-gray-900">Supporting Documents</h3>

        <div class="space-y-6">
          <!-- Degree Certificate -->
          <div v-if="!form.from_in_country">
            <label class="block text-sm font-medium text-gray-700 required"
              >Degree Certificate</label
            >
            <div class="mt-2">
              <FileUpload
                v-model="form.degree_certificate"
                accept=".pdf"
                :max-size="5"
                :initial-file-name="
                  initialData?.degree_certificate
                    ? getFileNameFromUrl(initialData.degree_certificate)
                    : ''
                "
                required
                @change="validateField('degree_certificate')"
              />
              <p v-if="validation.errors.degree_certificate" class="mt-1 text-sm text-red-500">
                {{ validation.errors.degree_certificate }}
              </p>
              <p v-else class="mt-1 text-sm text-gray-500">PDF only, max 5MB</p>
            </div>
          </div>

          <!-- Academic Transcript -->
          <div v-if="!form.from_in_country">
            <label class="block text-sm font-medium text-gray-700 required"
              >Academic Transcript</label
            >
            <div class="mt-2">
              <FileUpload
                v-model="form.academic_transcript"
                accept=".pdf"
                :max-size="5"
                :initial-file-name="
                  initialData?.academic_transcript
                    ? getFileNameFromUrl(initialData.academic_transcript)
                    : ''
                "
                required
                @change="validateField('academic_transcript')"
              />
              <p v-if="validation.errors.academic_transcript" class="mt-1 text-sm text-red-500">
                {{ validation.errors.academic_transcript }}
              </p>
              <p v-else class="mt-1 text-sm text-gray-500">PDF only, max 5MB</p>
            </div>
          </div>

          <!-- Passport Size Photo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 required"
              >Passport Size Photo</label
            >
            <div class="mt-2">
              <FileUpload
                v-model="form.passport_size_photo"
                accept=".jpg,.jpeg,.png,.webp"
                :max-size="2"
                :initial-file-name="
                  initialData?.passport_size_photo
                    ? getFileNameFromUrl(initialData.passport_size_photo)
                    : ''
                "
                required
                @change="validateField('passport_size_photo')"
              />
              <p v-if="validation.errors.passport_size_photo" class="mt-1 text-sm text-red-500">
                {{ validation.errors.passport_size_photo }}
              </p>
              <p v-else class="mt-1 text-sm text-gray-500">
                JPEG/PNG/WEBP only, max 2MB, passport format
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Remarks and Declaration Section -->
      <div class="bg-white border p-6 rounded-lg shadow-sm space-y-6">
        <!-- Remarks -->
        <div>
          <label for="remarks" class="block text-sm font-medium text-gray-700">Remarks</label>
          <textarea
            id="remarks"
            v-model="form.remarks"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
          ></textarea>
        </div>

        <!-- Declaration -->
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              type="checkbox"
              id="declaration"
              v-model="form.declaration"
              required
              @change="validateField('declaration')"
              :class="[
                'w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary',
                { 'border-red-300 focus:ring-red-500': validation.errors.declaration },
              ]"
            />
          </div>
          <div class="ml-3 text-sm">
            <label for="declaration" class="font-medium text-gray-700">Declaration</label>
            <p class="text-gray-500">
              I declare that all the information provided is true and accurate to the best of my
              knowledge.
            </p>
            <p v-if="validation.errors.declaration" class="text-sm text-red-500">
              {{ validation.errors.declaration }}
            </p>
          </div>
        </div>
      </div>

      <!-- Validation Summary -->
      <div
        v-if="validation.showSummary && Object.keys(validation.errors).length > 0"
        class="bg-red-50 border-l-4 border-red-400 p-4"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <!-- You can add an error icon here if you want -->
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-700 font-medium">Please correct the following errors:</p>
            <ul class="mt-2 text-sm text-red-700 list-disc list-inside pl-2">
              <li v-for="(error, field) in validation.errors" :key="field">{{ error }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="$emit('close-modal')"
          class="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="handleSaveAsDraft"
          class="px-6 py-3 border border-primary rounded-md text-primary bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Save as Draft
        </button>
        <button
          type="button"
          @click="openPaymentModal"
          :disabled="!form.declaration || isSubmitting"
          class="px-6 py-3 bg-primary text-white rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? 'Submitting...' : 'Submit' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import apiService from '@/services/services'
import FileUpload from '@/components/common/FileUpload.vue'
import { useToast } from 'vue-toastification'
import PaymentModal from '@/components/common/PaymentModal.vue'
import CIDSelection from './CIDSelection.vue'
import EducationTypeSelection from './EducationTypeSelection.vue'

const { user } = useAuthStore()
const toast = useToast()
const authStore = useAuthStore() // Get the authStore instance

const isLoadingDCRC = ref(false)
const isLoadingRUB = ref(false)
const isSubmitting = ref(false)
const currentYear = new Date().getFullYear()
const minYear = currentYear - 50
const isCIDHolder = ref(null)

const qualificationOptions = ref([])
const courseTypeOptions = ref([])

const props = defineProps({
  initialData: Object,
  mode: { type: String, default: 'create' },
})

const form = reactive({
  // Personal Information
  cid_no: props.initialData?.cid_no || '',
  applicants_name: props.initialData?.applicants_name || '',
  date_of_birth: props.initialData?.date_of_birth || '',
  contact_no: props.initialData?.contact_no || '',
  email_address: props.initialData?.email_address || user.email,
  gender: props.initialData?.gender || '',
  dzongkhag: props.initialData?.dzongkhag || '',
  gewog: props.initialData?.gewog || '',
  village: props.initialData?.village || '',

  // Education Details
  from_in_country:
    props.initialData?.from_in_country !== undefined ? props.initialData.from_in_country : null,
  course_title: props.initialData?.course_title || '',
  qualification: props.initialData?.qualification || '',
  type_of_course: props.initialData?.type_of_course || '',
  duration_of_course: props.initialData?.duration_of_course || '',
  name_of_institute: props.initialData?.name_of_institute || '',
  name_of_university: props.initialData?.name_of_university || '',
  student_id_no: props.initialData?.student_id_no || '',
  year_of_completion: props.initialData?.year_of_completion || '',
  website: props.initialData?.website || '',
  location: props.initialData?.location || '',
  country: props.initialData?.country || '',

  // Documents
  degree_certificate: null,
  academic_transcript: null,
  passport_size_photo: null,

  // Additional Fields
  remarks: props.initialData?.remarks || '',
  declaration: props.initialData?.declaration || false,
  is_payment_complete: props.initialData?.is_payment_complete || false,
  payment_id: props.initialData?.payment_id || null,
  status: props.initialData?.status || 'applied',
})

// Add validation state
const validation = reactive({
  errors: {},
  showSummary: false,

  // Define validation rules for each field
  rules: {
    // Personal Information
    cid_no: (value) => {
      if (isCIDHolder.value && !value) return 'CID number is required'
      if (isCIDHolder.value && !/^\d{11}$/.test(value)) return 'CID number must be 11 digits'
      return null
    },
    applicants_name: (value) => {
      if (!value) return 'Full name is required'
      if (value.length < 2) return 'Name must be at least 2 characters'
      return null
    },
    date_of_birth: (value) => {
      if (!isCIDHolder.value && !value) return 'Date of birth is required'
      return null
    },
    contact_no: (value) => {
      if (!value) return 'Contact number is required'
      if (!/^\d{8}$/.test(value)) return 'Contact number must be 8 digits'
      return null
    },
    email_address: (value) => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format'
      return null
    },
    gender: (value) => {
      if (!isCIDHolder.value && !value) return 'Please select gender'
      return null
    },
    dzongkhag: (value) => {
      if (!isCIDHolder.value && !value) return 'Dzongkhag is required'
      return null
    },
    gewog: (value) => {
      if (!isCIDHolder.value && !value) return 'Gewog is required'
      return null
    },
    village: (value) => {
      if (!isCIDHolder.value && !value) return 'Village is required'
      return null
    },

    // Education Details
    student_id_no: (value) => {
      if (!value) return 'Student ID number is required'
      return null
    },
    course_title: (value) => {
      if (!value) return 'Course title is required'
      return null
    },
    qualification: (value) => {
      if (!value) return 'Qualification is required'
      return null
    },
    type_of_course: (value) => {
      if (!value) return 'Type of course is required'
      return null
    },
    duration_of_course: (value) => {
      if (!value) return 'Duration is required'
      if (value < 1 || value > 10) return 'Duration must be between 1 and 10 years'
      return null
    },
    name_of_institute: (value) => {
      if (!value) return 'Name of institute is required'
      return null
    },
    name_of_university: (value) => {
      if (!value) return 'Name of university is required'
      return null
    },
    year_of_completion: (value) => {
      if (!value) return 'Year of completion is required'
      const yearVal = parseInt(value)
      if (yearVal < minYear || yearVal > currentYear)
        return `Year must be between ${minYear} and ${currentYear}`
      return null
    },
    website: (value) => {
      if (value && !/^https?:\/\/.*/.test(value))
        return 'Website must start with http:// or https://'
      return null
    },
    location: (value) => {
      if (!value) return 'Location is required'
      return null
    },
    country: (value) => {
      if (!value) return 'Country is required'
      return null
    },

    // Documents
    degree_certificate: (value) => {
      if (!form.from_in_country && !value) return 'Degree certificate is required'
      return null
    },
    academic_transcript: (value) => {
      if (!form.from_in_country && !value) return 'Academic transcript is required'
      return null
    },
    passport_size_photo: (value) => {
      if (!value) return 'Passport size photo is required'
      return null
    },

    // Declaration
    declaration: (value) => {
      if (!value) return 'You must accept the declaration'
      return null
    },
  },
})

// Function to validate a specific field
const validateField = (fieldName) => {
  if (validation.rules[fieldName]) {
    const error = validation.rules[fieldName](form[fieldName])
    if (error) {
      validation.errors[fieldName] = error
    } else {
      delete validation.errors[fieldName]
    }
  }
}

// Function to validate all fields
const validateForm = () => {
  validation.errors = {}

  // Validate all fields that have rules
  for (const field in validation.rules) {
    // Skip validation for fields that are not applicable
    if (
      (isCIDHolder.value &&
        ['gender_non_cid', 'dzongkhag_non_cid', 'gewog_non_cid', 'village_non_cid'].includes(
          field,
        )) ||
      (form.from_in_country && ['degree_certificate', 'academic_transcript'].includes(field))
    ) {
      continue
    }

    validateField(field)
  }

  validation.showSummary = Object.keys(validation.errors).length > 0
  return Object.keys(validation.errors).length === 0
}

const paymentModal = ref(null)

const openPaymentModal = () => {
  // Validate the form before opening payment modal
  if (validateForm()) {
    paymentModal.value.openModal()
  } else {
    toast.error('Please fix the form errors before submitting')
    // Scroll to the top to see the error summary
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const onPaymentModalClose = () => {
  console.log('Payment modal closed')
}

const onPaymentCompleted = (paymentData) => {
  form.is_payment_complete = false
  form.payment_id = paymentData.paymentHash
  form.status = 'processing_payment'
  handleSubmitActual()
}

const isCIDValid = computed(() => {
  return /^\d{11}$/.test(form.cid_no)
})

const genderDisplay = computed(() => {
  const genderMap = {
    M: 'Male',
    F: 'Female',
  }
  return genderMap[form.gender] || ''
})

watch(
  () => form.from_in_country,
  (newValue) => {
    if (newValue === true) {
      form.country = 'Bhutan'
      form.course_title = ''
      form.qualification = ''
      form.type_of_course = ''
      form.duration_of_course = ''
      form.name_of_institute = ''
      form.name_of_university = ''
      form.year_of_completion = ''
      form.website = ''
      form.location = ''
      form.degree_certificate = null
      form.academic_transcript = null
    } else {
      form.country = ''
    }

    // Validate form when the education type changes
    validateForm()
  },
)

// Add watcher to validate CID holder fields
watch(
  () => isCIDHolder.value,
  () => {
    validateForm()
  },
)

onMounted(async () => {
  try {
    const [qualificationsResponse, courseTypesResponse] = await Promise.all([
      apiService.getQualifications(),
      apiService.getTypesOfCourse(),
    ])

    qualificationOptions.value = qualificationsResponse.data.results.map((qual) => ({
      value: qual.id,
      label: qual.name,
    }))

    courseTypeOptions.value = courseTypesResponse.data.results.map((type) => ({
      value: type.id,
      label: type.name,
    }))
  } catch (error) {
    toast.error('Failed to fetch dropdown options', 'error')
    console.error('Error fetching dropdown options:', error)
  }
})

const fetchDCRCData = async () => {
  const userId = authStore.userId

  if (!isCIDValid.value) {
    toast.error('Please enter a valid 11-digit CID')
    validation.errors.cid_no = 'Please enter a valid 11-digit CID'
    return
  }
  if (!userId) {
    toast.error('User is not logged in or user ID is unavailable.')
    return
  }

  isLoadingDCRC.value = true
  try {
    const response = await apiService.fetchCitizenDetails(form.cid_no, {
      params: { user_id: userId },
    })

    const formatDate = (dateString) => {
      if (!dateString) return ''
      const [day, month, year] = dateString.split('/')
      return `${year}-${month}-${day}`
    }

    Object.assign(form, {
      cid_no: response.data.cid_no,
      applicants_name: response.data.applicants_name,
      date_of_birth: formatDate(response.data.date_of_birth),
      gender: response.data.gender,
      dzongkhag: response.data.dzongkhag,
      gewog: response.data.gewog,
      village: response.data.village,
    })

    // Validate fields after fetching
    validateForm()

    if (response.data.changes_saved) {
      toast.success('DCRC data fetched and user profile updated successfully')
    } else {
      toast.success('DCRC data fetched successfully')
    }
  } catch (error) {
    toast.error('Failed to fetch DCRC data')
    console.error('Error fetching DCRC data:', error)
    validation.errors.cid_no = 'Failed to fetch data for this CID'
  } finally {
    isLoadingDCRC.value = false
  }
}

const fetchRUBData = async () => {
  if (!form.student_id_no) {
    validation.errors.student_id_no = 'Student ID is required'
    return
  }

  isLoadingRUB.value = true
  try {
    const response = await apiService.fetchRubDetails(form.cid_no, form.student_id_no)
    if (response.data) {
      form.name_of_institute = response.data.organisationName || ''
      form.name_of_university = 'Royal University of Bhutan'
      form.course_title = response.data.programmeName || ''
      form.year_of_completion = response.data.passYear || ''
      form.website = response.data.website || 'https://rub.gov.bt'
      form.duration_of_course = response.data.duration || ''

      let courseTypeId = null
      const newCourseTypeName = response.data.level

      const existingCourseType = courseTypeOptions.value.find(
        (type) => type.label === newCourseTypeName,
      )

      if (existingCourseType) {
        courseTypeId = existingCourseType.value
      } else {
        try {
          const addCourseTypeResponse = await apiService.createTypeOfCourse({
            name: newCourseTypeName,
            definition: newCourseTypeName,
          })

          const newCourseType = addCourseTypeResponse.data
          courseTypeId = newCourseType.id

          courseTypeOptions.value.push({ value: newCourseType.id, label: newCourseType.name })
        } catch (addError) {
          console.error('Error adding course type:', addError)
          const errorMessage =
            addError.response?.data?.message || addError.message || 'Unknown error'
          toast.error(`Failed to add course type "${newCourseTypeName}": ${errorMessage}`)
          isLoadingRUB.value = false
          return
        }
      }
      form.type_of_course = courseTypeId

      // Validate the form after fetching RUB data
      validateForm()

      toast.success('RUB data fetched successfully')
    } else {
      toast.error('No RUB data found for provided IDs.')
      validation.errors.student_id_no = 'No data found for this Student ID'
    }
  } catch (error) {
    console.error('Error fetching RUB data:', error)
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error'
    toast.error(`Failed to fetch RUB data: ${errorMessage}`)
    validation.errors.student_id_no = 'Failed to fetch data for this Student ID'
  } finally {
    isLoadingRUB.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString
  }
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', dateString)
    return ''
  }
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const handleSubmit = () => {
  // Always validate the form when submitting
  if (validateForm()) {
    if (form.declaration) {
      openPaymentModal()
    } else {
      toast.error('Please accept the declaration')
      validation.errors.declaration = 'You must accept the declaration'
    }
  } else {
    toast.error('Please fix the form errors before submitting')
    // Scroll to the top to see the error summary
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleSaveAsDraft = async () => {
  // For draft, we don't need to validate everything
  form.status = 'draft'

  // Minimal validation for draft
  const requiredForDraft = ['applicants_name']
  let isValid = true

  for (const field of requiredForDraft) {
    const error = validation.rules[field](form[field])
    if (error) {
      validation.errors[field] = error
      isValid = false
    }
  }

  if (isValid) {
    await handleSubmitActual(true) // Pass a flag to indicate it's a draft
  } else {
    toast.error('Please provide at least your name to save as draft')
  }
}

const handleSubmitActual = async (isDraft = false) => {
  isSubmitting.value = true
  try {
    const formData = new FormData()

    // Build FormData
    for (const key in form) {
      if (Object.prototype.hasOwnProperty.call(form, key)) {
        let value = form[key]

        // Add special handling for qualification and type_of_course here
        if (key === 'qualification' || key === 'type_of_course') {
          console.log(`${key} value:`, value, typeof value)

          // Make sure we're sending a number, not a string or null
          const numericValue = parseInt(value)
          if (!isNaN(numericValue)) {
            formData.append(key, numericValue.toString())
            continue // Skip the normal append below for these fields
          }
        }

        if (value instanceof File) {
          formData.append(key, value)
        } else if (key === 'date_of_birth') {
          formData.append(key, formatDate(value))
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString())
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString())
        }
      }
    }

    // Only make the main request if it's not a draft, OR, if payment is complete.  Drafts should save even if no payment.
    if (!isDraft) {
      // Payment Request (only if not a draft)
      const paymentData = {
        platform: 'BQPCA e-Zhapto',
        refNo: form.payment_id, // Use the payment_id from the form
        taxPayerNo: form.cid_no,
        taxPayerDocumentNo: form.cid_no, //AGENCYCODE replaced with literal as per instructions
        payerEmail: form.email_address,
        mobileNo: form.contact_no,
        totalPayableAmount: 1000.0,
        serviceCode: '100192',
        description: 'Payment for ROQ Application',
        payableAmount: 1000.0,
        taxPayerName: form.applicants_name,
        application_no: form.payment_id, // Use payment_id, consistent with refNo
        app_type: 'ROQ',
        user_id: authStore.userId,
      }
      try {
        const paymentResponse = await apiService.makePayment(paymentData)
        console.log('Payment Response:', paymentResponse)

        //Check payment response status, if needed.

        if (paymentResponse.status !== 201 && paymentResponse.status !== 200) {
          // Check success
          throw new Error('Payment request failed') // important - throw error to prevent main request.
        }
      } catch (paymentError) {
        console.error('Error making payment:', paymentError)
        toast.error(
          'Payment request failed: ' +
            (paymentError.response?.data?.message || paymentError.message),
        )
        isSubmitting.value = false // Reset before returning.
        return // Stop execution if payment fails
      }
    }

    let response
    if (props.mode === 'edit') {
      response = await apiService.updateRecognitionOfQualification(props.initialData.id, formData)
      if (response.status === 200) {
        toast.success('Application updated successfully')
      }
    } else {
      response = await apiService.createRecognitionOfQualification(formData)
      if (response.status === 201) {
        if (isDraft) {
          toast.success('Application saved as draft')
        } else {
          toast.success(
            'Application submitted successfully. Please check your email to complete the payment.',
          )
          emit('application-submitted')
        }
      }
    }
    emit('submitted') // Emit 'submitted' for both create and edit on success
  } catch (error) {
    console.error('Error submitting form:', error.response?.data || error)
    const errorMessage = error.response?.data?.message || 'Failed to save application'
    toast.error(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}

// Helper function to extract file name from URL
const getFileNameFromUrl = (url) => {
  if (!url) return ''
  return url.substring(url.lastIndexOf('/') + 1)
}

const emit = defineEmits(['application-submitted', 'close-modal', 'submitted'])

const handleCIDInput = (event) => {
  const input = event.target.value.replace(/\D/g, '')
  form.cid_no = input.slice(0, 11)

  // Validate the CID field
  validateField('cid_no')

  if (form.cid_no.length === 11) {
    fetchDCRCData()
  }
}
</script>

<style scoped>
.required::after {
  content: ' *';
  color: #ef4444;
}
</style>
