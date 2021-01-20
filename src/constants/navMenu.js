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
} from 'lucide-vue-next'
// import { SERVICE_TYPE_CHOICES } from '@/router/constants'
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
}

const getIconComponent = (iconName) => {
  return iconMap[iconName] || File
}

export const generateNavigationItems = (role, serviceType) => {
  const navigationItems = {}

  if (!role) return navigationItems

  navigationItems[role] = []

  if (role === 'super_admin') {
    navigationItems[role] = [
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
    ]
  } else if (role === 'admin') {
    navigationItems[role] = [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: `/admin/admin/${serviceType}/dashboard`,
      },
      {
        name: 'Decisions',
        icon: getIconComponent('FileText'),
        route: `/admin/admin/${serviceType}/decisions`,
      },
      {
        name: 'Learning Types',
        icon: getIconComponent('File'),
        route: `/admin/admin/${serviceType}/learning_types`,
      },
      {
        name: 'Qualifications',
        icon: getIconComponent('Clock'),
        route: `/admin/admin/${serviceType}/qualifications`,
      },
      {
        name: 'Second Copy Reasons',
        icon: getIconComponent('CheckCircle'),
        route: `/admin/admin/${serviceType}/reason_for_issue_of_second_copy`,
      },
      {
        name: 'Type of Courses',
        icon: getIconComponent('Books'),
        route: `/admin/admin/${serviceType}/type_of_courses`,
      },
      {
        name: 'Profile',
        icon: getIconComponent('Users'),
        route: `/admin/admin/${serviceType}/user_profile`,
      },
    ]
  } else if (role === 'user') {
    // User routes based on service type
    navigationItems[role] = [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: `/admin/user/${serviceType}/dashboard`,
      },
      {
        name: 'Apply for RoQ',
        icon: getIconComponent('FileText'),
        route: `/admin/user/${serviceType}/my_applications`,
      },
      {
        name: 'Apply for Second Copy',
        icon: getIconComponent('File'),
        route: `/admin/user/${serviceType}/secondcopy_applications`,
      },
      // {
      //   name: 'Application Status',
      //   icon: getIconComponent('ClipboardCheck'),
      //   route: `/admin/user/${serviceType}/application_status`
      // },
      {
        name: 'Profile',
        icon: getIconComponent('UserCircle'),
        route: `/admin/user/${serviceType}/profile`,
      },
    ]
  } else if (role === 'dealing_officer') {
    // Dealing Officer routes
    navigationItems[role] = [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: `/admin/dealing_officer/${serviceType}/dashboard`,
      },

      {
        name: 'Application Lists',
        icon: getIconComponent('CheckCircle'),
        route: `/admin/dealing_officer/${serviceType}/application_lists`,
      },

      {
        name: 'Second Copy Lists',
        icon: getIconComponent('XCircle'),
        route: `/admin/dealing_officer/${serviceType}/second_copy_lists`,
      },
      {
        name: 'Reports',
        icon: getIconComponent('ClipboardCheck'),
        route: `/admin/dealing_officer/${serviceType}/reports`,
      },
    ]
  } else if (role === 'chief') {
    // Chief routes
    navigationItems[role] = [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: `/admin/chief/${serviceType}/dashboard`,
      },
      {
        name: 'Application Lists',
        icon: getIconComponent('FileSearch'),
        route: `/admin/chief/${serviceType}/application_lists`,
      },
      {
        name: 'Second Copy Lists',
        icon: getIconComponent('CheckCircle'),
        route: `/admin/chief/${serviceType}/second_copy_lists`,
      },
      {
        name: 'Reports',
        icon: getIconComponent('ClipboardCheck'),
        route: `/admin/chief/${serviceType}/reports`,
      },
    ]
  } else if (role === 'director') {
    // Director routes
    navigationItems[role] = [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: `/admin/director/${serviceType}/dashboard`,
      },
      {
        name: 'For Approval Applications',
        icon: getIconComponent('FileSearch'),
        route: `/admin/director/${serviceType}/for_approval_applications`,
      },
      {
        name: 'Approved Applications',
        icon: getIconComponent('CheckCircle'),
        route: `/admin/director/${serviceType}/approved_applications`,
      },
      {
        name: 'Reports',
        icon: getIconComponent('ClipboardCheck'),
        route: `/admin/director/${serviceType}/reports`,
      },
    ]
  }
  return navigationItems
}
