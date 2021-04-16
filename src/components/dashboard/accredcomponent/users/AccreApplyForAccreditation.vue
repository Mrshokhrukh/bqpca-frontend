<template>
  <div class="mx-auto px-4 py-8">
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
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Address/Location</label>
            <textarea
              v-model="application.address"
              rows="3"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Dzongkhag/Throm</label>
            <input
              type="text"
              v-model="application.dzongkhag"
              required
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
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              v-model="application.emailAddress"
              required
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
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Type of Institution</label>
            <select
              v-model="application.institutionType"
              required
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
              required
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
              type="url"
              v-model="application.website"
              placeholder="https://example.com"
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
              type="date"
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
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="text"
              v-model="application.headContactNumber"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              v-model="application.headEmailAddress"
              required
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
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="text"
              v-model="application.iqaFocalContactNumber"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              v-model="application.iqaFocalEmailAddress"
              required
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
              type="number"
              min="0"
              v-model.number="application.numberOfDepartments"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Qualification Category</label>
            <select
              v-model="application.qualificationCategory"
              required
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
            <label class="block text-sm font-medium text-gray-700">Programmes Offered</label>
            <div
              v-for="(program, index) in application.programmes"
              :key="index"
              class="mb-4 border p-4 rounded-md bg-gray-50"
            >
              <div class="flex flex-wrap md:flex-nowrap gap-4 items-end">
                <div class="flex-grow">
                  <label class="block text-xs font-medium text-gray-600">Programme Name</label>
                  <input
                    type="text"
                    v-model="program.name"
                    placeholder="e.g., Bachelor of Science in IT"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                  />
                </div>
                 <div class="w-full md:w-1/4">
                   <label class="block text-xs font-medium text-gray-600">Number of Students</label>
                   <input
                      type="number"
                      min="0"
                      v-model.number="program.number"
                      placeholder="Students"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                   />
                 </div>
                <button
                  v-if="application.programmes.length > 1"
                  @click="removeProgramme(index)"
                  type="button"
                  class="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm px-4 py-2 h-10"
                  aria-label="Remove Programme"
                >
                  Remove
                </button>
              </div>
            </div>
            <button
              @click="addProgramme"
              type="button"
              class="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-4 py-2 mt-2"
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
              type="number"
              min="0"
              v-model.number="application.facultyF"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Number of Faculty (M)</label>
            <input
              type="number"
              min="0"
              v-model.number="application.facultyM"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Total Faculty</label>
            <input
              type="text"
              :value="totalFaculty"
              readonly
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-100"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Number of Regular Faculty (F)</label
            >
            <input
              type="number"
              min="0"
              v-model.number="application.regularFacultyF"
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
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Total Regular Faculty</label>
            <input
              type="text"
              :value="totalRegularFaculty"
              readonly
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-100"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Number of Contract Faculty (F)</label
            >
            <input
              type="number"
              min="0"
              v-model.number="application.contractFacultyF"
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
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Total Contract Faculty</label>
            <input
              type="text"
              :value="totalContractFaculty"
              readonly
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-100"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Number of Visiting Faculty (F)</label
            >
            <input
              type="number"
              min="0"
              v-model.number="application.visitingFacultyF"
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
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Total Visiting Faculty</label>
            <input
              type="text"
              :value="totalVisitingFaculty"
              readonly
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-100"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Total PhD Faculty</label>
            <input
              type="number"
              min="0"
              v-model.number="application.totalPhdFaculty"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Total Masters Faculty</label>
            <input
              type="number"
              min="0"
              v-model.number="application.totalMastersFaculty"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Total Bachelors Faculty</label>
            <input
              type="number"
              min="0"
              v-model.number="application.totalBachelorsFaculty"
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
          <div class="col-span-2 pt-2">
            <h4 class="text-md font-semibold text-gray-800 mb-2">Technical Staff</h4>
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
              type="number"
              min="0"
              v-model.number="application.technicalStaffTotal"
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
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
            />
          </div>

          <div class="col-span-2 pt-4">
            <label class="block text-sm font-medium text-gray-700">Total Non-Teaching Staff</label>
            <input
              type="text"
              :value="totalNonTeachingStaff"
              readonly
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-100"
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
            class="mb-4 border rounded-md p-4 bg-gray-50"
          >
             <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Standard Name</label>
                    <select
                        v-model="standard.standard_id"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                    >
                        <option :value="null" disabled>Select Standard Name</option>
                        <!-- Iterate over fetched options -->
                        <option v-for="item in standardsOptions" :key="item.id" :value="item.id">
                            {{ item.standard_name || item.title }} <!-- Display name/title (adjust property name if needed) -->
                        </option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">Key Aspect Name</label>
                    <select
                        v-model="standard.key_aspect_id"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                    >
                        <option :value="null" disabled>Select Key Aspect Name</option>
                        <!-- Iterate over fetched options -->
                        <option v-for="item in keyAspectsOptions" :key="item.id" :value="item.id">
                            {{ item.key_aspect_name || item.title }} <!-- Display name/title (adjust property name if needed) -->
                        </option>
                    </select>
                </div>
                <div class="col-span-1 md:col-span-2">
                   <label class="block text-sm font-medium text-gray-700">Indicators</label>
                    <select
                        v-model="standard.indicator_id"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                    >
                        <option :value="null" disabled>Select Indicator</option>
                         <!-- Iterate over fetched options -->
                        <option v-for="item in indicatorsOptions" :key="item.id" :value="item.id">
                             {{ item.indicator_name || item.name || item.title }} <!-- Display name/title (adjust property name if needed) -->
                        </option>
                    </select>
                </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700">Report by Institute</label>
              <textarea
                v-model="standard.reportByInstitute"
                rows="3"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              ></textarea>
            </div>
            <button
              v-if="application.standards.length > 1"
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
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-4 py-2 mt-2"
          >
            Add Standard
          </button>
        </div>

        <!-- 9. Supporting Documents -->
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mb-6">
          <h3 class="text-lg font-semibold text-gray-900">9. Supporting Documents</h3>
          <p class="mt-1 text-sm text-gray-500">Upload supporting documents (Max 5MB per file).</p>
        </div>

        <div class="p-8">
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
            <p class="mt-1 text-xs text-gray-500">Allowed types: PDF, DOC, DOCX, JPG, PNG.</p>
          </div>
           <div v-if="application.supportingDocuments.length > 0" class="mt-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                <ul class="list-disc pl-5 space-y-1">
                <li v-for="(doc, index) in application.supportingDocuments" :key="index" class="text-sm text-gray-600 flex justify-between items-center">
                    <span>{{ doc.name }} ({{ formatFileSize(doc.size) }})</span>
                    <button @click="removeFile(index)" type="button" class="text-red-500 hover:text-red-700 text-xs ml-2">Remove</button>
                </li>
                </ul>
           </div>
        </div>

        <!-- Declaration -->
        <div class="flex items-start p-8 mt-6 border-t border-gray-200">
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
            <label for="declaration" class="font-medium text-gray-700">Declaration *</label>
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
        <div class="mt-8 flex justify-end space-x-4 p-8 bg-gray-50 rounded-b-xl">
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
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Processing...' : 'Proceed to Payment & Submit' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import apiService from '@/services/services'; // Adjust path as needed
import { useToast } from 'vue-toastification';
import PaymentModal from '@/components/common/PaymentModal.vue'; // Adjust path as needed
import { useAuthStore } from '@/stores/authStore'; // Adjust path as needed

