import type { Product } from "@/engine/product/types"

export function productSchema(product: Product, baseUrl = "https://geetai.com") {
  const url = `${baseUrl}/review/${product.slug}`
  const image = product.images[0]?.src ?? ""

  return {
    "@context": "https://schema.org",
    "@graph": [
      productSchemaOrg(product, url, image),
      reviewSchema(product, url),
      offerSchema(product),
      aggregateRatingSchema(product),
      faqSchema(product),
      breadcrumbSchema(product, baseUrl),
      organizationSchema(baseUrl),
      websiteSchema(baseUrl),
    ],
  }
}

function productSchemaOrg(product: Product, url: string, image: string) {
  return {
    "@type": "Product",
    "@id": url,
    name: product.product,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand },
    image,
    url,
    category: product.category,
    sku: product.slug,
    ...(product.rating && {
      aggregateRating: { "@id": `${url}#aggregateRating` },
    }),
    ...(product.buyLinks.length && {
      offers: product.buyLinks.map((_, i) => ({
        "@id": `${url}#offer-${i}`,
      })),
    }),
    ...(product.reviews.length && {
      review: product.reviews.map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.name },
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
          bestRating: 5,
        },
        reviewBody: r.content,
        datePublished: r.date,
      })),
    }),
  }
}

function reviewSchema(product: Product, url: string) {
  return {
    "@type": "Review",
    "@id": `${url}#review`,
    itemReviewed: { "@id": url },
    author: {
      "@type": "Organization",
      name: "GeetAI Reviews",
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: product.rating,
      bestRating: 5,
      worstRating: 1,
    },
  }
}

function offerSchema(product: Product) {
  return product.buyLinks.map((link, i) => ({
    "@type": "Offer",
    "@id": `#offer-${i}`,
    url: link.url,
    price: link.price,
    priceCurrency: link.currency,
    availability: link.available
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    seller: { "@type": "Organization", name: link.store },
    ...(product.originalPrice && {
      priceValidUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    }),
  }))
}

function aggregateRatingSchema(product: Product) {
  return {
    "@type": "AggregateRating",
    "@id": `#aggregateRating`,
    ratingValue: product.rating,
    reviewCount: product.reviewCount,
    bestRating: 5,
    worstRating: 1,
    itemReviewed: { "@id": `#product` },
  }
}

function faqSchema(product: Product) {
  return {
    "@type": "FAQPage",
    "@id": "#faq",
    mainEntity: product.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

function breadcrumbSchema(product: Product, baseUrl: string) {
  return {
    "@type": "BreadcrumbList",
    "@id": "#breadcrumb",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category,
        item: `${baseUrl}/${product.category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.product,
        item: `${baseUrl}/review/${product.slug}`,
      },
    ],
  }
}

function organizationSchema(baseUrl: string) {
  return {
    "@type": "Organization",
    "@id": `${baseUrl}#organization`,
    name: "GeetAI",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
  }
}

function websiteSchema(baseUrl: string) {
  return {
    "@type": "WebSite",
    "@id": `${baseUrl}#website`,
    url: baseUrl,
    name: "GeetAI Reviews",
    description: "Premium product reviews and buying guides.",
    publisher: { "@id": `${baseUrl}#organization` },
  }
}
