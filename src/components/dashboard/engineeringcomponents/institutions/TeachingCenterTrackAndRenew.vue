<template>
  <div class="mx-auto px-4 py-8 ">
    <!-- Page Header -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Teaching Center Tracker & Renewal
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Track and renew your teaching center registration
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center my-8">
      <Loader class="animate-spin text-blue-600 w-6 h-6" />
      <p class="ml-2 text-gray-600">Loading teaching center data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="apiError" class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg mb-6">
      <h3 class="text-lg font-medium mb-2">Error Loading Data</h3>
      <p>{{ errorMessage }}</p>
      <button @click="fetchData"
        class="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors duration-200">
        Try Again
      </button>
    </div>

    <!-- No Teaching Centers Found -->
    <div v-else-if="!filteredTeachingCenters.length"
      class="bg-yellow-50 border border-yellow-200 text-yellow-700 p-6 rounded-lg mb-6">
      <h3 class="text-lg font-medium mb-2">No Teaching Centers Found</h3>
      <p>No teaching centers were found for your registered institute (CID: {{ authStore.user?.cid }}).</p>
      <p class="mt-2">Please ensure you have registered a teaching center under the correct institute.</p>
    </div>

    <!-- Teaching Centers List -->
    <div v-else class="space-y-8">
      <div v-for="center in filteredTeachingCenters" :key="center.id"
        class="bg-white rounded-xl shadow-lg overflow-hidden relative border border-gray-200">

        <!-- Status Indicator -->
        <div class="absolute top-0 right-0 h-full w-1 rounded-r-xl" :class="getStatusIndicatorClass(center)"></div>

        <!-- Center Header -->
        <div class="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ center.center_name }}</h3>
              <div class="flex items-center space-x-4 text-sm text-gray-600">
                <div class="flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span>{{ center.center_location }}, {{ center.city_gewog }}, {{ center.state_dzongkhag }}</span>
                </div>
              </div>
            </div>
            <div class="flex flex-col items-end space-y-2">
              <div class="bg-white rounded-lg px-4 py-2 shadow-sm border">
                <p class="text-xs text-gray-500">Center ID</p>
                <p class="text-sm font-bold text-gray-900">{{ center.id }}</p>
              </div>
              <div class="flex items-center px-3 py-1 rounded-full text-xs font-medium"
                :class="getStatusBadgeClass(center)">
                <div class="w-2 h-2 rounded-full mr-2" :class="getStatusDotClass(center)"></div>
                {{ getStatusText(center) }}
              </div>
            </div>
          </div>

          <!-- Expiration Alert -->
          <div v-if="shouldShowExpirationAlert(center)" class="mt-4 p-4 rounded-lg border-l-4"
            :class="getExpirationAlertClass(center)">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-5 h-5" :class="getExpirationTextClass(center)" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h4 class="font-semibold" :class="getExpirationTextClass(center)">
                  {{ getExpirationMessage(center) }}
                </h4>
                <p class="text-sm mt-1" :class="getExpirationTextClass(center)">
                  Registration expires on {{ formatDate(center.valid_till) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Center Details -->
        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

            <!-- Registration Information -->
            <div class="lg:col-span-1">
              <div class="bg-gray-50 rounded-lg p-5 h-full">
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                    </path>
                  </svg>
                  Registration Details
                </h4>
                <div class="space-y-4">
                  <div class="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span class="text-sm text-gray-600">Status:</span>
                    <span class="text-sm font-semibold px-2 py-1 rounded"
                      :class="center.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                      {{ center.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span class="text-sm text-gray-600">Officer Decision:</span>
                    <span class="text-sm font-semibold px-2 py-1 rounded"
                      :class="getOfficerStatusClass(center.tc_review_decision)">
                      {{ center.tc_review_decision || 'Pending' }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span class="text-sm text-gray-600">Payment:</span>
                    <span class="text-sm font-semibold px-2 py-1 rounded"
                      :class="center.is_payment_complete ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                      {{ center.is_payment_complete ? 'Completed' : 'Pending' }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center pb-2 border-b border-gray-200">
                    <span class="text-sm text-gray-600">Registered:</span>
                    <span class="text-sm font-medium text-gray-800">{{ formatDate(center.created_at) }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Valid Until:</span>
                    <span class="text-sm font-medium" :class="getExpirationDateClass(center)">
                      {{ formatDate(center.valid_till) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Institute Information -->
            <div class="lg:col-span-1">
              <div class="bg-gray-50 rounded-lg p-5 h-full">
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4m-6 0v-5a2 2 0 012-2h4v7m0 0v-7h4a2 2 0 012 2v7M8 12h4">
                    </path>
                  </svg>
                  Institute Details
                </h4>
                <div class="space-y-3">
                  <div>
                    <p class="text-xs text-gray-500 uppercase tracking-wide">Institution Name</p>
                    <p class="text-sm font-medium text-gray-800">{{ center.institute?.name_of_institution }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 uppercase tracking-wide">Head of Institution</p>
                    <p class="text-sm font-medium text-gray-800">{{ center.institute?.head_of_institution_name }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 uppercase tracking-wide">Contact</p>
                    <p class="text-sm font-medium text-gray-800">{{ center.institute?.contact_no }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                    <p class="text-sm font-medium text-gray-800 break-words">{{ center.institute?.email_address }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                    <p class="text-sm font-medium text-gray-800">
                      {{ center.institute?.village }}, {{ center.institute?.gewog }}, {{ center.institute?.dzongkhag }}
                    </p>
                  </div>
                  <div v-if="center.institute?.website">
                    <p class="text-xs text-gray-500 uppercase tracking-wide">Website</p>
                    <a :href="center.institute.website" target="_blank"
                      class="text-sm font-medium text-blue-600 hover:text-blue-800 underline break-words">
                      {{ center.institute.website }}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions: Payment, Renewal, or Status -->
            <div class="lg:col-span-1">
              <div class="bg-gray-50 rounded-lg p-5 h-full">
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Actions & Status
                </h4>
                <div class="text-center space-y-4">
                  <!-- Payment State for NEW Registration -->
                  <div v-if="center.tc_review_decision === 'Approved' && !center.is_payment_complete" class="space-y-3">
                     <div class="inline-flex items-center px-4 py-2 rounded-full text-sm bg-indigo-100 text-indigo-800 border border-indigo-200">
                        <CreditCard class="w-4 h-4 mr-2"/>
                        Payment Required
                      </div>
                      <p class="text-sm text-gray-600">Your application has been approved. Please complete the payment to activate your teaching center.</p>
                      <button @click="initiateNewRegistrationPayment(center)" class="btn btn-primary w-full">
                        <CreditCard class="h-4 w-4 mr-2" />
                        Make Payment (Nu. 1,000)
                      </button>
                  </div>

                  <!-- Certificate State -->
                   <div v-else-if="center.is_active && center.is_payment_complete" class="space-y-3">
                      <div class="inline-flex items-center px-4 py-2 rounded-full text-sm bg-green-100 text-green-800 border border-green-200">
                        <Award class="w-4 h-4 mr-2"/>
                        Registration Complete
                      </div>
                      <a v-if="center.certificate_url" :href="center.certificate_url" target="_blank" rel="noopener noreferrer" class="btn btn-success w-full">
                          <Award class="h-4 w-4 mr-2" />
                          View Certificate
                      </a>
                      <p v-else class="text-sm text-gray-500 italic">
                          Certificate is being generated...
                      </p>
                  </div>

                  <!-- Renewal In Progress State -->
                  <div v-else-if="isRenewalInProgress(center)" class="space-y-3">
                    <div
                      class="inline-flex items-center px-4 py-2 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
                      <svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                        </path>
                      </svg>
                      Renewal In Progress
                    </div>
                    <p class="text-sm text-gray-600">Your renewal application is under review</p>
                    <div class="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <p class="text-xs text-blue-700">You will be notified once the review is complete.</p>
                    </div>
                  </div>

                  <!-- Renew Button State -->
                  <div v-else-if="shouldShowRenewButton(center)" class="space-y-3">
                    <div
                      class="inline-flex items-center px-4 py-2 rounded-full text-sm bg-orange-100 text-orange-800 border border-orange-200">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z">
                        </path>
                      </svg>
                      Action Required
                    </div>
                    <p class="text-sm text-gray-600">{{ getDaysLeft(center) }}</p>
                    <button @click="openRenewalDialog(center)"
                      class="w-full inline-flex items-center justify-center px-4 py-3 rounded-lg font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                      :class="getRenewButtonClass(center)">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                        </path>
                      </svg>
                      {{ getExpirationDays(center) <= 0 ? 'Renew Expired' : 'Renew & Pay Now' }} </button>
                  </div>

                  <!-- Default 'Current' State for active, non-expiring centers -->
                  <div v-else-if="center.is_active" class="space-y-3">
                    <div
                      class="inline-flex items-center px-4 py-2 rounded-full text-sm bg-green-100 text-green-800 border border-green-200">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Current
                    </div>
                    <p class="text-sm text-gray-600">No action required</p>
                    <div class="bg-green-50 rounded-lg p-3 border border-green-200">
                      <p class="text-xs text-green-700">Registration is valid and up to date</p>
                    </div>
                  </div>

                  <!-- Fallback for other states (e.g. pending approval from start) -->
                   <div v-else class="space-y-3">
                    <div
                      class="inline-flex items-center px-4 py-2 rounded-full text-sm bg-yellow-100 text-yellow-800 border border-yellow-200">
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      Pending Approval
                    </div>
                    <p class="text-sm text-gray-600">Your application is under review.</p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Renewal Dialog (Unchanged from your working version) -->
    <div v-if="showRenewalDialog"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-bold text-gray-900">Teaching Center Renewal Application</h3>
            <button @click="closeRenewalDialog" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <form @submit.prevent="confirmRenewal" class="space-y-6">
            <div v-if="selectedCenter" class="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h4 class="font-semibold text-blue-900 mb-2">{{ selectedCenter.center_name }}</h4>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-blue-600">ID:</span>
                  <span class="font-medium text-blue-800 ml-2">{{ selectedCenter.id }}</span>
                </div>
                <div>
                  <span class="text-blue-600">Expires:</span>
                  <span class="font-medium text-blue-800 ml-2">{{ formatDate(selectedCenter.valid_till) }}</span>
                </div>
              </div>
            </div>
            <div>
              <label for="renewal_document" class="block text-sm font-medium text-gray-700 mb-2">
                Renewal Document <span class="text-red-500">*</span>
              </label>
              <div
                class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors duration-200">
                <div class="space-y-1 text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div class="flex text-sm text-gray-600">
                    <label for="renewal_document"
                      class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>Upload a file</span>
                      <input id="renewal_document" type="file" class="sr-only" @change="handleFileUpload" required>
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                </div>
              </div>
              <p v-if="selectedFileName" class="mt-2 text-sm text-green-600 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Selected: {{ selectedFileName }}
              </p>
            </div>
            <div>
              <label for="user_remarks" class="block text-sm font-medium text-gray-700 mb-2">
                Additional Remarks (Optional)
              </label>
              <textarea id="user_remarks" v-model="renewalFormData.user_remarks" rows="4"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Add any additional information, changes, or notes about your renewal application..."></textarea>
            </div>
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input id="declaration" type="checkbox" v-model="declarationChecked" required
                    class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded">
                </div>
                <div class="ml-3 text-sm">
                  <label for="declaration" class="font-medium text-gray-700">
                    Declaration <span class="text-red-500">*</span>
                  </label>
                  <p class="text-gray-600 mt-1">
                    I hereby declare that the information provided is true and correct to the best of my knowledge.
                  </p>
                </div>
              </div>
            </div>
            <div v-if="isRenewing"
              class="flex items-center justify-center py-6 bg-blue-50 rounded-lg border border-blue-200">
              <Loader class="animate-spin text-blue-600 w-6 h-6 mr-3" />
              <div class="text-center">
                <p class="text-blue-800 font-medium">Processing payment and submission...</p>
                <p class="text-blue-600 text-sm mt-1">Please wait</p>
              </div>
            </div>
            <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button type="button" @click="closeRenewalDialog"
                class="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                :disabled="isRenewing">
                Cancel
              </button>
              <button type="submit"
                class="px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                :disabled="isRenewing || !declarationChecked || !selectedFile">
                <CreditCard v-if="!isRenewing" class="w-4 h-4 mr-2" />
                <Loader v-else class="animate-spin w-4 h-4 mr-2" />
                {{ isRenewing ? 'Processing...' : 'Proceed to Payment' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <PaymentModal
      ref="paymentModalRef"
      :amount="1000"
      @payment-completed="onPaymentCompleted"
      @close="closePaymentModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'
import apiServices from '@/services/services'
import PaymentModal from '@/components/common/PaymentModal.vue';
import { Loader, CreditCard, Award } from 'lucide-vue-next'

// --- STATE ---
const teachingCenters = ref([])
const pendingRenewals = ref([])
const isLoading = ref(false)
const apiError = ref(false)
const errorMessage = ref('')
const showRenewalDialog = ref(false)
const isRenewing = ref(false)
const selectedCenter = ref(null)
const selectedFile = ref(null)
const selectedFileName = ref('')
const renewalFormData = ref({ user_remarks: '' })
const declarationChecked = ref(false)

// --- PAYMENT STATE ---
const paymentModalRef = ref(null);
const selectedCenterForNewPayment = ref(null);
const selectedCenterForRenewalPayment = ref(null);

const toast = useToast()
const authStore = useAuthStore()

// --- COMPUTED & GETTERS ---
const filteredTeachingCenters = computed(() => {
  if (!authStore.user?.cid) return []
  return teachingCenters.value.filter(center =>
    center.institute?.CID === authStore.user.cid && !center.is_draft
  )
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString + 'T00:00:00Z')
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return 'Invalid Date'
  }
}

const getExpirationDays = (center) => {
  if (!center.valid_till) return Infinity
  const today = new Date()
  const expirationDate = new Date(center.valid_till + 'T00:00:00Z')
  today.setUTCHours(0, 0, 0, 0)
  expirationDate.setUTCHours(0, 0, 0, 0)
  return Math.ceil((expirationDate - today) / (1000 * 60 * 60 * 24))
}

const isRenewalInProgress = (center) => {
  return pendingRenewals.value.some(renewal =>
    renewal.teaching_center_details?.id === center.id
  )
}

// =================================================================
// CORRECTED LOGIC FOR RENEW BUTTON VISIBILITY
// =================================================================
const shouldShowRenewButton = (center) => {
  // A center is renewable if it has a `valid_till` date (meaning it was approved once),
  // is within the renewal window (or expired), and not already being renewed.
  // We remove the `center.is_active` check to allow expired centers to be renewed.
  return center.valid_till &&
    getExpirationDays(center) <= 90 &&
    !isRenewalInProgress(center)
}
// =================================================================

const shouldShowExpirationAlert = (center) => {
  // Show alert for active centers nearing expiration or for expired centers.
  return center.valid_till && getExpirationDays(center) <= 90
}

const getExpirationMessage = (center) => {
  const daysLeft = getExpirationDays(center)
  if (daysLeft <= 0) return '⚠️ Registration Expired'
  if (daysLeft <= 7) return `⚠️ Expires in ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}`
  if (daysLeft <= 30) return `⚠️ Expires in ${daysLeft} days`
  return `ℹ️ Expires in ${daysLeft} days`
}

const getStatusText = (center) => {
  if (center.tc_review_decision === 'Approved' && !center.is_payment_complete) return 'Payment Pending'
  if (isRenewalInProgress(center)) return 'Renewal In Progress'
  if (getExpirationDays(center) <= 0) return 'Expired'
  if (!center.is_active) return 'Pending Approval' // Catches new applications
  if (getExpirationDays(center) <= 30) return 'Expiring Soon'
  return 'Active'
}

const getDaysLeft = (center) => {
  const days = getExpirationDays(center)
  if (days <= 0) return 'Registration has expired'
  if (days <= 7) return `Only ${days} ${days === 1 ? 'day' : 'days'} remaining`
  if (days <= 30) return `${days} days until expiration`
  return `Renewal window open (${days} days remaining)`
}

const getStatusIndicatorClass = (center) => {
  if (center.tc_review_decision === 'Approved' && !center.is_payment_complete) return 'bg-indigo-500'
  if (isRenewalInProgress(center)) return 'bg-blue-500'
  const daysLeft = getExpirationDays(center)
  if (daysLeft <= 0) return 'bg-red-500'
  if (!center.is_active) return 'bg-yellow-500'
  if (daysLeft <= 30) return 'bg-orange-500'
  return 'bg-green-500'
}

const getStatusBadgeClass = (center) => {
  if (center.tc_review_decision === 'Approved' && !center.is_payment_complete) return 'bg-indigo-100 text-indigo-800 border-indigo-200'
  if (isRenewalInProgress(center)) return 'bg-blue-100 text-blue-800 border-blue-200'
  const daysLeft = getExpirationDays(center)
  if (daysLeft <= 0) return 'bg-red-100 text-red-800 border-red-200'
  if (!center.is_active) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  if (daysLeft <= 30) return 'bg-orange-100 text-orange-800 border-orange-200'
  return 'bg-green-100 text-green-800 border-green-200'
}

const getStatusDotClass = (center) => {
  if (center.tc_review_decision === 'Approved' && !center.is_payment_complete) return 'bg-indigo-500'
  if (isRenewalInProgress(center)) return 'bg-blue-500'
  const daysLeft = getExpirationDays(center)
  if (daysLeft <= 0) return 'bg-red-500'
  if (!center.is_active) return 'bg-yellow-500'
  if (daysLeft <= 30) return 'bg-orange-500'
  return 'bg-green-500'
}

const getExpirationAlertClass = (center) => {
  const daysLeft = getExpirationDays(center)
  if (daysLeft <= 0) return 'bg-red-50 border-red-500'
  if (daysLeft <= 30) return 'bg-orange-50 border-orange-500'
  return 'bg-yellow-50 border-yellow-500'
}

const getExpirationTextClass = (center) => {
  const daysLeft = getExpirationDays(center)
  if (daysLeft <= 0) return 'text-red-700'
  if (daysLeft <= 30) return 'text-orange-700'
  return 'text-yellow-700'
}

const getExpirationDateClass = (center) => {
  if (!center.valid_till) return 'text-gray-800'
  const daysLeft = getExpirationDays(center)
  if (daysLeft <= 0) return 'text-red-600 font-bold'
  if (daysLeft <= 30) return 'text-orange-600 font-semibold'
  return 'text-gray-800'
}

const getRenewButtonClass = (center) => {
  const daysLeft = getExpirationDays(center)
  if (daysLeft <= 0) return 'bg-red-600 hover:bg-red-700 focus:ring-red-500 animate-pulse'
  if (daysLeft <= 30) return 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'
  return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
}

const getOfficerStatusClass = (status) => {
  switch (status?.toUpperCase()) {
    case 'APPROVED': return 'bg-green-100 text-green-800'
    case 'REJECTED': return 'bg-red-100 text-red-800'
    case 'PENDING': default: return 'bg-yellow-100 text-yellow-800'
  }
}

// --- FILE & DIALOG LOGIC ---
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) {
    selectedFile.value = null
    selectedFileName.value = ''
    return
  }
  const maxSizeInBytes = 10 * 1024 * 1024
  if (file.size > maxSizeInBytes) {
    toast.error('File size must be less than 10MB')
    event.target.value = ''
    return
  }
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  if (!allowedTypes.includes(file.type)) {
    toast.error('Please upload a PDF, DOC, or DOCX file')
    event.target.value = ''
    return
  }
  selectedFile.value = file
  selectedFileName.value = file.name
  toast.success(`File "${file.name}" selected successfully`)
}

const openRenewalDialog = (center) => {
  selectedCenter.value = center
  renewalFormData.value = { user_remarks: '' }
  declarationChecked.value = false
  selectedFile.value = null
  selectedFileName.value = ''
  showRenewalDialog.value = true
}

const closeRenewalDialog = () => {
  showRenewalDialog.value = false
  isRenewing.value = false
  selectedCenter.value = null
  renewalFormData.value = { user_remarks: '' }
  declarationChecked.value = false
  selectedFile.value = null
  selectedFileName.value = ''
}

// --- PAYMENT & SUBMISSION FLOW ---
const confirmRenewal = () => {
  if (!declarationChecked.value || !selectedFile.value) {
    toast.warning('Please check the declaration and upload a renewal document')
    return
  }
  selectedCenterForRenewalPayment.value = selectedCenter.value;
  selectedCenterForNewPayment.value = null;
  if (paymentModalRef.value) {
    paymentModalRef.value.openModal();
  } else {
    toast.error("Payment module could not be loaded.");
  }
}

const onPaymentCompleted = (paymentData) => {
  if (selectedCenterForRenewalPayment.value) {
    handleRenewalPaymentCompleted(paymentData);
  } else if (selectedCenterForNewPayment.value) {
    handleNewRegistrationPayment(paymentData);
  } else {
    toast.error("Payment context is unclear. Please try again.");
    closePaymentModal();
  }
};

const initiateNewRegistrationPayment = (center) => {
  selectedCenterForNewPayment.value = center;
  selectedCenterForRenewalPayment.value = null;
  if (paymentModalRef.value) {
    paymentModalRef.value.openModal();
  } else {
    toast.error('Payment module could not be loaded.');
  }
};

const handleNewRegistrationPayment = async (paymentData) => {
  if (!selectedCenterForNewPayment.value) return;
  isLoading.value = true;
  const paymentId = paymentData.paymentHash;
  const centerToPay = selectedCenterForNewPayment.value;
  try {
    const updateFormData = new FormData();
    updateFormData.append('payment_id', paymentId);
    updateFormData.append('is_payment_complete', true);
    await apiServices.patchEpcTeachingCenter(centerToPay.id, updateFormData);
    toast.success(`Payment confirmed. Your center is now being activated.`);
    await fetchData();
  } catch (error) {
    console.error('New Registration Payment error:', error);
    toast.error(`Payment confirmation failed. Please contact support with Ref: ${paymentId}`);
  } finally {
    isLoading.value = false;
    closePaymentModal();
  }
};

const handleRenewalPaymentCompleted = async (paymentData) => {
  if (!selectedCenterForRenewalPayment.value) return;
  isRenewing.value = true;
  const paymentId = paymentData.paymentHash;
  const centerToRenew = selectedCenterForRenewalPayment.value;
  try {
    const finalFormData = new FormData();
    finalFormData.append('teaching_center', centerToRenew.id);
    finalFormData.append('user_remarks', renewalFormData.value.user_remarks || '');
    finalFormData.append('renewal_document', selectedFile.value);
    finalFormData.append('payment_id', paymentId);
    finalFormData.append('is_payment_complete', true);

    await apiServices.createEpcTeachingCenterRenewal(finalFormData);
    toast.success('🎉 Renewal application and payment submitted successfully!');
    await fetchData();
    closeRenewalDialog();
  } catch (error) {
    console.error('Renewal submission error:', error);
    const apiErrorMessage = error.response?.data?.detail || 'Failed to submit renewal application';
    toast.error(`❌ Submission failed: ${apiErrorMessage}. Please contact support with Ref: ${paymentId}`);
  } finally {
    isRenewing.value = false;
    closePaymentModal();
  }
};

const closePaymentModal = () => {
  selectedCenterForNewPayment.value = null;
  selectedCenterForRenewalPayment.value = null;
};

// --- DATA FETCHING ---
const fetchData = async () => {
  if (!authStore.user?.cid) {
    apiError.value = true
    errorMessage.value = 'User information not loaded. Please ensure you are logged in.'
    return
  }
  isLoading.value = true
  apiError.value = false
  try {
    const [centersResponse, renewalsResponse] = await Promise.all([
      apiServices.getEpcTeachingCenters(),
      apiServices.getEpcTeachingCenterRenewals({ renewal_status: 'PENDING' })
    ])
    teachingCenters.value = centersResponse.data.results || []
    pendingRenewals.value = renewalsResponse.data.results || []
  } catch (error) {
    console.error('❌ Error fetching data:', error)
    errorMessage.value = error.response?.data?.detail || `Error fetching data: ${error.message}`
    apiError.value = true
  } finally {
    isLoading.value = false
  }
}

// --- LIFECYCLE ---
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* Custom animations */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
.animate-spin { animation: spin 1s linear infinite; }
.btn { @apply inline-flex items-center justify-center space-x-2 px-4 py-3 text-sm font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors; }
.btn-primary { @apply text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500; }
.btn-success { @apply text-white bg-green-600 hover:bg-green-700 focus:ring-green-500; }
/* Smooth transitions */
* { transition: all 0.2s ease-in-out; }
/* Hover effects */
.border-dashed:hover { border-color: #6B7280; background-color: #F9FAFB; }
/* Focus states */
input:focus, textarea:focus, button:focus { outline: none; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
/* Card hover effect */
.bg-white:hover { transform: translateY(-2px); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); }
/* Button animations */
button:hover:not(:disabled) { transform: translateY(-1px); }
button:active:not(:disabled) { transform: translateY(0); }
</style>