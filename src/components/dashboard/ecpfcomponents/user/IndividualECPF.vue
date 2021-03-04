<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Individual ECPF Establishment</h1>
      <p class="text-gray-600">Please fill in the details below to establish your ECPF.</p>
    </div>

    <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <form @submit.prevent="submitForm" ref="form">
        <!-- Personal Information -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Personal Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="cid_no" class="block text-sm font-medium text-gray-700">CID No:</label>
              <input id="cid_no" type="text" v-model="formData.cid_no"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled>
            </div>
            <div>
              <label for="applicant_name" class="block text-sm font-medium text-gray-700">Applicant's Name:</label>
              <input id="applicant_name" type="text" v-model="formData.applicant_name"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled>
            </div>
            <div>
              <label for="gender" class="block text-sm font-medium text-gray-700">Gender:</label>
              <input id="gender" type="text" v-model="formData.gender"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled>
            </div>
            <div>
              <label for="date_of_birth" class="block text-sm font-medium text-gray-700">Date of Birth:</label>
              <input id="date_of_birth" type="text" v-model="formData.date_of_birth"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled>
            </div>
            <div>
              <label for="contact_no" class="block text-sm font-medium text-gray-700">Contact No:</label>
              <input id="contact_no" type="number" v-model="formData.contact_no"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="email_address" class="block text-sm font-medium text-gray-700">Email Address:</label>
              <input id="email_address" type="email" v-model="formData.email_address"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
          </div>
        </section>

        <!-- ... (Other sections: Residential/Present Address, Education Details, etc.) ... -->
        <!-- Residential/Present Address -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Residential/Present Address</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="office_number" class="block text-sm font-medium text-gray-700">Office Number:</label>
              <input id="office_number" type="number" v-model="formData.office_number"
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
              <label for="location" class="block text-sm font-medium text-gray-700">Location:</label>
              <select id="location" v-model="formData.location"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option v-for="loc in locations" :key="loc.id" :value="loc.id">{{ loc.name }}</option>
              </select>
            </div>
            <div>
              <label for="gewog_throm" class="block text-sm font-medium text-gray-700">Gewog/Throm:</label>
              <select id="gewog_throm" v-model="formData.gewog_throm"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option v-for="gt in gewogThroms" :key="gt.id" :value="gt.id">{{ gt.name }}</option>
              </select>
            </div>
            <div>
              <label for="dzongkhag_thromde" class="block text-sm font-medium text-gray-700">Dzongkhag/Thromde:</label>
              <select id="dzongkhag_thromde" v-model="formData.dzongkhag_thromde"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option v-for="dt in dzongkhagThromdes" :key="dt.id" :value="dt.id">{{ dt.name }}</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Education Details -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Education Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="qualification" class="block text-sm font-medium text-gray-700">Qualification:</label>
              <input id="qualification" type="text" v-model="formData.qualification"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="institute_name" class="block text-sm font-medium text-gray-700">Name of Institute:</label>
              <input id="institute_name" type="text" v-model="formData.institute_name"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="university_name" class="block text-sm font-medium text-gray-700">Name of University:</label>
              <input id="university_name" type="text" v-model="formData.university_name"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
          </div>
        </section>

        <!-- ECPF Establishment Proposal Details -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">ECPF Establishment Proposal Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="proposed_firm_name" class="block text-sm font-medium text-gray-700">Name of the Proposed
                Firm:</label>
              <input id="proposed_firm_name" type="text" v-model="formData.proposed_firm_name"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="proposed_firm_address" class="block text-sm font-medium text-gray-700">Address of the Proposed
                Firm:</label>
              <input id="proposed_firm_address" type="text" v-model="formData.proposed_firm_address"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="proposed_firm_location" class="block text-sm font-medium text-gray-700">Location of the
                Proposed Firm:</label>
              <select id="proposed_firm_location" v-model="formData.proposed_firm_location"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option v-for="loc in locations" :key="loc.id" :value="loc.id">{{ loc.name }}</option>
              </select>
            </div>
            <div>
              <label for="firm_type" class="block text-sm font-medium text-gray-700">Type of Firm:</label>
              <select id="firm_type" v-model="formData.firm_type"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option v-for="type in firmTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Purpose of Establishment -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Purpose of Establishment</h2>
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label for="vision" class="block text-sm font-medium text-gray-700">Vision:</label>
              <textarea id="vision" v-model="formData.vision"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"></textarea>
            </div>
            <div>
              <label for="mission" class="block text-sm font-medium text-gray-700">Mission:</label>
              <textarea id="mission" v-model="formData.mission"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"></textarea>
            </div>
            <div>
              <label for="objective" class="block text-sm font-medium text-gray-700">Objective:</label>
              <textarea id="objective" v-model="formData.objective"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"></textarea>
            </div>
          </div>
        </section>

        <!-- Institute/Colleges/University Linkages -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Institute/Colleges/University Linkages</h2>
          <div v-for="(linkage, index) in formData.linkages" :key="index"
            class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 border-b pb-4">
            <div>
              <label :for="`college_name_${index}`" class="block text-sm font-medium text-gray-700">Name of
                Colleges/University/institute:</label>
              <input :id="`college_name_${index}`" type="text" v-model="linkage.college_name"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label :for="`linkage_location_${index}`" class="block text-sm font-medium text-gray-700">Location:</label>
              <input :id="`linkage_location_${index}`" type="text" v-model="linkage.location"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label :for="`country_${index}`" class="block text-sm font-medium text-gray-700">Country:</label>
              <select :id="`country_${index}`" v-model="linkage.country"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option v-for="country in countries" :key="country.code" :value="country.code">{{ country.name }}</option>
              </select>
            </div>
            <div>
              <label :for="`recognition_${index}`" class="block text-sm font-medium text-gray-700">Recognition/Accreditation:</label>
              <input :id="`recognition_${index}`" type="file" @change="handleFileUpload($event, 'recognition', index)"
                class="mt-1 block w-full">
            </div>
            <div>
              <label :for="`approval_${index}`" class="block text-sm font-medium text-gray-700">Approval from
                University:</label>
              <input :id="`approval_${index}`" type="file" @change="handleFileUpload($event, 'approval', index)"
                class="mt-1 block w-full">
            </div>
            <button type="button" @click="removeLinkage(index)" class="text-red-600 hover:text-red-800">Remove</button>
          </div>
          <button type="button" @click="addLinkage"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Add More
          </button>
        </section>

        <!-- Finance Plan -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Finance Plan</h2>
          <div>
            <label for="finance_plan_details" class="block text-sm font-medium text-gray-700">Finance Plan
              Details:</label>
            <textarea id="finance_plan_details" v-model="formData.finance_plan_details"
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"></textarea>
          </div>
        </section>

        <!-- Services -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Services</h2>
          <div v-for="(service, index) in formData.services" :key="index"
            class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 border-b pb-4">
            <div>
              <label :for="`service_category_${index}`" class="block text-sm font-medium text-gray-700">Service
                Category:</label>
              <select :id="`service_category_${index}`" v-model="service.category"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option v-for="category in serviceCategories" :key="category.id" :value="category.id">{{ category.name }}
                </option>
              </select>
            </div>
            <div>
              <label :for="`service_details_${index}`" class="block text-sm font-medium text-gray-700">Details:</label>
              <textarea :id="`service_details_${index}`" v-model="service.details"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"></textarea>
            </div>
            <button type="button" @click="removeService(index)" class="text-red-600 hover:text-red-800">Remove</button>
          </div>
          <button type="button" @click="addService"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Add More
          </button>
        </section>

        <!-- SWOT Analysis -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">SWOT Analysis</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="strengths" class="block text-sm font-medium text-gray-700">Strengths:</label>
              <textarea id="strengths" v-model="formData.strengths"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"></textarea>
            </div>
            <div>
              <label for="weaknesses" class="block text-sm font-medium text-gray-700">Weaknesses:</label>
              <textarea id="weaknesses" v-model="formData.weaknesses"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"></textarea>
            </div>
            <div>
              <label for="opportunities" class="block text-sm font-medium text-gray-700">Opportunities:</label>
              <textarea id="opportunities" v-model="formData.opportunities"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"></textarea>
            </div>
            <div>
              <label for="threats" class="block text-sm font-medium text-gray-700">Threats:</label>
              <textarea id="threats" v-model="formData.threats"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"></textarea>
            </div>
          </div>
        </section>

        <!-- Fee & Charges -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Fee & Charges</h2>
          <div v-for="(fee, index) in formData.fees" :key="index"
            class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4 border-b pb-4">
            <div>
              <label :for="`fee_breakup_${index}`" class="block text-sm font-medium text-gray-700">Fee Breakup:</label>
              <input :id="`fee_breakup_${index}`" type="text" v-model="fee.breakup"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label :for="`description_${index}`" class="block text-sm font-medium text-gray-700">Description:</label>
              <input :id="`description_${index}`" type="text" v-model="fee.description"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label :for="`amount_${index}`" class="block text-sm font-medium text-gray-700">Amount:</label>
              <input :id="`amount_${index}`" type="number" v-model="fee.amount"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label :for="`total_amount_${index}`" class="block text-sm font-medium text-gray-700">Total
                Amount:</label>
              <input :id="`total_amount_${index}`" type="number" v-model="fee.total_amount"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <button type="button" @click="removeFee(index)" class="text-red-600 hover:text-red-800">Remove</button>
          </div>
          <button type="button" @click="addFee"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Add More
          </button>
        </section>

        <!-- Guarantor Details -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Guarantor Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="guarantor_full_name" class="block text-sm font-medium text-gray-700">Full Name:</label>
              <input id="guarantor_full_name" type="text" v-model="formData.guarantor_full_name" required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="guarantor_cid_number" class="block text-sm font-medium text-gray-700">CID Number:</label>
              <input id="guarantor_cid_number" type="text" v-model="formData.guarantor_cid_number"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="relation_to_applicant" class="block text-sm font-medium text-gray-700">Relation to the
                Applicant:</label>
              <input id="relation_to_applicant" type="text" v-model="formData.relation_to_applicant"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="guarantor_contact_number" class="block text-sm font-medium text-gray-700">Contact
                Number:</label>
              <input id="guarantor_contact_number" type="number" v-model="formData.guarantor_contact_number"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="cid_copy" class="block text-sm font-medium text-gray-700">CID Copy:</label>
              <input id="cid_copy" type="file" @change="handleFileUpload($event, 'cid_copy')" class="mt-1 block w-full">
            </div>
          </div>
        </section>

        <!-- Supporting Documents -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Supporting Documents</h2>
          <div>
            <label for="cv" class="block text-sm font-medium text-gray-700">CV of the Applicant:</label>
            <input id="cv" type="file" @change="handleFileUpload($event, 'cv')" class="mt-1 block w-full">
          </div>
        </section>
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Declaration</h2>
          <div>
            <label for="declaration" class="block text-sm font-medium text-gray-700">Declaration:</label>
            <select id="declaration" v-model="formData.declaration"
              class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option v-for="declarationOption in declarationOptions" :key="declarationOption.id"
                :value="declarationOption.id">{{ declarationOption.name }}</option>
            </select>
          </div>
        </section>

        <div class="flex justify-end space-x-4">
          <button type="button" @click="saveAsDraft"
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200">
            Save as Draft
          </button>
          <!-- Disable submit button if declaration is not "Agree" -->
          <button type="submit" :disabled="formData.declaration !== 1"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50">
            Submit
          </button>
             <button type="button" @click="editDraft" v-if="isDraft"
            class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200">
            Edit Draft
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import apiServices from '@/services/services'; // Import your API service

