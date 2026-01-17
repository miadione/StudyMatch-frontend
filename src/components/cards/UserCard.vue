<script setup lang="ts">
import type { ProfileResponse } from '@/types'

interface Props {
  profile: ProfileResponse
  style?: Record<string, string | number>
}

defineProps<Props>()

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
        <h2 class="user-name">{{ profile.vorname }}</h2>
        <p class="study-info">{{ profile.course }} • {{ profile.semester }}. Semester</p>
      </div>

      <!-- Bio -->
      <p v-if="profile.bio" class="bio">{{ profile.bio }}</p>

      <!-- Fächer -->
      <div v-if="profile.subjects && profile.subjects.length > 0" class="section">
        <span class="section-label">Sucht Lernpartner für</span>
        <div class="chips">
          <span
              v-for="subject in profile.subjects.slice(0, 3)"
              :key="subject.id"
              class="chip"
          >
            {{ subject.name }}
          </span>
          <span v-if="profile.subjects.length > 3" class="chip more">
            +{{ profile.subjects.length - 3 }}
          </span>
        </div>
      </div>

      <!-- Sprachen -->
      <div v-if="profile.languages && profile.languages.length > 0" class="section">
        <span class="section-label">Sprachen</span>
        <div class="chips">
          <span
              v-for="language in profile.languages.slice(0, 3)"
              :key="language.id"
              class="chip language"
          >
            {{ language.name }}
          </span>
          <span v-if="profile.languages.length > 3" class="chip more">
            +{{ profile.languages.length - 3 }}
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
  height: 520px;
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
  border: 4px solid rgba(102, 126, 234, 0.3);
  object-fit: cover;
  margin: 20px auto 0;
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
  min-height: 0;
}

/* Header */
.header-info {
  text-align: center;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.user-name {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.study-info {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
  margin: 4px 0 0;
}

/* Bio */
.bio {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.85rem;
  line-height: 1.4;
  margin: 0 0 12px;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-shrink: 0;
}

/* Sections */
.section {
  margin-bottom: 10px;
  flex-shrink: 0;
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
  flex-wrap: nowrap;
  gap: 6px;
  overflow: hidden;
}

.chip {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.chip.language {
  background: rgba(255, 255, 255, 0.15);
}

.chip.more {
  background: rgba(255, 255, 255, 0.3);
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
  background: white;
  color: #dc3545;
}

.action-btn.like {
  background: white;
  color: #28a745;
}
</style>