```vue
<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Enhanced Header -->
      <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
        <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
          Certificate of Goods Standing (CoGS) Application
        </h2>
        <p class="text-gray-600 text-center max-w-2xl mx-auto">
          Please fill in all required fields marked with an asterisk (<span class="text-red-600"
            >*</span
          >). You can save your progress as a draft.
        </p>
      </div>

      <!-- User Notification Area -->
      <div v-if="draftMessage" class="mb-4 p-4 rounded-md text-sm" :class="draftMessageClass">
        {{ draftMessage }}
      </div>

      <!-- Main Form -->
      <form @submit.prevent="submitForm" class="space-y-8">
        <!-- Hidden Fields (Still used for submission payload) -->
        <input type="hidden" v-model="form.registration_no" />
        <input type="hidden" v-model="form.cid_no" />

        <!-- Personal Details Section (Read-only) -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 p-8 border-b">
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">Personal Details</h3>
                <p class="mt-1 text-gray-600">Your information (auto-populated)</p>
              </div>
            </div>
          </div>
          <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-500">Registration Number</label>
              <p class="text-gray-800 font-semibold">{{ form.registration_no || 'Fetching...' }}</p>
            </div>
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-500">CID No./Identity/Work Permit No.</label>
              <p class="text-gray-800 font-semibold">{{ form.cid_no || 'N/A' }}</p>
            </div>
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-500">Full Name</label>
              <p class="text-gray-800 font-semibold">{{ displayFullName || 'N/A' }}</p>
            </div>
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-500">Gender</label>
              <p class="text-gray-800 font-semibold">{{ form.gender || 'N/A' }}</p>
            </div>
          </div>
        </div>

        <!-- Supervisor Details Section -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 p-8 border-b">
            <div class="flex items-center space-x-3">
              <div
                class="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold"
              >
                2
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">Supervisor & Application Details</h3>
                <p class="mt-1 text-gray-600">Information about your supervisor and the reason for application</p>
              </div>
            </div>
          </div>

          <div class="p-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Reason for Application -->
              <div class="space-y-2 md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 required"
                  >Reason for Application</label
                >
                <textarea
                  v-model="form.reason_for_application"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  rows="3"
                  placeholder="Enter reason for application"
                ></textarea>
                <span v-if="errors.reason_for_application" class="text-sm text-red-500 block">{{
                  errors.reason_for_application
                }}</span>
              </div>

              <!-- Supervisor Name -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 required"
                  >Supervisor's Name</label
                >
                <input
                  type="text"
                  v-model="form.supervisor_name"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter supervisor's name"
                />
                <span v-if="errors.supervisor_name" class="text-sm text-red-500 block">{{
                  errors.supervisor_name
                }}</span>
              </div>

              <!-- Supervisor Designation -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 required"
                  >Supervisor's Designation</label
                >
                <input
                  type="text"
                  v-model="form.supervisor_designation"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter supervisor's designation"
                />
                <span v-if="errors.supervisor_designation" class="text-sm text-red-500 block">{{
                  errors.supervisor_designation
                }}</span>
              </div>

              <!-- Agency -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 required">Agency</label>
                <Listbox v-model="form.agency">
                  <div class="relative">
                    <ListboxButton
                      class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-left"
                    >
                      <span class="block truncate">{{
                        selectedAgencyName || 'Select Agency'
                      }}</span>
                    </ListboxButton>
                    <ListboxOptions class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      <ListboxOption v-for="agency in agencyOptions" :key="agency.id" :value="agency.id" v-slot="{ active, selected }">
                        <ListItemContent :active="active" :selected="selected" :name="agency.name" />
                      </ListboxOption>
                    </ListboxOptions>
                  </div>
                </Listbox>
                <span v-if="errors.agency" class="text-sm text-red-500 block">{{ errors.agency }}</span>
              </div>

              <!-- Department -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 required">Department</label>
                <Listbox v-model="form.department">
                  <div class="relative">
                    <ListboxButton class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-left">
                      <span class="block truncate">{{ selectedDepartmentName || 'Select Department' }}</span>
                    </ListboxButton>
                    <ListboxOptions class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      <ListboxOption v-for="dept in departmentOptions" :key="dept.id" :value="dept.id" v-slot="{ active, selected }">
                        <ListItemContent :active="active" :selected="selected" :name="dept.name" />
                      </ListboxOption>
                    </ListboxOptions>
                  </div>
                </Listbox>
                <span v-if="errors.department" class="text-sm text-red-500 block">{{ errors.department }}</span>
              </div>

              <!-- Workplace/Working Organisation -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 required">Workplace/Working Organisation</label>
                <Listbox v-model="form.workplace">
                  <div class="relative">
                    <ListboxButton class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-left">
                      <span class="block truncate">{{ selectedWorkplaceName || 'Select Workplace' }}</span>
                    </ListboxButton>
                    <ListboxOptions class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      <ListboxOption v-for="place in workplaceOptions" :key="place.id" :value="place.id" v-slot="{ active, selected }">
                        <ListItemContent :active="active" :selected="selected" :name="place.name" />
                      </ListboxOption>
                    </ListboxOptions>
                  </div>
                </Listbox>
                <span v-if="errors.workplace" class="text-sm text-red-500 block">{{ errors.workplace }}</span>
              </div>

              <!-- Supervisor Contact Number -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 required"
                  >Supervisor's Contact Number</label
                >
                <input
                  type="tel"
                  v-model="form.contact_number"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter supervisor's contact number"
                />
                <span v-if="errors.contact_number" class="text-sm text-red-500 block">{{
                  errors.contact_number
                }}</span>
              </div>

              <!-- Supervisor Email Address -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700 required"
                  >Supervisor's Email Address</label
                >
                <input
                  type="email"
                  v-model="form.email_address"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter supervisor's email address"
                />
                <span v-if="errors.email_address" class="text-sm text-red-500 block">{{
                  errors.email_address
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recipient Details Section -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 p-8 border-b">
            <div class="flex items-center space-x-3">
              <div
                class="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold"
              >
                3
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">Recipient Details</h3>
                <p class="mt-1 text-gray-600">Who should receive the certificate?</p>
              </div>
            </div>
          </div>

          <div class="p-8">
            <!-- Recipient Toggle -->
            <div class="mb-8">
              <Switch v-model="isRecipientSelf" class="relative inline-flex items-center">
                <span class="sr-only">Toggle recipient</span>
                <div
                  :class="[
                    isRecipientSelf ? 'bg-blue-600' : 'bg-gray-200',
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out',
                  ]"
                >
                  <span
                    :class="[
                      isRecipientSelf ? 'translate-x-6' : 'translate-x-1',
                      'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out mt-1',
                    ]"
                  />
                </div>
                <span class="ml-3 text-sm font-medium text-gray-900">{{
                  isRecipientSelf ? 'Recipient is Myself' : 'Recipient is Someone Else'
                }}</span>
              </Switch>
            </div>

            <!-- Other Recipient Form (Conditional) -->
            <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div v-if="!isRecipientSelf" class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Recipient Name -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 required"
                    >Recipient's Name</label
                  >
                  <input
                    type="text"
                    v-model="form.recipient_name"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter recipient's name"
                  />
                  <span v-if="errors.recipient_name" class="text-sm text-red-500 block">{{
                    errors.recipient_name
                  }}</span>
                </div>

                <!-- Recipient Contact Number -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 required"
                    >Recipient's Contact Number</label
                  >
                  <input
                    type="tel"
                    v-model="form.recipient_contact_number"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter recipient's contact number"
                  />
                  <span v-if="errors.recipient_contact_number" class="text-sm text-red-500 block">{{
                    errors.recipient_contact_number
                  }}</span>
                </div>

                <!-- Recipient Email -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 required"
                    >Recipient's Email</label
                  >
                  <input
                    type="email"
                    v-model="form.recipient_email"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter recipient's email address"
                  />
                  <span v-if="errors.recipient_email" class="text-sm text-red-500 block">{{
                    errors.recipient_email
                  }}</span>
                </div>

                <!-- Recipient Address -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700 required"
                    >Recipient's Address</label
                  >
                  <input
                    type="text"
                    v-model="form.address"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter recipient's full address"
                  />
                  <span v-if="errors.address" class="text-sm text-red-500 block">{{
                    errors.address
                  }}</span>
                </div>

                <!-- Recipient PO Box -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Recipient's PO. Box</label>
                  <input
                    type="text"
                    v-model="form.po_box"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter recipient's PO Box (optional)"
                  />
                  <span v-if="errors.po_box" class="text-sm text-red-500 block">{{
                    errors.po_box
                  }}</span>
                </div>

                <!-- Recipient Zip Code -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700"
                    >Recipient's Zip code</label
                  >
                  <input
                    type="text"
                    v-model="form.zip_code"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter recipient's zip code (optional)"
                  />
                  <span v-if="errors.zip_code" class="text-sm text-red-500 block">{{
                    errors.zip_code
                  }}</span>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Declaration Section -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 p-8 border-b">
            <div class="flex items-center space-x-3">
              <div
                class="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold"
              >
                4
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">Declaration</h3>
                <p class="mt-1 text-gray-600">Please read and agree to the terms</p>
              </div>
            </div>
          </div>

          <div class="p-8">
            <div class="flex items-start space-x-3">
              <input
                type="checkbox"
                v-model="form.declaration"
                id="declarationCheckbox"
                class="mt-1 flex-shrink-0 h-5 w-5 rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                aria-describedby="declaration-description"
              />
              <div class="flex-grow">
                <label for="declarationCheckbox" class="text-sm font-medium text-gray-800">
                  I hereby declare that the information provided in this application is true, complete, and accurate to the best of my knowledge.
                </label>
                <p id="declaration-description" class="text-xs text-gray-600 mt-1">
                  By checking this box, you confirm your understanding and agreement.
                  <button type="button" @click="openTermsModal" class="text-blue-600 hover:underline text-xs">
                    Read More Terms
                  </button>
                </p>
              </div>
            </div>
            <span v-if="errors.declaration" class="text-sm text-red-500 block mt-2">
              {{ errors.declaration }}
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
          <button
            type="button"
            @click="cancelForm"
            class="w-full sm:w-auto px-6 py-3 rounded-xl text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel & Clear Form
          </button>
          <button
            type="button"
            @click="saveDraft"
            class="w-full sm:w-auto px-6 py-3 rounded-xl bg-yellow-500 text-white hover:bg-yellow-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            :disabled="!form.declaration"
            class="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Application
          </button>
        </div>
      </form>

      <!-- Terms Modal -->
      <TransitionRoot as="template" :show="showTermsModal">
        <Dialog as="div" class="fixed z-10 inset-0 overflow-y-auto" @close="closeTermsModal">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
              <DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <DialogTitle as="h3" class="text-lg leading-6 font-medium text-gray-900"> Terms and Conditions </DialogTitle>
                      <div class="mt-4 prose prose-sm text-gray-500 max-h-80 overflow-y-auto">
                        <p> Placeholder terms: By submitting this application for a Certificate of Good Standing (CoGS), you affirm that all information provided is accurate and complete. You authorize the relevant authorities to verify this information. You understand that any false statements may lead to rejection of the application or revocation of the certificate. You agree to comply with all applicable regulations and standards related to your profession. </p>
                        <p> The processing of this application is subject to standard procedures and timelines. You will be notified of the outcome via the contact details provided. Ensure your supervisor and recipient details are correct to avoid delays. </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="button" class="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm" @click="closeTermsModal"> I Understand </button>
                </div>
              </div>
            </TransitionChild>
          </div>
        </Dialog>
      </TransitionRoot>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { useToast } from 'vue-toastification';
import apiService from '@/services/services';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import {
  Dialog, DialogOverlay, DialogTitle,
  Listbox, ListboxButton, ListboxOptions, ListboxOption,
  Switch,
  TransitionChild, TransitionRoot
} from '@headlessui/vue';
import { CheckIcon } from '@heroicons/vue/24/outline';

const ListItemContent = {
  props: ['active', 'selected', 'name'],
  components: { CheckIcon },
  template: `
    <div :class="[active ? 'text-white bg-blue-600' : 'text-gray-900', 'cursor-default select-none relative py-2 pl-10 pr-4']">
      <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ name }}</span>
      <span v-if="selected" :class="[active ? 'text-white' : 'text-blue-600', 'absolute inset-y-0 left-0 flex items-center pl-3']">
        <CheckIcon class="h-5 w-5" aria-hidden="true" />
      </span>
    </div>
  `
};

const toast = useToast();
const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  registration_no: '',
  full_name: '',
  cid_no: '',
  gender: '',
  user_contact_number: '',
  user_email: '',
  reason_for_application: '',
  supervisor_name: '',
  supervisor_designation: '',
  agency: null,
  department: null,
  workplace: null,
  contact_number: '',
  email_address: '',
  recipient_name: '',
  recipient_contact_number: '',
  recipient_email: '',
  address: '',
  po_box: '',
  zip_code: '',
  declaration: false,
});

const errors = reactive({});
const isRecipientSelf = ref(true);
const showTermsModal = ref(false);
const agencyOptions = ref([]);
const departmentOptions = ref([]);
const workplaceOptions = ref([]);
const draftMessage = ref('');
const draftMessageClass = ref('');

const displayFullName = computed(() => {
  if (form.full_name) {
    return form.full_name;
  }
  if (authStore.user && authStore.user.first_name && authStore.user.last_name) {
    const fullName = authStore.user.middle_name
      ? `${authStore.user.first_name} ${authStore.user.middle_name} ${authStore.user.last_name}`
      : `${authStore.user.first_name} ${authStore.user.last_name}`;
    console.log('Falling back to authStore fullName:', fullName);
    return fullName;
  }
  console.log('No full_name available, returning empty string');
  return '';
});

const selectedAgencyName = computed(() => {
  const agency = agencyOptions.value.find((a) => a.id === form.agency);
  return agency ? agency.name : '';
});

const selectedDepartmentName = computed(() => {
  const dept = departmentOptions.value.find((d) => d.id === form.department);
  return dept ? dept.name : '';
});

const selectedWorkplaceName = computed(() => {
  const place = workplaceOptions.value.find((w) => w.id === form.workplace);
  return place ? place.name : '';
});

const localStorageKey = computed(() => `cogsDraftData_${authStore.user?.cid || 'guest'}`);

const fetchUserApplicationData = async (cid) => {
  if (!cid) return null;
  try {
    const response = await apiService.getEpcApplicationsByCid(cid);
    const data = response.data.results || response.data || [];
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching application data:', error);
    toast.warning('Could not fetch application data.');
    return null;
  }
};

const fetchMasterData = async () => {
  try {
    const [agenciesResponse, departmentsResponse, workplacesResponse] = await Promise.all([
      apiService.getEpcCogsAgencies(),
      apiService.getEpcInstituteDepartments(),
      apiService.getEpcCogsWorkplaces()
    ]);

    agencyOptions.value = agenciesResponse.data.results || agenciesResponse.data || [];
    departmentOptions.value = departmentsResponse.data.results || departmentsResponse.data || [];
    workplaceOptions.value = workplacesResponse.data.results || workplacesResponse.data || [];

  } catch (error) {
    toast.error('Failed to fetch master data (Agencies/Departments/Workplaces): ' + error.message);
    console.error('Error fetching master data:', error);
    if (import.meta.env.DEV) {
      console.warn("Using dummy dropdown data in DEV mode.");
      if (!departmentOptions.value.length) departmentOptions.value = [{id: 1, name: 'Dept A (Dummy)'}, {id: 2, name: 'Dept B (Dummy)'}];
      if (!workplaceOptions.value.length) workplaceOptions.value = [{id: 1, name: 'Workplace X (Dummy)'}, {id: 2, name: 'Workplace Y (Dummy)'}];
      if (!agencyOptions.value.length) agencyOptions.value = [{id: 1, name: 'Agency 1 (Dummy)'}, {id: 2, name: 'Agency 2 (Dummy)'}];
    }
  }
};

const loadDraft = () => {
  const savedDraft = localStorage.getItem(localStorageKey.value);
  if (savedDraft) {
    try {
      const draftData = JSON.parse(savedDraft);
      Object.keys(draftData).forEach(key => {
        if (
          key !== 'registration_no' &&
          key !== 'cid_no' &&
          key !== 'gender' &&
          key !== 'user_contact_number' &&
          key !== 'user_email' &&
          (key !== 'full_name' || !form.full_name) &&
          key in form
        ) {
          form[key] = draftData[key];
        }
      });
      if (typeof draftData.isRecipientSelf === 'boolean') {
        isRecipientSelf.value = draftData.isRecipientSelf;
        updateRecipientDetails();
      }
      showDraftMessage('Draft loaded successfully.', 'bg-green-100 text-green-700');
    } catch (e) {
      console.error("Error parsing draft data:", e);
      localStorage.removeItem(localStorageKey.value);
      showDraftMessage('Could not load draft (invalid data).', 'bg-red-100 text-red-700');
    }
  }
};

const saveDraft = () => {
  try {
    const draftData = { ...form, isRecipientSelf: isRecipientSelf.value };
    localStorage.setItem(localStorageKey.value, JSON.stringify(draftData));
    showDraftMessage('Draft saved successfully.', 'bg-yellow-500 text-white');
  } catch (e) {
    console.error("Error saving draft:", e);
    toast.error('Could not save draft. Local storage might be full or disabled.');
  }
};

const clearDraft = () => {
  localStorage.removeItem(localStorageKey.value);
  console.log("Draft cleared from local storage.");
};

const showDraftMessage = (msg, cssClass) => {
  draftMessage.value = msg;
  draftMessageClass.value = cssClass;
  setTimeout(() => {
    draftMessage.value = '';
    draftMessageClass.value = '';
  }, 4000);
};

onMounted(async () => {
  if (authStore.user && authStore.user.cid) {
    form.cid_no = authStore.user.cid;
    form.gender = authStore.user.gender || 'N/A';
    form.user_contact_number = authStore.user.contact_number || '';
    form.user_email = authStore.user.email || '';
    console.log('authStore.user:', authStore.user);

    const applicationData = await fetchUserApplicationData(form.cid_no);
    if (applicationData) {
      form.registration_no = applicationData.registration_no || '';
      form.full_name = applicationData.full_name || '';
      console.log('Set form.full_name:', form.full_name);
    }

    await fetchMasterData();
    loadDraft();
    console.log('After loadDraft, form.full_name:', form.full_name);
    updateRecipientDetails();
  } else {
    toast.error("User not authenticated or essential data missing. Cannot prefill data.");
  }
});

const validateForm = () => {
  Object.keys(errors).forEach((key) => delete errors[key]);
  let isValid = true;

  if (!form.reason_for_application?.trim()) errors.reason_for_application = 'Reason for Application is required';
  if (!form.supervisor_name?.trim()) errors.supervisor_name = 'Supervisor Name is required';
  if (!form.supervisor_designation?.trim()) errors.supervisor_designation = 'Supervisor Designation is required';
  if (!form.agency) errors.agency = 'Agency is required';
  if (!form.department) errors.department = 'Department is required';
  if (!form.workplace) errors.workplace = 'Workplace is required';
  if (!form.contact_number?.trim()) errors.contact_number = 'Supervisor Contact Number is required';
  else if (!/^\d{8,}$/.test(form.contact_number.replace(/\s+/g, ''))) errors.contact_number = 'Contact Number must be at least 8 digits';
  if (!form.email_address?.trim()) errors.email_address = 'Supervisor Email is required';
  else if (!/^\S+@\S+\.\S+$/.test(form.email_address)) errors.email_address = 'Please enter a valid email address';

  if (!isRecipientSelf.value) {
    if (!form.recipient_name?.trim()) errors.recipient_name = 'Recipient Name is required';
    if (!form.recipient_contact_number?.trim()) errors.recipient_contact_number = 'Recipient Contact Number is required';
    else if (!/^\d{8,}$/.test(form.recipient_contact_number.replace(/\s+/g, ''))) errors.recipient_contact_number = 'Contact Number must be at least 8 digits';
    if (!form.recipient_email?.trim()) errors.recipient_email = 'Recipient Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.recipient_email)) errors.recipient_email = 'Please enter a valid email address';
    if (!form.address?.trim()) errors.address = 'Recipient Address is required';
  }

  if (!form.declaration) errors.declaration = 'You must agree to the declaration before submitting.';

  isValid = Object.keys(errors).length === 0;
  return isValid;
};

const submitForm = async () => {
  if (!validateForm()) {
    toast.error('Please correct the errors marked in the form.');
    const firstErrorField = document.querySelector('[class*="text-red-500"]');
    if (firstErrorField) {
      const fieldContainer = firstErrorField.closest('.space-y-2, .flex.items-start');
      if (fieldContainer) {
        fieldContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
    return;
  }

  const fullName = displayFullName.value;
  const requestData = {
    registration_no: form.registration_no || null,
    cid_no: form.cid_no,
    full_name: fullName,
    gender: form.gender,
    reason_for_application: form.reason_for_application,
    supervisor_name: form.supervisor_name,
    supervisor_designation: form.supervisor_designation,
    agency: form.agency,
    department: form.department,
    workplace: form.workplace,
    contact_number: form.contact_number,
    email_address: form.email_address,
    recipient_name: isRecipientSelf.value ? fullName : form.recipient_name,
    recipient_contact_number: isRecipientSelf.value ? form.user_contact_number : form.recipient_contact_number,
    recipient_email: isRecipientSelf.value ? form.user_email : form.recipient_email,
    address: isRecipientSelf.value ? null : form.address,
    po_box: isRecipientSelf.value ? null : form.po_box || null,
    zip_code: isRecipientSelf.value ? null : form.zip_code || null,
    declaration: form.declaration,
    review_status: 'Pending',
    endorsement_decision: 'Pending',
    is_active: true,
  };

  console.log("Submitting data:", JSON.stringify(requestData, null, 2));

  try {
    const response = await apiService.createEpcCogs(requestData);
    if (response.status === 201 || response.status === 200) {
      toast.success('Application submitted successfully!');
      clearDraft();
      router.push({ name: 'user-engineering-dashboard' });
    } else {
      toast.warning(`Application submitted but received status: ${response.status}. Please verify.`);
      clearDraft();
      router.push({ name: 'user-engineering-dashboard' });
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    let errorMsg = 'An error occurred during submission. Please try again.';
    if (error.response) {
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      errorMsg = `Server error: ${error.response.status}`;
      if (typeof error.response.data === 'object' && error.response.data !== null) {
        let details = '';
        if (error.response.data.detail) {
          details = error.response.data.detail;
        } else {
          details = Object.entries(error.response.data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ');
        }
        if (details) errorMsg += ` - ${details}`;
        Object.keys(error.response.data).forEach(key => {
          if (key in errors) {
            errors[key] = Array.isArray(error.response.data[key]) ? error.response.data[key].join(' ') : String(error.response.data[key]);
          }
        });
        if (Object.keys(errors).length > 0) {
          errorMsg = 'Please correct the errors highlighted in the form.';
        }
      } else if (typeof error.response.data === 'string') {
        errorMsg += ` - ${error.response.data}`;
      }
      toast.error(errorMsg);
    } else if (error.request) {
      toast.error('Could not reach the server. Please check your network connection.');
    } else {
      toast.error(errorMsg + ` (${error.message})`);
    }
  }
};

const resetFormFields = () => {
  const preservedData = {
    registration_no: form.registration_no,
    cid_no: form.cid_no,
    gender: form.gender,
    user_contact_number: form.user_contact_number,
    user_email: form.user_email,
    full_name: form.full_name,
  };

  Object.assign(form, {
    registration_no: '',
    cid_no: '',
    gender: '',
    user_contact_number: '',
    user_email: '',
    full_name: '',
    reason_for_application: '',
    supervisor_name: '',
    supervisor_designation: '',
    agency: null,
    department: null,
    workplace: null,
    contact_number: '',
    email_address: '',
    recipient_name: '',
    recipient_contact_number: '',
    recipient_email: '',
    address: '',
    po_box: '',
    zip_code: '',
    declaration: false,
  });

  Object.assign(form, preservedData);
  isRecipientSelf.value = true;
  Object.keys(errors).forEach((key) => delete errors[key]);
  updateRecipientDetails();
};

const cancelForm = () => {
  resetFormFields();
  clearDraft();
  toast.info('Form cleared and draft removed.');
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const updateRecipientDetails = () => {
  delete errors.recipient_name;
  delete errors.recipient_contact_number;
  delete errors.recipient_email;
  delete errors.address;

  if (isRecipientSelf.value) {
    const fullName = displayFullName.value;
    form.recipient_name = fullName || '';
    form.recipient_contact_number = form.user_contact_number || '';
    form.recipient_email = form.user_email || '';
    form.address = '';
    form.po_box = '';
    form.zip_code = '';
  }
};

watch(isRecipientSelf, () => {
  updateRecipientDetails();
});

const openTermsModal = () => { showTermsModal.value = true; };
const closeTermsModal = () => { showTermsModal.value = false; };

</script>

<style scoped>
.required::after {
  content: ' *';
  color: #ef4444;
  margin-left: 2px;
}

.transition { transition-property: opacity, transform; }
.ease-out { transition-timing-function: cubic-bezier(0, 0, 0.2, 1); }
.duration-200 { transition-duration: 200ms; }
.duration-150 { transition-duration: 150ms; }
.opacity-0 { opacity: 0; }
.scale-95 { transform: scale(.95); }
.opacity-100 { opacity: 1; }
.scale-100 { transform: scale(1); }
.ease-in { transition-timing-function: cubic-bezier(0.4, 0, 1, 1); }

.bg-green-100 { background-color: #dcfce7; }
.text-green-700 { color: #15803d; }
.bg-red-100 { background-color: #fee2e2; }
.text-red-700 { color: #b91c1c; }
.bg-yellow-500 { background-color: #f59e0b; }
.text-white { color: #ffffff; }

.relative { position: relative; }
.absolute { position: absolute; }
.z-10 { z-index: 10; }
.fixed.z-10 { z-index: 50; }

.prose p { margin-bottom: 1em; }
.prose-sm { font-size: 0.875rem; line-height: 1.5; }
</style>
```