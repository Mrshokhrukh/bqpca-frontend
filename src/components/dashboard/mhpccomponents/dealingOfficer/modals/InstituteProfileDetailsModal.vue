<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
          aria-hidden="true"
          @click="closeModal"
        ></div>

        <Transition name="modal-inner-fade">
          <div
            v-if="isOpen"
            class="relative flex flex-col w-full h-full max-w-5xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            <header class="flex-shrink-0 px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900" id="modal-title">
                    <span v-if="!isEditing">{{ instituteDetails.name_of_institution || 'Institute Profile' }}</span>
                    <span v-else>Editing: {{ instituteDetails.name_of_institution }}</span>
                  </h3>
                  <p class="text-sm text-gray-500">
                     {{ isEditing ? 'Update the details below.' : 'Detailed information and status overview.' }}
                  </p>
                </div>
                <button @click="closeModal" class="p-1 rounded-full text-gray-400 hover:text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                  <span class="sr-only">Close</span>
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </header>

            <main class="flex-1 flex overflow-hidden">
              <aside class="w-1/4 bg-white border-r border-gray-200 overflow-y-auto custom-scrollbar">
                <nav class="p-4 space-y-1">
                  <button v-for="(tab, index) in tabs" :key="index" @click="activeTab = index" class="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md focus:outline-none transition-colors"
                    :class="[activeTab === index ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900', isEditing ? 'cursor-not-allowed opacity-60' : '']" :disabled="isEditing">
                    <component :is="tab.icon" class="h-5 w-5 mr-3 flex-shrink-0" />
                    <span class="truncate">{{ tab.name }}</span>
                  </button>
                </nav>
              </aside>

              <div class="flex-1 p-6 overflow-y-auto custom-scrollbar">
                <div v-if="instituteDetails">
                  <!-- All the template code for tabs remains here... -->
                  <!-- For example, the Basic Information tab: -->
                  <div v-show="activeTab === 0" class="data-section">
                    <h4 class="section-title">Basic Information</h4>
                    <div class="data-grid">
                      <div class="data-item"><label class="data-label">CID</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.CID || 'N/A' }}</div><input v-else type="text" v-model="editableInstituteData.CID" class="form-input" /></div>
                      <div class="data-item"><label class="data-label">Full Name</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.full_name || 'N/A' }}</div><input v-else type="text" v-model="editableInstituteData.full_name" class="form-input" /></div>
                      <div class="data-item"><label class="data-label">Gender</label><div v-if="!isEditing" class="data-value capitalize">{{ instituteDetails.gender || 'N/A' }}</div><select v-else v-model="editableInstituteData.gender" class="form-input"><option value="male">Male</option><option value="female">Female</option><option value="others">Others</option></select></div>
                      <div class="data-item"><label class="data-label">Contact Number</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.contact_no || 'N/A' }}</div><input v-else type="text" v-model="editableInstituteData.contact_no" class="form-input" /></div>
                      <div class="data-item sm:col-span-2"><label class="data-label">Email Address</label><div v-if="!isEditing" class="data-value">{{ instituteDetails.email_address || 'N/A' }}</div><input v-else type="email" v-model="editableInstituteData.email_address" class="form-input" /></div>
                    </div>
                    <!-- ... other sections ... -->
                  </div>
                </div>
                <div v-else class="text-center py-10 text-gray-500"><p>No details available.</p></div>
              </div>
            </main>

            <footer class="flex-shrink-0 px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end items-center gap-3">
              <div v-if="!isEditing" class="flex items-center gap-3">
                  <button @click="closeModal" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">Close</button>
                  <button @click="startEditing" class="px-4 py-2 bg-blue-600 border border-transparent text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">Edit Profile</button>
              </div>
              <div v-else class="flex items-center gap-3">
                  <button @click="cancelEditing" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors">Cancel</button>
                  <button @click="saveChanges" class="px-4 py-2 bg-green-600 border border-transparent text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">Save Changes</button>
              </div>
            </footer>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, shallowRef } from 'vue';
import { UserCircleIcon, BookOpenIcon, CheckBadgeIcon, GlobeAltIcon, DocumentTextIcon, ChatBubbleBottomCenterTextIcon, EllipsisHorizontalCircleIcon } from '@heroicons/vue/24/outline';

// *** THE FIX IS HERE ***
// A child component (the modal) should NEVER import its parent.
// This line was the most likely cause of the "Maximum call stack size exceeded" error.
// By removing it, we break the infinite rendering loop.
//
// import InstituteProfiles from '../InstituteProfiles.vue'; // <-- REMOVED THIS LINE

const props = defineProps({
  isOpen: Boolean,
  instituteDetails: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['close-modal', 'save-changes']);

const activeTab = ref(0);
const isEditing = ref(false);
const editableInstituteData = ref({});

const tabs = ref([
  { name: 'Basic Information', icon: shallowRef(UserCircleIcon) },
  { name: 'Course & Program', icon: shallowRef(BookOpenIcon) },
  { name: 'Status & Review', icon: shallowRef(CheckBadgeIcon) },
  { name: 'Contact & Website', icon: shallowRef(GlobeAltIcon) },
  { name: 'Documents', icon: shallowRef(DocumentTextIcon) },
  { name: 'Summaries', icon: shallowRef(ChatBubbleBottomCenterTextIcon) },
  { name: 'Other Details', icon: shallowRef(EllipsisHorizontalCircleIcon) },
]);

const startEditing = () => {
  editableInstituteData.value = JSON.parse(JSON.stringify(props.instituteDetails));
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
};

const saveChanges = () => {
  emit('save-changes', editableInstituteData.value);
};

const closeModal = () => {
  if (isEditing.value) {
    cancelEditing();
  }
  emit('close-modal');
};

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    activeTab.value = 0;
    isEditing.value = false;
  }
});
</script>

<style scoped>
/* All styles remain the same */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-inner-fade-enter-active { transition: all 0.3s ease 0.1s; }
.modal-inner-fade-leave-active { transition: all 0.2s ease; }
.modal-inner-fade-enter-from, .modal-inner-fade-leave-to { opacity: 0; transform: scale(0.9); }
.data-section { @apply w-full; }
.section-title { @apply text-base font-semibold text-gray-800 pb-2 mb-4 border-b border-gray-200; }
.data-grid { @apply grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5; }
.data-item { @apply flex flex-col; }
.data-label { @apply text-xs font-medium text-gray-500 mb-1; }
.data-value { @apply text-sm text-gray-900 font-medium; }
.link { @apply text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline; }
.form-input {
  @apply w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
  transition duration-150 ease-in-out;
}
.capitalize {
  text-transform: capitalize;
}
</style>