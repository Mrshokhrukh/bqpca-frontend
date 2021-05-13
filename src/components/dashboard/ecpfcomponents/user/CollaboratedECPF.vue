<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">
        ECPF in Collaboration with External Party
      </h1>
      <p class="text-gray-600">
        Please fill in the details below for ECPF establishment in collaboration.
      </p>
    </div>

    <!-- Loading/Error/Success Messages -->
    <div v-if="isLoading && !formMessage.text" class="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
      <p>Loading initial data...</p>
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
      <p v-html="formMessage.text.replace(/\n/g, '<br />')"></p>
    </div>

    <!-- Form Section -->
    <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <form v-if="!isLoading || formMessage.text" @submit.prevent="submitForm" ref="formEl">
        <!-- Personal Information (Fetched from Auth Store) -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Personal Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="cid_no" class="block text-sm font-medium text-gray-700">CID No:</label>
              <input
                id="cid_no"
                type="text"
                v-model="formData.cid_no"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed"
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
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed"
                readonly
              />
            </div>
            <div>
              <label for="gender" class="block text-sm font-medium text-gray-700">Gender:</label>
              <input
                id="gender"
                type="text"
                v-model="formData.gender"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed"
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
                v-model="formData.date_of_birth"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed"
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

        <!-- Residential/Present Address -->
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
              <label for="dzongkhag_thromde" class="block text-sm font-medium text-gray-700"
                >Dzongkhag/Thromde:<span class="text-red-500">*</span></label
              >
              <select
                id="dzongkhag_thromde"
                v-model="formData.dzongkhag_thromde"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option disabled :value="null">-- Select Dzongkhag/Thromde --</option>
                <option v-for="dt in dzongkhagThromdes" :key="dt.id" :value="dt.id">
                  {{ dt.name }}
                </option>
              </select>
            </div>
            <div>
              <label for="gewog_throm" class="block text-sm font-medium text-gray-700"
                >Gewog/Throm:<span class="text-red-500">*</span></label
              >
              <select
                id="gewog_throm"
                v-model="formData.gewog_throm"
                :required="isGewogRequired()"
                :disabled="!formData.dzongkhag_thromde || (gewogThroms.length === 0 && dzongkhagHasGewogs(formData.dzongkhag_thromde))"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option disabled :value="null">-- Select Gewog/Throm --</option>
                <option v-if="formData.dzongkhag_thromde && gewogThroms.length === 0 && dzongkhagHasGewogs(formData.dzongkhag_thromde)" :value="null" disabled>
                  -- No Gewogs for selected Dzongkhag --
                </option>
                 <option v-if="formData.dzongkhag_thromde && !dzongkhagHasGewogs(formData.dzongkhag_thromde)" :value="NO_GEWOG_OPTION_VALUE" >
                  N/A (e.g. Thromde)
                </option>
                <option v-for="gt in gewogThroms" :key="gt.id" :value="gt.id">{{ gt.name }}</option>
              </select>
            </div>
             <div>
              <label for="location" class="block text-sm font-medium text-gray-700"
                >Village/Specific Location:<span class="text-red-500">*</span></label
              >
               <input
                id="location"
                type="text"
                v-model="formData.location"
                required
                placeholder="Enter village or specific area"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        <!-- Education Details -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Education Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="qualification" class="block text-sm font-medium text-gray-700"
                >Qualification:<span class="text-red-500">*</span></label
              >
              <input
                id="qualification"
                type="text"
                v-model="formData.qualification"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label for="education_institute_name" class="block text-sm font-medium text-gray-700"
                >Name of Institute:<span class="text-red-500">*</span></label
              >
              <input
                id="education_institute_name"
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

        <!-- ECPF in Collaboration Proposal Details -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">
            ECPF in Collaboration Proposal Details
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="existing_ecpf_name" class="block text-sm font-medium text-gray-700"
                >Existing ECPF Name (Institute):</label
              >
              <input
                id="existing_ecpf_name"
                type="text"
                v-model="formData.existing_ecpf_name"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed"
                readonly
              />
            </div>
            <div>
              <label for="existing_license_number" class="block text-sm font-medium text-gray-700"
                >Existing License Number of ECPF:</label
              >
              <input
                id="existing_license_number"
                type="text"
                v-model="formData.existing_license_number"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed"
                readonly
              />
            </div>
            <div>
              <label for="proposed_ecpf_name" class="block text-sm font-medium text-gray-700"
                >Proposed Name of ECPF (for Collaboration):<span class="text-red-500">*</span></label
              >
              <input
                id="proposed_ecpf_name"
                type="text"
                v-model="formData.proposed_ecpf_name"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label for="proposed_location" class="block text-sm font-medium text-gray-700"
                >Proposed Location (for Collaboration, if applicable):</label
              >
              <input
                id="proposed_location"
                type="text"
                v-model="formData.proposed_location"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        <!-- Details of External Party -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Details of External Party</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="collaborating_firm_name" class="block text-sm font-medium text-gray-700"
                >Name of the Collaborating Firm:<span class="text-red-500">*</span></label
              >
              <input
                id="collaborating_firm_name"
                type="text"
                v-model="formData.collaborating_firm_name"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label for="external_party_country" class="block text-sm font-medium text-gray-700"
                >External Party Based in (country):<span class="text-red-500">*</span></label
              >
              <select
                id="external_party_country"
                v-model="formData.external_party_country"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option disabled :value="null">-- Select Country --</option>
                <option v-for="country in countries" :key="country.code" :value="country.code">
                  {{ country.name }}
                </option>
              </select>
            </div>
            <div>
              <label for="external_party_state" class="block text-sm font-medium text-gray-700"
                >External Party Based in (State):<span class="text-red-500">*</span></label
              >
              <input
                id="external_party_state"
                type="text"
                v-model="formData.external_party_state"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label for="firm_registration_number" class="block text-sm font-medium text-gray-700"
                >Firm’s Registration Number:<span class="text-red-500">*</span></label
              >
              <input
                id="firm_registration_number"
                type="text"
                v-model="formData.firm_registration_number"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label for="proprietor_name" class="block text-sm font-medium text-gray-700"
                >Name of the Proprietor:<span class="text-red-500">*</span></label
              >
              <input
                id="proprietor_name"
                type="text"
                v-model="formData.proprietor_name"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label for="nationality" class="block text-sm font-medium text-gray-700"
                >Nationality:<span class="text-red-500">*</span></label
              >
              <input
                id="nationality"
                type="text"
                v-model="formData.nationality"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label for="designation" class="block text-sm font-medium text-gray-700"
                >Designation:<span class="text-red-500">*</span></label
              >
              <input
                id="designation"
                type="text"
                v-model="formData.designation"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label for="external_party_email" class="block text-sm font-medium text-gray-700"
                >Email Address:<span class="text-red-500">*</span></label
              >
              <input
                id="external_party_email"
                type="email"
                v-model="formData.external_party_email"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label for="external_party_contact" class="block text-sm font-medium text-gray-700"
                >Contact Number:<span class="text-red-500">*</span></label
              >
              <input
                id="external_party_contact"
                type="tel"
                v-model="formData.external_party_contact"
                required
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label for="website" class="block text-sm font-medium text-gray-700">Website:</label>
              <input
                id="website"
                type="url"
                v-model="formData.website"
                placeholder="https://example.com"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        <!-- Collaboration Details -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">
            Collaboration Details<span class="text-red-500">*</span>
          </h2>
          <textarea
            v-model="formData.collaboration_details"
            required
            class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="5"
            placeholder="Explain the type of collaboration & other related details"
          ></textarea>
        </section>

        <!-- Supporting Documents -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Supporting Documents</h2>
          <p class="text-sm text-gray-500 mb-4">
            Please upload required documents in PDF, JPG, PNG, DOC, or DOCX format. Max 5MB each.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="concern_letter" class="block text-sm font-medium text-gray-700"
                >Concern/Authorization Letter:<span class="text-red-500">*</span></label
              >
              <input
                id="concern_letter"
                type="file"
                @change="handleFileUpload($event, 'concern_letter')"
                :required="!getFileName('concern_letter')"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              <span v-if="getFileName('concern_letter')" class="text-xs text-gray-600 mt-1 block"
                >Selected: {{ getFileName('concern_letter') }}</span
              >
            </div>
            <div>
              <label for="passport_cv" class="block text-sm font-medium text-gray-700"
                >Passport & CV of Proprietor of External Party:<span class="text-red-500"
                  >*</span
                ></label
              >
              <input
                id="passport_cv"
                type="file"
                @change="handleFileUpload($event, 'passport_cv')"
                :required="!getFileName('passport_cv')"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              <span v-if="getFileName('passport_cv')" class="text-xs text-gray-600 mt-1 block"
                >Selected: {{ getFileName('passport_cv') }}</span
              >
            </div>
            <div>
              <label for="external_party_license" class="block text-sm font-medium text-gray-700"
                >License/Registration of External Party:<span class="text-red-500">*</span></label
              >
              <input
                id="external_party_license"
                type="file"
                @change="handleFileUpload($event, 'external_party_license')"
                :required="!getFileName('external_party_license')"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              <span
                v-if="getFileName('external_party_license')"
                class="text-xs text-gray-600 mt-1 block"
                >Selected: {{ getFileName('external_party_license') }}</span
              >
            </div>
            <div>
              <label for="mou" class="block text-sm font-medium text-gray-700"
                >Valid Signed MoU:<span class="text-red-500">*</span></label
              >
              <input
                id="mou"
                type="file"
                @change="handleFileUpload($event, 'mou')"
                :required="!getFileName('mou')"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              <span v-if="getFileName('mou')" class="text-xs text-gray-600 mt-1 block"
                >Selected: {{ getFileName('mou') }}</span
              >
            </div>
          </div>
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
            type="button"
            @click="editDraft"
            v-if="formData.isDraft && formData.draftId"
            :disabled="isSubmitting"
            class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Loading...' : 'Edit Draft' }}
          </button>
          <button
            type="submit"
            :disabled="!declarationAgreed || isSubmitting || (formData.isDraft && formData.draftId)"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Submitting...' : 'Submit' }}
          </button>
        </div>
      </form>
      <div v-else-if="isLoading" class="text-center py-10">
        <p>Loading form data...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import apiServices from '@/services/services'
