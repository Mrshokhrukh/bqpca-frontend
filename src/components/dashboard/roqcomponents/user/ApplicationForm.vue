<template>
  <div>
    <CIDSelection v-model="isCIDHolder"  />

    <PaymentModal ref="paymentModal" :amount="1000" @payment-completed="onPaymentCompleted"
      @close="onPaymentModalClose" />

    <form v-if="isCIDHolder !== null" @submit.prevent="handleSubmit" class="space-y-6 mt-6">
      <!-- Personal Information Section (No changes here) -->
      <div v-if="isCIDHolder" class="bg-white border p-6 rounded-lg shadow-sm">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>

        <div class="bg-yellow-100 border-l-4 border-yellow-500 rounded text-yellow-700 p-4 mb-4" role="alert">
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
          <div class="relative">
            <label for="cid" class="block text-sm font-medium text-gray-700">CID No.</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input type="text" id="cid" v-model="form.cid_no" :readonly=true @input="handleCIDInput" maxlength="11"
                :class="[
                  'block w-full pr-24 rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                  {
                    'border-red-300 focus:border-red-500 focus:ring-red-500':
                      validation.errors.cid_no,
                  },
                ]" placeholder="Enter 11-digit CID" />
            </div>
            <p v-if="validation.errors.cid_no" class="mt-1 text-sm text-red-500">
              {{ validation.errors.cid_no }}
            </p>
          </div>

          <div>
            <label for="full_name" class="block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" id="full_name" v-model="form.applicants_name" :readonly="isDCRCDataFetched"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
              :class="{ 'bg-gray-50': isDCRCDataFetched }" />
          </div>

          <div>
            <label for="date_of_birth" class="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input type="date" id="date_of_birth" v-model="form.date_of_birth" :readonly="isDCRCDataFetched"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
              :class="{ 'bg-gray-50': isDCRCDataFetched }" />
          </div>

          <div>
            <label for="contact_number" class="block text-sm font-medium text-gray-700 required">Contact Number</label>
            <input type="tel" id="contact_number" v-model="form.contact_no" pattern="[0-9]{8}" required
              @input="validateField('contact_no')" :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.contact_no,
                },
              ]" />
            <p v-if="validation.errors.contact_no" class="mt-1 text-sm text-red-500">
              {{ validation.errors.contact_no }}
            </p>
            <p v-else class="mt-1 text-sm text-gray-500">Must be 8 digits</p>
          </div>

          <div>
            <label for="email_address" class="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" id="email_address" v-model="form.email_address" :readonly="!!form.email_address"
              @input="validateField('email_address')" :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                { 'bg-gray-50': !!form.email_address },
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.email_address,
                },
              ]" />
            <p v-if="validation.errors.email_address" class="mt-1 text-sm text-red-500">
              {{ validation.errors.email_address }}
            </p>
          </div>

          <div>
            <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
            <select id="gender" v-model="form.gender" :disabled="isDCRCDataFetched"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
              :class="{ 'bg-gray-50': isDCRCDataFetched }">
              <option value="" disabled>Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>

          <div>
            <label for="dzongkhag" class="block text-sm font-medium text-gray-700">Dzongkhag</label>
            <input type="text" id="dzongkhag" v-model="form.dzongkhag" :readonly="isDCRCDataFetched"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
              :class="{ 'bg-gray-50': isDCRCDataFetched }" />
          </div>

          <div>
            <label for="gewog" class="block text-sm font-medium text-gray-700">Gewog</label>
            <input type="text" id="gewog" v-model="form.gewog" :readonly="isDCRCDataFetched"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
              :class="{ 'bg-gray-50': isDCRCDataFetched }" />
          </div>

          <div>
            <label for="village" class="block text-sm font-medium text-gray-700">Village</label>
            <input type="text" id="village" v-model="form.village" :readonly="isDCRCDataFetched"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
              :class="{ 'bg-gray-50': isDCRCDataFetched }" />
          </div>
        </div>
      </div>

      <div v-else class="bg-white border p-6 rounded-lg shadow-sm">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div class="relative">
              <label for="cid" class="block text-sm font-medium text-gray-700">CID/Work Permit no/Passport No.</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <input type="text" id="cid" v-model="form.cid_no" :readonly=true @input="handleCIDInput" maxlength="11"
                  :class="[
                    'block w-full pr-24 rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                    {
                      'border-red-300 focus:border-red-500 focus:ring-red-500':
                        validation.errors.cid_no,
                    },
                  ]" placeholder="Enter 11-digit CID" />
              </div>
              <p v-if="validation.errors.cid_no" class="mt-1 text-sm text-red-500">
                {{ validation.errors.cid_no }}
              </p>
            </div>
            <label for="full_name_non_cid" class="block text-sm font-medium text-gray-700 required">Full Name</label>
            <input type="text" id="full_name_non_cid" v-model="form.applicants_name" required
              @input="validateField('applicants_name')" :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.applicants_name,
                },
              ]" />
            <p v-if="validation.errors.applicants_name" class="mt-1 text-sm text-red-500">
              {{ validation.errors.applicants_name }}
            </p>
          </div>

          <div>
            <label for="date_of_birth_non_cid" class="block text-sm font-medium text-gray-700 required">Date of
              Birth</label>
            <input type="date" id="date_of_birth_non_cid" v-model="form.date_of_birth" required
              @input="validateField('date_of_birth')" :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.date_of_birth,
                },
              ]" />
            <p v-if="validation.errors.date_of_birth" class="mt-1 text-sm text-red-500">
              {{ validation.errors.date_of_birth }}
            </p>
          </div>

          <div>
            <label for="contact_number_non_cid" class="block text-sm font-medium text-gray-700 required">Contact
              Number</label>
            <input type="tel" id="contact_number_non_cid" v-model="form.contact_no" pattern="[0-9]{8}" required
              @input="validateField('contact_no')" :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.contact_no,
                },
              ]" />
            <p v-if="validation.errors.contact_no" class="mt-1 text-sm text-red-500">
              {{ validation.errors.contact_no }}
            </p>
            <p v-else class="mt-1 text-sm text-gray-500">Must be 8 digits</p>
          </div>

          <div>
            <label for="email_address_non_cid" class="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" id="email_address_non_cid" v-model="form.email_address" :readonly="!!form.email_address"
              @input="validateField('email_address')" :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                { 'bg-gray-50': !!form.email_address },
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.email_address,
                },
              ]" />
            <p v-if="validation.errors.email_address" class="mt-1 text-sm text-red-500">
              {{ validation.errors.email_address }}
            </p>
          </div>

          <div>
            <label for="gender_non_cid" class="block text-sm font-medium text-gray-700 required">Gender</label>
            <select id="gender_non_cid" v-model="form.gender" required @change="validateField('gender')" :class="[
              'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
              {
                'border-red-300 focus:border-red-500 focus:ring-red-500':
                  validation.errors.gender,
              },
            ]">
              <option value="" disabled>Select Gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
            <p v-if="validation.errors.gender" class="mt-1 text-sm text-red-500">
              {{ validation.errors.gender }}
            </p>
          </div>

          <div>
            <label for="dzongkhag_non_cid" class="block text-sm font-medium text-gray-700 required">Country</label>
            <input type="text" id="dzongkhag_non_cid" v-model="form.dzongkhag" required
              @input="validateField('dzongkhag')" :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.dzongkhag,
                },
              ]" />
            <p v-if="validation.errors.dzongkhag" class="mt-1 text-sm text-red-500">
              {{ 'Country is required' }}
            </p>
          </div>

          <div>
            <label for="gewog_non_cid" class="block text-sm font-medium text-gray-700 required">State</label>
            <input type="text" id="gewog_non_cid" v-model="form.gewog" required @input="validateField('gewog')" :class="[
              'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
              {
                'border-red-300 focus:border-red-500 focus:ring-red-500': validation.errors.gewog,
              },
            ]" />
            <p v-if="validation.errors.gewog" class="mt-1 text-sm text-red-500">
              {{'State is required' }}
            </p>
          </div>

          <div>
            <label for="village_non_cid" class="block text-sm font-medium text-gray-700 required">City</label>
            <input type="text" id="village_non_cid" v-model="form.village" required @input="validateField('village')"
              :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.village,
                },
              ]" />
            <p v-if="validation.errors.village" class="mt-1 text-sm text-red-500">
              {{ 'City is required' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Education Details Section (No changes here) -->
      <EducationTypeSelection v-model="form.from_in_country" />
      <div class="bg-white border p-6 rounded-lg shadow-sm">
        <h3 class="text-xl font-semibold text-gray-900 mb-4">Education Details</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div class="relative">
            <label for="student_id_no" class="block text-sm font-medium text-gray-700 required">Student ID No.</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input type="text" id="student_id_no" v-model="form.student_id_no" required
                @input="validateField('student_id_no')" :class="[
                  'block w-full pr-24 rounded-md border-gray-300 focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                  {
                    'border-red-300 focus:border-red-500 focus:ring-red-500':
                      validation.errors.student_id_no,
                  },
                ]" />
              <button v-if="form.from_in_country" type="button" @click="fetchRUBData"
                :disabled="isLoadingRUB || !form.student_id_no"
                class="absolute inset-y-0 right-0 flex items-center px-3 rounded-r-md border-l bg-gray-50 hover:bg-gray-100 focus:outline-none">
                <span class="text-sm text-gray-600" :class="{ 'opacity-50': isLoadingRUB || !form.student_id_no }">
                  {{ isLoadingRUB ? 'Fetching...' : 'Fetch RUB' }}
                </span>
              </button>
            </div>
            <p v-if="validation.errors.student_id_no" class="mt-1 text-sm text-red-500">
              {{ validation.errors.student_id_no }}
            </p>
          </div>

          <div>
            <label for="course_title" class="block text-sm font-medium text-gray-700 required">Course Title</label>
            <input type="text" id="course_title" v-model="form.course_title" required
              :readonly="form.from_in_country && isRUBDataFetched" @input="validateField('course_title')"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
              :class="{ 'bg-gray-50': form.from_in_country && isRUBDataFetched }" />
            <p v-if="validation.errors.course_title" class="mt-1 text-sm text-red-500">
              {{ validation.errors.course_title }}
            </p>
          </div>

          <div>
            <label for="qualification" class="block text-sm font-medium text-gray-700 required">Qualification</label>
            <select id="qualification" v-model="form.qualification" required @change="validateField('qualification')"
              :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.qualification,
                },
              ]">
              <option value="" disabled>Select Qualification</option>
              <option v-for="qual in qualificationOptions" :key="qual.value" :value="qual.value">
                {{ qual.label }}
              </option>
            </select>
            <p v-if="validation.errors.qualification" class="mt-1 text-sm text-red-500">
              {{ validation.errors.qualification }}
            </p>
          </div>

          <div>
            <label for="type_of_course" class="block text-sm font-medium text-gray-700 required">Type of Course</label>
            <select id="type_of_course" v-model="form.type_of_course" required @change="validateField('type_of_course')"
              :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.type_of_course,
                },
              ]">
              <option value="" disabled>Select Course Type</option>
              <option v-for="type in courseTypeOptions" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
            <p v-if="validation.errors.type_of_course" class="mt-1 text-sm text-red-500">
              {{ validation.errors.type_of_course }}
            </p>
          </div>

          <div>
            <label for="duration_of_course" class="block text-sm font-medium text-gray-700 required">Duration of Course
              (Years)</label>
            <input type="number" id="duration_of_course" v-model="form.duration_of_course" min="1" max="10" required
              @input="validateField('duration_of_course')" :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.duration_of_course,
                },
              ]" />
            <p v-if="validation.errors.duration_of_course" class="mt-1 text-sm text-red-500">
              {{ validation.errors.duration_of_course }}
            </p>
          </div>

          <div>
            <label for="name_of_institute" class="block text-sm font-medium text-gray-700 required">Name of
              Institute</label>
            <input type="text" id="name_of_institute" v-model="form.name_of_institute" required
              :readonly="form.from_in_country && isRUBDataFetched" @input="validateField('name_of_institute')"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
              :class="{ 'bg-gray-50': form.from_in_country && isRUBDataFetched }" />
            <p v-if="validation.errors.name_of_institute" class="mt-1 text-sm text-red-500">
              {{ validation.errors.name_of_institute }}
            </p>
          </div>

          <div>
            <label for="name_of_university" class="block text-sm font-medium text-gray-700 required">Name of
              University</label>
            <input type="text" id="name_of_university" v-model="form.name_of_university" required
              :readonly="form.from_in_country && isRUBDataFetched" @input="validateField('name_of_university')"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
              :class="{ 'bg-gray-50': form.from_in_country && isRUBDataFetched }" />
            <p v-if="validation.errors.name_of_university" class="mt-1 text-sm text-red-500">
              {{ validation.errors.name_of_university }}
            </p>
          </div>

          <div>
            <label for="year_of_completion" class="block text-sm font-medium text-gray-700 required">Year of
              Completion</label>
            <input type="number" id="year_of_completion" v-model="form.year_of_completion" :min="minYear"
              :max="currentYear" required :readonly="form.from_in_country && isRUBDataFetched"
              @input="validateField('year_of_completion')"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
              :class="{ 'bg-gray-50': form.from_in_country && isRUBDataFetched }" />
            <p v-if="validation.errors.year_of_completion" class="mt-1 text-sm text-red-500">
              {{ validation.errors.year_of_completion }}
            </p>
          </div>

          <div>
            <label for="website" class="block text-sm font-medium text-gray-700">Website</label>
            <input type="url" id="website" v-model="form.website" placeholder="https://" pattern="https?://.+"
              @input="validateField('website')" :class="[
                'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
                {
                  'border-red-300 focus:border-red-500 focus:ring-red-500':
                    validation.errors.website,
                },
              ]" />
            <p v-if="validation.errors.website" class="mt-1 text-sm text-red-500">
              {{ validation.errors.website }}
            </p>
          </div>

          <div>
            <label for="location" class="block text-sm font-medium text-gray-700 required">Location</label>
            <input type="text" id="location" v-model="form.location" required @input="validateField('location')" :class="[
              'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2',
              {
                'border-red-300 focus:border-red-500 focus:ring-red-500':
                  validation.errors.location,
              },
            ]" />
            <p v-if="validation.errors.location" class="mt-1 text-sm text-red-500">
              {{ validation.errors.location }}
            </p>
          </div>

          <div>
            <label for="country" class="block text-sm font-medium text-gray-700 required">Country</label>
            <input type="text" id="country" v-model="form.country" required :readonly="form.from_in_country"
              @input="validateField('country')"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
              :class="{ 'bg-gray-50': form.from_in_country }" />
            <p v-if="validation.errors.country" class="mt-1 text-sm text-red-500">
              {{ validation.errors.country }}
            </p>
          </div>
        </div>
      </div>

      <!-- Supporting Documents Section (Changes are here) -->
      <div class="bg-white border p-6 rounded-lg shadow-sm">
        <h3 class="text-xl font-semibold mb-4 text-gray-900">Supporting Documents</h3>

        <div class="space-y-6">
          <!-- CHANGE: Removed v-if="!form.from_in_country" -->
          <div>
            <label class="block text-sm font-medium text-gray-700 required">Degree Certificate</label>
            <div class="mt-2">
              <FileUpload v-model="form.degree_certificate" accept=".pdf" :max-size="5" :initial-file-name="initialData?.degree_certificate
                ? getFileNameFromUrl(initialData.degree_certificate)
                : ''
                " required @change="validateField('degree_certificate')" />
              <p v-if="validation.errors.degree_certificate" class="mt-1 text-sm text-red-500">
                {{ validation.errors.degree_certificate }}
              </p>
              <p v-else class="mt-1 text-sm text-gray-500">PDF only, max 5MB</p>
            </div>
          </div>

          <!-- CHANGE: Removed v-if="!form.from_in_country" -->
          <div>
            <label class="block text-sm font-medium text-gray-700 required">Academic Transcript</label>
            <div class="mt-2">
              <FileUpload v-model="form.academic_transcript" accept=".pdf" :max-size="5" :initial-file-name="initialData?.academic_transcript
                ? getFileNameFromUrl(initialData.academic_transcript)
                : ''
                " required @change="validateField('academic_transcript')" />
              <p v-if="validation.errors.academic_transcript" class="mt-1 text-sm text-red-500">
                {{ validation.errors.academic_transcript }}
              </p>
              <p v-else class="mt-1 text-sm text-gray-500">PDF only, max 5MB</p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 required">Passport Size Photo</label>
            <div class="mt-2">
              <FileUpload v-model="form.passport_size_photo" accept=".jpg,.jpeg,.png,.webp" :max-size="2"
                :initial-file-name="initialData?.passport_size_photo
                  ? getFileNameFromUrl(initialData.passport_size_photo)
                  : ''
                  " required @change="validateField('passport_size_photo')" />
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

      <!-- Remarks and Submission Section (No changes here) -->
      <div class="bg-white border p-6 rounded-lg shadow-sm space-y-6">
        <div>
          <label for="remarks" class="block text-sm font-medium text-gray-700">Remarks</label>
          <textarea id="remarks" v-model="form.remarks" rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"></textarea>
        </div>

        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input type="checkbox" id="declaration" v-model="form.declaration" required
              @change="validateField('declaration')" :class="[
                'w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary',
                { 'border-red-300 focus:ring-red-500': validation.errors.declaration },
              ]" />
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

      <div v-if="validation.showSummary && Object.keys(validation.errors).length > 0"
      class="bg-red-50 border-l-4 border-red-400 p-4">
      <div class="flex">
        <div class="flex-shrink-0"></div>
        <div class="ml-3">
          <p class="text-sm text-red-700 font-medium">Please correct the following errors:</p>
          <ul class="mt-2 text-sm text-red-700 list-disc list-inside pl-2">
            <li v-for="(error, field) in validation.errors" :key="field">{{ error }}</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="flex justify-end space-x-4">
      <button type="button" @click="$emit('close-modal')"
        class="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
        Cancel
      </button>
      <button type="button" @click="handleSaveAsDraft" :disabled="isSavingDraft"
        class="px-6 py-3 border border-primary rounded-md text-primary bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]">
        <span v-if="isSavingDraft" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Saving...
        </span>
        <span v-else>Save as Draft</span>
      </button>
      <button type="button" @click="openPaymentModal" :disabled="!form.declaration || isSubmitting"
        class="px-6 py-3 bg-primary text-white rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]">
        <span v-if="isSubmitting" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Submitting...
        </span>
        <span v-else>Submit</span>
      </button>
    </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted, nextTick } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import apiService from '@/services/services'
