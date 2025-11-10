<script setup lang="ts">
const users = [
  {
    uid : 1,
    vorname: "Mia",
    nachname: "Mitrovic",
    email: "mia@mitrovic.de",
    profile: "/src/assets/female_profile.jpg"
  },

  {
    uid: 2,
    vorname: "Laszlo",
    nachname: "Imanuel",
    email: "laszlo@imanuel.de",
    profile: "/src/assets/male_profile.jpg"
  }
]

</script>

<template>
  <section class="main-container">
    <div v-for="user in users" :key="user.uid" class="card">
      <img :src=user.profile class="profile-pic">
      <div class="details">
        <h1 class="name"> {{user.vorname}} {{user.nachname}}</h1>
        <div class="contact">
          <div class="bez">
            <p>Contact</p>
          </div>
          <div class="email">
            {{user.email}}
          </div>
        </div>
        <div class="buttons">
          <div class="like"><img src="@/assets/like.svg"></div>
          <div class="dislike"><img src="@/assets/dislike.svg"></div>
        </div>
      </div>
    </div>
  </section>

</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;

}

.card {
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 500px;
  background: #f1f0f0;
  align-items: center;
  gap: 20px;
  padding-top: 3rem;
  border-radius: 25px;
  margin: 20px;
}

.profile-pic {
  padding: 5px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 5px solid rgba(35, 106, 163, 0.55);
}
.details {
  padding: 1rem;
  width: 100%;
  height: 100%;
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
  width: 150px;
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

.bez p  {
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

.buttons .like img {
  width: 30px;
  height:30px;
  color: white;
}

.buttons .dislike img {
  width: 30px;
  height: 30px;
  color: white;
}
</style>