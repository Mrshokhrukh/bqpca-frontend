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
            class="w-full max-w-8xl transform overflow-hidden rounded-2xl bg-gray-50 shadow-2xl transition-all max-h-screen"
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
                        Application Details {{ isEditing ? '(Editing)' : '' }}
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
                            <h5
                              v-if="!isEditing"
                              class="text-base sm:text-xl font-semibold text-gray-900"
                            >
                              {{ application.full_name }}
                            </h5>
                            <input
                              v-else
                              type="text"
                              v-model="editableApplication.full_name"
                              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg font-semibold"
                              placeholder="Full Name"
                            />
                            <p class="text-xs sm:text-sm text-gray-500 mt-1">
                              Application ID: #{{ application.id }}
                            </p>
                          </div>
                          <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div
                              class="flex items-center space-x-2 bg-gray-50 p-2 sm:p-3 rounded-lg"
                            >
                              <UserCircle class="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span v-if="!isEditing" class="text-xs sm:text-sm text-gray-600"
                                >Gender: {{ application.gender }}</span
                              >
                              <select
                                v-else
                                v-model="editableApplication.gender"
                                class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                              >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                            <div
                              class="flex items-center space-x-2 bg-gray-50 p-2 sm:p-3 rounded-lg"
                            >
                              <Calendar class="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span v-if="!isEditing" class="text-xs sm:text-sm text-gray-600">{{
                                formatDate(application.commencement_date)
                              }}</span>
                              <input
                                v-else
                                type="date"
                                :value="formatDateForInput(editableApplication.commencement_date)"
                                @input="
                                  (e) => (editableApplication.commencement_date = e.target.value)
                                "
                                class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="border-t border-gray-100 p-4 sm:p-6 bg-gray-50">
                        <div class="flex flex-col space-y-4">
                          <h5 class="font-medium text-gray-900">Application Status</h5>
                          <div class="flex items-center justify-between">
                            <span v-if="!isEditing" class="text-xs sm:text-sm text-gray-600"
                              >Status: {{ application.do_dpr_review_decision }}</span
                            >
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
                            <Mail class="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span v-if="!isEditing" class="text-xs sm:text-sm text-gray-600"
                              >Proposed Name: {{ application.dpr_name }}</span
                            >
                            <input
                              v-else
                              type="text"
                              v-model="editableApplication.dpr_name"
                              class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                              placeholder="Proposed Name"
                            />
                          </div>
                          <div class="flex items-center space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                            <Phone class="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span v-if="!isEditing" class="text-xs sm:text-sm text-gray-600"
                              >Land Area: {{ application.land_details }}</span
                            >
                            <input
                              v-else
                              type="text"
                              v-model="editableApplication.land_details"
                              class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                              placeholder="Land Area"
                            />
                          </div>
                          <div class="flex items-center space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                            <MapPin class="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span v-if="!isEditing" class="text-xs sm:text-sm text-gray-600"
                              >Vision, Mission & Strategies:
                              {{ application.vision_mission_strategies }}</span
                            >
                            <textarea
                              v-else
                              v-model="editableApplication.vision_mission_strategies"
                              class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
                              placeholder="Vision, Mission & Strategies"
                            />
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
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">Project Scheduling</p>
                            <p
                              v-if="!isEditing"
                              class="text-sm text-gray-900 mt-2 flex items-center space-x-2"
                            >
                              <FileCheck class="h-4 w-4 text-gray-400" />
                              <span>{{ application.project_scheduling }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editableApplication.project_scheduling"
                              class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Project Scheduling"
                            />
                          </div>
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">
                              Gross National Happiness
                            </p>
                            <p
                              v-if="!isEditing"
                              class="text-sm text-gray-900 mt-2 flex items-center space-x-2"
                            >
                              <Hash class="h-4 w-4 text-gray-400" />
                              <span>{{ application.gross_national_happiness }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editableApplication.gross_national_happiness"
                              class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Gross National Happiness"
                            />
                          </div>
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">Academic Plan</p>
                            <p
                              v-if="!isEditing"
                              class="text-sm text-gray-900 mt-2 flex items-center space-x-2"
                            >
                              <Calendar class="h-4 w-4 text-gray-400" />
                              <span>{{ application.academic_plan }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editableApplication.academic_plan"
                              class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Academic Plan"
                            />
                          </div>
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">Affiliation Details</p>
                            <p
                              v-if="!isEditing"
                              class="text-sm text-gray-900 mt-2 flex items-center space-x-2"
                            >
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.affiliation_details }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editableApplication.affiliation_details"
                              class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Affiliation Details"
                            />
                          </div>
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">
                              Teaching Hospital Details
                            </p>
                            <p
                              v-if="!isEditing"
                              class="text-sm text-gray-900 mt-2 flex items-center space-x-2"
                            >
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.teaching_hospital }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editableApplication.teaching_hospital"
                              class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Teaching Hospital Details"
                            />
                          </div>
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">Research Policy Details</p>
                            <p
                              v-if="!isEditing"
                              class="text-sm text-gray-900 mt-2 flex items-center space-x-2"
                            >
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.research_policy }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editableApplication.research_policy"
                              class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Research Policy Details"
                            />
                          </div>
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">Human Resources Details</p>
                            <p
                              v-if="!isEditing"
                              class="text-sm text-gray-900 mt-2 flex items-center space-x-2"
                            >
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.human_resource }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editableApplication.human_resource"
                              class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Human Resources Details"
                            />
                          </div>
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">
                              Quality Assurance System Details
                            </p>
                            <p
                              v-if="!isEditing"
                              class="text-sm text-gray-900 mt-2 flex items-center space-x-2"
                            >
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.quality_assurance }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editableApplication.quality_assurance"
                              class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Quality Assurance System Details"
                            />
                          </div>
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">
                              Governance Structure Details
                            </p>
                            <p
                              v-if="!isEditing"
                              class="text-sm text-gray-900 mt-2 flex items-center space-x-2"
                            >
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.governance_structure }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editableApplication.governance_structure"
                              class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Governance Structure Details"
                            />
                          </div>
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">Business Plan Details</p>
                            <p
                              v-if="!isEditing"
                              class="text-sm text-gray-900 mt-2 flex items-center space-x-2"
                            >
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.business_plan }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editableApplication.business_plan"
                              class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Business Plan Details"
                            />
                          </div>
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">
                              Project Cost and Analysis Details
                            </p>
                            <p
                              v-if="!isEditing"
                              class="text-sm text-gray-900 mt-2 flex items-center space-x-2"
                            >
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.project_cost_analysis }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editableApplication.project_cost_analysis"
                              class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Project Cost and Analysis Details"
                            />
                          </div>
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">
                              Facilities and Student Services Details
                            </p>
                            <p
                              v-if="!isEditing"
                              class="text-sm text-gray-900 mt-2 flex items-center space-x-2"
                            >
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.facilities_student_services }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editableApplication.facilities_student_services"
                              class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Facilities and Student Services Details"
                            />
                          </div>
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">
                              Admission Policy and Scholarships Details
                            </p>
                            <p
                              v-if="!isEditing"
                              class="text-sm text-gray-900 mt-2 flex items-center space-x-2"
                            >
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.admission_policy }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editableApplication.admission_policy"
                              class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Admission Policy and Scholarships Details"
                            />
                          </div>
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">
                              Service Conditions Details
                            </p>
                            <p
                              v-if="!isEditing"
                              class="text-sm text-gray-900 mt-2 flex items-center space-x-2"
                            >
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.service_conditions }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editableApplication.service_conditions"
                              class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Service Conditions Details"
                            />
                          </div>
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">
                              Safety and Security Details
                            </p>
                            <p
                              v-if="!isEditing"
                              class="text-sm text-gray-900 mt-2 flex items-center space-x-2"
                            >
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.safety_security }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editableApplication.safety_security"
                              class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Safety and Security Details"
                            />
                          </div>
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">
                              Public Information System Details
                            </p>
                            <p
                              v-if="!isEditing"
                              class="text-sm text-gray-900 mt-2 flex items-center space-x-2"
                            >
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.public_information_system }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editableApplication.public_information_system"
                              class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Public Information System Details"
                            />
                          </div>
                          <div class="p-4 bg-gray-50 rounded-lg">
                            <p class="text-sm font-medium text-gray-500">Other Details</p>
                            <p
                              v-if="!isEditing"
                              class="text-sm text-gray-900 mt-2 flex items-center space-x-2"
                            >
                              <Clock class="h-4 w-4 text-gray-400" />
                              <span>{{ application.other_details }}</span>
                            </p>
                            <textarea
                              v-else
                              v-model="editableApplication.other_details"
                              class="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Other Details"
                            />
                          </div>
                          <!-- Do DPR Report -->
                          <div class="p-4 bg-gray-50 rounded-lg col-span-2">
                            <p class="text-sm font-medium text-gray-500">Do DPR Report</p>
                            <template v-if="!isEditing">
                              <p class="text-sm text-gray-900 mt-2">
                                <a
                                  v-if="application.do_dpr_report"
                                  :href="application.do_dpr_report"
                                  target="_blank"
                                  class="text-blue-600 hover:underline flex items-center space-x-2"
                                >
                                  <FileText class="h-4 w-4" />
                                  <span>View Do DPR Report</span>
                                </a>
                                <span v-else class="text-gray-500">No document uploaded</span>
                              </p>
                            </template>
                            <template v-else>
                              <div class="mt-2">
                                <input
                                  type="file"
                                  :ref="(el) => (fileInputs['do_dpr_report'] = el)"
                                  @change="(event) => handleFileChange(event, 'do_dpr_report')"
                                  accept=".pdf"
                                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <p
                                  v-if="fileNames.do_dpr_report"
                                  class="text-sm text-gray-600 mt-2"
                                >
                                  Selected: {{ fileNames.do_dpr_report }}
                                </p>
                                <p
                                  v-else-if="application.do_dpr_report"
                                  class="text-sm text-gray-600 mt-2"
                                >
                                  Current:
                                  <a
                                    :href="application.do_dpr_report"
                                    target="_blank"
                                    class="text-blue-600 hover:underline"
                                    >Existing Do DPR Report</a
                                  >
                                </p>
                              </div>
                            </template>
                          </div>
                          <!-- Institute EOI Supporting Documents -->
                          <div class="p-4 bg-gray-50 rounded-lg col-span-2">
                            <p class="text-sm font-medium text-gray-500">
                              Institute EOI Supporting Documents
                            </p>
                            <template v-if="!isEditing">
                              <p class="text-sm text-gray-900 mt-2">
                                <a
                                  v-if="application.institute_eoi_supporting_documents"
                                  :href="application.institute_eoi_supporting_documents"
                                  target="_blank"
                                  class="text-blue-600 hover:underline flex items-center space-x-2"
                                >
                                  <FileText class="h-4 w-4" />
                                  <span>View EOI Supporting Documents</span>
                                </a>
                                <span v-else class="text-gray-500">No document uploaded</span>
                              </p>
                            </template>
                            <template v-else>
                              <div class="mt-2">
                                <input
                                  type="file"
                                  :ref="
                                    (el) => (fileInputs['institute_eoi_supporting_documents'] = el)
                                  "
                                  @change="
                                    (event) =>
                                      handleFileChange(event, 'institute_eoi_supporting_documents')
                                  "
                                  accept=".pdf"
                                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <p
                                  v-if="fileNames.institute_eoi_supporting_documents"
                                  class="text-sm text-gray-600 mt-2"
                                >
                                  Selected: {{ fileNames.institute_eoi_supporting_documents }}
                                </p>
                                <p
                                  v-else-if="application.institute_eoi_supporting_documents"
                                  class="text-sm text-gray-600 mt-2"
                                >
                                  Current:
                                  <a
                                    :href="application.institute_eoi_supporting_documents"
                                    target="_blank"
                                    class="text-blue-600 hover:underline"
                                    >Existing EOI Supporting Documents</a
                                  >
                                </p>
                              </div>
                            </template>
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
                  <div
                    v-if="errorMessage || saveError"
                    class="text-sm text-red-600 flex items-center space-x-2"
                  >
                    <CircleAlert class="h-4 w-4" />
                    <span>{{ errorMessage || saveError }}</span>
                  </div>
                  <div v-else></div>
                  <!-- Action Buttons -->
                  <div class="flex items-center space-x-4">
                    <button
                      type="button"
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                      @click="closeModalHandler"
                    >
                      <X class="h-4 w-4" />
                      <span>Close</span>
                    </button>
                    <!-- View Mode Buttons -->
                    <template v-if="!isEditing">
                      <button
                        v-if="overallStatus === 'Pending'"
                        type="button"
                        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                        @click="startEditing"
                        :disabled="isSaving"
                      >
                        <Pencil class="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        v-if="overallStatus === 'Pending'"
                        type="button"
                        class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                        @click="startConfirmation('approve')"
                        :disabled="isSaving"
                      >
                        <FileText class="h-4 w-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        v-if="overallStatus === 'Pending'"
                        type="button"
                        class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                        @click="startConfirmation('Regretted')"
                        :disabled="isSaving"
                      >
                        <X class="h-4 w-4" />
                        <span>Regret</span>
                      </button>
                    </template>
                    <!-- Edit Mode Buttons -->
                    <template v-if="isEditing">
                      <button
                        type="button"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                        @click="cancelEditing"
                        :disabled="isSaving"
                      >
                        <Ban class="h-4 w-4" />
                        <span>Cancel</span>
                      </button>
                      <button
                        type="button"
                        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 inline-flex items-center space-x-2"
                        @click="saveChanges"
                        :disabled="isSaving"
                      >
                        <Save class="h-4 w-4" />
                        <span>{{ isSaving ? 'Saving...' : 'Save Changes' }}</span>
                      </button>
                    </template>
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
                  Confirm {{ confirmingAction === 'approve' ? 'Approval' : 'Regret' }}
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
                <div class="flex justify-end space-x-2">
                  <button
                    type="button"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    Confirm {{ confirmingAction === 'approve' ? 'Approval' : 'Regret' }}
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
  Save,
  Ban,
} from 'lucide-vue-next'
import { ref, computed, watch } from 'vue'
import apiService from '@/services/services'
import { useToast } from 'vue-toastification'

