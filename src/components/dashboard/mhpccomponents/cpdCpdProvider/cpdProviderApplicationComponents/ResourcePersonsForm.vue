<template>
  <div class="rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
      <h3 class="text-xl font-semibold text-gray-800 flex items-center">
        <span class="inline-block mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </span>
        Resource Persons Details
      </h3>
      <p class="mt-2 text-sm text-gray-600">
        Add information about the resource persons who will be conducting or supporting this CPD
        program.
      </p>
    </div>

    <div class="p-6 space-y-6">
      <!-- Error for general registration number requirement -->
      <p v-if="props.errors && props.errors.resourcePersonsRegNo" class="text-sm text-red-600 -mt-2 mb-2">
        {{ props.errors.resourcePersonsRegNo }}
      </p>
      <!-- Error for general certificate requirement -->
      <p v-if="props.errors && props.errors.resourcePersonCertificate" class="text-sm text-red-600 -mt-2 mb-2">
        {{ props.errors.resourcePersonCertificate }}
      </p>

      <!-- Primary Resource Person -->
      <div
        class="bg-gradient-to-r from-blue-50 to-blue-50 p-5 rounded-lg border border-blue-100 shadow-sm"
      >
        <h4 class="text-md font-medium text-gray-800 mb-4 flex items-center">
          <!-- ... icon ... -->
          Primary Resource Person
        </h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Registration Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Registration Number <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <select
                :value="localResourcePersons[0]?.regNo"
                @change="updateRegNo(0, $event.target.value)"
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 pl-10 bg-white appearance-none pr-10"
                :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': props.errors && (props.errors.resourcePersonsRegNo || (props.errors.person_0_regNo)) }"
                :aria-describedby="props.errors && (props.errors.resourcePersonsRegNo || props.errors.person_0_regNo) ? 'rp-regno-error-0' : undefined"
              >
                <option value="" disabled>Select Registration Number</option>
                <option
                  v-for="reg in userRegistrations"
                  :key="reg.registration_no"
                  :value="reg.registration_no"
                >
                  {{ reg.registration_no }} - {{ reg.full_name }}
                </option>
              </select>
              <!-- ... icons ... -->
            </div>
            <p v-if="props.errors && props.errors.person_0_regNo" :id="'rp-regno-error-0'" class="mt-1 text-sm text-red-600">
                {{ props.errors.person_0_regNo }}
            </p>
            <!-- ... no users found message ... -->
            <!-- ... selected person indicator ... -->
          </div>

          <!-- Document Upload -->
          <div>
            <label for="certificates-0" class="block text-sm font-medium text-gray-700 mb-2">
              Document supporting expertise <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                :id="`certificates-${0}`"
                type="file"
                @change="handleLocalCertificateUpload($event, 0)"
                class="hidden"
                :aria-describedby="props.errors && (props.errors.resourcePersonCertificate || props.errors.person_0_certificate) ? 'rp-cert-error-0' : undefined"
              />
              <label
                :for="`certificates-${0}`"
                class="cursor-pointer flex items-center justify-center w-full text-sm text-gray-700 py-2.5 px-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors duration-200"
                :class="{ 'border-red-500': props.errors && (props.errors.resourcePersonCertificate || props.errors.person_0_certificate) }"
              >
                <!-- ... icon and text ... -->
                 {{
                  localResourcePersons[0]?.certificate
                    ? localResourcePersons[0].certificate.name
                    : 'Upload Document'
                }}
              </label>
            </div>
             <p v-if="props.errors && props.errors.person_0_certificate" :id="'rp-cert-error-0'" class="mt-1 text-sm text-red-600">
                {{ props.errors.person_0_certificate }}
            </p>
            <!-- ... accepted file format message ... -->
          </div>
        </div>
      </div>

      <!-- Additional Resource Persons -->
      <div v-if="localResourcePersons.length > 1" class="space-y-4">
        <!-- ... header ... -->
        <div
          v-for="(person, personIndex) in localResourcePersons.slice(1)"
          :key="personIndex + 1"
          class="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm transition-all hover:border-blue-200"
        >
          <div class="flex justify-end mb-4">
            <button
              type="button"
              @click="removeLocalResourcePerson(personIndex + 1)"
              class="text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
          <!-- ... person header and remove button ... -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Registration Number -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Registration Number <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <select
                  :value="person.regNo"
                  @change="updateRegNo(personIndex + 1, $event.target.value)"
                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 pl-10 bg-white appearance-none pr-10"
                  :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': props.errors && (props.errors.resourcePersonsRegNo || props.errors[`person_${personIndex + 1}_regNo`]) }"
                  :aria-describedby="props.errors && (props.errors.resourcePersonsRegNo || props.errors[`person_${personIndex + 1}_regNo`]) ? `rp-regno-error-${personIndex + 1}` : undefined"
                >
                  <!-- ... options ... -->
                </select>
                <!-- ... icons ... -->
              </div>
              <p v-if="props.errors && props.errors[`person_${personIndex + 1}_regNo`]" :id="`rp-regno-error-${personIndex + 1}`" class="mt-1 text-sm text-red-600">
                {{ props.errors[`person_${personIndex + 1}_regNo`] }}
              </p>
              <!-- ... selected person indicator ... -->
            </div>

            <!-- Document Upload -->
            <div>
              <label
                :for="`certificates-${personIndex + 1}`"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Document supporting expertise <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  :id="`certificates-${personIndex + 1}`"
                  type="file"
                  @change="handleLocalCertificateUpload($event, personIndex + 1)"
                  class="hidden"
                  :aria-describedby="props.errors && (props.errors.resourcePersonCertificate || props.errors[`person_${personIndex + 1}_certificate`]) ? `rp-cert-error-${personIndex + 1}` : undefined"
                />
                <label
                  :for="`certificates-${personIndex + 1}`"
                  class="cursor-pointer flex items-center justify-center w-full text-sm text-gray-700 py-2.5 px-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors duration-200"
                   :class="{ 'border-red-500': props.errors && (props.errors.resourcePersonCertificate || props.errors[`person_${personIndex + 1}_certificate`]) }"
                >
                  <!-- ... icon and text ... -->
                  {{ person.certificate ? person.certificate.name : 'Upload Document' }}
                </label>
              </div>
              <p v-if="props.errors && props.errors[`person_${personIndex + 1}_certificate`]" :id="`rp-cert-error-${personIndex + 1}`" class="mt-1 text-sm text-red-600">
                {{ props.errors[`person_${personIndex + 1}_certificate`] }}
              </p>
              <!-- ... accepted file format message ... -->
            </div>
          </div>
        </div>
      </div>
      <!-- Add Resource Person Button -->
      <button
        type="button"
        @click="addLocalResourcePerson"
        class="w-full mt-4 p-3 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 flex items-center justify-center transition-colors duration-200"
      >
        <span class="mr-2">+</span> Add Another Resource Person
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  resourcePersons: { type: Array, default: () => [{ regNo: '', name: '', certificate: null }] },
  // resourcePersonCertificate: Object, // No longer directly used for overall error, but parent might still pass it.
  fetchResourcePersonDetails: Function,
  // handleCertificateUpload: Function, // Parent handles this
  // addResourcePerson: Function, // Handled locally now
  // removeResourcePerson: Function, // Handled locally now
  userRegistrations: Array,
  errors: { // New prop for errors
    type: Object,
    default: () => ({})
    // Example: { resourcePersonsRegNo: 'All RPs need RegNo', resourcePersonCertificate: 'All RPs need Cert', person_0_regNo: 'Primary RP RegNo required', person_0_certificate: 'Primary RP Cert required' }
  }
});

