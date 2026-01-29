<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGameDataStore } from '@/stores/gameData'

const router = useRouter()
const route = useRoute()
const store = useGameDataStore()

const searchInput = ref('')

const handleSearch = () => {
  if (searchInput.value.trim()) {
    store.searchQuery = searchInput.value.trim()
    router.push({ name: 'SearchResults', query: { q: searchInput.value.trim() } })
  }
}

// 麵包屑導航
const breadcrumbs = computed(() => {
  const crumbs = [{ name: '首頁', path: '/' }]

  if (route.name === 'DataBrowser') {
    const typeConfig = store.getDataTypeConfig(route.params.type)
    if (typeConfig) {
      crumbs.push({ name: typeConfig.name, path: route.path })
    }
  } else if (route.name === 'DataDetail') {
    const typeConfig = store.getDataTypeConfig(route.params.type)
    if (typeConfig) {
      crumbs.push({
        name: typeConfig.name,
        path: `/data/${route.params.type}`
      })
      crumbs.push({ name: route.params.id, path: route.path })
    }
  } else if (route.name === 'DocPage') {
    crumbs.push({ name: '文檔', path: route.path })
  }

  return crumbs
})
</script>

<script>
import { computed } from 'vue'
</script>

<template>
  <header class="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- 麵包屑 -->
      <nav class="flex items-center text-sm">
        <template v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
          <router-link
            v-if="index < breadcrumbs.length - 1"
            :to="crumb.path"
            class="text-gray-500 hover:text-gray-700"
          >
            {{ crumb.name }}
          </router-link>
          <span v-else class="text-gray-900 font-medium">{{ crumb.name }}</span>
          <span v-if="index < breadcrumbs.length - 1" class="mx-2 text-gray-400">/</span>
        </template>
      </nav>

      <!-- 搜尋欄 -->
      <div class="flex items-center gap-4">
        <form @submit.prevent="handleSearch" class="relative">
          <input
            v-model="searchInput"
            type="text"
            placeholder="搜尋資料..."
            class="w-64 px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            🔍
          </button>
        </form>
      </div>
    </div>
  </header>
</template>
