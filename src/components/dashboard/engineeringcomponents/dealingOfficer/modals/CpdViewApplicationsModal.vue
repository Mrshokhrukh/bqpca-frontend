<template>
  <TransitionRoot appear :show="application !== null" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-50">
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
              class="w-full max-w-8xl transform overflow-hidden rounded-2xl bg-gray-50 shadow-2xl transition-all"
              v-if="application">
              <div class="relative">
                <div :class="[
                  'px-8 py-6 border-b relative overflow-hidden',
                  {
                    'bg-yellow-50 border-yellow-100': getApplicationStatus() === 'Pending',
                    'bg-green-50 border-green-100': getApplicationStatus() === 'Approved',
                    'bg-red-50 border-red-100': getApplicationStatus() === 'Regretted',
                  },
                ]">
                  <div class="flex items-center justify-between relative z-10">
                    <div class="flex items-center space-x-4">
                      <div class="p-3 bg-white rounded-lg shadow-sm">
                        <FileText class="h-7 w-7 text-gray-700" />
                      </div>
                      <div>
                        <DialogTitle as="h3" class="text-2xl font-semibold text-gray-900">
                          CPD Application Details
                        </DialogTitle>
                        <p class="text-sm text-gray-600 mt-1">
                          Review and manage CPD application information
                        </p>
                      </div>
                    </div>
                    <div class="flex items-center space-x-4">
                      <span :class="[
                        'px-5 py-2.5 rounded-full text-sm font-medium inline-flex items-center space-x-2 shadow-sm',
                        {
                          'bg-yellow-100 text-yellow-800': getApplicationStatus() === 'Pending',
                          'bg-green-100 text-green-800': getApplicationStatus() === 'Approved',
                          'bg-red-100 text-red-800': getApplicationStatus() === 'Regretted',
                        },
                      ]">
                        <Circle class="h-4 w-4" :class="{
                          'text-yellow-500': getApplicationStatus() === 'Pending',
                          'text-green-500': getApplicationStatus() === 'Approved',
                          'text-red-500': getApplicationStatus() === 'Regretted',
                        }" />
                        <span>{{ getApplicationStatus() }}</span>
                      </span>
                      <button type="button"
                        class="p-2 text-gray-400 hover:text-gray-500 transition-colors rounded-full hover:bg-white"
                        @click="$emit('close')">
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

                <div class="px-8 py-6 bg-white max-h-[calc(100vh-200px)] overflow-y-auto">
                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div class="lg:col-span-1 space-y-6">
                      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="p-6">
                          <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
                            <User class="h-5 w-5 text-gray-500" />
                            <span>Personal Information</span>
                          </h4>
                          <div class="space-y-4">
                            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Badge class="h-4 w-4 text-gray-400" />
                              <div>
                                <span class="text-xs text-gray-500">Registration Number</span>
                                <p class="text-sm text-gray-900">
                                  {{ application.registration_no || 'Not provided' }}
                                </p>
                              </div>
                            </div>
                            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <Hash class="h-4 w-4 text-gray-400" />
                              <div>
                                <span class="text-xs text-gray-500">CID/Identity Number</span>
                                <p class="text-sm text-gray-900">
                                  {{ application.cid_no || 'Not provided' }}
                                </p>
                              </div>
                            </div>
                            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <User class="h-4 w-4 text-gray-400" />
                              <div>
                                <span class="text-xs text-gray-500">Full Name</span>
                                <p class="text-sm text-gray-900">
                                  {{ application.full_name || 'Not provided' }}
                                </p>
                              </div>
                            </div>
                            <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <UserCircle class="h-4 w-4 text-gray-400" />
                              <div>
                                <span class="text-xs text-gray-500">Venue</span>
                                <p class="text-sm text-gray-900">
                                  {{ application.venue || 'Not provided' }}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        v-if="application.course_document || application.document_supporting_expertise || application.attendance_sheet_attachment"
                        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="p-6">
                          <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
                            <Paperclip class="h-5 w-5 text-gray-500" />
                            <span>Attachments</span>
                          </h4>
                          <div class="space-y-3">
                            <div v-if="application.course_document"
                              class="p-4 bg-gray-50 rounded-lg flex flex-col items-center space-y-3">
                              <FileText class="h-8 w-8 text-gray-400" />
                              <p class="text-sm text-gray-900 text-center">Course Document</p>
                              <a :href="application.course_document" target="_blank"
                                class="px-3 py-1.5 text-xs font-medium text-blue-600 bg-white border border-blue-300 rounded-lg shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                                View Document
                              </a>
                            </div>
                            <div v-if="application.document_supporting_expertise"
                              class="p-4 bg-gray-50 rounded-lg flex flex-col items-center space-y-3">
                              <FileText class="h-8 w-8 text-gray-400" />
                              <p class="text-sm text-gray-900 text-center">Supporting Expertise</p>
                              <a :href="application.document_supporting_expertise" target="_blank"
                                class="px-3 py-1.5 text-xs font-medium text-blue-600 bg-white border border-blue-300 rounded-lg shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                                View Document
                              </a>
                            </div>
                            <div v-if="application.attendance_sheet_attachment"
                              class="p-4 bg-gray-50 rounded-lg flex flex-col items-center space-y-3">
                              <FileText class="h-8 w-8 text-gray-400" />
                              <p class="text-sm text-gray-900 text-center">Attendance Sheet</p>
                              <a :href="application.attendance_sheet_attachment" target="_blank"
                                class="px-3 py-1.5 text-xs font-medium text-blue-600 bg-white border border-blue-300 rounded-lg shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                                View Document
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="lg:col-span-2 space-y-6">
                      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="p-6">
                          <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
                            <BookOpen class="h-5 w-5 text-gray-500" />
                            <span>CPD Details</span>
                          </h4>
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="md:col-span-2 p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Title of CPD</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-start space-x-2">
                                <FileText class="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <span>{{ application.title_of_cpd || 'Not provided' }}</span>
                              </p>
                            </div>
                            <div class="md:col-span-2 p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Expected Outcome</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-start space-x-2">
                                <Link class="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <span>{{ application.expected_outcome || 'Not provided' }}</span>
                              </p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">CPD Type</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                <Activity class="h-4 w-4 text-gray-400" />
                                <span>{{ getCpdTypeName(application.type_of_cpd) }}</span>
                              </p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">CPD Providing Agency</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                <UserCheck class="h-4 w-4 text-gray-400" />
                                <span>{{ getCpdProvidingAgencyName(application.cpd_providing_agency) }}</span>
                              </p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">From Date</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                <Calendar class="h-4 w-4 text-gray-400" />
                                <span>{{ formatDate(application.from_date) || 'Not provided' }}</span>
                              </p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">To Date</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                <Calendar class="h-4 w-4 text-gray-400" />
                                <span>{{ formatDate(application.to_date) || 'Not provided' }}</span>
                              </p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Duration (Hours)</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                <Clock class="h-4 w-4 text-gray-400" />
                                <span>
                                  {{ application.total_duration_hours || application.duration_in_hours || 'Notprovided'
                                  }}
                                </span>
                              </p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Expected Participants</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                <Users class="h-4 w-4 text-gray-400" />
                                <span>{{ application.number_of_participants || 'Notprovided' }}</span>
                              </p>
                            </div>
                            <div class="md:col-span-2 p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Proposed Training Location</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-start space-x-2">
                                <UserCircle class="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <span>{{ application.proposed_training_location || 'Not provided' }}</span>
                              </p>
                            </div>
                            <div class="md:col-span-2 p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Relevance to Topic</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-start space-x-2">
                                <Link class="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <span>{{ application.relevance_to_topic || 'Not provided' }}</span>
                              </p>
                            </div>
                            <div class="md:col-span-2 p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Reason for Conducting</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-start space-x-2">
                                <MessageSquare class="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <span>{{ getReasonForConductingName(application.reason_for_conducting) }}</span>
                              </p>
                            </div>
                            <div v-if="application.reason_for_details" class="md:col-span-2 p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Reason Details</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-start space-x-2">
                                <MessageSquare class="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <span>{{ application.reason_for_details }}</span>
                              </p>
                            </div>
                            <div v-if="application.activities_summary" class="md:col-span-2 p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Activities Summary</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-start space-x-2">
                                <Activity class="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                <span>{{ application.activities_summary }}</span>
                              </p>
                            </div>
                          </div>

                          <!-- Learning Methods, Resources, Methodologies -->
                          <div
                            v-if="application.learning_methods?.length || application.resources?.length || application.methodologies?.length"
                            class="mt-6 space-y-6">

                            <!-- Learning Methods -->
                            <div v-if="application.learning_methods?.length"
                              class="p-6 bg-blue-50 rounded-lg border border-blue-200">
                              <h5 class="text-base font-semibold text-blue-900 mb-4 flex items-center space-x-2">
                                <BookOpen class="h-5 w-5 text-blue-600" />
                                <span>Learning Methods & Activities</span>
                              </h5>
                              <div class="space-y-3">
                                <div v-for="method in application.learning_methods" :key="method.id"
                                  class="p-4 bg-white rounded-lg border border-blue-100 shadow-sm">
                                  <div class="flex items-start justify-between">
                                    <div class="flex-1">
                                      <p class="text-sm font-medium text-gray-900 mb-2">{{ method.activities ||
                                        'Activity not specified' }}</p>
                                      <div class="flex items-center space-x-4 text-xs text-gray-600">
                                        <span class="flex items-center space-x-1">
                                          <Clock class="h-3 w-3" />
                                          <span>{{ method.duration || 0 }} hours</span>
                                        </span>
                                      </div>
                                    </div>
                                    <div class="ml-4">
                                      <span
                                        class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                                        Activity #{{ method.id }}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <!-- Resources with Credits Editing -->
                            <div v-if="application.resources?.length"
                              class="p-6 bg-green-50 rounded-lg border border-green-200">
                              <h5 class="text-base font-semibold text-green-900 mb-4 flex items-center space-x-2">
                                <Users class="h-5 w-5 text-green-600" />
                                <span>Resource Persons</span>
                              </h5>
                              <div class="space-y-3">
                                <div v-for="resource in application.resources" :key="resource.id"
                                  class="p-4 bg-white rounded-lg border border-green-100 shadow-sm">
                                  <div class="flex items-center justify-between">
                                    <div class="flex items-center space-x-3">
                                      <div class="p-2 bg-green-100 rounded-full">
                                        <User class="h-4 w-4 text-green-600" />
                                      </div>
                                      <div class="flex-1">
                                        <p class="text-sm font-medium text-gray-900">
                                          {{ resource.resource_person_name || 'Name not provided' }}
                                        </p>
                                        <p class="text-xs text-gray-600">
                                          Reg. No: {{ resource.resource_person_reg_no || 'Not specified' }}
                                        </p>

                                        <!-- Credits section for resource person -->
                                        <div class="mt-2 grid grid-cols-2 gap-4">
                                          <div>
                                            <p class="text-xs text-gray-500">Review Status</p>
                                            <span
                                              class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                              Resource Person
                                            </span>
                                          </div>
                                          <div>
                                            <p class="text-xs text-gray-500">CPD Credits</p>
                                            <div v-if="editingResource === resource.id" class="mt-1">
                                              <input v-model.number="resourceCredits[resource.id]" type="number" min="0"
                                                step="0.5"
                                                class="w-20 px-2 py-1 text-sm bg-white border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                                            </div>
                                            <p v-else class="text-sm font-medium text-gray-900">
                                              {{ getResourceCredits(resource) || 0 }}
                                            </p>
                                          </div>
                                        </div>

                                        <div v-if="resource.resource_document" class="mt-2">
                                          <a :href="resource.resource_document" target="_blank"
                                            class="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-300 rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                                            <FileText class="h-3 w-3 mr-1" />
                                            View Document
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="flex items-center space-x-2 ml-4">
                                      <!-- Edit buttons for resource person -->
                                      <button v-if="editingResource !== resource.id"
                                        @click="startEditingResource(resource)"
                                        class="px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors">
                                        Edit Credits
                                      </button>
                                      <template v-else>
                                        <button @click="saveResource(resource)"
                                          class="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors">
                                          Save
                                        </button>
                                        <button @click="cancelEditingResource()"
                                          class="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors">
                                          Cancel
                                        </button>
                                      </template>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <!-- Methodologies -->
                            <div v-if="application.methodologies?.length"
                              class="p-6 bg-purple-50 rounded-lg border border-purple-200">
                              <h5 class="text-base font-semibold text-purple-900 mb-4 flex items-center space-x-2">
                                <Activity class="h-5 w-5 text-purple-600" />
                                <span>Training Methodologies</span>
                              </h5>
                              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div v-for="methodology in application.methodologies" :key="methodology.id"
                                  class="p-4 bg-white rounded-lg border border-purple-100 shadow-sm">
                                  <div class="flex items-center space-x-3">
                                    <div class="p-2 bg-purple-100 rounded-full">
                                      <Activity class="h-4 w-4 text-purple-600" />
                                    </div>
                                    <div class="flex-1">
                                      <p class="text-sm font-medium text-gray-900">
                                        {{ getMethodologyName(methodology.methodology_name) }}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Participants Section -->
                      <div v-if="application.participants && application.participants.length > 0"
                        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="p-6">
                          <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
                            <Users class="h-5 w-5 text-gray-500" />
                            <span>Participants ({{ application.participants.length }})</span>
                          </h4>
                          <div class="space-y-4">
                            <div v-for="participant in application.participants" :key="participant.id"
                              class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <div class="flex items-center justify-between">
                                <div class="flex-1">
                                  <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                      <p class="text-xs text-gray-500">Registration No.</p>
                                      <p class="text-sm font-medium text-gray-900">
                                        {{ getParticipantRegNo(participant) }}
                                      </p>
                                    </div>
                                    <div>
                                      <p class="text-xs text-gray-500">Name</p>
                                      <p class="text-sm font-medium text-gray-900">
                                        {{ getParticipantName(participant) }}
                                      </p>
                                    </div>
                                    <div>
                                      <p class="text-xs text-gray-500">Review Status</p>
                                      <span :class="[
                                        'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                                        {
                                          'bg-yellow-100 text-yellow-800': participant.review_status === 'Pending',
                                          'bg-green-100 text-green-800': participant.review_status === 'Approved',
                                          'bg-red-100 text-red-800': participant.review_status === 'Rejected',
                                        },
                                      ]">
                                        {{ participant.review_status || 'Pending' }}
                                      </span>
                                    </div>
                                    <div>
                                      <p class="text-xs text-gray-500">CPD Credits</p>
                                      <div v-if="editingParticipant === participant.id" class="mt-1">
                                        <input v-model.number="participantCredits[participant.id]" type="number" min="0"
                                          step="0.5"
                                          class="w-20 px-2 py-1 text-sm bg-white border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                      </div>
                                      <p v-else class="text-sm font-medium text-gray-900">
                                        {{ participant.cpd_credits || 0 }}
                                      </p>
                                    </div>
                                  </div>
                                  <div v-if="participant.review_remarks" class="mt-3">
                                    <p class="text-xs text-gray-500">Remarks</p>
                                    <p class="text-sm text-gray-700">{{ participant.review_remarks }}</p>
                                  </div>
                                </div>
                                <div class="flex items-center space-x-2 ml-4">
                                  <button v-if="editingParticipant !== participant.id"
                                    @click="startEditingParticipant(participant)"
                                    class="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                                    Edit
                                  </button>
                                  <template v-else>
                                    <button @click="saveParticipant(participant)"
                                      class="px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors">
                                      Save
                                    </button>
                                    <button @click="cancelEditingParticipant()"
                                      class="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors">
                                      Cancel
                                    </button>
                                  </template>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="p-6">
                          <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
                            <ClipboardCheck class="h-5 w-5 text-gray-500" />
                            <span>Review Details</span>
                          </h4>
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Expected CPD Credits</p>
                              <div v-if="isEditing" class="mt-2">
                                <input v-model.number="editedApplication.credit" type="number" min="0" step="0.5"
                                  class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                              </div>
                              <p v-else class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                <Award class="h-4 w-4 text-gray-400" />
                                <span>{{ application.credit || '0' }}</span>
                              </p>
                            </div>
                            <div class="p-4 bg-gray-50 rounded-lg">
                              <p class="text-sm font-medium text-gray-500">Assigned Credits</p>
                              <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
                                <Award class="h-4 w-4 text-gray-400" />
                                <span>{{ application.credit || '0' }}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="p-6">
                          <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
                            <CheckCircle class="h-5 w-5 text-gray-500" />
                            <span>Review Action</span>
                          </h4>

                          <div v-if="showApprovalForm"
                            class="p-6 bg-green-50 rounded-xl border border-green-200 mb-4 transition-all">

                            <h5 class="text-base font-medium text-green-800 mb-4 flex items-center space-x-2">
                              <CheckCircle class="h-4 w-4 text-green-600" />
                              <span>Approve Application</span>
                            </h5>
                            <div class="space-y-4">
                              <div>
                                <label class="block text-sm font-medium text-gray-700">Assigned CPD Credits <span
                                    class="text-red-600">*</span></label>
                                <input v-model.number="approvalCredits" type="number" min="0" step="0.5"
                                  class="mt-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                              </div>
                              <div>
                                <label class="block text-sm font-medium text-gray-700">Approval Notes</label>
                                <textarea v-model="approvalMessage" rows="3"
                                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                  placeholder="Enter any notes for approval..."></textarea>
                              </div>
                              <div class="flex justify-end space-x-3">
                                <button @click="showApprovalForm = false"
                                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
                                  Cancel
                                </button>
                                <button @click="approveApplication"
                                  class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
                                  Confirm Approval
                                </button>
                              </div>
                            </div>
                          </div>

                          <div v-if="showRejectionForm"
                            class="p-6 bg-red-50 rounded-xl border border-red-200 mb-4 transition-all">
                            <h5 class="text-base font-medium text-red-800 mb-4 flex items-center space-x-2">
                              <XCircle class="h-4 w-4 text-red-600" />
                              <span>Reject Application</span>
                            </h5>
                            <div class="space-y-4">
                              <div>
                                <label class="block text-sm font-medium text-gray-700">Rejection Reason <span
                                    class="text-red-600">*</span></label>
                                <textarea v-model="rejectionMessage" rows="3"
                                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                  placeholder="Please provide a reason for rejection..."></textarea>
                                <p v-if="rejectionError" class="mt-1 text-sm text-red-600 flex items-center">
                                  <AlertCircle class="h-3 w-3 mr-1" />
                                  {{ rejectionError }}
                                </p>
                              </div>
                              <div class="flex justify-end space-x-3">
                                <button @click="
                                  showRejectionForm = false;
                                rejectionError = '';
                                "
                                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
                                  Cancel
                                </button>
                                <button @click="rejectApplication"
                                  class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
                                  Confirm Rejection
                                </button>
                              </div>
                            </div>
                          </div>

                          <div v-if="!showApprovalForm && !showRejectionForm && !isEditing"
                            class="flex items-center space-x-4">
                            <button @click="handleApprovalClick"
                              class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors flex items-center space-x-2">
                              <CheckCircle class="h-4 w-4" />
                              <span>Approve Application</span>
                            </button>
                            <button @click="handleRejectionClick"
                              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors flex items-center space-x-2">
                              <XCircle class="h-4 w-4" />
                              <span>Reject Application</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="px-8 py-4 bg-gray-50 border-t border-gray-200">
                  <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-4">
                      <button @click="startEditing" v-if="!isEditing"
                        class="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center space-x-2">
                        <Pencil class="h-4 w-4" />
                        <span>Edit Credits</span>
                      </button>
                    </div>
                    <div class="flex items-center space-x-4">
                      <button type="button"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center space-x-2"
                        @click="$emit('close')">
                        <X class="h-4 w-4" />
                        <span>Close</span>
                      </button>

                      <button v-if="isEditing" type="button"
                        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center space-x-2"
                        @click="saveChanges">
                        <Check class="h-4 w-4" />
                        <span>Save Changes</span>
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
</template>
<script setup>
import { ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  Activity,
  AlertCircle,
  Award,
  Badge,
  BookOpen,
  Calendar,
  Check,
  CheckCircle,
  Circle,
  ClipboardCheck,
  Clock,
  FileText,
  Hash,
  Link,
  MessageSquare,
  Paperclip,
  Pencil,
  User,
  UserCheck,
  UserCircle,
  Users,
  X,
  XCircle,
} from 'lucide-vue-next'

