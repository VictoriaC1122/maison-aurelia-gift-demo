export function StructuredData({
  data
}: {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}) {
  return (
    <script
      type="application/ld+json"
      // The JSON-LD content is generated from trusted local data files.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
