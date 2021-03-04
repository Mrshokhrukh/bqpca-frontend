// src/constants/navMenu.js
import {
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  ClipboardCheck,
  BookOpen,
  Building2,
  File,
  Folder,
  Briefcase,
  UserCircle,
  Clock,
  CheckCircle,
  XCircle,
  FileSearch,
  CreditCard,
  Heart,
  Wrench,
  Award,
  FilePlus, // Added for 'FilePlus'
  List, // Added for 'List'
  RefreshCw, // Added for 'RefreshCw'
  Edit, // Added for 'Edit'
  Link, //Added for Linkage
  Users2, //Added for Group
  Monitor, //Added for screen
} from 'lucide-vue-next'

// Icon mapping for dynamic icon selection
const iconMap = {
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  ClipboardCheck,
  BookOpen,
  Building2,
  File,
  Folder,
  Briefcase,
  UserCircle,
  Clock,
  CheckCircle,
  XCircle,
  FileSearch,
  CreditCard,
  Heart,
  Wrench,
  Award,
  FilePlus, // Include in the map
  List, // Include in the map
  RefreshCw, // Include in the map
  Edit,
  Link, //Added for Linkage
  Users2, //Added for Group
  Monitor, // Include in the map
}
import { useHealthCertificationStore } from '@/stores/mhpcNavigationStore'
import { useAuthStore } from '@/stores/authStore'
// Helper function to get the icon component
const getIconComponent = (iconName) => {
  return iconMap[iconName] || File
}

// Define the dealing_officer menu items (shared across all services)
const dealingOfficerMenuItems = [
  {
    name: 'Dashboard',
    icon: getIconComponent('LayoutDashboard'),
    route: (serviceType) => `/admin/dealing_officer/${serviceType}/dashboard`,
  },
  {
    name: 'Application Lists',
    icon: getIconComponent('CheckCircle'),
    route: (serviceType) => `/admin/dealing_officer/${serviceType}/application_lists`,
  },
  {
    name: 'Second Copy Application Lists',
    icon: getIconComponent('CheckCircle'),
    route: (serviceType) => `/admin/dealing_officer/${serviceType}/second_copy_lists`,
  },
  {
    name: 'Reports',
    icon: getIconComponent('ClipboardCheck'),
    route: (serviceType) => `/admin/dealing_officer/${serviceType}/reports`,
  },
]

