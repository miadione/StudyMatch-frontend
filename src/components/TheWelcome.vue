<script setup lang="ts">


const items = [
    {
      uid : 1,
  vorname: "Mia",
  nachname: "Mitrovic",
  email: "mia@mitrovic.de",
  passwort: 123456},

  { uid: 2,
    vorname: "Laszlo",
    nachname: "Imanuel",
    email: "laszlo@imanuel.de",
    passwort: 123456}
]




</script>

<template>
  <table>
    <thead>
    <tr>
      <th> User Id</th>
      <th> Vorname </th>
      <th> Nachname </th>
      <th> Email</th>
      <th> Passwort</th>
    </tr>
    </thead>
    <tbody>
    <tr v-if="items.length === 0">
      <td colspan="2">No products yet</td>
    </tr>
    <tr v-for="item in items" :key="item.uid">
      <td>{{item.uid}}</td>
      <td>{{item.vorname}}</td>
      <td>{{item.nachname}}</td>
      <td>{{item.email}}</td>
      <td>{{item.passwort}} </td>
    </tr>

    </tbody>
  </table>

</template>

<style>
th {
  padding: 10px;
}

td {
  padding: 10px;
  text-align: center;

}

td,th {
  border: 1px solid darkgrey;
}




</style>
