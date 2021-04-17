<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4 lg:p-8">
    <div class="max-w-[95rem] mx-auto">
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div class="mb-4 text-center lg:text-left">
            <h1 class="text-4xl font-bold text-slate-900 mb-3 font-serif tracking-tight">
              MHPC System Configuration
            </h1>
            <div class="flex items-center gap-2 justify-center lg:justify-start text-slate-600">
              <Info class="h-5 w-5" />
              <p>Manage system configurations, activities, and master data.</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div v-for="config in configurationCards" :key="config.id" class="group relative">
            <div
              :class="`absolute inset-0 bg-gradient-to-r ${config.gradient} rounded-xl opacity-0 group-hover:opacity-20 transition duration-300`"
            ></div>

            <div :class="[baseCardClasses, 'relative flex flex-col h-full overflow-hidden']">
              <div class="p-6 flex-grow">
                <div class="flex items-start justify-between mb-6">
                  <div>
                    <div class="flex items-center gap-3 mb-3">
                      <div
                        :class="[
                          iconBgClass(config.iconName),
                          'p-2 rounded-lg transition-colors duration-300 group-hover:bg-opacity-20',
                        ]"
                      >
                        <component
                          :is="iconMap[config.id]"
                          :class="iconColorClass(config.iconName)"
                           class="w-6 h-6"
                        />
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
                       <span class="font-semibold text-slate-900 ml-1">
                         {{ counts[config.countRef] ?? 0 }} {{ config.countSuffix }}
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

              <div class="p-4 border-t border-slate-200 bg-slate-50/50">
                <div class="space-y-2">
                  <router-link
                    v-for="child in config.children"
                    :key="child.route"
                    :to="child.route"
                    :class="[
                      buttonClasses(config.iconName),
                      'inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-colors duration-300 font-medium group w-full justify-between',
                    ]"
                  >
                    <span class="flex items-center gap-2">
                      <component
                        v-if="child.icon"
                        :is="iconMap[child.iconId]"
                        :class="iconColorClass(config.iconName)"
                        class="h-4 w-4"
                      />
                      {{ child.text }}
                    </span>
                    <ChevronRight
                      class="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform"
                    />
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
import { reactive, onMounted } from 'vue'
import apiServices from '@/services/services'
import {
  BookOpen,
  ClipboardList,
  FileText,
  DollarSign,
  Users,
  CheckCircle,
  Building,
  Briefcase,
  Info,
  TrendingUp,
  ChevronRight,
  FileSignature, // For E-Signatures
  GraduationCap, // For Qualifications
  Tag, // For Categories/Types
  University as UniversityIcon, // Renamed to avoid conflict
  Landmark, // For CPD Credits/Methodologies, Fees
  FolderKanban, // Participation Categories
  UserCog, // Personnel Categories
  Building2, // COGS
} from 'lucide-vue-next'

const counts = reactive({
  cpdActivities: 0,
  cpdCredits: 0,
  cpdMethodologies: 0,
  documentTypes: 0,
  eSignatures: 0,
  // fileTypes: 0, // Removed
  feeStructures: 0,
  participationCategories: 0,
  participationSubCategories: 0,
  personnelCategories: 0,
  qualifications: 0, // Combined count for Qualifications
  qualificationTypes: 0,
  registrationTypes: 0,
  sectors: 0,
  subCategories: 0, // Registration Sub Categories
  universities: 0,
  cogsAgencies: 0,
  cogsDepts: 0,
  cogsWorkplaces: 0,
})

const baseCardClasses =
  'bg-white rounded-xl shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-md'
const gradientClasses = (from, to) => `from-${from}-100 to-${to}-100` // Adjusted gradient for subtlety
const iconBgClass = (color) => `bg-${color}-100`
const iconColorClass = (color) => `text-${color}-600`
const buttonClasses = (color) => `bg-${color}-50 text-${color}-700 hover:bg-${color}-100 hover:text-${color}-800`

const iconMap = {
  cpdManagement: BookOpen,
  cpdActivities: ClipboardList,
  cpdCredits: Landmark,
  cpdMethodologies: Landmark,
  documentManagement: FileText,
  documentTypes: Tag,
  eSignatures: FileSignature,
  // fileTypes: File, // Removed
  feeManagement: DollarSign,
  feeStructures: Landmark,
  participation: Users,
  participationCategories: FolderKanban,
  participationSubCategories: Users,
  personnel: UserCog,
  personnelCategories: Tag,
  qualifications: GraduationCap,
  qualificationTypes: GraduationCap,
  registration: CheckCircle,
  registrationTypes: Tag,
  sectors: Tag,
  subCategories: Tag,
  university: Building,
  universities: UniversityIcon,
  cogsManagement: Briefcase,
  cogsAgency: Building2,
  cogsDept: Building2,
  cogsWorkplace: Building2,
}

