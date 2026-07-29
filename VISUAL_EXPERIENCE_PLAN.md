# VISUAL EXPERIENCE PLAN

> Premium visual effects layered on the existing master template
> Research phase — no implementation yet

---

## Guiding Principles

1. **Zero modifications to existing architecture** — visual layer is additive
2. **Performance first** — lazy load, GPU accelerate, respect `prefers-reduced-motion`
3. **Progressive enhancement** — works without JS, better with it
4. **Ship for launch, postpone the rest**

---

## Feature Analysis

### 1. Interactive 3D Product Card

**What it does:** Card tilts toward cursor (max 20-35°), spring animation, glow follows pointer.

**Best free library:** **Atropos** (`npm i atropos`)
- GitHub: [nolimits4web/atropos](https://github.com/nolimits4web/atropos) — 2.8k ★
- React wrapper + Web Component + vanilla JS
- Touch support (gyroscope on mobile), 60fps GPU-accelerated
- Multi-layer parallax built-in
- MIT license
- **3.5KB gzipped**
- Production-ready — used in Swiper ecosystem

**Alternative:** **VanillaTilt.js** (smaller, simpler — 2KB)
- GitHub: [gijsroge/tilt.js](https://github.com/gijsroge/tilt.js)
- Zero dependencies, requestAnimationFrame
- Less configurable than Atropos
- Good if we only need basic tilt

**Recommendation:** Use **Atropos** for the product card on the review page hero. It has React support, multi-layer, and is already production-proven.

| Concern | Verdict |
|---------|---------|
| Performance | ✅ GPU transforms only, no layout thrashing |
| Mobile | ✅ Touch + gyroscope support built-in |
| Reduced motion | ✅ `prefers-reduced-motion` media query (add a CSS wrapper) |
| Lighthouse impact | ✅ ~3.5KB, loads only on interaction |
| Load strategy | ✅ Dynamic import (`next/dynamic` with `ssr: false`) |

### 2. Auto-Rotating Product Preview

**What it does:** Product slowly rotates (if 3D model) or crossfades between angles.

**Recommendation:** ❌ **Postpone for launch.**

**Why:** True 3D auto-rotation requires either:
- A 3D model file (GLTF/GLB) — none exist
- Three.js/WebGL — adds 100KB+ bundle
- CSS 3D transform animation — cheaper but fake-looking without actual 3D model

Instead, ship a **manual image carousel** (already in `ImageGallery.tsx`). Add auto-rotation post-launch if 3D assets become available.

Also possible: **CSS-only Ken Burns crossfade** between product angles (front → angle → back), which is simpler and looks premium. Worth considering but not for initial launch.

### 3. 3D / Parallax Product Images

**What it does:** Multiple image layers move at different speeds on mouse hover, creating depth.

**Library:** **Atropos** (same as #1) already supports multi-layer parallax with `data-atropos-offset` attributes.

**Implementation:** If the product image has a cutout (foreground product on separate layer from background), Atropos handles this automatically.

**Recommendation:** ✅ Ship with Atropos on launch. No extra library.

**Fallback:** Single-image products just get the tilt without parallax — still looks premium.

### 4. Scroll Storytelling (Apple-style)

**What it does:** Sections pin, images/videos transition as user scrolls, progressive reveals.

**We already have:**
- **Framer Motion** — `useScroll`, `useTransform`, `motion.div` with scroll-driven animations
- **GSAP** — `ScrollTrigger` for more complex timelines
- **Lenis** — smooth scrolling already installed (`@studio-freight/lenis`)

**CSS-only approach (2026+):** `view-timeline` and `scroll-timeline` are now first-class CSS. Production-ready in Chrome, Safari, partially in Firefox. Progressive enhancement via `@supports`.

**Recommendation:** ⚠️ **Postpone complex scroll storytelling for post-launch.** Our existing GSAP + Framer Motion setup is sufficient. Apple-style pinned sections with video transitions requires significant content assets (short video clips per product) that don't exist yet.

**Do now:** Add simple `fadeInUp` on scroll for section reveals using the existing `framer-motion` animation engine (`src/engine/animation/` has all the presets — `fadeInUp`, `staggerContainer`, `staggerItem`). This costs nothing and improves perceived polish immediately.

### 5. Motion Image Experience

**What it does:** Subtle looping motion on static images — gentle zoom, Ken Burns, animated gradients, subtle parallax movement.

| Technique | Complexity | Library | Launch-ready? |
|-----------|-----------|---------|---------------|
| **Ken Burns (slow zoom)** | Trivial | Pure CSS (`@keyframes scale`) | ✅ Yes |
| **Animated gradient overlay** | Trivial | Pure CSS | ✅ Yes |
| **Image-to-video background** | Medium | FFmpeg pipeline (server-side) | ❌ Postpone |
| **Subtle looping motion** | Medium | CSS or Lottie | ⚠️ Requires assets |

**Recommendation:** ✅ Ship **Ken Burns + gradient overlay** on hero images using pure CSS. Zero JS cost, works on all browsers, respects reduced motion.

```css
.hero-image-kenburns {
  animation: kenburns 20s ease-in-out infinite alternate;
  transform-origin: center;
}

@keyframes kenburns {
  0% { transform: scale(1) translate(0, 0); }
  100% { transform: scale(1.1) translate(-2%, -1%); }
}

@media (prefers-reduced-motion: reduce) {
  .hero-image-kenburns { animation: none; }
}
```

**Image sequence** (spritesheet → JS-driven animation): ⚠️ Interesting for product demos but requires product-specific assets. Postpone.

### 6. Product Hero Experience

**What it does:** Hero section with short looping video (MP4/WebM) instead of static image.

**Recommendation:** ❌ **Postpone for launch.**

**Why:**
- Requires per-product video assets (10-15s MP4/WebM loops) — none exist
- Video increases page weight significantly even with lazy loading
- Static image + Ken Burns + particle background (already in `CoverSection`) is already premium
- Can add later via `AuroraBackground` or particle field component

**Graceful fallback exists:** The `CoverSection` component already supports `mode="product"` with image + particle effects. If video is added later, it degrades to the current experience.

### 7. Performance Impact Summary

| Enhancement | Bundle Cost | Layout Impact | Lighthouse | Mobile | Launch? |
|-------------|-------------|---------------|------------|--------|---------|
| Atropos 3D tilt | 3.5KB gzip | None (GPU) | Minimal | ✅ Touch | ✅ YES |
| Ken Burns CSS | 0KB | None (GPU composite) | Zero | ✅ | ✅ YES |
| Gradient overlays | 0KB | None | Zero | ✅ | ✅ YES |
| Section reveal animations | 0KB extra (already have Framer) | None | Minimal | ⚠️ Test | ✅ YES |
| Scroll storytelling | 0KB extra (GSAP exists) | Minimal | Minimal | ⚠️ | ❌ NO |
| Auto-rotation / 3D model | 100KB+ (Three.js) | Heavy | ⚠️ Warning | ⚠️ | ❌ NO |
| Video hero | 500KB+ per video | Heavy | ⚠️ LCP impact | ❌ | ❌ NO |
| Looping motion images | Depends on assets | None | Minimal | ✅ | ⚠️ Future |

---

## Launch Recommendation: Ship 3 Enhancements, Postpone 4

### ✅ SHIP NOW

| # | Enhancement | How | Priority |
|---|-------------|-----|----------|
| 1 | **3D tilt on product cards** | Atropos + React wrapper on `ReviewPage` product hero card | P1 |
| 2 | **Ken Burns slow zoom** | Pure CSS on hero product images (`.hero-image-kenburns`) | P1 |
| 3 | **Section reveal animations** | Use existing Framer Motion `fadeInUp` from animation engine | P2 |

### ⚠️ POST-LAUNCH (Future)

| # | Enhancement | Why Wait |
|---|-------------|----------|
| 4 | Scroll storytelling | Requires per-product video assets + significant testing |
| 5 | Auto-rotating 3D preview | Requires 3D models + Three.js integration |
| 6 | Video hero backgrounds | Assets don't exist, LCP concern |
| 7 | Image-to-video / looping motion | Requires content pipeline |

---

## Atropos Integration Plan (if approved)

```
npm install atropos
```

**New file:** `src/components/ui/ProductTiltCard.tsx`
```tsx
"use client"
import { useEffect, useRef } from "react"
import Atropos from "atropos/atropos-react"
// or use vanilla: new Atropos(element)

export function ProductTiltCard({ children, className }) {
  return (
    <div className={cn("atropos", className)}>
      <div className="atropos-scale">
        <div className="atropos-rotate">
          <div className="atropos-inner">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Wrap in `CoverSection` or `ProductPageTemplate`** — component already exists, just wrap the hero image area.

**No changes to existing engines.** Pure additive component.
