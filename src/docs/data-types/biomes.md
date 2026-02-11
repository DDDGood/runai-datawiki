# Biomes 生態區域資料

Biome（生態區域）定義了世界地圖上每個格子的環境特性，包括視覺外觀、溫度、可生成的植物、動物、礦物等資源。生態區域是遊戲世界「情緒」與「氛圍」的核心，從和煦的平原到神秘的幽暗森林，每個生態區域都提供獨特的視覺、聽覺與探索體驗。

## 概覽

- **JSON 檔案位置**：`Assets/StreamingAssets/GameDefines/World/Biomes/`
- **C# 類別**：`BiomeData` (`Assets/Scripts/Engine/World/Biome.cs`)
- **資料總數**：約 15+ 筆

## 快速範例

一個最簡單的可登陸生態區域：

```json
{
    "Biomes": [
        {
            "Parent": "LandableForestSample",
            "ID": "MyBiome",
            "Name": "我的生態區",
            "Graphic": {
                "GraphicType": "Single",
                "SpritePath": "Images/WorldTiles/MyBiome"
            }
        }
    ]
}
```

## 欄位說明

### 基本欄位

| 欄位 | 類型 | 必填 | 說明 |
|------|------|------|------|
| ID | string | ✅ | 唯一識別碼，用於系統內部引用 |
| Parent | string | | 繼承的父資料 ID，可繼承父資料的所有欄位 |
| Name | string | | 顯示給玩家看的名稱（在地化鍵或直接文字） |
| Landable | bool | | 玩家是否可以在此格登陸進入場景，預設 `false` |
| SceneGenerator | string | | 場景生成器 ID，決定進入時如何生成場景 |

### 視覺表現

| 欄位 | 類型 | 說明 |
|------|------|------|
| Graphic | GraphicData | 基礎地表的視覺設定 |
| OverrideHillGraphic | GraphicData | 丘陵地形的替代圖形 |
| OverrideMountainGraphic | GraphicData | 山脈地形的替代圖形 |

#### GraphicData 子欄位

| 子欄位 | 類型 | 說明 |
|--------|------|------|
| GraphicType | string | 圖形類型：`"Single"`（單張）、`"Random"`（隨機）、`"Animated"`（動畫） |
| SpritePath | string | 圖片資源路徑（相對於 Resources 目錄） |

**範例：**
```json
"Graphic": {
    "GraphicType": "Single",
    "SpritePath": "Images/WorldTiles/Woodland"
}
```

### 環境屬性

| 欄位 | 類型 | 說明 |
|------|------|------|
| TemperatureData | TemperatureData | 該區域的溫度設定 |

#### TemperatureData 子欄位

| 子欄位 | 類型 | 預設值 | 說明 |
|--------|------|--------|------|
| Average | float | 21 | 平均溫度（攝氏） |
| Difference | float | 5 | 日夜溫差 |

**範例：**
```json
"TemperatureData": {
    "Average": -20,
    "Difference": 5
}
```

### 地形瓦片設定

| 欄位 | 類型 | 說明 |
|------|------|------|
| BaseTerrainTile | string | 基礎地表瓦片 ID（如 `"Dirt"`、`"Sand"`、`"Snow"`） |
| RockTerrainTile | string | 岩石地表瓦片 ID |
| WaterTerrainTile | string | 水域瓦片 ID |
| TerrainPatches | TerrainGenerationPatch[] | 地形覆蓋區塊設定（如草地覆蓋） |

#### TerrainGenerationPatch 結構

用於根據噪聲值在基礎地形上覆蓋其他瓦片：

```json
"TerrainPatches": [
    {
        "Tiles": [
            {
                "MinValue": 0.4,
                "MaxValue": 1,
                "Tile": "Grass_Woodland"
            }
        ]
    }
]
```

| 子欄位 | 類型 | 說明 |
|--------|------|------|
| MinValue | float | 噪聲值下限（0-1） |
| MaxValue | float | 噪聲值上限（0-1） |
| Tile | string | 要覆蓋的瓦片 ID |

