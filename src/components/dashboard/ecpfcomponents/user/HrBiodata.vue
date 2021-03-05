<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">HR Bio Data</h1>
      <p class="text-gray-600">Please fill in the details below for HR Bio Data.</p>
    </div>

    <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <form @submit.prevent="submitForm" ref="hrForm">
        <section class="mb-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-4">HR Details</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="hr_ecpf_name" class="block text-sm font-medium text-gray-700">ECPF Name:</label>
              <input id="hr_ecpf_name" type="text" v-model="formData.ecpf_name"
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled>
            </div>
            <div>
              <label for="hr_branch_ecpf" class="block text-sm font-medium text-gray-700">Branch ECPF:</label>
              <select id="hr_branch_ecpf" v-model="formData.branch_ecpf"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="" disabled>Select Branch</option>
                <option v-for="branch in branches" :key="branch.id" :value="branch.id">{{ branch.name }}</option>
              </select>
            </div>
            <div>
              <label for="hr_position" class="block text-sm font-medium text-gray-700">Position:</label>
              <select id="hr_position" v-model="formData.position"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="" disabled>Select Position</option>
                <option v-for="position in positions" :key="position.id" :value="position.id">{{ position.name }}</option>
              </select>
            </div>
            <div>
              <label for="hr_cid" class="block text-sm font-medium text-gray-700">CID:</label>
              <input id="hr_cid" type="text" v-model="formData.cid" @blur="searchAndValidateCID"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <p v-if="cidValidationError" class="text-red-500 text-xs mt-1">{{ cidValidationError }}</p>
            </div>
            <div>
              <label for="hr_full_name" class="block text-sm font-medium text-gray-700">Full Name:</label>
              <input id="hr_full_name" type="text" v-model="formData.full_name"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="hr_date_of_birth" class="block text-sm font-medium text-gray-700">Date of Birth:</label>
              <input id="hr_date_of_birth" type="date" v-model="formData.date_of_birth"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="hr_qualification" class="block text-sm font-medium text-gray-700">Qualification:</label>
              <select id="hr_qualification" v-model="formData.qualification"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="" disabled>Select Qualification</option>
                <option v-for="qualification in qualifications" :key="qualification.id" :value="qualification.id">{{ qualification.name }}</option>
              </select>
            </div>
            <div>
              <label for="hr_contact_number" class="block text-sm font-medium text-gray-700">Contact Number:</label>
              <input id="hr_contact_number" type="number" v-model="formData.contact_number"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
              <label for="hr_email_address" class="block text-sm font-medium text-gray-700">Email Address:</label>
              <input id="hr_email_address" type="email" v-model="formData.email_address" @blur="validateEmail"
                class="mt-1 block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <p v-if="emailValidationError" class="text-red-500 text-xs mt-1">{{ emailValidationError }}</p>
            </div>
            <div>
                <label for="hr_cv_certificates" class="block text-sm font-medium text-gray-700">CV & Certificates (PDF only):</label>
                <input id="hr_cv_certificates" type="file" @change="handleFileUpload" accept=".pdf" class="mt-1 block w-full">
            </div>
          </div>
        </section>

        <div class="flex justify-end space-x-4">
          <button type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors duration-200">
            Submit
          </button>
        </div>
      </form>
    </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import apiServices from '@/services/services'; //  the correct path

// --- Form Data ---
const formData = ref({
  ecpf_name: '',
  branch_ecpf: null,
  position: null,
  cid: '',
  full_name: '',
  date_of_birth: '',
  qualification: null,
  contact_number: '',
  email_address: '',
  cv_certificates: null,
});

const emailValidationError = ref('');
const cidValidationError = ref('');

// --- Master Data ---
const branches = ref([]);
const positions = ref([]);
const qualifications = ref([]);

// --- Emits ---
const emit = defineEmits(['hr-data-submitted']); // Emit an event when data is submitted

// --- Functions ---
const fetchMasterData = async () => {
  try {
    //  your API calls here.  Example:
    // const branchResponse = await apiServices.getBranches();
    // branches.value = branchResponse.data;
    branches.value = [  // Placeholder
        { id: 'b1', name: 'Branch 1' },
        { id: 'b2', name: 'Branch 2' }
     ]
     positions.value = [  // Placeholder
        { id: 'p1', name: 'Counselor' },
        { id: 'p2', name: 'HR' }
    ];
    qualifications.value = [ // Placeholder
      { id: 'q1', name: 'Bachelor' },
      { id: 'q2', name: 'Master' }
     ];

  } catch (error) {
    console.error("Error fetching master data:", error);
    alert("Failed to load master data. Please refresh the page.");
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type === 'application/pdf') {
    formData.value.cv_certificates = file;
  } else {
    alert('Please select a PDF file.');
    event.target.value = ''; // Clear the input
    formData.value.cv_certificates = null;
  }
};

