```vue
<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Change in Ownership of ECPF</h1>
      <p class="text-gray-600">
        Fill out the form below to request a change in ownership of the ECPF.
      </p>
    </div>

    <div v-if="loading" class="text-center py-10">
      <div class="flex flex-col items-center space-y-3">
        <svg
          class="animate-spin h-8 w-8 text-indigo-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p class="text-gray-600 font-medium">Loading form data...</p>
      </div>
    </div>

    <div v-else class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <form @submit.prevent="handleSubmitFlow" class="space-y-8">
        <!-- Current ECPF Details -->
        <section>
          <h2 class="text-lg font-medium mb-2 text-gray-700">Current ECPF Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">ECPF License No.</label>
              <input
                type="text"
                v-model="formData.currentEcpf.licenseNo"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Name of the ECPF</label>
              <input
                type="text"
                v-model="formData.currentEcpf.name"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Proprietor of the ECPF</label>
              <input
                type="text"
                v-model="formData.currentEcpf.proprietor"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Location of ECPF</label>
              <input
                type="text"
                v-model="formData.currentEcpf.location"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
        </section>

        <!-- Personal Information (New Applicants) -->
        <section>
          <h2 class="text-lg font-medium mb-2 text-gray-700">
            Personal Information (New Applicants)
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">CID No. <span class="text-red-500">*</span></label>
              <div class="flex">
                <input
                  type="text"
                  v-model="formData.personalInfo.cidNo"
                  :disabled="isLoadingDCRC"
                  class="mt-1 block w-full px-3 py-2 border rounded-l-md shadow-sm"
                  :class="{ 'border-red-500': highlightErrors && (!formData.personalInfo.cidNo || !isCIDValid) }"
                  placeholder="Enter 11-digit CID Number"
                  @input="validateCID"
                />
                <button
                  type="button"
                  @click="searchByCID"
                  :disabled="!isCIDValid || isLoadingDCRC"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-r-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {{ isLoadingDCRC ? 'Searching...' : 'Search' }}
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                Enter an 11-digit CID to fetch data from DCRC. Manual entry supported if API is unavailable.
              </p>
              <span v-if="errors.cidNo" class="text-xs text-red-500 mt-1">{{ errors.cidNo }}</span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Applicant's Name</label>
              <input
                type="text"
                v-model="formData.personalInfo.name"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gender</label>
              <input
                type="text"
                v-model="formData.personalInfo.gender"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="text"
                v-model="formData.personalInfo.dob"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                placeholder="dd/mm/yyyy"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Contact No.</label>
              <input
                type="text"
                v-model="formData.personalInfo.contactNo"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                v-model="formData.personalInfo.email"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
        </section>

        <!-- Residential/Present Address -->
        <section>
          <h2 class="text-lg font-medium mb-2 text-gray-700">Residential/Present Address</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Office Number</label>
              <input
                type="text"
                v-model="formData.residentialAddress.officeNumber"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Flat No.</label>
              <input
                type="text"
                v-model="formData.residentialAddress.flatNo"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Building No.</label>
              <input
                type="text"
                v-model="formData.residentialAddress.buildingNo"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                v-model="formData.residentialAddress.location"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from DCRC)</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gewog/Throm</label>
              <input
                type="text"
                v-model="formData.residentialAddress.gewogThrom"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from DCRC)</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Dzongkhag/Thromde</label>
              <input
                type="text"
                v-model="formData.residentialAddress.dzongkhagThromde"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from DCRC)</p>
            </div>
          </div>
        </section>

        <!-- Permanent Address -->
        <section>
          <h2 class="text-lg font-medium mb-2 text-gray-700">Permanent Address</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Village/Chiwog</label>
              <input
                type="text"
                v-model="formData.permanentAddress.villageChiwog"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from DCRC)</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gewog</label>
              <input
                type="text"
                v-model="formData.permanentAddress.gewog"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from DCRC)</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Dungkhag</label>
              <input
                type="text"
                v-model="formData.permanentAddress.dungkhag"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from DCRC, if available)</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Dzongkhag/Thromde</label>
              <input
                type="text"
                v-model="formData.permanentAddress.dzongkhagThromde"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from DCRC)</p>
            </div>
          </div>
        </section>

        <!-- Education Details -->
        <section>
          <h2 class="text-lg font-medium mb-2 text-gray-700">Education Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2 flex items-center space-x-4">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700">Search by RUB API</label>
                <div class="flex">
                  <input
                    type="text"
                    v-model="rubApiQuery"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm"
                    placeholder="Enter search criteria"
                  />
                  <button
                    type="button"
                    @click="searchRUB"
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-r-md hover:bg-blue-700"
                  >
                    Search
                  </button>
                </div>
              </div>
              <div class="mt-6">
                <label class="inline-flex items-center">
                  <input
                    type="checkbox"
                    v-model="allowManualEntry"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span class="ml-2 text-sm text-gray-600">Allow manual entry</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Course/Qualification</label>
              <input
                type="text"
                v-model="formData.education.course"
                :readonly="!allowManualEntry && !isEditing"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                :class="{ 'bg-gray-100': !allowManualEntry && !isEditing }"
              />
              <p class="text-xs text-gray-500 mt-1">
                Auto (Pull from RUB if API is selected, manual entry supported if API not available)
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Name of Institute</label>
              <input
                type="text"
                v-model="formData.education.institute"
                :readonly="!allowManualEntry && !isEditing"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                :class="{ 'bg-gray-100': !allowManualEntry && !isEditing }"
              />
              <p class="text-xs text-gray-500 mt-1">
                Auto (Pull from RUB if API is selected, manual entry supported if API not available)
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Name of University</label>
              <input
                type="text"
                v-model="formData.education.university"
                :readonly="!allowManualEntry && !isEditing"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                :class="{ 'bg-gray-100': !allowManualEntry && !isEditing }"
              />
              <p class="text-xs text-gray-500 mt-1">
                Auto (Pull from RUB if API is selected, manual entry supported if API not available)
              </p>
            </div>
          </div>
        </section>

        <!-- Proposal for Change in Ownership of ECPF Details -->
        <section>
          <h2 class="text-lg font-medium mb-2 text-gray-700">
            Proposal for Change in Ownership of ECPF Details
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name of the Proposed Firm <span class="text-red-500">*</span></label>
              <input
                type="text"
                v-model="formData.proposal.firmName"
                :readonly="!isEditing"
                class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
                :class="{ 'border-red-500': highlightErrors && !formData.proposal.firmName, 'bg-gray-100': !isEditing }"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Address of the Proposed Firm <span class="text-red-500">*</span></label>
              <input
                type="text"
                v-model="formData.proposal.firmAddress"
                :readonly="!isEditing"
                class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
                :class="{ 'border-red-500': highlightErrors && !formData.proposal.firmAddress, 'bg-gray-100': !isEditing }"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Location of the Proposed Firm</label>
              <input
                type="text"
                v-model="formData.proposal.firmLocation"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from source)</p>
            </div>
          </div>
        </section>

        <!-- Institute/Colleges/University Linkages -->
        <section>
          <h2 class="text-lg font-medium mb-2 text-gray-700">
            Institute/Colleges/University Linkages
          </h2>
          <div
            v-for="(linkage, index) in formData.linkages"
            :key="index"
            class="p-4 border border-gray-200 rounded-md mb-4"
          >
            <div class=" atrocity__grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">Name of Colleges/University/Institute</label>
                <input
                  type="text"
                  v-model="linkage.name"
                  :readonly="!isEditing"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  :class="{ 'bg-gray-100': !isEditing }"
                />
                <p class="text-xs text-gray-500 mt-1">Auto (Provision to edit)</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  v-model="linkage.location"
                  :readonly="!isEditing"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  :class="{ 'bg-gray-100': !isEditing }"
                />
                <p class="text-xs text-gray-500 mt-1">Auto (Provision to edit)</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  v-model="linkage.country"
                  :readonly="!isEditing"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  :class="{ 'bg-gray-100': !isEditing }"
                />
                <p class="text-xs text-gray-500 mt-1">Auto (Provision to edit)</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Recognition/Accreditation</label>
                <div class="flex items-center space-x-2">
                  <input
                    type="text"
                    v-model="linkage.recognition"
                    readonly
                    class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                  />
                  <label
                    class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    :class="{ 'opacity-50 cursor-not-allowed': !isEditing }"
                  >
                    <input
                      type="file"
                      @change="handleRecognitionUpload($event, index)"
                      class="hidden"
                      :disabled="!isEditing"
                    />
                    <span>Upload</span>
                  </label>
                </div>
                <p class="text-xs text-gray-500 mt-1">Auto (File upload, Provision to edit)</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Approval from University</label>
                <div class="flex items-center space-x-2">
                  <input
                    type="text"
                    v-model="linkage.approval"
                    readonly
                    class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                  />
                  <label
                    class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    :class="{ 'opacity-50 cursor-not-allowed': !isEditing }"
                  >
                    <input
                      type="file"
                      @change="handleApprovalUpload($event, index)"
                      class="hidden"
                      :disabled="!isEditing"
                    />
                    <span>Upload</span>
                  </label>
                </div>
                <p class="text-xs text-gray-500 mt-1">Auto (File upload, Provision to edit)</p>
              </div>
            </div>
            <div class="mt-4 flex justify-end">
              <button
                type="button"
                @click="removeLinkage(index)"
                class="px-4 py-2 text-sm font-medium text-white bg competitors__red-600 rounded-md hover:bg-red-700"
                :disabled="!isEditing"
                :class="{ 'opacity-50 cursor-not-allowed': !isEditing }"
              >
                Remove
              </button>
            </div>
          </div>
          <div class="mt-4">
            <button
              type="button"
              @click="addLinkage"
              class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              :disabled="!isEditing"
              :class="{ 'opacity-50 cursor-not-allowed': !isEditing }"
            >
              Add More Linkages
            </button>
          </div>
        </section>

        <!-- Supporting Documents -->
        <section>
          <h2 class="text-lg font-medium mb-2 text-gray-700">Supporting Documents</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">CV of the Applicant <span class="text-red-500">*</span></label>
              <div class="flex items-center space-x-2">
                <input
                  type="text"
                  v-model="formData.documents.cvApplicant"
                  readonly
                  class="mt-1 block w-full px-3 py-2 bg-gray-100 border rounded-md shadow-sm"
                  :class="{ 'border-red-500': highlightErrors && !formData.documents.cvApplicant }"
                />
                <label
                  class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  :class="{ 'opacity-50 cursor-not-allowed': !isEditing }"
                >
                  <input
                    type="file"
                    @change="handleCvApplicantUpload"
                    class="hidden"
                    :disabled="!isEditing"
                  />
                  <span>Upload</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">CV & Certificate of Counsellors <span class="text-red-500">*</span></label>
              <div class="flex items-center space-x-2">
                <input
                  type="text"
                  v-model="formData.documents.cvCounsellors"
                  readonly
                  class="mt-1 block w-full px-3 py-2 bg-gray-100 border rounded-md shadow-sm"
                  :class="{ 'border-red-500': highlightErrors && !formData.documents.cvCounsellors }"
                />
                <label
                  class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  :class="{ 'opacity-50 cursor-not-allowed': !isEditing }"
                >
                  <input
                    type="file"
                    @change="handleCvCounsellorsUpload"
                    class="hidden"
                    :disabled="!isEditing"
                  />
                  <span>Upload</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">CID of Guarantor <span class="text-red-500">*</span></label>
              <div class="flex items-center space-x-2">
                <input
                  type="text"
                  v-model="formData.documents.cidGuarantor"
                  readonly
                  class="mt-1 block w-full px-3 py-2 bg-gray-100 border rounded-md shadow-sm"
                  :class="{ 'border-red-500': highlightErrors && !formData.documents.cidGuarantor }"
                />
                <label
                  class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  :class="{ 'opacity-50 cursor-not-allowed': !isEditing }"
                >
                  <input
                    type="file"
                    @change="handleCidGuarantorUpload"
                    class="hidden"
                    :disabled="!isEditing"
                  />
                  <span>Upload</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Proposal Details <span class="text-red-500">*</span></label>
              <div class="flex items-center space-x-2">
                <input
                  type="text"
                  v-model="formData.documents.proposalDetails"
                  readonly
                  class="mt-1 block w-full px-3 py-2 bg-gray-100 border rounded-md shadow-sm"
                  :class="{ 'border-red-500': highlightErrors && !formData.documents.proposalDetails }"
                />
                <label
                  class="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  :class="{ 'opacity-50 cursor-not-allowed': !isEditing }"
                >
                  <input
                    type="file"
                    @change="handleProposalDetailsUpload"
                    class="hidden"
                    :disabled="!isEditing"
                  />
                  <span>Upload</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Remarks (if any)</label>
              <textarea
                v-model="formData.documents.declarationRemarks"
                rows="3"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter any remarks here..."
                :readonly="!isEditing"
                :class="{ 'bg-gray-100': !isEditing }"
              ></textarea>
            </div>
            <div class="mt-4">
              <label class="inline-flex items-center">
                <input
                  type="checkbox"
                  v-model="formData.documents.declarationAgreed"
                  class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  :class="{ 'border-red-500': highlightErrors && !formData.documents.declarationAgreed }"
                  :disabled="!isEditing"
                />
                <span class="ml-2 text-sm text-gray-700">
                  I hereby declare that the information provided in this application is true and correct to the best of my knowledge. <span class="text-red-500">*</span>
                </span>
              </label>
            </div>
          </div>
        </section>

        <!-- Validation Errors -->
        <div v-if="validationErrors.length" class="mt-4 bg-red-50 p-4 rounded-md shadow-sm">
          <p class="font-medium text-red-700">Please correct the following errors:</p>
          <ul class="mt-2 space-y-1 text-red-600">
            <li v-for="(error, index) in validationErrors" :key="index" class="text-sm">
              {{ error }}
            </li>
          </ul>
        </div>

        <!-- Action Buttons -->
        <div class="mt-6 flex flex-wrap justify-end space-x-0 sm:space-x-4 space-y-2 sm:space-y-0">
          <button
            type="button"
            @click="saveAsDraft"
            :disabled="isSubmitting"
            class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            v-if="!isEditing"
            type="button"
            @click="editApplication"
            :disabled="isSubmitting"
            class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 disabled:opacity-50"
          >
            Edit
          </button>
          <button
            v-else
            type="button"
            @click="saveChanges"
            :disabled="isSubmitting"
            class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 disabled:opacity-50"
          >
            Save Changes
          </button>
          <button
            type="button"
            @click="handleSubmitFlow"
            :disabled="!canSubmit || isSubmitting"
            class="w-full sm:w-auto px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg
              v-if="isSubmitting"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ isSubmitting ? 'Processing...' : 'Submit & Pay' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Payment Modal -->
    <PaymentModal
      ref="paymentModalRef"
      :amount="OWNERSHIP_CHANGE_FEE"
      @payment-completed="handlePaymentCompleted"
      @close="handlePaymentModalClose"
    />

    <!-- Submission Error Modal -->
    <div
      v-if="showSubmissionErrorModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <div class="flex items-start">
          <svg
            class="h-6 w-6 text-red-600 mr-2 mt-1"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 class="text-lg font-medium text-gray-900">Complete Required Fields</h3>
            <p class="mt-2 text-sm text-gray-600">
              Please complete all required fields to submit your application:
            </p>
            <ul class="mt-2 space-y-1 text-red-600 list-disc list-inside">
              <li v-for="(error, index) in submissionErrors" :key="index" class="text-sm">
                {{ error }}
              </li>
            </ul>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button
            @click="showSubmissionErrorModal = false"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import apiService from '@/services/services'
import PaymentModal from '@/components/common/PaymentModal.vue'
import { useToast } from 'vue-toastification'

const OWNERSHIP_CHANGE_FEE = 1000 // Example fee for ownership change
let ecpfProfileId = null

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const paymentModalRef = ref(null)
const pendingFormData = ref(null)
const isSubmitting = ref(false)
const loading = ref(true)
const isLoadingDCRC = ref(false)
const rubApiQuery = ref('')
const allowManualEntry = ref(false)
const validationErrors = ref([])
const errors = reactive({})
const highlightErrors = ref(false)
const showSubmissionErrorModal = ref(false)
const submissionErrors = ref([])
const isEditing = ref(false)

const formData = reactive({
  currentEcpf: {
    licenseNo: '',
    name: '',
    proprietor: '',
    location: '',
  },
  personalInfo: {
    cidNo: '',
    name: '',
    gender: '',
    dob: '',
    contactNo: '',
    email: '',
  },
  residentialAddress: {
    officeNumber: '',
    flatNo: '',
    buildingNo: '',
    location: '',
    gewogThrom: '',
    dzongkhagThromde: '',
  },
  permanentAddress: {
    villageChiwog: '',
    gewog: '',
    dungkhag: '',
    dzongkhagThromde: '',
  },
  education: {
    course: '',
    institute: '',
    university: '',
  },
  proposal: {
    firmName: '',
    firmAddress: '',
    firmLocation: '',
  },
  linkages: [{ name: '', location: '', country: '', recognition: null, approval: null }],
  documents: {
    cvApplicant: null,
    cvCounsellors: null,
    cidGuarantor: null,
    proposalDetails: null,
    declarationRemarks: '',
    declarationAgreed: false,
  },
})

const isCIDValid = computed(() => {
  return /^\d{11}$/.test(formData.personalInfo.cidNo)
})

const canSubmit = computed(() => {
  const isValid = (
    formData.personalInfo.cidNo &&
    isCIDValid.value &&
    formData.proposal.firmName &&
    formData.proposal.firmAddress &&
    formData.documents.cvApplicant &&
    formData.documents.cvCounsellors &&
    formData.documents.cidGuarantor &&
    formData.documents.proposalDetails &&
    formData.documents.declarationAgreed &&
    ecpfProfileId
  )
  console.log('canSubmit:', isValid, {
    cidNo: formData.personalInfo.cidNo,
    isCIDValid: isCIDValid.value,
    firmName: formData.proposal.firmName,
    firmAddress: formData.proposal.firmAddress,
    cvApplicant: formData.documents.cvApplicant,
    cvCounsellors: formData.documents.cvCounsellors,
    cidGuarantor: formData.documents.cidGuarantor,
    proposalDetails: formData.documents.proposalDetails,
    declarationAgreed: formData.documents.declarationAgreed,
    ecpfProfileId: ecpfProfileId,
  })
  return isValid
})

watch(
  () => formData.documents.declarationAgreed,
  (newValue) => {
    console.log('declarationAgreed changed:', newValue)
  },
)

const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  const [day, month, year] = dateString.split('/')
  return `${day}/${month}/${year}`
}

const validateCID = () => {
  if (!formData.personalInfo.cidNo) {
    errors.cidNo = 'CID Number is required.'
  } else if (!isCIDValid.value) {
    errors.cidNo = 'CID must be an 11-digit number.'
  } else {
    errors.cidNo = null
  }
}

const searchByCID = async () => {
  if (!isCIDValid.value) {
    toast.error('Please enter a valid 11-digit CID Number.')
    return
  }

  if (!authStore.user?.id) {
    toast.error('User ID is not available. Please ensure you are logged in.')
    return
  }

  isLoadingDCRC.value = true
  try {
    const response = await apiService.fetchCitizenDetails(formData.personalInfo.cidNo, {
      params: { user_id: authStore.user.id },
    })

    const genderMap = {
      F: 'Female',
      M: 'Male',
      O: 'Other',
    }

    Object.assign(formData.personalInfo, {
      name: response.data.applicants_name || '',
      gender: genderMap[response.data.gender] || '',
      dob: formatDateForInput(response.data.date_of_birth) || '',
      contactNo: response.data.mobile_number || '',
      email: response.data.email || '',
    })

    Object.assign(formData.residentialAddress, {
      officeNumber: response.data.office_number || '',
      flatNo: response.data.flat_no || '',
      buildingNo: response.data.building_no || '',
      location: response.data.location || '',
      gewogThrom: response.data.gewog || '',
      dzongkhagThromde: response.data.dzongkhag || '',
    })

    Object.assign(formData.permanentAddress, {
      villageChiwog: response.data.village || '',
      gewog: response.data.gewog || '',
      dungkhag: response.data.dungkhag || '',
      dzongkhagThromde: response.data.dzongkhag || '',
    })

    toast.success('DCRC data fetched successfully.')
  } catch (error) {
    console.error('Error fetching DCRC data:', error)
    if (error.response?.data?.error) {
      toast.error(error.response.data.error)
    } else {
      toast.error('Failed to fetch DCRC data. Please enter details manually.')
    }
    Object.assign(formData.personalInfo, {
      name: '',
      gender: '',
      dob: '',
      contactNo: '',
      email: '',
    })
    Object.assign(formData.residentialAddress, {
      officeNumber: '',
      flatNo: '',
      buildingNo: '',
      location: '',
      gewogThrom: '',
      dzongkhagThromde: '',
    })
    Object.assign(formData.permanentAddress, {
      villageChiwog: '',
      gewog: '',
      dungkhag: '',
      dzongkhagThromde: '',
    })
  } finally {
    isLoadingDCRC.value = false
  }
}

const loadDraftFromLocalStorage = () => {
  const savedDraft = localStorage.getItem('ecpf_ownership_draft')
  if (savedDraft) {
    try {
      const draft = JSON.parse(savedDraft)
      Object.assign(formData.currentEcpf, draft.formData.currentEcpf || {})
      Object.assign(formData.personalInfo, draft.formData.personalInfo || {})
      Object.assign(formData.residentialAddress, draft.formData.residentialAddress || {})
      Object.assign(formData.permanentAddress, draft.formData.permanentAddress || {})
      Object.assign(formData.education, draft.formData.education || {})
      Object.assign(formData.proposal, draft.formData.proposal || {})
      formData.linkages =
        draft.formData.linkages || [{ name: '', location: '', country: '', recognition: null, approval: null }]
      Object.assign(formData.documents, draft.formData.documents || {})
      if (draft.ecpfProfileId) {
        ecpfProfileId = draft.ecpfProfileId
      }
      toast.info('Loaded saved draft.')
    } catch (error) {
      console.error('Error parsing draft from localStorage:', error)
      toast.error('Failed to load saved draft.')
    }
  }
}

onMounted(async () => {
  loading.value = true
  try {
    if (!authStore.isAuthenticated || !authStore.user) {
      toast.error('Please log in to access the ECPF ownership change form.')
      router.push('/login')
      loading.value = false
      return
    }

    loadDraftFromLocalStorage()

    let fetchedEcpfData = null
    if (!authStore.user.cid) {
      toast.error('Unable to fetch ECPF profile: User CID not found.')
      formData.currentEcpf.name = 'N/A'
      validationErrors.value.push(
        'Unable to fetch ECPF profile: CID not found in your user profile. Please contact support.',
      )
    } else {
      try {
        const response = await apiService.getEcpfDetailsByCID(authStore.user.cid)
        fetchedEcpfData = response.data
        ecpfProfileId = fetchedEcpfData.id
        if (!ecpfProfileId) {
          toast.warn('ECPF profile ID not found. Form submission might fail.')
        }
      } catch (apiError) {
        console.error('Error fetching ECPF profile by CID:', apiError)
        toast.error('Failed to fetch ECPF profile data. Please try again or contact support.')
        formData.currentEcpf.name = 'N/A (Error fetching)'
      }
    }

    if (!localStorage.getItem('ecpf_ownership_draft') || fetchedEcpfData) {
      formData.currentEcpf.licenseNo = fetchedEcpfData?.license_no || 'N/A'
      formData.currentEcpf.name =
        fetchedEcpfData?.institute_name || fetchedEcpfData?.name || fetchedEcpfData?.firm_name || 'N/A'
      formData.currentEcpf.proprietor = fetchedEcpfData?.proprietor_name || authStore.fullName || 'N/A'
      formData.currentEcpf.location =
        [fetchedEcpfData?.dzongkhag, fetchedEcpfData?.gewog, fetchedEcpfData?.village]
          .filter(Boolean)
          .join(', ') || fetchedEcpfData?.location || 'N/A'
    }
  } catch (error) {
    console.error('Error during onMounted initialization:', error)
    toast.error('Failed to initialize form. Please try refreshing the page.')
  } finally {
    loading.value = false
  }
})

const searchRUB = async () => {
  try {
    const response = await apiService.searchRUB(rubApiQuery.value)
    const data = response.data
    if (data) {
      formData.education.course = data.course || ''
      formData.education.institute = data.institute || ''
      formData.education.university = data.university || ''
      allowManualEntry.value = false
      toast.success('Education data fetched successfully.')
    } else {
      toast.error('No results found from RUB API.')
      allowManualEntry.value = true
    }
  } catch (error) {
    console.error('Error searching RUB API:', error)
    toast.error('Error searching RUB API')
    allowManualEntry.value = true
  }
}

const addLinkage = () => {
  formData.linkages.push({ name: '', location: '', country: '', recognition: null, approval: null })
}

const removeLinkage = (index) => {
  formData.linkages.splice(index, 1)
}

const handleRecognitionUpload = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    formData.linkages[index].recognition = file.name
  } else {
    formData.linkages[index].recognition = null
  }
}

const handleApprovalUpload = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    formData.linkages[index].approval = file.name
  } else {
    formData.linkages[index].approval = null
  }
}

const handleCvApplicantUpload = (event) => {
  handleFileUpload(event, 'cvApplicant')
}

const handleCvCounsellorsUpload = (event) => {
  handleFileUpload(event, 'cvCounsellors')
}

const handleCidGuarantorUpload = (event) => {
  handleFileUpload(event, 'cidGuarantor')
}

const handleProposalDetailsUpload = (event) => {
  handleFileUpload(event, 'proposalDetails')
}

const handleFileUpload = (event, field) => {
  const file = event.target.files[0]
  if (file) {
    formData.documents[field] = file.name
  } else {
    formData.documents[field] = null
  }
}

const validateForm = () => {
  validationErrors.value = []
  if (!formData.personalInfo.cidNo) {
    validationErrors.value.push('CID Number is required.')
  } else if (!isCIDValid.value) {
    validationErrors.value.push('CID Number must be an 11-digit number.')
  }
  if (!formData.proposal.firmName) {
    validationErrors.value.push('Name of the Proposed Firm is required.')
  }
  if (!formData.proposal.firmAddress) {
    validationErrors.value.push('Address of the Proposed Firm is required.')
  }
  if (!formData.documents.cvApplicant) {
    validationErrors.value.push('CV of the Applicant is required.')
  }
  if (!formData.documents.cvCounsellors) {
    validationErrors.value.push('CV & Certificate of Counsellors is required.')
  }
  if (!formData.documents.cidGuarantor) {
    validationErrors.value.push('CID of Guarantor is required.')
  }
  if (!formData.documents.proposalDetails) {
    validationErrors.value.push('Proposal Details document is required.')
  }
  if (!formData.documents.declarationAgreed) {
    validationErrors.value.push('You must agree to the declaration.')
  }
  if (!ecpfProfileId) {
    validationErrors.value.push('ECPF profile ID is missing. Cannot submit form.')
  }
  return validationErrors.value.length === 0
}

const checkMissingFields = () => {
  submissionErrors.value = []
  if (!formData.personalInfo.cidNo || !isCIDValid.value) {
    submissionErrors.value.push('Valid 11-digit CID Number')
  }
  if (!formData.proposal.firmName) {
    submissionErrors.value.push('Name of the Proposed Firm')
  }
  if (!formData.proposal.firmAddress) {
    submissionErrors.value.push('Address of the Proposed Firm')
  }
  if (!formData.documents.cvApplicant) {
    submissionErrors.value.push('CV of the Applicant')
  }
  if (!formData.documents.cvCounsellors) {
    submissionErrors.value.push('CV & Certificate of Counsellors')
  }
  if (!formData.documents.cidGuarantor) {
    submissionErrors.value.push('CID of Guarantor')
  }
  if (!formData.documents.proposalDetails) {
    submissionErrors.value.push('Proposal Details')
  }
  if (!formData.documents.declarationAgreed) {
    submissionErrors.value.push('Declaration Agreement')
  }
  if (!ecpfProfileId) {
    submissionErrors.value.push('ECPF Profile ID (contact support if this persists)')
  }
}

const handleSubmitFlow = () => {
  highlightErrors.value = false
  submissionErrors.value = []
  if (!validateForm()) {
    toast.error('Please correct the errors in the form before submitting.')
    checkMissingFields()
    highlightErrors.value = true
    showSubmissionErrorModal.value = true
    return
  }
  if (!canSubmit.value) {
    checkMissingFields()
    highlightErrors.value = true
    showSubmissionErrorModal.value = true
    return
  }
  pendingFormData.value = JSON.parse(JSON.stringify(formData))
  if (paymentModalRef.value) {
    paymentModalRef.value.openModal()
  } else {
    toast.error('Payment module is not available. Please try again later.')
    console.error('PaymentModal ref is not available.')
  }
}

const handlePaymentCompleted = async (paymentData) => {
  if (!pendingFormData.value) {
    toast.error('No form data found to submit. Please try again.')
    isSubmitting.value = false
    return
  }
  isSubmitting.value = true
  validationErrors.value = []

  const cleanedLinkages = pendingFormData.value.linkages.map((linkage) => {
    const cleanLinkage = { ...linkage }
    if (cleanLinkage.recognition === null) delete cleanLinkage.recognition
    if (cleanLinkage.approval === null) delete cleanLinkage.approval
    return cleanLinkage
  })

  const submitData = {
    ...pendingFormData.value,
    linkages: cleanedLinkages,
    ecpf_profile: ecpfProfileId,
    payment_info: {
      reference_hash: paymentData.paymentHash,
      amount: OWNERSHIP_CHANGE_FEE,
      status: 'Completed',
    },
  }

  const documentsToSubmit = { ...submitData.documents }
  for (let key in documentsToSubmit) {
    if (documentsToSubmit[key] === null && key !== 'declarationRemarks' && key !== 'declarationAgreed') {
      delete documentsToSubmit[key]
    }
  }
  documentsToSubmit.declarationRemarks = documentsToSubmit.declarationRemarks || ''
  submitData.documents = documentsToSubmit

  try {
    const response = await apiService.submitOwnershipChange(submitData)
    console.log('Ownership change submitted successfully:', response.data)
    toast.success(
      `Ownership change submitted successfully! Payment Reference: ${paymentData.paymentHash.substring(0, 8)}...`,
    )
    pendingFormData.value = null
    localStorage.removeItem('ecpf_ownership_draft')
    // router.push('/success-page')
  } catch (error) {
    console.error('Error submitting ownership change:', error.response || error)
    if (error.response?.data) {
      const errors = error.response.data
      if (typeof errors === 'object' && errors !== null) {
        for (const [field, messages] of Object.entries(errors)) {
          const messagePrefix = field === 'detail' || field === 'non_field_errors' ? '' : `${field}: `
          if (Array.isArray(messages)) {
            messages.forEach((msg) => validationErrors.value.push(`${messagePrefix}${msg}`))
          } else {
            validationErrors.value.push(`${messagePrefix}${messages}`)
          }
        }
      } else if (typeof errors === 'string') {
        validationErrors.value.push(errors)
      } else {
        validationErrors.value.push('An unknown error occurred during submission.')
      }
      toast.error('Failed to submit: ' + (validationErrors.value[0] || 'Please check errors.'))
    } else {
      toast.error('Failed to submit. An unexpected error occurred.')
      validationErrors.value.push('An unexpected network or server error occurred.')
    }
  } finally {
    isSubmitting.value = false
  }
}

const handlePaymentModalClose = () => {
  console.log('Payment modal closed by user.')
  isSubmitting.value = false
}

const saveAsDraft = async () => {
  isSubmitting.value = true
  try {
    const draftData = {
      formData: JSON.parse(JSON.stringify(formData)),
      ecpfProfileId: ecpfProfileId,
    }
    localStorage.setItem('ecpf_ownership_draft', JSON.stringify(draftData))

    if (ecpfProfileId) {
      const draftPayload = {
        ...draftData.formData,
        ecpf_profile: ecpfProfileId,
        is_draft_user: true,
      }
      try {
        const response = await apiService.saveOwnershipChangeDraft(draftPayload)
        console.log('Saved as draft to server:', response.data)
      } catch (error) {
        console.error('Error saving draft to server:', error.response || error)
      }
    }

    toast.success('Draft saved successfully.')
  } catch (error) {
    console.error('Error saving draft:', error)
    toast.error('Failed to save draft. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

const editApplication = () => {
  isEditing.value = true
  toast.info('Form is now editable. Make your changes and save.')
}

const saveChanges = async () => {
  isSubmitting.value = true
  try {
    const draftData = {
      formData: JSON.parse(JSON.stringify(formData)),
      ecpfProfileId: ecpfProfileId,
    }
    localStorage.setItem('ecpf_ownership_draft', JSON.stringify(draftData))

    if (ecpfProfileId) {
      const draftPayload = {
        ...draftData.formData,
        ecpf_profile: ecpfProfileId,
        is_draft_user: true,
      }
      try {
        const response = await apiService.saveOwnershipChangeDraft(draftPayload)
        console.log('Changes saved to server:', response.data)
      } catch (error) {
        console.error('Error saving changes to server:', error.response || error)
      }
    }

    toast.success('Changes saved successfully.')
    // Optionally keep isEditing true to allow further edits
    // isEditing.value = false // Uncomment to exit edit mode after saving
  } catch (error) {
    console.error('Error saving changes:', error)
    toast.error('Failed to save changes. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
```