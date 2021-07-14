<template>
  <div class="p-8 min-h-screen bg-gray-50">
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
                  :disabled="isLoadingDCRC || isEditing"
                  class="mt-1 block w-full px-3 py-2 border rounded-l-md shadow-sm"
                  :class="{
                    'border-red-500':
                      highlightErrors && (!formData.personalInfo.cidNo || !isCIDValid),
                    'bg-gray-100': isEditing && !!formData.personalInfo.cidNo, // Readonly look if editing and has value from initial search
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
                not found.
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
            <div>
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
            <div>
              <label class="block text-sm font-medium text-gray-700"
                >Location of the Proposed Firm</label
              >
              <input
                type="text"
                v-model="formData.proposal.firmLocation"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from source if available)</p>
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
                <label class="block text-sm font-medium text-gray-700">Probable Linkages</label>
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
                :class="{
                  'opacity-50 cursor-not-allowed': !isEditing || formData.linkages.length === 1,
                }"
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
// const rubApiQuery = ref('') // Removed for RUB API
// const allowManualEntry = ref(false) // Removed for RUB API
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
  const isValid =
    formData.personalInfo.cidNo &&
    isCIDValid.value &&
    formData.personalInfo.name && // Added check for applicant's name after DCRC search
    formData.proposal.firmName &&
    formData.proposal.firmAddress &&
    formData.documents.cvApplicant &&
    formData.documents.cvCounsellors &&
    formData.documents.cidGuarantor &&
    formData.documents.proposalDetails &&
    formData.documents.declarationAgreed &&
    ecpfProfileId
  console.log('canSubmit:', isValid, {
    cidNo: formData.personalInfo.cidNo,
    isCIDValid: isCIDValid.value,
    applicantName: formData.personalInfo.name,
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
  // Assuming API might send YYYY-MM-DDTHH:MM:SS or DD/MM/YYYY
  if (dateString.includes('T')) {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  } else if (dateString.includes('/')) {
    return dateString // Already in dd/mm/yyyy
  }
  return '' // Fallback for unknown format
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
  // Clear previous DCRC data before new search
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
      gewogThrom: response.data.gewog || '', // DCRC provides 'gewog'
      dzongkhagThromde: response.data.dzongkhag || '', // DCRC provides 'dzongkhag'
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
    if (error.response?.data?.error) {
      toast.error(error.response.data.error)
    } else {
      toast.error('Failed to fetch DCRC data. Please enter details manually if not auto-filled.')
    }
    // Fields are already cleared or will remain empty, allowing manual input as per new :readonly logic
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
      formData.linkages = draft.formData.linkages || [
        { name: '', location: '', country: '', recognition: null, approval: null },
      ]
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
      formData.currentEcpf.licenseNo = fetchedEcpfData?.license_number || 'N/A' // Corrected key
      formData.currentEcpf.name =
        fetchedEcpfData?.institute_name ||
        fetchedEcpfData?.name ||
        fetchedEcpfData?.firm_name ||
        'N/A'
      formData.currentEcpf.proprietor =
        fetchedEcpfData?.applicants_name || // Assuming proprietor is the applicant name from ECPF profile
        fetchedEcpfData?.proprietor_name || // Fallback if specific proprietor_name exists
        authStore.fullName ||
        'N/A'

      const ecpfLocParts = [
        fetchedEcpfData?.location,
        fetchedEcpfData?.gewog_throm, // Assuming 'gewog_throm' from API for ECPF
        fetchedEcpfData?.dzongkhag_thromde, // Assuming 'dzongkhag_thromde' from API for ECPF
      ].filter(Boolean)
      formData.currentEcpf.location =
        ecpfLocParts.length > 0 ? ecpfLocParts.join(', ') : fetchedEcpfData?.location || 'N/A'

      // Auto-fill linkages if available in fetchedEcpfData
      // IMPORTANT: Adjust 'fetchedEcpfData.existing_linkages_key' to the actual key in your API response
      if (
        fetchedEcpfData &&
        fetchedEcpfData.linkages_info &&
        Array.isArray(fetchedEcpfData.linkages_info) &&
        fetchedEcpfData.linkages_info.length > 0
      ) {
        formData.linkages = fetchedEcpfData.linkages_info.map((link) => ({
          name: link.name || '',
          location: link.location || '',
          country: link.country || '',
          // Assuming file names are stored directly if pre-filled
          recognition: link.recognition_document_name || null,
          approval: link.approval_document_name || null,
          // If you store actual file objects or IDs, adjust accordingly
        }))
      } else if (!localStorage.getItem('ecpf_ownership_draft')) {
        // Only reset if not loading from draft
        formData.linkages = [
          { name: '', location: '', country: '', recognition: null, approval: null },
        ]
      }
    }
  } catch (error) {
    console.error('Error during onMounted initialization:', error)
    toast.error('Failed to initialize form. Please try refreshing the page.')
  } finally {
    loading.value = false
  }
})

