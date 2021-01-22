// ActionButtons.vue
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

    <button v-if="showReadDoRemarksButton" @click="handleAction('readDoRemarks')"
      class="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
      <MessageSquare class="h-4 w-4 text-teal-500" />
      Read DO Remarks
    </button>

    <button v-if="showApproveButton" @click="handleAction('approve')"
      class="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
      <CheckCircle class="h-4 w-4 text-green-500" />
      Approve
    </button>

    <button v-if="showAssignQECButton" @click="handleAction('assignQEC')"
      class="inline-flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
      <Hash class="h-4 w-4 text-amber-500" />
      Assign QEC
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
import { Eye, FileText, MessageSquare, Hash, CheckCircle, XCircle } from 'lucide-vue-next';

const props = defineProps({
  application: {
    type: Object,
    required: true,
  },
  userRole: {
    type: String,
    required: true
  }
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

const showAddNoteButton = computed(() =>
  props.userRole === 'chief' && ['under_review'].includes(props.application.status)
);
const hasRemarks = computed(() => !!props.application.chief_remarks)

const showReadDoRemarksButton = computed(() => props.userRole === 'chief' && props.application.dealing_officer_remarks)

const showApproveButton = computed(() => props.userRole === 'chief' && props.application.status === 'under_review');

const showAssignQECButton = computed(() => props.userRole === 'chief' && props.application.status === 'under_review');

const showRegretButton = computed(() => props.userRole === 'chief' && props.application.status === 'under_review')
</script>
