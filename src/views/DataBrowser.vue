<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameDataStore } from '@/stores/gameData'

const route = useRoute()
const router = useRouter()
const store = useGameDataStore()

// 當前資料類型
const currentType = computed(() => route.params.type)
const typeConfig = computed(() => store.getDataTypeConfig(currentType.value))

// 資料
const data = ref([])
const isLoading = ref(true)

// 分頁
const currentPage = ref(1)
const pageSize = ref(20)

// 篩選與排序
const searchFilter = ref('')
const sortField = ref('ID')
const sortOrder = ref('asc')

// 載入資料
const loadData = async () => {
  isLoading.value = true
  data.value = await store.loadData(currentType.value)
  isLoading.value = false
}

// 篩選後的資料
const filteredData = computed(() => {
  let result = [...data.value]

  // 搜尋篩選
  if (searchFilter.value) {
    const query = searchFilter.value.toLowerCase()
    result = result.filter(item => {
      return typeConfig.value?.searchFields.some(field => {
        const value = item[field]
        return typeof value === 'string' && value.toLowerCase().includes(query)
      })
    })
  }

  // 排序
  result.sort((a, b) => {
    const aVal = a[sortField.value] || ''
    const bVal = b[sortField.value] || ''
    const compare = String(aVal).localeCompare(String(bVal))
    return sortOrder.value === 'asc' ? compare : -compare
  })

  return result
})

// 分頁後的資料
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredData.value.slice(start, start + pageSize.value)
})

// 總頁數
const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / pageSize.value)
})

// 切換排序
const toggleSort = (field) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
}

// 查看詳情
const viewDetail = (item) => {
  router.push({
    name: 'DataDetail',
    params: { type: currentType.value, id: item.ID }
  })
}

// 監聽路由變化
watch(() => route.params.type, () => {
  currentPage.value = 1
  searchFilter.value = ''
  loadData()
}, { immediate: true })

onMounted(() => {
  loadData()
})
</script>

<template>
  <div>
    <!-- 標題與操作 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold flex items-center gap-2">
          <span>{{ typeConfig?.icon }}</span>
          <span>{{ typeConfig?.name }}</span>
        </h1>
        <p class="text-gray-500 mt-1">{{ typeConfig?.description }}</p>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-500">
          共 {{ filteredData.length }} 筆資料
        </span>
      </div>
    </div>

    <!-- 搜尋與篩選 -->
    <div class="bg-white rounded-lg p-4 mb-4 shadow-sm">
      <input
        v-model="searchFilter"
        type="text"
        placeholder="搜尋..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- 資料表格 -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <!-- 載入中 -->
      <div v-if="isLoading" class="p-8 text-center text-gray-500">
        載入中...
      </div>

      <!-- 無資料 -->
      <div v-else-if="filteredData.length === 0" class="p-8 text-center text-gray-500">
        沒有找到符合條件的資料
      </div>

      <!-- 表格 -->
      <table v-else class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th
              v-for="field in typeConfig?.primaryFields"
              :key="field"
              class="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
              @click="toggleSort(field)"
            >
              <div class="flex items-center gap-1">
                {{ field }}
                <span v-if="sortField === field" class="text-blue-500">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th class="px-4 py-3 text-right text-sm font-medium text-gray-600">
              操作
            </th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr
            v-for="item in paginatedData"
            :key="item.ID"
            class="hover:bg-gray-50 cursor-pointer"
            @click="viewDetail(item)"
          >
            <td
              v-for="field in typeConfig?.primaryFields"
              :key="field"
              class="px-4 py-3 text-sm"
            >
              <template v-if="field === 'ID'">
                <span class="font-mono text-blue-600">{{ item[field] }}</span>
              </template>
              <template v-else-if="typeof item[field] === 'object'">
                <span class="text-gray-400">{{ JSON.stringify(item[field]) }}</span>
              </template>
              <template v-else>
                {{ item[field] ?? '-' }}
              </template>
            </td>
            <td class="px-4 py-3 text-right">
              <button
                class="text-blue-600 hover:text-blue-800 text-sm"
                @click.stop="viewDetail(item)"
              >
                查看
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 分頁 -->
      <div v-if="totalPages > 1" class="px-4 py-3 border-t flex items-center justify-between">
        <div class="text-sm text-gray-500">
          第 {{ currentPage }} / {{ totalPages }} 頁
        </div>
        <div class="flex gap-2">
          <button
            :disabled="currentPage === 1"
            class="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            @click="currentPage--"
          >
            上一頁
          </button>
          <button
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            @click="currentPage++"
          >
            下一頁
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