const formData = ref({
  // Personal Information
  cid_no: '',
  applicant_name: '',
  gender: '',
  date_of_birth: '',
  contact_no: '',
  email_address: '',

  // Residential/Present Address
  office_number: '',
  flat_no: '',
  building_no: '',
  location: null, // Use null for select
  gewog_throm: null,
  dzongkhag_thromde: null,

  // Education Details
  qualification: '',
  institute_name: '',
  university_name: '',

  // ECPF Establishment Proposal Details
  proposed_firm_name: '',
  proposed_firm_address: '',
  proposed_firm_location: null,
  firm_type: null,

  // Purpose of Establishment
  vision: '',
  mission: '',
  objective: '',

  // Institute/Colleges/University Linkages
  linkages: [],

  // Finance Plan
  finance_plan_details: '',

  // Services
  services: [],

  // SWOT Analysis
  strengths: '',
  weaknesses: '',
  opportunities: '',
  threats: '',

  // Fee & Charges
  fees: [],

  // Guarantor Details
  guarantor_full_name: '',
  guarantor_cid_number: '',
  relation_to_applicant: '',
  guarantor_contact_number: '',
  cid_copy: null, // For file uploads, store the File object or a reference

  // Supporting Documents
  cv: null,
  declaration: null,
  isDraft: false, // Flag to indicate if the form is in draft mode
  draftId: null,  // To store the ID of the saved draft
});

