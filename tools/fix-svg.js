/* =========================================================
   Illustrator 匯出 SVG 修正工具
   ---------------------------------------------------------
   用法（在 website-v2 資料夾開終端機）：
     node tools/fix-svg.js                       ← 修正 assets 裡的兩張 banner SVG
     node tools/fix-svg.js assets/banner-mobile.svg   ← 只修指定檔案

   會做兩件事：
   1. 修正「陰影（drop-shadow）」效果的作用範圍
      Illustrator 匯出時把範圍座標算錯，瀏覽器會把套了陰影的圖片整張裁掉（圖片消失）。
      改成「圖片本身 + 四周 20% 留白」，陰影效果不變、圖片正常顯示。
   2. 移除 Illustrator 私有編輯資料（i:aipgf）與 metadata
      瀏覽器用不到，常佔掉好幾 MB，移除後網頁載入快很多。

   原檔會先備份到 tools/backup/（檔名加上時間），不會遺失。
   ========================================================= */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const args = process.argv.slice(2);
const files = args.length
  ? args.map((f) => path.resolve(process.cwd(), f))
  : ["banner-desktop.svg", "banner-mobile.svg"]
      .map((f) => path.join(root, "assets", f))
      .filter((f) => fs.existsSync(f));

const backupDir = path.join(__dirname, "backup");
fs.mkdirSync(backupDir, { recursive: true });
const d = new Date(), p2 = (n) => String(n).padStart(2, "0");
const stamp = `${d.getFullYear()}${p2(d.getMonth() + 1)}${p2(d.getDate())}-${p2(d.getHours())}${p2(d.getMinutes())}`;   // 本地時間
const mb = (n) => (n / 1048576).toFixed(2) + " MB";

for (const file of files) {
  if (!fs.existsSync(file)) { console.log("找不到檔案：" + file); continue; }
  const before = fs.readFileSync(file, "utf8");
  let s = before;

  // 1) 陰影濾鏡範圍
  let filters = 0;
  s = s.replace(/<filter\b([^>]*)>/g, (tag, attrs) => {
    if (!/filterUnits="userSpaceOnUse"/.test(attrs)) return tag;
    const id = (attrs.match(/\bid="([^"]+)"/) || [])[1];
    if (!id) return tag;
    filters++;
    return `<filter id="${id}" x="-20%" y="-20%" width="140%" height="140%">`;
  });

  // 2) Illustrator 私有資料
  s = s
    .replace(/<i:aipgf\b[\s\S]*?<\/i:aipgf>/g, "")
    .replace(/<i:aipgfRef\b[^>]*\/>/g, "")
    .replace(/<metadata>[\s\S]*?<\/metadata>/g, "");

  if (s === before) { console.log(`✓ ${path.basename(file)}：不需要修正（${mb(before.length)}）`); continue; }

  const backup = path.join(backupDir, path.basename(file, ".svg") + "-" + stamp + ".svg");
  fs.writeFileSync(backup, before);
  fs.writeFileSync(file, s);
  console.log(`✓ ${path.basename(file)}：修正陰影範圍 ${filters} 個，${mb(before.length)} → ${mb(s.length)}（原檔備份：tools/backup/${path.basename(backup)}）`);
}
