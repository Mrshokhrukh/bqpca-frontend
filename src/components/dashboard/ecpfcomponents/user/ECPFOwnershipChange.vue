<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-5xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div class="bg-blue-600 px-6 py-4">
        <h1 class="text-xl font-bold text-white">Change in Ownership of ECPF</h1>
      </div>

      <form @submit.prevent="submitForm" class="p-6 space-y-8">
        <!-- Current ECPF Details -->
        <section>
          <h2 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Current ECPF Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ECPF License No.</label>
              <input type="text" v-model="formData.currentEcpf.licenseNo" disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name of the ECPF</label>
              <input type="text" v-model="formData.currentEcpf.name" disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Proprietor of the ECPF</label>
              <input type="text" v-model="formData.currentEcpf.proprietor" disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Location of ECPF</label>
              <input type="text" v-model="formData.currentEcpf.location" disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100" />
            </div>
          </div>
        </section>

        <!-- Personal Information (New Applicants) -->
        <section>
          <h2 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Personal Information (New Applicants)</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">CID No.</label>
              <div class="flex">
                <input type="text" v-model="formData.personalInfo.cidNo"
                  class="w-full px-3 py-2 border border-gray-300 rounded-l-md text-gray-700"
                  placeholder="Enter CID Number" />
                <button type="button" @click="searchByCID"
                  class="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700">
                  Search
                </button>
              </div>
              <p class="text-xs text-gray-500 mt-1">Search using CID, manual entry supported if API not available</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Applicant's Name</label>
              <input type="text" v-model="formData.personalInfo.name" disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <input type="text" v-model="formData.personalInfo.gender" disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input type="text" v-model="formData.personalInfo.dob" disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100"
                placeholder="dd/mm/yyyy" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contact No.</label>
              <input type="text" v-model="formData.personalInfo.contactNo" disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" v-model="formData.personalInfo.email" disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100" />
            </div>
          </div>
        </section>

        <!-- Residential/Present Address -->
        <section>
          <h2 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Residential/Present Address</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Office Number</label>
              <input type="text" v-model="formData.residentialAddress.officeNumber" disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Flat No.</label>
              <input type="text" v-model="formData.residentialAddress.flatNo" disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Building No.</label>
              <input type="text" v-model="formData.residentialAddress.buildingNo" disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" v-model="formData.residentialAddress.location" disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100" />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from source)</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Gewog/Throm</label>
              <input type="text" v-model="formData.residentialAddress.gewogThrom" disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100" />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from source)</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Dzongkhag/Thromde</label>
              <input type="text" v-model="formData.residentialAddress.dzongkhagThromde" disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100" />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from source)</p>
            </div>
          </div>
        </section>

        <!-- Permanent Address -->
        <section>
          <h2 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Permanent Address</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Village/Chiwog</label>
              <input type="text" v-model="formData.permanentAddress.villageChiwog" disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100" />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from source)</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Gewog</label>
              <input type="text" v-model="formData.permanentAddress.gewog" disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100" />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from source)</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Dungkhag</label>
              <input type="text" v-model="formData.permanentAddress.dungkhag" disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100" />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from source, if available)</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Dzongkhag/Thromde</label>
              <input type="text" v-model="formData.permanentAddress.dzongkhagThromde" disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100" />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from source)</p>
            </div>
          </div>
        </section>

        <!-- Education Details -->
        <section>
          <h2 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Education Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2 flex items-center space-x-4">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">Search by RUB API</label>
                <div class="flex">
                  <input type="text" v-model="rubApiQuery"
                    class="w-full px-3 py-2 border border-gray-300 rounded-l-md text-gray-700"
                    placeholder="Enter search criteria" />
                  <button type="button" @click="searchRUB"
                    class="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700">
                    Search
                  </button>
                </div>
              </div>
              <div class="mt-6">
                <label class="inline-flex items-center">
                  <input type="checkbox" v-model="allowManualEntry" class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                  <span class="ml-2 text-sm text-gray-600">Allow manual entry</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Course/Qualification</label>
              <input type="text" v-model="formData.education.course"
                :disabled="!allowManualEntry"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
                :class="{ 'bg-gray-100': !allowManualEntry }" />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from RUB if API is selected, manual entry supported if API not available)</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name of Institute</label>
              <input type="text" v-model="formData.education.institute"
                :disabled="!allowManualEntry"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
                :class="{ 'bg-gray-100': !allowManualEntry }" />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from RUB if API is selected, manual entry supported if API not available)</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name of University</label>
              <input type="text" v-model="formData.education.university"
                :disabled="!allowManualEntry"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
                :class="{ 'bg-gray-100': !allowManualEntry }" />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from RUB if API is selected, manual entry supported if API not available)</p>
            </div>
          </div>
        </section>

        <!-- Proposal for Change in Ownership of ECPF Details -->
        <section>
          <h2 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Proposal for Change in Ownership of ECPF Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name of the Proposed Firm</label>
              <input type="text" v-model="formData.proposal.firmName"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Address of the Proposed Firm</label>
              <input type="text" v-model="formData.proposal.firmAddress"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Location of the Proposed Firm</label>
              <input type="text" v-model="formData.proposal.firmLocation" disabled
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100" />
              <p class="text-xs text-gray-500 mt-1">Auto (Pull from source)</p>
            </div>
          </div>
        </section>

        <!-- Institute/Colleges/University Linkages -->
        <section>
          <h2 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Institute/Colleges/University Linkages</h2>

          <div v-for="(linkage, index) in formData.linkages" :key="index" class="p-4 border border-gray-200 rounded-md mb-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name of Colleges/University/institute</label>
                <input type="text" v-model="linkage.name"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700" />
                <p class="text-xs text-gray-500 mt-1">Auto (Provision to edit)</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" v-model="linkage.location"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700" />
                <p class="text-xs text-gray-500 mt-1">Auto (Provision to edit)</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input type="text" v-model="linkage.country"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700" />
                <p class="text-xs text-gray-500 mt-1">Auto (Provision to edit)</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Recognition/Accreditation</label>
                <div class="flex items-center space-x-2">
                  <input type="text" v-model="linkage.recognition" disabled
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100" />
                  <label class="cursor-pointer px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <input type="file" @change="handleRecognitionUpload($event, index)" class="hidden" />
                    <span>Upload</span>
                  </label>
                </div>
                <p class="text-xs text-gray-500 mt-1">Auto (File upload, Provision to edit)</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Approval from University</label>
                <div class="flex items-center space-x-2">
                  <input type="text" v-model="linkage.approval" disabled
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100" />
                  <label class="cursor-pointer px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    <input type="file" @change="handleApprovalUpload($event, index)" class="hidden" />
                    <span>Upload</span>
                  </label>
                </div>
                <p class="text-xs text-gray-500 mt-1">Auto (File upload, Provision to edit)</p>
              </div>
            </div>

            <div class="mt-4 flex justify-end">
              <button type="button" @click="removeLinkage(index)"
                class="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Remove
              </button>
            </div>
          </div>

          <div class="mt-4">
            <button type="button" @click="addLinkage"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Add More Linkages
            </button>
          </div>
        </section>

        <!-- Supporting Documents -->
        <section>
          <h2 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Supporting Documents</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">CV of the Applicant</label>
              <div class="flex items-center space-x-2">
                <input type="text" v-model="formData.documents.cvApplicant" disabled
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100" />
                <label class="cursor-pointer px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  <input type="file" @change="handleCvApplicantUpload" class="hidden" />
                  <span>Upload</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">CV & Certificate of Counsellors</label>
              <div class="flex items-center space-x-2">
                <input type="text" v-model="formData.documents.cvCounsellors" disabled
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100" />
                <label class="cursor-pointer px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  <input type="file" @change="handleCvCounsellorsUpload" class="hidden" />
                  <span>Upload</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">CID of Guarantor</label>
              <div class="flex items-center space-x-2">
                <input type="text" v-model="formData.documents.cidGuarantor" disabled
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100" />
                <label class="cursor-pointer px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  <input type="file" @change="handleCidGuarantorUpload" class="hidden" />
                  <span>Upload</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Proposal Details</label>
              <div class="flex items-center space-x-2">
                <input type="text" v-model="formData.documents.proposalDetails" disabled
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-gray-100" />
                <label class="cursor-pointer px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  <input type="file" @change="handleProposalDetailsUpload" class="hidden" />
                  <span>Upload</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Declaration</label>
              <select v-model="formData.documents.declaration" class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700">
                <option value="" disabled>Select a Declaration</option>
                <option v-for="declaration in declarations" :key="declaration.id" :value="declaration.text">
                  {{ declaration.title }}
                </option>
              </select>
                <p class="text-xs text-gray-500 mt-1">Auto (Pull from master)</p>
            </div>
          </div>
        </section>

        <!-- Submit Section -->
          <div class="flex justify-end space-x-4 pt-4">
          <button type="button" @click="resetForm"
            class="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
            Cancel
          </button>
          <button type="submit"
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import apiService from '@/services/services'; // Corrected import path