const configurationCards = reactive([
  {
    id: 'cpdManagement',
    title: 'CPD Management',
    description: 'Manage CME activities, credits, and methodologies',
    countLabel: 'Total CPD Items',
    countRef: 'cpdActivities', // Displaying main activity count here, could sum others if needed
    countSuffix: 'items',
    usedIn: ['Prof. Development', 'Certification'],
    children: [
      { text: 'CPD Activities', route: '/admin/admin/health_certification/cpd_activities', iconId: 'cpdActivities' },
      { text: 'CPD Credits', route: '/admin/admin/health_certification/cpd_credits', iconId: 'cpdCredits' },
      { text: 'CPD Methodologies', route: '/admin/admin/health_certification/cpd_methodologies', iconId: 'cpdMethodologies' },
    ],
    iconName: 'blue', // Simplified color name
    gradient: gradientClasses('blue', 'sky'),
  },
   {
    id: 'feeManagement',
    title: 'Fee Management',
    description: 'Configure fee structures and settings',
    countLabel: 'Fee Structures',
    countRef: 'feeStructures',
    countSuffix: 'structures',
    usedIn: ['Registration', 'Payments'],
     children: [
      { text: 'Fee Structures', route: '/admin/admin/health_certification/fee_structures', iconId: 'feeStructures' },
       { text: 'Fee Categories', route: '/admin/admin/health_certification/fee_category', iconId: 'feeStructures' }, // Assuming same icon
    ],
    iconName: 'amber',
    gradient: gradientClasses('amber', 'orange'),
  },
   {
    id: 'participation',
    title: 'Participation Config',
    description: 'Manage participation categories',
    countLabel: 'Total Categories',
    countRef: 'participationCategories', // Displaying main category count
    countSuffix: 'categories',
    usedIn: ['Registration', 'Activities'],
    children: [
      { text: 'Categories', route: '/admin/admin/health_certification/participation_category', iconId: 'participationCategories' },
      { text: 'Sub Categories', route: '/admin/admin/health_certification/participation_sub_category', iconId: 'participationSubCategories' },
    ],
    iconName: 'purple',
    gradient: gradientClasses('purple', 'violet'),
  },
  {
    id: 'personnel',
    title: 'Personnel Config',
    description: 'Manage personnel, qualifications & types',
    countLabel: 'Personnel Categories',
    countRef: 'personnelCategories',
    countSuffix: 'categories',
    usedIn: ['Registration', 'Certification'],
    children: [
      { text: 'Personnel Categories', route: '/admin/admin/health_certification/personnel_categories', iconId: 'personnelCategories' },
      { text: 'Qualifications', route: '/admin/admin/health_certification/qualifications', iconId: 'qualifications' },
      { text: 'Qualification Types', route: '/admin/admin/health_certification/qualification_types', iconId: 'qualificationTypes' },
    ],
    iconName: 'rose',
    gradient: gradientClasses('rose', 'pink'),
  },
   {
    id: 'registration',
    title: 'Registration Config',
    description: 'Manage registration types and settings',
    countLabel: 'Registration Types',
    countRef: 'registrationTypes',
    countSuffix: 'types',
    usedIn: ['Registration'],
    children: [
      { text: 'Registration Types', route: '/admin/admin/health_certification/registration_type', iconId: 'registrationTypes' },
      { text: 'Sectors', route: '/admin/admin/health_certification/sector', iconId: 'sectors' },
      { text: 'Sub Categories', route: '/admin/admin/health_certification/sub_categories', iconId: 'subCategories' },
    ],
    iconName: 'cyan',
    gradient: gradientClasses('cyan', 'sky'),
  },
    {
    id: 'university',
    title: 'University Data',
    description: 'Manage university information',
    countLabel: 'Universities Listed',
    countRef: 'universities',
    countSuffix: 'institutions',
    usedIn: ['Registration', 'Verification'],
     children: [
      { text: 'Manage Universities', route: '/admin/admin/health_certification/university', iconId: 'universities' },
    ],
    iconName: 'indigo', // Changed color
    gradient: gradientClasses('indigo', 'violet'),
  },
   {
    id: 'documentManagement',
    title: 'Document Config',
    description: 'Manage document types and e-signatures',
    countLabel: 'Document Types',
    countRef: 'documentTypes',
    countSuffix: 'types',
    usedIn: ['Registration', 'Applications'],
    children: [
      { text: 'Document Types', route: '/admin/admin/health_certification/document_types', iconId: 'documentTypes' },
      { text: 'E-Signatures', route: '/admin/admin/health_certification/e_signatures', iconId: 'eSignatures' },
      // Removed File Types link
    ],
    iconName: 'emerald',
    gradient: gradientClasses('emerald', 'green'),
  },
  {
    id: 'cogsManagement',
    title: 'COGS Management',
    description: 'Manage COGS agencies and workplaces',
    countLabel: 'Total Agencies',
    countRef: 'cogsAgencies',
    countSuffix: 'agencies',
    usedIn: ['COGS', 'Registration'],
    children: [
      { text: 'COGS Agency', route: '/admin/admin/health_certification/cogs_agency', iconId: 'cogsAgency' },
      { text: 'COGS Department', route: '/admin/admin/health_certification/cogs_dept', iconId: 'cogsDept' },
      { text: 'COGS Workplace', route: '/admin/admin/health_certification/cogs_workplace', iconId: 'cogsWorkplace' },
    ],
    iconName: 'teal',
    gradient: gradientClasses('teal', 'cyan'),
  },
])

