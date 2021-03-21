<template>
  <div>
    <!-- Edit Draft Button -->
    <button v-if="formData.isDraft" @click="editDraft">Edit Draft</button>

    <!-- Submit Button -->
    <button @click="submitForm">Submit Application</button>

    <!-- Save as Draft Button -->
    <button @click="saveAsDraft">Save as Draft</button>

    <!-- Location dropdown -->
    <select v-model="formData.location">
      <option value="">Select Location</option>
      <option v-for="location in locations" :key="location.id" :value="location.id">
        {{ location.name }}
      </option>
    </select>

    <!-- Country dropdown for linkages -->
    <div v-for="(linkage, index) in formData.linkages" :key="index">
      <select v-model="linkage.country">
        <option value="">Select Country</option>
        <option v-for="country in countries" :key="country.code" :value="country.code">
          {{ country.name }}
        </option>
      </select>
      <button @click="removeLinkage(index)">Remove Linkage</button>
    </div>
    <button @click="addLinkage">Add Linkage</button>

  <!-- Gewog/Throm dropdown -->
    <select v-model="formData.gewog_throm">
      <option value="">Select Gewog/Throm</option>
      <option v-for="gewog in gewogThroms" :key="gewog.id" :value="gewog.id">
        {{ gewog.name }}
      </option>
    </select>

  <!-- Dzongkhag/Thromde dropdown -->
    <select v-model="formData.dzongkhag_thromde">
      <option value="">Select Dzongkhag/Thromde</option>
      <option v-for="dzongkhag in dzongkhagThromdes" :key="dzongkhag.id" :value="dzongkhag.id">
        {{ dzongkhag.name }}
      </option>
    </select>

    <!-- Service Categories dropdown -->
    <div v-for="(service, index) in formData.services" :key="index">
      <select v-model="service.category">
        <option value="">Select Service Category</option>
        <option v-for="category in serviceCategories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
      <button @click="removeService(index)">Remove Service</button>
    </div>
    <button @click="addService">Add Service</button>

    <!-- Fees -->
    <div v-for="(fee, index) in formData.fees" :key="index">
      <input v-model="fee.breakup" placeholder="Fee Breakup">
      <input v-model="fee.description" placeholder="Description">
      <input v-model="fee.amount" type="number" placeholder="Amount">
      <button @click="removeFee(index)">Remove Fee</button>
    </div>
    <button @click="addFee">Add Fee</button>

    <!-- Firm Type dropdown -->
    <select v-model="formData.firm_type">
      <option value="">Select Firm Type</option>
      <option v-for="type in firmTypes" :key="type.id" :value="type.id">
        {{ type.name }}
      </option>
  </select>

    <!-- Declaration Options -->
    <select v-model="formData.declaration">
      <option value="">Select Declaration</option>
      <option v-for="option in declarationOptions" :key="option.id" :value="option.id">
        {{ option.name }}
      </option>
    </select>

    <!-- File Upload Inputs -->
    <div>
      <input type="file" @change="(e) => handleFileUpload(e, 'cv')" accept=".pdf,.doc,.docx">
      <input type="file" @change="(e) => handleFileUpload(e, 'cid_copy')" accept=".pdf,.jpg,.jpeg,.png">
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
// Add declaration options
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
        let response;

        if (formData.value.draftId) {
            // If draftId exists, it's an update (even on submit, assuming drafts can be further edited before final submission)
            response = await apiServices.updateEcpfProfile(formData.value.draftId, dataToSubmit);
        } else {
            // If no draftId, it's a new submission
            response = await apiServices.createEcpfProfile(dataToSubmit);
        }


        if (response.status === 200 || response.status === 201) { // Check for both success codes (201 for create, 200 for update)
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
      // Update existing draft using PATCH as it's a draft and might be partial
      response = await apiServices.patchEcpfProfile(formData.value.draftId, dataToSubmit);
    } else {
      // Save new draft using POST
      response = await apiServices.createEcpfProfile(dataToSubmit);
    }

    if (response.status === 200 || response.status === 201) { // Check for both success codes
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
        const response = await apiServices.getEcpfProfile(draftId); // You need to implement this in services.js
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