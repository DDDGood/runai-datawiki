# SceneObjects 場景物件資料

SceneObject 是遊戲場景中所有可放置物件的基礎資料類型。包括建築物、家具、植物、樹木、礦石、裝飾品等各種場景元素。

## 概覽

- **JSON 檔案位置**：`Assets/StreamingAssets/GameDefines/SceneObjects/`
- **C# 類別**：`SceneObjectData` ([SceneObject.cs](../../Assets/Scripts/Engine/Scene/SceneObject.cs))
- **資料總數**：約 100+ 筆

## 快速範例

```json
{
    "SceneObjects": [
        {
            "Parent": "SceneObjectBase",
            "ID": "OakChair",
            "SceneObjectType": "Furniture",
            "Name": "橡木椅",
            "Size": { "Width": 1, "Height": 1 },
            "Graphic": {
                "GraphicType": "FourDirection",
                "SpritePath": "Images/SceneObject/Furnitures/OakFurnitures/OakChair"
            },
            "Rotatable": true,
            "Pickable": true,
            "Components": [
                {
                    "CompType": "Collider",
                    "Collider": { "Type": "Tile" }
                },
                {
                    "CompType": "Chair",
                    "Chair": { "RestPerMinute": 5 }
                }
            ]
        }
    ]
}
```

---

## 欄位說明

### 基本欄位

| 欄位 | 類型 | 必填 | 說明 |
|------|------|------|------|
| ID | string | ✅ | 唯一識別碼 |
| Parent | string | | 繼承的父資料 ID |
| Name | string | | 顯示名稱（可在地化） |
| SceneObjectType | string | | 物件分類，用於 UI 和邏輯分類 |
| Tags | string[] | | 標籤陣列，用於篩選和查詢 |
| Size | SizeData | | 佔用格子尺寸 |
| Graphic | GraphicData | | 圖形設定 |
| PivotCellOffset | Vector2Int | | 軸心格子偏移 |
| Rotatable | bool | | 是否可旋轉（支援四向） |
| Pickable | bool | | 是否可拾取轉為道具 |
| Linkable | bool | | 是否可連結（如圍欄） |
| CanBuildOnWater | bool | | 是否可建在水上 |
| OverridePickUpItem | string | | 拾取後轉換的道具 ID（預設使用同名道具） |
| Components | ComponentData[] | | 舊式元件陣列 |
| JComponents | Dictionary | | 新式元件字典（推薦） |
| Animations | SpriteAnimation[] | | 額外動畫資料 |

### SizeData（尺寸）

```json
"Size": {
    "Width": 2,
    "Height": 1
}
```

| 子欄位 | 類型 | 預設值 | 說明 |
|--------|------|--------|------|
| Width | int | 1 | 寬度（格子數） |
| Height | int | 1 | 高度（格子數） |

### GraphicData（圖形）

```json
"Graphic": {
    "GraphicType": "FourDirection",
    "SpritePath": "Images/SceneObject/Furnitures/OakChair",
    "RandomCount": 5
}
```

| 子欄位 | 類型 | 說明 |
|--------|------|------|
| GraphicType | string | 圖形類型（見下方列表） |
| SpritePath | string | 圖片路徑（Resources 相對路徑） |
| SpriteSortPoint | string | 排序錨點（`Pivot` / `Center`） |
| RandomCount | int | 隨機圖形數量（用於 Random 類型） |
| RandomWeights | int[] | 隨機權重（用於 Random 類型） |
| FramePerSecond | int | 動畫幀率（用於 Animated 類型） |

**GraphicType 可用值：**

| 值 | 說明 | 圖片命名 |
|----|------|----------|
| `Single` | 單一圖片 | `SpritePath` |
| `FourDirection` | 四向圖片（支援旋轉） | `SpritePath_Front`, `_Back`, `_Left`, `_Right` |
| `Random` | 隨機選擇 | `SpritePath_1`, `_2`, ... `_N` |
| `Animated` | 序列動畫 | `SpritePath_1`, `_2`, ... |
| `AnimatedRandom` | 隨機動畫 | 結合 Random 和 Animated |

### SceneObjectType（物件分類）

常用的 SceneObjectType 值：

