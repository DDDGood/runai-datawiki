# 資料定義基礎

本文件說明 Game2022 遊戲資料定義系統的基礎概念。在閱讀各資料類型的詳細說明前，請先了解這些通用規則。

## 目錄結構

所有遊戲資料都存放在 `Assets/StreamingAssets/GameDefines/` 目錄下：

```
GameDefines/
├── Abilities/              # 技能與能力
│   ├── AbilityBuffs/       # 增益效果
│   └── AbilityStats/       # 技能數值
├── AI/                     # AI 行為定義
│   ├── Actions/            # AI 動作
│   ├── AIs/                # 通用 AI
│   ├── CombatAI/           # 戰鬥 AI
│   ├── FollowerAI/         # 跟隨者 AI
│   └── WildAI/             # 野生動物 AI
├── Animations/             # 動畫定義
├── Character/              # 角色相關
│   ├── Animals/            # 動物角色
│   ├── Backstories/        # 背景故事
│   ├── Dialogues/          # 對話
│   ├── Mechs/              # 機甲
│   ├── Needs/              # 角色需求
│   ├── Skills/             # 技能
│   ├── Thoughts/           # 想法
│   └── Traits/             # 特質
├── CookingRecipes/         # 烹飪食譜
├── Factions/               # 陣營
├── GameProgression/        # 遊戲進程
│   ├── SettlementLevel/    # 聚落等級
│   ├── Starter/            # 開局設定
│   └── Storyteller/        # 事件系統
├── Items/                  # 物品
│   ├── Equipments/         # 裝備
│   ├── Food/               # 食物
│   ├── Furnitures/         # 家具（物品型態）
│   ├── Resources/          # 資源
│   └── ToolsAndWeapons/    # 工具與武器
├── JobType/                # 工作類型
├── Loots/                  # 掉落表
├── Projectiles/            # 投射物
├── Quests/                 # 任務
├── Races/                  # 種族
├── Raids/                  # 襲擊事件
├── Recipes/                # 製作配方
├── Research/               # 研究項目
├── SceneGenerators/        # 場景生成器
├── SceneObjectGroups/      # 場景物件群組
├── SceneObjects/           # 場景物件
│   ├── Buildings/          # 建築
│   ├── Decorations/        # 裝飾
│   ├── Furnitures/         # 家具
│   ├── Plants/             # 植物
│   ├── Resources/          # 資源物件
│   ├── Trees/              # 樹木
│   └── ...
├── Scenes/                 # 場景定義
├── Stats/                  # 屬性定義
├── StatusEffects/          # 狀態效果
├── Tiles/                  # 地形瓦片
├── VFX/                    # 視覺特效
└── World/                  # 世界相關
    ├── Biomes/             # 生態群落
    ├── Bosses/             # 世界首領
    └── Sites/              # 地點
```

## JSON 基礎格式

### 檔案結構

每個 JSON 檔案包含一個或多個資料類型的陣列：

```json
{
    "資料類型名稱": [
        { /* 資料項目 1 */ },
        { /* 資料項目 2 */ },
        { /* 資料項目 3 */ }
    ]
}
```

### 範例

```json
{
    "Items": [
        {
            "ID": "Wood",
            "Name": "木材",
            "StackLimit": 50
        },
        {
            "ID": "Stone",
            "Name": "石頭",
            "StackLimit": 50
        }
    ]
}
```

### 一個檔案可以包含多種資料類型

```json
{
    "Items": [
        { "ID": "MyItem", "Name": "我的物品" }
    ],
    "Recipes": [
        { "ID": "Make_MyItem", "Product": { "Item": "MyItem" } }
    ]
}
```

## 必要欄位：ID

**每一筆資料都必須有 `ID` 欄位**，這是唯一識別碼。

### ID 規則

1. **唯一性**：同一資料類型中，ID 不可重複
2. **命名慣例**：
   - 使用 PascalCase 或底線分隔：`WoodFloor`、`Make_WoodFloor`
   - 配方通常用 `Make_` 前綴：`Make_Bread`、`Make_IronSword`
   - 基底資料通常用 `Base` 後綴：`ItemBase`、`TreeBase`
3. **引用方式**：其他資料透過 ID 引用，如配方的產出物品

```json
{
    "ID": "Cabbage",           // ✅ 正確
    "Name": "高麗菜"
}
```

```json
{
    "Name": "高麗菜"            // ❌ 錯誤：缺少 ID
}
```

---

## Parent 繼承機制

`Parent` 欄位讓資料可以繼承另一筆資料的所有欄位，大幅減少重複填寫。

### 基本原理

1. 子資料指定 `"Parent": "父資料ID"`
2. 系統載入時，子資料會自動獲得父資料的所有欄位
3. 子資料可以**覆蓋**父資料的欄位（只需重新定義該欄位）
4. 父資料可以是純模板（不實際使用於遊戲），也可以是實際資料

### 簡單範例

