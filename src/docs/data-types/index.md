# 資料類型總覽

Game2022 使用 JSON 格式定義所有遊戲內容。每種資料類型都有特定的結構和欄位。

> **新手提示**：如果你還不了解 JSON 基礎格式、Parent 繼承、Inherit 陣列繼承等概念，建議先閱讀 [資料定義基礎](#/docs/data-fundamentals)。

## 資料類型總覽

### 角色相關
- **Characters** - 角色定義（NPC、敵人、動物）
- **Races** - 種族定義
- **Traits** - 角色特性
- **Skills** - 角色技能
- **Needs** - 角色需求（飢餓、休息等）
- **Backstories** - 背景故事

### 物品相關
- **Items** - 物品定義
- **Recipes** - 製作配方
- **CookingRecipes** - 烹飪食譜
- **Loots** - 掉落表

### 場景相關
- **SceneObjects** - 場景物件（建築、家具、植物）
- **Tiles** - 地形瓦片
- **Biomes** - 生態群落
- **Sites** - 世界地點

### 戰鬥相關
- **Abilities** - 技能/能力
- **AbilityBuffs** - 增益效果
- **Projectiles** - 投射物
- **StatusEffects** - 狀態效果

### AI 相關
- **SettlerAIs** - 居民 AI
- **CombatAIs** - 戰鬥 AI
- **WildAIs** - 野生動物 AI

### 任務相關
- **Quests** - 任務定義
- **Dialogues** - 對話定義
- **DialoguePacks** - 對話包

## 通用概念

### Parent 繼承

資料可以透過 `Parent` 欄位繼承其他資料的欄位：

```json
{
  "ID": "CropBase",
  "StackLimit": 20,
  "Price": 50
},
{
  "Parent": "CropBase",
  "ID": "Cabbage",
  "Name": "高麗菜"
}
```

上例中，`Cabbage` 會繼承 `CropBase` 的 `StackLimit` 和 `Price`。

### 在地化

資料的 `Name` 和 `Description` 可以透過在地化系統翻譯。在地化檔案位於：

```
Languages/ChineseTraditional/GameDefines/Items.json
```

格式為：

```json
{
  "Defs.Items.Cabbage.Name": "高麗菜",
  "Defs.Items.Cabbage.Description": "一種綠色的蔬菜"
}
```
