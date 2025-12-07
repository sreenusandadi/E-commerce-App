<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <img src="../../../public/assets/doller.webp" alt="Logo" width="40" class="mx-2" />
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" aria-current="page" :to="{ name: APP_ROUTE_NAMES.HOME }"
              >Home</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              aria-current="page"
              :to="{ name: APP_ROUTE_NAMES.PRODUCTS_LIST }"
              >Products</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              aria-current="page"
              :to="{ name: APP_ROUTE_NAMES.ADD_PRODUCT }"
              >Add Product</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link"
              aria-current="page"
              :to="{ name: APP_ROUTE_NAMES.CONTACT_US }"
              >Contact Us</router-link
            >
          </li>
        </ul>
        <ul class="d-flex navbar-nav">
          <li class="nav-item nav-link" v-if="authStore.isAuthenticatedCheck">
            {{ `Welcome, ${authStore.user.email}` }}
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-laptop"></i>
            </a>
            <ul class="dropdown-menu">
              <li>
                <button class="dropdown-item" @click="themeStore.setTheme('light')">
                  <i class="bi bi-laptop"></i> &nbsp; Light
                </button>
              </li>
              <li>
                <button class="dropdown-item" @click="themeStore.setTheme('dark')">
                  <i class="bi bi-moon-stars"></i> &nbsp; Dark
                </button>
              </li>
            </ul>
          </li>
          <li class="nav-item" v-if="!authStore.isAuthenticatedCheck">
            <router-link
              class="nav-link"
              aria-current="page"
              :to="{ name: APP_ROUTE_NAMES.SIGN_IN }"
              >Signin</router-link
            >
          </li>
          <li class="nav-item" v-if="!authStore.isAuthenticatedCheck">
            <router-link
              class="nav-link"
              aria-current="page"
              :to="{ name: APP_ROUTE_NAMES.SIGN_UP }"
              >Signup</router-link
            >
          </li>
          <li class="nav-item" v-if="authStore.isAuthenticatedCheck">
            <button class="nav-link btn btn-link" @click="handleLogout">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { APP_ROUTE_NAMES } from '@/constants/routeNames'
import { useThemeStore } from '@/stores/themeStore'
import { useAuthStore } from '@/stores/authStore'

const themeStore = useThemeStore()
const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logoutUser(router)
}
</script>
