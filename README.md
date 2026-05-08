# Maison Aurelia Demo

高端精品燕窩購物品牌官網的業主展示版，採用 Next.js + TypeScript + Tailwind CSS + Framer Motion 建置，包含品牌前台、下單 API、mock 訂單儲存與 `/admin/orders` 簡易後台。

## 品牌定位

- 英文品牌名：`Maison Aurelia`
- 中文品牌名：`奧蕾雅燕禮`
- 英文 slogan：`Curated Bird's Nest Gifts with Quiet Splendor`
- 中文 slogan：`以燕為禮，將珍稀與風雅妥帖收藏`

## 技術棧

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Local JSON mock order storage for demo / preview use

## 內容來源

- 名片視覺：`public/assets/brand/brand-card.jpg`
- 影片素材：`public/assets/video/hero-film.mp4`
- 商品與分類內容：`data/products.json`
- 聯絡資訊：`data/contact.json`
- FAQ：`data/faq.json`
- mock 訂單：`data/orders.json`

## 本機開發

```bash
npm install
cp .env.example .env.local
npm run dev
```

開發伺服器：

```bash
http://localhost:3000
```

## 品質檢查

```bash
npm run lint
npm run build
```

## 展示方式

這個 repo 先作為業主提案展示版使用，不綁定 Cloudflare Pages。

建議直接本機啟動展示：

```bash
npm install
cp .env.example .env.local
npm run dev
```

展示重點：

- 首頁品牌感與 Hero
- 商品分類與商品詳頁
- 下單表單流程
- `/admin/orders` 訂單後台

## 公開預覽網址

這個 demo repo 可部署到 GitHub Pages，網址會是：

`https://victoriac1122.github.io/maison-aurelia-gift-demo/`

注意：

- 這是靜態展示版
- 下單與 admin 訂單資料會以瀏覽器本地 mock mode 模擬
- 不會真的寫入遠端資料庫

## 後續正式版可擴充

若業主確認方向，之後可再把這份 demo 版升級到正式部署版，例如接 Supabase、Cloudflare Pages、正式網域與真實訂單流程。

## 目前待補資料

- `data/products.json` 中的正式商品價格
- `data/products.json` 中的最終商品名稱 / 規格 / 特色
- `data/contact.json` 中的 Instagram、地址、營業時間
- 若要正式上線，再補資料庫與部署平台設定
