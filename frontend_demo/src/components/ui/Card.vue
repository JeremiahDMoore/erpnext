<template>
  <div class="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
    <div v-if="$slots.header || title" class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
      <h3 v-if="title" class="text-lg font-semibold text-slate-900">{{ title }}</h3>
      <slot name="header"></slot>
    </div>
    <div class="p-6">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="px-6 py-4 bg-slate-50 border-t border-slate-100">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String
})
</script>
