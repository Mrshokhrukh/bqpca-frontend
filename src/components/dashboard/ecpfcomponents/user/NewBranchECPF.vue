<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Branch ECPF Establishment</h1>
      <p class="text-gray-600">
        Information from your existing ECPF profile has been auto-populated. Please verify and fill
        in the details for the new branch proposal below.
      </p>
    </div>

    <!-- Loading/Error/Success Messages -->
    <div v-if="isLoading" class="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
      <p>Loading initial data and ECPF profile...</p>
    </div>
    <div v-if="formMessage.text" :class="[
      'mb-4 p-4 border rounded break-words',
      formMessage.type === 'error'
        ? 'bg-red-100 border-red-400 text-red-700'
        : 'bg-green-100 border-green-400 text-green-700',
    ]">
      <p>{{ formMessage.text }}</p>
    </div>

    <!-- Form Section -->
    <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <form v-if="!isLoading" @submit.prevent="submitForm" ref="formEl">
        <!-- Personal Information -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Personal Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="cid_no" class="block text-sm font-medium text-gray-700">CID No:</label>
              <input id="cid_no" type="text" v-model="formData.cid_no"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none cursor-not-allowed" />
            </div>
            <div>
              <label for="applicant_name" class="block text-sm font-medium text-gray-700">Applicant's Name:</label>
              <input id="applicant_name" type="text" v-model="formData.applicant_name"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none cursor-not-allowed" />
            </div>
            <div>
              <label for="gender" class="block text-sm font-medium text-gray-700">Gender:</label>
              <input id="gender" type="text" v-model="formData.gender"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none cursor-not-allowed" />
            </div>
            <div>
              <label for="date_of_birth" class="block text-sm font-medium text-gray-700">Date of Birth:</label>
              <input id="date_of_birth" type="text" :value="formatDateForDisplay(formData.date_of_birth)"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none cursor-not-allowed" />
            </div>
            <div>
              <label for="contact_no" class="block text-sm font-medium text-gray-700">Contact No:</label>
              <input id="contact_no" type="number" v-model="formData.contact_no"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label for="email_address" class="block text-sm font-medium text-gray-700">Email Address:</label>
              <input id="email_address" type="email" v-model="formData.email_address"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
        </section>

        <!-- Residential/Present Address -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Residential/Present Address</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="office_number" class="block text-sm font-medium text-gray-700">Office Number:</label>
              <input id="office_number" type="number" v-model="formData.office_number"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label for="flat_no" class="block text-sm font-medium text-gray-700">Flat No:</label>
              <input id="flat_no" type="text" v-model="formData.flat_no"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label for="building_no" class="block text-sm font-medium text-gray-700">Building No:</label>
              <input id="building_no" type="text" v-model="formData.building_no"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label for="location" class="block text-sm font-medium text-gray-700">Location (Area/Street):</label>
              <input id="location" type="text" v-model="formData.location"
                placeholder="E.g., Changzamtog, Near Hospital"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label for="dzongkhag_thromde_present" class="block text-sm font-medium text-gray-700">Dzongkhag/Thromde
                (Present Address):</label>
              <input id="dzongkhag_thromde_present" type="text" v-model="formData.dzongkhag_thromde_present"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none cursor-not-allowed" />
            </div>
            <div>
              <label for="gewog_throm_present" class="block text-sm font-medium text-gray-700">Gewog/Throm (Present
                Address):</label>
              <input id="gewog_throm_present" type="text" v-model="formData.gewog_throm_present"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none cursor-not-allowed" />
            </div>
          </div>
        </section>

        <!-- Education Details -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Education Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="qualification_edu" class="block text-sm font-medium text-gray-700">Qualification:</label>
              <input id="qualification_edu" type="text" v-model="formData.qualification_edu"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label for="qualification_type_edu_display" class="block text-sm font-medium text-gray-700">Qualification
                Type:</label>
              <input id="qualification_type_edu_display" type="text" :value="displayQualificationTypeEduName"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none cursor-not-allowed" />
            </div>
            <div>
              <label for="institute_name" class="block text-sm font-medium text-gray-700">Name of Institute:</label>
              <input id="institute_name" type="text" v-model="formData.institute_name"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label for="university_name" class="block text-sm font-medium text-gray-700">Name of University:</label>
              <input id="university_name" type="text" v-model="formData.university_name"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
        </section>

        <!-- Permanent Address -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Permanent Address</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="village_chiwog" class="block text-sm font-medium text-gray-700">Village/Chiwog:</label>
              <input id="village_chiwog" type="text" v-model="formData.village_chiwog"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none cursor-not-allowed" />
            </div>
            <div>
              <label for="gewog_perm" class="block text-sm font-medium text-gray-700">Gewog:</label>
              <input id="gewog_perm" type="text" v-model="formData.gewog_perm"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none cursor-not-allowed" />
            </div>
            <div>
              <label for="dungkhag" class="block text-sm font-medium text-gray-700">Dungkhag:</label>
              <input id="dungkhag" type="text" v-model="formData.dungkhag"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none cursor-not-allowed" />
            </div>
            <div>
              <label for="dzongkhag_thromde_perm"
                class="block text-sm font-medium text-gray-700">Dzongkhag/Thromde:</label>
              <input id="dzongkhag_thromde_perm" type="text" v-model="formData.dzongkhag_thromde_perm"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none cursor-not-allowed" />
            </div>
          </div>
        </section>

        <!-- Branch ECPF Establishment Proposal Details -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">
            Branch ECPF Establishment Proposal Details
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="existing_ecpf_name" class="block text-sm font-medium text-gray-700">Name of the Existing ECPF
                (Parent Firm):</label>
              <input id="existing_ecpf_name" type="text" v-model="formData.existing_ecpf_name"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none cursor-not-allowed" />
            </div>
            <div>
              <label for="proposed_firm_branch_name" class="block text-sm font-medium text-gray-700">Proposed Name for
                New Branch:</label>
              <input id="proposed_firm_branch_name" type="text" v-model="formData.proposed_firm_branch_name"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label for="proposed_firm_address" class="block text-sm font-medium text-gray-700">Address of the Proposed
                Branch:</label>
              <input id="proposed_firm_address" type="text" v-model="formData.proposed_firm_address"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label for="proposed_firm_location" class="block text-sm font-medium text-gray-700">Location of Proposed
                Branch:</label>
              <input id="proposed_firm_location" type="text" v-model="formData.proposed_firm_location"
                placeholder="Enter location"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label for="firm_type" class="block text-sm font-medium text-gray-700">Type of Firm (for New
                Branch):</label>
              <select id="firm_type" v-model="formData.firm_type"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option disabled :value="null">-- Select Firm Type --</option>
                <option v-for="type in firmTypes" :key="type.id" :value="type.id">
                  {{ type.name }}
                </option>
              </select>
            </div>
          </div>
        </section>

        <!-- Infrastructure -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">
            Infrastructure (for New Branch)
          </h2>
          <p class="text-sm text-gray-500 mb-4">
            Add details of the infrastructure available at the proposed branch.
          </p>
          <div v-if="formData.infrastructure.length === 0" class="text-gray-500 italic mb-4">
            No infrastructure details added yet. Click 'Add Infrastructure' to start.
          </div>
          <div v-for="(infra, index) in formData.infrastructure" :key="`infra-${index}`"
            class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded-md relative">
            <button type="button" @click="removeInfrastructure(index)" title="Remove Infrastructure Item"
              class="absolute -top-2 -right-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-full p-1 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div>
              <label :for="`particulars_${index}`" class="block text-sm font-medium text-gray-700">Particulars:</label>
              <select :id="`particulars_${index}`" v-model="infra.particulars"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option disabled :value="null">-- Select Item --</option>
                <option v-for="item in infrastructureOptions" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>
            <div>
              <label :for="`description_${index}`" class="block text-sm font-medium text-gray-700">Description:</label>
              <input :id="`description_${index}`" type="text" v-model="infra.description"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label :for="`quantity_${index}`" class="block text-sm font-medium text-gray-700">Quantity:</label>
              <input :id="`quantity_${index}`" type="number" :min="isRoomItem(infra.particulars) ? 2 : 1"
                v-model.number="infra.quantity"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label :for="`remarks_${index}`" class="block text-sm font-medium text-gray-700">Remarks:</label>
              <input :id="`remarks_${index}`" type="text" v-model="infra.remarks"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
          </div>
          <button type="button" @click="addInfrastructure"
            class="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20"
              fill="currentColor">
              <path fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd" />
            </svg>
            Add Infrastructure
          </button>
        </section>

        <!-- Human Resource -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">
            Human Resource (for New Branch)
          </h2>
          <p class="text-sm text-gray-500 mb-4">
            Add details of the staff proposed for the branch.
          </p>
          <div v-if="formData.humanResources.length === 0" class="text-gray-500 italic mb-4">
            No human resource details added yet. Click 'Add Human Resource' to start.
          </div>
          <div v-for="(hr, index) in formData.humanResources" :key="`hr-${index}`"
            class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded-md relative">
            <button type="button" @click="removeHumanResource(index)" title="Remove Human Resource Item"
              class="absolute -top-2 -right-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-full p-1 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div>
              <label :for="`position_${index}`" class="block text-sm font-medium text-gray-700">Position:</label>
              <select :id="`position_${index}`" v-model="hr.position"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option disabled :value="null">-- Select Position --</option>
                <option v-for="pos in positionOptions" :key="pos.id" :value="pos.id">
                  {{ pos.name }}
                </option>
              </select>
            </div>
            <div>
              <label :for="`cid_hr_${index}`" class="block text-sm font-medium text-gray-700">CID:</label>
              <input :id="`cid_hr_${index}`" type="text" v-model="hr.cid" pattern="\d{11}" title="Enter 11 digit CID"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label :for="`full_name_${index}`" class="block text-sm font-medium text-gray-700">Full Name:</label>
              <input :id="`full_name_${index}`" type="text" v-model="hr.full_name"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label :for="`qualification_hr_${index}`"
                class="block text-sm font-medium text-gray-700">Qualification:</label>
              <select :id="`qualification_hr_${index}`" v-model="hr.qualification"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option disabled :value="null">-- Select Qualification --</option>
                <option v-for="qual in qualificationOptions" :key="qual.id" :value="qual.id">
                  {{ qual.name }}
                </option>
              </select>
            </div>
            <div>
              <label :for="`contact_number_hr_${index}`" class="block text-sm font-medium text-gray-700">Contact
                Number:</label>
              <input :id="`contact_number_hr_${index}`" type="number" v-model="hr.contact_number"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label :for="`email_address_hr_${index}`" class="block text-sm font-medium text-gray-700">Email
                Address:</label>
              <input :id="`email_address_hr_${index}`" type="email" v-model="hr.email_address"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div class="md:col-span-2">
              <label :for="`cv_certificates_${index}`" class="block text-sm font-medium text-gray-700">CV & Certificates
                (PDF only):</label>
              <input :id="`cv_certificates_${index}`" type="file" accept=".pdf"
                @change="handleFileUpload($event, 'humanResources', index, 'cv_certificates')"
                class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
              <span v-if="getHrFileState(index).fileName" class="text-xs text-gray-600 mt-1 block">
                Selected: {{ getHrFileState(index).fileName }}
                <button v-if="getHrFileState(index).hasExistingFile || getHrFileState(index).fileName" type="button"
                  @click="clearHrFile(index)" class="ml-2 text-red-500 text-xs hover:underline">
                  ({{ getHrFileState(index).hasExistingFile ? 'Replace' : 'Clear' }})
                </button>
              </span>
            </div>
          </div>
          <button type="button" @click="addHumanResource"
            class="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20"
              fill="currentColor">
              <path fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd" />
            </svg>
            Add Human Resource
          </button>
        </section>

        <!-- Finance Plan -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">
            Finance Plan
          </h2>
          <div>
            <label for="finance_plan_details" class="block text-sm font-medium text-gray-700">Finance Plan
              Details:</label>
            <textarea id="finance_plan_details" v-model="formData.finance_plan_details" rows="4"
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent form-textarea"
              placeholder="Describe your finance plan for the branch..."></textarea>
          </div>
        </section>

        <!-- Services -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">
            Services Offered at Branch
          </h2>
          <p class="text-sm text-gray-500 mb-4">
            Add details of the services that will be offered at the proposed branch.
          </p>
          <div v-if="formData.services.length === 0" class="text-gray-500 italic mb-4">
            No services added yet. Click 'Add Service' to start.
          </div>
          <div v-for="(service, index) in formData.services" :key="`service-${index}`"
            class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded-md relative">
            <button type="button" @click="removeService(index)" title="Remove Service Item"
              class="absolute -top-2 -right-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-full p-1 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div>
              <label :for="`service_category_${index}`" class="block text-sm font-medium text-gray-700">Service
                Category:</label>
              <select :id="`service_category_${index}`" v-model="service.service_category"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm form-select">
                <option disabled :value="null">-- Select Category --</option>
                <option v-for="cat in serviceCategories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label :for="`service_details_${index}`" class="block text-sm font-medium text-gray-700">Details:</label>
              <textarea :id="`service_details_${index}`" v-model="service.details" rows="3"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm form-textarea"
                placeholder="Provide details for this service category..."></textarea>
            </div>
          </div>
          <button type="button" @click="addService"
            class="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20"
              fill="currentColor">
              <path fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd" />
            </svg>
            Add Service
          </button>
        </section>

        <!-- SWOT Analysis -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">
            SWOT Analysis (for New Branch)
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="swot_strengths" class="block text-sm font-medium text-gray-700">Strengths:</label>
              <textarea id="swot_strengths" v-model="formData.swot_strengths" rows="4"
                class="mt-1 block w-full form-textarea"></textarea>
            </div>
            <div>
              <label for="swot_weaknesses" class="block text-sm font-medium text-gray-700">Weaknesses:</label>
              <textarea id="swot_weaknesses" v-model="formData.swot_weaknesses" rows="4"
                class="mt-1 block w-full form-textarea"></textarea>
            </div>
            <div>
              <label for="swot_opportunities" class="block text-sm font-medium text-gray-700">Opportunities:</label>
              <textarea id="swot_opportunities" v-model="formData.swot_opportunities" rows="4"
                class="mt-1 block w-full form-textarea"></textarea>
            </div>
            <div>
              <label for="swot_threats" class="block text-sm font-medium text-gray-700">Threats:</label>
              <textarea id="swot_threats" v-model="formData.swot_threats" rows="4"
                class="mt-1 block w-full form-textarea"></textarea>
            </div>
          </div>
        </section>

        <!-- Fee & Charges -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">
            Fee & Charges Structure
          </h2>
          <p class="text-sm text-gray-500 mb-4">
            Detail the fee structure for services at the proposed branch.
          </p>
          <div v-if="formData.fee_charges.length === 0" class="text-gray-500 italic mb-4">
            No fee/charge items added yet. Click 'Add Fee/Charge' to start.
          </div>
          <div v-for="(fc, index) in formData.fee_charges" :key="`fc-${index}`"
            class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded-md relative">
            <button type="button" @click="removeFeeCharge(index)" title="Remove Fee/Charge Item"
              class="absolute -top-2 -right-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-full p-1 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div>
              <label :for="`fc_breakup_${index}`" class="block text-sm font-medium text-gray-700">Fee Breakup:</label>
              <input :id="`fc_breakup_${index}`" type="text" v-model="fc.fee_breakup"
                class="mt-1 block w-full form-input" />
            </div>
            <div>
              <label :for="`fc_description_${index}`"
                class="block text-sm font-medium text-gray-700">Description:</label>
              <input :id="`fc_description_${index}`" type="text" v-model="fc.description"
                class="mt-1 block w-full form-input" />
            </div>
            <div>
              <label :for="`fc_amount_${index}`" class="block text-sm font-medium text-gray-700">Amount (Nu.):</label>
              <input :id="`fc_amount_${index}`" type="number" min="0" v-model.number="fc.amount"
                class="mt-1 block w-full form-input" />
            </div>
            <div>
              <label :for="`fc_total_amount_${index}`" class="block text-sm font-medium text-gray-700">Total Amount
                (Nu.):</label>
              <input :id="`fc_total_amount_${index}`" type="number" min="0" v-model.number="fc.total_amount"
                class="mt-1 block w-full form-input" />
            </div>
          </div>
          <button type="button" @click="addFeeCharge"
            class="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20"
              fill="currentColor">
              <path fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd" />
            </svg>
            Add Fee/Charge
          </button>
        </section>

        <!-- Supporting Documents -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">
            Supporting Documents
          </h2>
          <div>
            <label for="applicant_cv_file_input" class="block text-sm font-medium text-gray-700">CV of the Applicant
              (PDF, DOC, DOCX, JPG, PNG):</label>
            <input id="applicant_cv_file_input" type="file" accept=".pdf,.doc,.docx,.jpg,.png"
              @change="handleApplicantCvUpload"
              class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" />
            <span v-if="getApplicantCvFileState().fileName" class="text-xs text-gray-600 mt-1 block">
              Selected: {{ getApplicantCvFileState().fileName }}
              <button v-if="getApplicantCvFileState().hasExistingFile || getApplicantCvFileState().fileName"
                type="button" @click="clearApplicantCvFile" class="ml-2 text-red-500 text-xs hover:underline">
                ({{ getApplicantCvFileState().hasExistingFile ? 'Replace' : 'Clear' }})
              </button>
            </span>
          </div>
        </section>

        <!-- Declaration -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">
            Declaration
          </h2>
          <div class="flex items-start space-x-3">
            <input type="checkbox" id="declaration_agree" v-model="declarationAgreed"
              class="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label for="declaration_agree" class="text-sm text-gray-700">
              I hereby declare that the information provided is true and correct to the best of my
              knowledge and agree to the terms and conditions.
            </label>
          </div>
        </section>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4 mt-10 pt-6 border-t border-gray-200">
          <button type="button" @click="saveAsDraft" :disabled="isSubmitting"
            class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isSubmitting ? 'Saving...' : 'Save as Draft' }}
          </button>
          <button type="submit" :disabled="isSubmitting"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
          </button>
          <button type="button" @click="editDraft" v-if="formData.isDraft" :disabled="isSubmitting"
            class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isSubmitting ? 'Loading...' : 'Edit Draft' }}
          </button>
        </div>
      </form>
      <div v-else class="text-center py-10">
        <p>Loading form data...</p>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import apiServices from '@/services/services'
