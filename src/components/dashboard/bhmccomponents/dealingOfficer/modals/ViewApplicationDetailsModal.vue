<!-- ViewApplicationDetailsModal.vue -->
<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModalHandler" class="relative z-50">
      <TransitionChild as="div" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild as="div" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-gray-50 shadow-2xl transition-all"
              v-if="application">
              <div class="relative">
                <!-- Enhanced Status Banner -->
                <div :class="[
                  'px-8 py-6 border-b relative overflow-hidden',
                  {
                    'bg-yellow-50 border-yellow-100': overallStatus === 'Pending',
                    'bg-green-50 border-green-100': overallStatus === 'Approved',
                    'bg-red-50 border-red-100': overallStatus === 'Regretted',
                  },
                ]">
                  'px-8 py-6 border-b relative overflow-hidden',
                  {
                    'bg-yellow-50 border-yellow-100': overallStatus === 'Pending',
                    'bg-green-50 border-green-100': overallStatus === 'Approved',
                    'bg-red-50 border-red-100': overallStatus === 'Regretted',
                  },
                ]">
                  <div class="flex items-center justify-between relative z-10">
                    <div class="flex items-center space-x-4">
                      <div class="p-3 bg-white rounded-lg shadow-sm">
                        <FileText class="h-7 w-7 text-gray-700" />
                      </div>
                      <div>
                        <DialogTitle as="h3" class="text-2xl font-semibold text-gray-900">
                          Application Details
                        </DialogTitle>
                        <p class="text-sm text-gray-600 mt-1">Review and manage application information</p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-4">
                      <span :class="[
                        'px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center space-x-2 shadow-sm',
                        {
                          'bg-yellow-100 text-yellow-800': overallStatus === 'Pending',
                          'bg-green-100 text-green-800': overallStatus === 'Approved',
                          'bg-red-100 text-red-800': overallStatus === 'Regretted',
                        },
                      ]">
                        'px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center space-x-2 shadow-sm',
                        {
                          'bg-yellow-100 text-yellow-800': overallStatus === 'Pending',
                          'bg-green-100 text-green-800': overallStatus === 'Approved',
                          'bg-red-100 text-red-800': overallStatus === 'Regretted',
                        },
                      ]">
                        <Circle class="h-4 w-4" :class="{
                          'text-yellow-500': overallStatus === 'Pending',
                          'text-green-500': overallStatus === 'Approved',
                          'text-red-500': overallStatus === 'Regretted',
                        }" />
                        <span>{{ overallStatus }}</span>
                      </span>
                      <button type="button"
                        class="p-2 text-gray-400 hover:text-gray-500 transition-colors rounded-full hover:bg-white"
                        @click="closeModal">
                        <span class="sr-only">Close</span>
                        <X class="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                  <!-- Decorative pattern -->
                  <div class="absolute right-0 top-0 -mt-6 -mr-6 opacity-10">
                    <div class="transform rotate-45">
                      <FileText class="h-32 w-32" />
                    </div>
                  </div>
                </div>

                <!-- Main Content -->
                <div class="px-8 py-6 bg-white">
                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <!-- Left Column -->
                    <div class="lg:col-span-1 space-y-6">
                      <!-- Enhanced Personal Information Card -->
                      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="p-6">
                          <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
                            <User class="h-5 w-5 text-gray-500" />
                            <span>Personal Information</span>
                          </h4>
                          <div class="flex flex-col items-center space-y-4">
                            <div class="relative group">
                              <img :src="application.passport_photo || '/placeholder-avatar.png'"
                                @error="handleImageError"
                                class="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg transition-transform group-hover:scale-105" />
                              <span
                                class="absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-white shadow-sm"
                                :class="{
                                  'bg-yellow-400': overallStatus === 'Pending',
                                  'bg-green-400': overallStatus === 'Approved',
                                  'bg-red-400': overallStatus === 'Regretted',
                                }" />
                            </div>
                            <div class="text-center">
                              <h5 class="text-xl font-semibold text-gray-900">{{ application.full_name }}</h5>
                              <p class="text-sm text-gray-500 mt-1">CID: {{ application.cid_no }}</p>
                            </div>
                            </div>
                            <div class="w-full grid grid-cols-2 gap-4 mt-4">
                              <div class="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                                <UserCircle class="h-4 w-4 text-gray-400" />
                                <span class="text-sm text-gray-600">{{ application.gender }}</span>
                              </div>
                              <div class="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                                <Calendar class="h-4 w-4 text-gray-400" />
                                <span class="text-sm text-gray-600">{{ formatDate(application.date_of_birth) }}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Enhanced Counselor Status Section -->
                        <div class="border-t border-gray-100 p-6 bg-gray-50">
                          <div class="flex flex-col space-y-4">
                            <h5 class="font-medium text-gray-900">Counselor Status</h5>
                            <div class="flex items-center justify-between">
                              <span class="text-sm text-gray-600">
                                {{ application.is_counselor ? 'Registered Counselor' : 'Not a Counselor' }}
                              </span>
                              <button v-if="isEditing && !application.is_counselor"
                                @click="editableApplication.is_counselor = !editableApplication.is_counselor" :class="[
                                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                                  editableApplication.is_counselor
                                    ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                ]">
                                {{ editableApplication.is_counselor ? 'Cancel Registration' : 'Register as Counselor' }}
                              </button>
                              <span v-else-if="application.is_counselor"
                                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                                <Check class="h-4 w-4 mr-1" />
                                Verified Counselor
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Contact Information Card -->
                      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="p-6">
                          <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
                            <Contact class="h-5 w-5 text-gray-500" />
                            <span>Contact Information</span>
                          </h4>
                          <div class="space-y-4">
                            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Mail class="h-4 w-4 text-gray-400" />
                              <span class="text-sm text-gray-600">{{ application.email_address }}</span>
                            </div>
                            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Phone class="h-4 w-4 text-gray-400" />
                              <span class="text-sm text-gray-600">{{ application.contact_no }}</span>
                            </div>
                            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <MapPin class="h-4 w-4 text-gray-400" />
                              <span class="text-sm text-gray-600">
                                {{ application.village }}, {{ application.gewog }}, {{ application.dzongkhag }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Right Column -->
                    <div class="lg:col-span-2 space-y-6">
                      <!-- New Application Review Status Section -->
                      <div v-if="isEditing && editableQualification"
                        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="p-6">
                          <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
                            <ClipboardCheck class="h-5 w-5 text-gray-500" />
                            <span>Application Review Status</span>
                          </h4>
                          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <!-- Application Review -->
                            <div class="space-y-4">
                              <div class="p-4 bg-gray-50 rounded-lg">
                                <h5 class="font-medium text-gray-900 mb-3">Document Review</h5>
                                <select v-model="editableQualification.application_review_status"
                                  @change="() => console.log('application_review_status changed:', editableQualification.value)"
                                  class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                  <option value="Pending">Pending Review</option>
                                  <option value="Approved">Approve Documents</option>
                                  <option value="Regretted">Reject Documents</option>
                                </select>
                                <textarea v-if="editableQualification.application_review_status === 'Regretted'"
                                  v-model="editableQualification.application_review_remark"
                                  placeholder="Provide rejection reason..."
                                  class="mt-3 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  rows="3">
                                </textarea>
                              </div>
                            </div>

                            <!-- Physical Review -->
                            <div class="space-y-4">
                              <div class="p-4 bg-gray-50 rounded-lg">
                                <h5 class="font-medium text-gray-900 mb-3">Physical Verification</h5>
                                <select v-model="editableQualification.physical_review_status"
                                  @change="() => console.log('physical_review_status changed:', editableQualification.value)"
                                  class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                  <option value="Pending">Pending Verification</option>
                                  <option value="Approved">Verify Documents</option>
                                  <option value="Regretted">Reject Verification</option>
                                </select>

                                <textarea v-if="editableQualification.physical_review_status === 'Regretted'"
                                  v-model="editableQualification.physical_review_remark"
                                  placeholder="Provide rejection reason..."
                                  class="mt-3 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  rows="3">
                                </textarea>
                              </div>
                            </div>

                            <!-- Endorsement -->
                            <div class="space-y-4">
                              <div class="p-4 bg-gray-50 rounded-lg">
                                <h5 class="font-medium text-gray-900 mb-3">Final Endorsement</h5>
                                <select v-model="editableQualification.endorsement_decision"
                                  @change="() => console.log('endorsement_decision changed:', editableQualification.value)"
                                  class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                  <option value="Pending">Pending Decision</option>
                                  <option value="Approved">Endorse Application</option>
                                  <option value="Regretted">Reject Application</option>
                                </select>
                                <textarea v-if="editableQualification.endorsement_decision === 'Regretted'"
                                  v-model="editableQualification.endorsement_remarks"
                                  placeholder="Provide rejection reason..."
                                  class="mt-3 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  rows="3">
                                </textarea>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Application Details Card -->
                      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="p-6">
                          <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
                            <FileText class="h-5 w-5 text-gray-500" />
                            <span>Application Details</span>
                          </h4>
                          <div class="grid grid-cols-2 gap-6">
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Registration Type</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                <FileCheck class="h-4 w-4 text-gray-400" />
                                <span>{{ application.registration_type?.name }}</span>
                              </p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Registration Number</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                <Hash class="h-4 w-4 text-gray-400" />
                                <span>{{ application.registration_no }}</span>
                              </p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Registration Date</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                <Calendar class="h-4 w-4 text-gray-400" />
                                <span>{{ formatDate(application.registration_date) }}</span>
                              </p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Expiry Date</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                <Clock class="h-4 w-4 text-gray-400" />
                                <span>{{ formatDate(application.expiry_date) }}</span>
                              </p>
                            </div>

                            <!-- Personnel Category -->
                            <div class="p-4 bg-gray-50 rounded-lg" v-if="!isEditing">
                              <p class="text-sm font-medium text-gray-500">Personnel Category</p>
                              <p class="text-sm text-gray-900 mt-2">
                                <span>{{ application.personnel_category }}</span>
                              </p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg" v-else>
                              <p class="text-sm font-medium text-gray-500">Personnel Category</p>
                              <select v-model="editableApplication.personnel_category"
                                class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="" disabled>Select Category</option>
                                <option v-for="category in personnelCategories" :key="category.id"
                                  :value="category.name">
                                <option v-for="category in personnelCategories" :key="category.id"
                                  :value="category.name">
                                  {{ category.name }}
                                </option>
                              </select>
                            </div>

                            <!-- Personnel Subcategory -->
                            <div class="p-4 bg-gray-50 rounded-lg" v-if="!isEditing">
                              <p class="text-sm font-medium text-gray-500">Personnel Subcategory</p>
                              <p class="text-sm text-gray-900 mt-2">
                                <span>{{ application.personnel_subcategory }}</span>
                              </p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg" v-else>
                              <p class="text-sm font-medium text-gray-500">Personnel Subcategory</p>
                              <select v-model="editableApplication.personnel_subcategory"
                                class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="" disabled>Select Subcategory</option>
                                <option v-for="subcategory in personnelSubcategories" :key="subcategory.id"
                                  :value="subcategory.name">
                                  {{ subcategory.name }}
                                </option>
                              </select>
                            </div>

                            <!-- Practice Address -->
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Practice Address</p>
                              <input type="text" v-model="editableApplication.practice_address"
                                class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter Practice Address" />
                            </div>


                            <!-- Sector -->
                            <div class="p-4 bg-gray-50 rounded-lg" v-if="!isEditing">
                              <p class="text-sm font-medium text-gray-500">Sector</p>
                              <p class="text-sm text-gray-900 mt-2">
                                <span>{{ application.sector }}</span>
                              </p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg" v-else>
                              <p class="text-sm font-medium text-gray-500">Sector</p>
                              <select v-model="editableApplication.sector"
                                class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="" disabled>Select Sector</option>
                                <option v-for="sector in sectors" :key="sector.id" :value="sector.name">
                                  {{ sector.name }}
                                </option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Qualification Details Card -->
                      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="p-6">
                          <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
                            <GraduationCap class="h-5 w-5 text-gray-500" />
                            <span>Qualification Details</span>
                          </h4>
                          <div v-if="application.user_qualifications && application.user_qualifications.length > 0"
                            class="space-y-6">
                            <div v-for="qualification in application.user_qualifications" :key="qualification.id"
                              class="bg-gray-50 rounded-lg p-6">
                              <div class="grid grid-cols-2 gap-6">
                                <div>
                                  <p class="text-sm font-medium text-gray-500">Qualification</p>
                                  <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                    <GraduationCap class="h-4 w-4 text-gray-400" />
                                    <span>{{ qualification.qualification_name_display }}</span>
                                  </p>
                                </div>
                                <div>
                                  <p class="text-sm font-medium text-gray-500">Qualification Type</p>
                                  <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                    <ClipboardCheck class="h-4 w-4 text-gray-400" />
                                    <span>{{ qualification.qualification_type_display }}</span>
                                  </p>
                                </div>
                                <div>
                                  <p class="text-sm font-medium text-gray-500">Institute/University</p>
                                  <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                    <MapPin class="h-4 w-4 text-gray-400" />
                                    <span>{{ qualification.institute_university_display }}</span>
                                  </p>
                                </div>
                                <div>
                                  <p class="text-sm font-medium text-gray-500">Completion Year</p>
                                  <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                    <Calendar class="h-4 w-4 text-gray-400" />
                                    <span>{{ qualification.completion_year }}</span>
                                  </p>
                                </div>
                              </div>

                              <!-- Review Status Summary (when not editing) -->
                              <div v-if="!isEditing" class="mt-6 pt-6 border-t border-gray-200">
                                <div class="grid grid-cols-3 gap-6">
                                  <div class="space-y-2">
                                    <h6 class="text-sm font-medium text-gray-700">Document Review</h6>
                                    <div class="flex items-center space-x-2">
                                      <span :class="[
                                        'w-2 h-2 rounded-full',
                                        {
                                          'bg-yellow-400': qualification.application_review_status === 'Pending',
                                          'bg-green-400': qualification.application_review_status === 'Approved',
                                          'bg-red-400': qualification.application_review_status === 'Regretted'
                                        }
                                      ]"></span>
                                        'w-2 h-2 rounded-full',
                                        {
                                          'bg-yellow-400': qualification.application_review_status === 'Pending',
                                          'bg-green-400': qualification.application_review_status === 'Approved',
                                          'bg-red-400': qualification.application_review_status === 'Regretted'
                                        }
                                      ]"></span>
                                      <span class="text-sm text-gray-600">{{ qualification.application_review_status
                                      }}</span>
                                    </div>
                                    <p v-if="qualification.application_review_remark"
                                      class="text-sm text-gray-500 mt-1">
                                      {{ qualification.application_review_remark }}
                                    </p>
                                  </div>

                                  <div class="space-y-2">
                                    <h6 class="text-sm font-medium text-gray-700">Physical Verification</h6>
                                    <div class="flex items-center space-x-2">
                                      <span :class="[
                                        'w-2 h-2 rounded-full',
                                        {
                                          'bg-yellow-400': qualification.physical_review_status === 'Pending',
                                          'bg-green-400': qualification.physical_review_status === 'Approved',
                                          'bg-red-400': qualification.physical_review_status === 'Regretted'
                                        }
                                      ]"></span>
                                        'w-2 h-2 rounded-full',
                                        {
                                          'bg-yellow-400': qualification.physical_review_status === 'Pending',
                                          'bg-green-400': qualification.physical_review_status === 'Approved',
                                          'bg-red-400': qualification.physical_review_status === 'Regretted'
                                        }
                                      ]"></span>
                                      <span class="text-sm text-gray-600">{{ qualification.physical_review_status
                                      }}</span>
                                    </div>
                                    <p v-if="qualification.physical_review_remark" class="text-sm text-gray-500 mt-1">
                                      {{ qualification.physical_review_remark }}
                                    </p>
                                  </div>

                                  <div class="space-y-2">
                                    <h6 class="text-sm font-medium text-gray-700">Final Endorsement</h6>
                                    <div class="flex items-center space-x-2">
                                      <span :class="[
                                        'w-2 h-2 rounded-full',
                                        {
                                          'bg-yellow-400': qualification.endorsement_decision === 'Pending',
                                          'bg-green-400': qualification.endorsement_decision === 'Approved',
                                          'bg-red-400': qualification.endorsement_decision === 'Regretted'
                                        }
                                      ]"></span>
                                        'w-2 h-2 rounded-full',
                                        {
                                          'bg-yellow-400': qualification.endorsement_decision === 'Pending',
                                          'bg-green-400': qualification.endorsement_decision === 'Approved',
                                          'bg-red-400': qualification.endorsement_decision === 'Regretted'
                                        }
                                      ]"></span>
                                      <span class="text-sm text-gray-600">{{ qualification.endorsement_decision
                                      }}</span>
                                    </div>
                                    <p v-if="qualification.endorsement_remarks" class="text-sm text-gray-500 mt-1">
                                      {{ qualification.endorsement_remarks }}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div v-else class="p-6 bg-gray-50 rounded-lg">
                            <p class="text-sm text-gray-500 flex items-center space-x-2">
                              <CircleAlert class="h-4 w-4" />
                              <span>No qualification details found for this application.</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Enhanced Footer -->
                <div class="px-8 py-4 bg-gray-50 border-t border-gray-200">
                  <div class="flex justify-between items-center">
                    <div v-if="errorMessage" class="text-sm text-red-600 flex items-center space-x-2">
                      <CircleAlert class="h-4 w-4" />
                      <span>{{ errorMessage }}</span>
                    </div>
                    <div class="flex items-center space-x-4">
                      <button type="button"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                        @click="closeModal">
                        <X class="h-4 w-4" />
                        <span>Close</span>
                      </button>

                      <button v-if="overallStatus === 'Approved' && !isEditing" type="button"
                        class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                        @click="openCertificateModal"> <!-- Changed to openCertificateModal -->
                        @click="openCertificateModal"> <!-- Changed to openCertificateModal -->
                        <FileText class="h-4 w-4" />
                        <span>View Certificate</span>
                      </button>

                      <button v-if="!isEditing" type="button"
                        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                        @click="startEditing">
                        <Pencil class="h-4 w-4" />
                        <span>Edit Application</span>
                      </button>

                      <button v-if="isEditing" type="button"
                        class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                        @click="saveChanges">
                        <Check class="h-4 w-4" />
                        <span>Save Changes</span>
                      </button>

                      <button v-if="isEditing" type="button"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                        @click="cancelEditing">
                        <X class="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
  <CertificateModal :isOpen="isCertificateModalOpen" :applicationId="application?.id" @close="closeCertificateModal" />
  <!-- CertificateModal here -->
  <CertificateModal :isOpen="isCertificateModalOpen" :applicationId="application?.id" @close="closeCertificateModal" />
  <!-- CertificateModal here -->
