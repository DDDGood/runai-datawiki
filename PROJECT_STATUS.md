# DataWiki 專案狀態文檔

> **重要**：此文檔供 Claude agent 閱讀，了解專案的來龍去脈和當前進度。
> 每次工作完成後請更新此文檔。

---

## 專案概述

### 什麼是 DataWiki？

DataWiki 是 Game2022 遊戲專案的**遊戲資料手冊靜態網站**，目的是：
1. **教學文檔**：詳細說明每種遊戲資料（JSON）的建立方式
2. **資料瀏覽器**：一覽所有現有遊戲資料
3. **搜尋功能**：快速查找資料

### 使用情境

- **短期**：團隊（企劃、美術）在專案目錄直接打開 `dist/index.html` 使用
- **長期**：部署到 GitHub Pages，方便更新與分享

### 為什麼需要這個網站？

Game2022 是一個 Data-Driven 的遊戲，大部分遊戲內容定義在 `Assets/StreamingAssets/` 目錄的 JSON 檔案中。團隊成員和玩家需要一個方便的方式來：
- 了解每種資料的欄位和用法
- 瀏覽現有的遊戲資料
- 快速找到需要的資料

---

## 技術架構

### 技術棧

```
前端框架：Vue 3 (Composition API)
建構工具：Vite
樣式框架：TailwindCSS
路由：Vue Router (Hash mode - 支援 file:// 協定本地開啟)
狀態管理：Pinia
搜尋：Fuse.js (客戶端模糊搜尋)
Markdown：marked.js
```

### 關鍵技術決策

**本地開啟的 CORS 問題解決方案**：
- 瀏覽器不允許 `file://` 協定下使用 `fetch()` 讀取本地檔案
- 解決方案：Build-time 資料預處理，將 JSON 打包成 JavaScript 模組
- 使用 Hash mode 路由 (`/#/items/Cabbage`)，支援本地直接開啟

### 目錄結構

```
DataWiki/
├── package.json              # NPM 配置
├── vite.config.js            # Vite 配置
├── index.html                # 入口 HTML
├── PROJECT_STATUS.md         # 此文檔（專案狀態）
├── scripts/
│   └── build-data.js         # 資料預處理腳本（核心）
├── src/
│   ├── main.js               # 應用入口
│   ├── App.vue               # 主元件
│   ├── style.css             # 全域樣式 + TailwindCSS
│   ├── router/
│   │   └── index.js          # 路由配置
│   ├── stores/
│   │   └── gameData.js       # Pinia store（資料管理）
│   ├── components/
│   │   └── layout/
│   │       ├── Sidebar.vue   # 側邊欄導航
│   │       └── Header.vue    # 頂部搜尋欄
│   ├── views/
│   │   ├── Home.vue          # 首頁
│   │   ├── DataBrowser.vue   # 資料瀏覽器
│   │   ├── DataDetail.vue    # 資料詳情頁
│   │   ├── DocPage.vue       # 文檔頁面
│   │   └── SearchResults.vue # 搜尋結果頁
│   ├── data/                 # build-data.js 自動生成的資料模組
│   │   ├── characters.js
│   │   ├── items.js
│   │   └── ...
│   └── docs/                 # 手動撰寫的教學文檔（Markdown）
│       ├── getting-started.md
│       └── data-types/
│           └── index.md
└── dist/                     # Build 輸出（可直接開啟 index.html）
```

### 資料流程

```
Assets/StreamingAssets/GameDefines/*.json
                ↓
        build-data.js（Node.js 腳本）
        - 讀取所有 JSON 檔案
        - 處理 Parent 繼承關係
        - 整合在地化文字
                ↓
        src/data/*.js（ES modules）
                ↓
        Vite build
                ↓
        dist/（靜態網站）
```

---

## 當前進度

### 已完成（Phase 1：基礎架構）

- [x] 初始化 Vue 3 + Vite 專案
- [x] 配置 TailwindCSS
- [x] 實作 build-data.js 資料處理腳本
  - 自動讀取 682 個 JSON 檔案
  - 處理 Parent 繼承關係
  - 整合繁體中文在地化（2546 筆翻譯）
  - 輸出 39 個 ES modules（共 2176 筆資料）
- [x] 建立基本 layout 元件（Sidebar、Header）
- [x] 建立首頁 Home.vue
- [x] 建立資料瀏覽器 DataBrowser.vue
- [x] 建立資料詳情頁 DataDetail.vue
- [x] 建立文檔頁面 DocPage.vue
- [x] 建立搜尋結果頁 SearchResults.vue
- [x] 建立範例文檔（getting-started.md、data-types/index.md）
- [x] 測試網站建構流程

