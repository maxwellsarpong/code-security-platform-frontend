import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// Both apps now share the same origin (localhost:5173), so localStorage is automatically shared
// No need for URL fragment auth passing anymore

createApp(App).use(router).mount('#app')
