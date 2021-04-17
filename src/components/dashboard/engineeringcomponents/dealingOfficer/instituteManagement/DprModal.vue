<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModalHandler" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex h-screen items-center justify-center p-4">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel
            class="w-full max-w-7xl transform overflow-hidden rounded-2xl bg-gray-50 shadow-2xl transition-all max-h-screen"
          >
            <div class="relative" v-if="application">
              <!-- Status Banner -->
              <div
                :class="[
                  'px-4 py-3 sm:px-8 sm:py-6 border-b relative overflow-hidden',
                  {
                    'bg-yellow-50 border-yellow-100': overallStatus === 'Pending',
                    'bg-green-50 border-green-100': overallStatus === 'Approved',
                    'bg-red-50 border-red-100': overallStatus === 'Regretted',
                  },
                ]"
              >
                <div class="flex items-center justify-between relative z-10">
                  <div class="flex items-center space-x-4">
                    <div class="p-3 bg-white rounded-lg shadow-sm">
                      <FileText class="h-7 w-7 text-gray-700" />
                    </div>
                    <div>
                      <DialogTitle as="h3" class="text-lg sm:text-2xl font-semibold text-gray-900">
                        Application Details
                      </DialogTitle>
                      <p class="text-xs sm:text-sm text-gray-600 mt-1">
                        Review and manage application information
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-4">
                    <span
                      :class="[
                        'px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium inline-flex items-center space-x-2 shadow-sm',
                        {
                          'bg-yellow-100 text-yellow-800': overallStatus === 'Pending',
                          'bg-green-100 text-green-800': overallStatus === 'Approved',
                          'bg-red-100 text-red-800': overallStatus === 'Regretted',
                        },
                      ]"
                      style="z-index: 11"
                    >
                      <Circle
                        class="h-3 w-3 sm:h-4 sm:w-4"
                        :class="{
                          'text-yellow-500': overallStatus === 'Pending',
                          'text-green-500': overallStatus === 'Approved',
                          'text-red-500': overallStatus === 'Regretted',
                        }"
                      />
                      <span>{{ overallStatus }}</span>
                    </span>
                    <!-- New Edit Button -->
                    <button
                      v-if="!isEditing"
                      type="button"
                      class="px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-lg shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                      @click="startEditing"
                    >
                      <Pencil class="h-4 w-4" />
                      
                    </button>
                    <button
                      type="button"
                      class="p-2 text-gray-400 hover:text-gray-500 transition-colors rounded-full hover:bg-white"
                      @click="closeModalHandler"
                    >
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

              <!-- Main Content (Scrollable) -->
              <div class="px-4 py-4 sm:px-8 sm:py-6 bg-white overflow-y-auto max-h-[80vh]">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
                  <!-- Left Column -->
                  <div class="lg:col-span-1 space-y-4 sm:space-y-6">
                    <!-- Personal Information -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                    >
                      <div class="p-4 sm:p-6">
                        <h4
                          class="text-base sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6 flex items-center space-x-2"
                        >
                          <User class="h-5 w-5 text-gray-500" />
                          <span>Personal Information</span>
                        </h4>
                        <div class="flex flex-col items-center space-y-4">
                          <div class="text-center">
                            <h5 class="text-base sm:text-xl font-semibold text-gray-900">
                              <span v-if="!isEditing">{{ application.applicant_name }}</span>
                              <input
                                v-else
                                type="text"
                                v-model="editedApplication.applicant_name"
                                class="border border-gray-300 rounded-md px-3 py-2 text-base sm:text-xl font-semibold text-gray-900 text-center w-full"
                              />
                            </h5>
                            <p class="text-xs sm:text-sm text-gray-500 mt-1">
                              Application ID: #{{ application.id }}
                            </p>
                          </div>
                          <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div
                              class="flex items-center space-x-2 bg-gray-50 p-2 sm:p-3 rounded-lg"
                            >
                              <UserCircle class="h-4 w-4 text-gray-400" />
                              <span v-if="!isEditing" class="text-xs sm:text-sm text-gray-600">
                                Applicant: {{ application.full_name }}
                              </span>
                              <input
                                v-else
                                type="text"
                                v-model="editedApplication.full_name"
                                class="border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm text-gray-600 w-full"
                              />
                            </div>
                            <div
                              class="flex items-center space-x-2 bg-gray-50 p-2 sm:p-3 rounded-lg"
                            >
                              <Calendar class="h-4 w-4 text-gray-400" />
                              <span v-if="!isEditing" class="text-xs sm:text-sm text-gray-600">{{
                                formatDate(application.commencement_date)
                              }}</span>
                              <input
                                v-else
                                type="date"
                                v-model="editedApplication.commencement_date"
                                class="border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm text-gray-600 w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="border-t border-gray-100 p-4 sm:p-6 bg-gray-50">
                        <div class="flex flex-col space-y-4">
                          <h5 class="font-medium text-gray-900">Application Status</h5>
                          <div class="flex items-center justify-between">
                            <span v-if="!isEditing" class="text-xs sm:text-sm text-gray-600">
                              Status: {{ application.affiliation_details }}
                            </span>
                            <input
                              v-else
                              type="text"
                              v-model="editedApplication.affiliation_details"
                              class="border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm text-gray-600 w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Application Information -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                    >
                      <div class="p-4 sm:p-6">
                        <h4
                          class="text-base sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6 flex items-center space-x-2"
                        >
                          <Contact class="h-5 w-5 text-gray-500" />
                          <span>Application Information</span>
                        </h4>
                        <div class="space-y-4">
                          <div class="flex items-center space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                            <Mail class="h-4 w-4 text-gray-400" />
                            <span v-if="!isEditing" class="text-xs sm:text-sm text-gray-600">
                              Proposed Name: {{ application.dpr_name }}
                            </span>
                            <input
                              v-else
                              type="text"
                              v-model="editedApplication.dpr_name"
                              class="border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm text-gray-600 w-full"
                            />
                          </div>
                          <div class="flex items-center space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                            <Phone class="h-4 w-4 text-gray-400" />
                            <span v-if="!isEditing" class="text-xs sm:text-sm text-gray-600">
                              Land Area: {{ application.land_details }}
                            </span>
                            <input
                              v-else
                              type="text"
                              v-model="editedApplication.land_details"
                              class="border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm text-gray-600 w-full"
                            />
                          </div>
                          <div class="flex items-center space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                            <MapPin class="h-4 w-4 text-gray-400" />
                            <span v-if="!isEditing" class="text-xs sm:text-sm text-gray-600">
                              Vision, Mission & Strategies:
                              {{ application.vision_mission_strategies }}
                            </span>
                            <textarea
                              v-else
                              v-model="editedApplication.vision_mission_strategies"
                              rows="3"
                              class="border border-gray-300 rounded-md px-2 py-1 text-xs sm:text-sm text-gray-600 w-full"
                            ></textarea>
                          </div>

                          <!-- File Upload Fields -->
                          <div v-if="isEditing" class="space-y-4 mt-4 border-t border-gray-200 pt-4">
                            <h5 class="font-medium text-gray-900">Supporting Documents</h5>

                            <div class="p-3 bg-gray-50 rounded-lg">
                              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                Supporting Documents
                              </label>
                              <input
                                type="file"
                                @change="handleFileUpload($event, 'supporting_documents')"
                                class="block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-md file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-blue-50 file:text-blue-700
                                  hover:file:bg-blue-100"
                              />
                              <p class="mt-1 text-xs text-gray-500">Upload supporting documents</p>
                            </div>

                            <div class="p-3 bg-gray-50 rounded-lg">
                              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                Institute EOI Supporting Documents
                              </label>
                              <input
                                type="file"
                                @change="handleFileUpload($event, 'institute_eoi_supporting_documents')"
                                class="block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-md file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-blue-50 file:text-blue-700
                                  hover:file:bg-blue-100"
                              />
                              <p class="mt-1 text-xs text-gray-500">Upload EOI supporting documents</p>
                            </div>

                            <div class="p-3 bg-gray-50 rounded-lg">
                              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                DPR Report
                              </label>
                              <input
                                type="file"
                                @change="handleFileUpload($event, 'do_dpr_report')"
                                class="block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-md file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-blue-50 file:text-blue-700
                                  hover:file:bg-blue-100"
                              />
                              <p class="mt-1 text-xs text-gray-500">Upload DPR report</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- End Left Column -->

                  <!-- Right Column -->
                  <div class="lg:col-span-2 space-y-4 sm:space-y-6">
                    <!-- Application Details Card -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
                    >
                      <div class="p-4 sm:p-6">
                        <h4
                          class="text-base sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6 flex items-center space-x-2"
                        >
                          <FileText class="h-5 w-5 text-gray-500" />
                          <span>Application Details</span>
                        </h4>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <!-- Project Scheduling -->
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">Project Scheduling</p>
                            <p v-if="!isEditing" class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                              <FileCheck class="h-4 w-4 text-gray-400" />
                              <span>{{ application.project_scheduling }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editedApplication.project_scheduling"
                              rows="2"
                              class="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 mt-2 w-full"
                            ></textarea>
                          </div>
                          <!-- Gross National Happiness -->
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">
                              Gross National Happiness
                            </p>
                            <p v-if="!isEditing" class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                              <Hash class="h-4 w-4 text-gray-400" />
                              <span>{{ application.gross_national_happiness }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editedApplication.gross_national_happiness"
                              rows="2"
                              class="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 mt-2 w-full"
                            ></textarea>
                          </div>
                          <!-- Academic Plan -->
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">Academic Plan</p>
                            <p v-if="!isEditing" class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                              <Calendar class="h-4 w-4 text-gray-400" />
                              <span>{{ application.academic_plan }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editedApplication.academic_plan"
                              rows="2"
                              class="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 mt-2 w-full"
                            ></textarea>
                          </div>
                          <!-- Affiliation Details -->
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">Affiliation Details</p>
                            <p v-if="!isEditing" class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.affiliation_details }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editedApplication.affiliation_details"
                              rows="2"
                              class="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 mt-2 w-full"
                            ></textarea>
                          </div>
                          <!-- Teaching Hospital Details -->
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">
                              Teaching Hospital Details
                            </p>
                            <p v-if="!isEditing" class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.teaching_hospital }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editedApplication.teaching_hospital"
                              rows="2"
                              class="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 mt-2 w-full"
                            ></textarea>
                          </div>
                          <!-- Research Policy Details -->
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">Research Policy Details</p>
                            <p v-if="!isEditing" class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.research_policy }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editedApplication.research_policy"
                              rows="2"
                              class="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 mt-2 w-full"
                            ></textarea>
                          </div>
                          <!-- Human Resources Details -->
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">Human Resources Details</p>
                            <p v-if="!isEditing" class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.human_resource }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editedApplication.human_resource"
                              rows="2"
                              class="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 mt-2 w-full"
                            ></textarea>
                          </div>
                          <!-- Quality Assurance System Details -->
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">
                              Quality Assurance System Details
                            </p>
                            <p v-if="!isEditing" class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.quality_assurance }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editedApplication.quality_assurance"
                              rows="2"
                              class="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 mt-2 w-full"
                            ></textarea>
                          </div>
                          <!-- Governance Structure Details -->
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">
                              Governance Structure Details
                            </p>
                            <p v-if="!isEditing" class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.governance_structure }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editedApplication.governance_structure"
                              rows="2"
                              class="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 mt-2 w-full"
                            ></textarea>
                          </div>
                          <!-- Business Plan Details -->
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">Business Plan Details</p>
                            <p v-if="!isEditing" class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.business_plan }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editedApplication.business_plan"
                              rows="2"
                              class="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 mt-2 w-full"
                            ></textarea>
                          </div>
                          <!-- Project Cost Analysis Details -->
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">
                              Project Cost and Analysis Details
                            </p>
                            <p v-if="!isEditing" class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.project_cost_analysis }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editedApplication.project_cost_analysis"
                              rows="2"
                              class="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 mt-2 w-full"
                            ></textarea>
                          </div>
                          <!-- Facilities and Student Services Details -->
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">
                              Facilities and Student Services Details
                            </p>
                            <p v-if="!isEditing" class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.facilities_student_services }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editedApplication.facilities_student_services"
                              rows="2"
                              class="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 mt-2 w-full"
                            ></textarea>
                          </div>
                          <!-- Admission Policy and Scholarships Details -->
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">
                              Admission Policy and Scholarships Details
                            </p>
                            <p v-if="!isEditing" class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.admission_policy }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editedApplication.admission_policy"
                              rows="2"
                              class="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 mt-2 w-full"
                            ></textarea>
                          </div>
                          <!-- Service Conditions Details -->
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">
                              Service Conditions Details
                            </p>
                            <p v-if="!isEditing" class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.service_conditions }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editedApplication.service_conditions"
                              rows="2"
                              class="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 mt-2 w-full"
                            ></textarea>
                          </div>
                          <!-- Safety and Security Details -->
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">
                              Safety and Security Details
                            </p>
                            <p v-if="!isEditing" class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.safety_security }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editedApplication.safety_security"
                              rows="2"
                              class="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 mt-2 w-full"
                            ></textarea>
                          </div>
                          <!-- Public Information System Details -->
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">
                              Public Information System Details
                            </p>
                            <p v-if="!isEditing" class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.public_information_system }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editedApplication.public_information_system"
                              rows="2"
                              class="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 mt-2 w-full"
                            ></textarea>
                          </div>
                          <!-- Other Details -->
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">Other Details</p>
                            <p v-if="!isEditing" class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.other_details }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editedApplication.other_details"
                              rows="2"
                              class="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 mt-2 w-full"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- End Right Column -->
                </div>
              </div>
              <!-- End Main Content -->

              <!-- Footer -->
              <div class="px-4 py-3 sm:px-8 sm:py-4 bg-gray-50 border-t border-gray-200">
                <div class="flex justify-between items-center">
                  <div v-if="errorMessage" class="text-sm text-red-600 flex items-center space-x-2">
                    <CircleAlert class="h-4 w-4" />
                    <span>{{ errorMessage }}</span>
                  </div>
                  <!-- Action Buttons -->
                  <div class="flex items-center space-x-4">
                    <!-- Save button (only visible when editing) -->
                    <button
                      v-if="isEditing"
                      type="button"
                      class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                      @click="saveChanges"
                    >
                      <Save class="h-4 w-4" />
                      <span>Save Changes</span>
                    </button>
                    <!-- Cancel button (only visible when editing) -->
                    <button
                      v-if="isEditing"
                      type="button"
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                      @click="cancelEditing"
                    >
                      <X class="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                    <!-- Close button (only visible when not editing) -->
                    <button
                      v-if="!isEditing"
                      type="button"
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                      @click="closeModalHandler"
                    >
                      <X class="h-4 w-4" />
                      <span>Close</span>
                    </button>
                    <!-- Approve and Regret buttons (only visible when not editing) -->
                    <button
                      v-if="!isEditing"
                      type="button"
                      class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-green-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                      @click="startConfirmation('approve')"
                    >
                      <FileText class="h-4 w-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      v-if="!isEditing"
                      type="button"
                      class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-red-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                      @click="startConfirmation('Regretted')"
                    >
                      <Pencil class="h-4 w-4" />
                      <span>Regretted</span>
                    </button>
                  </div>
                </div>
              </div>
              <!-- End Footer -->
            </div>

            <!-- Confirmation Modal -->
            <div
              v-if="isConfirmingAction"
              class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div class="bg-white rounded-xl shadow-lg p-4 sm:p-8 w-full max-w-md">
                <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                  Confirm {{ confirmingAction === 'approve' ? 'Approval' : 'Regrettedion' }}
                </h3>
                <label
                  for="confirmationMessage"
                  class="block text-xs sm:text-sm font-medium text-gray-700 mb-2"
                  >Message:</label
                >
                <textarea
                  id="confirmationMessage"
                  v-model="confirmationMessage"
                  rows="3"
                  class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-xs sm:text-sm border-gray-300 rounded-md mb-4"
                ></textarea>
                <div class="flex justify-end">
                  <button
                    type="button"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-blue-500 mr-2"
                    @click="cancelConfirmation"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    class="px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm"
                    :class="{
                      'bg-green-600 hover:bg-green-700 focus:ring-green-500':
                        confirmingAction === 'approve',
                      'bg-red-600 hover:bg-red-700 focus:ring-red-500':
                        confirmingAction === 'Regretted',
                    }"
                    @click="confirmAction"
                  >
                    Confirm {{ confirmingAction === 'approve' ? 'Approved' : 'Regrettedion' }}
                  </button>
                </div>
              </div>
            </div>
            <!-- End Confirmation Modal -->
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
// Import necessary Vue components and functions
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
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
  CircleAlert,
  Circle,
  X,
  Pencil,
  Save
} from 'lucide-vue-next'
import { ref, computed, } from 'vue'
import apiService from '@/services/services'

