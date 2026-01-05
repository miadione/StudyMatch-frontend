<script setup lang="ts">
import type { TabId, NavTab } from '@/types'
import homeIcon from '@/assets/home.svg'
import likesIcon from '@/assets/likes.svg'
import matchesIcon from '@/assets/matches.svg'
import profileIcon from '@/assets/profile.svg'

interface Props {
  activeTab: TabId
}

defineProps<Props>()

const emit = defineEmits<{
  'update:activeTab': [tab: TabId]
}>()

const tabs: NavTab[] = [
  { id: 'home', label: 'Home', icon: homeIcon },
  { id: 'likes', label: 'Likes', icon: likesIcon },
  { id: 'matches', label: 'Matches', icon:matchesIcon},
  { id: 'profile', label: 'Profil', icon: profileIcon }
]

function selectTab(tabId: TabId): void {
  emit('update:activeTab', tabId)
}
</script>

<template>
  <nav class="bottom-navigation">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="nav-item"
      :class="{ active: activeTab === tab.id }"
      @click="selectTab(tab.id)"
    >
      <img :src="tab.icon" :alt="tab.label" class="icon" />
    </button>
  </nav>
</template>

<style scoped>
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: white;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 16px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
  border-radius: 12px;
}

.nav-item:hover {
  background: #f5f5f5;
}

.nav-item.active {
  color: #007bff;
}

.nav-item.active .icon {
  transform: scale(1.1);
}

.icon {
  font-size: 24px;
  transition: transform 0.2s ease;
}

.label {
  font-size: 11px;
  font-weight: 600;
}
</style>
