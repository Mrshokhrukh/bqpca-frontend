<template>
  <div class="w-full">
    <h1>Application Form</h1>

    <!-- Event Type Selection -->
    <div>
      <label for="eventType">Event Type:</label>
      <select id="eventType" v-model="eventType">
        <option value="fair">Participation in Education Fair</option>
        <option value="inHouse">Promotional Event - In-House</option>
        <option value="massMedia">Promotional Event - Mass Media</option>
        <option value="heiVisit">Promotional Event - HEI Representative Visit</option>
      </select>
    </div>

    <!-- Education Fair Form -->
    <div v-if="eventType === 'fair'" class="form-container">
      <h2>Participation in Education Fair</h2>

      <h3>Current ECPF Details</h3>
      <div v-for="(value, key) in ecpfDetails" :key="key">
        <label>{{ key }}:</label>
        <input type="text" :value="value" readonly />
      </div>

      <h3>Proposed Fair Details</h3>
      <div>
        <label for="fairName">Fair Name:</label>
        <input type="text" id="fairName" v-model="formData.fair.fairName" required />
      </div>
      <div>
        <label for="fairDescription">Fair Description:</label>
        <textarea id="fairDescription" v-model="formData.fair.fairDescription" rows="3" required></textarea>
      </div>
      <div>
        <label for="fairLocation">Fair Location:</label>
        <input type="text" id="fairLocation" v-model="formData.fair.fairLocation" required />
      </div>

      <h3>Representative Details (Maximum 2)</h3>
      <div v-for="(rep, index) in formData.fair.representatives" :key="index">
        <h4>Representative {{ index + 1 }}</h4>
        <div>
          <label for="repName">Name:</label>
          <input type="text" id="repName" v-model="rep.name" required />
        </div>
        <div>
          <label for="repPassport">Passport No:</label>
          <input type="text" id="repPassport" v-model="rep.passportNo" required />
        </div>
        <div>
          <label for="repNationality">Nationality:</label>
          <select id="repNationality" v-model="rep.nationality" required>
            <option value="Bhutanese">Bhutanese</option>
            <option value="Indian">Indian</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label for="repArrivalDate">Arrival Date:</label>
          <input type="date" id="repArrivalDate" v-model="rep.arrivalDate" required />
        </div>
        <div>
          <label for="repDepartureDate">Departure Date:</label>
          <input type="date" id="repDepartureDate" v-model="rep.departureDate" required />
        </div>
        <div>
          <label for="repCV">CV of Representative:</label>
          <input type="file" id="repCV" @change="handleFairFileChange(index, 'cv', $event)" />
          <span v-if="rep.cvFile && rep.cvFile.name">Selected: {{ rep.cvFile.name }}</span>
        </div>
        <button @click.prevent="removeFairRepresentative(index)">Remove Representative</button>
      </div>
      <button v-if="formData.fair.representatives.length < 2" @click="addFairRepresentative">
        Add Representative
      </button>

      <h3>Participating Institute Details</h3>
      <div v-for="(institute, index) in formData.fair.institutes" :key="index">
        <h4>Institute {{ index + 1 }}</h4>
        <div>
          <label for="instituteName">Name of the Institution:</label>
          <select id="instituteName" v-model="institute.name" required>
            <option v-for="inst in availableInstitutes" :key="inst" :value="inst">
              {{ inst }}
            </option>
          </select>
        </div>
        <div>
          <label for="instituteLocation">Location:</label>
          <input type="text" id="instituteLocation" v-model="institute.location" readonly />
        </div>
        <div>
          <label for="instituteZoneState">Zone/State:</label>
          <input type="text" id="instituteZoneState" v-model="institute.zoneState" readonly />
        </div>
        <div>
          <label for="instituteCountry">Country:</label>
          <input type="text" id="instituteCountry" v-model="institute.country" readonly />
        </div>
        <div>
          <label for="instituteWebsite">Institute Website:</label>
          <input type="text" id="instituteWebsite" v-model="institute.website" />
        </div>
        <div>
          <label for="instituteContact">Contact (focal person):</label>
          <input type="text" id="instituteContact" v-model="institute.contact" />
        </div>
        <div>
          <label for="instituteAffiliatedTo">College Affiliated to:</label>
          <input type="text" id="instituteAffiliatedTo" v-model="institute.affiliatedTo" />
        </div>
        <div>
          <label for="instituteType">Type of University:</label>
          <select id="instituteType" v-model="institute.type">
            <option value="Public">Public</option>
            <option value="Private">Private</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label for="instituteRecognitionCode">Recognition Code (if any):</label>
          <input type="text" id="instituteRecognitionCode" v-model="institute.recognitionCode" />
        </div>

        <h4>Course Offered Details</h4>
        <div v-for="(course, cIndex) in institute.courses" :key="cIndex">
          <div>
            <label for="courseName">Course Name:</label>
            <input type="text" id="courseName" v-model="course.name" required />
          </div>
          <div>
            <label for="courseAccreditedBy">Accredited By:</label>
            <input type="text" id="courseAccreditedBy" v-model="course.accreditedBy" readonly />
          </div>
          <div>
            <label for="authorizationLetter">Authorization Letter:</label>
            <input type="file" id="authorizationLetter"
              @change="handleFairFileChange(index, 'authLetter', $event, cIndex)" />
            <span v-if="course.authLetterFile && course.authLetterFile.name">Selected: {{ course.authLetterFile.name
              }}</span>
          </div>
          <button @click.prevent="removeFairCourse(index, cIndex)">Remove Course</button>
        </div>
        <button @click.prevent="addFairCourse(index)">Add Course</button>
        <button @click.prevent="removeFairInstitute(index)">Remove Institute</button>
      </div>
      <button @click="addFairInstitute">Add Institute</button>

      <div>
        <label for="remarks">Remarks:</label>
        <textarea id="remarks" v-model="formData.fair.remarks" rows="3"></textarea>
      </div>
    </div>

    <!-- In-House Event Form -->
    <div v-if="eventType === 'inHouse'" class="form-container">
      <h2>Promotional Event - In-House</h2>

      <h3>Current ECPF Details</h3>
      <div v-for="(value, key) in ecpfDetails" :key="key">
        <label>{{ key }}:</label>
        <input type="text" :value="value" readonly />
      </div>

      <div>
        <label for="eventTypeInHouse">Promotional Event Type:</label>
        <select id="eventTypeInHouse" v-model="formData.inHouse.promotionalEventType" required>
          <option value="Seminar">Seminar</option>
          <option value="Workshop">Workshop</option>
          <option value="Exhibition">Exhibition</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label for="instituteInHouse">Institute:</label>
        <select id="instituteInHouse" v-model="formData.inHouse.institute" required>
          <option v-for="inst in availableInstitutes" :key="inst" :value="inst">
            {{ inst }}
          </option>
        </select>
      </div>

      <h3>Proposed In-House Event Details</h3>
      <div>
        <label for="eventNameInHouse">Event Name:</label>
        <input type="text" id="eventNameInHouse" v-model="formData.inHouse.eventName" required />
      </div>
      <div>
        <label for="eventDescriptionInHouse">Event Description:</label>
        <textarea id="eventDescriptionInHouse" v-model="formData.inHouse.eventDescription" rows="3" required></textarea>
      </div>
      <div>
        <label for="eventPurposeInHouse">Event Purpose:</label>
        <textarea id="eventPurposeInHouse" v-model="formData.inHouse.eventPurpose" rows="3" required></textarea>
      </div>
      <div>
        <label for="eventLocationInHouse">Event Location:</label>
        <input type="text" id="eventLocationInHouse" v-model="formData.inHouse.eventLocation" required />
      </div>

      <h3>Representative Details (Maximum 2)</h3>
      <div v-for="(rep, index) in formData.inHouse.representatives" :key="index">
        <h4>Representative {{ index + 1 }}</h4>
        <div>
          <label for="repNameInHouse">Name:</label>
          <input type="text" id="repNameInHouse" v-model="rep.name" required />
        </div>
        <div>
          <label for="repPassportInHouse">Passport No:</label>
          <input type="text" id="repPassportInHouse" v-model="rep.passportNo" required />
        </div>
        <div>
          <label for="repNationalityInHouse">Nationality:</label>
          <select id="repNationalityInHouse" v-model="rep.nationality" required>
            <option value="Bhutanese">Bhutanese</option>
            <option value="Indian">Indian</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label for="repArrivalDateInHouse">Arrival Date:</label>
          <input type="date" id="repArrivalDateInHouse" v-model="rep.arrivalDate" required />
        </div>
        <div>
          <label for="repDepartureDateInHouse">Departure Date:</label>
          <input type="date" id="repDepartureDateInHouse" v-model="rep.departureDate" required />
        </div>
        <div>
          <label for="repCVInHouse">CV of Representative:</label>
          <input type="file" id="repCVInHouse" @change="handleInHouseFileChange(index, 'cv', $event)" />
          <span v-if="rep.cvFile && rep.cvFile.name">Selected: {{ rep.cvFile.name }}</span>
        </div>
        <div>
          <label for="repAffiliationLetterInHouse">Passport copy or Identification Document:</label>
          <input type="file" id="repAffiliationLetterInHouse"
            @change="handleInHouseFileChange(index, 'affiliation', $event)" />
          <span v-if="rep.affiliationFile && rep.affiliationFile.name">Selected: {{ rep.affiliationFile.name }}</span>
        </div>
        <div>
          <label for="repAuthorizationLetterInHouse">Authorization Letter:</label>
          <input type="file" id="repAuthorizationLetterInHouse"
            @change="handleInHouseFileChange(index, 'authorization', $event)" />
          <span v-if="rep.authorizationFile && rep.authorizationFile.name">Selected: {{ rep.authorizationFile.name
            }}</span>
        </div>
        <button @click.prevent="removeInHouseRepresentative(index)">Remove Representative</button>
      </div>
      <button v-if="formData.inHouse.representatives.length < 2" @click="addInHouseRepresentative">
        Add Representative
      </button>

      <div>
        <label for="remarksInHouse">Remarks:</label>
        <textarea id="remarksInHouse" v-model="formData.inHouse.remarks" rows="3"></textarea>
      </div>
    </div>

    <!-- Mass Media Event Form -->
    <div v-if="eventType === 'massMedia'" class="form-container">
      <h2>Promotional Event - Mass Media</h2>

      <h3>Current ECPF Details</h3>
      <div v-for="(value, key) in ecpfDetails" :key="key">
        <label>{{ key }}:</label>
        <input type="text" :value="value" readonly />
      </div>

      <div>
        <label for="eventTypeMassMedia">Promotional Event Type:</label>
        <select id="eventTypeMassMedia" v-model="formData.massMedia.promotionalEventType" required>
          <option value="Radio">Radio</option>
          <option value="TV">TV</option>
          <option value="Newspaper">Newspaper</option>
          <option value="Social Media">Social Media</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label for="institutesMassMedia">Institutes:</label>
        <select id="institutesMassMedia" v-model="formData.massMedia.institutes" multiple required>
          <option v-for="inst in availableInstitutes" :key="inst" :value="inst">
            {{ inst }}
          </option>
        </select>
      </div>

      <h3>Proposed Promotion Event - Mass Media</h3>
      <div>
        <label for="promotionNameMassMedia">Mass Media Promotional Name:</label>
        <input type="text" id="promotionNameMassMedia" v-model="formData.massMedia.massMediaPromotionalName" required />
      </div>
      <div>
        <label for="descriptionMassMedia">Description:</label>
        <textarea id="descriptionMassMedia" v-model="formData.massMedia.description" rows="3" required></textarea>
      </div>
      <div>
        <label for="purposeMassMedia">Purpose:</label>
        <textarea id="purposeMassMedia" v-model="formData.massMedia.purpose" rows="3" required></textarea>
      </div>
      <div>
        <label for="promotionalChannelMassMedia">Promotional Channel:</label>
        <input type="text" id="promotionalChannelMassMedia" v-model="formData.massMedia.promotionalChannel" required />
      </div>
      <div>
        <label for="promotionalContentsMassMedia">Promotional Contents:</label>
        <input type="file" id="promotionalContentsMassMedia" @change="handleMassMediaFileChange" />
        <span v-if="
            formData.massMedia.promotionalContentsFile &&
            formData.massMedia.promotionalContentsFile.name
          ">Selected: {{ formData.massMedia.promotionalContentsFile.name }}</span>
      </div>
      <div>
        <label for="othersMassMedia">Others (specify):</label>
        <input type="text" id="othersMassMedia" v-model="formData.massMedia.others" />
      </div>

      <div>
        <label for="remarksMassMedia">Remarks:</label>
        <textarea id="remarksMassMedia" v-model="formData.massMedia.remarks" rows="3"></textarea>
      </div>
    </div>

    <!-- HEI Visit Form -->
    <div v-if="eventType === 'heiVisit'" class="form-container">
      <h2>Promotional Event - HEI Representative Visit</h2>

      <h3>Current ECPF Details</h3>
      <div v-for="(value, key) in ecpfDetails" :key="key">
        <label>{{ key }}:</label>
        <input type="text" :value="value" readonly />
      </div>

      <div>
        <label for="eventTypeHeiVisit">Promotional Event Type:</label>
        <select id="eventTypeHeiVisit" v-model="formData.heiVisit.promotionalEventType" required>
          <!-- The dropdown options will come from the master data. This is just a placeholder -->
          <option value="Visit">HEI Visit</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label for="institutesHeiVisit">Institutes:</label>
        <select id="institutesHeiVisit" v-model="formData.heiVisit.institutes" multiple required>
          <option v-for="inst in availableInstitutes" :key="inst" :value="inst">
            {{ inst }}
          </option>
        </select>
      </div>

      <h3>Proposed Promotion Event - HEI Representative Visit</h3>
      <div>
        <label for="programmeDetailHeiVisit">Programme Detail (visit detail):</label>
        <input type="text" id="programmeDetailHeiVisit" v-model="formData.heiVisit.programmeDetail" required />
      </div>
      <div>
        <label for="descriptionHeiVisit">Description:</label>
        <textarea id="descriptionHeiVisit" v-model="formData.heiVisit.description" rows="3" required></textarea>
      </div>
      <div>
        <label for="purposeHeiVisit">Purpose:</label>
        <textarea id="purposeHeiVisit" v-model="formData.heiVisit.purpose" rows="3" required></textarea>
      </div>
      <div>
        <label for="fromDateHeiVisit">From Date:</label>
        <input type="date" id="fromDateHeiVisit" v-model="formData.heiVisit.fromDate" required />
      </div>
      <div>
        <label for="toDateHeiVisit">To Date:</label>
        <input type="date" id="toDateHeiVisit" v-model="formData.heiVisit.toDate" required />
      </div>
      <div>
        <label for="othersHeiVisit">Others (specify):</label>
        <input type="text" id="othersHeiVisit" v-model="formData.heiVisit.others" />
      </div>

      <div>
        <label for="remarksHeiVisit">Remarks:</label>
        <textarea id="remarksHeiVisit" v-model="formData.heiVisit.remarks" rows="3"></textarea>
      </div>

      <div>
        <label for="supportingDocumentHeiVisit">Supporting Document:</label>
        <input type="file" id="supportingDocumentHeiVisit" @change="handleHeiVisitFileChange" />
        <span v-if="
            formData.heiVisit.supportingDocumentFile &&
            formData.heiVisit.supportingDocumentFile.name
          ">Selected: {{ formData.heiVisit.supportingDocumentFile.name }}</span>
      </div>
    </div>

    <button @click="submitForm">Submit</button>
    <button @click="editForm">Edit</button>
    <button @click="viewForm">View</button>

    <!-- Display Submitted Data (For Testing)
      <div v-if="submittedData">
        <h2>Submitted Data:</h2>
        <pre>{{ submittedData }}</pre>
      </div> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const eventType = ref('fair')
