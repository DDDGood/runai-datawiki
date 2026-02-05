# 快速入門

歡迎使用 Game2022 DataWiki！這是一個遊戲資料百科全書，讓你可以瀏覽和學習遊戲中的所有資料定義。

## 什麼是 DataWiki？

DataWiki 是一個靜態網站，它會讀取遊戲專案中的 `StreamingAssets` 資料夾，自動顯示所有遊戲資料。

你可以用它來：
- **瀏覽資料**：查看所有物品、角色、配方等定義
- **搜尋資料**：快速找到你需要的資料
- **學習結構**：了解每種資料類型的欄位和用法

## 基本操作

### 瀏覽資料

1. 點擊左側選單的資料類型（如「物品」、「角色」）
2. 在表格中瀏覽所有資料
3. 點擊任一筆資料查看詳情

### 搜尋資料

1. 使用右上角的搜尋欄
2. 輸入關鍵字（ID、名稱或描述）
3. 在結果中找到你要的資料

### 查看詳情

在資料詳情頁面，你可以：
- 查看所有欄位的值
- 檢視原始 JSON
- 複製 JSON 到剪貼簿

## 資料檔案位置

遊戲資料存放在以下位置：

```
Assets/StreamingAssets/
├── GameDefines/      ← 遊戲資料 JSON
├── Images/           ← 遊戲圖像
├── AudioAssets/      ← 音效檔案
└── Languages/        ← 在地化文字
```

## 如何新增資料

1. 找到對應的 JSON 檔案（例如 `GameDefines/Items/`）
2. 參考現有資料的格式
3. 新增你的資料
4. 執行 `npm run build` 更新網站

## 下一步

- [資料定義基礎](/docs/data-fundamentals) - **建議先讀！** 了解 ID、Parent 繼承、Inherit 陣列繼承等核心概念
- [物品資料說明](/docs/data-types/items)
- [角色資料說明](/docs/data-types/characters)
- [配方資料說明](/docs/data-types/recipes)
