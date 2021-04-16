<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="mx-auto px-4 relative"> <!-- Added relative positioning for overlay -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10 relative">
          <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">Institute Profile</h2>
          <p class="text-gray-600 text-center max-w-2xl mx-auto">
            Manage your institution's information and settings
          </p>
           <!-- Edit Button -->
           <button
              v-if="!isEditing && !isInitialLoading && profileId"
              @click="editProfile"
              type="button"
              class="absolute top-4 right-4 bg-white hover:bg-gray-100 text-gray-700 p-2 rounded-full shadow transition-colors"
              title="Edit Profile"
           >
              <Pencil class="w-5 h-5" />
           </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="saveProfile" class="p-6">
          <!-- Loading Overlay -->
          <div v-if="isInitialLoading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-2xl">
             <Loader2 class="w-8 h-8 animate-spin text-blue-600" />
             <span class="ml-2 text-gray-700">Loading Profile...</span>
          </div>

          <!-- Error Message -->
          <div
            v-if="errorMessage"
            class="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-2"
          >
            <CircleAlert class="w-5 h-5" />
            {{ errorMessage }}
          </div>

          <!-- Form Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="(field, key) in profile"
              :key="key"
              :class="{ 'md:col-span-2': field.type === 'textarea' }"
              class="space-y-1"
            >
              <label :for="key" class="block text-sm font-medium text-gray-700">
                {{ field.label }}
                <span v-if="field.required" class="text-red-500">*</span>
              </label>

              <!-- Input / Textarea -->
              <component
                :is="field.type === 'textarea' ? 'textarea' : 'input'"
                v-if="field.type !== 'select'"
                :id="key"
                v-model="field.value"
                :type="field.type"
                :placeholder="field.placeholder || field.label"
                :rows="field.type === 'textarea' ? 3 : undefined"
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 transition-colors disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed"
                :disabled="!isEditing || isLoading || isInitialLoading"
                @blur="validateFieldOnBlur(key)"
              />

              <!-- Select -->
               <select
                v-else-if="field.options && field.options.length > 0"
                :id="key"
                v-model="field.value"
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 transition-colors disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed appearance-none disabled:appearance-none"
                :disabled="!isEditing || isLoading || isInitialLoading"
                @blur="validateFieldOnBlur(key)"
               >
                 <option value="" disabled>{{ field.placeholder || `Select ${field.label}` }}</option>
                 <!-- Assumes options is an array of strings or objects with value/text -->
                 <option v-for="option in field.options" :key="option.value || option" :value="option.value || option">
                   {{ option.text || option }}
                 </option>
               </select>
               <!-- Display simple text if it's a select field type but options are empty (e.g., for Gewog/Dzongkhag if treated as text) -->
                <input
                    v-else
                    type="text"
                    :id="key"
                    :value="field.value"
                    :placeholder="field.placeholder || field.label"
                    class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 transition-colors disabled:bg-gray-100 disabled:text-gray-600 disabled:cursor-not-allowed"
                    disabled
                />


              <!-- Validation Error -->
              <p v-if="field.error && isEditing" class="text-xs text-red-600 mt-1">{{ field.error }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div v-if="isEditing" class="flex items-center justify-end space-x-4 mt-8 pt-6 border-t p-8">
             <!-- Cancel Button -->
            <button
              type="button"
              @click="cancelEdit"
              class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
              :disabled="isLoading || isInitialLoading"
            >
              Cancel
            </button>

            <!-- Reset Button (Optional - maybe remove if Cancel does the same) -->
             <button
               type="button"
               @click="resetForm"
               class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
               :disabled="isLoading || isInitialLoading"
             >
               Reset
             </button>

             <!-- Save Button -->
            <button
              type="submit"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              :disabled="isLoading || isInitialLoading || Object.values(profile).some(f => f.error)"
            >
              <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />
              <Check v-else-if="isSaved" class="w-4 h-4" />
              <span>{{ isLoading ? 'Saving...' : isSaved ? 'Saved!' : 'Save Changes' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { Check, CircleAlert, Loader2, Pencil } from 'lucide-vue-next'; // Added Pencil for Edit icon
// Import your API client - adjust path if needed
import apiService from '@/services/services'; // Assuming services.js exports the object

const isLoading = ref(false); // For save operation
const isInitialLoading = ref(false); // For initial data fetch
const isSaved = ref(false);
const errorMessage = ref('');
const profileId = ref(null); // To store the ID of the existing profile
const initialProfileData = ref(null); // To store the initially fetched data for reset/cancel
const isEditing = ref(false); // <-- New state for edit mode

// --- Key Mapping (API keys to Frontend keys) ---
// Maps the keys from your API response ('backendKey') to the keys used in your 'profile' object ('frontendKey')
// *** DOUBLE-CHECK THIS MAPPING AGAINST YOUR API RESPONSE AND profile OBJECT ***
const keyMap = {
  institutionName: 'name_of_institution',
  address: 'address',
  gewog: 'gewog_throm',
  dzongkhag: 'dzongkhag_throm',
  contactNumber: 'contact_number',
  emailAddress: 'email_address',
  telephoneNumber: 'telephone_number',
  yearEstablished: 'year_of_establishment',
  institutionType: 'type_of_institution',
  affiliatedTo: 'affiliated_to',
  levelOfAutonomy: 'level_of_autonomy',
  fundingSource: 'source_of_funding', // Will need special handling for nested object
  totalArea: 'total_area',
  website: 'website',
  // Add mappings for any other fields from the API you want to display/edit
  // e.g., instituteHeadName: 'institute_head_name',
};

// --- Profile Definition (Frontend Structure) ---
// *** ENSURE KEYS HERE MATCH THE LEFT SIDE OF keyMap ***
const profile = reactive({
  institutionName: {
    label: 'Name of Institution',
    type: 'text',
    value: '',
    required: true,
    validation: (value) => value.length >= 3 || 'Institution name must be at least 3 characters',
    placeholder: 'Enter institution name',
    error: '',
  },
  address: {
    label: 'Address/Location',
    type: 'textarea',
    value: '',
    required: true,
    validation: (value) => value.length >= 10 || 'Please provide a detailed address',
    placeholder: 'Enter full address',
    error: '',
  },
  gewog: { // Frontend key
    label: 'Gewog/Throm',
    type: 'text', // Treat as text since API gives string and no options provided
    value: '',
    options: [], // No options for text display
    placeholder: 'Gewog/Throm',
    required: true,
    validation: (value) => !!value || 'Gewog is required',
    error: '',
  },
  dzongkhag: { // Frontend key
    label: 'Dzongkhag/Throm',
    type: 'text', // Treat as text since API gives string and no options provided
    value: '',
    options: [], // No options for text display
    placeholder: 'Dzongkhag/Throm',
    required: true,
    validation: (value) => !!value || 'Dzongkhag is required',
    error: '',
  },
  contactNumber: { // Frontend key
    label: 'Contact Number',
    type: 'tel',
    value: '',
    required: true,
    validation: (value) => /^\d+$/.test(value) || 'Contact number must contain only digits',
    placeholder: 'e.g., 17123456',
    error: '',
  },
  emailAddress: { // Frontend key
    label: 'Email Address',
    type: 'email',
    value: '',
    required: true,
    validation: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Please enter a valid email',
    placeholder: 'e.g., info@example.com',
    error: '',
  },
  telephoneNumber: { // Frontend key
    label: 'Telephone Number (Optional)',
    type: 'tel',
    value: '',
    validation: (value) => !value || /^\d+$/.test(value) || 'Format: Digits only',
    placeholder: 'e.g., 02334455',
    error: '',
  },
  yearEstablished: { // Frontend key
    label: 'Year of Establishment',
    type: 'number',
    value: '',
    required: true,
    validation: (value) =>
      (value >= 1900 && value <= new Date().getFullYear()) || `Year must be between 1900 and ${new Date().getFullYear()}`,
    placeholder: 'e.g., 2005',
    error: '',
  },
  institutionType: { // Frontend key
    label: 'Type of Institution',
    type: 'select',
    value: '',
    options: ['Constituent', 'Affiliated', 'Other'], // Keep options for editing
    placeholder: 'Select Type',
    required: true,
    validation: (value) => !!value || 'Institution type is required',
    error: '',
  },
  affiliatedTo: { // Frontend key
    label: 'Affiliated to (if relevant)',
    type: 'text',
    value: '',
    required: false,
    placeholder: 'Name of parent institution',
    error: '',
  },
  levelOfAutonomy: { // Frontend key
    label: 'Level of Autonomy (if affiliated)',
    type: 'text',
    value: '',
    required: false,
    placeholder: 'e.g., Full, Partial',
    error: '',
  },
  fundingSource: { // Frontend key
    label: 'Source of Funding',
    type: 'select',
    value: '',
    // Ideally fetch these from API, adding 'UN' based on example data
    options: ['Government', 'Private', 'Donation', 'Mixed', 'UN'],
    placeholder: 'Select Funding Source',
    required: true,
    validation: (value) => !!value || 'Funding source is required',
    error: '',
  },
  totalArea: { // Frontend key
    label: 'Total area (in acres)',
    type: 'number',
    value: '',
    required: true,
    validation: (value) => (value > 0 && Number.isFinite(Number(value))) || 'Area must be a positive number',
    placeholder: 'e.g., 10.5',
    error: '',
  },
  website: { // Frontend key
    label: 'Website (Optional)',
    type: 'url',
    value: '',
    required: false,
    validation: (value) =>
      !value ||
      (/^(https?:\/\/)/.test(value) && value.length > 8) ||
      'Please enter a valid URL starting with http:// or https://',
    placeholder: 'https://www.example.com',
    error: '',
  },
});

// --- Validation (Keep as is) ---
const validateField = (key) => {
  const field = profile[key];
  if (!field) return '';
  let errorMsg = '';
  const value = field.value;
  if (field.required && (value === null || value === undefined || String(value).trim() === '')) {
    errorMsg = `${field.label} is required`;
  } else if (value && field.validation) {
    const result = field.validation(value);
    if (typeof result === 'string') { errorMsg = result; }
  }
  field.error = errorMsg;
  return errorMsg;
};

const validateAllFields = () => {
  let firstErrorMessage = '';
  Object.keys(profile).forEach(key => {
    const error = validateField(key);
    if (error && !firstErrorMessage) {
      firstErrorMessage = error;
    }
  });
  errorMessage.value = firstErrorMessage;
  return !firstErrorMessage;
};

const validateFieldOnBlur = (key) => {
  validateField(key);
   if (!profile[key].error) {
       if (errorMessage.value === validateField(key)) {
           const hasOtherErrors = Object.values(profile).some(f => f.error);
           if (!hasOtherErrors) errorMessage.value = '';
           else {
               const nextErrorField = Object.values(profile).find(f => f.error);
               errorMessage.value = nextErrorField ? nextErrorField.error : '';
           }
       }
   } else {
       if (!errorMessage.value) {
           errorMessage.value = profile[key].error;
       }
   }
};

// --- API Interaction ---

const fetchProfile = async () => {
  isInitialLoading.value = true;
  errorMessage.value = '';
  isEditing.value = false; // Start in non-edit mode
  try {
    const response = await apiService.getInstitutionProfiles();

    if (response.data && Array.isArray(response.data.results) && response.data.results.length > 0) {
      const fetchedProfile = response.data.results[0];
      profileId.value = fetchedProfile.id;
      initialProfileData.value = JSON.parse(JSON.stringify(fetchedProfile));

      // --- Map fetched data with DETAILED LOGGING ---
      console.log("Starting data mapping. Fetched data:", fetchedProfile); // Log the whole object once

      Object.keys(profile).forEach((frontendKey) => {
          const backendKey = keyMap[frontendKey];
          const field = profile[frontendKey];
          console.log(`--- Processing Frontend Key: ${frontendKey} ---`); // Log which field is being processed

          if (!backendKey) {
              console.warn(`   - No backend key mapped. Skipping.`);
              field.value = '';
              return; // Skip to next frontend key
          }
          console.log(`   - Mapped to Backend Key: ${backendKey}`);

          // Explicitly check if the key exists in the fetched data
          if (!Object.hasOwn(fetchedProfile, backendKey)) {
              console.warn(`   - Backend key "${backendKey}" not found in fetched data.`);
              field.value = '';
              return; // Skip to next frontend key
          }

          const apiValue = fetchedProfile[backendKey];
          console.log(`   - Raw API Value for "${backendKey}":`, apiValue, `(Type: ${typeof apiValue})`); // Log raw value and type

          // Special handling for nested objects (like source_of_funding)
          if (backendKey === 'source_of_funding') {
              field.value = apiValue?.name || ''; // Assign the name
              console.log(`   - Assigned (Nested Handling): "${field.value}"`);
          }
          // Add similar 'else if' blocks here for other nested objects if needed
          // else if (backendKey === 'qualification_category') { field.value = apiValue?.qualification_name || ''; ... }
          else if (apiValue !== undefined && apiValue !== null) {
              // Handle potential type mismatches for standard fields
              if (field.type === 'number') {
                  const numValue = parseFloat(apiValue);
                  if (!isNaN(numValue)) {
                      field.value = numValue;
                      console.log(`   - Assigned (Number Parsed): ${field.value}`);
                  } else {
                      field.value = ''; // Assign empty if parsing fails
                      console.log(`   - Assigned empty (Number Parsing Failed for '${apiValue}')`);
                  }
              } else {
                  // Direct assignment for text, email, tel, url, textarea, select (if value is simple string)
                  field.value = apiValue;
                  console.log(`   - Assigned (Direct): "${field.value}"`);
              }
          } else {
              // Reset field if key exists but value is null/undefined
              field.value = '';
              console.log(`   - Assigned empty (API value is null/undefined)`);
          }
          field.error = ''; // Clear any previous errors
      });

      console.log('Profile data after mapping:', JSON.parse(JSON.stringify(profile))); // Log the final state

    } else {
      console.log('No existing institution profile found.');
      profileId.value = null;
      initialProfileData.value = null;
      Object.keys(profile).forEach((key) => {
        profile[key].value = '';
        profile[key].error = '';
      });
    }
  } catch (error) {
    console.error('Failed to load profile data:', error);
     if (error.response?.data?.code === 'token_not_valid') {
        errorMessage.value = 'Authentication error: Your session may have expired. Please log in again.';
     } else if (error.response?.status === 404) {
        errorMessage.value = 'No institution profile found.';
     } else {
        errorMessage.value = 'Failed to load profile data. Please try again later.';
     }
    profileId.value = null;
    initialProfileData.value = null;
  } finally {
    isInitialLoading.value = false;
  }
};

const saveProfile = async () => {
  errorMessage.value = '';
  isSaved.value = false;

  if (!validateAllFields()) {
    const firstErrorKey = Object.keys(profile).find(key => profile[key].error);
    if (firstErrorKey) { document.getElementById(firstErrorKey)?.focus(); }
    return;
  }

  isLoading.value = true;
  try {
    // --- Convert profile state back to API submission format using keyMap ---
    const submissionData = {};
    for (const [frontendKey, field] of Object.entries(profile)) {
        const backendKey = keyMap[frontendKey];
        if (!backendKey) continue;

         // Exclude helper properties if they exist directly on the field object
         if (['label', 'type', 'required', 'validation', 'options', 'placeholder', 'error'].includes(frontendKey)) continue;


        // **IMPORTANT**: Handle Foreign Keys (like source_of_funding)
        // TODO: Replace this with logic to find the ID based on the selected name (field.value)
        // This requires having master data fetched (e.g., funding sources with IDs and names)
        if (backendKey === 'source_of_funding') {
           console.warn(`Sending funding source name ('${field.value}') instead of ID. Backend might require ID.`);
           // Option 1: Find ID if master data exists
           // const funding = masterFundingSources.find(f => f.name === field.value);
           // submissionData[backendKey] = funding ? funding.id : null;
           // Option 2: Send null (safer if backend expects ID)
           submissionData[backendKey] = null;
        }
        // Handle Gewog/Dzongkhag - assuming text for now
        else if (backendKey === 'gewog_throm' || backendKey === 'dzongkhag_throm') {
             submissionData[backendKey] = field.value || null;
        }
        else if (profile[frontendKey]?.type === 'number' && (field.value === '' || field.value === null)) {
             submissionData[backendKey] = null; // Send null for empty numbers
        } else {
            submissionData[backendKey] = field.value; // Send the value directly
        }
    }

    let response;
    console.log('Submitting data:', submissionData); // Log data being sent

    if (profileId.value) {
      console.log('Updating profile:', profileId.value);
      response = await apiService.updateInstitutionProfile(profileId.value, submissionData);
    } else {
      console.log('Creating new profile:');
      response = await apiService.createInstitutionProfile(submissionData);
      profileId.value = response.data.id;
    }

    console.log('Save successful:', response.data);
    isSaved.value = true;
    isEditing.value = false; // Exit edit mode

    // Re-fetch or update initialProfileData and form fields with saved data
    initialProfileData.value = JSON.parse(JSON.stringify(response.data));
    // --- Map saved data back to the reactive profile object ---
      const savedData = response.data;
      Object.keys(profile).forEach((frontendKey) => {
        const backendKey = keyMap[frontendKey];
        const field = profile[frontendKey];
        if (!backendKey) return;

        if (backendKey === 'source_of_funding') {
          field.value = savedData.source_of_funding?.name || '';
        } else if (Object.hasOwn(savedData, backendKey) && savedData[backendKey] !== null) {
           if (field.type === 'number') {
                const numValue = parseFloat(savedData[backendKey]);
                field.value = isNaN(numValue) ? '' : numValue;
           } else {
              field.value = savedData[backendKey];
           }
        } else {
          field.value = '';
        }
        field.error = '';
      });


    setTimeout(() => { isSaved.value = false; }, 3000);

  } catch (error) {
    console.error('Failed to save profile data:', error);
    console.error('Error response data:', error.response?.data);
    errorMessage.value = 'Failed to save profile data. ';
    if (error.response?.data) {
        const backendErrors = error.response.data;
        let errorDetails = '';
         if (typeof backendErrors === 'object' && !Array.isArray(backendErrors)) {
             errorDetails = Object.entries(backendErrors)
                 .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                 .join('; ');
         } else if (typeof backendErrors.detail === 'string') {
            errorDetails = backendErrors.detail;
         } else if (typeof backendErrors === 'string') {
             errorDetails = backendErrors;
         }
         errorMessage.value += errorDetails || 'Please check your input and try again.';
    } else {
        errorMessage.value += 'An unexpected error occurred.';
    }
  } finally {
    isLoading.value = false;
  }
};

// --- Edit Mode Controls ---
const editProfile = () => {
  isEditing.value = true;
};

const cancelEdit = () => {
  isEditing.value = false;
  resetForm(); // Reset changes when canceling
};

// Renamed from cancelEdit to resetForm for clarity
const resetForm = () => {
   errorMessage.value = ''; // Clear validation messages
   if (initialProfileData.value) {
      // Reset to the initially fetched data using the mapping logic again
      console.log("Resetting form to initial data:", initialProfileData.value);
      Object.keys(profile).forEach((frontendKey) => {
        const backendKey = keyMap[frontendKey];
        const field = profile[frontendKey];
         if (!backendKey) { field.value = ''; return; }

         // Check if backend key exists in initial data
         if (!Object.hasOwn(initialProfileData.value, backendKey)) {
            console.warn(`   - Reset: Backend key "${backendKey}" not found in initial data.`);
            field.value = '';
            return;
         }

         const initialValue = initialProfileData.value[backendKey];
         console.log(`   - Resetting ${frontendKey} (${backendKey}) to:`, initialValue);

         if (backendKey === 'source_of_funding') {
           field.value = initialProfileData.value.source_of_funding?.name || '';
         }
         // Add similar blocks for other nested objects if needed
         else if (initialValue !== undefined && initialValue !== null) {
            if (field.type === 'number') {
                const numValue = parseFloat(initialValue);
                field.value = isNaN(numValue) ? '' : numValue;
            } else {
              field.value = initialValue;
            }
         } else {
           field.value = '';
         }
         field.error = ''; // Clear errors
      });
      profileId.value = initialProfileData.value.id; // Restore original ID
   } else {
      // If there was no initial data, just clear fields
      Object.keys(profile).forEach((key) => {
         profile[key].value = '';
         profile[key].error = '';
      });
      profileId.value = null;
   }
   isSaved.value = false; // Ensure save indicator is off
   console.log('Form reset complete.');
};


// --- Lifecycle Hook ---
onMounted(() => {
  fetchProfile(); // Fetch data when component is mounted
  // TODO: Fetch master data for select options (Gewog, Dzongkhag, Funding Source IDs, etc.) here
});
</script>

<style scoped>
/* Improve disabled state visibility */
button:disabled, input:disabled, select:disabled, textarea:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
input:disabled, select:disabled, textarea:disabled {
    background-color: #f3f4f6; /* Tailwind gray-100 */
    color: #4b5563; /* Tailwind gray-600 */
}

/* Style for loading overlay */
.absolute.inset-0 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>