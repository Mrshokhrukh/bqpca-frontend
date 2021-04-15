<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4">
    <div class="max-w-[95rem] mx-auto mb-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div class="mb-4 text-center lg:text-left">
          <h1 class="text-4xl font-bold text-slate-900 mb-3 font-serif tracking-tight">
            ECPF Admin Dashboard
          </h1>
          <div class="flex items-center gap-2 justify-center lg:justify-start text-slate-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p>Manage ECPF master data and configurations</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div v-for="config in configurationCards" :key="config.id" class="group relative">
          <div
            :class="`absolute -inset-0.5 bg-gradient-to-r ${config.gradientClasses} rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300`"
          ></div>
          <div
            :class="`relative bg-white rounded-lg shadow-sm border border-slate-200 ${config.hoverBorderClass} transition-all duration-300`"
          >
            <div class="p-6">
              <div class="flex items-start justify-between mb-6">
                <div>
                  <div class="flex items-center gap-3 mb-3">
                    <div
                      :class="`p-2 ${config.iconBgClass} rounded-lg ${config.iconHoverBgClass} transition-colors duration-300`"
                    >
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
                    <span class="font-semibold text-slate-900 ml-1"
                      >{{ counts[config.countRef] }} {{ config.countSuffix }}</span
                    >
                  </div>
                </div>
                <div class="flex items-center gap-2 text-sm text-slate-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  Used in: {{ config.usedIn.join(', ') }}
                </div>
              </div>

              <router-link
                :to="config.route"
                :class="`inline-flex items-center gap-2 text-sm px-4 py-2.5 ${config.buttonClasses} rounded-lg transition-colors duration-300 font-medium group w-full justify-center`"
              >
                {{ config.buttonText }}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
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
import { ref, onMounted } from 'vue'
import services from '@/services/services'

const counts = ref({
  complianceActions: 0,
  complianceActionsTaken: 0,
  institutes: 0,
  issueCompliances: 0,
  promotionalEventTypes: 0,
  ecpfDecisions: 0,
  qualifications: 0,
  infrastructures: 0,
  positions: 0,
  serviceCategories: 0,
  statuses: 0,
})

