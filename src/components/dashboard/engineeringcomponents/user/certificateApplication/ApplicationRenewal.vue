<template>
  <div class="w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
    <PageHeader :title="pageHeaderTitle" :subtitle="pageHeaderSubtitle">
      <template #icon>
        <RefreshCw class="w-6 h-6 text-indigo-600" />
      </template>
    </PageHeader>

    <div v-if="engineeringStore.visibleMenus.hasRenewalInProgress"
      class="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-5 sm:p-6 mb-8 rounded-xl shadow-sm">
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
            <router-link to="/admin/user/engineering_certification/my_applications"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm">
              <ClipboardList class="h-4 w-4 mr-2" />
              View My Applications
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

      <div v-else-if="loadError" class="bg-red-50 border border-red-200 rounded-xl p-5 sm:p-6 my-6 shadow-sm">
        <div class="flex">
          <div class="flex-shrink-0">
            <AlertTriangle class="h-6 w-6 text-red-400" />
          </div>
          <div class="ml-3">
            <h3 class="sm:text-lg font-medium text-red-800">Error Loading Data</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ loadError }}</p>
            </div>
            <div class="mt-4">
              <button type="button" @click="fetchApplicationData"
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200">
                <RefreshCw class="h-4 w-4 mr-1.5" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!isEligibleForRenewal && !isLoading"
        class="bg-yellow-50 border border-yellow-200 rounded-xl p-5 sm:p-6 mb-8 shadow-sm">
        <div class="flex">
          <div class="flex-shrink-0">
            <AlertCircle class="h-6 w-6 text-yellow-500" />
          </div>
          <div class="ml-3">
            <h3 class="sm:text-lg font-medium text-yellow-800">
              {{ renewalType === 're-registration' ? 'Re-registration' : 'Renewal' }} Not Eligible
            </h3>
            <div class="mt-2 text-sm text-yellow-700">
              <p>
                {{ renewalEligibilityMessage }}
              </p>
              <p class="mt-2">
                Renewal is allowed if your qualification:
              </p>
              <ul class="list-disc ml-5 mt-2 space-y-1">
                <li>Expires within the next 3 months.</li>
                <li>Has already expired.</li>
              </ul>
            </div>
            <div class="mt-4">
              <button type="button" @click="handleCancel"
                class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-200">
                <ArrowLeft class="h-4 w-4 mr-1.5" />
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div v-if="false">
          <div class="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-5 sm:p-6 rounded-t-xl">
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
              <label class="block text-sm font-medium text-gray-700">CID No./Identity/Work Permit No.</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard class="h-4 w-4 text-gray-400" />
                </div>
                <input type="text" v-model="formData.cid_no" disabled
                  class="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Full Name</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User class="h-4 w-4 text-gray-400" />
                </div>
                <input type="text" v-model="formData.full_name" disabled
                  class="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gender</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users class="h-4 w-4 text-gray-400" />
                </div>
                <input type="text" v-model="formData.gender" disabled
                  class="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar class="h-4 w-4 text-gray-400" />
                </div>
                <input type="text" :value="formatDisplayDate(formData.date_of_birth)" disabled
                  class="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Contact Number</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone class="h-4 w-4 text-gray-400" />
                </div>
                <input type="text" v-model="formData.contact_no" disabled
                  class="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
              </div>
            </div>
            <div v-if="formData.email_address">
              <label class="block text-sm font-medium text-gray-700">Email Address</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail class="h-4 w-4 text-gray-400" />
                </div>
                <input type="text" v-model="formData.email_address" disabled
                  class="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Village</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Home class="h-4 w-4 text-gray-400" />
                </div>
                <input type="text" v-model="formData.village" disabled
                  class="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Gewog</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin class="h-4 w-4 text-gray-400" />
                </div>
                <input type="text" v-model="formData.gewog" disabled
                  class="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Dzongkhag</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Map class="h-4 w-4 text-gray-400" />
                </div>
                <input type="text" v-model="formData.dzongkhag" disabled
                  class="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
              </div>
            </div>
            <div class="col-span-1 md:col-span-1">
              <div :class="[
                'rounded-lg p-4 sm:p-5 border',
                hasExpired
                  ? 'bg-red-50 border-red-200'
                  : isExpiringWithin3Months
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-blue-50 border-blue-200',
              ]">
                <div class="flex items-center">
                  <div :class="[
                    'rounded-full p-1.5 mr-2',
                    hasExpired
                      ? 'bg-red-100'
                      : isExpiringWithin3Months
                        ? 'bg-yellow-100'
                        : 'bg-blue-100',
                  ]">
                    <Clock class="h-5 w-5" :class="[
                      hasExpired
                        ? 'text-red-600'
                        : isExpiringWithin3Months
                          ? 'text-yellow-600'
                          : 'text-blue-600',
                    ]" />
                  </div>
                  <span :class="[
                    'text-sm font-medium',
                    hasExpired
                      ? 'text-red-900'
                      : isExpiringWithin3Months
                        ? 'text-yellow-900'
                        : 'text-blue-900',
                  ]">Qualification Information</span>
                </div>
                <div class="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <div :class="[
                      'text-xs sm:text-sm',
                      hasExpired
                        ? 'text-red-700'
                        : isExpiringWithin3Months
                          ? 'text-yellow-700'
                          : 'text-blue-700',
                    ]">
                      Registration Date
                    </div>
                    <div :class="[
                      'text-xs sm:text-sm font-medium',
                      hasExpired
                        ? 'text-red-900'
                        : isExpiringWithin3Months
                          ? 'text-yellow-900'
                          : 'text-blue-900',
                    ]">
                      {{ formatDisplayDate(formData.registration_date) }}
                    </div>
                  </div>
                  <div>
                    <div :class="[
                      'text-xs sm:text-sm',
                      hasExpired
                        ? 'text-red-700'
                        : isExpiringWithin3Months
                          ? 'text-yellow-700'
                          : 'text-blue-700',
                    ]">
                      Expiry Date
                    </div>
                    <div class="flex items-center">
                      <div :class="[
                        'text-xs sm:text-sm font-medium',
                        hasExpired
                          ? 'text-red-900'
                          : isExpiringWithin3Months
                            ? 'text-yellow-900'
                            : 'text-blue-900',
                      ]">
                        {{ formatDisplayDate(formData.expiry_date) }}
                      </div>
                      <span v-if="hasExpired"
                        class="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full flex items-center">
                        <AlertOctagon class="h-3 w-3 mr-1" />Expired
                      </span>
                      <span v-else-if="isExpiringWithin3Months"
                        class="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full flex items-center">
                        <Clock class="h-3 w-3 mr-1" />Expiring Soon
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-span-1 md:col-span-1">
              <div class="rounded-lg p-4 sm:p-5 border" :class="formData.is_active
                ? 'bg-green-50 border-green-200'
                : 'bg-yellow-50 border-yellow-200'
                ">
                <div class="flex items-center">
                  <div :class="[
                    'rounded-full p-1.5 mr-2',
                    formData.is_active ? 'bg-green-100' : 'bg-yellow-100',
                  ]">
                    <Tag class="h-5 w-5" :class="formData.is_active ? 'text-green-600' : 'text-yellow-600'" />
                  </div>
                  <span class="text-sm font-medium"
                    :class="formData.is_active ? 'text-green-900' : 'text-yellow-900'">Registration Status</span>
                </div>
                <div class="mt-3">
                  <div class="flex items-center">
                    <span :class="[
                      'py-1 px-2 text-xs rounded-md font-medium',
                      formData.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800',
                    ]">{{ formData.is_active ? 'Active' : 'Inactive' }}</span>
                    <span class="ml-2 text-xs" :class="formData.is_active ? 'text-green-700' : 'text-yellow-700'">{{
                      formData.is_active
                        ? 'Your registration is currently active'
                        : 'Your registration needs to be renewed or reactivated'
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-5 sm:p-6">
          <div class="flex items-center space-x-2">
            <Award class="h-5 w-5 text-blue-600" />
            <h3 class="text-base sm:text-lg font-semibold text-gray-900">
              CPD Score Details (Approved Records)
            </h3>
          </div>
          <p class="mt-1 text-xs sm:text-sm text-gray-500 ml-7">
            Minimum 30 points recommended for renewal. Score is based on approved activities.
          </p>
          <div class="mt-4">
            <div v-if="isCpdLoading" class="flex justify-center items-center p-8">
              <Loader class="h-8 w-8 text-blue-500 animate-spin" />
            </div>
            <div v-else-if="cpdLoadError" class="bg-red-50 border border-red-200 rounded-lg p-4">
              <div class="flex">
                <AlertTriangle class="h-5 w-5 text-red-400 flex-shrink-0" />
                <div class="ml-3">
                  <h4 class="text-sm font-medium text-red-800">Failed to load CPD data</h4>
                  <p class="mt-1 text-xs text-red-700">{{ cpdLoadError }}</p>
                </div>
              </div>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div class="bg-white border rounded-lg shadow-sm overflow-hidden">
                <div class="p-4 sm:p-5">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="text-sm font-medium text-gray-900">Total Approved CPD Points</h4>
                      <p class="text-xs text-gray-500 mt-0.5">Minimum 30 points recommended</p>
                    </div>
                    <div class="rounded-full h-10 w-10 flex items-center justify-center" :class="cpdCardClass">
                      <Award class="h-5 w-5" :class="cpdIconClass" />
                    </div>
                  </div>
                  <div class="mt-4">
                    <div class="relative pt-1">
                      <div class="flex items-center justify-between">
                        <div>
                          <span class="text-xs font-semibold inline-block py-1 px-2 rounded-full"
                            :class="cpdTextClass">{{
                              getTotalCpdPoints }} / 30 Points</span>
                        </div>
                        <div class="text-right">
                          <span class="text-xs font-semibold inline-block text-gray-600">{{ Math.min(100,
                            Math.round((getTotalCpdPoints / 30) * 100)) }}% of
                            Recommended</span>
                        </div>
                      </div>
                      <div class="overflow-hidden h-2 mt-2 text-xs flex rounded bg-gray-200">
                        <div :style="{
                          width: `${Math.min(100, Math.round((getTotalCpdPoints / 30) * 100))}%`,
                        }" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                          :class="cpdProgressClass"></div>
                      </div>
                    </div>
                  </div>
                  <div class="mt-4 p-3 rounded-lg text-sm" :class="cpdMessageBgClass">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <component :is="cpdIcon" class="h-5 w-5 mr-2" :class="cpdMessageIconColor" />
                      </div>
                      <div>
                        <p class="font-medium">{{ cpdMessage }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-white border rounded-lg shadow-sm overflow-hidden">
                <div class="bg-gray-50 border-b px-4 py-3">
                  <h4 class="text-sm font-medium text-gray-900">Recent Approved CPD Activities</h4>
                </div>
                <div class="p-4 max-h-60 overflow-y-auto">
                  <div v-if="cpdRecords.filter((r) => r.review_status === 'Approved').length === 0"
                    class="text-center py-4 text-gray-500 text-sm">
                    No approved CPD records found
                  </div>
                  <ul v-else class="space-y-3">
                    <li v-for="record in cpdRecords
                      .filter((r) => r.review_status === 'Approved')
                      .slice(0, 5)" :key="record.id"
                      class="flex items-start p-2 hover:bg-gray-50 rounded-lg transition-colors duration-150">
                      <div class="flex-shrink-0 mt-1">
                        <FileText class="h-4 w-4 text-gray-400" />
                      </div>
                      <div class="ml-2 flex-1">
                        <div class="flex justify-between">
                          <p class="text-xs font-medium text-gray-900 truncate">
                            {{ record.title_of_cpd || 'Untitled Activity' }}
                          </p>
                          <span class="text-xs text-gray-500">{{
                            formatDisplayDate(record.registration_date)
                            }}</span>
                        </div>
                        <p class="text-xs text-gray-500 mt-0.5 truncate">
                          {{ record.type_of_cpd_activity_display || 'N/A' }}
                        </p>
                        <div class="flex items-center mt-1">
                          <span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">{{
                            record.cpd_credit || 0 }} points</span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!isSubmitting">
          <div class="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-5 sm:p-6">
            <div class="flex items-center space-x-2">
              <RefreshCw class="h-5 w-5 text-blue-600" />
              <h3 class="text-base sm:text-lg font-semibold text-gray-900">
                {{ renewalType === 're-registration' ? 'Re-registration' : 'Renewal' }} Confirmation
              </h3>
            </div>
            <p class="mt-1 text-xs sm:text-sm text-gray-500 ml-7">
              Confirm your application details and submit for
              {{ renewalType === 're-registration' ? 're-registration' : 'renewal' }}. Payment will be handled at a
              later stage.
            </p>
            <div class="mt-5 p-4 sm:p-5 rounded-lg bg-white border shadow-sm">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="flex flex-col items-center p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <Calendar class="h-6 w-6 text-blue-600 mb-2" />
                  <p class="text-xs text-gray-500">Current Expiry</p>
                  <p class="font-medium text-sm">{{ formatDisplayDate(formData.expiry_date) }}</p>
                </div>
                <div class="flex flex-col items-center p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <ArrowRight class="h-6 w-6 text-blue-600 mb-2" />
                  <p class="text-xs text-gray-500">New Expiry (Projected)</p>
                  <p class="font-medium text-sm">{{ formatDisplayDate(getNewExpiryDate) }}</p>
                </div>
                <div class="flex flex-col items-center p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <Clock class="h-6 w-6 text-blue-600 mb-2" />
                  <p class="text-xs text-gray-500">Extension Period</p>
                  <p class="font-medium text-sm">5 Years</p>
                </div>
              </div>
              <div class="mt-4 p-3 rounded-lg border border-blue-100 bg-blue-50">
                <div class="flex">
                  <AlertCircle class="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                  <p class="text-xs text-blue-700">
                    By submitting this
                    {{ renewalType === 're-registration' ? 're-registration' : 'renewal' }}
                    application, your qualification will be extended for 5 years upon approval (new
                    projected expiry date shown above).
                    <span v-if="cpdStatus === 'below_minimum' || cpdStatus === 'none'">
                      Note: Your CPD score is below the recommended 30 points, but you can still
                      proceed with the
                      {{ renewalType === 're-registration' ? 're-registration' : 'renewal' }} if
                      other criteria are met.</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-5">
              <label class="block text-sm font-medium text-gray-700">Remarks (Optional)</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                  <MessageSquare class="h-4 w-4 text-gray-400" />
                </div>
                <textarea v-model="remarks" rows="3"
                  class="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                  placeholder="Enter any additional information or remarks for your renewal application"></textarea>
              </div>
            </div>
            <div class="mt-6">
              <div class="flex items-start space-x-3 bg-white p-4 rounded-lg border shadow-sm">
                <div class="flex items-center h-5 mt-0.5">
                  <input type="checkbox" id="declaration" v-model="declaration"
                    class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </div>
                <label for="declaration" class="text-sm text-gray-700">I hereby declare that all the information
                  provided is
                  true and correct to the
                  best of my knowledge. I understand that any false statements may result in the
                  rejection of my
                  {{ renewalType === 're-registration' ? 're-registration' : 'renewal' }}
                  application.</label>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-4 p-5 sm:p-6 bg-gray-50 border-t">
            <button @click="handleCancel" :disabled="isSubmitting"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
              <X class="h-4 w-4 mr-1.5" />
              Cancel
            </button>
            <button @click="handleSubmit" :disabled="isSubmitting || !declaration || !isEligibleForRenewal"
              class="px-4 py-2 bg-blue-600 text-sm font-medium text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
              <Check class="h-4 w-4 mr-1.5" />
              Submit
              {{ renewalType === 're-registration' ? 'Re-registration' : 'Renewal' }}
            </button>
          </div>
        </div>

        <div v-else class="border-t border-gray-200 bg-gray-50 p-5 sm:p-6 text-center">
          <div class="inline-block">
            <Loader class="h-10 w-10 text-blue-500 animate-spin" />
          </div>
          <p class="mt-4 text-gray-700">
            Submitting your
            {{ renewalType === 're-registration' ? 're-registration' : 'renewal' }} application...
          </p>
        </div>
      </div>

      <Dialog :open="showConfirmation" @close="showConfirmation = false" class="relative z-50">
        <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div class="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div class="text-center">
              <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <RefreshCw class="h-6 w-6 text-blue-600" />
              </div>
              <DialogTitle as="h3" class="text-lg font-medium text-gray-900 mt-4">Confirm
                {{ renewalType === 're-registration' ? 'Re-registration' : 'Renewal' }}
                Application</DialogTitle>
              <div class="mt-3">
                <p class="text-sm text-gray-500">
                  You are about to submit your
                  {{ renewalType === 're-registration' ? 're-registration' : 'renewal' }}
                  application. Payment will be handled later. This action cannot be undone. Are you
                  sure you want to proceed?
                </p>
                <div class="mt-4 p-3 bg-yellow-50 rounded-lg text-left">
                  <div class="flex">
                    <AlertCircle class="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                    <div>
                      <p class="text-xs text-yellow-700">
                        Upon approval, your new expiry date will be around
                        <span class="font-medium">{{ formatDisplayDate(getNewExpiryDate) }}</span>.
                        <span v-if="cpdStatus === 'below_minimum' || cpdStatus === 'none'">
                          Note: Your CPD score is below the recommended minimum.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-6 flex justify-end space-x-3">
              <button type="button"
                class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                @click="showConfirmation = false">
                Cancel
              </button>
              <button type="button"
                class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                @click="confirmSubmit">
                Confirm
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/services'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'
import { useEngineeringCertificationStore } from '@/stores/engineeringNavigationStore'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import relativeTime from 'dayjs/plugin/relativeTime'

