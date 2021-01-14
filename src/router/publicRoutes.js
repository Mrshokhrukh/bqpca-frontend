// publicRoutes.js
const publicRoutes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/LandingPage.vue'),
  },
  {
    path: '/admin/login',
    component: () => import('@/views/admin/BQPCAAdminLogin.vue'),
  },
  {
    path: '/super-admin/login',
    component: () => import('@/views/admin/SuperAdminLogin.vue'),
  },
  {
    path: '/roq',
    name: 'roq',
    component: () => import('@/views/services/RoQPage.vue'),
  },
  {
    path: '/ecpf',
    name: 'ecpf',
    component: () => import('@/views/services/ECPFPage.vue'),
  },
  {
    path: '/accreditation',
    name: 'accreditation',
    component: () => import('@/views/services/AccreditationPage.vue'),
  },
  {
    path: '/engineering',
    name: 'engineering',
    component: () => import('@/views/services/EngineeringPage.vue'),
  },
  {
    path: '/bmhc',
    name: 'bmhc',
    component: () => import('@/views/services/BMHCPage.vue'),
  },
];

export default publicRoutes;
