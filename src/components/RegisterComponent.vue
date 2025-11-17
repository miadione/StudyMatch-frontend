<template>
  <div>
    <h2>Registrieren</h2>

    <form @submit.prevent="register">

      <div>
        <label for="vorname">Vorname</label>
        <input id="vorname" v-model="vorname" type="text" required />
      </div>

      <div>
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" required />
      </div>

      <div>
        <label for="passwort">Passwort</label>
        <input id="passwort" v-model="passwort" type="password" required />
      </div>

      <button type="submit">Registrieren</button>

    </form>

    <p v-if="message">{{ message }}</p>
  </div>
</template>





<style scoped>

</style>