<script setup lang="ts">
import { ref, onMounted, onActivated} from 'vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { fetchMyMatches } from '@/services/userService.ts'
import type { Match } from '@/types'

const matches = ref<Match[]>([])
const loading = ref(false)

async function loadMatches(): Promise<void> {
  loading.value = true
  try {
    matches.value = await fetchMyMatches()
  } catch (error) {
    console.error('Fehler beim Laden der Matches:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMatches()
})

onActivated(() => {
  loadMatches()
})
</script>

<template>
  <div class="matches-tab">
    <h1 class="title">Deine Matches</h1>

    <div v-if="loading" class="center-content">
      <LoadingSpinner />
    </div>

    <div v-else-if="matches.length === 0" class="center-content">
      <p class="empty-message">Noch keine Matches</p>
      <p class="hint">Swipe weiter, um Matches zu finden!</p>
    </div>

    <div v-else class="matches-list">
      <article 
        v-for="match in matches" 
        :key="match.matchId"
        class="match-card"
      >
        <img 
          :src="match.profilePictureUrl || '/default-avatar.png'"
          class="avatar"
        />
        <div class="info">
          <h3>{{ match.otherUserVorname }}</h3>
        </div>
        <button class="message-btn">
          Nachricht
        </button>
      </article>
    </div>
  </div>
</template>

<style scoped>
.matches-tab {
  //padding: 20px;
}

.title {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.center-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  gap: 8px;
}

.empty-message {
  color: #666;
  font-size: 1.125rem;
}

.hint {
  color: #999;
  font-size: 0.875rem;
}

.matches-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.match-card {
  width: 400px;
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.info {
  flex: 1;
}

.info h3 {
  margin: 0;
  font-size: 1rem;
}

.info p {
  margin: 4px 0 0;
  color: #666;
  font-size: 0.75rem;
}

.message-btn {
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.message-btn:hover {
  transform: scale(1.05);
}

@media (max-width: 480px) {
  .match-card{
    width: 100%;
    display: flex;
    align-items: center;
    //gap: 16px;
    background: white;
    border-radius: 16px;
    //padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}
</style>
