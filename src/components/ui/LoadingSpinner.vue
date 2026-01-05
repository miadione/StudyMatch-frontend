<script setup lang="ts">
interface Props {
  isSuccess?: boolean
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  isSuccess: false,
  size: 'md'
})

const sizeMap = {
  sm: '40px',
  md: '80px',
  lg: '120px'
}
</script>

<template>
  <div
      class="loading-container"
      :style="{ width: sizeMap[size], height: sizeMap[size] }"
  >
    <!-- Loading Circle -->
    <svg v-if="!isSuccess" class="loading-circle" viewBox="0 0 50 50">
      <circle
          cx="25"
          cy="25"
          r="20"
          stroke-dasharray="90, 150"
          stroke-dashoffset="0"
      />
    </svg>

    <!-- Success Checkmark -->
    <svg v-else class="success-checkmark" viewBox="0 0 50 50">
      <path d="M 15 25 L 22 32 L 35 19" />
    </svg>
  </div>
</template>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-circle {
  width: 100%;
  height: 100%;
  animation: spin 1s linear infinite;
}

.loading-circle circle {
  fill: none;
  stroke: var(--color-primary, #007bff);
  stroke-width: 4;
  stroke-linecap: round;
}

.success-checkmark {
  width: 100%;
  height: 100%;
  stroke: var(--color-success, #28a745);
  fill: none;
  stroke-width: 3;
  animation: scaleIn 0.5s ease-out;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>