| 值 | 說明 |
|----|------|
| `Building` | 建築物（房屋、工坊等） |
| `Furniture` | 家具（床、椅子、桌子等） |
| `Tree` | 樹木 |
| `GroundObject` | 地面物件（植物、作物等） |
| `Resources` | 資源（礦石、岩石等） |

---

## Components 元件系統

SceneObject 採用組件化架構，透過 Components 擴展物件功能。目前有兩套系統：

1. **舊式 Components**：使用 `Components` 陣列 + `CompType` 字串
2. **新式 JComponents**：使用 `JComponents` 字典（推薦用於新元件）

### 舊式 Components 格式

```json
"Components": [
    {
        "CompType": "Collider",
        "Collider": {
            "Type": "Tile"
        }
    },
    {
        "CompType": "Bed",
        "Bed": {
            "SleepLevel": 1,
            "SleepQuality": 80
        }
    }
]
```

### 新式 JComponents 格式

```json
"JComponents": {
    "Gatherable": {
        "GatherWork": 60,
        "GatherTools": [
            { "ToolType": "Axe", "Efficiency": 1 }
        ],
        "Products": [
            { "Item": "Wood", "Count": 3 }
        ]
    }
}
```

> **注意**：`Gatherable` 元件已遷移至 JComponents 格式，新資料請使用 JComponents。

---

## 元件類型詳解

### Collider（碰撞器）

定義物件的碰撞區域，影響角色移動和尋路。

```json
{
    "CompType": "Collider",
    "Collider": {
        "Type": "Tile"
    }
}
```

**Collider 類型：**

| Type | 說明 | 額外參數 |
|------|------|----------|
| `Tile` | 佔滿整個格子 | 無 |
| `Circle` | 圓形碰撞 | `Radius`, `Offset` |
| `Rect` | 矩形碰撞 | `Rect` |
| `Sprite` | 依據圖片形狀 | 無 |
| `Poly` | 多邊形 | `PolyMask` |

**圓形碰撞範例：**
```json
{
    "CompType": "Collider",
    "Collider": {
        "Type": "Circle",
        "Radius": 0.3,
        "Offset": { "x": 0, "y": 0.2 }
    }
}
```

### Bed（床）

讓角色可以躺下睡覺。

```json
{
    "CompType": "Bed",
    "Bed": {
        "SleepLevel": 1,
        "SleepQuality": 80,
        "OffsetHeight": 0.2
    }
}
```

| 欄位 | 類型 | 說明 |
|------|------|------|
| SleepLevel | int | 睡眠等級 |
| SleepQuality | int | 基礎睡眠品質 |
| OffsetHeight | float | 角色躺下時的高度偏移 |

### Chair（椅子）

讓角色可以坐下休息。

```json
{
    "CompType": "Chair",
    "Chair": {
        "RestPerMinute": 5,
        "OffsetHeight": 0
    }
}
```

| 欄位 | 類型 | 說明 |
|------|------|------|
| RestPerMinute | float | 每分鐘恢復的休息值 |
| OffsetHeight | float | 角色坐下時的高度偏移 |

### Container（容器）

可存放物品的容器。

```json
{
    "CompType": "Container",
    "Container": {
        "Capacity": 20,
        "SpawnLoots": ["Loot_Chest"]
    }
}
```

| 欄位 | 類型 | 說明 |
|------|------|------|
| Capacity | int | 容量（格子數） |
| SpawnLoots | string[] | 初始生成的掉落表 ID |

### Light（光源）

發出光線的物件。

```json
{
    "CompType": "Light",
    "Light": {
        "Size": 10,
        "Color": { "r": 212, "g": 92, "b": 21, "a": 128 },
        "IsFlickering": true,
        "FlickerRange": 0.05
    }
}
```

| 欄位 | 類型 | 說明 |
|------|------|------|
| Size | float | 光照範圍 |
| Color | Color32 | 光線顏色（RGBA） |
| IsFlickering | bool | 是否閃爍 |
| FlickerRange | float | 閃爍幅度 |

### LightCollider / DayLightCollider（陰影）

產生陰影效果。

