<template>
  <div class="w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
    <PageHeader
      title="EPC Renewal Application"
      subtitle="Please review your personal details and other requirements to ensure your eligibility for renewal."
    >
      <template #icon>
        <RefreshCw class="w-6 h-6 text-indigo-600" />
      </template>
    </PageHeader>

    <div
      v-if="hasRenewalInProgress"
      class="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-5 sm:p-6 mb-8 rounded-xl shadow-sm"
    >
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <AlertCircle class="h-6 w-6 text-blue-500" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <h3 class="text-base sm:text-lg font-medium text-blue-800">
            Renewal Application In Progress
          </h3>
          <div class="mt-2 text-sm sm:text-base text-blue-700">
            <p>
              You already have a renewal application under review by our staff. You can track the
              status of your application in the "My Applications" section.
            </p>
          </div>
          <div class="mt-4 sm:mt-6">
            <router-link
              to="/admin/user/engineering_certification/dashboard"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
            >
              <ClipboardList class="h-4 w-4 mr-2" />
              View Dashboard
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div v-if="isLoading" class="text-center py-8 sm:py-10">
        <div class="flex justify-center items-center">
          <Loader class="h-10 w-10 sm:h-12 sm:w-12 text-blue-500 animate-spin" />
        </div>
        <p class="mt-4 text-gray-600">Loading your application data...</p>
      </div>

      <div
        v-else-if="loadError"
        class="bg-red-50 border border-red-200 rounded-xl p-5 sm:p-6 my-6 shadow-sm"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <AlertTriangle class="h-6 w-6 text-red-400" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error Loading Data</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ loadError }}</p>
            </div>
            <div class="mt-4">
              <button
                type="button"
                @click="fetchApplicationData"
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
              >
                <RefreshCw class="h-4 w-4 mr-1.5" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else-if="!isEligibleForRenewal && !isLoading"
        class="bg-yellow-50 border border-yellow-200 rounded-xl p-5 sm:p-6 mb-8 shadow-sm"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <AlertCircle class="h-6 w-6 text-yellow-500" />
          </div>
          <div class="ml-3">
            <h3 class="text-base font-medium text-yellow-800">Renewal Not Eligible</h3>
            <div class="mt-2 text-sm text-yellow-700">
              <p>{{ renewalEligibilityMessage }}</p>
              <p class="mt-2">
                Renewal is allowed if your qualification:
              </p>
              <ul class="list-disc ml-5 mt-2 space-y-1">
                <li>Expires within the next 3 months.</li>
                <li>Has already expired.</li>
              </ul>
            </div>
            <div class="mt-4">
              <button
                type="button"
                @click="handleCancel"
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200"
              >
                <ArrowLeft class="h-4 w-4 mr-1.5" />
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div
          class="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-5 sm:p-6 rounded-t-xl"
        >
          <div class="flex items-center space-x-2">
            <User class="h-5 w-5 text-blue-600" />
            <h3 class="text-base sm:text-lg font-semibold text-gray-900">Personal Details</h3>
          </div>
          <p class="mt-1 text-xs sm:text-sm text-gray-500 ml-7">
            Verify your personal information.
          </p>
        </div>
        <div class="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">CID No.</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCard class="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                v-model="formData.cid"
                disabled
                class="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Full Name</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User class="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                v-model="formData.full_name"
                disabled
                class="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Gender</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users class="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                v-model="formData.gender"
                disabled
                class="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar class="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                :value="formatDisplayDate(formData.date_of_birth)"
                disabled
                class="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Contact Number</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone class="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                v-model="formData.contact_number"
                disabled
                class="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
              />
            </div>
          </div>
          <div v-if="formData.email">
            <label class="block text-sm font-medium text-gray-700">Email Address</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail class="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                v-model="formData.email"
                disabled
                class="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Village</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Home class="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                v-model="formData.permanent_village"
                disabled
                class="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Gewog</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin class="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                v-model="formData.permanent_gewog"
                disabled
                class="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Dzongkhag</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Map class="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                v-model="formData.permanent_dzongkhag"
                disabled
                class="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
              />
            </div>
          </div>
          <div class="col-span-1 md:col-span-1">
            <div
              :class="[
                'rounded-lg p-4 sm:p-5 border',
                hasExpired
                  ? 'bg-red-50 border-red-200'
                  : isExpiringWithin3Months
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-blue-50 border-blue-200',
              ]"
            >
              <div class="flex items-center">
                <div
                  :class="[
                    'rounded-full p-1.5 mr-2',
                    hasExpired
                      ? 'bg-red-100'
                      : isExpiringWithin3Months
                      ? 'bg-yellow-100'
                      : 'bg-blue-100',
                  ]"
                >
                  <Clock
                    class="h-5 w-5"
                    :class="[
                      hasExpired
                        ? 'text-red-600'
                        : isExpiringWithin3Months
                        ? 'text-yellow-600'
                        : 'text-blue-600',
                    ]"
                  />
                </div>
                <span
                  :class="[
                    'text-sm font-medium',
                    hasExpired
                      ? 'text-red-900'
                      : isExpiringWithin3Months
                      ? 'text-yellow-900'
                      : 'text-blue-900',
                  ]"
                  >Qualification Information</span
                >
              </div>
              <div class="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <div
                    :class="[
                      'text-xs sm:text-sm',
                      hasExpired
                        ? 'text-red-700'
                        : isExpiringWithin3Months
                        ? 'text-yellow-700'
                        : 'text-blue-700',
                    ]"
                  >
                    Registration Date
                  </div>
                  <div
                    :class="[
                      'text-xs sm:text-sm font-medium',
                      hasExpired
                        ? 'text-red-900'
                        : isExpiringWithin3Months
                        ? 'text-yellow-900'
                        : 'text-blue-900',
                    ]"
                  >
                    {{ formatDisplayDate(registrationDetails.registration_date) }}
                  </div>
                </div>
                <div>
                  <div
                    :class="[
                      'text-xs sm:text-sm',
                      hasExpired
                        ? 'text-red-700'
                        : isExpiringWithin3Months
                        ? 'text-yellow-700'
                        : 'text-blue-700',
                    ]"
                  >
                    Expiry Date
                  </div>
                  <div class="flex items-center">
                    <div
                      :class="[
                        'text-xs sm:text-sm font-medium',
                        hasExpired
                          ? 'text-red-900'
                          : isExpiringWithin3Months
                          ? 'text-yellow-900'
                          : 'text-blue-900',
                      ]"
                    >
                      {{ formatDisplayDate(registrationDetails.expiry_date) }}
                    </div>
                    <span
                      v-if="hasExpired"
                      class="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full flex items-center"
                      ><AlertOctagon class="h-3 w-3 mr-1" />Expired</span
                    >
                    <span
                      v-else-if="isExpiringWithin3Months"
                      class="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full flex items-center"
                      ><Clock class="h-3 w-3 mr-1" />Expiring Soon</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-span-1 md:col-span-1">
            <div
              class="rounded-lg p-4 sm:p-5 border"
              :class="
                formData.is_active
                  ? 'bg-green-50 border-green-200'
                  : 'bg-yellow-50 border-yellow-200'
              "
            >
              <div class="flex items-center">
                <div
                  :class="[
                    'rounded-full p-1.5 mr-2',
                    formData.is_active ? 'bg-green-100' : 'bg-yellow-100',
                  ]"
                >
                  <Tag
                    class="h-5 w-5"
                    :class="formData.is_active ? 'text-green-600' : 'text-yellow-600'"
                  />
                </div>
                <span
                  class="text-sm font-medium"
                  :class="formData.is_active ? 'text-green-900' : 'text-yellow-900'"
                  >Registration Status</span
                >
              </div>
              <div class="mt-3">
                <div class="flex items-center">
                  <span
                    :class="[
                      'py-1 px-2 text-xs rounded-md font-medium',
                      formData.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800',
                    ]"
                    >{{ formData.is_active ? 'Active' : 'Inactive' }}</span
                  >
                  <span
                    class="ml-2 text-xs"
                    :class="formData.is_active ? 'text-green-700' : 'text-yellow-700'"
                    >{{
                      formData.is_active
                        ? 'Your registration is currently active'
                        : 'Your registration needs to be renewed or reactivated'
                    }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>



        <div v-if="!isSubmitting && !isProcessingPayment">
          <div
            class="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-5 sm:p-6"
          >
            <div class="flex items-center space-x-2">
              <RefreshCw class="h-5 w-5 text-blue-600" />
              <h3 class="text-base sm:text-lg font-semibold text-gray-900">Renewal Confirmation</h3>
            </div>
            <p class="mt-1 text-xs sm:text-sm text-gray-500 ml-7">
              Confirm your application details and submit for renewal.
            </p>
            <div class="mt-5 p-4 sm:p-5 rounded-lg bg-white border shadow-sm">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  class="flex flex-col items-center p-4 rounded-lg bg-blue-50 border border-blue-100"
                >
                  <Calendar class="h-6 w-6 text-blue-600 mb-2" />
                  <p class="text-xs text-gray-500">Current Expiry</p>
                  <p class="font-medium text-sm">{{ formatDisplayDate(registrationDetails.expiry_date) }}</p>
                </div>
                <div
                  class="flex flex-col items-center p-4 rounded-lg bg-blue-50 border border-blue-100"
                >
                  <ArrowRight class="h-6 w-6 text-blue-600 mb-2" />
                  <p class="text-xs text-gray-500">New Expiry (Projected)</p>
                  <p class="font-medium text-sm">{{ formatDisplayDate(getNewExpiryDate) }}</p>
                </div>
                <div
                  class="flex flex-col items-center p-4 rounded-lg bg-blue-50 border border-blue-100"
                >
                  <Clock class="h-6 w-6 text-blue-600 mb-2" />
                  <p class="text-xs text-gray-500">Extension Period</p>
                  <p class="font-medium text-sm">12 Months</p>
                </div>
              </div>
              <div class="mt-4 p-3 rounded-lg border border-blue-100 bg-blue-50">
                <div class="flex">
                  <AlertCircle class="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                  <p class="text-xs text-blue-700">
                    By submitting this renewal application, your qualification will be extended for
                    12 months upon approval (new projected expiry date shown above).
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-5">
              <label class="block text-sm font-medium text-gray-700">Remarks (Optional)</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div
                  class="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none"
                >
                  <MessageSquare class="h-4 w-4 text-gray-400" />
                </div>
                <textarea
                  v-model="remarks"
                  rows="3"
                  class="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                  placeholder="Enter any additional information or remarks for your renewal application"
                ></textarea>
              </div>
            </div>
            <div class="mt-6">
              <div class="flex items-start space-x-3 bg-white p-4 rounded-lg border shadow-sm">
                <div class="flex items-center h-5 mt-0.5">
                  <input
                    type="checkbox"
                    id="declaration"
                    v-model="declaration"
                    class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </div>
                <label for="declaration" class="text-sm text-gray-700"
                  >I hereby declare that all the information provided is true and correct to the
                  best of my knowledge. I understand that any false statements may result in the
                  rejection of my renewal application.</label
                >
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-4 p-5 sm:p-6 bg-gray-50 border-t">
            <button
              @click="handleCancel"
              :disabled="isSubmitting || isProcessingPayment"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <X class="h-4 w-4 mr-1.5" />
              Cancel
            </button>
            <button
              @click="handleSubmit"
              :disabled="
                isSubmitting || isProcessingPayment || !declaration || !isEligibleForRenewal
              "
              class="px-4 py-2 bg-blue-600 text-sm font-medium text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Check class="h-4 w-4 mr-1.5" />
              Submit Renewal
            </button>
          </div>
        </div>

        <div v-else class="border-t border-gray-200 bg-gray-50 p-5 sm:p-6 text-center">
          <div class="inline-block">
            <Loader class="h-10 w-10 text-blue-500 animate-spin" />
          </div>
          <p class="mt-4 text-gray-700">
            {{
              isProcessingPayment
                ? 'Processing payment...'
                : 'Submitting your renewal application...'
            }}
          </p>
        </div>
      </div>

      <Dialog :open="showConfirmation" @close="showConfirmation = false" class="relative z-50">
        <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div class="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div class="text-center">
              <div
                class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100"
              >
                <RefreshCw class="h-6 w-6 text-blue-600" />
              </div>
              <DialogTitle as="h3" class="text-lg font-medium text-gray-900 mt-4"
                >Confirm Renewal Application</DialogTitle
              >
              <div class="mt-3">
                <p class="text-sm text-gray-500">
                  You are about to submit your renewal application. This action cannot be undone.
                  Are you sure you want to proceed?
                </p>
                <div class="mt-4 p-3 bg-yellow-50 rounded-lg text-left">
                  <div class="flex">
                    <AlertCircle class="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                    <div>
                      <p class="text-xs text-yellow-700">
                        Upon approval, your new expiry date will be around
                        <span class="font-medium">{{ formatDisplayDate(getNewExpiryDate) }}</span>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                @click="showConfirmation = false"
              >
                Cancel
              </button>
              <button
                type="button"
                class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                @click="confirmSubmit"
              >
                Confirm
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <PaymentModal
        ref="paymentModalRef"
        :amount="renewalAmount"
        @payment-completed="handlePaymentCompleted"
        @close="closePaymentModal"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/services'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import relativeTime from 'dayjs/plugin/relativeTime'

import PageHeader from '@/components/common/MHPC/PageHeader.vue'
import PaymentModal from '@/components/common/PaymentModal.vue'

import {
  User,
  Users,
  Calendar,
  Phone,
  Mail,
  Home,
  MapPin,
  Map,
  Clock,
  AlertCircle,
  AlertTriangle,
  AlertOctagon,
  Loader,
  CreditCard,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Check,
  X,
  Tag,
  MessageSquare,
  ClipboardList,
} from 'lucide-vue-next'

dayjs.extend(isBetween)
dayjs.extend(isSameOrBefore)
dayjs.extend(relativeTime)

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const formData = ref({
  id: null,
  user_qualification_id: null, // Add this to store the user qualification ID
  cid: '',
  full_name: '',
  gender: '',
  date_of_birth: '',
  contact_number: '',
  email: '',
  permanent_village: '',
  permanent_gewog: '',
  permanent_dzongkhag: '',
  is_active: false,
})

const registrationDetails = ref({
  registration_date: '',
  expiry_date: '',
  registration_no: ''
})

const showConfirmation = ref(false)
const isLoading = ref(true)
const isSubmitting = ref(false)
const isProcessingPayment = ref(false)
const loadError = ref('')
const declaration = ref(false)
const remarks = ref('')
const paymentModalRef = ref(null)
const createdRenewalId = ref(null)
const renewalAmount = ref(1000)
const hasRenewalInProgress = ref(false)

const today = computed(() => dayjs())
const expiryDate = computed(() =>
  registrationDetails.value.expiry_date ? dayjs(registrationDetails.value.expiry_date) : null
)
const threeMonthsFromNow = computed(() => today.value.add(3, 'month'))
const hasExpired = computed(() =>
  expiryDate.value ? expiryDate.value.isBefore(today.value, 'day') : false
)
const isExpiringWithin3Months = computed(() => {
  if (!expiryDate.value || hasExpired.value) return false
  return expiryDate.value.isBetween(today.value, threeMonthsFromNow.value, 'day', '[]')
})



const isEligibleForRenewal = computed(() => {
  if (isLoading.value || loadError.value) return false
  if (!formData.value.id) return false
  if (!expiryDate.value || !expiryDate.value.isValid()) return false

  return isExpiringWithin3Months.value || hasExpired.value
})

const renewalEligibilityMessage = computed(() => {
  if (isLoading.value) return 'Loading eligibility data...'
  if (loadError.value) return `Error determining eligibility: ${loadError.value}`

  if (!formData.value.id)
    return 'No valid application identified for renewal.'
  if (!expiryDate.value || !expiryDate.value.isValid())
    return 'Cannot determine eligibility without a valid qualification expiry date.'

  if (!(isExpiringWithin3Months.value || hasExpired.value)) {
    return 'Your qualification is currently not eligible for renewal based on its expiry date (must be expiring within 3 months or already expired).'
  }
  return 'Your qualification is currently not eligible for renewal. Please review the requirements.'
})

const getNewExpiryDate = computed(() => {
  if (!expiryDate.value) return dayjs().add(12, 'month').toDate()
  const baseDate = hasExpired.value ? dayjs() : expiryDate.value
  return baseDate.add(12, 'month').toDate()
})

onMounted(async () => {
  await checkRenewalInProgress()
  if (!hasRenewalInProgress.value) {
    await fetchApplicationData()
  } else {
    isLoading.value = false
  }
})

const checkRenewalInProgress = async () => {
  try {
    const response = await apiService.getEpcRenewals()
    const renewals = response.data?.results || response.data || []
    const userCid = authStore.user?.cid

    if (userCid) {
      const userRenewals = renewals.filter(renewal => {
        // Check if renewal belongs to user and is pending
        return renewal.status === 'Pending' || renewal.status === 'Under Review'
      })
      hasRenewalInProgress.value = userRenewals.length > 0
    }
  } catch (error) {
    console.error('Error checking renewal status:', error)
    hasRenewalInProgress.value = false
  }
}

const fetchApplicationData = async () => {
  isLoading.value = true
  loadError.value = ''
  try {
    const cid = authStore.user?.cid
    if (!cid) {
      throw new Error('User authentication error.')
    }

    const response = await apiService.getApplicationWithCid(cid)
    let activeApplication = null
    const results = response.data?.results || response.data

    if (Array.isArray(results)) {
      activeApplication = results.find(
        (app) => (app.cid_no === cid || app.cid === cid) && app.is_active === true,
      )
      if (!activeApplication && results.length > 0) {
        const userApps = results.filter((app) => app.cid_no === cid || app.cid === cid)
        if (userApps.length > 0) activeApplication = userApps[0]
      }
    } else if (
      typeof results === 'object' &&
      results !== null &&
      (results.cid_no === cid || results.cid === cid)
    ) {
      activeApplication = results
    }

    if (!activeApplication) {
      console.warn(`No active application found for CID: ${cid}`)
      formData.value.id = null
    } else {
      formData.value = {
        id: activeApplication.id,
        user_qualification_id: null, // We'll need to get this from user_qualifications
        cid: activeApplication.cid_no || activeApplication.cid,
        full_name: activeApplication.full_name,
        gender: activeApplication.gender,
        date_of_birth: activeApplication.date_of_birth,
        contact_number: activeApplication.contact_no || activeApplication.contact_number,
        email: activeApplication.email_address || activeApplication.email,
        permanent_village: activeApplication.village || activeApplication.permanent_village,
        permanent_gewog: activeApplication.gewog || activeApplication.permanent_gewog,
        permanent_dzongkhag: activeApplication.dzongkhag || activeApplication.permanent_dzongkhag,
        is_active: activeApplication.is_active || false,
      }

      // Now we need to get the user_qualification details
      await fetchUserQualificationDetails(activeApplication.id)
    }
  } catch (error) {
    console.error('Error in fetchApplicationData:', error)
    loadError.value = error.message || 'An unexpected error occurred.'
    formData.value = { id: null }
    registrationDetails.value = {}
  } finally {
    isLoading.value = false
  }
}

const fetchUserQualificationDetails = async (applicationId) => {
  try {
    // Get detailed application with user_qualifications
    const response = await apiService.getEpcNewApplication(applicationId)
    const applicationDetails = response.data

    if (applicationDetails && applicationDetails.user_qualifications && applicationDetails.user_qualifications.length > 0) {
      // Find the primary qualification or use the first one
      let primaryQualification = applicationDetails.user_qualifications.find(q => q.is_primary_qualification)
      if (!primaryQualification) {
        primaryQualification = applicationDetails.user_qualifications[0]
      }

      // Update formData with user_qualification_id
      formData.value.user_qualification_id = primaryQualification.id

      // Set registration details from the qualification
      registrationDetails.value = {
        registration_date: primaryQualification.registration_date || '',
        expiry_date: primaryQualification.expiry_date || '',
        registration_no: primaryQualification.registration_no || '',
      }
    } else {
      throw new Error('No user qualifications found for renewal.')
    }
  } catch (error) {
    console.error('Error fetching user qualification details:', error)
    throw new Error('Could not fetch qualification details for renewal.')
  }
}

// const fetchLatestRenewalDetails = async (applicationId) => {
//   try {
//     const renewalsResponse = await apiService.getEpcRenewals()
//     let renewals = renewalsResponse.data?.results || renewalsResponse.data || []
//     const userRenewals = renewals.filter((renewal) => renewal.application === applicationId)
//     if (userRenewals.length > 0) {
//       userRenewals.sort((a, b) => new Date(b.registration_date) - new Date(a.registration_date))
//       const latestRenewal = userRenewals[0]
//       if (!registrationDetails.value.registration_no)
//         registrationDetails.value.registration_no = latestRenewal.registration_no
//       if (!registrationDetails.value.registration_date)
//         registrationDetails.value.registration_date = latestRenewal.registration_date
//       if (!registrationDetails.value.expiry_date)
//         registrationDetails.value.expiry_date = latestRenewal.expiry_date
//     }
//   } catch (error) {
//     console.error('Error fetching renewal details fallback:', error)
//   }
// }


const formatDisplayDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = dayjs(dateString)
  return date.isValid() ? date.format('MMM D, YYYY') : 'Invalid Date'
}

