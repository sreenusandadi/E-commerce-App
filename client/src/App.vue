<template>
  <div class="d-flex flex-column min-vh-100">
    <header-component />
    <div class="flex-grow-1"><RouterView /></div>
    <footer-component />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import HeaderComponent from '@/components/layout/HeaderComponent.vue'
import FooterComponent from '@/components/layout/FooterComponent.vue'
</script>

<style scoped></style>
