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

## 4. 網址 yue-jin-yan.com

1. 購買網址（Cloudflare、Namecheap、GoDaddy 等）。
2. GitHub repo → **Settings → Pages → Custom domain** 填 `yue-jin-yan.com` → Save。
3. 在買網址的地方設定 DNS：
   - A 記錄 `@` → `185.199.108.153`、`185.199.109.153`、`185.199.110.153`、`185.199.111.153`
   - CNAME `www` → `victoriac1122.github.io`
4. 把 `.github/workflows/deploy-pages.yml` 改成：
   ```yaml
   NEXT_PUBLIC_SITE_URL: "https://yue-jin-yan.com"
   NEXT_PUBLIC_BASE_PATH: ""
   ```
5. DNS 生效後（最多 24 小時），在 Pages 設定勾選 **Enforce HTTPS**。

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
| `app/returns/page.tsx` | 確認退換貨條款（破損 3 日內通知、7 個工作天退款）是否符合店家做法 |
