<script setup lang="ts">
import { ref, onMounted, onUnmounted, type Ref } from "vue";
import axios, { type AxiosResponse } from "axios";
import type { User } from "@/types.ts";

const users: Ref<User[]> = ref([]);
const currentIndex = ref(0);
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const startPos = ref({ x: 0, y: 0 });

// Daten abrufen
async function loadUsers() {
  try {
    const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
    const endpoint = baseUrl + '/users';
    const response: AxiosResponse = await axios.get(endpoint);
    users.value = response.data.map((user: User) => ({
      ...user,
      img: user.img
    }));
    console.log('Users loaded with placeholders:', users.value);
  } catch (error) {
    console.error('Fehler beim Laden der Users:', error);
  }
}

function getCardStyle(index: number) {
  const position = index - currentIndex.value;

  console.log(`Rendering card ${index}: position=${position}, currentIndex=${currentIndex.value}`);

  if (position < 0 || position > 2) {
    return {
      display: 'none',
      zIndex: 0
    };
  }

  const isTopCard = position === 0;
  const baseTransform = `translateX(-50%) translateY(-${position * 20}px) scale(${1 - position * 0.1})`;  // Umgedrehter Y-Offset für unten-fixierten Stapel

  if (isTopCard && isDragging.value) {
    const rotation = dragOffset.value.x * 0.15;  // Etwas stärkere Rotation für besseren Effekt
    return {
      zIndex: 10,
      transform: `translateX(-50%) translateX(${dragOffset.value.x}px) rotate(${rotation}deg)`,
      transition: 'none',
      display: 'flex'
    };
  }

  return {
    zIndex: 3 - position,
    transform: baseTransform,
    opacity: 1,
    transition: 'all 0.3s ease',
    display: 'flex'
  };
}

function handleTouchStart(e: TouchEvent, index: number) {
  if (index !== currentIndex.value || !e.touches[0]) return;
  isDragging.value = true;
  startPos.value = { x: e.touches[0].clientX, y: e.touches[0].clientY };
}

function handleTouchMove(e: TouchEvent, index: number) {
  if (!isDragging.value || index !== currentIndex.value || !e.touches[0]) return;
  dragOffset.value = {
    x: e.touches[0].clientX - startPos.value.x,
    y: 0  // Vertikale Bewegung deaktiviert
  };
}

function handleTouchEnd(index: number) {
  if (!isDragging.value || index !== currentIndex.value) return;
  const threshold = 100;
  if (Math.abs(dragOffset.value.x) > threshold) {
    const direction = dragOffset.value.x > 0 ? 'right' : 'left';
    animateCardOut(direction);
  } else {
    dragOffset.value = { x: 0, y: 0 };
    isDragging.value = false;
  }
}

function handleMouseDown(e: MouseEvent, index: number) {
  if (index !== currentIndex.value) return;
  isDragging.value = true;
  startPos.value = { x: e.clientX, y: e.clientY };
}

function handleMouseMove(e: MouseEvent) {
  if (!isDragging.value) return;
  dragOffset.value = {
    x: e.clientX - startPos.value.x,
    y: 0  // Vertikale Bewegung deaktiviert
  };
}

function handleMouseUp() {
  if (!isDragging.value) return;
  const threshold = 100;
  if (Math.abs(dragOffset.value.x) > threshold) {
    const direction = dragOffset.value.x > 0 ? 'right' : 'left';
    animateCardOut(direction);
  } else {
    dragOffset.value = { x: 0, y: 0 };
    isDragging.value = false;
  }
}

function animateCardOut(direction: 'left' | 'right') {
  const multiplier = direction === 'right' ? 1 : -1;
  dragOffset.value = { x: multiplier * 500, y: 0 };  // Keine y-Bewegung beim Auswurf
  setTimeout(() => {
    currentIndex.value++;
    dragOffset.value = { x: 0, y: 0 };
    isDragging.value = false;
  }, 300);
}

function handleLike() {
  animateCardOut('right');
}

function handleDislike() {
  animateCardOut('left');
}

onMounted(() => {
  loadUsers();
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
});
</script>

<template>
  <section class="main-container">
    <div v-if="users.length === 0" class="no-more-cards">
      <p>Keine Daten geladen – überprüfe den Backend-Endpoint</p>
    </div>
    <div
        v-for="(user, index) in users"
        :key="user.username"
        class="card"
        :style="getCardStyle(index)"
        @touchstart="handleTouchStart($event, index)"
        @touchmove="handleTouchMove($event, index)"
        @touchend="handleTouchEnd(index)"
        @mousedown="handleMouseDown($event, index)"
    >
      <img :src="user.img" class="profile-pic" alt="Profile picture">
      <div class="details">
        <h1 class="name">{{ user.vorname }}</h1>
        <div class="contact">
          <div class="bez">
            <p>Contact</p>
          </div>
          <div class="email">
            {{ user.username }}
          </div>
        </div>
        <div class="buttons">

          <div class="dislike" @click.stop="handleDislike">
            <img src="@/assets/dislike.svg" alt="Dislike">
          </div>
          <div class="like" @click.stop="handleLike">
            <img src="@/assets/like.svg" alt="Like">
          </div>
        </div>
      </div>
    </div>
    <div v-if="currentIndex >= users.length && users.length > 0" class="no-more-cards">
      <p>Keine weiteren Karten</p>
    </div>
  </section>
</template>

<style scoped>
.main-container {
  position: relative;
  width: 100%;
  height: 600px;
  display: flex;
  align-items: flex-end;  /* Aligniert den Inhalt unten */
  justify-content: center;
  /* overflow: hidden; entfernt, um Clipping zu vermeiden */
}

.card {
  position: absolute;
  bottom: 0;  /* Fixiert unten */
  left: 50%;  /* Horizontal zentriert */
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 500px;
  background: #f1f0f0;
  align-items: center;
  gap: 20px;
  padding-top: 3rem;
  border-radius: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  cursor: grab;
  user-select: none;
  will-change: transform;
  transform-origin: bottom center;  /* Rotation um unteren Mittelpunkt */
}

.card:active {
  cursor: grabbing;
}

.profile-pic {
  padding: 5px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 5px solid rgba(35, 106, 163, 0.55);
  pointer-events: none;
  object-fit: cover;
}

.details {
  padding: 1rem;
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(14, 41, 112, 0.63);
  border-radius: 25px;
}

.contact {
  display: flex;
  padding: 20px;
  color: white;
  font-weight: bolder;
}

.contact .bez {
  display: flex;
  align-items: center;
  height: 30px;
  border-radius: 5px;
  padding: 5px;
  margin: 10px;
}

.contact .email {
  min-width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  background: #ffffff;
  border-radius: 10px;
  padding: 2px;
  margin: 10px;
  color: #181818;
}

.bez p {
  color: white;
  font-weight: bold;
  text-transform: uppercase;
}

.name {
  color: white;
  font-weight: bold;
}

.buttons {
  padding-top: 50px;
  padding-left: 10px;
  padding-right: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.buttons .like img,
.buttons .dislike img {
  width: 30px;
  height: 30px;
  cursor: pointer;
  transition: transform 0.2s;
}

.buttons .like:hover img,
.buttons .dislike:hover img {
  transform: scale(1.2);
}

.no-more-cards {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 1.2rem;
}
</style>