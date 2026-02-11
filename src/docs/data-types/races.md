# Races 種族資料

種族資料定義了角色的外觀系統，包括身體部位的組合、顏色變化、腳步聲音效，以及命名規則。每個角色都會引用一個種族來決定其視覺呈現方式。

## 概覽

- **JSON 檔案位置**：`Assets/StreamingAssets/GameDefines/Races/`
- **C# 類別**：`RaceData` ([RaceData.cs](Assets/Scripts/Engine/Character/RaceData.cs))
- **資料總數**：約 25 筆

## 快速範例

最簡單的種族定義（簡單圖形模式）：

```json
{
  "Races": [
    {
      "ID": "Mech",
      "Name": "機械",
      "SimpleGraphic": true,
      "BodyParts": [
        {
          "ID": "Base",
          "Name": "型號",
          "SpriteLayer": "Base",
          "Items": [
            {
              "ID": "SpiderMech",
              "SpritePath": "Images/Character/Mechs/SpiderMech"
            }
          ]
        }
      ]
    }
  ]
}
```

## 欄位說明

### 基本欄位

| 欄位 | 類型 | 必填 | 說明 |
|------|------|------|------|
| ID | string | ✅ | 唯一識別碼 |
| Name | string | | 種族顯示名稱 |
| Parent | string | | 繼承的父種族 ID |
| SimpleGraphic | bool | | `true` 表示使用簡單圖形模式（單一精靈），預設為 `false` |
| BaseCharacter | string | | 關聯的基礎角色 ID（用於特定角色模板） |

### 核心欄位

| 欄位 | 類型 | 說明 |
|------|------|------|
| BodyParts | RaceBodyPart[] | 身體部位定義陣列 |
| ColorChannels | ColorChannels[] | 顏色通道定義陣列 |
| Audios | RaceAudiosData | 音效資料（腳步聲等） |

### 命名系統欄位

| 欄位 | 類型 | 說明 |
|------|------|------|
| NameLibrary | string[] | 預設名字列表（直接隨機選擇） |
| NamePools | NamePools | 組合式命名（前綴+核心+後綴） |

### 進階欄位

| 欄位 | 類型 | 說明 |
|------|------|------|
| OverrideSpriteLayers | CharacterSpriteLayer[] | 覆蓋精靈圖層的繪製順序 |

---

## BodyParts 身體部位

身體部位定義了角色外觀的各個組成部分。每個部位可以有多個外觀選項（Items），系統會依據權重隨機選擇。

### RaceBodyPart 結構

| 欄位 | 類型 | 必填 | 說明 |
|------|------|------|------|
| ID | string | ✅ | 部位識別碼（如 `"Body"`, `"Head"`, `"Eyes"`） |
| Name | string | | 部位顯示名稱 |
| SpriteLayer | string | ✅ | 對應的精靈圖層名稱 |
| Items | RaceBodyPartItem[] | ✅ | 該部位可用的外觀選項 |

### RaceBodyPartItem 結構

| 欄位 | 類型 | 必填 | 說明 |
|------|------|------|------|
| ID | string | ✅ | 外觀選項識別碼 |
| SpritePath | string | ✅ | Resources 相對路徑 |
| SpawnWeight | int | | 生成權重（預設為 0，數值越大越容易被選中） |
| Abilities | string[] | | 該外觀提供的技能 ID 列表 |

### 常見身體部位 ID

| 部位 ID | 用途 | 圖層名稱 |
|---------|------|----------|
| Base | 基礎/完整身體（簡單圖形用） | Base |
| Body | 身體軀幹 | Body |
| Head | 頭部 | Head |
| Eyes | 眼睛 | Eyes |
| Ears | 耳朵 | Ears |
| Tail | 尾巴 | Tail |
| Hair | 髮型 | Hair |
| Outfit | 服裝 | UpperBody |

### 範例：動物種族的身體部位

