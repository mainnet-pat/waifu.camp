import Vue from "vue";
import VueRouter, { RawLocation, Route, RouteConfig } from "vue-router";
import App from "@/App.vue";
import Home from "@/views/Home.vue";
import New from "@/views/New.vue";
import Camp from "@/views/Camp.vue";
import Waifu from "@/views/Waifu.vue";
import Random from "@/views/Random.vue";
import Top from "@/views/Top.vue";
import Search from "@/views/Search.vue";

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = async function (location: RawLocation) {
  let route: Route;
  try {
    route = await originalPush.call<VueRouter, [RawLocation], Promise<Route>>(this, location);
  } catch (err) {
    if (err.name !== 'NavigationDuplicated') {
      throw err;
    }
  }

  return route!;
}
const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/new",
    name: "New",
    component: New
  },
  {
    path: "/camp/:address",
    name: "Camp",
    component: Camp,
    props: true
  },
  {
    path: "/waifu/:tokenId",
    name: "Waifu",
    component: Waifu,
    props: true
  },
  {
    path: "/random",
    name: "Random",
    component: Random,
  },
  {
    path: "/top",
    name: "Top",
    component: Top,
  },
  {
    path: "/search",
    name: "Search",
    component: Search,
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
