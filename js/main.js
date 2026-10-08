/* =========================================================
   FIH Automotive – E/EA Solutions  |  v2 main script
   ========================================================= */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const REDUCE_MOTION = reduce;

  /* ---------- 設定 ---------- */
  // CES 2027：拉斯維加斯當地時間（PST, UTC−8）。開展時間如有變動，改這兩行即可
  const EVENT_START = new Date("2027-01-06T10:00:00-08:00");   // 1/6 開展
  const EVENT_END = new Date("2027-01-10T00:00:00-08:00");     // 1/9 展期結束（當天整天顯示 LIVE NOW）
  const AUTOPLAY_MS = 7000;

  /* ---------- Banner：視窗寬度跨過 767px 時，強制重新挑選橫版／直版 ---------- */
  const heroImg = $(".hero-banner img");
  const bannerMQ = matchMedia("(max-width: 767px)");
  bannerMQ.addEventListener("change", () => { heroImg.src = heroImg.getAttribute("src"); });

  /* =========================================================
     進入網站：Banner 淡入（已移除開場影片）
     ========================================================= */
  // 等網頁（Banner、字型）載入完，才開始背景動畫和產品圖下載，不跟第一屏搶網路
  const introDone = new Promise((r) => (document.readyState === "complete" ? r() : addEventListener("load", () => r(), { once: true })));
  setTimeout(() => document.body.classList.add("loaded"), 60);   // 稍等一下再加，讓 Banner 淡入動畫生效

  /* =========================================================
     Background — 靜態點陣網格 + 緩慢亮起的電路走線（不往前衝）
     ========================================================= */
  const cv = $("#bg");
  const ctx = cv.getContext("2d");
  const GAP = 36;                 // 網格間距
  let W = 0, H = 0, cols = 0, rows = 0, traces = [], dotLayer = null;

  function size() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(W / GAP) + 1; rows = Math.ceil(H / GAP) + 1;
    // 點陣只畫一次，存成離屏圖層
    dotLayer = document.createElement("canvas");
    dotLayer.width = W * dpr; dotLayer.height = H * dpr;
    const d = dotLayer.getContext("2d");
    d.scale(dpr, dpr);
    for (let x = 0; x < cols; x++) for (let y = 0; y < rows; y++) {
      d.fillStyle = "rgba(120,190,255,0.10)";
      d.fillRect(x * GAP - 0.75, y * GAP - 0.75, 1.5, 1.5);
    }
  }
  addEventListener("resize", size);
  size();

  // 產生一條沿網格走的直角折線
  function spawnTrace() {
    let x = (Math.random() * cols) | 0, y = (Math.random() * rows) | 0;
    const pts = [[x, y]];
    let dir = Math.random() < 0.5 ? 0 : 1;
    const segs = 2 + ((Math.random() * 3) | 0);
    for (let i = 0; i < segs; i++) {
      const len = (2 + Math.random() * 6) | 0, s = Math.random() < 0.5 ? -1 : 1;
      if (dir === 0) x += len * s; else y += len * s;
      pts.push([x, y]); dir ^= 1;
    }
    let total = 0;
    for (let i = 1; i < pts.length; i++) total += Math.abs(pts[i][0] - pts[i - 1][0]) + Math.abs(pts[i][1] - pts[i - 1][1]);
    traces.push({ pts, total, p: 0, life: 1, speed: 0.12 + Math.random() * 0.1 });
  }

  function pointAt(tr, dist) {
    const out = [tr.pts[0]];
    let left = dist;
    for (let i = 1; i < tr.pts.length; i++) {
      const [ax, ay] = tr.pts[i - 1], [bx, by] = tr.pts[i];
      const seg = Math.abs(bx - ax) + Math.abs(by - ay);
      if (left >= seg) { out.push([bx, by]); left -= seg; continue; }
      const k = left / seg;
      out.push([ax + (bx - ax) * k, ay + (by - ay) * k]);
      break;
    }
    return out;
  }

  let last = performance.now();
  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    ctx.clearRect(0, 0, W, H);

    // 柔和的藍色光暈（緩慢呼吸，不移動）
    const breathe = 0.16 + Math.sin(now / 4000) * 0.03;
    const g = ctx.createRadialGradient(W * 0.5, H * 0.35, 0, W * 0.5, H * 0.35, Math.max(W, H) * 0.7);
    g.addColorStop(0, `rgba(26,124,255,${breathe})`);
    g.addColorStop(1, "rgba(26,124,255,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    if (dotLayer.width && dotLayer.height) ctx.drawImage(dotLayer, 0, 0, W, H);   // 視窗縮放瞬間尺寸可能為 0，先跳過

    // 電路走線：慢慢畫出 → 停留 → 淡出
    if (traces.length < 7 && Math.random() < dt * 1.2) spawnTrace();
    traces = traces.filter((t) => t.life > 0);
    for (const t of traces) {
      if (t.p < 1) t.p = Math.min(1, t.p + dt * t.speed * (8 / t.total) * 2);
      else t.life -= dt * 0.35;
      const path = pointAt(t, t.p * t.total);
      ctx.strokeStyle = `rgba(63,208,255,${0.28 * t.life})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      path.forEach(([x, y], i) => (i ? ctx.lineTo(x * GAP, y * GAP) : ctx.moveTo(x * GAP, y * GAP)));
      ctx.stroke();
      // 起點與終點小方塊（像 PCB 焊點）
      const [sx, sy] = path[0], [ex, ey] = path[path.length - 1];
      ctx.fillStyle = `rgba(63,208,255,${0.45 * t.life})`;
      ctx.fillRect(sx * GAP - 2, sy * GAP - 2, 4, 4);
      if (t.p < 1) {
        const hg = ctx.createRadialGradient(ex * GAP, ey * GAP, 0, ex * GAP, ey * GAP, 10);
        hg.addColorStop(0, "rgba(200,240,255,0.8)");
        hg.addColorStop(1, "rgba(63,208,255,0)");
        ctx.fillStyle = hg;
        ctx.beginPath(); ctx.arc(ex * GAP, ey * GAP, 10, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.fillRect(ex * GAP - 2, ey * GAP - 2, 4, 4);
      }
    }
    if (!reduce) requestAnimationFrame(frame);
  }
  introDone.then(() => requestAnimationFrame(frame));   // 開場結束後才開始畫背景

  /* =========================================================
     Nav: scrolled state, progress bar, active section
     ========================================================= */
  const nav = $("#nav"), bar = $("#scrollBar");
  const onScroll = () => {
    nav.classList.toggle("scrolled", scrollY > 30);
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const navLinks = $$(".nav-links a");
  const secIO = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (e.isIntersecting) navLinks.forEach((a) => a.classList.toggle("active", a.dataset.sec === e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["about", "products", "floorplan"].forEach((id) => secIO.observe(document.getElementById(id)));

  /* ---------- Reveal ---------- */
  const revIO = new IntersectionObserver((es) => {
    es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); revIO.unobserve(e.target); } });
  }, { threshold: 0.12 });
  $$("[data-anim]").forEach((el) => revIO.observe(el));

  /* ---------- KPI counters ---------- */
  const cntIO = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, to = +el.dataset.count, t0 = performance.now();
      const dec = (el.dataset.count.split(".")[1] || "").length;   // 支援小數，例如 3.6
      const step = (now) => {
        const p = Math.min((now - t0) / 1800, 1);
        el.textContent = (to * (1 - Math.pow(1 - p, 4))).toFixed(dec);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      cntIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$("[data-count]").forEach((el) => cntIO.observe(el));

  /* ---------- Hero tilt ---------- */
  const banner = $("#heroBanner");
  if (!reduce && matchMedia("(hover: hover)").matches) {
    banner.addEventListener("mousemove", (e) => {
      const r = banner.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      banner.style.transform = `perspective(1400px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
    });
    banner.addEventListener("mouseleave", () => (banner.style.transform = ""));
  }

  /* ---------- Countdown ---------- */
  const cdLabel = $("#cdLabel"), cdValue = $("#cdValue");
  (function tick() {
    const now = new Date();
    if (now >= EVENT_END) { cdLabel.textContent = "STATUS"; cdValue.textContent = "Thank you for visiting"; return; }
    if (now >= EVENT_START) { cdLabel.textContent = "STATUS"; cdValue.textContent = "LIVE NOW"; setTimeout(tick, 30000); return; }
    let s = Math.floor((EVENT_START - now) / 1000);
    const d = Math.floor(s / 86400); s %= 86400;
    const h = Math.floor(s / 3600); s %= 3600;
    const m = Math.floor(s / 60); s %= 60;
    const p = (n) => String(n).padStart(2, "0");
    cdValue.textContent = `${d}d ${p(h)}:${p(m)}:${p(s)}`;
    setTimeout(tick, 1000);
  })();

  /* =========================================================
     Product stage
     ========================================================= */
  const stage = $("#stage");
  const el = {
    img: $("#pImg"), name: $("#pName"), cat: $("#pCat"), specs: $("#pSpecs"), desc: $("#pDesc"),
    idx: $("#pIdx"), total: $("#pTotal"), time: $("#timeBar"),
    tabs: $("#catTabs"), film: $("#filmstrip"),
  };
  const ALL = PRODUCTS.map((p, i) => ({ ...p, i }));
  let list = ALL, cur = -1, busy = false, timer = null, anim = null, activeCat = "ALL";

  const pad = (n) => String(n).padStart(2, "0");

  // Tabs（固定順序：ALL / TCU / HPC / ZCU / IVI / ADAS / Others；不在 MAIN_CATS 裡的分類，例如 Chassis / Security / Access，都歸到 Others）
  const MAIN_CATS = ["TCU", "HPC", "ZCU", "IVI", "ADAS"];
  const groupOf = (p) => (MAIN_CATS.includes(p.cat) ? p.cat : "Others");
  const counts = ALL.reduce((m, p) => ((m[groupOf(p)] = (m[groupOf(p)] || 0) + 1), m), {});
  const tabCats = ["ALL", ...MAIN_CATS.filter((c) => counts[c]), ...(counts.Others ? ["Others"] : [])];
  const tabLabel = (c) => c;   // 標籤顯示：ALL / TCU / HPC / ZCU / IVI / ADAS / Others
  el.tabs.innerHTML =
    tabCats.map((c) => `<button class="tab" role="tab" data-cat="${c}">${tabLabel(c)}</button>`).join("") +
    `<span class="tab-ink" aria-hidden="true"></span>`;
  const ink = $(".tab-ink", el.tabs);
  const moveInk = () => {
    const a = $(".tab.active", el.tabs);
    if (a) { ink.style.left = a.offsetLeft + "px"; ink.style.width = a.offsetWidth + "px"; }
  };
  addEventListener("resize", moveInk);
  el.tabs.addEventListener("click", (e) => { const b = e.target.closest(".tab"); if (b) setCategory(b.dataset.cat); });

  // Filmstrip
  // 縮圖：用 assets/products/thumb/ 裡的小圖（最長邊 200px），網頁載入完後一次載入
  // 換產品圖時記得也要更新小圖（README 有說明）
  const thumbOf = (src) => src.replace("assets/products/", "assets/products/thumb/");
  el.film.innerHTML = ALL.map((p) =>
    `<button class="film" data-i="${p.i}"><div class="film-img"><img data-src="${thumbOf(p.img)}" alt="" decoding="async" /></div><span>${p.name}</span></button>`
  ).join("");
  const films = $$(".film", el.film);
  introDone.then(() => $$("img[data-src]", el.film).forEach((im) => (im.src = im.dataset.src)));
  el.film.addEventListener("click", (e) => {
    const f = e.target.closest(".film"); if (!f) return;
    const k = list.findIndex((p) => p.i === +f.dataset.i);
    if (k >= 0) go(k, k > cur ? 1 : -1);
  });

  function setCategory(cat, scroll) {
    activeCat = cat;
    $$(".tab", el.tabs).forEach((t) => t.classList.toggle("active", t.dataset.cat === cat));
    const tab = $(".tab.active", el.tabs);
    tab && el.tabs.scrollTo({ left: tab.offsetLeft - 20, behavior: "smooth" });
    moveInk();
    list = (cat === "ALL" || cat === "All") ? ALL : ALL.filter((p) => groupOf(p) === cat);
    films.forEach((f) => f.classList.toggle("hidden", !list.some((p) => p.i === +f.dataset.i)));
    busy = false; cur = -1;
    stage.classList.remove("is-in", "is-out");
    go(0, 1, true);
    if (scroll) $("#products").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }

  function paint(dir) {
    const p = list[cur];
    stage.style.setProperty("--dir", dir);
    el.img.src = p.img; el.img.alt = p.name;
    // 預先載入下一個產品的大圖（只載一張），換頁時不會閃
    if (list.length > 1) { const nx = new Image(); nx.decoding = "async"; nx.src = list[(cur + 1) % list.length].img; }
    el.name.textContent = p.name;
    el.cat.textContent = p.cat.toUpperCase();   // 跟 GM 一樣用簡稱
    el.specs.innerHTML = p.specs.map((s) => `<li>${s}</li>`).join("");
    el.desc.textContent = p.desc;
    el.idx.textContent = pad(cur + 1);
    el.total.textContent = pad(list.length);
    films.forEach((f) => f.classList.toggle("active", +f.dataset.i === p.i));
    const af = films[p.i];
    el.film.scrollTo({ left: af.offsetLeft - el.film.clientWidth / 2 + af.clientWidth / 2, behavior: "smooth" });
  }

  let swapId = 0;   // 每次換頁的編號：避免上一次的計時器提早收掉這一次的動畫
  function go(n, dir = 1, instant = false) {
    if (busy || !list.length) return;
    n = (n + list.length) % list.length;
    if (n === cur) return;
    busy = true;
    stage.style.setProperty("--dir", dir);
    const swap = () => {
      const id = ++swapId;
      cur = n;
      stage.classList.remove("is-out");
      paint(dir);
      void stage.offsetWidth;
      stage.classList.add("is-in");
      setTimeout(() => (busy = false), 450);                 // 新產品出現後就能再按（連續點也不會沒反應）
      setTimeout(() => { if (id === swapId) stage.classList.remove("is-in"); }, 950);
      autoplay();
    };
    if (instant || reduce) return swap();
    stage.classList.remove("is-in");
    stage.classList.add("is-out");
    setTimeout(swap, 420);
  }
  const next = () => go(cur + 1, 1);
  const prev = () => go(cur - 1, -1);
  $("#nextBtn").addEventListener("click", next);
  $("#prevBtn").addEventListener("click", prev);

  // Autoplay（只在產品區在畫面內時播放）
  let inView = false;
  function autoplay() {
    clearTimeout(timer); anim?.cancel();
    if (list.length < 2) return;
    anim = el.time.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: AUTOPLAY_MS, easing: "linear", fill: "forwards" });
    timer = setTimeout(next, AUTOPLAY_MS);
    if (!inView || hovering) pause();
  }
  const pause = () => { clearTimeout(timer); anim?.pause(); };
  const resume = () => {
    if (!anim || list.length < 2 || !inView || hovering || document.hidden) return;
    anim.play();
    clearTimeout(timer);
    timer = setTimeout(next, Math.max(AUTOPLAY_MS - (anim.currentTime || 0), 0));
  };
  let hovering = false;
  stage.addEventListener("mouseenter", () => { hovering = true; pause(); });
  stage.addEventListener("mouseleave", () => { hovering = false; resume(); });
  document.addEventListener("visibilitychange", () => (document.hidden ? pause() : resume()));
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; inView ? resume() : pause(); }, { threshold: 0.3 }).observe(stage);

  // Keyboard
  addEventListener("keydown", (e) => {
    if (!inView) return;
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  // Swipe
  let sx = 0, sy = 0;
  stage.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  stage.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) (dx < 0 ? next : prev)();
  });

  // Product parallax on hover
  const wrap = $(".stage-img-wrap");
  const visual = $(".stage-visual");
  if (!reduce && matchMedia("(hover: hover)").matches) {
    visual.addEventListener("mousemove", (e) => {
      const r = visual.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      wrap.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg) translateZ(20px)`;
    });
    visual.addEventListener("mouseleave", () => (wrap.style.transform = ""));
  }

  /* =========================================================
     攤位圖：點擊放大檢視（再點圖片可切換原尺寸，方便看細節）
     ========================================================= */
  const lightbox = $("#lightbox"), lbScroll = $("#lightboxScroll");
  let lastFocus = null;
  const openMap = () => {
    lastFocus = document.activeElement;
    lightbox.hidden = false;
    document.body.classList.add("lightbox-on");
    void lightbox.offsetWidth;          // 強制重新排版，讓淡入動畫生效
    lightbox.classList.add("open");
    $("#lightboxClose").focus({ preventScroll: true });
  };
  const closeMap = () => {
    lightbox.classList.remove("open", "zoomed");
    document.body.classList.remove("lightbox-on");
    setTimeout(() => (lightbox.hidden = true), 350);
    if (lastFocus && lastFocus !== document.body) lastFocus.focus({ preventScroll: true });
  };
  $("#mapOpen").addEventListener("click", openMap);
  $("#mapFab").addEventListener("click", openMap);   // 右側懸浮按鈕
  $("#lightboxClose").addEventListener("click", closeMap);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox || e.target === lbScroll) closeMap(); });
  $("#lightboxImg").addEventListener("click", (e) => {
    const r = e.target.getBoundingClientRect();   // 先記下點擊位置（放大前）
    const fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
    const zoomed = lightbox.classList.toggle("zoomed");
    if (zoomed) {   // 以點擊位置為中心放大
      void lbScroll.offsetWidth;
      lbScroll.scrollLeft = fx * lbScroll.scrollWidth - lbScroll.clientWidth / 2;
      lbScroll.scrollTop = fy * lbScroll.scrollHeight - lbScroll.clientHeight / 2;
    }
  });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !lightbox.hidden) closeMap(); });

  // 一打開網頁：攤位圖以懸浮視窗彈出（不想看可按 ✕、Esc 或點旁邊關閉）
  setTimeout(openMap, 600);

  // Init
  setCategory("ALL");
  requestAnimationFrame(moveInk);
  document.fonts?.ready.then(moveInk);
})();