import { useAuthStore } from '@/stores/authStore'
import { bhutanDzongkhagsGewogs } from '@/constants/dzongkhags.js'
import { countryData } from '@/constants/countries.js'

const authStore = useAuthStore()
const isLoading = ref(true)
const isSubmitting = ref(false)
const formMessage = reactive({ text: '', type: '' })
const formEl = ref(null)
const declarationAgreed = ref(false)

const NO_GEWOG_OPTION_VALUE = 'NO_GEWOG_APPLICABLE';

const getInitialFormData = () => ({
  cid_no: '',
  applicant_name: '',
  gender: '',
  date_of_birth: '',
  existing_ecpf_name: 'Loading...',
  existing_license_number: 'Loading...',
  contact_no: '',
  email_address: '',
  office_number: '',
  flat_no: '',
  building_no: '',
  location: '',
  gewog_throm: null,
  dzongkhag_thromde: null,
  qualification: '',
  institute_name: '',
  university_name: '',
  proposed_ecpf_name: '',
  proposed_location: '',
  collaborating_firm_name: '',
  external_party_country: null,
  external_party_state: '',
  firm_registration_number: '',
  proprietor_name: '',
  nationality: '',
  designation: '',
  external_party_email: '',
  external_party_contact: '',
  website: '',
  collaboration_details: '',
  concern_letter: null,
  passport_cv: null,
  external_party_license: null,
  mou: null,
  isDraft: false,
  draftId: null,
  declaration_agreed: false,
})