const toast = useToast()

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

const emit = defineEmits(['close', 'save', 'approve', 'Regretted', 'application-updated'])

const errorMessage = ref('')
const saveError = ref('')
const isEditing = ref(false)
const isSaving = ref(false)
const editableApplication = ref(null)
const fileInputs = ref({})
const fileNames = ref({
  do_dpr_report: '',
  institute_eoi_supporting_documents: '',
})
const selectedFiles = ref({
  do_dpr_report: null,
  institute_eoi_supporting_documents: null,
})
const isConfirmingAction = ref(false)
const confirmingAction = ref('')
const confirmationMessage = ref('')

const overallStatus = computed(() => {
  if (!props.application) return 'Pending'
  return props.application.do_dpr_review_decision || 'Pending'
})

const handleFileChange = (event, field) => {
  const file = event.target.files[0]
  if (file) {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file.')
      selectedFiles.value[field] = null
      fileNames.value[field] = ''
      event.target.value = ''
      return
    }
    selectedFiles.value[field] = file
    fileNames.value[field] = file.name
  } else {
    selectedFiles.value[field] = null
    fileNames.value[field] = ''
  }
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid Date'
  }
}

const formatDateForInput = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    const offset = date.getTimezoneOffset() * 60000
    const adjustedDate = new Date(date.getTime() - offset)
    return adjustedDate.toISOString().split('T')[0]
  } catch (error) {
    console.error('Error formatting date for input:', error)
    return ''
  }
}

