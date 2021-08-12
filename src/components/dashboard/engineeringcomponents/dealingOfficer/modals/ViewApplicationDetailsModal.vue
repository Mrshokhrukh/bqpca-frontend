<template>
  <div>
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
                class="relative w-full max-w-7xl transform overflow-hidden rounded-2xl bg-gray-50 shadow-2xl transition-all max-h-screen sm:max-h-[calc(100vh-80px)] overflow-y-auto"
              >
                <div
                  v-if="isLoading"
                  class="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm flex items-center justify-center z-30 rounded-2xl"
                >
                  <div class="flex flex-col items-center">
                    <svg
                      class="animate-spin h-10 w-10 text-blue-600"
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
                    <p class="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Processing...
                    </p>
                  </div>
                </div>
                <ApplicationStatus
                  v-if="application"
                  :overallStatus="overallStatus"
                  @close="closeModal"
                />

                <div v-if="application" class="px-8 py-6 bg-white">
                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div class="lg:col-span-1 space-y-6">
                      <PersonalInformation
                        :application="application"
                        @update="refreshApplication"
                      />
                      <ContactInformation :application="application" />
                    </div>

                    <div class="lg:col-span-2 space-y-6">
                      <ApplicationDetailsSection
                        :application="application"
                        :personnelCategories="personnelCategories"
                        :personnelSubcategories="personnelSubcategories"
                        :sectors="sectors"
                        @update="refreshApplication"
                        @validation-status-changed="handleValidationUpdate"
                      />
                      <QualificationList
                        :qualifications="application.user_qualifications"
                        :applicationId="application.id"
                        :mainApplicationPaymentStatus="application.payment_status"
                        :registrationTypes="registrationTypes"
                        @update="refreshApplication"
                      />
                    </div>
                  </div>
                </div>
                <FooterButtons
                  v-if="application"
                  :application="application"
                  @open-certificate-modal="openCertificateModal"
                  @update="refreshApplication"
                  :is-loading="isLoading"
                  @close="closeModal"
                  :is-approval-disabled="isApprovalDisabled"
                />
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <EPCCertificateModal
      v-if="isCertificateModalOpen"
      :qualification="formattedApplicationData"
      :show-modal="isCertificateModalOpen"
      @close="closeCertificateModal"
    />
  </div>
</template>

<script setup>
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { ref, computed, nextTick } from 'vue'
import apiServices from '@/services/services'
import EPCCertificateModal from '@/components/common/EPC/EPCCertificateModal.vue'
import PersonalInformation from './applicationDetailsComponents/PersonalInformation.vue'
import ContactInformation from './applicationDetailsComponents/ContactInformation.vue'
import ApplicationStatus from './applicationDetailsComponents/ApplicationStatus.vue'
import ApplicationDetailsSection from './applicationDetailsComponents/ApplicationDetailsSection.vue'
import QualificationList from './applicationDetailsComponents/QualificationList.vue'
import FooterButtons from './applicationDetailsComponents/FooterButtons.vue'

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
  registrationTypes: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['close', 'update'])

const isLoading = ref(false)
const isCertificateModalOpen = ref(false)
const detailsValidationStatus = ref({ isValid: true, missingFields: [] });

const formattedApplicationData = computed(() => {
  if (!props.application) return null
  return {
    results: [props.application],
  }
})

const closeModal = () => {
  if (isCertificateModalOpen.value) {
    isCertificateModalOpen.value = false
  }
  emit('close')
}

const closeModalHandler = () => {
  closeModal()
}

const overallStatus = computed(() => {
  if (!props.application?.user_qualifications?.[0]) return 'Pending'

  const appReview = props.application.user_qualifications[0].application_review_status
  const physReview = props.application.user_qualifications[0].physical_review_status
  const endorse = props.application.user_qualifications[0].endorsement_decision

  if (appReview === 'Regretted' || physReview === 'Regretted' || endorse === 'Regretted') {
    return 'Regretted'
  } else if (appReview === 'Approved' && physReview === 'Approved' && endorse === 'Approved') {
    return 'Approved'
  } else {
    return 'Pending'
  }
})

const isApprovalDisabled = computed(() => {
  return !detailsValidationStatus.value.isValid && overallStatus.value === 'Pending';
});

const handleValidationUpdate = (status) => {
  detailsValidationStatus.value = status;
};

const refreshApplication = async () => {
  if (!props.application?.id) return
  isLoading.value = true
  try {
    const response = await apiServices.getEpcNewApplications(props.application.id)
    emit('update', response.data)
    await nextTick()
  } catch (error) {
    console.error('Error refreshing application:', error)
  } finally {
    isLoading.value = false
  }
}

const openCertificateModal = () => {
  isCertificateModalOpen.value = true
}

const closeCertificateModal = () => {
  isCertificateModalOpen.value = false
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
</style>