import PageHeader from '@/components/common/MHPC/PageHeader.vue'

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
  Award,
  MessageSquare,
  ClipboardList,
  FileText,
  CheckCircle,
  Info,
} from 'lucide-vue-next'

dayjs.extend(isBetween)
dayjs.extend(isSameOrBefore)
dayjs.extend(relativeTime)

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const engineeringStore = useEngineeringCertificationStore()

const formData = ref({
  cid_no: '',
  full_name: '',
  gender: '',
  date_of_birth: '',
  contact_no: '',
  email_address: '',
  village: '',
  gewog: '',
  dzongkhag: '',
  registration_date: '',
  expiry_date: '',
  id: null,
  registration_type: null,
  is_active: false,
  qualification_id_to_renew: null,
})
const cpdRecords = ref([])
const isCpdLoading = ref(false)
const cpdLoadError = ref('')

const showConfirmation = ref(false)
const isLoading = ref(true)
const isSubmitting = ref(false)
const loadError = ref('')
const declaration = ref(false)
const remarks = ref('')

const today = computed(() => dayjs())
const expiryDate = computed(() =>
  formData.value.expiry_date ? dayjs(formData.value.expiry_date) : null
)
const threeMonthsFromNow = computed(() => today.value.add(3, 'month'))
const hasExpired = computed(() =>
  expiryDate.value ? expiryDate.value.isBefore(today.value, 'day') : false
)
const isExpiringWithin3Months = computed(() => {
  if (!expiryDate.value || hasExpired.value) return false
  return expiryDate.value.isBetween(today.value, threeMonthsFromNow.value, 'day', '[]')
})