```json
{
    "CompType": "LightCollider",
    "LightCollider": {
        "ShadowType": "Collider2D"
    }
},
{
    "CompType": "DayLightCollider",
    "DayLightCollider": {
        "ShadowType": "SpriteProjection",
        "ShadowOffset": { "x": 0.5, "y": 0.2 },
        "ShadowDistance": 1,
        "ShadowThickness": 0.5
    }
}
```

| 元件 | 用途 |
|------|------|
| LightCollider | 夜間光源產生的陰影 |
| DayLightCollider | 日間太陽產生的陰影 |

**ShadowType 值：**
- `Collider2D` - 依碰撞器產生陰影
- `SpriteProjection` - 依圖片投影產生陰影

### CraftStation（製作工作站）

可進行製作的工作站。

```json
{
    "CompType": "CraftStation",
    "CraftStation": {
        "Recipes": ["Make_CopperIngot", "Make_IronIngot"],
        "InteractionCellOffset": { "x": 1, "y": -1 },
        "IsAutomatic": true,
        "WorkPerMinute": 2,
        "JobType": "Crafting",
        "RelativeSkill": "Crafting"
    }
}
```

| 欄位 | 類型 | 說明 |
|------|------|------|
| Recipes | string[] | 可製作的配方 ID 列表 |
| InteractionCellOffset | Vector2Int | 互動位置偏移 |
| IsAutomatic | bool | 是否自動工作（不需居民操作） |
| WorkPerMinute | float | 每分鐘工作進度 |
| JobType | string | 工作類型 |
| RelativeSkill | string | 相關技能 |
| DefaultTool | string | 預設工具 |

### CookStation（烹飪工作站）

可烹飪食物的工作站。

```json
{
    "CompType": "CookStation",
    "CookStation": {
        "Capacity": 1,
        "WorkPerMinute": 10
    }
}
```

| 欄位 | 類型 | 說明 |
|------|------|------|
| Capacity | int | 同時烹飪數量 |
| WorkPerMinute | float | 每分鐘工作進度 |

### House（房屋）

建築物的室內空間管理。

```json
{
    "CompType": "House",
    "House": {
        "HouseType": "Home",
        "Level": 1,
        "InteriorWidth": 5,
        "InteriorHeight": 3,
        "FloorTile": "WoodFloor",
        "WallTile": "WoodWall",
        "IsPlayerHouse": false,
        "SpawnInteriors": [
            { "SceneObjectGroup": "CampInterior", "Weight": 1 }
        ],
        "Upgrade": {
            "SceneObject": "HouseLevel2",
            "RequiredSettlementLevel": 1,
            "Cost": [
                { "Item": "Wood", "Count": 10 },
                { "Item": "Stone", "Count": 5 }
            ]
        }
    }
}
```

| 欄位 | 類型 | 說明 |
|------|------|------|
| HouseType | string | 房屋功能類型 |
| Level | int | 房屋等級 |
| InteriorWidth | int | 室內寬度 |
| InteriorHeight | int | 室內高度 |
| FloorTile | string | 地板 Tile ID |
| WallTile | string | 牆壁 Tile ID |
| IsPlayerHouse | bool | 是否為玩家房屋 |
| SpawnInteriors | array | 室內裝飾生成設定 |
| Upgrade | object | 升級設定 |
| DungeonGeneration | string | 地城生成器 ID |
| BackgroundMusic | object | 背景音樂設定 |

**HouseType 可用值：**
- `Home` - 居民住宅
- `PlayerHome` - 玩家住宅
- `ResearchLab` - 研究室
- `TownHall` - 市政廳
- `Shop` - 商店

### Entrance（入口）

連接室內外的入口。

```json
{
    "CompType": "Entrance",
    "Entrance": {
        "From": { "x": 2, "y": 0 },
        "To": { "x": 1, "y": -1 },
        "ToDirection": { "x": 0, "y": 1 }
    }
}
```

| 欄位 | 類型 | 說明 |
|------|------|------|
| From | Vector3Int | 入口位置（相對於物件） |
| To | Vector3Int | 傳送目標位置（室內座標） |
| ToDirection | Vector3Int | 進入後面向方向 |

### Door（門）

可開關的門。

