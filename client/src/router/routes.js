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
      meta: {
        title: 'Home – Online Stones',
        description: 'Home Page',
      },
    },
    {
      path: '/access-denied',
      name: APP_ROUTE_NAMES.ACCESS_DENIED,
      component: AccessDenied,
      meta: {
        title: 'Access Denied – Online Stones',
        description: 'Access denied page',
      },
    },
    {
      path: '/sign-up',
      name: APP_ROUTE_NAMES.SIGN_UP,
      component: SignUp,
      meta: {
        title: 'Sign Up – Online Stones',
        description: 'Signup page',
      },
    },
    {
      path: '/sign-in',
      name: APP_ROUTE_NAMES.SIGN_IN,
      component: SignIn,
      meta: {
        title: 'Sign In – Online Stones',
        description: 'Signin page',
      },
    },
    {
      path: '/contact-us',
      name: APP_ROUTE_NAMES.CONTACT_US,
      component: ContactUs,
      meta: {
        title: 'Contact Us – Online Stones',
        description: 'Contact us page',
      },
    },
    {
      path: '/products',
      name: APP_ROUTE_NAMES.PRODUCTS_LIST,
      component: ProductsList,
      meta: {
        title: 'Products – Online Stones',
        description: 'Products page',
        requiresAuth: true,
      },
    },
    {
      path: '/add-product',
      name: APP_ROUTE_NAMES.ADD_PRODUCT,
      component: ProductUpsert,
      meta: {
        title: 'Add Product – Online Stones',
        description: 'Add products page',
        requiresAuth: true,
      },
    },
    {
      path: '/update-product/:id',
      name: APP_ROUTE_NAMES.UPDATE_PRODUCT,
      component: ProductUpsert,
      meta: {
        title: 'Product Details – Online Stones',
        description: 'View stone details',
        requiresAuth: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: APP_ROUTE_NAMES.NOT_FOUND,
      component: NotFound,
      meta: {
        title: 'Not Found',
        description: 'Page not found',
      },
    },
  ],
})

const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  // Set page title
  document.title = to.meta.title || 'Online Stones'

  // Set meta description
  let metaDesc = document.querySelector("meta[name='description']")
  if (!metaDesc) {
    metaDesc = document.createElement('meta')
    metaDesc.setAttribute('name', 'description')
    document.head.appendChild(metaDesc)
  }
  metaDesc.setAttribute('content', to.meta.description || 'Buy gemstones online')

  // Set canonical URL
  let canonical = document.querySelector("link[rel='canonical']")
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  canonical.setAttribute('href', SITE_URL + to.fullPath)

  // Set og:url (for social sharing)
  let ogUrl = document.querySelector("meta[property='og:url']")
  if (!ogUrl) {
    ogUrl = document.createElement('meta')
    ogUrl.setAttribute('property', 'og:url')
    document.head.appendChild(ogUrl)
  }
  ogUrl.setAttribute('content', SITE_URL + to.fullPath)

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: APP_ROUTE_NAMES.SIGN_IN })
  }
  next()
})

export default router
