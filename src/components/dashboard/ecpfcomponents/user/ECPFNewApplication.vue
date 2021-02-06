<template>
  <div class="container mx-auto p-6">
    <div class="mb-8">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="currentTab = tab.id"
            :class="[
              currentTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Individual ECPF Establishment Form -->
    <div v-if="currentTab === 'individual'" class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">New ECPF Establishment</h2>
      <form @submit.prevent="submitForm">
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-lg font-semibold mb-4">1. Personal Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">CID No.</label>
              <input type="text" v-model="form.cidNo" disabled class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Applicant's Name</label>
              <input type="text" v-model="form.name" disabled class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gender</label>
              <input type="text" v-model="form.gender" disabled class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input type="text" v-model="form.dob" disabled class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Contact No.</label>
              <input type="number" v-model="form.contactNo" class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" v-model="form.email" class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-lg font-semibold mb-4">2. Residential/Present Address</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Office Number</label>
              <input type="number" v-model="form.officeNumber" class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Flat No.</label>
              <input type="text" v-model="form.flatNo" class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Building No.</label>
              <input type="text" v-model="form.buildingNo" class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Location</label>
              <select v-model="form.location" class="mt-1 block w-full rounded-md border-gray-300">
                <option value="">Select Location</option>
                <option v-for="location in locationOptions" :key="location" :value="location">{{ location }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gewog/Throm</label>
              <select v-model="form.gewogThrom" class="mt-1 block w-full rounded-md border-gray-300">
                <option value="">Select Gewog/Throm</option>
                <option v-for="gewog in gewogThromOptions" :key="gewog" :value="gewog">{{ gewog }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Dzongkhag/Thromde</label>
              <select v-model="form.dzongkhagThromde" class="mt-1 block w-full rounded-md border-gray-300">
                <option value="">Select Dzongkhag/Thromde</option>
                <option v-for="dzongkhag in dzongkhagThromdeOptions" :key="dzongkhag" :value="dzongkhag">{{ dzongkhag }}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-lg font-semibold mb-4">3. Permanent Address</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Village/Chiwog</label>
              <input type="text" v-model="form.villageChiwog" disabled class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gewog</label>
              <input type="text" v-model="form.gewog" disabled class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Dungkhag</label>
              <input type="text" v-model="form.dungkhag" disabled class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Dzongkhag/Thromde</label>
              <input type="text" v-model="form.dzongkhagThromdePermanent" disabled class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-lg font-semibold mb-4">4. Education Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Qualification</label>
              <input type="text" v-model="form.qualification" class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Qualification Type</label>
              <select v-model="form.qualificationType" class="mt-1 block w-full rounded-md border-gray-300">
                <option value="">Select Qualification Type</option>
                <option value="Class XII">Class XII</option>
                <option value="Diploma">Diploma</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Masters">Masters</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Name of Institute</label>
              <input type="text" v-model="form.instituteName" class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Name of University</label>
              <input type="text" v-model="form.universityName" class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-lg font-semibold mb-4">5. ECPF Establishment Proposal Details</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700">Name of the Proposed Firm</label>
            <input type="text" v-model="form.proposedFirmName" class="mt-1 block w-full rounded-md border-gray-300" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Type of Firm</label>
            <select v-model="form.firmType" class="mt-1 block w-full rounded-md border-gray-300">
              <option value="">Select Firm Type</option>
              <option value="independent">Independent</option>
              <option value="collaboration">Collaboration</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end space-x-4 mt-6">
          <button type="button" @click="saveAsDraft" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Save as Draft</button>
          <button type="submit" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Submit Application</button>
        </div>
      </form>
    </div>

     <!-- Branch ECPF Establishment Form -->
    <div v-if="currentTab === 'branch'" class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Branch ECPF Establishment Proposal</h2>
      <form @submit.prevent="submitForm">
        <!-- 1. Personal Information -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-lg font-semibold mb-4">1. Personal Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">CID No.</label>
              <input type="text" v-model="form.cidNo" disabled class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Applicant's Name</label>
              <input type="text" v-model="form.name" disabled class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gender</label>
              <input type="text" v-model="form.gender" disabled class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input type="text" v-model="form.dob" disabled class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Contact No.</label>
              <input type="number" v-model="form.contactNo" class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" v-model="form.email" class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
          </div>
        </div>

        <!-- 2. Residential/Present Address -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-lg font-semibold mb-4">2. Residential/Present Address</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Office Number</label>
              <input type="number" v-model="form.officeNumber" class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Flat No.</label>
              <input type="text" v-model="form.flatNo" class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Building No.</label>
              <input type="text" v-model="form.buildingNo" class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Location</label>
              <select v-model="form.location" class="mt-1 block w-full rounded-md border-gray-300">
                <option value="">Select Location</option>
                <option v-for="location in locationOptions" :key="location" :value="location">{{ location }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gewog/Throm</label>
              <select v-model="form.gewogThrom" class="mt-1 block w-full rounded-md border-gray-300">
                <option value="">Select Gewog/Throm</option>
                 <option v-for="gewog in gewogThromOptions" :key="gewog" :value="gewog">{{ gewog }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Dzongkhag/Thromde</label>
              <select v-model="form.dzongkhagThromde" class="mt-1 block w-full rounded-md border-gray-300">
                <option value="">Select Dzongkhag/Thromde</option>
                <option v-for="dzongkhag in dzongkhagThromdeOptions" :key="dzongkhag" :value="dzongkhag">{{ dzongkhag }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 3. Permanent Address -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-lg font-semibold mb-4">3. Permanent Address</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Village/Chiwog</label>
              <input type="text" v-model="form.villageChiwog" disabled class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gewog</label>
              <input type="text" v-model="form.gewog" disabled class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Dungkhag</label>
              <input type="text" v-model="form.dungkhag" disabled class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Dzongkhag/Thromde</label>
              <input type="text" v-model="form.dzongkhagThromdePermanent" disabled class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
          </div>
        </div>

        <!-- 4. Education Details -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-lg font-semibold mb-4">4. Education Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Qualification</label>
              <input type="text" v-model="form.qualification" class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
              <div>
              <label class="block text-sm font-medium text-gray-700">Qualification Type</label>
              <select v-model="form.qualificationType" class="mt-1 block w-full rounded-md border-gray-300">
                <option value="">Select Qualification Type</option>
                <option value="Class XII">Class XII</option>
                <option value="Diploma">Diploma</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Masters">Masters</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Name of Institute</label>
              <input type="text" v-model="form.instituteName" class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Name of University</label>
              <input type="text" v-model="form.universityName" class="mt-1 block w-full rounded-md border-gray-300" />
            </div>
          </div>
        </div>

        <!-- 5. Branch ECPF Establishment Proposal Details -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-lg font-semibold mb-4">5. Branch ECPF Establishment Proposal Details</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700">Name of the Existing ECPF</label>
            <input type="text" v-model="form.existingECPFName" class="mt-1 block w-full rounded-md border-gray-300" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Address of the Proposed Firm</label>
            <input type="text" v-model="form.proposedFirmAddress" class="mt-1 block w-full rounded-md border-gray-300" />
          </div>
           <div>
              <label class="block text-sm font-medium text-gray-700">Location of the Proposed Firm</label>
              <select v-model="form.proposedFirmLocation" class="mt-1 block w-full rounded-md border-gray-300">
                <option value="">Select Location</option>
                <option v-for="location in locationOptions" :key="location" :value="location">{{ location }}</option>
              </select>
            </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Type of Firm</label>
            <select v-model="form.firmType" class="mt-1 block w-full rounded-md border-gray-300">
              <option value="">Select Firm Type</option>
              <option value="independent">Independent</option>
              <option value="collaboration">Collaboration</option>
            </select>
          </div>
        </div>

        <!-- 6. Infrastructure -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-lg font-semibold mb-4">6. Infrastructure</h3>
          <div v-for="(infra, index) in form.infrastructure" :key="index" class="mb-4 border p-4 rounded">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Particulars</label>
                <select v-model="infra.particulars" class="mt-1 block w-full rounded-md border-gray-300">
                  <option value="">Select Particulars</option>
                  <option v-for="particular in infrastructureParticulars" :key="particular" :value="particular">{{ particular }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Description</label>
                <input type="text" v-model="infra.description" class="mt-1 block w-full rounded-md border-gray-300" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Quantity</label>
                <input type="number" v-model="infra.quantity" class="mt-1 block w-full rounded-md border-gray-300" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Remarks</label>
                <input type="text" v-model="infra.remarks" class="mt-1 block w-full rounded-md border-gray-300" />
              </div>
            </div>
            <button type="button" @click="removeInfrastructure(index)" class="mt-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700">Remove</button>
          </div>
          <button type="button" @click="addInfrastructure" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">Add More</button>
        </div>

        <!-- 7. Human Resource -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-lg font-semibold mb-4">7. Human Resource</h3>
          <div v-for="(hr, index) in form.humanResources" :key="index" class="mb-4 border p-4 rounded">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Position</label>
                <select v-model="hr.position" class="mt-1 block w-full rounded-md border-gray-300">
                  <option value="">Select Position</option>
                  <option v-for="position in hrPositions" :key="position" :value="position">{{ position }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">CID</label>
                <input type="text" v-model="hr.cid" @blur="searchCensusData(index)" class="mt-1 block w-full rounded-md border-gray-300" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">FullName</label>
                <input type="text" v-model="hr.fullName" class="mt-1 block w-full rounded-md border-gray-300" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Qualification</label>
                <select v-model="hr.qualification" class="mt-1 block w-full rounded-md border-gray-300">
                  <option value="">Select Qualification</option>
                   <option v-for="qualification in qualificationOptions" :key="qualification" :value="qualification">{{ qualification }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Contact Number</label>
                <input type="number" v-model="hr.contactNumber" class="mt-1 block w-full rounded-md border-gray-300" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" v-model="hr.emailAddress" class="mt-1 block w-full rounded-md border-gray-300" />
              </div>
               <div>
                <label class="block text-sm font-medium text-gray-700">CV & Certificates</label>
                <input type="file" @change="handleFileUpload($event, index)" accept=".pdf" class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
                <span v-if="hr.file" class="text-green-500">File Uploaded</span>
                <span v-else class="text-red-500">File Required</span>
              </div>
            </div>
            <button type="button" @click="removeHumanResource(index)" class="mt-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700">Remove</button>
          </div>
          <button type="button" @click="addHumanResource" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">Add More</button>
        </div>

        <!-- 8. Finance Plan -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-lg font-semibold mb-4">8. Finance Plan</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700">Finance Plan Details</label>
            <textarea v-model="form.financePlanDetails" rows="4" class="mt-1 block w-full rounded-md border-gray-300"></textarea>
          </div>
        </div>

        <!-- 9. Services -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-lg font-semibold mb-4">9. Services</h3>
          <div v-for="(service, index) in form.services" :key="index" class="mb-4 border p-4 rounded">
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Service Category</label>
                <select v-model="service.category" class="mt-1 block w-full rounded-md border-gray-300">
                  <option value="">Select Category</option>
                  <option v-for="category in serviceCategories" :key="category" :value="category">{{ category }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Details</label>
                <textarea v-model="service.details" rows="4" class="mt-1 block w-full rounded-md border-gray-300"></textarea>
              </div>
            </div>
            <button type="button" @click="removeService(index)" class="mt-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700">Remove</button>
          </div>
          <button type="button" @click="addService" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">Add More</button>
        </div>

        <!-- 10. SWOT Analysis -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-lg font-semibold mb-4">10. SWOT Analysis</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700">Strengths</label>
            <textarea v-model="form.strengths" rows="3" class="mt-1 block w-full rounded-md border-gray-300"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Weaknesses</label>
            <textarea v-model="form.weaknesses" rows="3" class="mt-1 block w-full rounded-md border-gray-300"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Opportunities</label>
            <textarea v-model="form.opportunities" rows="3" class="mt-1 block w-full rounded-md border-gray-300"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Threats</label>
            <textarea v-model="form.threats" rows="3" class="mt-1 block w-full rounded-md border-gray-300"></textarea>
          </div>
        </div>

        <!-- 11. Fee & Charges -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-lg font-semibold mb-4">11. Fee & Charges</h3>
          <div>
            <p>Total Amount: {{ calculateTotalAmount }}</p>
          </div>
          <div v-for="(fee, index) in form.fees" :key="index" class="mb-4 border p-4 rounded">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Fee Breakup</label>
                <input type="text" v-model="fee.breakup" class="mt-1 block w-full rounded-md border-gray-300" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Description</label>
                <input type="text" v-model="fee.description" class="mt-1 block w-full rounded-md border-gray-300" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Amount</label>
                <input type="number" v-model="fee.amount" class="mt-1 block w-full rounded-md border-gray-300" />
              </div>
            </div>
            <button type="button" @click="removeFee(index)" class="mt-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700">Remove</button>
          </div>
          <button type="button" @click="addFee" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700">Add More</button>
        </div>

        <!-- 12. Supporting Documents -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-lg font-semibold mb-4">12. Supporting Documents</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700">CV of the Applicant</label>
            <input type="file" @change="handleApplicantCVUpload" accept=".pdf" class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
            <span v-if="form.applicantCV" class="text-green-500">File Uploaded</span>
            <span v-else class="text-red-500">File Required</span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Declaration</label>
            <select v-model="form.declaration" class="mt-1 block w-full rounded-md border-gray-300">
              <option value="">Select</option>
              <option value="agree">Agree</option>
              <option value="not_agree">Not Agree</option>
            </select>
          </div>
        </div>

      <div class="flex justify-end space-x-4 mt-6">
        <button type="button" @click="saveAsDraft" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Save as Draft</button>
        <button type="submit" :disabled="form.declaration !== 'agree'" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
          Submit Application
        </button>
      </div>
    </form>
  </div>
</div>

   <!-- Collaborated ECPF Form -->
   <div v-if="currentTab === 'collaborated'" class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Collaborated ECPF Establishment</h2>
      <form @submit.prevent="submitForm">
        <!-- 1. ECPF in Collaboration Proposal Details -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-lg font-semibold mb-4">1. ECPF in Collaboration Proposal Details</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700">Existing ECPF Name</label>
            <input type="text" v-model="form.existingECPFName" disabled class="mt-1 block w-full rounded-md border-gray-300" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Existing License Number of ECPF</label>
            <input type="text" v-model="form.existingECPFLicenseNumber" disabled class="mt-1 block w-full rounded-md border-gray-300" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Proposed Name of ECPF</label>
            <input type="text" v-model="form.proposedECPFName" class="mt-1 block w-full rounded-md border-gray-300" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Proposed Location (if applicable)</label>
            <input type="text" v-model="form.proposedECPFLocationText" v-if="form.proposedECPFLocation === 'text'" class="mt-1 block w-full rounded-md border-gray-300" />
            <select v-model="form.proposedECPFLocation" v-else class="mt-1 block w-full rounded-md border-gray-300">
              <option value="auto">Auto (Same as Existing)</option>
              <option value="text">Specify Location</option>
            </select>

          </div>
        </div>

        <!-- 2. Details of External Party -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-lg font-semibold mb-4">2. Details of External Party</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700">Name of the Collaborating Firm</label>
            <input type="text" v-model="form.collaboratingFirmName" class="mt-1 block w-full rounded-md border-gray-300" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">External Party Based in (country)</label>
            <select v-model="form.externalPartyCountry" class="mt-1 block w-full rounded-md border-gray-300">
              <option value="">Select Country</option>
              <option v-for="country in countryOptions" :key="country" :value="country">{{ country }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">External Party Based in (State)</label>
            <input type="text" v-model="form.externalPartyState" class="mt-1 block w-full rounded-md border-gray-300" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Firm’s Registration Number</label>
            <input type="text" v-model="form.firmRegistrationNumber" class="mt-1 block w-full rounded-md border-gray-300" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Name of the Proprietor</label>
            <input type="text" v-model="form.proprietorName" class="mt-1 block w-full rounded-md border-gray-300" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Nationality</label>
            <input type="text" v-model="form.proprietorNationalityText" v-if="form.proprietorNationality === 'text'" class="mt-1 block w-full rounded-md border-gray-300" />
            <select v-model="form.proprietorNationality" v-else class="mt-1 block w-full rounded-md border-gray-300">
              <option value="text">Specify Nationality</option>
              <option v-for="nationality in nationalityOptions" :key="nationality" :value="nationality">{{ nationality }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Designation</label>
            <input type="text" v-model="form.proprietorDesignation" class="mt-1 block w-full rounded-md border-gray-300" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" v-model="form.proprietorEmail" class="mt-1 block w-full rounded-md border-gray-300" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Contact Number</label>
            <input type="number" v-model="form.proprietorContactNumber" class="mt-1 block w-full rounded-md border-gray-300" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Website</label>
            <input type="text" v-model="form.externalPartyWebsite" class="mt-1 block w-full rounded-md border-gray-300" />
          </div>
        </div>

        <!-- 3. Collaboration Details -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-lg font-semibold mb-4">3. Collaboration Details</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700">Collaboration Details</label>
            <textarea v-model="form.collaborationDetails" rows="4" placeholder="Explain the type of collaboration & other related details" class="mt-1 block w-full rounded-md border-gray-300"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Remarks</label>
            <input type="text" v-model="form.collaborationRemarks" class="mt-1 block w-full rounded-md border-gray-300" />
          </div>
        </div>

        <!-- 4. Supporting Documents -->
        <div class="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 class="text-lg font-semibold mb-4">4. Supporting Documents</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700">Concern/Authorization Letter</label>
            <input type="file" @change="handleConcernLetterUpload" accept=".pdf,.doc,.docx" class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
            <span v-if="form.concernLetter" class="text-green-500">File Uploaded</span>
            <span v-else class="text-red-500">File Required</span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Passport & CV of Proprietor of External Party</label>
            <input type="file" @change="handlePassportCVUpload" accept=".pdf,.doc,.docx" class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
            <span v-if="form.passportCV" class="text-green-500">File Uploaded</span>
            <span v-else class="text-red-500">File Required</span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">License/Registration of External Party</label>
            <input type="file" @change="handleLicenseUpload" accept=".pdf,.doc,.docx" class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
            <span v-if="form.licenseRegistration" class="text-green-500">File Uploaded</span>
            <span v-else class="text-red-500">File Required</span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Valid Signed MoU</label>
            <input type="file" @change="handleMouUpload" accept=".pdf,.doc,.docx" class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
            <span v-if="form.signedMou" class="text-green-500">File Uploaded</span>
            <span v-else class="text-red-500">File Required</span>
          </div>
        </div>

        <div class="flex justify-end space-x-4 mt-6">
          <button type="button" @click="saveAsDraftHandler" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Save as Draft</button>
          <button type="submit" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            Submit Application
          </button>
        </div>
      </form>
    </div>

  </template>


<script setup>
import { ref, reactive, onMounted } from 'vue';

const message = ref('');
const messageClass = ref('');

const tabs = ref([
  { id: 'individual', name: 'New ECPF Establishment' },
  { id: 'branch', name: 'Branch Application' },
  { id: 'collaborated', name: 'Collaborated ECPF' }
]);

const currentTab = ref('individual');

const form = reactive({
  //1. ECPF in Collaboration Proposal Details
  existingECPFName: 'Sunrise Consultancy', // Fetch from IBLS
  existingECPFLicenseNumber: 'ECPF-2023-123', // Fetch from IBLS
  proposedECPFName: 'Global Sunrise Consultancy',
  proposedECPFLocation: 'auto', // 'auto' or 'text'
  proposedECPFLocationText: '', // Only used if proposedECPFLocation is 'text'

  //2. Details of External Party
  collaboratingFirmName: 'International Experts Inc.',
  externalPartyCountry: 'USA',
  externalPartyState: 'California',
  firmRegistrationNumber: 'USA-EXP-5678',
  proprietorName: 'John Smith',
  proprietorNationality: 'text', // 'text' or dropdown selection
  proprietorNationalityText: 'American', // Only used if proprietorNationality is 'text'
  proprietorDesignation: 'CEO',
  proprietorEmail: 'john.smith@example.com',
  proprietorContactNumber: 15551234567,
  externalPartyWebsite: 'www.internationalexperts.com',

  //3. Collaboration Details
  collaborationDetails: 'Joint venture to provide specialized training services in renewable energy sector.',
  collaborationRemarks: 'Subject to final approval by regulatory authorities.',

  //4. Supporting Documents
  concernLetter: null,
  passportCV: null,
  licenseRegistration: null,
  signedMou: null,
});

// Options for dropdown menus
const countryOptions = ref(['USA', 'Canada', 'UK', 'India', 'Bhutan']);
const nationalityOptions = ref(['Bhutanese', 'American', 'Indian', 'Canadian']);

onMounted(() => {
  // Simulate fetching existing ECPF details from IBLS
  // In a real application, you would make an API call here

  // Setting dummy values for testing:
  form.existingECPFName = 'Sunrise Consultancy';
  form.existingECPFLicenseNumber = 'ECPF-2023-123';
});

const submitForm = () => {
  console.log('Submitting form:', form);

  // Simulate successful submission
  setTimeout(() => {
    message.value = 'Application submitted successfully!';
    messageClass.value = 'text-green-500';

    // Reset message after 3 seconds
    setTimeout(() => {
      message.value = '';
      messageClass.value = '';
    }, 3000);
  }, 1000); // Simulate API delay

  // Implement your actual submission logic here (API call)
};

const saveAsDraftHandler = () => {
  console.log('Saving as draft:', form);

  // Simulate successful save as draft
  setTimeout(() => {
    message.value = 'Application saved as draft!';
    messageClass.value = 'text-blue-500';

    // Reset message after 3 seconds
    setTimeout(() => {
      message.value = '';
      messageClass.value = '';
    }, 3000);
  }, 1000); // Simulate API delay


  // Implement your actual save as draft logic here (API call)
};

// File Upload Handlers
const handleConcernLetterUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.concernLetter = file;
    console.log('Concern Letter uploaded:', file.name);
  }
};

const handlePassportCVUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.passportCV = file;
    console.log('Passport & CV uploaded:', file.name);
  }
};

const handleLicenseUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.licenseRegistration = file;
    console.log('License uploaded:', file.name);
  }
};

const handleMouUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.signedMou = file;
    console.log('MoU uploaded:', file.name);
  }
};
</script>