```json
"BodyParts": [
  {
    "ID": "Body",
    "Name": "身體",
    "SpriteLayer": "Body",
    "Items": [
      {
        "ID": "Share_Body_Normal_Solid",
        "SpritePath": "Images/Character/Body/Bear_Bird_Cat.../Share_Body_Normal_Solid",
        "SpawnWeight": 10
      },
      {
        "ID": "Share_Body_Normal_Tuxedo",
        "SpritePath": "Images/Character/Body/Bear_Bird_Cat.../Share_Body_Normal_Tuxedo",
        "SpawnWeight": 10
      }
    ]
  },
  {
    "ID": "Head",
    "Name": "頭部",
    "SpriteLayer": "Head",
    "Items": [
      {
        "ID": "Wolf_Head_Solid",
        "SpritePath": "Images/Character/Head/Wolf_Head_Solid",
        "SpawnWeight": 10
      }
    ]
  }
]
```

### 範例：帶技能的身體部位

某些外觀可以附帶特定技能，例如機械種族的武裝頭部：

```json
{
  "ID": "Head",
  "Name": "頭部",
  "SpriteLayer": "Head",
  "Items": [
    {
      "ID": "Mech_LeggedRocky_Head_001",
      "SpritePath": "Images/Character/Monsters/Mech/Mech_LeggedRocky/Head/Mech_LeggedRocky_Head_001",
      "SpawnWeight": 1,
      "Abilities": ["ShootWithDelay"]
    },
    {
      "ID": "Mech_LeggedRocky_Head_004",
      "SpritePath": "Images/Character/Monsters/Mech/Mech_LeggedRocky/Head/Mech_LeggedRocky_Head_004",
      "SpawnWeight": 10
    }
  ]
}
```

---

## ColorChannels 顏色通道

顏色通道系統使用 Mask 遮罩技術為角色著色，讓同一張精靈圖可以呈現出多種顏色變化。

### ColorChannels 結構

| 欄位 | 類型 | 說明 |
|------|------|------|
| Parts | string | 適用的部位列表（逗號分隔，如 `"Body,Head,Ears"`) |
| Colors | MaskColorDefineData[] | 可用的顏色組合 |

### MaskColorDefineData 結構

| 欄位 | 類型 | 說明 |
|------|------|------|
| ChannelR | string | R 通道替換顏色（主色，Hex 格式如 `"#C57240FF"`） |
| ChannelG | string | G 通道替換顏色（副色） |
| ChannelB | string | B 通道替換顏色 |
| ChannelA | string | A 通道替換顏色 |
| SpawnWeight | float | 生成權重 |

### 顏色通道原理

精靈圖使用特殊的 Mask 遮罩繪製技術：
- 原圖中的 **紅色區域** 會被替換為 `ChannelR` 指定的顏色
- 原圖中的 **綠色區域** 會被替換為 `ChannelG` 指定的顏色
- 以此類推...

這樣同一張身體精靈圖就可以呈現不同的毛色、膚色等變化。

### 範例：多部位同色

讓身體、頭部、耳朵、尾巴使用相同的顏色：

```json
"ColorChannels": [
  {
    "Parts": "Body,Head,Ears,Tail",
    "Colors": [
      {
        "ChannelR": "#C57240FF",
        "ChannelG": "#E0C087FF",
        "SpawnWeight": 5
      },
      {
        "ChannelR": "#434343FF",
        "ChannelG": "#D5D5D5FF",
        "SpawnWeight": 5
      },
      {
        "ChannelR": "#F7F7EFFF",
        "SpawnWeight": 5
      }
    ]
  }
]
```

### 範例：不同部位獨立配色

眼睛和頭髮使用獨立的顏色系統：

```json
"ColorChannels": [
  {
    "Parts": "Body,Head",
    "Colors": [
      { "ChannelR": "#f2e0d0ff", "SpawnWeight": 10 },
      { "ChannelR": "#8e6847ff", "SpawnWeight": 10 }
    ]
  },
  {
    "Parts": "Eyes",
    "Colors": [
      { "ChannelR": "#191919ff", "SpawnWeight": 10 },
      { "ChannelR": "#2a5180ff", "SpawnWeight": 10 }
    ]
  },
  {
    "Parts": "Hair",
    "Colors": [
      { "ChannelR": "#e88a8aff", "SpawnWeight": 10 },
      { "ChannelR": "#644134", "SpawnWeight": 10 }
    ]
  }
]
```

