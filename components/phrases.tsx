import { Fragment } from "react";

const CJK = /[㐀-鿿]/;

/**
 * 中文標題斷行：以標點（，、。；：！？）切成片語，
 * 每個片語盡量保持在同一行，避免「把心／意交出去」這種斷法。
 * 英文直接回傳原文。
 */
export function Phrases({ text }: { text: string }) {
  if (!CJK.test(text)) return <>{text}</>;
  const parts = text.split(/(?<=[，、。；：！？」])/).filter(Boolean);
  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={`${index}-${part}`}>
          <span className="inline-block">{part}</span>
        </Fragment>
      ))}
    </>
  );
}