const toast = useToast();

// --- Data ---
const rubApiQuery = ref('');
const allowManualEntry = ref(false);
const declarations = ref([]); // For declarations dropdown

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
  linkages: [
    // Start with one empty linkage
    { name: '', location: '', country: '', recognition: null, approval: null },
  ],
  documents: {
    cvApplicant: null,
    cvCounsellors: null,
    cidGuarantor: null,
    proposalDetails: null,
    declaration: '', // Now for selecting a declaration
  },
});

// --- Methods ---

const searchByCID = async () => {
  // Replace this with your actual API call
  try {
    // Example API call (replace with your actual endpoint):
    // const response = await fetch(`/api/cid-search?cid=${formData.personalInfo.cidNo}`);
    // const data = await response.json();

    // Simulate a successful API call. Replace with real data.
    const data = {
      name: 'Test Name',
      gender: 'Male',
      dob: '01/01/1990',
      contactNo: '123-456-7890',
      email: 'test@example.com',
      residentialAddress: {
        officeNumber: '123',
        flatNo: 'A1',
        buildingNo: '456',
        location: 'Thimphu',
        gewogThrom: 'Thimphu Throm',
        dzongkhagThromde: 'Thimphu',
      },
      permanentAddress: {
        villageChiwog: 'Some Village',
        gewog: 'Some Gewog',
        dungkhag: 'Some Dungkhag',
        dzongkhagThromde: 'Some Dzongkhag',
      }
    };

    if (data) {
      // Update form data with fetched information
      Object.assign(formData.personalInfo, {
        name: data.name,
        gender: data.gender,
        dob: data.dob,
        contactNo: data.contactNo,
        email: data.email,
      });

      //present address
      if (data.residentialAddress) {
        Object.assign(formData.residentialAddress, data.residentialAddress);
      }

      //Permanent address
      if (data.permanentAddress) {
        Object.assign(formData.permanentAddress, data.permanentAddress);
      }

    } else {
      toast.error("CID not found.");
    }
  } catch (error) {
    console.error("Error searching by CID:", error);
    toast.error("An error occurred while searching by CID.");
  }
};