---

## Audios 音效

定義種族特有的音效，目前主要用於腳步聲。

### RaceAudiosData 結構

| 欄位 | 類型 | 說明 |
|------|------|------|
| Footsteps | FootstepData[] | 腳步聲音效列表 |

### FootstepData 結構

| 欄位 | 類型 | 說明 |
|------|------|------|
| AudioClipPath | string | 音效檔案的 Resources 路徑 |
| Tag | string | 環境標籤（空白表示預設音效） |
| Volume | float | 音量（0-1） |
| PitchMin | float | 音調最小值 |
| PitchMax | float | 音調最大值（與 Min 相同則固定音調） |
| StartDelaySecond | float | 開始延遲（秒） |
| RepeatIntervalSecond | float | 重複間隔（秒），-1 表示不重複 |

### 環境音效標籤

不同地形有不同的腳步聲效果：

| 標籤 | 說明 |
|------|------|
| （空白） | 預設/通用腳步聲 |
| Grass | 草地 |
| Sand | 沙地 |
| Dirt | 泥土 |
| Rock | 岩石 |

### 範例

```json
"Audios": {
  "Footsteps": [
    {
      "AudioClipPath": "AudioAssets/SFX/FootStep/footstep_grass_run_05",
      "Tag": "",
      "Volume": 0.1,
      "PitchMin": 0.5,
      "PitchMax": 1,
      "StartDelaySecond": 0.3,
      "RepeatIntervalSecond": 0.5
    },
    {
      "AudioClipPath": "AudioAssets/SFX/FootStep/footstep_sand_run_03",
      "Tag": "Sand",
      "Volume": 0.1,
      "PitchMin": 0.5,
      "PitchMax": 1,
      "StartDelaySecond": 0.3,
      "RepeatIntervalSecond": 0.5
    }
  ]
}
```

---

## 命名系統

種族可以定義角色的命名規則，有兩種方式：

### NameLibrary（名字庫）

直接提供預設名字列表，系統會隨機選取一個：

```json
"NameLibrary": [
  "花花", "小花", "奶茶", "橘子", "綿綿",
  "露西", "奇奇", "咪咪", "雪球", "喵喵"
]
```

### NamePools（組合式命名）

透過前綴、核心、後綴三部分組合生成名字：

| 欄位 | 說明 | 範例 |
|------|------|------|
| PrefixName | 前綴名 | 小、大、阿、月、夜 |
| CoreName | 核心名 | 狼、牙、尾、嚎、松 |
| SuffixName | 後綴名 | 子、仔、兒、寶、醬 |

生成範例：`小` + `狼` + `子` = `小狼子`

```json
"NamePools": {
  "PrefixName": ["小", "大", "阿", "月", "夜", "夢", "風"],
  "CoreName": ["狼", "牙", "尾", "嚎", "霜步", "野歌", "月影"],
  "SuffixName": ["子", "仔", "兒", "寶", "醬", "丸", ""]
}
```

> **注意**：後綴可以包含空字串 `""`，這樣有機會生成不帶後綴的名字。

---

## 圖形模式

### 複雜圖形模式（預設）

- 適用於：玩家角色、居民、NPC 等需要豐富外觀變化的角色
- 特點：多個身體部位分開繪製，可以獨立變化
- 範例種族：Human、Wolf、Cat、Dog 等

### 簡單圖形模式（SimpleGraphic = true）

- 適用於：怪物、野生動物等不需要複雜外觀變化的角色
- 特點：只使用一個 `Base` 部位，整個角色為單一精靈圖
- 範例種族：Monster、Mech

