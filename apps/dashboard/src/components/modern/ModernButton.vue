<template>
  <button 
    :class="[
      'modern-btn',
      `modern-btn--${variant}`,
      `modern-btn--${size}`,
      { 'modern-btn--disabled': disabled }
    ]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <span class="btn-content">
      <slot />
    </span>
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'ghost', 'soft', 'danger'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.modern-btn {
  position: relative;
  overflow: hidden;
  border: none;
  font-weight: 600;
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.modern-btn:not(.modern-btn--disabled):active {
  transform: scale(0.98);
}

.modern-btn--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Sizes */
.modern-btn--sm {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

.modern-btn--md {
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
}

.modern-btn--lg {
  padding: 1rem 2rem;
  font-size: 1rem;
}

/* Variants */
.modern-btn--primary {
  background: linear-gradient(135deg, var(--accent) 0%, #00d9ff 100%);
  color: var(--bg);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.4), var(--shadow-md);
}

.modern-btn--primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left var(--transition-base);
}

.modern-btn--primary:hover:not(.modern-btn--disabled) {
  background: linear-gradient(135deg, #00d9ff 0%, var(--accent-hover) 100%);
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(6, 182, 212, 0.6), var(--shadow-lg);
}

.modern-btn--primary:hover:not(.modern-btn--disabled)::before {
  left: 100%;
}

.modern-btn--secondary {
  background: var(--bg-elevated);
  color: var(--text);
  border: 1.5px solid var(--border);
}

.modern-btn--secondary:hover:not(.modern-btn--disabled) {
  border-color: var(--accent);
  background: var(--bg-hover);
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.2);
}

.modern-btn--ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 1.5px solid var(--border);
}

.modern-btn--ghost:hover:not(.modern-btn--disabled) {
  color: var(--text);
  border-color: var(--accent);
  background: rgba(6, 182, 212, 0.08);
}

.modern-btn--soft {
  background: var(--accent-light);
  color: var(--accent);
  border: 1px solid var(--border-accent);
}

.modern-btn--soft:hover:not(.modern-btn--disabled) {
  background: rgba(6, 182, 212, 0.25);
  border-color: var(--accent);
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.2);
}

.modern-btn--danger {
  background: var(--critical-light);
  color: var(--critical);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.modern-btn--danger:hover:not(.modern-btn--disabled) {
  background: rgba(239, 68, 68, 0.25);
  border-color: var(--critical);
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.2);
}
</style>
