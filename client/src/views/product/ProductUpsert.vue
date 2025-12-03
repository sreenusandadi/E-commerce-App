<template>
  <form
    class="container p-4 w-50 border rounded-3 my-4 shadow-sm d-flex gap-3"
    @submit.prevent="handleSubmit"
  >
    <div class="flex-grow-1">
      <h2 class="text-center text-success">{{ productId ? 'Update' : 'Create' }} Product</h2>
      <hr />
      <div class="alert alert-danger" v-if="errorList.length > 0">
        <p>Please resolve following errors to continue.</p>
        <ul class="mb-0">
          <li v-for="(error, index) in errorList" :key="index">{{ error }}</li>
        </ul>
      </div>
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input
          type="text"
          class="form-control"
          v-model.trim="productObj.name"
          id="name"
          placeholder="Name"
        />
      </div>
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea
          class="form-control"
          v-model="productObj.description"
          id="description"
          placeholder="Description"
        ></textarea>
      </div>
      <div class="mb-3">
        <label for="price" class="form-label">Price</label>
        <input
          type="number"
          class="form-control"
          v-model.number="productObj.price"
          id="price"
          placeholder="Price"
        />
      </div>
      <div class="mb-3">
        <label for="salePrice" class="form-label">Sale Price</label>
        <input
          type="number"
          class="form-control"
          v-model.number="productObj.salePrice"
          id="salePrice"
          placeholder="Sale Price"
        />
      </div>
      <div class="mb-3">
        <label for="tags" class="form-label">Tags (comma-seperated)</label>
        <input
          type="text"
          class="form-control"
          v-model="productObj.tags"
          id="tags"
          placeholder="eg., modern, classic, luxury"
        />
      </div>
      <div class="form-check form-switch mb-3">
        <input
          class="form-check-input"
          type="checkbox"
          role="switch"
          id="bestSellerSwitch"
          v-model="productObj.bestSeller"
        />
        <label class="form-check-label" for="bestSellerSwitch">Best Seller</label>
      </div>
      <div class="mb-3">
        <label for="category" class="form-label">Category</label>
        <select
          class="form-select"
          aria-label="Default select example"
          v-model="productObj.category"
        >
          <option v-for="category in PRODUCT_CATEGORIES" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
      </div>
      <div class="mb-3">
        <label for="image" class="form-label">Image</label>
        <input class="form-control form-control-sm" id="image" type="file" />
      </div>
      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-success px-5">
          <span
            v-if="isLoading"
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span
          >Submit
        </button>
        <router-link :to="{ name: APP_ROUTE_NAMES.PRODUCTS_LIST }" class="btn btn-secondary px-5"
          >Cancel</router-link
        >
      </div>
    </div>
    <div><img src="https://placehold.co/600x400" width="100" alt="image" /></div>
  </form>
</template>
<script setup>
import { reactive, ref, onMounted } from 'vue'

import { PRODUCT_CATEGORIES } from '@/constants/appConstants.js'
import { useSwal } from '../../utility/useSwal.js'
import { addProduct, updateProduct } from '@/services/productService.js'
import { useRouter, useRoute } from 'vue-router'

import { APP_ROUTE_NAMES } from '@/constants/routeNames.js'
import { getProductById } from '@/services/productService.js'

const router = useRouter()

const swal = useSwal()

const isLoading = ref(false)

const errorList = reactive([])

const route = useRoute()

const productId = route.params.id

const productObj = reactive({
  name: '',
  description: '',
  price: 0,
  category: 'Granite',
  salePrice: 0,
  bestSeller: false,
  tags: '',
  image: 'https://placehold.co/600x400',
})

const fetchProductById = async (id) => {
  //fetch product logic here
  try {
    const res = await getProductById(id)
    Object.assign(productObj, { ...res.data, tags: res.data.tags.join(', ') })
  } catch (error) {
    console.error('Error fetching product by ID:', error)
  }
  //populate productObj with fetched data
}

const handleErrors = () => {
  errorList.length = 0
  //validation logic here
  if (productObj.name.length < 3) {
    errorList.push('Name should have minimum 3 char.')
  }
  if (productObj.price < 0) {
    errorList.push('Price should be a positive number.')
  }
  if (productObj.category === '') {
    errorList.push('Please select a category.')
  }
}

const handleSubmit = async () => {
  try {
    handleErrors()
    if (errorList.length > 0) {
      return
    }
    isLoading.value = true
    const product = {
      ...productObj,
      tags: productObj.tags.split(',').map((tag) => tag.trim()),
    }
    if (productId) {
      //update product logic here
      await updateProduct(productId, product)
      //call update API and pass productId and product
      //show success message
      swal.showSuccess('Product updated successfully')
    } else {
      await addProduct(product)
      swal.showSuccess('Product added successfully')
    }
    router.push({ name: APP_ROUTE_NAMES.PRODUCTS_LIST })
  } catch (error) {
    console.error('Error adding product:', error)
    swal.showError('Failed to add product. Please try again.')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (productId) {
    fetchProductById(productId)
  }
})
</script>