const configurationCards = [
  {
    id: 'complianceActions',
    title: 'Compliance Actions',
    description: 'Manage master compliance actions',
    countLabel: 'Total Actions',
    countRef: 'complianceActions',
    countSuffix: 'actions',
    usedIn: ['Compliance', 'Enforcement'],
    route: '/admin/admin/ecpf/compliance_action',
    buttonText: 'Manage Actions',
    gradientClasses: 'from-blue-600 to-blue-400',
    hoverBorderClass: 'hover:border-blue-200',
    iconBgClass: 'bg-blue-50',
    iconHoverBgClass: 'group-hover:bg-blue-100',
    iconColorClass: 'text-blue-600',
    buttonClasses: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>`,
    },
  },
  {
    id: 'complianceActionsTaken',
    title: 'Compliance Actions Taken',
    description: 'Manage actions taken for compliance',
    countLabel: 'Actions Taken',
    countRef: 'complianceActionsTaken',
    countSuffix: 'records',
    usedIn: ['Compliance Tracking', 'Reporting'],
    route: '/admin/admin/ecpf/compliance_action_taken',
    buttonText: 'Manage Actions Taken',
    gradientClasses: 'from-purple-600 to-purple-400',
    hoverBorderClass: 'hover:border-purple-200',
    iconBgClass: 'bg-purple-50',
    iconHoverBgClass: 'group-hover:bg-purple-100',
    iconColorClass: 'text-purple-600',
    buttonClasses: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`,
    },
  },
  {
    id: 'institutes',
    title: 'Institutes/Colleges/Universities',
    description: 'Manage educational institutions',
    countLabel: 'Total Institutions',
    countRef: 'institutes',
    countSuffix: 'institutions',
    usedIn: ['Institution Management', 'Accreditation'],
    route: '/admin/admin/ecpf/institutes',
    buttonText: 'Manage Institutions',
    gradientClasses: 'from-emerald-600 to-emerald-400',
    hoverBorderClass: 'hover:border-emerald-200',
    iconBgClass: 'bg-emerald-50',
    iconHoverBgClass: 'group-hover:bg-emerald-100',
    iconColorClass: 'text-emerald-600',
    buttonClasses: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`,
    },
  },
  {
    id: 'issueCompliances',
    title: 'Issue Compliances',
    description: 'Manage compliance issues',
    countLabel: 'Total Issues',
    countRef: 'issueCompliances',
    countSuffix: 'issues',
    usedIn: ['Issue Tracking', 'Resolution'],
    route: '/admin/admin/ecpf/issue_compliances',
    buttonText: 'Manage Issues',
    gradientClasses: 'from-amber-600 to-amber-400',
    hoverBorderClass: 'hover:border-amber-200',
    iconBgClass: 'bg-amber-50',
    iconHoverBgClass: 'group-hover:bg-amber-100',
    iconColorClass: 'text-amber-600',
    buttonClasses: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`,
    },
  },
  {
    id: 'promotionalEventTypes',
    title: 'Promotional Event Types',
    description: 'Manage types of promotional events',
    countLabel: 'Event Types',
    countRef: 'promotionalEventTypes',
    countSuffix: 'types',
    usedIn: ['Event Management', 'Marketing'],
    route: '/admin/admin/ecpf/promotional_event_types',
    buttonText: 'Manage Event Types',
    gradientClasses: 'from-rose-600 to-rose-400',
    hoverBorderClass: 'hover:border-rose-200',
    iconBgClass: 'bg-rose-50',
    iconHoverBgClass: 'group-hover:bg-rose-100',
    iconColorClass: 'text-rose-600',
    buttonClasses: 'bg-rose-50 text-rose-600 hover:bg-rose-100',
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3H17v13h-2.303a18.723 18.723 0 01-5.26-10.317z"/></svg>`,
    },
  },
  {
    id: 'ecpfDecisions',
    title: 'ECPF Decisions',
    description: 'Manage decisions related to ECPF',
    countLabel: 'Total Decisions',
    countRef: 'ecpfDecisions',
    countSuffix: 'decisions',
    usedIn: ['Decision Making', 'Policy'],
    route: '/admin/admin/ecpf/ecpf_decisions',
    buttonText: 'Manage Decisions',
    gradientClasses: 'from-teal-600 to-teal-400',
    hoverBorderClass: 'hover:border-teal-200',
    iconBgClass: 'bg-teal-50',
    iconHoverBgClass: 'group-hover:bg-teal-100',
    iconColorClass: 'text-teal-600',
    buttonClasses: 'bg-teal-50 text-teal-600 hover:bg-teal-100',
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>`,
    },
  },
  {
    id: 'qualifications',
    title: 'Qualifications',
    description: 'Manage ECPF qualifications',
    countLabel: 'Total Qualifications',
    countRef: 'qualifications',
    countSuffix: 'qualifications',
    usedIn: ['Qualification Management', 'Verification'],
    route: '/admin/admin/ecpf/qualifications',
    buttonText: 'Manage Qualifications',
    gradientClasses: 'from-indigo-600 to-indigo-400',
    hoverBorderClass: 'hover:border-indigo-200',
    iconBgClass: 'bg-indigo-50',
    iconHoverBgClass: 'group-hover:bg-indigo-100',
    iconColorClass: 'text-indigo-600',
    buttonClasses: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>`,
    },
  },
  {
    id: 'infrastructures',
    title: 'Infrastructures',
    description: 'Manage infrastructure details',
    countLabel: 'Total Infrastructures',
    countRef: 'infrastructures',
    countSuffix: 'infrastructures',
    usedIn: ['Infrastructure Management', 'Planning'],
    route: '/admin/admin/ecpf/infrastructures',
    buttonText: 'Manage Infrastructures',
    gradientClasses: 'from-lime-600 to-lime-400',
    hoverBorderClass: 'hover:border-lime-200',
    iconBgClass: 'bg-lime-50',
    iconHoverBgClass: 'group-hover:bg-lime-100',
    iconColorClass: 'text-lime-600',
    buttonClasses: 'bg-lime-50 text-lime-600 hover:bg-lime-100',
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`,
    },
  },
  {
    id: 'positions',
    title: 'Positions',
    description: 'Manage positions within ECPF',
    countLabel: 'Total Positions',
    countRef: 'positions',
    countSuffix: 'positions',
    usedIn: ['Position Management', 'Hierarchy'],
    route: '/admin/admin/ecpf/positions',
    buttonText: 'Manage Positions',
    gradientClasses: 'from-pink-600 to-pink-400',
    hoverBorderClass: 'hover:border-pink-200',
    iconBgClass: 'bg-pink-50',
    iconHoverBgClass: 'group-hover:bg-pink-100',
    iconColorClass: 'text-pink-600',
    buttonClasses: 'bg-pink-50 text-pink-600 hover:bg-pink-100',
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>`,
    },
  },
  {
    id: 'serviceCategories',
    title: 'Service Categories',
    description: 'Manage categories of services',
    countLabel: 'Total Categories',
    countRef: 'serviceCategories',
    countSuffix: 'categories',
    usedIn: ['Service Management', 'Classification'],
    route: '/admin/admin/ecpf/service_categories',
    buttonText: 'Manage Categories',
    gradientClasses: 'from-yellow-600 to-yellow-400',
    hoverBorderClass: 'hover:border-yellow-200',
    iconBgClass: 'bg-yellow-50',
    iconHoverBgClass: 'group-hover:bg-yellow-100',
    iconColorClass: 'text-yellow-600',
    buttonClasses: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100',
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>`,
    },
  },
  {
    id: 'statuses',
    title: 'Statuses',
    description: 'Manage various statuses',
    countLabel: 'Total Statuses',
    countRef: 'statuses',
    countSuffix: 'statuses',
    usedIn: ['Status Tracking', 'Workflow'],
    route: '/admin/admin/ecpf/status',
    buttonText: 'Manage Statuses',
    gradientClasses: 'from-cyan-600 to-cyan-400',
    hoverBorderClass: 'hover:border-cyan-200',
    iconBgClass: 'bg-cyan-50',
    iconHoverBgClass: 'group-hover:bg-cyan-100',
    iconColorClass: 'text-cyan-600',
    buttonClasses: 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100',
    icon: {
      template: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`,
    },
  },
]