const application = reactive({
  institutionName: '',
  address: '',
  dzongkhag: '',
  contactNumber: '',
  emailAddress: '',
  telephoneNumber: '',
  yearEstablished: '',
  institutionType: null, // Holds ID
  affiliatedTo: '',
  levelOfAutonomy: '',
  fundingSource: null, // Holds ID
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
  // --- Updated standards structure to hold IDs ---
  standards: [{ standard_id: null, key_aspect_id: null, indicator_id: null, reportByInstitute: '' }],
  supportingDocuments: [], // Holds File objects
  declaration: false,
  is_payment_complete: false,
  payment_id: null,
  status: 'applied',
});

const toast = useToast();
const isSubmitting = ref(false);
const formSubmittedAttempt = ref(false);
const authStore = useAuthStore();
const paymentModal = ref(null);
const fileInput = ref(null);

// --- Master Data Refs ---
const institutionTypesOptions = ref([]);
const fundingSourcesOptions = ref([]);
const qualificationCategories = ref(['Bachelor', 'Master', 'PhD']); // Static
const genderOptions = ref(['Male', 'Female', 'Other']); // Static

// --- Refs for Standards, Key Aspects, Indicators ---
const standardsOptions = ref([]); // Holds fetched Standards
const keyAspectsOptions = ref([]); // Holds fetched Key Aspects
const indicatorsOptions = ref([]); // Holds fetched Indicators