import { useAuthStore } from '@/stores/authStore'
// import { bhutanDzongkhagsGewogs } from '@/constants/dzongkhags.js'

const authStore = useAuthStore()

const isLoading = ref(true)
const isSubmitting = ref(false)
const formMessage = reactive({ text: '', type: '' })
const formEl = ref(null)
const declarationAgreed = ref(false)
const counselorPositionId = ref(null)
const roomParticularsId = ref(null);

const getInitialFormData = () => ({
  cid_no: '', applicant_name: '', gender: '', date_of_birth: '', contact_no: '',
  email_address: '', office_number: '', flat_no: '', building_no: '', location: '',
  dzongkhag_thromde_present: '', gewog_throm_present: '',
  qualification_edu: '', qualification_type_edu: null,
  institute_name: '', university_name: '',
  village_chiwog: '', gewog_perm: '',
  dungkhag: '', dzongkhag_thromde_perm: '',
  existing_ecpf_name: '',
  proposed_firm_branch_name: '',
  proposed_firm_address: '', proposed_firm_location: null, firm_type: null,
  infrastructure: [],
  humanResources: [],
  finance_plan_details: '',
  services: [],
  swot_strengths: '', swot_weaknesses: '', swot_opportunities: '', swot_threats: '',
  fee_charges: [],
  applicant_cv_file: null,       // Will hold the File object for new uploads
  applicant_cv_filename: null,  // Store filename for display and reference
  applicant_cv_base64: null,    // Store base64 if loading from a draft that used it (now legacy)
  isDraft: false, draftId: null, declaration_agreed: false,
})

