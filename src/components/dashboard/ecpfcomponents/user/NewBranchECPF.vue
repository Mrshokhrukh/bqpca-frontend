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
    <div
      v-if="formMessage.text"
      :class="[
        'mb-4 p-4 border rounded break-words',
        formMessage.type === 'error'
          ? 'bg-red-100 border-red-400 text-red-700'
          : 'bg-green-100 border-green-400 text-green-700',
      ]"
    >
      <p>{{ formMessage.text }}</p>
    </div>

    <!-- Form Section -->
    <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <form v-if="!isLoading" @submit.prevent="submitForm" ref="formEl">
        <!-- Personal Information (Fetched & Read Only for core details) -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Personal Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="cid_no" class="block text-sm font-medium text-gray-700">CID No:</label>
              <input
                id="cid_no"
                type="text"
                v-model="formData.cid_no"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none cursor-not-allowed"
                readonly
              />
            </div>
            <div>
              <label for="applicant_name" class="block text-sm font-medium text-gray-700"
                >Applicant's Name:</label
              >
              <input
                id="applicant_name"
                type="text"
                v-model="formData.applicant_name"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none cursor-not-allowed"
                readonly
              />
            </div>
            <div>
              <label for="gender" class="block text-sm font-medium text-gray-700">Gender:</label>
              <input
                id="gender"
                type="text"
                v-model="formData.gender"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none cursor-not-allowed"
                readonly
              />
            </div>
            <div>
              <label for="date_of_birth" class="block text-sm font-medium text-gray-700"
                >Date of Birth:</label
              >
              <input
                id="date_of_birth"
                type="text"
                :value="formatDateForDisplay(formData.date_of_birth)"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none cursor-not-allowed"
                readonly
              />
            </div>
            <div>
              <label for="contact_no" class="block text-sm font-medium text-gray-700"
                >Contact No:<span class="text-red-500">*</span></label
              >
              <input
                id="contact_no"
                type="tel"
                v-model="formData.contact_no"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label for="email_address" class="block text-sm font-medium text-gray-700"
                >Email Address:<span class="text-red-500">*</span></label
              >
              <input
                id="email_address"
                type="email"
                v-model="formData.email_address"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        <!-- Residential/Present Address (Pre-filled from Profile, Editable for some fields) -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Residential/Present Address</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="office_number" class="block text-sm font-medium text-gray-700"
                >Office Number:</label
              >
              <input
                id="office_number"
                type="text"
                v-model="formData.office_number"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label for="flat_no" class="block text-sm font-medium text-gray-700">Flat No:</label>
              <input
                id="flat_no"
                type="text"
                v-model="formData.flat_no"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label for="building_no" class="block text-sm font-medium text-gray-700"
                >Building No:</label
              >
              <input
                id="building_no"
                type="text"
                v-model="formData.building_no"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label for="location" class="block text-sm font-medium text-gray-700"
                >Location (Area/Street):<span class="text-red-500">*</span></label
              >
              <input
                id="location"
                type="text"
                v-model="formData.location"
                required
                placeholder="E.g., Changzamtog, Near Hospital"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label for="dzongkhag_thromde_present" class="block text-sm font-medium text-gray-700"
                >Dzongkhag/Thromde (Present Address):<span class="text-red-500">*</span></label
              >
              <input
                id="dzongkhag_thromde_present"
                type="text"
                v-model="formData.dzongkhag_thromde_present"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none cursor-not-allowed"
                readonly
              />
            </div>
            <div>
              <label for="gewog_throm_present" class="block text-sm font-medium text-gray-700"
                >Gewog/Throm (Present Address):<span class="text-red-500">*</span></label
              >
              <input
                id="gewog_throm_present"
                type="text"
                v-model="formData.gewog_throm_present"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none cursor-not-allowed"
                readonly
              />
            </div>
          </div>
        </section>

        <!-- Education Details (Pre-filled from Profile, Editable) -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Education Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="qualification_edu" class="block text-sm font-medium text-gray-700"
                >Qualification:<span class="text-red-500">*</span></label
              >
              <input
                id="qualification_edu"
                type="text"
                v-model="formData.qualification_edu"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label for="institute_name" class="block text-sm font-medium text-gray-700"
                >Name of Institute:<span class="text-red-500">*</span></label
              >
              <input
                id="institute_name"
                type="text"
                v-model="formData.institute_name"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label for="university_name" class="block text-sm font-medium text-gray-700"
                >Name of University:<span class="text-red-500">*</span></label
              >
              <input
                id="university_name"
                type="text"
                v-model="formData.university_name"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        <!-- Permanent Address (Fetched from Profile - Read Only) -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Permanent Address</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="village_chiwog" class="block text-sm font-medium text-gray-700"
                >Village/Chiwog:</label
              >
              <input
                id="village_chiwog"
                type="text"
                v-model="formData.village_chiwog"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none cursor-not-allowed"
                readonly
              />
            </div>
            <div>
              <label for="gewog_perm" class="block text-sm font-medium text-gray-700">Gewog:</label>
              <input
                id="gewog_perm"
                type="text"
                v-model="formData.gewog_perm"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none cursor-not-allowed"
                readonly
              />
            </div>
            <div>
              <label for="dungkhag" class="block text-sm font-medium text-gray-700"
                >Dungkhag:</label
              >
              <input
                id="dungkhag"
                type="text"
                v-model="formData.dungkhag"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none cursor-not-allowed"
                readonly
              />
            </div>
            <div>
              <label for="dzongkhag_thromde_perm" class="block text-sm font-medium text-gray-700"
                >Dzongkhag/Thromde:</label
              >
              <input
                id="dzongkhag_thromde_perm"
                type="text"
                v-model="formData.dzongkhag_thromde_perm"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none cursor-not-allowed"
                readonly
              />
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
              <label for="existing_ecpf_name" class="block text-sm font-medium text-gray-700"
                >Name of the Existing ECPF:</label
              >
              <input
                id="existing_ecpf_name"
                type="text"
                v-model="formData.existing_ecpf_name"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none cursor-not-allowed"
                readonly
              />
            </div>
            <div>
              <label for="proposed_firm_address" class="block text-sm font-medium text-gray-700"
                >Address of the Proposed Branch:<span class="text-red-500">*</span></label
              >
              <input
                id="proposed_firm_address"
                type="text"
                v-model="formData.proposed_firm_address"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label for="proposed_firm_location" class="block text-sm font-medium text-gray-700"
                >Location (Dzongkhag/Thromde) of Proposed Branch:<span class="text-red-500"
                  >*</span
                ></label
              >
              <select
                id="proposed_firm_location"
                v-model="formData.proposed_firm_location"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option disabled :value="null">-- Select Dzongkhag/Thromde --</option>
                <option v-for="loc in dzongkhagThromdes" :key="loc.id" :value="loc.id">
                  {{ loc.name }}
                </option>
              </select>
            </div>
            <div>
              <label for="firm_type" class="block text-sm font-medium text-gray-700"
                >Type of Firm (for New Branch):<span class="text-red-500">*</span></label
              >
              <select
                id="firm_type"
                v-model="formData.firm_type"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
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
            Infrastructure (for New Branch)<span class="text-red-500">*</span>
          </h2>
          <p class="text-sm text-gray-500 mb-4">
            Add details of the infrastructure available at the proposed branch.
          </p>
          <div v-if="formData.infrastructure.length === 0" class="text-gray-500 italic mb-4">
            No infrastructure details added yet. Click 'Add More' to start.
          </div>
          <div
            v-for="(infra, index) in formData.infrastructure"
            :key="`infra-${index}`"
            class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded-md relative"
          >
            <button
              type="button"
              @click="removeInfrastructure(index)"
              title="Remove Infrastructure Item"
              class="absolute -top-2 -right-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-full p-1 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div>
              <label :for="`particulars_${index}`" class="block text-sm font-medium text-gray-700"
                >Particulars:<span class="text-red-500">*</span></label
              >
              <select
                :id="`particulars_${index}`"
                v-model="infra.particular_name"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option disabled :value="null">-- Select Item --</option>
                <option v-for="item in infrastructureOptions" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>
            <div>
              <label :for="`description_${index}`" class="block text-sm font-medium text-gray-700"
                >Description:<span class="text-red-500">*</span></label
              >
              <input
                :id="`description_${index}`"
                type="text"
                v-model="infra.description"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label :for="`quantity_${index}`" class="block text-sm font-medium text-gray-700"
                >Quantity:<span class="text-red-500">*</span></label
              >
              <input
                :id="`quantity_${index}`"
                type="number"
                min="1"
                v-model.number="infra.quantity"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label :for="`remarks_${index}`" class="block text-sm font-medium text-gray-700"
                >Remarks:</label
              >
              <input
                :id="`remarks_${index}`"
                type="text"
                v-model="infra.remarks"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <button
            type="button"
            @click="addInfrastructure"
            class="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 inline-block mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            Add Infrastructure
          </button>
        </section>

        <!-- Human Resource -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">
            Human Resource (for New Branch)<span class="text-red-500">*</span>
          </h2>
          <p class="text-sm text-gray-500 mb-4">
            Add details of the staff proposed for the branch. At least one Counselor is required.
          </p>
          <div v-if="formData.humanResources.length === 0" class="text-gray-500 italic mb-4">
            No human resource details added yet. Click 'Add More' to start.
          </div>
          <div
            v-for="(hr, index) in formData.humanResources"
            :key="`hr-${index}`"
            class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded-md relative"
          >
            <button
              type="button"
              @click="removeHumanResource(index)"
              title="Remove Human Resource Item"
              class="absolute -top-2 -right-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-full p-1 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div>
              <label :for="`position_${index}`" class="block text-sm font-medium text-gray-700"
                >Position:<span class="text-red-500">*</span></label
              >
              <select
                :id="`position_${index}`"
                v-model="hr.position"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option disabled :value="null">-- Select Position --</option>
                <option v-for="pos in positionOptions" :key="pos.id" :value="pos.id">
                  {{ pos.name }}
                </option>
              </select>
            </div>
            <div>
              <label :for="`cid_hr_${index}`" class="block text-sm font-medium text-gray-700"
                >CID:<span class="text-red-500">*</span></label
              >
              <input
                :id="`cid_hr_${index}`"
                type="text"
                v-model="hr.cid"
                required
                pattern="\d{11}"
                title="Enter 11 digit CID"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label :for="`full_name_${index}`" class="block text-sm font-medium text-gray-700"
                >Full Name:<span class="text-red-500">*</span></label
              >
              <input
                :id="`full_name_${index}`"
                type="text"
                v-model="hr.full_name"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                :for="`qualification_hr_${index}`"
                class="block text-sm font-medium text-gray-700"
                >Qualification:<span class="text-red-500">*</span></label
              >
              <select
                :id="`qualification_hr_${index}`"
                v-model="hr.qualification"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option disabled :value="null">-- Select Qualification --</option>
                <option v-for="qual in qualificationOptions" :key="qual.id" :value="qual.id">
                  {{ qual.name }}
                </option>
              </select>
            </div>
            <div>
              <label
                :for="`contact_number_${index}`"
                class="block text-sm font-medium text-gray-700"
                >Contact Number:<span class="text-red-500">*</span></label
              >
              <input
                :id="`contact_number_${index}`"
                type="tel"
                v-model="hr.contact_number"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                :for="`email_address_hr_${index}`"
                class="block text-sm font-medium text-gray-700"
                >Email Address:<span class="text-red-500">*</span></label
              >
              <input
                :id="`email_address_hr_${index}`"
                type="email"
                v-model="hr.email_address"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div class="md:col-span-2">
              <label
                :for="`cv_certificates_${index}`"
                class="block text-sm font-medium text-gray-700"
                >CV & Certificates:<span class="text-red-500">*</span></label
              >
              <input
                :id="`cv_certificates_${index}`"
                type="file"
                :required="!getHrFileState(index).hasExistingFile"
                accept=".pdf,.doc,.docx,.jpg,.png"
                @change="handleFileUpload($event, 'humanResources', index, 'cv_certificates')"
                class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              <span v-if="getHrFileState(index).fileName" class="text-xs text-gray-600 mt-1 block">
                Selected: {{ getHrFileState(index).fileName }}
                <button
                  v-if="getHrFileState(index).hasExistingFile"
                  type="button"
                  @click="clearHrFile(index)"
                  class="ml-2 text-red-500 text-xs hover:underline"
                >
                  (Replace)
                </button>
              </span>
              <span
                v-else-if="getHrFileState(index).hasExistingFile"
                class="text-xs text-gray-500 mt-1 block"
              >
                Previously uploaded file exists. Upload new to replace.
              </span>
            </div>
          </div>
          <button
            type="button"
            @click="addHumanResource"
            class="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 inline-block mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            Add Human Resource
          </button>
        </section>

        <!-- Declaration -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">
            Declaration<span class="text-red-500">*</span>
          </h2>
          <div class="flex items-start space-x-3">
            <input
              type="checkbox"
              id="declaration_agree"
              v-model="declarationAgreed"
              required
              class="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label for="declaration_agree" class="text-sm text-gray-700">
              I hereby declare that the information provided is true and correct to the best of my
              knowledge and agree to the terms and conditions.
            </label>
          </div>
        </section>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4 mt-10 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="saveAsDraft"
            :disabled="isSubmitting"
            class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Saving...' : 'Save as Draft' }}
          </button>
          <button
            type="submit"
            :disabled="!declarationAgreed || isSubmitting || formData.isDraft"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
          </button>
          <button
            type="button"
            @click="editDraft"
            v-if="formData.isDraft"
            :disabled="isSubmitting"
            class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
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
import { ref, reactive, onMounted, } from 'vue'
import apiServices from '@/services/services' // Ensure this path is correct
import { useAuthStore } from '@/stores/authStore' // Ensure this path is correct
import { bhutanDzongkhagsGewogs } from '@/constants/dzongkhags.js' // Ensure this path is correct

