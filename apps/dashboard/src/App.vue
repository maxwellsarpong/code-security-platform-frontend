<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardAuthService from './services/authService'

const router = useRouter()

onMounted(() => {
  // Since both apps are on the same server now, localStorage is automatically shared
  // No need to extract auth data from URL fragment
  
  // Check if user is authenticated
  const isAuthenticated = DashboardAuthService.isAuthenticated()
  
  // If not authenticated, the router guard will handle the redirect
  // No need to do anything here
})
</script>

<template>
  <router-view />
</template>
