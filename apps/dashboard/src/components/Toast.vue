<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'success', // success, error, warning, info
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  message: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 4000 // Auto-dismiss after 4 seconds
  }
})

const emit = defineEmits(['update:show', 'close'])

const isVisible = ref(false)
let timeoutId = null

const close = () => {
  isVisible.value = false
  emit('update:show', false)
  emit('close')
  if (timeoutId) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}

watch(() => props.show, (newValue) => {
  isVisible.value = newValue
  
  if (newValue && props.duration > 0) {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    // Set new timeout for auto-dismiss
    timeoutId = setTimeout(() => {
      close()
    }, props.duration)
  }
})

onMounted(() => {
  isVisible.value = props.show
})
</script>

<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="isVisible" class="toast-container">
        <div class="toast" :class="`toast--${variant}`">
          <div class="toast-icon">
            <!-- Success Icon -->
            <svg v-if="variant === 'success'" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5"/>
              <path d="M6 10L9 13L14 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            
            <!-- Error Icon -->
            <svg v-else-if="variant === 'error'" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5"/>
              <path d="M10 6V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="10" cy="14" r="0.75" fill="currentColor"/>
            </svg>
            
            <!-- Warning Icon -->
            <svg v-else-if="variant === 'warning'" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2L2 17H18L10 2Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              <path d="M10 8V12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="10" cy="14.5" r="0.75" fill="currentColor"/>
            </svg>
            
            <!-- Info Icon -->
            <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5"/>
              <path d="M10 14V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <circle cx="10" cy="7" r="0.75" fill="currentColor"/>
            </svg>
          </div>
          
          <div class="toast-message">{{ message }}</div>
          
          <button type="button" class="toast-close" @click="close" aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  max-width: 400px;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  min-width: 300px;
}

.toast--success {
  border-color: rgba(52, 211, 153, 0.3);
  background: rgba(52, 211, 153, 0.08);
}

.toast--success .toast-icon {
  color: var(--success);
}

.toast--error {
  border-color: rgba(248, 113, 113, 0.3);
  background: rgba(248, 113, 113, 0.08);
}

.toast--error .toast-icon {
  color: var(--critical);
}

.toast--warning {
  border-color: rgba(250, 204, 21, 0.3);
  background: rgba(250, 204, 21, 0.08);
}

.toast--warning .toast-icon {
  color: var(--warning);
}

.toast--info {
  border-color: rgba(34, 211, 238, 0.3);
  background: rgba(34, 211, 238, 0.08);
}

.toast--info .toast-icon {
  color: var(--accent);
}

.toast-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.toast-message {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text);
  line-height: 1.4;
}

.toast-close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s;
}

.toast-close:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text);
}

/* Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

@media (max-width: 640px) {
  .toast-container {
    left: 1rem;
    right: 1rem;
    max-width: none;
  }
  
  .toast {
    min-width: auto;
  }
}
</style>