const formatDateForAPI = (date) => {
  const d = dayjs(date)
  return d.isValid() ? d.format('YYYY-MM-DD') : null
}

const handleSubmit = () => {
  if (!declaration.value) {
    toast.warning('Please accept the declaration to proceed.')
    return
  }
  if (!isEligibleForRenewal.value) {
    toast.error(`Renewal not allowed: ${renewalEligibilityMessage.value}`)
    return
  }
  showConfirmation.value = true
}

const confirmSubmit = async () => {
  showConfirmation.value = false
  isSubmitting.value = true

  try {
    if (!formData.value.user_qualification_id) {
      throw new Error('User qualification ID is missing. Cannot submit renewal.')
    }

    const today = new Date()
    const newExpiryDate = new Date(today)
    newExpiryDate.setMonth(today.getMonth() + 12) // Add 12 months
    const formattedNewExpiry = formatDateForAPI(newExpiryDate)

    if (!formattedNewExpiry) {
      toast.error('Date calculation error.')
      return
    }

    // Based on the EnggRenewal model, it expects 'user_qualification' field
    const renewalData = {
      user_qualification: formData.value.user_qualification_id, // Use the user_qualification ID
      new_expiry_date: formattedNewExpiry,
      renewal_review_status: 'Pending',
      renewal_review_remarks: remarks.value || null,
      renewal_endorsement_decision: 'Pending',
    }

    const renewalResponse = await apiService.createEpcRenewal(renewalData)

    if (renewalResponse && renewalResponse.data && renewalResponse.data.id) {
      createdRenewalId.value = renewalResponse.data.id
      toast.info('Renewal request submitted. Please proceed with the payment.')
      initiateRenewalPayment()
    } else {
      toast.success('Renewal application submitted successfully!')
      router.push('/admin/user/engineering_certification/dashboard')
    }
  } catch (error) {
    console.error('Error submitting renewal:', error)
    const errorMsg =
      error.response?.data?.new_expiry_date?.[0] ||
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'Submission failed.'
    toast.error(`Submission Failed: ${errorMsg}`)
  } finally {
    isSubmitting.value = false
  }
}