```json
{
    "Items": [
        {
            "ID": "CropBase",
            "StackLimit": 20,
            "Price": 50
        },
        {
            "Parent": "CropBase",
            "ID": "Cabbage",
            "Name": "高麗菜"
        },
        {
            "Parent": "CropBase",
            "ID": "Carrot",
            "Name": "紅蘿蔔"
        }
    ]
}
```

**結果：**
- `Cabbage` 擁有 `StackLimit: 20`、`Price: 50`、`Name: "高麗菜"`
- `Carrot` 擁有 `StackLimit: 20`、`Price: 50`、`Name: "紅蘿蔔"`

### 覆蓋父資料欄位

子資料定義的欄位會覆蓋父資料的同名欄位：

```json
{
    "Recipes": [
        {
            "ID": "RecipeBase",
            "Work": 100,
            "RelevantSkill": "Crafting",
            "FinishExp": 40
        },
        {
            "Parent": "RecipeBase",
            "ID": "RecipeFloorBase",
            "Work": 200
        }
    ]
}
```

**結果：**
- `RecipeFloorBase` 的 `Work` 是 `200`（覆蓋了父資料的 100）
- `RecipeFloorBase` 的 `RelevantSkill` 是 `"Crafting"`（繼承自父資料）
- `RecipeFloorBase` 的 `FinishExp` 是 `40`（繼承自父資料）

### 多層繼承

繼承可以是多層的（A → B → C）：

```json
{
    "SceneObjects": [
        {
            "ID": "SceneObjectBase",
            "Passable": true
        },
        {
            "Parent": "SceneObjectBase",
            "ID": "TreeBase",
            "SceneObjectType": "Tree",
            "Tags": ["Tree"]
        },
        {
            "Parent": "TreeBase",
            "ID": "GatherableTreeBase",
            "JComponents": {
                "Gatherable": { "GatherWork": 60 }
            }
        },
        {
            "Parent": "GatherableTreeBase",
            "ID": "BirchTree",
            "Name": "樺木"
        }
    ]
}
```

**BirchTree 最終擁有：**
- `Passable: true`（來自 SceneObjectBase）
- `SceneObjectType: "Tree"`（來自 TreeBase）
- `Tags: ["Tree"]`（來自 TreeBase）
- `JComponents.Gatherable`（來自 GatherableTreeBase）
- `Name: "樺木"`（自己定義）

### 繼承設計最佳實踐

1. **建立清晰的繼承層級**：
   ```
   SceneObjectBase
   └── TreeBase
       └── GatherableTreeBase
           ├── BirchTree
           ├── PineTree
           └── OakTree
   ```

2. **基底資料放在獨立檔案**：如 `TreeBase.json` 定義所有樹的基底

3. **善用分類基底**：
   - `CropBase` → 所有農作物
   - `WeaponBase` → 所有武器
   - `RecipeCookingBase` → 所有烹飪配方

---

## Inherit 陣列繼承

當子資料的**陣列欄位**需要**擴充**（而非完全覆蓋）父資料的陣列時，使用 `"Inherit"` 標記。

### 問題情境

預設情況下，子資料的陣列會**完全覆蓋**父資料的陣列：

```json
{
    "Characters": [
        {
            "ID": "CharacterBase",
            "Abilities": ["Attack", "Dodge"]
        },
        {
            "Parent": "CharacterBase",
            "ID": "Warrior",
            "Abilities": ["PowerStrike"]
        }
    ]
}
```

**結果：** `Warrior` 的 `Abilities` 只有 `["PowerStrike"]`，失去了 `Attack` 和 `Dodge`！

### 解決方案：使用 Inherit

在陣列中加入 `"Inherit"` 字串，系統會：
1. 移除 `"Inherit"` 標記
2. 將父資料的陣列元素附加到子資料陣列**末尾**

```json
{
    "Characters": [
        {
            "ID": "CharacterBase",
            "Abilities": ["Attack", "Dodge"]
        },
        {
            "Parent": "CharacterBase",
            "ID": "Warrior",
            "Abilities": ["PowerStrike", "Inherit"]
        }
    ]
}
```

**結果：** `Warrior` 的 `Abilities` 是 `["PowerStrike", "Attack", "Dodge"]`

### 順序說明

- 子資料原有的元素在**前面**
- 父資料的元素附加在**後面**

```json
// 子資料定義
"Tags": ["Special", "Rare", "Inherit"]

// 父資料定義
"Tags": ["Common", "Basic"]

// 最終結果
"Tags": ["Special", "Rare", "Common", "Basic"]
```

### 實際範例：場景物件的 Components

```json
{
    "SceneObjects": [
        {
            "ID": "TreeBase",
            "Components": [
                { "CompType": "Collider", "Collider": { "Type": "Circle" } },
                { "CompType": "LightCollider" },
                { "CompType": "DayLightCollider" }
            ]
        },
        {
            "Parent": "TreeBase",
            "ID": "BirchTree",
            "Components": [
                "Inherit",
                { "CompType": "Plant", "Plant": { "LifeStages": [...] } }
            ]
        }
    ]
}
```