const formData = reactive(getInitialFormData())

const dzongkhagThromdes = ref([])
const firmTypes = ref([])
const infrastructureOptions = ref([])
const positionOptions = ref([])
const qualificationOptions = ref([])
const qualificationTypes_edu = ref([
  { id: 'class_xii', name: 'Class XII' },
  { id: 'diploma', name: 'Diploma' },
  { id: 'bachelor', name: 'Bachelor' },
  { id: 'masters', name: 'Masters' },
  { id: 'phd', name: 'PhD' },
  { id: 'others', name: 'Others' },
]);
const serviceCategories = ref([]);

const displayQualificationTypeEduName = computed(() => {
  if (formData.qualification_type_edu && qualificationTypes_edu.value.length > 0) {
    const foundType = qualificationTypes_edu.value.find(
      (type) => type.id === formData.qualification_type_edu
    );
    return foundType ? foundType.name : 'Not Specified';
  }
  return 'Not Specified';
});

const formatDateForDisplay = (dateString) => {
  if (!dateString) return ''
  try {
    return dateString.split('T')[0]
  } catch (e) {
    console.error('Error formatting date:', e)
    return dateString
  }
}

// ++++++++++++++++ START: ADDED THIS FUNCTION ++++++++++++++++
const isRoomItem = (particularsId) => {
  // Check if the master data has loaded and the ID was found
  if (!roomParticularsId.value) {
    return false;
  }
  // Compare the current item's ID with the stored room ID
  return particularsId === roomParticularsId.value;
};
// +++++++++++++++++ END: ADDED THIS FUNCTION +++++++++++++++++

