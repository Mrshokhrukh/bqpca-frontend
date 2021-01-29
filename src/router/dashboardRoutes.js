// dashboardRoutes.js
import ModuleContainer from '@/components/ModuleContainer.vue'
import { useAuthStore } from '@/stores/authStore'
import { ROLE_CHOICES, SERVICE_TYPE_CHOICES } from './constants'
import routeMap from './routeMap'

function generateDynamicRoutes() {
  const routes = []

  ROLE_CHOICES.forEach((role) => {
    if (role.key === 'super_admin') {
      // Super Admin Routes (no service type)
      routes.push({
        path: `${role.key}`,
        alias: `/admin/${role.key}`,
        meta: {
          title: 'Super Admin Dashboard',
          description: 'BQPCA System Super Administrator Dashboard',
          keywords: 'super admin, dashboard, BQPCA administration',
        },
        beforeEnter: (to, from, next) => {
          const authStore = useAuthStore()
          if (authStore.role === role.key) {
            next()
          } else {
            next({ name: 'unauthorized' })
          }
        },
        children: Object.keys(routeMap[role.key]).map((routeName) => ({
          path: routeName,
          name: `${role.key}-${routeName}`,
          component: routeMap[role.key][routeName],
        })),
      })
    } else {
      // Routes for other roles (admin, user, dealing_officer, chief, director)
      SERVICE_TYPE_CHOICES.forEach((serviceType) => {
        if (routeMap[role.key]?.[serviceType.key]) {
          // Special handling for accreditation admin routes
          if (serviceType.key === 'accreditation' && role.key === 'admin') {
            routes.push({
              path: `${serviceType.key}`,
              alias: `/admin/${role.key}/${serviceType.key}`,
              component: ModuleContainer,
              meta: {
                title: `${serviceType.label} ${role.label} Dashboard`,
                description: `${serviceType.label} management dashboard for ${role.label}`,
                keywords: `${serviceType.key}, ${role.key}, dashboard, BQPCA administration`,
              },
              beforeEnter: (to, from, next) => {
                const authStore = useAuthStore()
                if (authStore.serviceType === serviceType.key && authStore.role === role.key) {
                  next()
                } else {
                  next({ name: 'unauthorized' })
                }
              },
              children: [
                // Regular routes
                ...Object.keys(routeMap[role.key][serviceType.key])
                  .filter((routeName) => routeName !== 'masters')
                  .map((routeName) => ({
                    path: routeName,
                    name: `${role.key}-${serviceType.key}-${routeName}`,
                    component: routeMap[role.key][serviceType.key][routeName],
                  })),

                // Masters routes
                {
                  path: 'masters',
                  component: routeMap[role.key][serviceType.key].masters.component,
                  children: Object.keys(routeMap[role.key][serviceType.key].masters.children).map(
                    (masterRoute) => ({
                      path: masterRoute,
                      name: `${role.key}-${serviceType.key}-masters-${masterRoute}`,
                      component: routeMap[role.key][serviceType.key].masters.children[masterRoute],
                    }),
                  ),
                },
              ],
            })
          } else {
            // Regular routes for other services and roles
            routes.push({
              path: `${serviceType.key}`,
              alias: `/admin/${role.key}/${serviceType.key}`,
              component: ModuleContainer,
              meta: {
                title: `${serviceType.label} ${role.label} Dashboard`,
                description: `${serviceType.label} management dashboard for ${role.label}`,
                keywords: `${serviceType.key}, ${role.key}, dashboard, BQPCA administration`,
              },
              beforeEnter: (to, from, next) => {
                const authStore = useAuthStore()
                if (authStore.serviceType === serviceType.key && authStore.role === role.key) {
                  next()
                } else {
                  next({ name: 'unauthorized' })
                }
              },
              children: Object.keys(routeMap[role.key][serviceType.key]).map((routeName) => {
                const route = routeMap[role.key][serviceType.key][routeName]

                // Handle nested routes
                if (route.component && route.children) {
                  return {
                    path: routeName,
                    name: `${role.key}-${serviceType.key}-${routeName}`,
                    component: route.component,
                    children: Object.keys(route.children).map((childRoute) => ({
                      path: childRoute,
                      name: `${role.key}-${serviceType.key}-${routeName}-${childRoute}`,
                      component: route.children[childRoute],
                    })),
                  }
                }

                // Handle practitioner registration and certification routes
                if (routeName === 'practitioner_reg_and_cert') {
                  return {
                    path: routeName,
                    name: `${role.key}-${serviceType.key}-${routeName}`,
                    component: route.component,
                    children: [
                      {
                        path: 'registration',
                        name: `${role.key}-${serviceType.key}-${routeName}-registration`,
                        component: route.children?.registration,
                      },
                      {
                        path: 'certificate',
                        name: `${role.key}-${serviceType.key}-${routeName}-certificate`,
                        component: route.children?.certificate,
                      },
                      {
                        path: 'renewal',
                        name: `${role.key}-${serviceType.key}-${routeName}-renewal`,
                        component: route.children?.renewal,
                      },
                    ],
                  }
                }

                // Default route handling
                return {
                  path: routeName === 'application_details' ? ':id' : routeName,
                  name: `${role.key}-${serviceType.key}-${routeName}`,
                  component: route,
                }
              }),
            })
          }
        } else {
          console.warn(
            `No routes defined for role: ${role.key} and service type: ${serviceType.key}`,
          )
        }
      })
    }
  })

  return routes
}

const dashboardRoutes = [
  {
    path: '/admin',
    component: () => import('@/layouts/AdminDashboard.vue'),
    meta: { requiresAuth: true },
    children: generateDynamicRoutes(),
  },
]

export default dashboardRoutes