// Create a standalone function for file uploads instead of extending apiService
const uploadWithFiles = async (id, formData) => {
  try {
    // Try to determine the correct API endpoint by checking how the regular API service works
    // First, check if we can see how the regular patch method is implemented
    console.log('Available API service methods:', Object.keys(apiService));

    // Let's try to use the regular patch method from apiService if it exists
    if (typeof apiService.patchEpcInstitute === 'function') {
      console.log('Using existing patchEpcInstitute method');
      return await apiService.patchEpcInstitute(id, formData);
    }

    // If we can't use the existing method, let's try to figure out the correct URL
    // Check if there's a pattern we can follow from other API calls
    console.log('API Service base:', apiService.baseURL);

    // Try to determine the correct URL
    let apiUrl;
    if (apiService.baseURL) {
      apiUrl = `${apiService.baseURL}/epc-institutes/${id}/`;
    } else {
      // Look for clues about the correct API URL format
      console.log('Looking for API URL patterns in apiService:', apiService);

      // Default fallback URL - modify this based on your actual API URL structure
      apiUrl = `/api/v1/epc-institutes/${id}/`;
    }

    console.log('Attempting to call API at:', apiUrl);

    // Make the API call
    const response = await fetch(apiUrl, {
      method: 'PATCH',
      body: formData
    });

    // Log response details for debugging
    console.log('API Response status:', response.status);

    if (!response.ok) {
      if (response.headers.get('content-type')?.includes('application/json')) {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        throw new Error(JSON.stringify(errorData));
      } else {
        const errorText = await response.text();
        console.error('API error text:', errorText);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
    }

    // Safely parse JSON only if we have JSON content
    if (response.headers.get('content-type')?.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      console.log('API Response text:', text);
      return { success: true };
    }
  } catch (error) {
    console.error('Error in file upload:', error);
    throw error;
  }
}

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  application: {
    type: Object,
    default: () => null,
  },
})