import FileUpload from '@/components/common/FileUpload.vue'
import { useToast } from 'vue-toastification'
import PaymentModal from '@/components/common/PaymentModal.vue'
import CIDSelection from './CIDSelection.vue'
import EducationTypeSelection from './EducationTypeSelection.vue'

const emit = defineEmits(['application-submitted', 'close-modal', 'submitted'])

const { user } = useAuthStore()
const toast = useToast()
const authStore = useAuthStore()

const isLoadingDCRC = ref(false)
const isLoadingRUB = ref(false)
const isDCRCDataFetched = ref(false)
const isRUBDataFetched = ref(false)
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

const getScalarId = (value) => {
  if (value && typeof value === 'object' && value.id !== undefined) {
    return value.id
  }
  return value
}

const form = reactive({
  // cid_no: authStore.user.cid || '',
  applicants_name: props.initialData?.applicants_name || '',
  date_of_birth: props.initialData?.date_of_birth || '',
  contact_no: props.initialData?.contact_no || '',
  email_address: props.initialData?.email_address || user.email,
  gender: props.initialData?.gender || '',
  dzongkhag: props.initialData?.dzongkhag || '',
  gewog: props.initialData?.gewog || '',
  village: props.initialData?.village || '',

  from_in_country:
    props.initialData?.from_in_country !== undefined ? props.initialData.from_in_country : null,
  course_title: props.initialData?.course_title || '',
  qualification: getScalarId(props.initialData?.qualification) || '',
  type_of_course: getScalarId(props.initialData?.type_of_course) || '',
  duration_of_course: props.initialData?.duration_of_course || '',
  name_of_institute: props.initialData?.name_of_institute || '',
  name_of_university: props.initialData?.name_of_university || '',
  student_id_no: props.initialData?.student_id_no || '',
  year_of_completion: props.initialData?.year_of_completion || '',
  website: props.initialData?.website || '',
  location: props.initialData?.location || '',
  country: props.initialData?.country || '',

  degree_certificate: null,
  academic_transcript: null,
  passport_size_photo: null,

  remarks: props.initialData?.remarks || '',
  declaration: props.initialData?.declaration || false,
  is_payment_complete: props.initialData?.is_payment_complete || false,
  payment_id: props.initialData?.payment_id || null,
  status: props.initialData?.status || 'applied',
})

