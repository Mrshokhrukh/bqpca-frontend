<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4">
    <div class="max-w-[95rem] mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div class="mb-4 text-center lg:text-left">
            <h1 class="text-4xl font-bold text-slate-900 mb-3 font-serif tracking-tight">
              Engineering System Configuration
            </h1>
            <div class="flex items-center gap-2 justify-center lg:justify-start text-slate-600">
              <Info class="h-5 w-5" />
              <p>Manage system configurations, activities, and master data.</p>
            </div>
          </div>
        </div>

        <!-- Card Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div v-for="config in configurationCards" :key="config.id" class="group relative">
            <!-- Gradient Overlay (Hover Effect) -->
            <div
              :class="`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-xl opacity-0 group-hover:opacity-20 transition duration-300`">
            </div>

            <!-- Card Content -->
            <div :class="[baseCardClasses, 'relative flex flex-col h-full overflow-hidden']">
              <div class="p-6 flex-grow">
                <!-- Card Header -->
                <div class="flex items-start justify-between mb-6">
                  <div>
                    <div class="flex items-center gap-3 mb-3">
                      <div :class="[
                        iconBgClass(config.icon.split(/(?=[A-Z])/)[0].toLowerCase()),
                        'p-2 rounded-lg transition-colors duration-300 group-hover:bg-opacity-20',
                      ]">
                        <component :is="iconMap[config.id]"
                          :class="iconColorClass(config.icon.split(/(?=[A-Z])/)[0].toLowerCase())" />
                      </div>
                      <h3 class="font-semibold text-slate-900 text-lg">{{ config.title }}</h3>
                    </div>
                    <p class="text-sm text-slate-600">{{ config.description }}</p>
                  </div>
                </div>

                <!-- Card Stats -->
                <div class="space-y-4 mb-6">
                  <div class="flex items-center gap-2 bg-slate-50 rounded-lg p-3">
                    <div class="text-sm">
                      <span class="text-slate-600">{{ config.countLabel }}:</span>
                      <span class="font-semibold text-slate-900 ml-1">
                        {{ counts[config.countRef] }} {{ config.countSuffix }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-slate-500">
                    <TrendingUp class="h-4 w-4" />
                    <span>Used in:</span>
                    <span v-for="(use, index) in config.usedIn" :key="index">
                      {{ use }}
                      <template v-if="index < config.usedIn.length - 1">, </template>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Card Footer (Sub-buttons) -->
              <div class="p-4 border-t border-slate-200">
                <div class="space-y-2">
                  <router-link v-for="child in config.children" :key="child.route" :to="child.route" :class="[
                    config.button,
                    'inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-colors duration-300 font-medium group w-full justify-between',
                  ]">
                    <span class="flex items-center gap-2">
                      <!-- Child Icon (Optional, shown if present) -->
                      <component v-if="child.icon" :is="child.icon" :class="config.iconColorClass" />
                      {{ child.text }}
                    </span>
                    <ChevronRight class="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
                  </router-link>
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
import { ref, onMounted } from 'vue'
import apiServices from '@/services/services'
import {
  BookOpen, // CPD
  ClipboardList, // CPD
  FileText, // Document
  DollarSign, // Fee
  Users, // Participation
  User, // Personnel
  CheckCircle, // Registration
  Building, // University
  Briefcase, // Cogs
  Info,
  TrendingUp,
  ChevronRight,
} from 'lucide-vue-next'

// --- State ---
const counts = ref({
  cpdActivities: 0,

  cpdCredits: 0,
  cpdMethodologies: 0,
  documentTypes: 0,
  eSignatures: 0,
  fileTypes: 0,
  feeStructures: 0,
  participationCategories: 0,
  participationSubCategories: 0,
  personnelCategories: 0,
  qualificationTypes: 0,
  registrationTypes: 0,
  sectors: 0,
  subCategories: 0,
  universities: 0,
  cogsAgencies: 0,
  cogsDepts: 0,
  cogsWorkplaces: 0,
})

// --- Utility Functions ---
const baseCardClasses =
  'bg-white rounded-lg shadow-sm border border-slate-200 transition-all duration-300'
const gradientClasses = (from, to) => `from-${from}-600 to-${to}-400`
const iconBgClass = (color) => `bg-${color}-50`
const iconColorClass = (color) => `text-${color}-600`
const buttonClasses = (color) => `bg-${color}-50 text-${color}-600 hover:bg-${color}-100`

// --- Icon Mapping ---
const iconMap = {
  cpdManagement: BookOpen,
  cpdActivity: ClipboardList,
  documentManagement: FileText,
  feeManagement: DollarSign,
  participation: Users,
  personnel: User,
  registration: CheckCircle,
  university: Building,
  cogsManagement: Briefcase,
}