const props = defineProps({
  application: {
    type: Object,
    required: true,
    default: () => ({
      registration_no: '',
      cid_no: '',
      full_name: '',
      title_of_cpd: '',
      expected_outcome: '',
      from_date: '',
      to_date: '',
      venue: '',
      credit: 0,
      duration_in_hours: 0,
      total_duration_hours: 0,
      number_of_participants: 0,
      course_document: '',
      document_supporting_expertise: '',
      attendance_sheet_attachment: '',
      participants: [],
      status: 'pending',
      type_of_cpd: null,
      proposed_training_location: '',
      cpd_providing_agency: null,
      reason_for_conducting: null,
      relevance_to_topic: '',
      reason_for_details: '',
      learning_methods: [],
      resources: [],
      methodologies: [],
      activities_summary: '',
    }),
  },
})

const emit = defineEmits(['close', 'save', 'approve', 'reject', 'updateParticipant'])

const isEditing = ref(false)
const editedApplication = ref({ ...props.application })
const showApprovalForm = ref(false)
const showRejectionForm = ref(false)
const approvalMessage = ref('')
const rejectionMessage = ref('')
const rejectionError = ref('')
const approvalCredits = ref(props.application?.credit || 0)
const allParticipants = ref([])
// Participant editing
const editingParticipant = ref(null)
const participantCredits = ref({})

