<template
  ><div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Change in Ownership of ECPF</h1>
      <p class="text-gray-600">
        Fill out the form below to request a change in ownership of the ECPF.
      </p>
    </div>

    <div v-if="loading" class="text-center py-10">
      <!-- Loading Spinner -->
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
              <label class="block text-sm font-medium text-gray-700"
                >CID No. <span class="text-red-500">*</span></label
              >
              <div class="flex">
                <input
                  type="text"
                  v-model="formData.personalInfo.cidNo"
                  :disabled="isLoadingDCRC || (isEditing && !!formData.personalInfo.cidNo)"
                  class="mt-1 block w-full px-3 py-2 border rounded-l-md shadow-sm"
                  :class="{
                    'border-red-500':
                      highlightErrors && (!formData.personalInfo.cidNo || !isCIDValid),
                    'bg-gray-100': isEditing && !!formData.personalInfo.cidNo,
                  }"
                  placeholder="Enter 11-digit CID Number"
                  @input="validateCID"
                />
                <button
                  type="button"
                  @click="searchByCID"
                  :disabled="!isCIDValid || isLoadingDCRC || isEditing"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-r-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {{ isLoadingDCRC ? 'Searching...' : 'Search' }}
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                Enter an 11-digit CID to fetch data from DCRC. Fields will be editable if data is
                not found or if in edit mode.
              </p>
              <span v-if="errors.cidNo" class="text-xs text-red-500 mt-1">{{ errors.cidNo }}</span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Applicant's Name</label>
              <input
                type="text"
                v-model="formData.personalInfo.name"
                :readonly="!isEditing && !!formData.personalInfo.name"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                :class="{ 'bg-gray-100': !isEditing && !!formData.personalInfo.name }"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gender</label>
              <input
                type="text"
                v-model="formData.personalInfo.gender"
                :readonly="!isEditing && !!formData.personalInfo.gender"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                :class="{ 'bg-gray-100': !isEditing && !!formData.personalInfo.gender }"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="text"
                v-model="formData.personalInfo.dob"
                :readonly="!isEditing && !!formData.personalInfo.dob"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                :class="{ 'bg-gray-100': !isEditing && !!formData.personalInfo.dob }"
                placeholder="dd/mm/yyyy"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Contact No.</label>
              <input
                type="text"
                v-model="formData.personalInfo.contactNo"
                :readonly="!isEditing && !!formData.personalInfo.contactNo"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                :class="{ 'bg-gray-100': !isEditing && !!formData.personalInfo.contactNo }"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                v-model="formData.personalInfo.email"
                :readonly="!isEditing && !!formData.personalInfo.email"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                :class="{ 'bg-gray-100': !isEditing && !!formData.personalInfo.email }"
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
                :readonly="!isEditing && !!formData.residentialAddress.officeNumber"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                :class="{ 'bg-gray-100': !isEditing && !!formData.residentialAddress.officeNumber }"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Flat No.</label>
              <input
                type="text"
                v-model="formData.residentialAddress.flatNo"
                :readonly="!isEditing && !!formData.residentialAddress.flatNo"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                :class="{ 'bg-gray-100': !isEditing && !!formData.residentialAddress.flatNo }"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Building No.</label>
              <input
                type="text"
                v-model="formData.residentialAddress.buildingNo"
                :readonly="!isEditing && !!formData.residentialAddress.buildingNo"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                :class="{ 'bg-gray-100': !isEditing && !!formData.residentialAddress.buildingNo }"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                v-model="formData.residentialAddress.location"
                :readonly="!isEditing && !!formData.residentialAddress.location"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                :class="{ 'bg-gray-100': !isEditing && !!formData.residentialAddress.location }"
              />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from DCRC if available)</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gewog/Throm</label>
              <input
                type="text"
                v-model="formData.residentialAddress.gewogThrom"
                :readonly="!isEditing && !!formData.residentialAddress.gewogThrom"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                :class="{ 'bg-gray-100': !isEditing && !!formData.residentialAddress.gewogThrom }"
              />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from DCRC if available)</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Dzongkhag/Thromde</label>
              <input
                type="text"
                v-model="formData.residentialAddress.dzongkhagThromde"
                :readonly="!isEditing && !!formData.residentialAddress.dzongkhagThromde"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                :class="{
                  'bg-gray-100': !isEditing && !!formData.residentialAddress.dzongkhagThromde,
                }"
              />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from DCRC if available)</p>
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
                :readonly="!isEditing && !!formData.permanentAddress.villageChiwog"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                :class="{ 'bg-gray-100': !isEditing && !!formData.permanentAddress.villageChiwog }"
              />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from DCRC if available)</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gewog</label>
              <input
                type="text"
                v-model="formData.permanentAddress.gewog"
                :readonly="!isEditing && !!formData.permanentAddress.gewog"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                :class="{ 'bg-gray-100': !isEditing && !!formData.permanentAddress.gewog }"
              />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from DCRC if available)</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Dungkhag</label>
              <input
                type="text"
                v-model="formData.permanentAddress.dungkhag"
                :readonly="!isEditing && !!formData.permanentAddress.dungkhag"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                :class="{ 'bg-gray-100': !isEditing && !!formData.permanentAddress.dungkhag }"
              />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from DCRC, if available)</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Dzongkhag/Thromde</label>
              <input
                type="text"
                v-model="formData.permanentAddress.dzongkhagThromde"
                :readonly="!isEditing && !!formData.permanentAddress.dzongkhagThromde"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                :class="{
                  'bg-gray-100': !isEditing && !!formData.permanentAddress.dzongkhagThromde,
                }"
              />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from DCRC if available)</p>
            </div>
          </div>
        </section>

        <!-- Education Details -->
        <section>
          <h2 class="text-lg font-medium mb-2 text-gray-700">Education Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Course/Qualification</label>
              <input
                type="text"
                v-model="formData.education.course"
                :readonly="!isEditing"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                :class="{ 'bg-gray-100': !isEditing }"
              />
              <p class="text-xs text-gray-500 mt-1">Please enter manually.</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Name of Institute</label>
              <input
                type="text"
                v-model="formData.education.institute"
                :readonly="!isEditing"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                :class="{ 'bg-gray-100': !isEditing }"
              />
              <p class="text-xs text-gray-500 mt-1">Please enter manually.</p>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Name of University</label>
              <input
                type="text"
                v-model="formData.education.university"
                :readonly="!isEditing"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                :class="{ 'bg-gray-100': !isEditing }"
              />
              <p class="text-xs text-gray-500 mt-1">Please enter manually.</p>
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
              <label class="block text-sm font-medium text-gray-700"
                >Name of the Proposed Firm <span class="text-red-500">*</span></label
              >
              <input
                type="text"
                v-model="formData.proposal.firmName"
                :readonly="!isEditing"
                class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
                :class="{
                  'border-red-500': highlightErrors && !formData.proposal.firmName,
                  'bg-gray-100': !isEditing,
                }"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Address of the Proposed Firm <span class="text-red-500">*</span></label
              >
              <input
                type="text"
                v-model="formData.proposal.firmAddress"
                :readonly="!isEditing"
                class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
                :class="{
                  'border-red-500': highlightErrors && !formData.proposal.firmAddress,
                  'bg-gray-100': !isEditing,
                }"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700"
                >Location of the Proposed Firm</label
              >
              <input
                type="text"
                v-model="formData.proposal.firmLocation"
                :readonly="!isEditing"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                :class="{ 'bg-gray-100': !isEditing }"
              />
              <p class="text-xs text-gray-500 mt-1">
                Auto-filled from current ECPF location if available. Editable for new proposed
                location.
              </p>
            </div>
          </div>
        </section>

        <!-- Institute/Colleges/University Linkages -->
        <section>
          <h2 class="text-lg font-medium mb-2 text-gray-700">
            Institute/Colleges/University Linkages
          </h2>
          <p class="text-sm text-gray-500 mb-4">
            Pre-filled if existing data is available. Editable when "Edit" mode is active.
          </p>
          <div
            v-for="(linkage, index) in formData.linkages"
            :key="index"
            class="p-4 border border-gray-200 rounded-md mb-4"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Name of Colleges/University/Institute</label
                >
                <input
                  type="text"
                  v-model="linkage.name"
                  :readonly="!isEditing"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  :class="{ 'bg-gray-100': !isEditing }"
                />
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
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Recognition/Accreditation</label
                >
                <div class="flex items-center space-x-2">
                  <input
                    type="text"
                    v-model="linkage.recognition"
                    readonly
                    class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                    placeholder="Filename will appear here"
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
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Approval from University</label
                >
                <div class="flex items-center space-x-2">
                  <input
                    type="text"
                    v-model="linkage.approval"
                    readonly
                    class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
                    placeholder="Filename will appear here"
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
              </div>
            </div>
            <div class="mt-4 flex justify-end">
              <button
                type="button"
                @click="removeLinkage(index)"
                class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                :disabled="!isEditing || formData.linkages.length === 1"
                :class="{ 'opacity-50 cursor-not-allowed': !isEditing || formData.linkages.length === 1 }"
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
              <label class="block text-sm font-medium text-gray-700"
                >CV of the Applicant <span class="text-red-500">*</span></label
              >
              <div class="flex items-center space-x-2">
                <input
                  type="text"
                  v-model="formData.documents.cvApplicant"
                  readonly
                  class="mt-1 block w-full px-3 py-2 bg-gray-100 border rounded-md shadow-sm"
                  :class="{ 'border-red-500': highlightErrors && !formData.documents.cvApplicant }"
                  placeholder="Filename will appear here"
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
              <label class="block text-sm font-medium text-gray-700"
                >CV & Certificate of Counsellors <span class="text-red-500">*</span></label
              >
              <div class="flex items-center space-x-2">
                <input
                  type="text"
                  v-model="formData.documents.cvCounsellors"
                  readonly
                  class="mt-1 block w-full px-3 py-2 bg-gray-100 border rounded-md shadow-sm"
                  :class="{
                    'border-red-500': highlightErrors && !formData.documents.cvCounsellors,
                  }"
                  placeholder="Filename will appear here"
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
              <label class="block text-sm font-medium text-gray-700"
                >CID of Guarantor <span class="text-red-500">*</span></label
              >
              <div class="flex items-center space-x-2">
                <input
                  type="text"
                  v-model="formData.documents.cidGuarantor"
                  readonly
                  class="mt-1 block w-full px-3 py-2 bg-gray-100 border rounded-md shadow-sm"
                  :class="{ 'border-red-500': highlightErrors && !formData.documents.cidGuarantor }"
                  placeholder="Filename will appear here"
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
              <label class="block text-sm font-medium text-gray-700"
                >Proposal Details <span class="text-red-500">*</span></label
              >
              <div class="flex items-center space-x-2">
                <input
                  type="text"
                  v-model="formData.documents.proposalDetails"
                  readonly
                  class="mt-1 block w-full px-3 py-2 bg-gray-100 border rounded-md shadow-sm"
                  :class="{
                    'border-red-500': highlightErrors && !formData.documents.proposalDetails,
                  }"
                  placeholder="Filename will appear here"
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
                  :class="{
                    'border-red-500': highlightErrors && !formData.documents.declarationAgreed,
                  }"
                  :disabled="!isEditing"
                />
                <span class="ml-2 text-sm text-gray-700">
                  I hereby declare that the information provided in this application is true and
                  correct to the best of my knowledge. <span class="text-red-500">*</span>
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
import { ref, reactive, onMounted, computed, } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import apiService from '@/services/services' // Ensure this path is correct
import PaymentModal from '@/components/common/PaymentModal.vue' // Ensure this path is correct
import { useToast } from 'vue-toastification'