const renewalType = computed(() => {
  return hasExpired.value ? 're-registration' : 'renewal';
});

const pageHeaderTitle = computed(() => {
  return renewalType.value === 're-registration' ? 'Re-registration Application' : 'Renewal Application';
});

const pageHeaderSubtitle = computed(() => {
  const baseSubtitle = 'Please review your personal details, CPD scores, and other requirements to ensure your eligibility for ';
  return baseSubtitle + (renewalType.value === 're-registration' ? 're-registration.' : 'renewal.');
});

const isEligibleForRenewal = computed(() => {
  if (isLoading.value || loadError.value) return false
  if (!formData.value.qualification_id_to_renew) return false
  if (!expiryDate.value || !expiryDate.value.isValid()) return false

  return isExpiringWithin3Months.value || hasExpired.value
})

const renewalEligibilityMessage = computed(() => {
  if (isLoading.value) return 'Loading eligibility data...'
  if (loadError.value) return `Error determining eligibility: ${loadError.value}`

  if (!formData.value.qualification_id_to_renew)
    return 'No valid qualification identified for renewal.'
  if (!expiryDate.value || !expiryDate.value.isValid())
    return 'Cannot determine eligibility without a valid qualification expiry date.'

  if (!(isExpiringWithin3Months.value || hasExpired.value)) {
    return 'Your qualification is currently not eligible for renewal based on its expiry date (must be expiring within 3 months or already expired).'
  }
  return 'Your qualification is currently not eligible for renewal. Please review the requirements.'
})

