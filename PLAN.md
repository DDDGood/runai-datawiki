# Game2022 遊戲資料手冊網站 - 實作計畫

---

## 給外行人的說明

### 這個網站是什麼？

想像你有一本「遊戲資料百科全書」：
- **左邊目錄**：列出所有資料類型（物品、角色、配方...）
- **中間內容**：顯示資料清單或詳細資訊
- **上方搜尋**：快速找到你要的資料

這個網站會**自動讀取**專案裡的 `StreamingAssets` 資料夾，所以：
- 你新增一個物品 JSON → 網站自動顯示這個物品
- 你修改角色資料 → 網站自動反映變更

### 技術方案白話解釋

**問題**：瀏覽器基於安全考量，不允許網頁直接讀取電腦上的檔案

**解決方案**：
```
你的 JSON 資料 ──→ 轉換腳本 ──→ 網頁可以讀取的格式 ──→ 完成的網站
(StreamingAssets)   (build)      (打包好的資料)         (dist 資料夾)
```

所以每次你修改資料後，需要執行一次「build」指令，網站就會更新。

### 完成後怎麼運作？

**本地使用（團隊內部）：**
1. 打開 `DataWiki/dist/index.html`
2. 網站就會在瀏覽器中開啟
3. 可以瀏覽所有資料、查看教學文檔

**線上使用（GitHub Pages）：**
1. 推送到 GitHub 後自動部署
2. 任何人都可以用網址訪問
3. 只要更新 GitHub 上的資料，網站就會自動更新

### 怎麼更新網站內容？

**情況 A：你修改了遊戲資料（JSON）**
```
1. 正常修改 StreamingAssets 裡的 JSON 檔案
2. 打開命令列，進入 DataWiki 資料夾
3. 執行 npm run build
4. 完成！網站已更新
```

**情況 B：你想新增教學文檔**
```
1. 在 DataWiki/src/docs/ 資料夾
2. 新增或修改 .md 檔案（用 Markdown 格式撰寫）
3. 執行 npm run build
4. 完成！文檔已更新
```

**情況 C：部署到 GitHub Pages**
```
1. 執行 npm run deploy
2. 等待幾分鐘
3. 網站會自動更新到線上
```

### 什麼是 Vue.js / Vite / TailwindCSS？

你不需要了解這些技術細節。簡單說：
- **Vue.js**：一個幫我們製作網頁的工具（類似 Unity 幫你製作遊戲）
- **Vite**：讓開發更快的輔助工具
- **TailwindCSS**：讓網頁變漂亮的樣式工具

你只需要知道：
- 修改 JSON 資料 → 執行 build → 網站更新
- 撰寫 Markdown 文檔 → 執行 build → 文檔更新

---

## 專案目標

建立一個完整的遊戲資料手冊靜態網站，提供：
1. **教學文檔**：詳細說明每種遊戲資料的建立方式
2. **資料瀏覽器**：一覽所有現有遊戲資料
3. **搜尋功能**：快速查找資料

**使用情境：**
- 短期：團隊（企劃、美術）在專案目錄直接打開使用
- 長期：部署到 GitHub Pages，方便更新與分享

---

## 技術方案

### 推薦技術棧
```
前端框架：Vue 3 (Composition API)
建構工具：Vite
樣式框架：TailwindCSS
路由：Vue Router (Hash mode - 支援 file:// 協定)
搜尋：Fuse.js (客戶端模糊搜尋)
Markdown：marked.js
```

### 關鍵技術決策

**本地開啟的 CORS 問題解決：**
- 使用 Build-time 資料預處理，將 JSON 打包成 JavaScript 模組
- 使用 Hash mode 路由 (`/#/items/Cabbage`)
- 產出的靜態網站可直接用瀏覽器開啟

---

## 目錄結構

