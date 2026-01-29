const n=`# 快速入門\r
\r
歡迎使用 Game2022 DataWiki！這是一個遊戲資料百科全書，讓你可以瀏覽和學習遊戲中的所有資料定義。\r
\r
## 什麼是 DataWiki？\r
\r
DataWiki 是一個靜態網站，它會讀取遊戲專案中的 \`StreamingAssets\` 資料夾，自動顯示所有遊戲資料。\r
\r
你可以用它來：\r
- **瀏覽資料**：查看所有物品、角色、配方等定義\r
- **搜尋資料**：快速找到你需要的資料\r
- **學習結構**：了解每種資料類型的欄位和用法\r
\r
## 基本操作\r
\r
### 瀏覽資料\r
\r
1. 點擊左側選單的資料類型（如「物品」、「角色」）\r
2. 在表格中瀏覽所有資料\r
3. 點擊任一筆資料查看詳情\r
\r
### 搜尋資料\r
\r
1. 使用右上角的搜尋欄\r
2. 輸入關鍵字（ID、名稱或描述）\r
3. 在結果中找到你要的資料\r
\r
### 查看詳情\r
\r
在資料詳情頁面，你可以：\r
- 查看所有欄位的值\r
- 檢視原始 JSON\r
- 複製 JSON 到剪貼簿\r
\r
## 資料檔案位置\r
\r
遊戲資料存放在以下位置：\r
\r
\`\`\`\r
Assets/StreamingAssets/\r
├── GameDefines/      ← 遊戲資料 JSON\r
├── Images/           ← 遊戲圖像\r
├── AudioAssets/      ← 音效檔案\r
└── Languages/        ← 在地化文字\r
\`\`\`\r
\r
## 如何新增資料\r
\r
1. 找到對應的 JSON 檔案（例如 \`GameDefines/Items/\`）\r
2. 參考現有資料的格式\r
3. 新增你的資料\r
4. 執行 \`npm run build\` 更新網站\r
\r
## 下一步\r
\r
- [物品資料說明](/docs/data-types/items)\r
- [角色資料說明](/docs/data-types/characters)\r
- [配方資料說明](/docs/data-types/recipes)\r
`;export{n as default};