// Static list of Dzongkhags for reference
const dzongkhagList = ref([
  'Bumthang', 'Chukha', 'Dagana', 'Gasa', 'Haa', 'Lhuntse', 'Mongar', 'Paro',
  'Pema Gatshel', 'Punakha', 'Samdrup Jongkhar', 'Samtse', 'Sarpang', 'Thimphu',
  'Trashigang', 'Trashiyangtse', 'Trongsa', 'Tsirang', 'Wangdue Phodrang', 'Zhemgang',
  'Thimphu Thromde', 'Phuentsholing Thromde', 'Gelephu Thromde', 'Samdrup Jongkhar Thromde'
]);

// --- Computed Properties ---
const totalFaculty = computed(() => (Number(application.facultyF) || 0) + (Number(application.facultyM) || 0));
const totalRegularFaculty = computed(() => (Number(application.regularFacultyF) || 0) + (Number(application.regularFacultyM) || 0));
const totalContractFaculty = computed(() => (Number(application.contractFacultyF) || 0) + (Number(application.contractFacultyM) || 0));
const totalVisitingFaculty = computed(() => (Number(application.visitingFacultyF) || 0) + (Number(application.visitingFacultyM) || 0));
const totalNonTeachingStaff = computed(() =>
  (Number(application.technicalStaffTotal) || 0) +
  (Number(application.administrativeStaffTotal) || 0) +
  (Number(application.supportStaffTotal) || 0)
);

const filteredInstitutionTypes = computed(() => {
  return institutionTypesOptions.value.filter(item => item && item.id && item.name_of_institute);
});

const filteredFundingSources = computed(() => {
  return fundingSourcesOptions.value.filter(item => item && item.id && item.name);
});

// --- Methods ---

// Programme List Management
const addProgramme = () => {
  application.programmes.push({ name: '', number: null });
};
const removeProgramme = (index) => {
  if (application.programmes.length > 1) {
    application.programmes.splice(index, 1);
  } else {
      toast.info("At least one programme is required.")
  }
};

// Standards Management
const addStandard = () => {
  application.standards.push({
    standard_id: null,         // Initialize with ID structure
    key_aspect_id: null,       // Initialize with ID structure
    indicator_id: null,        // Initialize with ID structure
    reportByInstitute: '',
  });
};
const removeStandard = (index) => {
   if (application.standards.length > 1) {
        application.standards.splice(index, 1);
    } else {
        toast.info("At least one standard is required.")
    }
};

