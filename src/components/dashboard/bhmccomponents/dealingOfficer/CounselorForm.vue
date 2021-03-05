<template>
  <div class="applications-container p-6 bg-gray-50 min-h-screen">
    <!-- Header with stats cards -->
    <div class="header mb-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Application Management</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500 font-medium">Total Applications</p>
              <p class="text-xl font-bold text-gray-800">{{ totalApplications }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500 font-medium">Pending Review</p>
              <p class="text-xl font-bold text-gray-800">{{ pendingApplications }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500 font-medium">Approved</p>
              <p class="text-xl font-bold text-gray-800">{{ approvedApplications }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="mb-6 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
      <h2 class="text-lg font-medium text-gray-800 mb-4">Filters</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Search Box -->
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Search</label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input type="text" v-model="searchQuery" placeholder="Search by name, CID or registration..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition-all">
          </div>
        </div>

        <!-- Applicant Filter -->
        <div>
          <label for="applicantFilter" class="block text-sm font-medium text-gray-500 mb-1">Applicant</label>
          <select id="applicantFilter" v-model="applicantFilter"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition-all">
            <option value="">All Applicants</option>
            <option v-for="applicant in uniqueApplicants" :key="applicant.cid" :value="applicant.cid">
              {{ applicant.full_name }}
            </option>
          </select>
        </div>

        <!-- Status Filter -->
        <div>
          <label for="statusFilter" class="block text-sm font-medium text-gray-500 mb-1">Status</label>
          <select id="statusFilter" v-model="statusFilter"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition-all bg-white">
            <option value="All Statuses">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Regretted">Rejected</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Applications Table -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="p-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-800">Applications</h2>
        <p class="text-sm text-gray-500">
          Showing {{ filteredCounsellors.length > 0 ? 1 : 0 }} to {{ filteredCounsellors.length }} of {{
                filteredCounsellors.length }} results
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applicant</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registration No.</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Loading Skeletons -->
            <template v-if="loading">
              <tr v-for="i in 5" :key="`skeleton-${i}`" class="animate-pulse">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="h-4 bg-gray-200 rounded w-8"></div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-10 w-10 rounded-full bg-gray-200"></div>
                    <div class="ml-4">
                      <div class="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                      <div class="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="h-4 bg-gray-200 rounded w-24"></div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="h-5 bg-gray-200 rounded w-16"></div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="h-4 bg-gray-200 rounded w-20"></div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="h-8 bg-gray-200 rounded w-16"></div>
                </td>
              </tr>
            </template>

            <!-- No Results -->
            <tr v-else-if="filteredCounsellors.length === 0">
              <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                <div class="flex flex-col items-center py-6">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mb-4" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p class="text-lg font-medium">No applications found</p>
                  <p class="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              </td>
            </tr>

            <!-- Results -->
            <tr v-else v-for="(counsellor, index) in filteredCounsellors" :key="counsellor.cid"
              class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{{ index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <img class="h-10 w-10 rounded-full object-cover border border-gray-200"
                      :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(counsellor.full_name)}&background=random&size=100`"
                      alt="">
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ counsellor.full_name }}</div>
                    <div class="text-sm text-gray-500">{{ counsellor.cid }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ counsellor.application }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                counsellor.review_decision === 'Approved' ? 'bg-green-100 text-green-800' :
                  counsellor.review_decision === 'Regretted' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
              ]">
                  {{ counsellor.review_decision }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(new Date()) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button @click="viewDetails(counsellor)"
                  class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="showDetailsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-200">
      <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div class="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center z-10">
          <h2 class="text-lg font-bold text-gray-900">Application Details</h2>
          <button @click="showDetailsModal = false" class="text-gray-500 hover:text-gray-700 focus:outline-none p-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="selectedCounsellor" class="p-6 space-y-6">
          <!-- Personal Information -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <p class="text-sm text-gray-500">Full Name</p>
                <p class="text-sm font-medium text-gray-900">{{ selectedCounsellor.full_name }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">CID</p>
                <p class="text-sm font-medium text-gray-900">{{ selectedCounsellor.cid }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Gender</p>
                <p class="text-sm font-medium text-gray-900">{{ selectedCounsellor.gender }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Registration No.</p>
                <p class="text-sm font-medium text-gray-900">{{ selectedCounsellor.application }}</p>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Information
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <p class="text-sm text-gray-500">Contact Number</p>
                <p class="text-sm font-medium text-gray-900">{{ selectedCounsellor.contact_no }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Email Address</p>
                <p class="text-sm font-medium text-gray-900">{{ selectedCounsellor.email_address }}</p>
              </div>
            </div>
          </div>

          <!-- Counselling Information -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Counselling Information
            </h3>
            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-500">Title</p>
                <p class="text-sm font-medium text-gray-900">{{ selectedCounsellor.counselling_title }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Details</p>
                <p class="text-sm font-medium text-gray-900 whitespace-pre-line">{{
                selectedCounsellor.counselling_details }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Report</p>
                <p class="text-sm font-medium text-gray-900">{{ selectedCounsellor.counselling_report }}
                </p>
              </div>
            </div>
          </div>

          <!-- Attachments -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              Attachments
            </h3>
            <div
              v-if="selectedCounsellor.Counselling_attachments && selectedCounsellor.Counselling_attachments.length > 0"
              class="space-y-2">
              <div v-for="attachment in selectedCounsellor.Counselling_attachments" :key="attachment.id"
                class="flex items-center p-2 bg-white rounded-md border border-gray-200 hover:bg-blue-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 mr-2" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <a :href="attachment.file" target="_blank" class="text-blue-600 hover:underline text-sm flex-1">
                  {{ getFileName(attachment.file) }}
                </a>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
            </div>
            <p v-else class="text-sm text-gray-500">No attachments provided</p>
          </div>

          <!-- Additional Information -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Additional Information
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <p class="text-sm text-gray-500">Declaration</p>
                <p class="text-sm font-medium">
                  <span :class="[
                'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                selectedCounsellor.declaration ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]">
                    {{ selectedCounsellor.declaration ? 'Accepted' : 'Not Accepted' }}
                  </span>
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Review Status</p>
                <p class="text-sm font-medium">
                  <span :class="[
                'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                selectedCounsellor.review_decision === 'Approved' ? 'bg-green-100 text-green-800' :
                  selectedCounsellor.review_decision === 'Regretted' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
              ]">
                    {{ selectedCounsellor.review_decision }}
                  </span>
                </p>
              </div>
            </div>
            <div v-if="selectedCounsellor.review_remarks" class="mt-4">
              <p class="text-sm text-gray-500">Review Remarks</p>
              <div class="mt-1 p-3 bg-white border border-gray-200 rounded-md">
                <p class="text-sm font-medium text-gray-900">{{ selectedCounsellor.review_remarks }}</p>
              </div>
            </div>
          </div>

          <!-- Remarks -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-medium text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Remarks
            </h3>
            <div class="mt-1 p-3 bg-white border border-gray-200 rounded-md">
              <p class="text-sm text-gray-700">{{ selectedCounsellor.remarks || 'No remarks provided' }}
              </p>
            </div>
          </div>

          <!-- Decision -->
          <div v-if="showConfirmation" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 animate-fadeIn">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                  fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-yellow-800">Confirmation</h3>
                <div class="mt-2 text-sm text-yellow-700">
                  <p>Are you sure you want to {{ confirmAction === 'approve' ? 'approve' : 'reject' }}
                    this
                    application?</p>
                </div>
                <div class="mt-4 flex space-x-3">
                  <button @click="confirmUpdateStatus"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors">
                    Confirm
                  </button>
                  <button @click="cancelConfirmation"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Add Review Remarks -->
          <div v-else-if="confirmAction" class="bg-gray-50 rounded-lg p-4 animate-fadeIn">
            <h3 class="font-medium text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Add Review Remarks
            </h3>
            <textarea v-model="reviewRemarks" rows="4" placeholder="Enter remarks for this decision (optional)"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"></textarea>
            <div class="flex justify-end space-x-3 mt-4">
              <button @click="cancelConfirmation"
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
                Cancel
              </button>
              <button @click="showConfirmation = true"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                Proceed
              </button>
            </div>
          </div>

          <!-- Action Buttons or Status Message -->
          <div v-else>
            <div
              v-if="selectedCounsellor.review_decision !== 'Approved' && selectedCounsellor.review_decision !== 'Regretted'"
              class="flex justify-end space-x-3">
              <button @click="promptConfirmation('reject')"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Regret
              </button>
              <button @click="promptConfirmation('approve')"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Approve
              </button>
            </div>
            <div v-else class="bg-gray-50 border border-gray-200 rounded-md p-4 text-sm text-gray-600">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p>This application has been {{ selectedCounsellor.review_decision.toLowerCase() }}.
                    No
                    further actions can be taken.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import apiService from '@/services/services';

// State
const counsellors = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const statusFilter = ref('All Statuses');
const applicantFilter = ref('');
const showDetailsModal = ref(false);
const selectedCounsellor = ref(null);
const showConfirmation = ref(false);
const confirmAction = ref('');
const reviewRemarks = ref('');

// Computed properties
const totalApplications = computed(() => counsellors.value.length);
const pendingApplications = computed(() => counsellors.value.filter(c => c.review_decision !== 'Approved' && c.review_decision !== 'Regretted').length);
const approvedApplications = computed(() => counsellors.value.filter(c => c.review_decision === 'Approved').length);

// Get unique applicants for dropdown
const uniqueApplicants = computed(() => {
  const uniqueMap = new Map();

  counsellors.value.forEach(counsellor => {
    if (!uniqueMap.has(counsellor.cid)) {
      uniqueMap.set(counsellor.cid, {
        cid: counsellor.cid,
        full_name: counsellor.full_name
      });
    }
  });

  return Array.from(uniqueMap.values());
});

const filteredCounsellors = computed(() => {
  let result = [...counsellors.value];

  // Apply applicant filter
  if (applicantFilter.value) {
    result = result.filter(c => c.cid === applicantFilter.value);
  }

  // Apply status filter
  if (statusFilter.value !== 'All Statuses') {
    result = result.filter(c => c.review_decision === statusFilter.value);
  }

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(c =>
      c.full_name.toLowerCase().includes(query) ||
      c.cid.toLowerCase().includes(query) ||
      c.application.toLowerCase().includes(query)
    );
  }

  return result;
});

// Methods
const fetchCounsellors = async () => {
  loading.value = true;
  try {
    const response = await apiService.getBmhcCounsellors();
    counsellors.value = response.data.results;
  } catch (error) {
    console.error('Error fetching counsellors:', error);
  } finally {
    loading.value = false;
  }
};

const viewDetails = (counsellor) => {
  selectedCounsellor.value = counsellor;
  showDetailsModal.value = true;
  showConfirmation.value = false;
  confirmAction.value = '';
  reviewRemarks.value = '';
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

const getFileName = (url) => {
  if (!url) return 'File';
  const parts = url.split('/');
  return parts[parts.length - 1];
};

const promptConfirmation = (action) => {
  confirmAction.value = action;
  reviewRemarks.value = '';
};

const cancelConfirmation = () => {
  showConfirmation.value = false;
  confirmAction.value = '';
  reviewRemarks.value = '';
};

const confirmUpdateStatus = async () => {
  if (!selectedCounsellor.value || !confirmAction.value) return;

  const status = confirmAction.value === 'approve' ? 'Approved' : 'Regretted';

  try {
    await apiService.patchBmhcCounsellor(selectedCounsellor.value.id, {
      review_decision: status,
      review_remarks: reviewRemarks.value || null
    });

    // Update local state
    const index = counsellors.value.findIndex(c => c.id === selectedCounsellor.value.id);
    if (index !== -1) {
      counsellors.value[index].review_decision = status;
      counsellors.value[index].review_remarks = reviewRemarks.value || null;
      selectedCounsellor.value.review_decision = status;
      selectedCounsellor.value.review_remarks = reviewRemarks.value || null;
    }

    showConfirmation.value = false;
    confirmAction.value = '';
    reviewRemarks.value = '';
  } catch (error) {
    console.error(`Error updating status to ${status}:`, error);
  }
};

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-fadeIn {
        animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);

// Fetch data on component mount
onMounted(() => {
  fetchCounsellors();
});
</script>
