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
} from 'lucide-vue-next'

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
}

const getIconComponent = (iconName) => {
  return iconMap[iconName] || File
}

// Service specific menu items
const serviceSpecificMenuItems = {
  roq: {
    user: [
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
  },
  health_certification: {
    user: [
      {
        name: 'Health Certification',
        icon: getIconComponent('Heart'),
        route: (serviceType) => `/admin/user/${serviceType}/my_applications`,
      },
    ],
    admin: [
      {
        name: 'Certification Types',
        icon: getIconComponent('Heart'),
        route: (serviceType) => `/admin/admin/${serviceType}/certification_types`,
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
  },
}

// Common menu items for each role
const commonMenuItems = {
  super_admin: [
    {
      name: 'Dashboard',
      icon: getIconComponent('LayoutDashboard'),
      route: '/admin/super_admin/dashboard',
    },
    {
      name: 'Users',
      icon: getIconComponent('Users'),
      route: '/admin/super_admin/users',
    },
    {
      name: 'User Management',
      icon: getIconComponent('Users'),
      route: '/admin/super_admin/user_management',
    },
    {
      name: 'Settings',
      icon: getIconComponent('Settings'),
      route: '/admin/super_admin/settings',
    },
    {
      name: 'Activity Logs',
      icon: getIconComponent('FileText'),
      route: '/admin/super_admin/activity_logs',
    },
    {
      name: 'Reports',
      icon: getIconComponent('ClipboardCheck'),
      route: '/admin/super_admin/reports',
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
      icon: getIconComponent('FileText'),
      route: (serviceType) => `/admin/admin/${serviceType}/decisions`,
    },
    {
      name: 'Learning Types',
      icon: getIconComponent('File'),
      route: (serviceType) => `/admin/admin/${serviceType}/learning_types`,
    },
    {
      name: 'Profile',
      icon: getIconComponent('Users'),
      route: (serviceType) => `/admin/admin/${serviceType}/user_profile`,
    },
  ],
  user: [
    {
      name: 'Dashboard',
      icon: getIconComponent('LayoutDashboard'),
      route: (serviceType) => `/admin/user/${serviceType}/dashboard`,
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
      name: 'Application Lists',
      icon: getIconComponent('CheckCircle'),
      route: (serviceType) => `/admin/dealing_officer/${serviceType}/application_lists`,
    },
    {
      name: 'Reports',
      icon: getIconComponent('ClipboardCheck'),
      route: (serviceType) => `/admin/dealing_officer/${serviceType}/reports`,
    },
  ],
  chief: [
    {
      name: 'Dashboard',
      icon: getIconComponent('LayoutDashboard'),
      route: (serviceType) => `/admin/chief/${serviceType}/dashboard`,
    },
    {
      name: 'Application Lists',
      icon: getIconComponent('FileSearch'),
      route: (serviceType) => `/admin/chief/${serviceType}/application_lists`,
    },
    {
      name: 'Second Copy',
      icon: getIconComponent('FileSearch'),
      route: (serviceType) => `/admin/chief/${serviceType}/second_copy_lists`,
    },
    {
      name: 'Reports',
      icon: getIconComponent('ClipboardCheck'),
      route: (serviceType) => `/admin/chief/${serviceType}/reports`,
    },
  ],
  director: [
    {
      name: 'Dashboard',
      icon: getIconComponent('LayoutDashboard'),
      route: (serviceType) => `/admin/director/${serviceType}/dashboard`,
    },
    {
      name: 'For Approval Applications',
      icon: getIconComponent('FileSearch'),
      route: (serviceType) => `/admin/director/${serviceType}/for_approval_applications`,
    },
    {
      name: 'Approved Applications',
      icon: getIconComponent('CheckCircle'),
      route: (serviceType) => `/admin/director/${serviceType}/approved_applications`,
    },
    {
      name: 'Reports',
      icon: getIconComponent('ClipboardCheck'),
      route: (serviceType) => `/admin/director/${serviceType}/reports`,
    },
  ],
}

export const generateNavigationItems = (role, serviceType) => {
  const navigationItems = {}

  if (!role) return navigationItems

  navigationItems[role] = []

  // Add common menu items for the role
  if (commonMenuItems[role]) {
    navigationItems[role] = commonMenuItems[role].map((item) => ({
      ...item,
      route: typeof item.route === 'function' ? item.route(serviceType) : item.route,
    }))
  }

  // Add service-specific menu items if they exist for the role and service type
  if (serviceType && serviceSpecificMenuItems[serviceType]?.[role]) {
    const serviceItems = serviceSpecificMenuItems[serviceType][role].map((item) => ({
      ...item,
      route: typeof item.route === 'function' ? item.route(serviceType) : item.route,
    }))

    // Insert service-specific items after Dashboard but before Profile
    const dashboardIndex = navigationItems[role].findIndex((item) => item.name === 'Dashboard')
    const profileIndex = navigationItems[role].findIndex((item) => item.name === 'Profile')

    if (profileIndex !== -1) {
      navigationItems[role].splice(profileIndex, 0, ...serviceItems)
    } else {
      navigationItems[role].push(...serviceItems)
    }
  }

  return navigationItems
}