// File Handling
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const onFileChange = (event) => {
  const files = event.target.files;
  if (!files) return;

  const newFiles = Array.from(files);
  let oversizedFiles = [];

  newFiles.forEach(file => {
      if (file.size > MAX_FILE_SIZE) {
          oversizedFiles.push(file.name);
      } else {
          if (!application.supportingDocuments.some(existingFile => existingFile.name === file.name && existingFile.size === file.size)) {
             application.supportingDocuments.push(file);
          } else {
              toast.warning(`File "${file.name}" is already selected.`);
          }
      }
  });

  if (oversizedFiles.length > 0) {
      toast.error(`The following files exceed the 5MB limit: ${oversizedFiles.join(', ')}`);
  }

  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const removeFile = (index) => {
    application.supportingDocuments.splice(index, 1);
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};


// Payment Modal Handling
const openPaymentModal = () => {
  if (paymentModal.value) {
    paymentModal.value.openModal();
  } else {
      console.error("Payment modal reference is not available.");
      toast.error("Could not open payment modal. Please try again.");
  }
};

const onPaymentModalClose = () => {
  console.log('Payment modal closed');
  if (!application.is_payment_complete) {
      isSubmitting.value = false;
  }
};

const onPaymentCompleted = (paymentData) => {
  console.log('Payment completed data:', paymentData);
  application.is_payment_complete = true;
  application.payment_id = paymentData.paymentHash;
  application.status = 'processing_payment';
  handleSubmitActual();
};

// Form Submission Logic
const handleSubmit = () => {
    formSubmittedAttempt.value = true;
    if (!application.declaration) {
        toast.error('Please accept the declaration before submitting.');
        return;
    }
    if (!application.institutionName || !application.address || !application.institutionType) {
        toast.error('Please fill in all required fields in the Institution Profile section.');
        return;
    }
    // Check if standards section has valid selections (at least one row is valid)
    const firstStandard = application.standards[0];
    if (!firstStandard || !firstStandard.standard_id || !firstStandard.key_aspect_id || !firstStandard.indicator_id) {
         toast.error('Please select a Standard, Key Aspect, and Indicator for at least the first standard entry.');
         return;
    }

    openPaymentModal();
};

// Actual data submission to backend
const handleSubmitActual = async () => {
  isSubmitting.value = true;
  formSubmittedAttempt.value = true;

  if (application.status !== 'draft' && !application.is_payment_complete) {
      toast.error('Payment is not complete. Cannot submit application.');
      isSubmitting.value = false;
      return;
  }

  try {
    const formData = new FormData();

    // Append all standard fields
    for (const key in application) {
      if (Object.prototype.hasOwnProperty.call(application, key)) {
        const value = application[key];

        if (key === 'programmes' || key === 'standards') {
          // Stringify arrays of objects - now includes IDs for standards
          formData.append(key, JSON.stringify(value));
        } else if (key === 'supportingDocuments') {
          continue; // Handled below
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else if (value !== null && value !== undefined && value !== '') {
          formData.append(key, value);
        }
      }
    }

    // Append files
    application.supportingDocuments.forEach((file) => {
      formData.append('supportingDocuments', file, file.name);
    });

    // Append user ID
    if (authStore.userId) {
      formData.append('user_id', authStore.userId);
    }

    // Optional Payment Registration API Call (if needed before main submission)
    if (application.status !== 'draft') {
        const paymentRegData = {
             platform: 'BQPCA e-Zhapto',
             refNo: application.payment_id,
             taxPayerNo: application.contactNumber,
             taxPayerDocumentNo: application.contactNumber,
             payerEmail: application.emailAddress,
             mobileNo: application.contactNumber,
             totalPayableAmount: 1000.00,
             serviceCode: '100194', // Use the correct service code
             description: `Accreditation Application - ${application.institutionName}`,
             payableAmount: 1000.00,
             taxPayerName: application.institutionName,
             application_no: application.payment_id,
             app_type: 'Accreditation',
             user_id: authStore.userId,
        };
        try {
            console.log("Sending payment registration data:", paymentRegData);
            const paymentResponse = await apiService.makePayment(paymentRegData); // Assuming makePayment exists
            console.log('Payment Registration Response:', paymentResponse);
            if (paymentResponse.status !== 201 && paymentResponse.status !== 200) {
                throw new Error(`Payment registration failed with status: ${paymentResponse.status}`);
            }
            toast.info("Payment registration successful. Submitting application details...");
        } catch (paymentError) {
            console.error('Error during payment registration step:', paymentError);
            toast.error('Payment registration failed: ' + (paymentError.response?.data?.message || paymentError.message));
            isSubmitting.value = false;
            return;
        }
    }

    // Main API call to submit the application data
    console.log("Submitting application form data...");
    // Inspect formData before sending if needed:
    // for (let [key, value] of formData.entries()) {
    //     console.log(`${key}: ${value}`);
    // }
    const response = await apiService.createInstitutionProfile(formData); // Assuming this endpoint accepts FormData

    console.log('Application submission response:', response.data);

    if (application.status === 'draft') {
      toast.success('Application saved as draft successfully!');
    } else {
      toast.success('Application submitted successfully! Payment is being processed.');
      // resetForm(); // Optional: Reset form after successful submission
    }

  } catch (error) {
    console.error('Error submitting application:', error);
    const errorMessage = error.response?.data?.message ||
                         (error.response?.data ? JSON.stringify(error.response.data) : error.message) ||
                         'An unknown error occurred during submission.';
    toast.error(`Error submitting application: ${errorMessage}`);
  } finally {
    isSubmitting.value = false;
  }
};

// Save Draft Function
const saveDraft = () => {
  if (!application.institutionName) {
    toast.warn('Please enter the Institution Name before saving a draft.');
    return;
  }
  application.status = 'draft';
  application.is_payment_complete = false;
  handleSubmitActual(); // Call submission logic with draft status
};

// Fetch Master Data on Component Mount
onMounted(async () => {
  console.log('Fetching master data...');
  try {
    // Use Promise.all to fetch concurrently
    const [
        typesResponse,
        fundingResponse,
        standardsResponse,
        keyAspectsResponse,
        indicatorsResponse
    ] = await Promise.all([
      apiService.getMastersInstitutes(),
      apiService.getMastersSourceOfFundings(),
      apiService.getMastersStandards(),      // Fetch Standards
      apiService.getMastersKeyAspects(),     // Fetch Key Aspects
      apiService.getMastersIndicators()      // Fetch Indicators
    ]);

    // Process Institution Types
    if (typesResponse?.data?.results && Array.isArray(typesResponse.data.results)) {
      institutionTypesOptions.value = typesResponse.data.results;
      console.log('Institution Types loaded:', institutionTypesOptions.value.length);
    } else {
      console.error('Invalid data received for institution types:', typesResponse);
      institutionTypesOptions.value = [];
      toast.error('Error: Could not load Institution Types.');
    }

    // Process Funding Sources
    if (fundingResponse?.data?.results && Array.isArray(fundingResponse.data.results)) {
      fundingSourcesOptions.value = fundingResponse.data.results;
      console.log('Funding Sources loaded:', fundingSourcesOptions.value.length);
    } else {
      console.error('Invalid data received for funding sources:', fundingResponse);
      fundingSourcesOptions.value = [];
      toast.error('Error: Could not load Funding Sources.');
    }

    // Process Standards
    if (standardsResponse?.data?.results && Array.isArray(standardsResponse.data.results)) {
        standardsOptions.value = standardsResponse.data.results;
        console.log('Standards loaded:', standardsOptions.value.length);
    } else {
        console.error('Invalid data received for standards:', standardsResponse);
        standardsOptions.value = [];
        toast.error('Error: Could not load Standards.');
    }

    // Process Key Aspects
    if (keyAspectsResponse?.data?.results && Array.isArray(keyAspectsResponse.data.results)) {
        keyAspectsOptions.value = keyAspectsResponse.data.results;
        console.log('Key Aspects loaded:', keyAspectsOptions.value.length);
    } else {
        console.error('Invalid data received for key aspects:', keyAspectsResponse);
        keyAspectsOptions.value = [];
        toast.error('Error: Could not load Key Aspects.');
    }

     // Process Indicators
    if (indicatorsResponse?.data?.results && Array.isArray(indicatorsResponse.data.results)) {
        indicatorsOptions.value = indicatorsResponse.data.results;
        console.log('Indicators loaded:', indicatorsOptions.value.length);
    } else {
        console.error('Invalid data received for indicators:', indicatorsResponse);
        indicatorsOptions.value = [];
        toast.error('Error: Could not load Indicators.');
    }


  } catch (error) {
    console.error('Error fetching master data:', error);
    toast.error('Failed to load required dropdown options. Please try refreshing the page.');
    // Set options to empty arrays on error to prevent template issues
    institutionTypesOptions.value = [];
    fundingSourcesOptions.value = [];
    standardsOptions.value = [];
    keyAspectsOptions.value = [];
    indicatorsOptions.value = [];
  }
});

// Optional: Helper to reset form
// const resetForm = () => {
//     // ... implementation to reset application object to initial state ...
//     application.supportingDocuments = [];
//     if (fileInput.value) fileInput.value.value = '';
//     formSubmittedAttempt.value = false;
// }

</script>

<style scoped>
label.required::after {
  content: ' *';
  color: #ef4444; /* Red-500 */
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

input:focus, select:focus, textarea:focus {
    --tw-ring-color: theme('colors.blue.500');
    --tw-ring-offset-width: 2px;
     box-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
     border-color: theme('colors.blue.500');
}

input[type="text"], input[type="email"], input[type="number"], input[type="url"], input[type="date"], select, textarea {
    padding-top: 0.625rem;
    padding-bottom: 0.625rem;
}
</style>