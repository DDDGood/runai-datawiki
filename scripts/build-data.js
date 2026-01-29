/**
 * build-data.js
 * 資料預處理腳本
 *
 * 功能：
 * 1. 讀取 StreamingAssets/GameDefines 下的所有 JSON 檔案
 * 2. 處理 Parent 繼承關係
 * 3. 整合在地化文字
 * 4. 輸出為 ES modules
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs'
import { join, relative, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 路徑配置
const STREAMING_ASSETS = join(__dirname, '../../Assets/StreamingAssets')
const GAME_DEFINES = join(STREAMING_ASSETS, 'GameDefines')
const LANGUAGES_DIR = join(STREAMING_ASSETS, 'Languages')
const OUTPUT_DIR = join(__dirname, '../src/data')

// 資料類型映射（JSON 陣列名稱 → 輸出檔案名稱）
const DATA_TYPE_MAP = {
  'Characters': 'characters',
  'Items': 'items',
  'Recipes': 'recipes',
  'CookingRecipes': 'cookingrecipes',
  'SceneObjects': 'sceneobjects',
  'Quests': 'quests',
  'Abilities': 'abilities',
  'AbilityBuffs': 'abilitybuffs',
  'Biomes': 'biomes',
  'Sites': 'sites',
  'Races': 'races',
  'Traits': 'traits',
  'Skills': 'skills',
  'Needs': 'needs',
  'Thoughts': 'thoughts',
  'Backstories': 'backstories',
  'Dialogues': 'dialogues',
  'DialoguePacks': 'dialoguepacks',
  'Tiles': 'tiles',
  'VFXes': 'vfxes',
  'Projectiles': 'projectiles',
  'StatusEffects': 'statuseffects',
  'Loots': 'loots',
  'Blueprints': 'blueprints',
  'JobTypes': 'jobtypes',
  'ResearchProjects': 'researchprojects',
  'SettlementLevels': 'settlementlevels',
  'Factions': 'factions',
  'Incidents': 'incidents',
  'CombatAIs': 'combatais',
  'SettlerAIs': 'settlerais',
  'WildAIs': 'wildais',
  'FollowerAIs': 'followerais',
  'AIActions': 'aiactions',
  'Animations': 'animations',
  'TraderKinds': 'traderkinds',
  'Raids': 'raids',
  'WorldBosses': 'worldbosses'
}

// 儲存所有資料
const allData = {}

// 在地化資料
let localization = {}

/**
 * 遞迴讀取目錄下所有 JSON 檔案
 */
