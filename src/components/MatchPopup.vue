<script setup lang="ts">
interface Props {
  userName: string
  visible: boolean
}

defineProps<Props>()

defineEmits<{
  close: []
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="popup">
      <div v-if="visible" class="match-overlay" @click="$emit('close')">
        <div class="match-popup" @click.stop>
          <div class="confetti">🎉</div>
          <h2 class="title">Es ist ein Match!</h2>
          <p class="message">
            Du und <strong>{{ userName }}</strong> haben sich gegenseitig geliked!
          </p>
          <button class="close-btn" @click="$emit('close')">
            Weiter swipen
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.match-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.match-popup {
  background: var(--gradient-primary);
  color: white;
  padding: 40px;
  border-radius: 24px;
  text-align: center;
  max-width: 320px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.confetti {
  font-size: 48px;
  margin-bottom: 16px;
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 12px;
}

.message {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0 0 24px;
}

.close-btn {
  background: white;
  color: #667eea;
  border: none;
  padding: 12px 32px;
  border-radius: 24px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.close-btn:hover {
  transform: scale(1.05);
}

/* Transitions */
.popup-enter-active,
.popup-leave-active {
  transition: all 0.3s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}

.popup-enter-from .match-popup,
.popup-leave-to .match-popup {
  transform: scale(0.8);
}
</style>
