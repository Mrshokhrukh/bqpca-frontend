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
} from 'lucide-vue-next';

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
};

// Helper function to get the icon component
const getIconComponent = (iconName) => {
  return iconMap[iconName] || File;
};

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
];

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
        name: 'Dashboard',
        icon: getIconComponent('FilePlus'),
        route: (serviceType) => `/admin/user/${serviceType}/dashboard`,
      },
      {
        name: 'New Application',
        icon: getIconComponent('FilePlus'),
        route: (serviceType) => `/admin/user/${serviceType}/new_application`,
      },
      {
        name: 'My Applications',
        icon: getIconComponent('List'),
        route: (serviceType) => `/admin/user/${serviceType}/my_applications`,
      },
      {
        name: 'License Renewal',
        icon: getIconComponent('RefreshCw'),
        route: (serviceType) => `/admin/user/${serviceType}/license_renewal`,
      },
      {
        name: 'Institutional Linkages',
        icon: getIconComponent('CreditCard'),
        route: (serviceType) => `/admin/user/${serviceType}/institutional_linkage`,
      },
      {
        name: 'Change Requests',
        icon: getIconComponent('Edit'),
        route: (serviceType) => `/admin/user/${serviceType}/change_request`,
      },
      {
        name: 'Events',
        icon: getIconComponent('CreditCard'),
        route: (serviceType) => `/admin/user/${serviceType}/promotion_events`,
      },
      {
        name: 'HR Management',
        icon: getIconComponent('Briefcase'),
        route: (serviceType) => `/admin/user/${serviceType}/hr_management`,
      },
      {
        name: 'Student Data',
        icon: getIconComponent('Briefcase'),
        route: (serviceType) => `/admin/user/${serviceType}/student_data`,
      },
      {
        name: 'Payment History',
        icon: getIconComponent('CreditCard'),
        route: (serviceType) => `/admin/user/${serviceType}/payment_history`,
      },

      {
        name: 'Profile',
        icon: getIconComponent('CreditCard'),
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
      },
      {
        name: 'Certification',
        icon: getIconComponent('Certificate'),
        children: [
          {
            name: 'Apply for Certification',
            route: (serviceType) =>
              `/admin/user/${serviceType}/registration`,
          },
          {
            name: 'My Applications',
            route: (serviceType) =>
              `/admin/user/${serviceType}/my_applications`,
          },
          {
            name: 'Renewal',
            route: (serviceType) => `/admin/user/${serviceType}/renewal`,
          },
          {
            name: 'Re-Registration',
            route: (serviceType) => `/admin/user/${serviceType}/re_registration`,
          },
          {
            name: 'Additional Qualification',
            route: (serviceType) => `/admin/user/${serviceType}/additional_qualification`,
          },
        ],
      },
      {
        name: 'Apply for CPD',
        icon: getIconComponent('BookOpen'),
        children: [
          {
            name: 'Apply for CPD',
            route: (serviceType) => `/admin/user/${serviceType}/cpd`,
          },
          {
            name: 'My Applications',
            route: (serviceType) => `/admin/user/${serviceType}/my_applications`,
          },
        ],
      },
      {
        name: 'Apply for CoGS',
        icon: getIconComponent('Users'),
        children: [
          {
            name: 'Apply for CoGS',
            route: (serviceType) => `/admin/user/${serviceType}/CoGS`,
          },
          {
            name: 'My Applications',
            route: (serviceType) => `/admin/user/${serviceType}/my_applications`,
          },
        ],
      },
      {
        name: 'Reports',
        icon: getIconComponent('Users'),
        route: (serviceType) => `/admin/user/${serviceType}/reports`,
      },
    ],
    admin: [
      {
        name: 'Certification Types',
        icon: getIconComponent('Heart'),
        route: (serviceType) => `/admin/admin/${serviceType}/certification_types`,
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
        name: 'Accreditation Types',
        icon: getIconComponent('Award'),
        route: (serviceType) => `/admin/admin/${serviceType}/accreditation_types`,
      },
    ],
    // Add dealing_officer to accreditation
    dealing_officer: dealingOfficerMenuItems,
  },
};

/**
 * Generates navigation items based on the service type and role.
 * @param {string} role - The user's role (e.g., 'user', 'admin').
 * @param {string} serviceType - The service type (e.g., 'roq', 'ecpf').
 * @returns {Array} - An array of navigation items for the given role and service type.
 */
export const generateNavigationItems = (role, serviceType) => {
  if (!role || !serviceType) return [];

  const serviceMenu = serviceSpecificMenuItems[serviceType];
  if (!serviceMenu || !serviceMenu[role]) return [];

  // Process the menu items to resolve dynamic routes
  const processMenuItem = (item) => {
    const newItem = {
      ...item,
      route: typeof item.route === 'function' ? item.route(serviceType) : item.route,
    };
    if (newItem.children) {
      newItem.children = newItem.children.map((child) => processMenuItem(child));
    }
    return newItem;
  };

  return serviceMenu[role].map(processMenuItem);
};