const validation = reactive({
  errors: {},
  showSummary: false,
  rules: {
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
    degree_certificate: (value) => {
      if (form.from_in_country === false && !value && props.mode === 'create' && !props.initialData?.degree_certificate)
        return 'Degree certificate is required'
      return null
    },
    academic_transcript: (value) => {
      if (form.from_in_country === false && !value && props.mode === 'create' && !props.initialData?.academic_transcript)
        return 'Academic transcript is required'
      return null
    },
    passport_size_photo: (value) => {
      if (!value && props.mode === 'create' && !props.initialData?.passport_size_photo)
        return 'Passport size photo is required'
      return null
    },
    declaration: (value) => {
      if (!value) return 'You must accept the declaration'
      return null
    },
  },
})

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

const validateForm = () => {
  validation.errors = {}
  for (const field in validation.rules) {
    // CHANGE: Removed the condition that skipped file validation for in-country applications
    if (
      isCIDHolder.value &&
      ['gender_non_cid', 'dzongkhag_non_cid', 'gewog_non_cid', 'village_non_cid'].includes(field)
    ) {
      delete validation.errors[field]
      continue
    }
    validateField(field)
  }
  validation.showSummary = Object.keys(validation.errors).length > 0
  return Object.keys(validation.errors).length === 0
}