```json
{
  "ID": "Monster",
  "Name": "怪物",
  "SimpleGraphic": true,
  "BodyParts": [
    {
      "ID": "Base",
      "Name": "種類",
      "SpriteLayer": "Base",
      "Items": [
        { "ID": "Bear", "SpritePath": "Images/Character/Monsters/Bear" },
        { "ID": "WildBoar", "SpritePath": "Images/Character/Monsters/32x32/WildBoar" }
      ]
    }
  ]
}
```

---

## 使用情境

### 情境 1：創建新的動物種族

完整的動物種族，包含身體、頭部、眼睛、耳朵、尾巴、頭髮：

```json
{
  "ID": "Fox",
  "Name": "狐狸",
  "BodyParts": [
    {
      "ID": "Body",
      "Name": "身體",
      "SpriteLayer": "Body",
      "Items": [
        {
          "ID": "Share_Body_Normal_Solid",
          "SpritePath": "Images/Character/Body/Share_Body_Normal_Solid",
          "SpawnWeight": 10
        }
      ]
    },
    {
      "ID": "Head",
      "Name": "頭部",
      "SpriteLayer": "Head",
      "Items": [
        {
          "ID": "Fox_Head_Solid",
          "SpritePath": "Images/Character/Head/Fox_Head_Solid",
          "SpawnWeight": 10
        }
      ]
    },
    {
      "ID": "Eyes",
      "Name": "眼睛",
      "SpriteLayer": "Eyes",
      "Items": [
        { "ID": "Eyes_Normal", "SpritePath": "Images/Character/Eyes/Eyes_Normal", "SpawnWeight": 50 },
        { "ID": "Eyes_Slit", "SpritePath": "Images/Character/Eyes/Eyes_Slit", "SpawnWeight": 10 }
      ]
    },
    {
      "ID": "Ears",
      "Name": "耳朵",
      "SpriteLayer": "Ears",
      "Items": [
        { "ID": "Fox_Ear_Long", "SpritePath": "Images/Character/Ears/Fox_Ear_Long", "SpawnWeight": 10 }
      ]
    },
    {
      "ID": "Tail",
      "Name": "尾巴",
      "SpriteLayer": "Tail",
      "Items": [
        { "ID": "Fox_Tail_Fluffy", "SpritePath": "Images/Character/Tail/Fox_Tail_Fluffy", "SpawnWeight": 10 }
      ]
    }
  ],
  "ColorChannels": [
    {
      "Parts": "Body,Head,Ears,Tail",
      "Colors": [
        { "ChannelR": "#CD6144ff", "ChannelG": "#f8f2e8ff", "SpawnWeight": 10 },
        { "ChannelR": "#F7F7EFFF", "SpawnWeight": 5 }
      ]
    },
    {
      "Parts": "Eyes",
      "Colors": [
        { "ChannelR": "#191919ff", "SpawnWeight": 50 },
        { "ChannelR": "#a96a27ff", "SpawnWeight": 10 }
      ]
    }
  ],
  "NameLibrary": ["小狐", "紅紅", "毛毛", "橘子"],
  "NamePools": {
    "PrefixName": ["小", "大", "阿"],
    "CoreName": ["狐", "尾", "毛"],
    "SuffixName": ["子", "兒", ""]
  }
}
```

### 情境 2：創建簡單圖形怪物種族

適合野生怪物，只需單一精靈圖：

```json
{
  "ID": "Slime",
  "Name": "史萊姆",
  "SimpleGraphic": true,
  "BodyParts": [
    {
      "ID": "Base",
      "Name": "類型",
      "SpriteLayer": "Base",
      "Items": [
        { "ID": "Slime_Green", "SpritePath": "Images/Character/Monsters/Slime_Green", "SpawnWeight": 10 },
        { "ID": "Slime_Blue", "SpritePath": "Images/Character/Monsters/Slime_Blue", "SpawnWeight": 5 },
        { "ID": "Slime_Red", "SpritePath": "Images/Character/Monsters/Slime_Red", "SpawnWeight": 2 }
      ]
    }
  ]
}
```

### 情境 3：特殊種族（帶 BaseCharacter）

某些種族會關聯到特定的角色模板：

