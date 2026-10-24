/* 中文版文字。英文版（en.ts）必須提供相同的欄位。 */

export const zh = {
  localeLabel: "中文",
  htmlLang: "zh-Hant",
  ogLocale: "zh_TW",

  common: {
    skipToContent: "跳至主要內容",
    priceOnRequest: "專人報價",
    priceFrom: (price: string) => `${price} 起`,
    specOnRequest: "規格由顧問確認",
    addToCart: "加入購物車",
    added: "已加入",
    buyNow: "立即購買",
    quantity: "數量",
    decrease: "減少數量",
    increase: "增加數量",
    viewProduct: "查看商品",
    viewProductAria: (name: string) => `查看 ${name}`,
    lineConsult: "LINE 諮詢",
    shopNow: "選購燕禮",
    viewAllProducts: "查看全部商品",
    home: "首頁",
    breadcrumb: "麵包屑",
    productCount: (count: number) => `${count} 件商品`
  },

  nav: {
    products: "全部商品",
    origin: "產地故事",
    corporate: "企業禮贈",
    about: "品牌故事",
    guide: "購物說明",
    track: "訂單查詢",
    faq: "常見問題",
    contact: "聯絡我們",
    home: "首頁",
    openMenu: "開啟選單",
    closeMenu: "關閉選單",
    menu: "網站選單",
    mainNav: "主要導覽",
    mobileNav: "行動版選單",
    cartAria: (count: number) => `購物車，${count} 件商品`,
    homeAria: "越金燕 首頁",
    switchLabel: "EN",
    switchAria: "切換為英文版"
  },

  announcement: {
    freeShipping: (amount: string) => `全館滿 ${amount} 免運`,
    deliveryLong: "宅配到府・7-11／全家超商取貨",
    deliveryShort: "宅配・超商取貨"
  },

  footer: {
    shop: "選購",
    service: "顧客服務",
    contactInfo: "聯絡資訊",
    shipping: "配送與運費",
    returns: "退換貨說明",
    privacy: "隱私權政策",
    tags: ["宅配到府", "7-11 取貨", "全家取貨", "銀行轉帳", "貨到付款"],
    legal: {
      taxId: "統一編號",
      foodRegistration: "食品業者登錄字號",
      insurance: "產品責任險",
      address: "地址"
    }
  },

  trust: {
    origin: { title: "越南燕屋溯源", text: "產地、採收到整理全程實拍" },
    confirm: { title: "專人確認訂單", text: "確認品項與金額後才付款" },
    gift: { title: "精緻禮盒包裝", text: "送禮不需再另外包裝" },
    delivery: { title: "宅配・超商取貨", text: (amount: string) => `滿 ${amount} 免運` }
  },

  cart: {
    dialog: "購物車",
    eyebrow: "我的購物車",
    title: (count: number) => `購物車（${count}）`,
    close: "關閉購物車",
    empty: "購物車還是空的",
    remove: (name: string) => `移除 ${name}`,
    quantityOf: (name: string) => `${name} 數量`,
    checkout: "前往結帳",
    continueShopping: "繼續購物",
    subtotal: "商品小計",
    shipping: "運費",
    total: "合計",
    freeShipping: "免運",
    shippingTbd: "顧問確認",
    freeLeftBefore: "再買 ",
    freeLeftAfter: " 即享免運",
    freeReached: "已達免運門檻",
    quotedNote: "部分商品尚未公開售價，送出訂單後顧問會確認金額與運費，確認前不會扣款。"
  },

  gallery: {
    previous: "上一張商品圖片",
    next: "下一張商品圖片",
    pick: "選擇商品圖片",
    show: (index: number) => `顯示第 ${index} 張商品圖片`,
    image: (alt: string, index: number) => `${alt}，圖片 ${index}`,
    status: (index: number, total: number) => `目前顯示第 ${index} 張，共 ${total} 張商品圖片。`
  },

  catalog: {
    all: "全部",
    tabs: "商品分類",
    sort: "排序",
    featured: "推薦排序",
    priceAsc: "價格低到高",
    priceDesc: "價格高到低"
  },

  delivery: {
    home: { label: "宅配到府", description: "送到指定地址，可備註希望到貨日。" },
    cvs_711: {
      label: "7-ELEVEN 超商取貨",
      description: "送到指定門市，到貨後會收到取貨通知。",
      storeIdHint: "6 碼店號，例如 123456",
      mapButton: "打開 7-ELEVEN 門市地圖，查詢門市店號"
    },
    cvs_family: {
      label: "全家超商取貨",
      description: "送到指定門市，到貨後會收到取貨通知。",
      storeIdHint: "店舖號碼，例如 012345",
      mapButton: "打開全家門市地圖，查詢門市店號"
    }
  },

  payment: {
    bank_transfer: {
      label: "銀行轉帳／ATM",
      description: "顧問確認金額後提供匯款資訊，轉帳後可在「訂單查詢」回報帳號後五碼。"
    },
    cod: {
      label: "貨到付款／取貨付款",
      labelHome: "貨到付款",
      labelPickup: "取貨付款",
      description: "宅配於收貨時付款；超商取貨於門市取件時付款。"
    }
  },

  orderStatus: { pending: "待確認", confirmed: "已確認", shipped: "已出貨", completed: "已完成", cancelled: "已取消" },
  paymentStatus: { unpaid: "未付款", reported: "已回報匯款", paid: "已付款", refunded: "已退款" },

  home: {
    metaTitle: "越金燕 YUA JIN YAN｜頂級燕窩・專研之選",
    metaDescription: "越金燕 YUA JIN YAN 專研頂級燕窩，提供「燕序」本養、深養系列燕窩禮盒，以及企業客製禮贈與專人顧問服務。",
    heroEyebrow: "頂級燕窩・專研之選",
    heroTitle: ["為重要的人，", "選一份妥帖燕禮。"],
    heroBody: "從日常保養、節慶送禮到企業禮贈，先選用途與份量，再由顧問協助確認規格與配送安排。",
    shop: "選購燕禮",
    byOccasion: "依送禮情境挑選",
    assurance: "支援宅配與 7-11／全家取貨；送出訂單後由顧問確認，確認前不會扣款。",
    signatureEyebrow: "本季精選",
    heroImageAlt: "越金燕 燕序精選",
    asideLabel: "專屬顧問",
    asideContact: "聯絡",
    occasions: [
      { eyebrow: "自用保養", title: "日常保養", description: "從份量清楚、容易入手的本養系列開始。", cta: "選購本養系列" },
      { eyebrow: "節慶送禮", title: "重要贈禮", description: "為節慶、長輩與重要客戶選一份更完整的燕禮。", cta: "選購深養系列" },
      { eyebrow: "企業採購", title: "企業客製", description: "依數量、包裝與配送需求，由顧問協助整理方案。", cta: "了解客製方式" }
    ],
    servicePoints: [
      { title: "規格先確認", text: "顧問確認品項與金額後才付款。" },
      { title: "宅配・超商取貨", text: "宅配到府或 7-11、全家門市取貨。" },
      { title: "專人協助", text: "由專屬顧問協助確認細節。" }
    ],
    guideEyebrow: "送禮情境",
    guideTitle: "先想送給誰，再決定選哪一盒。",
    guideDescription: "不用先理解所有系列；從使用情境開始，會更容易找到適合的份量與包裝。",
    bestEyebrow: "熱銷推薦",
    bestTitle: "人氣燕禮",
    bestDescription: "加入購物車即可結帳；尚未公開售價的品項，送出訂單後由顧問確認金額。",
    originEyebrow: "產地與工序",
    originTitle: "看得見來處，才更放心把心意交出去。",
    originText: "產地影像、燕盞細節與禮盒呈現分開整理，讓挑選不只看外盒，也能理解一份燕禮如何被準備。",
    originCta: "查看產地影像",
    originSteps: ["依品項確認內容與份量", "依需求確認包裝方式", "確認後安排配送日期"],
    filmEyebrow: "品牌影片",
    filmTitle: "近看燕盞、包裝與禮盒細節。",
    filmText: "34 秒看完商品實景，挑選前先確認質地與呈現方式。",
    filmLabel: "越金燕品牌影片",
    conciergeEyebrow: "專屬顧問",
    conciergeTitle: "還不確定怎麼選，也可以先說明送禮對象。",
    conciergeText: "告訴我們預計數量、使用情境與希望日期，顧問會協助整理適合的品項與後續安排。",
    conciergeLine: "LINE 詢問顧問",
    conciergeCorporate: "查看企業客製",
    phone: "電話",
    email: "Email",
    faqEyebrow: "下單須知",
    faqTitle: "下單前常見問題",
    faqAll: "全部問題",
    faqAllMobile: "查看全部問題",
    faqMore: "還有其他問題？",
    faqMoreLine: "LINE 詢問顧問",
    heroSlide: (index: number, total: number) => `顯示第 ${index} 件精選，共 ${total} 件`,
    statementEyebrow: "品牌理念",
    statementQuote: ["讓收到燕窩的人吃得安心，", "也讓送禮的人送得體面。"],
    statementBody: "越金燕專研頂級燕窩，從越南燕屋的產地把關，到「燕序」系列的禮盒呈現，每一步都為這兩件事而做。",
    statementCta: "認識越金燕"
  },

  productsPage: {
    metaTitle: "全部商品",
    metaDescription: "選購越金燕「燕序」本養、深養系列燕窩禮盒，支援宅配到府與 7-11、全家超商取貨。",
    eyebrow: "線上選購",
    title: "全部商品",
    description: "燕序本養適合日常保養與初次品嚐；燕序深養適合長輩、重要客戶與節慶大禮。"
  },

  product: {
    fallbackTitle: "商品詳情",
    fallbackDescription: "查看越金燕的商品內容。",
    priceNote: "售價由顧問確認，可先加入購物車送出訂單，確認前不會扣款。",
    homeDelivery: (fee: string, threshold: string) => `宅配到府 ${fee}，滿 ${threshold} 免運`,
    pickup: (fee: string) => `7-11／全家超商取貨${fee ? ` ${fee}` : ""}`,
    confirmFirst: "顧問確認品項與金額後才付款",
    askLine: "想先問問看？LINE 諮詢顧問",
    intro: "商品介紹",
    specs: "商品規格與標示",
    specsFallback: (spec: string) => `規格：${spec}。完整成分、保存期限與營養標示，歡迎向顧問索取。`,
    deliveryAndPayment: "配送與付款",
    deliveryMethods: "配送方式",
    paymentMethods: "付款方式",
    seeShipping: ["詳見 ", "配送與運費", "。"],
    returnsTitle: "退換貨說明",
    returnsText: ["未拆封商品收到後 7 日內可申請退貨；食品與客製商品依法可能不適用，詳見", "退換貨說明", "。"],
    related: "你可能也喜歡",
    detailLabels: {
      netContent: "容量／入數",
      nestContent: "每瓶燕窩含量",
      ingredients: "成分",
      sweetness: "甜度",
      howToEnjoy: "食用方式",
      storage: "保存方式",
      shelfLife: "保存期限",
      origin: "原產地",
      manufacturer: "製造廠商",
      allergens: "過敏原資訊",
      nutrition: "營養標示"
    }
  },

  collections: {
    metaTitle: "商品系列",
    metaDescription: "依系列瀏覽越金燕的燕序本養、深養與產地故事。",
    eyebrow: "燕序系列",
    title: "商品系列",
    description: "依送禮情境與風味深度，瀏覽本養、深養與產地系列。",
    detailEyebrow: "商品系列",
    count: (count: number) => `${count} 款系列商品`,
    switchLabel: "切換商品系列",
    productsEyebrow: "本系列商品",
    productsTitle: "本系列選品",
    productsDescription: "規格、份數與禮盒搭配可由顧問協助確認，適合日常保養、節慶與企業贈禮。",
    fallbackDescription: "瀏覽越金燕的系列內容。"
  },

  factory: {
    eyebrow: "產地故事",
    title: "從燕屋到燕盞",
    description: "越金燕的燕窩來自越南燕屋。以下是燕屋、採收與整理過程的實拍照片，讓你在挑選前看見每一盞燕窩的來處。",
    stepLabel: (index: number) => `步驟 ${index}`,
    steps: [
      { title: "燕屋築巢", text: "金絲燕在越南燕屋的木樑上，以唾液一層層築成燕窩。燕屋保持安靜、昏暗，讓燕子安心棲息。" },
      { title: "人工採收", text: "燕窩由採收人員在燕屋內，以刮刀從木樑上逐一手工取下。" },
      { title: "清潔整理", text: "採下的原燕盞經過清潔、挑毛與整形，成為一盞盞完整的燕盞與燕條。" },
      { title: "製成燕序", text: "整理好的燕窩再製作成「燕序」本養、深養系列，裝入禮盒送到你手上。" }
    ],
    captionFallback: (index: number) => `越南燕廠實景 ${index}`
  },

  about: {
    metaTitle: "品牌介紹",
    metaDescription: "認識越金燕：專研頂級燕窩，從越南產地到「燕序」系列禮盒的品牌故事。",
    eyebrow: "品牌故事",
    title: "品牌介紹",
    description: "越金燕專研頂級燕窩，以越南產地燕盞打造「燕序」系列，讓日常保養與重要贈禮都有一份安心的選擇。",
    body: "從越南燕廠的產地把關，到「燕序」系列的禮盒呈現，我們在意的始終是同一件事：讓收到燕窩的人吃得安心，也讓送禮的人送得體面。不論是自己的日常保養，還是給長輩、客戶的重要心意，都有顧問陪你確認品項、份量與配送安排。",
    slogan: "頂級燕窩・專研之選",
    promiseEyebrow: "我們的承諾",
    promiseText: "產地看得見、內容講清楚，讓每一份燕禮都送得從容。",
    imageAlt: "越金燕燕序系列禮盒",
    promisesEyebrow: "我們的承諾",
    promisesTitle: "三件我們一直在意的事",
    promises: [
      { title: "產地看得見", text: "燕窩來自越南燕屋，從燕屋、採收到整理，都有實拍紀錄可以看。" },
      { title: "內容講清楚", text: "規格、份量與保存方式由顧問逐一說明，下單前就能確認清楚。" },
      { title: "送禮送得體面", text: "精緻禮盒包裝，從日常保養、節慶送禮到企業贈禮都合適。" }
    ],
    collectionsEyebrow: "燕序系列",
    collectionsTitle: "兩個系列，對應兩種心意",
    collectionsCta: "選購此系列",
    originEyebrow: "產地故事",
    originTitle: "一切從越南燕屋開始",
    originText: "燕屋築巢、人工採收、清潔整理，每一個環節都有照片可以看。",
    originCta: "查看產地故事",
    ctaTitle: "想找一份合適的燕禮？",
    ctaText: "告訴我們送禮對象、數量與預算，顧問會協助你挑選。",
    ctaLine: "LINE 詢問顧問",
    ctaShop: "選購燕禮"
  },

  contactPage: {
    metaTitle: "聯絡我們",
    metaDescription: "與越金燕顧問聯繫，安排燕禮選品、企業贈禮、配送時程與客製化方案。",
    eyebrow: "聯絡方式",
    title: "聯絡我們",
    description: "若需進一步洽詢禮盒內容、贈禮規劃或配送安排，歡迎直接與我們聯繫。",
    labels: { name: "姓名", title: "職稱", phone: "電話", email: "Email", line: "LINE", instagram: "Instagram", address: "地址", hours: "營業時間" },
    contactTitle: "銷售合夥人",
    overlayEyebrow: "專屬顧問",
    overlayText: "若需安排贈禮內容、企業禮盒或配送節奏，歡迎直接與我們聯繫。",
    imageAlt: "越金燕燕序系列禮盒"
  },

  custom: {
    metaTitle: "企業禮贈",
    metaDescription: "為企業贈禮、節慶活動與會員經營安排更合適的越金燕客製燕禮方案。",
    eyebrow: "企業禮贈",
    title: "客製化方案",
    description: "讓高端禮盒可以更貼近企業品牌活動與會員經營需求。",
    badge: "專屬客製服務",
    heading: "企業禮贈與客製規劃",
    text: "無論是節慶贈禮、品牌活動，或重要客戶往來，我們都能依場合與風格調整禮盒內容與呈現方式。",
    items: ["企業贈禮與品牌聯名禮盒", "節慶限定包裝與客製腰封", "會員禮、貴賓禮與品牌活動伴手禮", "大宗配送、指定時段與多點寄送"],
    ctaLine: "LINE 洽詢客製",
    ctaContact: "聯絡我們"
  },

  faqPage: {
    metaTitle: "常見問題",
    metaDescription: "快速查閱越金燕的付款、配送、超商取貨與訂單查詢常見問題。",
    eyebrow: "購物須知",
    title: "常見問題",
    description: "把付款、配送與訂購的常見疑問整理清楚，方便快速確認。"
  },

  ordering: {
    metaTitle: "購物說明",
    metaDescription: "越金燕的訂購流程、配送方式與付款方式說明：宅配到府、7-11／全家超商取貨、銀行轉帳與貨到付款。",
    eyebrow: "訂購流程",
    title: "購物說明",
    description: "五個步驟完成訂購，從下單到收貨都可以隨時查詢進度。",
    flowLabel: "訂購流程",
    stepLabel: (index: number) => `步驟 ${index}`,
    steps: [
      { title: "選購商品", text: "挑選燕禮，加入購物車" },
      { title: "填寫結帳", text: "選擇宅配或超商取貨與付款方式" },
      { title: "顧問確認", text: "確認品項、金額與出貨日" },
      { title: "完成付款", text: "轉帳後回報後五碼，或貨到付款" },
      { title: "出貨配送", text: "隨時在訂單查詢看進度" }
    ],
    deliveryTitle: "配送方式",
    paymentTitle: "付款方式",
    byStore: "依門市計算",
    freeNote: (amount: string) => `全館滿 ${amount} 免運。`,
    confirmNote: "所有訂單都會先由顧問確認品項與金額，確認前不會扣款。",
    start: "開始選購",
    track: "訂單查詢",
    returns: "退換貨說明"
  },

  shipping: {
    metaTitle: "配送與運費",
    metaDescription: "越金燕配送方式與運費：宅配到府、7-11／全家超商取貨，全館滿額免運。",
    eyebrow: "配送資訊",
    title: "配送與運費",
    description: (amount: string) => `全館滿 ${amount} 免運，宅配與超商取貨皆適用。`,
    home: { title: "宅配到府", text: "送到指定地址，下單時可備註希望到貨日。" },
    pickup: { title: "7-11／全家超商取貨", text: "結帳時填寫門市店號，到店後會收到簡訊通知，請於 7 天內取件。" },
    corporate: { title: "企業與多點配送", text: "大量企業贈禮、節慶禮盒與客製方案可另外報價。" },
    byStore: "依門市計算",
    quote: "另行報價",
    notes: [
      ["・訂單由顧問確認後安排出貨，出貨後可在 ", "訂單查詢", " 看到物流單號。"],
      ["・離島、急件或指定時段配送，請在結帳備註說明，顧問會另行確認。", "", ""],
      ["・收到商品如有破損，請參考 ", "退換貨說明", "。"]
    ]
  },

  returns: {
    metaTitle: "退換貨說明",
    metaDescription: "越金燕燕窩商品的退換貨、瑕疵處理與退款方式說明。",
    eyebrow: "售後服務",
    title: "退換貨說明",
    description: "燕窩屬於食品，為了每一位客人的食用安全，退換貨方式說明如下。",
    sections: [
      { title: "一、七日內退貨", paragraphs: ["收到商品後七日內（含例假日），商品未拆封、外盒與封膜完整，可申請退貨。請先與我們聯繫，確認後再寄回。"] },
      {
        title: "二、不適用七日退貨的情形",
        paragraphs: ["依《通訊交易解除權合理例外情事適用準則》，下列商品不適用七日解除權："],
        list: ["易於腐敗、保存期限較短，或解約時即將逾期的商品。", "依你的要求客製的商品，例如企業客製腰封、指定內容組合。"],
        after: "若你訂購的商品屬於上述情形，我們會在確認訂單時事先告知。"
      },
      { title: "三、商品瑕疵或運送破損", paragraphs: ["收到商品後如發現破損、漏液或內容物有誤，請於收貨後 3 日內拍照（外箱、商品與問題處）並聯繫我們，我們會為你更換或退款，運費由我們負擔。"] },
      { title: "四、退款方式", paragraphs: ["收到退回商品並確認後，將於 7 個工作天內以原付款方式或匯款退還款項。"] }
    ],
    contactTitle: "五、聯絡方式",
    contactLine: "LINE",
    contactPhone: "電話",
    contactEmail: "Email",
    contactPage: "聯絡我們"
  },

  privacy: {
    metaTitle: "隱私權政策",
    metaDescription: "越金燕如何蒐集、使用與保護你在訂購時提供的個人資料。",
    eyebrow: "個資保護",
    title: "隱私權政策",
    description: (owner: string) => `${owner}（以下稱「我們」）重視你的個人資料，依《個人資料保護法》說明如下。`,
    sections: [
      { title: "一、蒐集目的", paragraphs: ["處理訂單與詢價、聯繫確認商品內容與報價、安排配送、售後服務，以及回覆你的詢問。"] },
      { title: "二、蒐集的資料", paragraphs: ["你在結帳時填寫的姓名、手機、Email、LINE ID、收件地址或取貨門市、希望到貨日與備註內容。"] },
      {
        title: "三、利用期間、地區、對象及方式",
        list: [
          "期間：自你提供資料起，至蒐集目的完成或依法令規定的保存期限為止。",
          "地區：中華民國境內，以及我們使用的雲端資料庫服務所在地。",
          "對象：我們；為完成配送所需的物流業者與超商（僅提供收件所需資料）；以及我們用來接收新訂單通知的 Email 寄送服務（Web3Forms）。",
          "方式：以電子或書面方式處理，僅用於上述目的。我們不會出售或出租你的個人資料。"
        ]
      },
      { title: "四、你的權利", paragraphs: ["你可以隨時向我們請求查詢、閱覽、製給複製本、補充或更正、停止蒐集處理利用，或刪除你的個人資料。"] },
      { title: "五、不提供資料的影響", paragraphs: ["若你不提供必要資料（姓名、手機、Email、收件地址或取貨門市），我們將無法完成訂單確認與配送。"] },
      { title: "六、資料保護", paragraphs: ["訂單資料存放於具存取控管的雲端資料庫，僅限授權人員登入後台查看。本網站不使用廣告追蹤 Cookie。"] }
    ],
    contactTitle: "七、聯絡我們",
    contactText: ["如需行使上述權利或有任何疑問，請聯繫：", "、電話 ", "，或", "聯絡我們", "頁面。"]
  },

  checkout: {
    metaTitle: "結帳",
    metaDescription: "填寫收件、配送與付款方式，送出越金燕訂單。",
    eyebrow: "安心結帳",
    title: "結帳",
    sections: { contact: "聯絡資訊", delivery: "配送方式", payment: "付款方式" },
    required: "必填",
    optional: "選填",
    name: "收件人姓名",
    namePlaceholder: "請填寫真實姓名，超商取貨需核對證件",
    phone: "手機號碼",
    phoneHint: "必填・到貨通知用",
    email: "Email",
    lineId: "LINE ID",
    lineHint: "選填・方便顧問聯繫",
    chooseDelivery: "選擇配送方式",
    city: "縣市",
    cityPlaceholder: "請選擇縣市",
    district: "鄉鎮市區",
    districtPlaceholder: "請選擇區域",
    districtFirst: "請先選縣市",
    zip: "郵遞區號",
    detail: "詳細地址",
    detailPlaceholder: "路名、巷弄、門牌號碼、樓層",
    date: "希望到貨日",
    dateHint: "選填・以實際物流為準",
    storeId: "門市店號",
    storeName: "門市名稱",
    storeNamePlaceholder: "例如：板橋文化",
    pickupNote: "取貨時請攜帶與收件人姓名相符的證件；到店後 7 天內未取件將退回。",
    taiwanOnly: "",
    choosePayment: "選擇付款方式",
    note: "訂單備註",
    notePlaceholder: "例如：需要提袋、送禮卡片內容、統一編號",
    consent: ["我已閱讀並同意", "隱私權政策", "與", "退換貨說明", "。"],
    submit: "送出訂單",
    submitting: "訂單送出中…",
    submitNote: "送出後顧問會先確認品項與金額，確認前不會扣款。",
    honeypot: "請勿填寫此欄位",
    demo: "展示模式：訂單後台尚未連接，送出的資料只會存在這台裝置。",
    summary: "訂單明細",
    summaryCount: (count: number) => `訂單明細（${count} 件）`,
    editCart: "修改購物車",
    loadingCart: "載入購物車中…",
    emptyTitle: "購物車是空的",
    emptyText: "先挑選想要的燕禮，再回到這裡結帳。",
    errors: {
      name: "請填寫收件人姓名。",
      phone: "請填寫 09 開頭的 10 碼手機號碼。",
      email: "請填寫有效的 Email。",
      city: "請選擇縣市。",
      district: "請選擇鄉鎮市區。",
      detail: "請填寫路名、門牌與樓層。",
      storeId: "請填寫 5～6 碼門市店號。",
      storeName: "請填寫門市名稱。",
      consent: "請先勾選同意隱私權政策與退換貨說明。",
      fix: "請確認標示紅字的欄位。",
      submit: (line: string) => `訂單暫時無法送出，請稍後再試，或直接透過 LINE（${line}）聯繫我們。`
    },
    success: {
      eyebrow: "訂單成立",
      title: "訂單已送出，謝謝你",
      orderNumber: "訂單編號",
      contactNote: "顧問會以電話或 LINE 與你確認品項、金額與出貨日期。",
      demo: "目前為展示模式，這筆訂單只存在你的瀏覽器，並未送到店家。",
      stepConfirm: "顧問確認品項、金額與出貨日",
      stepBank: "依通知完成轉帳，並在訂單查詢回報後五碼",
      stepCod: "安排出貨，收貨／取貨時付款",
      stepShip: "出貨後可在訂單查詢看到物流進度",
      track: "查詢這筆訂單",
      continueShopping: "繼續選購",
      remember: "請記下訂單編號，查詢時需搭配下單手機號碼。"
    }
  },

  track: {
    metaTitle: "訂單查詢",
    metaDescription: "輸入訂單編號與下單手機，查詢越金燕訂單進度、付款與出貨狀態。",
    eyebrow: "訂單進度",
    title: "訂單查詢",
    description: "輸入訂單編號與下單時的手機號碼，即可查看處理進度、應付金額與出貨資訊。",
    orderNumber: "訂單編號",
    phone: "下單手機號碼",
    submit: "查詢訂單",
    loading: "查詢中…",
    help: (line: string, phone: string) => `找不到訂單編號？請透過 LINE（${line}）或電話 ${phone} 與我們聯繫。`,
    needInput: "請輸入訂單編號與下單手機號碼。",
    notFound: "查無這筆訂單，請確認訂單編號與手機號碼是否正確。",
    failed: "目前無法查詢，請稍後再試。",
    placedAt: "下單時間",
    cancelled: "此訂單已取消，如有疑問請與我們聯繫。",
    steps: ["已收到訂單", "已確認", "已出貨", "已完成"],
    items: "訂購商品",
    totalQuantity: (name: string, count: number) => `${name}（共 ${count} 件）`,
    delivery: "配送",
    trackingNumber: "物流單號",
    payment: "付款",
    amountDue: "應付金額",
    amountPending: "顧問確認中",
    bankTitle: "匯款資訊",
    bankPending: "顧問確認金額後，應付金額與匯款帳號會顯示在這裡，也會透過電話或 LINE 通知你。",
    bank: "銀行",
    account: "帳號",
    accountName: "戶名",
    amount: "金額",
    deadline: (days: number) => `請於 ${days} 日內完成轉帳，並在下方回報帳號後五碼。`,
    bankByAdvisor: "顧問會透過電話或 LINE 提供匯款帳號。",
    reported: (last5: string) => `已收到匯款回報（後五碼 ${last5}），確認入帳後會更新狀態。`,
    reportLabel: "已轉帳？回報帳號後五碼",
    report: "回報匯款",
    reporting: "送出中…",
    reportInvalid: "請輸入匯款帳號後五碼（5 位數字）。",
    reportOk: "已收到你的匯款回報，確認入帳後會更新付款狀態。",
    reportRejected: "這筆訂單目前無法回報匯款，請直接與我們聯繫。",
    reportFailed: "回報失敗，請稍後再試。",
    copy: "複製",
    copied: "已複製",
    placeholder: "查詢結果會顯示在這裡"
  }
};

export type Messages = typeof zh;