const formData = reactive(getInitialFormData())

const gewogThroms = ref([])
const dzongkhagThromdes = ref([])
const countries = ref([])

const isFileObject = (value) => {
  if (typeof File === 'function') {
    return value instanceof File;
  }
  // console.warn('[isFileObject] Global File constructor not available for instanceof check.');
  return false;
};

const generateId = (prefix, name) => {
  if (!name || typeof name !== 'string') return `${prefix}_unknown_${Date.now()}`;
  return `${prefix}_${name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/gi, '')}`;
};

const dzongkhagHasGewogs = (dzongkhagGeneratedId) => {
  if (!dzongkhagGeneratedId) return false;
  const selectedDzongkhagObj = bhutanDzongkhagsGewogs.find(
    dz => generateId('dz', dz.dzongkhag) === dzongkhagGeneratedId
  );
  return selectedDzongkhagObj && selectedDzongkhagObj.gewogs && selectedDzongkhagObj.gewogs.length > 0;
};

const isGewogRequired = () => {
    if (!formData.dzongkhag_thromde) return false;
    if (formData.gewog_throm === NO_GEWOG_OPTION_VALUE) return false;
    return dzongkhagHasGewogs(formData.dzongkhag_thromde);
};

watch(() => formData.dzongkhag_thromde, (newDzongkhagGeneratedId) => {
  formData.gewog_throm = null
  gewogThroms.value = []
  if (newDzongkhagGeneratedId) {
    const selectedDzongkhagObj = bhutanDzongkhagsGewogs.find(
      dz => generateId('dz', dz.dzongkhag) === newDzongkhagGeneratedId
    );
    if (selectedDzongkhagObj && selectedDzongkhagObj.gewogs && selectedDzongkhagObj.gewogs.length > 0) {
      gewogThroms.value = selectedDzongkhagObj.gewogs.map(gewogName => ({
        id: generateId(`gw_${selectedDzongkhagObj.dzongkhag}`, gewogName),
        name: gewogName
      }));
    } else if (selectedDzongkhagObj) {
        gewogThroms.value = [];
    }
  }
})

