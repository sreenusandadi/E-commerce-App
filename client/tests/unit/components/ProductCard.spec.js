/* Prevent importing ProductDetail (which pulls services that use import.meta) */
jest.mock('@/components/product/ProductDetail.vue', () => ({
  template: '<div />',
}))

import { mount } from '@vue/test-utils'
import ProductCard from '@/components/product/ProductCard.vue'

const baseProduct = {
  id: 'p1',
  name: 'Lovely Rug',
  description: 'A very nice rug for your home',
  price: 45.5,
  category: 'Home',
  tags: ['wool', 'handmade'],
  image: 'https://example.com/rug.jpg',
  bestSeller: false,
}

describe('ProductCard.vue', () => {
  it('renders name, description and image', () => {
    const wrapper = mount(ProductCard, {
      props: { product: baseProduct },
      global: { stubs: { ProductDetail: true } },
    })
    expect(wrapper.text()).toContain('Lovely Rug')
    expect(wrapper.text()).toContain('A very nice rug for your home')
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(baseProduct.image)
  })

  it('falls back to placeholder image when product.image is missing', () => {
    const p = { ...baseProduct }
    delete p.image
    const wrapper = mount(ProductCard, {
      props: { product: p },
      global: { stubs: { ProductDetail: true } },
    })
    const img = wrapper.find('img')
    expect(img.attributes('src')).toContain('placehold.co')
  })

  it('shows bestseller badge when product.bestSeller is true', () => {
    const p = { ...baseProduct, bestSeller: true }
    const wrapper = mount(ProductCard, {
      props: { product: p },
      global: { stubs: { ProductDetail: true } },
    })
    expect(wrapper.text()).toContain('Bestseller')
    const star = wrapper.find('i.bi-star-fill')
    expect(star.exists()).toBe(true)
  })

  it('renders sale decoration and SALE text when salePrice exists', () => {
    const p = { ...baseProduct, salePrice: 30 }
    const wrapper = mount(ProductCard, {
      props: { product: p },
      global: { stubs: { ProductDetail: true } },
    })
    const priceEl = wrapper.find('.text-success')
    expect(priceEl.exists()).toBe(true)
    // inline style should set text-decoration to line-through
    expect(priceEl.element.style.textDecoration).toBe('line-through')
    expect(wrapper.text()).toContain('SALE!')
  })

  it('button data-bs-target includes product id', () => {
    const wrapper = mount(ProductCard, {
      props: { product: baseProduct },
      global: { stubs: { ProductDetail: true } },
    })
    const btn = wrapper.find('button[data-bs-toggle="modal"]')
    expect(btn.exists()).toBe(true)
    expect(btn.attributes('data-bs-target')).toBe(`#productDetailModal-${baseProduct.id}`)
  })

  it('renders category and tags as badges', () => {
    const wrapper = mount(ProductCard, {
      props: { product: baseProduct },
      global: { stubs: { ProductDetail: true } },
    })
    expect(wrapper.text()).toContain('Home')
    expect(wrapper.text()).toContain('wool')
    expect(wrapper.text()).toContain('handmade')
  })
})
