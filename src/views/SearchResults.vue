<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameDataStore } from '@/stores/gameData'

const route = useRoute()
const router = useRouter()
const store = useGameDataStore()

const query = computed(() => route.query.q || '')
const results = ref([])
const isLoading = ref(true)

const search = async () => {
  if (!query.value) {
    results.value = []
    isLoading.value = false
    return
  }

  isLoading.value = true

  // 確保資料已載入
  await store.loadAllData()

  // 搜尋
  results.value = store.searchAllData(query.value)

  isLoading.value = false
}

// 依類型分組結果
const groupedResults = computed(() => {
  const groups = {}
  for (const item of results.value) {
    if (!groups[item._type]) {
      groups[item._type] = {
        type: item._type,
        typeName: item._typeName,
        items: []
      }
    }
    groups[item._type].items.push(item)
  }
  return Object.values(groups)
})

// 查看詳情
const viewDetail = (item) => {
  router.push({
    name: 'DataDetail',
    params: { type: item._type, id: item.ID }
  })
}

watch(query, () => {
  search()
}, { immediate: true })

onMounted(() => {
  search()
})
</script>

<template>
  <div>
    <!-- 標題 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold">搜尋結果</h1>
      <p class="text-gray-500 mt-1">
        搜尋關鍵字：「{{ query }}」
        <span v-if="!isLoading">（找到 {{ results.length }} 筆結果）</span>
      </p>
    </div>

    <!-- 載入中 -->
    <div v-if="isLoading" class="bg-white rounded-lg p-8 text-center text-gray-500">
      搜尋中...
    </div>

    <!-- 無結果 -->
    <div v-else-if="results.length === 0" class="bg-white rounded-lg p-8 text-center text-gray-500">
      沒有找到符合「{{ query }}」的結果
    </div>

    <!-- 結果列表 -->
    <div v-else class="space-y-6">
      <div v-for="group in groupedResults" :key="group.type" class="bg-white rounded-lg shadow-sm overflow-hidden">
        <!-- 類型標題 -->
        <div class="px-4 py-3 bg-gray-50 border-b font-medium flex items-center gap-2">
          <span>{{ store.getDataTypeConfig(group.type)?.icon }}</span>
          <span>{{ group.typeName }}</span>
          <span class="text-gray-400 text-sm">（{{ group.items.length }}）</span>
        </div>

        <!-- 結果列表 -->
        <div class="divide-y">
          <div
            v-for="item in group.items"
            :key="item.ID"
            class="px-4 py-3 hover:bg-gray-50 cursor-pointer"
            @click="viewDetail(item)"
          >
            <div class="flex items-center justify-between">
              <div>
                <span class="font-mono text-blue-600 text-sm">{{ item.ID }}</span>
                <span v-if="item.Name" class="ml-2">{{ item.Name }}</span>
              </div>
              <span class="text-gray-400 text-sm">查看 →</span>
            </div>
            <p v-if="item.Description" class="text-sm text-gray-500 mt-1 line-clamp-1">
              {{ item.Description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
