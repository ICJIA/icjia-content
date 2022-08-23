<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div>
    <v-row>
      <v-container>
        <v-col>
          <div class="text-center mt-10">
            <h1>ICJIA Agency Content</h1>
            <p style="color: #222; font-weight: 900">
              Please note: This content listing does not include the
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
                <template v-slot:item.contentType="{ item }">
                  <div
                    style="
                      font-size: 14px;
                      font-weight: 400;
                      width: 120px;
                      color: #555;
                      text-transform: uppercase;
                    "
                  >
                    {{ item.contentType }}
                  </div>
                </template>

                <!-- <template v-slot:item.updated_at="{ item }">
                  <span v-if="isItNew(item)">
                    <v-chip
                      v-if="isItNew(item)"
                      label
                      x-small
                      color="#0D4474"
                      class="mr-2"
                      style="margin-top: 0px"
                    >
                      <span style="color: #fff !important; font-weight: 400">
                        RECENTLY UPDATED
                      </span>
                    </v-chip></span
                  >
                </template> -->
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
                    <span v-if="item.affiliation"
                      >{{ item.affiliation.toUpperCase() }}: </span
                    >{{ item.title }}
                  </div>
                </template>
                <template v-slot:item.fullPath="{ item }">
                  <div style="font-size: 14px; color: #555">
                    <a target="_blank" :href="item.fullPath">{{
                      item.fullPath
                    }}</a>
                  </div>
                </template>
                <template v-slot:item.backendURL="{ item }">
                  <!-- <div style="font-size: 14px; color: #555">
                    <a target="_blank" :href="item.backendURL">{{
                      item.backendURL
                    }}</a>
                  </div> -->
                  <v-btn text :href="item.backendURL" target="_blank"
                    ><v-icon>open_in_new</v-icon></v-btn
                  >
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
import moment from "moment";
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
        // { text: "", value: "updated_at" },
        { text: "Updated", value: "readableDate" },
        { text: "Type", value: "contentType" },
        {
          text: "Title",
          align: "start",
          sortable: true,
          value: "title",
        },
        { text: "URL", value: "fullPath" },
        { text: "Admin", value: "backendURL" },
      ],
    };
  },
  methods: {
    isItNew(item) {
      let targetDate;
      if (item.publicationDate) {
        targetDate = item.publicationDate;
      } else {
        targetDate = item.updated_at;
      }
      const now = moment(new Date());
      const end = moment(targetDate);
      const duration = moment.duration(now.diff(end));
      const days = duration.asDays();
      if (days <= 5) {
        return true;
      } else {
        return false;
      }
    },
    generateKey() {
      let key = uuidv4();
      console.log(key);
    },
    download() {
      const items = this.content;
      items.forEach((object) => {
        delete object["readableDate"];
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
        FileSaver.saveAs(blob, "ICJIAWebContent-" + now + ".csv");
        console.log("csv saved");
      } catch (e) {
        console.log("csv error");
      }

      console.log(csv);
      //download csv file
    },
    downloadJSON() {
      let now = window.dayjs().format("YYYY-MM-DD_HH-mm-ss");
      try {
        let json = JSON.stringify(this.content);
        let blob = new Blob([json], {
          type: "text/plain;charset=utf-8",
        });
        FileSaver.saveAs(blob, "ICJIAWebContent-" + now + ".json");
        console.log("json saved");
      } catch (e) {
        console.log("json error");
      }
    },
  },
  apollo: {
    posts: {
      prefetch: true,
      query: GET_CONTENT_QUERY,
      // fetchPolicy: "no-cache",
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
                obj.backendURL =
                  "https://agency.icjia-api.cloud/admin/plugins/content-manager/collectionType/application::post.post/" +
                  obj.id;
                obj.uuid = uuidv4();
                obj.contentType = "posts";
                obj.fullPath = "https://icjia.illinois.gov/news/" + item.slug;
                obj.readableDate = window
                  .dayjs(item.updated_at)
                  .format(readableDateFormat);

                break;
              case "pages":
                obj.backendURL =
                  "https://agency.icjia-api.cloud/admin/plugins/content-manager/collectionType/application::page.page/" +
                  obj.id;
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
                obj.backendURL =
                  "https://agency.icjia-api.cloud/admin/plugins/content-manager/collectionType/application::biography.biography/" +
                  obj.id;
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
                obj.backendURL =
                  "https://agency.icjia-api.cloud/admin/plugins/content-manager/collectionType/application::job.job/" +
                  obj.id;
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
                obj.backendURL =
                  "https://agency.icjia-api.cloud/admin/plugins/content-manager/collectionType/application::meeting.meeting/" +
                  obj.id;
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
                obj.backendURL =
                  "https://agency.icjia-api.cloud/admin/plugins/content-manager/collectionType/application::grant.grant/" +
                  obj.id;
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
                obj.backendURL =
                  "https://agency.icjia-api.cloud/admin/plugins/content-manager/collectionType/application::event.event/" +
                  obj.id;
                obj.uuid = uuidv4();
                obj.fullPath =
                  "https://icjia.illinois.gov/" + "events" + "/" + item.slug;
                obj.contentType = "events";
                obj.readableDate = window
                  .dayjs(item.updated_at)
                  .format(readableDateFormat);
                break;
              case "units":
                obj.backendURL =
                  "https://agency.icjia-api.cloud/admin/plugins/content-manager/collectionType/application::unit.unit/" +
                  obj.id;
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
                obj.backendURL =
                  "https://agency.icjia-api.cloud/admin/plugins/content-manager/collectionType/application::program.program/" +
                  obj.id;
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

            // delete obj.id;

            allContent.push(obj);
            // this.content = item;
          });
        });
        //console.log(allContent);
        this.content = _.orderBy(allContent, ["updated_at"], ["desc"]);
        // this.$myApp.agencyContent = this.content;
        NProgress.done();
      },
    },
  },
};
</script>
