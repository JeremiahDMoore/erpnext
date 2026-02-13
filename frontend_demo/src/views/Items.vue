<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div class="relative w-72">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
          <Search class="w-5 h-5" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search items..."
          class="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>
      <Button @click="openModal">
        <Plus class="w-4 h-4 mr-2" />
        New Item
      </Button>
    </div>

    <!-- Table -->
    <Card class="overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200">
          <thead class="bg-slate-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Item Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Stock</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-slate-200">
            <tr v-for="item in filteredItems" :key="item.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {{ item.name.charAt(0) }}
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-slate-900">{{ item.name }}</div>
                    <div class="text-xs text-slate-500">ID: {{ item.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Badge :variant="getTypeVariant(item.type)">{{ item.type }}</Badge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                <span :class="item.stock < 20 ? 'text-red-600 font-bold' : ''">{{ item.stock }}</span>
                <span class="text-xs text-slate-500 ml-1">{{ item.uom }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                ${{ item.price.toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="editItem(item)" class="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                <button @click="deleteItem(item.id)" class="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
            <tr v-if="filteredItems.length === 0">
              <td colspan="5" class="px-6 py-10 text-center text-slate-500">
                No items found matching "{{ searchQuery }}"
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

    <!-- Modal -->
    <Modal :isOpen="isModalOpen" :title="isEditing ? 'Edit Item' : 'Create New Item'" @close="closeModal">
      <form @submit.prevent="saveItem" class="space-y-4">
        <Input v-model="formData.name" label="Item Name" placeholder="e.g. Stainless Steel Bolt" required />

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Item Type</label>
          <select v-model="formData.type" class="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border">
            <option value="Raw Material">Raw Material</option>
            <option value="Sub Assembly">Sub Assembly</option>
            <option value="Finished Good">Finished Good</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <Input v-model="formData.stock" type="number" label="Initial Stock" placeholder="0" />
          <Input v-model="formData.uom" label="UOM" placeholder="e.g. Kg, Nos" />
        </div>

        <Input v-model="formData.price" type="number" label="Standard Price ($)" placeholder="0.00" step="0.01" />

        <div class="flex justify-end gap-3 mt-6">
          <Button type="button" variant="secondary" @click="closeModal">Cancel</Button>
          <Button type="submit">{{ isEditing ? 'Update' : 'Create' }}</Button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useItemsStore } from '../stores/items'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Input from '../components/ui/Input.vue'
import Badge from '../components/ui/Badge.vue'
import Modal from '../components/ui/Modal.vue'
import { Plus, Search } from 'lucide-vue-next'

const itemsStore = useItemsStore()
const searchQuery = ref('')
const isModalOpen = ref(false)
const isEditing = ref(false)

const formData = reactive({
  id: '',
  name: '',
  type: 'Raw Material',
  stock: 0,
  uom: '',
  price: 0
})

const filteredItems = computed(() => {
  if (!searchQuery.value) return itemsStore.items
  const query = searchQuery.value.toLowerCase()
  return itemsStore.items.filter(item =>
    item.name.toLowerCase().includes(query) ||
    item.id.toLowerCase().includes(query)
  )
})

const getTypeVariant = (type) => {
  switch (type) {
    case 'Raw Material': return 'info'
    case 'Sub Assembly': return 'warning'
    case 'Finished Good': return 'success'
    default: return 'default'
  }
}

const openModal = () => {
  isEditing.value = false
  resetForm()
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  resetForm()
}

const editItem = (item) => {
  isEditing.value = true
  Object.assign(formData, item)
  isModalOpen.value = true
}

const saveItem = () => {
  if (isEditing.value) {
    itemsStore.updateItem({ ...formData })
  } else {
    itemsStore.addItem({ ...formData })
  }
  closeModal()
}

const deleteItem = (id) => {
  if (confirm('Are you sure you want to delete this item?')) {
    itemsStore.deleteItem(id)
  }
}

const resetForm = () => {
  formData.id = ''
  formData.name = ''
  formData.type = 'Raw Material'
  formData.stock = 0
  formData.uom = ''
  formData.price = 0
}
</script>