const getNewExpiryDate = computed(() => {
  if (!expiryDate.value) return dayjs().add(5, 'year').toDate()
  const baseDate = hasExpired.value ? dayjs() : expiryDate.value
  return baseDate.add(5, 'year').toDate()
})

const getTotalCpdPoints = computed(() => {
  if (!cpdRecords.value || cpdRecords.value.length === 0) return 0
  return cpdRecords.value
    .filter((record) => record.review_status === 'Approved')
    .reduce((total, record) => total + (Number(record.cpd_credit) || 0), 0)
})

const cpdStatus = computed(() => {
  const points = getTotalCpdPoints.value
  if (points >= 30) return 'met'
  if (points > 0) return 'below_minimum'
  return 'none'
})

const cpdMessage = computed(() => {
  const points = getTotalCpdPoints.value
  switch (cpdStatus.value) {
    case 'met':
      return `Good job! You have ${points} CPD points, meeting or exceeding the recommended 30 points.`
    case 'below_minimum':
      return `Warning: Your CPD score is ${points} points. While the recommended score is 30, you can still proceed with ${renewalType.value} if other criteria are met. We encourage improving your score.`
    case 'none':
      return `Warning: You currently have 0 approved CPD points. The recommended score is 30. You can still proceed with ${renewalType.value} if other criteria are met, but acquiring CPD points is highly recommended.`
    default:
      return 'Checking your CPD score status...'
  }
})