const setMessage = (text, type = 'error') => {
  formMessage.text = text
  formMessage.type = type
  window.scrollTo(0, 0)
}
const clearMessage = () => {
  formMessage.text = ''
  formMessage.type = ''
}
const getFileName = (fieldName) => {
  const file = formData[fieldName]
  if (isFileObject(file)) return file.name;
  if (typeof file === 'string' && file) return file;
  return '';
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];

const handleFileUpload = (event, fieldName) => {
  const file = event.target.files[0];
  if (!file) {
    formData[fieldName] = null;
    return;
  }
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
    setMessage(`Invalid file type. Allowed: ${ALLOWED_FILE_TYPES.join(', ')}`, 'error');
    event.target.value = '';
    formData[fieldName] = null;
    return;
  }
  if (file.size > MAX_FILE_SIZE) {
    setMessage(`File too large. Max size: 5MB.`, 'error');
    event.target.value = '';
    formData[fieldName] = null;
    return;
  }
  clearMessage();
  formData[fieldName] = file;
};

const prepareDataForSubmission = (status = 'submitted') => {
  // console.log('[prepareDataForSubmission] Preparing FormData for status:', status);
  const submissionFormData = new FormData();
  const hasOwnProperty = Object.prototype.hasOwnProperty;

  const fieldMapping = {
    proposed_ecpf_name: 'proposed_name',
    firm_registration_number: 'external_firm_registration_number',
    external_party_email: 'email',
    external_party_contact: 'contact_number',
    concern_letter: 'concern_authorization_letter',
    external_party_license: 'license_registration',
    mou: 'valid_mou',
  };

  for (const key in formData) {
    if (hasOwnProperty.call(formData, key)) {
      const value = formData[key];
      const nonSubmissionFields = [
        'isDraft', 'draftId', 'cid_no', 'applicant_name', 'gender', 'date_of_birth',
        'existing_ecpf_name', 'existing_license_number', 'declaration_agreed'
      ];
      if (nonSubmissionFields.includes(key)) continue;
      const backendKey = fieldMapping[key] || key;
      if (isFileObject(value)) {
        submissionFormData.append(backendKey, value, value.name);
      } else if (value !== null && value !== undefined && value !== '') {
        submissionFormData.append(backendKey, value);
      }
    }
  }
  submissionFormData.append('is_draft', status === 'draft'); // Send 'is_draft' boolean for backend
  submissionFormData.append('declaration_agreed', String(declarationAgreed.value));
  if (formData.existing_license_number && !formData.existing_license_number.startsWith('N/A') && formData.existing_license_number !== 'Loading...') {
    submissionFormData.append('existing_license_number', formData.existing_license_number);
  }

  // The following dzongkhag/gewog fields are for APPLICANT'S residential address,
  // not usually part of the ECPFCollaboration model itself.
  // If your ECPFCollaboration model needs a *proposed* dzongkhag/gewog for the *collaboration*,
  // ensure those are separate fields in formData (e.g., formData.collaboration_dzongkhag)
  // and append them here. The current dzongkhag_thromde and gewog_throm are related to applicant's address.

  // console.log('[prepareDataForSubmission] FormData content (keys should match backend ECPFCollaboration model):');
  // for (let pair of submissionFormData.entries()) {
  //   console.log(`  ${pair[0]}: ${isFileObject(pair[1]) ? `File(${pair[1].name})` : pair[1]}`);
  // }
  return submissionFormData;
}


