import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Items from '../views/Items.vue'
import WorkOrders from '../views/WorkOrders.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/items',
    name: 'Items',
    component: Items
  },
  {
    path: '/work-orders',
    name: 'Work Orders',
    component: WorkOrders
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