</template>

<script setup>
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from '@headlessui/vue';
import {
  User,
  UserCircle,
  Calendar,
  Contact,
  Mail,
  Phone,
  MapPin,
  FileText,
  FileCheck,
  Hash,
  Clock,
  GraduationCap,
  ClipboardCheck,
  CircleAlert,
  Circle,
  Check,
  X,
  Pencil,
} from 'lucide-vue-next';
import { ref, computed, watch } from 'vue';
import apiServices from '@/services/services';
import CertificateModal from './CertificateModal.vue';
import isEqual from 'lodash/isEqual'; // Import lodash isEqual for deep object comparison

const props = defineProps({
  isOpen: Boolean,
  application: {
    type: Object,
    default: () => null,
  },
  onDownloadCertificate: {  // Keep this
    type: Function,
    default: () => { }
  }
});

const emit = defineEmits(['close', 'update']);
const isEditing = ref(false);
const editableQualification = ref({});
const editableApplication = ref({});
const originalApplicationData = ref(null); // Store original application data
const originalQualificationData = ref(null); // Store original qualification data
const isLoading = ref(false);
const errorMessage = ref('');
const isCertificateModalOpen = ref(false);


watch(() => props.application, (newApplication) => {
  if (newApplication) {
    originalApplicationData.value = JSON.parse(JSON.stringify(newApplication)); // Deep copy application
    if (newApplication.user_qualifications && newApplication.user_qualifications.length > 0) {
      editableQualification.value = JSON.parse(JSON.stringify(newApplication.user_qualifications[0])); // Deep copy qualification
      originalQualificationData.value = JSON.parse(JSON.stringify(newApplication.user_qualifications[0])); // Deep copy original qualification
    } else {
      editableQualification.value = {}; // <--- REVERT BACK TO EMPTY OBJECT
      originalQualificationData.value = null;
    }
    editableApplication.value = JSON.parse(JSON.stringify(newApplication)); // Deep copy editableApplication
  }
  errorMessage.value = '';
}, { deep: true, immediate: true });

