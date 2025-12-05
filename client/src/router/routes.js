import { createRouter, createWebHistory } from 'vue-router'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'

import HomePage from '@/views/home/HomePage.vue'
import ProductsList from '@/views/product/ProductList.vue'
import SignUp from '@/views/auth/SignUp.vue'
import SignIn from '@/views/auth/SignIn.vue'
import AccessDenied from '@/views/auth/AccessDenied.vue'
import NotFound from '@/views/auth/NotFound.vue'
import ContactUs from '@/views/home/ContactUs.vue'
import ProductUpsert from '@/views/product/ProductUpsert.vue'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: APP_ROUTE_NAMES.HOME,
      component: HomePage,
    },
    {
      path: '/access-denied',
      name: APP_ROUTE_NAMES.ACCESS_DENIED,
      component: AccessDenied,
    },
    {
      path: '/sign-up',
      name: APP_ROUTE_NAMES.SIGN_UP,
      component: SignUp,
    },
    {
      path: '/sign-in',
      name: APP_ROUTE_NAMES.SIGN_IN,
      component: SignIn,
    },
    {
      path: '/contact-us',
      name: APP_ROUTE_NAMES.CONTACT_US,
      component: ContactUs,
    },
    {
      path: '/products',
      name: APP_ROUTE_NAMES.PRODUCTS_LIST,
      component: ProductsList,
    },
    {
      path: '/add-product',
      name: APP_ROUTE_NAMES.ADD_PRODUCT,
      component: ProductUpsert,
    },
    {
      path: '/update-product/:id',
      name: APP_ROUTE_NAMES.UPDATE_PRODUCT,
      component: ProductUpsert,
    },
    {
      path: '/:pathMatch(.*)*',
      name: APP_ROUTE_NAMES.NOT_FOUND,
      component: NotFound,
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  // Global route guard can be added here
  const authStore = useAuthStore()
  const authRequiredRoutes = [APP_ROUTE_NAMES.ADD_PRODUCT, APP_ROUTE_NAMES.UPDATE_PRODUCT]

  // if (authRequiredRoutes.includes(to.name) && !authStore.isAuthenticated) {
  //   return next({ name: APP_ROUTE_NAMES.ACCESS_DENIED })
  // }

  // Check and refresh token if not authenticated
  if (!authStore.isAuthenticated && authRequiredRoutes.includes(to.name)) {
    try {
      await authStore.refreshAuth()
    } catch (error) {
      console.log('No valid refresh token, user not authenticated', error)
      return next({ name: APP_ROUTE_NAMES.SIGN_IN })
    }
  }
  next()
})

export default router
