"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  opacity: number
  speedX: number
  speedY: number
  life: number
  maxLife: number
}

function getAccentRgb(): string {
  if (typeof document === "undefined") return "162,155,254"
  const el = document.querySelector(".product-theme")
  if (!el) return "162,155,254"
  const color = getComputedStyle(el).getPropertyValue("--color-accent").trim()
  if (!color) return "162,155,254"
  const hex = color.replace("#", "")
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  if (isNaN(r) || isNaN(g) || isNaN(b)) return "162,155,254"
  return `${r},${g},${b}`
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    const particles: Particle[] = []

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)

    function createParticle(): Particle {
      return {
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3 - 0.1,
        life: 0,
        maxLife: Math.random() * 300 + 200,
      }
    }

    const particleCount = Math.min(
      Math.floor((window.innerWidth * window.innerHeight) / 12000),
      80
    )

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle())
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const rgb = getAccentRgb()

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.speedX
        p.y += p.speedY
        p.life++

        if (p.life > p.maxLife) {
          particles[i] = createParticle()
          continue
        }

        const fadeRatio = Math.min(p.life / 50, 1)
        const currentOpacity = p.opacity * fadeRatio

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rgb}, ${currentOpacity})`
        ctx.fill()
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(${rgb}, ${0.06 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10"
    />
  )
}
