<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
    <h1 class="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 border-b pb-4">
      New ECPF Establishment Application
    </h1>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      <p class="ml-4 text-white text-xl">Processing...</p>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded break-words">
      <p><strong>Error:</strong> {{ errorMessage }}</p>
    </div>

    <!-- Success Message -->
     <div v-if="successMessage" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
        <p>{{ successMessage }}</p>
     </div>

    <form @submit.prevent="handleSubmit" class="space-y-8">

      <!-- Applicant Details (Auto-fetched) -->
      <section class="p-6 bg-white rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4 text-indigo-700">Applicant Details (Auto-fetched)</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">CID No.</label>
            <input type="text" :value="formData.applicant.cid" disabled class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Applicant's Name</label>
            <input type="text" :value="formData.applicant.name" disabled class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Gender</label>
            <input type="text" :value="formData.applicant.gender" disabled class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input type="text" :value="formData.applicant.dob" disabled class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm">
          </div>
        </div>
      </section>

      <!-- Contact & Address Details -->
      <section class="p-6 bg-white rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4 text-indigo-700">Contact & Address Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Contact Info -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-800">Contact Information</h3>
            <div>
              <label for="contactNo" class="block text-sm font-medium text-gray-700">Contact No. <span class="text-red-500">*</span></label>
              <input type="tel" id="contactNo" v-model="formData.contact.contactNo" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email Address <span class="text-red-500">*</span></label>
              <input type="email" id="email" v-model="formData.contact.email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            </div>
          </div>

          <!-- Residential/Present Address -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-800">Residential/Present Address</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="resOfficeNo" class="block text-sm font-medium text-gray-700">Office No.</label>
                <input type="text" id="resOfficeNo" v-model="formData.presentAddress.officeNumber" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
              <div>
                <label for="resFlatNo" class="block text-sm font-medium text-gray-700">Flat No.</label>
                <input type="text" id="resFlatNo" v-model="formData.presentAddress.flatNo" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
              <div>
                <label for="resBuildingNo" class="block text-sm font-medium text-gray-700">Building No.</label>
                <input type="text" id="resBuildingNo" v-model="formData.presentAddress.buildingNo" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
              <div>
                <label for="resLocation" class="block text-sm font-medium text-gray-700">Location <span class="text-red-500">*</span></label>
                <input type="text" id="resLocation" v-model="formData.presentAddress.location" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
              <div>
                <label for="resGewog" class="block text-sm font-medium text-gray-700">Gewog/Throm <span class="text-red-500">*</span></label>
                <!-- Ensure key and value match expected data format -->
                <select id="resGewog" v-model="formData.presentAddress.gewogThrom" required class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option disabled value="">Select Gewog/Throm</option>
                  <option v-for="option in masterData.gewogs" :key="option.id || option.name" :value="option.id || option.name">{{ option.name }}</option>
                </select>
              </div>
              <div>
                <label for="resDzongkhag" class="block text-sm font-medium text-gray-700">Dzongkhag/Thromde <span class="text-red-500">*</span></label>
                 <!-- Ensure key and value match expected data format -->
                <select id="resDzongkhag" v-model="formData.presentAddress.dzongkhagThromde" required class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option disabled value="">Select Dzongkhag/Thromde</option>
                  <option v-for="option in masterData.dzongkhags" :key="option.id || option.name" :value="option.id || option.name">{{ option.name }}</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Permanent Address -->
          <div class="space-y-4 md:col-span-2">
            <h3 class="text-lg font-medium text-gray-800">Permanent Address</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label for="permVillage" class="block text-sm font-medium text-gray-700">Village/Chiwog <span class="text-red-500">*</span></label>
                <input type="text" id="permVillage" v-model="formData.permanentAddress.villageChiwog" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
              <div>
                <label for="permGewog" class="block text-sm font-medium text-gray-700">Gewog <span class="text-red-500">*</span></label>
                <!-- Ensure key and value match expected data format -->
                <select id="permGewog" v-model="formData.permanentAddress.gewog" required class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option disabled value="">Select Gewog</option>
                  <option v-for="option in masterData.gewogs" :key="option.id || option.name" :value="option.id || option.name">{{ option.name }}</option>
                </select>
              </div>
              <div>
                <label for="permDungkhag" class="block text-sm font-medium text-gray-700">Dungkhag</label>
                 <!-- Ensure key and value match expected data format -->
                 <select id="permDungkhag" v-model="formData.permanentAddress.dungkhag" class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="">Select Dungkhag (if applicable)</option>
                  <option v-for="option in masterData.dungkhags" :key="option.id || option.name" :value="option.id || option.name">{{ option.name }}</option>
                </select>
              </div>
              <div>
                <label for="permDzongkhag" class="block text-sm font-medium text-gray-700">Dzongkhag/Thromde <span class="text-red-500">*</span></label>
                 <!-- Ensure key and value match expected data format -->
                 <select id="permDzongkhag" v-model="formData.permanentAddress.dzongkhagThromde" required class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option disabled value="">Select Dzongkhag/Thromde</option>
                  <option v-for="option in masterData.dzongkhags" :key="option.id || option.name" :value="option.id || option.name">{{ option.name }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Education Details -->
      <section class="p-6 bg-white rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4 text-indigo-700">Education Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label for="qualification" class="block text-sm font-medium text-gray-700">Highest Qualification <span class="text-red-500">*</span></label>
                  <input type="text" id="qualification" v-model="formData.education.qualification" list="qualificationsList" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., Bachelors Degree, Class XII, PhD">
                  <datalist id="qualificationsList">
                      <option value="PhD"></option>
                      <option value="Masters Degree"></option>
                      <option value="Bachelors Degree"></option>
                      <option value="Diploma"></option>
                      <option value="Class XII"></option>
                      <option value="Class X"></option>
                  </datalist>
              </div>
              <div>
                  <label for="institute" class="block text-sm font-medium text-gray-700">Name of Institute/University <span class="text-red-500">*</span></label>
                  <input type="text" id="institute" v-model="formData.education.instituteName" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter institute name">
              </div>
          </div>
      </section>

      <!-- ECPF Establishment Proposal Details -->
      <section class="p-6 bg-white rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4 text-indigo-700">ECPF Establishment Proposal Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                  <div>
                      <label for="proposalName" class="block text-sm font-medium text-gray-700">Proposed Name <span class="text-red-500">*</span></label>
                      <input type="text" id="proposalName" v-model="formData.proposal.name" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  </div>
                  <div>
                      <label for="proposalAddress" class="block text-sm font-medium text-gray-700">Proposed Address <span class="text-red-500">*</span></label>
                      <input type="text" id="proposalAddress" v-model="formData.proposal.address" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Full address details">
                  </div>
              </div>
              <div class="space-y-4">
                  <div>
                      <label for="proposalLocation" class="block text-sm font-medium text-gray-700">Proposed Location (Dzongkhag/Thromde) <span class="text-red-500">*</span></label>
                      <!-- Ensure key and value match expected data format -->
                      <select id="proposalLocation" v-model="formData.proposal.location" required class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <option disabled value="">Select Location</option>
                      <option v-for="option in masterData.dzongkhags" :key="option.id || option.name" :value="option.id || option.name">{{ option.name }}</option>
                      </select>
                  </div>
                  <div>
                      <label for="proposalFirmType" class="block text-sm font-medium text-gray-700">Type of Firm <span class="text-red-500">*</span></label>
                      <!-- Ensure key and value match expected data format -->
                      <select id="proposalFirmType" v-model="formData.proposal.firmType" required class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <option disabled value="">Select Firm Type</option>
                      <option v-for="option in masterData.firmTypes" :key="option.id || option.name" :value="option.id || option.name">{{ option.name }}</option>
                      </select>
                  </div>
              </div>
          </div>
      </section>

      <!-- Purpose of Establishment -->
      <section class="p-6 bg-white rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4 text-indigo-700">Purpose of Establishment</h2>
          <div class="space-y-4">
          <div>
              <label for="vision" class="block text-sm font-medium text-gray-700">Vision <span class="text-red-500">*</span></label>
              <textarea id="vision" v-model="formData.purpose.vision" rows="4" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
          </div>
          <div>
              <label for="mission" class="block text-sm font-medium text-gray-700">Mission <span class="text-red-500">*</span></label>
              <textarea id="mission" v-model="formData.purpose.mission" rows="4" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
          </div>
          <div>
              <label for="objective" class="block text-sm font-medium text-gray-700">Objective <span class="text-red-500">*</span></label>
              <textarea id="objective" v-model="formData.purpose.objective" rows="4" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
          </div>
          </div>
      </section>

      <!-- Institute/Colleges/University Linkages -->
      <section class="p-6 bg-white rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4 text-indigo-700">Institute/Colleges/University Linkages</h2>
          <div v-for="(linkage, index) in formData.linkages" :key="index" class="mb-6 p-4 border rounded-md relative">
              <button
                  type="button"
                  @click="removeLinkage(index)"
                  v-if="formData.linkages.length > 0"
                  class="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full bg-red-100 hover:bg-red-200"
                  aria-label="Remove Linkage"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                      <label :for="'linkName-' + index" class="block text-sm font-medium text-gray-700">Name</label>
                      <input type="text" :id="'linkName-' + index" v-model="linkage.name" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  </div>
                  <div>
                      <label :for="'linkLocation-' + index" class="block text-sm font-medium text-gray-700">Location</label>
                      <input type="text" :id="'linkLocation-' + index" v-model="linkage.location" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  </div>
                  <div>
                      <label :for="'linkCountry-' + index" class="block text-sm font-medium text-gray-700">Country</label>
                      <input type="text" :id="'linkCountry-' + index" v-model="linkage.country" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  </div>
                  <div class="md:col-span-2 lg:col-span-1">
                      <label :for="'linkRecognition-' + index" class="block text-sm font-medium text-gray-700">Recognition/Accreditation</label>
                      <input type="text" :id="'linkRecognition-' + index" v-model="linkage.recognition" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  </div>
                  <div class="md:col-span-2">
                      <label :for="'linkApproval-' + index" class="block text-sm font-medium text-gray-700">Approval from University</label>
                      <input type="text" :id="'linkApproval-' + index" v-model="linkage.approval" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  </div>
              </div>
          </div>
          <button type="button" @click="addLinkage" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Add Linkage
          </button>
      </section>

      <!-- Financial Capacity Details -->
      <section class="p-6 bg-white rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4 text-indigo-700">Financial Capacity Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
              <div>
                  <label for="financialStatement" class="block text-sm font-medium text-gray-700">Financial Statement Upload <span class="text-red-500">*</span></label>
                  <input type="file" id="financialStatement" @change="handleFileUpload($event, 'financialStatementFile')" required accept=".pdf,.doc,.docx,.xls,.xlsx,image/*" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                  <span v-if="formData.financialStatementFile" class="text-xs text-gray-600 mt-1 block">Selected: {{ formData.financialStatementFile.name }}</span>
              </div>
              <div>
                  <label for="budgetPlan" class="block text-sm font-medium text-gray-700">Budget Plan Upload <span class="text-red-500">*</span></label>
                  <input type="file" id="budgetPlan" @change="handleFileUpload($event, 'budgetPlanFile')" required accept=".pdf,.doc,.docx,.xls,.xlsx,image/*" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                  <span v-if="formData.budgetPlanFile" class="text-xs text-gray-600 mt-1 block">Selected: {{ formData.budgetPlanFile.name }}</span>
              </div>
          </div>
              <div>
                  <label for="sourceOfFunding" class="block text-sm font-medium text-gray-700">Source of Funding <span class="text-red-500">*</span></label>
                  <textarea id="sourceOfFunding" v-model="formData.financial.sourceOfFunding" rows="5" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
              </div>
          </div>
      </section>

      <!-- SWOT Analysis -->
      <section class="p-6 bg-white rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4 text-indigo-700">SWOT Analysis</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
              <label for="strengths" class="block text-sm font-medium text-gray-700">Strengths <span class="text-red-500">*</span></label>
              <textarea id="strengths" v-model="formData.swot.strengths" rows="4" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
          </div>
          <div>
              <label for="weaknesses" class="block text-sm font-medium text-gray-700">Weaknesses <span class="text-red-500">*</span></label>
              <textarea id="weaknesses" v-model="formData.swot.weaknesses" rows="4" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
          </div>
          <div>
              <label for="opportunities" class="block text-sm font-medium text-gray-700">Opportunities <span class="text-red-500">*</span></label>
              <textarea id="opportunities" v-model="formData.swot.opportunities" rows="4" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
          </div>
          <div>
              <label for="threats" class="block text-sm font-medium text-gray-700">Threats <span class="text-red-500">*</span></label>
              <textarea id="threats" v-model="formData.swot.threats" rows="4" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
          </div>
          </div>
      </section>

      <!-- Fee & Charges -->
      <section class="p-6 bg-white rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4 text-indigo-700">Fee & Charges</h2>
          <div v-for="(fee, index) in formData.fees" :key="index" class="mb-4 p-4 border rounded-md relative">
              <button
              type="button"
              @click="removeFee(index)"
              v-if="formData.fees.length > 1"
              class="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full bg-red-100 hover:bg-red-200"
              aria-label="Remove Fee"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
              <label :for="'feeBreakup-' + index" class="block text-sm font-medium text-gray-700">Fee Breakup <span class="text-red-500">*</span></label>
              <input type="text" :id="'feeBreakup-' + index" v-model="fee.breakup" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
              <div>
              <label :for="'feeDescription-' + index" class="block text-sm font-medium text-gray-700">Description</label>
              <input type="text" :id="'feeDescription-' + index" v-model="fee.description" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
              <div>
              <label :for="'feeAmount-' + index" class="block text-sm font-medium text-gray-700">Amount (Nu.) <span class="text-red-500">*</span></label>
              <input type="number" :id="'feeAmount-' + index" v-model.number="fee.amount" required min="0" step="any" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
              </div>
          </div>
          <div class="mt-4 flex items-center justify-between">
              <button type="button" @click="addFee" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Add Fee Item
              </button>
              <div class="text-right">
              <span class="text-lg font-semibold text-gray-800">Total Amount: Nu. {{ totalFeeAmount.toFixed(2) }}</span>
              </div>
          </div>
      </section>

      <!-- Guarantor Details -->
      <section class="p-6 bg-white rounded-lg shadow">
              <h2 class="text-xl font-semibold mb-4 text-indigo-700">Guarantor Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                  <label for="guarantorName" class="block text-sm font-medium text-gray-700">Full Name <span class="text-red-500">*</span></label>
                  <input type="text" id="guarantorName" v-model="formData.guarantor.fullName" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
              <div>
                  <label for="guarantorCid" class="block text-sm font-medium text-gray-700">CID Number <span class="text-red-500">*</span></label>
                  <input type="text" id="guarantorCid" v-model="formData.guarantor.cidNumber" required pattern="\d{11}" title="Enter 11 digit CID Number" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
              <div>
                  <label for="guarantorRelation" class="block text-sm font-medium text-gray-700">Relation <span class="text-red-500">*</span></label>
                  <input type="text" id="guarantorRelation" v-model="formData.guarantor.relation" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
              <div>
                  <label for="guarantorContact" class="block text-sm font-medium text-gray-700">Contact Number <span class="text-red-500">*</span></label>
                  <input type="tel" id="guarantorContact" v-model="formData.guarantor.contactNumber" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
              <div class="md:col-span-2 lg:col-span-1">
                  <label for="guarantorCidCopy" class="block text-sm font-medium text-gray-700">CID Copy Upload <span class="text-red-500">*</span></label>
                  <input type="file" id="guarantorCidCopy" @change="handleFileUpload($event, 'guarantorCidCopyFile')" required accept=".pdf,.jpg,.jpeg,.png" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                  <span v-if="formData.guarantorCidCopyFile" class="text-xs text-gray-600 mt-1 block">Selected: {{ formData.guarantorCidCopyFile.name }}</span>
              </div>
          </div>
      </section>

      <!-- Supporting Documents -->
      <section class="p-6 bg-white rounded-lg shadow">
              <h2 class="text-xl font-semibold mb-4 text-indigo-700">Supporting Documents</h2>
          <div>
              <label for="cvUpload" class="block text-sm font-medium text-gray-700">Applicant's CV Upload <span class="text-red-500">*</span></label>
              <input type="file" id="cvUpload" @change="handleFileUpload($event, 'cvFile')" required accept=".pdf,.doc,.docx" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
              <span v-if="formData.cvFile" class="text-xs text-gray-600 mt-1 block">Selected: {{ formData.cvFile.name }}</span>
              <p class="mt-1 text-xs text-gray-500">Please upload your latest Curriculum Vitae (PDF, DOC, DOCX format).</p>
          </div>
          <!-- Add other required supporting documents here -->
          <!-- Example:
          <div class="mt-4">
              <label for="otherDoc" class="block text-sm font-medium text-gray-700">Another Document <span class="text-red-500">*</span></label>
              <input type="file" id="otherDoc" @change="handleFileUpload($event, 'otherDocFile')" required accept=".pdf" class="..."/>
              <span v-if="formData.otherDocFile" class="text-xs text-gray-600 mt-1 block">Selected: {{ formData.otherDocFile.name }}</span>
          </div>
           -->
      </section>

      <!-- Declaration -->
      <section class="p-6 bg-white rounded-lg shadow">
              <h2 class="text-xl font-semibold mb-4 text-indigo-700">Declaration</h2>
          <div class="flex items-start">
          <div class="flex items-center h-5">
              <input id="declaration" name="declaration" type="checkbox" v-model="formData.declarationAgreed" required class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded">
          </div>
          <div class="ml-3 text-sm">
              <label for="declaration" class="font-medium text-gray-700">I hereby declare that the information provided above is true and correct to the best of my knowledge and I agree to the terms and conditions. <span class="text-red-500">*</span></label>
              <p class="text-gray-500">Agreeing to this declaration is mandatory for submission.</p>
          </div>
          </div>
      </section>

      <!-- Action Buttons -->
      <div class="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <button
          type="button"
          @click="handleSaveDraft"
          :disabled="isLoading"
          class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
          {{ isLoading ? 'Saving...' : 'Save as Draft' }}
          </button>
          <button
          type="submit"
          :disabled="!formData.declarationAgreed || isLoading"
          :class="[
              'inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white',
              formData.declarationAgreed && !isLoading
              ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer'
              : 'bg-indigo-300 cursor-not-allowed',
              'disabled:opacity-50 disabled:cursor-not-allowed'
          ]"
          >
          {{ isLoading ? 'Submitting...' : 'Submit Application' }}
          </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import apiServices from '@/services/services'; // Adjust path as needed