const editingResource = ref(null)
const resourceCredits = ref({})
// CPD Type mapping
const cpdTypeMap = {
  1: 'Workshop',
  2: 'Seminar',
  3: 'Online Course',
  4: 'Conference',
  5: 'Training Program',
  6: 'Other'
}

const getCpdTypeName = (typeId) => {
  if (!typeId) return 'Not specified'
  return cpdTypeMap[typeId] || `Unknown Type (ID: ${typeId})`
}

// CPD Providing Agency mapping
const cpdProvidingAgencyMap = {
  1: 'Royal University of Bhutan',
  2: 'Engineers Australia',
  3: 'Institution of Engineers Singapore',
  4: 'Institution of Civil Engineers (ICE)',
  5: 'American Society of Civil Engineers (ASCE)',
  6: 'Institute of Electrical and Electronics Engineers (IEEE)',
  7: 'Other'
}

const getCpdProvidingAgencyName = (agencyId) => {
  if (!agencyId) return 'Not specified'
  return cpdProvidingAgencyMap[agencyId] || `Unknown Agency (ID: ${agencyId})`
}

// Reason for Conducting mapping
const reasonForConductingMap = {
  1: 'Professional Development',
  2: 'Regulatory Requirement',
  3: 'Skill Enhancement',
  4: 'Career Advancement',
  5: 'Industry Updates',
  6: 'Knowledge Sharing',
  7: 'Other'
}