const submittedData = ref(null)
const ecpfDetails = {
  ecpfName: 'Example ECPF',
  location: 'Example Location',
  nameOfProprietor: 'Example Proprietor',
  cid: '12345678901',
  contactNo: '1234567890',
  emailAddress: 'example@example.com',
}

const formData = ref({
  fair: {
    fairName: '',
    fairDescription: '',
    fairLocation: '',
    representatives: [
      {
        name: '',
        passportNo: '',
        nationality: 'Bhutanese',
        arrivalDate: '',
        departureDate: '',
        cvFile: null,
      },
    ],
    institutes: [
      {
        name: '',
        location: '',
        zoneState: '',
        country: '',
        website: '',
        contact: '',
        affiliatedTo: '',
        type: 'Public',
        recognitionCode: '',
        courses: [{ name: '', accreditedBy: '', authLetterFile: null }],
      },
    ],
    remarks: '',
  },
  inHouse: {
    promotionalEventType: 'Seminar',
    institute: '',
    eventName: '',
    eventDescription: '',
    eventPurpose: '',
    eventLocation: '',
    representatives: [
      {
        name: '',
        passportNo: '',
        nationality: 'Bhutanese',
        arrivalDate: '',
        departureDate: '',
        cvFile: null,
        affiliationFile: null,
        authorizationFile: null,
      },
    ],
    remarks: '',
  },
  massMedia: {
    promotionalEventType: 'Radio',
    institutes: [],
    massMediaPromotionalName: '',
    description: '',
    purpose: '',
    promotionalChannel: '',
    promotionalContentsFile: null,
    others: '',
    remarks: '',
  },
  heiVisit: {
    promotionalEventType: 'Visit', // Default value
    institutes: [],
    programmeDetail: '',
    description: '',
    purpose: '',
    fromDate: '',
    toDate: '',
    others: '',
    remarks: '',
    supportingDocumentFile: null,
  },
})

