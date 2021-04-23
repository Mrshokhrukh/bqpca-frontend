<template>
  <div class="mx-auto px-4 py-8 w-full">
    <!-- Form Header -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Accreditation Application Form
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Please provide all required information accurately. A draft can be saved locally in your
        browser.
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
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mb-6 -mx-6">
          <h3 class="text-lg font-semibold text-gray-900">1. Institution Profile</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details about your institution.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 required"
              >Name of Institution</label
            >
            <input
              type="text"
              v-model="application.institutionName"
              required
              name="institutionName"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 required"
              >Address/Location</label
            >
            <textarea
              v-model="application.address"
              rows="3"
              required
              name="address"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 required">Dzongkhag/Throm</label>
            <input
              type="text"
              v-model="application.dzongkhag"
              required
              name="dzongkhag"
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
            <label class="block text-sm font-medium text-gray-700 required">Contact Number</label>
            <input
              type="text"
              v-model="application.contactNumber"
              required
              name="contactNumber"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 required">Email Address</label>
            <input
              type="email"
              v-model="application.emailAddress"
              required
              name="emailAddress"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Telephone Number</label>
            <input
              type="text"
              v-model="application.telephoneNumber"
              name="telephoneNumber"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 required"
              >Year of Establishment</label
            >
            <input
              type="text"
              v-model="application.yearEstablished"
              required
              pattern="\d{4}"
              title="Please enter a 4-digit year"
              name="yearEstablished"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 required"
              >Type of Institution</label
            >
            <select
              v-model="application.institutionType"
              required
              name="institutionType"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            >
              <option :value="null" disabled>Select Institution Type</option>
              <option v-for="item in filteredInstitutionTypes" :key="item.id" :value="item.id">
                {{ item.name_of_institute }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Affiliated to, if relevant</label
            >
            <input
              type="text"
              v-model="application.affiliatedTo"
              name="affiliatedTo"
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
              name="levelOfAutonomy"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 required">Source of Funding</label>
            <select
              v-model="application.fundingSource"
              required
              name="fundingSource"
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
              type="number"
              min="0"
              step="any"
              v-model.number="application.totalArea"
              name="totalArea"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="url"
              v-model="application.website"
              placeholder="https://example.com"
              name="website"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
        </div>

        <!-- 2. Past Accreditation Details -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mb-6 -mx-6">
          <h3 class="text-lg font-semibold text-gray-900">2. Past Accreditation Details</h3>
          <p class="mt-1 text-sm text-gray-500">
            Information about previous accreditation (if applicable).
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
          <div>
            <label class="block text-sm font-medium text-gray-700">Accreditation Rating</label>
            <input
              type="text"
              v-model="application.accreditationRating"
              name="accreditationRating"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Accreditation Validity</label>
            <input
              type="date"
              v-model="application.accreditationValidity"
              name="accreditationValidity"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
        </div>

        <!-- 3. Details of the Head of the Institute -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mb-6 -mx-6">
          <h3 class="text-lg font-semibold text-gray-900">
            3. Details of the Head of the Institute
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Provide information about the head of the institute.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
          <div>
            <label class="block text-sm font-medium text-gray-700 required">Name</label>
            <input
              type="text"
              v-model="application.headName"
              required
              name="headName"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 required">Contact Number</label>
            <input
              type="text"
              v-model="application.headContactNumber"
              required
              name="headContactNumber"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 required">Email Address</label>
            <input
              type="email"
              v-model="application.headEmailAddress"
              required
              name="headEmailAddress"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
        </div>

        <!-- 4. Name of the IQA Focal -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mb-6 -mx-6">
          <h3 class="text-lg font-semibold text-gray-900">4. Name of the IQA Focal</h3>
          <p class="mt-1 text-sm text-gray-500">Provide information about the IQA Focal.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
          <div>
            <label class="block text-sm font-medium text-gray-700 required"
              >Name of IQA Focal</label
            >
            <input
              type="text"
              v-model="application.iqaFocalName"
              required
              name="iqaFocalName"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 required">Contact Number</label>
            <input
              type="text"
              v-model="application.iqaFocalContactNumber"
              required
              name="iqaFocalContactNumber"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 required">Email Address</label>
            <input
              type="email"
              v-model="application.iqaFocalEmailAddress"
              required
              name="iqaFocalEmailAddress"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
        </div>

        <!-- 5. Current Academic Activities (in numbers) -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mb-6 -mx-6">
          <h3 class="text-lg font-semibold text-gray-900">
            5. Current Academic Activities (in numbers)
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Provide details about current academic activities.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
          <div>
            <label class="block text-sm font-medium text-gray-700 required"
              >Number of Departments</label
            >
            <input
              type="number"
              min="0"
              required
              v-model.number="application.numberOfDepartments"
              name="numberOfDepartments"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 required"
              >Qualification Category</label
            >
            <select
              v-model="application.qualificationCategory"
              required
              name="qualificationCategory"
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
            <label class="block text-sm font-medium text-gray-700 required"
              >Programmes Offered</label
            >
            <p class="mt-1 text-xs text-gray-500 mb-2">
              List all programmes and the number of students enrolled in each.
            </p>
            <div
              v-for="(program, index) in application.programmes"
              :key="index"
              class="mb-4 border p-4 rounded-md bg-gray-50"
            >
              <div class="flex flex-wrap md:flex-nowrap gap-4 items-end">
                <div class="flex-grow">
                  <label class="block text-xs font-medium text-gray-600 required"
                    >Programme Name</label
                  >
                  <input
                    type="text"
                    v-model="program.name"
                    placeholder="e.g., Bachelor of Science in IT"
                    required
                    :name="`programName_${index}`"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                  />
                </div>
                <div class="w-full md:w-1/4">
                  <label class="block text-xs font-medium text-gray-600 required"
                    >Number of Students</label
                  >
                  <input
                    type="number"
                    min="0"
                    v-model.number="program.number"
                    placeholder="Students"
                    required
                    :name="`programNumber_${index}`"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                  />
                </div>
                <button
                  v-if="application.programmes.length > 1"
                  @click="removeProgramme(index)"
                  type="button"
                  class="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm px-4 py-2 h-10 transition-colors"
                  aria-label="Remove Programme"
                >
                  Remove
                </button>
              </div>
            </div>
            <button
              @click="addProgramme"
              type="button"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-4 py-2 mt-2 transition-colors"
            >
              Add Programme
            </button>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Number of Programmes with elective (specify)</label
            >
            <input
              type="number"
              min="0"
              v-model.number="application.numberOfProgrammesWithElective"
              name="numberOfProgrammesWithElective"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Number of Programme through Mixed mode (if any)</label
            >
            <input
              type="number"
              min="0"
              v-model.number="application.numberOfProgrammesThroughMixedMode"
              name="numberOfProgrammesThroughMixedMode"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
        </div>

        <!-- 6. Teaching Staff (in numbers) -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mb-6 -mx-6">
          <h3 class="text-lg font-semibold text-gray-900">6. Teaching Staff (in numbers)</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details about teaching staff.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
          <div class="col-span-2 pt-2">
            <h4 class="text-md font-semibold text-gray-800 mb-2">Total Faculty</h4>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 required"
              >Number of Faculty (F)</label
            >
            <input
              type="number"
              min="0"
              required
              v-model.number="application.facultyF"
              name="facultyF"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 required"
              >Number of Faculty (M)</label
            >
            <input
              type="number"
              min="0"
              required
              v-model.number="application.facultyM"
              name="facultyM"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Total Faculty</label>
            <input
              type="text"
              :value="totalFaculty"
              readonly
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div class="col-span-2 pt-2">
            <h4 class="text-md font-semibold text-gray-800 mb-2">Regular Faculty</h4>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Number of Regular Faculty (F)</label
            >
            <input
              type="number"
              min="0"
              v-model.number="application.regularFacultyF"
              name="regularFacultyF"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Number of Regular Faculty (M)</label
            >
            <input
              type="number"
              min="0"
              v-model.number="application.regularFacultyM"
              name="regularFacultyM"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Total Regular Faculty</label>
            <input
              type="text"
              :value="totalRegularFaculty"
              readonly
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div class="col-span-2 pt-2">
            <h4 class="text-md font-semibold text-gray-800 mb-2">Contract Faculty</h4>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Number of Contract Faculty (F)</label
            >
            <input
              type="number"
              min="0"
              v-model.number="application.contractFacultyF"
              name="contractFacultyF"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Number of Contract Faculty (M)</label
            >
            <input
              type="number"
              min="0"
              v-model.number="application.contractFacultyM"
              name="contractFacultyM"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Total Contract Faculty</label>
            <input
              type="text"
              :value="totalContractFaculty"
              readonly
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div class="col-span-2 pt-2">
            <h4 class="text-md font-semibold text-gray-800 mb-2">Visiting Faculty</h4>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Number of Visiting Faculty (F)</label
            >
            <input
              type="number"
              min="0"
              v-model.number="application.visitingFacultyF"
              name="visitingFacultyF"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Number of Visiting Faculty (M)</label
            >
            <input
              type="number"
              min="0"
              v-model.number="application.visitingFacultyM"
              name="visitingFacultyM"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Total Visiting Faculty</label>
            <input
              type="text"
              :value="totalVisitingFaculty"
              readonly
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div class="col-span-2 pt-2">
            <h4 class="text-md font-semibold text-gray-800 mb-2">Faculty by Qualification</h4>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 required"
              >Total PhD Faculty</label
            >
            <input
              type="number"
              min="0"
              required
              v-model.number="application.totalPhdFaculty"
              name="totalPhdFaculty"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 required"
              >Total Masters Faculty</label
            >
            <input
              type="number"
              min="0"
              required
              v-model.number="application.totalMastersFaculty"
              name="totalMastersFaculty"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 required"
              >Total Bachelors Faculty</label
            >
            <input
              type="number"
              min="0"
              required
              v-model.number="application.totalBachelorsFaculty"
              name="totalBachelorsFaculty"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
        </div>

        <!-- 7. Non-Teaching Staff (in numbers) -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mb-6 -mx-6">
          <h3 class="text-lg font-semibold text-gray-900">7. Non-Teaching Staff (in numbers)</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details about non-teaching staff.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
          <div class="col-span-2 pt-2">
            <h4 class="text-md font-semibold text-gray-800 mb-2">Technical Staff</h4>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Gender</label>
            <select
              v-model="application.technicalStaffGender"
              name="technicalStaffGender"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            >
              <option :value="null" disabled>Select Gender</option>
              <option v-for="item in genderOptions" :key="item" :value="item">{{ item }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Total Technical Staff</label>
            <input
              type="number"
              min="0"
              v-model.number="application.technicalStaffTotal"
              name="technicalStaffTotal"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div class="col-span-2 pt-4">
            <h4 class="text-md font-semibold text-gray-800 mb-2">Administrative Staff</h4>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Gender</label>
            <select
              v-model="application.administrativeStaffGender"
              name="administrativeStaffGender"
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
              type="number"
              min="0"
              v-model.number="application.administrativeStaffTotal"
              name="administrativeStaffTotal"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div class="col-span-2 pt-4">
            <h4 class="text-md font-semibold text-gray-800 mb-2">Support Staff</h4>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Gender</label>
            <select
              v-model="application.supportStaffGender"
              name="supportStaffGender"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            >
              <option :value="null" disabled>Select Gender</option>
              <option v-for="item in genderOptions" :key="item" :value="item">{{ item }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Total Support Staff</label>
            <input
              type="number"
              min="0"
              v-model.number="application.supportStaffTotal"
              name="supportStaffTotal"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div class="col-span-2 pt-4">
            <label class="block text-sm font-medium text-gray-700">Total Non-Teaching Staff</label>
            <input
              type="text"
              :value="totalNonTeachingStaff"
              readonly
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>

        <!-- 8. Standards -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mb-6 -mx-6">
          <h3 class="text-lg font-semibold text-gray-900">8. Standards</h3>
          <p class="mt-1 text-sm text-gray-500">Provide details about the standards.</p>
        </div>

        <div class="pb-8">
          <p class="text-sm text-gray-600 mb-4">
            For each standard, select the standard, key aspect, and indicator, then provide the
            report.
          </p>
          <div
            v-for="(standard, index) in application.standards"
            :key="index"
            class="mb-4 border rounded-md p-4 bg-gray-50"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <label class="block text-sm font-medium text-gray-700 required"
                  >Standard Name</label
                >
                <select
                  v-model="standard.standard_id"
                  required
                  :name="`standardId_${index}`"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                >
                  <option :value="null" disabled>Select Standard Name</option>
                  <option v-for="item in standardsOptions" :key="item.id" :value="item.id">
                    {{ item.standard_name || item.title }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 required"
                  >Key Aspect Name</label
                >
                <select
                  v-model="standard.key_aspect_id"
                  required
                  :name="`keyAspectId_${index}`"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                >
                  <option :value="null" disabled>Select Key Aspect Name</option>
                  <option v-for="item in keyAspectsOptions" :key="item.id" :value="item.id">
                    {{ item.key_aspect_name || item.title }}
                  </option>
                </select>
              </div>
              <div class="col-span-1 md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 required">Indicator</label>
                <select
                  v-model="standard.indicator_id"
                  required
                  :name="`indicatorId_${index}`"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                >
                  <option :value="null" disabled>Select Indicator</option>
                  <option v-for="item in indicatorsOptions" :key="item.id" :value="item.id">
                    {{ item.indicator_name || item.name || item.title }}
                  </option>
                </select>
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 required"
                >Report by Institute</label
              >
              <textarea
                v-model="standard.reportByInstitute"
                rows="3"
                required
                placeholder="Provide a detailed report for this standard/aspect/indicator."
                :name="`standardReport_${index}`"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              ></textarea>
            </div>
            <button
              v-if="application.standards.length > 1"
              @click="removeStandard(index)"
              type="button"
              class="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm px-4 py-2 transition-colors"
            >
              Remove
            </button>
          </div>
          <button
            @click="addStandard"
            type="button"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-4 py-2 mt-2 transition-colors"
          >
            Add Standard
          </button>
        </div>

        <!-- 9. Supporting Documents -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mb-6 -mx-6">
          <h3 class="text-lg font-semibold text-gray-900">9. Supporting Documents</h3>
          <p class="mt-1 text-sm text-gray-500">
            Upload supporting documents (Max 5MB per file). Note: Files are not saved in drafts and
            must be re-selected before final submission.
          </p>
        </div>

        <div class="pb-8">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Upload Documents</label>
            <input
              type="file"
              multiple
              ref="fileInput"
              @change="onFileChange"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            <p class="mt-1 text-xs text-gray-500">
              Allowed types: PDF, DOC, DOCX, JPG, PNG. Max 5MB per file.
            </p>
          </div>
          <div v-if="selectedFilesDisplay.length > 0" class="mt-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
            <ul class="list-disc pl-5 space-y-1">
              <li
                v-for="(doc, index) in selectedFilesDisplay"
                :key="index"
                class="text-sm text-gray-600 flex justify-between items-center"
              >
                <span>{{ doc.name }} ({{ formatFileSize(doc.size) }})</span>
                <button
                  @click="removeFile(index)"
                  type="button"
                  class="text-red-500 hover:text-red-700 text-xs ml-2 font-semibold"
                >
                  Remove
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Declaration -->
        <div class="flex items-start pb-8 pt-6 border-t border-gray-200 -mx-6 px-6">
          <div class="flex items-center h-5">
            <input
              type="checkbox"
              id="declaration"
              v-model="application.declaration"
              required
              class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div class="ml-3 text-sm">
            <label for="declaration" class="font-medium text-gray-700 required">Declaration</label>
            <p class="text-gray-500">
              I declare that all the information provided is true and accurate to the best of my
              knowledge. I understand that submission requires payment.
            </p>
            <p v-if="!application.declaration && formSubmittedAttempt" class="text-red-500 text-xs mt-1">
              You must accept the declaration to submit the form.
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div
          class="mt-8 flex justify-end space-x-4 pt-6 -mx-6 -mb-6 px-6 pb-6 bg-gray-50 rounded-b-xl"
        >
          <button
            @click="saveDraft"
            type="button"
            :disabled="isSubmitting"
            class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            :disabled="!application.declaration || isSubmitting"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {{ isSubmitting ? 'Processing...' : 'Proceed to Payment & Submit' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import apiService from '@/services/services' // Adjust path as needed
import { useToast } from 'vue-toastification'
import PaymentModal from '@/components/common/PaymentModal.vue' // Adjust path as needed
import { useAuthStore } from '@/stores/authStore' // Adjust path as needed

const DRAFT_STORAGE_KEY = 'accreditationDraft'
const ACCREDITATION_FEE = 1000 // Define the fee amount
const PAYMENT_SERVICE_CODE = '100194' // Service code for accreditation payment

// Initialize application state with defaults
const getInitialApplicationState = () => ({
  institutionName: '',
  address: '',
  dzongkhag: '',
  contactNumber: '',
  emailAddress: '',
  telephoneNumber: '',
  yearEstablished: '',
  institutionType: null,
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
  programmes: [{ name: '', number: null }],
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
  standards: [{ standard_id: null, key_aspect_id: null, indicator_id: null, reportByInstitute: '' }],
  supportingDocuments: [], // Holds File objects - WILL NOT BE SAVED IN DRAFT
  declaration: false,
  is_payment_complete: false, // Renamed for clarity
  payment_id: null, // Stores the payment transaction hash/ID
  status: 'draft', // Initial status before submission attempt
})

const application = reactive(getInitialApplicationState())
// Separate ref for actual files to handle draft limitations
const selectedFiles = ref([])

const toast = useToast()
const isSubmitting = ref(false)
const formSubmittedAttempt = ref(false)
const authStore = useAuthStore()
const paymentModal = ref(null)
const fileInput = ref(null)

// --- Master Data Refs ---
const institutionTypesOptions = ref([])
const fundingSourcesOptions = ref([])
const qualificationCategories = ref(['Bachelor', 'Master', 'PhD']) // Static
const genderOptions = ref(['Male', 'Female', 'Other']) // Static
const standardsOptions = ref([])
const keyAspectsOptions = ref([])
const indicatorsOptions = ref([])

// Static list of Dzongkhags for reference
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
  'Thimphu Thromde',
  'Phuentsholing Thromde',
  'Gelephu Thromde',
  'Samdrup Jongkhar Thromde',
])

// --- Computed Properties ---
const totalFaculty = computed(
  () => (Number(application.facultyF) || 0) + (Number(application.facultyM) || 0),
)
const totalRegularFaculty = computed(
  () => (Number(application.regularFacultyF) || 0) + (Number(application.regularFacultyM) || 0),
)
const totalContractFaculty = computed(
  () => (Number(application.contractFacultyF) || 0) + (Number(application.contractFacultyM) || 0),
)
const totalVisitingFaculty = computed(
  () => (Number(application.visitingFacultyF) || 0) + (Number(application.visitingFacultyM) || 0),
)
const totalNonTeachingStaff = computed(
  () =>
    (Number(application.technicalStaffTotal) || 0) +
    (Number(application.administrativeStaffTotal) || 0) +
    (Number(application.supportStaffTotal) || 0),
)

const filteredInstitutionTypes = computed(() => {
  return institutionTypesOptions.value.filter((item) => item && item.id && item.name_of_institute)
})

const filteredFundingSources = computed(() => {
  return fundingSourcesOptions.value.filter((item) => item && item.id && item.name)
})

// Computed property for displaying selected files (doesn't rely on application.supportingDocuments)
const selectedFilesDisplay = computed(() => {
  return selectedFiles.value.map((file) => ({ name: file.name, size: file.size }))
})

// --- Methods ---

// Load Draft from localStorage
const loadDraft = () => {
  const draftData = localStorage.getItem(DRAFT_STORAGE_KEY)
  if (draftData) {
    try {
      const parsedData = JSON.parse(draftData)
      // IMPORTANT: Update the reactive object key by key to maintain reactivity
      Object.keys(parsedData).forEach((key) => {
        // Exclude files and payment status from draft loading
        if (
          key !== 'supportingDocuments' &&
          key !== 'is_payment_complete' &&
          key !== 'payment_id' &&
          key !== 'status' &&
          key in application
        ) {
          application[key] = parsedData[key]
        }
      })
      // Ensure programmes and standards have at least one item if loaded draft is empty/corrupted
      if (!application.programmes || application.programmes.length === 0) {
        application.programmes = [{ name: '', number: null }]
      }
      if (!application.standards || application.standards.length === 0) {
        application.standards = [
          { standard_id: null, key_aspect_id: null, indicator_id: null, reportByInstitute: '' },
        ]
      }

      selectedFiles.value = [] // Clear file list on draft load
      if (fileInput.value) fileInput.value.value = '' // Reset file input UI
      application.status = 'draft'; // Reset status when loading draft
      toast.info('Draft loaded successfully. Please re-select any supporting documents.')
      console.log('Draft loaded from localStorage')
    } catch (error) {
      console.error('Error parsing draft data from localStorage:', error)
      toast.error('Could not load draft due to invalid data.')
      localStorage.removeItem(DRAFT_STORAGE_KEY) // Clear corrupted data
    }
  }
}

// Save Draft to localStorage
const saveDraft = () => {
  if (!application.institutionName) {
    toast.warn('Please enter the Institution Name before saving a draft.')
    return
  }
  try {
    // Create a copy of the application data, excluding sensitive/non-persistent fields
    const draftToSave = { ...application }
    delete draftToSave.supportingDocuments // Remove the file array before saving
    delete draftToSave.is_payment_complete
    delete draftToSave.payment_id
    delete draftToSave.status

    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftToSave))
    toast.success('Draft saved successfully.')
  } catch (error) {
    console.error('Error saving draft to localStorage:', error)
    if (error.name === 'QuotaExceededError') {
      toast.error('Could not save draft: Local storage quota exceeded.')
    } else {
      toast.error('An error occurred while saving the draft.')
    }
  }
}

// Clear Draft from localStorage
const clearDraft = () => {
  localStorage.removeItem(DRAFT_STORAGE_KEY)
  console.log('Draft cleared from localStorage')
}

// Reset Form function
const resetForm = () => {
  Object.assign(application, getInitialApplicationState())
  selectedFiles.value = [] // Clear file list
  if (fileInput.value) fileInput.value.value = '' // Reset file input UI
  formSubmittedAttempt.value = false
  toast.info('Form has been reset.')
}

// Programme List Management
const addProgramme = () => {
  application.programmes.push({ name: '', number: null })
}
const removeProgramme = (index) => {
  if (application.programmes.length > 1) {
    application.programmes.splice(index, 1)
  } else {
    toast.info('At least one programme is required.')
  }
}

// Standards Management
const addStandard = () => {
  application.standards.push({
    standard_id: null,
    key_aspect_id: null,
    indicator_id: null,
    reportByInstitute: '',
  })
}
const removeStandard = (index) => {
  if (application.standards.length > 1) {
    application.standards.splice(index, 1)
  } else {
    toast.info('At least one standard is required.')
  }
}

// File Handling
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const onFileChange = (event) => {
  const files = event.target.files
  if (!files) return

  const newFiles = Array.from(files)
  let oversizedFiles = []
  let duplicateFiles = []

  newFiles.forEach((file) => {
    if (file.size > MAX_FILE_SIZE) {
      oversizedFiles.push(file.name)
    } else {
      // Check for duplicates in the *currently selected* files (selectedFiles ref)
      if (
        !selectedFiles.value.some(
          (existingFile) => existingFile.name === file.name && existingFile.size === file.size,
        )
      ) {
        selectedFiles.value.push(file) // Add to the separate file ref
      } else {
        duplicateFiles.push(file.name)
      }
    }
  })

  if (oversizedFiles.length > 0) {
    toast.error(`The following files exceed the 5MB limit: ${oversizedFiles.join(', ')}`)
  }
  if (duplicateFiles.length > 0) {
    toast.warning(`The following files were already selected: ${duplicateFiles.join(', ')}`)
  }

  // Reset the file input visually so the same file can be selected again if removed
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Payment Modal Handling
const openPaymentModal = () => {
  if (paymentModal.value) {
    paymentModal.value.openModal()
  } else {
    console.error('Payment modal reference is not available.')
    toast.error('Could not open payment modal. Please try again.')
    isSubmitting.value = false // Ensure submitting state is reset if modal fails
  }
}

const onPaymentModalClose = () => {
  console.log('Payment modal closed')
  // If payment wasn't completed, stop the submission process
  if (!application.is_payment_complete) {
    isSubmitting.value = false
    application.status = 'draft'; // Reset status if payment cancelled
    toast.info('Payment was cancelled or closed.')
  }
}

// *** UPDATED: This function is called when the PaymentModal emits 'payment-completed' ***
const onPaymentCompleted = (paymentData) => {
  console.log('Payment completed data received from modal:', paymentData)
  if (!paymentData || !paymentData.paymentHash) {
    toast.error('Payment confirmation data is missing. Cannot proceed.')
    isSubmitting.value = false; // Stop submission
    application.status = 'payment_failed'; // Mark payment as failed
    return
  }
  // Update application state with payment details
  application.is_payment_complete = true
  application.payment_id = paymentData.paymentHash // Store the unique payment identifier
  application.status = 'payment_complete' // Update status

  toast.info("Payment confirmed. Proceeding with application submission...");

  // *** CRITICAL: Now call the actual backend submission function ***
  handleSubmitActual()
}

// Form Submission Logic - Step 1: Validation and Payment Trigger
const handleSubmit = () => {
  formSubmittedAttempt.value = true // Mark that submission was attempted
  isSubmitting.value = true // Set submitting state immediately
  application.status = 'validating'; // Update status

  // --- Basic Validation Checks ---
  if (!application.declaration) {
    toast.error('Please accept the declaration before submitting.')
    isSubmitting.value = false
    application.status = 'draft'; // Reset status
    document.getElementById('declaration')?.focus()
    return
  }

  // Enhanced Required Field Check
  const requiredFields = [
    'institutionName', 'address', 'dzongkhag', 'contactNumber', 'emailAddress',
    'yearEstablished', 'institutionType', 'fundingSource', 'headName',
    'headContactNumber', 'headEmailAddress', 'iqaFocalName', 'iqaFocalContactNumber',
    'iqaFocalEmailAddress', 'numberOfDepartments', 'qualificationCategory',
    'facultyF', 'facultyM', 'totalPhdFaculty', 'totalMastersFaculty', 'totalBachelorsFaculty',
  ]
    const firstMissingField = requiredFields.find(field => !application[field] && application[field] !== 0); // Check for empty or null/undefined, allow 0

    if (firstMissingField) {
        toast.error(`Please fill in the required field: ${firstMissingField}`);
        isSubmitting.value = false;
        application.status = 'draft'; // Reset status
        // Attempt to focus the first missing field
        const fieldElement = document.querySelector(`[name="${firstMissingField}"]`);
        fieldElement?.focus();
        // Scroll into view if possible
        fieldElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

  // Check programmes structure
   const invalidProgram = application.programmes.find(p => !p.name || typeof p.number !== 'number' || p.number < 0);
  if (application.programmes.length === 0 || invalidProgram) {
    toast.error('Please provide a valid name and a non-negative number of students for all programmes.')
    isSubmitting.value = false
    application.status = 'draft'; // Reset status
     const programIndex = application.programmes.findIndex(p => p === invalidProgram);
     const invalidElement = document.querySelector(`[name="programName_${programIndex}"]`) || document.querySelector(`[name="programNumber_${programIndex}"]`);
     invalidElement?.focus();
     invalidElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return
  }
  // Check standards structure
   const invalidStandard = application.standards.find(s => !s.standard_id || !s.key_aspect_id || !s.indicator_id || !s.reportByInstitute);
  if (application.standards.length === 0 || invalidStandard) {
    toast.error(
      'Please complete all fields (Standard, Key Aspect, Indicator, Report) for all standard entries.',
    )
    isSubmitting.value = false
    application.status = 'draft'; // Reset status
     const standardIndex = application.standards.findIndex(s => s === invalidStandard);
     const invalidElement = document.querySelector(`[name="standardId_${standardIndex}"]`) || document.querySelector(`[name="keyAspectId_${standardIndex}"]`) || document.querySelector(`[name="indicatorId_${standardIndex}"]`) || document.querySelector(`[name="standardReport_${standardIndex}"]`);
     invalidElement?.focus();
     invalidElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });

    return
  }

  // --- Validation Passed ---
  console.log('Form validation passed. Opening payment modal...')
  application.status = 'pending_payment' // Update status
  openPaymentModal()
  // The process continues in onPaymentCompleted() if payment is successful
}

// Form Submission Logic - Step 2: Actual data submission to backend (Called AFTER successful payment confirmation)
const handleSubmitActual = async () => {
  // Double-check payment status before proceeding
  if (!application.is_payment_complete || !application.payment_id) {
    toast.error('Payment is not complete or payment ID is missing. Cannot submit application.')
    console.error('Attempted handleSubmitActual without payment completion.', application)
    isSubmitting.value = false
    application.status = 'submission_failed' // Indicate failure reason
    return
  }

  console.log('Proceeding with actual backend submission (Payment & Application Data)...')
  application.status = 'submitting'; // Update status

  try {
    // --- 1. Payment Registration API Call ---
    // Prepare data for the makePayment API endpoint
    const paymentRegData = {
      platform: 'BQPCA e-Zhapto', // Platform identifier
      refNo: application.payment_id, // Use the unique hash from payment modal
      taxPayerNo: application.contactNumber, // Using contact number as an identifier (confirm if correct)
      taxPayerDocumentNo: application.contactNumber, // Example, confirm requirement
      payerEmail: application.emailAddress,
      mobileNo: application.contactNumber,
      totalPayableAmount: ACCREDITATION_FEE,
      serviceCode: PAYMENT_SERVICE_CODE, // ** VERIFY THIS CODE IS CORRECT FOR ACCREDITATION **
      description: `Accreditation Application Fee - ${application.institutionName}`,
      payableAmount: ACCREDITATION_FEE,
      taxPayerName: application.institutionName,
      application_no: application.payment_id, // Using payment ID as a reference, confirm if another ID is needed
      app_type: 'Accreditation', // Type of application
      user_id: authStore.userId,
    }

    try {
      console.log('Sending payment registration data:', paymentRegData)
      // NOTE: The tracking component used FormData for makePayment. Adjust if needed.
      // If makePayment expects FormData, convert paymentRegData:
      // const paymentFormData = new FormData();
      // Object.entries(paymentRegData).forEach(([key, value]) => {
      //   paymentFormData.append(key, value);
      // });
      // const paymentResponse = await apiService.makePayment(paymentFormData);

      // Assuming makePayment accepts JSON:
       const paymentResponse = await apiService.makePayment(paymentRegData);

      console.log('Payment Registration Response:', paymentResponse)
      // Simple status check (adjust based on actual successful response structure)
      if (paymentResponse.status < 200 || paymentResponse.status >= 300) {
         const errorDetail = paymentResponse.data?.message || paymentResponse.data?.detail || JSON.stringify(paymentResponse.data);
        throw new Error(
          `Payment registration failed with status: ${paymentResponse.status}. Details: ${errorDetail}`,
        )
      }
      toast.info('Payment details successfully registered.')
      application.status = 'payment_registered' // Update status

    } catch (paymentError) {
      console.error('Error during payment registration API call:', paymentError)
      const specificError =
        paymentError.response?.data?.message ||
        paymentError.response?.data?.detail ||
        paymentError.message ||
        'Unknown error during payment registration.'
      toast.error(
        `Payment registration failed: ${specificError}. Please contact support if the payment was deducted, providing Payment ID: ${application.payment_id}`,
      )
      // Stop the submission process if payment registration fails
      isSubmitting.value = false
      application.status = 'submission_failed' // Indicate failure reason
      return // Exit handleSubmitActual
    }

    // --- 2. Main Application Data Submission ---
    console.log('Submitting main application form data...')
    application.status = 'submitting_form_data'; // Update status

    const formData = new FormData()

    // Append all standard fields from the application object
    for (const key in application) {
      if (Object.prototype.hasOwnProperty.call(application, key)) {
        const value = application[key]

        if (key === 'programmes' || key === 'standards') {
          formData.append(key, JSON.stringify(value)) // Send arrays/objects as JSON strings
        } else if (key === 'supportingDocuments') {
          continue // Files handled separately from selectedFiles ref
        } else if (typeof value === 'boolean') {
           formData.append(key, value.toString()); // Convert boolean to string 'true'/'false'
        } else if (value !== null && value !== undefined && value !== '') {
          // Append other non-empty values
          formData.append(key, value)
        }
      }
    }

    // Append files from the selectedFiles ref
    selectedFiles.value.forEach((file) => {
      // Use a consistent key, potentially indexed if the backend expects multiple files under the same key name array
      formData.append('supportingDocuments', file, file.name)
      // Or if backend expects unique keys: formData.append(`supportingDocuments[${index}]`, file, file.name);
    })

    // Append user ID (ensure it's present)
    if (authStore.userId) {
      formData.append('user_id', authStore.userId)
    } else {
      console.error('User ID is missing. Cannot submit application.')
      toast.error('Authentication error: User ID not found. Please log in again.')
      isSubmitting.value = false
      application.status = 'submission_failed';
      return; // Stop submission
    }

     // Add payment ID and status explicitly to the form data being sent
     formData.append('payment_id', application.payment_id);
     formData.append('is_payment_complete', 'true'); // Send as string
     formData.append('status', 'submitted'); // Final submitted status for the record


    // Log FormData for debugging (optional)
    // for (let [key, value] of formData.entries()) {
    //     console.log(`${key}:`, value instanceof File ? `${value.name} (${value.size} bytes)` : value);
    // }

    const response = await apiService.createInstitutionProfile(formData)

    console.log('Application submission response:', response)

    // Check response status from createInstitutionProfile
    if (response.status < 200 || response.status >= 300) {
        const errorDetail = response.data?.message || response.data?.detail || JSON.stringify(response.data);
        throw new Error(`Application submission failed with status: ${response.status}. Details: ${errorDetail}`);
    }

    // --- Success ---
    application.status = 'submitted_successfully' // Final success status
    toast.success('Application submitted successfully! Payment details recorded.')
    clearDraft() // Clear the draft from localStorage on successful submission
    resetForm() // Reset the form fields

  } catch (error) {
    console.error('Error submitting application (handleSubmitActual):', error)
    application.status = 'submission_failed'; // Update status on error
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.detail || // Check for 'detail' which DRF sometimes uses
      (error.response?.data ? JSON.stringify(error.response.data) : '') ||
      error.message ||
      'An unknown error occurred during submission.'
    toast.error(`Error submitting application: ${errorMessage}. Please review the form or contact support.`);
    // Do not reset form or clear draft on error, allow user to retry or save draft
  } finally {
    // This runs regardless of success or error in the try block
    isSubmitting.value = false // Ensure isSubmitting is reset
  }
}

// Fetch Master Data on Component Mount
onMounted(async () => {
  console.log('Accreditation Form Component Mounted. Fetching master data...')
  // Use a separate loading state for master data if needed, or keep isSubmitting
  // isSubmitting.value = true;
  try {
    const [
      typesResponse,
      fundingResponse,
      standardsResponse,
      keyAspectsResponse,
      indicatorsResponse,
    ] = await Promise.all([
      apiService.getMastersInstitutes(),
      apiService.getMastersSourceOfFundings(),
      apiService.getMastersStandards(),
      apiService.getMastersKeyAspects(),
      apiService.getMastersIndicators(),
    ])

    // Process results carefully, checking for data presence
    institutionTypesOptions.value = typesResponse?.data?.results?.filter(Boolean) || []
    fundingSourcesOptions.value = fundingResponse?.data?.results?.filter(Boolean) || []
    standardsOptions.value = standardsResponse?.data?.results?.filter(Boolean) || []
    keyAspectsOptions.value = keyAspectsResponse?.data?.results?.filter(Boolean) || []
    indicatorsOptions.value = indicatorsResponse?.data?.results?.filter(Boolean) || []

    console.log('Master data loaded:')
    console.log(' - Institution Types:', institutionTypesOptions.value.length)
    console.log(' - Funding Sources:', fundingSourcesOptions.value.length)
    console.log(' - Standards:', standardsOptions.value.length)
    console.log(' - Key Aspects:', keyAspectsOptions.value.length)
    console.log(' - Indicators:', indicatorsOptions.value.length)

    // Check if any data failed to load and show specific errors
    if (!institutionTypesOptions.value.length) toast.warning('Could not load Institution Types.')
    if (!fundingSourcesOptions.value.length) toast.warning('Could not load Funding Sources.')
    if (!standardsOptions.value.length) toast.warning('Could not load Standards.')
    if (!keyAspectsOptions.value.length) toast.warning('Could not load Key Aspects.')
    if (!indicatorsOptions.value.length) toast.warning('Could not load Indicators.')

    // Attempt to load draft *after* master data is loaded
    loadDraft()
  } catch (error) {
    console.error('Error fetching master data:', error)
    toast.error('Failed to load required dropdown options. Please try refreshing the page.')
    // Ensure options are empty arrays on error
    institutionTypesOptions.value = []
    fundingSourcesOptions.value = []
    standardsOptions.value = []
    keyAspectsOptions.value = []
    indicatorsOptions.value = []
  } finally {
    // isSubmitting.value = false; // End loading state if used
  }
})
</script>

<style scoped>
/* Add required indicator */
label.required::after {
  content: ' *';
  color: theme('colors.red.500');
}

/* Improve focus visibility */
input:focus,
select:focus,
textarea:focus {
  --tw-ring-color: theme('colors.blue.500');
  --tw-ring-offset-width: 1px;
  --tw-ring-offset-color: #fff;
  box-shadow:
    var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  border-color: theme('colors.blue.500');
  outline: none; /* Remove default outline */
}

/* Consistent padding for form elements */
input[type='text'],
input[type='email'],
input[type='number'],
input[type='url'],
input[type='date'],
select,
textarea {
  padding-top: 0.625rem; /* 10px */
  padding-bottom: 0.625rem; /* 10px */
  padding-left: 0.75rem; /* 12px */
  padding-right: 0.75rem; /* 12px */
}

/* Readonly input styling */
input[readonly] {
  background-color: theme('colors.gray.100');
  cursor: not-allowed;
  /* border-color: theme('colors.gray.300'); */ /* Optional: make border consistent */
}

/* Style for file input button */
input[type='file']::file-selector-button {
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

/* Section headers */
.bg-gray-50 {
  margin-left: -1.5rem; /* -p-6 */
  margin-right: -1.5rem; /* -p-6 */
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
.rounded-t-xl {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.rounded-b-xl {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

/* Style details/summary */
details > summary {
  list-style: none;
}
details > summary::-webkit-details-marker {
  display: none;
}
details > summary::before {
  content: '+ '; /* Indicate collapsible */
  font-weight: bold;
  margin-right: 4px;
}
details[open] > summary::before {
  content: '- '; /* Indicate expanded */
}
</style>