// --- Component State ---
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const draftId = ref(null); // To store the ID of a saved draft for potential updates

// --- Initial Form State (for resetting) ---
const getInitialFormData = () => ({
   applicant: { // Replace with actual auto-fetched data logic later
       cid: '11001001234', name: 'Dorji Wangchuk', gender: 'Male', dob: '1985-06-15'
   },
   contact: { contactNo: '', email: '' },
   presentAddress: { officeNumber: '', flatNo: '', buildingNo: '', location: '', gewogThrom: '', dzongkhagThromde: '' },
   permanentAddress: { villageChiwog: '', gewog: '', dungkhag: '', dzongkhagThromde: '' },
   education: { qualification: '', instituteName: '' },
   proposal: { name: '', address: '', location: '', firmType: '' },
   purpose: { vision: '', mission: '', objective: '' },
   linkages: [],
   financial: { sourceOfFunding: '' },
   swot: { strengths: '', weaknesses: '', opportunities: '', threats: '' },
   fees: [ { breakup: '', description: '', amount: null } ],
   guarantor: { fullName: '', cidNumber: '', relation: '', contactNumber: '' },
   // File refs should be reset to null
   financialStatementFile: null,
   budgetPlanFile: null,
   guarantorCidCopyFile: null,
   cvFile: null,
   // otherDocFile: null, // Add any other file refs here
   declarationAgreed: false,
});