// --- Store Instance ---
const authStore = useAuthStore()

// --- State ---
const isLoading = ref(true)
const isSubmitting = ref(false)
const formMessage = reactive({ text: '', type: '' })
const formEl = ref(null)
const declarationAgreed = ref(false)
const counselorPositionId = ref(null)
const roomParticularsId = ref(null)

// --- Form Data ---
const getInitialFormData = () => ({
  // Auto-populated from store/API
  cid_no: '',
  applicant_name: '',
  gender: '',
  date_of_birth: '',
  contact_no: '',
  email_address: '',
  office_number: '',
  flat_no: '',
  building_no: '',
  location: '',
  dzongkhag_thromde_present: '', // For Present Address (Text Input)
  gewog_throm_present: '',       // For Present Address (Text Input)
  qualification_edu: '',
  institute_name: '',
  university_name: '',
  village_chiwog: '',
  gewog_perm: '',
  dungkhag: '',
  dzongkhag_thromde_perm: '',
  existing_ecpf_name: '',
  proposed_firm_address: '',
  proposed_firm_location: null, // For Proposed Branch (Dropdown - ID)
  firm_type: null,
  infrastructure: [],
  humanResources: [],
  isDraft: false,
  draftId: null,
  declaration_agreed: false,
})

const formData = reactive(getInitialFormData())

