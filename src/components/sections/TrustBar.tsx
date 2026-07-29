"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react"
import { cn } from "@/lib/utils"
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer"

interface TrustBarProps {
  productName: string
}

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Apple Authorized",
    desc: "Genuine product guarantee",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "2-3 business days",
  },
  {
    icon: RotateCcw,
    title: "14-Day Returns",
    desc: "No questions asked",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Dedicated assistance",
  },
]

export default function TrustBar({ productName }: TrustBarProps) {
  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-black/[0.04] bg-black/[0.02] sm:grid-cols-4">
            {trustItems.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="flex h-full flex-col items-center gap-2 bg-white px-4 py-6 text-center transition-colors hover:bg-white/80">
                  <Icon className="h-5 w-5" style={{ color: "var(--color-accent-light)" }} />
                  <div>
                    <div className="text-xs font-semibold text-[#1a1a1e]/70">{item.title}</div>
                    <div className="text-[10px] leading-tight text-[#1a1a1e]/35">{item.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
