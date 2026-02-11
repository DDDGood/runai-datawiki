# Items 物品資料

物品是遊戲中玩家可以收集、使用、裝備或放置的所有對象。從工具、武器、食物到家具，都屬於物品系統的範疇。

## 概覽

- **JSON 檔案位置**：`Assets/StreamingAssets/GameDefines/Items/`
- **C# 類別**：`ItemData` ([Item.cs](Assets/Scripts/Core/Item/Data/Items/Item.cs))
- **資料總數**：約 300+ 筆

## 快速範例

最簡單的物品只需要定義 `ID`：

```json
{
  "Items": [
    {
      "ID": "Stone",
      "Name": "石頭",
      "Description": "一塊普通的石頭。",
      "StackLimit": 99,
      "Price": 5,
      "Graphic": {
        "GraphicType": "Single",
        "SpritePath": "Images/Items/Stone"
      }
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
| Name | string | | 物品顯示名稱（可在地化） |
| Description | string | | 物品描述文字（可在地化） |
| Tags | string[] | | 物品標籤陣列，用於分類和篩選 |
| Graphic | GraphicData | | 物品圖示資訊 |

### 數值欄位

| 欄位 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| StackLimit | int | 1 | 最大堆疊數量。`1` = 不可堆疊 |
| Durability | int | 0 | 耐久度。`0` = 無耐久度限制 |
| Price | int | 0 | 基礎價格（購買/出售計算用） |
| IsUnique | bool | false | 是否為獨特物品（全遊戲只能有一個） |

### 進階欄位

| 欄位 | 類型 | 說明 |
|------|------|------|
| Components | ItemComponentData[] | 物品元件陣列，定義物品功能 |
| HoldData | ItemHoldData | 角色持握物品的方式 |
| PickUpActions | GameEventAction[] | 拾起物品時觸發的事件 |

---

## GraphicData 圖示資訊

定義物品的視覺呈現。

| 欄位 | 類型 | 說明 |
|------|------|------|
| GraphicType | string | 圖片類型，通常為 `"Single"` |
| SpritePath | string | Resources 相對路徑 |

### 常見路徑格式

```
Images/Items/{ItemName}              # 一般物品
Images/Items/Tools/{ToolName}        # 工具
Images/Items/Weapons/{WeaponName}    # 武器
Images/Items/Outfits/{OutfitName}    # 服裝
Images/Items/Fishes/{FishName}       # 魚類
Images/Items/Furnitures/{Name}       # 家具
```

### 範例

```json
"Graphic": {
  "GraphicType": "Single",
  "SpritePath": "Images/Items/Sword"
}
```

---

## HoldData 持握資訊

定義角色如何持握這個物品。

| 欄位 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| HoldType | string | | 持握類型 |
| HoldOffset | Vector2 | (0, 0) | 手部位移偏移量 |
| FaceToPointer | bool | false | 是否面向滑鼠指標 |

### HoldType 可用值

- `"Tool"` - 工具握法（斧頭、鋤頭等）
- `"None"` - 無法持握

### 範例

```json
"HoldData": {
  "HoldType": "Tool",
  "HoldOffset": {"x": 0.0, "y": -0.1},
  "FaceToPointer": true
}
```

---

## Components 元件系統

物品的核心功能由**元件**定義。一個物品可以擁有多個元件，實現複合功能。

### 元件類型總覽

| CompType | 用途 | 說明 |
|----------|------|------|
| Tool | 工具 | 可用於特定工作（砍樹、挖礦等） |
| Weapon | 武器 | 可用於戰鬥攻擊 |
| Food | 食物 | 可食用，恢復飢餓值 |
| Consumable | 消耗品 | 使用後消耗，觸發效果 |
| Equipment | 裝備 | 可穿戴在身上 |
| Furniture | 家具 | 可放置為場景物件 |
| Seed | 種子 | 可種植 |
| FoodIngredient | 食材 | 用於烹飪的原料 |
| FishingRod | 釣竿 | 用於釣魚 |
| Floor | 地板 | 可鋪設的地板瓦片 |
| Antiquity | 古物 | 可分解或提供特殊效果 |

### 元件結構

```json
"Components": [
  {
    "CompType": "元件類型",
    "元件類型名稱": {
      // 該元件的專屬欄位
    }
  }
]
```

---

## Tool 工具元件

讓物品可以執行特定工作。

| 欄位 | 類型 | 說明 |
|------|------|------|
| ToolType | string | 工具類型（見下方列表） |
| Animation | string | 使用時的動畫名稱 |
| StaminaCost | float | 每次使用消耗的耐力 |
| Efficiency | float | 工具效率（可選） |

### ToolType 可用值

| 值 | 說明 |
|----|------|
| `"Axe"` | 斧頭 - 砍伐樹木 |
| `"Pickaxe"` | 鎬 - 挖掘礦石 |
| `"Hoe"` | 鋤頭 - 翻土耕地 |
| `"WateringCan"` | 澆水壺 - 灌溉作物 |
| `"Shovel"` | 鏟子 - 改變地形 |
| `"Bucket"` | 水桶 - 取水 |
| `"Hand"` | 徒手 - 基本操作 |

### 範例：鏟子

```json
{
  "ID": "Shovel",
  "Name": "鏟子",
  "Description": "可以改變地形高度的工具。",
  "Components": [
    {
      "CompType": "Tool",
      "Tool": {
        "ToolType": "Shovel",
        "Animation": "Smash",
        "StaminaCost": 3
      }
    }
  ]
}
```

---

## Weapon 武器元件

讓物品可以進行攻擊。

| 欄位 | 類型 | 說明 |
|------|------|------|
| Tags | string[] | 武器標籤（用於裝備限制） |
| Attack | int | 攻擊力數值 |
| Animation | string | 攻擊動畫名稱 |
| AttackCooldown | float | 攻擊冷卻時間（秒） |
| StaminaCost | float | 攻擊消耗的耐力 |
| Projectile | string | 投射物 ID（遠程武器用） |
| AttackVFX | string | 攻擊視覺特效 ID |
| Abilities | string[] | 可使用的技能 ID 列表 |

### 範例：近戰武器

```json
{
  "ID": "IronSword",
  "Name": "鐵劍",
  "Components": [
    {
      "CompType": "Weapon",
      "Weapon": {
        "Attack": 10,
        "Animation": "Slash",
        "Abilities": ["Slash"]
      }
    }
  ]
}
```

### 範例：遠程武器

```json
{
  "ID": "Matchlock",
  "Name": "火繩槍",
  "Components": [
    {
      "CompType": "Weapon",
      "Weapon": {
        "Tags": ["Basic"],
        "Attack": 15,
        "Animation": "Recoil",
        "AttackVFX": "MatchlockSmock",
        "Projectile": "LeadBullet",
        "Abilities": ["Shoot"]
      }
    }
  ]
}
```

---

## Food 食物元件

讓物品可以被食用。

| 欄位 | 類型 | 說明 |
|------|------|------|
| Level | int | 食物等級（0-3） |
| Value | int | 食物價值 |
| BaseStats | FoodStats | 食物效果數據 |

### FoodStats 子欄位

| 欄位 | 類型 | 說明 |
|------|------|------|
| HealthGen | float | 生命恢復量 |
| StaminaGen | float | 耐力恢復量 |
| Satiety | int | 飽食度增加量 |
| Taste | int | 味道評分 |

### 範例

```json
{
  "ID": "Sandwich",
  "Name": "三明治",
  "Components": [
    {
      "CompType": "Food",
      "Food": {
        "Level": 1,
        "Value": 80,
        "BaseStats": {
          "HealthGen": 1,
          "StaminaGen": 1,
          "Satiety": 120,
          "Taste": 20
        }
      }
    }
  ]
}
```

---

## Consumable 消耗品元件

讓物品使用後消耗並觸發效果。

| 欄位 | 類型 | 說明 |
|------|------|------|
| AnimationType | string | 使用動畫類型（`"Eat"` 或 `"None"`） |
| Actions | GameEventAction[] | 使用時觸發的 GameEvent 動作 |

### 範例：治療藥水

```json
{
  "ID": "HealingPotion",
  "Name": "治療藥水",
  "Components": [
    {
      "CompType": "Consumable",
      "Consumable": {
        "AnimationType": "Eat",
        "Actions": [
          {
            "Action": "ApplyStatusEffect",
            "ActionData": {"ID": "HealingBuff"}
          }
        ]
      }
    }
  ]
}
```

---

## Equipment 裝備元件

讓物品可以穿戴在角色身上。

| 欄位 | 類型 | 說明 |
|------|------|------|
| EquipmentType | string | 裝備部位 |
| Tags | string[] | 裝備標籤（風格限制） |
| SpritePath | string | 角色穿戴時的圖片路徑 |
| Defense | int | 防禦值 |
| StatsModifier | StatsData | 屬性修正（可選） |

### EquipmentType 可用值

| 值 | 說明 |
|----|------|
| `"UpperBody"` | 上身（衣服、外套） |
| `"LowerBody"` | 下身（褲子、裙子） |
| `"Hat"` | 頭部（帽子、頭盔） |

### 常見 Tags

- `"Basic"` - 基礎裝備（日常穿著）
- `"BasicCombat"` - 戰鬥裝備
- `"Modern"` - 現代風格
- `"Tribal"` - 部落風格
- `"Robot"` - 機械風格

### 範例

```json
{
  "ID": "WorkerSuit",
  "Name": "工人服裝",
  "StackLimit": 1,
  "Components": [
    {
      "CompType": "Equipment",
      "Equipment": {
        "EquipmentType": "UpperBody",
        "Tags": ["Basic"],
        "SpritePath": "Images/Character/UpperBody/WorkerSuit"
      }
    }
  ]
}
```

---

## Furniture 家具元件

讓物品可以放置為場景物件。

| 欄位 | 類型 | 說明 |
|------|------|------|
| SceneObject | string | 對應的 SceneObject ID |

### 範例

```json
{
  "ID": "Chest",
  "Name": "箱子",
  "Components": [
    {
      "CompType": "Furniture",
      "Furniture": {
        "SceneObject": "Chest"
      }
    }
  ]
}
```

---

## Seed 種子元件

讓物品可以種植。

| 欄位 | 類型 | 說明 |
|------|------|------|
| Plant | string | 種植後產生的植物 ID |

### 範例

```json
{
  "ID": "CabbageSeed",
  "Name": "高麗菜種子",
  "Components": [
    {
      "CompType": "Seed",
      "Seed": {
        "Plant": "Cabbage"
      }
    }
  ]
}
```

---

## FoodIngredient 食材元件

定義物品作為烹飪食材的屬性。

| 欄位 | 類型 | 說明 |
|------|------|------|
| Type | string | 食材類型 |
| Value | float | 食材貢獻值 |
| FoodStats | FoodStats | 食材提供的效果數據 |

### Type 常見值

- `"Fish"` - 魚類
- `"Meat"` - 肉類
- `"Vegetable"` - 蔬菜

### 範例

```json
{
  "ID": "Salmon",
  "Name": "鮭魚",
  "Components": [
    {
      "CompType": "FoodIngredient",
      "FoodIngredient": {
        "Type": "Fish",
        "Value": 1,
        "FoodStats": {
          "HealthGen": 0.2,
          "StaminaGen": 0.8,
          "Satiety": 120,
          "Taste": 10
        }
      }
    }
  ]
}
```

---

## FishingRod 釣竿元件

| 欄位 | 類型 | 說明 |
|------|------|------|
| ChargePerSecond | float | 每秒蓄力速度 |
| MaxCharge | float | 最大蓄力值 |

---

## Floor 地板元件

| 欄位 | 類型 | 說明 |
|------|------|------|
| FloorTile | string | 對應的地板瓦片 ID |

---

## Antiquity 古物元件

| 欄位 | 類型 | 說明 |
|------|------|------|
| DisassembleItems | ItemStackData[] | 分解獲得的物品 |
| AbilityBuff | string | 提供的增益效果 ID |
| StatusEffect | string | 提供的狀態效果 ID |

---

## Parent 繼承

使用 `Parent` 欄位可以繼承其他物品的所有屬性，避免重複定義。

### 常見的基底資料

| 基底 ID | 用途 | 提供的預設值 |
|---------|------|-------------|
| FoodBase | 食物基類 | `StackLimit: 20`, `Price: 60`, `Tags: ["Food"]` |
| FurnitureBase | 家具基類 | `StackLimit: 10`, `Price: 30`, `Tags: ["Furniture"]` |
| ToolBase | 工具基類 | `StackLimit: 1`, `Price: 20`, `Tags: ["Tool"]`, HoldData |
| ToolBase_Stone | 石製工具 | 繼承 ToolBase，`Price: 20` |
| ToolBase_Iron | 鐵製工具 | 繼承 ToolBase，`Price: 40` |
| ToolBase_Diamond | 鑽石工具 | 繼承 ToolBase，`Price: 80` |
| OutfitBase | 裝備基類 | `Price: 80` |
| FishBase | 魚類基類 | `StackLimit: 20`, `Price: 50`, FoodIngredient 元件 |

### 繼承範例

**定義基底：**
```json
{
  "ID": "FoodBase",
  "StackLimit": 20,
  "Price": 60,
  "Tags": ["Food"]
}
```

**繼承使用：**
```json
{
  "Parent": "FoodBase",
  "ID": "Apple",
  "Name": "蘋果",
  "Graphic": {
    "GraphicType": "Single",
    "SpritePath": "Images/Items/Apple"
  },
  "Components": [
    {
      "CompType": "Food",
      "Food": {
        "Level": 0,
        "Value": 30,
        "BaseStats": {
          "Satiety": 50
        }
      }
    }
  ]
}
```

`Apple` 會自動獲得：
- `StackLimit: 20`（繼承自 FoodBase）
- `Price: 60`（繼承自 FoodBase）
- `Tags: ["Food"]`（繼承自 FoodBase）

### 多層繼承

```
ToolBase
  └─ ToolBase_Iron
       └─ IronAxe
