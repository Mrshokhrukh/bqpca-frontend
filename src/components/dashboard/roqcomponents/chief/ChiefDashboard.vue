<!-- components/dashboard/roqcomponents/admin/AdminDashboard.vue -->
<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 lg:p-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-slate-900 mb-2 font-serif">System Configuration</h1>
          <p class="text-slate-600">Manage master data and form configurations</p>
        </div>
  
        <!-- Configuration Categories -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Decisions Configuration -->
          <div class="bg-white rounded-lg shadow-sm border border-slate-200">
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <h3 class="font-semibold text-slate-900">Application Decisions</h3>
                  </div>
                  <p class="text-sm text-slate-600">Configure possible application outcomes and statuses</p>
                </div>
              </div>
  
              <div class="space-y-3 mb-4">
                <div class="text-sm text-slate-600">
                  <span class="font-medium">Current Options:</span> 42 defined decisions
                </div>
                <div class="text-sm text-slate-500">
                  Used in: Application Review, Appeal Process
                </div>
              </div>
  
              <div class="flex gap-2">
                <router-link to="/admin/admin/roq/decisions"
                  class="text-sm px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 inline-flex items-center gap-1">
                  Manage Decisions
                </router-link>
              </div>
            </div>
          </div>
  
          <!-- Learning Types Configuration -->
          <div class="bg-white rounded-lg shadow-sm border border-slate-200">
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 class="font-semibold text-slate-900">Learning Types</h3>
                  </div>
                  <p class="text-sm text-slate-600">Define categories of learning and education formats</p>
                </div>
              </div>
  
              <div class="space-y-3 mb-4">
                <div class="text-sm text-slate-600">
                  <span class="font-medium">Active Types:</span> 15 learning categories
                </div>
                <div class="text-sm text-slate-500">
                  Used in: Course Setup, Learning Plans
                </div>
              </div>
  
              <div class="flex gap-2">
                <router-link to="/admin/admin/roq/learning_types"
                  class="text-sm px-4 py-2 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 inline-flex items-center gap-1">
                  Manage Types
                </router-link>
              </div>
            </div>
          </div>
  
          <!-- Qualifications Configuration -->
          <div class="bg-white rounded-lg shadow-sm border border-slate-200">
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-600" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                    </svg>
                    <h3 class="font-semibold text-slate-900">Qualifications</h3>
                  </div>
                  <p class="text-sm text-slate-600">Manage recognized qualifications and certifications</p>
                </div>
              </div>
  
              <div class="space-y-3 mb-4">
                <div class="text-sm text-slate-600">
                  <span class="font-medium">Total Defined:</span> 78 qualifications
                </div>
                <div class="text-sm text-slate-500">
                  Used in: Profile Verification, Applications
                </div>
              </div>
  
              <div class="flex gap-2">
                <router-link to="/admin/admin/roq/qualifications"
                  class="text-sm px-4 py-2 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-100 inline-flex items-center gap-1">
                  Manage Qualifications
                </router-link>
              </div>
            </div>
          </div>
  
          <!-- Document Request Reasons -->
          <div class="bg-white rounded-lg shadow-sm border border-slate-200">
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 class="font-semibold text-slate-900">Document Request Reasons</h3>
                  </div>
                  <p class="text-sm text-slate-600">Configure valid reasons for requesting document copies</p>
                </div>
              </div>
  
              <div class="space-y-3 mb-4">
                <div class="text-sm text-slate-600">
                  <span class="font-medium">Defined Reasons:</span> 12 options
                </div>
                <div class="text-sm text-slate-500">
                  Used in: Document Requests, Reprints
                </div>
              </div>
  
              <div class="flex gap-2">
                <router-link to="/admin/admin/roq/reason_for_issue_of_second_copy"
                  class="text-sm px-4 py-2 bg-amber-50 text-amber-600 rounded-md hover:bg-amber-100 inline-flex items-center gap-1">
                  Manage Reasons
                </router-link>
              </div>
            </div>
          </div>
  
          <!-- Course Types Configuration -->
          <div class="bg-white rounded-lg shadow-sm border border-slate-200">
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path
                        d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    <h3 class="font-semibold text-slate-900">Course Types</h3>
                  </div>
                  <p class="text-sm text-slate-600">Define different types of courses and programs</p>
                </div>
              </div>
  
              <div class="space-y-3 mb-4">
                <div class="text-sm text-slate-600">
                  <span class="font-medium">Available Types:</span> 9 course categories
                </div>
                <div class="text-sm text-slate-500">
                  Used in: Course Creation, Program Setup
                </div>
              </div>
  
              <div class="flex gap-2">
                <router-link to="/admin/admin/roq/type_of_courses"
                  class="text-sm px-4 py-2 bg-rose-50 text-rose-600 rounded-md hover:bg-rose-100 inline-flex items-center gap-1">
                  Manage Types
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // Component logic can be added here if needed
  </script>
  