```
Game2022/
└── DataWiki/                   # 放在專案根目錄
        ├── package.json
        ├── vite.config.js
        ├── index.html
        ├── scripts/
        │   ├── build-data.js          # 資料預處理腳本
        │   └── copy-images.js         # 圖像複製腳本
        ├── src/
        │   ├── main.js
        │   ├── App.vue
        │   ├── router/index.js
        │   ├── stores/                 # Pinia 狀態管理
        │   │   └── gameData.js
        │   ├── components/
        │   │   ├── layout/            # 版面元件
        │   │   ├── data/              # 資料顯示元件
        │   │   └── docs/              # 文檔元件
        │   ├── views/
        │   │   ├── Home.vue           # 首頁
        │   │   ├── DataBrowser.vue    # 資料瀏覽器
        │   │   ├── DataDetail.vue     # 資料詳情
        │   │   └── DocPage.vue        # 文檔頁面
        │   ├── data/                   # Build 時自動生成
        │   │   ├── items.js
        │   │   ├── characters.js
        │   │   └── ...
        │   └── docs/                   # 手動撰寫的教學文檔
        │       ├── getting-started.md
        │       └── data-types/
        │           ├── items.md
        │           └── ...
        └── dist/                       # Build 輸出
```

---

## 資料載入策略

### Build-time 處理流程
```
StreamingAssets/GameDefines/*.json
        ↓ (build-data.js)
src/data/*.js (ES modules)
        ↓ (Vite build)
dist/ (可直接開啟的靜態網站)
```

### build-data.js 功能
1. 遞迴讀取所有 JSON 檔案
2. 處理 Parent 繼承關係（復刻 DefineManager 邏輯）
3. 整合在地化文字（從 Languages/ 讀取）
4. 輸出為 ES modules

### 圖像處理
- Build 時將常用圖像複製到 dist/assets/images/
- 使用相對路徑載入圖像

---

## 核心功能設計

### 1. 首頁
- 資料類型總覽（卡片式顯示）
- 快速入門連結
- 資料統計

### 2. 資料瀏覽器
- 分頁表格顯示
- 欄位排序與篩選
- 可自訂顯示欄位

### 3. 資料詳情頁
- 圖像預覽
- 欄位展開顯示
- 交叉引用連結
- 原始 JSON 檢視

### 4. 文檔系統
- Markdown 渲染
- 欄位說明表格
- 範例 JSON 片段

### 5. 搜尋功能
- 全域模糊搜尋 (Fuse.js)
- 搜尋 ID、Name、Description
- 依類型分組結果

---

## 實作階段

### Phase 1：基礎架構
- [ ] 初始化 Vue 3 + Vite 專案
- [ ] 配置 TailwindCSS
- [ ] 實作 build-data.js 腳本
- [ ] 建立基本 layout 元件

### Phase 2：資料瀏覽器
- [ ] DataBrowser 元件（表格、篩選、分頁）
- [ ] DataDetail 元件（詳情顯示）
- [ ] 圖像預覽元件
- [ ] JSON 檢視器

### Phase 3：文檔系統
- [ ] Markdown 渲染元件
- [ ] 建立 Claude Skills 自動化文檔撰寫
- [ ] **首批重點**：Characters（角色）系統完整文檔
  - CharacterData、RaceData、TraitData、SkillData
  - SettlerAIData、CombatAIData
  - BackstoryData、NeedData

### Phase 4：搜尋與優化
- [ ] 整合 Fuse.js 搜尋
- [ ] 效能優化（lazy loading）
- [ ] 部署腳本

---

## Claude Skills 規劃

### skill: data-doc-writer
**用途**：為指定資料類型撰寫完整的編輯指南文檔

**工作流程**：
1. 接收資料類型名稱（如 "CharacterData"）
2. 閱讀對應的 C# 資料類別定義
3. 閱讀 StreamingAssets 中的 JSON 範例
4. 分析資料與其他系統的關聯
5. 產生標準化的 Markdown 文檔，包含：
   - 概述與用途說明
   - 完整欄位說明表格
   - 元件/子結構說明
   - 實際範例與最佳實踐
   - 常見問題與除錯技巧

### skill: data-browser-builder
**用途**：為指定資料類型設計資料瀏覽器的欄位配置