// --- Reactive Form Data ---
const formData = reactive(getInitialFormData());

// --- Master Data ---
const masterData = reactive({
  gewogs: [],
  dzongkhags: [],
  dungkhags: [],
  firmTypes: [],
});

// --- Computed Properties ---
const totalFeeAmount = computed(() => {
    return formData.fees.reduce((total, fee) => {
     const amount = Number(fee.amount) || 0;
     return total + amount;
   }, 0);
});

// --- Methods ---

/** Fetch master data on component mount */
onMounted(async () => {
  // --- TODO: Implement logic to fetch auto-populated applicant data ---
  // Example: const applicantData = await apiServices.getCurrentApplicant();
  // Object.assign(formData.applicant, applicantData.data);

  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = ''; // Clear messages on mount
  console.log("Fetching master data...");
  try {
      // --- IMPORTANT: Add these methods to your apiServices ---
      const requiredMethods = ['getGewogs', 'getDzongkhags', 'getDungkhags', 'getFirmTypes'];
      const missingMethods = requiredMethods.filter(method => typeof apiServices[method] !== 'function');

      if (missingMethods.length > 0) {
          throw new Error(`Missing required methods in apiServices: ${missingMethods.join(', ')}`);
      }

      const [gewogsRes, dzongkhagsRes, dungkhagsRes, firmTypesRes] = await Promise.all([
          apiServices.getGewogs(),
          apiServices.getDzongkhags(),
          apiServices.getDungkhags(),
          apiServices.getFirmTypes()
      ]);

      // Assign data (adjust '.data' based on actual response structure)
      masterData.gewogs = gewogsRes?.data || [];
      masterData.dzongkhags = dzongkhagsRes?.data || [];
      masterData.dungkhags = dungkhagsRes?.data || [];
      masterData.firmTypes = firmTypesRes?.data || [];

      console.log("Master data fetched.");

  } catch (error) {
      console.error("Error fetching master data:", error);
      errorMessage.value = `Failed to load form prerequisites: ${error.message || 'Unknown error'}. Please try again later.`;
      // Consider disabling the form or parts of it if master data fails
  } finally {
      isLoading.value = false;
  }
});