const getReasonForConductingName = (reasonId) => {
  if (!reasonId) return 'Not specified'
  return reasonForConductingMap[reasonId] || `Unknown Reason (ID: ${reasonId})`
}

// Methodology mapping
const methodologyMap = {
  1: 'Lecture/Presentation',
  2: 'Interactive Workshop',
  3: 'Group Discussion',
  4: 'Case Study Analysis',
  5: 'Hands-on Practice',
  6: 'Role Playing',
  7: 'Simulation',
  8: 'E-Learning',
  9: 'Field Work',
  10: 'Other'
}

// Add this new function after the watch
const fetchParticipantsData = async () => {
  try {
    // You'll need to import your API service at the top of the file
    const apiServices = await import('@/services/services')
    const response = await apiServices.default.getEpcFullApplicationListByCid('')

    if (response.data) {
      allParticipants.value = response.data.results || response.data || []
      console.log(`Loaded ${allParticipants.value.length} participants for lookup.`)
    }
  } catch (error) {
    console.error('Error fetching participants for lookup:', error)
    allParticipants.value = []
  }
}

const getParticipantName = (participant) => {
  // For CPD task participants, we only have participant_reg_no
  // We need to look up the actual user data from the participants list
  if (participant.participant_reg_no && !participant.first_name && !participant.full_name) {
    // Try to find the user data from the participants list
    const userData = findUserByRegNo(participant.participant_reg_no)
    if (userData) {
      return getParticipantName(userData)
    }
    // If not found in loaded data, return a formatted version
    return `User ${participant.participant_reg_no}`
  }

  // Check if this is from the application list (getEpcFullApplicationListByCid)
  if (participant.full_name) {
    return participant.full_name
  }

  // Handle first_name + last_name combination
  if (participant.first_name || participant.last_name) {
    const firstName = participant.first_name || ''
    const middleName = participant.middle_name ? ` ${participant.middle_name}` : ''
    const lastName = participant.last_name || ''
    return `${firstName}${middleName} ${lastName}`.trim()
  }

  // Check if participant has a nested user object
  if (participant.user) {
    return getParticipantName(participant.user)
  }

  // Fallback to other possible name fields
  return participant.name || participant.participant_name || participant.username || 'Unknown Name'
}

