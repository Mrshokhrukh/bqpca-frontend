<!-- StudentBioDataTable.vue -->
<template>
  <div class="p-8 min-h-screen">
    <div class="mx-auto">
      <!-- Header with Add Buttons and Filters -->
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Student Bio Data</h2>
        </div>
        <div class="space-x-2">
          <button
            @click="openAddStudentModal"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
          >
            Add Student
          </button>
        </div>
      </div>

      <!-- Filter/Search bar -->
      <div class="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div class="flex-1">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                class="block w-full rounded-lg border-gray-300 pl-10 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by name, CID/Passport, or course..."
              />
            </div>
          </div>
          <div class="w-full md:w-1/4">
            <select
              class="block w-full rounded-lg border-gray-300 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Filter by ECPF</option>
              <option value="ecpf1">ECPF 1</option>
              <option value="ecpf2">ECPF 2</option>
            </select>
          </div>
          <div class="w-full md:w-1/4">
            <select
              class="block w-full rounded-lg border-gray-300 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Filter by Branch</option>
              <option value="branch1">Branch 1</option>
              <option value="branch2">Branch 2</option>
            </select>
          </div>
          <div class="w-full md:w-1/4">
            <select
              class="block w-full rounded-lg border-gray-300 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Filter by Institute</option>
              <option value="institute1">Institute A</option>
              <option value="institute2">Institute B</option>
            </select>
          </div>
          <div class="w-full md:w-1/4">
            <select
              class="block w-full rounded-lg border-gray-300 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Filter by Programme Type</option>
              <option value="TVET">TVET</option>
              <option value="Higher">Higher</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Table View -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  ECPF Name
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Branch ECPF
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Institute
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Full Name
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  CID/Passport
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Course
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Programme Level
                </th>
                <th
                  scope="col"
                  class="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="student in studentData"
                :key="student.cidPassport"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ student.ecpfName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ student.branchEcpf || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ student.institute }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ student.fullName }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ student.cidPassport }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ student.course }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ student.programmeLevel }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button
                      @click="viewStudent(student)"
                      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                    >
                      View
                    </button>
                    <button
                      @click="editStudent(student)"
                      class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteStudent(student)"
                      class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="studentData.length === 0">
                <td
                  colspan="8"
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                >
                  No student data available.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Student Modal -->
      <StudentBioDataModal :is-open="isStudentModalOpen" @close="closeModal" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StudentBioDataModal from './modals/StudentBioDataModal.vue'

const studentData = ref([
  {
    ecpfName: 'Bhutan Counseling Center',
    branchEcpf: 'Paro Branch',
    institute: 'University of Example',
    fullName: 'Sonam Dema',
    cidPassport: '11223344556',
    course: 'Psychology',
    programmeLevel: 'Bachelors',
  },
  {
    ecpfName: 'Serene Mind ECPF',
    branchEcpf: null,
    institute: 'Global Institute',
    fullName: 'Tashi Wangchuk',
    cidPassport: '99887766554',
    course: 'Counseling',
    programmeLevel: 'Masters',
  },
  // ... more student data
])

const isStudentModalOpen = ref(false)

const openAddStudentModal = () => {
  isStudentModalOpen.value = true
}

const closeModal = () => {
  isStudentModalOpen.value = false
}

const viewStudent = (student) => {
  console.log('View Student:', student)
  // Logic to view student details (open modal or navigate to detail page)
}

const editStudent = (student) => {
  console.log('Edit Student:', student)
  // Logic to edit student details (open modal for editing)
}

const deleteStudent = (student) => {
  console.log('Delete Student:', student)
  // Logic to delete student record (confirmation dialog, API call)
}
</script>
