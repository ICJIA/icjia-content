import "regenerator-runtime/runtime";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { createProvider } from "./vue-apollo";
import nprogress from "nprogress";

Vue.config.productionTip = false;
nprogress.start();

import { myApp } from "./services/AppInit";
myApp.install = function () {
  Object.defineProperty(Vue.prototype, "$myApp", {
    get() {
      return myApp;
    },
  });
};
Vue.use(myApp);
console.log("App initialized.");
new Vue({
  router,
  store,
  vuetify,
  apolloProvider: createProvider(),
  render: (h) => h(App),
}).$mount("#app");
nprogress.done();
