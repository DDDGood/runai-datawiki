<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGameDataStore, DATA_TYPES } from '@/stores/gameData'

const router = useRouter()
const route = useRoute()
const store = useGameDataStore()

const dataTypes = computed(() => {
  return Object.entries(DATA_TYPES).map(([key, config]) => ({
    key,
    ...config,
    count: store.getStats[key] || 0
  }))
})

const isActive = (type) => {
  return route.params.type === type
}

const navigateTo = (type) => {
  router.push({ name: 'DataBrowser', params: { type } })
}
</script>

<template>
  <aside class="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white overflow-y-auto">
    <!-- Logo -->
    <div class="p-4 border-b border-gray-700">
      <router-link to="/" class="flex items-center gap-2">
        <span class="text-2xl">📖</span>
        <div>
          <h1 class="text-lg font-bold">DataWiki</h1>
          <p class="text-xs text-gray-400">Game2022 資料維基</p>
        </div>
      </router-link>
    </div>

    <!-- 導航 -->
    <nav class="p-4">
      <!-- 首頁 -->
      <router-link
        to="/"
        class="flex items-center gap-2 px-3 py-2 rounded-lg mb-2 transition-colors"
        :class="route.name === 'Home' ? 'bg-blue-600' : 'hover:bg-gray-800'"
      >
        <span>🏠</span>
        <span>首頁</span>
      </router-link>

      <!-- 資料類型分隔線 -->
      <div class="text-xs text-gray-500 uppercase tracking-wider mt-4 mb-2 px-3">
        資料類型
      </div>

      <!-- 資料類型列表 -->
      <ul class="space-y-1">
        <li v-for="type in dataTypes" :key="type.key">
          <button
            @click="navigateTo(type.key)"
            class="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left"
            :class="isActive(type.key) ? 'bg-blue-600' : 'hover:bg-gray-800'"
          >
            <span>{{ type.icon }}</span>
            <span class="flex-1">{{ type.name }}</span>
            <span v-if="type.count > 0" class="text-xs bg-gray-700 px-2 py-0.5 rounded">
              {{ type.count }}
            </span>
          </button>
        </li>
      </ul>

      <!-- 文檔分隔線 -->
      <div class="text-xs text-gray-500 uppercase tracking-wider mt-6 mb-2 px-3">
        教學文檔
      </div>

      <!-- 文檔連結 -->
      <ul class="space-y-1">
        <li>
          <router-link
            to="/docs/getting-started"
            class="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-gray-800"
          >
            <span>📚</span>
            <span>快速入門</span>
          </router-link>
        </li>
        <li>
          <router-link
            to="/docs/data-types"
            class="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-gray-800"
          >
            <span>📝</span>
            <span>資料類型說明</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- 底部資訊 -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 text-xs text-gray-500">
      <p>Game2022 DataWiki</p>
      <p>資料來源：StreamingAssets</p>
    </div>
  </aside>
</template>
