<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import UserCard from '@/components/cards/UserCard.vue'
import MatchPopup from '@/components/MatchPopup.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { getDiscoverProfiles } from '@/services/profileService'
import { likeUser } from "@/services/userService.ts";
import { useSwipe } from '@/composables/useSwipe'
import type { ProfileResponse } from '@/types'


const profiles = ref<ProfileResponse[]>([])
const currentIndex = ref(0)
const loading = ref(false)
const hasMoreCards = computed(() => currentIndex.value < profiles.value.length)
const currentProfile = computed(() => profiles.value[currentIndex.value])
const showMatch = ref(false)
const matchedUserName = ref('')

async function loadProfiles(): Promise<void> {
  loading.value = true
  try {
    profiles.value = await getDiscoverProfiles()
    currentIndex.value = 0
  } catch (error) {
    console.error('Fehler beim Laden der Profile:', error)
  } finally {
    loading.value = false
  }
}

function nextCard(): void {
  if (currentIndex.value < profiles.value.length) {
    currentIndex.value++
  }
}

async function onSwipeRight(): Promise<void> {
  const profile = currentProfile.value
  if (!profile) return

  try {
    const result = await likeUser(profile.id)

    if (result?.isMatch && result.toUserVorname) {
      matchedUserName.value = result.toUserVorname
      showMatch.value = true
    }
  } catch (error) {
    console.error('Fehler beim Liken:', error)
  }

  nextCard()
}

function onSwipeLeft(): void {
  nextCard()
}

const {
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleMouseDown,
  swipeLeft,
  swipeRight,
  getCardStyle
} = useSwipe({
  onSwipeLeft,
  onSwipeRight
})

onMounted(() => {
  loadProfiles()
})
</script>

<template>
  <div class="home-tab">
    <div v-if="loading" class="center-content">
      <LoadingSpinner size="lg" />
    </div>

    <div v-else-if="profiles.length === 0" class="center-content">
      <p class="empty-message">Keine Profile gefunden</p>
      <button class="reload-btn" @click="loadProfiles">Neu laden</button>
    </div>

    <div v-else-if="!hasMoreCards" class="center-content">
      <p class="empty-message">Keine weiteren Profile</p>
      <button class="reload-btn" @click="loadProfiles">Neu laden</button>
    </div>

    <div v-else class="card-stack">
      <UserCard
          v-for="(profile, index) in profiles"
          :key="profile.id"
          :profile="profile"
          :style="getCardStyle(index, currentIndex)"
          @like="swipeRight"
          @dislike="swipeLeft"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
          @mousedown="handleMouseDown"
      />
    </div>

    <MatchPopup
        :visible="showMatch"
        :user-name="matchedUserName"
        @close="showMatch = false"
    />
  </div>
</template>

<style scoped>
.home-tab {
  padding: 20px;
  margin-top: 20px;
}

.center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
}

.empty-message {
  color: #666;
  font-size: 1.125rem;
}

.reload-btn {
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.reload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.card-stack {
  position: relative;
  width: 100%;
  min-height: 620px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 50px;
}
</style>