// Add debug code to inspect API service when component mounts
import { onMounted } from 'vue'

onMounted(() => {
  // Log API service structure to help debug
  console.log('API Service inspection:');
  console.log('API Service type:', typeof apiService);
  console.log('API Service methods:', Object.getOwnPropertyNames(apiService));

  // Try to find patch or update methods
  const methods = Object.getOwnPropertyNames(apiService);
  const patchMethods = methods.filter(m => m.toLowerCase().includes('patch') || m.toLowerCase().includes('update'));
  console.log('Potential patch/update methods:', patchMethods);

  // Check if there are any URL patterns we can use
  const urlProps = methods.filter(m => m.toLowerCase().includes('url') || m.toLowerCase().includes('endpoint'));
  console.log('Potential URL properties:', urlProps);

  // If patchEpcInstitute exists, log how it's implemented
  if (typeof apiService.patchEpcInstitute === 'function') {
    console.log('patchEpcInstitute exists as a function');
    console.log('Function details:', apiService.patchEpcInstitute.toString());
  }
})

const emit = defineEmits(['close', 'save', 'approve', 'Regretted'])

// Add a method to handle file uploads
const handleFileUpload = (event, fieldName) => {
  const file = event.target.files[0]
  if (file) {
    editedApplication.value[fieldName] = file
  }
}

