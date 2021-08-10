<template>
  <div class=" mx-auto px-6 py-8 bg-gray-50 min-h-screen">
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-2xl font-semibold text-gray-900 mb-2">Institute Registration Management</h1>
      <p class="text-gray-600">Monitor and manage your engineering institute registration status</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div class="flex items-center justify-center space-x-3">
        <Loader class="w-5 h-5 animate-spin text-blue-600" />
        <span class="text-gray-600 font-medium">Loading institute information...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="apiError" class="bg-white rounded-lg shadow-sm border border-red-200 p-6 mb-6">
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          <svg class="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="text-sm font-semibold text-red-800 mb-1">Error Loading Data</h3>
          <p class="text-sm text-red-700 mb-3">{{ errorMessage }}</p>
          <button
            @click="fetchInstituteAndCapaData"
            class="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200">
            Try Again
          </button>
        </div>
      </div>
    </div>

    <!-- No Data State -->
    <div v-else-if="!instituteData" class="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
      <div class="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No Institute Found</h3>
      <p class="text-gray-600">No engineering institutes are associated with your account.</p>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-6">
      <!-- Institute Header Card -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">{{ instituteData.name_of_institution }}</h2>
                <p class="text-sm text-gray-600">{{ registrationStatusText }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <!-- Status Indicator -->
              <div class="flex items-center space-x-2">
                <div
                  :class="[
                    'w-3 h-3 rounded-full',
                    {
                      'bg-red-500': isExpired,
                      'bg-yellow-500': isExpiringSoon && !isExpired,
                      'bg-green-500': !isExpired && !isExpiringSoon && !isRenewalPending,
                      'bg-blue-500': isRenewalPending
                    }
                  ]">
                </div>
                <span
                  :class="[
                    'text-sm font-medium',
                    {
                      'text-red-600': isExpired,
                      'text-yellow-600': isExpiringSoon && !isExpired,
                      'text-green-600': !isExpired && !isExpiringSoon && !isRenewalPending,
                      'text-blue-600': isRenewalPending
                    }
                  ]">
                  {{ registrationStatusText }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Alert Messages -->
        <div class="px-6 py-4 space-y-4">
          <!-- Renewal Pending Alert -->
          <div v-if="isRenewalPending" class="border border-blue-200 bg-blue-50 rounded-lg p-4">
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              <div>
                <h4 class="text-sm font-semibold text-blue-900 mb-1">Renewal In Progress</h4>
                <p class="text-sm text-blue-700">
                  Your renewal application is currently <span class="font-medium">{{ renewalData.renewal_status_display }}</span>.
                  <span v-if="isRenewalApproved"> Please proceed with payment to complete the renewal process.</span>
                  <span v-else> You will be notified once the review is complete.</span>
                </p>
              </div>
            </div>
          </div>

          <!-- Expired Alert -->
          <div v-else-if="isExpired" class="border border-red-200 bg-red-50 rounded-lg p-4">
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <div>
                <h4 class="text-sm font-semibold text-red-900 mb-1">Registration Expired</h4>
                <p class="text-sm text-red-700">
                  Your registration expired on <span class="font-medium">{{ formattedExpirationDate }}</span>. Please renew immediately to restore active status.
                </p>
              </div>
            </div>
          </div>

          <!-- Expiring Soon Alert -->
          <div v-else-if="isExpiringSoon" class="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <div>
                <h4 class="text-sm font-semibold text-yellow-900 mb-1">Registration Expiring Soon</h4>
                <p class="text-sm text-yellow-700">
                  Your registration expires in <span class="font-medium">{{ daysUntilExpiration }} days</span> on {{ formattedExpirationDate }}. Please renew to maintain active status.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Information Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Registration Details -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Registration Details
          </h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm text-gray-600">Status</span>
              <span
                :class="[
                  'text-sm font-medium px-2 py-1 rounded-full text-xs',
                  {
                    'bg-red-100 text-red-800': isExpired,
                    'bg-yellow-100 text-yellow-800': isExpiringSoon && !isExpired,
                    'bg-green-100 text-green-800': !isExpired && !isExpiringSoon && !isRenewalPending,
                    'bg-blue-100 text-blue-800': isRenewalPending
                  }
                ]">
                {{ registrationStatusText }}
              </span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm text-gray-600">Valid From</span>
              <span class="text-sm font-medium text-gray-900">{{ formattedActiveDate }}</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-sm text-gray-600">Valid Until</span>
              <span
                :class="[
                  'text-sm font-medium',
                  {
                    'text-red-600': isExpired,
                    'text-yellow-600': isExpiringSoon && !isExpired,
                    'text-gray-900': !isExpired && !isExpiringSoon
                  }
                ]">
                {{ formattedExpirationDate }}
              </span>
            </div>
          </div>
        </div>

        <!-- Institute Information -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <svg class="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Institute Information
          </h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm text-gray-600">Contact Person</span>
              <span class="text-sm font-medium text-gray-900">{{ instituteData.full_name }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm text-gray-600">Location</span>
              <span class="text-sm font-medium text-gray-900">{{ instituteData.dzongkhag }}, {{ instituteData.gewog }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm text-gray-600">Contact</span>
              <span class="text-sm font-medium text-gray-900">{{ instituteData.contact_no }}</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-sm text-gray-600">Email</span>
              <span class="text-sm font-medium text-gray-900 truncate">{{ instituteData.email_address }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div v-if="isRenewalWindowOpen && !isRenewalPending" class="space-y-4">
          <div class="border border-blue-200 bg-blue-50 rounded-lg p-4">
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
              </svg>
              <div>
                <h4 class="text-sm font-semibold text-blue-900 mb-1">Ready to Renew</h4>
                <p class="text-sm text-blue-700">Submit your renewal application to maintain your engineering institute's registration status.</p>
              </div>
            </div>
          </div>

          <div v-if="isCapaPending" class="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <div>
                <h4 class="text-sm font-semibold text-yellow-900 mb-1">CAPA Pending</h4>
                <p class="text-sm text-yellow-700">Cannot submit renewal application as a CAPA for {{ instituteData.name_of_institution }} is not resolved.</p>
              </div>
            </div>
          </div>

          <div class="flex justify-center pt-4">
            <button
              @click="submitRenewalApplication"
              :disabled="isCapaPending"
              :class="[
                'inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
                {
                  'text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500': !isCapaPending,
                  'text-gray-500 bg-gray-300 cursor-not-allowed': isCapaPending
                }
              ]">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
              </svg>
              Submit Renewal Application
            </button>
          </div>
        </div>

        <div v-else-if="isRenewalPending && isRenewalApproved" class="space-y-4">
          <div class="border border-green-200 bg-green-50 rounded-lg p-4">
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <div>
                <h4 class="text-sm font-semibold text-green-900 mb-1">Renewal Approved</h4>
                <p class="text-sm text-green-700">Your renewal application has been approved. Please proceed with payment to complete the process.</p>
              </div>
            </div>
          </div>

          <div class="flex justify-center pt-4">
            <button
              @click="openPaymentDialog"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm transition-all duration-200">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Proceed to Payment
            </button>
          </div>
        </div>

        <div v-else-if="isRenewalPending" class="text-center py-8">
          <div class="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
            </svg>
          </div>
          <h4 class="text-lg font-medium text-gray-900 mb-2">Awaiting Approval</h4>
          <p class="text-gray-600">Your renewal application is being reviewed by the dealing officer. You will be notified once approved.</p>
        </div>

        <div v-else class="text-center py-8">
          <div class="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
            </svg>
          </div>
          <h4 class="text-lg font-medium text-gray-900 mb-2">Renewal Window Not Open</h4>
          <p class="text-gray-600">You can renew your registration starting 90 days before expiration. Please check back later.</p>
        </div>

        <!-- Fee Information -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span class="text-sm font-medium text-gray-900">Renewal Fee</span>
              </div>
              <span class="text-sm font-semibold text-gray-900">Nu. 1,000</span>
            </div>
            <p class="text-xs text-gray-600 mt-2">Valid for one year from the date of approval</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Renewal Confirmation Modal -->
    <div v-if="showRenewalDialog" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-lg bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Submit Renewal Application</h3>
          <p class="text-sm text-gray-700 mb-6">
            Are you sure you want to submit a renewal application for your engineering institute? The application will be reviewed by the dealing officer.
          </p>
          <div class="flex justify-end space-x-3">
            <button
              @click="closeRenewalDialog"
              class="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200">
              Cancel
            </button>
            <button
              @click="submitRenewalApplicationConfirmed"
              class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200">
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Confirmation Modal -->
    <div v-if="showPaymentDialog" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-lg bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Confirm Payment</h3>
          <p class="text-sm text-gray-700 mb-6">
            Your renewal application has been approved. Please proceed with the payment of Nu. 1,000 to complete the renewal process.
          </p>
          <div class="flex justify-end space-x-3">
            <button
              @click="closePaymentDialog"
              class="px-4 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200">
              Cancel
            </button>
            <button
              @click="initiatePayment"
              class="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200">
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Modal Component -->
    <PaymentModal
      ref="paymentModal"
      :amount="100000"
      @payment-completed="handlePaymentCompleted"
      @close="closePaymentModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from 'vue-toastification';
import apiServices from '@/services/services';
import PaymentModal from '@/components/common/PaymentModal.vue';
import { Loader } from 'lucide-vue-next';

const instituteData = ref(null);
const renewalData = ref(null);
const isCapaPending = ref(false);
const isLoading = ref(true);
const apiError = ref(false);
const errorMessage = ref('');
const showRenewalDialog = ref(false);
const showPaymentDialog = ref(false);
const isRenewing = ref(false);
const paymentModal = ref(null);

const authStore = useAuthStore();
const toast = useToast();
const userCid = computed(() => authStore.user?.cid || '');

// --- THE FIX IS HERE ---
const isRenewalPending = computed(() => {
  return !!renewalData.value && renewalData.value.renewal_status !== 'COMPLETED';
});
// --- END OF FIX ---

const isRenewalApproved = computed(() => renewalData.value?.renewal_status === 'AWAITING_PAYMENT');

const expirationStatus = computed(() => {
  if (!instituteData.value?.valid_till) {
    return { isExpired: false, isExpiringSoon: false, daysUntil: null };
  }
  const expirationDate = new Date(instituteData.value.valid_till);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const timeDiff = expirationDate.getTime() - today.getTime();
  const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  const isExpired = dayDiff < 0;
  const isExpiringSoon = !isExpired && dayDiff <= 90;
  return { isExpired, isExpiringSoon, daysUntil: dayDiff };
});

const isExpired = computed(() => expirationStatus.value.isExpired);
const isExpiringSoon = computed(() => expirationStatus.value.isExpiringSoon);
const daysUntilExpiration = computed(() => expirationStatus.value.daysUntil);

const isRenewalWindowOpen = computed(() => {
  if (!instituteData.value) return false;
  return isExpired.value || isExpiringSoon.value;
});

const registrationStatusText = computed(() => {
  if (isRenewalPending.value) {
    return renewalData.value.renewal_status_display || renewalData.value.renewal_status;
  }
  if (isExpired.value) return 'Expired';
  if (isExpiringSoon.value) return `Expiring in ${daysUntilExpiration.value} days`;
  if (instituteData.value?.is_active) return 'Active';
  return 'Inactive';
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formattedActiveDate = computed(() => formatDate(instituteData.value?.valid_since));
const formattedExpirationDate = computed(() => formatDate(instituteData.value?.valid_till));

const fetchInstituteAndCapaData = async () => {
  if (!userCid.value) {
    errorMessage.value = 'User information not available. Please log in again.';
    apiError.value = true;
    isLoading.value = false;
    return;
  }
  isLoading.value = true;
  apiError.value = false;
  isCapaPending.value = false;
  instituteData.value = null;
  renewalData.value = null;

  try {
    const renewalResponse = await apiServices.getEpcInstituteRenewals();
    const userRenewal = renewalResponse.data?.results?.find(
      (renewal) => renewal.institute_details?.CID?.toLowerCase() === userCid.value.toLowerCase()
    );

    if (userRenewal) {
      renewalData.value = userRenewal;
      instituteData.value = userRenewal.institute_details;
    } else {
      const instituteResponse = await apiServices.getEpcInstitutes();
      instituteData.value = instituteResponse.data?.results?.find(
        (inst) => inst.CID.toLowerCase() === userCid.value.toLowerCase()
      ) || null;
    }

    if (instituteData.value) {
      const capaResponse = await apiServices.getEpcCapas();
      const pendingCapa = capaResponse.data?.results?.find(capa =>
        capa.institute?.id === instituteData.value.id && capa.status === 'P'
      );
      isCapaPending.value = !!pendingCapa;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    errorMessage.value = error.response?.data?.detail || 'An error occurred while fetching your institute data.';
    apiError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const openRenewalDialog = () => { showRenewalDialog.value = true; };
const closeRenewalDialog = () => { showRenewalDialog.value = false; };
const openPaymentDialog = () => { showPaymentDialog.value = true; };
const closePaymentDialog = () => { showPaymentDialog.value = false; };
const closePaymentModal = () => { isRenewing.value = false; };

const submitRenewalApplication = () => {
  if (isCapaPending.value) {
    toast.error('Cannot submit renewal application due to pending CAPA.');
    return;
  }
  openRenewalDialog();
};

const submitRenewalApplicationConfirmed = async () => {
  if (!instituteData.value) {
    toast.error('No institute data available.');
    closeRenewalDialog();
    return;
  }
  isLoading.value = true;
  try {
    const renewalFormData = new FormData();
    renewalFormData.append('institute', instituteData.value.id);
    renewalFormData.append('renewal_status', 'PENDING_REVIEW');
    renewalFormData.append('user_remarks', 'Renewal application submitted, awaiting officer approval.');
    await apiServices.createEpcInstituteRenewal(renewalFormData);
    toast.success('Renewal application submitted successfully! Awaiting officer approval.');
    await fetchInstituteAndCapaData();
  } catch (error) {
    console.error('Renewal application submission failed:', error);
    const apiErrorMsg = error.response?.data?.detail || 'An unknown error occurred';
    toast.error(`Submission Failed: ${apiErrorMsg}. Please try again or contact support.`);
  } finally {
    isLoading.value = false;
    closeRenewalDialog();
  }
};

const initiatePayment = () => {
  if (!instituteData.value) {
    toast.error('No institute data available for payment.');
    closePaymentDialog();
    return;
  }
  if (!isRenewalApproved.value) {
    toast.error('Renewal application is not ready for payment.');
    closePaymentDialog();
    return;
  }
  if (paymentModal.value) {
    paymentModal.value.openModal();
  } else {
    toast.error("Payment module failed to load. Please refresh and try again.");
  }
  closePaymentDialog();
};

const handlePaymentCompleted = async (paymentData) => {
  if (!instituteData.value || !renewalData.value) {
    toast.error('Renewal data is not available. Cannot proceed.');
    isRenewing.value = false;
    return;
  }
  const user = authStore.user;
  if (!user?.id) {
    toast.error('User information is missing. Cannot proceed.');
    isRenewing.value = false;
    return;
  }
  isLoading.value = true;
  isRenewing.value = true;
  try {
    const paymentLogFormData = new FormData();
    paymentLogFormData.append('refNo', paymentData.paymentHash);
    paymentLogFormData.append('serviceCode', '100196');
    paymentLogFormData.append('taxPayerName', instituteData.value.full_name || user.cid);
    paymentLogFormData.append('taxPayerNo', user.cid);
    paymentLogFormData.append('taxPayerDocumentNo', user.cid);
    paymentLogFormData.append('totalPayableAmount', 100000);
    paymentLogFormData.append('payableAmount', 100000);
    paymentLogFormData.append('description', `Renewal fee for Institute: ${instituteData.value.name_of_institution}`);
    paymentLogFormData.append('mobileNo', instituteData.value.contact_no || 'NA');
    paymentLogFormData.append('payerEmail', instituteData.value.email_address || 'NA');
    paymentLogFormData.append('user', user.id);
    paymentLogFormData.append('application_no', instituteData.value.id);
    paymentLogFormData.append('app_type', 'engineering_institute_renewal');
    await apiServices.makePayment(paymentLogFormData);

    const renewalUpdateFormData = new FormData();
    renewalUpdateFormData.append('institute', instituteData.value.id);
    renewalUpdateFormData.append('payment_id', paymentData.paymentHash);
    renewalUpdateFormData.append('payment_status', 'completed');
    renewalUpdateFormData.append('payment_date', new Date().toISOString());
    renewalUpdateFormData.append('renewal_status', 'COMPLETED');
    await apiServices.updateEpcInstituteRenewal(renewalData.value.id, renewalUpdateFormData);

    toast.success('Payment completed successfully! Your institute registration has been renewed for one year.');
    await fetchInstituteAndCapaData();
  } catch (error) {
    console.error('Renewal process failed:', error);
    const apiErrorMsg = error.response?.data?.detail || JSON.stringify(error.response?.data) || 'An unknown error occurred';
    toast.error(
      `Renewal Failed: ${apiErrorMsg}. Please contact support with Payment Ref: ${paymentData.paymentHash}`,
      { timeout: 10000 }
    );
  } finally {
    isLoading.value = false;
    isRenewing.value = false;
  }
};

onMounted(fetchInstituteAndCapaData);
</script>

<style scoped>
.cursor-not-allowed {
  cursor: not-allowed;
}
</style>