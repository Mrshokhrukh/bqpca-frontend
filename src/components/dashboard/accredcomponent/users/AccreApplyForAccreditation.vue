<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Form Header -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Accreditation Application Form
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Please provide all required information accurately.
      </p>
    </div>

    <!-- Payment Modal -->
    <PaymentModal
      ref="paymentModal"
      :amount="1000"
      @payment-completed="onPaymentCompleted"
      @close="onPaymentModalClose"
    />

    <!-- Main Form Card -->
    <div class="bg-white border rounded-xl shadow-sm p-6">
      <form @submit.prevent="handleSubmit">
        <!-- 1. Institution Profile -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mb-6">
          <h3 class="text-lg font-semibold text-gray-900">1. Institution Profile</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details about your institution.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Name of Institution</label>
            <input
              type="text"
              v-model="application.institutionName"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Address/Location</label>
            <textarea
              v-model="application.address"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Dzongkhag/Throm</label>
            <input
              type="text"
              v-model="application.dzongkhag"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
            <p class="mt-1 text-sm text-gray-500">Please type the Dzongkhag or Throm name.</p>
            <!-- Optional: List of Dzongkhags for reference -->
            <details class="mt-2">
              <summary class="text-blue-500 text-sm cursor-pointer hover:underline">
                List of Dzongkhags
              </summary>
              <ul class="list-disc pl-5 mt-1 text-sm">
                <li v-for="dzongkhag in dzongkhagList" :key="dzongkhag">{{ dzongkhag }}</li>
              </ul>
            </details>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="text"
              v-model="application.contactNumber"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              v-model="application.emailAddress"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Telephone Number</label>
            <input
              type="text"
              v-model="application.telephoneNumber"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Year of Establishment</label>
            <input
              type="text"
              v-model="application.yearEstablished"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Type of Institution</label>
            <select
              v-model="application.institutionType"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            >
              <option :value="null" disabled>Select Institution Type</option>
              <option value="Constituent">Constituent</option>
              <option value="Affiliated">Affiliated</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Affiliated to, if relevant</label
            >
            <input
              type="text"
              v-model="application.affiliatedTo"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Level of Autonomy (if affiliated)</label
            >
            <input
              type="text"
              v-model="application.levelOfAutonomy"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
          <div>
            <label class="block text-sm font-medium text-gray-700">Source of Funding</label>
            <select
              v-model="application.fundingSource"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            >
              <option :value="null" disabled>Select Funding Source</option>
              <option v-for="item in filteredFundingSources" :key="item?.id" :value="item?.id">
                {{ item?.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Total area (in acres)</label>
            <input
              type="text"
              v-model="application.totalArea"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="text"
              v-model="application.website"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
        </div>

        <!-- 2. Past Accreditation Details -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mb-6">
          <h3 class="text-lg font-semibold text-gray-900">2. Past Accreditation Details</h3>
          <p class="mt-1 text-sm text-gray-500">Information about previous accreditation.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
          <div>
            <label class="block text-sm font-medium text-gray-700">Accreditation Rating</label>
            <input
              type="text"
              v-model="application.accreditationRating"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Accreditation Validity</label>
            <input
              type="text"
              v-model="application.accreditationValidity"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
        </div>

        <!-- 3. Details of the Head of the Institute -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mb-6">
          <h3 class="text-lg font-semibold text-gray-900">
            3. Details of the Head of the Institute
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Provide information about the head of the institute.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              v-model="application.headName"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="text"
              v-model="application.headContactNumber"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              v-model="application.headEmailAddress"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
        </div>

        <!-- 4. Name of the IQA Focal -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mb-6">
          <h3 class="text-lg font-semibold text-gray-900">4. Name of the IQA Focal</h3>
          <p class="mt-1 text-sm text-gray-500">Provide information about the IQA Focal.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name of IQA Focal</label>
            <input
              type="text"
              v-model="application.iqaFocalName"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="text"
              v-model="application.iqaFocalContactNumber"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              v-model="application.iqaFocalEmailAddress"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
        </div>

        <!-- 5. Current Academic Activities (in numbers) -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mb-6">
          <h3 class="text-lg font-semibold text-gray-900">
            5. Current Academic Activities (in numbers)
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Provide details about current academic activities.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
          <div>
            <label class="block text-sm font-medium text-gray-700">Number of Departments</label>
            <input
              type="text"
              v-model="application.numberOfDepartments"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Qualification Category</label>
            <select
              v-model="application.qualificationCategory"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            >
              <option :value="null" disabled>Select Qualification Category</option>
              <option v-for="item in qualificationCategories" :key="item" :value="item">
                {{ item }}
              </option>
            </select>
          </div>

          <!-- Programmes List -->
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Programmes</label>
            <div v-for="(program, index) in application.programmes" :key="index" class="mb-4">
              <div class="flex gap-4">
                <input
                  type="text"
                  v-model="program.name"
                  placeholder="Programme Name"
                  class="mt-1 block w-1/2 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                />
                <input
                  type="number"
                  v-model="program.number"
                  placeholder="Number of Programmes"
                  class="mt-1 block w-1/4 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                />
                <button
                  @click="removeProgramme(index)"
                  type="button"
                  class="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm px-4 py-2"
                >
                  Remove
                </button>
              </div>
            </div>
            <button
              @click="addProgramme"
              type="button"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-4 py-2"
            >
              Add Programme
            </button>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Number of Programmes with elective (specify)</label
            >
            <input
              type="text"
              v-model="application.numberOfProgrammesWithElective"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Number of Programme through Mixed mode (if any)</label
            >
            <input
              type="text"
              v-model="application.numberOfProgrammesThroughMixedMode"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
        </div>

        <!-- 6. Teaching Staff (in numbers) -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mb-6">
          <h3 class="text-lg font-semibold text-gray-900">6. Teaching Staff (in numbers)</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details about teaching staff.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
          <div>
            <label class="block text-sm font-medium text-gray-700">Number of Faculty (F)</label>
            <input
              type="text"
              v-model="application.facultyF"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Number of Faculty (M)</label>
            <input
              type="text"
              v-model="application.facultyM"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Total Faculty</label>
            <input
              type="text"
              :value="totalFaculty"
              readonly
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Number of Regular Faculty (F)</label
            >
            <input
              type="text"
              v-model="application.regularFacultyF"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Number of Regular Faculty (M)</label
            >
            <input
              type="text"
              v-model="application.regularFacultyM"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Total Regular Faculty</label>
            <input
              type="text"
              :value="totalRegularFaculty"
              readonly
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Number of Contract Faculty (F)</label
            >
            <input
              type="text"
              v-model="application.contractFacultyF"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Number of Contract Faculty (M)</label
            >
            <input
              type="text"
              v-model="application.contractFacultyM"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Total Contract Faculty</label>
            <input
              type="text"
              :value="totalContractFaculty"
              readonly
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Number of Visiting Faculty (F)</label
            >
            <input
              type="text"
              v-model="application.visitingFacultyF"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Number of Visiting Faculty (M)</label
            >
            <input
              type="text"
              v-model="application.visitingFacultyM"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Total Visiting Faculty</label>
            <input
              type="text"
              :value="totalVisitingFaculty"
              readonly
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Total PhD Faculty</label>
            <input
              type="text"
              v-model="application.totalPhdFaculty"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Total Masters Faculty</label>
            <input
              type="text"
              v-model="application.totalMastersFaculty"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Total Bachelors Faculty</label>
            <input
              type="text"
              v-model="application.totalBachelorsFaculty"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
        </div>

        <!-- 7. Non-Teaching Staff (in numbers) -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mb-6">
          <h3 class="text-lg font-semibold text-gray-900">7. Non-Teaching Staff (in numbers)</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details about non-teaching staff.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
          <div class="col-span-2">
            <h4 class="text-md font-semibold text-gray-800">Technical Staff</h4>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Gender</label>
            <select
              v-model="application.technicalStaffGender"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            >
              <option :value="null" disabled>Select Gender</option>
              <option v-for="item in genderOptions" :key="item" :value="item">{{ item }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Total Technical Staff</label>
            <input
              type="text"
              v-model="application.technicalStaffTotal"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div class="col-span-2">
            <h4 class="text-md font-semibold text-gray-800">Administrative Staff</h4>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Gender</label>
            <select
              v-model="application.administrativeStaffGender"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            >
              <option :value="null" disabled>Select Gender</option>
              <option v-for="item in genderOptions" :key="item" :value="item">{{ item }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Total Administrative Staff</label
            >
            <input
              type="text"
              v-model="application.administrativeStaffTotal"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div class="col-span-2">
            <h4 class="text-md font-semibold text-gray-800">Support Staff</h4>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Gender</label>
            <select
              v-model="application.supportStaffGender"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            >
              <option :value="null" disabled>Select Gender</option>
              <option v-for="item in genderOptions" :key="item" :value="item">{{ item }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Total Support Staff</label>
            <input
              type="text"
              v-model="application.supportStaffTotal"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Total Non-Teaching Staff</label>
            <input
              type="text"
              :value="totalNonTeachingStaff"
              readonly
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
            />
          </div>
        </div>

        <!-- 8. Standards -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mb-6">
          <h3 class="text-lg font-semibold text-gray-900">8. Standards</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details about the standards.</p>
        </div>

        <div class="p-8">
          <div
            v-for="(standard, index) in application.standards"
            :key="index"
            class="mb-4 border rounded-md p-4"
          >
            <div class="mb-2">
              <label class="block text-sm font-medium text-gray-700">Standard Name</label>
              <select
                v-model="standard.standardName"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              >
                <option :value="null" disabled>Select Standard Name</option>
                <option v-for="item in standardNames" :key="item" :value="item">{{ item }}</option>
              </select>
            </div>
            <div class="mb-2">
              <label class="block text-sm font-medium text-gray-700">Key Aspect Name</label>
              <select
                v-model="standard.keyAspectName"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              >
                <option :value="null" disabled>Select Key Aspect Name</option>
                <option v-for="item in keyAspectNames" :key="item" :value="item">{{ item }}</option>
              </select>
            </div>
            <div class="mb-2">
              <label class="block text-sm font-medium text-gray-700">Indicators</label>
              <select
                v-model="standard.indicators"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              >
                <option :value="null" disabled>Select Indicators</option>
                <option v-for="item in indicators" :key="item" :value="item">{{ item }}</option>
              </select>
            </div>
            <div class="mb-2">
              <label class="block text-sm font-medium text-gray-700">Report by Institute</label>
              <textarea
                v-model="standard.reportByInstitute"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              ></textarea>
            </div>
            <button
              @click="removeStandard(index)"
              type="button"
              class="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm px-4 py-2"
            >
              Remove
            </button>
          </div>
          <button
            @click="addStandard"
            type="button"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-4 py-2"
          >
            Add Standard
          </button>
        </div>

        <!-- 9. Supporting Documents -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mb-6">
          <h3 class="text-lg font-semibold text-gray-900">9. Supporting Documents</h3>
          <p class="mt-1 text-sm text-gray-500">Upload supporting documents.</p>
        </div>

        <div class="p-8">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Supporting Documents</label>
            <input
              type="file"
              multiple
              @change="onFileChange"
              class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <ul class="list-disc pl-5">
            <li v-for="(doc, index) in application.supportingDocuments" :key="index">
              {{ doc.name }}
            </li>
          </ul>
        </div>

        <!-- Declaration -->
        <div class="flex items-start p-8">
          <div class="flex items-center h-5">
            <input
              type="checkbox"
              id="declaration"
              v-model="application.declaration"
              required
              class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>
          <div class="ml-3 text-sm">
            <label for="declaration" class="fontmedium text-gray-700">Declaration</label>
            <p class="text-gray-500">
              I declare that all the information provided is true and accurate to the best of my
              knowledge.
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-12 flex justify-end space-x-4 p-8">
          <button
            @click="saveDraft"
            type="button"
            class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Save as Draft
          </button>
          <button
            type="button"
            @click="openPaymentModal"
            :disabled="!application.declaration || isSubmitting"
            class="px-6 py-3 bg-primary text-white rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Submitting...' : 'Submit' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import apiService from '@/services/services'
import { useToast } from 'vue-toastification'
import PaymentModal from '@/components/common/PaymentModal.vue'
import { useAuthStore } from '@/stores/authStore'

const application = reactive({
  institutionName: '',
  address: '',
  dzongkhag: '', // Changed to empty string for text input
  contactNumber: '',
  emailAddress: '',
  telephoneNumber: '',
  yearEstablished: '',
  institutionType: null, // Use null for initial unselected state
  affiliatedTo: '',
  levelOfAutonomy: '',
  fundingSource: null,
  totalArea: '',
  website: '',
  accreditationRating: '',
  accreditationValidity: '',
  headName: '',
  headContactNumber: '',
  headEmailAddress: '',
  iqaFocalName: '',
  iqaFocalContactNumber: '',
  iqaFocalEmailAddress: '',
  numberOfDepartments: '',
  qualificationCategory: null,
  programmes: [{ name: '', number: '' }],
  numberOfProgrammesWithElective: '',
  numberOfProgrammesThroughMixedMode: '',
  facultyF: '',
  facultyM: '',
  regularFacultyF: '',
  regularFacultyM: '',
  contractFacultyF: '',
  contractFacultyM: '',
  visitingFacultyF: '',
  visitingFacultyM: '',
  totalPhdFaculty: '',
  totalMastersFaculty: '',
  totalBachelorsFaculty: '',
  technicalStaffGender: null,
  technicalStaffTotal: '',
  administrativeStaffGender: null,
  administrativeStaffTotal: '',
  supportStaffGender: null,
  supportStaffTotal: '',
  standards: [{ standardName: '', keyAspectName: '', indicators: '', reportByInstitute: '' }],
  supportingDocuments: [],
  declaration: false, // Add declaration
  is_payment_complete: false, // Add is_payment_complete
  payment_id: null, // Add payment_id
  status: 'applied', // Add application status
})

const toast = useToast()
const isSubmitting = ref(false)
const authStore = useAuthStore() // Get authStore

// Removed dzongkhags ref and filteredDzongkhags computed
//const institutionTypesOptions = ref([]); // No longer fetching from API
const fundingSourcesOptions = ref([])
const qualificationCategories = ref(['Bachelor', 'Master', 'PhD'])
const genderOptions = ref(['Male', 'Female'])
const standardNames = ref(['Standard 1', 'Standard 2', 'Standard 3'])
const keyAspectNames = ref(['Key Aspect 1', 'Key Aspect 2', 'Key Aspect 3'])
const indicators = ref(['Indicator 1', 'Indicator 2', 'Indicator 3'])

// Static list of Dzongkhags for reference (optional, adjust as needed)
const dzongkhagList = ref([
  'Bumthang',
  'Chukha',
  'Dagana',
  'Gasa',
  'Haa',
  'Lhuntse',
  'Mongar',
  'Paro',
  'Pema Gatshel',
  'Punakha',
  'Samdrup Jongkhar',
  'Samtse',
  'Sarpang',
  'Thimphu',
  'Trashigang',
  'Trashiyangtse',
  'Trongsa',
  'Tsirang',
  'Wangdue Phodrang',
  'Zhemgang',
  'Thromde', // Added Thromde as it can also be relevant
])

// Computed properties for totals (remain the same)
const totalFaculty = computed(() => {
  return Number(application.facultyF || 0) + Number(application.facultyM || 0)
})

const totalRegularFaculty = computed(() => {
  return Number(application.regularFacultyF || 0) + Number(application.regularFacultyM || 0)
})

const totalContractFaculty = computed(() => {
  return Number(application.contractFacultyF || 0) + Number(application.contractFacultyM || 0)
})

const totalVisitingFaculty = computed(() => {
  return Number(application.visitingFacultyF || 0) + Number(application.visitingFacultyM || 0)
})

const totalNonTeachingStaff = computed(() => {
  return (
    Number(application.technicalStaffTotal || 0) +
    Number(application.administrativeStaffTotal || 0) +
    Number(application.supportStaffTotal || 0)
  )
})

// Computed property for filtered funding sources (removed institution types)
const filteredFundingSources = computed(() => {
  return fundingSourcesOptions.value.filter((item) => item && item.id && item.name)
})

// Programme List Management (remains the same)
const addProgramme = () => {
  application.programmes.push({ name: '', number: '' })
}

const removeProgramme = (index) => {
  application.programmes.splice(index, 1)
}

// Standards Management (remains the same)
const addStandard = () => {
  application.standards.push({
    standardName: '',
    keyAspectName: '',
    indicators: '',
    reportByInstitute: '',
  })
}

const removeStandard = (index) => {
  application.standards.splice(index, 1)
}

// File Handling (remains the same)
const onFileChange = (event) => {
  const files = event.target.files
  application.supportingDocuments = Array.from(files)
}

// Payment Modal Handling
const paymentModal = ref(null)

const openPaymentModal = () => {
  paymentModal.value.openModal()
}

const onPaymentModalClose = () => {
  console.log('Payment modal closed') // For debugging, check if this is called
}

const onPaymentCompleted = (paymentData) => {
  application.is_payment_complete = true // Set payment status
  application.payment_id = paymentData.paymentHash // Store payment ID
  application.status = 'processing_payment' // Update status
  handleSubmitActual() // Proceed with submission after successful payment
}

const handleSubmit = () => {
  if (application.declaration) {
    openPaymentModal() // Open payment modal if declaration is checked
  } else {
    toast.error('Please accept the declaration') // Show error if not checked
  }
}

// Submit Application Function (Modified for FormData)
const handleSubmitActual = async () => {
  isSubmitting.value = true
  try {
    const formData = new FormData()

    // Append all fields to FormData
    for (const key in application) {
      if (Object.prototype.hasOwnProperty.call(application, key)) {
        let value = application[key]

        if (key === 'programmes' || key === 'standards') {
          // Stringify arrays
          formData.append(key, JSON.stringify(value))
        } else if (key === 'supportingDocuments') {
          // Append files individually
          value.forEach((file) => {
            formData.append(`supportingDocuments`, file) // Corrected file appending
          })
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString())
        } else if (value !== null && value !== undefined) {
          // Append other values directly
          formData.append(key, value)
        }
      }
    }

    // Only make the main request if payment is completed OR it's a draft.
    if (application.status === 'draft' || application.is_payment_complete) {
      // Only make the Payment Request if it is not draft.
      if (application.status !== 'draft') {
        const paymentData = {
          platform: 'BQPCA e-Zhapto',
          refNo: application.payment_id, // Use application's payment_id
          taxPayerNo: application.contactNumber, // Placeholder. Consider using appropriate ID.
          taxPayerDocumentNo: application.contactNumber, // Placeholder. Consider using appropriate ID.
          payerEmail: application.emailAddress,
          mobileNo: application.contactNumber,
          totalPayableAmount: 1000.0,
          serviceCode: '100194', // Use an appropriate service code
          description: 'Payment for Accreditation Application',
          payableAmount: 1000.0,
          taxPayerName: application.institutionName,
          application_no: application.payment_id, // Use application payment_id
          app_type: 'Accreditation', // A string to identify the type of application
          user_id: authStore.userId, // Make sure authStore and userId are defined
        }
        try {
          const paymentResponse = await apiService.makePayment(paymentData)
          console.log('Payment Response:', paymentResponse)

          if (paymentResponse.status !== 201 && paymentResponse.status !== 200) {
            throw new Error('Payment request failed')
          }
        } catch (paymentError) {
          console.error('Error making payment:', paymentError)
          toast.error(
            'Payment request failed: ' +
              (paymentError.response?.data?.message || paymentError.message),
          )
          isSubmitting.value = false // Reset before returning.
          return // Stop execution if payment fails
        }
      }

      const response = await apiService.createInstitutionProfile(formData) // Send FormData
      console.log('Application submitted successfully!', response.data)

      if (application.status === 'draft') {
        toast.success('Application saved as draft')
      } else {
        toast.success(
          'Application submitted successfully! Please check your email to complete the payment',
        )
      }
    } else {
      toast.error('Payment is not complete. Cannot submit application.')
    }
  } catch (error) {
    console.error('Error submitting application:', error)
    // Improved error handling: check for response and data
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error'
    toast.error(`Error submitting application: ${errorMessage}`)
  } finally {
    isSubmitting.value = false // Reset loading state
  }
}

// Save Draft Function (TODO: Implement backend logic) (remains the same)
const saveDraft = () => {
  application.status = 'draft' // Set status to draft
  handleSubmitActual()
}

// Fetch Master Data on Component Mount (Modified - Dzongkhags fetching removed)
onMounted(async () => {
  try {
    // Fetch Funding Sources
    const fundingSourcesResponse = await apiService.getMastersSourceOfFundings()
    if (
      fundingSourcesResponse &&
      fundingSourcesResponse.data &&
      Array.isArray(fundingSourcesResponse.data.results)
    ) {
      fundingSourcesOptions.value = fundingSourcesResponse.data.results
    } else {
      console.error('Invalid data received for funding sources:', fundingSourcesResponse)
      fundingSourcesOptions.value = []
      alert('Error: Invalid funding sources data received from API.')
    }
  } catch (error) {
    console.error('Error fetching master data:', error)
    alert(
      'Failed to load dropdown options (Institution Type, Funding Source). Please check the console.',
    ) // Modified alert message
  }
})
</script>

<style scoped>
.required::after {
  content: ' *';
  color: #ef4444;
}
</style>