const validateForm = () => {
  // console.log('[validateForm] Starting validation. typeof File:', typeof File);
  clearMessage();
  const errors = [];
  if (!formData.contact_no?.trim()) errors.push('Contact Number is required.');
  if (!formData.email_address?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_address)) {
    errors.push('Please enter a valid personal Email Address.');
  }
  if (formData.dzongkhag_thromde === null) errors.push('Please select a Dzongkhag/Thromde.');
  if (isGewogRequired() && formData.gewog_throm === null) {
    errors.push('Please select a Gewog/Throm.');
  }
  if (!formData.location?.trim()) errors.push('Village/Specific Location is required.');
  if (!formData.qualification?.trim()) errors.push('Qualification is required.');
  if (!formData.institute_name?.trim()) errors.push('Name of Institute (Education Details) is required.');
  if (!formData.university_name?.trim()) errors.push('Name of University (Education Details) is required.');
  if (!formData.proposed_ecpf_name?.trim()) errors.push('Proposed Name of ECPF (for Collaboration) is required.');
  if (!formData.collaborating_firm_name?.trim()) errors.push('Name of the Collaborating Firm is required.');
  if (formData.external_party_country === null) errors.push('External Party Country is required.');
  if (!formData.external_party_state?.trim()) errors.push('External Party State is required.');
  if (!formData.firm_registration_number?.trim()) errors.push("Firm’s Registration Number is required.");
  if (!formData.proprietor_name?.trim()) errors.push("Name of the Proprietor (External Party) is required.");
  if (!formData.nationality?.trim()) errors.push('Nationality (External Party) is required.');
  if (!formData.designation?.trim()) errors.push('Designation (External Party) is required.');
  if (!formData.external_party_email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.external_party_email)) {
    errors.push('Please enter a valid Email Address for the external party.');
  }
  if (!formData.external_party_contact?.trim()) errors.push('Contact Number (External Party) is required.');
  if (!formData.collaboration_details?.trim()) errors.push('Collaboration Details are required.');
  if (!(typeof formData.concern_letter === 'string' && formData.concern_letter) && !isFileObject(formData.concern_letter)) {
    errors.push('Concern/Authorization Letter is required.');
  }
  if (!(typeof formData.passport_cv === 'string' && formData.passport_cv) && !isFileObject(formData.passport_cv)) {
    errors.push('Passport & CV file is required.');
  }
  if (!(typeof formData.external_party_license === 'string' && formData.external_party_license) && !isFileObject(formData.external_party_license)) {
    errors.push('External Party License file is required.');
  }
  if (!(typeof formData.mou === 'string' && formData.mou) && !isFileObject(formData.mou)) {
    errors.push('Valid Signed MoU file is required.');
  }
  if (!declarationAgreed.value) errors.push('You must agree to the declaration to submit.');
  if (errors.length > 0) {
    setMessage(`Please fix the following errors:\n- ${errors.join('\n- ')}`);
    return false;
  }
  // console.log('[validateForm] Validation successful.');
  return true;
};

const fetchMasterData = async () => {
  try {
    // console.log('[fetchMasterData] Populating master data...');
    dzongkhagThromdes.value = bhutanDzongkhagsGewogs.map(item => ({
      id: generateId('dz', item.dzongkhag),
      name: item.dzongkhag
    }));
    countries.value = countryData;
    // console.log('[fetchMasterData] Master data for Dzongkhags/Thromdes and Countries loaded.');
  } catch (error) {
    console.error('[fetchMasterData] Error processing master data:', error);
    setMessage('Failed to load dropdown options. Please try refreshing.', 'error');
  }
}

