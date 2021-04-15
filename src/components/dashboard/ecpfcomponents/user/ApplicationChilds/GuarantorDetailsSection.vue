<template>
  <section class="p-6 bg-white rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4 text-blue-700">Guarantor Details</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <label for="guarantorName" class="block text-sm font-medium text-gray-700"
          >Full Name <span class="text-red-500">*</span></label
        >
        <!-- Changed: Added @input -->
        <input
          type="text"
          id="guarantorName"
          :value="guarantorData.fullName"
          @input="
            $emit('update:guarantorData', { ...guarantorData, fullName: $event.target.value })
          "
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label for="guarantorCid" class="block text-sm font-medium text-gray-700"
          >CID Number <span class="text-red-500">*</span></label
        >
        <!-- Changed: Added @input -->
        <input
          type="text"
          id="guarantorCid"
          :value="guarantorData.cidNumber"
          @input="
            $emit('update:guarantorData', { ...guarantorData, cidNumber: $event.target.value })
          "
          required
          pattern="\d{11}"
          title="Enter 11 digit CID Number"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label for="guarantorRelation" class="block text-sm font-medium text-gray-700"
          >Relation <span class="text-red-500">*</span></label
        >
        <!-- Changed: Added @input -->
        <input
          type="text"
          id="guarantorRelation"
          :value="guarantorData.relation"
          @input="
            $emit('update:guarantorData', { ...guarantorData, relation: $event.target.value })
          "
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label for="guarantorContact" class="block text-sm font-medium text-gray-700"
          >Contact Number <span class="text-red-500">*</span></label
        >
        <!-- Changed: Added @input -->
        <input
          type="tel"
          id="guarantorContact"
          :value="guarantorData.contactNumber"
          @input="
            $emit('update:guarantorData', { ...guarantorData, contactNumber: $event.target.value })
          "
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div class="md:col-span-2 lg:col-span-1">
        <label for="guarantorCidCopy" class="block text-sm font-medium text-gray-700"
          >CID Copy Upload <span class="text-red-500">*</span></label
        >
        <input
          type="file"
          id="guarantorCidCopy"
          @change="handleFileUpload($event, 'guarantorCidCopyFile')"
          required
          accept=".pdf,.jpg,.jpeg,.png"
          class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <span v-if="cidCopyFileName" class="text-xs text-gray-600 mt-1 block">
          Selected: {{ cidCopyFileName }}
        </span>
        <span v-else class="text-xs text-gray-500 mt-1 block">No file selected.</span>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  guarantorData: {
    type: Object,
    required: true,
  },
  cidCopyFileName: {
    type: String,
    default: '',
  },
})

// Changed: Added 'update:guarantorData'
const emit = defineEmits(['update:file', 'update:guarantorData'])
// End Change

const handleFileUpload = (event, fieldIdentifier) => {
  const file = event.target.files[0]
  emit('update:file', { file: file || null, field: fieldIdentifier })
  if (!file) {
    event.target.value = ''
  }
}
</script>
