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
      <!-- Primary Resource Person -->
      <div
        class="bg-gradient-to-r from-blue-50 to-blue-50 p-5 rounded-lg border border-blue-100 shadow-sm"
      >
        <h4 class="text-md font-medium text-gray-800 mb-4 flex items-center">
          <span class="inline-block mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </span>
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
                :value="localResourcePersons[0].regNo"
                @change="updateRegNo(0, $event.target.value)"
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 pl-10 bg-white appearance-none pr-10"
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
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                  />
                </svg>
              </div>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <p
              v-if="userRegistrations.length === 0"
              class="mt-2 text-sm text-red-600 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              No users found. Please ensure there are registered users in the system.
            </p>

            <!-- Selected Person Indicator -->
            <div
              v-if="localResourcePersons[0].name"
              class="mt-2 bg-blue-50 p-2 rounded-lg border border-blue-100"
            >
              <p class="text-sm text-blue-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-1 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span class="font-medium">{{ localResourcePersons[0].name }}</span>
              </p>
            </div>

            <!-- Hidden Name Field -->
            <input type="text" :value="localResourcePersons[0].name" class="hidden" readonly />
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
              />
              <label
                :for="`certificates-${0}`"
                class="cursor-pointer flex items-center justify-center w-full text-sm text-gray-700 py-2.5 px-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                {{
                  localResourcePersons[0].certificate
                    ? localResourcePersons[0].certificate.name
                    : 'Upload Document'
                }}
              </label>
            </div>
            <p class="text-xs text-gray-500 mt-1 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-3 w-3 mr-1 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Accepted file format: PDF (max 5MB)
            </p>
          </div>
        </div>
      </div>

      <!-- Additional Resource Persons -->
      <div v-if="localResourcePersons.length > 1" class="space-y-4">
        <h4 class="text-md font-medium text-gray-700 flex items-center">
          <span class="inline-block mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </span>
          Additional Resource Persons
        </h4>

        <div
          v-for="(person, personIndex) in localResourcePersons.slice(1)"
          :key="personIndex + 1"
          class="bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm transition-all hover:border-blue-200"
        >
          <div class="flex items-center justify-between mb-4">
            <h5 class="font-medium text-gray-800 flex items-center">
              <span class="inline-block mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              Resource Person #{{ personIndex + 1 }}
            </h5>
            <button
              @click="removeLocalResourcePerson(personIndex + 1)"
              class="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200 flex items-center"
              title="Remove this resource person"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>

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
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                </div>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <!-- Selected Person Indicator -->
              <div v-if="person.name" class="mt-2 bg-blue-50 p-2 rounded-lg border border-blue-100">
                <p class="text-sm text-blue-800 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-1 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span class="font-medium">{{ person.name }}</span>
                </p>
              </div>

              <!-- Hidden Name Field -->
              <input type="text" :value="person.name" class="hidden" readonly />
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
                />
                <label
                  :for="`certificates-${personIndex + 1}`"
                  class="cursor-pointer flex items-center justify-center w-full text-sm text-gray-700 py-2.5 px-4 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-2 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  {{ person.certificate ? person.certificate.name : 'Upload Document' }}
                </label>
              </div>
              <p class="text-xs text-gray-500 mt-1 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-3 mr-1 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Accepted file format: PDF (max 5MB)
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Resource Person Button -->
      <div class="flex justify-center md:justify-start mt-6">
        <button
          @click="addLocalResourcePerson"
          class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
          Add Resource Person
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  resourcePersons: { type: Array, default: () => [{ regNo: '', name: '', certificate: null }] },
  resourcePersonCertificate: Object, // Retained for backward compatibility, but not used
  fetchResourcePersonDetails: Function,
  handleCertificateUpload: Function, // Parent will handle validation
  addResourcePerson: Function,
  removeResourcePerson: Function,
  userRegistrations: Array,
})

const emit = defineEmits(['update:resourcePersons'])

// Create a local copy of resourcePersons to avoid mutating the prop
const localResourcePersons = ref([...props.resourcePersons])

// Watch for changes in props.resourcePersons to sync with local state
watch(
  () => props.resourcePersons,
  (newValue) => {
    localResourcePersons.value = [...newValue]
  },
  { deep: true }
)

// Watch for changes in localResourcePersons and emit to parent
watch(
  localResourcePersons,
  (newValue) => {
    emit('update:resourcePersons', [...newValue])
  },
  { deep: true }
)

// Update registration number and fetch details
const updateRegNo = async (index, regNo) => {
  localResourcePersons.value[index] = { ...localResourcePersons.value[index], regNo }
  await props.fetchResourcePersonDetails(localResourcePersons.value[index])
  localResourcePersons.value[index].name = localResourcePersons.value[index].name || ''
  emit('update:resourcePersons', [...localResourcePersons.value])
}

// Add a new resource person locally
const addLocalResourcePerson = () => {
  localResourcePersons.value.push({ regNo: '', name: '', certificate: null })
  emit('update:resourcePersons', [...localResourcePersons.value])
}

// Remove a resource person locally
const removeLocalResourcePerson = (index) => {
  localResourcePersons.value.splice(index, 1)
  emit('update:resourcePersons', [...localResourcePersons.value])
}

// Handle certificate upload for a specific resource person
const handleLocalCertificateUpload = (event, index) => {
  const file = event.target.files[0]
  if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
    localResourcePersons.value[index] = { ...localResourcePersons.value[index], certificate: file }
    emit('update:resourcePersons', [...localResourcePersons.value])
  } else {
    alert('Please upload a PDF file less than 5MB')
    event.target.value = ''
  }
}
</script>