```json
{
    "CompType": "Door",
    "Door": {
        "OpenedGraphic": {
            "GraphicType": "Single",
            "SpritePath": "Images/SceneObject/Doors/DoorOpened"
        }
    }
}
```

### Plant（植物）

會生長的植物，支援多階段成長。

```json
{
    "CompType": "Plant",
    "Plant": {
        "NeedField": true,
        "NeedWater": true,
        "LifeStages": [
            {
                "Days": 1,
                "Graphic": {
                    "GraphicType": "Single",
                    "SpritePath": "Images/SceneObject/Plants/Crops/Cabbage_1"
                }
            },
            {
                "Days": 1,
                "Graphic": {
                    "GraphicType": "Single",
                    "SpritePath": "Images/SceneObject/Plants/Crops/Cabbage_4"
                },
                "Gatherable": {
                    "GatherWork": 10,
                    "GatherTools": [
                        { "ToolType": "Hand", "Efficiency": 1 }
                    ],
                    "Products": [
                        { "Item": "Cabbage", "Count": 1 }
                    ]
                }
            }
        ]
    }
}
```

| 欄位 | 類型 | 說明 |
|------|------|------|
| NeedField | bool | 是否需要農田 |
| NeedWater | bool | 是否需要澆水 |
| LifeStages | array | 生長階段陣列 |

**LifeStage 欄位：**

| 欄位 | 類型 | 說明 |
|------|------|------|
| Days | int | 此階段持續天數 |
| Graphic | GraphicData | 此階段的圖形 |
| Gatherable | GatherableData | 可採集設定（通常只有最後階段有） |
| RenewToStageOnHarvest | int | 採集後重生到的階段索引 |

### Gatherable（可採集）- JComponents

**注意：此元件已遷移至 JComponents 格式**

```json
"JComponents": {
    "Gatherable": {
        "GatherWork": 60,
        "InteractionHint": "砍伐",
        "GatherTools": [
            { "ToolType": "Axe", "Efficiency": 1 }
        ],
        "Products": [
            { "Item": "Wood", "Count": 3 },
            { "Item": "BirchSeed", "Count": 1 }
        ],
        "GatherExp": 10,
        "Renewable": false,
        "RenewDays": 3,
        "HarvestedGraphic": { ... }
    }
}
```

| 欄位 | 類型 | 說明 |
|------|------|------|
| GatherWork | int | 採集所需工作量 |
| InteractionHint | string | 互動提示文字 |
| GatherTools | array | 可用工具列表 |
| Products | array | 產出物品 |
| GatherExp | int | 採集獲得經驗 |
| Renewable | bool | 是否可重複採集 |
| RenewDays | int | 重生所需天數 |
| HarvestedGraphic | GraphicData | 採集後的圖形 |

**GatherTool 欄位：**

| 欄位 | 類型 | 說明 |
|------|------|------|
| ToolType | string | 工具類型（`Hand`, `Axe`, `Pickaxe` 等） |
| Efficiency | int | 效率倍數 |

**Product 欄位：**

| 欄位 | 類型 | 說明 |
|------|------|------|
| Item | string | 物品 ID |
| Count | int | 數量 |

### SettlerFurniture（居民家具）

影響居民屬性的家具。

```json
{
    "CompType": "SettlerFurniture",
    "SettlerFurniture": {
        "FurnitureType": "Bed",
        "StatModifiers": [
            { "Stat": "Comfort", "Value": 10 },
            { "Stat": "Beauty", "Value": 5 }
        ]
    }
}
```

| 欄位 | 類型 | 說明 |
|------|------|------|
| FurnitureType | string | 家具類型（`Bed`, `Chair`, `Wardrobe` 等） |
| Beauty | int | 美觀度 |
| Comfort | int | 舒適度 |
| Pressure | int | 壓力值 |
| StatModifiers | array | 屬性修正列表 |

### ActionPosition（動作位置）

讓角色在此位置執行特定動作（如營火旁跳舞）。

```json
{
    "CompType": "ActionPosition",
    "ActionPosition": {
        "MaxUsers": 8,
        "CellOffset": { "x": 0, "y": 0 },
        "Area": { "x": -1, "y": -1, "width": 3, "height": 3 },
        "PositionType": "Adjacent_Bound",
        "AIAction": {
            "ID": "Dance",
            "BaseScore": 0,
            "Cooldown": 60,
            "Scorers": [ ... ]
        },
        "Sequences": [ ... ]
    }
}
```

