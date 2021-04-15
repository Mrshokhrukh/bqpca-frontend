// 10. ApprovedCpdForm.vue
<template>
  <div v-if="isCpdApproved">
    <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
      <h3 class="text-lg font-semibold text-gray-900">Add Participants (After Approval)</h3>
      <p class="mt-1 text-sm text-gray-500">Add participants after CPD approval.</p>
    </div>

    <div class="p-8">
      <div
        v-for="(participant, index) in participants"
        :key="index"
        class="mb-6 p-4 border rounded-xl"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- RegNo -->
          <div>
            <label class="block text-sm font-medium text-gray-700">RegNo</label>
            <input
              type="text"
              v-model="participant.regNo"
              @blur="fetchParticipantName(participant)"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              v-model="participant.name"
              readonly
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
            />
          </div>
        </div>

        <div class="mt-2 flex justify-end">
          <button
            @click="removeParticipant(index)"
            class="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Remove
          </button>
        </div>
      </div>
      <button
        @click="addParticipant"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        Add More
      </button>

      <!-- Attendance Sheet -->
      <div class="mt-6">
        <label for="attendanceSheet" class="block text-sm font-medium text-gray-700"
          >Attendance Sheet <span class="text-red-500">*</span></label
        >
        <input
          type="file"
          id="attendanceSheet"
          @change="handleAttendanceSheetUpload"
          class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p class="text-xs text-gray-500 mt-1">Accepted file format: PDF (max 5MB)</p>
      </div>
      <!-- Attachment -->
      <div v-if="application.isApproved === 'true'">
        <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="col-span-1">
            <label for="attachment" class="block text-sm font-medium text-gray-700"
              >Attachment <span class="text-red-500">*</span></label
            >
            <input
              type="file"
              id="attachment"
              @change="handleAttachmentUpload"
              class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p class="text-xs text-gray-500 mt-1">Accepted file format: PDF (max 5MB)</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isCpdApproved: Boolean,
  participants: Array,
  attendanceSheet: Object, //file
  handleAttendanceSheetUpload: Function,
  addParticipant: Function,
  removeParticipant: Function,
  fetchParticipantName: Function,
  attachment: Object,
  handleAttachmentUpload: Function,
  application: Object,
})
</script>
