<template>
  <div class="flex items-center space-x-2">
    <!-- Edit Button -->
    <button
      v-if="status === 'draft'"
      @click="showEditModal = true"
      class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <PencilIcon class="w-4 h-4 mr-1.5" />
      Edit
    </button>

    <!-- View Reason Button -->
    <button
      v-if="['regretted', 'reprocess', 'reupload'].includes(status)"
      @click="showReasonModal = true"
      class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <EyeIcon class="w-4 h-4 mr-1.5" />
      View Reason
    </button>

    <!-- View Certificate Button -->
    <button
      v-if="status === 'approved'"
      @click="showCertificateModal = true"
      class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <EyeIcon class="w-4 h-4 mr-1.5" />
      View & Download Certificate
    </button>

    <!-- Disabled State Button -->
    <button
      v-if="['under_review', 'processing', 'applied'].includes(status)"
      class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed transition-all duration-200"
    >
      <ClockIcon class="w-4 h-4 mr-1.5" />
      In Progress
    </button>

    <!-- Edit Modal -->
    <TransitionRoot appear :show="showEditModal" as="template">
      <Dialog as="div" @close="showEditModal = false" class="relative z-50">
        <TransitionChild
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-2xl bg-white rounded-xl p-6 shadow-xl">
                <div class="flex items-center justify-between mb-4">
                  <DialogTitle class="text-lg font-medium text-gray-900">
                    Edit Application
                  </DialogTitle>
                  <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-500">
                    <XMarkIcon class="w-6 h-6" />
                  </button>
                </div>
                <!-- ApplicationForm with initial data -->
                <ApplicationForm
                  :initial-data="application"
                  mode="edit"
                  @submitted="handleEditSubmit"
                  @close="showEditModal = false"
                />
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- View Reason Modal -->
    <TransitionRoot appear :show="showReasonModal" as="template">
      <Dialog as="div" @close="showReasonModal = false" class="relative z-50">
        <!-- Backdrop with enhanced blur effect -->
        <TransitionChild
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-3xl bg-white rounded-2xl shadow-2xl">
                <!-- Header with gradient background -->
                <div class="bg-gradient-to-r from-slate-200 to-slate-300 rounded-t-2xl p-6">
                  <div class="flex items-center justify-between">
                    <DialogTitle class="text-xl font-semibold text-grey flex items-center">
                      <ClipboardDocumentCheckIcon class="w-6 h-6 mr-2" />
                      Application Status Details
                    </DialogTitle>
                    <button
                      @click="showReasonModal = false"
                      class="text-grey/80 hover:text-grey transition-colors p-1 hover:bg-white/10 rounded-full"
                    >
                      <XMarkIcon class="w-6 h-6" />
                    </button>
                  </div>
                  <!-- Application meta info -->
                  <div class="mt-4 flex items-center space-x-4 text-grey/90">
                    <div class="flex items-center">
                      <CalendarIcon class="w-4 h-4 mr-1.5" />
                      {{ formatDate(application.submission_date) }}
                    </div>
                    <div class="flex items-center">
                      <DocumentIcon class="w-4 h-4 mr-1.5" />
                      ID: {{ application.id }}
                    </div>
                    <div
                      :class="{
                        'px-2 py-0.5 rounded-full text-sm': true,
                        'bg-yellow-500/20': status === 'reprocess',
                        'bg-red-500/20': status === 'regretted',
                        'bg-purple-500/20': status === 'reupload',
                      }"
                    >
                      {{ formatStatus(status) }}
                    </div>
                  </div>
                </div>

                <!-- Content section -->
                <div class="p-6">
                  <!-- Timeline section -->
                  <div class="mb-6">
                    <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                      Review Timeline
                    </h4>
                    <div class="space-y-4">
                      <div v-if="application.dealing_officer_remarks" class="flex">
                        <div class="flex-shrink-0">
                          <div
                            class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full"
                          >
                            <UserIcon class="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="flex items-center">
                            <h4 class="text-sm font-medium text-gray-900">
                              Dealing Officer Review
                            </h4>
                            <span class="ml-2 text-xs text-gray-500">{{
                              formatDate(application.dealing_officer_date)
                            }}</span>
                          </div>
                          <div class="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <p class="text-gray-600">{{ application.dealing_officer_remarks }}</p>
                          </div>
                        </div>
                      </div>

                      <div v-if="application.chief_remarks" class="flex">
                        <div class="flex-shrink-0">
                          <div
                            class="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full"
                          >
                            <UserCircleIcon class="w-4 h-4 text-purple-600" />
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="flex items-center">
                            <h4 class="text-sm font-medium text-gray-900">Chief Officer Review</h4>
                            <span class="ml-2 text-xs text-gray-500">{{
                              formatDate(application.chief_date)
                            }}</span>
                          </div>
                          <div class="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <p class="text-gray-600">{{ application.chief_remarks }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Required Actions (if any) -->
                  <div
                    v-if="getRequiredActions(status)"
                    class="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4"
                  >
                    <div class="flex">
                      <ExclamationTriangleIcon class="w-5 h-5 text-amber-500 mr-2" />
                      <div>
                        <h4 class="text-sm font-medium text-amber-800">Required Actions</h4>
                        <p class="mt-1 text-sm text-amber-700">{{ getRequiredActions(status) }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer -->
                <div class="border-t border-gray-100 p-6 bg-gray-50 rounded-b-2xl">
                  <div class="flex justify-end space-x-3">
                    <button
                      @click="showReasonModal = false"
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                    >
                      Close
                    </button>
                    <button
                      v-if="['reprocess', 'reupload'].includes(status)"
                      class="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
                    >
                      Take Action
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- View Certificate Modal -->
    <TransitionRoot appear :show="showCertificateModal" as="template">
      <Dialog as="div" @close="showCertificateModal = false" class="relative z-50">
        <TransitionChild
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-3xl bg-white rounded-2xl p-8 shadow-xl">
                <div class="flex justify-between items-center mb-6">
                  <DialogTitle class="text-xl font-semibold">View Certificate</DialogTitle>
                  <button
                    @click="showCertificateModal = false"
                    class="text-gray-500 hover:text-gray-600"
                  >
                    <XMarkIcon class="w-6 h-6" />
                  </button>
                </div>
                <ViewCertificateModal
                  :application="application"
                  @close="showCertificateModal = false"
                />
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import {
  PencilIcon,
  EyeIcon,
  ClockIcon,
  XMarkIcon,
  UserIcon,
  UserCircleIcon,
  ClipboardDocumentCheckIcon,
  CalendarIcon,
  DocumentIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline'
import ApplicationForm from '../dashboard/roqcomponents/user/ApplicationForm.vue'
import ViewCertificateModal from './ROQ/ROQViewCertificateModal.vue' // Import the new modal component

defineProps({
  status: String,
  application: Object,
})

const showEditModal = ref(false)
const showReasonModal = ref(false)
const showCertificateModal = ref(false)

const handleEditSubmit = () => {
  showEditModal.value = false
  // You can add additional logic here if needed
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const formatStatus = (status) => {
  const statusMap = {
    reprocess: 'Needs Reprocessing',
    regretted: 'Regretted',
    reupload: 'Reupload Required',
  }
  return statusMap[status] || status
}

const getRequiredActions = (status) => {
  const actionMap = {
    reprocess:
      'Please review the comments and resubmit your application with the requested changes.',
    reupload: 'Additional documents are required. Please upload the requested documents.',
    regretted: null,
  }
  return actionMap[status]
}
</script>
