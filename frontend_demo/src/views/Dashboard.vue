<template>
  <div class="space-y-6">
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card class="bg-blue-50 border-blue-100">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-blue-100 rounded-full text-blue-600">
            <Package class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm font-medium text-blue-600">Total Items</p>
            <p class="text-2xl font-bold text-slate-900">{{ itemsStore.items.length }}</p>
          </div>
        </div>
      </Card>

      <Card class="bg-amber-50 border-amber-100">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-amber-100 rounded-full text-amber-600">
            <Timer class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm font-medium text-amber-600">Pending Orders</p>
            <p class="text-2xl font-bold text-slate-900">{{ pendingOrders }}</p>
          </div>
        </div>
      </Card>

      <Card class="bg-green-50 border-green-100">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-green-100 rounded-full text-green-600">
            <CheckCircle class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm font-medium text-green-600">Completed Orders</p>
            <p class="text-2xl font-bold text-slate-900">{{ completedOrders }}</p>
          </div>
        </div>
      </Card>
    </div>

    <!-- Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Recent Work Orders">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-xs text-slate-500 uppercase bg-slate-50">
              <tr>
                <th class="px-4 py-3">Order ID</th>
                <th class="px-4 py-3">Item</th>
                <th class="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in recentOrders" :key="order.id" class="border-b last:border-0 hover:bg-slate-50">
                <td class="px-4 py-3 font-medium">{{ order.id }}</td>
                <td class="px-4 py-3">{{ order.item_name }}</td>
                <td class="px-4 py-3">
                  <Badge :variant="getStatusVariant(order.status)">{{ order.status }}</Badge>
                </td>
              </tr>
              <tr v-if="recentOrders.length === 0">
                <td colspan="3" class="px-4 py-3 text-center text-slate-500">No recent orders</td>
              </tr>
            </tbody>
          </table>
        </div>
        <template #footer>
          <router-link to="/work-orders" class="text-sm text-primary hover:text-blue-700 font-medium">View all orders &rarr;</router-link>
        </template>
      </Card>

      <Card title="Low Stock Items">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-xs text-slate-500 uppercase bg-slate-50">
              <tr>
                <th class="px-4 py-3">Item Name</th>
                <th class="px-4 py-3">Stock</th>
                <th class="px-4 py-3">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in lowStockItems" :key="item.id" class="border-b last:border-0 hover:bg-slate-50">
                <td class="px-4 py-3 font-medium">{{ item.name }}</td>
                <td class="px-4 py-3 text-red-600 font-medium">{{ item.stock }} {{ item.uom }}</td>
                <td class="px-4 py-3">${{ item.price }}</td>
              </tr>
              <tr v-if="lowStockItems.length === 0">
                <td colspan="3" class="px-4 py-3 text-center text-slate-500">No low stock items</td>
              </tr>
            </tbody>
          </table>
        </div>
        <template #footer>
          <router-link to="/items" class="text-sm text-primary hover:text-blue-700 font-medium">Manage inventory &rarr;</router-link>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useItemsStore } from '../stores/items'
import { useWorkOrdersStore } from '../stores/workOrders'
import Card from '../components/ui/Card.vue'
import Badge from '../components/ui/Badge.vue'
import { Package, Timer, CheckCircle } from 'lucide-vue-next'

const itemsStore = useItemsStore()
const workOrdersStore = useWorkOrdersStore()

const pendingOrders = computed(() => workOrdersStore.orders.filter(o => o.status === 'Pending').length)
const completedOrders = computed(() => workOrdersStore.orders.filter(o => o.status === 'Completed').length)

const recentOrders = computed(() => {
  return [...workOrdersStore.orders].reverse().slice(0, 5)
})

const lowStockItems = computed(() => {
  return itemsStore.items.filter(i => i.stock < 50).slice(0, 5)
})

const getStatusVariant = (status) => {
  switch (status) {
    case 'Completed': return 'success'
    case 'In Progress': return 'warning'
    default: return 'default'
  }
}
</script>
