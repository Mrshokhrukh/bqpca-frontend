<template>
  <section class="p-6 bg-white rounded-lg shadow">
    <h2 class="text-2xl font-semibold mb-6 text-blue-700">Contact & Address Details</h2>

    <div class="space-y-8">
      <!-- Contact Information -->
      <div class="bg-gray-50 p-5 rounded-md">
        <h3 class="text-lg font-medium text-gray-800 mb-4">Contact Information</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="contactNo" class="block text-sm font-medium text-gray-700 mb-1">
              Contact No. <span class="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="contactNo"
              :value="contactData.contactNo"
              required
              placeholder="Enter phone number"
              @input="
                $emit('update:contactData', { ...contactData, contactNo: $event.target.value })
              "
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span class="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              :value="contactData.email"
              required
              placeholder="Enter email address"
              @input="$emit('update:contactData', { ...contactData, email: $event.target.value })"
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <!-- Residential/Present Address -->
      <div class="bg-gray-50 p-5 rounded-md">
        <h3 class="text-lg font-medium text-gray-800 mb-4">Residential/Present Address</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="sm:col-span-2 lg:col-span-3">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label for="resOfficeNo" class="block text-sm font-medium text-gray-700 mb-1">
                  Office Phone Number
                </label>
                <input
                  type="text"
                  id="resOfficeNo"
                  :value="presentAddress.officeNumber"
                  placeholder="e.g., 101"
                  @input="
                    $emit('update:presentAddress', {
                      ...presentAddress,
                      officeNumber: $event.target.value,
                    })
                  "
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label for="resFlatNo" class="block text-sm font-medium text-gray-700 mb-1">
                  Flat No.
                </label>
                <input
                  type="text"
                  id="resFlatNo"
                  :value="presentAddress.flatNo"
                  placeholder="e.g., A-12"
                  @input="
                    $emit('update:presentAddress', {
                      ...presentAddress,
                      flatNo: $event.target.value,
                    })
                  "
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label for="resBuildingNo" class="block text-sm font-medium text-gray-700 mb-1">
                  Building No.
                </label>
                <input
                  type="text"
                  id="resBuildingNo"
                  :value="presentAddress.buildingNo"
                  placeholder="e.g., B-3"
                  @input="
                    $emit('update:presentAddress', {
                      ...presentAddress,
                      buildingNo: $event.target.value,
                    })
                  "
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          <div>
            <label for="resLocation" class="block text-sm font-medium text-gray-700 mb-1">
              Location <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="resLocation"
              :value="presentAddress.location"
              required
              placeholder="Enter location"
              @input="
                $emit('update:presentAddress', {
                  ...presentAddress,
                  location: $event.target.value,
                })
              "
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="resGewog" class="block text-sm font-medium text-gray-700 mb-1">
              Gewog/Throm <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="resGewog"
              :value="presentAddress.gewogThrom"
              required
              placeholder="Enter Gewog or Throm"
              @input="
                $emit('update:presentAddress', {
                  ...presentAddress,
                  gewogThrom: $event.target.value,
                })
              "
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="resDzongkhag" class="block text-sm font-medium text-gray-700 mb-1">
              Dzongkhag/Thromde <span class="text-red-500">*</span>
            </label>
            <select
              id="resDzongkhag"
              :value="presentAddress.dzongkhagThromde"
              required
              @change="
                $emit('update:presentAddress', {
                  ...presentAddress,
                  dzongkhagThromde: $event.target.value,
                })
              "
              class="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option disabled value="">Select Dzongkhag/Thromde</option>
              <option v-for="option in dzongkhagOptions" :key="option.id" :value="option.name">
                {{ option.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Permanent Address -->
      <div class="bg-gray-50 p-5 rounded-md">
        <h3 class="text-lg font-medium text-gray-800 mb-4">Permanent Address</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <div>
            <label for="permVillage" class="block text-sm font-medium text-gray-700 mb-1">
              Village/Chiwog <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="permVillage"
              :value="permanentAddress.villageChiwog"
              required
              placeholder="Enter Village/Chiwog"
              @input="
                $emit('update:permanentAddress', {
                  ...permanentAddress,
                  villageChiwog: $event.target.value,
                })
              "
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="permGewog" class="block text-sm font-medium text-gray-700 mb-1">
              Gewog <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="permGewog"
              :value="permanentAddress.gewog"
              required
              placeholder="Enter Gewog"
              @input="
                $emit('update:permanentAddress', {
                  ...permanentAddress,
                  gewog: $event.target.value,
                })
              "
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="permDungkhag" class="block text-sm font-medium text-gray-700 mb-1">
              Dungkhag
            </label>
            <input
              type="text"
              id="permDungkhag"
              :value="permanentAddress.dungkhag"
              placeholder="Enter Dungkhag (optional)"
              @input="
                $emit('update:permanentAddress', {
                  ...permanentAddress,
                  dungkhag: $event.target.value,
                })
              "
              class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="permDzongkhag" class="block text-sm font-medium text-gray-700 mb-1">
              Dzongkhag/Thromde <span class="text-red-500">*</span>
            </label>
            <select
              id="permDzongkhag"
              :value="permanentAddress.dzongkhagThromde"
              required
              @change="
                $emit('update:permanentAddress', {
                  ...permanentAddress,
                  dzongkhagThromde: $event.target.value,
                })
              "
              class="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option disabled value="">Select Dzongkhag/Thromde</option>
              <option v-for="option in dzongkhagOptions" :key="option.id" :value="option.name">
                {{ option.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  contactData: {
    type: Object,
    required: true,
  },
  presentAddress: {
    type: Object,
    required: true,
  },
  permanentAddress: {
    type: Object,
    required: true,
  },
  dzongkhagOptions: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['update:contactData', 'update:presentAddress', 'update:permanentAddress'])
</script>
