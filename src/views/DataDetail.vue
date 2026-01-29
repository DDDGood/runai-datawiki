<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameDataStore } from '@/stores/gameData'

const route = useRoute()
const router = useRouter()
const store = useGameDataStore()

const currentType = computed(() => route.params.type)
const currentId = computed(() => route.params.id)
const typeConfig = computed(() => store.getDataTypeConfig(currentType.value))

const item = ref(null)
const isLoading = ref(true)
const showRawJson = ref(false)

const loadItem = async () => {
  isLoading.value = true
  await store.loadData(currentType.value)
  item.value = store.getDataById(currentType.value, currentId.value)
  isLoading.value = false
}

// 格式化 JSON
const formattedJson = computed(() => {
  if (!item.value) return ''
  return JSON.stringify(item.value, null, 2)
})

// 複製 JSON
const copyJson = async () => {
  try {
    await navigator.clipboard.writeText(formattedJson.value)
    alert('已複製到剪貼簿')
  } catch (e) {
    console.error('複製失敗', e)
  }
}

// 返回列表
const goBack = () => {
  router.push({ name: 'DataBrowser', params: { type: currentType.value } })
}

// 渲染欄位值
const renderValue = (value) => {
  if (value === null || value === undefined) return '-'
  if (typeof value === 'boolean') return value ? '是' : '否'
  if (typeof value === 'object') return JSON.stringify(value)
  return value
}

// 是否為複雜值（物件或陣列）
const isComplexValue = (value) => {
  return typeof value === 'object' && value !== null
}

watch([currentType, currentId], () => {
  loadItem()
}, { immediate: true })

onMounted(() => {
  loadItem()
})
</script>

<template>
  <div>
    <!-- 返回按鈕 -->
    <button
      @click="goBack"
      class="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
    >
      ← 返回列表
    </button>

    <!-- 載入中 -->
    <div v-if="isLoading" class="bg-white rounded-lg p-8 text-center text-gray-500">
      載入中...
    </div>

    <!-- 找不到資料 -->
    <div v-else-if="!item" class="bg-white rounded-lg p-8 text-center text-gray-500">
      找不到資料：{{ currentId }}
    </div>

    <!-- 資料詳情 -->
    <div v-else>
      <!-- 標題卡片 -->
      <div class="bg-white rounded-lg p-6 shadow-sm mb-4">
        <div class="flex items-start gap-4">
          <!-- 圖示 -->
          <div class="text-4xl">{{ typeConfig?.icon }}</div>

          <!-- 資訊 -->
          <div class="flex-1">
            <h1 class="text-2xl font-bold">
              {{ item.Name || item.ID }}
            </h1>
            <p class="text-gray-500 font-mono text-sm mt-1">
              ID: {{ item.ID }}
            </p>
            <p v-if="item.Description" class="text-gray-600 mt-2">
              {{ item.Description }}
            </p>
          </div>

          <!-- 操作按鈕 -->
          <div class="flex gap-2">
            <button
              @click="showRawJson = !showRawJson"
              class="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
            >
              {{ showRawJson ? '隱藏 JSON' : '顯示 JSON' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 原始 JSON（可摺疊） -->
      <div v-if="showRawJson" class="bg-gray-800 text-gray-100 rounded-lg p-4 mb-4 overflow-x-auto">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-gray-400">原始 JSON</span>
          <button
            @click="copyJson"
            class="text-sm text-blue-400 hover:text-blue-300"
          >
            複製
          </button>
        </div>
        <pre class="text-sm font-mono">{{ formattedJson }}</pre>
      </div>

      <!-- 欄位詳情 -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="px-4 py-3 bg-gray-50 border-b font-medium">
          欄位資料
        </div>
        <div class="divide-y">
          <div
            v-for="(value, key) in item"
            :key="key"
            class="px-4 py-3"
          >
            <div class="flex items-start">
              <div class="w-48 text-sm font-medium text-gray-600 shrink-0">
                {{ key }}
              </div>
              <div class="flex-1">
                <!-- 簡單值 -->
                <template v-if="!isComplexValue(value)">
                  <span :class="key === 'ID' ? 'font-mono text-blue-600' : ''">
                    {{ renderValue(value) }}
                  </span>
                </template>

                <!-- 陣列 -->
                <template v-else-if="Array.isArray(value)">
                  <div v-if="value.length === 0" class="text-gray-400">（空陣列）</div>
                  <div v-else class="space-y-2">
                    <div
                      v-for="(arrItem, index) in value"
                      :key="index"
                      class="bg-gray-50 rounded p-2 text-sm"
                    >
                      <template v-if="typeof arrItem === 'object'">
                        <pre class="text-xs font-mono overflow-x-auto">{{ JSON.stringify(arrItem, null, 2) }}</pre>
                      </template>
                      <template v-else>
                        {{ arrItem }}
                      </template>
                    </div>
                  </div>
                </template>

                <!-- 物件 -->
                <template v-else>
                  <div class="bg-gray-50 rounded p-2">
                    <pre class="text-xs font-mono overflow-x-auto">{{ JSON.stringify(value, null, 2) }}</pre>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
