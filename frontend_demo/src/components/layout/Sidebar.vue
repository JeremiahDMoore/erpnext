<template>
  <aside class="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col">
    <div class="h-16 flex items-center px-6 font-bold text-white text-xl border-b border-slate-800">
      ERPNext Demo
    </div>

    <nav class="flex-1 px-4 py-6 space-y-2">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors"
        :class="{ 'bg-primary text-white': $route.path === item.path }"
      >
        <component :is="item.icon" class="w-5 h-5" />
        {{ item.name }}
      </router-link>
    </nav>

    <div class="p-4 border-t border-slate-800">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
          JS
        </div>
        <div class="text-sm">
          <p class="text-white font-medium">John Smith</p>
          <p class="text-slate-500 text-xs">Production Manager</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { LayoutDashboard, Package, Factory } from 'lucide-vue-next'

const menuItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Items', path: '/items', icon: Package },
  { name: 'Work Orders', path: '/work-orders', icon: Factory },
]
</script>
