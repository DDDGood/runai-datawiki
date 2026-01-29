import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 資料類型配置
export const DATA_TYPES = {
  Characters: {
    name: '角色',
    icon: '👤',
    description: '遊戲中的角色定義，包含 NPC、敵人、動物等',
    path: 'Character',
    primaryFields: ['ID', 'Name', 'RaceID'],
    searchFields: ['ID', 'Name', 'Description']
  },
  Items: {
    name: '物品',
    icon: '📦',
    description: '遊戲中所有可收集、使用、裝備的物品',
    path: 'Items',
    primaryFields: ['ID', 'Name', 'Price', 'StackLimit'],
    searchFields: ['ID', 'Name', 'Description']
  },
  Recipes: {
    name: '配方',
    icon: '📋',
    description: '製作配方，定義材料與產出',
    path: 'Recipes',
    primaryFields: ['ID', 'Product', 'Category'],
    searchFields: ['ID', 'Product']
  },
  SceneObjects: {
    name: '場景物件',
    icon: '🏠',
    description: '建築、家具、植物等場景中的物件',
    path: 'SceneObjects',
    primaryFields: ['ID', 'Name', 'Size'],
    searchFields: ['ID', 'Name', 'Description']
  },
  Quests: {
    name: '任務',
    icon: '📜',
    description: '遊戲任務定義',
    path: 'Quests',
    primaryFields: ['ID', 'Name', 'GiverRole'],
    searchFields: ['ID', 'Name']
  },
  Abilities: {
    name: '技能',
    icon: '⚔️',
    description: '戰鬥技能與能力',
    path: 'Abilities',
    primaryFields: ['ID', 'Name', 'Type'],
    searchFields: ['ID', 'Name', 'Description']
  },
  Biomes: {
    name: '生態群落',
    icon: '🌍',
    description: '世界地圖的生態群落定義',
    path: 'World/Biomes',
    primaryFields: ['ID', 'Name'],
    searchFields: ['ID', 'Name']
  },
  Races: {
    name: '種族',
    icon: '🧬',
    description: '角色種族定義',
    path: 'Races',
    primaryFields: ['ID', 'Name'],
    searchFields: ['ID', 'Name']
  },
  Traits: {
    name: '特性',
    icon: '✨',
    description: '角色特性定義',
    path: 'Character/Traits',
    primaryFields: ['ID', 'Name', 'Description'],
    searchFields: ['ID', 'Name', 'Description']
  },
  Skills: {
    name: '技能（角色）',
    icon: '📚',
    description: '角色技能系統',
    path: 'Character/Skills',
    primaryFields: ['ID', 'Name'],
    searchFields: ['ID', 'Name', 'Description']
  }
}

export const useGameDataStore = defineStore('gameData', () => {
  // 狀態
  const dataCache = ref({})
  const isLoading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')

  // 計算屬性
  const dataTypes = computed(() => Object.keys(DATA_TYPES))

  const getDataTypeConfig = (type) => DATA_TYPES[type] || null

  // 取得特定類型的資料
  const getData = (type) => {
    return dataCache.value[type] || []
  }

  // 取得特定 ID 的資料
  const getDataById = (type, id) => {
    const data = getData(type)
    return data.find(item => item.ID === id)
  }

  // 載入資料（從打包好的 JS 模組）
  const loadData = async (type) => {
    if (dataCache.value[type]) {
      return dataCache.value[type]
    }

    isLoading.value = true
    error.value = null

    try {
      // 動態載入資料模組
      const module = await import(`@/data/${type.toLowerCase()}.js`)
      dataCache.value[type] = module.default || []
      return dataCache.value[type]
    } catch (e) {
      console.warn(`無法載入資料類型: ${type}`, e)
      error.value = `無法載入 ${type} 資料`
      dataCache.value[type] = []
      return []
    } finally {
      isLoading.value = false
    }
  }

  // 載入所有資料（用於搜尋）
  const loadAllData = async () => {
    const promises = dataTypes.value.map(type => loadData(type))
    await Promise.all(promises)
  }

  // 搜尋所有資料
  const searchAllData = (query) => {
    if (!query || query.length < 2) return []

    const results = []
    const lowerQuery = query.toLowerCase()

    for (const type of dataTypes.value) {
      const data = getData(type)
      const config = getDataTypeConfig(type)

      for (const item of data) {
        const matches = config.searchFields.some(field => {
          const value = item[field]
          if (typeof value === 'string') {
            return value.toLowerCase().includes(lowerQuery)
          }
          return false
        })

        if (matches) {
          results.push({
            ...item,
            _type: type,
            _typeName: config.name
          })
        }
      }
    }

    return results.slice(0, 100) // 限制結果數量
  }

  // 取得資料統計
  const getStats = computed(() => {
    const stats = {}
    for (const type of dataTypes.value) {
      stats[type] = getData(type).length
    }
    return stats
  })

  return {
    // 狀態
    dataCache,
    isLoading,
    error,
    searchQuery,

    // 計算屬性
    dataTypes,
    getStats,

    // 方法
    getDataTypeConfig,
    getData,
    getDataById,
    loadData,
    loadAllData,
    searchAllData
  }
})