// State variables
const errorMessage = ref('')
const isEditing = ref(false)
const editedApplication = ref({})

// Confirmation modal variables
const isConfirmingAction = ref(false)
const confirmingAction = ref('') // 'approve' or 'Regretted'
const confirmationMessage = ref('')

// Computed properties
const overallStatus = computed(() => {
  if (!props.application) return 'Pending'
  return props.application.do_dpr_review_decision
})

// Start editing mode
const startEditing = () => {
  // Create a deep copy of the application to edit
  editedApplication.value = JSON.parse(JSON.stringify(props.application))
  isEditing.value = true
}

// Cancel editing and revert changes
const cancelEditing = () => {
  isEditing.value = false
  errorMessage.value = ''
}

// Save changes to the application
const saveChanges = async () => {
  try {
    errorMessage.value = ''

    // Log what we're trying to save
    console.log('Saving application with ID:', props.application.id);
    console.log('Edited application data:', editedApplication.value);

    // Create FormData for handling file uploads properly
    const formData = new FormData()

    // Add all regular fields to formData
    Object.keys(editedApplication.value).forEach(key => {
      if (key !== 'supporting_documents' &&
          key !== 'institute_eoi_supporting_documents' &&
          key !== 'do_dpr_report' &&
          editedApplication.value[key] !== undefined) {
        console.log(`Adding field ${key} to formData`);
        formData.append(key, editedApplication.value[key])
      }
    })

    // Add file fields to formData if they exist
    if (editedApplication.value.supporting_documents) {
      console.log('Adding supporting_documents file to formData');
      formData.append('supporting_documents', editedApplication.value.supporting_documents)
    }

    if (editedApplication.value.institute_eoi_supporting_documents) {
      console.log('Adding institute_eoi_supporting_documents file to formData');
      formData.append('institute_eoi_supporting_documents', editedApplication.value.institute_eoi_supporting_documents)
    }

    if (editedApplication.value.do_dpr_report) {
      console.log('Adding do_dpr_report file to formData');
      formData.append('do_dpr_report', editedApplication.value.do_dpr_report)
    }

    // IMPORTANT: Use the same method that your existing code uses for API calls
    // This is the safest approach - let's try using the existing patchEpcInstitute method
    console.log('Attempting to save data using API service');

    // Use the uploadWithFiles function to handle the file upload
    await uploadWithFiles(props.application.id, formData);

    console.log('Save successful');

    // Emit save event to parent component
    emit('save', props.application.id);

    // Exit editing mode
    isEditing.value = false;
  } catch (error) {
    console.error("Error updating application:", error);
    errorMessage.value = "Failed to save changes. Please check console for details.";
  }
}

