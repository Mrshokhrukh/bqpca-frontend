<template>
  <div class="w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
    <PageHeader :title="pageHeaderTitle" :subtitle="pageHeaderSubtitle">
      <template #icon>
        <RefreshCw class="w-6 h-6 text-indigo-600" />
      </template>
    </PageHeader>

    <div
      v-if="healthStore.visibleMenus.hasRenewalInProgress"
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
              to="/admin/user/health_certification/my_applications"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
            >
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

      <div
        v-else-if="loadError"
        class="bg-red-50 border border-red-200 rounded-xl p-5 sm:p-6 my-6 shadow-sm"
      >
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
              <button
                type="button"
                @click="renewalStore.initialize"
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
            <h3 class="sm:text-lg font-medium text-yellow-800">
              {{ renewalType === 're-registration' ? 'Re-registration' : 'Renewal' }} Not Eligible
            </h3>
            <div class="mt-2 text-sm text-yellow-700">
              <p>
                {{ renewalEligibilityMessage }}
              </p>
              <p
                v-if="
                  !hasUnresolvedComplaints &&
                  (!authStore.user?.is_counselor || meetsSupervisionRequirements)
                "
                class="mt-2"
              >
                Renewal is allowed if your qualification:
              </p>
              <ul
                v-if="
                  !hasUnresolvedComplaints &&
                  (!authStore.user?.is_counselor || meetsSupervisionRequirements)
                "
                class="list-disc ml-5 mt-2 space-y-1"
              >
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
        <div v-if="false">
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
              <label class="block text-sm font-medium text-gray-700"
                >CID No./Identity/Work Permit No.</label
              >
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard class="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  v-model="formData.cid_no"
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
                  v-model="formData.contact_no"
                  disabled
                  class="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
                />
              </div>
            </div>
            <div v-if="formData.email_address">
              <label class="block text-sm font-medium text-gray-700">Email Address</label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail class="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  v-model="formData.email_address"
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
                  v-model="formData.village"
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
                  v-model="formData.gewog"
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
                  v-model="formData.dzongkhag"
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
                      {{ formatDisplayDate(formData.registration_date) }}
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
                        {{ formatDisplayDate(formData.expiry_date) }}
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
                    <div
                      class="rounded-full h-10 w-10 flex items-center justify-center"
                      :class="cpdCardClass"
                    >
                      <Award class="h-5 w-5" :class="cpdIconClass" />
                    </div>
                  </div>
                  <div class="mt-4">
                    <div class="relative pt-1">
                      <div class="flex items-center justify-between">
                        <div>
                          <span
                            class="text-xs font-semibold inline-block py-1 px-2 rounded-full"
                            :class="cpdTextClass"
                            >{{ getTotalCpdPoints }} / 30 Points</span
                          >
                        </div>
                        <div class="text-right">
                          <span class="text-xs font-semibold inline-block text-gray-600"
                            >{{ Math.min(100, Math.round((getTotalCpdPoints / 30) * 100)) }}% of
                            Recommended</span
                          >
                        </div>
                      </div>
                      <div class="overflow-hidden h-2 mt-2 text-xs flex rounded bg-gray-200">
                        <div
                          :style="{
                            width: `${Math.min(100, Math.round((getTotalCpdPoints / 30) * 100))}%`,
                          }"
                          class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center"
                          :class="cpdProgressClass"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div class="mt-4 p-3 rounded-lg text-sm" :class="cpdMessageBgClass">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <component
                          :is="cpdIcon"
                          class="h-5 w-5 mr-2"
                          :class="cpdMessageIconColor"
                        />
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
                  <div
                    v-if="!allCpdRecords.some((r) => r.status === 'APPROVED')"
                    class="text-center py-4 text-gray-500 text-sm"
                  >
                    No approved CPD records found
                  </div>
                  <ul v-else class="space-y-3">
                    <li
                      v-for="record in allCpdRecords
                        .filter((r) => r.status === 'APPROVED')
                        .slice(0, 5)"
                      :key="record.id"
                      class="flex items-start p-2 hover:bg-gray-50 rounded-lg transition-colors duration-150"
                    >
                      <div class="flex-shrink-0 mt-1">
                        <FileText class="h-4 w-4 text-gray-400" />
                      </div>
                      <div class="ml-2 flex-1">
                        <div class="flex justify-between">
                          <p class="text-xs font-medium text-gray-900 truncate">
                            {{ record.title || 'Untitled Activity' }}
                          </p>
                          <span class="text-xs text-gray-500">{{
                            formatDisplayDate(record.date)
                          }}</span>
                        </div>
                        <p class="text-xs text-gray-500 mt-0.5 truncate">
                          {{ record.activityTypeName || 'N/A' }}
                        </p>
                        <div class="flex items-center mt-1">
                          <span
                            class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full"
                            >{{ record.credits || 0 }} points</span
                          >
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-5 sm:p-6">
          <div class="flex items-center space-x-2">
            <ShieldAlert class="h-5 w-5 text-red-600" />
            <h3 class="text-base sm:text-lg font-semibold text-gray-900">Complaints Status</h3>
          </div>
          <p class="mt-1 text-xs sm:text-sm text-gray-500 ml-7">
            Review any complaints associated with your registration. Unresolved complaints will
            block renewal.
          </p>
          <div class="mt-4">
            <div v-if="isComplaintsLoading" class="flex justify-center items-center p-8">
              <Loader class="h-8 w-8 text-blue-500 animate-spin" />
            </div>
            <div
              v-else-if="complaintsLoadError"
              class="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div class="flex">
                <AlertTriangle class="h-5 w-5 text-red-400 flex-shrink-0" />
                <div class="ml-3">
                  <h4 class="text-sm font-medium text-red-800">Failed to load complaints data</h4>
                  <p class="mt-1 text-xs text-red-700">{{ complaintsLoadError }}</p>
                </div>
              </div>
            </div>
            <div v-else>
              <div
                v-if="complaints.length === 0 && !isComplaintsLoading"
                class="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700"
              >
                <div class="flex items-center">
                  <CheckCircle class="h-5 w-5 mr-2 text-green-500" />
                  No complaints found on your record.
                </div>
              </div>
              <div v-else>
                <ul class="space-y-3 mb-4">
                  <li
                    v-for="complaint in complaints"
                    :key="complaint.id"
                    class="p-3 rounded-lg border"
                    :class="{
                      'bg-red-50 border-red-200 text-red-800':
                        complaint.is_blocking_applications ||
                        [
                          'Submitted',
                          'Registered',
                          'Under Review',
                          'Investigation',
                          'Action Pending',
                        ].includes(complaint.status),
                      'bg-green-50 border-green-200 text-green-700':
                        !complaint.is_blocking_applications &&
                        ['Resolved', 'Closed', 'Dismissed'].includes(complaint.status),
                    }"
                  >
                    <div class="flex justify-between items-center">
                      <span class="font-medium text-sm">{{
                        complaint.subject || complaint.complaint_id || 'Complaint Details'
                      }}</span>
                      <span
                        class="text-xs px-2 py-0.5 rounded-full"
                        :class="{
                          'bg-red-100 text-red-800':
                            complaint.is_blocking_applications ||
                            [
                              'Submitted',
                              'Registered',
                              'Under Review',
                              'Investigation',
                              'Action Pending',
                            ].includes(complaint.status),
                          'bg-green-100 text-green-800':
                            !complaint.is_blocking_applications &&
                            ['Resolved', 'Closed', 'Dismissed'].includes(complaint.status),
                        }"
                      >
                        {{ complaint.status_display || complaint.status }}
                        <span
                          v-if="
                            complaint.is_blocking_applications ||
                            [
                              'Submitted',
                              'Registered',
                              'Under Review',
                              'Investigation',
                              'Action Pending',
                            ].includes(complaint.status)
                          "
                          class="font-semibold"
                        >
                          (Blocking)</span
                        >
                      </span>
                    </div>
                    <p class="text-xs mt-1">
                      {{ complaint.grievance_details || 'No description provided.' }}
                    </p>
                    <p class="text-xs mt-1 text-gray-500">
                      Date Filed: {{ formatDisplayDate(complaint.created_at) }}
                    </p>
                  </li>
                </ul>
                <div
                  v-if="hasUnresolvedComplaints && complaints.length > 0"
                  class="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md"
                >
                  <p class="font-medium">
                    {{ renewalEligibilityMessage }}
                  </p>
                </div>
                <div
                  v-else-if="!hasUnresolvedComplaints && complaints.length > 0"
                  class="p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md"
                >
                  <p class="font-medium">All complaints are resolved, closed, or dismissed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="authStore.user?.is_counselor"
          class="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-5 sm:p-6"
        >
          <div class="flex items-center space-x-2">
            <Users class="h-5 w-5 text-purple-600" />
            <h3 class="text-base sm:text-lg font-semibold text-gray-900">
              Counseling Supervision Status
            </h3>
          </div>
          <p class="mt-1 text-xs sm:text-sm text-gray-500 ml-7">
            Counselors require an approved supervision record for renewal.
          </p>
          <div class="mt-4">
            <div v-if="isSupervisionLoading" class="flex justify-center items-center p-8">
              <Loader class="h-8 w-8 text-blue-500 animate-spin" />
            </div>
            <div
              v-else-if="supervisionLoadError"
              class="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div class="flex">
                <AlertTriangle class="h-5 w-5 text-red-400 flex-shrink-0" />
                <div class="ml-3">
                  <h4 class="text-sm font-medium text-red-800">Failed to load supervision data</h4>
                  <p class="mt-1 text-xs text-red-700">{{ supervisionLoadError }}</p>
                </div>
              </div>
            </div>
            <div v-else>
              <div
                v-if="supervisionApplications.length === 0 && !isSupervisionLoading"
                class="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
              >
                <div class="flex items-center">
                  <AlertCircle class="h-5 w-5 mr-2 text-red-500" />
                  Renewal Blocked: No supervision applications found. Renewal requires at least one
                  approved supervision.
                </div>
              </div>
              <div v-else-if="supervisionApplications.length > 0">
                <ul class="space-y-3 mb-4">
                  <li
                    v-for="app in supervisionApplications"
                    :key="app.id"
                    class="p-3 rounded-lg border"
                    :class="{
                      'bg-green-50 border-green-200 text-green-700': app.status === 'Approved',
                      'bg-yellow-50 border-yellow-200 text-yellow-700': app.status === 'Pending',
                      'bg-red-50 border-red-200 text-red-700':
                        app.status !== 'Approved' && app.status !== 'Pending',
                    }"
                  >
                    <div class="flex justify-between items-center">
                      <span class="font-medium text-sm">{{
                        app.supervisor_name || 'Supervision Application'
                      }}</span>
                      <span
                        class="text-xs px-2 py-0.5 rounded-full"
                        :class="{
                          'bg-green-100 text-green-800': app.status === 'Approved',
                          'bg-yellow-100 text-yellow-800': app.status === 'Pending',
                          'bg-red-100 text-red-800':
                            app.status !== 'Approved' && app.status !== 'Pending',
                        }"
                      >
                        {{ app.status_display || app.status }}
                      </span>
                    </div>
                    <p class="text-xs mt-1 text-gray-500">
                      Application Date: {{ formatDisplayDate(app.application_date) }}
                    </p>
                    <p v-if="app.status === 'Approved'" class="text-xs mt-1 text-gray-500">
                      Expiry Date: {{ formatDisplayDate(app.expiry_date) }}
                    </p>
                  </li>
                </ul>
                <div
                  v-if="!meetsSupervisionRequirements && supervisionApplications.length > 0"
                  class="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md"
                >
                  <p class="font-medium">
                    Renewal Blocked: You do not have an approved counseling supervision application.
                    Please complete this requirement.
                  </p>
                </div>
                <div
                  v-else-if="meetsSupervisionRequirements"
                  class="p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md"
                >
                  <p class="font-medium">Supervision requirement met.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!isSubmitting">
          <div
            class="border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-5 sm:p-6"
          >
            <div class="flex items-center space-x-2">
              <RefreshCw class="h-5 w-5 text-blue-600" />
              <h3 class="text-base sm:text-lg font-semibold text-gray-900">
                {{ renewalType === 're-registration' ? 'Re-registration' : 'Renewal' }}
                Confirmation
              </h3>
            </div>
            <p class="mt-1 text-xs sm:text-sm text-gray-500 ml-7">
              Confirm your application details and submit for
              {{ renewalType === 're-registration' ? 're-registration' : 'renewal' }}. Payment will
              be handled at a later stage.
            </p>
            <div class="mt-5 p-4 sm:p-5 rounded-lg bg-white border shadow-sm">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  class="flex flex-col items-center p-4 rounded-lg bg-blue-50 border border-blue-100"
                >
                  <Calendar class="h-6 w-6 text-blue-600 mb-2" />
                  <p class="text-xs text-gray-500">Current Expiry</p>
                  <p class="font-medium text-sm">{{ formatDisplayDate(formData.expiry_date) }}</p>
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
                      other criteria are met.</span
                    >
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
                  rejection of my
                  {{ renewalType === 're-registration' ? 're-registration' : 'renewal' }}
                  application.</label
                >
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-4 p-5 sm:p-6 bg-gray-50 border-t">
            <button
              @click="handleCancel"
              :disabled="isSubmitting"
              class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <X class="h-4 w-4 mr-1.5" />
              Cancel
            </button>
            <button
              @click="handleSubmit"
              :disabled="isSubmitting || !declaration || !isEligibleForRenewal"
              class="px-4 py-2 bg-blue-600 text-sm font-medium text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
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
              <div
                class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100"
              >
                <RefreshCw class="h-6 w-6 text-blue-600" />
              </div>
              <DialogTitle as="h3" class="text-lg font-medium text-gray-900 mt-4"
                >Confirm
                {{ renewalType === 're-registration' ? 'Re-registration' : 'Renewal' }}
                Application</DialogTitle
              >
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
                        <span class="font-medium">{{ formatDisplayDate(getNewExpiryDate) }}</span
                        >.
                        <span v-if="cpdStatus === 'below_minimum' || cpdStatus === 'none'">
                          Note: Your CPD score is below the recommended minimum.</span
                        >
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'

