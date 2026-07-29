import Container from "@/components/ui/Container"

const footerNav = [
  {
    label: "Product",
    links: [
      { text: "Reviews", href: "/" },
      { text: "Buying Guides", href: "/" },
      { text: "Comparisons", href: "/" },
      { text: "Categories", href: "/" },
    ],
  },
  {
    label: "Company",
    links: [
      { text: "About", href: "/" },
      { text: "Blog", href: "/" },
      { text: "Contact", href: "/" },
      { text: "Privacy", href: "/" },
    ],
  },
  {
    label: "Support",
    links: [
      { text: "FAQ", href: "/" },
      { text: "Terms", href: "/" },
      { text: "Affiliates", href: "/" },
      { text: "Sitemap", href: "/" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-black/[0.04]">
      <Container as="div" className="py-12 sm:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-light)]" />
              <span className="text-sm font-semibold text-[#1a1a1e]/70">
                GeetAI
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[#1a1a1e]/40">
              Premium product reviews and buying guides powered by expert
              analysis and real user feedback.
            </p>
          </div>
          {footerNav.map((group) => (
            <div key={group.label}>
              <h4 className="mb-3 text-xs font-semibold tracking-widest uppercase text-[#1a1a1e]/40">
                {group.label}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.text}>
                    <a
                      href={link.href}
                      className="text-sm text-[#1a1a1e]/40 transition-colors hover:text-[#1a1a1e]/70"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-black/[0.04] pt-6 text-center text-xs text-[#1a1a1e]/25">
          &copy; {new Date().getFullYear()} GeetAI. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}
