type JsonLdProps = {
  data: Record<string, unknown>;
};

export function JsonLd({ data }: JsonLdProps) {
  const content = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json">{content}</script>;
}