const getHrFileState = (index) => {
  const hrItem = formData.humanResources[index];
  if (!hrItem) return { fileName: '', hasExistingFile: false };

  // If a new File object is present, that's the current state
  if (hrItem.cv_certificates instanceof File) {
    return { fileName: hrItem.cv_certificates.name, hasExistingFile: false };
  }
  // If loading from a draft, we might only have filename (and potentially base64 if old draft)
  // For FormData, "existing" means it's on the server. Client-side, we only know if a filename was loaded.
  if (hrItem.cv_filename) {
    // Consider it "existing" if a filename is there from a draft load, even if no new File object.
    // The `required` on input will be false, user doesn't have to re-upload unless they want to replace.
    return { fileName: hrItem.cv_filename, hasExistingFile: true };
  }
  return { fileName: '', hasExistingFile: false };
};

const clearHrFile = (index) => {
  if (formData.humanResources[index]) {
    formData.humanResources[index].cv_certificates = null; // Clear File object
    formData.humanResources[index].cv_certificates_base64 = null; // Clear any legacy base64
    formData.humanResources[index].cv_filename = null;
    const fileInput = formEl.value?.querySelector(`#cv_certificates_${index}`);
    if (fileInput) fileInput.value = '';
  }
};

const getApplicantCvFileState = () => {
  if (formData.applicant_cv_file instanceof File) {
    return { fileName: formData.applicant_cv_file.name, hasExistingFile: false };
  }
  if (formData.applicant_cv_filename) {
    return { fileName: formData.applicant_cv_filename, hasExistingFile: true };
  }
  return { fileName: '', hasExistingFile: false };
};

const clearApplicantCvFile = () => {
  formData.applicant_cv_file = null;
  formData.applicant_cv_base64 = null;
  formData.applicant_cv_filename = null;
  const fileInput = formEl.value?.querySelector('#applicant_cv_file_input');
  if (fileInput) fileInput.value = '';
};


const setMessage = (text, type = 'error') => {
  formMessage.text = text
  formMessage.type = type
  window.scrollTo(0, 0)
}
const clearMessage = () => {
  formMessage.text = ''
  formMessage.type = ''
}

const addInfrastructure = () => {
  formData.infrastructure.push({ particulars: null, description: '', quantity: 1, remarks: '' })
}
const removeInfrastructure = (index) => {
  formData.infrastructure.splice(index, 1)
}
const addHumanResource = () => {
  formData.humanResources.push({
    position: null, cid: '', full_name: '', qualification: null,
    contact_number: '', email_address: '',
    cv_certificates: null, // Holds File object
    cv_certificates_base64: null, // Legacy, for loading old drafts
    cv_filename: null      // For display and reference
  })
}
const removeHumanResource = (index) => {
  formData.humanResources.splice(index, 1)
}

const addService = () => {
  formData.services.push({ service_category: null, details: '' });
};
const removeService = (index) => {
  formData.services.splice(index, 1);
};

const addFeeCharge = () => {
  formData.fee_charges.push({ fee_breakup: '', description: '', amount: null, total_amount: null });
};
const removeFeeCharge = (index) => {
  formData.fee_charges.splice(index, 1);
};

const handleFileUpload = (event, sectionName, index, fileKey) => {
  const file = event.target.files[0];
  // console.log(`[handleFileUpload for HR ${index}] File selected:`, file);
  if (file && sectionName === 'humanResources') {
    formData.humanResources[index][fileKey] = file;
    formData.humanResources[index].cv_filename = file.name;
    formData.humanResources[index].cv_certificates_base64 = null; // Not using base64 for new uploads with FormData
    // console.log(`[handleFileUpload for HR ${index}] formData.humanResources[${index}] updated.`);
  }
}

const handleApplicantCvUpload = (event) => {
  const file = event.target.files[0];
  // console.log('[handleApplicantCvUpload] File selected:', file);
  if (file) {
    formData.applicant_cv_file = file;
    formData.applicant_cv_filename = file.name;
    formData.applicant_cv_base64 = null; // Not using base64 for new uploads with FormData
    // console.log('[handleApplicantCvUpload] formData updated.');
  }
};

