<template>
  <div class="w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <!-- Page Header -->
      <PageHeader
          title="Track Your Application"
          subtitle="View the status of your registration, renewal, or additional applications below."
      >
          <template #icon>
              <ClipboardList class="w-6 h-6 text-indigo-600" />
          </template>
      </PageHeader>

      <!-- Tabs Navigation -->
      <div class="relative overflow-hidden backdrop-blur-sm bg-white/80 rounded-2xl p-6 sm:p-8 mb-10 shadow-lg border border-indigo-100">
          <div class="absolute -top-16 -right-16 w-40 h-40 bg-indigo-100 rounded-full opacity-30 blur-xl"></div>
          <div class="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-100 rounded-full opacity-40 blur-lg"></div>

          <div class="relative z-10">
              <nav class="flex justify-center space-x-4 sm:space-x-8" aria-label="Tabs">
                  <button
                      v-for="tab in tabs"
                      :key="tab.name"
                      @click="currentTab = tab.name"
                      :class="[
                          currentTab === tab.name
                              ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white'
                              : 'bg-white/50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700',
                          'relative px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 shadow-sm border',
                          currentTab === tab.name ? 'border-indigo-200' : 'border-gray-200'
                      ]"
                  >
                      {{ tab.label }}
                      <span
                          v-if="currentTab === tab.name"
                          class="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full"
                      ></span>
                  </button>
              </nav>
          </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="isLoading" class="my-8 flex justify-center">
           <div class="flex flex-col items-center space-y-3">
              <svg
                  class="animate-spin h-8 w-8 text-indigo-600"
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
              <p class="text-gray-600 font-medium">Loading your application data...</p>
          </div>
      </div>

      <!-- Tab Content -->
      <div v-else class="space-y-8">
          <!-- Registration Applications -->
          <div v-if="currentTab === 'registration' && registrationApplications?.length > 0" class="space-y-6">
              <!-- Application Card Loop (Registration) -->
              <div
                  v-for="application in registrationApplications"
                  :key="application.id"
                  class="relative overflow-hidden backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg border border-indigo-100 hover:shadow-xl transition-all duration-300"
              >
                  <!-- Main Info Header -->
                  <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 border-b border-indigo-200 p-6 sm:p-8">
                      <!-- Action Buttons -->
                      <div class="absolute top-0 right-0 m-4 sm:m-6 flex space-x-2 z-10">
                          <button
                              v-if="shouldShowViewCertificateButton(application)"
                              @click="openCertificateModal(application)"
                              class="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 text-sm bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-xl hover:from-indigo-700 hover:to-blue-800 transition-all shadow-md"
                          >
                              <FileText class="w-4 h-4 mr-2" />
                              <span>View Certificate</span>
                          </button>
                      </div>
                      <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <div class="relative">
                                <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-blue-600/20 rounded-xl blur-md"></div>
                                <img :src="application.passport_photo" :alt="application.full_name" class="h-24 w-24 sm:h-28 sm:w-28 relative rounded-xl object-cover ring-4 ring-white shadow-lg" />
                            </div>
                            <div class="flex-1 text-center sm:text-left">
                                <div class="flex flex-col sm:flex-row sm:items-center gap-3 justify-center sm:justify-start">
                                    <h3 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ application.full_name }}</h3>
                                    <span class="px-4 py-1.5 rounded-full text-sm font-medium inline-flex items-center justify-center w-fit mx-auto sm:mx-0"
                                        :class=" isApplicationActive(application) ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200' ">
                                        <span class="w-2.5 h-2.5 rounded-full mr-2" :class=" isApplicationActive(application) ? 'bg-green-500' : 'bg-red-500' "></span>
                                        {{ isApplicationActive(application) ? 'Active' : 'Inactive' }}
                                    </span>
                                </div>
                                <div class="mt-4 flex flex-col sm:flex-row items-center gap-3 text-gray-600 justify-center sm:justify-start">
                                    <div class="flex items-center px-4 py-1.5 text-sm bg-gray-50 rounded-xl border border-gray-100">
                                        <IdCard class="w-5 h-5 mr-2 text-indigo-600" />
                                        <span>{{ application.cid_holder ? 'CID' : 'Work Permit' }}: {{ application.cid_no }}</span>
                                    </div>
                                    <div class="flex items-center px-4 py-1.5 text-sm bg-gray-50 rounded-xl border border-gray-100">
                                        <BarChart class="w-5 h-5 mr-2 text-indigo-600" />
                                        <span>Reg No: {{ application.registration_no }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                  </div>

                  <!-- Contact & Registration Info -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6 sm:p-8">
                      <div class="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 border border-indigo-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-md">
                          <div class="mt-1 p-2 bg-indigo-100 rounded-lg"><Phone class="w-5 h-5 text-indigo-600" /></div>
                          <div>
                              <p class="text-sm font-semibold text-gray-900">Contact Information</p>
                              <p class="text-sm text-gray-600 mt-1">{{ application.contact_no }}</p>
                              <p class="text-sm text-gray-600">{{ application.email_address }}</p>
                          </div>
                      </div>
                      <div class="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 border border-indigo-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-md">
                            <div class="mt-1 p-2 bg-indigo-100 rounded-lg"><MapPin class="w-5 h-5 text-indigo-600" /></div>
                            <div>
                                <p class="text-sm font-semibold text-gray-900">Location</p>
                                <p class="text-sm text-gray-600 mt-1">{{ application.village }}, {{ application.gewog }}, {{ application.dzongkhag }}</p>
                            </div>
                      </div>
                      <div class="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 border border-indigo-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-md">
                            <div class="mt-1 p-2 bg-indigo-100 rounded-lg"><Calendar class="w-5 h-5 text-indigo-600" /></div>
                            <div>
                                <p class="text-sm font-semibold text-gray-900">Registration Period</p>
                                <p class="text-sm text-gray-600 mt-1">{{ new Date(application.registration_date).toLocaleDateString() }} - {{ new Date(application.expiry_date).toLocaleDateString() }}</p>
                            </div>
                      </div>
                  </div>

                  <!-- Qualifications Section -->
                  <div class="p-6 sm:p-8">
                     <h4 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                        <div class="p-2 bg-indigo-100 rounded-lg mr-3"><GraduationCap class="w-5 h-5 text-indigo-600" /></div>
                         Qualifications & Certifications
                     </h4>
                      <div class="grid grid-cols-1 gap-6">
                          <div
                              v-for="qualification in application.user_qualifications"
                              :key="qualification.id"
                              class="relative bg-white/90 rounded-xl border border-indigo-100 p-6 shadow-sm hover:shadow-md transition-all duration-300"
                          >
                              <!-- Qualification Header -->
                              <div class="flex flex-col lg:flex-row lg:items-start justify-between mb-6 gap-4">
                                    <div class="space-y-1">
                                        <h5 class="text-xl font-semibold text-gray-900">{{ qualification.qualification_name_display }}</h5>
                                        <p class="text-gray-600 text-sm">{{ qualification.institute_university_display }}</p>
                                    </div>
                                    <!-- Review Status Timeline -->
                                    <div class="flex items-center justify-center lg:justify-end w-full lg:w-auto">
                                        <div class="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 space-y-4 sm:space-y-0">
                                            <!-- Application Review -->
                                            <div class="flex flex-col items-center">
                                                <span class="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                                                      :class="[ qualification.application_review_status === 'Approved' ? 'bg-green-100 text-green-700 ring-1 ring-green-200' : qualification.application_review_status === 'Rejected' ? 'bg-red-100 text-red-700 ring-1 ring-red-200' : 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200', ]">
                                                    <CheckCircle v-if=" qualification.application_review_status === 'Approved' " class="w-5 h-5" />
                                                    <XCircle v-else-if=" qualification.application_review_status === 'Rejected' " class="w-5 h-5" />
                                                    <Clock v-else class="w-5 h-5" />
                                                </span>
                                                <span class="text-sm font-medium mt-2 text-gray-700">Review</span>
                                            </div>
                                            <div class="hidden sm:block w-8 h-0.5 bg-gray-200"></div>
                                            <div class="sm:hidden h-4 w-0.5 bg-gray-200"></div>
                                            <!-- Physical Verification -->
                                            <div class="flex flex-col items-center">
                                                <span class="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                                                      :class="[ qualification.physical_review_status === 'Approved' ? 'bg-green-100 text-green-700 ring-1 ring-green-200' : qualification.physical_review_status === 'Rejected' ? 'bg-red-100 text-red-700 ring-1 ring-red-200' : 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200', ]">
                                                    <CheckCircle v-if=" qualification.physical_review_status === 'Approved' " class="w-5 h-5" />
                                                    <XCircle v-else-if=" qualification.physical_review_status === 'Rejected' " class="w-5 h-5" />
                                                    <Clock v-else class="w-5 h-5" />
                                                </span>
                                                <span class="text-sm font-medium mt-2 text-gray-700">Verify</span>
                                            </div>
                                            <div class="hidden sm:block w-8 h-0.5 bg-gray-200"></div>
                                            <div class="sm:hidden h-4 w-0.5 bg-gray-200"></div>
                                            <!-- Payment -->
                                             <div class="flex flex-col items-center">
                                                <span class="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                                                      :class="{ 'bg-green-100 text-green-700 ring-1 ring-green-200': qualification.payment_status === 'completed', 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200': qualification.payment_status === 'processing_payment', 'bg-red-100 text-red-700 ring-1 ring-red-200': qualification.payment_status === 'failed', 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200': qualification.payment_status === 'pending', }">
                                                    <CheckCircle v-if=" qualification.payment_status === 'completed' " class="w-5 h-5" />
                                                    <XCircle v-else-if=" qualification.payment_status === 'failed' " class="w-5 h-5" />
                                                    <Clock v-else class="w-5 h-5" />
                                                </span>
                                                <span class="text-sm font-medium mt-2 text-gray-700">Payment</span>
                                            </div>
                                            <div class="hidden sm:block w-8 h-0.5 bg-gray-200"></div>
                                            <div class="sm:hidden h-4 w-0.5 bg-gray-200"></div>
                                            <!-- Endorsement -->
                                            <div class="flex flex-col items-center">
                                                <span class="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                                                      :class="[ qualification.endorsement_decision === 'Approved' ? 'bg-green-100 text-green-700 ring-1 ring-green-200' : qualification.endorsement_decision === 'Rejected' ? 'bg-red-100 text-red-700 ring-1 ring-red-200' : 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200', ]">
                                                    <CheckCircle v-if=" qualification.endorsement_decision === 'Approved' " class="w-5 h-5" />
                                                    <XCircle v-else-if=" qualification.endorsement_decision === 'Rejected' " class="w-5 h-5" />
                                                    <Clock v-else class="w-5 h-5" />
                                                </span>
                                                <span class="text-sm font-medium mt-2 text-gray-700">Endorse</span>
                                            </div>
                                        </div>
                                    </div>
                              </div>

                              <!-- Qualification Details Grid -->
                              <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                  <div class="bg-indigo-50 rounded-xl p-4 border border-indigo-100 hover:border-indigo-300 transition-all duration-300 hover:shadow-md">
                                      <div class="flex items-start space-x-3">
                                          <div class="p-2 bg-white rounded-lg shadow-sm"><Building2 class="w-5 h-5 text-indigo-600" /></div>
                                          <div>
                                              <p class="text-sm font-medium text-indigo-700">Institute</p>
                                              <p class="text-sm font-semibold text-gray-900 mt-1 line-clamp-2">{{ qualification.institute_university_display }}</p>
                                          </div>
                                      </div>
                                  </div>
                                   <div class="bg-blue-50 rounded-xl p-4 border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
                                        <div class="flex items-start space-x-3">
                                            <div class="p-2 bg-white rounded-lg shadow-sm"><GraduationCap class="w-5 h-5 text-blue-600" /></div>
                                            <div>
                                                <p class="text-sm font-medium text-blue-700">Qualification</p>
                                                <p class="text-sm font-semibold text-gray-900 mt-1 line-clamp-2">{{ qualification.qualification_type_display }}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bg-purple-50 rounded-xl p-4 border border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-md">
                                        <div class="flex items-start space-x-3">
                                            <div class="p-2 bg-white rounded-lg shadow-sm"><CalendarCheck class="w-5 h-5 text-purple-600" /></div>
                                            <div>
                                                <p class="text-sm font-medium text-purple-700">Completion</p>
                                                <p class="text-sm font-semibold text-gray-900 mt-1">{{ qualification.completion_year }}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bg-teal-50 rounded-xl p-4 border border-teal-100 hover:border-teal-300 transition-all duration-300 hover:shadow-md">
                                        <div class="flex items-start space-x-3">
                                            <div class="p-2 bg-white rounded-lg shadow-sm"><CreditCard class="w-5 h-5 text-teal-600" /></div>
                                            <div>
                                                <p class="text-sm font-medium text-teal-700">Payment</p>
                                                <div class="flex items-center space-x-2 mt-1">
                                                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                                                          :class="{ 'bg-green-100 text-green-800 border border-green-200': qualification.payment_status === 'completed', 'bg-red-100 text-red-800 border border-red-200': qualification.payment_status === 'failed', 'bg-yellow-100 text-yellow-800 border border-yellow-200': qualification.payment_status === 'processing_payment', 'bg-yellow-100 text-yellow-800 border border-yellow-200': qualification.payment_status === 'pending', }">
                                                        {{ qualification.payment_status === 'completed' ? 'Paid' : qualification.payment_status === 'processing_payment' ? 'Processing' : qualification.payment_status === 'failed' ? 'Failed' : 'Pending' }}
                                                    </span>
                                                    <span v-if="qualification.payment_id" class="text-sm text-gray-500 truncate">#{{ qualification.payment_id.substring(0, 8) }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                              </div>

                              <!-- Payment Button -->
                              <button
                                  v-if="shouldShowPaymentButton(qualification)"
                                  @click="initiatePayment(application, qualification)"
                                  class="relative mt-4 inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all shadow-md overflow-hidden"
                                  :class="{ 'animate-pulse': qualification.payment_status !== 'failed' }"
                              >
                                  <div class="absolute inset-0 border-2 border-transparent animate-border-pulse pointer-events-none"></div>
                                  <CreditCard class="w-4 h-4 mr-2" />
                                  <span>{{ getPaymentButtonText(qualification) }}</span>
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <!-- Renewal Applications -->
          <div v-if="currentTab === 'renewal' && renewalApplications?.length > 0" class="space-y-6">
               <!-- Application Card Loop (Renewal) -->
               <div
                  v-for="application in renewalApplications"
                  :key="application.id"
                  class="relative overflow-hidden backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg border border-indigo-100 hover:shadow-xl transition-all duration-300"
              >
                  <!-- Main Info Header -->
                   <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 border-b border-indigo-200 p-6 sm:p-8">
                        <!-- Action Buttons -->
                        <div class="absolute top-0 right-0 m-4 sm:m-6 flex space-x-2 z-10">
                            <button
                                v-if="shouldShowViewCertificateButton(application)"
                                @click="openCertificateModal(application)"
                                class="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 text-sm bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-xl hover:from-indigo-700 hover:to-blue-800 transition-all shadow-md"
                            >
                                <FileText class="w-4 h-4 mr-2" />
                                <span>View Certificate</span>
                            </button>
                        </div>
                         <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <div class="relative">
                                <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-blue-600/20 rounded-xl blur-md"></div>
                                <img :src="application.passport_photo" :alt="application.full_name" class="h-24 w-24 sm:h-28 sm:w-28 relative rounded-xl object-cover ring-4 ring-white shadow-lg" />
                            </div>
                            <div class="flex-1 text-center sm:text-left">
                                <div class="flex flex-col sm:flex-row sm:items-center gap-3 justify-center sm:justify-start">
                                    <h3 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ application.full_name }}</h3>
                                    <span class="px-4 py-1.5 rounded-full text-sm font-medium inline-flex items-center justify-center w-fit mx-auto sm:mx-0"
                                        :class=" isApplicationActive(application) ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200' ">
                                        <span class="w-2.5 h-2.5 rounded-full mr-2" :class=" isApplicationActive(application) ? 'bg-green-500' : 'bg-red-500' "></span>
                                        {{ isApplicationActive(application) ? 'Active' : 'Inactive' }}
                                    </span>
                                </div>
                                <div class="mt-4 flex flex-col sm:flex-row items-center gap-3 text-gray-600 justify-center sm:justify-start">
                                    <div class="flex items-center px-4 py-1.5 text-sm bg-gray-50 rounded-xl border border-gray-100">
                                        <IdCard class="w-5 h-5 mr-2 text-indigo-600" />
                                        <span>{{ application.cid_holder ? 'CID' : 'Work Permit' }}: {{ application.cid_no }}</span>
                                    </div>
                                    <div class="flex items-center px-4 py-1.5 text-sm bg-gray-50 rounded-xl border border-gray-100">
                                        <BarChart class="w-5 h-5 mr-2 text-indigo-600" />
                                        <span>Reg No: {{ application.registration_no }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                   </div>

                   <!-- Contact & Registration Info -->
                   <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6 sm:p-8">
                        <div class="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 border border-indigo-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-md">
                            <div class="mt-1 p-2 bg-indigo-100 rounded-lg"><Phone class="w-5 h-5 text-indigo-600" /></div>
                            <div>
                                <p class="text-sm font-semibold text-gray-900">Contact Information</p>
                                <p class="text-sm text-gray-600 mt-1">{{ application.contact_no }}</p>
                                <p class="text-sm text-gray-600">{{ application.email_address }}</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 border border-indigo-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-md">
                            <div class="mt-1 p-2 bg-indigo-100 rounded-lg"><MapPin class="w-5 h-5 text-indigo-600" /></div>
                            <div>
                                <p class="text-sm font-semibold text-gray-900">Location</p>
                                <p class="text-sm text-gray-600 mt-1">{{ application.village }}, {{ application.gewog }}, {{ application.dzongkhag }}</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 border border-indigo-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-md">
                            <div class="mt-1 p-2 bg-indigo-100 rounded-lg"><Calendar class="w-5 h-5 text-indigo-600" /></div>
                            <div>
                                <p class="text-sm font-semibold text-gray-900">Registration Period</p>
                                <p class="text-sm text-gray-600 mt-1">{{ new Date(application.registration_date).toLocaleDateString() }} - {{ new Date(application.expiry_date).toLocaleDateString() }}</p>
                            </div>
                        </div>
                    </div>

                   <!-- Qualification Loop within Application -->
                   <div class="p-6 sm:p-8">
                        <h4 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                            <div class="p-2 bg-indigo-100 rounded-lg mr-3"><GraduationCap class="w-5 h-5 text-indigo-600" /></div>
                            Qualifications & Certifications
                        </h4>
                       <div class="grid grid-cols-1 gap-6">
                           <div
                               v-for="qualification in application.user_qualifications"
                               :key="qualification.id"
                               class="relative bg-white/90 rounded-xl border border-indigo-100 p-6 shadow-sm hover:shadow-md transition-all duration-300"
                           >
                                <!-- Qualification Header -->
                                <div class="flex flex-col lg:flex-row lg:items-start justify-between mb-6 gap-4">
                                    <div class="space-y-1">
                                        <h5 class="text-xl font-semibold text-gray-900">{{ qualification.qualification_name_display }}</h5>
                                        <p class="text-gray-600 text-sm">{{ qualification.institute_university_display }}</p>
                                    </div>
                                     <!-- Review Status Timeline -->
                                     <div class="flex items-center justify-center lg:justify-end w-full lg:w-auto">
                                        <div class="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 space-y-4 sm:space-y-0">
                                            <!-- Application Review -->
                                            <div class="flex flex-col items-center">
                                                <span class="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                                                      :class="[ qualification.application_review_status === 'Approved' ? 'bg-green-100 text-green-700 ring-1 ring-green-200' : qualification.application_review_status === 'Rejected' ? 'bg-red-100 text-red-700 ring-1 ring-red-200' : 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200', ]">
                                                    <CheckCircle v-if=" qualification.application_review_status === 'Approved' " class="w-5 h-5" />
                                                    <XCircle v-else-if=" qualification.application_review_status === 'Rejected' " class="w-5 h-5" />
                                                    <Clock v-else class="w-5 h-5" />
                                                </span>
                                                <span class="text-sm font-medium mt-2 text-gray-700">Review</span>
                                            </div>
                                            <div class="hidden sm:block w-8 h-0.5 bg-gray-200"></div>
                                            <div class="sm:hidden h-4 w-0.5 bg-gray-200"></div>
                                            <!-- Physical Verification -->
                                            <div class="flex flex-col items-center">
                                                <span class="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                                                      :class="[ qualification.physical_review_status === 'Approved' ? 'bg-green-100 text-green-700 ring-1 ring-green-200' : qualification.physical_review_status === 'Rejected' ? 'bg-red-100 text-red-700 ring-1 ring-red-200' : 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200', ]">
                                                    <CheckCircle v-if=" qualification.physical_review_status === 'Approved' " class="w-5 h-5" />
                                                    <XCircle v-else-if=" qualification.physical_review_status === 'Rejected' " class="w-5 h-5" />
                                                    <Clock v-else class="w-5 h-5" />
                                                </span>
                                                <span class="text-sm font-medium mt-2 text-gray-700">Verify</span>
                                            </div>
                                            <div class="hidden sm:block w-8 h-0.5 bg-gray-200"></div>
                                            <div class="sm:hidden h-4 w-0.5 bg-gray-200"></div>
                                            <!-- Payment -->
                                             <div class="flex flex-col items-center">
                                                <span class="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                                                      :class="{ 'bg-green-100 text-green-700 ring-1 ring-green-200': qualification.payment_status === 'completed', 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200': qualification.payment_status === 'processing_payment', 'bg-red-100 text-red-700 ring-1 ring-red-200': qualification.payment_status === 'failed', 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200': qualification.payment_status === 'pending', }">
                                                    <CheckCircle v-if=" qualification.payment_status === 'completed' " class="w-5 h-5" />
                                                    <XCircle v-else-if=" qualification.payment_status === 'failed' " class="w-5 h-5" />
                                                    <Clock v-else class="w-5 h-5" />
                                                </span>
                                                <span class="text-sm font-medium mt-2 text-gray-700">Payment</span>
                                            </div>
                                            <div class="hidden sm:block w-8 h-0.5 bg-gray-200"></div>
                                            <div class="sm:hidden h-4 w-0.5 bg-gray-200"></div>
                                            <!-- Endorsement -->
                                            <div class="flex flex-col items-center">
                                                <span class="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                                                      :class="[ qualification.endorsement_decision === 'Approved' ? 'bg-green-100 text-green-700 ring-1 ring-green-200' : qualification.endorsement_decision === 'Rejected' ? 'bg-red-100 text-red-700 ring-1 ring-red-200' : 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200', ]">
                                                    <CheckCircle v-if=" qualification.endorsement_decision === 'Approved' " class="w-5 h-5" />
                                                    <XCircle v-else-if=" qualification.endorsement_decision === 'Rejected' " class="w-5 h-5" />
                                                    <Clock v-else class="w-5 h-5" />
                                                </span>
                                                <span class="text-sm font-medium mt-2 text-gray-700">Endorse</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Qualification Details Grid -->
                                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div class="bg-indigo-50 rounded-xl p-4 border border-indigo-100 hover:border-indigo-300 transition-all duration-300 hover:shadow-md">
                                        <div class="flex items-start space-x-3">
                                            <div class="p-2 bg-white rounded-lg shadow-sm"><Building2 class="w-5 h-5 text-indigo-600" /></div>
                                            <div>
                                                <p class="text-sm font-medium text-indigo-700">Institute</p>
                                                <p class="text-sm font-semibold text-gray-900 mt-1 line-clamp-2">{{ qualification.institute_university_display }}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bg-blue-50 rounded-xl p-4 border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
                                        <div class="flex items-start space-x-3">
                                            <div class="p-2 bg-white rounded-lg shadow-sm"><GraduationCap class="w-5 h-5 text-blue-600" /></div>
                                            <div>
                                                <p class="text-sm font-medium text-blue-700">Qualification</p>
                                                <p class="text-sm font-semibold text-gray-900 mt-1 line-clamp-2">{{ qualification.qualification_type_display }}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bg-purple-50 rounded-xl p-4 border border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-md">
                                        <div class="flex items-start space-x-3">
                                            <div class="p-2 bg-white rounded-lg shadow-sm"><CalendarCheck class="w-5 h-5 text-purple-600" /></div>
                                            <div>
                                                <p class="text-sm font-medium text-purple-700">Completion</p>
                                                <p class="text-sm font-semibold text-gray-900 mt-1">{{ qualification.completion_year }}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bg-teal-50 rounded-xl p-4 border border-teal-100 hover:border-teal-300 transition-all duration-300 hover:shadow-md">
                                        <div class="flex items-start space-x-3">
                                            <div class="p-2 bg-white rounded-lg shadow-sm"><CreditCard class="w-5 h-5 text-teal-600" /></div>
                                            <div>
                                                <p class="text-sm font-medium text-teal-700">Payment</p>
                                                <div class="flex items-center space-x-2 mt-1">
                                                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                                                        :class="{ 'bg-green-100 text-green-800 border border-green-200': qualification.payment_status === 'completed', 'bg-red-100 text-red-800 border border-red-200': qualification.payment_status === 'failed', 'bg-yellow-100 text-yellow-800 border border-yellow-200': qualification.payment_status === 'processing_payment', 'bg-yellow-100 text-yellow-800 border border-yellow-200': qualification.payment_status === 'pending', }">
                                                        {{ qualification.payment_status === 'completed' ? 'Paid' : qualification.payment_status === 'processing_payment' ? 'Processing' : qualification.payment_status === 'failed' ? 'Failed' : 'Pending' }}
                                                    </span>
                                                    <span v-if="qualification.payment_id" class="text-sm text-gray-500 truncate">#{{ qualification.payment_id.substring(0, 8) }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                               <!-- Payment Button -->
                               <button
                                   v-if="shouldShowPaymentButton(qualification)"
                                   @click="initiatePayment(application, qualification)"
                                   class="relative mt-4 inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all shadow-md overflow-hidden"
                                   :class="{ 'animate-pulse': qualification.payment_status !== 'failed' }"
                               >
                                   <div class="absolute inset-0 border-2 border-transparent animate-border-pulse pointer-events-none"></div>
                                   <CreditCard class="w-4 h-4 mr-2" />
                                   <span>{{ getPaymentButtonText(qualification) }}</span>
                               </button>
                           </div>
                       </div>
                   </div>
               </div>
          </div>

          <!-- Additional Applications -->
          <div v-if="currentTab === 'additional' && additionalApplications?.length > 0" class="space-y-6">
              <!-- Application Card Loop (Additional) -->
              <div
                  v-for="application in additionalApplications"
                  :key="application.id"
                  class="relative overflow-hidden backdrop-blur-sm bg-white/80 rounded-2xl shadow-lg border border-indigo-100 hover:shadow-xl transition-all duration-300"
              >
                  <!-- Main Info Header -->
                   <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 border-b border-indigo-200 p-6 sm:p-8">
                         <!-- Action Buttons -->
                         <div class="absolute top-0 right-0 m-4 sm:m-6 flex space-x-2 z-10">
                            <button
                                v-if="shouldShowViewCertificateButton(application)"
                                @click="openCertificateModal(application)"
                                class="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 text-sm bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-xl hover:from-indigo-700 hover:to-blue-800 transition-all shadow-md"
                            >
                                <FileText class="w-4 h-4 mr-2" />
                                <span>View Certificate</span>
                            </button>
                         </div>
                          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <div class="relative">
                                <div class="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-blue-600/20 rounded-xl blur-md"></div>
                                <img :src="application.passport_photo" :alt="application.full_name" class="h-24 w-24 sm:h-28 sm:w-28 relative rounded-xl object-cover ring-4 ring-white shadow-lg" />
                            </div>
                            <div class="flex-1 text-center sm:text-left">
                                <div class="flex flex-col sm:flex-row sm:items-center gap-3 justify-center sm:justify-start">
                                    <h3 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ application.full_name }}</h3>
                                    <span class="px-4 py-1.5 rounded-full text-sm font-medium inline-flex items-center justify-center w-fit mx-auto sm:mx-0"
                                        :class=" isApplicationActive(application) ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200' ">
                                        <span class="w-2.5 h-2.5 rounded-full mr-2" :class=" isApplicationActive(application) ? 'bg-green-500' : 'bg-red-500' "></span>
                                        {{ isApplicationActive(application) ? 'Active' : 'Inactive' }}
                                    </span>
                                </div>
                                <div class="mt-4 flex flex-col sm:flex-row items-center gap-3 text-gray-600 justify-center sm:justify-start">
                                    <div class="flex items-center px-4 py-1.5 text-sm bg-gray-50 rounded-xl border border-gray-100">
                                        <IdCard class="w-5 h-5 mr-2 text-indigo-600" />
                                        <span>{{ application.cid_holder ? 'CID' : 'Work Permit' }}: {{ application.cid_no }}</span>
                                    </div>
                                    <div class="flex items-center px-4 py-1.5 text-sm bg-gray-50 rounded-xl border border-gray-100">
                                        <BarChart class="w-5 h-5 mr-2 text-indigo-600" />
                                        <span>Reg No: {{ application.registration_no }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                   </div>

                   <!-- Contact & Registration Info -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6 sm:p-8">
                        <div class="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 border border-indigo-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-md">
                            <div class="mt-1 p-2 bg-indigo-100 rounded-lg"><Phone class="w-5 h-5 text-indigo-600" /></div>
                            <div>
                                <p class="text-sm font-semibold text-gray-900">Contact Information</p>
                                <p class="text-sm text-gray-600 mt-1">{{ application.contact_no }}</p>
                                <p class="text-sm text-gray-600">{{ application.email_address }}</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 border border-indigo-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-md">
                            <div class="mt-1 p-2 bg-indigo-100 rounded-lg"><MapPin class="w-5 h-5 text-indigo-600" /></div>
                            <div>
                                <p class="text-sm font-semibold text-gray-900">Location</p>
                                <p class="text-sm text-gray-600 mt-1">{{ application.village }}, {{ application.gewog }}, {{ application.dzongkhag }}</p>
                            </div>
                        </div>
                         <div class="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 border border-indigo-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-md">
                            <div class="mt-1 p-2 bg-indigo-100 rounded-lg"><Calendar class="w-5 h-5 text-indigo-600" /></div>
                            <div>
                                <p class="text-sm font-semibold text-gray-900">Registration Period</p>
                                <p class="text-sm text-gray-600 mt-1">{{ new Date(application.registration_date).toLocaleDateString() }} - {{ new Date(application.expiry_date).toLocaleDateString() }}</p>
                            </div>
                        </div>
                    </div>

                   <!-- Qualification Loop within Application -->
                   <div class="p-6 sm:p-8">
                       <h4 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                           <div class="p-2 bg-indigo-100 rounded-lg mr-3"><GraduationCap class="w-5 h-5 text-indigo-600" /></div>
                            Qualifications & Certifications
                        </h4>
                       <div class="grid grid-cols-1 gap-6">
                           <div
                               v-for="qualification in application.user_qualifications"
                               :key="qualification.id"
                               class="relative bg-white/90 rounded-xl border border-indigo-100 p-6 shadow-sm hover:shadow-md transition-all duration-300"
                           >
                               <!-- Qualification Header -->
                                <div class="flex flex-col lg:flex-row lg:items-start justify-between mb-6 gap-4">
                                    <div class="space-y-1">
                                        <h5 class="text-xl font-semibold text-gray-900">{{ qualification.qualification_name_display }}</h5>
                                        <p class="text-gray-600 text-sm">{{ qualification.institute_university_display }}</p>
                                    </div>
                                     <!-- Review Status Timeline -->
                                    <div class="flex items-center justify-center lg:justify-end w-full lg:w-auto">
                                        <div class="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 space-y-4 sm:space-y-0">
                                             <!-- Application Review -->
                                            <div class="flex flex-col items-center">
                                                <span class="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                                                      :class="[ qualification.application_review_status === 'Approved' ? 'bg-green-100 text-green-700 ring-1 ring-green-200' : qualification.application_review_status === 'Rejected' ? 'bg-red-100 text-red-700 ring-1 ring-red-200' : 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200', ]">
                                                    <CheckCircle v-if=" qualification.application_review_status === 'Approved' " class="w-5 h-5" />
                                                    <XCircle v-else-if=" qualification.application_review_status === 'Rejected' " class="w-5 h-5" />
                                                    <Clock v-else class="w-5 h-5" />
                                                </span>
                                                <span class="text-sm font-medium mt-2 text-gray-700">Review</span>
                                            </div>
                                            <div class="hidden sm:block w-8 h-0.5 bg-gray-200"></div>
                                            <div class="sm:hidden h-4 w-0.5 bg-gray-200"></div>
                                            <!-- Physical Verification -->
                                            <div class="flex flex-col items-center">
                                                <span class="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                                                      :class="[ qualification.physical_review_status === 'Approved' ? 'bg-green-100 text-green-700 ring-1 ring-green-200' : qualification.physical_review_status === 'Rejected' ? 'bg-red-100 text-red-700 ring-1 ring-red-200' : 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200', ]">
                                                    <CheckCircle v-if=" qualification.physical_review_status === 'Approved' " class="w-5 h-5" />
                                                    <XCircle v-else-if=" qualification.physical_review_status === 'Rejected' " class="w-5 h-5" />
                                                    <Clock v-else class="w-5 h-5" />
                                                </span>
                                                <span class="text-sm font-medium mt-2 text-gray-700">Verify</span>
                                            </div>
                                            <div class="hidden sm:block w-8 h-0.5 bg-gray-200"></div>
                                            <div class="sm:hidden h-4 w-0.5 bg-gray-200"></div>
                                            <!-- Payment -->
                                             <div class="flex flex-col items-center">
                                                <span class="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                                                      :class="{ 'bg-green-100 text-green-700 ring-1 ring-green-200': qualification.payment_status === 'completed', 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200': qualification.payment_status === 'processing_payment', 'bg-red-100 text-red-700 ring-1 ring-red-200': qualification.payment_status === 'failed', 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200': qualification.payment_status === 'pending', }">
                                                    <CheckCircle v-if=" qualification.payment_status === 'completed' " class="w-5 h-5" />
                                                    <XCircle v-else-if=" qualification.payment_status === 'failed' " class="w-5 h-5" />
                                                    <Clock v-else class="w-5 h-5" />
                                                </span>
                                                <span class="text-sm font-medium mt-2 text-gray-700">Payment</span>
                                            </div>
                                            <div class="hidden sm:block w-8 h-0.5 bg-gray-200"></div>
                                            <div class="sm:hidden h-4 w-0.5 bg-gray-200"></div>
                                            <!-- Endorsement -->
                                            <div class="flex flex-col items-center">
                                                <span class="w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                                                      :class="[ qualification.endorsement_decision === 'Approved' ? 'bg-green-100 text-green-700 ring-1 ring-green-200' : qualification.endorsement_decision === 'Rejected' ? 'bg-red-100 text-red-700 ring-1 ring-red-200' : 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200', ]">
                                                    <CheckCircle v-if=" qualification.endorsement_decision === 'Approved' " class="w-5 h-5" />
                                                    <XCircle v-else-if=" qualification.endorsement_decision === 'Rejected' " class="w-5 h-5" />
                                                    <Clock v-else class="w-5 h-5" />
                                                </span>
                                                <span class="text-sm font-medium mt-2 text-gray-700">Endorse</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Qualification Details Grid -->
                                 <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div class="bg-indigo-50 rounded-xl p-4 border border-indigo-100 hover:border-indigo-300 transition-all duration-300 hover:shadow-md">
                                        <div class="flex items-start space-x-3">
                                            <div class="p-2 bg-white rounded-lg shadow-sm"><Building2 class="w-5 h-5 text-indigo-600" /></div>
                                            <div>
                                                <p class="text-sm font-medium text-indigo-700">Institute</p>
                                                <p class="text-sm font-semibold text-gray-900 mt-1 line-clamp-2">{{ qualification.institute_university_display }}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bg-blue-50 rounded-xl p-4 border border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
                                        <div class="flex items-start space-x-3">
                                            <div class="p-2 bg-white rounded-lg shadow-sm"><GraduationCap class="w-5 h-5 text-blue-600" /></div>
                                            <div>
                                                <p class="text-sm font-medium text-blue-700">Qualification</p>
                                                <p class="text-sm font-semibold text-gray-900 mt-1 line-clamp-2">{{ qualification.qualification_type_display }}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bg-purple-50 rounded-xl p-4 border border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-md">
                                        <div class="flex items-start space-x-3">
                                            <div class="p-2 bg-white rounded-lg shadow-sm"><CalendarCheck class="w-5 h-5 text-purple-600" /></div>
                                            <div>
                                                <p class="text-sm font-medium text-purple-700">Completion</p>
                                                <p class="text-sm font-semibold text-gray-900 mt-1">{{ qualification.completion_year }}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bg-teal-50 rounded-xl p-4 border border-teal-100 hover:border-teal-300 transition-all duration-300 hover:shadow-md">
                                        <div class="flex items-start space-x-3">
                                            <div class="p-2 bg-white rounded-lg shadow-sm"><CreditCard class="w-5 h-5 text-teal-600" /></div>
                                            <div>
                                                <p class="text-sm font-medium text-teal-700">Payment</p>
                                                <div class="flex items-center space-x-2 mt-1">
                                                    <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                                                          :class="{ 'bg-green-100 text-green-800 border border-green-200': qualification.payment_status === 'completed', 'bg-red-100 text-red-800 border border-red-200': qualification.payment_status === 'failed', 'bg-yellow-100 text-yellow-800 border border-yellow-200': qualification.payment_status === 'processing_payment', 'bg-yellow-100 text-yellow-800 border border-yellow-200': qualification.payment_status === 'pending', }">
                                                        {{ qualification.payment_status === 'completed' ? 'Paid' : qualification.payment_status === 'processing_payment' ? 'Processing' : qualification.payment_status === 'failed' ? 'Failed' : 'Pending' }}
                                                    </span>
                                                    <span v-if="qualification.payment_id" class="text-sm text-gray-500 truncate">#{{ qualification.payment_id.substring(0, 8) }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                               <!-- Payment Button -->
                               <button
                                   v-if="shouldShowPaymentButton(qualification)"
                                   @click="initiatePayment(application, qualification)"
                                   class="relative mt-4 inline-flex items-center px-4 py-2 text-sm bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all shadow-md overflow-hidden"
                                   :class="{ 'animate-pulse': qualification.payment_status !== 'failed' }"
                               >
                                   <div class="absolute inset-0 border-2 border-transparent animate-border-pulse pointer-events-none"></div>
                                   <CreditCard class="w-4 h-4 mr-2" />
                                   <span>{{ getPaymentButtonText(qualification) }}</span>
                               </button>
                           </div>
                       </div>
                   </div>
              </div>
          </div>

          <!-- No Results Message -->
          <div
              v-if="
                  hasSearched &&
                  !apiError &&
                  getApplicationsForTab(currentTab).length === 0
              "
              class="relative overflow-hidden backdrop-blur-sm bg-white/80 rounded-2xl p-8 sm:p-12 shadow-lg border border-indigo-100 text-center"
            >
              <div class="absolute -top-16 -right-16 w-40 h-40 bg-indigo-100 rounded-full opacity-30 blur-xl"></div>
              <div class="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-100 rounded-full opacity-40 blur-lg"></div>

              <div class="relative z-10">
                  <div class="p-3 bg-gray-100 rounded-full mb-4 mx-auto w-fit">
                      <SearchX class="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 class="text-xl sm:text-2xl font-semibold text-gray-700 mb-3">
                      No {{ currentTab.charAt(0).toUpperCase() + currentTab.slice(1) }} Applications Found
                  </h3>
                  <p class="text-gray-600 max-w-md mx-auto text-sm sm:text-base">
                      We couldn't find any {{ currentTab }} applications associated with your CID. Please check back later or submit a new application if needed.
                  </p>
              </div>
          </div>


          <!-- API Error Message -->
            <div
                v-if="apiError"
                class="relative overflow-hidden backdrop-blur-sm bg-red-50/80 rounded-2xl p-8 sm:p-12 shadow-lg border border-red-200 text-center"
            >
                <div class="absolute -top-16 -right-16 w-40 h-40 bg-red-100 rounded-full opacity-30 blur-xl"></div>
                <div class="absolute -bottom-12 -left-12 w-32 h-32 bg-red-100 rounded-full opacity-40 blur-lg"></div>

                <div class="relative z-10">
                    <div class="p-3 bg-red-100 rounded-full mb-4 mx-auto w-fit">
                        <AlertTriangle class="w-8 h-8 text-red-500" />
                    </div>
                    <h3 class="text-xl sm:text-2xl font-semibold text-red-700 mb-3">
                        Error Loading Data
                    </h3>
                    <p class="text-red-600 max-w-md mx-auto text-sm sm:text-base">
                        An error occurred while fetching your application data. Please ensure you are logged in, check your internet connection, and try again later. If the problem persists, contact support.
                    </p>
                </div>
            </div>
      </div>

      <!-- Certificate Modal -->
      <CertificateModal
          :qualification="selectedApplicationForModal"
          :showModal="showCertificateModal"
          @close="closeCertificateModal"
      />

      <!-- Payment Modal -->
      <PaymentModal
          ref="paymentModal"
          :amount="1000"
          @payment-completed="handlePaymentCompleted"
          @close="closePaymentModal"
      />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import apiService from '@/services/services' // Ensure correct path
import CertificateModal from './CertificateModal.vue' // Ensure correct path
import PaymentModal from '@/components/common/PaymentModal.vue' // Ensure correct path
import PageHeader from '@/components/common/MHPC/PageHeader.vue' // Ensure correct path
import {
  FileText, IdCard, BarChart, Phone, MapPin, Calendar, GraduationCap,
  Building2, CalendarCheck, CreditCard, CheckCircle, XCircle, Clock,
  AlertTriangle, SearchX, ClipboardList,
} from 'lucide-vue-next' // Added missing icons
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore' // Ensure correct path

const toast = useToast()
const authStore = useAuthStore()

// State
const applications = ref([]) // Will hold ALL fetched applications
const isLoading = ref(false)
const hasSearched = ref(false) // Tracks if a fetch attempt was made
const apiError = ref(false)
const showCertificateModal = ref(false)
const selectedApplicationForModal = ref(null) // Store the whole app object for the modal if needed
const paymentModal = ref(null)
const selectedQualificationForPayment = ref(null) // Qualification being paid for
const selectedApplicationForPayment = ref(null) // Parent application of the qualification being paid for
const currentTab = ref('registration')

// Tabs Configuration
const tabs = [
  { name: 'registration', label: 'Registration Applications' },
  { name: 'renewal', label: 'Renewal Applications' },
  { name: 'additional', label: 'Additional Applications' },
]

// Computed Properties
const userCid = computed(() => authStore.user?.cid)

// Filters the main 'applications' array based on type
const registrationApplications = computed(() => {
  return applications.value.filter(app => app.application_type === 'registration')
})

const renewalApplications = computed(() => {
  return applications.value.filter(app => app.application_type === 'renewal')
})

const additionalApplications = computed(() => {
  // Assuming 'additional' applications might also use 'registration' type endpoint/flag
  // Or if they have a specific type, adjust here e.g., app.application_type === 'additional'
  return applications.value.filter(app => app.application_type === 'additional')
})

// Helper to get the correct list for the "No Results" message
const getApplicationsForTab = (tabName) => {
  switch (tabName) {
      case 'registration': return registrationApplications.value
      case 'renewal': return renewalApplications.value
      case 'additional': return additionalApplications.value
      default: return []
  }
}

// Methods

// Determine payment button text based on status
const getPaymentButtonText = (qualification) => {
  if (qualification?.payment_status === 'failed') {
      return 'Re-process Payment'
  }
  return 'Proceed to Payment'
}

// Fetch ALL applications for the logged-in user
const fetchApplications = async () => {
  if (!userCid.value) {
      console.warn('User CID not available for fetching applications.');
      // Keep isLoading false, set error states
      isLoading.value = false;
      apiError.value = true;
      hasSearched.value = true; // Mark as searched even on initial error
      toast.warning('Please log in to view your application status.');
      return;
  }

  isLoading.value = true;
  apiError.value = false;
  hasSearched.value = false; // Reset search status before fetch
  applications.value = []; // Clear previous results

  try {
      // *** Assumption: getMhpcFullApplicationListByCid fetches ALL relevant types ***
      // Adjust if separate calls are needed for renewals vs registration/additional
      const response = await apiService.getMhpcFullApplicationListByCid(userCid.value);

      // Check if the response structure is as expected
      if (response && response.data && Array.isArray(response.data.results)) {
          // Filter out applications that don't have the necessary user_qualifications structure
          // This handles potential inconsistencies in the API response
          applications.value = response.data.results.filter(app => Array.isArray(app.user_qualifications));

          if (applications.value.length !== response.data.results.length) {
              console.warn('Some fetched applications were filtered out due to missing user_qualifications array.');
          }
          // Optional: Log the fetched types to verify
          // console.log("Fetched application types:", [...new Set(applications.value.map(a => a.application_type))]);
      } else {
          console.warn('Unexpected API response structure or no results:', response);
          applications.value = []; // Set to empty array if structure is wrong or no results
          // Don't show error toast if API just returned empty results correctly
          if (response?.status !== 200 && response?.status !== 204) {
             toast.info('No application data found or unexpected format received.');
          }
      }

  } catch (error) {
      console.error('Error fetching applications:', error);
      applications.value = [];
      apiError.value = true;
      toast.error('Failed to load application data. Please try again later.');
  } finally {
      isLoading.value = false;
      hasSearched.value = true; // Mark fetch attempt as completed
  }
}


// Check if any qualification in the application is approved
// eslint-disable-next-line no-unused-vars
const isApplicationActive = (application) => {
  // Added safety check for user_qualifications array existence
  return Array.isArray(application.user_qualifications) && application.user_qualifications.some(
      (qualification) => qualification.endorsement_decision === 'Approved'
  );
}

// Show certificate modal
const openCertificateModal = (application) => {
    selectedApplicationForModal.value = { results: [application] };
    showCertificateModal.value = true;
}

// Close certificate modal
const closeCertificateModal = () => {
  showCertificateModal.value = false
  selectedApplicationForModal.value = null
}

// Check conditions for showing the payment button for a qualification
const shouldShowPaymentButton = (qualification) => {
    // Added null checks for safety
    return qualification &&
           qualification.physical_review_status === 'Approved' &&
           qualification.endorsement_decision === 'Pending' &&
           qualification.payment_status !== 'completed' &&
           qualification.payment_status !== 'processing_payment';
}

// Prepare and open the payment modal
const initiatePayment = (application, qualification) => {
  if (qualification && application) {
      selectedQualificationForPayment.value = qualification;
      selectedApplicationForPayment.value = application;
      paymentModal.value?.openModal(); // Use optional chaining
  } else {
      toast.error('Cannot initiate payment. Application or qualification data is missing.');
      console.error('Missing data for payment:', { application, qualification });
  }
}

// Close payment modal and clear selection
const closePaymentModal = () => {
  selectedQualificationForPayment.value = null;
  selectedApplicationForPayment.value = null;
  // The payment modal component should handle its own closing state if needed
  // If the modal component doesn't manage its visibility state internally, add:
  // if (paymentModal.value) { paymentModal.value.closeModal(); }
}

// Check if the main certificate button should be shown for the application
const shouldShowViewCertificateButton = (application) => {
  // Added safety check for user_qualifications array existence
  return Array.isArray(application.user_qualifications) && application.user_qualifications.some(
      (q) => q.is_primary_qualification && q.endorsement_decision === 'Approved'
  );
}

// Handle the callback after successful payment in the modal
const handlePaymentCompleted = async (paymentData) => {
  if (!selectedQualificationForPayment.value || !selectedApplicationForPayment.value) {
      toast.error('Payment context lost. Cannot update application status.');
      console.error('Missing selected qualification or application for payment completion.');
      closePaymentModal();
      return;
  }

  const qualification = selectedQualificationForPayment.value;
  const application = selectedApplicationForPayment.value;
  const paymentId = paymentData.paymentHash;
  const user = authStore.user;

  if (!user?.id || !user.contact_number || !user.email || !user.cid) {
      toast.error('User information is incomplete. Cannot proceed with payment update.');
      closePaymentModal();
      return;
  }
  if (!paymentId) {
      toast.error('Payment ID missing. Cannot update application status.');
      closePaymentModal();
      return;
  }

  isLoading.value = true;

  try {
      // 1. Call the generic makePayment endpoint
      const paymentInitiationFormData = new FormData();
      paymentInitiationFormData.append('refNo', paymentId);
      paymentInitiationFormData.append('serviceCode', '100196');
      paymentInitiationFormData.append('taxPayerName', user.cid);
      paymentInitiationFormData.append('taxPayerNo', user.cid);
      paymentInitiationFormData.append('taxPayerDocumentNo', user.cid);
      paymentInitiationFormData.append('totalPayableAmount', 1000);
      paymentInitiationFormData.append('description', `MHPC ${application.application_type} Fee - Qual ID: ${qualification.id}`);
      paymentInitiationFormData.append('mobileNo', user.contact_number);
      paymentInitiationFormData.append('payerEmail', user.email);
      paymentInitiationFormData.append('user', user.id);
      paymentInitiationFormData.append('payableAmount', 1000);
      paymentInitiationFormData.append('application_no', qualification.id); // Link payment to qualification
      const appTypeIdentifier = (application.application_type === 'renewal')
          ? 'specification_for_health_renewal'
          : 'specification_for_health_certification';
      paymentInitiationFormData.append('app_type', appTypeIdentifier);

      await apiService.makePayment(paymentInitiationFormData);
      console.log('makePayment call successful for:', paymentId);

      // 2. Patch the specific application type
      const updateFormData = new FormData();
      updateFormData.append('payment_id', paymentId);
      updateFormData.append('payment_status', 'processing_payment');

      let patchPromise;
      // Determine the correct ID to patch (application ID or qualification ID - check backend)
      // Assuming backend patches the APPLICATION record based on its ID for simplicity here.
      const patchId = application.id; // <<< CONFIRM THIS WITH BACKEND

      if (application.application_type === 'renewal') {
          patchPromise = apiService.patchMhpcRenewal(patchId, updateFormData);
          console.log(`Attempting to patch renewal application ID: ${patchId}`);
      } else { // 'registration' or 'additional'
          patchPromise = apiService.patchMhpcNewApplication(patchId, updateFormData);
          console.log(`Attempting to patch new/additional application ID: ${patchId}`);
      }

      await patchPromise;
      console.log(`Patch successful for application ID: ${patchId}, type: ${application.application_type}`);

      // 3. Update local state optimistically
      qualification.payment_id = paymentId;
      qualification.payment_status = 'processing_payment';

      toast.success(`Payment initiated (ID: ${paymentId.substring(0, 8)}...). Status updated.`);

  } catch (error) {
      console.error('Payment update/patching error:', error.response?.data || error.message || error);
      const errorMsg = error.response?.data?.detail || error.response?.data?.errors || error.response?.data?.message || 'Payment processing failed after completion.';
      // Check for specific error structures if known
      let displayError = errorMsg;
      if (typeof errorMsg === 'object') {
          displayError = Object.values(errorMsg).flat().join(' '); // Flatten potential nested errors
      }
      toast.error(`${displayError} Please check status again later or contact support.`);
      // Consider reverting optimistic update on failure
      // qualification.payment_status = 'failed';
  } finally {
      isLoading.value = false;
      closePaymentModal();
      // Refetch data to ensure consistency after operation
      fetchApplications();
  }
}


// Lifecycle Hook
onMounted(() => {
  if (userCid.value) {
      fetchApplications();
  } else {
      console.warn('User CID not available on mount. Cannot fetch applications.');
      // Set error state, but keep isLoading false as no fetch is happening
      isLoading.value = false;
      apiError.value = true;
      hasSearched.value = true; // Indicate an attempt was made (or should have been)
      toast.warning('Please log in to view application status.');
  }
})
</script>

<style scoped>
@keyframes border-pulse {
  0%, 100% {
      border-color: rgba(20, 184, 166, 0.3); /* teal-500 with opacity */
      transform: scale(1);
  }
  50% {
      border-color: rgba(6, 182, 212, 0.6); /* cyan-600 with opacity */
      transform: scale(1.05);
  }
}

.animate-border-pulse {
  animation: border-pulse 2s ease-in-out infinite;
  border-radius: 0.75rem; /* match button's rounded-xl */
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /* autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
  overflow: hidden;
}
</style>