// Base path for admin engineering routes
const basePath = '/admin/admin/engineering_certification'

// --- Configuration Cards Data ---
const configurationCards = [
  {
    id: 'cpdManagement',
    title: 'CPD Management',
    description: 'Manage Continuing Professional Development activities',
    countLabel: 'Active Activities',
    countRef: 'cpdActivities',
    countSuffix: 'items',
    usedIn: ['Professional Development', 'Certification'],
    children: [
      {
        text: 'CPD Activity',
        route: `${basePath}/cpd_activity`,
        icon: null,
      },
      {
        text: 'CPD Activities',
        route: `${basePath}/cpd_activities`,
        icon: null,
      },

      {
        text: 'CPD Credits',
        route: `${basePath}/cpd_credits`,
        icon: null,
      },
      {
        text: 'CPD Methodologies',
        route: `${basePath}/cpd_methodologies`,
        icon: null,
      },

    ],
    gradient: gradientClasses('blue', 'blue'),
    iconBg: iconBgClass('blue'),
    iconColor: iconColorClass('blue'),
    button: buttonClasses('blue'),
    icon: 'BookOpen',
  },

  {
    id: 'documentManagement',
    title: 'Document Management',
    description: 'Manage engineering document types and configurations',
    countLabel: 'Total Types',
    countRef: 'documentTypes',
    countSuffix: 'types',
    usedIn: ['Registration', 'Applications'],
    children: [
      {
        text: 'Document Types',
        route: `${basePath}/document_types`,
        icon: null,
      },
      {
        text: 'E-Signatures',
        route: `${basePath}/e_signatures`,
        icon: null,
      },
    ],
    gradient: gradientClasses('emerald', 'emerald'),
    iconBg: iconBgClass('emerald'),
    iconColor: iconColorClass('emerald'),
    button: buttonClasses('emerald'),
    icon: 'FileText',
  },
  {
    id: 'feeManagement',
    title: 'Fee Management',
    description: 'Configure engineering fee structures and settings',
    countLabel: 'Fee Structures',
    countRef: 'feeStructures',
    countSuffix: 'structures',
    usedIn: ['Registration', 'Payments'],
    children: [
      {
        text: 'Fee Structures',
        route: `${basePath}/fee_structures`,
        icon: null,
      },
      {
        text: 'Fees Associated For',
        route: `${basePath}/fees_associated_for`,
        icon: null,
      },
    ],
    gradient: gradientClasses('amber', 'amber'),
    iconBg: iconBgClass('amber'),
    iconColor: iconColorClass('amber'),
    button: buttonClasses('amber'),
    icon: 'DollarSign',
  },
  // {
  //   id: 'participation',
  //   title: 'Participation',
  //   description: 'Manage engineering participation categories',
  //   countLabel: 'Categories',
  //   countRef: 'participationCategories',
  //   countSuffix: 'categories',
  //   usedIn: ['Registration', 'Activities'],
  //   children: [
  //     {
  //       text: 'Categories',
  //       route: `${basePath}/participation_category`,
  //       icon: null,
  //     },
  //     {
  //       text: 'Sub Categories',
  //       route: `${basePath}/participation_sub_category`,
  //       icon: null,
  //     },
  //   ],
  //   gradient: gradientClasses('purple', 'purple'),
  //   iconBg: iconBgClass('purple'),
  //   iconColor: iconColorClass('purple'),
  //   button: buttonClasses('purple'),
  //   icon: 'Users',
  // },
  {
    id: 'personnel',
    title: 'Personnel',
    description: 'Manage engineering personnel categories and qualifications',
    countLabel: 'Categories',
    countRef: 'personnelCategories',
    countSuffix: 'categories',
    usedIn: ['Registration', 'Certification'],
    children: [
      {
        text: 'Categories',
        route: `${basePath}/personnel_categories`,
        icon: null,
      },
      {
        text: 'Sub Categories',
        route: `${basePath}/sub_categories`,
        icon: null,
      },
      {
        text: 'Qualifications',
        route: `${basePath}/qualifications`,
        icon: null,
      },
      {
        text: 'Qualification Types',
        route: `${basePath}/qualification_types`,
        icon: null,
      },
    ],
    gradient: gradientClasses('rose', 'rose'),
    iconBg: iconBgClass('rose'),
    iconColor: iconColorClass('rose'),
    button: buttonClasses('rose'),
    icon: 'User',
  },
  {
    id: 'registration',
    title: 'Registration',
    description: 'Manage engineering registration types and settings',
    countLabel: 'Types',
    countRef: 'registrationTypes',
    countSuffix: 'types',
    usedIn: ['Registration'],
    children: [
      {
        text: 'Types',
        route: `${basePath}/registration_type`,
        icon: null,
      },
      {
        text: 'Sectors',
        route: `${basePath}/sector`,
        icon: null,
      },
    ],
    gradient: gradientClasses('cyan', 'cyan'),
    iconBg: iconBgClass('cyan'),
    iconColor: iconColorClass('cyan'),
    button: buttonClasses('cyan'),
    icon: 'CheckCircle',
  },
  {
    id: 'university',
    title: 'University',
    description: 'Manage engineering universities and institutions',
    countLabel: 'Universities',
    countRef: 'universities',
    countSuffix: 'institutions',
    usedIn: ['Registration', 'Verification'],
    children: [
      {
        text: 'Manage Universities',
        route: `${basePath}/university`,
        icon: null,
      },
    ],
    gradient: gradientClasses('violet', 'violet'),
    iconBg: iconBgClass('violet'),
    iconColor: iconColorClass('violet'),
    button: buttonClasses('violet'),
    icon: 'Building',
  },
  {
    id: 'cogsManagement',
    title: 'COGS Management',
    description: 'Manage engineering COGS agencies and workplaces',
    countLabel: 'Agencies',
    countRef: 'cogsAgencies',
    countSuffix: 'agencies',
    usedIn: ['COGS', 'Registration'],
    children: [
      {
        text: 'Agency',
        route: `${basePath}/cogs_agency`,
        icon: null,
      },
      {
        text: 'Department',
        route: `${basePath}/cogs_dept`,
        icon: null,
      },
      {
        text: 'Workplace',
        route: `${basePath}/cogs_workplace`,
        icon: null,
      },
    ],
    gradient: gradientClasses('teal', 'teal'),
    iconBg: iconBgClass('teal'),
    iconColor: iconColorClass('teal'),
    button: buttonClasses('teal'),
    icon: 'Briefcase',
  },
]

