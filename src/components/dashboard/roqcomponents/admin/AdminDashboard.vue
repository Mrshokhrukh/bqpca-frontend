<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
    <!-- Header Section with stats overview -->
    <div class="max-w-[95rem] mx-auto mb-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div class="mb-4 text-center lg:text-left">
          <h1 class="text-4xl font-bold text-slate-900 mb-3 font-serif tracking-tight">
            System Configuration
          </h1>
          <div class="flex items-center gap-2 justify-center lg:justify-start text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Manage master data and form configurations</p>
          </div>
        </div>
      </div>

      <!-- Enhanced Grid Layout -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <!-- Dynamic Configuration Cards -->
        <div v-for="config in configurationCards" :key="config.id" class="group relative">
          <div
            :class="`absolute -inset-0.5 bg-gradient-to-r ${config.gradientClasses} rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300`">
          </div>
          <div
            :class="`relative bg-white rounded-lg shadow-sm border border-slate-200 ${config.hoverBorderClass} transition-all duration-300`">
            <div class="p-6">
              <div class="flex items-start justify-between mb-6">
                <div>
                  <div class="flex items-center gap-3 mb-3">
                    <div
                      :class="`p-2 ${config.iconBgClass} rounded-lg ${config.iconHoverBgClass} transition-colors duration-300`">
                      <component :is="config.icon" :class="`h-6 w-6 ${config.iconColorClass}`" />
                    </div>
                    <h3 class="font-semibold text-slate-900 text-lg">{{ config.title }}</h3>
                  </div>
                  <p class="text-sm text-slate-600">{{ config.description }}</p>
                </div>
              </div>

              <div class="space-y-4 mb-6">
                <div class="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
                  <div class="text-sm">
                    <span class="text-slate-600">{{ config.countLabel }}:</span>
                    <span class="font-semibold text-slate-900 ml-1">{{ counts[config.countRef] }} {{ config.countSuffix
                      }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-2 text-sm text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Used in: {{ config.usedIn.join(', ') }}
                </div>
              </div>

              <router-link :to="config.route"
                :class="`inline-flex items-center gap-2 text-sm px-4 py-2.5 ${config.buttonClasses} rounded-lg transition-colors duration-300 font-medium group w-full justify-center`">
                {{ config.buttonText }}
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
const counts = ref({
  decisions: 0,
  learningTypes: 0,
  qualifications: 0,
  reasons: 0,
  courseTypes: 0,
  genders: 0,
  countries: 0
});

// Configuration cards data
const configurationCards = [
  {
    id: 'decisions',
    title: 'Application Decisions',
    description: 'Configure possible application outcomes and statuses',
    countLabel: 'Current Options',
    countRef: 'decisions',
    countSuffix: 'defined decisions',
    usedIn: ['Application Review', 'Appeal Process'],
    route: '/admin/admin/roq/decisions',
    buttonText: 'Manage Decisions',
    gradientClasses: 'from-blue-600 to-blue-400',
    hoverBorderClass: 'hover:border-blue-200',
    iconBgClass: 'bg-blue-50',
    iconHoverBgClass: 'group-hover:bg-blue-100',
    iconColorClass: 'text-blue-600',
    buttonClasses: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      </svg>`
    }
  },
  {
    id: 'learningTypes',
    title: 'Learning Types',
    description: 'Define categories of learning and education formats',
    countLabel: 'Active Types',
    countRef: 'learningTypes',
    countSuffix: 'learning categories',
    usedIn: ['Course Setup', 'Learning Plans'],
    route: '/admin/admin/roq/learning_types',
    buttonText: 'Manage Types',
    gradientClasses: 'from-purple-600 to-purple-400',
    hoverBorderClass: 'hover:border-purple-200',
    iconBgClass: 'bg-purple-50',
    iconHoverBgClass: 'group-hover:bg-purple-100',
    iconColorClass: 'text-purple-600',
    buttonClasses: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>`
    }
  },
  {
    id: 'qualifications',
    title: 'Qualifications',
    description: 'Manage recognized qualifications and certifications',
    countLabel: 'Total Defined',
    countRef: 'qualifications',
    countSuffix: 'qualifications',
    usedIn: ['Profile Verification', 'Applications'],
    route: '/admin/admin/roq/qualifications',
    buttonText: 'Manage Qualifications',
    gradientClasses: 'from-emerald-600 to-emerald-400',
    hoverBorderClass: 'hover:border-emerald-200',
    iconBgClass: 'bg-emerald-50',
    iconHoverBgClass: 'group-hover:bg-emerald-100',
    iconColorClass: 'text-emerald-600',
    buttonClasses: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
      </svg>`
    }
  },
  {
    id: 'reasons',
    title: 'Second Copy Reasons',
    description: 'Configure valid reasons for requesting second copies',
    countLabel: 'Defined Reasons',
    countRef: 'reasons',
    countSuffix: 'options',
    usedIn: ['Document Requests', 'Reprints'],
    route: '/admin/admin/roq/reason_for_issue_of_second_copy',
    buttonText: 'Manage Reasons',
    gradientClasses: 'from-amber-600 to-amber-400',
    hoverBorderClass: 'hover:border-amber-200',
    iconBgClass: 'bg-amber-50',
    iconHoverBgClass: 'group-hover:bg-amber-100',
    iconColorClass: 'text-amber-600',
    buttonClasses: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>`
    }
  },
  {
    id: 'courseTypes',
    title: 'Course Types',
    description: 'Define different types of courses and programs',
    countLabel: 'Available Types',
    countRef: 'courseTypes',
    countSuffix: 'course categories',
    usedIn: ['Course Creation', 'Program Setup'],
    route: '/admin/admin/roq/type_of_courses',
    buttonText: 'Manage Types',
    gradientClasses: 'from-rose-600 to-rose-400',
    hoverBorderClass: 'hover:border-rose-200',
    iconBgClass: 'bg-rose-50',
    iconHoverBgClass: 'group-hover:bg-rose-100',
    iconColorClass: 'text-rose-600',
    buttonClasses: 'bg-rose-50 text-rose-600 hover:bg-rose-100',
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>`
    }
  },
  {
    id: 'genders',
    title: 'Gender Types',
    description: 'Manage gender categories and definitions',
    countLabel: 'Available Types',
    countRef: 'genders',
    countSuffix: 'genders',
    usedIn: ['User Profiles', 'Registration'],
    route: '/admin/admin/roq/genders',
    buttonText: 'Manage Genders',
    gradientClasses: 'from-indigo-600 to-indigo-400',
    hoverBorderClass: 'hover:border-indigo-200',
    iconBgClass: 'bg-indigo-50',
    iconHoverBgClass: 'group-hover:bg-indigo-100',
    iconColorClass: 'text-indigo-600',
    buttonClasses: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>`
    }
  },
  {
    id: 'countries',
    title: 'Countries',
    description: 'Manage country list and information',
    countLabel: 'Registered',
    countRef: 'countries',
    countSuffix: 'countries',
    usedIn: ['Address Info', 'Location Data'],
    route: '/admin/admin/roq/countries',
    buttonText: 'Manage Countries',
    gradientClasses: 'from-teal-600 to-teal-400',
    hoverBorderClass: 'hover:border-teal-200',
    iconBgClass: 'bg-teal-50',
    iconHoverBgClass: 'group-hover:bg-teal-100',
    iconColorClass: 'text-teal-600',
    buttonClasses: 'bg-teal-50 text-teal-600 hover:bg-teal-100',
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>`
    }
  }
];

// Fetch counts on component mount
onMounted(async () => {
  try {
    const [
      decisionsResponse,
      learningTypesResponse,
      qualificationsResponse,
      reasonsResponse,
      courseTypesResponse,
      gendersResponse,
      countriesResponse
    ] = await Promise.all([
      services.getDecisions(),
      services.getLearningTypes(),
      services.getQualifications(),
      services.getReasonsForIssueOfSecondCopy(),
      services.getTypesOfCourse(),
      services.getGenders(),
      services.getCountries()
    ]);

    counts.value = {
      decisions: decisionsResponse.data.count,
      learningTypes: learningTypesResponse.data.count,
      qualifications: qualificationsResponse.data.count,
      reasons: reasonsResponse.data.count,
      courseTypes: courseTypesResponse.data.count,
      genders: gendersResponse.data.count,
      countries: countriesResponse.data.count
    };
  } catch (error) {
    console.error('Error fetching counts:', error);
  }
});
</script>
