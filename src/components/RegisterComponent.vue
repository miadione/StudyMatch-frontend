<script setup lang="ts">
import type {User} from '@/types'
import {ref} from 'vue'
import axios from 'axios'
import type {AxiosResponse} from 'axios'


const vorname = ref('')
const username = ref('')
const password = ref('')
const role = ref('USER')
const successMessage = ref('')
const errorMessage = ref('')

async function saveUser () {
  successMessage.value = ''
  errorMessage.value = ''
  try {

    const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL
    console.log('BaseUrl', baseUrl)
    const endpoint = baseUrl + '/api/auth/register'
    const data: User = {
      vorname: vorname.value,
      username: username.value,
      password: password.value,
      role: role.value
    }
    const response: AxiosResponse = await axios.post(endpoint, data);
    const responseData: User = response.data;
    console.log('Success:', responseData)
    successMessage.value = 'Registrierung erfolgreich!'

    vorname.value = ''
    username.value = ''
    password.value = ''
    role.value = 'USER'

  } catch (error) {
  console.error('Error:', error)
  errorMessage.value = 'Registrierung fehlgeschlagen! Bitte versuchen Sie es erneut.'
  }
}
</script>

<template>
  <h1>Register</h1>
  <div class="register-container">
    <div v-if="successMessage" style="color: green; margin-bottom: 10px;">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" style="color: red; margin-bottom: 10px;">
      {{ errorMessage }}
    </div>
    <input v-model="vorname" placeholder="Name" type="text">
    <input v-model="username" placeholder="Email" type="text">
    <input v-model="password" placeholder="Passwort" type="password" @keyup.enter="saveUser()">
    <button type="button" @click="saveUser()">Save</button>
  </div>

</template>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

input, select {
  margin: 5px;
  width: 150px;
  height: 30px;
  border: none;
  background: rgba(155, 155, 155, 0.28);
  border-radius: 5px;
}

button {
  width: 40px;
  height: 20px;
  border: none;
  background: #d2aef6;
  border-radius: 10px;
}
</style>