const OWNERSHIP_CHANGE_FEE = 1000 // Example fee
let ecpfProfileId = null

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const paymentModalRef = ref(null)
const pendingFormData = ref(null)
const isSubmitting = ref(false)
const loading = ref(true)
const isLoadingDCRC = ref(false)
const validationErrors = ref([])
const errors = reactive({}) // For individual field errors, e.g., CID format
const highlightErrors = ref(false) // To trigger global error highlighting
const showSubmissionErrorModal = ref(false)
const submissionErrors = ref([]) // For the modal list
const isEditing = ref(false) // Controls global edit mode

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
    cvApplicant: null, // Will store filename for display
    cvCounsellors: null,
    cidGuarantor: null,
    proposalDetails: null,
    declarationRemarks: '',
    declarationAgreed: false,
    // Actual file objects can be stored separately if needed for FormData submission
    // cvApplicantFile: null,
    // ...
  },
})

const isCIDValid = computed(() => {
  return /^\d{11}$/.test(formData.personalInfo.cidNo)
})

const canSubmit = computed(() => {
  const isValid =
    formData.personalInfo.cidNo &&
    isCIDValid.value &&
    formData.personalInfo.name && // Applicant's name must be present
    formData.proposal.firmName &&
    formData.proposal.firmAddress &&
    formData.documents.cvApplicant &&
    formData.documents.cvCounsellors &&
    formData.documents.cidGuarantor &&
    formData.documents.proposalDetails &&
    formData.documents.declarationAgreed &&
    ecpfProfileId
  return isValid
})