const cpdIcon = computed(() => {
  switch (cpdStatus.value) {
    case 'met':
      return CheckCircle
    case 'below_minimum':
    case 'none':
      return AlertTriangle
    default:
      return Info
  }
})

const cpdCardClass = computed(() => {
  switch (cpdStatus.value) {
    case 'met':
      return 'bg-green-100'
    case 'below_minimum':
    case 'none':
      return 'bg-yellow-100'
    default:
      return 'bg-gray-100'
  }
})

const cpdIconClass = computed(() => {
  switch (cpdStatus.value) {
    case 'met':
      return 'text-green-600'
    case 'below_minimum':
    case 'none':
      return 'text-yellow-600'
    default:
      return 'text-gray-600'
  }
})

const cpdProgressClass = computed(() => {
  switch (cpdStatus.value) {
    case 'met':
      return 'bg-green-500'
    case 'below_minimum':
    case 'none':
      return 'bg-yellow-500'
    default:
      return 'bg-gray-500'
  }
})

const cpdTextClass = computed(() => {
  switch (cpdStatus.value) {
    case 'met':
      return 'bg-green-200 text-green-800'
    case 'below_minimum':
    case 'none':
      return 'bg-yellow-200 text-yellow-800'
    default:
      return 'bg-gray-200 text-gray-800'
  }
})

