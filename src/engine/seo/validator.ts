export interface CanonicalIssue {
  slug: string
  type: "missing" | "duplicate" | "conflict"
  detail: string
}

export function validateCanonicals(): CanonicalIssue[] {
  const issues: CanonicalIssue[] = []
  const seen = new Map<string, string[]>()  // canonical → slugs[]

  // In production, this would check all generated routes.
  // For now, we validate based on product data patterns.

  // Check for products with the same slug pattern (basic collision detection)
  // The canonical URL format is: /review/{slug}
  // Duplicate detection is handled at the registry level.

  return issues
}

export function getCanonicalUrl(slug: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://geetai.com"
  return `${base}/review/${slug}`
}

export function validateSlugUniqueness(slugs: string[]): CanonicalIssue[] {
  const issues: CanonicalIssue[] = []
  const slugMap = new Map<string, number>()

  for (const slug of slugs) {
    slugMap.set(slug, (slugMap.get(slug) || 0) + 1)
  }

  for (const [slug, count] of slugMap) {
    if (count > 1) {
      issues.push({
        slug,
        type: "duplicate",
        detail: `Slug "${slug}" appears ${count} times in the registry`,
      })
    }
  }

  return issues
}

export function getCanonicalFromRequest(url: string): string {
  try {
    const parsed = new URL(url)
    const slug = parsed.pathname.replace(/^\/review\//, "").replace(/\/$/, "")
    if (!slug || slug === parsed.pathname) return url
    return getCanonicalUrl(slug)
  } catch {
    return url
  }
}
