<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <h1 class="text-5xl font-serif font-bold text-slate-900 mb-8 text-center">New Recognition of Qualification Request
    </h1>

    <form @submit.prevent="handleSubmit">
      <!-- Personal Information -->
      <div class="bg-white p-8 rounded-lg shadow-lg mb-12">
        <h2 class="text-3xl font-serif font-bold text-slate-900 mb-6">Personal Information</h2>
        <div class="space-y-6">
          <div>
            <label class="block text-slate-600 text-base mb-2">CID</label>
            <input v-model="form.cid" type="texty" maxlength="11"
              class="w-full p-3 border border-slate-200 rounded-lg" />
            <span class="text-red-500 text-sm">{{ errors.cid }}</span>
          </div>
          <div>
            <label class="block text-slate-600 text-base mb-2">Full Name</label>
            <input v-model="form.fullName" type="text" class="w-full p-3 border border-slate-200 rounded-lg" />
            <span class="text-red-500 text-sm">{{ errors.fullName }}</span>
          </div>
          <div>
            <label class="block text-slate-600 text-base mb-2">Date of Birth</label>
            <input v-model="form.dateOfBirth" type="date" class="w-full p-3 border border-slate-200 rounded-lg" />
            <span class="text-red-500 text-sm">{{ errors.dateOfBirth }}</span>
          </div>
          <div>
            <label class="block text-slate-600 text-base mb-2">Contact Number</label>
            <input v-model="form.contactNumber" type="tel" maxlength="11"
              class="w-full p-3 border border-slate-200 rounded-lg" />
            <span class="text-red-500 text-sm">{{ errors.contactNumber }}</span>
          </div>
          <div>
            <label class="block text-slate-600 text-base mb-2">Email Address</label>
            <input v-model="form.emailAddress" type="email" class="w-full p-3 border border-slate-200 rounded-lg" />
            <span class="text-red-500 text-sm">{{ errors.emailAddress }}</span>
          </div>
        </div>
      </div>

      <!-- Education Details -->
      <div class="bg-white p-8 rounded-lg shadow-lg mb-12">
        <h2 class="text-3xl font-serif font-bold text-slate-900 mb-6">Education Details</h2>
        <div class="space-y-6">
          <div>
            <label class="block text-slate-600 text-base mb-2">Study in Country?</label>
            <div class="flex items-center space-x-6">
              <label class="flex items-center text-slate-600">
                <input v-model="form.studyInCountry" type="radio" value="yes" class="mr-2" />
                Yes
              </label>
              <label class="flex items-center text-slate-600">
                <input v-model="form.studyInCountry" type="radio" value="no" class="mr-2" />
                No
              </label>
            </div>
          </div>
          <div>
            <label class="block text-slate-600 text-base mb-2">Qualification</label>
            <select v-model="form.qualification" class="w-full p-3 border border-slate-200 rounded-lg">
              <option value="">Select Qualification</option>
              <option v-for="option in qualificationOptions" :key="option" :value="option">{{ option }}</option>
            </select>
            <span class="text-red-500 text-sm">{{ errors.qualification }}</span>
          </div>
          <!-- type of course -->
          <div>
            <label class="block text-slate-600 text-base mb-2">Type of Course</label>
            <select v-model="form.type_of_course" class="w-full p-3 border border-slate-200 rounded-lg">
              <option value="">Select Course</option>
              <option v-for="option in courseTypes" :key="option" :value="option">{{ option }}</option>
            </select>
            <span class="text-red-500 text-sm">{{ errors.type_of_course }}</span>
          </div>

          <!-- std Id No -->
          <div>
            <label class="block text-slate-600 text-base mb-2">Std ID No</label>
            <input v-model="form.std_id" type="text" class="w-full p-3 border border-slate-200 rounded-lg" />
            <span class="text-red-500 text-sm">{{ errors.std_id }}</span>
          </div>
          <!-- Name of the Institude -->
          <div>
            <label class="block text-slate-600 text-base mb-2">Name of the Institude</label>
            <input v-model="form.institute" type="text" class="w-full p-3 border border-slate-200 rounded-lg" />
            <span class="text-red-500 text-sm">{{ errors.institute }}</span>
          </div>
          <!-- Name of the University -->
          <div>
            <label class="block text-slate-600 text-base mb-2">Name of the University</label>
            <input v-model="form.university" type="text" class="w-full p-3 border border-slate-200 rounded-lg" />
            <span class="text-red-500 text-sm">{{ errors.university }}</span>
          </div>
          <!-- Duration of Course -->
          <div>
            <label class="block text-slate-600 text-base mb-2">Duration of Course</label>
            <input v-model="form.course_duration" type="text" class="w-full p-3 border border-slate-200 rounded-lg" />
            <span class="text-red-500 text-sm">{{ errors.course_duration }}</span>
          </div>
          <!-- Year of Completion -->
          <div>
            <label class="block text-slate-600 text-base mb-2">Year of Completion</label>
            <input v-model="form.year_completion" type="text" class="w-full p-3 border border-slate-200 rounded-lg" />
            <span class="text-red-500 text-sm">{{ errors.year_completion }}</span>
          </div>
          <!-- Loacation -->
          <div>
            <label class="block text-slate-600 text-base mb-2">Location</label>
            <input v-model="form.loaction" type="text" class="w-full p-3 border border-slate-200 rounded-lg" />
            <span class="text-red-500 text-sm">{{ errors.loaction }}</span>
          </div>
          <!-- Country -->
          <div>
            <label class="block text-slate-600 text-base mb-2">Country </label>
            <input v-model="form.country" type="text" class="w-full p-3 border border-slate-200 rounded-lg" />
            <span class="text-red-500 text-sm">{{ errors.country }}</span>
          </div>
          <!-- Website -->
          <div>
            <label class="block text-slate-600 text-base mb-2">Website</label>
            <input v-model="form.website" type="text" class="w-full p-3 border border-slate-200 rounded-lg" />
            <span class="text-red-500 text-sm">{{ errors.website }}</span>
          </div>

        </div>
      </div>
      <div class="bg-white p-8 rounded-lg shadow-lg mb-12">
        <h2 class="text-lg font-semibold mb-4">Supporting Documents</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label class="block mb-1">Document Type</label>
            <select v-model="form.documentType" class="w-full p-2 border rounded">
              <option value="">Select Document Type</option>
              <option value="Degree Certificate">Degree Certificate</option>
              <option value="Diploma Certificate">Diploma Certificate</option>
              <option value="Transcript">Transcript</option>
              <option value="Other">Other</option>
            </select>
            <span class="text-red-500 text-sm">{{ errors.documentType }}</span>
          </div>

          <div class="flex justify-end">
            <div>
              <label class="block mb-1">Upload Document</label>
              <input type="file" @change="handleFileUpload" class="w-full p-2 border rounded" />
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label class="flex items-center">
            <input type="checkbox" v-model="form.declaration" class="mr-2" />
            I declare that the particulars furnished above are true.
          </label>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex gap-4">
        <button type="button" @click="handleSaveAsDraft"
          class="inline-flex items-center px-6 py-3 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors">
          Save as Draft
        </button>
        <button type="submit"
          class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  cid: '',
  fullName: '',
  dateOfBirth: '',
  contactNumber: '',
  emailAddress: '',
  studyInCountry: '',
  courseTitle: '',
  qualification: '',
  type_of_course: '',
  studentIdNo: '',
  nameOfInstitute: '',
  university: '',
  course_duration: '',
  year_completion: '',
  location: '',
  country: '',
  website: '',
  documentType: '',

})