const fetchExistingEcpfDetails = async (cid) => {
  if (!cid) {
    // console.warn('[fetchExistingEcpfDetails] Called without CID.');
    return null;
  }
  if (typeof apiServices.getEcpfDetailsByCID !== 'function') {
    console.error('[fetchExistingEcpfDetails] CRITICAL: apiServices.getEcpfDetailsByCID method is not defined.');
    formData.existing_ecpf_name = 'N/A (Service Error)';
    formData.existing_license_number = 'N/A (Service Error)';
    return null;
  }
  // console.log(`[fetchExistingEcpfDetails] Fetching existing ECPF details for CID: ${cid}...`);
  try {
    const response = await apiServices.getEcpfDetailsByCID(cid);
    if (response && response.data) {
      if (Object.keys(response.data).length === 0 && response.data.constructor === Object) {
        // console.warn(`[fetchExistingEcpfDetails] API returned an empty data object for ECPF details (CID: ${cid}).`);
        return null;
      }
      // console.log('[fetchExistingEcpfDetails] Successfully fetched ECPF details, returning data.');
      return response.data;
    } else if (response && response.status === 404) {
        // console.log(`[fetchExistingEcpfDetails] No existing ECPF found for CID: ${cid} (API 404). Returning null.`);
        return null;
    } else {
      // console.warn(`[fetchExistingEcpfDetails] API call for ECPF (CID: ${cid}) did not return expected data. Resp status: ${response?.status}. Returning null.`);
      return null;
    }
  } catch (error) {
    // console.error(`[fetchExistingEcpfDetails] Error fetching ECPF details for CID ${cid}:`, error, ". Returning null.");
    if (error.response && error.response.status === 404) {
        // console.log(`[fetchExistingEcpfDetails] No existing ECPF found for CID: ${cid} (Caught 404). Returning null.`);
        return null;
    }
    formData.existing_ecpf_name = 'N/A (Fetch Error)';
    formData.existing_license_number = 'N/A (Fetch Error)';
    return null;
  }
};

const submitForm = async () => {
  if (!validateForm()) {
    // console.log('[submitForm] Validation failed.'); // Already handled by validateForm's setMessage
    return;
  }
  isSubmitting.value = true;
  clearMessage(); // Clear previous messages now that validation passed
  // console.log('[submitForm] Attempting submission...');

  try {
    const dataToSubmit = prepareDataForSubmission('submitted');
    let response;
    const apiCreateMethod = 'createEcpfCollaboration';
    const apiUpdateMethod = 'updateCollaborationEcpf';

    if (formData.draftId && typeof apiServices[apiUpdateMethod] === 'function') {
      // console.log('[submitForm] Updating existing collaboration draft ID:', formData.draftId);
      response = await apiServices[apiUpdateMethod](formData.draftId, dataToSubmit);
    } else if (typeof apiServices[apiCreateMethod] === 'function') {
      // console.log('[submitForm] Creating new collaboration.');
      response = await apiServices[apiCreateMethod](dataToSubmit);
    } else {
      throw new Error(`API method for submission not found.`);
    }

    // console.log('[submitForm] API Response:', response);

    if (response?.status === 200 || response?.status === 201) {
      // console.log('[submitForm] Submission successful. Resetting form and showing message.');
      resetForm(false);
      setMessage('Application submitted successfully!', 'success');
    } else {
      const errorDetail = response?.data ? (response.data.detail || JSON.stringify(response.data)) : `Status: ${response?.statusText || response?.status || 'Unknown'}`;
      // console.error('[submitForm] Submission failed with response:', response);
      throw new Error(`Submission failed: ${errorDetail}`);
    }
  } catch (error) {
    console.error('[submitForm] Error during submission:', error);
    const messagePrefix = "Submission failed:";
    if (error.message && error.message.startsWith(messagePrefix)) {
        setMessage(error.message);
    } else {
        setMessage(`${messagePrefix} ${error.message || 'An unexpected error occurred.'}`);
    }
  } finally {
    isSubmitting.value = false;
    // console.log('[submitForm] Submission process ended. isSubmitting:', isSubmitting.value);
  }
}

