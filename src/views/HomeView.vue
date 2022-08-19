<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div>
    <v-row>
      <v-container>
        <v-col>
          <div class="text-center mt-10">
            <h1>ICJIA Agency Content</h1>
            <p>
              Please note: The ICJIA agency content listing does not include the
              <router-link to="/publications"
                >publications list items</router-link
              >
              or the
              <router-link to="/hub/"
                >research Hub articles, apps, and datasets.</router-link
              >
            </p>
          </div>
          <div v-if="content">
            <div class="text-center mt-5 mb-8">
              <v-btn v-on:click="download()"
                >Download CSV<v-icon right>file_download</v-icon></v-btn
              >
            </div>
            <div style="font-size: 12px" class="text-right mb-2 mx-5">
              <span>Total items: </span>
              <span style="font-weight: 900">{{ content.length }}</span>
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
                :items="content"
                item-key="uuid"
                class="elevation-5"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :footer-props="{
                  'items-per-page-options': [100, 150, 200, 250, 500],
                }"
                :items-per-page="500"
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
import NProgress from "nprogress";

// eslint-disable-next-line no-unused-vars
import { v4 as uuidv4 } from "uuid";
import { GET_CONTENT_QUERY } from "@/graphql/content";
let FileSaver = require("file-saver");
import _ from "lodash";
// eslint-disable-next-line no-unused-vars
import { EventBus } from "@/event-bus";
export default {
  name: "HomeView",
  components: {},
  mounted() {},
  data() {
    return {
      sortBy: "readableDate",
      sortDesc: true,
      page: 1,
      content: null,
      search: "",
      headers: [
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
    generateKey() {
      let key = uuidv4();
      console.log(key);
    },
    download() {
      const items = this.content;
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
        FileSaver.saveAs(blob, "ICJIAWebContent-" + now + ".csv");
        console.log("csv saved");
      } catch (e) {
        console.log("csv error");
      }

      console.log(csv);
      //download csv file
    },
  },
  apollo: {
    posts: {
      prefetch: true,
      query: GET_CONTENT_QUERY,

      variables() {
        return {};
      },
      error(error) {
        this.error = JSON.stringify(error.message);
      },
      result(ApolloQueryResult) {
        NProgress.start();

        let sections = Object.keys(ApolloQueryResult.data);

        let allContent = [];
        let readableDateFormat = "YYYY-MM-DD HH:mm:ssa";
        sections.forEach((section) => {
          //console.log(section);
          ApolloQueryResult.data[section].forEach((item) => {
            let obj = item;
            // write a switch statement for sections
            switch (section) {
              case "posts":
                obj.uuid = uuidv4();
                obj.contentType = "posts";
                obj.fullPath = "https://icjia.illinois.gov/news/" + item.slug;
                obj.readableDate = window
                  .dayjs(item.updated_at)
                  .format(readableDateFormat);

                break;
              case "pages":
                obj.uuid = uuidv4();
                obj.contentType = "pages";
                obj.fullPath =
                  "https://icjia.illinois.gov/" +
                  item.category +
                  "/" +
                  item.slug;
                obj.readableDate = window
                  .dayjs(item.updated_at)
                  .format(readableDateFormat);
                break;

              case "biographies":
                obj.uuid = uuidv4();
                obj.contentType = "biographies";
                obj.fullPath =
                  "https://icjia.illinois.gov/" +
                  "about/biographies" +
                  "/" +
                  item.slug;
                obj.readableDate = window
                  .dayjs(item.updated_at)
                  .format(readableDateFormat);
                break;
              case "jobs":
                obj.uuid = uuidv4();
                obj.fullPath =
                  "https://icjia.illinois.gov/" +
                  "about/employment" +
                  "/" +
                  item.slug;
                obj.readableDate = window
                  .dayjs(item.updated_at)
                  .format(readableDateFormat);
                obj.contentType = "jobs";
                break;
              case "meetings":
                obj.uuid = uuidv4();
                obj.fullPath =
                  "https://icjia.illinois.gov/" +
                  "news/meetings" +
                  "/" +
                  item.slug;
                obj.readableDate = window
                  .dayjs(item.updated_at)
                  .format(readableDateFormat);
                obj.contentType = "meetings";
                break;
              case "grants":
                obj.uuid = uuidv4();
                obj.fullPath =
                  "https://icjia.illinois.gov/" +
                  "grants/funding" +
                  "/" +
                  item.slug;
                obj.contentType = "grants";
                obj.readableDate = window
                  .dayjs(item.updated_at)
                  .format(readableDateFormat);
                break;
              case "events":
                obj.uuid = uuidv4();
                obj.fullPath =
                  "https://icjia.illinois.gov/" + "events" + "/" + item.slug;
                obj.contentType = "events";
                obj.readableDate = window
                  .dayjs(item.updated_at)
                  .format(readableDateFormat);
                break;
              case "units":
                obj.uuid = uuidv4();
                obj.fullPath =
                  "https://icjia.illinois.gov/" +
                  "about/units" +
                  "/" +
                  item.slug;
                obj.contentType = "units";
                obj.readableDate = window
                  .dayjs(item.updated_at)
                  .format(readableDateFormat);
                break;
              case "programs":
                obj.uuid = uuidv4();
                obj.fullPath =
                  "https://icjia.illinois.gov/" +
                  "grants/programs" +
                  "/" +
                  item.slug;
                obj.contentType = "programs";
                obj.readableDate = window
                  .dayjs(item.updated_at)
                  .format(readableDateFormat);
                break;
            }

            allContent.push(obj);
            // this.content = item;
          });
        });
        //console.log(allContent);
        this.content = _.orderBy(allContent, ["updated_at"], ["desc"]);

        NProgress.done();
      },
    },
  },
};
</script>