onMounted(async () => {
  try {
    const [
      complianceActionsResponse,
      complianceActionsTakenResponse,
      institutesResponse,
      issueCompliancesResponse,
      promotionalEventTypesResponse,
      ecpfDecisionsResponse,
      qualificationsResponse,
      infrastructuresResponse,
      positionsResponse,
      serviceCategoriesResponse,
      statusesResponse,
    ] = await Promise.all([
      services.getMasterComplianceActions(),
      services.getMasterComplianceActionsTaken(),
      services.getMasterInstitutesCollegesUniversities(),
      services.getMasterIssueCompliances(),
      services.getMasterPromotionalEventTypes(),
      services.getMastersEcpfDecisions(),
      services.getMastersEcpfQualifications(),
      services.getMastersInfrastructures(),
      services.getMastersPositions(),
      services.getMastersServiceCategories(),
      services.getMastersStatuses(),
    ])

    counts.value = {
      complianceActions: complianceActionsResponse.data.count,
      complianceActionsTaken: complianceActionsTakenResponse.data.count,
      institutes: institutesResponse.data.count,
      issueCompliances: issueCompliancesResponse.data.count,
      promotionalEventTypes: promotionalEventTypesResponse.data.count,
      ecpfDecisions: ecpfDecisionsResponse.data.count,
      qualifications: qualificationsResponse.data.count,
      infrastructures: infrastructuresResponse.data.count,
      positions: positionsResponse.data.count,
      serviceCategories: serviceCategoriesResponse.data.count,
      statuses: statusesResponse.data.count,
    }
  } catch (error) {
    console.error('Error fetching counts:', error)
  }
})
</script>

<style scoped>
/* Keep your existing styles, and add any necessary adjustments here */
.ecpf-admin-dashboard {
  padding: 20px;
}

.dashboard-content {
  margin-top: 20px;
}

.dashboard-stats,
.dashboard-actions {
  margin-bottom: 30px;
  padding: 15px;
  border-radius: 8px;
  background-color: #f5f5f5;
}

h1 {
  color: #2c3e50;
}

h2 {
  color: #34495e;
  margin-bottom: 15px;
}
</style>
