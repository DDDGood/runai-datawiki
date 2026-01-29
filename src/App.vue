<script setup>
import { RouterView } from 'vue-router'
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
</script>

<template>
  <div class="flex min-h-screen">
    <!-- 側邊欄 -->
    <Sidebar />

    <!-- 主內容區 -->
    <div class="flex-1 flex flex-col ml-64">
      <!-- 頂部導航 -->
      <Header />

      <!-- 頁面內容 -->
      <main class="flex-1 p-6 bg-gray-50">
        <RouterView />
      </main>
    </div>
  </div>
</template>
