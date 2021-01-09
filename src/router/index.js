import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '@/views/LandingPage.vue';
import RoQPage from '@/views/services/RoQPage.vue';
import ECPFPage from '@/views/services/ECPFPage.vue';
import AccreditationPage from '@/views/services/AccreditationPage.vue';
import EngineeringPage from '@/views/services/EngineeringPage.vue';
import BMHCPage from '@/views/services/BMHCPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage,
    },
    {
      path: '/roq',
      name: 'roq',
      component: RoQPage,
      children: [
        // {
        //   path: 'dashboard', // Relative path: /roq/dashboard
        //   name: 'roq-dashboard',
        //   component: Dashboard,
        // },
        // {
        //   path: 'admin', // Relative path: /roq/admin
        //   name: 'roq-admin',
        //   component: Admin,
        // },
      ],
    },
    {
      path: '/ecpf',
      name: 'ecpf',
      component: ECPFPage,
      children: [
        // {
        //   path: 'dashboard', // Relative path: /ecpf/dashboard
        //   name: 'ecpf-dashboard',
        //   component: Dashboard,
        // },
        // {
        //   path: 'admin', // Relative path: /ecpf/admin
        //   name: 'ecpf-admin',
        //   component: Admin,
        // },
      ],
    },
    {
      path: '/accreditation',
      name: 'accreditation',
      component: AccreditationPage,
      children: [
        // {
        //   path: 'dashboard', // Relative path: /accreditation/dashboard
        //   name: 'accreditation-dashboard',
        //   component: Dashboard,
        // },
        // {
        //   path: 'admin', // Relative path: /accreditation/admin
        //   name: 'accreditation-admin',
        //   component: Admin,
        // },
      ],
    },
    {
      path: '/engineering',
      name: 'engineering',
      component: EngineeringPage,
      children: [
        // {
        //   path: 'dashboard', // Relative path: /engineering/dashboard
        //   name: 'engineering-dashboard',
        //   component: Dashboard,
        // },
        // {
        //   path: 'admin', // Relative path: /engineering/admin
        //   name: 'engineering-admin',
        //   component: Admin,
        // },
      ],
    },
    {
      path: '/bmhc',
      name: 'bmhc',
      component: BMHCPage,
      children: [
        // {
        //   path: 'dashboard', // Relative path: /bmhc/dashboard
        //   name: 'bmhc-dashboard',
        //   component: Dashboard,
        // },
        // {
        //   path: 'admin', // Relative path: /bmhc/admin
        //   name: 'bmhc-admin',
        //   component: Admin,
        // },
      ],
    },
  ],
});

export default router;