// Close the modal
const closeModal = () => {
  if (isEditing.value) {
    // Ask for confirmation if user is currently editing
    if (confirm("You have unsaved changes. Are you sure you want to close?")) {
      isEditing.value = false
      emit('close')
    }
  } else {
    emit('close')
  }
}

const closeModalHandler = () => {
  closeModal()
}

// Format date for display
const formatDate = (date) => {
  if (!date) return 'N/A'
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid Date'
  }
}

// Start confirmation process for approve/regretted actions
const startConfirmation = (action) => {
  isConfirmingAction.value = true
  confirmingAction.value = action
  confirmationMessage.value = '' // Clear previous message
}

// Cancel confirmation
const cancelConfirmation = () => {
  isConfirmingAction.value = false
  confirmingAction.value = ''
  confirmationMessage.value = ''
}

// Confirm and process approve/regretted action
const confirmAction = async () => {
  try {
    let updateData = {
      do_dpr_reason_if_rejected: confirmationMessage.value,
      do_dpr_review_decision: confirmingAction.value === 'approve' ? 'Approved' : 'Regretted',
    }

    await apiService.patchEpcInstitute(props.application.id, updateData)

    // Emit the event to the parent component to refresh data
    emit(confirmingAction.value === 'approve' ? 'approve' : 'Regretted', props.application)

    closeModal()
  } catch (error) {
    console.error(`Error ${confirmingAction.value}ing application:`, error)
    errorMessage.value = `Failed to ${confirmingAction.value} application. Please try again.`
  } finally {
    isConfirmingAction.value = false
    confirmingAction.value = ''
    confirmationMessage.value = ''
  }
}
</script>

<style scoped>
/* Basic styles, animations - Keep your existing styles */
/* Enhanced scrollbar styles */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
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
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}

.rounded-xl:hover {
  transform: translateY(-2px);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
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

/* Input field styling */
input, textarea {
  transition: border-color 0.2s ease;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
</style>