onMounted(async () => {
  try {
    const countPromises = [
      apiServices.getMhpcMastersCpdActivities(), // 0
      apiServices.getMhpcMastersCpdCredits(), // 1
      apiServices.getMhpcMastersCpdMethodologies(), // 2
      apiServices.getMhpcMastersDocumentTypes(), // 3
      apiServices.getMhpcMastersESignatures(), // 4
      // apiServices.getMhpcMastersFileTypes(), // Removed - Was 5
      apiServices.getMhpcMastersFeeStructures(), // 5 (was 6)
      apiServices.getMhpcMastersMHPCParticipationCategories(), // 6 (was 7)
      apiServices.getMhpcMastersMhpcParticipationSubCategories(), // 7 (was 8)
      apiServices.getMhpcMastersPersonnelCategories(), // 8 (was 9)
      apiServices.getMhpcMastersQualifications(), // 9 (was 10) - Count for Qualifications
      apiServices.getMhpcMastersQualificationTypes(), // 10 (was 11)
      apiServices.getMhpcMastersRegistrationTypes(), // 11 (was 12)
      apiServices.getMhpcMastersSectors(), // 12 (was 13)
      apiServices.getMhpcMastersSubCategories(), // 13 (was 14) - Registration SubCats
      apiServices.getMhpcMastersUniversities(), // 14 (was 15)
      apiServices.getMhpcCogsAgencies(), // 15 (was 16)
      apiServices.getMhpcCogsDepartments(), // 16 (was 17)
      apiServices.getMhpcCogsWorkplaces(), // 17 (was 18)
    ]

    const results = await Promise.allSettled(countPromises.map(p => p.catch(e => e))) // Use allSettled for resilience

    const processResult = (result) => {
        if (result.status === 'fulfilled' && result.value?.data) {
            return result.value.data.count ?? (Array.isArray(result.value.data.results) ? result.value.data.results.length : 0);
        }
        console.error("API Error or Unexpected Format:", result.reason || result.value);
        return 0; // Default to 0 on error or unexpected format
    };

    counts.cpdActivities = processResult(results[0]);
    counts.cpdCredits = processResult(results[1]);
    counts.cpdMethodologies = processResult(results[2]);
    counts.documentTypes = processResult(results[3]);
    counts.eSignatures = processResult(results[4]);
    // counts.fileTypes = processResult(results[?]); // Removed
    counts.feeStructures = processResult(results[5]);
    counts.participationCategories = processResult(results[6]);
    counts.participationSubCategories = processResult(results[7]);
    counts.personnelCategories = processResult(results[8]);
    counts.qualifications = processResult(results[9]); // Count for Qualifications card
    counts.qualificationTypes = processResult(results[10]);
    counts.registrationTypes = processResult(results[11]);
    counts.sectors = processResult(results[12]);
    counts.subCategories = processResult(results[13]); // Registration SubCategories count
    counts.universities = processResult(results[14]);
    counts.cogsAgencies = processResult(results[15]);
    counts.cogsDepts = processResult(results[16]);
    counts.cogsWorkplaces = processResult(results[17]);

  } catch (error) {
    // This catch block might be less likely to trigger with allSettled,
    // unless there's an error *before* the promises run.
    console.error('Error setting up dashboard data fetch:', error)
  }
})
</script>

<style scoped>
/* Minimal custom styles, relying on Tailwind */
</style>
