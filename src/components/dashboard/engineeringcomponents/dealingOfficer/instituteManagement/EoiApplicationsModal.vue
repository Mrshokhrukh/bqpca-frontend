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
                  <div class="flex items-center justify-between relative z-10">
                    <div class="flex items-center space-x-4">
                      <div class="p-3 bg-white rounded-lg shadow-sm">
                        <FileText class="h-7 w-7 text-gray-700" />
                      </div>
                      <div>
                        <DialogTitle as="h3" class="text-2xl font-semibold text-gray-900">
                          EOI Application for {{ application.name_of_institution }}
                        </DialogTitle>
                        <p class="text-sm text-gray-600 mt-1">
                          Review and manage EOI application information
                        </p>
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
                        <Circle class="h-4 w-4" :class="{
                          'text-yellow-500': overallStatus === 'Pending',
                          'text-green-500': overallStatus === 'Approved',
                          'text-red-500': overallStatus === 'Regretted',
                        }" />
                        <span>{{ overallStatus }}</span>
                      </span>
                      <!-- MODIFICATION 1: Edit button is disabled if status is not 'Pending' -->
                      <button type="button" class="p-2 rounded-full transition-colors"
                        :class="overallStatus === 'Pending' ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50' : 'text-gray-400 bg-gray-200 cursor-not-allowed'"
                        @click="editApplication" title="Edit Application" :disabled="overallStatus !== 'Pending'">
                        <Pencil class="h-5 w-5" />
                      </button>
                      <button type="button"
                        class="p-2 text-gray-400 hover:text-gray-500 transition-colors rounded-full hover:bg-white"
                        @click="closeModal">
                        <span class="sr-only">Close</span>
                        <X class="h-6 w-6" />
                      </button>
                    </div>
                  </div>
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
                      <!-- Focal Person Card -->
                      <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div class="p-6">
                          <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
                            <User class="h-5 w-5 text-gray-500" />
                            <span>Focal Person Details</span>
                          </h4>
                          <div class="space-y-4">
                            <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                              <UserCircle class="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                              <div>
                                <p class="text-xs font-medium text-gray-500">Full Name</p>
                                <p class="text-sm text-gray-800">{{ application.full_name }}</p>
                              </div>
                            </div>
                            <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Hash class="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                              <div>
                                <p class="text-xs font-medium text-gray-500">CID</p>
                                <p class="text-sm text-gray-800">{{ application.CID }}</p>
                              </div>
                            </div>
                            <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Users class="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                              <div>
                                <p class="text-xs font-medium text-gray-500">Gender</p>
                                <p class="text-sm text-gray-800 capitalize">{{ application.gender }}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Head of Institution Card -->
                      <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div class="p-6">
                          <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
                            <Briefcase class="h-5 w-5 text-gray-500" />
                            <span>Head of Institution</span>
                          </h4>
                          <div class="space-y-4">
                            <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                              <UserCircle class="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                              <div>
                                <p class="text-xs font-medium text-gray-500">Name</p>
                                <p class="text-sm text-gray-800">{{ application.head_of_institution_name }}</p>
                              </div>
                            </div>
                            <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Mail class="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                              <div>
                                <p class="text-xs font-medium text-gray-500">Email</p>
                                <p class="text-sm text-gray-800">{{ application.head_of_institution_email }}</p>
                              </div>
                            </div>
                            <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Phone class="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                              <div>
                                <p class="text-xs font-medium text-gray-500">Phone</p>
                                <p class="text-sm text-gray-800">{{ application.head_of_institution_phone_number }}</p>
                              </div>
                            </div>
                            <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Users class="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                              <div>
                                <p class="text-xs font-medium text-gray-500">Gender</p>
                                <p class="text-sm text-gray-800 capitalize">{{ application.head_of_institution_gender }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Right Column -->
                    <div class="lg:col-span-2 space-y-6">
                      <!-- Application Details Card -->
                      <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div class="p-6">
                          <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
                            <FileText class="h-5 w-5 text-gray-500" />
                            <span>Application & Course Details</span>
                          </h4>
                          <div class="grid grid-cols-2 gap-6">
                            <div>
                              <p class="text-sm font-medium text-gray-500">Application ID</p>
                              <p class="text-base text-gray-900 mt-1">{{ application.id }}</p>
                            </div>
                            <div>
                              <p class="text-sm font-medium text-gray-500">Program Type</p>
                              <p class="text-base text-gray-900 mt-1">{{ displayProgramType }}</p>
                            </div>
                            <div>
                              <p class="text-sm font-medium text-gray-500">Date Submitted</p>
                              <p class="text-base text-gray-900 mt-1">{{ formatDate(application.created_at) }}</p>
                            </div>
                            <div>
                              <p class="text-sm font-medium text-gray-500">Proposed Date</p>
                              <p class="text-base text-gray-900 mt-1">{{ formatDate(application.commencement_date) }}
                              </p>
                            </div>
                            <div class="col-span-2">
                              <p class="text-sm font-medium text-gray-500">Course Title</p>
                              <p class="text-base text-gray-900 mt-1">{{ application.title_of_course }}</p>
                            </div>
                            <div>
                              <p class="text-sm font-medium text-gray-500">Course Duration</p>
                              <p class="text-base text-gray-900 mt-1">{{ application.course_duration }} Days</p>
                            </div>
                            <div>
                              <p class="text-sm font-medium text-gray-500">Declaration</p>
                              <p
                                :class="['text-base mt-1', application.declaration ? 'text-green-700' : 'text-red-700']">
                                {{ application.declaration ? 'Agreed' : 'Not Agreed' }}</p>
                            </div>
                            <!-- MODIFICATION 2: Show dealing officer remarks only if approved -->
                            <div v-if="overallStatus === 'Approved'" class="col-span-2">
                              <p class="text-sm font-medium text-gray-500">Applicant Remarks</p>
                              <p class="text-base text-gray-900 mt-1">{{ application.remarks || 'N/A' }}</p>
                            </div>
                          </div>

                          <div class="p-4 bg-gray-50 rounded-lg mt-4">
                            <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
                              <FileText class="h-5 w-5 text-gray-500" />
                              <span>Application Address</span>
                            </h4>
                            <dl class="grid grid-cols-3 gap-x-4 gap-y-2 text-md">
                              <dt class="col-span-1 font-semibold text-gray-600">Country</dt>
                              <dd class="col-span-2 text-gray-800">{{ application.country }}</dd>
                              <dt class="col-span-1 font-semibold text-gray-600">Dzongkhag</dt>
                              <dd class="col-span-2 text-gray-800">{{ application.dzongkhag }}</dd>
                              <dt class="col-span-1 font-semibold text-gray-600">Village</dt>
                              <dd class="col-span-2 text-gray-800">{{ application.village }}</dd>
                              <dt class="col-span-1 font-semibold text-gray-600">Gewog</dt>
                              <dd class="col-span-2 text-gray-800">{{ application.gewog }}</dd>
                              <dt class="col-span-1 font-semibold text-gray-600">Chiwog</dt>
                              <dd class="col-span-2 text-gray-800">{{ application.chiwog }}</dd>
                              <dt class="col-span-1 font-semibold text-gray-600">Street</dt>
                              <dd class="col-span-2 text-gray-800">{{ application.address }}</dd>
                            </dl>
                          </div>

                          <div class="mt-6">
                            <a :href="application.supporting_documents" target="_blank" rel="noopener noreferrer"
                              class="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-sm">
                              <Paperclip class="h-4 w-4" />
                              <span>View Supporting Documents</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer -->
                <div class="px-8 py-4 bg-gray-50 border-t border-gray-200">
                  <div class="flex justify-between items-center">
                    <div v-if="errorMessage" class="text-sm text-red-600 flex items-center space-x-2">
                      <CircleAlert class="h-4 w-4" />
                      <span>{{ errorMessage }}</span>
                    </div>
                    <div v-else></div>
                    <!-- MODIFICATION 3: Action buttons are disabled if status is not 'Pending' -->
                    <div class="flex items-center space-x-4">
                      <button type="button"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
                        @click="closeModal">Close</button>
                      <button type="button" @click="openRejectDialog" :disabled="overallStatus !== 'Pending'"
                        :class="['px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm', overallStatus === 'Pending' ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-400 cursor-not-allowed']">
                        Regret
                      </button>
                      <button type="button" @click="openApproveDialog" :disabled="overallStatus !== 'Pending'"
                        :class="['px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm', overallStatus === 'Pending' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed']">
                        Approve
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Edit Modal -->
                <!-- Edit Modal -->
                <Dialog as="div" @close="closeEditModal" :open="isEditModalOpen" class="relative z-50">
                  <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
                  <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4">
                      <DialogPanel
                        class="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-gray-50 shadow-2xl transition-all">

                        <!-- Modal Header -->
                        <div class="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                          <div class="flex items-center space-x-4">
                            <div class="p-3 bg-blue-100 rounded-lg">
                              <Pencil class="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <DialogTitle as="h3" class="text-xl font-semibold text-gray-900">
                                Edit Application
                              </DialogTitle>
                              <p class="text-sm text-gray-500 mt-1">Update the details for this EOI application.</p>
                            </div>
                          </div>
                          <button type="button"
                            class="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
                            @click="closeEditModal">
                            <X class="h-6 w-6" />
                          </button>
                        </div>

                        <!-- Form Content -->
                        <form @submit.prevent="saveApplicationChanges" class="max-h-[75vh] overflow-y-auto">
                          <div class="p-8 space-y-8">

                            <!-- Section: Institute Details -->
                            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                              <div class="flex items-center gap-3 mb-6">
                                <Building class="h-6 w-6 text-gray-500" />
                                <h4 class="text-lg font-semibold text-gray-800">Institute Details</h4>
                              </div>
                              <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Institute Name</label>
                                <input v-model="editedApplication.name_of_institution" type="text"
                                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  required />
                              </div>
                            </div>

                            <!-- Section: Focal Person Details -->
                            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                              <div class="flex items-center gap-3 mb-6">
                                <User class="h-6 w-6 text-gray-500" />
                                <h4 class="text-lg font-semibold text-gray-800">Focal Person Details</h4>
                              </div>
                              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                  <input v-model="editedApplication.full_name" type="text"
                                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required />
                                </div>
                                <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-1">CID</label>
                                  <input v-model="editedApplication.CID" type="text"
                                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required />
                                </div>
                                <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                  <select v-model="editedApplication.gender"
                                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                  </select>
                                </div>
                                <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                  <input v-model="editedApplication.contact_no" type="tel"
                                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required />
                                </div>
                                <div class="md:col-span-2">
                                  <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                  <input v-model="editedApplication.email_address" type="email"
                                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required />
                                </div>
                              </div>
                            </div>

                            <!-- Section: Course Details -->
                            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                              <div class="flex items-center gap-3 mb-6">
                                <BookOpen class="h-6 w-6 text-gray-500" />
                                <h4 class="text-lg font-semibold text-gray-800">Course Details</h4>
                              </div>
                              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div class="md:col-span-2">
                                  <label class="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                                  <input v-model="editedApplication.title_of_course" type="text"
                                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required />
                                </div>
                                <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-1">Program Type</label>
                                  <select v-model="editedApplication.type_of_programme"
                                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required>
                                    <option value="D">Diploma</option>
                                    <option value="B">Bachelor</option>
                                    <option value="M">Master</option>
                                    <option value="P">PhD</option>
                                  </select>
                                </div>
                                <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-1">Course Duration
                                    (Days)</label>
                                  <input v-model="editedApplication.course_duration" type="number"
                                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required />
                                </div>
                                <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-1">Commencement Date</label>
                                  <input v-model="editedApplication.commencement_date" type="date"
                                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required />
                                </div>
                              </div>
                            </div>

                            <!-- Section: Address Details -->
                            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                              <div class="flex items-center gap-3 mb-6">
                                <Map class="h-6 w-6 text-gray-500" />
                                <h4 class="text-lg font-semibold text-gray-800">Address Details</h4>
                              </div>
                              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                  <input v-model="editedApplication.address" type="text"
                                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required />
                                </div>
                                <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-1">Village</label>
                                  <input v-model="editedApplication.village" type="text"
                                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required />
                                </div>
                                <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-1">Chiwog</label>
                                  <input v-model="editedApplication.chiwog" type="text"
                                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required />
                                </div>
                                <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-1">Gewog</label>
                                  <input v-model="editedApplication.gewog" type="text"
                                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required />
                                </div>
                                <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-1">Dzongkhag</label>
                                  <input v-model="editedApplication.dzongkhag" type="text"
                                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required />
                                </div>
                                <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                  <input v-model="editedApplication.country" type="text"
                                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required />
                                </div>
                              </div>
                            </div>

                            <!-- Section: Head of Institution -->
                            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                              <div class="flex items-center gap-3 mb-6">
                                <Briefcase class="h-6 w-6 text-gray-500" />
                                <h4 class="text-lg font-semibold text-gray-800">Head of Institution</h4>
                              </div>
                              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-1">Head's Name</label>
                                  <input v-model="editedApplication.head_of_institution_name" type="text"
                                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required />
                                </div>
                                <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-1">Head's Gender</label>
                                  <select v-model="editedApplication.head_of_institution_gender"
                                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                  </select>
                                </div>
                                <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-1">Head's Email</label>
                                  <input v-model="editedApplication.head_of_institution_email" type="email"
                                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required />
                                </div>
                                <div>
                                  <label class="block text-sm font-medium text-gray-700 mb-1">Head's Phone</label>
                                  <input v-model="editedApplication.head_of_institution_phone_number" type="tel"
                                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required />
                                </div>
                              </div>
                            </div>

                            <!-- Section: Administrative Remarks -->
                            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                              <div class="flex items-center gap-3 mb-6">
                                <FileText class="h-6 w-6 text-gray-500" />
                                <h4 class="text-lg font-semibold text-gray-800">Administrative Remarks</h4>
                              </div>
                              <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                                <textarea v-model="editedApplication.remarks" rows="4"
                                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
                              </div>
                            </div>

                          </div>

                          <!-- Sticky Footer for Actions -->
                          <div class="p-6 bg-white border-t border-gray-200 flex justify-end space-x-4 sticky bottom-0">
                            <button type="button"
                              class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
                              @click="closeEditModal">Cancel</button>
                            <button type="submit"
                              class="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                              Save Changes
                            </button>
                          </div>
                        </form>
                      </DialogPanel>
                    </div>
                  </div>
                </Dialog>

                <!-- Approve/Reject/Success Modals -->
                <TransitionRoot appear :show="isApproveDialogOpen" as="template">
                  <Dialog as="div" @close="cancelApproval" class="relative z-50">
                    <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
                    <div class="fixed inset-0 overflow-y-auto">
                      <div class="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                          class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                          <div class="mb-5 text-center">
                            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                              <CheckCircle class="h-6 w-6 text-green-600" />
                            </div>
                            <DialogTitle as="h3" class="text-lg font-medium text-gray-900 mt-4">Approve Application
                            </DialogTitle>
                          </div>
                          <div class="mt-3"><label for="approval-notes"
                              class="block text-sm font-medium text-gray-700 mb-2">Approval Notes</label><textarea
                              id="approval-notes" v-model="approvalNotes" rows="4"
                              class="w-full rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm p-3"></textarea>
                          </div>
                          <div class="mt-6 flex justify-end space-x-3"><button type="button"
                              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm"
                              @click="cancelApproval">Cancel</button><button type="button"
                              :disabled="!approvalNotes.trim()"
                              :class="['inline-flex justify-center px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm', approvalNotes.trim() ? 'bg-green-600 hover:bg-green-700' : 'bg-green-300 cursor-not-allowed']"
                              @click="confirmApproval">Approve</button></div>
                        </DialogPanel>
                      </div>
                    </div>
                  </Dialog>
                </TransitionRoot>
                <TransitionRoot appear :show="isRejectDialogOpen" as="template">
                  <Dialog as="div" @close="cancelRejection" class="relative z-50">
                    <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
                    <div class="fixed inset-0 overflow-y-auto">
                      <div class="flex min-h-full items-center justify-center p-4">
                        <DialogPanel
                          class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                          <div class="mb-5 text-center">
                            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                              <ThumbsDown class="h-6 w-6 text-red-600" />
                            </div>
                            <DialogTitle as="h3" class="text-lg font-medium text-gray-900 mt-4">Regret Application
                            </DialogTitle>
                          </div>
                          <div class="mt-3"><label for="rejection-reason"
                              class="block text-sm font-medium text-gray-700 mb-2">Reason for Rejection</label><textarea
                              id="rejection-reason" v-model="rejectionReason" rows="4"
                              class="w-full rounded-lg border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 text-sm p-3"></textarea>
                          </div>
                          <div class="mt-6 flex justify-end space-x-3"><button type="button"
                              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm"
                              @click="cancelRejection">Cancel</button><button type="button"
                              :disabled="!rejectionReason.trim()"
                              :class="['inline-flex justify-center px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm', rejectionReason.trim() ? 'bg-red-600 hover:bg-red-700' : 'bg-red-300 cursor-not-allowed']"
                              @click="confirmRejection">Reject</button></div>
                        </DialogPanel>
                      </div>
                    </div>
                  </Dialog>
                </TransitionRoot>
                <Transition enter="transform transition ease-in-out duration-500"
                  enter-from="translate-y-full opacity-0" enter-to="translate-y-0 opacity-100"
                  leave="transform transition ease-in-out duration-500" leave-from="translate-y-0 opacity-100"
                  leave-to="translate-y-full opacity-0">
                  <div v-if="showSuccess" class="fixed bottom-6 right-6 flex items-center p-4 mb-4 shadow-lg rounded-lg"
                    :class="[successType === 'approve' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : successType === 'reject' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' : 'bg-blue-100 text-blue-800 border-l-4 border-blue-500']">
                    <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg mr-3"
                      :class="[successType === 'approve' ? 'bg-green-200 text-green-600' : successType === 'reject' ? 'bg-red-200 text-red-600' : 'bg-blue-200 text-blue-600']">
                      <CheckCircle v-if="successType === 'approve'" class="w-5 h-5" />
                      <ThumbsDown v-else-if="successType === 'reject'" class="w-5 h-5" />
                      <Pencil v-else class="w-5 h-5" />
                    </div>
                    <div class="ml-3 text-sm font-medium mr-8">{{ successMessage }}</div><button type="button"
                      class="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 items-center justify-center"
                      :class="[successType === 'approve' ? 'bg-green-200 text-green-600 hover:bg-green-300 focus:ring-green-400' : successType === 'reject' ? 'bg-red-200 text-red-600 hover:bg-red-300 focus:ring-red-400' : 'bg-blue-200 text-blue-600 hover:bg-blue-300 focus:ring-blue-400']"
                      @click="closeSuccessNotification"><span class="sr-only">Close</span>
                      <X class="w-4 h-4" />
                    </button>
                  </div>
                </Transition>

              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
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
  CheckCircle,
  ThumbsDown,
  Briefcase,
  Paperclip,
  Users,
  Building,
  BookOpen,
  Map,
} from 'lucide-vue-next'
import { computed, ref } from 'vue'
import apiService from '@/services/services'
import { useToast } from 'vue-toastification'

