/**
 * useUsers Composable
 * 
 * Wiederverwendbare Logik für User-Listen und Swipe-Funktionalität
 */

import { ref, computed } from 'vue'
import type { User, MatchResponse } from '@/types'
import { fetchUsers, likeUser } from '@/services/userService'

export function useUsers() {
  const users = ref<User[]>([])
  const currentIndex = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Aktueller User im Stapel
  const currentUser = computed(() => users.value[currentIndex.value] ?? null)
  
  // Sind noch Karten übrig?
  const hasMoreCards = computed(() => currentIndex.value < users.value.length)

  async function loadUsers(): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      users.value = await fetchUsers()
    } catch (e) {
      error.value = 'Fehler beim Laden der Users'
      console.error('Fehler beim Laden der Users:', e)
    } finally {
      loading.value = false
    }
  }

  async function handleLike(userId: number): Promise<MatchResponse | null> {
    try {
      return await likeUser(userId)
    } catch (e) {
      console.error('Fehler beim Liken:', e)
      return null
    }
  }

  function nextCard(): void {
    if (hasMoreCards.value) {
      currentIndex.value++
    }
  }

  function reset(): void {
    currentIndex.value = 0
  }

  return {
    users,
    currentIndex,
    currentUser,
    hasMoreCards,
    loading,
    error,
    loadUsers,
    handleLike,
    nextCard,
    reset
  }
}