const availableInstitutes = ref(['Institute A', 'Institute B', 'Institute C'])

// Education Fair Form Functions
const addFairRepresentative = () => {
  if (formData.value.fair.representatives.length < 2) {
    formData.value.fair.representatives.push({
      name: '',
      passportNo: '',
      nationality: 'Bhutanese',
      arrivalDate: '',
      departureDate: '',
      cvFile: null,
    })
  }
}
const removeFairRepresentative = (index) => {
  formData.value.fair.representatives.splice(index, 1)
}

const addFairInstitute = () => {
  formData.value.fair.institutes.push({
    name: '',
    location: '',
    zoneState: '',
    country: '',
    website: '',
    contact: '',
    affiliatedTo: '',
    type: 'Public',
    recognitionCode: '',
    courses: [{ name: '', accreditedBy: '', authLetterFile: null }],
  })
}
const removeFairInstitute = (index) => {
  formData.value.fair.institutes.splice(index, 1)
}

const addFairCourse = (instituteIndex) => {
  formData.value.fair.institutes[instituteIndex].courses.push({
    name: '',
    accreditedBy: '',
    authLetterFile: null,
  })
}

const removeFairCourse = (instituteIndex, courseIndex) => {
  formData.value.fair.institutes[instituteIndex].courses.splice(courseIndex, 1)
}
const handleFairFileChange = (index, type, event, courseIndex = null) => {
  const file = event.target.files[0]
  if (type === 'cv') {
    formData.value.fair.representatives[index].cvFile = file
  } else if (type === 'authLetter') {
    formData.value.fair.institutes[index].courses[courseIndex].authLetterFile = file
  }
}

