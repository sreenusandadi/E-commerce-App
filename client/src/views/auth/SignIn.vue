<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4 border">
        <div class="shadow-sm">
          <div class="card-body p-4">
            <h4 class="text-center mb-4">Sign In</h4>
            <form @submit.prevent="handleSignIn">
              <div v-if="authStore.error" class="alert alert-danger mb-2">
                {{ authStore.error }}
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" v-model="form.email" class="form-control" id="email" required />
              </div>
              <div class="mb-4">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  v-model="form.password"
                  class="form-control"
                  id="password"
                  required
                />
              </div>
              <button :disabled="authStore.isLoading" type="submit" class="btn btn-success w-100">
                <span
                  v-if="authStore.isLoading"
                  class="spinner-border spinner-border-sm me-2"
                ></span>
                Sign In
              </button>
            </form>
            <p class="mt-3 form-label text-center">
              Don't have an account?
              <router-link :to="APP_ROUTE_NAMES.SIGN_UP">Register here</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { APP_ROUTE_NAMES } from '@/constants/routeNames.js'
import { useAuthStore } from '@/stores/authStore'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()

const router = useRouter()

const form = reactive({
  email: '',
  password: '',
})

const handleSignIn = async () => {
  await authStore.signInUser(form, router)
}
</script>
