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
import { SERVICE_TYPE_CHOICES } from '@/router/constants' // Keep the import
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
    // Super Admin routes
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
    // Admin routes based on service type
    navigationItems[role] = [
      {
        name: 'Dashboard',
        icon: getIconComponent('LayoutDashboard'),
        route: `/admin/${serviceType}/dashboard`,
      },
      {
        name: 'Applications',
        icon: getIconComponent('FileText'),
        route: `/admin/${serviceType}/applications`,
      },
      {
        name: 'New Application',
        icon: getIconComponent('File'),
        route: `/admin/${serviceType}/new_application`,
      },
      {
        name: 'Pending Applications',
        icon: getIconComponent('Clock'),
        route: `/admin/${serviceType}/pending_applications`,
      },
      {
        name: 'Approved Applications',
        icon: getIconComponent('CheckCircle'),
        route: `/admin/${serviceType}/approved_applications`,
      },
      {
        name: 'Clients',
        icon: getIconComponent('Users'),
        route: `/admin/${serviceType}/clients`,
      },
      {
        name: 'Reports',
        icon: getIconComponent('ClipboardCheck'),
        route: `/admin/${serviceType}/reports`,
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
        name: 'Pending Applications',
        icon: getIconComponent('Clock'),
        route: `/admin/dealing_officer/${serviceType}/pending_applications`,
      },
      {
        name: 'Approved Applications',
        icon: getIconComponent('CheckCircle'),
        route: `/admin/dealing_officer/${serviceType}/approved_applications`,
      },
      {
        name: 'Rejected Applications',
        icon: getIconComponent('XCircle'),
        route: `/admin/dealing_officer/${serviceType}/rejected_applications`,
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
        name: 'For Review Applications',
        icon: getIconComponent('FileSearch'),
        route: `/admin/chief/${serviceType}/for_review_applications`,
      },
      {
        name: 'Endorsed Applications',
        icon: getIconComponent('CheckCircle'),
        route: `/admin/chief/${serviceType}/endorsed_applications`,
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