const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  if (dateString.includes('T')) {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  } else if (dateString.includes('/')) {
    return dateString // Already in dd/mm/yyyy
  }
  // Attempt to parse if it's YYYY-MM-DD
  const parts = dateString.split('-')
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }
  return '' // Fallback
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
    toast.error('User ID is not available. Please log in.')
    return
  }

  isLoadingDCRC.value = true
  // Clear previous DCRC-populated fields
  Object.assign(formData.personalInfo, { name: '', gender: '', dob: '', contactNo: '', email: '' })
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

  try {
    const response = await apiService.fetchCitizenDetails(formData.personalInfo.cidNo, {
      params: { user_id: authStore.user.id },
    })
    const genderMap = { F: 'Female', M: 'Male', O: 'Other' }

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

    if (response.data.applicants_name) {
      toast.success('DCRC data fetched successfully.')
    } else {
      toast.info('DCRC data partially fetched or some fields missing. Please fill them manually.')
    }
  } catch (error) {
    console.error('Error fetching DCRC data:', error)
    toast.error(
      error.response?.data?.error ||
        'Failed to fetch DCRC data. Please enter details manually if not auto-filled.',
    )
  } finally {
    isLoadingDCRC.value = false
  }
}

const loadDraftFromLocalStorage = () => {
  const savedDraft = localStorage.getItem('ecpf_ownership_draft')
  if (savedDraft) {
    try {
      const draft = JSON.parse(savedDraft)
      // Safely assign to ensure no undefined overwrites if draft structure changes
      Object.keys(formData).forEach((sectionKey) => {
        if (draft.formData && draft.formData[sectionKey]) {
          if (sectionKey === 'linkages') {
            formData.linkages = Array.isArray(draft.formData.linkages)
              ? draft.formData.linkages
              : [{ name: '', location: '', country: '', recognition: null, approval: null }]
          } else {
            Object.assign(formData[sectionKey], draft.formData[sectionKey])
          }
        }
      })
      if (draft.ecpfProfileId) ecpfProfileId = draft.ecpfProfileId
      toast.info('Loaded saved draft.')
    } catch (e) {
      console.error('Error parsing draft:', e)
      toast.error('Failed to load corrupted draft.')
      localStorage.removeItem('ecpf_ownership_draft') // Clear corrupted draft
    }
  }
}

