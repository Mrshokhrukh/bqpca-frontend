<!-- Child Component (modals/NonComplianceModal.vue) -->
<template>
  <TransitionRoot appear :show="isOpen" as="div">
    <Dialog as="div" @close="cancelModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-start justify-center p-4 sm:pt-12">
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
              class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-gray-50 shadow-2xl transition-all max-h-screen sm:max-h-[calc(100vh-80px)] overflow-y-auto"
            >
              <!-- Modal Header -->
              <div class="px-8 py-6 bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
                <div class="flex justify-between items-center">
                  <div>
                    <h2 class="text-2xl font-bold tracking-tight">
                      {{ editingRecord ? 'Edit Record' : 'Add New Record' }}
                    </h2>
                    <p class="mt-1 text-white/90">Non-Compliance Form</p>
                  </div>
                </div>
              </div>

              <div class="px-8 py-6 bg-white">
                <form @submit.prevent="saveRecord">
                  <div class="mb-4">
                    <label for="ecpfName" class="block text-gray-700 text-sm font-bold mb-2"
                      >ECPF Name</label
                    >
                    <select
                      v-model="formData.ecpfName"
                      id="ecpfName"
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="" disabled>Select ECPF</option>
                      <option v-for="ecpf in ecpfList" :key="ecpf" :value="ecpf">{{ ecpf }}</option>
                    </select>
                  </div>

                  <div class="mb-4" v-if="formData.ecpfName === 'Main ECPF 1'">
                    <!-- Example conditional rendering for Branch ECPF -->
                    <label for="branchEcpf" class="block text-gray-700 text-sm font-bold mb-2"
                      >Branch ECPF</label
                    >
                    <select
                      v-model="formData.branchEcpf"
                      id="branchEcpf"
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="" disabled>Select Branch (Optional)</option>
                      <option v-for="branch in branchEcpfList" :key="branch" :value="branch">
                        {{ branch }}
                      </option>
                    </select>
                  </div>

                  <div class="mb-4">
                    <label
                      for="nonComplianceDetails"
                      class="block text-gray-700 text-sm font-bold mb-2"
                      >Non-Compliance Details</label
                    >
                    <input
                      type="text"
                      id="nonComplianceDetails"
                      v-model="formData.nonComplianceDetails"
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div class="mb-4">
                    <label for="categoryOfIssue" class="block text-gray-700 text-sm font-bold mb-2"
                      >Category of Issue</label
                    >
                    <select
                      v-model="formData.categoryOfIssue"
                      id="categoryOfIssue"
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="" disabled>Select Category</option>
                      <option v-for="category in issueCategories" :key="category" :value="category">
                        {{ category }}
                      </option>
                    </select>
                  </div>

                  <div class="mb-4">
                    <label for="action" class="block text-gray-700 text-sm font-bold mb-2"
                      >Action</label
                    >
                    <select
                      v-model="formData.action"
                      id="action"
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="" disabled>Select Action</option>
                      <option v-for="action in possibleActions" :key="action" :value="action">
                        {{ action }}
                      </option>
                    </select>
                  </div>

                  <div class="mb-4">
                    <label for="actionTaken" class="block text-gray-700 text-sm font-bold mb-2"
                      >Action Taken</label
                    >
                    <select
                      v-model="formData.actionTaken"
                      id="actionTaken"
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="" disabled>Select Action Taken</option>
                      <option
                        v-for="actionTaken in actionsTaken"
                        :key="actionTaken"
                        :value="actionTaken"
                      >
                        {{ actionTaken }}
                      </option>
                    </select>
                  </div>

                  <div class="mb-4">
                    <label
                      for="correctiveMeasuresRequired"
                      class="block text-gray-700 text-sm font-bold mb-2"
                      >Corrective Measures Required</label
                    >
                    <textarea
                      id="correctiveMeasuresRequired"
                      v-model="formData.correctiveMeasuresRequired"
                      rows="3"
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    ></textarea>
                  </div>

                  <div class="mb-4">
                    <label
                      for="correctedActionReport"
                      class="block text-gray-700 text-sm font-bold mb-2"
                      >Corrected Action Report</label
                    >
                    <input
                      type="text"
                      id="correctedActionReport"
                      v-model="formData.correctedActionReport"
                      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>

                  <div class="flex justify-end">
                    <button
                      type="button"
                      @click="cancelModal"
                      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:text-sm transition-all"
                    >
                      Save Record
                    </button>
                  </div>
                </form>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { ref, reactive, watch } from 'vue'

// Props
const props = defineProps({
  isOpen: Boolean, // Expect isOpen prop from parent
  editingRecord: {
    type: Object,
    default: null, // Indicates adding a new record
  },
})

// Emits
const emit = defineEmits(['save-record', 'cancel-modal'])

// Mock Data (Move these to a more central location or fetch from API if needed)
const ecpfList = ref(['Main ECPF 1', 'ECPF 2', 'ECPF 3'])
const branchEcpfList = ref(['Branch A', 'Branch B', 'Branch C']) // Example branch list for 'Main ECPF 1'
const issueCategories = ref(['Environmental', 'Social', 'Governance', 'HR', 'Operational'])
const possibleActions = ref([
  'Warning Letter',
  'Corrective Action Plan',
  'Suspension',
  'Termination',
])
const actionsTaken = ref([
  'Issued Warning Letter',
  'Corrective Action Plan Submitted',
  'Suspension Implemented',
  'Termination Initiated',
])

// State for Form Data (Visibility is now controlled by isOpen prop)
const formData = reactive({
  ecpfName: '',
  branchEcpf: '',
  nonComplianceDetails: '',
  categoryOfIssue: '',
  action: '',
  actionTaken: '',
  correctiveMeasuresRequired: '',
  correctedActionReport: '',
})

// --- Functions ---

const resetForm = () => {
  console.log('resetForm function called')
  Object.assign(formData, {
    ecpfName: '',
    branchEcpf: '',
    nonComplianceDetails: '',
    categoryOfIssue: '',
    action: '',
    actionTaken: '',
    correctiveMeasuresRequired: '',
    correctedActionReport: '',
  })
}

const saveRecord = () => {
  emit('save-record', { ...formData }) // Emit the save event with form data
  resetForm()
  // closeModal(); // closeModal is no longer needed here, parent controls visibility
}

const cancelModal = () => {
  emit('cancel-modal') // Emit the cancel event
  resetForm()
  // closeModal(); // closeModal is no longer needed here, parent controls visibility
}

// closeModal function is removed from here, parent will handle closing by setting isOpen prop to false

// Watch for changes in the `editingRecord` prop to populate the form
watch(
  () => props.editingRecord,
  (newValue) => {
    console.log('Watch effect triggered, editingRecord:', newValue)
    if (newValue) {
      Object.assign(formData, newValue)
      // showModal.value = true; // No longer controlling internal showModal
    } else {
      console.log('Calling resetForm from watch')
      resetForm()
      // if (props.editingRecord === null && showModal.value) { // No longer controlling internal showModal
      //   showModal.value = true;
      // }
    }
  },
  { immediate: true },
)
</script>

<style scoped>
/* You can remove the scoped styles from NonComplianceModal if you are using Tailwind consistently */
</style>
