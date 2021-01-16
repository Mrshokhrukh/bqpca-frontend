<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Enhanced Header Section -->
      <div class="mb-12 text-center lg:text-left">
        <h1 class="text-4xl font-bold text-slate-900 mb-3 font-serif tracking-tight">
          System Configuration
        </h1>
        <div class="flex items-center gap-2 justify-center lg:justify-start text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Manage master data and form configurations</p>
        </div>
      </div>

      <!-- Enhanced Configuration Categories -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Decisions Configuration -->
        <div class="group relative">
          <div
            class="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300">
          </div>
          <div
            class="relative bg-white rounded-lg shadow-sm border border-slate-200 hover:border-blue-200 transition-all duration-300">
            <div class="p-6">
              <div class="flex items-start justify-between mb-6">
                <div>
                  <div class="flex items-center gap-3 mb-3">
                    <div class="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 class="font-semibold text-slate-900 text-lg">Application Decisions</h3>
                  </div>
                  <p class="text-sm text-slate-600">Configure possible application outcomes and statuses</p>
                </div>
              </div>

              <div class="space-y-4 mb-6">
                <div class="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
                  <div class="text-sm">
                    <span class="text-slate-600">Current Options:</span>
                    <span class="font-semibold text-slate-900 ml-1">{{ decisionsCount }} defined decisions</span>
                  </div>
                </div>
                <div class="flex items-center gap-2 text-sm text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Used in: Application Review, Appeal Process
                </div>
              </div>

              <router-link to="/admin/admin/roq/decisions"
                class="inline-flex items-center gap-2 text-sm px-4 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-300 font-medium group">
                Manage Decisions
                <svg xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Learning Types Configuration -->
        <div class="group relative">
          <div
            class="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300">
          </div>
          <div
            class="relative bg-white rounded-lg shadow-sm border border-slate-200 hover:border-purple-200 transition-all duration-300">
            <div class="p-6">
              <div class="flex items-start justify-between mb-6">
                <div>
                  <div class="flex items-center gap-3 mb-3">
                    <div class="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 class="font-semibold text-slate-900 text-lg">Learning Types</h3>
                  </div>
                  <p class="text-sm text-slate-600">Define categories of learning and education formats</p>
                </div>
              </div>

              <div class="space-y-4 mb-6">
                <div class="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
                  <div class="text-sm">
                    <span class="text-slate-600">Active Types:</span>
                    <span class="font-semibold text-slate-900 ml-1">{{ learningTypesCount }} learning categories</span>
                  </div>
                </div>
                <div class="flex items-center gap-2 text-sm text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Used in: Course Setup, Learning Plans
                </div>
              </div>

              <router-link to="/admin/admin/roq/learning_types"
                class="inline-flex items-center gap-2 text-sm px-4 py-2.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors duration-300 font-medium group">
                Manage Types
                <svg xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Qualifications Configuration -->
        <div class="group relative">
          <div
            class="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300">
          </div>
          <div
            class="relative bg-white rounded-lg shadow-sm border border-slate-200 hover:border-emerald-200 transition-all duration-300">
            <div class="p-6">
              <div class="flex items-start justify-between mb-6">
                <div>
                  <div class="flex items-center gap-3 mb-3">
                    <div class="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-600" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                      </svg>
                    </div>
                    <h3 class="font-semibold text-slate-900 text-lg">Qualifications</h3>
                  </div>
                  <p class="text-sm text-slate-600">Manage recognized qualifications and certifications</p>
                </div>
              </div>

              <div class="space-y-4 mb-6">
                <div class="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
                  <div class="text-sm">
                    <span class="text-slate-600">Total Defined:</span>
                    <span class="font-semibold text-slate-900 ml-1">{{ qualificationsCount }} qualifications</span>
                  </div>
                </div>
                <div class="flex items-center gap-2 text-sm text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Used in: Profile Verification, Applications
                </div>
              </div>

              <router-link to="/admin/admin/roq/qualifications"
                class="inline-flex items-center gap-2 text-sm px-4 py-2.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors duration-300 font-medium group">
                Manage Qualifications
                <svg xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Document Request Reasons -->
        <div class="group relative">
          <div
            class="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-amber-400 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300">
          </div>
          <div
            class="relative bg-white rounded-lg shadow-sm border border-slate-200 hover:border-amber-200 transition-all duration-300">
            <div class="p-6">
              <div class="flex items-start justify-between mb-6">
                <div>
                  <div class="flex items-center gap-3 mb-3">
                    <div class="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-600" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 class="font-semibold text-slate-900 text-lg">Second Copy Reasons</h3>
                  </div>
                  <p class="text-sm text-slate-600">Configure valid reasons for requesting second copies</p>
                </div>
              </div>

              <div class="space-y-4 mb-6">
                <div class="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
                  <div class="text-sm">
                    <span class="text-slate-600">Defined Reasons:</span>
                    <span class="font-semibold text-slate-900 ml-1">{{ reasonsCount }} options</span>
                  </div>
                </div>
                <div class="flex items-center gap-2 text-sm text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Used in: Document Requests, Reprints
                </div>
              </div>

              <router-link to="/admin/admin/roq/reason_for_issue_of_second_copy"
                class="inline-flex items-center gap-2 text-sm px-4 py-2.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors duration-300 font-medium group">
                Manage Reasons
                <svg xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Course Types Configuration -->
        <div class="group relative">
          <div
            class="absolute -inset-0.5 bg-gradient-to-r from-rose-600 to-rose-400 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300">
          </div>
          <div
            class="relative bg-white rounded-lg shadow-sm border border-slate-200 hover:border-rose-200 transition-all duration-300">
            <div class="p-6">
              <div class="flex items-start justify-between mb-6">
                <div>
                  <div class="flex items-center gap-3 mb-3">
                    <div class="p-2 bg-rose-50 rounded-lg group-hover:bg-rose-100 transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-rose-600" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path
                          d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                    </div>
                    <h3 class="font-semibold text-slate-900 text-lg">Course Types</h3>
                  </div>
                  <p class="text-sm text-slate-600">Define different types of courses and programs</p>
                </div>
              </div>

              <div class="space-y-4 mb-6">
                <div class="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
                  <div class="text-sm">
                    <span class="text-slate-600">Available Types:</span>
                    <span class="font-semibold text-slate-900 ml-1">{{ courseTypesCount }} course categories</span>
                  </div>
                </div>
                <div class="flex items-center gap-2 text-sm text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Used in: Course Creation, Program Setup
                </div>
              </div>

              <router-link to="/admin/admin/roq/type_of_courses"
                class="inline-flex items-center gap-2 text-sm px-4 py-2.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors duration-300 font-medium group">
                Manage Types
                <svg xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import services from '@/services/services';

// State for counts
const decisionsCount = ref(0);
const learningTypesCount = ref(0);
const qualificationsCount = ref(0);
const reasonsCount = ref(0);
const courseTypesCount = ref(0);

// Fetch counts on component mount
onMounted(async () => {
  try {
    const [
      decisionsResponse,
      learningTypesResponse,
      qualificationsResponse,
      reasonsResponse,
      courseTypesResponse
    ] = await Promise.all([
      services.getDecisions(),
      services.getLearningTypes(),
      services.getQualifications(),
      services.getReasonsForIssueOfSecondCopy(),
      services.getTypesOfCourse()
    ]);

    decisionsCount.value = decisionsResponse.data.count;
    learningTypesCount.value = learningTypesResponse.data.count;
    qualificationsCount.value = qualificationsResponse.data.count;
    reasonsCount.value = reasonsResponse.data.count;
    courseTypesCount.value = courseTypesResponse.data.count;
  } catch (error) {
    console.error('Error fetching counts:', error);
  }
});
</script>