### 資源生成

#### 植物

| 欄位 | 類型 | 說明 |
|------|------|------|
| PlantDensity | float | 植物生成密度（0-1），例如 `0.2` 表示 20% |
| WildPlants | IDAndWeight[] | 可生成的野生植物列表 |

#### 礦物

| 欄位 | 類型 | 說明 |
|------|------|------|
| OreChunkDensity | float | 礦物生成密度 |
| OreChunks | IDAndWeight[] | 可生成的礦石列表 |

#### 動物

| 欄位 | 類型 | 說明 |
|------|------|------|
| AnimalDensity | float | 動物生成密度 |
| Animals | IDAndWeight[] | 可生成的動物列表 |
| AnimalIsMonster | bool | 該區域的動物是否為敵對怪物 |

#### 場景物件

| 欄位 | 類型 | 說明 |
|------|------|------|
| SceneObjectDensity | float | 獨立場景物件密度 |
| SceneObjects | IDAndWeight[] | 可生成的場景物件列表 |
| SceneObjectGroupDensity | float | 場景物件組密度 |
| SceneObjectGroups | IDAndWeight[] | 可生成的場景物件組列表 |

#### IDAndWeight 結構

所有資源列表都使用此結構，Weight 決定生成權重：

```json
{
    "ID": "BigOakTree",
    "Weight": 8
}
```

| 子欄位 | 類型 | 說明 |
|--------|------|------|
| ID | string | 資源 ID（對應 Items、Characters、SceneObjects 等資料） |
| Weight | float | 權重，數值越高生成機率越大 |

### 音效設定

| 欄位 | 類型 | 說明 |
|------|------|------|
| BackgroundMusic | BackgroundMusicData | 背景音樂設定 |

#### BackgroundMusicData 子欄位

| 子欄位 | 類型 | 說明 |
|--------|------|------|
| AudioClipPaths | string[] | 音樂檔案路徑陣列 |
| Volume | float | 音量（0-1） |
| IsLoop | bool | 是否循環播放 |
| IsRandom | bool | 是否隨機播放（多首時） |
| StartDelayTime | float | 開始延遲時間 |
| SwitchClipDelayTime | float | 切換音樂的間隔時間 |

**範例：**
```json
"BackgroundMusic": {
    "AudioClipPaths": [
        "AudioAssets/BGM/BGM_3"
    ],
    "Volume": 0.1,
    "IsLoop": true
}
```

---

## Parent 繼承

### 繼承層級

Biome 資料使用多層繼承來減少重複設定：

```
BiomeBase                        # 最基礎，只有溫度設定
├── BiomeBaseLandable           # 可登陸的基底，設定基礎瓦片
│   └── LandableForestSample    # 有完整資源設定的模板
│       ├── Woodland            # 森林
│       ├── Grassland           # 草原
│       ├── Desert              # 沙漠
│       ├── Swamp               # 沼澤
│       ├── Tundra              # 苔原
│       └── Ice                 # 冰原
├── DeepOcean                   # 深海（不可登陸）
├── Ocean                       # 淺海（不可登陸）
└── PollutedLand                # 污染區域
    ├── PollutedIceLand
    ├── PollutedSandLand
    └── PollutedLand2           # 重污染
```

### 常見的基底資料

| 基底 ID | 用途 | 提供的預設值 |
|---------|------|-------------|
| BiomeBase | 所有生態區的根基底 | `TemperatureData: { Average: 21, Difference: 5 }` |
| BiomeBaseLandable | 可登陸區域基底 | `Landable: true`, 基礎瓦片設定 |
| LandableForestSample | 有資源的區域模板 | 完整的植物、礦物、動物、場景物件設定 |
| PollutedLand | 污染區域基底 | 污染視覺、詛咒樹木、殭屍敵人、`AnimalIsMonster: true` |

### 繼承範例

**基底資料（LandableForestSample）提供完整的資源設定：**