### 待完成

#### Phase 2：資料瀏覽器優化
- [ ] 圖像預覽元件（顯示 SpritePath 指向的圖像）
- [ ] 更好的欄位顯示（識別 ID 連結、顯示關聯資料）
- [ ] JSON 檢視器優化（語法高亮）
- [ ] 資料匯出功能

#### Phase 3：文檔系統 + Claude Skills
- [ ] 建立 Claude Skill: `data-doc-writer`
  - 用於自動撰寫資料類型的詳細文檔
  - 工作流程：讀取 C# 類別 → 讀取 JSON 範例 → 產生 Markdown
- [ ] 撰寫 Characters 系統完整文檔
  - CharacterData、RaceData、TraitData、SkillData
  - SettlerAIData、CombatAIData
  - BackstoryData、NeedData

#### Phase 4：搜尋與部署
- [ ] 整合 Fuse.js 進階搜尋
- [ ] 效能優化（lazy loading）
- [ ] GitHub Pages 部署腳本
- [ ] 自動化 CI/CD

---

## 如何使用

### 開發模式

```bash
cd DataWiki
npm install      # 首次需要安裝依賴
npm run dev      # 啟動開發伺服器，瀏覽器自動開啟 http://localhost:5173
```

### 建構靜態網站

```bash
cd DataWiki
npm run build    # 執行 build-data.js + vite build
```

建構完成後，直接用瀏覽器開啟 `dist/index.html` 即可。

### 僅更新資料（不重新建構網站）

```bash
cd DataWiki
npm run build:data   # 只執行 build-data.js
```

---

## 關鍵檔案說明

### scripts/build-data.js

這是最重要的檔案，負責將遊戲資料轉換為網站可用的格式。

**功能**：
1. 遞迴讀取 `StreamingAssets/GameDefines/` 下所有 JSON
2. 處理 `Parent` 欄位的繼承關係（復刻 DefineManager 的邏輯）
3. 從 `StreamingAssets/Languages/ChineseTraditional/` 載入在地化
4. 輸出為 ES modules 到 `src/data/`

**如果要新增支援的資料類型**：
編輯 `DATA_TYPE_MAP` 物件，加入新的映射。

### src/stores/gameData.js

Pinia store，管理遊戲資料的載入和存取。

**關鍵函數**：
- `loadData(type)` - 動態載入指定類型的資料
- `getDataById(type, id)` - 取得特定 ID 的資料
- `searchAllData(query)` - 搜尋所有資料

**如果要新增資料類型到 UI**：
編輯 `DATA_TYPES` 物件，加入新類型的配置。

### src/views/DataBrowser.vue

資料瀏覽器頁面，顯示表格、支援搜尋和分頁。

### src/views/DataDetail.vue

資料詳情頁面，顯示單筆資料的所有欄位。

---

## 已知問題

1. **JSON 格式錯誤**：`Item_Furnitures_SandStone.json` 有語法錯誤，build-data.js 會跳過此檔案
2. **圖像預覽**：尚未實作，目前只顯示 SpritePath 字串
3. **部分資料類型未映射**：如 `SceneObjectGroups`、`Stats` 等，可視需求加入

---

## 相關文件

- **計畫書**：`C:\Users\D Good\.claude\plans\ticklish-doodling-moonbeam.md`
- **專案主 CLAUDE.md**：`Game2022/CLAUDE.md`
- **DefineManager Spec**：`openspec/specs/define-manager-system/spec.md`

---

## 給下一位 Claude Agent 的提醒

1. **先讀取此文檔**了解專案狀態
2. **查看待完成項目**決定下一步工作
3. **測試變更**：修改後執行 `npm run build` 確認建構成功
4. **更新此文檔**：完成工作後更新「當前進度」區塊

### 常見任務

**新增資料類型支援**：
1. 編輯 `scripts/build-data.js` 的 `DATA_TYPE_MAP`
2. 編輯 `src/stores/gameData.js` 的 `DATA_TYPES`
3. 執行 `npm run build`

**撰寫資料類型文檔**：
1. 閱讀對應的 C# 類別定義（在 `Assets/Scripts/` 中搜尋）
2. 閱讀 `StreamingAssets/GameDefines/` 中的 JSON 範例
3. 在 `src/docs/data-types/` 建立 Markdown 檔案
4. 遵循 `getting-started.md` 的格式風格

---

*最後更新：2026-01-29*
*更新者：Claude Opus 4.5*