const toast = useToast()

const props = defineProps({
  isOpen: Boolean,
  application: {
    type: Object,
    required: true,
    default: () => ({}),
  },
})

const emit = defineEmits(['close', 'application-updated'])

const errorMessage = ref('')
const isEditModalOpen = ref(false)
const editedApplication = ref({})

const isApproveDialogOpen = ref(false)
const isRejectDialogOpen = ref(false)
const approvalNotes = ref('')
const rejectionReason = ref('')

const showSuccess = ref(false)
const successMessage = ref('')
const successType = ref('')
const successTimeoutId = ref(null)

const programTypeMap = { D: 'Diploma', B: 'Bachelor', M: 'Master', P: 'PhD' }
const displayProgramType = computed(() => programTypeMap[props.application?.type_of_programme?.toUpperCase()] || 'N/A')
const overallStatus = computed(() => props.application?.review_decision || 'Pending')

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch (error) {
    return 'Invalid Date'
  }
}

const editApplication = () => {
  if (overallStatus.value !== 'Pending') return;
  if (!props.application) return
  editedApplication.value = JSON.parse(JSON.stringify(props.application))

  if (editedApplication.value.commencement_date) {
    try {
      editedApplication.value.commencement_date = new Date(editedApplication.value.commencement_date).toISOString().split('T')[0]
    } catch {
      editedApplication.value.commencement_date = ''
    }
  }
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
  editedApplication.value = {}
}