/** Resets the form to its initial state */
const resetForm = () => {
    Object.assign(formData, getInitialFormData());
    draftId.value = null; // Clear draft ID on reset
    errorMessage.value = '';
    successMessage.value = '';

    // Manually reset file input fields in the DOM if necessary
    // This is often tricky, sometimes replacing the input element is easier
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => input.value = ''); // May not work consistently across browsers

    console.log("Form reset to initial state.");
};

/** Adds an empty linkage object */
const addLinkage = () => {
    formData.linkages.push({ name: '', location: '', country: '', recognition: '', approval: '' });
};
/** Removes a linkage by index */
const removeLinkage = (index) => {
    formData.linkages.splice(index, 1);
};

/** Adds an empty fee object */
const addFee = () => {
    formData.fees.push({ breakup: '', description: '', amount: null });
};
/** Removes a fee by index, ensuring at least one remains */
const removeFee = (index) => {
    if (formData.fees.length > 1) {
       formData.fees.splice(index, 1);
    } else {
        // Clear the fields of the last item instead of removing
        Object.assign(formData.fees[0], { breakup: '', description: '', amount: null });
        alert("At least one fee item is required.");
    }
};

/** Handles file input changes */
const handleFileUpload = (event, fieldName) => {
    const file = event.target.files[0];
    formData[fieldName] = file || null; // Assign file or null if cleared
};

