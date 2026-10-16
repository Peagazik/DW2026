import { createRouter, createWebHistory } from "vue-router";
import MenuView from "@/views/MenuView.vue";
import PedidosView from "@/views/PedidosView.vue";

const routes = [
  {
    path: "/",
    name: "menuview",
    component: MenuView,
  },
  {
    path: "/pedidos",
    name: "pedidosview",
    component: PedidosView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