const initiateRenewalPayment = () => {
  if (!createdRenewalId.value) {
    toast.error('Cannot initiate payment: Renewal ID is missing.')
    return
  }
  if (paymentModalRef.value) {
    paymentModalRef.value.openModal()
  } else {
    console.error('Payment modal reference is not available.')
    toast.error('Payment modal could not be opened.')
  }
}

const handlePaymentCompleted = async (paymentData) => {
  if (!createdRenewalId.value) {
    toast.error('Cannot process payment: Renewal ID is missing.')
    return
  }

  const paymentId = paymentData.paymentHash
  const user = authStore.user

  if (!user?.contact_number || !user?.email || !user?.cid || !user?.id) {
    toast.error('Missing user information. Please update your profile before paying.')
    return
  }

  isProcessingPayment.value = true

  try {
    const paymentInitiationFormData = new FormData()
    paymentInitiationFormData.append('refNo', paymentId)
    paymentInitiationFormData.append('serviceCode', '100198') // Different service code for EPC
    paymentInitiationFormData.append('taxPayerName', user.cid)
    paymentInitiationFormData.append('taxPayerNo', user.cid)
    paymentInitiationFormData.append('taxPayerDocumentNo', user.cid)
    paymentInitiationFormData.append('totalPayableAmount', renewalAmount.value)
    paymentInitiationFormData.append('description', 'EPC Registration Renewal Fee')
    paymentInitiationFormData.append('mobileNo', user.contact_number)
    paymentInitiationFormData.append('payerEmail', user.email)
    paymentInitiationFormData.append('user', user.id)
    paymentInitiationFormData.append('payableAmount', renewalAmount.value)
    paymentInitiationFormData.append('application_no', createdRenewalId.value)
    paymentInitiationFormData.append('app_type', 'renewal_for_engineering_certification')

    await apiService.makePayment(paymentInitiationFormData)

    // Update renewal with payment details - you may need to add this API endpoint
    // const updatePayload = new FormData()
    // updatePayload.append('payment_id', paymentId)
    // updatePayload.append('payment_status', 'processing_payment')
    // await apiService.patchEpcRenewal(createdRenewalId.value, updatePayload)

    toast.success(
      `Payment successful (Ref: ${paymentId.substring(0, 8)}...). Your renewal is being processed.`
    )

    router.push('/admin/user/engineering_certification/dashboard')
  } catch (error) {
    console.error('Payment handling error:', error.response || error.request || error)
    let errorMsg = 'An error occurred while confirming the payment.'
    if (error.response?.data) {
      const detail = error.response.data.detail || JSON.stringify(error.response.data)
      errorMsg = `Payment API Error: ${detail}`
    } else if (error.request) {
      errorMsg = 'Network Error: Could not reach the server to confirm payment.'
    }
    toast.error(`${errorMsg} Contact support with payment ref ${paymentId} if issue persists.`)
  } finally {
    isProcessingPayment.value = false
    createdRenewalId.value = null
    if (paymentModalRef.value) {
      paymentModalRef.value.closeModal()
    }
  }
}

const closePaymentModal = () => {
  console.log('Payment modal closed.')
  createdRenewalId.value = null
}

const handleCancel = () => {
  router.push('/admin/user/engineering_certification/dashboard')
}
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
:focus-visible {
  outline: 2px solid rgba(59, 130, 246, 0.5);
  outline-offset: 2px;
}
input[disabled] {
  opacity: 0.8;
  cursor: not-allowed;
  background-color: #f9fafb;
}
input[type='checkbox'] {
  width: 1rem;
  height: 1rem;
}
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
.overflow-y-auto {
  -ms-overflow-style: none;
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}
</style>
