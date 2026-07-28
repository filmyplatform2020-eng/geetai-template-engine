"use client"

import { ArrowRight, ShoppingCart, TabletSmartphone } from "lucide-react"
import type { Product } from "@/engine/product/types"
import Container from "@/components/ui/Container"
import SectionTitle from "@/components/ui/SectionTitle"
import AnimatedSection from "@/components/animations/AnimatedSection"
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import Rating from "@/components/ui/Rating"
import Badge from "@/components/ui/Badge"
import FAQ from "@/components/sections/FAQ"
import CTA from "@/components/sections/CTA"

interface Props {
  product: Product
}

export default function GuidePageClient({ product }: Props) {
  return (
    <>
      <section className="relative pt-28 pb-8">
        <Container as="div">
          <AnimatedSection type="fadeInUp">
            <Badge variant="primary" size="md" className="mb-4">
              Buying Guide
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 sm:text-5xl lg:text-6xl">
              {product.product} Buying Guide
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/40">
              Everything you need to know before buying. We compare alternatives,
              recommend accessories, and give you our honest verdict.
            </p>
          </AnimatedSection>

          <AnimatedSection type="fadeInUp" delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                variant="primary"
                icon={<ShoppingCart className="h-4 w-4" />}
                href={product.buyLinks[0]?.url ?? "#"}
              >
                Check Price — {product.currency}
                {product.price.toLocaleString()}
              </Button>
              <Button
                variant="secondary"
                icon={<ArrowRight className="h-4 w-4" />}
                href={`/review/${product.slug}`}
              >
                Read Full Review
              </Button>
            </div>
          </AnimatedSection>
        </Container>
      </section>

      <div className="relative z-10">
        <Container>
          <SectionTitle
            title="Quick Verdict"
            subtitle="Our take in 30 seconds."
          />
          <AnimatedSection type="fadeInUp">
            <Card className="mx-auto max-w-3xl p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <Rating value={product.rating} size="lg" count={product.reviewCount} />
              </div>
              <p className="text-base leading-relaxed text-white/60">
                {product.verdict}
              </p>
            </Card>
          </AnimatedSection>
        </Container>

        <Container>
          <SectionTitle
            title="Buying Guide"
            subtitle="Step-by-step breakdown to help you decide."
          />
          <div className="mx-auto max-w-3xl space-y-8">
            {product.guide.sections.map((section, i) => (
              <AnimatedSection key={section.title} type="fadeInUp" delay={i * 0.1}>
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6c5ce7]/20 text-xs font-bold text-[#a29bfe]">
                      {i + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-white/80">
                      {section.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-white/50">
                    {section.content}
                  </p>
                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {section.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-3 text-sm text-white/40"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#a29bfe]/50" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>

        <Container>
          <SectionTitle
            title="Best Alternatives"
            subtitle="Other great options worth considering."
          />
          <StaggerContainer className="mx-auto grid max-w-3xl gap-4">
            {product.alternatives.map((alt) => (
              <StaggerItem key={alt.name}>
                <Card className="p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="text-base font-semibold text-white/80">
                          {alt.name}
                        </h3>
                        <Badge variant="outline" size="sm">
                          {product.currency}
                          {alt.price.toLocaleString()}
                        </Badge>
                      </div>
                      <p className="mb-2 text-sm text-white/40">
                        {alt.description}
                      </p>
                      <Rating value={alt.rating} size="sm" showCount={false} />
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      href={`/review/${alt.slug}`}
                    >
                      View Review
                    </Button>
                  </div>
                  {alt.pros && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {alt.pros.map((p) => (
                        <Badge key={p} variant="success" size="sm">
                          {p}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>

        <Container>
          <SectionTitle
            title="Recommended Accessories"
            subtitle="Complete your setup."
          />
          <StaggerContainer className="grid gap-4 sm:grid-cols-2">
            {product.accessories.map((acc) => (
              <StaggerItem key={acc.name}>
                <Card className="flex items-center gap-4 p-4 sm:p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06]">
                    <TabletSmartphone className="h-5 w-5 text-white/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white/70 truncate">
                      {acc.name}
                    </h4>
                    <p className="text-xs text-white/35 truncate">
                      {acc.description}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-white/50">
                    {product.currency}
                    {acc.price}
                  </span>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>

        <FAQ
          title="Still Have Questions?"
          subtitle="We've got answers."
          items={product.faq}
        />

        <CTA
          title="Ready to Make Your Decision?"
          description={`Read our full in-depth review of the ${product.product} with benchmarks, comparisons, and real user feedback.`}
          buttonText={`Read the Full Review`}
          buttonHref={`/review/${product.slug}`}
        />
      </div>
    </>
  )
}