/**
 * Prepares the FormData object for API submission.
 * @param {('submitted'|'draft')} status - The status to send to the backend.
 * @returns {FormData} The prepared FormData object.
 */
const prepareFormData = (status) => {
    const submissionData = new FormData();

    // --- Append All Form Fields ---
    // !! VERIFY THESE FIELD NAMES WITH YOUR BACKEND !!
    submissionData.append('applicant_cid', formData.applicant.cid);
    submissionData.append('applicant_name', formData.applicant.name);
    submissionData.append('applicant_gender', formData.applicant.gender);
    submissionData.append('applicant_dob', formData.applicant.dob);

    submissionData.append('contact_no', formData.contact.contactNo);
    submissionData.append('email', formData.contact.email);

    submissionData.append('present_address_office_number', formData.presentAddress.officeNumber);
    submissionData.append('present_address_flat_no', formData.presentAddress.flatNo);
    submissionData.append('present_address_building_no', formData.presentAddress.buildingNo);
    submissionData.append('present_address_location', formData.presentAddress.location);
    submissionData.append('present_address_gewog_throm', formData.presentAddress.gewogThrom); // Send ID or Name based on backend
    submissionData.append('present_address_dzongkhag_thromde', formData.presentAddress.dzongkhagThromde); // Send ID or Name based on backend

    submissionData.append('permanent_address_village_chiwog', formData.permanentAddress.villageChiwog);
    submissionData.append('permanent_address_gewog', formData.permanentAddress.gewog); // Send ID or Name
    submissionData.append('permanent_address_dungkhag', formData.permanentAddress.dungkhag); // Send ID or Name
    submissionData.append('permanent_address_dzongkhag_thromde', formData.permanentAddress.dzongkhagThromde); // Send ID or Name

    submissionData.append('education_qualification', formData.education.qualification);
    submissionData.append('education_institute_name', formData.education.instituteName);

    submissionData.append('proposal_name', formData.proposal.name);
    submissionData.append('proposal_address', formData.proposal.address);
    submissionData.append('proposal_location', formData.proposal.location); // Send ID or Name
    submissionData.append('proposal_firm_type', formData.proposal.firmType); // Send ID or Name

    submissionData.append('purpose_vision', formData.purpose.vision);
    submissionData.append('purpose_mission', formData.purpose.mission);
    submissionData.append('purpose_objective', formData.purpose.objective);

    submissionData.append('financial_source_of_funding', formData.financial.sourceOfFunding);

    submissionData.append('swot_strengths', formData.swot.strengths);
    submissionData.append('swot_weaknesses', formData.swot.weaknesses);
    submissionData.append('swot_opportunities', formData.swot.opportunities);
    submissionData.append('swot_threats', formData.swot.threats);

    submissionData.append('guarantor_full_name', formData.guarantor.fullName);
    submissionData.append('guarantor_cid_number', formData.guarantor.cidNumber);
    submissionData.append('guarantor_relation', formData.guarantor.relation);
    submissionData.append('guarantor_contact_number', formData.guarantor.contactNumber);

    // Append Arrays as JSON strings (Backend needs to parse)
    submissionData.append('linkages', JSON.stringify(formData.linkages));
    submissionData.append('fees', JSON.stringify(formData.fees));

    // --- Append Files (use exact backend field names) ---
    if (formData.financialStatementFile) {
        submissionData.append('financial_statement_file', formData.financialStatementFile, formData.financialStatementFile.name);
    }
    if (formData.budgetPlanFile) {
        submissionData.append('budget_plan_file', formData.budgetPlanFile, formData.budgetPlanFile.name);
    }
    if (formData.guarantorCidCopyFile) {
        submissionData.append('guarantor_cid_copy_file', formData.guarantorCidCopyFile, formData.guarantorCidCopyFile.name);
    }
    if (formData.cvFile) {
        submissionData.append('cv_file', formData.cvFile, formData.cvFile.name);
    }
    // if (formData.otherDocFile) { // Example for other files
    //     submissionData.append('other_doc_file', formData.otherDocFile, formData.otherDocFile.name);
    // }

    // Append Status & Declaration
    submissionData.append('status', status);
    submissionData.append('declaration_agreed', formData.declarationAgreed); // Send boolean directly

    return submissionData;
}

