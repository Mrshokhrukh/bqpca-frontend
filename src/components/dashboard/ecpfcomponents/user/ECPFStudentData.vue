<template>
    <div class="container">
      <h1>Student Bio Data</h1>
  
      <!-- Student Bio Data Form -->
      <div class="form-container">
        <h2>Student Information</h2>
  
        <h3>ECPF Details</h3>
        <div>
          <label for="ecpfName">ECPF Name:</label>
          <input type="text" id="ecpfName" :value="ecpfDetails.ecpfName" readonly />
        </div>
        <div>
          <label for="branchECPF">Branch ECPF:</label>
          <select id="branchECPF" v-model="studentForm.branchECPF">
            <option value="">(None)</option>
            <option v-for="branch in branchECPFList" :key="branch" :value="branch">{{ branch }}</option>
          </select>
        </div>
  
        <h3>Institute Details</h3>
        <div>
          <label for="institute">Institute/College/University:</label>
          <select id="institute" v-model="studentForm.institute" @change="fetchStateCityCountry">
            <option value="">Select Institute</option>
            <option v-for="inst in instituteList" :key="inst" :value="inst">{{ inst }}</option>
          </select>
        </div>
        <div>
          <label for="stateCity">State/City:</label>
          <input type="text" id="stateCity" v-model="studentForm.stateCity" readonly />
        </div>
        <div>
          <label for="country">Country:</label>
          <input type="text" id="country" v-model="studentForm.country" readonly />
        </div>
  
        <h3>Student Details</h3>
        <div>
          <label for="cidPassport">CID/Passport:</label>
          <input type="text" id="cidPassport" v-model="studentForm.cidPassport" @blur="searchCensusData" />
          <button @click="searchCensusData">Search</button>
          <span v-if="passportError" class="error-message">{{ passportError }}</span>
        </div>
        <div>
          <label for="fullName">FullName:</label>
          <input type="text" id="fullName" v-model="studentForm.fullName" />
        </div>
        <div>
          <label for="dateOfBirth">Date of Birth:</label>
          <input type="date" id="dateOfBirth" v-model="studentForm.dateOfBirth" readonly />
        </div>
        <div>
          <label for="gender">Gender:</label>
          <input type="text" id="gender" v-model="studentForm.gender" readonly />
        </div>
        <div>
          <label for="currentOccupation">Current Occupation:</label>
          <input type="text" id="currentOccupation" v-model="studentForm.currentOccupation" />
        </div>
        <div>
          <label for="emailAddress">Email Address:</label>
          <input type="email" id="emailAddress" v-model="studentForm.emailAddress" />
        </div>
        <div>
          <label for="courseName">Course (full name):</label>
          <input type="text" id="courseName" v-model="studentForm.courseName" />
        </div>
        <div>
          <label for="programmeLevel">Programme Level:</label>
          <input type="text" id="programmeLevel" v-model="studentForm.programmeLevel" />
        </div>
        <div>
          <label for="programmeType">Programme Type:</label>
          <select id="programmeType" v-model="studentForm.programmeType">
            <option value="TVET">TVET</option>
            <option value="Higher">Higher</option>
          </select>
        </div>
        <div>
          <label for="programmeDuration">Programme Duration (in Year):</label>
          <input type="number" id="programmeDuration" v-model.number="studentForm.programmeDuration" />
        </div>
        <div>
          <label for="courseStartDate">Course Start Date:</label>
          <input type="date" id="courseStartDate" v-model="studentForm.courseStartDate" />
        </div>
        <div>
          <label for="courseEndDate">Course End Date:</label>
          <input type="date" id="courseEndDate" v-model="studentForm.courseEndDate" />
        </div>
        <div>
          <label for="numberOfDependent">Number of dependent [if it is just the spouse include as one]:</label>
          <input type="number" id="numberOfDependent" v-model.number="studentForm.numberOfDependent" />
        </div>
        <div>
          <label for="contactOfGuardian">Contact of guardian [if minor only]:</label>
          <input type="number" id="contactOfGuardian" v-model.number="studentForm.contactOfGuardian" />
        </div>
        <div>
          <label for="emailOfGuardian">Email of Guardian:</label>
          <input type="email" id="emailOfGuardian" v-model="studentForm.emailOfGuardian" />
        </div>
        <div>
          <label for="ecpfLinkage">Name of ECPF with linkage (if processed through B2B):</label>
          <select id="ecpfLinkage" v-model="studentForm.ecpfLinkage">
            <option value="">(None)</option>
            <option v-for="ecpf in ecpfLinkageList" :key="ecpf" :value="ecpf">{{ ecpf }}</option>
          </select>
        </div>
        <button @click="saveStudent">Save</button>
        <!-- <button @click="editStudent">Edit</button>
        <button @click="deleteStudent">Delete</button>
        <button @click="viewStudent">View</button> -->
        <button @click="resetForm">Reset Form</button>
      </div>
  
      <div class="form-container">
        <h2>Student List</h2>
        <table v-if="students.length > 0">
          <thead>
            <tr>
              <th>Name</th>
              <th>CID/Passport</th>
              <th>Institute</th>
              <th>Course</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.cidPassport">
              <td>{{ student.fullName }}</td>
              <td>{{ student.cidPassport }}</td>
              <td>{{ student.institute }}</td>
              <td>{{ student.courseName }}</td>
              <td>
                <button @click="editStudentData(student)">Edit</button>
                <button @click="confirmDelete(student.cidPassport)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>No students added yet.</p>
      </div>
  
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  
      <!-- Confirmation Modal -->
      <div class="modal" v-if="showConfirmationModal">
        <div class="modal-content">
          <h2>Confirm Delete</h2>
          <p>Are you sure you want to delete this student?</p>
          <button @click="deleteStudentData(studentToDelete)">Yes</button>
          <button @click="cancelDelete">No</button>
        </div>
      </div>
      <div v-if="showConfirmationModal" class="modal-backdrop"></div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  
  export default {
    name: 'StudentBioData',
    setup() {
      // Dummy data (replace with real data from API/database)
      const ecpfDetails = ref({
        ecpfName: 'Example ECPF',
      });
      const branchECPFList = ref(['Branch A', 'Branch B', 'Branch C']);
      const instituteList = ref(['Institute X', 'Institute Y', 'Institute Z']);
      const ecpfLinkageList = ref(['ECPF 1', 'ECPF 2', 'ECPF 3']);
  
      const studentForm = ref({
        branchECPF: '',
        institute: '',
        stateCity: '',
        country: '',
        cidPassport: '',
        fullName: '',
        dateOfBirth: '',
        gender: '',
        currentOccupation: '',
        emailAddress: '',
        courseName: '',
        programmeLevel: '',
        programmeType: 'TVET',
        programmeDuration: null,
        courseStartDate: '',
        courseEndDate: '',
        numberOfDependent: null,
        contactOfGuardian: null,
        emailOfGuardian: '',
        ecpfLinkage: '',
      });
  
      const students = ref([
        {
          branchECPF: 'Branch A',
          institute: 'Institute X',
          stateCity: 'City X',
          country: 'Country X',
          cidPassport: '12345678901',
          fullName: 'Pem Tshering',
          dateOfBirth: '1990-01-01',
          gender: 'Male',
          currentOccupation: 'Student',
          emailAddress: 'pem@example.com',
          courseName: 'Computer Science',
          programmeLevel: 'Bachelor',
          programmeType: 'Higher',
          programmeDuration: 4,
          courseStartDate: '2023-09-01',
          courseEndDate: '2027-06-30',
          numberOfDependent: 0,
          contactOfGuardian: null,
          emailOfGuardian: '',
          ecpfLinkage: '',
        },
        {
          branchECPF: '',
          institute: 'Institute Y',
          stateCity: 'City Y',
          country: 'Country Y',
          cidPassport: '09876543210',
          fullName: 'Kinley Wangchuk',
          dateOfBirth: '1992-05-15',
          gender: 'Male',
          currentOccupation: 'Engineer',
          emailAddress: 'kinley@example.com',
          courseName: 'Electrical Engineering',
          programmeLevel: 'Bachelor',
          programmeType: 'Higher',
          programmeDuration: 4,
          courseStartDate: '2022-08-15',
          courseEndDate: '2026-05-31',
          numberOfDependent: 1,
          contactOfGuardian: null,
          emailOfGuardian: '',
          ecpfLinkage: 'ECPF 1',
        },
      ]);
  
      const passportError = ref('');
      const errorMessage = ref('');
      const showConfirmationModal = ref(false);
      const studentToDelete = ref(null);
  
      const fetchStateCityCountry = () => {
        // Dummy function to simulate fetching State/City/Country based on institute
        // Replace with a real API call
        switch (studentForm.value.institute) {
          case 'Institute X':
            studentForm.value.stateCity = 'City X';
            studentForm.value.country = 'Country X';
            break;
          case 'Institute Y':
            studentForm.value.stateCity = 'City Y';
            studentForm.value.country = 'Country Y';
            break;
          case 'Institute Z':
            studentForm.value.stateCity = 'City Z';
            studentForm.value.country = 'Country Z';
            break;
          default:
            studentForm.value.stateCity = '';
            studentForm.value.country = '';
        }
      };
  
      const searchCensusData = () => {
        // Simulate data from census (replace with real API call)
        if (studentForm.value.cidPassport === '12345678901') {
          studentForm.value.fullName = 'Pem Tshering';
          studentForm.value.dateOfBirth = '1990-01-01';
          studentForm.value.gender = 'Male';
          passportError.value = '';
        } else if (studentForm.value.cidPassport === '09876543210') {
          studentForm.value.fullName = 'Kinley Wangchuk';
          studentForm.value.dateOfBirth = '1992-05-15';
          studentForm.value.gender = 'Male';
          passportError.value = '';
        } else {
          studentForm.value.fullName = '';
          studentForm.value.dateOfBirth = '';
          studentForm.value.gender = '';
          passportError.value = 'No data found for the given CID/Passport.';
        }
      };
  
      const saveStudent = () => {
        // Validate if the form is empty
        if (
          !studentForm.value.cidPassport ||
          !studentForm.value.fullName ||
          !studentForm.value.institute
        ) {
          errorMessage.value = 'Please fill in the required fields (CID/Passport, Full Name, and Institute).';
          return;
        }
  
        students.value.push({ ...studentForm.value });
        resetForm();
        errorMessage.value = ''; // Clear any previous error message
      };
  
      const editStudent = () => {
        // Implement function
        console.log('Edit student');
      };
  
      const deleteStudent = () => {
        // Implement function
        console.log('Delete student');
      };
  
      const viewStudent = () => {
        // Implement function
        console.log('View student');
      };
  
      const resetForm = () => {
        studentForm.value = {
          branchECPF: '',
          institute: '',
          stateCity: '',
          country: '',
          cidPassport: '',
          fullName: '',
          dateOfBirth: '',
          gender: '',
          currentOccupation: '',
          emailAddress: '',
          courseName: '',
          programmeLevel: '',
          programmeType: 'TVET',
          programmeDuration: null,
          courseStartDate: '',
          courseEndDate: '',
          numberOfDependent: null,
          contactOfGuardian: null,
          emailOfGuardian: '',
          ecpfLinkage: '',
        };
      };
  
      const editStudentData = (student) => {
          studentForm.value = { ...student };
      };
  
      const confirmDelete = (cidPassport) => {
        showConfirmationModal.value = true;
        studentToDelete.value = cidPassport;
      };
  
      const deleteStudentData = (cidPassport) => {
          students.value = students.value.filter((student) => student.cidPassport !== cidPassport);
          showConfirmationModal.value = false;
          studentToDelete.value = null;
      };
  
      const cancelDelete = () => {
        showConfirmationModal.value = false;
        studentToDelete.value = null;
      };
  
      onMounted(() => {
        // Simulate fetching initial data, if needed
      });
  
      return {
        ecpfDetails,
        branchECPFList,
        instituteList,
        ecpfLinkageList,
        studentForm,
        students,
        passportError,
        errorMessage,
        showConfirmationModal,
        studentToDelete,
        fetchStateCityCountry,
        searchCensusData,
        saveStudent,
        editStudent,
        deleteStudent,
        viewStudent,
        resetForm,
        editStudentData,
        confirmDelete,
        deleteStudentData,
        cancelDelete,
      };
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .form-container {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="date"],
  input[type="number"],
  select {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
  
  button {
    background-color: #3271a5;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 5px;
  }
  
  button:hover {
    background-color: #46a2da;
  }
  
  .error-message {
    color: red;
    font-size: 0.9em;
    margin-top: -5px;
    display: block;
  }
  
  /* Modal Styles */
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    z-index: 1001;
  }
  
  .modal-content {
    text-align: center;
  }
  
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }
  </style>