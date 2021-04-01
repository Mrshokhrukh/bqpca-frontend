<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Header Block -->
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">
        New ECPF Establishment Application
      </h1>
      <p class="text-gray-600">Please fill in the details below for the new ECPF establishment.</p>
    </div>

    <!-- Form Container -->
    <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <form @submit.prevent="handleSubmit" class="space-y-8">

        <!-- Applicant Details (Auto-fetched) -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Applicant Details (Auto-fetched)</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label for="applicant_cid" class="block text-sm font-medium text-gray-700">CID No.</label>
              <input id="applicant_cid" type="text" :value="formData.applicant.cid" disabled
                     class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
            </div>
            <div>
              <label for="applicant_name" class="block text-sm font-medium text-gray-700">Applicant's Name</label>
              <input id="applicant_name" type="text" :value="formData.applicant.name" disabled
                     class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
            </div>
            <div>
              <label for="applicant_gender" class="block text-sm font-medium text-gray-700">Gender</label>
              <input id="applicant_gender" type="text" :value="formData.applicant.gender" disabled
                     class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
            </div>
            <div>
              <label for="applicant_dob" class="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input id="applicant_dob" type="text" :value="formData.applicant.dob" disabled
                     class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
            </div>
          </div>
        </section>

        <!-- Contact & Address Details -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Contact & Address Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            <!-- Contact Info -->
            <div class="space-y-6">
              <h3 class="text-lg font-medium text-gray-800 border-b pb-2">Contact Information</h3>
              <div>
                <label for="contactNo" class="block text-sm font-medium text-gray-700">Contact No. <span class="text-red-500">*</span></label>
                <input type="tel" id="contactNo" v-model="formData.contact.contactNo" required
                       class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email Address <span class="text-red-500">*</span></label>
                <input type="email" id="email" v-model="formData.contact.email" required
                       class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
              </div>
            </div>

            <!-- Residential/Present Address -->
            <div class="space-y-6">
              <h3 class="text-lg font-medium text-gray-800 border-b pb-2">Residential/Present Address</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label for="resOfficeNo" class="block text-sm font-medium text-gray-700">Office No.</label>
                  <input type="text" id="resOfficeNo" v-model="formData.presentAddress.officeNumber"
                         class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
                </div>
                <div>
                  <label for="resFlatNo" class="block text-sm font-medium text-gray-700">Flat No.</label>
                  <input type="text" id="resFlatNo" v-model="formData.presentAddress.flatNo"
                         class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
                </div>
                <div>
                  <label for="resBuildingNo" class="block text-sm font-medium text-gray-700">Building No.</label>
                  <input type="text" id="resBuildingNo" v-model="formData.presentAddress.buildingNo"
                         class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
                </div>
                <div>
                  <label for="resLocation" class="block text-sm font-medium text-gray-700">Location <span class="text-red-500">*</span></label>
                  <input type="text" id="resLocation" v-model="formData.presentAddress.location" required
                         class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
                </div>
                <div>
                  <label for="resGewog" class="block text-sm font-medium text-gray-700">Gewog/Throm <span class="text-red-500">*</span></label>
                  <select id="resGewog" v-model="formData.presentAddress.gewogThrom" required
                          class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
                    <option disabled value="">Select Gewog/Throm</option>
                    <option v-for="option in masterData.gewogs" :key="option.id" :value="option.name">{{ option.name }}</option>
                  </select>
                </div>
                <div>
                  <label for="resDzongkhag" class="block text-sm font-medium text-gray-700">Dzongkhag/Thromde <span class="text-red-500">*</span></label>
                  <select id="resDzongkhag" v-model="formData.presentAddress.dzongkhagThromde" required
                          class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
                    <option disabled value="">Select Dzongkhag/Thromde</option>
                    <option v-for="option in masterData.dzongkhags" :key="option.id" :value="option.name">{{ option.name }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Permanent Address -->
            <div class="space-y-6 md:col-span-2">
              <h3 class="text-lg font-medium text-gray-800 border-b pb-2">Permanent Address</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label for="permVillage" class="block text-sm font-medium text-gray-700">Village/Chiwog <span class="text-red-500">*</span></label>
                  <input type="text" id="permVillage" v-model="formData.permanentAddress.villageChiwog" required
                         class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
                </div>
                <div>
                  <label for="permGewog" class="block text-sm font-medium text-gray-700">Gewog <span class="text-red-500">*</span></label>
                  <select id="permGewog" v-model="formData.permanentAddress.gewog" required
                          class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
                    <option disabled value="">Select Gewog</option>
                    <option v-for="option in masterData.gewogs" :key="option.id" :value="option.name">{{ option.name }}</option>
                  </select>
                </div>
                <div>
                  <label for="permDungkhag" class="block text-sm font-medium text-gray-700">Dungkhag</label>
                  <select id="permDungkhag" v-model="formData.permanentAddress.dungkhag"
                          class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
                    <option value="">Select Dungkhag (if applicable)</option>
                    <option v-for="option in masterData.dungkhags" :key="option.id" :value="option.name">{{ option.name }}</option>
                  </select>
                </div>
                <div>
                  <label for="permDzongkhag" class="block text-sm font-medium text-gray-700">Dzongkhag/Thromde <span class="text-red-500">*</span></label>
                  <select id="permDzongkhag" v-model="formData.permanentAddress.dzongkhagThromde" required
                          class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
                    <option disabled value="">Select Dzongkhag/Thromde</option>
                    <option v-for="option in masterData.dzongkhags" :key="option.id" :value="option.name">{{ option.name }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Education Details -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Education Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="qualification" class="block text-sm font-medium text-gray-700">Highest Qualification <span class="text-red-500">*</span></label>
              <input type="text" id="qualification" v-model="formData.education.qualification" list="qualificationsList" required
                     class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                     placeholder="e.g., Bachelors Degree, Class XII, PhD">
              <datalist id="qualificationsList">
                <option value="PhD"></option>
                <option value="Masters Degree"></option>
                <option value="Bachelors Degree"></option>
                <option value="Diploma"></option>
                <option value="Class XII"></option>
                <option value="Class X"></option>
                <!-- Add more common options -->
              </datalist>
            </div>
            <div>
              <label for="institute" class="block text-sm font-medium text-gray-700">Name of Institute/University <span class="text-red-500">*</span></label>
              <input type="text" id="institute" v-model="formData.education.instituteName" required
                     class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                     placeholder="Enter institute name">
              <!-- Potential Feature: Add autocomplete/API lookup here -->
            </div>
          </div>
        </section>

        <!-- ECPF Establishment Proposal Details -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">ECPF Establishment Proposal Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="proposalName" class="block text-sm font-medium text-gray-700">Proposed Name <span class="text-red-500">*</span></label>
              <input type="text" id="proposalName" v-model="formData.proposal.name" required
                     class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
            </div>
            <div>
              <label for="proposalAddress" class="block text-sm font-medium text-gray-700">Proposed Address <span class="text-red-500">*</span></label>
              <input type="text" id="proposalAddress" v-model="formData.proposal.address" required
                     class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                     placeholder="Full address details">
            </div>
            <div>
              <label for="proposalLocation" class="block text-sm font-medium text-gray-700">Proposed Location (Dzongkhag/Thromde) <span class="text-red-500">*</span></label>
              <select id="proposalLocation" v-model="formData.proposal.location" required
                      class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
                <option disabled value="">Select Location</option>
                <option v-for="option in masterData.dzongkhags" :key="option.id" :value="option.name">{{ option.name }}</option>
              </select>
            </div>
            <div>
              <label for="proposalFirmType" class="block text-sm font-medium text-gray-700">Type of Firm <span class="text-red-500">*</span></label>
              <select id="proposalFirmType" v-model="formData.proposal.firmType" required
                      class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
                <option disabled value="">Select Firm Type</option>
                <option v-for="option in masterData.firmTypes" :key="option.id" :value="option.name">{{ option.name }}</option>
              </select>
            </div>
          </div>
        </section>

        <!-- Purpose of Establishment -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Purpose of Establishment</h2>
          <div class="space-y-6">
            <div>
              <label for="vision" class="block text-sm font-medium text-gray-700">Vision <span class="text-red-500">*</span></label>
              <textarea id="vision" v-model="formData.purpose.vision" rows="4" required
                        class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"></textarea>
            </div>
            <div>
              <label for="mission" class="block text-sm font-medium text-gray-700">Mission <span class="text-red-500">*</span></label>
              <textarea id="mission" v-model="formData.purpose.mission" rows="4" required
                        class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"></textarea>
            </div>
            <div>
              <label for="objective" class="block text-sm font-medium text-gray-700">Objective <span class="text-red-500">*</span></label>
              <textarea id="objective" v-model="formData.purpose.objective" rows="4" required
                        class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"></textarea>
            </div>
          </div>
        </section>

        <!-- Institute/Colleges/University Linkages -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Institute/Colleges/University Linkages</h2>
          <div v-if="formData.linkages.length === 0" class="text-gray-500 italic">No linkages added yet.</div>
          <div v-for="(linkage, index) in formData.linkages" :key="index"
               class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 border-b pb-4">
             <div>
                <label :for="'linkName-' + index" class="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" :id="'linkName-' + index" v-model="linkage.name"
                       class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
            </div>
            <div>
                <label :for="'linkLocation-' + index" class="block text-sm font-medium text-gray-700">Location</label>
                <input type="text" :id="'linkLocation-' + index" v-model="linkage.location"
                       class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
            </div>
             <div>
                <label :for="'linkCountry-' + index" class="block text-sm font-medium text-gray-700">Country</label>
                <input type="text" :id="'linkCountry-' + index" v-model="linkage.country"
                       class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
            </div>
            <div>
                <label :for="'linkRecognition-' + index" class="block text-sm font-medium text-gray-700">Recognition/Accreditation</label>
                <input type="text" :id="'linkRecognition-' + index" v-model="linkage.recognition"
                       class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
            </div>
            <div>
                 <label :for="'linkApproval-' + index" class="block text-sm font-medium text-gray-700">Approval from University</label>
                <input type="text" :id="'linkApproval-' + index" v-model="linkage.approval"
                       class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
            </div>
            <div class="flex items-end justify-end">
              <button type="button" @click="removeLinkage(index)"
                      class="text-red-600 hover:text-red-800 self-end px-3 py-2">Remove</button>
            </div>
          </div>
          <button type="button" @click="addLinkage"
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2">
            Add Linkage
          </button>
        </section>

        <!-- Financial Capacity Details -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Financial Capacity Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-6">
              <div>
                <label for="financialStatement" class="block text-sm font-medium text-gray-700">Financial Statement Upload <span class="text-red-500">*</span></label>
                <input type="file" id="financialStatement" @change="handleFileUpload($event, 'financialStatementFile')" required
                       class="mt-1 block w-full text-sm" />
                <span v-if="formData.financialStatementFile" class="text-xs text-gray-600 mt-1 block">Selected: {{ formData.financialStatementFile.name }}</span>
              </div>
              <div>
                <label for="budgetPlan" class="block text-sm font-medium text-gray-700">Budget Plan Upload <span class="text-red-500">*</span></label>
                <input type="file" id="budgetPlan" @change="handleFileUpload($event, 'budgetPlanFile')" required
                       class="mt-1 block w-full text-sm" />
                <span v-if="formData.budgetPlanFile" class="text-xs text-gray-600 mt-1 block">Selected: {{ formData.budgetPlanFile.name }}</span>
              </div>
            </div>
            <div>
              <label for="sourceOfFunding" class="block text-sm font-medium text-gray-700">Source of Funding <span class="text-red-500">*</span></label>
              <textarea id="sourceOfFunding" v-model="formData.financial.sourceOfFunding" rows="7" required
                        class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"></textarea>
            </div>
          </div>
        </section>

        <!-- SWOT Analysis -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">SWOT Analysis</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="strengths" class="block text-sm font-medium text-gray-700">Strengths <span class="text-red-500">*</span></label>
              <textarea id="strengths" v-model="formData.swot.strengths" rows="4" required
                        class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"></textarea>
            </div>
            <div>
              <label for="weaknesses" class="block text-sm font-medium text-gray-700">Weaknesses <span class="text-red-500">*</span></label>
              <textarea id="weaknesses" v-model="formData.swot.weaknesses" rows="4" required
                        class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"></textarea>
            </div>
            <div>
              <label for="opportunities" class="block text-sm font-medium text-gray-700">Opportunities <span class="text-red-500">*</span></label>
              <textarea id="opportunities" v-model="formData.swot.opportunities" rows="4" required
                        class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"></textarea>
            </div>
            <div>
              <label for="threats" class="block text-sm font-medium text-gray-700">Threats <span class="text-red-500">*</span></label>
              <textarea id="threats" v-model="formData.swot.threats" rows="4" required
                        class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"></textarea>
            </div>
          </div>
        </section>

        <!-- Fee & Charges -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Fee & Charges</h2>
          <div v-for="(fee, index) in formData.fees" :key="index"
               class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4 border-b pb-4 items-end">
            <div>
              <label :for="'feeBreakup-' + index" class="block text-sm font-medium text-gray-700">Fee Breakup <span class="text-red-500">*</span></label>
              <input type="text" :id="'feeBreakup-' + index" v-model="fee.breakup" required
                     class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
            </div>
            <div>
              <label :for="'feeDescription-' + index" class="block text-sm font-medium text-gray-700">Description</label>
              <input type="text" :id="'feeDescription-' + index" v-model="fee.description"
                     class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
            </div>
            <div>
              <label :for="'feeAmount-' + index" class="block text-sm font-medium text-gray-700">Amount (Nu.) <span class="text-red-500">*</span></label>
              <input type="number" :id="'feeAmount-' + index" v-model.number="fee.amount" required min="0" step="any"
                     class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
            </div>
            <div class="flex items-end justify-end">
              <button type="button" @click="removeFee(index)" v-if="formData.fees.length > 1"
                      class="text-red-600 hover:text-red-800 self-end px-3 py-2">Remove</button>
            </div>
          </div>
          <div class="mt-4 flex items-center justify-between">
            <button type="button" @click="addFee"
                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Add Fee Item
            </button>
            <div class="text-right">
              <span class="text-lg font-semibold text-gray-800">Total Amount: Nu. {{ totalFeeAmount.toFixed(2) }}</span>
            </div>
          </div>
        </section>

        <!-- Guarantor Details -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Guarantor Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label for="guarantorName" class="block text-sm font-medium text-gray-700">Full Name <span class="text-red-500">*</span></label>
              <input type="text" id="guarantorName" v-model="formData.guarantor.fullName" required
                     class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
            </div>
            <div>
              <label for="guarantorCid" class="block text-sm font-medium text-gray-700">CID Number <span class="text-red-500">*</span></label>
              <input type="text" id="guarantorCid" v-model="formData.guarantor.cidNumber" required pattern="\d{11}" title="Enter 11 digit CID Number"
                     class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
            </div>
            <div>
              <label for="guarantorRelation" class="block text-sm font-medium text-gray-700">Relation <span class="text-red-500">*</span></label>
              <input type="text" id="guarantorRelation" v-model="formData.guarantor.relation" required
                     class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
            </div>
            <div>
              <label for="guarantorContact" class="block text-sm font-medium text-gray-700">Contact Number <span class="text-red-500">*</span></label>
              <input type="tel" id="guarantorContact" v-model="formData.guarantor.contactNumber" required
                     class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm">
            </div>
            <div class="md:col-span-2 lg:col-span-1">
              <label for="guarantorCidCopy" class="block text-sm font-medium text-gray-700">CID Copy Upload <span class="text-red-500">*</span></label>
              <input type="file" id="guarantorCidCopy" @change="handleFileUpload($event, 'guarantorCidCopyFile')" required
                     class="mt-1 block w-full text-sm" />
              <span v-if="formData.guarantorCidCopyFile" class="text-xs text-gray-600 mt-1 block">Selected: {{ formData.guarantorCidCopyFile.name }}</span>
            </div>
          </div>
        </section>

        <!-- Supporting Documents -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Supporting Documents</h2>
          <div>
            <label for="cvUpload" class="block text-sm font-medium text-gray-700">Applicant's CV Upload <span class="text-red-500">*</span></label>
            <input type="file" id="cvUpload" @change="handleFileUpload($event, 'cvFile')" required
                   class="mt-1 block w-full text-sm" />
            <span v-if="formData.cvFile" class="text-xs text-gray-600 mt-1 block">Selected: {{ formData.cvFile.name }}</span>
            <p class="mt-1 text-xs text-gray-500">Please upload your latest Curriculum Vitae (PDF, DOC, DOCX format).</p>
          </div>
          <!-- Add other supporting document fields if needed -->
        </section>

        <!-- Declaration -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">Declaration</h2>
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input id="declaration" name="declaration" type="checkbox" v-model="formData.declarationAgreed" required
                     class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded">
            </div>
            <div class="ml-3 text-sm">
              <label for="declaration" class="font-medium text-gray-700">I hereby declare that the information provided above is true and correct to the best of my knowledge. <span class="text-red-500">*</span></label>
              <p class="text-gray-500">Agreeing to this declaration is mandatory for submission.</p>
              <!-- Fetch actual declaration text from master/source if needed -->
            </div>
          </div>
        </section>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="handleSaveDraft"
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            :disabled="!formData.declarationAgreed"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200 disabled:opacity-50"
          >
            Submit Application
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue';

// --- Reactive Form Data ---
const formData = reactive({
  applicant: { // Simulated Auto-fetched data
    cid: '11001001234',
    name: 'Dorji Wangchuk',
    gender: 'Male',
    dob: '1985-06-15'
  },
  contact: {
    contactNo: '',
    email: ''
  },
  presentAddress: {
    officeNumber: '',
    flatNo: '',
    buildingNo: '',
    location: '',
    gewogThrom: '',
    dzongkhagThromde: ''
  },
  permanentAddress: {
    villageChiwog: '',
    gewog: '',
    dungkhag: '',
    dzongkhagThromde: ''
  },
  education: {
    qualification: '',
    instituteName: ''
    // Potential future fields: yearCompleted, country, etc.
  },
  proposal: {
    name: '',
    address: '',
    location: '', // Dzongkhag/Thromde
    firmType: ''
  },
  purpose: {
    vision: '',
    mission: '',
    objective: ''
  },
  linkages: [], // Array for dynamic linkages
  financial: {
    sourceOfFunding: ''
    // Files will be handled separately below
  },
  swot: {
    strengths: '',
    weaknesses: '',
    opportunities: '',
    threats: ''
  },
  fees: [
    // Initialize with one empty fee item
    { breakup: '', description: '', amount: null }
  ],
  guarantor: {
    fullName: '',
    cidNumber: '',
    relation: '',
    contactNumber: ''
    // File handled separately
  },
  // File Refs (initialize to null)
  financialStatementFile: null,
  budgetPlanFile: null,
  guarantorCidCopyFile: null,
  cvFile: null,
  // Declaration
  declarationAgreed: false,
});

// --- Master Data (Replace with API calls in onMounted) ---
const masterData = reactive({
  gewogs: [
    { id: 1, name: 'Chang Gewog' }, { id: 2, name: 'Kawang Gewog' }, { id: 3, name: 'Mewang Gewog' }, { id: 4, name: 'Thimphu Throm' } /* ... more */
  ],
  dzongkhags: [
    { id: 1, name: 'Thimphu Dzongkhag' }, { id: 2, name: 'Thimphu Thromde' }, { id: 3, name: 'Paro Dzongkhag' }, { id: 4, name: 'Punakha Dzongkhag' } /* ... more */
  ],
  dungkhags: [
     { id: 1, name: 'Lingzhi Dungkhag' }, { id: 2, name: 'Sombaykha Dungkhag' } /* ... more */
  ],
  firmTypes: [
    { id: 1, name: 'Private Limited Company' }, { id: 2, name: 'Sole Proprietorship' }, { id: 3, name: 'Partnership' }, { id: 4, name: 'Public Limited Company' }, { id: 5, name: 'NGO/Non-Profit' } /* ... more */
  ],
   // Add master data for declaration text if needed
   declarationText: "I hereby declare that the information provided above is true and correct to the best of my knowledge."
});

// --- Computed Properties ---
const totalFeeAmount = computed(() => {
  return formData.fees.reduce((total, fee) => {
    // Ensure amount is treated as a number, default to 0 if null/undefined/NaN
    const amount = Number(fee.amount) || 0;
    return total + amount;
  }, 0);
});

// --- Methods ---

// Fetch master data on component mount
onMounted(() => {
  console.log("Component mounted. Fetch master data here if needed.");
  // Example: fetchGewogs(), fetchDzongkhags(), etc.
   // Initialize linkages if needed (optional)
   if (formData.linkages.length === 0) {
    // addLinkage(); // Uncomment if you want one empty linkage row initially
  }
  // Ensure at least one fee item exists
  if (formData.fees.length === 0) {
    addFee();
  }
});

// Add/Remove Linkages
const addLinkage = () => {
  formData.linkages.push({
    name: '',
    location: '',
    country: '',
    recognition: '',
    approval: ''
  });
};

const removeLinkage = (index) => {
  formData.linkages.splice(index, 1);
};

// Add/Remove Fees
const addFee = () => {
  formData.fees.push({
    breakup: '',
    description: '',
    amount: null
  });
};

const removeFee = (index) => {
   if (formData.fees.length > 1) { // Prevent removing the last item
      formData.fees.splice(index, 1);
   } else {
       // Optionally clear the fields of the last remaining item instead of removing
       // formData.fees[0] = { breakup: '', description: '', amount: null };
       alert("At least one fee item is required.");
   }
};

// Handle File Uploads
const handleFileUpload = (event, fieldName) => {
  const file = event.target.files[0];
  if (file) {
    formData[fieldName] = file;
    console.log(`File selected for ${fieldName}:`, file.name);
  } else {
     formData[fieldName] = null;
  }
   // Visually, the browser handles showing the selected file name for type="file"
};

// Form Submission Logic
const handleSubmit = () => {
  if (!formData.declarationAgreed) {
    alert('Please agree to the declaration before submitting.');
    return;
  }

  console.log('Submitting Form Data:', JSON.parse(JSON.stringify(formData))); // Use deep copy for logging
  alert('Form Submitted (check console for data). Implement API call here.');

  // --- API Call Implementation ---
  // 1. Create a new FormData object
  const submissionData = new FormData();

  // 2. Append non-file data (handle nested objects/arrays carefully)
  //    You might need to stringify complex objects before appending
  Object.keys(formData).forEach(key => {
    // Skip file objects and the declaration boolean itself
    if (key.endsWith('File') || typeof formData[key] === 'object' && formData[key] instanceof File || key === 'declarationAgreed') {
       // Handled below or not needed in submission payload
    } else if (key === 'linkages' || key === 'fees') {
        // Send arrays/complex objects as JSON string
        submissionData.append(key, JSON.stringify(formData[key]));
    } else if (typeof formData[key] === 'object' && formData[key] !== null) {
        // Append nested object properties individually (adjust based on backend needs)
        Object.keys(formData[key]).forEach(subKey => {
            if (formData[key][subKey] !== null && formData[key][subKey] !== undefined) {
                submissionData.append(`${key}.${subKey}`, formData[key][subKey]);
            }
        })
        // Or, if backend expects stringified object:
        // submissionData.append(key, JSON.stringify(formData[key]));
    } else {
       // Append simple values
       if (formData[key] !== null && formData[key] !== undefined) {
          submissionData.append(key, formData[key]);
       }
    }
  });

   // Append declaration status (if backend needs it)
   submissionData.append('declarationAgreed', formData.declarationAgreed);

  // 3. Append file data
  if (formData.financialStatementFile) {
    submissionData.append('financialStatementFile', formData.financialStatementFile, formData.financialStatementFile.name);
  }
  if (formData.budgetPlanFile) {
    submissionData.append('budgetPlanFile', formData.budgetPlanFile, formData.budgetPlanFile.name);
  }
   if (formData.guarantorCidCopyFile) {
    submissionData.append('guarantorCidCopyFile', formData.guarantorCidCopyFile, formData.guarantorCidCopyFile.name);
  }
   if (formData.cvFile) {
    submissionData.append('cvFile', formData.cvFile, formData.cvFile.name);
  }

  // 4. Log the FormData contents (for debugging)
  console.log("FormData prepared for submission:")
   for (let [key, value] of submissionData.entries()) {
        console.log(key, value);
   }


  // 5. Make the API call (using fetch or axios)
  /*
  fetch('/api/submit-ecpf', {
    method: 'POST',
    body: submissionData,
    // headers: { 'Authorization': 'Bearer YOUR_TOKEN' } // If needed
  })
  .then(response => {
    if (!response.ok) {
      // Attempt to read error details from response body
      return response.json().then(err => { throw err; }).catch(() => { throw new Error(`HTTP error! status: ${response.status}`) });
    }
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
    alert('Application submitted successfully!');
    // Reset form or redirect user
    // resetForm(); // Implement resetForm if needed
  })
  .catch(error => {
    console.error('Error submitting form:', error);
    let errorMessage = 'An error occurred during submission.';
    if (error.message) {
        errorMessage += ` Details: ${error.message}`;
    } else if (typeof error === 'object' && error !== null) {
        errorMessage += ` Details: ${JSON.stringify(error)}`;
    }
    alert(errorMessage);
  });
  */
};

// Save as Draft Logic
const handleSaveDraft = () => {
  console.log('Saving Form Data as Draft:', JSON.parse(JSON.stringify(formData)));
  alert('Form Saved as Draft (check console for data). Implement API call here.');

   // Similar logic to handleSubmit, but likely sending to a different endpoint
   // and might not require all fields or files initially.
   // You would likely still use FormData if files are included in the draft.
   /*
   const draftData = new FormData();
   // Append data similar to handleSubmit... (maybe skip validation checks)
   fetch('/api/save-draft-ecpf', {
       method: 'POST',
       body: draftData,
       // headers...
   })
   .then(...) // Handle success/error specific to draft saving
   .catch(...);
   */
};

</script>

<style scoped>
/* Style disabled button */
button:disabled {
  opacity: 0.5; /* Tailwind class 'disabled:opacity-50' handles this */
}

/* Keep minimal styling, relying on Tailwind utility classes */
</style>