```json
{
    "Parent": "BiomeBaseLandable",
    "ID": "LandableForestSample",
    "PlantDensity": 0.2,
    "WildPlants": [
        { "ID": "Branch", "Weight": 2 },
        { "ID": "Turnip", "Weight": 1 },
        { "ID": "Grass", "Weight": 0.1 }
    ],
    "OreChunkDensity": 0.3,
    "OreChunks": [
        { "ID": "SmallRock", "Weight": 2 },
        { "ID": "Rock", "Weight": 1 },
        { "ID": "CopperOre", "Weight": 0.5 }
    ],
    "AnimalDensity": 0.005,
    "Animals": [
        { "ID": "HornLizard", "Weight": 10 }
    ]
}
```

**子資料只需覆蓋差異部分：**

```json
{
    "Parent": "LandableForestSample",
    "ID": "Woodland",
    "Name": "森林",
    "Graphic": {
        "GraphicType": "Single",
        "SpritePath": "Images/WorldTiles/Woodland"
    },
    "BaseTerrainTile": "Dirt_Woodland",
    "RockTerrainTile": "Rock_Woodland",
    "WaterTerrainTile": "Water_Woodland"
}
```

---

## Inherit 陣列繼承

當子資料想要**保留父資料的陣列元素並添加新元素**時，在陣列中加入 `"Inherit"` 字串：

### 範例：擴充動物列表

**父資料（LandableForestSample）：**
```json
{
    "ID": "LandableForestSample",
    "Animals": [
        { "ID": "HornLizard", "Weight": 10 }
    ]
}
```

**子資料（Woodland）使用 Inherit 擴充：**
```json
{
    "Parent": "LandableForestSample",
    "ID": "Woodland",
    "Animals": [
        "Inherit",
        { "ID": "AxolotlDog", "Weight": 1 },
        { "ID": "Badger", "Weight": 1 },
        { "ID": "BalloonPig", "Weight": 10 }
    ]
}
```

**最終結果：**
```json
"Animals": [
    { "ID": "AxolotlDog", "Weight": 1 },
    { "ID": "Badger", "Weight": 1 },
    { "ID": "BalloonPig", "Weight": 10 },
    { "ID": "HornLizard", "Weight": 10 }  // 來自父資料
]
```

### 常見使用場景

- **WildPlants**：擴充區域特有植物
- **Animals**：擴充區域特有動物
- **SceneObjectGroups**：擴充區域特有場景裝飾

---

## 使用情境

### 情境 1：新增一般陸地生態區

繼承 `LandableForestSample` 以獲得完整的資源設定：

```json
{
    "Biomes": [
        {
            "Parent": "LandableForestSample",
            "ID": "Savanna",
            "Name": "疏林草原",
            "Graphic": {
                "GraphicType": "Single",
                "SpritePath": "Images/WorldTiles/Savanna"
            },
            "TemperatureData": {
                "Average": 28,
                "Difference": 8
            },
            "BaseTerrainTile": "Dirt_Savanna",
            "RockTerrainTile": "Rock_Savanna",
            "WaterTerrainTile": "Water_Savanna",
            "PlantDensity": 0.05,
            "WildPlants": [
                { "ID": "AcaciaTree", "Weight": 10 },
                { "ID": "BaobabTree", "Weight": 5 }
            ],
            "Animals": [
                "Inherit",
                { "ID": "Lion", "Weight": 3 },
                { "ID": "Zebra", "Weight": 10 }
            ]
        }
    ]
}
```

### 情境 2：新增不可登陸區域（海洋）

繼承 `BiomeBase`，不設定 `Landable`（預設為 false）：

```json
{
    "Biomes": [
        {
            "Parent": "BiomeBase",
            "ID": "DeepOcean",
            "Name": "深海",
            "Graphic": {
                "GraphicType": "Single",
                "SpritePath": "Images/WorldTiles/DeepOcean"
            }
        }
    ]
}
```

### 情境 3：新增污染變體

繼承 `PollutedLand` 並覆蓋視覺：