// --- Master Data (Dzongkhags still needed for Proposed Branch Location dropdown) ---
const dzongkhagThromdes = ref([])
// allGewogThroms is no longer needed for a dependent dropdown for present address
const firmTypes = ref([])
const infrastructureOptions = ref([])
const positionOptions = ref([])
const qualificationOptions = ref([])

// --- Helper Functions ---
const formatDateForDisplay = (dateString) => {
  if (!dateString) return ''
  try {
    return dateString.split('T')[0]
  } catch (e) {
    console.error('Error formatting date:', e)
    return dateString
  }
}

const getHrFileState = (index) => {
  const hrItem = formData.humanResources[index];
  if (!hrItem) return { fileName: '', hasExistingFile: false };
  const file = hrItem.cv_certificates;
  const existingFileName = hrItem.cv_filename;

  if (file instanceof File) {
    return { fileName: file.name, hasExistingFile: false };
  }
  if (existingFileName) {
     return { fileName: existingFileName, hasExistingFile: true };
  }
  return { fileName: '', hasExistingFile: false };
};

const clearHrFile = (index) => {
  if (formData.humanResources[index]) {
    formData.humanResources[index].cv_certificates = null;
    formData.humanResources[index].cv_certificates_base64 = null;
    formData.humanResources[index].cv_filename = null;
    const fileInput = formEl.value?.querySelector(`#cv_certificates_${index}`);
    if (fileInput) fileInput.value = '';
  }
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

// --- Computed Property and Watcher for Present Address Dzongkhag/Gewog are REMOVED ---

// --- Add/Remove Dynamic Sections (No change here) ---
const addInfrastructure = () => {
  formData.infrastructure.push({ particulars: null, description: '', quantity: 1, remarks: '' })
}
const removeInfrastructure = (index) => {
  formData.infrastructure.splice(index, 1)
}
const addHumanResource = () => {
  formData.humanResources.push({
    position: null, cid: '', full_name: '', qualification: null,
    contact_number: '', email_address: '', cv_certificates: null, cv_certificates_base64: null, cv_filename: null
  })
}
const removeHumanResource = (index) => {
  formData.humanResources.splice(index, 1)
}

// --- File Upload Handler (No change here) ---
const handleFileUpload = (event, sectionName, index, fileKey) => {
  const file = event.target.files[0]
  if (file && sectionName === 'humanResources') {
    formData.humanResources[index][fileKey] = file
    formData.humanResources[index].cv_certificates_base64 = null;
    formData.humanResources[index].cv_filename = file.name;
  }
}

// --- Base64 Conversion (No change here) ---
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    if (!file) {
      resolve(null); return;
    }
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

// --- Data Preparation ---
const prepareDataForSubmission = async (status = 'submitted') => {
  const data = JSON.parse(JSON.stringify(formData))
  delete data.isDraft

  if (data.humanResources && Array.isArray(data.humanResources)) {
    for (const hr of data.humanResources) {
      if (hr.cv_certificates instanceof File) {
        hr.cv_certificates_base64 = await toBase64(hr.cv_certificates)
      }
      delete hr.cv_certificates
    }
  }

  data.status = status
  data.declaration_agreed = declarationAgreed.value

  const submissionPayload = {
    applicant_cid: data.cid_no,
    applicants_name: data.applicant_name,
    gender: data.gender,
    date_of_birth: data.date_of_birth,
    contact_no: data.contact_no,
    email: data.email_address,
    office_number: data.office_number,
    flat_no: data.flat_no,
    building_no: data.building_no,
    location: data.location,
    // For Present Address, send the string values directly as per ECPF profile example
    gewog_throm: data.gewog_throm_present,
    dzongkhag_thromde: data.dzongkhag_thromde_present,
    qualification: data.qualification_edu,
    institute_name: data.institute_name,
    university_name: data.university_name,
    // Branch specific details
    proposed_firm_address: data.proposed_firm_address,
    proposed_firm_location_id: data.proposed_firm_location, // This is the ID from dropdown
    type_of_firm: data.firm_type,
    infrastructure_details: data.infrastructure.map((infra) => ({
      particulars_id: infra.particulars,
      description: infra.description,
      quantity: infra.quantity,
      remarks: infra.remarks,
    })),
    human_resource_details: data.humanResources.map((hr) => ({
      position_id: hr.position,
      cid: hr.cid,
      full_name: hr.full_name,
      qualification_id: hr.qualification,
      contact_number: hr.contact_number,
      email: hr.email_address,
      cv_certificates_base64: hr.cv_certificates_base64 || null,
      cv_filename: hr.cv_filename || null,
    })),
    status: data.status,
    declaration: data.declaration_agreed,
    draft_id: data.draftId || null,
    // Include permanent address fields if your API expects them in this payload
    // permanent_village: data.village_chiwog,
    // permanent_gewog: data.gewog_perm,
    // permanent_dungkhag: data.dungkhag,
    // permanent_dzongkhag: data.dzongkhag_thromde_perm,
  }
  return submissionPayload
}

// --- Form Validation ---
const validateForm = () => {
  clearMessage();
  let isValid = true;
  const errors = [];

  if (!formData.contact_no) errors.push('Contact Number is required.');
  if (!formData.email_address || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_address)) {
    errors.push('Please enter a valid personal Email Address.');
  }
  if (!formData.location) errors.push('Location (Area/Street) for present address is required.');
  if (!formData.dzongkhag_thromde_present) errors.push('Dzongkhag/Thromde for present address is required (auto-populated).');
  if (!formData.gewog_throm_present) errors.push('Gewog/Throm for present address is required (auto-populated).');


  if (!formData.qualification_edu) errors.push('Education Qualification is required.');
  if (!formData.institute_name) errors.push('Institute Name is required.');
  if (!formData.university_name) errors.push('University Name is required.');

  if (!formData.proposed_firm_address) errors.push('Proposed Branch Address is required.');
  if (formData.proposed_firm_location === null) errors.push('Proposed Branch Location (Dzongkhag/Thromde) is required.');
  if (formData.firm_type === null) errors.push('Type of Firm for the New Branch is required.');

  if (formData.infrastructure.length === 0) {
    errors.push('At least one infrastructure item must be added for the new branch.');
  } else {
    for (let i = 0; i < formData.infrastructure.length; i++) {
      const infra = formData.infrastructure[i];
      if (infra.particulars === null || !infra.description || infra.quantity === null || infra.quantity < 1) {
        errors.push(`Complete required fields (Particulars, Description, Quantity >= 1) for Infrastructure item #${i + 1}.`);
        isValid = false; break;
      }
    }
  }

  if (formData.humanResources.length === 0) {
    errors.push('At least one human resource item must be added for the new branch.');
  } else {
    let hasCounselor = false;
    const counselorCids = new Set();
    for (let i = 0; i < formData.humanResources.length; i++) {
      const hr = formData.humanResources[i]; const itemNum = i + 1;
      if (!hr.position || !hr.cid || !hr.full_name || !hr.qualification || !hr.contact_number || !hr.email_address) {
        errors.push(`Complete all required fields for Human Resource item #${itemNum}.`); isValid = false; break;
      }
      if (!/^\d{11}$/.test(hr.cid)) errors.push(`Invalid CID for HR item #${itemNum}.`);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(hr.email_address)) errors.push(`Invalid Email for HR item #${itemNum}.`);

      const fileState = getHrFileState(i);
      if (!fileState.fileName && !fileState.hasExistingFile) {
         errors.push(`CV & Certificates file is required for Human Resource item #${itemNum}.`);
      }

      if (counselorPositionId.value && hr.position === counselorPositionId.value) {
        hasCounselor = true;
        if (counselorCids.has(hr.cid)) {
          errors.push(`Duplicate Counselor CID: ${hr.cid}. Each counselor must have a unique CID.`);
        } else {
          counselorCids.add(hr.cid);
        }
      }
    }
    if (counselorPositionId.value && !hasCounselor && formData.humanResources.length > 0) {
      errors.push('At least one Counselor must be added to Human Resources for the new branch.');
    }
  }

  if (!declarationAgreed.value) errors.push('You must agree to the declaration to submit.');

  if (errors.length > 0) {
    setMessage(`Please fix the following errors:\n- ${errors.join('\n- ')}`);
    isValid = false;
  }
  return isValid;
}


