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
  FilePlus,
  List,
  RefreshCw,
  Edit,
  Link,
  Users2,
  Monitor,
  // Added missing icons
  Scale,
  History,
  ClipboardList,
  FileBarChart,
  Building,
  UserPlus,
  CheckSquare,
  Layers,
  Target,
  Key,
  Star,
  Scroll,
  PenTool,
  DollarSign,
  Wallet,
  GraduationCap,
  Sliders,
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
  FilePlus,
  List,
  RefreshCw,
  Edit,
  Link,
  Users2,
  Monitor,
  Scale,
  History,
  ClipboardList,
  FileBarChart,
  Building,
  UserPlus,
  CheckSquare,
  Layers,
  Target,
  Key,
  Star,
  Scroll,
  PenTool,
  DollarSign,
  Wallet,
  GraduationCap,
  Sliders,
}
import { useHealthCertificationStore } from '@/stores/mhpcNavigationStore'
import { useAuthStore } from '@/stores/authStore'
import { useInstitutionStore } from '@/stores/institutionNavigationStore'

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
      // {
      //   name: 'Learning Types',
      //   icon: getIconComponent('BookOpen'),
      //   route: (serviceType) => `/admin/admin/${serviceType}/learning_types`,
      // },
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
        name: 'Mode of Study',
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
      // {
      //   name: 'Countries',
      //   icon: getIconComponent('Globe'),
      //   route: (serviceType) => `/admin/admin/${serviceType}/countries`,
      // },
      // {
      //   name: 'User Profile',
      //   icon: getIconComponent('Users'),
      //   route: (serviceType) => `/admin/admin/${serviceType}/user_profile`,
      // },
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
      {
        name: 'Profile',
        icon: getIconComponent('ClipboardCheck'),
        route: (serviceType) => `/admin/chief/${serviceType}/profile`,
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
            route: (serviceType) => `/admin/user/${serviceType}/ecpf_inhouse_event`,
          },
          {
            name: 'Mass Media Event',
            route: (serviceType) => `/admin/user/${serviceType}/ecpf_massmedia`,
          },
          {
            name: 'HEI Visit',
            route: (serviceType) => `/admin/user/${serviceType}/ecpf_hei_visit`,
          },
        ],
      },

      {
        name: 'HR Bio Data',
        icon: getIconComponent('Users'), // 'Users' for HR
        route: (serviceType) => `/admin/user/${serviceType}/hr_biodata`,
      },
      {
        name: 'Student Management',
        icon: getIconComponent('Users'), // 'Users' for Student Management
        route: (serviceType) => `/admin/user/${serviceType}/student_biodata`,
      },
      {
        name: 'Profile',
        icon: getIconComponent('UserCircle'),
        route: (serviceType) => `/admin/user/${serviceType}/profile`,
      },
      {
        name: 'Track My Applications',
        icon: getIconComponent('UserCircle'),
        route: (serviceType) => `/admin/user/${serviceType}/track_applications`,
      },
      {
        name: 'Upload Trade License',
        icon: getIconComponent('UserCircle'),
        route: (serviceType) => `/admin/user/${serviceType}/upload_trade_license`,
      },
    ],
    admin: [
      {
        name: 'Dashboard',
        icon: getIconComponent('ClipboardList'), // More specific than CreditCard
        route: (serviceType) => `/admin/admin/${serviceType}/dashboard`,
      },
      {
        name: 'Compliance Action',
        icon: getIconComponent('ClipboardList'), // More specific than CreditCard
        route: (serviceType) => `/admin/admin/${serviceType}/compliance_action`,
      },
      {
        name: 'Compliance Action Taken',
        icon: getIconComponent('CheckSquare'), // Represents actions completed
        route: (serviceType) => `/admin/admin/${serviceType}/compliance_action_taken`,
      },
      {
        name: 'Decisions',
        icon: getIconComponent('Scale'), // Represents judgment/decision making
        route: (serviceType) => `/admin/admin/${serviceType}/ecpf_decisions`,
      },
      {
        name: 'Qualifications',
        icon: getIconComponent('GraduationCap'), //Relates to academic/professional qualifications
        route: (serviceType) => `/admin/admin/${serviceType}/qualifications`,
      },
      {
        name: 'Infrastructures',
        icon: getIconComponent('Building2'), // Represents buildings/infrastructure
        route: (serviceType) => `/admin/admin/${serviceType}/infrastructures`,
      },
      {
        name: 'Institutes',
        icon: getIconComponent('Building'), // Represents educational/research institutes.
        route: (serviceType) => `/admin/admin/${serviceType}/institutes`,
      },
      {
        name: 'Issue Compliances',
        icon: getIconComponent('FileText'), //Relates to compliance documentation
        route: (serviceType) => `/admin/admin/${serviceType}/issue_compliances`,
      },
      {
        name: 'Positions',
        icon: getIconComponent('UserCircle'), // Represents job positions
        route: (serviceType) => `/admin/admin/${serviceType}/positions`,
      },
      {
        name: 'Promotional Event Types',
        icon: getIconComponent('Star'), // or 'Megaphone' if available, for promotion
        route: (serviceType) => `/admin/admin/${serviceType}/promotional_event_types`,
      },
      {
        name: 'Service Categories',
        icon: getIconComponent('Layers'), // Represents different categories/layers
        route: (serviceType) => `/admin/admin/${serviceType}/service_categories`,
      },
      {
        name: 'Status',
        icon: getIconComponent('Sliders'), // Represents progress or settings, better than Clock
        route: (serviceType) => `/admin/admin/${serviceType}/status`,
      },
      {
        name: 'Types of Firms',
        icon: getIconComponent('Briefcase'), // Represents different types of businesses
        route: (serviceType) => `/admin/admin/${serviceType}/types_of_firms`,
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
        icon: getIconComponent('FileText'), // Using FileText for Applications
        children: [
          {
            name: 'Individual ECPF Applications',
            icon: getIconComponent('UserCircle'), // User for Individual
            route: (serviceType) =>
              `/admin/dealing_officer/${serviceType}/individual_ecpf_applications`,
          },
          {
            name: 'Collaborated ECPF Applications',
            icon: getIconComponent('Users2'), // Users2 for Collaboration
            route: (serviceType) =>
              `/admin/dealing_officer/${serviceType}/collaborated_ecpf_applications`,
          },
          {
            name: 'New Branch Applications',
            icon: getIconComponent('BuildingPlus'), // BuildingPlus or Building2 for Branch, consider adding BuildingPlus to icon list if needed, or just use Building2
            route: (serviceType) =>
              `/admin/dealing_officer/${serviceType}/branch_ecpf_applications`,
          },
          {
            name: 'Renewal Applications',
            icon: getIconComponent('RefreshCw'), // RefreshCw for Renewal
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/renewal_applications`,
          },
        ],
      },
      {
        name: 'Change Requests',
        icon: getIconComponent('Edit'), // Edit for Change Requests
        children: [
          {
            name: 'ECPF Name Change',
            icon: getIconComponent('Edit'), // Edit for Change
            route: (serviceType) =>
              `/admin/dealing_officer/${serviceType}/name_change_applications`,
          },
          {
            name: 'ECPF Location Change',
            icon: getIconComponent('Building'), // Building for Location
            route: (serviceType) =>
              `/admin/dealing_officer/${serviceType}/location_change_applications`,
          },
          {
            name: 'ECPF Ownership Change',
            icon: getIconComponent('Users'), // Users for Ownership
            route: (serviceType) =>
              `/admin/dealing_officer/${serviceType}/ownership_change_applications`,
          },
        ],
      },
      {
        name: 'Events',
        icon: getIconComponent('Briefcase'), // Briefcase for Events
        children: [
          {
            name: 'Education Fair Applications',
            icon: getIconComponent('GraduationCap'), // GraduationCap for Education
            route: (serviceType) =>
              `/admin/dealing_officer/${serviceType}/education_fair_applications`,
          },
          {
            name: 'Mass Media Event Applications',
            icon: getIconComponent('Monitor'), // Monitor for Media
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/mass_media_applications`,
          },
          {
            name: 'In House Event Applications',
            icon: getIconComponent('Building'), // Building for In House
            route: (serviceType) =>
              `/admin/dealing_officer/${serviceType}/in_house_event_applications`,
          },
          {
            name: 'Hei Visit Applications',
            icon: getIconComponent('Building2'), // Building2 for HEI
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/hei_visit_applications`,
          },
        ],
      },
      {
        name: 'ECPF Linkages',
        icon: getIconComponent('Link'), // Link for Linkages
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/ecpf_link_establishment`,
      },
      {
        name: 'Bio Data',
        icon: getIconComponent('Users'), // Users for Bio Data
        children: [
          {
            name: 'Add HR',
            icon: getIconComponent('UserPlus'), // UserPlus for Add
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/add_hr`,
          },
          {
            name: 'Add Student',
            icon: getIconComponent('UserPlus'), // UserPlus for Add
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/add_student`,
          },
        ],
      },
      {
        name: 'Non-Complaince Record',
        icon: getIconComponent('XCircle'), // XCircle for Non-Compliance
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/non_compliance_records`,
      },
      {
        name: 'Reports',
        icon: getIconComponent('FileBarChart'), // FileBarChart for Reports
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/ecpf_reports`,
      },
      {
        name: 'Payments',
        icon: getIconComponent('CreditCard'), // CreditCard for Payments
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/ecpf_payment_history`,
      },
    ],
    chief: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/chief/${serviceType}/dashboard`,
      },
      {
        name: 'Applications',
        icon: getIconComponent('Activity'), //Use activity
        children: [
          {
            name: 'Individual ECPF Applications',
            route: (serviceType) => `/admin/chief/${serviceType}/individual_ecpf_applications`,
          },
          {
            name: 'Collaborated ECPF Applications',
            route: (serviceType) => `/admin/chief/${serviceType}/collaborated_ecpf_applications`,
          },
          {
            name: 'New Branch Applications',
            route: (serviceType) => `/admin/chief/${serviceType}/branch_ecpf_applications`,
          },
          {
            name: 'Renewal Applications',
            route: (serviceType) => `/admin/chief/${serviceType}/renewal_applications`,
          },
        ],
      },
      {
        name: 'Change Requests',
        icon: getIconComponent('Activity'), //Use activity
        children: [
          {
            name: 'ECPF Name Change',
            route: (serviceType) => `/admin/chief/${serviceType}/name_change_applications`,
          },
          {
            name: 'ECPF Location Change',
            route: (serviceType) => `/admin/chief/${serviceType}/location_change_applications`,
          },
          {
            name: 'ECPF Ownership Change',
            route: (serviceType) => `/admin/chief/${serviceType}/ownership_change_applications`,
          },
        ],
      },
      {
        name: 'Events',
        icon: getIconComponent('Activity'), //Use activity
        children: [
          {
            name: 'Education Fair Applications',
            route: (serviceType) => `/admin/chief/${serviceType}/education_fair_applications`,
          },
          {
            name: 'Mass Media Event Applications',
            route: (serviceType) => `/admin/chief/${serviceType}/mass_media_applications`,
          },
          {
            name: 'In House Event Applications',
            route: (serviceType) => `/admin/chief/${serviceType}/in_house_event_applications`,
          },
          {
            name: 'Hei Visit Applications',
            route: (serviceType) => `/admin/chief/${serviceType}/hei_visit_applications`,
          },
        ],
      },
      {
        name: 'ECPF Linkages',
        icon: getIconComponent('ClipboardCheck'),
        route: (serviceType) => `/admin/chief/${serviceType}/ecpf_link_establishment`,
      },
      {
        name: 'Bio Data',
        icon: getIconComponent('Activity'), //Use activity
        children: [
          {
            name: 'Add HR',
            route: (serviceType) => `/admin/chief/${serviceType}/add_hr`,
          },
          {
            name: 'Add Student',
            route: (serviceType) => `/admin/chief/${serviceType}/add_student`,
          },
        ],
      },
      {
        name: 'Non-Compliance Record',
        icon: getIconComponent('FileSearch'),
        route: (serviceType) => `/admin/chief/${serviceType}/non_compliance_records`,
      },
      {
        name: 'Reports',
        icon: getIconComponent('FileSearch'),
        route: (serviceType) => `/admin/chief/${serviceType}/ecpf_reports`,
      },
      {
        name: 'Payments',
        icon: getIconComponent('CreditCard'),
        route: (serviceType) => `/admin/chief/${serviceType}/ecpf_payment_history`,
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
        name: 'Initial Applications',
        icon: getIconComponent('FileText'),
        children: [
          {
            name: 'Initial Application Lists',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/application_lists`,
          },
          {
            name: 'Additional Application Lists',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/additional_application`,
          },
          {
            name: 'Renewal Application Lists',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/renewal_lists`,
          },
          {
            name: 'Re-registration Lists',
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
            name: 'CPD providers Application',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/cpd_application_review`,
          },
          {
            name: 'Self Assessed CPD Application',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/cpd_award_credits`,
          },
          {
            name: 'Manage Providers',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/cpd_provider_management`,
          },
          // {
          //   name: 'Reports',
          //   route: (serviceType) => `/admin/dealing_officer/${serviceType}/cpd_reports`,
          // },
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
            name: 'All Institute Profiles',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/institute_profiles`,
          },
          {
            name: 'Teaching Hospitals',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/teaching_hospitals`,
          },
          {
            name: 'Education Programs',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/education_programs`,
          },
          {
            name: 'Institute Renewals',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/institute_renewals`,
          },
          {
            name: 'Teaching Hospital Renewals',
            route: (serviceType) =>
              `/admin/dealing_officer/${serviceType}/teaching_hospital_renewals`,
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
      {
        name: 'CPD approved Add Participants',
        icon: getIconComponent('FileText'),
        route: (serviceType) =>
          `/admin/cpd_cme_provider/${serviceType}/cpd_approved_add_participants`,
      },
    ],
    institutions: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/institutions/${serviceType}/dashboard`,
      },
      {
        name: 'EOI Management',
        icon: getIconComponent('Activity'),
        hidden: () => !useInstitutionStore().visibleMenus.showEoiManagement,
        children: [
          {
            name: 'Apply for EOI',
            route: (serviceType) => `/admin/institutions/${serviceType}/apply_for_eoi`,
            hidden: () => !useInstitutionStore().visibleMenus.showApplyForEoi,
          },
          {
            name: 'Track EOI',
            route: (serviceType) => `/admin/institutions/${serviceType}/track_eoi`,
            hidden: () => !useInstitutionStore().visibleMenus.showTrackEoi,
          },
        ],
      },
      {
        name: 'DPR Management',
        icon: getIconComponent('Activity'),
        hidden: () => !useInstitutionStore().visibleMenus.showDprManagement,
        children: [
          {
            name: 'Apply for DPR',
            route: (serviceType) => `/admin/institutions/${serviceType}/apply_for_dpr`,
            hidden: () => !useInstitutionStore().visibleMenus.showApplyForDpr,
          },
          {
            name: 'Track DPR',
            route: (serviceType) => `/admin/institutions/${serviceType}/track_dpr`,
            hidden: () => !useInstitutionStore().visibleMenus.showTrackDpr,
          },
        ],
      },
      {
        name: 'Institute Renewal',
        icon: getIconComponent('ClipboardCheck'),
        route: (serviceType) => `/admin/institutions/${serviceType}/institutes_renewal`,
        hidden: () => !useInstitutionStore().visibleMenus.showOtherMenus,
      },
      {
        name: 'Teaching Hospital',
        icon: getIconComponent('Activity'),
        hidden: () => !useInstitutionStore().visibleMenus.showOtherMenus,
        children: [
          {
            name: 'Teaching Hospital',
            route: (serviceType) => `/admin/institutions/${serviceType}/new_teaching_hospital`,
          },
          {
            name: 'Track & Renewal',
            route: (serviceType) => `/admin/institutions/${serviceType}/renewal_teaching_hospital`,
          },
          {
            name: 'New Education Program',
            route: (serviceType) => `/admin/institutions/${serviceType}/new_education_program`,
          },
        ],
      },
      {
        name: 'Institution Profile',
        icon: getIconComponent('UserCircle'),
        route: (serviceType) => `/admin/institutions/${serviceType}/institution_profile`,
        hidden: () => !useInstitutionStore().visibleMenus.showOtherMenus,
      },
      // {
      //   name: 'View Certificates',
      //   icon: getIconComponent('ClipboardCheck'),
      //   route: (serviceType) => `/admin/institutions/${serviceType}/view_certificates`,
      //   hidden: () => !useInstitutionStore().visibleMenus.showOtherMenus,
      // },
      // {
      //   name: 'My Applications',
      //   icon: getIconComponent('ClipboardCheck'),
      //   route: (serviceType) => `/admin/institutions/${serviceType}/my_applications`,
      //   hidden: () => !useInstitutionStore().visibleMenus.showOtherMenus,
      // },
      {
        name: 'CAPA',
        icon: getIconComponent('ClipboardCheck'),
        route: (serviceType) => `/admin/institutions/${serviceType}/my_capa`,
        hidden: () => !useInstitutionStore().visibleMenus.showOtherMenus,
      },
      {
        name: 'Maintenance',
        icon: getIconComponent('Activity'),
        hidden: () => !useInstitutionStore().visibleMenus.showOtherMenus,
        children: [
          {
            name: 'Staff Management',
            route: (serviceType) => `/admin/institutions/${serviceType}/staff_management`,
          },
          {
            name: 'Course Management',
            route: (serviceType) => `/admin/institutions/${serviceType}/course_management`,
          },
          {
            name: 'Department Management',
            route: (serviceType) => `/admin/institutions/${serviceType}/department_management`,
          },
        ],
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
        name: 'Certification',
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
            name: 'Additional Qualification',
            route: (serviceType) => `/admin/user/${serviceType}/additional_qualification`,
          },
          {
            name: 'My Applications',
            route: (serviceType) => `/admin/user/${serviceType}/my_applications`,
          },
        ],
      },
      {
        name: 'CPD Management',
        icon: getIconComponent('BookOpen'),
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
        icon: getIconComponent('CreditCard'),
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
        name: 'Profile',
        icon: getIconComponent('UserCircle'),
        route: (serviceType) => `/admin/user/${serviceType}/profile`,
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
        icon: getIconComponent('ClipboardList'),
        children: [
          {
            name: 'New Applications',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/application_lists`,
          },
          {
            name: 'Additional Applications',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/additional_application`,
          },
          {
            name: 'Renewal Applications',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/renewal_lists`,
          },
          {
            name: 'CoGS Management',
            icon: getIconComponent('Award'),
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/cogs`,
          },
        ],
      },
      {
        name: 'CPD Management',
        icon: getIconComponent('BookOpen'),
        children: [
          {
            name: 'CPD Applications Review',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/cpd_application_review`,
          },
          {
            name: 'Self Assessed CPD Applications',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/self_cpd_awards`,
          },
          {
            name: 'Manage Providers',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/cpd_provider_management`,
          },
        ],
      },
      {
        name: 'Institute Management',
        icon: getIconComponent('Building'),
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
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/capa_management`,
          },

          {
            name: 'All Institute Profile',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/all_institute_profile`,
          },
          {
            name: 'Teaching Institute',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/teaching_institute`,
          },
          {
            name: 'Education Programs',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/education_program`,
          },
          {
            name: 'Institute Renewals',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/institute_renewals`,
          },
          {
            name: 'Teaching Institute Renewals',
            route: (serviceType) =>
              `/admin/dealing_officer/${serviceType}/teaching_institute_renewals`,
          },
          {
            name: 'Reports',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/institute_report`,
          },
        ],
      },
      {
        name: 'Professional Profiles',
        icon: getIconComponent('Users'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/profiles`,
      },

      {
        name: 'Payments',
        icon: getIconComponent('DollarSign'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/payments`,
      },
      {
        name: 'Reports',
        icon: getIconComponent('FileBarChart'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/reports`,
      },
    ],

    chief: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/chief/${serviceType}/dashboard`,
      },
    ],

    director: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/director/${serviceType}/dashboard`,
      },
    ],

    admin: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/admin/${serviceType}/dashboard`,
      },
      {
        name: 'Content & Learning',
        icon: getIconComponent('BookOpen'), // Suggest changing to a more appropriate icon if needed
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
          {
            name: 'CPD Activity',
            route: (serviceType) => `/admin/admin/${serviceType}/cpd_activity`,
          },
        ],
      },
      {
        name: 'User Management',
        icon: getIconComponent('Users'),
        children: [
          {
            name: 'Users', // Kept 'Users' as it seems to refer to general user management in this context
            route: (serviceType) => `/admin/admin/${serviceType}/user_management`, // Assuming this route is for general user list/management
          },
          {
            name: 'Personnel Categories',
            route: (serviceType) => `/admin/admin/${serviceType}/personnel_categories`,
          },
          {
            name: 'Personnel Sub Categories',
            route: (serviceType) => `/admin/admin/${serviceType}/sub_categories`,
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
        icon: getIconComponent('ClipboardCheck'), // Suggest changing to a more appropriate icon if needed
        children: [
          {
            name: 'Registration Types',
            route: (serviceType) => `/admin/admin/${serviceType}/registration_type`,
          },
          {
            name: 'Registration Sectors',
            route: (serviceType) => `/admin/admin/${serviceType}/sector`,
          },
          {
            name: 'Participation Categories',
            route: (serviceType) => `/admin/admin/${serviceType}/participation_category`,
          },
          {
            name: 'Participation Sub Categories',
            route: (serviceType) => `/admin/admin/${serviceType}/participation_sub_category`,
          },
        ],
      },
      {
        name: 'System Configuration',
        icon: getIconComponent('Settings'), // Suggest using a 'Settings' icon if available
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
          {
            name: 'Fee Structures',
            route: (serviceType) => `/admin/admin/${serviceType}/fee_structures`,
          },
          {
            name: 'Fees Associated For',
            route: (serviceType) => `/admin/admin/${serviceType}/fees_associated_for`,
          },
          {
            name: 'COGS Agency',
            route: (serviceType) => `/admin/admin/${serviceType}/cogs_agency`,
          },
          {
            name: 'COGS Department',
            route: (serviceType) => `/admin/admin/${serviceType}/cogs_dept`,
          },
          {
            name: 'COGS Workplace',
            route: (serviceType) => `/admin/admin/${serviceType}/cogs_workplace`,
          },
          {
            name: 'University Management',
            route: (serviceType) => `/admin/admin/${serviceType}/university`,
          },
        ],
      },
    ],

    super_admin: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/super_admin/${serviceType}/dashboard`,
      },
    ],

    cpd_cme_provider: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/cpd_cme_provider/${serviceType}/dashboard`,
      },
      {
        name: 'CPD Application',
        icon: getIconComponent('FileText'),
        route: (serviceType) => `/admin/cpd_cme_provider/${serviceType}/cpd_application_details`,
      },
      {
        name: 'Track Applications',
        icon: getIconComponent('Search'),
        route: (serviceType) => `/admin/cpd_cme_provider/${serviceType}/cpd_application_tracker`,
      },
      {
        name: 'Add Participants',
        icon: getIconComponent('UserPlus'),
        route: (serviceType) =>
          `/admin/cpd_cme_provider/${serviceType}/cpd_approved_add_participants`,
      },
    ],

    institutions: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/institutions/${serviceType}/dashboard`,
      },
      {
        name: 'EOI Management',
        icon: getIconComponent('Activity'),
        children: [
          {
            name: 'Apply for EOI',
            route: (serviceType) => `/admin/institutions/${serviceType}/apply_for_eoi`,
          },
          {
            name: 'Track EOI',
            route: (serviceType) => `/admin/institutions/${serviceType}/track_eoi`,
          },
        ],
      },
      {
        name: 'DPR Management',
        icon: getIconComponent('Activity'),
        children: [
          {
            name: 'Apply for DPR',
            route: (serviceType) => `/admin/institutions/${serviceType}/apply_for_dpr`,
          },
          {
            name: 'Track DPR',
            route: (serviceType) => `/admin/institutions/${serviceType}/track_dpr`,
          },
        ],
      },
      {
        name: 'Institute Renewal',
        icon: getIconComponent('ClipboardCheck'),
        route: (serviceType) => `/admin/institutions/${serviceType}/institutes_renewal`,
      },
      {
        name: 'Teaching Institutes',
        icon: getIconComponent('Activity'),
        children: [
          {
            name: 'Teaching Institutes',
            route: (serviceType) =>
              `/admin/institutions/${serviceType}/teaching_center_application`,
          },
          {
            name: 'Track & Renewal',
            route: (serviceType) =>
              `/admin/institutions/${serviceType}/teaching_center_track_and_renew`,
          },
          {
            name: 'New Education Program',
            route: (serviceType) => `/admin/institutions/${serviceType}/new_education_program`,
          },
        ],
      },
      {
        name: 'Institution Profile',
        icon: getIconComponent('UserCircle'),
        route: (serviceType) => `/admin/institutions/${serviceType}/institution_profile`,
      },
      {
        name: 'CAPA',
        icon: getIconComponent('ClipboardCheck'),
        route: (serviceType) => `/admin/institutions/${serviceType}/my_capa`,
      },
      {
        name: 'Maintenance',
        icon: getIconComponent('Activity'),
        children: [
          {
            name: 'Staff Management',
            route: (serviceType) => `/admin/institutions/${serviceType}/staff_management`,
          },
          {
            name: 'Course Management',
            route: (serviceType) => `/admin/institutions/${serviceType}/course_management`,
          },
          {
            name: 'Department Management',
            route: (serviceType) => `/admin/institutions/${serviceType}/department_management`,
          },
        ],
      },
    ],
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
        icon: getIconComponent('LayoutDashboard'), // Corrected icon name
        route: (serviceType) => `/admin/dealing_Officer/${serviceType}/dashboard`,
      },
      {
        name: 'Accreditation Applications',
        icon: getIconComponent('CreditCard'),
        children: [
          {
            name: 'Institutional Accreditation',
            route: (serviceType) =>
              `/admin/dealing_officer/${serviceType}/institutional_accreditations`,
          },
          {
            name: 'Assign Assessor',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/assign_assessor`,
          },
          {
            name: 'Site Visit Scheduling',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/site_visit_scheduling`,
          },
          {
            name: 'Accreditation Assessment',
            icon: getIconComponent('ClipboardCheck'),
            route: (serviceType) =>
              `/admin/dealing_officer/${serviceType}/accreditation_assessment`,
          },
        ],
      },
      {
        name: 'Appeals Applications',
        icon: getIconComponent('CheckCircle'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/appeals`,
      },

      {
        name: 'Assessor Management',
        icon: getIconComponent('ClipboardCheck'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/assessor_management`,
      },

      {
        name: 'Reports',
        icon: getIconComponent('FileText'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/reports`,
      },
      {
        name: 'Payment History',
        icon: getIconComponent('CreditCard'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/payment_history`,
      },
    ],
    admin: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/admin/${serviceType}/dashboard`,
      },
      {
        name: 'Applications & Appeals',
        icon: getIconComponent('ClipboardList'),
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
          {
            name: 'Past Accreditations',
            icon: getIconComponent('History'),
            route: (serviceType) => `/admin/admin/${serviceType}/past_accreditations`,
          },
        ],
      },
      {
        name: 'Reports',
        icon: getIconComponent('FileBarChart'),
        route: (serviceType) => `/admin/admin/${serviceType}/reports`,
      },
      {
        name: 'Institutions',
        icon: getIconComponent('Building'),
        children: [
          {
            name: 'Manage Institutes',
            icon: getIconComponent('Building'),
            route: (serviceType) => `/admin/admin/${serviceType}/institute`,
          },
          {
            name: 'Assessor Pool',
            icon: getIconComponent('Users'),
            route: (serviceType) => `/admin/admin/${serviceType}/assessor_pool`,
          },
          {
            name: 'Institution Standards',
            icon: getIconComponent('Award'),
            route: (serviceType) => `/admin/admin/${serviceType}/institution_standards`,
          },
        ],
      },
      {
        name: 'Personnel',
        icon: getIconComponent('Users'),
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
          {
            name: 'Qualifications',
            icon: getIconComponent('GraduationCap'),
            route: (serviceType) => `/admin/admin/${serviceType}/qualification`,
          },
        ],
      },
      {
        name: 'Accreditation Setup',
        icon: getIconComponent('Settings'),
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
            name: 'Standards',
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
            name: 'Document Types',
            icon: getIconComponent('FileText'),
            route: (serviceType) => `/admin/admin/${serviceType}/document_type`,
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