const paymentModal = ref(null)

const openPaymentModal = () => {
  if (validateForm()) {
    paymentModal.value.openModal()
  } else {
    toast.error('Please fix the form errors before submitting')
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

watch(
  () => form.from_in_country,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      isRUBDataFetched.value = false
      const fieldsToReset = [
        'course_title',
        'qualification',
        'type_of_course',
        'duration_of_course',
        'name_of_institute',
        'name_of_university',
        'year_of_completion',
        'website',
        'location',
      ]

      fieldsToReset.forEach((field) => (form[field] = ''))

      // CHANGE: No longer clearing file uploads when switching to in-country
      if (newValue === true) {
        form.country = 'Bhutan'
      } else if (newValue === false) {
        form.country = ''
      }
    }
    validateForm()
  }
)

watch(
  () => isCIDHolder.value,
  async (newValue, oldValue) => {
    if (newValue !== oldValue) {
      isDCRCDataFetched.value = false
      if (props.mode !== 'edit') {
        form.applicants_name = ''
        form.date_of_birth = ''
        form.gender = ''
        form.dzongkhag = ''
        form.gewog = ''
        form.village = ''
        form.type_of_course = ''
      }
      if (newValue === false) {
        if (authStore.user && authStore.user.cid) {
          form.cid_no = authStore.user.cid
        } else {
          form.cid_no = ''
          toast.warn(
            "Logged-in user's CID is not available in authStore. This may be an issue if the backend requires a CID for non-CID holder applications."
          )
        }
      } else if (newValue === true) {
        form.cid_no = authStore.user.cid || ''
        await fetchDCRCData()
      }
      nextTick(() => {
        validateForm()
      })
    }
  }
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
    // console.log(qualificationsResponse.data.results);

    console.log(props);
    if (authStore.user && authStore.user.cid) {
      form.cid_no = authStore.user.cid
    }

    // await fetchDCRCData()


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

    const formatDateInternal = (dateString) => {
      if (!dateString) return ''
      const [day, month, year] = dateString.split('/')
      return `${year}-${month}-${day}`
    }

    Object.assign(form, {
      cid_no: response.data.cid_no,
      applicants_name: response.data.applicants_name,
      date_of_birth: formatDateInternal(response.data.date_of_birth),
      gender: response.data.gender,
      dzongkhag: response.data.dzongkhag,
      gewog: response.data.gewog,
      village: response.data.village,
    })

    isDCRCDataFetched.value = true
    validateForm()
    toast.success(
      response.data.changes_saved
        ? 'DCRC data fetched and user profile updated successfully'
        : 'DCRC data fetched successfully'
    )
  } catch (error) {
    toast.error('Failed to fetch DCRC data')
    console.error('Error fetching DCRC data:', error)
    validation.errors.cid_no = 'Failed to fetch data for this CID'
    isDCRCDataFetched.value = false
  } finally {
    isLoadingDCRC.value = false
  }
}