// Master data (using static data for now)
const locations = ref([
  { id: 'loc1', name: 'Thimphu' },
  { id: 'loc2', name: 'Paro' },
  { id: 'loc3', name: 'Punakha' },
]);

const gewogThroms = ref([
    { id: 'gt1', name: 'Thimphu Gewog 1'},
    { id: 'gt2', name: 'Thimphu Gewog 2'},
    { id: 'gt3', name: 'Paro Gewog 1'},
]);

const dzongkhagThromdes = ref([
    {id: 'dt1', name: 'Thimphu Thromde'},
    {id: 'dt2', name: 'Paro Thromde'},
]);

const countries = ref([
  { code: 'BT', name: 'Bhutan' },
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
]);

const serviceCategories = ref([
    {id: 'sc1', name: 'Admission'},
    {id: 'sc2', name: 'Welfare'},
    {id: 'sc3', name: 'Counseling'}
]);

const firmTypes = ref([
    {id: 'ft1', name: 'Independent'},
    {id: 'ft2', name: 'Collaboration'}
]);
const declarationOptions = ref([
     { id: 1, name: 'Agree' },
     { id: 2, name: 'Not Agree' }
]);


// --- Add/Remove Functions ---
const addLinkage = () => {
  formData.value.linkages.push({
    college_name: '',
    location: '',
    country: null,
    recognition: null,
    approval: null,
  });
};