/** Handles the final form submission */
const handleSubmit = async () => {
  if (!formData.declarationAgreed) {
    errorMessage.value = 'Please agree to the declaration before submitting.';
    successMessage.value = '';
    window.scrollTo(0, document.body.scrollHeight); // Scroll to bottom where declaration is
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  console.log('Submitting application...');

  try {
    const payload = prepareFormData('submitted'); // Final submission status

     // Log FormData contents for debugging
     console.log("FormData for submission (excluding file content):");
     for (let [key, value] of payload.entries()) {
         if (value instanceof File) { console.log(key, `File: ${value.name} (${value.size} bytes)`); }
         else { console.log(key, value); }
     }

    let response;
    // If we have a draftId, use PATCH/PUT to update the existing record as 'submitted'
    // Otherwise, use POST to create a new record as 'submitted'
    if (draftId.value && typeof apiServices.patchEcpfProfile === 'function') {
        console.log(`Updating draft ${draftId.value} as submitted.`);
        response = await apiServices.patchEcpfProfile(draftId.value, payload);
    } else if (typeof apiServices.createEcpfProfile === 'function') {
        console.log("Creating new profile as submitted.");
        response = await apiServices.createEcpfProfile(payload);
    } else {
        throw new Error("Required API method (createEcpfProfile or patchEcpfProfile) not found in apiServices.");
    }

    console.log('Submission successful:', response?.data);
    successMessage.value = 'Application submitted successfully! It has been forwarded for review.'; // User-friendly message
    draftId.value = null; // Clear draft ID after successful submission
    resetForm(); // Optionally reset form after successful submission
    window.scrollTo(0, 0); // Scroll to top

  } catch (error) {
    console.error('Error submitting form:', error);
    const errorData = error.response?.data;
    let detailMessage = "An unexpected error occurred during submission.";
    if (typeof errorData === 'object' && errorData !== null) {
        // Try to extract specific field errors (adjust based on your backend response)
        const fieldErrors = Object.entries(errorData)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ');
        if (fieldErrors) detailMessage = `Submission failed due to validation errors: ${fieldErrors}`;
        else if (errorData.detail) detailMessage = errorData.detail; // General detail message
    } else if (error.message) {
        detailMessage = error.message;
    }
    errorMessage.value = `Error: ${detailMessage}`;
    window.scrollTo(0, 0); // Scroll to top to show error
  } finally {
    isLoading.value = false;
  }
};

/** Handles saving the form as a draft */
const handleSaveDraft = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  console.log('Saving as draft...');

  try {
    const payload = prepareFormData('draft'); // Draft status

    // Log FormData contents for debugging
     console.log("FormData for draft save (excluding file content):");
     for (let [key, value] of payload.entries()) {
         if (value instanceof File) { console.log(key, `File: ${value.name} (${value.size} bytes)`); }
         else { console.log(key, value); }
     }

    let response;
    // If we already have a draftId, update the existing draft using PATCH
    if (draftId.value && typeof apiServices.patchEcpfProfile === 'function') {
        console.log(`Updating existing draft ${draftId.value}.`);
        response = await apiServices.patchEcpfProfile(draftId.value, payload);
    }
    // Otherwise, create a new draft using POST
    else if (typeof apiServices.createEcpfProfile === 'function') {
        console.log("Creating new draft.");
        response = await apiServices.createEcpfProfile(payload);
        // --- Store the draft ID if the backend returns it ---
        // !! Adjust 'id' based on your actual backend response key !!
        if (response?.data?.id) {
            draftId.value = response.data.id;
            console.log("Stored new draft ID:", draftId.value);
        } else {
            console.warn("Draft created, but no ID received in response to store for updates.");
        }
    } else {
         throw new Error("Required API method (createEcpfProfile or patchEcpfProfile) not found in apiServices.");
    }

    console.log('Draft save successful:', response?.data);
    successMessage.value = `Application saved as draft successfully. ${draftId.value ? `(Draft ID: ${draftId.value})` : ''}`;
    window.scrollTo(0, 0); // Scroll to top

  } catch (error) {
      console.error('Error saving draft:', error);
      const errorData = error.response?.data;
      let detailMessage = "An unexpected error occurred while saving the draft.";
      if (typeof errorData === 'object' && errorData !== null) {
          const fieldErrors = Object.entries(errorData).map(([key, value]) => `${key}: ${value}`).join('; ');
          if (fieldErrors) detailMessage = `Draft save failed due to validation errors: ${fieldErrors}`;
          else if (errorData.detail) detailMessage = errorData.detail;
      } else if (error.message) {
          detailMessage = error.message;
      }
      errorMessage.value = `Error: ${detailMessage}`;
      window.scrollTo(0, 0);
  } finally {
    isLoading.value = false;
  }
};

</script>

<style scoped>
/* Add specific styles if needed */
button:disabled {
  opacity: 0.6;
}
/* Improve file input styling slightly */
input[type="file"] {
    @apply block w-full text-sm text-slate-500
           file:mr-4 file:py-2 file:px-4
           file:rounded-md file:border-0
           file:text-sm file:font-semibold
           file:bg-indigo-50 file:text-indigo-700
           hover:file:bg-indigo-100 cursor-pointer;
}
</style>