// In-House Event Form Functions
const addInHouseRepresentative = () => {
  if (formData.value.inHouse.representatives.length < 2) {
    formData.value.inHouse.representatives.push({
      name: '',
      passportNo: '',
      nationality: 'Bhutanese',
      arrivalDate: '',
      departureDate: '',
      cvFile: null,
      affiliationFile: null,
      authorizationFile: null,
    })
  }
}
const removeInHouseRepresentative = (index) => {
  formData.value.inHouse.representatives.splice(index, 1)
}

const handleInHouseFileChange = (index, type, event) => {
  const file = event.target.files[0]
  if (type === 'cv') {
    formData.value.inHouse.representatives[index].cvFile = file
  } else if (type === 'affiliation') {
    formData.value.inHouse.representatives[index].affiliationFile = file
  } else if (type === 'authorization') {
    formData.value.inHouse.representatives[index].authorizationFile = file
  }
}

// Mass Media Event Form Functions
const handleMassMediaFileChange = (event) => {
  formData.value.massMedia.promotionalContentsFile = event.target.files[0]
}

// HEI Visit Form Functions
const handleHeiVisitFileChange = (event) => {
  formData.value.heiVisit.supportingDocumentFile = event.target.files[0]
}

// Common Form Functions
const submitForm = () => {
  submittedData.value = { ...formData.value }
  console.log('Form Data:', formData.value)
}