const submitForm = async () => {
  if (!validateForm()) return;

  try {
    const dataToSubmit = await prepareDataForSubmission();
    const response = await apiServices.submitHrData(dataToSubmit); //  API

    if (response.status === 201) {
      alert('HR data submitted successfully!');
      emit('hr-data-submitted'); // Emit the event
      resetForm();
    } else {
      alert('An error occurred while submitting HR data.');
      console.error("API Error:", response);
    }
  } catch (error) {
    alert('An unexpected error occurred.');
    console.error("HR Submission Error:", error);
  }
};

const prepareDataForSubmission = async () => {
  const data = { ...formData.value };

  if (data.cv_certificates) {
    data.cv_certificates = await toBase64(data.cv_certificates);
  }
  return data;
};

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const validateForm = () => {
  let isValid = true;
   if (!formData.value.ecpf_name) {
        alert("ECPF Name is required.");
        isValid = false;
    }
     if (!formData.value.position) {
        alert("Position is required.");
        isValid = false;
    }
    if (!formData.value.cid) {
        alert("CID is required.");
        isValid = false;
    }
     if (cidValidationError.value) {
        alert("CID is already being used by another ECPF firm."); // Or any other specific CID error
        isValid = false;
    }
    if (!formData.value.full_name) {
        alert("Full Name is required.");
        isValid = false;
    }
    if (!formData.value.date_of_birth) {
        alert("Date of Birth is required.");
        isValid = false;
    }
     if (!formData.value.qualification) {
        alert("Qualification is required.");
        isValid = false;
    }
    if (!formData.value.contact_number) {
        alert("Contact Number is required.");
        isValid = false;
    }
    if (!formData.value.email_address || emailValidationError.value) {
        alert('Please enter a valid Email Address.');
        isValid = false;
    }
   if (formData.value.position === 'Counselor' && !formData.value.cv_certificates) {
        alert('CV & Certificates are mandatory for Counselors.');
        isValid = false;
    }
  return isValid;
};

const resetForm = () => {
    formData.value = {
        ecpf_name: '',
        branch_ecpf: null,
        position: null,
        cid: '',
        full_name: '',
        date_of_birth: '',
        qualification: null,
        contact_number: '',
        email_address: '',
        cv_certificates: null,
    };
  emailValidationError.value = '';
  cidValidationError.value = '';
  // Reset file input
  const fileInput = document.getElementById('hr_cv_certificates');
  if (fileInput) {
    fileInput.value = '';
  }
};

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  emailValidationError.value = emailRegex.test(formData.value.email_address) ? '' : 'Invalid email format.';
};

const searchAndValidateCID = async () => {
  const cid = formData.value.cid;
  if (!cid) {
    cidValidationError.value = "CID is required";
    return;
  }

  try {
    // 1. Try to get user details
    const userDetails = await apiServices.getUserByCID(cid); //  API
    if (userDetails.data) {
      formData.value.full_name = userDetails.data.name;
      formData.value.date_of_birth = userDetails.data.dob; //  'YYYY-MM-DD' format
    }

    // 2. Check for duplicates
    const isDuplicate = await apiServices.isCidDuplicateWithinEcpf({
      cid: cid,
      ecpfId: formData.value.ecpf_name, //  ECPF ID
      formType: 'hr',
    });

    cidValidationError.value = isDuplicate ? "This CID is already registered with this ECPF." : "";

  } catch (error) {
    console.error("Error during CID search/validation:", error);
    cidValidationError.value = "Error validating CID.";
  }
};


onMounted(() => {
  fetchMasterData();
   //  ECPF name (replace with your actual logic)
  const loggedInEcpf = { id: 'ecpf123', name: 'Demo ECPF' };
  formData.value.ecpf_name = loggedInEcpf.name;
});

watch(() => formData.value.cid, (newCid) => {
    if (newCid) {
        searchAndValidateCID();
    }
});

</script>