const getParticipantRegNo = (participant) => {
  // Check nested objects first
  if (participant.user && participant.user.cid) {
    return participant.user.cid
  }

  // Check direct fields - for CPD task participants, participant_reg_no is the main field
  return participant.participant_reg_no || participant.cid || participant.registration_no || participant.reg_no || participant.registrationNo || 'N/A'
}

// Helper function to find user data by registration number
const findUserByRegNo = (regNo) => {
  return allParticipants.value.find(p =>
    p.cid === regNo ||
    p.registration_no === regNo ||
    p.reg_no === regNo ||
    p.participant_reg_no === regNo
  )
}

const getMethodologyName = (methodologyId) => {
  if (!methodologyId) return 'Not specified'
  return methodologyMap[methodologyId] || `Unknown Methodology (ID: ${methodologyId})`
}

// Resource person functions (ADD THESE after the participant functions)
const startEditingResource = (resource) => {
  editingResource.value = resource.id
  resourceCredits.value[resource.id] = getResourceCredits(resource) || 0
}

const cancelEditingResource = () => {
  editingResource.value = null
  resourceCredits.value = {}
}

const saveResource = (resource) => {
  const credits = Number(resourceCredits.value[resource.id])
  if (isNaN(credits) || credits < 0) {
    resourceCredits.value[resource.id] = 0
  }

  // Find the participant record for this resource person
  const resourceParticipant = findResourceAsParticipant(resource)

  if (resourceParticipant) {
    emit('updateParticipant', {
      id: resourceParticipant.id,
      cpd_credits: resourceCredits.value[resource.id],
      review_status: 'Approved'
    })
  }

  editingResource.value = null
  resourceCredits.value = {}
}

