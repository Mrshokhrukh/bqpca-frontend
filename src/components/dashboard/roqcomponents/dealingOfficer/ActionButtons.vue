<template>
  <div v-if="showButtons" class="flex flex-wrap gap-2">
    <button v-if="showViewButton" @click="handleAction('view')"
      class="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
      <Eye class="h-4 w-4 text-blue-500" />
      View
    </button>

    <button v-if="showViewCertificateButton" @click="handleAction('viewCertificate')"
      class="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
      <FileText class="h-4 w-4 text-emerald-500" />
      View Certificate
    </button>

    <button v-if="showAddNoteButton" @click="handleAction('addNote')"
      class="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
      <FileText class="h-4 w-4 text-cyan-500" />
      {{ hasRemarks ? "Edit Note" : "Add Note" }}
    </button>

    <button v-if="showReUploadButton" @click="handleAction('reUpload')"
      class="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
      <Upload class="h-4 w-4 text-indigo-500" />
      Re-upload
    </button>

    <button v-if="showReProcessButton" @click="handleAction('reProcess')"
      class="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
      <RefreshCw class="h-4 w-4 text-emerald-500" />
      Re-process
    </button>

    <button v-if="showForwardButton" @click="handleAction('forward')"
      class="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
      <SendHorizontal class="h-4 w-4 text-teal-500" />
      Forward
    </button>

    <button v-if="showRegretReasonButton" @click="handleAction('regretReason')"
      class="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
      <FileText class="h-4 w-4 text-rose-500" />
      View Reason
    </button>

    <button v-if="showRegretButton" @click="handleAction('regret')"
      class="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
      <XCircle class="h-4 w-4 text-rose-500" />
      Regret
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Eye, FileText, Upload, RefreshCw, SendHorizontal, XCircle } from 'lucide-vue-next';

const props = defineProps({
  application: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['action']);

const handleAction = (action) => {
  emit('action', { action, application: props.application });
};

const showButtons = computed(() => props.application.status !== 'draft')
const showViewButton = computed(() =>
  ['applied', 'processing', 'under_review', 'approved', 'regretted', 'reprocess', 'reupload'].includes(props.application.status)
);
const showViewCertificateButton = computed(() => props.application.status === 'approved')
const showAddNoteButton = computed(() => ['applied', 'processing'].includes(props.application.status));
const hasRemarks = computed(() => !!props.application.dealing_officer_remarks)
const showReUploadButton = computed(() => ['applied', 'processing'].includes(props.application.status));
const showReProcessButton = computed(() => ['applied', 'processing'].includes(props.application.status));
const showForwardButton = computed(() => ['applied', 'processing'].includes(props.application.status));
const showRegretButton = computed(() => props.application.status === 'applied')
const showRegretReasonButton = computed(() => props.application.status === 'regretted' || props.application.status === 'reprocess' || props.application.status === 'reupload')
</script>