const cpdMessageBgClass = computed(() => {
  switch (cpdStatus.value) {
    case 'met':
      return 'bg-green-50 text-green-800'
    case 'below_minimum':
    case 'none':
      return 'bg-yellow-50 text-yellow-800'
    default:
      return 'bg-gray-50 text-gray-800'
  }
})

const cpdMessageIconColor = computed(() => {
  switch (cpdStatus.value) {
    case 'met':
      return 'text-green-500'
    case 'below_minimum':
    case 'none':
      return 'text-yellow-500'
    default:
      return 'text-gray-500'
  }
})

onMounted(async () => {
  await engineeringStore.initialize()
  if (!engineeringStore.visibleMenus.hasRenewalInProgress) {
    await fetchApplicationData()
  } else {
    isLoading.value = false
  }
})

const fetchApplicationData = async () => {
  isLoading.value = true
  loadError.value = ''
  try {
    const userCid = authStore.user?.cid
    if (!userCid) throw new Error('User CID not found. Please log in.')


    const response = await apiService.getEpcNewApplications({ params: { cid: userCid } })

    let applications = []
    if (Array.isArray(response.data)) {
      applications = response.data
    } else if (response.data && Array.isArray(response.data.results)) {
      applications = response.data.results
    } else {
      throw new Error('Unexpected response format fetching applications list.')
    }

    console.log('Filtered applications returned from API for this CID:', applications);

    if (applications.length === 0) {
      throw new Error('No existing application found for your CID. Cannot proceed with renewal.')
    }

    const sortedActiveApplications = applications
      .filter(app => app.is_active === true)
      .sort((a, b) => dayjs(b.updated_at).isAfter(dayjs(a.updated_at)) ? 1 : -1);

    console.log('Sorted ACTIVE applications:', sortedActiveApplications);

    const latestApplication = sortedActiveApplications[0];

    if (!latestApplication || !latestApplication.id) {
      throw new Error('Could not find a suitable active application record for renewal.')
    }

    console.log('Selected latest application record:', latestApplication);

    formData.value = {
      id: latestApplication.id,
      cid_no: latestApplication.cid_no || '',
      full_name: latestApplication.full_name || '',
      gender: latestApplication.gender || '',
      date_of_birth: latestApplication.date_of_birth || '',
      contact_no: latestApplication.contact_no || '',
      email_address: latestApplication.email_address || '',
      village: latestApplication.village || '',
      gewog: latestApplication.gewog || '',
      dzongkhag: latestApplication.dzongkhag || '',
      registration_date: '',
      expiry_date: '',
      registration_type: null,
      is_active: false,
      qualification_id_to_renew: null,
    }

    // Now, get the detailed view of the CORRECT latest application
    const applicationDetailsResponse = await apiService.getEpcNewApplication(latestApplication.id)
    const detailedApplication = applicationDetailsResponse.data

    if (
      !detailedApplication ||
      !detailedApplication.user_qualifications ||
      detailedApplication.user_qualifications.length === 0
    ) {
      throw new Error(
        'No qualifications found on the application. Cannot determine renewal eligibility.'
      )
    }

    let primaryQualification = detailedApplication.user_qualifications.find(
      (q) => q.is_primary_qualification === true
    )
    if (!primaryQualification && detailedApplication.user_qualifications.length > 0) {
      console.warn("No primary qualification found. Falling back to the one with the latest valid expiry date.");
      const sortedQualifications = [...detailedApplication.user_qualifications].sort((a, b) => {
        const dateA = dayjs(a.expiry_date)
        const dateB = dayjs(b.expiry_date)
        if (!dateA.isValid()) return 1
        if (!dateB.isValid()) return -1
        return dateB.isAfter(dateA) ? 1 : -1
      })
      primaryQualification = sortedQualifications[0]
    }

    if (
      !primaryQualification ||
      !primaryQualification.id ||
      !primaryQualification.expiry_date ||
      !dayjs(primaryQualification.expiry_date).isValid()
    ) {
      throw new Error(
        'Could not find a valid primary qualification with a valid expiry date for renewal.'
      )
    }

    console.log('%c SETTING EXPIRY DATE TO:', 'color: #00ff00; font-weight: bold;', primaryQualification.expiry_date);

    formData.value.expiry_date = primaryQualification.expiry_date
    formData.value.qualification_id_to_renew = primaryQualification.id
    if (primaryQualification.registration_date) {
      formData.value.registration_date = primaryQualification.registration_date
    }
    if (typeof primaryQualification.is_active === 'boolean') {
      formData.value.is_active = primaryQualification.is_active
    }

    await fetchCpdRecords(userCid)
  } catch (error) {
    console.error('Error fetching application data:', error)
    loadError.value = error.message || 'Failed to load application data. Please try again.'
    formData.value = {
      ...formData.value,
      id: null,
      expiry_date: null,
      is_active: false,
      qualification_id_to_renew: null,
    }
  } finally {
    isLoading.value = false
  }
}


