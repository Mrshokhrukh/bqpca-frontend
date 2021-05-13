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
        <div class="fixed inset-0 bg-black/60" />
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
              class="w-full max-w-3xl transform overflow-hidden rounded-xl bg-white p-6 md:p-8 text-left align-middle shadow-2xl transition-all"
            >
              <DialogTitle as="h3" class="text-xl font-semibold leading-7 text-slate-900">
                Manage Complaint: {{ localFormData.complaint_id || 'Loading...' }}
              </DialogTitle>

              <div v-if="isLoadingDetails" class="mt-6 py-10 text-center">
                <svg
                  class="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-3"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p class="text-slate-500">Loading complaint details...</p>
              </div>
              <div
                v-else-if="!localFormData.id && !isLoadingDetails"
                class="mt-6 py-10 text-center text-red-500"
              >
                Failed to load complaint details. Please try again.
              </div>

              <div v-else class="mt-6 space-y-8">
                <section aria-labelledby="complaint-details-heading">
                  <h4
                    id="complaint-details-heading"
                    class="text-base font-semibold text-slate-700 mb-3"
                  >
                    Original Complaint Details
                  </h4>
                  <div
                    class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm border border-slate-200 rounded-lg p-4"
                  >
                    <InfoItem label="Complainant" :value="localFormData.submitted_by_name" />
                    <InfoItem
                      label="Contact"
                      :value="
                        formatContactInfo(
                          localFormData.submitted_by_email,
                          localFormData.submitted_by_contact_number,
                        )
                      "
                    />
                    <InfoItem
                      label="Initially Reported Professional"
                      :value="
                        formatProfessionalInfo(
                          localFormData.professional_name,
                          localFormData.professional_designation,
                        )
                      "
                    />
                    <InfoItem
                      label="Workplace (Initially Reported)"
                      :value="localFormData.professional_workplace"
                    />
                    <InfoItem
                      label="Incident Date"
                      :value="formatModalDateTime(localFormData.incident_datetime)"
                    />
                    <InfoItem
                      label="Date Submitted"
                      :value="formatModalDateTime(localFormData.created_at)"
                    />
                    <div class="md:col-span-2">
                      <strong class="block text-slate-600 font-medium">Grievance Details:</strong>
                      <p
                        class="text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-200 max-h-40 overflow-y-auto mt-1 whitespace-pre-wrap"
                      >
                        {{ localFormData.grievance_details || 'N/A' }}
                      </p>
                    </div>
                    <div v-if="localFormData.attachment" class="md:col-span-2">
                      <strong class="block text-slate-600 font-medium">Attachment:</strong>
                      <a
                        :href="localFormData.attachment"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-indigo-600 hover:text-indigo-800 hover:underline mt-1 inline-block"
                      >
                        View Attachment
                      </a>
                    </div>
                  </div>
                </section>

                <hr class="border-slate-200" />

                <section aria-labelledby="update-section-heading" class="space-y-6">
                  <h4
                    id="update-section-heading"
                    class="text-base font-semibold text-slate-700 -mb-2"
                  >
                    Manage Complaint
                  </h4>
                  <div>
                    <label for="modal-status" class="block text-sm font-medium text-slate-700 mb-1"
                      >Update Status:</label
                    >
                    <select
                      id="modal-status"
                      v-model="localFormData.status"
                      class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5"
                    >
                      <option disabled value="">Please select a status</option>
                      <option
                        v-for="statusOpt in complaintStatuses"
                        :key="statusOpt.id || statusOpt.name || statusOpt"
                        :value="statusOpt.name || statusOpt"
                      >
                        {{ statusOpt.name || statusOpt }}
                      </option>
                    </select>
                  </div>

                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <label class="block text-sm font-medium text-slate-700"
                        >Professionals Implicated:</label
                      >
                      <button
                        type="button"
                        @click="openProfessionalPickerModal"
                        class="inline-flex items-center gap-x-1.5 px-3 py-1.5 border border-slate-300 text-sm font-medium rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          class="w-4 h-4"
                        >
                          <path
                            d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z"
                          />
                        </svg>
                        Assign Professionals
                      </button>
                    </div>

                    <div
                      v-if="
                        localFormData.implicated_professionals_list &&
                        localFormData.implicated_professionals_list.length > 0
                      "
                      class="mt-1"
                    >
                      <p class="text-xs text-slate-500 mb-1">
                        {{ localFormData.implicated_professionals_list.length }}
                        professional(s) implicated.
                      </p>
                      <ul
                        class="space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-md p-2 bg-slate-50"
                      >
                        <li
                          v-for="(
                            implicatedProf, index
                          ) in localFormData.implicated_professionals_list"
                          :key="implicatedProf.id"
                          class="flex justify-between items-center p-2 bg-white rounded-md shadow-sm text-sm"
                        >
                          <div>
                            <span class="font-medium text-slate-800">{{
                              implicatedProf.name
                            }}</span>
                            <span class="block text-xs text-slate-500"
                              >CID: {{ implicatedProf.cid || 'N/A' }} | Reg No:
                              {{ implicatedProf.registration_no || 'N/A' }}</span
                            >
                          </div>
                          <button
                            type="button"
                            @click="removeImplicatedProfessional(index)"
                            class="text-red-500 hover:text-red-700 p-1 hover:bg-red-100 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                            title="Remove from this complaint"
                            aria-label="Remove implicated professional"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              stroke-width="2"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </li>
                      </ul>
                    </div>
                    <p
                      v-else
                      class="text-sm text-slate-500 mt-1 py-3 px-3 bg-slate-50 rounded-md border border-slate-200 text-center"
                    >
                      No professionals formally implicated.
                    </p>
                  </div>

                  <div>
                    <label for="modal-remarks" class="block text-sm font-medium text-slate-700 mb-1"
                      >Internal Remarks/Notes:</label
                    >
                    <textarea
                      id="modal-remarks"
                      v-model="localFormData.remarks"
                      rows="4"
                      class="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5"
                      placeholder="Add any internal notes or actions taken..."
                    ></textarea>
                  </div>
                </section>
              </div>

              <div
                class="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3"
              >
                <button
                  type="button"
                  class="w-full sm:w-auto inline-flex justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                  @click="closeModal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  :disabled="isLoadingDetails || (!localFormData.id && !isLoadingDetails)"
                  class="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  @click="handleUpdate"
                >
                  Update Complaint
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <ProfessionalPickerModal
    :is-open="isProfessionalPickerOpen"
    :initially-selected-ids="localFormData.implicated_professionals_list.map((p) => p.id)"
    @close="isProfessionalPickerOpen = false"
    @confirm="handleProfessionalsSelected"
  />