// --- API Interaction ---
/** Fetch Master Data for Dropdowns */
const fetchMasterData = async () => {
  try {
    console.log('Fetching/loading master data...')

    // 1. Dzongkhags from Constant (still needed for proposed branch location)
    const dzongkhagsData = [];
    let dzongkhagIdCounter = 1;

    // Only process dzongkhags for the dropdown
    bhutanDzongkhagsGewogs.forEach(item => {
      dzongkhagsData.push({
        id: dzongkhagIdCounter++,
        name: item.dzongkhag
      });
    });
    dzongkhagThromdes.value = dzongkhagsData;

    if (dzongkhagThromdes.value.length === 0) console.warn('Dzongkhag master data for dropdown is empty after loading from constant.');
    console.log(`Loaded ${dzongkhagThromdes.value.length} Dzongkhags for dropdown from constant.`);

    // 2. Fetch other masters from API
    const apiCalls = [
      apiServices.getMastersTypesOfFirm ? apiServices.getMastersTypesOfFirm() : Promise.resolve({ data: { results: [] } }),
      apiServices.getMastersInfrastructures ? apiServices.getMastersInfrastructures() : Promise.resolve({ data: { results: [] } }),
      apiServices.getMastersPositions ? apiServices.getMastersPositions() : Promise.resolve({ data: { results: [] } }),
      apiServices.getMastersEcpfQualifications ? apiServices.getMastersEcpfQualifications() : Promise.resolve({ data: { results: [] } }),
    ]
    const [firmTypeRes, infraRes, posRes, qualRes] = await Promise.all(apiCalls);

    const extractData = (response) => response?.data?.results || response?.data || [];

    firmTypes.value = extractData(firmTypeRes).map(item => ({ id: item.id, name: item.type_of_firm || item.name }));
    infrastructureOptions.value = extractData(infraRes).map(item => ({ id: item.id, name: item.particular_name  || 'Unnamed Particular' }));
    positionOptions.value = extractData(posRes).map(item => ({ id: item.id, name: item.position_name || item.name }));
    qualificationOptions.value = extractData(qualRes).map(item => ({ id: item.id, name: item.qualification_name || item.name }));

    const counselorPos = positionOptions.value.find(p => p.name?.toLowerCase().includes('counselor'));
    if (counselorPos) counselorPositionId.value = counselorPos.id; else console.warn("Counselor position ID not found in master data.");
    const roomInfra = infrastructureOptions.value.find(i => i.name?.toLowerCase().includes('room'));
    if (roomInfra) roomParticularsId.value = roomInfra.id; else console.warn("Room particulars ID not found in master data.");

    console.log('Master data fetching/loading completed.');
  } catch (error) {
    console.error('Error in fetchMasterData:', error);
    setMessage('Failed to load required master data. Please try refreshing.', 'error');
  }
};

