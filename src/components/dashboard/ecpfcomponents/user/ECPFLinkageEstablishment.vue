<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">ECPF Linkage Establishment</h1>
      <p class="text-gray-600">
        Submit details for establishing linkages with Higher Education Institutions (HEIs).
      </p>
    </div>

    <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <form @submit.prevent="submitApplication">
        <!-- ECPF Details (Read-Only) - Assuming this is fetched or static -->
        <section class="mb-8">
          <h2 class="text-lg font-medium mb-4 text-gray-700">ECPF Details (Read-Only)</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name of the ECPF</label>
              <input
                type="text"
                :value="ecpfDetails.name"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Proprietor of the ECPF</label>
              <input
                type="text"
                :value="ecpfDetails.proprietor"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">CID of the Proprietor</label>
              <input
                type="text"
                :value="ecpfDetails.cid"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Location of ECPF</label>
              <input
                type="text"
                :value="ecpfDetails.location"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Contact No.</label>
              <input
                type="text"
                :value="ecpfDetails.contactNo"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                :value="ecpfDetails.email"
                readonly
                class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
        </section>

        <!-- Institute Linkages Section -->
        <div v-for="(linkage, index) in linkages" :key="index" class="mb-10 border-b pb-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium text-gray-700">
              Institute Linkage #{{ index + 1 }} Details
            </h2>
            <button
              v-if="linkages.length > 1"
              type="button"
              @click="removeLinkage(index)"
              class="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 required-field"
                >Name of College/University/Institute</label
              >
              <input
                type="text"
                v-model="linkage.name"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 required-field">Location</label>
              <input
                type="text"
                v-model="linkage.location"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 required-field">Country</label>
              <select
                v-model="linkage.country"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option disabled value="">Select Country</option>
                <option v-for="country in countryOptions" :key="country.code" :value="country.code">
                  {{ country.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 required-field"
                >Recognition/Accreditation Document</label
              >
              <input
                type="file"
                @change="handleFileUpload($event, index, 'recognitionAccreditationDoc')"
                required
                class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <span v-if="linkage.recognitionAccreditationDocName" class="text-xs text-gray-600 mt-1 block">
                Selected: {{ linkage.recognitionAccreditationDocName }}
              </span>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 required-field"
                >Approval from University Document</label
              >
              <input
                type="file"
                @change="handleFileUpload($event, index, 'approvalFromUniversityDoc')"
                required
                class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
               <span v-if="linkage.approvalFromUniversityDocName" class="text-xs text-gray-600 mt-1 block">
                Selected: {{ linkage.approvalFromUniversityDocName }}
              </span>
            </div>

            <!-- Optional fields from your original form, you can keep or remove -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Official Website</label>
              <input
                type="url"
                v-model="linkage.website"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Year of Establishment</label>
              <input
                type="number"
                v-model.number="linkage.yearEstablished"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
             <div>
              <label class="block text-sm font-medium text-gray-700"
                >Report on visit/collaboration (Optional)</label
              >
              <input
                type="file"
                 @change="handleFileUpload($event, index, 'reportDoc')"
                class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <span v-if="linkage.reportDocName" class="text-xs text-gray-600 mt-1 block">
                Selected: {{ linkage.reportDocName }}
              </span>
            </div>
          </div>
        </div>

        <div class="mt-6 mb-8">
          <button
            type="button"
            @click="addLinkage"
            class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Add More Linkage
          </button>
        </div>

        <!-- Declaration -->
        <div class="mt-8 mb-6">
          <label class="flex items-center">
            <input type="checkbox" v-model="declarationAccepted" class="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
            <span class="ml-2 text-sm text-gray-700 required-field">
              I hereby declare that the information provided is true and correct to the best of my knowledge.
            </span>
          </label>
        </div>

        <!-- Action Buttons -->
        <div class="mt-10 flex justify-end space-x-4">
          <button
            type="button"
            @click="cancelForm"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="saveApplicationAsDraft"
            :disabled="!atLeastOneLinkageIsValidForDraft()"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            :disabled="!isFormValid()"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
     <!-- Placeholder for View/Edit/Delete existing proposals -->
    <section v-if="applicationIdToEdit" class="mt-10 bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <h2 class="text-lg font-medium mb-4 text-gray-700">Manage Existing Linkage Proposals</h2>
        <!-- List existing proposals here, with edit/delete options -->
        <p class="text-gray-500">Feature to view, edit, or delete existing draft proposals will be implemented here.</p>
        <p class="text-gray-500">This would typically involve fetching data using `apiService.getEcpfLinkageEstablishments()` potentially filtered by application ID or status, then allowing `apiService.updateEcpfLinkageEstablishment(id, data)` or `apiService.deleteEcpfLinkageEstablishment(id)`.</p>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted,  } from 'vue'
import { useToast } from 'vue-toastification'
import apiService from '@/services/services' // Your API service
// import { useRouter } from 'vue-router'; // If you want to navigate on cancel/submit

const toast = useToast()
// const router = useRouter(); // For navigation

// Reactive state for ECPF details (Ideally fetched or from a store)
const ecpfDetails = reactive({
  id: 'ecpf123', // Example ECPF ID, needed for associating linkages
  name: 'Example ECPF',
  proprietor: 'John Doe',
  cid: '1234567890',
  location: 'Thimphu',
  contactNo: '+975-17123456',
  email: 'john.doe@example.com',
})

// For editing an existing application, an ID might be passed via props or route params
const props = defineProps({
  applicationIdToEdit: { // e.g. if opening a draft
    type: String,
    default: null
  }
})

const linkages = ref([])
const countryOptions = ref([])
const declarationAccepted = ref(false)

// Function to create a new blank linkage object
const createNewLinkageEntry = () => ({
  id: null, // For existing linkages being edited
  name: '',
  location: '',
  country: '',
  website: '',
  yearEstablished: null,
  recognitionAccreditationDoc: null, // Store File object
  recognitionAccreditationDocName: '', // Store filename for display
  approvalFromUniversityDoc: null,
  approvalFromUniversityDocName: '',
  reportDoc: null, // Optional
  reportDocName: '',
  // Add other optional fields like affiliation if needed
});

// Add initial linkage form
const addLinkage = () => {
  linkages.value.push(createNewLinkageEntry());
}

const removeLinkage = (index) => {
  linkages.value.splice(index, 1);
}

onMounted(async () => {
  // Fetch country list
  try {
    // Assuming your getCountries API doesn't need authentication or is handled by apiClient
    await apiService.getMastersInstituteCollegesUniversities() // Or a dedicated country API
    // This endpoint seems to be for institutes, not countries. Adjust if you have a specific country API.
    // For now, I'll mock countries. Replace with your actual country fetching.
    countryOptions.value = [
        { code: 'BT', name: 'Bhutan' },
        { code: 'IN', name: 'India' },
        { code: 'US', name: 'United States' },
        { code: 'CA', name: 'Canada' },
        // ... more countries
    ];
    // If you have a real country API:
    // countryOptions.value = response.data.map(c => ({ code: c.country_code, name: c.country_name }));
  } catch (error) {
    console.error('Error fetching countries:', error)
    toast.error('Failed to load countries.')
  }

  if (props.applicationIdToEdit) {
    // TODO: Fetch existing application linkages if applicationIdToEdit is provided
    // This would involve an API call like:
    // const existingData = await apiService.getEcpfLinkageEstablishment(props.applicationIdToEdit);
    // Then populate `linkages.value` with the fetched data.
    // For files, you'd typically store URLs or identifiers and might need a way to show "current file" vs "upload new".
    toast.info(`Loading application ${props.applicationIdToEdit} for editing (feature to be implemented).`);
    // For now, just add one blank entry if editing, otherwise start fresh
    if (linkages.value.length === 0) {
      addLinkage();
    }
  } else {
    // Add one blank linkage form by default for new applications
    if (linkages.value.length === 0) {
      addLinkage();
    }
  }
})

const handleFileUpload = (event, index, fieldName) => {
  const file = event.target.files[0]
  if (file) {
    linkages.value[index][fieldName] = file;
    linkages.value[index][`${fieldName}Name`] = file.name;
  } else {
    linkages.value[index][fieldName] = null;
    linkages.value[index][`${fieldName}Name`] = '';
  }
}

const isFormValid = () => {
  if (!declarationAccepted.value) return false;
  if (linkages.value.length === 0) return false;

  return linkages.value.every(link =>
    link.name &&
    link.location &&
    link.country &&
    link.recognitionAccreditationDoc && // Check if file is selected
    link.approvalFromUniversityDoc   // Check if file is selected
  );
}

const atLeastOneLinkageIsValidForDraft = () => {
    if (linkages.value.length === 0) return false;
    // For draft, we can be more lenient, e.g., at least one linkage has a name
    return linkages.value.some(link => link.name || link.location || link.country);
}


const submitApplication = async () => {
  if (!isFormValid()) {
    toast.error('Please fill all required fields in each linkage, and accept the declaration.')
    return
  }

  // This assumes your backend can handle multiple linkage establishments in one go,
  // or you might need to loop and call `createEcpfLinkageEstablishment` for each.
  // For simplicity, let's assume the backend handles an array or you make multiple calls.

  let allSubmissionsSuccessful = true;

  for (const linkage of linkages.value) {
    const formData = new FormData()
    // Append ECPF Details (if your backend needs them for each linkage record)
    // Or, you might have a parent "application" object and these linkages are children.
    // Adjust according to your backend API structure.
    formData.append('ecpf_id', ecpfDetails.id); // Assuming an ID for the ECPF
    formData.append('ecpf_name', ecpfDetails.name); // etc.

    // Append Linkage Details
    formData.append('hei_name', linkage.name)
    formData.append('hei_location', linkage.location)
    formData.append('hei_country', linkage.country)
    if (linkage.website) formData.append('hei_website', linkage.website)
    if (linkage.yearEstablished) formData.append('year_established', linkage.yearEstablished)

    // Append Files
    if (linkage.recognitionAccreditationDoc) {
      formData.append('recognition_accreditation_document', linkage.recognitionAccreditationDoc)
    }
    if (linkage.approvalFromUniversityDoc) {
      formData.append('approval_from_university_document', linkage.approvalFromUniversityDoc)
    }
    if (linkage.reportDoc) {
      formData.append('report_document', linkage.reportDoc)
    }

    // Add a status field if your backend uses one for submission vs draft
    formData.append('status', 'submitted');

    try {
      // If linkage.id exists, it's an update (PATCH/PUT), else it's a create (POST)
      if (linkage.id) {
        // You might want to use PATCH if only some fields are updated
        // await apiService.updateEcpfLinkageEstablishment(linkage.id, formData);
        // Using PATCH with FormData can be tricky. Often for PATCH, you send JSON.
        // If files are involved and you must use FormData with PATCH, ensure backend supports it.
        // For simplicity, if files change, it might be easier to re-POST or use a dedicated file update endpoint.
        // Let's assume for now we are always creating new ones or the API handles this logic.
        // If update is complex, consider a different flow for editing existing items.
        console.warn("Update functionality for existing linkage ID needs careful backend consideration with FormData.");
        // For now, let's assume we are creating new.
         await apiService.createEcpfLinkageEstablishment(formData);
      } else {
        await apiService.createEcpfLinkageEstablishment(formData);
      }
      // console.log('Submitting FormData for linkage:', Object.fromEntries(formData.entries()))
    } catch (error) {
      allSubmissionsSuccessful = false;
      console.error(`Error submitting linkage for ${linkage.name}:`, error)
      toast.error(`Failed to submit linkage for ${linkage.name}. ${error.response?.data?.message || ''}`)
      // Decide if you want to stop on first error or try all
      break;
    }
  }

  if (allSubmissionsSuccessful) {
    toast.success('Application and all linkages submitted successfully!')
    resetForm();
    // router.push({ name: 'ApplicationDashboard' }); // Navigate away
  } else {
    toast.error('Some linkages could not be submitted. Please review and try again.')
  }
}

const saveApplicationAsDraft = async () => {
  if (!atLeastOneLinkageIsValidForDraft()) {
    toast.error('Please provide at least some information for one linkage to save as draft.')
    return
  }

  // Similar to submit, but you might send a different status or to a different endpoint.
  // For simplicity, let's assume the same endpoint but with a 'draft' status.
  let allDraftsSuccessful = true;

  for (const linkage of linkages.value) {
    // Only save if there's at least a name, or adjust your condition
    if (!linkage.name && !linkage.location && !linkage.country) continue;

    const formData = new FormData()
    formData.append('ecpf_id', ecpfDetails.id);
    // Append all available linkage details
    formData.append('hei_name', linkage.name || '') // Send empty string if not present for draft
    formData.append('hei_location', linkage.location || '')
    formData.append('hei_country', linkage.country || '')
    if (linkage.website) formData.append('hei_website', linkage.website)
    if (linkage.yearEstablished) formData.append('year_established', linkage.yearEstablished)

    if (linkage.recognitionAccreditationDoc) formData.append('recognition_accreditation_document', linkage.recognitionAccreditationDoc)
    if (linkage.approvalFromUniversityDoc) formData.append('approval_from_university_document', linkage.approvalFromUniversityDoc)
    if (linkage.reportDoc) formData.append('report_document', linkage.reportDoc)

    formData.append('status', 'draft'); // Crucial for saving as draft

    try {
      if (linkage.id) { // If it's an existing draft linkage
        // await apiService.updateEcpfLinkageEstablishment(linkage.id, formData); // Or PATCH
        console.warn("Update (PATCH/PUT) for draft linkage ID needs careful backend consideration with FormData.");
        // For now, let's assume backend handles create/update based on presence of ID or a dedicated draft save.
        // Or, perhaps drafts are always new POSTs until first proper submit?
        // This depends heavily on your backend's design for drafts.
        // A common pattern is to POST to create, then PUT/PATCH to update using the returned ID.
        // await apiService.patchEcpfLinkageEstablishment(linkage.id, formData);
        // If your patch endpoint for linkage establishment takes FormData
         await apiService.createEcpfLinkageEstablishment(formData); // Or a specific draft save endpoint
      } else {
        // This will create a new linkage establishment record with 'draft' status
        const response = await apiService.createEcpfLinkageEstablishment(formData);
        // IMPORTANT: Store the ID returned by the backend if you want to update this draft later
        if (response.data && response.data.id) {
            const originalLinkage = linkages.value.find(l => l === linkage); // Find the original object in the array
            if(originalLinkage) originalLinkage.id = response.data.id; // Update its ID
        }
      }
    } catch (error) {
      allDraftsSuccessful = false;
      console.error(`Error saving draft for ${linkage.name || 'Unnamed Linkage'}:`, error)
      toast.error(`Failed to save draft for ${linkage.name || 'Unnamed Linkage'}.`)
      break;
    }
  }

  if (allDraftsSuccessful) {
    toast.info('Application saved as draft successfully!')
    // Optionally, don't reset form after saving draft, so user can continue editing.
    // Or, if you navigate away, ensure draft can be reloaded.
  } else {
     toast.error('Some linkage drafts could not be saved.')
  }
}

const cancelForm = () => {
  // Add confirmation if form has data
  if (linkages.value.some(l => l.name || l.location || l.country)) {
    if (confirm("Are you sure you want to cancel? Any unsaved changes will be lost.")) {
      resetForm();
      // router.push({ name: 'Home' }); // Navigate to a different page
    }
  } else {
    resetForm();
    // router.push({ name: 'Home' });
  }
}

const resetForm = () => {
  linkages.value = [createNewLinkageEntry()]; // Reset to one blank linkage
  declarationAccepted.value = false;
  // ecpfDetails might not need resetting if they are user-specific and pre-filled
};

</script>

<style scoped>
/* Add a simple style for required fields */
.required-field::after {
  content: ' *';
  color: red;
}
.disabled\:opacity-50:disabled {
  opacity: 0.5;
}
</style>
