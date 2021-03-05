<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
          <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">Institute Profile</h2>
          <p class="text-gray-600 text-center max-w-2xl mx-auto">Manage your institution's information and settings</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="saveProfile" class="p-6">
          <div v-if="errorMessage" class="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2">
            <CircleAlert class="w-5 h-5" />
            {{ errorMessage }}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="(field, key) in profile" :key="key" :class="{ 'md:col-span-2': field.type === 'textarea' }"
              class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                {{ field.label }}
                <span v-if="field.required" class="text-red-500">*</span>
              </label>

              <component :is="field.type === 'textarea' ? 'textarea' : 'input'" v-if="field.type !== 'select'"
                v-model="field.value" :type="field.type" :placeholder="field.label"
                :rows="field.type === 'textarea' ? 3 : undefined" class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5
                           transition-colors disabled:bg-gray-50 disabled:text-gray-500" :disabled="isLoading"
                @blur="errorMessage = validateField(field, field.value)" />

              <select v-else v-model="field.value" class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5
                           transition-colors disabled:bg-gray-50 disabled:text-gray-500" :disabled="isLoading">
                <option value="" disabled>{{ field.placeholder }}</option>
                <option v-for="option in field.options" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end space-x-4 mt-8 pt-6 border-t p-8">
            <button type="button" @click="cancelEdit"
              class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              :disabled="isLoading">
              Reset
            </button>

            <button type="submit"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
              :disabled="isLoading">
              <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
              <Check v-else-if="isSaved" class="w-4 h-4" />
              <span>{{ isLoading ? 'Saving...' : isSaved ? 'Saved!' : 'Save Profile' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { Check, CircleAlert, Loader2 } from 'lucide-vue-next'

const isLoading = ref(false)
const isSaved = ref(false)
const errorMessage = ref('')

const profile = reactive({
  institutionName: {
    label: 'Name of Institution',
    type: 'text',
    value: '',
    required: true,
    validation: value => value.length >= 3 || 'Institution name must be at least 3 characters'
  },
  address: {
    label: 'Address/Location',
    type: 'textarea',
    value: '',
    required: true,
    validation: value => value.length >= 10 || 'Please provide a detailed address'
  },
  gewog: {
    label: 'Gewog/Throm',
    type: 'select',
    value: '',
    options: ['Gewog A', 'Gewog B', 'Gewog C'],
    placeholder: 'Select Gewog',
    required: true
  },
  dzongkhag: {
    label: 'Dzongkhag/Throm',
    type: 'select',
    value: '',
    options: ['Thimphu', 'Paro', 'Wangdue Phodrang'],
    placeholder: 'Select Dzongkhag',
    required: true
  },
  contactNumber: {
    label: 'Contact Number',
    type: 'tel',
    value: '',
    required: true,
    validation: value => /^\d{8}$/.test(value) || 'Contact number must be 8 digits'
  },
  emailAddress: {
    label: 'Email Address',
    type: 'email',
    value: '',
    required: true,
    validation: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Please enter a valid email'
  },
  telephoneNumber: {
    label: 'Telephone Number',
    type: 'tel',
    value: '',
    validation: value => !value || /^\d{2}-\d{5}$/.test(value) || 'Format: XX-XXXXX'
  },
  yearEstablished: {
    label: 'Year of Establishment',
    type: 'number',
    value: '',
    required: true,
    validation: value => value >= 1900 && value <= new Date().getFullYear() || 'Please enter a valid year'
  },
  institutionType: {
    label: 'Type of Institution',
    type: 'select',
    value: '',
    options: ['Constituent', 'Affiliated', 'Other'],
    placeholder: 'Select Type',
    required: true
  },
  affiliatedTo: {
    label: 'Affiliated to, if relevant',
    type: 'text',
    value: ''
  },
  levelOfAutonomy: {
    label: 'Level of Autonomy (if affiliated)',
    type: 'text',
    value: ''
  },
  fundingSource: {
    label: 'Source of Funding',
    type: 'select',
    value: '',
    options: ['Government', 'Private', 'Donation'],
    placeholder: 'Select Funding Source',
    required: true
  },
  totalArea: {
    label: 'Total area (in acres)',
    type: 'number',
    value: '',
    required: true,
    validation: value => value > 0 || 'Area must be greater than 0'
  },
  website: {
    label: 'Website',
    type: 'url',
    value: '',
    validation: value => !value || /^https?:\/\/.*/.test(value) || 'Please enter a valid URL starting with http:// or https://'
  },
});

const validateField = (field, value) => {
  if (field.required && !value) {
    return `${field.label} is required`;
  }
  if (field.validation && value) {
    const result = field.validation(value);
    if (typeof result === 'string') {
      return result;
    }
  }
  return '';
}

const fetchProfile = async () => {
  isLoading.value = true;
  try {
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    Object.keys(profile).forEach(key => {
      profile[key].value = {
        institutionName: 'Example Institute',
        address: '123 Main Street, Thimphu',
        gewog: 'Gewog A',
        dzongkhag: 'Thimphu',
        contactNumber: '17123456',
        emailAddress: 'info@example.com',
        telephoneNumber: '02-33456',
        yearEstablished: '2000',
        institutionType: 'Constituent',
        affiliatedTo: '',
        levelOfAutonomy: '',
        fundingSource: 'Government',
        totalArea: '10',
        website: 'https://www.example.com',
      }[key] || '';
    });
  } catch {
    errorMessage.value = 'Failed to load profile data';
  } finally {
    isLoading.value = false;
  }
};

const saveProfile = async () => {
  errorMessage.value = '';
  isSaved.value = false;

  // Validate all fields
  const errors = Object.entries(profile).map(([key, field]) => ({
    field: key,
    error: validateField(field, field.value)
  })).filter(({ error }) => error);

  if (errors.length > 0) {
    errorMessage.value = errors[0].error;
    return;
  }

  isLoading.value = true;
  try {
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Convert profile to submission format
    const submissionData = Object.entries(profile).reduce((acc, [key, field]) => {
      acc[key] = field.value;
      return acc;
    }, {});

    console.log('Saving profile:', submissionData);
    isSaved.value = true;

    // Reset saved status after 3 seconds
    setTimeout(() => {
      isSaved.value = false;
    }, 3000);
  } catch {
    errorMessage.value = 'Failed to save profile data';
  } finally {
    isLoading.value = false;
  }
};

const cancelEdit = () => {
  fetchProfile();
};

onMounted(fetchProfile);
</script>
