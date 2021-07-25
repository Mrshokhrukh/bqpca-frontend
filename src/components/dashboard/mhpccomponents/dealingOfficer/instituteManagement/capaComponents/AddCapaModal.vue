<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm" @click.self="$emit('close')">
      <div class="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all">

        <div class="bg-indigo-600 px-6 py-4 text-white flex items-center justify-between">
          <h3 class="text-lg font-semibold" id="modal-title">Add New CAPA Record</h3>
          <button @click="$emit('close')" class="p-1 rounded-full hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white">
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitForm" class="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="institute" class="block text-sm font-medium text-gray-700 mb-1">Institute <span class="text-red-500">*</span></label>
              <select id="institute" v-model="selectedInstituteId" class="form-select w-full" required>
                <option disabled value="">Select an institute</option>
                <option v-for="inst in institutes" :key="inst.id" :value="inst.id">{{ inst.name_of_institution }}</option>
              </select>
            </div>
            <div>
              <label for="teaching-center" class="block text-sm font-medium text-gray-700 mb-1">Teaching Center</label>
              <select id="teaching-center" v-model="capaForm.teaching_center_id" class="form-select w-full" :disabled="!selectedInstituteId">
                <option :value="null">For Institute Only</option>
                <option v-for="tc in availableTeachingCenters" :key="tc.id" :value="tc.id">{{ tc.center_name }}</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label for="from-date" class="block text-sm font-medium text-gray-700 mb-1">Inspection From <span class="text-red-500">*</span></label>
                <input type="date" id="from-date" v-model="capaForm.inspection_from_date" class="form-input w-full" required />
             </div>
             <div>
                <label for="to-date" class="block text-sm font-medium text-gray-700 mb-1">Inspection To <span class="text-red-500">*</span></label>
                <input type="date" id="to-date" v-model="capaForm.inspection_to_date" class="form-input w-full" required />
             </div>
          </div>

          <div>
              <label for="observation" class="block text-sm font-medium text-gray-700 mb-1">Observation Description <span class="text-red-500">*</span></label>
              <textarea id="observation" v-model="capaForm.observation_description" rows="4" class="form-textarea w-full" required placeholder="Describe the observation..."></textarea>
          </div>

          <div>
              <label for="comment" class="block text-sm font-medium text-gray-700 mb-1">Management Comment</label>
              <textarea id="comment" v-model="capaForm.management_comment" rows="3" class="form-textarea w-full" placeholder="Optional management comments..."></textarea>
          </div>
        </form>

        <div class="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-3">
            <button type="button" @click="$emit('close')" class="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button type="button" @click="submitForm" class="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700">Save CAPA</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useToast } from 'vue-toastification';

const props = defineProps({
  show: Boolean,
  institutes: { type: Array, default: () => [] },
  teachingCenters: { type: Array, default: () => [] },
});
const emit = defineEmits(['close', 'save']);
const toast = useToast();

const initialFormState = {
  institute_id: null,
  teaching_center_id: null,
  inspection_from_date: '',
  inspection_to_date: '',
  observation_description: '',
  management_comment: '',
};

const capaForm = ref({ ...initialFormState });
const selectedInstituteId = ref('');

const availableTeachingCenters = computed(() => {
  if (!selectedInstituteId.value) return [];
  return props.teachingCenters.filter(tc => tc.institute_details?.id === selectedInstituteId.value);
});

watch(selectedInstituteId, (newId) => {
  capaForm.value.institute_id = newId;
  capaForm.value.teaching_center_id = null;
});

watch(() => props.show, (newVal) => {
  if (newVal) {
    capaForm.value = { ...initialFormState };
    selectedInstituteId.value = '';
  }
});


const submitForm = () => {
  if (!capaForm.value.institute_id) {
      toast.error("Please select an institute.");
      return;
  }


  const payload = { ...capaForm.value };


  if (!payload.teaching_center_id) {
    delete payload.teaching_center_id;
  }

  emit('save', payload);
};

</script>

<style scoped>
.form-input, .form-select, .form-textarea {
  @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm;
}
</style>