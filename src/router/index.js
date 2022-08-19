import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import HubContent from "../views/HubContent.vue";
import PublicationsList from "../views/PublicationsList.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "homeView",
    component: HomeView,
  },
  {
    path: "/hub",
    name: "hubView",
    component: HubContent,
  },
  {
    path: "/publications",
    name: "pubView",
    component: PublicationsList,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