const editForm = () => {
  console.log('Edit form')
}

const viewForm = () => {
  console.log('View form')
}

onMounted(() => {
  // Simulate fetching institute details based on the selected name
  // Note this is a simulation and you probably won't need onMounted here
  // in a real application since you are modifying the reactive data directly.
  // This is only to keep the *example* the same as the original.  In a
  // real application, you would fetch this data when the institute name
  // *changes*, not on mount (likely using a watcher on institute.name).

  //Because formData.value.fair.institutes is initialized with an empty institute object in,
  //  we don't actually need to loop here.  Just access the first one.

  //formData.value.fair.institutes.forEach((institute) => {  // No need to loop
  const institute = formData.value.fair.institutes[0]
  if (institute.name) {
    // Simulate fetching data
    switch (institute.name) {
      case 'Institute A':
        institute.location = 'Location A'
        institute.zoneState = 'State A'
        institute.country = 'Country A'
        break
      case 'Institute B':
        institute.location = 'Location B'
        institute.zoneState = 'State B'
        institute.country = 'Country B'
        break
      case 'Institute C':
        institute.location = 'Location C'
        institute.zoneState = 'State C'
        institute.country = 'Country C'
        break
    }
  }
  //}); // No need to loop
})
</script>

<style scoped>
.container {
  max-width: 800px;
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

input[type='text'],
select,
textarea,
input[type='date'],
input[type='file'] {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  /* Important for width: 100% */
}

button {
  background-color: #3271a5;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 5px;
  /* added for spacing */
}

button:hover {
  background-color: #46a2da;
}

/* Style for individual form sections within each event type */
.form-container h2 {
  margin-top: 0;
}

.form-container h3 {
  margin-top: 15px;
}

.form-container div {
  margin-bottom: 10px;
}
</style>
