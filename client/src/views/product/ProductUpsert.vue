<template>
  <form class="container p-3 p-md-4 border rounded-3 my-4 shadow-sm" @submit.prevent="handleSubmit">
    <div class="d-flex flex-column flex-md-row gap-4">
      <!-- LEFT: FORM -->
      <div class="flex-fill">
        <h2 class="text-center text-success">{{ productId ? 'Update' : 'Create' }} Product</h2>
        <hr />

        <div class="alert alert-danger" v-if="errorList.length > 0">
          <p>Please resolve following errors to continue.</p>
          <ul class="mb-0">
            <li v-for="(error, index) in errorList" :key="index">
              {{ error }}
            </li>
          </ul>
        </div>

        <!-- Name -->
        <div class="mb-3">
          <label class="form-label">Name</label>
          <input type="text" class="form-control" v-model.trim="productObj.name" />
        </div>

        <!-- Description -->
        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea class="form-control" rows="3" v-model="productObj.description"></textarea>
        </div>

        <!-- Price + Sale Price (2 columns on md+) -->
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Price</label>
            <input type="number" class="form-control" v-model.number="productObj.price" />
          </div>

          <div class="col-md-6 mb-3">
            <label class="form-label">Sale Price</label>
            <input type="number" class="form-control" v-model.number="productObj.salePrice" />
          </div>
        </div>

        <!-- Tags -->
        <div class="mb-3">
          <label class="form-label">Tags</label>
          <input type="text" class="form-control" v-model="productObj.tags" />
        </div>

        <!-- Best Seller -->
        <div class="form-check form-switch mb-3">
          <input
            id="bestSellerCheck"
            class="form-check-input"
            type="checkbox"
            v-model="productObj.bestSeller"
          />
          <label for="bestSellerCheck" class="form-check-label">Best Seller</label>
        </div>

        <!-- Category -->
        <div class="mb-3">
          <label class="form-label">Category</label>
          <select class="form-select" v-model="productObj.category">
            <option v-for="category in PRODUCT_CATEGORIES" :key="category">
              {{ category }}
            </option>
          </select>
        </div>

        <!-- Image -->
        <div class="mb-3">
          <label class="form-label">Image</label>
          <input class="form-control" type="file" @change="onImageChange" />
        </div>

        <!-- Buttons -->
        <div class="d-flex flex-column flex-md-row gap-2">
          <button type="submit" class="btn btn-success px-4 w-100 w-md-auto">
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            Submit
          </button>

          <router-link
            :to="{ name: APP_ROUTE_NAMES.PRODUCTS_LIST }"
            class="btn btn-secondary px-4 w-100 w-md-auto"
          >
            Cancel
          </router-link>
        </div>
      </div>

      <!-- RIGHT: IMAGE PREVIEW -->
      <div class="text-center text-md-end">
        <img
          v-if="previewImage"
          :src="previewImage"
          class="img-fluid rounded shadow-sm"
          style="max-width: 200px"
        />
      </div>
    </div>
  </form>
</template>
<script setup>
import { reactive, ref, onMounted } from 'vue'

import { PRODUCT_CATEGORIES } from '@/constants/appConstants.js'
import { useSwal } from '../../utility/useSwal.js'
import { addProduct, updateProduct, imageUpload } from '@/services/productService.js'
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
  image: null,
})

const imageFile = ref(null)
const previewImage = ref('https://placehold.co/600x400')

const onImageChange = (e) => {
  imageFile.value = e.target.files[0]
  previewImage.value = URL.createObjectURL(imageFile.value)
  uploadImage(imageFile.value)
}

const uploadImage = async (imageFileValue) => {
  if (!imageFileValue) {
    alert('Please select an image first')
    return
  }

  const formData = new FormData()
  formData.append('image', imageFileValue)
  try {
    const res = await imageUpload(formData)
    productObj.image = res.imageUrl
    swal.showSuccess('Image Uploaded Successfully!')
  } catch (error) {
    productObj.image = null
    console.error('Upload error:', error)
    swal.showError('Only JPEG/PNG/WEBP allowed!')
  }
}

const fetchProductById = async (id) => {
  //fetch product logic here
  try {
    const res = await getProductById(id)
    Object.assign(productObj, { ...res.data, tags: res.data.tags.join(', ') })
    previewImage.value = res.data.image
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
  if (productObj.tags === '') {
    errorList.push('Tag is required.')
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