/** Fetch and populate ECPF Profile data */
const populateFromEcpfProfile = async (cid) => {
  if (!cid || typeof apiServices.getEcpfDetailsByCID !== 'function') {
    console.warn('CID missing or getEcpfDetailsByCID service not defined.');
    return;
  }
  try {
    console.log(`Fetching ECPF profile for CID: ${cid}...`);
    const response = await apiServices.getEcpfDetailsByCID(cid);
    const profile = response?.data; // Assuming response.data is the object like your example

    if (profile) {
      console.log('ECPF Profile data received:', profile);
      formData.contact_no = profile.contact_no || formData.contact_no;
      formData.email_address = profile.email || formData.email_address; // API key is 'email'
      formData.date_of_birth = profile.date_of_birth || formData.date_of_birth;
      formData.office_number = profile.office_number || '';
      formData.flat_no = profile.flat_no || '';
      formData.building_no = profile.building_no || '';
      formData.location = profile.location || ''; // Present address location

      // For Present Address Dzongkhag/Gewog, directly use the string values from profile
      formData.dzongkhag_thromde_present = profile.dzongkhag_thromde || ''; // API key is 'dzongkhag_thromde'
      formData.gewog_throm_present = profile.gewog_throm || '';           // API key is 'gewog_throm'
      console.log(`Set Present Address Dzongkhag: ${formData.dzongkhag_thromde_present}, Gewog: ${formData.gewog_throm_present}`);


      formData.qualification_edu = profile.qualification || '';
      formData.institute_name = profile.institute_name || '';
      formData.university_name = profile.university_name || '';
      formData.village_chiwog = profile.permanent_village || '';
      formData.gewog_perm = profile.permanent_gewog || '';
      formData.dungkhag = profile.permanent_dungkhag || '';
      formData.dzongkhag_thromde_perm = profile.permanent_dzongkhag || '';
      formData.existing_ecpf_name = profile.proposed_firm_name || ''; // Name of the main ECPF

      console.log('FormData populated from ECPF profile.');
    } else {
      console.log('No ECPF profile data found for CID.');
      // Potentially set default values or show a message if profile data is crucial and missing
      formData.dzongkhag_thromde_present = ''; // Ensure fields are cleared if no profile data
      formData.gewog_throm_present = '';
    }
  } catch (error) {
    console.error('Error fetching/populating ECPF profile:', error);
    setMessage('Failed to load your ECPF profile data.', 'error');
    // Clear fields if error occurs to avoid stale data
    formData.dzongkhag_thromde_present = '';
    formData.gewog_throm_present = '';
  }
};