// --- Data Fetching ---
onMounted(async () => {
  try {
    const countPromises = [
      apiServices.getEpcMastersCpdActivities(),
      apiServices.getEpcMastersCpdCredits(),
      apiServices.getEpcMastersCpdMethodologies(),
      apiServices.getEpcMastersCpdActivity(),
      apiServices.getEpcMastersDocumentTypes(),
      apiServices.getEpcMastersESignatures(),
      apiServices.getEpcMastersFileTypes(),
      apiServices.getEpcMastersFeeStructures(),
      apiServices.getEpcMastersParticipationCategories(),
      apiServices.getEpcMastersParticipationSubCategories(),
      apiServices.getEpcMastersPersonnelCategories(),
      apiServices.getEpcMastersQualificationTypes(),
      apiServices.getEpcMastersRegistrationTypes(),
      apiServices.getEpcMastersSectors(),
      apiServices.getEpcMastersSubCategories(),
      apiServices.getEpcMastersUniversities(),
      apiServices.getEpcMastersCogsAgencies(),
      apiServices.getEpcMastersCogsDepartments(),
      apiServices.getEpcMastersCogsWorkplaces(),
    ]

    const results = await Promise.all(countPromises)

    // Update counts state
    counts.value.cpdActivities = results[0].data?.length || 0
    counts.value.cpdCredits = results[1].data?.length || 0
    counts.value.cpdMethodologies = results[2].data?.length || 0
    counts.value.cpdActivities = results[3].data?.length || 0
    counts.value.documentTypes = results[4].data?.length || 0
    counts.value.eSignatures = results[5].data?.length || 0
    counts.value.fileTypes = results[6].data?.length || 0
    counts.value.feeStructures = results[7].data?.length || 0
    counts.value.participationCategories = results[8].data?.length || 0
    counts.value.participationSubCategories = results[9].data?.length || 0
    counts.value.personnelCategories = results[10].data?.length || 0
    counts.value.qualificationTypes = results[11].data?.length || 0
    counts.value.registrationTypes = results[12].data?.length || 0
    counts.value.sectors = results[13].data?.length || 0
    counts.value.subCategories = results[14].data?.length || 0
    counts.value.universities = results[15].data?.length || 0
    counts.value.cogsAgencies = results[16].data?.length || 0
    counts.value.cogsDepts = results[17].data?.length || 0
    counts.value.cogsWorkplaces = results[18].data?.length || 0
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    // Consider adding user-friendly error handling (e.g., a notification)
  }
})
</script>
