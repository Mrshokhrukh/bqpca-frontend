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
        name: 'Qualifications',
        icon: getIconComponent('Award'),
        route: (serviceType) => `/admin/admin/${serviceType}/qualifications`,
      },
      {
        name: 'Second Copy Reasons',
        icon: getIconComponent('CheckCircle'),
        route: (serviceType) => `/admin/admin/${serviceType}/reason_for_issue_of_second_copy`,
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
            route: (serviceType) =>
              `/admin/user/${serviceType}/practitioner_reg_and_cert/renewal`,
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
        name: 'Certification Types',
        icon: getIconComponent('Heart'),
        route: (serviceType) => `/admin/admin/${serviceType}/certification_types`,
      },
    ],
    // Add dealing_officer to health_certification
    dealing_officer: dealingOfficerMenuItems,
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


