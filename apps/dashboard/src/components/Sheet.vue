<script setup>
import { watch } from 'vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:open', 'close'])

const close = () => {
  emit('update:open', false)
  emit('close')
}

// Prevent body scroll when sheet is open
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="open" class="sheet-container">
        <div class="sheet-overlay" @click="close"></div>
        <div class="sheet-panel">
          <div class="sheet-header">
            <h2 class="sheet-title">{{ title }}</h2>
            <button type="button" class="sheet-close" @click="close" aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
          <div class="sheet-body">
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.sheet-container {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.sheet-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
}

.sheet-panel {
  position: relative;
  width: 100%;
  max-width: 500px;
  height: 100%;
  background: var(--bg-card);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border);
  background: var(--bg-elevated);
}

.sheet-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.sheet-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s;
}

.sheet-close:hover {
  background: var(--bg);
  color: var(--text);
}

.sheet-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

/* Transitions */
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s ease;
}

.sheet-enter-active .sheet-panel,
.sheet-leave-active .sheet-panel {
  transition: transform 0.25s ease;
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

.sheet-enter-from .sheet-panel,
.sheet-leave-to .sheet-panel {
  transform: translateX(100%);
}

.sheet-enter-to .sheet-panel,
.sheet-leave-from .sheet-panel {
  transform: translateX(0);
}
</style>
