<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4">
        <div class="max-w-[95rem] mx-auto">
            <!-- Header -->
            <div class="mb-8">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div class="mb-4 text-center lg:text-left">
                        <h1 class="text-4xl font-bold text-slate-900 mb-3 font-serif tracking-tight">
                            BMHC System Configuration
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
                        <div :class="[
                        baseCardClasses,
                        'relative flex flex-col h-full overflow-hidden',
                    ]">
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
                                    <router-link v-for="child in config.children" :key="child.route" :to="child.route"
                                        :class="[
                        config.button,
                        'inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-colors duration-300 font-medium group w-full justify-between',
                    ]">
                                        <span class="flex items-center gap-2">
                                            <!-- Child Icon (Optional, shown if present) -->
                                            <component v-if="child.icon" :is="child.icon"
                                                :class="config.iconColorClass" />
                                            {{ child.text }}
                                        </span>
                                        <ChevronRight
                                            class="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
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
import { ref, onMounted } from 'vue';
import bmhcService from '@/services/bmhcservices';
import {
    BookOpen, // CME
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

} from 'lucide-vue-next';

// --- State ---
const counts = ref({
    cmeActivities: 0,
    cmeCredits: 0,
    cmeMethodologies: 0,
    cpdActivities: 0,
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
});

// --- Utility Functions ---
const baseCardClasses =
    'bg-white rounded-lg shadow-sm border border-slate-200 transition-all duration-300';
const gradientClasses = (from, to) => `from-${from}-600 to-${to}-400`;
const iconBgClass = (color) => `bg-${color}-50`;
const iconColorClass = (color) => `text-${color}-600`;
const buttonClasses = (color) =>
    `bg-${color}-50 text-${color}-600 hover:bg-${color}-100`;

// --- Icon Mapping ---
const iconMap = {
    cmeManagement: BookOpen,
    cpdActivity: ClipboardList,
    documentManagement: FileText,
    feeManagement: DollarSign,
    participation: Users,
    personnel: User,
    registration: CheckCircle,
    university: Building,
    cogsManagement: Briefcase,
};

