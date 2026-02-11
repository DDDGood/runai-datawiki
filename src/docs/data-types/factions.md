# Factions 陣營資料

陣營（Faction）定義遊戲中不同勢力之間的關係。每個角色都屬於一個陣營，陣營之間可以是敵對、中立或盟友關係。陣營系統影響 NPC 的行為、戰鬥判定、以及與玩家的互動方式。

## 概覽

- **JSON 檔案位置**：`Assets/StreamingAssets/GameDefines/Factions/`
- **C# 類別**：`FactionData` ([Faction.cs](Assets/Scripts/Engine/Faction/Faction.cs))
- **運行時類別**：`Faction` ([Faction.cs](Assets/Scripts/Core/Faction/Faction.cs))
- **管理器**：`FactionManager` ([FactionManager.cs](Assets/Scripts/Core/Faction/FactionManager.cs))
- **資料總數**：12 筆

## 快速範例

最簡單的陣營只需要定義 `ID` 和 `Name`：

```json
{
  "Factions": [
    {
      "ID": "Default",
      "Name": "預設",
      "Description": "預設中立陣營"
    }
  ]
}
```

## 欄位說明

### 基本欄位

| 欄位 | 類型 | 必填 | 說明 |
|------|------|------|------|
| ID | string | ✅ | 唯一識別碼，用於程式內部引用 |
| Parent | string | | 繼承的父資料 ID |
| Name | string | | 陣營顯示名稱（可在地化） |
| Description | string | | 陣營描述文字 |

### 關係設定欄位

| 欄位 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| ForcePlayerRelationship | string | | 強制與玩家的固定關係（見下方列舉） |
| StartingGoodwills | int | 0 | 初始好感度（-100 到 100） |
| Enemies | string[] | | 預設敵對的陣營 ID 列表 |
| Allies | string[] | | 預設盟友的陣營 ID 列表 |

### 成員設定欄位

| 欄位 | 類型 | 說明 |
|------|------|------|
| Races | IDAndWeight[] | 成員種族權重列表（生成角色時使用） |
| DefaultCharacterRole | string | 預設角色職業 ID |
| DefaultVisitorRole | string | 預設訪客職業 ID |
| DefaultTraderRole | string | 預設商人職業 ID |
| TraderKind | string | 商人類型（影響交易內容） |
| BackstoryTags | string[] | 背景故事標籤（生成角色背景時使用） |

---

## ForcePlayerRelationship 關係類型

`ForcePlayerRelationship` 欄位可以強制設定該陣營與玩家的固定關係，無法透過好感度改變。

| 值 | 說明 | 好感度 |
|----|------|--------|
| `"Enemy"` | 永久敵對，會主動攻擊玩家 | 鎖定 -100 |
| `"Neutral"` | 永久中立，不會主動攻擊 | 鎖定 0 |
| `"Ally"` | 永久盟友，會協助玩家 | 鎖定 100 |

> **注意**：若未設定此欄位，陣營關係會根據 `StartingGoodwills` 和玩家行為動態變化。

---

## 好感度系統

好感度（Goodwills）決定陣營與玩家的動態關係。

### 好感度範圍與關係轉換

| 好感度範圍 | 關係狀態 | 說明 |
|-----------|---------|------|
| -100 ~ -1 | Enemy | 敵對狀態，會主動攻擊 |
| 0 ~ 74 | Neutral | 中立狀態 |
| 75 ~ 100 | Ally | 盟友狀態，會協助玩家 |

### 關係轉換閾值

```
敵對 → 中立：好感度 > 0
中立 → 盟友：好感度 >= 75
盟友 → 中立：好感度 < 75
中立 → 敵對：好感度 <= -100
```

### 範例

```json
{
  "ID": "Tribe1",
  "Name": "大米部落",
  "StartingGoodwills": 50
}
```

這個部落初始為中立（好感度 50），玩家可以透過完成任務等方式提升好感度到 75 以上成為盟友。

---

## Races 種族權重

`Races` 欄位定義該陣營生成角色時可能出現的種族及其權重。

### IDAndWeight 結構

| 欄位 | 類型 | 說明 |
|------|------|------|
| ID | string | 種族 ID（引用 Races 資料） |
| Weight | float | 出現權重（相對機率） |

### 範例

```json
{
  "ID": "SpecialNPC",
  "Races": [
    { "ID": "Meowian", "Weight": 1 },
    { "ID": "Woofian", "Weight": 1 },
    { "ID": "Croakian", "Weight": 0.5 },
    { "ID": "Lizardian", "Weight": 1 },
    { "ID": "Bearian", "Weight": 0.2 }
  ]
}
```

在這個例子中：
- Meowian、Woofian、Lizardian 出現機率相同（權重 1）
- Croakian 出現機率為前者的一半（權重 0.5）
- Bearian 出現機率最低（權重 0.2）