const getResourceCredits = (resource) => {
  // Find this resource person in the participants list and get their credits
  const resourceParticipant = findResourceAsParticipant(resource)
  return resourceParticipant?.cpd_credits || 0
}

const findResourceAsParticipant = (resource) => {
  // Find the resource person in the participants array by matching registration number
  const resourceRegNo = resource.resource_person_reg_no
  return props.application.participants?.find(participant =>
    getParticipantRegNo(participant) === resourceRegNo
  )
}

watch(
  () => props.application,
  (newApplication) => {
    if (newApplication) {
      editedApplication.value = { ...newApplication }
      approvalCredits.value = newApplication.credit || 0
      isEditing.value = false
      showApprovalForm.value = false
      showRejectionForm.value = false
      approvalMessage.value = ''
      rejectionMessage.value = ''
      rejectionError.value = ''
      editingParticipant.value = null
      participantCredits.value = {}
      editingResource.value = null
      resourceCredits.value = {}

      // Fetch participants data when application changes
      fetchParticipantsData()
    }
  },
  { immediate: true }
)



const getApplicationStatus = () => {
  const status = props.application?.status || 'pending'
  // Convert status to proper case
  switch (status.toLowerCase()) {
    case 'approved':
      return 'Approved'
    case 'regretted':
      return 'Regretted'
    case 'pending':
    default:
      return 'Pending'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Not provided'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    return dateString
  }
}