// RUB API search function removed
// const searchRUB = async () => { ... }

const addLinkage = () => {
  formData.linkages.push({ name: '', location: '', country: '', recognition: null, approval: null })
}

const removeLinkage = (index) => {
  if (formData.linkages.length > 1) {
    // Prevent removing the last one
    formData.linkages.splice(index, 1)
  } else {
    toast.info('At least one linkage entry is required. You can clear the fields if needed.')
  }
}

const handleRecognitionUpload = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    formData.linkages[index].recognition = file.name // Store filename for display
    // You might want to store the actual file object if you're uploading it directly without a separate submit step
    // formData.linkages[index].recognitionFile = file;
  } else {
    formData.linkages[index].recognition = null
    // formData.linkages[index].recognitionFile = null;
  }
  event.target.value = '' // Clear the file input
}

const handleApprovalUpload = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    formData.linkages[index].approval = file.name // Store filename for display
    // formData.linkages[index].approvalFile = file;
  } else {
    formData.linkages[index].approval = null
    // formData.linkages[index].approvalFile = null;
  }
  event.target.value = '' // Clear the file input
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
    formData.documents[field] = file.name // Store filename for display
    // formData.documents[`${field}File`] = file; // Store actual file object if needed for submission
  } else {
    formData.documents[field] = null
    // formData.documents[`${field}File`] = null;
  }
  event.target.value = '' // Clear the file input
}

