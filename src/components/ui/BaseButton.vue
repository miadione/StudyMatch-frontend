<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false
})

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    class="base-button"
    :class="[
      `variant-${variant}`,
      `size-${size}`,
      { 'full-width': fullWidth, 'is-loading': loading }
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="loader"></span>
    <span v-else class="content">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Sizes */
.size-sm {
  padding: 6px 12px;
  font-size: 0.875rem;
}

.size-md {
  padding: 10px 20px;
  font-size: 1rem;
}

.size-lg {
  padding: 14px 28px;
  font-size: 1.125rem;
}

/* Variants */
.variant-primary {
  background-color: #007bff;
  color: white;
}

.variant-primary:hover:not(:disabled) {
  background-color: #4d4b69;
}

.variant-secondary {
  background-color: #1e1e1e;
  color: white;
}

.variant-secondary:hover:not(:disabled) {
  background-color: #545b62;
}

.variant-danger {
  background-color: #dc3545;
  color: white;
}

.variant-danger:hover:not(:disabled) {
  background-color: #c82333;
}

.variant-ghost {
  background-color: transparent;
  color: #007bff;
}

.variant-ghost:hover:not(:disabled) {
  background-color: rgba(0, 123, 255, 0.1);
}

/* Full Width */
.full-width {
  width: 200px;
}

/* Loading */
.loader {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
