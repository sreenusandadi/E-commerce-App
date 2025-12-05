<template>
  <div class="container py-5 my-3">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4 border rounded">
        <div class="shadow-sm">
          <div class="card-body p-4">
            <h4 class="text-center mb-4">Create Account</h4>
            <form @submit.prevent="handleSignUp">
              <div v-if="authStore.error" class="alert alert-danger mt-3 mb-0">
                {{ authStore.error }}
              </div>
              <div></div>
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
              <div class="mb-4">
                <label for="role" class="form-label">Role</label>
                <div class="d-flex gap-2">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      v-model="form.role"
                      name="role"
                      id="roleAdmin"
                      value="admin"
                    />
                    <label class="form-check-label" for="roleAdmin"> Admin </label>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      v-model="form.role"
                      name="role"
                      id="roleUser"
                      value="user"
                    />
                    <label class="form-check-label" for="roleUser"> User </label>
                  </div>
                </div>
              </div>
              <button :disabled="authStore.loading" type="submit" class="btn btn-success w-100">
                <span v-if="authStore.loading" class="spinner-border spinner-border-sm me-2"></span>
                Create Account
              </button>
            </form>
            <p class="mt-3 form-label text-center">
              Already have an account?
              <router-link :to="APP_ROUTE_NAMES.SIGN_IN">Login here</router-link>
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

const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
  role: '',
})

const handleSignUp = async () => {
  await authStore.registerUser(form)
}
</script>