const closeModalHandler = () => {
  if (isEditing.value) {
    cancelEditing()
  }
  emit('close')
}

const startEditing = () => {
  errorMessage.value = ''
  saveError.value = ''
  editableApplication.value = JSON.parse(JSON.stringify(props.application))
  delete editableApplication.value.do_dpr_report
  delete editableApplication.value.institute_eoi_supporting_documents
  delete editableApplication.value.created_at
  delete editableApplication.value.updated_at
  selectedFiles.value = {
    do_dpr_report: null,
    institute_eoi_supporting_documents: null,
  }
  fileNames.value = {
    do_dpr_report: '',
    institute_eoi_supporting_documents: '',
  }
  isEditing.value = true
}

const cancelEditing = () => {
  editableApplication.value = null
  selectedFiles.value = {
    do_dpr_report: null,
    institute_eoi_supporting_documents: null,
  }
  fileNames.value = {
    do_dpr_report: '',
    institute_eoi_supporting_documents: '',
  }
  fileInputs.value = {}
  isEditing.value = false
  saveError.value = ''
}

const saveChanges = async () => {
  if (!editableApplication.value) return

  isSaving.value = true
  saveError.value = ''
  errorMessage.value = ''

  try {
    const formData = new FormData()
    const fields = [
      'full_name',
      'gender',
      'contact_no',
      'email_address',
      'name_of_institution',
      'country',
      'gewog',
      'dzongkhag',
      'village',
      'address',
      'chiwog',
      'teaching_institute',
      'title_of_course',
      'course_duration',
      'commencement_date',
      'type_of_programme',
      'remarks',
      'declaration',
      'review_decision',
      'reason_if_rejected',
      'website',
      'head_of_institution_name',
      'head_of_institution_gender',
      'head_of_institution_phone_number',
      'head_of_institution_email',
      'dpr_name',
      'executive_summary',
      'institute_dpr_remarks',
      'do_dpr_review_report',
      'do_dpr_review_summary',
      'is_active',
      'payment_id',
      'is_payment_complete',
      'is_physical_verification',
      'vision_mission_strategies',
      'project_scheduling',
      'gross_national_happiness',
      'land_details',
      'conceptual_master_plan',
      'academic_plan',
      'affiliation_details',
      'teaching_hospital',
      'research_policy',
      'human_resource',
      'quality_assurance',
      'governance_structure',
      'business_plan',
      'project_cost_analysis',
      'facilities_student_services',
      'admission_policy',
      'service_conditions',
      'safety_security',
      'public_information_system',
      'other_details',
      'valid_since',
      'valid_till',
    ]

    fields.forEach((field) => {
      if (editableApplication.value[field] !== undefined) {
        formData.append(field, editableApplication.value[field])
      }
    })

    if (selectedFiles.value.do_dpr_report) {
      formData.append('do_dpr_report', selectedFiles.value.do_dpr_report)
    }
    if (selectedFiles.value.institute_eoi_supporting_documents) {
      formData.append(
        'institute_eoi_supporting_documents',
        selectedFiles.value.institute_eoi_supporting_documents,
      )
    }

    const response = await apiService.patchMhpcInstitute(props.application.id, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response && response.status === 200 && response.data) {
      toast.success('Application Updated Successfully!')
      emit('application-updated', response.data)
      isEditing.value = false
      editableApplication.value = null
      selectedFiles.value = {
        do_dpr_report: null,
        institute_eoi_supporting_documents: null,
      }
      fileNames.value = {
        do_dpr_report: '',
        institute_eoi_supporting_documents: '',
      }
      fileInputs.value = {}
    } else {
      saveError.value = 'Failed to save changes. Unexpected response.'
    }
  } catch (error) {
    console.error('Error saving application changes:', error)
    saveError.value = `Failed to save changes: ${
      error.response?.data?.message || error.message || 'Unknown error'
    }`
    toast.error(`Update failed: ${saveError.value}`)
  } finally {
    isSaving.value = false
  }
}