const removeLinkage = (index) => {
  formData.value.linkages.splice(index, 1);
};


const addService = () => {
  formData.value.services.push({
    category: null,
    details: ''
  });
};

const removeService = (index) => {
  formData.value.services.splice(index, 1);
};

const addFee = () => {
  formData.value.fees.push({
    breakup: '',
    description: '',
    amount: null,
    total_amount: null,
  });
};

const removeFee = (index) => {
  formData.value.fees.splice(index, 1);
};


// --- File Upload Handler ---
const handleFileUpload = (event, fieldName, index = null) => {
    const file = event.target.files[0];
    if (!file) return;

    if (index !== null) {
        formData.value[fieldName][index] = file;
    } else {
        formData.value[fieldName] = file;
    }
};

// --- Form Submission and Draft Saving ---
const submitForm = async () => {
    try {
        if (!validateForm()) {
            return;
        }
        const dataToSubmit = await prepareDataForSubmission();
        const response = await apiServices.submitEcpfApplication(dataToSubmit);

        if (response.status === 201) {
            alert('Application submitted successfully!');
            resetForm();
             formData.value.isDraft = false; // Reset draft flag
            formData.value.draftId = null;
        } else {
            alert('An error occurred while submitting the application.');
            console.error("API Error:", response);
        }
    } catch (error) {
        alert('An unexpected error occurred.');
        console.error("Submission Error:", error);
    }
};

const saveAsDraft = async () => {
  try {
    const dataToSubmit = await prepareDataForSubmission();
    let response;

    if (formData.value.draftId) {
      // Update existing draft
      response = await apiServices.updateEcpfDraft(formData.value.draftId, dataToSubmit);
    } else {
      // Save new draft
      response = await apiServices.saveEcpfDraft(dataToSubmit);
    }


    if (response.status === 200 || response.status === 201) {
      alert('Application saved as draft successfully!');
      formData.value.isDraft = true; // Set draft flag
      formData.value.draftId = response.data.id; // Assuming the API returns the draft ID

    } else {
      alert('An error occurred while saving the draft.');
      console.error("API Error:", response);
    }
  } catch (error) {
    alert('An unexpected error occurred.');
    console.error("Draft Save Error:", error);
  }
};

const editDraft = () => {
  // In a real application, you would probably fetch the draft data from the server
  // using the draftId and then populate the formData.  For this example, we'll
  // just set isDraft to false, which will allow editing of the current form data.
    if (formData.value.draftId) {
      formData.value.isDraft = false; // Allow editing
    // Ideally fetch the draft data using draftId. For now, we will edit on the existing data.
   }
};

