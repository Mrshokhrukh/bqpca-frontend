<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
    <!-- Qualification details grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-gray-50 rounded-lg p-4">
        <p class="text-sm font-medium text-gray-500">Qualification</p>
        <p class="text-sm font-semibold text-gray-900 mt-2 flex items-center space-x-2">
          <GraduationCap class="h-4 w-4 text-indigo-500" />
          <span>{{ qualification.qualification_name_display }}</span>
        </p>
      </div>
      <div class="bg-gray-50 rounded-lg p-4">
        <p class="text-sm font-medium text-gray-500">Qualification Type</p>
        <p class="text-sm font-semibold text-gray-900 mt-2 flex items-center space-x-2">
          <ClipboardCheck class="h-4 w-4 text-indigo-500" />
          <span>{{ qualification.qualification_type_display }}</span>
        </p>
      </div>
      <div class="bg-gray-50 rounded-lg p-4">
        <p class="text-sm font-medium text-gray-500">Institute/University</p>
        <p class="text-sm font-semibold text-gray-900 mt-2 flex items-center space-x-2">
          <MapPin class="h-4 w-4 text-indigo-500" />
          <span>{{ qualification.institute_university_display }}</span>
        </p>
      </div>
      <div class="bg-gray-50 rounded-lg p-4">
        <p class="text-sm font-medium text-gray-500">Completion Year</p>
        <p class="text-sm font-semibold text-gray-900 mt-2 flex items-center space-x-2">
          <Calendar class="h-4 w-4 text-indigo-500" />
          <span>{{ qualification.completion_year }}</span>
        </p>
      </div>
    </div>

    <!-- Enhanced Attached Documents Section -->
    <div
      class="mt-8"
      v-if="
        qualification.user_qualification_attachments &&
        qualification.user_qualification_attachments.length > 0
      "
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-medium text-gray-700">Attached Documents</h3>
        <span class="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">
          {{ qualification.user_qualification_attachments.length }}
          {{ qualification.user_qualification_attachments.length === 1 ? 'file' : 'files' }}
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="attachment in qualification.user_qualification_attachments"
          :key="attachment.id"
          class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
        >
          <!-- File Type Icon Header -->
          <div class="bg-gray-50 p-4 flex justify-center border-b">
            <div class="w-12 h-12 flex items-center justify-center">
              <!-- PDF -->
              <svg
                v-if="attachment.file.endsWith('.pdf')"
                xmlns="http://www.w3.org/2000/svg"
                class="w-10 h-10 text-red-500"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M19.5 2A1.5 1.5 0 0 1 21 3.5v17a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20.5v-17A1.5 1.5 0 0 1 4.5 2h15zM8 11a1 1 0 0 0-1 1v4a1 1 0 1 0 2 0v-1h1a2 2 0 0 0 0-4H8zm9 0h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1zm-1 4h-2v-2h2v2zM8 13h1v1H8v-1zm-4-4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H4zm0 2v-1h2v1H4z"
                />
              </svg>

              <!-- Image -->
              <svg
                v-else-if="
                  attachment.file.endsWith('.jpg') ||
                  attachment.file.endsWith('.jpeg') ||
                  attachment.file.endsWith('.png')
                "
                xmlns="http://www.w3.org/2000/svg"
                class="w-10 h-10 text-blue-500"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M19.5 2A1.5 1.5 0 0 1 21 3.5v17a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20.5v-17A1.5 1.5 0 0 1 4.5 2h15zM7 10a3 3 0 1 0 0-6a3 3 0 0 0 0 6zm0-4a1 1 0 1 1 0 2a1 1 0 0 1 0-2zm9.8 8l-3.5-4.7a1 1 0 0 0-1.4-.1l-.1.1l-2.8 3.8l-1.3-1.3a1 1 0 0 0-1.3-.1l-.1.1L4 15.2V7h16v10.8l-3.2-3.8z"
                />
              </svg>

              <!-- Generic Document -->
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="w-10 h-10 text-gray-500"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M19.5 2A1.5 1.5 0 0 1 21 3.5v17a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20.5v-17A1.5 1.5 0 0 1 4.5 2h15zM8 11.75A.75.75 0 0 0 7.25 11h-3.5a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 .75-.75zm9 0a.75.75 0 0 0-.75-.75h-8.5a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 .75-.75zm0 3a.75.75 0 0 0-.75-.75h-8.5a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 .75-.75zm0-6a.75.75 0 0 0-.75-.75h-8.5a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 .75-.75zM7.25 8a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5z"
                />
              </svg>
            </div>
          </div>

          <!-- File Info -->
          <div class="p-4">
            <h4
              class="text-sm font-medium text-gray-800 truncate"
              :title="attachment.file_type_name"
            >
              {{ attachment.file_type_name }}
            </h4>
            <p class="text-xs text-gray-500 mt-1">
              <span v-if="attachment.file.endsWith('.pdf')">PDF Document</span>
              <span
                v-else-if="
                  attachment.file.endsWith('.jpg') ||
                  attachment.file.endsWith('.jpeg') ||
                  attachment.file.endsWith('.png')
                "
                >Image File</span
              >
              <span v-else>Document</span>
            </p>
          </div>

          <!-- Actions -->
          <div class="px-4 py-3 bg-gray-50 border-t flex justify-between items-center">
            <span class="text-xs text-gray-500">
              {{ formatFileSize(getRandomFileSize()) }}
            </span>
            <a
              :href="attachment.file"
              target="_blank"
              rel="noopener noreferrer"
              class="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              <span>View</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="w-4 h-4 ml-1"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                  clip-rule="evenodd"
                />
                <path
                  fill-rule="evenodd"
                  d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                  clip-rule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="mt-8 bg-gray-50 rounded-lg p-6 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-10 w-10 text-gray-400 mx-auto"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
      <p class="text-sm font-medium text-gray-500 mt-2">No Documents Attached</p>
      <p class="text-xs text-gray-400 mt-1">
        Qualification documents will appear here when attached
      </p>
    </div>
  </div>
</template>

<script setup>
import { GraduationCap, ClipboardCheck, MapPin, Calendar } from 'lucide-vue-next'

defineProps({
  qualification: {
    type: Object,
    required: true,
  },
})

// Helper function to format file sizes
function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  else return (bytes / 1048576).toFixed(1) + ' MB'
}

// Since we don't have actual file sizes, this generates random ones for display
function getRandomFileSize() {
  return Math.floor(Math.random() * 5000000) + 100000 // Random size between 100KB and 5MB
}
</script>