```json
{
    "Biomes": [
        {
            "Parent": "PollutedLand",
            "ID": "PollutedIceLand",
            "Name": "汙染區",
            "Graphic": {
                "GraphicType": "Single",
                "SpritePath": "Images/WorldTiles/PollutedIce"
            },
            "BaseTerrainTile": "PollutedSnow"
        }
    ]
}
```

### 情境 4：極端氣候區域

設定極端溫度（冰原範例）：

```json
{
    "Biomes": [
        {
            "Parent": "LandableForestSample",
            "ID": "Ice",
            "Name": "冰原",
            "Graphic": {
                "GraphicType": "Single",
                "SpritePath": "Images/WorldTiles/Ice"
            },
            "OverrideHillGraphic": {
                "GraphicType": "Single",
                "SpritePath": "Images/WorldTiles/IceHill"
            },
            "OverrideMountainGraphic": {
                "GraphicType": "Single",
                "SpritePath": "Images/WorldTiles/IceMountain"
            },
            "TemperatureData": {
                "Average": -20,
                "Difference": 5
            },
            "BaseTerrainTile": "Snow",
            "RockTerrainTile": "SnowRock",
            "WaterTerrainTile": "SnowWater",
            "PlantDensity": 0.03,
            "WildPlants": [
                { "ID": "SnowPineTree", "Weight": 10 },
                { "ID": "SnowCottonTree", "Weight": 1 }
            ],
            "Animals": [
                "Inherit",
                { "ID": "Penguin", "Weight": 10 },
                { "ID": "SnowRabbit", "Weight": 10 }
            ]
        }
    ]
}
```

---

## 生態區分布與難度

根據設計文件，生態區依據距離中心的遠近分布於不同難度環：

| 難度層級 | 距離 | 生態區 | 資源等級 |
|----------|------|--------|----------|
| Layer 0 | 0-4 | Woodland（森林） | Tier 1：木材、石頭、銅 |
| Layer 1 | 5-9 | Grassland（草原）、BorealForest（針葉林） | Tier 1.5：+煤、鐵 |
| Layer 2 | 10-14 | Savanna（疏林草原）、Swamp（沼澤）、Tundra（苔原） | Tier 2：+銀、硬木、藥草 |
| Layer 3 | 15+ | Desert（沙漠）、Ice（冰原） | Tier 3：+金、鑽石、水晶 |
| 特殊 | 散布 | PollutedLand（污染區域） | Tier 4：變異資源 |

---

## 常見問題

### Q: 如何讓生態區擁有敵對動物？
A: 設定 `"AnimalIsMonster": true`，該區域生成的動物會被視為敵對怪物。

### Q: 植物/動物密度設多少合適？
A:
- 植物密度：一般區域 `0.1-0.2`，沙漠等稀疏區域 `0.01-0.03`
- 動物密度：一般 `0.005-0.01`

### Q: 如何設定多種地形覆蓋？
A: 在 `TerrainPatches` 陣列中添加多個區塊，每個區塊可以有不同的噪聲範圍和瓦片：

```json
"TerrainPatches": [
    {
        "Tiles": [
            { "MinValue": 0.6, "MaxValue": 1, "Tile": "Grass" },
            { "MinValue": 0.3, "MaxValue": 0.6, "Tile": "DryGrass" }
        ]
    }
]
```

### Q: 為什麼我的資源沒有生成？
A: 檢查以下幾點：
1. 確認 `Landable` 為 `true`（或繼承自可登陸基底）
2. 確認密度值不是 0
3. 確認引用的資源 ID 存在於對應的資料表中

### Q: 如何讓子資料完全覆蓋父資料的陣列？
A: 不使用 `"Inherit"`，直接定義新陣列即可完全覆蓋。

---

## 相關資料

- [Items 物品資料](/docs/data-types/items) - WildPlants 引用的物品
- [Characters 角色資料](/docs/data-types/characters) - Animals 引用的角色
- [SceneObjects 場景物件](/docs/data-types/scene-objects) - SceneObjects 引用的物件
- [Tiles 瓦片資料](/docs/data-types/tiles) - 地形瓦片定義