// Service-specific menu items structured as service > role > routes
const serviceSpecificMenuItems = {
  roq: {
    user: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/user/${serviceType}/dashboard`,
      },
      {
        name: 'Recognition of Qualification',
        icon: getIconComponent('FileText'),
        route: (serviceType) => `/admin/user/${serviceType}/my_applications`,
      },
      {
        name: 'Second Copy Applications',
        icon: getIconComponent('File'),
        route: (serviceType) => `/admin/user/${serviceType}/secondcopy_applications`,
      },
      {
        name: 'Profile',
        icon: getIconComponent('Users'),
        route: (serviceType) => `/admin/user/${serviceType}/profile`,
      },
    ],
    admin: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/admin/${serviceType}/dashboard`,
      },
      {
        name: 'Decisions',
        icon: getIconComponent('Wrench'),
        route: (serviceType) => `/admin/admin/${serviceType}/decisions`,
      },
      {
        name: 'Learning Types',
        icon: getIconComponent('BookOpen'),
        route: (serviceType) => `/admin/admin/${serviceType}/learning_types`,
      },
      {
        name: 'Qualifications',
        icon: getIconComponent('Award'),
        route: (serviceType) => `/admin/admin/${serviceType}/qualifications`,
      },
      {
        name: 'Second Copy Reasons',
        icon: getIconComponent('CheckCircle'),
        route: (serviceType) => `/admin/admin/${serviceType}/reason_for_issue_of_second_copy`,
      },
      {
        name: 'Types of Courses',
        icon: getIconComponent('FileText'),
        route: (serviceType) => `/admin/admin/${serviceType}/type_of_courses`,
      },
      {
        name: 'Gender Types',
        icon: getIconComponent('Users'),
        route: (serviceType) => `/admin/admin/${serviceType}/genders`,
      },
      {
        name: 'Esignatures',
        icon: getIconComponent('Users'),
        route: (serviceType) => `/admin/admin/${serviceType}/esign`,
      },
      {
        name: 'Countries',
        icon: getIconComponent('Globe'),
        route: (serviceType) => `/admin/admin/${serviceType}/countries`,
      },
      {
        name: 'User Profile',
        icon: getIconComponent('Users'),
        route: (serviceType) => `/admin/admin/${serviceType}/user_profile`,
      },
    ],
    // Add dealing_officer to roq
    dealing_officer: dealingOfficerMenuItems,
    chief: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/chief/${serviceType}/dashboard`,
      },
      {
        name: 'Application Lists',
        icon: getIconComponent('CheckCircle'),
        route: (serviceType) => `/admin/chief/${serviceType}/application_lists`,
      },
      {
        name: 'Second Copy Application Lists',
        icon: getIconComponent('CheckCircle'),
        route: (serviceType) => `/admin/chief/${serviceType}/second_copy_lists`,
      },
      {
        name: 'Reports',
        icon: getIconComponent('ClipboardCheck'),
        route: (serviceType) => `/admin/chief/${serviceType}/reports`,
      },
    ],
  },
  ecpf: {
    user: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'), // More specific dashboard icon
        route: (serviceType) => `/admin/user/${serviceType}/dashboard`,
      },
      {
        name: 'New Applications',
        icon: getIconComponent('FilePlus'), // Icon for adding new things
        children: [
          {
            name: 'Individual ECPF',
            route: (serviceType) => `/admin/user/${serviceType}/individual_ecpf`,
          },
          {
            name: 'Collaborated ECPF',
            route: (serviceType) => `/admin/user/${serviceType}/collaborated_ecpf`,
          },
          {
            name: 'New Branch',
            route: (serviceType) => `/admin/user/${serviceType}/new_branch_ecpf`,
          },
        ],
      },
      {
        name: 'ECPF Renewal',
        icon: getIconComponent('List'), //List icon
        route: (serviceType) => `/admin/user/${serviceType}/ecpf_renewal`,
      },
      {
        name: 'ECPF Name Change',
        icon: getIconComponent('RefreshCw'), // Icon for refresh/change
        route: (serviceType) => `/admin/user/${serviceType}/ecpf_name_change`,
      },
      {
        name: 'Location Change',
        icon: getIconComponent('Edit'), // Icon for editing/location
        route: (serviceType) => `/admin/user/${serviceType}/ecpf_location_change`,
      },
      {
        name: 'Change in Ownership',
        icon: getIconComponent('Users2'), // Icon representing multiple users
        route: (serviceType) => `/admin/user/${serviceType}/ecpf_ownership_change`,
      },
      {
        name: 'Linkage Establishment',
        icon: getIconComponent('Link'), // Use a suitable 'link' icon
        route: (serviceType) => `/admin/user/${serviceType}/ecpf_linkage_establishment`,
      },
      {
        name: 'Education Fair',
        icon: getIconComponent('Briefcase'), // Briefcase is good for fairs/events
        route: (serviceType) => `/admin/user/${serviceType}/ecpf_education_fair`,
      },
      {
        name: 'Promotional Event',
        icon: getIconComponent('Activity'), //Use activity
        children: [
          {
            name: 'In-house Event',
            route: (serviceType) => `/admin/user/${serviceType}/in_house_event`,
          },
          {
            name: 'Mass Media Event',
            route: (serviceType) => `/admin/user/${serviceType}/mass_media_event`,
          },
          {
            name: 'HEI Visit',
            route: (serviceType) => `/admin/user/${serviceType}/hei_visit`,
          },
        ],
      },

      {
        name: 'HR Management',
        icon: getIconComponent('Users'), // 'Users' for HR
        route: (serviceType) => `/admin/user/${serviceType}/profile`, // Consider a more specific route like /hr
      },
      {
        name: 'Student Management',
        icon: getIconComponent('Users'), // 'Users' for Student Management
        route: (serviceType) => `/admin/user/${serviceType}/profile`, // Consider a more specific route like /students
      },
      {
        name: 'Profile',
        icon: getIconComponent('UserCircle'), // 'UserCircle' for profile
        route: (serviceType) => `/admin/user/${serviceType}/profile`,
      },
    ],
    admin: [
      {
        name: 'Payment Types',
        icon: getIconComponent('CreditCard'),
        route: (serviceType) => `/admin/admin/${serviceType}/payment_types`,
      },
    ],
    dealing_officer: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/admin/${serviceType}/dashboard`,
      },
      {
        name: 'Applications',
        icon: getIconComponent('Folder'),
        route: (serviceType) => `/admin/admin/${serviceType}/applications`,
      },
      {
        name: 'Verification',
        icon: getIconComponent('CheckCircle'),
        route: (serviceType) => `/admin/admin/${serviceType}/verification`,
      },
      {
        name: 'Shortlisting',
        icon: getIconComponent('ClipboardCheck'),
        route: (serviceType) => `/admin/admin/${serviceType}/shortlisting`,
      },
      {
        name: 'Compliance',
        icon: getIconComponent('FileText'),
        route: (serviceType) => `/admin/admin/${serviceType}/compliance`,
      },
      {
        name: 'Reports',
        icon: getIconComponent('FileSearch'),
        route: (serviceType) => `/admin/admin/${serviceType}/reports`,
      },
      {
        name: 'Payments',
        icon: getIconComponent('CreditCard'),
        route: (serviceType) => `/admin/admin/${serviceType}/payments`,
      },
    ],
    // // Add dealing_officer to ecpf
    // dealing_officer: dealingOfficerMenuItems,
  },
  health_certification: {
    user: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/user/${serviceType}/dashboard`,
        hidden: () => !useHealthCertificationStore().visibleMenus.baseMenus.dashboard,
      },
      {
        name: 'Certification',
        icon: getIconComponent('Certificate'),
        hidden: () => !useHealthCertificationStore().visibleMenus.baseMenus.certification,
        children: () => {
          const store = useHealthCertificationStore()
          const { certificationSubMenus } = store.visibleMenus

          const items = []

          // Only add "Apply for Certification" if "My Applications" is not visible
          if (
            certificationSubMenus.applyForCertification &&
            !certificationSubMenus.myApplications
          ) {
            items.push({
              name: 'Apply for Certification',
              route: (serviceType) => `/admin/user/${serviceType}/registration`,
            })
          }

          if (certificationSubMenus.myApplications) {
            items.push({
              name: 'My Applications',
              route: (serviceType) => `/admin/user/${serviceType}/my_applications`,
            })
          }

          if (certificationSubMenus.renewal) {
            items.push({
              name: 'Renewal',
              route: (serviceType) => `/admin/user/${serviceType}/renewal`,
            })
          }

          if (certificationSubMenus.reRegistration) {
            items.push({
              name: 'Re-Registration',
              route: (serviceType) => `/admin/user/${serviceType}/re_registration`,
            })
          }

          if (certificationSubMenus.additionalQualification) {
            items.push({
              name: 'Additional Qualification',
              route: (serviceType) => `/admin/user/${serviceType}/additional_qualification`,
            })
          }

          return items
        },
      },
      {
        name: 'CPD Management',
        icon: getIconComponent('BookOpen'),
        hidden: () => !useHealthCertificationStore().visibleMenus.baseMenus.cpdManagement,
        children: [
          {
            name: 'Apply for CPD',
            route: (serviceType) => `/admin/user/${serviceType}/cpd`,
          },
          {
            name: 'Track CPD Applications',
            route: (serviceType) => `/admin/user/${serviceType}/track_cpd_applications`,
          },
        ],
      },
      {
        name: 'CoGS Management',
        icon: getIconComponent('Users'),
        hidden: () => !useHealthCertificationStore().visibleMenus.baseMenus.cogsManagement,
        children: [
          {
            name: 'Apply for CoGS',
            route: (serviceType) => `/admin/user/${serviceType}/CoGS`,
          },
          {
            name: 'Track CoGS Applications',
            route: (serviceType) => `/admin/user/${serviceType}/track_cogs_applications`,
          },
        ],
      },
      {
        name: 'Counselor Management',
        icon: getIconComponent('FileText'),
        // Show this parent menu if the user is a counselor
        hidden: () => {
          const authStore = useAuthStore()
          return !authStore.user?.is_counselor
        },
        children: [
          {
            name: 'Submit Application',
            route: (serviceType) => `/admin/user/${serviceType}/counselor_application`,
          },
          {
            name: 'Track Counselor Applications',
            route: (serviceType) => `/admin/user/${serviceType}/track_counselor_application`,
          },
        ],
      },
      {
        name: 'Profile',
        icon: getIconComponent('Users'),
        route: (serviceType) => `/admin/user/${serviceType}/user_profile`,
        hidden: () => !useHealthCertificationStore().visibleMenus.baseMenus.profile,
      },
      {
        name: 'Reports',
        icon: getIconComponent('FileSearch'),
        route: (serviceType) => `/admin/user/${serviceType}/reports`,
        hidden: () => true, // Always hidden, not in your requirements
      },
    ],
    admin: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/admin/${serviceType}/dashboard`,
      },
      {
        name: 'CME Management',
        icon: getIconComponent('BookOpen'),
        children: [
          {
            name: 'CME Activities',
            route: (serviceType) => `/admin/admin/${serviceType}/cme_activities`,
          },
          {
            name: 'CME Credits',
            route: (serviceType) => `/admin/admin/${serviceType}/cme_credits`,
          },
          {
            name: 'CME Methodologies',
            route: (serviceType) => `/admin/admin/${serviceType}/cme_methodologies`,
          },
        ],
      },
      {
        name: 'CPD Activity',
        icon: getIconComponent('FileText'),
        route: (serviceType) => `/admin/admin/${serviceType}/cpd_activity`,
      },
      {
        name: 'Document Management',
        icon: getIconComponent('File'),
        children: [
          {
            name: 'Document Types',
            route: (serviceType) => `/admin/admin/${serviceType}/document_types`,
          },
          {
            name: 'E-Signatures',
            route: (serviceType) => `/admin/admin/${serviceType}/e_signatures`,
          },
          {
            name: 'File Types',
            route: (serviceType) => `/admin/admin/${serviceType}/file_types`,
          },
        ],
      },
      {
        name: 'Fee Management',
        icon: getIconComponent('CreditCard'),
        children: [
          {
            name: 'Fee Structures',
            route: (serviceType) => `/admin/admin/${serviceType}/fee_structures`,
          },
          {
            name: 'Fees Associated For',
            route: (serviceType) => `/admin/admin/${serviceType}/fees_associated_for`,
          },
        ],
      },
      {
        name: 'Participation',
        icon: getIconComponent('Users'),
        children: [
          {
            name: 'Categories',
            route: (serviceType) => `/admin/admin/${serviceType}/participation_category`,
          },
          {
            name: 'Sub Categories',
            route: (serviceType) => `/admin/admin/${serviceType}/participation_sub_category`,
          },
        ],
      },
      {
        name: 'Personnel',
        icon: getIconComponent('UserCircle'),
        children: [
          {
            name: 'Categories',
            route: (serviceType) => `/admin/admin/${serviceType}/personnel_categories`,
          },
          {
            name: 'Qualifications',
            route: (serviceType) => `/admin/admin/${serviceType}/qualifications`,
          },
          {
            name: 'Qualification Types',
            route: (serviceType) => `/admin/admin/${serviceType}/qualification_types`,
          },
        ],
      },
      {
        name: 'Registration',
        icon: getIconComponent('ClipboardCheck'),
        children: [
          {
            name: 'Types',
            route: (serviceType) => `/admin/admin/${serviceType}/registration_type`,
          },
          {
            name: 'Sectors',
            route: (serviceType) => `/admin/admin/${serviceType}/sector`,
          },
          {
            name: 'Sub Categories',
            route: (serviceType) => `/admin/admin/${serviceType}/sub_categories`,
          },
        ],
      },
      {
        name: 'University',
        icon: getIconComponent('BookOpen'),
        route: (serviceType) => `/admin/admin/${serviceType}/university`,
      },
      {
        name: 'COGS Management',
        icon: getIconComponent('Building2'),
        children: [
          {
            name: 'Agency',
            route: (serviceType) => `/admin/admin/${serviceType}/cogs_agency`,
          },
          {
            name: 'Department',
            route: (serviceType) => `/admin/admin/${serviceType}/cogs_dept`,
          },
          {
            name: 'Workplace',
            route: (serviceType) => `/admin/admin/${serviceType}/cogs_workplace`,
          },
        ],
      },
    ],
    dealing_officer: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/dashboard`,
      },
      {
        name: 'Applications',
        icon: getIconComponent('FileText'),
        children: [
          {
            name: 'Application Lists',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/application_lists`,
          },
          {
            name: 'Additional Application Lists',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/additional_application`,
          },
          {
            name: 'Renewal Lists',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/renewal_lists`,
          },
          {
            name: 'Reregistration Lists',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/re_registration_lists`,
          },
          {
            name: 'CoGS Management',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/cogs`,
          },
        ],
      },
      {
        name: 'CPD Management',
        icon: getIconComponent('BookOpen'),
        children: [
          {
            name: 'Application Lists',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/cpd_application_review`,
          },
          // {
          //   name: 'Create Application',
          //   route: (serviceType) => `/admin/dealing_officer/${serviceType}/cpd_create_application`,
          // },
          {
            name: 'Manage Providers',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/cpd_provider_management`,
          },
          {
            name: 'Award Credits',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/cpd_award_credits`,
          },
          {
            name: 'Reports',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/cpd_reports`,
          },
        ],
      },
      {
        name: 'Institute Management',
        icon: getIconComponent('Building2'),
        children: [
          {
            name: 'EOI Applications',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/eoi_application`,
          },
          {
            name: 'DPR Applications',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/dpr_application`,
          },
          {
            name: 'CAPA Management',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/capa`,
          },
          {
            name: 'Reports',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/institute_report`,
          },
        ],
      },
      {
        name: 'Professional Profiles',
        icon: getIconComponent('UserCircle'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/profiles`,
      },
      {
        name: 'Payment Records',
        icon: getIconComponent('CreditCard'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/payments`,
      },
      {
        name: 'Counselor Application',
        icon: getIconComponent('ClipboardCheck'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/counselor_application`,
      },
      {
        name: 'Reports',
        icon: getIconComponent('ClipboardCheck'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/reports`,
      },
    ],
    cpd_cme_provider: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/cpd_cme_provider/${serviceType}/dashboard`,
      },
      {
        name: 'Apply New CPD',
        icon: getIconComponent('BookOpen'),
        route: (serviceType) => `/admin/cpd_cme_provider/${serviceType}/cpd_application_details`,
      },
      {
        name: 'Track Applications',
        icon: getIconComponent('FileText'),
        route: (serviceType) => `/admin/cpd_cme_provider/${serviceType}/cpd_application_tracker`,
      },
    ],
    institutions: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/institutions/${serviceType}/dashboard`,
      },
      {
        name: 'Apply for EOI',
        icon: getIconComponent('CheckCircle'),
        route: (serviceType) => `/admin/institutions/${serviceType}/apply_for_eoi`,
      },
      {
        name: 'Track EOI',
        icon: getIconComponent('FileSearch'),
        route: (serviceType) => `/admin/institutions/${serviceType}/track_eoi`,
      },
      {
        name: 'Apply For DPR',
        icon: getIconComponent('CheckCircle'),
        route: (serviceType) => `/admin/institutions/${serviceType}/apply_for_dpr`,
      },
      {
        name: 'Track DPR',
        icon: getIconComponent('FileSearch'),
        route: (serviceType) => `/admin/institutions/${serviceType}/track_dpr`,
      },
      {
        name: 'Draft Application',
        icon: getIconComponent('FileSearch'),
        route: (serviceType) => `/admin/institutions/${serviceType}/draft_applications`,
      },
      {
        name: 'View Certificates',
        icon: getIconComponent('ClipboardCheck'),
        route: (serviceType) => `/admin/institutions/${serviceType}/view_certificates`,
      },
    ],
  },
  engineering_certification: {
    user: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/user/${serviceType}/dashboard`,
      },
      {
        name: 'Registration Services',
        icon: getIconComponent('ClipboardCheck'),
        children: [
          {
            name: 'Registration',
            route: (serviceType) => `/admin/user/${serviceType}/registration`,
          },
          {
            name: 'Renewal',
            route: (serviceType) => `/admin/user/${serviceType}/renewal`,
          },
          {
            name: 'Re-registration',
            route: (serviceType) => `/admin/user/${serviceType}/re_registration`,
          },
          {
            name: 'Additional Qualification',
            route: (serviceType) => `/admin/user/${serviceType}/additional_qualification`,
          },
          {
            name: 'Certificate of Good Standing',
            route: (serviceType) => `/admin/user/${serviceType}/CoGS`,
          },
        ],
      },
      {
        name: 'CPD Management',
        icon: getIconComponent('BookOpen'),
        route: (serviceType) => `/admin/user/${serviceType}/cpd`,
      },
      {
        name: 'Payment',
        icon: getIconComponent('CreditCard'),
        children: [
          {
            name: 'Payment Link',
            route: (serviceType) => `/admin/user/${serviceType}/payment`,
          },
          {
            name: 'Payment History',
            route: (serviceType) => `/admin/user/${serviceType}/payment_history`,
          },
        ],
      },
      {
        name: 'Reports',
        icon: getIconComponent('FileText'),
        route: (serviceType) => `/admin/user/${serviceType}/reports`,
      },
      {
        name: 'Profile',
        icon: getIconComponent('UserCircle'),
        route: (serviceType) => `/admin/user/${serviceType}/profile`,
      },
    ],
    admin: [
      {
        name: 'Engineering Categories',
        icon: getIconComponent('Wrench'),
        route: (serviceType) => `/admin/admin/${serviceType}/categories`,
      },
    ],
    dealing_officer: dealingOfficerMenuItems,
  },
  accreditation: {
    user: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/user/${serviceType}/dashboard`,
      },
      {
        name: 'Apply for Accreditation',
        icon: getIconComponent('ClipboardCheck'),
        route: (serviceType) => `/admin/user/${serviceType}/apply_for_accreditation`,
      },
      {
        name: 'Appeal for Accreditation',
        icon: getIconComponent('FileSearch'),
        route: (serviceType) => `/admin/user/${serviceType}/appeal`,
      },
      {
        name: 'CoI Confirmation',
        icon: getIconComponent('CheckCircle'),
        route: (serviceType) => `/admin/user/${serviceType}/coi_confirmation`,
      },
      {
        name: 'Site Visit',
        icon: getIconComponent('Building2'),
        route: (serviceType) => `/admin/user/${serviceType}/site_visit_confirmation`,
      },
      {
        name: 'View Results',
        icon: getIconComponent('FileText'),
        route: (serviceType) => `/admin/user/${serviceType}/results`,
      },
      {
        name: 'Profile',
        icon: getIconComponent('UserCircle'),
        route: (serviceType) => `/admin/user/${serviceType}/profile`,
      },
    ],
    dealing_officer: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/dealing_Officer/${serviceType}/dashboard`,
      },
      {
        name: 'Institutional Accreditation',
        icon: getIconComponent('Folder'),
        route: (serviceType) =>
          `/admin/dealing_officer/${serviceType}/institutional_accreditations`,
      },
      {
        name: 'Appeals',
        icon: getIconComponent('CheckCircle'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/appeals`,
      },
      {
        name: 'Assessor Management',
        icon: getIconComponent('ClipboardCheck'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/assessor_management`,
      },
      {
        name: 'Site Visit Scheduling',
        icon: getIconComponent('ClipboardCheck'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/site_visit_scheduling`,
      },
      {
        name: 'Reports',
        icon: getIconComponent('CreditCard'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/reports`,
      },
    ],
    admin: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/admin/${serviceType}/dashboard`,
      },
      {
        name: 'Applications & Appeals', // Combined for brevity
        icon: getIconComponent('ClipboardList'), // Could use a different combined icon
        children: [
          {
            name: 'Applications',
            icon: getIconComponent('ClipboardList'),
            route: (serviceType) => `/admin/admin/${serviceType}/application_lists`,
          },
          {
            name: 'Appeals',
            icon: getIconComponent('Scale'),
            route: (serviceType) => `/admin/admin/${serviceType}/appeal_lists`,
          },
        ],
      },
      {
        name: 'Reports',
        icon: getIconComponent('FileBarChart'),
        route: (serviceType) => `/admin/admin/${serviceType}/reports`,
      },
      {
        name: 'Institutions', // Group institution-related settings
        icon: getIconComponent('Building'),
        children: [
          {
            name: 'Manage Institutes',
            icon: getIconComponent('Building'), // Or another suitable icon
            route: (serviceType) => `/admin/admin/${serviceType}/institute`,
          },
          {
            name: 'Assessor Pool',
            icon: getIconComponent('Users'),
            route: (serviceType) => `/admin/admin/${serviceType}/assessor_pool`,
          },
          {
            name: 'Institution Standards', // Clarify that these are *institution* standards
            icon: getIconComponent('Award'),
            route: (serviceType) => `/admin/admin/${serviceType}/institution_standards`, // NEW ROUTE
          },
        ],
      },
      {
        name: 'Personnel', // Group employee/staff settings
        icon: getIconComponent('Users'), // Consistent icon
        children: [
          {
            name: 'Categories',
            icon: getIconComponent('UserCircle'),
            route: (serviceType) => `/admin/admin/${serviceType}/employee_category`,
          },
          {
            name: 'Employee Types',
            icon: getIconComponent('Users'),
            route: (serviceType) => `/admin/admin/${serviceType}/employee_type`,
          },
          {
            name: 'Staff Types',
            icon: getIconComponent('UserPlus'),
            route: (serviceType) => `/admin/admin/${serviceType}/staff_type`,
          },
        ],
      },
      {
        name: 'Accreditation Setup',
        icon: getIconComponent('Settings'), // Or perhaps a different icon, like 'Sliders'
        children: [
          {
            name: 'Decisions',
            icon: getIconComponent('CheckSquare'),
            route: (serviceType) => `/admin/admin/${serviceType}/decision`,
          },
          {
            name: 'Decision Classes',
            icon: getIconComponent('Layers'),
            route: (serviceType) => `/admin/admin/${serviceType}/decision_classes`,
          },
          {
            name: 'Indicators',
            icon: getIconComponent('Target'),
            route: (serviceType) => `/admin/admin/${serviceType}/indicators`,
          },
          {
            name: 'Key Aspects',
            icon: getIconComponent('Key'),
            route: (serviceType) => `/admin/admin/${serviceType}/key_aspects`,
          },
          {
            name: 'Standards', // General accreditation standards
            icon: getIconComponent('Award'),
            route: (serviceType) => `/admin/admin/${serviceType}/standard`,
          },
          {
            name: 'Rating Categories',
            icon: getIconComponent('Star'),
            route: (serviceType) => `/admin/admin/${serviceType}/rating_category`,
          },
        ],
      },
      {
        name: 'System Config',
        icon: getIconComponent('Sliders'),
        children: [
          {
            name: 'Appeal Reasons',
            icon: getIconComponent('Scroll'),
            route: (serviceType) => `/admin/admin/${serviceType}/appeal_reason`,
          },
          {
            name: 'Application Duration',
            icon: getIconComponent('Clock'),
            route: (serviceType) => `/admin/admin/${serviceType}/application_duration`,
          },
          {
            name: 'E-Signature',
            icon: getIconComponent('PenTool'),
            route: (serviceType) => `/admin/admin/${serviceType}/e_signature`,
          },
          {
            name: 'Fees',
            icon: getIconComponent('DollarSign'),
            route: (serviceType) => `/admin/admin/${serviceType}/fees`,
          },
          {
            name: 'Documents',
            icon: getIconComponent('FileText'),
            route: (serviceType) => `/admin/admin/${serviceType}/document`,
          },
          {
            name: 'Qualifications',
            icon: getIconComponent('GraduationCap'),
            route: (serviceType) => `/admin/admin/${serviceType}/qualification`,
          },
          {
            name: 'Source of Funding',
            icon: getIconComponent('Wallet'),
            route: (serviceType) => `/admin/admin/${serviceType}/source_of_funding`,
          },
        ],
      },
    ],
  },
}

