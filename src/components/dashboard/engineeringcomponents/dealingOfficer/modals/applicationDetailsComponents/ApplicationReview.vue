<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div class="p-6">
      <div class="flex items-center justify-between">
        <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
          <ClipboardCheck class="h-5 w-5 text-gray-500" />
          <span>Application Review Status</span>
        </h4>
        <button v-if="!isEditing" @click="startEditing" class="text-blue-600 hover:text-blue-800">
          <Pencil class="h-4 w-4" />
        </button>
        <div v-else>
          <button @click="saveChanges" class="text-green-600 hover:text-green-800 mr-2">
            <Check class="h-4 w-4" />
          </button>
          <button @click="cancelEditing" class="text-gray-600 hover:text-gray-800">
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6" v-if="!isEditing">
        <!-- Application Review (Display) -->
        <div class="space-y-2">
          <h6 class="text-sm font-medium text-gray-700">Document Review</h6>
          <div class="flex items-center space-x-2">
            <span :class="['w-2 h-2 rounded-full', getStatusClass(editableData.application_review_status)]"></span>
            <span class="text-sm text-gray-600">{{ editableData.application_review_status }}</span>
          </div>
          <p v-if="editableData.application_review_remark" class="text-sm text-gray-500 mt-1">
            {{ editableData.application_review_remark }}
          </p>
        </div>

        <!-- Physical Review (Display) -->
        <div class="space-y-2">
          <h6 class="text-sm font-medium text-gray-700">Physical Verification</h6>
          <div class="flex items-center space-x-2">
            <span :class="['w-2 h-2 rounded-full', getStatusClass(editableData.physical_review_status)]"></span>
            <span class="text-sm text-gray-600">{{ editableData.physical_review_status }}</span>
          </div>
          <p v-if="editableData.physical_review_remark" class="text-sm text-gray-500 mt-1">
            {{ editableData.physical_review_remark }}
          </p>
        </div>

        <!-- Endorsement (Display) -->
        <div class="space-y-2">
          <h6 class="text-sm font-medium text-gray-700">Final Endorsement</h6>
          <div class="flex items-center space-x-2">
            <span :class="['w-2 h-2 rounded-full', getStatusClass(editableData.endorsement_decision)]"></span>
            <span class="text-sm text-gray-600">{{ editableData.endorsement_decision }}</span>
          </div>
          <p v-if="editableData.endorsement_remarks" class="text-sm text-gray-500 mt-1">
            {{ editableData.endorsement_remarks }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6" v-else>
        <!-- Application Review -->
        <div class="space-y-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <h5 class="font-medium text-gray-900 mb-3">Document Review</h5>
            <select v-model="editableData.application_review_status"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="Pending">Pending Review</option>
              <option value="Approved">Approve Documents</option>
              <option value="Regretted">Regret Documents</option>
            </select>
            <textarea v-if="editableData.application_review_status === 'Regretted'"
              v-model="editableData.application_review_remark" placeholder="Provide rejection reason..."
              class="mt-3 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"></textarea>
          </div>
        </div>

        <!-- Physical Review -->
        <div class="space-y-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <h5 class="font-medium text-gray-900 mb-3">Physical Verification</h5>
            <select v-model="editableData.physical_review_status"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="Pending">Pending Verification</option>
              <option value="Approved">Verify Documents</option>
              <option value="Regretted">Regret Verification</option>
            </select>
            <textarea v-if="editableData.physical_review_status === 'Regretted'"
              v-model="editableData.physical_review_remark" placeholder="Provide rejection reason..."
              class="mt-3 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"></textarea>
          </div>
        </div>

        <!-- Endorsement -->
        <div class="space-y-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <h5 class="font-medium text-gray-900 mb-3">Final Endorsement</h5>
            <select v-model="editableData.endorsement_decision"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="Pending">Pending Decision</option>
              <option value="Approved">Endorse Application</option>
              <option value="Regretted">Regret Application</option>
            </select>
            <textarea v-if="editableData.endorsement_decision === 'Regretted'"
              v-model="editableData.endorsement_remarks" placeholder="Provide rejection reason..."
              class="mt-3 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"></textarea>
          </div>
        </div>
      </div>
      <div v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { ClipboardCheck, Pencil, Check, X } from 'lucide-vue-next'
import apiServices from '@/services/services'
import isEqual from 'lodash/isEqual';

const props = defineProps({
  qualification: {
    type: Object,
    required: true,
  },
  applicationId: {
    type: Number, // Add applicationId prop
    required: true,
  },
})

const emit = defineEmits(['update'])

const isEditing = ref(false)
const editableData = ref({})
const originalData = ref({})
const errorMessage = ref('')


onMounted(() => {
  originalData.value = JSON.parse(JSON.stringify(props.qualification));
  editableData.value = { ...props.qualification };
});

watch(() => props.qualification, (newVal) => {
  originalData.value = JSON.parse(JSON.stringify(newVal))
  editableData.value = { ...newVal }
}, { deep: true })

const startEditing = () => {
  isEditing.value = true
  editableData.value = { ...originalData.value } // Copy original
}

const cancelEditing = () => {
  isEditing.value = false
  editableData.value = { ...originalData.value } // Reset
  errorMessage.value = ''
}

const saveChanges = async () => {
  errorMessage.value = '';
  if (!props.qualification.id) {
    console.error("Qualification ID is missing.");
    errorMessage.value = "Qualification details are missing.";
    return;
  }
  const changedFields = {};
  for (const key in editableData.value) {
    if (!isEqual(editableData.value[key], originalData.value[key])) {
      changedFields[key] = editableData.value[key];
    }
  }

  if (Object.keys(changedFields).length === 0) {
    isEditing.value = false;
    return;
  }

  try {
    const formData = new FormData();
    for (const key in changedFields) {
      if (Object.prototype.hasOwnProperty.call(changedFields, key)) {
        const value = changedFields[key];
        formData.append(key, value === null || value === undefined ? '' : value);
      }
    }

    await apiServices.patchEpcNewQualification(props.qualification.id, formData);
    originalData.value = JSON.parse(JSON.stringify(editableData.value));
    isEditing.value = false;
    emit('update'); // Notify parent

  } catch (error) {
    console.error("Error saving changes:", error);
    errorMessage.value = "Failed to save changes.";
  }
}

const getStatusClass = (status) => { //status class
  switch (status) {
    case 'Pending':
      return 'bg-yellow-400';
    case 'Approved':
      return 'bg-green-400';
    case 'Regretted':
      return 'bg-red-400';
    default:
      return '';
  }
};
</script>