```json
{
  "ID": "Mech_LeggedRocky",
  "Name": "機械步行小石",
  "BaseCharacter": "MechRockyBase",
  "SimpleGraphic": true,
  "BodyParts": [
    {
      "ID": "Base",
      "Name": "身體",
      "SpriteLayer": "Base",
      "Items": [
        {
          "ID": "Mech_LeggedRocky_Base_001",
          "SpritePath": "Images/Character/Monsters/Mech/Mech_LeggedRocky/Base/Mech_LeggedRocky_Base_001",
          "SpawnWeight": 10
        }
      ]
    },
    {
      "ID": "Head",
      "Name": "頭部",
      "SpriteLayer": "Head",
      "Items": [
        {
          "ID": "Mech_LeggedRocky_Head_001",
          "SpritePath": "Images/Character/Monsters/Mech/Mech_LeggedRocky/Head/Mech_LeggedRocky_Head_001",
          "SpawnWeight": 1,
          "Abilities": ["ShootWithDelay"]
        }
      ]
    }
  ],
  "ColorChannels": [
    {
      "Parts": "Base,Head",
      "Colors": [
        { "ChannelR": "#CD6144ff", "ChannelG": "#f8f2e8ff", "SpawnWeight": 5 },
        { "ChannelR": "#505050ff", "ChannelG": "#f8f2e8ff", "SpawnWeight": 2 }
      ]
    }
  ]
}
```

---

## 完整範例：Human 種族

以下是人類種族的完整定義，展示所有功能的使用：

```json
{
  "ID": "Human",
  "Name": "人",
  "BodyParts": [
    {
      "ID": "Body",
      "Name": "身體",
      "SpriteLayer": "Body",
      "Items": [
        {
          "ID": "Human_Body_Normal",
          "SpritePath": "Images/Character/Body/Human_Body_Normal",
          "SpawnWeight": 10
        }
      ]
    },
    {
      "ID": "Head",
      "Name": "頭部",
      "SpriteLayer": "Head",
      "Items": [
        {
          "ID": "Human_Head_Solid",
          "SpritePath": "Images/Character/Head/Human_Head_Solid",
          "SpawnWeight": 10
        }
      ]
    },
    {
      "ID": "Hair",
      "Name": "髮型",
      "SpriteLayer": "Hair",
      "Items": [
        { "ID": "Hair_001", "SpritePath": "Images/Character/Hair/Hair_001", "SpawnWeight": 10 },
        { "ID": "Hair_002", "SpritePath": "Images/Character/Hair/Hair_002", "SpawnWeight": 10 },
        { "ID": "Hair_003", "SpritePath": "Images/Character/Hair/Hair_003", "SpawnWeight": 10 }
      ]
    },
    {
      "ID": "Eyes",
      "Name": "眼睛",
      "SpriteLayer": "Eyes",
      "Items": [
        { "ID": "Eyes_Normal", "SpritePath": "Images/Character/Eyes/Eyes_Normal", "SpawnWeight": 10 },
        { "ID": "Eyes_Big", "SpritePath": "Images/Character/Eyes/Eyes_Big", "SpawnWeight": 10 }
      ]
    }
  ],
  "ColorChannels": [
    {
      "Parts": "Body,Head",
      "Colors": [
        { "ChannelR": "#f2e0d0ff", "SpawnWeight": 10 },
        { "ChannelR": "#e0b89fff", "SpawnWeight": 10 },
        { "ChannelR": "#8e6847ff", "SpawnWeight": 10 }
      ]
    },
    {
      "Parts": "Eyes",
      "Colors": [
        { "ChannelR": "#191919ff", "SpawnWeight": 10 },
        { "ChannelR": "#2a5180ff", "SpawnWeight": 10 }
      ]
    },
    {
      "Parts": "Hair",
      "Colors": [
        { "ChannelR": "#e88a8aff", "SpawnWeight": 10 },
        { "ChannelR": "#644134", "SpawnWeight": 10 },
        { "ChannelR": "#4d4d4d", "SpawnWeight": 10 }
      ]
    }
  ],
  "Audios": {
    "Footsteps": [
      {
        "AudioClipPath": "AudioAssets/SFX/FootStep/footstep_grass_run_05",
        "Tag": "",
        "Volume": 0.1,
        "PitchMin": 0.5,
        "PitchMax": 1,
        "StartDelaySecond": 0.3,
        "RepeatIntervalSecond": 0.5
      }
    ]
  }
}
```