### WorkPlace（工作地點）

居民工作的地點。

```json
{
    "CompType": "WorkPlace",
    "WorkPlace": {
        "WorkType": "Gather",
        "GatherTargets": ["Tree", "Rock"],
        "ProduceItems": [ ... ],
        "InventorySlot": 20,
        "WorkerPositionOffset": { "x": 0, "y": -1 },
        "ToolItem": "Axe"
    }
}
```

**WorkType 值：**
- `Gather` - 採集
- `Research` - 研究
- `Produce` - 生產

---

## Parent 繼承

### 常見的基底資料

| 基底 ID | 用途 | 提供的預設值 |
|---------|------|-------------|
| `SceneObjectBase` | 所有物件的根基底 | `Size: {1, 1}` |
| `TreeBase` | 樹木基底 | 圓形碰撞器、陰影設定、Tree 標籤 |
| `OreBase` | 礦石基底 | Ore 標籤 |
| `RockBase` | 岩石基底 | Rock 標籤 |
| `GatherableTreeBase` | 可採集樹木 | 繼承 TreeBase + Gatherable 元件 |

### 繼承範例

**基本繼承：**
```json
{
    "SceneObjects": [
        {
            "ID": "SceneObjectBase",
            "Name": "Base",
            "Size": { "Width": 1, "Height": 1 }
        },
        {
            "Parent": "SceneObjectBase",
            "ID": "MyFurniture",
            "Name": "我的家具",
            "SceneObjectType": "Furniture"
            // 自動繼承 Size: {1, 1}
        }
    ]
}
```

**多層繼承：**
```json
{
    "SceneObjects": [
        {
            "Parent": "SceneObjectBase",
            "ID": "OreBase",
            "SceneObjectType": "Resources",
            "Tags": ["Ore"]
        },
        {
            "Parent": "OreBase",
            "ID": "IronOre",
            "Name": "鐵礦"
            // 自動繼承 SceneObjectType: "Resources" 和 Tags: ["Ore"]
        }
    ]
}
```

---

## Inherit 陣列繼承

當子資料需要**保留父資料的陣列內容並擴充**時，在陣列中加入 `"Inherit"` 字串。

### 範例：繼承 Components

```json
{
    "SceneObjects": [
        {
            "Parent": "SceneObjectBase",
            "ID": "TreeBase",
            "Tags": ["Tree"],
            "Components": [
                {
                    "CompType": "Collider",
                    "Collider": { "Type": "Circle", "Radius": 0.2 }
                },
                {
                    "CompType": "LightCollider",
                    "LightCollider": { "ShadowType": "Collider2D" }
                }
            ]
        },
        {
            "Parent": "TreeBase",
            "ID": "BirchTree",
            "Name": "樺木",
            "Components": [
                "Inherit",
                {
                    "CompType": "Plant",
                    "Plant": { "LifeStages": [...] }
                }
            ]
        }
    ]
}
```

**結果：**BirchTree 的 Components 會是：
1. Collider（來自 TreeBase）
2. LightCollider（來自 TreeBase）
3. Plant（自己定義）

> **重要**：`"Inherit"` 會被移除，父資料的陣列元素會**附加到末尾**。

---

## 使用情境

### 情境 1：建立可採集的樹木

```json
{
    "Parent": "TreeBase",
    "ID": "AppleTree",
    "Name": "蘋果樹",
    "Graphic": {
        "GraphicType": "Random",
        "SpritePath": "Images/SceneObject/Trees/AppleTree",
        "RandomCount": 3
    },
    "Components": [
        "Inherit"
    ],
    "JComponents": {
        "Gatherable": {
            "GatherWork": 40,
            "GatherTools": [
                { "ToolType": "Axe", "Efficiency": 1 }
            ],
            "Products": [
                { "Item": "Wood", "Count": 2 },
                { "Item": "Apple", "Count": 3 }
            ]
        }
    }
}
```

### 情境 2：建立農作物（需澆水、多階段生長）

