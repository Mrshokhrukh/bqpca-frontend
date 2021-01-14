// dashboardRoutes.js
import ModuleContainer from '@/components/ModuleContainer.vue';
import { useAuthStore } from '@/stores/authStore';
import { ROLE_CHOICES, SERVICE_TYPE_CHOICES } from './constants';
import routeMap from './routeMap';

function generateDynamicRoutes() {
  const routes = [];

  ROLE_CHOICES.forEach(role => {
    if (role.key === 'super_admin') {
      // Super Admin Routes (no service type)
      routes.push({
        path: `${role.key}`,
        alias: `/admin/${role.key}`,
        beforeEnter: (to, from, next) => {
          const authStore = useAuthStore();
          if (authStore.role === role.key) {
            next();
          } else {
            next({ name: 'unauthorized' });
          }
        },
        children: Object.keys(routeMap[role.key]).map(routeName => ({
          path: routeName,
          name: `${role.key}-${routeName}`,
          component: routeMap[role.key][routeName],
        })),
      });
    } else {
      // Routes for other roles (admin, user, dealing_officer, chief, director)
      SERVICE_TYPE_CHOICES.forEach(serviceType => {
        if (routeMap[role.key]?.[serviceType.key]) {
          routes.push({
            path: `${serviceType.key}`,
            alias: `/admin/${role.key}/${serviceType.key}`,
            component: ModuleContainer,
            beforeEnter: (to, from, next) => {
              const authStore = useAuthStore();
              if (authStore.serviceType === serviceType.key && authStore.role === role.key) {
                next();
              } else {
                next({ name: 'unauthorized' });
              }
            },
            children: Object.keys(routeMap[role.key][serviceType.key]).map(routeName => ({
              path: routeName,
              name: `${role.key}-${serviceType.key}-${routeName}`,
              component: routeMap[role.key][serviceType.key][routeName],
            })),
          });
        }
      });
    }
  });

  return routes;
}

const dashboardRoutes = [
  {
    path: '/admin',
    component: () => import('@/layouts/AdminDashboard.vue'),
    meta: { requiresAuth: true },
    children: generateDynamicRoutes(),
  },
];

export default dashboardRoutes;
