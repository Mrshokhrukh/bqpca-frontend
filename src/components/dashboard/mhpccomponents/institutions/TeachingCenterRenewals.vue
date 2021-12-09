<template>
  <div class="min-h-screen">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Training Center Management</h1>
          <p class="text-lg text-gray-600">Track, manage, and renew your teaching center registrations</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Authentication Check -->
      <div
        v-if="!authStore.user || !authStore.user.cid"
        class="text-center py-16"
      >
        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h3>
          <p class="text-gray-600 mb-4">Please ensure you're logged in with valid credentials to access your training centers.</p>
          <div v-if="initialAuthCheckPending" class="flex items-center justify-center text-blue-600">
            <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Verifying credentials...</span>
          </div>
        </div>
      </div>

      <template v-else>
        <!-- Loading State -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[400px]">
          <div class="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Loading Training Centers</h3>
            <p class="text-gray-600">Please wait while we fetch your data...</p>
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
            <h3 class="text-xl font-semibold text-red-900 mb-2">Unable to Load Data</h3>
            <p class="text-red-700 mb-6">{{ errorMessage }}</p>
            <button @click="fetchData" class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
              Try Again
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!instituteTeachingCenters.length" class="text-center py-16">
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-lg mx-auto">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No Training Centers Found</h3>
            <p class="text-gray-600 mb-6">You don't have any registered training centers yet. Contact your administrator to get started.</p>
            <button @click="fetchData" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
              Refresh
            </button>
          </div>
        </div>

        <!-- Training Centers List -->
        <div v-else class="space-y-6">
          <div
            v-for="center in instituteTeachingCenters"
            :key="center.id"
            class="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 transform hover:-translate-y-1"
          >
            <!-- Header Section -->
            <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div class="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h3 class="text-xl font-bold text-white mb-1">{{ center.center_name }}</h3>
                  <p class="text-blue-100 text-sm">
                    {{ center.center_location }}, {{ center.state_dzongkhag }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-blue-100 text-xs uppercase tracking-wide">Center ID</p>
                  <p class="text-white font-mono font-semibold">#{{ center.id }}</p>
                </div>
              </div>
            </div>

            <div class="p-6">
              <!-- Status Pills -->
              <div class="flex flex-wrap gap-2 mb-6">
                <span :class="getStatusPillClass(center)">
                  {{ getStatusText(center) }}
                </span>
                <span :class="center.has_active_capa ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-green-100 text-green-800 border border-green-200'" class="px-3 py-1 text-xs font-medium rounded-full">
                  {{ center.has_active_capa ? 'CAPA Active' : 'No Active CAPAs' }}
                </span>
                <span :class="getReviewDecisionPillClass(center)" class="px-3 py-1 text-xs font-medium rounded-full border">
                  {{ center.tc_review_decision_display || center.tc_review_decision || 'Pending Review' }}
                </span>
              </div>

              <!-- CAPA Warning - Enhanced -->
              <div v-if="center.has_active_capa" class="mb-6 p-6 rounded-xl bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 shadow-sm">
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                      <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4 flex-1">
                    <h4 class="text-lg font-bold text-red-900 mb-2">⚠️ Renewal Blocked - CAPA Active</h4>
                    <div class="bg-white rounded-lg p-4 border border-red-200 mb-4">
                      <p class="text-red-800 font-semibold mb-2">What is a CAPA?</p>
                      <p class="text-red-700 text-sm leading-relaxed mb-3">
                        A <strong>Corrective and Preventive Action (CAPA)</strong> is a formal process to address and resolve quality or compliance issues identified in your training center operations.
                      </p>
                      <div class="bg-red-50 rounded-lg p-3 border border-red-100">
                        <p class="text-red-800 font-semibold text-sm mb-1">🚫 Why is renewal blocked?</p>
                        <ul class="text-red-700 text-sm space-y-1">
                          <li>• Active CAPAs indicate unresolved compliance issues</li>
                          <li>• Training centers must meet all quality standards</li>
                          <li>• Resolution ensures continuous improvement</li>
                        </ul>
                      </div>
                    </div>
                    <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p class="text-blue-800 font-semibold text-sm mb-2">📋 Next Steps:</p>
                      <ol class="text-blue-700 text-sm space-y-1">
                        <li><strong>1.</strong> Contact your compliance officer</li>
                        <li><strong>2.</strong> Review the specific CAPA requirements</li>
                        <li><strong>3.</strong> Implement necessary corrective actions</li>
                        <li><strong>4.</strong> Submit evidence of resolution</li>
                        <li><strong>5.</strong> Wait for CAPA closure approval</li>
                      </ol>
                    </div>
                    <div class="mt-4 flex items-center text-red-700">
                      <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p class="text-sm font-medium">Renewal will be automatically available once all CAPAs are resolved.</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Expiration Warning -->
              <div
                v-if="!center.has_active_capa && center.valid_till && getDaysUntilExpiration(center) <= 90"
                class="mb-6 p-4 rounded-xl border-l-4 shadow-sm"
                :class="[
                  getDaysUntilExpiration(center) <= 0
                    ? 'bg-gradient-to-r from-red-50 to-red-100 border-red-500'
                    : getDaysUntilExpiration(center) <= 30
                    ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-500'
                    : 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-500'
                ]"
              >
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <div :class="[
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      getDaysUntilExpiration(center) <= 0 ? 'bg-red-500' :
                      getDaysUntilExpiration(center) <= 30 ? 'bg-orange-500' : 'bg-yellow-500'
                    ]">
                      <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-3">
                    <h4 :class="[
                      'font-semibold text-sm',
                      getDaysUntilExpiration(center) <= 0 ? 'text-red-900' :
                      getDaysUntilExpiration(center) <= 30 ? 'text-orange-900' : 'text-yellow-900'
                    ]">
                      {{ getDaysUntilExpiration(center) <= 0 ? '🔴 Registration Expired!' :
                         getDaysUntilExpiration(center) <= 30 ? '🟠 Expiring Soon!' : '🟡 Renewal Available' }}
                    </h4>
                    <p :class="[
                      'text-xs mt-1',
                      getDaysUntilExpiration(center) <= 0 ? 'text-red-800' :
                      getDaysUntilExpiration(center) <= 30 ? 'text-orange-800' : 'text-yellow-800'
                    ]">
                      {{ getDaysUntilExpiration(center) <= 0
                        ? 'Your registration has expired. Renew immediately to restore active status.'
                        : `Registration expires in ${getDaysUntilExpiration(center)} days (${formatDate(center.valid_till)}). Renew now to avoid disruption.`
                      }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Payment Required -->
              <div v-if="isPaymentRequired(center)" class="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-100 border-l-4 border-amber-500 shadow-sm">
                <div class="flex items-start">
                  <div class="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h4 class="font-semibold text-amber-900 text-sm">💳 Payment Required</h4>
                    <p class="text-amber-800 text-xs mt-1">Your application has been approved! Complete payment to activate your registration.</p>
                  </div>
                </div>
              </div>

              <!-- Information Grid -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <!-- Registration Details -->
                <div class="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h4 class="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                    <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Registration Details
                  </h4>
                  <div class="space-y-3">
                    <div class="flex justify-between items-center py-2 border-b border-gray-200">
                      <span class="text-sm text-gray-600">Status</span>
                      <span :class="getStatusTextClass(center)" class="text-sm font-medium">{{ getStatusText(center) }}</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-gray-200">
                      <span class="text-sm text-gray-600">Valid From</span>
                      <span class="text-sm text-gray-900">{{ formatDate(center.valid_since) }}</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-gray-200">
                      <span class="text-sm text-gray-600">Valid Until</span>
                      <span :class="getExpirationTextClass(center)" class="text-sm font-medium">{{ formatDate(center.valid_till) }}</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-gray-200">
                      <span class="text-sm text-gray-600">Payment Status</span>
                      <span :class="getPaymentStatusTextClass(center)" class="text-sm font-medium">{{ getPaymentStatusText(center) }}</span>
                    </div>
                  </div>
                </div>

                <!-- Center Information -->
                <div class="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h4 class="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                    <svg class="w-4 h-4 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Center Information
                  </h4>
                  <div class="space-y-3">
                    <div class="flex justify-between items-center py-2 border-b border-gray-200">
                      <span class="text-sm text-gray-600">Institute</span>
                      <span class="text-sm text-gray-900 text-right">{{ center.institute_details?.name_of_institution || 'N/A' }}</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-gray-200">
                      <span class="text-sm text-gray-600">Location</span>
                      <span class="text-sm text-gray-900">{{ center.center_location || 'N/A' }}</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-gray-200">
                      <span class="text-sm text-gray-600">City/Gewog</span>
                      <span class="text-sm text-gray-900">{{ center.city_gewog || 'N/A' }}</span>
                    </div>
                    <div class="flex justify-between items-center py-2 border-b border-gray-200">
                      <span class="text-sm text-gray-600">Category</span>
                      <span class="text-sm text-gray-900">{{ center.target_category || 'N/A' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Status Messages -->
              <div class="mb-6">
                <!-- Renewal In Progress -->
                <div v-if="isRenewalInProgress(center)" class="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <div class="ml-3">
                      <h4 class="font-semibold text-blue-900 text-sm">Renewal In Progress</h4>
                      <p class="text-blue-700 text-xs">Your renewal application is under review. We'll notify you once completed.</p>
                    </div>
                  </div>
                </div>

                <!-- Application In Progress -->
                <div v-else-if="!center.has_active_capa && !center.is_active && center.tc_review_decision === 'Pending'" class="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <h4 class="font-semibold text-orange-900 text-sm">Application Under Review</h4>
                      <p class="text-orange-700 text-xs">Your application is being evaluated. Please wait for the review to complete.</p>
                    </div>
                  </div>
                </div>

                <!-- Application Rejected -->
                <div v-else-if="center.tc_review_decision === 'Rejected' && center.tc_reason_if_rejected" class="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div class="flex items-start">
                    <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div class="ml-3 flex-1">
                      <h4 class="font-semibold text-red-900 text-sm mb-2">Application Rejected</h4>
                      <div class="bg-white rounded-lg p-3 border border-red-200 mb-3">
                        <p class="text-red-700 text-xs"><strong>Reason:</strong> {{ center.tc_reason_if_rejected }}</p>
                      </div>
                      <div v-if="!center.has_active_capa" class="flex">
                        <button @click="openRenewalDialog(center)" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors duration-200">
                          Re-apply / Renew
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Valid Registration -->
                <div v-else-if="!center.has_active_capa && center.is_active && getDaysUntilExpiration(center) > 90" class="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <h4 class="font-semibold text-green-900 text-sm">Registration Active & Valid</h4>
                      <p class="text-green-700 text-xs">Valid until {{ formatDate(center.valid_till) }}. Renewal available 90 days before expiration.</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end items-center space-x-3 pt-4 border-t border-gray-100">
                <!-- Payment Button -->
                <button v-if="isPaymentRequired(center)" @click="initiatePayment(center)" class="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg">
                  <svg class="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Complete Payment
                </button>

                <!-- Certificate Button -->
                <button v-if="center.is_active && getDaysUntilExpiration(center) > 0" @click="openCertificateDialog(center)" class="bg-white border-2 border-blue-300 text-blue-700 hover:bg-blue-50 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105">
                  <svg class="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Certificate
                </button>

                <!-- Renewal Button -->
                <button
                  v-if="canRenew(center)"
                  @click="openRenewalDialog(center)"
                  :class="[
                    'px-6 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg text-white',
                    getDaysUntilExpiration(center) <= 0
                      ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 animate-pulse'
                      : getDaysUntilExpiration(center) <= 30
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 animate-pulse'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                  ]"
                >
                  <svg class="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {{ getDaysUntilExpiration(center) <= 0 ? 'Renew Expired Registration' : 'Renew Registration' }}
                </button>
              </div>
            </div>
          </div>
        </div>
    </template>

    <!-- Renewal Dialog -->
    <div v-if="showRenewalDialog" class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-gray-900">Renew Training Center</h3>
          <button @click="closeRenewalDialog" class="text-gray-400 hover:text-gray-600 transition-colors duration-200">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="confirmRenewal" class="space-y-6">
          <div v-if="selectedCenter" class="space-y-6">
            <!-- Center Info Card -->
            <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h4 class="font-semibold text-blue-900 mb-3">Center Details</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-blue-700 font-medium">Center Name</p>
                  <p class="text-blue-900">{{ selectedCenter.center_name }}</p>
                </div>
                <div>
                  <p class="text-blue-700 font-medium">Location</p>
                  <p class="text-blue-900">{{ selectedCenter.center_location }}</p>
                </div>
              </div>
            </div>

            <!-- File Upload -->
            <div>
              <label for="attachments" class="block text-sm font-semibold text-gray-700 mb-2">Supporting Documents (Optional)</label>
              <div class="relative">
                <input
                  type="file"
                  id="attachments"
                  @change="handleFileUpload"
                  class="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
              </div>
              <p v-if="selectedFileName" class="mt-2 text-sm text-green-600 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                File selected: {{ selectedFileName }}
              </p>
            </div>

            <!-- Remarks -->
            <div>
              <label for="remarks" class="block text-sm font-semibold text-gray-700 mb-2">Additional Remarks</label>
              <textarea
                id="remarks"
                v-model="renewalFormData.user_remarks"
                rows="4"
                class="block w-full rounded-lg border border-gray-300 p-4 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Any additional information or comments about your renewal application..."
              ></textarea>
            </div>

            <!-- Declaration -->
            <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="declaration"
                    type="checkbox"
                    v-model="renewalFormData.declaration"
                    required
                    class="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </div>
                <div class="ml-3">
                  <label for="declaration" class="font-semibold text-gray-900 text-sm">
                    Declaration <span class="text-red-500">*</span>
                  </label>
                  <p class="text-gray-600 text-sm mt-1 leading-relaxed">
                    I hereby declare that all information provided is true, accurate, and complete. I understand that providing false information may result in the rejection of this renewal application and potential legal consequences.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="isRenewing" class="flex items-center justify-center py-8 text-blue-600">
            <svg class="animate-spin h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="font-medium">Processing your renewal application...</span>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="closeRenewalDialog"
              :disabled="isRenewing"
              class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isRenewing || !renewalFormData.declaration"
              class="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <svg v-if="isRenewing" class="animate-spin h-4 w-4 mr-2 inline" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isRenewing ? 'Submitting...' : 'Submit Renewal Application' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Certificate Dialog Component -->
    <CertificateDialog
      v-if="showCertificateDialog"
      :show="showCertificateDialog"
      :center-data="selectedCenter"
      :cert-type="'teaching-center'"
      @close="closeCertificateDialog"
    />

    <!-- Payment Modal Component -->
    <PaymentModal
      ref="paymentModalRef"
      :amount="100"
      @payment-completed="handlePaymentCompleted"
    />
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'
import apiServices from '@/services/services'
import CertificateDialog from './CertificateDialog.vue'
import PaymentModal from '@/components/common/PaymentModal.vue'

// Reactive data
const instituteTeachingCenters = ref([])
const isLoading = ref(true)
const apiError = ref(false)
const errorMessage = ref('')
const showRenewalDialog = ref(false)
const isRenewing = ref(false)
const selectedCenter = ref(null)
const selectedFile = ref(null)
const selectedFileName = ref('')
const showCertificateDialog = ref(false)
const initialAuthCheckPending = ref(true)
const paymentModalRef = ref(null)

const renewalFormData = ref({
  renewal_document: null,
  user_remarks: '',
  declaration: false,
})

const toast = useToast()
const authStore = useAuthStore()

// Methods
const fetchData = async () => {
  if (!authStore.user?.cid) {
    isLoading.value = false
    initialAuthCheckPending.value = false
    return
  }

  isLoading.value = true
  apiError.value = false
  initialAuthCheckPending.value = false
  const userCid = authStore.user?.cid

  try {
    const response = await apiServices.getMhpcTeachingCenterByCid(userCid)
    const results = response.data.results || []

    const centerMap = new Map()

    results.forEach((item) => {
      const isCapaRecord = !!item.teaching_center
      const tcData = isCapaRecord ? item.teaching_center : item

      if (!tcData || !tcData.id) return

      const tcId = tcData.id
      const existingCenter = centerMap.get(tcId) || tcData
      existingCenter.has_active_capa = existingCenter.has_active_capa || isCapaRecord
      centerMap.set(tcId, existingCenter)
    })

    instituteTeachingCenters.value = Array.from(centerMap.values())
  } catch (error) {
    console.error('Error fetching teaching centers:', error)
    errorMessage.value = error.response?.data?.message || 'Error fetching teaching center data. Please try again.'
    apiError.value = true
  } finally {
    isLoading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch (e) {
    return 'Invalid Date'
  }
}

const getDaysUntilExpiration = (center) => {
  if (!center.valid_till) return 0
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expirationDate = new Date(center.valid_till)
    expirationDate.setHours(0, 0, 0, 0)
    const timeDiff = expirationDate.getTime() - today.getTime()
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
  } catch (e) {
    return 0
  }
}

const isRenewalInProgress = (center) => {
  return ['PENDING', 'AWAITING_PAYMENT'].includes(center.latest_renewal?.renewal_status)
}

const getExpirationTextClass = (center) => {
  if (!center.valid_till) return 'text-gray-700'
  const days = getDaysUntilExpiration(center)
  if (days <= 0) return 'text-red-600 font-semibold'
  if (days <= 30) return 'text-orange-600 font-semibold'
  return 'text-gray-700'
}

const getStatusPillClass = (center) => {
  if (center.has_active_capa) return 'bg-red-100 text-red-800 border border-red-200 px-3 py-1 text-xs font-medium rounded-full'
  if (isPaymentRequired(center)) return 'bg-yellow-100 text-yellow-800 border border-yellow-200 px-3 py-1 text-xs font-medium rounded-full'
  if (center.valid_till && getDaysUntilExpiration(center) <= 0) return 'bg-red-100 text-red-800 border border-red-200 px-3 py-1 text-xs font-medium rounded-full'
  if (center.is_active) return 'bg-green-100 text-green-800 border border-green-200 px-3 py-1 text-xs font-medium rounded-full'
  return 'bg-gray-100 text-gray-800 border border-gray-200 px-3 py-1 text-xs font-medium rounded-full'
}

const getReviewDecisionPillClass = (center) => {
  const decision = String(center.tc_review_decision_display || center.tc_review_decision).toLowerCase()
  if (decision === 'approved') {
    return center.is_active ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
  }
  if (decision.includes('pending')) return 'bg-yellow-100 text-yellow-800'
  if (decision.includes('regretted') || decision.includes('rejected')) return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-700'
}

const isPaymentRequired = (center) => {
  const initialPayment = center.payment_status === 'awaiting_payment'
  const renewalPayment = center.latest_renewal?.renewal_status === 'AWAITING_PAYMENT'
  return initialPayment || renewalPayment
}

const getStatusText = (center) => {
  if (center.has_active_capa) return 'CAPA Active - Renewal Blocked'
  if (isPaymentRequired(center)) {
    if (center.latest_renewal?.renewal_status === 'AWAITING_PAYMENT') {
      return 'Renewal Approved - Payment Required'
    }
    return 'Approved - Payment Required'
  }
  if (center.valid_till && getDaysUntilExpiration(center) <= 0) return 'Registration Expired'
  if (center.is_active) return 'Active & Valid'
  return 'Inactive'
}

const getStatusTextClass = (center) => {
  if (center.has_active_capa) return 'text-red-600 font-semibold'
  if (isPaymentRequired(center)) return 'text-yellow-600 font-semibold'
  if (center.valid_till && getDaysUntilExpiration(center) <= 0) return 'text-red-600 font-semibold'
  if (center.is_active) return 'text-green-600 font-semibold'
  return 'text-gray-600'
}

const getPaymentStatusText = (center) => {
  if (center.latest_renewal?.renewal_status === 'AWAITING_PAYMENT') return 'Renewal Payment Pending'
  if (center.payment_status === 'awaiting_payment') return 'Initial Payment Pending'
  if (center.is_payment_complete || center.latest_renewal?.payment_status === 'completed') return 'Payment Completed'
  return 'No Payment Required'
}

const getPaymentStatusTextClass = (center) => {
  if (isPaymentRequired(center)) return 'text-yellow-600 font-semibold'
  return center.is_payment_complete ? 'text-green-600 font-semibold' : 'text-gray-600'
}

const canRenew = (center) => {
  if (center.has_active_capa) return false
  const isApproved = center.tc_review_decision === 'Approved'
  const daysUntilExpiration = getDaysUntilExpiration(center)
  const isExpiringOrExpired = daysUntilExpiration <= 90
  const notRenewing = !isRenewalInProgress(center)
  const noPaymentRequired = !isPaymentRequired(center)
  return isApproved && isExpiringOrExpired && notRenewing && noPaymentRequired
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    selectedFileName.value = file.name
  } else {
    selectedFile.value = null
    selectedFileName.value = ''
  }
}

const openRenewalDialog = (center) => {
  if (center.has_active_capa) {
    toast.error('Cannot renew: This teaching center has pending CAPA that must be resolved first.')
    return
  }

  selectedCenter.value = { ...center }
  renewalFormData.value = {
    renewal_document: null,
    user_remarks: '',
    declaration: false,
  }
  selectedFile.value = null
  selectedFileName.value = ''
  showRenewalDialog.value = true
}

const closeRenewalDialog = () => {
  showRenewalDialog.value = false
  selectedCenter.value = null
}

const confirmRenewal = async () => {
  if (!selectedCenter.value || !renewalFormData.value.declaration) {
    toast.error('Please accept the declaration.')
    return
  }

  if (selectedCenter.value.has_active_capa) {
    toast.error('Cannot proceed: This teaching center has pending CAPA that must be resolved first.')
    closeRenewalDialog()
    return
  }

  isRenewing.value = true
  try {
    const formDataPayload = new FormData()
    formDataPayload.append('user_remarks', renewalFormData.value.user_remarks || '')
    if (selectedFile.value) {
      formDataPayload.append('renewal_document', selectedFile.value)
    }

    await apiServices.createTeachingCenterRenewal(selectedCenter.value.id, formDataPayload)
    await fetchData()
    toast.success('Teaching center renewal application submitted successfully!')
    closeRenewalDialog()
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.response?.data?.[0] || 'Failed to submit renewal application.'
    toast.error(errorMsg)
  } finally {
    isRenewing.value = false
  }
}

const openCertificateDialog = (center) => {
  selectedCenter.value = center
  showCertificateDialog.value = true
}

const closeCertificateDialog = () => {
  showCertificateDialog.value = false
  selectedCenter.value = null
}

const initiatePayment = (center) => {
  selectedCenter.value = center
  if (paymentModalRef.value) {
    paymentModalRef.value.openModal()
  } else {
    toast.error('Payment functionality is currently unavailable.')
    console.error('PaymentModal reference is not available.')
  }
}

const handlePaymentCompleted = async (paymentData) => {
  if (!selectedCenter.value) {
    toast.error('No center selected for payment.')
    return
  }

  isLoading.value = true
  const paymentId = paymentData.paymentHash
  const isForRenewal = selectedCenter.value.latest_renewal?.renewal_status === 'AWAITING_PAYMENT'
  let redirectUrl = null
  const user = authStore.user

  if (!user || !user.id || !user.cid || !user.email) {
    toast.error('User information is missing. Please log in again.')
    isLoading.value = false
    return
  }

  try {
    const paymentGatewayFormData = new FormData()
    paymentGatewayFormData.append('refNo', paymentId)
    paymentGatewayFormData.append('serviceCode', '102828')
    paymentGatewayFormData.append('taxPayerName', selectedCenter.value.institute_details?.name_of_institution || user.cid)
    paymentGatewayFormData.append('taxPayerNo', user.cid)
    paymentGatewayFormData.append('taxPayerDocumentNo', user.cid)
    paymentGatewayFormData.append('totalPayableAmount', 100)
    paymentGatewayFormData.append('payableAmount', 100)
    paymentGatewayFormData.append('description', isForRenewal ? 'MHPC Teaching Center Renewal Fee' : 'MHPC Teaching Center Initial Fee')
    paymentGatewayFormData.append('mobileNo', user.contact_number || '17110000')
    paymentGatewayFormData.append('payerEmail', user.email)
    paymentGatewayFormData.append('user', user.id)
    paymentGatewayFormData.append('application_no', selectedCenter.value.id)
    paymentGatewayFormData.append('app_type', 'mhpc_teaching_center')

    const paymentResponse = await apiServices.makePayment(paymentGatewayFormData)
    if (paymentResponse.data?.content?.redirectUrl) {
      redirectUrl = paymentResponse.data.content.redirectUrl
    }

    const payload = { payment_id: paymentId }
    if (isForRenewal) {
      const renewalId = selectedCenter.value.latest_renewal.id
      const centerId = selectedCenter.value.id
      await apiServices.confirmTeachingCenterRenewalPayment(centerId, renewalId, payload)
    } else {
      await apiServices.confirmInitialCenterPayment(selectedCenter.value.id, payload)
    }

    toast.success('Payment initiated successfully. Redirecting for payment completion. A link has also been sent to your email.', { timeout: 8000 })

    if (redirectUrl) {
      window.open(redirectUrl, '_blank')
    }

    await fetchData()
  } catch (error) {
    console.error('Payment handling error:', error.response || error)
    const errorMsg = error.response?.data?.error || error.response?.data?.detail || 'An error occurred while confirming your payment.'
    toast.error(`${errorMsg} Please contact support.`)
  } finally {
    isLoading.value = false
    if (paymentModalRef.value) {
      paymentModalRef.value.closeModal()
    }
  }
}

// Watchers and lifecycle hooks
watch(
  () => authStore.user,
  (newUser) => {
    initialAuthCheckPending.value = false
    if (newUser?.cid && (!instituteTeachingCenters.value.length || isLoading.value)) {
      if (isLoading.value && instituteTeachingCenters.value.length === 0) {
        fetchData()
      }
    }
  },
  { deep: true, immediate: true }
)

onMounted(async () => {
  if (authStore.user?.cid && instituteTeachingCenters.value.length === 0 && isLoading.value) {
    await fetchData()
  }
  setTimeout(() => {
    if (initialAuthCheckPending.value) {
      initialAuthCheckPending.value = false
      if (!authStore.user?.cid && isLoading.value) {
        isLoading.value = false
      }
    }
  }, 1500)
})
</script>
