<template>
  <div class="container py-4">
    <div v-if="loading" class="d-flex justify-content-center align-items-center vh-100">
      <div class="spinner-grow text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div class="border rounded pb-3 p-3 p-md-4" v-else>
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div class="d-flex flex-column">
          <h2 class="text-secondary mb-0">Products</h2>
          <span>Manage your product listings</span>
        </div>
        <router-link :to="{ name: APP_ROUTE_NAMES.ADD_PRODUCT }" class="btn btn-success"
          ><i class="bi bi-file-plus me-2"></i>Add Product</router-link
        >
      </div>
      <div class="table-responsive">
        <table class="table table-hover table-dark table-striped" v-if="products.length > 0">
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Category</th>
              <th scope="col">Pricing</th>
              <th scope="col">Tags</th>
              <th scope="col">Best Seller</th>
              <th scope="col" class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in products" :key="item._id" class="align-middle">
              <td>
                <div class="d-flex align-items-center gap-3">
                  <img
                    :src="item.image || 'https://placehold.co/100x100'"
                    alt="Product Image"
                    class="rounded-3"
                    style="width: 60px; height: 60px; object-fit: cover"
                  />
                  <div>
                    <h6 class="mb-0">{{ item.name }}</h6>
                    <small class="text-muted">ID: {{ item.description }}</small>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge bg-bg-opacity-10 text-bg-secondary">{{ item.category }}</span>
              </td>
              <td>
                <div class="d-flex flex-column gap-1">
                  <span class="fw-fw-semibold small">Price: {{ item.price }}</span>
                  <span class="text-danger small">Sale Price: {{ item.salePrice }}</span>
                </div>
              </td>
              <td>
                <div class="d-flex flex-wrap gap-1">
                  <span
                    v-for="(tag, index) in item.tags"
                    :key="index"
                    class="badge bg-info bg-opacity-10 text-info small"
                  >
                    {{ tag }}
                  </span>
                </div>
              </td>
              <td>
                <span
                  v-if="item.bestSeller"
                  class="badge bg-warning bg-opacity-10 text-warning small"
                  >Bestseller</span
                >
                <span v-else class="text-muted text-center">---</span>
              </td>
              <td class="pe-3 text-end">
                <router-link
                  :to="{ name: APP_ROUTE_NAMES.UPDATE_PRODUCT, params: { id: item._id } }"
                  class="btn btn-sm btn-outline-secondary m-2"
                >
                  <i class="bi bi-pencil"></i> Edit
                </router-link>
                <button class="btn btn-sm btn-outline-danger" @click="handleDelete(item._id)">
                  <i class="bi bi-trash"></i> Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getProducts, deleteProduct } from '@/services/productService'
import { useSwal } from '../../utility/useSwal.js'

import { APP_ROUTE_NAMES } from '@/constants/routeNames.js'

const products = ref([])
const loading = ref(false)
const swal = useSwal()

const fetchProducts = async () => {
  try {
    loading.value = true
    const response = await getProducts()
    products.value = response.data
  } catch (error) {
    console.error('Error fetching products:', error)
    swal.showError('Failed to fetch products. Please try again.')
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id) => {
  const confirmation = await swal.showConfirmation('Are you sure you want to delete this product?')
  if (confirmation.isConfirmed) {
    // Proceed with deletion logic here
    try {
      loading.value = true
      await deleteProduct(id) // Assume deleteProduct is defined elsewhere
      fetchProducts() // Refresh the product list
      swal.showSuccess('Product deleted successfully.')
    } catch (error) {
      console.error('Error deleting product:', error)
      swal.showError('Failed to delete product. Please try again.')
    } finally {
      loading.value = false
    }
  } else {
    // Deletion cancelled
    swal.showInfo('Product deletion cancelled.')
  }
}

onMounted(() => {
  fetchProducts()
})
</script>
