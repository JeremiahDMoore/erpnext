import { defineStore } from 'pinia'

const STORAGE_KEY = 'erpnext_demo_items'

const defaultItems = [
  { id: '1001', name: 'Steel Sheet 2mm', type: 'Raw Material', stock: 500, uom: 'Sheet', price: 45.00 },
  { id: '1002', name: 'Aluminum Ingot', type: 'Raw Material', stock: 200, uom: 'Kg', price: 12.50 },
  { id: '1003', name: 'Bearing 6204', type: 'Sub Assembly', stock: 100, uom: 'Nos', price: 5.00 },
  { id: '2001', name: 'Gearbox Housing', type: 'Sub Assembly', stock: 50, uom: 'Nos', price: 150.00 },
  { id: '3001', name: 'Industrial Gearbox X1', type: 'Finished Good', stock: 10, uom: 'Nos', price: 1200.00 },
]

export const useItemsStore = defineStore('items', {
  state: () => ({
    items: JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultItems
  }),

  actions: {
    getItems() {
      return this.items
    },

    addItem(item) {
      const newItem = {
        ...item,
        id: Math.floor(Math.random() * 10000).toString(), // Simple random ID
        stock: parseInt(item.stock) || 0
      }
      this.items.push(newItem)
      this.save()
    },

    updateItem(updatedItem) {
      const index = this.items.findIndex(i => i.id === updatedItem.id)
      if (index !== -1) {
        this.items[index] = { ...updatedItem }
        this.save()
      }
    },

    deleteItem(id) {
      this.items = this.items.filter(i => i.id !== id)
      this.save()
    },

    save() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
    }
  }
})