</template>

<script setup>
import { ref, watch, reactive, computed, h } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import ProfessionalPickerModal from './ProfessionalPickerModal.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  complaint: {
    type: Object,
    default: null,
  },
  complaintStatuses: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close', 'updated'])

const getInitialFormData = () => ({
  id: null,
  complaint_id: '',
  grievance_details: '',
  professional_name: '',
  professional_designation: '',
  professional_workplace: '',
  incident_datetime: null,
  created_at: null,
  attachment: null,
  submitted_by_name: '',
  submitted_by_email: '',
  submitted_by_contact_number: '',
  professional_category_name: '',
  status: '',
  remarks: '',
  implicated_professionals_list: [],
})

const localFormData = reactive(getInitialFormData())
const isProfessionalPickerOpen = ref(false)

const isLoadingDetails = computed(() => props.isOpen && !props.complaint?.id)

watch(
  () => props.complaint,
  (newComplaint) => {
    Object.assign(localFormData, getInitialFormData())

    if (newComplaint && typeof newComplaint === 'object' && newComplaint.id) {
      localFormData.id = newComplaint.id
      localFormData.complaint_id = newComplaint.complaint_id || ''
      localFormData.grievance_details = newComplaint.grievance_details || ''
      localFormData.professional_name = newComplaint.professional_name || ''
      localFormData.professional_designation = newComplaint.professional_designation || ''
      localFormData.professional_workplace = newComplaint.professional_workplace || ''
      localFormData.incident_datetime = newComplaint.incident_datetime || null
      localFormData.created_at = newComplaint.created_at || null
      localFormData.attachment = newComplaint.attachment || null
      localFormData.submitted_by_name = newComplaint.submitted_by_name || ''
      localFormData.submitted_by_email = newComplaint.submitted_by_email || ''
      localFormData.submitted_by_contact_number = newComplaint.submitted_by_contact_number || ''
      localFormData.professional_category_name = newComplaint.professional_category_name || ''
      localFormData.status = newComplaint.status || ''
      localFormData.remarks = newComplaint.remarks || ''
      localFormData.implicated_professionals_list = Array.isArray(
        newComplaint.implicated_professionals,
      )
        ? newComplaint.implicated_professionals.map((p) => ({ ...p })) // Ensure deep copy of objects
        : []
    }
  },
  { immediate: true, deep: true },
)

const openProfessionalPickerModal = () => {
  isProfessionalPickerOpen.value = true
}

const handleProfessionalsSelected = (selectedProfessionals) => {
  localFormData.implicated_professionals_list = selectedProfessionals.map((p) => ({ ...p }))
  isProfessionalPickerOpen.value = false
}

const removeImplicatedProfessional = (index) => {
  localFormData.implicated_professionals_list.splice(index, 1)
}

const closeModal = () => {
  emit('close')
  isProfessionalPickerOpen.value = false // Ensure picker is also closed
}

const handleUpdate = () => {
  if (!localFormData.id) {
    console.error('Cannot update: Complaint ID is missing.')
    return
  }
  const updatePayload = {
    id: localFormData.id,
    status: localFormData.status,
    remarks: localFormData.remarks,
    implicated_professional_ids: localFormData.implicated_professionals_list.map((p) => p.id),
  }
  emit('updated', updatePayload)
}

const formatModalDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    return 'Invalid Date'
  }
  try {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  } catch (e) {
    console.error('Error formatting date:', e)
    return 'Date Error'
  }
}

const formatContactInfo = (email, phone) => {
  const parts = []
  if (email && email !== 'N/A') parts.push(email)
  if (phone && phone !== 'N/A') parts.push(phone)
  return parts.join(' | ') || 'N/A'
}

const formatProfessionalInfo = (name, designation) => {
  if (!name || name === 'N/A') return 'N/A'
  let info = name
  if (designation && designation !== 'N/A') {
    info += ` (${designation})`
  }
  return info
}

const InfoItem = (props) => {
  const value = props.value
  if (value && value !== 'N/A' && value.trim() !== '' && value.trim() !== '(N/A)') {
    return h('div', [
      h('strong', { class: 'block text-slate-600 font-medium' }, props.label + ':'),
      h('p', { class: 'text-slate-700 mt-0.5' }, value),
    ])
  }
  return null
}
InfoItem.props = ['label', 'value']
</script>

<style scoped>
.max-h-40 {
  max-height: 10rem;
}
.max-h-48 {
  max-height: 12rem;
}
.z-index-modal {
  z-index: 990; /* Adjust z-index for modal */
}
</style>
