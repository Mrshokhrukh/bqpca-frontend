<template>
  <div v-if="showButtons" class="flex flex-wrap gap-3">
    <!-- View Button - Always Visible, behavior based on role -->
    <button
      @click="handleAction('view')"
      class="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white shadow-sm hover:bg-gray-50 hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <Eye class="h-4 w-4 text-blue-600" />
      <span>View</span>
    </button>

    <!-- View Certificate - Visible for approved applications -->
    <button
      v-if="showViewCertificateButton"
      @click="handleAction('viewCertificate')"
      class="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white shadow-sm hover:bg-gray-50 hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
    >
      <FileText class="h-4 w-4 text-emerald-600" />
      <span>View Certificate</span>
    </button>

    <!-- Dealing Officer Specific Buttons -->
    <template v-if="userRole !== 'chief'">
      <button
        v-if="showAddNoteButton"
        @click="handleAction('addNote')"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white shadow-sm hover:bg-gray-50 hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
      >
        <FileText class="h-4 w-4 text-cyan-600" />
        <span>{{ hasRemarks ? 'Edit Note' : 'Add Note' }}</span>
      </button>

      <button
        v-if="showReUploadButton"
        @click="handleAction('reUpload')"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white shadow-sm hover:bg-gray-50 hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Upload class="h-4 w-4 text-indigo-600" />
        <span>Re-upload</span>
      </button>

      <button
        v-if="showReProcessButton"
        @click="handleAction('reProcess')"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white shadow-sm hover:bg-gray-50 hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
      >
        <RefreshCw class="h-4 w-4 text-emerald-600" />
        <span>Re-process</span>
      </button>

      <button
        v-if="showForwardButton"
        @click="handleAction('forward')"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 shadow-sm hover:bg-blue-700 hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <SendHorizontal class="h-4 w-4" />
        <span>Forward</span>
      </button>
    </template>

    <!-- Chief Specific Buttons -->
    <template v-if="userRole === 'chief'">
      <button
        v-if="showReadDoRemarksButton"
        @click="handleAction('readDoRemarks')"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white shadow-sm hover:bg-gray-50 hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <FileText class="h-4 w-4 text-blue-600" />
        <span>Read DO Note</span>
      </button>

      <button
        v-if="showRegretReasonButton"
        @click="handleAction('regretReason')"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white shadow-sm hover:bg-gray-50 hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
      >
        <FileText class="h-4 w-4 text-rose-600" />
        <span>View Reason</span>
      </button>

      <button
        v-if="showRegretButton"
        @click="handleAction('regret')"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 shadow-sm hover:bg-rose-700 hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
      >
        <XCircle class="h-4 w-4" />
        <span>Regret</span>
      </button>

      <button
        v-if="showChiefAddNoteButton"
        @click="handleAction('addNote')"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white shadow-sm hover:bg-gray-50 hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
      >
        <FileText class="h-4 w-4 text-cyan-600" />
        <span>{{ hasChiefRemarks ? 'Edit Note' : 'Add Note' }}</span>
      </button>

      <button
        v-if="showApproveButton"
        @click="handleAction('approve')"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 shadow-sm hover:bg-green-700 hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
  RefreshCw,
  SendHorizontal,
  XCircle,
  CheckCircle,
} from 'lucide-vue-next'

const props = defineProps({
  application: {
    type: Object,
    required: true,
  },
  userRole: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['action'])

const handleAction = (action) => {
  emit('action', { action, application: props.application })
}

const showButtons = computed(() => props.application.status !== 'draft')
// Common
const showViewCertificateButton = computed(() => props.application.status === 'approved')
// Dealing Officer Specific
const showAddNoteButton = computed(
  () => ['applied', 'processing'].includes(props.application.status) && props.userRole !== 'chief',
)
// Update the hasRemarks computed property
const hasRemarks = computed(() => !!props.application.dealing_officer_remarks)
const showReUploadButton = computed(
  () => ['applied', 'processing'].includes(props.application.status) && props.userRole !== 'chief',
)
const showReProcessButton = computed(
  () => ['applied', 'processing'].includes(props.application.status) && props.userRole !== 'chief',
)
const showForwardButton = computed(
  () => ['applied', 'processing'].includes(props.application.status) && props.userRole !== 'chief',
)
// Chief Specific
const showReadDoRemarksButton = computed(
  () => props.userRole === 'chief' && props.application.dealing_officer_remarks,
)
const showRegretReasonButton = computed(
  () =>
    props.userRole === 'chief' &&
    (props.application.status === 'regretted' ||
      props.application.status === 'reprocess' ||
      props.application.status === 'reupload'),
)
const showRegretButton = computed(
  () =>
    props.userRole === 'chief' &&
    ['applied', 'under_review', 'reprocess', 'reupload'].includes(props.application.status),
)
const showChiefAddNoteButton = computed(
  () =>
    props.userRole === 'chief' &&
    ['applied', 'processing', 'under_review', 'reprocess', 'reupload'].includes(
      props.application.status,
    ),
)
const hasChiefRemarks = computed(() => !!props.application.chief_remarks)
const showApproveButton = computed(
  () =>
    props.userRole === 'chief' &&
    ['applied', 'under_review', 'reprocess', 'reupload'].includes(props.application.status),
)
</script>
