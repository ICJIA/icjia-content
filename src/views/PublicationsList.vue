<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div>
    <v-row>
      <v-container>
        <v-col>
          <div class="text-center mt-10">
            <h1>ICJIA Publication List</h1>
            <p style="color: #222; font-weight: 900">
              Please note: This listing does not include the
              <router-link to="/">agency content</router-link>
              or the
              <router-link to="/hub/"
                >research Hub articles, apps, and datasets.</router-link
              >
            </p>
          </div>
        </v-col>
      </v-container>
    </v-row>
    <div v-if="publications">
      <v-row
        ><v-container
          ><v-col>
            <div class="text-center mb-10 mt-2">
              <v-btn x-large dark class="blue darken-4" v-on:click="download()"
                >Download CSV<v-icon right>file_download</v-icon></v-btn
              >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <v-btn x-large v-on:click="downloadJSON()"
                >Download JSON<v-icon right>file_download</v-icon></v-btn
              >
            </div>
            <v-card class="elevation-5">
              <v-card-title class="elevation-5">
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>

              <v-data-table
                dense
                :search="search"
                :headers="headers"
                :items="publications"
                item-key="uuid"
                class="elevation-5"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :footer-props="{
                  'items-per-page-options': [100, 150, 200, 250, 500],
                }"
                :items-per-page="200"
                id="contentTable"
              >
                <template v-slot:item.readableDate="{ item }">
                  <div
                    style="
                      font-size: 14px;
                      font-weight: 400;
                      width: 210px;
                      color: #555;
                    "
                  >
                    {{ item.readableDate }}
                  </div>
                </template>
                <template v-slot:item.fullPath="{ item }">
                  <div style="font-size: 14px; color: #555">
                    <a target="_blank" :href="item.fullPath">{{
                      item.fullPath
                    }}</a>
                  </div>
                </template>
                <template v-slot:item.pubType="{ item }">
                  <div
                    style="
                      font-size: 14px;
                      font-weight: 400;
                      width: 200px;
                      color: #555;
                    "
                  >
                    {{ item.pubType }}
                  </div>
                </template>
                <template v-slot:item.title="{ item }">
                  <div style="font-size: 14px; font-weight: 700; color: #555">
                    <!-- <span v-if="isItNew(item)">
                      <v-chip
                        v-if="isItNew(item)"
                        label
                        x-small
                        color="#0D4474"
                        class="mr-2"
                        style="margin-top: 0px"
                      >
                        <span style="color: #fff !important; font-weight: 400">
                          UPDATED!
                        </span>
                      </v-chip></span
                    > -->
                    {{ item.title }}
                  </div>
                </template>
              </v-data-table>
            </v-card>
          </v-col></v-container
        ></v-row
      >
    </div>
    <div v-else>
      <v-container fill-height fluid>
        <v-row align="center" justify="center">
          <v-col>
            <div class="text-center mt-10">
              <v-progress-circular
                indeterminate
                color="blue"
                :size="70"
                :width="7"
              ></v-progress-circular></div
          ></v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
// import { getPublicationType } from "@/lib/utils";
// import { EventBus } from "@/event-bus";
import _ from "lodash";
// import moment from "moment";
import axios from "axios";
import NProgress from "nprogress";
export default {
  metaInfo() {
    return {
      title: "Publications",
    };
  },
  data() {
    return {
      sortBy: "readableDate",
      sortDesc: true,
      page: 1,
      expanded: [],
      search: "",
      singleExpand: true,
      publications: null,
      // getPublicationType,
      tableLoading: true,
      headers: [
        { text: "Updated", value: "readableDate" },
        // {
        //   text: "Published",
        //   align: "start",
        //   value: "published_at",
        // },
        { text: "Type", value: "pubType" },
        {
          text: "Title",
          align: "start",
          value: "title",
        },
        {
          text: "URL",
          align: "start",
          value: "fullPath",
        },

        // {
        //   text: "Article",
        //   value: "articleURL",
        //   align: "center",
        //   sortable: false,
        // },
        // {
        //   text: "File",
        //   value: "fileURL",
        //   align: "center",
        //   sortable: false,
        // },
      ],
    };
  },
  watch: {
    page(newValue) {
      console.log("paginate: ", newValue);
      // setTimeout(fixExpandButtons, 2000);
      // console.log("a11y expand button: hacky fix (paginate)");
      this.$vuetify.goTo("#pubTable", { offset: 350 });
    },
    tableLoading(newValue) {
      console.log("table loading: ", newValue);
      //TODO: This works for siteImprove a11y -- but need to adjust this hacky fix
      // setTimeout(fixExpandButtons, 2000);
      // console.log("a11y expand button: hacky fix (original load)");
    },
  },
  mounted() {
    window.NProgress.start();
    this.fetchPublications();

    // fixExpandButtons();
    NProgress.done();
    this.tableLoading = false;
  },
  methods: {
    // registerDownload(url) {
    //   var domain = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "");
    //   domain = domain.split("/")[0];
    //   let analyticsURL = url.replace(domain, "").replace("https://", "");
    //   //console.log(analyticsURL);
    //   window.plausible("file_download", { props: { url: analyticsURL } });
    // },
    async fetchPublications() {
      if (this.$myApp.publications && this.$myApp.publications.length) {
        this.publications = this.$myApp.publications;
        console.warn("Publications cached...");
        this.tableLoading = false;
        window.NProgress.done();
        return;
      } else {
        console.warn("Fetching publications...");
      }

      const limit = 500;
      let pubArray = [];
      let start = 0;
      let count = await axios.get(
        `https://agency.icjia-api.cloud/publications/count`
      );
      count = count.data;
      let iterations = Math.ceil(count / limit);
      for (let i = 0; i < iterations; i++) {
        let response = await axios.get(
          `https://agency.icjia-api.cloud/publications?_limit=${limit}&_start=${start}`
        );
        pubArray = pubArray.concat(response.data);
        start += limit;
      }
      pubArray = _.uniqBy(pubArray, "id");

      let publications = pubArray.map((p) => {
        let obj = {
          ...p,
          readableDate: window
            .dayjs(p.updated_at)
            .format("YYYY-MM-DD HH:mm:ssa"),
          fullPath: "https://icjia.illinois.gov/about/publications/" + p.slug,
          altTitle: p.title.toLowerCase(),
          localArticlePath:
            p.articleURL && p.articleURL.includes("https://icjia.illinois.gov")
              ? p.articleURL.replace("https://icjia.illinois.gov", "")
              : null,
          //fullPath: `/about/publications/${p.slug}`,
          contentType: "publication",
        };
        return obj;
      });
      this.publications = _.orderBy(publications, ["updated_at"], ["desc"]);
      this.$myApp.publications = this.publications;
      window.NProgress.done();
    },
  },
};
</script>

<style lang="scss" scoped></style>