const showSuccessNotification = (message, type) => {
  successMessage.value = message
  successType.value = type
  showSuccess.value = true
  if (successTimeoutId.value) clearTimeout(successTimeoutId.value)
  successTimeoutId.value = setTimeout(() => { showSuccess.value = false }, 5000)
}

const closeSuccessNotification = () => {
  showSuccess.value = false
  if (successTimeoutId.value) clearTimeout(successTimeoutId.value)
}

const saveApplicationChanges = async () => {
  if (!props.application?.id) {
    toast.error('Cannot save: Application ID is missing.')
    return
  }
  try {
    const payloadToSend = { ...editedApplication.value }
    delete payloadToSend.id
    delete payloadToSend.created_at
    delete payloadToSend.updated_at
    delete payloadToSend.supporting_documents

    const response = await apiService.patchEpcInstitute(props.application.id, payloadToSend)

    if (response && response.status === 200 && response.data) {
      emit('application-updated', response.data)
      closeEditModal()
      showSuccessNotification('Application updated successfully!', 'edit')
    } else {
      toast.error(response?.data?.message || 'Failed to update application.')
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message || 'Unknown error'
    toast.error(`Failed to update: ${errorMsg}`)
  }
}

const closeModal = () => emit('close')
const closeModalHandler = () => closeModal()

const openApproveDialog = () => { if (overallStatus.value === 'Pending') { approvalNotes.value = ''; isApproveDialogOpen.value = true } }
const openRejectDialog = () => { if (overallStatus.value === 'Pending') { rejectionReason.value = ''; isRejectDialogOpen.value = true } }
const cancelApproval = () => { isApproveDialogOpen.value = false }
const cancelRejection = () => { isRejectDialogOpen.value = false }

const updateApplicationStatus = async (decision, notesOrReason) => {
  if (!props.application?.id) {
    toast.error('Application ID is missing.')
    return false
  }
  const payload = { review_decision: decision }
  if (decision === 'Approved') payload.approvalNotes = notesOrReason
  else if (decision === 'Regretted') payload.reason_if_rejected = notesOrReason

  try {
    const response = await apiService.patchEpcInstitute(props.application.id, payload)
    if (response && response.status === 200 && response.data) {
      emit('application-updated', response.data)
      return true
    } else {
      toast.error(response?.data?.message || `Failed to ${decision.toLowerCase()} application.`)
      return false
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message
    toast.error(`Error: ${errorMsg}`)
    return false
  }
}

const confirmApproval = async () => {
  if (!approvalNotes.value.trim()) return
  const success = await updateApplicationStatus('Approved', approvalNotes.value)
  if (success) {
    isApproveDialogOpen.value = false
    showSuccessNotification(`Application approved. Notification sent to ${props.application.name_of_institution}.`, 'approve')
  }
}

const confirmRejection = async () => {
  if (!rejectionReason.value.trim()) return
  const success = await updateApplicationStatus('Regretted', rejectionReason.value)
  if (success) {
    isRejectDialogOpen.value = false
    showSuccessNotification(`Application regretted. Notification sent to ${props.application.name_of_institution}.`, 'reject')
  }
}
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

.rounded-xl:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.capitalize {
  text-transform: capitalize;
}
</style>