---

## 常見問題

### Q: SimpleGraphic 應該什麼時候設為 true？
A: 當角色不需要多部位組合外觀時（如怪物、野生動物），設為 `true` 可以簡化設定。這類角色通常只有一個 `Base` 部位，整個角色由單一精靈圖呈現。

### Q: SpawnWeight 是如何運作的？
A: `SpawnWeight` 是生成權重，數值越大該選項被選中的機率越高。例如權重為 50 的選項被選中的機率是權重為 10 的選項的 5 倍。

### Q: ColorChannels 的 Parts 可以重疊嗎？
A: 不建議。每個身體部位應該只屬於一個 ColorChannels，否則可能造成顏色選擇衝突。

### Q: NameLibrary 和 NamePools 可以同時使用嗎？
A: 可以。系統會優先使用 NameLibrary（如果有的話），NamePools 則作為補充的組合式命名系統。

### Q: BaseCharacter 有什麼用？
A: `BaseCharacter` 指定該種族關聯的角色模板 ID。當使用該種族生成角色時，會參考該角色模板的設定（如基礎屬性、技能等）。

### Q: 如何讓某個外觀帶有特殊技能？
A: 在 BodyPartItem 的 `Abilities` 欄位中指定技能 ID 列表。擁有該外觀的角色會自動獲得這些技能。

---

## 現有種族列表

### 智慧種族（複雜圖形）

| ID | 名稱 | 用途 |
|----|------|------|
| Human | 人 | 玩家、人類 NPC |
| Wolf | 狼 | 狼人居民 |
| Meowian | 貓 | 貓人居民 |
| Dog | 狗 | 狗人居民 |
| Bear | 熊 | 熊人居民 |
| Yi | 太陽人 | 特殊種族 |
| Robots | 機械 | 機器人角色 |

### 怪物種族（簡單圖形）

| ID | 名稱 | 用途 |
|----|------|------|
| Monster | 怪物 | 通用野生怪物 |
| Mech | 機械 | 機械敵人 |
| Mech_LeggedRocky | 機械步行小石 | 特定機械敵人 |
| Mech_FlyingRocky | 機械飛行小石 | 特定機械敵人 |
| Mech_LeggedSpider | 機械蜘蛛 | 特定機械敵人 |

---

## 檔案組織結構

```
Assets/StreamingAssets/GameDefines/Races/
├── Human.json          # 人類
├── Wolf.json           # 狼
├── Cat.json            # 貓（Meowian）
├── Dog.json            # 狗
├── Bear.json           # 熊
├── Bird.json           # 鳥
├── Cow.json            # 牛
├── Deer.json           # 鹿
├── Elephant.json       # 象
├── Fox.json            # 狐狸
├── Frog.json           # 青蛙
├── Hamster.json        # 倉鼠
├── Lizard.json         # 蜥蜴
├── Pig.json            # 豬
├── Rat.json            # 鼠
├── Tiger.json          # 虎
├── Yi.json             # 太陽人
├── Robot.json          # 機器人
├── Zombie.json         # 殭屍
├── Monsters.json       # 通用怪物（多種）
├── Monsters_QuadrupedalLarge.json
├── Monsters_QuadrupedalSmall.json
├── Mech.json           # 機械
├── Mech_LeggedRocky.json
├── Mech_FlyingRocky.json
├── Mech_LeggedSpider.json
└── Isabelle.json       # 特殊角色
```

---

## 相關資料

- [Characters 角色資料](/docs/data-types/characters) - 角色會引用種族資料
- [資料類型總覽](/docs/data-types/) - 其他資料類型