/**
 * Generates navigation items based on the service type and role.
 * @param {string} resolveDirective
 * @param {string} serviceType
 * @returns {Array}
 */
export const generateNavigationItems = (role, serviceType) => {
  if (!role || !serviceType) return []

  const serviceMenu = serviceSpecificMenuItems[serviceType]
  if (!serviceMenu || !serviceMenu[role]) return []

  // Process the menu items to resolve dynamic routes and handle hidden properties
  const processMenuItem = (item) => {
    let isHidden = false
    if (typeof item.hidden === 'function') {
      isHidden = item.hidden()
    } else if (typeof item.hidden === 'boolean') {
      isHidden = item.hidden
    }

    // If the item is hidden, return null (don't include it in the menu)
    if (isHidden) {
      return null
    }

    const newItem = {
      ...item,
      route: typeof item.route === 'function' ? item.route(serviceType) : item.route,
    }

    if (newItem.children) {
      // If children is a function, execute it to get the items
      const childItems =
        typeof newItem.children === 'function' ? newItem.children() : newItem.children

      // Process children and filter out null items (recursively)
      newItem.children = childItems
        .map((child) => processMenuItem(child)) // Recursively process child items
        .filter((child) => child !== null)

      // If all children are hidden, hide the parent item
      if (newItem.children.length === 0) {
        return null
      }
    }

    return newItem
  }

  // Process and filter the menu items
  return serviceMenu[role].map(processMenuItem).filter((item) => item !== null)
}