```

`IronAxe` 會繼承 `ToolBase_Iron` 的所有屬性，而 `ToolBase_Iron` 又繼承自 `ToolBase`。

---

## Inherit 陣列繼承

當陣列欄位（如 `Tags`、`Components`）中包含 `"Inherit"` 字串時，會將父資料的陣列元素合併進來。

### 範例

**父資料：**
```json
{
  "ID": "ParentItem",
  "Tags": ["Tag1", "Tag2"]
}
```

**子資料（繼承並擴充）：**
```json
{
  "Parent": "ParentItem",
  "ID": "ChildItem",
  "Tags": ["Tag3", "Inherit"]
}
```

**結果：**
```
Tags = ["Tag3", "Tag1", "Tag2"]
```

> 注意：子資料的元素在前，父資料的元素在後。

---

## 使用情境

### 情境 1：基本材料物品

材料類物品通常只需要基本欄位，可大量堆疊。

```json
{
  "ID": "IronOre",
  "Name": "鐵礦石",
  "Description": "可以熔煉成鐵錠。",
  "StackLimit": 99,
  "Price": 10,
  "Graphic": {
    "GraphicType": "Single",
    "SpritePath": "Images/Items/IronOre"
  }
}
```

### 情境 2：複合功能工具

許多工具同時具有工具和武器功能。

```json
{
  "Parent": "ToolBase_Stone",
  "ID": "HeavyIronAxe",
  "Name": "戰斧",
  "Description": "一把更鋒利的斧頭，也能用於戰鬥。",
  "Graphic": {
    "GraphicType": "Single",
    "SpritePath": "Images/Items/Tools/HeavyIronAxe"
  },
  "Components": [
    {
      "CompType": "Tool",
      "Tool": {
        "ToolType": "Axe",
        "Animation": "Smash",
        "StaminaCost": 5
      }
    },
    {
      "CompType": "Weapon",
      "Weapon": {
        "Attack": 30,
        "Animation": "Slash",
        "Abilities": ["Slash"]
      }
    }
  ]
}
```

### 情境 3：帶特殊效果的食物

食物可以同時是消耗品，使用時觸發狀態效果。

```json
{
  "Parent": "FoodBase",
  "ID": "CactusJuice",
  "Name": "仙人掌汁",
  "Description": "沙漠中的珍貴飲料。",
  "Graphic": {
    "GraphicType": "Single",
    "SpritePath": "Images/Items/CactusJuice"
  },
  "Components": [
    {
      "CompType": "Food",
      "Food": {
        "Level": 1,
        "Value": 40,
        "BaseStats": {
          "HealthGen": 0.5,
          "StaminaGen": 0.5,
          "Satiety": 80,
          "Taste": 40
        }
      }
    },
    {
      "CompType": "Consumable",
      "Consumable": {
        "AnimationType": "Eat",
        "Actions": [
          {
            "Action": "ApplyStatusEffect",
            "ActionData": {"ID": "CactusJuice"}
          }
        ]
      }
    }
  ]
}
```

### 情境 4：可放置的家具

家具物品需要 Furniture 元件指向對應的 SceneObject。

```json
{
  "Parent": "FurnitureBase",
  "ID": "ShippingBox",
  "Name": "出貨箱",
  "Description": "將物品放在裡面，商人每天會派人來收。",
  "StackLimit": 1,
  "IsUnique": true,
  "Graphic": {
    "GraphicType": "Single",
    "SpritePath": "Images/Items/ShippingBox"
  },
  "Components": [
    {
      "CompType": "Furniture",
      "Furniture": {
        "SceneObject": "ShippingBox"
      }
    }
  ]
}
```

### 情境 5：魚類食材（使用繼承簡化）

魚類食材有共同的基礎屬性，只需定義差異。

**基底定義：**
```json
{
  "ID": "FishBase",
  "Description": "一種魚類食材。",
  "StackLimit": 20,
  "Price": 50,
  "Components": [
    {
      "CompType": "FoodIngredient",
      "FoodIngredient": {
        "Type": "Fish",
        "Value": 1,
        "FoodStats": {
          "HealthGen": 0.2,
          "StaminaGen": 0.8,
          "Satiety": 120,
          "Taste": 10
        }
      }
    }
  ]
}
```

**具體魚類：**
```json
{
  "Parent": "FishBase",
  "ID": "Tuna",
  "Name": "鮪魚",
  "Description": "一種大型魚類，肉質鮮美。",
  "Graphic": {
    "GraphicType": "Single",
    "SpritePath": "Images/Items/Fishes/Tuna"
  }
}
```

---

## 常見問題

### Q: StackLimit 設為多少比較好？
A: 依物品類型決定：
- **材料**：`99` 或更高
- **食物/消耗品**：`10-20`
- **工具/武器/裝備**：`1`（不可堆疊）

### Q: 物品可以有多個元件嗎？
A: 可以！例如戰斧可以同時是 Tool（砍樹）和 Weapon（攻擊）。只需在 `Components` 陣列中添加多個元件即可。

### Q: Parent 和子物品都定義了同一欄位怎麼辦？
A: 子物品的欄位會**覆蓋**父物品的欄位。這讓你可以繼承大部分屬性，只修改特定欄位。

### Q: IsUnique 有什麼用？
A: 設為 `true` 的物品在整個遊戲中只能存在一個。適用於特殊劇情物品或獨特裝備。

### Q: 如何讓物品在拾取時觸發事件？
A: 使用 `PickUpActions` 欄位定義 GameEvent 動作：
```json
"PickUpActions": [
  {
    "Action": "ShowDialogue",
    "ActionData": {"DialogueID": "FoundSpecialItem"}
  }
]
```

---

## 相關資料

- [Recipes 配方資料](/docs/data-types/recipes) - 物品的製作方式
- [SceneObjects 場景物件](/docs/data-types/sceneobjects) - 家具對應的場景物件
- [資料類型總覽](/docs/data-types/) - 其他資料類型

---

## 檔案組織結構

```
Assets/StreamingAssets/GameDefines/Items/
├── Food/
│   ├── Item_BaseFood.json      # 食物基類
│   ├── Item_Food.json          # 一般食物
│   ├── Item_FoodT1.json        # 一級食物
│   ├── Item_FoodT2.json        # 二級食物
│   ├── Item_FoodT3.json        # 三級食物
│   └── Item_FoodIngredient.json
├── Furnitures/
│   ├── Item_Furnitures.json    # 基礎家具
│   ├── Item_ShippingBox.json
│   └── CraftStations/          # 工作站家具
├── Equipments/
│   ├── Item_Equipments.json    # 基礎裝備
│   ├── Item_Equipments_Iron.json
│   └── Item_Equipments_Tribal.json
├── Fishes/
│   └── Item_Fishes.json        # 魚類（20+ 種）
└── ToolsAndWeapons/
    ├── Item_ToolBase.json      # 工具基類
    ├── Item_Tools.json         # 一般工具
    ├── Item_Weapons.json       # 武器
    └── Item_Tool_Iron.json     # 鐵製工具
```

---

## 常見欄位值參考

### StackLimit 建議值
| 類型 | 建議值 |
|------|--------|
| 材料/礦石 | 99 |
| 食物 | 10-20 |
| 消耗品 | 10 |
| 工具/武器 | 1 |
| 裝備 | 1 |
| 家具 | 10 |

### Price 參考範圍
| 類型 | 價格範圍 |
|------|----------|
| 基礎材料 | 5-20 |
| 工具 | 20-80 |
| 食物 | 30-100 |
| 裝備 | 50-200 |
| 特殊物品 | 100+ |

### Food Level 說明
| 等級 | 說明 | 範例 |
|------|------|------|
| 0 | 原始食材 | 野果、生肉 |
| 1 | 簡單料理 | 三明治、沙拉 |
| 2 | 中級料理 | 燉菜、烤肉 |
| 3 | 高級料理 | 宴會料理 |