**工作流程**：
1. 分析資料結構，決定表格顯示欄位
2. 設計篩選器選項
3. 決定詳情頁面的展示方式
4. 產生 Vue 元件配置檔

### 文檔標準格式
```markdown
# [資料類型名稱]

## 概述
[簡短說明此資料類型的用途]

## 檔案位置
[JSON 檔案的存放路徑]

## 欄位說明
| 欄位 | 類型 | 必填 | 說明 |
|-----|------|-----|------|

## 元件系統（如適用）
[說明各種 Component 的用法]

## 關聯資料
[與其他資料類型的關係]

## 範例
[完整的 JSON 範例]

## 常見問題
[FAQ]
```

---

## 驗證方式

1. **本地測試**：`npm run build` 後直接用瀏覽器開啟 `dist/index.html`
2. **開發模式**：`npm run dev` 啟動開發伺服器
3. **部署測試**：推送到 GitHub Pages 驗證

---

## 已確認決策

- **網站目錄**：根目錄 `DataWiki/`
- **首批資料類型**：Characters（角色）系統
- **自動化**：建立 Claude Skills 來自動化文檔撰寫

---

## 下一步行動

1. **建立專案結構**
   - 初始化 `DataWiki/` Vue 3 + Vite 專案
   - 配置 TailwindCSS 與基本 layout

2. **實作資料處理腳本**
   - `scripts/build-data.js` - 讀取並轉換 JSON 資料
   - 處理 Parent 繼承邏輯

3. **建立 Claude Skills**
   - `data-doc-writer` - 文檔撰寫自動化
   - 從 Characters 系統開始

4. **開發核心元件**
   - DataBrowser、DataDetail、搜尋功能

---

## 預估工作量

| 階段 | 內容 |
|-----|------|
| Phase 1 | 專案初始化、build-data.js、基本 layout |
| Phase 2 | 資料瀏覽器（表格、詳情、圖像） |
| Phase 3 | Claude Skills + Characters 完整文檔 |
| Phase 4 | 搜尋、優化、部署 |

---

## 日常操作指南（完成後）

### 首次設定（只需做一次）

```bash
# 1. 安裝 Node.js（如果還沒安裝）
#    從 https://nodejs.org 下載並安裝 LTS 版本

# 2. 安裝專案依賴
cd DataWiki
npm install
```

### 開發模式（即時預覽）

```bash
# 啟動開發伺服器，修改會即時反映
npm run dev

# 瀏覽器會自動開啟 http://localhost:5173
# 修改文檔或程式碼時，網頁會自動更新
```

### 建構網站（產出靜態檔案）

```bash
# 讀取最新的 JSON 資料並建構網站
npm run build

# 完成後，dist 資料夾就是完整的網站
# 可以直接用瀏覽器開啟 dist/index.html
```

### 部署到 GitHub Pages

```bash
# 建構並部署到 GitHub Pages
npm run deploy

# 網站會在幾分鐘後更新
```

### 資料夾結構說明

```
DataWiki/
├── src/docs/          ← 在這裡撰寫教學文檔（.md 檔案）
├── dist/              ← 建構完成的網站（可直接開啟）
└── scripts/           ← 資料處理腳本（通常不需要修改）

../Assets/StreamingAssets/
├── GameDefines/       ← 遊戲資料 JSON（網站會自動讀取）
├── Images/            ← 遊戲圖像（網站會自動顯示）
└── Languages/         ← 在地化文字（網站會自動套用）
```

### 常見問題

**Q: 我修改了 JSON，但網站沒更新？**
A: 執行 `npm run build` 重新建構網站

**Q: 網站開啟是空白的？**
A: 確認是用瀏覽器開啟 `dist/index.html`，不是直接點擊檔案

**Q: 怎麼新增一個資料類型的文檔？**
A: 在 `src/docs/data-types/` 新增 `.md` 檔案，然後 build

**Q: 圖片沒顯示？**
A: 確認圖片路徑在 JSON 中正確設定，並執行 build
