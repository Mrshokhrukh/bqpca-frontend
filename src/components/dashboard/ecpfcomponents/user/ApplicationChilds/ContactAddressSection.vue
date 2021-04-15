<template>
  <section class="p-6 bg-white rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4 text-blue-700">Contact & Address Details</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Contact Info -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-800">Contact Information</h3>
        <div>
          <label for="contactNo" class="block text-sm font-medium text-gray-700"
            >Contact No. <span class="text-red-500">*</span></label
          >
          <input
            type="tel"
            id="contactNo"
            :value="contactData.contactNo"
            required
            @input="$emit('update:contactData', { ...contactData, contactNo: $event.target.value })"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email Address <span class="text-red-500">*</span></label
          >
          <input
            type="email"
            id="email"
            :value="contactData.email"
            required
            @input="$emit('update:contactData', { ...contactData, email: $event.target.value })"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <!-- Residential/Present Address -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-800">Residential/Present Address</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label for="resOfficeNo" class="block text-sm font-medium text-gray-700"
              >Office No.</label
            >
            <input
              type="text"
              id="resOfficeNo"
              :value="presentAddress.officeNumber"
              @input="
                $emit('update:presentAddress', {
                  ...presentAddress,
                  officeNumber: $event.target.value,
                })
              "
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="resFlatNo" class="block text-sm font-medium text-gray-700">Flat No.</label>
            <input
              type="text"
              id="resFlatNo"
              :value="presentAddress.flatNo"
              @input="
                $emit('update:presentAddress', { ...presentAddress, flatNo: $event.target.value })
              "
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="resBuildingNo" class="block text-sm font-medium text-gray-700"
              >Building No.</label
            >
            <input
              type="text"
              id="resBuildingNo"
              :value="presentAddress.buildingNo"
              @input="
                $emit('update:presentAddress', {
                  ...presentAddress,
                  buildingNo: $event.target.value,
                })
              "
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="resLocation" class="block text-sm font-medium text-gray-700"
              >Location <span class="text-red-500">*</span></label
            >
            <input
              type="text"
              id="resLocation"
              :value="presentAddress.location"
              required
              @input="
                $emit('update:presentAddress', { ...presentAddress, location: $event.target.value })
              "
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <!-- Gewog changed to text input -->
            <label for="resGewog" class="block text-sm font-medium text-gray-700"
              >Gewog/Throm <span class="text-red-500">*</span></label
            >
            <input
              type="text"
              id="resGewog"
              :value="presentAddress.gewogThrom"
              required
              @input="
                $emit('update:presentAddress', {
                  ...presentAddress,
                  gewogThrom: $event.target.value,
                })
              "
              placeholder="Type Gewog or Throm name"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="resDzongkhag" class="block text-sm font-medium text-gray-700"
              >Dzongkhag/Thromde <span class="text-red-500">*</span></label
            >
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
              class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option disabled value="">Select Dzongkhag/Thromde</option>
              <option v-for="option in dzongkhagOptions" :key="option.id" :value="option.name">
                {{ option.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Permanent Address (Your existing emits here are correct) -->
      <div class="space-y-4 md:col-span-2">
        <h3 class="text-lg font-medium text-gray-800">Permanent Address</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label for="permVillage" class="block text-sm font-medium text-gray-700"
              >Village/Chiwog <span class="text-red-500">*</span></label
            >
            <input
              type="text"
              id="permVillage"
              :value="permanentAddress.villageChiwog"
              @input="
                $emit('update:permanentAddress', {
                  ...permanentAddress,
                  villageChiwog: $event.target.value,
                })
              "
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="permGewog" class="block text-sm font-medium text-gray-700"
              >Gewog <span class="text-red-500">*</span></label
            >
            <input
              type="text"
              id="permGewog"
              :value="permanentAddress.gewog"
              @input="
                $emit('update:permanentAddress', {
                  ...permanentAddress,
                  gewog: $event.target.value,
                })
              "
              required
              placeholder="Type Gewog name"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="permDungkhag" class="block text-sm font-medium text-gray-700"
              >Dungkhag</label
            >
            <input
              type="text"
              id="permDungkhag"
              :value="permanentAddress.dungkhag"
              @input="
                $emit('update:permanentAddress', {
                  ...permanentAddress,
                  dungkhag: $event.target.value,
                })
              "
              placeholder="Type Dungkhag (if applicable)"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="permDzongkhag" class="block text-sm font-medium text-gray-700"
              >Dzongkhag/Thromde <span class="text-red-500">*</span></label
            >
            <select
              id="permDzongkhag"
              :value="permanentAddress.dzongkhagThromde"
              @change="
                $emit('update:permanentAddress', {
                  ...permanentAddress,
                  dzongkhagThromde: $event.target.value,
                })
              "
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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

// Declare the events the component can emit
defineEmits(['update:contactData', 'update:presentAddress', 'update:permanentAddress'])
</script>