const handleImageError = (event) => {
  event.target.src = '/placeholder-avatar.png';
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

const overallStatus = computed(() => {
  if (!props.application?.user_qualifications?.[0]) return 'Pending';

  const appReview = props.application.user_qualifications[0].application_review_status;
  const physReview = props.application.user_qualifications[0].physical_review_status;
  const endorse = props.application.user_qualifications[0].endorsement_decision;

  if (appReview === 'Regretted' || physReview === 'Regretted' || endorse === 'Regretted') {
    return 'Regretted';
  } else if (appReview === 'Approved' && physReview === 'Approved' && endorse === 'Approved') {
    return 'Approved';
  } else {
    return 'Pending';
  }
});

const startEditing = () => {
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
  if (originalApplicationData.value) {
    editableApplication.value = { ...originalApplicationData.value };
  }
  if (originalQualificationData.value) {
    editableQualification.value = { ...originalQualificationData.value };
  }
  errorMessage.value = '';
};

// Helper function to get changed fields in application data
const getChangedApplicationFields = () => {
  console.log("getChangedApplicationFields - originalApplicationData.value:", originalApplicationData.value);
  console.log("getChangedApplicationFields - editableApplication.value:", editableApplication.value);

  const changedFields = {};
  if (!originalApplicationData.value) return changedFields;

  for (const key in editableApplication.value) {
    if (key === 'userDetails') { // Special handling for nested userDetails if needed
      if (!isEqual(editableApplication.value.userDetails, originalApplicationData.value.userDetails)) {
        changedFields[key] = editableApplication.value[key]; // Or compare nested fields if necessary
      }
    } else if (!isEqual(editableApplication.value[key], originalApplicationData.value[key])) {
        changedFields[key] = editableApplication.value[key];
    }
  }
  console.log("Changed Application Fields:", changedFields);
  return changedFields;
};

// Helper function to get changed fields in qualification data
const getChangedQualificationFields = () => {
  console.log("getChangedQualificationFields - originalQualificationData.value:", originalQualificationData.value);
  console.log("getChangedQualificationFields - editableQualification.value:", editableQualification.value);

  const changedFields = {};
  if (!originalQualificationData.value) return changedFields;

  for (const key in editableQualification.value) {
    console.log(`Comparing key: ${key}`); // <--- ADD THIS LOG
    console.log(`  originalQualificationData.value[${key}]:`, originalQualificationData.value[key]); // <--- ADD THIS LOG
    console.log(`  editableQualification.value[${key}]:`, editableQualification.value[key]); // <--- ADD THIS LOG
    if (!isEqual(editableQualification.value[key], originalQualificationData.value[key])) {
      changedFields[key] = editableQualification.value[key];
    }
  }
  console.log("Changed Qualification Fields:", changedFields);
  return changedFields;
};
const saveChanges = async () => {
  console.log("saveChanges function called!");
  if (!props.application) return;

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const changedApplicationFields = getChangedApplicationFields();
    const changedQualificationFields = getChangedQualificationFields();

    // Prepare payloads for API calls, only include changed data
    const userUpdatePayload = {};
    if (changedApplicationFields.is_counselor !== undefined && editableApplication.value.userDetails?.id) {
      userUpdatePayload.is_counselor = changedApplicationFields.is_counselor;
    }

    const applicationUpdatePayload = { ...changedApplicationFields };
  if (changedQualificationFields && Object.keys(changedQualificationFields).length > 0) {
    applicationUpdatePayload.user_qualifications = [editableQualification.value] // Send qualification changes
    }


    // 1. Update user counselor status if changed
    if (Object.keys(userUpdatePayload).length > 0 && editableApplication.value.userDetails?.id) {
      await apiServices.patchUser(
        editableApplication.value.userDetails.id,
        userUpdatePayload
      );
    }

    // 2. Update application with qualification and application changes if any changes are detected
    if (props.application.id && Object.keys(applicationUpdatePayload).length > 0) {
      await apiServices.patchBhmcNewQualification(props.application.user_qualifications[0].id, applicationUpdatePayload);
    } else {
      console.log("No application data changed, skipping application update API call."); // Debugging log
    }


    // 3. Get fresh application data
    const response = await apiServices.getBhmcNewApplication(props.application.id);
    emit('update', response.data);
    // close modal after save changes
    isEditing.value = false;

  } catch (error) {
    console.error('Error saving changes:', error);
    errorMessage.value = 'Failed to save changes. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const openCertificateModal = () => {
  isCertificateModalOpen.value = true;
};

const closeCertificateModal = () => {
  isCertificateModalOpen.value = false;
};
</script>

<style scoped>
/* Enhanced scrollbar styles */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #CBD5E1 transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #CBD5E1;
  border-radius: 3px;
}

/* Enhanced transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Enhanced card hover effects */
.rounded-xl {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.rounded-xl:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Status indicator animations */
@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