const validateForm = () => {
  validationErrors.value = []
  if (!formData.personalInfo.cidNo) {
    validationErrors.value.push('CID Number is required.')
  } else if (!isCIDValid.value) {
    validationErrors.value.push('CID Number must be an 11-digit number.')
  }
  if (!formData.personalInfo.name) {
    // Check if applicant's name is filled (after DCRC attempt)
    validationErrors.value.push(
      "Applicant's Name is required. Please search by CID or enter manually if not found.",
    )
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
  if (!formData.personalInfo.name) {
    submissionErrors.value.push("Applicant's Name (search by CID or enter manually)")
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
  pendingFormData.value = JSON.parse(JSON.stringify(formData)) // Deep copy
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

  // Prepare submitData, potentially including actual file objects if stored
  // For now, assuming filenames are sent as strings and backend handles file association via other means or separate uploads later.
  // If you need to send FormData with files, this part would need significant changes.

  const cleanedLinkages = pendingFormData.value.linkages
    .map((linkage) => {
      const cleanLinkage = { ...linkage }
      // If you stored actual files, you'd handle them here for FormData
      // e.g., delete cleanLinkage.recognitionFile;
      if (cleanLinkage.recognition === null || cleanLinkage.recognition === '')
        delete cleanLinkage.recognition
      if (cleanLinkage.approval === null || cleanLinkage.approval === '')
        delete cleanLinkage.approval
      return cleanLinkage
    })
    .filter((linkage) => linkage.name) // Filter out empty linkages

  const submitData = {
    ...pendingFormData.value,
    linkages: cleanedLinkages,
    ecpf_profile: ecpfProfileId, // Should be just the ID
    payment_info: {
      reference_hash: paymentData.paymentHash,
      amount: OWNERSHIP_CHANGE_FEE,
      status: 'Completed',
    },
  }

  // Clean up document names (send only if a file was "uploaded")
  const documentsToSubmit = { ...submitData.documents }
  for (let key in documentsToSubmit) {
    if (
      documentsToSubmit[key] === null &&
      key !== 'declarationRemarks' && // Keep remarks even if empty
      key !== 'declarationAgreed'
    ) {
      delete documentsToSubmit[key]
    }
  }
  documentsToSubmit.declarationRemarks = documentsToSubmit.declarationRemarks || ''
  submitData.documents = documentsToSubmit

  try {
    // If submitting files, you'd construct FormData here and append files.
    // const finalPayload = new FormData();
    // Object.keys(submitData).forEach(key => {
    //   if (key === 'linkages' || key === 'documents') {
    //     // Special handling for files within these structures
    //   } else if (typeof submitData[key] === 'object' && submitData[key] !== null) {
    //     finalPayload.append(key, JSON.stringify(submitData[key]));
    //   } else {
    //     finalPayload.append(key, submitData[key]);
    //   }
    // });
    // Add actual file objects to FormData:
    // e.g. if (pendingFormData.value.documents.cvApplicantFile) finalPayload.append('cv_applicant_file', pendingFormData.value.documents.cvApplicantFile)

    const response = await apiService.submitOwnershipChange(submitData) // Or finalPayload if using FormData
    console.log('Ownership change submitted successfully:', response.data)
    toast.success(
      `Ownership change submitted successfully! Payment Reference: ${paymentData.paymentHash.substring(0, 8)}...`,
    )
    pendingFormData.value = null
    localStorage.removeItem('ecpf_ownership_draft')
    // router.push('/success-page') // Consider redirecting
  } catch (error) {
    console.error('Error submitting ownership change:', error.response || error)
    if (error.response?.data) {
      const errors = error.response.data
      if (typeof errors === 'object' && errors !== null) {
        for (const [field, messages] of Object.entries(errors)) {
          const messagePrefix =
            field === 'detail' || field === 'non_field_errors' ? '' : `${field}: `
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
  isSubmitting.value = false // Ensure submission flag is reset
}

const saveAsDraft = async () => {
  isSubmitting.value = true
  try {
    const draftDataToStore = {
      formData: JSON.parse(JSON.stringify(formData)), // Deep copy
      ecpfProfileId: ecpfProfileId,
    }
    localStorage.setItem('ecpf_ownership_draft', JSON.stringify(draftDataToStore))

    // Also send to backend if API supports it
    if (ecpfProfileId && apiService.saveOwnershipChangeDraft) {
      // Check if service method exists
      const draftPayload = {
        ...draftDataToStore.formData,
        ecpf_profile: ecpfProfileId,
        is_draft_user: true, // Or similar flag your backend expects
      }
      try {
        const response = await apiService.saveOwnershipChangeDraft(draftPayload)
        console.log('Saved as draft to server:', response.data)
      } catch (error) {
        console.error('Error saving draft to server:', error.response || error)
        // Don't let server save failure prevent local save toast
      }
    }

    toast.success('Draft saved successfully (locally).')
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
  // Essentially same as saveAsDraft but called when already editing
  isSubmitting.value = true
  try {
    const draftDataToStore = {
      formData: JSON.parse(JSON.stringify(formData)),
      ecpfProfileId: ecpfProfileId,
    }
    localStorage.setItem('ecpf_ownership_draft', JSON.stringify(draftDataToStore))

    if (ecpfProfileId && apiService.saveOwnershipChangeDraft) {
      const draftPayload = {
        ...draftDataToStore.formData,
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

    toast.success('Changes saved successfully (locally).')
    // isEditing.value = false; // Optionally exit edit mode
  } catch (error) {
    console.error('Error saving changes:', error)
    toast.error('Failed to save changes. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
