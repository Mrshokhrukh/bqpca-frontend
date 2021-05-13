<!-- EcpfApplicationModal.vue (Template Part) -->
<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModalHandler" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-start justify-center p-4 sm:pt-12">
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
              class="w-full w-full transform overflow-hidden rounded-2xl bg-gray-50 shadow-2xl transition-all max-h-screen sm:max-h-[calc(100vh-80px)] overflow-y-auto"
            >
              <!-- Application Header -->
              <div
                v-if="application"
                class="px-8 py-6 bg-gradient-to-r from-indigo-500 to-blue-600 text-white"
              >
                <div class="flex justify-between items-center">
                  <div>
                    <h2 class="text-2xl font-bold tracking-tight">
                      {{ application.ecpfProposalDetails?.firmName || 'Application Details' }}
                    </h2>
                    <p class="mt-1 text-white/90">Application ID: {{ application.cidNo }}</p>
                  </div>

                  <div class="flex items-center space-x-4">
                    <!-- Edit Button -->
                    <button
                      type="button"
                      class="rounded-md text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                      @click="editApplicationHandler"
                      aria-label="Edit application details"
                    >
                      <PencilIcon class="h-5 w-5" aria-hidden="true" />
                    </button>

                    <!-- Status Indicator -->
                    <div class="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                      <span class="flex items-center">
                        <span class="h-3 w-3 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                        <span class="font-medium">{{ getApplicationStatus }}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="application" class="px-8 py-6 bg-white">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <!-- Left Column -->
                  <div class="lg:col-span-1 space-y-6">
                    <!-- Personal Information -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    >
                      <div class="p-6">
                        <div class="flex items-center mb-4">
                          <div class="bg-blue-100 p-2 rounded-md">
                            <UserIcon class="h-5 w-5 text-blue-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">Personal Information</h4>
                        </div>
                        <p>
                          <strong>CID No.:</strong>
                          {{ application.cidNo }}
                        </p>
                        <p>
                          <strong>Applicant's Name:</strong>
                          {{ application.applicantName }}
                        </p>
                        <p>
                          <strong>Gender:</strong>
                          {{ application.gender }}
                        </p>
                        <p>
                          <strong>Date of Birth:</strong>
                          {{ application.dateOfBirth }}
                        </p>
                        <p>
                          <strong>Contact No.:</strong>
                          {{ application.contactNo }}
                        </p>
                        <p>
                          <strong>Email Address:</strong>
                          {{ application.emailAddress }}
                        </p>
                      </div>
                    </div>

                    <!-- Contact Information -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    >
                      <div class="p-6">
                        <div class="flex items-center mb-4">
                          <div class="bg-indigo-100 p-2 rounded-md">
                            <MapPinIcon class="h-5 w-5 text-indigo-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">Contact Information</h4>
                        </div>
                        <p><strong>Present Address:</strong></p>
                        <p>
                          Office Number:
                          {{ application.presentAddress?.officeNumber }}
                        </p>
                        <!-- Optional Chaining -->
                        <p>
                          Flat No:
                          {{ application.presentAddress?.flatNo }}
                        </p>
                        <!-- Optional Chaining -->
                        <p>
                          Building No:
                          {{ application.presentAddress?.buildingNo }}
                        </p>
                        <!-- Optional Chaining -->
                        <p>
                          Location:
                          {{ application.presentAddress?.location }}
                        </p>
                        <!-- Optional Chaining -->
                        <p>
                          Gewog/Throm:
                          {{ application.presentAddress?.gewogThrom }}
                        </p>
                        <!-- Optional Chaining -->
                        <p>
                          Dzongkhag/Thromde:
                          {{ application.presentAddress?.dzongkhagThromde }}
                        </p>
                        <!-- Optional Chaining -->
                        <br />
                        <p><strong>Permanent Address:</strong></p>
                        <p>
                          Village/Chiwog:
                          {{ application.permanentAddress?.villageChiwog }}
                        </p>
                        <!-- Optional Chaining -->
                        <p>Gewog: {{ application.permanentAddress?.gewog }}</p>
                        <!-- Optional Chaining -->
                        <p>
                          Dungkhag:
                          {{ application.permanentAddress?.dungkhag }}
                        </p>
                        <!-- Optional Chaining -->
                        <p>
                          Dzongkhag/Thromde:
                          {{ application.permanentAddress?.dzongkhagThromde }}
                        </p>
                        <!-- Optional Chaining -->
                      </div>
                    </div>

                    <!-- Timeline Card (New) -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    >
                      <div class="p-6">
                        <div class="flex items-center mb-4">
                          <div class="bg-purple-100 p-2 rounded-md">
                            <ClockIcon class="h-5 w-5 text-purple-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">Application Timeline</h4>
                        </div>
                        <div class="space-y-4">
                          <div class="relative pl-6 pb-4 border-l-2 border-green-500">
                            <div
                              class="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-green-500"
                            ></div>
                            <p class="text-sm font-medium text-green-600">Application Created</p>
                            <p class="text-xs text-gray-500">
                              {{ formatDate(application.createdAt || new Date()) }}
                            </p>
                          </div>
                          <div
                            v-if="application.verificationStatus"
                            class="relative pl-6 pb-4 border-l-2 border-blue-500"
                          >
                            <div
                              class="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-blue-500"
                            ></div>
                            <p class="text-sm font-medium text-blue-600">
                              Verification
                              {{ application.verificationStatus }}
                            </p>
                            <p class="text-xs text-gray-500">
                              {{ formatDate(application.verificationDate || new Date()) }}
                            </p>
                          </div>
                          <div
                            v-if="application.evaluationStatus"
                            class="relative pl-6 border-l-2 border-purple-500"
                          >
                            <div
                              class="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-purple-500"
                            ></div>
                            <p class="text-sm font-medium text-purple-600">
                              Evaluation
                              {{ application.evaluationStatus }}
                            </p>
                            <p class="text-xs text-gray-500">
                              {{ formatDate(application.evaluationDate || new Date()) }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Right Column -->
                  <div class="lg:col-span-2 space-y-6">
                    <!-- Application Details Section -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    >
                      <div class="p-6">
                        <div class="flex items-center mb-4">
                          <div class="bg-green-100 p-2 rounded-md">
                            <DocumentTextIcon class="h-5 w-5 text-green-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">Application Details</h4>
                        </div>

                        <!-- Tab Navigation (New) -->
                        <div class="border-b border-gray-200 mb-6">
                          <nav class="-mb-px flex space-x-6">
                            <button
                              v-for="(tab, index) in tabs"
                              :key="index"
                              @click="activeTab = tab.id"
                              class="py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap"
                              :class="[
                                activeTab === tab.id
                                  ? 'border-blue-500 text-blue-600'
                                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                              ]"
                            >
                              {{ tab.name }}
                            </button>
                          </nav>
                        </div>

                        <!-- Education Tab -->
                        <div v-if="activeTab === 'education'" class="space-y-4">
                          <p><strong>Education Details:</strong></p>
                          <p>
                            Qualification:
                            {{ application.educationDetails?.qualification }}
                          </p>
                          <!-- Optional Chaining -->
                          <p>
                            Institute Name:
                            {{ application.educationDetails?.instituteName }}
                          </p>
                          <!-- Optional Chaining -->
                          <p>
                            University Name:
                            {{ application.educationDetails?.universityName }}
                          </p>
                          <!-- Optional Chaining -->
                        </div>

                        <!-- Proposal Tab -->
                        <div v-if="activeTab === 'proposal'" class="space-y-4">
                          <p><strong>ECPF Proposal Details:</strong></p>
                          <p>
                            Firm Name:
                            {{ application.ecpfProposalDetails?.firmName }}
                          </p>
                          <!-- Optional Chaining -->
                          <p>
                            Firm Address:
                            {{ application.ecpfProposalDetails?.firmAddress }}
                          </p>
                          <!-- Optional Chaining -->
                          <p>
                            Firm Location:
                            {{ application.ecpfProposalDetails?.firmLocation }}
                          </p>
                          <!-- Optional Chaining -->
                          <p>
                            Firm Type:
                            {{ application.ecpfProposalDetails?.firmType }}
                          </p>
                          <!-- Optional Chaining -->

                          <div class="mt-6">
                            <p>
                              <strong>Purpose of Establishment:</strong>
                            </p>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                              <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                <h5 class="text-yellow-800 font-medium mb-2">Vision</h5>
                                <p class="text-sm text-gray-700">
                                  {{ application.purposeOfEstablishment?.vision }}
                                </p>
                                <!-- Optional Chaining -->
                              </div>
                              <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <h5 class="text-blue-800 font-medium mb-2">Mission</h5>
                                <p class="text-sm text-gray-700">
                                  {{ application.purposeOfEstablishment?.mission }}
                                </p>
                                <!-- Optional Chaining -->
                              </div>
                              <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                                <h5 class="text-green-800 font-medium mb-2">Objective</h5>
                                <p class="text-sm text-gray-700">
                                  {{ application.purposeOfEstablishment?.objective }}
                                </p>
                                <!-- Optional Chaining -->
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- HR Tab -->
                        <div v-if="activeTab === 'hr'" class="space-y-4">
                          <div class="flex justify-between items-center">
                            <p><strong>Human Resources:</strong></p>
                          </div>

                          <div
                            v-if="application.humanResource && application.humanResource.length > 0"
                            class="grid grid-cols-1 md:grid-cols-2 gap-4"
                          >
                            <div
                              v-for="(hr, index) in application.humanResource"
                              :key="index"
                              class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all"
                            >
                              <p class="font-medium text-blue-700">
                                {{ hr.position }}
                              </p>
                              <p>
                                <span class="text-gray-600">Name:</span>
                                {{ hr.fullName }}
                              </p>
                              <p>
                                <span class="text-gray-600">CID:</span>
                                {{ hr.cid }}
                              </p>
                              <p>
                                <span class="text-gray-600">Qualification:</span>
                                {{ hr.qualification }}
                              </p>
                              <p>
                                <span class="text-gray-600">Contact:</span>
                                {{ hr.contactNumber }}
                              </p>
                              <p>
                                <span class="text-gray-600">Email:</span>
                                {{ hr.emailAddress }}
                              </p>
                            </div>
                          </div>
                          <div v-else>
                            <p class="text-center py-6 text-gray-500 italic">
                              No Human Resources Added.
                            </p>
                          </div>
                        </div>

                        <!-- Finance & Services Tab -->
                        <div v-if="activeTab === 'finance'" class="space-y-4">
                          <p><strong>Finance Plan:</strong></p>
                          <div class="bg-white rounded-lg border border-gray-200 p-4">
                            <p>
                              {{ application.financePlan?.details }}
                            </p>
                            <!-- Optional Chaining -->
                          </div>

                          <p><strong>Services:</strong></p>
                          <div
                            v-if="application.services && application.services.length > 0"
                            class="grid grid-cols-1 md:grid-cols-2 gap-4"
                          >
                            <div
                              v-for="(service, index) in application.services"
                              :key="index"
                              class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all"
                            >
                              <p class="font-medium text-indigo-700">
                                {{ service.category }}
                              </p>
                              <p class="text-gray-700">
                                {{ service.details }}
                              </p>
                            </div>
                          </div>
                          <div v-else>
                            <p class="text-center py-6 text-gray-500 italic">No Services Added.</p>
                          </div>
                        </div>

                        <!-- SWOT Tab -->
                        <div v-if="activeTab === 'swot'" class="space-y-4">
                          <p><strong>SWOT Analysis:</strong></p>
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                              <h5 class="text-green-800 font-medium mb-2">Strengths</h5>
                              <p class="text-sm text-gray-700">
                                {{ application.swotAnalysis?.strengths }}
                              </p>
                              <!-- Optional Chaining -->
                            </div>
                            <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                              <h5 class="text-red-800 font-medium mb-2">Weaknesses</h5>
                              <p class="text-sm text-gray-700">
                                {{ application.swotAnalysis?.weaknesses }}
                              </p>
                              <!-- Optional Chaining -->
                            </div>
                            <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <h5 class="text-blue-800 font-medium mb-2">Opportunities</h5>
                              <p class="text-sm text-gray-700">
                                {{ application.swotAnalysis?.opportunities }}
                              </p>
                              <!-- Optional Chaining -->
                            </div>
                            <div class="bg-orange-50 p-4 rounded-lg border border-orange-200">
                              <h5 class="text-orange-800 font-medium mb-2">Threats</h5>
                              <p class="text-sm text-gray-700">
                                {{ application.swotAnalysis?.threats }}
                              </p>
                              <!-- Optional Chaining -->
                            </div>
                          </div>
                        </div>

                        <!-- Fees & Guarantor Tab -->
                        <div v-if="activeTab === 'fees'" class="space-y-4">
                          <p><strong>Fee & Charges:</strong></p>
                          <div
                            v-if="application.feeCharges && application.feeCharges.length > 0"
                            class="bg-white rounded-lg border border-gray-200 overflow-hidden"
                          >
                            <table class="min-w-full divide-y divide-gray-200">
                              <thead class="bg-gray-50">
                                <tr>
                                  <th
                                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Fee Breakup
                                  </th>
                                  <th
                                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Description
                                  </th>
                                  <th
                                    class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Amount
                                  </th>
                                </tr>
                              </thead>
                              <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-for="(fee, index) in application.feeCharges" :key="index">
                                  <td class="px-4 py-3 text-sm text-gray-900">
                                    {{ fee.breakup }}
                                  </td>
                                  <td class="px-4 py-3 text-sm text-gray-900">
                                    {{ fee.description }}
                                  </td>
                                  <td class="px-4 py-3 text-sm text-gray-900 text-right">
                                    {{ fee.amount }}
                                  </td>
                                </tr>
                                <tr class="bg-gray-50">
                                  <td
                                    colspan="2"
                                    class="px-4 py-3 text-sm font-medium text-gray-900 text-right"
                                  >
                                    Total Amount:
                                  </td>
                                  <td
                                    class="px-4 py-3 text-sm font-medium text-gray-900 text-right"
                                  >
                                    {{ application.feeCharges[0]?.totalAmount }}
                                  </td>
                                  <!-- Optional Chaining -->
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div v-else>
                            <p class="text-center py-6 text-gray-500 italic">
                              No Fee Charges Added.
                            </p>
                          </div>

                          <p><strong>Guarantor Details:</strong></p>
                          <div
                            class="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4"
                          >
                            <p>
                              <span class="text-gray-600">Full Name:</span>
                              {{ application.guarantorDetails?.fullName }}
                            </p>
                            <!-- Optional Chaining -->
                            <p>
                              <span class="text-gray-600">CID Number:</span>
                              {{ application.guarantorDetails?.cidNumber }}
                            </p>
                            <!-- Optional Chaining -->
                            <p>
                              <span class="text-gray-600">Relation:</span>
                              {{ application.guarantorDetails?.relation }}
                            </p>
                            <!-- Optional Chaining -->
                            <p>
                              <span class="text-gray-600">Contact Number:</span>
                              {{ application.guarantorDetails?.contactNumber }}
                            </p>
                            <!-- Optional Chaining -->
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Decision Forms -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    >
                      <div class="p-6 border-b border-gray-200">
                        <div class="flex items-center mb-4">
                          <div class="bg-purple-100 p-2 rounded-md">
                            <CheckBadgeIcon class="h-5 w-5 text-purple-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">Verification Decision</h4>
                        </div>
                        <div class="mt-2">
                          <label
                            for="verificationDecision"
                            class="block text-sm font-medium text-gray-700"
                            >Verification Decision:</label
                          >
                          <select
                            id="verificationDecision"
                            v-model="verificationForm.verificationDecision"
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="">Select Decision</option>
                            <option value="Accepted for presentation">
                              Accepted for presentation
                            </option>
                            <option value="Reject">Reject</option>
                          </select>
                        </div>
                        <div v-if="verificationForm.verificationDecision === 'Reject'" class="mt-2">
                          <label for="regretReason" class="block text-sm font-medium text-gray-700"
                            >Regret Reason:</label
                          >
                          <textarea
                            id="regretReason"
                            v-model="verificationForm.regretReason"
                            rows="2"
                            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                          ></textarea>
                        </div>
                        <div class="mt-4 flex justify-end space-x-2">
                          <button
                            type="button"
                            class="rounded-md px-4 py-2 font-semibold text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all"
                            @click="saveVerificationDecision('Approved')"
                          >
                            <CheckIcon class="h-4 w-4 inline-block mr-1" />
                            Approve
                          </button>
                          <button
                            type="button"
                            class="rounded-md px-4 py-2 font-semibold text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all"
                            @click="confirmRejectVerification"
                          >
                            <XMarkIcon class="h-4 w-4 inline-block mr-1" />
                            Reject
                          </button>
                        </div>
                      </div>

                      <div class="p-6 border-b border-gray-200">
                        <div class="flex items-center mb-4">
                          <div class="bg-amber-100 p-2 rounded-md">
                            <DocumentCheckIcon class="h-5 w-5 text-amber-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">Evaluation Decision</h4>
                        </div>
                        <div class="mt-2">
                          <label
                            for="evaluationDecision"
                            class="block text-sm font-medium text-gray-700"
                            >Evaluation Decision:</label
                          >
                          <select
                            id="evaluationDecision"
                            v-model="evaluationForm.evaluationDecision"
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="">Select Decision</option>
                            <option value="Accepted & Forward">Accepted & Forward</option>
                            <option value="Pending">Pending Changes</option>
                            <option value="Reject">Reject</option>
                          </select>
                        </div>
                        <div v-if="evaluationForm.evaluationDecision === 'Reject'" class="mt-2">
                          <label
                            for="evaluationRegretReason"
                            class="block text-sm font-medium text-gray-700"
                            >Regret Reason:</label
                          >
                          <textarea
                            id="evaluationRegretReason"
                            v-model="evaluationForm.regretReason"
                            rows="2"
                            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                          ></textarea>
                        </div>
                        <div class="mt-4 flex justify-end space-x-2">
                          <button
                            type="button"
                            class="rounded-md px-4 py-2 font-semibold text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all"
                            @click="saveEvaluationDecision('Approved')"
                          >
                            <CheckIcon class="h-4 w-4 inline-block mr-1" />
                            Approve
                          </button>
                          <button
                            type="button"
                            class="rounded-md px-4 py-2 font-semibold text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all"
                            @click="confirmRejectEvaluation"
                          >
                            <XMarkIcon class="h-4 w-4 inline-block mr-1" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- MoU & Undertaking Signing Form -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    >
                      <div class="p-6">
                        <div class="flex items-center mb-4">
                          <div class="bg-green-100 p-2 rounded-md">
                            <DocumentDuplicateIcon class="h-5 w-5 text-green-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">
                            MoU & Undertaking Signing
                          </h4>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          <div>
                            <label for="licenseName" class="block text-sm font-medium text-gray-700"
                              >License Name:</label
                            >
                            <input
                              type="text"
                              id="licenseName"
                              v-model="mouForm.licenseName"
                              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              for="licenseNumber"
                              class="block text-sm font-medium text-gray-700"
                              >License Number:</label
                            >
                            <input
                              type="text"
                              id="licenseNumber"
                              v-model="mouForm.licenseNumber"
                              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              for="licenseValidity"
                              class="block text-sm font-medium text-gray-700"
                              >License Validity (Years):</label
                            >
                            <input
                              type="number"
                              id="licenseValidity"
                              v-model="mouForm.licenseValidity"
                              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label for="mouSignDate" class="block text-sm font-medium text-gray-700"
                              >MoU Sign Date:</label
                            >
                            <input
                              type="date"
                              id="mouSignDate"
                              v-model="mouForm.mouSignDate"
                              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label
                              for="mouValidityDate"
                              class="block text-sm font-medium text-gray-700"
                              >MoU Validity Date:</label
                            >
                            <input
                              type="date"
                              id="mouValidityDate"
                              v-model="mouForm.mouValidityDate"
                              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        <div class="mt-6 flex justify-end space-x-2">
                          <button
                            type="button"
                            class="rounded-md px-6 py-2 font-semibold text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all"
                            @click="completeRegistrationHandler"
                          >
                            <DocumentArrowDownIcon class="h-4 w-4 inline-block mr-1" />
                            Complete Registration
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer buttons -->
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all"
                  @click="closeModalHandler"
                >
                  <XMarkIcon class="h-4 w-4 inline-block mr-1" />
                  Close
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<!-- EcpfApplicationModal.vue (Script Part) -->
<script setup>
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { ref, computed } from 'vue'
import {
  UserIcon,
  MapPinIcon,
  ClockIcon,
  DocumentTextIcon,
  CheckBadgeIcon,
  DocumentCheckIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  XMarkIcon,
  DocumentArrowDownIcon,
  PencilIcon, // Import Pencil Icon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: Boolean,
  application: {
    type: Object,
    default: () => null,
  },
  personnelCategories: {
    type: Array,
    default: () => [],
  },
  personnelSubcategories: {
    type: Array,
    default: () => [],
  },
  sectors: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits([
  'close',
  'update',
  'update-verification',
  'update-evaluation',
  'update-mou',
  'edit',
]) // Add 'edit' event

const activeTab = ref('proposal') // Default to proposal tab

const closeModal = () => {
  emit('close')
}
const closeModalHandler = () => {
  console.log('Closing modal')
  emit('close')
}

const editApplicationHandler = () => {
  console.log('Edit Application Handler called')
  emit('edit', props.application) // Emit 'edit' event with application data
  closeModal() // Close the modal after emitting edit event (optional, depends on desired behavior)
}

// Form Data for Verification, Evaluation, and MoU (local to Modal)
const verificationForm = ref({
  verificationDecision: '',
  regretReason: '',
})

const evaluationForm = ref({
  evaluationDecision: '',
  regretReason: '',
})

const mouForm = ref({
  licenseName: '',
  licenseNumber: '',
  licenseValidity: null,
  mouSignDate: '',
  mouValidityDate: '',
})

const saveVerificationDecision = (action) => {
  console.log('saveVerificationDecision called with action:', action) // Debugging
  if (action === 'Approved' || verificationForm.value.verificationDecision !== 'Reject') {
    console.log(
      'Verification Decision Saved:',
      verificationForm.value,
      'Action:',
      action,
      'for CID:',
      props.application.cidNo,
    )
    emit('update-verification', {
      cidNo: props.application.cidNo,
      verificationData: { ...verificationForm.value, verificationStatus: action },
    })
    closeModal()
  } else if (verificationForm.value.verificationDecision === 'Reject') {
    console.log(
      'Verification Rejected:',
      verificationForm.value,
      'Action: Rejected',
      'for CID:',
      props.application.cidNo,
    )
    emit('update-verification', {
      cidNo: props.application.cidNo,
      verificationData: { ...verificationForm.value, verificationStatus: 'Rejected' },
    })
    closeModal()
  }
}

const confirmRejectVerification = () => {
  console.log('confirmRejectVerification called') // Debugging
  if (confirm('Are you sure you want to reject this verification?')) {
    saveVerificationDecision('Rejected')
  }
}

const saveEvaluationDecision = (action) => {
  console.log('saveEvaluationDecision called with action:', action)
  if (action === 'Approved' || evaluationForm.value.evaluationDecision !== 'Reject') {
    console.log(
      'Evaluation Decision Saved:',
      evaluationForm.value,
      'Action:',
      action,
      'for CID:',
      props.application.cidNo,
    )
    emit('update-evaluation', {
      cidNo: props.application.cidNo,
      evaluationData: { ...evaluationForm.value, evaluationStatus: action },
    })
    closeModal()
  } else if (evaluationForm.value.evaluationDecision === 'Reject') {
    console.log(
      'Evaluation Rejected:',
      evaluationForm.value,
      'Action: Rejected',
      'for CID:',
      props.application.cidNo,
    )
    emit('update-evaluation', {
      cidNo: props.application.cidNo,
      evaluationData: { ...evaluationForm.value, evaluationStatus: 'Rejected' },
    })
    closeModal()
  }
}

const confirmRejectEvaluation = () => {
  console.log('confirmRejectEvaluation called')
  if (confirm('Are you sure you want to reject this evaluation?')) {
    saveEvaluationDecision('Rejected')
  }
}

const completeRegistrationHandler = () => {
  console.log('completeRegistrationHandler called')
  completeRegistration()
}

const completeRegistration = () => {
  // Complete Registration Logic (backend call)
  console.log(
    'Registration Completed with MoU details:',
    mouForm.value,
    'for CID:',
    props.application.cidNo,
  )
  emit('update-mou', { cidNo: props.application.cidNo, mouData: mouForm.value })
  closeModal()
}

// Helper function for formatting dates
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString(undefined, options)
}