const saveAsDraft = async () => {
  isSubmitting.value = true;
  clearMessage();
  // console.log('[saveAsDraft] Attempting to save as draft...');
  try {
    const dataToSubmit = prepareDataForSubmission('draft');
    let response;
    const apiCreateMethod = 'saveCollaborationEcpfDraft';
    const apiUpdateMethod = 'updateCollaborationEcpfDraft';
    if (formData.draftId && typeof apiServices[apiUpdateMethod] === 'function') {
      response = await apiServices[apiUpdateMethod](formData.draftId, dataToSubmit);
    } else if (typeof apiServices[apiCreateMethod] === 'function') {
      response = await apiServices[apiCreateMethod](dataToSubmit);
    } else {
      throw new Error(`API method for draft operation not found.`);
    }
    if (response?.status === 200 || response?.status === 201) {
      if (!formData.draftId && response?.data?.id) {
        formData.draftId = response.data.id;
      }
      formData.isDraft = true;
      setMessage(`Draft saved. ${formData.draftId ? `(ID: ${formData.draftId})` : ''}`, 'success');
    } else {
       const errorDetail = response?.data ? (response.data.detail || JSON.stringify(response.data)) : `Status: ${response?.statusText || response?.status || 'Unknown'}`;
       throw new Error(`Draft save failed: ${errorDetail}`);
    }
  } catch (error) {
    console.error('[saveAsDraft] Error saving draft:', error);
    setMessage(error.message || 'Draft save failed due to an unexpected error.');
  } finally {
    isSubmitting.value = false;
  }
}

const loadDraft = async (id) => {
  if (!id) return;
  isLoading.value = true;
  clearMessage();
  // console.log(`[loadDraft] Attempting to load draft with ID: ${id}`);
  if (typeof apiServices.getCollaborationEcpfDraft !== 'function') {
    setMessage("API method 'getCollaborationEcpfDraft' missing.", 'error');
    isLoading.value = false;
    return;
  }
  try {
    const response = await apiServices.getCollaborationEcpfDraft(id);
    if (response?.data) {
      const draftData = response.data;
      // console.log('[loadDraft] Draft data received:', JSON.parse(JSON.stringify(draftData)));
      const preservedUserDetails = {
        cid_no: formData.cid_no,
        applicant_name: formData.applicant_name,
        gender: formData.gender,
        date_of_birth: formData.date_of_birth,
        contact_no: formData.contact_no || draftData.contact_no,
        email_address: formData.email_address || draftData.email_address,
      };
      Object.assign(formData, getInitialFormData(), draftData, preservedUserDetails);

      const backendToFrontendMapping = {
        proposed_name: 'proposed_ecpf_name',
        external_firm_registration_number: 'firm_registration_number',
        email: 'external_party_email',
        contact_number: 'external_party_contact',
        concern_authorization_letter: 'concern_letter',
        license_registration: 'external_party_license',
        valid_mou: 'mou',
      };
      for(const backendKey in backendToFrontendMapping) {
        if (hasOwnProperty.call(draftData, backendKey) && draftData[backendKey]) { // Use hasOwnProperty here
            formData[backendToFrontendMapping[backendKey]] = draftData[backendKey];
        }
      }

      if (draftData.dzongkhag_thromde) {
          const dzMatch = dzongkhagThromdes.value.find(d => d.name === draftData.dzongkhag_thromde);
          formData.dzongkhag_thromde = dzMatch ? dzMatch.id : null;
      }

      if (formData.dzongkhag_thromde) {
        const selectedDzOriginal = bhutanDzongkhagsGewogs.find(
            dz => generateId('dz', dz.dzongkhag) === formData.dzongkhag_thromde
        );
        if (selectedDzOriginal?.gewogs?.length > 0) {
          gewogThroms.value = selectedDzOriginal.gewogs.map(gewogName => ({
            id: generateId(`gw_${selectedDzOriginal.dzongkhag}`, gewogName),
            name: gewogName
          }));
          if (draftData.gewog_throm && draftData.gewog_throm !== "N/A") {
              const gwMatch = gewogThroms.value.find(g => g.name === draftData.gewog_throm);
              formData.gewog_throm = gwMatch ? gwMatch.id : null;
          } else if (draftData.gewog_throm === "N/A") {
              formData.gewog_throm = NO_GEWOG_OPTION_VALUE;
          }
        } else {
          gewogThroms.value = [];
          if(draftData.gewog_throm === "N/A") {
             formData.gewog_throm = NO_GEWOG_OPTION_VALUE;
          }
        }
      }
      formData.draftId = id;
      formData.isDraft = true;
      declarationAgreed.value = String(draftData.declaration_agreed_form).toLowerCase() === 'true' || draftData.declaration_agreed === true; // Handle string "true" or boolean true

      setMessage(`Draft loaded (ID: ${id}). Click 'Edit Draft' to modify and submit.`, 'success');
    } else {
      throw new Error('Draft data not found.');
    }
  } catch (error) {
    console.error('[loadDraft] Error loading draft:', error);
    setMessage(`Failed to load draft (ID: ${id}): ${error.message || 'Error'}. New form.`, 'error');
    resetForm(true);
  }
}

