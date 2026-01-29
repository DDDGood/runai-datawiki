<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameDataStore, DATA_TYPES } from '@/stores/gameData'

const router = useRouter()
const store = useGameDataStore()

// 載入所有資料以顯示統計
onMounted(async () => {
  await store.loadAllData()
})

const dataTypes = computed(() => {
  return Object.entries(DATA_TYPES).map(([key, config]) => ({
    key,
    ...config,
    count: store.getStats[key] || 0
  }))
})

const totalItems = computed(() => {
  return Object.values(store.getStats).reduce((sum, count) => sum + count, 0)
})

const navigateTo = (type) => {
  router.push({ name: 'DataBrowser', params: { type } })
}
</script>

<template>
  <div class="max-w-6xl mx-auto">
    <!-- 歡迎區塊 -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-2xl p-8 mb-8">
      <h1 class="text-3xl font-bold mb-2">歡迎使用 Game2022 DataWiki</h1>
      <p class="text-blue-100 text-lg">
        遊戲資料百科全書 - 瀏覽、搜尋、學習如何編輯遊戲內容
      </p>
      <div class="mt-6 flex gap-4">
        <router-link
          to="/docs/getting-started"
          class="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
        >
          快速入門
        </router-link>
        <button
          @click="navigateTo('Items')"
          class="bg-blue-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          瀏覽資料
        </button>
      </div>
    </div>

    <!-- 統計摘要 -->
    <div class="grid grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-xl p-6 shadow-sm">
        <div class="text-3xl font-bold text-blue-600">{{ totalItems }}</div>
        <div class="text-gray-500">總資料數</div>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm">
        <div class="text-3xl font-bold text-green-600">{{ dataTypes.length }}</div>
        <div class="text-gray-500">資料類型</div>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm">
        <div class="text-3xl font-bold text-purple-600">4</div>
        <div class="text-gray-500">支援語言</div>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm">
        <div class="text-3xl font-bold text-orange-600">700+</div>
        <div class="text-gray-500">JSON 檔案</div>
      </div>
    </div>

    <!-- 資料類型卡片 -->
    <h2 class="text-xl font-bold mb-4">資料類型總覽</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <button
        v-for="type in dataTypes"
        :key="type.key"
        @click="navigateTo(type.key)"
        class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-left group"
      >
        <div class="text-3xl mb-2">{{ type.icon }}</div>
        <h3 class="font-semibold text-gray-900 group-hover:text-blue-600">
          {{ type.name }}
        </h3>
        <p class="text-sm text-gray-500 mt-1 line-clamp-2">
          {{ type.description }}
        </p>
        <div class="mt-3 text-sm">
          <span v-if="type.count > 0" class="bg-gray-100 px-2 py-1 rounded text-gray-600">
            {{ type.count }} 筆資料
          </span>
          <span v-else class="text-gray-400">載入中...</span>
        </div>
      </button>
    </div>

    <!-- 快速連結 -->
    <h2 class="text-xl font-bold mt-8 mb-4">快速入門</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <router-link
        to="/docs/data-types/items"
        class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
      >
        <span class="text-2xl">📦</span>
        <div>
          <h3 class="font-semibold text-gray-900">如何新增物品</h3>
          <p class="text-sm text-gray-500 mt-1">
            學習 ItemData 的結構，建立自己的物品
          </p>
        </div>
      </router-link>
      <router-link
        to="/docs/data-types/characters"
        class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
      >
        <span class="text-2xl">👤</span>
        <div>
          <h3 class="font-semibold text-gray-900">如何新增角色</h3>
          <p class="text-sm text-gray-500 mt-1">
            學習 CharacterData 的結構，建立自己的角色
          </p>
        </div>
      </router-link>
    </div>
  </div>
</template>
