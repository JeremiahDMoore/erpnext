import { defineStore } from 'pinia'

const STORAGE_KEY = 'erpnext_demo_work_orders'

const defaultOrders = [
  { id: 'WO-2024-001', item_name: 'Industrial Gearbox X1', quantity: 5, status: 'Completed', start_date: '2024-05-01', end_date: '2024-05-05' },
  { id: 'WO-2024-002', item_name: 'Gearbox Housing', quantity: 20, status: 'In Progress', start_date: '2024-05-10', end_date: '' },
  { id: 'WO-2024-003', item_name: 'Industrial Gearbox X1', quantity: 10, status: 'Pending', start_date: '2024-05-15', end_date: '' },
]

export const useWorkOrdersStore = defineStore('workOrders', {
  state: () => ({
    orders: JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultOrders
  }),

  actions: {
    getOrders() {
      return this.orders
    },

    addOrder(order) {
      const newOrder = {
        ...order,
        id: `WO-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        status: 'Pending',
        start_date: new Date().toISOString().split('T')[0]
      }
      this.orders.push(newOrder)
      this.save()
    },

    updateStatus(id, status) {
      const order = this.orders.find(o => o.id === id)
      if (order) {
        order.status = status
        if (status === 'Completed') {
          order.end_date = new Date().toISOString().split('T')[0]
        }
        this.save()
      }
    },

    deleteOrder(id) {
      this.orders = this.orders.filter(o => o.id !== id)
      this.save()
    },

    save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.orders))
    }
  }
})
