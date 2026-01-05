<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import {useAuth} from "@/composables/useAuth.ts";

const router = useRouter()
const { login, loading, error } = useAuth()

const username = ref('')
const password = ref('')
const showSuccess = ref(false)

async function handleSubmit(): Promise<void> {
  const success = await login({
    username: username.value,
    password: password.value
  })

  if (success) {
    showSuccess.value = true

    // Kurz warten, dann weiterleiten
    setTimeout(() => {
      router.push('/users')
    }, 1500)
  }
}
</script>
<template>
  <div class="login-view">
    <img src="@/assets/studymatch_logo.svg" width="300" height="auto">
    <div class="login-card">
      <h1 class="title">Willkommen zurück</h1>

      <!-- Success State -->
      <div v-if="showSuccess" class="success-state">
        <LoadingSpinner :is-success="true" />
        <p>Erfolgreich angemeldet!</p>
      </div>

      <!-- Login Form -->
      <form v-else @submit.prevent="handleSubmit" class="login-form">
        <BaseInput
            class="input-field"
            v-model="username"
            label="E-Mail"
            type="email"
            placeholder="deine@email.de"
            required
        />

        <BaseInput
            class="input-field"
            v-model="password"
            label="Passwort"
            type="password"
            placeholder="••••••••"
            required
        />

        <p v-if="error" class="error-message">{{ error }}</p>

        <BaseButton
            type="submit"
            :loading="loading"
        >
          Anmelden
        </BaseButton>

        <p class="register-link">
          Noch kein Konto?
          <router-link to="/register">Registrieren</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--gradient-primary);
}

.login-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 24px;
  padding: 30px;
  margin-top: 50px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.title {
  text-align: center;
  margin: 0 0 32px;
  font-size: 1.5rem;
}

.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 0;
}

.success-state p {
  color: #105020;
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 20px;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin: 0;
  text-align: center;
}

.register-link {
  text-align: center;
  color: #666;
  font-size: 0.875rem;
  margin: 0;
}

.register-link a {
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
}

.register-link a:hover {
  text-decoration: underline;
}

.input-field{
  width: 100%;
}

</style>