```json
{
    "Parent": "SceneObjectBase",
    "ID": "Tomato",
    "SceneObjectType": "GroundObject",
    "Name": "番茄",
    "Graphic": {
        "GraphicType": "Single",
        "SpritePath": "Images/SceneObject/Plants/Crops/Tomato_1"
    },
    "Components": [
        {
            "CompType": "Plant",
            "Plant": {
                "NeedField": true,
                "NeedWater": true,
                "LifeStages": [
                    {
                        "Days": 2,
                        "Graphic": {
                            "GraphicType": "Single",
                            "SpritePath": "Images/SceneObject/Plants/Crops/Tomato_1"
                        }
                    },
                    {
                        "Days": 2,
                        "Graphic": {
                            "GraphicType": "Single",
                            "SpritePath": "Images/SceneObject/Plants/Crops/Tomato_2"
                        }
                    },
                    {
                        "Days": 3,
                        "Graphic": {
                            "GraphicType": "Single",
                            "SpritePath": "Images/SceneObject/Plants/Crops/Tomato_3"
                        },
                        "Gatherable": {
                            "GatherWork": 5,
                            "GatherTools": [
                                { "ToolType": "Hand", "Efficiency": 1 }
                            ],
                            "Products": [
                                { "Item": "Tomato", "Count": 2 }
                            ]
                        }
                    }
                ]
            }
        }
    ]
}
```

### 情境 3：建立可重複採集的莓果灌木

```json
{
    "Parent": "SceneObjectBase",
    "ID": "BlueBerryBush",
    "SceneObjectType": "GroundObject",
    "Name": "藍莓灌木",
    "Graphic": {
        "GraphicType": "Single",
        "SpritePath": "Images/SceneObject/Plants/BlueberryBush_3"
    },
    "Components": [
        {
            "CompType": "Plant",
            "Plant": {
                "LifeStages": [
                    {
                        "Days": 3,
                        "Graphic": {
                            "GraphicType": "Single",
                            "SpritePath": "Images/SceneObject/Plants/BlueberryBush_1"
                        }
                    },
                    {
                        "Days": 3,
                        "Graphic": {
                            "GraphicType": "Single",
                            "SpritePath": "Images/SceneObject/Plants/BlueberryBush_2"
                        }
                    },
                    {
                        "Days": 1,
                        "Graphic": {
                            "GraphicType": "Single",
                            "SpritePath": "Images/SceneObject/Plants/BlueberryBush_3"
                        },
                        "Gatherable": {
                            "GatherWork": 5,
                            "GatherTools": [
                                { "ToolType": "Hand", "Efficiency": 1 }
                            ],
                            "Products": [
                                { "Item": "BlueBerry", "Count": 5 }
                            ],
                            "Renewable": true
                        },
                        "RenewToStageOnHarvest": 1
                    }
                ]
            }
        }
    ]
}
```

> **說明**：`Renewable: true` 使植物可重複採集，`RenewToStageOnHarvest: 1` 表示採集後回到第 2 階段（索引從 0 開始）。

### 情境 4：建立居民房屋（可升級）

```json
{
    "ID": "BasicHouse",
    "SceneObjectType": "Building",
    "Name": "基礎小屋",
    "Graphic": {
        "GraphicType": "Single",
        "SpritePath": "Images/SceneObject/Buildings/Houses/BasicHouse"
    },
    "Size": { "Width": 4, "Height": 2 },
    "Components": [
        {
            "CompType": "Collider",
            "Collider": { "Type": "Tile" }
        },
        {
            "CompType": "LightCollider",
            "LightCollider": { "ShadowType": "Collider2D" }
        },
        {
            "CompType": "Entrance",
            "Entrance": {
                "From": { "x": 2, "y": 0 },
                "To": { "x": 2, "y": -1 }
            }
        },
        {
            "CompType": "House",
            "House": {
                "HouseType": "Home",
                "Level": 1,
                "InteriorWidth": 5,
                "InteriorHeight": 3,
                "FloorTile": "WoodFloor",
                "WallTile": "WoodWall",
                "Upgrade": {
                    "SceneObject": "AdvancedHouse",
                    "RequiredSettlementLevel": 2,
                    "Cost": [
                        { "Item": "Wood", "Count": 20 },
                        { "Item": "Stone", "Count": 10 }
                    ]
                }
            }
        }
    ]
}
```