onMounted(async () => {
  loading.value = true
  try {
    if (!authStore.isAuthenticated || !authStore.user) {
      toast.error('Please log in to access this form.')
      router.push('/login') // Or your login route
      return // Stop further execution
    }

    loadDraftFromLocalStorage() // Load draft first

    let fetchedEcpfData = null
    if (authStore.user.cid) {
      try {
        const response = await apiService.getEcpfDetailsByCID(authStore.user.cid)
        fetchedEcpfData = response.data
        ecpfProfileId = fetchedEcpfData.id
      } catch (apiError) {
        console.error('Error fetching ECPF profile by CID:', apiError)
        toast.error('Failed to fetch ECPF profile data.')
      }
    } else {
      toast.error('User CID not found. Unable to fetch ECPF profile.')
    }

    // Populate Current ECPF Details and other auto-fillable fields
    // only if NOT loading from a draft that might have user-modified auto-filled data,
    // OR if fetchedEcpfData is available (meaning a fresh load or refresh)
    if (!localStorage.getItem('ecpf_ownership_draft') || fetchedEcpfData) {
      formData.currentEcpf.licenseNo = fetchedEcpfData?.license_number || 'N/A'
      formData.currentEcpf.name =
        fetchedEcpfData?.institute_name ||
        fetchedEcpfData?.name ||
        fetchedEcpfData?.firm_name ||
        'N/A'
      formData.currentEcpf.proprietor =
        fetchedEcpfData?.applicants_name || // From ECPF profile itself
        fetchedEcpfData?.proprietor_name || // If a specific field exists
        authStore.fullName ||
        'N/A'

      const currentEcpfGeoParts = [
        fetchedEcpfData?.location, // General location field
        fetchedEcpfData?.gewog_throm,
        fetchedEcpfData?.dzongkhag_thromde,
      ].filter(Boolean)
      formData.currentEcpf.location =
        currentEcpfGeoParts.length > 0 ? currentEcpfGeoParts.join(', ') : 'N/A'

      // Pre-fill proposed firm location with current ECPF location
      formData.proposal.firmLocation = formData.currentEcpf.location // Or be more specific if needed

      // Auto-fill linkages if available in fetchedEcpfData
      // IMPORTANT: Adjust 'fetchedEcpfData.your_linkages_array_key'
      if (
        fetchedEcpfData &&
        fetchedEcpfData.linkages_info && // Assuming 'linkages_info' is the key
        Array.isArray(fetchedEcpfData.linkages_info) &&
        fetchedEcpfData.linkages_info.length > 0
      ) {
        formData.linkages = fetchedEcpfData.linkages_info.map((link) => ({
          name: link.name || '',
          location: link.location || '',
          country: link.country || '',
          recognition: link.recognition_document_name || null, // Assuming filename is stored
          approval: link.approval_document_name || null, // Assuming filename is stored
        }))
      } else if (!localStorage.getItem('ecpf_ownership_draft')) {
        // If not loading from draft and no linkages from API, ensure it's the default
        formData.linkages = [
          { name: '', location: '', country: '', recognition: null, approval: null },
        ]
      }
    }
  } catch (error) {
    console.error('Error during onMounted:', error)
    toast.error('Failed to initialize form. Please refresh.')
  } finally {
    loading.value = false
  }
})

