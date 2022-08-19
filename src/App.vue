<template>
  <v-app>
    <v-app-bar app color="grey lighten-3">
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <div style="font: 68px; color: #000; font-weight: 900">
          ICJIA Web Content Status
        </div>
      </div>

      <v-spacer></v-spacer>
      <v-btn to="/" text large>Agency Content</v-btn>
      <v-btn to="/hub/" text large>Hub Content</v-btn>
      <v-btn to="/publications/" text large>Publications List</v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
};
</script>
