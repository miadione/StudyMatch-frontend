<script setup lang="ts">
import { ref, onMounted, KeepAlive } from 'vue'
import type { TabId } from '@/types'
import BottomNavigation from '@/components/BottomNavigation.vue'
import HomeTab from '@/components/tabs/HomeTab.vue'
import LikesTab from '@/components/tabs/LikesTab.vue'
import MatchesTab from '@/components/tabs/MatchesTab.vue'
import ProfileTab from '@/components/tabs/ProfileTab.vue'
import { useAuth } from '@/composables/useAuth'

const activeTab = ref<TabId>('home')

const { currentUser, loadCurrentUser } = useAuth()

onMounted(() => {
  loadCurrentUser()
})


// Tab-Komponenten Mapping
const tabComponents = {
  home: HomeTab,
  likes: LikesTab,
  matches: MatchesTab,
  profile: ProfileTab
}
</script>

<template>
  <div class="main-layout">
    <!-- Header mit Begrüßung -->
    <header v-if="currentUser" class="app-header">
      <h1>Hallo, {{ currentUser.profile.vorname}}!</h1>
    </header>

    <!-- Tab Content -->
    <main class="tab-content">
      <KeepAlive>
        <component :is="tabComponents[activeTab]" />
      </KeepAlive>
    </main>

    <!-- Bottom Navigation -->
    <BottomNavigation v-model:active-tab="activeTab" />
  </div>
</template>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.app-header {
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #eee;
}

.app-header h1 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.tab-content {
  margin-top: 50px;
  display: flex;
  height: 100%;
  flex-direction: column;
  flex: 1;
  padding: 20px; /* Platz für Navigation */
  overflow-y: auto;
}
</style>