// Import Pinia Stores
import { useAuthStore } from '@/stores/authStore'
import { useHealthCertificationStore } from '@/stores/mhpcNavigationStore'
import { useRenewalStore } from '@/stores/renewalStore'
import { useMhpcCpdStore } from '@/stores/mhpcCpdStore'

// Import UI Components
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import PageHeader from '@/components/common/MHPC/PageHeader.vue'

// Import Icons
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
} from 'lucide-vue-next'

// --- INITIALIZATION ---
const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const healthStore = useHealthCertificationStore()
const renewalStore = useRenewalStore()
const mhpcCpdStore = useMhpcCpdStore()

// --- STATE MANAGEMENT ---

// Destructure state and getters from the renewal store to maintain reactivity
const {
  isLoading,
  isSubmitting,
  loadError,
  formData,
  complaints,
  isComplaintsLoading,
  complaintsLoadError,
  supervisionApplications,
  isSupervisionLoading,
  supervisionLoadError,
  hasExpired,
  isExpiringWithin3Months,
  renewalType,
  pageHeaderTitle,
  pageHeaderSubtitle,
  hasUnresolvedComplaints,
  meetsSupervisionRequirements,
  isEligibleForRenewal,
  renewalEligibilityMessage,
  getNewExpiryDate,
  getTotalCpdPoints,
  cpdStatus,
  cpdMessage,
  cpdIcon,
  cpdCardClass,
  cpdIconClass,
  cpdProgressClass,
  cpdTextClass,
  cpdMessageBgClass,
  cpdMessageIconColor,
} = storeToRefs(renewalStore)

// Local UI state (not shared, specific to this component)
const showConfirmation = ref(false)
const declaration = ref(false)
const remarks = ref('')

// --- LIFECYCLE HOOKS ---
onMounted(() => {
  // Initialize the store, which will fetch all necessary data
  renewalStore.initialize()
})

// --- METHODS ---

// Utility function for formatting dates in the template
const formatDisplayDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = dayjs(dateString)
  return date.isValid() ? date.format('MMM D, YYYY') : 'Invalid Date'
}

// Handles the click on the main submit button
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

// Confirms and triggers the submission action in the store
const confirmSubmit = async () => {
  showConfirmation.value = false
  await renewalStore.submitRenewal({ remarks: remarks.value })
}

// Handles navigation when the user cancels the process
const handleCancel = () => {
  router.push('/admin/user/health_certification/dashboard')
}

const {
  allCpdRecords,
  isLoading: isCpdLoading, // Rename to avoid conflict with renewalStore's isLoading
  error: cpdLoadError, // Rename to avoid conflict
} = storeToRefs(mhpcCpdStore)
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
