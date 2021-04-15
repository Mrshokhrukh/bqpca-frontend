<template>
  <div class="min-h-screen bg-slate-50 pb-12">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-slate-900 to-slate-800 relative overflow-hidden mt-10">
      <!-- Decorative elements -->
      <div class="absolute inset-0">
        <div class="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        <div class="text-center">
          <div
            class="inline-flex items-center px-3 py-1 rounded-full border border-red-400/30 bg-red-400/10 text-red-200 mb-6">
            <BookOpen class="w-4 h-4 mr-2" />
            <span class="text-sm">Healthcare Certification</span>
          </div>
          <h1 class="text-3xl font-serif font-bold text-white sm:text-4xl lg:text-5xl">
            Medical &amp; Health Professionals Council
          </h1>
          <p class="mt-6 text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Certification and registration services for healthcare professionals in Bhutan.
          </p>
        </div>
      </div>

      <!-- Decorative wave shape -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg class="w-full h-8 fill-slate-50" viewBox="0 0 1440 48" preserveAspectRatio="none">
          <path d="M0 48h1440V0c-283.146 39.154-566.281 48-849.405 48C307.47 48 153.735 32 0 0v48z" />
        </svg>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Information Section -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Official Notice -->
          <div class="bg-white border-l-4 border-red-600 rounded-xl p-8 shadow-lg">
            <div class="flex items-start">
              <div class="p-3 rounded-lg bg-red-50">
                <CircleAlert class="w-6 h-6 text-red-600" />
              </div>
              <div class="ml-4">
                <h2 class="text-xl font-serif font-bold text-slate-900 mb-4">
                  Official Notice
                </h2>
                <p class="text-slate-600 leading-relaxed">
                  This is the official portal for healthcare certification services provided by the Bhutan
                  Qualifications &
                  Professional Certification Authority (BQPCA). All certification and validation processes are conducted
                  in accordance with the Royal Government of Bhutan's regulations.
                </p>
              </div>
            </div>
          </div>
          <!-- Service Provider Registration Options -->
          <div class="max-w-7xl mx-auto mt-12">
            <h2 class="text-2xl font-serif font-bold text-slate-900 mb-2 text-center">
              Service Provider Registration
            </h2>
            <p class="text-center text-slate-600 mb-8">
              For service providers, please register from the options below.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button @click="openCPDProviderModal"
                class="group relative rounded-xl shadow-md overflow-hidden bg-white hover:bg-red-50 border border-slate-200 p-6 transition-all duration-200 hover:shadow-lg">
                <div class="flex items-center">
                  <div class="p-3 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors">
                    <BookOpen class="w-6 h-6 text-red-600" />
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-slate-900">CPD/CPD Provider Registration</h3>
                    <p class="mt-1 text-sm text-slate-600">Register as an accredited continuing medical education
                      provider</p>
                  </div>
                </div>
              </button>

              <button @click="openMedicalInstitutionModal"
                class="group relative rounded-xl shadow-md overflow-hidden bg-white hover:bg-red-50 border border-slate-200 p-6 transition-all duration-200 hover:shadow-lg">
                <div class="flex items-center">
                  <div class="p-3 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors">
                    <Hospital class="w-6 h-6 text-red-600" />
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-slate-900">Medical Institution Registration</h3>
                    <p class="mt-1 text-sm text-slate-600">Register your healthcare facility or institution</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <!-- Process Overview -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="p-8 border-b border-slate-200">
              <div class="flex items-center">
                <div class="p-3 rounded-lg bg-red-50">
                  <ListChecks class="w-6 h-6 text-red-600" />
                </div>
                <h2 class="text-xl font-serif font-bold text-slate-900 ml-4">Certification Process</h2>
              </div>
            </div>
            <div class="p-8">
              <div class="space-y-8">
                <div v-for="(step, index) in certificationSteps" :key="step.title" class="flex items-start group">
                  <div class="relative">
                    <div
                      class="flex-shrink-0 h-10 w-10 rounded-full bg-red-600 group-hover:bg-red-700 transition-colors text-white flex items-center justify-center font-medium">
                      {{ index + 1 }}
                    </div>
                    <!-- Connection line -->
                    <div v-if="index < certificationSteps.length - 1"
                      class="absolute top-10 left-1/2 bottom-0 w-px bg-red-200 transform -translate-x-1/2 h-full"></div>
                  </div>
                  <div class="ml-6">
                    <h3 class="text-lg font-medium text-slate-900 group-hover:text-red-600 transition-colors">
                      {{ step.title }}
                    </h3>
                    <p class="mt-2 text-slate-600 leading-relaxed">{{ step.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Important Information -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="p-8 border-b border-slate-200">
              <div class="flex items-center">
                <div class="p-3 rounded-lg bg-red-50">
                  <InfoIcon class="w-6 h-6 text-red-600" />
                </div>
                <h2 class="text-xl font-serif font-bold text-slate-900 ml-4">Important Information</h2>
              </div>
            </div>
            <div class="p-8">
              <div class="grid md:grid-cols-3 gap-8">
                <div v-for="info in importantInfo" :key="info.title"
                  class="group bg-slate-50 rounded-xl p-6 hover:bg-red-50 transition-colors">
                  <div class="flex items-start">
                    <component :is="info.icon"
                      class="w-6 h-6 text-red-600 mt-1 group-hover:scale-110 transition-transform" />
                    <div class="ml-4">
                      <h3 class="font-medium text-slate-900">{{ info.title }}</h3>
                      <p class="mt-2 text-slate-600">{{ info.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Authentication Section -->
        <div class="lg:sticky lg:top-8 self-start">
          <AuthSection :serviceType="serviceType" @ndi-login="handleNDILogin" @form-login="handleFormLogin" />
        </div>
      </div>
    </div>
    <!-- CPD/CPD Provider Modal -->
    <TransitionRoot appear :show="showCPDProviderModal" as="template">
      <Dialog as="div" @close="closeCPDProviderModal" class="relative z-50">
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
          leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-slate-900/75" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95">
              <DialogPanel
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div class="flex items-center justify-between mb-6">
                  <DialogTitle class="text-xl font-semibold text-slate-900">Register as CPD/CPD Provider</DialogTitle>
                  <button @click="closeCPDProviderModal" class="rounded-full p-1 hover:bg-slate-100 transition-colors">
                    <X class="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <form @submit.prevent="handleCPDProviderRegistration" class="space-y-4">
                  <div>
                    <label for="organization_name" class="block text-sm font-medium text-slate-700">Organization
                      Name</label>
                    <input type="text" id="organization_name" v-model="cmeProviderForm.organization_name" required
                      class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500" />
                  </div>

                  <div>
                    <label for="license_number" class="block text-sm font-medium text-slate-700">Provider License
                      Number</label>
                    <input type="text" id="license_number" v-model="cmeProviderForm.license_number"
                      class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500" />
                  </div>

                  <div>
                    <label for="contact_number" class="block text-sm font-medium text-slate-700">Contact Number</label>
                    <input type="tel" id="contact_number" v-model="cmeProviderForm.contact_number"
                      class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500" />
                  </div>

                  <div>
                    <label for="email" class="block text-sm font-medium text-slate-700">Email</label>
                    <input type="email" id="email" v-model="cmeProviderForm.email" required
                      class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500" />
                  </div>

                  <div>
                    <label for="password" class="block text-sm font-medium text-slate-700">Password</label>
                    <input type="password" id="password" v-model="cmeProviderForm.password" required
                      class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500" />
                  </div>

                  <div>
                    <label for="confirm_password" class="block text-sm font-medium text-slate-700">Confirm
                      Password</label>
                    <input type="password" id="confirm_password" v-model="cmeProviderForm.confirm_password" required
                      class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500" />
                  </div>

                  <div class="flex justify-end space-x-3 mt-6">
                    <button type="button" @click="closeCPDProviderModal"
                      class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
                      Cancel
                    </button>
                    <button type="submit"
                      class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                      Register
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Medical Institution Modal -->
    <TransitionRoot appear :show="showMedicalInstitutionModal" as="template">
      <Dialog as="div" @close="closeMedicalInstitutionModal" class="relative z-50">
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
          leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-slate-900/75" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95">
              <DialogPanel
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div class="flex items-center justify-between mb-6">
                  <DialogTitle class="text-xl font-semibold text-slate-900">Register as Medical Institution
                  </DialogTitle>
                  <button @click="closeMedicalInstitutionModal"
                    class="rounded-full p-1 hover:bg-slate-100 transition-colors">
                    <X class="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <form @submit.prevent="handleMedicalInstitutionRegistration" class="space-y-4">
                  <div>
                    <label for="institution_name" class="block text-sm font-medium text-slate-700">Institution
                      Name</label>
                    <input type="text" id="institution_name" v-model="medicalInstitutionForm.institution_name" required
                      class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500" />
                  </div>

                  <div>
                    <label for="license_number" class="block text-sm font-medium text-slate-700">Institute License
                      Number</label>
                    <input type="text" id="license_number" v-model="medicalInstitutionForm.license_number"
                      class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500" />
                  </div>

                  <div>
                    <label for="cme_email" class="block text-sm font-medium text-slate-700">Email</label>
                    <input type="email" id="cme_email" v-model="medicalInstitutionForm.email" required
                      class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500" />
                  </div>

                  <div>
                    <label for="cme_password" class="block text-sm font-medium text-slate-700">Password</label>
                    <input type="password" id="cme_password" v-model="medicalInstitutionForm.password" required
                      class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500" />
                  </div>

                  <div>
                    <label for="cme_confirm_password" class="block text-sm font-medium text-slate-700">Confirm
                      Password</label>
                    <input type="password" id="cme_confirm_password" v-model="medicalInstitutionForm.confirm_password"
                      required
                      class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-red-500 focus:ring-red-500" />
                  </div>

                  <div class="flex justify-end space-x-3 mt-6">
                    <button type="button" @click="closeMedicalInstitutionModal"
                      class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
                      Cancel
                    </button>
                    <button type="submit"
                      class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                      Register
                    </button>
                  </div>
                </form>
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
import { reactive } from 'vue';
import { useToast } from 'vue-toastification';
import {
  Clock,
  FileText,
  ShieldCheck,
  BookOpen,
  CircleAlert,
  ListChecks,
  Hospital,
  Info as InfoIcon,
  X // Import X icon for close button
} from 'lucide-vue-next'
import AuthSection from '@/components/common/AuthSection.vue'
import apiService from '@/services/services'

// Import Headless UI components
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'

const serviceType = ref('health_certification')
const toast = useToast();

const certificationSteps = [
  {
    title: 'Submit Application',
    description: 'Complete the online application form with your professional details'
  },
  {
    title: 'Document Review',
    description: 'Our team reviews your healthcare credentials and supporting documents'
  },
  {
    title: 'Validation',
    description: 'Your credentials are validated through official channels'
  },
  {
    title: 'Certification',
    description: 'Receive your official healthcare certification with digital signature'
  }
]

const importantInfo = [
  {
    title: 'Processing Time',
    description: 'Standard processing time is 7-10 working days',
    icon: Clock
  },
  {
    title: 'Required Documents',
    description: 'Medical degree, transcripts, professional licenses, and valid identification',
    icon: FileText
  },
  {
    title: 'Security',
    description: 'All documents are processed through secure government channels',
    icon: ShieldCheck
  }
]

const handleNDILogin = () => {
  console.log('NDI login clicked')
}

const handleFormLogin = (formData) => {
  console.log('Login submitted:', formData)
}

// CPD/CPD Provider Modal Logic
const cmeProviderForm = reactive({
  organization_name: '',
  email: '',
  password: '',
  confirm_password: '',
  contact_number: '',
  license_number: '',
})

const showCPDProviderModal = ref(false)

const openCPDProviderModal = () => {
  showCPDProviderModal.value = true
}

const closeCPDProviderModal = () => {
  showCPDProviderModal.value = false
  // Reset form
  Object.assign(cmeProviderForm, {
    organization_name: '',
    email: '',
    password: '',
    confirm_password: '',
    contact_number: '',
    license_number: '',
  })
}

const handleCPDProviderRegistration = async () => {
  if (cmeProviderForm.password !== cmeProviderForm.confirm_password) {
    toast.error('Passwords do not match.')
    return
  }

  try {
    // Split organization name into first_name and last_name
    const nameParts = cmeProviderForm.organization_name.split(' ')
    const first_name = nameParts[0]
    const last_name = nameParts.slice(1).join(' ') || ''

    const payload = {
      email: cmeProviderForm.email,
      password: cmeProviderForm.password,
      confirm_password: cmeProviderForm.confirm_password,
      first_name,
      last_name,
      contact_number: cmeProviderForm.contact_number,
      role: 'cpd_cme_provider',
      service_type: serviceType.value,
      cid: cmeProviderForm.license_number || '',
    }

    await apiService.register(payload)
    toast.success('Registration successful! Please login.')
    closeCPDProviderModal()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
  }
}

// Medical Institution Modal Logic
const showMedicalInstitutionModal = ref(false);
const medicalInstitutionForm = reactive({
  institution_name: '',
  email: '',
  password: '',
  confirm_password: '',
  contact_number: '',
  license_number: '', // This will be shown to user as License Number but sent as CID
});

const openMedicalInstitutionModal = () => {
  showMedicalInstitutionModal.value = true;
};

const closeMedicalInstitutionModal = () => {
  showMedicalInstitutionModal.value = false;
  // Reset the form
  Object.assign(medicalInstitutionForm, {
    institution_name: '',
    email: '',
    password: '',
    confirm_password: '',
    contact_number: '',
    license_number: '',
  });
};

const handleMedicalInstitutionRegistration = async () => {
  if (medicalInstitutionForm.password !== medicalInstitutionForm.confirm_password) {
    toast.error('Passwords do not match.')
    return
  }

  try {
    // Split institution name into first_name and last_name
    const nameParts = medicalInstitutionForm.institution_name.split(' ')
    const first_name = nameParts[0]
    const last_name = nameParts.slice(1).join(' ') || ''

    const payload = {
      email: medicalInstitutionForm.email,
      password: medicalInstitutionForm.password,
      confirm_password: medicalInstitutionForm.confirm_password,
      first_name,
      last_name,
      contact_number: medicalInstitutionForm.contact_number,
      role: 'institutions',
      service_type: serviceType.value,
      // Send the license number as cid to the backend
      cid: medicalInstitutionForm.license_number || ''
    }

    await apiService.register(payload)
    toast.success('Medical Institution registration successful! Please login.')
    closeMedicalInstitutionModal()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Medical Institution registration failed. Please try again.')
  }
}
</script>
