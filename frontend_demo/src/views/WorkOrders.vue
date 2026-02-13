<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-slate-800">Work Orders</h1>
      <Button @click="openModal">
        <Plus class="w-4 h-4 mr-2" />
        New Work Order
      </Button>
    </div>

    <!-- Filters -->
    <div class="flex gap-4 mb-6">
      <button
        v-for="status in ['All', 'Pending', 'In Progress', 'Completed']"
        :key="status"
        @click="filterStatus = status"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition-colors',
          filterStatus === status
            ? 'bg-blue-100 text-blue-700'
            : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
        ]"
      >
        {{ status }}
      </button>
    </div>

    <!-- Kanban/List View -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        v-for="order in filteredOrders"
        :key="order.id"
        class="hover:shadow-md transition-shadow cursor-pointer border-t-4"
        :class="getStatusBorderColor(order.status)"
        @click="editOrder(order)"
      >
        <div class="flex justify-between items-start mb-2">
          <span class="text-xs font-mono text-slate-500">{{ order.id }}</span>
          <Badge :variant="getStatusVariant(order.status)">{{ order.status }}</Badge>
        </div>

        <h3 class="font-bold text-lg text-slate-900 mb-1">{{ order.item_name }}</h3>
        <p class="text-sm text-slate-600 mb-4">Quantity: <span class="font-medium">{{ order.quantity }}</span></p>

        <div class="flex items-center text-xs text-slate-500 gap-4">
          <div class="flex items-center gap-1">
            <Calendar class="w-3 h-3" />
            <span>{{ order.start_date }}</span>
          </div>
          <div v-if="order.end_date" class="flex items-center gap-1">
            <CheckCircle class="w-3 h-3 text-green-600" />
            <span>{{ order.end_date }}</span>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-between items-center w-full">
            <button
              v-if="order.status !== 'Completed'"
              @click.stop="advanceStatus(order)"
              class="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Next Stage <ArrowRight class="w-3 h-3" />
            </button>
            <span v-else class="text-xs font-medium text-green-600 flex items-center gap-1">
              Done <Check class="w-3 h-3" />
            </span>
          </div>
        </template>
      </Card>
    </div>

    <div v-if="filteredOrders.length === 0" class="text-center py-12">
      <p class="text-slate-500">No work orders found.</p>
    </div>

    <!-- Create/Edit Modal -->
    <Modal :isOpen="isModalOpen" :title="isEditing ? 'Edit Work Order' : 'Create Work Order'" @close="closeModal">
      <form @submit.prevent="saveOrder" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Item to Manufacture</label>
          <select v-model="formData.item_name" class="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border">
            <option v-for="item in itemsStore.items" :key="item.id" :value="item.name">
              {{ item.name }} (Stock: {{ item.stock }})
            </option>
          </select>
        </div>

        <Input v-model="formData.quantity" type="number" label="Quantity to Produce" placeholder="1" min="1" />

        <div v-if="isEditing">
          <label class="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select v-model="formData.status" class="block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border">
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

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
import { useWorkOrdersStore } from '../stores/workOrders'
import { useItemsStore } from '../stores/items'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import Input from '../components/ui/Input.vue'
import Badge from '../components/ui/Badge.vue'
import Modal from '../components/ui/Modal.vue'
import { Plus, Calendar, CheckCircle, ArrowRight, Check } from 'lucide-vue-next'

const workOrdersStore = useWorkOrdersStore()
const itemsStore = useItemsStore()
const filterStatus = ref('All')
const isModalOpen = ref(false)
const isEditing = ref(false)

const formData = reactive({
  id: '',
  item_name: '',
  quantity: 1,
  status: 'Pending'
})

const filteredOrders = computed(() => {
  if (filterStatus.value === 'All') return workOrdersStore.orders
  return workOrdersStore.orders.filter(o => o.status === filterStatus.value)
})

const getStatusVariant = (status) => {
  switch (status) {
    case 'Completed': return 'success'
    case 'In Progress': return 'warning'
    default: return 'default'
  }
}

const getStatusBorderColor = (status) => {
  switch (status) {
    case 'Completed': return 'border-t-green-500'
    case 'In Progress': return 'border-t-amber-500'
    default: return 'border-t-slate-300'
  }
}

const openModal = () => {
  isEditing.value = false
  formData.item_name = itemsStore.items[0]?.name || ''
  formData.quantity = 1
  formData.status = 'Pending'
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const editOrder = (order) => {
  isEditing.value = true
  Object.assign(formData, order)
  isModalOpen.value = true
}

const saveOrder = () => {
  if (isEditing.value) {
    // Update logic - only status update is mocked fully in store for simplicity here
    // But we should try to update other fields too
    const orderIndex = workOrdersStore.orders.findIndex(o => o.id === formData.id)
    if (orderIndex !== -1) {
       workOrdersStore.orders[orderIndex] = { ...workOrdersStore.orders[orderIndex], ...formData }
       workOrdersStore.save()
    }
  } else {
    workOrdersStore.addOrder({
      item_name: formData.item_name,
      quantity: formData.quantity
    })
  }
  closeModal()
}

const advanceStatus = (order) => {
  let nextStatus = 'Pending'
  if (order.status === 'Pending') nextStatus = 'In Progress'
  else if (order.status === 'In Progress') nextStatus = 'Completed'

  workOrdersStore.updateStatus(order.id, nextStatus)
}
</script>
