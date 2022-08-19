<template>
  <v-app>
    <v-app-bar app color="grey lighten-3">
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-5"
          contain
          src="https://icjia.illinois.gov/icjia-logo.png"
          transition="scale-transition"
          width="70"
        />

        <div style="font-size: 28px; color: #000; font-weight: 700">
          Web Content Status
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
