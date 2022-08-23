<template>
  <v-app>
    <v-app-bar app color="grey lighten-3">
      <div class="d-flex align-center">
        <v-img
          @click="
            $router.push('/').catch((err) => {
              $vuetify.goTo(0);
            })
          "
          alt="Vuetify Logo"
          class="pointer shrink mr-5"
          contain
          src="https://icjia.illinois.gov/icjia-logo.png"
          transition="scale-transition"
          width="70"
        />

        <div
          style="font-size: 28px; color: #000; font-weight: 700"
          class="pointer"
          @click="
            $router.push('/').catch((err) => {
              $vuetify.goTo(0);
            })
          "
        >
          ICJIA Web Content
        </div>
      </div>

      <v-spacer></v-spacer>
      <v-btn exact to="/" text large>Agency Content</v-btn>
      <v-btn exact to="/publications/" text large>Publications List</v-btn>
      <v-btn exact to="/hub/" text large>Hub Content</v-btn>

      <v-btn
        exact
        href="https://github.com/ICJIA/icjia-content"
        target="_blank"
        text
        large
        >GitHub<v-icon right>open_in_new</v-icon></v-btn
      >
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

<style>
.pointer {
  cursor: pointer;
}
</style>