const emit = defineEmits(['update:resourcePersons']);

const localResourcePersons = ref(
  JSON.parse(JSON.stringify(props.resourcePersons && props.resourcePersons.length > 0 ? props.resourcePersons : [{ regNo: '', name: '', certificate: null }]))
);

watch(
  () => props.resourcePersons,
  (newValue) => {
    const newDeepCopy = JSON.parse(JSON.stringify(newValue && newValue.length > 0 ? newValue : [{ regNo: '', name: '', certificate: null }]));
    if (JSON.stringify(localResourcePersons.value) !== JSON.stringify(newDeepCopy)) {
        localResourcePersons.value = newDeepCopy;
    }
  },
  { deep: true, immediate: true } // Immediate to ensure local state is set on mount
);

watch(
  localResourcePersons,
  (newValue) => {
    // Ensure at least one person object exists for the primary
    if (!newValue || newValue.length === 0) {
        const defaultPerson = [{ regNo: '', name: '', certificate: null }];
        emit('update:resourcePersons', defaultPerson); // Emit a valid structure
    } else {
        emit('update:resourcePersons', JSON.parse(JSON.stringify(newValue)));
    }
  },
  { deep: true }
);

const updateRegNo = async (index, regNo) => {
  if (!localResourcePersons.value[index]) localResourcePersons.value[index] = { regNo: '', name: '', certificate: null };
  localResourcePersons.value[index].regNo = regNo;
  // Find the name from userRegistrations
  const selectedUser = props.userRegistrations.find(u => u.registration_no === regNo);
  localResourcePersons.value[index].name = selectedUser ? selectedUser.full_name : '';
  // If you still need to call parent's fetch (e.g., for other side effects)
  if (props.fetchResourcePersonDetails) {
    await props.fetchResourcePersonDetails(localResourcePersons.value[index]); // Parent might update the name too
  }
  // No need to emit here, the watcher on localResourcePersons will handle it
};

const addLocalResourcePerson = () => {
  localResourcePersons.value.push({ regNo: '', name: '', certificate: null });
  // Watcher will emit
};

const removeLocalResourcePerson = (index) => {
  if (localResourcePersons.value.length > 1) { // Prevent removing the primary if it's the only one
    localResourcePersons.value.splice(index, 1);
  } else if (index === 0) { // If removing the primary and it's the only one, reset it
    localResourcePersons.value = [{ regNo: '', name: '', certificate: null }];
  }
  // Watcher will emit
};

const handleLocalCertificateUpload = (event, index) => {
  const file = event.target.files[0];
  if (!localResourcePersons.value[index]) localResourcePersons.value[index] = { regNo: '', name: '', certificate: null };

  if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
    localResourcePersons.value[index].certificate = file;
    // If parent needs to be notified about the specific file immediately (e.g. for preview or global state):
    // emit('certificate-uploaded', { index, file }); // Custom event
  } else {
    localResourcePersons.value[index].certificate = null; // Clear if invalid
    alert('Please upload a PDF file less than 5MB');
    event.target.value = ''; // Reset file input
  }
  // Watcher on localResourcePersons will emit the whole array update
};

// Ensure there's always at least one resource person object for the primary
if (!localResourcePersons.value || localResourcePersons.value.length === 0) {
  localResourcePersons.value = [{ regNo: '', name: '', certificate: null }];
}
</script>