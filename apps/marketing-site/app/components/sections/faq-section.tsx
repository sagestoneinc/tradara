import type * as React from "react";
import { faqs } from "../../lib/content";
import { SectionHeader } from "../ui/section-header";

export function FaqSection(): React.JSX.Element {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return (
    <section id="faq" className="space-y-8">
      <SectionHeader
        eyebrow="FAQ"
        title="Answers before you commit capital"
        description="Transparent, beginner-friendly answers about automation, monitoring, and risk-managed strategy workflows."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {faqs.map((faq) => (
          <article key={faq.question} className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
            <p className="mt-3 text-sm leading-7 text-brand-soft">{faq.answer}</p>
          </article>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </section>
  );
}
