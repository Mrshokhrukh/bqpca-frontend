import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '@/views/LandingPage.vue';
import RoQPage from '@/views/services/RoQPage.vue';
import ECPFPage from '@/views/services/ECPFPage.vue';
import AccreditationPage from '@/views/services/AccreditationPage.vue';
import EngineeringPage from '@/views/services/EngineeringPage.vue';
import BMHCPage from '@/views/services/BMHCPage.vue';
import AdminDashboard from '@/layouts/AdminDashboard.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage,
    },
    {
      path: '/admin/login',
      component: () => import('@/views/admin/BQPCAAdminLogin.vue')
    },
    {
      path: '/super-admin/login',
      component: () => import('@/views/admin/SuperAdminLogin.vue')
    },
    {
      path: '/roq',
      name: 'roq',
      component: RoQPage,
    },
    {
      path: '/ecpf',
      name: 'ecpf',
      component: ECPFPage,
    },
    {
      path: '/accreditation',
      name: 'accreditation',
      component: AccreditationPage,
    },
    {
      path: '/engineering',
      name: 'engineering',
      component: EngineeringPage,
    },
    {
      path: '/bmhc',
      name: 'bmhc',
      component: BMHCPage,
    },
    {
      path: '/dashboard',
      component: AdminDashboard,
      children: [
        // Super Admin Routes
        {
          path: 'super-admin',
          props: { userRole: 'superAdmin' },
          children: [
            // {
            //   path: 'dashboard',
            //   name: 'super-admin-dashboard',
            //   component: () => import('@/views/admin/Dashboard.vue')
            // },
            // {
            //   path: 'reports',
            //   name: 'super-admin-reports',
            //   component: () => import('@/views/admin/Reports.vue')
            // },
            // {
            //   path: 'config',
            //   name: 'super-admin-config',
            //   component: () => import('@/views/admin/Config.vue')
            // }
          ]
        },
        // RoQ Module Routes
        {
          path: 'roq',
          props: { userRole: 'admin', userModule: 'RoQ' },
          children: [
            // {
            //   path: 'dashboard',
            //   name: 'roq-dashboard',
            //   component: () => import('@/views/roq/Dashboard.vue')
            // },
            // {
            //   path: 'applications',
            //   name: 'roq-applications',
            //   component: () => import('@/views/roq/Applications.vue')
            // },
            // {
            //   path: 'qualifications',
            //   name: 'roq-qualifications',
            //   component: () => import('@/views/roq/Qualifications.vue')
            // },
            // {
            //   path: 'institutions',
            //   name: 'roq-institutions',
            //   component: () => import('@/views/roq/Institutions.vue')
            // }
          ]
        },
        // ECPF Module Routes
        {
          path: 'ecpf',
          props: { userRole: 'admin', userModule: 'ECPF' },
          children: [
            // {
            //   path: 'dashboard',
            //   name: 'ecpf-dashboard',
            //   component: () => import('@/views/ecpf/Dashboard.vue')
            // },
            // {
            //   path: 'admin',
            //   name: 'ecpf-admin',
            //   component: () => import('@/views/ecpf/Admin.vue')
            // }
          ]
        },
        // Accreditation Module Routes
        {
          path: 'accreditation',
          props: { userRole: 'admin', userModule: 'Accreditation' },
          children: [
            // {
            //   path: 'dashboard',
            //   name: 'accreditation-dashboard',
            //   component: () => import('@/views/accreditation/Dashboard.vue')
            // },
            // {
            //   path: 'admin',
            //   name: 'accreditation-admin',
            //   component: () => import('@/views/accreditation/Admin.vue')
            // }
          ]
        },
        // Engineering Module Routes
        {
          path: 'engineering',
          props: { userRole: 'admin', userModule: 'Engineering' },
          children: [
            // {
            //   path: 'dashboard',
            //   name: 'engineering-dashboard',
            //   component: () => import('@/views/engineering/Dashboard.vue')
            // },
            // {
            //   path: 'admin',
            //   name: 'engineering-admin',
            //   component: () => import('@/views/engineering/Admin.vue')
            // }
          ]
        },
        // BMHC Module Routes
        {
          path: 'bmhc',
          props: { userRole: 'admin', userModule: 'BMHC' },
          children: [
            // {
            //   path: 'dashboard',
            //   name: 'bmhc-dashboard',
            //   component: () => import('@/views/bmhc/Dashboard.vue')
            // },
            // {
            //   path: 'admin',
            //   name: 'bmhc-admin',
            //   component: () => import('@/views/bmhc/Admin.vue')
            // }
          ]
        }
      ]
    }
  ],
});

export default router;
