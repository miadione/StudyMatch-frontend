<script setup lang="ts">
import {ref, onMounted, computed} from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { getMyProfile} from '@/services/profileService'
import type {ProfileResponse} from "@/types.ts";
import { useAuth } from '@/composables/useAuth'
import {calculateAge} from "@/utils/dateUtils.ts";
import {GenderLabels} from "@/types.ts";

const router = useRouter()
const { logout } = useAuth()

const profile = ref<ProfileResponse | null>( null);
const loading = ref(false)
const error = ref<string | null>(null)


const age = computed(() => calculateAge(profile.value?.birthdate))

async function loadProfile(): Promise<void> {
  loading.value = true
  error.value = null

  try {
    profile.value = await getMyProfile()
  } catch (e) {
    console.error('Fehler beim Laden des Profils:', e)
    error.value = 'Profil konnte nicht geladen werden'
  } finally {
    loading.value = false
  }
}

function handleLogout(): void {
  logout()
  router.push('/login')
}

function editProfile(): void {
  router.push('/profile/edit')
}

onMounted(() => {
  loadProfile()
})
</script>

<template>
  <div class="profile-tab">
    <!-- Loading -->
    <div v-if="loading" class="center-content">
      <LoadingSpinner />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="center-content">
      <p class="error-message">{{ error }}</p>
      <BaseButton @click="loadProfile">Erneut versuchen</BaseButton>
    </div>

    <!-- Profile Content -->
    <template v-else-if="profile">
      <!-- Header mit Bild und Name -->
      <div class="profile-header">
        <img
            :src="profile.profilePictureUrl || '/default-avatar.png'"
            :alt="profile.vorname"
            class="avatar"
        />
        <h1 class="name">{{ profile.vorname }}</h1>
        <p class="subtitle">{{ profile.course }} ❖ {{ profile.semester }}. Semester</p>
      </div>

      <!-- Bio -->
      <div class="bio-container">
        <section v-if="profile.bio" class="profile-section">
          <h2 class="section-title">Über mich</h2>
          <p class="bio">{{ profile.bio }}</p>
        </section>
      </div>


      <!-- Fächer -->
      <div class="subjects-container">
        <section v-if="profile.subjects && profile.subjects.length > 0" class="profile-section">
          <h2 class="section-title">Suche Lernpartner für</h2>
          <div class="chips-container">
          <span
              v-for="subject in profile.subjects"
              :key="subject.id"
              class="chip"
          >
            {{ subject.name }}
          </span>
          </div>
        </section>
      </div>


      <!-- Sprachen -->
      <div class="languages-container">
        <section v-if="profile.languages && profile.languages.length > 0" class="profile-section">
          <h2 class="section-title">Sprachen</h2>
          <div class="chips-container">
          <span
              v-for="language in profile.languages"
              :key="language.id"
              class="chip"
          >
            {{ language.name }}
          </span>
          </div>
        </section>
      </div>

      <!-- Infos -->
      <div class="info-container">
        <section class="profile-section">
          <h2 class="section-title">Infos</h2>
          <div class="info-list">
            <div v-if="profile.gender" class="info-item">
              <span class="info-label">Geschlecht</span>
              <span class="info-value">{{ GenderLabels[profile.gender] }}</span>
            </div>
            <div v-if="profile.birthdate" class="info-item">
              <span class="info-label">Alter</span>
              <span class="info-value">{{ age }}</span>
            </div>
          </div>
        </section>
      </div>

      <!-- Actions -->
      <div class="profile-actions">
        <BaseButton variant="secondary" full-width @click="editProfile">
          Profil bearbeiten
        </BaseButton>

        <BaseButton variant="ghost" full-width @click="handleLogout">
          Ausloggen
        </BaseButton>
      </div>
    </template>
  </div>
</template>

<style scoped>
.profile-tab {
  padding: 0 5px 60px 5px;
}

.center-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  gap: 16px;
}

.error-message {
  color: #dc3545;
}

/* Header */
.profile-header {
  text-align: center;
  margin-bottom: 24px;
}

.avatar {
  width: 120px;
  height: 120px;
  background:
      linear-gradient(white, white) padding-box,
      var(--gradient-primary) border-box;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid transparent;
  margin-bottom: 16px;
}

.name {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.subtitle {
  color: #666;
  margin: 8px 0 0;
  font-size: 0.95rem;
}

/* Sections */
.profile-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #999;
  ////text-transform: uppercase;
  //letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.bio-container,
.subjects-container,
.languages-container,
.info-container {
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  background: #ffffff;
  padding: 10px;
  margin: 10px;
  box-shadow: 0px 1px 20px rgba(108, 117, 125, 0.27);
}
.bio {
  color: #333;
  line-height: 1.6;
  margin: 0;
}

/* Chips */
.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  padding: 8px 14px;
  background: var(--gradient-primary);
  color: white;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 500;
}

/* Info List */
.info-list {
  display: flex;
  flex-direction: column;
  //gap: 5px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  //border-bottom: 1px solid #eee;
}

.info-label {
  color: #666;
}

.info-value {
  font-weight: 500;
  color: #333;
}

/* Actions */
.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 32px;
  align-items: center;
  justify-content: center;
}
</style>