<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                {{ isEditing ? 'Edit HR Bio Data' : 'Add New HR Bio Data' }}
              </DialogTitle>
              <div class="mt-4">
                <form class="space-y-4">
                  <div>
                    <label for="ecpfName" class="block text-sm font-medium text-gray-700"
                      >ECPF Name</label
                    >
                    <input
                      type="text"
                      id="ecpfName"
                      v-model="formData.ecpfName"
                      disabled
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label for="branchEcpf" class="block text-sm font-medium text-gray-700"
                      >Branch ECPF</label
                    >
                    <select
                      id="branchEcpf"
                      v-model="formData.branchEcpf"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">-- Select Branch (if applicable) --</option>
                      <option value="Branch 1">Branch 1</option>
                      <option value="Branch 2">Branch 2</option>
                      <!-- Populate branch options dynamically -->
                    </select>
                  </div>
                  <div>
                    <label for="position" class="block text-sm font-medium text-gray-700"
                      >Position</label
                    >
                    <select
                      id="position"
                      v-model="formData.position"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">-- Select Position --</option>
                      <option value="Counselor">Counselor</option>
                      <option value="HR">HR</option>
                      <option value="Admin">Admin</option>
                      <!-- Populate position options from master -->
                    </select>
                  </div>
                  <div>
                    <label for="cid" class="block text-sm font-medium text-gray-700">CID</label>
                    <input
                      type="text"
                      id="cid"
                      v-model="formData.cid"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label for="fullName" class="block text-sm font-medium text-gray-700"
                      >Full Name</label
                    >
                    <input
                      type="text"
                      id="fullName"
                      v-model="formData.fullName"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label for="dateOfBirth" class="block text-sm font-medium text-gray-700"
                      >Date of Birth</label
                    >
                    <input
                      type="date"
                      id="dateOfBirth"
                      v-model="formData.dateOfBirth"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label for="qualification" class="block text-sm font-medium text-gray-700"
                      >Qualification</label
                    >
                    <select
                      id="qualification"
                      v-model="formData.qualification"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="">-- Select Qualification --</option>
                      <option value="Masters">Masters</option>
                      <option value="Bachelors">Bachelors</option>
                      <option value="Diploma">Diploma</option>
                      <!-- Populate qualification options from master -->
                    </select>
                  </div>
                  <div>
                    <label for="contactNumber" class="block text-sm font-medium text-gray-700"
                      >Contact Number</label
                    >
                    <input
                      type="number"
                      id="contactNumber"
                      v-model="formData.contactNumber"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label for="emailAddress" class="block text-sm font-medium text-gray-700"
                      >Email Address</label
                    >
                    <input
                      type="email"
                      id="emailAddress"
                      v-model="formData.emailAddress"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label for="cvCertificates" class="block text-sm font-medium text-gray-700"
                      >CV & Certificates</label
                    >
                    <input
                      type="file"
                      id="cvCertificates"
                      @change="handleFileUpload"
                      class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                  </div>
                </form>
              </div>

              <div class="mt-6 flex justify-end space-x-2">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  @click="closeModal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  @click="saveHRData"
                >
                  {{ isEditing ? 'Update HR' : 'Save HR' }}
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
import { ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'

const props = defineProps({
  isOpen: Boolean,
  isEditing: Boolean, // Prop to differentiate between Add and Edit mode
  initialData: {
    // Prop to receive data for editing
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['close', 'save', 'update'])

const closeModal = () => {
  emit('close')
}

const formData = ref({
  ecpfName: 'Bhutan Counseling Center', // Auto-populated - replace with dynamic value
  branchEcpf: '',
  position: '',
  cid: '',
  fullName: '',
  dateOfBirth: '',
  qualification: '',
  contactNumber: '',
  emailAddress: '',
  cvCertificates: null, // Store file object here if needed
})

watch(
  () => props.initialData,
  (newInitialData) => {
    if (newInitialData) {
      formData.value = { ...newInitialData } // Populate form with initial data for editing
    } else {
      resetForm() // Reset form if no initial data (for adding new HR)
    }
  },
  { immediate: true },
)

const saveHRData = () => {
  if (props.isEditing) {
    console.log('Update HR Data:', formData.value)
    emit('update', formData.value) // Emit 'update' event for editing
  } else {
    console.log('Save New HR Data:', formData.value)
    emit('save', formData.value) // Emit 'save' event for adding new
  }
  closeModal()
}

const handleFileUpload = (event) => {
  formData.value.cvCertificates = event.target.files[0] // Store the uploaded file
  console.log('Uploaded file:', formData.value.cvCertificates)
}

const resetForm = () => {
  formData.value = {
    ecpfName: 'Bhutan Counseling Center', // Reset to default or empty
    branchEcpf: '',
    position: '',
    cid: '',
    fullName: '',
    dateOfBirth: '',
    qualification: '',
    contactNumber: '',
    emailAddress: '',
    cvCertificates: null,
  }
}
</script>