/** Submit the form data */
const submitForm = async () => {
  if (!validateForm()) return
  isSubmitting.value = true
  clearMessage()
  console.log('Submitting branch application...')
  try {
    const dataToSubmit = await prepareDataForSubmission('submitted')
    console.log('Data to submit:', JSON.stringify(dataToSubmit, null, 2));

    let response
    const apiCreateMethod = 'createEcpfBranch'; // Replace with your actual API method name
    const apiUpdateMethod = 'updateEcpfBranch'; // Replace with your actual API method name

    if (formData.draftId && typeof apiServices[apiUpdateMethod] === 'function') {
      response = await apiServices[apiUpdateMethod](formData.draftId, dataToSubmit)
    } else if (typeof apiServices[apiCreateMethod] === 'function') {
      response = await apiServices[apiCreateMethod](dataToSubmit)
    } else {
      console.error(`API methods for submission not found. Checked for ${apiCreateMethod} and ${apiUpdateMethod}.`);
      throw new Error(`Required API method for submission not found.`);
    }

    if (response?.status === 200 || response?.status === 201) {
      setMessage('Branch application submitted successfully!', 'success')
      resetForm()
    } else {
      const errorDetail = response?.data?.detail || response?.data || `Submission failed: ${response?.status || 'Unknown'}`;
      throw new Error(JSON.stringify(errorDetail));
    }
  } catch (error) {
    console.error('Error submitting branch form:', error)
    const errorMsg = error.response?.data?.detail || error.message || 'Submission failed.'
    setMessage(`Error: ${errorMsg}`, 'error')
  } finally {
    isSubmitting.value = false
  }
}

/** Save the form data as a draft */
const saveAsDraft = async () => {
  isSubmitting.value = true;
  clearMessage();
  console.log('Saving branch application as draft...');
  try {
    const dataToSubmit = await prepareDataForSubmission('draft');
    console.log('Data to save as draft:', JSON.stringify(dataToSubmit, null, 2));
    let response;

    const apiCreateDraftMethod = 'createEcpfBranch'; // Or a specific draft creation endpoint
    const apiUpdateDraftMethod = 'updateEcpfBranch'; // Or a specific draft update endpoint

    if (formData.draftId && typeof apiServices[apiUpdateDraftMethod] === 'function') {
        response = await apiServices[apiUpdateDraftMethod](formData.draftId, dataToSubmit);
    } else if (typeof apiServices[apiCreateDraftMethod] === 'function') {
        response = await apiServices[apiCreateDraftMethod](dataToSubmit);
    } else {
        console.error(`API methods for saving draft not found. Checked for ${apiCreateDraftMethod} and ${apiUpdateDraftMethod}.`);
        throw new Error(`Required API method for saving draft not found.`);
    }

    if (response?.status === 200 || response?.status === 201) {
      const draftId = response.data?.id || formData.draftId;
      if (draftId) {
         formData.draftId = draftId;
         formData.isDraft = true;
         setMessage(`Branch application saved as draft. (Draft ID: ${draftId})`, 'success');
      } else {
         setMessage('Draft saved, but could not retrieve Draft ID.', 'success');
      }
    } else {
      const errorDetail = response?.data?.detail || response?.data || `Draft save failed: ${response?.status || 'Unknown'}`;
      throw new Error(JSON.stringify(errorDetail));
    }
  } catch (error) {
    console.error('Error saving branch draft:', error);
    const errorMsg = error.response?.data?.detail || error.message || 'Draft save failed.';
    setMessage(`Error: ${errorMsg}`, 'error');
  } finally {
    isSubmitting.value = false;
  }
};

