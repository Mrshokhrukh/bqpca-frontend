<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                {{ isEditing ? 'Edit Student Bio Data' : 'Add New Student Bio Data' }}
              </DialogTitle>
              <div class="mt-4">
                <form class="space-y-4">
                  <div>
                    <label for="ecpfName" class="block text-sm font-medium text-gray-700">ECPF Name</label>
                    <input type="text" id="ecpfName" v-model="formData.ecpfName" disabled class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  </div>
                  <div>
                    <label for="branchEcpf" class="block text-sm font-medium text-gray-700">Branch ECPF</label>
                    <select id="branchEcpf" v-model="formData.branchEcpf" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                      <option value="">-- Select Branch (if applicable) --</option>
                      <option value="Branch 1">Branch 1</option>
                      <option value="Branch 2">Branch 2</option>
                      <!-- Populate branch options dynamically -->
                    </select>
                  </div>
                  <div>
                    <label for="institute" class="block text-sm font-medium text-gray-700">Institute/College/University</label>
                    <select id="institute" v-model="formData.institute" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                      <option value="">-- Select Institute --</option>
                      <option value="Institute A">Institute A</option>
                      <option value="Institute B">Institute B</option>
                      <!-- Populate institute options dynamically -->
                    </select>
                  </div>
                  <div>
                    <label for="cidPassport" class="block text-sm font-medium text-gray-700">CID/Passport</label>
                    <input type="text" id="cidPassport" v-model="formData.cidPassport" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  </div>
                  <div>
                    <label for="fullName" class="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" id="fullName" v-model="formData.fullName" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  </div>
                  <div>
                    <label for="dateOfBirth" class="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input type="date" id="dateOfBirth" v-model="formData.dateOfBirth" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  </div>
                  <div>
                    <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
                    <select id="gender" v-model="formData.gender" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                      <option value="">-- Select Gender --</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label for="currentOccupation" class="block text-sm font-medium text-gray-700">Current Occupation</label>
                    <input type="text" id="currentOccupation" v-model="formData.currentOccupation" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  </div>
                  <div>
                    <label for="emailAddress" class="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" id="emailAddress" v-model="formData.emailAddress" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  </div>
                  <div>
                    <label for="course" class="block text-sm font-medium text-gray-700">Course (full name)</label>
                    <input type="text" id="course" v-model="formData.course" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  </div>
                  <div>
                    <label for="programmeLevel" class="block text-sm font-medium text-gray-700">Programme Level</label>
                    <input type="text" id="programmeLevel" v-model="formData.programmeLevel" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  </div>
                  <div>
                    <label for="programmeType" class="block text-sm font-medium text-gray-700">Programme Type</label>
                    <select id="programmeType" v-model="formData.programmeType" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                      <option value="">-- Select Programme Type --</option>
                      <option value="TVET">TVET</option>
                      <option value="Higher">Higher</option>
                    </select>
                  </div>
                  <div>
                    <label for="programmeDuration" class="block text-sm font-medium text-gray-700">Programme Duration (in Year)</label>
                    <input type="number" id="programmeDuration" v-model="formData.programmeDuration" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  </div>
                  <div>
                    <label for="courseStartDate" class="block text-sm font-medium text-gray-700">Course Start Date</label>
                    <input type="date" id="courseStartDate" v-model="formData.courseStartDate" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  </div>
                  <div>
                    <label for="courseEndDate" class="block text-sm font-medium text-gray-700">Course End Date</label>
                    <input type="date" id="courseEndDate" v-model="formData.courseEndDate" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  </div>
                  <div>
                    <label for="numberOfDependent" class="block text-sm font-medium text-gray-700">Number of dependent</label>
                    <input type="number" id="numberOfDependent" v-model="formData.numberOfDependent" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  </div>
                  <div>
                    <label for="guardianContact" class="block text-sm font-medium text-gray-700">Contact of guardian [if minor only]</label>
                    <input type="number" id="guardianContact" v-model="formData.guardianContact" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  </div>
                  <div>
                    <label for="guardianEmail" class="block text-sm font-medium text-gray-700">Email of Guardian</label>
                    <input type="email" id="guardianEmail" v-model="formData.guardianEmail" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  </div>
                  <div>
                    <label for="ecpfLinkageName" class="block text-sm font-medium text-gray-700">Name of ECPF with linkage (if B2B)</label>
                    <select id="ecpfLinkageName" v-model="formData.ecpfLinkageName" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                      <option value="">-- Select ECPF Linkage (if applicable) --</option>
                      <option value="Linkage 1">Linkage 1</option>
                      <option value="Linkage 2">Linkage 2</option>
                      <!-- Populate ECPF Linkage options dynamically -->
                    </select>
                  </div>
                </form>
              </div>

              <div class="mt-6 flex justify-end space-x-2">
                <button type="button" class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" @click="closeModal">
                  Cancel
                </button>
                <button type="button" class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" @click="saveStudentData">
                  {{ isEditing ? 'Update Student' : 'Save Student' }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'

const props = defineProps({
  isOpen: Boolean,
  isEditing: Boolean, // Prop to differentiate between Add and Edit mode
  initialData: { // Prop to receive data for editing
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close', 'save', 'update']);

const closeModal = () => {
  emit('close');
};

const formData = ref({
  ecpfName: 'Bhutan Counseling Center', // Auto-populated - replace with dynamic value
  branchEcpf: '',
  institute: '',
  cidPassport: '',
  fullName: '',
  dateOfBirth: '',
  gender: '',
  currentOccupation: '',
  emailAddress: '',
  course: '',
  programmeLevel: '',
  programmeType: '',
  programmeDuration: null,
  courseStartDate: '',
  courseEndDate: '',
  numberOfDependent: null,
  guardianContact: '',
  guardianEmail: '',
  ecpfLinkageName: '',
});

watch(() => props.initialData, (newInitialData) => {
  if (newInitialData) {
    formData.value = { ...newInitialData }; // Populate form with initial data for editing
  } else {
    resetForm(); // Reset form if no initial data (for adding new Student)
  }
}, { immediate: true });

const saveStudentData = () => {
  if (props.isEditing) {
    console.log('Update Student Data:', formData.value);
    emit('update', formData.value); // Emit 'update' event for editing
  } else {
    console.log('Save New Student Data:', formData.value);
    emit('save', formData.value); // Emit 'save' event for adding new
  }
  closeModal();
};

const resetForm = () => {
  formData.value = {
    ecpfName: 'Bhutan Counseling Center', // Reset to default or empty
    branchEcpf: '',
    institute: '',
    cidPassport: '',
    fullName: '',
    dateOfBirth: '',
    gender: '',
    currentOccupation: '',
    emailAddress: '',
    course: '',
    programmeLevel: '',
    programmeType: '',
    programmeDuration: null,
    courseStartDate: '',
    courseEndDate: '',
    numberOfDependent: null,
    guardianContact: '',
    guardianEmail: '',
    ecpfLinkageName: '',
  };
};
</script>