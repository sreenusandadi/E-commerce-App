<template>
  <div>
    <div
      class="bg-success w-100 position-relative overflow-hidden mb-4 py-5 d-flex align-items-center hero-section"
    >
      <div class="position-absolute top-0 start-0 w-100 h-100"></div>

      <div class="container-fluid position-relative z-1">
        <div class="row justify-content-center text-center">
          <div class="col-lg-8 col-xl-7">
            <h1 class="display-4 fw-bold text-white mb-4">
              Your One-Stop Stone Shop
              <br class="d-none d-lg-block" />
              Premium Granite & Quartz for Every Style!
            </h1>
            <div class="input-group mt-3 mx-auto shadow-lg rounded-4" style="max-width: 700px">
              <input
                type="text"
                v-model="searchValue"
                class="form-control border-0 py-3 px-4 fs-5"
                placeholder="Search your favorite product..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="product-list" class="container">
      <h2 class="mb-5 text-center display-6">Discover Our Collection</h2>

      <div class="row g-3 mb-4 align-items-center">
        <div class="col-md-auto">
          <div class="d-flex flex-wrap gap-3">
            <button
              @click="selectedCategory = category"
              v-for="(category, index) in categoryList"
              :key="index"
              class="btn px-4 py-2"
              :class="{
                'btn-success text-white': category === selectedCategory,
                'btn-outline-success': category !== selectedCategory,
              }"
            >
              {{ category }}
            </button>
          </div>
        </div>
        <div class="col-md-auto ms-md-auto">
          <div class="dropdown">
            <button
              class="btn btn-outline-secondary d-flex align-items-center gap-2 px-4 py-2"
              type="button"
              data-bs-toggle="dropdown"
            >
              <i class="bi bi-sort-down"></i>
              <span class="text-capitalize">{{ selectedSortOption }}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow-sm">
              <li v-for="(sort, index) in SORT_OPTIONS" :key="index">
                <button
                  class="dropdown-item py-2 d-flex align-items-center gap-2"
                  @click="selectedSortOption = sort"
                >
                  <i class="bi"></i>
                  <span class="text-capitalize"> {{ sort }} </span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <div v-if="filteredProductList.length > 0" class="row g-4 pb-4">
          <ProductCard
            v-for="product in filteredProductList"
            :key="product.id"
            :product="product"
          />
        </div>
        <div v-else>
          <h3 class="text-center">No Products Found</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { getProducts } from '@/services/productService'
import ProductCard from '@/components/product/ProductCard.vue'
import {
  PRODUCT_CATEGORIES,
  SORT_OPTIONS,
  SORT_PRICE_LOW_HIGH,
  SORT_PRICE_HIGH_LOW,
  SORT_NAME_A_Z,
  SORT_NAME_Z_A,
} from '@/constants/appConstants.js'

const products = ref([])
const loading = ref(false)
const selectedSortOption = ref(SORT_OPTIONS[0])

const searchValue = ref('')

const selectedCategory = ref('All')
const categoryList = ref(['All', ...PRODUCT_CATEGORIES])

const fetchProducts = async () => {
  try {
    loading.value = true
    const response = await getProducts()
    products.value = response.data
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

const filteredProductList = computed(() => {
  let filtered = products.value

  if (selectedCategory.value !== 'All') {
    filtered = filtered.filter((product) => product.category === selectedCategory.value)
  }

  if (searchValue.value.trim() !== '') {
    filtered = filtered.filter((product) =>
      product.name.toLowerCase().includes(searchValue.value.trim().toLowerCase()),
    )
  }

  switch (selectedSortOption.value) {
    case SORT_PRICE_LOW_HIGH:
      filtered.sort((a, b) => a.price - b.price)
      break
    case SORT_PRICE_HIGH_LOW:
      filtered.sort((a, b) => b.price - a.price)
      break
    case SORT_NAME_A_Z:
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case SORT_NAME_Z_A:
      filtered.sort((a, b) => b.name.localeCompare(a.name))
      break
    default:
      break
  }

  return filtered
})

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.hero-section {
  background: linear-gradient(to right, #6a11cb, #2575fc);
  color: white;
  padding: 80px 0;
}
</style>
