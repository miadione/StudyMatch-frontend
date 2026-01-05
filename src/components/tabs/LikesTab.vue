<script setup lang="ts">
import { ref, onMounted, onActivated } from 'vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { fetchLikesReceived } from '@/services/userService'
import type { Like } from '@/types'

const likes = ref<Like[]>([])
const loading = ref(false)

async function loadLikes(): Promise<void> {
  loading.value = true
  try {
    likes.value = await fetchLikesReceived()
  } catch (error) {
    console.error('Fehler beim Laden der Likes:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadLikes()
})

onActivated( () => {
  loadLikes()
    })
</script>

<template>
  <div class="likes-tab">
    <h1 class="title">Deine Likes</h1>

    <div v-if="loading" class="center-content">
      <LoadingSpinner />
    </div>

    <div v-else-if="likes.length === 0" class="center-content">
      <p class="empty-message">Noch keine Likes erhalten</p>
    </div>

    <div v-else class="likes-grid">
      <article 
        v-for="like in likes" 
        :key="like.id" 
        class="like-card"
      >

        <div class="info">
          <h3>{{ like.fromUserVorname }}</h3>
          <p>{{ like.fromUserUsername }}</p>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.likes-tab {
  padding: 20px;
}

.title {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.center-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.empty-message {
  color: #666;
}

.likes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.like-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 12px;
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
</style>