/** Load draft data from API */
const loadDraft = async (id) => {
    if (!id) return;
    isLoading.value = true;
    clearMessage();
    console.log(`Loading branch draft with ID: ${id}...`);

    const apiGetMethod = 'getEcpfBranch'; // Replace with your actual API method name

    if (typeof apiServices[apiGetMethod] !== 'function') {
        setMessage('API method to get branch draft is missing.', 'error');
        isLoading.value = false; return;
    }

    try {
        // Ensure master data for dropdowns is loaded
        if (dzongkhagThromdes.value.length === 0 || firmTypes.value.length === 0 ||
            infrastructureOptions.value.length === 0 || positionOptions.value.length === 0 ||
            qualificationOptions.value.length === 0) {
             console.log("Master data for dropdowns not fully ready, fetching before loading draft...");
             await fetchMasterData();
        }

        const response = await apiServices[apiGetMethod](id);
        const draftData = response?.data; // Assuming response.data is the object like your ECPF profile example

        if (draftData) {
            console.log('Loaded draft data:', draftData);

            const freshForm = getInitialFormData();
            Object.assign(formData, freshForm); // Reset form before populating

            // Populate from Auth first (core identity)
            if (authStore.isAuthenticated && authStore.user) {
                formData.cid_no = authStore.user?.cid || authStore.username || draftData.applicant_cid || '';
                formData.applicant_name = authStore.fullName || draftData.applicants_name || '';
                formData.gender = authStore.gender || draftData.gender || '';
                // date_of_birth is typically static from profile, but draft might override
            }

            // Overwrite/Populate with Draft Data
            formData.cid_no = draftData.applicant_cid || draftData.cid_no; // Key from your example is 'cid_no'
            formData.applicant_name = draftData.applicants_name || formData.applicant_name;
            formData.gender = draftData.gender || formData.gender;
            formData.date_of_birth = draftData.date_of_birth || formData.date_of_birth;
            formData.contact_no = draftData.contact_no || '';
            formData.email_address = draftData.email || ''; // Key from your example is 'email'

            formData.office_number = draftData.office_number || '';
            formData.flat_no = draftData.flat_no || '';
            formData.building_no = draftData.building_no || '';
            formData.location = draftData.location || ''; // Present address location

            // Present Address Dzongkhag/Gewog (Text Inputs)
            formData.dzongkhag_thromde_present = draftData.dzongkhag_thromde || ''; // Key from your example
            formData.gewog_throm_present = draftData.gewog_throm || '';           // Key from your example


            formData.qualification_edu = draftData.qualification || ''; // Key from your example
            formData.institute_name = draftData.institute_name || '';
            formData.university_name = draftData.university_name || '';

            // Permanent address details
            formData.village_chiwog = draftData.permanent_village || '';
            formData.gewog_perm = draftData.permanent_gewog || '';
            formData.dungkhag = draftData.permanent_dungkhag || '';
            formData.dzongkhag_thromde_perm = draftData.permanent_dzongkhag || '';

            formData.existing_ecpf_name = draftData.proposed_firm_name || ''; // Key from your example

            // Branch specific details
            formData.proposed_firm_address = draftData.firm_address || ''; // Key from your example for branch address
            // For proposed_firm_location, if draft sends name ('firm_location' from your example), map to ID
            if (draftData.firm_location_id) { // Prefer ID if available
                formData.proposed_firm_location = draftData.firm_location_id;
            } else if (draftData.firm_location && dzongkhagThromdes.value.length > 0) {
                const matchedDzongkhag = dzongkhagThromdes.value.find(d => d.name === draftData.firm_location);
                formData.proposed_firm_location = matchedDzongkhag ? matchedDzongkhag.id : null;
            } else {
                formData.proposed_firm_location = null;
            }
            formData.firm_type = draftData.type_of_firm || null; // Assuming API sends ID for this

            formData.infrastructure = (draftData.infrastructure_details || []).map(infra => ({
                particulars: infra.particulars_id, description: infra.description,
                quantity: infra.quantity, remarks: infra.remarks,
            }));
            formData.humanResources = (draftData.human_resource_details || []).map(hr => ({
                position: hr.position_id, cid: hr.cid, full_name: hr.full_name,
                qualification: hr.qualification_id, contact_number: hr.contact_number,
                email_address: hr.email, cv_certificates: null,
                cv_certificates_base64: hr.cv_certificates_base64 || null,
                cv_filename: hr.cv_filename || (hr.cv_certificates_base64 ? 'Previously uploaded file' : null)
            }));

            declarationAgreed.value = draftData.declaration || false;
            // Adjust 'is_draft' based on your API's field that indicates a draft status
            formData.isDraft = draftData.is_draft === true || draftData.status === 'draft';
            formData.draftId = id;

            // Ensure dynamic sections have at least one item for UI consistency
            if (formData.infrastructure.length === 0) addInfrastructure();
            if (formData.humanResources.length === 0) addHumanResource();

            setMessage(`Draft (ID: ${id}) loaded. ${formData.isDraft ? 'Status: Draft.' : ''}`, 'success');
        } else {
            throw new Error('Draft data not found in API response.');
        }
    } catch (error) {
        console.error('Error loading draft:', error);
        setMessage(`Failed to load draft (ID: ${id}): ${error.message}. Starting new form.`, 'error');
        resetForm(); // Reset to a clean state if draft loading fails
    } finally {
        isLoading.value = false;
    }
};

