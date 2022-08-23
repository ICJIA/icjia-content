<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div>
    <v-row>
      <v-container>
        <v-col>
          <div class="text-center mt-10">
            <h1>ICJIA ResearchHub Content</h1>
            <p style="color: #222; font-weight: 900">
              Please note: This content listing does not include the
              <router-link to="/publications"
                >publications list items</router-link
              >
              or the
              <router-link to="/">general agency content.</router-link>
            </p>
          </div>
          <div v-if="hubContent">
            <div class="text-center mb-10 mt-10">
              <v-btn x-large dark class="blue darken-4" v-on:click="download()"
                >Download CSV<v-icon right>file_download</v-icon></v-btn
              >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <v-btn x-large v-on:click="downloadJSON()"
                >Download JSON<v-icon right>file_download</v-icon></v-btn
              >
            </div>
            <div style="font-size: 12px" class="text-right mb-2 mx-5">
              <span>Total items: </span>
              <span style="font-weight: 900">{{ hubContent.length }}</span>
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
                :items="hubContent"
                item-key="uuid"
                class="elevation-5"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :footer-props="{
                  'items-per-page-options': [100, 150, 200, 250, 500],
                }"
                :items-per-page="100"
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
                <template v-slot:item.fullPath="{ item }">
                  <div style="font-size: 14px; color: #555">
                    <a target="_blank" :href="item.fullPath">{{
                      item.fullPath
                    }}</a>
                  </div>
                </template>
              </v-data-table>
            </v-card>
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
        </v-col>
      </v-container>
    </v-row>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { GET_ALL_HUB_QUERY } from "@/graphql/hub";
import moment from "moment";
import _ from "lodash";
import nprogress from "nprogress";
import { EventBus } from "@/event-bus";
let FileSaver = require("file-saver");
export default {
  name: "HubContent",
  data() {
    return {
      error: null,
      loading: true,
      content: [],
      initialLoad: true,
      orientation: "grid",
      hubContent: null,
      sortBy: "readableDate",
      sortDesc: true,
      page: 1,

      search: "",
      headers: [
        // { text: "", value: "updated_at" },
        // { text: "id", value: "id" },
        { text: "Updated", value: "readableDate" },
        { text: "Type", value: "contentType" },
        {
          text: "Title",
          align: "start",
          sortable: true,
          value: "title",
        },
        { text: "URL", value: "fullPath" },
      ],
    };
  },

  methods: {
    progress() {
      nprogress.start();
      if (!this.$apollo.loading) {
        nprogress.done();
      }
    },
    toggle(e) {
      this.view = e;
      this.initialView = true;
      // console.log('view: ', this.view)
      this.resize();
      nprogress.done();
    },
    download() {
      const items = this.hubContent;
      items.forEach((object) => {
        delete object["readableDate"];
        delete object["abstract"];
      });
      const replacer = (key, value) => (value === null ? "" : value); // specify how you want to handle null values here
      const header = Object.keys(items[0]);
      const csv = [
        header.join(","), // header row first
        ...items.map((row) =>
          header
            .map((fieldName) => JSON.stringify(row[fieldName], replacer))
            .join(",")
        ),
      ].join("\r\n");
      let now = window.dayjs().format("YYYY-MM-DD-HH-mm-ss");
      try {
        let blob = new Blob([csv], { type: "text/plain;charset=utf-8" });
        FileSaver.saveAs(blob, "ICJIAResearchHubContent-" + now + ".csv");
        console.log("csv saved");
      } catch (e) {
        console.log("csv error");
      }

      // console.log(csv);
      //download csv file
    },
    downloadJSON() {
      let now = window.dayjs().format("YYYY-MM-DD_HH-mm-ss");
      try {
        let json = JSON.stringify(this.hubContent);
        let blob = new Blob([json], {
          type: "text/plain;charset=utf-8",
        });
        FileSaver.saveAs(blob, "ICJIAResearchHubContent-" + now + ".json");
        console.log("json saved");
      } catch (e) {
        console.log("json error");
      }
    },
  },
  mounted() {
    nprogress.start();
  },
  apollo: {
    apps: {
      prefetch: true,
      // fetchPolicy: "no-cache",
      query: GET_ALL_HUB_QUERY,
      variables() {
        return {};
      },
      context: {
        uri: "https://researchhub.icjia-api.cloud/graphql",
      },
      error(error) {
        this.error = JSON.stringify(error.message);
      },
      result(ApolloQueryResult) {
        console.log(ApolloQueryResult.data.articles);
        console.log(ApolloQueryResult.data.apps);
        console.log(ApolloQueryResult.data.datasets);
        // this.initialLoad = false;
        let apps = ApolloQueryResult.data.apps;

        apps = apps.map((e) => ({
          ...e,
          fullPath: `https://icjia.illinois.gov/researchhub/apps/${e.slug}/`,
          contentType: "app",
          abstract: e.description,
          backendURL:
            "https://researchhub.icjia-api.cloud/admin/plugins/content-manager/article/" +
            e.id +
            "?redirectUrl=/plugins/content-manager/article?source=content-manager",
          readableDate: window
            .dayjs(e.updatedAt)
            .format("YYYY-MM-DD HH:mm:ssa"),
        }));

        let datasets = ApolloQueryResult.data.datasets;
        datasets = datasets.map((e) => ({
          ...e,
          fullPath: `https://icjia.illinois.gov/researchhub/datasets/${e.slug}/`,
          contentType: "dataset",
          abstract: e.description,
          readableDate: window
            .dayjs(e.updatedAt)
            .format("YYYY-MM-DD HH:mm:ssa"),
        }));

        let articles = ApolloQueryResult.data.articles;
        articles = articles.map((e) => ({
          ...e,
          fullPath: `https://icjia.illinois.gov/researchhub/articles/${e.slug}/`,
          contentType: "article",
          abstract: e.description,
          readableDate: window
            .dayjs(e.updatedAt)
            .format("YYYY-MM-DD HH:mm:ssa"),
        }));

        let content = [...articles, ...apps, ...datasets];
        this.hubContent = _.orderBy(content, ["updatedAt"], ["desc"]);
        // this.initialLoad = false;
        this.loading = false;
        nprogress.done();
      },
    },
  },
};
</script>