const errors = ref({})

const qualificationOptions = ['Diploma', 'Certificate']
const courseTypes = ['Full Time', 'Part Time', 'Distance Learning', 'Online']

const validateForm = () => {
  errors.value = {}

  if (!form.value.cid) {
    errors.value.cid = 'CID is required'
  } else if (!/^\d{11}$/.test(form.value.cid)) {
    errors.value.cid = 'CID must be 11 digits'
  }

  if (!form.value.contactNumber) {
    errors.value.contactNumber = 'Contact number is required'
  } else if (!/^(16|17|77)\d{6}$/.test(form.value.contactNumber)) {
    errors.value.contactNumber = 'Contact must start with 17 or 77 and be 8 digits'
  }

  if (!form.value.fullName) errors.value.fullName = 'Full name is required'
  if (!form.value.dateOfBirth) errors.value.dateOfBirth = 'Date of birth is required'
  if (!form.value.emailAddress) errors.value.emailAddress = 'Email is required'
  if (!form.value.courseTitle) errors.value.courseTitle = 'Course title is required'
  if (!form.value.qualification) errors.value.qualification = 'Qualification is required'
  if (!form.value.type_of_course) errors.value.type_of_course = 'Course type is required'
  if (!form.value.studentIdNo) errors.value.studentIdNo = 'Student ID is required'
  if (!form.value.nameOfInstitute) errors.value.nameOfInstitute = 'Institute name is required'
  if (!form.value.university) errors.value.university = 'Institute name is required'
  if (!form.value.course_duration) errors.value.course_duration = 'Institute name is required'
  if (!form.value.location) errors.value.loaction = 'Institute name is required'
  if (!form.value.country) errors.value.year_completion = 'Institute name is required'
  if (!form.value.website) errors.value.website = 'Institute name is required'
}

const handleSubmit = () => {
  validateForm()
  if (Object.keys(errors.value).length === 0) {
    alert('Form submitted successfully')
  } else {
    alert('Please fix the errors in the form')
  }
}

const handleSaveAsDraft = () => {
  alert('Form saved as draft')
}
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}
</style>
