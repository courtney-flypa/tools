# Mushrooom Tools

為 [tools.mushrooom.org](https://tools.mushrooom.org/) 準備的小工具目錄。靈感來自 [Simon Willison’s Tools](https://tools.simonwillison.net/)。

目前是空目錄；不放示範工具或尚未完成的工具。使用原生 HTML、CSS 與 JavaScript，沒有外部套件、字型服務、分析追蹤或資料庫。

## 本機使用

需要 Node.js 22 以上。無須安裝套件。

```sh
npm run check
npm run dev
```

開啟 http://127.0.0.1:4317。

## 新增一個工具

1. 把 `templates/tool.html` 複製到 `public/<slug>/index.html`，使用小寫英數與連字號命名。
2. 完成工具、用途說明、輸入檢查、手機版與鍵盤操作。範本本身不會上線。
3. 在 `public/tools.json` 加入一筆資料。只有完成的工具才能加入目錄。

```json
{
  "slug": "your-tool",
  "title": "工具名稱",
  "description": "這個工具解決什麼問題。",
  "category": "文字",
  "tags": ["文字", "整理"],
  "date": "2026-10-12"
}
```

4. 執行 `npm run check`，確認工具頁存在、欄位完整且網址不重複。
5. 推送到 `main`，由 Cloudflare Pages 的 Git 整合部署。

首頁會自動顯示工具，依日期新到舊排序，並產生搜尋和分類。空目錄時隱藏搜尋、分類，保留真實的空白狀態。

## Cloudflare Pages 設定

- GitHub repository: `courtney-flypa/tools`
- Production branch: `main`
- Framework preset: None
- Build command: `npm run build`
- Build output directory: `public`
- Node.js: 22 或以上
- Custom domain: `tools.mushrooom.org`

只發布 `public/`，不發布開發指引或工具範本。`404.html` 提供找不到頁面的狀態。部署完成後，仍需在 Pages 綁定自訂網域並確認 HTTPS 可用。
