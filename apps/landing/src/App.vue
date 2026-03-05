<script setup>
import { onMounted } from 'vue'
import { useTheme } from './composables/useTheme'
import Toast from './components/Toast.vue'
import { useToast } from './composables/useToast'

const { initTheme } = useTheme()
const { toastState, hideToast } = useToast()

onMounted(() => {
  initTheme()
})
</script>

<template>
  <router-view />
  <Toast 
    v-model:show="toastState.show"
    :variant="toastState.variant"
    :message="toastState.message"
    @close="hideToast"
  />
</template>

<style scoped>
</style>
