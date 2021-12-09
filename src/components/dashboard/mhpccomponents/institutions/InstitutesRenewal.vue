<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Institute Status Dashboard</h1>
          <p class="text-lg text-gray-600">Monitor and manage your institute registration status</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[400px]">
        <div class="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Loading Institute Data</h3>
          <p class="text-gray-600">Please wait while we fetch your information...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="apiError" class="text-center py-16">
        <div class="bg-red-50 rounded-2xl shadow-lg border-2 border-red-200 p-12 max-w-lg mx-auto">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-red-900 mb-2">Error Loading Data</h3>
          <p class="text-red-700 mb-6">{{ errorMessage }}</p>
          <button @click="fetchInstituteData" class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
            Try Again
          </button>
        </div>
      </div>

      <!-- No Data State -->
      <div v-else-if="!instituteData" class="text-center py-16">
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-lg mx-auto">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No Institute Found</h3>
          <p class="text-gray-600 mb-6">No institute registration was found for your account. Please contact support if this seems incorrect.</p>
          <button @click="fetchInstituteData" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
            Refresh Data
          </button>
        </div>
      </div>

      <!-- Main Institute Card -->
      <div v-else class="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-300">
        <!-- Institute Header with Gradient -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                <h2 class="text-2xl font-bold text-white mr-3">{{ instituteData.name_of_institution }}</h2>
                <div class="relative">
                  <div :class="['w-4 h-4 rounded-full', statusIndicatorClass]"></div>
                  <div :class="['absolute inset-0 w-4 h-4 rounded-full animate-ping', statusIndicatorClass.replace('bg-', 'bg-').split(' ')[0]]" v-if="statusIndicatorClass.includes('animate-pulse')"></div>
                </div>
              </div>
              <p class="text-blue-100 text-sm mb-1">Institute Registration Status</p>
              <span :class="['inline-flex items-center px-3 py-1 rounded-full text-sm font-medium', getStatusPillClass()]">
                {{ mainStatusText }}
              </span>
            </div>
            <div class="text-right text-blue-100">
              <p class="text-xs uppercase tracking-wide">Registration ID</p>
              <p class="text-white font-mono font-semibold">#{{ instituteData.id }}</p>
            </div>
          </div>
        </div>

        <div class="p-8">
          <!-- Status Banners -->
          <!-- All Good Banner -->
          <div v-if="!isRenewalWindowOpen && !instituteData.has_active_capa && !isRenewalInProgress" class="mb-6 p-6 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 shadow-sm">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4 flex-1">
                <h3 class="text-lg font-bold text-green-900 mb-2">✅ Registration Active & Valid</h3>
                <div class="bg-white rounded-lg p-4 border border-green-200">
                  <p class="text-green-800 text-sm leading-relaxed">
                    Your institute registration is in good standing and valid until <strong>{{ formattedExpirationDate }}</strong>.
                    The renewal window will open 90 days before the expiration date.
                  </p>
                </div>
                <div class="mt-3 flex items-center text-green-700">
                  <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-sm font-medium">No action required at this time.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Renewal In Progress Banner -->
          <div v-if="isRenewalInProgress && !isPaymentRequired" class="mb-6 p-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 shadow-sm">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4 flex-1">
                <h3 class="text-lg font-bold text-blue-900 mb-2">🔄 Renewal Under Review</h3>
                <div class="bg-white rounded-lg p-4 border border-blue-200">
                  <p class="text-blue-800 text-sm leading-relaxed mb-3">
                    Your renewal application has been submitted successfully and is currently being reviewed by our team.
                  </p>
                  <div class="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <p class="text-blue-800 font-semibold text-xs mb-1">📋 What happens next?</p>
                    <ul class="text-blue-700 text-xs space-y-1">
                      <li>• Application review (typically 5-10 business days)</li>
                      <li>• Email notification upon completion</li>
                      <li>• Payment processing (if approved)</li>
                      <li>• New certificate generation</li>
                    </ul>
                  </div>
                </div>
                <div class="mt-3 flex items-center text-blue-700">
                  <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-sm font-medium">Renewal button is disabled during review process.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- CAPA Warning - Enhanced -->
          <div v-if="instituteData.has_active_capa" class="mb-6 p-6 rounded-xl bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 shadow-sm">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4 flex-1">
                <h3 class="text-lg font-bold text-red-900 mb-2">⚠️ Renewal Blocked - CAPA Active</h3>
                <div class="bg-white rounded-lg p-4 border border-red-200 mb-4">
                  <p class="text-red-800 font-semibold mb-2">What is a CAPA?</p>
                  <p class="text-red-700 text-sm leading-relaxed mb-3">
                    A <strong>Corrective and Preventive Action (CAPA)</strong> is a systematic process to identify, investigate, and resolve quality or compliance issues in your institute operations.
                  </p>
                  <div class="bg-red-50 rounded-lg p-3 border border-red-100">
                    <p class="text-red-800 font-semibold text-sm mb-1">🚫 Why is renewal blocked?</p>
                    <ul class="text-red-700 text-sm space-y-1">
                      <li>• Outstanding compliance issues must be resolved</li>
                      <li>• Ensures continuous quality improvement</li>
                      <li>• Maintains accreditation standards</li>
                      <li>• Protects educational integrity</li>
                    </ul>
                  </div>
                </div>
                <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p class="text-blue-800 font-semibold text-sm mb-2">📋 Resolution Process:</p>
                  <ol class="text-blue-700 text-sm space-y-1">
                    <li><strong>1.</strong> Contact your assigned Complaince officer</li>
                    <li><strong>2.</strong> Review detailed CAPA requirements and timeline</li>
                    <li><strong>3.</strong> Develop and implement corrective measures</li>
                    <li><strong>4.</strong> Submit evidence of compliance resolution</li>
                    <li><strong>5.</strong> Undergo verification and approval process</li>
                    <li><strong>6.</strong> Receive CAPA closure notification</li>
                  </ol>
                </div>
                <div class="mt-4 flex items-center text-red-700">
                  <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-sm font-medium">Renewal functionality will be restored automatically once CAPA is resolved.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Expired Registration Banner -->
          <div v-if="isExpired && !isRenewalInProgress" class="mb-6 p-6 rounded-xl bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 shadow-sm">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4 flex-1">
                <h3 class="text-lg font-bold text-red-900 mb-2">🔴 Registration Expired</h3>
                <div class="bg-white rounded-lg p-4 border border-red-200">
                  <p class="text-red-700 text-sm leading-relaxed">
                    Your institute registration expired on <strong>{{ formattedExpirationDate }}</strong>.
                    Immediate renewal is required to continue authorized operations and maintain compliance.
                  </p>
                </div>
                <div class="mt-3 flex items-center text-red-700">
                  <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-sm font-medium">Please renew immediately to avoid operational disruptions.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Required Banner -->
          <div v-if="isPaymentRequired" class="mb-6 p-6 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-100 border-l-4 border-amber-500 shadow-sm">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div class="ml-4 flex-1">
                <h3 class="text-lg font-bold text-amber-900 mb-2">💳 Payment Required to Complete Renewal</h3>
                <div class="bg-white rounded-lg p-4 border border-amber-200">
                  <p class="text-amber-800 text-sm leading-relaxed mb-3">
                    Congratulations! Your renewal application has been <strong>approved</strong>.
                    Complete the payment process to activate your new registration and access your updated certificate.
                  </p>
                  <div class="bg-amber-50 rounded-lg p-3 border border-amber-100">
                    <p class="text-amber-800 font-semibold text-xs mb-1">💰 Payment Details:</p>
                    <ul class="text-amber-700 text-xs space-y-1">
                      <li>• Renewal Fee: BTN 100</li>
                      <li>• Secure online payment gateway</li>
                      <li>• Instant activation upon confirmation</li>
                      <li>• Digital receipt via email</li>
                    </ul>
                  </div>
                </div>
                <div class="mt-3 flex items-center text-amber-700">
                  <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-sm font-medium">Click "Complete Payment" below to finalize your renewal.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Registration Details Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- Registration Status -->
            <div class="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h4 class="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Registration Status
              </h4>
              <div class="space-y-4">
                <div class="flex justify-between items-center py-2 border-b border-gray-200">
                  <span class="text-sm text-gray-600">Overall Status</span>
                  <span :class="['text-sm font-medium', statusTextColorClass]">{{ mainStatusText }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-200">
                  <span class="text-sm text-gray-600">Valid From</span>
                  <span class="text-sm text-gray-900">{{ formattedActiveDate }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-200">
                  <span class="text-sm text-gray-600">Valid Until</span>
                  <span :class="['text-sm font-medium', expirationTextColorClass]">{{ formattedExpirationDate }}</span>
                </div>
                <div class="flex justify-between items-center py-2">
                  <span class="text-sm text-gray-600">Days Remaining</span>
                  <span :class="['text-sm font-medium', getDaysRemainingColorClass()]">
                    {{ getDaysRemainingText() }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Renewal Information -->
            <div class="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <h4 class="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                <svg class="w-4 h-4 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Renewal Information
              </h4>
              <div class="space-y-4">
                <div class="flex justify-between items-center py-2 border-b border-gray-200">
                  <span class="text-sm text-gray-600">Renewal Status</span>
                  <span :class="['text-sm font-medium', renewalStatusColorClass]">{{ renewalStatusDisplayText }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-200">
                  <span class="text-sm text-gray-600">Payment Status</span>
                  <span :class="['text-sm font-medium', paymentStatusColorClass]">{{ paymentStatusDisplayText }}</span>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-200">
                  <span class="text-sm text-gray-600">Renewal Window</span>
                  <span class="text-sm text-gray-900">{{ getRenewalWindowText() }}</span>
                </div>
                <div class="flex justify-between items-center py-2">
                  <span class="text-sm text-gray-600">CAPA Status</span>
                  <span :class="instituteData.has_active_capa ? 'text-red-600 font-medium' : 'text-green-600 font-medium'" class="text-sm">
                    {{ instituteData.has_active_capa ? 'Active (Blocking)' : 'None' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end items-center space-x-4 pt-6 border-t border-gray-100">
            <!-- Payment Button -->
            <button
              v-if="isPaymentRequired"
              @click="handleViewCertificateClick"
              class="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <svg class="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Complete Payment (BTN 100)
            </button>

            <!-- Certificate Button -->
            <button
              v-if="canViewCertificate"
              @click="handleViewCertificateClick"
              class="bg-white border-2 border-green-300 text-green-700 hover:bg-green-50 px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              <svg class="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Certificate
            </button>

            <!-- Renewal Button -->
            <button
              v-if="showRenewButton"
              @click="showRenewalModal = true"
              :disabled="instituteData.has_active_capa"
              :title="instituteData.has_active_capa ? 'Cannot renew: Please resolve pending CAPAs first.' : renewButtonTitle"
              :class="[
                'px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
                isExpired
                  ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white animate-pulse'
                  : daysUntilExpiration <= 30
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white animate-pulse'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
              ]"
            >
              <svg class="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ isExpired ? 'Renew Expired Registration' : 'Renew Registration' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Renewal Modal -->
    <InstituteRenewalModal
      v-if="instituteData"
      :show="showRenewalModal"
      :institute="instituteData"
      @close="showRenewalModal = false"
      @renewal-submitted="handleRenewalSuccess"
    />

    <!-- Payment Modal -->
    <PaymentModal ref="paymentModalRef" :amount="100" @payment-completed="handlePaymentCompleted" />

    <!-- Certificate Modal -->
    <div v-if="showCertificatePopup" class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 print:hidden">
      <div class="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300">
        <!-- Modal Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Institute Registration Certificate</h3>
            <p class="text-blue-600 text-sm mt-1">{{ instituteData?.name_of_institution }}</p>
          </div>
          <button @click="showCertificatePopup = false" class="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Certificate Content -->
        <div class="p-6 overflow-y-auto max-h-[70vh]">
          <div class="certificate-wrapper">
            <InstituteCertificate
              :instituteName="instituteData?.name_of_institution"
              :initialRegistrationDate="formatDateSafely(instituteData?.created_at)"
              :lastRenewalDate="formatDateSafely(instituteData?.updated_at)"
              :expiryDate="formattedExpirationDate"
            />
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            @click="showCertificatePopup = false"
            class="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
          >
            Close
          </button>
          <button
            @click="window.print()"
            class="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
          >
            <svg class="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Certificate
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import apiServices from '@/services/services'
import { useToast } from 'vue-toastification'
import InstituteRenewalModal from './InstituteRenewalModal.vue'
import InstituteCertificate from './InstituteCertificate.vue'
import PaymentModal from '@/components/common/PaymentModal.vue'

// Component State
const instituteData = ref(null)
const isLoading = ref(true)
const apiError = ref(false)
const errorMessage = ref('')
const showRenewalModal = ref(false)
const showCertificatePopup = ref(false)
const paymentModalRef = ref(null)

const authStore = useAuthStore()
const toast = useToast()
const userCid = computed(() => authStore.user?.cid || '')

// Helper Functions
const formatDateSafely = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return isNaN(date.getTime())
    ? 'Invalid Date'
    : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

// Computed Properties
const latestRenewal = computed(() => instituteData.value?.latest_renewal || null)
const formattedActiveDate = computed(() => formatDateSafely(instituteData.value?.valid_since))
const formattedExpirationDate = computed(() => formatDateSafely(instituteData.value?.valid_till))

const daysUntilExpiration = computed(() => {
  if (!instituteData.value?.valid_till) return -9999
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expirationDate = new Date(instituteData.value.valid_till)
  if (isNaN(expirationDate.getTime())) return -9999
  return Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
})

const isActive = computed(() => instituteData.value?.is_currently_active === true)
const isExpired = computed(() => instituteData.value?.application_status === 'Fully Approved' && !isActive.value)
const isRenewalWindowOpen = computed(() => daysUntilExpiration.value <= 90)
const isRenewalInProgress = computed(() => {
  if (!latestRenewal.value) return false
  return ['PENDING', 'AWAITING_PAYMENT'].includes(latestRenewal.value.renewal_status)
})
const isPaymentRequired = computed(() => latestRenewal.value?.renewal_status === 'AWAITING_PAYMENT')
const showRenewButton = computed(() => isRenewalWindowOpen.value && !isRenewalInProgress.value)
const canViewCertificate = computed(() => isActive.value)

const renewalStatusDisplayText = computed(() => {
  if (isRenewalInProgress.value) {
    const statusMap = {
      PENDING: 'Under Review',
      AWAITING_PAYMENT: 'Approved - Payment Required',
    }
    return statusMap[latestRenewal.value.renewal_status] || 'In Progress'
  }

  if (isExpired.value) return 'Expired - Renewal Required'

  if (latestRenewal.value) {
    const statusMap = {
      COMPLETED: 'Completed & Active',
      REJECTED: 'Rejected',
    }
    return statusMap[latestRenewal.value.renewal_status] || 'Not Started'
  }

  return 'Not Required'
})

const paymentStatusDisplayText = computed(() => {
  if (isPaymentRequired.value) return 'Payment Required'
  if (isRenewalInProgress.value) return 'Not Applicable'
  if (isExpired.value) return 'Not Applicable'
  if (latestRenewal.value && latestRenewal.value.payment_status) {
    const status = latestRenewal.value.payment_status
    return status.charAt(0).toUpperCase() + status.slice(1)
  }
  return 'Not Applicable'
})

const mainStatusText = computed(() => {
  if (instituteData.value?.has_active_capa) return 'Renewal Blocked (CAPA Active)'
  if (isPaymentRequired.value) return 'Payment Required'
  if (isRenewalInProgress.value) return 'Renewal Under Review'
  if (isExpired.value) return 'Registration Expired'
  if (isActive.value) return 'Active & Valid'
  return instituteData.value?.application_status || 'Status Unknown'
})

const renewButtonTitle = computed(() =>
  isActive.value ? 'Renew your institute registration' : 'Renew your expired registration'
)

// Color and Style Methods
const getDecisionColor = (decision) => {
  if (!decision) return 'text-gray-600'
  const lowerDecision = decision.toLowerCase()
  if (lowerDecision.includes('active') || lowerDecision.includes('completed') || lowerDecision.includes('valid'))
    return 'text-green-600'
  if (lowerDecision.includes('payment')) return 'text-yellow-600'
  if (lowerDecision.includes('pending') || lowerDecision.includes('review') || lowerDecision.includes('progress'))
    return 'text-blue-600'
  if (lowerDecision.includes('rejected') || lowerDecision.includes('expired')) return 'text-red-600'
  if (lowerDecision.includes('capa') || lowerDecision.includes('blocked')) return 'text-red-600'
  return 'text-gray-600'
}

const getStatusPillClass = () => {
  if (instituteData.value?.has_active_capa) return 'bg-red-100 text-red-800 border border-red-200'
  if (isPaymentRequired.value) return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
  if (isRenewalInProgress.value) return 'bg-blue-100 text-blue-800 border border-blue-200'
  if (isExpired.value) return 'bg-red-100 text-red-800 border border-red-200'
  if (isActive.value) return 'bg-green-100 text-green-800 border border-green-200'
  return 'bg-gray-100 text-gray-800 border border-gray-200'
}

const getDaysRemainingColorClass = () => {
  if (daysUntilExpiration.value <= 0) return 'text-red-600 font-semibold'
  if (daysUntilExpiration.value <= 30) return 'text-orange-600 font-semibold'
  if (daysUntilExpiration.value <= 90) return 'text-yellow-600 font-semibold'
  return 'text-green-600'
}

const getDaysRemainingText = () => {
  if (daysUntilExpiration.value <= 0) return 'Expired'
  if (daysUntilExpiration.value === 1) return '1 day'
  return `${daysUntilExpiration.value} days`
}

const getRenewalWindowText = () => {
  if (isExpired.value) return 'Open (Expired)'
  if (isRenewalWindowOpen.value) return 'Open (90 days)'
  return 'Closed'
}

// Computed Style Classes
const statusIndicatorClass = computed(() => {
  if (instituteData.value?.has_active_capa) return 'bg-red-500'
  if (isPaymentRequired.value) return 'bg-yellow-500 animate-pulse'
  if (isRenewalInProgress.value) return 'bg-blue-500 animate-pulse'
  if (isExpired.value) return 'bg-red-500'
  if (daysUntilExpiration.value <= 30 && isActive.value) return 'bg-orange-500'
  if (isActive.value) return 'bg-green-500'
  return 'bg-gray-400'
})

const statusTextColorClass = computed(() => getDecisionColor(mainStatusText.value))
const expirationTextColorClass = computed(() => {
  if (daysUntilExpiration.value <= 0) return 'text-red-600 font-semibold'
  if (daysUntilExpiration.value <= 30) return 'text-orange-600'
  return 'text-gray-800'
})
const renewalStatusColorClass = computed(() => getDecisionColor(renewalStatusDisplayText.value))
const paymentStatusColorClass = computed(() => getDecisionColor(paymentStatusDisplayText.value))

// Methods
const fetchInstituteData = async () => {
  isLoading.value = true
  apiError.value = false
  try {
    const response = await apiServices.getMhpcInstituteByCid(userCid.value)
    if (response?.data?.results?.length > 0) {
      instituteData.value = response.data.results[0]
    } else {
      instituteData.value = null
      errorMessage.value = 'No institute found for your account.'
    }
  } catch (error) {
    apiError.value = true
    errorMessage.value = 'An error occurred while fetching institute data.'
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const handleRenewalSuccess = () => {
  toast.info('Renewal submitted successfully! Refreshing institute status...')
  fetchInstituteData()
}

const handleViewCertificateClick = () => {
  if (isPaymentRequired.value) {
    initiatePayment()
  } else if (canViewCertificate.value) {
    showCertificatePopup.value = true
  }
}

const initiatePayment = () => {
  if (paymentModalRef.value) {
    paymentModalRef.value.openModal()
  } else {
    toast.error('Payment modal could not be opened.')
  }
}

const handlePaymentCompleted = async (paymentData) => {
  if (!latestRenewal.value) {
    toast.error('No pending renewal found to apply payment to.')
    return
  }
  isLoading.value = true
  let redirectUrl = null
  const user = authStore.user

  if (!user || !user.id || !user.cid || !user.email) {
    toast.error('User information is missing. Please log in again.')
    isLoading.value = false
    return
  }

  try {
    const paymentGatewayFormData = new FormData()
    paymentGatewayFormData.append('refNo', paymentData.paymentHash)
    paymentGatewayFormData.append('serviceCode', '100262')
    paymentGatewayFormData.append('taxPayerName', instituteData.value.name_of_institution || user.cid)
    paymentGatewayFormData.append('taxPayerNo', user.cid)
    paymentGatewayFormData.append('taxPayerDocumentNo', user.cid)
    paymentGatewayFormData.append('totalPayableAmount', 100)
    paymentGatewayFormData.append('payableAmount', 100)
    paymentGatewayFormData.append('description', `Renewal fee for Institute: ${instituteData.value.name_of_institution}`)
    paymentGatewayFormData.append('mobileNo', instituteData.value.contact_no || '17110000')
    paymentGatewayFormData.append('payerEmail', instituteData.value.email_address || user.email)
    paymentGatewayFormData.append('user', user.id)
    paymentGatewayFormData.append('application_no', instituteData.value.id)
    paymentGatewayFormData.append('app_type', 'mhpc_institute_renewal')

    const paymentResponse = await apiServices.makePayment(paymentGatewayFormData)
    if (paymentResponse.data?.content?.redirectUrl) {
      redirectUrl = paymentResponse.data.content.redirectUrl
    }

    await apiServices.confirmInstituteRenewalPayment(latestRenewal.value.id, {
      payment_id: paymentData.paymentHash,
    })

    toast.success('Payment initiated successfully. Redirecting for payment completion. A link has also been sent to your email.', { timeout: 8000 })
    if (redirectUrl) {
      window.open(redirectUrl, '_blank')
    }

    await fetchInstituteData()
  } catch (error) {
    console.error('Payment confirmation error:', error)
    toast.error('An error occurred while confirming your payment. Please contact support.')
  } finally {
    isLoading.value = false
    if (paymentModalRef.value) {
      paymentModalRef.value.closeModal()
    }
  }
}

onMounted(fetchInstituteData)
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  .certificate-wrapper,
  .certificate-wrapper * {
    visibility: visible;
  }
  .certificate-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .print\:hidden {
    display: none !important;
  }
}
</style>