const startEditing = () => {
  editedApplication.value = { ...props.application }
  isEditing.value = true
  showApprovalForm.value = false
  showRejectionForm.value = false
}

const saveChanges = () => {
  const creditsToSave = Number(editedApplication.value.credit)
  if (isNaN(creditsToSave) || creditsToSave < 0) {
    editedApplication.value.credit = 0
  } else {
    editedApplication.value.credit = creditsToSave
  }

  emit('save', {
    id: props.application.id,
    credit: editedApplication.value.credit,
  })
  isEditing.value = false
}

const startEditingParticipant = (participant) => {
  editingParticipant.value = participant.id
  participantCredits.value[participant.id] = participant.cpd_credits || 0
}

const cancelEditingParticipant = () => {
  editingParticipant.value = null
  participantCredits.value = {}
}

const saveParticipant = (participant) => {
  const credits = Number(participantCredits.value[participant.id])
  if (isNaN(credits) || credits < 0) {
    participantCredits.value[participant.id] = 0
  }

  emit('updateParticipant', {
    id: participant.id,
    cpd_credits: participantCredits.value[participant.id],
    review_status: 'Approved'
  })

  editingParticipant.value = null
  participantCredits.value = {}
}

const approveApplication = () => {
  if (approvalCredits.value < 0) {
    approvalCredits.value = 0
  }

  emit('approve', {
    id: props.application.id,
    credit: approvalCredits.value,
    status: 'approved', // Changed to use status field
    is_draft: false,
    remarks: approvalMessage.value || 'Application approved',
  })
  showApprovalForm.value = false
  approvalMessage.value = ''
}

const rejectApplication = () => {
  if (!rejectionMessage.value.trim()) {
    rejectionError.value = 'Please provide a reason for rejection'
    return
  }
  rejectionError.value = ''

  emit('reject', {
    id: props.application.id,
    status: 'regretted', // Changed to use status field
    is_draft: false,
    remarks: rejectionMessage.value,
  })
  showRejectionForm.value = false
  rejectionMessage.value = ''
}

const handleApprovalClick = () => {
  showApprovalForm.value = true
  showRejectionForm.value = false
}

const handleRejectionClick = () => {
  showRejectionForm.value = true
  showApprovalForm.value = false
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
