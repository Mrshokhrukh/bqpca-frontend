<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Branch ECPF Establishment</h1>
      <p class="text-gray-600">Please fill in the details below for branch ECPF establishment.</p>
    </div>

    <!-- Loading/Error/Success Messages -->
    <div v-if="isLoading" class="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
        <p>Loading initial data...</p>
    </div>
    <div v-if="formMessage.text" :class="['mb-4 p-4 border rounded break-words', formMessage.type === 'error' ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700']">
        <p>{{ formMessage.text }}</p>
    </div>

    <!-- Form Section -->
    <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
       <form v-if="!isLoading" @submit.prevent="submitForm" ref="formEl">
        <!-- Personal Information (Fetched from Auth Store) -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Personal Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="cid_no" class="block text-sm font-medium text-gray-700">CID No:</label>
              <input id="cid_no" type="text" v-model="formData.cid_no"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed"
                readonly>
            </div>
            <div>
              <label for="applicant_name" class="block text-sm font-medium text-gray-700">Applicant's Name:</label>
              <input id="applicant_name" type="text" v-model="formData.applicant_name"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed"
                readonly>
            </div>
            <div>
              <label for="gender" class="block text-sm font-medium text-gray-700">Gender:</label>
              <input id="gender" type="text" v-model="formData.gender"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed"
                readonly>
            </div>
            <div>
              <label for="date_of_birth" class="block text-sm font-medium text-gray-700">Date of Birth:</label>
              <input id="date_of_birth" type="text" v-model="formData.date_of_birth"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed"
                readonly>
            </div>
            <div>
              <label for="contact_no" class="block text-sm font-medium text-gray-700">Contact No:<span class="text-red-500">*</span></label>
              <input id="contact_no" type="tel" v-model="formData.contact_no" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="email_address" class="block text-sm font-medium text-gray-700">Email Address:<span class="text-red-500">*</span></label>
              <input id="email_address" type="email" v-model="formData.email_address" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
          </div>
        </section>

        <!-- Residential/Present Address -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Residential/Present Address</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <!-- Fields remain the same -->
            <div>
              <label for="office_number" class="block text-sm font-medium text-gray-700">Office Number:</label>
              <input id="office_number" type="text" v-model="formData.office_number"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="flat_no" class="block text-sm font-medium text-gray-700">Flat No:</label>
              <input id="flat_no" type="text" v-model="formData.flat_no"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="building_no" class="block text-sm font-medium text-gray-700">Building No:</label>
              <input id="building_no" type="text" v-model="formData.building_no"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="location" class="block text-sm font-medium text-gray-700">Location:<span class="text-red-500">*</span></label>
              <select id="location" v-model="formData.location" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                 <option disabled :value="null">-- Select Location --</option>
                <option v-for="loc in locations" :key="loc.id" :value="loc.id">{{ loc.name }}</option>
              </select>
            </div>
            <div>
              <label for="gewog_throm" class="block text-sm font-medium text-gray-700">Gewog/Throm:<span class="text-red-500">*</span></label>
              <select id="gewog_throm" v-model="formData.gewog_throm" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                 <option disabled :value="null">-- Select Gewog/Throm --</option>
                <option v-for="gt in gewogThroms" :key="gt.id" :value="gt.id">{{ gt.name }}</option>
              </select>
            </div>
            <div>
              <label for="dzongkhag_thromde" class="block text-sm font-medium text-gray-700">Dzongkhag/Thromde:<span class="text-red-500">*</span></label>
              <select id="dzongkhag_thromde" v-model="formData.dzongkhag_thromde" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                 <option disabled :value="null">-- Select Dzongkhag/Thromde --</option>
                <option v-for="dt in dzongkhagThromdes" :key="dt.id" :value="dt.id">{{ dt.name }}</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Education Details -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Education Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <!-- Fields remain the same -->
            <div>
              <label for="qualification" class="block text-sm font-medium text-gray-700">Qualification:<span class="text-red-500">*</span></label>
              <input id="qualification" type="text" v-model="formData.qualification" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="institute_name" class="block text-sm font-medium text-gray-700">Name of Institute:<span class="text-red-500">*</span></label>
              <input id="institute_name" type="text" v-model="formData.institute_name" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="university_name" class="block text-sm font-medium text-gray-700">Name of University:<span class="text-red-500">*</span></label>
              <input id="university_name" type="text" v-model="formData.university_name" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
          </div>
        </section>

        <!-- Permanent Address (Fetched via API based on CID) -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Permanent Address</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="village_chiwog" class="block text-sm font-medium text-gray-700">Village/Chiwog:</label>
              <input id="village_chiwog" type="text" v-model="formData.village_chiwog"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed" readonly>
            </div>
            <div>
              <label for="gewog" class="block text-sm font-medium text-gray-700">Gewog:</label>
              <input id="gewog" type="text" v-model="formData.gewog"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed" readonly>
            </div>
            <div>
              <label for="dungkhag" class="block text-sm font-medium text-gray-700">Dungkhag:</label>
              <input id="dungkhag" type="text" v-model="formData.dungkhag"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed" readonly>
            </div>
            <div>
              <label for="dzongkhag_thromde_perm" class="block text-sm font-medium text-gray-700">Dzongkhag/Thromde:</label>
              <input id="dzongkhag_thromde_perm" type="text" v-model="formData.dzongkhag_thromde_perm"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed" readonly>
            </div>
          </div>
        </section>

        <!-- Branch ECPF Establishment Proposal Details -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Branch ECPF Establishment Proposal Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <!-- Fields remain the same -->
            <div>
              <label for="existing_ecpf_name" class="block text-sm font-medium text-gray-700">Name of the Existing
                ECPF:<span class="text-red-500">*</span></label>
              <input id="existing_ecpf_name" type="text" v-model="formData.existing_ecpf_name" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="proposed_firm_address" class="block text-sm font-medium text-gray-700">Address of the Proposed
                Branch:<span class="text-red-500">*</span></label>
              <input id="proposed_firm_address" type="text" v-model="formData.proposed_firm_address" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="proposed_firm_location" class="block text-sm font-medium text-gray-700">Location of the
                Proposed Branch:<span class="text-red-500">*</span></label>
              <select id="proposed_firm_location" v-model="formData.proposed_firm_location" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                 <option disabled :value="null">-- Select Location --</option>
                <option v-for="loc in locations" :key="loc.id" :value="loc.id">{{ loc.name }}</option>
              </select>
            </div>
            <div>
              <label for="firm_type" class="block text-sm font-medium text-gray-700">Type of Firm:<span class="text-red-500">*</span></label>
              <select id="firm_type" v-model="formData.firm_type" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                 <option disabled :value="null">-- Select Firm Type --</option>
                <option v-for="type in firmTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Infrastructure -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Infrastructure<span class="text-red-500">*</span></h2>
          <p class="text-sm text-gray-500 mb-4">Add details of the infrastructure available at the proposed branch.</p>
          <div v-if="formData.infrastructure.length === 0" class="text-gray-500 italic mb-4">
             No infrastructure details added yet. Click 'Add More' to start.
          </div>
          <div v-for="(infra, index) in formData.infrastructure" :key="`infra-${index}`"
            class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded-md relative">
             <!-- Remove Button -->
             <button type="button" @click="removeInfrastructure(index)" title="Remove Infrastructure Item"
                 class="absolute -top-2 -right-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-full p-1 transition-colors duration-200">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                 </svg>
             </button>
             <!-- Fields -->
            <div>
              <label :for="`particulars_${index}`" class="block text-sm font-medium text-gray-700">Particulars:<span class="text-red-500">*</span></label>
              <select :id="`particulars_${index}`" v-model="infra.particulars" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                 <option disabled :value="null">-- Select Item --</option>
                <option v-for="item in infrastructureOptions" :key="item.id" :value="item.id">{{ item.name }}
                </option>
              </select>
            </div>
            <div>
              <label :for="`description_${index}`" class="block text-sm font-medium text-gray-700">Description:<span class="text-red-500">*</span></label>
              <input :id="`description_${index}`" type="text" v-model="infra.description" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
            <div>
              <label :for="`quantity_${index}`" class="block text-sm font-medium text-gray-700">Quantity:<span class="text-red-500">*</span></label>
              <input :id="`quantity_${index}`" type="number" min="1" v-model.number="infra.quantity" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
            <div>
              <label :for="`remarks_${index}`" class="block text-sm font-medium text-gray-700">Remarks:</label>
              <input :id="`remarks_${index}`" type="text" v-model="infra.remarks"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
          </div>
          <button type="button" @click="addInfrastructure"
            class="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
                 <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Add Infrastructure
          </button>
        </section>

        <!-- Human Resource -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Human Resource<span class="text-red-500">*</span></h2>
          <p class="text-sm text-gray-500 mb-4">Add details of the staff proposed for the branch. At least one Counselor is required.</p>
           <div v-if="formData.humanResources.length === 0" class="text-gray-500 italic mb-4">
             No human resource details added yet. Click 'Add More' to start.
          </div>
          <div v-for="(hr, index) in formData.humanResources" :key="`hr-${index}`"
            class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded-md relative">
             <!-- Remove Button -->
             <button type="button" @click="removeHumanResource(index)" title="Remove Human Resource Item"
                 class="absolute -top-2 -right-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-full p-1 transition-colors duration-200">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                 </svg>
             </button>
             <!-- Fields -->
            <div>
              <label :for="`position_${index}`" class="block text-sm font-medium text-gray-700">Position:<span class="text-red-500">*</span></label>
              <select :id="`position_${index}`" v-model="hr.position" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                 <option disabled :value="null">-- Select Position --</option>
                <option v-for="pos in positionOptions" :key="pos.id" :value="pos.id">{{ pos.name }}</option>
              </select>
            </div>
            <div>
              <label :for="`cid_${index}`" class="block text-sm font-medium text-gray-700">CID:<span class="text-red-500">*</span></label>
              <input :id="`cid_${index}`" type="text" v-model="hr.cid" required pattern="\d{11}" title="Enter 11 digit CID"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
            <div>
              <label :for="`full_name_${index}`" class="block text-sm font-medium text-gray-700">Full Name:<span class="text-red-500">*</span></label>
              <input :id="`full_name_${index}`" type="text" v-model="hr.full_name" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
            <div>
              <label :for="`qualification_${index}`" class="block text-sm font-medium text-gray-700">Qualification:<span class="text-red-500">*</span></label>
              <select :id="`qualification_${index}`" v-model="hr.qualification" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                 <option disabled :value="null">-- Select Qualification --</option>
                <option v-for="qual in qualificationOptions" :key="qual.id" :value="qual.id">{{ qual.name }}
                </option>
              </select>
            </div>
            <div>
              <label :for="`contact_number_${index}`" class="block text-sm font-medium text-gray-700">Contact Number:<span class="text-red-500">*</span></label>
              <input :id="`contact_number_${index}`" type="tel" v-model="hr.contact_number" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
            <div>
              <label :for="`email_address_${index}`" class="block text-sm font-medium text-gray-700">Email Address:<span class="text-red-500">*</span></label>
              <input :id="`email_address_${index}`" type="email" v-model="hr.email_address" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            </div>
            <div class="md:col-span-2">
              <label :for="`cv_certificates_${index}`" class="block text-sm font-medium text-gray-700">CV &
                Certificates:<span class="text-red-500">*</span></label>
              <input :id="`cv_certificates_${index}`" type="file" required accept=".pdf,.doc,.docx,.jpg,.png"
                @change="handleFileUpload($event, 'humanResources', index, 'cv_certificates')"
                 class="mt-1 block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"/>
                <span v-if="getHrFileName(index)" class="text-xs text-gray-600 mt-1 block">Selected: {{ getHrFileName(index) }}</span>
            </div>

          </div>
          <button type="button" @click="addHumanResource"
            class="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
                 <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Add Human Resource
          </button>
        </section>

        <!-- Declaration -->
        <section class="mb-8">
           <h2 class="text-2xl font-semibold text-gray-800 mb-4">Declaration<span class="text-red-500">*</span></h2>
           <div class="flex items-start space-x-3">
             <input type="checkbox" id="declaration_agree" v-model="declarationAgreed" required class="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500">
             <label for="declaration_agree" class="text-sm text-gray-700">
                I hereby declare that the information provided is true and correct to the best of my knowledge and agree to the terms and conditions.
             </label>
           </div>
        </section>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4 mt-10 pt-6 border-t border-gray-200">
           <button type="button" @click="saveAsDraft" :disabled="isSubmitting"
              class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
               {{ isSubmitting ? 'Saving...' : 'Save as Draft' }}
           </button>
           <button type="submit" :disabled="!declarationAgreed || isSubmitting || formData.isDraft"
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
               {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
           </button>
            <!-- Add Edit Draft button if needed, similar to previous form -->
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
import { ref, reactive, onMounted,} from 'vue';
import apiServices from '@/services/services';
import { useAuthStore } from '@/stores/authStore'; // 1. Import Auth Store

// --- Store Instance ---
const authStore = useAuthStore(); // 2. Instantiate Auth Store

// --- State ---
const isLoading = ref(true);
const isSubmitting = ref(false);
const formMessage = reactive({ text: '', type: '' });
const formEl = ref(null);
const declarationAgreed = ref(false);

// --- Form Data ---
const getInitialFormData = () => ({
  // Auto-populated from store/API
  cid_no: '',
  applicant_name: '',
  gender: '',
  date_of_birth: '',
  village_chiwog: '',
  gewog: '',
  dungkhag: '',
  dzongkhag_thromde_perm: '',
  // Editable personal details (pre-filled from store)
  contact_no: '',
  email_address: '',
  // Editable present address
  office_number: '',
  flat_no: '',
  building_no: '',
  location: null,
  gewog_throm: null,
  dzongkhag_thromde: null,
  // Editable education
  qualification: '',
  institute_name: '',
  university_name: '',
  // Branch Proposal Details
  existing_ecpf_name: '',
  proposed_firm_address: '',
  proposed_firm_location: null,
  firm_type: null,
  // Dynamic sections
  infrastructure: [],
  humanResources: [],
  // Meta fields
  isDraft: false,
  draftId: null,
  declaration_agreed: false, // Loaded from draft if exists
});

const formData = reactive(getInitialFormData());

// --- Master Data --- (Populate from API or keep static)
// !! Replace with actual API calls in fetchMasterData !!
const locations = ref([]);
const gewogThroms = ref([]);
const dzongkhagThromdes = ref([]);
const firmTypes = ref([ { id: 'ft1', name: 'Independent' }, /* ... */ ]);
const infrastructureOptions = ref([ { id: 'io1', name: 'Room' }, /* ... */ ]);
const positionOptions = ref([ { id: 'po1', name: 'Counselor' }, /* ... */ ]);
const qualificationOptions = ref([ { id: 'qo1', name: 'Masters' }, /* ... */ ]);

// --- Helper Functions ---
const setMessage = (text, type = 'error') => {
  formMessage.text = text;
  formMessage.type = type;
  window.scrollTo(0, 0);
};
const clearMessage = () => {
  formMessage.text = '';
  formMessage.type = '';
};
// Get filename for dynamically added HR files
const getHrFileName = (index) => {
    const file = formData.humanResources[index]?.cv_certificates;
    return file instanceof File ? file.name : '';
};

// --- Add/Remove Dynamic Sections ---
const addInfrastructure = () => {
  formData.infrastructure.push({ particulars: null, description: '', quantity: null, remarks: '' });
};
const removeInfrastructure = (index) => {
  formData.infrastructure.splice(index, 1);
};
const addHumanResource = () => {
  formData.humanResources.push({ position: null, cid: '', full_name: '', qualification: null, contact_number: '', email_address: '', cv_certificates: null });
};
const removeHumanResource = (index) => {
  formData.humanResources.splice(index, 1);
};

// --- File Upload Handler ---
const handleFileUpload = (event, sectionName, index, fileKey) => {
  const file = event.target.files[0];
  if (sectionName === 'humanResources') {
    formData.humanResources[index][fileKey] = file || null;
  }
  // Add other sections if needed
};

// --- Base64 Conversion ---
const toBase64 = (file) =>
    new Promise((resolve, reject) => {
        if (!file) { resolve(null); return; }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

// --- Data Preparation (Assuming Base64 for files) ---
const prepareDataForSubmission = async (status = 'submitted') => {
    const data = JSON.parse(JSON.stringify(formData));

    delete data.isDraft; // Don't send meta field

    // Convert HR files
    if (data.humanResources && Array.isArray(data.humanResources)) {
      for (const hr of data.humanResources) {
        if (hr.cv_certificates instanceof File) { // Only convert if it's a File object
            hr.cv_certificates_base64 = await toBase64(hr.cv_certificates); // Send as separate field maybe?
        }
        delete hr.cv_certificates; // Remove the File object before sending
      }
    }

    data.status = status;
    data.declaration_agreed = declarationAgreed.value;

     // *** IMPORTANT: Map `data` to the structure your BACKEND API expects ***
     // This is just an EXAMPLE structure, adjust it precisely!
     const submissionPayload = {
        applicant_cid: data.cid_no,
        applicant_name: data.applicant_name, // Already populated
        gender: data.gender,
        date_of_birth: data.date_of_birth,
        contact_no: data.contact_no,
        email_address: data.email_address,
        present_address: { // Example nesting
            office_number: data.office_number,
            flat_no: data.flat_no,
            building_no: data.building_no,
            location_id: data.location,
            gewog_throm_id: data.gewog_throm,
            dzongkhag_thromde_id: data.dzongkhag_thromde,
        },
        education_details:{
             qualification: data.qualification,
             institute_name: data.institute_name,
             university_name: data.university_name
        },
         permanent_address: { // Example nesting
            village_chiwog: data.village_chiwog,
            gewog: data.gewog,
            dungkhag: data.dungkhag,
            dzongkhag_thromde: data.dzongkhag_thromde_perm,
        },
        branch_proposal: { // Example nesting
            existing_ecpf_name: data.existing_ecpf_name,
            proposed_firm_address: data.proposed_firm_address,
            proposed_firm_location_id: data.proposed_firm_location,
            firm_type_id: data.firm_type,
        },
        infrastructure_details: data.infrastructure.map(infra => ({ // Rename array maybe
            particulars_id: infra.particulars,
            description: infra.description,
            quantity: infra.quantity,
            remarks: infra.remarks,
        })),
        human_resource_details: data.humanResources.map(hr => ({ // Rename array maybe
            position_id: hr.position,
            cid: hr.cid,
            full_name: hr.full_name,
            qualification_id: hr.qualification,
            contact_number: hr.contact_number,
            email: hr.email_address,
            cv_certificates_base64: hr.cv_certificates_base64 || null, // Send base64 data
        })),
        status: data.status,
        declaration_agreed: data.declaration_agreed,
        draft_id: data.draftId // Send draftId if updating
     };

    // Clean up null/undefined values if backend prefers missing keys
    // Object.keys(submissionPayload).forEach(key => {
    //     if (submissionPayload[key] === null || submissionPayload[key] === undefined) {
    //         delete submissionPayload[key];
    //     }
    // });

    return submissionPayload;
};

// --- Form Validation ---
const validateForm = () => {
    clearMessage();
    let isValid = true;
    const errors = [];

    // Personal Info
    if (!formData.contact_no) errors.push('Contact Number is required.');
    if (!formData.email_address || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_address)) {
        errors.push('Please enter a valid personal Email Address.');
    }
    // Present Address
    if (formData.location === null) errors.push("Please select a Location for present address.");
    if (formData.gewog_throm === null) errors.push("Please select a Gewog/Throm for present address.");
    if (formData.dzongkhag_thromde === null) errors.push("Please select a Dzongkhag/Thromde for present address.");
    // Education
    if (!formData.qualification) errors.push('Qualification is required.');
    if (!formData.institute_name) errors.push('Institute Name is required.');
    if (!formData.university_name) errors.push('University Name is required.');
    // Branch Proposal
    if (!formData.existing_ecpf_name) errors.push('Existing ECPF Name is required.');
    if (!formData.proposed_firm_address) errors.push('Proposed Branch Address is required.');
    if (formData.proposed_firm_location === null) errors.push('Proposed Branch Location is required.');
    if (formData.firm_type === null) errors.push('Firm Type is required.');

    // Infrastructure Validation
    if (formData.infrastructure.length === 0) {
         errors.push('At least one infrastructure item must be added.');
    } else {
        for (let i = 0; i < formData.infrastructure.length; i++) {
            const infra = formData.infrastructure[i];
            if (infra.particulars === null || !infra.description || infra.quantity === null || infra.quantity < 1) {
                errors.push(`Please complete all required fields (Particulars, Description, Quantity >= 1) for Infrastructure item #${i + 1}.`);
                isValid = false; // Stop further checks if one item is invalid
                break;
            }
            // Specific check example (adjust 'io1' and condition as needed)
             if (infra.particulars === 'io1' && infra.quantity < 2) {
                 errors.push('Infrastructure check: At least two rooms (Particulars: Room) are required.');
             }
        }
    }


    // Human Resource Validation
     if (formData.humanResources.length === 0) {
         errors.push('At least one human resource item must be added.');
     } else {
         let hasCounselor = false;
         const counselorCids = new Set();
         for (let i = 0; i < formData.humanResources.length; i++) {
            const hr = formData.humanResources[i];
            const itemNum = i + 1;
            if (!hr.position || !hr.cid || !hr.full_name || !hr.qualification || !hr.contact_number || !hr.email_address) {
                errors.push(`Please complete all required fields for Human Resource item #${itemNum}.`);
                isValid = false; break;
            }
            if (!/^\d{11}$/.test(hr.cid)) {
                 errors.push(`Invalid CID format for Human Resource item #${itemNum}. Must be 11 digits.`);
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(hr.email_address)) {
                 errors.push(`Invalid Email format for Human Resource item #${itemNum}.`);
            }
            if (!hr.cv_certificates) { // Check if file is selected
                 errors.push(`CV & Certificates file is required for Human Resource item #${itemNum}.`);
            }

            if (hr.position === 'po1') { // Assuming 'po1' is Counselor ID
                 hasCounselor = true;
                 if (counselorCids.has(hr.cid)) {
                     errors.push(`Duplicate Counselor CID found: ${hr.cid}. Each counselor must have a unique CID.`);
                 } else {
                     counselorCids.add(hr.cid);
                 }
             }
         }
          if (!hasCounselor && formData.humanResources.length > 0) { // Check only if HR items exist
             errors.push('At least one Counselor (Position: Counselor) must be added to Human Resources.');
         }
     }


    // Declaration
    if (!declarationAgreed.value) errors.push('You must agree to the declaration to submit.');


    if (errors.length > 0) {
        setMessage(`Please fix the following errors:\n- ${errors.join('\n- ')}`);
        isValid = false;
    }
    return isValid;
};


// --- API Interaction ---

/** Fetch Master Data for Dropdowns */
const fetchMasterData = async () => {
     try {
        console.log("Fetching master data (locations, firm types, etc.)...");
        // !! Replace with actual API calls using apiServices !!
        // const [locRes, gtRes, dtRes, ftRes, infraOptRes, posOptRes, qualOptRes] = await Promise.all([
        //     apiServices.getLocations(),
        //     apiServices.getGewogThroms(),
        //     apiServices.getDzongkhagThromdes(),
        //     apiServices.getFirmTypes(),
        //     apiServices.getInfrastructureOptions(),
        //     apiServices.getPositionOptions(),
        //     apiServices.getQualificationOptions(),
        // ]);
        // locations.value = locRes?.data || [];
        // gewogThroms.value = gtRes?.data || [];
        // dzongkhagThromdes.value = dtRes?.data || [];
        // firmTypes.value = ftRes?.data || [];
        // infrastructureOptions.value = infraOptRes?.data || [];
        // positionOptions.value = posOptRes?.data || [];
        // qualificationOptions.value = qualOptRes?.data || [];

        // Using static data for now:
        locations.value = [ { id: 'loc1', name: 'Thimphu' }, { id: 'loc2', name: 'Paro' } ];
        gewogThroms.value = [ { id: 'gt1', name: 'Chang Gewog' }, { id: 'gt2', name: 'Kawang Gewog' } ];
        dzongkhagThromdes.value = [ { id: 'dt1', name: 'Thimphu Thromde' }, { id: 'dt2', name: 'Paro Thromde' } ];
        firmTypes.value = [{ id: 'ft1', name: 'Independent Branch' }, { id: 'ft2', name: 'Managed Branch' }];
        infrastructureOptions.value = [{ id: 'io1', name: 'Counseling Room' }, { id: 'io2', name: 'Office Space' }, { id: 'io3', name: 'Computer' }, { id: 'io4', name: 'Furniture Set' }];
        positionOptions.value = [ { id: 'po1', name: 'Counselor' }, { id: 'po2', name: 'Admin Staff' }, { id: 'po3', name: 'Manager' }];
        qualificationOptions.value = [ { id: 'qo1', name: 'Masters in Counseling' }, { id: 'qo2', name: 'Bachelors Degree' }, { id: 'qo3', name: 'Relevant Diploma' }];
         console.log("Master data loaded.");

    } catch (error) {
         console.error("Error fetching master data:", error);
         setMessage("Failed to load dropdown options. Please try refreshing.", "error");
    }
};

/** Fetch Permanent Address based on CID */
const autoPopulatePermanentAddress = async (cid) => {
    // This function now *only* fetches permanent address details
    if (!cid) return;
    // !! ENSURE this method exists and returns permanent address fields !!
     if (typeof apiServices.getUserPermanentAddressByCID !== 'function') { // Changed method name assumption
        console.warn("apiServices.getUserPermanentAddressByCID method is not defined.");
        return; // Don't show error, just skip
    }
    try {
        console.log(`Fetching permanent address for CID: ${cid}...`);
        const response = await apiServices.getUserPermanentAddressByCID(cid); // Use the specific method

        if (response?.data) {
             // !! Adjust keys based on your API response !!
             formData.village_chiwog = response.data.village || response.data.chiwog || '';
             formData.gewog = response.data.gewogName || response.data.gewog || ''; // Prefer name if available
             formData.dungkhag = response.data.dungkhagName || response.data.dungkhag || '';
             formData.dzongkhag_thromde_perm = response.data.dzongkhagName || response.data.dzongkhag || '';
             console.log("Populated permanent address.");
        } else {
             console.log("No permanent address data found for CID via API.");
             // Clear fields if no data found? Optional.
            // formData.village_chiwog = '';
            // formData.gewog = '';
            // formData.dungkhag = '';
            // formData.dzongkhag_thromde_perm = '';
        }
    } catch (error) {
         console.warn(`Could not fetch permanent address: ${error.message || 'Unknown error'}`);
         // Optionally inform user, but don't block
    }
};

/** Submit the form data */
const submitForm = async () => {
     // Logic is similar, ensure correct API endpoint is called
     if (!validateForm()) return;
     isSubmitting.value = true;
     clearMessage();
     console.log('Submitting branch application...');
     try {
         const dataToSubmit = await prepareDataForSubmission('submitted');
         let response;
         // !! Use correct API method names from apiServices !!
         const apiCreateMethod = 'submitBranchEcpfApplication'; // Assumed name
         const apiUpdateMethod = 'updateBranchEcpfApplication'; // Assumed name (takes ID)

         if (formData.draftId && typeof apiServices[apiUpdateMethod] === 'function') {
             response = await apiServices[apiUpdateMethod](formData.draftId, dataToSubmit);
         } else if (typeof apiServices[apiCreateMethod] === 'function') {
             response = await apiServices[apiCreateMethod](dataToSubmit);
         } else {
             throw new Error(`Required API method (${formData.draftId ? apiUpdateMethod : apiCreateMethod}) not found.`);
         }

         if (response?.status === 200 || response?.status === 201) {
             setMessage('Branch application submitted successfully!', 'success');
             resetForm();
         } else {
             throw new Error(`Submission failed with status: ${response?.status || 'Unknown'}`);
         }
     } catch (error) {
         console.error('Error submitting branch form:', error);
         const errorMsg = error.response?.data?.detail || error.message || 'Submission failed.';
         setMessage(errorMsg);
     } finally {
         isSubmitting.value = false;
     }
};

/** Save the form data as a draft */
const saveAsDraft = async () => {
     // Logic is similar, ensure correct API endpoint is called
     isSubmitting.value = true;
     clearMessage();
     console.log('Saving branch application as draft...');
     try {
         const dataToSubmit = await prepareDataForSubmission('draft');
         let response;
         // !! Use correct API method names from apiServices !!
         const apiCreateMethod = 'saveBranchEcpfDraft'; // Assumed name
         const apiUpdateMethod = 'updateBranchEcpfDraft'; // Assumed name (takes ID)

         if (formData.draftId && typeof apiServices[apiUpdateMethod] === 'function') {
             response = await apiServices[apiUpdateMethod](formData.draftId, dataToSubmit);
         } else if (typeof apiServices[apiCreateMethod] === 'function') {
             response = await apiServices[apiCreateMethod](dataToSubmit);
         } else {
             throw new Error(`Required API method (${formData.draftId ? apiUpdateMethod : apiCreateMethod}) not found.`);
         }

         if (response?.status === 200 || response?.status === 201) {
             if (!formData.draftId && response?.data?.id) {
                 formData.draftId = response.data.id;
             }
             formData.isDraft = true;
             setMessage(`Branch application saved as draft successfully. ${formData.draftId ? `(Draft ID: ${formData.draftId})` : ''}`, 'success');
         } else {
             throw new Error(`Draft save failed with status: ${response?.status || 'Unknown'}`);
         }
     } catch (error) {
         console.error('Error saving branch draft:', error);
         const errorMsg = error.response?.data?.detail || error.message || 'Draft save failed.';
         setMessage(errorMsg);
     } finally {
         isSubmitting.value = false;
     }
};

/** Load draft data from API */
const loadDraft = async (id) => {
     // Logic is similar, ensure correct API endpoint is called
      if (!id) return;
     isLoading.value = true;
     clearMessage();
     console.log(`Loading branch draft with ID: ${id}...`);
      // !! Use correct API method name from apiServices !!
      const apiGetMethod = 'getBranchEcpfDraft'; // Assumed name
      if (typeof apiServices[apiGetMethod] !== 'function') {
         setMessage("API method to get branch draft is missing.", "error");
         isLoading.value = false; return;
     }
     try {
         const response = await apiServices[apiGetMethod](id);
         if (response?.data) {
             // *** IMPORTANT: Map the response data back to formData structure ***
             // This needs careful mapping if backend structure differs from formData
             // Example (adjust based on actual response):
              const draftData = response.data;
              Object.assign(formData, { // Assign common fields first
                 ...getInitialFormData(), // Start with default structure
                 // Overwrite with fetched data (ensure keys match formData)
                 cid_no: draftData.applicant_cid,
                 applicant_name: draftData.applicant_name,
                 gender: draftData.gender,
                 date_of_birth: draftData.date_of_birth,
                 contact_no: draftData.contact_no,
                 email_address: draftData.email_address,
                 office_number: draftData.present_address?.office_number || '',
                 flat_no: draftData.present_address?.flat_no || '',
                 building_no: draftData.present_address?.building_no || '',
                 location: draftData.present_address?.location_id || null,
                 gewog_throm: draftData.present_address?.gewog_throm_id || null,
                 dzongkhag_thromde: draftData.present_address?.dzongkhag_thromde_id || null,
                 qualification: draftData.education_details?.qualification || '',
                 institute_name: draftData.education_details?.institute_name || '',
                 university_name: draftData.education_details?.university_name || '',
                 village_chiwog: draftData.permanent_address?.village_chiwog || '',
                 gewog: draftData.permanent_address?.gewog || '',
                 dungkhag: draftData.permanent_address?.dungkhag || '',
                 dzongkhag_thromde_perm: draftData.permanent_address?.dzongkhag_thromde || '',
                 existing_ecpf_name: draftData.branch_proposal?.existing_ecpf_name || '',
                 proposed_firm_address: draftData.branch_proposal?.proposed_firm_address || '',
                 proposed_firm_location: draftData.branch_proposal?.proposed_firm_location_id || null,
                 firm_type: draftData.branch_proposal?.firm_type_id || null,
                 infrastructure: draftData.infrastructure_details?.map(infra => ({ // Map arrays back
                     particulars: infra.particulars_id,
                     description: infra.description,
                     quantity: infra.quantity,
                     remarks: infra.remarks,
                 })) || [],
                 humanResources: draftData.human_resource_details?.map(hr => ({
                     position: hr.position_id,
                     cid: hr.cid,
                     full_name: hr.full_name,
                     qualification: hr.qualification_id,
                     contact_number: hr.contact_number,
                     email_address: hr.email,
                     cv_certificates: null, // File object cannot be restored
                     // Maybe store filename: cv_filename: hr.cv_filename
                 })) || [],
                  declaration_agreed: draftData.declaration_agreed || false, // Restore saved declaration state
             });

             // Add initial items if arrays are empty after loading
             if (formData.infrastructure.length === 0) addInfrastructure();
             if (formData.humanResources.length === 0) addHumanResource();


             formData.draftId = id;
             formData.isDraft = true;
             declarationAgreed.value = formData.declaration_agreed; // Sync checkbox

             setMessage(`Branch draft loaded (ID: ${id}).`, 'success');
         } else {
             throw new Error("Branch draft data not found.");
         }
     } catch (error) {
         console.error("Error loading branch draft:", error);
         setMessage(`Failed to load branch draft (ID: ${id}): ${error.message}. Starting new form.`, "error");
         resetForm();
     } finally {
         isLoading.value = false;
     }
};

/** Allow editing of a loaded draft */
const editDraft = () => {
      // Logic remains the same
    if (formData.draftId) {
      formData.isDraft = false;
      setMessage("Draft unlocked for editing and submission.", "success");
   }
};

/** Reset form to initial state, preserving auth details */
const resetForm = () => {
    // Preserve initially fetched user details
    const initialUserDetails = {
        cid_no: formData.cid_no,
        applicant_name: formData.applicant_name,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
        contact_no: formData.contact_no, // Keep initially populated contact/email too
        email_address: formData.email_address,
         // Preserve fetched permanent address too
         village_chiwog: formData.village_chiwog,
         gewog: formData.gewog,
         dungkhag: formData.dungkhag,
         dzongkhag_thromde_perm: formData.dzongkhag_thromde_perm,
    };
    // Get fresh initial state for other fields
    const freshFormData = getInitialFormData();
    // Merge preserved details with fresh state
    Object.assign(formData, { ...freshFormData, ...initialUserDetails });

    declarationAgreed.value = false; // Reset declaration checkbox
    formData.draftId = null;
    formData.isDraft = false;
    clearMessage();
    // Add initial items back if needed after reset
    if (formData.infrastructure.length === 0) addInfrastructure();
    if (formData.humanResources.length === 0) addHumanResource();
    // Clear file inputs visually
    if (formEl.value) {
        const fileInputs = formEl.value.querySelectorAll('input[type="file"]');
        fileInputs.forEach(input => input.value = '');
    }
    console.log("Form reset, user details preserved.");
};


// --- Lifecycle Hook ---
onMounted(async () => {
    isLoading.value = true;
    clearMessage();
    authStore.initializeAuth();

    let userCid = null;

    // 1. Populate from Auth Store
    if (authStore.isAuthenticated && authStore.user) {
        // *** VERIFY CID source in your authStore.user object ***
        formData.cid_no = authStore.user?.cid || authStore.username || ''; // Example: Prioritize 'cid' field
        formData.applicant_name = authStore.fullName || '';
        formData.gender = authStore.gender || '';
        formData.date_of_birth = authStore.dateOfBirth || '';
        formData.contact_no = authStore.contactNumber || '';
        formData.email_address = authStore.email || '';

        userCid = formData.cid_no;
        console.log("Populated user details from auth store.");

         // 2. Auto-populate Permanent Address (after getting CID)
        if (userCid) {
             await autoPopulatePermanentAddress(userCid);
        } else {
             console.warn("Cannot fetch permanent address: CID not found in auth store.");
        }

    } else {
        setMessage("User data not found. Please log in.", "error");
        isLoading.value = false;
        return;
    }


    // 3. Fetch Master Data (Dropdowns)
    await fetchMasterData();

     // 4. Add Initial Dynamic Rows if empty
    if (formData.infrastructure.length === 0) {
        addInfrastructure();
    }
    if (formData.humanResources.length === 0) {
        addHumanResource();
    }

    // 5. Check for Draft ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const draftIdFromUrl = urlParams.get('draftId');
    if (draftIdFromUrl) {
        await loadDraft(draftIdFromUrl); // Load draft data if ID is present
    } else {
       formData.isDraft = false; // Ensure it's not marked as draft if no ID loaded
    }

    isLoading.value = false; // Loading finished
});

</script>

<style scoped>
input:read-only, input[readonly] {
    cursor: not-allowed;
    background-color: #f3f4f6; /* bg-gray-100 */
    opacity: 0.7;
}
/* Add other styles if necessary */
</style>