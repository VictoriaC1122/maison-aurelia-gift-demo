import Link from "next/link";
import { PolicySection } from "@/components/policy-section";
import { SectionHeading } from "@/components/section-heading";
import { contact, site } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "隱私權政策",
  description: "越金燕如何蒐集、使用與保護你在訂購時提供的個人資料。",
  path: "/privacy"
});

export default function PrivacyPage() {
  const owner = site.company.legalName || site.brandNameZh;

  return (
    <main id="main-content" className="shell space-y-8 py-10 md:py-16">
      <SectionHeading as="h1" eyebrow="Privacy" title="隱私權政策" description={`${owner}（以下稱「我們」）重視你的個人資料，依《個人資料保護法》說明如下。`} />
      <div className="paper-panel max-w-4xl space-y-6 p-6 md:p-10">
        <PolicySection title="一、蒐集目的">
          <p>處理訂單與詢價、聯繫確認商品內容與報價、安排配送、售後服務，以及回覆你的詢問。</p>
        </PolicySection>
        <PolicySection title="二、蒐集的資料">
          <p>你在訂購表單填寫的姓名、電話、Email、LINE ID、收件地址、希望配送日期與備註內容。</p>
        </PolicySection>
        <PolicySection title="三、利用期間、地區、對象及方式">
          <ul className="list-disc space-y-2 pl-5">
            <li>期間：自你提供資料起，至蒐集目的完成或依法令規定的保存期限為止。</li>
            <li>地區：中華民國境內，以及我們使用的雲端資料庫服務所在地。</li>
            <li>對象：我們；為完成配送所需的物流業者（僅提供收件所需資料）；以及我們用來接收新訂單通知的 Email 寄送服務（Web3Forms）。</li>
            <li>方式：以電子或書面方式處理，僅用於上述目的。我們不會出售或出租你的個人資料。</li>
          </ul>
        </PolicySection>
        <PolicySection title="四、你的權利">
          <p>你可以隨時向我們請求查詢、閱覽、製給複製本、補充或更正、停止蒐集處理利用，或刪除你的個人資料。</p>
        </PolicySection>
        <PolicySection title="五、不提供資料的影響">
          <p>若你不提供必要資料（姓名、電話、Email、收件地址），我們將無法完成訂單確認與配送。</p>
        </PolicySection>
        <PolicySection title="六、資料保護">
          <p>訂單資料存放於具存取控管的雲端資料庫，僅限授權人員登入後台查看。本網站不使用廣告追蹤 Cookie。</p>
        </PolicySection>
        <PolicySection title="七、聯絡我們">
          <p>
            如需行使上述權利或有任何疑問，請聯繫：
            <a href={`mailto:${contact.email}`} className="mx-1 underline decoration-champagne/50 underline-offset-4">{contact.email}</a>
            、電話 {contact.phone}，或
            <Link href="/contact" className="mx-1 underline decoration-champagne/50 underline-offset-4">聯絡我們</Link>
            頁面。
          </p>
        </PolicySection>
      </div>
    </main>
  );
}
