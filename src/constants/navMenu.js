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
  Heart, // Used for Teaching Hospital child
  Wrench,
  // Used for Maintenance section items (alternative)
  Award,
  FilePlus,
  List,
  RefreshCw, // Used for Track & Renewal
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
  Layers, // Used for Department Management
  Target,
  Key,
  Star,
  Scroll,
  PenTool,
  DollarSign,
  Wallet,
  GraduationCap, // Used for Course Management
  Sliders,
  Activity,
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
  Activity,
}
import { useHealthCertificationStore } from '@/stores/mhpcNavigationStore' // Ensure this path is correct
import { useEngineeringCertificationStore } from '@/stores/engineeringNavigationStore'

// Helper function to get the icon component
const getIconComponent = (iconName) => {
  return iconMap[iconName] || File // Defaults to File if iconName not in map
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
    // ... (ROQ section unchanged) ...
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
        name: 'Esignatures',
        icon: getIconComponent('PenTool'), // Changed from Users
        route: (serviceType) => `/admin/admin/${serviceType}/esign`,
      },
    ],
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
    ],
  },
  ecpf: {
    // ... (ECPF section unchanged) ...
    user: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/user/${serviceType}/dashboard`,
      },
      {
        name: 'New Applications',
        icon: getIconComponent('FilePlus'),
        children: [
          {
            name: 'Independant ECPF',
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
        icon: getIconComponent('RefreshCw'),
        route: (serviceType) => `/admin/user/${serviceType}/ecpf_renewal`,
      },
      {
        name: 'ECPF Name Change',
        icon: getIconComponent('Edit'),
        route: (serviceType) => `/admin/user/${serviceType}/ecpf_name_change`,
      },
      {
        name: 'Location Change',
        icon: getIconComponent('Building'),
        route: (serviceType) => `/admin/user/${serviceType}/ecpf_location_change`,
      },
      {
        name: 'Change in Ownership',
        icon: getIconComponent('Users2'),
        route: (serviceType) => `/admin/user/${serviceType}/ecpf_ownership_change`,
      },
      {
        name: 'Linkage Establishment',
        icon: getIconComponent('Link'),
        route: (serviceType) => `/admin/user/${serviceType}/ecpf_linkage_establishment`,
      },
      {
        name: 'Education Fair',
        icon: getIconComponent('Briefcase'),
        route: (serviceType) => `/admin/user/${serviceType}/ecpf_education_fair`,
      },
      {
        name: 'Promotional Event',
        icon: getIconComponent('Activity'),
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
        icon: getIconComponent('Users'),
        route: (serviceType) => `/admin/user/${serviceType}/hr_biodata`,
      },
      {
        name: 'Student Management',
        icon: getIconComponent('GraduationCap'),
        route: (serviceType) => `/admin/user/${serviceType}/student_biodata`,
      },
      {
        name: 'Profile',
        icon: getIconComponent('UserCircle'),
        route: (serviceType) => `/admin/user/${serviceType}/profile`,
      },
      {
        name: 'Track My Applications',
        icon: getIconComponent('FileSearch'),
        route: (serviceType) => `/admin/user/${serviceType}/track_applications`,
      },
      {
        name: 'Upload Trade License',
        icon: getIconComponent('FilePlus'),
        route: (serviceType) => `/admin/user/${serviceType}/upload_trade_license`,
      },
      {
        name: 'Non-Compliance Records',
        icon: getIconComponent('XCircle'),
        route: (serviceType) => `/admin/user/${serviceType}/non_compliance_records`,
      },
    ],
    admin: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/admin/${serviceType}/dashboard`,
      },
      {
        name: 'Non-Compliance',
        icon: getIconComponent('ClipboardList'),
        route: (serviceType) => `/admin/admin/${serviceType}/compliance_action`,
      },
      {
        name: 'Non-Compliance Admin Action Taken',
        icon: getIconComponent('CheckSquare'),
        route: (serviceType) => `/admin/admin/${serviceType}/compliance_action_taken`,
      },
      {
        name: 'Decisions',
        icon: getIconComponent('Scale'),
        route: (serviceType) => `/admin/admin/${serviceType}/ecpf_decisions`,
      },
      {
        name: 'Qualifications',
        icon: getIconComponent('GraduationCap'),
        route: (serviceType) => `/admin/admin/${serviceType}/qualifications`,
      },
      {
        name: 'Infrastructures',
        icon: getIconComponent('Building2'),
        route: (serviceType) => `/admin/admin/${serviceType}/infrastructures`,
      },
      {
        name: 'Institutes',
        icon: getIconComponent('Building'),
        route: (serviceType) => `/admin/admin/${serviceType}/institutes`,
      },
      {
        name: 'Issue Compliances',
        icon: getIconComponent('FileText'),
        route: (serviceType) => `/admin/admin/${serviceType}/issue_compliances`,
      },
      {
        name: 'Positions',
        icon: getIconComponent('UserCircle'),
        route: (serviceType) => `/admin/admin/${serviceType}/positions`,
      },
      {
        name: 'Promotional Event Types',
        icon: getIconComponent('Star'),
        route: (serviceType) => `/admin/admin/${serviceType}/promotional_event_types`,
      },
      {
        name: 'Service Categories',
        icon: getIconComponent('Layers'),
        route: (serviceType) => `/admin/admin/${serviceType}/service_categories`,
      },
      {
        name: 'Status',
        icon: getIconComponent('Sliders'),
        route: (serviceType) => `/admin/admin/${serviceType}/status`,
      },
      {
        name: 'Types of Firms',
        icon: getIconComponent('Briefcase'),
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
        icon: getIconComponent('FileText'),
        children: [
          {
            name: 'Independant ECPF Applications',
            icon: getIconComponent('UserCircle'),
            route: (serviceType) =>
              `/admin/dealing_officer/${serviceType}/individual_ecpf_applications`,
          },
          {
            name: 'Collaborated ECPF Applications',
            icon: getIconComponent('Users2'),
            route: (serviceType) =>
              `/admin/dealing_officer/${serviceType}/collaborated_ecpf_applications`,
          },
          {
            name: 'New Branch Applications',
            icon: getIconComponent('Building2'),
            route: (serviceType) =>
              `/admin/dealing_officer/${serviceType}/branch_ecpf_applications`,
          },
          {
            name: 'Renewal Applications',
            icon: getIconComponent('RefreshCw'),
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/renewal_applications`,
          },
        ],
      },
      {
        name: 'Change Requests',
        icon: getIconComponent('Edit'),
        children: [
          {
            name: 'ECPF Name Change',
            icon: getIconComponent('PenTool'),
            route: (serviceType) =>
              `/admin/dealing_officer/${serviceType}/name_change_applications`,
          },
          {
            name: 'ECPF Location Change',
            icon: getIconComponent('Building'),
            route: (serviceType) =>
              `/admin/dealing_officer/${serviceType}/location_change_applications`,
          },
          {
            name: 'ECPF Ownership Change',
            icon: getIconComponent('Users'),
            route: (serviceType) =>
              `/admin/dealing_officer/${serviceType}/ownership_change_applications`,
          },
        ],
      },
      {
        name: 'Events',
        icon: getIconComponent('Briefcase'),
        children: [
          {
            name: 'Education Fair Applications',
            icon: getIconComponent('GraduationCap'),
            route: (serviceType) =>
              `/admin/dealing_officer/${serviceType}/education_fair_applications`,
          },
          {
            name: 'Mass Media Event Applications',
            icon: getIconComponent('Monitor'),
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/mass_media_applications`,
          },
          {
            name: 'In House Event Applications',
            icon: getIconComponent('Building'),
            route: (serviceType) =>
              `/admin/dealing_officer/${serviceType}/in_house_event_applications`,
          },
          {
            name: 'Hei Visit Applications',
            icon: getIconComponent('Building2'),
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/hei_visit_applications`,
          },
        ],
      },
      {
        name: 'ECPF Linkages',
        icon: getIconComponent('Link'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/ecpf_link_establishment`,
      },
      {
        name: 'Bio Data',
        icon: getIconComponent('Users'),
        children: [
          {
            name: 'Add HR',
            icon: getIconComponent('UserPlus'),
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/add_hr`,
          },
          {
            name: 'Add Student',
            icon: getIconComponent('UserPlus'),
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/add_student`,
          },
        ],
      },
      {
        name: 'Non-Complaince Record',
        icon: getIconComponent('XCircle'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/non_compliance_records`,
      },
      {
        name: 'Reports',
        icon: getIconComponent('FileBarChart'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/ecpf_reports`,
      },
      {
        name: 'Payments',
        icon: getIconComponent('CreditCard'),
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
        icon: getIconComponent('FileText'),
        children: [
          {
            name: 'Independant ECPF Applications',
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
        icon: getIconComponent('Edit'),
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
        icon: getIconComponent('Briefcase'),
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
        icon: getIconComponent('Link'),
        route: (serviceType) => `/admin/chief/${serviceType}/ecpf_link_establishment`,
      },
      {
        name: 'Bio Data',
        icon: getIconComponent('Users'),
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
        icon: getIconComponent('XCircle'),
        route: (serviceType) => `/admin/chief/${serviceType}/non_compliance_records`,
      },
      {
        name: 'Reports',
        icon: getIconComponent('FileBarChart'),
        route: (serviceType) => `/admin/chief/${serviceType}/ecpf_reports`,
      },
      {
        name: 'Payments',
        icon: getIconComponent('CreditCard'),
        route: (serviceType) => `/admin/chief/${serviceType}/ecpf_payment_history`,
      },
    ],
  },
  // changes made to be visible in all the branches
  health_certification: {
    user: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/user/${serviceType}/dashboard`,
        // Controlled by: visibleMenus.baseMenus.dashboard
        hidden: () => {
          const store = useHealthCertificationStore()
          return !store.visibleMenus.baseMenus.dashboard
        },
      },
      {
        name: 'Registration Services',
        icon: getIconComponent('ClipboardCheck'),
        // Controlled by: visibleMenus.baseMenus.certification
        hidden: () => {
          const store = useHealthCertificationStore()
          return !store.visibleMenus.baseMenus.certification
        },
        // The children are dynamically generated based on the user's state
        children: () => {
          const store = useHealthCertificationStore()
          const items = []

          // Shows 'Apply for Registration' based on the corresponding flag.
          // Visible for new users or users who can add more qualifications.
          if (store.visibleMenus.certificationSubMenus.applyForCertification) {
            items.push({
              name: 'Apply for Registration',
              route: (serviceType) => `/admin/user/${serviceType}/registration`,
            })
          }

          // Shows 'Track My Registration' if the user has a submitted application.
          if (store.visibleMenus.certificationSubMenus.myApplications) {
            items.push({
              name: 'Track My Registration',
              route: (serviceType) => `/admin/user/${serviceType}/my_applications`,
            })
          }

          // Shows the renewal link only during the renewal period or if expired.
          if (store.visibleMenus.certificationSubMenus.renewal) {
            items.push({
              // DYNAMIC NAME: The text changes based on the 'isExpired' flag.
              name: store.visibleMenus.isExpired ? 'Re-registration' : 'Registration Renewal',
              route: (serviceType) => `/admin/user/${serviceType}/renewal`,
              // DYNAMIC BADGE: Shows an "In Progress" badge if a renewal is pending.
              badge: store.visibleMenus.hasRenewalInProgress ? 'In Progress' : null,
            })
          }

          // Shows 'Additional Qualification' for users with an approved status.
          if (store.visibleMenus.certificationSubMenus.additionalQualification) {
            items.push({
              name: 'Additional Qualification Registration',
              route: (serviceType) => `/admin/user/${serviceType}/additional_qualification`,
            })
          }
          return items
        },
      },
      {
        name: 'CPD Services',
        icon: getIconComponent('BookOpen'),
        // Controlled by: visibleMenus.baseMenus.cpdManagement
        hidden: () => {
          const store = useHealthCertificationStore()
          return !store.visibleMenus.baseMenus.cpdManagement
        },
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
        name: 'CoGS Services',
        icon: getIconComponent('Award'),
        // Controlled by: visibleMenus.baseMenus.cogsManagement
        hidden: () => {
          const store = useHealthCertificationStore()
          return !store.visibleMenus.baseMenus.cogsManagement
        },
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
        name: 'Counselor Services',
        icon: getIconComponent('Users'),
        // Controlled by: visibleMenus.baseMenus.counselorManagement
        hidden: () => {
          const store = useHealthCertificationStore()
          return !store.visibleMenus.baseMenus.counselorManagement
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
        icon: getIconComponent('UserCircle'),
        route: (serviceType) => `/admin/user/${serviceType}/user_profile`,
        // Controlled by: visibleMenus.baseMenus.profile
        hidden: () => {
          const store = useHealthCertificationStore()
          return !store.visibleMenus.baseMenus.profile
        },
      },
      {
        name: 'Complaints',
        icon: getIconComponent('AlertTriangle'),
        route: (serviceType) => `/admin/user/${serviceType}/complains`,
      },
    ],
    admin: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/admin/${serviceType}/dashboard`,
      },
      {
        name: 'CPD Management',
        icon: getIconComponent('BookOpen'),
        children: [
          {
            name: 'CPD Activities',
            route: (serviceType) => `/admin/admin/${serviceType}/cpd_activities`,
          },
          {
            name: 'CPD Credits',
            route: (serviceType) => `/admin/admin/${serviceType}/cpd_credits`,
          },
          {
            name: 'CPD Methodologies',
            route: (serviceType) => `/admin/admin/${serviceType}/cpd_methodologies`,
          },
        ],
      },
      {
        name: 'Document Management',
        icon: getIconComponent('Folder'),
        children: [
          {
            name: 'Document Types',
            route: (serviceType) => `/admin/admin/${serviceType}/document_types`,
          },
          {
            name: 'E-Signatures',
            route: (serviceType) => `/admin/admin/${serviceType}/e_signatures`,
          },
        ],
      },
      {
        name: 'Fee Management',
        icon: getIconComponent('DollarSign'),
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
        icon: getIconComponent('Users2'),
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
            name: 'PersonnelSubCategory',
            route: (serviceType) => `/admin/admin/${serviceType}/MastersPersonnelSubCategory`,
          },
          {
            name: 'Qualification Types',
            route: (serviceType) => `/admin/admin/${serviceType}/qualification_types`,
          },
          {
            name: 'Qualifications',
            route: (serviceType) => `/admin/admin/${serviceType}/qualifications`,
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
        ],
      },
      {
        name: 'University',
        icon: getIconComponent('GraduationCap'),
        route: (serviceType) => `/admin/admin/${serviceType}/university`,
      },
      {
        name: 'COGS Management',
        icon: getIconComponent('Award'),
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
        name: 'Registration Services',
        icon: getIconComponent('FileText'),
        children: [
          {
            name: 'Initial Application Lists',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/application_lists`,
          },
          {
            name: 'Additional Qualification Lists',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/additional_application`,
          },
          {
            name: 'Renewal Application Lists',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/renewal_lists`,
          },
          {
            name: 'CoGS Management',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/cogs`,
          },
        ],
      },
      {
        name: 'CPD Services',
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
            name: 'Module Management',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/module_management`,
          },
          {
            name: 'Faculty Management',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/faculty_management`,
          },
          {
            name: 'Preceptor Management',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/preceptor_management`,
          },
          {
            name: 'Program Management',
            route: (serviceType) =>
              `/admin/dealing_officer/${serviceType}/education_program_management`,
          },
          {
            name: 'Faculty Program Assignment',
            route: (serviceType) =>
              `/admin/dealing_officer/${serviceType}/faculty_program_assignment`,
          },

          // {
          //   name: 'Reports',
          //   route: (serviceType) => `/admin/dealing_officer/${serviceType}/institute_report`,
          // },
        ],
      },
      {
        name: 'Professional Profiles',
        icon: getIconComponent('UserCircle'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/profiles`,
      },
      {
        name: 'Counselor Application',
        icon: getIconComponent('Users'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/counselor_application`,
      },
      {
        name: 'Reports',
        icon: getIconComponent('BookOpen'),
        children: [
          {
            name: 'Professional Reports',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/reports`,
          },
          {
            name: 'Institute Reports',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/institute_reports`,
          },
          {
            name: 'Teacching Hospital Reports',
            route: (serviceType) =>
              `/admin/dealing_officer/${serviceType}/teaching_hospital_reports`,
          },
          {
            name: 'CPD Reports',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/cpd_reports`,
          },

          {
            name: 'Cogs Reports',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/cogs_reports`,
          },
          {
            name: 'Payment History',
            icon: getIconComponent('CreditCard'),
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/payments`,
          },
        ],
      },
    ],
    cme_cpd_provider: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/cme_cpd_provider/${serviceType}/dashboard`,
      },
      {
        name: 'Apply New CPD',
        icon: getIconComponent('FilePlus'),
        route: (serviceType) => `/admin/cme_cpd_provider/${serviceType}/cpd_application_details`,
      },
      {
        name: 'Track Applications',
        icon: getIconComponent('FileSearch'),
        route: (serviceType) => `/admin/cme_cpd_provider/${serviceType}/cpd_application_tracker`,
      },
      {
        name: 'CPD approved Add Participants',
        icon: getIconComponent('UserPlus'),
        route: (serviceType) =>
          `/admin/cme_cpd_provider/${serviceType}/cpd_approved_add_participants`,
      },
    ],
    institutions: [
      {
        name: 'Dashboard New',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/institutions/${serviceType}/dashboard`,
      },

      {
        name: 'EOI Management',
        icon: getIconComponent('FileText'),
        route: (serviceType) => `/admin/institutions/${serviceType}/track_eoi`,
      },
      {
        name: 'DPR Management',
        icon: getIconComponent('FileText'),
        route: (serviceType) => `/admin/institutions/${serviceType}/track_dpr`,
      },
      {
        name: 'Institute Profile',
        icon: getIconComponent('Building'),
        children: [
          {
            name: 'Profile',
            icon: getIconComponent('UserCircle'),
            route: (serviceType) => `/admin/institutions/${serviceType}/institution_profile`,
          },
          {
            name: 'Institute Renewal',
            icon: getIconComponent('RefreshCw'),
            route: (serviceType) => `/admin/institutions/${serviceType}/institutes_renewal`,
          },

          {
            name: 'CAPA',
            icon: getIconComponent('ClipboardCheck'),
            route: (serviceType) => `/admin/institutions/${serviceType}/my_capa`,
          },
          {
            name: 'Apply New Education Program ',
            icon: getIconComponent('BookOpen'),
            route: (serviceType) =>
              `/admin/institutions/${serviceType}/new_education_program_application`,
          },
          {
            name: 'Faculty Management',
            icon: getIconComponent('Users'),
            route: (serviceType) => `/admin/institutions/${serviceType}/staff_management`,
          },
          {
            name: 'Education Program Management',
            icon: getIconComponent('BookOpen'),
            route: (serviceType) => `/admin/institutions/${serviceType}/new_education_program`,
          },
        ],
      },
      {
        name: 'Teaching Hospital',
        icon: getIconComponent('GraduationCap'),
        children: [
          {
            name: 'Teaching Hospital Management',
            icon: getIconComponent('Building2'),
            route: (serviceType) => `/admin/institutions/${serviceType}/teaching_center_tracking`,
          },
          {
            name: 'Renew Teaching Hospital',
            icon: getIconComponent('RefreshCw'),
            route: (serviceType) => `/admin/institutions/${serviceType}/renewal_teaching_hospital`,
          },
          {
            name: 'Site Visit Schedule',
            icon: getIconComponent('Heart'),
            route: (serviceType) => `/admin/institutions/${serviceType}/site_visit_schedule`,
          },
        ]
      },
    ],
    legal_officer: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/legal_officer/${serviceType}/dashboard`,
      },
      {
        name: 'Manage Compliants',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/legal_officer/${serviceType}/manage_complaints`,
      },
    ],
  },
  engineering_certification: {
    // ... (User, Admin, Dealing Officer, etc. sections for engineering_certification unchanged) ...
    user: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/user/${serviceType}/dashboard`,
        hidden: () => {
          const store = useEngineeringCertificationStore()
          return !store.visibleMenus.baseMenus.dashboard
        },
      },
      {
        name: 'Certification',
        icon: getIconComponent('ClipboardCheck'),
        hidden: () => {
          const store = useEngineeringCertificationStore()
          return !store.visibleMenus.baseMenus.certification
        },
        children: () => {
          const store = useEngineeringCertificationStore()
          const items = []

          console.log('Building certification menu. Store state:', {
            registration: store.visibleMenus.certificationSubMenus.registration,
            myApplications: store.visibleMenus.certificationSubMenus.myApplications,
            renewal: store.visibleMenus.certificationSubMenus.renewal,
            additionalQualification:
              store.visibleMenus.certificationSubMenus.additionalQualification,
            hasSubmittedApplication: store.hasSubmittedApplication,
            hasApprovedQualification: store.hasApprovedQualification,
          })

          // Show Registration only for new users (before any application submission)
          if (store.visibleMenus.certificationSubMenus.registration) {
            items.push({
              name: 'Registration',
              route: (serviceType) => `/admin/user/${serviceType}/registration`,
            })
          }

          // Show My Applications if user has submitted any application
          if (store.visibleMenus.certificationSubMenus.myApplications) {
            items.push({
              name: 'My Applications',
              route: (serviceType) => `/admin/user/${serviceType}/my_applications`,
            })
          }

          // Show Renewal option if within renewal period (including expired)
          if (store.visibleMenus.certificationSubMenus.renewal) {
            const renewalItem = {
              name: 'Renewal',
              route: (serviceType) => `/admin/user/${serviceType}/renewal`,
            }

            // Add badge if qualification is expired
            if (store.hasExpiredQualification) {
              renewalItem.badge = 'Required'
              renewalItem.class = 'text-red-600 font-semibold'
            } else if (store.hasPendingRenewalApplication) {
              renewalItem.badge = 'In Progress'
            }

            items.push(renewalItem)
          }

          // Show Additional Qualification for any user who has submitted an application
          // This allows them to add more qualifications or resubmit if they forgot documents
          if (store.visibleMenus.certificationSubMenus.additionalQualification) {
            items.push({
              name: 'Additional Qualification',
              route: (serviceType) => `/admin/user/${serviceType}/additional_qualification`,
            })
          }

          console.log('Built certification menu items:', items)
          return items
        },
      },
      {
        name: 'CPD Management',
        icon: getIconComponent('BookOpen'),
        hidden: () => {
          const store = useEngineeringCertificationStore()
          return !store.visibleMenus.baseMenus.cpdManagement
        },
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
        icon: getIconComponent('Award'),
        hidden: () => {
          const store = useEngineeringCertificationStore()
          return !store.visibleMenus.baseMenus.cogsManagement
        },
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
        hidden: () => {
          const store = useEngineeringCertificationStore()
          return !store.visibleMenus.baseMenus.profile
        },
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
        icon: getIconComponent('BookOpen'),
        children: [
          {
            name: 'CPD Activities',
            route: (serviceType) => `/admin/admin/${serviceType}/cpd_activities`,
          },
          {
            name: 'CPD Credits',
            route: (serviceType) => `/admin/admin/${serviceType}/cpd_credits`,
          },
          {
            name: 'CPD Methodologies',
            route: (serviceType) => `/admin/admin/${serviceType}/cpd_methodologies`,
          },
          {
            name: 'CPD Activity',
            route: (serviceType) => `/admin/admin/${serviceType}/cpd_activity`,
          },
          {
            name: 'Reason for Conducting CPD',
            route: (serviceType) => `/admin/admin/${serviceType}/master_cpd_reason_for_conducting`,
          },
          {
            name: 'CPD Providing Agency',
            route: (serviceType) => `/admin/admin/${serviceType}/master_cpd_providing_agency`,
          },
        ],
      },
      {
        name: 'User Management',
        icon: getIconComponent('Users'),
        children: [
          {
            name: 'Users',
            route: (serviceType) => `/admin/admin/${serviceType}/user_management`,
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
            name: 'Qualification Types',
            route: (serviceType) => `/admin/admin/${serviceType}/qualification_types`,
          },
          {
            name: 'Qualifications',
            route: (serviceType) => `/admin/admin/${serviceType}/qualifications`,
          },
        ],
      },
      {
        name: 'Registration',
        icon: getIconComponent('ClipboardCheck'),
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
        icon: getIconComponent('Settings'),
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
            name: 'Fees Associated For',
            route: (serviceType) => `/admin/admin/${serviceType}/fees_associated_for`,
          },
          {
            name: 'Fee Structures',
            route: (serviceType) => `/admin/admin/${serviceType}/fee_structures`,
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
    cme_cpd_provider: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/cme_cpd_provider/${serviceType}/dashboard`,
      },
      {
        name: 'CPD Application',
        icon: getIconComponent('FilePlus'),
        route: (serviceType) => `/admin/cme_cpd_provider/${serviceType}/cpd_application_details`,
      },
      {
        name: 'Track Applications',
        icon: getIconComponent('FileSearch'),
        route: (serviceType) => `/admin/cme_cpd_provider/${serviceType}/cpd_application_tracker`,
      },
      {
        name: 'Add Participants',
        icon: getIconComponent('UserPlus'),
        route: (serviceType) =>
          `/admin/cme_cpd_provider/${serviceType}/cpd_approved_add_participants`,
      },
      // {
      //   name: 'Profile',
      //   icon: getIconComponent('UserCircle'),
      //   route: (serviceType) => `/admin/cme_cpd_provider/${serviceType}/cme_cpd_provider_profile`,
      // },
    ],
    institutions: [
      // MODIFIED SECTION for engineering_certification.institutions
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/institutions/${serviceType}/dashboard`,
      },
      {
        name: 'EOI Management',
        icon: getIconComponent('FileText'),
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
        icon: getIconComponent('FileText'),
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
        name: 'Institute Management', // Parent Item
        icon: getIconComponent('Building'),
        children: [
          {
            name: 'Institute Renewal',
            icon: getIconComponent('RefreshCw'),
            route: (serviceType) => `/admin/institutions/${serviceType}/institutes_renewal`,
          },
          // Flattened children of former "Teaching Institutes"
          {
            name: 'New Teaching Institute', // R
            icon: getIconComponent('Building2'),
            route: (serviceType) =>
              `/admin/institutions/${serviceType}/teaching_center_application`,
          },
          {
            name: 'Track & Renew Teaching Institute', // Renamed for clarity
            icon: getIconComponent('RefreshCw'),
            route: (serviceType) =>
              `/admin/institutions/${serviceType}/teaching_center_track_and_renew`,
          },
          {
            name: 'New Education Program',
            icon: getIconComponent('BookOpen'),
            route: (serviceType) => `/admin/institutions/${serviceType}/new_education_program`,
          },
          // Other direct children
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
          // Flattened children of former "Maintenance"
          // {
          //   name: 'Faculty Management',
          //   icon: getIconComponent('Users'),
          //   route: (serviceType) => `/admin/institutions/${serviceType}/staff_management`,
          // },
          // {
          //   name: 'Module Management',
          //   icon: getIconComponent('GraduationCap'),
          //   route: (serviceType) => `/admin/institutions/${serviceType}/course_management`,
          // },
          // {
          //   name: 'Department Management',
          //   icon: getIconComponent('Layers'),
          //   route: (serviceType) => `/admin/institutions/${serviceType}/department_management`,
          // },
        ],
      },
    ],
  },
  accreditation: {
    // ... (Accreditation section unchanged) ...
    user: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/user/${serviceType}/dashboard`,
      },
      {
        name: 'Create Institue Profile',
        icon: getIconComponent('Building'),
        route: (serviceType) => `/admin/user/${serviceType}/institute_profile`,
      },
      {
        name: 'Accreditation',
        icon: getIconComponent('Award'),
        children: [
          {
            name: 'Apply for Accreditation',
            icon: getIconComponent('FilePlus'),
            route: (serviceType) => `/admin/user/${serviceType}/apply_for_accreditation`,
          },
          {
            name: 'Track Application',
            icon: getIconComponent('FilePlus'),
            route: (serviceType) => `/admin/user/${serviceType}/track_accreditation`,
          },
          // {
          //   name: 'Track ISAR Report',
          //   icon: getIconComponent('FilePlus'),
          //   route: (serviceType) => `/admin/user/${serviceType}/track_isar_reports`,
          // },
          {
            name: 'CoI Confirmation',
            icon: getIconComponent('CheckSquare'),
            route: (serviceType) => `/admin/user/${serviceType}/coi_confirmation`,
          },
          {
            name: 'Site Visit',
            icon: getIconComponent('Building2'),
            route: (serviceType) => `/admin/user/${serviceType}/site_visit_confirmation`,
          },
        ],
      },
      {
        name: 'Appeal for Accreditation',
        icon: getIconComponent('History'),
        route: (serviceType) => `/admin/user/${serviceType}/appeal`,
      },

      // {
      //   name: 'Profile',
      //   icon: getIconComponent('UserCircle'),
      //   children: [
      //     {
      //       name: 'Institute Profile',
      //       icon: getIconComponent('Building'),
      //       route: (serviceType) => `/admin/user/${serviceType}/profile`,
      //     },
      //     {
      //       name: 'User Profile',
      //       icon: getIconComponent('Users'), // Corrected from User
      //       route: (serviceType) => `/admin/user/${serviceType}/user_profile`, // Corrected "usser" to "user"
      //     },
      //   ],
      // },
    ],
    dealing_officer: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/dashboard`, // Corrected "dealing_Officer"
      },
      {
        name: 'Manage Accreditation Schedule',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) =>
          `/admin/dealing_officer/${serviceType}/manage_accreditation_schedule`, // Corrected "dealing_Officer"
      },
      {
        name: 'Accreditation Applications',
        icon: getIconComponent('ClipboardList'),
        children: [
          {
            name: 'Initial Accreditation Application',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/initial_accreditations`,
          },

          {
            name: 'ISAR Report',
            route: (serviceType) => `/admin/dealing_officer/${serviceType}/isar_reports`,
          },
          // {
          //   name: 'Assign Assessor',
          //   route: (serviceType) => `/admin/dealing_officer/${serviceType}/assign_assessor`,
          // },
          // {
          //   name: 'Site Visit Scheduling',
          //   route: (serviceType) => `/admin/dealing_officer/${serviceType}/site_visit_scheduling`,
          // },
          // {
          //   name: 'Accreditation Assessment',
          //   icon: getIconComponent('CheckSquare'),
          //   route: (serviceType) =>
          //     `/admin/dealing_officer/${serviceType}/accreditation_assessment`,
          // },
        ],
      },
      {
        name: 'Appeals Applications',
        icon: getIconComponent('History'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/appeals`,
      },
      {
        name: 'Assessor Management',
        icon: getIconComponent('Users'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/assessor_management`,
      },
      {
        name: 'Reports',
        icon: getIconComponent('FileBarChart'),
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
            icon: getIconComponent('FileText'),
            route: (serviceType) => `/admin/admin/${serviceType}/application_lists`,
          },
          {
            name: 'Appeals',
            icon: getIconComponent('History'),
            route: (serviceType) => `/admin/admin/${serviceType}/appeal_lists`,
          },
          {
            name: 'Past Accreditations',
            icon: getIconComponent('History'), // Or Archive if available
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
            icon: getIconComponent('Building2'),
            route: (serviceType) => `/admin/admin/${serviceType}/institute`,
          },
          {
            name: 'Assessor Pool',
            icon: getIconComponent('Users2'),
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
            icon: getIconComponent('List'),
            route: (serviceType) => `/admin/admin/${serviceType}/employee_category`,
          },
          {
            name: 'Employee Types',
            icon: getIconComponent('Briefcase'),
            route: (serviceType) => `/admin/admin/${serviceType}/employee_type`,
          },
          {
            name: 'Staff Types',
            icon: getIconComponent('Users'),
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
    assessor: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/assessor/${serviceType}/dashboard`,
      },

      {
        name: 'My Assignments ',
        icon: getIconComponent('ShieldQuestion'), // Using a specific icon for clarity
        route: (serviceType) => `/admin/assessor/${serviceType}/my_assignments`,
      },

      {
        name: 'Submit Reports',
        icon: getIconComponent('FilePlus'),
        route: (serviceType) => `/admin/assessor/${serviceType}/upload_report`,
      },
    ],
  },
}

/**
 * Generates navigation items based on the service type and role.
 * @param {string} role
 * @param {string} serviceType
 * @returns {Array}
 */
export const generateNavigationItems = (role, serviceType) => {
  if (!role || !serviceType) return []

  const serviceMenu = serviceSpecificMenuItems[serviceType]
  if (!serviceMenu || !serviceMenu[role]) return []

  const processMenuItem = (item) => {
    let isHidden = false
    if (typeof item.hidden === 'function') {
      isHidden = item.hidden()
    } else if (typeof item.hidden === 'boolean') {
      isHidden = item.hidden
    }

    if (isHidden) {
      return null
    }

    const newItem = {
      ...item,
      route: typeof item.route === 'function' ? item.route(serviceType) : item.route,
    }

    if (newItem.children) {
      const childItems =
        typeof newItem.children === 'function' ? newItem.children() : newItem.children

      newItem.children = childItems
        .map((child) => processMenuItem(child))
        .filter((child) => child !== null)

      if (newItem.children.length === 0 && !newItem.route) {
        return null
      }
    }
    return newItem
  }

  return serviceMenu[role].map(processMenuItem).filter((item) => item !== null)
}