/** Allow editing of a loaded draft */
const editDraft = () => {
  if (formData.draftId) {
    formData.isDraft = false // Unlock the form for submission
    setMessage('Draft unlocked for editing and final submission.', 'success')
  }
}

/** Reset form to initial state, preserving auth & ECPF profile info */
const resetForm = async () => {
  // Preserve data that is auto-populated and shouldn't be cleared by a typical reset
  const preservedData = {
    cid_no: formData.cid_no,
    applicant_name: formData.applicant_name,
    gender: formData.gender,
    date_of_birth: formData.date_of_birth,
    // ECPF Profile specific (present address, education, permanent address, existing ECPF name)
    contact_no: formData.contact_no,
    email_address: formData.email_address,
    office_number: formData.office_number,
    flat_no: formData.flat_no,
    building_no: formData.building_no,
    location: formData.location,
    // Preserve the present address text fields
    dzongkhag_thromde_present: formData.dzongkhag_thromde_present,
    gewog_throm_present: formData.gewog_throm_present,
    qualification_edu: formData.qualification_edu,
    institute_name: formData.institute_name,
    university_name: formData.university_name,
    village_chiwog: formData.village_chiwog,
    gewog_perm: formData.gewog_perm,
    dungkhag: formData.dungkhag,
    dzongkhag_thromde_perm: formData.dzongkhag_thromde_perm,
    existing_ecpf_name: formData.existing_ecpf_name,
  };

  Object.assign(formData, getInitialFormData()); // Reset all fields to their initial empty/null state

  // Re-apply the preserved data
  Object.assign(formData, preservedData);

  declarationAgreed.value = false;
  formData.draftId = null; // Clear draft ID on full reset
  formData.isDraft = false; // Not a draft anymore
  clearMessage();

  // Ensure dynamic sections have at least one item for UI
  if (formData.infrastructure.length === 0) addInfrastructure();
  if (formData.humanResources.length === 0) addHumanResource();

  // Clear file input fields visually
  if (formEl.value) {
    formEl.value.querySelectorAll('input[type="file"]').forEach(input => input.value = '');
  }
  console.log('Form reset. Auto-populated details preserved.');
};

// --- Lifecycle Hook ---
onMounted(async () => {
  isLoading.value = true;
  clearMessage();
  authStore.initializeAuth(); // Make sure auth state is fresh

  let userCid = null;

  // 1. Populate from Auth Store (basic identity)
  if (authStore.isAuthenticated && authStore.user) {
    formData.cid_no = authStore.user?.cid || authStore.username || '';
    formData.applicant_name = authStore.fullName || '';
    formData.gender = authStore.gender || '';
    formData.date_of_birth = authStore.dateOfBirth || '';
    userCid = formData.cid_no;
    console.log('Populated initial user details from auth store.');
  } else {
    setMessage('User data not found. Please log in.', 'error');
    isLoading.value = false; return; // Stop if no user
  }

  // 2. Fetch Master Data (Dzongkhags for proposed branch dropdown, and other masters)
  await fetchMasterData();
  console.log('Master data fetching completed in onMounted.');

  // 3. Populate from ECPF Profile (more detailed personal info, including present address text fields)
  if (userCid) {
    await populateFromEcpfProfile(userCid);
    console.log('ECPF Profile population attempt completed in onMounted.');
  } else {
    console.warn('CID not available, cannot fetch ECPF profile.');
  }

  // 4. Initialize dynamic form sections if they are empty
  if (formData.infrastructure.length === 0) addInfrastructure();
  if (formData.humanResources.length === 0) addHumanResource();

  // 5. Check for and Load Draft if draftId is in URL
  const urlParams = new URLSearchParams(window.location.search);
  const draftIdFromUrl = urlParams.get('draftId');
  if (draftIdFromUrl) {
    console.log(`Draft ID found in URL: ${draftIdFromUrl}. Loading draft...`);
    await loadDraft(draftIdFromUrl); // loadDraft handles setting isLoading = false
  } else {
    formData.isDraft = false; // Ensure it's not marked as draft if no draftId
    isLoading.value = false;
  }
  console.log('onMounted completed.');
});
</script>

<style scoped>
input:read-only,
input[readonly],
textarea:read-only,
textarea[readonly] {
  cursor: not-allowed;
  background-color: #f3f4f6; /* bg-gray-100 */
  opacity: 0.7;
}
select:disabled {
  cursor: not-allowed;
  background-color: #f3f4f6; /* bg-gray-100 */
  opacity: 0.7;
}
</style>