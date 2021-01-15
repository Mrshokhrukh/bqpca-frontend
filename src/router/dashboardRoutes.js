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
          console.log('Super Admin beforeEnter Guard:', {
            routeRole: role.key,
            authStoreRole: authStore.role,
          });

          if (authStore.role === role.key) {
            next();
          } else {
            console.log('Unauthorized: Role mismatch for Super Admin');
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
              console.log('beforeEnter Guard:', {
                routeRole: role.key,
                routeServiceType: serviceType.key,
                authStoreRole: authStore.role,
                authStoreServiceType: authStore.serviceType,
              });

              // Allow access if the user's role and service type match the route
              if (authStore.serviceType === serviceType.key && authStore.role === role.key) {
                next();
              } else {
                console.log('Unauthorized: Role or service type mismatch');
                next({ name: 'unauthorized' });
              }
            },
            children: Object.keys(routeMap[role.key][serviceType.key]).map(routeName => ({
              path: routeName,
              name: `${role.key}-${serviceType.key}-${routeName}`,
              component: routeMap[role.key][serviceType.key][routeName],
            })),
          });
        } else {
          console.warn(`No routes defined for role: ${role.key} and service type: ${serviceType.key}`);
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
