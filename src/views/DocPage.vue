<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'

const route = useRoute()

const docPath = computed(() => route.params.path?.join('/') || 'getting-started')
const content = ref('')
const isLoading = ref(true)
const error = ref(null)

// 載入文檔
const loadDoc = async () => {
  isLoading.value = true
  error.value = null

  try {
    // 嘗試從內建文檔模組載入
    const module = await import(`@/docs/${docPath.value}.md?raw`)
    content.value = module.default
  } catch (e) {
    console.warn('無法載入文檔:', docPath.value, e)
    error.value = `找不到文檔：${docPath.value}`
    content.value = ''
  } finally {
    isLoading.value = false
  }
}

// 渲染 Markdown
const renderedContent = computed(() => {
  if (!content.value) return ''
  return marked(content.value)
})

watch(() => route.params.path, () => {
  loadDoc()
}, { immediate: true })

onMounted(() => {
  loadDoc()
})
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- 載入中 -->
    <div v-if="isLoading" class="bg-white rounded-lg p-8 text-center text-gray-500">
      載入文檔中...
    </div>

    <!-- 錯誤 -->
    <div v-else-if="error" class="bg-white rounded-lg p-8">
      <div class="text-center">
        <div class="text-4xl mb-4">📄</div>
        <h1 class="text-xl font-bold text-gray-900 mb-2">{{ error }}</h1>
        <p class="text-gray-500 mb-4">
          此文檔尚未撰寫，或路徑不正確。
        </p>
        <router-link
          to="/"
          class="text-blue-600 hover:underline"
        >
          返回首頁
        </router-link>
      </div>
    </div>

    <!-- 文檔內容 -->
    <div v-else class="bg-white rounded-lg p-8 shadow-sm">
      <article class="prose" v-html="renderedContent"></article>
    </div>
  </div>
</template>