const addLinkage = () => {
  formData.linkages.push({ name: '', location: '', country: '', recognition: null, approval: null })
}

const removeLinkage = (index) => {
  if (formData.linkages.length > 1) {
    formData.linkages.splice(index, 1)
  } else {
    toast.info('At least one linkage entry is required. You can clear the fields if needed.')
  }
}

const handleFileUploadEvent = (event, targetArray, index, fieldName) => {
  const file = event.target.files[0]
  if (file) {
    if (targetArray) { // For linkages
      targetArray[index][fieldName] = file.name
      // targetArray[index][`${fieldName}File`] = file; // Store actual file
    } else { // For documents
      formData.documents[fieldName] = file.name
      // formData.documents[`${fieldName}File`] = file; // Store actual file
    }
  } else {
     if (targetArray) {
      targetArray[index][fieldName] = null
      // targetArray[index][`${fieldName}File`] = null;
    } else {
      formData.documents[fieldName] = null
      // formData.documents[`${fieldName}File`] = null;
    }
  }
  event.target.value = '' // Clear file input for re-selection
}

const handleRecognitionUpload = (event, index) => handleFileUploadEvent(event, formData.linkages, index, 'recognition');
const handleApprovalUpload = (event, index) => handleFileUploadEvent(event, formData.linkages, index, 'approval');
const handleCvApplicantUpload = (event) => handleFileUploadEvent(event, null, null, 'cvApplicant');
const handleCvCounsellorsUpload = (event) => handleFileUploadEvent(event, null, null, 'cvCounsellors');
const handleCidGuarantorUpload = (event) => handleFileUploadEvent(event, null, null, 'cidGuarantor');
const handleProposalDetailsUpload = (event) => handleFileUploadEvent(event, null, null, 'proposalDetails');