const fetchRUBData = async () => {
  if (!form.student_id_no) {
    validation.errors.student_id_no = 'Student ID is required'
    return
  }
  if (!form.cid_no && isCIDHolder.value) {
    toast.error('CID number is required to fetch RUB data.')
    validation.errors.cid_no = 'CID number is required for RUB fetch.'
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
      form.location = response.data.location || ''

      let courseTypeId = null
      const newCourseTypeName = response.data.level
      const existingCourseType = courseTypeOptions.value.find(
        (type) => type.label === newCourseTypeName
      )

      if (existingCourseType) {
        courseTypeId = existingCourseType.value
      } else if (newCourseTypeName) {
        const addCourseTypeResponse = await apiService.createTypeOfCourse({
          name: newCourseTypeName,
          definition: newCourseTypeName,
        })
        const newCourseType = addCourseTypeResponse.data
        courseTypeId = newCourseType.id
        courseTypeOptions.value.push({ value: newCourseType.id, label: newCourseType.name })
      }
      form.type_of_course = courseTypeId

      isRUBDataFetched.value = true
      validateForm()
      toast.success('RUB data fetched successfully')
    } else {
      toast.error('No RUB data found for provided IDs.')
      validation.errors.student_id_no = 'No data found for this Student ID'
      isRUBDataFetched.value = false
    }
  } catch (error) {
    console.error('Error fetching RUB data:', error)
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error'
    toast.error(`Failed to fetch RUB data: ${errorMessage}`)
    validation.errors.student_id_no = 'Failed to fetch data for this Student ID'
    isRUBDataFetched.value = false
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
  if (validateForm()) {
    if (form.declaration) {
      openPaymentModal()
    } else {
      toast.error('Please accept the declaration')
      validation.errors.declaration = 'You must accept the declaration'
    }
  } else {
    toast.error('Please fix the form errors before submitting')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const handleSaveAsDraft = async () => {
  isSavingDraft.value = true
  form.status = 'draft'
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
    await handleSubmitActual(true)
  } else {
    toast.error('Please provide at least your name to save as draft')
    isSavingDraft.value = false
  }
}

const handleSubmitActual = async (isDraft = false) => {
  isSubmitting.value = !isDraft
  let redirectUrl = null

  try {
    const formData = new FormData()
    const formKeysToBackendKeys = {
      type_of_course: 'type_of_course_id',
      qualification: 'qualification_id',
    }

    for (const key in form) {
      if (Object.prototype.hasOwnProperty.call(form, key)) {
        let value = form[key]
        const backendKey = formKeysToBackendKeys[key] || key

        if (value === null || value === undefined) {
          continue
        }
        if ((key === 'qualification' || key === 'type_of_course') && value === '') {
          continue
        }

        if (value instanceof File) {
          formData.append(backendKey, value)
        } else if (key === 'date_of_birth') {
          formData.append(backendKey, formatDate(value))
        } else if (typeof value === 'boolean') {
          formData.append(backendKey, value.toString())
        } else {
          formData.append(backendKey, value.toString())
        }
      }
    }

    if (!isDraft) {
      const paymentInitiationFormData = new FormData()
      paymentInitiationFormData.append('refNo', form.payment_id)
      paymentInitiationFormData.append('serviceCode', '100192') // ROQ New Application
      paymentInitiationFormData.append('taxPayerName', form.applicants_name)
      paymentInitiationFormData.append('taxPayerNo', form.cid_no || 'N/A')
      paymentInitiationFormData.append('taxPayerDocumentNo', form.cid_no || 'N/A')
      paymentInitiationFormData.append('totalPayableAmount', 1000.0)
      paymentInitiationFormData.append('description', 'Payment for ROQ Application')
      paymentInitiationFormData.append('mobileNo', form.contact_no)
      paymentInitiationFormData.append('payerEmail', form.email_address)
      paymentInitiationFormData.append('user', authStore.userId)
      paymentInitiationFormData.append('payableAmount', 1000.0)
      paymentInitiationFormData.append('application_no', form.payment_id)
      paymentInitiationFormData.append('app_type', 'recognition_of_qualification')

      try {
        const paymentResponse = await apiService.makePayment(paymentInitiationFormData)
        if (paymentResponse.data?.content?.redirectUrl) {
          redirectUrl = paymentResponse.data.content.redirectUrl
        } else {
          throw new Error('Redirect URL not received from payment gateway.')
        }
      } catch (paymentError) {
        console.error('Error making payment:', paymentError)
        toast.error(
          'Payment request failed: ' +
          (paymentError.response?.data?.message || paymentError.message),
        )
        isSubmitting.value = false
        return
      }
    }

    let response
    if (props.mode === 'edit' && props.initialData?.id) {
      response = await apiService.updateRecognitionOfQualification(props.initialData.id, formData)
      if (response.status === 200) {
        if (isDraft) {
          toast.success('Draft updated successfully')
        } else {
          toast.success(
            'Application updated successfully, redirecting for payment. A link has also been sent to your email.',
            { timeout: 8000 }
          )
          if (redirectUrl) {
            window.open(redirectUrl, '_blank')
          }
        }
        emit('application-submitted', response.data) // Emit updated data
      }
    } else {
      response = await apiService.createRecognitionOfQualification(formData)
      if (response.status === 201) {
        if (isDraft) {
          toast.success('Application saved as draft')
        } else {
          toast.success(
            'Application submitted successfully, redirecting for payment. A link has also been sent to your email.',
            { timeout: 8000 }
          )
          if (redirectUrl) {
            window.open(redirectUrl, '_blank')
          }
        }
        emit('application-submitted', response.data) // Emit newly created data
      }
    }
  } catch (error) {
    console.error('Error submitting form:', error.response?.data || error)
    let errorMessage = 'Failed to save application.'
    if (error.response?.data) {
      const errors = error.response.data
      if (typeof errors === 'object') {
        const fieldErrorMessages = Object.entries(errors)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('; ')
        if (fieldErrorMessages) errorMessage = fieldErrorMessages
        else if (errors.detail) errorMessage = errors.detail
        else if (errors.message) errorMessage = errors.message
      } else if (typeof errors === 'string') {
        errorMessage = errors
      }
    }
    toast.error(errorMessage, { timeout: 7000 })
  } finally {
    isSubmitting.value = false
  }
}

const getFileNameFromUrl = (url) => {
  if (!url) return ''
  return url.substring(url.lastIndexOf('/') + 1)
}

const handleCIDInput = (event) => {
  const input = event.target.value.replace(/\D/g, '')
  form.cid_no = input.slice(0, 11)
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
button {
  transition: all 0.3s ease;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