const searchRUB = async () => {
  try {
    //  Replace with your actual API call to RUB
    //  For example:
    // const response = await fetch(`/api/rub?query=${rubApiQuery.value}`);
    // const data = await response.json();

    // Simulate a successful call.  Replace with real data.
    const data = {
      course: 'BSc Computer Science',
      institute: 'Royal University of Bhutan',
      university: 'RUB'
    };

    if (data) {
      formData.education.course = data.course;
      formData.education.institute = data.institute;
      formData.education.university = data.university;
      allowManualEntry.value = false; // Disable manual after successful search
    } else {
      toast.error("No results found from RUB API.");
      allowManualEntry.value = true; // Enable manual entry if no results
    }

  } catch (error) {
    console.error("Error searching RUB API:", error);
    toast.error("Error searching RUB API");
    allowManualEntry.value = true;  // Enable manual entry on error
  }
};


const addLinkage = () => {
  formData.linkages.push({ name: '', location: '', country: '', recognition: null, approval: null });
};

const removeLinkage = (index) => {
  formData.linkages.splice(index, 1);
};

const handleRecognitionUpload = (event, index) => {
  const file = event.target.files[0];
  if (file) {
    formData.linkages[index].recognition = file.name; // Store the filename
    //  Upload the file to your server here, get a URL/path, and store it.
  } else {
    formData.linkages[index].recognition = null;
  }
};