const fetchCpdRecords = async (cid) => {
  if (!cid) {
    cpdLoadError.value = 'Cannot fetch CPD records without a CID.'
    return
  }
  isCpdLoading.value = true
  cpdLoadError.value = ''
  cpdRecords.value = []
  try {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const response = await apiService.getEpcCpdRecordsByCid(cid)
    cpdRecords.value = response?.data || []
  } catch (error) {
    console.error('Error fetching CPD records:', error)
    cpdLoadError.value =
      error.response?.data?.detail || error.message || 'Failed to load CPD records.'
    cpdRecords.value = []
  } finally {
    isCpdLoading.value = false
  }
}

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
    toast.error(`Submission not allowed: ${renewalEligibilityMessage.value}`)
    return
  }
  showConfirmation.value = true
}

const confirmSubmit = async () => {
  showConfirmation.value = false
  isSubmitting.value = true

  const qualificationIdToRenew = formData.value.qualification_id_to_renew
  if (!qualificationIdToRenew) {
    toast.error('Qualification ID for renewal is missing. Cannot submit application.')
    isSubmitting.value = false
    return
  }

  try {
    const formattedNewExpiryDate = formatDateForAPI(getNewExpiryDate.value)
    if (!formattedNewExpiryDate) {
      throw new Error('Invalid new expiry date calculated.')
    }

    const renewalPayload = {
      user_qualification: qualificationIdToRenew,
      new_expiry_date: formattedNewExpiryDate,
      renewal_remarks: remarks.value || '',
    }

    formData.value.registration_type = renewalType.value;
    renewalPayload.registration_type = formData.value.registration_type;

    const renewalResponse = await apiService.createEpcRenewal(renewalPayload)

    if (renewalResponse && renewalResponse.data && renewalResponse.data.id) {
      toast.success(
        `${renewalType.value === 're-registration' ? 'Re-registration' : 'Renewal'} application submitted successfully! Payment will be processed later. Check "My Applications" for status.`
      )
      await engineeringStore.initialize()
      router.push('/admin/user/engineering_certification/my_applications')
    } else {
      console.warn(
        `${renewalType.value} created, but API response structure might be unexpected.`,
        renewalResponse
      )
      toast.success(
        `${renewalType.value === 're-registration' ? 'Re-registration' : 'Renewal'} application submitted successfully! Check "My Applications" for status. Payment will be handled later.`
      )
      await engineeringStore.initialize()
      router.push('/admin/user/engineering_certification/my_applications')
    }
  } catch (error) {
    console.error(`Error submitting ${renewalType.value}:`, error)
    const errorMsg =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      (typeof error.response?.data === 'object' ? JSON.stringify(error.response.data) : null) ||
      error.message ||
      `Failed to submit ${renewalType.value}. Please try again.`
    toast.error(`Submission Failed: ${errorMsg}`)
  } finally {
    isSubmitting.value = false
  }
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