// prepareJsonAndFileParts is now used instead of prepareDataForSubmission for FormData
const prepareJsonAndFileParts = () => {
  const jsonData = {};
  const fileObjects = {}; // To store actual File objects keyed for FormData

  // Create a deep copy to avoid direct mutation issues if any part of formData is reactive beyond top level
  const dataCopy = JSON.parse(JSON.stringify(formData));

  jsonData.applicant_cid_no = dataCopy.cid_no;
  jsonData.applicants_name = dataCopy.applicant_name;
  jsonData.gender = dataCopy.gender;
  jsonData.date_of_birth = dataCopy.date_of_birth;
  jsonData.contact_no = dataCopy.contact_no;
  jsonData.email = dataCopy.email_address;
  jsonData.office_number = dataCopy.office_number;
  jsonData.flat_no = dataCopy.flat_no;
  jsonData.building_no = dataCopy.building_no;
  jsonData.location = dataCopy.location;
  jsonData.gewog_throm = dataCopy.gewog_throm_present;
  jsonData.dzongkhag_thromde = dataCopy.dzongkhag_thromde_present;
  jsonData.qualification = dataCopy.qualification_edu;
  jsonData.qualification_type_edu = dataCopy.qualification_type_edu;
  jsonData.institute_name = dataCopy.institute_name;
  jsonData.university_name = dataCopy.university_name;
  jsonData.perm_village_chiwog = dataCopy.village_chiwog;
  jsonData.perm_gewog = dataCopy.gewog_perm;
  jsonData.perm_dungkhag = dataCopy.dungkhag;
  jsonData.perm_dzongkhag_thromde = dataCopy.dzongkhag_thromde_perm;
  jsonData.existing_ecpf_name = dataCopy.existing_ecpf_name;
  jsonData.proposed_firm_branch_name = dataCopy.proposed_firm_branch_name;
  jsonData.firm_address = dataCopy.proposed_firm_address;
  jsonData.firm_location = dataCopy.proposed_firm_location;
  jsonData.type_of_firm = dataCopy.firm_type;

  jsonData.infrastructure_details = dataCopy.infrastructure.map(infra => ({
    particulars_id: infra.particulars,
    description: infra.description,
    quantity: infra.quantity,
    remarks: infra.remarks,
  }));

  jsonData.human_resource_details = formData.humanResources.map((hr_original, index) => {
    const hrData = { // Create from dataCopy to avoid reactivity issues if hr_original is mutated
      position_id: dataCopy.humanResources[index].position,
      cid: dataCopy.humanResources[index].cid,
      full_name: dataCopy.humanResources[index].full_name,
      qualification_id: dataCopy.humanResources[index].qualification,
      contact_number: dataCopy.humanResources[index].contact_number,
      email: dataCopy.humanResources[index].email_address,
    };
    if (hr_original.cv_certificates instanceof File) {
      // Use a unique key for FormData, e.g. 'human_resource_cv_0', 'human_resource_cv_1'
      // Backend must be configured to expect these indexed file fields.
      fileObjects[`human_resource_cv_${index}`] = hr_original.cv_certificates;
      hrData.cv_filename = hr_original.cv_certificates.name; // Include filename in JSON part
    } else if (hr_original.cv_filename) {
      // If only filename (e.g. from draft), include it. Backend handles if file is missing.
      hrData.cv_filename = hr_original.cv_filename;
    }
    return hrData;
  });

  jsonData.finance_plan_details = dataCopy.finance_plan_details;
  jsonData.services_details = dataCopy.services.map(s => ({
    service_category_id: s.service_category,
    details: s.details,
  }));
  jsonData.strengths = dataCopy.swot_strengths;
  jsonData.weaknesses = dataCopy.swot_weaknesses;
  jsonData.opportunities = dataCopy.swot_opportunities;
  jsonData.threats = dataCopy.swot_threats;
  jsonData.fee_charges_details = dataCopy.fee_charges.map(fc => ({
    fee_breakup: fc.fee_breakup,
    description: fc.description,
    amount: fc.amount,
    total_amount: fc.total_amount,
  }));

  if (formData.applicant_cv_file instanceof File) {
    fileObjects.cv = formData.applicant_cv_file;
    // jsonData.applicant_cv_filename = formData.applicant_cv_file.name; // Optional: send filename in JSON
  } else if (formData.applicant_cv_filename) {
    // jsonData.applicant_cv_filename = formData.applicant_cv_filename; // Optional: send filename if from draft
  }

  jsonData.declaration = declarationAgreed.value;
  if (dataCopy.draftId) { // Use draftId from the copied data
    jsonData.draft_id = dataCopy.draftId;
  }

  // Status will be set in submitForm/saveAsDraft
  return { jsonData, fileObjects };
};


// ================= START: MODIFIED FUNCTION =================
const validateForm = () => {
  clearMessage();
  let isValid = true;
  const errors = [];

  // Required checks have been removed. Only format validation remains.

  // if (!formData.contact_no) errors.push('Contact Number is required.');
  if (formData.contact_no && !/^\d+$/.test(formData.contact_no)) errors.push('Contact Number must be numeric.');
  if (formData.email_address && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_address)) {
    errors.push('Please enter a valid personal Email Address.');
  }
  if (formData.office_number && !/^\d*$/.test(formData.office_number)) errors.push('Office Number must be numeric if provided.');
  // if (!formData.location) errors.push('Location (Area/Street) for present address is required.');
  // if (!formData.qualification_edu) errors.push('Education Qualification is required.');
  // if (formData.qualification_type_edu === null) errors.push('Education Qualification Type is required.');
  // if (!formData.institute_name) errors.push('Institute Name is required.');
  // if (!formData.university_name) errors.push('University Name is required.');
  // if (!formData.proposed_firm_branch_name) errors.push('Proposed Name for New Branch is required.');
  // if (!formData.proposed_firm_address) errors.push('Proposed Branch Address is required.');
  // if (formData.proposed_firm_location === null) errors.push('Proposed Branch Location  is required.');
  // if (formData.firm_type === null) errors.push('Type of Firm for the New Branch is required.');

  // if (formData.infrastructure.length === 0) {
  //   errors.push('At least one infrastructure item must be added.');
  // } else {
  //   let hasRoomInfrastructure = false;
  //   for (let i = 0; i < formData.infrastructure.length; i++) {
  //     const infra = formData.infrastructure[i];
  //     // if (infra.particulars === null || !infra.description || infra.quantity === null || infra.quantity < 1) {
  //     //   errors.push(`Complete required fields (Particulars, Description, Quantity >= 1) for Infrastructure item #${i + 1}.`);
  //     // }
  //     if (roomParticularsId.value && infra.particulars === roomParticularsId.value) {
  //       hasRoomInfrastructure = true;
  //     }
  //   }
  //   // if (roomParticularsId.value && !hasRoomInfrastructure && formData.infrastructure.length > 0) {
  //   //   const roomParticularName = infrastructureOptions.value.find(opt => opt.id === roomParticularsId.value)?.name || 'Room/Office Space';
  //   //   errors.push(`The proposed branch infrastructure must include details for a '${roomParticularName}'.`);
  //   // }
  // }

  // if (formData.humanResources.length === 0) {
  //   errors.push('At least one human resource item must be added.');
  // } else {
  //   let hasCounselor = false;
  //   const counselorCids = new Set();
  for (let i = 0; i < formData.humanResources.length; i++) {
    const hr = formData.humanResources[i]; const itemNum = i + 1;
    // if (!hr.position || !hr.cid || !hr.full_name || !hr.qualification || !hr.contact_number || !hr.email_address) {
    //   errors.push(`Complete all required fields for Human Resource item #${itemNum}.`);
    // }
    if (hr.cid && !/^\d{11}$/.test(hr.cid)) errors.push(`Invalid CID (must be 11 digits) for HR item #${itemNum}.`);
    if (hr.contact_number && !/^\d+$/.test(hr.contact_number)) errors.push(`HR Contact Number for item #${itemNum} must be numeric.`);
    if (hr.email_address && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(hr.email_address)) errors.push(`Invalid Email for HR item #${itemNum}.`);

    // const fileState = getHrFileState(i);
    // if (!(hr.cv_certificates instanceof File) && !fileState.hasExistingFile) {
    //   errors.push(`CV & Certificates file (PDF only) is required for Human Resource item #${itemNum}.`);
    // }
    // if (counselorPositionId.value && hr.position === counselorPositionId.value) {
    //   hasCounselor = true;
    //   if (hr.cid && counselorCids.has(hr.cid)) {
    //     errors.push(`Duplicate Counselor CID: ${hr.cid}. Each counselor must have a unique CID.`);
    //   } else if (hr.cid) {
    //     counselorCids.add(hr.cid);
    //   }
    // }
  }
  //   if (counselorPositionId.value && !hasCounselor && formData.humanResources.length > 0) {
  //     errors.push('At least one Counselor must be added to Human Resources.');
  //   }
  // }

  // if (!formData.finance_plan_details) errors.push('Finance Plan Details are required.');
  // if (formData.services.length === 0) {
  //   errors.push('At least one Service item must be added.');
  // } else {
  //   formData.services.forEach((service, i) => {
  //     if (service.service_category === null || !service.details) {
  //       errors.push(`Complete required fields (Category, Details) for Service item #${i + 1}.`);
  //     }
  //   });
  // }
  // if (!formData.swot_strengths) errors.push('Strengths in SWOT Analysis are required.');
  // if (!formData.swot_weaknesses) errors.push('Weaknesses in SWOT Analysis are required.');
  // if (!formData.swot_opportunities) errors.push('Opportunities in SWOT Analysis are required.');
  // if (!formData.swot_threats) errors.push('Threats in SWOT Analysis are required.');
  // if (formData.fee_charges.length === 0) {
  //   errors.push('At least one Fee/Charge item must be added.');
  // } else {
  //   formData.fee_charges.forEach((fc, i) => {
  //     if (!fc.fee_breakup || !fc.description || fc.amount === null || fc.amount < 0 || fc.total_amount === null || fc.total_amount < 0) {
  //       errors.push(`Complete required fields (Breakup, Description, Amount >= 0, Total Amount >= 0) for Fee/Charge item #${i + 1}.`);
  //     }
  //   });
  // }

  // const applicantCvState = getApplicantCvFileState();
  // if (!(formData.applicant_cv_file instanceof File) && !applicantCvState.hasExistingFile) {
  //   errors.push('CV of the Applicant is required.');
  // }
  // if (!declarationAgreed.value) errors.push('You must agree to the declaration to submit.');

  if (errors.length > 0) {
    setMessage(`Please fix the following errors: ${errors.join('; ')}`, 'error');
    isValid = false;
  }
  return isValid;
}
// ================== END: MODIFIED FUNCTION ==================


