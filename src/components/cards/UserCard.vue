<script setup lang="ts">
import type { ProfileResponse } from '@/types'
import bolt from '@/assets/electric_bolt.svg'
import { calculateAge } from '@/utils/dateUtils'
import {computed} from "vue";


interface Props {
  profile: ProfileResponse
  style?: Record<string, string | number>
}

const props = defineProps<Props>()

const age = computed(() => calculateAge(props.profile.birthdate))

defineEmits<{
  like: []
  dislike: []
  touchstart: [event: TouchEvent]
  touchmove: [event: TouchEvent]
  touchend: []
  mousedown: [event: MouseEvent]
}>()
</script>

<template>
  <article
      class="user-card"
      :style="style"
      @touchstart="$emit('touchstart', $event)"
      @touchmove="$emit('touchmove', $event)"
      @touchend="$emit('touchend')"
      @mousedown="$emit('mousedown', $event)"
  >
    <img
        :src="profile.profilePictureUrl || '/default-avatar.png'"
        :alt="profile.vorname"
        class="profile-image"
    />

    <div class="card-content">
      <!-- Name & Studiengang -->
      <div class="header-info">
        <h2 class="user-name">{{ profile.vorname }}, {{ age }}</h2>
        <div class="study-info">
          <p class="study-info-content">{{ profile.course }} </p>
          <img class="study-info-content" :src="bolt">
          <p class="study-info-content">{{ profile.semester }}. Semester</p>
        </div>

      </div>

      <!-- Bio -->
      <p v-if="profile.bio" class="bio">{{ profile.bio }}</p>

      <!-- Fächer -->
      <div v-if="profile.subjects && profile.subjects.length > 0" class="section">
        <span class="section-label">Sucht Lernpartner für</span>
        <div class="chips">
          <span
              v-for="subject in profile.subjects.slice(0, 4)"
              :key="subject.id"
              class="chip"
          >
            {{ subject.name }}
          </span>
          <span v-if="profile.subjects.length > 4" class="chip more">
            +{{ profile.subjects.length - 4 }}
          </span>
        </div>
      </div>

      <!-- Sprachen -->
      <div v-if="profile.languages && profile.languages.length > 0" class="section">
        <span class="section-label">Sprachen</span>
        <div class="chips">
          <span
              v-for="language in profile.languages"
              :key="language.id"
              class="chip language"
          >
            {{ language.name }}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button
            class="action-btn dislike"
            @click.stop="$emit('dislike')"
            aria-label="Ablehnen"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <button
            class="action-btn like"
            @click.stop="$emit('like')"
            aria-label="Liken"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.user-card {
  position: absolute;
  bottom: 0;
  left: 50%;
  display: flex;
  flex-direction: column;
  width: 320px;
  min-height: 520px;
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  cursor: grab;
  user-select: none;
  will-change: transform;
  transform-origin: bottom center;
  overflow: hidden;
}

.user-card:active {
  cursor: grabbing;
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid rgba(115, 84, 225, 0.28);
  object-fit: cover;
  margin: 30px auto 30px;
  pointer-events: none;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px 20px 20px;
  margin-top: 12px;
  background: var(--gradient-primary);
  border-radius: 24px 24px 0 0;
  overflow: hidden;
}

/* Header */
.header-info {
  text-align: center;
  margin-bottom: 12px;
}

.user-name {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 20px;
}

.study-info {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.36);
  border-radius:10px;
}

.study-info-content {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.8rem;
  padding: 5px;
}

/* Bio */
.bio {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.85rem;
  font-weight: lighter;
  margin: 0 0 12px;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Sections */
.section {
  margin-bottom: 10px;
}

.section-label {
  display: block;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

/* Chips */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  background: rgba(255, 255, 255, 0.36);
  color: white;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.chip.language {
  background: rgba(255, 255, 255, 0.36);
}

.chip.more {
  background: rgba(255, 255, 255, 0.36);
  font-weight: 600;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: auto;
  padding-top: 12px;
}

.action-btn {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.action-btn:hover {
  transform: scale(1.1);
}

.action-btn svg {
  width: 26px;
  height: 26px;
}

.action-btn.dislike {
  background: rgba(255, 255, 255, 0.36);
  color: #ffffff;
}

.action-btn.like {
  background: rgba(255, 255, 255, 0.36);
  color: #ffffff;
}
</style>