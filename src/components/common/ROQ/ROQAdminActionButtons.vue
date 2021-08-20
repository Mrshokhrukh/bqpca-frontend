<template>
  <div v-if="showButtons" class="flex flex-wrap items-center justify-end gap-2">
    <!-- View Button - Always Visible -->
    <button
      @click="handleAction('view')"
      class="inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 text-sm font-medium rounded-md text-gray-700 bg-white shadow-sm hover:bg-gray-50 transition-all duration-200"
    >
      <Eye class="h-4 w-4 text-blue-600" />
      <span>View</span>
    </button>

    <!-- View Certificate - For approved applications -->
    <button
      v-if="application.status === 'approved'"
      @click="handleAction('viewCertificate')"
      class="inline-flex items-center justify-center gap-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 shadow-sm hover:bg-emerald-700 transition-all duration-200"
    >
      <FileText class="h-4 w-4" />
      <span>Certificate</span>
    </button>

    <!-- View Remarks Button - Visible if any remarks exist -->
    <button
      v-if="hasAnyRemarks"
      @click="handleAction('viewRemarks')"
      class="inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 text-sm font-medium rounded-md text-gray-700 bg-white shadow-sm hover:bg-gray-50 transition-all duration-200"
    >
      <MessageSquare class="h-4 w-4 text-gray-500" />
      <span>View Remarks</span>
    </button>

    <!-- Dealing Officer Specific Buttons -->
    <template v-if="userRole === 'dealing_officer'">
      <button
        v-if="showAddNoteButton"
        @click="handleAction('addNote')"
        class="inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 text-sm font-medium rounded-md text-gray-700 bg-white shadow-sm hover:bg-gray-50 transition-all duration-200"
      >
        <Pencil class="h-4 w-4 text-cyan-600" />
        <span>{{ hasRemarks ? 'Edit Note' : 'Add Note' }}</span>
      </button>

      <button
        v-if="showReUploadButton"
        @click="handleAction('reUpload')"
        class="inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 text-sm font-medium rounded-md text-gray-700 bg-white shadow-sm hover:bg-gray-50 transition-all duration-200"
      >
        <Upload class="h-4 w-4 text-indigo-600" />
        <span>Re-upload</span>
      </button>

      <button
        v-if="showForwardButton"
        @click="handleAction('forward')"
        class="inline-flex items-center justify-center gap-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 shadow-sm hover:bg-blue-700 transition-all duration-200"
      >
        <SendHorizontal class="h-4 w-4" />
        <span>Forward</span>
      </button>
    </template>

    <!-- Chief Specific Buttons -->
    <template v-if="userRole === 'chief'">
      <button
        v-if="showChiefAddNoteButton"
        @click="handleAction('addNote')"
        class="inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 text-sm font-medium rounded-md text-gray-700 bg-white shadow-sm hover:bg-gray-50 transition-all duration-200"
      >
        <Pencil class="h-4 w-4 text-cyan-600" />
        <span>{{ hasChiefRemarks ? 'Edit Remark' : 'Add Remark' }}</span>
      </button>

      <button
        v-if="showChiefAddPrivateNoteButton"
        @click="handleAction('addPrivateNote')"
        class="inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 text-sm font-medium rounded-md text-gray-700 bg-white shadow-sm hover:bg-gray-50 transition-all duration-200"
      >
        <MessageSquareWarning class="h-4 w-4 text-indigo-600" />
        <span>Note for DO</span>
      </button>

      <button
        v-if="showRegretButton"
        @click="handleAction('regret')"
        class="inline-flex items-center justify-center gap-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 shadow-sm hover:bg-rose-700 transition-all duration-200"
      >
        <XCircle class="h-4 w-4" />
        <span>Regret</span>
      </button>

      <button
        v-if="showApproveButton"
        @click="handleAction('approve')"
        class="inline-flex items-center justify-center gap-2 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 shadow-sm hover:bg-green-700 transition-all duration-200"
      >
        <CheckCircle class="h-4 w-4" />
        <span>Approve</span>
      </button>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  Eye,
  FileText,
  Upload,
  SendHorizontal,
  XCircle,
  CheckCircle,
  MessageSquare,
  Pencil,
  MessageSquareWarning,
} from 'lucide-vue-next'

const props = defineProps({
  application: { type: Object, required: true },
  userRole: { type: String, required: true },
})

const emit = defineEmits(['action'])

const handleAction = (action) => {
  emit('action', { action, application: props.application })
}

// GENERAL
const showButtons = computed(() => props.application.status !== 'draft')
const hasAnyRemarks = computed(
  () =>
    !!props.application.dealing_officer_remarks ||
    !!props.application.chief_remarks ||
    !!props.application.chief_to_do_remarks,
)

// DEALING OFFICER
const doActionableStatuses = ['applied', 'processing']
const showAddNoteButton = computed(() => doActionableStatuses.includes(props.application.status))
const hasRemarks = computed(() => !!props.application.dealing_officer_remarks)
const showReUploadButton = computed(() => doActionableStatuses.includes(props.application.status))
const showForwardButton = computed(() => doActionableStatuses.includes(props.application.status))

// CHIEF
const chiefActionableStatuses = ['under_review', 'reprocess', 'reupload']
const showRegretButton = computed(() => chiefActionableStatuses.includes(props.application.status))
const showApproveButton = computed(() => chiefActionableStatuses.includes(props.application.status))
const showChiefAddNoteButton = computed(() =>
  chiefActionableStatuses.includes(props.application.status),
)
const showChiefAddPrivateNoteButton = computed(() =>
  chiefActionableStatuses.includes(props.application.status),
)
const hasChiefRemarks = computed(() => !!props.application.chief_remarks)
</script>