// --- Configuration Cards Data ---
const configurationCards = [
    {
        id: 'cmeManagement',
        title: 'CME Management',
        description: 'Manage Continuing Medical Education activities',
        countLabel: 'Active Activities',
        countRef: 'cmeActivities',
        countSuffix: 'items',
        usedIn: ['Professional Development', 'Certification'],
        children: [
            {
                text: 'CME Activities',
                route: '/admin/admin/health_certification/cme_activities',
                icon: null,
            },
            {
                text: 'CME Credits',
                route: '/admin/admin/health_certification/cme_credits',
                icon: null,
            },
            {
                text: 'CME Methodologies',
                route: '/admin/admin/health_certification/cme_methodologies',
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
        id: 'cpdActivity',
        title: 'CPD Activity',
        description: 'Manage Continuing Professional Development activities',
        countLabel: 'Active Activities',
        countRef: 'cpdActivities',
        countSuffix: 'activities',
        usedIn: ['Professional Development'],
        route: '/admin/admin/health_certification/cpd_activity',
        buttonText: 'Manage CPD Activities',
        gradient: gradientClasses('indigo', 'indigo'),
        iconBg: iconBgClass('indigo'),
        iconColor: iconColorClass('indigo'),
        button: buttonClasses('indigo'),
        icon: 'ClipboardList',
    },
    {
        id: 'documentManagement',
        title: 'Document Management',
        description: 'Manage document types and configurations',
        countLabel: 'Total Types',
        countRef: 'documentTypes',
        countSuffix: 'types',
        usedIn: ['Registration', 'Applications'],
        children: [
            {
                text: 'Document Types',
                route: '/admin/admin/health_certification/document_types',
                icon: null,
            },
            {
                text: 'E-Signatures',
                route: '/admin/admin/health_certification/e_signatures',
                icon: null,
            },
            {
                text: 'File Types',
                route: '/admin/admin/health_certification/file_types',
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
        description: 'Configure fee structures and settings',
        countLabel: 'Fee Structures',
        countRef: 'feeStructures',
        countSuffix: 'structures',
        usedIn: ['Registration', 'Payments'],
        route: '/admin/admin/health_certification/fee_structures',
        buttonText: 'Manage Fees',
        gradient: gradientClasses('amber', 'amber'),
        iconBg: iconBgClass('amber'),
        iconColor: iconColorClass('amber'),
        button: buttonClasses('amber'),
        icon: 'DollarSign',
    },
    {
        id: 'participation',
        title: 'Participation',
        description: 'Manage participation categories',
        countLabel: 'Categories',
        countRef: 'participationCategories',
        countSuffix: 'categories',
        usedIn: ['Registration', 'Activities'],
        children: [
            {
                text: 'Categories',
                route: '/admin/admin/health_certification/participation_category',
                icon: null,
            },
            {
                text: 'Sub Categories',
                route: '/admin/admin/health_certification/participation_sub_category',
                icon: null,
            },
        ],
        gradient: gradientClasses('purple', 'purple'),
        iconBg: iconBgClass('purple'),
        iconColor: iconColorClass('purple'),
        button: buttonClasses('purple'),
        icon: 'Users',
    },
    {
        id: 'personnel',
        title: 'Personnel',
        description: 'Manage personnel categories and qualifications',
        countLabel: 'Categories',
        countRef: 'personnelCategories',
        countSuffix: 'categories',
        usedIn: ['Registration', 'Certification'],
        children: [
            {
                text: 'Categories',
                route: '/admin/admin/health_certification/personnel_categories',
                icon: null,
            },
            {
                text: 'Qualifications',
                route: '/admin/admin/health_certification/qualifications',
                icon: null,
            },
            {
                text: 'Qualification Types',
                route: '/admin/admin/health_certification/qualification_types',
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
        description: 'Manage registration types and settings',
        countLabel: 'Types',
        countRef: 'registrationTypes',
        countSuffix: 'types',
        usedIn: ['Registration'],
        children: [
            {
                text: 'Types',
                route: '/admin/admin/health_certification/registration_type',
                icon: null,
            },
            {
                text: 'Sectors',
                route: '/admin/admin/health_certification/sector',
                icon: null,
            },
            {
                text: 'Sub Categories',
                route: '/admin/admin/health_certification/sub_categories',
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
        description: 'Manage university information',
        countLabel: 'Universities',
        countRef: 'universities',
        countSuffix: 'institutions',
        usedIn: ['Registration', 'Verification'],
        route: '/admin/admin/health_certification/university',
        buttonText: 'Manage Universities',
        gradient: gradientClasses('violet', 'violet'),
        iconBg: iconBgClass('violet'),
        iconColor: iconColorClass('violet'),
        button: buttonClasses('violet'),
        icon: 'Building',
    },
    {
        id: 'cogsManagement',
        title: 'COGS Management',
        description: 'Manage COGS agencies and workplaces',
        countLabel: 'Agencies',
        countRef: 'cogsAgencies',
        countSuffix: 'agencies',
        usedIn: ['COGS', 'Registration'],
        children: [
            {
                text: 'Agency',
                route: '/admin/admin/health_certification/cogs_agency',
                icon: null,
            },
            {
                text: 'Department',
                route: '/admin/admin/health_certification/cogs_dept',
                icon: null,
            },
            {
                text: 'Workplace',
                route: '/admin/admin/health_certification/cogs_workplace',
                icon: null,
            },
        ],
        gradient: gradientClasses('teal', 'teal'),
        iconBg: iconBgClass('teal'),
        iconColor: iconColorClass('teal'),
        button: buttonClasses('teal'),
        icon: 'Briefcase',
    },
];

// --- Data Fetching ---
onMounted(async () => {
    try {
        const countPromises = [
            bmhcService.getMastersCmeActivities(),
            bmhcService.getMastersCmeCredits(),
            bmhcService.getMastersCmeMethodologies(),
            bmhcService.getMastersCpdActivities(),
            bmhcService.getMastersDocumentTypes(),
            bmhcService.getMastersESignatures(),
            bmhcService.getMastersFileTypes(),
            bmhcService.getMastersFeeStructures(),
            bmhcService.getMastersParticipationCategories(),
            bmhcService.getMastersParticipationSubCategories(),
            bmhcService.getMastersPersonnelCategories(),
            bmhcService.getMastersQualificationTypes(),
            bmhcService.getMastersRegistrationTypes(),
            bmhcService.getMastersSectors(),
            bmhcService.getMastersSubCategories(),
            bmhcService.getMastersUniversities(),
            bmhcService.getBmhcCogsAgencies(),
            bmhcService.getBmhcCogsDepartments(),
            bmhcService.getBmhcCogsWorkplaces(),
        ];

        const results = await Promise.all(countPromises);

        // Update counts state
        counts.value.cmeActivities = results[0].data?.length || 0;
        counts.value.cmeCredits = results[1].data?.length || 0;
        counts.value.cmeMethodologies = results[2].data?.length || 0;
        counts.value.cpdActivities = results[3].data?.length || 0;
        counts.value.documentTypes = results[4].data?.length || 0;
        counts.value.eSignatures = results[5].data?.length || 0;
        counts.value.fileTypes = results[6].data?.length || 0;
        counts.value.feeStructures = results[7].data?.length || 0;
        counts.value.participationCategories = results[8].data?.length || 0;
        counts.value.participationSubCategories = results[9].data?.length || 0;
        counts.value.personnelCategories = results[10].data?.length || 0;
        counts.value.qualificationTypes = results[11].data?.length || 0;
        counts.value.registrationTypes = results[12].data?.length || 0;
        counts.value.sectors = results[13].data?.length || 0;
        counts.value.subCategories = results[14].data?.length || 0;
        counts.value.universities = results[15].data?.length || 0;
        counts.value.cogsAgencies = results[16].data?.length || 0;
        counts.value.cogsDepts = results[17].data?.length || 0;
        counts.value.cogsWorkplaces = results[18].data?.length || 0;
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Consider adding user-friendly error handling (e.g., a notification)
    }
});
</script>
