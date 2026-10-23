import type { Messages } from "@/lib/messages/zh";

/* English copy. Keep the same shape as zh.ts. */

export const en: Messages = {
  localeLabel: "English",
  htmlLang: "en",
  ogLocale: "en_US",

  common: {
    skipToContent: "Skip to main content",
    priceOnRequest: "Price on request",
    priceFrom: (price: string) => `From ${price}`,
    specOnRequest: "Specs confirmed by our advisor",
    addToCart: "Add to bag",
    added: "Added",
    buyNow: "Buy now",
    quantity: "Quantity",
    decrease: "Decrease quantity",
    increase: "Increase quantity",
    viewProduct: "View product",
    viewProductAria: (name: string) => `View ${name}`,
    lineConsult: "Chat on LINE",
    shopNow: "Shop gifts",
    viewAllProducts: "View all products",
    home: "Home",
    breadcrumb: "Breadcrumb",
    productCount: (count: number) => `${count} ${count === 1 ? "product" : "products"}`
  },

  nav: {
    products: "All Products",
    origin: "Our Origin",
    corporate: "Corporate Gifts",
    about: "Our Story",
    guide: "How to Order",
    track: "Track Order",
    faq: "FAQ",
    contact: "Contact",
    home: "Home",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menu: "Site menu",
    mainNav: "Main navigation",
    mobileNav: "Mobile navigation",
    cartAria: (count: number) => `Shopping bag, ${count} ${count === 1 ? "item" : "items"}`,
    homeAria: "YUA JIN YAN home",
    switchLabel: "中文",
    switchAria: "Switch to Chinese"
  },

  announcement: {
    freeShipping: (amount: string) => `Free shipping on orders over ${amount}`,
    deliveryLong: "Home delivery · 7-ELEVEN / FamilyMart pickup",
    deliveryShort: "Delivery & store pickup"
  },

  footer: {
    shop: "Shop",
    service: "Customer Care",
    contactInfo: "Contact",
    shipping: "Shipping & Fees",
    returns: "Returns & Refunds",
    privacy: "Privacy Policy",
    tags: ["Home delivery", "7-ELEVEN pickup", "FamilyMart pickup", "Bank transfer", "Cash on delivery"],
    legal: {
      taxId: "Tax ID",
      foodRegistration: "Food business registration no.",
      insurance: "Product liability insurance",
      address: "Address"
    }
  },

  trust: {
    origin: { title: "Traceable origin", text: "Real photos from our Vietnamese swiftlet houses" },
    confirm: { title: "Confirmed by an advisor", text: "Pay only after we confirm items and price" },
    gift: { title: "Gift-ready boxes", text: "Beautifully packaged, no extra wrapping needed" },
    delivery: { title: "Delivery & pickup", text: (amount: string) => `Free shipping over ${amount}` }
  },

  cart: {
    dialog: "Shopping bag",
    eyebrow: "Your Bag",
    title: (count: number) => `Shopping bag (${count})`,
    close: "Close shopping bag",
    empty: "Your bag is empty",
    remove: (name: string) => `Remove ${name}`,
    quantityOf: (name: string) => `Quantity of ${name}`,
    checkout: "Checkout",
    continueShopping: "Continue shopping",
    subtotal: "Subtotal",
    shipping: "Shipping",
    total: "Total",
    freeShipping: "Free",
    shippingTbd: "To be confirmed",
    freeLeftBefore: "Spend ",
    freeLeftAfter: " more for free shipping",
    freeReached: "You've unlocked free shipping",
    quotedNote: "Some items are priced on request. Our advisor will confirm the total and shipping after you place the order—you won't be charged before then."
  },

  gallery: {
    previous: "Previous image",
    next: "Next image",
    pick: "Choose an image",
    show: (index: number) => `Show image ${index}`,
    image: (alt: string, index: number) => `${alt}, image ${index}`,
    status: (index: number, total: number) => `Showing image ${index} of ${total}.`
  },

  catalog: {
    all: "All",
    tabs: "Product categories",
    sort: "Sort",
    featured: "Featured",
    priceAsc: "Price: low to high",
    priceDesc: "Price: high to low"
  },

  delivery: {
    home: { label: "Home delivery", description: "Delivered to your address; you can note a preferred delivery date." },
    cvs_711: {
      label: "7-ELEVEN store pickup",
      description: "Delivered to the store you choose; you'll get a pickup notice on arrival.",
      storeIdHint: "6-digit store number, e.g. 123456",
      mapButton: "Open the 7-ELEVEN store map to find the store number"
    },
    cvs_family: {
      label: "FamilyMart store pickup",
      description: "Delivered to the store you choose; you'll get a pickup notice on arrival.",
      storeIdHint: "Store number, e.g. 012345",
      mapButton: "Open the FamilyMart store map to find the store number"
    }
  },

  payment: {
    bank_transfer: {
      label: "Bank transfer / ATM",
      description: "After we confirm the total, you'll see our account details. Report the last 5 digits of your account on the Track Order page once paid."
    },
    cod: {
      label: "Cash on delivery / pay at pickup",
      labelHome: "Cash on delivery",
      labelPickup: "Pay at pickup",
      description: "Pay the courier on delivery, or pay at the store when you pick up."
    }
  },

  orderStatus: { pending: "Received", confirmed: "Confirmed", shipped: "Shipped", completed: "Completed", cancelled: "Cancelled" },
  paymentStatus: { unpaid: "Unpaid", reported: "Payment reported", paid: "Paid", refunded: "Refunded" },

  home: {
    metaTitle: "YUA JIN YAN 越金燕 | Premium Bird's Nest Gifts",
    metaDescription: "YUA JIN YAN crafts premium bird's nest from Vietnamese swiftlet houses. Shop the Yanxu Essential and Deep Reserve gift boxes, with corporate gifting and personal advisor service.",
    heroEyebrow: "Premium Bird's Nest, Expertly Selected",
    heroTitle: ["A thoughtful gift", "for the people who matter."],
    heroBody: "From everyday wellness and festive gifting to corporate gifts—choose the occasion and size, and our advisor will confirm the details and delivery.",
    shop: "Shop gifts",
    byOccasion: "Shop by occasion",
    assurance: "Home delivery or 7-ELEVEN / FamilyMart pickup. Our advisor confirms every order before you pay.",
    signatureEyebrow: "Signature Selection",
    heroImageAlt: "YUA JIN YAN Yanxu selection",
    asideLabel: "Concierge",
    asideContact: "Contact",
    occasions: [
      { eyebrow: "Everyday Care", title: "Daily Wellness", description: "Start with the approachable, clearly portioned Essential collection.", cta: "Shop Essential" },
      { eyebrow: "Significant Gifting", title: "Meaningful Gifts", description: "A more complete gift for holidays, elders and important clients.", cta: "Shop Deep Reserve" },
      { eyebrow: "Corporate Gifting", title: "Corporate Orders", description: "Our advisor tailors quantity, packaging and delivery for your company.", cta: "Explore corporate gifts" }
    ],
    servicePoints: [
      { title: "Confirmed first", text: "Pay only after we confirm items and price." },
      { title: "Delivery & pickup", text: "Home delivery or 7-ELEVEN / FamilyMart pickup." },
      { title: "Personal advisor", text: "A dedicated advisor helps with every detail." }
    ],
    guideEyebrow: "Choose by Occasion",
    guideTitle: "Think of who it's for, then pick the box.",
    guideDescription: "No need to learn every collection first—starting from the occasion makes it easier to find the right size and packaging.",
    bestEyebrow: "Best Sellers",
    bestTitle: "Bestselling Gifts",
    bestDescription: "Add to your bag and check out. For items priced on request, our advisor confirms the total after you order.",
    originEyebrow: "Origin & Craft",
    originTitle: "Know where it comes from, and give with confidence.",
    originText: "Origin photos, nest details and gift presentation, all in one place—so you see how each gift is prepared, not just the box.",
    originCta: "See our origin",
    originSteps: ["Contents confirmed per item", "Packaging tailored to your needs", "Delivery date arranged after confirmation"],
    filmEyebrow: "Brand Film",
    filmTitle: "A closer look at the nests, packaging and gift boxes.",
    filmText: "A 34-second look at the real products, so you can see the texture and presentation before choosing.",
    filmLabel: "YUA JIN YAN brand film",
    conciergeEyebrow: "Private Concierge",
    conciergeTitle: "Not sure what to choose? Tell us who it's for.",
    conciergeText: "Share the quantity, occasion and preferred date, and our advisor will suggest the right items and next steps.",
    conciergeLine: "Ask on LINE",
    conciergeCorporate: "Corporate gifting",
    phone: "Phone",
    email: "Email",
    faqEyebrow: "Before You Order",
    faqTitle: "Frequently Asked Questions",
    faqAll: "All questions",
    faqAllMobile: "View all questions"
  },

  productsPage: {
    metaTitle: "Shop All",
    metaDescription: "Shop YUA JIN YAN Yanxu Essential and Deep Reserve bird's nest gift boxes, with home delivery and 7-ELEVEN / FamilyMart pickup in Taiwan.",
    eyebrow: "Shop",
    title: "All Products",
    description: "Yanxu Essential is ideal for daily wellness and first-timers; Yanxu Deep Reserve is made for elders, important clients and festive gifting."
  },

  product: {
    fallbackTitle: "Product",
    fallbackDescription: "View YUA JIN YAN products.",
    priceNote: "Price confirmed by our advisor. Add to your bag and place the order—you won't be charged before we confirm.",
    homeDelivery: (fee: string, threshold: string) => `Home delivery ${fee}, free over ${threshold}`,
    pickup: (fee: string) => `7-ELEVEN / FamilyMart pickup${fee ? ` ${fee}` : ""}`,
    confirmFirst: "Pay only after we confirm items and price",
    askLine: "Have a question? Chat with our advisor on LINE",
    intro: "Description",
    specs: "Specifications & labeling",
    specsFallback: (spec: string) => `Size: ${spec}. Full ingredients, shelf life and nutrition facts are available from our advisor.`,
    deliveryAndPayment: "Delivery & payment",
    deliveryMethods: "Delivery options",
    paymentMethods: "Payment options",
    seeShipping: ["See ", "Shipping & Fees", " for details."],
    returnsTitle: "Returns",
    returnsText: ["Unopened items can be returned within 7 days of delivery; food and customized items may be exempt by law. See", "Returns & Refunds", "."],
    related: "You may also like",
    detailLabels: {
      netContent: "Size / count",
      nestContent: "Bird's nest per bottle",
      ingredients: "Ingredients",
      sweetness: "Sweetness",
      howToEnjoy: "How to enjoy",
      storage: "Storage",
      shelfLife: "Shelf life",
      origin: "Origin",
      manufacturer: "Manufacturer",
      allergens: "Allergens",
      nutrition: "Nutrition facts"
    }
  },

  collections: {
    metaTitle: "Collections",
    metaDescription: "Browse YUA JIN YAN collections: Yanxu Essential, Yanxu Deep Reserve and our Vietnamese origin story.",
    eyebrow: "Collections",
    title: "Our Collections",
    description: "Browse by occasion and richness: Essential, Deep Reserve and our origin story.",
    detailEyebrow: "Collection",
    count: (count: number) => `${count} ${count === 1 ? "product" : "products"}`,
    switchLabel: "Switch collection",
    productsEyebrow: "Products",
    productsTitle: "In this collection",
    productsDescription: "Our advisor can confirm sizes, quantities and gift box options—for daily wellness, holidays or corporate gifting.",
    fallbackDescription: "Browse YUA JIN YAN collections."
  },

  factory: {
    eyebrow: "Our Origin",
    title: "From Swiftlet House to Gift Box",
    description: "Our bird's nest comes from swiftlet houses in Vietnam. These real photos show the houses, the harvest and the cleaning process—so you can see where every nest comes from.",
    stepLabel: (index: number) => `Step ${index}`,
    steps: [
      { title: "Nest building", text: "Swiftlets build their nests layer by layer on the wooden beams of our Vietnamese swiftlet houses, kept quiet and dim so the birds can rest undisturbed." },
      { title: "Hand harvesting", text: "Each nest is carefully removed from the beams by hand with a scraper." },
      { title: "Cleaning & shaping", text: "Raw nests are cleaned, picked of feathers and shaped into whole nests and strips." },
      { title: "Crafted into Yanxu", text: "The finished nests are prepared into our Yanxu Essential and Deep Reserve collections and packed into gift boxes for you." }
    ],
    captionFallback: (index: number) => `Vietnam swiftlet house ${index}`
  },

  about: {
    metaTitle: "About Us",
    metaDescription: "Meet YUA JIN YAN: premium bird's nest from Vietnamese swiftlet houses, crafted into the Yanxu gift collections.",
    eyebrow: "Our Story",
    title: "About YUA JIN YAN",
    description: "YUA JIN YAN specializes in premium bird's nest. Our Yanxu collections are made with nests from Vietnam, offering a trusted choice for daily wellness and meaningful gifts.",
    body: "From quality control at our Vietnamese swiftlet houses to the presentation of every Yanxu gift box, we care about one thing: that the people who receive our bird's nest can enjoy it with confidence, and the people who give it can do so with pride. Whether it's for your own wellness or an important gift for family or clients, our advisor will help you confirm the items, quantity and delivery.",
    slogan: "Premium Bird's Nest, Expertly Selected",
    promiseEyebrow: "Our Promise",
    promiseText: "A visible origin and clear information, so every gift is given with ease.",
    imageAlt: "YUA JIN YAN Yanxu gift boxes"
  },

  contactPage: {
    metaTitle: "Contact",
    metaDescription: "Contact a YUA JIN YAN advisor about gift selection, corporate gifting, delivery schedules and customization.",
    eyebrow: "Contact",
    title: "Contact Us",
    description: "For questions about gift boxes, gifting plans or delivery, we'd love to hear from you.",
    labels: { name: "Name", title: "Title", phone: "Phone", email: "Email", line: "LINE", instagram: "Instagram", address: "Address", hours: "Opening hours" },
    contactTitle: "Sales Partner",
    overlayEyebrow: "Private Concierge",
    overlayText: "For gift contents, corporate gift boxes or delivery scheduling, contact us directly.",
    imageAlt: "YUA JIN YAN Yanxu gift boxes"
  },

  custom: {
    metaTitle: "Corporate Gifts",
    metaDescription: "Tailored YUA JIN YAN bird's nest gifts for corporate gifting, holidays, events and membership programs.",
    eyebrow: "Corporate Gifting",
    title: "Custom Gifting",
    description: "Premium gift boxes tailored to your brand events and client relationships.",
    badge: "Bespoke Gift Service",
    heading: "Corporate gifts, planned for you",
    text: "Whether it's holiday gifting, a brand event or an important client, we can tailor the contents and presentation of each gift box to the occasion and your style.",
    items: ["Corporate and co-branded gift boxes", "Seasonal packaging and custom sleeves", "Member, VIP and event gifts", "Bulk delivery, scheduled time slots and multiple addresses"],
    ctaLine: "Ask on LINE",
    ctaContact: "Contact us"
  },

  faqPage: {
    metaTitle: "FAQ",
    metaDescription: "Answers about payment, delivery, store pickup and order tracking at YUA JIN YAN.",
    eyebrow: "FAQ",
    title: "Frequently Asked Questions",
    description: "Quick answers about payment, delivery and ordering."
  },

  ordering: {
    metaTitle: "How to Order",
    metaDescription: "How to order from YUA JIN YAN: home delivery, 7-ELEVEN / FamilyMart pickup, bank transfer and cash on delivery.",
    eyebrow: "How to Order",
    title: "Shopping Guide",
    description: "Five simple steps, and you can track your order at any time.",
    flowLabel: "Ordering steps",
    stepLabel: (index: number) => `STEP ${index}`,
    steps: [
      { title: "Choose", text: "Pick your gifts and add them to your bag" },
      { title: "Check out", text: "Choose delivery or store pickup, and how to pay" },
      { title: "We confirm", text: "Our advisor confirms items, total and ship date" },
      { title: "Pay", text: "Transfer and report the last 5 digits, or pay on delivery" },
      { title: "Delivery", text: "Follow your order on the Track Order page" }
    ],
    deliveryTitle: "Delivery options",
    paymentTitle: "Payment options",
    byStore: "Varies by store",
    freeNote: (amount: string) => `Free shipping on orders over ${amount}.`,
    confirmNote: "Every order is confirmed by our advisor first—you won't be charged before then.",
    start: "Start shopping",
    track: "Track order",
    returns: "Returns & Refunds"
  },

  shipping: {
    metaTitle: "Shipping & Fees",
    metaDescription: "YUA JIN YAN delivery options and fees: home delivery, 7-ELEVEN / FamilyMart pickup, free shipping over a set amount.",
    eyebrow: "Shipping",
    title: "Shipping & Fees",
    description: (amount: string) => `Free shipping on orders over ${amount}, for both home delivery and store pickup.`,
    home: { title: "Home delivery", text: "Delivered to your address. You can note a preferred delivery date at checkout." },
    pickup: { title: "7-ELEVEN / FamilyMart pickup", text: "Enter the store number at checkout. You'll receive a text when it arrives—please pick up within 7 days." },
    corporate: { title: "Corporate & multi-address", text: "Bulk corporate gifts, holiday boxes and custom programs are quoted separately." },
    byStore: "Varies by store",
    quote: "Quoted separately",
    notes: [
      ["• Orders ship after our advisor confirms them. Once shipped, find the tracking number on ", "Track Order", "."],
      ["• For outlying islands, urgent orders or specific time slots, add a note at checkout and we'll confirm.", "", ""],
      ["• If anything arrives damaged, please see ", "Returns & Refunds", "."]
    ]
  },

  returns: {
    metaTitle: "Returns & Refunds",
    metaDescription: "Returns, damaged items and refund policy for YUA JIN YAN bird's nest products.",
    eyebrow: "Returns",
    title: "Returns & Refunds",
    description: "Bird's nest is a food product. For everyone's safety, our return policy is as follows.",
    sections: [
      { title: "1. Returns within 7 days", paragraphs: ["You may request a return within 7 days of delivery (including weekends and holidays) if the item is unopened with its box and seal intact. Please contact us first, then send it back once confirmed."] },
      {
        title: "2. Items not eligible for 7-day returns",
        paragraphs: ["Under Taiwan's Regulations Governing the Reasonable Exceptions to the Right of Rescission in Distance Sales, the following are not eligible:"],
        list: ["Perishable items, items with a short shelf life, or items close to expiry.", "Items customized at your request, such as corporate sleeves or tailored assortments."],
        after: "If your order falls into these categories, we'll let you know when confirming the order."
      },
      { title: "3. Damaged or incorrect items", paragraphs: ["If an item arrives damaged, leaking or incorrect, please take photos (outer box, product and the issue) and contact us within 3 days of delivery. We'll replace it or refund you, and cover the shipping."] },
      { title: "4. Refunds", paragraphs: ["Once we receive and check the returned item, we'll refund you within 7 business days via the original payment method or bank transfer."] }
    ],
    contactTitle: "5. Contact",
    contactLine: "LINE",
    contactPhone: "Phone",
    contactEmail: "Email",
    contactPage: "Contact us"
  },

  privacy: {
    metaTitle: "Privacy Policy",
    metaDescription: "How YUA JIN YAN collects, uses and protects the personal data you provide when ordering.",
    eyebrow: "Privacy",
    title: "Privacy Policy",
    description: (owner: string) => `${owner} ("we") respects your personal data. In accordance with Taiwan's Personal Data Protection Act, we explain the following.`,
    sections: [
      { title: "1. Purpose", paragraphs: ["To process orders and inquiries, confirm products and pricing with you, arrange delivery, provide after-sales service and reply to your questions."] },
      { title: "2. Data we collect", paragraphs: ["The name, mobile number, email, LINE ID, delivery address or pickup store, preferred delivery date and notes you provide at checkout."] },
      {
        title: "3. Period, region, recipients and use",
        list: [
          "Period: from when you provide the data until the purpose is fulfilled or the legally required retention period ends.",
          "Region: within Taiwan, and where our cloud database provider is located.",
          "Recipients: us; couriers and convenience stores needed for delivery (only the information required for delivery); and the email service we use for new-order notifications (Web3Forms).",
          "Use: processed electronically or on paper, only for the purposes above. We never sell or rent your personal data."
        ]
      },
      { title: "4. Your rights", paragraphs: ["You may ask us at any time to look up, view, copy, supplement or correct, stop collecting, processing or using, or delete your personal data."] },
      { title: "5. If you don't provide data", paragraphs: ["Without the required information (name, mobile, email, address or pickup store), we can't confirm or deliver your order."] },
      { title: "6. Data protection", paragraphs: ["Order data is stored in an access-controlled cloud database that only authorized staff can view. This site does not use advertising or tracking cookies."] }
    ],
    contactTitle: "7. Contact us",
    contactText: ["To exercise these rights or ask a question, email ", ", call ", ", or visit our ", "Contact", " page."]
  },

  checkout: {
    metaTitle: "Checkout",
    metaDescription: "Enter delivery and payment details to place your YUA JIN YAN order.",
    eyebrow: "Secure Checkout",
    title: "Checkout",
    sections: { contact: "Contact details", delivery: "Delivery", payment: "Payment" },
    required: "Required",
    optional: "Optional",
    name: "Recipient name",
    namePlaceholder: "Full name (ID is checked at store pickup)",
    phone: "Mobile number",
    phoneHint: "Required · for delivery notices",
    email: "Email",
    lineId: "LINE ID",
    lineHint: "Optional · helps our advisor reach you",
    chooseDelivery: "Choose a delivery option",
    city: "City / county",
    cityPlaceholder: "Select city / county",
    district: "District",
    districtPlaceholder: "Select district",
    districtFirst: "Select a city first",
    zip: "Postal code",
    detail: "Street address",
    detailPlaceholder: "Road, lane, number and floor",
    date: "Preferred delivery date",
    dateHint: "Optional · subject to courier schedules",
    storeId: "Store number",
    storeName: "Store name",
    storeNamePlaceholder: "e.g. Banqiao Wenhua",
    pickupNote: "Bring ID matching the recipient name. Parcels not collected within 7 days are returned.",
    taiwanOnly: "We currently deliver within Taiwan only.",
    choosePayment: "Choose a payment option",
    note: "Order notes",
    notePlaceholder: "e.g. gift bag, card message, company tax ID",
    consent: ["I have read and agree to the ", "Privacy Policy", " and ", "Returns & Refunds", "."],
    submit: "Place order",
    submitting: "Placing order…",
    submitNote: "Our advisor confirms items and the total first—you won't be charged before then.",
    honeypot: "Leave this field empty",
    demo: "Demo mode: the order system isn't connected, so orders are only saved on this device.",
    summary: "Order summary",
    summaryCount: (count: number) => `Order summary (${count} ${count === 1 ? "item" : "items"})`,
    editCart: "Edit bag",
    loadingCart: "Loading your bag…",
    emptyTitle: "Your bag is empty",
    emptyText: "Choose your gifts, then come back here to check out.",
    errors: {
      name: "Please enter the recipient's name.",
      phone: "Please enter a 10-digit Taiwan mobile number starting with 09.",
      email: "Please enter a valid email address.",
      city: "Please select a city or county.",
      district: "Please select a district.",
      detail: "Please enter the street address and number.",
      storeId: "Please enter the 5–6 digit store number.",
      storeName: "Please enter the store name.",
      consent: "Please agree to the Privacy Policy and Returns & Refunds.",
      fix: "Please check the highlighted fields.",
      submit: (line: string) => `We couldn't place your order right now. Please try again later, or contact us on LINE (${line}).`
    },
    success: {
      eyebrow: "Order Received",
      title: "Thank you—your order is in",
      orderNumber: "Order number",
      contactNote: "Our advisor will contact you by phone or LINE to confirm the items, total and ship date.",
      demo: "Demo mode: this order is only saved in your browser and was not sent to the store.",
      stepConfirm: "We confirm the items, total and ship date",
      stepBank: "Pay by transfer when notified, then report the last 5 digits on Track Order",
      stepCod: "We ship your order; pay on delivery or at pickup",
      stepShip: "Follow delivery progress on the Track Order page",
      track: "Track this order",
      continueShopping: "Continue shopping",
      remember: "Please keep your order number—you'll need it with your mobile number to track the order."
    }
  },

  track: {
    metaTitle: "Track Order",
    metaDescription: "Enter your order number and mobile number to check your YUA JIN YAN order, payment and shipping status.",
    eyebrow: "Order Status",
    title: "Track Your Order",
    description: "Enter your order number and the mobile number used at checkout to see progress, the amount due and shipping details.",
    orderNumber: "Order number",
    phone: "Mobile number used at checkout",
    submit: "Track order",
    loading: "Searching…",
    help: (line: string, phone: string) => `Can't find your order number? Contact us on LINE (${line}) or call ${phone}.`,
    needInput: "Please enter your order number and mobile number.",
    notFound: "We couldn't find that order. Please check the order number and mobile number.",
    failed: "Tracking is unavailable right now. Please try again later.",
    placedAt: "Placed on",
    cancelled: "This order has been cancelled. Please contact us if you have any questions.",
    steps: ["Received", "Confirmed", "Shipped", "Completed"],
    items: "Items",
    totalQuantity: (name: string, count: number) => `${name} (${count} ${count === 1 ? "item" : "items"})`,
    delivery: "Delivery",
    trackingNumber: "Tracking number",
    payment: "Payment",
    amountDue: "Amount due",
    amountPending: "Being confirmed",
    bankTitle: "Bank transfer details",
    bankPending: "Once our advisor confirms the total, the amount due and account details will appear here, and we'll also let you know by phone or LINE.",
    bank: "Bank",
    account: "Account",
    accountName: "Account name",
    amount: "Amount",
    deadline: (days: number) => `Please transfer within ${days} days, then report the last 5 digits of your account below.`,
    bankByAdvisor: "Our advisor will send you the account details by phone or LINE.",
    reported: (last5: string) => `Payment reported (last 5 digits ${last5}). We'll update the status once it's received.`,
    reportLabel: "Paid already? Report the last 5 digits of your account",
    report: "Report payment",
    reporting: "Sending…",
    reportInvalid: "Please enter the last 5 digits of your account.",
    reportOk: "Thanks—we've received your payment report and will update the status once confirmed.",
    reportRejected: "Payment can't be reported for this order. Please contact us directly.",
    reportFailed: "Couldn't send your report. Please try again later.",
    copy: "Copy",
    copied: "Copied",
    placeholder: "Your order details will appear here"
  }
};
