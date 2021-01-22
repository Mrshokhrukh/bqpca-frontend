<template>
  <Transition enter-active-class="ease-out duration-300" enter-from-class="opacity-0" enter-to-class="opacity-100"
    leave-active-class="ease-in duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0">
    <div v-if="showModal" @click="handleBackdropClick"
      class="fixed z-50 inset-0 overflow-y-auto bg-gray-500/75 flex items-center justify-center sm:py-12">
      <div class="relative bg-white rounded-lg shadow-xl w-full max-w-2xl m-4" @click.stop>
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <div class="flex items-center gap-2">
            <FileTextIcon class="w-5 h-5 text-gray-600" />
            <h3 class="text-xl font-semibold text-gray-900">Remarks</h3>
          </div>
          <button @click="closeModal"
            class="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1">
            <XIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-4">
          <div v-if="chiefRemarks" class="space-y-2">
            <h4 class="text-lg font-medium text-gray-900">Chief Remarks</h4>
            <p class="text-gray-700">{{ chiefRemarks }}</p>
          </div>
          <div v-if="dealingOfficerRemarks" class="space-y-2">
            <h4 class="text-lg font-medium text-gray-900">Dealing Officer Remarks</h4>
            <p class="text-gray-700">{{ dealingOfficerRemarks }}</p>
          </div>
          <div v-if="!chiefRemarks && !dealingOfficerRemarks" class="text-center text-gray-500">
            <p>No remarks are available for this application.</p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import {
  FileText as FileTextIcon,
  X as XIcon,
} from 'lucide-vue-next';

defineProps({
  showModal: {
    type: Boolean,
    default: false,
  },
  dealingOfficerRemarks: {
    type: String,
    default: null
  },
  chiefRemarks: {
    type: String,
    default: null,
  }
});

const emit = defineEmits(['close'])


const handleBackdropClick = (event) => {
  if (event.target === event.currentTarget) {
    closeModal();
  }
};
const closeModal = () => {
  emit('close');
};
</script>
