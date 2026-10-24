# 越金燕 正式上線設定

照順序做完，網站就能真的收訂單、寄通知，並掛上 yue-jin-yan.com。
還沒做完以前，網站會以「展示模式」運作，訂單頁上方會清楚標示。

## 1. Supabase（訂單資料庫 + 後台登入）

1. 到 https://supabase.com 註冊並建立新專案（Region 選 Tokyo 或 Singapore）。
2. 左側 **SQL Editor** → 貼上 `supabase/schema.sql` 全部內容 → **Run**。
3. 左側 **Authentication → Users → Add user → Create new user**：
   輸入後台要用的 Email 與密碼，勾選 **Auto Confirm User**。
4. 回到 **SQL Editor** 執行（Email 換成上一步的帳號）：
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'yuejinyan.official@gmail.com'
   on conflict do nothing;
   ```
5. **Authentication → Sign In / Providers**：關閉「Allow new users to sign up」。
6. **Project Settings → API**：複製 **Project URL** 和 **Publishable key**（舊專案叫 anon public key）。
   ⚠️ 不要使用 `service_role` / secret key。

## 2. Web3Forms（新訂單寄 Email 通知）

到 https://web3forms.com 輸入要收通知的信箱（例如 yuejinyan.official@gmail.com），Access Key 會寄到該信箱。

## 3. 填入設定

把三個值填進 `.env.production`：

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxx
NEXT_PUBLIC_WEB3FORMS_KEY=xxxx-xxxx
```

這三個值本來就是公開金鑰，可以放進 Git。推上 GitHub 後會自動重新部署。

## 4. 網址 yue-jin-yan.com（已完成）

- 網域在 Namecheap（帳號：yuejinyan.official@gmail.com），已開自動續約。
- DNS：A 記錄 `@` → 185.199.108.153 / 109 / 110 / 111；CNAME `www` → `victoriac1122.github.io`；
  TXT `_github-pages-challenge-victoriac1122` 為 GitHub 網域驗證用，請勿刪除。
- GitHub 帳號設定已驗證此網域；repo 的 Pages → Custom domain 設為 `yue-jin-yan.com`。
- `.github/workflows/deploy-pages.yml` 已改為 `NEXT_PUBLIC_SITE_URL=https://yue-jin-yan.com`、`NEXT_PUBLIC_BASE_PATH=""`。

## 5. 後台

網址：`/admin/orders`（例如 https://yue-jin-yan.com/admin/orders/）
用第 1 步建立的帳號登入，可以看訂單、改狀態、寫內部備註、匯出 Excel。

## 6. 還需要業主提供的資料

| 放在哪裡 | 欄位 |
| --- | --- |
| `data/products.json` → `price` | 每項商品售價（數字，例如 `"3880"`）；若要顯示「起」，把 `priceFrom` 改成 `true` |
| `data/products.json` → `details` | 容量、每瓶燕窩含量、成分、甜度、食用方式、保存方式、保存期限、原產地、製造廠商、過敏原、營養標示（有填才會顯示） |
| `data/products.json` | 「燕序・本養 精選禮盒」的規格 |
| `data/site.json` → `company` | 公司／商號名稱、統一編號、食品業者登錄字號、產品責任險、公司地址（顯示在頁尾） |
| `data/contact.json` | Instagram、門市／辦公地址、營業時間 |
| `lib/messages/zh.ts`、`lib/messages/en.ts` → `returns` | 確認退換貨條款（破損 3 日內通知、7 個工作天退款）是否符合店家做法 |

## 7. 中英文版

- 中文版網址不變（例如 `/products`）；英文版加上 `/en`（例如 https://yue-jin-yan.com/en/products/）。
- 每頁右上角有「中文｜EN」切換鈕（手機版在選單裡與右上角），頁尾也有；切換後停留在同一頁。
- 網站上的固定文字：中文在 `lib/messages/zh.ts`，英文在 `lib/messages/en.ts`，兩個檔案的欄位一一對應。
- 商品與 FAQ 的英文：`data/products.json` 的 `summaryEn`、`featuresEn`、`nameEn`、`descriptionEn`、`factoryCaptionsEn`，以及 `data/faq.json` 的 `questionEn`、`answerEn`。商品英文名稱用 `name`。
- 商品標示（成分、保存方式等）如需英文，可在商品加上 `detailsEn`（欄位同 `details`）；沒填的欄位會顯示中文。
- 後台與新訂單通知信維持中文；英文網站下的訂單，備註開頭會標示「【英文網站訂單】」。

## 8. 圖片與首頁設定

- 商品與產地照片放在 `public/assets/`。建置時會自動產生手機、平板、電腦用的多種尺寸（`public/_img/`，不需放進 Git）；本機可用 `npm run images` 先產生。
- 首頁主視覺輪播：`data/site.json` → `heroSlides`（每張指定商品代碼與照片）。
- 首頁「送禮情境」三張卡片的照片：`data/site.json` → `occasionImages`。
- 分享到 LINE／Facebook 時顯示的圖片：`public/og.jpg`（1200×630）。
- 品牌影片：`public/assets/video/hero-film.mp4`，封面為 `hero-film-poster.webp`。