const submitForm = async () => {
  // console.log('[submitForm] Attempting to submit. Declaration Agreed:', declarationAgreed.value, 'Is Submitting:', isSubmitting.value, 'Is Draft:', formData.isDraft);

  // The following block was removed as the declaration is no longer mandatory.
  // if (!declarationAgreed.value && !formData.isDraft) {
  //   setMessage('You must agree to the declaration to submit the application.', 'error');
  //   return;
  // }
  if (formData.isDraft) {
    setMessage('This is a draft. Please click "Edit Draft" if you wish to submit it as a final application.', 'error');
    return;
  }

  if (!validateForm()) {
    console.log('[submitForm] Validation failed. Form not submitted.');
    return;
  }

  isSubmitting.value = true;
  clearMessage();
  // console.log('[submitForm] Validation passed. Proceeding with submission...');

  try {
    const { jsonData, fileObjects } = prepareJsonAndFileParts();
    jsonData.status = 'submitted';

    const payload = new FormData();

    // How to append JSON data - Option: append each key from jsonData as a field
    // This requires backend to parse individual fields, stringified if complex.
    for (const key in jsonData) {
      if (Object.prototype.hasOwnProperty.call(jsonData, key)) {
        if (typeof jsonData[key] === 'object' && jsonData[key] !== null) {
          payload.append(key, JSON.stringify(jsonData[key]));
        } else if (jsonData[key] !== null && jsonData[key] !== undefined) {
          payload.append(key, jsonData[key]);
        }
      }
    }

    for (const key in fileObjects) {
      if (Object.prototype.hasOwnProperty.call(fileObjects, key) && fileObjects[key] instanceof File) {
        payload.append(key, fileObjects[key], fileObjects[key].name);
        // console.log(`[submitForm] Appended file to FormData: ${key}`, fileObjects[key].name);
      }
    }

    let response;
    const apiCreateMethod = 'createEcpfBranch';
    const apiUpdateMethod = 'updateEcpfBranch';

    if (jsonData.draft_id && typeof apiServices[apiUpdateMethod] === 'function') {
      // console.log(`[submitForm] Calling API to update draft ID: ${jsonData.draft_id} (with FormData).`);
      // The draft_id is already part of jsonData, which is appended to payload.
      // The API service for update might take ID as a URL param and payload as body.
      response = await apiServices[apiUpdateMethod](jsonData.draft_id, payload);
    } else if (typeof apiServices[apiCreateMethod] === 'function') {
      // console.log(`[submitForm] Calling API to create new application (with FormData).`);
      response = await apiServices[apiCreateMethod](payload);
    } else {
      throw new Error(`Required API method for submission not found.`);
    }

    if (response?.status === 200 || response?.status === 201) {
      setMessage('Branch application submitted successfully!', 'success');
      await resetForm();
    } else {
      const errorDetail = response?.data?.detail || response?.data || `Submission failed with status: ${response?.status || 'Unknown'}`;
      const errorMessage = typeof errorDetail === 'string' ? errorDetail : JSON.stringify(errorDetail);
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('[submitForm] Error during submission process:', error);
    let errorMsg = 'Submission failed.';
    if (error?.response?.data) {
      const errorsData = error.response.data;
      if (typeof errorsData === 'string') errorMsg = errorsData;
      else if (typeof errorsData === 'object' && errorsData !== null) {
        const fieldErrors = Object.entries(errorsData).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ');
        if (fieldErrors) errorMsg = fieldErrors;
        else if (errorsData.detail) errorMsg = errorsData.detail;
      }
    } else if (error?.message) {
      errorMsg = error.message;
    }
    setMessage(`Error: ${errorMsg}`, 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const saveAsDraft = async () => {
  isSubmitting.value = true;
  clearMessage();
  // console.log('[saveAsDraft] Saving branch application as draft...');
  try {
    // A CID might still be useful for identifying drafts, but it's not strictly required to save.
    // if (!formData.cid_no) {
    //   setMessage('CID is required to save a draft.', 'error');
    //   isSubmitting.value = false;
    //   return;
    // }

    const { jsonData, fileObjects } = prepareJsonAndFileParts();
    jsonData.status = 'draft';

    const payload = new FormData();
    for (const key in jsonData) { // Append JSON data
      if (Object.prototype.hasOwnProperty.call(jsonData, key)) {
        if (typeof jsonData[key] === 'object' && jsonData[key] !== null) {
          payload.append(key, JSON.stringify(jsonData[key]));
        } else if (jsonData[key] !== null && jsonData[key] !== undefined) {
          payload.append(key, jsonData[key]);
        }
      }
    }
    for (const key in fileObjects) { // Append file data
      if (Object.prototype.hasOwnProperty.call(fileObjects, key) && fileObjects[key] instanceof File) {
        payload.append(key, fileObjects[key], fileObjects[key].name);
      }
    }

    let response;
    const apiCreateDraftMethod = 'createEcpfBranch';
    const apiUpdateDraftMethod = 'updateEcpfBranch';

    if (jsonData.draft_id && typeof apiServices[apiUpdateDraftMethod] === 'function') {
      response = await apiServices[apiUpdateDraftMethod](jsonData.draft_id, payload);
    } else if (typeof apiServices[apiCreateDraftMethod] === 'function') {
      response = await apiServices[apiCreateDraftMethod](payload);
    } else {
      throw new Error(`Required API method for saving draft not found.`);
    }

    if (response?.status === 200 || response?.status === 201) {
      const draftIdFromServer = response.data?.id || response.data?.draft_id;
      if (draftIdFromServer) {
        formData.draftId = draftIdFromServer;
      }
      formData.isDraft = true;
      // After saving draft with FormData, client-side File objects are gone unless re-selected.
      // formData.applicant_cv_file etc. are null now. Filenames are preserved.
      // get...FileState() logic might need adjustment if we want to show "file exists on server" differently.
      setMessage(`Branch application saved as draft. (Draft ID: ${formData.draftId || 'N/A'})`, 'success');
    } else {
      const errorDetail = response?.data?.detail || response?.data || `Draft save failed: ${response?.status || 'Unknown'}`;
      const errorMessage = typeof errorDetail === 'string' ? errorDetail : JSON.stringify(errorDetail);
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Error saving branch draft:', error);
    let errorMsg = 'Draft save failed.';
    if (error?.response?.data) {
      const errorsData = error.response.data;
      if (typeof errorsData === 'string') errorMsg = errorsData;
      else if (typeof errorsData === 'object' && errorsData !== null) {
        const fieldErrors = Object.entries(errorsData).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ');
        if (fieldErrors) errorMsg = fieldErrors;
        else if (errorsData.detail) errorMsg = errorsData.detail;
      }
    } else if (error?.message) {
      errorMsg = error.message;
    }
    setMessage(`Error: ${errorMsg}`, 'error');
  } finally {
    isSubmitting.value = false;
  }
};


// --- API Interaction (fetchMasterData, populateFromEcpfProfile, loadDraft, editDraft, resetForm are mostly unchanged) ---
const fetchMasterData = async () => {
  try {


    const apiCalls = [
      apiServices.getMastersTypesOfFirm ? apiServices.getMastersTypesOfFirm() : Promise.resolve({ data: { results: [] } }),
      apiServices.getMastersInfrastructures ? apiServices.getMastersInfrastructures() : Promise.resolve({ data: { results: [] } }),
      apiServices.getMastersPositions ? apiServices.getMastersPositions() : Promise.resolve({ data: { results: [] } }),
      apiServices.getMastersEcpfQualifications ? apiServices.getMastersEcpfQualifications() : Promise.resolve({ data: { results: [] } }),
      apiServices.getMastersServiceCategories ? apiServices.getMastersServiceCategories() : Promise.resolve({ data: { results: [] } }),
    ];
    const [firmTypeRes, infraRes, posRes, qualRes, serviceCatRes] = await Promise.all(apiCalls);
    const extractData = (response) => response?.data?.results || response?.data || [];

    firmTypes.value = extractData(firmTypeRes).map(item => ({ id: item.id, name: item.type_of_firm || item.name }));
    infrastructureOptions.value = extractData(infraRes).map(item => ({ id: item.id, name: item.particular_name || 'Unnamed Particular' }));
    positionOptions.value = extractData(posRes).map(item => ({ id: item.id, name: item.position_name || item.name }));
    qualificationOptions.value = extractData(qualRes).map(item => ({ id: item.id, name: item.qualification_name || item.name }));
    serviceCategories.value = extractData(serviceCatRes).map(item => ({ id: item.id, name: item.service_name || item.name }));

    const counselorPos = positionOptions.value.find(p => p.name?.toLowerCase().includes('counselor'));
    if (counselorPos) counselorPositionId.value = counselorPos.id; else console.warn("[fetchMasterData] Counselor position ID not found.");

    const roomInfra = infrastructureOptions.value.find(i => i.name?.toLowerCase().includes('room') || i.name?.toLowerCase().includes('office'));
    if (roomInfra) roomParticularsId.value = roomInfra.id; else console.warn("[fetchMasterData] Room/Office particulars ID not found.");
  } catch (error) {
    console.error('Error in fetchMasterData:', error);
    setMessage('Failed to load required master data. Please try refreshing.', 'error');
  }
};

const populateFromEcpfProfile = async (cid) => {
  if (!cid || typeof apiServices.getEcpfDetailsByCID !== 'function') {
    return;
  }
  try {
    const response = await apiServices.getEcpfDetailsByCID(cid);
    const profile = response?.data;
    if (profile) {
      formData.contact_no = profile.contact_no || formData.contact_no;
      formData.email_address = profile.email || formData.email_address;
      formData.office_number = profile.office_number || '';
      formData.flat_no = profile.flat_no || '';
      formData.building_no = profile.building_no || '';
      formData.location = profile.location || '';
      formData.dzongkhag_thromde_present = profile.dzongkhag_thromde || '';
      formData.gewog_throm_present = profile.gewog_throm || '';
      formData.qualification_edu = profile.qualification || '';
      formData.institute_name = profile.institute_name || '';
      formData.university_name = profile.university_name || '';
      if (profile.qualification && qualificationTypes_edu.value.length > 0) {
        const profileQualLower = profile.qualification.toLowerCase();
        let matchedTypeId = null;
        for (const qType of qualificationTypes_edu.value) {
          if (profileQualLower.includes(qType.name.toLowerCase())) {
            matchedTypeId = qType.id;
            break;
          }
        }
        formData.qualification_type_edu = matchedTypeId;
      } else {
        formData.qualification_type_edu = null;
      }
      formData.village_chiwog = profile.permanent_village || '';
      formData.gewog_perm = profile.permanent_gewog || '';
      formData.dungkhag = profile.permanent_dungkhag || '';
      formData.dzongkhag_thromde_perm = profile.permanent_dzongkhag || '';
      formData.existing_ecpf_name = profile.proposed_firm_name || profile.ecpf_name || profile.firm_name || '';
    } else {
      formData.qualification_type_edu = null;
    }
  } catch (error) {
    console.error('Error fetching/populating ECPF profile:', error);
    setMessage('Failed to load your ECPF profile data.', 'error');
    formData.qualification_type_edu = null;
  }
};

const loadDraft = async (id) => {
  if (!id) return;
  isLoading.value = true;
  clearMessage();
  const apiGetMethod = 'getEcpfBranch';
  if (typeof apiServices[apiGetMethod] !== 'function') {
    setMessage('API method to get branch draft is missing.', 'error');
    isLoading.value = false; return;
  }
  try {
    if (dzongkhagThromdes.value.length === 0 || firmTypes.value.length === 0) {
      await fetchMasterData();
    }
    const response = await apiServices[apiGetMethod](id);
    const draftData = response?.data;
    if (draftData) {
      Object.assign(formData, getInitialFormData());
      if (authStore.isAuthenticated && authStore.user) {
        formData.cid_no = authStore.user?.cid || authStore.username || draftData.applicant_cid_no || '';
        formData.applicant_name = authStore.fullName || draftData.applicants_name || '';
        formData.gender = authStore.gender || draftData.gender || '';
        formData.date_of_birth = authStore.dateOfBirth || draftData.date_of_birth || '';
      } else {
        formData.cid_no = draftData.applicant_cid_no || '';
        // ... (rest of auth fallback as before)
      }
      formData.contact_no = draftData.contact_no || '';
      formData.email_address = draftData.email || '';
      formData.office_number = draftData.office_number || '';
      formData.flat_no = draftData.flat_no || '';
      formData.building_no = draftData.building_no || '';
      formData.location = draftData.location || '';
      formData.dzongkhag_thromde_present = draftData.dzongkhag_thromde || '';
      formData.gewog_throm_present = draftData.gewog_throm || '';
      formData.qualification_edu = draftData.qualification || '';
      formData.qualification_type_edu = draftData.qualification_type_edu || null;
      formData.institute_name = draftData.institute_name || '';
      formData.university_name = draftData.university_name || '';
      formData.village_chiwog = draftData.perm_village_chiwog || '';
      formData.gewog_perm = draftData.perm_gewog || '';
      formData.dungkhag = draftData.perm_dungkhag || '';
      formData.dzongkhag_thromde_perm = draftData.perm_dzongkhag_thromde || '';
      formData.existing_ecpf_name = draftData.existing_ecpf_name || '';

      if ((!formData.village_chiwog || !formData.existing_ecpf_name) && formData.cid_no) {
        await populateFromEcpfProfile(formData.cid_no);
      }
      formData.proposed_firm_branch_name = draftData.proposed_firm_branch_name || '';
      formData.proposed_firm_address = draftData.firm_address || draftData.proposed_firm_address || '';
      formData.proposed_firm_location = draftData.firm_location || draftData.proposed_firm_location_id || null;
      formData.firm_type = draftData.type_of_firm || null;
      formData.infrastructure = (draftData.infrastructure_details || []).map(infra => ({
        particulars: infra.particulars_id, description: infra.description,
        quantity: infra.quantity, remarks: infra.remarks,
      }));

      // For HR and Applicant CV, load filenames. Base64/File objects will be null.
      // User will need to re-select if they want to change the file.
      formData.humanResources = (draftData.human_resource_details || []).map(hr => ({
        position: hr.position_id, cid: hr.cid, full_name: hr.full_name,
        qualification: hr.qualification_id, contact_number: hr.contact_number,
        email_address: hr.email,
        cv_certificates: null,
        cv_certificates_base64: null, // Do not load base64 from draft if using FormData now
        cv_filename: hr.cv_filename || null // Only filename is useful from draft
      }));
      formData.applicant_cv_file = null;
      formData.applicant_cv_base64 = null; // Do not load base64 from draft
      formData.applicant_cv_filename = draftData.applicant_cv_filename || (draftData.cv ? "previously_uploaded_cv.pdf" : null); // if 'cv' was a base64, we can't get original name easily

      formData.finance_plan_details = draftData.finance_plan_details || '';
      formData.services = (draftData.services_details || []).map(s => ({
        service_category: s.service_category_id,
        details: s.details
      }));
      formData.swot_strengths = draftData.strengths || '';
      formData.swot_weaknesses = draftData.weaknesses || '';
      formData.swot_opportunities = draftData.opportunities || '';
      formData.swot_threats = draftData.threats || '';
      formData.fee_charges = (draftData.fee_charges_details || []).map(fc => ({
        fee_breakup: fc.fee_breakup,
        description: fc.description,
        amount: fc.amount,
        total_amount: fc.total_amount,
      }));
      declarationAgreed.value = draftData.declaration || false;
      formData.isDraft = draftData.status === 'draft';
      formData.draftId = id;

      if (formData.infrastructure.length === 0) addInfrastructure();
      if (formData.humanResources.length === 0) addHumanResource();
      if (formData.services.length === 0) addService();
      if (formData.fee_charges.length === 0) addFeeCharge();
      setMessage(`Draft (ID: ${id}) loaded.`, 'success');
    } else {
      throw new Error('Draft data not found in API response.');
    }
  } catch (error) {
    console.error('Error loading draft:', error);
    setMessage(`Failed to load draft (ID: ${id}): ${error.message}. Starting new form.`, 'error');
    await resetForm(true);
  } finally {
    isLoading.value = false;
  }
};

const editDraft = () => {
  if (formData.draftId) {
    formData.isDraft = false;
    setMessage('Draft unlocked for editing and final submission.', 'success');
  }
}

const resetForm = async (fetchProfileAgain = true) => {
  const initialCid = authStore.user?.cid || authStore.username || '';
  const initialName = authStore.fullName || '';
  const initialGender = authStore.gender || '';
  const initialDob = authStore.dateOfBirth || '';
  Object.assign(formData, getInitialFormData());
  formData.cid_no = initialCid;
  formData.applicant_name = initialName;
  formData.gender = initialGender;
  formData.date_of_birth = initialDob;
  declarationAgreed.value = false;
  if (fetchProfileAgain && formData.cid_no) {
    await populateFromEcpfProfile(formData.cid_no);
  } else {
    formData.qualification_type_edu = null;
    // Clear other potentially profile-derived fields
  }
  clearMessage();
  if (formData.infrastructure.length === 0) addInfrastructure();
  if (formData.humanResources.length === 0) addHumanResource();
  if (formData.services.length === 0) addService();
  if (formData.fee_charges.length === 0) addFeeCharge();
  if (formEl.value) {
    formEl.value.querySelectorAll('input[type="file"]').forEach(input => input.value = '');
  }
};

onMounted(async () => {
  isLoading.value = true;
  clearMessage();
  await authStore.initializeAuth();
  let userCid = null;
  if (authStore.isAuthenticated && authStore.user) {
    formData.cid_no = authStore.user?.cid || authStore.username || '';
    formData.applicant_name = authStore.fullName || '';
    formData.gender = authStore.gender || '';
    formData.date_of_birth = authStore.dateOfBirth || '';
    userCid = formData.cid_no;
  } else {
    setMessage('User data not found. Please log in.', 'error');
    isLoading.value = false;
    return;
  }
  await fetchMasterData();
  const urlParams = new URLSearchParams(window.location.search);
  const draftIdFromUrl = urlParams.get('draftId');
  if (draftIdFromUrl) {
    await loadDraft(draftIdFromUrl);
  } else {
    if (userCid) {
      await populateFromEcpfProfile(userCid);
    } else {
      formData.qualification_type_edu = null;
    }
    if (formData.infrastructure.length === 0) addInfrastructure();
    if (formData.humanResources.length === 0) addHumanResource();
    if (formData.services.length === 0) addService();
    if (formData.fee_charges.length === 0) addFeeCharge();
    formData.isDraft = false;
    isLoading.value = false;
  }
});
</script>

<style scoped>
input:read-only,
input[readonly],
textarea:read-only,
textarea[readonly] {
  cursor: not-allowed;
  background-color: #f3f4f6;
  opacity: 0.7;
}

select:disabled {
  cursor: not-allowed;
  background-color: #f3f4f6;
  opacity: 0.7;
}

.form-input,
.form-textarea,
.form-select {
  @apply mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm;
}
</style>
