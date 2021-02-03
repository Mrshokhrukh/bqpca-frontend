// src/constants/navMenu.js
import {
  DollarSign,
  Edit,
  Globe,
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
} from 'lucide-vue-next'

// Icon mapping for dynamic icon selection
const iconMap = {
  DollarSign,
  Edit,
  Globe,
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
}

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
        name: 'Apply for RoQ',
        icon: getIconComponent('FileText'),
        route: (serviceType) => `/admin/user/${serviceType}/my_applications`,
      },
      {
        name: 'Apply for Second Copy',
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
        name: 'ECPF Application',
        icon: getIconComponent('CreditCard'),
        route: (serviceType) => `/admin/user/${serviceType}/my_applications`,
      },
    ],
    admin: [
      {
        name: 'Payment Types',
        icon: getIconComponent('CreditCard'),
        route: (serviceType) => `/admin/admin/${serviceType}/payment_types`,
      },
    ],
    // Add dealing_officer to ecpf
    dealing_officer: dealingOfficerMenuItems,
  },
  health_certification: {
    user: [
      {
        name: 'Dashboard',
        icon: getIconComponent('Dashboard'),
        route: (serviceType) => `/admin/user/${serviceType}/dashboard`,
      },
      {
        name: 'Practitioner Reg & Cert',
        icon: getIconComponent('Heart'),
        children: [
          {
            name: 'Registration Application',
            route: (serviceType) =>
              `/admin/user/${serviceType}/practitioner_reg_and_cert/registration`,
          },
          {
            name: 'Certificate Application',
            route: (serviceType) =>
              `/admin/user/${serviceType}/practitioner_reg_and_cert/certificate`,
          },
          {
            name: 'Renewal',
            // notification count
            route: (serviceType) => `/admin/user/${serviceType}/practitioner_reg_and_cert/renewal`,
          },
        ],
      },
      {
        name: 'Continuous Professional Development',
        icon: getIconComponent('BookOpen'),
        route: (serviceType) => `/admin/user/${serviceType}/cpd`,
      },
      {
        name: 'Certificate of Good Standing',
        icon: getIconComponent('Users'),
        route: (serviceType) => `/admin/user/${serviceType}/CoGS`,
      },
    ],
    admin: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/admin/${serviceType}/dashboard`,
      },
      {
        name: 'Practitioner Masters',
        icon: getIconComponent('Heart'),
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
            name: 'CPD Activities',
            route: (serviceType) => `/admin/admin/${serviceType}/cpd_activity`,
          },
          {
            name: 'Qualifications',
            route: (serviceType) => `/admin/admin/${serviceType}/qualifications`,
          },
          {
            name: 'Qualification Types',
            route: (serviceType) => `/admin/admin/${serviceType}/qualification_types`,
          },

          {
            name: 'Registration Types',
            route: (serviceType) => `/admin/admin/${serviceType}/registration_type`,
          },
        ],
      },
      {
        name: 'Settings Masters',
        icon: getIconComponent('Settings'),
        children: [
          {
            name: 'Document Types',
            route: (serviceType) => `/admin/admin/${serviceType}/document_types`,
          },
          {
            name: 'File Types',
            route: (serviceType) => `/admin/admin/${serviceType}/file_types`,
          },
          {
            name: 'e-Signatures',
            route: (serviceType) => `/admin/admin/${serviceType}/e_signatures`,
          },
          {
            name: 'Fees',
            route: (serviceType) => `/admin/admin/${serviceType}/fee_structures`,
          },
          {
            name: 'Fees Associated For',
            route: (serviceType) => `/admin/admin/${serviceType}/fees_associated_for`,
          },
          {
            name: 'Sector',
            route: (serviceType) => `/admin/admin/${serviceType}/sector`,
          },
          {
            name: 'Sub Categories',
            route: (serviceType) => `/admin/admin/${serviceType}/sub_categories`,
          },
          {
            name: 'University',
            route: (serviceType) => `/admin/admin/${serviceType}/university`,
          },
        ],
      },
      {
        name: 'Participation Masters',
        icon: getIconComponent('Users'),
        children: [
          {
            name: 'Participation Category',
            route: (serviceType) => `/admin/admin/${serviceType}/participation_category`,
          },
          {
            name: 'Participation Sub Category',
            route: (serviceType) => `/admin/admin/${serviceType}/participation_sub_category`,
          },
        ],
      },
      {
        name: 'Personnel',
        icon: getIconComponent('Briefcase'),
        children: [
          {
            name: 'Personnel Categories',
            route: (serviceType) => `/admin/admin/${serviceType}/personnel_categories`,
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
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/application_lists`,
      },
      {
        name: 'CPD Management',
        icon: getIconComponent('BookOpen'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/cpd_management`,
      },
      {
        name: 'Institute Management',
        icon: getIconComponent('Building2'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/institutes`,
      },
      {
        name: 'Professional Profiles',
        icon: getIconComponent('UserCircle'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/profiles`,
      },
      {
        name: 'CoGS Management',
        icon: getIconComponent('Users'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/cogs`,
      },
      {
        name: 'CAPA',
        icon: getIconComponent('Users'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/capa`,
      },
      {
        name: 'Payments',
        icon: getIconComponent('CreditCard'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/payments`,
      },

      {
        name: 'Reports',
        icon: getIconComponent('ClipboardCheck'),
        route: (serviceType) => `/admin/dealing_officer/${serviceType}/reports`,
      },
    ],
  },
  engineering_certification: {
    user: [
      {
        name: 'Engineering Certification',
        icon: getIconComponent('Wrench'),
        route: (serviceType) => `/admin/user/${serviceType}/my_applications`,
      },
    ],
    admin: [
      {
        name: 'Engineering Categories',
        icon: getIconComponent('Wrench'),
        route: (serviceType) => `/admin/admin/${serviceType}/categories`,
      },
    ],
    // Add dealing_officer to engineering_certification
    dealing_officer: dealingOfficerMenuItems,
  },
  accreditation: {
    user: [
      {
        name: 'Accreditation Application',
        icon: getIconComponent('Award'),
        route: (serviceType) => `/admin/user/${serviceType}/my_applications`,
      },
    ],
    admin: [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: (serviceType) => `/admin/admin/${serviceType}/dashboard`,
      },
      {
        name: 'Application Management',
        icon: getIconComponent('FileText'),
        children: [
          {
            name: 'Application Duration',
            icon: getIconComponent('Clock'),
            route: (serviceType) => `/admin/admin/${serviceType}/masters/application_duration`,
          },
        ],
      },
      {
        name: 'Appeal Management',
        icon: getIconComponent('XCircle'),
        children: [
          {
            name: 'Appeal Reasons',
            icon: getIconComponent('FileText'),
            route: (serviceType) => `/admin/admin/${serviceType}/masters/appeal_reason`,
          },
        ],
      },
      {
        name: 'Assessment',
        icon: getIconComponent('FileSearch'),
        children: [
          {
            name: 'Assessor Pool',
            icon: getIconComponent('Users'),
            route: (serviceType) => `/admin/admin/${serviceType}/masters/assessor_pool`,
          },
          {
            name: 'Indicators',
            icon: getIconComponent('FileSearch'),
            route: (serviceType) => `/admin/admin/${serviceType}/masters/indicators`,
          },
          {
            name: 'Key Aspects',
            icon: getIconComponent('BookOpen'),
            route: (serviceType) => `/admin/admin/${serviceType}/masters/key_aspects`,
          },
          {
            name: 'Standard',
            icon: getIconComponent('File'),
            route: (serviceType) => `/admin/admin/${serviceType}/masters/standard`,
          },
        ],
      },
      {
        name: 'Institute Management',
        icon: getIconComponent('Building2'),
        children: [
          {
            name: 'Institutes',
            icon: getIconComponent('Building2'),
            route: (serviceType) => `/admin/admin/${serviceType}/masters/institute`,
          },
          {
            name: 'Source of Funding',
            icon: getIconComponent('DollarSign'),
            route: (serviceType) => `/admin/admin/${serviceType}/masters/source_of_funding`,
          },
        ],
      },
      {
        name: 'Configuration',
        icon: getIconComponent('Settings'),
        children: [
          {
            name: 'e-Signature',
            icon: getIconComponent('Edit'),
            route: (serviceType) => `/admin/admin/${serviceType}/masters/e_signature`,
          },
          {
            name: 'Fees',
            icon: getIconComponent('CreditCard'),
            route: (serviceType) => `/admin/admin/${serviceType}/masters/fees`,
          },
          {
            name: 'Rating Category',
            icon: getIconComponent('Award'),
            route: (serviceType) => `/admin/admin/${serviceType}/masters/rating_category`,
          },
        ],
      },
      {
        name: 'HR',
        icon: getIconComponent('Users'),
        children: [
          {
            name: 'Employee Category',
            icon: getIconComponent('Briefcase'),
            route: (serviceType) => `/admin/admin/${serviceType}/masters/employee_category`,
          },
          {
            name: 'Employee Type',
            icon: getIconComponent('UserCircle'),
            route: (serviceType) => `/admin/admin/${serviceType}/masters/employee_type`,
          },
          {
            name: 'Staff Type',
            icon: getIconComponent('Users'),
            route: (serviceType) => `/admin/admin/${serviceType}/masters/staff_type`,
          },
        ],
      },
      {
        name: 'Decision Management',
        icon: getIconComponent('CheckCircle'),
        children: [
          {
            name: 'Decisions',
            icon: getIconComponent('CheckCircle'),
            route: (serviceType) => `/admin/admin/${serviceType}/masters/decision`,
          },
          {
            name: 'Decision Classes',
            icon: getIconComponent('Layers'),
            route: (serviceType) => `/admin/admin/${serviceType}/masters/decision_classes`,
          },
        ],
      },
      {
        name: 'Qualification',
        icon: getIconComponent('Award'),
        route: (serviceType) => `/admin/admin/${serviceType}/masters/qualification`,
      },
      {
        name: 'Document',
        icon: getIconComponent('ClipboardCheck'),
        route: (serviceType) => `/admin/admin/${serviceType}/masters/document`,
      },
      {
        name: 'Reports',
        icon: getIconComponent('ClipboardCheck'),
        route: (serviceType) => `/admin/admin/${serviceType}/reports`,
      },
    ],
    // Add dealing_officer to accreditation
    dealing_officer: dealingOfficerMenuItems,
  },
}

/**
 * Generates navigation items based on the service type and role.
 * @param {string} role - The user's role (e.g., 'user', 'admin').
 * @param {string} serviceType - The service type (e.g., 'roq', 'ecpf').
 * @returns {Array} - An array of navigation items for the given role and service type.
 */
export const generateNavigationItems = (role, serviceType) => {
  if (!role || !serviceType) return []

  const serviceMenu = serviceSpecificMenuItems[serviceType]
  if (!serviceMenu || !serviceMenu[role]) return []

  // Process the menu items to resolve dynamic routes
  const processMenuItem = (item) => {
    const newItem = {
      ...item,
      route: typeof item.route === 'function' ? item.route(serviceType) : item.route,
    }
    if (newItem.children) {
      newItem.children = newItem.children.map((child) => processMenuItem(child))
    }
    return newItem
  }

  return serviceMenu[role].map(processMenuItem)
}
