<template>
  <div v-if="showButtons" class="flex flex-wrap gap-2">
    <button v-if="showViewButton" @click="handleAction('view')"
      class="inline-flex items-center gap-1.5 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
      <Eye class="h-4 w-4" />
      View
    </button>

    <button v-if="showViewCertificateButton" @click="handleAction('viewCertificate')"
      class="inline-flex items-center gap-1.5 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
      <FileText class="h-4 w-4" />
      View Certificate
    </button>

    <button v-if="showAddNoteButton" @click="handleAction('addNote')"
      class="inline-flex items-center gap-1.5 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
      <FileText class="h-4 w-4" />
      {{ hasRemarks ? "Edit Note" : "Add Note" }}
    </button>

    <button v-if="showReUploadButton" @click="handleAction('reUpload')"
      class="inline-flex items-center gap-1.5 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      <Upload class="h-4 w-4" />
      Re-upload
    </button>

    <button v-if="showReProcessButton" @click="handleAction('reProcess')"
      class="inline-flex items-center gap-1.5 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
      <RefreshCw class="h-4 w-4" />
      Re-process
    </button>

    <button v-if="showForwardButton" @click="handleAction('forward')"
      class="inline-flex items-center gap-1.5 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
      <SendHorizontal class="h-4 w-4" />
      Forward
    </button>

    <button v-if="showRegretReasonButton" @click="handleAction('regretReason')"
      class="inline-flex items-center gap-1.5 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
      <FileText class="h-4 w-4" />
      View Reason
    </button>


    <button v-if="showRegretButton" @click="handleAction('regret')"
      class="inline-flex items-center gap-1.5 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
      <XCircle class="h-4 w-4" />
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
