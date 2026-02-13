<template>
  <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
    <div class="flex items-center gap-4">
      <h2 class="text-xl font-semibold text-slate-800">{{ pageTitle }}</h2>
    </div>

    <div class="flex items-center gap-4">
      <button class="p-2 text-slate-500 hover:text-slate-700 rounded-full hover:bg-slate-100">
        <Bell class="w-5 h-5" />
      </button>
      <button class="p-2 text-slate-500 hover:text-slate-700 rounded-full hover:bg-slate-100">
        <HelpCircle class="w-5 h-5" />
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Bell, HelpCircle } from 'lucide-vue-next'

const route = useRoute()
const pageTitle = computed(() => route.name)
</script>
