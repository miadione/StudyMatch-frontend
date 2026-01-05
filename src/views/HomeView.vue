<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
</script>

<template>
  <div class="home-view">
    <div class="hero">
      <img src="@/assets/studymatch_logo.svg" width="300">
      <p class="tagline">Finde deinen perfekten Lernpartner</p>

      <div class="cta-buttons">
        <router-link to="/register">
          <BaseButton size="lg">
            Jetzt starten
          </BaseButton>
        </router-link>

        <router-link to="/login">
          <BaseButton variant="ghost" size="lg">
            Anmelden
          </BaseButton>
        </router-link>
      </div>
    </div>

    <div class="features">
      <div class="feature">
        <span class="icon">🎯</span>
        <h3>Swipe & Match</h3>
        <p>Finde Lernpartner durch einfaches Swipen</p>
      </div>

      <div class="feature">
        <span class="icon">📚</span>
        <h3>Gleiche Interessen</h3>
        <p>Verbinde dich mit Studierenden deines Fachs</p>
      </div>

      <div class="feature">
        <span class="icon">💬</span>
        <h3>Direkte Kommunikation</h3>
        <p>Chatte mit deinen Matches</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  min-height: 100vh;
  background: var(--gradient-primary);
  color: #000000;
}

.hero {
  text-align: center;
  padding: 80px 20px 60px;
}

.title {
  font-size: 3rem;
  margin: 0;
  font-weight: 800;
}

.tagline {
  font-size: 1.25rem;
  opacity: 0.9;
  margin: 16px 0 40px;
}

.cta-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-buttons a {
  text-decoration: none;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  padding: 40px 20px 80px;
  max-width: 900px;
  margin: 0 auto;
}

.feature {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px;
  text-align: center;
}

.feature .icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.feature h3 {
  margin: 0 0 8px;
  font-size: 1.25rem;
}

.feature p {
  margin: 0;
  opacity: 0.8;
  font-size: 0.875rem;
}
</style>