const handleApprovalUpload = (event, index) => {
  const file = event.target.files[0];
  if (file) {
    formData.linkages[index].approval = file.name;
    // Upload file and store URL/path.
  } else {
    formData.linkages[index].approval = null;
  }
};

const handleCvApplicantUpload = (event) => {
  handleFileUpload(event, 'cvApplicant');
};

const handleCvCounsellorsUpload = (event) => {
  handleFileUpload(event, 'cvCounsellors');
};

const handleCidGuarantorUpload = (event) => {
  handleFileUpload(event, 'cidGuarantor');
};

const handleProposalDetailsUpload = (event) => {
  handleFileUpload(event, 'proposalDetails');
};


const handleFileUpload = (event, field) => {
  const file = event.target.files[0];
  if (file) {
    formData.documents[field] = file.name;  // Store file name. Implement file upload!
    //  Upload the file and store the returned URL/path.
  } else {
    formData.documents[field] = null; // Clear if no file selected
  }
};

const submitForm = () => {
  // Perform validation
  if (!formData.personalInfo.cidNo) {
    toast.error("CID is required.");
    return;
  }

  if (!formData.documents.declaration) {
    toast.error("Declaration is required");
    return;
  }

  // Clean up linkages array: remove null values before submit
  const cleanedLinkages = formData.linkages.map(linkage => {
    const cleanLinkage = { ...linkage };
    if (cleanLinkage.recognition === null) delete cleanLinkage.recognition;
    if (cleanLinkage.approval === null) delete cleanLinkage.approval;
    return cleanLinkage;
  });

  const submitData = {
    ...formData,
    linkages: cleanedLinkages  // Use the cleaned linkages
  };

  // Clean up supporting docs
  for (let key in submitData.documents) {
    if (submitData.documents[key] === null) {
      delete submitData.documents[key];
    }
  }

  console.log("Submitting data:", submitData);
  toast.success("Form submitted successfully!"); // Show a success toast

  //  Send data to your backend API (replace with your actual API call).
  // Example using axios:
  // try {
  //   const response = await axios.post('/api/submit-form', submitData);
  //   console.log("Form submitted successfully!", response.data);
  //   // Handle success (e.g., redirect, show message)
  // } catch (error) {
  //   console.error("Error submitting form:", error);
  //   // Handle error (e.g., show error message)
  // }
};

const resetForm = () => {
  // Reset form data to initial values
  Object.keys(formData).forEach(key => {
    if (Array.isArray(formData[key])) {
      formData[key] = [{ name: '', location: '', country: '', recognition: null, approval: null }]; // Reset linkages
    } else if (typeof formData[key] === 'object') {
      if (key === 'documents') {
        formData[key] = {  // Default for docs
          cvApplicant: null,
          cvCounsellors: null,
          cidGuarantor: null,
          proposalDetails: null,
          declaration: '', // Reset to empty string
        };
      } else {
        Object.keys(formData[key]).forEach(subKey => {
          formData[key][subKey] = '';
        });
      }
    } else {
      formData[key] = '';
    }
  });
  rubApiQuery.value = '';
  allowManualEntry.value = false;
  toast.info("Form reset."); // Show an info toast
};

// --- Lifecycle Hooks ---
onMounted(async () => {
    try {
        const response = await apiService.getDeclarations(); // Assuming you have a getDeclarations method
        declarations.value = response.data;  // Adjust based on your API response structure
     } catch (error) {
        console.error("Error fetching declarations:", error);
        toast.error("Failed to load declarations.");
    }
});

</script>