### 情境 5：建立工作站

```json
{
    "Parent": "SceneObjectBase",
    "ID": "SawMill",
    "SceneObjectType": "Furniture",
    "Name": "鋸木台",
    "Size": { "Width": 2, "Height": 1 },
    "Graphic": {
        "GraphicType": "Single",
        "SpritePath": "Images/SceneObject/Furnitures/SawMill"
    },
    "Pickable": true,
    "Components": [
        {
            "CompType": "Collider",
            "Collider": { "Type": "Tile" }
        },
        {
            "CompType": "CraftStation",
            "CraftStation": {
                "Recipes": ["Make_Plank", "Make_WoodBeam"],
                "InteractionCellOffset": { "x": 0, "y": -1 },
                "IsAutomatic": false,
                "WorkPerMinute": 1,
                "JobType": "Crafting",
                "RelativeSkill": "Crafting"
            }
        }
    ]
}
```

---

## 常見問題

### Q: Components 和 JComponents 有什麼區別？
A: `Components` 是舊式格式，使用陣列存放元件。`JComponents` 是新式格式，使用字典（key-value）存放。新的元件（如 Gatherable）已遷移至 JComponents，建議新資料使用 JComponents。兩者可以並存在同一個物件中。

### Q: 如何讓物件可以被拾取？
A: 設定 `"Pickable": true`。拾取後會轉換為同名道具，或使用 `OverridePickUpItem` 指定不同的道具 ID。

### Q: 如何讓家具支援旋轉？
A: 設定 `"Rotatable": true`，並將 GraphicType 設為 `FourDirection`。系統會自動載入 `_Front`、`_Back`、`_Left`、`_Right` 後綴的圖片。

### Q: 植物如何設定可重複採集？
A: 在最後階段的 Gatherable 中設定 `"Renewable": true`，並在 LifeStage 中設定 `"RenewToStageOnHarvest"` 指定採集後回到哪個階段。

### Q: 如何讓物件產生陰影？
A: 加入 `LightCollider` 元件（夜間陰影）和/或 `DayLightCollider` 元件（日間陰影）。

---

## 相關資料

- [Blueprints 藍圖資料](/docs/data-types/blueprints) - 建造物件所需的藍圖
- [Items 物品資料](/docs/data-types/items) - 物件可轉換的道具
- [Recipes 配方資料](/docs/data-types/recipes) - 工作站可製作的配方
- [Tiles 地形資料](/docs/data-types/tiles) - 房屋的地板和牆壁

---

## 元件類型速查表

| CompType | 說明 | 常用參數 |
|----------|------|----------|
| `Collider` | 碰撞器 | Type, Radius, Offset |
| `Bed` | 床 | SleepLevel, SleepQuality |
| `Chair` | 椅子 | RestPerMinute |
| `Container` | 容器 | Capacity |
| `Light` | 光源 | Size, Color, IsFlickering |
| `LightCollider` | 夜間陰影 | ShadowType |
| `DayLightCollider` | 日間陰影 | ShadowType, ShadowOffset |
| `CraftStation` | 製作站 | Recipes, IsAutomatic |
| `CookStation` | 烹飪站 | Capacity, WorkPerMinute |
| `House` | 房屋 | HouseType, InteriorWidth/Height |
| `Entrance` | 入口 | From, To |
| `Door` | 門 | OpenedGraphic |
| `Plant` | 植物 | NeedField, NeedWater, LifeStages |
| `SettlerFurniture` | 居民家具 | FurnitureType, StatModifiers |
| `ActionPosition` | 動作位置 | MaxUsers, AIAction |
| `WorkPlace` | 工作地點 | WorkType, GatherTargets |
| `SettlerWardrobe` | 衣櫃 | （無額外參數） |
| `Destroyable` | 可摧毀 | （無額外參數） |

**JComponents：**

| Key | 說明 | 常用參數 |
|-----|------|----------|
| `Gatherable` | 可採集 | GatherWork, GatherTools, Products, Renewable |