const startConfirmation = (action) => {
  if (isEditing.value) {
    toast.warning('Please save or cancel edits before proceeding.')
    return
  }
  isConfirmingAction.value = true
  confirmingAction.value = action
  confirmationMessage.value = ''
}

const cancelConfirmation = () => {
  isConfirmingAction.value = false
  confirmingAction.value = ''
  confirmationMessage.value = ''
}

const confirmAction = async () => {
  try {
    const updateData = {
      do_dpr_review_decision: confirmingAction.value === 'approve' ? 'Approved' : 'Regretted',
      do_dpr_reason_if_rejected:
        confirmingAction.value === 'Regretted' ? confirmationMessage.value : '',
    }

    const response = await apiService.patchMhpcInstitute(props.application.id, updateData)

    if (response && response.status === 200 && response.data) {
      emit(confirmingAction.value === 'approve' ? 'approve' : 'Regretted', response.data)
      toast.success(
        `Application ${confirmingAction.value === 'approve' ? 'Approved' : 'Regretted'} Successfully!`,
      )
      closeModalHandler()
    } else {
      errorMessage.value = `Failed to ${
        confirmingAction.value === 'approve' ? 'approve' : 'regret'
      } application.`
    }
  } catch (error) {
    console.error(`Error ${confirmingAction.value}ing application:`, error)
    errorMessage.value = `Failed to ${
      confirmingAction.value === 'approve' ? 'regret' : 'regret'
    } application: ${error.response?.data?.message || error.message || 'Unknown error'}`
    toast.error(errorMessage.value)
  } finally {
    isConfirmingAction.value = false
    confirmingAction.value = ''
    confirmationMessage.value = ''
  }
}

watch(
  () => props.isOpen,
  (newVal) => {
    if (!newVal && isEditing.value) {
      cancelEditing()
    }
  },
)

watch(
  () => props.application,
  () => {
    if (isEditing.value) {
      cancelEditing()
    }
  },
  { deep: true },
)
</script>

<style scoped>
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

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

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

input[type='text'],
input[type='email'],
input[type='tel'],
input[type='url'],
input[type='date'],
input[type='number'],
select,
textarea {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
         focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
         bg-white disabled:bg-gray-100 disabled:cursor-not-allowed;
}

.bg-gray-50 input,
.bg-gray-50 select,
.bg-gray-50 textarea {
  @apply px-2 py-1;
}

.flex-shrink-0 {
  flex-shrink: 0;
}
</style>
