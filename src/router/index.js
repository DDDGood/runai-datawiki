import { createRouter, createWebHashHistory } from 'vue-router'

// 視圖元件（懶載入）
const Home = () => import('@/views/Home.vue')
const DataBrowser = () => import('@/views/DataBrowser.vue')
const DataDetail = () => import('@/views/DataDetail.vue')
const DocPage = () => import('@/views/DocPage.vue')
const SearchResults = () => import('@/views/SearchResults.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: '首頁' }
  },
  {
    path: '/data/:type',
    name: 'DataBrowser',
    component: DataBrowser,
    meta: { title: '資料瀏覽' }
  },
  {
    path: '/data/:type/:id',
    name: 'DataDetail',
    component: DataDetail,
    meta: { title: '資料詳情' }
  },
  {
    path: '/docs/:path*',
    name: 'DocPage',
    component: DocPage,
    meta: { title: '文檔' }
  },
  {
    path: '/search',
    name: 'SearchResults',
    component: SearchResults,
    meta: { title: '搜尋結果' }
  }
]

const router = createRouter({
  history: createWebHashHistory(), // 使用 Hash 模式支援 file:// 協定
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由標題更新
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || 'DataWiki'} - Game2022 資料維基`
  next()
})

export default router
