<template>
  <div class="max-w-xl mx-auto p-6 bg-white shadow-md rounded">
    <h2 class="text-xl font-semibold mb-4">CPD Registration Form</h2>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Personal Details -->
      <fieldset>
        <legend class="font-semibold">Personal Details</legend>

        <div>
          <label for="registrationNumber" class="block text-sm font-medium">Registration Number</label>
          <input
            id="registrationNumber"
            v-model="form.registrationNumber"
            type="text"
            class="mt-1 block w-full border rounded px-3 py-2"
            disabled
          />
        </div>

        <div>
          <label for="cidNumber" class="block text-sm font-medium">CID No./Identity/Work Permit No.</label>
          <input
            id="cidNumber"
            v-model="form.cidNumber"
            type="text"
            class="mt-1 block w-full border rounded px-3 py-2"
            disabled
          />
        </div>

        <div>
          <label for="fullName" class="block text-sm font-medium">Full Name</label>
          <input
            id="fullName"
            v-model="form.fullName"
            type="text"
            class="mt-1 block w-full border rounded px-3 py-2"
            disabled
          />
        </div>

        <div>
          <label for="gender" class="block text-sm font-medium">Gender</label>
          <input
            id="gender"
            v-model="form.gender"
            type="text"
            class="mt-1 block w-full border rounded px-3 py-2"
            disabled
          />
        </div>
      </fieldset>

      <!-- CPD Details -->
      <fieldset>
        <legend class="font-semibold">CPD Details</legend>

        <div>
          <label for="cpdTitle" class="block text-sm font-medium">Title of CPD</label>
          <input
            id="cpdTitle"
            v-model="form.cpdTitle"
            type="text"
            class="mt-1 block w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label for="relevance" class="block text-sm font-medium">Relevance to your profession</label>
          <input
            id="relevance"
            v-model="form.relevance"
            type="text"
            class="mt-1 block w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label for="participationCategory" class="block text-sm font-medium">Participation Category</label>
          <select
            id="participationCategory"
            v-model="form.participationCategory"
            class="mt-1 block w-full border rounded px-3 py-2"
            required
          >
            <option value="" disabled>Select</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
          </select>
        </div>

        <div>
          <label for="participantSubCategory" class="block text-sm font-medium">Participant Sub-category</label>
          <select
            id="participantSubCategory"
            v-model="form.participantSubCategory"
            class="mt-1 block w-full border rounded px-3 py-2"
            required
          >
            <option value="" disabled>Select</option>
            <option value="subCategory1">Sub-category 1</option>
            <option value="subCategory2">Sub-category 2</option>
          </select>
        </div>

        <div>
          <label for="activityType" class="block text-sm font-medium">Type of CPD Activity</label>
          <select
            id="activityType"
            v-model="form.activityType"
            class="mt-1 block w-full border rounded px-3 py-2"
            required
          >
            <option value="" disabled>Select</option>
            <option value="type1">Type 1</option>
            <option value="type2">Type 2</option>
          </select>
        </div>

        <div>
          <label for="attachment" class="block text-sm font-medium">Attachment</label>
          <input
            id="attachment"
            type="file"
            @change="handleFileUpload"
            class="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>
      </fieldset>

      <!-- Buttons -->
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="handleCancel"
          class="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  registrationNumber: '',
  cidNumber: '',
  fullName: '',
  gender: '',
  cpdTitle: '',
  relevance: '',
  participationCategory: '',
  participantSubCategory: '',
  activityType: '',
  attachment: null,
})

const handleSubmit = () => {
  alert('Form submitted successfully!')
  console.log(form)
}

const handleCancel = () => {
  Object.keys(form).forEach((key) => (form[key] = ''))
}

const handleFileUpload = (event) => {
  form.attachment = event.target.files[0]
}
</script>

<style scoped>
/* Add additional styling if required */
</style>
