<template>
  <div class="modern-card" :class="[variant, { elevated }]">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'glass', 'flat', 'gradient'].includes(v)
  },
  elevated: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.modern-card {
  border-radius: var(--radius-md);
  padding: 1.5rem;
  transition: all var(--transition-base);
  position: relative;
}

.modern-card.default {
  background: var(--bg-card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-md);
}

.modern-card.default:hover {
  border-color: var(--border-accent);
  box-shadow: 0 0 30px rgba(6, 182, 212, 0.15), var(--shadow-lg);
  transform: translateY(-2px);
}

.modern-card.glass {
  background: var(--bg-glass);
  border: 1px solid rgba(6, 182, 212, 0.2);
  backdrop-filter: blur(20px);
  box-shadow: var(--shadow-md);
}

.modern-card.flat {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  box-shadow: var(--shadow-sm);
}

.modern-card.gradient {
  background: linear-gradient(135deg, var(--bg-card) 0%, rgba(6, 182, 212, 0.05) 100%);
  border: 1px solid var(--border-accent);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.1), var(--shadow-md);
}

.modern-card.elevated {
  z-index: 10;
}
</style>
