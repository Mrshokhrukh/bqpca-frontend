<template>
  <Transition
    enter-active-class="transform transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    enter-to-class="opacity-100 translate-y-0 sm:scale-100"
    leave-active-class="transform transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0 sm:scale-100"
    leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  >
    <div
      v-if="showModal"
      @click="handleBackdropClick"
      class="fixed z-50 inset-0 overflow-y-auto backdrop-blur-md bg-gray-900/75 flex items-start justify-center sm:py-12"
    >
      <div
        class="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl m-4 max-h-[90vh] flex flex-col border border-gray-200/75"
        @click.stop
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between p-5 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50"
        >
          <div class="flex items-center gap-4">
            <div class="p-2.5 sm:p-3 rounded-xl shadow-sm" :class="headerColorClass">
              <component :is="modalIcons[modalType]" class="w-5 h-5 sm:w-6 sm:h-6" :class="headerIconClass" />
            </div>
            <div>
              <h3 class="text-lg sm:text-xl font-semibold text-gray-800">{{ modalTitle }}</h3>
              <p v-if="modalDescription" class="text-xs sm:text-sm text-gray-500 mt-1">{{ modalDescription }}</p>
            </div>
          </div>
          <button
            @click="closeModal"
            class="rounded-full p-2 hover:bg-gray-100 active:bg-gray-200 transition-all duration-150 group"
          >
            <XIcon class="w-5 h-5 text-gray-400 group-hover:text-gray-500" />
          </button>
        </div>

        <!-- Content Area -->
        <div class="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 sm:space-y-8">
          <!-- View Mode -->
          <div v-if="modalType === 'view' || modalType === 'viewCertificate'" class="space-y-6 sm:space-y-8">
            <!-- QEC Number Display -->
            <div
              v-if="modalApplication.status === 'approved' && modalApplication.qec_number"
              class="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-xl p-6 sm:p-8 shadow-lg border border-green-200/50"
            >
              <div class="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                <div class="p-3 bg-green-100 rounded-xl shadow-sm">
                  <HashIcon class="w-6 h-6 text-green-600" />
                </div>
                <h4 class="text-md sm:text-lg font-semibold text-green-800">QEC Number</h4>
              </div>
              <div
                class="bg-white/80 p-4 sm:p-6 rounded-xl border border-green-200 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm gap-3 sm:gap-4"
              >
                <span class="text-2xl sm:text-3xl font-bold text-green-700 tracking-wider">{{
                  modalApplication.qec_number
                }}</span>
                <div
                  class="flex items-center gap-2 text-green-700 bg-green-100 py-1.5 px-3.5 rounded-full text-sm"
                >
                  <CheckCircleIcon class="w-4 h-4 sm:w-5 sm:h-5" />
                  <span class="font-medium">Verified</span>
                </div>
              </div>
            </div>

            <!-- Personal & Address Information Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <!-- Personal Information -->
              <div
                class="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-5 sm:p-6 shadow-lg border border-gray-200/50"
              >
                <div class="flex items-center gap-3 sm:gap-4 mb-5">
                  <div class="p-2.5 sm:p-3 bg-blue-100/70 rounded-xl shadow-sm">
                    <UserIcon class="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 class="text-md sm:text-lg font-semibold text-gray-800">Personal Information</h4>
                </div>
                <div class="space-y-2.5">
                  <div
                    v-for="(item, index) in personalInfo"
                    :key="`personal-${index}`"
                    class="sm:grid sm:grid-cols-3 sm:gap-x-4 py-3 border-b border-gray-200/70 last:border-b-0"
                  >
                    <div class="flex items-center text-xs sm:text-sm font-medium text-gray-500 sm:col-span-1 mb-0.5 sm:mb-0">
                      <component :is="personalInfoIcons[index]" class="w-4 h-4 text-blue-500 mr-2.5 shrink-0" />
                      {{ item.label }}
                    </div>
                    <div class="text-sm sm:text-base text-gray-700 sm:col-span-2 font-medium pl-[calc(1rem+0.625rem)] sm:pl-0">
                       {{ item.value || '-' }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Address Details & Passport Photo -->
              <div class="space-y-6 sm:space-y-8">
                <!-- Passport Photo -->
                <div
                  v-if="modalApplication.passport_size_photo"
                  class="bg-slate-50 rounded-xl shadow-lg border border-gray-200/50 overflow-hidden"
                >
                  <div class="relative aspect-[3/4] max-h-[320px] w-full flex items-center justify-center bg-gray-100">
                     <img
                      :src="modalApplication.passport_size_photo"
                      alt="Passport Photo"
                      class="w-full h-full object-cover"
                    />
                    <div class="absolute top-3 right-3 sm:top-4 sm:right-4 bg-blue-100/80 backdrop-blur-sm rounded-full p-2.5 sm:p-3 shadow-md">
                      <CameraIcon class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                  </div>
                  <div class="p-3 sm:p-4 text-center bg-gradient-to-r from-gray-100 to-slate-100 border-t border-gray-200/60">
                    <p class="text-xs sm:text-sm font-medium text-gray-700">Passport Photograph</p>
                  </div>
                </div>

                <!-- Address Details -->
                <div
                  class="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-5 sm:p-6 shadow-lg border border-gray-200/50"
                >
                  <div class="flex items-center gap-3 sm:gap-4 mb-5">
                    <div class="p-2.5 sm:p-3 bg-green-100/70 rounded-xl shadow-sm">
                      <MapPinIcon class="w-5 h-5 text-green-600" />
                    </div>
                    <h4 class="text-md sm:text-lg font-semibold text-gray-800">Address Details</h4>
                  </div>
                  <div class="space-y-2.5">
                    <div
                      v-for="(item, index) in addressInfo"
                      :key="`address-${index}`"
                      class="sm:grid sm:grid-cols-3 sm:gap-x-4 py-3 border-b border-gray-200/70 last:border-b-0"
                    >
                      <div class="flex items-center text-xs sm:text-sm font-medium text-gray-500 sm:col-span-1 mb-0.5 sm:mb-0">
                        <component :is="addressInfoIcons[index]" class="w-4 h-4 text-green-500 mr-2.5 shrink-0" />
                        {{ item.label }}
                      </div>
                      <div class="text-sm sm:text-base text-gray-700 sm:col-span-2 font-medium pl-[calc(1rem+0.625rem)] sm:pl-0">
                         {{ item.value || '-' }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Education Details -->
            <div
              class="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-5 sm:p-6 shadow-lg border border-gray-200/50"
            >
              <div class="flex items-center justify-between mb-5">
                <div class="flex items-center gap-3 sm:gap-4">
                  <div class="p-2.5 sm:p-3 bg-purple-100/70 rounded-xl shadow-sm">
                    <GraduationCapIcon class="w-5 h-5 text-purple-600" />
                  </div>
                  <h4 class="text-md sm:text-lg font-semibold text-gray-800">Education Details</h4>
                </div>
                <button
                  v-if="!isEditingEducation && (modalType === 'view' || modalType === 'viewCertificate')"
                  class="inline-flex items-center px-3.5 py-1.5 text-xs sm:text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200/70 rounded-lg transition-all duration-150"
                  @click="startEditingEducation"
                >
                  <EditIcon class="w-3.5 h-3.5 mr-1.5" />
                  Edit
                </button>
              </div>
              <!-- View Mode -->
              <div v-if="!isEditingEducation" class="space-y-2.5">
                <div
                  v-for="(item, index) in educationInfo"
                  :key="`education-${index}`"
                  class="sm:grid sm:grid-cols-3 sm:gap-x-4 py-3 border-b border-gray-200/70 last:border-b-0"
                >
                  <div class="flex items-center text-xs sm:text-sm font-medium text-gray-500 sm:col-span-1 mb-0.5 sm:mb-0">
                    <component :is="educationInfoIcons[index]" class="w-4 h-4 text-purple-500 mr-2.5 shrink-0" />
                    {{ item.label }}
                  </div>
                  <div class="text-sm sm:text-base text-gray-700 sm:col-span-2 font-medium pl-[calc(1rem+0.625rem)] sm:pl-0">
                    <template v-if="item.isLink && item.value">
                      <a
                        :href="item.value"
                        target="_blank"
                        class="text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1 group"
                      >
                        <span class="truncate max-w-[200px] sm:max-w-xs group-hover:max-w-none transition-all duration-200">{{ item.value }}</span>
                        <ExternalLinkIcon class="w-3.5 h-3.5 shrink-0" />
                      </a>
                    </template>
                    <span v-else>{{ item.value || '-' }}</span>
                  </div>
                </div>
              </div>
              <!-- Edit Mode -->
              <div v-else class="space-y-5 pt-2">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
                  <div v-for="(field, index) in educationFormFields" :key="`edu-form-${index}`" class="space-y-1.5">
                    <label :for="`edu-field-${field.key}`" class="block text-xs sm:text-sm font-medium text-gray-700">
                      {{ field.label }}
                      <span v-if="field.required" class="text-red-500">*</span>
                    </label>
                    <input
                      v-if="field.type === 'text' || field.type === 'number'"
                      :id="`edu-field-${field.key}`"
                      v-model="educationForm[field.key]"
                      :type="field.type"
                      :placeholder="field.placeholder"
                      :required="field.required"
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-all duration-150"
                    />
                    <select
                      v-if="field.type === 'select' && field.options"
                      :id="`edu-field-${field.key}`"
                      v-model="educationForm[field.key]"
                      :required="field.required"
                      class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-all duration-150 appearance-none"
                    >
                      <option value="" disabled>Select {{ field.label }}</option>
                      <option v-for="option in field.options" :key="option.id" :value="option.id">
                        {{ option.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="flex justify-end gap-3 sm:gap-4 pt-2">
                  <button
                    class="inline-flex items-center px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-all duration-150 shadow-sm"
                    @click="cancelEditingEducation"
                  >
                    <XIcon class="w-4 h-4 mr-1.5" />
                    Cancel
                  </button>
                  <button
                    class="inline-flex items-center px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-all duration-150 shadow-sm"
                    @click="saveEducationChanges"
                    :disabled="isSaving"
                  >
                    <SaveIcon class="w-4 h-4 mr-1.5" />
                    {{ isSaving ? 'Saving...' : 'Save Changes' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Documents -->
            <div
              v-if="filteredDocuments.length > 0"
              class="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-5 sm:p-6 shadow-lg border border-gray-200/50"
            >
              <div class="flex items-center gap-3 sm:gap-4 mb-5">
                <div class="p-2.5 sm:p-3 bg-sky-100/70 rounded-xl shadow-sm">
                  <DocumentIcon class="w-5 h-5 text-sky-600" />
                </div>
                <h4 class="text-md sm:text-lg font-semibold text-gray-800">Uploaded Documents</h4>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div
                  v-for="doc in filteredDocuments"
                  :key="doc.key"
                  class="group flex items-center p-3.5 sm:p-4 bg-white/80 rounded-lg border border-gray-200/80 hover:border-blue-400/70 hover:shadow-md transition-all duration-150"
                >
                  <div class="p-2 bg-sky-50 rounded-lg mr-3 sm:mr-4">
                    <FileIcon class="w-4 h-4 sm:w-5 sm:h-5 text-sky-500" />
                  </div>
                  <div class="flex-1">
                    <p class="text-xs sm:text-sm font-medium text-gray-800">{{ doc.label }}</p>
                  </div>
                  <a
                    :href="modalApplication[doc.key]"
                    target="_blank"
                    class="inline-flex items-center shrink-0 px-3 py-1.5 text-xs sm:text-sm font-medium text-sky-700 bg-sky-100 hover:bg-sky-200/80 rounded-md transition-colors shadow-sm"
                  >
                    <EyeIcon class="w-3.5 h-3.5 mr-1.5" />
                    View
                  </a>
                </div>
              </div>
            </div>

            <!-- Second Copy Information -->
            <div
              v-if="modalApplication.is_second_copy"
              class="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-5 sm:p-6 shadow-lg border border-gray-200/50"
            >
              <div class="flex items-center gap-3 sm:gap-4 mb-5">
                <div class="p-2.5 sm:p-3 bg-orange-100/70 rounded-xl shadow-sm">
                  <CopyIcon class="w-5 h-5 text-orange-600" />
                </div>
                <h4 class="text-md sm:text-lg font-semibold text-gray-800">Second Copy Information</h4>
              </div>
              <div class="space-y-2.5">
                 <div v-if="modalApplication.reason_for_issue_of_second_copy" class="sm:grid sm:grid-cols-3 sm:gap-x-4 py-3 border-b border-gray-200/70 last:border-b-0">
                    <div class="flex items-center text-xs sm:text-sm font-medium text-gray-500 sm:col-span-1 mb-0.5 sm:mb-0">
                        <HelpCircleIcon class="w-4 h-4 text-orange-500 mr-2.5 shrink-0" />
                        Reason for Second Copy
                    </div>
                    <div class="text-sm sm:text-base text-gray-700 sm:col-span-2 font-medium pl-[calc(1rem+0.625rem)] sm:pl-0">
                        <span>{{ modalApplication.reason_for_issue_of_second_copy?.name || '-' }}</span>
                        <p v-if="modalApplication.reason_for_issue_of_second_copy?.definition" class="mt-1 text-xs text-gray-500 font-normal">
                           {{ modalApplication.reason_for_issue_of_second_copy?.definition }}
                        </p>
                    </div>
                </div>
                 <div v-if="modalApplication.second_copy_other" class="sm:grid sm:grid-cols-3 sm:gap-x-4 py-3 border-b border-gray-200/70 last:border-b-0">
                    <div class="flex items-center text-xs sm:text-sm font-medium text-gray-500 sm:col-span-1 mb-0.5 sm:mb-0">
                        <DocumentIcon class="w-4 h-4 text-orange-500 mr-2.5 shrink-0" />
                        Other Reason Specified
                    </div>
                    <div class="text-sm sm:text-base text-gray-700 sm:col-span-2 font-medium pl-[calc(1rem+0.625rem)] sm:pl-0">
                       {{ modalApplication.second_copy_other || '-' }}
                    </div>
                </div>
                <div class="sm:grid sm:grid-cols-3 sm:gap-x-4 py-3 border-b border-gray-200/70 last:border-b-0">
                    <div class="flex items-center text-xs sm:text-sm font-medium text-gray-500 sm:col-span-1 mb-0.5 sm:mb-0">
                        <HashIcon class="w-4 h-4 text-orange-500 mr-2.5 shrink-0" />
                        Original Copy QEC
                    </div>
                    <div class="text-sm sm:text-base text-gray-700 sm:col-span-2 font-medium pl-[calc(1rem+0.625rem)] sm:pl-0">
                       {{ modalApplication.qec_number_original_copy || 'N/A' }}
                    </div>
                </div>
              </div>

              <div v-if="modalApplication.change_details && modalApplication.change_details.length"
                class="bg-orange-50/40 p-4 rounded-lg border border-orange-200/60 mt-5 shadow-sm">
                <div class="flex items-center gap-2.5 mb-3">
                    <div class="p-1.5 bg-orange-100 rounded-md">
                    <EditIcon class="w-4 h-4 text-orange-600" />
                    </div>
                    <h5 class="text-sm sm:text-md font-semibold text-orange-700">Details Changed</h5>
                </div>
                <div class="space-y-3">
                    <div v-for="(change, index) in modalApplication.change_details" :key="`change-${index}`"
                        class="p-3 bg-white/70 rounded-md shadow-xs border border-orange-100/80">
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-2 gap-y-0.5 text-xs sm:text-sm">
                        <strong class="text-gray-500 col-span-1 sm:col-span-1">Field:</strong>
                        <span class="text-gray-700 col-span-2 sm:col-span-2 font-medium">{{ change.changed_field || '-' }}</span>

                        <strong class="text-gray-500 col-span-1 sm:col-span-1">Old Value:</strong>
                        <span class="text-gray-700 col-span-2 sm:col-span-2">{{ change.old_value || 'N/A' }}</span>

                        <strong class="text-gray-500 col-span-1 sm:col-span-1">New Value:</strong>
                        <span class="text-gray-700 col-span-2 sm:col-span-2 font-medium">{{ change.new_value || '-' }}</span>

                        <template v-if="change.other_description">
                        <strong class="text-gray-500 col-span-1 sm:col-span-1">Description:</strong>
                        <span class="text-gray-700 col-span-2 sm:col-span-2">{{ change.other_description || '-' }}</span>
                        </template>
                    </div>
                    </div>
                </div>
              </div>
            </div>

            <!-- Application Status -->
            <div
              class="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-5 sm:p-6 shadow-lg border border-gray-200/50"
            >
              <div class="flex items-center gap-3 sm:gap-4 mb-5">
                <div class="p-2.5 sm:p-3 bg-indigo-100/70 rounded-xl shadow-sm">
                  <ActivityIcon class="w-5 h-5 text-indigo-600" />
                </div>
                <h4 class="text-md sm:text-lg font-semibold text-gray-800">Application Status</h4>
              </div>
              <div class="space-y-2.5">
                <div
                  v-for="(item, index) in statusInfo"
                  :key="`status-${index}`"
                  class="sm:grid sm:grid-cols-3 sm:gap-x-4 py-3 border-b border-gray-200/70 last:border-b-0"
                >
                  <div class="flex items-center text-xs sm:text-sm font-medium text-gray-500 sm:col-span-1 mb-0.5 sm:mb-0">
                    <component :is="statusInfoIcons[index]" class="w-4 h-4 text-indigo-500 mr-2.5 shrink-0" />
                    {{ item.label }}
                  </div>
                  <div class="text-sm sm:text-base text-gray-700 sm:col-span-2 font-medium pl-[calc(1rem+0.625rem)] sm:pl-0">
                    <div v-if="item.label === 'Status'">
                      <span :class="getStatusBadgeClass(item.value)">
                        {{ formatStatus(item.value) || '-' }}
                      </span>
                    </div>
                    <span v-else>{{ item.value || '-' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Other Modal Types -->
          <div v-else class="space-y-6 sm:space-y-8">
            <!-- Add Note Form -->
            <div v-if="modalType === 'addNote'" class="space-y-1.5">
              <label for="noteText" class="block text-sm font-medium text-gray-700">Add Note</label>
              <div class="relative">
                <textarea
                  id="noteText"
                  v-model="noteText"
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-all duration-150"
                  rows="5"
                  placeholder="Enter your note here..."
                ></textarea>
                <div class="absolute right-3 bottom-2.5 text-xs text-gray-400">
                  {{ noteText.length }}/500
                </div>
              </div>
            </div>

            <!-- Assign QEC Number Form -->
            <div v-if="modalType === 'assignQEC'" class="space-y-1.5">
              <label for="qecNumber" class="block text-sm font-medium text-gray-700">QEC Number</label>
              <input
                type="text"
                id="qecNumber"
                v-model="qecNumber"
                class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-all duration-150"
                placeholder="Enter QEC Number"
              />
            </div>

            <!-- Re-upload Form -->
            <div v-if="modalType === 'reUpload'" class="space-y-5">
              <div class="space-y-1.5">
                <label for="reProcessReason" class="block text-sm font-medium text-gray-700">
                  Message for Re-upload
                </label>
                <div class="relative">
                  <textarea
                    id="reProcessReason"
                    v-model="reProcessReason"
                    class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-all duration-150"
                    rows="4"
                    placeholder="Provide a clear message for the applicant..."
                  ></textarea>
                   <div class="absolute right-3 bottom-2.5 text-xs text-gray-400">
                    {{ reProcessReason.length }}/500
                  </div>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Select Documents to Re-upload
                </label>
                <div class="space-y-2.5 bg-gray-50/70 p-4 rounded-lg border border-gray-200/80 max-h-60 overflow-y-auto">
                  <label
                    v-for="doc in documents"
                    :key="doc.key"
                    class="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-400/70 cursor-pointer transition-all duration-150 shadow-sm has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400"
                  >
                    <input
                      type="checkbox"
                      v-model="selectedDocuments"
                      :value="doc.key"
                      class="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-offset-1"
                    />
                    <span class="ml-3 text-sm font-medium text-gray-800">{{ doc.label }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Process/Regret Forms -->
            <div v-if="modalType === 'reProcess' || modalType === 'regret'" class="space-y-1.5">
              <label for="textAreaValue" class="block text-sm font-medium text-gray-700">
                {{ modalType === 'reProcess' ? 'Reason for Reprocessing' : 'Rejection Reason' }}
              </label>
              <div class="relative">
                <textarea
                  id="textAreaValue"
                  v-model="textAreaValue"
                  class="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm transition-all duration-150"
                  rows="5"
                  :placeholder="`Enter ${modalType === 'reProcess' ? 'reason for reprocessing' : 'rejection reason'} here...`"
                ></textarea>
                 <div class="absolute right-3 bottom-2.5 text-xs text-gray-400">
                    {{ textAreaValue.length }}/500
                  </div>
              </div>
            </div>

            <!-- Forward Confirmation -->
            <div
              v-if="modalType === 'forward'"
              class="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-blue-50/70 rounded-xl border border-blue-200/80 shadow-sm"
            >
              <CircleAlert class="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p class="text-blue-800 font-medium text-sm sm:text-base">
                  Are you sure you want to forward this application?
                </p>
                <p class="text-blue-700 text-xs sm:text-sm mt-1">
                  This action will move the application to the next stage of processing.
                </p>
              </div>
            </div>

            <!-- Approve Confirmation -->
            <div
              v-if="modalType === 'approve'"
              class="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-green-50/70 rounded-xl border border-green-200/80 shadow-sm"
            >
              <CheckCircleIcon class="w-6 h-6 sm:w-8 sm:h-8 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p class="text-green-800 font-medium text-sm sm:text-base">
                  Are you sure you want to approve this application?
                </p>
                <p class="text-green-700 text-xs sm:text-sm mt-1">
                  This action is final and will mark the application as approved.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="flex justify-end gap-3 sm:gap-4 p-4 sm:p-5 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50"
        >
          <button
            class="inline-flex items-center px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100/80 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-all duration-150 shadow-sm"
            @click="closeModal"
          >
            <XIcon class="w-4 h-4 mr-1.5" />
            Cancel
          </button>
          <button
            v-if="modalType !== 'view' && modalType !== 'viewCertificate'"
            class="inline-flex items-center px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-all duration-150 shadow-sm"
            @click="handleModalAction"
            :disabled="isSaving"
          >
            <component :is="actionButtonIcon" class="w-4 h-4 mr-1.5" />
            {{ isSaving ? 'Saving...' : (modalType === 'forward' ? 'Forward' : modalType === 'approve' ? 'Approve' : 'Save') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import apiService from '@/services/services'
import {
  User as UserIcon,
  MapPin as MapPinIcon,
  GraduationCap as GraduationCapIcon,
  FileText as DocumentIcon,
  File as FileIcon,
  Eye as EyeIcon,
  Activity as ActivityIcon,
  X as XIcon,
  ExternalLink as ExternalLinkIcon,
  CircleAlert as CircleAlert,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Building as BuildingIcon,
  MapPinned as MapPinnedIcon,
  School as SchoolIcon,
  Globe as GlobeIcon,
  Timer as TimerIcon,
  Hash as HashIcon,
  CheckCircle as CheckCircleIcon,
  Save as SaveIcon,
  ArrowRight as ArrowRightIcon,
  Copy as CopyIcon,
  HelpCircle as HelpCircleIcon,
  Camera as CameraIcon,
  Edit as EditIcon,
} from 'lucide-vue-next'

const props = defineProps({
  showModal: { type: Boolean, default: false },
  modalType: { type: String, default: null },
  application: { type: Object, required: true },
})

const emit = defineEmits(['close', 'update'])
const toast = useToast()

const noteText = ref('')
const selectedDocuments = ref([])
const reProcessReason = ref('')
const rejectionReason = ref('')
const qecNumber = ref('')
const isEditingEducation = ref(false)
const isSaving = ref(false)
const educationForm = ref({})
const typesOfCourse = ref([])
const qualifications = ref([])

const headerColorClass = computed(() => {
  const classes = {
    view: 'bg-blue-100/70',
    addNote: 'bg-green-100/70',
    reUpload: 'bg-yellow-100/70',
    reProcess: 'bg-purple-100/70',
    forward: 'bg-indigo-100/70',
    regret: 'bg-red-100/70',
    viewCertificate: 'bg-blue-100/70',
    assignQEC: 'bg-emerald-100/70',
    approve: 'bg-green-100/70',
  }
  return classes[props.modalType] || 'bg-gray-100/70'
})

const headerIconClass = computed(() => {
  const classes = {
    view: 'text-blue-600',
    addNote: 'text-green-600',
    reUpload: 'text-yellow-600',
    reProcess: 'text-purple-600',
    forward: 'text-indigo-600',
    regret: 'text-red-600',
    viewCertificate: 'text-blue-600',
    assignQEC: 'text-emerald-600',
    approve: 'text-green-600',
  }
  return classes[props.modalType] || 'text-gray-600'
})

const modalTitle = computed(() => {
  const titles = {
    view: 'View Application Details',
    addNote: 'Add Note',
    reUpload: 'Request Document Re-upload',
    reProcess: 'Reprocess Application',
    forward: 'Forward Application',
    regret: 'Regret Application',
    viewCertificate: 'View Certificate Details',
    assignQEC: 'Assign QEC Number',
    approve: 'Approve Application',
  }
  return titles[props.modalType] || 'Application Details'
})

const modalDescription = computed(() => {
  const descriptions = {
    view: 'Review all submitted information and documents.',
    addNote: 'Add an internal note to this application.',
    reUpload: 'Specify documents for the applicant to re-upload.',
    reProcess: 'Return application for reprocessing with comments.',
    forward: 'Confirm to move this application to the next stage.',
    regret: 'Provide a reason for regretting this application.',
    viewCertificate: 'Review certificate information.',
    assignQEC: 'Enter and save the QEC number for this application.',
    approve: 'Confirm approval of this application.',
  }
  return descriptions[props.modalType] || ''
})

const modalIcons = {
  view: UserIcon,
  addNote: DocumentIcon,
  reUpload: FileIcon,
  reProcess: ActivityIcon,
  forward: ArrowRightIcon,
  regret: XIcon,
  viewCertificate: DocumentIcon,
  assignQEC: HashIcon,
  approve: CheckCircleIcon,
}

const actionButtonIcon = computed(() => {
  const icons = {
    addNote: SaveIcon,
    assignQEC: SaveIcon,
    reUpload: SaveIcon,
    reProcess: SaveIcon,
    forward: ArrowRightIcon,
    regret: XIcon,
    approve: CheckCircleIcon,
  }
  return icons[props.modalType] || SaveIcon
})


const personalInfoIcons = [UserIcon, HashIcon, CalendarIcon, UserIcon, PhoneIcon, MailIcon]
const addressInfoIcons = [BuildingIcon, MapPinnedIcon, MapPinIcon]
const educationInfoIcons = [
  GraduationCapIcon, TimerIcon, SchoolIcon, BuildingIcon, MapPinIcon, GlobeIcon,
  HashIcon, CalendarIcon, GlobeIcon, DocumentIcon, SchoolIcon,
]
const statusInfoIcons = [
  CheckCircleIcon, ClockIcon, ClockIcon, DocumentIcon, DocumentIcon, DocumentIcon, DocumentIcon,
]

const formatDate = (dateString) => {
  if (!dateString) return null
  try {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: true
    }).replace(',', ' -')
  } catch {
    return 'Invalid Date'
  }
}

const formatStatus = (status) => {
  if (!status) return null
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const modalApplication = computed(() => props.application || {})

const personalInfo = computed(() => [
  { label: 'Applicant\'s Name', value: modalApplication.value.applicants_name },
  { label: 'CID Number', value: modalApplication.value.cid_no },
  { label: 'Date of Birth', value: modalApplication.value.date_of_birth ? new Date(modalApplication.value.date_of_birth).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric'}) : null },
  { label: 'Gender', value: modalApplication.value.gender },
  { label: 'Contact Number', value: modalApplication.value.contact_no },
  { label: 'Email Address', value: modalApplication.value.email_address },
])

const addressInfo = computed(() => [
  { label: 'Dzongkhag', value: modalApplication.value.dzongkhag },
  { label: 'Gewog', value: modalApplication.value.gewog },
  { label: 'Village', value: modalApplication.value.village },
])

const educationInfo = computed(() => [
  { label: 'Course Title', value: modalApplication.value.course_title },
  { label: 'Course Duration', value: modalApplication.value.duration_of_course ? `${modalApplication.value.duration_of_course} years` : null },
  { label: 'Institute Name', value: modalApplication.value.name_of_institute },
  { label: 'University Name', value: modalApplication.value.name_of_university },
  { label: 'Location (Institute)', value: modalApplication.value.location },
  { label: 'Country (Institute)', value: modalApplication.value.country },
  { label: 'Student ID No.', value: modalApplication.value.student_id_no },
  { label: 'Year of Completion', value: modalApplication.value.year_of_completion },
  { label: 'Institute Website', value: modalApplication.value.website, isLink: true },
  { label: 'Type of Course', value: modalApplication.value.type_of_course?.name || null },
  { label: 'Qualification Level', value: modalApplication.value.qualification?.name || null },
])

const statusInfo = computed(() => [
  { label: 'Status', value: modalApplication.value.status },
  { label: 'Created At', value: formatDate(modalApplication.value.created_at) },
  { label: 'Last Updated At', value: formatDate(modalApplication.value.updated_at) },
  { label: 'Remarks/Notes', value: modalApplication.value.remarks },
  { label: 'Dealing Officer Decision', value: modalApplication.value.dealing_officer_decision?.name || null },
  { label: 'Chief Decision', value: modalApplication.value.chief_decision?.name || null },
  { label: 'Applied From Bhutan', value: modalApplication.value.from_in_country ? 'Yes' : 'No' },
])

const documents = [
  { key: 'degree_certificate', label: 'Degree Certificate' },
  { key: 'academic_transcript', label: 'Academic Transcript' },
  // { key: 'passport_size_photo', label: 'Passport Photo' }, // Usually not listed here as it's displayed separately
  { key: 'confirmation_document', label: 'Confirmation Document (Offer Letter)' },
  { key: 'second_copy_supporting_document', label: 'Second Copy Supporting Document' },
]

const filteredDocuments = computed(() => documents.filter(doc => modalApplication.value && modalApplication.value[doc.key]))

const educationFormFields = computed(() => [
  { key: 'course_title', label: 'Course Title', type: 'text', placeholder: 'e.g., Bachelor of Science in IT', required: true },
  { key: 'duration_of_course', label: 'Duration (Years)', type: 'number', placeholder: 'e.g., 3 or 4', required: true },
  { key: 'name_of_institute', label: 'Institute', type: 'text', placeholder: 'e.g., Royal University of Bhutan', required: true },
  { key: 'name_of_university', label: 'University (if different)', type: 'text', placeholder: 'e.g., Harvard University' },
  { key: 'location', label: 'City/State of Institute', type: 'text', placeholder: 'e.g., Thimphu or California' },
  { key: 'country', label: 'Country of Institute', type: 'text', placeholder: 'e.g., Bhutan or USA', required: true },
  { key: 'student_id_no', label: 'Student ID', type: 'text', placeholder: 'Enter student ID' },
  { key: 'year_of_completion', label: 'Year of Completion', type: 'number', placeholder: 'e.g., 2023', required: true },
  { key: 'website', label: 'Institute Website', type: 'text', placeholder: 'e.g., https://www.rub.edu.bt' },
  { key: 'type_of_course', label: 'Type of Course', type: 'select', options: typesOfCourse.value, required: true },
  { key: 'qualification', label: 'Qualification Level', type: 'select', options: qualifications.value, required: true },
])

const textAreaValue = computed({
  get() {
    return props.modalType === 'reProcess' ? reProcessReason.value : rejectionReason.value
  },
  set(value) {
    if (props.modalType === 'reProcess') {
      reProcessReason.value = value
    } else {
      rejectionReason.value = value
    }
  },
})

const getStatusBadgeClass = (status) => {
  const capitalizedStatus = status ? formatStatus(status).replace(/\s+/g, '') : '' // Remove spaces for key lookup
  const baseClass = 'px-2.5 py-0.5 text-xs font-semibold rounded-full inline-block tracking-wide';
  const classes = {
    Processing: `${baseClass} bg-yellow-100 text-yellow-700 border border-yellow-200`,
    Approved: `${baseClass} bg-green-100 text-green-700 border border-green-200`,
    Rejected: `${baseClass} bg-red-100 text-red-700 border border-red-200`,
    Reprocess: `${baseClass} bg-blue-100 text-blue-700 border border-blue-200`,
    Reupload: `${baseClass} bg-purple-100 text-purple-700 border border-purple-200`,
    Regretted: `${baseClass} bg-rose-100 text-rose-700 border border-rose-200`,
  }
  return classes[capitalizedStatus] || `${baseClass} bg-gray-100 text-gray-700 border border-gray-200`
}

const fetchTypesOfCourse = async () => {
  try {
    const response = await apiService.getTypesOfCourse()
    typesOfCourse.value = response.data.results || response.data || []
  } catch (error) {
    console.error('Error fetching types of course:', error)
    toast.error('Failed to load course types.')
  }
}

const fetchQualifications = async () => {
  try {
    const response = await apiService.getQualifications()
    qualifications.value = response.data.results || response.data || []
  } catch (error) {
    console.error('Error fetching qualifications:', error)
    toast.error('Failed to load qualifications.')
  }
}

const initializeEducationForm = () => {
  educationForm.value = {
    course_title: modalApplication.value.course_title || '',
    duration_of_course: modalApplication.value.duration_of_course || '',
    name_of_institute: modalApplication.value.name_of_institute || '',
    name_of_university: modalApplication.value.name_of_university || '',
    location: modalApplication.value.location || '',
    country: modalApplication.value.country || '',
    student_id_no: modalApplication.value.student_id_no || '',
    year_of_completion: modalApplication.value.year_of_completion || '',
    website: modalApplication.value.website || '',
    type_of_course: modalApplication.value.type_of_course?.id || '',
    qualification: modalApplication.value.qualification?.id || '',
  }
}

const handleBackdropClick = (event) => {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

const startEditingEducation = () => {
  initializeEducationForm()
  isEditingEducation.value = true
}

const cancelEditingEducation = () => {
  isEditingEducation.value = false
}

const saveEducationChanges = async () => {
  const requiredFields = educationFormFields.value.filter(field => field.required)
  for (const field of requiredFields) {
    if (!educationForm.value[field.key] && educationForm.value[field.key] !== 0) { // Check for 0 in case of number fields
      toast.error(`${field.label} is required.`)
      return
    }
  }

  isSaving.value = true
  try {
    const updateData = {
      ...educationForm.value,
      modal_action: 'updateEducation',
    }
    await apiService.patchRecognitionOfQualification(modalApplication.value.id, updateData)
    toast.success('Education details updated successfully.')
    emit('update', { ...modalApplication.value, ...educationForm.value, modal_action: 'updateEducation' }) // emit full updated app
    isEditingEducation.value = false
  } catch (error) {
    console.error('Error updating education details:', error)
    const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Failed to update education details.'
    toast.error(errorMessage)
  } finally {
    isSaving.value = false
  }
}

const handleModalAction = async () => {
  isSaving.value = true
  let remarksValue = ''
  let payload = {}

  switch (props.modalType) {
    case 'addNote':
      payload = { remarks: noteText.value, modal_action: 'addNote' };
      break;
    case 'assignQEC':
      if (!qecNumber.value.trim()) {
        toast.error('QEC Number cannot be empty.');
        isSaving.value = false;
        return;
      }
      payload = { qec_number: qecNumber.value, modal_action: 'assignQEC' };
      break;
    case 'reUpload': {
      if (selectedDocuments.value.length === 0) {
        toast.error('Please select at least one document to request for re-upload.');
        isSaving.value = false;
        return;
      }
      const docLabels = selectedDocuments.value.map(key => {
        const doc = documents.find(d => d.key === key);
        return doc ? doc.label : key;
      });
      const docListString = docLabels.join(', ');
      const defaultMessage = `Please re-upload the following document(s) with better clarity: ${docListString}.`;
      remarksValue = reProcessReason.value.trim() ? `${reProcessReason.value.trim()} (Requested: ${docListString})` : defaultMessage;
      payload = { remarks: remarksValue, status: 'reupload', documents_to_reupload: selectedDocuments.value, modal_action: 'reUpload' };
      break;
    }
    case 'reProcess':
       if (!reProcessReason.value.trim()) {
        toast.error('Reason for reprocessing cannot be empty.');
        isSaving.value = false;
        return;
      }
      payload = { remarks: reProcessReason.value, status: 'reprocess', modal_action: 'reProcess' };
      break;
    case 'forward':
      payload = { forward: true, modal_action: 'forward' };
      break;
    case 'regret':
      if (!rejectionReason.value.trim()) {
        toast.error('Rejection reason cannot be empty.');
        isSaving.value = false;
        return;
      }
      payload = { chief_remarks: rejectionReason.value, status: 'regretted', modal_action: 'regret' };
      break;
    case 'approve':
      payload = { status: 'approved', modal_action: 'approve' };
      break;
    default:
      isSaving.value = false;
      return;
  }

  try {
    // Assuming your API service handles the actual HTTP request
    // For now, we just emit the event. If an API call happens here, ensure it's awaited.
    // Example: await apiService.updateApplicationStatus(modalApplication.value.id, payload);
    emit('update', { applicationId: modalApplication.value.id, ...payload });
    toast.success(`Application ${props.modalType} action processed successfully.`);
    closeModal();
  } catch (error) {
    console.error(`Error processing ${props.modalType} action:`, error);
    toast.error(error.response?.data?.detail || `Failed to process ${props.modalType} action.`);
  } finally {
    isSaving.value = false;
  }
}


const closeModal = () => {
  noteText.value = ''
  selectedDocuments.value = []
  reProcessReason.value = ''
  rejectionReason.value = ''
  qecNumber.value = ''
  isEditingEducation.value = false
  // educationForm.value = {} // Keep form data if user might reopen to edit
  emit('close')
}

watch(
  () => props.showModal,
  (newValue) => {
    if (newValue) {
      isEditingEducation.value = false; // Reset edit mode when modal opens
      if (props.modalType === 'addNote') {
        noteText.value = modalApplication.value.remarks || modalApplication.value.chief_remarks || '';
      } else {
        noteText.value = '';
      }

      if (props.modalType === 'assignQEC' && modalApplication.value.qec_number) {
        qecNumber.value = modalApplication.value.qec_number;
      } else {
        qecNumber.value = '';
      }

      if (props.modalType === 'reProcess' && modalApplication.value.remarks) {
        reProcessReason.value = modalApplication.value.remarks;
      } else {
         reProcessReason.value = '';
      }

      if (props.modalType === 'regret' && modalApplication.value.chief_remarks) {
        rejectionReason.value = modalApplication.value.chief_remarks;
      } else {
        rejectionReason.value = '';
      }

      selectedDocuments.value = []; // Clear selected documents on modal open for reUpload

      if (props.modalType === 'view' || props.modalType === 'viewCertificate' || isEditingEducation.value) {
        fetchTypesOfCourse()
        fetchQualifications()
        if(isEditingEducation.value) initializeEducationForm();
      }
    }
  },
)

watch(
  () => props.application, (newApp) => {
    if (newApp && props.showModal) {
        // If modal is open and application data changes, re-initialize relevant fields
        if (props.modalType === 'addNote') {
            noteText.value = newApp.remarks || newApp.chief_remarks || '';
        }
        if (props.modalType === 'assignQEC') {
            qecNumber.value = newApp.qec_number || '';
        }
        if (props.modalType === 'reProcess') {
            reProcessReason.value = newApp.remarks || '';
        }
        if (props.modalType === 'regret') {
            rejectionReason.value = newApp.chief_remarks || '';
        }
        // Re-initialize education form if it's in edit mode and application changes
        if (isEditingEducation.value) {
            initializeEducationForm();
        }
    }
  }, { deep: true }
)


onMounted(() => {
  if (props.showModal && (props.modalType === 'view' || props.modalType === 'viewCertificate')) {
    fetchTypesOfCourse()
    fetchQualifications()
  }
})
</script>
