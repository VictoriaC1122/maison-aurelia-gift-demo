import Link from "next/link";
import { PolicySection } from "@/components/policy-section";
import { SectionHeading } from "@/components/section-heading";
import { contact } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "退換貨說明",
  description: "越金燕燕窩商品的退換貨、瑕疵處理與退款方式說明。",
  path: "/returns"
});

export default function ReturnsPage() {
  return (
    <main id="main-content" className="shell space-y-8 py-10 md:py-16">
      <SectionHeading as="h1" eyebrow="Returns" title="退換貨說明" description="燕窩屬於食品，為了每一位客人的食用安全，退換貨方式說明如下。" />
      <div className="paper-panel max-w-4xl space-y-6 p-6 md:p-10">
        <PolicySection title="一、七日內退貨">
          <p>收到商品後七日內（含例假日），商品未拆封、外盒與封膜完整，可申請退貨。請先與我們聯繫，確認後再寄回。</p>
        </PolicySection>
        <PolicySection title="二、不適用七日退貨的情形">
          <p>依《通訊交易解除權合理例外情事適用準則》，下列商品不適用七日解除權：</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>易於腐敗、保存期限較短，或解約時即將逾期的商品。</li>
            <li>依你的要求客製的商品，例如企業客製腰封、指定內容組合。</li>
          </ul>
          <p>若你訂購的商品屬於上述情形，我們會在確認訂單時事先告知。</p>
        </PolicySection>
        <PolicySection title="三、商品瑕疵或運送破損">
          <p>收到商品後如發現破損、漏液或內容物有誤，請於收貨後 3 日內拍照（外箱、商品與問題處）並聯繫我們，我們會為你更換或退款，運費由我們負擔。</p>
        </PolicySection>
        <PolicySection title="四、退款方式">
          <p>收到退回商品並確認後，將於 7 個工作天內以原付款方式或匯款退還款項。</p>
        </PolicySection>
        <PolicySection title="五、聯絡方式">
          <p>
            LINE：<a href={`https://line.me/R/ti/p/~${contact.line}`} className="underline decoration-champagne/50 underline-offset-4">{contact.line}</a>
            ・電話：{contact.phone}・Email：{contact.email}。也可以前往
            <Link href="/contact" className="mx-1 underline decoration-champagne/50 underline-offset-4">聯絡我們</Link>。
          </p>
        </PolicySection>
      </div>
    </main>
  );
}