---

## Enemies 與 Allies 陣列

這兩個欄位定義陣營之間的**預設關係**。

### 運作方式

當新陣營被加入遊戲時，FactionManager 會：
1. 檢查新陣營的 `Enemies` 列表，與列表中的陣營設為敵對
2. 檢查新陣營的 `Allies` 列表，與列表中的陣營設為盟友
3. 檢查其他陣營是否將新陣營列為敵人或盟友
4. 其餘陣營設為中立

### 範例

```json
{
  "ID": "Player",
  "Enemies": ["Monster", "Zombie", "Raider"]
}
```

玩家陣營預設與 Monster、Zombie、Raider 為敵對關係。

> **注意**：`Enemies` 和 `Allies` 是雙向的。如果 A 將 B 列為敵人，則 A 和 B 互為敵人。

---

## 系統內建陣營

以下陣營有程式碼特別處理，ID 不可更改：

| ID | 說明 | 用途 |
|----|------|------|
| `Player` | 玩家陣營 | 所有玩家控制的角色都屬於此陣營 |
| `Default` | 預設中立陣營 | 未指定陣營的角色會歸入此處 |
| `WildAnimal` | 野生動物陣營 | 野生動物專用 |
| `Monster` | 怪物陣營 | 敵對怪物專用 |

---

## 使用情境

### 情境 1：永久敵對的怪物陣營

怪物陣營永遠與玩家敵對，不會改變。

```json
{
  "ID": "Monster",
  "Name": "怪物",
  "Description": "怪物陣營",
  "ForcePlayerRelationship": "Enemy",
  "Races": [
    { "ID": "Monsters_QuadrupedalSmall", "Weight": 1 },
    { "ID": "Monsters_QuadrupedalLarge", "Weight": 1 }
  ],
  "DefaultCharacterRole": "Monster"
}
```

重點：
- `ForcePlayerRelationship: "Enemy"` 鎖定敵對關係
- `Races` 定義可能出現的怪物種族
- `DefaultCharacterRole` 指定角色職業

### 情境 2：可交互的友好 NPC 陣營

特殊 NPC 陣營永遠與玩家為盟友，可以交易和交流。

```json
{
  "ID": "SpecialNPC",
  "Name": "特殊NPC",
  "Description": "特殊NPC陣營",
  "ForcePlayerRelationship": "Ally",
  "Races": [
    { "ID": "Meowian", "Weight": 1 },
    { "ID": "Woofian", "Weight": 1 },
    { "ID": "Croakian", "Weight": 0.5 }
  ],
  "DefaultCharacterRole": "Tribal_Wanderer",
  "DefaultVisitorRole": "Visitor",
  "DefaultTraderRole": "Tribal_Trader",
  "TraderKind": "Tribal",
  "BackstoryTags": ["Generic"],
  "Enemies": ["Monster", "Zombie", "Raider"]
}
```

重點：
- `ForcePlayerRelationship: "Ally"` 鎖定盟友關係
- 定義了訪客和商人角色，可以造訪玩家聚落
- `TraderKind` 決定商人販賣的商品類型
- 與怪物、喪屍、掠奪者為敵

### 情境 3：動態關係的部落陣營

部落陣營可以透過玩家行為改變關係。

```json
{
  "ID": "Tribe1",
  "Name": "大米部落",
  "Description": "原始的部落",
  "Races": [
    { "ID": "Meowian", "Weight": 1 },
    { "ID": "Woofian", "Weight": 1 },
    { "ID": "Lizardian", "Weight": 1 }
  ],
  "DefaultCharacterRole": "Tribal_Wanderer",
  "DefaultVisitorRole": "Visitor",
  "DefaultTraderRole": "Tribal_Trader",
  "TraderKind": "Tribal",
  "BackstoryTags": ["Generic", "Tribal"],
  "Enemies": ["Monster", "Zombie", "Raider"]
}
```

重點：
- 沒有設定 `ForcePlayerRelationship`，關係會動態變化
- 沒有設定 `StartingGoodwills`，預設為 0（中立）
- `BackstoryTags: ["Generic", "Tribal"]` 生成角色時會使用部落風格的背景故事

### 情境 4：敵對但非鎖定的掠奪者陣營

掠奪者預設敵對，但理論上可以透過好感度改變（雖然 ForcePlayerRelationship 鎖定了）。

```json
{
  "ID": "Raider",
  "Name": "掠奪者",
  "Description": "掠奪者陣營",
  "ForcePlayerRelationship": "Enemy",
  "Races": [
    { "ID": "Meowian", "Weight": 1 },
    { "ID": "Woofian", "Weight": 1 },
    { "ID": "Lizardian", "Weight": 3 }
  ],
  "DefaultCharacterRole": "Tribal_Wanderer",
  "TraderKind": "Tribal",
  "BackstoryTags": ["Generic"]
}
```

