<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="mb-4 border p-4 rounded-lg">
      <h3 class="text-xl font-semibold mb-2">Personal Information</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="cid" class="block text-sm font-medium text-gray-700">CID</label>
          <input type="text" id="cid" v-model="form.cid_no"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label for="full_name" class="block text-sm font-medium text-gray-700">Full Name</label>
          <input type="text" id="full_name" v-model="form.applicants_name"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label for="date_of_birth" class="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input type="text" id="date_of_birth" v-model="form.date_of_birth"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label for="contact_number" class="block text-sm font-medium text-gray-700">Contact Number</label>
          <input type="text" id="contact_number" v-model="form.contact_number"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label for="email_address" class="block text-sm font-medium text-gray-700">Email Address</label>
          <input type="text" id="email_address" v-model="form.email_address"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
        </div>
      </div>
    </div>

    <div class="mb-4 border p-4 rounded-lg">
      <h3 class="text-xl font-semibold mb-2">Education Details</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="study_in_country" class="block text-sm font-medium text-gray-700">Study in country?</label>
          <div class="mt-1 flex space-x-2">
            <label class="inline-flex items-center">
              <input type="radio" value="true" v-model="form.study_in_country"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
              <span class="ml-2 text-sm text-gray-700">Yes</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" value="false" v-model="form.study_in_country"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
              <span class="ml-2 text-sm text-gray-700">No</span>
            </label>
          </div>
        </div>
        <div>
          <label for="course_title" class="block text-sm font-medium text-gray-700">Course Title</label>
          <input type="text" id="course_title" v-model="form.course_title"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label for="qualification" class="block text-sm font-medium text-gray-700">Qualification</label>
          <select id="qualification" v-model="form.qualification"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
            <option value="" disabled selected>select</option>
            <option value="diploma">Diploma</option>
            <option value="bachelor">Bachelor</option>
            <option value="masters">Masters</option>
            <option value="phd">PhD</option>
          </select>
        </div>
        <div>
          <label for="type_of_course" class="block text-sm font-medium text-gray-700">Type of Course</label>
          <select id="type_of_course" v-model="form.type_of_course"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
            <option value="" disabled selected>select</option>
            <option value="full-time">Full Time</option>
            <option value="part-time">Part Time</option>
            <option value="distance">Distance</option>
          </select>
        </div>
        <div>
          <label for="student_id_no" class="block text-sm font-medium text-gray-700">Student ID No.</label>
          <input type="text" id="student_id_no" v-model="form.student_id_no"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label for="name_of_institute" class="block text-sm font-medium text-gray-700">Name of Institute</label>
          <input type="text" id="name_of_institute" v-model="form.name_of_institute"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label for="name_of_university" class="block text-sm font-medium text-gray-700">Name of University</label>
          <input type="text" id="name_of_university" v-model="form.name_of_university"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label for="duration_of_course" class="block text-sm font-medium text-gray-700">Duration of Course</label>
          <input type="text" id="duration_of_course" v-model="form.duration_of_course"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label for="year_of_completion" class="block text-sm font-medium text-gray-700">Year of Completion</label>
          <input type="text" id="year_of_completion" v-model="form.year_of_completion"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
          <input type="text" id="location" v-model="form.location"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label for="country" class="block text-sm font-medium text-gray-700">Country</label>
          <input type="text" id="country" v-model="form.country"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label for="website" class="block text-sm font-medium text-gray-700">Website</label>
          <input type="text" id="website" v-model="form.website"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
        </div>
      </div>
    </div>


    <div class="mb-4 border p-4 rounded-lg">
      <h3 class="text-xl font-semibold mb-2">Supporting Documents</h3>
      <div>
        <label for="attachments" class="block text-sm font-medium text-gray-700">Attachments</label>
        <select id="attachments" v-model="form.attachments"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
          <option value="" disabled selected>select</option>
          <option value="cid_copy">CID Copy</option>
          <option value="academic_transcript">Academic Transcript</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div class="mt-2">
        <button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition-colors">Upload</button>
      </div>
    </div>
    <div>
      <label for="remarks" class="block text-sm font-medium text-gray-700">Remarks</label>
      <textarea id="remarks" rows="3" v-model="form.remarks"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"></textarea>
    </div>
    <div class="flex items-center">
      <input type="checkbox" id="declaration" v-model="form.declaration"
        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
      <label for="declaration" class="ml-2 text-sm text-gray-700">I declare that the particulars furnished above are
        true to the best</label>
    </div>
    <div class="flex justify-end space-x-4">
      <button type="button"
        class="inline-flex items-center px-6 py-3 border border-white text-white rounded hover:bg-white/10 transition-colors"
        @click="$emit('close-modal')">Cancel</button>
      <button type="button" @click="handleSaveAsDraft"
        class="inline-flex items-center px-6 py-3 border border-white text-white rounded hover:bg-white/10 transition-colors">Save
        as Draft</button>
      <button type="submit"
        class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Submit</button>
    </div>
  </form>
</template>

<script setup>
import { reactive } from 'vue';
import apiService from '@/services/services'
import { useAuthStore } from '@/stores/authStore';

const { user } = useAuthStore();

const form = reactive({
  cid_no: '',
  applicants_name: '',
  date_of_birth: '',
  contact_number: '',
  email_address: user.email,
  study_in_country: '',
  course_title: '',
  qualification: '',
  type_of_course: '',
  student_id_no: '',
  name_of_institute: '',
  name_of_university: '',
  duration_of_course: '',
  year_of_completion: '',
  location: '',
  country: '',
  website: '',
  attachments: '',
  remarks: '',
  declaration: false,
  status: 'draft',
});



const handleSaveAsDraft = async () => {
  try {
    const response = await apiService.createRecognition({
      ...form,
      status: 'draft'
    });
    if (response.status === 201) {
      console.log('Form data saved as draft successfully');
      // Emit application submitted event and close modal
      emit('application-submitted')
    }

  } catch (err) {
    console.error("Error saving draft:", err)
  }
}
const handleSubmit = async () => {
  try {
    const response = await apiService.createRecognition({
      ...form,
      status: 'submitted'
    });
    if (response.status === 201) {
      console.log('Form data submitted successfully');
      // Emit application submitted event and close modal
      emit('application-submitted')
    }
  } catch (error) {
    console.error('Error submitting form data:', error)
  }
};

const emit = defineEmits(['application-submitted', 'close-modal']);
</script>
