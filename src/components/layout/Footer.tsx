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
    <footer className="border-t border-white/[0.04]">
      <Container as="div" className="py-12 sm:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-gradient-to-br from-[#6c5ce7] to-[#a29bfe]" />
              <span className="text-sm font-semibold text-white/70">
                GeetAI
              </span>
            </div>
            <p className="text-sm leading-relaxed text-white/30">
              Premium product reviews and buying guides powered by expert
              analysis and real user feedback.
            </p>
          </div>
          {footerNav.map((group) => (
            <div key={group.label}>
              <h4 className="mb-3 text-xs font-semibold tracking-widest uppercase text-white/40">
                {group.label}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.text}>
                    <a
                      href={link.href}
                      className="text-sm text-white/30 transition-colors hover:text-white/60"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-white/[0.04] pt-6 text-center text-xs text-white/20">
          &copy; {new Date().getFullYear()} GeetAI. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}
