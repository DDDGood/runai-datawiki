const r=`# 資料定義基礎\r
\r
本文件說明 Game2022 遊戲資料定義系統的基礎概念。在閱讀各資料類型的詳細說明前，請先了解這些通用規則。\r
\r
## 目錄結構\r
\r
所有遊戲資料都存放在 \`Assets/StreamingAssets/GameDefines/\` 目錄下：\r
\r
\`\`\`\r
GameDefines/\r
├── Abilities/              # 技能與能力\r
│   ├── AbilityBuffs/       # 增益效果\r
│   └── AbilityStats/       # 技能數值\r
├── AI/                     # AI 行為定義\r
│   ├── Actions/            # AI 動作\r
│   ├── AIs/                # 通用 AI\r
│   ├── CombatAI/           # 戰鬥 AI\r
│   ├── FollowerAI/         # 跟隨者 AI\r
│   └── WildAI/             # 野生動物 AI\r
├── Animations/             # 動畫定義\r
├── Character/              # 角色相關\r
│   ├── Animals/            # 動物角色\r
│   ├── Backstories/        # 背景故事\r
│   ├── Dialogues/          # 對話\r
│   ├── Mechs/              # 機甲\r
│   ├── Needs/              # 角色需求\r
│   ├── Skills/             # 技能\r
│   ├── Thoughts/           # 想法\r
│   └── Traits/             # 特質\r
├── CookingRecipes/         # 烹飪食譜\r
├── Factions/               # 陣營\r
├── GameProgression/        # 遊戲進程\r
│   ├── SettlementLevel/    # 聚落等級\r
│   ├── Starter/            # 開局設定\r
│   └── Storyteller/        # 事件系統\r
├── Items/                  # 物品\r
│   ├── Equipments/         # 裝備\r
│   ├── Food/               # 食物\r
│   ├── Furnitures/         # 家具（物品型態）\r
│   ├── Resources/          # 資源\r
│   └── ToolsAndWeapons/    # 工具與武器\r
├── JobType/                # 工作類型\r
├── Loots/                  # 掉落表\r
├── Projectiles/            # 投射物\r
├── Quests/                 # 任務\r
├── Races/                  # 種族\r
├── Raids/                  # 襲擊事件\r
├── Recipes/                # 製作配方\r
├── Research/               # 研究項目\r
├── SceneGenerators/        # 場景生成器\r
├── SceneObjectGroups/      # 場景物件群組\r
├── SceneObjects/           # 場景物件\r
│   ├── Buildings/          # 建築\r
│   ├── Decorations/        # 裝飾\r
│   ├── Furnitures/         # 家具\r
│   ├── Plants/             # 植物\r
│   ├── Resources/          # 資源物件\r
│   ├── Trees/              # 樹木\r
│   └── ...\r
├── Scenes/                 # 場景定義\r
├── Stats/                  # 屬性定義\r
├── StatusEffects/          # 狀態效果\r
├── Tiles/                  # 地形瓦片\r
├── VFX/                    # 視覺特效\r
└── World/                  # 世界相關\r
    ├── Biomes/             # 生態群落\r
    ├── Bosses/             # 世界首領\r
    └── Sites/              # 地點\r
\`\`\`\r
\r
## JSON 基礎格式\r
\r
### 檔案結構\r
\r
每個 JSON 檔案包含一個或多個資料類型的陣列：\r
\r
\`\`\`json\r
{\r
    "資料類型名稱": [\r
        { /* 資料項目 1 */ },\r
        { /* 資料項目 2 */ },\r
        { /* 資料項目 3 */ }\r
    ]\r
}\r
\`\`\`\r
\r
### 範例\r
\r
\`\`\`json\r
{\r
    "Items": [\r
        {\r
            "ID": "Wood",\r
            "Name": "木材",\r
            "StackLimit": 50\r
        },\r
        {\r
            "ID": "Stone",\r
            "Name": "石頭",\r
            "StackLimit": 50\r
        }\r
    ]\r
}\r
\`\`\`\r
\r
### 一個檔案可以包含多種資料類型\r
\r
\`\`\`json\r
{\r
    "Items": [\r
        { "ID": "MyItem", "Name": "我的物品" }\r
    ],\r
    "Recipes": [\r
        { "ID": "Make_MyItem", "Product": { "Item": "MyItem" } }\r
    ]\r
}\r
\`\`\`\r
\r
## 必要欄位：ID\r
\r
**每一筆資料都必須有 \`ID\` 欄位**，這是唯一識別碼。\r
\r
### ID 規則\r
\r
1. **唯一性**：同一資料類型中，ID 不可重複\r
2. **命名慣例**：\r
   - 使用 PascalCase 或底線分隔：\`WoodFloor\`、\`Make_WoodFloor\`\r
   - 配方通常用 \`Make_\` 前綴：\`Make_Bread\`、\`Make_IronSword\`\r
   - 基底資料通常用 \`Base\` 後綴：\`ItemBase\`、\`TreeBase\`\r
3. **引用方式**：其他資料透過 ID 引用，如配方的產出物品\r
\r
\`\`\`json\r
{\r
    "ID": "Cabbage",           // ✅ 正確\r
    "Name": "高麗菜"\r
}\r
\`\`\`\r
\r
\`\`\`json\r
{\r
    "Name": "高麗菜"            // ❌ 錯誤：缺少 ID\r
}\r
\`\`\`\r
\r
---\r
\r
## Parent 繼承機制\r
\r
\`Parent\` 欄位讓資料可以繼承另一筆資料的所有欄位，大幅減少重複填寫。\r
\r
### 基本原理\r
\r
1. 子資料指定 \`"Parent": "父資料ID"\`\r
2. 系統載入時，子資料會自動獲得父資料的所有欄位\r
3. 子資料可以**覆蓋**父資料的欄位（只需重新定義該欄位）\r
4. 父資料可以是純模板（不實際使用於遊戲），也可以是實際資料\r
\r
### 簡單範例\r
\r
\`\`\`json\r
{\r
    "Items": [\r
        {\r
            "ID": "CropBase",\r
            "StackLimit": 20,\r
            "Price": 50\r
        },\r
        {\r
            "Parent": "CropBase",\r
            "ID": "Cabbage",\r
            "Name": "高麗菜"\r
        },\r
        {\r
            "Parent": "CropBase",\r
            "ID": "Carrot",\r
            "Name": "紅蘿蔔"\r
        }\r
    ]\r
}\r
\`\`\`\r
\r
**結果：**\r
- \`Cabbage\` 擁有 \`StackLimit: 20\`、\`Price: 50\`、\`Name: "高麗菜"\`\r
- \`Carrot\` 擁有 \`StackLimit: 20\`、\`Price: 50\`、\`Name: "紅蘿蔔"\`\r
\r
### 覆蓋父資料欄位\r
\r
子資料定義的欄位會覆蓋父資料的同名欄位：\r
\r
\`\`\`json\r
{\r
    "Recipes": [\r
        {\r
            "ID": "RecipeBase",\r
            "Work": 100,\r
            "RelevantSkill": "Crafting",\r
            "FinishExp": 40\r
        },\r
        {\r
            "Parent": "RecipeBase",\r
            "ID": "RecipeFloorBase",\r
            "Work": 200\r
        }\r
    ]\r
}\r
\`\`\`\r
\r
**結果：**\r
- \`RecipeFloorBase\` 的 \`Work\` 是 \`200\`（覆蓋了父資料的 100）\r
- \`RecipeFloorBase\` 的 \`RelevantSkill\` 是 \`"Crafting"\`（繼承自父資料）\r
- \`RecipeFloorBase\` 的 \`FinishExp\` 是 \`40\`（繼承自父資料）\r
\r
### 多層繼承\r
\r
繼承可以是多層的（A → B → C）：\r
\r
\`\`\`json\r
{\r
    "SceneObjects": [\r
        {\r
            "ID": "SceneObjectBase",\r
            "Passable": true\r
        },\r
        {\r
            "Parent": "SceneObjectBase",\r
            "ID": "TreeBase",\r
            "SceneObjectType": "Tree",\r
            "Tags": ["Tree"]\r
        },\r
        {\r
            "Parent": "TreeBase",\r
            "ID": "GatherableTreeBase",\r
            "JComponents": {\r
                "Gatherable": { "GatherWork": 60 }\r
            }\r
        },\r
        {\r
            "Parent": "GatherableTreeBase",\r
            "ID": "BirchTree",\r
            "Name": "樺木"\r
        }\r
    ]\r
}\r
\`\`\`\r
\r
**BirchTree 最終擁有：**\r
- \`Passable: true\`（來自 SceneObjectBase）\r
- \`SceneObjectType: "Tree"\`（來自 TreeBase）\r
- \`Tags: ["Tree"]\`（來自 TreeBase）\r
- \`JComponents.Gatherable\`（來自 GatherableTreeBase）\r
- \`Name: "樺木"\`（自己定義）\r
\r
### 繼承設計最佳實踐\r
\r
1. **建立清晰的繼承層級**：\r
   \`\`\`\r
   SceneObjectBase\r
   └── TreeBase\r
       └── GatherableTreeBase\r
           ├── BirchTree\r
           ├── PineTree\r
           └── OakTree\r
   \`\`\`\r
\r
2. **基底資料放在獨立檔案**：如 \`TreeBase.json\` 定義所有樹的基底\r
\r
3. **善用分類基底**：\r
   - \`CropBase\` → 所有農作物\r
   - \`WeaponBase\` → 所有武器\r
   - \`RecipeCookingBase\` → 所有烹飪配方\r
\r
---\r
\r
## Inherit 陣列繼承\r
\r
當子資料的**陣列欄位**需要**擴充**（而非完全覆蓋）父資料的陣列時，使用 \`"Inherit"\` 標記。\r
\r
### 問題情境\r
\r
預設情況下，子資料的陣列會**完全覆蓋**父資料的陣列：\r
\r
\`\`\`json\r
{\r
    "Characters": [\r
        {\r
            "ID": "CharacterBase",\r
            "Abilities": ["Attack", "Dodge"]\r
        },\r
        {\r
            "Parent": "CharacterBase",\r
            "ID": "Warrior",\r
            "Abilities": ["PowerStrike"]\r
        }\r
    ]\r
}\r
\`\`\`\r
\r
**結果：** \`Warrior\` 的 \`Abilities\` 只有 \`["PowerStrike"]\`，失去了 \`Attack\` 和 \`Dodge\`！\r
\r
### 解決方案：使用 Inherit\r
\r
在陣列中加入 \`"Inherit"\` 字串，系統會：\r
1. 移除 \`"Inherit"\` 標記\r
2. 將父資料的陣列元素附加到子資料陣列**末尾**\r
\r
\`\`\`json\r
{\r
    "Characters": [\r
        {\r
            "ID": "CharacterBase",\r
            "Abilities": ["Attack", "Dodge"]\r
        },\r
        {\r
            "Parent": "CharacterBase",\r
            "ID": "Warrior",\r
            "Abilities": ["PowerStrike", "Inherit"]\r
        }\r
    ]\r
}\r
\`\`\`\r
\r
**結果：** \`Warrior\` 的 \`Abilities\` 是 \`["PowerStrike", "Attack", "Dodge"]\`\r
\r
### 順序說明\r
\r
- 子資料原有的元素在**前面**\r
- 父資料的元素附加在**後面**\r
\r
\`\`\`json\r
// 子資料定義\r
"Tags": ["Special", "Rare", "Inherit"]\r
\r
// 父資料定義\r
"Tags": ["Common", "Basic"]\r
\r
// 最終結果\r
"Tags": ["Special", "Rare", "Common", "Basic"]\r
\`\`\`\r
\r
### 實際範例：場景物件的 Components\r
\r
\`\`\`json\r
{\r
    "SceneObjects": [\r
        {\r
            "ID": "TreeBase",\r
            "Components": [\r
                { "CompType": "Collider", "Collider": { "Type": "Circle" } },\r
                { "CompType": "LightCollider" },\r
                { "CompType": "DayLightCollider" }\r
            ]\r
        },\r
        {\r
            "Parent": "TreeBase",\r
            "ID": "BirchTree",\r
            "Components": [\r
                "Inherit",\r
                { "CompType": "Plant", "Plant": { "LifeStages": [...] } }\r
            ]\r
        }\r
    ]\r
}\r
\`\`\`\r
\r
**結果：** \`BirchTree\` 的 \`Components\` 包含：\r
1. \`Collider\`（繼承自 TreeBase）\r
2. \`LightCollider\`（繼承自 TreeBase）\r
3. \`DayLightCollider\`（繼承自 TreeBase）\r
4. \`Plant\`（自己新增）\r
\r
> **注意**：\`"Inherit"\` 放在陣列的任何位置都可以，系統會將其移除後再附加父資料。\r
\r
### Inherit 使用時機\r
\r
| 情境 | 使用方式 |\r
|------|----------|\r
| 完全覆蓋父陣列 | 直接定義陣列，不加 Inherit |\r
| 繼承父陣列 + 新增元素 | 加入 \`"Inherit"\` |\r
| 只繼承，不新增 | 不定義該欄位（自動繼承） |\r
\r
---\r
\r
## 資料類型對照表\r
\r
| 資料類型 | JSON 鍵名 | 說明 |\r
|----------|-----------|------|\r
| 角色 | \`Characters\` | NPC、敵人、動物 |\r
| 物品 | \`Items\` | 可攜帶的物品 |\r
| 配方 | \`Recipes\` | 製作配方 |\r
| 烹飪食譜 | \`CookingRecipes\` | 烹飪專用配方 |\r
| 場景物件 | \`SceneObjects\` | 地圖上的物件（建築、樹木等） |\r
| 地形瓦片 | \`Tiles\` | 地板瓦片 |\r
| 技能 | \`Abilities\` | 戰鬥技能 |\r
| 增益效果 | \`AbilityBuffs\` | 技能產生的 Buff |\r
| 種族 | \`Races\` | 種族定義 |\r
| 特質 | \`Traits\` | 角色特質 |\r
| 技能 | \`Skills\` | 角色技能（非戰鬥） |\r
| 需求 | \`Needs\` | 角色需求（飢餓等） |\r
| 背景故事 | \`Backstories\` | 角色背景 |\r
| 任務 | \`Quests\` | 任務定義 |\r
| 對話 | \`Dialogues\` | 對話內容 |\r
| 生態群落 | \`Biomes\` | 世界地形 |\r
| 地點 | \`Sites\` | 世界地圖地點 |\r
| AI | \`SettlerAIs\`, \`CombatAIs\`, \`WildAIs\` | AI 行為 |\r
| 掉落表 | \`Loots\` | 掉落物品定義 |\r
| 研究 | \`ResearchProjects\` | 研究項目 |\r
| 動畫 | \`Animations\` | Sprite 動畫 |\r
| 特效 | \`VFXes\` | 視覺特效 |\r
\r
---\r
\r
## 常見錯誤與排查\r
\r
### 1. 資料沒有載入\r
\r
**症狀**：遊戲中找不到該資料\r
\r
**檢查項目**：\r
- [ ] JSON 格式是否正確（可用 [JSONLint](https://jsonlint.com/) 驗證）\r
- [ ] ID 是否有定義\r
- [ ] 檔案是否在 \`GameDefines/\` 目錄下\r
- [ ] 資料類型名稱是否正確（區分大小寫）\r
\r
### 2. 繼承沒有生效\r
\r
**症狀**：子資料缺少父資料的欄位\r
\r
**檢查項目**：\r
- [ ] \`Parent\` 欄位的 ID 是否正確\r
- [ ] 父資料是否存在\r
- [ ] 是否有循環引用（A → B → A）\r
\r
### 3. 陣列繼承失敗\r
\r
**症狀**：子資料的陣列沒有包含父資料的元素\r
\r
**檢查項目**：\r
- [ ] 是否忘記加 \`"Inherit"\`\r
- [ ] \`"Inherit"\` 是否拼寫正確（區分大小寫）\r
- [ ] \`"Inherit"\` 是否在陣列內（而非陣列外）\r
\r
### 4. JSON 解析錯誤\r
\r
**常見原因**：\r
- 多餘的逗號（最後一個元素後面不能有逗號）\r
- 缺少引號\r
- 使用了單引號（必須用雙引號）\r
\r
\`\`\`json\r
// ❌ 錯誤：最後有多餘逗號\r
{\r
    "Items": [\r
        { "ID": "Wood" },\r
    ]\r
}\r
\r
// ✅ 正確\r
{\r
    "Items": [\r
        { "ID": "Wood" }\r
    ]\r
}\r
\`\`\`\r
\r
---\r
\r
## 在地化\r
\r
資料的 \`Name\` 和 \`Description\` 欄位支援在地化。在地化檔案位於：\r
\r
\`\`\`\r
Assets/StreamingAssets/Languages/{語言}/GameDefines/\r
\`\`\`\r
\r
### 在地化鍵格式\r
\r
\`\`\`\r
Defs.{資料類型}.{ID}.{欄位名}\r
\`\`\`\r
\r
### 範例\r
\r
資料定義：\r
\`\`\`json\r
{\r
    "Items": [\r
        {\r
            "ID": "Cabbage",\r
            "Name": "高麗菜",\r
            "Description": "一種綠色的蔬菜"\r
        }\r
    ]\r
}\r
\`\`\`\r
\r
在地化檔案（\`Languages/ChineseTraditional/GameDefines/Items.json\`）：\r
\`\`\`json\r
{\r
    "Defs.Items.Cabbage.Name": "高麗菜",\r
    "Defs.Items.Cabbage.Description": "一種綠色的蔬菜，含有豐富的維生素C和纖維。"\r
}\r
\`\`\`\r
\r
---\r
\r
## 下一步\r
\r
了解基礎概念後，可以查看各資料類型的詳細說明：\r
\r
- [物品資料 (Items)](#/docs/data-types/items)\r
- [角色資料 (Characters)](#/docs/data-types/characters)\r
- [配方資料 (Recipes)](#/docs/data-types/recipes)\r
- [場景物件 (SceneObjects)](#/docs/data-types/sceneobjects)\r
`;export{r as default};
