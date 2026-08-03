'use client';

interface JsonLdProps {
  schema: Record<string, unknown>;
}

export function JsonLd({ schema }: JsonLdProps) {
  return (
    <script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
