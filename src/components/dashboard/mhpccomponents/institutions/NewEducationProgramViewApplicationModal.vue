<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    @click.self="close"
  >
    <div
      class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
      @click.stop
    >
      <div class="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-xl">
        <div class="flex items-center space-x-3">
          <div class="p-2 bg-blue-100 rounded-full">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-800">Application Details</h2>
            <p class="text-sm text-gray-500">
              Reviewing application #{{ application.id }}
            </p>
          </div>
        </div>
        <button @click="close" class="p-2 rounded-full text-gray-500 hover:bg-gray-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 overflow-y-auto space-y-6">
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="font-semibold text-gray-700 mb-2">Program Information</h3>
            <dl class="space-y-2 text-sm">
              <div class="flex justify-between">
                <dt class="text-gray-500">Program Title:</dt>
                <dd class="font-medium text-gray-800 text-right">{{ application.specific_program_title || 'N/A' }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-500">Institute:</dt>
                <dd class="font-medium text-gray-800 text-right">{{ application.institute?.name_of_institution || 'N/A' }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-500">Teaching Center:</dt>
                <dd class="font-medium text-gray-800 text-right">{{ teachingCenterNameProp || 'N/A' }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-500">Submission Date:</dt>
                <dd class="font-medium text-gray-800 text-right">{{ formatDate(application.created_at) }}</dd>
              </div>
            </dl>
          </div>
           <div>
            <h3 class="font-semibold text-gray-700 mb-2">Status & Payment</h3>
            <dl class="space-y-2 text-sm">
              <div class="flex justify-between items-center">
                <dt class="text-gray-500">Application Status:</dt>
                <dd><span :class="getStatusClass(application.status)">{{ application.status || 'Unknown' }}</span></dd>
              </div>
              <div class="flex justify-between items-center">
                <dt class="text-gray-500">Payment Status:</dt>
                <dd><span :class="getPaymentStatusClass(application)">{{ formatPaymentStatus(application) }}</span></dd>
              </div>
              <div v-if="application.payment_id" class="flex justify-between">
                <dt class="text-gray-500">Payment Ref:</dt>
                <dd class="font-mono text-xs bg-gray-200 px-1.5 py-0.5 rounded">{{ application.payment_id }}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Program Structure</h3>

             <div v-if="loadingAssignments" class="text-center py-8">
                <div class="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                <p class="mt-2 text-sm text-gray-500">Loading program assignments...</p>
            </div>
            <div v-else-if="assignmentError" class="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                <p><strong>Error:</strong> {{ assignmentError }}</p>
            </div>
            <div v-else-if="assignments.length === 0" class="p-3 bg-gray-50 text-gray-600 text-sm rounded-lg border">
                <p>No module or faculty assignments have been configured for this program yet.</p>
            </div>

            <div v-else class="overflow-hidden border border-gray-200 rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Semester</th>
                            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Module</th>
                            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Assigned Faculty</th>
                            <th class="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Details</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="item in assignments" :key="item.id" class="hover:bg-gray-50">
                            <td class="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{{ item.module?.semester?.name || 'N/A' }}</td>
                            <td class="px-4 py-3 text-sm text-gray-800 font-medium">
                                {{ item.module?.module_master?.module_name || 'N/A' }}
                                <div class="font-mono text-xs text-gray-500">{{ item.module?.module_master?.module_code || '' }}</div>
                            </td>
                            <td class="px-4 py-3 text-sm text-gray-800">
                                <div class="flex items-center">
                                    {{ item.faculty?.faculty_name || 'N/A' }}
                                    <span v-if="item.is_primary_instructor" class="ml-2 px-2 py-0.5 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Primary</span>
                                </div>
                            </td>
                            <td class="px-4 py-3 text-sm text-gray-600">
                                <div>{{ item.module?.student_count ?? 'N/A' }} students</div>
                                <div class="text-xs">{{ item.teaching_hours ?? 'N/A' }} hours</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import apiServices from '@/services/services';

const props = defineProps({
  isVisible: Boolean,
  application: {
    type: Object,
    required: true
  },
  teachingCenterNameProp: String
});

const emit = defineEmits(['close']);

const assignments = ref([]);
const loadingAssignments = ref(true);
const assignmentError = ref(null);

const fetchAssignments = async (programOfferedId) => {
    if (!programOfferedId) {
        assignmentError.value = "Program ID is missing.";
        loadingAssignments.value = false;
        return;
    }
    loadingAssignments.value = true;
    assignmentError.value = null;
    try {
        const params = {
            expand: 'module.semester,module.module_master,faculty',
            module__semester__program_offered: programOfferedId
        };
        const response = await apiServices.getMhpcFacultyAssignments(params);
        assignments.value = response.data.results || [];
    } catch (err) {
        console.error('Error fetching faculty assignments:', err);
        assignmentError.value = "Could not load the program's module and faculty assignments.";
    } finally {
        loadingAssignments.value = false;
    }
};

onMounted(() => {
    if (props.isVisible && props.application?.id) {
        fetchAssignments(props.application.id);
    }
});

watch(() => props.isVisible, (newVal) => {
    if (newVal && props.application?.id) {
        fetchAssignments(props.application.id);
    } else {
        assignments.value = [];
        loadingAssignments.value = true;
        assignmentError.value = null;
    }
});


const close = () => {
  emit('close');
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getStatusClass = (status) => {
  const base = 'px-2.5 py-1 rounded-full text-xs font-semibold';
  switch (status?.toLowerCase()) {
    case 'pending': return `${base} bg-yellow-100 text-yellow-800`;
    case 'approved': return `${base} bg-blue-100 text-blue-800`;
    case 'rejected': return `${base} bg-red-100 text-red-800`;
    case 'active': return `${base} bg-green-100 text-green-800`;
    default: return `${base} bg-gray-100 text-gray-800`;
  }
};

const formatPaymentStatus = (app) => {
    if (app.is_payment_complete) return 'Paid';
    if (app.status?.toLowerCase() === 'approved' && !app.is_payment_complete) return 'Payment Due';
    if (app.status?.toLowerCase() === 'active') return 'Paid';
    return 'N/A';
};

const getPaymentStatusClass = (app) => {
    const base = 'px-2.5 py-1 rounded-full text-xs font-semibold';
    if (app.is_payment_complete || app.status?.toLowerCase() === 'active') {
        return `${base} bg-green-100 text-green-800`;
    }
    if (app.status?.toLowerCase() === 'approved' && !app.is_payment_complete) {
        return `${base} bg-orange-100 text-orange-800`;
    }
    return `${base} bg-gray-100 text-gray-800`;
};

</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>