function readJsonFilesRecursively(dir, files = []) {
  if (!existsSync(dir)) return files

  const items = readdirSync(dir)
  for (const item of items) {
    const fullPath = join(dir, item)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      // 跳過 _Deprecated 目錄
      if (item.startsWith('_')) continue
      readJsonFilesRecursively(fullPath, files)
    } else if (item.endsWith('.json')) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * 安全解析 JSON
 */
function safeParseJson(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (e) {
    console.warn(`⚠️ JSON 解析失敗: ${filePath}`, e.message)
    return null
  }
}

/**
 * 載入所有 GameDefines JSON
 */
function loadGameDefines() {
  console.log('📁 讀取 GameDefines...')

  const jsonFiles = readJsonFilesRecursively(GAME_DEFINES)
  console.log(`   找到 ${jsonFiles.length} 個 JSON 檔案`)

  let loadedCount = 0
  for (const filePath of jsonFiles) {
    const data = safeParseJson(filePath)
    if (!data) continue

    // 遍歷 JSON 中的所有陣列
    for (const [key, value] of Object.entries(data)) {
      if (!Array.isArray(value)) continue

      // 初始化資料陣列
      if (!allData[key]) {
        allData[key] = []
      }

      // 加入資料
      allData[key].push(...value)
      loadedCount += value.length
    }
  }

  console.log(`   載入 ${loadedCount} 筆資料`)
}

/**
 * 處理 Parent 繼承關係
 * 復刻 DefineManager.SetParentData 的邏輯
 */
function processParentInheritance() {
  console.log('🔗 處理 Parent 繼承...')

  for (const [typeName, items] of Object.entries(allData)) {
    if (!Array.isArray(items) || items.length === 0) continue

    // 建立 ID → 資料的映射
    const idMap = new Map()
    for (const item of items) {
      if (item.ID) {
        idMap.set(item.ID, item)
      }
    }

    // 處理繼承（可能需要多次迭代處理多層繼承）
    let changed = true
    let iterations = 0
    const maxIterations = 50

    while (changed && iterations < maxIterations) {
      changed = false
      iterations++

      for (const item of items) {
        if (!item.Parent) continue

        const parent = idMap.get(item.Parent)
        if (!parent) continue

        // 複製父資料中缺少的欄位
        for (const [key, value] of Object.entries(parent)) {
          if (key === 'ID' || key === 'Parent') continue

          // 如果子資料沒有此欄位，從父資料複製
          if (!(key in item)) {
            item[key] = JSON.parse(JSON.stringify(value)) // 深拷貝
            changed = true
          }
          // 特殊處理陣列中的 "Inherit" 標記
          else if (Array.isArray(item[key]) && Array.isArray(value)) {
            const inheritIndex = item[key].indexOf('Inherit')
            if (inheritIndex !== -1) {
              // 移除 "Inherit" 並加入父陣列的內容
              item[key].splice(inheritIndex, 1, ...value)
              changed = true
            }
          }
        }
      }
    }

    if (iterations >= maxIterations) {
      console.warn(`   ⚠️ ${typeName} 繼承處理達到最大迭代次數`)
    }
  }
}

/**
 * 載入在地化資料
 */
function loadLocalization(language = 'ChineseTraditional') {
  console.log(`🌐 載入在地化資料 (${language})...`)

  const langDir = join(LANGUAGES_DIR, language, 'GameDefines')
  if (!existsSync(langDir)) {
    console.warn(`   ⚠️ 找不到語言目錄: ${langDir}`)
    return
  }

  const jsonFiles = readJsonFilesRecursively(langDir)
  let count = 0

  for (const filePath of jsonFiles) {
    const data = safeParseJson(filePath)
    if (!data) continue

    // 合併在地化資料
    for (const [key, value] of Object.entries(data)) {
      localization[key] = value
      count++
    }
  }

  console.log(`   載入 ${count} 筆在地化文字`)
}

/**
 * 套用在地化到資料
 */
function applyLocalization() {
  console.log('📝 套用在地化...')

  for (const [typeName, items] of Object.entries(allData)) {
    if (!Array.isArray(items)) continue

    // 根據資料類型決定前綴
    let prefix = ''
    if (typeName === 'Items') prefix = 'Defs.Items.'
    else if (typeName === 'Characters') prefix = 'Defs.Characters.'
    else if (typeName === 'Quests') prefix = 'Defs.Quests.'
    else if (typeName === 'Abilities') prefix = 'Defs.Abilities.'
    else if (typeName === 'SceneObjects') prefix = 'Defs.SceneObjects.'
    else if (typeName === 'Traits') prefix = 'Defs.Traits.'
    else if (typeName === 'Skills') prefix = 'Defs.Skills.'
    else if (typeName === 'Needs') prefix = 'Defs.Needs.'
    else if (typeName === 'Thoughts') prefix = 'Defs.Thoughts.'
    else if (typeName === 'Backstories') prefix = 'Defs.Backstories.'
    else if (typeName === 'Races') prefix = 'Defs.Races.'
    else if (typeName === 'Biomes') prefix = 'Defs.Biomes.'
    else continue

    for (const item of items) {
      if (!item.ID) continue

      // 嘗試從在地化資料取得 Name 和 Description
      const nameKey = `${prefix}${item.ID}.Name`
      const descKey = `${prefix}${item.ID}.Description`

      if (localization[nameKey] && !item.Name) {
        item.Name = localization[nameKey]
      }
      if (localization[descKey] && !item.Description) {
        item.Description = localization[descKey]
      }
    }
  }
}

/**
 * 輸出為 ES modules
 */
function outputModules() {
  console.log('📦 輸出 ES modules...')

  // 確保輸出目錄存在
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  let outputCount = 0

  for (const [typeName, outputName] of Object.entries(DATA_TYPE_MAP)) {
    const items = allData[typeName] || []

    // 輸出為 ES module
    const content = `// Auto-generated by build-data.js
// ${typeName}: ${items.length} items
export default ${JSON.stringify(items, null, 2)};
`

    const outputPath = join(OUTPUT_DIR, `${outputName}.js`)
    writeFileSync(outputPath, content, 'utf-8')
    outputCount++

    if (items.length > 0) {
      console.log(`   ✅ ${outputName}.js (${items.length} 筆)`)
    }
  }

  // 產生索引檔
  const indexContent = `// Auto-generated by build-data.js
${Object.values(DATA_TYPE_MAP).map(name =>
    `export { default as ${name} } from './${name}.js';`
  ).join('\n')}

export const dataTypes = ${JSON.stringify(Object.keys(DATA_TYPE_MAP))};
`

  writeFileSync(join(OUTPUT_DIR, 'index.js'), indexContent, 'utf-8')
  console.log(`   ✅ index.js`)

  console.log(`\n📊 總計輸出 ${outputCount + 1} 個檔案`)
}

/**
 * 產生資料統計
 */
function printStats() {
  console.log('\n📈 資料統計:')

  const stats = Object.entries(allData)
    .map(([name, items]) => ({ name, count: items?.length || 0 }))
    .filter(s => s.count > 0)
    .sort((a, b) => b.count - a.count)

  for (const stat of stats.slice(0, 15)) {
    console.log(`   ${stat.name.padEnd(20)} ${stat.count}`)
  }

  if (stats.length > 15) {
    console.log(`   ... 還有 ${stats.length - 15} 個類型`)
  }
}

// 主程式
async function main() {
  console.log('🚀 開始建構資料...\n')

  // 1. 載入 GameDefines
  loadGameDefines()

  // 2. 處理 Parent 繼承
  processParentInheritance()

  // 3. 載入在地化
  loadLocalization()

  // 4. 套用在地化
  applyLocalization()

  // 5. 輸出模組
  outputModules()

  // 6. 顯示統計
  printStats()

  console.log('\n✨ 建構完成!')
}

main().catch(console.error)