const validateForm = () => {
  validationErrors.value = []
  if (!formData.personalInfo.cidNo || !isCIDValid.value)
    validationErrors.value.push('Valid 11-digit CID Number is required.')
  if (!formData.personalInfo.name)
    validationErrors.value.push(
      "Applicant's Name is required. Search by CID or enter manually.",
    )
  if (!formData.proposal.firmName)
    validationErrors.value.push('Name of the Proposed Firm is required.')
  if (!formData.proposal.firmAddress)
    validationErrors.value.push('Address of the Proposed Firm is required.')
  if (!formData.documents.cvApplicant)
    validationErrors.value.push('CV of the Applicant is required.')
  if (!formData.documents.cvCounsellors)
    validationErrors.value.push('CV & Certificate of Counsellors is required.')
  if (!formData.documents.cidGuarantor)
    validationErrors.value.push('CID of Guarantor is required.')
  if (!formData.documents.proposalDetails)
    validationErrors.value.push('Proposal Details document is required.')
  if (!formData.documents.declarationAgreed)
    validationErrors.value.push('You must agree to the declaration.')
  if (!ecpfProfileId) validationErrors.value.push('ECPF profile ID is missing.')
  return validationErrors.value.length === 0
}

const checkMissingFields = () => {
  submissionErrors.value = [] // Clear previous
  if (!formData.personalInfo.cidNo || !isCIDValid.value)
    submissionErrors.value.push('Valid 11-digit CID Number')
  if (!formData.personalInfo.name)
    submissionErrors.value.push("Applicant's Name (search by CID or enter manually)")
  if (!formData.proposal.firmName) submissionErrors.value.push('Name of the Proposed Firm')
  if (!formData.proposal.firmAddress) submissionErrors.value.push('Address of the Proposed Firm')
  if (!formData.documents.cvApplicant) submissionErrors.value.push('CV of the Applicant')
  if (!formData.documents.cvCounsellors)
    submissionErrors.value.push('CV & Certificate of Counsellors')
  if (!formData.documents.cidGuarantor) submissionErrors.value.push('CID of Guarantor')
  if (!formData.documents.proposalDetails) submissionErrors.value.push('Proposal Details')
  if (!formData.documents.declarationAgreed) submissionErrors.value.push('Declaration Agreement')
  if (!ecpfProfileId) submissionErrors.value.push('ECPF Profile ID (contact support)')
}

const handleSubmitFlow = () => {
  highlightErrors.value = false
  if (!validateForm()) {
    toast.error('Please correct the errors in the form.')
    checkMissingFields() // Populate submissionErrors for the modal
    highlightErrors.value = true
    showSubmissionErrorModal.value = true
    return
  }
  // canSubmit is already checked by validateForm implicitly
  pendingFormData.value = JSON.parse(JSON.stringify(formData)) // Deep copy
  paymentModalRef.value?.openModal()
}

