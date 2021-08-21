<template>
  <Transition
    enter-active-class="ease-out duration-300"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="ease-in duration-200"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="showModal"
      @click="handleBackdropClick"
      class="fixed z-50 inset-0 overflow-y-auto bg-gray-500/75 backdrop-blur-sm flex items-center justify-center sm:py-12"
    >
      <div
        class="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl m-4 transform transition-all"
        @click.stop
      >
        <div
          class="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0"
        ></div>

        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-blue-50 rounded-lg">
              <MessageSquareIcon class="w-5 h-5 text-blue-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900">Application Remarks</h3>
          </div>
          <button
            @click="closeModal"
            class="group p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <XIcon class="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>
        </div>

        <div class="p-6 space-y-6">
          <!-- Private Note from Chief (TOP PRIORITY) -->
          <div
            v-if="privateRemarks"
            class="space-y-3 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg shadow-sm"
          >
            <div class="flex items-center gap-2">
              <MessageSquareWarningIcon class="w-5 h-5 text-amber-600" />
              <h4 class="text-lg font-medium text-amber-900">Private Note from Chief for DO</h4>
            </div>
            <div class="pl-7">
              <p class="text-amber-800 whitespace-pre-wrap">{{ privateRemarks }}</p>
            </div>
          </div>

          <!-- Public / Internal Remarks -->
          <div v-if="chiefRemarks" class="space-y-3">
            <div class="flex items-center gap-2">
              <UserIcon class="w-5 h-5 text-gray-400" />
              <h4 class="text-lg font-medium text-gray-900">Chief Remarks (For Applicant)</h4>
            </div>
            <div class="pl-7">
              <p class="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 whitespace-pre-wrap">
                {{ chiefRemarks }}
              </p>
            </div>
          </div>

          <div v-if="dealingOfficerRemarks" class="space-y-3">
            <div class="flex items-center gap-2">
              <UserCogIcon class="w-5 h-5 text-gray-400" />
              <h4 class="text-lg font-medium text-gray-900">Dealing Officer Remarks (For Chief)</h4>
            </div>
            <div class="pl-7">
              <p class="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 whitespace-pre-wrap">
                {{ dealingOfficerRemarks }}
              </p>
            </div>
          </div>

          <div
            v-if="!chiefRemarks && !dealingOfficerRemarks && !privateRemarks"
            class="flex flex-col items-center justify-center py-8 text-center"
          >
            <div class="p-3 bg-gray-100 rounded-full mb-4">
              <InboxIcon class="w-6 h-6 text-gray-400" />
            </div>
            <p class="text-gray-500">No remarks are available for this application.</p>
          </div>
        </div>

        <div class="flex justify-end p-4 bg-gray-50 border-t border-gray-100 rounded-b-xl">
          <button
            @click="closeModal"
            class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import {
  MessageSquare as MessageSquareIcon,
  X as XIcon,
  User as UserIcon,
  UserCog as UserCogIcon,
  Inbox as InboxIcon,
  MessageSquareWarning as MessageSquareWarningIcon,
} from 'lucide-vue-next'

defineProps({
  showModal: { type: Boolean, default: false },
  dealingOfficerRemarks: { type: String, default: null },
  chiefRemarks: { type: String, default: null },
  privateRemarks: { type: String, default: null },
})

const emit = defineEmits(['close'])

const handleBackdropClick = (event) => {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

const closeModal = () => {
  emit('close')
}
</script>