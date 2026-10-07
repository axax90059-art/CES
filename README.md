# FIH Automotive · CES 2027 展會網站 — v2（專業版）

## 在 VS Code 開啟
1. VS Code → File → Open Folder → 選 `D:\FIH\網站\website-v2`
2. 安裝擴充套件 **Live Server**（作者 Ritwick Dey）
3. 在 `index.html` 按右鍵 → **Open with Live Server**，瀏覽器會自動開啟並即時更新

## 檔案結構
```
website-v2/
├─ index.html          頁面結構（Banner → About → 產品 → Find Us 攤位圖＋Google 地圖）
├─ css/fonts.css       本機字型設定（離線可用）
├─ css/style.css       所有樣式與動畫
├─ js/products.js      產品資料（名稱 / 分類 / 圖片 / 規格標籤 specs / 說明）← 改產品改這裡
├─ js/main.js          背景動畫、輪播、倒數、攤位圖彈窗與放大檢視
├─ tools/fix-svg.js    Illustrator 匯出 SVG 修正工具（見下方說明）
└─ assets/
   ├─ fonts/              Google 開源字型檔 .woff2（SIL OFL 授權）
   ├─ banner-desktop.svg  橫版 Banner（電腦）
   ├─ banner-mobile.svg   直版 Banner（手機 767px 以下）
   ├─ map.svg             攤位平面圖
   ├─ logo.svg / fihlogo.svg
   └─ products/p01.png … p19.png
```

## 常見修改
| 要改什麼 | 在哪裡 |
|---|---|
| 新增 / 修改產品 | `js/products.js` |
| 換產品圖 | 覆蓋 `assets/products/pXX.png`（去背 PNG，最長邊約 900px），**同時**覆蓋縮圖 `assets/products/thumb/pXX.png`（最長邊約 200px），再把 `js/products.js` 裡該圖的 `?v=` 改一下 |
| 活動時間（倒數計時，拉斯維加斯時間） | `js/main.js` 最上方 `EVENT_START` / `EVENT_END` |
| 自動輪播速度 | `js/main.js` 的 `AUTOPLAY_MS` |
| 攤位圖 | 覆蓋 `assets/map.svg`（點圖可放大檢視） |
| Banner | 覆蓋 `assets/banner-desktop.svg`、`assets/banner-mobile.svg`，再執行 `node tools/fix-svg.js` |
| 主色 | `css/style.css` 最上方 `:root` 的 `--accent` / `--accent-2` |

## 字型（離線可用）
字型檔已放在 `assets/fonts/`，由 `css/fonts.css` 載入，不需要網路。
全部是 Google Fonts 開源字型（SIL Open Font License，可免費商用）。

## 開場攤位圖彈窗
- 一打開網頁約 0.6 秒後，攤位圖以懸浮視窗彈出
- 按 ✕、Esc 或點地圖以外的地方即可關閉
- 不想自動彈出：刪掉 `js/main.js` 裡的 `setTimeout(openMap, 600);` 這一行

## 地圖懸浮按鈕
- 畫面右側（手機在右下角）固定一顆「MAP」按鈕，任何時候點了都會跳出攤位圖

## 從 Illustrator 重新匯出 Banner 後（重要）
Illustrator 匯出的 SVG 有兩個問題：套了「陰影」的產品圖在網頁上會消失、檔案會夾帶好幾 MB 的編輯資料。
匯出並覆蓋 `assets/banner-desktop.svg`、`assets/banner-mobile.svg` 後，在 VS Code 終端機（Ctrl + `）執行：

```
node tools/fix-svg.js
```

- 會自動修正陰影範圍、移除編輯資料；原檔備份在 `tools/backup/`
- 重複執行也沒關係，已修好的檔案會顯示「不需要修正」
- 只修某個檔案：`node tools/fix-svg.js assets/map.svg`

## Google 地圖
- 「Find Us」區的場地資訊卡內嵌 Google 地圖：300 Convention Center Dr, Las Vegas, NV 89109, USA
- 「Open in Google Maps」開 Google 地圖；「Directions」直接導航；「Open full-size floor plan」看攤位平面圖
- 地圖需要網路才會顯示