const editDraft = () => {
  if (formData.draftId) {
    formData.isDraft = false;
    // console.log('[editDraft] Draft unlocked. formData.isDraft set to false.');
    setMessage('Draft unlocked. You can now modify and submit the application.', 'success');
  } else {
    // console.warn('[editDraft] Clicked but no draftId found in formData.');
  }
};

const resetForm = (fullReset = false) => {
  // console.log('[resetForm] Resetting form. Full reset:', fullReset);
  const initialUserDetails = fullReset ? {} : {
    cid_no: formData.cid_no,
    applicant_name: formData.applicant_name,
    gender: formData.gender,
    date_of_birth: formData.date_of_birth,
    contact_no: formData.contact_no,
    email_address: formData.email_address,
    existing_ecpf_name: formData.existing_ecpf_name,
    existing_license_number: formData.existing_license_number,
  }
  Object.assign(formData, getInitialFormData(), initialUserDetails)

  declarationAgreed.value = false
  if (fullReset) {
      formData.draftId = null;
      formData.isDraft = false;
  }

  clearMessage()
  if (formEl.value) {
    formEl.value.reset();
    formData.concern_letter = null;
    formData.passport_cv = null;
    formData.external_party_license = null;
    formData.mou = null;
  }
  gewogThroms.value = [];
}

onMounted(async () => {
  isLoading.value = true;
  clearMessage();
  authStore.initializeAuth();
  let userCid = null;
  if (authStore.isAuthenticated && authStore.user) {
    formData.cid_no = authStore.user.cid || authStore.user.cid_number || '';
    formData.applicant_name = authStore.fullName || '';
    formData.gender = authStore.gender || '';
    formData.date_of_birth = authStore.dateOfBirthFormatted || authStore.user.dob || authStore.dateOfBirth || '';
    formData.contact_no = authStore.contactNumber || authStore.user.mobile_number || '';
    formData.email_address = authStore.email || authStore.user.email || '';
    userCid = formData.cid_no;
  } else {
    setMessage('Not logged in. Please log in to continue.', 'error');
    formData.existing_ecpf_name = 'N/A';
    formData.existing_license_number = 'N/A';
    isLoading.value = false;
    return;
  }
  await fetchMasterData();
  if (userCid) {
    const existingEcpf = await fetchExistingEcpfDetails(userCid);
    if (existingEcpf) {
      formData.existing_ecpf_name = existingEcpf.institute_name || 'N/A (Institute Name not found)';
      formData.existing_license_number = existingEcpf.license_number || 'N/A (License # not found)';
    } else {
      formData.existing_ecpf_name = 'N/A';
      formData.existing_license_number = 'N/A';
    }
  } else {
    formData.existing_ecpf_name = 'N/A (No CID)';
    formData.existing_license_number = 'N/A (No CID)';
  }
  const urlParams = new URLSearchParams(window.location.search);
  const draftIdFromUrl = urlParams.get('draftId');
  if (draftIdFromUrl) {
    const tempEcpfName = formData.existing_ecpf_name;
    const tempLicenseNo = formData.existing_license_number;
    await loadDraft(draftIdFromUrl);
    if (tempEcpfName && !tempEcpfName.startsWith('N/A') && tempEcpfName !== 'Loading...') {
        formData.existing_ecpf_name = tempEcpfName;
    }
    if (tempLicenseNo && !tempLicenseNo.startsWith('N/A') && tempLicenseNo !== 'Loading...') {
        formData.existing_license_number = tempLicenseNo;
    }
  } else {
    formData.isDraft = false;
  }
  isLoading.value = false;
  // console.log('[MOUNTED] Hook completed. isLoading:', isLoading.value);
});
</script>

<style scoped>
input:read-only,
input[readonly] {
  cursor: not-allowed;
  background-color: #f3f4f6;
  opacity: 0.7;
}
select:disabled {
  background-color: #f3f4f6;
  opacity: 0.7;
  cursor: not-allowed;
}
</style>