const handlePaymentCompleted = async (paymentData) => {
  if (!pendingFormData.value) {
    toast.error('No form data to submit.')
    return
  }
  isSubmitting.value = true
  validationErrors.value = [] // Clear previous submission errors

  // Prepare payload - this assumes filenames are sent.
  // If actual files need to be sent, you'd build FormData here.
  const cleanedLinkages = pendingFormData.value.linkages
    .map(linkage => {
      const cleanLinkage = { ...linkage };
      // Remove null or empty string file names before sending
      if (!cleanLinkage.recognition) delete cleanLinkage.recognition;
      if (!cleanLinkage.approval) delete cleanLinkage.approval;
      return cleanLinkage;
    })
    .filter(linkage => linkage.name); // Only send linkages that have a name

  const documentsToSubmit = { ...pendingFormData.value.documents };
  Object.keys(documentsToSubmit).forEach(key => {
    if (documentsToSubmit[key] === null && key !== 'declarationRemarks' && key !== 'declarationAgreed') {
      delete documentsToSubmit[key];
    }
  });
  documentsToSubmit.declarationRemarks = documentsToSubmit.declarationRemarks || '';


  const submitData = {
    ...pendingFormData.value, // Includes all sections
    linkages: cleanedLinkages,
    documents: documentsToSubmit,
    ecpf_profile: ecpfProfileId,
    payment_info: {
      reference_hash: paymentData.paymentHash,
      amount: OWNERSHIP_CHANGE_FEE,
      status: 'Completed',
    },
  }
  // Remove file helper props if they exist (e.g., cvApplicantFile) before sending JSON
  // delete submitData.documents.cvApplicantFile; // etc.

  try {
    await apiService.submitOwnershipChange(submitData)
    toast.success(
      `Ownership change submitted! Ref: ${paymentData.paymentHash.substring(0, 8)}...`,
    )
    pendingFormData.value = null
    localStorage.removeItem('ecpf_ownership_draft')
    // router.push('/dashboard'); // Or success page
  } catch (error) {
    console.error('Error submitting ownership change:', error.response || error)
    const errData = error.response?.data
    if (errData && typeof errData === 'object') {
      Object.entries(errData).forEach(([field, messages]) => {
        const prefix = field === 'detail' || field === 'non_field_errors' ? '' : `${field}: `
        ;(Array.isArray(messages) ? messages : [messages]).forEach((msg) =>
          validationErrors.value.push(`${prefix}${msg}`),
        )
      })
    } else if (typeof errData === 'string') {
      validationErrors.value.push(errData)
    } else {
      validationErrors.value.push('An unknown submission error occurred.')
    }
    toast.error('Submission failed: ' + (validationErrors.value[0] || 'Please check errors.'))
  } finally {
    isSubmitting.value = false
  }
}

const handlePaymentModalClose = () => {
  isSubmitting.value = false // Reset if payment is cancelled
}

const saveAsDraft = async () => {
  isSubmitting.value = true // Visual feedback
  try {
    const draft = { formData: JSON.parse(JSON.stringify(formData)), ecpfProfileId }
    localStorage.setItem('ecpf_ownership_draft', JSON.stringify(draft))

    if (ecpfProfileId && apiService.saveOwnershipChangeDraft) {
      // Optional: Save to backend
      await apiService.saveOwnershipChangeDraft({ ...draft.formData, ecpf_profile: ecpfProfileId, is_draft_user: true })
    }
    toast.success('Draft saved locally.')
  } catch (e) {
    console.error('Error saving draft:', e)
    toast.error('Failed to save draft.')
  } finally {
    isSubmitting.value = false
  }
}

const editApplication = () => {
  isEditing.value = true
  toast.info('Form is now editable.')
}

const saveChanges = async () => { // Similar to saveAsDraft
  await saveAsDraft(); // Reuse draft saving logic
  // isEditing.value = false; // Optionally exit edit mode
}

// Watch for changes to auto-save or provide feedback (optional)
// watch(formData, (newData) => {
// console.log('Form data changed:', newData);
// Consider debouncing if auto-saving to backend
// }, { deep: true });
</script>