**結果：** `BirchTree` 的 `Components` 包含：
1. `Collider`（繼承自 TreeBase）
2. `LightCollider`（繼承自 TreeBase）
3. `DayLightCollider`（繼承自 TreeBase）
4. `Plant`（自己新增）

> **注意**：`"Inherit"` 放在陣列的任何位置都可以，系統會將其移除後再附加父資料。

### Inherit 使用時機

| 情境 | 使用方式 |
|------|----------|
| 完全覆蓋父陣列 | 直接定義陣列，不加 Inherit |
| 繼承父陣列 + 新增元素 | 加入 `"Inherit"` |
| 只繼承，不新增 | 不定義該欄位（自動繼承） |

---

## 資料類型對照表

| 資料類型 | JSON 鍵名 | 說明 |
|----------|-----------|------|
| 角色 | `Characters` | NPC、敵人、動物 |
| 物品 | `Items` | 可攜帶的物品 |
| 配方 | `Recipes` | 製作配方 |
| 烹飪食譜 | `CookingRecipes` | 烹飪專用配方 |
| 場景物件 | `SceneObjects` | 地圖上的物件（建築、樹木等） |
| 地形瓦片 | `Tiles` | 地板瓦片 |
| 技能 | `Abilities` | 戰鬥技能 |
| 增益效果 | `AbilityBuffs` | 技能產生的 Buff |
| 種族 | `Races` | 種族定義 |
| 特質 | `Traits` | 角色特質 |
| 技能 | `Skills` | 角色技能（非戰鬥） |
| 需求 | `Needs` | 角色需求（飢餓等） |
| 背景故事 | `Backstories` | 角色背景 |
| 任務 | `Quests` | 任務定義 |
| 對話 | `Dialogues` | 對話內容 |
| 生態群落 | `Biomes` | 世界地形 |
| 地點 | `Sites` | 世界地圖地點 |
| AI | `SettlerAIs`, `CombatAIs`, `WildAIs` | AI 行為 |
| 掉落表 | `Loots` | 掉落物品定義 |
| 研究 | `ResearchProjects` | 研究項目 |
| 動畫 | `Animations` | Sprite 動畫 |
| 特效 | `VFXes` | 視覺特效 |

---

## 常見錯誤與排查

### 1. 資料沒有載入

**症狀**：遊戲中找不到該資料

**檢查項目**：
- [ ] JSON 格式是否正確（可用 [JSONLint](https://jsonlint.com/) 驗證）
- [ ] ID 是否有定義
- [ ] 檔案是否在 `GameDefines/` 目錄下
- [ ] 資料類型名稱是否正確（區分大小寫）

### 2. 繼承沒有生效

**症狀**：子資料缺少父資料的欄位

**檢查項目**：
- [ ] `Parent` 欄位的 ID 是否正確
- [ ] 父資料是否存在
- [ ] 是否有循環引用（A → B → A）

### 3. 陣列繼承失敗

**症狀**：子資料的陣列沒有包含父資料的元素

**檢查項目**：
- [ ] 是否忘記加 `"Inherit"`
- [ ] `"Inherit"` 是否拼寫正確（區分大小寫）
- [ ] `"Inherit"` 是否在陣列內（而非陣列外）

### 4. JSON 解析錯誤

**常見原因**：
- 多餘的逗號（最後一個元素後面不能有逗號）
- 缺少引號
- 使用了單引號（必須用雙引號）

```json
// ❌ 錯誤：最後有多餘逗號
{
    "Items": [
        { "ID": "Wood" },
    ]
}

// ✅ 正確
{
    "Items": [
        { "ID": "Wood" }
    ]
}
```

---

## 在地化

資料的 `Name` 和 `Description` 欄位支援在地化。在地化檔案位於：

```
Assets/StreamingAssets/Languages/{語言}/GameDefines/
```

### 在地化鍵格式

```
Defs.{資料類型}.{ID}.{欄位名}
```

### 範例

資料定義：
```json
{
    "Items": [
        {
            "ID": "Cabbage",
            "Name": "高麗菜",
            "Description": "一種綠色的蔬菜"
        }
    ]
}
```

在地化檔案（`Languages/ChineseTraditional/GameDefines/Items.json`）：
```json
{
    "Defs.Items.Cabbage.Name": "高麗菜",
    "Defs.Items.Cabbage.Description": "一種綠色的蔬菜，含有豐富的維生素C和纖維。"
}
```

---

## 下一步

了解基礎概念後，可以查看各資料類型的詳細說明：

- [物品資料 (Items)](#/docs/data-types/items)
- [角色資料 (Characters)](#/docs/data-types/characters)
- [配方資料 (Recipes)](#/docs/data-types/recipes)
- [場景物件 (SceneObjects)](#/docs/data-types/sceneobjects)