//Computed property to get Application Status.
const getApplicationStatus = computed(() => {
  // Default Status
  let status = 'Pending'
  if (
    props.application &&
    props.application.verificationStatus === 'Approved' &&
    props.application.evaluationStatus === 'Approved'
  ) {
    status = 'Approved'
  } else if (
    props.application &&
    (props.application.verificationStatus === 'Rejected' ||
      props.application.evaluationStatus === 'Rejected')
  ) {
    status = 'Rejected'
  }
  return status
})

// Tab data
const tabs = ref([
  { id: 'proposal', name: 'Proposal' },
  { id: 'education', name: 'Education' },
  { id: 'hr', name: 'HR' },
  { id: 'finance', name: 'Finance' },
  { id: 'swot', name: 'SWOT' },
  { id: 'fees', name: 'Fees & Guarantor' },
])
</script>

<style scoped>
/* Modal Styles - Keep these styles in the modal component */
.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-height: 80%;
  overflow-y: auto;
  border-radius: 5px;
  position: relative;
}

.close-button {
  color: #aaa;
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close-button:hover,
.close-button:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.application-details section {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.application-details h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
}

.application-details p {
  margin: 5px 0;
}

.dealing-officer-actions {
  /* This is not used in the new modal template */
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ccc;
}

.dealing-officer-actions h3 {
  /* This is not used in the new modal template */
  margin-top: 0;
  margin-bottom: 15px;
}

.action-group {
  /* This is not used in the new modal template */
  margin-bottom: 10px;
}

.action-group label {
  /* This is not used in the new modal template */
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.action-group select, /* This is not used in the new modal template */
.action-group textarea {
  /* This is not used in the new modal template */
  width: calc(100% - 16px); /* Adjust width for padding */
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; /* To include padding and border in element's total width and height */
}

.action-buttons {
  /* This is not used in the new modal template */
  margin-top: 15px;
  text-align: right;
}
</style>