重點：
- Lizardian 的權重為 3，出現機率較高
- 雖然是敵對陣營，但仍有商人和訪客設定（可能用於特殊事件）

---

## Parent 繼承

目前 Faction 資料較少使用繼承，但如果需要建立多個相似陣營，可以使用 Parent 繼承。

### 範例

```json
{
  "Factions": [
    {
      "ID": "TribeBase",
      "DefaultCharacterRole": "Tribal_Wanderer",
      "DefaultVisitorRole": "Visitor",
      "DefaultTraderRole": "Tribal_Trader",
      "TraderKind": "Tribal",
      "BackstoryTags": ["Generic", "Tribal"],
      "Enemies": ["Monster", "Zombie", "Raider"]
    },
    {
      "Parent": "TribeBase",
      "ID": "Tribe2",
      "Name": "小麥部落",
      "Description": "農耕為主的部落"
    },
    {
      "Parent": "TribeBase",
      "ID": "Tribe3",
      "Name": "狩獵部落",
      "Description": "狩獵為主的部落",
      "Races": [
        { "ID": "Wolf", "Weight": 2 },
        { "ID": "Tiger", "Weight": 1 }
      ]
    }
  ]
}
```

Tribe2 和 Tribe3 會繼承 TribeBase 的所有設定，只需定義差異部分。

---

## Inherit 陣列繼承

當陣列欄位（如 `Races`、`Enemies`、`BackstoryTags`）中包含 `"Inherit"` 字串時，會將父資料的陣列元素合併進來。

### 範例

**父資料：**
```json
{
  "ID": "TribeBase",
  "Enemies": ["Monster", "Zombie"]
}
```

**子資料（繼承並擴充）：**
```json
{
  "Parent": "TribeBase",
  "ID": "HostileTribe",
  "Enemies": ["Player", "Inherit"]
}
```

**結果：**
```
Enemies = ["Player", "Monster", "Zombie"]
```

---

## 常見問題

### Q: ForcePlayerRelationship 和 Enemies/Allies 有什麼差別？
A:
- `ForcePlayerRelationship` 專門設定與**玩家**的關係，且是鎖定的
- `Enemies`/`Allies` 設定與**其他陣營**的預設關係

### Q: 沒有設定 ForcePlayerRelationship 時，初始關係如何決定？
A: 根據 `StartingGoodwills` 決定：
- 預設為 0，即中立
- 若設為 75 以上，初始為盟友
- 若設為 -100 以下，初始為敵對

### Q: 角色的陣營可以在遊戲中改變嗎？
A: 可以，程式碼可以動態改變角色的陣營。但陣營資料本身（FactionData）是靜態的。

### Q: TraderKind 有哪些可用值？
A: 常見值包括：
- `"Tribal"` - 部落商人
- 其他值需查閱 TraderKind 相關資料

### Q: 如何讓兩個陣營互為盟友？
A: 只需要其中一方在 `Allies` 中列出對方即可，關係是雙向的。

```json
{
  "ID": "Tribe1",
  "Allies": ["Tribe2"]
}
```

這樣 Tribe1 和 Tribe2 就互為盟友。

---

## 相關資料

- [Characters 角色資料](/docs/data-types/characters) - 角色屬於陣營
- [Races 種族資料](/docs/data-types/races) - Races 欄位引用的種族定義
- [資料類型總覽](/docs/data-types/) - 其他資料類型

---

## 檔案組織結構

```
Assets/StreamingAssets/GameDefines/
├── Factions/
│   └── Factions.json        # 所有陣營定義（12 筆）
└── World/
    └── Sites/
        └── Sites_FactionBase.json  # 陣營相關的世界地點
```

---

## 完整陣營列表

| ID | 名稱 | 與玩家關係 | 說明 |
|----|------|-----------|------|
| Default | 預設 | 中立 | 預設中立陣營 |
| Player | 玩家 | - | 玩家陣營（系統用） |
| Monster | 怪物 | 敵對（鎖定） | 野生怪物 |
| Mech | 機械陣營 | 敵對（鎖定） | 機械敵人 |
| Zombie | 喪屍 | 敵對（鎖定） | 喪屍敵人 |
| WildAnimal | 野生動物 | 中立（鎖定） | 野生動物 |
| SpecialNPC | 特殊NPC | 盟友（鎖定） | 友好 NPC |
| Wanderer | 遊蕩者 | 中立 | 流浪者 |
| Tribe1 | 大米部落 | 中立 | 可交互部落 |
| Settlement1 | 河谷鎮 | 中立 | 倖存者據點 |
| Raider | 掠奪者 | 敵對（鎖定） | 敵對人類 |
