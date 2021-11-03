<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/30" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-gray-100 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3"
                class="flex justify-between items-center text-lg font-semibold leading-6 text-gray-900 px-6 py-4 bg-white border-b">
                Renewal Application Review (#{{ renewalData?.renewal_id }})
                <button @click="closeModal" class="p-1 rounded-full hover:bg-gray-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </DialogTitle>

              <div v-if="renewalData" class="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-1 space-y-6">
                  <div class="bg-white rounded-xl border p-4 shadow-sm">
                    <h4 class="font-semibold text-gray-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-600" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      CPD Status
                    </h4>
                    <div v-if="isCpdLoading" class="text-center p-6 text-sm text-gray-500">
                      Loading CPD data...
                    </div>
                    <div v-else class="text-center p-6 bg-blue-50 rounded-lg border">
                      <p class="text-3xl font-bold text-blue-700">
                        {{ totalCpdPoints }} <span class="text-lg font-medium">Points</span>
                      </p>
                      <p class="text-xs text-blue-600 mt-1">(Recommended: 30)</p>
                      <div class="mt-3 text-xs px-2 py-1 rounded-full inline-block font-medium"
                        :class="cpdStatus.badgeClass">
                        {{ cpdStatus.text }}
                      </div>
                    </div>
                  </div>

                  <div class="bg-white rounded-xl border p-4 shadow-sm">
                    <h4 class="font-semibold text-gray-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-orange-600" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Complaint History
                    </h4>
                    <div v-if="isComplaintsLoading" class="text-center p-6 text-sm text-gray-500">
                      Loading complaint data...
                    </div>
                    <div v-else class="text-center p-6 bg-gray-50 rounded-lg border">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto" :class="complaintStatus.iconClass"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p class="text-sm font-medium text-gray-700 mt-2">
                        {{ complaintStatus.text }}
                      </p>
                      <p class="text-xs text-gray-500 mt-1">{{ complaintStatus.subtext }}</p>
                    </div>
                  </div>

                  <div class="bg-white rounded-xl border p-4 shadow-sm">
                    <h4 class="font-semibold text-gray-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-600" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Payment Details
                    </h4>
                    <div class="space-y-2 text-sm">
                      <div>
                        <p class="text-xs text-gray-500">Payment Status</p>
                        <p class="font-semibold capitalize" :class="paymentStatusDisplay.class">{{
                          paymentStatusDisplay.text }}</p>
                      </div>
                      <div v-if="renewalData.payment_id">
                        <p class="text-xs text-gray-500">Payment ID</p>
                        <p class="font-medium text-gray-800">{{ renewalData.payment_id }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- <div class="bg-white rounded-xl border p-4 shadow-sm">
                    <h4 class="font-semibold text-gray-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Payment Details
                    </h4>
                    <div class="space-y-2 text-sm">
                      <div>
                        <p class="text-xs text-gray-500">Payment Status</p>
                        <p class="font-semibold capitalize" :class="paymentStatusDisplay.class">{{ paymentStatusDisplay.text }}</p>
                      </div>
                      <div v-if="renewalData.payment_id">
                        <p class="text-xs text-gray-500">Payment ID</p>
                        <p class="font-medium text-gray-800">{{ renewalData.payment_id }}</p>
                      </div>
                    </div>
                  </div> -->

                  <div v-if="renewalData.is_counselor" class="bg-white rounded-xl border p-4 shadow-sm">
                    <h4 class="font-semibold text-gray-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-purple-600" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Supervision Status
                    </h4>
                    <div v-if="isSupervisionLoading" class="text-center p-6 text-sm text-gray-500">
                      Loading supervision data...
                    </div>
                    <div v-else class="text-center p-6 bg-gray-50 rounded-lg border">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto"
                        :class="supervisionStatus.iconClass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p class="text-sm font-medium text-gray-700 mt-2">
                        {{ supervisionStatus.text }}
                      </p>
                      <p class="text-xs text-gray-500 mt-1">{{ supervisionStatus.subtext }}</p>
                    </div>
                  </div>
                </div>

                <div class="lg:col-span-2 space-y-6">
                  <div class="bg-white rounded-xl border p-4 shadow-sm">
                    <h4 class="font-semibold text-gray-800 mb-4">Original Registration Details</h4>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p class="text-xs text-gray-500">Full Name</p>
                        <p class="font-medium text-gray-800">{{ renewalData.full_name }}</p>
                      </div>
                      <!-- <div>
                        <p class="text-xs text-gray-500">CID No.</p>
                        <p class="font-medium text-gray-800">{{ renewalData.cid_no }}</p>
                      </div> -->
                      <div>
                        <p class="text-xs text-gray-500">Reg. No.</p>
                        <p class="font-medium text-gray-800">{{ renewalData.registration_no }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Qualification</p>
                        <p class="font-medium text-gray-800">
                          {{
                            renewalData.original_qualification?.qualification_name_display || 'N/A'
                          }}
                        </p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Original Expiry</p>
                        <p class="font-medium text-red-600">
                          {{ formatDate(renewalData.original_expiry_date) }}
                        </p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Proposed New Expiry</p>
                        <p class="font-medium text-green-600">
                          {{ formatDate(renewalData.proposed_expiry_date) }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="bg-white rounded-xl border p-4 shadow-sm">
                    <h4 class="font-semibold text-gray-800 mb-4">Process Renewal Application</h4>
                    <form @submit.prevent="submitRenewalUpdate" class="space-y-4">
                      <div>
                        <label for="renewal_status" class="block text-sm font-medium text-gray-700">Decision
                          Status</label>
                        <select id="renewal_status" v-model="form.renewal_status"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                          <option value="PENDING">Pending</option>
                          <option value="APPROVED">Approve</option>
                          <option value="REJECTED">Reject</option>
                        </select>
                      </div>
                      <div>
                        <label for="renewal_remarks" class="block text-sm font-medium text-gray-700">Remarks</label>
                        <textarea id="renewal_remarks" v-model="form.renewal_remarks" rows="3"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Add remarks for your decision..."></textarea>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div class="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
                <button type="button" @click="closeModal"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Cancel
                </button>
                <button type="button" @click="submitRenewalUpdate" :disabled="isSubmitting"
                  title="cannot submit when Decision Status is approved"
                  class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center shadow-sm">
                  <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  {{ isSubmitting ? 'Processing...' : 'Submit Decision' }}
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
import { ref, watch, computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import apiServices from '@/services/services'
import { useToast } from 'vue-toastification'
import dayjs from 'dayjs'

const props = defineProps({
  isOpen: Boolean,
  renewalData: Object,
})


const emit = defineEmits(['close', 'update'])

const toast = useToast()
const isSubmitting = ref(false)

const form = ref({
  renewal_status: 'PENDING',
  renewal_remarks: '',
})

// --- NEW STATE for decision support panels ---
const cpdRecords = ref([])
const isCpdLoading = ref(false)
const complaints = ref([])
const isComplaintsLoading = ref(false)
const supervisionRecords = ref([])
const isSupervisionLoading = ref(false)

// --- NEW COMPUTED aProperties for status display ---
const totalCpdPoints = computed(() =>
  cpdRecords.value.reduce((total, record) => total + (record.cpd_credit || 0), 0),
)
const cpdStatus = computed(() => {
  if (totalCpdPoints.value >= 30)
    return { text: 'Requirement Met', badgeClass: 'bg-green-100 text-green-800' }
  return { text: 'Below Recommended', badgeClass: 'bg-yellow-100 text-yellow-800' }
})

const complaintStatus = computed(() => {
  const hasUnresolved = complaints.value.some((c) => c.status !== 'Resolved')
  if (hasUnresolved)
    return {
      text: 'Unresolved Complaints!',
      subtext: 'Renewal should be blocked.',
      iconClass: 'text-red-500',
    }
  return {
    text: 'No Unresolved Complaints',
    subtext: 'Applicant is clear to proceed.',
    iconClass: 'text-green-500',
  }
})

const supervisionStatus = computed(() => {
  const hasApproved = supervisionRecords.value.some((s) => s.status === 'Approved')
  if (hasApproved)
    return {
      text: 'Supervision Approved',
      subtext: 'Requirement met.',
      iconClass: 'text-green-500',
    }
  return {
    text: 'No Approved Supervision',
    subtext: 'Requirement not met.',
    iconClass: 'text-red-500',
  }
})

const paymentStatusDisplay = computed(() => {
  const status = props.renewalData?.payment_status;
  switch (status) {
    case 'completed':
      return { text: 'Paid', class: 'text-green-700' };
    case 'pending':
      return { text: 'Pending', class: 'text-yellow-700' };
    case 'failed':
      return { text: 'Failed', class: 'text-red-700' };
    case 'processing_payment':
      return { text: 'Processing', class: 'text-blue-700' };
    default:
      return { text: 'N/A', class: 'text-gray-700' };
  }
});

// --- NEW FETCH Functions ---
const fetchDecisionSupportData = async (cid, isCounselor) => {
  isCpdLoading.value = true
  isComplaintsLoading.value = true
  if (isCounselor) isSupervisionLoading.value = true

  // Static/Demo data as per your reference component
  const cpdPromise = new Promise((resolve) =>
    setTimeout(() => {
      cpdRecords.value = [{ cpd_credit: 25 }, { cpd_credit: 10 }]
      isCpdLoading.value = false
      resolve()
    }, 500),
  )

  const complaintsPromise = new Promise((resolve) =>
    setTimeout(() => {
      complaints.value = [{ status: 'Resolved' }]
      isComplaintsLoading.value = false
      resolve()
    }, 700),
  )

  const promises = [cpdPromise, complaintsPromise]

  if (isCounselor) {
    const supervisionPromise = new Promise((resolve) =>
      setTimeout(() => {
        supervisionRecords.value = [{ status: 'Approved' }]
        isSupervisionLoading.value = false
        resolve()
      }, 600),
    )
    promises.push(supervisionPromise)
  }

  await Promise.all(promises)
}

// --- MODIFIED WATCHER to trigger new data fetching ---
watch(
  () => props.renewalData,
  (newData) => {
    if (newData) {
      // Populate form
      form.value.renewal_status = newData.renewal_status || 'PENDING'
      form.value.renewal_remarks = newData.renewal_remarks || ''

      // Fetch related data for the decision support panels
      fetchDecisionSupportData(newData.cid_no, newData.is_counselor)
    }
  },
  { immediate: true },
)

// --- Existing functions (submit, close, format) are fine ---
const closeModal = () => {
  if (!isSubmitting.value) emit('close')
}
const formatDate = (dateString) => (dateString ? dayjs(dateString).format('MMM D, YYYY') : 'N/A')

const submitRenewalUpdate = async () => {
  if (!props.renewalData?.renewal_id) {
    toast.error('Cannot process: Renewal ID is missing.')
    return
  }
  if (form.value.renewal_status === 'PENDING') {
    toast.warning('Please select a decision (Approve/Reject) to submit.')
    return
  }

  isSubmitting.value = true
  try {
    const payload = {
      renewal_status: form.value.renewal_status,
      renewal_remarks: form.value.renewal_remarks,
    }

    await apiServices.patchMhpcRenewal(props.renewalData.renewal_id, payload)
    emit('update')
  } catch (error) {
    console.error('Error updating renewal:', error)
    const errorMsg = error.response?.data
      ? JSON.stringify(error.response.data)
      : 'An unknown error occurred.'
    toast.error(`Update failed: ${errorMsg}`)
  } finally {
    isSubmitting.value = false
  }
}
</script>