// --- Validation Function ---
const validateForm = () => {
    let isValid = true;
    if (!formData.value.contact_no) {
        alert('Contact Number is required.');
        isValid = false;
    }
    if (!formData.value.email_address || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email_address)) {
        alert('Please enter a valid Email Address.');
        isValid = false;
    }
    if (formData.value.location === null) {
        alert("Please select a Location");
        isValid = false;
    }
    if (!formData.value.guarantor_full_name) {
        alert("Guarantor Full Name is required");
        isValid = false;
    }
    if (formData.value.declaration !== 1) { // Check if declaration is "Agree" (ID 1)
        alert('You must agree to the declaration to submit.');
        isValid = false;
    }
    return isValid;
};

// --- Data Preparation Function ---
const prepareDataForSubmission = async () => {
    const data = JSON.parse(JSON.stringify(formData.value));

    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const convertFiles = async (data) => {
        if (data.cv) {
            data.cv = await toBase64(data.cv);
        }
        if (data.cid_copy) {
            data.cid_copy = await toBase64(data.cid_copy);
        }
        if (data.linkages && Array.isArray(data.linkages)) {
            for (const linkage of data.linkages) {
                if (linkage.recognition) {
                    linkage.recognition = await toBase64(linkage.recognition)
                }
                if (linkage.approval) {
                    linkage.approval = await toBase64(linkage.approval)
                }
            }
        }
        return data;
    };
    return await convertFiles(data);
};
// --- Fetch Master Data --- (Modified)
const fetchMasterData = async () => {
  try {
    // No API calls for now, since we're using all static data
  } catch (error) {
    console.error("Error fetching master data:", error);
    alert("Failed to load master data.  Please refresh the page.");
  }
};

// --- Reset Form Function ---
const resetForm = () => {
    formData.value = JSON.parse(JSON.stringify({
    cid_no: '',
    applicant_name: '',
    gender: '',
    date_of_birth: '',
    contact_no: '',
    email_address: '',
    office_number: '',
    flat_no: '',
    building_no: '',
    location: null,
    gewog_throm: null,
    dzongkhag_thromde: null,
    qualification: '',
    institute_name: '',
    university_name: '',
    proposed_firm_name: '',
    proposed_firm_address: '',
    proposed_firm_location: null,
    firm_type: null,
    vision: '',
    mission: '',
    objective: '',
    linkages: [],
    finance_plan_details: '',
    services: [],
    strengths: '',
    weaknesses: '',
    opportunities: '',
    threats: '',
    fees: [],
    guarantor_full_name: '',
    guarantor_cid_number: '',
    relation_to_applicant: '',
    guarantor_contact_number: '',
    cid_copy: null,
    cv: null,
    declaration: null,
    isDraft: false,
    draftId: null
  }));
};

const autoPopulate = async () => {
  try {
    const cid = formData.value.cid_no;
    if (!cid) return;
        if (typeof apiServices.getUserByCID === 'function') {
             const userDetails = await apiServices.getUserByCID(cid);
              if (userDetails.data) {
                formData.value.applicant_name = userDetails.data.name;
                formData.value.gender = userDetails.data.gender;
                formData.value.date_of_birth = userDetails.data.dob;
              }
        } else {
          console.error("apiServices.getUserByCID is not a function");
        }

  } catch (error) {
    console.error("Error fetching user details:", error);
    alert("Could not auto-populate user details.");
  }
};

watch(() => formData.value.cid_no, autoPopulate);

onMounted(() => {
  fetchMasterData(); //Still call fetchMasterData, in case we add API calls later
    // Check if there's a draft ID in, for example, query parameters or local storage.
  // If so, fetch the draft data and populate the form.  This is just an example;
  // you'll need to adapt it to your specific draft loading mechanism.
  const urlParams = new URLSearchParams(window.location.search);
  const draftIdFromUrl = urlParams.get('draftId');

  if (draftIdFromUrl) {
        loadDraft(draftIdFromUrl);
  }
});

// Load draft data (example - adapt to your API)
const loadDraft = async (draftId) => {
    try {
        const response = await apiServices.getEcpfDraft(draftId); // You need to implement this in services.js
        if (response.status === 200) {
            // Populate formData with the draft data
            Object.assign(formData.value, response.data); // Use Object.assign for reactivity
            formData.value.isDraft = true;
            formData.value.draftId = draftId;
        } else {
            console.error("Failed to load draft:", response);
            alert("Failed to load draft.");
        }
    } catch (error) {
        console.error("Error loading draft:", error);
        alert("Error loading draft.");
    }
};
</script>
